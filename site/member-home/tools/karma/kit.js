/* Shared helpers for the PAVER, COLLATE, LEAP and LAB screens. Everything is kept in this browser only. */
(function () {
  'use strict';
  var KEY = 'studio.v1', mem = null;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  var Kit = {
    get: function (k) { if (!mem) mem = load(); if (!Array.isArray(mem[k])) mem[k] = []; return mem[k]; },
    save: function () {
      try { localStorage.setItem(KEY, JSON.stringify(mem || {})); return true; }
      catch (e) { Kit.say('This browser did not allow saving. Your work stays only until you close this page.'); return false; }
    },
    id: function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); },
    $: function (id) { return document.getElementById(id); },
    /* h('button', {class:'k-btn', text:'Add', onclick:fn}, [children]) */
    h: function (tag, a, kids) {
      var e = document.createElement(tag), k;
      for (k in (a || {})) {
        if (k === 'text') e.textContent = a[k];
        else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), a[k]);
        else if (a[k] === true) e.setAttribute(k, '');
        else if (a[k] !== false && a[k] != null) e.setAttribute(k, a[k]);
      }
      (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
      return e;
    },
    clear: function (e) { while (e.firstChild) e.removeChild(e.firstChild); return e; },
    say: function (t) { var s = document.getElementById('say'); if (s) s.textContent = t; },
    btn: function (text, fn, cls) { return Kit.h('button', { type: 'button', class: 'k-btn ' + (cls || 'k-small k-quiet'), text: text, onclick: fn }); },
    move: function (list, i, by) { var j = i + by; if (j < 0 || j >= list.length) return; var x = list[i]; list[i] = list[j]; list[j] = x; },
    download: function (name, text) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      a.download = name; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      Kit.say('Downloaded "' + name + '". Look in your Downloads folder.');
    },
    STATUS: { draft: 'Draft', check: 'Waiting for check', ok: 'Checked (practice)', work: 'Needs work' },
    sample: function () {
      return { id: Kit.id(), status: 'draft', title: 'Read the nameplate on a machine', who: 'New team members', minutes: 3,
        outcome: 'You can find the rating, the serial number and the year on any machine nameplate.',
        steps: ['Find the metal plate or label on the body of the machine.', 'Read the model and the serial number. Write them down exactly.',
          'Read the rating: voltage, current, power or capacity, with the unit.', 'Read the year of make, and note any warning sign beside the plate.'],
        q: 'Which line tells you this exact machine apart from another of the same model?', opts: ['The rating', 'The serial number', 'The year of make'], right: 1 };
    }
  };
  window.Kit = Kit;
})();
