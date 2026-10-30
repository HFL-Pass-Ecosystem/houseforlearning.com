// Shared helpers for the House for Learning functions (the "middleware").
// They check what a visitor sent, save it in Supabase, and optionally email the team.
// Settings come from Netlify environment variables:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY  (required to save anything)
//   RESEND_API_KEY, NOTIFY_TO, NOTIFY_FROM  (optional: email the team about each new message)
// If the database is not set up yet, the functions answer 503 and the pages fall back to email.

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export const ok = (body) => json(200, body);
export const fail = (status, error) => json(status, { error });

export function ref(prefix) {
  const d = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const r = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${d}-${r}`;
}

export function text(v, max) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

export const isEmail = (v) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(v);

// Read a JSON body sent by our own pages; refuse anything else.
export async function readBody(req) {
  if (req.method !== 'POST') return { error: [405, 'Use POST'] };
  const site = process.env.SITE_ORIGIN;
  const origin = req.headers.get('origin');
  if (site && origin && origin !== site) return { error: [403, 'Wrong origin'] };
  const len = Number(req.headers.get('content-length') || 0);
  if (len > 20000) return { error: [413, 'Too long'] };
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') return { error: [400, 'Bad request'] };
    // hidden "website" field: people never fill it in, spam robots do
    if (body.website) return { spam: true };
    return { body };
  } catch {
    return { error: [400, 'Bad request'] };
  }
}

export async function save(table, row) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return { status: 503 };
  const r = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${table}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  });
  return { status: r.ok ? 200 : 502 };
}

export async function notify(subject, lines) {
  const key = process.env.RESEND_API_KEY, to = process.env.NOTIFY_TO;
  if (!key || !to) return;
  const from = process.env.NOTIFY_FROM || 'House for Learning <onboarding@resend.dev>';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: to.split(',').map((s) => s.trim()), subject, text: lines.join('\n') }),
    });
  } catch { /* the message is already saved; a failed email must not lose it */ }
}
