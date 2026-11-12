#!/usr/bin/env python3
"""Builds the campus builds (site/campus-build-*.html), climate annexes (site/campus-annex-*.html), the LOD stage plan,
the campus builder tool and the BIM project briefs. Also adds one section to career-pathways.html and pathways.html.
Data: tools/campus_builds_data.py (and the standards in tools/campus_bim_data.py). Runs after build_campus_bim.
Own words, brand neutral: no supplier, maker or landlord names, no prices, no addresses."""
import os, re, json, math, html
import build_campus_bim as B
import campus_bim_data as D
import campus_builds_data as C
e = html.escape
SITE = B.SITE
sec, ul, table, hero, ctas, page, NOTE, SAFE = B.sec, B.ul, B.table, B.hero, B.ctas, B.page, B.NOTE, B.SAFE
ELEMENT = {c: (n, g, u) for c, n, g, u in D.ELEMENTS}
DRAFT = '<p class="lux-note">Reference design v0.1. ' + e(D.NOTE) + '</p>'
HUB = ('campus-builds.html', 'Campus builds')

# ---------------- numbers for one campus type ----------------
def figures(t):
    sp = t['spaces']
    room_mods = sum(s['count'] * s['mods'] for s in sp)
    circ = int(round(room_mods * t.get('circulation', 0) / (1 - t.get('circulation', 0)))) if t.get('circulation') else 0
    mods = room_mods + circ
    floors = t['floors']
    wet = sum(s['count'] * s['mods'] for s in sp if s['wet'])
    rooms = sum(s['count'] * s['rooms'] for s in sp)
    learners = sum(s['count'] * s['seats'] for s in sp if s['learn'])
    people = sum(s['count'] * s['seats'] for s in sp)
    studios = sum(s['count'] for s in sp if s['name'] == 'Open learning studio')
    glass_rooms = sum(s['count'] for s in sp if s['group'] == 'Learn' and s['mods'] >= 2)
    assembly = sum(s['count'] for s in sp if s['name'] == 'Assembly room')
    x = t['extras']
    q = [('CS-SH-01', mods), ('CS-SH-02', x['terrace']), ('CS-SH-03', x['straight_stair']), ('CS-SH-04', x['wide_stair']),
         ('CS-SH-05', round(glass_rooms * C.GLASS_M2_PER_STUDIO, 1)), ('CS-SH-06', glass_rooms), ('CS-SH-08', x['ramp']), ('CS-SH-09', x['lift']),
         ('CS-IN-03', (studios + assembly // 2) * C.FOLD_M2), ('CS-IN-05', (mods - wet) * C.MODULE_M2), ('CS-IN-06', wet * C.MODULE_M2), ('CS-IN-07', x.get('exits', 0)),
         ('CS-FU-01', x['desks']), ('CS-FU-02', x['tables']), ('CS-FU-03', x['booths']), ('CS-FU-04', x['pods']), ('CS-FU-05', x['shelves']), ('CS-FU-06', learners),
         ('CS-SV-01', max(floors, math.ceil(mods / 24))), ('CS-SV-02', rooms), ('CS-SV-03', rooms + floors), ('CS-SV-04', x['comms']),
         ('CS-SV-05', round(mods / floors * C.SOLAR_KW_PER_ROOF_MODULE)), ('CS-SV-06', rooms + 2 * floors)]
    q = [(c, v) for c, v in q if v]
    for c, _ in q: assert c in ELEMENT, c
    return dict(mods=mods, circ=circ, floors=floors, area=mods * C.MODULE_M2, rooms=rooms, learners=learners, people=people, q=q)
FIG = {t['code']: figures(t) for t in C.TYPES}
def num(v): return f'{v:,}'.replace(',', ' ') if isinstance(v, int) else str(v)

def build_body(t):
    f = FIG[t['code']]
    facts = '<ul class="lux-list">' + ''.join(f'<li><strong>{e(k)}:</strong> {e(v)}</li>' for k, v in [
        ('Tier', t['tier']), ('Modules', num(f['mods'])), ('Floors', str(f['floors'])), ('Floor area', f'about {num(f["area"])} m2'),
        ('Learners at one time', num(f['learners'])), ('Rooms', num(f['rooms']))]) + '</ul>'
    rows = [(s['name'], s['group'], num(s['count']), num(s['count'] * s['mods']), num(s['count'] * s['seats']) if s['seats'] else '-') for s in t['spaces']]
    if f['circ']: rows.append(('Corridors, stairs and lobbies', 'Support', '-', num(f['circ']), '-'))
    rows.append(('Total', '', '', num(f['mods']), num(f['people'])))
    qrows = [(c, ELEMENT[c][0], num(v), ELEMENT[c][2]) for c, v in f['q']]
    names = ul([f'<code>C01-B1-L{k}-{d}</code>: {e(w)}' for k, d, w in [(1, 'ARC', 'architecture model, floor 1'), (1, 'STR', 'structure model, floor 1'), (1, 'MEP', 'services model, floor 1')] +
                ([(2, 'ARC', 'architecture model, floor 2')] if f['floors'] > 1 else [])] + ['Replace C01 with the number of the real campus. The element code follows when a file holds one element type, for example <code>C01-B1-L1-ARC-CS-SH-05</code> for the glass wall.'])
    brief = [b for b in C.BRIEFS if b['build'] == t['code']]
    learn = ''.join(f'<p><strong>{e(b["level"])}.</strong> {e(b["task"])} <a class="more" href="{b["lslug"]}.html">Open {e(b["level"])}</a></p>' for b in brief) or '<p>This type is used in the campus builder tool.</p>'
    return (hero(f'campus build · {t["code"]} · {t["tier"].lower()} tier', t['name'], t['lede'], ctas(('campus-builder.html', 'Try the campus builder'), ('campus-lod-plan.html', 'LOD stage plan'))) +
            sec('', 'g1', 'at a glance', 'Size and capacity', facts + f'<p><strong>Used for.</strong> {e(t["use"])}</p>') +
            sec('alt', 'g2', 'space schedule', 'Spaces, modules and seats', table(f'Space schedule, {t["name"]}', ['Space', 'Group', 'Count', 'Modules', 'Seats'], rows) + ul([e(n) for n in t['notes']])) +
            sec('', 'g3', 'element list', 'Coded elements and quantities', '<p>Every line uses a code from the <a href="campus-std-elements.html">element library</a>. No maker is named. Quantities are worked out from the space schedule by the rules of the standard.</p>' +
                table(f'Element list, {t["name"]}', ['Code', 'Element', 'Quantity', 'Unit'], qrows) + DRAFT) +
            sec('alt', 'g4', 'build order', 'How it is put together', '<ol class="lux-list one">' + ''.join(f'<li>{e(s)}</li>' for s in t['sequence']) + '</ol>') +
            sec('', 'g5', 'model files', 'File names for this build', names) +
            sec('alt', 'g6', 'learn with this build', 'Your project on this campus type', learn + ctas(('bim-projects.html', 'All project briefs'), ('campus-annex-hot-dry.html', 'Climate annexes'))) +
            downloads_sec(t))

def annex_body(a):
    return (hero(a['kick'], f'{a["name"]} climate annex', a['lede'], ctas(('campus-builds.html', 'Campus builds'), ('campus-builder.html', 'Campus builder tool'))) +
            sec('', 'x1', 'what changes', 'Six changes for this climate', table(f'{a["name"]} annex', ['Part', 'What changes'], a['rows']) + NOTE) +
            sec('alt', 'x2', 'what never changes', 'The core stays the same', ul([e(x) for x in C.ANNEX_FIXED])) +
            sec('', 'x3', 'three checks', 'Check the model for this climate', ul([e(x) for x in a['checks']])) +
            sec('alt', 'x4', 'your task', 'Try it', f'<p>{e(a["task"])}</p>' + SAFE))

def lod_body():
    stage = table('LOD stage plan', ['Stage', 'Level', 'Decision it supports', 'What the team delivers', 'Who signs'], C.STAGES)
    matrix = table('Level of development by element group and stage', C.LOD_MATRIX_HEAD, C.LOD_MATRIX)
    sheet = '<ol class="lux-list one">' + ''.join(f'<li>{e(x)}</li>' for x in C.CHECK_SHEET) + '</ol>'
    return (hero('one plan for every campus', 'LOD stage plan', 'Seven stages take a campus from a brief to a building in use. Each stage names the level of development the model must reach, and the decision that level supports.',
                 ctas(('campus-std-bim.html', 'BIM and LOD rules'), ('campus-builds.html', 'Campus builds'))) +
            sec('', 'p1', 'seven stages', 'From brief to hand-over', stage) +
            sec('alt', 'p2', 'who models what, when', 'Level by element group', matrix + ul([e(x) for x in C.LOD_NOTES])) +
            sec('', 'p3', 'ten checks', 'The check sheet', '<p>Use this sheet at the end of every stage. It is the same for a mobile unit and a flagship.</p>' + sheet + SAFE))

def builder_body():
    opts = ''.join(f'<option value="{a["slug"]}">{e(a["name"])}</option>' for a in C.ANNEX)
    form = ('<div class="tt-grid"><div class="field"><label for="cb-n">Learners at one time</label><input id="cb-n" type="number" min="1" max="5000" value="30" inputmode="numeric"></div>'
            '<div class="field"><label for="cb-wc">Washrooms</label><select id="cb-wc"><option value="own">The campus has its own</option><option value="host">Use the host site</option></select></div>'
            f'<div class="field"><label for="cb-cl">Climate</label><select id="cb-cl">{opts}</select></div>'
            '<div class="field"><label for="cb-id">Campus number</label><input id="cb-id" type="text" maxlength="3" value="C01" pattern="C[0-9]{2}"></div></div>'
            '<p><button class="btn" type="button" id="cb-go">Work it out</button> <button class="btn btn-ghost" type="button" id="cb-copy">Copy the list</button></p>'
            '<p id="cb-note" role="status" aria-live="polite"></p>')
    out = '<div id="cb-out"><p>Enter the number of learners and press the button.</p></div><noscript><p>The tool needs JavaScript. You can still read every campus type on the campus builds page.</p></noscript>'
    return (hero('try it yourself', 'Campus builder', 'Type how many learners you must teach at one time. The tool picks the campus type from our standard and gives you the modules, the coded element list and the steps to model it.',
                 ctas(('campus-builds.html', 'See all campus types'), ('bim-academy.html', 'Learn to model it'))) +
            sec('', 'w1', 'your campus', 'Four questions', form) +
            sec('alt', 'w2', 'result', 'Your campus, to our standard', out) +
            sec('', 'w3', 'what next', 'Turn the list into a model', ul(['Open the campus type the tool chose and read its space schedule.', 'Follow the <a href="campus-lod-plan.html">LOD stage plan</a>, one stage at a time.', 'Model it in the <a href="bim-academy.html">BIM academy</a> at your level, and keep it in your portfolio.']) + DRAFT + SAFE))

def projects_body():
    by = {t['code']: t for t in C.TYPES}
    cards = ''.join(
        f'<details class="lux-panel"{" open" if i == 0 else ""}><summary>{e(b["level"])}: {e(b["title"])}</summary>'
        f'<p><strong>Task.</strong> {e(b["task"])}</p><p><strong>You hand in.</strong></p>' + ul([e(x) for x in b['deliver']]) +
        f'<p><strong>Level of development.</strong> {e(b["lod"])}</p><p><strong>Portfolio.</strong> {e(b["portfolio"])}</p><p><strong>Paid work this opens.</strong> {e(b["gig"])}</p>'
        f'<p><a class="more" href="{by[b["build"]]["slug"]}.html">Campus type: {e(by[b["build"]]["name"])}</a> &nbsp; <a class="more" href="{b["lslug"]}.html">Lessons: {e(b["level"])}</a></p></details>'
        for i, b in enumerate(C.BRIEFS))
    return (hero('learn by building', 'BIM project briefs', 'Seven projects, one for each level of the BIM academy. Each one is a real campus type from our standard, so what you learn is what a design team does.',
                 ctas(('bim-l1.html', 'Start at level 1'), ('campus-builder.html', 'Campus builder tool'), ('bim-career-pathways.html', 'Career pathways'))) +
            sec('', 'j1', 'seven briefs', 'One project per level', cards) +
            sec('alt', 'j2', 'check your work', 'The same check sheet as the professionals', '<p>Every project is checked with the ten-point sheet in the <a href="campus-lod-plan.html">LOD stage plan</a>. A mentor signs it when no item is open.</p>') +
            sec('', 'j3', 'anywhere in the world', 'Use the method on any building', ul([e(x) for x in C.WORLD]) + SAFE))

def hub_body():
    tcards = '<ul class="cards">' + ''.join(
        f'<li class="card"><span class="tag">{e(t["code"])} · {e(t["tier"].lower())}</span><h3>{e(t["name"])}</h3><p>{num(FIG[t["code"]]["mods"])} modules, {num(FIG[t["code"]]["learners"])} learners at one time, about {num(FIG[t["code"]]["area"])} m2.</p><p>{e(t["use"])}</p><a class="more" href="{t["slug"]}.html">Open {e(t["name"])}</a></li>' for t in C.TYPES) + '</ul>'
    acards = '<ul class="cards">' + ''.join(f'<li class="card"><span class="tag">{e(a["kick"])}</span><h3>{e(a["name"])}</h3><p>{e(a["lede"])}</p><a class="more" href="{a["slug"]}.html">Open the {e(a["name"].lower())} annex</a></li>' for a in C.ANNEX) + '</ul>'
    comp = table('Campus types side by side', ['Type', 'Tier', 'Modules', 'Floors', 'Area (m2)', 'Learners at one time'],
                 [(f'{t["code"]} {t["name"]}', t['tier'], num(FIG[t['code']]['mods']), str(t['floors']), num(FIG[t['code']]['area']), num(FIG[t['code']]['learners'])) for t in C.TYPES])
    return (hero('every campus, one standard', 'Campus builds', 'Six campus types, from a single mobile unit to a full flagship. Each is worked out from our own campus standards: spaces, seats, modules and a coded element list.',
                 ctas(('campus-builder.html', 'Try the campus builder'), ('campus-standards.html', 'Campus standards'), ('bim-projects.html', 'BIM project briefs'))) +
            sec('', 'u1', 'six types', 'From one module to a flagship', tcards + comp + DRAFT) +
            sec('alt', 'u2', 'how a real campus is made', 'Type, climate annex, campus number', ul(['Pick the <strong>campus type</strong> that fits the number of learners.', 'Add the <strong>climate annex</strong> for the site.', 'Give the campus its <strong>number</strong> (C01, C02 and so on), which starts every file name.', 'Follow the <strong>LOD stage plan</strong> from brief to hand-over.', 'A local annex covers local rules. Where a local rule is stricter than ours, the local rule wins.'])) +
            sec('', 'u3', 'four climates', 'Climate annexes', acards) +
            sec('alt', 'u4', 'model it', 'Plan, tool and projects', '<ul class="cards">'
                '<li class="card"><span class="tag">plan</span><h3>LOD stage plan</h3><p>Seven stages, the level each needs, and a ten-point check sheet.</p><a class="more" href="campus-lod-plan.html">Open the plan</a></li>'
                '<li class="card"><span class="tag">tool</span><h3>Campus builder</h3><p>Type a learner number and get the campus type and its element list.</p><a class="more" href="campus-builder.html">Open the tool</a></li>'
                '<li class="card"><span class="tag">projects</span><h3>BIM project briefs</h3><p>One project for each level, L1 to L7, on these campus types.</p><a class="more" href="bim-projects.html">Open the briefs</a></li></ul>' + SAFE))

# ---------------- practice models (open IFC4 text, no outside library) and element lists (CSV) ----------------
DL = os.path.join(SITE, 'downloads', 'campus')
MX, MY, MZ = 2.4, 5.8, 2.9          # module width, length, height in metres
PER_ROW = 12
def _guid(key):
    import hashlib
    n = int(hashlib.sha1(key.encode()).hexdigest()[:32], 16)
    abc = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$'
    out = ''
    for _ in range(22):
        out = abc[n % 64] + out; n //= 64
    return abc[int(out[0] in abc) and (abc.index(out[0]) % 4)] + out[1:]
def _f(v): return ('%.3f' % v).rstrip('0').rstrip('.') + ('.' if '.' not in ('%.3f' % v).rstrip('0').rstrip('.') else '')
def module_plan(t):
    """One row per module: (floor, x, y, space name). Spaces fill floor 1 first, then floor 2."""
    f = FIG[t['code']]
    labels = []
    for s in t['spaces']:
        labels += [s['name']] * (s['count'] * s['mods'])
    labels += ['Corridors, stairs and lobbies'] * f['circ']
    per = math.ceil(len(labels) / f['floors'])
    plan = []
    for i, lab in enumerate(labels):
        fl, k = divmod(i, per)
        row, col = divmod(k, PER_ROW)
        plan.append((fl + 1, col * MX, row * (MY + MX), lab))
    return plan
def ifc_text(t):
    L = []; n = [0]
    def add(txt):
        n[0] += 1; L.append(f'#{n[0]}={txt};'); return f'#{n[0]}'
    code = t['code']; g = lambda k: "'" + _guid(code + ':' + k) + "'"
    q = lambda s: "'" + s.replace("'", "''") + "'"
    o = add('IFCCARTESIANPOINT((0.,0.,0.))'); dz = add('IFCDIRECTION((0.,0.,1.))'); dx = add('IFCDIRECTION((1.,0.,0.))')
    ax = add(f'IFCAXIS2PLACEMENT3D({o},{dz},{dx})')
    ctx = add(f"IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,{ax},$)")
    body = add(f"IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,{ctx},$,.MODEL_VIEW.,$)")
    u1 = add('IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)'); u2 = add('IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.)'); u3 = add('IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.)')
    units = add(f'IFCUNITASSIGNMENT(({u1},{u2},{u3}))')
    proj = add(f"IFCPROJECT({g('project')},$,{q('HFL campus practice model ' + code)},{q(t['name'] + ', LOD 200, for learning only')},$,$,$,({ctx}),{units})")
    p0 = add(f'IFCLOCALPLACEMENT($,{ax})')
    site = add(f"IFCSITE({g('site')},$,'C01',$,$,{p0},$,$,.ELEMENT.,$,$,$,$,$)")
    p1 = add(f'IFCLOCALPLACEMENT({p0},{ax})')
    bld = add(f"IFCBUILDING({g('building')},$,'C01-B1',$,$,{p1},$,$,.ELEMENT.,$,$,$)")
    add(f"IFCRELAGGREGATES({g('rel-site')},$,$,$,{proj},({site}))"); add(f"IFCRELAGGREGATES({g('rel-bld')},$,$,$,{site},({bld}))")
    # one shared box shape for every module
    c2 = add(f'IFCCARTESIANPOINT(({_f(MX / 2)},{_f(MY / 2)}))'); d2 = add('IFCDIRECTION((1.,0.))'); a2 = add(f'IFCAXIS2PLACEMENT2D({c2},{d2})')
    prof = add(f"IFCRECTANGLEPROFILEDEF(.AREA.,'CS-SH-01',{a2},{_f(MX)},{_f(MY)})")
    solid = add(f'IFCEXTRUDEDAREASOLID({prof},{ax},{dz},{_f(MZ)})')
    rep = add(f"IFCSHAPEREPRESENTATION({body},'Body','SweptSolid',({solid}))")
    plan = module_plan(t); storeys = []
    for fl in range(1, t['floors'] + 1):
        zp = add(f'IFCCARTESIANPOINT((0.,0.,{_f((fl - 1) * MZ)}))'); za = add(f'IFCAXIS2PLACEMENT3D({zp},{dz},{dx})'); pl = add(f'IFCLOCALPLACEMENT({p1},{za})')
        st = add(f"IFCBUILDINGSTOREY({g('storey%d' % fl)},$,'L{fl}',$,$,{pl},$,$,.ELEMENT.,{_f((fl - 1) * MZ)})")
        storeys.append(st); els = []
        for i, (f2, x, y, lab) in enumerate([m for m in plan if m[0] == fl], 1):
            pt = add(f'IFCCARTESIANPOINT(({_f(x)},{_f(y)},0.))'); pa = add(f'IFCAXIS2PLACEMENT3D({pt},{dz},{dx})'); pp = add(f'IFCLOCALPLACEMENT({pl},{pa})')
            pds = add(f'IFCPRODUCTDEFINITIONSHAPE($,$,({rep}))')
            key = f'L{fl}-M{i:03d}'
            el = add(f"IFCBUILDINGELEMENTPROXY({g(key)},$,{q('C01-B1-L%d-ARC-CS-SH-01-%03d' % (fl, i))},{q('Module shell, 2.4 x 5.8 x 2.9 m')},{q(lab)},{pp},{pds},{q(key)},.NOTDEFINED.)")
            v = [add(f"IFCPROPERTYSINGLEVALUE('ElementCode',$,IFCLABEL('CS-SH-01'),$)"), add("IFCPROPERTYSINGLEVALUE('LevelOfDevelopment',$,IFCLABEL('LOD 200'),$)"),
                 add(f"IFCPROPERTYSINGLEVALUE('Space',$,IFCLABEL({q(lab)}),$)"), add(f"IFCPROPERTYSINGLEVALUE('CampusType',$,IFCLABEL({q(code + ' ' + t['name'])}),$)")]
            ps = add(f"IFCPROPERTYSET({g(key + ':pset')},$,'HFL_CampusStandard',$,({','.join(v)}))")
            add(f"IFCRELDEFINESBYPROPERTIES({g(key + ':rel')},$,$,$,({el}),{ps})")
            els.append(el)
        add(f"IFCRELCONTAINEDINSPATIALSTRUCTURE({g('contain%d' % fl)},$,$,$,({','.join(els)}),{st})")
    add(f"IFCRELAGGREGATES({g('rel-storeys')},$,$,$,{bld},({','.join(storeys)}))")
    head = ("ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');\n"
            f"FILE_NAME('hfl-campus-{code.lower()}-lod200.ifc','2026-11-11T00:00:00',(''),('House for Learning'),'tools/build_campus_builds.py','HFL campus standards','');\n"
            "FILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n")
    return head + '\n'.join(L) + '\nENDSEC;\nEND-ISO-10303-21;\n'
def build_downloads():
    os.makedirs(DL, exist_ok=True)
    for t in C.TYPES:
        low = t['code'].lower()
        open(os.path.join(DL, f'hfl-campus-{low}-lod200.ifc'), 'w', encoding='utf-8', newline='\n').write(ifc_text(t))
        rows = ['Code,Element,Quantity,Unit'] + [f'{c},"{ELEMENT[c][0]}",{v},{ELEMENT[c][2]}' for c, v in FIG[t['code']]['q']]
        open(os.path.join(DL, f'hfl-campus-{low}-elements.csv'), 'w', encoding='utf-8', newline='\n').write('\n'.join(rows) + '\n')
def downloads_sec(t):
    low = t['code'].lower(); f = FIG[t['code']]
    return sec('', 'g7', 'practice files', 'Download and open the model',
               f'<p>A practice model of this campus type in an open format (IFC), at LOD 200. It holds {num(f["mods"])} module shells on {t["floors"]} floor{"s" if t["floors"] > 1 else ""}. Each shell carries its element code, its level of development and the space it belongs to. Doors, walls and furniture are left for you to add.</p>'
               + ul([f'<a href="downloads/campus/hfl-campus-{low}-lod200.ifc" download>Practice model, {e(t["name"])} (IFC file)</a>',
                     f'<a href="downloads/campus/hfl-campus-{low}-elements.csv" download>Element list, {e(t["name"])} (CSV file, opens in any spreadsheet)</a>',
                     'Open the model in any free viewer that reads open IFC files. Click one module and read its properties: you will see the code CS-SH-01 and LOD 200.'])
               + '<p class="lux-note">For learning only. Not a drawing for building.</p>')

# ---------------- write pages ----------------
PAGES = ([('campus-builds', 'Campus builds', 'Six campus types built to our own campus standards, with spaces, seats, modules and coded element lists.', hub_body, HUB)] +
         [(t['slug'], f'{t["name"]} ({t["code"]}) campus build', t['lede'], (lambda t=t: build_body(t)), HUB) for t in C.TYPES] +
         [(a['slug'], f'{a["name"]} climate annex', a['lede'], (lambda a=a: annex_body(a)), HUB) for a in C.ANNEX] +
         [('campus-lod-plan', 'LOD stage plan', 'Seven stages from brief to hand-over, the level of development each needs, and a ten-point check sheet.', lod_body, HUB),
          ('campus-builder', 'Campus builder', 'Type a learner number and get the campus type, modules and coded element list from our campus standards.', builder_body, HUB),
          ('bim-projects', 'BIM project briefs', 'Seven BIM projects, one per level, each on a real campus type from our standards.', projects_body, ('bim-academy.html', 'BIM academy'))])

def build_pages():
    chain = [('campus-standards.html', 'Campus standards')] + [(s + '.html', t) for s, t, _, _, _ in PAGES] + [('bim-academy.html', 'BIM academy')]
    for k, (slug, title, desc, fn, root) in enumerate(PAGES):
        page(slug, title, desc, fn(), root, chain[k], chain[k + 2])
    p = os.path.join(SITE, 'campus-builder.html')
    s = open(p, encoding='utf-8').read()
    tag = '<script src="assets/lang.js" defer></script>'
    assert tag in s
    s = s.replace(tag, tag + '\n<script src="assets/campus-builder-data.js" defer></script>\n<script src="assets/campus-builder.js" defer></script>', 1)
    open(p, 'w', encoding='utf-8').write(s)

def build_data_js():
    data = dict(
        types=[dict(code=t['code'], name=t['name'], tier=t['tier'], slug=t['slug'], floors=t['floors'], mods=FIG[t['code']]['mods'], area=FIG[t['code']]['area'],
                    learners=FIG[t['code']]['learners'], rooms=FIG[t['code']]['rooms'],
                    q=[[c, ELEMENT[c][0], v, ELEMENT[c][2]] for c, v in FIG[t['code']]['q']]) for t in C.TYPES],
        annex=[dict(slug=a['slug'], name=a['name'], checks=a['checks']) for a in C.ANNEX],
        stages=[[s[0], s[1], s[3]] for s in C.STAGES])
    open(os.path.join(SITE, 'assets', 'campus-builder-data.js'), 'w', encoding='utf-8').write(
        '/* Generated by tools/build_campus_builds.py. Do not edit by hand. */\nwindow.HFL_CAMPUS = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')

# ---------------- one section on the two pathway pages ----------------
MARK_A, MARK_B = '<!-- bim-path:start -->', '<!-- bim-path:end -->'
def path_section(alt):
    cards = ('<ul class="cards">'
             '<li class="card"><span class="tag">course pathway</span><h3>BIM academy, L1 to L7</h3><p>Learn to model, coordinate and hand over buildings to our own campus standards.</p><a class="more" href="bim-academy.html">Open the BIM academy</a></li>'
             '<li class="card"><span class="tag">projects</span><h3>Seven project briefs</h3><p>One project per level on a real campus type, from a mobile unit to a flagship.</p><a class="more" href="bim-projects.html">Open the briefs</a></li>'
             '<li class="card"><span class="tag">career pathway</span><h3>From modeller to head of standards</h3><p>Six career steps, the portfolio you build, and paid work around the world.</p><a class="more" href="bim-career-pathways.html">Open BIM careers</a></li>'
             '<li class="card"><span class="tag">try it</span><h3>Campus builder</h3><p>Type a learner number and see the campus our standard gives you.</p><a class="more" href="campus-builder.html">Open the tool</a></li></ul>')
    return (MARK_A + f'<section class="sec{" alt" if alt else ""}" aria-labelledby="bim-path-h"><div class="wrap"><div class="sec-head"><p class="kicker">built environment</p><h2 id="bim-path-h">Design campuses with BIM and LOD</h2></div>'
            '<div class="sec-body"><p>A full pathway from first lesson to a global career. You learn on our own campus designs, where every part has a code and no maker is named.</p>' + cards + '</div></div></section>\n' + MARK_B)
def patch_pathway_pages():
    for name, alt in (('career-pathways.html', True), ('pathways.html', False)):
        p = os.path.join(SITE, name)
        s = open(p, encoding='utf-8').read()
        s = re.sub(re.escape(MARK_A) + r'.*?' + re.escape(MARK_B) + r'\n?', '', s, flags=re.S)
        i = s.rfind('</main>')
        assert i > 0, name
        s = s[:i] + path_section(alt) + '\n' + s[i:]
        open(p, 'w', encoding='utf-8').write(s)

if __name__ == '__main__':
    build_pages(); build_data_js(); build_downloads(); patch_pathway_pages()
    print(len(PAGES), 'pages;', ', '.join(f'{c} {f["mods"]} modules {f["learners"]} learners' for c, f in FIG.items()))
