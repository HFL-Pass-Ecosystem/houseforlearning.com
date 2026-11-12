(function(){
  var E=window.SeoEngine, $=function(i){return document.getElementById(i)};
  var st={kws:[],plan:[],posts:[],sel:null};
  try{var sv=JSON.parse(localStorage.getItem('seoDemo')||'null');if(sv&&sv.posts)st.posts=sv.posts}catch(e){}
  function persist(){try{localStorage.setItem('seoDemo',JSON.stringify({posts:st.posts}))}catch(e){}}
  function txt(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}

  var siteSel=$('site');Object.keys(E.SITES).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=E.SITES[k].name;siteSel.appendChild(o)});
  var t=new Date(Date.now()+86400000);$('start').value=t.toISOString().slice(0,10);

  function renderKw(){
    $('kwbody').innerHTML=st.kws.map(function(k,i){return '<tr><td class="wrap">'+txt(k.phrase)+'</td><td>'+k.volume.toLocaleString()+'</td><td>'+k.difficulty+' / 100</td><td>'+k.intent+'</td><td><button class="ghost" data-w="'+i+'">Write now</button></td></tr>'}).join('')||'<tr><td colspan="5" class="muted">Type a topic and press Find keywords.</td></tr>';
  }
  function renderPlan(){
    $('planbody').innerHTML=st.plan.map(function(p,i){return '<tr><td>'+p.date+'</td><td class="wrap">'+txt(p.keyword)+'</td><td><span class="pill '+p.status+'">'+p.status+'</span></td><td><button class="ghost" data-p="'+i+'">Write draft</button></td></tr>'}).join('')||'<tr><td colspan="4" class="muted">Press Plan top 10 keywords.</td></tr>';
  }
  function load(p){
    $('title').value=p.title;$('kw').value=p.keyword;$('meta').value=p.meta;$('body').value=p.body;check();
  }
  function cur(){return{title:$('title').value,keyword:$('kw').value,meta:$('meta').value,body:$('body').value,site:siteSel.value}}
  function check(){
    var p=cur(),r=E.seoScore(p);
    $('scoreNum').textContent=r.score;$('scoreBar').style.width=r.score+'%';
    $('checks').innerHTML=r.checks.map(function(c){return '<li class="'+(c.ok?'ok':'no')+'">'+(c.ok?'✓ ':'✗ ')+txt(c.label)+(c.ok?'':' <span class="muted">'+txt(c.fix)+'</span>')+'</li>'}).join('');
    var rc=E.rulesCheck(p.title+' '+p.meta+' '+p.body,[]);
    $('rules').textContent=rc.join(' ');
    $('preview').innerHTML=E.toHtml(p.body);
    return r;
  }
  function draftFor(kw){var p=E.draftPost(kw,siteSel.value);load(p);$('s3').scrollIntoView({behavior:'smooth'})}
  function renderQ(){
    $('qbody').innerHTML=st.posts.map(function(p,i){return '<tr><td class="wrap">'+txt(p.title)+'</td><td>'+E.SITES[p.site].name+'</td><td>'+p.score+'</td><td><span class="pill '+p.status+'">'+p.status+'</span></td><td>'+(p.status==='draft'?'<button class="ghost" data-a="'+i+'"'+(p.score<70||p.blocked?' disabled title="Needs score 70 and no rule warnings"':'')+'>Approve</button> ':'')+'<button class="ghost" data-e="'+i+'">Open</button></td></tr>'}).join('')||'<tr><td colspan="5" class="muted">Saved drafts appear here.</td></tr>';
  }
  function credits(){var c=E.credits(+$('cK').value||0,+$('cA').value||0);$('mBase').textContent=c.base;$('mAdmin').textContent=c.admin;$('mTotal').textContent=c.total}

  $('find').onclick=function(){st.kws=E.ideaKeywords($('seed').value);renderKw()};
  $('plan').onclick=function(){if(!st.kws.length)st.kws=E.ideaKeywords($('seed').value),renderKw();st.plan=E.planCalendar(st.kws.slice(0,10),$('start').value,+$('per').value);renderPlan()};
  $('kwbody').onclick=function(e){var i=e.target.getAttribute('data-w');if(i!==null)draftFor(st.kws[i].phrase)};
  $('planbody').onclick=function(e){var i=e.target.getAttribute('data-p');if(i!==null){st.plan[i].status='draft';renderPlan();draftFor(st.plan[i].keyword)}};
  $('redraft').onclick=function(){draftFor($('kw').value||$('seed').value)};
  ['title','kw','meta','body'].forEach(function(id){$(id).addEventListener('input',check)});
  $('save').onclick=function(){var p=cur(),r=check();p.score=r.score;p.blocked=E.rulesCheck(p.title+' '+p.meta+' '+p.body,[]).length>0;p.status='draft';p.slug=p.keyword.toLowerCase().replace(/[^a-z0-9]+/g,'-');var i=st.posts.findIndex(function(x){return x.slug===p.slug&&x.site===p.site});if(i>-1)st.posts[i]=p;else st.posts.push(p);persist();renderQ();$('s4').scrollIntoView({behavior:'smooth'})};
  $('qbody').onclick=function(e){
    var a=e.target.getAttribute('data-a'),o=e.target.getAttribute('data-e');
    if(a!==null){st.posts[a].status='approved';persist();renderQ();var p=st.posts[a];$('export').value='<title>'+p.title+'</title>\n<meta name="description" content="'+p.meta.replace(/"/g,'&quot;')+'">\n'+E.toHtml(p.body)}
    if(o!==null){var p2=st.posts[o];siteSel.value=p2.site;load(p2);$('s3').scrollIntoView({behavior:'smooth'})}
  };
  $('copy').onclick=function(){var v=$('export').value;if(!v){$('copied').textContent='Approve a draft first.';return}
    function sel(){$('export').select();$('copied').textContent='Selected. Press Ctrl+C to copy.'}
    try{navigator.clipboard.writeText(v).then(function(){$('copied').textContent='Copied.'},sel)}catch(e){sel()}};
  $('cK').oninput=$('cA').oninput=credits;

  renderKw();renderPlan();renderQ();credits();
  st.kws=E.ideaKeywords($('seed').value);renderKw();
  draftFor($('seed').value?st.kws[0].phrase:'time management');window.scrollTo(0,0);
})();
