#!/usr/bin/env node
/* Click test of Plan my growth. Run: node tools/lms/dev-server.mjs 8899 &  then  node tools/lms/plan_test.js */
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const rnd = Math.random().toString(36).slice(2, 7);
(async () => {
  const browser = await chromium.launch(), errors = [];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } }), page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/40[134]/.test(m.text())) errors.push(m.text()); });
  const em = `pl${rnd}@test.invalid`;
  await ctx.request.post(BASE + '/api/auth', { data: { action: 'signup', email: em, password: 'longpassword1', name: 'Pia Planner' } });
  await page.goto(BASE + '/login.html'); await page.fill('form[data-member=login] input[name=email]', em); await page.fill('form[data-member=login] input[name=password]', 'longpassword1');
  await Promise.all([page.waitForURL('**/members.html'), page.click('form[data-member=login] button[type=submit]')]);
  await page.goto(BASE + '/plan.html'); await page.waitForSelector('.bd-new');
  const sels = page.locator('.bd-new select');
  await sels.nth(3).selectOption('growth'); await sels.nth(4).selectOption('20');
  await page.click('text=Make my week'); await page.waitForSelector('.gp-step');
  log(await page.locator('.gp-step').count() === 6, 'week plan has six days');
  log(/20 min/.test(await page.locator('.gp-step').first().innerText()), 'steps are sized to the minutes chosen');
  log(/Rest/.test(await page.locator('.gp-step').nth(5).innerText()) && !/min\)/.test(await page.locator('.gp-step').nth(5).innerText()), 'last day is rest, no minutes');
  await page.click('text=Put these on my board'); await page.waitForSelector('text=Done. 6 notes are on your board.');
  await page.goto(BASE + '/board.html'); await page.waitForSelector('.bd-note');
  log(await page.locator('.bd-note:has-text("Monday: Aim (20 min)")').count() === 1, 'notes appear on My board');
  await page.goto(BASE + '/plan.html'); await page.waitForSelector('.bd-new');
  log(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'no sideways scroll at 390px');
  log(errors.length === 0, 'no script or security errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
