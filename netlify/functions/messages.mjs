// POST /api/messages: the contact form and the "write to us" box on every page.
import { ok, fail, ref, text, isEmail, readBody, save, notify } from './_lib.mjs';

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({ ref: ref('MSG') });
  const row = {
    ref: ref('MSG'),
    name: text(body.name, 120),
    email: text(body.email, 200),
    topic: text(body.topic || body.subject, 200),
    message: text(body.message, 5000),
    page: text(body.page, 300),
    site: text(body.site, 120),
  };
  if (!row.message) return fail(400, 'Please write a message');
  if (row.email && !isEmail(row.email)) return fail(400, 'Please check the email address');
  const s = await save('messages', row);
  if (s.status !== 200) return fail(s.status, 'Not saved');
  await notify(`Website message ${row.ref}: ${row.topic || 'no subject'}`,
    [`From: ${row.name} <${row.email}>`, `Page: ${row.page}`, '', row.message]);
  await toCrm(row, body.consent === true);
  return ok({ ref: row.ref });
};

// When AHFL_PLATFORM_URL is set (Netlify environment), a consented message is also sent to the HFL-Pass platform,
// where it opens a lead in the House for Learning CRM. Off by default; a failure never blocks the visitor.
export function crmPayload(row, consent) {
  if (!consent || !row.name || !row.email) return null;
  return { site: 'hfl', name: row.name, email: row.email, consent: true,
    message: ((row.topic ? `[${row.topic}]\n` : '') + row.message).slice(0, 4000) };
}
async function toCrm(row, consent) {
  const base = (process.env.AHFL_PLATFORM_URL || '').replace(/\/+$/, '');
  const payload = crmPayload(row, consent);
  if (!base.startsWith('https://') || !payload) return;
  try {
    const r = await fetch(`${base}/api/v1/public/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (r.status !== 202) console.log(`CRM hand-over for ${row.ref} answered ${r.status}`);
  } catch (e) { console.log(`CRM hand-over for ${row.ref} failed: ${String(e).slice(0, 120)}`); }
}
