// POST /api/author: Author Studio. Authors build courses (modules, lessons, blocks, final check), send them for trainer review,
// publish them, set a price and see their earnings. Learners open published courses through "play".
// Course answers never leave the server. Payments are test-only. Needs SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY and supabase/lms.sql.
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
export const SHARE = 0.9; // authors keep 90%, the platform keeps 10%
export const courseKey = (id) => 'author-' + String(id).replace(/-/g, '').slice(0, 20) + '.html';
const httpsUrl = (v) => { const u = text(v, 400); return /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : ''; };

// Clean whatever the studio sent: known block types only, plain text only, https links only, sensible sizes.
export function clean(body) {
  const mods = (Array.isArray(body.modules) ? body.modules : []).slice(0, 30).map((m) => ({
    title: text(m && m.title, 120) || 'Untitled module',
    lessons: (Array.isArray(m && m.lessons) ? m.lessons : []).slice(0, 30).map((l) => ({
      title: text(l && l.title, 120) || 'Untitled lesson',
      blocks: (Array.isArray(l && l.blocks) ? l.blocks : []).slice(0, 60).map((b) => {
        const t = b && b.type;
        if (t === 'text' || t === 'callout') return { type: t, text: text(b.text, 6000) };
        if (t === 'image') { const url = httpsUrl(b.url); return url ? { type: t, url, alt: text(b.alt, 200) } : null; }
        if (t === 'video') { const url = httpsUrl(b.url); return url ? { type: t, url, title: text(b.title, 120) } : null; }
        if (t === 'flashcards') return { type: t, items: (Array.isArray(b.items) ? b.items : []).slice(0, 40).map((i) => ({ front: text(i && i.front, 300), back: text(i && i.back, 600) })).filter((i) => i.front && i.back) };
        if (t === 'scenario') return { type: t, prompt: text(b.prompt, 1200), choices: (Array.isArray(b.choices) ? b.choices : []).slice(0, 5).map((c) => ({ text: text(c && c.text, 300), feedback: text(c && c.feedback, 600) })).filter((c) => c.text) };
        return null;
      }).filter(Boolean),
    })),
  }));
  const quiz = (Array.isArray(body.quiz) ? body.quiz : []).slice(0, 60).map((q) => {
    const o = (Array.isArray(q && q.o) ? q.o : []).slice(0, 6).map((x) => text(x, 300)).filter(Boolean);
    const a = Number(q && q.a);
    return { q: text(q && q.q, 500), o, a: Number.isInteger(a) && a >= 0 && a < o.length ? a : 0 };
  }).filter((q) => q.q && q.o.length >= 2);
  const price = Math.min(Math.max(Number(body.price) || 0, 0), 500);
  return { title: text(body.title, 140), summary: text(body.summary, 600), modules: mods, quiz, price_usd: Math.round(price * 100) / 100 };
}
const lessons = (mods) => mods.reduce((n, m) => n + (m.lessons || []).length, 0);
const mine = (r) => ({ id: r.id, key: courseKey(r.id), title: r.title, summary: r.summary, modules: r.modules, quiz: r.quiz, price: Number(r.price_usd), status: r.status, note: r.review_note, units: lessons(r.modules || []), updatedAt: r.updated_at, author: r.author_name });
const brief = (r) => ({ id: r.id, key: courseKey(r.id), title: r.title, summary: r.summary, price: Number(r.price_usd), units: lessons(r.modules || []), status: r.status, author: r.author_name, updatedAt: r.updated_at });

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({});
  const s = svc();
  if (!s) return fail(503, 'Author Studio is not switched on yet');
  const who = await whoIs(req);
  if (!who) return fail(401, 'Please sign in first');
  const res = (r) => withSession(r, who);
  const action = text(body.action, 20);
  const id = /^[0-9a-f-]{36}$/i.test(String(body.id || '')) ? String(body.id) : '';
  try {
    const me = (await rest(s, 'GET', 'members', `id=eq.${eq(who.id)}&select=full_name,role`))[0] || {};
    const staff = me.role === 'facilitator' || me.role === 'admin';
    const row = async () => (await rest(s, 'GET', 'lms_courses', `id=eq.${eq(id)}`))[0];

    if (action === 'mine') {
      const rows = await rest(s, 'GET', 'lms_courses', `author_id=eq.${eq(who.id)}&order=updated_at.desc&limit=100`);
      return res(ok({ courses: rows.map(brief), staff }));
    }
    if (action === 'catalogue') { // published courses anyone signed in can join
      const rows = await rest(s, 'GET', 'lms_courses', 'status=eq.published&order=published_at.desc&limit=100');
      return res(ok({ courses: rows.map(brief) }));
    }
    if (action === 'get') { // the author (or a trainer reviewing) opens the full course
      const r = await row(); if (!r) return fail(404, 'Course not found');
      if (r.author_id !== who.id && !staff) return fail(403, 'Not your course');
      return res(ok({ course: mine(r) }));
    }
    if (action === 'save') {
      const c = clean(body);
      if (!c.title) return fail(400, 'Give the course a title');
      if (!id) {
        const nid = crypto.randomUUID();
        const r = (await rest(s, 'POST', 'lms_courses', '', { ...c, id: nid, ckey: courseKey(nid), author_id: who.id, author_name: me.full_name || (who.email || '').split('@')[0] || 'Author' }, 'return=representation'))[0];
        return res(ok({ course: mine(r) }));
      }
      const r = await row(); if (!r) return fail(404, 'Course not found');
      if (r.author_id !== who.id) return fail(403, 'Not your course');
      // Changing a published course sends it back to the trainer, so learners never see unreviewed work.
      const status = r.status === 'draft' ? 'draft' : 'review';
      const u = (await rest(s, 'PATCH', 'lms_courses', `id=eq.${eq(id)}`, { ...c, status, updated_at: new Date().toISOString() }, 'return=representation'))[0];
      return res(ok({ course: mine(u) }));
    }
    if (action === 'submit') {
      const r = await row(); if (!r || r.author_id !== who.id) return fail(403, 'Not your course');
      if (!lessons(r.modules || [])) return fail(409, 'Add at least one lesson first');
      if (!(r.quiz || []).length) return fail(409, 'Add at least one final-check question first');
      const u = (await rest(s, 'PATCH', 'lms_courses', `id=eq.${eq(id)}`, { status: 'review', review_note: '', updated_at: new Date().toISOString() }, 'return=representation'))[0];
      return res(ok({ course: mine(u) }));
    }
    if (action === 'queue') { // trainers: courses waiting for review
      if (!staff) return fail(403, 'For trainers and admins only');
      const rows = await rest(s, 'GET', 'lms_courses', 'status=eq.review&order=updated_at.asc&limit=100');
      return res(ok({ courses: rows.map(brief) }));
    }
    if (action === 'review') {
      if (!staff) return fail(403, 'For trainers and admins only');
      const r = await row(); if (!r) return fail(404, 'Course not found');
      if (r.author_id === who.id && me.role !== 'admin') return fail(403, 'Another trainer must review your course');
      const approve = body.decision === 'approve';
      const patch = approve ? { status: 'approved', review_note: text(body.note, 1000), reviewer_id: who.id } : { status: 'changes', review_note: text(body.note, 1000) || 'Please check the course and send it again.', reviewer_id: who.id };
      const u = (await rest(s, 'PATCH', 'lms_courses', `id=eq.${eq(id)}`, { ...patch, updated_at: new Date().toISOString() }, 'return=representation'))[0];
      await rest(s, 'POST', 'lms_notifications', '', { user_id: r.author_id, kind: 'review', body: approve ? `${r.title} was approved. You can publish it now.` : `${r.title}: the trainer asks for changes. ${patch.review_note}` }, 'return=minimal').catch(() => {});
      return res(ok({ course: mine(u) }));
    }
    if (action === 'publish') {
      const r = await row(); if (!r || r.author_id !== who.id) return fail(403, 'Not your course');
      if (r.status !== 'approved' && r.status !== 'published') return fail(409, 'A trainer must approve the course first');
      const u = (await rest(s, 'PATCH', 'lms_courses', `id=eq.${eq(id)}`, { status: 'published', published_at: r.published_at || new Date().toISOString(), updated_at: new Date().toISOString() }, 'return=representation'))[0];
      return res(ok({ course: mine(u) }));
    }
    if (action === 'play') { // a learner opens a published course; the answers are not sent
      const key = text(body.key, 60);
      const m = /^author-([0-9a-f]{20})\.html$/.exec(key); if (!m) return fail(400, 'Choose a course first');
      const r = (await rest(s, 'GET', 'lms_courses', `ckey=eq.${eq(key)}`))[0];
      if (!r) return fail(404, 'Course not found');
      const preview = r.author_id === who.id || staff; // authors and trainers may open unpublished work
      if (r.status !== 'published' && !preview) return fail(404, 'Course not found');
      return res(ok({ course: { key, id: r.id, title: r.title, summary: r.summary, author: r.author_name, price: Number(r.price_usd), units: lessons(r.modules || []), modules: r.modules, quiz: (r.quiz || []).map((q) => ({ q: q.q, o: q.o })), status: r.status, preview } }));
    }
    if (action === 'earnings') {
      const sales = await rest(s, 'GET', 'lms_sales', `author_id=eq.${eq(who.id)}&order=created_at.desc&limit=500`);
      const sum = (k) => Math.round(sales.reduce((n, x) => n + Number(x[k]), 0) * 100) / 100;
      return res(ok({ sales: sales.length, gross: sum('price_usd'), yours: sum('author_share'), platform: sum('platform_share'), test: true, rule: 'You keep 90%. The platform keeps 10%. Test sales only until real payments go live.', recent: sales.slice(0, 20).map((x) => ({ key: x.course_key, price: Number(x.price_usd), yours: Number(x.author_share), at: x.created_at })) }));
    }
    return res(fail(400, 'Bad request'));
  } catch {
    return res(fail(502, 'Please try again in a moment'));
  }
};
