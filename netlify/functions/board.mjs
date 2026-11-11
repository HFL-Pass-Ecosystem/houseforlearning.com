// POST /api/board: "My board", sticky notes for every member. Members keep their own notes; trainers and admins can add a note to one
// board or to every board; an automatic note for today suggests the next lesson. Needs supabase/lms.sql.
import { ok, fail, text, readBody } from './_lib.mjs';
import { whoIs, withSession } from './_session.mjs';

const svc = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};
async function rest(s, method, table, query, body, prefer) {
  const r = await fetch(`${s.url}/rest/v1/${table}${query ? '?' + query : ''}`, {
    method,
    headers: { apikey: s.key, Authorization: `Bearer ${s.key}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await r.json(); } catch { /* empty */ }
  if (!r.ok) throw new Error(`db ${r.status}`);
  return data;
}
const eq = (v) => encodeURIComponent(v);
const COLORS = ['ivory', 'blue', 'green'];
const LINK = /^[a-z0-9][a-z0-9._/-]{0,100}(\?[a-z0-9=&._%-]{0,100})?$/i; // a page of this site only
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const pub = (n) => ({ id: n.id, kind: n.kind, body: n.body, color: n.color, link: n.link, due: n.due, done: n.done, at: n.created_at });
const clean = (b) => ({ body: text(b.body, 500), color: COLORS.includes(b.color) ? b.color : 'ivory', link: LINK.test(String(b.link || '')) ? String(b.link) : '', due: DATE.test(String(b.due || '')) ? String(b.due) : null });

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({});
  const s = svc();
  if (!s) return fail(503, 'My board is not switched on yet');
  const who = await whoIs(req);
  if (!who) return fail(401, 'Please sign in first');
  const res = (r) => withSession(r, who);
  const action = text(body.action, 16), uid = eq(who.id);
  try {
    const me = (await rest(s, 'GET', 'members', `id=eq.${uid}&select=role`))[0] || {};
    const staff = me.role === 'facilitator' || me.role === 'admin';
    const id = /^[0-9a-f-]{36}$/i.test(String(body.id || '')) ? String(body.id) : '';

    if (action === 'list') {
      const today = new Date().toISOString().slice(0, 10);
      const have = await rest(s, 'GET', 'lms_board', `user_id=eq.${uid}&kind=eq.auto&day=eq.${today}`);
      if (!have.length) { // today's note: carry on with the course you started last, or pick a first course
        const en = (await rest(s, 'GET', 'lms_enrolments', `user_id=eq.${uid}&status=eq.active&order=updated_at.desc&limit=1`))[0];
        const nbody = en ? `Today: carry on with ${en.title}. ${(en.done || []).length} of ${en.total} units done. Ten minutes is enough.` : 'Today: pick one course and open its first unit. Ten minutes is enough.';
        await rest(s, 'POST', 'lms_board', '', { user_id: who.id, kind: 'auto', body: nbody, color: 'blue', link: en ? en.course_key : 'learn.html', day: today }, 'return=minimal').catch(() => {});
      }
      const rows = await rest(s, 'GET', 'lms_board', `user_id=eq.${uid}&order=created_at.desc&limit=200`);
      return res(ok({ notes: rows.map(pub), staff }));
    }
    if (action === 'add') {
      const c = clean(body); if (!c.body) return fail(400, 'Write something on the note');
      const n = (await rest(s, 'POST', 'lms_board', '', { ...c, user_id: who.id, kind: 'own', created_by: who.id }, 'return=representation'))[0];
      return res(ok({ note: pub(n) }));
    }
    if (action === 'update') {
      if (!id) return fail(400, 'Bad request');
      const cur = (await rest(s, 'GET', 'lms_board', `id=eq.${eq(id)}&user_id=eq.${uid}`))[0]; if (!cur) return fail(404, 'Note not found');
      const patch = {};
      if (typeof body.done === 'boolean') patch.done = body.done;
      if (cur.kind === 'own') { const c = clean({ ...cur, ...body }); if (c.body) Object.assign(patch, c); } else if (COLORS.includes(body.color)) patch.color = body.color;
      const n = (await rest(s, 'PATCH', 'lms_board', `id=eq.${eq(id)}`, patch, 'return=representation'))[0];
      return res(ok({ note: pub(n) }));
    }
    if (action === 'remove') {
      if (!id) return fail(400, 'Bad request');
      await rest(s, 'DELETE', 'lms_board', `id=eq.${eq(id)}&user_id=eq.${uid}`, null, 'return=minimal');
      return res(ok({ ok: true }));
    }
    if (action === 'assign') { // trainers and admins: a note on one board (by email) or on every board
      if (!staff) return fail(403, 'For trainers and admins only');
      const c = clean(body); if (!c.body) return fail(400, 'Write something on the note');
      const to = text(body.to, 200).toLowerCase();
      const targets = to === 'all' ? await rest(s, 'GET', 'members', 'select=id&limit=5000') : await rest(s, 'GET', 'members', `email=eq.${eq(to)}&select=id`);
      if (!targets.length) return fail(404, 'No member with that email');
      for (let i = 0; i < targets.length; i += 200) {
        await rest(s, 'POST', 'lms_board', '', targets.slice(i, i + 200).map((t) => ({ ...c, user_id: t.id, kind: 'assigned', created_by: who.id })), 'return=minimal');
      }
      return res(ok({ sent: targets.length }));
    }
    return res(fail(400, 'Bad request'));
  } catch {
    return res(fail(502, 'Please try again in a moment'));
  }
};
