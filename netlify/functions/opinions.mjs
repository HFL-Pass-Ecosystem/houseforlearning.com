// POST /api/opinions: "Was this page useful?" ratings and comments.
import { ok, fail, ref, text, readBody, save } from './_lib.mjs';

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({ ref: ref('OP') });
  const rating = Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : null;
  const row = { ref: ref('OP'), rating, comment: text(body.comment, 2000), page: text(body.page, 300), site: text(body.site, 120) };
  if (!row.rating && !row.comment) return fail(400, 'Choose a rating or write a comment');
  const s = await save('opinions', row);
  if (s.status !== 200) return fail(s.status, 'Not saved');
  return ok({ ref: row.ref });
};
