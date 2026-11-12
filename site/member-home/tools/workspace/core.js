/* Core logic for Sabha-Karyalaya (no browser needed, so it can be tested). */
(function (root) {
  const C = (typeof require !== "undefined" && typeof module !== "undefined") ? require("./catalog.js") : root.CATALOG;
  let seq = 0;
  const uid = (p) => (p || "id") + "-" + Date.now().toString(36) + "-" + (++seq).toString(36);

  function offeringsById() { const m = {}; C.offerings.forEach(o => m[o.id] = o); return m; }

  // Interdependent: add everything an offering needs. Returns {ids, added}.
  function resolveOfferings(ids) {
    const by = offeringsById(); const out = []; const added = [];
    const visit = (id, fromUser) => {
      if (!by[id] || out.includes(id)) return;
      (by[id].requires || []).forEach(r => visit(r, false));
      out.push(id); if (!fromUser) added.push(id);
    };
    ids.forEach(id => visit(id, true));
    // an id the user picked that was visited first as a dependency is not "added"
    return { ids: out, added: added.filter(a => !ids.includes(a)) };
  }

  function createProject(opts) {
    const model = C.models.find(m => m.id === opts.model) || C.models[0];
    const sector = C.sectors.find(s => s.id === opts.sector) || C.sectors[0];
    const res = resolveOfferings(opts.offerings || []);
    const by = offeringsById();
    const fams = [...new Set(res.ids.map(i => by[i].family))];
    if (!fams.length) fams.push("services");

    const tasks = []; let prev = null;
    model.phases.forEach((ph, i) => {
      const t = { id: "T" + (i + 1), name: ph, days: 5 + (i % 3) * 3, deps: prev ? [prev] : [], progress: 0, owner: "", milestone: false };
      tasks.push(t); prev = t.id;
    });
    tasks.push({ id: "T" + (tasks.length + 1), name: "Project closed", days: 0, deps: [prev], progress: 0, owner: "", milestone: true });

    const cost = res.ids.map(id => ({ id: uid("c"), name: by[id].en, budget: 0, actual: 0, taskId: tasks[Math.min(2, tasks.length - 1)].id }));
    if (!cost.length) cost.push({ id: uid("c"), name: "Project work", budget: 0, actual: 0, taskId: tasks[0].id });

    const checks = []; const risks = []; const aspects = []; const health = [];
    fams.forEach(f => {
      (C.seeds.quality[f] || []).forEach(t => checks.push({ id: uid("q"), text: t, family: f, status: "open", hold: /hold point|sign|acceptance/i.test(t) }));
      (C.seeds.hazards[f] || []).forEach(h => risks.push({ id: uid("r"), hazard: h[0], l: h[1], s: h[2], control: h[3], owner: "", status: "open", kind: "safety" }));
      (C.seeds.aspects[f] || []).forEach(a => aspects.push({ id: uid("e"), aspect: a[0], impact: a[1], significance: a[2], control: a[3], status: "open" }));
      (C.seeds.health[f] || []).forEach(t => health.push({ id: uid("h"), text: t, status: "open" }));
    });

    const channels = { general: [], planning: [], quality: [], "health-safety": [], environment: [] };
    const phases = model.phases;
    const items = [];
    phases.forEach((ph, i) => {
      items.push({ id: uid("b"), t: "frame", x: 40 + i * 260, y: 40, w: 240, h: 420, text: ph, color: i % 2 ? "#E8F6EC" : "#E7F2FB" });
    });
    res.ids.forEach((id, i) => {
      items.push({ id: uid("b"), t: "icon", icon: by[id].icon, x: 60 + (i % 6) * 70, y: 500 + Math.floor(i / 6) * 90, w: 52, h: 52, text: by[id].sa, color: "#0F85DB" });
    });

    return {
      id: uid("p"), name: opts.name || "New project", created: new Date().toISOString(),
      sector: sector.id, model: model.id, offerings: res.ids, addedByDependency: res.added,
      statusDay: 0, currency: opts.currency || "USD",
      tasks, cost, quality: { checks, ncrs: [] }, health,
      safety: { risks, incidents: [], permits: [] }, env: { aspects, log: [] },
      plan: { raci: [], risks: [], notes: "" }, board: { items },
      chat: channels
    };
  }

  // Critical path method. Returns map id -> {es, ef, ls, lf, float, critical}, plus total.
  function schedule(tasks) {
    const by = {}; tasks.forEach(t => by[t.id] = t);
    const es = {}, ef = {}; const state = {};
    const fwd = (id, stack) => {
      if (es[id] !== undefined) return;
      if (state[id] === 1) throw new Error("Loop in dependencies at " + id);
      state[id] = 1;
      let s = 0;
      (by[id].deps || []).forEach(d => { if (!by[d]) return; fwd(d, stack); s = Math.max(s, ef[d]); });
      es[id] = s; ef[id] = s + Number(by[id].days || 0); state[id] = 2;
    };
    tasks.forEach(t => fwd(t.id));
    const total = Math.max(0, ...tasks.map(t => ef[t.id]));
    const succ = {}; tasks.forEach(t => (t.deps || []).forEach(d => (succ[d] = succ[d] || []).push(t.id)));
    const ls = {}, lf = {};
    const back = (id) => {
      if (lf[id] !== undefined) return;
      let f = total; (succ[id] || []).forEach(s => { back(s); f = Math.min(f, ls[s]); });
      lf[id] = f; ls[id] = f - Number(by[id].days || 0);
    };
    tasks.forEach(t => back(t.id));
    const out = {};
    tasks.forEach(t => { const fl = ls[t.id] - es[t.id]; out[t.id] = { es: es[t.id], ef: ef[t.id], ls: ls[t.id], lf: lf[t.id], float: fl, critical: fl === 0 }; });
    return { map: out, total };
  }

  // Earned value. Planned % comes from the status day; progress % is entered on the task.
  function evm(project) {
    const sch = schedule(project.tasks); const day = Number(project.statusDay || 0);
    const by = {}; project.tasks.forEach(t => by[t.id] = t);
    let BAC = 0, PV = 0, EV = 0, AC = 0;
    project.cost.forEach(c => {
      const t = by[c.taskId]; const b = Number(c.budget || 0); BAC += b; AC += Number(c.actual || 0);
      if (!t) return;
      const s = sch.map[t.id]; const dur = Math.max(1, s.ef - s.es);
      const planned = Math.min(1, Math.max(0, (day - s.es) / dur));
      PV += b * planned; EV += b * Math.min(1, Math.max(0, Number(t.progress || 0) / 100));
    });
    const r = (n) => Math.round(n * 100) / 100;
    const CPI = AC > 0 ? EV / AC : null; const SPI = PV > 0 ? EV / PV : null;
    const EAC = CPI ? BAC / CPI : null;
    return { BAC: r(BAC), PV: r(PV), EV: r(EV), AC: r(AC), CPI: CPI === null ? null : r(CPI), SPI: SPI === null ? null : r(SPI), EAC: EAC === null ? null : r(EAC), CV: r(EV - AC), SV: r(EV - PV) };
  }

  function riskScore(r) { return Number(r.l || 0) * Number(r.s || 0); }
  function riskBand(score) { return score >= 15 ? "High" : score >= 8 ? "Medium" : score > 0 ? "Low" : "None"; }

  // Traffic lights for the overview page. Plain rules, no guesses.
  function rag(project) {
    const e = evm(project); const sch = schedule(project.tasks);
    const band = (v, good, warn) => v === null ? "grey" : v >= good ? "green" : v >= warn ? "amber" : "red";
    const openHold = project.quality.checks.filter(c => c.hold && c.status !== "done").length;
    const openNcr = project.quality.ncrs.filter(n => n.status !== "closed").length;
    const highRisk = project.safety.risks.filter(r => r.status !== "closed" && riskScore(r) >= 15).length;
    const openInc = project.safety.incidents.filter(i => i.status !== "closed").length;
    const envOpen = project.env.aspects.filter(a => a.status !== "done" && a.significance === "High").length;
    return {
      time: band(e.SPI, 0.95, 0.8), cost: band(e.CPI, 0.95, 0.8),
      quality: openNcr > 2 ? "red" : (openNcr > 0 || openHold > 0) ? "amber" : "green",
      health: project.health.some(h => h.status !== "done") ? "amber" : "green",
      safety: highRisk > 0 || openInc > 0 ? "red" : project.safety.risks.some(r => r.status !== "closed" && riskScore(r) >= 8) ? "amber" : "green",
      environment: envOpen > 0 ? "red" : project.env.aspects.some(a => a.status !== "done") ? "amber" : "green",
      totalDays: sch.total
    };
  }

  // Practice-mode advisor (no paid calls). The real gateway answer replaces this when a gateway URL is set.
  function advise(project) {
    const out = []; const r = rag(project); const e = evm(project);
    if (e.BAC === 0) out.push("Cost: no budget entered yet. Add a budget to every cost line so earned value works.");
    if (r.time === "red") out.push("Time: schedule index is low. Check the critical-path tasks first.");
    if (r.cost === "red") out.push("Cost: cost index is low. Review actuals against the lines with most spend.");
    const holds = project.quality.checks.filter(c => c.hold && c.status !== "done").length;
    if (holds) out.push("Quality: " + holds + " hold point(s) still open. Do not ship before they close.");
    const hi = project.safety.risks.filter(x => x.status !== "closed" && riskScore(x) >= 15).length;
    if (hi) out.push("Safety: " + hi + " high risk(s) open. Add controls and an owner.");
    if (project.safety.risks.some(x => !x.owner)) out.push("Safety: some risks have no owner. Name one person for each.");
    if (project.env.aspects.some(a => a.status !== "done")) out.push("Environment: open aspects remain. Close the High ones first.");
    if (project.addedByDependency && project.addedByDependency.length) out.push("Planning: " + project.addedByDependency.length + " item(s) were added because other items need them.");
    if (!out.length) out.push("All checks pass. Next: confirm the next gate with the project sponsor.");
    return out;
  }

  const csvCell = (v) => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const toCSV = (rows) => rows.map(r => r.map(csvCell).join(",")).join("\r\n");
  function tasksCSV(p) { const s = schedule(p.tasks); return toCSV([["id", "name", "days", "deps", "start_day", "end_day", "float", "critical", "progress"]].concat(p.tasks.map(t => [t.id, t.name, t.days, (t.deps || []).join(" "), s.map[t.id].es, s.map[t.id].ef, s.map[t.id].float, s.map[t.id].critical, t.progress]))); }
  function costCSV(p) { return toCSV([["line", "budget", "actual", "task"]].concat(p.cost.map(c => [c.name, c.budget, c.actual, c.taskId]))); }
  function risksCSV(p) { return toCSV([["hazard", "likelihood", "severity", "score", "band", "control", "owner", "status"]].concat(p.safety.risks.map(r => [r.hazard, r.l, r.s, riskScore(r), riskBand(riskScore(r)), r.control, r.owner, r.status]))); }
  function ical(p, startDate) {
    const s = schedule(p.tasks); const d0 = startDate ? new Date(startDate) : new Date();
    const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
    const add = (n) => { const d = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), d0.getUTCDate())); d.setUTCDate(d.getUTCDate() + n); return d; };
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sabha-Karyalaya//EN"];
    p.tasks.forEach(t => {
      lines.push("BEGIN:VEVENT", "UID:" + p.id + "-" + t.id + "@sabha", "DTSTAMP:" + ymd(new Date()) + "T000000Z",
        "DTSTART;VALUE=DATE:" + ymd(add(s.map[t.id].es)), "DTEND;VALUE=DATE:" + ymd(add(Math.max(s.map[t.id].ef, s.map[t.id].es + 1))),
        "SUMMARY:" + String(t.name).replace(/[,;\n]/g, " "), "END:VEVENT");
    });
    lines.push("END:VCALENDAR"); return lines.join("\r\n");
  }

  const api = { uid, resolveOfferings, createProject, schedule, evm, riskScore, riskBand, rag, advise, tasksCSV, costCSV, risksCSV, ical, toCSV };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CORE = api;
})(typeof window !== "undefined" ? window : globalThis);
