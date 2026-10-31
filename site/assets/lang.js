/* Language menu: one click opens this page in an automatic translation, English stays the base and official text.
   Under the site's Content-Security-Policy no outside script runs here: choosing a language is a normal link to the
   public web-page translation service (translate.google.com/translate?sl=en&tl=CODE&u=PAGE). It works once the site
   is at a public address; on local preview files it cannot fetch the page. The chosen code is kept in localStorage
   only to preselect it next time. Same file on all three group sites. */
(function () {
  var KEY = 'site-lang';
  var SVC = 'https://translate.google.com/translate?sl=en&tl=';
  var NOTE = 'This page will open in an automatic translation by an outside service. The English page is the official version.';
  /* [code used by the service, name in its own language, English name, 1 = right-to-left] */
  var LANGS = [["ab","Аԥсшәа","Abkhaz"],["ace","Bahsa Acèh","Acehnese"],["ach","Lwo","Acholi"],["aa","Qafaraf","Afar"],["af","Afrikaans","Afrikaans"],["sq","Shqip","Albanian"],["alz","Alur","Alur"],["am","አማርኛ","Amharic"],["ar","العربية","Arabic",1],["hy","Հայերեն","Armenian"],["as","অসমীয়া","Assamese"],["av","Авар мацӀ","Avar"],["awa","अवधी","Awadhi"],["ay","Aymar aru","Aymara"],["az","Azərbaycan","Azerbaijani"],["ban","Basa Bali","Balinese"],["bal","بلوچی","Baluchi",1],["bm","Bamanankan","Bambara"],["bci","Wawle","Baoulé"],["ba","Башҡорт теле","Bashkir"],["eu","Euskara","Basque"],["btx","Batak Karo","Batak Karo"],["bts","Batak Simalungun","Batak Simalungun"],["bbc","Batak Toba","Batak Toba"],["be","Беларуская","Belarusian"],["bem","Ichibemba","Bemba"],["bn","বাংলা","Bengali"],["bew","Betawi","Betawi"],["bho","भोजपुरी","Bhojpuri"],["bik","Bikol","Bikol"],["bs","Bosanski","Bosnian"],["br","Brezhoneg","Breton"],["bg","Български","Bulgarian"],["bua","Буряад хэлэн","Buryat"],["yue","粵語","Cantonese"],["ca","Català","Catalan"],["ceb","Sinugbuanong Binisayâ","Cebuano"],["ch","Chamoru","Chamorro"],["ce","Нохчийн","Chechen"],["ny","Chichewa","Chichewa"],["zh-CN","中文（简体）","Chinese (Simplified)"],["zh-TW","中文（繁體）","Chinese (Traditional)"],["chk","Chuuk","Chuukese"],["cv","Чӑваш","Chuvash"],["co","Corsu","Corsican"],["crh","Къырымтатар тили","Crimean Tatar (Cyrillic)"],["crh-Latn","Qırımtatar tili","Crimean Tatar (Latin)"],["hr","Hrvatski","Croatian"],["cs","Čeština","Czech"],["da","Dansk","Danish"],["fa-AF","دری","Dari",1],["dv","ދިވެހި","Dhivehi",1],["din","Thuɔŋjäŋ","Dinka"],["doi","डोगरी","Dogri"],["dov","Dombe","Dombe"],["nl","Nederlands","Dutch"],["dyu","Julakan","Dyula"],["dz","རྫོང་ཁ","Dzongkha"],["eo","Esperanto","Esperanto"],["et","Eesti","Estonian"],["ee","Eʋegbe","Ewe"],["fo","Føroyskt","Faroese"],["fj","Vosa Vakaviti","Fijian"],["tl","Filipino","Filipino"],["fi","Suomi","Finnish"],["fon","Fɔngbè","Fon"],["fr","Français","French"],["fr-CA","Français (Canada)","French (Canada)"],["fy","Frysk","Frisian"],["fur","Furlan","Friulian"],["ff","Fulfulde","Fulani"],["gaa","Gã","Ga"],["gl","Galego","Galician"],["ka","Ქართული","Georgian"],["de","Deutsch","German"],["el","Ελληνικά","Greek"],["gn","Avañeʼẽ","Guarani"],["gu","ગુજરાતી","Gujarati"],["ht","Kreyòl ayisyen","Haitian Creole"],["cnh","Hakha Lai","Hakha Chin"],["ha","Hausa","Hausa"],["haw","ʻŌlelo Hawaiʻi","Hawaiian"],["iw","עברית","Hebrew",1],["hil","Hiligaynon","Hiligaynon"],["hi","हिन्दी","Hindi"],["hmn","Hmoob","Hmong"],["hu","Magyar","Hungarian"],["hrx","Hunsrik","Hunsrik"],["iba","Jaku Iban","Iban"],["is","Íslenska","Icelandic"],["ig","Igbo","Igbo"],["ilo","Ilokano","Ilocano"],["id","Bahasa Indonesia","Indonesian"],["iu-Latn","Inuktut","Inuktut (Latin)"],["iu","ᐃᓄᒃᑎᑐᑦ","Inuktut (Syllabics)"],["ga","Gaeilge","Irish"],["it","Italiano","Italian"],["jam","Patwa","Jamaican Patois"],["ja","日本語","Japanese"],["jw","Basa Jawa","Javanese"],["kac","Jinghpaw","Jingpo"],["kl","Kalaallisut","Kalaallisut"],["kn","ಕನ್ನಡ","Kannada"],["kr","Kanuri","Kanuri"],["pam","Kapampangan","Kapampangan"],["kk","Қазақ тілі","Kazakh"],["kha","Ka Ktien Khasi","Khasi"],["km","ខ្មែរ","Khmer"],["cgg","Rukiga","Kiga"],["kg","Kikongo","Kikongo"],["rw","Ikinyarwanda","Kinyarwanda"],["ktu","Kituba","Kituba"],["trp","Kokborok","Kokborok"],["kv","Коми кыв","Komi"],["gom","कोंकणी","Konkani"],["ko","한국어","Korean"],["kri","Krio","Krio"],["ku","Kurdî (Kurmancî)","Kurdish (Kurmanji)"],["ckb","کوردی (سۆرانی)","Kurdish (Sorani)",1],["ky","Кыргызча","Kyrgyz"],["lo","ລາວ","Lao"],["ltg","Latgaļu","Latgalian"],["la","Latina","Latin"],["lv","Latviešu","Latvian"],["lij","Ligure","Ligurian"],["li","Limburgs","Limburgish"],["ln","Lingála","Lingala"],["lt","Lietuvių","Lithuanian"],["lmo","Lombard","Lombard"],["lg","Luganda","Luganda"],["luo","Dholuo","Luo"],["lb","Lëtzebuergesch","Luxembourgish"],["mk","Македонски","Macedonian"],["mad","Madhura","Madurese"],["mai","मैथिली","Maithili"],["mak","Mangkasara","Makassar"],["mg","Malagasy","Malagasy"],["ms","Bahasa Melayu","Malay"],["ms-Arab","بهاس ملايو (جاوي)","Malay (Jawi)",1],["ml","മലയാളം","Malayalam"],["mt","Malti","Maltese"],["mam","Mam","Mam"],["gv","Gaelg","Manx"],["mi","Māori","Maori"],["mr","मराठी","Marathi"],["mh","Kajin M̧ajeļ","Marshallese"],["mwr","मारवाड़ी","Marwadi"],["mfe","Kreol morisien","Mauritian Creole"],["chm","Олык марий","Meadow Mari"],["mni-Mtei","ꯃꯤꯇꯩꯂꯣꯟ","Meiteilon (Manipuri)"],["min","Baso Minang","Minang"],["lus","Mizo ṭawng","Mizo"],["mn","Монгол","Mongolian"],["my","မြန်မာ","Myanmar (Burmese)"],["nhe","Nāhuatl (Huasteca)","Nahuatl (Eastern Huasteca)"],["ndc-ZW","Cindau","Ndau"],["nr","IsiNdebele","Ndebele (South)"],["new","नेपाल भाषा","Nepalbhasa (Newari)"],["ne","नेपाली","Nepali"],["bm-Nkoo","ߒߞߏ","NKo",1],["no","Norsk","Norwegian"],["nus","Thok Naath","Nuer"],["oc","Occitan","Occitan"],["or","ଓଡ଼ିଆ","Odia (Oriya)"],["om","Oromoo","Oromo"],["os","Ирон","Ossetian"],["pag","Pangasinan","Pangasinan"],["pap","Papiamentu","Papiamento"],["ps","پښتو","Pashto",1],["fa","فارسی","Persian",1],["pl","Polski","Polish"],["pt","Português (Brasil)","Portuguese"],["pt-PT","Português (Portugal)","Portuguese (Portugal)"],["pa","ਪੰਜਾਬੀ","Punjabi"],["pa-Arab","پنجابی (شاہ مکھی)","Punjabi (Shahmukhi)",1],["qu","Runasimi","Quechua"],["kek","Qʼeqchiʼ","Qʼeqchiʼ"],["rom","Romani čhib","Romani"],["ro","Română","Romanian"],["rn","Ikirundi","Rundi"],["ru","Русский","Russian"],["se","Davvisámegiella","Sami (North)"],["sm","Gagana Sāmoa","Samoan"],["sg","Sängö","Sango"],["sa","संस्कृतम्","Sanskrit"],["sat-Latn","Santali (Latin)","Santali (Latin)"],["sat","ᱥᱟᱱᱛᱟᱲᱤ","Santali (Ol Chiki)"],["gd","Gàidhlig","Scots Gaelic"],["nso","Sesotho sa Leboa","Sepedi"],["sr","Српски","Serbian"],["st","Sesotho","Sesotho"],["crs","Kreol Seselwa","Seychellois Creole"],["shn","လိၵ်ႈတႆး","Shan"],["sn","ChiShona","Shona"],["scn","Sicilianu","Sicilian"],["szl","Ślōnski","Silesian"],["sd","سنڌي","Sindhi",1],["si","සිංහල","Sinhala"],["sk","Slovenčina","Slovak"],["sl","Slovenščina","Slovenian"],["so","Soomaali","Somali"],["es","Español","Spanish"],["su","Basa Sunda","Sundanese"],["sus","Sosoxui","Susu"],["sw","Kiswahili","Swahili"],["ss","SiSwati","Swati"],["sv","Svenska","Swedish"],["ty","Reo Tahiti","Tahitian"],["tg","Тоҷикӣ","Tajik"],["ber-Latn","Tamaziɣt","Tamazight"],["ber","ⵜⴰⵎⴰⵣⵉⵖⵜ","Tamazight (Tifinagh)"],["ta","தமிழ்","Tamil"],["tt","Татар","Tatar"],["te","తెలుగు","Telugu"],["tet","Tetun","Tetum"],["th","ไทย","Thai"],["bo","བོད་སྐད།","Tibetan"],["ti","ትግርኛ","Tigrinya"],["tiv","Tiv","Tiv"],["tpi","Tok Pisin","Tok Pisin"],["to","Lea faka-Tonga","Tongan"],["lua","Tshiluba","Tshiluba"],["ts","Xitsonga","Tsonga"],["tn","Setswana","Tswana"],["tcy","ತುಳು","Tulu"],["tum","Chitumbuka","Tumbuka"],["tr","Türkçe","Turkish"],["tk","Türkmen dili","Turkmen"],["tyv","Тыва дыл","Tuvan"],["ak","Twi","Twi"],["udm","Удмурт кыл","Udmurt"],["uk","Українська","Ukrainian"],["ur","اردو","Urdu",1],["ug","ئۇيغۇرچە","Uyghur",1],["uz","O‘zbek","Uzbek"],["ve","Tshivenḓa","Venda"],["vec","Vèneto","Venetian"],["vi","Tiếng Việt","Vietnamese"],["war","Winaray","Waray"],["cy","Cymraeg","Welsh"],["wo","Wolof","Wolof"],["xh","IsiXhosa","Xhosa"],["sah","Саха тыла","Yakut"],["yi","ייִדיש","Yiddish",1],["yo","Èdè Yorùbá","Yoruba"],["yua","Maaya tʼaan","Yucatec Maya"],["zap","Diidxazá","Zapotec"],["zu","IsiZulu","Zulu"]];
  var TAG = {"iw":"he","jw":"jv","zh-CN":"zh-Hans","zh-TW":"zh-Hant","bm-Nkoo":"nqo","ber":"zgh","fa-AF":"prs","tl":"fil","ndc-ZW":"ndc"};
  var panel, q, list, none, confirmBox, go, opener, more, req, pick = null;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function el(t, cls, txt) { var e = document.createElement(t); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function fold(s) { s = String(s).toLowerCase(); return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s; }

  /* On the translated copy (host ends in .translate.goog) English goes back to the original address. */
  function original() {
    var h = location.hostname, m = /^(.+)\.translate\.goog$/.exec(h);
    if (!m) return null;
    var host = m[1].replace(/--/g, '\u0000').replace(/-/g, '.').replace(/\u0000/g, '-');
    var qs = location.search.replace(/^\?/, '').split('&').filter(function (p) { return p && p.indexOf('_x_tr_') !== 0; }).join('&');
    return 'https://' + host + location.pathname + (qs ? '?' + qs : '') + location.hash;
  }
  function target(code) {
    var page = original() || location.href;
    return SVC + encodeURIComponent(code) + '&u=' + encodeURIComponent(page);
  }

  function option(code, nat, en, rtl) {
    var li = el('li'), b = el('button', 'lang-opt');
    b.type = 'button';
    b.setAttribute('data-code', code);
    var n = el('span', 'lang-nat', nat);
    n.setAttribute('lang', TAG[code] || code);
    n.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    b.appendChild(n);
    if (en !== nat) { var e = el('span', 'lang-en', en); e.setAttribute('lang', 'en'); b.appendChild(e); }
    b.setAttribute('data-find', fold(nat + ' ' + en + ' ' + code));
    li.appendChild(b);
    return li;
  }

  function section(t) { var li = el('li', 'lang-sec'); li.setAttribute('role', 'presentation'); li.appendChild(el('span', null, t)); return li; }
  function closeIcon() {
    var NS = 'http://www.w3.org/2000/svg', g = document.createElementNS(NS, 'svg'), p = document.createElementNS(NS, 'path');
    g.setAttribute('viewBox', '0 0 24 24'); g.setAttribute('aria-hidden', 'true'); g.setAttribute('focusable', 'false');
    p.setAttribute('d', 'M6 6l12 12M18 6L6 18'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round');
    g.appendChild(p); return g;
  }
  function build() {
    if (panel) return;
    panel = el('div', 'lang-panel');
    panel.id = 'lang-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'lang-title');
    panel.setAttribute('translate', 'no');
    panel.hidden = true;
    var top = el('div', 'lang-top'), title = el('p', 'lang-title', 'Language');
    title.id = 'lang-title';
    var x = el('button', 'lang-x');
    x.appendChild(closeIcon());
    x.type = 'button';
    x.setAttribute('aria-label', 'Close the language menu');
    x.setAttribute('data-lang-close', '');
    top.appendChild(title); top.appendChild(x);
    var lab = el('label', 'lang-lab', 'Search languages');
    lab.setAttribute('for', 'lang-q');
    q = el('input', 'lang-q');
    q.id = 'lang-q'; q.type = 'search'; q.autocomplete = 'off'; q.spellcheck = false;
    q.setAttribute('placeholder', 'Type a language name');
    q.setAttribute('aria-controls', 'lang-list');
    var hint = el('p', 'lang-hint', 'Most browsers can also translate a page for you: look for Translate in the browser menu.');
    list = el('ul', 'lang-list');
    list.id = 'lang-list';
    list.setAttribute('aria-label', 'Languages');
    list.appendChild(option('en', 'English', 'English (official)', 0));
    /* Languages most of our visitors use first, then every other language A to Z. */
    var TOP = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'ur', 'ar', 'fr', 'es', 'zh-CN', 'ms', 'tl', 'pt', 'de', 'ja'];
    var byCode = {}, i;
    for (i = 0; i < LANGS.length; i++) byCode[LANGS[i][0]] = LANGS[i];
    list.appendChild(section('Most used'));
    TOP.forEach(function (c) { var L = byCode[c]; if (L) list.appendChild(option(L[0], L[1], L[2], L[3])); });
    list.appendChild(section('All languages'));
    for (i = 0; i < LANGS.length; i++) if (TOP.indexOf(LANGS[i][0]) === -1) list.appendChild(option(LANGS[i][0], LANGS[i][1], LANGS[i][2], LANGS[i][3]));
    none = el('p', 'lang-none', 'No language matches that search. Use “My language is not here” below and we will add it.');
    none.hidden = true;
    var count = el('p', 'lang-count', (LANGS.length + 1) + ' languages');
    confirmBox = el('div', 'lang-confirm');
    confirmBox.hidden = true;
    var note = el('p', 'lang-note', NOTE);
    note.id = 'lang-note';
    var acts = el('div', 'lang-acts');
    go = el('a', 'btn btn-sm lang-go', 'Continue');
    go.href = '#';
    go.setAttribute('aria-describedby', 'lang-note');
    var back = el('button', 'btn btn-sm btn-ghost lang-back', 'Back to the list');
    back.type = 'button';
    acts.appendChild(go); acts.appendChild(back);
    confirmBox.appendChild(note); confirmBox.appendChild(acts);
    /* Owner 20 Oct 2026: no one is left out. The list above is what automatic translation covers; every other
       language, dialect and sign language is added by people. A visitor can ask for theirs: the request opens the
       visitor's own email app addressed to this site's contact address (nothing is sent or stored by this page). */
    more = el('div', 'lang-more');
    more.appendChild(el('p', 'lang-sub', 'Your language is not in the list?'));
    more.appendChild(el('p', 'lang-more-p', 'The ' + (LANGS.length + 1) + ' languages above come from automatic translation. Every other language, dialect and sign language is added by people: community translators and recorded voices, one at a time. Tell us which one you need. The most-asked go first.'));
    var ask = el('button', 'btn btn-sm lang-ask', 'My language is not here');
    ask.type = 'button'; ask.setAttribute('aria-expanded', 'false'); ask.setAttribute('aria-controls', 'lang-req');
    more.appendChild(ask);
    req = el('form', 'lang-req'); req.id = 'lang-req'; req.hidden = true; req.noValidate = false;
    function field(id, label, input) { var w = el('div', 'lang-field'), l = el('label', null, label); l.setAttribute('for', id); input.id = id; w.appendChild(l); w.appendChild(input); req.appendChild(w); return input; }
    var rn = el('input'); rn.type = 'text'; rn.required = true; rn.autocomplete = 'off'; rn.maxLength = 80;
    field('lang-r-name', 'Language or dialect', rn);
    var rw = el('input'); rw.type = 'text'; rw.autocomplete = 'off'; rw.maxLength = 120;
    field('lang-r-where', 'Where it is spoken (optional)', rw);
    var rk = el('select');
    ['Written text', 'Spoken, read aloud', 'Sign language video', 'Easy read, simple words'].forEach(function (t) { var o = el('option', null, t); o.value = t; rk.appendChild(o); });
    field('lang-r-kind', 'How you want it', rk);
    var send = el('button', 'btn btn-sm', 'Send request'); send.type = 'submit';
    var rst = el('p', 'lang-more-p lang-r-status'); rst.setAttribute('role', 'status');
    req.appendChild(send); req.appendChild(rst);
    more.appendChild(req);
    ask.addEventListener('click', function () {
      var on = req.hidden; req.hidden = !on; ask.setAttribute('aria-expanded', String(on));
      if (on) { if (!rn.value && q.value.trim()) rn.value = q.value.trim(); req.scrollIntoView({ block: 'nearest' }); rn.focus({ preventScroll: true }); }
    });
    req.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!rn.value.trim()) { rn.focus(); return; }
      var c = document.querySelector('[data-email]'), to = c ? c.getAttribute('data-email') : '';
      if (!to) { rst.textContent = 'Please use the Contact page to tell us.'; return; }
      var body = 'Language or dialect: ' + rn.value.trim() + '\nWhere it is spoken: ' + (rw.value.trim() || '-') + '\nHow I want it: ' + rk.value + '\nPage: ' + location.href;
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Language request: ' + rn.value.trim()) + '&body=' + encodeURIComponent(body);
      rst.textContent = 'Your email app has opened with your request to ' + to + '. Please press Send there. Thank you.';
    });
    more.appendChild(el('p', 'lang-sub', 'Other ways to read'));
    more.appendChild(el('p', 'lang-more-p', 'Read aloud, easy read with simple words, larger text, and sign language (Indian, American, British and International Sign) where a signed version exists.'));
    var acc = el('button', 'btn btn-sm btn-ghost', 'Open reading and sign language choices'); acc.type = 'button';
    acc.addEventListener('click', function () { close(false); if (window.SiteAccess) window.SiteAccess.open(); });
    more.appendChild(acc);
    panel.appendChild(top); panel.appendChild(lab); panel.appendChild(q); panel.appendChild(hint);
    panel.appendChild(list); panel.appendChild(none); panel.appendChild(count); panel.appendChild(confirmBox);
    panel.appendChild(more);
    document.body.appendChild(panel);

    q.addEventListener('input', filter);
    back.addEventListener('click', function () { showList(); q.focus(); });
    go.addEventListener('click', function () { if (pick) put(pick); });
    list.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.lang-opt') : null;
      if (b) choose(b.getAttribute('data-code'));
    });
    panel.addEventListener('keydown', keys);
    panel.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (to && !panel.contains(to) && to !== opener) close(false);
    });
  }

  function visible() { return Array.prototype.filter.call(list.querySelectorAll('.lang-opt'), function (b) { return !b.parentNode.hidden; }); }
  function filter() {
    var t = fold(q.value.trim()), n = 0, items = list.children;
    for (var i = 0; i < items.length; i++) {
      if (items[i].className === 'lang-sec') { items[i].hidden = !!t; continue; }
      var hit = !t || items[i].firstChild.getAttribute('data-find').indexOf(t) !== -1;
      items[i].hidden = !hit;
      if (hit) n++;
    }
    none.hidden = n > 0;
    list.style.display = n > 0 ? '' : 'none';   /* no empty box when nothing matches */
  }
  function showList() {
    confirmBox.hidden = true;
    list.hidden = false; q.hidden = false;
    panel.querySelector('.lang-lab').hidden = false;
    panel.querySelector('.lang-hint').hidden = false;
    panel.querySelector('.lang-count').hidden = false;
    more.hidden = false;
    filter();
  }
  function choose(code) {
    if (code === 'en') {
      put('en');
      var o = original();
      if (o) { location.href = o; return; }
      close(true);
      return;
    }
    pick = code;
    go.href = target(code);
    list.hidden = true; q.hidden = true; none.hidden = true;
    panel.querySelector('.lang-lab').hidden = true;
    panel.querySelector('.lang-hint').hidden = true;
    panel.querySelector('.lang-count').hidden = true;
    more.hidden = true;
    confirmBox.hidden = false;
    go.focus();
  }

  function keys(e) {
    if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(true); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) === -1) return;
    var opts = visible(), i = opts.indexOf(document.activeElement);
    if (!opts.length || list.hidden) return;
    if (document.activeElement === q) {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault(); opts[0].focus(); return;
    }
    if (i === -1) return;
    e.preventDefault();
    if (e.key === 'ArrowDown') opts[Math.min(i + 1, opts.length - 1)].focus();
    else if (e.key === 'ArrowUp') { if (i === 0) q.focus(); else opts[i - 1].focus(); }
    else if (e.key === 'Home') opts[0].focus();
    else opts[opts.length - 1].focus();
  }

  function open(btn) {
    build();
    opener = btn;
    q.value = '';
    showList();
    var cur = get() || 'en', bs = list.querySelectorAll('.lang-opt');
    for (var i = 0; i < bs.length; i++) {
      var on = bs[i].getAttribute('data-code') === cur;
      if (on) bs[i].setAttribute('aria-current', 'true'); else bs[i].removeAttribute('aria-current');
    }
    panel.hidden = false;
    place(btn);
    var toggles = document.querySelectorAll('[data-lang-toggle]');
    for (var j = 0; j < toggles.length; j++) toggles[j].setAttribute('aria-expanded', String(toggles[j] === btn));
    var sel = list.querySelector('[aria-current="true"]');
    if (sel) list.scrollTop = Math.max(0, sel.parentNode.offsetTop - list.offsetTop - 8);
    q.focus();
  }
  /* Wide screens: open just under the button, kept inside the window. Phones: the stylesheet pins it below the header. */
  function place(btn) {
    var s = panel.style;
    s.top = ''; s.right = ''; s.maxHeight = '';
    if (window.innerWidth <= 640) return;
    var r = btn.getBoundingClientRect(), cw = document.documentElement.clientWidth, w = panel.offsetWidth || 380;
    var top = r.bottom + 8;
    if (top > window.innerHeight * 0.4) top = 16;   /* button low on the screen, e.g. inside an open menu */
    s.top = top + 'px';
    s.maxHeight = (window.innerHeight - top - 16) + 'px';
    s.right = Math.min(Math.max(16, cw - r.right), Math.max(16, cw - w - 16)) + 'px';
  }
  function close(refocus) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    var toggles = document.querySelectorAll('[data-lang-toggle]');
    for (var j = 0; j < toggles.length; j++) toggles[j].setAttribute('aria-expanded', 'false');
    if (refocus && opener && document.contains(opener)) opener.focus();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-lang-toggle]') : null;
    if (t) {
      if (panel && !panel.hidden && opener === t) close(true); else open(t);
      return;
    }
    if (e.target.closest && e.target.closest('[data-lang-close]')) { close(true); return; }
    if (panel && !panel.hidden && !panel.contains(e.target)) close(false);
  });
  window.SiteLang = { open: open, close: close, url: target };
})();

/* ---------------------------------------------------------------------------------------------
   Accessibility and learning style (owner rules, 19 and 20 Oct 2026). Same code on all group sites.
   Adds an "Accessibility" button next to the Language button and a panel with:
   - learning style (VARK: visual, aural, read/write, hands-on, or mixed),
   - seeing: text size, reading font (dyslexia-friendly or extra-clear, both open fonts we host),
     high contrast, colour-blind safe colours, reading spacing, underlined links, big cursor,
     reading ruler or line focus, simple-language view,
   - movement: stop animation and celebrations, pause everything that moves or plays,
   - hearing: captions for everything the site says aloud, in the page's language; sign-language choice,
   - alerts: keep messages on screen until they are closed,
   - immersive reader: clean text, read aloud with word highlight, line focus, syllables,
     word helper (picture and meaning where the page has one), translate,
   - listening: read the page aloud, or read what you click,
   - voice control: speak commands such as "go to contact", "scroll down", "read page",
   - speaking help: type a message and the device says it (for people who cannot speak),
   - moving: bigger buttons, strong focus, switch access (auto-scan), shortcuts off,
   - files: spreadsheet separator and byte-order mark for downloads,
   - "Check this page": a WCAG 2.2 AA check run in the browser, with a report to read or save.
   Uses only the browser's own features, no outside script. Choices are kept in this browser only
   ("site-access"); the members area profile uses the same field names (_shared/access-settings.json).
   Shortcut: Alt+Shift+A opens the panel (can be switched off). Target: WCAG 2.2 AA.
   --------------------------------------------------------------------------------------------- */
(function () {
  var KEY = 'site-access';
  var root = document.documentElement;
  var DEF = { ls: 'mixed', size: '100', font: 'site', contrast: false, cb: 'none', spacing: false, links: false, cursor: 'normal', ruler: 'off',
    simple: false, still: false, captions: false, sign: '', alerts: false, big: false, focus: false, scan: false, scanRate: '1.5', nokeys: false,
    rate: 1, sep: ',', bom: true };
  function fresh() { var o = {}; for (var k in DEF) o[k] = DEF[k]; return o; }
  var S = fresh();
  var synth = window.speechSynthesis || null;
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var rec = null, listening = false, reading = null, clickRead = false;
  function mq(q) { try { return window.matchMedia && window.matchMedia(q).matches; } catch (e) { return false; } }

  function load() {
    var v = {};
    try { v = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
    /* Follow the device's own settings until the visitor chooses otherwise. */
    if (!('still' in v) && mq('(prefers-reduced-motion: reduce)')) S.still = true;
    if (!('contrast' in v) && (mq('(prefers-contrast: more)') || mq('(forced-colors: active)'))) S.contrast = true;
    for (var k in v) if (k in S) S[k] = v[k];
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function el(t, cls, txt) { var e = document.createElement(t); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function main() { return document.getElementById('main') || document.querySelector('main') || document.body; }
  function tidy(n) { return (n.innerText || n.textContent || '').replace(/\s+/g, ' ').trim(); }
  function seen(n) { return n.offsetParent !== null || (n.getClientRects && n.getClientRects().length > 0); }
  var OURS = '.a11y-panel,.lang-panel,nav.a11y-map,.a11y-reader,.a11y-caption,.a11y-fab,.a11y-ruler,.a11y-sign';

  function apply() {
    root.setAttribute('data-ls', S.ls);
    ['100', '125', '150', '200'].forEach(function (z) { root.classList.toggle('a11y-t' + z, S.size === z && z !== '100'); });
    root.classList.toggle('a11y-font-dys', S.font === 'dyslexia');
    root.classList.toggle('a11y-font-clear', S.font === 'clear');
    root.classList.toggle('a11y-contrast', !!S.contrast);
    ['rg', 'by', 'mono'].forEach(function (c) { root.classList.toggle('a11y-cb-' + c, S.cb === c); });
    root.classList.toggle('a11y-spacing', !!S.spacing);
    root.classList.toggle('a11y-links', !!S.links);
    root.classList.toggle('a11y-cur-big', S.cursor === 'big');
    root.classList.toggle('a11y-cur-huge', S.cursor === 'huge');
    root.classList.toggle('a11y-simple', !!S.simple);
    root.classList.toggle('a11y-still', !!S.still);
    root.classList.toggle('a11y-big', !!S.big);
    root.classList.toggle('a11y-focus', !!S.focus || !!S.scan);
    root.classList.toggle('a11y-nokeys', !!S.nokeys);
    root.classList.toggle('a11y-alerts', !!S.alerts);
    pageMap();
    listenFab();
    ruler();
    simple();
    signSlots();
    scan(!!S.scan);
    if (S.still) pauseMoving(false);
  }

  /* ---------- captions bar: shows every word the site speaks, in the page's language ---------- */
  var cap = null, capText = null;
  function caption(text) {
    if (!S.captions && S.ls !== 'aural') return;
    if (!cap) {
      cap = el('div', 'a11y-caption'); cap.setAttribute('role', 'status'); cap.setAttribute('aria-live', 'polite');
      capText = el('span'); cap.appendChild(capText);
      var cx = el('button', 'a11y-caption-x', 'Close'); cx.type = 'button'; cx.addEventListener('click', function () { cap.hidden = true; });
      cap.appendChild(cx);
      cap.setAttribute('lang', root.getAttribute('lang') || 'en');
      document.body.appendChild(cap);
    }
    if (!text && S.alerts) return; /* "keep alerts on screen": the last caption stays until closed */
    capText.textContent = text;
    cap.hidden = !text;
  }

  /* ---------- speech out ---------- */
  function say(text, done, onWord) {
    if (!synth) { caption(text); if (done) done(); return; }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = root.getAttribute('lang') || 'en';
    u.rate = Number(S.rate) || 1;
    u.onstart = function () { caption(text); };
    u.onend = function () { if (done) done(); };
    u.onerror = function () { if (done) done(); };
    if (onWord) u.onboundary = function (e) { if (e.name === 'word' || e.name === undefined) onWord(e.charIndex); };
    synth.speak(u);
  }
  function stopAll() {
    if (synth) synth.cancel();
    if (reading) { reading.forEach(function (n) { n.classList.remove('a11y-reading'); }); reading = null; }
    caption('');
  }
  function readNodes(list) {
    stopAll();
    reading = list;
    var i = 0;
    (function next() {
      if (!reading || i >= list.length) { stopAll(); return; }
      var n = list[i++];
      list.forEach(function (m) { m.classList.remove('a11y-reading'); });
      n.classList.add('a11y-reading');
      if (n.scrollIntoView) n.scrollIntoView({ block: 'center', behavior: S.still ? 'auto' : 'smooth' });
      var t = tidy(n);
      if (t) say(t, next); else next();
    })();
  }
  function readable(scope) {
    return [].slice.call(scope.querySelectorAll('h1,h2,h3,p,li,td,th,figcaption,blockquote,dt,dd'))
      .filter(function (n) { return seen(n) && !n.closest(OURS) && !n.querySelector('p,li'); });
  }
  function readPage() { readNodes(readable(main())); }

  /* ---------- page map for visual, read/write and hands-on learners ---------- */
  function pageMap() {
    var old = document.querySelector('nav.a11y-map');
    if (old) old.parentNode.removeChild(old);
    if ((S.ls === 'mixed' || S.ls === 'aural') && !S.simple) return;
    var m = main(), hs = [].slice.call(m.querySelectorAll('h2')).filter(seen);
    var acts = S.ls === 'kin' ? [].slice.call(m.querySelectorAll('a.btn')).slice(0, 8) : [];
    if (!hs.length && !acts.length) return;
    var nav = el('nav', 'a11y-map');
    nav.setAttribute('aria-label', 'On this page');
    nav.appendChild(el('p', 'a11y-map-title', S.ls === 'kin' ? 'Steps on this page' : 'On this page'));
    var ol = el('ol');
    hs.forEach(function (x, i) {
      if (!x.id) x.id = 'sec-' + (i + 1);
      var a = el('a', null, tidy(x));
      a.href = '#' + x.id;
      var li = el('li'); li.appendChild(a); ol.appendChild(li);
    });
    nav.appendChild(ol);
    if (acts.length) {
      nav.appendChild(el('p', 'a11y-map-title', 'Things you can do here'));
      var ul = el('ul');
      acts.forEach(function (b) { var a = el('a', null, b.textContent.trim()); a.href = b.getAttribute('href'); var li = el('li'); li.appendChild(a); ul.appendChild(li); });
      nav.appendChild(ul);
    }
    m.insertBefore(nav, m.firstChild);
  }

  var fab = null;
  function listenFab() {
    var want = S.ls === 'aural' && !!synth;
    if (want && !fab) {
      fab = el('button', 'btn a11y-fab', 'Listen to this page');
      fab.type = 'button';
      fab.addEventListener('click', function () { if (reading) { stopAll(); fab.textContent = 'Listen to this page'; } else { readPage(); fab.textContent = 'Stop listening'; } });
      document.body.appendChild(fab);
    }
    if (fab) fab.hidden = !want;
  }

  /* ---------- reading ruler and line focus on the page ---------- */
  var rul = null, rulY = -1;
  function placeRuler(y) {
    if (!rul) return;
    rulY = y;
    var h = Math.max(36, parseFloat(getComputedStyle(document.body).fontSize || '16') * 2.2);
    var top = Math.max(0, y - h / 2);
    rul.band.style.top = top + 'px'; rul.band.style.height = h + 'px';
    rul.up.style.height = top + 'px';
    rul.down.style.top = (top + h) + 'px';
  }
  function ruler() {
    var want = S.ruler === 'line' || S.ruler === 'mask';
    if (want && !rul) {
      rul = { box: el('div', 'a11y-ruler'), up: el('div', 'a11y-ruler-up'), band: el('div', 'a11y-ruler-band'), down: el('div', 'a11y-ruler-down') };
      rul.box.setAttribute('aria-hidden', 'true');
      rul.box.appendChild(rul.up); rul.box.appendChild(rul.band); rul.box.appendChild(rul.down);
      document.body.appendChild(rul.box);
      document.addEventListener('pointermove', function (e) { if (rul && !rul.box.hidden && e.pointerType !== 'touch') placeRuler(e.clientY); }, { passive: true });
      document.addEventListener('pointerdown', function (e) { if (rul && !rul.box.hidden) placeRuler(e.clientY); }, { passive: true });
      document.addEventListener('focusin', function (e) {
        if (!rul || rul.box.hidden || !e.target.getBoundingClientRect) return;
        var r = e.target.getBoundingClientRect(); placeRuler(r.top + r.height / 2);
      });
      placeRuler(window.innerHeight / 3);
    }
    if (rul) { rul.box.hidden = !want; rul.box.classList.toggle('a11y-ruler-mask', S.ruler === 'mask'); }
  }

  /* ---------- simple-language view ----------
     Pages can carry a plain version of any text: <p data-simple="Short, plain words.">Long text</p>.
     Without one, long paragraphs show their first lines with a "Read all" button. */
  var simpleDone = false;
  function simple() {
    var m = main();
    [].forEach.call(m.querySelectorAll('[data-simple]'), function (n) {
      if (S.simple) { if (!n.hasAttribute('data-full')) { n.setAttribute('data-full', n.innerHTML); n.textContent = n.getAttribute('data-simple'); } }
      else if (n.hasAttribute('data-full')) { n.innerHTML = n.getAttribute('data-full'); n.removeAttribute('data-full'); }
    });
    if (S.simple && !simpleDone) {
      simpleDone = true;
      [].forEach.call(m.querySelectorAll('p'), function (p) {
        if (p.closest(OURS) || p.hasAttribute('data-simple') || p.closest('figure,form,dialog,.op-card,.card')) return;
        if (tidy(p).split(' ').length < 45) return;
        p.classList.add('a11y-clip');
        var b = el('button', 'btn btn-sm btn-ghost a11y-more', 'Read all of this'); b.type = 'button';
        b.setAttribute('aria-expanded', 'false');
        b.addEventListener('click', function () {
          var open = p.classList.toggle('a11y-clip-open');
          b.textContent = open ? 'Show less' : 'Read all of this'; b.setAttribute('aria-expanded', String(open));
        });
        p.parentNode.insertBefore(b, p.nextSibling);
      });
    }
  }

  /* ---------- pause everything that moves or plays ---------- */
  function pauseMoving(speech) {
    [].forEach.call(document.querySelectorAll('video,audio'), function (v) { try { v.pause(); v.autoplay = false; } catch (e) {} });
    [].forEach.call(document.querySelectorAll('.op-pause[aria-pressed="false"]'), function (b) { b.click(); });
    if (speech) stopAll();
  }

  /* ---------- sign language ----------
     A page section offers a signed version with data-sign-isl="video.mp4" (or -asl, -bsl, -is).
     With a sign language chosen, a "Sign language" button appears there and plays the video in a corner. */
  var SIGNS = [['', 'None'], ['isl', 'Indian Sign Language'], ['asl', 'American Sign Language'], ['bsl', 'British Sign Language'], ['is', 'International Sign']];
  var signBox = null;
  function signSlots() {
    [].forEach.call(document.querySelectorAll('.a11y-sign-btn'), function (b) { b.parentNode.removeChild(b); });
    if (!S.sign) { if (signBox) signBox.hidden = true; return; }
    [].forEach.call(document.querySelectorAll('[data-sign-' + S.sign + ']'), function (n) {
      var b = el('button', 'btn btn-sm btn-ghost a11y-sign-btn', 'Sign language version'); b.type = 'button';
      b.addEventListener('click', function () { playSign(n.getAttribute('data-sign-' + S.sign), tidy(n).slice(0, 60)); });
      n.appendChild(b);
    });
  }
  function playSign(src, label) {
    if (!signBox) {
      signBox = el('div', 'a11y-sign'); signBox.setAttribute('role', 'region'); signBox.setAttribute('aria-label', 'Sign language video');
      var v = el('video'); v.controls = true; v.playsInline = true; signBox.appendChild(v);
      var x = el('button', 'btn btn-sm', 'Close'); x.type = 'button'; x.addEventListener('click', function () { v.pause(); signBox.hidden = true; });
      signBox.appendChild(x); document.body.appendChild(signBox);
    }
    var vid = signBox.querySelector('video'); vid.src = src; vid.setAttribute('aria-label', 'Sign language: ' + label);
    signBox.hidden = false; try { vid.play(); } catch (e) {}
  }

  /* ---------- switch access: the focus moves by itself, any switch (Space or Enter) chooses ---------- */
  var scanT = null, scanI = -1;
  function scope() {
    var d = document.querySelector('dialog[open]') || (rdr && !rdr.hidden ? rdr : null) || (panel && !panel.hidden ? panel : null);
    return d || document;
  }
  function focusables(s) {
    return [].slice.call(s.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select,textarea,summary,[tabindex="0"]'))
      .filter(function (n) { return seen(n) && !n.closest('[hidden]') && !n.closest('.a11y-ruler'); });
  }
  function scan(on) {
    if (scanT) { clearInterval(scanT); scanT = null; }
    if (!on) return;
    scanT = setInterval(function () {
      var list = focusables(scope()); if (!list.length) return;
      var i = list.indexOf(document.activeElement);
      scanI = (i >= 0 ? i : scanI) + 1; if (scanI >= list.length) scanI = 0;
      try { list[scanI].focus({ preventScroll: false }); } catch (e) { list[scanI].focus(); }
    }, Math.max(0.8, Number(S.scanRate) || 1.5) * 1000);
  }

  /* ---------- immersive reader ---------- */
  var rdr = null, rv = { size: 22, theme: 'paper', lines: 0, syl: false, words: [] };
  function syllables(w) {
    if (!/^en/i.test(root.getAttribute('lang') || 'en') || w.length < 4) return [w];
    var parts = w.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi);
    if (!parts || parts.join('') !== w) return [w];
    if (parts.length > 1 && /^[^aeiouy]*e$/i.test(parts[parts.length - 1])) { parts[parts.length - 2] += parts.pop(); }
    return parts;
  }
  function wrapWords(node) {
    [].slice.call(node.childNodes).forEach(function (c) {
      if (c.nodeType === 3) {
        var frag = document.createDocumentFragment();
        c.nodeValue.split(/(\s+)/).forEach(function (bit) {
          if (!bit) return;
          if (/^\s+$/.test(bit)) { frag.appendChild(document.createTextNode(bit)); return; }
          var s = el('span', 'rw', bit); s.setAttribute('data-w', bit); frag.appendChild(s);
        });
        c.parentNode.replaceChild(frag, c);
      } else if (c.nodeType === 1) wrapWords(c);
    });
  }
  function showSyl() {
    rv.words.forEach(function (s) {
      var w = s.getAttribute('data-w'), m = /^([^A-Za-z]*)([A-Za-z]+)([^A-Za-z]*)$/.exec(w);
      s.textContent = rv.syl && m ? m[1] + syllables(m[2]).join('·') + m[3] : w;
    });
  }
  function readerPaint() {
    rdr.setAttribute('data-theme', rv.theme);
    rdr.style.setProperty('--rd-size', rv.size + 'px');
    rdr.classList.toggle('rd-lines', rv.lines > 0);
    rdr.style.setProperty('--rd-win', rv.lines || 1);
    rdr.querySelector('.rd-size').textContent = rv.size + ' px';
    /* With line focus on, the text can scroll so its first and last lines sit in the clear window. */
    var view = rdr.querySelector('.rd-view'), half = Math.max(0, view.clientHeight / 2 - rv.size * 0.9);
    view.style.paddingTop = rv.lines ? half + 'px' : '';
    view.style.paddingBottom = rv.lines ? half + 'px' : '';
  }
  function tool(bar, txt, fn, pressed) {
    var b = el('button', 'btn btn-sm btn-ghost', txt); b.type = 'button'; b.addEventListener('click', function () { fn(b); });
    if (pressed != null) b.setAttribute('aria-pressed', String(!!pressed));
    bar.appendChild(b); return b;
  }
  function choose(bar, label, items, cur, fn) {
    var w = el('label', 'rd-pick'), s = el('select');
    w.appendChild(el('span', null, label));
    items.forEach(function (it) { var o = el('option', null, it[1]); o.value = it[0]; if (String(cur) === it[0]) o.selected = true; s.appendChild(o); });
    s.addEventListener('change', function () { fn(s.value); });
    w.appendChild(s); bar.appendChild(w); return s;
  }
  function wordHelp(span) {
    var box = rdr.querySelector('.rd-word'), w = span.getAttribute('data-w').replace(/^[^\wÀ-￿]+|[^\wÀ-￿]+$/g, '');
    if (!w) return;
    box.innerHTML = '';
    box.appendChild(el('p', 'rd-word-big', w));
    var sy = syllables(w); if (sy.length > 1) box.appendChild(el('p', 'rd-word-syl', sy.join(' · ')));
    var low = w.toLowerCase();
    /* A picture from this page whose description uses the word, and a meaning from our names list. */
    var img = [].slice.call(main().querySelectorAll('img[alt]')).filter(function (i) { return i.alt.toLowerCase().split(/\W+/).indexOf(low) >= 0; })[0];
    if (img) { var pi = el('img'); pi.src = img.currentSrc || img.src; pi.alt = img.alt; box.appendChild(pi); }
    var term = [].slice.call(document.querySelectorAll('[data-term][title]')).filter(function (t) { return tidy(t).toLowerCase().indexOf(low) >= 0; })[0];
    if (term) box.appendChild(el('p', 'rd-word-mean', term.getAttribute('title')));
    if (!img && !term) box.appendChild(el('p', 'rd-word-mean', 'Tap "Say it" to hear this word.'));
    var row = el('div', 'a11y-btns');
    if (synth) tool(row, 'Say it', function () { stopAll(); say(w); });
    tool(row, 'Close', function () { box.hidden = true; span.focus(); });
    box.appendChild(row);
    box.hidden = false;
  }
  function readerRead() {
    var blocks = [].slice.call(rdr.querySelectorAll('.rd-text > *'));
    stopAll(); reading = blocks;
    var i = 0;
    (function next() {
      if (!reading || i >= blocks.length) { stopAll(); rdr.querySelectorAll('.rw-on').forEach(function (n) { n.classList.remove('rw-on'); }); return; }
      var b = blocks[i++], ws = [].slice.call(b.querySelectorAll('.rw')), text = '', starts = [];
      blocks.forEach(function (m) { m.classList.remove('a11y-reading'); }); b.classList.add('a11y-reading');
      ws.forEach(function (s) { starts.push(text.length); text += s.getAttribute('data-w') + ' '; });
      b.scrollIntoView({ block: 'center', behavior: S.still ? 'auto' : 'smooth' });
      if (!text.trim()) { next(); return; }
      say(text, next, function (ci) {
        var k = 0; while (k + 1 < starts.length && starts[k + 1] <= ci) k++;
        rdr.querySelectorAll('.rw-on').forEach(function (n) { n.classList.remove('rw-on'); });
        if (ws[k]) ws[k].classList.add('rw-on');
      });
    })();
  }
  function openReader() {
    close();
    if (!rdr) {
      rdr = el('div', 'a11y-reader'); rdr.setAttribute('role', 'dialog'); rdr.setAttribute('aria-modal', 'true'); rdr.setAttribute('aria-label', 'Immersive reader');
      var bar = el('div', 'rd-bar');
      var h = el('h2', 'rd-title', 'Immersive reader'); bar.appendChild(h);
      var tb = el('div', 'rd-tools');
      if (synth) { tool(tb, 'Read aloud', readerRead); tool(tb, 'Stop', stopAll); }
      tool(tb, 'Smaller', function () { rv.size = Math.max(16, rv.size - 2); readerPaint(); });
      tb.appendChild(el('span', 'rd-size'));
      tool(tb, 'Larger', function () { rv.size = Math.min(48, rv.size + 2); readerPaint(); });
      choose(tb, 'Font', [['site', 'Site font'], ['dyslexia', 'Dyslexia friendly'], ['clear', 'Extra clear']], S.font, function (v) { S.font = v; save(); apply(); });
      choose(tb, 'Colours', [['paper', 'Paper'], ['cream', 'Cream'], ['dark', 'Dark'], ['contrast', 'High contrast']], rv.theme, function (v) { rv.theme = v; readerPaint(); });
      choose(tb, 'Line focus', [['0', 'Off'], ['1', '1 line'], ['3', '3 lines'], ['5', '5 lines']], rv.lines, function (v) { rv.lines = Number(v); readerPaint(); });
      tool(tb, 'Syllables', function (b) { rv.syl = !rv.syl; b.setAttribute('aria-pressed', String(rv.syl)); showSyl(); }, false);
      if (window.SiteLang) tool(tb, 'Translate', function () { var lb = document.querySelector('[data-lang-toggle]'); closeReader(); if (window.SiteLang) window.SiteLang.open(lb); });
      tool(tb, 'Close reader', closeReader);
      bar.appendChild(tb); rdr.appendChild(bar);
      rdr.appendChild(el('p', 'rd-hint', 'Tap any word to hear it, see its syllables and, where the page has one, a picture. With line focus on, use the arrow keys or the buttons below to move line by line.'));
      var view = el('div', 'rd-view'); view.tabIndex = 0; view.setAttribute('aria-label', 'Page text');
      var txt = el('div', 'rd-text'); view.appendChild(txt);
      var wrap = el('div', 'rd-wrap'), mask = el('div', 'rd-mask'); mask.setAttribute('aria-hidden', 'true');
      wrap.appendChild(view); wrap.appendChild(mask); rdr.appendChild(wrap);
      var nav = el('div', 'rd-step a11y-btns');
      var step = function (d) { var lh = parseFloat(getComputedStyle(txt).lineHeight) || rv.size * 1.8; view.scrollBy(0, d * lh * Math.max(1, rv.lines)); };
      tool(nav, 'Previous line', function () { step(-1); });
      tool(nav, 'Next line', function () { step(1); });
      rdr.appendChild(nav);
      var wb = el('div', 'rd-word'); wb.hidden = true; wb.setAttribute('role', 'region'); wb.setAttribute('aria-live', 'polite'); wb.setAttribute('aria-label', 'Word helper');
      rdr.appendChild(wb);
      view.addEventListener('click', function (e) { var s = e.target.closest && e.target.closest('.rw'); if (s) wordHelp(s); });
      view.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
      });
      rdr.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); closeReader(); } }, true);
      document.body.appendChild(rdr);
    }
    var t = rdr.querySelector('.rd-text'); t.innerHTML = '';
    readable(main()).forEach(function (n) {
      var tag = /^H[1-3]$/.test(n.tagName) ? n.tagName.toLowerCase() : 'p';
      var c = el(tag, null, tidy(n)); if (n.tagName === 'LI') c.className = 'rd-li';
      t.appendChild(c);
    });
    wrapWords(t);
    rv.words = [].slice.call(t.querySelectorAll('.rw'));
    rv.words.forEach(function (s) { s.tabIndex = -1; });
    showSyl(); readerPaint();
    rdr.hidden = false; root.classList.add('a11y-reader-open');
    rdr.querySelector('.rd-tools button').focus();
  }
  function closeReader() {
    if (!rdr || rdr.hidden) return;
    stopAll(); rdr.hidden = true; root.classList.remove('a11y-reader-open');
    var b = document.querySelector('[data-a11y-toggle]'); if (b) b.focus();
  }

  /* ---------- "Check this page": WCAG 2.2 AA checks the browser can make ---------- */
  function rgba(c) {
    var m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(function (x) { return parseFloat(x); });
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  function lumOf(p) {
    var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]);
  }
  /* The colour behind an element: see-through layers are blended down to the first solid one. */
  function bgOf(n) {
    var layers = [];
    while (n && n.nodeType === 1) {
      var cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; /* text over a picture or gradient: checked by hand */
      var c = rgba(cs.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
      n = n.parentElement;
    }
    var out = [255, 255, 255];
    for (var i = layers.length - 1; i >= 0; i--) { var l = layers[i]; out = [0, 1, 2].map(function (k) { return l[k] * l[3] + out[k] * (1 - l[3]); }); }
    return out;
  }
  function audit() {
    var R = [], m = main();
    function rule(id, name, bad, total, how) { R.push({ id: id, name: name, bad: bad, total: total, how: how }); }
    var all = function (s) { return [].slice.call(document.querySelectorAll(s)).filter(function (n) { return !n.closest(OURS); }); };
    rule('3.1.1', 'Page language is set', root.getAttribute('lang') ? [] : [root], 1, 'Add lang to the html element.');
    rule('2.4.2', 'Page has a title', document.title.trim() ? [] : [root], 1, 'Give the page a clear title.');
    var imgs = all('img');
    rule('1.1.1', 'Pictures have a text alternative', imgs.filter(function (i) { return !i.hasAttribute('alt'); }), imgs.length, 'Describe the picture in alt, or alt="" if it is decoration.');
    var hs = all('h1,h2,h3,h4,h5,h6').filter(seen), skips = [], last = 0;
    hs.forEach(function (h) { var l = Number(h.tagName[1]); if (last && l > last + 1) skips.push(h); last = l; });
    var h1 = hs.filter(function (h) { return h.tagName === 'H1'; });
    rule('1.3.1', 'Headings are in order, one main heading', skips.concat(h1.length === 1 ? [] : h1.length ? h1.slice(1) : [root]), hs.length, 'Use one h1, then h2, h3 without skipping.');
    var links = all('a[href]').filter(seen);
    var noName = function (n) { return !tidy(n) && !n.getAttribute('aria-label') && !n.getAttribute('title') && !n.querySelector('img[alt]:not([alt=""]),svg[aria-label]'); };
    rule('2.4.4', 'Links say where they go', links.filter(function (a) { return noName(a) || /^(click here|here|read more|more|link)$/i.test(tidy(a)); }), links.length, 'Give each link words that make sense on their own.');
    var btns = all('button').filter(seen);
    rule('4.1.2', 'Buttons have a name', btns.filter(noName), btns.length, 'Give each button visible text or an aria-label.');
    var fields = all('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').filter(seen);
    rule('3.3.2', 'Form fields have labels', fields.filter(function (f) {
      return !(f.labels && f.labels.length) && !f.getAttribute('aria-label') && !f.getAttribute('aria-labelledby') && !f.closest('label');
    }), fields.length, 'Join every field to a label.');
    var texts = [].slice.call(m.querySelectorAll('p,li,a,button,label,td,th,h1,h2,h3,h4,figcaption,small,span')).filter(function (n) {
      return seen(n) && !n.closest(OURS) && [].some.call(n.childNodes, function (c) { return c.nodeType === 3 && c.nodeValue.trim(); });
    }).slice(0, 600);
    var low = texts.filter(function (n) {
      var cs = getComputedStyle(n), c = rgba(cs.color), back = bgOf(n);
      if (!c || !back) return false;
      var bg = lumOf(back), fg = lumOf([0, 1, 2].map(function (k) { return c[k] * c[3] + back[k] * (1 - c[3]); }));
      var ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05), px = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
      return ratio < ((px >= 24 || (bold && px >= 18.66)) ? 3 : 4.5);
    });
    rule('1.4.3', 'Text has enough contrast', low, texts.length, 'Darken the text or lighten the background (4.5 to 1, or 3 to 1 for large text).');
    var targets = all('a[href],button,input,select,summary').filter(seen).filter(function (n) {
      if (n.tagName === 'A' && n.closest('p,li,td,dd,label,small') && !n.classList.contains('btn')) return false; /* links inside sentences are exempt */
      var r = n.getBoundingClientRect(); return r.width > 0 && (r.width < 24 || r.height < 24);
    });
    rule('2.5.8', 'Buttons and links are big enough to tap (24 px)', targets, all('a[href],button,input,select,summary').length, 'Make the target at least 24 by 24 pixels.');
    rule('2.4.1', 'There is a way to skip to the content', document.querySelector('a[href="#main"],a.skip,a[href^="#main"]') ? [] : [root], 1, 'Add a "Skip to content" link.');
    rule('1.3.1', 'The page has main and navigation areas', document.querySelector('main,[role=main]') && document.querySelector('nav,[role=navigation]') ? [] : [root], 1, 'Mark up main and nav.');
    var wide = root.scrollWidth > window.innerWidth + 2;
    rule('1.4.10', 'Nothing needs side scrolling at this width', wide ? [root] : [], 1, 'Let the layout wrap at 320 px wide.');
    var media = all('video,audio');
    rule('1.4.2', 'Nothing plays sound by itself', media.filter(function (v) { return v.autoplay && !v.muted; }), media.length, 'Do not autoplay sound.');
    var vids = all('video');
    rule('1.2.2', 'Videos have captions', vids.filter(function (v) { return !v.querySelector('track[kind=captions],track[kind=subtitles]'); }), vids.length, 'Add a captions track.');
    var ids = {}, dup = [];
    all('[id]').forEach(function (n) { if (ids[n.id]) dup.push(n); ids[n.id] = 1; });
    rule('4.1.2', 'Every id is unique', dup, all('[id]').length, 'Use each id only once, so labels and links point to the right place.');
    return R;
  }
  var HAND = ['Every part works with the keyboard alone (2.1.1)', 'The focus is always easy to see and never hidden (2.4.7, 2.4.11)', 'Text over pictures can be read (1.4.3)', 'Captions match what is said in videos (1.2.2)', 'Nothing needs dragging, and there is another way (2.5.7)', 'Help is in the same place on every page (3.2.6)', 'Signing in needs no puzzle or memory test (3.3.8)'];
  function report(box) {
    var R = audit(), ok = R.filter(function (r) { return !r.bad.length; }).length;
    box.innerHTML = '';
    box.appendChild(el('p', 'a11y-sum', ok + ' of ' + R.length + ' automatic checks passed on this page (WCAG 2.2 AA).'));
    var ul = el('ul', 'a11y-report');
    R.forEach(function (r) {
      var li = el('li', r.bad.length ? 'a11y-bad' : 'a11y-ok');
      li.appendChild(el('strong', null, (r.bad.length ? 'Needs attention: ' : 'Passed: ') + r.name));
      li.appendChild(el('span', 'a11y-hint', ' WCAG ' + r.id + (r.total ? ', ' + r.total + ' checked' : '') + (r.bad.length ? ', ' + r.bad.length + ' to fix. ' + r.how : '')));
      if (r.bad.length && r.bad[0] !== root) {
        var b = btn('Show the first one', function () {
          close(); var n = r.bad[0]; n.scrollIntoView({ block: 'center' }); n.classList.add('a11y-reading');
          if (n.matches('a,button,input,select,textarea,summary')) n.focus();
          setTimeout(function () { n.classList.remove('a11y-reading'); }, 4000);
        });
        li.appendChild(b);
      }
      ul.appendChild(li);
    });
    box.appendChild(ul);
    box.appendChild(el('p', 'a11y-legend', 'Checked by people before launch'));
    var hl = el('ul', 'a11y-report'); HAND.forEach(function (h) { hl.appendChild(el('li', null, h)); }); box.appendChild(hl);
    var row = el('div', 'a11y-btns');
    row.appendChild(btn('Save the report (spreadsheet)', function () {
      var rows = [['Page', 'WCAG', 'Check', 'Result', 'Checked', 'To fix', 'How to fix']].concat(R.map(function (r) { return [location.pathname, r.id, r.name, r.bad.length ? 'Needs attention' : 'Passed', r.total, r.bad.length, r.how]; }));
      download('accessibility-check-' + new Date().toISOString().slice(0, 10) + '.csv', rows);
    }));
    box.appendChild(row);
    box.hidden = false;
  }

  /* ---------- spreadsheet downloads follow the visitor's separator and byte-order mark ---------- */
  function csv(rows) {
    var sep = S.sep === 'tab' ? '\t' : (S.sep === ';' ? ';' : ',');
    var q = function (v) { v = String(v == null ? '' : v); return /["\r\n,;\t]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return (S.bom ? '﻿' : '') + rows.map(function (r) { return r.map(q).join(sep); }).join('\r\n');
  }
  function download(name, rows) {
    var blob = new Blob([csv(rows)], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- voice control ---------- */
  var voiceStatus = null;
  function findByText(sel, words) {
    words = words.toLowerCase();
    var best = null;
    [].slice.call(document.querySelectorAll(sel)).forEach(function (n) {
      if (n.offsetParent === null && !n.closest('.site-nav')) return;
      var t = (n.textContent || n.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (!t) return;
      if (t === words) best = n;
      else if (!best && (t.indexOf(words) >= 0 || words.indexOf(t) >= 0)) best = n;
    });
    return best;
  }
  function headings() { return [].slice.call(main().querySelectorAll('h1,h2,h3')).filter(seen); }
  var hIndex = -1;
  function command(raw) {
    var c = raw.toLowerCase().replace(/[.,!?]/g, '').trim(), m;
    if (voiceStatus) voiceStatus.textContent = 'Heard: "' + raw + '"';
    if (/^(stop|quiet|silence)/.test(c)) return stopAll();
    if (/^(pause|pause all|pause everything)$/.test(c)) return pauseMoving(true);
    if (/^(read|read page|read this page|read aloud)$/.test(c)) return readPage();
    if (/^(reader|open reader|immersive reader)$/.test(c)) return openReader();
    if (/^(close reader|exit reader)$/.test(c)) return closeReader();
    if (/scroll down|page down/.test(c)) return window.scrollBy(0, window.innerHeight * 0.8);
    if (/scroll up|page up/.test(c)) return window.scrollBy(0, -window.innerHeight * 0.8);
    if (/^(top|go to top)$/.test(c)) return window.scrollTo(0, 0);
    if (/^(go back|back)$/.test(c)) return history.back();
    if (/^(next heading|next)$/.test(c) || /^(previous heading|previous)$/.test(c)) {
      var hs = headings(); if (!hs.length) return;
      hIndex = Math.max(0, Math.min(hs.length - 1, hIndex + (/^next/.test(c) ? 1 : -1)));
      hs[hIndex].setAttribute('tabindex', '-1'); hs[hIndex].focus(); return say(hs[hIndex].textContent);
    }
    if (/^(menu|open menu)$/.test(c)) { var mb = document.querySelector('[data-menu-toggle]'); if (mb) mb.click(); return; }
    if (/^(accessibility|settings)$/.test(c)) return open(null);
    if (/^(language|translate)$/.test(c)) { var lb = document.querySelector('[data-lang-toggle]'); if (lb) lb.click(); return; }
    if (/high contrast/.test(c)) { S.contrast = !/off/.test(c); save(); apply(); return; }
    if (/bigger text|larger text/.test(c)) { S.size = S.size === '100' ? '125' : S.size === '125' ? '150' : '200'; save(); apply(); return; }
    if (/smaller text/.test(c)) { S.size = '100'; save(); apply(); return; }
    if (/^help$/.test(c)) return say('Say: go to, then a page name. Or say read page, reader, pause, stop, scroll down, scroll up, next heading, open menu, language, high contrast, or click, then a button name.');
    if ((m = /^(?:go to|open|show me)\s+(.+)$/.exec(c))) { var a = findByText('a[href]', m[1]); if (a) { say('Opening ' + a.textContent.trim()); location.href = a.href; } else say('I did not find ' + m[1]); return; }
    if ((m = /^(?:click|press|choose|select)\s+(.+)$/.exec(c))) { var b = findByText('a[href],button,summary,label', m[1]); if (b) { b.focus(); b.click(); } else say('I did not find ' + m[1]); return; }
    var link = findByText('a[href]', c);
    if (link) { location.href = link.href; return; }
    say('Sorry, I did not catch that. Say help to hear the commands.');
  }
  function voice(on) {
    if (!Rec) return;
    if (on && !rec) {
      rec = new Rec();
      rec.lang = root.getAttribute('lang') || 'en';
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = function (e) { var r = e.results[e.results.length - 1]; if (r && r[0]) command(r[0].transcript); };
      rec.onend = function () { if (listening) { try { rec.start(); } catch (x) {} } };
      rec.onerror = function (e) { if (voiceStatus) voiceStatus.textContent = e.error === 'not-allowed' ? 'The microphone is blocked. Allow it in your browser to use voice commands.' : 'Voice commands paused.'; };
    }
    listening = on;
    try { if (on) rec.start(); else if (rec) rec.stop(); } catch (x) {}
  }

  /* ---------- the panel ---------- */
  var panel = null, opener = null;
  function check(label, key, hint) {
    var w = el('label', 'a11y-row'), i = el('input');
    i.type = 'checkbox'; i.checked = !!S[key];
    i.addEventListener('change', function () { S[key] = i.checked; save(); apply(); });
    w.appendChild(i); w.appendChild(el('span', null, label));
    if (hint) w.appendChild(el('small', 'a11y-hint', hint));
    return w;
  }
  function group(title, open) {
    var d = el('details', 'a11y-group'); if (open) d.open = true;
    d.appendChild(el('summary', null, title));
    return d;
  }
  function radios(name, items, key) {
    var f = el('fieldset', 'a11y-set'), lg = el('legend', 'a11y-legend', name);
    f.appendChild(lg);
    items.forEach(function (it) {
      var w = el('label', 'a11y-row'), i = el('input');
      i.type = 'radio'; i.name = 'a11y-' + key; i.value = it[0]; i.checked = String(S[key]) === it[0];
      i.addEventListener('change', function () { if (i.checked) { S[key] = it[0]; save(); apply(); } });
      w.appendChild(i); w.appendChild(el('span', null, it[1]));
      if (it[2]) w.appendChild(el('small', 'a11y-hint', it[2]));
      f.appendChild(w);
    });
    return f;
  }
  function select(label, items, key) {
    var w = el('label', 'a11y-pick'), s = el('select');
    w.appendChild(el('span', null, label));
    items.forEach(function (it) { var o = el('option', null, it[1]); o.value = it[0]; if (String(S[key]) === it[0]) o.selected = true; s.appendChild(o); });
    s.addEventListener('change', function () { S[key] = s.value; save(); apply(); });
    w.appendChild(s); return w;
  }
  function btn(txt, fn, cls) { var b = el('button', 'btn btn-sm ' + (cls || 'btn-ghost'), txt); b.type = 'button'; b.addEventListener('click', fn); return b; }

  function build() {
    panel = el('div', 'lang-panel a11y-panel');
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'a11y-title');
    panel.hidden = true;
    var top = el('div', 'lang-top'), t = el('h2', 'lang-title', 'Accessibility and learning style');
    t.id = 'a11y-title';
    var x = el('button', 'lang-x'); x.appendChild(xIcon()); x.type = 'button'; x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', close);
    top.appendChild(t); top.appendChild(x); panel.appendChild(top);
    var body = el('div', 'a11y-body');
    panel.appendChild(body);
    body.appendChild(el('p', 'lang-hint', 'Choose what helps you. Your choices stay in this browser only.' + (S.nokeys ? '' : ' Shortcut: Alt + Shift + A.')));

    var quick = el('div', 'a11y-btns');
    quick.appendChild(btn('Immersive reader', openReader, ''));
    quick.appendChild(btn('Pause everything that moves', function () { pauseMoving(true); }));
    body.appendChild(quick);

    var g1 = group('How you like to learn', true);
    g1.appendChild(radios('Learning style', [
      ['mixed', 'Mixed', 'The page as it is.'],
      ['visual', 'Visual', 'Pictures, tables and a map of the page first.'],
      ['aural', 'Listening', 'A "Listen to this page" button and captions.'],
      ['read', 'Reading and writing', 'Text first, decoration hidden, more space.'],
      ['kin', 'Hands-on', 'Steps and the things you can do on the page.']
    ], 'ls'));
    g1.appendChild(check('Simple language view', 'simple', 'Plain words where the page has them, long paragraphs folded, a map of the page.'));
    g1.appendChild(el('p', 'lang-hint', 'This is a choice, not a test. Change it whenever you like.'));
    body.appendChild(g1);

    var g2 = group('Seeing and reading');
    g2.appendChild(radios('Text size', [['100', 'Normal'], ['125', 'Large'], ['150', 'Larger'], ['200', 'Largest']], 'size'));
    g2.appendChild(radios('Reading font', [['site', 'Site font'], ['dyslexia', 'Dyslexia friendly', 'Heavier letter bottoms help letters stay in place.'], ['clear', 'Extra clear', 'Letters that are hard to confuse, such as I, l and 1.']], 'font'));
    g2.appendChild(check('High contrast', 'contrast'));
    g2.appendChild(select('Colours for colour blindness', [['none', 'Site colours'], ['rg', 'Red and green safe'], ['by', 'Blue and yellow safe'], ['mono', 'No colour (grey)']], 'cb'));
    g2.appendChild(check('Easier reading spacing', 'spacing', 'More space between letters, words and lines.'));
    g2.appendChild(check('Underline all links', 'links'));
    g2.appendChild(select('Pointer size', [['normal', 'Normal'], ['big', 'Big'], ['huge', 'Very big']], 'cursor'));
    g2.appendChild(select('Reading ruler', [['off', 'Off'], ['line', 'Highlight the line I am on'], ['mask', 'Darken everything but the line']], 'ruler'));
    body.appendChild(g2);

    var gm = group('Movement');
    gm.appendChild(check('Stop movement, animation and celebrations', 'still', 'Also turns off moving pictures and smooth scrolling.'));
    gm.appendChild(el('p', 'lang-hint', 'Nothing on our pages flashes. Sound never plays by itself.'));
    body.appendChild(gm);

    var g3 = group('Hearing and alerts');
    g3.appendChild(check('Show captions for everything the site says aloud', 'captions', 'Captions follow the language of the page, including a translated page.'));
    g3.appendChild(select('Sign language', SIGNS, 'sign'));
    g3.appendChild(el('p', 'lang-hint', 'Where a signed version of a section exists, a "Sign language version" button appears there. Tell us on the Contact page which pages matter most to you, and we record those first.'));
    g3.appendChild(check('Keep alerts on screen until I close them', 'alerts', 'Messages and captions do not disappear by themselves.'));
    g3.appendChild(el('p', 'lang-hint', 'Every video we add will have captions and a written version. Alerts are always shown on screen, never by sound alone.'));
    body.appendChild(g3);

    var g4 = group('Listening');
    if (synth) {
      var row = el('div', 'a11y-btns');
      row.appendChild(btn('Read this page aloud', function () { close(); readPage(); }, ''));
      row.appendChild(btn('Stop', stopAll));
      g4.appendChild(row);
      var cr = el('label', 'a11y-row'), ci = el('input');
      ci.type = 'checkbox'; ci.checked = clickRead;
      ci.addEventListener('change', function () { clickRead = ci.checked; });
      cr.appendChild(ci); cr.appendChild(el('span', null, 'Read what I click or tap'));
      g4.appendChild(cr);
      g4.appendChild(radios('Speed', [['0.8', 'Slow'], ['1', 'Normal'], ['1.3', 'Fast']], 'rate'));
    } else g4.appendChild(el('p', 'lang-hint', 'This browser cannot read aloud. Your own screen reader works on every page.'));
    body.appendChild(g4);

    var g5 = group('Voice control');
    if (Rec) {
      var vrow = el('div', 'a11y-btns');
      var vb = btn(listening ? 'Turn off voice commands' : 'Turn on voice commands', function () { voice(!listening); vb.textContent = listening ? 'Turn off voice commands' : 'Turn on voice commands'; vb.setAttribute('aria-pressed', String(listening)); }, '');
      vb.setAttribute('aria-pressed', String(listening));
      vrow.appendChild(vb); g5.appendChild(vrow);
      voiceStatus = el('p', 'lang-hint'); voiceStatus.setAttribute('aria-live', 'polite');
      g5.appendChild(voiceStatus);
      g5.appendChild(el('p', 'lang-hint', 'Say "go to" and a page name, "read page", "reader", "pause", "stop", "scroll down", "next heading", "open menu", "language", "click" and a button name, or "help". Your browser turns your speech into text; some browsers use their maker\'s online service for this.'));
    } else g5.appendChild(el('p', 'lang-hint', 'This browser has no voice commands. Your device\'s own voice control works on every page.'));
    body.appendChild(g5);

    var g6 = group('Speaking help');
    if (synth) {
      g6.appendChild(el('p', 'lang-hint', 'For people who cannot speak: type, and this device says it for you.'));
      var ta = el('textarea', 'lang-q a11y-say'); ta.rows = 3; ta.setAttribute('aria-label', 'Message to say aloud');
      g6.appendChild(ta);
      var srow = el('div', 'a11y-btns');
      srow.appendChild(btn('Say it', function () { if (ta.value.trim()) { stopAll(); say(ta.value.trim()); } }, ''));
      ['Yes', 'No', 'Please wait', 'Please write it down', 'I need help'].forEach(function (p) { srow.appendChild(btn(p, function () { stopAll(); say(p); })); });
      g6.appendChild(srow);
    }
    var cl = document.querySelector('a[href*="contact"]');
    if (cl) { var p6 = el('p', 'lang-hint'); p6.appendChild(document.createTextNode('You can always reach us in writing: ')); var a6 = el('a', null, 'Contact page'); a6.href = cl.href; p6.appendChild(a6); g6.appendChild(p6); }
    body.appendChild(g6);

    var g7 = group('Moving and pointing');
    g7.appendChild(check('Bigger buttons and links', 'big'));
    g7.appendChild(check('Strong focus highlight', 'focus'));
    g7.appendChild(check('Switch access: move the focus for me', 'scan', 'The highlight steps through the page by itself. Press Space or Enter, or your switch, to choose.'));
    g7.appendChild(radios('Step speed', [['1', 'Fast'], ['1.5', 'Normal'], ['2.5', 'Slow'], ['4', 'Very slow']], 'scanRate'));
    g7.appendChild(check('Turn off keyboard shortcuts', 'nokeys', 'For screen reader and voice users whose keys should never trigger anything here.'));
    g7.appendChild(el('p', 'lang-hint', 'Every page works with a keyboard, a switch or voice: Tab moves, Enter chooses, Escape closes. Nothing needs a mouse, dragging or quick timing.'));
    body.appendChild(g7);

    var g8 = group('Downloads');
    g8.appendChild(radios('Spreadsheet separator', [[',', 'Comma'], [';', 'Semicolon', 'Common where the decimal mark is a comma.'], ['tab', 'Tab']], 'sep'));
    g8.appendChild(check('Add a byte-order mark', 'bom', 'Helps spreadsheet programs open non-English letters correctly.'));
    body.appendChild(g8);

    var g9 = group('Check this page');
    g9.appendChild(el('p', 'lang-hint', 'Runs the WCAG 2.2 AA checks a browser can make on this page, and lists what people check by hand.'));
    var rbox = el('div', 'a11y-audit'); rbox.hidden = true;
    var rrow = el('div', 'a11y-btns'); rrow.appendChild(btn('Check this page now', function () { report(rbox); }, ''));
    g9.appendChild(rrow); g9.appendChild(rbox);
    body.appendChild(g9);

    var foot = el('div', 'a11y-btns');
    foot.appendChild(btn('Reset all', function () { S = fresh(); save(); apply(); var o = panel; panel = null; o.parentNode.removeChild(o); build(); open(opener); }));
    body.appendChild(foot);
    body.appendChild(el('p', 'lang-hint', 'Our goal is WCAG 2.2 AA on every page. If something stops you, tell us and we will fix it.'));
    document.body.appendChild(panel);
  }
  function open(from) {
    if (!panel) build();
    var lp = document.getElementById('lang-panel');
    if (lp && !lp.hidden) { lp.hidden = true; [].forEach.call(document.querySelectorAll('[data-lang-toggle]'), function (b) { b.setAttribute('aria-expanded', 'false'); }); }
    opener = from || null;
    panel.hidden = false;
    [].forEach.call(document.querySelectorAll('[data-a11y-toggle]'), function (b) { b.setAttribute('aria-expanded', 'true'); });
    var f = panel.querySelector('summary'); if (f) f.focus();
  }
  function close() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    [].forEach.call(document.querySelectorAll('[data-a11y-toggle]'), function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (opener && opener.focus) opener.focus();
  }

  function xIcon() {
    var NS = 'http://www.w3.org/2000/svg', g = document.createElementNS(NS, 'svg'), p = document.createElementNS(NS, 'path');
    g.setAttribute('viewBox', '0 0 24 24'); g.setAttribute('aria-hidden', 'true'); g.setAttribute('focusable', 'false');
    p.setAttribute('d', 'M6 6l12 12M18 6L6 18'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round');
    g.appendChild(p); return g;
  }
  function icon() {
    var NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    var c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', '12'); c.setAttribute('cy', '4.5'); c.setAttribute('r', '2'); c.setAttribute('fill', 'currentColor');
    var p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'M4 8.5l8 1.5 8-1.5M12 10v5m0 0l-3.5 6.5M12 15l3.5 6.5'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round');
    s.appendChild(c); s.appendChild(p); return s;
  }
  function addButtons() {
    [].forEach.call(document.querySelectorAll('[data-lang-toggle]'), function (lb) {
      if (lb.nextSibling && lb.nextSibling.hasAttribute && lb.nextSibling.hasAttribute('data-a11y-toggle')) return;
      var b = el('button', lb.className.replace('lang-btn', 'a11y-btn'));
      b.type = 'button';
      b.setAttribute('data-a11y-toggle', '');
      b.setAttribute('aria-controls', 'a11y-panel');
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-haspopup', 'dialog');
      b.appendChild(icon()); var t = el('span', 'btn-label', 'Accessibility'); b.appendChild(t); b.title = 'Accessibility';
      lb.parentNode.insertBefore(b, lb.nextSibling);
    });
  }

  function init() {
    load(); apply(); addButtons();
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-a11y-toggle]') : null;
      if (t) { e.preventDefault(); if (panel && !panel.hidden) close(); else open(t); return; }
      if (panel && !panel.hidden && !e.target.closest('.a11y-panel')) close();
      if (clickRead && synth && !e.target.closest('.a11y-panel,.a11y-reader')) {
        var n = e.target.closest('a,button,input,select,textarea,summary') ? null : e.target.closest('p,li,h1,h2,h3,td,th,figcaption,blockquote');
        if (n) { stopAll(); say(tidy(n)); }
      }
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (panel && !panel.hidden) close(); else stopAll(); }
      if (S.scan && (e.key === ' ' || e.key === 'Spacebar') && document.activeElement && document.activeElement !== document.body) {
        var a = document.activeElement;
        if (!/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) { e.preventDefault(); a.click(); }
      }
      if (!S.nokeys && e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) { e.preventDefault(); if (panel && !panel.hidden) close(); else open(document.activeElement); }
    });
    /* Videos added later also stay still when movement is off. */
    document.addEventListener('play', function (e) { if (S.still && e.target && e.target.closest && !e.target.closest('.a11y-sign') && e.target.autoplay) { try { e.target.pause(); } catch (x) {} } }, true);
  }
  /* Other scripts on our sites read the visitor's choices here (downloads, alerts, shortcuts). */
  window.SiteAccess = {
    get: function () { var o = {}; for (var k in S) o[k] = S[k]; return o; },
    csv: csv, download: download, open: function () { open(null); }, reader: function () { openReader(); },
    check: function () { return audit().map(function (r) { return { wcag: r.id, check: r.name, checked: r.total, fix: r.bad.map(function (n) { return n === root ? 'page' : n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.split(' ')[0] : '') + ' "' + tidy(n).slice(0, 40) + '"'; }) }; }); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ---------- Privacy choices and visitor opinion ----------
   The first-visit notice offers Accept all, Reject all and Manage preferences, all equally easy.
   We share nothing with outside partners. Only the visitor's own choices are kept, in this browser
   ("site-consent"). The opinion form has no tracking: it opens the visitor's own email, addressed to us.
   APP: POST /api/v1/opinions {site, audience: "public" | "customer", rating 1-5, comment}
   (members app; the dashboard shows public and customer opinion separately, weighted by count and recency). */
(function () {
  var KEY = 'site-consent';
  var C = { improve: false, decided: '' };
  var panel = null, opener = null;
  var LISTEN = 'We listen. What is right and possible, we do, quickly. What we cannot do yet, we do not forget: it goes into our queue, and we grow to meet it.';
  function el(t, cls, txt) { var e = document.createElement(t); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function load() { try { var v = JSON.parse(localStorage.getItem(KEY) || '{}'); for (var k in v) if (k in C) C[k] = v[k]; } catch (e) {} }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) {} }
  function banner() { return document.querySelector('.cookie'); }
  function decide(choice) {
    var b = banner();
    C.decided = new Date().toISOString().slice(0, 10);
    if (choice === 'accepted') C.improve = true;
    if (choice === 'declined') C.improve = false;
    save();
    if (b) {
      try { localStorage.setItem(b.getAttribute('data-key'), choice === 'declined' ? 'declined' : 'accepted'); } catch (e) {}
      b.hidden = true;
    }
  }
  function xIcon() {
    var NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg'), p = document.createElementNS(NS, 'path');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    p.setAttribute('d', 'M6 6l12 12M18 6L6 18'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round');
    s.appendChild(p); return s;
  }
  function btn(txt, fn, cls) { var b = el('button', 'btn btn-sm ' + (cls || ''), txt); b.type = 'button'; b.addEventListener('click', fn); return b; }
  function sw(id, label, hint, on, locked, fn) {
    var w = el('div', 'consent-row'), l = el('label', 'consent-label'), i = el('input');
    i.type = 'checkbox'; i.id = id; i.checked = on; i.disabled = !!locked;
    if (fn) i.addEventListener('change', function () { fn(i.checked); });
    l.htmlFor = id; l.appendChild(i); l.appendChild(el('span', null, label));
    w.appendChild(l); w.appendChild(el('p', 'consent-hint', hint));
    return w;
  }
  function build() {
    var b = banner();
    var email = (b && b.getAttribute('data-email')) || '';
    var priv = (b && b.getAttribute('data-privacy')) || '';
    var site = (b && b.getAttribute('data-site')) || document.title;
    panel = el('div', 'lang-panel consent-panel');
    panel.id = 'consent-panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', 'consent-title');
    var top = el('div', 'lang-top'), t = el('h2', 'lang-title', 'Privacy choices');
    t.id = 'consent-title';
    var x = el('button', 'lang-x'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.appendChild(xIcon());
    x.addEventListener('click', close);
    top.appendChild(t); top.appendChild(x); panel.appendChild(top);
    var body = el('div', 'consent-body'); panel.appendChild(body);

    body.appendChild(el('h3', 'consent-h', 'What this site keeps'));
    body.appendChild(sw('consent-need', 'Needed for the site to work', 'Your answers to this notice and your language and accessibility settings, kept in this browser only. Always on.', true, true));
    body.appendChild(sw('consent-improve', 'Help us improve the site', 'Anonymous counts of which pages are read, never linked to you. We do not collect these today; this switch decides whether we may when we add them. Off unless you turn it on.', C.improve, false, function (v) { C.improve = v; }));
    body.appendChild(el('p', 'consent-hint', 'We set no advertising or tracking cookies and we share nothing with outside partners.'));
    body.appendChild(el('p', 'consent-hint', 'Every page carries a light watermark with the site name and the time you viewed it, on screen and on paper. It records nothing about you.'));
    if (priv) { var pl = el('p', 'consent-hint'), a = el('a', null, 'Read our privacy statement'); a.href = priv; pl.appendChild(a); body.appendChild(pl); }
    var row = el('div', 'consent-actions');
    row.appendChild(btn('Save my choices', function () { decide(C.improve ? 'accepted' : 'declined'); close(); }));
    row.appendChild(btn('Reject all', function () { C.improve = false; decide('declined'); close(); }));
    row.appendChild(btn('Accept all', function () { decide('accepted'); close(); }));
    body.appendChild(row);

    /* Visitor opinion: optional, never required to use the site. */
    var op = el('form', 'consent-opinion'); op.id = 'site-opinion'; op.noValidate = true;
    op.appendChild(el('h3', 'consent-h', 'Tell us what you think'));
    op.appendChild(el('p', 'consent-hint', LISTEN));
    var fs = el('fieldset', 'consent-rate'); fs.appendChild(el('legend', null, 'How useful is this site for you?'));
    ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'].forEach(function (lab, n) {
      var l = el('label', 'consent-star'), i = el('input'); i.type = 'radio'; i.name = 'opinion-rating'; i.value = String(n + 1);
      l.appendChild(i); l.appendChild(el('span', null, (n + 1) + ' ' + lab)); fs.appendChild(l);
    });
    op.appendChild(fs);
    var cl = el('label', 'consent-label-block', 'Your comment (optional)'), ta = el('textarea'); ta.id = 'opinion-comment'; ta.rows = 3; ta.maxLength = 1000;
    cl.htmlFor = 'opinion-comment'; op.appendChild(cl); op.appendChild(ta);
    var st = el('p', 'consent-hint consent-status'); st.setAttribute('role', 'status');
    var send = el('button', 'btn btn-sm', 'Send my opinion'); send.type = 'submit';
    op.appendChild(send); op.appendChild(st);
    op.appendChild(el('p', 'consent-hint', 'This opens your own email app with your opinion filled in, addressed to us. Nothing is sent until you press send there.'));
    op.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = op.querySelector('input[name=opinion-rating]:checked');
      if (!r && !ta.value.trim()) { st.textContent = 'Choose a rating or write a comment first.'; return; }
      var text = 'Site: ' + site + '\nPage: ' + location.pathname + '\nRating: ' + (r ? r.value + ' of 5' : 'not given') + '\nComment: ' + ta.value.trim();
      var api = b && b.getAttribute('data-api');
      function byMail() {
        if (email) location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Website opinion') + '&body=' + encodeURIComponent(text);
        st.textContent = 'Thank you. Your email app should open now.';
      }
      if (!api || !window.fetch) { byMail(); return; }
      /* The members app answers with a short reference the visitor can keep. If it cannot be reached, fall back to email. */
      fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ site: location.hostname, audience: 'public', rating: r ? +r.value : null, comment: ta.value.trim(), page: location.pathname }) })
        .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
        .then(function (d) { op.reset(); st.textContent = 'Thank you. We have it' + (d && d.ref ? ': your reference is ' + d.ref + '.' : '.'); })
        .catch(byMail);
    });
    body.appendChild(op);
    document.body.appendChild(panel);
  }
  function open(from, toOpinion) {
    if (!panel) build();
    opener = from || null;
    panel.hidden = false;
    var f = toOpinion ? panel.querySelector('#site-opinion input') : panel.querySelector('#consent-improve');
    if (f) f.focus();
  }
  function close() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    if (opener && opener.focus) opener.focus();
  }
  function footerLinks() {
    var a = document.querySelector('.site-foot a[href*="cookies"]');
    if (!a || document.querySelector('[data-consent-manage].foot-choice')) return;
    var li = a.closest('li');
    [['Privacy choices', false], ['Tell us what you think', true]].forEach(function (it) {
      var b = el('button', 'foot-choice', it[0]); b.type = 'button'; b.setAttribute('data-consent-manage', it[1] ? 'opinion' : '');
      if (li) { var n = el('li'); n.appendChild(b); li.parentNode.appendChild(n); } else a.parentNode.appendChild(b);
    });
  }
  function strip() {
    var m = document.getElementById('main'), b = banner();
    if (!m || document.querySelector('.opinion-strip') || (b && b.getAttribute('data-no-strip') !== null)) return;
    var w = el('aside', 'opinion-strip'); w.setAttribute('aria-label', 'Your opinion');
    var inner = el('div', 'wrap opinion-inner');
    inner.appendChild(el('p', 'opinion-q', 'Was this page useful? Tell us what would make it better.'));
    var bt = el('button', 'btn btn-sm btn-ghost', 'Tell us what you think'); bt.type = 'button'; bt.setAttribute('data-consent-manage', 'opinion');
    inner.appendChild(bt);
    var said = b && b.getAttribute('data-said');
    if (said) { var a = el('a', 'opinion-said', 'You said, we did'); a.href = said; inner.appendChild(a); }
    w.appendChild(inner); m.appendChild(w);
  }
  function init() {
    load(); footerLinks(); strip();
    document.addEventListener('click', function (e) {
      var m = e.target.closest ? e.target.closest('[data-consent-manage]') : null;
      if (m) { e.preventDefault(); open(m, m.getAttribute('data-consent-manage') === 'opinion'); return; }
      var c = e.target.closest ? e.target.closest('.cookie [data-cookie]') : null;
      if (c) decide(c.getAttribute('data-cookie'));
      if (panel && !panel.hidden && !panel.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ---------- Watermark: every page carries a light, fixed mark with the site name and the time of viewing.
   It never takes clicks and sits in a corner on screen; printed copies get a larger diagonal mark and the address.
   When a member is signed in it carries the member ID instead of "public copy". ---------- */
(function () {
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function stamp() {
    var d = new Date(), m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear() + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function init() {
    if (document.querySelector('.wm')) return;
    var b = document.querySelector('.cookie');
    var site = (b && b.getAttribute('data-site')) || document.title.split('|').pop().trim();
    /* Signed in, the member zone sets window.SITE_MEMBER (or HFL_MEMBER) = {id, ...}: the mark shows the member ID. */
    function who() { var m = window.SITE_MEMBER || window.HFL_MEMBER; return m && m.id ? 'member ' + m.id : ''; }
    function wmText() { var x = who(); return site + (x ? ' \u00b7 ' + x : '') + ' \u00b7 viewed ' + stamp(); }
    var text = wmText();
    var w = document.createElement('div'); w.className = 'wm'; w.setAttribute('aria-hidden', 'true'); w.textContent = text;
    var p = document.createElement('div'); p.className = 'wm-print'; p.setAttribute('aria-hidden', 'true');
    var big = document.createElement('span'); big.className = 'wm-big'; big.textContent = site; p.appendChild(big);
    var line = document.createElement('span'); line.className = 'wm-line'; line.textContent = 'Printed from ' + location.href.split('#')[0] + ' on ' + stamp() + '. The English page online is the official version.'; p.appendChild(line);
    document.body.appendChild(w); document.body.appendChild(p);
    ['site-member', 'hfl-member'].forEach(function (ev) { document.addEventListener(ev, function () { w.textContent = wmText(); }); });
    window.addEventListener('beforeprint', function () { line.textContent = 'Printed from ' + location.href.split('#')[0] + ' on ' + stamp() + '. The English page online is the official version.'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


/* Our names in every language. A name such as Granth carries its meaning (Library). Mark it on a page as
   <span data-term="granth">Granth</span>. On the English page it reads "Granth (Library)". In any other language
   (our translated copy, or the browser's own translation) it shows the meaning in that language, with the name
   kept as a tooltip. For a language not yet in the table, the English meaning is left for the translation to carry. */
(function () {
  /* TERMS:BEGIN generated by websites/own-build/i18n/make.py from terms.tsv; edit terms.tsv, not this block */
  var L = ["en", "hi", "sa", "kn", "ta", "te", "mr", "bn", "gu", "ml", "pa", "or", "ur", "ar", "fr", "es", "de", "pt", "zh-CN", "ja", "ms", "tl"];
  var T = {};
  /* TERMS:END */
  function current() {
    var m = /[?&]_x_tr_tl=([^&#]+)/.exec(location.search);
    return m ? decodeURIComponent(m[1]) : (document.documentElement.getAttribute('lang') || 'en');
  }
  function column(code) {
    var c = String(code).toLowerCase(), i;
    for (i = 0; i < L.length; i++) if (L[i].toLowerCase() === c) return i;
    c = c.split('-')[0];
    for (i = 0; i < L.length; i++) if (L[i].toLowerCase() === c) return i;
    return -1;
  }
  function text(key, code) {
    var t = T[key]; if (!t) return null;
    var i = column(code);
    if (i === 0) return t[0] + ' (' + t[1] + ')';
    return i > 0 ? t[i + 1] : t[1];
  }
  function apply() {
    var code = current(), i = column(code);
    Array.prototype.forEach.call(document.querySelectorAll('[data-term]'), function (n) {
      var key = n.getAttribute('data-term'), v = text(key, code);
      if (v == null) return;
      if (n.textContent !== v) n.textContent = v;
      n.title = T[key][0];
      if (i >= 0) { n.setAttribute('translate', 'no'); n.lang = i === 0 ? 'en' : L[i]; }
      else { n.removeAttribute('translate'); n.lang = 'en'; }
    });
  }
  window.siteTerms = { text: text, languages: L.slice(), apply: apply };
  apply();
  if (window.MutationObserver) new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();


/* Message box. Every email link on the page opens this box inside the site, so a visitor writes to the team
   (for example "Sales and quotations") without leaving the page. When the site has its messages address
   (<meta name="messages-api" content="https://.../api/v1/public/messages">, origin added to connect-src), the box
   sends {to, name, email, subject, message, page, site} there; the message reaches the company inbox and from there
   the right person. Until then the box says plainly that online sending is not open yet and sends nothing. */
(function () {
  function el(t, cls, txt) { var e = document.createElement(t); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function api() { var m = document.querySelector('meta[name="messages-api"]'); return m ? m.getAttribute('content') : ''; }
  function field(id, label, type, req) {
    var w = el('div', 'mb-field'), l = el('label', null, label), i = el(type === 'area' ? 'textarea' : 'input');
    l.htmlFor = id; i.id = id; i.name = id.replace('mb-', '');
    if (type !== 'area') i.type = type; else i.rows = 6;
    if (req) i.required = true; else l.appendChild(el('span', 'mb-opt', ' (optional)'));
    if (type === 'email') i.autocomplete = 'email';
    if (id === 'mb-name') i.autocomplete = 'name';
    w.appendChild(l); w.appendChild(i); return w;
  }
  var box, form, toLine, status, sendBtn, to = '', opener = null;
  function label(a) {
    /* "Sales and quotations: sales@..." on contact cards gives the team name; otherwise the address itself. */
    var p = a.parentNode, t = p && p.textContent ? p.textContent.split(':')[0].trim() : '';
    return t && t.length < 60 && t !== a.textContent.trim() ? t : '';
  }
  function build() {
    box = el('dialog', 'mail-box');
    box.setAttribute('aria-labelledby', 'mb-title');
    form = el('form', 'mb-form'); form.noValidate = false;
    var top = el('div', 'mb-top'), h = el('h2', null, 'Write to us'); h.id = 'mb-title';
    var x = el('button', 'lang-x', ''); x.type = 'button'; x.setAttribute('aria-label', 'Close');
    var NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg'), pth = document.createElementNS(NS, 'path');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); pth.setAttribute('d', 'M6 6l12 12M18 6L6 18');
    pth.setAttribute('fill', 'none'); pth.setAttribute('stroke', 'currentColor'); pth.setAttribute('stroke-width', '2'); pth.setAttribute('stroke-linecap', 'round');
    s.appendChild(pth); x.appendChild(s); x.addEventListener('click', close);
    top.appendChild(h); top.appendChild(x); form.appendChild(top);
    toLine = el('p', 'mb-to'); form.appendChild(toLine);
    form.appendChild(field('mb-name', 'Your name', 'text', true));
    form.appendChild(field('mb-email', 'Your email', 'email', true));
    form.appendChild(field('mb-subject', 'Subject', 'text', false));
    form.appendChild(field('mb-message', 'Message', 'area', true));
    form.appendChild(el('p', 'mb-note', 'We use your details only to answer you. Please do not send passwords or payment details.'));
    status = el('p', 'mb-status'); status.setAttribute('role', 'status'); form.appendChild(status);
    var row = el('div', 'mb-actions'); sendBtn = el('button', 'btn', 'Send message'); sendBtn.type = 'submit';
    var cancel = el('button', 'btn btn-ghost', 'Cancel'); cancel.type = 'button'; cancel.addEventListener('click', close);
    row.appendChild(sendBtn); row.appendChild(cancel); form.appendChild(row);
    form.addEventListener('submit', submit);
    box.appendChild(form);
    box.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    document.body.appendChild(box);
  }
  function open(a) {
    if (!box) build();
    opener = a;
    var href = a.getAttribute('href') || '', addr = decodeURIComponent(href.replace(/^mailto:/i, '').split('?')[0]);
    var subj = (/[?&]subject=([^&]*)/i.exec(href) || [])[1];
    to = addr;
    var team = label(a);
    toLine.textContent = 'To: ' + (team ? team + ' (' + addr + ')' : addr);
    status.textContent = ''; status.className = 'mb-status';
    sendBtn.disabled = false;
    if (subj) form.querySelector('#mb-subject').value = decodeURIComponent(subj);
    if (box.showModal) box.showModal(); else box.setAttribute('open', '');
    form.querySelector('#mb-name').focus();
  }
  function close() { if (!box) return; if (box.close) box.close(); else box.removeAttribute('open'); if (opener) opener.focus(); }
  function submit(e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var url = api();
    if (!url) {
      status.className = 'mb-status mb-wait';
      status.textContent = 'Online sending opens when this site is launched. Your message has not been sent yet; it stays here while this page is open.';
      return;
    }
    var v = function (id) { return form.querySelector(id).value.trim(); };
    var body = { to: to, name: v('#mb-name'), email: v('#mb-email'), subject: v('#mb-subject'), message: v('#mb-message'), page: location.pathname, site: location.hostname };
    sendBtn.disabled = true; status.className = 'mb-status'; status.textContent = 'Sending...';
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json().catch(function () { return {}; });
    }).then(function (d) {
      form.reset();
      status.className = 'mb-status mb-ok';
      status.textContent = 'Thank you. Your message has been sent' + (d && d.ref ? ' (reference ' + d.ref + ')' : '') + '. We reply by email.';
    }).catch(function () {
      /* The online service is not reachable (or not set up yet): hand the message to the visitor's own email app. */
      sendBtn.disabled = false;
      status.className = 'mb-status mb-wait';
      status.textContent = 'Online sending is not available just now, so your email app will open with your message. Please press Send there.';
      if (to) location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(body.subject || 'Website message') + '&body=' + encodeURIComponent((body.name ? 'From: ' + body.name + ' <' + body.email + '>\n\n' : '') + body.message);
    });
  }
  /* Other scripts (an enquiry list) open the box with a ready message. */
  window.siteMessage = {
    open: function (o) {
      var a = document.createElement('a');
      a.href = 'mailto:' + (o.to || '') + (o.subject ? '?subject=' + encodeURIComponent(o.subject) : '');
      a.textContent = o.to || '';
      open(a);
      opener = o.opener || null;
      if (o.team) toLine.textContent = 'To: ' + o.team + (o.to ? ' (' + o.to + ')' : '');
      if (o.message) form.querySelector('#mb-message').value = o.message;
    }
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault(); open(a);
  });
})();

/* Remembered language: once a visitor has chosen a language (the menu said it opens an automatic translation),
   the next pages open in it without another click. English stays the default: nothing is applied until a choice is made,
   and choosing English clears it. Skipped on translated copies, on local and preview addresses (the translation
   service cannot reach them), and once per page visit so there is never a loop. */
(function () {
  var KEY = 'site-lang', FLAG = 'site-lang-tried';
  var code; try { code = localStorage.getItem(KEY); } catch (e) { return; }
  if (!code || code === 'en') return;
  var h = location.hostname;
  if (/\.translate\.goog$/.test(h) || h === 'localhost' || h === '127.0.0.1' || /\.netlify\.app$/.test(h) || /^\d+\.\d+\.\d+\.\d+$/.test(h)) return;
  try { if (sessionStorage.getItem(FLAG + ':' + location.pathname)) return; sessionStorage.setItem(FLAG + ':' + location.pathname, '1'); } catch (e) { return; }
  location.replace('https://translate.google.com/translate?sl=en&tl=' + encodeURIComponent(code) + '&u=' + encodeURIComponent(location.href));
})();
