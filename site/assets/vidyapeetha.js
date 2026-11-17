/* HFL Vidyapeetha screens, chosen by <div id="vp-box" data-vp="...">: join (tutor sign-up + proctored safety exam),
   tutors (verified list), complaints (fixed protocol), transcript (credits + badges + public badge check), desk (moderation).
   Talks to /api/vidyapeetha. Text is always set with textContent. */
(function () {
  var box = document.getElementById('vp-box'); if (!box) return;
  var kind = box.getAttribute('data-vp'), API = '/api/vidyapeetha';
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function add(p) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) p.appendChild(arguments[i]); return p; }
  function link(h, t, c) { var a = el('a', c || 'btn', t); a.href = h; return a; }
  function btn(t, fn, c) { var b = el('button', c || 'btn', t); b.type = 'button'; b.addEventListener('click', fn); return b; }
  function say(msg, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), msg); p.setAttribute('role', 'status'); return p; }
  function dt(v) { if (!v) return ''; try { return new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return v; } }
  function signedIn() { return /(?:^|; )hfl_in=1/.test(document.cookie); }
  function call(action, data) {
    var b = data || {}; b.action = action;
    return fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'Please try again in a moment'); return j; }); });
  }
  function field(form, label, name, val, opt) {
    opt = opt || {}; var l = el('label', '', label), i;
    if (opt.options) { i = el('select'); opt.options.forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; i.appendChild(op); }); }
    else if (opt.area) { i = el('textarea'); }
    else { i = el('input'); i.type = opt.type || 'text'; }
    i.name = name; if (val != null) i.value = val; if (opt.max) i.maxLength = opt.max; if (opt.required) i.required = true;
    l.appendChild(i); if (opt.hint) l.appendChild(el('span', 'hint', opt.hint)); form.appendChild(l); return i;
  }
  function vals(form) { var o = {}; Array.prototype.forEach.call(form.elements, function (e) { if (e.name) o[e.name] = e.type === 'checkbox' ? e.checked : e.value; }); return o; }
  function upload(kindOf, file) {
    if (!file) return Promise.reject(new Error('Choose a file first'));
    if (file.size > 5 * 1024 * 1024) return Promise.reject(new Error('The file is larger than 5 MB'));
    return call('upload_url', { kind: kindOf, type: file.type }).then(function (u) {
      return fetch(u.upload, { method: 'PUT', headers: { 'Content-Type': file.type, 'x-upsert': 'false' }, body: file }).then(function (r) { if (!r.ok) throw new Error('Upload failed. Please try again.'); return u.path; });
    });
  }
  function needSignIn(next) { add(box, el('p', '', 'Please sign in with your member account first.'), link('login.html?next=' + encodeURIComponent(next), 'Member sign in')); }
  function fail(e) { box.appendChild(say(e.message || String(e), true)); }

  /* ---------- tutor sign-up ---------- */
  function join() {
    box.textContent = '';
    if (!signedIn()) return needSignIn('tutor-join.html');
    call('tutor_state').then(function (st) {
      var t = st.tutor || {}, miss = st.missing || [];
      var pill = el('span', 'vp-pill ' + (t.live ? 'green' : t.status === 'suspended' || t.status === 'removed' ? 'red' : 'amber'),
        t.live ? 'Verified until ' + dt(t.pccValidUntil) : ({ applied: 'Application started', ready: 'With the desk for checking', renewal: 'Police clearance out of date', suspended: 'On hold', removed: 'Removed' })[t.status] || 'Not started');
      add(box, add(el('p'), el('strong', '', 'Your status: '), pill));
      if (t.statusNote) box.appendChild(el('p', '', 'Desk note: ' + t.statusNote));
      var steps = el('ol', 'vp-steps');
      [['Your details and two references', !!(t.name && t.ref1 && t.ref2)], ['Photo ID uploaded', !!t.hasId], ['Police clearance uploaded, with its date', !!(t.hasPcc && t.pccIssuedOn)],
        ['Safety exam passed (' + st.pass + '% or more)', t.trainingPct >= st.pass], ['Desk check: documents and reference calls', !!t.live]]
        .forEach(function (s, i) { add(steps, el('li', s[1] ? 'ok' : 'todo', (i + 1) + '. ' + s[0] + (s[1] ? '  (done)' : '  (to do)'))); });
      box.appendChild(steps);

      box.appendChild(el('h3', '', 'Step 1. Your details'));
      var f = el('form', 'vp-form'); f.noValidate = true;
      field(f, 'Full name, as on your ID', 'name', t.name, { max: 120 });
      field(f, 'Phone', 'phone', t.phone, { type: 'tel', max: 30 });
      field(f, 'Country', 'country', t.country, { max: 60 });
      field(f, 'City', 'city', t.city, { max: 80 });
      field(f, 'Area where you live now', 'area', t.area, { max: 120, hint: 'Your police clearance must come from the police of this area. If you move, you need a new one.' });
      field(f, 'Subjects you teach', 'subjects', t.subjects, { max: 300 });
      field(f, 'Languages you teach in', 'languages', t.languages, { max: 200 });
      var hv = el('label', 'vp-check'); var cb = el('input'); cb.type = 'checkbox'; cb.name = 'homeVisits'; cb.checked = !!t.homeVisits; add(hv, cb, el('span', '', 'I will visit learners at their homes. (Stricter rules: police clearance renewed every 3 months, random home-visit checks, a parent must be at home for any child.)')); f.appendChild(hv);
      field(f, 'Type of photo ID', 'idType', t.idType || 'Aadhaar', { options: [['Aadhaar', 'Aadhaar'], ['Emirates ID', 'Emirates ID'], ['Passport', 'Passport'], ['National ID', 'Other national ID'], ['Driving licence', 'Driving licence']] });
      field(f, 'Police clearance issued by', 'pccIssuer', t.pccIssuer, { max: 160, hint: 'For example: the local police station, Passport Seva (India), or the police Good Conduct Certificate (UAE).' });
      field(f, 'Date on the police clearance', 'pccIssuedOn', t.pccIssuedOn, { type: 'date', hint: 'Must be less than 6 months old (less than 3 months for home visits).' });
      field(f, 'Reference 1 (name, relation and phone)', 'ref1', t.ref1, { max: 200 });
      field(f, 'Reference 2 (one must be a work reference)', 'ref2', t.ref2, { max: 200 });
      var msg = el('div');
      add(f, btn('Save my details', function () { msg.textContent = ''; call('tutor_save', vals(f)).then(function () { join(); }).catch(function (e) { msg.appendChild(say(e.message, true)); }); }), msg);
      box.appendChild(f);

      box.appendChild(el('h3', '', 'Steps 2 and 3. Upload your documents'));
      box.appendChild(el('p', '', 'PDF, JPG or PNG, up to 5 MB. Only the desk can open these files. The public sees only "Verified, valid until (date)".'));
      [['id', 'Photo ID', t.hasId], ['pcc', 'Police clearance certificate', t.hasPcc]].forEach(function (d) {
        var row = el('div', 'vp-card vp-row'), inp = el('input'); inp.type = 'file'; inp.accept = 'application/pdf,image/jpeg,image/png'; inp.setAttribute('aria-label', d[1]);
        var m = el('span');
        add(row, el('strong', '', d[1] + (d[2] ? ' (uploaded)' : '')), inp, btn('Upload', function () {
          m.textContent = 'Uploading...';
          upload(d[0], inp.files[0]).then(function (path) { return call('file_done', { kind: d[0], path: path }); }).then(function () { join(); }).catch(function (e) { m.textContent = e.message; });
        }, 'btn btn-ghost'), m);
        box.appendChild(row);
      });

      box.appendChild(el('h3', '', 'Step 4. Safety exam'));
      box.appendChild(el('p', '', '10 questions, 15 minutes, pass mark ' + st.pass + '%. The exam opens full screen. Leaving the page, leaving full screen or pasting is recorded and shown to the desk.'));
      box.appendChild(t.name ? btn(t.trainingPct >= st.pass ? 'Take the exam again' : 'Start the safety exam', exam) : el('p', '', 'Save your details first.'));
      if (t.trainingPct != null) box.appendChild(el('p', '', 'Your best score: ' + t.trainingPct + '%.'));

      box.appendChild(el('h3', '', 'Step 5. Send to the desk'));
      if (miss.length) box.appendChild(el('p', '', 'Still needed: ' + miss.join(', ') + '.'));
      else if (!t.live) box.appendChild(btn('Send my application to the desk', function () { call('tutor_submit').then(function () { join(); }).catch(fail); }));
      add(box, el('p', '', 'Rules for every tutor: book only through the platform; check in and out at every home visit; a parent or guardian at home for any child; random checks by our assessors may happen at any time; matters go through the fixed complaints form.'));
    }).catch(fail);
  }

  function exam() {
    call('exam_paper').then(function (p) {
      box.textContent = '';
      var log = { leftPage: 0, exitedFullScreen: 0, pasteTries: 0, overTime: false }, done = false, ends = Date.now() + p.minutes * 60000;
      var wrap = el('div', 'vp-exam'), timer = el('div', 'vp-timer'); timer.setAttribute('aria-live', 'off'); wrap.appendChild(timer);
      var f = el('form'); f.noValidate = true;
      p.questions.forEach(function (q, i) {
        var fs = el('fieldset'); fs.appendChild(el('legend', '', (i + 1) + '. ' + q.q));
        q.o.forEach(function (o, j) { var l = el('label'), r = el('input'); r.type = 'radio'; r.name = 'q' + i; r.value = j; add(l, r, el('span', '', o)); fs.appendChild(l); });
        f.appendChild(fs);
      });
      add(wrap, f, btn('Submit my answers', function () { finish(); }));
      box.appendChild(wrap);
      try { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); } catch (e) {}
      function onVis() { if (document.hidden) log.leftPage++; }
      function onFs() { if (!document.fullscreenElement) log.exitedFullScreen++; }
      function onPaste(e) { e.preventDefault(); log.pasteTries++; }
      document.addEventListener('visibilitychange', onVis); document.addEventListener('fullscreenchange', onFs);
      ['paste', 'copy', 'cut', 'contextmenu'].forEach(function (ev) { wrap.addEventListener(ev, onPaste); });
      var tick = setInterval(function () { var left = Math.max(0, ends - Date.now()); timer.textContent = 'Time left: ' + Math.floor(left / 60000) + ' min ' + Math.floor(left % 60000 / 1000) + ' s'; if (!left) { log.overTime = true; finish(); } }, 500);
      function finish() {
        if (done) return; done = true; clearInterval(tick);
        document.removeEventListener('visibilitychange', onVis); document.removeEventListener('fullscreenchange', onFs);
        try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
        var ans = p.questions.map(function (q, i) { var c = f.querySelector('input[name="q' + i + '"]:checked'); return c ? Number(c.value) : -1; });
        call('exam_submit', { answers: ans, integrity: log }).then(function (r) {
          box.textContent = '';
          add(box, say('You scored ' + r.pct + '%. ' + (r.passed ? 'Passed.' : 'You need ' + r.pass + '% to pass. You can try again.'), !r.passed));
          if (r.flags) box.appendChild(el('p', '', 'The exam recorded ' + r.flags + ' integrity event(s) (leaving the page, leaving full screen or pasting). The desk will see this.'));
          box.appendChild(btn('Back to my application', join));
        }).catch(fail);
      }
    }).catch(fail);
  }

  /* ---------- verified tutors (public) ---------- */
  function tutors() {
    call('tutors').then(function (r) {
      box.textContent = '';
      if (!r.tutors.length) { box.appendChild(el('p', '', 'The first tutors are being verified now. Please check again soon.')); return; }
      var tb = el('table', 'vp-table'), h = el('tr');
      ['Tutor', 'Subjects', 'Languages', 'City', 'Home visits', 'Police clearance valid until'].forEach(function (x) { h.appendChild(el('th', '', x)); });
      add(tb, add(el('thead'), h)); var bd = el('tbody');
      r.tutors.forEach(function (t) { var tr = el('tr'); [t.name, t.subjects, t.languages, [t.city, t.country].filter(Boolean).join(', '), t.homeVisits ? 'Yes' : 'No', dt(t.validUntil)].forEach(function (v) { tr.appendChild(el('td', '', v)); }); bd.appendChild(tr); });
      tb.appendChild(bd); box.appendChild(tb);
    }).catch(function (e) { box.textContent = ''; fail(e); });
  }

  /* ---------- complaints (fixed protocol) ---------- */
  var STAGE = { lodged: 'Received', review: 'Under review', decided: 'Decided', appeal: 'Under appeal', final: 'Closed (final)' };
  function complaints() {
    box.textContent = '';
    if (!signedIn()) return needSignIn('complaints.html');
    var f = el('form', 'vp-form'); f.noValidate = true;
    field(f, 'What is it about?', 'category', '', { options: [['', 'Choose one'], ['safety', 'Safety: someone may be in danger (handled first)'], ['conduct', 'Conduct of a tutor or learner'], ['quality', 'Quality of a course or lesson'], ['payment', 'Payment or refund'], ['other', 'Something else']] });
    field(f, 'Booking or course reference (if any)', 'bookingRef', '', { max: 60 });
    field(f, 'Name of the tutor concerned (if any)', 'tutor', '', { max: 120 });
    var facts = field(f, 'The facts: what happened, when and where', 'facts', '', { area: true, max: 500, hint: 'Facts only, up to 500 characters. The desk decides on facts.' });
    var count = el('span', 'hint', '0 / 500'); facts.addEventListener('input', function () { count.textContent = facts.value.length + ' / 500'; }); f.appendChild(count);
    var ev = el('input'); ev.type = 'file'; ev.accept = 'application/pdf,image/jpeg,image/png'; add(f, add(el('label', '', 'Evidence (optional): PDF, JPG or PNG up to 5 MB'), ev));
    var ack = el('label', 'vp-check'), ackb = el('input'); ackb.type = 'checkbox'; add(ack, ackb, el('span', '', 'I confirm these facts are true. I understand the steps: received within 24 hours, decision within 5 working days, one appeal within 7 days, then final.')); f.appendChild(ack);
    var msg = el('div');
    add(f, btn('Send', function () {
      msg.textContent = '';
      if (!ackb.checked) { msg.appendChild(say('Please tick the confirmation first.', true)); return; }
      var v = vals(f), file = ev.files[0];
      (file ? upload('evidence', file) : Promise.resolve('')).then(function (path) { v.evidence = path; return call('case_lodge', v); })
        .then(function (r) { box.textContent = ''; add(box, say('Case ' + r.case.caseNo + ' received. ' + (r.case.safety ? 'Safety cases are handled first.' : 'You will get a decision by ' + dt(r.case.reviewBy) + '.'))); setTimeout(complaints, 2500); })
        .catch(function (e) { msg.appendChild(say(e.message, true)); });
    }), msg);
    add(box, el('p', '', 'If anyone is in danger right now, call your local police first (India 112, UAE 999), then tell us here.'), f, el('h3', '', 'My cases'));
    var list = el('div'); box.appendChild(list);
    call('case_mine').then(function (r) {
      if (!r.cases.length) { list.appendChild(el('p', '', 'You have no cases.')); return; }
      r.cases.forEach(function (c) {
        var card = el('div', 'vp-card');
        add(card, add(el('p'), el('strong', '', c.caseNo + '  '), el('span', 'vp-pill ' + (c.stage === 'final' ? 'green' : 'amber'), STAGE[c.stage] || c.stage)),
          el('p', '', c.category + (c.bookingRef ? ', ' + c.bookingRef : '') + '. Sent ' + dt(c.at) + '.'), el('p', '', c.facts));
        if (c.decision) card.appendChild(el('p', '', 'Decision: ' + c.decision.replace('_', ' ') + '. ' + c.decisionNote));
        if (c.canAppeal) {
          var ta = el('textarea'); ta.maxLength = 500; ta.setAttribute('aria-label', 'New facts for the appeal');
          add(card, ta, btn('Appeal (once only)', function () { call('case_appeal', { caseNo: c.caseNo, text: ta.value }).then(complaints).catch(function (e) { card.appendChild(say(e.message, true)); }); }, 'btn btn-ghost'));
        }
        list.appendChild(card);
      });
    }).catch(function (e) { list.appendChild(say(e.message, true)); });
  }

  /* ---------- transcript, badges and public badge check ---------- */
  function verifier() {
    var w = el('div', 'vp-card vp-noprint'), f = el('form', 'vp-form'); f.noValidate = true;
    var inp = field(f, 'Badge code (HB-XXXX-XXXX)', 'code', new URLSearchParams(location.search).get('badge') || '', { max: 12 });
    var out = el('div');
    function check() {
      out.textContent = '';
      call('badge_verify', { code: inp.value.trim() }).then(function (r) {
        if (!r.badge) { out.appendChild(say('No badge has this code.', true)); return; }
        var b = r.badge;
        add(out, say(r.valid ? 'Genuine badge.' : r.revoked ? 'This badge was withdrawn.' : 'Warning: this record does not match its chain. Please contact us.', !r.valid),
          el('p', '', b.title + ', held by ' + b.holder + ', issued ' + dt(b.issuedAt) + (b.credits ? ', ' + b.credits + ' credit(s)' : '') + '.'), el('p', 'vp-hash', 'Fingerprint: ' + b.hash));
      }).catch(function (e) { out.appendChild(say(e.message, true)); });
    }
    add(f, btn('Check badge', check), out); add(w, el('h3', '', 'Check a badge'), el('p', '', 'Anyone can check a badge. Each badge carries a fingerprint linked to the badge before it, so a changed record shows at once.'), f);
    if (inp.value) check();
    return w;
  }
  function transcript() {
    box.textContent = '';
    if (!signedIn()) { needSignIn('transcript.html'); box.appendChild(verifier()); return; }
    call('transcript').then(function (r) {
      add(box, add(el('p'), el('strong', '', 'Holder: '), document.createTextNode(r.holder || '')), add(el('p'), el('strong', '', 'Total credits: '), document.createTextNode(r.total + ' (1 credit = 30 learning hours)')));
      var badged = {}; r.badges.forEach(function (b) { badged[b.title] = b; });
      if (!r.rows.length) box.appendChild(el('p', '', 'No certificates yet. Finish a course and pass its final check to start your transcript.'));
      else {
        var tb = el('table', 'vp-table'), h = el('tr');
        ['Course', 'Score', 'Credits', 'Certificate', 'Issued', 'Badge'].forEach(function (x) { h.appendChild(el('th', '', x)); });
        add(tb, add(el('thead'), h)); var bd = el('tbody');
        r.rows.forEach(function (c) {
          var tr = el('tr'); [c.title + (c.programme ? ' (' + c.programme + ')' : ''), c.pct + '%', c.credits ? String(c.credits) : 'not rated yet', c.code, dt(c.at)].forEach(function (v) { tr.appendChild(el('td', '', v)); });
          var td = el('td'); if (badged[c.title]) td.appendChild(link('transcript.html?badge=' + badged[c.title].code, badged[c.title].code, ''));
          else td.appendChild(btn('Make badge', function () { call('badge_claim', { course: c.course }).then(transcript).catch(fail); }, 'btn btn-sm btn-ghost'));
          tr.appendChild(td); bd.appendChild(tr);
        });
        tb.appendChild(bd); box.appendChild(tb);
      }
      if (r.badges.length) {
        box.appendChild(el('h3', '', 'My badges'));
        var ul = el('ul'); r.badges.forEach(function (b) { var li = el('li', '', b.title + ' (' + b.kind + '), code '); li.appendChild(link('transcript.html?badge=' + b.code, b.code, '')); if (b.revoked) li.appendChild(document.createTextNode(' (withdrawn)')); ul.appendChild(li); }); box.appendChild(ul);
      }
      add(box, btn('Print my transcript', function () { window.print(); }, 'btn btn-ghost vp-noprint'), verifier());
    }).catch(function (e) { fail(e); box.appendChild(verifier()); });
  }

  /* ---------- moderation desk ---------- */
  function desk() {
    box.textContent = '';
    if (!signedIn()) return needSignIn('vidyapeetha-desk.html');
    call('desk').then(function (d) {
      function tutorCard(t, renew) {
        var c = el('div', 'vp-card');
        add(c, add(el('p'), el('strong', '', t.name + '  '), el('span', 'vp-pill ' + (t.live ? 'green' : 'amber'), t.status)),
          el('p', '', [t.city, t.area, t.country].filter(Boolean).join(', ') + '. ' + (t.homeVisits ? 'HOME VISITS (3-month clearance).' : '12-month clearance.') + ' Subjects: ' + t.subjects),
          el('p', '', 'Police clearance: ' + (t.pccIssuer || '-') + ', issued ' + dt(t.pccIssuedOn) + (t.pccValidUntil ? ', valid until ' + dt(t.pccValidUntil) : '') + (t.cap ? '. Latest allowed: ' + dt(t.cap) : '')),
          el('p', '', 'References: ' + t.ref1 + ' | ' + t.ref2), el('p', '', 'Safety exam: ' + (t.trainingPct == null ? 'not taken' : t.trainingPct + '%, integrity events ' + (t.trainingFlags || 0))));
        if (t.missing.length) c.appendChild(say('Missing: ' + t.missing.join(', '), true));
        var r = el('div', 'vp-row vp-noprint');
        ['id', 'pcc'].forEach(function (k) { r.appendChild(btn(k === 'id' ? 'Open ID' : 'Open police clearance', function () { call('desk_file', { tutor: t.id, kind: k }).then(function (x) { window.open(x.url, '_blank', 'noopener'); }).catch(function (e) { c.appendChild(say(e.message, true)); }); }, 'btn btn-sm btn-ghost')); });
        var until = el('input'); until.type = 'date'; until.value = t.cap || ''; until.setAttribute('aria-label', 'Valid until');
        var nt = el('input'); nt.placeholder = 'Note'; nt.setAttribute('aria-label', 'Desk note');
        add(r, until, nt);
        (renew ? [['reinstate', 'Reinstate'], ['suspend', 'Suspend'], ['remove', 'Remove']] : [['verify', 'Verify'], ['reject', 'Send back'], ['remove', 'Remove']]).forEach(function (a) {
          r.appendChild(btn(a[1], function () { call('desk_verify', { tutor: t.id, decision: a[0], validUntil: until.value, note: nt.value }).then(desk).catch(function (e) { c.appendChild(say(e.message, true)); }); }, 'btn btn-sm'));
        });
        r.appendChild(btn('Order a random check', function () { call('desk_audit_new', { tutor: t.id, kind: t.homeVisits ? 'random_home_visit' : 'document_recheck', note: nt.value }).then(desk).catch(function (e) { c.appendChild(say(e.message, true)); }); }, 'btn btn-sm btn-ghost'));
        c.appendChild(r); return c;
      }
      box.appendChild(el('h3', '', '1. Cases (' + d.cases.length + ' open, safety first)'));
      d.cases.forEach(function (k) {
        var c = el('div', 'vp-card');
        add(c, add(el('p'), el('strong', '', k.caseNo + '  '), el('span', 'vp-pill ' + (k.safety ? 'red' : 'amber'), (k.safety ? 'SAFETY, ' : '') + (STAGE[k.stage] || k.stage))),
          el('p', '', k.category + (k.tutor ? ', tutor ' + k.tutor : '') + (k.bookingRef ? ', ref ' + k.bookingRef : '') + '. Sent ' + dt(k.at) + '. Decide by ' + dt(k.reviewBy) + '.'), el('p', '', k.facts));
        if (k.appeal) c.appendChild(el('p', '', 'Appeal: ' + k.appeal + ' (earlier decision: ' + k.decision + ')'));
        var r = el('div', 'vp-row vp-noprint'), sel = el('select'); sel.setAttribute('aria-label', 'Decision');
        [['no_action', 'No action'], ['warning', 'Warning'], ['refund', 'Refund'], ['course_removed', 'Remove course'], ['suspended', 'Suspend tutor'], ['removed', 'Remove tutor']].forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; sel.appendChild(op); });
        var nt = el('input'); nt.placeholder = 'Reason (sent to the reporter)'; nt.setAttribute('aria-label', 'Reason');
        if (k.stage === 'lodged') r.appendChild(btn('Acknowledge and review', function () { call('desk_case', { caseNo: k.caseNo, step: 'review' }).then(desk).catch(function (e) { c.appendChild(say(e.message, true)); }); }, 'btn btn-sm btn-ghost'));
        add(r, sel, nt, btn(k.stage === 'appeal' ? 'Final decision' : 'Decide', function () { call('desk_case', { caseNo: k.caseNo, decision: sel.value, note: nt.value }).then(desk).catch(function (e) { c.appendChild(say(e.message, true)); }); }, 'btn btn-sm'));
        c.appendChild(r); box.appendChild(c);
      });
      box.appendChild(el('h3', '', '2. Tutors waiting for a check (' + d.queue.length + ')'));
      d.queue.forEach(function (t) { box.appendChild(tutorCard(t, false)); });
      box.appendChild(el('h3', '', '3. Police clearance running out or out of date (' + d.expiring.length + ')'));
      d.expiring.forEach(function (t) { box.appendChild(tutorCard(t, true)); });
      box.appendChild(el('h3', '', '4. Random checks by our assessors (' + d.audits.length + ' open)'));
      d.audits.forEach(function (a) {
        var c = el('div', 'vp-card'), nt = el('input'); nt.placeholder = 'What the assessor found'; nt.setAttribute('aria-label', 'Finding');
        add(c, el('p', '', a.tutor + ': ' + a.kind.replace(/_/g, ' ') + ', due ' + dt(a.due) + '. ' + a.note),
          add(el('div', 'vp-row'), nt, btn('Pass', function () { call('desk_audit', { id: a.id, result: 'pass', note: nt.value }).then(desk); }, 'btn btn-sm'), btn('Fail (suspends tutor)', function () { call('desk_audit', { id: a.id, result: 'fail', note: nt.value }).then(desk); }, 'btn btn-sm btn-ghost')));
        box.appendChild(c);
      });
      box.appendChild(el('h3', '', '5. Course credits (1 credit = 30 learning hours)'));
      var f = el('form', 'vp-form'); f.noValidate = true;
      field(f, 'Course file name', 'course', '', { max: 130, hint: 'For example course-eu-01.html' });
      field(f, 'Course title', 'title', '', { max: 160 });
      field(f, 'Credits (1 to 30)', 'credits', '', { type: 'number' });
      field(f, 'Offering', 'offering', 'B', { options: [['A', 'A. Programme module'], ['B', 'B. Lifelong short course'], ['C', 'C. Skill credential']] });
      field(f, 'Programme (for offering A)', 'programme', '', { max: 120 });
      var m = el('div'); add(f, btn('Save credit rating', function () { m.textContent = ''; call('desk_credit', vals(f)).then(desk).catch(function (e) { m.appendChild(say(e.message, true)); }); }), m);
      box.appendChild(f);
      if (d.credits.length) { var tb = el('table', 'vp-table'); add(tb, add(el('tr'), el('th', '', 'Course'), el('th', '', 'Credits'), el('th', '', 'Offering'), el('th', '', 'Programme'))); d.credits.forEach(function (c) { add(tb, add(el('tr'), el('td', '', c.title || c.course), el('td', '', String(c.credits)), el('td', '', c.offering), el('td', '', c.programme))); }); box.appendChild(tb); }
    }).catch(fail);
  }

  ({ join: join, tutors: tutors, complaints: complaints, transcript: transcript, desk: desk })[kind]();
})();
