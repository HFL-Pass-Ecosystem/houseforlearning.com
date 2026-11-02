# Georgia (GE) and Israel (IL) local points per topic.
# (topic, buyer, offer, regulated_note or "", channel_hint, pilot)
_T = [
("Selling PPE","clinics, factories and builders","masks, gloves and safety kits","Medical-grade items may need product registration; check current rule.","B2B calls and trade-show contacts","3 bulk orders"),
("Robotics","factories, farms and warehouses","robot cells and service robots","","engineer meetups and plant visits","2 paid pilots"),
("IoT","building owners, farms and fleets","sensor kits and dashboards","","installer partners and demos","3 paid pilots"),
("Online fulfilment business","small web shops","pick, pack and ship service","","shop-owner groups and courier talks","5 shops on trial"),
("Blockchain Health Record Digitization & Sharing Company","clinics and patients","consented record sharing","Health: plan only and partner with a licensed health firm.","clinic managers and health-IT contacts","2 clinic letters of intent"),
("Micro-Mobility Services","tourists and city commuters","e-scooter and e-bike rental","","hotel desks and app stores","one district pilot"),
("Nanosatellites","research teams and telecom firms","small-satellite parts and plans","Space: plan only and partner with a licensed space firm.","engineering forums and expo contacts","2 signed study deals"),
("Electric Car","drivers and fleets","EV sales, charging and service","","car-buyer groups and fleet managers","10 test drives booked"),
("Business Process Outsourcing Services","foreign and local firms","back-office and call-centre work","","B2B outreach and referrals","1 trial contract"),
("DNA Analysis","patients and clinics","lab test reports","Health: plan only and partner with a licensed lab.","doctor referrals and health blogs","2 lab partner letters"),
("Privacy Protection Firm","firms holding customer data","privacy audits and policies","","lawyer and IT referrals","3 audit clients"),
("Cryobank","couples and clinics","sample storage plans","Health: plan only and partner with a licensed clinic.","clinic referrals and parent forums","1 licensed partner letter"),
("Senior At-Home Care","families of older adults","home visits and carers","Care: plan only and partner with a licensed care provider.","family groups and clinic referrals","10 trial households"),
("e- Commerce","online shoppers","an online shop","","social ads and marketplaces","50 first orders"),
("Biofuel Production","fleets and energy buyers","fuel from waste oil and crops","Fuel rules apply; check current rule and partner with a licensed firm.","fleet managers and waste suppliers","1 feedstock deal"),
("Crowdfunding Platform","founders and backers","a funding site","Money: plan only and partner with a licensed financial firm.","startup groups and social media","5 campaigns on trial"),
("Grow Meat In A Lab","food firms and restaurants","cultivated meat samples","Novel food needs approval; plan only and partner with a licensed lab.","food-tech meetups and chefs","2 tasting partners"),
("Online Library","students and readers","e-books and reading access","","school contacts and book groups","500 sign-ups"),
("Affiliate Marketing","web shops and bloggers","referral links and reports","","blogger groups and shop owners","5 partner shops"),
("Vertical Farming","grocers and restaurants","indoor-grown greens","","grocer calls and chef samples","3 weekly buyers"),
("Tele & Video Conferencing","firms and clinics","video meeting service","","IT managers and trial offers","5 trial teams"),
("eSports","gamers and sponsors","tournaments and teams","","gamer chats and cafes","1 sponsor and 64 players"),
("Control the Water","farms, towns and factories","water meters and leak control","","farm co-ops and town offices","2 site pilots"),
("Influencer Marketing","brands and creators","creator campaigns","","creator DMs and brand calls","3 paid campaigns"),
("Solar Power","homes and firms","rooftop solar systems","Grid links need a licensed installer; check current rule.","roof surveys and installer partners","5 site surveys"),
]
def _rows(t):
    n,b,o,reg,ch,pi=t
    r=[]
    r.append(("Size the demand for "+o+". Georgia: about 3.7m people, Tbilisi and Batumi lead. Israel: about 10m, Tel Aviv area leads. Count "+b+" in each.",
      "List 20 "+b+" in Tbilisi and 20 in Tel Aviv; call 5 each to test need for "+o+"."))
    r.append(("Test fit for "+n+" locally. Georgia: small, price-led, import-heavy. Israel: tech-ready, fast to adopt, costs more. Pick one country first.",
      "Pick Georgia if price is key, Israel if speed and tech matter; write why for "+o+"."))
    r.append(("Choose a legal form. Georgia: individual entrepreneur or LLC. Israel: sole dealer or company. Check current rule for each. "+(reg if reg else "Ask if "+o+" needs a trade permit."),
      "Compare sole trader and company for "+n+"; list the permits for "+o+" and ask an accountant to confirm."))
    r.append(("Protect data. Georgia: personal data law needs a lawful reason and notice. Israel: privacy law needs database duties and security. Check current rule.",
      "Write a one-page notice for "+b+": what data "+o+" keeps, why, and how long."))
    r.append(("Find buyers by channel. Georgia: Facebook, Telegram, Georgian, Russian and English. Israel: WhatsApp, Facebook groups, Hebrew, Arabic, Russian and English.",
      "Use "+ch+" in both languages; send 20 messages about "+o+" and log replies."))
    r.append(("Price in local money with tax. Georgia: GEL, VAT 18% above the turnover limit (check). Israel: ILS, VAT 18% for licensed dealers (check). Net 100 plus 18% VAT is 118.",
      "Price "+o+": cost 60 GEL or ILS, margin 40, net 100, with VAT 118. Check what you owe in each country."))
    r.append(("Hire with local rules. Georgia: written contract, income tax withheld, pension split (check). Israel: payslips, national insurance, pension, minimum wage (check). Use partners for peaks.",
      "List 2 roles for "+n+"; for each, note contract type, pension duty and one partner to cover peaks."))
    r.append(("Launch small, then decide. Go/no-go: reach "+pi+" in 60 days with margin above 30%. Otherwise stop or switch country.",
      "Run a 60-day pilot of "+o+" in one city; meet "+pi+"? Go. If not, change the country or stop."))
    return r
R_ge_2={t[0]:_rows(t) for t in _T}
