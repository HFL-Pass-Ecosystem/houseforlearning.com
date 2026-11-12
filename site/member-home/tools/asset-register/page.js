/* Tools and equipment register: items, lending, returns, repairs and due checks. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var items = K.get('astItems'), log = K.get('astLog'), seeded = K.get('astSeeded');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var people = (W && Array.isArray(W.team) && W.team.length ? W.team : ['Demo Asha', 'Demo Ben', 'Demo Chen', 'Demo Dina', 'Demo Eli', 'Demo Farah'])
    .map(function (p) { return String(p).slice(0, 40); }).filter(function (p) { return p; });
  var CONDS = ['Good', 'Needs repair', 'Out of use'];
  var DAY = 86400000;

  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function today() { return ymd(new Date()); }
  function addDays(n) { var d = new Date(); d.setHours(12, 0, 0, 0); return ymd(new Date(d.getTime() + n * DAY)); }
  function daysTo(s) { var a = new Date(today() + 'T12:00:00'), b = new Date(s + 'T12:00:00'); return Math.round((b - a) / DAY); }
  function stamp() { var d = new Date(); return ymd(d) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function overdue(x) { return x.due < today(); }
  function soon(x) { var n = daysTo(x.due); return n >= 0 && n <= 30; }

  /* Free text check: no amounts, phone numbers or email addresses. */
  function badText(t) {
    if (/@/.test(t) || /\b[a-z0-9._-]+\s*(\(at\)|\[at\])\s*[a-z0-9-]+/i.test(t)) return 'Please do not type an email address here.';
    if (/(\d[\s().-]*){7,}/.test(t)) return 'Please do not type a phone number here.';
    if (/[$€£¥₹]|\b(usd|eur|gbp|inr|rs|rupees?|dollars?|euros?|pounds?|price|cost)\b/i.test(t)) return 'Please do not type prices or money amounts here.';
    return '';
  }
  function clean(t, n) { return String(t || '').trim().replace(/[<>]/g, '').slice(0, n); }

  function addLog(action, x, who, detail) {
    log.push({ at: stamp(), action: action, tag: x ? x.tag : '', item: x ? x.name : '', who: who || '', detail: detail || '' });
  }

  /* Built-in practice items, only on the very first visit. */
  if (!items.length && !seeded.length) {
    [['Demo digital multimeter', 'Workshop shelf A', 'Good', -12],
      ['Demo insulation tester', 'Workshop shelf A', 'Good', 9],
      ['Demo clamp meter', 'Workshop shelf B', 'Good', 140],
      ['Demo laptop 1', 'Office cabinet', 'Good', 200],
      ['Demo laptop 2', 'Office cabinet', 'Needs repair', 75],
      ['Demo step ladder', 'Store room', 'Good', -3],
      ['Demo test bench', 'Lab corner', 'Good', 22],
      ['Demo projector', 'Meeting room cupboard', 'Good', 300],
      ['Demo torque wrench', 'Workshop shelf B', 'Out of use', 40],
      ['Demo hybrid meeting camera', 'Meeting room cupboard', 'Good', 15]].forEach(function (r, i) {
      items.push({ id: K.id(), tag: 'T-' + ('000' + (i + 1)).slice(-4), name: r[0], loc: r[1], cond: r[2], due: addDays(r[3]), out: null, last: '', fault: r[2] === 'Needs repair' ? 'Demo Ben' : '' });
    });
    seeded.push(1);
    addLog('Sample items added', null, '', '10 practice items');
    K.save();
  }

  function nextTag() {
    var max = 0;
    items.forEach(function (x) { var n = parseInt(String(x.tag).replace(/\D/g, ''), 10); if (n > max) max = n; });
    return 'T-' + ('000' + (max + 1)).slice(-4);
  }
  function lendBlock(x) {
    if (x.out) return 'it is already out with ' + x.out.who + ' until ' + x.out.back;
    if (x.cond === 'Out of use') return 'it is out of use';
    if (x.cond === 'Needs repair') return 'it needs repair. A different person must mark it repaired first';
    if (overdue(x)) return 'its check was due on ' + x.due + ' and has not been done';
    return '';
  }
  function where(x) { return x.out ? 'Out with ' + x.out.who + ', back by ' + x.out.back : 'In ' + x.loc; }
  function fill(sel, list) { K.clear(sel); list.forEach(function (p) { sel.appendChild(h('option', { value: p, text: p })); }); }

  var TABS = ['Reg', 'Lend', 'Due'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
      drawAll();
    });
  });

  /* Register */
  function drawReg() {
    var tb = K.clear(document.querySelector('#rGrid tbody'));
    items.forEach(function (x) {
      var dueTag = overdue(x) ? h('span', { class: 'k-tag k-warn', text: 'Overdue' }) : soon(x) ? h('span', { class: 'k-tag', text: 'Due soon' }) : null;
      tb.appendChild(h('tr', {}, [h('th', { scope: 'row', text: x.tag }), h('td', { text: x.name }), h('td', { text: x.loc }),
        h('td', {}, [h('span', { class: 'k-tag' + (x.cond === 'Good' ? ' k-ok' : ' k-warn'), text: x.cond })]),
        h('td', {}, [x.due + ' ', dueTag]), h('td', { text: x.out ? 'Out with ' + x.out.who + ', back by ' + x.out.back : 'In place' })]));
    });
    $('rSum').textContent = items.length + ' item(s): ' + items.filter(function (x) { return x.out; }).length + ' out, ' +
      items.filter(function (x) { return x.cond !== 'Good'; }).length + ' not in good condition, ' +
      items.filter(overdue).length + ' check(s) overdue, ' + items.filter(soon).length + ' due in 30 days.';
  }
  $('aDue').value = addDays(365);
  $('aAdd').addEventListener('click', function () {
    var name = clean($('aName').value, 60), loc = clean($('aLoc').value, 50), cond = $('aCond').value, due = $('aDue').value, bad;
    if (!name) { K.say('Please write the item name.'); $('aName').focus(); return; }
    if (!loc) { K.say('Please write where the item is kept.'); $('aLoc').focus(); return; }
    bad = badText(name) || badText(loc);
    if (bad) { K.say('Not added. ' + bad); return; }
    if (!due) { K.say('Please pick the check due date.'); $('aDue').focus(); return; }
    if (CONDS.indexOf(cond) < 0) cond = 'Good';
    var x = { id: K.id(), tag: nextTag(), name: name, loc: loc, cond: cond, due: due, out: null, last: '', fault: '' };
    items.push(x); addLog('Item added', x, '', 'Condition ' + cond + ', check due ' + due);
    $('aName').value = ''; $('aLoc').value = '';
    if (K.save()) K.say('Added ' + x.tag + ': ' + name + '.');
    drawAll();
  });

  /* Lend and return */
  fill($('oWho'), people); fill($('cWho'), people);
  $('oBack').value = addDays(7);
  $('oLend').addEventListener('click', function () {
    var x = items.filter(function (i) { return i.id === $('oItem').value; })[0], who = $('oWho').value, back = $('oBack').value, why;
    if (!x) { K.say('Please pick an item.'); return; }
    if (!who) { K.say('Please pick who the item goes to.'); return; }
    if (!back) { K.say('Please pick a return date.'); $('oBack').focus(); return; }
    if (back < today()) { K.say('The return date cannot be in the past.'); $('oBack').focus(); return; }
    why = lendBlock(x);
    if (why) { K.say('Not lent: ' + x.tag + ' ' + x.name + ' cannot go out because ' + why + '.'); return; }
    x.out = { who: who, since: today(), back: back };
    addLog('Lent', x, who, 'Return by ' + back);
    if (K.save()) K.say('Lent ' + x.tag + ' ' + x.name + ' to ' + who + '. Return by ' + back + '.');
    drawAll();
  });

  function returnForm(x) {
    var sel = h('select', { class: 'k-in', id: 'rc-' + x.id }), note = h('input', { class: 'k-in', id: 'rn-' + x.id, maxlength: '120' });
    CONDS.forEach(function (c) { sel.appendChild(h('option', { value: c, text: c })); });
    return h('div', {}, [
      h('div', { class: 'k-row' }, [h('div', {}, [h('label', { class: 'k-lab', for: 'rc-' + x.id, text: 'Condition on return' }), sel]),
        h('div', { class: 'k-grow' }, [h('label', { class: 'k-lab', for: 'rn-' + x.id, text: 'Condition note' }), note])]),
      h('div', { class: 'k-mini' }, [K.btn('Mark returned', function () {
        var c = sel.value, n = clean(note.value, 120), bad = badText(n), who = x.out.who;
        if (CONDS.indexOf(c) < 0) c = 'Good';
        if (c !== 'Good' && !n) { K.say('Please write a short note on what is wrong.'); note.focus(); return; }
        if (bad) { K.say('Not saved. ' + bad); note.focus(); return; }
        x.out = null; x.last = who; x.cond = c; x.fault = c === 'Needs repair' ? who : '';
        addLog('Returned', x, who, 'Condition ' + c + (n ? ': ' + n : ''));
        if (K.save()) K.say(x.tag + ' returned by ' + who + ' in condition "' + c + '".' + (c === 'Needs repair' ? ' Lending is blocked until a different person marks it repaired.' : ''));
        drawAll();
      }, 'k-small')])]);
  }
  function drawLend() {
    var keep = $('oItem').value;
    K.clear($('oItem'));
    items.forEach(function (x) {
      var why = lendBlock(x);
      $('oItem').appendChild(h('option', { value: x.id, text: x.tag + ' ' + x.name + (why ? ' (cannot lend now)' : '') }));
    });
    if (keep) $('oItem').value = keep;
    var ul = K.clear($('oList')), outs = items.filter(function (x) { return x.out; });
    outs.forEach(function (x) {
      var late = x.out.back < today();
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: x.tag + ' ' + x.name }),
        h('p', { text: 'With ' + x.out.who + ' since ' + x.out.since + '. Return by ' + x.out.back + '.' }),
        late ? h('p', {}, [h('span', { class: 'k-tag k-warn', text: 'Late' })]) : null, returnForm(x)]));
    });
    if (!outs.length) ul.appendChild(h('li', { class: 'k-note', text: 'No item is out right now.' }));
    var pl = K.clear($('pList')), rep = items.filter(function (x) { return x.cond === 'Needs repair' && !x.out; });
    rep.forEach(function (x) {
      var sel = h('select', { class: 'k-in', id: 'rp-' + x.id });
      fill(sel, people);
      pl.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: x.tag + ' ' + x.name }),
        h('p', { text: 'Reported by ' + (x.fault || 'unknown') + '. Lending is blocked.' }),
        h('div', { class: 'k-row' }, [h('div', { class: 'k-grow' }, [h('label', { class: 'k-lab', for: 'rp-' + x.id, text: 'Repaired and checked by' }), sel])]),
        h('div', { class: 'k-mini' }, [K.btn('Mark repaired', function () {
          var who = sel.value;
          if (!who) { K.say('Please pick who marks it repaired.'); return; }
          if (who === x.fault) { K.say('Not saved: ' + who + ' reported the fault. A different person must mark it repaired.'); return; }
          x.cond = 'Good'; addLog('Marked repaired', x, who, 'Fault was reported by ' + x.fault); x.fault = '';
          if (K.save()) K.say(x.tag + ' marked repaired by ' + who + '. It can be lent again.');
          drawAll();
        }, 'k-small')])]));
    });
    if (!rep.length) pl.appendChild(h('li', { class: 'k-note', text: 'Nothing is waiting for repair.' }));
  }

  /* Due checks */
  function drawDue() {
    var ul = K.clear($('cList')), list = items.filter(function (x) { return overdue(x) || soon(x); });
    list.sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    list.forEach(function (x) {
      var n = daysTo(x.due);
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: x.tag + ' ' + x.name }),
        h('p', {}, [h('span', { class: 'k-tag' + (n < 0 ? ' k-warn' : ''), text: n < 0 ? 'Overdue by ' + (-n) + ' day(s)' : n === 0 ? 'Due today' : 'Due in ' + n + ' day(s)' }), 'Due ' + x.due + '. ' + where(x) + '.']),
        h('p', { text: 'Last borrower: ' + (x.last || 'nobody yet') + '.' }),
        h('div', { class: 'k-mini' }, [K.btn('Mark checked', function () {
          var who = $('cWho').value, nd;
          if (!who) { K.say('Please pick who did the check.'); return; }
          if (x.out) { K.say('Not checked: ' + x.tag + ' is out with ' + x.out.who + '. Check it when it comes back.'); return; }
          if (who === x.last) { K.say('Not checked: ' + who + ' was the last borrower of ' + x.tag + '. A different person must do the check.'); return; }
          nd = addDays(365);
          addLog('Checked', x, who, 'Was due ' + x.due + ', next due ' + nd); x.due = nd;
          if (K.save()) K.say(x.tag + ' checked by ' + who + '. Next check due ' + nd + '.');
          drawAll();
        }, 'k-small')])]));
    });
    if (!list.length) ul.appendChild(h('li', { class: 'k-note', text: 'No check is overdue or due in the next 30 days.' }));
  }

  /* Downloads */
  function q(x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; }
  $('rDown').addEventListener('click', function () {
    if (!items.length) { K.say('There is no item to download yet.'); return; }
    K.download('register.csv', 'Tag,Item,Location,Condition,Check due,Check status,Out with,Return by,Last borrower\r\n' + items.map(function (x) {
      return [x.tag, x.name, x.loc, x.cond, x.due, overdue(x) ? 'Overdue' : soon(x) ? 'Due soon' : 'OK', x.out ? x.out.who : '', x.out ? x.out.back : '', x.last].map(q).join(','); }).join('\r\n') + '\r\n');
  });
  $('lDown').addEventListener('click', function () {
    if (!log.length) { K.say('The history log is empty.'); return; }
    K.download('history-log.csv', 'When,Action,Tag,Item,Who,Details\r\n' + log.map(function (l) {
      return [l.at, l.action, l.tag, l.item, l.who, l.detail].map(q).join(','); }).join('\r\n') + '\r\n');
  });

  function drawAll() { drawReg(); drawLend(); drawDue(); }
  drawAll();
})();
