// POST /api/vidyapeetha: HFL Vidyapeetha. Verified tutors (ID + police clearance + safety exam), random audits,
// the fixed complaints protocol, credit transcript and verifiable badges. Database: supabase/vidyapeetha.sql.
// Files (ID, police clearance, evidence) go straight from the browser to the private vault through short-lived signed links.
// Needs SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY.
import { createHash } from 'node:crypto';
import { ok, fail, text, readBody } from './_lib.mjs';
import { whoIs, withSession } from './_session.mjs';

export const BUCKET = 'vp-vault';
export const TUTOR_SHARE = 0.7; // tutors keep 70%, AHFL keeps 30%
export const months = { home: 3, other: 12 }; // police clearance renewal: quarterly for home visits, yearly for everyone else
const PASS = 80;
const CATS = ['safety', 'conduct', 'quality', 'payment', 'other'];
const DECISIONS = ['no_action', 'warning', 'refund', 'course_removed', 'suspended', 'removed'];
const DESK = ['moderator', 'facilitator', 'admin'];

// Tutor safety exam. Answers stay here, never sent to the browser.
export const EXAM = [
  { q: 'A parent asks to book you by phone, outside the platform. What do you do?', o: ['Agree, it is quicker', 'Ask them to book on the platform; no booking outside it', 'Agree if they pay cash'], a: 1 },
  { q: 'You arrive for a lesson with a 10-year-old and no parent or guardian is at home. What do you do?', o: ['Teach anyway', 'Wait in the child\'s room', 'Do not start; leave, and report it on the app'], a: 2 },
  { q: 'When must you check in and check out on the app for a home visit?', o: ['At every visit, on arrival and on leaving', 'Only on the first visit', 'Only if asked'], a: 0 },
  { q: 'Your police clearance runs out next week. What happens if you do not renew it?', o: ['Nothing', 'Your profile is hidden, bookings freeze and payouts are held', 'You get a warning only'], a: 1 },
  { q: 'You moved to a new home in another area. What must you do?', o: ['Nothing', 'Upload a new police clearance from the new area', 'Tell a friend'], a: 1 },
  { q: 'A learner gives you a gift of cash for extra help. What do you do?', o: ['Accept it', 'Politely refuse; all payments go through the platform', 'Accept and share it'], a: 1 },
  { q: 'A learner or parent is unhappy with you. Where does the matter go?', o: ['Argue it out on chat', 'The fixed complaints form; the desk decides', 'Email the founder'], a: 1 },
  { q: 'An assessor arrives for a random check during your lesson. What do you do?', o: ['Refuse entry', 'Cooperate fully and show your app check-in', 'Ask them to come back later'], a: 1 },
  { q: 'May you share a learner\'s phone number or photos?', o: ['Yes, with other tutors', 'Never, unless the platform asks you to for safety', 'Yes, on social media'], a: 1 },
  { q: 'You see signs that a child may be in danger. What do you do?', o: ['Ignore it', 'Press the safety report on the app at once; the desk acts and informs police where the law requires', 'Post about it online'], a: 1 },
];

const svc = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};
export async function rest(s, method, table, query, body, prefer) {
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
async function storage(s, path, body) {
  const r = await fetch(`${s.url}/storage/v1/${path}`, {
    method: 'POST',
    headers: { apikey: s.key, Authorization: `Bearer ${s.key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  let data = null;
  try { data = await r.json(); } catch { /* empty */ }
  if (!r.ok) throw new Error(`storage ${r.status}`);
  return data;
}
const eq = (v) => encodeURIComponent(v);
const today = () => new Date().toISOString().slice(0, 10);
const addMonths = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCMonth(x.getUTCMonth() + n); return x.toISOString().slice(0, 10); };
const addDays = (d, n) => { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x.toISOString(); };
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || '') && !Number.isNaN(Date.parse(v));
const rnd = (n) => Array.from({ length: n }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
const sha = (v) => createHash('sha256').update(v).digest('hex');
export const badgeHash = (b) => sha([b.prev_hash, b.code, b.kind, b.title, b.holder, b.course_key || '', b.credits || 0, new Date(b.issued_at).toISOString()].join('|'));
// Plain words only: abusive messages are turned back so the desk deals with facts, not tempers.
const ABUSE = /\b(idiot|stupid|bastard|bloody|fool|shut up|damn|hell with)\b/i;

export async function note(s, user_id, kind, body) {
  try { await rest(s, 'POST', 'lms_notifications', '', { user_id, kind, body }, 'return=minimal'); } catch { /* a missed note never blocks */ }
}

// A tutor is live only when verified AND the police clearance is in date.
export const live = (t) => !!t && t.status === 'verified' && !!t.pcc_valid_until && t.pcc_valid_until >= today();
const tutorPub = (t) => t && ({
  name: t.full_name, phone: t.phone, country: t.country, city: t.city, area: t.area, subjects: t.subjects, languages: t.languages,
  homeVisits: t.home_visits, idType: t.id_type, hasId: !!t.id_path, hasPcc: !!t.pcc_path, pccIssuer: t.pcc_issuer,
  pccIssuedOn: t.pcc_issued_on, pccValidUntil: t.pcc_valid_until, ref1: t.ref1, ref2: t.ref2,
  trainingPct: t.training_pct, trainingFlags: t.training_flags, status: t.status, statusNote: t.status_note, live: live(t),
  renewEvery: t.home_visits ? months.home : months.other,
});
const casePub = (c) => ({
  caseNo: c.case_no, category: c.category, bookingRef: c.booking_ref, facts: c.facts, safety: c.safety, stage: c.stage,
  decision: c.decision, decisionNote: c.decision_note, appeal: c.appeal_text, at: c.created_at, decidedAt: c.decided_at,
  ackBy: addDays(c.created_at, 1), reviewBy: addDays(c.created_at, 5), finalBy: addDays(c.created_at, 14),
  canAppeal: c.stage === 'decided' && !c.appealed_at && Date.now() - Date.parse(c.decided_at) < 7 * 864e5,
});

// Ready for the desk once every item is in.
function readiness(t) {
  const miss = [];
  if (!t.id_path) miss.push('ID document');
  if (!t.pcc_path || !t.pcc_issued_on) miss.push('police clearance certificate and its date');
  if (!t.ref1 || !t.ref2) miss.push('two references');
  if (!(t.training_pct >= PASS)) miss.push(`safety exam (pass mark ${PASS}%)`);
  return miss;
}

async function issueBadge(s, row) {
  const last = (await rest(s, 'GET', 'vp_badges', 'select=hash&order=seq.desc&limit=1'))[0];
  const b = { code: `HB-${rnd(4)}-${rnd(4)}`, issued_at: new Date().toISOString(), prev_hash: last ? last.hash : 'GENESIS', ...row };
  b.hash = badgeHash(b);
  return (await rest(s, 'POST', 'vp_badges', 'on_conflict=user_id,kind,course_key', b, 'return=representation,resolution=ignore-duplicates'))[0] || null;
}

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({});
  const action = text(body.action, 24);
  const s = svc();
  if (!s) return fail(503, 'Vidyapeetha is not switched on yet');

  try {
    // ----- public -----
    if (action === 'tutors') { // verified tutors only, never their documents
      const rows = await rest(s, 'GET', 'vp_tutors', `status=eq.verified&pcc_valid_until=gte.${today()}&select=full_name,city,country,subjects,languages,home_visits,pcc_valid_until&order=full_name.asc&limit=500`);
      return ok({ tutors: rows.map((t) => ({ name: t.full_name, city: t.city, country: t.country, subjects: t.subjects, languages: t.languages, homeVisits: t.home_visits, validUntil: t.pcc_valid_until })) });
    }
    if (action === 'badge_verify') {
      const c = text(body.code, 20).toUpperCase();
      if (!/^HB-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c)) return fail(400, 'Please check the code');
      const b = (await rest(s, 'GET', 'vp_badges', `code=eq.${eq(c)}`))[0];
      if (!b) return ok({ valid: false });
      const prev = b.prev_hash === 'GENESIS' ? true : !!(await rest(s, 'GET', 'vp_badges', `hash=eq.${eq(b.prev_hash)}&select=code`))[0];
      const intact = badgeHash(b) === b.hash && prev;
      return ok({ valid: intact && !b.revoked, intact, revoked: b.revoked, badge: { code: b.code, kind: b.kind, title: b.title, holder: b.holder, credits: b.credits, issuedAt: b.issued_at, hash: b.hash } });
    }

    const who = await whoIs(req);
    if (!who) return fail(401, 'Please sign in first');
    const res = (r) => withSession(r, who);
    const uid = eq(who.id);
    const me = (await rest(s, 'GET', 'members', `id=eq.${uid}&select=full_name,role,email`))[0] || {};
    const desk = DESK.includes(me.role);
    const mineT = async () => (await rest(s, 'GET', 'vp_tutors', `user_id=eq.${uid}`))[0];

    // ----- tutor -----
    if (action === 'tutor_state') {
      const t = await mineT();
      return res(ok({ tutor: tutorPub(t) || null, missing: t ? readiness(t) : [], pass: PASS, desk, months }));
    }
    if (action === 'tutor_save') {
      const t = await mineT();
      if (t && ['suspended', 'removed'].includes(t.status)) return res(fail(403, 'Your profile is on hold. Please use the complaints and appeals page.'));
      const row = {
        full_name: text(body.name, 120), phone: text(body.phone, 30), country: text(body.country, 60), city: text(body.city, 80), area: text(body.area, 120),
        subjects: text(body.subjects, 300), languages: text(body.languages, 200), home_visits: !!body.homeVisits, id_type: text(body.idType, 40),
        pcc_issuer: text(body.pccIssuer, 160), ref1: text(body.ref1, 200), ref2: text(body.ref2, 200), updated_at: new Date().toISOString(),
      };
      if (!row.full_name || !row.area || !row.city) return res(fail(400, 'Please give your name, city and the area where you live now'));
      if (body.pccIssuedOn) {
        if (!isDate(body.pccIssuedOn) || body.pccIssuedOn > today()) return res(fail(400, 'Please check the date on your police clearance'));
        const fresh = addMonths(body.pccIssuedOn, row.home_visits ? months.home : 6);
        if (fresh < today()) return res(fail(400, row.home_visits ? 'For home visits the police clearance must be less than 3 months old' : 'The police clearance must be less than 6 months old'));
        row.pcc_issued_on = body.pccIssuedOn;
      }
      // Any change to the area of stay or the clearance after verification goes back to the desk.
      if (t && t.status === 'verified' && (row.area !== t.area || row.home_visits !== t.home_visits || (row.pcc_issued_on && row.pcc_issued_on !== t.pcc_issued_on))) { row.status = 'applied'; row.status_note = 'Changed details: the desk checks again.'; }
      const saved = t
        ? (await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${uid}`, row, 'return=representation'))[0]
        : (await rest(s, 'POST', 'vp_tutors', '', { user_id: who.id, ...row }, 'return=representation'))[0];
      return res(ok({ tutor: tutorPub(saved), missing: readiness(saved) }));
    }
    if (action === 'upload_url') { // kind: id | pcc | evidence. Returns a one-time link the browser uploads the file to.
      const kind = ['id', 'pcc', 'evidence'].includes(body.kind) ? body.kind : null;
      const ext = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' }[body.type];
      if (!kind || !ext) return res(fail(400, 'Please choose a PDF, JPG or PNG file'));
      if (kind !== 'evidence' && !(await mineT())) return res(fail(409, 'Save your details first'));
      const path = `${who.id}/${kind}-${Date.now()}.${ext}`;
      const r = await storage(s, `object/upload/sign/${BUCKET}/${path}`, {});
      return res(ok({ upload: `${s.url}/storage/v1${r.url}`, path }));
    }
    if (action === 'file_done') { // the browser uploaded: record the file on the profile
      const kind = body.kind === 'id' ? 'id_path' : body.kind === 'pcc' ? 'pcc_path' : null;
      const path = text(body.path, 200);
      if (!kind || !path.startsWith(who.id + '/')) return res(fail(400, 'Bad file'));
      const t = await mineT(); if (!t) return res(fail(409, 'Save your details first'));
      const patch = { [kind]: path, updated_at: new Date().toISOString() };
      if (t.status === 'verified' && kind === 'pcc_path') { patch.status = 'applied'; patch.status_note = 'New police clearance: the desk checks it.'; }
      const u = (await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${uid}`, patch, 'return=representation'))[0];
      return res(ok({ tutor: tutorPub(u), missing: readiness(u) }));
    }
    if (action === 'exam_paper') return res(ok({ minutes: 15, pass: PASS, questions: EXAM.map((x) => ({ q: x.q, o: x.o })) }));
    if (action === 'exam_submit') {
      const t = await mineT(); if (!t) return res(fail(409, 'Save your details first'));
      const given = Array.isArray(body.answers) ? body.answers.slice(0, EXAM.length) : [];
      const score = EXAM.filter((x, i) => Number(given[i]) === x.a).length, pct = Math.round(100 * score / EXAM.length);
      const log = body.integrity && typeof body.integrity === 'object' ? body.integrity : {};
      const flags = Math.min(99, (Number(log.leftPage) || 0) + (Number(log.exitedFullScreen) || 0) + (Number(log.pasteTries) || 0) + (log.overTime ? 1 : 0));
      const best = Math.max(pct, t.training_pct || 0);
      const u = (await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${uid}`, { training_pct: best, training_flags: flags, training_at: new Date().toISOString(), updated_at: new Date().toISOString() }, 'return=representation'))[0];
      const missing = readiness(u);
      if (!missing.length && u.status === 'applied') await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${uid}`, { status: 'ready' }, 'return=minimal');
      return res(ok({ pct, passed: pct >= PASS, pass: PASS, flags, missing }));
    }
    if (action === 'tutor_submit') {
      const t = await mineT(); if (!t) return res(fail(409, 'Save your details first'));
      const missing = readiness(t); if (missing.length) return res(fail(409, 'Still needed: ' + missing.join(', ')));
      if (t.status === 'applied') await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${uid}`, { status: 'ready', updated_at: new Date().toISOString() }, 'return=minimal');
      await note(s, who.id, 'tutor', 'Thank you. The desk will check your documents and call your references.');
      return res(ok({ ok: true }));
    }

    // ----- complaints (fixed protocol) -----
    if (action === 'case_lodge') {
      const category = CATS.includes(body.category) ? body.category : null;
      const facts = text(body.facts, 500);
      if (!category) return res(fail(400, 'Please choose what the matter is about'));
      if (facts.length < 20) return res(fail(400, 'Please state the facts: what happened, when and where'));
      if (ABUSE.test(facts)) return res(fail(400, 'Please state the facts only, in calm words. The desk decides on facts.'));
      const open = await rest(s, 'GET', 'vp_cases', `reporter_id=eq.${uid}&stage=in.(lodged,review,appeal)&select=id`);
      if (open.length >= 5 && category !== 'safety') return res(fail(429, 'You have 5 open cases. Please wait for a decision.'));
      let tutorId = null;
      const tname = text(body.tutor, 120);
      if (tname) { const m = await rest(s, 'GET', 'vp_tutors', `full_name=ilike.${eq(tname)}&select=user_id&limit=2`); if (m.length === 1) tutorId = m[0].user_id; }
      const ev = text(body.evidence, 200);
      const c = (await rest(s, 'POST', 'vp_cases', '', {
        case_no: `VP-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${rnd(5)}`, reporter_id: who.id, category, booking_ref: text(body.bookingRef, 60),
        tutor_id: tutorId, facts, evidence_path: ev && ev.startsWith(who.id + '/') ? ev : null, safety: category === 'safety', stage: category === 'safety' ? 'review' : 'lodged',
      }, 'return=representation'))[0];
      if (c.safety && tutorId) { // safety first: the tutor is paused at once while the desk looks into it
        await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${eq(tutorId)}`, { status: 'suspended', status_note: `Paused during safety case ${c.case_no}.`, updated_at: new Date().toISOString() }, 'return=minimal');
        await rest(s, 'POST', 'vp_audits', '', { tutor_id: tutorId, kind: 'complaint_followup', due: today(), note: `Safety case ${c.case_no}` }, 'return=minimal');
      }
      await note(s, who.id, 'case', `Case ${c.case_no} received. ${c.safety ? 'Safety cases are handled first.' : 'You will hear within 24 hours and get a decision within 5 working days.'}`);
      return res(ok({ case: casePub(c) }));
    }
    if (action === 'case_mine') {
      const rows = await rest(s, 'GET', 'vp_cases', `reporter_id=eq.${uid}&order=created_at.desc&limit=50`);
      return res(ok({ cases: rows.map(casePub) }));
    }
    if (action === 'case_appeal') {
      const c = (await rest(s, 'GET', 'vp_cases', `case_no=eq.${eq(text(body.caseNo, 30))}&reporter_id=eq.${uid}`))[0];
      if (!c || !casePub(c).canAppeal) return res(fail(409, 'This case cannot be appealed now. One appeal is allowed, within 7 days of the decision.'));
      const why = text(body.text, 500);
      if (why.length < 20 || ABUSE.test(why)) return res(fail(400, 'Please give the new facts for the appeal, in calm words'));
      const u = (await rest(s, 'PATCH', 'vp_cases', `id=eq.${eq(c.id)}`, { stage: 'appeal', appeal_text: why, appealed_at: new Date().toISOString() }, 'return=representation'))[0];
      return res(ok({ case: casePub(u) }));
    }

    // ----- transcript and badges -----
    if (action === 'transcript') {
      const [certs, badges] = await Promise.all([
        rest(s, 'GET', 'lms_certificates', `user_id=eq.${uid}&select=code,course_key,title,pct,issued_at`),
        rest(s, 'GET', 'vp_badges', `user_id=eq.${uid}&order=issued_at.desc`),
      ]);
      const keys = certs.map((c) => c.course_key);
      const rated = keys.length ? await rest(s, 'GET', 'vp_course_credits', `course_key=in.(${keys.map((k) => `"${k}"`).map(eq).join(',')})`) : [];
      const cr = Object.fromEntries(rated.map((r) => [r.course_key, r]));
      const rows = certs.map((c) => ({ code: c.code, course: c.course_key, title: c.title, pct: c.pct, at: c.issued_at, credits: cr[c.course_key] ? cr[c.course_key].credits : 0, offering: cr[c.course_key] ? cr[c.course_key].offering : '', programme: cr[c.course_key] ? cr[c.course_key].programme : '' }));
      return res(ok({ holder: me.full_name || '', rows, total: rows.reduce((n, r) => n + r.credits, 0), badges: badges.map((b) => ({ code: b.code, kind: b.kind, title: b.title, credits: b.credits, at: b.issued_at, revoked: b.revoked })) }));
    }
    if (action === 'badge_claim') { // turn a certificate into a verifiable badge
      const course = text(body.course, 130);
      const c = (await rest(s, 'GET', 'lms_certificates', `user_id=eq.${uid}&course_key=eq.${eq(course)}`))[0];
      if (!c) return res(fail(404, 'Earn the certificate first'));
      const r = (await rest(s, 'GET', 'vp_course_credits', `course_key=eq.${eq(course)}`))[0];
      const b = await issueBadge(s, { user_id: who.id, kind: r && r.offering === 'C' ? 'skill' : 'course', title: c.title, holder: c.holder, course_key: course, credits: r ? r.credits : 0 });
      const got = b || (await rest(s, 'GET', 'vp_badges', `user_id=eq.${uid}&course_key=eq.${eq(course)}`))[0];
      return res(ok({ badge: got && { code: got.code, title: got.title } }));
    }

    // ----- moderation desk -----
    if (!desk) return res(fail(403, 'For the moderation desk only'));
    if (action === 'desk') {
      const soon = addMonths(today(), 2);
      const [queue, expiring, audits, cases, credits] = await Promise.all([
        rest(s, 'GET', 'vp_tutors', 'status=in.(applied,ready)&order=updated_at.asc&limit=200'),
        rest(s, 'GET', 'vp_tutors', `status=in.(verified,renewal,suspended)&order=pcc_valid_until.asc&pcc_valid_until=lte.${soon}&limit=200`),
        rest(s, 'GET', 'vp_audits', 'result=eq.open&order=due.asc&limit=200'),
        rest(s, 'GET', 'vp_cases', 'stage=in.(lodged,review,appeal)&order=safety.desc,created_at.asc&limit=200'),
        rest(s, 'GET', 'vp_course_credits', 'order=updated_at.desc&limit=500'),
      ]);
      const ids = [...new Set([...audits.map((a) => a.tutor_id), ...cases.map((c) => c.tutor_id).filter(Boolean)])];
      const names = ids.length ? Object.fromEntries((await rest(s, 'GET', 'vp_tutors', `user_id=in.(${ids.join(',')})&select=user_id,full_name,home_visits`)).map((t) => [t.user_id, t])) : {};
      const T = (t) => ({ id: t.user_id, ...tutorPub(t), missing: readiness(t), cap: t.pcc_issued_on ? addMonths(t.pcc_issued_on, t.home_visits ? months.home : months.other) : null });
      return res(ok({
        queue: queue.map(T), expiring: expiring.map(T),
        audits: audits.map((a) => ({ id: a.id, tutor: (names[a.tutor_id] || {}).full_name || '', kind: a.kind, due: a.due, note: a.note })),
        cases: cases.map((c) => ({ ...casePub(c), tutor: (names[c.tutor_id] || {}).full_name || '' })),
        credits: credits.map((c) => ({ course: c.course_key, title: c.title, credits: c.credits, offering: c.offering, programme: c.programme })),
      }));
    }
    if (action === 'desk_file') { // a five-minute link to view a document; desk only
      const id = text(body.tutor, 40), kind = body.kind === 'id' ? 'id_path' : 'pcc_path';
      const t = (await rest(s, 'GET', 'vp_tutors', `user_id=eq.${eq(id)}`))[0];
      if (!t || !t[kind]) return res(fail(404, 'No file'));
      const r = await storage(s, `object/sign/${BUCKET}/${t[kind]}`, { expiresIn: 300 });
      return res(ok({ url: `${s.url}/storage/v1${r.signedURL}` }));
    }
    if (action === 'desk_verify') {
      const id = text(body.tutor, 40);
      const t = (await rest(s, 'GET', 'vp_tutors', `user_id=eq.${eq(id)}`))[0]; if (!t) return res(fail(404, 'Tutor not found'));
      if (t.user_id === who.id) return res(fail(403, 'Another desk member must check your own profile'));
      const decision = ['verify', 'reject', 'suspend', 'remove', 'reinstate'].includes(body.decision) ? body.decision : null;
      if (!decision) return res(fail(400, 'Choose a decision'));
      const why = text(body.note, 500);
      let patch;
      if (decision === 'verify' || decision === 'reinstate') {
        const miss = readiness(t); if (miss.length) return res(fail(409, 'Still needed: ' + miss.join(', ')));
        const cap = addMonths(t.pcc_issued_on, t.home_visits ? months.home : months.other);
        const until = isDate(body.validUntil) && body.validUntil < cap ? body.validUntil : cap;
        if (until < today()) return res(fail(409, 'This police clearance is already out of date'));
        patch = { status: 'verified', pcc_valid_until: until, verified_by: who.id, verified_at: new Date().toISOString(), status_note: why, reminded: [] };
      } else patch = { status: decision === 'reject' ? 'applied' : decision === 'suspend' ? 'suspended' : 'removed', status_note: why || 'Desk decision.' };
      const u = (await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${eq(id)}`, { ...patch, updated_at: new Date().toISOString() }, 'return=representation'))[0];
      if (patch.status === 'verified') await issueBadge(s, { user_id: id, kind: 'tutor', title: 'Verified Tutor', holder: t.full_name, course_key: '', credits: 0 });
      await note(s, id, 'tutor', patch.status === 'verified' ? `You are verified. Your police clearance is valid until ${patch.pcc_valid_until}.` : `Desk decision on your tutor profile: ${patch.status}. ${patch.status_note}`);
      return res(ok({ tutor: tutorPub(u) }));
    }
    if (action === 'desk_audit') { // record a random check; a fail suspends the tutor
      const a = (await rest(s, 'GET', 'vp_audits', `id=eq.${eq(text(body.id, 40))}`))[0]; if (!a) return res(fail(404, 'Check not found'));
      const result = body.result === 'pass' ? 'pass' : body.result === 'fail' ? 'fail' : null; if (!result) return res(fail(400, 'Pass or fail?'));
      await rest(s, 'PATCH', 'vp_audits', `id=eq.${eq(a.id)}`, { result, note: text(body.note, 500), auditor_id: who.id, done_at: new Date().toISOString() }, 'return=minimal');
      if (result === 'fail') await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${eq(a.tutor_id)}`, { status: 'suspended', status_note: 'Did not pass a random check. ' + text(body.note, 300), updated_at: new Date().toISOString() }, 'return=minimal');
      return res(ok({ ok: true }));
    }
    if (action === 'desk_audit_new') {
      const id = text(body.tutor, 40);
      const kind = ['random_home_visit', 'document_recheck', 'police_liaison'].includes(body.kind) ? body.kind : 'document_recheck';
      await rest(s, 'POST', 'vp_audits', '', { tutor_id: id, kind, due: isDate(body.due) ? body.due : today(), note: text(body.note, 300) }, 'return=minimal');
      return res(ok({ ok: true }));
    }
    if (action === 'desk_case') {
      const c = (await rest(s, 'GET', 'vp_cases', `case_no=eq.${eq(text(body.caseNo, 30))}`))[0]; if (!c) return res(fail(404, 'Case not found'));
      if (body.step === 'review') {
        await rest(s, 'PATCH', 'vp_cases', `id=eq.${eq(c.id)}`, { stage: 'review' }, 'return=minimal');
        return res(ok({ ok: true }));
      }
      const decision = DECISIONS.includes(body.decision) ? body.decision : null; if (!decision) return res(fail(400, 'Choose a decision'));
      if (c.stage === 'appeal' && c.decided_by === who.id) return res(fail(403, 'An appeal must be decided by someone else'));
      const final = c.stage === 'appeal';
      const patch = { decision, decision_note: text(body.note, 1000), decided_by: who.id, decided_at: new Date().toISOString(), stage: final ? 'final' : 'decided', ...(final ? { closed_at: new Date().toISOString() } : {}) };
      await rest(s, 'PATCH', 'vp_cases', `id=eq.${eq(c.id)}`, patch, 'return=minimal');
      if (c.tutor_id && (decision === 'suspended' || decision === 'removed')) await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${eq(c.tutor_id)}`, { status: decision, status_note: `Case ${c.case_no}.`, updated_at: new Date().toISOString() }, 'return=minimal');
      await note(s, c.reporter_id, 'case', `Case ${c.case_no}: ${final ? 'final decision' : 'decision'}: ${decision.replace('_', ' ')}. ${final ? 'This case is now closed.' : 'You may appeal once within 7 days.'}`);
      return res(ok({ ok: true }));
    }
    if (action === 'desk_credit') {
      const course = text(body.course, 130); const credits = parseInt(body.credits, 10);
      if (!/^[a-z0-9][a-z0-9._-]{0,120}\.html$/i.test(course) || !(credits >= 1 && credits <= 30)) return res(fail(400, 'Course file name and 1 to 30 credits, please'));
      await rest(s, 'POST', 'vp_course_credits', 'on_conflict=course_key', { course_key: course, title: text(body.title, 160), credits, offering: ['A', 'B', 'C'].includes(body.offering) ? body.offering : 'B', programme: text(body.programme, 120), set_by: who.id, updated_at: new Date().toISOString() }, 'return=minimal,resolution=merge-duplicates');
      return res(ok({ ok: true }));
    }
    return res(fail(400, 'Bad request'));
  } catch {
    return fail(502, 'Please try again in a moment');
  }
};
