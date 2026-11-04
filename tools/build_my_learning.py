#!/usr/bin/env python3
"""Builds site/my-learning.html: one signed-in home so a learner sees what to do next without hunting.
Test only: uses the hfl_in cookie and HFLAccess (browser storage). Honest labels: what works and what is not built yet."""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
S = B.S
js = ('<script>document.addEventListener("DOMContentLoaded",function(){window.HFLAccess.ready.then(function(){var out=document.getElementById("ml"),A=window.HFLAccess;'
 'function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}'
 'function link(h,t,c){var a=el("a",c||"btn",t);a.href=h;return a}'
 'if(!A||!A.signedIn()){out.appendChild(el("p","","Sign in to see your learning home."));out.appendChild(link("login.html","Sign in"));return}'
 'var d=A.load(),ks=Object.keys(d).filter(function(k){return d[k]&&d[k].paid});ks.sort(function(a,b){return (d[b].updated||0)-(d[a].updated||0)});'
 'var h=new Date().getHours(),g=h<12?"Good morning":h<18?"Good afternoon":"Good evening";out.appendChild(el("h2","",g+". Let us keep your momentum going."));'
 'var card=el("div","acc-card");card.style.display="block";'
 'if(ks.length){var r=d[ks[0]],t=r.total||0,c=(r.done||[]).length;card.appendChild(el("p","acc-k","Continue where you left off"));card.appendChild(el("h3","",r.title||ks[0]));card.appendChild(el("p","",t?(c+" of "+t+" modules done"):"Not started yet"));card.appendChild(link(ks[0],c?"Continue":"Start"))}'
 'else{card.appendChild(el("p","acc-k","Your first step"));card.appendChild(el("h3","","Start with the AI side-income path"));card.appendChild(el("p","","Lesson 1 is free to read. Join to open all 15 lessons."));card.appendChild(link("ai-income-1.html","Open lesson 1"))}'
 'out.appendChild(card);'
 'var rd=el("div","acc-card");rd.style.display="block";rd.appendChild(el("h3","","Before your first session"));var ul=el("ul");["Check your sound and internet","Keep a notebook ready","Join five minutes early"].forEach(function(x){ul.appendChild(el("li","",x))});rd.appendChild(ul);out.appendChild(rd);'
 'var jn=el("div","acc-card");jn.style.display="block";jn.appendChild(el("h3","","Your journey"));var u4=el("ul");'
 '[["Build: 10 lessons","ai-income-1.html"],["Sell: 4 lessons","ai-income-11.html"],["Hackathon: build, pitch, show","ai-income-15.html"]].forEach(function(x,i){var li=el("li");var j=ks.some(function(k){return /^ai-income|ai-side-income/.test(k)});li.appendChild(link(x[1],"Step "+(i+1)+": "+x[0],"btn btn-ghost"));li.appendChild(el("span","note"," "+(i===0||j?"open":"opens when you join")));u4.appendChild(li)});jn.appendChild(u4);out.appendChild(jn);'
 'var td=el("div","acc-card");td.style.display="block";td.appendChild(el("h3","","Your to-do"));var l2=el("ul");'
 '[["Confirm your email and your WhatsApp number (not built yet on this test site)",""],["Pick a course and join it","start-a-course.html"],["See all my courses","members-courses.html"]].forEach(function(x){var li=el("li");if(x[1]){li.appendChild(link(x[1],x[0],"btn btn-ghost"))}else{li.textContent=x[0]}l2.appendChild(li)});td.appendChild(l2);out.appendChild(td);'
 'var m=el("div","acc-card");m.style.display="block";m.appendChild(el("h3","","Everything in one place"));var u3=el("ul");'
 '[["Learn: all courses","courses-all.html","works"],["AI side-income path","ai-side-income.html","works"],["Learning hub","learning-hub.html","works"],["Live sessions","live-sessions.html","works"],["Projects and showcase","projects.html","works"],["Career portal","career-portal.html","works"],["Certificate hub","certificate-hub.html","works"],["AI toolkit","ai-toolkit.html","works"],["Community","community.html","works"],["Learning feed","learning-feed.html","works"],["Starter kit","starter-kit.html","works"],["Certificates and grades","members-courses.html","works"],["Help","help.html","works"]].forEach(function(x){var li=el("li");if(x[1]){li.appendChild(link(x[1],x[0],"btn btn-ghost"));li.appendChild(el("span","note"," "+x[2]))}else{li.textContent=x[0]+": "+x[2]}u3.appendChild(li)});m.appendChild(u3);out.appendChild(m)})});</script>')
body = B.sec('', 'ml-s', 'signed-in home', 'Your learning home', '<div id="ml"><noscript><p>This page needs JavaScript.</p></noscript></div>' + js
             + '<p class="ws-note">Test only. What you see is kept in this browser.</p>')
B.page('my-learning.html', 'My learning home', 'Your next step, your courses and help in one place. Test only.', 'My learning home',
       'Your next step, your courses and help in one place.', body, B.crumb(('Members', 'members.html'), ('My learning home', None)), kicker='Members')
p = S / 'my-learning.html'; t = p.read_text()
if 'access.js' not in t: t = t.replace('</body>', '<script src="assets/access.js" defer></script>\n</body>', 1)
t = t.replace('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex">')
p.write_text(t)
print('my-learning.html written')
