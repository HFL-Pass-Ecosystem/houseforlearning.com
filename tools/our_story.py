"""Our story box for the About page (test only, draft for the owner).
our_story(site) returns one click-to-expand box (native <details>, no script). CSS is the constant CSS.
site is one of: ahfl, hfl, hflpass, yantra. AHFL and HFL keep 'the HFL Way'; the other two say 'the family way'.
Only AHFL names the group sizes; the other sites leave that out so no page shows the sites are connected.
Father's letter: draft dated 5 Nov 2026, NOT signed yet. Do not publish until Mr. VR Raghavendra and Mrs. Meera R sign."""
from html import escape as E

TRIBUTE = [
 "Every great journey begins with one person who touches, moves and inspires lives to improve. For me there are two men and a few women.",
 "My grandfather, Mr. V.S. Ramacharya, chief architect of the Indian Institute of Science, who also built highways through some of the hardest sections of India. My great-grandfather, who served the Wadayar dynasty as teacher and adviser. My father, a fine sportsman and an even finer human being. My mother, my sister, my wife and my grandmothers. They have all left a mark on me.",
 "I am the creator of this work, but my backbone is my father. The words that follow are his.",
]

SECTORS = [
 ("Education and development", "To our teachers, trainers, counsellors and the people who run our schools and programmes: you shape lives. Specialists, bring your subject and your care for children with special needs and autism. Generalists, keep our learning places well run, safe and open to every ability. Learning will always be close to our hearts."),
 ("Sustainability", "To our engineers, data and cloud specialists, and the field teams in our villages: you bring safe, smart and secure technology to the places that need it most. Specialists, make the technology simple and reliable. Generalists, work hand in hand with government schemes, foundations and village communities. Put the rural and the underserved first, always."),
 ("Outer space projects", "To our scientists, engineers and the managers of our space ventures: you work at the edge of what is possible. Specialists, aim high and test carefully. Generalists, manage capital, partners and timelines with patience. Space teaches humility, and we ask you to carry it with you."),
 ("Commercial enterprises and management", "To our traders, transport and contracting teams, and our finance professionals: you keep goods, money and promises moving. Specialists, master your trade and your numbers. Generalists, hold the businesses together and keep every partner's trust. A fair deal today brings a partner for life."),
 ("Agricultural enterprises and management", "To our farmers, agronomists, livestock and fisheries experts, and the people who take crops to market: you feed people. Specialists, care for the soil, the animals and the sea. Generalists, build fair markets and stable incomes for farming families. Treat the land and nature which feeds us as you would treat your own mother."),
 ("Sport enterprises and development", "To our coaches, facility managers and sports project teams: you build health, discipline and team spirit. Specialists, keep our grounds and programmes of the highest standard. Generalists, open them to young people from every background. Sport builds character, and character builds a nation. A nation with character befriends other nations."),
 ("Technology for life sciences and healthcare", "To our doctors, scientists, digital and AI specialists in health: your work touches lives directly. Specialists, keep patient safety and good science above all. Generalists, turn good ideas into services people can reach and afford. Use every new tool, including AI, with care and honesty."),
 ("Micro, small and medium enterprises", "To the people who support our small businesses, trainers, certifiers and employers alike: small businesses are the backbone of the economy. Specialists, help owners and workers learn new skills as technology changes. Generalists, connect education, workers and employers so no one is left behind."),
 ("Communications and connected devices", "To our ICT engineers, network and device specialists, and digital teams: you connect people, places and machines. Specialists, build systems that are secure and dependable. Generalists, make sure the technology serves people and not the other way around."),
 ("Industrial enterprises and management", "To our plant managers, engineers, mining and processing teams: you make the materials the world depends on. Specialists, run every operation safely and efficiently. Generalists, plan for the long term and care for workers and neighbours. No target is worth an unsafe day."),
 ("Water enterprises and development", "To our water engineers, planners and project teams: water is life. Specialists, design and run our infrastructure so it lasts for generations. Generalists, work with communities and governments so clean water reaches every home. Waste not a single drop."),
]

THANKS = ("To everyone who walks with us: to our authors, trainers, mentors, facilitators, academicians and advisors; to our learners, earners and alumni, and the parents and families who support them; to our customers and members; to our employees, their families, and our full-time, part-time, fractional and gig colleagues; to our technologists, specialists, generalists, professionals and vocational workers; to our consultants and specifiers; to the Industry 4.0 and Industry 5.0 competence developers who improve our people, spaces and processes across the workspace, the workflow and the workforce; to our farmers, artisans, field teams, and resilience and recreation workers; to our MSMEs, contractors, service providers and suppliers; to our partners, certifiers and employers; to the governments, regulators, foundations, NGOs and volunteers who work beside us; to the villages and communities who welcome our projects; and finally to the lenders and investors who gave us our start: thank you. We value your trust more than any contract, and we will work every day to deserve it, for you and for the generations still to come.")

SANJAY = [
 "I was born into a joint family. My first teachers were the people in our home and the people who lived in our block within the community: homemakers, teachers, engineers, doctors, lawyers, bankers, sportspeople and artists. As a toddler I passed from one pair of loving hands to another, and learned from each.",
 "As a boy I stepped out into the open, friendly neighbourhood around our house. Elders from every walk of life became my first school. I learned simply by watching how they lived: cheerful, simple, kind and grateful. They loved life and work, met good times and hard times with calm, and always leaned on each other. It was a tight-knit community. I could have breakfast at home, lunch at one neighbour's house and dinner at another's.",
 "I was a curious child, and I took it all in. Long before I learned the words “leadership” and “ownership” at school, I had already seen them lived. Those lessons never faded. They became my life truths.",
 "Work later brought me to the UAE, where I have lived and worked for 30 years now, alongside people of more than 50 nationalities. Unlike many places, the UAE welcomes every culture and, in doing so, creates a pattern of its own, one that brings people of all backgrounds together as one. People grow in the UAE, and that has been my learning. People grow when someone listens, teaches, trusts and engages them.",
 "For 30 years I have worked in electrical engineering, electromechanical systems, telecom, and media and broadcasting. I began as an order handling engineer and grew into sales, projects, technical management and training. I handled capital projects worth billions of dollars for leading builders, infrastructure, industries and utilities in the UAE. I also led teams and headed a regional academy for technical, sales, services and channels training at a global electrification leader. Between 2003, when we implemented this, and 2016, it led to a ten fold revenue growth across the MEA region. The crown jewel of that experience came when I was trusted, as a new product expert, to work with the R&amp;D team in Italy to build an intelligent compact low-voltage switchgear system, tested at an independent laboratory in Italy, for two iconic landmark projects which made Dubai world famous in 2009. It is the capstone of a career for any energy professional. I worked alongside greats who to this day call me a friend. Friends like these are worth more than money can earn. Training became a daily habit, and the habit became a mantra: <strong>Learn it to Earn it.</strong> That is what it really means. Today it has grown into <strong>Learn it, Author it, Train it, so that all can Earn it.</strong>",
 "@@J@@ began in July 2011, when my school headmaster inspired many of us in my batch to stop being job seekers and become job creators. A growing family meant I could make it happen only in this decade. Along the way, teachers, doctors, statesmen and sportsmen, many of them known to me through my father, inspired me to reach this milestone. They also encouraged me to complete a postgraduate degree at an international business school, where I earned lifelong relationships with some great people who are now part of this journey. It is my earnest wish that you get to engage with them, and experience them as fondly as I do whenever I have the chance.",
 "I hold an Executive MBA and a Bachelor’s degree in Electrical Engineering, and I am a Chartered Engineer.",
 "My principle is simple: <strong>Touch, Move, Inspire.</strong> I want to help each person find a smart, safe, secure and sustainable career, and discover their own potential. I try to be the difference I wish to see in the world.",
 "This knowledge and experience should not wither away with me in time. So I have turned what I learned into a systematic process, to benefit the 100 to 150 million white-collar and blue-collar professionals in the energy sector.",
 "I want young people to pick this up from where professionals of my generation have left it, and to build it further. I am still here to help you along the way, for you and for the projects you help build in this world. It is my daily communion with my maker that the platform and the ecosystem I am setting up continue to serve millions of workers around the world long after I am gone. I am also training my children to facilitate the ecosystem, so that my work continues beyond me.",
 "If you love your work and enjoy doing things differently, come and take your place in the Author it, Train it, Learn it, Earn it (<a class=\"atle-in\" href=\"@@A@@\" aria-label=\"ATLE(it)\">ATLE<sup>it</sup></a>).",
]

def letter(site):
    way_hfl = site in ("ahfl", "hfl")
    full = site == "ahfl"
    P = []
    P.append(("greet", "Dear friends, partners and members of our family and the wider " + ("group," if full else "community,")))
    if full:
        P.append(("p", "When we look at what AHFL has become, we feel deep gratitude. What began as a family’s belief in learning, honest work and service has grown into a group with more than 30 activities across many sectors. We are working to grow that to 50."))
    else:
        P.append(("p", "When we look at what our family’s work has become, we feel deep gratitude. What began as a family’s belief in learning, honest work and service has grown across many sectors."))
    P.append(("p", "From energy to learning, each activity has its own work, but they all share one purpose: to create lasting value for people and communities. A new venture is not only a business. It creates jobs, builds skills and gives families the chance to build a better life. We ask our teams to remember that behind every number there are people who depend on us."))
    P.append(("p", ("Growing from 30 activities to 50 will need discipline as much as ambition." if full else "Growth will need discipline as much as ambition.") + " We ask every new venture to hold the same standards as the first: quality, fairness and care for the long term."))
    P.append(("h", "A word to the people who serve each of our sectors"))
    P.append(("p", "Every sector needs two kinds of people. Specialists bring deep skill in one field. Generalists see the whole picture and join the pieces together. We need both, and we ask you to respect and learn from each other."))
    P.append(("sectors", None))
    way = "the HFL Way" if way_hfl else "the family way"
    P.append(("p", f"We are proud of {way}. It asks us to act with honesty, to keep our promises, to treat every partner fairly and to care for every natural element, earth, water, air, fire and space, and for the people around our projects. These values have guided our family for many years, and we are happy to see the next generation carry them forward. So, in every transaction, in the marketplace and in the workplace, we ask you to put people before profits. Choose what is sustainable and repeatable over winning every opportunity. And put the customer’s experience before a quick sale. Business built this way may grow a little slower, but it lasts, and it earns trust that no money can buy."))
    P.append(("p", "To Sanjay and Rachana: you have our full trust and our blessings. With our whole family, and in loving memory of those who came before us, we ask you and the whole leadership team to lead with humility, to decide with courage, and never to forget why we started."))
    P.append(("p", THANKS))
    P.append(("p", "To our young colleagues: keep learning every day. In this 21st century ecosystem, the world of energy is changing fast, and curious, hard-working people will shape it."))
    P.append(("verse", ["From the golden seed, all things are born.", "What we sow with honest hands, the earth returns as fruit.", "And every fruit we gather, we share, for the good of all the world."]))
    P.append(("p", "May this work bring light, prosperity and well-being to all."))
    P.append(("san", "Hiranyagarbha Phalaprada Lokahitaya."))
    P.append(("sign", "With warmth and gratitude,"))
    P.append(("who", "Mr. VR Raghavendra &amp; Mrs. Meera R" + ("<br>Chairpersons Emeritus, AHFL" if full else "<br>Chairpersons Emeritus")))
    return P

PHOTO = {"yantra": "/assets/img/family-photo.jpg", "hflpass": "img/family-photo.jpg", "ahfl": "assets/family-photo.jpg", "hfl": "assets/family-photo.jpg"}
MORE = [("family-raja.jpg", 960, 1280, "An old portrait of a seated elderly man in a turban, dark coat and white dhoti, in a studio with a curtain and a tiled floor.", "Raja Thatha, Amma’s father."),
        ("family-mamatha.jpg", 956, 952, "A family photograph: a father holding a toddler, a mother in a teal and red saree, and a young boy in front, with a person in clown costume behind them.", "Mamatha and family (Seene Uncle’s second daughter).")]
PHOTO_ALT = "A family portrait from long ago, restored and colourised: elders seated in the middle, young couples on either side, and four children sitting on a rug in front, in a garden."
PHOTO_CAP = "Our family, gathered for a portrait. Seated: Mr. V. S. Ramacharya (B.E., Civil); Smt. Rukmini Bai, his wife; Smt. Saraswati Bai, with little Draupadi (later the wife of Capt. Bhargav, who became General Manager of Hindustan Motors, the company that built the Ambassador car); Mr. V. S. Vedavyasacharya (M.A., I.C.S.) with Master Madhwaraja; the grandfather, Mahamahopadhyaya; Shri Shyamacharya with Krishna Bai; Smt. Kamala Bai; Mr. V. S. Jayacharya (B.A., B.L.); and Smt. Kamulu. On the rug: Master Anantachar and Master Sri Padarajacharya, with their friends from the neighbours. This photograph was restored and colourised by a Bangalore studio, and gifted to everyone in the family in September 2025."
JOURNEY = {"yantra": "/energy-journey/"}

def our_story(site="ahfl", tag="h2"):
    JH = JOURNEY.get(site, "energy-journey/")
    out = []
    for k, v in letter(site):
        if k == "greet": out.append(f'<p class="os-greet">{E(v)}</p>')
        elif k == "p": out.append(f'<p>{E(v)}</p>')
        elif k == "h": out.append(f'<h4>{E(v)}</h4>')
        elif k == "sectors":
            out.append('<details class="os-in"><summary>Notes to each sector</summary>' + "".join(f'<h5>{E(t)}</h5><p>{E(x)}</p>' for t, x in SECTORS) + '</details>')
        elif k == "verse": out.append('<p class="os-verse">' + "<br>".join(E(x) for x in v) + '</p>')
        elif k == "san": out.append(f'<p class="os-san"><em>{E(v)}</em></p>')
        elif k == "sign": out.append(f'<p class="os-sign">{E(v)}</p>')
        elif k == "who": out.append(f'<p class="os-who"><strong>{v}</strong></p>')
    father = "".join(out)
    trib = "".join(f"<p>{E(x)}</p>" for x in TRIBUTE)
    pic = (f'<figure class="os-pic"><img src="{PHOTO.get(site, "assets/family-photo.jpg")}" width="1600" height="956" loading="lazy" decoding="async" alt="{E(PHOTO_ALT)}">'
           f'<figcaption>{E(PHOTO_CAP)}</figcaption></figure>')
    base = PHOTO.get(site, "assets/family-photo.jpg").rsplit("/", 1)[0]
    more = "".join(f'<figure class="os-pic os-pic2"><img src="{base}/{f}" width="{w}" height="{h}" loading="lazy" decoding="async" alt="{E(a)}"><figcaption>{E(c)}</figcaption></figure>' for f, w, h, a, c in MORE)
    pic += f'<div class="os-more">{more}</div>'
    J = "The House for Learning journey" if site == "hfl" else "This journey"
    A = "/atle/" if site == "yantra" else "atle.html"
    sj = "".join(f"<p>{x.replace('@@J@@', J).replace('@@A@@', A)}</p>" for x in SANJAY)
    return (f'<aside class="os" id="our-story" aria-labelledby="os-h"><div class="w"><details class="os-box">'
            f'<summary><span class="os-k">Our story</span><{tag} id="os-h">Words from our family</{tag}>'
            f'<span class="os-t">Where this work comes from: a father’s message, and a son’s thanks.</span>'
            f'<span class="os-b">Read the full story</span></summary>'
            f'<div class="os-body"><div class="os-trib">{trib}</div>{pic}'
            f'<h3>From the Desk of the Chairpersons Emeritus</h3><div class="os-letter">{father}</div>'
            f'<h3 class="os-sj">How I learned to Touch, Move and Inspire</h3><div class="os-sjt">{sj}<p class="os-who"><strong>Sanjay R Acharya</strong></p><p class="os-go"><a href="{JH}">See the energy journey: 150 years behind us, 150 ahead.</a></p></div>'
            f'</div></details></div></aside>')

CSS = """
.os{padding:28px 0;background:var(--bg,#fff);color:var(--ink,#14202b);font-family:Montserrat,system-ui,sans-serif}.os .w{max-width:1100px;margin:0 auto;padding:0 16px}
.os-box{border:1px solid var(--line,#d9d4c5);border-left:5px solid #3CC261;border-radius:14px;background:var(--sand,#F2EEE2);max-width:760px}
.os-box>summary{list-style:none;cursor:pointer;padding:22px 24px;display:block;border-radius:14px}.os-box>summary::-webkit-details-marker{display:none}
.os-box>summary:focus-visible{outline:3px solid #0F85DB;outline-offset:2px}
.os-k{display:block;font-size:.75rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:#1f7a3a;margin:0 0 4px}
.os-box>summary h2,.os-box>summary h1,.os-box>summary h3{margin:0 0 6px;font-size:clamp(1.25rem,2.6vw,1.6rem);line-height:1.25}
.os-t{display:block;color:var(--mute,#4a5a68);margin:0 0 12px}
.os-b{display:inline-block;background:#0F85DB;color:#fff;font-weight:600;font-size:.9rem;padding:9px 16px;border-radius:999px}.os-b:after{content:" +"}
.os-box[open]>summary .os-b:after{content:" \\2212"}.os-box[open]>summary .os-b{background:#0b6aa9}
.os-body{padding:0 24px 26px;line-height:1.75}.os-body h3{font-size:1.15rem;margin:26px 0 10px}.os-body h4{font-size:1rem;margin:22px 0 8px;color:#0F85DB}.os-body h5{font-size:.95rem;margin:16px 0 4px}
.os-body p{margin:0 0 12px}.os-trib{border-left:3px solid #3CC261;padding-left:16px;font-style:italic}
.os-sj{border-top:1px solid var(--line,#d9d4c5);padding-top:24px}.os-greet{font-weight:600}.os-verse{margin:16px 0;padding-left:16px;border-left:3px solid #0F85DB}.os-who{margin-top:16px}
.os-in{margin:8px 0 16px;border:1px solid var(--line,#d9d4c5);border-radius:10px;background:var(--card,#fff);padding:4px 16px}.os-in>summary{cursor:pointer;font-weight:600;padding:10px 0}.os-in>summary:focus-visible{outline:3px solid #0F85DB;outline-offset:2px}
.os-pic{margin:18px 0 8px}.os-pic img{display:block;width:100%;max-width:720px;height:auto;border-radius:10px;border:1px solid var(--line,#d9d4c5)}.os-more{display:flex;flex-wrap:wrap;gap:16px;margin:0 0 8px}.os-more .os-pic{flex:1 1 260px;max-width:340px;margin:10px 0 0}.os-pic figcaption{font-size:.85rem;color:var(--mute,#4a5a68);margin-top:8px;font-style:normal}
.os-go{margin:22px 0 0}.os-go a{display:inline-block;background:#3CC261;color:#0b2a14;font-weight:700;text-decoration:none;padding:11px 18px;border-radius:999px}.os-go a:hover{background:#2fae52}.os-go a:focus-visible{outline:3px solid #0F85DB;outline-offset:2px}
@media(max-width:560px){.os-box>summary{padding:18px 16px}.os-body{padding:0 16px 22px}}
"""
