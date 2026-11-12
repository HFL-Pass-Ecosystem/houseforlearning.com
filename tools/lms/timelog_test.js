#!/usr/bin/env node
/* Click test: My learning time (timelog.html, assets/time-log.js). Kept in this browser only (localStorage hfl_time).
   Run:  node tools/lms/dev-server.mjs 8903 &   then   node tools/lms/timelog_test.js [http://localhost:8903] */
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8903';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const pad = (n) => (n < 10 ? '0' : '') + n;
const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const T0 = new Date(); const TODAY = ymd(T0);
const YEST = ymd(new Date(T0.getFullYear(), T0.getMonth(), T0.getDate() - 1));
const TOMORROW = ymd(new Date(T0.getFullYear(), T0.getMonth(), T0.getDate() + 1));
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TODAY_NAME = DAYS[(T0.getDay() + 6) % 7];
const MONDAY = T0.getDay() === 1; // then yesterday falls in last week
(async () => {
  const browser = await chromium.launch(); const errors = [];
  const watch = (p) => { p.on('pageerror', e => errors.push('pageerror ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console ' + m.text().slice(0, 80)); }); };
  // 1 signed out
  const out = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const op = await out.newPage(); watch(op);
  await op.goto(`${BASE}/timelog.html`); await op.waitForFunction(() => !/Loading\./.test(document.getElementById('lms-box').textContent));
  log(/Sign in first\./.test(await op.locator('#lms-box').innerText()) && await op.locator('#lms-box a[href="login.html?next=timelog.html"]').count() === 1, 'signed out: asks to sign in, link back to this page');
  await out.close();
  // signed in (test mode)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addCookies([{ name: 'hfl_in', value: '1', url: BASE }]);
  const page = await ctx.newPage(); watch(page);
  await page.goto(`${BASE}/timelog.html`); await page.waitForSelector('#lms-box form.tl-form');
  const box = page.locator('#lms-box');
  const txt = () => box.innerText();
  const todayRow = page.locator(`li.tl-dayrow[data-day="${TODAY}"]`);
  const total = () => page.locator('.tl-total').innerText();
  const msg = () => page.locator('.tl-form .tl-msg').innerText();
  log((await txt()).split('Kept in this browser only.').length === 2, 'says "Kept in this browser only." once');
  log(await page.inputValue('input[name=date]') === TODAY && await page.getAttribute('input[name=date]', 'max') === TODAY, 'date defaults to today, max is today');
  log(await page.locator('li.tl-dayrow').count() === 7, 'week shows 7 days');
  log(/Something else/.test(await page.locator('select[name=course]').innerText()), 'course list offers "Something else"');
  // 2 add 30 today
  await page.fill('input[name=minutes]', '30'); await page.fill('input[name=what]', 'Read unit 1'); await page.click('.tl-form button[type=submit]');
  await page.waitForSelector('.tl-total');
  log(new RegExp(`${TODAY_NAME}: 30 minutes`).test(await todayRow.locator('.acc-sr').innerText()), `today's row reads "${TODAY_NAME}: 30 minutes"`);
  log(await todayRow.locator('.tl-fill').getAttribute('data-w') === '100', "today's bar is full width (data-w 100)");
  log(/This week: 30 of 150 minutes \(20%\)/.test(await total()), 'week total: 30 of 150 minutes (20%)');
  // 3 add 20 more
  await page.fill('input[name=minutes]', '20'); await page.click('.tl-form button[type=submit]');
  log(/This week: 50 of 150 minutes \(33%\)/.test(await total()) && /: 50 minutes/.test(await todayRow.locator('.acc-sr').innerText()), 'adding 20 more today: 50 minutes');
  log(await page.locator('.tl-prog span').getAttribute('data-w') === '33' && await page.locator('.tl-prog').getAttribute('aria-valuenow') === '50', 'progress bar: data-w 33, aria-valuenow 50');
  // 4 future date refused
  await page.fill('input[name=date]', TOMORROW); await page.fill('input[name=minutes]', '15'); await page.click('.tl-form button[type=submit]');
  log(/in the future/.test(await msg()) && /This week: 50 of/.test(await total()), 'future date refused with a message');
  await page.fill('input[name=date]', TODAY);
  // 5 minutes 0 and 700 refused
  for (const v of ['0', '700']) {
    await page.fill('input[name=minutes]', v); await page.click('.tl-form button[type=submit]');
    log(/1 to 600/.test(await msg()) && /This week: 50 of/.test(await total()), `minutes ${v} refused with a message`);
  }
  // 6 goal change
  await page.fill('input[name=goal]', '10'); await page.click('.tl-goal button[type=submit]');
  log(/30 to 3000/.test(await page.locator('.tl-goal .tl-msg').innerText()), 'goal 10 refused');
  await page.fill('input[name=goal]', '60'); await page.click('.tl-goal button[type=submit]');
  log(/This week: 50 of 60 minutes \(83%\)/.test(await total()) && await page.locator('.tl-met').count() === 0, 'goal 60: 83%, no goal-met line yet');
  await page.fill('input[name=minutes]', '10'); await page.click('.tl-form button[type=submit]');
  log(/This week: 60 of 60 minutes \(100%\)/.test(await total()) && /met your goal/.test(await page.locator('.tl-met').innerText()), 'at 60 of 60: 100% and goal-met line shows');
  // 7 streak
  log(/Streak: 1 day in a row/.test(await txt()), 'streak 1 with today only');
  await page.fill('input[name=date]', YEST); await page.fill('input[name=minutes]', '25'); await page.click('.tl-form button[type=submit]');
  log(/Streak: 2 days in a row/.test(await txt()), 'streak 2 after adding yesterday');
  if (!MONDAY) log(/This week: 85 of 60 minutes/.test(await total()), 'yesterday counts in this week');
  const rows4 = await page.locator('.tl-table tbody tr').count(); log(rows4 === 4, 'last 4 weeks table has 4 rows');
  log(/yes/.test(await page.locator('.tl-table tbody tr').first().innerText()), 'this week marked goal met: yes');
  // 8 remove + undo
  await todayRow.locator('button.tl-rm').click();
  log(/: 0 minutes/.test(await todayRow.locator('.acc-sr').innerText()) && /Removed/.test(await page.locator('.tl-undo').innerText()), 'Remove clears today and offers Undo');
  await page.click('.tl-undo-btn');
  log(/: 60 minutes/.test(await todayRow.locator('.acc-sr').innerText()), 'Undo puts today back (60 minutes)');
  await todayRow.locator('button.tl-rm').click(); await page.waitForTimeout(5400);
  log(await page.locator('.tl-undo-btn').count() === 0 && /: 0 minutes/.test(await todayRow.locator('.acc-sr').innerText()), 'Undo goes after 5 seconds, removal stays');
  await page.fill('input[name=date]', TODAY); await page.fill('input[name=minutes]', '60'); await page.click('.tl-form button[type=submit]');
  // 9 reload keeps data
  await page.reload(); await page.waitForSelector('.tl-total');
  log(/: 60 minutes/.test(await todayRow.locator('.acc-sr').innerText()) && await page.inputValue('input[name=goal]') === '60' && /Streak: 2 days/.test(await txt()), 'after reload: minutes, goal and streak kept');
  const st = JSON.parse(await page.evaluate(() => localStorage.getItem('hfl_time')));
  log(st.goal === 60 && st.days[TODAY].m === 60 && st.days[YEST].m === 25, 'stored as hfl_time {goal, days}');
  log(await page.evaluate(() => !document.querySelector('#lms-box [style]') || Array.prototype.every.call(document.querySelectorAll('#lms-box [style]'), (e) => e.hasAttribute('data-w'))), 'no style attributes except bar widths set from data-w');
  // 10 phone width
  const m = await browser.newContext({ viewport: { width: 390, height: 800 } }); await m.addCookies([{ name: 'hfl_in', value: '1', url: BASE }]);
  const mp = await m.newPage(); watch(mp); await mp.goto(`${BASE}/timelog.html`);
  await mp.evaluate((s) => localStorage.setItem('hfl_time', s), JSON.stringify(st)); await mp.reload(); await mp.waitForSelector('.tl-total');
  log(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), '390px: no sideways scroll');
  const bad = errors.filter(e => !/favicon|Failed to load resource/.test(e));
  log(bad.length === 0, 'no script errors or CSP violations' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));
  await page.screenshot({ path: process.env.SHOT || '/tmp/timelog.png', fullPage: true });
  await browser.close(); console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
