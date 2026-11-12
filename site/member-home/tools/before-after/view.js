// Before and after slider: the picture part. Drag the line, tap a numbered dot to read a note.
// Used by the tool page and copied as-is into the one-page download. No outside code.
(function () {
  'use strict';
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  function mount(root, data) {
    var pos = 50, sel = -1, editing = false, onTap = null, onMove = null;
    root.classList.add('ba-view');
    root.textContent = '';

    var stage = el('figure', 'ba-stage');
    var imgB = el('img'); imgB.alt = 'Before'; imgB.draggable = false;
    var wrapA = el('div', 'ba-after');
    var imgA = el('img'); imgA.alt = 'After'; imgA.draggable = false;
    wrapA.appendChild(imgA);
    var tagA = el('span', 'ba-tag ba-tag-after', 'AFTER');
    var tagB = el('span', 'ba-tag ba-tag-before', 'BEFORE');
    var dots = el('div', 'ba-dots');
    var handle = el('button', 'ba-handle');
    handle.type = 'button';
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Drag the line. Left and right arrow keys also move it.');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    var knob = el('span', 'ba-knob', '↔');
    knob.setAttribute('aria-hidden', 'true');
    handle.appendChild(knob);
    stage.appendChild(imgB); stage.appendChild(wrapA); stage.appendChild(tagA); stage.appendChild(tagB);
    stage.appendChild(dots); stage.appendChild(handle);

    var hint = el('p', 'ba-hint', 'Drag the white line left and right. Tap a numbered dot to read what changed.');
    var chips = el('ul', 'ba-chips');
    var note = el('div', 'ba-note');
    note.setAttribute('aria-live', 'polite');
    root.appendChild(stage); root.appendChild(hint); root.appendChild(chips); root.appendChild(note);

    function setPos(p) {
      pos = clamp(p);
      wrapA.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
      wrapA.style.webkitClipPath = wrapA.style.clipPath;
      handle.style.left = pos + '%';
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
      handle.setAttribute('aria-valuetext', Math.round(pos) + ' percent of the after picture shown');
      tagA.classList.toggle('ba-hide', pos < 14);
      tagB.classList.toggle('ba-hide', pos > 86);
      var list = dots.children;
      for (var i = 0; i < list.length; i++) {
        var n = data.notes[i];
        list[i].classList.toggle('ba-wait', !editing && n.x > pos);
      }
    }

    function showNote() {
      note.textContent = '';
      var n = data.notes[sel];
      if (!n) {
        note.appendChild(el('p', 'ba-empty', data.notes.length ? 'Tap a numbered dot, or a name above, to read the note.' : 'No notes yet.'));
        return;
      }
      note.appendChild(el('h3', '', (sel + 1) + '. ' + (n.title || 'Note')));
      note.appendChild(el('p', '', n.text || ''));
    }

    function select(i, reveal) {
      sel = (i === sel && !reveal) ? -1 : i;
      var d = dots.children, c = chips.children;
      for (var k = 0; k < d.length; k++) {
        d[k].classList.toggle('ba-on', k === sel);
        d[k].setAttribute('aria-expanded', k === sel ? 'true' : 'false');
        c[k].firstChild.classList.toggle('ba-on', k === sel);
      }
      var n = data.notes[sel];
      if (n && n.x > pos) setPos(Math.min(100, n.x + 8));
      showNote();
    }

    function render() {
      imgB.src = data.before; imgA.src = data.after;
      stage.style.aspectRatio = String(data.ratio || 1.6);
      dots.textContent = ''; chips.textContent = '';
      data.notes.forEach(function (n, i) {
        var b = el('button', 'ba-dot', String(i + 1));
        b.type = 'button';
        b.style.left = n.x + '%'; b.style.top = n.y + '%';
        b.setAttribute('aria-label', 'Note ' + (i + 1) + ': ' + (n.title || ''));
        // A finger tap right after a drag can lose its click, so the dot answers on release and skips the click that follows.
        var at = 0;
        b.addEventListener('pointerup', function (ev) { if (ev.pointerType === 'mouse') return; at = Date.now(); select(i); });
        b.addEventListener('click', function (ev) { ev.stopPropagation(); if (Date.now() - at < 700) return; select(i); });
        dots.appendChild(b);
        var li = el('li');
        var c = el('button', 'ba-chip');
        c.type = 'button';
        c.appendChild(el('b', '', String(i + 1)));
        c.appendChild(el('span', '', n.title || 'Note'));
        c.addEventListener('click', function () { select(i, true); });
        li.appendChild(c); chips.appendChild(li);
      });
      if (sel >= data.notes.length) sel = -1;
      var keep = sel; sel = -1;
      if (keep >= 0) select(keep, true); else showNote();
      setPos(pos);
    }

    // Dragging: mouse, finger and pen all arrive as pointer events.
    var dragging = false, moved = false, startX = 0;
    function pct(ev) {
      var r = stage.getBoundingClientRect();
      return { x: clamp((ev.clientX - r.left) / r.width * 100), y: clamp((ev.clientY - r.top) / r.height * 100) };
    }
    stage.addEventListener('pointerdown', function (ev) {
      if (ev.target.classList && ev.target.classList.contains('ba-dot')) return;
      if (ev.button != null && ev.button > 0) return;
      dragging = true; moved = false; startX = ev.clientX;
      try { stage.setPointerCapture(ev.pointerId); } catch (e) {}
      if (!onTap) { setPos(pct(ev).x); if (onMove) onMove(pos); }
    });
    stage.addEventListener('pointermove', function (ev) {
      if (!dragging) return;
      if (Math.abs(ev.clientX - startX) > 4) moved = true;
      if (onTap && !moved) return;
      setPos(pct(ev).x); if (onMove) onMove(pos);
    });
    function end(ev) {
      if (!dragging) return;
      dragging = false;
      try { stage.releasePointerCapture(ev.pointerId); } catch (e) {}
      if (onTap && !moved && ev.type === 'pointerup') { var p = pct(ev); onTap(p.x, p.y); }
    }
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    handle.addEventListener('keydown', function (ev) {
      var step = ev.shiftKey ? 10 : 2, k = ev.key;
      if (k === 'ArrowLeft' || k === 'ArrowDown') setPos(pos - step);
      else if (k === 'ArrowRight' || k === 'ArrowUp') setPos(pos + step);
      else if (k === 'Home') setPos(0);
      else if (k === 'End') setPos(100);
      else return;
      ev.preventDefault();
    });

    render();
    return {
      root: root, stage: stage,
      render: render, select: select, setPos: setPos,
      getPos: function () { return pos; },
      setData: function (d) { data = d; sel = -1; render(); },
      setEditing: function (on) { editing = !!on; setPos(pos); },
      setTap: function (fn) { onTap = fn; stage.style.cursor = fn ? 'crosshair' : ''; },
      setHint: function (t) { hint.textContent = t; }
    };
  }

  window.BAView = { mount: mount };
})();
