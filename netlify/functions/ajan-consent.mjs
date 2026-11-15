// POST /api/ajan-consent: keeps the Ajan SNS welcome-page consent (time, version, both tick boxes, chosen interests).
// The first save is made when the person presses Continue on the consent step; the second (interests) updates nothing
// old: it adds a new row, so every choice stays as a dated record. Signed-in members also get their email stored.
import { ok, fail, ref, text, readBody, save } from './_lib.mjs';

const VERSION = '2026-11-15-d1';
const INTERESTS = ['workers', 'api', 'build', 'chat'];

async function memberEmail(req) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  const m = (req.headers.get('cookie') || '').match(/(?:^|; )hfl_session=([^;]+)/);
  if (!url || !key || !m) return null;
  try {
    const s = JSON.parse(Buffer.from(m[1], 'base64url').toString());
    const r = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${s.a}` } });
    if (r.status !== 200) return null;
    const u = await r.json();
    return u && u.email ? u.email : null;
  } catch { return null; }
}

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({ ref: ref('AJC') });
  const client = text(body.client, 64);
  if (!/^[a-f0-9]{32}$/.test(client)) return fail(400, 'Bad request');
  if (body.adult_professional !== true) return fail(400, 'Please tick the required box');
  const interests = Array.isArray(body.interests) ? [...new Set(body.interests.filter((x) => INTERESTS.includes(x)))] : [];
  const row = {
    client_id: client,
    email: await memberEmail(req),
    terms_version: VERSION,
    adult_professional: true,
    marketing_opt_in: body.marketing_opt_in === true,
    interests,
    skipped_interests: body.skipped_interests === true,
    user_agent: text(req.headers.get('user-agent'), 300),
  };
  const s = await save('ajan_consent', row);
  if (s.status !== 200) return fail(s.status, 'Not saved');
  return ok({ ref: ref('AJC'), version: VERSION });
};
