// /api/karma: karma points for signed-in members (in the spirit of Karma Yoga: right action and effort, not results alone).
//   GET  -> { member, points, level, recent[] }   (guests get { member: false })
//   POST { action, ref } -> { awarded, points, label, levelUp }   The server decides the points from karma-rules.json,
//   applies the daily limits, and gives each (member, action, ref) only once. Table: supabase/karma.sql.
import { ok, fail, text, readBody } from './_lib.mjs';
import { whoIs, withSession } from './_session.mjs';
import R from './karma-rules.json' with { type: 'json' };

const db = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};
async function rest(c, path, opt = {}) {
  const r = await fetch(`${c.url}/rest/v1/${path}`, { ...opt, headers: { apikey: c.key, Authorization: `Bearer ${c.key}`, 'Content-Type': 'application/json', ...(opt.headers || {}) } });
  let data = null; try { data = await r.json(); } catch { /* empty */ }
  return { status: r.status, ok: r.ok, data };
}
const levelOf = (p) => { let l = R.levels[0]; for (const x of R.levels) if (p >= x[0]) l = x; return l[1]; };
async function total(c, email) {
  const r = await rest(c, `karma_events?email=eq.${encodeURIComponent(email)}&select=points,action,label,created_at&order=created_at.desc&limit=1000`);
  const rows = r.ok && Array.isArray(r.data) ? r.data : [];
  return { points: rows.reduce((s, x) => s + x.points, 0), recent: rows.slice(0, 10) };
}

export default async (req) => {
  const c = db();
  const who = await whoIs(req);
  const res = (r) => withSession(r, who);
  if (!who || !who.email) return ok({ member: false });
  if (!c) return res(fail(503, 'Karma is not switched on yet'));
  if (req.method === 'GET') {
    const t = await total(c, who.email);
    return res(ok({ member: true, points: t.points, level: levelOf(t.points), recent: t.recent }));
  }
  const { body, error, spam } = await readBody(req);
  if (error) return res(fail(...error));
  if (spam) return res(ok({ awarded: 0 }));
  const action = text(body.action, 20), ref = text(body.ref, 80), rule = R.rules[action];
  if (!rule || !ref) return res(fail(400, 'Unknown action'));
  const since = new Date(); since.setUTCHours(0, 0, 0, 0);
  const used = await countSince(c, who.email, action, rule.once ? null : since);
  const before = await total(c, who.email);
  if (used >= (rule.once ? 1 : rule.perDay)) return res(ok({ awarded: 0, points: before.points, reason: 'limit' }));
  const ins = await rest(c, 'karma_events?on_conflict=email,action,ref', {
    method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
    body: JSON.stringify({ user_id: who.id, email: who.email, action, ref, points: rule.points, label: rule.label, site: 'houseforlearning.com' }),
  });
  const added = ins.ok && Array.isArray(ins.data) && ins.data.length ? rule.points : 0;
  const points = before.points + added;
  return res(ok({ awarded: added, points, label: rule.label, levelUp: added > 0 && levelOf(points) !== levelOf(before.points) }));
};

async function countSince(c, email, action, since) {
  const r = await rest(c, `karma_events?email=eq.${encodeURIComponent(email)}&action=eq.${action}` + (since ? `&created_at=gte.${since.toISOString()}` : '') + '&select=id&limit=100');
  return r.ok && Array.isArray(r.data) ? r.data.length : 0;
}
