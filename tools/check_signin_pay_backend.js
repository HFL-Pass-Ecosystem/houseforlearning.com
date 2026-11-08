#!/usr/bin/env node
/* Sign-in, pay page and back-end check for houseforlearning.com (test mode, nothing real is touched).
   It starts a pretend Supabase (sign-in service + database with the same rules as supabase/*.sql) in memory,
   runs the real netlify/functions code against it, serves site/ on a local port, and clicks through with a headless browser.
   Three areas are counted: SIGN-IN, PAY PAGE, BACK END. Prints PASS/FAIL per check and a count per area. Exit code 1 on any FAIL.
   Run:  npm i --no-save playwright && npx playwright install chromium && node tools/check_signin_pay_backend.js
   Needs no secrets. Sends nothing out. The real Supabase project is NOT checked by this script (see docs). */
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.error('playwright is not installed'); process.exit(2); }
const ROOT = path.join(__dirname, '..'), SITE = path.join(ROOT, 'site'), FN = path.join(ROOT, 'netlify', 'functions');
const ANON = 'anon-test-key', SERVICE = 'service-test-key';
const COURSE = 'course-eu-01.html', QKEY = JSON.parse(fs.readFileSync(path.join(FN, 'quizkeys.json'), 'utf8'))[COURSE];

/* ---------- pretend Supabase ---------- */
const db = { members: [], messages: [], opinions: [], lms_enrolments: [], lms_attempts: [], lms_certificates: [], lms_notifications: [], signin_handoff: [] };
const users = [], tokens = {}, refresh = {}, sent = [];
const uniq = { lms_enrolments: ['user_id', 'course_key'], lms_certificates: ['user_id', 'course_key'], messages: ['ref'], opinions: ['ref'], signin_handoff: ['wait_id'] };
const defaults = {
  members: () => ({ role: 'learner', plan: 'free', created_at: new Date().toISOString() }),
  messages: () => ({ id: crypto.randomUUID(), status: 'new', created_at: new Date().toISOString() }),
  opinions: () => ({ id: crypto.randomUUID(), created_at: new Date().toISOString() }),
  lms_enrolments: () => ({ id: crypto.randomUUID(), done: [], last_unit: null, status: 'active', pay_status: 'test_paid', enrolled_at: new Date().toISOString(), updated_at: new Date().toISOString(), completed_at: null }),
  lms_attempts: () => ({ id: crypto.randomUUID(), created_at: new Date().toISOString() }),
  lms_certificates: () => ({ issued_at: new Date().toISOString() }),
  lms_notifications: () => ({ id: crypto.randomUUID(), read: false, created_at: new Date().toISOString() }),
  signin_handoff: () => ({ created_at: new Date().toISOString() }),
};
const newSession = (u) => { const a = 'a' + crypto.randomBytes(8).toString('hex'), r = 'r' + crypto.randomBytes(8).toString('hex'); tokens[a] = u.id; refresh[r] = u.id; return { access_token: a, refresh_token: r, user: { id: u.id, email: u.email } }; };
const bearer = (req) => (req.headers.authorization || '').replace(/^Bearer /, '');
function filterRows(rows, params) {
  let out = rows;
  for (const [k, v] of params) {
    if (['select', 'order', 'limit'].includes(k)) continue;
    const m = /^(eq|gte)\.(.*)$/.exec(v); if (!m) continue;
    out = out.filter(r => m[1] === 'eq' ? String(r[k]) === m[2] : String(r[k]) >= m[2]);
  }
  const o = params.get('order'); if (o) { const [c, d] = o.split('.'); out = out.slice().sort((a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (d === 'desc' ? -1 : 1)); }
  const l = parseInt(params.get('limit'), 10); if (l) out = out.slice(0, l);
  return out;
}
function supa(req, res, body) {
  const u = new URL(req.url, 'http://x'), send = (s, d) => { res.writeHead(s, { 'content-type': 'application/json' }); res.end(d === undefined ? '' : JSON.stringify(d)); };
  const p = u.pathname;
  if (p.startsWith('/auth/v1/')) {
    const act = p.slice(9);
    if (act === 'signup') {
      if (!users.find(x => x.email === body.email)) {
        const usr = { id: crypto.randomUUID(), email: body.email, password: body.password, confirmed: false, code: '123456', created_at: new Date().toISOString() };
        users.push(usr); db.members.push({ id: usr.id, full_name: (body.data || {}).full_name || null, email: usr.email, ...defaults.members() });
        sent.push({ kind: 'confirm', to: usr.email });
      }
      return send(200, { id: 'obfuscated' });
    }
    if (act === 'token' && u.searchParams.get('grant_type') === 'password') {
      const x = users.find(v => v.email === body.email && v.password === body.password && v.confirmed);
      return x ? send(200, newSession(x)) : send(400, { error: 'invalid_grant' });
    }
    if (act === 'token' && u.searchParams.get('grant_type') === 'refresh_token') {
      const id = refresh[body.refresh_token]; const x = users.find(v => v.id === id);
      if (!x) return send(400, { error: 'bad refresh' }); delete refresh[body.refresh_token]; return send(200, newSession(x));
    }
    if (act === 'user') { const x = users.find(v => v.id === tokens[bearer(req)]); return x ? send(200, { id: x.id, email: x.email, created_at: x.created_at }) : send(401, { error: 'bad jwt' }); }
    if (act === 'verify') { const x = users.find(v => v.email === body.email); if (!x || String(body.token) !== x.code) return send(403, { error: 'otp expired' }); x.confirmed = true; return send(200, newSession(x)); }
    if (act === 'logout') { delete tokens[bearer(req)]; return send(204); }
    if (act === 'recover') { sent.push({ kind: 'reset', to: body.email }); return send(200, {}); }
    if (act === 'otp') {
      let x = users.find(v => v.email === body.email);
      if (!x) { x = { id: crypto.randomUUID(), email: body.email, password: crypto.randomBytes(6).toString('hex'), confirmed: false, code: '123456', created_at: new Date().toISOString() }; users.push(x); db.members.push({ id: x.id, full_name: null, email: x.email, ...defaults.members() }); }
      sent.push({ kind: 'magic', to: x.email }); return send(200, {});
    }
    return send(404, { error: 'unknown' });
  }
  if (p.startsWith('/rest/v1/')) {
    const t = p.slice(9), rows = db[t];
    const key = req.headers.apikey, isSvc = key === SERVICE;
    if (!rows) return send(404, { error: 'no table' });
    // row security: the public key reads nothing, except a member's own row
    if (!isSvc) {
      if (t !== 'members' || req.method !== 'GET') return send(401, { error: 'row level security' });
      const me = tokens[bearer(req)]; return send(200, filterRows(rows.filter(r => r.id === me), u.searchParams));
    }
    const rep = /return=representation/.test(req.headers.prefer || '');
    if (req.method === 'GET') return send(200, filterRows(rows, u.searchParams));
    if (req.method === 'POST') {
      const list = Array.isArray(body) ? body : [body], made = [];
      for (const b of list) {
        const row = { ...(defaults[t] ? defaults[t]() : {}), ...b }, uk = uniq[t];
        const dup = uk && rows.find(r => uk.every(c => r[c] === row[c]));
        if (dup) { if (/merge-duplicates/.test(req.headers.prefer || '')) { Object.assign(dup, b); made.push(dup); continue; } return send(409, { error: 'duplicate' }); }
        if (t === 'lms_certificates' && rows.find(r => r.code === row.code)) return send(409, { error: 'duplicate' });
        rows.push(row); made.push(row);
      }
      return rep ? send(201, made) : send(201);
    }
    if (req.method === 'PATCH') { const hit = filterRows(rows, u.searchParams); hit.forEach(r => Object.assign(r, body)); return rep ? send(200, hit) : send(204); }
    if (req.method === 'DELETE') { const hit = filterRows(rows, u.searchParams); hit.forEach(r => rows.splice(rows.indexOf(r), 1)); return rep ? send(200, hit) : send(204); }
  }
  send(404, {});
}

/* ---------- local site: static files + the real functions ---------- */
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const handlers = {};
const readAll = (q) => new Promise(r => { const c = []; q.on('data', d => c.push(d)); q.on('end', () => r(Buffer.concat(c))); });
async function site(q, r) {
  const url = new URL(q.url, 'http://x');
  if (url.pathname.startsWith('/api/')) {
    const name = url.pathname.slice(5), h = handlers[name]; if (!h) { r.writeHead(404); return r.end(); }
    const buf = await readAll(q);
    const resp = await h(new Request('http://localhost' + url.pathname, { method: q.method, headers: q.headers, body: ['GET', 'HEAD'].includes(q.method) ? undefined : buf }));
    const heads = {}; resp.headers.forEach((v, k) => { if (k !== 'set-cookie') heads[k] = v; });
    const sc = resp.headers.getSetCookie(); if (sc.length) heads['set-cookie'] = sc;
    r.writeHead(resp.status, heads); return r.end(Buffer.from(await resp.arrayBuffer()));
  }
  const p = path.join(SITE, decodeURIComponent(url.pathname).replace(/\/$/, '/index.html'));
  if (!p.startsWith(SITE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r);
}

/* ---------- tiny test kit ---------- */
const results = { 'SIGN-IN': [], 'PAY PAGE': [], 'BACK END': [] };
let area = 'BACK END';
const check = (name, cond, extra) => { results[area].push({ name, pass: !!cond }); console.log((cond ? 'PASS ' : 'FAIL ') + '[' + area + '] ' + name + (cond ? '' : '  ' + (extra || ''))); };
function client(base) {
  const jar = {};
  return async (pathn, body, opt = {}) => {
    const headers = { 'content-type': 'application/json', ...(opt.headers || {}) };
    const ck = Object.entries(jar).map(([k, v]) => k + '=' + v).join('; '); if (ck) headers.cookie = ck;
    const r = await fetch(base + pathn, { method: opt.method || 'POST', headers, body: opt.method === 'GET' ? undefined : JSON.stringify(body) });
    for (const c of r.headers.getSetCookie()) { const [kv] = c.split(';'); const i = kv.indexOf('='); const k = kv.slice(0, i), v = kv.slice(i + 1); if (v === '') delete jar[k]; else jar[k] = v; }
    let d = {}; try { d = await r.json(); } catch (e) { /* empty */ } d.status = r.status; d.jar = jar; return d;
  };
}

(async () => {
  const supaServer = http.createServer(async (q, r) => { const b = await readAll(q); let body = {}; try { body = JSON.parse(b.toString() || '{}'); } catch (e) { /* none */ } supa(q, r, body); });
  await new Promise(r => supaServer.listen(0, r));
  process.env.SUPABASE_URL = 'http://127.0.0.1:' + supaServer.address().port; process.env.SUPABASE_ANON_KEY = ANON; process.env.SUPABASE_SERVICE_KEY = SERVICE; process.env.AUTH_PROVIDERS = 'email';
  for (const n of ['auth', 'lms', 'forms', 'messages', 'opinions']) handlers[n] = (await import(path.join(FN, n + '.mjs'))).default;
  const siteServer = http.createServer((q, r) => site(q, r).catch(e => { r.writeHead(500); r.end(String(e)); }));
  await new Promise(r => siteServer.listen(0, r));
  const base = 'http://localhost:' + siteServer.address().port;
  const api = client(base);

  /* ===== BACK END, part 1: members service (/api/auth) ===== */
  area = 'BACK END';
  check('auth: only POST accepted', (await api('/api/auth', null, { method: 'GET' })).status === 405);
  process.env.SITE_ORIGIN = 'http://localhost:1';
  check('auth: a request from another website is refused', (await api('/api/auth', { action: 'config' }, { headers: { origin: 'http://evil.example' } })).status === 403);
  delete process.env.SITE_ORIGIN;
  check('auth: spam robot field is ignored and saves nothing', (await api('/api/auth', { action: 'signup', email: 'bot@example.com', password: 'longpassword1', website: 'x' })).status === 200 && !users.find(u => u.email === 'bot@example.com'));
  check('auth: config lists email sign-in', ((await api('/api/auth', { action: 'config' })).providers || []).includes('email'));
  check('signup: bad email refused', (await api('/api/auth', { action: 'signup', email: 'nope', password: 'longpassword1' })).status === 400);
  check('signup: short password refused', (await api('/api/auth', { action: 'signup', email: 'a@example.com', password: 'short' })).status === 400);
  const up = await api('/api/auth', { action: 'signup', name: 'Test Learner', email: 'learner@example.com', password: 'a-long-test-pass' });
  check('signup: good sign-up answers kindly', up.status === 200 && /confirm/i.test(up.message || ''));
  const up2 = await api('/api/auth', { action: 'signup', name: 'Test Learner', email: 'learner@example.com', password: 'a-long-test-pass' });
  check('signup: same answer for an address that already exists (nobody can probe)', up2.message === up.message);
  check('members row is created for each sign-up', db.members.filter(m => m.email === 'learner@example.com').length === 1);
  check('login: refused until the email is confirmed', (await api('/api/auth', { action: 'login', email: 'learner@example.com', password: 'a-long-test-pass' })).status === 401);
  check('verify: wrong code refused', (await api('/api/auth', { action: 'verify', email: 'learner@example.com', code: '000000' })).status === 401);
  const vf = await api('/api/auth', { action: 'verify', email: 'learner@example.com', code: '123 456' });
  check('verify: the 6-digit code signs the member in and sets the session cookie', vf.status === 200 && vf.ok && vf.jar.hfl_session && vf.jar.hfl_in === '1');
  const me = await api('/api/auth', { action: 'me' });
  check('me: returns name, email and plan', me.status === 200 && me.email === 'learner@example.com' && me.name === 'Test Learner' && me.plan === 'free');
  check('me: the cookie holds no readable password', !Buffer.from(vf.jar.hfl_session, 'base64url').toString().includes('a-long-test-pass'));
  const out = await api('/api/auth', { action: 'logout' });
  check('logout: clears the cookies', out.status === 200 && !out.jar.hfl_session && !out.jar.hfl_in);
  check('me: refused after logout', (await api('/api/auth', { action: 'me' })).status === 401);
  check('login: wrong password refused', (await api('/api/auth', { action: 'login', email: 'learner@example.com', password: 'wrong-password-1' })).status === 401);
  const lg = await api('/api/auth', { action: 'login', email: 'learner@example.com', password: 'a-long-test-pass' });
  check('login: right password signs in', lg.status === 200 && lg.jar.hfl_session);
  // an expired access token is refreshed quietly
  const s = JSON.parse(Buffer.from(lg.jar.hfl_session, 'base64url').toString()); delete tokens[s.a];
  const me2 = await api('/api/auth', { action: 'me' });
  check('session: an expired token is refreshed without asking the member to log in again', me2.status === 200 && me2.email === 'learner@example.com');
  const before = sent.length; await api('/api/auth', { action: 'reset', email: 'nobody@example.com' });
  check('reset: same kind answer for unknown address', (await api('/api/auth', { action: 'reset', email: 'nobody@example.com' })).message.includes('If this address'));
  check('reset: a real member gets the message sent', (await api('/api/auth', { action: 'reset', email: 'learner@example.com' })).status === 200 && sent.slice(before).some(x => x.kind === 'reset' && x.to === 'learner@example.com'));
  const mg = await api('/api/auth', { action: 'magic', email: 'magic@example.com' }, { headers: { origin: base } });
  check('magic link: sends and answers kindly', mg.status === 200 && sent.some(x => x.kind === 'magic'));
  check('oauth: not offered when not switched on', (await api('/api/auth', { action: 'oauth', provider: 'google' }, { headers: { origin: base } })).status === 400);
  // sign in on one device, finish on the other
  const wait = crypto.randomBytes(16).toString('hex'), dev2 = client(base), dev1 = client(base);
  const tok = (await dev2('/api/auth', { action: 'login', email: 'learner@example.com', password: 'a-long-test-pass' })).jar.hfl_session; const t2 = JSON.parse(Buffer.from(tok, 'base64url').toString());
  check('handoff: waiting screen is told "pending" first', (await dev1('/api/auth', { action: 'poll', wait })).pending === true);
  check('handoff: the device that opened the link leaves the sign-in', (await dev2('/api/auth', { action: 'handoff', wait, access_token: t2.a, refresh_token: t2.r })).ok === true);
  const pl = await dev1('/api/auth', { action: 'poll', wait });
  check('handoff: the waiting device is signed in', pl.ok === true && pl.jar.hfl_session);
  check('handoff: a pending sign-in can be taken only once', (await client(base)('/api/auth', { action: 'poll', wait })).pending === true);
  check('handoff: bad wait code refused', (await dev1('/api/auth', { action: 'poll', wait: 'zz' })).status === 400);

  /* ===== BACK END, part 2: learning core (/api/lms) ===== */
  const L = client(base), lms = (b) => L('/api/lms', b);
  check('lms: signed-out visitor is refused', (await lms({ action: 'state' })).status === 401);
  check('lms: a certificate code can be checked by anyone (unknown code says not valid)', (await lms({ action: 'verify', code: 'HFL-AAAA-BBBB-CCCC' })).valid === false);
  check('lms: bad certificate code format refused', (await lms({ action: 'verify', code: 'nope' })).status === 400);
  await L('/api/auth', { action: 'login', email: 'learner@example.com', password: 'a-long-test-pass' });
  let st = await lms({ action: 'state' });
  check('lms: state starts empty for a new learner', st.status === 200 && st.enrolments.length === 0 && st.user.role === 'learner');
  check('lms: progress before joining refused', (await lms({ action: 'progress', course: COURSE, total: 3, done: [0] })).status === 403);
  check('lms: bad course name refused', (await lms({ action: 'enrol', course: '../etc/passwd', title: 'x' })).status === 400);
  const en = await lms({ action: 'enrol', course: COURSE, title: 'Test course', total: 3, method: 'upi', ref: 'T-1' });
  check('pay: joining records a TEST payment (test_paid) with the chosen method', en.status === 200 && db.lms_enrolments[0].pay_status === 'test_paid' && db.lms_enrolments[0].pay_method === 'upi');
  check('pay: joining twice does not create a second enrolment', (await lms({ action: 'enrol', course: COURSE, title: 'Test course', total: 3 })).status === 200 && db.lms_enrolments.length === 1);
  check('pay: only bank and UPI are accepted (card falls back to bank)', (await lms({ action: 'enrol', course: 'course-eu-02.html', title: 'Two', total: 2, method: 'card' })).status === 200 && db.lms_enrolments.find(e => e.course_key === 'course-eu-02.html').pay_method === 'bank');
  check('lms: a welcome note is added when a course is joined', (await lms({ action: 'state' })).notifications.some(n => n.kind === 'enrolled'));
  const pr = await lms({ action: 'progress', course: COURSE, total: 3, done: [0, 1, 1, 99, -2], last: 1 });
  check('progress: only valid units are kept, no repeats', JSON.stringify(pr.enrolment.done) === '[0,1]' && pr.enrolment.status === 'active');
  check('certificate: refused before every unit is done', (await lms({ action: 'certificate', course: COURSE })).status === 409);
  const full = await lms({ action: 'progress', course: COURSE, total: 3, done: [0, 1, 2] });
  check('progress: finishing every unit marks the course completed', full.enrolment.status === 'completed');
  check('certificate: refused until the final check is passed', (await lms({ action: 'certificate', course: COURSE })).status === 409);
  const bad = await lms({ action: 'quiz', course: COURSE, answers: QKEY.split('').map(() => 9) });
  check('quiz: wrong answers fail with a score and can be retried', bad.status === 200 && bad.passed === false && bad.pct === 0);
  const good = await lms({ action: 'quiz', course: COURSE, answers: QKEY.split('').map(Number) });
  check('quiz: right answers pass at 100%', good.passed === true && good.pct === 100);
  const ce = await lms({ action: 'certificate', course: COURSE });
  check('certificate: issued once everything is done and passed', ce.status === 200 && /^HFL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(ce.certificate.code) && ce.certificate.holder === 'Test Learner');
  check('certificate: asking again returns the same one', (await lms({ action: 'certificate', course: COURSE })).certificate.code === ce.certificate.code);
  const vcode = await client(base)('/api/lms', { action: 'verify', code: ce.certificate.code });
  check('certificate: the public check says valid, with name and course, no email', vcode.valid === true && vcode.certificate.holder === 'Test Learner' && !JSON.stringify(vcode).includes('@'));
  await lms({ action: 'notes_read' });
  check('notifications: can be marked read', (await lms({ action: 'state' })).notifications.every(n => n.read));
  check('report: a learner cannot open the facilitator report', (await lms({ action: 'report' })).status === 403);
  // another learner cannot see this learner's data
  await api('/api/auth', { action: 'signup', name: 'Other Learner', email: 'other@example.com', password: 'another-long-pass' });
  await api('/api/auth', { action: 'verify', email: 'other@example.com', code: '123456' });
  const O = client(base); await O('/api/auth', { action: 'login', email: 'other@example.com', password: 'another-long-pass' });
  const ost = await O('/api/lms', { action: 'state' });
  check('privacy: one learner never sees another learner\'s courses or certificates', ost.enrolments.length === 0 && ost.certificates.length === 0);
  check('privacy: the other learner cannot claim someone else\'s progress', (await O('/api/lms', { action: 'progress', course: COURSE, total: 3, done: [0] })).status === 403);
  db.members.find(m => m.email === 'learner@example.com').role = 'facilitator';
  const rep = await lms({ action: 'report' });
  check('report: a facilitator sees the learner table and course totals', rep.status === 200 && rep.totals.enrolments === 2 && rep.totals.completed === 1 && rep.rows.length === 2);
  check('report: demo rows appear only when AHFL_DEMO_DATA=1', !rep.rows.some(r => r.demo));
  // public key cannot read the learning tables (row security)
  const pubRead = await fetch(process.env.SUPABASE_URL + '/rest/v1/lms_enrolments', { headers: { apikey: ANON, Authorization: 'Bearer ' + ANON } });
  check('database: the public key cannot read learning tables', pubRead.status === 401);
  const pubMsg = await fetch(process.env.SUPABASE_URL + '/rest/v1/messages', { headers: { apikey: ANON, Authorization: 'Bearer ' + ANON } });
  check('database: the public key cannot read messages', pubMsg.status === 401);

  /* ===== BACK END, part 3: contact, opinion and member forms ===== */
  check('messages: a good message is saved with a reference', (await api('/api/messages', { name: 'A', email: 'a@example.com', topic: 'Courses', message: 'Hello there' })).status === 200 && db.messages.length === 1);
  check('messages: empty message refused', (await api('/api/messages', { name: 'A', email: 'a@example.com', message: '' })).status === 400);
  check('opinions: a rating is saved', (await api('/api/opinions', { rating: 5, page: 'index.html', site: 'houseforlearning.com' })).status === 200 && db.opinions.length === 1);
  check('opinions: empty vote refused', (await api('/api/opinions', {})).status === 400);
  const F = client(base);
  check('forms: signed-out member form refused', (await F('/api/forms', { kind: 'feedback', course: 'x' })).status === 401);
  await F('/api/auth', { action: 'login', email: 'other@example.com', password: 'another-long-pass' });
  check('forms: signed-in member form saved', (await F('/api/forms', { kind: 'feedback', course: 'Test', comment: 'Good' })).status === 200 && db.messages.some(m => /Form: Course feedback/.test(m.topic)));
  check('forms: missing required field refused', (await F('/api/forms', { kind: 'feedback' })).status === 400);
  // not switched on: friendly 503 rather than a crash
  const keep = process.env.SUPABASE_SERVICE_KEY; delete process.env.SUPABASE_SERVICE_KEY;
  check('safety: with the database switched off the pages get a clear 503, not a crash', (await api('/api/messages', { name: 'A', email: 'a@example.com', message: 'Hi' })).status === 503 && (await api('/api/lms', { action: 'state' })).status === 503);
  process.env.SUPABASE_SERVICE_KEY = keep;

  /* ===== SIGN-IN and PAY PAGE in a real browser ===== */
  const b = await chromium.launch();
  for (const W of [1280, 390]) {
    const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 900 } }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    const tag = ' (' + W + ' px)', email = 'ui' + W + '@example.com', pw = 'ui-long-pass-' + W;
    const overflow = () => pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    area = 'SIGN-IN';
    await pg.goto(base + '/login.html'); await pg.waitForLoadState('networkidle');
    check('login page opens with Log in and Sign up forms' + tag, await pg.locator('form[data-member=login]').isVisible() && await pg.locator('form[data-member=signup]').isVisible());
    check('login page has no sideways scroll' + tag, !(await overflow()));
    await pg.fill('#l-email', email); await pg.fill('#l-pass', 'not-the-password'); await pg.click('form[data-member=login] button[type=submit]');
    await pg.waitForFunction(() => /not right/i.test(document.querySelector('form[data-member=login] .form-status')?.textContent || ''), null, { timeout: 5000 }).catch(() => {});
    check('wrong password shows a clear message and stays on the page' + tag, /not right/i.test(await pg.locator('form[data-member=login] .form-status').textContent()) && /login\.html/.test(pg.url()));
    await pg.fill('#s-name', 'Ui Learner ' + W); await pg.fill('#s-email', email); await pg.fill('#s-pass', pw); await pg.locator('form[data-member=signup] input[type=checkbox]').check(); await pg.click('form[data-member=signup] button[type=submit]');
    await pg.waitForFunction(() => /Thank you/.test(document.querySelector('form[data-member=signup] .form-status')?.textContent || ''), null, { timeout: 5000 }).catch(() => {});
    const supText = await pg.locator('form[data-member=signup] .form-status').textContent();
    check('sign up shows the thank-you and confirm message' + tag, /Thank you/.test(supText), 'status said: "' + supText + '"');
    await pg.fill('#l-email', email); await pg.fill('#l-pass', pw); await pg.click('form[data-member=login] button[type=submit]');
    await pg.waitForTimeout(800);
    check('before the email is confirmed, log in is refused' + tag, /login\.html/.test(pg.url()));
    // finish with the 6-digit code
    const codeForm = pg.locator('form[data-member=verify]');
    await pg.fill('#m-email', email); await pg.click('form[data-member=magic] button[type=submit]');
    await pg.waitForFunction(() => !document.querySelector('form[data-member=verify]').hidden, null, { timeout: 5000 }).catch(() => {});
    check('"email me a link" opens the code box' + tag, await codeForm.isVisible());
    await pg.fill('#v-code', '123456'); await pg.click('form[data-member=verify] button[type=submit]');
    await pg.waitForURL('**/members.html', { timeout: 6000 }).catch(() => {});
    await pg.waitForFunction(() => document.querySelector('[data-name]') && document.querySelector('[data-name]').textContent.length > 0, null, { timeout: 5000 }).catch(() => {});
    check('the code signs in and My page shows the member' + tag, /members\.html/.test(pg.url()) && (await pg.locator('[data-email]').textContent()) === email);
    check('My page has no sideways scroll' + tag, !(await overflow()));
    await pg.goto(base + '/login.html'); await pg.waitForLoadState('networkidle');
    await pg.context().clearCookies();
    check('signed-out visitor to My page is sent to the login page' + tag, await (async () => { await pg.goto(base + '/members.html'); await pg.waitForURL('**/login.html', { timeout: 6000 }).catch(() => {}); return /login\.html/.test(pg.url()); })());
    await pg.fill('#l-email', email); await pg.fill('#l-pass', pw); await pg.click('form[data-member=login] button[type=submit]');
    await pg.waitForURL('**/members.html', { timeout: 6000 }).catch(() => {});
    check('log in with email and password works' + tag, /members\.html/.test(pg.url()));

    area = 'PAY PAGE';
    const c = encodeURIComponent(COURSE), t = encodeURIComponent('Test course');
    await pg.goto(base + '/pay.html?course=' + c + '&t=' + t + '&n=3'); await pg.waitForSelector('#lms-box h3', { timeout: 6000 }).catch(() => {});
    check('pay page names the course and says test only, nothing taken' + tag, /Join: Test course/.test(await pg.locator('#lms-box h3').textContent()) && /No real money/i.test(await pg.locator('#lms-box').textContent()));
    check('pay page offers bank transfer and UPI only (no card)' + tag, (await pg.locator('input[name=method]').count()) === 2 && !(/card|stripe|paypal/i.test(await pg.locator('#lms-box').textContent())));
    check('pay page has no sideways scroll' + tag, !(await overflow()));
    await pg.check('input[value=upi]'); await pg.click('#lms-box button.btn');
    await pg.waitForURL('**/' + COURSE, { timeout: 8000 }).catch(() => {});
    check('"I have paid (test)" joins and opens the course' + tag, new RegExp(COURSE).test(pg.url()));
    const row = db.lms_enrolments.find(e => e.course_key === COURSE && users.find(u => u.id === e.user_id && u.email === email));
    check('the join is stored in the member account as a test payment by UPI' + tag, row && row.pay_status === 'test_paid' && row.pay_method === 'upi');
    await pg.goto(base + '/members-courses.html'); await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(600);
    check('My courses lists the joined course' + tag, /Test course|course-eu-01/i.test(await pg.locator('main').textContent()));
    await pg.context().clearCookies(); await pg.goto(base + '/pay.html?course=' + c + '&t=' + t + '&n=3'); await pg.waitForSelector('#lms-box a', { timeout: 6000 }).catch(() => {});
    check('signed-out visitor on the pay page is asked to sign in, no pay button' + tag, (await pg.locator('#lms-box a[href="login.html"]').count()) === 1 && (await pg.locator('#lms-box button.btn').count()) === 0);
    await pg.goto(base + '/pay.html'); await pg.waitForTimeout(500);
    area = 'PAY PAGE';
    { /* the whole journey: course page, sign in, come back to the course, join, pay, tick Done at step 1 */
      const c2 = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 900 } }), q = await c2.newPage(), em = 'ret' + W + '@example.com', pw2 = 'return-long-pass-' + W;
      await api('/api/auth', { action: 'signup', name: 'Return Learner', email: em, password: pw2 });
      await q.goto(base + '/' + COURSE); await q.waitForLoadState('networkidle');
      const sj = q.locator('.acc-bar a:has-text("Sign in to join")');
      check('course page, signed out: the bar offers "Sign in to join"' + tag, (await sj.count()) === 1);
      await sj.click(); await q.waitForURL('**/login.html**', { timeout: 6000 }).catch(() => {});
      await q.fill('#m-email', em); await q.click('form[data-member=magic] button[type=submit]');
      await q.waitForFunction(() => !document.querySelector('form[data-member=verify]').hidden, null, { timeout: 5000 }).catch(() => {});
      await q.fill('#v-code', '123456'); await q.click('form[data-member=verify] button[type=submit]');
      await q.waitForURL('**/' + COURSE, { timeout: 8000 }).catch(() => {});
      check('after sign-in the member is taken back to the course, not left in My page' + tag, new RegExp(COURSE).test(q.url()));
      const jn = q.locator('.acc-bar a:has-text("Join this course")'); await jn.waitFor({ timeout: 6000 }).catch(() => {});
      check('the course page now shows a visible "Join this course" button' + tag, (await jn.count()) === 1 && await jn.isVisible());
      // the ways in for a member with no course yet must not loop back to a list
      await q.goto(base + '/members.html'); await q.waitForSelector('[data-email]', { state: 'visible', timeout: 6000 }).catch(() => {});
      check('My page has a direct "Open the test course" button' + tag, (await q.locator('#my-page a[href="course-eu-01.html"]').count()) === 1);
      await q.goto(base + '/members-courses.html'); await q.waitForSelector('#lms-box a', { timeout: 6000 }).catch(() => {});
      check('My courses with no course yet offers "Open the test course", not only a browse list' + tag, (await q.locator('#lms-box a[href="course-eu-01.html"]').count()) === 1);
      await q.goto(base + '/pay.html'); await q.waitForSelector('#lms-box a', { timeout: 6000 }).catch(() => {});
      check('the pay page opened with no course says so and offers "Open the test course"' + tag, (await q.locator('#lms-box a[href="course-eu-01.html"]').count()) === 1);
      await q.locator('#lms-box a[href="course-eu-01.html"]').first().click(); await q.waitForURL('**/' + COURSE, { timeout: 6000 }).catch(() => {});
      await q.locator('.acc-bar a:has-text("Join this course")').waitFor({ timeout: 6000 }).catch(() => {});
      const jn2 = q.locator('.acc-bar a:has-text("Join this course")');
      await jn2.click(); await q.waitForSelector('#lms-box button.btn', { timeout: 6000 }).catch(() => {});
      await q.click('#lms-box button.btn'); await q.waitForURL('**/' + COURSE, { timeout: 8000 }).catch(() => {});
      await q.waitForFunction(() => /You are in|Your course/.test((document.querySelector('.acc-bar') || {}).textContent || ''), null, { timeout: 6000 }).catch(() => {});
      const bar0 = await q.locator('.acc-bar .acc-t').first().textContent();
      check('after paying the bar says how many steps are done and where to tick Done' + tag, /0 of \d+ steps done\. Tick Done/.test(bar0), bar0);
      const box = q.locator('input[type=checkbox][aria-label^="Mark step 1 as done"]');
      check('the Done tick for step 1 exists on the page' + tag, (await box.count()) === 1);
      await box.scrollIntoViewIfNeeded(); await box.check(); await q.waitForTimeout(900);
      const bar1 = await q.locator('.acc-bar .acc-t').first().textContent();
      check('ticking Done at step 1 moves the bar to "1 of N"' + tag, /^1 of \d+ steps done/.test(bar1), bar1);
      const rowE = db.lms_enrolments.find(e => users.find(u => u.id === e.user_id && u.email === em));
      check('the tick is saved in the member account (database row has step 1 done)' + tag, rowE && JSON.stringify(rowE.done) === '[0]', JSON.stringify(rowE && rowE.done));
      await q.reload(); await q.waitForLoadState('networkidle'); await q.waitForTimeout(800);
      check('reloading the course keeps the tick (progress remembered)' + tag, /^1 of \d+ steps done/.test(await q.locator('.acc-bar .acc-t').first().textContent()));
      await c2.close();
    }
    area = 'SIGN-IN';
    await pg.fill('#l-email', email).catch(() => {});
    await pg.goto(base + '/login.html'); await pg.fill('#l-email', email); await pg.fill('#l-pass', pw); await pg.click('form[data-member=login] button[type=submit]');
    await pg.waitForURL('**/members.html', { timeout: 6000 }).catch(() => {});
    await pg.waitForSelector('#logout', { state: 'visible', timeout: 5000 }).catch(() => {});
    await pg.click('#logout'); await pg.waitForURL('**/index.html', { timeout: 6000 }).catch(() => {});
    await pg.goto(base + '/members.html'); await pg.waitForURL('**/login.html', { timeout: 6000 }).catch(() => {});
    check('Log out ends the session: My page then sends the visitor to log in' + tag, /login\.html/.test(pg.url()));
    area = 'PAY PAGE';
    check('no page errors on sign-in, pay or My courses' + tag, errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  await b.close(); supaServer.close(); siteServer.close();

  console.log('\nSUMMARY');
  let failed = 0;
  for (const k of Object.keys(results)) { const r = results[k], p = r.filter(x => x.pass).length; failed += r.length - p; console.log(k.padEnd(9) + ' ' + p + ' of ' + r.length + ' pass' + (p === r.length ? '' : '  FAILED: ' + r.filter(x => !x.pass).map(x => x.name).join('; '))); }
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
