/* Original templates, written for our sectors. No third-party text. */
(function(){
var SECTORS={learning:"Learning and skills",enterprise:"Enterprise development",semi:"Semiconductors",pcb:"PCB and HDI",procurement:"Procurement",energy:"Energy and electrical"};

/* Questions library: label + example per sector (fallback in "all") */
var F={
topic:{q:"What is this about? (the topic, product or service)",ex:{learning:"a 6-week data skills course",enterprise:"a ready-made company set-up pack",semi:"a trusted chip supply route",pcb:"HDI boards for compact devices",procurement:"one portal for all quotes",energy:"safe low-voltage panel design",all:"your topic"}},
audience:{q:"Who is it for?",ex:{learning:"working parents who want a new skill",enterprise:"first-time founders",semi:"design engineers",pcb:"hardware start-ups",procurement:"small factory buyers",energy:"site electricians",all:"your reader"}},
benefit:{q:"What good thing do they get?",ex:{learning:"earn a skill certificate in 6 weeks",enterprise:"launch with clear papers in 30 days",semi:"find in-stock parts without delay",pcb:"get boards that fit and work first time",procurement:"compare offers side by side",energy:"cut wiring errors on site",all:"the main benefit"}},
pain:{q:"What problem or worry do they have today?",ex:{learning:"no time to study and no proof of skill",enterprise:"too many forms and no clear path",semi:"long waits and fake-part risk",pcb:"re-spins that waste weeks",procurement:"quotes in ten different formats",energy:"rework after inspection",all:"the common problem"}},
mistake:{q:"What is a common mistake? (optional)",ex:{learning:"studying without a plan",enterprise:"buying before checking rules",semi:"ordering from unknown sellers",pcb:"ignoring stack-up early",procurement:"choosing on price alone",energy:"skipping cable checks",all:"a common mistake"}},
result:{q:"Give one real or planned result (optional)",ex:{learning:"learners finish a full journey in one month",enterprise:"a complete pack in 14 days",semi:"parts located in 24 hours",pcb:"first-pass boards on 9 of 10 jobs",procurement:"three offers compared in one hour",energy:"fewer site visits",all:"a result you can prove"}},
proof:{q:"What proof can you show? (optional)",ex:{all:"certificates, test reports, sample work, a clear process"}},
number:{q:"A number to use (steps, tips, weeks) (optional)",ex:{all:"5"}},
timeframe:{q:"How long does it take? (optional)",ex:{all:"30 days"}},
offer:{q:"What is the offer? (optional)",ex:{learning:"first lesson free, then USD 39 per learner per month",enterprise:"free first call",semi:"free part check",pcb:"free design review",procurement:"free demo",energy:"free checklist",all:"your offer"}},
deadline:{q:"Any date or deadline? (optional)",ex:{all:"until Friday"}},
action:{q:"What should they do next?",ex:{all:"Register today"}},
name:{q:"Your name or team name (optional)",ex:{all:"Team name"}}
};

var T={
headlines:{name:"Headlines",models:{
 fav:{name:"Headline Favorites",note:"Clear headlines that promise a benefit. Good for pages, titles and posts.",fields:["topic","audience","benefit","pain","number","timeframe"],lines:[
  "How {{audience}} can {{benefit}}",
  "{{number}} ways {{audience}} can {{benefit}}",
  "Tired of {{pain}}? Try {{topic}}",
  "{{benefit}} in {{timeframe}}: a simple plan for {{audience}}",
  "The plain guide to {{topic}}",
  "What {{audience}} should know before choosing {{topic}}"]},
 question:{name:"Question Headlines",note:"Headlines that ask the reader a question they care about.",fields:["topic","audience","pain","benefit"],lines:[
  "Is {{pain}} slowing down {{audience}}?",
  "What if {{audience}} could {{benefit}}?",
  "Why do so many {{audience}} struggle with {{pain}}?",
  "Ready to try {{topic}}?"]}}},
sales:{name:"Sales Letters",models:{
 plain:{name:"Plain Problem-to-Solution Letter",note:"Names the problem, shows the way out, gives proof, then asks for action.",fields:["audience","pain","topic","benefit","proof","result","offer","deadline","action","name"],lines:[
  "Dear {{audience}},",
  "If you are dealing with {{pain}}, you are not alone.",
  "That is why we built {{topic}}. With it you can {{benefit}}.",
  "Here is what that looks like: {{result}}.",
  "You can check it yourself: {{proof}}.",
  "Our offer: {{offer}}. {{deadline}}",
  "{{action}}.",
  "Warm regards,\n{{name}}"]}}},
ads:{name:"Search Ads",models:{
 short:{name:"Short Search Ad",note:"Headline plus two description lines.",fields:["topic","benefit","offer","action"],lines:[
  "Headline: {{topic}} | {{benefit}}",
  "Line 1: {{offer}}",
  "Line 2: {{action}}"]}}},
social:{name:"Social Posts (draft)",models:{
 hook:{name:"Hook, Point, Ask",note:"Three short lines for a post. Review before you publish yourself.",fields:["pain","topic","benefit","action","audience"],lines:[
  "{{audience}}: {{pain}}?",
  "{{topic}} helps you {{benefit}}.",
  "{{action}}."]}}},
email:{name:"Emails - Singles",models:{
 single:{name:"One Clear Email",note:"Subject, opening, body, call to action.",fields:["audience","pain","topic","benefit","offer","action","name"],lines:[
  "Subject: {{benefit}}",
  "Hello {{audience}},",
  "Many people tell us about {{pain}}. {{topic}} is our answer.",
  "What you get: {{benefit}}.",
  "{{offer}}",
  "{{action}}.",
  "{{name}}"]}}},
sequence:{name:"Emails - Sequences",models:{
 five:{name:"Five-Day Welcome Sequence",note:"Five short emails, one per day.",fields:["audience","pain","topic","benefit","proof","offer","action"],lines:[
  "Day 1 - Welcome: Thank you {{audience}}. Today we explain {{topic}} in one minute.",
  "Day 2 - The problem: {{pain}}. Why it happens and how to see it early.",
  "Day 3 - The way forward: {{benefit}}. Three small steps.",
  "Day 4 - Proof: {{proof}}.",
  "Day 5 - Invitation: {{offer}}. {{action}}."]}}},
video:{name:"Video Scripts",models:{
 minute:{name:"One-Minute Explainer",note:"A script you can read aloud in about one minute.",fields:["audience","pain","topic","benefit","result","action"],lines:[
  "[0:00] Hello {{audience}}. Have you faced {{pain}}?",
  "[0:10] Today I show you {{topic}}.",
  "[0:25] With it you can {{benefit}}.",
  "[0:40] For example: {{result}}.",
  "[0:52] {{action}}. Thank you for watching."]}}},
webinar:{name:"Webinar Outline",models:{
 plan:{name:"45-Minute Webinar Plan",note:"A simple outline with timings.",fields:["topic","audience","pain","benefit","mistake","result","offer","action"],lines:[
  "0-5 min: Welcome. Who is here, and why {{topic}} matters to {{audience}}.",
  "5-15 min: The problem: {{pain}}.",
  "15-25 min: Common mistake: {{mistake}}.",
  "25-35 min: The method, step by step. Goal: {{benefit}}.",
  "35-40 min: Proof: {{result}}.",
  "40-45 min: Offer: {{offer}}. {{action}}."]}}},
upsell:{name:"Upsells",models:{
 next:{name:"Next-Step Upsell",note:"Offer a helpful next step right after a purchase.",fields:["topic","benefit","offer","action"],lines:[
  "Before you go: add {{topic}} to go further.",
  "It helps you {{benefit}}.",
  "{{offer}}. {{action}}."]}}},
cta:{name:"Calls to Action",models:{
 short:{name:"Short Buttons and Lines",note:"Short lines for buttons and ends of pages.",fields:["action","benefit","topic","deadline"],lines:[
  "{{action}}",
  "{{action}} and {{benefit}}",
  "See {{topic}} now",
  "{{action}} {{deadline}}"]}}},
testimonial:{name:"Testimonial Requests",models:{
 ask:{name:"Polite Feedback Request",note:"Asks for a short, honest story. Never invent a testimonial.",fields:["topic","benefit","name"],lines:[
  "Hello! Thank you for using {{topic}}.",
  "Could you share two or three lines about how it helped you {{benefit}}?",
  "Please say only what is true for you. Thank you, {{name}}."]}}},
course:{name:"Course Promotion",models:{
 launch:{name:"Course Launch Message",note:"For learning sectors: what you will be able to do after the course.",fields:["topic","audience","benefit","number","timeframe","offer","action"],lines:[
  "New course: {{topic}}.",
  "Made for {{audience}}.",
  "By the end you will be able to {{benefit}}.",
  "{{number}} lessons, about {{timeframe}}.",
  "{{offer}}.",
  "{{action}}."]}}}
};
window.SW={sectors:SECTORS,fields:F,types:T};
})();
