#!/usr/bin/env python3
"""Audit every course page (site/learn-*.html, Russia left out) for the flagship standard.
Checks per page: Bloom verbs, task/condition/standard, 8 modules, 8 worked examples, rubric,
10 checks with answers, L1-L7 ladder (slides = 7 slides with notes, table = levels only, none), job links.
Run from the repo root:  python3 tools/audit_course_pages.py [report.md]
Prints a per-family summary and writes a one-line-per-page gap list (default audits/course-page-audit.md).
Word and count checks only. Hub pages and pointer pages ("Full course here" box) are skipped. Exit code 0 always."""
import os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
os.chdir(os.path.join(ROOT, 'site'))
REPORT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, 'audits', 'course-page-audit.md')
import re,glob,html,collections,json
def clean(s):
    s=re.sub(r'<(script|style)[^>]*>.*?</\1>','',s,flags=re.S); return s
def txt(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s)))
def audit(f):
    raw=clean(open(f,encoding='utf-8').read()); t=txt(raw); low=t.lower(); r={}
    r['bloom']=len(re.findall(r'\b(Understand|Apply|Analyse|Evaluate|Create|Remember)\b',t))>=8
    r['task_cond_std']=all(re.search(r'\b'+k+r'\b',t) for k in ('Task','Condition','Standard'))
    r['8_modules']=len(set(re.findall(r'Module (\d+)',t)))>=8
    r['worked_example_each']=len(re.findall(r'Worked example',t))>=8
    r['rubric']='rubric' in low or ('not yet' in low and 'exceeds' in low)
    r['10_checks']=len(set(re.findall(r'\bQ(\d+)\.',t)))>=10 and t.count('Model answer')>=10
    secs=re.split(r'(?=<h2)',raw); lad=''.join(txt(x) for x in secs if re.search(r'<h2[^>]*>[^<]*(adder|L1 to L7|levels)',x,re.I)) or t
    lv=len(set(re.findall(r'\bL([1-7])\b',lad)))
    slides=len(set(re.findall(r'Slide (\d)',lad)))
    r['ladder']='slides' if slides==7 and lv==7 else ('table' if lv==7 else 'none')
    r['jobs']=bool(re.search(r'jobs this leads to|where this takes you',low))
    return r
rows={}
for f in sorted(glob.glob('learn-*.html')):
    if re.search(r'russia|-ru[-.]',f): continue
    if f.endswith('-hub.html') or f in ('learn-shelves.html','learn-flagship-in.html') or 'id="fc">Full course here' in open(f,encoding='utf-8').read(): continue  # hub and pointer pages are skipped
    rows[f]=audit(f)
fam=collections.defaultdict(list)
for f,r in rows.items():
    m=re.match(r'learn-([a-z0-9]+)-?([a-z0-9]*)',f); k=m.group(1)+('-'+m.group(2) if m.group(1) in('flagship','loc','deep') and not m.group(2).isdigit() else '')
    fam[k].append((f,r))
out=[];print('family pages | missing counts | ladder: slides/table/none')
for k,v in sorted(fam.items(),key=lambda x:-len(x[1])):
    cnt=collections.Counter(); lad=collections.Counter(r['ladder'] for f,r in v)
    for f,r in v:
        for kk,val in r.items():
            if kk!='ladder' and not val: cnt[kk]+=1
    print(k,len(v),dict(cnt),dict(lad))
bad=[]
for f,r in rows.items():
    miss=[k for k,v in r.items() if (k!='ladder' and not v)]
    if r['ladder']!='slides': miss.append('ladder:'+r['ladder'])
    if miss: bad.append((f,miss))
os.makedirs(os.path.dirname(REPORT), exist_ok=True)
with open(REPORT,'w') as o:
    o.write('# Course page audit\n\nChecks per page: Bloom verbs, task/condition/standard, 8 modules, 8 worked examples, rubric, 10 checks with answers, ladder (slides = 7 slides with notes; table = L1-L7 as a table only; none), job links. Russia pages left out.\n\n')
    for f,m in bad: o.write(f'- {f}: {", ".join(m)}\n')
print(len(rows),'pages;',len(bad),'with something missing')
