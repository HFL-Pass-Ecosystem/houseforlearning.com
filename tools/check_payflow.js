#!/usr/bin/env node
/* Pay-flow check (test pay-to-access). Headless browser, a sample of pages from each course family.
   For every page, at 1280 px and 390 px:
     1. signed out: the bar says "Sign in to join", modules (or lessons after the first) are locked
     2. signed in (cookie hfl_in=1) before paying: "Join this course", still locked
     3. after the test payment on pay.html: nothing locked or hidden, "0 of N done"
     4. after one tick: Members > My courses shows "1 of N"
     5. no horizontal overflow, no page errors
   Run:  npm i --no-save playwright && npx playwright install chromium && node tools/check_payflow.js
   Options: --per-family N (default 4)   --widths 1280,390   --family school,cpd   --pages a.html,b.html
   Exit code 1 if any page fails. Needs no secrets and sends nothing anywhere: it serves site/ on a local port. */
const http = require('http'), fs = require('fs'), path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.error('playwright is not installed. Run: npm i --no-save playwright && npx playwright install chromium'); process.exit(2); }
const SITE = path.join(__dirname, '..', 'site');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? process.argv[i + 1] : d; };
const PER = +arg('per-family', 4), WIDTHS = arg('widths', '1280,390').split(',').map(Number), ONLY = arg('family', ''), PAGES = arg('pages', '');
const all = fs.readdirSync(SITE).filter(f => f.endsWith('.html')).sort();
const FAMILIES = {
  school: f => /^school-/.test(f),
  cpd: f => /^cpd-/.test(f) && fs.readFileSync(path.join(SITE, f), 'utf8').includes('details class="mod"'),
  'gl-flagship': f => /^learn-flagship-gl-\d+\.html$/.test(f),
  'place-edition': f => /^learn-loc-(hk|ge|ky|mx)-\d\d\.html$/.test(f) || /^learn-deep-(hk|ge|ky|mx)-/.test(f) || /^learn-flagship-loc-/.test(f),
  executive: f => /^executive-module-/.test(f),
  'electrical-lessons': f => /^electrical-/.test(f) && f !== 'electrical-academy.html',
  'career-launch-lessons': f => /^career-launch-lesson-/.test(f),
};
const spread = (l, n) => l.length <= n ? l : Array.from({ length: n }, (_, i) => l[Math.round(i * (l.length - 1) / (n - 1))]);
let picks = [];
if (PAGES) picks = PAGES.split(',').map(f => ['custom', f]);
else for (const k in FAMILIES) { if (ONLY && !ONLY.split(',').includes(k)) continue; const l = all.filter(FAMILIES[k]); if (!l.length) console.warn('no pages found for family ' + k); spread(l, PER).forEach(f => picks.push([k, f])); }
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = http.createServer((q, r) => { const p = path.join(SITE, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html')); if (!p.startsWith(SITE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); });
(async () => {
  await new Promise(res => server.listen(0, '127.0.0.1', res));
  const U = 'http://127.0.0.1:' + server.address().port + '/';
  const b = await chromium.launch(); let bad = 0, n = 0;
  for (const [fam, f] of picks) for (const W of WIDTHS) {
    const iss = [], errs = []; n++;
    const vp = { width: W, height: W < 500 ? 844 : 900 };
    try {
      let c = await b.newContext({ viewport: vp }), p = await c.newPage(); p.on('pageerror', e => errs.push(e.message));
      await p.goto(U + f); let t = await p.locator('.acc-bar').first().innerText({ timeout: 8000 });
      if (!/Sign in to join/i.test(t)) iss.push('signed-out bar: ' + t.slice(0, 50));
      const lesson1 = await p.locator('main[data-series][data-lesson="1"]').count(); // lesson 1 of a series is the free preview
      if (!lesson1 && !(await p.locator('.acc-locked, .acc-hidden').count())) iss.push('nothing locked signed out'); await c.close();
      c = await b.newContext({ viewport: vp }); await c.addCookies([{ name: 'hfl_in', value: '1', url: U }]); p = await c.newPage(); p.on('pageerror', e => errs.push(e.message));
      await p.goto(U + f); t = await p.locator('.acc-bar').first().innerText();
      if (!/Join this course/i.test(t)) iss.push('signed-in bar: ' + t.slice(0, 50));
      await p.locator('.acc-bar a.btn').click(); await p.waitForURL(/pay\.html/);
      await p.getByRole('button', { name: /I have paid \(test\)/ }).click(); await p.waitForURL(/\.html/, { timeout: 8000 });
      await p.goto(U + f); t = await p.locator('.acc-bar .acc-t').innerText();
      if (!/(^|\. )0 of \d+ done/.test(t) && !/^0 of \d+ done/.test(t)) iss.push('paid bar: ' + t.slice(0, 50));
      if (await p.locator('.acc-locked, .acc-hidden').count()) iss.push('still locked or hidden after pay');
      await p.locator('.acc-done input').first().check();
      await p.goto(U + 'members-courses.html'); const mc = await p.locator('main').innerText(); if (!/1 of \d+/.test(mc)) iss.push('My courses: ' + mc.slice(0, 60));
      await p.goto(U + f); if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)) iss.push('horizontal overflow');
      await c.close();
    } catch (e) { iss.push('exception: ' + e.message.split('\n')[0]); }
    const all_ = iss.concat(errs); if (all_.length) bad++;
    console.log((all_.length ? 'FAIL ' : 'ok   ') + fam.padEnd(22) + String(W).padEnd(5) + f + (all_.length ? '  ' + JSON.stringify(all_) : ''));
  }
  await b.close(); server.close();
  console.log(`\n${n - bad} of ${n} checks passed` + (bad ? `, ${bad} failed` : ''));
  process.exit(bad ? 1 : 0);
})();
