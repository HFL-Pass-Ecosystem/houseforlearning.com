/* Sabha-Karyalaya: whiteboard, team chat and PMO tools. Runs offline in any modern browser. Data stays in this browser until the Setu API is connected. */
(function () {
  const C = window.CATALOG, I = window.ICONS, K = window.CORE;
  const KEY = "sabha.v1";
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safe = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } } };

  let store = load(); let tab = "overview"; let chan = "general"; let board = null;
  const bc = ("BroadcastChannel" in window) ? new BroadcastChannel("sabha") : null;

  function load() {
    try { const s = JSON.parse(safe.get(KEY)); if (s && Array.isArray(s.projects)) return s; } catch (e) { /* new store */ }
    return { projects: [], current: null };
  }
  function save() { safe.set(KEY, JSON.stringify(store)); if (bc) bc.postMessage("sync"); }
  if (bc) bc.onmessage = () => { if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; store = load(); render(); };

  const P = () => store.projects.find((p) => p.id === store.current) || null;
  const me = () => safe.get("sabha.me") || "Me";

  const TABS = [
    ["overview", "Darshan", "Overview", "target"], ["board", "Phalaka", "Whiteboard", "columns"], ["chat", "Samvad", "Team chat", "chat"],
    ["time", "Kala", "Time", "clock"], ["cost", "Dhana", "Cost", "money"], ["quality", "Gunavatta", "Quality", "check"],
    ["health", "Arogya", "Health", "heart"], ["safety", "Suraksha", "Safety", "hardhat"], ["env", "Paryavaran", "Environment", "leaf"],
    ["plan", "Yojana", "Planning and offerings", "layers"], ["agent", "Dootha", "Assistant", "spark"]
  ];

  function render() {
    const sel = $("#projSel");
    sel.innerHTML = store.projects.length ? store.projects.map((p) => '<option value="' + esc(p.id) + '"' + (p.id === store.current ? " selected" : "") + ">" + esc(p.name) + "</option>").join("") : "<option>No project yet</option>";
    const p = P(); const app = $("#app");
    if (board) { board.destroy(); board = null; }
    if (tab === "new" || !p) { app.innerHTML = wizard(); bindWizard(); return; }
    const tabs = '<nav class="tabs">' + TABS.map((t) => '<button data-tab="' + t[0] + '" class="' + (tab === t[0] ? "on" : "") + '" title="' + t[2] + '">' + I.svg(t[3], 16) + '<span><b>' + t[1] + "</b> <span style='opacity:.8'>" + t[2] + "</span></span></button>").join("") + "</nav>";
    app.innerHTML = tabs + '<div id="view">' + ({ overview, board: boardView, chat: chatView, time: timeView, cost: costView, quality: qualityView, health: healthView, safety: safetyView, env: envView, plan: planView, agent: agentView }[tab] || overview)(p) + "</div>";
    if (tab === "board") board = makeBoard($("#wb"), p);
    if (tab === "chat") { const m = $(".msgs"); if (m) m.scrollTop = m.scrollHeight; }
  }

  const dot = (c) => '<span class="dot ' + c + '" title="' + c + '"></span>';
  const sectorOf = (id) => C.sectors.find((s) => s.id === id) || C.sectors[0];
  const modelOf = (id) => C.models.find((m) => m.id === id) || C.models[0];
  const fmt = (n) => n == null ? "n/a" : Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const inp = (path, v, type, extra) => '<input data-p="' + path + '" type="' + (type || "text") + '" value="' + esc(v) + '" ' + (extra || "") + ">";
  const sel = (path, v, opts) => '<select data-p="' + path + '">' + opts.map((o) => '<option' + (String(o) === String(v) ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select>";
  const chk = (path, v) => '<input data-p="' + path + '" type="checkbox"' + (v ? " checked" : "") + ">";
  const del = (path) => '<button class="o sm" data-del="' + path + '" aria-label="Delete row">x</button>';
  const add = (kind, label) => '<button class="b sm" data-add="' + kind + '">+ ' + label + "</button>";

  /* ---------- Overview ---------- */
  function overview(p) {
    const r = K.rag(p), e = K.evm(p), m = modelOf(p.model), s = sectorOf(p.sector);
    const areas = [["Time", "Kala", r.time], ["Cost", "Dhana", r.cost], ["Quality", "Gunavatta", r.quality], ["Health", "Arogya", r.health], ["Safety", "Suraksha", r.safety], ["Environment", "Paryavaran", r.environment]];
    return '<div class="card"><h2>' + esc(p.name) + '</h2><div class="note"><span class="sa">' + s.sa + '</span> <span class="en">' + s.en + '</span> &middot; <span class="sa">' + m.sa + '</span> <span class="en">' + m.en + "</span><br>" + esc(m.note) + "</div></div>" +
      '<div class="grid">' + areas.map((a) => '<div class="card">' + dot(a[2]) + ' <b>' + a[1] + '</b> <span class="en">' + a[0] + "</span></div>").join("") + "</div>" +
      '<div class="card"><h2>Money and time <span class="en">(earned value, ' + esc(p.currency) + ")</span></h2><table><tr><th>Budget (BAC)</th><th>Planned (PV)</th><th>Earned (EV)</th><th>Actual (AC)</th><th>Cost index (CPI)</th><th>Schedule index (SPI)</th><th>Forecast (EAC)</th></tr><tr>" +
      [e.BAC, e.PV, e.EV, e.AC, e.CPI, e.SPI, e.EAC].map((x) => "<td>" + fmt(x) + "</td>").join("") + "</tr></table><div class=\"note\">Total plan length: " + r.totalDays + " days. Indexes show n/a until there is spend or planned work. Colours come from fixed rules, not guesses: index 0.95 or more is green, 0.8 or more amber.</div></div>" +
      '<div class="card"><h2>Next steps <span class="en">(practice-mode assistant)</span></h2><ul>' + K.advise(p).map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul></div>" +
      '<div class="card"><h2>Included offerings</h2>' + p.offerings.map((id) => { const o = C.offerings.find((x) => x.id === id); return o ? '<span class="chip">' + I.svg(o.icon, 14) + " " + esc(o.sa) + " &middot; " + esc(o.en) + "</span>" : ""; }).join("") + (p.addedByDependency.length ? '<div class="note">Added automatically because other items need them: ' + p.addedByDependency.map((id) => esc((C.offerings.find((x) => x.id === id) || {}).en)).join(", ") + ".</div>" : "") + "</div>";
  }

  /* ---------- New project wizard ---------- */
  function wizard() {
    return '<div class="card"><h2>New project <span class="en">(Nava Yojana)</span></h2>' +
      '<p><label>Name <input id="w-name" placeholder="Project name" style="width:min(420px,100%)"></label></p>' +
      '<p><label>Sector <select id="w-sector">' + C.sectors.map((s) => '<option value="' + s.id + '">' + s.sa + " - " + s.en + "</option>").join("") + "</select></label> " +
      '<label>Model <select id="w-model">' + C.models.map((m) => '<option value="' + m.id + '">' + m.sa + " - " + m.en + "</option>").join("") + "</select></label> " +
      '<label>Currency <select id="w-cur"><option>USD</option><option>AED</option><option>INR</option><option>CAD</option></select></label></p>' +
      "<h3>Offerings <span class=\"en\">(pick any; things they need are added for you)</span></h3>" +
      C.families.map((f) => "<h3>" + I.svg(f.icon, 16) + ' <span class="sa">' + f.sa + '</span> <span class="en">' + f.en + '</span></h3><div class="pick">' +
        C.offerings.filter((o) => o.family === f.id).map((o) => '<label><input type="checkbox" class="w-off" value="' + o.id + '"> <span>' + I.svg(o.icon, 16) + " <b>" + esc(o.sa) + "</b> " + esc(o.en) + "<br><span class=\"note\">" + (o.standalone ? "Works alone" : "Needs: " + o.requires.map((r) => esc(C.offerings.find((x) => x.id === r).en)).join(", ")) + "</span></span></label>").join("") + "</div>").join("") +
      '<p><button id="w-go" class="b g">Create project with board, tasks, budget and QHSE registers</button> ' + (store.projects.length ? '<button id="w-cancel" class="o b" style="color:inherit">Cancel</button>' : "") + "</p></div>";
  }
  function bindWizard() {
    $("#w-go").onclick = () => {
      const p = K.createProject({ name: $("#w-name").value.trim() || "Untitled project", sector: $("#w-sector").value, model: $("#w-model").value, currency: $("#w-cur").value, offerings: [...document.querySelectorAll(".w-off:checked")].map((x) => x.value) });
      store.projects.push(p); store.current = p.id; tab = "overview"; save(); render();
    };
    const c = $("#w-cancel"); if (c) c.onclick = () => { tab = "overview"; render(); };
  }

  /* ---------- Time ---------- */
  function timeView(p) {
    const sc = K.schedule(p.tasks), tot = Math.max(1, sc.total);
    return '<div class="card"><h2>Tasks and critical path <span class="en">(Kala)</span></h2><div style="overflow:auto"><table><tr><th>ID</th><th>Task</th><th>Days</th><th>Needs (IDs)</th><th>Owner</th><th>Done %</th><th>Float</th><th></th></tr>' +
      p.tasks.map((t, i) => "<tr><td>" + esc(t.id) + "</td><td>" + inp("tasks." + i + ".name", t.name) + "</td><td>" + inp("tasks." + i + ".days", t.days, "number", 'min="0"') + "</td><td>" + inp("tasks." + i + ".deps", (t.deps || []).join(" "), "text", 'data-list="1"') + "</td><td>" + inp("tasks." + i + ".owner", t.owner) + "</td><td>" + inp("tasks." + i + ".progress", t.progress, "number", 'min="0" max="100"') + "</td><td>" + (sc.map[t.id].critical ? '<b style="color:var(--red)">critical</b>' : sc.map[t.id].float + " d") + "</td><td>" + del("tasks." + i) + "</td></tr>").join("") + "</table></div>" +
      "<p>" + add("task", "Task") + ' &nbsp; Status day <input data-p="statusDay" type="number" min="0" value="' + esc(p.statusDay) + '" style="width:80px"> <span class="note">Day number used to work out planned progress (needed for earned value).</span></p></div>' +
      '<div class="card"><h2>Timeline <span class="en">(red = critical path, ' + sc.total + " days)</span></h2><div class=\"gantt\">" +
      p.tasks.map((t) => { const s = sc.map[t.id]; return '<div class="row"><span>' + esc(t.name) + '</span><div class="bar' + (s.critical ? " crit" : "") + '" style="left:' + (s.es / tot * 100) + "%;width:" + Math.max(0.8, (s.ef - s.es) / tot * 100) + '%"></div></div>'; }).join("") + "</div></div>";
  }

  /* ---------- Cost ---------- */
  function costView(p) {
    const e = K.evm(p);
    return '<div class="card"><h2>Budget and actual cost <span class="en">(Dhana, ' + esc(p.currency) + ")</span></h2><div style=\"overflow:auto\"><table><tr><th>Line</th><th>Budget</th><th>Actual</th><th>Linked task</th><th></th></tr>" +
      p.cost.map((c, i) => "<tr><td>" + inp("cost." + i + ".name", c.name) + "</td><td>" + inp("cost." + i + ".budget", c.budget, "number", 'min="0"') + "</td><td>" + inp("cost." + i + ".actual", c.actual, "number", 'min="0"') + "</td><td><select data-p=\"cost." + i + ".taskId\">" + p.tasks.map((t) => '<option value="' + esc(t.id) + '"' + (t.id === c.taskId ? " selected" : "") + ">" + esc(t.id + " " + t.name) + "</option>").join("") + "</select></td><td>" + del("cost." + i) + "</td></tr>").join("") +
      "</table></div><p>" + add("cost", "Cost line") + "</p></div>" +
      '<div class="card"><h2>Earned value</h2><table><tr><th>Budget</th><th>Planned</th><th>Earned</th><th>Actual</th><th>Cost variance</th><th>Schedule variance</th><th>CPI</th><th>SPI</th><th>Forecast</th></tr><tr>' + [e.BAC, e.PV, e.EV, e.AC, e.CV, e.SV, e.CPI, e.SPI, e.EAC].map((x) => "<td>" + fmt(x) + "</td>").join("") + '</tr></table><div class="note">Earned = budget x task done %. Planned = budget x share of the task due by the status day. Prices stay private: public pages show "price on request".</div></div>';
  }

  /* ---------- Quality ---------- */
  function qualityView(p) {
    return '<div class="card"><h2>Inspection and test plan <span class="en">(Gunavatta)</span></h2><table><tr><th>Check</th><th>Hold point</th><th>Status</th><th></th></tr>' +
      p.quality.checks.map((c, i) => "<tr><td>" + inp("quality.checks." + i + ".text", c.text) + "</td><td>" + chk("quality.checks." + i + ".hold", c.hold) + "</td><td>" + sel("quality.checks." + i + ".status", c.status, ["open", "done"]) + "</td><td>" + del("quality.checks." + i) + "</td></tr>").join("") + "</table><p>" + add("check", "Check") + '</p><div class="note">A hold point must be signed before work goes on or goods ship.</div></div>' +
      '<div class="card"><h2>Non-conformances <span class="en">(NCR)</span></h2><table><tr><th>Problem</th><th>Cause</th><th>Fix</th><th>Status</th><th></th></tr>' +
      p.quality.ncrs.map((n, i) => "<tr><td>" + inp("quality.ncrs." + i + ".title", n.title) + "</td><td>" + inp("quality.ncrs." + i + ".cause", n.cause) + "</td><td>" + inp("quality.ncrs." + i + ".action", n.action) + "</td><td>" + sel("quality.ncrs." + i + ".status", n.status, ["open", "fixing", "closed"]) + "</td><td>" + del("quality.ncrs." + i) + "</td></tr>").join("") + "</table><p>" + add("ncr", "Non-conformance") + "</p></div>";
  }

  /* ---------- Health ---------- */
  function healthView(p) {
    return '<div class="card"><h2>Health and wellbeing actions <span class="en">(Arogya)</span></h2><table><tr><th>Action</th><th>Status</th><th></th></tr>' +
      p.health.map((h, i) => "<tr><td>" + inp("health." + i + ".text", h.text) + "</td><td>" + sel("health." + i + ".status", h.status, ["open", "done"]) + "</td><td>" + del("health." + i) + "</td></tr>").join("") + "</table><p>" + add("health", "Action") + '</p><div class="note">Covers noise, heat, posture, fatigue, workload and first-aid cover. Report injuries and near misses under Safety.</div></div>';
  }

  /* ---------- Safety ---------- */
  function safetyView(p) {
    const cell = (l, s) => { const sc = l * s; return '<div style="background:' + (sc >= 15 ? "var(--red)" : sc >= 8 ? "var(--amber)" : "var(--green)") + '">' + p.safety.risks.filter((r) => r.status !== "closed" && +r.l === l && +r.s === s).length + "</div>"; };
    let heat = '<div class="heat"><div></div>'; for (let s = 1; s <= 5; s++) heat += '<div style="background:none;color:var(--mut)">S' + s + "</div>";
    for (let l = 5; l >= 1; l--) { heat += '<div style="background:none;color:var(--mut)">L' + l + "</div>"; for (let s = 1; s <= 5; s++) heat += cell(l, s); } heat += "</div>";
    return '<div class="card"><h2>Risk register <span class="en">(Suraksha: likelihood x severity)</span></h2><div style="overflow:auto"><table><tr><th>Hazard</th><th>L</th><th>S</th><th>Score</th><th>Control</th><th>Owner</th><th>Status</th><th></th></tr>' +
      p.safety.risks.map((r, i) => { const sc = K.riskScore(r); return "<tr><td>" + inp("safety.risks." + i + ".hazard", r.hazard) + "</td><td>" + sel("safety.risks." + i + ".l", r.l, [1, 2, 3, 4, 5]) + "</td><td>" + sel("safety.risks." + i + ".s", r.s, [1, 2, 3, 4, 5]) + "</td><td>" + sc + " " + K.riskBand(sc) + "</td><td>" + inp("safety.risks." + i + ".control", r.control) + "</td><td>" + inp("safety.risks." + i + ".owner", r.owner) + "</td><td>" + sel("safety.risks." + i + ".status", r.status, ["open", "controlled", "closed"]) + "</td><td>" + del("safety.risks." + i) + "</td></tr>"; }).join("") + "</table></div><p>" + add("risk", "Hazard") + "</p>" + heat + '<div class="note">Open risks by cell. Controls follow the order: remove, replace, isolate, change the way of working, protective equipment last.</div></div>' +
      '<div class="card"><h2>Incidents and near misses</h2><table><tr><th>Date</th><th>Type</th><th>What happened</th><th>Status</th><th></th></tr>' +
      p.safety.incidents.map((n, i) => "<tr><td>" + inp("safety.incidents." + i + ".date", n.date, "date") + "</td><td>" + sel("safety.incidents." + i + ".type", n.type, ["near miss", "first aid", "lost time", "damage"]) + "</td><td>" + inp("safety.incidents." + i + ".text", n.text) + "</td><td>" + sel("safety.incidents." + i + ".status", n.status, ["open", "closed"]) + "</td><td>" + del("safety.incidents." + i) + "</td></tr>").join("") + "</table><p>" + add("incident", "Incident") + "</p></div>" +
      '<div class="card"><h2>Permits to work</h2><table><tr><th>Work</th><th>Valid until</th><th>Issued by</th><th>Status</th><th></th></tr>' +
      p.safety.permits.map((n, i) => "<tr><td>" + inp("safety.permits." + i + ".work", n.work) + "</td><td>" + inp("safety.permits." + i + ".until", n.until, "date") + "</td><td>" + inp("safety.permits." + i + ".by", n.by) + "</td><td>" + sel("safety.permits." + i + ".status", n.status, ["requested", "issued", "closed"]) + "</td><td>" + del("safety.permits." + i) + "</td></tr>").join("") + "</table><p>" + add("permit", "Permit") + "</p></div>";
  }

  /* ---------- Environment ---------- */
  function envView(p) {
    const totals = {}; p.env.log.forEach((l) => { const k = l.type + " (" + l.unit + ")"; totals[k] = (totals[k] || 0) + Number(l.qty || 0); });
    return '<div class="card"><h2>Aspects and impacts <span class="en">(Paryavaran)</span></h2><div style="overflow:auto"><table><tr><th>Aspect</th><th>Impact</th><th>Significance</th><th>Control</th><th>Status</th><th></th></tr>' +
      p.env.aspects.map((a, i) => "<tr><td>" + inp("env.aspects." + i + ".aspect", a.aspect) + "</td><td>" + inp("env.aspects." + i + ".impact", a.impact) + "</td><td>" + sel("env.aspects." + i + ".significance", a.significance, ["Low", "Medium", "High"]) + "</td><td>" + inp("env.aspects." + i + ".control", a.control) + "</td><td>" + sel("env.aspects." + i + ".status", a.status, ["open", "done"]) + "</td><td>" + del("env.aspects." + i) + "</td></tr>").join("") + "</table></div><p>" + add("aspect", "Aspect") + "</p></div>" +
      '<div class="card"><h2>Measurements</h2><table><tr><th>Date</th><th>Type</th><th>Amount</th><th>Unit</th><th></th></tr>' +
      p.env.log.map((l, i) => "<tr><td>" + inp("env.log." + i + ".date", l.date, "date") + "</td><td>" + sel("env.log." + i + ".type", l.type, ["Energy", "Emissions", "Waste", "Water", "Recycled"]) + "</td><td>" + inp("env.log." + i + ".qty", l.qty, "number") + "</td><td>" + inp("env.log." + i + ".unit", l.unit) + "</td><td>" + del("env.log." + i) + "</td></tr>").join("") + "</table><p>" + add("envlog", "Measurement") + "</p>" +
      (Object.keys(totals).length ? "<h3>Totals</h3>" + Object.keys(totals).map((k) => '<span class="chip">' + esc(k) + ": " + fmt(totals[k]) + "</span>").join("") : "") + "</div>";
  }

  /* ---------- Planning, offerings and interoperability ---------- */
  function planView(p) {
    const by = {}; C.offerings.forEach((o) => by[o.id] = o);
    const std = [...new Set(p.offerings.flatMap((id) => (by[id] || { standards: [] }).standards))];
    const free = C.offerings.filter((o) => !p.offerings.includes(o.id));
    return '<div class="card"><h2>Offerings in this project <span class="en">(Yojana)</span></h2><table><tr><th>Offering</th><th>Family</th><th>Independent?</th><th>Needs</th><th>Plugs in through</th><th></th></tr>' +
      p.offerings.map((id) => { const o = by[id]; if (!o) return ""; const f = C.families.find((x) => x.id === o.family); return "<tr><td>" + I.svg(o.icon, 16) + " <b>" + esc(o.sa) + "</b> " + esc(o.en) + "</td><td>" + esc(f.sa) + " " + esc(f.en) + "</td><td>" + (o.standalone ? "Yes" : "Not alone") + "</td><td>" + (o.requires.map((r) => esc(by[r].en)).join(", ") || "-") + "</td><td>" + o.standards.map((s) => '<span class="chip">' + esc(s) + "</span>").join("") + "</td><td>" + '<button class="o sm" data-rmoff="' + o.id + '">remove</button></td></tr>'; }).join("") + "</table>" +
      '<p><select id="addOff">' + free.map((o) => '<option value="' + o.id + '">' + esc(o.sa + " - " + o.en) + "</option>").join("") + '</select> <button class="b sm" data-addoff="1">+ Add (with what it needs)</button></p></div>' +
      '<div class="card"><h2>How the parts depend on each other</h2>' + depGraph(p) + '<div class="note">Independent = can be sold and run alone. Interdependent = arrows show what must be there first. Interoperable = every part talks through open standards (listed above), so outside tools can plug in.</div></div>' +
      '<div class="card"><h2>Open standards used by this project</h2>' + std.map((s) => '<span class="chip">' + esc(s) + "</span>").join("") + "</div>" +
      '<div class="card"><h2>Who does what <span class="en">(RACI)</span></h2><table><tr><th>Activity</th><th>Responsible</th><th>Accountable</th><th>Consulted</th><th>Informed</th><th></th></tr>' +
      p.plan.raci.map((r, i) => "<tr>" + ["act", "r", "a", "c", "i"].map((k) => "<td>" + inp("plan.raci." + i + "." + k, r[k]) + "</td>").join("") + "<td>" + del("plan.raci." + i) + "</td></tr>").join("") + "</table><p>" + add("raci", "Row") + '</p><h3>Planning notes</h3><textarea data-p="plan.notes" rows="4" style="width:100%">' + esc(p.plan.notes) + "</textarea></div>" +
      '<div class="card"><h2>Share and connect <span class="en">(Setu)</span></h2><p><button class="b sm" data-exp="json">Project (JSON)</button> <button class="b sm" data-exp="tasks">Tasks (CSV)</button> <button class="b sm" data-exp="cost">Cost (CSV)</button> <button class="b sm" data-exp="risks">Risks (CSV)</button> <button class="b sm" data-exp="ical">Calendar (iCal)</button> <label class="b sm" style="display:inline-block;cursor:pointer">Import JSON <input id="imp" type="file" accept=".json,application/json" hidden></label></p><div class="note">The same data is served by the Setu REST API (see openapi.yaml), so other tools can read and write it.</div></div>';
  }
  function depGraph(p) {
    const by = {}; C.offerings.forEach((o) => by[o.id] = o);
    const cols = C.families.map((f) => ({ f, items: p.offerings.filter((id) => by[id] && by[id].family === f.id) }));
    const pos = {}; const W = 170, H = 46; let h = 40;
    cols.forEach((c, ci) => c.items.forEach((id, ri) => { pos[id] = { x: 10 + ci * (W + 20), y: 34 + ri * (H + 12) }; h = Math.max(h, 34 + (ri + 1) * (H + 12)); }));
    let s = '<svg viewBox="0 0 ' + (cols.length * (W + 20) + 10) + " " + h + '" width="100%" role="img" aria-label="Dependency graph" style="max-width:' + cols.length * (W + 20) + 'px"><defs><marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#888"/></marker></defs>';
    cols.forEach((c, ci) => { s += '<text x="' + (10 + ci * (W + 20)) + '" y="18" font-size="12" font-weight="700" fill="currentColor">' + esc(c.f.sa) + "</text>"; });
    p.offerings.forEach((id) => (by[id].requires || []).forEach((r) => { if (pos[id] && pos[r]) s += '<line x1="' + (pos[r].x + W / 2) + '" y1="' + (pos[r].y + H / 2) + '" x2="' + (pos[id].x + W / 2) + '" y2="' + (pos[id].y + H / 2) + '" stroke="#888" stroke-width="1.3" marker-end="url(#ar)"/>'; }));
    p.offerings.forEach((id) => { const o = by[id], q = pos[id]; if (!q) return; s += '<g><rect x="' + q.x + '" y="' + q.y + '" width="' + W + '" height="' + H + '" rx="8" fill="' + (o.standalone ? "#E7F2FB" : "#E8F6EC") + '" stroke="#0F85DB"/><text x="' + (q.x + 8) + '" y="' + (q.y + 19) + '" font-size="11" font-weight="700" fill="#1b2530">' + esc(o.sa) + '</text><text x="' + (q.x + 8) + '" y="' + (q.y + 35) + '" font-size="10" fill="#444">' + esc(o.en.slice(0, 30)) + "</text></g>"; });
    return '<div style="overflow:auto">' + s + "</svg></div>";
  }

  /* ---------- Assistant (practice mode; real answers come from the Setu gateway on the server) ---------- */
  function agentView(p) {
    return '<div class="card"><h2>Assistant <span class="en">(Dootha)</span></h2><div class="warn">Practice mode: answers come from fixed rules in this page. No paid call is made and no key is held in the browser. When the server-side gateway is connected, the same box calls it, and the gateway enforces the spend cap.</div>' +
      '<p><label>Same-site Setu endpoint (optional, no key here) <input id="gw" value="' + esc(safe.get("sabha.gw") || "") + '" placeholder="/api/dootha" style="width:min(380px,100%)"></label></p>' +
      '<p><textarea id="q" rows="3" style="width:100%" placeholder="Ask about this project, for example: what blocks handover?"></textarea></p><p><button class="b" id="ask">Ask</button></p><div id="ans"></div></div>';
  }
  function summary(p) { const r = K.rag(p), e = K.evm(p); return { name: p.name, sector: p.sector, model: p.model, offerings: p.offerings, rag: r, evm: e, openHolds: p.quality.checks.filter((c) => c.hold && c.status !== "done").length }; }
  async function askAgent(p, q) {
    const gw = safe.get("sabha.gw");
    if (gw && /^\/[A-Za-z0-9/_-]*$/.test(gw)) { // same-site path only
      try { const res = await fetch(gw, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agent: "project-advisor", input: { question: q, summary: summary(p) } }) }); if (res.ok) { const j = await res.json(); return [j.text || JSON.stringify(j)]; } return ["Gateway answered " + res.status + ". Using practice mode instead."].concat(K.advise(p)); } catch (e) { return ["Gateway not reachable. Using practice mode instead."].concat(K.advise(p)); }
    }
    return K.advise(p);
  }

  /* ---------- Chat ---------- */
  function chatView(p) {
    const names = Object.keys(p.chat); const msgs = p.chat[chan] || [];
    return '<div class="card chat"><div class="chan"><b>Channels</b>' + names.map((n) => '<button data-chan="' + esc(n) + '" class="' + (n === chan ? "on" : "") + '"># ' + esc(n) + "</button>").join("") + '<button data-addchan="1">+ channel</button></div><div><div class="msgs">' +
      (msgs.length ? msgs.map((m) => '<div class="msg ' + (m.sys ? "sys" : "") + '"><b>' + esc(m.who) + "</b> <small>" + esc(new Date(m.t).toLocaleString()) + "</small><br>" + esc(m.text) + "</div>").join("") : '<div class="note">No messages yet. Try: /task Order cables &nbsp; /risk Slippery floor &nbsp; @dootha what is open?</div>') +
      '</div><form id="chatForm" style="display:flex;gap:6px;margin-top:6px"><input id="chatIn" style="flex:1" placeholder="Message #' + esc(chan) + '" autocomplete="off"><button class="b">Send</button></form><div class="note">You are <input id="meName" value="' + esc(me()) + '" style="width:110px"> Messages stay in this browser until Setu is connected. Open a second tab to see live sync.</div></div></div>';
  }
  function postMsg(p, ch, who, text, sys) { (p.chat[ch] = p.chat[ch] || []).push({ who, t: Date.now(), text, sys: !!sys }); }
  async function sendChat(text) {
    const p = P(); if (!p || !text.trim()) return;
    postMsg(p, chan, me(), text);
    let m;
    if ((m = text.match(/^\/task\s+(.+)/i))) { const id = "T" + (Math.max(0, ...p.tasks.map((t) => +String(t.id).slice(1) || 0)) + 1); p.tasks.push({ id, name: m[1], days: 1, deps: [], progress: 0, owner: me(), milestone: false }); postMsg(p, chan, "Sabha", "Task " + id + " added: " + m[1], true); }
    else if ((m = text.match(/^\/risk\s+(.+)/i))) { p.safety.risks.push({ id: K.uid("r"), hazard: m[1], l: 3, s: 3, control: "", owner: me(), status: "open", kind: "safety" }); postMsg(p, chan, "Sabha", "Risk added to Suraksha: " + m[1], true); }
    else if (/@dootha/i.test(text)) { const a = await askAgent(p, text); postMsg(p, chan, "Dootha", a.join("\n"), true); }
    save(); render();
  }

  /* ---------- Whiteboard ---------- */
  function boardView(p) {
    const icons = C.iconNames.map((n) => '<button data-icon="' + n + '" title="' + n + '">' + I.svg(n, 20) + "</button>").join("");
    return '<div class="card"><h2>Whiteboard <span class="en">(Phalaka)</span></h2><div class="tools" id="tools">' +
      [["select", "Select / move"], ["hand", "Pan"], ["pen", "Pen"], ["rect", "Box"], ["ellipse", "Oval"], ["sticky", "Note"], ["text", "Text"], ["arrow", "Arrow"], ["icon", "Stamp icon"]].map((t) => '<button data-tool="' + t[0] + '">' + t[1] + "</button>").join("") +
      '<button data-act="undo">Undo</button><button data-act="del">Delete selected</button><button data-act="zin">Zoom +</button><button data-act="zout">Zoom -</button><button data-act="fit">Fit</button><button data-act="png">Save PNG</button></div>' +
      '<div class="palette" id="palette">' + icons + '</div><canvas id="wb" aria-label="Whiteboard canvas"></canvas><div class="note">Draw, drop notes and icons, link them with arrows. Double-click an item to edit its text. Pinch or use the Zoom buttons on a phone. Phases of the chosen model are the coloured columns.</div></div>';
  }
  function makeBoard(cv, p) {
    const ctx = cv.getContext("2d"); let tool = "select", icon = "star", sel = null, drag = null, undo = [];
    const view = { x: 0, y: 0, z: 1 }; const items = p.board.items;
    const snap = () => { undo.push(JSON.stringify(items)); if (undo.length > 60) undo.shift(); };
    function size() { const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1; cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); draw(); }
    const w2 = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left - view.x) / view.z, y: (e.clientY - r.top - view.y) / view.z }; };
    const bbox = (it) => it.t === "pen" ? (() => { const xs = it.pts.map((q) => q[0]), ys = it.pts.map((q) => q[1]); const x0 = Math.min(...xs), y0 = Math.min(...ys); return { x: x0, y: y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 }; })() : { x: Math.min(it.x, it.x + (it.t === "arrow" ? it.w : 0)), y: Math.min(it.y, it.y + (it.t === "arrow" ? it.h : 0)), w: Math.abs(it.w), h: Math.abs(it.h) };
    const hit = (pt) => { for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; if (it.t === "frame") continue; const b = bbox(it); if (pt.x >= b.x - 6 && pt.x <= b.x + b.w + 6 && pt.y >= b.y - 6 && pt.y <= b.y + b.h + 6) return it; } for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; if (it.t === "frame" && pt.x >= it.x && pt.x <= it.x + it.w && pt.y >= it.y && pt.y <= it.y + 34) return it; } return null; };
    const wrap = (t, x, y, w, lh) => { String(t || "").split("\n").forEach((line) => { let cur = ""; line.split(" ").forEach((word) => { const test = cur ? cur + " " + word : word; if (ctx.measureText(test).width > w && cur) { ctx.fillText(cur, x, y); y += lh; cur = word; } else cur = test; }); ctx.fillText(cur, x, y); y += lh; }); };
    function draw() {
      const d = window.devicePixelRatio || 1; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.translate(view.x, view.y); ctx.scale(view.z, view.z); ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.font = "13px system-ui, sans-serif"; ctx.textBaseline = "top";
      items.forEach((it) => {
        ctx.strokeStyle = it.color || "#0F85DB"; ctx.fillStyle = it.color || "#0F85DB"; ctx.lineWidth = 2;
        if (it.t === "frame") { ctx.fillStyle = it.color; ctx.fillRect(it.x, it.y, it.w, it.h); ctx.strokeStyle = "#c9d6e0"; ctx.strokeRect(it.x, it.y, it.w, it.h); ctx.fillStyle = "#1b2530"; ctx.font = "bold 14px system-ui, sans-serif"; ctx.fillText(it.text, it.x + 10, it.y + 10); ctx.font = "13px system-ui, sans-serif"; }
        else if (it.t === "rect") { ctx.strokeRect(it.x, it.y, it.w, it.h); if (it.text) { ctx.fillStyle = "#1b2530"; wrap(it.text, it.x + 6, it.y + 6, it.w - 12, 16); } }
        else if (it.t === "ellipse") { ctx.beginPath(); ctx.ellipse(it.x + it.w / 2, it.y + it.h / 2, Math.abs(it.w / 2), Math.abs(it.h / 2), 0, 0, 7); ctx.stroke(); if (it.text) { ctx.fillStyle = "#1b2530"; wrap(it.text, it.x + 10, it.y + it.h / 2 - 8, it.w - 20, 16); } }
        else if (it.t === "sticky") { ctx.fillStyle = it.color || "#ffe680"; ctx.fillRect(it.x, it.y, it.w, it.h); ctx.fillStyle = "#1b2530"; wrap(it.text, it.x + 8, it.y + 8, it.w - 16, 16); }
        else if (it.t === "text") { ctx.fillStyle = "#1b2530"; ctx.font = "16px system-ui, sans-serif"; wrap(it.text, it.x, it.y, it.w, 20); ctx.font = "13px system-ui, sans-serif"; }
        else if (it.t === "icon") { ctx.save(); ctx.translate(it.x, it.y); ctx.scale(it.w / 24, it.h / 24); ctx.lineWidth = 1.8 * 24 / it.w * 1.4; ctx.stroke(new Path2D(I.paths[it.icon] || I.paths.star)); ctx.restore(); if (it.text) { ctx.fillStyle = "#1b2530"; ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText(it.text, it.x + it.w / 2, it.y + it.h + 4); ctx.textAlign = "left"; ctx.font = "13px system-ui, sans-serif"; } }
        else if (it.t === "arrow") { const x2 = it.x + it.w, y2 = it.y + it.h, a = Math.atan2(it.h, it.w); ctx.beginPath(); ctx.moveTo(it.x, it.y); ctx.lineTo(x2, y2); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 12 * Math.cos(a - 0.4), y2 - 12 * Math.sin(a - 0.4)); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 12 * Math.cos(a + 0.4), y2 - 12 * Math.sin(a + 0.4)); ctx.stroke(); }
        else if (it.t === "pen") { ctx.beginPath(); it.pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke(); }
        if (sel === it) { const b = bbox(it); ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "#d64545"; ctx.lineWidth = 1.5; ctx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8); ctx.restore(); }
      });
      if (drag && drag.ghost) { const g = drag.ghost; ctx.strokeStyle = "#0F85DB"; ctx.setLineDash([4, 4]); if (g.t === "arrow") { ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(g.x + g.w, g.y + g.h); ctx.stroke(); } else ctx.strokeRect(g.x, g.y, g.w, g.h); ctx.setLineDash([]); }
    }
    const ask = (msg, def) => { const v = window.prompt(msg, def || ""); return v === null ? null : v; };
    const pts = new Map(); let pinch = null;
    function down(e) {
      cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: view.z }; drag = null; return; }
      const pt = w2(e);
      if (tool === "hand") { drag = { mode: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; return; }
      if (tool === "select") { const it = hit(pt); sel = it; if (it) { snap(); drag = { mode: "move", it, ox: pt.x, oy: pt.y, orig: JSON.parse(JSON.stringify(it)) }; } else drag = { mode: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; draw(); return; }
      if (tool === "pen") { snap(); const it = { id: K.uid("b"), t: "pen", pts: [[pt.x, pt.y]], color: "#1b2530" }; items.push(it); drag = { mode: "pen", it }; return; }
      if (["rect", "ellipse", "arrow"].includes(tool)) { drag = { mode: "shape", start: pt, ghost: { t: tool, x: pt.x, y: pt.y, w: 0, h: 0 } }; return; }
      if (tool === "sticky" || tool === "text" || tool === "icon") {
        const txt = tool === "icon" ? ask("Label under the icon (optional)", "") : ask(tool === "sticky" ? "Note text" : "Text");
        if (txt === null) return; snap();
        const it = tool === "sticky" ? { t: "sticky", x: pt.x, y: pt.y, w: 150, h: 110, text: txt, color: "#ffe680" } : tool === "text" ? { t: "text", x: pt.x, y: pt.y, w: 260, h: 24, text: txt, color: "#1b2530" } : { t: "icon", icon, x: pt.x - 26, y: pt.y - 26, w: 52, h: 52, text: txt, color: "#0F85DB" };
        it.id = K.uid("b"); items.push(it); sel = it; persist(); draw();
      }
    }
    function move(e) {
      if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size === 2) { const [a, b] = [...pts.values()]; view.z = Math.min(4, Math.max(0.2, pinch.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d)); draw(); return; }
      if (!drag) return; const pt = w2(e);
      if (drag.mode === "pan") { view.x = drag.vx + e.clientX - drag.sx; view.y = drag.vy + e.clientY - drag.sy; }
      else if (drag.mode === "move") { const dx = pt.x - drag.ox, dy = pt.y - drag.oy; if (drag.it.t === "pen") drag.it.pts = drag.orig.pts.map((q) => [q[0] + dx, q[1] + dy]); else { drag.it.x = drag.orig.x + dx; drag.it.y = drag.orig.y + dy; } }
      else if (drag.mode === "pen") drag.it.pts.push([pt.x, pt.y]);
      else if (drag.mode === "shape") { const g = drag.ghost; g.w = pt.x - drag.start.x; g.h = pt.y - drag.start.y; }
      draw();
    }
    function up(e) {
      pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
      if (!drag) return; const d = drag; drag = null;
      if (d.mode === "shape") { const g = d.ghost; if (Math.abs(g.w) > 6 || Math.abs(g.h) > 6) { snap(); const it = g.t === "arrow" ? { t: "arrow", x: g.x, y: g.y, w: g.w, h: g.h, color: "#1b2530" } : { t: g.t, x: Math.min(g.x, g.x + g.w), y: Math.min(g.y, g.y + g.h), w: Math.abs(g.w), h: Math.abs(g.h), color: "#0F85DB", text: "" }; it.id = K.uid("b"); items.push(it); sel = it; } }
      persist(); draw();
    }
    function dbl(e) { const it = hit(w2(e)); if (!it || it.t === "pen" || it.t === "arrow") return; const v = ask("Edit text", it.text || ""); if (v !== null) { snap(); it.text = v; persist(); draw(); } }
    function persist() { save(); }
    function act(a) {
      if (a === "undo") { const s = undo.pop(); if (s) { items.length = 0; JSON.parse(s).forEach((x) => items.push(x)); sel = null; persist(); } }
      if (a === "del" && sel) { snap(); const i = items.indexOf(sel); if (i >= 0) items.splice(i, 1); sel = null; persist(); }
      if (a === "zin") view.z = Math.min(4, view.z * 1.2); if (a === "zout") view.z = Math.max(0.2, view.z / 1.2);
      if (a === "fit") { if (items.length) { const bs = items.map(bbox); const x0 = Math.min(...bs.map((b) => b.x)), y0 = Math.min(...bs.map((b) => b.y)), x1 = Math.max(...bs.map((b) => b.x + b.w)), y1 = Math.max(...bs.map((b) => b.y + b.h)); const r = cv.getBoundingClientRect(); view.z = Math.min(2, Math.max(0.2, Math.min((r.width - 40) / Math.max(1, x1 - x0), (r.height - 40) / Math.max(1, y1 - y0)))); view.x = 20 - x0 * view.z; view.y = 20 - y0 * view.z; } else { view.z = 1; view.x = 0; view.y = 0; } }
      if (a === "png") { const l = document.createElement("a"); l.download = p.name.replace(/[^\w-]+/g, "_") + "-board.png"; l.href = cv.toDataURL("image/png"); l.click(); }
      draw();
    }
    const tools = $("#tools"), pal = $("#palette"); setTimeout(() => act("fit"), 0);
    const mark = () => { tools.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("on", b.dataset.tool === tool)); pal.querySelectorAll("[data-icon]").forEach((b) => b.classList.toggle("on", b.dataset.icon === icon)); };
    tools.onclick = (e) => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.tool) { tool = b.dataset.tool; mark(); } if (b.dataset.act) act(b.dataset.act); };
    pal.onclick = (e) => { const b = e.target.closest("button"); if (!b) return; icon = b.dataset.icon; tool = "icon"; mark(); };
    const key = (e) => { if ((e.key === "Delete" || e.key === "Backspace") && sel && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) act("del"); if (e.key === "z" && (e.ctrlKey || e.metaKey)) act("undo"); };
    cv.addEventListener("pointerdown", down); cv.addEventListener("pointermove", move); cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up); cv.addEventListener("dblclick", dbl);
    cv.addEventListener("wheel", (e) => { e.preventDefault(); const f = e.deltaY < 0 ? 1.1 : 1 / 1.1; view.z = Math.min(4, Math.max(0.2, view.z * f)); draw(); }, { passive: false });
    window.addEventListener("resize", size); window.addEventListener("keydown", key); mark(); size();
    return { destroy() { window.removeEventListener("resize", size); window.removeEventListener("keydown", key); } };
  }

  /* ---------- Generic editing, adding, deleting ---------- */
  function setPath(obj, path, val) { const parts = path.split("."); let o = obj; for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]]; o[parts[parts.length - 1]] = val; }
  function download(name, text, type) { const a = document.createElement("a"); a.download = name; a.href = URL.createObjectURL(new Blob([text], { type: type || "text/plain" })); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  const today = () => new Date().toISOString().slice(0, 10);
  const ADD = {
    task: (p) => p.tasks.push({ id: "T" + (Math.max(0, ...p.tasks.map((t) => +String(t.id).slice(1) || 0)) + 1), name: "New task", days: 1, deps: [], progress: 0, owner: "", milestone: false }),
    cost: (p) => p.cost.push({ id: K.uid("c"), name: "New line", budget: 0, actual: 0, taskId: p.tasks[0].id }),
    check: (p) => p.quality.checks.push({ id: K.uid("q"), text: "New check", family: "", status: "open", hold: false }),
    ncr: (p) => p.quality.ncrs.push({ id: K.uid("n"), title: "", cause: "", action: "", status: "open" }),
    health: (p) => p.health.push({ id: K.uid("h"), text: "New action", status: "open" }),
    risk: (p) => p.safety.risks.push({ id: K.uid("r"), hazard: "New hazard", l: 3, s: 3, control: "", owner: "", status: "open", kind: "safety" }),
    incident: (p) => p.safety.incidents.push({ id: K.uid("i"), date: today(), type: "near miss", text: "", status: "open" }),
    permit: (p) => p.safety.permits.push({ id: K.uid("w"), work: "", until: today(), by: "", status: "requested" }),
    aspect: (p) => p.env.aspects.push({ id: K.uid("e"), aspect: "New aspect", impact: "", significance: "Low", control: "", status: "open" }),
    envlog: (p) => p.env.log.push({ id: K.uid("l"), date: today(), type: "Energy", qty: 0, unit: "kWh" }),
    raci: (p) => p.plan.raci.push({ act: "", r: "", a: "", c: "", i: "" })
  };

  document.addEventListener("change", (e) => {
    const t = e.target, p = P(); if (!p) return;
    if (t.id === "meName") { safe.set("sabha.me", t.value || "Me"); return; }
    if (t.id === "gw") { safe.set("sabha.gw", t.value.trim()); return; }
    if (t.id === "imp") { const f = t.files[0]; if (!f) return; f.text().then((txt) => { try { const j = JSON.parse(txt); if (!j.tasks || !j.cost || !j.quality) throw new Error("not a Sabha project"); j.id = K.uid("p"); store.projects.push(j); store.current = j.id; save(); render(); } catch (err) { alert("Could not import: " + err.message); } }); return; }
    if (t === $("#projSel")) { store.current = t.value; save(); render(); return; }
    const path = t.dataset && t.dataset.p; if (!path) return;
    let v = t.type === "checkbox" ? t.checked : t.type === "number" ? Number(t.value) : t.value;
    if (t.dataset.list) v = String(v).split(/[\s,]+/).filter(Boolean);
    if (/\.(l|s)$/.test(path)) v = Number(v);
    setPath(p, path, v); save();
    if (!(t.type === "text" && !t.dataset.list)) render();
  });
  document.addEventListener("click", (e) => {
    const p = P(); const b = e.target.closest("button, label.b"); if (!b) return;
    if (b.id === "newBtn") { tab = "new"; render(); return; }
    if (b.dataset.tab) { tab = b.dataset.tab; render(); return; }
    if (!p) return;
    if (b.dataset.add && ADD[b.dataset.add]) { ADD[b.dataset.add](p); save(); render(); return; }
    if (b.dataset.del) { const parts = b.dataset.del.split("."); const idx = Number(parts.pop()); const arr = parts.reduce((o, k) => o[k], p); const gone = arr[idx]; arr.splice(idx, 1);
      if (parts.join(".") === "tasks" && gone) { p.tasks.forEach((t) => t.deps = (t.deps || []).filter((d) => d !== gone.id)); p.cost.forEach((c) => { if (c.taskId === gone.id) c.taskId = (p.tasks[0] || {}).id; }); }
      save(); render(); return; }
    if (b.dataset.chan) { chan = b.dataset.chan; render(); return; }
    if (b.dataset.addchan) { const n = (prompt("Channel name") || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-"); if (n && !p.chat[n]) { p.chat[n] = []; chan = n; save(); render(); } return; }
    if (b.dataset.addoff) { const id = $("#addOff") && $("#addOff").value; if (id) { const r = K.resolveOfferings(p.offerings.concat([id])); p.addedByDependency = [...new Set(p.addedByDependency.concat(r.ids.filter((x) => !p.offerings.includes(x) && x !== id)))]; p.offerings = r.ids; save(); render(); } return; }
    if (b.dataset.rmoff) { const by = {}; C.offerings.forEach((o) => by[o.id] = o); const dependants = p.offerings.filter((x) => (by[x].requires || []).includes(b.dataset.rmoff)); if (dependants.length) { alert("Cannot remove: " + dependants.map((x) => by[x].en).join(", ") + " need it. Remove those first."); return; } p.offerings = p.offerings.filter((x) => x !== b.dataset.rmoff); save(); render(); return; }
    if (b.dataset.exp) { const k = b.dataset.exp, n = p.name.replace(/[^\w-]+/g, "_"); if (k === "json") download(n + ".json", JSON.stringify(p, null, 2), "application/json"); if (k === "tasks") download(n + "-tasks.csv", K.tasksCSV(p), "text/csv"); if (k === "cost") download(n + "-cost.csv", K.costCSV(p), "text/csv"); if (k === "risks") download(n + "-risks.csv", K.risksCSV(p), "text/csv"); if (k === "ical") download(n + ".ics", K.ical(p), "text/calendar"); return; }
    if (b.id === "ask") { const q = $("#q").value.trim(); $("#ans").innerHTML = "<p class='note'>Thinking...</p>"; askAgent(p, q).then((a) => { $("#ans").innerHTML = "<ul>" + a.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>"; }); return; }
  });
  document.addEventListener("submit", (e) => { if (e.target.id === "chatForm") { e.preventDefault(); const i = $("#chatIn"); const v = i.value; i.value = ""; sendChat(v); } });

  // Demo data: only with ?demo=1 and only when no project exists. Names start with "Demo".
  if (/[?&]demo=1/.test(location.search) && !store.projects.length) {
    const p = K.createProject({ name: "Demo switchgear and monitoring rollout", sector: "energy", model: "epc", offerings: ["hw-power-dist", "sw-scada", "dt-dashboards"] });
    p.cost.forEach((c, i) => { c.budget = 10000 * (i + 2); c.actual = 3000 * i; }); p.tasks[0].progress = 100; p.tasks[1].progress = 40; p.statusDay = 12;
    postMsg(p, "general", "Demo Planner", "Welcome. Use /task, /risk or @dootha here.");
    store.projects.push(p); store.current = p.id; safe.set(KEY, JSON.stringify(store));
  }
  document.querySelector("#projSel").addEventListener("change", () => {});
  tab = store.projects.length ? "overview" : "new"; render();
})();
