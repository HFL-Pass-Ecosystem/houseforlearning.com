/* Plan my growth: pick where you work (sector, community, unit), which life space and how many minutes a day you have.
   You get a short week plan with one small step per day, links to the right start pages, and a button that puts the steps on My board.
   The GROWTH layer is the rhythm of the week: aim, learn, practise, check, share, rest. Time is golden: every step is sized to your minutes.
   Text is set with textContent only. No inline script or style. */
(function () {
  var main = document.querySelector('main[data-lms="plan"]'); if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function say(m, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), m); p.setAttribute('role', 'status'); return p; }
  var SECTORS = ['Education and training', 'Health and care', 'Food and farming', 'Energy and utilities', 'Building and property', 'Manufacturing and engineering', 'Transport and logistics', 'Finance and business services', 'Digital and technology', 'Hospitality and tourism', 'Public service and community'];
  var COMMUNITIES = ['Learners', 'Workers and employees', 'Trainers and authors', 'Small business owners', 'Partners and suppliers', 'Families and carers'];
  var UNITS = ['Just me', 'Workstream', 'Division', 'Business unit', 'Whole organisation'];
  var SPACES = { work: 'Work', personal: 'Personal', growth: 'Growth', play: 'Play' };
  var MINUTES = [10, 20, 45, 90];
  // one starter per life space and per day; the link is a page of this site
  var STEPS = {
    work: [['Aim', 'Write the one result you want from work this week.', 'board.html'], ['Learn', 'Open one lesson that helps with that result.', 'learn.html'], ['Practise', 'Try it on one real task today.', 'lab.html'], ['Check', 'Take a short check on what you tried.', 'members-courses.html'], ['Share', 'Tell one colleague what worked.', 'collate.html'], ['Rest', 'Stop on time and note one thing for next week.', 'board.html']],
    personal: [['Aim', 'Pick one thing that makes your week calmer.', 'board.html'], ['Learn', 'Read or listen to one short lesson.', 'learn.html'], ['Practise', 'Do it once, slowly.', 'leap.html'], ['Check', 'Ask yourself what changed.', 'board.html'], ['Share', 'Tell someone close to you.', 'board.html'], ['Rest', 'Rest. Nothing to do today.', 'board.html']],
    growth: [['Aim', 'Choose the next level of the pathway you are on.', 'career-pathways.html'], ['Learn', 'Open the next lesson of your course.', 'members-courses.html'], ['Practise', 'Build one small piece of work for your portfolio.', 'paver.html'], ['Check', 'Take the final check, or one practice question.', 'members-courses.html'], ['Share', 'Show your work to a trainer or a friend.', 'collate.html'], ['Rest', 'Rest, then pin the next step on your board.', 'board.html']],
    play: [['Aim', 'Pick one fun skill for this week.', 'board.html'], ['Learn', 'Watch or read one short piece about it.', 'learn.html'], ['Practise', 'Play with it for your minutes.', 'lab.html'], ['Check', 'Can you show someone? Try.', 'board.html'], ['Share', 'Show someone what you made.', 'collate.html'], ['Rest', 'Rest and enjoy it.', 'board.html']]
  };
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function sel(label, list, fmt) {
    var l = el('label', 'au-f'); l.appendChild(el('span', 'au-l', label)); var s = el('select');
    list.forEach(function (v) { var o = el('option', '', fmt ? fmt(v) : v); o.value = v; s.appendChild(o); }); l.appendChild(s); l.sel = s; return l;
  }
  function api(b) {
    return fetch('/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(b) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); });
  }
  A.ready.then(function () {
    if (!A.signedIn()) { box.appendChild(el('p', '', 'Sign in first.')); var a = el('a', 'btn', 'Sign in'); a.href = 'login.html'; box.appendChild(a); return; }
    box.textContent = '';
    box.appendChild(el('p', '', 'Answer four things. You get a week with one small step a day, sized to the minutes you have.'));
    var f = el('form', 'bd-new'); f.noValidate = true;
    var s1 = sel('Your sector', SECTORS), s2 = sel('Your community', COMMUNITIES), s3 = sel('Plan for', UNITS), s4 = sel('Life space', Object.keys(SPACES), function (k) { return SPACES[k]; }), s5 = sel('Minutes a day', MINUTES, function (m) { return m + ' minutes'; });
    [s1, s2, s3, s4, s5].forEach(function (x) { f.appendChild(x); });
    var go = el('button', 'btn', 'Make my week'); go.type = 'submit'; f.appendChild(go); box.appendChild(f);
    var out = el('div', 'gp-out'); out.setAttribute('aria-live', 'polite'); box.appendChild(out);
    f.addEventListener('submit', function (e) {
      e.preventDefault(); out.textContent = '';
      var space = s4.sel.value, mins = Number(s5.sel.value), steps = STEPS[space], plan = [];
      out.appendChild(el('h4', '', 'Your week: ' + SPACES[space] + ', ' + mins + ' minutes a day'));
      out.appendChild(el('p', 'au-hint', s1.sel.value + ' · ' + s2.sel.value + ' · ' + s3.sel.value));
      var ul = el('ol', 'gp-list');
      steps.forEach(function (st, i) {
        var m = st[0] === 'Rest' ? 0 : mins, li = el('li', 'gp-step'); li.setAttribute('data-day', DAYS[i]);
        li.appendChild(el('strong', '', DAYS[i] + ': ' + st[0] + (m ? ' (' + m + ' min)' : '')));
        li.appendChild(el('p', '', st[1])); var l = el('a', 'btn btn-ghost', 'Open'); l.href = st[2]; li.appendChild(l); ul.appendChild(li);
        plan.push({ body: DAYS[i] + ': ' + st[0] + (m ? ' (' + m + ' min). ' : '. ') + st[1], link: st[2], color: ['ivory', 'blue', 'green'][i % 3] });
      });
      out.appendChild(ul);
      var put = el('button', 'btn', 'Put these on my board'); put.type = 'button';
      put.addEventListener('click', function () {
        put.disabled = true; var n = 0;
        plan.reduce(function (p, x) { return p.then(function () { return api({ action: 'add', body: x.body, link: x.link, color: x.color }).then(function (r) { if (r.status === 200) n++; }); }); }, Promise.resolve())
          .then(function () { out.appendChild(say(n === plan.length ? 'Done. ' + n + ' notes are on your board.' : 'Only ' + n + ' of ' + plan.length + ' notes were saved. Please try again.', n !== plan.length)); if (n === plan.length) { var b = el('a', 'btn btn-ghost', 'Open my board'); b.href = 'board.html'; out.appendChild(b); } });
      });
      out.appendChild(put);
    });
  });
})();
