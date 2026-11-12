#!/usr/bin/env node
/* Click test of the learning home. Run: node tools/lms/dev-server.mjs 8899 &  then  node tools/lms/home_test.js */
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const rnd = Math.random().toString(36).slice(2, 7);
(async () => {
  const browser = await chromium.launch(), errors = [];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } }), page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/40[134]/.test(m.text())) errors.push(m.text()); });
  const em = `home${rnd}@test.invalid`;
  await ctx.request.post(BASE + '/api/auth', { data: { action: 'signup', email: em, password: 'longpassword1', name: 'Hema Learner' } });
  await page.goto(BASE + '/login.html'); await page.fill('form[data-member=login] input[name=email]', em); await page.fill('form[data-member=login] input[name=password]', 'longpassword1');
  await Promise.all([page.waitForURL('**/members.html'), page.click('form[data-member=login] button[type=submit]')]);
  await page.goto(BASE + '/home.html'); await page.waitForSelector('.lh-next');
  log(/Hema Learner/.test(await page.locator('#lms-box h3').first().innerText()), 'greets the member by name');
  log(await page.locator('.lh-next a:has-text("Browse member courses")').count() === 1, 'new member is told the next step: browse courses');
  log(await page.locator('.lh-strip li.on').count() === 0 && await page.locator('.lh-strip li').count() === 5, 'journey strip shows five steps, none done');
  log(await page.locator('.lh-hub .lh-card').count() === 14, 'hub has fourteen cards (ten learning tools and the four start pages)');
  await page.click('.lh-q >> nth=1'); log(await page.locator('.lh-q[open]').count() === 1, 'questions open and close');
  // join a course -> strip ticks, next step changes
  await page.evaluate(() => fetch('/api/lms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'enrol', course: 'cpd-designing-a-repeatable-test.html', title: 'Designing a repeatable test', total: 3, method: 'bank' }) }));
  await page.reload(); await page.waitForSelector('.lh-strip');
  log(await page.locator('.lh-strip li.on').count() === 1 && /Designing a repeatable test/.test(await page.locator('.lh-next').innerText()), 'after joining: step ticks and next step names the course');
  log(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'no sideways scroll at 390px');
  log(errors.length === 0, 'no script or security errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
