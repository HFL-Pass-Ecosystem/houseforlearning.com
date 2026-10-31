"""Group 3 luxury pass: strips drawings and icon svgs, rewrites platform, marketplace and
business-systems copy from the HFL content pack, links assets/group3-lux.css.
Idempotent. Run from repo root: python3 tools/refine_group3.py"""
import re, glob, os
S = 'site/'
def rd(p): return open(S + p, encoding='utf-8').read()
def wr(p, t): open(S + p, 'w', encoding='utf-8').write(t)

def main_swap(h, new):
    return re.sub(r'(<main id="main" tabindex="-1">\n).*?(<nav class="pager")', lambda m: m.group(1) + new + '\n' + m.group(2), h, count=1, flags=re.S)

def hero(kicker, title, lead, ctas):
    b = ''.join('<a class="btn%s" href="%s">%s</a>' % ('' if i == 0 else ' btn-ghost', u, t) for i, (t, u) in enumerate(ctas))
    return ('<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">%s</p><h1 id="h1">%s</h1>'
            '<p>%s</p><div class="ctas">%s</div></div></div></section>' % (kicker, title, lead, b))

def band(kicker, title, intro, items, alt=False, cols=''):
    cards = ''.join('<li class="card g3-card"><span class="g3-n">%02d</span><h3>%s</h3><p>%s</p>%s</li>' % (i + 1, t, d, ('<a class="more" href="%s">%s</a>' % l) if l else '') for i, (t, d, l) in enumerate(items))
    return ('<section class="sec%s" aria-labelledby="%s-h"><div class="wrap"><div class="sec-head"><p class="kicker">%s</p><h2 id="%s-h">%s</h2>%s</div>'
            '<div class="sec-body"><ul class="cards g3-cards %s">%s</ul></div></div></section>') % (
        ' alt' if alt else '', kicker[:3].replace(' ', ''), kicker, kicker[:3].replace(' ', ''), title, ('<p class="g3-intro">%s</p>' % intro) if intro else '', cols, cards)

def ink(kicker, title, paras, ctas):
    p = ''.join('<p>%s</p>' % x for x in paras)
    b = ''.join('<a class="btn%s" href="%s">%s</a>' % ('' if i == 0 else ' btn-ghost', u, t) for i, (t, u) in enumerate(ctas))
    return ('<section class="cta g3-ink" aria-labelledby="cta-h"><div class="wrap cta-inner"><div><p class="kicker">%s</p><h2 id="cta-h">%s</h2>%s<div class="ctas">%s</div></div></div></section>' % (kicker, title, p, b))

def split(kicker, title, paras, alt=False):
    p = ''.join('<p>%s</p>' % x for x in paras)
    return ('<section class="sec%s"><div class="wrap g3-split"><div><p class="kicker">%s</p><h2>%s</h2></div><div class="g3-prose">%s</div></div></section>' % (' alt' if alt else '', kicker, title, p))

# ---------- platform ----------
plat = (
 hero('The connected platform', 'Learn, earn and trade in one place',
  'One digital enterprise platform, backed by emerging technology and domain knowledge, helps people and institutions build skills, learn better and reach more customers. Authoring, training, learning, earning.',
  [('Career pathways','career-pathways.html'),('Marketplace','marketplace.html'),('Workplace','workplace.html')]) +
 split('Two markets', 'School and after school',
  ['The platform serves school education, from kindergarten to grade 12, and the after-school market of undergraduate, postgraduate and professional learners.',
   'In both, learning is live or self-paced, on a computer, a tablet or a phone, with a mentor to guide professional, academic, vocational, entrepreneurial and recreational goals.']) +
 band('What is inside', 'Six parts that work together', '',
  [('Course and career pathways','Short units, from one hour to one month, that stack into diplomas and degrees, each with a route to a career.',('career-pathways.html','See pathways')),
   ('Marketplace','Courses, services and skills offered by providers who are checked before they are listed.',('marketplace.html','See the marketplace')),
   ('Workplace','Real tasks, teams and projects where learned skills are put to work.',('workplace.html','See the workplace')),
   ('Business systems','A no-code full stack for customer records, resources, management information and office work.',('business-systems.html','See the systems')),
   ('Payments','Bank and UPI payments, with the price shown before you commit and a 14-day refund.',('payments.html','See payments')),
   ('Learning catalogue','The units and pathways already described on this site.',('catalogue.html','Open the catalogue'))], alt=True) +
 split('How it thinks', 'Make, then check',
  ['The platform reads text, decides and acts on whole processes, and writes replies in human language. It works on a simple rule: the system makes an output, then the learner or manager checks and approves it, or sends it round again.',
   'An ask-me-anything coach answers from trusted libraries and public information, replies in the learner’s language, shows what it costs, and hands over to a person when it should.']) +
 band('Fields we plan to serve', 'Learning for every part of the economy', 'Each field opens only after its units pass review.',
  [('Education and development','Schools, colleges and lifelong learners, including programmes for people with special needs.',None),
   ('Life sciences and healthcare technology','Health, environmental, digital technology and AI skills.',None),
   ('Sustainability','Safe, smart, secure and sustainable technology skills, with a focus on rural and underserved communities.',None),
   ('Micro, small and medium enterprises','Upskilling and reskilling as part of the business model, linking education providers, workers, certifiers and employers.',None),
   ('Energy, information and connected devices','Technology and management skills for energy and connected services.',None),
   ('Industry, agriculture, water and sport','Skills for plants and workshops, farm enterprises, water management, and sport infrastructure.',None)], alt=True) +
 split('Built to be trusted', 'Your data stays yours',
  ['The learner owns their data. The platform is aligned with GDPR and its equivalents, the UN Sustainable Development Goals and OECD principles, and each country’s own governance charter.',
   'Skills of many people are joined by automated systems to solve tasks to a stated condition and standard, and every step can be traced forward and back.']) +
 '<section class="sec alt" aria-labelledby="st-h"><div class="wrap"><div class="sec-head"><p class="kicker">Honest status</p><h2 id="st-h">Where each part stands today</h2></div><div class="sec-body"><div class="table-wrap"><table class="data"><caption>Status of the platform</caption><thead><tr><th scope="col">Part</th><th scope="col">Status</th></tr></thead><tbody>'
 '<tr><th scope="row" data-label="Part">Course catalogue and membership</th><td data-label="Status">Opening unit by unit</td></tr>'
 '<tr><th scope="row" data-label="Part">Career pathways</th><td data-label="Status">Planned, first pathways in preparation</td></tr>'
 '<tr><th scope="row" data-label="Part">Marketplace</th><td data-label="Status">Planned, providers verified before listing</td></tr>'
 '<tr><th scope="row" data-label="Part">Workplace</th><td data-label="Status">Planned, pilot by enquiry</td></tr>'
 '<tr><th scope="row" data-label="Part">Business systems</th><td data-label="Status">Being built, not yet shown to the public</td></tr>'
 '<tr><th scope="row" data-label="Part">Payments</th><td data-label="Status">Planned, nothing is charged until it opens</td></tr></tbody></table></div></div></div></section>' +
 ink('Your next step', 'Want to be part of it early?', ['Tell us your role and what you want to do.'], [('Contact us','contact.html#message-form'),('Membership','membership.html')])
)

# ---------- marketplace ----------
mkt = (
 hero('Marketplace and workplace', 'One place to learn, one to work',
  'Learners, trainers, institutions and businesses will offer and find courses, services and skills in one place, with every provider checked first.',
  [('Open the marketplace','contact.html#message-form'),('Become a provider','partner.html'),('How payments work','payments.html')]) +
 band('What you will find', 'Four kinds of listing', '',
  [('Courses and units','Short units and pathways from approved providers, in open-standard course and career pathways.',None),
   ('Services','Consultancy, coaching, assessment, design and project help, with channel and full-service support.',None),
   ('Skills for hire','People with a verified record of work done to a stated condition and standard.',None),
   ('Learning materials','Approved guides, kits and tools, and authoring and training support.',None)], alt=True, cols='g3-four') +
 split('The network', 'Four levels, hub and spoke',
  ['Partners, affiliates and value providers join a four-level hub-and-spoke network. Each tier is audited every quarter and agreed through a memorandum checklist, so a learner or a business always knows who stands behind a listing.',
   'Connected-device and information-and-communications services, and the people who deliver them, sit alongside AI and machine learning, big data and analytics, and career pathways.']) +
 band('Fair by design', 'Rules every listing follows', '',
  [('Checked first','Every provider is checked before a listing opens. Nothing is shown as available until it has been checked.',None),
   ('Price in plain view','Prices, taxes and fees are shown before you commit.',None),
   ('Recorded agreements','Agreements are made and recorded through this website.',None),
   ('A person helps','If something goes wrong, a person helps.',None)], alt=True, cols='g3-four') +
 ink('Your next step', 'Want to list something?', ['Use the contact form and choose “Become a trainer or partner”.'], [('Contact form','contact.html#message-form'),('Partner programme','partner.html')])
)

# ---------- business systems ----------
bus = (
 hero('Behind the scenes', 'The systems that keep us accountable',
  'Good service needs good records. One no-code full stack tracks people, resources and results, and we never show you anyone else’s private information.',
  [('The platform','platform.html'),('Privacy notice','privacy.html')]) +
 band('The full stack', 'Customers, resources and reports', '',
  [('Customer records (CRM)','Every enquiry, order and promise in one place, so nothing is lost.',None),
   ('Resource planning (ERP)','Orders, delivery, billing and stock followed from start to finish.',None),
   ('Management information (MIS)','Plain figures on what works, with the change history kept.',None),
   ('Office suite','Documents, sheets and mail for the people doing the work, driven by custom apps.',None)], alt=True, cols='g3-four') +
 split('One door', 'Opened through HFL-Pass',
  ['Subscribing organisations and channels reach the full stack through one sign-in, with their own identities, for a fee. Channels must use it, so records and audit trails stay in one place.']) +
 band('Our promise', 'Safe with us', '',
  [('Guardrails','We use sufficient guardrails and your information is safe with us.',None),
   ('You choose','You choose what is shared, and every choice starts switched off.',None),
   ('Team-level only','Organisations see only team-level insights.',None),
   ('No trackers','Our analytics set no tracking cookies.',None)], alt=True, cols='g3-four') +
 '<section class="sec"><div class="wrap"><div class="sec-head"><p class="kicker">Status</p><h2>Where this stands</h2></div><div class="sec-body"><p class="note">These systems are being built and tested. They are not yet open to the public, and we say so on each page until they are.</p></div></div></section>' +
 ink('Your next step', 'Questions about your data?', ['Read our privacy notice, or ask us.'], [('Privacy notice','privacy.html'),('Contact','contact.html#message-form')])
)

for p, new in (('platform.html', plat), ('marketplace.html', mkt), ('business-systems.html', bus)):
    wr(p, main_swap(rd(p), new))

# ---------- workspace home ----------
def ws_home(h):
    h = re.sub(r'<div class="ws-facewrap">.*?</div>(?=<div class="ws-fn">)', '', h, flags=re.S)
    return h
h = rd('workspace.html'); wr('workspace.html', ws_home(h))

# ---------- all my pages: strip drawings ----------
mine = ['products','platform','marketplace','business-systems','insights','workspace'] + [os.path.basename(x)[:-5] for x in glob.glob(S + 'workspace-*.html')]
for n in mine:
    h = rd(n + '.html')
    h = re.sub(r'<figure>\s*<svg.*?</svg>\s*</figure>', '', h, flags=re.S)
    h = re.sub(r'<svg class="ws-ic".*?</svg>', '', h, flags=re.S)
    h = re.sub(r'<span class="op-tile">.*?</span>(?=<div>)', '', h, flags=re.S)
    h = re.sub(r'<section class="sec op-host"><div class="wrap"><p class="kicker">Explainers</p>.*?</section>\n', '', h, flags=re.S)
    h = h.replace('class="wrap hero-grid">', 'class="wrap hero-grid solo">')
    if 'group3-lux.css' not in h:
        h = h.replace('<link rel="stylesheet" href="assets/site-lux.css">', '<link rel="stylesheet" href="assets/site-lux.css">\n<link rel="stylesheet" href="assets/group3-lux.css">', 1)
    wr(n + '.html', h)
print('ok', len(mine))

# insights: hide placeholder rows (pending) and tables left empty; keep benchmark rows only
h = rd('insights.html')
h = re.sub(r'<tr><th scope="row">[^<]*</th>(?:(?!</tr>).)*?Pending latest figure</td></tr>', '', h, flags=re.S)
h = re.sub(r'<table class="kit-table"><caption>[^<]*</caption><thead>(?:(?!</table>).)*?</thead><tbody></tbody></table>', '', h, flags=re.S)
wr('insights.html', h)
