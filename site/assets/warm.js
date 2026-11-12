/* Warm replies: the site answers people the moment they reach out.
   House for Learning copy (HFL side only). Add once per page:
     <script src="/assets/warm.js" defer></script>
   What it does, with no set-up:
   - Any form send (contact, order, sign-up, support, comment): a 🙏 reaction pops on the button, a card says
     "We have your message and we are reading it", with a typing cue, then the reference number when the
     site's own form code shows it, a line that encourages them, and a "how do you feel?" emoji row.
   - The "Ask" assistant: the visitor's bubble gets a reaction and a short typing cue before each answer.
   - Other code can call it: Warm.ack({kind, name, ref}), Warm.react(element, '🎉'), Warm.typing(true|false), Warm.note('text').
   - Events for other scripts (karma.js listens): 'warm:sent' {kind, ref} once a reference is shown, 'warm:feeling' {feeling, ref}.
   It never sends anything anywhere and stores nothing. It only says "received" when the site's form code says so.
   Turn it off for one form with data-warm="off". Change any wording with window.WARM_TEXT before this file loads.
   The sites' Content-Security-Policy has no 'unsafe-inline', so styles go in a constructed stylesheet inside a shadow root. */
(function () {
  if (window.Warm) return;
  var D = document;

  var SITES = {
    learn: { name: 'House for Learning', lines: [
      'Every big journey starts with one honest question. You just asked yours.',
      'You are already learning: reaching out is the first lesson.',
      'Small steps every day add up to a new life. We will walk with you.'] },
    hflgi: { name: 'HFL Global Investments', lines: [
      'Every lasting fortune began as one careful conversation.',
      'Your plans deserve patience and care. You will get both here.',
      'Growth is a team sport. Welcome to the team.'] },
    pass: { name: 'HFL-Pass', lines: [
      'Your work has value. We are here to help the world see it.',
      'One step today, one more tomorrow. You are on your way.',
      'You are not alone in this. We are right here with you.'] },
    any: { name: '', lines: [
      'Thank you for trusting us with this. It matters to us.',
      'You reached out, and that takes courage. We are with you.',
      'Every good thing begins with a conversation. This is ours.'] }
  };

  var T = Object.assign({
    received: 'Thank you{name}. We have your message and we are reading it now.',
    working: 'Sending',
    done: 'Received. Your reference is {ref}. A real person reads every message, and we will reply soon.',
    doneNoRef: 'Thank you for reaching out. A real person reads every message that reaches us.',
    fail: 'That did not go through yet. Your words are still in the form, so please tap send again.',
    feel: 'How are you feeling right now?',
    felt: 'Thank you for telling us. We will keep that in mind when we reply.',
    close: 'Close'
  }, window.WARM_TEXT || {});

  var KINDS = [
    [/order|buy|cart|checkout|quote|purchase|pay/i, '🎉'],
    [/join|register|sign.?up|enrol|enroll|member|apply/i, '🌱'],
    [/support|help|problem|issue|complain|fault|ticket/i, '🛟'],
    [/feedback|idea|suggest|comment|review|rate/i, '💡'],
    [/partner|supplier|vendor|b2b|institution|invest/i, '🤝']
  ];
  var FEELINGS = ['😊', '🙏', '💪', '❤️', '😟'];

  function site() {
    var b = D.body ? D.body.classList : { contains: function () { return false; } };
    if (b.contains('learn') || /houseforlearning/i.test(location.hostname)) return SITES.learn;
    if (/investments/i.test(location.hostname)) return SITES.hflgi;
    if (/hfl-?pass/i.test(location.hostname)) return SITES.pass;
    return SITES.any;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] == null ? '' : o[k]; }); }
  function kindEmoji(text) { for (var i = 0; i < KINDS.length; i++) if (KINDS[i][0].test(text || '')) return KINDS[i][1]; return '🙏'; }
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CSS = ':host{all:initial}*{box-sizing:border-box}' +
    '.card{position:fixed;left:20px;bottom:20px;z-index:2147482999;width:min(380px,calc(100vw - 32px));background:#fffdf8;color:#1d2a3a;' +
    'border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.25);padding:16px 16px 14px 16px;font:15px/1.45 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;border:1px solid rgba(0,0,0,.06)}' +
    '.top{display:flex;gap:12px;align-items:flex-start}.big{font-size:34px;line-height:1;flex:none}' +
    '.msg{flex:1}.msg b{display:block;font-size:15.5px;margin-bottom:2px}.line{margin:8px 0 0;font-style:italic;color:#5a4a2a}.note{margin-top:6px;font-weight:700;color:#b7791f}' +
    '.x{background:none;border:0;font-size:22px;line-height:1;cursor:pointer;color:inherit;width:32px;height:32px;margin:-6px -6px 0 0;flex:none}' +
    '.dots{display:inline-flex;gap:4px;margin-left:6px;vertical-align:middle}.dots i{width:7px;height:7px;border-radius:50%;background:#c98b2b;display:block}' +
    '.feel{margin-top:10px;border-top:1px dashed rgba(0,0,0,.15);padding-top:8px;font-size:13px}.feel div{display:flex;gap:6px;margin-top:6px}' +
    '.feel button{font-size:22px;background:#f4efe3;border:0;border-radius:999px;width:42px;height:42px;cursor:pointer}' +
    '.feel button:hover,.feel button:focus-visible{background:#ecdcb8}' +
    'button:focus-visible{outline:3px solid #c98b2b;outline-offset:2px}' +
    '.bad .big{filter:saturate(.6)}.pop{position:fixed;z-index:2147483002;font-size:30px;pointer-events:none}' +
    '@media (max-width:480px){.card{left:8px;right:8px;width:auto;bottom:76px}}' +
    '@media (prefers-color-scheme:dark){.card{background:#1d2633;color:#eef2f7;border-color:rgba(255,255,255,.08)}.line{color:#e8cf9a}.feel button{background:#2a3546}.feel button:hover{background:#3a4a60}}' +
    '@media (prefers-reduced-motion:no-preference){.card{animation:in .28s cubic-bezier(.2,.9,.3,1.3)}' +
    '@keyframes in{from{opacity:0;transform:translateY(14px) scale(.96)}}' +
    '.big{animation:beat 1.2s ease-in-out 2}@keyframes beat{50%{transform:scale(1.18)}}' +
    '.dots i{animation:d 1s infinite ease-in-out}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}' +
    '@keyframes d{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}' +
    '.pop{animation:pop .9s ease-out forwards}@keyframes pop{0%{opacity:0;transform:scale(.4)}25%{opacity:1;transform:scale(1.25)}100%{opacity:0;transform:translateY(-46px) scale(1)}}}';

  function sheet() { try { var s = new CSSStyleSheet(); s.replaceSync(CSS); return s; } catch (e) { return null; } }

  var R = null;
  function root() {
    if (R) return R;
    var host = D.createElement('div'); host.id = 'warm-reply'; D.body.appendChild(host);
    R = host.attachShadow({ mode: 'open' });
    var s = sheet(); if (s) R.adoptedStyleSheets = [s];
    return R;
  }
  function el(t, c, txt) { var e = D.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }

  /* A small emoji that floats up from an element, like a reaction on a chat message. */
  function react(target, emoji) {
    var r = root(), p = el('span', 'pop', emoji || '🙏'), b = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;
    p.setAttribute('aria-hidden', 'true');
    p.style.left = ((b ? b.right - 18 : innerWidth / 2)) + 'px';
    p.style.top = ((b ? b.top - 12 : innerHeight / 2)) + 'px';
    r.appendChild(p); setTimeout(function () { p.remove(); }, still ? 600 : 1000);
  }

  var card = null, timer = null;
  function closeCard() { if (card) { card.remove(); card = null; } clearTimeout(timer); }
  function later(ms) {
    clearTimeout(timer);
    timer = setTimeout(function () { if (card && !card.matches(':hover') && !card.contains(R.activeElement)) closeCard(); else later(4000); }, ms);
  }

  /* The card: state is 'working', 'done' or 'fail'. */
  function ack(o) {
    o = o || {};
    var S = site(), r = root(), emoji = o.emoji || kindEmoji(o.kind);
    if (!card) {
      card = el('section', 'card'); card.setAttribute('role', 'status'); card.setAttribute('aria-live', 'polite');
      card.setAttribute('aria-label', (S.name ? S.name + ': ' : '') + 'message received');
      r.appendChild(card);
    }
    card.className = 'card' + (o.state === 'fail' ? ' bad' : '');
    card.innerHTML = '';
    var top = el('div', 'top'), big = el('div', 'big', o.state === 'fail' ? '💛' : emoji), msg = el('div', 'msg'), x = el('button', 'x', '×');
    big.setAttribute('aria-hidden', 'true'); x.setAttribute('aria-label', T.close); x.onclick = closeCard;
    var nm = o.name ? ', ' + String(o.name).split(' ')[0] : '';
    msg.appendChild(el('b', null, o.text || (o.state === 'fail' ? T.fail : fill(T.received, { name: nm }))));
    var sub = el('div');
    if (o.state === 'working') {
      sub.appendChild(D.createTextNode(T.working));
      var dots = el('span', 'dots'); dots.setAttribute('aria-hidden', 'true');
      dots.appendChild(el('i')); dots.appendChild(el('i')); dots.appendChild(el('i')); sub.appendChild(dots);
    } else if (o.state !== 'fail') {
      sub.textContent = o.ref ? fill(T.done, { ref: o.ref }) : T.doneNoRef;
    }
    msg.appendChild(sub);
    if (o.state !== 'fail') msg.appendChild(el('p', 'line', o.line || pick(S.lines)));
    top.appendChild(big); top.appendChild(msg); top.appendChild(x); card.appendChild(top);
    if (o.state === 'done') {
      var f = el('div', 'feel'); f.appendChild(D.createTextNode(T.feel)); var row = el('div');
      FEELINGS.forEach(function (e) {
        var b = el('button', null, e); b.type = 'button'; b.setAttribute('aria-label', 'I feel ' + e);
        b.onclick = function () {
          react(b, e === '😟' ? '🤗' : '💛');
          f.textContent = T.felt;
          try { D.dispatchEvent(new CustomEvent('warm:feeling', { detail: { feeling: e, ref: o.ref || '', page: location.pathname } })); } catch (er) {}
          later(5000);
        };
        row.appendChild(b);
      });
      f.appendChild(row); card.appendChild(f);
    }
    later(o.state === 'working' ? 20000 : 14000);
    return card;
  }

  /* A quiet typing cue anywhere on the card (for other code, such as a live chat). */
  function typing(on) { if (on) ack({ state: 'working', text: T.received.replace('{name}', '') }); else closeCard(); }

  /* Forms: react at once, then follow the site's own status line for the real result. */
  var REF = /reference(?: number)?(?: is)?[:\s]+([A-Z0-9][A-Z0-9-]{3,})/i;
  var BAD = /sorry|could not|couldn't|not saved|not sent|try again|error|failed|please (fill|enter|choose)/i;
  function fieldName(f) { var n = f.querySelector('[name=name],[name=fullname],[name=full_name],[name=first_name],[name=firstName],[autocomplete=name],[autocomplete=given-name]'); return n && n.value ? n.value.trim() : ''; }
  function describe(f) { return [f.getAttribute('data-kind'), f.getAttribute('data-subject'), f.id, f.className, f.getAttribute('action'), f.getAttribute('aria-label'), location.pathname].join(' '); }

  D.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.nodeName !== 'FORM' || f.getAttribute('data-warm') === 'off') return;
    if (/search/i.test((f.getAttribute('role') || '') + ' ' + (f.getAttribute('action') || '')) || f.querySelector('input[type=search]')) return;
    if (f.checkValidity && !f.checkValidity()) return;
    var kind = describe(f), name = fieldName(f), btn = f.querySelector('[type=submit],button:not([type])');
    /* A form in steps sends "submit" for each Next: wait for the site's status line before saying anything. */
    var stepped = f.hasAttribute('data-steps');
    var out = f.querySelector('.form-status,[role=status],[aria-live]');
    if (!stepped) { react(btn || f, kindEmoji(kind)); ack({ state: 'working', kind: kind, name: name }); }
    if (!out) { if (!stepped) setTimeout(function () { ack({ state: 'done', kind: kind, name: name }); }, 1400); return; }
    if (f._warm) f._warm.disconnect();
    var settled = false, start = (out.textContent || '').trim();
    function check() {
      if (settled) return;
      var t = (out.textContent || '').trim(); if (!t || t === start || /^sending/i.test(t)) return;
      settled = true; mo.disconnect();
      if (stepped) react(btn || f, kindEmoji(kind));
      if (out.getAttribute('role') === 'alert' || BAD.test(t)) ack({ state: 'fail', kind: kind });
      else {
        var m = t.match(REF), rf = m ? m[1].replace(/[.,]$/, '') : '';
        ack({ state: 'done', kind: kind, name: name, ref: rf });
        try { D.dispatchEvent(new CustomEvent('warm:sent', { detail: { kind: kind, ref: rf, page: location.pathname } })); } catch (er) {}
      }
    }
    var mo = new MutationObserver(check); f._warm = mo; mo.observe(out, { childList: true, characterData: true, subtree: true, attributes: true });
    setTimeout(function () { if (!settled) { settled = true; mo.disconnect(); } }, 30000);
  }, true);

  /* The "Ask" assistant (ask.js): a reaction on the visitor's bubble and a typing cue before the answer. */
  var CHAT_CSS = '.wdots{align-self:flex-start;display:flex;gap:4px;padding:11px 14px;border-radius:14px;background:rgba(0,0,0,.06)}' +
    '.wdots i{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.5;display:block}' +
    '.bub.me{position:relative}.wreact{position:absolute;right:-6px;bottom:-10px;font-size:15px;background:#fff;border-radius:999px;padding:1px 4px;box-shadow:0 2px 6px rgba(0,0,0,.18)}' +
    '.bub.wwait{display:none}' +
    '@media (prefers-reduced-motion:no-preference){.wdots i{animation:d 1s infinite}.wdots i:nth-child(2){animation-delay:.15s}.wdots i:nth-child(3){animation-delay:.3s}' +
    '@keyframes d{0%,80%,100%{opacity:.25}40%{opacity:.9}}.wreact{animation:wr .4s cubic-bezier(.2,.9,.3,1.5)}@keyframes wr{from{transform:scale(0)}}}';
  function hookChat() {
    var host = D.getElementById('hx-ask'), sr = host && host.shadowRoot, log = sr && sr.querySelector('.log');
    if (!log || log.getAttribute('data-warm')) return !!log;
    log.setAttribute('data-warm', '1');
    try { var s = new CSSStyleSheet(); s.replaceSync(CHAT_CSS); sr.adoptedStyleSheets = sr.adoptedStyleSheets.concat([s]); } catch (e) {}
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, function (n) {
          if (!n.classList) return;
          if (n.classList.contains('me') && !n.querySelector('.wreact')) {
            var r = el('span', 'wreact', kindEmoji(n.textContent) === '🙏' ? '👍' : kindEmoji(n.textContent)); r.setAttribute('aria-hidden', 'true'); n.appendChild(r);
          }
          if (n.classList.contains('bot') && n.previousElementSibling && n.previousElementSibling.classList.contains('me')) {
            n.classList.add('wwait');
            var d = el('div', 'wdots'); d.setAttribute('aria-label', 'typing'); d.appendChild(el('i')); d.appendChild(el('i')); d.appendChild(el('i'));
            log.insertBefore(d, n); log.scrollTop = log.scrollHeight;
            setTimeout(function () { d.remove(); n.classList.remove('wwait'); log.scrollTop = log.scrollHeight; }, still ? 250 : 650 + Math.min(900, n.textContent.length * 4));
          }
        });
      });
    }).observe(log, { childList: true });
    return true;
  }
  function watchChat() {
    if (hookChat()) return;
    var n = 0, iv = setInterval(function () { if (hookChat() || ++n > 40) clearInterval(iv); }, 250);
    D.addEventListener('click', function () { setTimeout(hookChat, 0); }, true);
  }

  /* Add one short line to the open card (karma.js uses it for "+5 karma"). */
  function note(text) { if (!card) return; var n = el('div', 'note', text); var m = card.querySelector('.msg'); (m || card).appendChild(n); later(9000); }

  window.Warm = { ack: ack, react: react, typing: typing, close: closeCard, note: note };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', watchChat); else watchChat();
})();
