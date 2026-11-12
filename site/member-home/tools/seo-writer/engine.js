/* Auto SEO Blog Writer engine. Demo mode: no network, no API keys, dummy data only. */
(function (root) {
  var SITES = {
    hfl: { name: 'HFL', tone: 'warm, practical, learner first', who: 'learners and trainers' },
    member: { name: 'Member site', tone: 'friendly and simple', who: 'your customers' }
  };
  var MODS = ['beginner guide to', 'what is', 'best practices for', 'checklist for', 'common mistakes in', 'simple tips for', 'examples of', 'free tools for', 'step by step guide to', 'how to learn'];

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function cap(s) { return s.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function words(t) { return (t.toLowerCase().match(/[a-z0-9']+/g) || []); }

  function ideaKeywords(seed) {
    seed = (seed || '').trim().toLowerCase();
    if (!seed) return [];
    return MODS.map(function (m, i) {
      var phrase = m + ' ' + seed;
      var h = hash(phrase);
      var volume = 50 + (h % 4950);
      var difficulty = 5 + ((h >>> 8) % 76);
      var intent = /free|best/.test(m) ? 'Compare' : 'Learn';
      return { phrase: phrase, volume: volume, difficulty: difficulty, intent: intent,
               score: Math.round(volume * (100 - difficulty) / 100) };
    }).sort(function (a, b) { return b.score - a.score; });
  }

  function planCalendar(keywords, startISO, perDay) {
    perDay = perDay || 1;
    var d = new Date(startISO + 'T00:00:00Z');
    return keywords.map(function (k, i) {
      var day = new Date(d.getTime() + Math.floor(i / perDay) * 86400000);
      return { date: day.toISOString().slice(0, 10), keyword: k.phrase, status: 'planned' };
    });
  }

  function draftPost(keyword, siteKey) {
    var site = SITES[siteKey] || SITES.member;
    var kw = keyword.trim();
    var K = cap(kw);
    var title = K + ': A Simple Guide';
    var meta = 'Learn ' + kw + ' in plain steps. A short, practical guide from ' + site.name + ' for ' + site.who + ', with a checklist you can use today.';
    var body = [
      '# ' + title, '',
      'DEMO DRAFT. Dummy text for testing only. A live version would be written by the approved AI worker and checked by a person.', '',
      'If you want to understand ' + kw + ', start here. This guide keeps every step short and clear. It is written for ' + site.who + ' who want practical help, not long theory.', '',
      '## Why this topic matters', '',
      'People search for this because they want a clear next step. A good answer saves time. It also builds trust, because readers come back to sites that help them. When a guide is simple, more people finish it and use what they learned.', '',
      '## Five steps to begin', '',
      '- Write down your goal in one sentence.',
      '- List what you already know.',
      '- Pick one small task and finish it today.',
      '- Ask a trainer or a friend to review your work.',
      '- Repeat the task each week and note what improves.', '',
      '## Common mistakes to avoid', '',
      'Many beginners try to do everything at once. Start small. Keep notes. Do not copy another site word for word, because readers and search engines both prefer original help. Share what you tried and what you learned. Real examples make a page more useful than a list of rules.', '',
      '## How to measure progress', '',
      'Pick one number to track each week. It could be the tasks you finished or the hours you practised. Write it in a notebook. After a month, look back and see what changed. Small, steady gains are easier to keep than big changes that fade.', '',
      '## A short checklist', '',
      '- I know my goal.',
      '- I have one task for today.',
      '- I have a person to ask for help.',
      '- I wrote down my weekly number.', '',
      '## Next steps', '',
      'Read more on our [learning pages](/learn) and try the first task today. Most people see progress within a few weeks.'
    ].join('\n');
    return { keyword: kw, site: siteKey, title: title, meta: meta, slug: slug(kw), body: body, status: 'draft', demo: true };
  }

  function seoScore(p) {
    var text = p.body || '', kw = (p.keyword || '').toLowerCase();
    var w = words(text), n = w.length;
    var first100 = w.slice(0, 120).join(' ');
    var plain = text.toLowerCase();
    var count = kw ? (plain.split(kw).length - 1) : 0;
    var density = n ? (count * kw.split(' ').length / n) * 100 : 0;
    var sentences = text.replace(/[#\-\[\]()]/g, ' ').split(/[.!?]+/).map(function (s) { return words(s).length; }).filter(Boolean);
    var avg = sentences.length ? sentences.reduce(function (a, b) { return a + b; }, 0) / sentences.length : 0;
    var h2 = (text.match(/^## /gm) || []).length;
    var t = p.title || '', m = p.meta || '';
    var checks = [
      { id: 'title-len', label: 'Title is 30 to 60 characters', ok: t.length >= 30 && t.length <= 60, w: 12, fix: 'Now ' + t.length + ' characters.' },
      { id: 'title-kw', label: 'Title has the keyword', ok: !!kw && t.toLowerCase().indexOf(kw) > -1, w: 14, fix: 'Put the keyword in the title.' },
      { id: 'meta-len', label: 'Meta description is 120 to 160 characters', ok: m.length >= 120 && m.length <= 160, w: 10, fix: 'Now ' + m.length + ' characters.' },
      { id: 'meta-kw', label: 'Meta description has the keyword', ok: !!kw && m.toLowerCase().indexOf(kw) > -1, w: 8, fix: 'Add the keyword.' },
      { id: 'first', label: 'Keyword appears in the first 100 words', ok: !!kw && first100.indexOf(kw) > -1, w: 12, fix: 'Mention it early.' },
      { id: 'h2', label: 'At least 3 section headings', ok: h2 >= 3, w: 10, fix: 'Found ' + h2 + '.' },
      { id: 'len', label: 'At least 250 words', ok: n >= 250, w: 10, fix: 'Now ' + n + ' words.' },
      { id: 'dens', label: 'Keyword used 0.5% to 4% of the time', ok: density >= 0.5 && density <= 4, w: 8, fix: 'Now ' + density.toFixed(1) + '%.' },
      { id: 'link', label: 'Has a link to another page of the site', ok: /\]\(\/[^)]*\)/.test(text), w: 8, fix: 'Add an internal link.' },
      { id: 'read', label: 'Short sentences (under 20 words on average)', ok: avg > 0 && avg <= 20, w: 8, fix: 'Now ' + avg.toFixed(0) + ' words.' }
    ];
    var total = checks.reduce(function (a, c) { return a + c.w; }, 0);
    var got = checks.reduce(function (a, c) { return a + (c.ok ? c.w : 0); }, 0);
    return { score: Math.round(got * 100 / total), checks: checks, words: n };
  }

  var GUARANTEE = /(guarantee[d]?\s+(page\s*1|rank|#?1)|#1 on google|rank #1|first page of google)/i;
  var MONEY = /(\$|usd|inr|aed|cad|₹|€|£)\s?\d|\d\s?(usd|inr|aed|cad|dollars|rupees|dirhams)/i;
  function rulesCheck(text, blocklist) {
    var out = [];
    if (GUARANTEE.test(text)) out.push('Promises a search ranking. No one can promise that.');
    if (MONEY.test(text)) out.push('Shows a price. Public pages say "price on request".');
    (blocklist || []).forEach(function (b) {
      b = b.trim().toLowerCase();
      if (b && text.toLowerCase().indexOf(b) > -1) out.push('Contains blocked word: ' + b);
    });
    return out;
  }

  var RATES = { keyword: 1, article: 10 };
  function credits(keywords, articles) {
    var base = keywords * RATES.keyword + articles * RATES.article;
    var admin = Math.round(base * 0.2 * 100) / 100;
    return { base: base, admin: admin, total: Math.round((base + admin) * 100) / 100 };
  }

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toHtml(md) {
    var lines = md.split('\n'), out = [], list = false;
    function inline(s) { return esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'); }
    lines.forEach(function (l) {
      var li = /^- (.*)/.exec(l);
      if (li) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + inline(li[1]) + '</li>'); return; }
      if (list) { out.push('</ul>'); list = false; }
      if (/^## /.test(l)) out.push('<h2>' + inline(l.slice(3)) + '</h2>');
      else if (/^# /.test(l)) out.push('<h1>' + inline(l.slice(2)) + '</h1>');
      else if (l.trim()) out.push('<p>' + inline(l) + '</p>');
    });
    if (list) out.push('</ul>');
    return out.join('\n');
  }

  /* Live AI worker hook. Stays off until it is approved with a spend cap. */
  var providers = {
    demo: function (kw, site) { return Promise.resolve(draftPost(kw, site)); },
    aiWriter: function () { return Promise.reject(new Error('The AI writer is switched off until it is approved with a spend cap.')); }
  };

  var api = { SITES: SITES, ideaKeywords: ideaKeywords, planCalendar: planCalendar, draftPost: draftPost,
              seoScore: seoScore, rulesCheck: rulesCheck, credits: credits, toHtml: toHtml, providers: providers, RATES: RATES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SeoEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
