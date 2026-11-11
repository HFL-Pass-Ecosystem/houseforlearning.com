/* LMS screens: join and test pay, final check, certificate, My courses, facilitator report. One script, chosen by <main data-lms="...">.
   Talks to /api/lms through HFLAccess (assets/access.js). Text is always set with textContent. */
(function () {
  var main = document.querySelector('main[data-lms]'); if (!main) return;
  var kind = main.getAttribute('data-lms'); if (kind === 'author' || kind === 'play' || kind === 'board' || kind === 'home') return; /* these two have their own scripts */
  var box = document.getElementById('lms-box'), A = window.HFLAccess;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function link(h, t, c) { var a = el('a', c || 'btn', t); a.href = h; return a; }
  function q(n) { var m = new RegExp('[?&]' + n + '=([^&]*)').exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; }
  function say(msg, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), msg); p.setAttribute('role', 'status'); return p; }
  function bar(c, t) { var w = el('div', 'acc-prog'); w.setAttribute('role', 'progressbar'); w.setAttribute('aria-valuemin', '0'); w.setAttribute('aria-valuemax', String(t)); w.setAttribute('aria-valuenow', String(c)); var s = el('span'); s.setAttribute('data-w', String(t ? Math.round(100 * c / t) : 0)); w.appendChild(s); return w; }
  function dt(v) { try { return new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } }
  function signin() { box.appendChild(el('p', '', 'Sign in first.')); box.appendChild(link('login.html', 'Sign in')); }
  function needServer(what) {
    box.appendChild(say('To ' + what + ', please sign in with your member account. This browser is in test mode, so it can only keep your place, not grades or certificates.', true));
    box.appendChild(link('login.html', 'Member sign in'));
  }
  A.ready.then(function () { A.paint && A.paint(); run(); });

  function run() {
    box.textContent = '';
    if (kind === 'verify') return certificate();
    if (!A.signedIn()) return signin();
    ({ pay: pay, quiz: quiz, courses: courses, reports: reports })[kind] && ({ pay: pay, quiz: quiz, courses: courses, reports: reports })[kind]();
    A.paint && A.paint();
  }

  /* ---------- join and test pay ---------- */
  function pay() {
    var c = q('course'), t = q('t') || c, n = parseInt(q('n'), 10) || 0;
    if (!/^[a-z0-9._-]+\.html$/i.test(c)) { box.appendChild(say('Choose a course first.')); box.appendChild(link('courses-all.html', 'Browse courses')); return; }
    box.appendChild(el('h3', '', 'Join: ' + t));
    box.appendChild(el('p', '', 'Pay by bank transfer or UPI. In this test no payment is taken: press the button to pretend you have paid. Test only. No real money is taken.'));
    var f = el('fieldset', 'acc-fs'); f.appendChild(el('legend', '', 'How you would pay'));
    [['bank', 'Bank transfer (details are shown here when payments go live)'], ['upi', 'UPI (details are shown here when payments go live)']].forEach(function (o, i) {
      var l = el('label', 'acc-opt'), r = el('input'); r.type = 'radio'; r.name = 'method'; r.value = o[0]; r.checked = i === 0; l.appendChild(r); l.appendChild(document.createTextNode(' ' + o[1])); f.appendChild(l);
    });
    box.appendChild(f);
    var lab = el('label', 'acc-opt', 'Payment reference (optional) '), ref = el('input'); ref.type = 'text'; ref.maxLength = 40; ref.name = 'ref'; lab.appendChild(ref); box.appendChild(lab);
    var b = el('button', 'btn', 'I have paid (test)'); b.type = 'button';
    var out = el('div'); out.setAttribute('aria-live', 'polite');
    b.addEventListener('click', function () {
      b.disabled = true; out.textContent = '';
      var m = box.querySelector('input[name=method]:checked').value;
      A.enrol(c, t, n, m, ref.value).then(function (ok) {
        if (ok) { out.appendChild(say('You are in. Opening your course...')); setTimeout(function () { location.href = c; }, 400); } else { b.disabled = false; out.appendChild(say('Joining did not work. Please try again.', true)); }
      }).catch(function () { b.disabled = false; out.appendChild(say('Joining did not work. Please try again.', true)); });
    });
    box.appendChild(b); var back = link(c, 'Back to the course', ''); back.style.marginLeft = '14px'; box.appendChild(back); box.appendChild(out);
    if (A.mode !== 'server') box.appendChild(say('Test mode: your place is kept in this browser only.'));
  }

  /* ---------- final check ---------- */
  function quiz() {
    var c = q('course'); if (!/^[a-z0-9._-]+\.html$/i.test(c)) { box.appendChild(say('Choose a course first.')); return; }
    if (A.mode !== 'server') return needServer('take the final check');
    var en = ((A.server || {}).enrolments || []).filter(function (e) { return e.course === c; })[0];
    if (!en) { box.appendChild(say('Join this course first.', true)); box.appendChild(link(c, 'Open the course')); return; }
    var authored = /^author-[0-9a-f]{20}\.html$/.test(c);
    (authored
      ? fetch('/api/author', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'play', key: c }) }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (x) { return { title: x.course.title, pass: 70, questions: x.course.quiz }; })
      : fetch('assets/quiz/' + encodeURIComponent(c) + '.json').then(function (r) { if (!r.ok) throw 0; return r.json(); })
    ).then(function (z) {
      box.appendChild(el('h3', '', 'Final check: ' + (z.title || en.title)));
      var done = (en.done || []).length;
      box.appendChild(el('p', '', 'Answer every question. You need ' + z.pass + '% to pass. You may try again as often as you like. Units done: ' + done + ' of ' + en.total + '.'));
      if (en.quiz) box.appendChild(el('p', 'note', 'Your best so far: ' + en.quiz.pct + '%' + (en.quiz.passed ? ' (passed)' : '') + '.'));
      var form = el('form'); form.noValidate = true;
      z.questions.forEach(function (qq, i) {
        var fs = el('fieldset', 'acc-fs'); fs.setAttribute('data-q', String(i)); fs.appendChild(el('legend', '', (i + 1) + '. ' + qq.q));
        qq.o.forEach(function (o, k) { var l = el('label', 'acc-opt'), r = el('input'); r.type = 'radio'; r.name = 'q' + i; r.value = String(k); l.appendChild(r); l.appendChild(document.createTextNode(' ' + o)); fs.appendChild(l); });
        form.appendChild(fs);
      });
      var go = el('button', 'btn', 'Submit my answers'); go.type = 'submit'; form.appendChild(go);
      var res = el('div'); res.setAttribute('aria-live', 'polite');
      form.addEventListener('submit', function (e) {
        e.preventDefault(); res.textContent = '';
        var ans = [], miss = 0;
        z.questions.forEach(function (_, i) { var r = form.querySelector('input[name=q' + i + ']:checked'); if (!r) miss++; ans.push(r ? +r.value : -1); });
        if (miss) { res.appendChild(say('Please answer all ' + z.questions.length + ' questions. ' + miss + ' left.', true)); return; }
        go.disabled = true;
        A.call({ action: 'quiz', course: c, answers: ans }).then(function (x) {
          go.disabled = false;
          if (x.status !== 200) { res.appendChild(say(x.error || 'Something went wrong. Please try again.', true)); return; }
          Array.prototype.forEach.call(form.querySelectorAll('fieldset'), function (fs, i) { fs.classList.toggle('acc-right', !!x.right[i]); fs.classList.toggle('acc-wrong', !x.right[i]); });
          res.appendChild(say('You scored ' + x.score + ' of ' + x.max + ' (' + x.pct + '%). ' + (x.passed ? 'Passed.' : 'Not passed yet: you need ' + x.pass + '%. Check the marked questions and try again.'), !x.passed));
          en.quiz = { pct: Math.max(x.pct, en.quiz ? en.quiz.pct : 0), passed: x.passed || (en.quiz && en.quiz.passed) };
          if (x.passed) {
            if (done >= en.total) { var cb = el('button', 'btn', 'Get my certificate'); cb.type = 'button'; cb.addEventListener('click', function () { A.call({ action: 'certificate', course: c }).then(function (y) { if (y.certificate) location.href = 'certificate.html?code=' + encodeURIComponent(y.certificate.code); else res.appendChild(say(y.error || 'Please try again.', true)); }); }); res.appendChild(cb); }
            else res.appendChild(say('Finish every unit (' + done + ' of ' + en.total + ' done) to receive your certificate.'));
          }
          res.scrollIntoView({ block: 'nearest' });
        });
      });
      box.appendChild(form); box.appendChild(res); box.appendChild(link(authored ? 'learn.html?c=' + encodeURIComponent(c) : c, 'Back to the course', 'btn btn-ghost'));
    }).catch(function () { box.appendChild(say('This course has no final check yet.', true)); box.appendChild(link(c, 'Back to the course')); });
  }

  /* ---------- certificate (public: anyone with the code can check it) ---------- */
  function certificate() {
    var code = q('code').toUpperCase();
    if (!code) { box.appendChild(say('Type a certificate code to check it.')); var f = el('form'), i = el('input'); i.name = 'code'; i.placeholder = 'HFL-XXXX-XXXX-XXXX'; i.setAttribute('aria-label', 'Certificate code'); var b = el('button', 'btn', 'Check'); b.type = 'submit'; f.appendChild(i); f.appendChild(b); f.addEventListener('submit', function (e) { e.preventDefault(); location.search = '?code=' + encodeURIComponent(i.value.trim()); }); box.appendChild(f); return; }
    A.call({ action: 'verify', code: code }).then(function (x) {
      if (x.status !== 200) { box.appendChild(say(x.error || 'Could not check this code right now.', true)); return; }
      if (!x.valid) { box.appendChild(say('We have no certificate with this code. Please check the code and try again.', true)); return; }
      var c = x.certificate, card = el('div', 'cert');
      card.appendChild(el('p', 'cert-k', 'House for Learning'));
      card.appendChild(el('h2', 'cert-h', 'Certificate of completion'));
      card.appendChild(el('p', '', 'This certifies that'));
      card.appendChild(el('p', 'cert-name', c.holder));
      card.appendChild(el('p', '', 'completed every unit and passed the final check for'));
      card.appendChild(el('p', 'cert-course', c.title));
      card.appendChild(el('p', '', 'Final check score: ' + c.pct + '%. Issued ' + dt(c.issued_at) + '.'));
      card.appendChild(el('p', 'cert-code', 'Certificate code ' + c.code));
      box.appendChild(card);
      box.appendChild(say('This code is genuine: it is on our record.'));
      var pr = el('button', 'btn', 'Print or save this page'); pr.type = 'button'; pr.addEventListener('click', function () { window.print(); }); box.appendChild(pr);
    }).catch(function () { box.appendChild(say('Could not check this code right now.', true)); });
  }

  /* ---------- My courses ---------- */
  function courses() {
    var S = A.server;
    if (A.mode !== 'server') return localCourses();
    var u = S.user || {};
    box.appendChild(el('p', '', (u.name ? u.name + ', ' : '') + 'here are your courses.'));
    if (u.staff) { var st = el('p'); st.appendChild(link('reports.html', 'Facilitator report', 'btn btn-ghost')); box.appendChild(st); }
    var tools = el('p'); tools.appendChild(link('home.html', 'Learning home', 'btn btn-ghost')); tools.appendChild(document.createTextNode(' ')); tools.appendChild(link('board.html', 'My board', 'btn btn-ghost')); tools.appendChild(document.createTextNode(' ')); tools.appendChild(link('learn.html', 'Courses by members', 'btn btn-ghost')); tools.appendChild(document.createTextNode(' ')); tools.appendChild(link('author.html', 'Author Studio', 'btn btn-ghost')); box.appendChild(tools);
    var en = S.enrolments || [];
    if (!en.length) { box.appendChild(el('p', '', 'You have no courses yet. Open a course, read the preview, and press Join this course.')); box.appendChild(link('courses-all.html', 'Browse courses')); }
    en.forEach(function (e) {
      var card = el('div', 'acc-card'), l = el('div');
      l.appendChild(el('h3', '', e.title)); var c = (e.done || []).length;
      l.appendChild(el('p', '', c + ' of ' + e.total + ' units done' + (e.status === 'completed' ? ' (all units finished)' : '')));
      l.appendChild(bar(c, e.total));
      var cert = (S.certificates || []).filter(function (x) { return x.course === e.course; })[0];
      var qs = e.quiz ? 'Final check: best ' + e.quiz.pct + '%' + (e.quiz.passed ? ' (passed)' : ' (not passed yet)') + ', ' + e.attempts + (e.attempts === 1 ? ' try' : ' tries') : (e.hasQuiz ? 'Final check: not taken yet' : '');
      if (qs) l.appendChild(el('p', 'note', qs));
      card.appendChild(l);
      var act = el('div', 'acc-act'); act.appendChild(link(e.course, c ? 'Continue' : 'Start'));
      if (e.hasQuiz) act.appendChild(link('quiz.html?course=' + encodeURIComponent(e.course), 'Final check', 'btn btn-ghost'));
      if (cert) act.appendChild(link('certificate.html?code=' + encodeURIComponent(cert.code), 'Certificate', 'btn btn-ghost'));
      card.appendChild(act); box.appendChild(card);
    });
    var nt = S.notifications || [];
    if (nt.length) {
      box.appendChild(el('h3', '', 'Messages for you'));
      var ul = el('ul', 'acc-notes'); nt.forEach(function (n) { var li = el('li', n.read ? '' : 'new', n.body); li.appendChild(el('span', 'note', ' ' + dt(n.at))); ul.appendChild(li); }); box.appendChild(ul);
      if (nt.some(function (n) { return !n.read; })) A.call({ action: 'notes_read' });
    }
    box.appendChild(el('p', 'note', 'Reminders by email and WhatsApp are not switched on yet. These messages appear here.'));
  }
  function localCourses() {
    var d = A.load(), ks = Object.keys(d).filter(function (k) { return d[k] && d[k].paid; });
    box.appendChild(say('Test mode: your courses are kept in this browser only. Sign in with your member account to keep them in your account.'));
    if (!ks.length) { box.appendChild(el('p', '', 'You have no courses yet. Open a course, read the preview, and press Join this course.')); box.appendChild(link('courses-all.html', 'Browse courses')); return; }
    ks.sort(function (a, b) { return (d[b].updated || 0) - (d[a].updated || 0); });
    ks.forEach(function (k) {
      var r = d[k], t = r.total || 0, c = (r.done || []).length, card = el('div', 'acc-card'), l = el('div');
      l.appendChild(el('h3', '', r.title || k)); l.appendChild(el('p', '', t ? c + ' of ' + t + ' units done' : 'Not started')); if (t) l.appendChild(bar(c, t));
      card.appendChild(l); card.appendChild(link(k, c ? 'Continue' : 'Start')); box.appendChild(card);
    });
  }

  /* ---------- facilitator and admin report ---------- */
  function reports() {
    if (A.mode !== 'server') return needServer('see the report');
    if (!(A.server.user || {}).staff) { box.appendChild(say('This page is for facilitators and admins.', true)); return; }
    A.call({ action: 'report' }).then(function (x) {
      if (x.status !== 200) { box.appendChild(say(x.error || 'Could not load the report.', true)); return; }
      var t = x.totals; box.appendChild(el('p', '', t.learners + ' learners, ' + t.enrolments + ' enrolments, ' + t.completed + ' completed.'));
      box.appendChild(el('h3', '', 'By course'));
      var tb = table(['Course', 'Learners', 'Completed', 'Average progress'], x.courses.map(function (c) { return [c.title, c.learners, c.completed, c.avg + '%']; })); box.appendChild(tb);
      box.appendChild(el('h3', '', 'By learner'));
      var fl = el('input'); fl.type = 'search'; fl.placeholder = 'Filter by name, email or course'; fl.setAttribute('aria-label', 'Filter'); box.appendChild(fl);
      var holder = el('div'); box.appendChild(holder);
      function draw() {
        var s = fl.value.toLowerCase(), rows = x.rows.filter(function (r) { return !s || (r.learner + ' ' + r.email + ' ' + r.title).toLowerCase().indexOf(s) > -1; });
        holder.textContent = ''; holder.appendChild(table(['Learner', 'Email', 'Course', 'Progress', 'Status', 'Final check', 'Certificate', 'Last active'], rows.map(function (r) { return [r.learner || '(no name)', r.email, r.title, r.done + ' of ' + r.total, r.status, r.best == null ? '' : r.best + '%', r.certificate, dt(r.updatedAt)]; })));
      }
      fl.addEventListener('input', draw); draw();
      var ex = el('button', 'btn btn-ghost', 'Download as CSV'); ex.type = 'button';
      ex.addEventListener('click', function () {
        var esc = function (v) { v = String(v == null ? '' : v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
        var lines = [['learner', 'email', 'course', 'done', 'total', 'status', 'final_check', 'certificate', 'enrolled', 'updated'].join(',')].concat(x.rows.map(function (r) { return [r.learner, r.email, r.title, r.done, r.total, r.status, r.best, r.certificate, r.enrolledAt, r.updatedAt].map(esc).join(','); }));
        var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })); a.download = 'learners.csv'; document.body.appendChild(a); a.click(); a.remove();
      });
      box.appendChild(ex);
      if (x.rows.some(function (r) { return r.demo; })) box.appendChild(el('p', 'note', 'Rows named Demo are sample data (switched on for testing).'));
    });
  }
  function table(head, rows) {
    var w = el('div', 'scroll-x'), t = el('table', 'ws-table'), th = el('thead'), tr = el('tr');
    head.forEach(function (h) { var c = el('th', '', h); c.scope = 'col'; tr.appendChild(c); }); th.appendChild(tr); t.appendChild(th);
    var tb = el('tbody'); rows.forEach(function (r) { var x = el('tr'); r.forEach(function (v) { x.appendChild(el('td', '', v)); }); tb.appendChild(x); });
    t.appendChild(tb); w.appendChild(t); return w;
  }
})();
