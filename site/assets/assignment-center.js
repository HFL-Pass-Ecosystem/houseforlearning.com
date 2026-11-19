/* Assignment Center: practical submissions with transparent criteria, facilitator review and scoring.
   All content enters through /api/assignments; output is built with textContent to avoid HTML injection. */
(function () {
  var main = document.querySelector('main[data-lms="assignments"]');
  if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess;
  var courseId = (new URLSearchParams(location.search).get('course') || '').trim();
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  var state = null, editingId = '';
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function btn(t, f, c) { var b = el('button', c || 'btn', t); b.type = 'button'; b.addEventListener('click', f); return b; }
  function row(kids, c) { var d = el('div', c || 'au-row'); kids.forEach(function (k) { d.appendChild(k); }); return d; }
  function say(m, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), m); p.setAttribute('role', 'status'); return p; }
  function api(body) {
    return fetch('/api/assignments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); })
      .catch(function () { return { status: 0, error: 'The service could not be reached. Please try again.' }; });
  }
  function field(label, val, on, opts) {
    opts = opts || {};
    var l = el('label', 'au-f'); l.appendChild(el('span', 'au-l', label));
    var i = el(opts.area ? 'textarea' : 'input');
    if (opts.area) i.rows = opts.rows || 4; else i.type = opts.type || 'text';
    if (opts.maxLength != null) i.maxLength = opts.maxLength;
    else if (opts.max != null && !(i.tagName === 'INPUT' && i.type === 'number')) i.maxLength = opts.max;
    if (opts.min != null) i.min = opts.min;
    if (opts.maxValue != null) i.max = opts.maxValue;
    if (opts.step) i.step = opts.step;
    i.value = val == null ? '' : val;
    i.addEventListener('input', function () { on(i.value); });
    l.appendChild(i); return l;
  }
  function stateLine(status) {
    return ({ draft: 'Draft · only the author can see this', review: 'In facilitator review', changes: 'Changes requested', published: 'Available to enrolled learners' })[status] || status;
  }
  function cleanUrl(v) { return /^https:\/\/[^\s"'<>]+$/i.test(String(v || '').trim()) ? String(v).trim() : ''; }

  A.ready.then(function () {
    if (!A.signedIn()) {
      box.textContent = '';
      box.appendChild(say('Sign in to open course assignments.'));
      var a = el('a', 'btn', 'Sign in'); a.href = 'login.html'; box.appendChild(a); return;
    }
    if (A.mode !== 'server') { box.textContent = ''; box.appendChild(say('Assignment work is stored in your member account. This browser is in test mode.', true)); return; }
    if (!UUID.test(courseId)) { box.textContent = ''; box.appendChild(say('Open this page from a course so we can find its assignments.', true)); return; }
    load();
  });

  function load(note) {
    box.textContent = '';
    if (note) box.appendChild(note);
    box.appendChild(say('Loading assignments.'));
    api({ action: 'list', course_id: courseId }).then(function (x) {
      box.textContent = '';
      if (x.status !== 200) { box.appendChild(say(x.error || 'Could not load assignments.', true)); return; }
      state = x;
      if (note) box.appendChild(note);
      box.appendChild(el('h3', '', x.course.title));
      box.appendChild(el('p', '', 'Practical assignments · transparent marking criteria · facilitator feedback'));
      if (x.owner || x.staff) {
        var intro = el('p', '', 'Write a task that asks learners to demonstrate a skill. Each criterion should describe observable evidence and points. Learner work stays inside the HFL LMS.');
        box.appendChild(intro);
      } else {
        box.appendChild(el('p', '', 'Submit work against the listed criteria. Do not include confidential or sensitive personal information. Only add HTTPS evidence links you are allowed to share.'));
      }
      var list = el('div', 'au-list'); box.appendChild(list);
      if (!x.assignments.length) list.appendChild(el('p', '', x.owner || x.staff ? 'No assignments yet. Create a practical task and rubric below.' : 'No reviewed assignments are available for this course yet.'));
      x.assignments.forEach(function (a) { list.appendChild(card(a, x)); });
      if (x.owner || x.staff) { box.appendChild(el('h3', '', editingId ? 'Edit assignment draft' : 'Create an assignment')); box.appendChild(authorForm()); }
      else {
        var certificateActions = row([]);
        certificateActions.appendChild(btn('Check certificate eligibility', function () {
          A.call({ action: 'certificate', course: x.course.key }).then(function (y) {
            if (y.certificate) location.href = 'certificate.html?code=' + encodeURIComponent(y.certificate.code);
            else box.appendChild(say(y.error || 'Course requirements are not complete yet.', true));
          });
        }));
        var finalLink = el('a', 'btn btn-ghost', 'Open final check'); finalLink.href = 'quiz.html?course=' + encodeURIComponent(x.course.key); certificateActions.appendChild(finalLink);
        box.appendChild(certificateActions);
      }
    });
  }

  function card(a, context) {
    var d = el('article', 'au-card');
    d.appendChild(el('strong', '', a.title));
    d.appendChild(el('p', 'au-status', stateLine(a.status)));
    if (a.review_note) d.appendChild(say('Facilitator note: ' + a.review_note));
    d.appendChild(el('p', '', a.directions));
    d.appendChild(el('p', 'au-status', a.certificate_required ? 'Certificate requirement · pass this rubric at ' + a.pass_percent + '% or higher.' : 'Optional practice · does not affect certificate eligibility.'));
    if (a.outcomes && a.outcomes.length) {
      d.appendChild(el('h4', '', 'What you will demonstrate'));
      var ol = el('ol'); a.outcomes.forEach(function (o) { ol.appendChild(el('li', '', o)); }); d.appendChild(ol);
    }
    d.appendChild(el('h4', '', 'Marking rubric'));
    var table = el('div', 'au-list');
    (a.rubric || []).forEach(function (r) { table.appendChild(el('p', '', r.label + ' · ' + r.max_points + ' points' + (r.guidance ? ' — ' + r.guidance : ''))); });
    table.appendChild(el('p', '', 'Maximum: ' + (a.rubric || []).reduce(function (n, r) { return n + Number(r.max_points || 0); }, 0) + ' points.'));
    d.appendChild(table);
    if ((context.owner || context.staff) && a.status === 'review' && a.can_review) d.appendChild(reviewForm(a));
    if ((context.owner || context.staff) && ['draft', 'changes'].indexOf(a.status) > -1) {
      if (a.editable) d.appendChild(btn('Edit draft', function () { editingId = a.id; load(); }, 'btn btn-ghost'));
      if (a.can_submit_review) d.appendChild(btn('Send to facilitator', function () {
        api({ action: 'submit_review', assignment_id: a.id }).then(function (x) { if (x.assignment) load(say('Sent to the facilitator for review.')); else d.appendChild(say(x.error || 'Could not submit.', true)); });
      }));
    }
    if ((context.owner || context.staff) && a.status === 'review' && !context.staff) d.appendChild(say('Waiting for a facilitator to review this task and rubric.'));
    if ((context.owner || context.staff) && a.status === 'published') d.appendChild(btn('Review learner submissions', function () { submissions(a, d); }, 'btn btn-ghost'));
    if (!context.owner && !context.staff && a.status === 'published') d.appendChild(learnerForm(a));
    return d;
  }

  function blankDraft() {
    return {
      title: '', directions: '', outcomes: '',
      rubric: [
        { id: 'criterion-1', label: 'Accuracy and safety', guidance: 'Uses correct facts, checks and safe practice.', max_points: 4 },
        { id: 'criterion-2', label: 'Reasoning and method', guidance: 'Shows a clear, repeatable method and explains key decisions.', max_points: 4 },
        { id: 'criterion-3', label: 'Evidence and communication', guidance: 'Provides relevant evidence and a clear handover or conclusion.', max_points: 2 },
      ],
      certificate_required: true,
      pass_percent: 70,
    };
  }

  function authorForm() {
    var draft = blankDraft(), editing = state.assignments.filter(function (a) { return a.id === editingId; })[0];
    if (editing) draft = { title: editing.title, directions: editing.directions, outcomes: (editing.outcomes || []).join('\n'), rubric: (editing.rubric || []).map(function (r) { return { id: r.id, label: r.label, guidance: r.guidance, max_points: r.max_points }; }), certificate_required: !!editing.certificate_required, pass_percent: Number(editing.pass_percent) || 70 };
    var form = el('div', 'au-q'), out = el('div');
    form.appendChild(field('Assignment title', draft.title, function (v) { draft.title = v; }, { max: 140 }));
    form.appendChild(field('Task directions: explain the workplace situation, deliverable and constraints', draft.directions, function (v) { draft.directions = v; }, { area: true, rows: 6, max: 6000 }));
    form.appendChild(field('Observable learning outcomes (one per line)', draft.outcomes, function (v) { draft.outcomes = v; }, { area: true, rows: 4, max: 1200 }));
    var requirement = el('label', 'au-check'), requiredBox = el('input'); requiredBox.type = 'checkbox'; requiredBox.checked = !!draft.certificate_required; requiredBox.addEventListener('change', function () { draft.certificate_required = requiredBox.checked; }); requirement.appendChild(requiredBox); requirement.appendChild(document.createTextNode(' Require this assignment to earn the course certificate.'));
    form.appendChild(requirement);
    form.appendChild(field('Minimum rubric score for certificate (%)', draft.pass_percent, function (v) { draft.pass_percent = Number(v); }, { type: 'number', min: 1, maxValue: 100, step: '1' }));
    var rubricBox = el('div', 'au-list'); rubricBox.appendChild(el('h4', '', 'Marking criteria'));
    function drawRubric() {
      rubricBox.textContent = '';
      rubricBox.appendChild(el('h4', '', 'Marking criteria'));
      draft.rubric.forEach(function (r, i) {
        var g = el('div', 'au-q');
        g.appendChild(field('Criterion ' + (i + 1), r.label, function (v) { r.label = v; }, { max: 120 }));
        g.appendChild(field('What good evidence looks like', r.guidance, function (v) { r.guidance = v; }, { area: true, rows: 2, max: 500 }));
        g.appendChild(field('Maximum points', r.max_points, function (v) { r.max_points = Number(v) || 0; }, { type: 'number', min: 1, maxValue: 100, step: '0.01' }));
        if (draft.rubric.length > 2) g.appendChild(btn('Remove criterion', function () { draft.rubric.splice(i, 1); drawRubric(); }, 'btn btn-ghost'));
        rubricBox.appendChild(g);
      });
      if (draft.rubric.length < 8) rubricBox.appendChild(btn('Add criterion', function () { var n = 1; while (draft.rubric.some(function (r) { return r.id === 'criterion-' + n; })) n++; draft.rubric.push({ id: 'criterion-' + n, label: '', guidance: '', max_points: 1 }); drawRubric(); }, 'btn btn-ghost'));
    }
    drawRubric(); form.appendChild(rubricBox);
    form.appendChild(el('p', 'au-hint', 'Keep directions specific. Avoid requesting confidential records or sensitive personal details.'));
    var save = btn(editing ? 'Save draft changes' : 'Save assignment draft', function () {
      out.textContent = '';
      var payload = { action: editing ? 'update' : 'create', course_id: courseId, assignment_id: editingId || undefined, title: draft.title, directions: draft.directions, outcomes: draft.outcomes.split('\n'), rubric: draft.rubric, certificate_required: draft.certificate_required, pass_percent: draft.pass_percent };
      api(payload).then(function (x) {
        if (x.assignment) { editingId = ''; load(say('Draft saved. Submit it for facilitator review when it is ready.')); }
        else out.appendChild(say(x.error || 'Could not save the assignment.', true));
      });
    });
    form.appendChild(save); form.appendChild(out); return form;
  }

  function reviewForm(a) {
    var d = el('div', 'au-q'), note = '', out = el('div');
    d.appendChild(field('Review note for the author', '', function (v) { note = v; }, { area: true, rows: 3, max: 1000 }));
    d.appendChild(row([
      btn('Approve assignment', function () { decide('approve'); }),
      btn('Request changes', function () { decide('changes'); }, 'btn btn-ghost'),
    ]));
    d.appendChild(out);
    function decide(decision) {
      api({ action: 'review', assignment_id: a.id, decision: decision, note: note }).then(function (x) {
        if (x.assignment) load(say(decision === 'approve' ? 'Assignment published.' : 'Changes requested.'));
        else out.appendChild(say(x.error || 'Could not save the review.', true));
      });
    }
    return d;
  }

  function learnerForm(a) {
    var d = el('div', 'au-q'), old = a.my_submission, response = old ? old.response : '', evidence = old ? old.evidence_url : '', out = el('div');
    if (old) {
      d.appendChild(el('p', 'au-status', 'Attempt ' + old.attempt + ' · ' + (old.status === 'graded' ? 'Feedback available' : 'Submitted for review')));
      if (old.status === 'graded') {
        d.appendChild(el('p', '', 'Score: ' + old.score + ' / ' + old.max_points + ' points.'));
        if (a.certificate_required) { var learnerPass = Number(old.max_points) > 0 && Math.round(100 * Number(old.score) / Number(old.max_points)) >= Number(a.pass_percent || 70); d.appendChild(el('p', 'au-status', learnerPass ? 'Meets this assignment’s ' + a.pass_percent + '% certificate threshold.' : 'Does not yet meet the ' + a.pass_percent + '% certificate threshold.')); }
        if (old.feedback) d.appendChild(say('Facilitator feedback: ' + old.feedback));
        (old.rubric_scores || []).forEach(function (r) { d.appendChild(el('p', '', r.label + ': ' + r.points + ' / ' + r.max_points)); });
      }
    }
    d.appendChild(field(old ? 'Revise your work (submitting creates a new attempt)' : 'Your response', response, function (v) { response = v; }, { area: true, rows: 7, max: 30000 }));
    d.appendChild(field('Optional evidence link (HTTPS, only if you have permission to share it)', evidence, function (v) { evidence = v; }, { max: 500 }));
    d.appendChild(btn(old ? 'Submit a new attempt' : 'Submit for marking', function () {
      out.textContent = '';
      var link = evidence.trim();
      if (link && !cleanUrl(link)) { out.appendChild(say('Use an HTTPS evidence link.', true)); return; }
      api({ action: 'submit', assignment_id: a.id, response: response, evidence_url: link }).then(function (x) {
        if (x.submitted) load(say('Attempt ' + x.submitted.attempt + ' submitted.'));
        else out.appendChild(say(x.error || 'Could not submit your work.', true));
      });
    }));
    d.appendChild(out); return d;
  }

  function submissions(a, container) {
    api({ action: 'submissions', assignment_id: a.id }).then(function (x) {
      var panel = el('div', 'au-list'); container.appendChild(panel);
      if (x.status !== 200) { panel.appendChild(say(x.error || 'Could not load submissions.', true)); return; }
      if (!x.submissions.length) { panel.appendChild(el('p', '', 'No submissions yet.')); return; }
      x.submissions.forEach(function (s) { panel.appendChild(gradeForm(a, s)); });
    });
  }

  function gradeForm(a, s) {
    var d = el('div', 'au-q'), scores = {}, feedback = s.feedback || '', out = el('div');
    d.appendChild(el('strong', '', s.learner + ' · attempt ' + s.attempt + (s.status === 'graded' ? ' · ' + s.score + '/' + s.max_points : ' · awaiting marking')));
    d.appendChild(el('p', '', s.response));
    if (s.evidence_url && cleanUrl(s.evidence_url)) { var link = el('a', 'btn btn-ghost', 'Open evidence link'); link.href = s.evidence_url; link.target = '_blank'; link.rel = 'noopener noreferrer'; d.appendChild(link); }
    (a.rubric || []).forEach(function (r) {
      var previous = (s.rubric_scores || []).filter(function (x) { return x.id === r.id; })[0];
      scores[r.id] = previous ? previous.points : 0;
      d.appendChild(field(r.label + ' · max ' + r.max_points + ' points', scores[r.id], function (v) { scores[r.id] = Number(v); }, { type: 'number', min: 0, maxValue: Number(r.max_points), step: '0.01' }));
    });
    d.appendChild(field('Feedback for the learner', feedback, function (v) { feedback = v; }, { area: true, rows: 3, max: 4000 }));
    d.appendChild(btn(s.status === 'graded' ? 'Update marking' : 'Save marking', function () {
      out.textContent = '';
      var rubricScores = (a.rubric || []).map(function (r) { return { id: r.id, points: scores[r.id] }; });
      api({ action: 'grade', submission_id: s.id, rubric_scores: rubricScores, feedback: feedback }).then(function (x) {
        if (x.graded) { s.status = 'graded'; s.score = x.graded.score; s.max_points = x.graded.max_points; d.insertBefore(say('Marking saved.'), out); }
        else out.appendChild(say(x.error || 'Could not save marking.', true));
      });
    }));
    d.appendChild(out); return d;
  }
})();
