# Georgia and Israel local notes for 25 topics. Rules change: check current rule.
# (topic, offer, buyer, reg_kind, data_note, channel, partner, net_gel, net_ils, risk)
_T = [
("Space Tourism","a space-flight or zero-gravity experience resale package","high-income travellers and corporate gift buyers","aero","traveller ID and health forms","luxury travel agents and premium events","a licensed foreign flight operator",4000,9000,"a licence or safety approval"),
("Artificial Intelligence","an AI tool that saves a set task for local firms","Georgian and Israeli small firms with manual back-office work","gen","client files used to train or run the tool","LinkedIn, tech meetups and direct demos","a local systems integrator",1500,4000,"a data protection review"),
("Minority Businesses","a growth support service for minority-owned firms","Armenian, Azerbaijani, Arab, Druze and Bedouin owners in their own languages","gen","owner and ethnic-origin data, which is sensitive","community groups, local-language media and WhatsApp","a trusted community leader",300,800,"mistrust of outsiders"),
("Online Medical Supply and Equipment Provider","an online shop for home care and clinic supplies","clinics, pharmacies and home-care families","health","patient and order data, which is health data","clinic visits, pharmacy partners and search ads","a licensed medical importer or pharmacy",250,700,"selling an unregistered device"),
("Chatbots","a customer-service chatbot in local languages","shops, clinics and hotels with many repeat questions","gen","chat logs that hold names and phone numbers","WhatsApp demos and web-agency partners","a web agency",600,1800,"wrong answers sent to customers"),
("Car Sharing Business","short-term app-based car rental by the hour","city residents without a car and visitors","gen","driver licence, ID and GPS trip data","app stores, university areas and hotel desks","a car owner, fleet lessor and insurer",15,40,"accident and insurance gaps"),
("Box Subscription Services","a monthly themed box of local goods","gift buyers and urban households","gen","delivery addresses and card tokens","Instagram, Facebook and local influencers","a courier and local producers",90,220,"high churn and late delivery"),
("Virtual Medical Appointment System","a booking and video-visit tool for clinics","private clinics and their patients","health","patient records and video sessions","clinic managers and medical associations","a licensed clinic",400,1200,"storing health records unsafely"),
("Coworking Spaces","desks and meeting rooms for freelancers and startups","freelancers, remote workers and small tech teams","gen","door-access logs and member details","tech communities, Facebook groups and open days","a landlord and a cafe operator",350,900,"empty desks against a fixed lease"),
("Biometric Sensor & Security Company","fingerprint and face access systems for sites","offices, factories and building managers","gen","biometric data, which is highly sensitive","security installers and tenders","a licensed security integrator",2500,7000,"keeping biometric data without a clear need"),
("Stem Cell Therapy","a planning service that links patients to licensed clinics","adults seeking regenerative care","health","medical records and consent","doctor referrals and patient forums","a licensed clinic and lab",3000,8000,"claims no regulator has approved"),
("Skincare Spa & Clinic","facials, peels and skin care visits","urban women and men seeking regular care","health","skin photos and allergy notes","Instagram, review sites and referral cards","a licensed physician for medical treatments",180,450,"a treatment that needs a doctor"),
("3D Home Building","3D-printed walls for small homes and sheds","developers, farm owners and small builders","gen","site plans and owner details","builder networks, trade fairs and tenders","a licensed engineer and contractor",25000,60000,"building approval for a new method"),
("E-Commerce Inventory Management","stock-sync software for online shops","sellers on several marketplaces and their own sites","gen","customer orders and supplier lists","e-commerce groups and shop plug-in listings","a courier and a payment provider",200,550,"wrong stock counts after a sync fault"),
("P2P Lending Platform","a platform that matches lenders and small borrowers","small firms needing credit and private lenders","money","borrower credit and ID data","SME groups and accountants","a licensed bank or lender",5000,15000,"lending or collecting without a licence"),
("Online Car Dealership","online sale of used cars with checks and delivery","buyers who want price and history in one place","gen","buyer ID and vehicle history","car listing sites, Facebook and search ads","an inspector and a finance partner",20000,50000,"hidden defects and odometer fraud"),
("Virtual Interior Design Consulting","video room design with a mood board and shopping list","renters, new owners and Airbnb hosts","gen","room photos and home addresses","Instagram, Pinterest and furniture shops","a furniture supplier",300,800,"clients who do not buy the items"),
("Car Charging Stations","public and private EV chargers","EV drivers, hotels, malls and building committees","gen","charging sessions and payment data","host sites, EV clubs and map apps","a site owner and a power installer",1800,5000,"grid connection delay"),
("Virtual Event Planning Platform","a platform for online talks, fairs and team events","companies, associations and schools","gen","attendee lists and recordings","HR managers, event agencies and LinkedIn","a streaming crew",800,2500,"live tech failure"),
("Portable Wireless Charging Station","phone charging points in cafes and malls","cafes, malls, bars and airports","gen","payment and app sign-up data","venue managers and nightlife owners","a venue owner and an electronics supplier",8,25,"theft and unit faults"),
("VR Live Events","live concerts and tours seen in VR headsets","fans, tourists and corporate teams","gen","viewer accounts and headset data","event promoters and gaming communities","a content owner and a streaming crew",35,100,"few headset owners"),
("Plastic Alternatives","paper, cane or bio-based packaging","cafes, shops, food producers and hotels","gen","supplier and customer details","food trade fairs and direct sales to chains","a maker abroad and a local packer",120,350,"claims of green benefit you cannot prove"),
("Online Tutoring Platform","paid online lessons in school subjects and languages","parents of school pupils and exam students","gen","child data, which needs parent consent","parent groups, schools and exam-season ads","self-employed teachers",60,150,"child safety and lesson quality"),
("Digital Marketing","ads, content and web tracking for local firms","local shops, hotels, clinics and exporters","gen","visitor tracking and email lists","referrals, case studies and local business groups","a freelance designer or ad specialist",800,2200,"results you cannot promise"),
("Mobile Application Testing Services","testing apps on local phones and in Georgian, Hebrew and Arabic","app makers and startups","gen","test accounts and user data in apps","startup hubs and developer groups","a device lab",900,2500,"leaks of client app data"),
]

def _fmt(n): return f"{n:,.0f}".replace(",", " ")

def _rows(t):
    k,offer,buyer,reg,dn,ch,pt,g,i,risk = t
    gv=g*0.18; iv=i*0.18
    reg_g={"aero":"Georgia: space and aviation activity is regulated, so plan only and partner with the licensed operator; check current rule.",
           "health":"Georgia: health activity needs a licensed provider; sell only through one and check current rule.",
           "money":"Georgia: lending and payments are central-bank regulated; plan only and partner with a licensed firm; check current rule.",
           "gen":"Georgia: pick Individual Entrepreneur or LLC; small status taxes turnover at a low rate within a cap, so check current rule."}[reg]
    reg_i={"aero":"Israel: aviation and space work needs state approval, so plan only and partner with a licensed firm.",
           "health":"Israel: health services and devices need licence and registration; partner with a licensed firm and check current rule.",
           "money":"Israel: credit and payment work needs a licence from the financial regulator; plan only and partner with a licensed firm.",
           "gen":"Israel: choose exempt dealer, authorised dealer or company by turnover; check current rule."}[reg]
    fit={"aero":"This is a planning and resale sector, not an operator one","health":"Health rules limit what you may claim and do","money":"Money rules limit what you may do alone","gen":"Check the idea against both markets"}[reg]
    return [
    (f"Size the market for {offer}. Georgia: small, centred on Tbilisi, Batumi and Kutaisi, with tourist peaks. Israel: larger, with Tel Aviv, Haifa and Jerusalem. Count {buyer} in each.",
     f"Count 100 {buyer.split(',')[0]} in Tbilisi and 100 in Tel Aviv. Ask 10 of each if they would pay {_fmt(g)} GEL or {_fmt(i)} ILS."),
    (f"{fit}. Georgia has low costs and few rivals but a small buyer pool. Israel has strong demand and high costs. Test one city first, near {risk}.",
     f"Score Georgia and Israel from 1 to 5 on demand, rivals, cost and rule risk. Start where {risk} is lowest."),
    (reg_g+" "+reg_i,
     f"List each permit your {offer.split(' ')[0]} work needs in Georgia and in Israel. Ask a local adviser to confirm before you sell."),
    (f"Know the local data law. Georgia: personal data law needs a lawful basis, notice and safe storage. Israel: privacy law needs database duties and care with sensitive data. You hold {dn}.",
     f"Write a one-page notice in Georgian, Hebrew and Arabic or Russian on what {dn} you keep, why and for how long."),
    (f"Reach {buyer}. Use {ch}. Georgia: Georgian first, Russian and English for visitors. Israel: Hebrew first, Arabic and Russian for key groups.",
     f"Run a 2-week test: 3 posts in Georgian and 3 in Hebrew on {ch.split(',')[0].split(' and ')[0]}. Count replies."),
    (f"Price in local money and add VAT. Georgia: GEL, VAT 18% above the registration limit. Israel: ILS, VAT 18% for dealers; check current rate. Keep cost, tax and margin on separate lines.",
     f"Georgia: {_fmt(g)} GEL net + {_fmt(gv)} GEL VAT = {_fmt(g+gv)} GEL. Israel: {_fmt(i)} ILS net + {_fmt(iv)} ILS VAT = {_fmt(i+iv)} ILS."),
    (f"Work with {pt}. Georgia: staff pay income tax and a pension split; check current rule. Israel: staff need a contract, National Insurance and pension. Use freelancers only if they are truly independent.",
     f"Write a one-page deal with {pt}: tasks, pay, who owns the work, and who is liable for {risk}."),
    (f"Launch small in one city with a go/no-go rule. Georgia: go if 10 paid buyers in 8 weeks. Israel: go if 15 paid buyers in 8 weeks. Stop or change if {risk} is not solved.",
     f"Week 1 permits check, week 3 pilot of 5 buyers, week 8 count. Below the target or with {risk} open: no-go."),
    ]

R_ge_3 = {t[0]: _rows(t) for t in _T}
