// POST /api/forms: the four working forms on the inside pages (talent intake, course feedback, workshop sheet, finance exercise).
// Signed-in members only. Entries are kept in the messages table with a "Form:" topic, so no new table is needed.
import { ok, fail, ref, text, readBody, save, notify } from './_lib.mjs';

const KINDS = {
  talent: { label: 'Talent intake', fields: ['role', 'place_kind', 'batch', 'start', 'end', 'replacement', 'budget', 'cost_centre', 'places', 'skills', 'approver'], need: ['role', 'place_kind'] },
  feedback: { label: 'Course feedback', fields: ['course', 'content', 'teacher', 'practice', 'platform', 'support', 'value', 'comment'], need: ['course'] },
  workshop: { label: 'Workshop sheet', fields: ['workshop', 'action', 'process', 'need', 'interest', 'money', 'time', 'commitment'], need: ['action'] },
  finance: { label: 'Finance exercise', fields: ['exercise', 'answer', 'working'], need: ['exercise', 'answer'] },
};

async function member(req) {
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
  if (spam) return ok({ ref: ref('FRM') });
  const spec = KINDS[body.kind];
  if (!spec) return fail(400, 'Unknown form');
  const email = await member(req);
  if (!email) return fail(401, 'Please sign in first');
  const lines = [], data = {};
  for (const f of spec.fields) {
    data[f] = text(body[f], f === 'comment' || f === 'working' || f === 'skills' ? 2000 : 400);
    if (data[f]) lines.push(`${f}: ${data[f]}`);
  }
  for (const f of spec.need) if (!data[f]) return fail(400, 'Please fill the required fields');
  const row = { ref: ref('FRM'), name: 'Member form', email, topic: `Form: ${spec.label}`, message: lines.join('\n'), page: text(body.page, 300), site: 'houseforlearning.com' };
  const s = await save('messages', row);
  if (s.status !== 200) return fail(s.status, 'Not saved');
  await notify(`Member form ${row.ref}: ${spec.label}`, [`From: ${email}`, '', ...lines]);
  return ok({ ref: row.ref });
};
