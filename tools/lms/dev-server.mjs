#!/usr/bin/env node
// Local test server for the LMS. Serves site/ with the SAME security headers as Netlify (so blocked inline scripts show up here too),
// runs the real Netlify functions at /api/*, and stands in for Supabase with a small in-memory copy at /mock.
// Nothing leaves your machine and no keys are needed.  Run:  node tools/lms/dev-server.mjs [port]
// Test staff login: sign up with the email in STAFF_EMAIL (default staff@test.invalid) to get the facilitator role.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8899);
const STAFF = (process.env.STAFF_EMAIL || 'staff@test.invalid').toLowerCase();
const ORIGIN = `http://localhost:${PORT}`;
Object.assign(process.env, { SUPABASE_URL: ORIGIN + '/mock', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_KEY: 'service', AHFL_DEMO_DATA: process.env.AHFL_DEMO_DATA ?? '1' });

const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
const CSP = (toml.match(/Content-Security-Policy = "([^"]+)"/) || [])[1] || '';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webp': 'image/webp', '.txt': 'text/plain' };

// ---- stand-in for Supabase (auth + the REST subset the functions use) ----
const T = { members: [], lms_enrolments: [], lms_attempts: [], lms_certificates: [], lms_notifications: [], lms_courses: [], lms_sales: [], lms_board: [] };
const users = new Map(), tokens = new Map();
const uuid = () => crypto.randomUUID();
function filt(rows, q) {
  let out = rows;
  for (const [k, v] of q) {
    if (['select', 'order', 'limit', 'on_conflict'].includes(k)) continue;
    const m = /^(eq|gte)\.(.*)$/.exec(v); if (!m) continue;
    out = out.filter((r) => (m[1] === 'eq' ? String(r[k]) === m[2] : String(r[k]) >= m[2]));
  }
  const o = q.get('order'); if (o) { const [c, d] = o.split('.'); out = [...out].sort((a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (d === 'desc' ? -1 : 1)); }
  const l = Number(q.get('limit')); return l ? out.slice(0, l) : out;
}
async function mock(req, res, u, body) {
  const send = (s, d) => { res.writeHead(s, { 'Content-Type': 'application/json' }); res.end(d === undefined ? '' : JSON.stringify(d)); };
  const p = u.pathname.replace('/mock', '');
  const bearer = (req.headers.authorization || '').replace('Bearer ', '');
  if (p === '/auth/v1/signup') {
    const { email, password, data } = JSON.parse(body); if (users.has(email)) return send(200, {});
    const id = uuid(); users.set(email, { id, email, password }); T.members.push({ id, full_name: data?.full_name || '', email, role: email === STAFF ? 'admin' : 'learner', plan: 'free', created_at: new Date().toISOString() });
    return send(200, { id });
  }
  if (p === '/auth/v1/token') {
    const b = JSON.parse(body);
    if (b.refresh_token) { const e = tokens.get('r:' + b.refresh_token); if (!e) return send(400, {}); const a = uuid(); tokens.set(a, e); return send(200, { access_token: a, refresh_token: b.refresh_token }); }
    const us = users.get(b.email); if (!us || us.password !== b.password) return send(400, { error: 'invalid' });
    const a = uuid(), r = uuid(); tokens.set(a, us.email); tokens.set('r:' + r, us.email); return send(200, { access_token: a, refresh_token: r });
  }
  if (p === '/auth/v1/user') { const e = tokens.get(bearer); const us = e && users.get(e); return us ? send(200, { id: us.id, email: us.email }) : send(401, {}); }
  if (p === '/auth/v1/logout') return send(204);
  const m = /^\/rest\/v1\/(\w+)$/.exec(p);
  if (m && T[m[1]]) {
    if (bearer !== 'service' && m[1] !== 'members') return send(401, {});
    const rows = T[m[1]], q = u.searchParams, id = m[1] === 'lms_certificates' ? 'code' : 'id';
    if (req.method === 'GET') return send(200, filt(rows, q));
    if (req.method === 'POST') {
      const bb = JSON.parse(body); if (Array.isArray(bb)) { bb.forEach((x) => rows.push({ id: uuid(), done: false, created_at: new Date().toISOString(), ...x })); return send(201); } const b = bb, row = { ...b };
      if (m[1] !== 'lms_certificates' && !row.id) row.id = uuid();
      if (m[1] === 'lms_enrolments') { if (rows.some((r) => r.user_id === row.user_id && r.course_key === row.course_key)) return send(409, {}); Object.assign(row, { done: [], status: 'active', pay_status: 'test_paid', enrolled_at: new Date().toISOString(), updated_at: new Date().toISOString(), completed_at: null, last_unit: null }); }
      if (m[1] === 'lms_certificates') { if (rows.some((r) => r.user_id === row.user_id && r.course_key === row.course_key)) return send(409, {}); row.issued_at = new Date().toISOString(); }
      if (m[1] === 'lms_courses') { if (rows.some((r) => r.ckey === row.ckey)) return send(409, {}); Object.assign(row, { status: 'draft', review_note: '', reviewer_id: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), published_at: null }); }
      if (m[1] === 'lms_board') Object.assign(row, { done: false, created_at: new Date().toISOString() });
      if (m[1] === 'lms_sales') row.created_at = new Date().toISOString();
      if (m[1] === 'lms_attempts' || m[1] === 'lms_notifications') { row.created_at = new Date().toISOString(); row.read = false; }
      rows.push(row); return (req.headers.prefer || '').includes('representation') ? send(201, [row]) : send(201);
    }
    if (req.method === 'DELETE') { const hit = new Set(filt(rows, q)); for (let i = rows.length - 1; i >= 0; i--) if (hit.has(rows[i])) rows.splice(i, 1); return send(204); }
    if (req.method === 'PATCH') { const hit = filt(rows, q); hit.forEach((r) => Object.assign(r, JSON.parse(body))); return (req.headers.prefer || '').includes('representation') ? send(200, hit) : send(204); }
  }
  send(404, { error: 'no such mock ' + p });
}

// ---- the site + the real functions ----
const fnCache = {};
async function fn(name) { return (fnCache[name] ||= (await import(pathToFileURL(path.join(ROOT, 'netlify', 'functions', name + '.mjs')).href)).default); }
http.createServer(async (req, res) => {
  const u = new URL(req.url, ORIGIN);
  const chunks = []; for await (const c of req) chunks.push(c); const raw = Buffer.concat(chunks);
  try {
    if (u.pathname.startsWith('/mock/')) return await mock(req, res, u, raw.toString());
    if (u.pathname.startsWith('/api/')) {
      const f = await fn(u.pathname.slice(5));
      const r = await f(new Request(ORIGIN + u.pathname, { method: req.method, headers: { ...req.headers, origin: ORIGIN }, body: ['GET', 'HEAD'].includes(req.method) ? undefined : raw }));
      const h = {}; r.headers.forEach((v, k) => { if (k !== 'set-cookie') h[k] = v; });
      const sc = r.headers.getSetCookie(); if (sc.length) h['set-cookie'] = sc;
      res.writeHead(r.status, h); return res.end(Buffer.from(await r.arrayBuffer()));
    }
    let f = path.join(ROOT, 'site', decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
    if (!f.startsWith(path.join(ROOT, 'site'))) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404, { 'Content-Type': 'text/html' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Content-Security-Policy': CSP.replace("connect-src 'self'", `connect-src 'self'`) });
    fs.createReadStream(f).pipe(res);
  } catch (e) { console.error(e); res.writeHead(500); res.end('error'); }
}).listen(PORT, () => console.log(`LMS test server on ${ORIGIN} (staff login: ${STAFF}, demo data: ${process.env.AHFL_DEMO_DATA})`));
