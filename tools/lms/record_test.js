#!/usr/bin/env node
/* Click test: My learning record (record.html, assets/learning-record.js).
   Signed out asks to sign in; test mode (browser only) shows both courses with practice labels; server mode after a real sign in,
   join and two ticks shows "2 of 8"; CSV download; 390px; no script errors or CSP violations.
   Run:  node tools/lms/dev-server.mjs 8902 &   then   node tools/lms/record_test.js [http://localhost:8902] */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8902';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const rnd = Math.random().toString(36).slice(2, 7);
const email = `record${rnd}@test.invalid`;
const COURSE = 'cpd-designing-a-repeatable-test.html';
/* the lead appends tools/lms/record.css to assets/courses.css; until then, serve it appended here so layout checks are real */
const RCSS = fs.readFileSync(path.join(__dirname, 'record.css'), 'utf8');
async function withCss(ctx) {
  await ctx.route('**/assets/courses.css', async (route) => {
    const r = await route.fetch(); const body = await r.text();
    await route.fulfill({ response: r, body: body.includes('.lr-head') ? body : body + '\n' + RCSS });
  });
}
async function signup(ctx, em, name) { const r = await ctx.request.post(BASE + '/api/auth', { data: { action: 'signup', email: em, password: 'longpassword1', name } }); return r.ok(); }
async function login(page, em) {
  await page.goto(BASE + '/login.html'); await page.fill('form[data-member=login] input[name=email]', em); await page.fill('form[data-member=login] input[name=password]', 'longpassword1');
  await Promise.all([page.waitForURL('**/members.html'), page.click('form[data-member=login] button[type=submit]')]);
}
(async () => {
  const browser = await chromium.launch(); const errors = [];
  const watch = (p, tag) => { p.on('pageerror', e => errors.push(tag + ' pageerror ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push(tag + ' console ' + p.url().split('/').pop() + ' ' + m.text().slice(0, 80)); }); };

  // 1 signed out
  const octx = await browser.newContext(); await withCss(octx); const op = await octx.newPage(); watch(op, 'out');
  await op.goto(`${BASE}/record.html`); await op.waitForSelector('#lms-box a');
  const ot = await op.locator('#lms-box').innerText();
  log(/Sign in first/.test(ot), 'signed out: asks to sign in');
  log(await op.locator('#lms-box a[href="login.html?next=record.html"]').count() === 1, 'signed out: Sign in link comes back to the record');

  // 2 test mode: cookie only, two courses in this browser
  const now = Date.now();
  const data = {
    'course-eu-01.html': { paid: true, title: 'Food industry basics', total: 9, done: [0, 1, 2], paidAt: now - 86400000, updated: now - 3600000 },
    [COURSE]: { paid: true, title: 'Designing a repeatable test', total: 8, done: [0, 1, 2, 3, 4, 5, 6, 7], practice: { pct: 100, passed: true }, paidAt: now - 5 * 86400000, updated: now - 5 * 86400000 },
    'not-paid.html': { paid: false, title: 'Not joined', total: 3, done: [] }
  };
  const tctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true }); await withCss(tctx);
  await tctx.addCookies([{ name: 'hfl_in', value: '1', url: BASE }]);
  const tp = await tctx.newPage(); watch(tp, 'test');
  await tp.goto(`${BASE}/login.html`); await tp.evaluate((s) => localStorage.setItem('hfl_access', s), JSON.stringify(data));
  await tp.goto(`${BASE}/record.html`); await tp.waitForSelector('#lms-box table');
  const tt = await tp.locator('#lms-box').innerText();
  log(/Test mode: this record is kept in this browser only/.test(tt), 'test mode: says the record is kept in this browser only');
  log(/^Member$/m.test(await tp.locator('.lr-name').innerText()) && /Printed \d{1,2} \w+ \d{4}/.test(tt), 'test mode: header shows Member and the date printed');
  log(await tp.locator('#lms-box caption').innerText() === 'Learning record', 'table caption is "Learning record"');
  const rows = tp.locator('#lms-box tbody tr'); log(await rows.count() === 2, 'test mode: two rows (unpaid course left out)');
  const sum = tp.locator('.lr-sum');
  const sa = await sum.evaluate(e => [e.dataset.courses, e.dataset.completed, e.dataset.passed, e.dataset.certs].join(','));
  log(sa === '2,1,1,1' && /2 courses joined, 1 completed, 1 final check passed \(practice\), 1 practice certificate/.test(await sum.innerText()), 'test mode: summary 2 joined, 1 completed, 1 passed, 1 certificate');
  const r0 = await rows.nth(0).innerText(), r1 = await rows.nth(1).innerText();
  log(/Designing a repeatable test/.test(r0) && /8 of 8 units/.test(r0), 'completed course sorts first (even though older)');
  log(/100%, passed \(practice\)/.test(r0) && /\bpractice\s*$/.test(r0.trim()), 'test mode: final check and certificate labelled practice');
  log(/Food industry basics/.test(r1) && /3 of 9 units/.test(r1) && /not taken/.test(r1), 'second course: 3 of 9 units, final check not taken');
  log(await tp.locator('#lms-box button', { hasText: 'Print or save' }).count() === 1, 'Print or save button is there');
  // CSV
  const [dl] = await Promise.all([tp.waitForEvent('download'), tp.click('text=Download as a spreadsheet (CSV)')]);
  const csvPath = await dl.path(); const csv = fs.readFileSync(csvPath, 'utf8');
  log(dl.suggestedFilename() === 'my-learning-record.csv', 'CSV download is named my-learning-record.csv');
  log(/"Designing a repeatable test"/.test(csv) && /"Food industry basics"/.test(csv) && csv.trim().split(/\r?\n/).length === 3, 'CSV holds a header and both course titles');
  // quotes escaped
  data['course-eu-01.html'].title = 'Say "hello" =1';
  await tp.evaluate((s) => localStorage.setItem('hfl_access', s), JSON.stringify(data)); await tp.reload(); await tp.waitForSelector('#lms-box table');
  const [dl2] = await Promise.all([tp.waitForEvent('download'), tp.click('text=Download as a spreadsheet (CSV)')]);
  const csv2 = fs.readFileSync(await dl2.path(), 'utf8');
  log(csv2.includes('"Say ""hello"" =1"'), 'CSV escapes quotes');
  // empty
  await tp.evaluate(() => localStorage.setItem('hfl_access', '{}')); await tp.reload(); await tp.waitForSelector('#lms-box a[href="find.html"]');
  log(/not joined a course yet/.test(await tp.locator('#lms-box').innerText()), 'no courses: says so and links to Find a course');

  // 3 server mode: real sign up + sign in, join, tick 2 units
  const sctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true }); await withCss(sctx);
  const sp = await sctx.newPage(); watch(sp, 'server');
  log(await signup(sctx, email, 'Rhea Record'), 'sign up');
  await login(sp, email); log(/members\.html/.test(sp.url()), 'sign in through the real screens');
  await sp.goto(`${BASE}/pay.html?course=${COURSE}&t=Designing+a+repeatable+test&n=8`); await sp.waitForSelector('text=I have paid (test)');
  await Promise.all([sp.waitForURL(`**/${COURSE}`), sp.click('text=I have paid (test)')]); await sp.waitForSelector('.acc-bar .acc-prog');
  const boxes = sp.locator('details.mod summary .acc-done input'); await boxes.nth(0).check(); await boxes.nth(1).check(); await sp.waitForTimeout(800);
  await sp.goto(`${BASE}/record.html`); await sp.waitForSelector('#lms-box table');
  const st = await sp.locator('#lms-box').innerText();
  log(!/Test mode/.test(st) && /Rhea Record/.test(await sp.locator('.lr-name').innerText()) && new RegExp(email).test(st), 'server mode: name and email in the header, no test-mode note');
  const srow = await sp.locator('#lms-box tbody tr').first().innerText();
  log(/Designing a repeatable test/.test(srow) && /2 of 8 units/.test(srow), 'server mode: record shows "2 of 8"');
  log(/not taken/.test(srow) && /-\s*$/.test(srow.trim()), 'server mode: final check not taken, no certificate yet');
  log(/1 course joined, 0 completed, 0 final checks passed, 0 certificates/.test(await sp.locator('.lr-sum').innerText()), 'server mode: summary numbers');
  const [sdl] = await Promise.all([sp.waitForEvent('download'), sp.click('text=Download as a spreadsheet (CSV)')]);
  const scsv = fs.readFileSync(await sdl.path(), 'utf8');
  log(sdl.suggestedFilename() === 'my-learning-record.csv' && /Designing a repeatable test/.test(scsv) && /"2","8"/.test(scsv), 'server mode: CSV named right, holds the title and 2 of 8');

  // 4 phone width
  const mctx = await browser.newContext({ viewport: { width: 390, height: 800 } }); await withCss(mctx);
  await mctx.addCookies([{ name: 'hfl_in', value: '1', url: BASE }]);
  const mp = await mctx.newPage(); watch(mp, 'phone');
  await mp.goto(`${BASE}/login.html`); data['course-eu-01.html'].title = 'Food industry basics';
  await mp.evaluate((s) => localStorage.setItem('hfl_access', s), JSON.stringify(data));
  await mp.goto(`${BASE}/record.html`); await mp.waitForSelector('#lms-box table');
  log(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), '390px: no sideways scroll (table scrolls inside its box)');
  await mp.screenshot({ path: process.env.SHOT || '/tmp/record-390.png', fullPage: true });

  const bad = errors.filter(e => !/favicon|Failed to load resource/.test(e));
  log(bad.length === 0, 'no script errors or CSP violations' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
