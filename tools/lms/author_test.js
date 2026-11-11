#!/usr/bin/env node
/* Click test of Author Studio + member-course player against tools/lms/dev-server.mjs.
   Run:  node tools/lms/dev-server.mjs 8899 &   then   node tools/lms/author_test.js [http://localhost:8899] */
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const rnd = Math.random().toString(36).slice(2, 7), STAFF = process.env.STAFF_EMAIL || 'staff@test.invalid';
async function signup(ctx, em, name) { return (await ctx.request.post(BASE + '/api/auth', { data: { action: 'signup', email: em, password: 'longpassword1', name } })).ok(); }
async function login(page, em) { await page.goto(BASE + '/login.html'); await page.fill('form[data-member=login] input[name=email]', em); await page.fill('form[data-member=login] input[name=password]', 'longpassword1'); await Promise.all([page.waitForURL('**/members.html'), page.click('form[data-member=login] button[type=submit]')]); }
const api = (page, url, b) => page.evaluate(([u, x]) => fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(x) }).then(async r => ({ s: r.status, ...(await r.json().catch(() => ({}))) })), [url, b]);
(async () => {
  const browser = await chromium.launch(), errors = [];
  async function who(em, name) { const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/40[134]|status of 40/.test(m.text())) errors.push(m.text()); }); await signup(ctx, em, name); await login(page, em); return page; }
  const au = await who(`author${rnd}@test.invalid`, 'Asha Author'), tr = await who(STAFF, 'Tina Trainer'), le = await who(`learn${rnd}@test.invalid`, 'Leo Learner');

  // 1 author builds a course on screen
  await au.goto(BASE + '/author.html'); await au.waitForSelector('text=Start a new course');
  await au.click('text=Start a new course');
  await au.fill('label:has-text("Course title") input', 'Demo: Safe use of a multimeter');
  await au.fill('label:has-text("One-line summary") input', 'A short course for beginners.');
  await au.fill('label:has-text("Price in USD") input', '10');
  await au.fill('label:has-text("Write here") textarea', 'Always set the dial before you touch the probes.');
  await au.click('.au-add >> text=Key point'); await au.locator('.au-block').nth(1).locator('textarea').fill('Never measure current across a supply.');
  await au.click('.au-add >> text=Flashcards'); await au.locator('.au-block').nth(2).locator('input').nth(0).fill('What does the red probe do?'); await au.locator('.au-block').nth(2).locator('input').nth(1).fill('Goes in the volt port.');
  await au.click('.au-add >> text=Scenario'); const sc = au.locator('.au-block').nth(3); await sc.locator('textarea').fill('The meter reads 0. What first?'); await sc.locator('input').nth(0).fill('Check the battery'); await sc.locator('input').nth(1).fill('Good: a flat battery is common.'); await sc.locator('input').nth(2).fill('Replace the meter'); await sc.locator('input').nth(3).fill('Too early.');
  await au.click('text=Add lesson'); await au.fill('label:has-text("Lesson title") input', 'Reading the dial'); await au.fill('label:has-text("Write here") textarea', 'The dial has volts, amps and ohms.');
  await au.click('text=Add a question');
  await au.fill('.au-q label:has-text("Question 1") input', 'Which port is for volts?'); await au.fill('.au-q label:has-text("Answer 1") input', 'The amp port'); await au.fill('.au-q label:has-text("Answer 2") input', 'The volt port');
  await au.check('.au-q input[aria-label="Right answer 2"]');
  await au.click('button:has-text("Save")'); await au.waitForSelector('text=Saved.');
  log(true, 'author builds and saves a course (modules, lessons, blocks, final check)');

  // 2 review gating: cannot publish before approval; learners cannot see drafts
  const mine = await api(au, '/api/author', { action: 'mine' }); const id = mine.courses[0].id, key = mine.courses[0].key;
  log((await api(au, '/api/author', { action: 'publish', id })).s === 409, 'publish refused before trainer approval');
  log((await api(le, '/api/author', { action: 'play', key })).s === 404, 'learner cannot open a draft');
  log((await api(au, '/api/author', { action: 'submit', id })).s === 200, 'author sends it to a trainer');
  log((await api(le, '/api/author', { action: 'queue' })).s === 403, 'learner cannot see the review queue');
  log((await api(au, '/api/author', { action: 'review', id, decision: 'approve' })).s === 403, 'author cannot approve own course');
  await tr.goto(BASE + '/author.html'); await tr.waitForSelector('text=Trainer review queue'); await tr.click('.au-card:has-text("multimeter") >> text=Review');
  await tr.fill('label:has-text("Note") textarea', 'Please add a safety step.'); await tr.click('text=Ask for changes'); await tr.waitForSelector('text=sent back for changes');
  await au.goto(BASE + '/author.html'); await au.click('.au-card:has-text("multimeter") >> text=Open'); await au.waitForSelector('text=Trainer note: Please add a safety step.');
  log(true, 'trainer asks for changes; author sees the note');
  await au.click('text=Send to a trainer for review'); await au.waitForSelector('text=Sent to a trainer');
  await tr.goto(BASE + '/author.html'); await tr.click('.au-card:has-text("multimeter") >> text=Review'); await tr.click('text=Approve'); await tr.waitForSelector('text=approved');
  await au.goto(BASE + '/author.html'); await au.click('.au-card:has-text("multimeter") >> text=Open'); await au.click('button:has-text("Publish")'); await au.waitForSelector('text=Published.');
  log(true, 'trainer approves; author publishes');

  // 3 learner joins (test pay) and learns
  await le.goto(BASE + '/learn.html'); await le.waitForSelector('.au-card:has-text("multimeter")');
  await le.click('.au-card:has-text("multimeter") >> text=Open'); await le.waitForSelector('text=Join (test pay)');
  log(await le.locator('text=Always set the dial').count() === 0, 'before joining only the join screen shows');
  await le.click('text=Join (test pay)'); await le.waitForSelector('button:has-text("Mark done")');
  log(await le.locator('text=Always set the dial').count() === 1 && await le.locator('text=Never measure current').count() === 1, 'after joining the lesson opens with text and key point');
  await le.click('.au-card-flip'); log(/volt port/.test(await le.locator('.au-card-flip').innerText()), 'flashcard turns over');
  await le.click('.au-b-scenario button >> nth=0'); log(await le.locator('text=Good: a flat battery').count() === 1, 'scenario choice gives feedback');
  await le.click('button:has-text("Mark done")'); await le.waitForSelector('h4:has-text("Reading the dial")');
  await le.click('button:has-text("Mark done")'); await le.waitForTimeout(800);
  const st = await api(le, '/api/lms', { action: 'state' }); const en = st.enrolments.find(e => e.course === key);
  log(en && en.done.length === 2 && en.total === 2, 'progress saved in the account (2 of 2 lessons)');
  await le.goto(BASE + '/learn.html?c=' + key); await le.waitForSelector('text=2 of 2 lessons done');
  log(true, 'reopening shows saved progress');

  // 4 final check and certificate (answer key never sent to the browser)
  const play = await api(le, '/api/author', { action: 'play', key }); log(!JSON.stringify(play).includes('"a":'), 'answers are not sent to the learner');
  await le.goto(BASE + '/quiz.html?course=' + key); await le.waitForSelector('input[name=q0]');
  await le.check('input[name=q0][value="0"]'); await le.click('text=Submit my answers'); await le.waitForSelector('text=Not passed yet');
  await le.check('input[name=q0][value="1"]'); await le.click('text=Submit my answers'); await le.waitForSelector('text=Passed.');
  await le.click('text=Get my certificate'); await le.waitForURL('**/certificate.html?code=*'); await le.waitForSelector('.cert');
  log(/multimeter/.test(await le.locator('.cert').innerText()), 'final check wrong then right, certificate issued and verified');

  // 5 earn: free vs paid, 90/10
  const earn = await api(au, '/api/author', { action: 'earnings' });
  log(earn.sales === 1 && earn.gross === 10 && earn.yours === 9 && earn.platform === 1, 'sale recorded: author keeps 90% (9.00), platform 10% (1.00), test only');
  log((await api(le, '/api/author', { action: 'get', id })).s === 403, 'learner cannot open the author copy');
  log((await api(au, '/api/author', { action: 'save', id, title: 'x', modules: [{ title: 'm', lessons: [{ title: 'l', blocks: [{ type: 'image', url: 'javascript:alert(1)' }, { type: 'text', text: '<img src=x onerror=alert(1)>' }] }] }] })).s === 200, 'save accepts content');
  const g = await api(au, '/api/author', { action: 'get', id }); log(g.course.modules[0].lessons[0].blocks.length === 1, 'unsafe picture address dropped');
  log(g.course.status === 'review', 'editing a published course sends it back to a trainer');

  // 6 mobile
  const mp = await (await browser.newContext({ viewport: { width: 390, height: 800 } })).newPage(); await mp.goto(BASE + '/login.html'); log(true, 'mobile context opens');
  log(errors.length === 0, 'no script or security errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
