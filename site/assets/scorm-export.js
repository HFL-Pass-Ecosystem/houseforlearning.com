/* Export an approved HFL Author Studio course as a self-contained SCORM 1.2 package.
   The package contains one SCO. The external LMS records learner progress and final-check status.
   HFL assignment reviews and HFL certificates remain on the HFL server. */
(function () {
  'use strict';

  var encoder = new TextEncoder();
  var maxPackageBytes = 50 * 1024 * 1024;

  function plain(value) { return String(value == null ? '' : value); }
  function html(value) {
    return plain(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function xml(value) {
    return plain(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }
  function https(value) {
    try {
      var u = new URL(plain(value));
      return u.protocol === 'https:' ? u.href : '';
    } catch (_) { return ''; }
  }
  function slug(value) {
    return plain(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'course';
  }
  function cleanCourse(course) {
    if (!course || (course.status !== 'approved' && course.status !== 'published')) {
      throw new Error('Only a course approved by a trainer can be exported.');
    }
    var lessons = [];
    (Array.isArray(course.modules) ? course.modules : []).forEach(function (module) {
      (Array.isArray(module.lessons) ? module.lessons : []).forEach(function (lesson) {
        var blocks = [];
        (Array.isArray(lesson.blocks) ? lesson.blocks : []).forEach(function (block) {
          if (!block || typeof block !== 'object') return;
          if (block.type === 'text' || block.type === 'callout') {
            blocks.push({ type: block.type, text: plain(block.text).slice(0, 6000) });
          } else if (block.type === 'image') {
            var imageUrl = https(block.url);
            if (imageUrl) blocks.push({ type: 'image', url: imageUrl, alt: plain(block.alt).slice(0, 200) });
          } else if (block.type === 'video') {
            var videoUrl = https(block.url);
            if (videoUrl) blocks.push({ type: 'video', url: videoUrl, title: plain(block.title).slice(0, 120) });
          } else if (block.type === 'flashcards') {
            blocks.push({
              type: 'flashcards',
              items: (Array.isArray(block.items) ? block.items : []).slice(0, 40).map(function (item) {
                return { front: plain(item.front).slice(0, 300), back: plain(item.back).slice(0, 600) };
              }).filter(function (item) { return item.front && item.back; })
            });
          } else if (block.type === 'scenario') {
            blocks.push({
              type: 'scenario',
              prompt: plain(block.prompt).slice(0, 1200),
              choices: (Array.isArray(block.choices) ? block.choices : []).slice(0, 5).map(function (choice) {
                return { text: plain(choice.text).slice(0, 300), feedback: plain(choice.feedback).slice(0, 600) };
              }).filter(function (choice) { return choice.text; })
            });
          }
        });
        lessons.push({
          moduleTitle: plain(module.title).slice(0, 120),
          title: plain(lesson.title).slice(0, 120),
          blocks: blocks
        });
      });
    });
    if (!lessons.length || lessons.length > 200) throw new Error('SCORM 1.2 export supports 1 to 200 lessons per course.');
    var quiz = (Array.isArray(course.quiz) ? course.quiz : []).slice(0, 60).map(function (question) {
      var options = (Array.isArray(question.o) ? question.o : []).slice(0, 6).map(function (option) { return plain(option).slice(0, 300); });
      var answer = Number(question.a);
      if (!plain(question.q).trim() || options.filter(Boolean).length < 2 || !Number.isInteger(answer) || answer < 0 || answer >= options.length) return null;
      return { q: plain(question.q).slice(0, 500), options: options, answer: answer };
    }).filter(Boolean);
    if (!quiz.length) throw new Error('Add at least one valid final-check question before exporting.');
    return {
      id: plain(course.key || course.id || slug(course.title)).slice(0, 120),
      title: plain(course.title).trim().slice(0, 140) || 'House for Learning course',
      summary: plain(course.summary).slice(0, 600),
      lessons: lessons,
      quiz: quiz,
      passMark: 70,
      issuer: 'House for Learning'
    };
  }

  function scormRuntime() {
    var api = null;
    var started = false;
    var finished = false;
    function findApi(win) {
      var current = win, hops = 0;
      while (current && hops < 500) {
        try { if (current.API) return current.API; } catch (_) {}
        var parent;
        try { parent = current.parent; } catch (_) { break; }
        if (!parent || parent === current) break;
        current = parent;
        hops++;
      }
      try { if (win.opener && win.opener.API) return win.opener.API; } catch (_) {}
      return null;
    }
    function invoke(name, args) {
      if (!api || typeof api[name] !== 'function') return '';
      try { return api[name].apply(api, args || []); } catch (_) { return ''; }
    }
    function get(name) { return String(invoke('LMSGetValue', [name]) || ''); }
    function set(name, value) { return String(invoke('LMSSetValue', [name, String(value)]) || '') === 'true'; }
    function initialize() {
      if (started) return !!api;
      api = findApi(window);
      if (!api) return false;
      started = String(invoke('LMSInitialize', [''])) === 'true';
      return started;
    }
    function commit(state, status, score) {
      if (!started || !api || finished) return false;
      var saved = JSON.stringify(state || {});
      if (saved.length > 4000) return false;
      set('cmi.suspend_data', saved);
      if (state && Number.isInteger(state.index)) set('cmi.core.lesson_location', String(state.index).slice(0, 255));
      if (status) set('cmi.core.lesson_status', status);
      if (score != null && Number.isFinite(Number(score))) set('cmi.core.score.raw', String(Math.max(0, Math.min(100, Math.round(Number(score))))));
      invoke('LMSCommit', ['']);
      return true;
    }
    function finish(state, status, score) {
      if (finished) return;
      commit(state, status, score);
      if (started && api) {
        set('cmi.core.exit', status === 'passed' ? '' : 'suspend');
        invoke('LMSFinish', ['']);
      }
      finished = true;
    }
    window.HFLScormRuntime = {
      initialize: initialize,
      available: function () { return !!(api && started); },
      get: get,
      commit: commit,
      finish: finish
    };
  }

  function packagedPlayer() {
    var app = document.getElementById('app');
    var data = window.HFLCourse;
    var runtime = window.HFLScormRuntime;
    var total = data.lessons.length;
    var state = { index: 0, done: [], status: 'incomplete', score: null };
    runtime.initialize();

    function finiteIndex(value) {
      var n = Number(value);
      return Number.isInteger(n) && n >= 0 && n < total ? n : 0;
    }
    function restore() {
      var raw = runtime.get('cmi.suspend_data');
      try {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
          state.index = finiteIndex(saved.index);
          state.done = (Array.isArray(saved.done) ? saved.done : []).map(Number).filter(function (n, i, all) {
            return Number.isInteger(n) && n >= 0 && n < total && all.indexOf(n) === i;
          });
          if (saved.status === 'passed' || saved.status === 'failed' || saved.status === 'incomplete') state.status = saved.status;
          if (Number.isFinite(Number(saved.score))) state.score = Number(saved.score);
          return;
        }
      } catch (_) {}
      state.index = finiteIndex(runtime.get('cmi.core.lesson_location'));
      var status = runtime.get('cmi.core.lesson_status');
      if (status === 'passed' || status === 'failed' || status === 'incomplete') state.status = status;
      var score = Number(runtime.get('cmi.core.score.raw'));
      if (Number.isFinite(score)) state.score = score;
    }
    function persist() { runtime.commit(state, state.status, state.score); }
    function node(tag, className, text) {
      var el = document.createElement(tag);
      if (className) el.className = className;
      if (text != null) el.textContent = String(text);
      return el;
    }
    function clear() { while (app.firstChild) app.removeChild(app.firstChild); }
    function button(label, action, className) {
      var b = node('button', className || 'button', label);
      b.type = 'button';
      b.addEventListener('click', action);
      return b;
    }
    function message(text, kind) {
      var p = node('p', 'message' + (kind ? ' ' + kind : ''), text);
      p.setAttribute('role', 'status');
      return p;
    }
    function countDone() { return state.done.length; }
    function addDone(index) {
      if (state.done.indexOf(index) < 0) state.done.push(index);
      state.done.sort(function (a, b) { return a - b; });
      if (state.status !== 'passed') state.status = 'incomplete';
      persist();
    }
    function renderBlock(block, parent) {
      var section, p, strong;
      if (block.type === 'text' || block.type === 'callout') {
        section = node('section', block.type === 'callout' ? 'callout' : 'text-block');
        if (block.type === 'callout') section.appendChild(node('strong', '', 'Key point'));
        p = node('p', '', block.text);
        section.appendChild(p);
        parent.appendChild(section);
      } else if (block.type === 'image') {
        section = node('figure', 'media');
        var img = node('img');
        img.src = block.url;
        img.alt = block.alt || '';
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        section.appendChild(img);
        if (block.alt) section.appendChild(node('figcaption', '', block.alt));
        parent.appendChild(section);
      } else if (block.type === 'video') {
        section = node('section', 'media');
        p = node('p', '', block.title || 'Video lesson');
        section.appendChild(p);
        var link = node('a', 'external-link', 'Open video in a new tab');
        link.href = block.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.referrerPolicy = 'no-referrer';
        section.appendChild(link);
        parent.appendChild(section);
      } else if (block.type === 'flashcards') {
        section = node('section', 'flashcards');
        (block.items || []).forEach(function (item) {
          var card = node('details', 'flashcard');
          card.appendChild(node('summary', '', item.front));
          card.appendChild(node('p', '', item.back));
          section.appendChild(card);
        });
        parent.appendChild(section);
      } else if (block.type === 'scenario') {
        section = node('section', 'scenario');
        section.appendChild(node('p', '', block.prompt));
        (block.choices || []).forEach(function (choice, index) {
          var choiceButton = button(choice.text, function () {
            var feedback = section.querySelector('[data-feedback]');
            if (!feedback) { feedback = node('p', 'message', ''); feedback.setAttribute('data-feedback', ''); feedback.setAttribute('role', 'status'); section.appendChild(feedback); }
            feedback.textContent = choice.feedback || 'Consider how this choice supports the stated outcome.';
          }, 'choice');
          choiceButton.setAttribute('aria-label', 'Choice ' + (index + 1) + ': ' + choice.text);
          section.appendChild(choiceButton);
        });
        parent.appendChild(section);
      }
    }
    function shell() {
      clear();
      var header = node('header', 'course-head');
      header.appendChild(node('p', 'eyebrow', 'House for Learning • SCORM 1.2'));
      header.appendChild(node('h1', '', data.title));
      if (data.summary) header.appendChild(node('p', 'summary', data.summary));
      var progress = node('p', 'progress');
      progress.setAttribute('aria-live', 'polite');
      progress.textContent = 'Lessons complete: ' + countDone() + ' of ' + total;
      header.appendChild(progress);
      if (!runtime.available()) header.appendChild(message('Preview mode: no SCORM LMS was found, so this browser cannot report a grade or completion.', 'notice'));
      app.appendChild(header);
      var nav = node('nav', 'lesson-nav');
      nav.setAttribute('aria-label', 'Course lessons');
      data.lessons.forEach(function (lesson, index) {
        var label = (index + 1) + '. ' + (lesson.moduleTitle ? lesson.moduleTitle + ' — ' : '') + lesson.title;
        var item = button(label + (state.done.indexOf(index) >= 0 ? ' ✓' : ''), function () {
          state.index = index;
          persist();
          renderLesson();
        }, 'lesson-link' + (state.index === index ? ' current' : ''));
        item.setAttribute('aria-current', state.index === index ? 'step' : 'false');
        nav.appendChild(item);
      });
      app.appendChild(nav);
      return header;
    }
    function renderLesson() {
      var header = shell();
      var lesson = data.lessons[state.index];
      var section = node('article', 'lesson');
      section.appendChild(node('p', 'eyebrow', 'Lesson ' + (state.index + 1) + ' of ' + total));
      section.appendChild(node('h2', '', lesson.title));
      if (lesson.moduleTitle) section.appendChild(node('p', 'module-name', lesson.moduleTitle));
      var blocks = node('div', 'lesson-blocks');
      lesson.blocks.forEach(function (block) { renderBlock(block, blocks); });
      section.appendChild(blocks);
      var actions = node('div', 'actions');
      actions.appendChild(button(state.done.indexOf(state.index) >= 0 ? 'Lesson complete' : 'Mark lesson complete', function () {
        addDone(state.index);
        renderLesson();
      }, state.done.indexOf(state.index) >= 0 ? 'button quiet' : 'button'));
      if (state.index > 0) actions.appendChild(button('Previous lesson', function () {
        state.index--;
        persist();
        renderLesson();
      }, 'button quiet'));
      if (state.index < total - 1) actions.appendChild(button('Next lesson', function () {
        state.index++;
        persist();
        renderLesson();
      }, 'button quiet'));
      if (countDone() === total) actions.appendChild(button('Take the final check', function () { renderQuiz(); }, 'button'));
      if (state.status === 'passed') actions.appendChild(message('Final check passed: ' + state.score + '%. This result is stored by the destination LMS.', 'success'));
      section.appendChild(actions);
      app.appendChild(section);
      var footer = node('footer', 'course-foot', 'An external LMS grade is not an HFL certificate or academic-credit award.');
      app.appendChild(footer);
    }
    function renderQuiz() {
      shell();
      var section = node('section', 'quiz');
      section.appendChild(node('p', 'eyebrow', 'Final check'));
      section.appendChild(node('h2', '', 'Show what you learned'));
      if (countDone() < total) {
        section.appendChild(message('Complete every lesson before taking the final check.', 'notice'));
        app.appendChild(section);
        return;
      }
      var inputs = [];
      data.quiz.forEach(function (question, qi) {
        var group = node('fieldset', 'question');
        group.appendChild(node('legend', '', (qi + 1) + '. ' + question.q));
        question.options.forEach(function (option, oi) {
          var label = node('label', 'answer');
          var input = document.createElement('input');
          input.type = 'radio';
          input.name = 'q' + qi;
          input.value = String(oi);
          label.appendChild(input);
          label.appendChild(node('span', '', option));
          group.appendChild(label);
          if (!inputs[qi]) inputs[qi] = [];
          inputs[qi][oi] = input;
        });
        section.appendChild(group);
      });
      section.appendChild(button('Submit final check', function () {
        var right = 0, answered = 0;
        data.quiz.forEach(function (question, qi) {
          var selected = inputs[qi].findIndex(function (input) { return input && input.checked; });
          if (selected >= 0) answered++;
          if (selected === question.answer) right++;
        });
        if (answered !== data.quiz.length) {
          section.appendChild(message('Answer every question before submitting.', 'notice'));
          return;
        }
        state.score = Math.round(100 * right / data.quiz.length);
        state.status = state.score >= data.passMark ? 'passed' : 'failed';
        persist();
        runtime.commit(state, state.status, state.score);
        section.appendChild(message('Score: ' + state.score + '%. ' + (state.status === 'passed' ? 'Passed.' : 'Not passed yet. Review the lessons and try again.'), state.status === 'passed' ? 'success' : 'notice'));
        if (state.status === 'failed') section.appendChild(button('Try again', function () { renderQuiz(); }, 'button quiet'));
      }, 'button'));
      app.appendChild(section);
    }
    restore();
    if (!runtime.available()) state.status = 'incomplete';
    renderLesson();
    window.addEventListener('pagehide', function () { runtime.finish(state, state.status, state.score); });
  }

  function zipStore(files) {
    var table = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var bit = 0; bit < 8; bit++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    function crc32(bytes) {
      var crc = 0xffffffff;
      for (var i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
      return (crc ^ 0xffffffff) >>> 0;
    }
    function u16(view, offset, value) { view.setUint16(offset, value, true); }
    function u32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }
    var date = new Date();
    var year = Math.max(1980, date.getFullYear());
    var dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    var dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    var localParts = [], centralParts = [], offset = 0, centralSize = 0, totalBytes = 0;
    files.forEach(function (file) {
      var name = encoder.encode(file.name);
      var bytes = encoder.encode(file.body);
      if (name.length > 65535 || bytes.length > 0xffffffff) throw new Error('A SCORM package file is too large.');
      totalBytes += bytes.length;
      if (totalBytes > maxPackageBytes) throw new Error('SCORM package exceeds the 50 MB download limit.');
      var crc = crc32(bytes);
      var local = new Uint8Array(30 + name.length);
      var localView = new DataView(local.buffer);
      u32(localView, 0, 0x04034b50);
      u16(localView, 4, 20);
      u16(localView, 6, 0x0800);
      u16(localView, 8, 0);
      u16(localView, 10, dosTime);
      u16(localView, 12, dosDate);
      u32(localView, 14, crc);
      u32(localView, 18, bytes.length);
      u32(localView, 22, bytes.length);
      u16(localView, 26, name.length);
      u16(localView, 28, 0);
      local.set(name, 30);
      localParts.push(local, bytes);

      var central = new Uint8Array(46 + name.length);
      var centralView = new DataView(central.buffer);
      u32(centralView, 0, 0x02014b50);
      u16(centralView, 4, 20);
      u16(centralView, 6, 20);
      u16(centralView, 8, 0x0800);
      u16(centralView, 10, 0);
      u16(centralView, 12, dosTime);
      u16(centralView, 14, dosDate);
      u32(centralView, 16, crc);
      u32(centralView, 20, bytes.length);
      u32(centralView, 24, bytes.length);
      u16(centralView, 28, name.length);
      u16(centralView, 30, 0);
      u16(centralView, 32, 0);
      u16(centralView, 34, 0);
      u16(centralView, 36, 0);
      u32(centralView, 38, 0);
      u32(centralView, 42, offset);
      central.set(name, 46);
      centralParts.push(central);
      offset += 30 + name.length + bytes.length;
      centralSize += central.length;
    });
    if (files.length > 65535 || offset > 0xffffffff || centralSize > 0xffffffff) throw new Error('SCORM package exceeds the ZIP format limits.');
    var end = new Uint8Array(22);
    var endView = new DataView(end.buffer);
    u32(endView, 0, 0x06054b50);
    u16(endView, 4, 0);
    u16(endView, 6, 0);
    u16(endView, 8, files.length);
    u16(endView, 10, files.length);
    u32(endView, 12, centralSize);
    u32(endView, 16, offset);
    u16(endView, 20, 0);
    return new Blob(localParts.concat(centralParts, [end]), { type: 'application/zip' });
  }

  function manifest(data, identifier) {
    var title = xml(data.title);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<manifest identifier="HFL_' + identifier + '" version="1" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">\n' +
      '<metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>\n' +
      '<organizations default="ORG_' + identifier + '"><organization identifier="ORG_' + identifier + '"><title>' + title + '</title>' +
      '<item identifier="ITEM_' + identifier + '" identifierref="RES_' + identifier + '" isvisible="true"><title>' + title + '</title><adlcp:masteryscore>' + data.passMark + '</adlcp:masteryscore></item>' +
      '</organization></organizations>\n' +
      '<resources><resource identifier="RES_' + identifier + '" type="webcontent" href="index.html" adlcp:scormtype="sco">' +
      '<file href="index.html"/><file href="course-data.js"/><file href="runtime.js"/><file href="player.js"/><file href="course.css"/>' +
      '</resource></resources></manifest>';
  }
  function dataScript(data) {
    var json = JSON.stringify(data).replace(/</g, '\\u003c').replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028').replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
    return 'window.HFLCourse=' + json + ';';
  }
  function htmlDocument(title) {
    return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<meta name="referrer" content="no-referrer"><title>' + html(title) + '</title><link rel="stylesheet" href="course.css">' +
      '<script src="course-data.js" defer></script><script src="runtime.js" defer></script><script src="player.js" defer></script></head>' +
      '<body><main id="app" tabindex="-1"></main></body></html>';
  }
  var css = [
    ':root{color-scheme:light;--navy:#0d2742;--teal:#117a78;--gold:#efad27;--ink:#19324b;--muted:#526477;--paper:#f7f9fb}',
    '*{box-sizing:border-box}',
    'body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}',
    '#app{max-width:1120px;margin:auto;padding:clamp(16px,4vw,40px)}',
    '.course-head{background:var(--navy);color:#fff;padding:clamp(20px,4vw,40px);border-radius:20px}',
    '.course-head h1{margin:8px 0;font-size:clamp(1.8rem,5vw,3.2rem);line-height:1.1}',
    '.eyebrow{color:var(--gold);font-size:.78rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
    '.summary{max-width:72ch;color:#e0e9f1}',
    '.progress,.message{padding:12px 16px;border-radius:12px;background:#fff;color:var(--ink)}',
    '.notice{border-left:4px solid var(--gold)}.success{border-left:4px solid #138a72}',
    '.lesson-nav{display:flex;gap:8px;overflow:auto;padding:14px 0}',
    '.lesson-link,.button,.choice{border:1px solid #b7c5d2;border-radius:999px;background:#fff;color:var(--navy);padding:10px 16px;font:inherit;font-weight:700;cursor:pointer}',
    '.lesson-link.current,.button{background:var(--navy);border-color:var(--navy);color:#fff}',
    '.lesson-link:focus-visible,.button:focus-visible,.choice:focus-visible,a:focus-visible{outline:3px solid var(--gold);outline-offset:3px}',
    '.lesson{background:#fff;border:1px solid #d7e0e7;border-radius:18px;padding:clamp(18px,4vw,36px)}',
    '.lesson h2,.quiz h2{color:var(--navy);font-size:clamp(1.5rem,4vw,2.4rem)}',
    '.module-name,.course-foot{color:var(--muted)}',
    '.lesson-blocks{display:grid;gap:16px}.text-block,.callout,.media,.scenario,.flashcards{margin:0;padding:16px;border-radius:14px;border:1px solid #d7e0e7}',
    '.callout{border-left:5px solid var(--gold);background:#fff9e8}.callout p{margin-bottom:0}',
    '.media img{display:block;max-width:100%;max-height:560px;object-fit:contain;border-radius:10px}',
    '.media figcaption{font-size:.9rem;color:var(--muted);margin-top:8px}',
    '.external-link{display:inline-block;color:var(--teal);font-weight:700}',
    '.flashcards{display:grid;gap:8px}.flashcard{padding:12px;background:#f4f8fa;border-radius:10px}.flashcard summary{cursor:pointer;font-weight:700}',
    '.scenario{display:grid;gap:8px}.choice{border-radius:12px;text-align:left}',
    '.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.button.quiet{background:#fff;color:var(--navy)}',
    '.quiz{display:grid;gap:12px;background:#fff;border:1px solid #d7e0e7;border-radius:18px;padding:clamp(18px,4vw,36px)}',
    '.question{margin:0;border:1px solid #d7e0e7;border-radius:12px;padding:16px}.question legend{font-weight:800;padding:0 6px}',
    '.answer{display:flex;align-items:flex-start;gap:10px;padding:8px}.answer input{margin-top:6px}',
    '.course-foot{padding:18px 4px;font-size:.9rem}',
    '@media(max-width:620px){#app{padding:12px}.course-head,.lesson,.quiz{border-radius:14px}.lesson-nav{margin-inline:-4px}.actions .button{width:100%}}'
  ].join('');
  function download(course) {
    var data = cleanCourse(course);
    var id = slug(data.id).replace(/-/g, '_');
    var files = [
      { name: 'imsmanifest.xml', body: manifest(data, id) },
      { name: 'index.html', body: htmlDocument(data.title) },
      { name: 'course-data.js', body: dataScript(data) },
      { name: 'runtime.js', body: '(' + scormRuntime.toString() + ')();' },
      { name: 'player.js', body: '(' + packagedPlayer.toString() + ')();' },
      { name: 'course.css', body: css }
    ];
    var blob = zipStore(files);
    if (blob.size > maxPackageBytes + 10000) throw new Error('SCORM package exceeds the 50 MB download limit.');
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hfl-scorm-' + slug(data.title) + '.zip';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }
  window.HFLScormExport = { download: download };
})();