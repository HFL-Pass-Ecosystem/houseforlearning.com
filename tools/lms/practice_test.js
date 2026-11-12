#!/usr/bin/env node
/* Click test: the whole course journey works BEFORE the member database is switched on (test mode, browser only):
   join (test pay) -> tick every unit -> final check marked by the server (answers stay on the server) -> practice certificate.
   Run:  node tools/lms/dev-server.mjs 8899 &   then   node tools/lms/practice_test.js [http://localhost:8899] */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
const KEYS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'netlify', 'functions', 'quizkeys.json'), 'utf8'));
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const COURSE = 'cpd-designing-a-repeatable-test.html';
(async () => {
  const browser = await chromium.launch(); const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addCookies([{ name: 'hfl_in', value: '1', url: BASE }]); // signed in on this browser, but no database session: test mode
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console ' + page.url().split('/').pop() + ' ' + m.text().slice(0, 60)); });
  const api = (body) => page.evaluate((b) => fetch('/api/lms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json().then(j => ({ s: r.status, j }))), body);
  await page.goto(`${BASE}/login.html`); // (the home page has its own, older inline-style warning; not part of this test)
  // server side of practice marking
  const key = KEYS[COURSE];
  let r = await api({ action: 'practice', course: COURSE, answers: key.split('').map(Number) });
  log(r.s === 200 && r.j.pct === 100 && r.j.passed && r.j.practice, 'practice marking: all right = 100%, passed, no sign-in needed');
  log(!('key' in r.j) && !JSON.stringify(r.j).includes(key) || key.length < 3, 'practice marking does not send the answer key');
  r = await api({ action: 'practice', course: 'no-such-course.html', answers: [] }); log(r.s === 404, 'practice marking: unknown course refused (404)');
  r = await api({ action: 'quiz', course: COURSE, answers: [] }); log(r.s === 401, 'real final check still needs a member session (401)');
  // 1 before joining
  await page.goto(`${BASE}/quiz.html?course=${COURSE}`); await page.waitForSelector('#lms-box .acc-msg');
  log(/Join this course first/.test(await page.locator('#lms-box').innerText()), 'final check before joining asks to join');
  // 2 join with the test payment, tick every unit
  await page.goto(`${BASE}/pay.html?course=${COURSE}&t=Designing+a+repeatable+test&n=8`); await page.waitForSelector('text=I have paid (test)');
  await Promise.all([page.waitForURL(`**/${COURSE}`), page.click('text=I have paid (test)')]); await page.waitForSelector('.acc-bar .acc-prog');
  const boxes = page.locator('details.mod summary .acc-done input'); const N = await boxes.count();
  for (let i = 0; i < N; i++) await boxes.nth(i).check();
  log(new RegExp(`${N} of ${N} done`).test(await page.locator('.acc-bar .acc-t').innerText()), `all ${N} units ticked`);
  await Promise.all([page.waitForURL('**/quiz.html?course=*'), page.click('.acc-bar a.acc-link:has-text("Take the final check")')]);
  // 3 the final check opens in practice mode
  await page.waitForSelector('#lms-box form fieldset');
  const box = page.locator('#lms-box');
  log(/Practice mode/.test(await box.innerText()), 'final check opens and says Practice mode');
  const nq = await page.locator('#lms-box form fieldset').count(); log(nq === key.length, `${nq} questions shown`);
  await page.click('text=Submit my answers'); log(/Please answer all/.test(await box.innerText()), 'blank answers are caught');
  for (let i = 0; i < nq; i++) { const c = await page.locator(`input[name=q${i}]`).count(); await page.locator(`input[name=q${i}]`).nth((+key[i] + 1) % c).check(); }
  await page.click('text=Submit my answers'); await page.waitForSelector('text=Not passed yet');
  log(await page.locator('.practice-cert').count() === 0, 'wrong answers: not passed, no certificate');
  log(await page.locator('fieldset.acc-wrong').count() === nq, 'every wrong question is marked');
  for (let i = 0; i < nq; i++) await page.locator(`input[name=q${i}]`).nth(+key[i]).check();
  await page.click('text=Submit my answers'); await page.waitForSelector('.practice-cert');
  const cert = await page.locator('.practice-cert').innerText();
  log(/Practice certificate/.test(cert) && /Designing a repeatable test/i.test(cert) && /100%/.test(cert), 'right answers: passed, practice certificate with course and score');
  // 4 reload keeps the result in this browser
  await page.reload(); await page.waitForSelector('#lms-box form');
  log(/best so far: 100% \(passed\)/.test(await box.innerText()) && await page.locator('.practice-cert').count() === 1, 'after reload: best score and certificate still there');
  // 4b My courses shows the practice result and the next step
  await page.goto(`${BASE}/members-courses.html`); await page.waitForSelector('#lms-box .acc-card');
  const mc = await page.locator('#lms-box').innerText();
  log(/best 100% \(passed\)/.test(mc) && /Practice certificate earned/.test(mc), 'My courses: practice score and "certificate earned"');
  log(await page.locator('#lms-box a', { hasText: 'Certificate' }).count() === 1, 'My courses: Certificate button opens the check page');
  // 5 phone width
  const m = await browser.newContext({ viewport: { width: 390, height: 800 } }); await m.addCookies([{ name: 'hfl_in', value: '1', url: BASE }]);
  const mp = await m.newPage(); await mp.goto(`${BASE}/index.html`);
  await mp.evaluate((s) => localStorage.setItem('hfl_access', s), await page.evaluate(() => localStorage.getItem('hfl_access')));
  await mp.goto(`${BASE}/quiz.html?course=${COURSE}`); await mp.waitForSelector('.practice-cert');
  log(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), '390px: no sideways scroll on the final check');
  const bad = errors.filter(e => !/favicon|Failed to load resource/.test(e));
  log(bad.length === 0, 'no script errors or CSP violations' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));
  await page.screenshot({ path: process.env.SHOT || '/tmp/practice.png', fullPage: false });
  await browser.close(); console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
