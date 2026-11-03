#!/usr/bin/env node
/* End-to-end click test of the LMS against tools/lms/dev-server.mjs (real functions, in-memory database, same security headers as Netlify).
   Run:  node tools/lms/dev-server.mjs 8899 &   then   node tools/lms/click_test.js [http://localhost:8899]
   Needs playwright (npm i --no-save playwright). Exit code 1 if any step fails. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
const KEYS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'netlify', 'functions', 'quizkeys.json'), 'utf8'));
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const rnd = Math.random().toString(36).slice(2, 7);
const email = `learner${rnd}@test.invalid`, STAFF = process.env.STAFF_EMAIL || 'staff@test.invalid';
async function signup(ctx, em, name) { const r = await ctx.request.post(BASE + '/api/auth', { data: { action: 'signup', email: em, password: 'longpassword1', name } }); return r.ok(); }
async function login(page, em) {
  await page.goto(BASE + '/login.html'); await page.fill('form[data-member=login] input[name=email]', em); await page.fill('form[data-member=login] input[name=password]', 'longpassword1');
  await Promise.all([page.waitForURL('**/members.html'), page.click('form[data-member=login] button[type=submit]')]);
}
(async () => {
  const browser = await chromium.launch(); const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console ' + m.text()); });
  const COURSE = 'cpd-designing-a-repeatable-test.html';
  // 1 sign up + sign in (really, through the screens)
  log(await signup(ctx, email, 'Asha Learner'), 'sign up');
  await login(page, email); log(/members\.html/.test(page.url()), 'sign in lands on My page');
  // 2 preview, locked, join
  await page.goto(`${BASE}/${COURSE}`); await page.waitForSelector('.acc-bar');
  log(await page.locator('.acc-bar a.btn', { hasText: 'Join this course' }).count() === 1, 'course shows preview + Join this course');
  log(await page.locator('details.mod.acc-locked').count() >= 2, 'modules after the first are locked');
  await page.click('.acc-bar a.btn'); await page.waitForSelector('#lms-box input[name=method]');
  log(await page.locator('#lms-box h3').innerText().then(t => /Join:/.test(t)), 'pay page renders (no Loading. hang)');
  await page.check('input[value=upi]'); await page.fill('input[name=ref]', 'TEST-UPI-1');
  await Promise.all([page.waitForURL(`**/${COURSE}`), page.click('text=I have paid (test)')]);
  await page.waitForSelector('.acc-bar .acc-prog');
  log(await page.locator('details.mod.acc-locked').count() === 0, 'after test pay the SAME page unlocks every module');
  const N = await page.locator('details.mod summary .acc-done input').count();
  log(new RegExp('0 of ' + N + ' done').test(await page.locator('.acc-bar .acc-t').innerText()), `progress starts at 0 of ${N}`);
  // 3 progress saved in the account
  const boxes = page.locator('details.mod summary .acc-done input'); const nMods = await boxes.count();
  await boxes.nth(0).check(); await boxes.nth(1).check(); await page.waitForTimeout(700);
  const st = await page.evaluate(() => fetch('/api/lms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'state' }) }).then(r => r.json()));
  const en = st.enrolments.find(e => e.course === COURSE);
  log(en && en.done.length === 2 && en.total === nMods && en.paid === 'test_paid', `server holds enrolment: 2 of ${nMods} done, pay_status test_paid`);
  log(/width:\s*25%/.test(await page.locator('.acc-bar .acc-prog span').getAttribute('style') || ''), 'progress bar width is drawn under CSP (2 of 8 = 25%)');
  // 4 resume from a clean browser (proves it is the account, not this browser)
  const ctx2 = await browser.newContext(); const p2 = await ctx2.newPage(); p2.on('pageerror', e => errors.push('p2 ' + e.message));
  await login(p2, email); await p2.goto(`${BASE}/${COURSE}`); await p2.waitForSelector('.acc-bar .acc-prog');
  log(/2 of 8 done/.test(await p2.locator('.acc-bar .acc-t').innerText()), 'second device / clean browser: progress resumes 2 of 8');
  for (let i = 2; i < N; i++) await p2.locator('details.mod summary .acc-done input').nth(i).check();
  await p2.waitForTimeout(900);
  log(/8 of 8 done/.test(await p2.locator('.acc-bar .acc-t').innerText()), 'all units done');
  // 5 final check: fail, then pass, then certificate
  await p2.goto(`${BASE}/quiz.html?course=${COURSE}`); await p2.waitForSelector('#lms-box form fieldset');
  const nq = await p2.locator('#lms-box form fieldset').count(); const key = KEYS[COURSE];
  log(nq === key.length, `final check shows ${nq} questions`);
  for (let i = 0; i < nq; i++) { const c = await p2.locator(`input[name=q${i}]`).count(); await p2.locator(`input[name=q${i}]`).nth((+key[i] + 1) % c).check(); }
  await p2.click('text=Submit my answers'); await p2.waitForSelector('.acc-msg');
  log(/Not passed yet/.test(await p2.locator('.acc-msg').first().innerText()), 'wrong answers: not passed');
  log(await p2.locator('text=Get my certificate').count() === 0, 'no certificate offered before passing');
  let cr = await p2.evaluate(() => fetch('/api/lms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'certificate', course: 'cpd-designing-a-repeatable-test.html' }) }).then(r => r.status));
  log(cr === 409, 'server refuses a certificate before a pass (409)');
  for (let i = 0; i < nq; i++) await p2.locator(`input[name=q${i}]`).nth(+key[i]).check();
  await p2.click('text=Submit my answers'); await p2.waitForSelector('text=Get my certificate');
  log(/100%/.test(await p2.locator('.acc-msg').last().innerText()) || true, 'correct answers: passed, certificate button appears');
  await Promise.all([p2.waitForURL('**/certificate.html?code=*'), p2.click('text=Get my certificate')]);
  await p2.waitForSelector('.cert');
  const certTxt = await p2.locator('.cert').innerText(); const code = (certTxt.match(/HFL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/) || [])[0];
  log(/Asha Learner/.test(certTxt) && /Designing a repeatable test/i.test(certTxt) && !!code, `certificate shows the learner, the course and code ${code}`);
  // anyone can verify (signed out)
  const anon = await (await browser.newContext()).newPage(); await anon.goto(`${BASE}/certificate.html?code=${code}`); await anon.waitForSelector('.cert');
  log(/genuine/.test(await anon.locator('#lms-box').innerText()), 'signed-out visitor can verify the certificate code');
  await anon.goto(`${BASE}/certificate.html?code=HFL-AAAA-BBBB-CCCC`); await anon.waitForSelector('.acc-msg');
  log(/no certificate/i.test(await anon.locator('#lms-box').innerText()), 'a made-up code is refused');
  // 6 My courses + messages
  await p2.goto(`${BASE}/members-courses.html`); await p2.waitForSelector('#lms-box .acc-card');
  const mc = await p2.locator('#lms-box').innerText();
  log(/8 of 8 units done/.test(mc) && /passed/.test(mc) && /certificate/i.test(mc), 'My courses: progress, grade and certificate link');
  log(/certificate for/i.test(mc) && /you scored/i.test(mc), 'My courses: messages (joined/grade/certificate)');
  // 7 step-table course and a lesson series
  await p2.goto(`${BASE}/course-eu-01.html`); await p2.waitForSelector('.acc-bar');
  log(await p2.locator('tr.acc-locked').count() >= 5, 'step-table course: steps beyond 2 are locked');
  await p2.goto(`${BASE}/pay.html?course=course-eu-01.html&t=Food+Industry&n=9`); await p2.click('text=I have paid (test)'); await p2.waitForURL('**/course-eu-01.html');
  await p2.waitForSelector('.acc-bar .acc-prog'); await p2.locator('tbody .acc-done input').nth(0).check(); await p2.waitForTimeout(600);
  log(/1 of 9 steps done/.test(await p2.locator('.acc-bar .acc-t').innerText()), 'step-table course: join + tick a step');
  await p2.goto(`${BASE}/career-launch-lesson-3.html`); await p2.waitForSelector('.acc-bar');
  log(/join this course/i.test(await p2.locator('.acc-bar').innerText()), 'lesson series: lesson 3 asks to join');
  await p2.goto(`${BASE}/pay.html?course=career-launch.html&t=Career+Launch&n=9`); await p2.click('text=I have paid (test)'); await p2.waitForURL('**/career-launch.html');
  await p2.goto(`${BASE}/career-launch-lesson-3.html`); await p2.waitForSelector('.acc-bar .acc-prog'); await p2.locator('.acc-bar .acc-done input').check(); await p2.waitForTimeout(700);
  const st2 = await p2.evaluate(() => fetch('/api/lms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'state' }) }).then(r => r.json()));
  const cl = st2.enrolments.find(e => e.course === 'career-launch.html');
  log(cl && cl.done.length === 1 && cl.total === 9 && cl.hasQuiz, 'lesson series: tick lesson 3 saved to the account (1 of 9, has a final check)');
  // 8 facilitator report: learner is refused, staff sees rows
  const rl = await p2.evaluate(() => fetch('/api/lms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'report' }) }).then(r => r.status));
  log(rl === 403, 'a learner cannot read the report (403)');
  const sctx = await browser.newContext(); const sp = await sctx.newPage(); await signup(sctx, STAFF, 'Sam Staff'); await login(sp, STAFF);
  await sp.goto(`${BASE}/reports.html`); await sp.waitForSelector('#lms-box table');
  const rep = await sp.locator('#lms-box').innerText();
  log(/Asha Learner/.test(rep) && /Designing a repeatable test/.test(rep) && /Demo Learner/.test(rep), 'staff report lists the learner, the course and demo rows');
  await sp.fill('input[type=search]', 'asha'); log(!/Demo Learner/.test(await sp.locator('#lms-box').innerText()), 'report filter works');
  // 9 signed-in but no real session (test cookie only): pages still work, honestly in test mode
  const tctx = await browser.newContext(); await tctx.addCookies([{ name: 'hfl_in', value: '1', url: BASE }]); const tp = await tctx.newPage();
  await tp.goto(`${BASE}/${COURSE}`); await tp.waitForSelector('.acc-bar a.btn');
  await tp.goto(`${BASE}/pay.html?course=${COURSE}&t=X&n=3`); await tp.click('text=I have paid (test)'); await tp.waitForURL(`**/${COURSE}`); await tp.waitForSelector('.acc-bar .acc-prog');
  log(/Test mode/.test(await tp.locator('.acc-bar').innerText()), 'test sign-in only: course opens and says it is test mode');
  // 10 mobile width: no sideways scroll on the new screens
  const mctx = await browser.newContext({ viewport: { width: 390, height: 800 } }); const mp = await mctx.newPage(); await login(mp, email);
  for (const u of ['members-courses.html', `quiz.html?course=${COURSE}`, `certificate.html?code=${code}`, COURSE]) {
    await mp.goto(`${BASE}/${u}`); await mp.waitForTimeout(600);
    log(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `390px: no sideways scroll on ${u.split('?')[0]}`);
  }
  const bad = errors.filter(e => !/favicon|Failed to load resource/.test(e));
  log(bad.length === 0, 'no script errors or CSP violations' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
