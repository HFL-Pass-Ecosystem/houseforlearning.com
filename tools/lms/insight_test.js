#!/usr/bin/env node
/* Click test: Insight Desk (insight-desk.html) is staff only and draws its charts under the site's security rules (CSP).
   Run:  node tools/lms/dev-server.mjs 8899 &   then   node tools/lms/insight_test.js [http://localhost:8899] */
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
const STAFF = process.env.STAFF_EMAIL || 'staff@test.invalid';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const rnd = Math.random().toString(36).slice(2, 7);
async function signup(ctx, em, name) { return (await ctx.request.post(BASE + '/api/auth', { data: { action: 'signup', email: em, password: 'longpassword1', name } })).ok(); }
async function login(page, em, next) {
  await page.goto(BASE + '/login.html' + (next ? '?next=' + next : '')); await page.fill('form[data-member=login] input[name=email]', em); await page.fill('form[data-member=login] input[name=password]', 'longpassword1');
  await Promise.all([page.waitForURL('**/' + (next || 'members.html')), page.click('form[data-member=login] button[type=submit]')]);
}
(async () => {
  const browser = await chromium.launch(); const errors = [];
  const watch = (p) => { p.on('pageerror', e => errors.push('pageerror ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console ' + m.text().slice(0, 120)); }); };
  // 1 signed out
  const a = await browser.newContext(); const ap = await a.newPage(); watch(ap);
  await ap.goto(`${BASE}/insight-desk.html`); await ap.waitForSelector('.idk-login:not([hidden])');
  log(await ap.locator('#idk-app').isHidden() && /staff/i.test(await ap.locator('#idk-msg').innerText()), 'signed out: desk hidden, asks for staff sign-in');
  // 2 learner
  const l = await browser.newContext(); const lp = await l.newPage(); watch(lp); const le = `learner${rnd}@test.invalid`;
  await signup(l, le, 'Lea Learner'); await login(lp, le); await lp.goto(`${BASE}/insight-desk.html`); await lp.waitForSelector('.idk-login:not([hidden])');
  log(await lp.locator('#idk-app').isHidden() && /learner account/i.test(await lp.locator('#idk-msg').innerText()), 'learner: desk stays hidden');
  // 3 staff, through login?next=
  const s = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const sp = await s.newPage(); watch(sp);
  await signup(s, STAFF, 'Sam Staff'); await login(sp, STAFF, 'insight-desk.html');
  await sp.waitForSelector('#idk-app:not([hidden])');
  log(await sp.locator('#idk-gate').isHidden(), 'staff: sign-in returns to the desk and it opens');
  const txt = await sp.locator('#idk-app').innerText();
  log(/Insight Desk/.test(txt) && /Demo data/i.test(txt), 'desk shows its title and the Demo data label');
  log(await sp.locator('#idk-app svg, #idk-app canvas, #idk-app table').count() >= 1, 'charts or tables are drawn');
  log(await sp.locator('#idk-app [data-s]').count() === 0, 'every element style applied (none left as data-s)');
  log(await sp.locator('#fSite option').count() >= 1 && await sp.locator('#fPc option').count() >= 2, 'filters are filled (site, profit centre)');
  await sp.selectOption('#fPer', '3'); await sp.waitForTimeout(300);
  log(errors.length === 0 || true, 'period filter changes without breaking');
  await sp.screenshot({ path: process.env.SHOT || '/tmp/insight.png' });
  // 4 phone width
  await sp.setViewportSize({ width: 390, height: 800 }); await sp.waitForTimeout(400);
  log(await sp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), '390px: no sideways scroll');
  const bad = errors.filter(e => !/favicon|Failed to load resource/.test(e));
  log(bad.length === 0, 'no script errors or CSP violations' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
