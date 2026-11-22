#!/usr/bin/env python3
"""Builds the campus spaces guide (site/campus-spaces.html), the training zone standard (site/campus-training-zone.html)
and their drawings (site/assets/campus/*.svg). Runs after build_campus_builds.
The drawings are our own, made here from simple shapes in our brand colours. Own words, brand neutral:
no supplier, maker or landlord names, no prices, no addresses."""
import os, html
import build_campus_bim as B
e = html.escape
SITE = B.SITE
ART = os.path.join(SITE, 'assets', 'campus')
sec, ul, table, hero, ctas, page, SAFE = B.sec, B.ul, B.table, B.hero, B.ctas, B.page, B.SAFE

BLUE, GREEN, CREAM, INK, WOOD, GREY, PALE, LINE = '#0F85DB', '#3CC261', '#F2EEE2', '#0C1A24', '#D9B98A', '#AEB8C2', '#E8F3FC', '#D5DCE3'
W, H, F, VH = 640, 400, 300, 320   # drawing size, the floor line and the visible height

# ---------------- drawing pieces (side view; x is the left edge, everything stands on the floor line) ----------------
def R(x, y, w, h, fill, rx=0, extra=''): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}"' + (f' rx="{rx}"' if rx else '') + extra + '/>'
def table_(x, w=120, h=58, top=WOOD): return R(x, F - h, w, 8, top, 3) + R(x + 8, F - h + 8, 5, h - 8, GREY) + R(x + w - 13, F - h + 8, 5, h - 8, GREY)
def high(x, w=110): return table_(x, w, 92, '#FFFFFF') + R(x, F - 92, w, 8, WOOD, 3)
def chair(x, c=BLUE): return R(x, F - 62, 6, 32, c, 3) + R(x, F - 36, 30, 7, c, 3) + R(x + 3, F - 29, 4, 29, GREY) + R(x + 23, F - 29, 4, 29, GREY)
def chair_r(x, c=BLUE): return R(x + 24, F - 62, 6, 32, c, 3) + R(x, F - 36, 30, 7, c, 3) + R(x + 3, F - 29, 4, 29, GREY) + R(x + 23, F - 29, 4, 29, GREY)
def stool(x, c=GREEN): return R(x, F - 66, 26, 7, c, 3) + R(x + 11, F - 59, 4, 55, GREY) + R(x + 3, F - 4, 20, 4, GREY, 2) + R(x + 5, F - 26, 16, 3, GREY)
def sofa(x, w=150, c=BLUE): return R(x, F - 62, w, 34, c, 10) + R(x - 6, F - 46, 18, 34, c, 8) + R(x + w - 12, F - 46, 18, 34, c, 8) + R(x + 4, F - 36, w - 8, 24, c, 6, ' opacity=".85"') + R(x + 10, F - 12, 6, 12, INK) + R(x + w - 16, F - 12, 6, 12, INK)
def arm(x, c=GREEN): return sofa(x, 60, c)
def low(x, w=46): return R(x, F - 34, w, 6, '#FFFFFF', 3, f' stroke="{LINE}"') + R(x + w / 2 - 2, F - 28, 4, 28, GREY)
def screen(x, w=150, y=120, h=None):
    h = h or round(w * .58)
    return R(x, y, w, h, INK, 6) + R(x + 8, y + 8, w - 16, h - 16, '#12324A', 3) + R(x + 16, y + 18, w * .45, 6, BLUE, 3) + R(x + 16, y + 32, w * .62, 4, '#7FB8E6', 2) + R(x + 16, y + 42, w * .5, 4, '#7FB8E6', 2) + R(x + w - 46, y + h - 40, 26, 22, GREEN, 3)
def board(x, w=170, y=110, h=110):
    notes = ''.join(R(x + 14 + (k % 4) * 36, y + 14 + (k // 4) * 34, 24, 22, c, 2) for k, c in enumerate(['#FFD86B', BLUE, GREEN, '#FFD86B', GREEN, '#FFD86B', BLUE, '#FF9E7A'][: max(4, int((w - 20) // 36) * 2)]) if 14 + (k % 4) * 36 + 24 < w)
    return R(x, y, w, h, '#FFFFFF', 4, f' stroke="{LINE}" stroke-width="2"') + notes
def shelf(x, w=150, h=190):
    out = R(x, F - h, w, h, '#FFFFFF', 3, f' stroke="{WOOD}" stroke-width="4"')
    cols = [BLUE, GREEN, CREAM, GREY, '#7FB8E6', WOOD]
    for r in range(int(h // 46)):
        y = F - h + 8 + r * 46
        out += R(x + 2, y + 38, w - 4, 4, WOOD)
        xx, k = x + 10, r
        while xx < x + w - 22:
            bw = 8 + (k * 5) % 9
            out += R(xx, y + 6 + (k * 7) % 8, bw, 32 - (k * 7) % 8, cols[k % 6], 1); xx += bw + 3; k += 1
    return out
def plant(x, s=1.0):
    return (R(x, F - 26 * s, 26 * s, 26 * s, CREAM, 4, f' stroke="{WOOD}"') +
            ''.join(f'<ellipse cx="{x + 13 * s + dx * s}" cy="{F - 26 * s - dy * s}" rx="{9 * s}" ry="{24 * s}" fill="{c}" transform="rotate({a} {x + 13 * s + dx * s} {F - 26 * s - dy * s})"/>' for dx, dy, a, c in [(-12, 22, -28, '#2FA552'), (12, 22, 28, '#2FA552'), (0, 30, 0, GREEN)]))
def pendant(x, drop=70, c='#FFFFFF'): return R(x + 19, 40, 2, drop, GREY) + f'<path d="M{x} {40 + drop + 22} Q{x + 20} {40 + drop - 14} {x + 40} {40 + drop + 22} Z" fill="{c}" stroke="{LINE}"/>' + f'<ellipse cx="{x + 20}" cy="{40 + drop + 30}" rx="34" ry="10" fill="#FFF3C4" opacity=".55"/>'
def window(x, w=180, y=70, h=170):
    trees = ''.join(f'<circle cx="{x + cx}" cy="{y + h - cy}" r="{r}" fill="{c}"/>' for cx, cy, r, c in [(w * .22, 36, 34, '#8FD9A4'), (w * .5, 28, 30, '#6CCB86'), (w * .8, 40, 38, '#8FD9A4')])
    return f'<clipPath id="w{x}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath>' + R(x, y, w, h, '#DDF0FB') + f'<g clip-path="url(#w{x})">{trees}</g>' + R(x, y, w, h, 'none', 0, f' stroke="{GREY}" stroke-width="4"') + R(x + w / 2 - 2, y, 4, h, GREY)
def glass(x, w=200, word=''):
    t = f'<text x="{x + w / 2}" y="170" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-size="26" font-weight="700" fill="{BLUE}" opacity=".9">{e(word)}</text>' if word else ''
    return R(x, 46, w, F - 46, '#CFE7F8', 0, f' opacity=".45" stroke="{GREY}" stroke-width="3"') + R(x, 150, w, 34, '#FFFFFF', 0, ' opacity=".7"') + t
def accent(x, w): return R(x, 46, w, F - 46, BLUE) + f'<path d="M{x} {F} L{x + w} {F - 120} L{x + w} {F} Z" fill="#0B6CB3"/>'
def greywall(x, w): return R(x, 46, w, F - 46, '#DDE2E7')
def booth(x, w=110):
    return R(x, F - 220, w, 220, '#FFFFFF', 8, f' stroke="{INK}" stroke-width="5"') + R(x + 10, F - 208, w - 20, 196, '#CFE7F8', 4, ' opacity=".6"') + R(x + 20, F - 96, w - 40, 6, WOOD, 3) + stool(x + w / 2 - 13, BLUE) + R(x + w / 2 - 12, F - 150, 24, 34, INK, 4)
def lockers(x, cols=5, rows=3, c=None):
    out = ''
    for i in range(cols):
        for j in range(rows):
            out += R(x + i * 44, F - (j + 1) * 64, 42, 62, (c or [BLUE, '#FFFFFF', GREEN, '#FFFFFF', CREAM])[(i + j) % 5], 3, f' stroke="{LINE}"') + R(x + i * 44 + 32, F - (j + 1) * 64 + 28, 4, 10, GREY, 2)
    return out
def counter(x, w=260, top=WOOD): return R(x, F - 74, w, 74, '#FFFFFF', 4, f' stroke="{LINE}"') + R(x - 4, F - 80, w + 8, 8, top, 3)
def machine(x): return R(x, F - 124, 40, 44, INK, 5) + R(x + 12, F - 104, 16, 14, GREY, 2) + R(x + 14, F - 88, 12, 8, '#FFFFFF', 2)
def cups(x): return ''.join(R(x + k * 14, F - 92, 10, 12, c, 2) for k, c in enumerate([BLUE, GREEN, '#FFFFFF', BLUE]))
def printer(x): return R(x, F - 96, 90, 96, '#FFFFFF', 6, f' stroke="{LINE}" stroke-width="2"') + R(x + 8, F - 110, 74, 18, GREY, 4) + R(x + 14, F - 70, 62, 8, INK, 3) + R(x + 60, F - 104, 14, 6, GREEN, 2)
def mat(x, c=GREEN): return R(x, F + 22, 120, 10, c, 5)
def daybed(x): return R(x, F - 30, 150, 14, CREAM, 6, f' stroke="{WOOD}"') + R(x, F - 44, 36, 16, BLUE, 6) + R(x + 6, F - 16, 5, 16, WOOD) + R(x + 139, F - 16, 5, 16, WOOD)
def steps(x, n=4, w=300): return ''.join(R(x + k * 34, F - (k + 1) * 30, w - k * 34, 30, WOOD if k % 2 else '#E7CFA6', 0, f' stroke="{LINE}"') + R(x + k * 34 + 40 + k * 20, F - (k + 1) * 30 - 8, 50, 8, [BLUE, GREEN][k % 2], 4) for k in range(n))
def lectern(x): return R(x, F - 96, 44, 10, WOOD, 3) + R(x + 8, F - 86, 28, 86, '#FFFFFF', 3, f' stroke="{LINE}"') + R(x + 16, F - 60, 12, 12, BLUE, 6)
def stage(x, w): return R(x, F - 16, w, 16, WOOD, 2)
def greenwall(x, w=150):
    out = R(x, 70, w, F - 110, '#2FA552', 6)
    for k in range(60): out += f'<circle cx="{x + 10 + (k * 37) % (w - 20)}" cy="{80 + (k * 53) % (F - 130)}" r="{6 + k % 5}" fill="{[GREEN, "#6CCB86", "#238A43"][k % 3]}"/>'
    return out
def divider(x, h=120): return R(x, F - h, 10, h, GREY, 5) + R(x - 12, F - 6, 34, 6, GREY, 3)
def desk(x): return table_(x, 130, 60, '#FFFFFF') + R(x, F - 60, 130, 8, WOOD, 3) + R(x + 44, F - 100, 44, 30, INK, 3) + R(x + 62, F - 70, 8, 10, GREY)
def kiosk(x): return f'<path d="M{x + 14} {F} L{x + 22} {F - 90} L{x + 50} {F - 90} L{x + 58} {F} Z" fill="#FFFFFF" stroke="{LINE}"/>' + f'<rect x="{x}" y="{F - 136}" width="72" height="46" rx="5" fill="{INK}" transform="rotate(-12 {x + 36} {F - 113})"/>' + f'<rect x="{x + 8}" y="{F - 128}" width="56" height="30" rx="3" fill="{BLUE}" transform="rotate(-12 {x + 36} {F - 113})"/>'
def honour(x, w=150):
    out = R(x, 90, w, 140, INK, 6) + f'<text x="{x + w / 2}" y="112" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">WALL OF HONOUR</text>'
    return out + ''.join(R(x + 12 + (k % 4) * ((w - 24) / 4), 124 + (k // 4) * 50, (w - 24) / 4 - 6, 40, [BLUE, GREEN, CREAM, '#7FB8E6'][k % 4], 3) for k in range(8))
def values(x):
    return ''.join(f'<text x="{x}" y="{118 + k * 30}" font-family="Montserrat,Arial,sans-serif" font-size="{s}" font-weight="{w}" fill="{c}">{t}</text>' for k, (t, s, w, c) in enumerate([('learn.', 26, 400, INK), ('earn.', 28, 700, BLUE)]))
def tablet(x): return f'<rect x="{x}" y="150" width="54" height="38" rx="5" fill="#FFFFFF" stroke="{INK}" stroke-width="3"/>' + R(x + 8, 158, 22, 4, BLUE, 2) + R(x + 8, 166, 34, 3, GREY, 1) + R(x + 8, 173, 28, 3, GREY, 1)
def carpet(x, w, c='#DCE9F4'): return R(x, F, w, H - F, c)

def scene(parts, floor='#EDEFF2', line=BLUE):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 24 {W} {VH}" width="{W}" height="{VH}">' + R(0, 0, W, H, '#FBFCFD') + R(0, 0, W, 46, '#FFFFFF') +
            R(0, 42, W, 4, line, 0, ' opacity=".85"') + R(0, 46, W, 10, line, 0, ' opacity=".12"') + R(0, F, W, H - F, floor) + ''.join(parts) + R(0, F, W, 3, LINE) + '</svg>\n')

# ---------------- the twenty spaces ----------------
# (slug, name, family, focus, mood, text, drawing parts)
SPACES = [
 ('open-studio', 'Open learning studio', 'Learn and work', 'Medium', 'Open, light, focused',
  'The main room of a campus. Learners work at their own desk or in pairs, with clear sight lines and short walks to the support spaces. A soft floor marks each work island and keeps the sound down.',
  lambda: [window(30, 200), carpet(250, 390), desk(270), chair(240), desk(440), chair_r(574, GREEN), pendant(315), pendant(485), plant(600 - 30, 1.1)]),
 ('silent-area', 'Silent area', 'Learn and work', 'High', 'Focused, calm',
  'Single desks with screens between them for deep study. No calls and no group talk. Sound-absorbing curtains, carpet and furniture keep it quiet, and the carpet is a different shade so everyone sees where the quiet starts.',
  lambda: [greywall(0, 640), carpet(0, 640, '#D7DEE6'), divider(60, 150), desk(90), chair(64), divider(250, 150), desk(280), chair(254), divider(440, 150), desk(470), chair(444), R(600, 46, 40, F - 46, '#C9D3DC')]),
 ('touch-down', 'Touch-down station', 'Learn and work', 'Low to medium', 'Open, flexible',
  'High tables with stools, next to the open studio, for a short task, a quick check with a mentor or a small team stand-up. Every station has power and a seated-height place beside it.',
  lambda: [accent(0, 120), window(380, 220), high(150, 200), stool(170), stool(230), stool(290), table_(430, 120), chair(400), pendant(190, 50), pendant(270, 50)]),
 ('project-area', 'Project area', 'Learn and work', 'Medium', 'Light, focused',
  'A room a team can keep for hours or days. One shared high table, a large screen, a writable wall and blinds to darken the room. This is where capstone projects and BIM models are built.',
  lambda: [board(40, 190), screen(270, 170, 100), high(180, 280), stool(200, BLUE), stool(270, BLUE), stool(340, BLUE), stool(410, BLUE), window(480, 140), plant(590)]),
 ('brainstorm', 'Brainstorm area', 'Learn and work', 'High', 'Light, lively',
  'Built for ideas. Walls you can write on, sticky notes, an interactive screen and furniture that moves. Teams stand more than they sit.',
  lambda: [board(30, 180, 90, 130), board(230, 180, 90, 130), screen(440, 170, 100), arm(60, GREEN), low(140), arm(210, BLUE), high(400, 150), stool(420), stool(490), pendant(455, 30)]),
 ('phone-booth', 'Call booth', 'Learn and work', 'Medium', 'Light, private',
  'A small sound-absorbing booth for one or two people, for an online class, a mentor call or an interview. Very simple inside: a shelf, a stool, a light and a socket.',
  lambda: [window(20, 180), booth(240), booth(370), booth(500), plant(190), arm(60, CREAM)]),
 ('meeting-room', 'Meeting room', 'Meet', 'Medium to high', 'Welcoming, light',
  'Where families, partners and employers are received. Good sound, a screen that connects in one step, comfortable chairs and our name in white on a grey wall.',
  lambda: [greywall(0, 260), f'<text x="130" y="170" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-size="30" font-weight="700" fill="#FFFFFF">HFL</text>', screen(300, 190, 90), table_(170, 300, 60), chair(140), chair(220, GREEN), chair_r(390, GREEN), chair_r(470), glass(520, 120), tablet(555)]),
 ('quiet-room', 'Quiet room', 'Meet', 'Medium to high', 'Light, focused, quiet',
  'A closed room for two to four people: tutoring, a confidential talk or a video conference. The door closes, the sound stays in and the desk is good for long sessions.',
  lambda: [glass(0, 150, 'quiet'), window(440, 180), table_(230, 170, 60), chair(196), chair_r(404, GREEN), screen(250, 130, 110), plant(170)]),
 ('small-quiet-room', 'Small quiet room', 'Meet', 'High', 'Calm, private',
  'A one-person room for an exam, an assessment or an hour of deep work. One desk, one chair, one lamp, nothing else.',
  lambda: [accent(520, 120), glass(0, 130, 'focus'), desk(240), chair(210), pendant(285, 60), plant(420)]),
 ('informal-meeting', 'Informal meeting area', 'Meet', 'Low to medium', 'Comfortable, light',
  'Soft seats and low tables under a timber ceiling, for a talk that was not planned. Also good for reading, a project update or a short call.',
  lambda: [R(60, 46, 520, 14, WOOD), ''.join(R(60 + k * 26, 60, 6, 10, '#C9A470') for k in range(20)), window(40, 160), sofa(230, 170), low(420), arm(480, GREEN), arm(120, GREEN), plant(580), pendant(300, 80, CREAM)]),
 ('assembly', 'Assembly area', 'Meet', 'Medium to high', 'Proud, light, focused',
  'The room where the whole campus meets: open days, graduations, talks and demo days. A low stage, a lectern, a large screen, chairs that stack and blinds that darken the room.',
  lambda: [screen(60, 240, 80), stage(40, 300), lectern(280), ''.join(chair_r(380 + k * 50, [BLUE, GREEN][k % 2]) for k in range(5)), f'<g transform="translate(0,52)">' + ''.join(chair_r(355 + k * 50, [GREEN, BLUE][k % 2]) for k in range(5)) + '</g>']),
 ('lockers', 'Lockers and coats', 'Support', 'Support', 'Light, practical',
  'Each learner has a place for a bag, a coat and a helmet, close to the studio. A bench and a mirror make it easy.',
  lambda: [lockers(40, 7, 3), R(380, F - 34, 150, 10, WOOD, 4), R(390, F - 24, 6, 24, GREY), R(514, F - 24, 6, 24, GREY), R(400, 80, 110, 150, '#DDF0FB', 6, f' stroke="{GREY}" stroke-width="3"'), plant(570)]),
 ('print-point', 'Print and make point', 'Support', 'Support', 'Tidy, practical',
  'Printer, scanner, paper and tools in one tidy place near the studio. Storage keeps cables and supplies out of sight.',
  lambda: [shelf(40, 180, 190), printer(270), counter(400, 200), R(430, F - 110, 60, 30, INK, 4), cups(520), accent(610, 30)]),
 ('lounge', 'Lounge', 'Support', 'Low', 'Open, inviting',
  'The first seat a visitor takes and the place learners gather between sessions. Soft seating lit from below, plants, art on the wall and a view outside.',
  lambda: [window(360, 250), R(40, 80, 250, 26, WOOD, 3), ''.join(plant(50 + k * 48, .9).replace(str(F), str(80)) if False else '' for k in range(0)), ''.join(f'<ellipse cx="{60 + k * 22}" cy="76" rx="6" ry="18" fill="{[GREEN, "#2FA552"][k % 2]}" transform="rotate({-20 + (k % 3) * 20} {60 + k * 22} 76)"/>' for k in range(11)),
           R(30, F - 6, 320, 10, '#FFF3C4', 5), sofa(40, 300), low(380), low(440, 40), arm(500, GREEN), plant(590, 1.2)]),
 ('library', 'Library', 'Support', 'Medium to high', 'Focused, comfortable, quiet',
  'Shelves, soft chairs and reading tables with their own power. No loud talk and no calls. The books are free to read on campus.',
  lambda: [shelf(20, 200, 230), shelf(230, 150, 230), window(420, 200), arm(300, BLUE), low(380), arm(450, GREEN), pendant(360, 90, CREAM), carpet(280, 360, '#DCE9F4')]),
 ('hallway', 'Hallway and learning steps', 'Support', 'Low', 'Open, light',
  'A hallway is not wasted space. Wide timber steps make a small auditorium, a wall of honour shows what learners have achieved and a touch screen helps visitors find their way.',
  lambda: [honour(30), steps(220, 4, 280), kiosk(540), plant(600, .9), values(520).replace('<text x="520"', '<text x="-999"')]),
 ('relaxation', 'Relaxation room', 'Support', 'Rest', 'Warm, calm',
  'A warm, quiet room for a break: yoga, stretching, meditation or ten minutes with closed eyes. Timber, soft light and a view of green.',
  lambda: [R(0, 46, 640, F - 46, '#F6EBDA'), ''.join(R(20 + k * 22, 46, 8, F - 46, '#E3C89C') for k in range(9)), window(260, 220, 80, 180), daybed(460), mat(60), mat(210, BLUE), pendant(120, 110, CREAM), plant(230, 1.1)], ),
 ('coffee-corner', 'Coffee corner and lunch area', 'Support', 'Low', 'Warm, light',
  'The social centre of the campus. Learners prepare lunch, share a table and meet people from other courses. Outside meal times the tables are used for light work.',
  lambda: [counter(30, 240), machine(60), cups(130), R(30, 90, 240, 60, '#FFFFFF', 4, f' stroke="{LINE}"'), R(150, 90, 2, 60, LINE), window(420, 200), table_(310, 230, 60), chair(290, GREEN), chair(350, GREEN), chair_r(440), chair_r(500), pendant(360, 60, GREEN), pendant(430, 60, GREEN)]),
 ('cafeteria', 'Cafeteria', 'Support', 'Low', 'Light, open, clear',
  'A clear serving line in a logical order, then long tables, tables for four and single seats. Screens that let light through give some privacy. With movable furniture the same room serves as the assembly area.',
  lambda: [counter(20, 250, '#FFFFFF'), ''.join(R(34 + k * 58, F - 96, 46, 14, c, 4) for k, c in enumerate([GREEN, '#FFD86B', '#FF9E7A', BLUE])), R(20, F - 150, 250, 6, GREY), ''.join(R(300 + k * 12, 46, 5, F - 46, WOOD) for k in range(5)), window(400, 220), table_(390, 220, 60), ''.join(chair(380 + k * 60, GREEN) for k in range(2)), ''.join(chair_r(500 + k * 56) for k in range(2)), pendant(450, 50), pendant(530, 50)]),
 ('coffee-bar', 'Coffee bar', 'Support', 'Low', 'Warm, comfortable',
  'A neutral place to meet a visitor over a good coffee. Warm light, a green wall and, to one side, a few high-focus seats for someone working alone.',
  lambda: [greenwall(30, 170), counter(40, 150), machine(60), cups(120), arm(250, CREAM), low(330), arm(390, CREAM), accent(500, 140), high(510, 120), stool(530, CREAM), stool(590, CREAM), pendant(290, 90, CREAM)]),
]
FAMILIES = [('Learn and work', 'Six spaces for study and project work, from open to silent.'), ('Meet', 'Five spaces for people to meet, from two people to the whole campus.'), ('Support', 'Nine spaces that make the day easy: storage, food, rest and welcome.')]
PRINCIPLES = [('Collaboration', 'Together we make progress', 'Open spaces let learners, mentors and visitors meet without an appointment. Good teamwork starts with people seeing each other.'),
              ('Function', 'Reduce to what matters', 'Every space has one clear purpose. Furniture is chosen because it works well and looks calm, not because it fills a room.'),
              ('Adaptability', 'Flexible but consistent', 'A set of space types fits any size of campus. The same signs, colours and furniture style make every campus feel like ours, anywhere in the world.'),
              ('Atmosphere', 'Open, light and simple', 'White walls, daylight, plants and one colour accent. Healthy, safe rooms with the best equipment we can give.')]
LOOK = ['White walls and ceilings. One wall in a room may carry grey or our blue.', 'Our blue arrives through light: a thin line at the ceiling or under a bench.', 'The name of each room is written on its glass, in one or two words.',
        'Our values are written large on one wall near the entrance.', 'A wall of honour shows learner achievements, on a screen or in frames.', 'Light timber, white and grey for furniture. No dark or black wood.',
        'Plants in every shared space.', 'Signs use one typeface and one layout on every campus.', 'Touch screens help visitors find a room, a course or a person.']
STEPS = [('Listen and plan', 'Ask learners, mentors and staff how they want to work. Collect every need before drawing anything.'),
         ('Create a space', 'Start with the floor plan. Decide which spaces are needed, which must be quiet, and keep walks to the support spaces short. Every space must be reachable step-free.'),
         ('Design and implement', 'Choose materials, furniture, light and technology. Set one colour concept, then add signs and plants.'),
         ('Evaluate and adjust', 'Ask for feedback after opening and change the plan when it helps. A new layout can bring new energy.')]

# ---------------- training zone (plan view, 1 m = 34 px) ----------------
def tz_plan():
    S, ox, oy, L, D_ = 34, 48, 56, 16, 8
    def r(x, y, w, h, fill, extra=''): return f'<rect x="{ox + x * S:.0f}" y="{oy + y * S:.0f}" width="{w * S:.0f}" height="{h * S:.0f}" fill="{fill}"{extra}/>'
    def lab(x, y, t, c=INK, s=12, a='middle', w=600): return f'<text x="{ox + x * S:.0f}" y="{oy + y * S:.0f}" text-anchor="{a}" font-family="Montserrat,Arial,sans-serif" font-size="{s}" font-weight="{w}" fill="{c}">{e(t)}</text>'
    def team(x, y, n):
        out = r(x, y, 2.0, .8, WOOD, ' rx="3"') + r(x + .98, y, .04, .8, '#C9A470')
        seats = [(x + .3, y - .55), (x + 1.3, y - .55), (x + .3, y + .9), (x + 1.3, y + .9), (x - .55, y + .2), (x + 2.15, y + .2)][:n]
        return out + ''.join(r(sx, sy, .4, .4, BLUE if k % 2 else GREEN, ' rx="6"') for k, (sx, sy) in enumerate(seats))
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400">', R(0, 0, 640, 400, '#FBFCFD'),
         r(0, 0, L, D_, '#FFFFFF', f' stroke="{INK}" stroke-width="4"'),
         r(0, -.08, L, .16, BLUE), lab(8, -.3, 'writable wall, 16 m', BLUE),
         r(-.08, 1, .16, 6, '#7FB8E6'), lab(-.35, 4.2, 'windows', INK, 11, 'middle', 500).replace('<text ', f'<text transform="rotate(-90 {ox - .35 * S:.0f} {oy + 4.2 * S:.0f})" '),
         r(0, D_ - .08, 11, .16, '#7FB8E6'), r(11, D_ - .12, 1.8, .24, '#FFFFFF', f' stroke="{INK}"'), lab(5.5, D_ + .5, 'glass wall with the room name', INK, 11, 'middle', 500), lab(11.9, D_ + .5, 'door', INK, 11, 'middle', 500),
         r(L - .5, .6, .42, 6.8, CREAM, f' stroke="{WOOD}"'), lab(L - .75, 4, 'media wall: screen, speakers, storage', INK, 11).replace('<text ', f'<text transform="rotate(-90 {ox + (L - .75) * S:.0f} {oy + 4 * S:.0f})" '),
         r(L - 1.2, 2.6, .12, 2.8, INK), r(12.4, D_ - .7, 2.5, .48, CREAM, f' stroke="{WOOD}"'), lab(13.6, D_ - .9, 'refreshments', INK, 10, 'middle', 500),
         r(9.4, .9, 5.2, 5.6, PALE, ' rx="10"'), lab(12, 1.5, 'plenary', BLUE)]
    for i in range(3):
        for j in range(4): p.append(r(10.2 + j * 1.0, 2.4 + i * 1.1, .45, .45, [BLUE, GREEN][(i + j) % 2], ' rx="6"'))
    for k, (x, y, n) in enumerate([(1.4, 1.6, 6), (5.2, 1.6, 5), (1.4, 5.0, 6), (5.2, 5.0, 5)]):
        p += [r(x - .9, y - .9, 3.8, 2.7, '#F4F7FA', f' rx="10" stroke="{LINE}"'), team(x, y, n), r(x + .3, y - .88, 1.4, .1, INK), lab(x + 1, y + 1.65, f'team {k + 1}', INK, 11)]
    p += [r(.25, 3.55, 7.8, .5, 'none'), lab(8.6, 4.3, 'tables fold and roll', INK, 10, 'middle', 500), '</svg>\n']
    return ''.join(p)

TZ_ROOM = [('Teams', 'Three to six people at one team table. Four to five tables in a room.'), ('Wall space', 'Six to eight square metres of wall for each team, for posters, templates and sticky notes.'),
           ('Tables', 'About 1.0 m by 0.8 m, foldable, on wheels. Two make one team table. No heavy fixed tables.'), ('Chairs', 'Light, with a mesh back. Half on wheels, half that stack.'),
           ('Standing', 'One high table in each break-out so a team can stand.'), ('Daylight', 'Windows, always. Blinds that darken the room for the screen.'),
           ('Plenary', 'An open area with movable chairs facing the main screen.'), ('Mood', 'Not formal. The room should invite people to move, talk and try.')]
TZ_FIT = [('Writable wall', 'One long wall, floor to ceiling, about 16 m by 2.6 m, finished so that it can be written on and wiped.', 'CS-IN'), ('Writable glass', 'White back-painted glass, about 4 m by 2.6 m, magnetic, behind the main screen.', 'CS-IN'),
          ('Glass front', 'Full-height toughened glass, 12 mm, with a double glass door and the room name on a frosted band.', 'CS-SH'), ('Ceiling', '600 by 600 mm tiles on a standard grid, so services can be reached.', 'CS-IN'),
          ('Light', 'Dimmable 600 by 600 LED panels giving 500 lux on the tables.', 'CS-SV'), ('Blinds', 'Motorised blackout blinds with one remote.', 'CS-IN'),
          ('Media wall', 'A full-height white cabinet, about 8 m long, that holds the motorised screen, the equipment and storage.', 'CS-FU'), ('Refreshment cabinet', 'A low white cabinet with a worktop, about 2.5 m long.', 'CS-FU'),
          ('Mobile cabinets', 'Five cabinets on wheels, 1.0 m wide, with a top that works as a bench for hands-on sessions.', 'CS-FU'), ('Floor', 'Carpet tiles, with spare tiles kept for repairs.', 'CS-IN'),
          ('Skirting and paint', 'White skirting and white matt paint on every other wall, floor to ceiling.', 'CS-IN')]
TZ_TECH = [('Main screen', 'A large 4K display on a stand with wheels, or a projector with a motorised screen about 2.4 m wide.'), ('Connection', 'A cable connection first, because it always works. Wireless sharing as the second way.'),
           ('Sound', 'Ceiling speakers across the room and a sound bar at the screen, loud enough for video.'), ('Team screens', 'One screen and one whiteboard or flip chart for each break-out.'),
           ('Power', 'A socket box with power and data on every table, floor boxes under the team areas and double sockets along the walls.'), ('Network', 'Wireless internet for the facilitator and every learner, and about forty wired data points.'),
           ('Cooling', 'Sized by a heat-load calculation for a full room, with the thermostat inside the room.'), ('Control', 'One simple panel for light scenes, blinds and screen.')]
TZ_SEQ = [('Design and as-built drawings', '5'), ('Approvals', '3'), ('Site set-up and strip-out', '4'), ('Ceiling grid, partitions and first-fix power and cooling', '7'), ('Boarding, filling and second fix', '7'),
          ('Glass measured, made and fitted', '10, alongside other work'), ('Joinery: media wall and cabinets', '7'), ('Paint, writable finish, carpet and skirting', '7'), ('Lights, final fix, testing', '3'), ('Snagging and hand-over', '3')]

RENDERS = [  # (number, width, height, caption, shown on public pages)
    (1, 1273, 987, 'Reception: timber-slat ceiling, the welcome wall and a waiting lounge.', True),
    (2, 1920, 1080, 'The hub: cafe tables beside the tiered steps, with the studio on the mezzanine.', True),
    (3, 1920, 1080, 'The hub seen from the booths, under long lines of light.', True),
    (4, 1920, 1080, 'Stair to the mezzanine, with lockers and comfort rooms below.', True),
    (5, 1920, 1080, 'Coffee point beside the tiered steps.', True),
    (6, 1920, 1080, 'Phone booths, the stair and the coffee point.', True),
    (7, 1920, 1080, 'Tiered steps open to the studio floor.', True),
    (8, 1920, 1080, 'Informal meeting tables in front of the tiered steps.', True),
    (9, 1920, 1080, 'Open studio under the mezzanine, with quiet rooms behind glass.', False),
    (10, 1920, 1080, 'Touch-down bar, informal meeting tables and the open studio.', False),
    (11, 1920, 1080, 'Touch-down bar with hanging plants along the wall.', False),
    (12, 1920, 1080, 'Touch-down bar under the timber ceiling.', False),
    (13, 1920, 1080, 'Library: reading chairs between open shelves.', True),
    (14, 1920, 1080, 'Library seen from the entrance wall.', True),
    (15, 1920, 1080, 'Assembly room set out for a full audience.', True)]

def render_grid(public_only=True):
    return '<ul class="render-grid">' + ''.join(
        f'<li><figure><img src="assets/campus/renders/render-{n:02d}.jpg" alt="Concept render. {e(c, quote=True)}" width="{w}" height="{h}" loading="lazy" decoding="async"><figcaption>{e(c)}</figcaption></figure></li>'
        for n, w, h, c, pub in RENDERS if pub or not public_only) + '</ul>'

def card_img(slug, alt): return f'<img class="card-art" src="assets/campus/{slug}.svg" alt="{e(alt, quote=True)}" width="{W}" height="{VH}" loading="lazy" decoding="async">'

def spaces_body():
    out = hero('every campus, one look', 'Campus spaces', 'Twenty kinds of space make a campus of ours, in three families. Each has one clear purpose, the same calm look and the same level of care, in every country.',
               ctas(('campus-training-zone.html', 'See the training zone'), ('campus-builds.html', 'Campus builds'), ('campus-standards.html', 'Campus standards')))
    out += '<section class="sec" aria-label="A view of the campus hub"><div class="wrap"><figure class="campus-fig"><img class="fig-art" src="assets/campus/renders/render-07.jpg" alt="Concept render of the campus hub: timber tiered steps, informal meeting tables and the open studio beyond." width="1920" height="1080" decoding="async"><figcaption>Concept render: the hub, where the tiered steps meet the studio floor.</figcaption></figure></div></section>\n'
    out += sec('', 's0', 'concept renders', 'How a campus of ours looks', '<p>These are concept renders of a campus interior, drawn to our standards. Each one shows spaces described further down this page.</p>' + render_grid())
    out += sec('alt', 's1', 'four ideas', 'What guides every space', '<ul class="cards">' + ''.join(f'<li class="card"><span class="tag">{e(a.lower())}</span><h3>{e(b)}</h3><p>{e(c)}</p></li>' for a, b, c in PRINCIPLES) + '</ul>')
    for k, (fam, lede) in enumerate(FAMILIES):
        cards = '<ul class="cards cards-art">' + ''.join(
            f'<li class="card" id="{s}">{card_img(s, "Drawing of the " + n.lower() + ".")}<span class="tag">focus: {e(f.lower())}</span><h3>{e(n)}</h3><p>{e(t)}</p><p><strong>Feels:</strong> {e(m.lower())}.</p></li>'
            for s, n, fm, f, m, t, _ in SPACES if fm == fam) + '</ul>'
        out += sec('' if k % 2 == 0 else 'alt', f's{k + 2}', f'family {k + 1} of 3', fam, f'<p>{e(lede)}</p>' + cards)
    out += sec('alt', 's5', 'the look', 'How you know it is our campus', f'<figure class="campus-fig">{card_img("look", "Drawing of a campus entrance: values written on a white wall, a wall of honour, a room name on glass and a blue light line.").replace("card-art", "fig-art")}</figure>' + ul([e(x) for x in LOOK]))
    out += sec('', 's6', 'four steps', 'How a campus fit-out starts', '<ol class="lux-list one">' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}</li>' for a, b in STEPS) + '</ol>')
    out += sec('alt', 's7', 'model it', 'Use these spaces in your BIM project', ul(['Pick a campus type in <a href="campus-builds.html">campus builds</a> and place these spaces in its modules.', 'Use the codes of the <a href="campus-std-elements.html">element library</a> for walls, glass, furniture and services.', 'Follow the <a href="campus-lod-plan.html">LOD stage plan</a> and keep the model in your portfolio.']) + SAFE)
    return out

def tz_body():
    return (hero('the room where people learn by doing', 'Training zone', 'One room, built the same way on every campus: team tables that move, a wall you can write on from end to end, daylight, and a screen that simply works.',
                 ctas(('campus-spaces.html', 'All campus spaces'), ('campus-builds.html', 'Campus builds'))) +
            f'<section class="sec" aria-label="Plan of the training zone"><div class="wrap"><figure class="campus-fig"><img class="fig-art" src="assets/campus/training-zone-plan.svg" alt="Plan of a training zone, 16 by 8 metres: four team break-outs with folding tables, a plenary area facing the media wall, a writable wall along one side and a glass front with a door." width="640" height="400" decoding="async"><figcaption>Reference layout, 16 m by 8 m, for 22 learners in four teams.</figcaption></figure></div></section>\n' +
            sec('alt', 't1', 'the room', 'Eight rules for the room', table('Training zone, room rules', ['Part', 'Rule'], TZ_ROOM)) +
            sec('', 't2', 'fit-out', 'What the room is made of', '<p>No maker is named. Each part is ordered by its code group from the <a href="campus-std-elements.html">element library</a>.</p>' + table('Training zone, fit-out', ['Part', 'What we ask for', 'Code group'], TZ_FIT)) +
            sec('alt', 't3', 'technology', 'Screen, sound, power and network', table('Training zone, technology', ['Part', 'What we ask for'], TZ_TECH)) +
            sec('', 't4', 'build order', 'From drawing to hand-over', '<p>A training zone inside an existing building is fitted out in about seven working weeks. Several steps run side by side.</p>' + table('Training zone, fit-out order', ['Step', 'Working days'], TZ_SEQ) + B.NOTE) +
            sec('alt', 't5', 'your task', 'Try it', '<p>Model this room at LOD 200 in the <a href="bim-academy.html">BIM academy</a>. Place the four team areas, the plenary and the media wall, then count the tables, chairs and sockets from your model and compare them with the rules above.</p>' + SAFE))

def look_svg():
    return scene([R(0, 46, 250, F - 46, '#FFFFFF'), values(40), honour(250, 160), glass(430, 210, 'studio 1'), R(30, F - 8, 200, 10, '#BFE0F7', 5), R(40, F - 40, 180, 34, BLUE, 8), plant(600, 1.0)])

PAGES = [('campus-spaces', 'Campus spaces', 'Twenty kinds of campus space in three families, each with its purpose, its feel and our own drawing.', spaces_body, ('campus-standards.html', 'Campus standards'), ('campus-training-zone.html', 'Training zone')),
         ('campus-training-zone', 'Training zone', 'The standard training room of a campus: layout, fit-out, technology and build order.', tz_body, ('campus-spaces.html', 'Campus spaces'), ('campus-builds.html', 'Campus builds'))]

def build():
    os.makedirs(ART, exist_ok=True)
    for s, _, _, _, _, _, parts in SPACES:
        open(os.path.join(ART, s + '.svg'), 'w', encoding='utf-8').write(scene(parts()))
    open(os.path.join(ART, 'look.svg'), 'w', encoding='utf-8').write(look_svg())
    open(os.path.join(ART, 'training-zone-plan.svg'), 'w', encoding='utf-8').write(tz_plan())
    for slug, title, desc, fn, prev, nxt in PAGES:
        page(slug, title, desc, fn(), ('campus-standards.html', 'Campus standards'), prev, nxt)

if __name__ == '__main__':
    build()
