/* Learning home: one screen for a member's journey. Shows the next step, a journey strip, a short get-ready checklist, the hub cards,
   plain answers to the questions new learners ask, and the ways to get help. Built from the member's own state (HFLAccess), no new server.
   Own words and layout. Text is set with textContent only. */
(function () {
  var main = document.querySelector('main[data-lms="home"]'); if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function link(h, t, c) { var a = el('a', c || 'btn', t); a.href = h; return a; }
  function say(m, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), m); p.setAttribute('role', 'status'); return p; }
  function hour() { var h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }

  A.ready.then(function () {
    if (!A.signedIn()) { box.appendChild(el('p', '', 'Sign in first.')); box.appendChild(link('login.html', 'Sign in')); return; }
    if (A.mode !== 'server') { box.appendChild(say('Your learning home is kept in your member account. Please sign in with your member account (this browser is in test mode).', true)); box.appendChild(link('login.html', 'Member sign in')); return; }
    draw(A.server);
  });

  function draw(S) {
    var u = S.user || {}, en = S.enrolments || [], certs = S.certificates || [];
    var joined = en.length > 0, anyDone = en.some(function (e) { return (e.done || []).length > 0; });
    var finished = en.some(function (e) { return e.status === 'completed'; }), checked = en.some(function (e) { return e.quiz && e.quiz.passed; }), earned = certs.length > 0;
    box.appendChild(el('h3', '', hour() + (u.name ? ', ' + u.name : '') + '.'));
    box.appendChild(el('p', '', 'Full access opens within 24 hours of joining, so a few items may show as locked on day one. That is normal.'));

    // the one thing to do next
    var next = el('section', 'lh-next'); next.setAttribute('aria-labelledby', 'lh-n');
    next.appendChild(el('h4', '', 'Your next step')); next.lastChild.id = 'lh-n';
    var cur = en.filter(function (e) { return e.status !== 'completed'; })[0];
    if (!joined) { next.appendChild(el('p', '', 'Pick a course and open its first unit. Ten minutes is enough.')); next.appendChild(link('learn.html', 'Browse member courses')); next.appendChild(document.createTextNode(' ')); next.appendChild(link('courses-all.html', 'Browse all courses', 'btn btn-ghost')); }
    else if (cur) { next.appendChild(el('p', '', cur.title + ': ' + (cur.done || []).length + ' of ' + cur.total + ' units done.')); next.appendChild(link(/^author-/.test(cur.course) ? 'learn.html?c=' + encodeURIComponent(cur.course) : cur.course, (cur.done || []).length ? 'Carry on' : 'Start')); }
    else if (!earned) { next.appendChild(el('p', '', 'Every unit is done. Take the final check to earn your certificate.')); next.appendChild(link('members-courses.html', 'Open my courses')); }
    else { next.appendChild(el('p', '', 'You have earned a certificate. Choose your next course.')); next.appendChild(link('learn.html', 'Browse member courses')); }
    box.appendChild(next);

    // journey strip (each step ticks as it happens)
    box.appendChild(el('h4', '', 'Your journey'));
    var strip = el('ol', 'lh-strip');
    [['Join a course', joined], ['Learn unit by unit', anyDone], ['Finish every unit', finished], ['Pass the final check', checked], ['Earn your certificate', earned]].forEach(function (s) {
      var li = el('li', s[1] ? 'on' : '', s[0]); li.appendChild(el('span', 'lh-t', s[1] ? ' (done)' : ' (to do)')); strip.appendChild(li);
    });
    box.appendChild(strip);

    // get-ready checklist
    box.appendChild(el('h4', '', 'Before you start'));
    var ul = el('ul', 'lh-list');
    ['Check your sound and internet.', 'Keep a notebook ready.', 'Join live sessions five minutes early.', 'Turn on notifications so reminders reach you.', 'Recordings are usually ready within a day of a session.'].forEach(function (t) { ul.appendChild(el('li', '', t)); });
    box.appendChild(ul);

    // hub
    box.appendChild(el('h4', '', 'Your learning hub'));
    var hub = el('div', 'lh-hub');
    [['My courses', 'Progress, grades and certificates.', 'members-courses.html'], ['Courses by members', 'Join and learn from courses made by our members.', 'learn.html'], ['My board', 'Sticky notes for what matters today.', 'board.html'], ['Plan my growth', 'A week of small steps sized to your minutes.', 'plan.html'], ['Author Studio', 'Build and publish a course of your own.', 'author.html'], ['Check a certificate', 'Verify any certificate by its code.', 'certificate.html'], ['Manuals library', 'Short how-to manuals for every screen.', 'manuals.html'], ['PAVER', 'Start PAVER.', 'paver.html'], ['COLLATE', 'Start COLLATE.', 'collate.html'], ['LAB', 'Start LAB.', 'lab.html'], ['LEAP', 'Start LEAP.', 'leap.html']].forEach(function (c) {
      var d = el('div', 'lh-card'); d.appendChild(el('strong', '', c[0])); d.appendChild(el('p', '', c[1])); d.appendChild(link(c[2], 'Open', 'btn btn-ghost')); hub.appendChild(d);
    });
    box.appendChild(hub);

    // questions new learners ask
    box.appendChild(el('h4', '', 'Questions new learners ask'));
    [['I joined but some things look locked. Why?', 'Access opens fully within 24 hours of joining. If it is still locked after that, ask for help below.'],
     ['How do I get a certificate?', 'Finish every unit of a course, pass its final check (70%), then press Get my certificate. Each certificate has a code anyone can check.'],
     ['Can I try the final check again?', 'Yes, as often as you like. Your best score is kept.'],
     ['Who do I ask about payment?', 'Payments are test-only for now. Use the help routes below and say which course you mean.']].forEach(function (q) {
      var d = el('details', 'lh-q'); d.appendChild(el('summary', '', q[0])); d.appendChild(el('p', '', q[1])); box.appendChild(d);
    });

    // help
    box.appendChild(el('h4', '', 'Need help?'));
    box.appendChild(el('p', '', 'Write to us from the contact page and say which course you are on. A person replies, and we say how long it will take.'));
    box.appendChild(link('contact.html', 'Ask for help'));
    if (u.staff) { box.appendChild(document.createTextNode(' ')); box.appendChild(link('reports.html', 'Facilitator report', 'btn btn-ghost')); }
  }
})();
