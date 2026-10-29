/* "Interested in going deeper?" Our own short click path: one side button, three small steps, one-click return.
   Journey tracker: pages visited with dates, kept in this browser only. Stored for good only after the visitor accepts the choices banner; otherwise for this tab only. The visitor can view, download or wipe it at any time. No outside calls. */
(function () {
  var HFL = !!document.querySelector('a[href$="products-and-services.html"]');
  var P = HFL ? 'hfl' : 'ahfl';
  var base = (function () { var s = document.currentScript || document.querySelector('script[src*="deeper.js"]'); var src = s ? s.getAttribute('src') : 'assets/deeper.js'; return src.replace(/assets\/deeper\.js.*$/, ''); })();
  var T = HFL ? {
    learn: [['about.html', 'About us', 'Who we are and what we stand for.'], ['social-phygital-enterprise.html', 'The social-phygital enterprise', 'Three layers: platform, content, marketplace.'], ['business-model.html', 'Business model', 'Order, delivery, service, and what it costs.'], ['business-opportunity.html', 'Business opportunity', 'How you can earn with us.'], ['roadmap.html', 'Roadmap', 'What comes next.'], ['b2b-solutions.html', 'B2B solutions', 'For organisations.'], ['trade.html', 'Trade', 'Buy and sell inside the marketplace.']],
    sectors: [['products-and-services.html#mk-h', 'Choose your sectors', 'Pick sectors and see Hardware, Software, Cloud, Data and Analytics side by side.'], ['school/index.html', 'School courses', 'Ready course packages.'], ['lifecycle-services.html', 'Lifecycle services', 'Support from first order to long-term service.']],
    join: [['signin.html', 'Log in or sign up', 'Membership is $5 a year.'], ['partner-with-us.html', 'Partner with us', 'Work with us as a partner.'], ['value-provider-journey.html', 'Value provider journey', 'Step by step for providers.'], ['partner-journey.html', 'Partner journey', 'Step by step for partners.']],
    pay: [['business-model.html', 'What it costs', 'Membership, then only what you use.'], ['get-app.html', 'Get the app', 'On your phone or computer.'], ['terms.html', 'Terms and conditions', 'The rules, in plain words.']],
    talk: [['contact.html', 'Contact us', 'Write to us.'], ['team-chat.html', 'Team chat', 'Talk with the team.'], ['data-protection.html', 'Data protection', 'Your rights and our promises.']]
  } : {
    learn: [['about.html', 'About us', 'Who we are.'], ['group.html', 'The group', 'Our companies and how they fit.'], ['business-model.html', 'Business model', 'How we work with you.'], ['roadmap.html', 'Roadmap', 'What comes next.'], ['insights.html', 'Insights', 'What we are learning.'], ['faq.html', 'Questions and answers', 'Quick answers.']],
    sectors: [['sectors.html', 'Sectors', 'Where we work.'], ['products.html', 'Products and services', 'Choose sectors and see Hardware, Software, Cloud, Data and Analytics side by side.'], ['programmes.html', 'Programmes', 'Ready programmes.']],
    join: [['join.html', 'Join', 'Start here.'], ['membership.html', 'Membership', 'What you get.'], ['partners.html', 'Partners', 'Work with us.'], ['signin.html', 'Sign in', 'For members.']],
    pay: [['payments.html', 'Payments', 'Bank transfer and UPI, with a reference number.'], ['membership.html', 'Membership', 'Plans and cost.'], ['faq.html', 'Questions and answers', 'Quick answers.']],
    talk: [['contact.html', 'Contact us', 'Write to us.'], ['help.html', 'Help', 'Get help.'], ['meetings.html', 'Meetings', 'Meet the team.']]
  };
  var ASK = [['learn', 'Learn more', 'Understand this and what is nearby.'], ['sectors', 'Choose my sectors', 'See what is on offer for my field.'], ['join', 'Join or sign in', 'Become a member or partner.'], ['pay', 'See costs or pay', 'Plain prices, our own pay page.'], ['talk', 'Talk to someone', 'Write to us or get help.']];
  var JK = P + '-journey', CK = HFL ? 'hfl-cookie-choice' : 'ahfl-cookie-choice';
  function cur() { var f = location.pathname.replace(/^.*\/(?=[^/]*$)/, '') || 'index.html'; return f; }
  function title() { var h = document.querySelector('h1'); return (h ? h.textContent : document.title).replace(/\s+/g, ' ').trim().slice(0, 90); }
  function keep() { var v = null; try { v = localStorage.getItem(CK); } catch (e) {} return v === 'accepted' || v === 'all'; }
  function store() { return keep() ? localStorage : sessionStorage; }
  function load() { var a = []; try { a = JSON.parse(store().getItem(JK) || '[]'); } catch (e) {} if (!Array.isArray(a)) a = []; return a; }
  function save(a) { try { store().setItem(JK, JSON.stringify(a)); } catch (e) {} }
  function record() { var a = load(), f = cur(), last = a[a.length - 1]; if (last && last.p === f && Date.now() - last.t < 3000) return; a.push({ p: f, n: title(), t: Date.now() }); save(a); }
  record();

  var css = '.dp-tab{position:fixed;right:0;top:45%;z-index:60;writing-mode:vertical-rl;background:#0F85DB;color:#fff;border:0;border-radius:10px 0 0 10px;padding:14px 9px;font:600 14px Montserrat,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.2)}.dp-tab:focus-visible{outline:3px solid #111;outline-offset:2px}' +
    '.dg-ov{position:fixed;inset:0;z-index:80;background:rgba(17,17,17,.55);display:flex;align-items:center;justify-content:center;padding:16px}.dg-ov[hidden]{display:none}' +
    '.dg-box{background:#F2EEE2;color:#111;border-radius:16px;max-width:720px;width:100%;max-height:90vh;overflow:auto;padding:22px;font-family:Montserrat,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.35)}.dg-box h2{margin:0 0 4px;font-size:22px}.dg-box p{margin:0 0 12px;font-size:14px}' +
    '.dg-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.dg-bar button,.dg-go{font:600 14px Montserrat,system-ui,sans-serif;border:1px solid #0F85DB;background:#fff;color:#0F85DB;border-radius:999px;padding:8px 14px;cursor:pointer;text-decoration:none;display:inline-block}.dg-bar .dg-home{background:#0F85DB;color:#fff}' +
    '.dg-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:10px}.dg-list li{margin:0}.dg-card{display:block;width:100%;height:100%;text-align:left;background:#fff;border:1px solid #D8D2C0;border-radius:12px;padding:14px;color:#111;text-decoration:none;font:inherit;cursor:pointer}.dg-card:hover,.dg-card:focus-visible{border-color:#0F85DB;outline:2px solid #0F85DB}.dg-card b{display:block;font-size:15px;margin-bottom:4px}.dg-card span{font-size:13px;color:#333}' +
    '.dg-trail{font-size:13px;margin:0 0 12px;color:#333}.dg-j{margin:0;padding:0;list-style:none;font-size:13px}.dg-j h3{font-size:14px;margin:12px 0 4px}.dg-j li{padding:3px 0;border-top:1px solid #D8D2C0}.dg-j a{color:#0F85DB}@media(max-width:600px){.dp-tab{padding:10px 7px;font-size:13px}.dg-box{padding:16px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ov = document.createElement('div'); ov.className = 'dg-ov'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'dg-h');
  var box = document.createElement('div'); box.className = 'dg-box'; ov.appendChild(box); document.body.appendChild(ov);
  var tab = document.createElement('button'); tab.type = 'button'; tab.className = 'dp-tab'; tab.textContent = 'Interested in going deeper?'; document.body.appendChild(tab);
  var origin = null, stack = [];
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; }
  function close() { ov.hidden = true; document.body.style.overflow = ''; if (origin) { window.scrollTo(0, origin.y); if (origin.f && origin.f.focus) origin.f.focus(); } }
  function bar(canBack) {
    var b = el('div', 'dg-bar'), h = el('button', 'dg-home', 'Back to where you started'); h.type = 'button'; h.addEventListener('click', close); b.appendChild(h);
    if (canBack) { var s = el('button', '', 'One step back'); s.type = 'button'; s.addEventListener('click', function () { stack.pop(); var f = stack.pop(); f(); }); b.appendChild(s); }
    var j = el('button', '', 'My journey'); j.type = 'button'; j.addEventListener('click', function () { show(viewJourney); }); b.appendChild(j);
    return b;
  }
  function show(fn) { stack.push(fn); box.textContent = ''; fn(); box.scrollTop = 0; var h = box.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } }
  function viewStart() {
    box.appendChild(bar(false)); var h = el('h2', '', 'What would you like to do?'); h.id = 'dg-h'; box.appendChild(h);
    box.appendChild(el('p', '', 'You are on: ' + title() + '. Choose one, and you are never more than two clicks from where you started.'));
    var ul = el('ul', 'dg-list'); ASK.forEach(function (a) { var li = el('li'), c = el('button', 'dg-card'); c.type = 'button'; c.appendChild(el('b', '', a[1])); c.appendChild(el('span', '', a[2])); c.addEventListener('click', function () { show(function () { viewAsk(a); }); }); li.appendChild(c); ul.appendChild(li); }); box.appendChild(ul);
  }
  function viewAsk(a) {
    box.appendChild(bar(true)); var h = el('h2', '', a[1]); h.id = 'dg-h'; box.appendChild(h); box.appendChild(el('p', '', 'Choose where to go. Your way back is always at the top.'));
    var ul = el('ul', 'dg-list'), here = cur();
    T[a[0]].filter(function (d) { return d[0].split('#')[0] !== here; }).slice(0, 5).forEach(function (d) { var li = el('li'), c = el('a', 'dg-card'); c.href = base + d[0]; c.appendChild(el('b', '', d[1])); c.appendChild(el('span', '', d[2])); li.appendChild(c); ul.appendChild(li); });
    box.appendChild(ul);
  }
  function fmt(t) { return new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  function viewJourney() {
    box.appendChild(bar(stack.length > 1)); var h = el('h2', '', 'My journey'); h.id = 'dg-h'; box.appendChild(h);
    box.appendChild(el('p', 'dg-trail', keep() ? 'Kept in this browser, by date, until you wipe it. It is yours.' : 'Kept for this tab only. Accept the choices banner to keep it from day to day.'));
    var a = load().slice().reverse(), ul = el('ul', 'dg-j'), day = '';
    if (!a.length) ul.appendChild(el('li', '', 'Nothing yet.'));
    a.forEach(function (r) { var d = new Date(r.t).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); if (d !== day) { day = d; ul.appendChild(el('h3', '', d)); } var li = el('li'), l = el('a', '', r.n); l.href = base + r.p; li.appendChild(l); li.appendChild(document.createTextNode(' ' + new Date(r.t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }))); ul.appendChild(li); });
    box.appendChild(ul);
    var b = el('div', 'dg-bar'), x = el('button', '', 'Download my journey'), w = el('button', '', 'Wipe my journey'); x.type = w.type = 'button';
    x.addEventListener('click', function () { var u = URL.createObjectURL(new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' })), l = document.createElement('a'); l.href = u; l.download = 'my-journey.json'; l.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000); });
    w.addEventListener('click', function () { try { localStorage.removeItem(JK); sessionStorage.removeItem(JK); } catch (e) {} stack.pop(); show(viewJourney); });
    b.appendChild(x); b.appendChild(w); box.appendChild(b);
  }
  tab.addEventListener('click', function () { origin = { y: window.scrollY, f: tab }; stack = []; ov.hidden = false; document.body.style.overflow = 'hidden'; show(viewStart); });
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) close(); });
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a.dg-card'); if (a) record(); });
})();
