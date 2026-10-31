(function () {
  "use strict";
  var M = window.MBA, DAY = 86400000;
  var KEY = "hfl_mba_test_state_v1";
  var S = load();
  var main = document.getElementById("main"), side = document.getElementById("side");

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) return s; } catch (e) {}
    return { start: M.startDefault, done: {}, subs: {}, posts: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function course(id) { return M.courses.filter(function (c) { return c.id === id; })[0]; }
  function startMs() { var p = S.start.split("-"); return Date.UTC(+p[0], p[1] - 1, +p[2]); }
  function weekStart(c, w) { return startMs() + (c.startWeek + w - 1) * 7 * DAY; }
  function fmt(ms) { return new Date(ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); }
  function dueMs(c, a) { return weekStart(c, a.week) + 6 * DAY; } // Sunday of that week, 23:59 Dubai
  function wkey(c, w) { return c.id + ":" + w; }
  function pct(c) { var n = 0; for (var w = 1; w <= 8; w++) if (S.done[wkey(c, w)]) n++; return Math.round(n / 8 * 100); }
  function score(a) { var s = S.subs[a.id]; return s && typeof s.score === "number" ? s.score : null; }
  function courseGrade(c) {
    var tot = 0, got = 0;
    c.assess.forEach(function (a) { var s = score(a); if (s !== null) { tot += a.w; got += a.w * s / 4; } });
    return tot ? { pct: got / tot * 100, gpa: got / tot * 4, weight: tot } : null;
  }
  function band(g) { for (var i = 0; i < M.bands.length; i++) if (g >= M.bands[i][1]) return M.bands[i][0]; return ""; }

  function layout(sideHtml, html) {
    side.innerHTML = sideHtml; main.innerHTML = html;
    Array.prototype.forEach.call(main.querySelectorAll("[data-w]"), function (e) { e.style.width = e.getAttribute("data-w") + "%"; });
  }
  function sideFor(c, cur) {
    var items = [["", "Home"], ["/announcements", "Announcements"], ["/modules", "Modules"], ["/assignments", "Assignments"], ["/discussions", "Discussions"], ["/grades", "Grades"], ["/syllabus", "Syllabus"], ["/people", "People"]];
    return "<h3>" + esc(c.id) + "</h3>" + items.map(function (i) {
      return '<a href="#/c/' + c.id + i[0] + '"' + (cur === i[0] ? ' class="on"' : "") + ">" + i[1] + "</a>";
    }).join("");
  }
  function crumb(c, t) { return '<div class="crumb"><a href="#/courses">Courses</a> / <a href="#/c/' + c.id + '">' + esc(c.id) + "</a>" + (t ? " / " + esc(t) : "") + "</div>"; }

  // ---------- pages ----------
  function pHome() {
    var next = M.courses.filter(function (c) { return pct(c) < 100; })[0] || M.courses[11];
    layout("", "<h1>Dashboard</h1><p>Welcome, demo learner. Cohort starts " + fmt(startMs()) + ". This is a test preview.</p>" +
      '<div class="card"><div class="banner"></div><h2 class="mt6">Continue with ' + esc(next.id) + "</h2><p><strong>" + esc(next.title) + "</strong></p>" +
      '<div class="bar"><i data-w="' + pct(next) + '"></i></div><p><a class="btn" href="#/c/' + next.id + '">Open course</a></p></div>' +
      "<h2>Programme at a glance</h2>" + M.terms.map(function (t) {
        return '<div class="card"><strong>Term ' + t.n + "</strong> (months " + t.months + ") - " + esc(t.theme) + "<br>" +
          M.courses.filter(function (c) { return c.term === t.n; }).map(function (c) { return '<a class="pill" href="#/c/' + c.id + '">' + c.id + " " + esc(c.title) + "</a>"; }).join("") + "</div>";
      }).join("") +
      '<div class="card"><strong>Stackable exits</strong><ul><li>Executive Certificate: terms 1 and 2, 20 credits</li><li>Executive Diploma: terms 1 to 4, 40 credits</li><li>Executive Master: all six terms, 60 credits</li></ul><p class="note">Credit statements are our own aligned-with wording and need a legal check before they are promised.</p></div>' +
      "<h2>Upcoming</h2>" + upcomingHtml(5));
  }
  function upcomingHtml(n) {
    var now = Date.now(), ev = [];
    M.courses.forEach(function (c) { c.assess.forEach(function (a) { ev.push({ t: dueMs(c, a), txt: c.id + ": " + a.name + " due", href: "#/c/" + c.id + "/a/" + a.id }); }); });
    ev.sort(function (a, b) { return a.t - b.t; });
    var list = ev.filter(function (e) { return e.t >= now; }).slice(0, n);
    if (!list.length) list = ev.slice(0, n);
    return '<div class="card">' + list.map(function (e) { return '<div class="item slim"><a href="' + e.href + '">' + esc(e.txt) + "</a><span class='note'>" + fmt(e.t) + "</span></div>"; }).join("") + "</div>";
  }
  function pCourses() {
    layout("", "<h1>Courses</h1><p>Twelve courses over six terms.</p>" + M.terms.map(function (t) {
      return "<h2>Term " + t.n + " - " + esc(t.theme) + '</h2><div class="grid">' + M.courses.filter(function (c) { return c.term === t.n; }).map(cardHtml).join("") + "</div>";
    }).join(""));
  }
  function cardHtml(c) {
    return '<div class="card"><div class="banner"></div><strong>' + c.id + "</strong><a href=\"#/c/" + c.id + '">' + esc(c.title) + "</a><span class='note'>" + esc(c.blurb) + '</span><div class="bar"><i data-w="' + pct(c) + '"></i></div><span class="note">' + pct(c) + "% complete</span></div>";
  }
  function pCourse(c) {
    layout(sideFor(c, ""), crumb(c) + "<h1>" + esc(c.title) + "</h1><p>" + esc(c.blurb) + "</p>" + '<p><button type="button" class="alt" data-lang-toggle aria-controls="lang-panel" aria-expanded="false">Choose language</button> <span class="note">English is the official text; other languages are machine translation.</span></p>' +
      '<div class="card"><div class="banner"></div><h2 class="mt6">You will be able to</h2><ul>' + c.outcomes.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +
      "<p><strong>Tools:</strong> " + c.tools.map(function (t) { return '<span class="pill">' + esc(t) + "</span>"; }).join("") + "</p>" +
      "<p><strong>Runs:</strong> " + fmt(weekStart(c, 1)) + " to " + fmt(weekStart(c, 8) + 6 * DAY) + "</p>" +
      '<div class="bar"><i data-w="' + pct(c) + '"></i></div><p><a class="btn" href="#/c/' + c.id + '/modules">Go to modules</a></p></div>' +
      "<h2>Practice game</h2><div class='card'>" + esc(c.game) + "</div>" +
      "<h2>Assessment</h2>" + assessTable(c));
  }
  function assessTable(c) {
    return '<div class="tw"><table><tr><th>Item</th><th>Weight</th><th>Due</th></tr>' + c.assess.map(function (a) {
      return '<tr><td><a href="#/c/' + c.id + "/a/" + a.id + '">' + esc(a.name) + "</a><br><span class='note'>" + esc(a.kind) + "</span></td><td>" + a.w + "%</td><td>" + fmt(dueMs(c, a)) + "</td></tr>";
    }).join("") + "</table></div>";
  }
  function pAnnouncements(c) {
    layout(sideFor(c, "/announcements"), crumb(c, "Announcements") + "<h1>Announcements</h1>" +
      '<div class="card"><strong>Welcome to ' + esc(c.title) + "</strong><p class='note'>Posted by the programme team, test content</p><p>Week 1 opens " + fmt(weekStart(c, 1)) + ". The live session is every Thursday at " + M.liveTime + " Dubai time. Bring your notes and one question.</p></div>" +
      '<div class="card"><strong>How marking works</strong><p>Three graded pieces. Marks use a 4.0 scale: A is 3.67 and above, B is 2.67 and above, C is 2.0 and above.</p></div>');
  }
  function pModules(c) {
    layout(sideFor(c, "/modules"), crumb(c, "Modules") + "<h1>Modules</h1>" + c.weeks.map(function (w, i) {
      var n = i + 1, done = S.done[wkey(c, n)];
      var items = [["Read", "Week " + n + " page", "#/c/" + c.id + "/w/" + n, done], ["Discuss", "Discussion: " + w[0], "#/c/" + c.id + "/d/" + n, false]];
      c.assess.filter(function (a) { return a.week === n; }).forEach(function (a) { items.push(["Submit", a.name + " (" + a.w + "%)", "#/c/" + c.id + "/a/" + a.id, S.subs[a.id]]); });
      return '<details class="mod"' + (n === 1 ? " open" : "") + "><summary>Week " + n + ": " + esc(w[0]) + ' <span class="note">' + fmt(weekStart(c, n)) + "</span></summary>" +
        items.map(function (it) { return '<div class="item"><span class="dot' + (it[3] ? " done" : "") + '"></span><span class="pill">' + it[0] + '</span><a href="' + it[2] + '">' + esc(it[1]) + "</a></div>"; }).join("") + "</details>";
    }).join(""));
  }
  function deepHtml(c, n, w) {
    var d = (window.MBA_DEEP[c.id] || [])[n - 1];
    var base = '<div class="card"><h2 class="mt0">Key idea</h2><p>' + esc(w[1]) + "</p></div>";
    if (!d) return base;
    return base + '<div class="card"><h2 class="mt0">Read</h2>' + d.r.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
      '<div class="card"><h2 class="mt0">Worked example</h2><p>' + esc(d.ex) + "</p></div>" +
      '<div class="card"><h2 class="mt0">Do this week</h2><ol>' + d.st.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "<li>Join the live session on Thursday at " + M.liveTime + " Dubai time.</li><li>Post once and reply twice in the discussion.</li></ol></div>" +
      (n === 5 || n === 7 ? "<div class='card'><h2 class='mt0'>Practice game</h2><p>" + esc(c.game) + "</p></div>" : "") +
      '<div class="card"><h2 class="mt0">Self-check</h2>' + d.q.map(function (q) { return "<details><summary>" + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>"; }).join("") + "</div>";
  }
  function pWeek(c, n) {
    var w = c.weeks[n - 1]; if (!w) return notFound();
    var done = S.done[wkey(c, n)];
    layout(sideFor(c, "/modules"), crumb(c, "Week " + n) + "<h1>Week " + n + ": " + esc(w[0]) + "</h1><p class='note'>" + fmt(weekStart(c, n)) + " to " + fmt(weekStart(c, n) + 6 * DAY) + "</p>" +
      '<p><button type="button" class="alt" data-lang-toggle aria-controls="lang-panel" aria-expanded="false">Choose language</button> <span class="note">English is the official text; other languages are machine translation.</span></p>' + deepHtml(c, n, w) +
      '<p><button id="doneBtn">' + (done ? "Mark as not done" : "Mark week as done") + '</button> <a class="btn alt" href="#/c/' + c.id + "/d/" + n + '">Go to discussion</a> ' +
      (n > 1 ? '<a class="btn alt" href="#/c/' + c.id + "/w/" + (n - 1) + '">Previous</a> ' : "") + (n < 8 ? '<a class="btn alt" href="#/c/' + c.id + "/w/" + (n + 1) + '">Next</a>' : "") + "</p>");
    document.getElementById("doneBtn").onclick = function () { S.done[wkey(c, n)] = !done; save(); pWeek(c, n); };
  }
  function pAssignments(c) {
    layout(sideFor(c, "/assignments"), crumb(c, "Assignments") + "<h1>Assignments</h1>" +
      '<div class="tw"><table><tr><th>Name</th><th>Due</th><th>Weight</th><th>Status</th></tr>' + c.assess.map(function (a) {
        var s = S.subs[a.id]; return '<tr><td><a href="#/c/' + c.id + "/a/" + a.id + '">' + esc(a.name) + "</a></td><td>" + fmt(dueMs(c, a)) + "</td><td>" + a.w + "%</td><td>" +
          (s ? (typeof s.score === "number" ? '<span class="pill ok">Marked ' + s.score.toFixed(2) + "</span>" : '<span class="pill">Submitted</span>') : '<span class="pill late">Not submitted</span>') + "</td></tr>";
      }).join("") + "</table></div>");
  }
  function pAssignment(c, aid) {
    var a = c.assess.filter(function (x) { return x.id === aid; })[0]; if (!a) return notFound();
    var s = S.subs[a.id], br = ((window.MBA_ASSIGN || {})[c.id] || [])[c.assess.indexOf(a)];
    layout(sideFor(c, "/assignments"), crumb(c, a.name) + "<h1>" + esc(a.name) + "</h1><p><span class='pill'>" + a.w + "%</span><span class='pill'>Due " + fmt(dueMs(c, a)) + ", 23:59 Dubai time</span></p>" +
      '<div class="card"><h2 class="mt0">What to do</h2>' + (br ? "<p>" + esc(br.b) + "</p><h2>What to hand in</h2><ul>" + br.h.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "<p>" + esc(a.kind) + "</p>") + "<p>Use your own words and credit every source. State clearly where you used an AI tool.</p>" +
      "<h2>Marking guide</h2>" + rubric(br) + "</div>" +
      '<div class="card"><label for="sub">Your submission (test: kept only in this browser)</label><textarea id="sub">' + esc(s ? s.text : "") + '</textarea><p><button id="subBtn">' + (s ? "Resubmit" : "Submit") + "</button></p>" +
      (s ? "<p class='note'>Submitted " + esc(s.at) + "</p>" : "") +
      (s && typeof s.score !== "number" ? '<p><button class="alt" id="markBtn">Test only: simulate reviewer marking</button></p>' : "") +
      (s && typeof s.score === "number" ? "<p><strong>Mark: " + s.score.toFixed(2) + " / 4.00 (" + band(s.score) + ")</strong></p>" : "") + "</div>");
    document.getElementById("subBtn").onclick = function () {
      var t = document.getElementById("sub").value.trim(); if (!t) { alert("Please write something first."); return; }
      S.subs[a.id] = { text: t, at: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" }) + " Dubai" }; save(); pAssignment(c, aid);
    };
    var mb = document.getElementById("markBtn");
    if (mb) mb.onclick = function () { var len = S.subs[a.id].text.length; S.subs[a.id].score = Math.min(4, 2.7 + len / 600); save(); pAssignment(c, aid); };
  }
  function rubric(br) {
    var rows = br ? br.r : [["Depth of diagnosis", "Names causes, not only symptoms, with evidence"], ["Decisions in practice tasks", "Choices are sound and explained"], ["Use of the course tools", "Tools are applied correctly and fit the case"], ["Executive delivery", "Clear, answer-first, calm under questions"]];
    return '<div class="tw"><table><tr><th>Row</th><th>Top band looks like</th></tr>' + rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("") + "</table></div>";
  }
  function pDiscussions(c) {
    layout(sideFor(c, "/discussions"), crumb(c, "Discussions") + "<h1>Discussions</h1>" + c.weeks.map(function (w, i) {
      var k = c.id + ":" + (i + 1), n = (S.posts[k] || []).length;
      return '<div class="card"><a href="#/c/' + c.id + "/d/" + (i + 1) + '">Week ' + (i + 1) + ": " + esc(w[0]) + "</a> <span class='pill'>" + n + " posts</span></div>";
    }).join(""));
  }
  function pDiscussion(c, n) {
    var w = c.weeks[n - 1]; if (!w) return notFound();
    var k = c.id + ":" + n, posts = S.posts[k] || [];
    layout(sideFor(c, "/discussions"), crumb(c, "Discussion week " + n) + "<h1>" + esc(w[0]) + "</h1>" +
      '<div class="card"><strong>Prompt</strong><p>' + esc(w[1]) + " Share one example from your own work where this showed up, and what you would do differently.</p><p class='note'>Post once, reply to two classmates. Be specific and kind.</p></div>" +
      posts.map(function (p) { return '<div class="post"><strong>' + esc(p.who) + "</strong> <span class='note'>" + esc(p.at) + "</span><p>" + esc(p.text) + "</p></div>"; }).join("") +
      '<label for="dp">Your post</label><textarea id="dp"></textarea><p><button id="dpBtn">Post</button></p>');
    document.getElementById("dpBtn").onclick = function () {
      var t = document.getElementById("dp").value.trim(); if (!t) return;
      (S.posts[k] = S.posts[k] || []).push({ who: "Demo learner", at: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" }), text: t }); save(); pDiscussion(c, n);
    };
  }
  function pCourseGrades(c) {
    var g = courseGrade(c);
    layout(sideFor(c, "/grades"), crumb(c, "Grades") + "<h1>Grades</h1>" + gradeTable([c]) +
      (g ? "<p><strong>Current: " + g.pct.toFixed(1) + "% (" + g.gpa.toFixed(2) + " / 4.00, " + band(g.gpa) + ")</strong>, based on " + g.weight + "% of the course marked so far.</p>" : "<p class='note'>Nothing marked yet.</p>"));
  }
  function gradeTable(cs) {
    return '<div class="tw"><table><tr><th>Course</th><th>Item</th><th>Weight</th><th>Mark (of 4.00)</th></tr>' + cs.map(function (c) {
      return c.assess.map(function (a) { var s = score(a); return "<tr><td>" + c.id + "</td><td>" + esc(a.name) + "</td><td>" + a.w + "%</td><td>" + (s === null ? "-" : s.toFixed(2)) + "</td></tr>"; }).join("");
    }).join("") + "</table></div>";
  }
  function pAllGrades() {
    var rows = M.courses.map(function (c) { var g = courseGrade(c); return "<tr><td><a href=\"#/c/" + c.id + '/grades">' + c.id + "</a> " + esc(c.title) + "</td><td>" + (g ? g.pct.toFixed(1) + "%" : "-") + "</td><td>" + (g ? band(g.gpa) : "-") + "</td></tr>"; }).join("");
    layout("", "<h1>Grades</h1><div class='tw'><table><tr><th>Course</th><th>Current</th><th>Band</th></tr>" + rows + "</table></div><p class='note'>Bands: A 3.67 and above, B 2.67 and above, C 2.0 and above.</p>");
  }
  function pSyllabus(c) {
    layout(sideFor(c, "/syllabus"), crumb(c, "Syllabus") + "<h1>Syllabus</h1><div class='tw'><table><tr><th>Week</th><th>Dates</th><th>Topic</th></tr>" +
      c.weeks.map(function (w, i) { return "<tr><td>" + (i + 1) + "</td><td>" + fmt(weekStart(c, i + 1)) + "</td><td>" + esc(w[0]) + "</td></tr>"; }).join("") + "</table></div><h2>Assessment</h2>" + assessTable(c) +
      "<h2>Delivery</h2><p>About 70% practice, 20% digital study and 10% mentoring. Weekly live session on Thursday at " + M.liveTime + " Dubai time.</p><h2>Integrity</h2><p>Your own work, sources credited, tool use declared.</p>");
  }
  function pPeople(c) {
    layout(sideFor(c, "/people"), crumb(c, "People") + "<h1>People</h1><div class='card'><strong>Programme Director</strong><br><span class='note'>Role listed here; name shown once consent is given.</span></div><div class='card'><strong>Course mentor</strong><br><span class='note'>Assigned at enrolment.</span></div><div class='card'><strong>Demo learner</strong><br><span class='note'>You (test account).</span></div>");
  }
  function pCalendar(ym) {
    var base = new Date(startMs()), y, m;
    if (ym) { var p = ym.split("-"); y = +p[0]; m = +p[1] - 1; } else { y = base.getUTCFullYear(); m = base.getUTCMonth(); }
    var first = Date.UTC(y, m, 1), dow = (new Date(first).getUTCDay() + 6) % 7, gridStart = first - dow * DAY;
    var ev = {};
    function add(ms, cls, txt, href) { var k = Math.floor(ms / DAY); (ev[k] = ev[k] || []).push({ cls: cls, txt: txt, href: href }); }
    M.courses.forEach(function (c) {
      add(weekStart(c, 1), "start", c.id + " starts", "#/c/" + c.id);
      for (var w = 1; w <= 8; w++) add(weekStart(c, w) + (M.liveDay - 1) * DAY, "live", c.id + " live " + M.liveTime, "#/c/" + c.id + "/w/" + w);
      c.assess.forEach(function (a) { add(dueMs(c, a), "due", c.id + " " + a.name + " due", "#/c/" + c.id + "/a/" + a.id); });
    });
    var h = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function (d) { return '<div class="h">' + d + "</div>"; }).join("");
    var cells = "";
    for (var i = 0; i < 42; i++) {
      var ms = gridStart + i * DAY, d = new Date(ms), other = d.getUTCMonth() !== m;
      cells += '<div class="' + (other ? "o" : "") + '">' + d.getUTCDate() + (ev[Math.floor(ms / DAY)] || []).map(function (e) { return '<a class="ev ' + e.cls + '" href="' + e.href + '">' + esc(e.txt) + "</a>"; }).join("") + "</div>";
    }
    var pm = new Date(Date.UTC(y, m - 1, 1)), nm = new Date(Date.UTC(y, m + 1, 1));
    function ymS(d) { return d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1); }
    layout("", "<h1>Calendar</h1><p>" + new Date(first).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) + ' <a class="btn alt" href="#/calendar/' + ymS(pm) + '">Previous</a> <a class="btn alt" href="#/calendar/' + ymS(nm) + '">Next</a></p>' +
      '<div class="cal">' + h + cells + '</div><p class="note">Blue: course starts. Green: live session. Orange: due. Dubai time.</p>' +
      '<div class="card"><label for="st">Cohort start date (a Monday)</label><input type="date" id="st" value="' + S.start + '"></div>');
    document.getElementById("st").onchange = function () { if (this.value) { S.start = this.value; save(); pCalendar(); } };
  }
  function pSpecialist() {
    layout("", "<h1>Specialist modules</h1><p>Fourteen stand-alone modules of 75 learning hours each (2.5 credits, aligned with the OECD micro-credential recommendation, not accredited). They stack into the executive master or can be taken alone.</p>" +
      M.specialist.map(function (s) { return '<div class="card"><strong>Module ' + s.n + ": " + esc(s.title) + "</strong><p>" + esc(s.blurb) + '</p><a href="#/m/' + s.n + '">Open</a></div>'; }).join(""));
  }
  function pSpecialistOne(n) {
    var s = M.specialist[n - 1]; if (!s) return notFound();
    layout("", '<div class="crumb"><a href="#/specialist">Specialist modules</a></div><h1>' + esc(s.title) + "</h1><p>" + esc(s.blurb) + "</p><p><span class='pill'>" + s.hours + " hours</span><span class='pill'>" + s.ects + " credits (aligned-with)</span></p>" +
      "<h2>Every module has five parts</h2><ol>" + s.parts.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol><h2>Assessment</h2><div class='tw'><table><tr><th>Item</th><th>Weight</th></tr>" + s.assess.map(function (a) { return "<tr><td>" + a[0] + "</td><td>" + a[1] + "%</td></tr>"; }).join("") + "</table></div>");
  }
  function notFound() { layout("", "<h1>Page not found</h1><p><a href=\"#/\">Back to the dashboard</a></p>"); }

  // ---------- router ----------
  function route() {
    var h = location.hash.replace(/^#/, "") || "/", p = h.split("/").filter(Boolean);
    document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
    document.querySelector(".gnav").classList.remove("open");
    var r = p[0] || "home";
    Array.prototype.forEach.call(document.querySelectorAll(".gnav a"), function (a) { a.classList.toggle("on", a.getAttribute("data-r") === (r === "c" || r === "m" ? (r === "m" ? "specialist" : "courses") : r)); });
    if (r === "c" && p[1]) {
      var c = course(p[1]); if (!c) return notFound();
      var s = p[2];
      if (!s) pCourse(c); else if (s === "announcements") pAnnouncements(c); else if (s === "modules") pModules(c);
      else if (s === "w") pWeek(c, +p[3]); else if (s === "assignments") pAssignments(c); else if (s === "a") pAssignment(c, p[3]);
      else if (s === "discussions") pDiscussions(c); else if (s === "d") pDiscussion(c, +p[3]); else if (s === "grades") pCourseGrades(c);
      else if (s === "syllabus") pSyllabus(c); else if (s === "people") pPeople(c); else notFound();
    } else if (r === "home") pHome(); else if (r === "courses") pCourses(); else if (r === "calendar") pCalendar(p[1]);
    else if (r === "grades") pAllGrades(); else if (r === "specialist") pSpecialist(); else if (r === "m") pSpecialistOne(+p[1]); else notFound();
    window.scrollTo(0, 0);
  }
  document.getElementById("menuBtn").onclick = function () {
    var n = document.querySelector(".gnav"), o = n.classList.toggle("open"); this.setAttribute("aria-expanded", o);
  };
  window.addEventListener("hashchange", route);
  route();
})();
