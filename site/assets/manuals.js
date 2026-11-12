/* Manuals library: short how-to manuals for the learning platform, written in our own words, for learners, authors, trainers and staff.
   Anyone can read them (no sign-in). Each manual opens like a book chapter, lists numbered steps and links to the real screen.
   Text is set with textContent only. No inline script or style. */
(function () {
  var main = document.querySelector('main[data-lms="manuals"]'); if (!main) return;
  var box = document.getElementById('lms-box');
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var WHO = { all: 'Everyone', learner: 'Learners', author: 'Authors', trainer: 'Trainers', staff: 'Staff' };
  var M = [
    ['learner', 'Start here: your learning home', 'home.html', 'Find your next step and every learning tool in one place.', [
      'Sign in with your email and password (Members login, top right).',
      'Open My learning home. The box at the top tells you your next step.',
      'The journey strip shows five steps: join, learn, check, certificate, grow. A step turns on when you finish it.',
      'Use the hub cards to open My courses, My board, Plan my growth and the start pages.']],
    ['learner', 'Join a course', 'courses-all.html', 'Open a course and unlock every module.', [
      'Open any course page. You can read the outline and Module 1 as a preview.',
      'Press Join this course in the bar at the top.',
      'Choose bank or UPI. Today this is a test payment: no real money is taken.',
      'Press I have paid (test). The same course page opens with every module unlocked.']],
    ['learner', 'Learn unit by unit', 'members-courses.html', 'Keep your place and see your progress.', [
      'Press Start (or Continue) in the course bar. It opens the next unit for you.',
      'Read, watch or practise the unit.',
      'Tick Done at the end of the unit. The bar shows how many units are done.',
      'Come back any time: My courses shows every course and where you stopped.']],
    ['learner', 'Take the final check', 'members-courses.html', 'Show what you learned. You need 70% to pass.', [
      'When every unit is done, press Take the final check in the course bar.',
      'Answer every question, then press Submit my answers.',
      'Right answers are marked green and wrong ones are marked so you can learn from them.',
      'Not passed yet? Read the marked questions again and try again. There is no limit on tries.']],
    ['learner', 'Your certificate', 'certificate.html', 'Get, print and check a certificate.', [
      'Pass the final check with every unit done, then press Get my certificate.',
      'Your certificate shows your name, the course, your score and a code like HFL-XXXX-XXXX-XXXX.',
      'Press Print or save to keep a copy.',
      'Anyone can check a certificate: open Check a certificate and type the code.',
      'In test mode you get a practice certificate with no code. Coded certificates start when the member database is switched on.']],
    ['learner', 'Use My board', 'board.html', 'Sticky notes for what matters today.', [
      'Open My board.',
      'Write a new note, pick a note colour and press Stick it on my board.',
      'Tick Done when a note is finished. Press Undo if you tick by mistake.',
      'Notes from your trainer appear under From your trainer.']],
    ['learner', 'Plan my growth', 'plan.html', 'A week of small steps sized to your minutes.', [
      'Open Plan my growth.',
      'Choose your sector, your community, who the plan is for, the life space and your minutes a day.',
      'Press Make my week. You get one small step for each day: aim, learn, practise, check, share, rest.',
      'Put the steps on My board with one button, so you see them every day.']],
    ['author', 'Build a course in Author Studio', 'author.html', 'Make a course on screen, no tools to install.', [
      'Open Author Studio and press Start a new course. Give it a course title.',
      'Press Add module, then Add lesson. Give each a title.',
      'Fill each lesson with blocks: text, key point, picture, video link, scenario or flashcards.',
      'Add the final check: press Add a question, add choices and mark the right answer.',
      'Press Save often. Press Preview as a learner to see it as a learner will.']],
    ['author', 'Send for review and publish', 'author.html', 'A trainer checks every course before it goes out.', [
      'When the course is ready, press Send to a trainer for review. The status shows With a trainer.',
      'If the trainer asks for changes, the status shows Changes asked with a note. Make the changes and send again.',
      'When the status shows Approved, press Publish. The course appears under Courses by members.',
      'Set a price in USD or leave it free.']],
    ['author', 'Your earnings', 'author.html', 'How course sales are shared.', [
      'Open Earnings in Author Studio.',
      'For each sale the author keeps 90% and the platform keeps 10%.',
      'Today every sale is a test sale: no real money moves until payments go live.',
      'Authoring tools are part of the yearly membership. There is no extra fee to build courses.']],
    ['trainer', 'Review a course', 'author.html', 'Approve a course or ask for changes.', [
      'Sign in with a trainer account and open Author Studio.',
      'Open the Trainer review queue and press Review on a course.',
      'Read every lesson and the final check.',
      'Press Approve, or write a Note to the author and press Ask for changes.']],
    ['trainer', 'Read the facilitator report', 'reports.html', 'Who joined, how far they got, how they did.', [
      'Sign in with a facilitator or admin account and open Facilitator report.',
      'Each row shows a learner, the course, progress, status, best final-check score and certificate.',
      'Type in the search box to find a learner or a course.',
      'Download the table as a spreadsheet file (CSV) for your records.']],
    ['staff', 'Insight Desk', 'insight-desk.html', 'Business figures for staff. Demo data today.', [
      'Sign in with a staff account. The desk stays hidden for everyone else.',
      'Use the filters at the top: site, profit centre, country and period.',
      'Move between the tabs: overview, profit centres, pipeline, market, outcomes, formulas and gaps.',
      'The figures are demo data until real records are connected.']],
    ['all', 'Help, safety and privacy', 'support.html', 'Where to ask, and how your data is kept.', [
      'Questions: open Questions (FAQ) or Support and access from the Help menu.',
      'Arrange everything through this website only. If someone contacts you elsewhere claiming to act for us, tell us.',
      'We set no advertising or tracking cookies. Your choices stay in your browser.',
      'To reach a person, use the Contact page.']]
  ];
  box.textContent = '';
  box.appendChild(el('p', '', M.length + ' short manuals. Pick who you are, then open a manual. Each one ends with a button to the real screen.'));
  var bar = el('div', 'mn-filter'); bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Show manuals for');
  var list = el('div', 'mn-list'), count = el('p', 'note'); count.setAttribute('aria-live', 'polite');
  var cur = 'any';
  function draw() {
    list.textContent = ''; var n = 0;
    M.forEach(function (m, i) {
      if (cur !== 'any' && m[0] !== cur && m[0] !== 'all') return; n++;
      var d = el('details', 'mn-item'); d.id = 'manual-' + (i + 1);
      var s = el('summary'); s.appendChild(el('span', 'mn-who', WHO[m[0]])); s.appendChild(el('span', 'mn-t', ' ' + m[1])); d.appendChild(s);
      d.appendChild(el('p', '', m[3]));
      var ol = el('ol', 'mn-steps'); m[4].forEach(function (t) { ol.appendChild(el('li', '', t)); }); d.appendChild(ol);
      var a = el('a', 'btn', 'Open this screen'); a.href = m[2]; d.appendChild(a);
      list.appendChild(d);
    });
    count.textContent = 'Showing ' + n + ' manual' + (n === 1 ? '' : 's') + '.';
  }
  [['any', 'All']].concat(Object.keys(WHO).filter(function (k) { return k !== 'all'; }).map(function (k) { return [k, WHO[k]]; })).forEach(function (o) {
    var b = el('button', 'btn btn-sm' + (o[0] === cur ? '' : ' btn-ghost'), o[1]); b.type = 'button'; b.setAttribute('aria-pressed', String(o[0] === cur));
    b.addEventListener('click', function () { cur = o[0]; Array.prototype.forEach.call(bar.children, function (x) { var on = x === b; x.classList.toggle('btn-ghost', !on); x.setAttribute('aria-pressed', String(on)); }); draw(); });
    bar.appendChild(b);
  });
  var pr = el('button', 'btn btn-sm btn-ghost', 'Print all manuals'); pr.type = 'button';
  pr.addEventListener('click', function () { Array.prototype.forEach.call(list.querySelectorAll('details'), function (d) { d.open = true; }); window.print(); });
  box.appendChild(bar); box.appendChild(count); box.appendChild(list); box.appendChild(pr);
  draw();
  function fromHash() { var h = /^#manual-(\d+)$/.exec(location.hash); if (!h) return; var t = document.getElementById('manual-' + h[1]); if (!t && cur !== 'any') { cur = 'any'; Array.prototype.forEach.call(bar.children, function (x, i) { x.classList.toggle('btn-ghost', i !== 0); x.setAttribute('aria-pressed', String(i === 0)); }); draw(); t = document.getElementById('manual-' + h[1]); } if (t) { t.open = true; t.scrollIntoView({ block: 'start' }); } }
  window.addEventListener('hashchange', fromHash); fromHash();
})();
