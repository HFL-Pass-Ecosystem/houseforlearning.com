// POST /api/assignments: authenticated assignment authoring, rubric review, learner submission and grading.
// Uses the LMS service key server-side only. Learners can see only published assignments in courses they joined.
import { ok, fail, text, readBody } from './_lib.mjs';
import { whoIs, withSession } from './_session.mjs';

const svc = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};
async function rest(s, method, table, query, body, prefer) {
  const r = await fetch(s.url + '/rest/v1/' + table + (query ? '?' + query : ''), {
    method,
    headers: { apikey: s.key, Authorization: 'Bearer ' + s.key, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await r.json(); } catch { /* empty response */ }
  if (!r.ok) throw new Error('db ' + r.status);
  return data;
}
const eq = (v) => encodeURIComponent(v);
const uuid = (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v || ''));
const httpsUrl = (v) => {
  const u = text(v, 500);
  return /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : '';
};
function clean(input) {
  const outcomes = (Array.isArray(input.outcomes) ? input.outcomes : String(input.outcomes || '').split('\n'))
    .slice(0, 5).map((v) => text(v, 240)).filter(Boolean);
  const rubric = (Array.isArray(input.rubric) ? input.rubric : []).slice(0, 8).map((r, i) => {
    const id = text(r && r.id, 40);
    const max = Number(r && r.max_points);
    return {
      id: /^[a-z0-9_-]{1,40}$/i.test(id) ? id : 'criterion-' + (i + 1),
      label: text(r && r.label, 120),
      guidance: text(r && r.guidance, 500),
      max_points: Number.isFinite(max) ? Math.round(Math.min(Math.max(max, 1), 100) * 100) / 100 : 0,
    };
  }).filter((r) => r.label && r.max_points > 0);
  return {
    title: text(input.title, 140),
    directions: text(input.directions, 6000),
    outcomes,
    rubric,
  };
}
function brief(r) {
  return { id: r.id, course_id: r.course_id, title: r.title, directions: r.directions, outcomes: r.outcomes || [], rubric: r.rubric || [], status: r.status, review_note: r.review_note || '', created_at: r.created_at };
}
function latestByLearner(rows) {
  const seen = new Set(), out = [];
  for (const r of rows) {
    if (seen.has(r.user_id)) continue;
    seen.add(r.user_id);
    out.push({ id: r.id, learner: 'Learner ' + String(r.user_id).slice(0, 8), attempt: r.attempt, response: r.response, evidence_url: r.evidence_url, rubric_scores: r.rubric_scores || [], feedback: r.feedback || '', score: r.score, max_points: r.max_points, status: r.status, submitted_at: r.submitted_at, graded_at: r.graded_at });
  }
  return out;
}

export default async (req) => {
  const { body, error, spam } = await readBody(req);
  if (error) return fail(...error);
  if (spam) return ok({});
  const s = svc();
  if (!s) return fail(503, 'Assignments are not switched on yet');
  const who = await whoIs(req);
  if (!who) return fail(401, 'Please sign in first');
  const res = (r) => withSession(r, who);
  const action = text(body.action, 24);
  const courseId = uuid(body.course_id) ? String(body.course_id) : '';
  const assignmentId = uuid(body.assignment_id || body.id) ? String(body.assignment_id || body.id) : '';
  const submissionId = uuid(body.submission_id) ? String(body.submission_id) : '';
  try {
    const member = (await rest(s, 'GET', 'members', 'id=eq.' + eq(who.id) + '&select=role'))[0] || {};
    const staff = member.role === 'facilitator' || member.role === 'admin';
    const getCourse = async (id) => uuid(id) ? (await rest(s, 'GET', 'lms_courses', 'id=eq.' + eq(id)))[0] : null;
    const getAssignment = async (id) => uuid(id) ? (await rest(s, 'GET', 'lms_assignments', 'id=eq.' + eq(id)))[0] : null;
    const isOwner = (c) => !!c && c.author_id === who.id;
    const hasEnrolment = async (c) => !!c && c.status === 'published' && !!(await rest(s, 'GET', 'lms_enrolments', 'user_id=eq.' + eq(who.id) + '&course_key=eq.' + eq(c.ckey) + '&limit=1'))[0];

    if (action === 'list') {
      const course = await getCourse(courseId);
      if (!course) return fail(404, 'Course not found');
      const owner = isOwner(course);
      if (!owner && !staff && !(await hasEnrolment(course))) return fail(403, 'Join this course to see its assignments');
      const rows = await rest(s, 'GET', 'lms_assignments', 'course_id=eq.' + eq(courseId) + '&order=created_at.asc&limit=100');
      const visible = (owner || staff) ? rows : rows.filter((a) => a.status === 'published');
      const assignments = [];
      for (const a of visible) {
        const item = brief(a);
        item.editable = a.created_by === who.id;
        item.can_submit_review = (owner && a.created_by === who.id) || staff;
        if (!owner && !staff) {
          delete item.review_note;
          const mine = (await rest(s, 'GET', 'lms_assignment_submissions', 'assignment_id=eq.' + eq(a.id) + '&user_id=eq.' + eq(who.id) + '&order=attempt.desc&limit=1'))[0];
          item.my_submission = mine ? { attempt: mine.attempt, response: mine.response, evidence_url: mine.evidence_url, rubric_scores: mine.rubric_scores || [], feedback: mine.feedback || '', score: mine.score, max_points: mine.max_points, status: mine.status, submitted_at: mine.submitted_at, graded_at: mine.graded_at } : null;
        }
        assignments.push(item);
      }
      return res(ok({ course: { id: course.id, title: course.title, key: course.ckey, status: course.status }, owner, staff, assignments }));
    }

    if (action === 'create' || action === 'update') {
      const course = await getCourse(courseId);
      if (!course || (!isOwner(course) && !staff)) return fail(403, 'Only the course author or a facilitator can manage assignments');
      const a = clean(body);
      if (!a.title || !a.directions) return fail(400, 'Add a title and clear task directions');
      if (!a.outcomes.length) return fail(400, 'Add at least one observable learning outcome');
      if (a.rubric.length < 2) return fail(400, 'Add at least two marking criteria');
      if (new Set(a.rubric.map((r) => r.id)).size !== a.rubric.length) return fail(400, 'Each rubric criterion needs a unique ID');
      if (action === 'create') {
        const created = (await rest(s, 'POST', 'lms_assignments', '', { course_id: course.id, created_by: who.id, ...a }, 'return=representation'))[0];
        return res(ok({ assignment: brief(created) }));
      }
      const old = await getAssignment(assignmentId);
      if (!old) return fail(404, 'Assignment not found');
      if (old.course_id !== course.id || old.created_by !== who.id || !['draft', 'changes'].includes(old.status)) return fail(403, 'This assignment can no longer be edited here');
      const changed = (await rest(s, 'PATCH', 'lms_assignments', 'id=eq.' + eq(old.id), { ...a, review_note: '', updated_at: new Date().toISOString() }, 'return=representation'))[0];
      return res(ok({ assignment: brief(changed) }));
    }

    if (action === 'submit_review') {
      const old = await getAssignment(assignmentId);
      const course = old && await getCourse(old.course_id);
      if (!old || !course || (old.created_by !== who.id && !staff)) return fail(403, 'Only the course author can send this assignment for review');
      if (!['draft', 'changes'].includes(old.status)) return fail(409, 'This assignment is already in review or published');
      const changed = (await rest(s, 'PATCH', 'lms_assignments', 'id=eq.' + eq(old.id), { status: 'review', review_note: '', updated_at: new Date().toISOString() }, 'return=representation'))[0];
      return res(ok({ assignment: brief(changed) }));
    }

    if (action === 'queue') {
      if (!staff) return fail(403, 'For facilitators and admins only');
      const rows = await rest(s, 'GET', 'lms_assignments', 'status=eq.review&order=created_at.asc&limit=100');
      return res(ok({ assignments: rows.map(brief) }));
    }

    if (action === 'review') {
      if (!staff) return fail(403, 'For facilitators and admins only');
      const old = await getAssignment(assignmentId);
      if (!old || old.status !== 'review') return fail(404, 'Assignment not waiting for review');
      const approve = body.decision === 'approve';
      if (!approve && body.decision !== 'changes') return fail(400, 'Choose approve or changes');
      const note = text(body.note, 1000) || (approve ? '' : 'Please review the assignment and rubric, then send it again.');
      const changed = (await rest(s, 'PATCH', 'lms_assignments', 'id=eq.' + eq(old.id), { status: approve ? 'published' : 'changes', review_note: note, updated_at: new Date().toISOString() }, 'return=representation'))[0];
      await rest(s, 'POST', 'lms_notifications', '', { user_id: old.created_by, kind: 'assignment-review', body: approve ? old.title + ' was approved and is now available to learners.' : old.title + ': changes requested. ' + note }, 'return=minimal').catch(() => {});
      return res(ok({ assignment: brief(changed) }));
    }

    if (action === 'submit') {
      const old = await getAssignment(assignmentId);
      const course = old && await getCourse(old.course_id);
      if (!old || !course || old.status !== 'published') return fail(404, 'Assignment not found');
      if (!(await hasEnrolment(course))) return fail(403, 'Join this course before submitting work');
      const response = text(body.response, 30000);
      const evidence = body.evidence_url ? httpsUrl(body.evidence_url) : '';
      if (!response) return fail(400, 'Write a response before submitting');
      if (body.evidence_url && !evidence) return fail(400, 'Evidence links must use HTTPS');
      const latest = (await rest(s, 'GET', 'lms_assignment_submissions', 'assignment_id=eq.' + eq(old.id) + '&user_id=eq.' + eq(who.id) + '&order=attempt.desc&limit=1'))[0];
      const attempt = latest ? Number(latest.attempt) + 1 : 1;
      const row = (await rest(s, 'POST', 'lms_assignment_submissions', '', { assignment_id: old.id, user_id: who.id, attempt, response, evidence_url: evidence }, 'return=representation'))[0];
      return res(ok({ submitted: { attempt: row.attempt, status: row.status, submitted_at: row.submitted_at } }));
    }

    if (action === 'submissions') {
      const old = await getAssignment(assignmentId);
      const course = old && await getCourse(old.course_id);
      if (!old || !course || (!isOwner(course) && !staff)) return fail(403, 'Only the course author or a facilitator can review submissions');
      const rows = await rest(s, 'GET', 'lms_assignment_submissions', 'assignment_id=eq.' + eq(old.id) + '&order=user_id.asc,attempt.desc&limit=1000');
      return res(ok({ submissions: latestByLearner(rows) }));
    }

    if (action === 'grade') {
      const submission = uuid(submissionId) ? (await rest(s, 'GET', 'lms_assignment_submissions', 'id=eq.' + eq(submissionId)))[0] : null;
      const old = submission && await getAssignment(submission.assignment_id);
      const course = old && await getCourse(old.course_id);
      if (!submission || !old || !course || (!isOwner(course) && !staff)) return fail(403, 'Only the course author or a facilitator can grade this work');
      const rubric = old.rubric || [];
      const supplied = Array.isArray(body.rubric_scores) ? body.rubric_scores : [];
      if (supplied.length !== rubric.length) return fail(400, 'Score every marking criterion');
      const values = [];
      for (const criterion of rubric) {
        const matches = supplied.filter((x) => x && x.id === criterion.id);
        if (matches.length !== 1) return fail(400, 'Each criterion must be scored once');
        const points = Number(matches[0].points);
        if (!Number.isFinite(points) || points < 0 || points > Number(criterion.max_points)) return fail(400, 'A score is outside its allowed range');
        values.push({ id: criterion.id, label: criterion.label, points: Math.round(points * 100) / 100, max_points: Number(criterion.max_points) });
      }
      const score = Math.round(values.reduce((n, x) => n + x.points, 0) * 100) / 100;
      const max = Math.round(values.reduce((n, x) => n + x.max_points, 0) * 100) / 100;
      const changed = (await rest(s, 'PATCH', 'lms_assignment_submissions', 'id=eq.' + eq(submission.id), {
        rubric_scores: values, feedback: text(body.feedback, 4000), score, max_points: max, status: 'graded', grader_id: who.id, graded_at: new Date().toISOString(),
      }, 'return=representation'))[0];
      await rest(s, 'POST', 'lms_notifications', '', { user_id: submission.user_id, kind: 'assignment-grade', body: old.title + ' was marked: ' + score + ' / ' + max + ' points.' }, 'return=minimal').catch(() => {});
      return res(ok({ graded: { id: changed.id, score: changed.score, max_points: changed.max_points, status: changed.status, graded_at: changed.graded_at } }));
    }

    return res(fail(400, 'Bad request'));
  } catch {
    return res(fail(502, 'Please try again in a moment'));
  }
};
