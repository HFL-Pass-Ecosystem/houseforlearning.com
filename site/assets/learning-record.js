/* My learning record: one printable page (a transcript) with every course the member joined, progress, final check and certificates.
   Server mode reads the member's account (HFLAccess.server); test mode reads this browser (HFLAccess.load()). Text is always set with textContent. */
(function () {
  var main = document.querySelector('main[data-lms="record"]'); if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess; if (!box || !A) return;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function link(h, t, c) { var a = el('a', c || 'btn', t); a.href = h; return a; }
  function dt(v) { if (!v) return '-'; var d = new Date(v); if (isNaN(d.getTime())) return '-'; try { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return d.toISOString().slice(0, 10); } }
  function iso(v) { if (!v) return ''; var d = new Date(v); return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10); }
  function num(v) { var n = typeof v === 'number' ? v : Date.parse(v || ''); return isNaN(n) ? 0 : n; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  A.ready.then(run, run);

  function run() {
    box.textContent = ''; box.classList.add('lr-box');
    if (!A.signedIn()) {
      box.appendChild(el('p', '', 'Sign in first.'));
      box.appendChild(link('login.html?next=record.html', 'Sign in'));
      return;
    }
    var server = A.mode === 'server' && A.server, rows, user;
    if (server) { user = A.server.user || {}; rows = serverRows(A.server); } else { user = {}; rows = localRows(A.load()); }
    rows.sort(function (a, b) { if (a.complete !== b.complete) return a.complete ? -1 : 1; return b.when - a.when; });
    draw(rows, user, !server);
  }

  function serverRows(S) {
    var certs = S.certificates || [];
    return (S.enrolments || []).map(function (e) {
      var c = (e.done || []).length, t = e.total || 0, cert = certs.filter(function (x) { return x.course === e.course; })[0];
      var check = e.quiz ? e.quiz.pct + '%, ' + (e.quiz.passed ? 'passed' : 'not passed') : (e.hasQuiz ? 'not taken' : '-');
      return {
        course: e.course, title: e.title || e.course, joined: e.enrolledAt, done: c, total: t,
        complete: e.status === 'completed' || (t > 0 && c >= t), passed: !!(e.quiz && e.quiz.passed),
        check: check, cert: cert ? cert.code : '', certLabel: cert ? cert.code : '-',
        when: num(e.updatedAt) || num(e.completedAt) || num(e.enrolledAt)
      };
    });
  }

  function localRows(d) {
    return Object.keys(d).filter(function (k) { return d[k] && d[k].paid; }).map(function (k) {
      var r = d[k], c = (r.done || []).length, t = r.total || 0, p = r.practice;
      return {
        course: k, title: r.title || k, joined: r.paidAt, done: c, total: t,
        complete: t > 0 && c >= t, passed: !!(p && p.passed),
        check: p ? p.pct + '%, ' + (p.passed ? 'passed' : 'not passed') + ' (practice)' : 'not taken',
        cert: '', certLabel: p && p.passed ? 'practice' : '-',
        when: num(r.updated) || num(r.paidAt)
      };
    });
  }

  function draw(rows, user, test) {
    var head = el('div', 'lr-head');
    head.appendChild(el('p', 'kicker', 'House for Learning'));
    head.appendChild(el('h3', 'lr-name', user.name || 'Member'));
    if (user.email) head.appendChild(el('p', 'lr-meta', user.email));
    head.appendChild(el('p', 'lr-meta', 'Printed ' + dt(Date.now())));
    box.appendChild(head);
    if (test) box.appendChild(el('p', 'note lr-mode', 'Test mode: this record is kept in this browser only. Sign in with your member account to keep it in your account.'));

    if (!rows.length) {
      box.appendChild(el('p', 'lr-sum', 'You have not joined a course yet.'));
      var f = el('p'); f.appendChild(link('find.html', 'Find a course')); box.appendChild(f);
      return;
    }
    var nDone = rows.filter(function (r) { return r.complete; }).length;
    var nPass = rows.filter(function (r) { return r.passed; }).length;
    var nCert = test ? rows.filter(function (r) { return r.certLabel === 'practice'; }).length : rows.filter(function (r) { return r.cert; }).length;
    var sum = el('p', 'lr-sum', plural(rows.length, 'course', 'courses') + ' joined, ' + nDone + ' completed, ' +
      plural(nPass, 'final check', 'final checks') + ' passed' + (test ? ' (practice)' : '') + ', ' +
      plural(nCert, test ? 'practice certificate' : 'certificate', test ? 'practice certificates' : 'certificates') + '.');
    sum.setAttribute('data-courses', String(rows.length)); sum.setAttribute('data-completed', String(nDone));
    sum.setAttribute('data-passed', String(nPass)); sum.setAttribute('data-certs', String(nCert));
    box.appendChild(sum);

    var tools = el('p', 'lr-tools');
    var pr = el('button', 'btn', 'Print or save'); pr.type = 'button'; pr.addEventListener('click', function () { window.print(); });
    var cs = el('button', 'btn btn-ghost', 'Download as a spreadsheet (CSV)'); cs.type = 'button'; cs.addEventListener('click', function () { csv(rows, user, test); });
    tools.appendChild(pr); tools.appendChild(document.createTextNode(' ')); tools.appendChild(cs);
    box.appendChild(tools);

    var wrap = el('div', 'scroll-x lr-wrap'), t = el('table', 'ws-table lr-table');
    t.appendChild(el('caption', '', 'Learning record'));
    var th = el('thead'), tr = el('tr');
    ['Course', 'Joined', 'Progress', 'Final check', 'Certificate'].forEach(function (h) { var c = el('th', '', h); c.scope = 'col'; tr.appendChild(c); });
    th.appendChild(tr); t.appendChild(th);
    var tb = el('tbody');
    rows.forEach(function (r) {
      var x = el('tr', r.complete ? 'lr-done' : '');
      var name = el('th'); name.scope = 'row'; name.appendChild(link(r.course, r.title, 'lr-course')); x.appendChild(name);
      x.appendChild(el('td', '', dt(r.joined)));
      x.appendChild(el('td', '', r.done + ' of ' + r.total + ' units' + (r.complete ? ' (complete)' : '')));
      x.appendChild(el('td', '', r.check));
      var ce = el('td');
      if (r.cert) ce.appendChild(link('certificate.html?code=' + encodeURIComponent(r.cert), r.cert, 'lr-code'));
      else ce.textContent = r.certLabel;
      x.appendChild(ce);
      tb.appendChild(x);
    });
    t.appendChild(tb); wrap.appendChild(t); box.appendChild(wrap);
    box.appendChild(el('p', 'note', 'Anyone can check a certificate code on the certificate page.'));
  }

  function csv(rows, user, test) {
    var esc = function (v) { v = String(v == null ? '' : v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
    var lines = [['member', 'course', 'page', 'joined', 'units_done', 'units_total', 'complete', 'final_check', 'certificate', 'mode'].map(esc).join(',')];
    rows.forEach(function (r) {
      lines.push([user.name || 'Member', r.title, r.course, iso(r.joined), r.done, r.total, r.complete ? 'yes' : 'no', r.check === '-' ? '' : r.check, r.cert || (r.certLabel === '-' ? '' : r.certLabel), test ? 'test' : 'account'].map(esc).join(','));
    });
    var url = URL.createObjectURL(new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a'); a.href = url; a.download = 'my-learning-record.csv'; a.hidden = true;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }
})();
