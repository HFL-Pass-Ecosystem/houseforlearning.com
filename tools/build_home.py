"""Adds the owner's welcome text, two markets, platform and marketplace sections to the home page (idempotent)."""
import re
p='site/index.html'; s=open(p).read()
s=re.sub(r'<!--HOME-NEW-->.*?<!--/HOME-NEW-->','',s,flags=re.S)
s=re.sub(r'<!--HOME-MID-->.*?<!--/HOME-MID-->','',s,flags=re.S)
# hero text
s=re.sub(r'(<section class="hero hero-lux".*?<div class="wrap hero-grid"><div>)<p class="kicker">.*?</p><h1 id="h1">.*?</h1><p>.*?</p><p class="buddy">.*?</p>',
 r'\1<p class="kicker">Learn and earn</p><h1 id="h1">Bloom where you are planted.</h1><p>We help people and institutions around the world build skills, learn better and reach more customers, using one digital enterprise platform backed by emerging technology and domain knowledge.</p><p class="buddy"><strong>Course and career pathways:</strong> your growth is our goal.</p>',s,count=1,flags=re.S)
new='''<!--HOME-NEW-->
<section class="sec" aria-labelledby="mk-h"><div class="wrap"><div class="sec-head"><p class="kicker">Two markets</p><h2 id="mk-h">Learning from school age to a lifelong career</h2></div><div class="split2"><div class="lux-panel"><h3>School education</h3><p>Kindergarten to grade 12. Learning is live or self-paced, on computers, tablets and phones.</p></div><div class="lux-panel"><h3>After school</h3><p>Undergraduate, postgraduate and professional learning, live or self-paced, with course and career pathways that lead to work.</p></div></div></div></section>
<section class="sec alt" aria-labelledby="pf-h"><div class="wrap"><div class="sec-head"><p class="kicker">The platform</p><h2 id="pf-h">How it works, in plain words</h2></div><ol class="lux-steps"><li><b>Reads</b><span>It understands what you write and what you ask.</span></li><li><b>Decides and acts</b><span>It carries whole processes through, step by step.</span></li><li><b>Writes in human language</b><span>Replies and feedback you can read at once.</span></li><li><b>Make and check</b><span>The system makes an output; you or your manager check and approve it, or send it round again.</span></li></ol><p class="lux-note">An ask-me-anything coach answers from trusted libraries and public information. Authoring, training, learning, earning: gamification and AI keep learners engaged, with traceable paths forwards and back. Aligned with GDPR and its equivalents, the UN SDGs and the OECD, and each country's own governance charter.</p></div></section>
<!--/HOME-NEW-->
'''
mid='''<!--HOME-MID-->
<section class="sec" aria-labelledby="mw-h"><div class="wrap"><div class="sec-head"><p class="kicker">Marketplace and workplace</p><h2 id="mw-h">One place to learn, one place to work</h2></div><ul class="lux-list"><li>Connected-device services and people</li><li>Information and communications services and people</li><li>A no-code full stack: ERP, CRM, MIS and office suite, driven by custom apps</li><li>Open-standard course and career pathways</li><li>Consultancy, channel, support and a full-service ecosystem</li><li>A four-level partner, affiliate and value-provider network</li><li>AI and machine learning, big data and analytics</li><li>Authoring and training, with mentors for professional, academic, vocational, entrepreneurial and recreational goals</li></ul></div></section>
<section class="sec alt" aria-labelledby="th-h"><div class="wrap"><div class="sec-head"><p class="kicker">What we focus on</p><h2 id="th-h">Four themes behind our programmes</h2></div><ul class="cards"><li class="card"><h3>Education and development</h3><p>Schools and learning facilities, support for people with special needs and children with autism, and knowledge and human-development programmes.</p></li><li class="card"><h3>Sustainability</h3><p>Hardware, software, cloud, data and analytics skills for safe, smart, secure, sustainable technology, with a focus on small economies, rural and underserved communities.</p></li><li class="card"><h3>Life sciences and healthcare technology</h3><p>Health, environmental, digital technology and AI ventures.</p></li><li class="card"><h3>Small and medium enterprise development</h3><p>Small firms must stay agile and profitable. We link education providers, skills, workers, certifiers and employers so upskilling and reskilling become part of the business.</p></li></ul></div></section>
<!--/HOME-MID-->
'''
a=s.index('<section class="sec alt" aria-labelledby="s0-h">')
s=s[:a]+new+s[a:]
b=s.index('<section class="sec alt" aria-labelledby="s2-h">')
s=s[:b]+mid+s[b:]
open(p,'w').write(s)
