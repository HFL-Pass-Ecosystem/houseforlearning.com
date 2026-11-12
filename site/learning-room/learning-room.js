(function () {
'use strict';
const DATA = {"pack":"1.8","page":"1.0","ppu":4,"foundationUnits":25,"levels":{"1":"Foundation","2":"Practitioner","3":"Advanced","4":"Mastery"},"strands":{"S1":"Self-mastery and daily habits","S2":"Purpose, values and integrity","S3":"Leading people and teams","S4":"Communication and presence","S5":"Negotiation, selling and customer value","S6":"Cost and decision accounting","S7":"Finance, budgets and control","S8":"Personal money habits","S9":"Strategy, markets and growth","S10":"Processes, systems and quality (ERP, CRM, MIS)","S11":"Learning culture and leader development","S12":"Conscience: what not to do with a genius mindset"},"sectors":[["other","Independent, gig and new ventures",false],["software","Software and IT services",false],["healthcare","Healthcare services",true],["manufacturing","Manufacturing and factories",false],["consulting","Consulting and business services",false],["banking","Banking and financial services",true],["insurance","Insurance",true],["transport","Transport and mobility",false],["aerospace","Aerospace and defence",true],["energy","Energy: oil, gas and power",true],["hospitality","Hotels, travel and leisure",false],["retail","Retail and shops",false],["meddevices","Medical devices and supplies",true],["pharma","Pharma and medicines",true],["realestate","Real estate and property",false],["telecom","Telecom and networks",false],["chemicals","Chemicals and materials",false],["hardware","Computer hardware and electronics",false],["biotech","Biotech and life sciences",true],["foodprod","Food and beverage production",false],["restaurants","Restaurants, cafes and catering",false],["utilities","Utilities: power, water and gas supply",false],["wholesale","Wholesale and distribution",false],["automotive","Automotive and electric vehicles",false],["media","Media, news and content",false],["consumer","Consumer products and brands",false],["construction","Construction and building",false],["education","Education and training",false],["agriculture","Agriculture, farming and forestry",false],["transequip","Ships, rail, aircraft and handling equipment",false],["government","Government and public services",true],["smartcities","Smart cities and urban development",false],["water","Water and sanitation",false],["waste","Waste, recycling and circular economy",false],["climate","Climate and sustainability",false],["cleanenergy","Clean energy and renewables",false],["nature","Nature, wildlife and animals",false],["space","Space and satellites",false],["cyber","Cybersecurity and data protection",false],["dataai","Data, AI and analytics",false],["datacentre","Data centres and cloud",false],["engineering","Engineering and project services",false],["logistics","Logistics and supply chain",false],["investment","Investment and capital",true],["accounting","Accounting, audit and tax",true],["legal","Legal, compliance and governance",true],["gaming","Gaming, animation and immersive media",false],["arts","Arts, culture and heritage",false],["sport","Sport, fitness and wellbeing",false],["social","Social impact and community",false]],"lex":{"other":{"customers":"clients","metric":"repeat-client rate","offer":"a client project","offer_bare":"client project","offers":"client projects","place":"a home studio","place_bare":"home studio","process":"enquiry to delivery and payment","risk":"late payment by a client","role":"a freelancer","role_bare":"freelancer","roles":"freelancers","sector":"independent, gig and new ventures"},"software":{"customers":"client teams","metric":"defect escape rate","offer":"a software release","offer_bare":"software release","offers":"software releases","place":"a development team","place_bare":"development team","process":"requirement to deployment","risk":"a security vulnerability","role":"a software developer","role_bare":"software developer","roles":"developers","sector":"software and IT services"},"healthcare":{"customers":"patients","metric":"patient waiting time","offer":"a diagnostic test","offer_bare":"diagnostic test","offers":"diagnostic tests","place":"a clinic","place_bare":"clinic","process":"patient admission to discharge","risk":"a patient-safety incident","role":"a clinic manager","role_bare":"clinic manager","roles":"clinic staff","sector":"healthcare services"},"manufacturing":{"customers":"industrial buyers","metric":"first-pass yield","offer":"a machined part","offer_bare":"machined part","offers":"machined parts","place":"a factory","place_bare":"factory","process":"order to dispatch","risk":"a machine breakdown","role":"a production supervisor","role_bare":"production supervisor","roles":"machine operators","sector":"manufacturing and factories"},"consulting":{"customers":"client organisations","metric":"billable utilisation","offer":"a consulting assignment","offer_bare":"consulting assignment","offers":"consulting assignments","place":"a consulting practice","place_bare":"consulting practice","process":"proposal to final report","risk":"scope creep","role":"a business consultant","role_bare":"business consultant","roles":"consultants","sector":"consulting and business services"},"banking":{"customers":"account holders","metric":"loan turnaround time","offer":"a small-business loan","offer_bare":"small-business loan","offers":"small-business loans","place":"a bank branch","place_bare":"bank branch","process":"loan application to disbursement","risk":"a fraud attempt","role":"a branch manager","role_bare":"branch manager","roles":"relationship managers","sector":"banking and financial services"},"insurance":{"customers":"policyholders","metric":"claim settlement time","offer":"a health policy","offer_bare":"health policy","offers":"health policies","place":"an insurance office","place_bare":"insurance office","process":"proposal to claim settlement","risk":"a fraudulent claim","role":"an insurance advisor","role_bare":"insurance advisor","roles":"advisors","sector":"insurance"},"transport":{"customers":"passengers and shippers","metric":"on-time delivery rate","offer":"a delivery trip","offer_bare":"delivery trip","offers":"delivery trips","place":"a transport depot","place_bare":"transport depot","process":"booking to delivery","risk":"a road accident","role":"a fleet manager","role_bare":"fleet manager","roles":"drivers","sector":"transport and mobility"},"aerospace":{"customers":"airlines and defence customers","metric":"aircraft turnaround time","offer":"a maintenance check","offer_bare":"maintenance check","offers":"maintenance checks","place":"a hangar","place_bare":"hangar","process":"work order to release to service","risk":"a missed safety inspection","role":"an aircraft maintenance engineer","role_bare":"aircraft maintenance engineer","roles":"technicians","sector":"aerospace and defence"},"energy":{"customers":"industrial and household users","metric":"plant availability","offer":"a megawatt-hour of power","offer_bare":"megawatt-hour of power","offers":"units of power","place":"a power plant","place_bare":"power plant","process":"fuel intake to dispatch","risk":"an unplanned outage","role":"a plant operations engineer","role_bare":"plant operations engineer","roles":"plant operators","sector":"energy: oil, gas and power"},"hospitality":{"customers":"guests","metric":"occupancy rate","offer":"a room night","offer_bare":"room night","offers":"room nights","place":"a hotel","place_bare":"hotel","process":"booking to check-out","risk":"a guest complaint left unresolved","role":"a hotel manager","role_bare":"hotel manager","roles":"front-office staff","sector":"hotels, travel and leisure"},"retail":{"customers":"shoppers","metric":"sales per square metre","offer":"a shopping basket","offer_bare":"shopping basket","offers":"shopping baskets","place":"a shop","place_bare":"shop","process":"stock receipt to sale","risk":"stock running out","role":"a store manager","role_bare":"store manager","roles":"sales associates","sector":"retail and shops"},"meddevices":{"customers":"hospitals","metric":"device uptime","offer":"a device installation","offer_bare":"device installation","offers":"device installations","place":"a service centre","place_bare":"service centre","process":"order to installation and service","risk":"a device failure in use","role":"a field service engineer","role_bare":"field service engineer","roles":"service engineers","sector":"medical devices and supplies"},"pharma":{"customers":"doctors and patients","metric":"stock availability at pharmacies","offer":"a medicine pack","offer_bare":"medicine pack","offers":"medicine packs","place":"a pharmacy","place_bare":"pharmacy","process":"manufacture to pharmacy shelf","risk":"a quality deviation","role":"a medical representative","role_bare":"medical representative","roles":"pharmacists","sector":"pharma and medicines"},"realestate":{"customers":"buyers and tenants","metric":"days to close a deal","offer":"a property sale","offer_bare":"property sale","offers":"property sales","place":"a property office","place_bare":"property office","process":"enquiry to registration","risk":"a dispute over title","role":"a property consultant","role_bare":"property consultant","roles":"brokers","sector":"real estate and property"},"telecom":{"customers":"subscribers","metric":"network uptime","offer":"a broadband connection","offer_bare":"broadband connection","offers":"broadband connections","place":"a network operations centre","place_bare":"network operations centre","process":"order to activation","risk":"a network outage","role":"a network engineer","role_bare":"network engineer","roles":"field engineers","sector":"telecom and networks"},"chemicals":{"customers":"industrial customers","metric":"batch yield","offer":"a tonne of product","offer_bare":"tonne of product","offers":"tonnes of product","place":"a chemical plant","place_bare":"chemical plant","process":"batch charge to dispatch","risk":"a chemical spill","role":"a process engineer","role_bare":"process engineer","roles":"plant chemists","sector":"chemicals and materials"},"hardware":{"customers":"device makers","metric":"board yield","offer":"a circuit board","offer_bare":"circuit board","offers":"circuit boards","place":"an electronics lab","place_bare":"electronics lab","process":"design to production","risk":"a component shortage","role":"a hardware engineer","role_bare":"hardware engineer","roles":"electronics engineers","sector":"computer hardware and electronics"},"biotech":{"customers":"research partners","metric":"assay turnaround time","offer":"a lab assay","offer_bare":"lab assay","offers":"lab assays","place":"a laboratory","place_bare":"laboratory","process":"sample receipt to result","risk":"contamination of samples","role":"a research scientist","role_bare":"research scientist","roles":"lab scientists","sector":"biotech and life sciences"},"foodprod":{"customers":"retail and catering buyers","metric":"batch rejection rate","offer":"a carton of packaged food","offer_bare":"carton of packaged food","offers":"cartons of packaged food","place":"a food plant","place_bare":"food plant","process":"raw material to packed goods","risk":"a food-safety lapse","role":"a food production supervisor","role_bare":"food production supervisor","roles":"line workers","sector":"food and beverage production"},"restaurants":{"customers":"diners","metric":"table turnaround time","offer":"a meal","offer_bare":"meal","offers":"meals","place":"a restaurant","place_bare":"restaurant","process":"order to table","risk":"food wastage","role":"a restaurant owner","role_bare":"restaurant owner","roles":"cooks and servers","sector":"restaurants, cafes and catering"},"utilities":{"customers":"households and businesses","metric":"supply reliability","offer":"a new connection","offer_bare":"new connection","offers":"new connections","place":"an utility office","place_bare":"utility office","process":"application to connection and billing","risk":"a prolonged supply cut","role":"a distribution engineer","role_bare":"distribution engineer","roles":"line crews","sector":"utilities: power, water and gas supply"},"wholesale":{"customers":"retailers","metric":"days of stock","offer":"a bulk order","offer_bare":"bulk order","offers":"bulk orders","place":"a warehouse","place_bare":"warehouse","process":"order to delivery and collection","risk":"unpaid retailer credit","role":"a distributor","role_bare":"distributor","roles":"sales representatives","sector":"wholesale and distribution"},"automotive":{"customers":"vehicle buyers and dealers","metric":"defects per vehicle","offer":"a vehicle","offer_bare":"vehicle","offers":"vehicles","place":"a vehicle plant","place_bare":"vehicle plant","process":"order to vehicle delivery","risk":"a product recall","role":"a quality engineer","role_bare":"quality engineer","roles":"assembly technicians","sector":"automotive and electric vehicles"},"media":{"customers":"readers and viewers","metric":"audience reach","offer":"a news story","offer_bare":"news story","offers":"news stories","place":"a newsroom","place_bare":"newsroom","process":"pitch to publication","risk":"publishing an unverified claim","role":"an editor","role_bare":"editor","roles":"reporters","sector":"media, news and content"},"consumer":{"customers":"consumers","metric":"repeat-purchase rate","offer":"a product pack","offer_bare":"product pack","offers":"product packs","place":"a brand office","place_bare":"brand office","process":"launch to repeat purchase","risk":"a claim that cannot be proven","role":"a brand manager","role_bare":"brand manager","roles":"sales officers","sector":"consumer products and brands"},"construction":{"customers":"property owners","metric":"schedule variance","offer":"a building project","offer_bare":"building project","offers":"building projects","place":"a construction site","place_bare":"construction site","process":"design to handover","risk":"a fall from height","role":"a site engineer","role_bare":"site engineer","roles":"site supervisors","sector":"construction and building"},"education":{"customers":"learners","metric":"course completion rate","offer":"a course","offer_bare":"course","offers":"courses","place":"a school","place_bare":"school","process":"enrolment to certification","risk":"a learner falling behind unnoticed","role":"a teacher","role_bare":"teacher","roles":"teachers","sector":"education and training"},"agriculture":{"customers":"traders and food buyers","metric":"yield per acre","offer":"a quintal of produce","offer_bare":"quintal of produce","offers":"quintals of produce","place":"a farm","place_bare":"farm","process":"sowing to sale","risk":"crop loss from weather","role":"a farmer","role_bare":"farmer","roles":"farm workers","sector":"agriculture, farming and forestry"},"transequip":{"customers":"shipping and rail operators","metric":"on-time delivery","offer":"an equipment overhaul","offer_bare":"equipment overhaul","offers":"equipment overhauls","place":"a shipyard","place_bare":"shipyard","process":"order to delivery and commissioning","risk":"a weld failure","role":"a marine engineer","role_bare":"marine engineer","roles":"engineers","sector":"ships, rail, aircraft and handling equipment"},"government":{"customers":"citizens","metric":"days to approve an application","offer":"a public service application","offer_bare":"public service application","offers":"public service applications","place":"a government office","place_bare":"government office","process":"application to approval","risk":"a grievance left unanswered","role":"an administrative officer","role_bare":"administrative officer","roles":"public officials","sector":"government and public services"},"smartcities":{"customers":"residents","metric":"resolution time","offer":"a city service request","offer_bare":"city service request","offers":"city service requests","place":"a city command centre","place_bare":"city command centre","process":"request to resolution","risk":"a failure of a critical city system","role":"a smart city manager","role_bare":"smart city manager","roles":"command-centre operators","sector":"smart cities and urban development"},"water":{"customers":"households and industries","metric":"non-revenue water","offer":"a kilolitre of treated water","offer_bare":"kilolitre of treated water","offers":"kilolitres of treated water","place":"a water treatment plant","place_bare":"water treatment plant","process":"intake to supply","risk":"contamination of supply","role":"a water treatment operator","role_bare":"water treatment operator","roles":"plant operators","sector":"water and sanitation"},"waste":{"customers":"households and businesses","metric":"recycling rate","offer":"a tonne of waste collected","offer_bare":"tonne of waste collected","offers":"tonnes of waste","place":"a recycling centre","place_bare":"recycling centre","process":"collection to recycling","risk":"unsafe handling of waste","role":"a waste manager","role_bare":"waste manager","roles":"collection staff","sector":"waste, recycling and circular economy"},"climate":{"customers":"companies and investors","metric":"emissions intensity","offer":"a carbon assessment","offer_bare":"carbon assessment","offers":"carbon assessments","place":"a sustainability team","place_bare":"sustainability team","process":"data collection to disclosure","risk":"greenwashing","role":"a sustainability manager","role_bare":"sustainability manager","roles":"ESG analysts","sector":"climate and sustainability"},"cleanenergy":{"customers":"homes and businesses","metric":"capacity installed per month","offer":"a rooftop solar installation","offer_bare":"rooftop solar installation","offers":"rooftop solar installations","place":"a solar company","place_bare":"solar company","process":"site survey to commissioning","risk":"a poor-quality installation","role":"a solar project engineer","role_bare":"solar project engineer","roles":"solar technicians","sector":"clean energy and renewables"},"nature":{"customers":"pet owners and farmers","metric":"recovery rate","offer":"a veterinary consultation","offer_bare":"veterinary consultation","offers":"veterinary consultations","place":"a veterinary clinic","place_bare":"veterinary clinic","process":"appointment to follow-up","risk":"an animal-welfare lapse","role":"a veterinarian","role_bare":"veterinarian","roles":"animal carers","sector":"nature, wildlife and animals"},"space":{"customers":"space agencies and operators","metric":"test pass rate","offer":"a satellite subsystem","offer_bare":"satellite subsystem","offers":"satellite subsystems","place":"a satellite integration facility","place_bare":"satellite integration facility","process":"design to launch readiness","risk":"a launch failure","role":"a satellite engineer","role_bare":"satellite engineer","roles":"payload engineers","sector":"space and satellites"},"cyber":{"customers":"client organisations","metric":"mean time to respond","offer":"a security assessment","offer_bare":"security assessment","offers":"security assessments","place":"a security operations centre","place_bare":"security operations centre","process":"alert to resolution","risk":"a data breach","role":"a security analyst","role_bare":"security analyst","roles":"security operations analysts","sector":"cybersecurity and data protection"},"dataai":{"customers":"business users","metric":"report accuracy","offer":"an analytics report","offer_bare":"analytics report","offers":"analytics reports","place":"an analytics team","place_bare":"analytics team","process":"data request to insight","risk":"a biased model","role":"a data analyst","role_bare":"data analyst","roles":"data scientists","sector":"data, AI and analytics"},"datacentre":{"customers":"cloud customers","metric":"uptime","offer":"a server rack","offer_bare":"server rack","offers":"server racks","place":"a data centre","place_bare":"data centre","process":"provisioning to operation","risk":"a cooling failure","role":"a data centre manager","role_bare":"data centre manager","roles":"data centre technicians","sector":"data centres and cloud"},"engineering":{"customers":"industrial clients","metric":"schedule adherence","offer":"an engineering package","offer_bare":"engineering package","offers":"engineering packages","place":"an engineering office","place_bare":"engineering office","process":"enquiry to commissioning","risk":"a design error found late","role":"a project engineer","role_bare":"project engineer","roles":"design engineers","sector":"engineering and project services"},"logistics":{"customers":"shippers","metric":"order accuracy","offer":"a shipment","offer_bare":"shipment","offers":"shipments","place":"a warehouse","place_bare":"warehouse","process":"receipt to dispatch","risk":"a lost shipment","role":"a warehouse manager","role_bare":"warehouse manager","roles":"warehouse staff","sector":"logistics and supply chain"},"investment":{"customers":"investors","metric":"portfolio return after fees","offer":"an investment proposal","offer_bare":"investment proposal","offers":"investment proposals","place":"an investment office","place_bare":"investment office","process":"screening to investment and exit","risk":"concentration of risk","role":"a fund manager","role_bare":"fund manager","roles":"investment analysts","sector":"investment and capital"},"accounting":{"customers":"client businesses","metric":"days to close the books","offer":"a monthly close","offer_bare":"monthly close","offers":"monthly closes","place":"an accounting firm","place_bare":"accounting firm","process":"transactions to financial statements","risk":"an error in a filed return","role":"an accountant","role_bare":"accountant","roles":"accounts staff","sector":"accounting, audit and tax"},"legal":{"customers":"clients","metric":"turnaround time per matter","offer":"a contract review","offer_bare":"contract review","offers":"contract reviews","place":"a law firm","place_bare":"law firm","process":"instruction to advice","risk":"a missed deadline","role":"a corporate lawyer","role_bare":"corporate lawyer","roles":"lawyers","sector":"legal, compliance and governance"},"gaming":{"customers":"players","metric":"player retention","offer":"a game release","offer_bare":"game release","offers":"game releases","place":"a game studio","place_bare":"game studio","process":"concept to launch","risk":"compulsive play by young players","role":"a game producer","role_bare":"game producer","roles":"game developers","sector":"gaming, animation and immersive media"},"arts":{"customers":"audiences and patrons","metric":"audience attendance","offer":"a performance","offer_bare":"performance","offers":"performances","place":"a studio","place_bare":"studio","process":"creation to show","risk":"copying another artist's work","role":"an artist","role_bare":"artist","roles":"artists","sector":"arts, culture and heritage"},"sport":{"customers":"members","metric":"member retention","offer":"a training session","offer_bare":"training session","offers":"training sessions","place":"a gym","place_bare":"gym","process":"joining to goal achieved","risk":"a training injury","role":"a fitness coach","role_bare":"fitness coach","roles":"trainers","sector":"sport, fitness and wellbeing"},"social":{"customers":"community members","metric":"people reached","offer":"a community programme","offer_bare":"community programme","offers":"community programmes","place":"a community centre","place_bare":"community centre","process":"needs assessment to impact report","risk":"aid failing to reach those in need","role":"a programme manager","role_bare":"programme manager","roles":"field coordinators","sector":"social impact and community"}},"units":[{"id":"S1-01","strand":"S1","level":1,"title":"Habits shape futures","hook":"What you repeat every day decides where you will be in five years.","open":true,"idea":"Small actions repeated daily compound over time. A habit has a cue, a routine and a reward, so design the cue and keep the first step tiny. A new daily habit takes about 66 days on average to feel automatic, with a range from 18 to 254 days (Lally and colleagues, 2010), not the popular 21 days.","tryit":"Choose one tiny habit linked to something you already do every day (for example, after morning tea, write today's three priorities) and log it for 14 days.","caution":"A habit that serves only you can still harm others; check who else it touches.","reflection":"Which one habit, kept for a year, would change your work the most?","question":"On average, how long does a new daily habit take to feel automatic?","options":["About two months, and it varies widely","One week","Exactly 21 days"],"answer":0,"template":"For {role}, a tiny daily habit could be a two-minute check of {metric} at the start of each working day.","readings":{"book":["The Seven Habits of Highly Effective People","Stephen R. Covey","The Seven Habits: an overview (a habit joins knowledge, skill and desire)"],"free":["CORE","https://core.ac.uk/","search \"habit formation in the real world\" (Lally and others, 2010)"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","personal development"],"borrow":["Brian De Biro, Beyond Success (New York: Perigee, 1997).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S1-02","strand":"S1","level":1,"title":"Choose your response","hook":"Between what happens and what you do, there is a space, and that space is yours.","open":true,"idea":"Proactive people put their energy into what they can influence rather than what they can only worry about. Attitude is a choice renewed each day, and it shows in language: 'I will' rather than 'they made me'.","tryit":"List three current worries, mark the ones you can influence, and take one small action on one of them today.","caution":"Proactivity is not blaming others for their circumstances; some limits are real and deserve support.","reflection":"Where did you react today when you could have chosen your response?","question":"Proactive people focus mainly on...","options":["What others should do","What they cannot control","What they can influence"],"answer":2,"template":"When {roles} face the risk of {risk}, those who choose their response first ask: what part of this can I influence in the next hour?","readings":{"book":["Managing Yourself: How to achieve your personal goals in life and at work","Julie-Ann Amos","Understanding behaviour and assertiveness: responding, not reacting"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapters on perception and attitudes"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","assertiveness"],"borrow":["Assertiveness at Work, Ken and Kate Back (McGraw-Hill 1982).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S2-01","strand":"S2","level":1,"title":"Integrity is shown in actions","hook":"People follow what leaders do, not what they say.","open":true,"idea":"People will not follow leaders they think are dishonest. Small dishonest acts tend to grow into larger ones, integrity shows most in crisis and temptation, and a clear code with safeguards helps ordinary people stay honest.","tryit":"Write down one promise you made this week and keep it in a way others can see.","caution":"'Everyone does it' is the most common doorway to wrongdoing.","reflection":"Would you be comfortable if your last decision were reported in full to the people it affects?","question":"Integrity is best demonstrated by...","options":["A values poster on the wall","Statements of intention","Consistent actions, especially under pressure"],"answer":2,"template":"In {sector}, integrity can be as simple as reporting {metric} honestly even when the month looks poor.","readings":{"book":["The Bible on Leadership","Lorin Woolfe","Ch 1 Honesty and Integrity"],"free":["Business Ethics (OpenStax)","https://openstax.org/","the opening chapter on why ethics matter"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","business ethics"],"borrow":["Jeffrey L. Seglin, The Good, The Bad, and Your Business (New York: John Wiley & Sons, 2000).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S2-02","strand":"S2","level":1,"title":"Purpose gives work meaning","hook":"A clear purpose turns a routine task into a contribution.","open":true,"idea":"Purpose helps people push through obstacles. Leaders must act on purpose, not only talk about it, and link daily tasks to it. The Gita adds that work done for the good of all, and not only for personal reward, carries the deepest meaning.","tryit":"Complete the sentence 'My work helps ___ to ___' and share it with one colleague.","caution":"A purpose that excludes or harms others is not a purpose worth following.","reflection":"Who benefits when you do your job well?","question":"Which statement best links a task to its purpose?","options":["I file invoices","I file invoices so suppliers are paid on time and can pay their own staff","I do what I am told"],"answer":1,"template":"For {role}, purpose might read: my work helps {customers} receive {offers} they can trust.","readings":{"book":["The Bible on Leadership","Lorin Woolfe","Ch 2 Purpose"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapter on work motivation"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","motivation at work"],"borrow":["Lee G. Bolman and Terrence E. Deal, Leading with Soul (San Francisco: Jossey-Bass, 2001).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S3-01","strand":"S3","level":1,"title":"Ask what people need to do their best work","hook":"The most useful question a manager can ask fits in one line.","open":true,"idea":"Good managers use the least authority needed, let the best idea win whoever offers it, and regularly ask each person what they need to do their best work. They listen, then remove obstacles.","tryit":"Ask one colleague today what they need from you to do their best work, and act on one small part of the answer.","caution":"Asking without acting destroys trust faster than not asking at all.","reflection":"When did a manager last remove an obstacle for you, and what did it change?","question":"A manager who wants the best ideas should...","options":["Decide alone to save time","Let the best idea win whoever offered it","Listen only to senior staff"],"answer":1,"template":"In {place}, {role} could ask the team what slows down {process} and remove one obstacle this week.","readings":{"book":["Working in Teams: A Practical Manual for Improving Work Groups","James H. Shonk","The four factors to examine in order: goals, roles, procedures, relationships"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapter on work motivation"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","managing people"],"borrow":["Robert Townsend, Up the Organization (New York: Knopf, 1970).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S3-02","strand":"S3","level":1,"title":"Recognise people and never take their credit","hook":"Credit given freely multiplies; credit taken quietly divides.","open":true,"idea":"Make the team's work visible, thank people specifically, and celebrate effort and progress as well as outcomes. Humility raises a leader's credibility.","tryit":"Send one specific thank-you note that names what the person did and the difference it made.","caution":"Praise used only as a tool to extract more work is manipulation, and people sense it.","reflection":"Whose work made your last success possible?","question":"Effective recognition is...","options":["Specific, timely and sincere","Reserved for top performers only","General and once a year"],"answer":0,"template":"{role} can thank a colleague by name for keeping {metric} on track, and say what it made possible for {customers}.","readings":{"book":["The Bible on Leadership","Lorin Woolfe","Ch 4 Humility"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapter on performance appraisal and rewards"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","recognition at work"],"borrow":["Tom Peters and Nancy Austin, A Passion for Excellence (New York: Random House, 1985).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S4-01","strand":"S4","level":1,"title":"Speak to be understood","hook":"Clarity is a courtesy to your listener.","open":true,"idea":"Decide the one message you want remembered. Vary pace, pitch and pauses, avoid a monotone, and repeat the core idea in different words. Face-to-face conversation still carries the most weight.","tryit":"Before your next meeting, write your message in one sentence of fewer than 20 words.","caution":"Clarity is for informing people, never for hiding the facts that matter to them.","reflection":"What one sentence do you want people to remember from you this week?","question":"A strong talk usually begins with...","options":["Clarity about the one message to be remembered","Speaking as fast as possible","Reading every slide aloud"],"answer":0,"template":"{role} explaining a change in {process} to {customers} could open with one sentence on what changes for them.","readings":{"book":["How to Communicate at Work: Making a success of your working relationships","Ann Dobson","Let's communicate: being clear, accurate and concise"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapter on communication"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","communication skills"],"borrow":["The Complete Plain Words, Sir Ernest Gowers (Pelican).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S4-02","strand":"S4","level":1,"title":"Build rapport with respect","hook":"Rapport grows when people feel at ease, not watched.","open":true,"idea":"Read signals in clusters and in context, never one gesture alone. Open palms, facing people and gentle mirroring can build rapport, meanings differ across cultures, and personal space deserves respect. People detect lies from behaviour at about 54 per cent, close to chance (Bond and DePaulo, 2006), so body language is no guide to honesty.","tryit":"In your next one-to-one conversation, sit beside or at an angle to the other person rather than directly opposite.","caution":"Never use body language to judge honesty, or to screen people in hiring or assessment.","reflection":"When did you feel most at ease in a meeting, and why?","question":"Which statement is supported by research?","options":["93 per cent of meaning is always non-verbal","Gestures reliably reveal lies","Signals must be read in clusters and context, and cultures differ"],"answer":2,"template":"When meeting {customers} in {place}, {role} can choose seating that feels cooperative rather than confrontational.","readings":{"book":["How to Communicate at Work: Making a success of your working relationships","Ann Dobson","How to use body language: showing respect and enthusiasm"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapter on communication (non-verbal signals)"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","interpersonal communication"],"borrow":["Carnegie, D., How to Win Friends and Influence People, Angus and Robertson, Sydney, 1965.","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S5-01","strand":"S5","level":1,"title":"Interests, not positions","hook":"Behind every demand there is a reason; find it.","open":true,"idea":"Principled negotiation separates the people from the problem, focuses on interests rather than positions, creates options for mutual gain and relies on fair, objective standards. Spend about as long preparing as negotiating, and look for an outcome where both sides gain, or agree not to deal.","tryit":"Before your next negotiation, write the other side's three likely interests and one objective standard you could both accept.","caution":"Winning by deceiving the other side is not negotiation; it is a debt that falls due later.","reflection":"What did the other party in your last negotiation actually need?","question":"Principled negotiation focuses on...","options":["Splitting the difference at once","Positions and pressure","Interests and objective standards"],"answer":2,"template":"When {customers} ask for a lower price on {offers}, {role} can ask what lies behind the request: budget timing, risk, or a comparison with another supplier.","readings":{"book":["Conducting Effective Negotiations: How to get the deal you want","Patrick Forsyth","Preparing objectives as a range, then trading variables"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapter on conflict and negotiations"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","negotiation"],"borrow":["Fisher, Roger, and William Ury. Getting to Yes. New York: Penguin Books, 1981.","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S6-01","strand":"S6","level":1,"title":"Know your costs: fixed, variable and mixed","hook":"You cannot price well until you know which costs move with volume.","open":true,"idea":"Variable costs rise with each unit, fixed costs stay level within a normal range of activity, and mixed costs contain both. Product costs differ from period costs. Sunk costs are already spent and should not drive new decisions.","tryit":"List five costs in your work and label each fixed, variable or mixed.","caution":"A cost model is a simplification; check it against real bills.","reflection":"Which cost do you treat as fixed that actually moves?","question":"A sunk cost is...","options":["A cost to include in every decision","Money already spent that cannot be recovered and should not drive a new decision","A type of variable cost"],"answer":1,"template":"For each {offer_bare}, list which costs rise with every one delivered and which stay the same each month in {place}.","readings":{"book":["Cost Concepts (slide deck)","publisher textbook slides","The whole deck: fixed, variable and mixed costs"],"free":["Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)","https://openstax.org/","the chapter on the building blocks of managerial accounting"],"course":["Khan Academy","https://www.khanacademy.org/","fixed and variable costs"],"borrow":["Garrison, Ray, and Eric Noreen, Managerial Accounting, 8th ed. (New York: McGraw-Hill, 1999).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S6-02","strand":"S6","level":1,"title":"Contribution margin and break-even","hook":"Every sale pays its own way first, then helps pay the rent.","open":true,"idea":"Contribution margin is price minus variable cost per unit. Break-even volume is fixed costs divided by the contribution per unit. The margin of safety shows how far sales can fall before a loss.","tryit":"Work out the break-even volume for one product or service using real numbers.","caution":"Break-even assumes stable prices and costs; test what happens if either moves by ten per cent.","reflection":"How far above break-even is your work today?","question":"Price 100, variable cost 60 and fixed costs of 4,000 a month give a break-even of...","options":["100 units","66 units","40 units"],"answer":0,"template":"Take one {offer_bare}: note its price, subtract the variable cost of delivering it, and divide the monthly fixed costs of {place} by the result to find the break-even volume.","readings":{"book":["The Portable MBA in Finance and Accounting","John Leslie Livingstone and Theodore Grossman (editors)","Ch 3 Cost-Volume-Profit Analysis"],"free":["Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)","https://openstax.org/","the chapter on cost-volume-profit analysis"],"course":["Khan Academy","https://www.khanacademy.org/","break-even point"],"borrow":["Horngren, Charles, Cost Accounting: A Managerial Emphasis, 9th ed. (Upper Saddle River, NJ: Prentice-Hall, 1998).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S7-01","strand":"S7","level":1,"title":"Profit is not cash","hook":"Many profitable businesses fail because they run out of cash.","open":true,"idea":"The income statement shows profit, the balance sheet shows what is owned and owed, and the cash flow statement shows cash in and out. Growth ties up cash in stock and customer credit, so the timing of cash matters as much as profit.","tryit":"List when money comes into and goes out of your unit next month, week by week.","caution":"A business that reports profit consistently above its operating cash flow deserves careful questions.","reflection":"How many weeks of costs could your unit cover from cash today?","question":"A fast-growing firm can run short of cash because...","options":["Stock and customer credit absorb cash before customers pay","Banks never lend to growing firms","Profit always equals cash"],"answer":0,"template":"In {sector}, cash can be tied up between delivering {offers} and the day {customers} actually pay.","readings":{"book":["Beginners' Guide to Financial Statements","U.S. Securities and Exchange Commission","The cash flow statement and how it differs from the income statement"],"free":["Principles of Accounting, Volume 1: Financial Accounting (OpenStax)","https://openstax.org/","the chapter on the statement of cash flows"],"course":["Khan Academy","https://www.khanacademy.org/","cash flow statement"],"borrow":["Tracy, John A., How to Read a Financial Report: Wringing Cash Flow and Other Vital Signs Out of the Numbers, 4th ed. (New York: John Wiley, 1994).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S7-02","strand":"S7","level":1,"title":"Budgets that help, not hurt","hook":"A budget is a plan with numbers, not a weapon.","open":true,"idea":"Good budgets serve the goals of the organisation, are realistic rather than wishful, are built with the people who deliver them, and are reviewed against actual results so that gaps point to where attention is needed.","tryit":"Compare last month's plan with actual results for three lines and write one reason for each gap.","caution":"Budgets used only to deny resources or to punish people breed padding and gaming.","reflection":"What would you change in the way your team budgets?","question":"Participative budgeting mainly helps to...","options":["Avoid reviews","Hide costs","Build commitment and realism"],"answer":2,"template":"{role} could compare planned and actual {metric} for last month and explain each gap in one line.","readings":{"book":["The Portable MBA in Finance and Accounting","John Leslie Livingstone and Theodore Grossman (editors)","Ch 6 Forecasts and Budgets"],"free":["Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)","https://openstax.org/","the chapter on budgeting"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","budgeting"],"borrow":["Budgeting for the Non-Financial Manager, I Maitland (Pitman Publishing, 1995).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S8-01","strand":"S8","level":1,"title":"Pay yourself first, automatically","hook":"Save before you spend, not after.","open":true,"idea":"Income is not wealth. Setting aside a fixed share of income automatically on payday, often 10 to 15 per cent, works better than relying on willpower, and small daily spending leaks add up over the years.","tryit":"Work out what one small daily expense costs you over a full year.","caution":"Growth illustrations assume returns that are not guaranteed, and inflation and fees reduce them; this unit is education, not personal advice.","reflection":"What would an automatic saving of ten per cent change for you in five years?","question":"'Pay yourself first' means...","options":["Invest only in property","Spend first and save what is left","Set aside savings automatically before spending"],"answer":2,"template":"Someone working in {sector} and paid monthly could set a standing instruction to move savings on payday, before any spending.","readings":{"book":["The Automatic Millionaire","David Bach","The chapter on paying yourself first, automatically"],"free":["Open Textbook Library (University of Minnesota)","https://open.umn.edu/opentextbooks/","search \"personal finance\" (several open textbooks)"],"course":["Khan Academy","https://www.khanacademy.org/","financial literacy"],"borrow":["Griffith, William C., Bill Griffith's 10 Steps to Financial Prosperity, Probus Publishing, Illinois, 1994.","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S8-02","strand":"S8","level":1,"title":"Build a safety cushion","hook":"An emergency fund turns a crisis into an inconvenience.","open":true,"idea":"Keep several months of essential costs, commonly three to six, somewhere safe and accessible before taking investment risks. Avoid high-interest debt, and list any debts so they can be paid down in a clear order.","tryit":"Total your essential monthly costs and set a first target of one month's cushion.","caution":"Quick-fix debt schemes and promises of guaranteed returns are warning signs.","reflection":"How long could you manage if your income stopped today?","question":"A common guide for an emergency fund is...","options":["One week of costs","Three to six months of essential costs","No fund if you have a credit card"],"answer":1,"template":"For people in {sector} whose income varies with the season or the order book, a larger cushion may be wise.","readings":{"book":["Managing Your Personal Finances: How to achieve financial security and survive the shrinking welfare state","John Claxton","Managing your financial strategy: accumulating an emergency fund"],"free":["Open Textbook Library (University of Minnesota)","https://open.umn.edu/opentextbooks/","search \"personal finance\": the chapter on saving"],"course":["Khan Academy","https://www.khanacademy.org/","emergency fund"],"borrow":["Rutherford, Stuart, The Poor and Their Money, Oxford University Press, New Delhi, 2000.","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S9-01","strand":"S9","level":1,"title":"Know your market and your customer","hook":"Strategy starts outside the building.","open":true,"idea":"Study the market, competitors and customer needs before planning. The marketing plan follows from the strategic plan, consistent messages repeated across channels build a clear image, and the best organisations look at themselves from the outside in.","tryit":"Write down three needs of your customers and how your offer meets each one.","caution":"Never win customers with claims you cannot prove.","reflection":"What does your customer value that you have never asked about?","question":"Outside-in thinking starts with...","options":["Our internal processes","The customer's view of value","Last year's budget"],"answer":1,"template":"Ask three {customers} what they value most in {offers}, and compare the answers with what {place} measures today.","readings":{"book":["Preparing a Business Plan: How to lay the right foundations for business success","Matthew Record","The market: defining your market, researching and segmenting your clients"],"free":["Principles of Marketing (OpenStax)","https://openstax.org/","the chapters on segmentation and marketing research"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","marketing"],"borrow":["Stauffer, David. The Power of Competitive Intelligence. Cambridge: Harvard Business School Publishing, 2003.","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S9-02","strand":"S9","level":1,"title":"Think big, step small","hook":"Big goals and small daily steps are partners, not rivals.","open":true,"idea":"Stretch goals invite people to ask how good they could be, and they are reached through steady small improvements. A one per cent gain each day compounds in theory, though real progress is rarely smooth. People should not be punished for falling short of a stretch.","tryit":"Set one stretch target and the smallest first step you can take today.","caution":"Stretch without support turns into pressure that pushes people to cut corners.","reflection":"What would you attempt if you knew you would be supported if you fell short?","question":"Stretch targets work best when...","options":["People are supported and not punished for falling short","They are kept secret","Missing them is punished"],"answer":0,"template":"{role} could set a stretch goal for {metric} and agree with the team that the learning counts even if the goal is missed.","readings":{"book":["The Jack Welch Lexicon of Leadership","Jeffrey A. Krames","Entry: Stretch and Stretch Goals"],"free":["Principles of Management (OpenStax)","https://openstax.org/","the chapter on planning and goal setting"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","goal setting"],"borrow":["Managing Growth, M Bennett (Pitman Publishing, 1991).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S10-01","strand":"S10","level":1,"title":"See the whole process, from lead to cash","hook":"Customers experience one journey, not your departments.","open":true,"idea":"A typical end-to-end flow runs from lead generation through opportunity, quotation, order, delivery, invoicing and cash collection to customer support. Supporting processes such as accounts, contracts, pricing and partners feed it, and the handoffs are where errors hide.","tryit":"Draw the steps one customer request passes through in your unit, and circle the slowest handoff.","caution":"A process that is efficient for us but unfair to the customer is not a good process.","reflection":"Which handoff in your process loses the most time?","question":"In a lead-to-cash flow, which step comes straight after the order?","options":["Delivery and logistics","Opportunity screening","Lead generation"],"answer":0,"template":"Follow one request for {offer} from first enquiry to payment and note each handoff in {process}.","readings":{"book":["Introducing the Business Letter (three parts)","author not stated","The letter for each sales step: enquiry, quotation, order, acknowledgement, invoice, statement"],"free":["Principles of Accounting, Volume 1: Financial Accounting (OpenStax)","https://openstax.org/","the chapter on accounting information systems"],"course":["Vendor academy: ERP learning journeys","","order to cash"],"borrow":["Kalakota, R., and M. Robinson, E-Business 2.0 (Boston: Addison-Wesley, 2000).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S10-02","strand":"S10","level":1,"title":"Simplify before you automate","hook":"Automating a messy process gives you a faster mess.","open":true,"idea":"Remove unnecessary steps, forms and approvals first, keep layers few, and ask the people doing the work which steps add no value. Only then digitise.","tryit":"Name one report or approval in your work that no one uses, and propose removing it.","caution":"Never remove a control that protects people's safety, money or privacy just to go faster.","reflection":"Which one step would you delete tomorrow if you could?","question":"Before automating a process, you should first...","options":["Add more approvals","Buy software","Simplify it and remove unnecessary steps"],"answer":2,"template":"In {process}, list each approval and ask whether it protects {customers} or only slows down {offers}.","readings":{"book":["29 Leadership Secrets from Jack Welch","Robert Slater","Leadership Secret 3: Managing Less Is Managing Better"],"free":["Introduction to Business (OpenStax)","https://openstax.org/","the chapter on operations management"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","lean processes"],"borrow":["Biolos, Jim. Six Sigma Meets the Service Economy. Boston: Harvard Business School Press, 2002.","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S11-01","strand":"S11","level":1,"title":"Learn from anywhere: copy with pride","hook":"A good idea is welcome whatever its origin.","open":true,"idea":"Learning organisations import best practices freely, reject the 'not invented here' attitude, share information widely and reward people who spread good ideas, always crediting the source.","tryit":"Find one good practice in another team or sector and adapt it to your work this week, noting where it came from.","caution":"Learning from others never means copying protected work without permission or credit.","reflection":"What is the best idea you borrowed this year, and from whom?","question":"'Not invented here' describes...","options":["A safety procedure","Rejecting good ideas because they came from outside","A patent rule"],"answer":1,"template":"{role} could adopt a practice from another sector to improve {metric}, and credit the source in the team notes.","readings":{"book":["The Jack Welch Lexicon of Leadership","Jeffrey A. Krames","Entries: Best Practice and Horizontal Learning"],"free":["OER Commons","https://www.oercommons.org/","how open educational resources may be reused under their licences"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","learning to learn"],"borrow":["Peter Senge, The Fifth Discipline (New York: Currency/Doubleday, 1990).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S11-02","strand":"S11","level":1,"title":"Learn by doing: Author, Train, Learn, Earn","hook":"You learn something twice when you teach it once.","open":true,"idea":"In the ATLE™ cycle a person learns a unit, applies it, earns by using it, then trains others and authors new material from experience. Learning by doing has more impact than lectures, and stretching assignments build leaders.","tryit":"Teach one idea from this unit to a colleague in five minutes.","caution":"Teach only what you have checked; passing on errors multiplies them.","reflection":"What could you teach someone else this month?","question":"In the ATLE™ cycle, which step builds new material from experience?","options":["Learn","Author","Earn"],"answer":1,"template":"After applying this unit to {process}, {role} could record a two-minute tip for new colleagues in {place}.","readings":{"book":["DIY ATLE™ Workflow: sign-up, sign-on, author, trainer, learner and earner pages","HFL Global Investments","The six ATLE™ stages, from sign-up to the earner marketplace"],"free":["BCcampus Open Textbooks","https://open.bccampus.ca/","search \"Teaching in a Digital Age\" (Bates), open textbook"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","learning design"],"borrow":["Noel Tichy, The Leadership Engine (New York: Harper Business, 1997).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S12-01","strand":"S12","level":1,"title":"Brilliance without character","hook":"Talent without character is a powerful car without brakes.","open":true,"idea":"A list of seven social dangers, first published in 1925 and made famous by Gandhi, names wealth without work, pleasure without conscience, knowledge without character, commerce without morality, science without humanity, worship without sacrifice and politics without principle. Every skill in this course needs character beside it.","tryit":"Choose the item on the list most relevant to your work and write how you will guard against it.","caution":"Use these lessons to protect people, never to judge or shame them.","reflection":"Which of your strengths could cause harm if used without care?","question":"'Knowledge without character' appears in...","options":["A list of seven social dangers published in 1925 and made famous by Gandhi","A law of physics","An accounting standard"],"answer":0,"template":"In {sector}, ask: could our skill in {process} ever be used against {customers}? What stops that from happening?","readings":{"book":["You Can Win","Shiv Khera","The chapters on character and values"],"free":["Business Ethics (OpenStax)","https://openstax.org/","the opening chapter on why ethics matter"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","ethics"],"borrow":["Lowenstein, Roger, When Genius Failed: The Rise and Fall of Long-Term Capital Management (New York: Random House, 2000).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S12-02","strand":"S12","level":1,"title":"The small lie grows","hook":"Large frauds usually begin as small, 'harmless' shortcuts.","open":true,"idea":"Small dishonest acts tend to lead to bigger ones. Pressure for numbers, fear and silence let them grow, and a safe, known way to raise concerns stops them early.","tryit":"Find out how a concern can be raised safely in your organisation; if there is no way, propose one.","caution":"Speaking up should be protected; retaliation is itself misconduct.","reflection":"What small shortcut have you seen become normal?","question":"What helps most to stop small wrongdoing from growing?","options":["A safe and known way to raise concerns","Higher targets","Silence"],"answer":0,"template":"In {place}, a small change to how {metric} is recorded can become a habit of misreporting unless someone asks why.","readings":{"book":["MBA in a Day","Steven Stralser","Ch 4 Ethics"],"free":["Principles of Accounting, Volume 1: Financial Accounting (OpenStax)","https://openstax.org/","the chapter on fraud, internal controls and cash"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","fraud prevention"],"borrow":["Petrick, Joseph A., and Robert F. Scherer. \"The Enron Scandal and the Neglect of Management Integrity Capacity.\" Mid-American Journal of Business (Spring 2003).","Ask your public library for its magazine and journal databases; search CORE or DOAJ for an open version."],"note":""}},{"id":"S12-03","strand":"S12","level":1,"title":"Pride before the fall","hook":"The higher you rise, the more you need humility.","open":true,"idea":"Wisdom traditions agree that arrogance, greed and contempt for others lead to ruin. The Gita contrasts fearlessness, truth, compassion and patience with anger, greed, cunning and pride, and as power grows, so does the effect of a leader's mistakes.","tryit":"Ask one person you trust to tell you one thing you could do better, and thank them.","caution":"Humility is not weakness; it is strength used for others.","reflection":"When did success last make you less willing to listen?","question":"As a leader rises, the need for humility...","options":["Does not matter","Decreases","Increases, because mistakes have larger effects"],"answer":2,"template":"Successful {roles} who stop listening to {customers} are often the last to notice the risk of {risk}.","readings":{"book":["The Bible on Leadership","Lorin Woolfe","Ch 4 Humility"],"free":["Organizational Behavior (OpenStax)","https://openstax.org/","the chapter on power and political behaviour"],"course":["OpenLearn (The Open University)","https://www.open.edu/openlearn/","leadership"],"borrow":["Manfred Kets De Vries, The Leadership Mystique (London: Prentice Hall, 2001).","Borrow: search WorldCat for the nearest copy, check Open Library lending, or ask your public library for an inter-library loan."],"note":""}},{"id":"S1-03","strand":"S1","level":2,"title":"Put first things first","hook":"Urgent is loud; important is quiet.","open":false},{"id":"S1-04","strand":"S1","level":2,"title":"Equanimity: steady in success and failure","hook":"Do the work fully; hold the results lightly.","open":false},{"id":"S2-03","strand":"S2","level":2,"title":"Live the values, then make the numbers","hook":"Results bought by breaking values cost more later.","open":false},{"id":"S2-04","strand":"S2","level":2,"title":"Work for the good of all","hook":"Whatever the best people do, others follow.","open":false},{"id":"S3-03","strand":"S3","level":2,"title":"Fair consequences, firm and kind","hook":"High standards and real care strengthen each other.","open":false},{"id":"S3-04","strand":"S3","level":2,"title":"Build complementary teams","hook":"A team of stars is not a star team.","open":false},{"id":"S4-03","strand":"S4","level":2,"title":"Listen first, then be understood","hook":"Diagnose before you prescribe.","open":false},{"id":"S4-04","strand":"S4","level":2,"title":"Persuade honestly","hook":"Persuasion serves the listener; manipulation serves only the speaker.","open":false},{"id":"S5-03","strand":"S5","level":2,"title":"Account plans and the people map","hook":"Know who decides, who influences and who may block.","open":false},{"id":"S5-04","strand":"S5","level":2,"title":"Price with contribution in mind","hook":"A big order at the wrong price can make you poorer.","open":false},{"id":"S6-03","strand":"S6","level":2,"title":"Relevant costs: what changes with the decision?","hook":"Only future costs that differ between the options matter.","open":false},{"id":"S6-04","strand":"S6","level":2,"title":"Make or buy?","hook":"Doing it yourself is not always cheaper.","open":false},{"id":"S7-03","strand":"S7","level":2,"title":"Flexible budgets and variances","hook":"Compare like with like: actual cost at actual volume.","open":false},{"id":"S7-04","strand":"S7","level":2,"title":"Read the key ratios","hook":"A few ratios tell most of the story.","open":false},{"id":"S8-03","strand":"S8","level":2,"title":"Debt with discipline","hook":"Debt is a tool that cuts both ways.","open":false},{"id":"S8-04","strand":"S8","level":2,"title":"Give, and save for the long run","hook":"Generosity and saving can both be automatic.","open":false},{"id":"S9-03","strand":"S9","level":2,"title":"Clarity about where to lead","hook":"Be clear which offers you will grow, fix or stop.","open":false},{"id":"S9-04","strand":"S9","level":2,"title":"Break down boundaries","hook":"The best ideas often sit across a boundary.","open":false},{"id":"S10-03","strand":"S10","level":2,"title":"Quality is everyone's job","hook":"Quality is designed in, not inspected in.","open":false},{"id":"S10-04","strand":"S10","level":2,"title":"Projects: scope, schedule and risk","hook":"All project management is risk management.","open":false},{"id":"S11-04","strand":"S11","level":2,"title":"Mentoring in both directions","hook":"Newer colleagues can teach senior ones too.","open":false},{"id":"S12-04","strand":"S12","level":2,"title":"Persuasion or manipulation?","hook":"The line is crossed when you would hide your method.","open":false},{"id":"S12-05","strand":"S12","level":2,"title":"When the crowd stops thinking","hook":"Crowds can feel without reasoning.","open":false},{"id":"S12-06","strand":"S12","level":2,"title":"Hard numbers, human cost","hook":"People are not the bottom ten per cent of a spreadsheet.","open":false},{"id":"S1-05","strand":"S1","level":3,"title":"Renew yourself in four ways","hook":"A blunt saw cuts slowly; take time to sharpen it.","open":false},{"id":"S1-06","strand":"S1","level":3,"title":"Begin with the end in mind","hook":"Write the story you want told about you.","open":false},{"id":"S2-05","strand":"S2","level":3,"title":"Courage: act despite fear","hook":"Courage is not the absence of fear.","open":false},{"id":"S2-06","strand":"S2","level":3,"title":"Justice and fairness","hook":"People who feel treated unfairly stop giving their best.","open":false},{"id":"S3-05","strand":"S3","level":3,"title":"Clear the clutter together","hook":"The people closest to the work know where it is broken.","open":false},{"id":"S3-06","strand":"S3","level":3,"title":"Hire for values and potential","hook":"Recruitment is a funnel: wide at the top, careful at the bottom.","open":false},{"id":"S4-05","strand":"S4","level":3,"title":"Speak to groups with presence","hook":"Presence comes from preparation and conviction.","open":false},{"id":"S4-06","strand":"S4","level":3,"title":"Communicate change and bad news","hook":"People forgive bad news far more readily than hidden news.","open":false},{"id":"S5-05","strand":"S5","level":3,"title":"Handle tough tactics calmly","hook":"When the other side plays dirty, stay principled and steady.","open":false},{"id":"S6-05","strand":"S6","level":3,"title":"Special orders and limited capacity","hook":"Spare capacity changes the arithmetic.","open":false},{"id":"S6-06","strand":"S6","level":3,"title":"Estimate costs from data","hook":"Two points are a guess; many points are evidence.","open":false},{"id":"S7-05","strand":"S7","level":3,"title":"Investment decisions: net present value first","hook":"A project should create more value than it costs, in today's money.","open":false},{"id":"S7-06","strand":"S7","level":3,"title":"Quality of earnings and the month-end close","hook":"Clean books are built every month, not at audit time.","open":false},{"id":"S8-05","strand":"S8","level":3,"title":"Home buying: weigh the full cost","hook":"A home is a place to live first and an investment second.","open":false},{"id":"S8-06","strand":"S8","level":3,"title":"Teach money habits at home","hook":"Children learn more from what we do than from what we say.","open":false},{"id":"S9-05","strand":"S9","level":3,"title":"Growth by acquisition: mind the odds","hook":"On average, acquisitions have not created value for the buyer's shareholders.","open":false},{"id":"S9-06","strand":"S9","level":3,"title":"Services and solutions","hook":"Customers buy outcomes, not products.","open":false},{"id":"S10-05","strand":"S10","level":3,"title":"Information systems for decisions","hook":"Data is only useful when it changes a decision.","open":false},{"id":"S10-06","strand":"S10","level":3,"title":"Adoption: from awareness to habit","hook":"A system nobody uses is the most expensive system of all.","open":false},{"id":"S11-06","strand":"S11","level":3,"title":"Give learning a rhythm","hook":"Learning spreads when it has a regular rhythm.","open":false},{"id":"S12-07","strand":"S12","level":3,"title":"When charisma turns dark","hook":"A gifted voice can lead millions toward ruin.","open":false},{"id":"S12-08","strand":"S12","level":3,"title":"Numbers that lie","hook":"Creative accounting is borrowing from the future.","open":false},{"id":"S12-09","strand":"S12","level":3,"title":"Dark patterns in digital products","hook":"Design can respect people or trap them.","open":false},{"id":"S1-07","strand":"S1","level":4,"title":"Inner steadiness for leaders","hook":"Calm at the centre lets you act well at the edges.","open":false},{"id":"S1-08","strand":"S1","level":4,"title":"Work suited to your nature","hook":"Excellence comes most easily through work that fits who you are.","open":false},{"id":"S2-07","strand":"S2","level":4,"title":"Governance and the board","hook":"Good boards ask hard questions early.","open":false},{"id":"S2-08","strand":"S2","level":4,"title":"Shared wisdom, respectfully","hook":"Many traditions teach the same virtues in different words.","open":false},{"id":"S3-07","strand":"S3","level":4,"title":"Develop successors","hook":"A leader's legacy lives in the leaders they leave behind.","open":false},{"id":"S3-08","strand":"S3","level":4,"title":"Manage smart experts","hook":"Experts need a manager who clears the road, not one who drives the car.","open":false},{"id":"S4-07","strand":"S4","level":4,"title":"Communicate across cultures","hook":"Meaning lives in the listener's culture as much as in your words.","open":false},{"id":"S4-08","strand":"S4","level":4,"title":"Language that respects people","hook":"The words we use about people shape how we treat them.","open":false},{"id":"S5-08","strand":"S5","level":4,"title":"Customer support as a growth engine","hook":"Every support case is a chance to keep or lose a customer.","open":false},{"id":"S6-07","strand":"S6","level":4,"title":"Activity-based costing for strategy","hook":"Traditional costing can hide which customers and products lose money.","open":false},{"id":"S6-08","strand":"S6","level":4,"title":"Joint products: sell or process further?","hook":"Joint costs are already spent when you decide what to do next.","open":false},{"id":"S7-07","strand":"S7","level":4,"title":"Business valuation basics","hook":"Value depends on who is buying and why.","open":false},{"id":"S7-08","strand":"S7","level":4,"title":"Managing financial risk","hook":"Risk you cannot avoid, you can measure and share.","open":false},{"id":"S8-07","strand":"S8","level":4,"title":"Financial wellbeing at work","hook":"Money worries walk into work every morning.","open":false},{"id":"S8-08","strand":"S8","level":4,"title":"Lasting wealth with character","hook":"Wealth built slowly tends to last; wealth grabbed quickly tends to vanish.","open":false},{"id":"S9-07","strand":"S9","level":4,"title":"Global strategy","hook":"Markets are global even when a company is local.","open":false},{"id":"S11-07","strand":"S11","level":4,"title":"Author units from experience","hook":"Your experience can become someone else's shortcut.","open":false},{"id":"S11-08","strand":"S11","level":4,"title":"Evidence literacy","hook":"A confident claim is not evidence.","open":false},{"id":"S12-10","strand":"S12","level":4,"title":"Power and the ego","hook":"Acting mightily, but only for yourself, is the oldest trap.","open":false},{"id":"S12-11","strand":"S12","level":4,"title":"AI with a conscience","hook":"AI should serve people, not steer them in secret.","open":false},{"id":"S12-12","strand":"S12","level":4,"title":"Build conscience into systems","hook":"Good intentions fade; good systems remember.","open":false}],"pathways":[{"id":"CP1","name":"Self and habits","audience":"Everyone, first pathway","units":["S1-01","S1-02","S2-01","S2-02","S12-01","S12-02","S12-03","S1-03","S1-04","S2-03","S2-04","S12-04","S12-05","S12-06","S1-05","S1-06","S2-05","S2-06","S12-07","S12-08","S12-09","S1-07","S1-08","S2-07","S2-08","S12-10","S12-11","S12-12"]},{"id":"CP2","name":"People leader","audience":"Team leaders and managers","units":["S3-01","S3-02","S4-01","S4-02","S11-01","S11-02","S12-01","S12-02","S12-03","S3-03","S3-04","S4-03","S4-04","S11-04","S12-04","S12-05","S12-06","S3-05","S3-06","S4-05","S4-06","S11-06","S12-07","S12-08","S12-09","S3-07","S3-08","S4-07","S4-08","S11-07","S11-08","S12-10","S12-11","S12-12"]},{"id":"CP3","name":"Customer and commercial","audience":"Sales, account and business development roles","units":["S4-01","S4-02","S5-01","S9-01","S9-02","S12-01","S12-02","S12-03","S4-03","S4-04","S5-03","S5-04","S9-03","S9-04","S12-04","S12-05","S12-06","S4-05","S4-06","S5-05","S9-05","S9-06","S12-07","S12-08","S12-09","S4-07","S4-08","S5-08","S9-07","S12-10","S12-11","S12-12"]},{"id":"CP4","name":"Numbers for managers","audience":"Managers, entrepreneurs, finance learners","units":["S6-01","S6-02","S7-01","S7-02","S12-01","S12-02","S12-03","S6-03","S6-04","S7-03","S7-04","S12-04","S12-05","S12-06","S6-05","S6-06","S7-05","S7-06","S12-07","S12-08","S12-09","S6-07","S6-08","S7-07","S7-08","S12-10","S12-11","S12-12"]},{"id":"CP5","name":"Money habits for life","audience":"Every earner, families, members","units":["S1-01","S1-02","S8-01","S8-02","S12-01","S12-02","S12-03","S1-03","S1-04","S8-03","S8-04","S12-04","S12-05","S12-06","S1-05","S1-06","S8-05","S8-06","S12-07","S12-08","S12-09","S1-07","S1-08","S8-07","S8-08","S12-10","S12-11","S12-12"]},{"id":"CP6","name":"ERP, CRM and MIS practitioner","audience":"System users, administrators, implementation consultants","units":["S6-01","S6-02","S7-01","S7-02","S10-01","S10-02","S11-01","S11-02","S12-01","S12-02","S12-03","S6-03","S6-04","S7-03","S7-04","S10-03","S10-04","S11-04","S12-04","S12-05","S12-06","S6-05","S6-06","S7-05","S7-06","S10-05","S10-06","S11-06","S12-07","S12-08","S12-09","S6-07","S6-08","S7-07","S7-08","S11-07","S11-08","S12-10","S12-11","S12-12"]},{"id":"CP7","name":"Marketplace provider","audience":"Providers, distributors, affiliates and channels","units":["S5-01","S10-01","S10-02","S12-01","S12-02","S12-03","S5-03","S5-04","S10-03","S10-04","S12-04","S12-05","S12-06","S5-05","S10-05","S10-06","S12-07","S12-08","S12-09","S5-08","S12-10","S12-11","S12-12"]},{"id":"CP8","name":"Workplace team","audience":"Every employee and team","units":["S3-01","S3-02","S10-01","S10-02","S11-01","S11-02","S12-01","S12-02","S12-03","S3-03","S3-04","S10-03","S10-04","S11-04","S12-04","S12-05","S12-06","S3-05","S3-06","S10-05","S10-06","S11-06","S12-07","S12-08","S12-09","S3-07","S3-08","S11-07","S11-08","S12-10","S12-11","S12-12"]}],"anchors":[{"id":"work-plan-day","area":"work","label":"Plan my day","line":"Three things that matter today, in order, with a time for each.","times":["morning"],"unit":"S1-01"},{"id":"work-sector-news","area":"work","label":"News in my sector","line":"Five lines on what changed in my line of work, and what it means for me.","times":["morning","day"],"unit":"S11-01"},{"id":"work-reply-customer","area":"work","label":"Reply to a customer","line":"A clear, polite answer, as an email and as a short message.","times":["morning","day","evening"],"unit":"S4-02"},{"id":"work-proposal","area":"work","label":"Write a proposal","line":"A proposal of at most 600 words, with every price left blank for me.","times":["day"],"unit":"S5-01"},{"id":"work-post","area":"work","label":"Post for my business","line":"Posts for my business pages, in my own voice.","times":["morning","day","evening"],"unit":"S2-02"},{"id":"work-numbers","area":"work","label":"Cost, price and return","line":"A simple table of cost, price and return, with blanks for my figures.","times":["day"],"unit":"S6-02","also":"breakeven"},{"id":"work-meeting","area":"work","label":"Prepare a meeting","line":"An agenda, the points to make and the questions to ask.","times":["morning","day"],"unit":"S4-01"},{"id":"work-find-work","area":"work","label":"Find work","line":"Roles, projects and assignments that pay, in my sector.","times":["morning","day","evening"],"unit":"S9-01"},{"id":"work-sell","area":"work","label":"Sell in the marketplace","line":"List what I make or do, and find buyers.","times":["day","evening"],"unit":"S10-01"},{"id":"work-skill","area":"work","label":"Learn a work skill","line":"A short course for my role, at my own pace.","times":["morning","day","evening"],"reflect":"Which one skill, practised for five minutes a day, would help your work the most this month?","also":"next"},{"id":"work-career","area":"work","label":"My next career step","line":"The path from where I am to the next role.","times":["day","evening"],"unit":"S9-02","also":"record"},{"id":"work-close-day","area":"work","label":"Close my day","line":"What got done, what moves to tomorrow, and one thing I learned.","times":["evening"],"reflect":"What got done today, what moves to tomorrow, and what is one thing you learned?"},{"id":"personal-check-in","area":"personal","label":"Morning check-in","line":"How I slept, how I feel, and one intention for today.","times":["morning"],"reflect":"How did you sleep, how do you feel, and what is your one intention for today?"},{"id":"personal-move","area":"personal","label":"Move for 15 minutes","line":"A gentle routine for my age and the space I have.","times":["morning","evening"],"reflect":"When today will you move for fifteen minutes, and what will remind you?","also":"habit"},{"id":"personal-eat-well","area":"personal","label":"Eat well today","line":"Simple meals for today, within my budget and my kitchen.","times":["morning","day"],"reflect":"Which simple meal today would be good for you and within your budget?"},{"id":"personal-learn","area":"personal","label":"Learn something new","line":"A short lesson on something I am curious about.","times":["morning","day","evening"],"reflect":"What are you curious about today, and whom could you ask about it?","also":"next"},{"id":"personal-language","area":"personal","label":"Practise a language","line":"Ten minutes a day in the language I want to speak.","times":["morning","day","evening"],"reflect":"Which ten minutes today will you give to the language you want to speak?","also":"habit"},{"id":"personal-read","area":"personal","label":"Read and reflect","line":"A short reading and one question to think about.","times":["day","evening"],"reflect":"What is one line from your reading today that you want to remember, and why?","also":"next"},{"id":"personal-health","area":"personal","label":"Health reminders","line":"Water, medicines and check-ups, set out as a simple list.","times":["morning","day","evening"],"reflect":"Which one health reminder matters most for you today: water, a medicine or a check-up?","also":"habit"},{"id":"personal-quiet","area":"personal","label":"Quiet time","line":"Five calm minutes for prayer, breathing or silence.","times":["morning","evening"],"unit":"S1-02"},{"id":"personal-journal","area":"personal","label":"Write my journal","line":"Three lines about today, kept for me.","times":["evening"],"reflect":"Write three lines about today, for yourself."},{"id":"personal-certificate","area":"personal","label":"Earn a certificate","line":"Take the next step in a course and earn a certificate.","times":["day","evening"],"reflect":"Which unit will you finish next, and when today will you do it?","also":"record"},{"id":"personal-profile","area":"personal","label":"Build my profile","line":"A CV and profile that show what I can do.","times":["day","evening"],"reflect":"Which piece of your work this month best shows what you can do?","also":"record"},{"id":"personal-sleep","area":"personal","label":"Sleep well","line":"A wind-down routine for tonight.","times":["evening"],"reflect":"What will you set down tonight, so that tomorrow can begin rested?","also":"habit"},{"id":"life-family-day","area":"life","label":"Family schedule","line":"Who goes where today: school, work and appointments.","times":["morning","evening"],"unit":"S2-01"},{"id":"life-shopping","area":"life","label":"Household list","line":"Groceries and chores, sorted so nothing is missed.","times":["morning","day","evening"],"unit":"S8-01","also":"daily"},{"id":"life-budget","area":"life","label":"Bills and spending","line":"What is due, what I spent and what is left this month.","times":["morning","day","evening"],"unit":"S7-02","also":"budget"},{"id":"life-savings","area":"life","label":"Save and grow money","line":"Learn the basics of saving and growing money safely.","times":["day","evening"],"unit":"S8-02","also":"cushion"},{"id":"life-homework","area":"life","label":"Homework help","line":"A simple explanation of my child's topic, with three practice questions.","times":["day","evening"],"unit":"S11-02"},{"id":"life-elders","area":"life","label":"Care for elders","line":"Care, meals and appointments for the elders at home.","times":["morning","day"],"unit":"S3-01"},{"id":"life-home-services","area":"life","label":"Home repairs and services","line":"Find trusted people for repairs, cleaning and care.","times":["morning","day"],"reflect":"Which repair or service have you been putting off, and what is the first small step?"},{"id":"life-public-services","area":"life","label":"Public services and forms","line":"How to apply for a certificate or scheme, step by step.","times":["morning","day"],"reflect":"Which form or certificate do you need next, and which papers does it ask for?"},{"id":"life-community","area":"life","label":"Community and volunteering","line":"Groups near me where I can help and belong.","times":["day","evening"],"unit":"S3-02"},{"id":"life-events","area":"life","label":"Festivals and family events","line":"Plan a festival, function or family event within budget.","times":["day","evening"],"reflect":"What matters most about this occasion, and what can be left out to stay within budget?","also":"budget"},{"id":"life-travel","area":"life","label":"Travel and commute","line":"The best way there and back, or a simple trip plan.","times":["morning","evening"],"reflect":"What would make today's journey calmer: leaving earlier, another route, or going with someone?"},{"id":"life-side-income","area":"life","label":"Start a side income","line":"Ways to earn from my skills, from home or nearby.","times":["day","evening"],"unit":"S6-01"},{"id":"play-greeting","area":"play","label":"Good morning message","line":"A warm message for family and friends.","times":["morning"],"reflect":"Who would be glad to hear from you this morning?"},{"id":"play-music","area":"play","label":"Music for the moment","line":"Songs that suit my mood, to play on a licensed service.","times":["morning","day","evening"],"reflect":"What do you want to feel in the next hour: calm, energy or joy?"},{"id":"play-watch","area":"play","label":"Something worth watching","line":"A film, show or talk worth my evening.","times":["evening"],"reflect":"What did the last good film or talk you watched leave you thinking about?"},{"id":"play-game","area":"play","label":"A quick game","line":"A five-minute puzzle or word game.","times":["morning","day","evening"],"reflect":"Which idea from this week would you like to test yourself on?","also":"quiz"},{"id":"play-sport","area":"play","label":"Sport with friends","line":"A game, walk or match with people nearby.","times":["evening"],"reflect":"Whom could you invite for a walk or a game this week?","also":"habit"},{"id":"play-create","area":"play","label":"Create and sell","line":"Make something, share it, and sell it if I wish.","times":["morning","day","evening"],"unit":"S11-01"},{"id":"play-weekend","area":"play","label":"Weekend plan","line":"An outing or a day at home, within budget.","times":["evening"],"reflect":"What would make this weekend restful for you and for the people with you?"},{"id":"play-cook","area":"play","label":"Cook something new","line":"A recipe from my region with what I have.","times":["day","evening"],"reflect":"Which dish from your region would you like to cook, and for whom?"},{"id":"play-quiz","area":"play","label":"Quiz of the day","line":"Five questions to learn while I play.","times":["morning","day"],"reflect":"Which unit do you remember least well, and what would you like to check?","also":"quiz"},{"id":"play-club","area":"play","label":"Join a club","line":"People who share my interest or my line of work.","times":["morning","day","evening"],"unit":"S4-02"},{"id":"play-story","area":"play","label":"Story time","line":"A short story for my child, or for me.","times":["evening"],"reflect":"Which story from your own life would you tell a child, and what does it teach?"},{"id":"play-celebrate","area":"play","label":"Celebrate someone","line":"Wishes for a birthday, anniversary or success.","times":["morning","day"],"unit":"S3-02"}],"areas":{"work":"Work","personal":"Personal","life":"Life","play":"Play"},"stages":[["Learner","You start with the free units, and your record opens.",0],["Earner, first level","Edition 1 complete, with one task tried and accepted.",100],["Earner, second level, or Service provider","Edition 2 complete, with three accepted tasks and one peer review.",200],["Author, Trainer or Partner","Edition 3 complete, with a sector example or unit accepted into our library, or sessions co-led beside a certified trainer.",300],["Leader or Expert","Edition 4 complete, with a learning group led on your own or a module of units accepted, and two learners mentored.",400]],"site":{"id":"houseforlearning.com","key":"ajan-sns-learning-room","views":["today","learn","record","habits","tools","ask"],"pathways":["CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8"],"tools":["payfirst","daily","cushion","debts","giving","budget","loan"]}};
/* Ajan SNS Learning Room: the calculations and the record, with no page code in them.
   Runs in the browser (as RoomLogic) and in Node (for the tests). Nothing here reads or writes storage or the network. */
(function (root, factory) {
  const L = factory();
  if (typeof module === 'object' && module.exports) module.exports = L; else root.RoomLogic = L;
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

/* ---------- numbers ---------- */
function num(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
  if (v == null) return NaN;
  const s = String(v).trim().replace(/[,\s]/g, '').replace(/%$/, '');
  if (s === '' || !/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
  return Number(s);
}
const isNum = x => typeof x === 'number' && Number.isFinite(x);
const need = why => ({ok: false, why});

/* ---------- MS07: the example for a sector, from the unit's template and the sector's words ---------- */
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function sectorExample(template, lex) {
  return cap(String(template).replace(/\{(\w+)\}/g, (m, k) => (lex && Object.prototype.hasOwnProperty.call(lex, k) ? lex[k] : m)));
}
const REGULATED_NOTE = "Regulated sector: apply your regulator's rules; this example is general education.";

/* ---------- MS09: the seven decision calculators ---------- */
function breakEven(i) {
  const price = num(i.price), variable = num(i.variable), fixed = num(i.fixed), units = num(i.units);
  if (!isNum(price) || !isNum(variable) || !isNum(fixed)) return need('Enter the price, the variable cost for each unit and the fixed costs.');
  if (price <= 0 || variable < 0 || fixed < 0) return need('The price must be above zero, and costs cannot be negative.');
  const cm = price - variable;
  if (cm <= 0) return need('The price must be higher than the variable cost for each unit; otherwise no volume covers the fixed costs.');
  const beUnits = fixed / cm, out = {ok: true, contribution: cm, ratio: cm / price, beUnits, beRevenue: beUnits * price};
  out.priceDown10 = price * 0.9 - variable > 0 ? fixed / (price * 0.9 - variable) : null;
  out.variableUp10 = price - variable * 1.1 > 0 ? fixed / (price - variable * 1.1) : null;
  if (isNum(units) && units > 0) {
    out.units = units; out.mosUnits = units - beUnits; out.mosRevenue = out.mosUnits * price;
    out.mosPct = out.mosUnits / units * 100; out.profit = units * cm - fixed;
  }
  return out;
}

function scarce(i) {
  const available = num(i.available);
  const rows = (i.products || []).map((p, k) => ({name: String(p.name || '').trim() || 'Product ' + (k + 1), c: num(p.contribution), h: num(p.use), d: num(p.demand)}))
    .filter(p => isNum(p.c) || isNum(p.h) || isNum(p.d));
  if (!isNum(available) || available <= 0) return need('Enter how much of the scarce resource you have, for example machine hours a month.');
  if (rows.length < 2) return need('Enter at least two products or services to compare.');
  for (const p of rows) {
    if (!isNum(p.c) || !isNum(p.h) || !isNum(p.d)) return need('Fill in all three figures for ' + p.name + '.');
    if (p.h <= 0 || p.d < 0) return need('For ' + p.name + ', the resource used for each unit must be above zero and demand cannot be negative.');
  }
  const ranked = rows.map(p => Object.assign({}, p, {per: p.c / p.h})).sort((a, b) => b.per - a.per);
  let left = available, total = 0;
  ranked.forEach(p => { p.make = Math.max(0, Math.min(p.d, Math.floor(left / p.h + 1e-9))); left -= p.make * p.h; p.total = p.make * p.c; total += p.total; });
  return {ok: true, ranked, unused: left, total};
}

function makeOrBuy(i) {
  const units = num(i.units), buyPrice = num(i.supplierPrice), variable = num(i.variableCost);
  const avoidable = isNum(num(i.avoidableFixed)) ? num(i.avoidableFixed) : 0;
  const unavoidable = isNum(num(i.unavoidable)) ? num(i.unavoidable) : 0;
  const opportunity = isNum(num(i.opportunity)) ? num(i.opportunity) : 0;
  if (!isNum(units) || !isNum(buyPrice) || !isNum(variable)) return need('Enter the number of units, the supplier price and your own variable cost for each unit.');
  if (units <= 0 || buyPrice < 0 || variable < 0 || avoidable < 0 || unavoidable < 0 || opportunity < 0) return need('Units must be above zero, and costs cannot be negative.');
  const make = variable * units + avoidable + opportunity, buy = buyPrice * units;
  const choice = make < buy ? 'make' : make > buy ? 'buy' : 'either';
  return {ok: true, make, buy, choice, saves: Math.abs(buy - make), unavoidable, opportunity};
}

function specialOrder(i) {
  const capacity = num(i.capacity), current = num(i.currentSales), regular = num(i.regularPrice), variable = num(i.variableCost);
  const order = num(i.orderUnits), special = num(i.specialPrice);
  const oneOff = isNum(num(i.oneOffCost)) ? num(i.oneOffCost) : 0;
  if (![capacity, current, regular, variable, order, special].every(isNum)) return need('Enter your capacity, current sales, regular price, variable cost, and the size and price of the order.');
  if (capacity <= 0 || current < 0 || order <= 0 || regular < 0 || variable < 0 || special < 0 || oneOff < 0) return need('Capacity and the order must be above zero, and no figure can be negative.');
  if (current > capacity) return need('Current sales cannot be more than your capacity.');
  if (order > capacity) return need('The order is larger than your whole capacity, so it cannot be made in this period.');
  const spare = capacity - current, displaced = Math.max(0, order - spare);
  const gain = order * (special - variable), lost = displaced * (regular - variable);
  const profit = gain - oneOff - lost;
  return {ok: true, spare, displaced, gain, lost, oneOff, profit, accept: profit > 0};
}

function flexBudget(i) {
  const bu = num(i.budgetUnits), vcu = num(i.budgetVarPerUnit), bf = num(i.budgetFixed), au = num(i.actualUnits), av = num(i.actualVariable), af = num(i.actualFixed);
  const bp = num(i.budgetPrice), ar = num(i.actualRevenue);
  if (![bu, vcu, bf, au, av, af].every(isNum)) return need('Enter the budget and actual volumes, the budgeted variable cost for each unit, and the budgeted and actual costs.');
  if (bu <= 0 || au <= 0 || vcu < 0 || bf < 0 || av < 0 || af < 0) return need('Volumes must be above zero, and costs cannot be negative.');
  const staticVar = vcu * bu, flexVar = vcu * au;
  const side = (x, plusIsAdverse) => (x === 0 ? 'none' : (x > 0) === plusIsAdverse ? 'adverse' : 'favourable');
  const out = {ok: true, staticVar, flexVar, volumeEffect: vcu * (au - bu),
    spending: Math.abs(av - flexVar), spendingSide: side(av - flexVar, true),
    fixedVar: Math.abs(af - bf), fixedSide: side(af - bf, true)};
  if (isNum(bp) && isNum(ar)) {
    out.flexRevenue = bp * au; out.priceVar = Math.abs(ar - out.flexRevenue); out.priceSide = side(ar - out.flexRevenue, false); out.actualPrice = ar / au;
  }
  return out;
}

function costEstimate(i) {
  const pts = (i.points || []).map(p => [num(p[0]), num(p[1])]).filter(p => isNum(p[0]) && isNum(p[1]));
  if (pts.length < 2) return need('Enter at least two periods, each with its activity and its total cost.');
  const sorted = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const lo = sorted[0], hi = sorted[sorted.length - 1];
  if (hi[0] === lo[0]) return need('The activity is the same in every period, so the cost cannot be split into fixed and variable parts.');
  const rate = (hi[1] - lo[1]) / (hi[0] - lo[0]), fixed = lo[1] - lo[0] * rate;
  const out = {ok: true, n: pts.length, highLow: {rate, fixed, hi, lo}};
  const at = num(i.at);
  if (isNum(at)) out.highLow.predicted = fixed + rate * at;
  if (pts.length >= 3) {
    const n = pts.length, sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
    const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
    const b = (n * sxy - sx * sy) / (n * sxx - sx * sx), a = (sy - b * sx) / n, ybar = sy / n;
    const ssTot = pts.reduce((s, p) => s + (p[1] - ybar) ** 2, 0), ssRes = pts.reduce((s, p) => s + (p[1] - (a + b * p[0])) ** 2, 0);
    out.regression = {rate: b, fixed: a, r2: ssTot > 0 ? 1 - ssRes / ssTot : 1};
    if (isNum(at)) out.regression.predicted = a + b * at;
  }
  return out;
}

function npvAt(investment, flows, r) { return flows.reduce((s, c, t) => s + c / Math.pow(1 + r, t + 1), 0) - investment; }
function invest(i) {
  const investment = num(i.investment), ratePct = num(i.rate), rate2Pct = num(i.rate2);
  const flows = (i.flows || []).map(num);
  while (flows.length && !isNum(flows[flows.length - 1])) flows.pop();
  if (!isNum(investment) || investment <= 0) return need('Enter the amount invested at the start.');
  if (!flows.length || !flows.every(isNum)) return need('Enter the cash flow for each year, with no year left blank in between.');
  let cum = 0, payback = null;
  flows.forEach((c, k) => { if (payback == null && c > 0 && cum + c >= investment) payback = k + (investment - cum) / c; cum += c; });
  const out = {ok: true, years: flows.length, totalIn: cum, payback};
  if (isNum(ratePct) && ratePct > -100) { out.rate = ratePct; out.npv = npvAt(investment, flows, ratePct / 100); }
  if (isNum(rate2Pct) && rate2Pct > -100) { out.rate2 = rate2Pct; out.npv2 = npvAt(investment, flows, rate2Pct / 100); }
  let lo = -0.99, hi = 10, flo = npvAt(investment, flows, lo), fhi = npvAt(investment, flows, hi);
  if (flo > 0 && fhi < 0) {
    for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (npvAt(investment, flows, m) > 0) lo = m; else hi = m; }
    out.irr = (lo + hi) / 2 * 100;
  } else out.irr = null;
  return out;
}

/* ---------- MS10: finance health check (education only; no advice) ---------- */
function health(i) {
  const days = isNum(num(i.days)) && num(i.days) > 0 ? num(i.days) : 365;
  const rev = num(i.revenue), rec = num(i.receivables), ca = num(i.currentAssets), cl = num(i.currentLiabilities);
  const stock = num(i.stock), cos = num(i.costOfSales), profit = num(i.profit), cash = num(i.operatingCash);
  const out = {ok: false, days};
  if (isNum(rev) && isNum(rec) && rev > 0 && rec >= 0) { out.dso = rec / rev * days; out.ok = true; }
  if (isNum(ca) && isNum(cl) && cl > 0 && ca >= 0) { out.currentRatio = ca / cl; out.ok = true; }
  if (isNum(stock) && isNum(cos) && cos > 0 && stock >= 0) { out.stockDays = stock / cos * days; out.ok = true; }
  if (isNum(profit) && isNum(cash)) {
    out.ok = true; out.profit = profit; out.cash = cash;
    out.flag = profit > 0 && cash < 0 ? 'profit-no-cash' : profit > 0 && cash < profit * 0.5 ? 'cash-lags' : profit <= 0 && cash > 0 ? 'cash-no-profit' : profit <= 0 && cash <= 0 ? 'both-negative' : 'in-step';
    if (profit > 0) out.conversion = cash / profit * 100;
  }
  if (!out.ok) out.why = 'Enter the figures for at least one of the four checks.';
  return out;
}

/* ---------- MS11 and the free money basics ---------- */
function payFirst(i) {
  const income = num(i.income), pct = num(i.percent);
  if (!isNum(income) || income <= 0 || !isNum(pct) || pct < 0 || pct > 100) return need('Enter your monthly income and the share you will set aside first, from 0 to 100.');
  const monthly = income * pct / 100;
  return {ok: true, monthly, yearly: monthly * 12, rest: income - monthly};
}
function dailyExpense(i) {
  const amount = num(i.amount), per = isNum(num(i.daysPerWeek)) ? num(i.daysPerWeek) : 7;
  if (!isNum(amount) || amount <= 0 || per <= 0 || per > 7) return need('Enter what the small expense costs each time, and on how many days a week.');
  const yearly = amount * per * 52;
  return {ok: true, weekly: amount * per, monthly: yearly / 12, yearly};
}
function cushion(i) {
  const essentials = num(i.essentials), months = isNum(num(i.months)) ? num(i.months) : 1;
  const saved = isNum(num(i.saved)) ? num(i.saved) : 0, per = num(i.perMonth);
  if (!isNum(essentials) || essentials <= 0 || months <= 0 || saved < 0) return need('Enter your essential costs for one month.');
  const target = essentials * months, gap = Math.max(0, target - saved);
  return {ok: true, target, gap, covered: essentials > 0 ? saved / essentials : 0, monthsToReach: gap === 0 ? 0 : isNum(per) && per > 0 ? Math.ceil(gap / per - 1e-9) : null};
}
function debtOrder(i) {
  const rows = (i.debts || []).map((d, k) => ({name: String(d.name || '').trim() || 'Debt ' + (k + 1), balance: num(d.balance), rate: num(d.rate)}))
    .filter(d => isNum(d.balance) || isNum(d.rate));
  if (!rows.length) return need('List each debt with what you still owe and its yearly interest rate.');
  for (const d of rows) if (!isNum(d.balance) || !isNum(d.rate) || d.balance <= 0 || d.rate < 0) return need('For ' + d.name + ', enter what you still owe and the yearly interest rate.');
  const byRate = i.method !== 'balance';
  const order = rows.slice().sort((a, b) => (byRate ? b.rate - a.rate || a.balance - b.balance : a.balance - b.balance || b.rate - a.rate));
  const total = rows.reduce((s, d) => s + d.balance, 0);
  return {ok: true, order, total, yearlyInterest: rows.reduce((s, d) => s + d.balance * d.rate / 100, 0), method: byRate ? 'rate' : 'balance'};
}
function giving(i) {
  const income = num(i.income), pct = num(i.percent);
  if (!isNum(income) || income <= 0 || !isNum(pct) || pct < 0 || pct > 100) return need('Enter your monthly income and the share you wish to give, from 0 to 100.');
  return {ok: true, monthly: income * pct / 100, yearly: income * pct / 100 * 12};
}
function budget(i) {
  const income = num(i.income), needs = isNum(num(i.needs)) ? num(i.needs) : 0, wants = isNum(num(i.wants)) ? num(i.wants) : 0, saving = isNum(num(i.saving)) ? num(i.saving) : 0;
  if (!isNum(income) || income <= 0) return need('Enter your income for the month.');
  if (needs < 0 || wants < 0 || saving < 0) return need('Amounts cannot be negative.');
  const share = x => x / income * 100;
  return {ok: true, needsPct: share(needs), wantsPct: share(wants), savingPct: share(saving), left: income - needs - wants - saving, leftPct: share(income - needs - wants - saving)};
}
function loan(i) {
  const principal = num(i.principal), ratePct = num(i.rate), months = num(i.months);
  if (!isNum(principal) || principal <= 0 || !isNum(ratePct) || ratePct < 0 || !isNum(months) || months < 1) return need('Enter the amount borrowed, the yearly interest rate and the number of months.');
  const n = Math.round(months), r = ratePct / 100 / 12;
  const payment = r === 0 ? principal / n : principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  return {ok: true, months: n, payment, totalPaid: payment * n, totalInterest: payment * n - principal};
}

/* ---------- MS05 and MS06: the record, a chain of entries in which a later change shows ---------- */
const K256 = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
function utf8(str) {
  const out = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) { const d = str.charCodeAt(i + 1); if (d >= 0xdc00 && d <= 0xdfff) { c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00); i++; } }
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}
function sha256(str) {
  const bytes = utf8(String(str)), bits = bytes.length * 8;
  bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
  const hi = Math.floor(bits / 0x100000000), lo = bits >>> 0;
  bytes.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19], w = new Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < bytes.length; off += 64) {
    for (let t = 0; t < 16; t++) w[t] = (bytes[off + t * 4] << 24) | (bytes[off + t * 4 + 1] << 16) | (bytes[off + t * 4 + 2] << 8) | bytes[off + t * 4 + 3];
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3), s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g), t1 = (h + S1 + ch + K256[t] + w[t]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), maj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}
function canonical(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v === undefined ? null : v);
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  return '{' + Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
}
const GENESIS = 'ajan-sns-learning-record';
function entryHash(e) { return sha256(canonical({n: e.n, at: e.at, kind: e.kind, unit: e.unit || null, data: e.data || {}, prev: e.prev})); }
function appendEntry(ledger, item) {
  const last = ledger[ledger.length - 1];
  const e = {n: ledger.length + 1, at: item.at, kind: item.kind, unit: item.unit || null, data: item.data || {}, prev: last ? last.hash : sha256(GENESIS)};
  e.hash = entryHash(e); ledger.push(e); return e;
}
function verifyLedger(ledger) {
  if (!Array.isArray(ledger)) return {ok: false, count: 0, badAt: 1};
  let prev = sha256(GENESIS);
  for (let k = 0; k < ledger.length; k++) {
    const e = ledger[k];
    if (!e || e.n !== k + 1 || e.prev !== prev || e.hash !== entryHash(e)) return {ok: false, count: ledger.length, badAt: k + 1};
    prev = e.hash;
  }
  return {ok: true, count: ledger.length, head: prev};
}
/* What the entries add up to. Kinds: check {pick, ok}; evidence {text}; points {points, status}; rating {stars, unclear}; badge {id, units}. */
function replay(ledger) {
  const units = {}, badges = [];
  let points = 0;
  const at = id => (units[id] = units[id] || {attempts: 0, first: null, passed: null, evidence: [], points: 0, done: null, stars: null, unclear: false});
  (ledger || []).forEach(e => {
    const d = e.data || {};
    if (e.kind === 'badge') { badges.push({id: d.id, units: d.units, at: e.at}); return; }
    if (!e.unit) return;
    const u = at(e.unit);
    if (e.kind === 'check') { u.attempts++; if (!u.first) u.first = {pick: d.pick, ok: !!d.ok}; if (d.ok && !u.passed) u.passed = e.at; }
    else if (e.kind === 'evidence') u.evidence.push({text: d.text, at: e.at});
    else if (e.kind === 'points') { u.points += d.points || 0; points += d.points || 0; u.done = u.done || e.at; }
    else if (e.kind === 'rating') { u.stars = d.stars || null; u.unclear = !!d.unclear; }
  });
  return {units, points, badges, complete: Object.keys(units).filter(k => units[k].done).length};
}
/* Adds the points entry once a unit has both a passed check and a note of what was tried. Returns the entry, or null. */
function settle(ledger, unitId, at, pointsPerUnit) {
  const u = replay(ledger).units[unitId];
  if (!u || u.done || !u.passed || !u.evidence.length) return null;
  return appendEntry(ledger, {at, kind: 'points', unit: unitId, data: {points: pointsPerUnit, status: 'recorded on this device'}});
}

/* ---------- MS08 and MS03: next unit, days and streaks ---------- */
function dayKey(d) { const x = d instanceof Date ? d : new Date(d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); }
function addDays(key, n) { const p = key.split('-').map(Number), d = new Date(p[0], p[1] - 1, p[2] + n); return dayKey(d); }
function daysBetween(a, b) { const pa = a.split('-').map(Number), pb = b.split('-').map(Number); return Math.round((new Date(pb[0], pb[1] - 1, pb[2]) - new Date(pa[0], pa[1] - 1, pa[2])) / 86400000); }
function nextUnit(order, done, open) { for (const id of order) if (open(id) && !done(id)) return id; return null; }
function streak(log, today) {
  let k = log && log[today] ? today : addDays(today, -1), n = 0;
  while (log && log[k]) { n++; k = addDays(k, -1); }
  return n;
}
function activeDays(stamps, today, span) {
  const first = addDays(today, -(span - 1)), seen = new Set();
  (stamps || []).forEach(s => { const k = dayKey(s); if (k >= first && k <= today) seen.add(k); });
  return seen.size;
}
function slotOf(hour) { return hour < 12 ? 'morning' : hour < 17 ? 'day' : 'evening'; }

return {num, isNum, cap, sectorExample, REGULATED_NOTE, breakEven, scarce, makeOrBuy, specialOrder, flexBudget, costEstimate, invest, npvAt, health,
  payFirst, dailyExpense, cushion, debtOrder, giving, budget, loan, sha256, canonical, appendEntry, verifyLedger, replay, settle,
  dayKey, addDays, daysBetween, nextUnit, streak, activeDays, slotOf};
});

/* ---------- shared helpers: icons, reading aloud, speaking instead of typing, the pointing hand, files ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = () => window.matchMedia('(pointer: coarse)').matches;

/* Line icons drawn for these pages */
const ICONS = {
  learn:'<path d="M3 8.5 12 4l9 4.5-9 4.5z"/><path d="M7 10.6V15c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.4M21 8.5v5.5"/>',
  spark:'<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 10.9 10.1 9z"/><path d="M19 3v3.5M20.8 4.7h-3.5"/>',
  doc:'<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M8.5 13h7M8.5 16.5h5"/>',
  target:'<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.2"/>',
  author:'<path d="M12 20h8.5M16.6 3.6a2.1 2.1 0 0 1 3 3L7.3 18.9 3.5 20l1.1-3.8z"/>',
  search:'<circle cx="11" cy="11" r="6.8"/><path d="m20.5 20.5-4.7-4.7"/>',
  train:'<path d="M3 4h18v11H3zM12 15v3M8.5 21 12 18l3.5 3"/><path d="M7 9h6M7 12h3.5"/>',
  users:'<circle cx="9" cy="8" r="3.6"/><path d="M2.5 20v-1.2A4.8 4.8 0 0 1 7.3 14h3.4a4.8 4.8 0 0 1 4.8 4.8V20M16 4.6a3.6 3.6 0 0 1 0 6.8M18.5 14.3a4.8 4.8 0 0 1 3 4.5V20"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.5V12l3 2"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3.5"/>',
  speaker:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  stop:'<rect x="7" y="7" width="10" height="10" rx="2"/>',
  send:'<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z"/>',
  chat:'<path d="M20.5 15a2 2 0 0 1-2 2H8l-4.5 3.5V5.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/>',
  image:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5-8.5 8.5"/>',
  bolt:'<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/><path d="M11 18.5h2"/>',
  badge:'<circle cx="12" cy="9" r="5.8"/><path d="M8.6 13.7 7.5 21l4.5-2.4 4.5 2.4-1.1-7.3"/>',
  route:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18h6a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7h6"/>',
  info:'<circle cx="12" cy="12" r="8.8"/><path d="M12 16.5v-5M12 8h.01"/>',
  arrow:'<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  chevl:'<path d="m15 6-6 6 6 6"/>',
  chev:'<path d="m9 6 6 6-6 6"/>',
  book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  shield:'<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.4-4.4"/>',
  record:'<path d="M6 3h11.5a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5H6zM9.5 3v18M12.5 8H16M12.5 11.5H16"/>',
  help:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.6"/><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
  case:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 12.5h18"/>',
  bank:'<path d="M3 9.5 12 4l9 5.5M4.5 9.5V18M9 9.5V18M15 9.5V18M19.5 9.5V18M3 20.5h18"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3 7 7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7"/>',
  moon:'<path d="M20 14.2A8.3 8.3 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z"/>',
  home:'<path d="M4 11 12 4l8 7M6.5 9.5V20h11V9.5"/><path d="M10 20v-5.5h4V20"/>',
  calc:'<rect x="5" y="3" width="14" height="18" rx="2.2"/><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  repeat:'<path d="M17 3.5 20.5 7 17 10.5"/><path d="M3.5 12V10a3 3 0 0 1 3-3h14M7 20.5 3.5 17 7 13.5"/><path d="M20.5 12v2a3 3 0 0 1-3 3h-14"/>',
  pen:'<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="m14.5 7.5 3 3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  trash:'<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>',
  down:'<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  copy:'<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
  up:'<path d="M12 20V9M7 13.5l5-5 5 5M5 4h14"/>',
  lock:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  play:'<path d="M7.5 4.5v15l12-7.5z"/>',
  scale:'<path d="M12 4v16M6 20h12M5 8h14M5 8l-2.5 6a2.8 2.8 0 0 0 5 0zM19 8l-2.5 6a2.8 2.8 0 0 0 5 0z"/>',
  pulse:'<path d="M2.5 12h4l2.5-6 4 12 2.5-6h6"/>',
  coins:'<ellipse cx="9" cy="7" rx="5.5" ry="2.8"/><path d="M3.5 7v4.5c0 1.5 2.5 2.8 5.5 2.8M3.5 11.5V16c0 1.5 2.5 2.8 5.5 2.8"/><ellipse cx="15" cy="14.5" rx="5.5" ry="2.8"/><path d="M9.5 14.5V19c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.5"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.spark}</svg>`;

/* The pointing hand, drawn for these pages: index finger up, fingertip at (11.5, 2) */
const HAND_D = 'M9 4.5a2.5 2.5 0 0 1 5 0V12.5a2.25 2.25 0 0 1 4.5 0V13.5a2.25 2.25 0 0 1 4.5 0V15a1.75 1.75 0 0 1 3.5 0V22c0 4-3 7-7 7h-4c-2.3 0-3.9-1-5.2-2.6L4.2 19.3a1.9 1.9 0 0 1 2.8-2.5L9 18.6Z';
const HAND_K = 'M14 12.5V16M18.5 13.5V16.5M23 15V17.5';
const handSvg = (fill, line, size) => `<svg xmlns="http://www.w3.org/2000/svg"${size ? ` width="${size}" height="${size}"` : ''} viewBox="0 0 32 32"><path d="${HAND_D}" fill="${fill}" stroke="${line}" stroke-width="1.6" stroke-linejoin="round"/><path d="${HAND_K}" fill="none" stroke="${line}" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const handIcon = cls => `<svg class="ic hand-ic ${cls || ''}" viewBox="0 0 32 32" aria-hidden="true"><path d="${HAND_D}"/><path d="${HAND_K}"/></svg>`;

let toastTimer = 0;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, Math.min(9000, 3000 + msg.length * 45));
}

/* ---------- reading aloud (built into the browser; nothing is recorded or sent) ---------- */
let speakBtn = null, speakRun = 0;
function voiceLang() { const l = navigator.language || ''; return /^en/i.test(l) ? l : 'en-IN'; }
function paintListen(btn, on) {
  if (!btn || !btn.isConnected) return;
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  const sw = btn.querySelector('.sw'); if (sw) sw.innerHTML = ic(on ? 'stop' : (btn.dataset.i || 'speaker'), btn.dataset.big ? '' : 'sm');
  const lbl = btn.querySelector('.lbl'); if (lbl) lbl.textContent = on ? 'Stop' : (btn.dataset.l || 'Listen');
}
function stopSpeaking() {
  speakRun++; try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
  if (speakBtn) { paintListen(speakBtn, false); speakBtn = null; }
}
/* Reads the text; `btn` shows Stop while it runs; `done` is called when the last sentence has been read (not when stopped). */
function say(text, btn, done) {
  if (btn && speakBtn === btn) { stopSpeaking(); return false; }
  stopSpeaking();
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { toast('Reading aloud is not available in this browser.'); return false; }
  const parts = String(text || '').replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*\s*/g) || [];
  if (!parts.length) return false;
  const run = ++speakRun; speakBtn = btn || null; if (btn) paintListen(btn, true);
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p.trim()); u.lang = voiceLang(); u.rate = 0.96;
    if (i === parts.length - 1) {
      u.onend = () => { if (run !== speakRun) return; if (speakBtn === btn) { paintListen(btn, false); speakBtn = null; } if (done) done(); };
      u.onerror = () => { if (run === speakRun && speakBtn === btn) { paintListen(btn, false); speakBtn = null; } };
    }
    try { synth.speak(u); } catch (e) {}
  });
  return true;
}
const listenBtn = (key, label, cls) => `<button class="btn quiet small ${cls || ''}" type="button" data-say="${esc(key)}" aria-pressed="false"${label ? ` data-l="${esc(label)}"` : ''}><span class="sw">${ic('speaker','sm')}</span><span class="lbl">${esc(label || 'Listen')}</span></button>`;

/* ---------- speaking instead of typing ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let rec = null, recFor = '';
function micHint() {
  return coarse()
    ? 'Speaking needs the microphone, which this view does not allow. Tap the box, then the microphone key on your keyboard, and speak.'
    : 'Speaking needs the microphone, which this view does not allow. Click the box, press the Windows key and H (on a Mac, the Fn key twice), and speak.';
}
function paintMics() {
  $$('[data-mic]').forEach(b => {
    const on = !!rec && b.dataset.mic === recFor;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.innerHTML = ic(on ? 'stop' : 'mic', 'sm') + (b.classList.contains('btn') ? (on ? 'Stop' : 'Speak') : '');
    b.setAttribute('aria-label', on ? 'Stop listening' : (b.dataset.micl || 'Speak instead of typing'));
  });
}
const micBtn = (id, label) => `<button class="btn quiet small" type="button" data-mic="${esc(id)}" aria-pressed="false"${label ? ` data-micl="${esc(label)}"` : ''}></button>`;
const micIcon = (id, label) => `<button class="icon-btn" type="button" data-mic="${esc(id)}" aria-pressed="false"${label ? ` data-micl="${esc(label)}"` : ''}></button>`;
/* `after(box)` runs when listening ends with something heard. */
function dictate(id, after) {
  if (rec) { try { rec.stop(); } catch (e) {} return; }
  const box = document.getElementById(id);
  if (!SR) { toast(micHint()); if (box) box.focus(); return; }
  try {
    stopSpeaking();
    const r = rec = new SR(); recFor = id;
    const base = box && box.value.trim() ? box.value.trim() + ' ' : '';
    let heard = '';
    r.lang = navigator.language || 'en-IN'; r.interimResults = true; r.maxAlternatives = 1;
    r.onresult = ev => {
      let interim = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) { const x = ev.results[i]; if (x.isFinal) heard += x[0].transcript; else interim += x[0].transcript; }
      if (box) { box.value = base + heard + interim; box.dispatchEvent(new Event('input', {bubbles: true})); }
    };
    r.onerror = ev => { const c = ev && ev.error; if (['not-allowed','service-not-allowed','audio-capture','network'].includes(c)) toast(micHint()); else if (c !== 'aborted' && c !== 'no-speech') toast('I could not hear that. Please try again, or type.'); };
    r.onend = () => { if (rec === r) { rec = null; recFor = ''; } paintMics(); if (heard.trim() && after && box) after(box); };
    r.start(); paintMics();
  } catch (e) { rec = null; recFor = ''; paintMics(); toast(micHint()); }
}

/* ---------- handing the person a file: the viewer's own save where the page runs as a private preview, a plain download on a site ---------- */
/* Resolves 'saved', 'declined', or 'copy' (no way to save here: the caller shows the text to copy instead). */
async function saveFile(filename, text, mime) {
  if (typeof viewerSave === 'function') { const r = await viewerSave(filename, text); if (r) return r; }
  try {
    const url = URL.createObjectURL(new Blob([text], {type: mime || 'text/plain'}));
    const a = document.createElement('a'); a.href = url; a.download = filename; a.rel = 'noopener'; a.hidden = true;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'saved';
  } catch (e) { return 'copy'; }
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
  try {
    const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.className = 'sr';
    document.body.appendChild(t); t.select(); const ok = document.execCommand('copy'); t.remove(); return ok;
  } catch (e) { return false; }
}

/* ---------- the pointing hand ---------- */
const root = document.documentElement;
const Hand = (() => {
  let on = true, onChange = null;
  const thand = $('#thand');
  thand.innerHTML = handSvg('#FFFFFF', '#14202B');
  const TIP = {x: 11.5 / 32 * 62, y: 2 / 32 * 62};
  let touchMode = coarse(), parked = true, hx = 0, hy = 0, aimed = null, drag = null;
  const INTERACTIVE = 'a[href],button,input,textarea,label,summary,[role="button"],[tabindex]:not([tabindex="-1"])';
  function ripple(x, y) {
    if (reduceMotion) return;
    const r = document.createElement('span'); r.className = 'ripple'; r.style.left = x + 'px'; r.style.top = y + 'px';
    document.body.appendChild(r); setTimeout(() => r.remove(), 560);
  }
  function targetAt(x, y) {
    const els = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
    for (const el of els) { if (!el || thand.contains(el)) continue; return el.closest(INTERACTIVE); }
    return null;
  }
  function aim() {
    const t = parked || thand.hidden ? null : targetAt(hx, hy);
    if (t === aimed) return;
    if (aimed) aimed.classList.remove('hand-aim');
    aimed = t; if (t) t.classList.add('hand-aim');
  }
  function place(x, y) {
    hx = Math.max(6, Math.min(window.innerWidth - 6, x)); hy = Math.max(6, Math.min(window.innerHeight - 6, y));
    thand.style.transform = `translate(${hx - TIP.x}px, ${hy - TIP.y}px)`; aim();
  }
  function park() {
    const dock = $('.dock'), dh = dock && getComputedStyle(dock).display !== 'none' ? dock.offsetHeight : 0;
    parked = true; place(window.innerWidth - 62 - 14 + TIP.x, window.innerHeight - dh - 62 - 16 + TIP.y);
  }
  function sync() {
    root.classList.toggle('hand-on', on);
    $$('[data-hand]').forEach(b => b.setAttribute('aria-pressed', String(on)));
    thand.hidden = !(on && touchMode);
    root.classList.toggle('thand-on', !thand.hidden);
    if (!thand.hidden && parked) park();
    if (thand.hidden && aimed) { aimed.classList.remove('hand-aim'); aimed = null; }
  }
  function activate(t) { if (t.matches('input:not([type=checkbox]):not([type=file]),textarea')) { t.focus(); return; } t.click(); }
  thand.addEventListener('pointerdown', e => {
    e.preventDefault(); try { thand.setPointerCapture(e.pointerId); } catch (er) {}
    drag = {id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: hx - e.clientX, oy: hy - e.clientY, t: Date.now(), moved: 0};
    thand.classList.add('held');
  });
  thand.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy));
    if (drag.moved > 6) { parked = false; place(e.clientX + drag.ox, e.clientY + drag.oy); }
  });
  thand.addEventListener('pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const tap = drag.moved <= 6 && Date.now() - drag.t < 450; drag = null; thand.classList.remove('held');
    if (!tap) return;
    if (parked) { toast('Drag the hand onto anything on the page, then tap the hand to open it.'); return; }
    const t = targetAt(hx, hy); ripple(hx, hy);
    if (t) activate(t); else toast('Nothing to open here. Drag the hand onto a button, a capsule or a link.');
  });
  thand.addEventListener('pointercancel', () => { drag = null; thand.classList.remove('held'); });
  document.addEventListener('pointerdown', e => {
    if (thand.contains(e.target)) return;
    if (e.pointerType === 'touch' && !touchMode) { touchMode = true; sync(); }
    if (!on) return;
    if (e.pointerType === 'mouse') root.classList.add('hand-press');
    ripple(e.clientX, e.clientY);
  }, {passive: true});
  document.addEventListener('pointerup', () => root.classList.remove('hand-press'), {passive: true});
  window.addEventListener('blur', () => root.classList.remove('hand-press'));
  let aimFrame = 0;
  window.addEventListener('scroll', () => { if (aimFrame) return; aimFrame = requestAnimationFrame(() => { aimFrame = 0; aim(); }); }, {passive: true});
  window.addEventListener('resize', () => { if (thand.hidden) return; if (parked) park(); else place(hx, hy); });
  document.addEventListener('focusin', e => { if (e.target.matches && e.target.matches('input:not([type=checkbox]),textarea')) thand.classList.add('away'); });
  document.addEventListener('focusout', () => thand.classList.remove('away'));
  return {
    set(v) { on = !!v; sync(); },
    get() { return on; },
    toggle() { on = !on; sync(); if (onChange) onChange(on); toast(on ? 'The pointing hand is on.' : 'The pointing hand is off.'); },
    onChange(fn) { onChange = fn; },
    sync, repark() { if (!thand.hidden && parked) park(); }
  };
})();

/* ---------- the Learning Room: what is built into the page, what the person has done, and where they are ---------- */
const D = DATA, L = RoomLogic;
const UNITS = new Map(D.units.map(u => [u.id, u]));
const SECTORS = D.sectors, LEVELS = D.levels;
const isOpen = id => { const u = UNITS.get(id); return !!(u && u.open); };
const PATHS = D.pathways;
const pathwayOf = id => PATHS.find(p => p.id === id) || null;
const sectorLabel = k => { const s = SECTORS.find(x => x[0] === k); return s ? s[1] : SECTORS[0][1]; };
const has = v => D.site.views.includes(v);
const hasTool = t => D.site.tools.includes(t);
const fmt = (x, d = 2) => (typeof x === 'number' && Number.isFinite(x) ? new Intl.NumberFormat(undefined, {maximumFractionDigits: d}).format(Math.abs(x) < 1e-9 ? 0 : x) : '');
const fmtDate = iso => { try { return new Date(iso).toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'}); } catch (e) { return ''; } };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const today = () => L.dayKey(new Date());
const nowIso = () => new Date().toISOString();
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* One item in the browser, and only after the person chooses to keep the record on this device. */
const KEY = D.site.key;
const fresh = () => ({v: 1, keep: false, sector: 'other', pathway: D.site.pathways[0], level: 1, mode: 'read', hand: true, ledger: [], journal: [], habits: [], anchors: {}, seen: {}});
let S = fresh(), R = L.replay([]), askedKeep = false, storageFailed = false;
function load() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (o && o.v === 1 && o.keep === true) {
      S = Object.assign(fresh(), o);
      if (!Array.isArray(S.ledger)) S.ledger = [];
      if (!Array.isArray(S.journal)) S.journal = [];
      if (!Array.isArray(S.habits)) S.habits = [];
      if (!S.anchors || typeof S.anchors !== 'object') S.anchors = {};
      if (!S.seen || typeof S.seen !== 'object') S.seen = {};
    }
  } catch (e) {}
  if (!SECTORS.some(s => s[0] === S.sector)) S.sector = 'other';
  if (S.pathway !== 'all' && !D.site.pathways.includes(S.pathway)) S.pathway = D.site.pathways[0];
  if (![1, 2, 3, 4].includes(S.level)) S.level = 1;
  if (!['read', 'see', 'hear', 'do'].includes(S.mode)) S.mode = 'read';
  R = L.replay(S.ledger);
}
function save() {
  if (!S.keep) return;
  try { localStorage.setItem(KEY, JSON.stringify(S)); storageFailed = false; }
  catch (e) { if (!storageFailed) toast('This device could not save your record. Its storage may be full or switched off; download your record to keep it.'); storageFailed = true; }
}
function forget() { try { localStorage.removeItem(KEY); } catch (e) {} }
function refresh() { R = L.replay(S.ledger); }
const uState = id => R.units[id] || null;
const isDone = id => !!(R.units[id] && R.units[id].done);
/* Writes one entry to the record, adds the points when a unit has both its check and a note of what was tried, and the Foundation badge when every open Foundation unit is complete. */
function record(kind, unit, data) {
  const at = nowIso();
  L.appendEntry(S.ledger, {at, kind, unit, data});
  let gained = 0;
  if (unit && L.settle(S.ledger, unit, at, D.ppu)) gained = D.ppu;
  refresh();
  if (gained) {
    const f = D.units.filter(u => u.level === 1 && u.open);
    if (f.length && f.every(u => isDone(u.id)) && !R.badges.some(b => b.id === 'foundation')) { L.appendEntry(S.ledger, {at, kind: 'badge', unit: null, data: {id: 'foundation', units: f.length}}); refresh(); gained = -1; }
  }
  save();
  return gained;
}

/* ---------- where the person is ---------- */
const VIEWS = [['today', 'Today', 'home'], ['learn', 'Learn', 'learn'], ['record', 'Record', 'record'], ['habits', 'Habits', 'repeat'], ['journal', 'Journal', 'pen'], ['tools', 'Tools', 'calc'], ['ask', 'Ask', 'chat']].filter(v => has(v[0]));
const DOCK = VIEWS.map(v => v[0]);   /* on a phone every part is in the bar at the bottom, within thumb reach */
let route = {view: VIEWS[0][0], unit: null, tool: null};
const Draft = {};   /* what is typed but not yet saved; kept in memory only */
function parseHash(h) {
  h = String(h || '').replace(/^#/, '');
  if (/^unit-/.test(h)) { const id = h.slice(5); return UNITS.has(id) && has('learn') ? {view: 'learn', unit: id, tool: null} : null; }
  if (/^tool-/.test(h)) { const t = h.slice(5); return has('tools') && hasTool(t) ? {view: 'tools', unit: null, tool: t} : null; }
  if (h === 'quiz' && has('learn')) return {view: 'quiz', unit: null, tool: null};
  return VIEWS.some(v => v[0] === h) ? {view: h, unit: null, tool: null} : null;
}
const hashOf = r => (r.view === 'learn' && r.unit ? 'unit-' + r.unit : r.view === 'tools' && r.tool ? 'tool-' + r.tool : r.view);
function go(hash, opts) {
  const r = parseHash(hash); if (!r) return;
  const same = hashOf(r) === hashOf(route);
  route = r;
  if (r.unit) openUnitState(r.unit, opts && opts.step);
  try { if (location.hash.replace(/^#/, '') !== hashOf(r)) location.hash = hashOf(r); } catch (e) {}
  render();
  if (!same || (opts && opts.top)) toTop();
}
function toTop() {
  window.scrollTo(0, 0);
  const h = $('#view h1'); if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({preventScroll: true}); } catch (e) {} }
}
window.addEventListener('hashchange', () => {
  const r = parseHash(location.hash); if (!r || hashOf(r) === hashOf(route)) return;
  route = r; if (r.unit) openUnitState(r.unit); render(); toTop();
});

/* ---------- the frame: header capsules, phone dock, footer ---------- */
function paintNav() {
  const cur = route.view === 'quiz' ? 'learn' : route.view;
  $('#nav').innerHTML = VIEWS.map(v => `<a class="cap" href="#${v[0]}" data-go="${v[0]}"${v[0] === cur ? ' aria-current="page"' : ''}>${esc(v[1])}</a>`).join('');
  $('#dock').innerHTML = DOCK.map(id => { const v = VIEWS.find(x => x[0] === id); return `<a href="#${id}" data-go="${id}"${id === cur ? ' aria-current="page"' : ''}>${ic(v[2])}${esc(v[1])}</a>`; }).join('');
}
function renderFixed() {
  $('#listenView .sw').innerHTML = ic('speaker', 'sm');
  $$('.hw').forEach(x => { x.innerHTML = handIcon('sm'); });
}
const bar = (pct, label) => `<span class="bar" role="img" aria-label="${esc(label)}"><i data-w="${Math.round(Math.max(0, Math.min(100, pct)))}"></i></span>`;
const head = (title, lede, extra) => `<header class="vh"><h1>${esc(title)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ''}${extra || ''}</header>`;
const keepCard = () => (S.keep || askedKeep ? '' : `<section class="card pad keepcard" aria-labelledby="h-keep">
    <div class="row">${ic('shield')}<h2 id="h-keep">Keep your record on this device?</h2></div>
    <p>Your units, practice points, habits and journal can be kept in this browser, on this device only. Nothing is sent anywhere, and you can delete it at any time. If you choose not to, the page still works, and what you do is forgotten when you close it.</p>
    <div class="row"><button class="btn primary small" type="button" data-keep="1">${ic('check', 'sm')}Keep on this device</button><button class="btn quiet small" type="button" data-keep="0">Not now</button></div>
  </section>`);

/* ---------- Today: the next unit, the anchors for this time of day, habits and points ---------- */
const AREAS = D.areas;
let slotPick = null, anchorsAll = false;
const slotNow = () => slotPick || L.slotOf(new Date().getHours());
const SLOT_NAME = {morning: 'this morning', day: 'today', evening: 'this evening'};
const dayNumber = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
function nextOnPathway() {
  const p = pathwayOf(S.pathway), order = p ? p.units : D.units.map(u => u.id);
  return L.nextUnit(order, isDone, isOpen);
}
function pathwayProgress(pid, level) {
  const p = pathwayOf(pid), ids = (p ? p.units : D.units.map(u => u.id)).filter(id => UNITS.get(id).level === level);
  return {total: ids.length, open: ids.filter(isOpen).length, done: ids.filter(isDone).length};
}
function anchorCard(a) {
  const doneToday = (S.anchors[today()] || []).includes(a.id), u = a.unit ? UNITS.get(a.unit) : null;
  const also = a.also ? ({next: ['learn', 'Take my next unit'], habit: ['repeat', 'Make this a habit'], quiz: ['spark', 'Quiz of the day'], record: ['record', 'Open my record']}[a.also] || ['calc', 'Open the calculator']) : null;
  return `<article class="card pad anchor">
    <div class="row"><span class="eyebrow">${esc(AREAS[a.area])}</span><span class="grow"></span>${doneToday ? `<span class="tag ok">${ic('check', 'sm')}Done today</span>` : ''}</div>
    <h3>${esc(a.label)}</h3><p class="muted">${esc(a.line)}</p>
    ${u ? `<button class="alink" type="button" data-open-unit="${esc(u.id)}"><span class="code">${esc(u.id)}</span><span class="grow"><b>${esc(u.title)}</b><span>A five-minute unit${isDone(u.id) ? ', completed' : ''}</span></span>${ic('chev', 'sm')}</button>` : ''}
    ${a.reflect ? `<p class="aq">${esc(a.reflect)}</p>` : ''}
    <div class="row">
      ${a.reflect && has('journal') ? `<button class="btn quiet small" type="button" data-anchor-write="${esc(a.id)}">${ic('pen', 'sm')}Write my answer</button>` : ''}
      ${also && (a.also !== 'habit' || has('habits')) && (a.also !== 'record' || has('record')) && (['next', 'habit', 'quiz', 'record'].includes(a.also) || hasTool(a.also)) ? `<button class="btn quiet small" type="button" data-anchor-also="${esc(a.id)}">${ic(also[0], 'sm')}${esc(also[1])}</button>` : ''}
      <button class="cap" type="button" data-anchor-done="${esc(a.id)}" aria-pressed="${doneToday}">${doneToday ? 'Done' : 'Mark as done'}</button>
    </div>
  </article>`;
}
function viewToday() {
  const h = new Date().getHours(), hello = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const nx = nextOnPathway(), u = nx ? UNITS.get(nx) : null, p = pathwayOf(S.pathway), pr = pathwayProgress(S.pathway, 1);
  const slot = slotNow(), dn = dayNumber();
  const inSlot = D.anchors.filter(a => a.times.includes(slot));
  const shown = anchorsAll ? inSlot : Object.keys(AREAS).map((area, k) => { const list = inSlot.filter(a => a.area === area); return list.length ? list[(dn + k) % list.length] : null; }).filter(Boolean);
  const active = S.habits.filter(x => !x.ended);
  return head(hello, 'A few minutes today, with an example from your own sector.') + keepCard() + `
  <div class="grid2 gap-top">
    <section class="card pad lift nextcard" aria-labelledby="h-next">
      <p class="eyebrow" id="h-next">Your next unit${p ? ' · ' + esc(p.name) : ''}</p>
      ${u ? `<div class="row"><span class="code">${esc(u.id)}</span><span class="tag gold">${esc(LEVELS[u.level])}${u.level === 1 ? ' · free' : ''}</span><span class="tag">${ic('clock', 'sm')}About five minutes</span></div>
        <h2 class="big">${esc(u.title)}</h2><p class="hook">${esc(u.hook)}</p>
        <div class="row"><button class="btn primary" type="button" data-open-unit="${esc(u.id)}">${ic('play', 'sm')}${uState(u.id) || (S.seen[u.id] || []).length > 1 ? 'Continue this unit' : 'Start this unit'}</button><a class="btn quiet" href="#learn" data-go="learn">Choose another</a></div>`
      : `<h2 class="big">This pathway is complete</h2><p class="hook">You have completed every unit that is open on this pathway. Choose another pathway to continue.</p>
        <div class="row"><a class="btn primary" href="#learn" data-go="learn">${ic('route', 'sm')}Choose a pathway</a></div>`}
      <div class="prog"><span>${pr.done} of ${pr.open} Foundation units on this pathway</span>${bar(pr.open ? pr.done / pr.open * 100 : 0, `${pr.done} of ${pr.open} Foundation units completed`)}</div>
    </section>
    <section class="card pad sidecard" aria-labelledby="h-pts">
      <p class="eyebrow" id="h-pts">Practice points</p>
      <p class="num">${R.points}</p>
      <p class="muted">${R.complete ? plural(R.complete, 'unit', 'units') + ' completed. ' : ''}Each unit adds ${D.ppu} points once you have passed its check and noted what you tried.</p>
      <div class="row">${has('record') ? `<a class="btn quiet small" href="#record" data-go="record">${ic('record', 'sm')}Open my record</a>` : ''}<span class="tag">${ic('target', 'sm')}${esc(sectorLabel(S.sector))}</span></div>
    </section>
  </div>
  ${D.anchors.length ? `<section class="sec" aria-labelledby="h-anc">
    <div class="sec-h"><h2 id="h-anc">Anchors for ${SLOT_NAME[slot]}</h2>
      <div class="caps" role="group" aria-label="Time of day">${[['morning', 'Morning', 'sun'], ['day', 'Day', 'clock'], ['evening', 'Evening', 'moon']].map(x => `<button class="cap" type="button" data-slot="${x[0]}" aria-pressed="${x[0] === slot}">${ic(x[2], 'sm')}${x[1]}</button>`).join('')}</div></div>
    <p class="muted sec-p">Small steps for work, personal life, life and play. Each one carries a short unit or a question to think about.</p>
    <div class="anchors">${shown.map(anchorCard).join('')}</div>
    <div class="caps gap-top"><button class="cap more" type="button" data-anchors-all="${anchorsAll ? 0 : 1}">${anchorsAll ? 'Show four' : `All ${inSlot.length} anchors for ${SLOT_NAME[slot]}`}</button></div>
  </section>` : ''}
  ${has('habits') ? `<section class="sec" aria-labelledby="h-hab">
    <div class="sec-h"><h2 id="h-hab">Your habits</h2><a class="cap" href="#habits" data-go="habits">${ic('repeat', 'sm')}Open habits</a></div>
    ${active.length ? `<div class="habit-row">${active.map(x => { const on = !!(x.log || {})[today()]; return `<button class="hchip" type="button" data-habit-tick="${esc(x.id)}" aria-pressed="${on}"><span class="tick">${on ? ic('check', 'sm') : ''}</span><span class="grow"><b>${esc(x.name)}</b><span>${on ? 'Done today' : 'Tap when done today'} · ${plural(L.streak(x.log || {}, today()), 'day', 'days')} in a row</span></span></button>`; }).join('')}</div>`
      : `<p class="muted">You have no habit yet. One tiny habit, linked to something you already do every day, is the best place to start.</p>`}
  </section>` : ''}`;
}

/* ---------- Learn: pathway, level, the unit list ---------- */
let sectorsAll = false, pickSector = false;
const TOP_SECTORS = ['other', 'retail', 'healthcare', 'construction', 'software', 'agriculture', 'education', 'hospitality'];
function sectorCaps(attr) {
  const list = sectorsAll ? SECTORS : SECTORS.filter(s => TOP_SECTORS.includes(s[0]) || s[0] === S.sector);
  return list.map(s => `<button class="cap" type="button" data-${attr}="${esc(s[0])}" aria-pressed="${s[0] === S.sector}">${esc(s[1])}</button>`).join('') +
    `<button class="cap more" type="button" data-sectors-all="${sectorsAll ? 0 : 1}">${sectorsAll ? 'Fewer' : `All ${SECTORS.length} sectors`}</button>`;
}
function unitTag(u) {
  if (!u.open) return `<span class="tag">${ic('lock', 'sm')}Opens with an edition</span>`;
  const st = uState(u.id);
  if (st && st.done) return `<span class="tag ok">${ic('check', 'sm')}Completed · ${st.points} points</span>`;
  if (st && st.passed) return `<span class="tag warn">Check passed · note what you tried</span>`;
  if (st && st.evidence.length) return `<span class="tag warn">Tried · take the check</span>`;
  if (st || (S.seen[u.id] || []).length > 1) return `<span class="tag blue">Started</span>`;
  return '';
}
function unitCard(u) {
  const inner = `<span class="row"><span class="code">${esc(u.id)}</span><span class="st">${esc(D.strands[u.strand])}</span><span class="grow"></span>${unitTag(u)}</span><b>${esc(u.title)}</b><span class="hk">${esc(u.hook)}</span>`;
  return u.open ? `<button class="ucard" type="button" data-open-unit="${esc(u.id)}">${inner}</button>` : `<div class="ucard locked">${inner}</div>`;
}
function searchUnits(q) {
  const words = String(q || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  if (!words.length) return [];
  return D.units.map(u => {
    const t = u.title.toLowerCase(), rest = (u.hook + ' ' + (u.idea || '') + ' ' + D.strands[u.strand]).toLowerCase();
    let s = 0; words.forEach(w => { if (t.includes(w)) s += 3; else if (rest.includes(w)) s += 1; });
    return [s, u];
  }).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0] || (b[1].open ? 1 : 0) - (a[1].open ? 1 : 0)).map(x => x[1]);
}
function viewLearn() {
  const p = pathwayOf(S.pathway), q = (Draft.usearch || '').trim();
  const pool = (p ? p.units.map(id => UNITS.get(id)) : D.units);
  const found = q ? searchUnits(q) : null;
  const list = found ? found.slice(0, 24) : pool.filter(u => u.level === S.level);
  const lv = [1, 2, 3, 4].map(n => { const pr = pathwayProgress(S.pathway, n); return {n, pr}; });
  const cur = lv[S.level - 1].pr;
  return head('Learn', 'Short units of about five minutes, each with an example from your own sector.') + `
  <section class="card pad sectorbar" aria-labelledby="h-sector">
    <div class="row"><span class="eyebrow" id="h-sector">Your sector</span><span class="tag blue">${ic('target', 'sm')}${esc(sectorLabel(S.sector))}</span><span class="grow"></span>
      <button class="cap" type="button" data-pick-sector="${pickSector ? 0 : 1}" aria-expanded="${pickSector}">${pickSector ? 'Close' : 'Change my sector'}</button></div>
    ${pickSector ? `<div class="caps gap-top" role="group" aria-label="Sector">${sectorCaps('sector')}</div>` : ''}
  </section>
  <section class="sec" aria-labelledby="h-path">
    <div class="sec-h"><h2 id="h-path">Choose a pathway</h2></div>
    <div class="caps" role="group" aria-label="Pathway">${PATHS.map(x => `<button class="cap" type="button" data-pathway="${esc(x.id)}" aria-pressed="${x.id === S.pathway}">${esc(x.name)}</button>`).join('')}<button class="cap" type="button" data-pathway="all" aria-pressed="${S.pathway === 'all'}">All units</button></div>
    <p class="muted sec-p">${p ? `${esc(p.audience)}. ${p.units.length} units in four levels.` : `Every unit on this page, ${D.units.length} in all.`}</p>
  </section>
  <section class="sec" aria-labelledby="h-units">
    <div class="sec-h"><h2 id="h-units">${found ? 'Units found' : esc(LEVELS[S.level]) + ' units'}</h2>
      <form class="find" id="unitFind" role="search" autocomplete="off"><label class="sr" for="usearch">Find a unit</label>
        <input class="box" id="usearch" data-draft="usearch" type="text" enterkeyhint="search" placeholder="Find a unit: speak or type" value="${esc(Draft.usearch || '')}">${micIcon('usearch', 'Speak the words to find')}<button class="icon-btn" type="submit" aria-label="Find">${ic('search', 'sm')}</button></form></div>
    ${found ? `<div class="row gap-b"><span class="muted">${found.length ? plural(found.length, 'unit', 'units') + ' for “' + esc(q) + '”' : 'No unit matches “' + esc(q) + '”. Try another word.'}</span><button class="cap" type="button" data-clear-search="1">${ic('close', 'sm')}Clear</button></div>`
    : `<div class="caps gap-b" role="group" aria-label="Level">${lv.map(x => `<button class="cap" type="button" data-level="${x.n}" aria-pressed="${x.n === S.level}">${esc(LEVELS[x.n])}${x.n === 1 ? ' · free' : ''}<span class="n">${x.pr.done}/${x.pr.total}</span></button>`).join('')}</div>
      ${cur.open < cur.total ? `<div class="note gap-b">${ic('lock', 'sm')}<span>${cur.open === 0 ? `The ${esc(LEVELS[S.level])} units open with an edition of the Executive Programme. You can read what each one is about here.` : `${cur.total - cur.open} of these units are not open on this page yet.`}</span></div>` : ''}`}
    <div class="ulist">${list.map(unitCard).join('') || '<p class="muted">No units here.</p>'}</div>
  </section>`;
}

/* ---------- the unit player: seven parts, four ways ---------- */
const STEPS = ['Hook', 'Idea', 'Your sector', 'Try it today', 'Caution', 'Reflect', 'Check'];
const MODES = [['read', 'Read', 'doc', 'The seven parts, one at a time'], ['see', 'See', 'eye', 'The whole unit as one picture'], ['hear', 'Hear', 'speaker', 'The unit read aloud to you'], ['do', 'Do', 'bolt', 'Straight to the task for today']];
const U = {id: null, step: 0, wrong: [], readings: false, hearing: null, justPassed: false};
function openUnitState(id, step) {
  if (U.id !== id) { U.id = id; U.step = 0; U.wrong = []; U.readings = false; U.justPassed = false; }
  if (typeof step === 'number') U.step = step;
  U.hearing = null; markSeen(id, U.step);
}
function markSeen(id, i) { const a = S.seen[id] = S.seen[id] || []; if (!a.includes(i)) { a.push(i); save(); } }
function exampleFor(u) { return L.sectorExample(u.template, D.lex[S.sector] || D.lex.other); }
function isRegulated() { const s = SECTORS.find(x => x[0] === S.sector); return !!(s && s[2]); }
function stepText(u, i) {
  return [u.hook, u.idea, `${sectorLabel(S.sector)}. ${exampleFor(u)}`, u.tryit, u.caution, u.reflection,
    `${u.question} ${u.options.map((o, j) => `Option ${'ABC'[j]}: ${o}.`).join(' ')}`][i];
}
function journalFor(id) { return S.journal.find(j => j.unit === id) || null; }
function readingsHtml(u) {
  const r = u.readings; if (!r) return '';
  const link = (name, url) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a>` : esc(name));
  return `<ul class="readings">
    <li>${ic('book')}<div><b>A book this unit draws on</b><span>${esc(r.book[0])}${r.book[1] ? ', ' + esc(r.book[1]) : ''}${r.book[2] ? '. ' + esc(r.book[2]) + '.' : ''}</span></div></li>
    <li>${ic('doc')}<div><b>Free reading</b><span>${link(r.free[0], r.free[1])}: ${esc(r.free[2])}.</span></div></li>
    <li>${ic('learn')}<div><b>Free course</b><span>${r.course[1] ? `${link(r.course[0], r.course[1])}: search “${esc(r.course[2])}”.` : `${esc(r.course[0])}. Search for “${esc(r.course[2])}”.`}</span></div></li>
    <li>${ic('search')}<div><b>To borrow next</b><span>${esc(r.borrow[0])} ${esc(r.borrow[1])}</span></div></li>
    ${r.note ? `<li>${ic('info')}<div><b>A note on this reading</b><span>${esc(r.note)}</span></div></li>` : ''}
  </ul>`;
}
function evidenceForm(u, st) {
  const ev = st ? st.evidence : [];
  return `${ev.length ? `<ul class="evlist">${ev.map(e => `<li>${ic('check', 'sm')}<span>${esc(e.text)} <span class="muted">(${esc(fmtDate(e.at))})</span></span></li>`).join('')}</ul>` : ''}
    <div class="field"><label for="evBox">${ev.length ? 'Add another note on what you tried' : 'When you have tried it, note what you did'}</label>
      <textarea class="box" id="evBox" data-draft="ev-${esc(u.id)}" maxlength="600" placeholder="One line is enough. Speak or type.">${esc(Draft['ev-' + u.id] || '')}</textarea></div>
    <div class="row">${micBtn('evBox')}<button class="btn primary small" type="button" data-save-evidence="${esc(u.id)}">${ic('check', 'sm')}Save what I tried</button>
      ${has('habits') ? `<button class="btn quiet small" type="button" data-habit-from="${esc(u.id)}">${ic('repeat', 'sm')}Make this a habit</button>` : ''}</div>
    <p class="u-small">Your note is the evidence for this unit. It goes into your record, which stays with you. Leave out names and private details of other people.</p>`;
}
function checkHtml(u, st) {
  const ans = u.answer, passed = !!(st && st.passed);
  const cls = j => (passed ? (j === ans ? ' right' : '') : U.wrong.includes(j) ? ' wrong' : '');
  let fb = '';
  if (passed) {
    fb = `<div class="fb ok" role="status"><b>Correct.</b> ${esc(u.options[ans])}. ${st.done ? `This unit is complete, and ${st.points} practice points are in your record.` : `To complete the unit and record ${D.ppu} practice points, do the task for today and note what you tried.`}</div>
      ${st.done ? '' : `<div class="row"><button class="btn primary small" type="button" data-step="3">${ic('bolt', 'sm')}Go to the task for today</button></div>`}
      <div class="rate"><span class="lbl" id="rateL">How useful was this unit?</span>
        <div class="caps" role="group" aria-labelledby="rateL">${[1, 2, 3, 4, 5].map(n => `<button class="cap star" type="button" data-stars="${n}" aria-pressed="${st.stars === n}" aria-label="${n} of 5">${n}</button>`).join('')}
        <button class="cap" type="button" data-unclear="1" aria-pressed="${!!st.unclear}">This was unclear</button></div></div>`;
  } else if (U.wrong.length) {
    fb = `<div class="fb" role="status"><b>Not quite.</b> Look at the idea again, then choose once more.</div><div class="row"><button class="btn quiet small" type="button" data-step="1">${ic('chevl', 'sm')}Read the idea again</button></div>`;
  }
  return `<p class="u-text sm" id="chkQ">${esc(u.question)}</p>
    <div class="opts" role="group" aria-labelledby="chkQ">${u.options.map((o, j) => `<button class="opt${cls(j)}" type="button" data-opt="${j}"${passed || U.wrong.includes(j) ? ' aria-disabled="true"' : ''}><b>${'ABC'[j]}</b><span>${esc(o)}</span></button>`).join('')}</div>
    ${fb}
    ${passed ? '' : `<div class="note keep">${ic('shield', 'sm')}<span>Answer this one yourself, without asking an AI assistant. The check is how you find out what you have understood.</span></div>`}`;
}
function stepBody(u, i, st) {
  if (i === 0) return `<p class="u-text">${esc(u.hook)}</p><p class="u-small">${ic('clock', 'sm')} About five minutes. Use Next, or choose any part above.</p>`;
  if (i === 1) return `<p class="u-text sm">${esc(u.idea)}</p>${picture(u) ? `<div class="pic">${picture(u)}</div>` : ''}`;
  if (i === 2) return `<div class="sector-pick"><p class="u-small">Your sector</p><div class="caps" role="group" aria-label="Sector">${sectorCaps('sector')}</div></div>
    <p class="u-text">${esc(exampleFor(u))}</p>${isRegulated() ? `<div class="note">${ic('shield', 'sm')}<span>${esc(L.REGULATED_NOTE)}</span></div>` : ''}`;
  if (i === 3) return `<p class="u-text">${esc(u.tryit)}</p>${evidenceForm(u, st)}`;
  if (i === 4) return `<p class="u-text">${esc(u.caution)}</p><p class="u-small">Every unit carries one quiet caution: what not to do, even when you could.</p>`;
  if (i === 5) { const j = journalFor(u.id), val = Draft['rf-' + u.id] != null ? Draft['rf-' + u.id] : j ? j.text : '';
    return `<p class="u-text">${esc(u.reflection)}</p>
    <div class="field"><label class="sr" for="rfBox">Your reflection</label><textarea class="box" id="rfBox" data-draft="rf-${esc(u.id)}" maxlength="4000" placeholder="In your own words. Speak or type.">${esc(val)}</textarea></div>
    <div class="row">${micBtn('rfBox')}${has('journal') ? `<button class="btn primary small" type="button" data-save-reflection="${esc(u.id)}">${ic('pen', 'sm')}${j ? 'Update my journal' : 'Save to my journal'}</button>` : ''}</div>
    <div class="note keep">${ic('heart', 'sm')}<span>This part is yours: what the idea means for your life, your work and the people it touches. Listen, reflect, then live it. ${has('journal') ? 'Your journal is private and is not part of the record you share.' : 'What you write here stays on this page and is not kept.'}</span></div>`; }
  return checkHtml(u, st);
}
function mapHtml(u, st) {
  const box = (i, icon, cls, text) => `<button class="mbox ${cls}" type="button" data-step="${i}" data-read="1"><span class="mh"><span class="mn">${i + 1}</span>${ic(icon, 'sm')}${esc(STEPS[i])}${(S.seen[u.id] || []).includes(i) ? `<span class="seen">${ic('check', 'sm')}</span>` : ''}</span><span class="mt">${esc(text)}</span></button>`;
  return `<div class="map" aria-label="The unit as one picture">
    ${box(0, 'spark', 'm-hook', u.hook)}
    <span class="mlink" aria-hidden="true"></span>
    ${box(1, 'learn', 'm-idea', u.idea)}
    ${picture(u) ? `<div class="pic">${picture(u)}</div>` : ''}
    <span class="mlink" aria-hidden="true"></span>
    <div class="m3">${box(2, 'target', '', exampleFor(u))}${box(3, 'bolt', 'm-do', u.tryit)}${box(4, 'shield', 'm-caution', u.caution)}</div>
    <span class="mlink" aria-hidden="true"></span>
    <div class="m2">${box(5, 'heart', '', u.reflection)}${box(6, 'check', st && st.passed ? 'm-pass' : '', st && st.passed ? 'Check passed. ' + u.options[u.answer] + '.' : u.question)}</div>
  </div><p class="u-small">Choose any box to open that part.</p>`;
}
function hearHtml(u) {
  const on = U.hearing != null, i = on ? U.hearing : Math.min(U.step, 5);
  return `<div class="hear">
    <button class="btn ${on ? 'on' : 'primary'} bigplay" type="button" data-hear="${on ? 'stop' : 'play'}">${ic(on ? 'stop' : 'play')}${on ? 'Stop' : 'Play the unit aloud'}</button>
    <p class="u-small">${on ? `Reading part ${i + 1} of 6: ${esc(STEPS[i])}.` : 'Parts 1 to 6 are read in order. The check comes last, and you answer it yourself.'}</p>
  </div>
  <div class="hear-text"><span class="eyebrow">${i + 1} · ${esc(STEPS[i])}</span><p class="u-text sm">${esc(i === 2 ? exampleFor(u) : stepText(u, i))}</p></div>
  ${on ? '' : `<div class="row"><button class="btn quiet small" type="button" data-step="6" data-read="1">${ic('check', 'sm')}Go to the check</button></div>`}`;
}
function doHtml(u, st) {
  return `<div class="dotask"><span class="eyebrow">${ic('bolt', 'sm')} Try it today</span><p class="u-text">${esc(u.tryit)}</p></div>
    <div class="note warn">${ic('shield', 'sm')}<span><b>Quiet caution.</b> ${esc(u.caution)}</span></div>
    ${evidenceForm(u, st)}
    <div class="row"><button class="btn quiet small" type="button" data-step="1" data-read="1">${ic('learn', 'sm')}Read the idea first</button><button class="btn quiet small" type="button" data-step="6" data-read="1">${ic('check', 'sm')}Go to the check</button></div>`;
}
function viewUnit() {
  const u = UNITS.get(route.unit), st = uState(u.id);
  if (!u.open) return head(u.title, u.hook) + `<div class="note">${ic('lock', 'sm')}<span>This ${esc(LEVELS[u.level])} unit opens with an edition of the Executive Programme.</span></div><div class="row gap-top"><a class="btn quiet" href="#learn" data-go="learn">${ic('chevl', 'sm')}All units</a></div>`;
  const i = U.step, seen = S.seen[u.id] || [], p = pathwayOf(S.pathway);
  const order = (p && p.units.includes(u.id) ? p.units : D.units.map(x => x.id)).filter(isOpen), at = order.indexOf(u.id), nextId = at >= 0 && at < order.length - 1 ? order[at + 1] : null;
  const mode = S.mode;
  let body;
  if (mode === 'see') body = mapHtml(u, st);
  else if (mode === 'hear') body = hearHtml(u);
  else if (mode === 'do') body = doHtml(u, st);
  else body = `<div class="steps" role="group" aria-label="Parts of the unit">${STEPS.map((s, j) => `<button class="step${seen.includes(j) && j !== i ? ' done' : ''}" type="button" data-step="${j}"${j === i ? ' aria-current="step"' : ''}><b>${j + 1}</b><span>${esc(s)}</span></button>`).join('')}</div>
    <div class="u-body"><p class="eyebrow">Part ${i + 1} of ${STEPS.length} · ${esc(STEPS[i])}</p>${stepBody(u, i, st)}</div>
    <div class="u-nav">
      <button class="btn quiet small${i === 0 ? ' is-hidden' : ''}" type="button" data-unav="-1"${i === 0 ? ' disabled' : ''}>${ic('chevl', 'sm')}Back</button>
      ${i < STEPS.length - 1 ? `<button class="btn primary small" type="button" data-unav="1">Next: ${esc(STEPS[i + 1])}${ic('chev', 'sm')}</button>`
        : nextId ? `<button class="btn ${st && st.done ? 'primary' : 'quiet'} small" type="button" data-open-unit="${esc(nextId)}">Next unit${ic('chev', 'sm')}</button>` : `<a class="btn quiet small" href="#learn" data-go="learn">All units</a>`}
    </div>`;
  return `<div class="crumb"><a class="cap" href="#learn" data-go="learn">${ic('chevl', 'sm')}All units</a>${st && st.done ? `<span class="tag ok">${ic('check', 'sm')}Completed · ${st.points} points</span>` : ''}</div>
  <article class="card unit lift" aria-labelledby="h-unit">
    <div class="unit-top"><div class="grow"><div class="row"><span class="code">${esc(u.id)}</span><span class="tag gold">${esc(LEVELS[u.level])}${u.level === 1 ? ' · free' : ''}</span><span class="st">${esc(D.strands[u.strand])}</span></div><h1 id="h-unit">${esc(u.title)}</h1></div>
      ${mode === 'hear' ? '' : listenBtn('unit', mode === 'read' ? 'Listen to this part' : 'Listen')}</div>
    <div class="modes" role="group" aria-label="How you would like this unit">${MODES.map(m => `<button class="cap" type="button" data-mode="${m[0]}" aria-pressed="${m[0] === mode}" title="${esc(m[3])}">${ic(m[2], 'sm')}${m[1]}</button>`).join('')}</div>
    ${body}
  </article>
  <section class="card pad readcard" aria-labelledby="h-read">
    <div class="row"><h2 id="h-read">Read further, free first</h2><span class="grow"></span><button class="cap" type="button" data-readings="${U.readings ? 0 : 1}" aria-expanded="${U.readings}">${U.readings ? 'Close' : 'Show the readings'}</button></div>
    ${U.readings ? readingsHtml(u) : ''}
  </section>`;
}
function unitSayText() {
  const u = UNITS.get(route.unit); if (!u) return '';
  if (S.mode === 'see') return [0, 1, 2, 3, 4, 5].map(i => `${STEPS[i]}. ${i === 2 ? exampleFor(u) : stepText(u, i)}`).join(' ');
  if (S.mode === 'do') return `Try it today. ${u.tryit} Quiet caution. ${u.caution}`;
  return stepText(u, U.step);
}
function unitGo(i, read) {
  if (i < 0 || i >= STEPS.length) return;
  stopSpeaking(); U.hearing = null; U.step = i; if (read) S.mode = 'read';
  markSeen(U.id, i); save(); render({keep: true});
  const top = $('.unit'); if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({block: 'start'});
}
function hear(i) {
  if (i > 5) { U.hearing = null; U.step = 6; S.mode = 'read'; markSeen(U.id, 6); render({keep: true, speech: true}); toast('That is the whole unit. Now answer the check yourself.'); return; }
  U.hearing = i; U.step = i; markSeen(U.id, i); render({keep: true, speech: true});
  const u = UNITS.get(U.id);
  if (!say(`${STEPS[i]}. ${i === 2 ? exampleFor(u) : stepText(u, i)}`, null, () => hear(i + 1))) { U.hearing = null; render({keep: true}); }
}

/* ---------- Record: practice points, badges, the career path, and the record as a file ---------- */
const X = {ledgerAll: false, confirmDelete: false, importOpen: false, copyText: null, copyWhat: '', verify: null, importErr: '', importPending: null};
function exportRecord() {
  const firsts = Object.values(R.units).filter(u => u.first);
  return {
    format: 'ajan-sns-learning-record', version: 1, pack: D.pack, page: D.page, site: D.site.id, exported: nowIso(),
    sector: S.sector, pathway: S.pathway,
    summary: {points_recorded: R.points, units_complete: R.complete, checks_passed: Object.values(R.units).filter(u => u.passed).length,
      correct_at_first_attempt: firsts.filter(u => u.first.ok).length, first_attempts: firsts.length, badges: R.badges.map(b => b.id)},
    note: 'Points are recorded on the learner\'s own device. They count towards a certificate once a trainer has accepted the evidence. Each entry carries the hash of the one before it, so a later change shows.',
    entries: S.ledger, head: S.ledger.length ? S.ledger[S.ledger.length - 1].hash : null
  };
}
function entryLine(e) {
  const d = e.data || {}, u = e.unit ? UNITS.get(e.unit) : null, name = e.unit ? `${e.unit}${u ? ', ' + u.title : ''}` : '';
  if (e.kind === 'check') return [d.ok ? 'check' : 'info', `Check, ${name}: ${d.ok ? 'correct' : 'not yet correct'}`];
  if (e.kind === 'evidence') return ['bolt', `What you tried, ${name}`];
  if (e.kind === 'points') return ['spark', `${d.points} practice points, ${name}`];
  if (e.kind === 'rating') return ['star', `Your rating, ${name}: ${d.stars ? d.stars + ' of 5' : 'none'}${d.unclear ? ', marked as unclear' : ''}`];
  if (e.kind === 'badge') return ['badge', 'Foundation badge'];
  return ['info', e.kind];
}
function viewRecord() {
  const all = D.units, lv = [1, 2, 3, 4].map(n => { const us = all.filter(u => u.level === n); return {n, total: us.length, open: us.filter(u => u.open).length, done: us.filter(u => isDone(u.id)).length}; });
  const f = lv[0], badge = R.badges.find(b => b.id === 'foundation');
  const firsts = Object.values(R.units).filter(u => u.first), active = L.activeDays(S.ledger.map(e => e.at), today(), 14);
  const waiting = Object.keys(R.units).filter(id => UNITS.has(id) && !R.units[id].done && (R.units[id].passed || R.units[id].evidence.length));
  const entries = S.ledger.slice().reverse(), shown = X.ledgerAll ? entries : entries.slice(0, 6);
  const nextStage = D.stages.find(s => s[2] > R.points) || null;
  return head('My record', 'Every check, every note of what you tried, and your practice points, in one place that stays with you.') + keepCard() + `
  <div class="tiles gap-top">
    <div class="tile"><span class="eyebrow">Practice points</span><span class="num">${R.points}</span><span class="muted">recorded on this device</span></div>
    <div class="tile"><span class="eyebrow">Units completed</span><span class="num">${R.complete}</span><span class="muted">of ${all.filter(u => u.open).length} open here</span></div>
    <div class="tile"><span class="eyebrow">Right first time</span><span class="num">${firsts.length ? firsts.filter(u => u.first.ok).length + '/' + firsts.length : '0'}</span><span class="muted">checks answered</span></div>
    <div class="tile"><span class="eyebrow">Active days</span><span class="num">${active}</span><span class="muted">of the last 14</span></div>
  </div>
  <div class="note gap-top">${ic('info', 'sm')}<span>${S.keep ? 'Your record is kept in this browser, on this device only.' : 'Your record is not being kept: it will be forgotten when you close this page.'} Points are recorded here by you. They count towards a certificate once a trainer has accepted your notes on what you tried.</span></div>
  ${waiting.length ? `<section class="sec" aria-labelledby="h-wait"><div class="sec-h"><h2 id="h-wait">One step left</h2></div>
    <ul class="wait">${waiting.map(id => { const u = UNITS.get(id), st = R.units[id]; return `<li><span class="code">${esc(id)}</span><span class="grow"><b>${esc(u.title)}</b><span>${st.passed ? 'Check passed. Note what you tried to record the points.' : 'You noted what you tried. Take the check to record the points.'}</span></span><button class="btn quiet small" type="button" data-open-unit="${esc(id)}" data-at="${st.passed ? 3 : 6}">${st.passed ? 'Note what I tried' : 'Take the check'}</button></li>`; }).join('')}</ul></section>` : ''}
  <div class="grid2 sec">
    <section aria-labelledby="h-lev"><h2 id="h-lev">Levels</h2>
      <ul class="levels">${lv.map(x => `<li><div class="row"><b>${esc(LEVELS[x.n])}</b>${x.n === 1 ? '<span class="tag ok">Free</span>' : x.open ? '' : `<span class="tag">${ic('lock', 'sm')}With an edition</span>`}<span class="grow"></span><span class="cnt">${x.done} of ${x.open || x.total}</span></div>${bar(x.open ? x.done / x.open * 100 : 0, `${x.done} of ${x.open || x.total} ${LEVELS[x.n]} units completed`)}</li>`).join('')}</ul>
      <div class="badgebox${badge ? ' got' : ''}">${ic('badge', 'lg')}<div><b>Foundation badge</b><span>${badge ? `Earned on ${esc(fmtDate(badge.at))}: all ${badge.units} Foundation units on this page completed.` : `Earned when all ${f.open} Foundation units on this page are complete. You have completed ${f.done}.`}${f.open < D.foundationUnits ? ` ${D.foundationUnits - f.open === 1 ? 'One more Foundation unit is' : (D.foundationUnits - f.open) + ' more Foundation units are'} still to be released; ${D.foundationUnits - f.open === 1 ? 'it brings' : 'they bring'} the level to ${D.foundationUnits * D.ppu} points.` : ''}</span></div></div>
    </section>
    <section aria-labelledby="h-car"><h2 id="h-car">Your career path</h2>
      <ol class="path">${D.stages.map((s, k) => `<li${k === 0 ? ' class="reach"' : ''}><span class="dot">${k === 0 ? ic('spark', 'sm') : k}</span><div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div><small>${s[2]} pts</small></li>`).join('')}</ol>
      <p class="muted fine">${nextStage ? `${R.points} of ${nextStage[2]} points recorded towards ${esc(nextStage[0])}. ` : ''}The stages after Learner are reached with an edition of the Executive Programme, when a trainer has accepted your evidence.</p>
    </section>
  </div>
  <section class="sec" aria-labelledby="h-ent"><div class="sec-h"><h2 id="h-ent">Entries</h2><span class="muted">${plural(S.ledger.length, 'entry', 'entries')}</span></div>
    ${entries.length ? `<ol class="ledger">${shown.map(e => { const x = entryLine(e); return `<li>${ic(x[0], 'sm')}<span class="grow">${esc(x[1])}</span><span class="when">${esc(fmtDate(e.at))}</span><span class="code">${e.n}</span></li>`; }).join('')}</ol>
      ${entries.length > 6 ? `<div class="caps gap-top"><button class="cap more" type="button" data-ledger-all="${X.ledgerAll ? 0 : 1}">${X.ledgerAll ? 'Show the latest six' : `Show all ${entries.length} entries`}</button></div>` : ''}`
      : `<p class="muted">Nothing yet. Your first entry is written when you answer a check or note what you tried.</p>`}
  </section>
  <section class="sec" aria-labelledby="h-file"><div class="sec-h"><h2 id="h-file">Your record as a file</h2></div>
    <p class="muted sec-p">Take your record with you, show it to a trainer, or move it to another device. Your journal is separate and is never part of it.</p>
    <div class="row">
      <button class="btn primary small" type="button" data-rec="download"${S.ledger.length ? '' : ' disabled'}>${ic('down', 'sm')}Download my record</button>
      <button class="btn quiet small" type="button" data-rec="copy"${S.ledger.length ? '' : ' disabled'}>${ic('copy', 'sm')}Copy it</button>
      <button class="btn quiet small" type="button" data-rec="verify"${S.ledger.length ? '' : ' disabled'}>${ic('shield', 'sm')}Check that nothing was changed</button>
      <button class="btn quiet small" type="button" data-rec="import" aria-expanded="${X.importOpen}">${ic('up', 'sm')}Bring a record from another device</button>
    </div>
    ${X.verify ? `<div class="fb${X.verify.ok ? ' ok' : ''} gap-top" role="status">${X.verify.ok ? `All ${plural(X.verify.count, 'entry is', 'entries are')} in order: none has been changed, removed or added out of turn since it was written.` : `Entry ${X.verify.badAt} does not match the entry before it. The record was changed after it was written, so it cannot be relied on from that entry onwards.`}</div>` : ''}
    ${X.copyText != null ? `<div class="copybox gap-top"><label for="copyArea">${esc(X.copyWhat)} could not be saved as a file here. Select all of the text below and copy it into a note or an email to yourself.</label><textarea class="box mono" id="copyArea" readonly>${esc(X.copyText)}</textarea><div class="row"><button class="btn quiet small" type="button" data-copy-area="1">${ic('copy', 'sm')}Copy all</button><button class="cap" type="button" data-copy-close="1">Close</button></div></div>` : ''}
    ${X.importOpen ? `<div class="card pad importbox gap-top"><div class="field"><label for="impFile">Choose the record file</label><input class="box" id="impFile" type="file" accept=".json,application/json,text/plain"></div>
      <div class="field"><label for="impText">Or paste the record here</label><textarea class="box mono" id="impText" data-draft="imp" placeholder="Paste the whole text of the record">${esc(Draft.imp || '')}</textarea></div>
      ${X.importErr ? `<p class="err" role="alert">${esc(X.importErr)}</p>` : ''}
      ${X.importPending ? `<div class="note warn">${ic('info', 'sm')}<span>This record has ${plural(X.importPending.entries.length, 'entry', 'entries')}. Loading it replaces the ${plural(S.ledger.length, 'entry', 'entries')} now on this page.</span></div>
        <div class="row"><button class="btn danger small" type="button" data-rec="import-yes">Replace my record with it</button><button class="btn quiet small" type="button" data-rec="import-no">Keep what I have</button></div>`
      : `<div class="row"><button class="btn primary small" type="button" data-rec="import-load">${ic('up', 'sm')}Load this record</button><button class="cap" type="button" data-rec="import">Close</button></div>`}</div>` : ''}
  </section>
  <section class="sec" aria-labelledby="h-del"><div class="sec-h"><h2 id="h-del">Keeping and deleting</h2></div>
    <div class="row">
      ${S.keep ? `<span class="tag ok">${ic('check', 'sm')}Kept on this device</span><button class="btn quiet small" type="button" data-keep="stop">Stop keeping it here</button>` : `<button class="btn quiet small" type="button" data-keep="1">${ic('check', 'sm')}Keep on this device</button>`}
      ${X.confirmDelete ? `<span class="grow"></span><span class="err">Delete your record, habits and journal for good?</span><button class="btn danger small" type="button" data-rec="delete-yes">${ic('trash', 'sm')}Yes, delete everything</button><button class="btn quiet small" type="button" data-rec="delete-no">No, keep it</button>`
        : `<button class="btn danger small" type="button" data-rec="delete">${ic('trash', 'sm')}Delete everything</button>`}
    </div>
    <p class="muted fine gap-top">Deleting removes your record, habits and journal from this browser. It cannot be undone, so download your record first if you may want it again.</p>
  </section>`;
}
function loadImport(text) {
  let o; try { o = JSON.parse(text); } catch (e) { return 'This is not a record file: it could not be read. Paste the whole text, from the first bracket to the last.'; }
  if (!o || o.format !== 'ajan-sns-learning-record' || !Array.isArray(o.entries)) return 'This file is not an Ajan SNS learning record.';
  if (o.version !== 1) return 'This record was made by a newer version of the page and cannot be loaded here.';
  if (o.entries.length > 5000) return 'This record is too large to load.';
  const v = L.verifyLedger(o.entries);
  if (!v.ok) return `Entry ${v.badAt} of this record does not match the entry before it, so the record was changed after it was written. It has not been loaded.`;
  X.importPending = {entries: o.entries, sector: o.sector, pathway: o.pathway}; return '';
}
function applyImport() {
  const p = X.importPending; if (!p) return;
  S.ledger = p.entries;
  if (SECTORS.some(s => s[0] === p.sector)) S.sector = p.sector;
  if (p.pathway === 'all' || D.site.pathways.includes(p.pathway)) S.pathway = p.pathway;
  X.importPending = null; X.importOpen = false; X.importErr = ''; X.verify = null; Draft.imp = '';
  refresh(); save();
  toast(`Record loaded: ${plural(S.ledger.length, 'entry', 'entries')}, ${R.points} practice points.`);
}
async function fileOut(name, text, mime, what) {
  const r = await saveFile(name, text, mime);
  if (r === 'saved') toast(`${what} saved as ${name}.`);
  else if (r === 'declined') toast('Nothing was saved.');
  else { X.copyText = text; X.copyWhat = what; render({keep: true}); const a = $('#copyArea'); if (a) { a.focus(); a.select(); } }
}

/* ---------- Habits: one to three tiny habits, kept kindly ---------- */
const HABIT_DAYS = 66, HABIT_MAX = 3;
const HX = {confirm: null, ended: false};
function habitCard(h) {
  const t = today(), log = h.log || {}, on = !!log[t], run = L.streak(log, t), total = Object.keys(log).length, day = L.daysBetween(h.start, t) + 1;
  const missed = !on && !log[L.addDays(t, -1)] && total > 0;
  const msg = total >= HABIT_DAYS ? 'About two months of practice: the average time a new habit takes to feel automatic. Keep it, or retire it and begin another.'
    : on ? `Done today. ${run > 1 ? plural(run, 'day', 'days') + ' in a row.' : 'A good start.'}`
    : missed ? 'A missed day does not undo a habit. Begin again today.'
    : total ? `${plural(run, 'day', 'days')} in a row. Tick today when you have done it.` : 'Tick today when you have done it for the first time.';
  const dots = []; for (let k = 13; k >= 0; k--) { const key = L.addDays(t, -k), before = key < h.start; dots.push(`<button class="dot${log[key] ? ' on' : ''}${k === 0 ? ' now' : ''}" type="button" data-habit-day="${esc(h.id)}:${key}" aria-pressed="${!!log[key]}" aria-label="${esc(fmtDate(key + 'T12:00:00'))}${log[key] ? ', done' : ', not done'}"${before ? ' disabled' : ''}></button>`); }
  return `<article class="card pad habit" aria-label="${esc(h.name)}">
    <div class="row"><div class="grow"><h3>${esc(h.name)}</h3>${h.cue ? `<p class="muted">After ${esc(h.cue)}</p>` : ''}</div><span class="tag">${ic('cal', 'sm')}Day ${day}</span></div>
    <div class="dots" role="group" aria-label="The last 14 days">${dots.join('')}</div>
    <p class="hmsg">${esc(msg)}</p>
    <div class="prog"><span>${total} of about ${HABIT_DAYS} days</span>${bar(total / HABIT_DAYS * 100, `${total} of about ${HABIT_DAYS} days done`)}</div>
    <div class="row"><button class="btn ${on ? 'quiet' : 'primary'} small" type="button" data-habit-tick="${esc(h.id)}" aria-pressed="${on}">${ic('check', 'sm')}${on ? 'Done today' : 'I did it today'}</button>
      ${HX.confirm === h.id ? `<span class="grow"></span><button class="btn quiet small" type="button" data-habit-end="${esc(h.id)}">Retire it, keep its days</button><button class="btn danger small" type="button" data-habit-del="${esc(h.id)}">${ic('trash', 'sm')}Delete it</button><button class="cap" type="button" data-habit-ask="">Cancel</button>`
        : `<button class="cap" type="button" data-habit-ask="${esc(h.id)}">Retire or delete</button>`}</div>
  </article>`;
}
function viewHabits() {
  const active = S.habits.filter(h => !h.ended), ended = S.habits.filter(h => h.ended);
  const u = UNITS.get('S1-01');
  return head('Habits', 'One to three tiny habits, each linked to something you already do every day.') + keepCard() + `
  <div class="note gap-top">${ic('info', 'sm')}<span>A new daily habit takes about 66 days on average to feel automatic, with a range from 18 to 254 days (Lally and colleagues, 2010). Missing a day does not undo it.${u && u.open ? ` <a href="#unit-S1-01" data-go="unit-S1-01">The unit “${esc(u.title)}” explains why.</a>` : ''}</span></div>
  ${active.length ? `<div class="habits sec">${active.map(habitCard).join('')}</div>` : ''}
  <section class="sec" aria-labelledby="h-newh"><div class="sec-h"><h2 id="h-newh">${active.length ? 'Add a habit' : 'Start your first habit'}</h2></div>
    ${active.length >= HABIT_MAX ? `<p class="muted">Three habits at a time are enough. Retire one when it has become automatic, and then add another.</p>` : `<form class="card pad stack" id="habitForm" autocomplete="off">
      <div class="grid2 tight"><div class="field"><label for="hCue">After I…</label><input class="box" id="hCue" data-draft="hCue" type="text" maxlength="80" placeholder="for example: have my morning tea" value="${esc(Draft.hCue || '')}"><span class="hint">Something you already do every day.</span></div>
      <div class="field"><label for="hName">I will…</label><input class="box" id="hName" data-draft="hName" type="text" maxlength="140" placeholder="for example: write today's three priorities" value="${esc(Draft.hName || '')}"><span class="hint">Keep the first step tiny: two minutes or less.</span></div></div>
      ${HX.err ? `<p class="err" role="alert">${esc(HX.err)}</p>` : ''}
      <div class="row">${micBtn('hName', 'Speak the habit')}<button class="btn primary small" type="submit">${ic('plus', 'sm')}Add this habit</button></div></form>`}
  </section>
  ${ended.length ? `<section class="sec" aria-labelledby="h-oldh"><div class="sec-h"><h2 id="h-oldh">Retired habits</h2><button class="cap" type="button" data-habits-ended="${HX.ended ? 0 : 1}" aria-expanded="${HX.ended}">${HX.ended ? 'Hide' : `Show ${ended.length}`}</button></div>
    ${HX.ended ? `<ul class="wait">${ended.map(h => `<li><span class="grow"><b>${esc(h.name)}</b><span>${plural(Object.keys(h.log || {}).length, 'day', 'days')} done, from ${esc(fmtDate(h.start + 'T12:00:00'))} to ${esc(fmtDate(h.ended + 'T12:00:00'))}</span></span><button class="cap" type="button" data-habit-del="${esc(h.id)}">${ic('trash', 'sm')}Delete</button></li>`).join('')}</ul>` : ''}</section>` : ''}`;
}
function addHabit() {
  const name = (Draft.hName || '').trim(), cue = (Draft.hCue || '').trim().replace(/^after\s+(i\s+)?/i, '');
  if (!name) { HX.err = 'Say what the tiny habit is.'; render({keep: true}); const b = $('#hName'); if (b) b.focus(); return; }
  if (S.habits.filter(h => !h.ended).length >= HABIT_MAX) return;
  S.habits.push({id: uid(), name: name.slice(0, 140), cue: cue.slice(0, 80), start: today(), log: {}, ended: null});
  Draft.hName = ''; Draft.hCue = ''; HX.err = ''; save(); render({keep: true}); toast('Habit added. Tick it each day you do it.');
}
function tickHabit(id, key) {
  const h = S.habits.find(x => x.id === id); if (!h) return;
  h.log = h.log || {}; key = key || today();
  if (key < h.start || key > today()) return;
  if (h.log[key]) delete h.log[key]; else h.log[key] = 1;
  save(); render({keep: true});
  if (h.log[key] && key === today()) { const run = L.streak(h.log, today()); toast(run > 1 ? `Done today. ${run} days in a row.` : 'Done today. Well begun.'); }
}

/* ---------- Journal: private notes against each unit's question, and your own ---------- */
const JX = {edit: null, del: null, q: '', anchor: null};
function viewJournal() {
  const list = S.journal.slice().sort((a, b) => (a.at < b.at ? 1 : -1));
  return head('Journal', 'Your own words, kept for you. Nobody else reads them, and no AI assistant sees them.') + keepCard() + `
  <section class="card pad stack gap-top" aria-labelledby="h-newj">
    <h2 id="h-newj">${JX.q ? 'Your answer' : 'A new note'}</h2>
    ${JX.q ? `<p class="aq">${esc(JX.q)}</p>` : ''}
    <div class="field"><label class="sr" for="jBox">Your note</label><textarea class="box tall" id="jBox" data-draft="jBox" maxlength="4000" placeholder="${JX.q ? 'In your own words. Speak or type.' : 'Three lines about today, or anything you want to keep. Speak or type.'}">${esc(Draft.jBox || '')}</textarea></div>
    <div class="row">${micBtn('jBox')}<button class="btn primary small" type="button" data-journal="save">${ic('pen', 'sm')}Save this note</button>${JX.q ? `<button class="cap" type="button" data-journal="noq">Write without the question</button>` : ''}</div>
  </section>
  <section class="sec" aria-labelledby="h-jl"><div class="sec-h"><h2 id="h-jl">Your notes</h2><span class="muted">${plural(list.length, 'note', 'notes')}</span></div>
    ${list.length ? `<ul class="jlist">${list.map(j => { const u = j.unit ? UNITS.get(j.unit) : null;
      return `<li class="card pad jentry"><div class="row"><span class="when">${esc(fmtDate(j.at))}</span>${u ? `<a class="tag gold" href="#unit-${esc(u.id)}" data-go="unit-${esc(u.id)}">${esc(u.id)} · ${esc(u.title)}</a>` : ''}<span class="grow"></span>
        ${JX.del === j.id ? `<button class="btn danger small" type="button" data-journal-del-yes="${esc(j.id)}">Delete this note</button><button class="cap" type="button" data-journal-del="">Keep it</button>`
          : JX.edit === j.id ? '' : `<button class="cap" type="button" data-journal-edit="${esc(j.id)}">${ic('pen', 'sm')}Edit</button><button class="cap" type="button" data-journal-del="${esc(j.id)}" aria-label="Delete this note">${ic('trash', 'sm')}</button>`}</div>
        ${j.q ? `<p class="jq">${esc(j.q)}</p>` : ''}
        ${JX.edit === j.id ? `<div class="field"><label class="sr" for="jEdit">Edit your note</label><textarea class="box" id="jEdit" data-draft="jEdit" maxlength="4000">${esc(Draft.jEdit != null ? Draft.jEdit : j.text)}</textarea></div><div class="row">${micBtn('jEdit')}<button class="btn primary small" type="button" data-journal-edit-save="${esc(j.id)}">Save</button><button class="cap" type="button" data-journal-edit="">Cancel</button></div>`
          : `<p class="jt">${esc(j.text)}</p>`}</li>`; }).join('')}</ul>
      <div class="row gap-top"><button class="btn quiet small" type="button" data-journal="download">${ic('down', 'sm')}Download my journal</button><button class="btn quiet small" type="button" data-journal="copy">${ic('copy', 'sm')}Copy it</button></div>`
      : `<p class="muted">No notes yet. Each unit ends with a question to reflect on, and your answer is saved here.</p>`}
    ${X.copyText != null && route.view === 'journal' ? `<div class="copybox gap-top"><label for="copyArea">${esc(X.copyWhat)} could not be saved as a file here. Select all of the text below and copy it into a note or an email to yourself.</label><textarea class="box mono" id="copyArea" readonly>${esc(X.copyText)}</textarea><div class="row"><button class="btn quiet small" type="button" data-copy-area="1">${ic('copy', 'sm')}Copy all</button><button class="cap" type="button" data-copy-close="1">Close</button></div></div>` : ''}
  </section>`;
}
function journalText() {
  const list = S.journal.slice().sort((a, b) => (a.at < b.at ? -1 : 1));
  return 'My journal\n' + '='.repeat(10) + '\n\n' + list.map(j => { const u = j.unit ? UNITS.get(j.unit) : null;
    return `${fmtDate(j.at)}${u ? ' · ' + u.id + ' ' + u.title : ''}\n${j.q ? j.q + '\n' : ''}${j.text}\n`; }).join('\n');
}
function saveReflection(unitId) {
  const u = UNITS.get(unitId), box = $('#rfBox'), text = (box ? box.value : Draft['rf-' + unitId] || '').trim();
  if (!text) { toast('Write or speak a few words first.'); if (box) box.focus(); return; }
  const j = journalFor(unitId);
  if (j) { j.text = text.slice(0, 4000); j.edited = nowIso(); } else S.journal.push({id: uid(), at: nowIso(), unit: unitId, q: u.reflection, text: text.slice(0, 4000)});
  delete Draft['rf-' + unitId]; save(); render({keep: true}); toast('Saved to your journal. It is private to you.');
}

/* ---------- Quiz of the day: five checks from the Foundation units, for practice only ---------- */
const Q = {day: null, ids: [], i: 0, picks: []};
function quizSetup() {
  const t = today(); if (Q.day === t && Q.ids.length) return;
  const pool = D.units.filter(u => u.open && u.level === 1).map(u => u.id);
  let seed = dayNumber() * 9301 + 49297;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const a = pool.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
  Q.day = t; Q.ids = a.slice(0, 5); Q.i = 0; Q.picks = [];
}
function viewQuiz() {
  quizSetup();
  const n = Q.ids.length;
  if (Q.i >= n) {
    const right = Q.picks.filter((p, k) => p === UNITS.get(Q.ids[k]).answer).length, miss = Q.ids.filter((id, k) => Q.picks[k] !== UNITS.get(id).answer);
    return head('Quiz of the day', '') + `<article class="card unit lift"><div class="tiles"><div class="tile"><span class="eyebrow">Today</span><span class="num">${right}/${n}</span><span class="muted">answered correctly</span></div></div>
      ${miss.length ? `<h2 class="gap-top">Worth another look</h2><div class="ulist gap-top">${miss.map(id => unitCard(UNITS.get(id))).join('')}</div>` : `<p class="u-text sm gap-top">All ${n} correct. The same five questions stay until tomorrow, when a new set comes.</p>`}
      <div class="row gap-top"><button class="btn quiet small" type="button" data-quiz="again">${ic('repeat', 'sm')}Try the five again</button><a class="btn primary small" href="#learn" data-go="learn">${ic('learn', 'sm')}Back to the units</a></div>
      <p class="u-small gap-top">The quiz is for practice. It adds no points and writes nothing to your record.</p></article>`;
  }
  const u = UNITS.get(Q.ids[Q.i]), pick = Q.picks[Q.i], done = pick != null;
  return head('Quiz of the day', 'Five questions from the Foundation units, for practice.') + `<article class="card unit lift">
    <div class="row"><span class="code">Question ${Q.i + 1} of ${n}</span><span class="st">${esc(D.strands[u.strand])}</span></div>
    <p class="u-text sm" id="qzQ">${esc(u.question)}</p>
    <div class="opts" role="group" aria-labelledby="qzQ">${u.options.map((o, j) => `<button class="opt${done ? (j === u.answer ? ' right' : j === pick ? ' wrong' : '') : ''}" type="button" data-quiz-opt="${j}"${done ? ' aria-disabled="true"' : ''}><b>${'ABC'[j]}</b><span>${esc(o)}</span></button>`).join('')}</div>
    ${done ? `<div class="fb${pick === u.answer ? ' ok' : ''}" role="status">${pick === u.answer ? '<b>Correct.</b>' : `<b>Not this time.</b> The answer is ${'ABC'[u.answer]}: ${esc(u.options[u.answer])}.`} From the unit “${esc(u.title)}”.</div>
      <div class="u-nav"><span></span><button class="btn primary small" type="button" data-quiz="next">${Q.i < n - 1 ? 'Next question' : 'See my result'}${ic('chev', 'sm')}</button></div>` : ''}
  </article>`;
}

/* ---------- pictures for the See mode (drawn for this page; colours come from the page's own tokens) ---------- */
const arrowHead = id => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="hd" d="M0 0 10 5 0 10z"/></marker></defs>`;
function beChart(price, variable, fixed, units) {
  const be = fixed / (price - variable), maxU = Math.max(be * 1.75, (units || 0) * 1.12), maxV = maxU * price;
  const W = 360, H = 226, l = 16, r = 16, t = 18, b = 46, x = u => l + u / maxU * (W - l - r), y = v => H - b - v / maxV * (H - t - b);
  const n = v => v.toFixed(1), ex = units && units > 0 ? x(units) : null;
  const beText = `Break-even: ${fmt(be, 0)} units`, exText = `Expected: ${fmt(units || 0, 0)} units`;
  const mid = (v, text, w) => { const half = Math.min(W / 2, text.length * w / 2 + 5); return n(Math.min(W - half, Math.max(half, v))); };   /* w: the width of an average letter */
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Break-even chart: the sales line crosses the total cost line at ${fmt(be, 0)} units.">
    <path class="ax" d="M${l} ${t}V${H - b}H${W - r}"/>
    <path class="fx" d="M${l} ${n(y(fixed))}H${W - r}"/>
    <path class="tc" d="M${l} ${n(y(fixed))}L${W - r} ${n(y(fixed + variable * maxU))}"/>
    <path class="rv" d="M${l} ${H - b}L${W - r} ${n(y(price * maxU))}"/>
    <path class="dr" d="M${n(x(be))} ${n(y(be * price))}V${H - b}"/>
    ${ex ? `<path class="exl" d="M${n(ex)} ${t + 4}V${H - b}"/><text class="lb m ext" x="${mid(ex, exText, 7.3)}" y="${H - 8}">${exText}</text>` : ''}
    <circle class="pt" cx="${n(x(be))}" cy="${n(y(be * price))}" r="5"/>
    <path class="rv" d="M24 28h18"/><text class="lb" x="48" y="32.5">Sales</text>
    <path class="tc" d="M24 45h18"/><text class="lb" x="48" y="49.5">Total cost</text>
    <path class="fx" d="M24 62h18"/><text class="lb" x="48" y="66.5">Fixed costs</text>
    <text class="lb m b" x="${mid(x(be), beText, 7.8)}" y="${H - 26}">${beText}</text>
  </svg>`;
}
const PICS = {
  'S1-01': () => `<svg class="chart" viewBox="0 0 360 200" role="img" aria-label="A habit is a loop: a cue leads to a routine, the routine to a reward, and the reward strengthens the cue.">
    ${arrowHead('ah1')}
    <path class="ar" d="M130 58 Q180 32 230 58" marker-end="url(#ah1)"/><path class="ar" d="M290 100 Q288 158 240 164" marker-end="url(#ah1)"/><path class="ar" d="M120 164 Q72 158 70 102" marker-end="url(#ah1)"/>
    <rect class="nd" x="14" y="40" width="112" height="56" rx="14"/><text class="lb m b" x="70" y="64">Cue</text><text class="lb m s" x="70" y="82">after morning tea</text>
    <rect class="nd" x="234" y="40" width="112" height="56" rx="14"/><text class="lb m b" x="290" y="64">Routine</text><text class="lb m s" x="290" y="82">three priorities</text>
    <rect class="nd2" x="124" y="136" width="112" height="56" rx="14"/><text class="lb m b" x="180" y="160">Reward</text><text class="lb m s" x="180" y="178">tick the day</text>
    <text class="lb m" x="180" y="20">keep the first step tiny</text></svg>`,
  'S6-01': () => `<svg class="chart" viewBox="0 0 360 150" role="img" aria-label="Three kinds of cost as volume rises: a fixed cost stays level, a variable cost rises from zero, and a mixed cost starts above zero and rises.">
    ${[['Fixed', 'M0 30H92'], ['Variable', 'M0 78L92 12'], ['Mixed', 'M0 54L92 14']].map((c, k) => `<g transform="translate(${16 + k * 116} 16)"><path class="ax" d="M0 0V78H92"/><path class="${k === 0 ? 'tc' : k === 1 ? 'rv' : 'mx'}" d="${c[1]}"/><text class="lb m b" x="46" y="100">${c[0]}</text><text class="lb m s" x="46" y="118">${['stays level', 'rises with volume', 'part of each'][k]}</text></g>`).join('')}</svg>`,
  'S6-02': () => beChart(250, 150, 20000, 300),
  'S7-01': () => `<svg class="chart" viewBox="0 0 360 144" role="img" aria-label="Profit is counted when the invoice is sent; the cash arrives weeks later. The gap between the two has to be funded.">
    <path class="ax" d="M20 96H340"/>${[1, 2, 3, 4, 5, 6, 7, 8].map(w => `<path class="ax" d="M${20 + w * 36} 92v8"/><text class="lb m s" x="${20 + w * 36}" y="116">${w}</text>`).join('')}<text class="lb m s" x="180" y="136">weeks</text>
    <path class="dr" d="M56 46V88"/><path class="dr" d="M272 30V88"/>
    <circle class="pt" cx="56" cy="96" r="6"/><text class="lb b" x="22" y="22">Invoice sent:</text><text class="lb" x="22" y="39">profit is counted</text>
    <circle class="pt2" cx="272" cy="96" r="6"/><text class="lb e b" x="338" y="22">Cash arrives</text>
    <path class="gap" d="M66 78H262"/><text class="lb m" x="164" y="68">the gap you must fund</text></svg>`,
  'S8-02': () => `<svg class="chart" viewBox="0 0 360 160" role="img" aria-label="A safety cushion built in steps: first one month of essential costs, then three, then six.">
    <path class="ax" d="M20 128H340"/>${[[1, 20], [3, 54], [6, 96]].map((s, k) => `<rect class="${k === 0 ? 'bar1' : 'bar0'}" x="${48 + k * 100}" y="${128 - s[1]}" width="64" height="${s[1]}" rx="6"/><text class="lb m b" x="${80 + k * 100}" y="${118 - s[1]}">${s[0]} ${s[0] === 1 ? 'month' : 'months'}</text>`).join('')}
    <text class="lb m s" x="180" y="150">of essential costs set aside: begin with one</text></svg>`,
  'S10-01': () => `<svg class="chart" viewBox="0 0 360 138" role="img" aria-label="One customer request passes through six steps in order: lead, quote, order, delivery, invoice and cash.">
    ${arrowHead('ah2')}
    ${[['Lead', 12, 8], ['Quote', 130, 8], ['Order', 248, 8], ['Deliver', 248, 70], ['Invoice', 130, 70], ['Cash', 12, 70]].map((s, k) => `<rect class="${k === 5 ? 'nd2' : 'nd'}" x="${s[1]}" y="${s[2]}" width="100" height="38" rx="10"/><text class="lb m b" x="${s[1] + 50}" y="${s[2] + 24}">${k + 1} ${s[0]}</text>`).join('')}
    <path class="ar" d="M115 27h11" marker-end="url(#ah2)"/><path class="ar" d="M233 27h11" marker-end="url(#ah2)"/><path class="ar" d="M298 49v17" marker-end="url(#ah2)"/><path class="ar" d="M245 89h-11" marker-end="url(#ah2)"/><path class="ar" d="M127 89h-11" marker-end="url(#ah2)"/>
    <text class="lb m s" x="180" y="130">circle the slowest handoff</text></svg>`
};
function picture(u) { const f = PICS[u.id]; return f ? f() : ''; }

/* ---------- Tools: the decision calculators, the business health check and the money habits ---------- */
const N = (key, label, opt, hint) => ({key, label, opt: !!opt, hint: hint || ''});
const TOOLS = [
  {id: 'breakeven', group: 'decide', name: 'Break-even and margin of safety', icon: 'scale', units: ['S6-02', 'S6-01'],
    lede: 'How much you must sell to cover your costs, and how far sales can fall before you make a loss.',
    fields: [N('price', 'Price for each unit'), N('variable', 'Variable cost for each unit'), N('fixed', 'Fixed costs for the period'), N('units', 'Sales you expect, in units', true)],
    example: {price: '400', variable: '240', fixed: '64000', units: '520'}, calc: v => L.breakEven(v),
    rows: r => [['Contribution from each unit', fmt(r.contribution)], ['Contribution as a share of the price', fmt(r.ratio * 100, 1) + '%'], ['Break-even volume', fmt(r.beUnits, 1) + ' units', 'key'], ['Break-even sales', fmt(r.beRevenue)]]
      .concat(r.units ? [['Margin of safety', `${fmt(r.mosUnits, 1)} units (${fmt(r.mosPct, 1)}%)`], [r.profit >= 0 ? 'Profit at the sales you expect' : 'Loss at the sales you expect', fmt(Math.abs(r.profit))]] : [])
      .concat([['Break-even if the price falls by 10%', r.priceDown10 ? fmt(r.priceDown10, 1) + ' units' : 'no volume covers the costs'], ['Break-even if the variable cost rises by 10%', r.variableUp10 ? fmt(r.variableUp10, 1) + ' units' : 'no volume covers the costs']]),
    words: r => `You cover your costs at ${fmt(r.beUnits, 1)} units. ` + (r.units ? (r.mosUnits >= 0 ? `At ${fmt(r.units)} units, sales could fall by ${fmt(r.mosPct, 1)} per cent before you make a loss, and the profit is ${fmt(r.profit)}.` : `At ${fmt(r.units)} units you are below that point, with a loss of ${fmt(-r.profit)}.`) : 'Add the sales you expect to see your margin of safety.'),
    chart: (r, v) => beChart(L.num(v.price), L.num(v.variable), L.num(v.fixed), r.units || 0)},
  {id: 'scarce', group: 'decide', name: 'Best use of a scarce resource', icon: 'target', units: ['S6-05', 'S5-04'],
    lede: 'When hours, machines or materials are short, rank what you make by what each earns for every unit of the scarce resource.',
    fields: [N('available', 'Scarce resource you have', false, 'For example machine hours or skilled hours in the period.')],
    list: {key: 'products', min: 3, max: 6, add: 'Add a product or service', cols: [['name', 'Product or service', 'text'], ['contribution', 'Contribution for each unit'], ['use', 'Resource used for each unit'], ['demand', 'Demand, in units']]},
    example: {available: '800', products: [{name: 'A', contribution: '45', use: '3', demand: '150'}, {name: 'B', contribution: '32', use: '1', demand: '300'}, {name: 'C', contribution: '70', use: '4', demand: '120'}]},
    calc: v => L.scarce(v),
    table: r => ({head: ['Rank', 'Product or service', 'Earned for each unit of the resource', 'Make', 'Contribution'], rows: r.ranked.map((p, k) => [k + 1, p.name, fmt(p.per), fmt(p.make), fmt(p.total)])}),
    rows: r => [['Total contribution', fmt(r.total), 'key'], ['Resource left unused', fmt(r.unused)]],
    words: r => `Make ${r.ranked[0].name} first. It earns the most for each unit of the scarce resource, ${fmt(r.ranked[0].per)}, which matters more here than what it earns for each unit sold. This plan gives a total contribution of ${fmt(r.total)}.`},
  {id: 'makebuy', group: 'decide', name: 'Make or buy', icon: 'case', units: ['S6-04', 'S6-03'],
    lede: 'Compare only the costs that change with the decision.',
    fields: [N('units', 'Units needed'), N('supplierPrice', 'Supplier price for each unit'), N('variableCost', 'Your variable cost for each unit'), N('avoidableFixed', 'Fixed costs you would save by buying', true),
      N('unavoidable', 'Overheads you pay either way', true, 'Shown for comparison only; they do not change the answer.'), N('opportunity', 'What the freed space or time could earn', true)],
    example: {units: '5000', supplierPrice: '31', variableCost: '24', avoidableFixed: '28000', unavoidable: '40000', opportunity: ''}, calc: v => L.makeOrBuy(v),
    rows: r => [['Relevant cost of making', fmt(r.make)], ['Cost of buying', fmt(r.buy)], [r.choice === 'either' ? 'The two cost the same' : r.choice === 'make' ? 'Making saves' : 'Buying saves', r.choice === 'either' ? '' : fmt(r.saves), 'key']]
      .concat(r.unavoidable ? [['Left out: overheads you pay either way', fmt(r.unavoidable)]] : []),
    words: r => (r.choice === 'either' ? 'On cost alone the two are equal, so decide on quality, reliability and control.' : `On cost alone, ${r.choice === 'make' ? 'making' : 'buying'} is better by ${fmt(r.saves)}.`) + (r.unavoidable ? ` The overheads of ${fmt(r.unavoidable)} that you pay either way are left out, because the decision does not change them.` : '') + ' Weigh quality, reliability of supply and what your people would lose or gain as well.'},
  {id: 'special', group: 'decide', name: 'A special order', icon: 'pkg', units: ['S6-05'],
    lede: 'Whether a one-off order below your usual price still adds to profit.',
    fields: [N('capacity', 'Capacity in the period, in units'), N('currentSales', 'Regular sales, in units'), N('regularPrice', 'Regular price'), N('variableCost', 'Variable cost for each unit'), N('orderUnits', 'Size of the special order, in units'), N('specialPrice', 'Price offered for the order'), N('oneOffCost', 'One-off cost of the order', true)],
    example: {capacity: '6000', currentSales: '5000', regularPrice: '80', variableCost: '46', orderUnits: '800', specialPrice: '60', oneOffCost: '3000'}, calc: v => L.specialOrder(v),
    rows: r => [['Spare capacity', fmt(r.spare) + ' units'], ['Regular sales given up', fmt(r.displaced) + ' units'], ['Contribution from the order', fmt(r.gain)], ['Contribution lost on regular sales', fmt(r.lost)], ['One-off cost', fmt(r.oneOff)], [r.profit >= 0 ? 'Extra profit' : 'Extra loss', fmt(Math.abs(r.profit)), 'key']],
    words: r => (r.accept ? `The order adds ${fmt(r.profit)} to profit, so on the figures it is worth accepting.` : `The order ${r.profit === 0 ? 'adds nothing to profit' : 'reduces profit by ' + fmt(-r.profit)}, so on the figures it is not worth accepting.`) + (r.displaced ? ` It would push out ${fmt(r.displaced)} units of regular sales.` : ' It fits within your spare capacity.') + ' Your fixed costs are left out, because the order does not change them. Consider also how regular customers would see the lower price.'},
  {id: 'flex', group: 'decide', name: 'Flexible budget and variances', icon: 'pulse', units: ['S7-03', 'S7-02'],
    lede: 'Compare actual costs with what the budget allows at the volume you actually reached.',
    fields: [N('budgetUnits', 'Budgeted volume, in units'), N('budgetVarPerUnit', 'Budgeted variable cost for each unit'), N('budgetFixed', 'Budgeted fixed costs'), N('actualUnits', 'Actual volume, in units'), N('actualVariable', 'Actual variable costs, in total'), N('actualFixed', 'Actual fixed costs'), N('budgetPrice', 'Budgeted price for each unit', true), N('actualRevenue', 'Actual sales, in total', true)],
    example: {budgetUnits: '4000', budgetVarPerUnit: '18', budgetFixed: '30000', actualUnits: '4400', actualVariable: '81400', actualFixed: '29200', budgetPrice: '32', actualRevenue: '138600'}, calc: v => L.flexBudget(v),
    rows: r => [['Variable costs in the original budget', fmt(r.staticVar)], ['Variable costs the budget allows at the actual volume', fmt(r.flexVar)], ['Change explained by volume alone', fmt(r.volumeEffect)],
      ['Spending variance on variable costs', r.spendingSide === 'none' ? 'none' : `${fmt(r.spending)} ${r.spendingSide}`, 'key'], ['Fixed cost variance', r.fixedSide === 'none' ? 'none' : `${fmt(r.fixedVar)} ${r.fixedSide}`]]
      .concat(r.flexRevenue != null ? [['Sales the budget allows at the actual volume', fmt(r.flexRevenue)], ['Sales price variance', r.priceSide === 'none' ? 'none' : `${fmt(r.priceVar)} ${r.priceSide}`], ['Actual price for each unit', fmt(r.actualPrice)]] : []),
    words: r => `At the volume you actually reached, the budget allows ${fmt(r.flexVar)} of variable costs. ` + (r.spendingSide === 'none' ? 'You spent exactly that.' : `You spent ${fmt(r.spending)} ${r.spendingSide === 'adverse' ? 'more' : 'less'} than that, which is the part to explain.`) + ` The ${fmt(Math.abs(r.volumeEffect))} that came from ${r.volumeEffect >= 0 ? 'higher' : 'lower'} volume alone is not a sign of good or poor cost control.`},
  {id: 'cost', group: 'decide', name: 'Estimate costs from past figures', icon: 'search', units: ['S6-06', 'S6-01'],
    lede: 'Split a cost into its fixed and variable parts from a few past periods, in two ways.',
    list: {key: 'points', min: 6, max: 12, add: 'Add a period', cols: [['x', 'Activity'], ['y', 'Total cost']], rowLabel: k => `Period ${k + 1}`},
    fields: [N('at', 'Activity you plan for', true)],
    example: {at: '500', points: [{x: '400', y: '9800'}, {x: '520', y: '11300'}, {x: '310', y: '8400'}, {x: '610', y: '12900'}, {x: '450', y: '10500'}, {x: '560', y: '12100'}]},
    calc: v => L.costEstimate({at: v.at, points: (v.points || []).map(p => [p.x, p.y])}),
    rows: r => [['High and low periods: variable cost for each unit of activity', fmt(r.highLow.rate)], ['High and low periods: fixed cost', fmt(r.highLow.fixed)]]
      .concat(r.highLow.predicted != null ? [['High and low periods: cost at the activity you plan', fmt(r.highLow.predicted)]] : [])
      .concat(r.regression ? [['Line of best fit: variable cost for each unit of activity', fmt(r.regression.rate), 'key'], ['Line of best fit: fixed cost', fmt(r.regression.fixed), 'key'], ['How much of the change in cost the activity explains', fmt(r.regression.r2 * 100, 1) + '%']] : [])
      .concat(r.regression && r.regression.predicted != null ? [['Line of best fit: cost at the activity you plan', fmt(r.regression.predicted), 'key']] : []),
    words: r => (r.regression ? `Using all ${r.n} periods, each unit of activity adds about ${fmt(r.regression.rate)} of cost, on top of about ${fmt(r.regression.fixed)} that is there in any case. Activity explains ${fmt(r.regression.r2 * 100, 0)} per cent of the change in cost${r.regression.r2 < 0.7 ? ', so look for another cause as well' : ''}.` : `From the highest and lowest periods, each unit of activity adds about ${fmt(r.highLow.rate)} of cost, on top of about ${fmt(r.highLow.fixed)}. Add a third period for a line of best fit.`) + ' An estimate holds only within the range of activity you have seen.'},
  {id: 'invest', group: 'decide', name: 'Payback and net present value', icon: 'coins', units: ['S7-05'],
    lede: 'Whether an investment earns more than it costs, once money later is counted as worth less than money now.',
    fields: [N('investment', 'Amount invested at the start'), N('rate', 'Rate of return you require, % a year'), N('rate2', 'A second rate to test, % a year', true)],
    list: {key: 'flows', min: 5, max: 10, add: 'Add a year', cols: [['c', 'Cash coming in']], rowLabel: k => `Year ${k + 1}`},
    example: {investment: '250000', rate: '12', rate2: '15', flows: [{c: '70000'}, {c: '80000'}, {c: '90000'}, {c: '60000'}, {c: '40000'}]},
    calc: v => L.invest({investment: v.investment, rate: v.rate, rate2: v.rate2, flows: (v.flows || []).map(f => f.c)}),
    rows: r => [['Payback period', r.payback == null ? 'not paid back in these years' : fmt(r.payback, 2) + ' years'], ['Total cash coming in', fmt(r.totalIn)]]
      .concat(r.npv != null ? [[`Net present value at ${fmt(r.rate)}%`, fmt(r.npv), 'key']] : [])
      .concat(r.npv2 != null ? [[`Net present value at ${fmt(r.rate2)}%`, fmt(r.npv2)]] : [])
      .concat([['Rate of return of the project itself', r.irr == null ? 'cannot be worked out from these figures' : fmt(r.irr, 2) + '% a year']]),
    words: r => (r.npv == null ? 'Enter the rate of return you require to see the net present value.' : r.npv >= 0 ? `At ${fmt(r.rate)} per cent a year, the cash coming in is worth ${fmt(r.npv)} more today than the amount invested, so the investment clears the rate you require.` : `At ${fmt(r.rate)} per cent a year, the cash coming in is worth ${fmt(-r.npv)} less today than the amount invested, so the investment does not clear the rate you require.`) + (r.payback == null ? ' The amount invested is not paid back within these years.' : ` The amount invested is paid back in ${fmt(r.payback, 1)} years.`) + ' Payback alone ignores what comes after it; judge by net present value first.'},
  {id: 'health', group: 'health', name: 'Finance health check', icon: 'pulse', units: ['S7-01', 'S7-04', 'S7-06'],
    lede: 'Four quick checks on a business: how fast customers pay, whether short-term bills are covered, how long stock sits, and whether profit is turning into cash.',
    fields: [N('revenue', 'Sales for the period', true), N('receivables', 'Owed by customers at the end', true), N('days', 'Days in the period', true, 'Leave blank for a year of 365 days.'), N('currentAssets', 'Current assets', true), N('currentLiabilities', 'Current liabilities', true),
      N('stock', 'Stock at the end', true), N('costOfSales', 'Cost of sales for the period', true), N('profit', 'Profit for the period', true), N('operatingCash', 'Cash from operations for the period', true)],
    example: {revenue: '1800000', receivables: '270000', days: '', currentAssets: '620000', currentLiabilities: '410000', stock: '150000', costOfSales: '1080000', profit: '140000', operatingCash: '-30000'}, calc: v => L.health(v),
    rows: r => [].concat(r.dso != null ? [['Days customers take to pay', fmt(r.dso, 0) + ' days', 'key']] : []).concat(r.currentRatio != null ? [['Current assets for each unit of current liabilities', fmt(r.currentRatio, 2), 'key']] : [])
      .concat(r.stockDays != null ? [['Days stock sits before it is sold', fmt(r.stockDays, 0) + ' days', 'key']] : []).concat(r.conversion != null ? [['Cash from operations as a share of profit', fmt(r.conversion, 0) + '%', 'key']] : []),
    words: r => [r.dso != null ? `Customers take about ${fmt(r.dso, 0)} days to pay; compare that with the terms you give them.` : '',
      r.currentRatio != null ? (r.currentRatio < 1 ? `Short-term bills are larger than the short-term assets that pay them (${fmt(r.currentRatio, 2)} to 1), so check how the next bills will be met.` : `Short-term assets cover short-term bills ${fmt(r.currentRatio, 2)} times.`) : '',
      r.stockDays != null ? `Stock sits for about ${fmt(r.stockDays, 0)} days before it is sold.` : '',
      r.flag ? ({'profit-no-cash': 'There is a profit, but cash from operations is negative: the profit is tied up in customers, stock or both. Find out where before you spend it.', 'cash-lags': 'Less than half of the profit has arrived as cash. Look at what customers owe and at stock.', 'cash-no-profit': 'Cash came in although there was no profit. Check whether it came from collecting old debts or delaying payments, which cannot be repeated.', 'both-negative': 'There is neither profit nor cash from operations in this period.', 'in-step': 'Profit and cash from operations are moving together.'}[r.flag]) : '',
      'Compare each figure with your own past periods and with your sector; no single number is right for every business.'].filter(Boolean).join(' '),
    extra: 'close'},
  {id: 'payfirst', group: 'money', name: 'Pay yourself first', icon: 'coins', units: ['S8-01'],
    lede: 'Set a share of your income aside before you spend, not from what is left over.',
    fields: [N('income', 'Income each month'), N('percent', 'Share to set aside first, %')],
    example: {income: '30000', percent: '10'}, calc: v => L.payFirst(v),
    rows: r => [['Set aside each month', fmt(r.monthly), 'key'], ['Set aside in a year', fmt(r.yearly)], ['Left to live on each month', fmt(r.rest)]],
    words: r => `Setting aside ${fmt(r.monthly)} on the day your income arrives adds up to ${fmt(r.yearly)} in a year, and leaves ${fmt(r.rest)} a month to live on. Make the transfer automatic if your bank allows it.`},
  {id: 'daily', group: 'money', name: 'A small daily expense over a year', icon: 'cal', units: ['S8-01'],
    lede: 'What one small, regular expense adds up to.',
    fields: [N('amount', 'What it costs each time'), N('daysPerWeek', 'Days a week', true, 'Leave blank for every day.')],
    example: {amount: '60', daysPerWeek: '5'}, calc: v => L.dailyExpense(v),
    rows: r => [['In a week', fmt(r.weekly)], ['In a month, on average', fmt(r.monthly)], ['In a year', fmt(r.yearly), 'key']],
    words: r => `This expense comes to ${fmt(r.yearly)} in a year. That is not a reason to give it up; it is a reason to choose it knowingly.`},
  {id: 'cushion', group: 'money', name: 'A safety cushion', icon: 'shield', units: ['S8-02'],
    lede: 'A first target of one month of essential costs, then three, then six.',
    fields: [N('essentials', 'Essential costs for one month'), N('saved', 'Already set aside', true), N('perMonth', 'What you can add each month', true)],
    pick: {key: 'months', label: 'Target', options: [['1', '1 month'], ['3', '3 months'], ['6', '6 months']], first: '1'},
    example: {essentials: '22000', saved: '8000', perMonth: '3500', months: '3'}, calc: v => L.cushion(v),
    rows: r => [['Your target', fmt(r.target), 'key'], ['Still to set aside', fmt(r.gap)], ['What you have covers', fmt(r.covered, 1) + ' months of essential costs']].concat(r.monthsToReach != null ? [['Months to reach the target', r.monthsToReach === 0 ? 'reached' : fmt(r.monthsToReach)]] : []),
    words: r => (r.gap === 0 ? 'You have reached this target. Keep the cushion apart from everyday money, and set the next target when you are ready.' : `You need ${fmt(r.gap)} more to reach ${fmt(r.target)}.` + (r.monthsToReach ? ` At the amount you can add each month, that takes about ${fmt(r.monthsToReach)} months.` : ' Add what you can set aside each month to see how long it takes.') + ' Keep the cushion where you can reach it quickly and where its value does not swing.')},
  {id: 'debts', group: 'money', name: 'The order to clear debts', icon: 'route', units: ['S8-03'],
    lede: 'Keep up the minimum payment on every debt, and put anything extra towards one debt at a time.',
    list: {key: 'debts', min: 3, max: 6, add: 'Add a debt', cols: [['name', 'Debt', 'text'], ['balance', 'Still owed'], ['rate', 'Interest, % a year']]},
    pick: {key: 'method', label: 'Order', options: [['rate', 'Highest interest first'], ['balance', 'Smallest debt first']], first: 'rate'},
    example: {method: 'rate', debts: [{name: 'Card balance', balance: '45000', rate: '36'}, {name: 'Personal loan', balance: '180000', rate: '14'}, {name: 'From a relative', balance: '20000', rate: '0'}]},
    calc: v => L.debtOrder(v),
    table: r => ({head: ['Order', 'Debt', 'Still owed', 'Interest a year'], rows: r.order.map((d, k) => [k + 1, d.name, fmt(d.balance), fmt(d.rate, 2) + '%'])}),
    rows: r => [['Owed in total', fmt(r.total), 'key'], ['Interest in a year at these rates, if nothing were repaid', fmt(r.yearlyInterest)]],
    words: r => `Keep paying the minimum on every debt. Put anything extra towards ${r.order[0].name} first, ` + (r.method === 'rate' ? 'because it has the highest interest rate, which costs you the least interest overall.' : 'because it is the smallest, so one debt is cleared soonest; this can cost a little more interest, and many people find it easier to keep going.') + ' When it is cleared, move the same amount to the next on the list.'},
  {id: 'giving', group: 'money', name: 'A giving plan', icon: 'heart', units: ['S8-04'],
    lede: 'Decide a share to give, and plan for it as you plan for saving.',
    fields: [N('income', 'Income each month'), N('percent', 'Share to give, %')],
    example: {income: '30000', percent: '3'}, calc: v => L.giving(v),
    rows: r => [['To give each month', fmt(r.monthly), 'key'], ['To give in a year', fmt(r.yearly)]],
    words: r => `Giving ${fmt(r.monthly)} a month comes to ${fmt(r.yearly)} in a year. Deciding the share in advance makes giving regular, not occasional.`},
  {id: 'budget', group: 'money', name: 'A simple budget', icon: 'doc', units: ['S7-02', 'S8-01'],
    lede: 'See where a month of income goes: needs, wants and what you set aside.',
    fields: [N('income', 'Income for the month'), N('needs', 'Needs', true, 'Rent, food, transport, bills, school.'), N('wants', 'Wants', true), N('saving', 'Set aside or repaid', true)],
    example: {income: '40000', needs: '22000', wants: '9000', saving: '6000'}, calc: v => L.budget(v),
    rows: r => [['Needs', fmt(r.needsPct, 0) + '% of income'], ['Wants', fmt(r.wantsPct, 0) + '% of income'], ['Set aside or repaid', fmt(r.savingPct, 0) + '% of income'], [r.left >= 0 ? 'Not yet given a purpose' : 'Spent beyond income', fmt(Math.abs(r.left)), 'key']],
    words: r => (r.left > 0 ? `${fmt(r.left)} of this month's income has no purpose yet. Give it one before the month does.` : r.left === 0 ? 'Every part of this month\'s income has a purpose.' : `The plan spends ${fmt(-r.left)} more than the income. Reduce a want first, then look at the needs.`) + ' Compare the plan with what actually happened at the end of the month, and write one reason for each gap.'},
  {id: 'loan', group: 'money', name: 'A loan, month by month', icon: 'bank', units: ['S8-03'],
    lede: 'The monthly payment on a loan, and what the loan costs in interest.',
    fields: [N('principal', 'Amount borrowed'), N('rate', 'Interest, % a year'), N('months', 'Months to repay')],
    example: {principal: '200000', rate: '13', months: '36'}, calc: v => L.loan(v),
    rows: r => [['Payment each month', fmt(r.payment), 'key'], ['Paid in total', fmt(r.totalPaid)], ['Of which interest', fmt(r.totalInterest)]],
    words: r => `The payment is ${fmt(r.payment)} a month for ${r.months} months. In all you repay ${fmt(r.totalPaid)}, of which ${fmt(r.totalInterest)} is interest. Lenders may add fees and insurance, so ask for the total cost in writing.`}
].filter(t => hasTool(t.id));
ICONS.pkg = '<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>';
const GROUPS = [['decide', 'Decide', 'scale', 'Seven calculators for business decisions.'], ['health', 'Business health', 'pulse', 'Four quick checks, and the month-end close.'], ['money', 'Money habits', 'coins', 'For your own money. For learning only: nothing is sold or recommended.']].filter(g => TOOLS.some(t => t.group === g[0]));
const CLOSE_LIST = ['Bank accounts agreed to the bank statements.', 'Sales invoices for the month all raised, and receipts matched to them.', 'Supplier invoices and expenses for the month all entered.', 'Stock counted or checked, and losses written off.',
  'Costs that belong to another month moved to that month.', 'Pay, taxes and statutory dues entered and agreed.', 'Equipment bought or sold recorded, and depreciation charged.', 'Results compared with the budget and with last month, and each large difference explained in writing.', 'The close reviewed by a second person.'];
const WATCH_LIST = ['Customer debts more than 60 days overdue, as a share of all customer debts.', 'Bank and control accounts agreed on time each month.', 'Manual journal entries above a set amount, and who approved each one.', 'Payments made without an order or a second approval.', 'Differences found when stock is counted.', 'Days taken to close the month.'];
const T = {tool: null, vals: {}, closed: {}};
const toolOf = id => TOOLS.find(t => t.id === id) || null;
function toolVals(t) {
  const v = T.vals[t.id] = T.vals[t.id] || {};
  if (t.list && !Array.isArray(v[t.list.key])) v[t.list.key] = Array.from({length: t.list.min}, () => ({}));
  if (t.pick && v[t.pick.key] == null) v[t.pick.key] = t.pick.first;
  return v;
}
const toolEmpty = (t, v) => !(t.fields || []).some(f => String(v[f.key] || '').trim()) && !(t.list ? v[t.list.key].some(r => Object.values(r).some(x => String(x || '').trim())) : false);
function toolResult(t) {
  const v = toolVals(t);
  if (toolEmpty(t, v)) return `<p class="muted">Enter your figures, or use the example, and the result appears here.</p>`;
  const r = t.calc(v);
  if (!r.ok) return `<p class="muted">${esc(r.why)}</p>`;
  const tb = t.table ? t.table(r) : null;
  return `${t.chart ? `<div class="pic">${t.chart(r, v)}</div>` : ''}
    ${tb ? `<div class="tablewrap"><table class="rtable"><thead><tr>${tb.head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${tb.rows.map(row => `<tr>${row.map((c, k) => (k === 1 ? `<th scope="row">${esc(c)}</th>` : `<td data-h="${esc(tb.head[k])}">${esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
    <dl class="kv">${t.rows(r).map(x => `<div${x[2] ? ' class="key"' : ''}><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join('')}</dl>
    <p class="words">${esc(t.words(r))}</p>
    <div class="row">${listenBtn('tool', 'Listen to the result')}</div>`;
}
function toolWords(t) { const v = toolVals(t); if (toolEmpty(t, v)) return t.lede; const r = t.calc(v); return r.ok ? t.words(r) : r.why; }
function toolForm(t) {
  const v = toolVals(t);
  const input = (id, attr, val, text) => `<input class="box${text ? '' : ' num'}" id="${id}" ${attr} type="text" inputmode="${text ? 'text' : 'decimal'}" autocomplete="off" value="${esc(val == null ? '' : val)}">`;
  const fields = (t.fields || []).map(f => `<div class="field"><label for="tf-${f.key}">${esc(f.label)}${f.opt ? ' <span class="hint">(optional)</span>' : ''}</label>${input('tf-' + f.key, `data-tf="${f.key}"`, v[f.key])}${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</div>`).join('');
  let list = '';
  if (t.list) {
    const rows = v[t.list.key], c = t.list.cols;
    list = `<div class="tlist cols${c.length}${t.list.rowLabel ? ' lab' : ''}" role="group" aria-label="${esc(t.list.add.replace(/^Add an? /, ''))} list">
      <div class="thead" aria-hidden="true">${t.list.rowLabel ? '<span></span>' : ''}${c.map(x => `<span>${esc(x[1])}</span>`).join('')}</div>
      ${rows.map((row, k) => `<div class="trow">${t.list.rowLabel ? `<span class="rl">${esc(t.list.rowLabel(k))}</span>` : ''}${c.map(x => `<span class="cell"><label class="tl" for="tr-${k}-${x[0]}"><span class="sr">${esc((t.list.rowLabel ? t.list.rowLabel(k) : 'Row ' + (k + 1)) + ': ')}</span>${esc(x[1])}</label>${input(`tr-${k}-${x[0]}`, `data-tr="${k}:${x[0]}"`, row[x[0]], x[2] === 'text')}</span>`).join('')}</div>`).join('')}
      ${rows.length < t.list.max ? `<div class="caps"><button class="cap more" type="button" data-trow-add="1">${ic('plus', 'sm')}${esc(t.list.add)}</button></div>` : ''}</div>`;
  }
  const pick = t.pick ? `<div class="field"><span class="lbl" id="tpL">${esc(t.pick.label)}</span><div class="caps" role="group" aria-labelledby="tpL">${t.pick.options.map(o => `<button class="cap" type="button" data-tpick="${esc(o[0])}" aria-pressed="${String(v[t.pick.key]) === o[0]}">${esc(o[1])}</button>`).join('')}</div></div>` : '';
  return `<form class="inputs" id="toolForm" autocomplete="off" novalidate>${t.id === 'cost' || t.id === 'invest' ? fields + list : list + fields}${pick}
    <div class="row"><button class="btn quiet small" type="button" data-texample="1">${ic('spark', 'sm')}Use an example</button><button class="cap" type="button" data-tclear="1">Clear</button></div></form>`;
}
function viewTools() {
  const t = toolOf(route.tool);
  if (!t) return head('Tools', 'Work it out with your own figures. They stay on this page: they are not kept and nothing is sent anywhere.') + `
    ${GROUPS.map(g => `<section class="sec" aria-labelledby="h-g-${g[0]}"><div class="sec-h"><h2 id="h-g-${g[0]}">${esc(g[1])}</h2></div><p class="muted sec-p">${esc(g[3])}</p>
      <div class="tgrid">${TOOLS.filter(x => x.group === g[0]).map(x => `<a class="tcard" href="#tool-${x.id}" data-go="tool-${x.id}">${ic(x.icon)}<span class="grow"><b>${esc(x.name)}</b><span>${esc(x.lede)}</span></span>${ic('chev', 'sm')}</a>`).join('')}</div></section>`).join('')}`;
  const rel = t.units.map(id => UNITS.get(id)).filter(Boolean), g = GROUPS.find(x => x[0] === t.group);
  return `<div class="crumb"><a class="cap" href="#tools" data-go="tools">${ic('chevl', 'sm')}All tools</a><span class="tag">${esc(g[1])}</span></div>
  <article class="card unit lift" aria-labelledby="h-tool">
    <div class="unit-top"><div class="grow"><h1 id="h-tool">${esc(t.name)}</h1><p class="lede sm">${esc(t.lede)}</p></div></div>
    <div class="tool-grid">${toolForm(t)}<div class="res" id="toolRes" aria-live="polite">${toolResult(t)}</div></div>
    ${t.extra === 'close' ? `<div class="grid2 closebox"><section aria-labelledby="h-close"><h2 id="h-close">Month-end close</h2><p class="muted sec-p">Tick each step as it is done. The ticks are for this sitting only.</p>
        <ul class="ticks">${CLOSE_LIST.map((c, k) => `<li><button class="tickrow" type="button" data-tcheck="${k}" aria-pressed="${!!T.closed[k]}"><span class="tick">${T.closed[k] ? ic('check', 'sm') : ''}</span><span>${esc(c)}</span></button></li>`).join('')}</ul></section>
      <section aria-labelledby="h-watch"><h2 id="h-watch">Figures worth watching each month</h2><p class="muted sec-p">Signs of risk, and of whether the controls are working.</p>
        <ul class="plain">${WATCH_LIST.map(c => `<li>${ic('eye', 'sm')}<span>${esc(c)}</span></li>`).join('')}</ul></section></div>` : ''}
    <div class="note">${ic('shield', 'sm')}<span>${t.group === 'money' || t.group === 'health' ? 'For learning only. This is not investment, tax, lending or legal advice, and nothing is sold or recommended here. ' : 'A calculator shows the figures, and the decision stays yours. '}The figures you enter stay on this page: they are not kept, even when you keep your record, and nothing is sent anywhere.</span></div>
  </article>
  ${rel.length ? `<section class="sec" aria-labelledby="h-rel"><div class="sec-h"><h2 id="h-rel">The units behind this tool</h2></div><div class="ulist">${rel.map(unitCard).join('')}</div></section>` : ''}`;
}
function paintTool() { const t = toolOf(route.tool), box = $('#toolRes'); if (t && box) { stopSpeaking(); box.innerHTML = toolResult(t); applyBars(box); } }

/* ---------- Ask: answers from this page, and a way to find a unit ---------- */
const FAQ = [
  {q: 'Is this free?', k: ['free', 'cost', 'price', 'pay', 'fee', 'charge', 'money to join'], go: 'learn',
    a: 'Yes. The Foundation units, the reading lists, your record, the habit tracker, the journal and the tools on this page are free, and stay free. The later levels open with an edition of the Executive Programme. Its fee is shown in full before you enrol, and nothing is charged on this page.'},
  {q: 'How do practice points work?', k: ['point', 'points', 'score', 'credit'], go: 'record',
    a: `Each unit is worth ${D.ppu} practice points. They are recorded when you have passed the unit's check and noted what you tried. The points on this page are recorded by you, on your own device; they count towards a certificate once a trainer has accepted your notes on what you tried. One level of ${D.foundationUnits} units makes ${D.foundationUnits * D.ppu} points.`},
  {q: 'Where is my record kept?', k: ['where', 'kept', 'stored', 'storage', 'privacy', 'private', 'data', 'safe', 'server', 'sent'], go: 'record',
    a: 'Only in this browser, on this device, and only if you choose "Keep on this device". Nothing is sent anywhere. You can download your record, move it to another device, or delete everything at any time.'},
  {q: 'How long does a unit take?', k: ['how long', 'minutes', 'time', 'long does'], go: 'learn',
    a: 'About five minutes. Each unit has seven short parts: a hook, the idea, an example from your sector, a task to try today, a quiet caution, a reflection and one check.'},
  {q: 'What are the four ways to learn?', k: ['see', 'hear', 'read', 'mode', 'ways to learn', 'listen', 'picture', 'aloud', 'style'], go: 'learn',
    a: 'Every unit can be taken in four ways. Read gives the seven parts one at a time. See shows the whole unit as one picture. Hear reads it aloud to you. Do takes you straight to the task for today. Use one or all of them, and switch whenever you like; nobody is labelled with one style.'},
  {q: 'How do I change my sector?', k: ['sector', 'industry', 'example', 'my work', 'field'], go: 'learn',
    a: `Open Learn and choose "Change my sector", or change it inside any unit at the part called "Your sector". There are ${SECTORS.length} sectors, and every unit gives its example in the words of the one you choose.`},
  {q: 'Which unit should I take next?', k: ['next', 'which unit', 'what should', 'start', 'begin', 'recommend'], go: has('today') ? 'today' : 'learn', dyn: 'next'},
  {q: 'What is a pathway?', k: ['pathway', 'path', 'course', 'route', 'order'], go: 'learn',
    a: `A pathway is a set of units in a sensible order for one purpose, such as leading people or understanding the numbers. There are ${PATHS.length} on this page. Choose one in Learn, and Today will always offer the next unit on it.`},
  {q: 'Why should I answer the check myself?', k: ['ai', 'assistant', 'cheat', 'myself', 'answer for me', 'why learn', 'replace', 'human'], go: 'learn',
    a: 'Because understanding is the part that stays with you. An AI assistant can explain an idea another way, read it aloud or suggest readings, and you are welcome to use one for that. The check and the reflection are yours: they are how you find out what you have understood and what it means for your own work.'},
  {q: 'How do habits work here?', k: ['habit', 'streak', 'daily', 'routine', 'missed'], go: 'habits',
    a: 'Choose one to three tiny habits, each linked to something you already do every day, and tick each day you do them. A new daily habit takes about 66 days on average to feel automatic, with a range from 18 to 254 days (Lally and colleagues, 2010). A missed day does not undo it: begin again the next day.'},
  {q: 'Is my journal private?', k: ['journal', 'reflection', 'notes', 'diary', 'who reads'], go: 'journal',
    a: 'Yes. Your journal is kept only on this device, if you choose to keep it. Nobody else reads it, no AI assistant sees it, and it is never part of the record you share. You can download it or delete it at any time.'},
  {q: 'Can I get a certificate?', k: ['certificate', 'badge', 'credential', 'qualification', 'degree', 'diploma'], go: 'record',
    a: 'This page keeps your record and gives a Foundation badge when the Foundation units are complete. A certificate of completion comes with each edition of the Executive Programme, when a trainer has accepted your evidence. These are professional programmes; they are not university degrees.'},
  {q: 'Are the money tools advice?', k: ['advice', 'invest', 'adviser', 'advisor', 'recommend', 'tax', 'loan', 'tools'], go: 'tools',
    a: 'No. The tools are for learning. They sell nothing and give no investment, tax, lending or legal advice. For a decision about your own money, speak to a qualified adviser. The figures you enter are not kept.'},
  {q: 'How do I move my record to another device?', k: ['move', 'another device', 'new phone', 'transfer', 'backup', 'download', 'import', 'export'], go: 'record',
    a: 'Open Record and choose "Download my record". On the other device, open this page, go to Record, choose "Bring a record from another device" and load the file. The page checks that no entry was changed before it loads it.'},
  {q: 'Who checks my work?', k: ['who checks', 'trainer', 'review', 'accept', 'marks', 'graded', 'assess'], go: 'record',
    a: 'On this page, you keep an honest record for yourself. When you join an edition of the Executive Programme, a trainer reads your notes on what you tried and accepts them, and from then the points count towards your certificate.'},
  {q: 'What are the levels?', k: ['level', 'foundation', 'practitioner', 'advanced', 'mastery'], go: 'learn',
    a: `There are four levels: Foundation, Practitioner, Advanced and Mastery. The Foundation units are free. The other levels open with the editions of the Executive Programme, one level for each year.`},
  {q: 'How do I become an author or a trainer?', k: ['author', 'trainer', 'teach', 'write a unit', 'contribute', 'train'], go: '',
    a: 'Anyone may suggest a sector example, a case or a correction from their own work, and the trainer induction is free. Both roles open fully from the third level, when you may write units for the library or lead sessions beside a certified trainer.'},
  {q: 'Can I use it on my phone?', k: ['phone', 'mobile', 'tablet', 'speak', 'voice', 'type', 'microphone'], go: has('today') ? 'today' : '',
    a: 'Yes. A phone is enough. Every part can be read aloud with the Listen button, and wherever you can type you can also speak: use the Speak button, or the microphone key on your keyboard.'}
].filter(f => !f.go || has(f.go));
const FAQ_FIRST = 6;
const A = {last: null, all: false};
function faqMatch(text) {
  const t = ' ' + String(text || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ') + ' ';
  let best = null, score = 0;
  FAQ.forEach(f => {
    let s = 0; f.k.forEach(k => { if (t.includes(' ' + k + ' ') || (k.length > 4 && t.includes(k))) s += k.length > 4 ? 2 : 1; });
    if (f.q.toLowerCase().replace(/[?]/g, '').split(' ').every(w => t.includes(w))) s += 4;
    if (s > score) { score = s; best = f; }
  });
  return score > 0 ? best : null;
}
function faqAnswer(f) {
  if (f.dyn === 'next') {
    const id = nextOnPathway(), u = id ? UNITS.get(id) : null, p = pathwayOf(S.pathway);
    return u ? `Your next unit${p ? ' on the pathway "' + p.name + '"' : ''} is "${u.title}". ${u.hook} It takes about five minutes.` : 'You have completed every unit that is open on your pathway. Choose another pathway in Learn.';
  }
  return f.a;
}
function ask(text) {
  const q = String(text || '').trim(); if (!q) { const i = $('#askInput'); if (i) i.focus(); return; }
  const f = faqMatch(q), units = has('learn') ? searchUnits(q).slice(0, 4) : [];
  A.last = f ? {q, a: faqAnswer(f), go: f.go, units, open: f.dyn === 'next' ? nextOnPathway() : null}
    : {q, a: units.length ? 'These units are the closest to what you asked.' : 'I do not have a ready answer to that on this page. Try other words, or choose one of the questions.', go: '', units};
  stopSpeaking(); render({keep: true});
  const box = $('#answer'); if (box && window.matchMedia('(max-width: 900px)').matches) box.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest'});
}
function viewAsk() {
  const list = A.all ? FAQ : FAQ.slice(0, FAQ_FIRST), a = A.last;
  return head('Ask', 'Ask by speaking or typing. The answers come from this page; nothing is sent anywhere.') + `
  <div class="askgrid gap-top">
    <div><form class="ask-form" id="askForm" autocomplete="off"><label class="sr" for="askInput">Your question</label>
        <input id="askInput" data-draft="askInput" type="text" enterkeyhint="send" placeholder="For example: how do practice points work?" value="${esc(Draft.askInput || '')}">${micIcon('askInput', 'Speak your question')}<button class="icon-btn" type="submit" aria-label="Ask">${ic('send', 'sm')}</button></form>
      <div class="caps gap-top">${list.map(f => `<button class="cap wrapok" type="button" data-q="${FAQ.indexOf(f)}">${esc(f.q)}</button>`).join('')}<button class="cap more" type="button" data-chips="${A.all ? 0 : 1}">${A.all ? 'Fewer' : `${FAQ.length - FAQ_FIRST} more questions`}</button></div></div>
    <div class="card pad answer" id="answer" aria-live="polite">${a ? `<p class="q">${esc(a.q)}</p><p class="a">${esc(a.a)}</p>
        <div class="row">${listenBtn('answer')}${a.open ? `<button class="btn primary small" type="button" data-open-unit="${esc(a.open)}">${ic('play', 'sm')}Open this unit</button>` : a.go ? `<a class="btn quiet small" href="#${esc(a.go)}" data-go="${esc(a.go)}">${ic('arrow', 'sm')}Show me</a>` : ''}</div>
        ${a.units && a.units.length ? `<p class="eyebrow gap-top">Units on this</p><div class="ulist one">${a.units.map(unitCard).join('')}</div>` : ''}`
      : `<p class="eyebrow">Answer</p><p class="muted">Choose a question, or ask your own by speaking or typing. You can also name a subject, such as “budget” or “listening”, to find the units on it.</p>`}</div>
  </div>
  <section class="sec" aria-labelledby="h-keeps"><div class="sec-h"><h2 id="h-keeps">What stays with you</h2></div>
    <p class="muted sec-p">AI can explain, read aloud, draft and check, and you learn here to use it well. What carries meaning and responsibility stays with you.</p>
    <ul class="keeps">${[['learn', 'Understanding', 'You answer each check yourself and write your reflection in your own words: listen, reflect, then live it.'], ['target', 'Judgement', 'You decide what to try in your own work, and you answer for the result.'], ['author', 'Your name and honest credit', 'What you write is yours, with a plain note of anything an assistant helped with.'], ['users', 'Trust', 'You keep the names and private details of other people out of your notes.']].map(k => `<li>${ic(k[0])}<div><b>${esc(k[1])}</b><span>${esc(k[2])}</span></div></li>`).join('')}</ul>
  </section>`;
}

/* ---------- drawing the page ---------- */
function applyBars(scope) { $$('[data-w]', scope || document).forEach(el => { el.style.width = el.dataset.w + '%'; }); }
function focusKey(el) {
  const view = $('#view'); if (!el || !view.contains(el)) return null;
  if (el.id) return ['#' + CSS.escape(el.id), null];
  for (const a of el.attributes) if (a.name.startsWith('data-') && a.name !== 'data-w' && a.name !== 'data-l' && a.name !== 'data-i') return [`[${a.name}="${CSS.escape(a.value)}"]`, `[${a.name}]`];
  return null;
}
function viewHtml() {
  const v = route.view;
  if (v === 'learn') return route.unit ? viewUnit() : viewLearn();
  if (v === 'quiz') return viewQuiz();
  if (v === 'record') return viewRecord();
  if (v === 'habits') return viewHabits();
  if (v === 'journal') return viewJournal();
  if (v === 'tools') return viewTools();
  if (v === 'ask') return viewAsk();
  return viewToday();
}
function render(opts) {
  opts = opts || {};
  if (!opts.speech) { stopSpeaking(); U.hearing = null; }
  const view = $('#view'), key = opts.keep ? focusKey(document.activeElement) : null, sel = key && document.activeElement.selectionStart != null && /^(text|search|)$/.test(document.activeElement.type || '') ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
  paintNav();
  view.className = 'wrap view v-' + route.view + (route.unit ? ' v-unit' : '');
  view.innerHTML = viewHtml();
  applyBars(view); paintMics(); Hand.sync();
  if (key) {
    let el = view.querySelector(key[0]);
    if (!el && key[1]) { const all = view.querySelectorAll(key[1]); if (all.length === 1) el = all[0]; }
    if (el) { try { el.focus({preventScroll: true}); if (sel && el.setSelectionRange) el.setSelectionRange(sel[0], sel[1]); } catch (e) {} }
  }
}
function viewSummary() {
  const v = route.view;
  if (v === 'learn' && route.unit) return unitSayText();
  if (v === 'learn') { const p = pathwayOf(S.pathway); return `Learn. Your sector is ${sectorLabel(S.sector)}. ${p ? 'Your pathway is ' + p.name + '. ' : ''}The ${LEVELS[S.level]} units are: ${(p ? p.units.map(id => UNITS.get(id)) : D.units).filter(u => u.level === S.level).map(u => u.title).join('. ')}.`; }
  if (v === 'record') return `Your record. ${R.points} practice points recorded, and ${plural(R.complete, 'unit', 'units')} completed. ${S.keep ? 'Your record is kept on this device only.' : 'Your record is not being kept, and will be forgotten when you close this page.'} Points count towards a certificate once a trainer has accepted your notes on what you tried.`;
  if (v === 'habits') { const a = S.habits.filter(h => !h.ended); return a.length ? 'Your habits. ' + a.map(h => `${h.name}: ${(h.log || {})[today()] ? 'done today' : 'not yet done today'}, ${plural(L.streak(h.log || {}, today()), 'day', 'days')} in a row.`).join(' ') : 'Habits. You have no habit yet. Choose one tiny habit, linked to something you already do every day.'; }
  if (v === 'journal') return `Your journal. You have ${plural(S.journal.length, 'note', 'notes')}. Your journal is private: nobody else reads it, and it is never part of the record you share.`;
  if (v === 'tools') { const t = toolOf(route.tool); return t ? `${t.name}. ${toolWords(t)}` : 'Tools. ' + GROUPS.map(g => `${g[1]}: ${TOOLS.filter(t => t.group === g[0]).map(t => t.name).join(', ')}.`).join(' '); }
  if (v === 'ask') return A.last ? A.last.a : 'Ask by speaking or typing. Choose a question, or ask your own.';
  if (v === 'quiz') { quizSetup(); const u = UNITS.get(Q.ids[Math.min(Q.i, Q.ids.length - 1)]); return Q.i >= Q.ids.length ? 'Quiz of the day. You have answered all five questions.' : `Question ${Q.i + 1}. ${u.question} ${u.options.map((o, j) => `Option ${'ABC'[j]}: ${o}.`).join(' ')}`; }
  const id = nextOnPathway(), u = id ? UNITS.get(id) : null, slot = slotNow();
  return `${u ? `Your next unit is ${u.title}. ${u.hook}` : 'You have completed every open unit on your pathway.'} You have ${R.points} practice points. ${D.anchors.length ? `Anchors for ${SLOT_NAME[slot]}: ${D.anchors.filter(a => a.times.includes(slot)).slice(0, 4).map(a => a.label).join(', ')}.` : ''}`;
}

/* ---------- one listener for every capsule, button and link ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('button,a'); if (!b) return;
  const d = b.dataset;
  if (b.classList.contains('skip')) { e.preventDefault(); const m = $('#main'); m.focus(); m.scrollIntoView(); return; }
  if (b.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
  if (d.go != null) { e.preventDefault(); go(d.go, {top: true}); return; }
  if (d.hand != null) { Hand.toggle(); return; }
  if (d.keep != null) {
    if (d.keep === '1') { S.keep = true; askedKeep = true; save(); toast(storageFailed ? 'This browser did not allow the record to be kept.' : 'Your record is now kept on this device.'); if (storageFailed) S.keep = false; }
    else if (d.keep === 'stop') { S.keep = false; forget(); toast('No longer kept on this device. What you have done stays on this page until you close it.'); }
    else askedKeep = true;
    render({keep: true}); return;
  }
  if (d.say) {
    const text = d.say === 'view' ? viewSummary() : d.say === 'unit' ? unitSayText() : d.say === 'answer' ? (A.last ? A.last.a : '') : d.say === 'tool' ? toolWords(toolOf(route.tool)) : '';
    say(text, b); return;
  }
  if (d.mic) { dictate(d.mic, box => { if (box.id === 'askInput') ask(box.value); else if (box.id === 'usearch') render({keep: true}); }); return; }
  if (d.openUnit) { go('unit-' + d.openUnit, {step: d.at != null ? +d.at : undefined, top: true}); if (d.at != null) { S.mode = 'read'; render({keep: true}); } return; }

  /* Today */
  if (d.slot) { slotPick = d.slot; anchorsAll = false; render({keep: true}); return; }
  if (d.anchorsAll) { anchorsAll = d.anchorsAll === '1'; render({keep: true}); return; }
  if (d.anchorDone) {
    const t = today(), list = S.anchors[t] = S.anchors[t] || [], k = list.indexOf(d.anchorDone);
    if (k >= 0) list.splice(k, 1); else list.push(d.anchorDone);
    Object.keys(S.anchors).forEach(key => { if (key < L.addDays(t, -30) || !S.anchors[key].length) delete S.anchors[key]; });
    save(); render({keep: true}); return;
  }
  if (d.anchorWrite) { const a = D.anchors.find(x => x.id === d.anchorWrite); JX.q = a.reflect; JX.anchor = a.id; go('journal', {top: true}); const box = $('#jBox'); if (box) box.focus({preventScroll: true}); return; }
  if (d.anchorAlso) {
    const a = D.anchors.find(x => x.id === d.anchorAlso);
    if (a.also === 'next') { const id = nextOnPathway(); if (id) go('unit-' + id, {top: true}); else go('learn', {top: true}); }
    else if (a.also === 'habit') { Draft.hName = a.label; HX.err = ''; go('habits', {top: true}); const box = $('#hCue'); if (box) box.focus({preventScroll: true}); }
    else if (a.also === 'quiz') go('quiz', {top: true});
    else if (a.also === 'record') go('record', {top: true});
    else go('tool-' + a.also, {top: true});
    return;
  }

  /* Habits */
  if (d.habitTick) { tickHabit(d.habitTick); return; }
  if (d.habitDay) { const k = d.habitDay.indexOf(':'); tickHabit(d.habitDay.slice(0, k), d.habitDay.slice(k + 1)); return; }
  if (d.habitAsk != null) { HX.confirm = d.habitAsk || null; render({keep: true}); return; }
  if (d.habitEnd) { const h = S.habits.find(x => x.id === d.habitEnd); if (h) { h.ended = today(); HX.confirm = null; save(); render({keep: true}); toast('Habit retired. Its days are kept under Retired habits.'); } return; }
  if (d.habitDel) { S.habits = S.habits.filter(x => x.id !== d.habitDel); HX.confirm = null; save(); render({keep: true}); toast('Habit deleted.'); return; }
  if (d.habitsEnded) { HX.ended = d.habitsEnded === '1'; render({keep: true}); return; }
  if (d.habitFrom) { const u = UNITS.get(d.habitFrom), first = (u.tryit.match(/^[^.(]+/) || [u.tryit])[0].trim(); Draft.hName = first.slice(0, 140); HX.err = ''; go('habits', {top: true}); const box = $('#hCue'); if (box) box.focus({preventScroll: true}); return; }

  /* Learn and the unit */
  if (d.pickSector) { pickSector = d.pickSector === '1'; sectorsAll = false; render({keep: true}); return; }
  if (d.sectorsAll) { sectorsAll = d.sectorsAll === '1'; render({keep: true}); return; }
  if (d.sector) { S.sector = d.sector; pickSector = false; sectorsAll = false; save(); render({keep: true}); toast(`Examples now come from: ${sectorLabel(S.sector)}.`); return; }
  if (d.pathway) { S.pathway = d.pathway; Draft.usearch = ''; save(); render({keep: true}); return; }
  if (d.level) { S.level = +d.level; save(); render({keep: true}); return; }
  if (d.clearSearch) { Draft.usearch = ''; render({keep: true}); const box = $('#usearch'); if (box) box.focus(); return; }
  if (d.mode) { S.mode = d.mode; save(); render({keep: true}); return; }
  if (d.step != null) { unitGo(+d.step, d.read === '1'); return; }
  if (d.unav) { unitGo(U.step + +d.unav); return; }
  if (d.readings) { U.readings = d.readings === '1'; render({keep: true}); return; }
  if (d.hear) { if (d.hear === 'stop') { stopSpeaking(); U.hearing = null; render({keep: true}); } else hear(U.step < 6 && U.step > 0 ? U.step : 0); return; }
  if (d.opt != null) {
    const u = UNITS.get(U.id), st = uState(u.id), j = +d.opt; if (st && st.passed) return;
    const ok = j === u.answer; if (!ok && !U.wrong.includes(j)) U.wrong.push(j);
    const gained = record('check', u.id, {pick: 'ABC'[j], ok});
    render({keep: true});
    if (gained) toast(gained < 0 ? `Unit complete: ${D.ppu} practice points recorded. You have completed every Foundation unit here, and earned the Foundation badge.` : `Unit complete: ${D.ppu} practice points recorded.`);
    return;
  }
  if (d.stars) { const st = uState(U.id); record('rating', U.id, {stars: +d.stars, unclear: !!(st && st.unclear)}); render({keep: true}); toast('Thank you. Your rating is in your record.'); return; }
  if (d.unclear) { const st = uState(U.id), v = !(st && st.unclear); record('rating', U.id, {stars: st ? st.stars : null, unclear: v}); render({keep: true}); toast(v ? 'Marked as unclear. Thank you: this is how units are improved.' : 'No longer marked as unclear.'); return; }
  if (d.saveEvidence) {
    const box = $('#evBox'), text = (box ? box.value : '').trim().replace(/\s+/g, ' ');
    if (text.length < 3) { toast('Write or speak one line on what you did.'); if (box) box.focus(); return; }
    const gained = record('evidence', d.saveEvidence, {text: text.slice(0, 600)});
    delete Draft['ev-' + d.saveEvidence]; render({keep: true});
    toast(gained ? (gained < 0 ? `Unit complete: ${D.ppu} practice points recorded. You have completed every Foundation unit here, and earned the Foundation badge.` : `Unit complete: ${D.ppu} practice points recorded.`) : (uState(d.saveEvidence).passed ? 'Saved to your record.' : 'Saved to your record. Pass the check to complete the unit.'));
    return;
  }
  if (d.saveReflection) { saveReflection(d.saveReflection); return; }

  /* Quiz */
  if (d.quizOpt != null) { if (Q.picks[Q.i] == null) { Q.picks[Q.i] = +d.quizOpt; render({keep: true}); } return; }
  if (d.quiz) { if (d.quiz === 'next') Q.i++; else { Q.i = 0; Q.picks = []; } render({keep: true}); toTop(); return; }

  /* Record */
  if (d.ledgerAll) { X.ledgerAll = d.ledgerAll === '1'; render({keep: true}); return; }
  if (d.copyArea) { const a = $('#copyArea'); if (a) { a.focus(); a.select(); copyText(a.value).then(ok => toast(ok ? 'Copied.' : 'Select the text and copy it with your keyboard.')); } return; }
  if (d.copyClose) { X.copyText = null; render({keep: true}); return; }
  if (d.rec) {
    const r = d.rec, json = () => JSON.stringify(exportRecord(), null, 1);
    if (r === 'download') { fileOut('ajan-sns-learning-record.json', json(), 'application/json', 'Your record'); return; }
    if (r === 'copy') { copyText(json()).then(ok => { if (ok) toast('Your record is copied. Paste it into a note or an email to yourself.'); else { X.copyText = json(); X.copyWhat = 'Your record'; render({keep: true}); } }); return; }
    if (r === 'verify') X.verify = L.verifyLedger(S.ledger);
    else if (r === 'import') { X.importOpen = !X.importOpen; X.importErr = ''; X.importPending = null; }
    else if (r === 'import-load') { const box = $('#impText'), text = (box ? box.value : '').trim(); X.importErr = text ? loadImport(text) : 'Choose the file, or paste the record, first.'; if (!X.importErr && !S.ledger.length) applyImport(); }
    else if (r === 'import-yes') applyImport();
    else if (r === 'import-no') { X.importPending = null; }
    else if (r === 'delete') X.confirmDelete = true;
    else if (r === 'delete-no') X.confirmDelete = false;
    else if (r === 'delete-yes') { forget(); const hand = S.hand; S = fresh(); S.hand = hand; askedKeep = false; X.confirmDelete = false; X.verify = null; Object.keys(Draft).forEach(k => delete Draft[k]); refresh(); toast('Everything is deleted from this browser.'); }
    render({keep: true}); return;
  }

  /* Journal */
  if (d.journal) {
    if (d.journal === 'save') {
      const box = $('#jBox'), text = (box ? box.value : '').trim();
      if (!text) { toast('Write or speak a few words first.'); if (box) box.focus(); return; }
      S.journal.push({id: uid(), at: nowIso(), unit: null, q: JX.q || '', text: text.slice(0, 4000)});
      if (JX.anchor) { const t = today(), list = S.anchors[t] = S.anchors[t] || []; if (!list.includes(JX.anchor)) list.push(JX.anchor); }
      Draft.jBox = ''; JX.q = ''; JX.anchor = null; save(); render({keep: true}); toast('Saved to your journal. It is private to you.');
    } else if (d.journal === 'noq') { JX.q = ''; JX.anchor = null; render({keep: true}); }
    else if (d.journal === 'download') fileOut('my-journal.txt', journalText(), 'text/plain', 'Your journal');
    else if (d.journal === 'copy') copyText(journalText()).then(ok => { if (ok) toast('Your journal is copied.'); else { X.copyText = journalText(); X.copyWhat = 'Your journal'; render({keep: true}); } });
    return;
  }
  if (d.journalEdit != null) { JX.edit = d.journalEdit || null; JX.del = null; delete Draft.jEdit; render({keep: true}); const box = $('#jEdit'); if (box) box.focus(); return; }
  if (d.journalEditSave) { const j = S.journal.find(x => x.id === d.journalEditSave), box = $('#jEdit'), text = (box ? box.value : '').trim(); if (!text) { toast('A note cannot be empty. Delete it if you no longer want it.'); return; } if (j) { j.text = text.slice(0, 4000); j.edited = nowIso(); } JX.edit = null; delete Draft.jEdit; save(); render({keep: true}); toast('Note saved.'); return; }
  if (d.journalDel != null) { JX.del = d.journalDel || null; JX.edit = null; render({keep: true}); return; }
  if (d.journalDelYes) { S.journal = S.journal.filter(x => x.id !== d.journalDelYes); JX.del = null; save(); render({keep: true}); toast('Note deleted.'); return; }

  /* Tools */
  if (d.texample) { const t = toolOf(route.tool); T.vals[t.id] = JSON.parse(JSON.stringify(t.example)); render({keep: true}); return; }
  if (d.tclear) { const t = toolOf(route.tool); delete T.vals[t.id]; render({keep: true}); return; }
  if (d.trowAdd) { const t = toolOf(route.tool), v = toolVals(t); if (v[t.list.key].length < t.list.max) v[t.list.key].push({}); render({keep: true}); const rows = $$('.trow'); const last = rows[rows.length - 1]; if (last) { const i = last.querySelector('input'); if (i) i.focus(); } return; }
  if (d.tpick) { const t = toolOf(route.tool); toolVals(t)[t.pick.key] = d.tpick; render({keep: true}); return; }
  if (d.tcheck != null) { T.closed[d.tcheck] = !T.closed[d.tcheck]; render({keep: true}); return; }

  /* Ask */
  if (d.q != null) { const f = FAQ[+d.q]; A.last = {q: f.q, a: faqAnswer(f), go: f.go, units: [], open: f.dyn === 'next' ? nextOnPathway() : null}; render({keep: true}); const box = $('#answer'); if (box && window.matchMedia('(max-width: 900px)').matches) box.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest'}); return; }
  if (d.chips) { A.all = d.chips === '1'; render({keep: true}); return; }
});
document.addEventListener('input', e => {
  const el = e.target, d = el.dataset || {};
  if (d.draft) { Draft[d.draft] = el.value; return; }
  const t = toolOf(route.tool); if (!t) return;
  if (d.tf) { toolVals(t)[d.tf] = el.value; paintTool(); }
  else if (d.tr) { const k = d.tr.indexOf(':'), row = toolVals(t)[t.list.key][+d.tr.slice(0, k)]; if (row) { row[d.tr.slice(k + 1)] = el.value; paintTool(); } }
});
document.addEventListener('change', e => {
  if (e.target.id !== 'impFile') return;
  const f = e.target.files && e.target.files[0]; if (!f) return;
  if (f.size > 4000000) { X.importErr = 'This file is too large to be a learning record.'; render({keep: true}); return; }
  const rd = new FileReader();
  rd.onload = () => { Draft.imp = String(rd.result || ''); X.importErr = loadImport(Draft.imp.trim()); if (!X.importErr && !S.ledger.length) applyImport(); render({keep: true}); };
  rd.onerror = () => { X.importErr = 'The file could not be read. Paste the record instead.'; render({keep: true}); };
  rd.readAsText(f);
});
document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'unitFind') { render({keep: true}); return; }
  if (e.target.id === 'habitForm') { addHabit(); return; }
  if (e.target.id === 'askForm') { ask(($('#askInput') || {}).value); return; }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { stopSpeaking(); if (U.hearing != null) { U.hearing = null; render({keep: true}); } if (rec) { try { rec.stop(); } catch (er) {} } } });
window.addEventListener('pagehide', stopSpeaking);

/* ---------- start ---------- */
load();
Hand.set(S.hand !== false);
Hand.onChange(on => { S.hand = on; save(); });
renderFixed();
{ const r = parseHash(location.hash); if (r) { route = r; if (r.unit) openUnitState(r.unit); } }
render();

})();
