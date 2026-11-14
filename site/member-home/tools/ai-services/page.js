(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); };
  var list = window.AI_SERVICES || [], shown = [];
  function say(t) { $('say').textContent = t; }
  function api(body) {
    return fetch('/api/ai-services', body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) } : { credentials: 'same-origin' })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Something went wrong'); return j; }); });
  }
  function fill() {
    var k = $('fKind').value;
    shown = list.filter(function (s) { return k === 'all' || s.kind === k; });
    var p = $('fPick'); p.textContent = '';
    var o0 = document.createElement('option'); o0.value = '-1'; o0.textContent = '-- choose --'; p.appendChild(o0);
    shown.forEach(function (s, i) { var o = document.createElement('option'); o.value = i; o.textContent = '[' + s.kind.toUpperCase() + '] ' + s.name + (s.provider === 'none' ? ' (no API)' : ''); p.appendChild(o); });
    $('fInfo').textContent = '';
  }
  function picked() {
    var s = shown[Number($('fPick').value)];
    if (!s) return;
    $('fInfo').textContent = 'Website: ' + s.website + '   API: ' + (s.provider === 'none' ? 'no' : 'yes');
    $('fTok').value = s.env || '';
  }
  function row(s) {
    var d = document.createElement('div'); d.className = 'k-item';
    var t = document.createElement('span'); t.textContent = s.name + ' | ' + (s.website || '-') + ' | key: ' + (s.hasKey ? 'yes' : 'no') + ' | coupon: ' + (s.coupon ? 'yes' : 'no') + ' ';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'k-btn'; b.textContent = 'Remove';
    b.addEventListener('click', function () { api({ remove: s.name }).then(load).catch(function (e) { say(e.message); }); });
    d.appendChild(t); d.appendChild(b); return d;
  }
  function load() {
    api().then(function (j) {
      var box = $('saved'); box.textContent = '';
      if (!j.services.length) box.textContent = 'Nothing saved yet.';
      j.services.forEach(function (s) { box.appendChild(row(s)); });
    }).catch(function (e) { say(e.message === 'Staff administrators only' ? 'This page is for staff administrators only.' : e.message); });
  }
  function save() {
    var s = shown[Number($('fPick').value)], free = $('fFree').value.trim(), svc;
    if (free || !s) {
      if (!free) { say('Pick a service or type a name or link first.'); return; }
      var url = /^(https?:\/\/|www\.)/i.test(free);
      svc = { name: url ? free.replace(/^https?:\/\//i, '').split('/')[0] : free, website: url ? free : '', provider: 'none' };
    } else svc = { name: s.name, website: s.website, provider: s.provider, base_url: s.base_url, model: s.model, env: s.env };
    svc.env = $('fTok').value.trim() || svc.env || ''; svc.coupon = $('fCoup').value.trim(); svc.key = $('fKey').value.trim();
    api({ save: svc }).then(function (j) { $('fKey').value = ''; say('Saved: ' + j.saved); load(); }).catch(function (e) { say(e.message); });
  }
  function send() {
    var b = $('bText').value.trim(); if (!b) { say('Type the brief first.'); return; }
    say('Sending... this can take a minute.');
    api({ ask: b }).then(function (j) {
      var box = $('replies'); box.textContent = ''; say('Done.');
      j.replies.forEach(function (r) {
        var h = document.createElement('h3'); h.textContent = r.name + ' (' + r.status + ')';
        var p = document.createElement('pre'); p.className = 'k-small'; p.textContent = r.text;
        box.appendChild(h); box.appendChild(p);
      });
    }).catch(function (e) { say(e.message); });
  }
  $('fKind').addEventListener('change', fill); $('fPick').addEventListener('change', picked);
  $('fSave').addEventListener('click', save); $('bSend').addEventListener('click', send);
  fill(); load();
})();
