const D=window.TRADE_DATA;
let site=D.sites[0][0],tab='customer',pick=null;
document.getElementById('h1').textContent=document.title;document.getElementById('sites').innerHTML=D.sites.map(([k,n])=>`<button data-site="${k}">${n}</button>`).join('');
try{const ls=localStorage.getItem('site');if(D.sites.some(x=>x[0]===ls))site=ls;tab=localStorage.getItem('tab')||tab}catch(e){}
const $=s=>document.querySelector(s),V=$('#view');
const f=(n,d=2)=>Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtDate=s=>new Date(s+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const Q=()=>D.quotes.filter(q=>q.site===site);
const tbl=(cols,rows)=>`<div class="scroll"><table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
const tiles=a=>`<div class="tiles">${a.map(([k,v])=>`<div class="tile"><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
const stChip=s=>`<span class="chip ${s==='paid'?'go':s==='cancelled'?'bad':s==='quoted'?'warn':''}">${s}</span>`;

const views={
customer(){
 const qs=Q().filter(q=>q.status!=='cancelled');
 if(!pick||!qs.find(q=>q.ref===pick))pick=qs[0].ref;
 const q=qs.find(x=>x.ref===pick);
 const physical=q.incoterm==='DAP'||q.incoterm==='DDP';
 return `<div class="row" class="pickrow"><label for="pick">Show the page a buyer sees for:</label>
 <select id="pick">${qs.map(x=>`<option value="${x.ref}" ${x.ref===pick?'selected':''}>${x.ref} · ${esc(x.buyer_country)}</option>`).join('')}</select></div>
 <div class="card">
  <div class="muted">Your price, ${q.lines.length} item${q.lines.length>1?'s':''}</div>
  <div class="price">${q.invoice_currency} ${f(q.delivered_local)}</div>
  <ul class="ticks">
   <li>${esc(q.customer_says)}</li>
   ${physical?`<li>Arrives in about ${q.est_days} days.</li><li>Fully insured on the way. If anything is lost or damaged, we replace it.</li>`:`<li>${q.est_days?`Starts within about ${q.est_days} days.`:'Access opens straight away.'}</li><li>Covered by our insurance.</li>`}
   ${q.tax_usd>0?`<li>Includes ${esc(q.tax_name)} ${q.tax_pct}%.</li>`:''}<li>Price fixed until ${fmtDate(q.fx_locked_until)}.</li>
   <li>Pay by bank transfer or UPI. No hidden charges.</li>
  </ul>
  <button class="primary" disabled title="Demo only">Accept price (demo)</button>
 </div>
 <p class="muted" class="after">The buyer sees only this card. Freight, insurance, duty, exchange rate and cover sit behind it in the staff views.</p>`;
},
crm(){
 const qs=Q();
 return tiles([['Orders',qs.length],['Paid',qs.filter(q=>q.status==='paid').length],['Quoted',qs.filter(q=>q.status==='quoted').length],['Currencies',new Set(qs.map(q=>q.invoice_currency)).size]])+
 '<h2>Every order with its terms</h2>'+tbl(['Order','Status','Country','Currency','Rate / USD','Terms','Tax','Delivered USD','Customer pays','Days','Duty paid by'],
 qs.map(q=>`<tr><td>${q.ref}</td><td>${stChip(q.status)}</td><td>${esc(q.buyer_country)}</td><td>${q.invoice_currency}</td><td class="n">${f(q.fx_rate_per_usd,4)}</td><td><span class="chip">${q.incoterm}</span></td><td>${q.tax_name==null?'':esc(q.tax_name)+' '+q.tax_pct+'%'}</td><td class="n">${f(q.delivered_usd)}</td><td class="n">${f(q.delivered_local)}</td><td class="n">${q.est_days}</td><td>${q.duty_paid_by}</td></tr>`));
},
erp(){
 const ts=D.terms.filter(t=>t.site===site);
 return tiles([['Offers',ts.length],['Physical goods',ts.filter(t=>!['service','digital'].includes(t.goods_class)).length],['Dangerous goods',ts.filter(t=>t.dangerous_goods).length],['Services and licences',ts.filter(t=>['service','digital'].includes(t.goods_class)).length]])+
 '<h2>Clear terms on every offer</h2>'+tbl(['Offer','Family','Unit','List USD','Class','To customer','From supplier','Ships from','Lead days','Valid','Payment'],
 ts.map(t=>`<tr><td>${t.item_id}</td><td>${esc(t.family)}</td><td>${esc(t.unit)}</td><td class="n">${f(t.list_price)}</td><td>${t.dangerous_goods?'<span class="chip warn">'+t.goods_class+'</span>':t.goods_class}</td><td>${t.customer_incoterm}</td><td>${t.supplier_incoterm||'none'}</td><td>${esc(t.ships_from)}</td><td class="n">${t.supplier_lead_days??''}</td><td>${t.price_valid}</td><td>${esc(t.payment)}</td></tr>`));
},
fx(){
 const h=D.forwards.filter(x=>x.site===site),m=D.mis[site];
 const today=D.ccy.filter(c=>c.code!=='USD');
 const exp=Object.entries(m.fx_exposure);
 return tiles([['Forward contracts',h.length],['Booked',h.filter(x=>x.status==='booked').length],['Planned (50%)',h.filter(x=>x.status==='planned').length],['Cover rule',esc(D.policy.short||'')]])+
 '<h2>Exposure and cover by currency</h2>'+tbl(['Currency','Orders','Exposure USD','Covered USD','Cover','Note'],exp.map(([c,e])=>`<tr><td>${c}</td><td class="n">${e.orders}</td><td class="n">${f(e.exposure_usd)}</td><td class="n">${f(e.covered_usd)}</td><td><div class="bar"><i data-w="${Math.min(100,e.hedge_ratio_pct)}"></i></div> ${e.hedge_ratio_pct}%</td><td>${e.pegged?'<span class="chip">pegged to USD, no cover needed</span>':''}</td></tr>`))+
 '<h2>Forward contracts</h2>'+tbl(['Contract','Order','We sell','Amount','Cover','Spot','Forward','Days','Matures','Status','Maker / checker'],h.map(x=>`<tr><td>${x.id}</td><td>${x.order_ref}</td><td>${x.we_sell}</td><td class="n">${f(x.notional_local)}</td><td class="n">${x.cover_pct}%</td><td class="n">${f(x.spot_at_booking,4)}</td><td class="n">${f(x.forward_rate,4)}</td><td class="n">${x.tenor_days}</td><td>${fmtDate(x.maturity)}</td><td>${stChip(x.status==='booked'?'paid':'quoted').replace(/>(paid|quoted)</,'>'+x.status+'<')}</td><td>${esc(x.maker)} / ${esc(x.checker)}</td></tr>`))+
 '<h2>Today\'s demo rates (units per 1 USD)</h2>'+tbl(['Currency','Name','Rate','Pegged','Countries'],today.map(c=>`<tr><td>${c.code}</td><td>${esc(c.name)}</td><td class="n">${f(c.demo_per_usd_today,4)}</td><td>${c.pegged?'yes':'no'}</td><td>${esc(c.countries.join(', '))}</td></tr>`))+
 '<h2>Cover policy</h2><ul>'+D.policy.rules.map(r=>`<li>${esc(r)}</li>`).join('')+'</ul>';
},
ship(){
 const lines=Q().filter(q=>q.status!=='cancelled').flatMap(q=>q.lines.map(l=>({...l,ref:q.ref,dest:q.buyer_country})));
 return '<h2>Best delivery and insurance for every line</h2><p class="muted">Rule: only modes that are safe for the goods (over 5 tonnes never by air). Among those, lowest cost plus time wins. Services, online access and events have no shipping.</p>'+
 tbl(['Order','Offer','From','To','Class','Chosen mode','Freight USD','Days','Other safe options','Policy','Insured USD','Premium USD'],
 lines.map(l=>`<tr><td>${l.ref}</td><td>${l.item_id}</td><td>${esc(l.ships_from)}</td><td>${esc(l.dest)}</td><td>${l.goods_class}</td><td><span class="chip go">${esc(l.delivery.mode)}</span></td><td class="n">${f(l.delivery.cost_usd)}</td><td class="n">${l.delivery.days}</td><td>${l.other_options.map(o=>esc(o.mode)+' '+o.days+'d').join(', ')||'none'}</td><td>${l.insurance.policy}</td><td class="n">${f(l.insurance.insured_usd)}</td><td class="n">${f(l.insurance.premium_usd)}</td></tr>`))+
 '<h2>Insurance policies (demo)</h2>'+tbl(['Policy','Type','Clause','Covers','Basis','Insurer'],D.policies.map(p=>`<tr><td>${p.id}</td><td>${esc(p.type)}</td><td>${esc(p.clause)}</td><td>${esc(p.covers)}</td><td>${esc(p.basis)}</td><td>${esc(p.insurer)}</td></tr>`));
},
mis(){
 const m=D.mis[site],mix=o=>Object.entries(o).map(([k,v])=>`<span class="chip">${esc(k)} ${v}</span>`).join(' ');
 return tiles([['Live orders',m.orders],['Goods USD',f(m.goods_usd,0)],['Freight % of goods',m.freight_pct_of_goods+'%'],['Insurance % of goods',m.insurance_pct_of_goods+'%'],['Duty we pay USD',f(m.duty_we_pay_usd,0)],['Avg days to deliver',m.avg_delivery_days],['Forward contracts',m.forwards]].concat(m.tax_usd!=null?[['Tax collected USD',f(m.tax_usd,0)]]:[]))+
 `<h2>Terms mix</h2><div class="row">${mix(m.incoterm_mix)}</div><h2>Delivery mode mix</h2><div class="row">${mix(m.delivery_mode_mix)}</div>`;
},
rules(){
 return '<h2>Incoterms 2020: who does what</h2><p class="muted">S = we (seller), B = buyer, S* = not required by the rule but we insure anyway. Customers get DAP or DDP only, so for them it is simple: we deliver to the door.</p>'+
 tbl(['Rule','Name','Any transport','Export clearance','Main transport','Insurance','Import duty','Risk passes','To customers','From suppliers'],D.inco.map(i=>`<tr><td><b>${i.code}</b></td><td>${esc(i.name)}</td><td>${i.any_mode?'yes':'sea only'}</td><td>${i.export_clearance}</td><td>${i.main_carriage}</td><td>${i.insurance}</td><td>${i.import_clearance_duty}</td><td>${esc(i.risk_passes)}</td><td>${i.we_offer_customers?'<span class="chip go">yes</span>':''}</td><td>${i.we_accept_from_suppliers?'<span class="chip">yes</span>':''}</td></tr>`));
}};

function draw(){
 document.querySelectorAll('[data-site]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.site===site));
 document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tab===tab));
 V.innerHTML=views[tab]();
 document.querySelectorAll('[data-w]').forEach(x=>x.style.width=x.dataset.w+'%');const p=$('#pick');if(p)p.onchange=e=>{pick=e.target.value;draw()};
 try{localStorage.setItem('site',site);localStorage.setItem('tab',tab)}catch(e){}
}
document.querySelectorAll('[data-site]').forEach(b=>b.onclick=()=>{site=b.dataset.site;pick=null;draw()});
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;draw()});
$('#theme').onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark'};
document.getElementById('note').textContent=D.note||'';
if(!views[tab])tab='customer';
draw();
