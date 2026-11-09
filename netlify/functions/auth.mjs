// POST /api/auth: member Log In, Sign up, the emailed code and its one-tap link, Log out, "who am I" and password reset, using Supabase Auth.
// The browser never sees the keys or the tokens: the session lives in a secure cookie that scripts cannot read.
// Settings (Netlify environment variables): SUPABASE_URL, SUPABASE_ANON_KEY (the public "anon" key), SITE_ORIGIN (optional).
import { ok, fail, text, isEmail, readBody } from './_lib.mjs';

const COOKIE = 'hfl_session';
const MAX_AGE = 60 * 60 * 24 * 30;

const cfg = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};

const cookie = (value, age) =>
  `${COOKIE}=${value}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Lax`;

const readCookie = (req) => {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  if (!m) return null;
  try { return JSON.parse(Buffer.from(m[1], 'base64url').toString()); } catch { return null; }
};

const pack = (s) => Buffer.from(JSON.stringify({ a: s.access_token, r: s.refresh_token })).toString('base64url');

async function gotrue(c, path, body, token) {
  const r = await fetch(`${c.url}/auth/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { apikey: c.key, Authorization: `Bearer ${token || c.key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try { data = await r.json(); } catch { /* empty body */ }
  return { status: r.status, data };
}

// hfl_in is only a yes/no flag so pages can show "My page" and "Log out"; it holds no token and cannot sign anyone in.
const withCookie = (res, value, age) => {
  res.headers.append('Set-Cookie', cookie(value, age));
  res.headers.append('Set-Cookie', `hfl_in=${age > 0 ? '1' : ''}; Path=/; Max-Age=${age}; Secure; SameSite=Lax`);
  return res;
};

// hfl_asked marks the browser that asked for a code, for 15 minutes. Only there does the one-tap link in the email sign in by
// itself; anywhere else the page asks for one press first, so a mail scanner that opens links cannot use the code up.
const ASKED = 'hfl_asked';
const ASKED_AGE = 15 * 60;
const askedHere = (req) => new RegExp(`(?:^|; )${ASKED}=1(?:;|$)`).test(req.headers.get('cookie') || '');
const markAsked = (res, age) => {
  res.headers.append('Set-Cookie', `${ASKED}=${age > 0 ? '1' : ''}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Lax`);
  return res;
};

async function profile(c, token) {
  const u = await gotrue(c, 'user', null, token);
  if (u.status !== 200) return null;
  let row = {};
  const r = await fetch(`${c.url}/rest/v1/members?id=eq.${u.data.id}&select=full_name,plan,created_at`, {
    headers: { apikey: c.key, Authorization: `Bearer ${token}` },
  });
  if (r.ok) row = (await r.json())[0] || {};
  return { email: u.data.email, name: row.full_name || '', plan: row.plan || 'free', since: row.created_at || u.data.created_at };
}

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({});
  const c = cfg();
  if (!c) return fail(503, 'Members area is not switched on yet');
  const action = text(body.action, 20);
  const email = text(body.email, 200).toLowerCase();
  const password = typeof body.password === 'string' ? body.password.slice(0, 200) : '';

  if (action === 'signup') {
    const name = text(body.name, 120);
    if (!isEmail(email)) return fail(400, 'Please check the email address');
    if (password.length < 10) return fail(400, 'Please choose a password of at least 10 characters');
    const r = await gotrue(c, 'signup', { email, password, data: { full_name: name } });
    if (r.status >= 500) return fail(502, 'Please try again in a moment');
    // Same answer whether or not the address already exists, so nobody can probe for members.
    return markAsked(ok({ message: 'Thank you. If this address can be used, we have sent a message to confirm it. Open it, then log in.' }), ASKED_AGE);
  }

  // Which one-tap options are switched on (Netlify variable AUTH_PROVIDERS, for example "google,azure,email").
  const enabled = (process.env.AUTH_PROVIDERS || 'email').split(',').map((v) => v.trim()).filter(Boolean);
  const origin = req.headers.get('origin') || process.env.SITE_ORIGIN || '';
  // Google, Microsoft and any email link come back to this page on the same device only. There is deliberately no
  // hand-over to a screen waiting on another device: anyone can start a sign-in with someone else's email, so a hand-over
  // would let them receive that person's sign-in when the person taps the link (owner's rule of 9 Nov: the code is typed
  // on the screen that asked for it).
  const back = `${origin}/auth-callback.html`;

  if (action === 'config') return ok({ providers: enabled });

  if (action === 'oauth') {
    const p = text(body.provider, 20);
    if (!['google', 'azure'].includes(p) || !enabled.includes(p) || !origin) return fail(400, 'Not available');
    return ok({ url: `${c.url}/auth/v1/authorize?provider=${p}&redirect_to=${encodeURIComponent(back)}` });
  }

  if (action === 'magic') {
    if (!enabled.includes('email')) return fail(400, 'Not available');
    if (isEmail(email) && origin) {
      await fetch(`${c.url}/auth/v1/otp?redirect_to=${encodeURIComponent(back)}`, {
        method: 'POST',
        headers: { apikey: c.key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, create_user: true, data: { full_name: text(body.name, 120) } }),
      }).catch(() => {});
    }
    return markAsked(ok({ message: 'If this address can be used, we have sent a 6-digit code to it. Type the code on this page.' }), ASKED_AGE);
  }

  // The 6-digit code from the email, typed or pasted on the screen that asked for it.
  if (action === 'verify') {
    const code = text(body.code, 12).replace(/\s/g, '');
    if (!isEmail(email) || !/^\d{6,10}$/.test(code)) return fail(400, 'Please check the email and the code');
    let r = await gotrue(c, 'verify', { type: 'email', email, token: code });
    if (r.status !== 200 || !r.data.access_token) r = await gotrue(c, 'verify', { type: 'signup', email, token: code });
    if (r.status !== 200 || !r.data.access_token) return fail(401, 'That code did not work or has expired. Please ask for a new one.');
    return markAsked(withCookie(ok({ ok: true }), pack(r.data), MAX_AGE), 0);
  }

  // The one-tap link under the code in the email (owner's rule of 8 Nov: no code typed by hand). It signs in only the browser
  // that opens it. With auto set, it goes ahead only in the browser that asked for the code; anywhere else the answer is
  // { ask: true }, the page asks for one press, and the code is not used up.
  if (action === 'confirm') {
    const th = text(body.token_hash, 200);
    if (!/^[A-Za-z0-9_-]{10,200}$/.test(th)) return fail(400, 'This link did not work. Please ask for a new code.');
    if (body.auto === true && !askedHere(req)) return ok({ ask: true });
    let r = await gotrue(c, 'verify', { type: 'email', token_hash: th });
    if (r.status !== 200 || !r.data.access_token) r = await gotrue(c, 'verify', { type: 'magiclink', token_hash: th });
    if (r.status !== 200 || !r.data.access_token) r = await gotrue(c, 'verify', { type: 'signup', token_hash: th });
    if (r.status !== 200 || !r.data.access_token) return fail(401, 'This link has been used or has expired. Please ask for a new code.');
    return markAsked(withCookie(ok({ ok: true }), pack(r.data), MAX_AGE), 0);
  }

  // The page hands over the tokens that came back from Google, Microsoft or an email link.
  if (action === 'session') {
    const a = typeof body.access_token === 'string' ? body.access_token.slice(0, 4000) : '';
    const r = typeof body.refresh_token === 'string' ? body.refresh_token.slice(0, 500) : '';
    const u = a ? await gotrue(c, 'user', null, a) : { status: 0 };
    if (u.status !== 200) return fail(401, 'That link has expired. Please try again.');
    return withCookie(ok({ ok: true }), pack({ access_token: a, refresh_token: r }), MAX_AGE);
  }

  if (action === 'login') {
    if (!isEmail(email) || !password) return fail(400, 'Please enter your email and password');
    const r = await gotrue(c, 'token?grant_type=password', { email, password });
    if (r.status !== 200) return fail(401, 'Email or password not right, or the email is not confirmed yet');
    return withCookie(ok({ ok: true }), pack(r.data), MAX_AGE);
  }

  if (action === 'logout') {
    const s = readCookie(req);
    if (s) await gotrue(c, 'logout', {}, s.a).catch(() => {});
    return withCookie(ok({ ok: true }), '', 0);
  }

  if (action === 'reset') {
    if (isEmail(email)) await gotrue(c, 'recover', { email }).catch(() => {});
    return ok({ message: 'If this address is a member, we have sent a message with the next step.' });
  }

  if (action === 'me') {
    const s = readCookie(req);
    if (!s) return fail(401, 'Not logged in');
    let p = await profile(c, s.a);
    if (!p && s.r) {
      const t = await gotrue(c, 'token?grant_type=refresh_token', { refresh_token: s.r });
      if (t.status === 200) {
        p = await profile(c, t.data.access_token);
        if (p) return withCookie(ok(p), pack(t.data), MAX_AGE);
      }
    }
    if (!p) return withCookie(fail(401, 'Not logged in'), '', 0);
    return ok(p);
  }

  return fail(400, 'Bad request');
};
