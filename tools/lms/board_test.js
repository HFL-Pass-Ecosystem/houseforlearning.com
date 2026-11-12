#!/usr/bin/env node
/* Click test of My board. Run: node tools/lms/dev-server.mjs 8899 &  then  node tools/lms/board_test.js */
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const rnd = Math.random().toString(36).slice(2, 7), STAFF = process.env.STAFF_EMAIL || 'staff@test.invalid';
async function who(browser, em, name, errors) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }), page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/40[134]/.test(m.text())) errors.push(m.text()); });
  await ctx.request.post(BASE + '/api/auth', { data: { action: 'signup', email: em, password: 'longpassword1', name } });
  await page.goto(BASE + '/login.html'); await page.fill('form[data-member=login] input[name=email]', em); await page.fill('form[data-member=login] input[name=password]', 'longpassword1');
  await Promise.all([page.waitForURL('**/members.html'), page.click('form[data-member=login] button[type=submit]')]); return page;
}
const api = (page, b) => page.evaluate((x) => fetch('/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(x) }).then(async r => ({ s: r.status, ...(await r.json().catch(() => ({}))) })), b);
(async () => {
  const browser = await chromium.launch(), errors = [];
  const le = await who(browser, `bl${rnd}@test.invalid`, 'Bela Learner', errors), l2 = await who(browser, `b2${rnd}@test.invalid`, 'Ben Other', errors), tr = await who(browser, STAFF, 'Tina Trainer', errors);
  await le.goto(BASE + '/board.html'); await le.waitForSelector('.bd-note');
  log(await le.locator('.bd-note[data-kind=auto]').count() === 1, 'every member gets a board with today\'s automatic note');
  log(await le.locator('.bd-staff').count() === 0, 'learner does not see the trainer panel');
  await le.fill('.bd-new textarea', 'Revise the flashcards'); await le.fill('.bd-new input[type=date]', '2026-12-01'); await le.selectOption('.bd-new select', 'green');
  await le.click('text=Stick it on my board'); await le.waitForSelector('.bd-note:has-text("Revise the flashcards")');
  log(await le.locator('.bd-green:has-text("Due 2026-12-01")').count() === 1, 'own note with due date and colour');
  await le.reload(); await le.waitForSelector('.bd-note:has-text("Revise the flashcards")');
  log(await le.locator('.bd-note[data-kind=auto]').count() === 1, 'note kept after reload; still one automatic note per day');
  await le.click('.bd-note:has-text("Revise") >> text=Done'); await le.waitForSelector('h3:has-text("Done")');
  log(await le.locator('.bd-done:has-text("Revise")').count() === 1, 'note can be marked done');
  await le.click('.bd-note:has-text("Revise") >> text=Remove'); await le.waitForTimeout(500);
  log(await le.locator('.bd-note:has-text("Revise")').count() === 0, 'note can be removed');
  log((await api(le, { action: 'assign', to: 'all', body: 'x' })).s === 403, 'learner cannot pin notes on other boards');
  // trainer pins one note on one board and one on all boards
  await tr.goto(BASE + '/board.html'); await tr.waitForSelector('.bd-staff');
  await tr.fill('.bd-staff label:has-text("Member email") input', `bl${rnd}@test.invalid`); await tr.fill('.bd-staff label:has-text("Note") textarea', 'Please finish module 2 this week'); await tr.fill('.bd-staff label:has-text("Page link") input', 'learn.html');
  await tr.click('text=Send the note'); await tr.waitForTimeout(800);
  await tr.waitForSelector('text=Sent to 1 board');
  await le.reload(); await le.waitForSelector('.bd-note[data-kind=assigned]');
  log(/finish module 2/.test(await le.locator('.bd-note[data-kind=assigned]').innerText()), 'trainer note appears on that member\'s board');
  await l2.goto(BASE + '/board.html'); await l2.waitForSelector('.bd-note');
  log(await l2.locator('.bd-note[data-kind=assigned]').count() === 0, 'other members are not affected');
  log((await api(tr, { action: 'assign', to: 'all', body: 'Welcome to the new term' })).sent >= 3, 'trainer can pin a note on every board');
  await l2.reload(); await l2.waitForSelector('.bd-note[data-kind=assigned]');
  log(true, 'note for all boards arrives');
  log((await api(le, { action: 'add', body: 'x', link: 'https://evil.example/x' })).s === 200 && !(await api(le, { action: 'list' })).notes.some(n => n.link.includes('evil')), 'outside links are dropped');
  const mp = await (await browser.newContext({ viewport: { width: 390, height: 800 } })).newPage(); await mp.goto(BASE + '/login.html');
  log(errors.length === 0, 'no script or security errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
