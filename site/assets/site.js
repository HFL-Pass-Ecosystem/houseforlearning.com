/* Mobile menu, cookie banner, offline contact form and the in-page quiz.
   No trackers, no outside calls. The cookie choice is the only thing stored, in this browser. */
(function () {
  var KEY = 'hfl-cookie-choice';
  function closeMenu() {
    var t = document.querySelector('[data-menu-toggle][aria-expanded="true"]');
    if (!t) return null;
    t.setAttribute('aria-expanded', 'false');
    var nav = document.getElementById(t.getAttribute('aria-controls'));
    if (nav) nav.classList.remove('open');
    return t;
  }
  // Back / Forward in the trail bar: history when the visitor came from this site (or moved inside the preview), else Home.
  document.addEventListener('click', function (e) {
    var h = e.target.closest ? e.target.closest('[data-hist]') : null;
    if (!h) return;
    if (h.getAttribute('data-hist') === 'forward') { e.preventDefault(); history.forward(); return; }
    var inside = (document.referrer && document.referrer.indexOf(location.origin) === 0) || location.hash.indexOf('#/') === 0;
    if (inside && history.length > 1) { e.preventDefault(); history.back(); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-menu-toggle]') : null;
    if (t) {
      var nav = document.getElementById(t.getAttribute('aria-controls'));
      var open = t.getAttribute('aria-expanded') !== 'true';
      t.setAttribute('aria-expanded', String(open));
      if (nav) nav.classList.toggle('open', open);
      // keep the whole open menu on screen, whatever the header height (the menu scrolls inside)
      if (nav && open) nav.style.maxHeight = Math.max(200, window.innerHeight - nav.getBoundingClientRect().top) + 'px';
      return;
    }
    var c = e.target.closest ? e.target.closest('[data-cookie]') : null;
    if (c) {
      try { localStorage.setItem(KEY, c.getAttribute('data-cookie')); } catch (err) {}
      var banner = c.closest('.cookie');
      if (banner) banner.hidden = true;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var t = closeMenu();
    if (t) t.focus();
  });
  (function () {
    var idx = document.getElementById('sidx'), out = document.getElementById('sr'), inp = document.getElementById('sq');
    if (!idx || !out || !inp) return;
    var data = JSON.parse(idx.textContent), q0 = (new URLSearchParams(location.search).get('q') || '');
    function run(q) {
      var w = q.toLowerCase().split(/\s+/).filter(Boolean), h = '';
      if (!w.length) { out.innerHTML = ''; return; }
      data.map(function (p) { var t = (p.t + ' ' + p.d).toLowerCase(), n = 0; w.forEach(function (x) { if (t.indexOf(x) > -1) n += (p.t.toLowerCase().indexOf(x) > -1 ? 3 : 1); }); return { p: p, n: n }; })
        .filter(function (r) { return r.n; }).sort(function (a, b) { return b.n - a.n; })
        .forEach(function (r) { var a = document.createElement('li'), l = document.createElement('a'); l.href = r.p.u; l.textContent = r.p.t; a.appendChild(l); var d = document.createElement('p'); d.textContent = r.p.d; a.appendChild(d); out.appendChild(a); });
      out.innerHTML = ''; data.forEach(function () {});
      var res = data.map(function (p) { var t = (p.t + ' ' + p.d).toLowerCase(), n = 0; w.forEach(function (x) { if (t.indexOf(x) > -1) n += (p.t.toLowerCase().indexOf(x) > -1 ? 3 : 1); }); return { p: p, n: n }; }).filter(function (r) { return r.n; }).sort(function (a, b) { return b.n - a.n; });
      if (!res.length) { var e = document.createElement('li'); e.textContent = 'No page found for \u201c' + q + '\u201d. Try another word, or ask the platform team.'; out.appendChild(e); }
      res.forEach(function (r) { var a = document.createElement('li'), l = document.createElement('a'); l.href = r.p.u; l.textContent = r.p.t; a.appendChild(l); var d = document.createElement('p'); d.textContent = r.p.d; a.appendChild(d); out.appendChild(a); });
    }
    inp.value = q0; run(q0);
    inp.form.addEventListener('submit', function (e) { e.preventDefault(); run(inp.value); });
  })();
  /* Contact forms (owner 20 Oct 2026): Send opens the visitor's own email app with the message filled in,
     addressed to the site's contact. Nothing is sent from the page itself. */
  function mailForm(f) {
    var to = f.getAttribute('data-mailto');
    if (!to) return false;
    var lines = [];
    Array.prototype.forEach.call(f.elements, function (el) {
      if (!el.name || !el.value || el.type === 'checkbox' || el.type === 'radio' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return;
      var lab = el.id ? f.querySelector('label[for="' + el.id + '"]') : null;
      var n = lab ? lab.textContent.replace(/\s*\(optional\)\s*/i, '').trim() : el.name;
      lines.push(n + ': ' + el.value);
    });
    var t = f.querySelector('[name=topic],[name=route]');
    var subj = (f.getAttribute('data-subject') || 'Website message') + (t && t.value ? ': ' + t.value : '');
    var cc = '';
    var rt = f.getAttribute('data-routes');
    if (rt && t && t.value) {
      try { var m = JSON.parse(rt)[t.value]; if (m && m.length) { to = m[0]; cc = m.slice(1).join(','); } } catch (x) { /* keep the default address */ }
    }
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + (cc ? '&cc=' + encodeURIComponent(cc) : '') + '&body=' + encodeURIComponent(lines.join('\n'));
    return true;
  }
  // Wake the free back end while the visitor reads, so forms and sign-in answer sooner. Silent; no data sent.
  try {
    var GW = 'https://ahfl-gateway-test.onrender.com';
    fetch(GW + '/health', { mode: 'no-cors', cache: 'no-store' }).catch(function () {});
    var seen = {};
    Array.prototype.forEach.call(document.querySelectorAll('form[data-api]'), function (f) { var h = f.getAttribute('data-api'); if (!seen[h]) { seen[h] = 1; fetch(h + '/', { mode: 'no-cors', cache: 'no-store' }).catch(function () {}); } });
  } catch (e) { /* the wake-up is optional */ }
  Array.prototype.forEach.call(document.querySelectorAll('form[data-api]'), function (f) {
    var sel = f.querySelector('select[name=topic]');
    if (!sel) return;
    fetch(f.getAttribute('data-api') + '/api/help/topics?brand=' + encodeURIComponent(f.getAttribute('data-brand')))
      .then(function (r) { return r.json(); })
      .then(function (j) { (j.topics || []).forEach(function (t) { var o = document.createElement('option'); o.value = t.id; o.textContent = t.label; sel.appendChild(o); }); })
      .catch(function () { var st = f.querySelector('.form-status'); if (st) { st.textContent = 'Our message desk is starting up. Please reload this page in a minute.'; st.hidden = false; } });
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.hasAttribute) return;
    if (f.hasAttribute('data-api')) {
      e.preventDefault();
      var st0 = f.querySelector('.form-status'), btn = f.querySelector('button[type=submit]');
      var say = function (t) { if (st0) { st0.textContent = t; st0.hidden = false; st0.focus(); } };
      var v = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ''; };
      var body = { brand: f.getAttribute('data-brand'), topic: v('topic'), email: v('email'), mobile: v('mobile'), message: v('details'),
                   consent: !!(f.elements.consent && f.elements.consent.checked), name: v('name'), organisation: v('organisation'), role: v('role'), country: v('country') };
      if (btn) btn.disabled = true;
      say('Sending your message...');
      var tries = 0, started = Date.now();
      var attempt = function () {
        fetch(f.getAttribute('data-api') + '/api/help/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (o) {
            if (btn) btn.disabled = false;
            if (o.ok && o.j.reference) { say('Thank you. Your message is saved. Your reference number is ' + o.j.reference + '. ' + (o.j.promise || '')); f.reset(); }
            else say((o.j && (o.j.error || o.j.message)) || 'We could not save your message. Please check the fields and try again.');
          })
          .catch(function () {
            // The free service may be waking from sleep (up to about 3 minutes). Wait calmly and retry; never show a failure at once.
            if (Date.now() - started < 360000) { tries++; say('Connecting to our secure service. This can take up to 4 minutes. Please keep this page open.'); setTimeout(attempt, 15000); }
            else { if (btn) btn.disabled = false; say('Our secure service is taking longer than usual. Your words are still in the form. Please press Send once more.'); }
          });
      };
      attempt();
      return;
    }
    if (f.hasAttribute('data-offline')) {
      e.preventDefault();
      mailForm(f);
      var s = f.querySelector('.form-status');
      if (s) { s.textContent = f.getAttribute('data-thanks'); s.hidden = false; s.focus(); }
      return;
    }
    if (f.hasAttribute('data-quiz')) {
      e.preventDefault();
      var sets = f.querySelectorAll('fieldset'), right = 0;
      for (var i = 0; i < sets.length; i++) {
        var fs = sets[i], pick = fs.querySelector('input:checked'), ok = pick && pick.value === fs.getAttribute('data-correct');
        if (ok) right++;
        fs.className = ok ? 'right' : 'wrong';
        var w = fs.querySelector('.why');
        if (w) { w.textContent = (ok ? 'Right. ' : 'Not quite. ') + fs.getAttribute('data-why'); w.hidden = false; }
      }
      var st = f.querySelector('.form-status'), pct = Math.round(right / sets.length * 100), pass = +f.getAttribute('data-pass') || 0;
      if (st) {
        st.textContent = right + ' of ' + sets.length + ' right (' + pct + '%). ' + (pass ? (pct >= pass ? 'That is a pass.' : 'Look at the notes, then try again.') : '');
        st.hidden = false; st.focus();
      }
    }
  });
  document.addEventListener('reset', function (e) {
    var f = e.target;
    if (!f || !f.hasAttribute || !f.hasAttribute('data-quiz')) return;
    var sets = f.querySelectorAll('fieldset');
    for (var i = 0; i < sets.length; i++) { sets[i].className = ''; var w = sets[i].querySelector('.why'); if (w) w.hidden = true; }
    var st = f.querySelector('.form-status'); if (st) st.hidden = true;
  });
  function init() {
    var banner = document.querySelector('.cookie');
    if (!banner) return;
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (err) {}
    banner.hidden = !!v;
  }
  window.SiteUI = { init: init, closeMenu: closeMenu };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

(function(){
  function closeAll(except){Array.prototype.forEach.call(document.querySelectorAll('.has-sub'),function(li){if(li!==except){li.classList.remove('open');var b=li.querySelector('.sub-btn');if(b)b.setAttribute('aria-expanded','false');}});}
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-sub-toggle]');
    if(b){var li=b.parentNode,o=!li.classList.contains('open');closeAll(li);li.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));return;}
    if(!(e.target.closest&&e.target.closest('.has-sub')))closeAll(null);
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll(null);});
})();

  (function () {
    var el = document.getElementById('mk-data'); if (!el) return;
    var D = JSON.parse(el.textContent), sel = {}, cart = {}, out = document.getElementById('mk-out'), msg = document.getElementById('mk-sel'), N = {}, GS = {};
    D.groups.forEach(function (g) { GS[g.id] = g.sectors.map(function (x) { return x.id; }); g.sectors.forEach(function (x) { N[x.id] = x; x.g = g.name; }); });
    function ids() { return Object.keys(sel).filter(function (k) { return sel[k]; }); }
    function mk(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; }
    function item(id) {
      var i = D.items[id], li = mk('li', 'mk-it'), d = mk('div'); d.appendChild(document.createTextNode(i.n)); d.appendChild(mk('small', '', i.s)); if (D.lens) d.appendChild(mk('small', 'mk-lens', D.lens)); if (i.c) d.appendChild(mk('small', 'mk-course', 'Course: ' + i.c)); if (i.st) d.appendChild(mk('small', i.b ? 'mk-bm' : 'mk-st', i.st));
      var b = mk('button', '', cart[id] ? 'Added' : 'Add'); b.type = 'button'; b.setAttribute('aria-pressed', cart[id] ? 'true' : 'false');
      b.addEventListener('click', function () { if (cart[id]) delete cart[id]; else cart[id] = { n: i.n, g: ids().map(function (s) { return N[s].name; }).join(', ') }; draw(); drawCart(); });
      li.appendChild(d); li.appendChild(b); return li;
    }
    function list(box, title, arr, empty) {
      box.appendChild(mk('h4', '', title + ' (' + arr.length + ')'));
      if (arr.length) { var u = mk('ul'); arr.forEach(function (id) { u.appendChild(item(id)); }); box.appendChild(u); } else box.appendChild(mk('p', 'mk-empty', empty));
    }
    function draw() {
      var s = ids(); out.textContent = '';
      var five = mk('div', 'mk-five'), rest = mk('div', 'mk-rest'), FIVE = { hardware: 1, software: 1, cloud: 1, data: 1, analytics: 1 };
      D.cats.forEach(function (c) {
        var core = D.core[c.id] || [], seen = {}, cons = [], vars = [];
        core.forEach(function (id) { seen[id] = 1; });
        s.forEach(function (sid) { (N[sid].cat[c.id] || []).forEach(function (id) { if (seen[id]) return; seen[id] = 1; (D.items[id].r ? cons : vars).push(id); }); });
        var box = mk('section', 'mk-cat'); box.appendChild(mk('h3', '', c.name));
        list(box, 'Shared core, the same in every sector', core.concat(cons), 'Coming soon.');
        if (s.length) list(box, 'Shaped to your choice', vars, 'Coming soon for this choice.');
        (FIVE[c.id] ? five : rest).appendChild(box);
      });
      out.appendChild(five); out.appendChild(rest);
      msg.textContent = s.length ? 'Chosen: ' + s.map(function (x) { return N[x].name; }).join(', ') + '.' : 'Nothing chosen yet. Showing the shared core, the same in every sector.';
      Array.prototype.forEach.call(document.querySelectorAll('.mk-p'), function (g) { g.setAttribute('aria-pressed', sel[g.getAttribute('data-s')] ? 'true' : 'false'); });
      Array.prototype.forEach.call(document.querySelectorAll('.mk-c'), function (g) { var h = GS[g.getAttribute('data-c')]; g.setAttribute('aria-pressed', h.every(function (x) { return sel[x]; }) ? 'true' : 'false'); });
    }
    function drawCart() {
      var l = document.getElementById('mk-list'), k = Object.keys(cart); if (!l || !document.getElementById('mk-n')) return; l.textContent = ''; document.getElementById('mk-n').textContent = '(' + k.length + ')';
      k.forEach(function (n) { var li = mk('li'); li.appendChild(mk('span', '', cart[n].n)); var b = mk('button', '', 'Remove'); b.type = 'button'; b.addEventListener('click', function () { delete cart[n]; draw(); drawCart(); }); li.appendChild(b); l.appendChild(li); });
      if (!k.length) l.appendChild(mk('li', '', 'Nothing added yet. Use Add beside any offer.'));
    }
    function tog(t) { var e = t.closest('[data-s],[data-c]'); if (!e) return;
      if (e.classList.contains('mk-c')) { var h = GS[e.getAttribute('data-c')], all = h.every(function (x) { return sel[x]; }); h.forEach(function (x) { sel[x] = !all; }); }
      else { var s = e.getAttribute('data-s'); sel[s] = !sel[s]; }
      draw(); }
    document.querySelector('.mk-row').addEventListener('click', function (e) { tog(e.target); });
    document.querySelector('.mk-row').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(e.target); } });
    document.getElementById('mk-clear').addEventListener('click', function () { sel = {}; draw(); });
    document.getElementById('mk-all').addEventListener('click', function () { Object.keys(N).forEach(function (x) { sel[x] = true; }); draw(); });
    var f = document.getElementById('mk-form'), st = document.getElementById('mk-st'), topic = '';
    fetch(f.getAttribute('data-mk-desk') + '/api/help/topics?brand=' + encodeURIComponent(f.getAttribute('data-brand'))).then(function (r) { return r.json(); }).then(function (j) { var t = j.topics || []; topic = (t.filter(function (x) { return x.id === 'general'; })[0] || t[0] || {}).id || ''; }).catch(function () { });
    function say(t) { st.textContent = t; st.hidden = false; st.focus(); }
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var k = Object.keys(cart);
      if (!k.length) { say('Please add at least one offer first.'); return; }
      var lines = k.map(function (n) { return '- ' + cart[n].n + (cart[n].g ? ' [' + cart[n].g + ']' : ''); }).join('\n');
      var body = { brand: f.getAttribute('data-brand'), topic: topic, email: document.getElementById('mk-e').value.trim(), mobile: document.getElementById('mk-m').value.trim(), message: 'Marketplace enquiry:\n' + lines, consent: document.getElementById('mk-k').checked, name: 'Marketplace enquiry' };
      say('Sending your enquiry...');
      fetch(f.getAttribute('data-mk-desk') + '/api/help/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (o) { if (o.ok && o.j.reference) { say('Thank you. Your enquiry is saved. Reference number: ' + o.j.reference + '. ' + (o.j.promise || '')); cart = {}; draw(); drawCart(); } else say((o.j && (o.j.error || o.j.message)) || 'We could not save your enquiry. Please check the fields.'); })
        .catch(function () { say('We could not reach our message desk just now. Please try again in a minute.'); });
    });
    draw(); drawCart();
  })();

(function () {
  var bar = document.getElementById('tc-filter'); if (!bar) return;
  bar.querySelectorAll('[data-tc]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-tc');
      bar.querySelectorAll('[data-tc]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      document.querySelectorAll('[data-tc-kind]').forEach(function (li) { li.hidden = !(k === 'all' || li.getAttribute('data-tc-kind') === k); });
    });
  });
})();

(function () {
  var D = [["AF", "Afghanistan", "No single comprehensive law found", "base"], ["AL", "Albania", "Law 9887/2008 on Protection of Personal Data (as amended)", "broad"], ["DZ", "Algeria", "Law 18-07 on Protection of Natural Persons in Personal Data Processing", "broad"], ["AD", "Andorra", "Qualified Law 29/2021 on Personal Data Protection", "broad"], ["AO", "Angola", "Law 22/11 on Personal Data Protection", "broad"], ["AG", "Antigua and Barbuda", "Data Protection Act 2013", "broad"], ["AR", "Argentina", "Personal Data Protection Law 25.326", "broad"], ["AM", "Armenia", "Law on Protection of Personal Data (2015)", "broad"], ["AU", "Australia", "Privacy Act 1988 and the Australian Privacy Principles", "broad"], ["AT", "Austria", "GDPR (EU 2016/679) with the Austrian Data Protection Act", "gdpr"], ["AZ", "Azerbaijan", "Law on Personal Data (2010)", "broad"], ["BS", "Bahamas", "Data Protection (Privacy of Personal Information) Act 2003", "broad"], ["BH", "Bahrain", "Law 30/2018 on Personal Data Protection", "gulf"], ["BD", "Bangladesh", "No single comprehensive law in force (ordinance or bill; lawyer to confirm)", "base"], ["BB", "Barbados", "Data Protection Act 2019", "broad"], ["BY", "Belarus", "Law on Personal Data Protection (2021)", "broad"], ["BE", "Belgium", "GDPR (EU 2016/679) with the Belgian Data Protection Act 2018", "gdpr"], ["BZ", "Belize", "Data Protection Act 2021", "broad"], ["BJ", "Benin", "Digital Code (2017)", "broad"], ["BT", "Bhutan", "No single comprehensive law found", "base"], ["BO", "Bolivia", "No single comprehensive law found", "base"], ["BA", "Bosnia and Herzegovina", "Law on Protection of Personal Data", "broad"], ["BW", "Botswana", "Data Protection Act 2024", "broad"], ["BR", "Brazil", "LGPD, Law 13.709/2018", "broad"], ["BN", "Brunei", "No single comprehensive law found", "base"], ["BG", "Bulgaria", "GDPR (EU 2016/679) with the Bulgarian Personal Data Protection Act", "gdpr"], ["BF", "Burkina Faso", "Law 001-2021 on Protection of Personal Data", "broad"], ["BI", "Burundi", "No single comprehensive law found", "base"], ["CV", "Cabo Verde", "Law 133/V/2001 on Personal Data Protection", "broad"], ["KH", "Cambodia", "No single comprehensive law found (draft)", "base"], ["CM", "Cameroon", "Law 2024/017 on Personal Data Protection", "broad"], ["CA", "Canada", "PIPEDA, provincial laws (including Quebec Law 25) and CASL for electronic messages", "pipeda"], ["CF", "Central African Republic", "No single comprehensive law found", "base"], ["TD", "Chad", "Law 007/PR/2015 on Personal Data Protection", "broad"], ["CL", "Chile", "Law 19.628, with reform Law 21.719 (2024) being phased in", "broad"], ["CN", "China", "Personal Information Protection Law (PIPL) 2021", "broad"], ["CO", "Colombia", "Statutory Law 1581 of 2012", "broad"], ["KM", "Comoros", "No single comprehensive law found", "base"], ["CD", "Congo (Democratic Republic)", "Digital Code (2023); lawyer to confirm", "base"], ["CG", "Congo (Republic)", "Law 29-2019 on Personal Data Protection", "broad"], ["CR", "Costa Rica", "Law 8968 on Protection of the Person against Processing of Personal Data", "broad"], ["CI", "Cote d'Ivoire", "Law 2013-450 on Personal Data Protection", "broad"], ["HR", "Croatia", "GDPR (EU 2016/679) with the Croatian implementing Act (2018)", "gdpr"], ["CU", "Cuba", "No single comprehensive law found", "base"], ["CY", "Cyprus", "GDPR (EU 2016/679) with Law 125(I)/2018", "gdpr"], ["CZ", "Czechia", "GDPR (EU 2016/679) with Act 110/2019", "gdpr"], ["DK", "Denmark", "GDPR (EU 2016/679) with the Danish Data Protection Act", "gdpr"], ["DJ", "Djibouti", "No single comprehensive law found", "base"], ["DM", "Dominica", "No single comprehensive law found", "base"], ["DO", "Dominican Republic", "Law 172-13 on Personal Data Protection", "broad"], ["EC", "Ecuador", "Organic Law on Personal Data Protection (2021)", "broad"], ["EG", "Egypt", "Personal Data Protection Law 151/2020", "broad"], ["SV", "El Salvador", "No single comprehensive law found", "base"], ["GQ", "Equatorial Guinea", "No single comprehensive law found", "base"], ["ER", "Eritrea", "No single comprehensive law found", "base"], ["EE", "Estonia", "GDPR (EU 2016/679) with the Personal Data Protection Act 2018", "gdpr"], ["SZ", "Eswatini", "Data Protection Act 2022", "broad"], ["ET", "Ethiopia", "Personal Data Protection Proclamation 1321/2024", "broad"], ["FJ", "Fiji", "No single comprehensive law found", "base"], ["FI", "Finland", "GDPR (EU 2016/679) with the Data Protection Act 1050/2018", "gdpr"], ["FR", "France", "GDPR (EU 2016/679) with the Loi Informatique et Libertés", "gdpr"], ["GA", "Gabon", "Law 001/2011 on Personal Data Protection", "broad"], ["GM", "Gambia", "No single comprehensive law in force (bill; lawyer to confirm)", "base"], ["GE", "Georgia", "Law on Personal Data Protection (2023)", "broad"], ["DE", "Germany", "GDPR (EU 2016/679) with the Federal Data Protection Act (BDSG)", "gdpr"], ["GH", "Ghana", "Data Protection Act 2012", "broad"], ["GR", "Greece", "GDPR (EU 2016/679) with Law 4624/2019", "gdpr"], ["GD", "Grenada", "Data Protection Act 2023", "broad"], ["GT", "Guatemala", "No single comprehensive law found", "base"], ["GN", "Guinea", "Law on personal data (lawyer to confirm)", "base"], ["GW", "Guinea-Bissau", "No single comprehensive law found", "base"], ["GY", "Guyana", "No single comprehensive law found", "base"], ["HT", "Haiti", "No single comprehensive law found", "base"], ["HN", "Honduras", "No single comprehensive law found", "base"], ["HK", "Hong Kong", "Personal Data (Privacy) Ordinance", "broad"], ["HU", "Hungary", "GDPR (EU 2016/679) with Act CXII of 2011", "gdpr"], ["IS", "Iceland", "GDPR through the EEA Agreement, with Act 90/2018", "gdpr"], ["IN", "India", "Digital Personal Data Protection Act 2023 (Rules being phased in)", "dpdp"], ["ID", "Indonesia", "Personal Data Protection Law 27/2022", "broad"], ["IR", "Iran", "No single comprehensive law found", "base"], ["IQ", "Iraq", "No single comprehensive law found", "base"], ["IE", "Ireland", "GDPR (EU 2016/679) with the Data Protection Act 2018", "gdpr"], ["IL", "Israel", "Privacy Protection Law 1981 (Amendment 13, 2024)", "broad"], ["IT", "Italy", "GDPR (EU 2016/679) with the Personal Data Protection Code", "gdpr"], ["JM", "Jamaica", "Data Protection Act 2020", "broad"], ["JP", "Japan", "Act on the Protection of Personal Information (APPI)", "broad"], ["JO", "Jordan", "Personal Data Protection Law No. 24 of 2023", "broad"], ["KZ", "Kazakhstan", "Law on Personal Data and Their Protection (2013)", "broad"], ["KE", "Kenya", "Data Protection Act 2019", "broad"], ["KI", "Kiribati", "No single comprehensive law found", "base"], ["XK", "Kosovo", "Law 06/L-082 on Protection of Personal Data", "broad"], ["KW", "Kuwait", "Data privacy rules of the communications regulator (2021); no single statute", "base"], ["KG", "Kyrgyzstan", "Law on Personal Information (2008)", "broad"], ["LA", "Laos", "Law on Electronic Data Protection (2017)", "broad"], ["LV", "Latvia", "GDPR (EU 2016/679) with the Personal Data Processing Law", "gdpr"], ["LB", "Lebanon", "Law 81/2018 on Electronic Transactions and Personal Data", "broad"], ["LS", "Lesotho", "Data Protection Act 2011", "broad"], ["LR", "Liberia", "No single comprehensive law found", "base"], ["LY", "Libya", "No single comprehensive law found", "base"], ["LI", "Liechtenstein", "GDPR through the EEA Agreement, with the Data Protection Act", "gdpr"], ["LT", "Lithuania", "GDPR (EU 2016/679) with the Law on Legal Protection of Personal Data", "gdpr"], ["LU", "Luxembourg", "GDPR (EU 2016/679) with the Law of 1 August 2018", "gdpr"], ["MO", "Macao", "Personal Data Protection Act 8/2005", "broad"], ["MG", "Madagascar", "Law 2014-038 on Protection of Personal Data", "broad"], ["MW", "Malawi", "Data Protection Act 2024", "broad"], ["MY", "Malaysia", "Personal Data Protection Act 2010 (amended 2024)", "broad"], ["MV", "Maldives", "No single comprehensive law found (lawyer to confirm)", "base"], ["ML", "Mali", "Law 2013-015 on Personal Data Protection", "broad"], ["MT", "Malta", "GDPR (EU 2016/679) with the Data Protection Act (Chapter 586)", "gdpr"], ["MH", "Marshall Islands", "No single comprehensive law found", "base"], ["MR", "Mauritania", "Law 2017-020 on Personal Data Protection", "broad"], ["MU", "Mauritius", "Data Protection Act 2017", "broad"], ["MX", "Mexico", "Federal Law on Protection of Personal Data Held by Private Parties (law renewed 2025; lawyer to confirm)", "broad"], ["FM", "Micronesia", "No single comprehensive law found", "base"], ["MD", "Moldova", "Law 133/2011 on Personal Data Protection", "broad"], ["MC", "Monaco", "Law 1.165 on Protection of Personal Information", "broad"], ["MN", "Mongolia", "Law on Personal Secrets and Law on Protection of Personal Information (2021)", "broad"], ["ME", "Montenegro", "Law on Personal Data Protection", "broad"], ["MA", "Morocco", "Law 09-08 on Protection of Personal Data", "broad"], ["MZ", "Mozambique", "No single comprehensive law found", "base"], ["MM", "Myanmar", "No single comprehensive law found", "base"], ["NA", "Namibia", "No single comprehensive law in force (bill; lawyer to confirm)", "base"], ["NR", "Nauru", "No single comprehensive law found", "base"], ["NP", "Nepal", "Privacy Act 2018", "broad"], ["NL", "Netherlands", "GDPR (EU 2016/679) with the UAVG implementing Act", "gdpr"], ["NZ", "New Zealand", "Privacy Act 2020", "broad"], ["NI", "Nicaragua", "Law 787 on Protection of Personal Data", "broad"], ["NE", "Niger", "Law 2017-28 on Protection of Personal Data", "broad"], ["NG", "Nigeria", "Nigeria Data Protection Act 2023", "broad"], ["KP", "North Korea", "No single comprehensive law found", "base"], ["MK", "North Macedonia", "Law on Personal Data Protection (2020)", "broad"], ["NO", "Norway", "GDPR through the EEA Agreement, with the Personal Data Act 2018", "gdpr"], ["OM", "Oman", "Royal Decree 6/2022 on Personal Data Protection", "gulf"], ["PK", "Pakistan", "No single comprehensive law in force (bill; lawyer to confirm)", "base"], ["PW", "Palau", "No single comprehensive law found", "base"], ["PS", "Palestine", "No single comprehensive law found", "base"], ["PA", "Panama", "Law 81 of 2019 on Personal Data Protection", "broad"], ["PG", "Papua New Guinea", "No single comprehensive law found", "base"], ["PY", "Paraguay", "Law 6534/2020 on Personal Data Protection", "broad"], ["PE", "Peru", "Personal Data Protection Law 29733", "broad"], ["PH", "Philippines", "Data Privacy Act 2012", "broad"], ["PL", "Poland", "GDPR (EU 2016/679) with the Personal Data Protection Act 2018", "gdpr"], ["PT", "Portugal", "GDPR (EU 2016/679) with Law 58/2019", "gdpr"], ["QA", "Qatar", "Law 13/2016 on Personal Data Privacy Protection", "gulf"], ["RO", "Romania", "GDPR (EU 2016/679) with Law 190/2018", "gdpr"], ["RU", "Russia", "Federal Law 152-FZ on Personal Data", "broad"], ["RW", "Rwanda", "Law 058/2021 on Personal Data and Privacy", "broad"], ["KN", "Saint Kitts and Nevis", "No single comprehensive law found", "base"], ["LC", "Saint Lucia", "Data Protection Act 2011", "broad"], ["VC", "Saint Vincent and the Grenadines", "Privacy Act 2003", "broad"], ["WS", "Samoa", "No single comprehensive law found", "base"], ["SM", "San Marino", "Law 171/2018 on Personal Data Protection", "broad"], ["ST", "Sao Tome and Principe", "Law 03/2016 on Personal Data Protection", "broad"], ["SA", "Saudi Arabia", "Personal Data Protection Law (Royal Decree M/19, 2021)", "gulf"], ["SN", "Senegal", "Law 2008-12 on Personal Data Protection", "broad"], ["RS", "Serbia", "Law on Personal Data Protection (2018)", "broad"], ["SC", "Seychelles", "Data Protection Act 2023", "broad"], ["SL", "Sierra Leone", "No single comprehensive law found", "base"], ["SG", "Singapore", "Personal Data Protection Act 2012", "broad"], ["SK", "Slovakia", "GDPR (EU 2016/679) with Act 18/2018", "gdpr"], ["SI", "Slovenia", "GDPR (EU 2016/679) with the Personal Data Protection Act (ZVOP-2)", "gdpr"], ["SB", "Solomon Islands", "No single comprehensive law found", "base"], ["SO", "Somalia", "No single comprehensive law found", "base"], ["ZA", "South Africa", "Protection of Personal Information Act (POPIA) 2013", "broad"], ["KR", "South Korea", "Personal Information Protection Act (PIPA)", "broad"], ["SS", "South Sudan", "No single comprehensive law found", "base"], ["ES", "Spain", "GDPR (EU 2016/679) with Organic Law 3/2018", "gdpr"], ["LK", "Sri Lanka", "Personal Data Protection Act No. 9 of 2022", "broad"], ["SD", "Sudan", "No single comprehensive law found", "base"], ["SR", "Suriname", "No single comprehensive law found", "base"], ["SE", "Sweden", "GDPR (EU 2016/679) with the Data Protection Act 2018:218", "gdpr"], ["CH", "Switzerland", "Federal Act on Data Protection (revised, in force 2023)", "gdpr"], ["SY", "Syria", "No single comprehensive law found", "base"], ["TW", "Taiwan", "Personal Data Protection Act", "broad"], ["TJ", "Tajikistan", "Law on Personal Data Protection (2018)", "broad"], ["TZ", "Tanzania", "Personal Data Protection Act 2022", "broad"], ["TH", "Thailand", "Personal Data Protection Act 2019", "broad"], ["TL", "Timor-Leste", "No single comprehensive law found", "base"], ["TG", "Togo", "Law 2019-014 on Personal Data Protection", "broad"], ["TO", "Tonga", "No single comprehensive law found", "base"], ["TT", "Trinidad and Tobago", "Data Protection Act 2011 (partly in force)", "broad"], ["TN", "Tunisia", "Organic Law 2004-63 on Personal Data Protection", "broad"], ["TR", "Turkey", "Law 6698 on Personal Data Protection (KVKK)", "broad"], ["TM", "Turkmenistan", "Law on Information about Private Life and its Protection (2017)", "broad"], ["TV", "Tuvalu", "No single comprehensive law found", "base"], ["UG", "Uganda", "Data Protection and Privacy Act 2019", "broad"], ["UA", "Ukraine", "Law on Personal Data Protection (2010)", "broad"], ["AE", "United Arab Emirates", "Federal Decree-Law 45/2021 on Personal Data Protection (PDPL); free-zone rules may also apply", "gulf"], ["GB", "United Kingdom", "UK GDPR and the Data Protection Act 2018", "gdpr"], ["US", "United States", "No federal general law. State privacy laws, for example California CCPA/CPRA", "ccpa"], ["UY", "Uruguay", "Law 18.331 on Personal Data Protection", "broad"], ["UZ", "Uzbekistan", "Law on Personal Data (2019)", "broad"], ["VU", "Vanuatu", "No single comprehensive law found", "base"], ["VA", "Vatican City", "General Decree on personal data protection", "base"], ["VE", "Venezuela", "No single comprehensive law found", "base"], ["VN", "Vietnam", "Personal Data Protection Law (2025) and Decree 13/2023", "broad"], ["YE", "Yemen", "No single comprehensive law found", "base"], ["ZM", "Zambia", "Data Protection Act 2021", "broad"], ["ZW", "Zimbabwe", "Cyber and Data Protection Act 2021", "broad"]], FAM = {"gdpr": {"label": "GDPR family (EU, EEA, UK, Switzerland)", "rights": ["Access the personal data we hold about you.", "Correct data that is wrong.", "Erase your data, unless the law needs us to keep it.", "Restrict how we use it.", "Receive it in a portable form.", "Object to certain uses, including direct marketing.", "Withdraw consent at any time, as easily as you gave it.", "Not be subject to a decision made only by a machine that affects you in a significant way.", "Complain to your national data-protection authority."], "consent": "I agree that you may use the details I give here to answer my request. This is my free, specific and informed choice. I can withdraw it at any time, as easily as I gave it.", "reply": "We aim to answer within one month."}, "dpdp": {"label": "India: Digital Personal Data Protection Act 2023", "rights": ["Get a summary of the personal data we process and who we share it with.", "Correct, complete and update your data.", "Erase your data when it is no longer needed.", "Have a grievance heard and answered.", "Nominate another person to exercise your rights if you cannot.", "Withdraw consent at any time."], "consent": "I give my consent for you to process the personal data I give here only to answer my request. I understand I can withdraw consent at any time and raise a grievance with you.", "reply": "We aim to answer within 30 days, or the period the Rules set."}, "pipeda": {"label": "Canada: PIPEDA, provincial laws and CASL", "rights": ["Access your personal information.", "Challenge its accuracy and have it corrected.", "Withdraw consent, subject to legal limits.", "Complain to the Privacy Commissioner.", "Quebec residents: also ask for your data in a portable form and ask us to stop using it in certain ways.", "Electronic messages (CASL): say no, and unsubscribe at any time."], "consent": "I agree that you may collect and use the details I give here to answer my request. I understand I can withdraw consent, and that I will only receive commercial messages if I say yes.", "reply": "We aim to answer within 30 days."}, "ccpa": {"label": "United States: state privacy laws, for example California CCPA/CPRA", "rights": ["Know what personal information we collected, why, and who received it.", "Delete personal information we hold.", "Correct inaccurate information.", "Opt out of sale or sharing. We do not sell personal information.", "Limit use of sensitive personal information.", "Equal service and price when you use a right.", "Use an authorised agent to ask for you."], "consent": "I agree that you may use the details I give here to answer my request. I know you do not sell my information and that I can ask to see or delete it.", "reply": "We aim to answer within 45 days."}, "gulf": {"label": "Gulf states: UAE, Saudi Arabia, Qatar, Bahrain, Oman", "rights": ["Know what personal data we process and why.", "Access a copy of your data.", "Correct or complete it.", "Ask us to erase or destroy it where the law allows.", "Object to or restrict some processing.", "Withdraw consent at any time.", "Complain to the national data authority."], "consent": "I consent to you processing the personal data I give here only to answer my request. I know I can withdraw my consent and ask for access, correction or deletion.", "reply": "We aim to answer within 30 days."}, "broad": {"label": "National data-protection law (modern, broad)", "rights": ["Know how your data is used.", "Access your data.", "Correct it.", "Ask for it to be deleted where the law allows.", "Object to some uses, such as marketing.", "Withdraw consent at any time.", "Complain to the national authority, where one exists."], "consent": "I agree that you may use the details I give here to answer my request. I understand I can withdraw my agreement and ask to see, correct or delete my data.", "reply": "We aim to answer within 30 days."}, "base": {"label": "Our standard commitment (no single comprehensive national law found)", "rights": ["Ask what we hold about you and get a copy.", "Ask us to correct it.", "Ask us to delete it.", "Withdraw consent at any time.", "Ask a person, not a machine, to review any decision about you."], "consent": "I agree that you may use the details I give here to answer my request. I know I can ask to see, correct or delete them, and withdraw my agreement at any time.", "reply": "We aim to answer within 30 days."}}, KEY = 'dp-law';
  function get() { try { return sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function put(c) { try { sessionStorage.setItem(KEY, c); } catch (e) { } }
  function find(c) { for (var i = 0; i < D.length; i++) if (D[i][0] === c) return D[i]; return null; }
  function pageHref() { var a = document.querySelector('a[href$="data-protection.html"]'); return a ? a.getAttribute('href') : 'data-protection.html'; }
  var onPage = !!document.getElementById('dp-profile');
  function label() { var c = find(get()); return c ? c[0] : ''; }
  function setBtns() { document.querySelectorAll('.dp-law-btn .btn-label').forEach(function (s) { var l = label(); s.textContent = l ? 'Data law: ' + l : 'Data law'; }); }
  function show() {
    var c = find(get()); if (!onPage || !c) return;
    var fm = FAM[c[3]];
    var p = document.getElementById('dp-profile');
    p.innerHTML = '';
    var h = document.createElement('p'); h.innerHTML = '<strong></strong>'; h.firstChild.textContent = c[1] + ': ' + c[2]; p.appendChild(h);
    var q = document.createElement('p'); q.textContent = 'We align with this law for you. Family of law: ' + fm.label + '. ' + fm.reply; p.appendChild(q);
    var r = document.getElementById('dp-rights'); r.innerHTML = '';
    fm.rights.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; r.appendChild(li); });
    document.getElementById('dp-consent').textContent = fm.consent;
    document.getElementById('dp-kt').textContent = fm.consent;
    document.querySelectorAll('[data-dp-row]').forEach(function (tr) { tr.style.background = tr.getAttribute('data-dp-row') === c[0] ? '#F2EEE2' : ''; });
  }
  function choose(code) { put(code); setBtns(); if (onPage) show(); else window.location.href = pageHref() + '?c=' + encodeURIComponent(code); }
  var q0 = /[?&]c=([A-Z]{2})/.exec(location.search); if (q0 && find(q0[1])) put(q0[1]);
  // header box
  var panel = null;
  function build() {
    panel = document.createElement('div'); panel.className = 'dp-panel'; panel.hidden = true;
    var b = document.createElement('div'); b.className = 'dp-box'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-modal', 'true'); b.setAttribute('aria-labelledby', 'dp-ph');
    b.innerHTML = '<h2 id="dp-ph">Your data law</h2><p>Choose your country. We show the data-protection law we align with, your rights and your consent wording. Draft for lawyer review.</p><label for="dp-ps">Search country</label><input id="dp-ps" type="search" autocomplete="off"><ul class="dp-opts" id="dp-po"></ul><p><button type="button" class="dp-pick" id="dp-pc">Close</button></p>';
    panel.appendChild(b); document.body.appendChild(panel);
    var ul = b.querySelector('#dp-po');
    D.forEach(function (c) { var li = document.createElement('li'); li.setAttribute('data-n', c[1].toLowerCase()); var x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-pressed', 'false'); x.setAttribute('data-c', c[0]); x.textContent = c[1]; li.appendChild(x); ul.appendChild(li); });
    ul.addEventListener('click', function (e) { var t = e.target.closest('button'); if (t) { close(); choose(t.getAttribute('data-c')); } });
    b.querySelector('#dp-ps').addEventListener('input', function (e) { var v = e.target.value.toLowerCase(); ul.querySelectorAll('li').forEach(function (li) { li.hidden = li.getAttribute('data-n').indexOf(v) < 0; }); });
    b.querySelector('#dp-pc').addEventListener('click', close);
    panel.addEventListener('click', function (e) { if (e.target === panel) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  }
  var opener = null;
  function open(btn) { if (!panel) build(); opener = btn; var c = get(); panel.querySelectorAll('#dp-po button').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-c') === c ? 'true' : 'false'); }); panel.hidden = false; panel.querySelector('#dp-ps').focus(); }
  function close() { panel.hidden = true; if (opener) opener.focus(); }
  document.querySelectorAll('.lang-btn').forEach(function (lb) {
    if (lb.nextElementSibling && lb.nextElementSibling.classList.contains('dp-law-btn')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = lb.className.replace('lang-btn', 'dp-law-btn'); b.title = 'Data law: choose your country'; b.setAttribute('aria-haspopup', 'dialog');
    b.innerHTML = '<span class="btn-label">Data law</span>';
    b.addEventListener('click', function () { open(b); });
    lb.parentNode.insertBefore(b, lb.nextSibling);
  });
  setBtns();
  function applyConsent() {
    var c = find(get()); if (!c) return; var txt = FAM[c[3]].consent;
    document.querySelectorAll('form input[type="checkbox"]').forEach(function (cb) {
      if (cb.id === 'dp-k') return;
      var lab = cb.closest('label'); if (!lab) return;
      var sp = lab.querySelector('span'); if (!sp || !/agree|consent/i.test(sp.textContent)) return;
      if (sp.getAttribute('data-dp-law') === c[0]) return;
      var a = sp.querySelector('a'); var keep = a ? a.cloneNode(true) : null;
      sp.textContent = txt + ' '; if (keep) sp.appendChild(keep);
      sp.setAttribute('data-dp-law', c[0]);
    });
  }
  applyConsent();
  if (!onPage) return;
  document.getElementById('dp-tbl').addEventListener('click', function (e) { var t = e.target.closest('[data-dp-pick]'); if (t) { choose(t.getAttribute('data-dp-pick')); window.scrollTo(0, 0); } });
  document.getElementById('dp-q').addEventListener('input', function (e) { var v = e.target.value.toLowerCase(); document.querySelectorAll('[data-dp-row]').forEach(function (tr) { tr.hidden = tr.textContent.toLowerCase().indexOf(v) < 0; }); });
  show();
  var f = document.getElementById('dp-form'), st = document.getElementById('dp-s'), pk = '', topic = '';
  function say(t) { st.hidden = false; st.textContent = t; st.focus(); }
  f.querySelectorAll('[data-dp-group]').forEach(function (b) { b.addEventListener('click', function () { pk = b.getAttribute('data-dp-v'); f.querySelectorAll('[data-dp-group]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }); });
  fetch(f.getAttribute('data-dp-desk') + '/api/help/topics?brand=' + encodeURIComponent(f.getAttribute('data-brand'))).then(function (r) { return r.json(); }).then(function (j) { var t = j.topics || []; topic = (t.filter(function (x) { return x.id === 'general'; })[0] || t[0] || {}).id || ''; }).catch(function () { });
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!pk) { say('Please choose what you want.'); return; }
    var c = find(get());
    var msg = 'Data rights request\nRequest: ' + pk + '\nLaw chosen: ' + (c ? c[1] + ' (' + c[2] + ')' : 'none chosen') + '\nConsent wording shown: ' + document.getElementById('dp-kt').textContent + '\n' + document.getElementById('dp-t').value.trim();
    var body = { brand: f.getAttribute('data-brand'), topic: topic, email: document.getElementById('dp-e').value.trim(), mobile: document.getElementById('dp-m').value.trim(), message: msg, consent: document.getElementById('dp-k').checked, name: 'Data rights request' };
    say('Sending your request...');
    fetch(f.getAttribute('data-dp-desk') + '/api/help/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (o) { if (o.ok && o.j.reference) say('Thank you. Your request is saved. Reference number: ' + o.j.reference + '. ' + (o.j.promise || '')); else say((o.j && (o.j.error || o.j.message)) || 'We could not save your request. Please check the fields.'); })
      .catch(function () { say('We could not reach our message desk just now. Please try again in a minute.'); });
  });
})();
