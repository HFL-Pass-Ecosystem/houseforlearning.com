"""Free sub-addresses for houseforlearning.com (owner 12 Nov 2026): courses.houseforlearning.com etc., no extra domain fees.
Run: python3 tools/apply_subaddr.py  (re-run after editing SUB; it replaces the earlier router in site/index.html)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import subaddr

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')
SUB = {'courses': '/courses.html', 'catalogue': '/catalogue.html', 'academy': '/academies.html', 'mba': '/mba/', 'pathways': '/pathways.html',
       'careers': '/career-pathways.html', 'members': '/members.html', 'login': '/login.html', 'join': '/join.html', 'membership': '/membership.html',
       'workplace': '/workplace.html', 'marketplace': '/marketplace.html', 'partner': '/partner.html', 'studio': '/studio/', 'webinars': '/webinars.html',
       'sectors': '/sectors.html', 'organisations': '/organisations.html', 'support': '/support.html', 'contact': '/contact.html', 'about': '/about.html'}

if __name__ == '__main__':
    missing = [p for p in SUB.values() if not os.path.exists(os.path.join(SITE, p.strip('/') if p.endswith('.html') else p.strip('/') + '/index.html'))]
    for k in [k for k, v in SUB.items() if v in missing]:
        print('skip, page not found:', k, SUB.pop(k))
    # The site's Content-Security-Policy allows only scripts from 'self', so the router lives in its own file.
    js = subaddr.script('houseforlearning.com', SUB)
    js = js.split('<script>', 1)[1].rsplit('</script>', 1)[0]
    open(os.path.join(SITE, 'subaddr.js'), 'w', encoding='utf-8').write(js + '\n')
    ix = os.path.join(SITE, 'index.html')
    h = subaddr.inject_src(open(ix, encoding='utf-8').read(), '/subaddr.js')
    open(ix, 'w', encoding='utf-8').write(h)
    print('sub-addresses:', len(SUB))
