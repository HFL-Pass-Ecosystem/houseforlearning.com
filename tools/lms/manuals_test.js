#!/usr/bin/env node
/* Click test: Manuals library (manuals.html). Open to everyone, filter by audience, open a manual, real-screen links, print, phone width.
   Run:  node tools/lms/dev-server.mjs 8899 &   then   node tools/lms/manuals_test.js [http://localhost:8899] */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8899';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
(async () => {
  const browser = await chromium.launch(); const errors = [];
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  page.on('pageerror', e => errors.push('pageerror ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console ' + m.text().slice(0, 120)); });
  await page.goto(`${BASE}/manuals.html`); await page.waitForSelector('.mn-item');
  const all = await page.locator('.mn-item').count();
  log(all >= 12, `signed out: library opens with ${all} manuals`);
  log(/Showing \d+ manuals/.test(await page.locator('#lms-box .note').first().innerText()), 'count line shows how many');
  await page.click('.mn-filter button:has-text("Authors")'); const au = await page.locator('.mn-item').count();
  log(au > 0 && au < all && await page.locator('.mn-who', { hasText: 'Learners' }).count() === 0, `Authors filter: ${au} manuals, no learner manuals`);
  log((await page.locator('.mn-filter button[aria-pressed=true]').innerText()).toLowerCase() === 'authors', 'pressed button is marked for screen readers');
  await page.click('.mn-filter button:has-text("All")');
  await page.locator('.mn-item summary').first().click();
  log(await page.locator('.mn-item[open] .mn-steps li').count() >= 3, 'a manual opens with numbered steps');
  // every "Open this screen" points at a page that exists in site/
  const hrefs = await page.locator('.mn-item a.btn').evaluateAll(as => as.map(a => a.getAttribute('href')));
  const missing = hrefs.filter(h => !fs.existsSync(path.join(__dirname, '..', '..', 'site', h)));
  log(hrefs.length === all && missing.length === 0, 'every manual links to a real screen' + (missing.length ? ': missing ' + missing.join(', ') : ''));
  await page.goto(`${BASE}/manuals.html#manual-4`); await page.waitForSelector('#manual-4[open]');
  log(/final check/i.test(await page.locator('#manual-4 summary').innerText()), 'a link to #manual-4 opens that manual');
  await page.emulateMedia({ media: 'print' }); log(await page.locator('.mn-filter').isHidden(), 'print: filter buttons are hidden'); await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 390, height: 800 }); await page.waitForTimeout(300);
  log(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), '390px: no sideways scroll');
  const bad = errors.filter(e => !/favicon|Failed to load resource/.test(e));
  log(bad.length === 0, 'no script errors or CSP violations' + (bad.length ? ': ' + bad.slice(0, 3).join(' | ') : ''));
  await browser.close(); console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
