// POST /api/passkey: sign in with Face ID, Touch ID, a fingerprint or the device PIN (passkeys / WebAuthn).
// Supabase Auth has no passkeys, so this function does the check itself and then asks Supabase for an ordinary session.
// The server keeps only the PUBLIC key of each passkey (table public.passkeys, supabase/passkeys.sql). The private key never
// leaves the person's device. No library: the check uses Node's own crypto.
// Settings (Netlify environment variables): SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY (already used by the other
// functions). Optional PASSKEY_SECRET signs the one-time challenge; without it a key is derived from SUPABASE_SERVICE_KEY.
import crypto from 'node:crypto';
import { ok, fail, text, readBody } from './_lib.mjs';

const COOKIE = 'hfl_session';
const CHALLENGE = 'hfl_pk';
const MAX_AGE = 60 * 60 * 24 * 30;

const b64 = (buf) => Buffer.from(buf).toString('base64url');
const unb64 = (s) => Buffer.from(String(s || ''), 'base64url');

const cfg = () => {
  const url = process.env.SUPABASE_URL, anon = process.env.SUPABASE_ANON_KEY, svc = process.env.SUPABASE_SERVICE_KEY;
  return url && anon && svc ? { url: url.replace(/\/$/, ''), anon, svc } : null;
};
const secret = (c) => process.env.PASSKEY_SECRET || `pk:${c.svc}`;
const sign = (c, v) => crypto.createHmac('sha256', secret(c)).update(v).digest('base64url');

// ---- the one-time challenge lives in a signed, short-lived, HttpOnly cookie ------------------------------------------------
function setChallenge(c, res, data) {
  const v = b64(JSON.stringify({ ...data, exp: Date.now() + 5 * 60 * 1000 }));
  res.headers.append('Set-Cookie', `${CHALLENGE}=${v}.${sign(c, v)}; Path=/; Max-Age=300; HttpOnly; Secure; SameSite=Strict`);
  return res;
}
function takeChallenge(c, req, purpose) {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|; )${CHALLENGE}=([^;]+)`));
  if (!m) return null;
  const [v, mac] = m[1].split('.');
  if (!v || !mac) return null;
  const want = Buffer.from(sign(c, v)), got = Buffer.from(mac);
  if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return null;
  try {
    const d = JSON.parse(unb64(v).toString());
    return d.exp > Date.now() && d.p === purpose ? d : null;
  } catch { return null; }
}
const clearChallenge = (res) => { res.headers.append('Set-Cookie', `${CHALLENGE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`); return res; };

// ---- Supabase ----------------------------------------------------------------------------------------------------------------
async function auth(c, path, body, key, token) {
  const r = await fetch(`${c.url}/auth/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { apikey: key, Authorization: `Bearer ${token || key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try { data = await r.json(); } catch { /* empty body */ }
  return { status: r.status, data };
}
async function table(c, method, query, body) {
  const r = await fetch(`${c.url}/rest/v1/passkeys${query}`, {
    method,
    headers: { apikey: c.svc, Authorization: `Bearer ${c.svc}`, 'Content-Type': 'application/json',
      Prefer: method === 'POST' ? 'return=minimal' : 'return=representation' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await r.json(); } catch { /* empty body */ }
  return { status: r.status, data };
}
async function who(c, req) {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  if (!m) return null;
  let s; try { s = JSON.parse(unb64(m[1]).toString()); } catch { return null; }
  const u = await auth(c, 'user', null, c.anon, s.a);
  return u.status === 200 && u.data.id && u.data.email ? { id: u.data.id, email: u.data.email.toLowerCase() } : null;
}
const pack = (s) => b64(JSON.stringify({ a: s.access_token, r: s.refresh_token }));
const withCookie = (res, value) => {
  res.headers.append('Set-Cookie', `${COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`);
  res.headers.append('Set-Cookie', `hfl_in=1; Path=/; Max-Age=${MAX_AGE}; Secure; SameSite=Lax`);
  return res;
};

// ---- WebAuthn parts ----------------------------------------------------------------------------------------------------------
// A small CBOR reader: enough for the attestation object and the COSE public key (maps, arrays, ints, byte/text strings).
function cbor(buf, o = { i: 0 }) {
  const b = buf[o.i++], mt = b >> 5; let n = b & 31;
  if (n === 24) n = buf[o.i++]; else if (n === 25) { n = buf.readUInt16BE(o.i); o.i += 2; }
  else if (n === 26) { n = buf.readUInt32BE(o.i); o.i += 4; } else if (n > 26) throw new Error('cbor');
  if (mt === 0) return n;
  if (mt === 1) return -1 - n;
  if (mt === 2) { const v = buf.subarray(o.i, o.i + n); o.i += n; return v; }
  if (mt === 3) { const v = buf.subarray(o.i, o.i + n).toString(); o.i += n; return v; }
  if (mt === 4) { const a = []; for (let k = 0; k < n; k++) a.push(cbor(buf, o)); return a; }
  if (mt === 5) { const m = new Map(); for (let k = 0; k < n; k++) { const key = cbor(buf, o); m.set(key, cbor(buf, o)); } return m; }
  throw new Error('cbor');
}
const sha = (v) => crypto.createHash('sha256').update(v).digest();

function hostOf(req) {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host).split(',')[0].trim();
  return { rpId: host.split(':')[0], origin: `https://${host}`, local: /^localhost(:\d+)?$/.test(host) };
}
function checkClient(req, d, type, challenge) {
  const h = hostOf(req);
  const cd = JSON.parse(d.toString());
  const origin = h.local ? `http://${(req.headers.get('host') || '')}` : h.origin;
  if (cd.type !== type || cd.challenge !== challenge || cd.origin !== origin) throw new Error('client data');
  return h;
}

function coseToJwk(cose) {
  const kty = cose.get(1), alg = cose.get(3);
  if (kty === 2 && alg === -7) {
    return { kty: 'EC', crv: 'P-256', x: b64(cose.get(-2)), y: b64(cose.get(-3)), alg: 'ES256' };
  }
  if (kty === 3 && alg === -257) return { kty: 'RSA', n: b64(cose.get(-1)), e: b64(cose.get(-2)), alg: 'RS256' };
  throw new Error('key type');
}
function verifySig(jwk, data, sig) {
  const key = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  return jwk.kty === 'EC' ? crypto.verify('sha256', data, key, sig) : crypto.verify('RSA-SHA256', data, key, sig);
}

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({});
  const c = cfg();
  if (!c) return fail(503, 'Not available');
  const action = text(body.action, 20);
  const h = hostOf(req);

  try {
    // ---- add a passkey (the person is already signed in) ---------------------------------------------------------------
    if (action === 'reg-options') {
      const me = await who(c, req);
      if (!me) return fail(401, 'Please log in first');
      const mine = await table(c, 'GET', `?user_id=eq.${encodeURIComponent(me.id)}&select=id`);
      const challenge = b64(crypto.randomBytes(32));
      const res = ok({
        challenge, rp: { id: h.rpId, name: 'House for Learning' },
        user: { id: b64(sha(`hfl:${me.id}`)), name: me.email, displayName: me.email },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
        authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
        attestation: 'none', timeout: 120000,
        excludeCredentials: (mine.data || []).map((k) => ({ type: 'public-key', id: k.id })),
      });
      return setChallenge(c, res, { p: 'reg', ch: challenge, u: me.id });
    }
    if (action === 'reg-verify') {
      const me = await who(c, req);
      const st = takeChallenge(c, req, 'reg');
      if (!me || !st || st.u !== me.id) return fail(401, 'Please try again');
      const cd = unb64(body.clientDataJSON);
      checkClient(req, cd, 'webauthn.create', st.ch);
      const att = cbor(unb64(body.attestationObject));
      const ad = att.get('authData');
      if (!ad.subarray(0, 32).equals(sha(h.rpId))) throw new Error('rp');
      const flags = ad[32];
      if (!(flags & 1) || !(flags & 4) || !(flags & 64)) throw new Error('flags'); // present, verified, has credential
      const idLen = ad.readUInt16BE(53);
      const id = ad.subarray(55, 55 + idLen);
      const jwk = coseToJwk(cbor(ad.subarray(55 + idLen)));
      const label = text(body.label, 60) || 'My device';
      const saved = await table(c, 'POST', '', { id: b64(id), user_id: me.id, email: me.email, public_key: JSON.stringify(jwk), counter: ad.readUInt32BE(33), label });
      if (saved.status >= 300) return fail(502, 'Could not save. Please try again.');
      return clearChallenge(ok({ ok: true }));
    }
    if (action === 'list') {
      const me = await who(c, req);
      if (!me) return fail(401, 'Please log in first');
      const r = await table(c, 'GET', `?user_id=eq.${encodeURIComponent(me.id)}&select=id,label,created_at,last_used&order=created_at`);
      return ok({ keys: r.data || [] });
    }
    if (action === 'remove') {
      const me = await who(c, req);
      if (!me) return fail(401, 'Please log in first');
      await table(c, 'DELETE', `?id=eq.${encodeURIComponent(text(body.id, 400))}&user_id=eq.${encodeURIComponent(me.id)}`);
      return ok({ ok: true });
    }

    // ---- sign in -------------------------------------------------------------------------------------------------------
    if (action === 'auth-options') {
      const challenge = b64(crypto.randomBytes(32));
      return setChallenge(c, ok({ challenge, rpId: h.rpId, userVerification: 'required', timeout: 120000 }), { p: 'auth', ch: challenge });
    }
    if (action === 'auth-verify') {
      const st = takeChallenge(c, req, 'auth');
      if (!st) return fail(401, 'Please try again');
      const cdBuf = unb64(body.clientDataJSON);
      checkClient(req, cdBuf, 'webauthn.get', st.ch);
      const found = await table(c, 'GET', `?id=eq.${encodeURIComponent(text(body.id, 400))}&select=*`);
      const key = found.data && found.data[0];
      if (!key) return fail(401, 'That passkey is not known here. Use your email and password.');
      const ad = unb64(body.authenticatorData);
      if (!ad.subarray(0, 32).equals(sha(h.rpId))) throw new Error('rp');
      if (!(ad[32] & 1) || !(ad[32] & 4)) throw new Error('flags');
      if (!verifySig(JSON.parse(key.public_key), Buffer.concat([ad, sha(cdBuf)]), unb64(body.signature))) throw new Error('signature');
      const counter = ad.readUInt32BE(33);
      if (counter !== 0 && counter <= Number(key.counter)) throw new Error('counter'); // a copied passkey
      // The check passed: ask Supabase for an ordinary session for this member (no password involved).
      const link = await auth(c, 'admin/generate_link', { type: 'magiclink', email: key.email }, c.svc);
      const hashed = link.data.hashed_token || (link.data.properties && link.data.properties.hashed_token);
      if (!hashed) return fail(502, 'Please try again in a moment');
      const s = await auth(c, 'verify', { type: 'magiclink', token_hash: hashed }, c.anon);
      if (s.status !== 200 || !s.data.access_token) return fail(502, 'Please try again in a moment');
      await table(c, 'PATCH', `?id=eq.${encodeURIComponent(key.id)}`, { counter, last_used: new Date().toISOString() });
      return clearChallenge(withCookie(ok({ ok: true }), pack(s.data)));
    }
  } catch {
    return fail(401, 'That did not work. Please try again, or use your email and password.');
  }
  return fail(400, 'Bad request');
};
