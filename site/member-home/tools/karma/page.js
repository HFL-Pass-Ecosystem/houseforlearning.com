/* Karma points: thanks for good work, in the spirit of the Bhagavad Gita. Not money. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var log = K.get('karmaLog'), meta = K.get('karmaMeta'), pledges = K.get('karmaResolve');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var people = (W && Array.isArray(W.team) && W.team.length ? W.team : ['Demo Asha', 'Demo Ben', 'Demo Chen', 'Demo Dina', 'Demo Eli', 'Demo Farah'])
    .map(function (p) { return String(p).replace(/[<>]/g, '').slice(0, 40); }).filter(function (p) { return p; });
  var DAY_CAP = 3, DAY = 86400000;

  /* Good deeds. [id, label, points, idea, verse] */
  var ACTS = [
    ['learn', 'Finished a lesson', 5, 'Learn with humility, questions and service.', '4.34'],
    ['course', 'Finished a course level', 25, 'Lift yourself up by your own effort.', '6.5'],
    ['answer', 'Answered someone\'s question', 5, 'Share what you know freely.', '4.34'],
    ['help', 'Helped a member or colleague', 10, 'Act for the good of all.', '3.25'],
    ['task', 'Finished my own task well (checked)', 10, 'Your own duty, done well, is the best path.', '3.35'],
    ['check', 'Checked someone\'s work fairly', 5, 'Hold the same balance for everyone.', '2.48'],
    ['share', 'Shared a useful note or tip', 5, 'Knowledge grows when it is given.', '4.38'],
    ['serve', 'Volunteered or served at an event', 20, 'Serve without asking what you get.', '2.47'],
    ['refer', 'Brought a friend who joined', 15, 'Be a friend to all, with no ill will.', '12.13'],
    ['calm', 'Stayed calm and solved a hard problem', 10, 'Skill in action is true discipline.', '2.50']
  ];
  var ACT = {}; ACTS.forEach(function (a) { ACT[a[0]] = a; });

  /* Levels. [from points, name, meaning] */
  var LEVELS = [
    [0, 'Seeker (Jijnasu)', 'You have begun. Every journey starts with the wish to learn.'],
    [50, 'Doer of duty (Svadharma)', 'You do your own part well and keep your word.'],
    [150, 'Steady one (Sthita)', 'You stay even in success and in failure (Gita 2.48).'],
    [300, 'Skilled in action (Kaushala)', 'Your work is careful and skilful (Gita 2.50).'],
    [600, 'Selfless server (Nishkama)', 'You serve without waiting for thanks (Gita 2.47).'],
    [1000, 'For the good of all (Lokasangraha)', 'Your example lifts the whole team (Gita 3.20).']
  ];

  /* Resolves (Sankalpa), in our own words */
  var RESOLVES = [
    'I will do my own duty with full care, and leave the result to its time.',
    'I will help at least one person each week, without asking for anything back.',
    'I will learn something new every week and share it freely.',
    'I will check others\' work with an even mind, the same for everyone.',
    'I will stay steady and kind when work is hard.',
    'I will stand for what is right, even when it is not easy.'
  ];
  function resolveOf(who) { var r = null; pledges.forEach(function (p) { if (p.who === who) r = p; }); return r; }

  /* Badges. [id, name, meaning, test(stats)] */
  var BADGES = [
    ['sankalpa', 'Resolve (Sankalpa)', 'Made your own promise to do right, as Arjuna did before Kurukshetra.', function (s) { return !!s.resolve; }],
    ['first', 'First step (Prarambha)', 'Your first checked good deed. Action is better than doing nothing (Gita 3.8).', function (s) { return s.n >= 1; }],
    ['seva', 'Service (Seva)', 'Helped others 3 times.', function (s) { return (s.k.help || 0) + (s.k.answer || 0) >= 3; }],
    ['learner', 'Learner (Jijnasa)', 'Finished 3 lessons or course levels.', function (s) { return (s.k.learn || 0) + (s.k.course || 0) >= 3; }],
    ['samatva', 'Even mind (Samatva)', 'Checked others\' work fairly 3 times.', function (s) { return (s.k.check || 0) >= 3; }],
    ['kaushala', 'Skill in action (Kaushala)', 'Finished 5 of your own tasks well.', function (s) { return (s.k.task || 0) + (s.k.calm || 0) >= 5; }],
    ['maitri', 'Friend to all (Maitri)', 'Brought a friend, or served at an event.', function (s) { return (s.k.refer || 0) + (s.k.serve || 0) >= 1; }],
    ['loka', 'For the good of all (Lokasangraha)', 'Good deeds of 5 different kinds.', function (s) { return Object.keys(s.k).length >= 5; }]
  ];

  var WAY = [
    ['Begin with a resolve (Sankalpa)', 'Mahabharata, Bhishma Parva', 'Before Kurukshetra, Arjuna prayed to Maa Durga for strength and resolved to do right. Each person starts by choosing their own promise; it earns the first badge, not points.'],
    ['Do the work, let go of the reward (Nishkama karma)', 'Gita 2.47', 'Points are a mirror, not a prize. They are not money and cannot be cashed out, bought, sold or swapped.'],
    ['Your own duty first (Svadharma)', 'Gita 3.35', 'Most points come from doing your own role well, not from chasing other people\'s work.'],
    ['Skill in action (Yoga karmasu kaushalam)', 'Gita 2.50', 'Careful work counts. A task counts only after someone checks it was done well.'],
    ['An even mind (Samatva)', 'Gita 2.48', 'Checkers judge everyone the same way. No one checks their own deed or one they wrote.'],
    ['Act for the good of all (Lokasangraha)', 'Gita 3.20 and 3.25', 'Helping, teaching and serving others earn the most. There is no ranking table and no race.'],
    ['Steadiness (Sthita prajna)', 'Gita 2.56', 'No streaks, no countdowns, no "last chance". Points never expire and never fall because you took a rest.'],
    ['No ill will, a friend to all (Maitri, Karuna)', 'Gita 12.13', 'Thanking others is welcome. Points are never taken away as punishment; a checker can only send a claim back with a kind reason.'],
    ['Lift yourself by yourself (Uddhared atmana)', 'Gita 6.5', 'Your own page shows your own growth. Compare yourself with your yesterday, not with others.']
  ];

  function pad(n) { return ('0' + n).slice(-2); }
  function stamp(ms) { var d = new Date(ms); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function badText(s) {
    if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(s)) return 'Please remove the email address. Do not type email addresses here.';
    if (/\+?\d[\d\s().-]{7,}\d/.test(s)) return 'Please remove the phone number. Do not type phone numbers here.';
    if (/[$€£₹¥]|\b(rs|inr|usd|eur|gbp|aed)\.?\s*\d|\d\s*(rs|inr|usd|eur|gbp|aed|dollars?|rupees?|euros?|pounds?|dirhams?)\b/i.test(s)) return 'Please remove the money amount. Karma points are never money.';
    return '';
  }
  function opts(sel, list) { K.clear(sel); list.forEach(function (x) { sel.appendChild(h('option', { value: x[0], text: x[1] })); }); }
  function names(sel) { opts(sel, people.map(function (p) { return [p, p]; })); }
  function sameDay(a, b) { var x = new Date(a), y = new Date(b); return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate(); }

  function stats(who) {
    var s = { pts: 0, wait: 0, n: 0, k: {}, resolve: resolveOf(who) };
    log.forEach(function (e) {
      if (e.who !== who) return;
      if (e.st === 'ok') { s.pts += e.pts; s.n++; s.k[e.act] = (s.k[e.act] || 0) + 1; }
      else if (e.st === 'wait') s.wait += e.pts;
    });
    return s;
  }
  function levelOf(p) { var L = LEVELS[0], i; for (i = 0; i < LEVELS.length; i++) if (p >= LEVELS[i][0]) L = LEVELS[i]; return L; }
  function nextOf(p) { for (var i = 0; i < LEVELS.length; i++) if (p < LEVELS[i][0]) return LEVELS[i]; return null; }
  function badgesOf(s) { return BADGES.filter(function (b) { return b[3](s); }); }

  function add(who, by, act, note, st, checker, src) {
    var e = { id: K.id(), who: who, by: by, act: act, pts: ACT[act][2], note: note, at: Date.now(), st: st || 'wait', checker: checker || '', checkedAt: st === 'ok' ? Date.now() : 0, why: '', src: src || '' };
    log.push(e); return e;
  }

  /* Sample deeds, added once on first use */
  if (meta.indexOf('seeded') < 0) {
    var P = function (i) { return people[i % people.length]; }, now = Date.now();
    [[0, 1, 'learn', 'Finished lesson 1 of the beginner pathway.', 'ok', 2, 30],
     [0, 0, 'task', 'Sorted the shared folder so new people find things fast.', 'ok', 1, 26],
     [1, 0, 'help', 'Showed a new colleague how to book a room.', 'ok', 3, 20],
     [2, 2, 'check', 'Checked two lesson scripts and sent kind notes.', 'ok', 0, 12],
     [3, 1, 'serve', 'Helped set up the open day.', 'ok', 4, 8],
     [1, 1, 'answer', 'Answered a question about leave days.', 'wait', 0, 3],
     [4, 3, 'share', 'Wrote a short tip sheet on safe lifting.', 'wait', 0, 2]
    ].forEach(function (r) {
      var e = add(P(r[0]), P(r[1]), r[2], r[3], r[4], r[4] === 'ok' ? P(r[5]) : '');
      e.at = now - r[6] * 3600000; if (e.st === 'ok') e.checkedAt = e.at + 3600000;
    });
    meta.push('seeded'); K.save();
  }

  /* Tabs */
  var TABS = ['Mine', 'Log', 'Check', 'Wall', 'Way'];
  TABS.forEach(function (t) {
    $('t' + t).addEventListener('click', function () {
      TABS.forEach(function (u) { $('t' + u).setAttribute('aria-selected', String(u === t)); $('v' + u).hidden = u !== t; });
      draw();
    });
  });

  names($('mWho')); names($('lFor')); names($('lBy')); names($('cMe'));
  opts($('lAct'), ACTS.map(function (a) { return [a[0], a[1] + ' (' + a[2] + ' points)']; }));
  function actInfo() { var a = ACT[$('lAct').value]; $('lActInfo').textContent = a ? 'The idea behind it: ' + a[3] + ' (Gita ' + a[4] + ')' : ''; }
  $('lAct').addEventListener('change', actInfo); actInfo();
  $('mWho').addEventListener('change', draw);
  opts($('rPick'), RESOLVES.map(function (r, i) { return [String(i), r]; }));
  $('rSave').addEventListener('click', function () {
    var who = $('mWho').value, text = RESOLVES[+$('rPick').value], old = resolveOf(who);
    if (old) { old.text = text; old.at = Date.now(); } else pledges.push({ who: who, text: text, at: Date.now() });
    if (!K.save()) return;
    K.say('Resolve saved for ' + who + '. May you have the strength to keep it.');
    draw();
  });
  $('cMe').addEventListener('change', draw);

  $('lSend').addEventListener('click', function () {
    var who = $('lFor').value, by = $('lBy').value, act = $('lAct').value, note = $('lNote').value.trim();
    if (!note) { K.say('Please write one or two lines about what happened.'); return; }
    var bad = badText(note); if (bad) { K.say(bad); return; }
    var today = log.filter(function (e) { return e.who === who && e.act === act && e.st !== 'back' && sameDay(e.at, Date.now()); }).length;
    if (today >= DAY_CAP) { K.say('Not sent. "' + ACT[act][1] + '" already counts ' + DAY_CAP + ' times today for ' + who + '. Rest is part of steady work; try again tomorrow.'); return; }
    add(who, by, act, note);
    if (!K.save()) return;
    $('lNote').value = '';
    K.say('Sent for checking: ' + ACT[act][1] + ' for ' + who + '. A different person will check it.');
    draw();
  });

  function decide(e, ok) {
    var me = $('cMe').value;
    if (me === e.who || me === e.by) { K.say('Refused. ' + me + (me === e.who ? ' did this deed' : ' wrote this') + ', so a different person must check it.'); return; }
    if (ok) { e.st = 'ok'; e.checker = me; e.checkedAt = Date.now(); K.say('Checked by ' + me + ': ' + e.pts + ' points for ' + e.who + '. Thank you.'); }
    else {
      var why = (($('why-' + e.id) || {}).value || '').trim();
      if (!why) { K.say('Please write a kind reason before sending it back.'); return; }
      var bad = badText(why); if (bad) { K.say(bad); return; }
      e.st = 'back'; e.checker = me; e.checkedAt = Date.now(); e.why = why; K.say('Sent back to ' + e.by + ' with a reason. No points are taken away.');
    }
    K.save(); draw();
  }

  $('cImport').addEventListener('click', function () {
    var t = K.get('hlpTickets'), n = 0, seen = {};
    log.forEach(function (e) { if (e.src) seen[e.src] = 1; });
    t.forEach(function (x) {
      if (x.st !== 'Closed' || !x.helper || seen['hlp:' + x.id] || people.indexOf(x.helper) < 0) return;
      var e = add(x.helper, x.who, 'help', 'Help desk ' + x.no + ' fixed, confirmed by the person who asked.', 'ok', x.who, 'hlp:' + x.id);
      e.at = x.closedAt || Date.now(); n++;
    });
    K.save();
    K.say(n ? 'Brought in ' + n + ' fixed help desk ticket' + (n > 1 ? 's' : '') + '. The person who asked already checked each one.' : 'No new fixed help desk tickets to bring in.');
    draw();
  });

  $('cDown').addEventListener('click', function () {
    var q = function (v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var rows = [['When', 'Who did it', 'Written by', 'Good deed', 'Points', 'Status', 'Checked by', 'Note', 'Reason sent back']];
    log.forEach(function (e) { rows.push([stamp(e.at), e.who, e.by, ACT[e.act][1], e.pts, e.st === 'ok' ? 'Checked' : e.st === 'wait' ? 'Waiting' : 'Sent back', e.checker, e.note, e.why]); });
    K.download('karma-log.csv', rows.map(function (r) { return r.map(q).join(','); }).join('\n'));
  });

  function entry(e, withBtns) {
    var a = ACT[e.act], tag = e.st === 'ok' ? h('span', { class: 'k-tag k-ok', text: 'Checked' }) : e.st === 'wait' ? h('span', { class: 'k-tag k-warn', text: 'Waiting for check' }) : h('span', { class: 'k-tag', text: 'Sent back' });
    var li = h('li', { class: 'k-item' }, [
      h('p', {}, [tag, h('strong', { text: a[1] + ', ' + e.pts + ' points' })]),
      h('p', { text: e.note + '\nWho: ' + e.who + '. Written by ' + e.by + ', ' + stamp(e.at) + '.' + (e.checker ? (e.st === 'ok' ? '\nChecked by ' : '\nSent back by ') + e.checker + '.' : '') + (e.why ? '\nReason: ' + e.why : '') })
    ]);
    if (withBtns) {
      li.appendChild(h('label', { class: 'k-lab', for: 'why-' + e.id, text: 'Kind reason, only if sending back' }));
      li.appendChild(h('input', { class: 'k-in', id: 'why-' + e.id, maxlength: '160' }));
      li.appendChild(h('div', { class: 'k-mini' }, [K.btn('Confirm it happened', function () { decide(e, true); }, 'k-small'), K.btn('Send back', function () { decide(e, false); })]));
    }
    return li;
  }
  function newest(a, b) { return (b.checkedAt || b.at) - (a.checkedAt || a.at); }

  function draw() {
    /* My karma */
    var who = $('mWho').value, s = stats(who), L = levelOf(s.pts), N = nextOf(s.pts), have = badgesOf(s);
    $('mPts').textContent = s.pts;
    $('rNow').textContent = s.resolve ? 'Resolve of ' + who + ': "' + s.resolve.text + '" (made ' + stamp(s.resolve.at) + ')' : who + ' has not made a resolve yet. Choose one below.';
    if (s.resolve) $('rPick').value = String(Math.max(0, RESOLVES.indexOf(s.resolve.text)));
    $('mLevel').textContent = L[1];
    $('mLine').textContent = L[2];
    $('mBar').max = N ? N[0] - L[0] : 1; $('mBar').value = N ? s.pts - L[0] : 1;
    $('mNext').textContent = N ? (N[0] - s.pts) + ' more points to ' + N[1] + '. No hurry: steady work gets there.' : 'You have reached the highest level. Keep serving for its own sake.';
    $('mWait').textContent = s.wait ? s.wait + ' points are waiting for a check.' : '';
    var bl = K.clear($('mBadges'));
    BADGES.forEach(function (b) {
      var on = have.indexOf(b) >= 0;
      bl.appendChild(h('li', { class: 'kr-badge ' + (on ? 'kr-on' : 'kr-off') }, [h('strong', { text: (on ? 'Earned: ' : 'Not yet: ') + b[1] }), h('p', { text: b[2] })]));
    });
    var ml = K.clear($('mList')), mine = log.filter(function (e) { return e.who === who; }).sort(newest);
    if (!mine.length) ml.appendChild(h('li', { class: 'k-note', text: 'No good deeds logged yet. Every journey starts with one step.' }));
    mine.forEach(function (e) { ml.appendChild(entry(e, false)); });

    /* Check queue */
    var wait = log.filter(function (e) { return e.st === 'wait'; }).sort(newest);
    $('cSum').textContent = wait.length + ' good deed' + (wait.length === 1 ? '' : 's') + ' waiting for a check.';
    var cl = K.clear($('cList'));
    wait.forEach(function (e) { cl.appendChild(entry(e, true)); });
    var tb = K.clear($('cTeam').tBodies[0]);
    people.slice().sort().forEach(function (p) {
      var x = stats(p);
      tb.appendChild(h('tr', {}, [h('td', { text: p }), h('td', { text: levelOf(x.pts)[1] }), h('td', { text: String(x.pts) }), h('td', { text: String(x.wait) }), h('td', { text: String(badgesOf(x).length) })]));
    });

    /* Wall */
    var wl = K.clear($('wList'));
    log.filter(function (e) { return e.st === 'ok'; }).sort(newest).slice(0, 30).forEach(function (e) {
      wl.appendChild(h('li', { class: 'k-item' }, [h('p', { text: 'Thank you, ' + e.who + ': ' + e.note }), h('p', { class: 'k-note', text: ACT[e.act][1] + '. Checked by ' + e.checker + ', ' + stamp(e.checkedAt || e.at) + '.' })]));
    });
  }

  /* The way we work (static) */
  var yl = $('yList');
  WAY.forEach(function (w) { yl.appendChild(h('li', { class: 'k-item' }, [h('p', {}, [h('strong', { text: w[0] }), ' (' + w[1] + ')']), h('p', { text: w[2] })])); });
  var lv = $('yLevels').tBodies[0];
  LEVELS.forEach(function (l) { lv.appendChild(h('tr', {}, [h('td', { text: l[1] }), h('td', { text: l[0] + ' points' }), h('td', { text: l[2] })])); });
  var at = $('yActs').tBodies[0];
  ACTS.forEach(function (a) { at.appendChild(h('tr', {}, [h('td', { text: a[1] }), h('td', { text: String(a[2]) }), h('td', { text: a[3] + ' (Gita ' + a[4] + ')' })])); });

  draw();
})();
