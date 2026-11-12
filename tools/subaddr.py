"""Free sub-addresses (owner 12 Nov 2026): instead of buying more domains, every section of a site answers on
<label>.<own-domain>, e.g. switchgear.yantra-global.com. One wildcard custom domain (*.<domain>) on the host and one
wildcard DNS record cover them all. A tiny script in the home page's <head> sends a visitor who opens <label>.<domain>/
to that section. Unknown labels stay on the home page. Standard library only; the same file is used on every site."""
import json, re

MARK = '<!-- sub-address router -->'


def script(base, mapping):
    m = json.dumps(mapping, separators=(',', ':'))
    return (MARK + '<script>(function(){var b=' + json.dumps(base) + ',m=' + m + ',h=location.hostname.toLowerCase(),p=location.pathname;'
            'if(h.slice(-b.length-1)!=="."+b||(p!=="/"&&p!=="/index.html"))return;var l=h.slice(0,-b.length-1);'
            'if(l==="www")return;if(m[l])location.replace(m[l]+location.search+location.hash);})();</script>' + MARK)


def inject(html, base, mapping):
    """Put the router straight after <meta charset>, replacing any earlier copy."""
    html = re.sub(re.escape(MARK) + '.*?' + re.escape(MARK), '', html, flags=re.S)
    return re.sub(r'(<meta charset="?utf-8"?\s*/?>)', lambda x: x.group(1) + script(base, mapping), html, count=1, flags=re.I)


def inject_src(html, src):
    """Same as inject, but loads the router from a file (for sites whose Content-Security-Policy forbids inline scripts)."""
    html = re.sub(re.escape(MARK) + '.*?' + re.escape(MARK), '', html, flags=re.S)
    tag = MARK + '<script src="' + src + '"></script>' + MARK
    return re.sub(r'(<meta charset="?utf-8"?\s*/?>)', lambda x: x.group(1) + tag, html, count=1, flags=re.I)
