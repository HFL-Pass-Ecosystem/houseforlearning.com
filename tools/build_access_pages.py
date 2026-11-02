#!/usr/bin/env python3
"""Test pay-to-access pages: pay.html (test payment step) and members-courses.html (My courses). TEST ONLY: no real money, no provider, no bank numbers."""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
S = B.S
SCR = '<script src="assets/access.js" defer></script>'
pay = ('<div class="wrap"><div id="pay-box" class="acc-card" style="display:block"><p id="pay-out">Loading.</p></div>'
       '<noscript><p>This test step needs JavaScript.</p></noscript></div>'
       '<script>document.addEventListener("DOMContentLoaded",function(){function g(n){var m=new RegExp("[?&]"+n+"=([^&]*)").exec(location.search);return m?decodeURIComponent(m[1].replace(/\\+/g," ")):""}'
       'var c=g("course"),t=g("t")||c,o=document.getElementById("pay-out"),box=document.getElementById("pay-box");'
       'if(!/^[a-z0-9._-]+\\.html$/i.test(c)){o.textContent="Choose a course first.";box.innerHTML+=\'<p><a class="btn" href="courses-all.html">Browse courses</a></p>\';return}'
       'if(!/(?:^|; )hfl_in=1/.test(document.cookie)){o.textContent="Sign in first, then come back to join this course.";box.innerHTML+=\'<p><a class="btn" href="login.html">Sign in</a></p>\';return}'
       'box.innerHTML="";var h=document.createElement("h3");h.textContent="Join: "+t;box.appendChild(h);'
       'var p=document.createElement("p");p.textContent="Pay by bank transfer or UPI. In this test no payment is taken: press the button below to pretend you have paid. Test only. No real money is taken.";box.appendChild(p);'
       'var ul=document.createElement("ul");["Bank transfer: details are shown here when payments go live.","UPI: the UPI details are shown here when payments go live."].forEach(function(x){var li=document.createElement("li");li.textContent=x;ul.appendChild(li)});box.appendChild(ul);'
       'var b=document.createElement("button");b.type="button";b.className="btn";b.textContent="I have paid (test)";'
       'b.addEventListener("click",function(){var d=window.HFLAccess.load();var r=d[c]||{};d[c]={paid:true,title:t,total:r.total||0,done:r.done||[],paidAt:Date.now(),updated:Date.now()};window.HFLAccess.save(d);location.href=c});box.appendChild(b);'
       'var a=document.createElement("a");a.href=c;a.textContent="Back to the course";a.style.marginLeft="14px";box.appendChild(a);});</script>')
mine = ('<div class="wrap"><div id="mycourses"></div></div>'
        '<script>document.addEventListener("DOMContentLoaded",function(){var el=document.getElementById("mycourses");'
        'if(!/(?:^|; )hfl_in=1/.test(document.cookie)){el.innerHTML=\'<p>Sign in to see your courses.</p><p><a class="btn" href="login.html">Sign in</a></p>\';return}'
        'var d=window.HFLAccess.load(),ks=Object.keys(d).filter(function(k){return d[k]&&d[k].paid});'
        'if(!ks.length){el.innerHTML=\'<p>You have no courses yet. Open a course, read the preview, and press Join this course.</p><p><a class="btn" href="courses-all.html">Browse courses</a></p>\';return}'
        'ks.sort(function(a,b){return (d[b].updated||0)-(d[a].updated||0)});'
        'ks.forEach(function(k){var r=d[k],t=r.total||0,c=(r.done||[]).length,card=document.createElement("div");card.className="acc-card";'
        'var l=document.createElement("div"),h=document.createElement("h3"),p=document.createElement("p");h.textContent=r.title||k;p.textContent=t?(c+" of "+t+" modules done"):"Not started";l.appendChild(h);l.appendChild(p);'
        'var a=document.createElement("a");a.className="btn";a.href=k;a.textContent=c?"Continue":"Start";card.appendChild(l);card.appendChild(a);el.appendChild(card)})});</script>')
B.page('pay.html', 'Join a course (test)', 'Test payment step. No real money is taken.', 'Join this course', 'Test only. No real money is taken.', B.sec('', 'pay', 'test payment', 'Pay and open the course', pay), B.crumb(('Courses', 'courses-hub.html'), ('Join', None)), kicker='Members')
B.page('members-courses.html', 'My courses', 'Courses you have joined in this test', 'My courses', 'Courses you have joined. Test only. Progress is kept in this browser.', B.sec('', 'mc', 'my courses', 'Your courses', mine), B.crumb(('Members', 'members.html'), ('My courses', None)), kicker='Members')
for f in ('pay.html', 'members-courses.html'):
    p = S / f; t = p.read_text()
    if 'access.js' not in t: p.write_text(t.replace('</body>', SCR + '\n</body>', 1))
    t = p.read_text(); t = t.replace('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex">'); p.write_text(t)
print('access pages built')
