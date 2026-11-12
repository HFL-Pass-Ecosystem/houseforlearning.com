// Who is calling? Reads the secure session cookie set by /api/auth and asks Supabase Auth.
// Refreshes an expired session automatically. Shared by the LMS function.
const COOKIE = 'hfl_session';
const MAX_AGE = 60 * 60 * 24 * 30;

export const cfg = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};

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

// Returns { id, email, newCookie? } or null when nobody is logged in.
export async function whoIs(req) {
  const c = cfg();
  const s = readCookie(req);
  if (!c || !s) return null;
  let u = await gotrue(c, 'user', null, s.a);
  if (u.status === 200) return { id: u.data.id, email: u.data.email };
  if (!s.r) return null;
  const t = await gotrue(c, 'token?grant_type=refresh_token', { refresh_token: s.r });
  if (t.status !== 200) return null;
  u = await gotrue(c, 'user', null, t.data.access_token);
  if (u.status !== 200) return null;
  return { id: u.data.id, email: u.data.email, newCookie: `${COOKIE}=${pack(t.data)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax` };
}

export function withSession(res, who) {
  if (who && who.newCookie) res.headers.append('Set-Cookie', who.newCookie);
  return res;
}
