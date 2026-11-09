// POST /api/lms: the learning management core. Enrol, resume, progress, quizzes, grades, certificates,
// notifications and the facilitator report. Everything is kept in Supabase (supabase/lms.sql), per signed-in member.
// Test payments only: nothing here takes money. Needs SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY.
import { ok, fail, text, readBody } from './_lib.mjs';
import { whoIs, withSession } from './_session.mjs';
import keys from './quizkeys.json' with { type: 'json' };

const PASS = 70;
const COURSE = /^[a-z0-9][a-z0-9._-]{0,120}\.html$/i;

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
const ints = (a, max) => Array.from(new Set((Array.isArray(a) ? a : []).map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < max))).sort((x, y) => x - y);
const code = () => 'HFL-' + [0, 1, 2].map(() => Math.random().toString(36).slice(2, 6).toUpperCase()).join('-');

async function note(s, user_id, kind, body) {
  try { await rest(s, 'POST', 'lms_notifications', '', { user_id, kind, body }, 'return=minimal'); } catch { /* a missed note never blocks learning */ }
}
const pub = (e) => ({ course: e.course_key, title: e.title, total: e.total, done: e.done || [], last: e.last_unit, status: e.status, paid: e.pay_status, enrolledAt: e.enrolled_at, updatedAt: e.updated_at, completedAt: e.completed_at });

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({});
  const s = svc();
  if (!s) return fail(503, 'Learning area is not switched on yet');
  const action = text(body.action, 24);

  // Anyone may check a certificate code.
  if (action === 'verify') {
    const c = text(body.code, 30).toUpperCase();
    if (!/^HFL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c)) return fail(400, 'Please check the code');
    const rows = await rest(s, 'GET', 'lms_certificates', `code=eq.${eq(c)}&select=code,title,holder,pct,issued_at`).catch(() => null);
    if (!rows) return fail(502, 'Please try again in a moment');
    return rows[0] ? ok({ valid: true, certificate: rows[0] }) : ok({ valid: false });
  }

  const who = await whoIs(req);
  if (!who) return fail(401, 'Please sign in first');
  const res = (r) => withSession(r, who);
  const uid = eq(who.id);
  try {
    const me = (await rest(s, 'GET', 'members', `id=eq.${uid}&select=full_name,role,email`))[0] || {};
    const role = me.role || 'learner';
    const staff = role === 'facilitator' || role === 'admin';
    const mine = async (course) => (await rest(s, 'GET', 'lms_enrolments', `user_id=eq.${uid}&course_key=eq.${eq(course)}`))[0];
    const needCourse = () => { const c = text(body.course, 130); return COURSE.test(c) ? c : null; };

    if (action === 'state') {
      const [en, ce, at, nt] = await Promise.all([
        rest(s, 'GET', 'lms_enrolments', `user_id=eq.${uid}&order=updated_at.desc&limit=200`),
        rest(s, 'GET', 'lms_certificates', `user_id=eq.${uid}&select=code,course_key,title,issued_at`),
        rest(s, 'GET', 'lms_attempts', `user_id=eq.${uid}&select=course_key,pct,passed,created_at&order=created_at.desc&limit=500`),
        rest(s, 'GET', 'lms_notifications', `user_id=eq.${uid}&order=created_at.desc&limit=20`),
      ]);
      const best = {}, tries = {};
      for (const a of at) { tries[a.course_key] = (tries[a.course_key] || 0) + 1; if (!best[a.course_key] || a.pct > best[a.course_key].pct) best[a.course_key] = { pct: a.pct, passed: a.passed }; }
      return res(ok({
        user: { name: me.full_name || '', email: who.email, role, staff },
        pass: PASS,
        enrolments: en.map((e) => ({ ...pub(e), quiz: best[e.course_key] || null, attempts: tries[e.course_key] || 0, hasQuiz: !!keys[e.course_key] })),
        certificates: ce.map((c) => ({ code: c.code, course: c.course_key, title: c.title, issuedAt: c.issued_at })),
        notifications: nt.map((n) => ({ id: n.id, kind: n.kind, body: n.body, read: n.read, at: n.created_at })),
      }));
    }

    if (action === 'enrol') {
      const course = needCourse(); if (!course) return fail(400, 'Choose a course first');
      const method = ['bank', 'upi'].includes(body.method) ? body.method : 'bank';
      const title = text(body.title, 160) || course;
      const total = Math.min(Math.max(parseInt(body.total, 10) || 1, 1), 200);
      let e = await mine(course);
      if (!e) {
        // Test payment only: the row says test_paid. When real payments go live this is where a confirmed payment is checked.
        e = (await rest(s, 'POST', 'lms_enrolments', '', { user_id: who.id, course_key: course, title, total, pay_method: method, pay_ref: text(body.ref, 60) || null }, 'return=representation'))[0];
        await note(s, who.id, 'enrolled', `You joined ${title}. Start with the first unit.`);
      }
      return res(ok({ enrolment: pub(e) }));
    }

    if (action === 'progress') {
      const course = needCourse(); if (!course) return fail(400, 'Choose a course first');
      const e = await mine(course); if (!e) return fail(403, 'Join this course first');
      const total = Math.min(Math.max(parseInt(body.total, 10) || e.total, 1), 200);
      const done = ints(body.done, total);
      const last = Number.isInteger(body.last) && body.last >= 0 && body.last < total ? body.last : e.last_unit;
      const complete = done.length >= total;
      const patch = { done, total, last_unit: last, updated_at: new Date().toISOString(), status: complete ? 'completed' : 'active', completed_at: complete ? (e.completed_at || new Date().toISOString()) : null };
      const u = (await rest(s, 'PATCH', 'lms_enrolments', `id=eq.${eq(e.id)}`, patch, 'return=representation'))[0];
      if (complete && e.status !== 'completed') await note(s, who.id, 'completed', `You finished every unit of ${e.title}. Take the final check to earn your certificate.`);
      return res(ok({ enrolment: pub(u) }));
    }

    if (action === 'quiz') {
      const course = needCourse(); if (!course) return fail(400, 'Choose a course first');
      const e = await mine(course); if (!e) return fail(403, 'Join this course first');
      const key = keys[course]; if (!key) return fail(404, 'This course has no final check yet');
      const given = Array.isArray(body.answers) ? body.answers.slice(0, key.length) : [];
      const right = key.split('').map((k, i) => Number(given[i]) === Number(k));
      const score = right.filter(Boolean).length, max = key.length, pct = Math.round(100 * score / max), passed = pct >= PASS;
      await rest(s, 'POST', 'lms_attempts', '', { user_id: who.id, course_key: course, score, max, pct, passed, answers: given.map((n) => Number(n) || 0) }, 'return=minimal');
      await note(s, who.id, 'grade', `${e.title}: you scored ${pct}% on the final check. ${passed ? 'Passed.' : `You need ${PASS}% to pass. You can try again.`}`);
      return res(ok({ score, max, pct, passed, pass: PASS, right }));
    }

    if (action === 'certificate') {
      const course = needCourse(); if (!course) return fail(400, 'Choose a course first');
      const e = await mine(course); if (!e) return fail(403, 'Join this course first');
      let c = (await rest(s, 'GET', 'lms_certificates', `user_id=eq.${uid}&course_key=eq.${eq(course)}`))[0];
      if (!c) {
        if ((e.done || []).length < e.total) return fail(409, 'Finish every unit first');
        const need = !!keys[course];
        const att = need ? await rest(s, 'GET', 'lms_attempts', `user_id=eq.${uid}&course_key=eq.${eq(course)}&passed=eq.true&order=pct.desc&limit=1`) : [{ pct: 100 }];
        if (!att[0]) return fail(409, `Pass the final check (${PASS}%) first`);
        const holder = me.full_name || (who.email || '').split('@')[0] || 'Learner';
        c = (await rest(s, 'POST', 'lms_certificates', '', { code: code(), user_id: who.id, course_key: course, title: e.title, holder, pct: att[0].pct }, 'return=representation'))[0];
        await note(s, who.id, 'certificate', `Your certificate for ${e.title} is ready. Code ${c.code}.`);
      }
      return res(ok({ certificate: { code: c.code, title: c.title, holder: c.holder, pct: c.pct, issuedAt: c.issued_at } }));
    }

    if (action === 'notes_read') {
      await rest(s, 'PATCH', 'lms_notifications', `user_id=eq.${uid}&read=eq.false`, { read: true }, 'return=minimal');
      return res(ok({ ok: true }));
    }

    if (action === 'report') {
      if (!staff) return fail(403, 'For facilitators and admins only');
      const [en, at, ce, mem] = await Promise.all([
        rest(s, 'GET', 'lms_enrolments', 'order=updated_at.desc&limit=2000'),
        rest(s, 'GET', 'lms_attempts', 'select=user_id,course_key,pct,passed&limit=5000'),
        rest(s, 'GET', 'lms_certificates', 'select=user_id,course_key,code&limit=5000'),
        rest(s, 'GET', 'members', 'select=id,full_name,email&limit=5000'),
      ]);
      const who2 = Object.fromEntries(mem.map((m) => [m.id, m]));
      const best = {}; for (const a of at) { const k = a.user_id + '|' + a.course_key; if (!best[k] || a.pct > best[k]) best[k] = a.pct; }
      const certs = Object.fromEntries(ce.map((c) => [c.user_id + '|' + c.course_key, c.code]));
      const rows = en.map((e) => ({
        learner: (who2[e.user_id] || {}).full_name || '', email: (who2[e.user_id] || {}).email || '',
        course: e.course_key, title: e.title, done: (e.done || []).length, total: e.total,
        pct: Math.round(100 * (e.done || []).length / e.total), status: e.status, best: best[e.user_id + '|' + e.course_key] ?? null,
        certificate: certs[e.user_id + '|' + e.course_key] || '', enrolledAt: e.enrolled_at, updatedAt: e.updated_at, paid: e.pay_status,
      }));
      if (process.env.AHFL_DEMO_DATA === '1') {
        const t = new Date().toISOString();
        rows.push(...[['Demo Learner One', 3, 8, null], ['Demo Learner Two', 8, 8, 85], ['Demo Learner Three', 0, 8, null]].map(([n, d, tot, b]) => ({
          learner: n, email: n.toLowerCase().replace(/ /g, '.') + '@demo.invalid', course: 'demo-course.html', title: 'Demo course', done: d, total: tot,
          pct: Math.round(100 * d / tot), status: d === tot ? 'completed' : 'active', best: b, certificate: '', enrolledAt: t, updatedAt: t, paid: 'demo', demo: true })));
      }
      const byCourse = {};
      for (const r of rows) { const c = (byCourse[r.course] ||= { course: r.course, title: r.title, learners: 0, completed: 0, sum: 0 }); c.learners++; c.sum += r.pct; if (r.status === 'completed') c.completed++; }
      const courses = Object.values(byCourse).map((c) => ({ course: c.course, title: c.title, learners: c.learners, completed: c.completed, avg: Math.round(c.sum / c.learners) }));
      return res(ok({ rows, courses, totals: { enrolments: rows.length, completed: rows.filter((r) => r.status === 'completed').length, learners: new Set(rows.map((r) => r.email || r.learner)).size } }));
    }
    return res(fail(400, 'Bad request'));
  } catch {
    return res(fail(502, 'Please try again in a moment'));
  }
};
