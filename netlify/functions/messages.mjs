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
  return ok({ ref: row.ref });
};
