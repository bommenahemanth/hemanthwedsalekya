
(()=>{'use strict';
/* ===== Edit wedding details here ===== */
const WEDDING={
  year:2026,
  tz:'-06:00',tzName:'CST',
  // Each event can override this with its own `venue`.
  venue:{name:'Avula Ranch',address:'8411 Shady Brook Ln, Celina, TX 75009',short:'Avula Ranch · Celina, Texas'},
  // Apps Script web-app URL (Deploy → Web app → /exec). Empty = RSVP form shows "not open yet".
  apiUrl:'https://script.google.com/macros/s/AKfycbwfWNM2aB6quu7TjjHwZSsrRbQYQyw6yPDr3I-IK5sjmXt-Rjmqsl2yOU5ueXJ-tqGd/exec',
  contact:{email:'bommenahemanth@gmail.com',whatsapp:'+918124269822',whatsappLabel:'+91 81242 69822',call:'+14699967434',callLabel:'+1 (469) 996-7434'},
  // "Questions? Reach us" people; sms:false hides the iMessage/Text button for that number.
  contacts:[
    {name:'Hemanth',role:'Groom',relation:'The groom',te:'వరుడు',c1:'#a32a3a',c2:'#5a0e17',email:'bommenahemanth@gmail.com',phones:[{n:'+14699967434',label:'+1 (469) 996-7434',tag:'USA'},{n:'+918124269822',label:'+91 81242 69822',tag:'India',sms:false}]},
    {name:'Alekya',role:'Bride · Spouse',relation:'The bride · Hemanth’s spouse',te:'వధువు',c1:'#d0336f',c2:'#7a0e3a',email:'vemulaalekya4@gmail.com',phones:[{n:'+16823924684',label:'+1 (682) 392-4684'}]},
    {name:'Shiva',role:'Brother',relation:'Hemanth’s brother',te:'సోదరుడు',c1:'#1b9a66',c2:'#0b5a3a',phones:[{n:'+15513258695',label:'+1 (551) 325-8695'}]},
    {name:'Meghana',role:'Sister',relation:'Hemanth’s sister',te:'సోదరి',c1:'#eb9a2a',c2:'#a8560a',email:'bommenameghana@gmail.com',phones:[{n:'+19403314433',label:'+1 (940) 331-4433'}]}
  ],
  // Drive times checked on Google Maps (Sat 31 Oct 2026, light traffic).
  airports:[{code:'DFW',name:'Dallas Fort Worth International',origin:'DFW Airport, TX',miles:45,mins:50},{code:'DAL',name:'Dallas Love Field',origin:'Dallas Love Field, Dallas, TX',miles:46,mins:55}],
  // Slideshow photos after the first (inline) one; loaded only as they come up.
  photos:['photos/02.jpg','photos/03.jpg','photos/04.jpg','photos/05.jpg','photos/06.jpg'],
  music:{src:'music/veena-shenai.m4a',credit:'Music: “Veena and Shenai” by Antti Luode, CC BY 3.0, via Wikimedia Commons (first 3 seconds trimmed)',link:'https://commons.wikimedia.org/wiki/File:Veena_And_Shenai_(Antti_Luode).mp3'},
  events:[
    {id:'pelli',d:29,m:11,t:'18:00',hrs:3,icon:'kalash',accent:'#d9480f',title:'Pelli Koduku & Pelli Kuthuru',te:'పెళ్లికొడుకు · పెళ్లికూతురు',note:'Mangala snanam and blessings as the groom and bride are adorned for the wedding.'},
    {id:'sangeet',d:1,m:12,t:'18:00',hrs:4,icon:'music',accent:'#8e2453',title:'Sangeet / Cocktail Party',te:'సంగీత్',note:'An evening of music, dance and cheers. Come ready to celebrate!'},
    {id:'haldi',d:2,m:12,t:'10:00',hrs:3,icon:'haldi',accent:'#e0a100',title:'Haldi',te:'హల్దీ · పసుపు',note:'Turmeric, laughter and a golden glow. Wear something yellow!'},
    {id:'pratham',d:2,m:12,t:'18:00',hrs:3,icon:'thali',accent:'#a3162b',title:'Pratham (Prathanam)',te:'ప్రధానం',note:'Our families come together to exchange blessings and gifts.'},
    {id:'muhurtham',d:3,m:12,t:'09:47',hrs:3,icon:'mangalsutra',accent:'#c9a24a',main:true,title:'Marriage (Muhurtham)',te:'శుభ ముహూర్తం',note:'Jeelakarra–Bellam at the auspicious hour, as two families become one.'}
  ]
};
/* ===================================== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=document.documentElement,body=document.body,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
window.HX_SCHEDULE=Object.freeze({year:WEDDING.year,tz:WEDDING.tz,events:WEDDING.events.map(({id,d,m,t,hrs})=>({id,d,m,t,hrs}))});
// Themed replacements for the browser's confirm()/alert() boxes; both resolve when the guest answers.
function ask(msg,{title='Are you sure?',ok='OK',cancel='Cancel',info=false}={}){const d=$('#ux-ask');if(!d||!d.showModal)return Promise.resolve(info||window.confirm(msg));$('#ux-ask-title').textContent=title;$('#ux-ask-msg').textContent=msg;$('#ux-ask-ok').textContent=ok;$('#ux-ask-cancel').textContent=cancel;$('#ux-ask-cancel').hidden=info;d.classList.toggle('info',info);d.returnValue='';d.showModal();$('#ux-ask-ok').focus();return new Promise(res=>d.addEventListener('close',()=>res(d.returnValue==='ok'),{once:true}))}
function tell(msg,title='Something went wrong'){return ask(msg,{title,ok:'OK',info:true})}
const pad=n=>String(n).padStart(2,'0'),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'],DAY=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const startOf=e=>new Date(`${WEDDING.year}-${pad(e.m)}-${pad(e.d)}T${e.t}:00${WEDDING.tz}`),endOf=e=>new Date(+startOf(e)+e.hrs*36e5);
const weekday=e=>DAY[new Date(Date.UTC(WEDDING.year,e.m-1,e.d)).getUTCDay()];
const time12=t=>{let[h,m]=t.split(':').map(Number);const ap=h<12?'AM':'PM';h=h%12||12;return`${h}:${pad(m)} ${ap}`};
const placeOf=e=>{const v=e.venue||WEDDING.venue;return[v.name,v.address].filter(Boolean).join(', ')};
const mapQuery=e=>{const v=e.venue||WEDDING.venue;return v.address||v.name};
// Android shows its "open with" app picker for geo: links; iPhones open Apple Maps; computers get Google Maps.
const mapHref=q=>{const e=encodeURIComponent(q),ua=navigator.userAgent;if(/Android/i.test(ua))return`geo:0,0?q=${e}`;if(/iP(hone|ad|od)/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1))return`https://maps.apple.com/?q=${e}`;return`https://www.google.com/maps/search/?api=1&query=${e}`};
const muhurtham=WEDDING.events.find(e=>e.main),first=WEDDING.events[0];
const fills={muhurthamDate:`${weekday(muhurtham).slice(0,3)} · ${muhurtham.d} ${MON[muhurtham.m-1].slice(0,3)} ${WEDDING.year}`,muhurthamTime:`${time12(muhurtham.t)}`,muhurthamFull:`${weekday(muhurtham)}, ${muhurtham.d} ${MON[muhurtham.m-1]} ${WEDDING.year} · ${time12(muhurtham.t)} ${WEDDING.tzName}`,envRange:`${first.d} ${MON[first.m-1].slice(0,3)} – ${muhurtham.d} ${MON[muhurtham.m-1].slice(0,3)} ${WEDDING.year}`,tzName:WEDDING.tzName,venueShort:WEDDING.venue.short||WEDDING.venue.name};
$$('[data-fill]').forEach(el=>{if(fills[el.dataset.fill])el.textContent=fills[el.dataset.fill]});
$('.backdrop').style.backgroundImage=`linear-gradient(#3a0a108c,#22050ab3),url("${$('#art').src}")`;

/* ----- Event cards ----- */
const ICONS={
  kalash:'<path d="M15 24h18c2.5 6 1 13-4 16H19c-5-3-6.5-10-4-16Z"/><path d="M17 20h14v4H17z"/><path d="M19 20c-4-1-7-4-8-8 4 0 7 3 8 8Zm10 0c4-1 7-4 8-8-4 0-7 3-8 8Z"/><circle cx="24" cy="14" r="5"/><path d="M19 31h10"/>',
  rings:'<circle cx="18" cy="30" r="9"/><circle cx="30" cy="30" r="9"/><path d="M26 16l2.5-4.5h3L34 16l-4 5Z"/>',
  music:'<path d="M17 35V14l19-5v21"/><path d="M17 20l19-5"/><ellipse cx="13" cy="35" rx="4.5" ry="3.5"/><ellipse cx="32" cy="30" rx="4.5" ry="3.5"/>',
  haldi:'<path d="M7 26h34c0 8.5-7.5 14-17 14S7 34.5 7 26Z"/><path d="M13 26c2-6 20-6 22 0"/><path d="M27 19c2-6 7-9 13-9-1 5-5 9-13 9Zm0 0 7-5"/>',
  mandala:'<circle cx="24" cy="24" r="4"/><circle cx="24" cy="24" r="18"/>'+[0,45,90,135,180,225,270,315].map(a=>`<ellipse cx="24" cy="13.5" rx="3" ry="5.5" transform="rotate(${a} 24 24)"/>`).join(''),
  thali:'<ellipse cx="24" cy="34" rx="18" ry="6"/><path d="M16 28c2 4 14 4 16 0Z"/><path d="M24 24c-3-3-2.5-7 0-11 2.5 4 3 8 0 11Z"/><circle cx="11" cy="31" r="1.6"/><circle cx="37" cy="31" r="1.6"/>',
  mangalsutra:'<path d="M9 7c0 16 8 25 15 25s15-9 15-25"/><circle cx="20" cy="37" r="4.2"/><circle cx="28" cy="37" r="4.2"/>'
};
const clockSvg='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.3"/><path d="M8 4.5V8l2.4 1.6"/></svg>',pinSvg='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.6s4.8-4.1 4.8-8A4.8 4.8 0 0 0 3.2 6.6c0 3.9 4.8 8 4.8 8Z"/><circle cx="8" cy="6.6" r="1.7"/></svg>',calSvg='<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v4M13 2v4M10 10.5v4M8 12.5h4"/></svg>',mapSvg='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18s6-5.2 6-10A6 6 0 0 0 4 8c0 4.8 6 10 6 10Z"/><circle cx="10" cy="8" r="2.2"/></svg>';
$('#tl-list').innerHTML=WEDDING.events.map((e,i)=>`<li class="tl-item${e.main?' main':''}" style="--accent:${esc(e.accent)}"><div class="tl-node" aria-hidden="true"><svg viewBox="0 0 48 48">${ICONS[e.icon]||''}</svg></div><article class="card" data-reveal="left" style="--d:${(.05+i*.12).toFixed(2)}s" aria-labelledby="ev-${esc(e.id)}"><div class="card-top"><div class="date-badge" aria-hidden="true"><b>${e.d}</b><span>${MON[e.m-1].slice(0,3).toUpperCase()}</span><small>${weekday(e).slice(0,3)}</small></div><div><h3 id="ev-${esc(e.id)}">${esc(e.title)}</h3><p class="te" lang="te">${esc(e.te)}</p><p class="time">${clockSvg}<span><span class="sr-date" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${weekday(e)} ${e.d} ${MON[e.m-1]}, </span>${time12(e.t)}</span></p></div></div><p class="note">${esc(e.note)}</p><svg class="card-art" viewBox="0 0 48 48" aria-hidden="true">${ICONS[e.icon]||''}</svg></article></li>`).join('');

{const l=$('#venue-link'),h=mapHref(mapQuery({}));$('#venue-text').textContent=placeOf({});l.href=h;if(h.startsWith('http')){l.target='_blank';l.rel='noopener noreferrer'}
 $('#drive-line').textContent=WEDDING.airports.map(a=>`~${a.mins} min from ${a.code==='DAL'?'Love Field':a.code}`).join(' · ')}

/* ----- Calendar ----- */
const utc=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
const summary=e=>`${e.title} · Hemanth & Alekya’s Wedding`,details=e=>`${e.note}\n\nWith love, Hemanth Bommena & Alekya Vemula`;
const gcal=e=>'https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:summary(e),dates:utc(startOf(e))+'/'+utc(endOf(e)),details:details(e),location:placeOf(e)});
const icsText=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([,;])/g,'\\$1');
const fold=l=>{const out=[];let cur='';for(const ch of l){if(new TextEncoder().encode(cur+ch).length>73){out.push(cur);cur=' '+ch}else cur+=ch}out.push(cur);return out.join('\r\n')};
const vevent=e=>['BEGIN:VEVENT',`UID:${e.id}-${WEDDING.year}@hemanth-alekya.wedding`,`DTSTAMP:${utc(new Date())}`,`DTSTART:${utc(startOf(e))}`,`DTEND:${utc(endOf(e))}`,`SUMMARY:${icsText(summary(e))}`,`DESCRIPTION:${icsText(details(e))}`,...(placeOf(e)?[`LOCATION:${icsText(placeOf(e))}`]:[]),'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Reminder','TRIGGER:-PT2H','END:VALARM','END:VEVENT'];
const ics=list=>['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Hemanth & Alekya//Wedding Invitation//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Hemanth & Alekya’s Wedding',...list.flatMap(vevent),'END:VCALENDAR'].map(fold).join('\r\n')+'\r\n';
// src/calendars.js uses the lines above to publish assets/cal/<event ids>.ics: Apple shows "Add All" for it, Google subscribes to it.
const SITE=document.querySelector('meta[property="og:url"]')?.content||location.href;
const calFile=list=>'assets/cal/'+list.map(e=>e.id).join('-')+'.ics';
const gcalAll=list=>'https://calendar.google.com/calendar/render?cid='+encodeURIComponent(new URL(calFile(list),SITE).href.replace(/^https?:/,'webcal:'));
const sheet=$('#cal');let current=null;
function openSheet(e){current=e;$('#cal-title').textContent=e.title;$('#cal-when').textContent=`${weekday(e)}, ${e.d} ${MON[e.m-1]} ${WEDDING.year} · ${time12(e.t)} ${WEDDING.tzName}`;$('#cal-google').href=gcal(e);if(sheet.showModal)sheet.showModal();else sheet.setAttribute('open','')}
$('#cal-ics').onclick=()=>{if(current)location.href=calFile([current])};
sheet.addEventListener('click',e=>{const r=sheet.getBoundingClientRect();if(e.target===sheet&&(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right))sheet.close()});

/* ----- Subtle countdown on the envelope and opening screen; "Happily wed" once the muhurtham has passed ----- */
const target=startOf(muhurtham);let lastCount='';
function tick(){const ms=target-Date.now(),pl=(n,w)=>`${n} ${w}${n===1?'':'s'}`;let t;
  if(ms<=0)t=ms>-12*36e5?'The muhurtham is today':`Happily wed · ${muhurtham.d} ${MON[muhurtham.m-1].slice(0,3)} ${WEDDING.year}`;
  else{const m=Math.floor(ms/6e4),d=Math.floor(m/1440),h=Math.floor(m%1440/60),mi=m%60;t=d?`${pl(d,'day')} · ${pl(h,'hr')} · ${pl(mi,'min')} to go`:`${pl(h,'hr')} · ${pl(mi,'min')} to go`}
  if(t===lastCount)return;lastCount=t;body.classList.toggle('wed',ms<=-12*36e5);
  $$('[data-count]').forEach(el=>{let s=el.firstElementChild;if(!s){s=document.createElement('span');el.appendChild(s)}s.classList.remove('tick');void s.offsetWidth;s.textContent=t;s.classList.add('tick')})}
tick();setInterval(tick,1000);

/* ----- Thoranam garlands (marigold, jasmine, mango leaves) ----- */
const mari=(x,y,r,g)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="url(#${g})" stroke="#c2410c" stroke-width="1.1" stroke-dasharray="1.6 1.1"/>`;
const jas=(x,y)=>`<g fill="#fffdf6" stroke="#cfc4a4" stroke-width=".5"><circle cx="${(x-2.3).toFixed(1)}" cy="${(y+.8).toFixed(1)}" r="2.5"/><circle cx="${(x+2.3).toFixed(1)}" cy="${(y+.8).toFixed(1)}" r="2.5"/><circle cx="${x.toFixed(1)}" cy="${(y-1.9).toFixed(1)}" r="2.5"/></g>`;
function garland(el){const jasmineLead=el.dataset.garland==='jasmine',W=400,anchors=[0,80,160,240,320,400];let s=`<svg viewBox="0 0 ${W} 100" aria-hidden="true">`;
  for(let x=10;x<W;x+=20)s+=`<path d="M${x} 4c-5 8-5.5 18 0 27 5.5-9 5-19 0-27Z" fill="url(#lf)"/><path d="M${x} 5v24" stroke="#22501a" stroke-width=".6"/>`;
  s+=`<path d="M0 4H${W}" stroke="#7a4a1c" stroke-width="2"/>`;
  for(let i=0;i<anchors.length-1;i++){const a=anchors[i],b=anchors[i+1],n=10;for(let k=0;k<=n;k++){const t=k/n,x=a+(b-a)*t,y=6+4*28*t*(1-t);s+=(k%2===(jasmineLead?0:1))?jas(x,y):mari(x,y,5.4,k%4===1?'my':'mg')}}
  anchors.slice(1,-1).forEach((x,i)=>{s+=`<g class="drop" style="--d:${(-i*.6).toFixed(1)}s"><path d="M${x} 6V62" stroke="#7a4a1c" stroke-width="1"/>`;for(let j=0;j<6;j++){const y=12+j*9.5;s+=j%2?jas(x,y):mari(x,y,4.8,j%4?'my':'mg')}s+=`<path d="M${x-4} 66h8l-1.4 9h-5.2Z" fill="url(#gp)"/><circle cx="${x}" cy="77" r="1.6" fill="#8a6420"/></g>`});
  el.innerHTML=s+'</svg>'}
$$('[data-garland]').forEach(garland);
const rose=(x,y,r=3.4)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="url(#rose)" stroke="#7d1a26" stroke-width=".6"/>`;
const bell=(x,y)=>`<path d="M${x-6} ${y+12}c0-7 2-11 6-11s6 4 6 11Z" fill="url(#gp)" stroke="#8a6420" stroke-width=".6"/><rect x="${x-7}" y="${y+11.5}" width="14" height="2" rx="1" fill="#b8862f"/><circle cx="${x}" cy="${y+15}" r="1.6" fill="#8a6420"/>`;
$$('[data-strand]').forEach(el=>{const n=+el.dataset.strand,H=n*9+30;let s=`<svg viewBox="0 0 20 ${H}"><path d="M10 0V${H-24}" stroke="#7a4a1c" stroke-width=".8"/>`;for(let j=0;j<n;j++){const y=6+j*9;s+=j%3===2?rose(10,y):jas(10,y)}el.innerHTML=s+bell(10,H-24)+'</svg>'});
$$('[data-arch]').forEach(el=>{const pt=t=>[150-136*Math.cos(t),146-136*Math.sin(t)];let s='<svg viewBox="0 0 300 160">';
  for(let k=1;k<14;k++){const[x,y]=pt(Math.PI*k/14);s+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}c-4 6-4 14 0 21 4-7 4-15 0-21Z" fill="url(#lf)"/>`}
  for(let k=0;k<=36;k++){const[x,y]=pt(Math.PI*k/36);s+=k%4===2?rose(x,y,3.8):jas(x,y)}
  for(let j=0;j<4;j++)s+=j%2?rose(150,16+j*7,3):jas(150,16+j*7);
  el.innerHTML=s+'</svg>'});

/* ----- Decor drawn in SVG: banana plants, caparisoned elephants, kalash, parrots, silk curtains, bells, peacock feathers, lotus pond ----- */
const P=n=>+n.toFixed(1);
const bLeaf=(x,y,a,L,w)=>{let v='';for(let i=1;i<8;i++){const t=i/8,mx=2*(1-t)*t*L*.55+t*t*L,my=t*t*L*.18,h=w*(1-(2*t-1)**2)*.7;v+=`M${P(mx)} ${P(my)}l${P(L*.05)} ${P(-h)}M${P(mx)} ${P(my)}l${P(L*.05)} ${P(h*.9)}`}
  return`<g transform="translate(${x} ${y}) rotate(${a})${Math.abs(a)>90?' scale(1 -1)':''}"><path d="M0 0C${P(L*.3)} ${-w} ${P(L*.75)} ${P(-w*.8)} ${L} ${P(L*.18)}C${P(L*.72)} ${P(w*.7)} ${P(L*.3)} ${P(w*.9)} 0 0Z" fill="url(#bnl)" stroke="#2f6a1f" stroke-width=".8"/><path d="${v}" stroke="#2f6a1f" stroke-opacity=".4" stroke-width=".7"/><path d="M0 0Q${P(L*.55)} 0 ${L} ${P(L*.18)}" fill="none" stroke="#e3efb4" stroke-width="1.6"/></g>`};
const DECO={
  banana:()=>`<svg viewBox="0 0 160 300"><path d="M72 300C70 240 72 190 75 150h12c3 40 5 90 3 150Z" fill="url(#bnt)"/><path d="M78 298c-1-50 0-96 3-146" stroke="#4d6a24" stroke-width="1.2" fill="none" opacity=".5"/>${bLeaf(80,150,-160,120,24)}${bLeaf(80,150,-118,132,25)}${bLeaf(82,150,-64,130,25)}${bLeaf(82,150,-20,118,22)}${bLeaf(80,153,168,98,20)}<path d="M81 150c-3-20-2-48 2-72 4 24 4 52 0 72Z" fill="#a6d974" stroke="#4f8a2c" stroke-width=".6"/><path d="M76 154c-10 8-15 20-15 36" stroke="#5b7f2a" stroke-width="2" fill="none"/>${[0,1,2].map(r=>[0,1,2,3].map(c=>`<path d="M${66-c*4-r*2} ${162+r*8+c}c-6 1-9 5-8 10" stroke="${r===1?'#c8d24a':'#a7c23e'}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`).join('')).join('')}<path d="M61 190c-6 5-7 15 0 22 7-7 6-17 0-22Z" fill="#7a1f3d" stroke="#4d0f24" stroke-width=".6"/></svg>`,
  elephant:()=>`<svg viewBox="0 0 230 175"><g class="parasol"><path d="M104 36V8" stroke="#7a4a1c" stroke-width="2"/><path d="M76 20a28 15 0 0 1 56 0Z" fill="#c8102e"/><path d="M76 20a28 15 0 0 1 56 0" fill="none" stroke="#f1d48a" stroke-width="2"/><path d="M84 12a20 9 0 0 1 40 0" fill="none" stroke="#0e7a52" stroke-width="3"/>${[78,86,94,102,110,118,126].map(x=>`<path d="M${x} 20v6" stroke="#f6c84b" stroke-width="1.8"/>`).join('')}<circle cx="104" cy="6" r="3.2" fill="url(#gp)"/></g>
<path d="M90 100h19v56c0 4-3 6-9.5 6S90 160 90 156Z" fill="#555a63"/><path d="M158 100h19v56c0 4-3 6-9.5 6s-9.5-2-9.5-6Z" fill="#555a63"/>
<path d="M38 72c-4 14-5 28-1 42" stroke="#5d626b" stroke-width="3" fill="none"/><path d="M33 112l4 11 5-10Z" fill="#3f434b"/>
<path d="M40 100C30 70 46 40 88 34c32-4 58 0 74 10l8 58c-16 12-104 14-130-2Z" fill="url(#ele)"/>
<path d="M58 100h22v56c0 4-4 6-11 6s-11-2-11-6Z" fill="url(#ele)"/><path d="M138 100h22v56c0 4-4 6-11 6s-11-2-11-6Z" fill="url(#ele)"/>
<g fill="#e0bb68"><rect x="58" y="142" width="22" height="4" rx="1"/><rect x="138" y="142" width="22" height="4" rx="1"/></g><g fill="#f4efe4">${[61,67,73,141,147,153].map(x=>`<path d="M${x} 162a3 3 0 0 1 6 0Z"/>`).join('')}</g>
<path d="M68 40c26-9 62-9 88 4l6 50c-32 10-66 10-96 2Z" fill="url(#jhool)" stroke="#e0bb68" stroke-width="3"/><path d="M76 52c24-6 54-6 76 2l4 32c-28 7-56 7-82 1Z" fill="#0e7a52" stroke="#e0bb68" stroke-width="1.5"/><circle cx="114" cy="68" r="10" fill="url(#gp)" stroke="#8a6420"/><circle cx="114" cy="68" r="4" fill="#c8102e"/>
<path d="M70 96c30 8 62 8 92-2" stroke="#f6dc95" stroke-width="2.4" stroke-dasharray=".1 5" stroke-linecap="round" fill="none"/>${[72,80,88,96,104,112,120,128,136,144,152,160].map((x,i)=>`<path d="M${x} ${97+Math.sin(i/11*Math.PI)*3}v7" stroke="#f1c94a" stroke-width="1.6"/>`).join('')}
<path d="M152 42c8-16 38-20 52-4 10 12 10 34 2 50l-10 14c-14 0-34-6-44-18Z" fill="url(#ele)"/>
<path class="ear" d="M160 46c-16 2-24 26-16 48 4 8 14 10 20 4 6-10 6-34-4-52Z" fill="#5f646d" stroke="#4a4e56"/>
<path class="trunk" d="M201 86c12 2 20-12 18-28-1-9-8-11-10-5" stroke="#6a707a" stroke-width="12" stroke-linecap="round" fill="none"/>
<path d="M196 96c8 5 18 4 23-3" stroke="#fffaf0" stroke-width="4" stroke-linecap="round" fill="none"/>
<path d="M196 28c8-4 14 0 14 8 0 18-4 34-10 50-5-16-6-36-4-58Z" fill="url(#gp)" stroke="#8a6420"/><g fill="#fff3c4">${[[201,40],[203,50],[202,60],[200,70],[205,44],[206,56]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6"/>`).join('')}</g><circle cx="202" cy="33" r="2.6" fill="#c8102e"/>
<path d="M181 56c2-2 6-2 8 0" stroke="#2a2a2a" stroke-width="1.6" fill="none"/><circle cx="185" cy="58" r="1.6" fill="#1a1a1a"/></svg>`,
  kalash:()=>`<svg viewBox="0 0 100 130">${[-162,-130,-98,-66,-32].map(a=>`<path transform="translate(50 56) rotate(${a})" d="M0 0C10-7 26-7 38 0 26 7 10 7 0 0Z" fill="url(#lf)" stroke="#2d6420" stroke-width=".6"/>`).join('')}<ellipse cx="50" cy="40" rx="13" ry="15" fill="url(#coco)"/><path d="M44 27c2-6 10-6 12 0" stroke="#7a4a1c" stroke-width="2" fill="none"/><circle cx="50" cy="43" r="2.6" fill="#c8102e"/><path d="M35 56h30l-3 10H38Z" fill="url(#brass)"/><ellipse cx="50" cy="56" rx="17" ry="4" fill="url(#brass)" stroke="#8a6420" stroke-width=".8"/><path d="M39 66C14 74 14 112 38 122h24c24-10 24-48-1-56Z" fill="url(#brass)" stroke="#8a6420"/><ellipse cx="34" cy="90" rx="5" ry="13" fill="#fff" opacity=".35"/><path d="M23 84c17 6 37 6 54 0" stroke="#c8102e" stroke-width="3" fill="none"/><path d="M21 98c19 6 39 6 58 0" stroke="#f2c14e" stroke-width="2.5" fill="none"/><g fill="#c8102e">${[34,50,66].map(x=>`<circle cx="${x}" cy="110" r="2.4"/>`).join('')}</g><ellipse cx="50" cy="123" rx="20" ry="4" fill="#7a5524"/></svg>`,
  parrot:()=>`<svg viewBox="0 0 60 80"><path d="M34 44c4 12 10 24 20 34-8-4-16-12-22-24Z" fill="#1f7a3a"/><path d="M36 44c6 10 14 18 22 22-10-2-18-8-24-18Z" fill="#2a9bd0"/><path d="M20 30c-4-12 6-22 16-18 10 4 10 22 4 32-6 6-16 2-20-14Z" fill="url(#prt)"/><path d="M30 24c8 2 12 12 8 22-6-4-10-12-8-22Z" fill="#2f8f3a" stroke="#1f6a2a" stroke-width=".6"/><circle cx="24" cy="16" r="9" fill="#74d64c"/><path d="M29 23c-4 4-10 4-13 1" stroke="#e8577a" stroke-width="1.6" fill="none"/><path d="M16 12c-6 1-8 8-4 11 1-3 3-4 6-4Z" fill="#e0302c"/><circle cx="23" cy="13" r="2.4" fill="#fff"/><circle cx="22.6" cy="13" r="1.2" fill="#111"/><path d="M26 44l-2 6M32 44v6" stroke="#8a8f99" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  curtain:()=>`<svg viewBox="0 0 130 330"><path d="M0 0H130C112 40 84 86 50 124c-8 8-6 18 0 26C34 200 18 262 0 330Z" fill="url(#silk)"/>${[18,38,58,78,98].map((x,i)=>`<path d="M${x} 0C${x-8} 50 ${32+i*3} 100 ${42+i*1.5} 132" stroke="#fff" stroke-opacity=".13" stroke-width="5" fill="none"/>`).join('')}${[6,16,26,36].map(x=>`<path d="M44 152C${x+16} 220 ${x+4} 280 ${x-6} 330" stroke="#fff" stroke-opacity=".12" stroke-width="4" fill="none"/>`).join('')}<path d="M130 0C112 40 84 86 50 124c-8 8-6 18 0 26C34 200 18 262 0 330" fill="none" stroke="#e0bb68" stroke-width="7"/><path d="M125 3C107 42 79 88 45 126c-7 8-5 17 0 24C29 200 13 262-4 326" fill="none" stroke="#0e7a52" stroke-width="2" stroke-dasharray="4 3"/><path d="M0 0h130v9H0Z" fill="url(#gp)"/><g transform="translate(48 138)"><path d="M-3 4c-3 12-2 26 3 34 5-8 6-22 3-34Z" fill="url(#gp)" stroke="#8a6420" stroke-width=".6"/><ellipse rx="11" ry="6.5" fill="url(#gp)" stroke="#8a6420"/><circle cy="40" r="3" fill="#c8102e"/></g></svg>`,
  bells:()=>{let s='<svg viewBox="0 0 60 130">';[[10,58],[30,92],[50,40]].forEach(([x,l],i)=>{s+=`<g class="swing" style="animation-delay:${-i*.7}s"><path d="M${x} 0V${l}" stroke="#8a6420" stroke-width=".9"/>${[...Array(Math.floor(l/12))].map((_,j)=>j%2?rose(x,6+j*12,2.6):jas(x,6+j*12)).join('')}<g transform="translate(${x} ${l}) scale(1.6) translate(${-x} ${-l})">${bell(x,l)}</g></g>`});return s+'</svg>'},
  feather:()=>{let s='<svg viewBox="0 0 44 170"><path d="M22 170C20 120 22 70 22 14" stroke="#c9b07a" stroke-width="1.6" fill="none"/>';for(let y=34;y<160;y+=3.5){const k=Math.max(.25,1-(y-34)/150);s+=`<path d="M22 ${y}l${P(-16*k)} ${P(-11*k)}M22 ${y}l${P(16*k)} ${P(-11*k)}" stroke="${y%7<3.5?'#2e9a5e':'#1f7f8a'}" stroke-width=".9" opacity=".85"/>`}return s+'<ellipse cx="22" cy="28" rx="14" ry="19" fill="#1f8a5a"/><ellipse cx="22" cy="29" rx="10.5" ry="14" fill="#d4ad3a"/><ellipse cx="22" cy="30" rx="8" ry="10.5" fill="#17a3a8"/><ellipse cx="22" cy="31" rx="5.5" ry="7.5" fill="#1b3fa0"/><ellipse cx="22" cy="32" rx="3" ry="4.2" fill="#0b1a4a"/></svg>'},
  pond:()=>{const lotus=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})">${[-64,-32,0,32,64].map(a=>`<path transform="rotate(${a})" d="M0 0C-6-8-6-20 0-28 6-20 6-8 0 0Z" fill="#f7b3cc" stroke="#d45a8a" stroke-width=".8"/>`).join('')}${[-28,0,28].map(a=>`<path transform="rotate(${a})" d="M0 0C-5-6-5-16 0-22 5-16 5-6 0 0Z" fill="#ec6f9e" stroke="#c43c74" stroke-width=".8"/>`).join('')}<ellipse cy="-1" rx="6" ry="2.4" fill="#f2c14e"/></g>`,pad=(x,y,r)=>`<path d="M${x} ${y}m${r} 0a${r} ${P(r*.36)} 0 1 1-${r} ${P(-r*.36)}L${x} ${y}Z" fill="#3f9a4a" stroke="#256b2e"/>`;
    return`<svg viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 34Q200 18 400 34V120H0Z" fill="url(#water)"/><g class="ripples" stroke="#d8f6f4" stroke-opacity=".5" stroke-width="1.2" fill="none">${[52,68,84,100].map((y,i)=>`<path d="M${10+i*30} ${y}q20-5 40 0t40 0M${220-i*22} ${y+6}q20-5 40 0t40 0"/>`).join('')}</g>${pad(70,74,16)}${pad(150,96,13)}${pad(250,70,15)}${pad(330,94,17)}${pad(205,104,11)}${lotus(92,70,.9)}${lotus(268,66,1)}${lotus(176,92,.75)}${lotus(350,90,.8)}<g fill="#f08a1c">${[[40,60],[120,58],[220,86],[300,52],[380,70]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="1.6"/>`).join('')}</g><path d="M0 34Q200 18 400 34" stroke="#f1d48a" stroke-width="3" fill="none"/></svg>`}
};
$$('[data-deco]').forEach(el=>{el.innerHTML=DECO[el.dataset.deco]()});

/* ----- Envelope open / replay ----- */
const page=$('#page'),env=$('#envelope');let opened=false,paused=reduce;
document.addEventListener('hx:motion',e=>{paused=reduce||Boolean(e.detail);});
page.inert=true;
history.scrollRestoration='manual';scrollTo(0,0);
/* ----- Envelope ----- */
function open(){if(opened)return;opened=true;body.classList.add('opened');if(reduce)root.classList.remove('locked');page.inert=false;env.inert=true;if(shower)shower();onOpened()}
$('#open').onclick=open;
$('#hero-date').onclick=()=>openSheet(muhurtham);

/* ----- Photo slideshow: advances every 3 s while on screen; swipe or tap the dots ----- */
{const track=$('#track'),dots=$('#car-dots'),car=$('#carousel'),first=track.firstElementChild;
 (WEDDING.photos||[]).forEach(s=>{const d=document.createElement('div'),im=document.createElement('img');d.className='slide';im.dataset.src=s;im.alt='Hemanth and Alekya';im.decoding='async';d.appendChild(im);track.appendChild(d)});
 const n=track.children.length;track.appendChild(first.cloneNode(true));
 const slides=[...track.children];let i=0,timer=null,inView=false,sx=null;
 const load=k=>{const im=slides[Math.min(k,n)].querySelector('img');if(im.dataset.src&&!im.getAttribute('src'))im.src=im.dataset.src};
 dots.innerHTML=Array.from({length:n},(_,k)=>`<button type="button" aria-label="Photo ${k+1} of ${n}"><i></i></button>`).join('');
 const mark=()=>{slides.forEach((s,j)=>{const active=j===i;if(!active&&s.classList.contains('on')){clearTimeout(s.crossfadeTimer);s.classList.add('previous');s.crossfadeTimer=setTimeout(()=>s.classList.remove('previous'),1450)}s.classList.toggle('on',active);if(active){clearTimeout(s.crossfadeTimer);s.classList.remove('previous')}});[...dots.children].forEach((b,j)=>b.setAttribute('aria-current',String(j===i%n)));load(i+1);load(i+2)};
 const go=(k,anim=true)=>{const target=((k%n)+n)%n,changed=target!==i;i=target;track.style.transition='none';track.style.transform='none';slides[i].style.setProperty('--zoom-delay',anim&&changed?'1.3s':'0s');mark();const photo=slides[i].querySelector('img');photo.style.animation='none';void photo.offsetWidth;photo.style.animation=''};
 track.addEventListener('transitionend',e=>{if(e.target===track&&i===n)go(0,false)});
 const next=()=>go(i+1),prev=()=>go(i-1);
 const stop=()=>{clearTimeout(timer);timer=null},start=(delay=3000)=>{stop();if(reduce||paused||!inView||n<2||document.hidden||!$('#lightbox').hidden)return;const advance=()=>{timer=null;if(reduce||paused||!inView||n<2||document.hidden||!$('#lightbox').hidden)return;next();timer=setTimeout(advance,4300)};timer=setTimeout(advance,delay)};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else{go(i,false);start()}});
 dots.addEventListener('click',e=>{const b=e.target.closest('button');if(b){const target=[...dots.children].indexOf(b),changed=target!==i;go(target);start(changed?4300:3000)}});
 car.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;stop()},{passive:true});
 car.addEventListener('touchend',e=>{let changed=false;if(sx!==null){const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){(dx<0?next:prev)();swiped=Date.now();changed=true}sx=null}start(changed?4300:3000)},{passive:true});
 new IntersectionObserver(es=>es.forEach(e=>{inView=e.isIntersecting;if(inView){go(i,false);start()}else stop()}),{threshold:.3}).observe(car);
 go(0,false);

 /* Full-screen viewer: tap a photo to open; swipe, arrows or keys to move; tap outside, X or Esc to close */
 const lb=$('#lightbox'),stage=$('#lb-stage');let li=0,lbOpen=false,lbY=0,lsx=null,lbSwiped=0,swiped=0;
 const srcOf=k=>{const im=slides[k].querySelector('img');return im.getAttribute('src')||im.dataset.src};
 function lbShow(k,dir){const old=stage.querySelector('img.cur');li=(k+n)%n;const im=new Image();im.src=srcOf(li);im.alt=`Hemanth and Alekya, photo ${li+1} of ${n}`;im.className='cur '+(dir?'in-'+dir:'in-open');stage.appendChild(im);
   if(old){old.className='out-'+dir;setTimeout(()=>old.remove(),1000)}
   $('#lb-count').textContent=`${li+1} / ${n}`;[li+1,li-1].forEach(j=>{new Image().src=srcOf((j+n)%n)})}
 function lbOpenAt(k){stop();lbOpen=true;lbY=scrollY;stage.innerHTML='';lb.hidden=false;void lb.offsetWidth;lb.classList.add('show');root.classList.add('locked');lbShow(k);$('#lb-close').focus({preventScroll:true})}
 function lbClose(){if(!lbOpen)return;lbOpen=false;lb.classList.remove('show');setTimeout(()=>{if(!lbOpen){lb.hidden=true;stage.innerHTML=''}},500);if(opened&&$('#admin').hidden){root.classList.remove('locked');scrollTo({top:lbY,behavior:'instant'})}const changed=li!==i;go(li);start(changed?4300:3000)}
 car.addEventListener('click',()=>{if(Date.now()-swiped>500)lbOpenAt(i%n)});
 lb.addEventListener('click',e=>{if(Date.now()-lbSwiped<500)return;if(e.target.closest('#lb-close'))return lbClose();if(e.target.closest('.lb-nav.next'))return lbShow(li+1,'next');if(e.target.closest('.lb-nav.prev'))return lbShow(li-1,'prev');if(!e.target.closest('img'))lbClose()});
 lb.addEventListener('touchstart',e=>{lsx=e.touches[0].clientX},{passive:true});
 lb.addEventListener('touchend',e=>{if(lsx===null)return;const dx=e.changedTouches[0].clientX-lsx;lsx=null;if(Math.abs(dx)>40){lbSwiped=Date.now();lbShow(li+(dx<0?1:-1),dx<0?'next':'prev')}},{passive:true});
 document.addEventListener('keydown',e=>{if(!lbOpen)return;if(e.key==='Escape')lbClose();if(e.key==='ArrowRight')lbShow(li+1,'next');if(e.key==='ArrowLeft')lbShow(li-1,'prev')})}
/* ----- Contact buttons (message templates include the guest's name once they've typed it) ----- */
const svgI=d=>`<svg viewBox="0 0 20 20" aria-hidden="true">${d}</svg>`;
const waSvg=svgI('<path d="M4 16.5 5 13a6.6 6.6 0 1 1 2.4 2.4Z"/><path d="M8 7.5c0 2.4 2 4.5 4.5 4.5l.8-1.2-1.6-.8-.7.6c-.8-.3-1.5-1-1.8-1.8l.6-.7-.8-1.6Z"/>'),phoneSvg=svgI('<path d="M5 3h3l1.4 3.6-1.8 1.2a9 9 0 0 0 4.6 4.6l1.2-1.8L17 12v3a2 2 0 0 1-2 2A12 12 0 0 1 3 5a2 2 0 0 1 2-2Z"/>'),mailSvg=svgI('<rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="m3 6 7 5 7-5"/>');
{const C=WEDDING.contacts,e=encodeURIComponent,apple=/iP(hone|ad|od)|Macintosh/.test(navigator.userAgent);
 const imsgSvg=svgI('<path d="M10 3.5c4.4 0 8 2.7 8 6s-3.6 6-8 6c-.9 0-1.8-.1-2.6-.3L4 16.5l1-3C3.2 12.4 2 11 2 9.5c0-3.3 3.6-6 8-6Z"/>');
 const who=()=>{const f=$('#rsvp-form'),n=[f.firstName.value,f.lastName.value].map(s=>s.trim()).filter(Boolean).join(' ');return n||(rs.last?`${rs.last.firstName} ${rs.last.lastName}`:'')};
 const tone=p=>`--c1:${p.c1};--c2:${p.c2}`;
 $('#people').innerHTML=C.map((p,i)=>`<button type="button" class="person" style="${tone(p)}" data-i="${i}" aria-haspopup="dialog"><span class="medal" aria-hidden="true">${esc(p.name[0])}</span><b>${esc(p.name)}</b><small>${esc(p.role)}</small><span class="te" lang="te">${esc(p.te)}</span></button>`).join('');
 function openPerson(p){const n=who(),hi=`Namaste ${p.name}! ${n?`This is ${n}. `:''}I have a question about the wedding: `;
   const groom=p.name==='Hemanth',phones=p.phones||[],usa=phones.find(ph=>ph.tag==='USA'||/^\+1/.test(ph.n))||phones[0],india=phones.find(ph=>ph.tag==='India'||/^\+91/.test(ph.n))||phones[0];
   const head=`<div class="ct-head ceremonial-head" style="${tone(p)}"><span class="medal lg" aria-hidden="true">${esc(p.name[0])}</span><p class="eyebrow">${esc(p.relation)}</p><h3 id="ct-name">${esc(p.name)}</h3><p class="te" lang="te">${esc(p.te)}</p></div>`;
   const routes=groom?`<div class="ct-routes" aria-label="Contact Hemanth"><a class="btn wa" href="https://wa.me/${india.n.replace(/\D/g,'')}?text=${e(hi)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Hemanth on his Indian number">${waSvg}<span>WhatsApp</span></a><a class="btn call" href="tel:${esc(usa.n)}" aria-label="Call Hemanth on his USA number">${phoneSvg}<span>Call</span></a><a class="btn imsg" href="sms:bommenahemanth@gmail.com" aria-label="iMessage Hemanth">${imsgSvg}<span>iMessage</span></a></div>`:
     phones.map(ph=>`<div class="ct-num"><div class="ct-line"><a href="tel:${ph.n}">${esc(ph.label)}</a>${ph.tag?`<span class="tag">${esc(ph.tag)}</span>`:''}</div><div class="ct-acts"><a class="btn wa" href="https://wa.me/${ph.n.replace(/\D/g,'')}?text=${e(hi)}" target="_blank" rel="noopener noreferrer">${waSvg}<span>WhatsApp</span></a><a class="btn call" href="tel:${ph.n}">${phoneSvg}<span>Call</span></a>${ph.sms===false?'':`<a class="btn imsg" href="sms:${ph.n}?&body=${e(hi)}">${imsgSvg}<span>${apple?'iMessage':'Text'}</span></a>`}</div></div>`).join('')+
     (p.email?`<a class="btn mail" href="mailto:${p.email}?subject=${e('Question about Hemanth & Alekya’s wedding')}&body=${e(`Hi ${p.name},\n\n\n\nThanks${n?`,\n${n}`:''}`)}">${mailSvg}<span>Email</span></a>`:'');
   $('#ct-body').innerHTML=head+routes;
   $('#contact').classList.toggle('groom-contact',groom);
   $('#contact').showModal()}
 $('#people').addEventListener('click',ev=>{const b=ev.target.closest('.person');if(b)openPerson(C[+b.dataset.i])});
 $('#contact').addEventListener('click',ev=>{const d=ev.currentTarget,r=d.getBoundingClientRect();if(ev.target===d&&(ev.clientY<r.top||ev.clientY>r.bottom||ev.clientX<r.left||ev.clientX>r.right))d.close()})}

/* ----- Background music (nadaswaram; starts with the envelope tap, which counts as a user gesture) ----- */
const bgm=$('#bgm'),musicBtn=$('#music'),musicCredit=WEDDING.music?WEDDING.music.credit:'';let musicOn=false,fadeT;
if(WEDDING.music&&WEDDING.music.src)bgm.src=WEDDING.music.src;else musicBtn.hidden=true;
function musicUi(){musicBtn.setAttribute('aria-pressed',String(musicOn));musicBtn.setAttribute('aria-label',musicOn?'Mute music':'Play music');musicBtn.title=`${musicOn?'Mute':'Play'} music · ${musicCredit}`;$('#music-icon').setAttribute('d',musicOn?'M13 7.5a3.5 3.5 0 0 1 0 5M15.5 5a7 7 0 0 1 0 10':'M13 8l4 4M17 8l-4 4')}
function fadeTo(target){clearInterval(fadeT);fadeT=setInterval(()=>{try{const v=bgm.volume;bgm.volume=v<target?Math.min(target,v+.04):Math.max(target,v-.04)}catch{}if(Math.abs(bgm.volume-target)<.001)clearInterval(fadeT)},120)}
function setMusic(on,target=.6){musicOn=on;clearInterval(fadeT);if(on){try{bgm.volume=0}catch{}const p=bgm.play();if(p&&p.catch)p.catch(()=>{musicOn=false;musicUi()});fadeTo(target)}else bgm.pause();musicUi()}
// The envelope opening plays the music softly, then swells it as the flaps open.
document.addEventListener('hx:opening-swell',()=>{if(musicOn)fadeTo(.6)});
musicBtn.onclick=()=>setMusic(!musicOn);
document.addEventListener('visibilitychange',()=>{if(document.hidden)bgm.pause();else if(musicOn)bgm.play().catch(()=>{})});

/* ----- API ----- */
async function api(payload,retry=1){
  if(!WEDDING.apiUrl){const e=new Error('not_configured');e.code='not_configured';throw e}
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),25000);
  try{const r=await fetch(WEDDING.apiUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:ctl.signal,redirect:'follow'});return await r.json()}
  catch(err){if(retry>0)return api(payload,retry-1);const e=new Error('network');e.code='network';throw e}
  finally{clearTimeout(t)}
}
const store={get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}},del(k){try{localStorage.removeItem(k)}catch{}}};

function onOpened(){
  try{localStorage.removeItem('hx-music')}catch{}
  if(!musicBtn.hidden){
    setMusic(true,reduce||body.classList.contains('opening-complete')?.6:.2);
    // Some phones refuse the first play(); start on the guest's next tap instead.
    document.addEventListener('pointerdown',e=>{if(!musicOn&&!e.target.closest('#music'))setMusic(true)},{once:true});
  }
  $('#fab').classList.add('show');
  VISIT.sections.add('opened');
  if(!VISIT.openAfter){VISIT.openAfter=Math.round((Date.now()-VISIT.t0)/1000);track('envelope_open')}
}

/* ----- Visit analytics: no cookies and nothing stored on the device beyond this browser tab's session.
   One record per tab session; the backend keeps only a salted hash of the IP and coarse place (city/state/country). ----- */
const VISIT={id:'',t0:Date.now(),sections:new Set(),actions:{},scroll:0,rsvp:'',openAfter:0};
// Every tap or milestone goes to both our own analytics and Microsoft Clarity (when Clarity is loaded on the live site).
const cl=(...a)=>{try{if(window.clarity)window.clarity(...a)}catch{}};
function track(k){if(!/^[a-z][a-z0-9_]{1,30}$/.test(k))return;VISIT.actions[k]=(VISIT.actions[k]||0)+1;cl('event',k)}
function uaInfo(){const ua=navigator.userAgent,touchMac=/Macintosh/.test(ua)&&navigator.maxTouchPoints>1;
  const os=/iPhone|iPad|iPod/.test(ua)||touchMac?'iOS':/Android/.test(ua)?'Android':/Windows/.test(ua)?'Windows':/CrOS/.test(ua)?'ChromeOS':/Mac OS X/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Other';
  const device=/iPad|Tablet/.test(ua)||touchMac||(/Android/.test(ua)&&!/Mobile/.test(ua))?'Tablet':/Mobi|iPhone|iPod|Android/.test(ua)?'Phone':'Computer';
  const app=/Instagram/.test(ua)?'Instagram':/FBAN|FBAV|FB_IAB/.test(ua)?'Facebook':/WhatsApp/i.test(ua)?'WhatsApp':/Snapchat/.test(ua)?'Snapchat':/LinkedInApp/.test(ua)?'LinkedIn':/GSA\//.test(ua)?'Google app':'';
  const browser=/Edg\//.test(ua)?'Edge':/OPR\/|Opera/.test(ua)?'Opera':/SamsungBrowser/.test(ua)?'Samsung Internet':/Firefox|FxiOS/.test(ua)?'Firefox':/CriOS|Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'Other';
  return{device,os,browser,app}}
async function visitGeo(){
  const get=async u=>{const c=new AbortController(),k=setTimeout(()=>c.abort(),3500);try{const r=await fetch(u,{signal:c.signal,cache:'no-store'});return r.ok?await r.json():null}catch{return null}finally{clearTimeout(k)}};
  const g=await get('https://get.geojs.io/v1/ip/geo.json');if(g&&g.ip)return{ip:g.ip,city:g.city||'',region:g.region||'',country:g.country||'',cc:g.country_code||''};
  const a=await get('https://ipapi.co/json/');if(a&&a.ip&&!a.error)return{ip:a.ip,city:a.city||'',region:a.region||'',country:a.country_name||'',cc:a.country_code||''};
  const i=await get('https://api.ipify.org?format=json');return{ip:(i&&i.ip)||'',city:'',region:'',country:'',cc:''}}
function startVisit(){
  const p=new URLSearchParams(location.search),src=(p.get('src')||p.get('utm_source')||'').toLowerCase();
  // Drop the tag from the address bar so a copied link isn't credited to the QR code or share button again.
  if(src)try{p.delete('src');p.delete('utm_source');history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:'')+location.hash)}catch{}
  if(!WEDDING.apiUrl)return;
  try{VISIT.id=sessionStorage.getItem('hx-visit')||'';if(VISIT.id)return;VISIT.id=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);sessionStorage.setItem('hx-visit',VISIT.id)}catch{return}
  let ref='';try{ref=document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):''}catch{}
  const base={action:'visit',visitId:VISIT.id,tz:Intl.DateTimeFormat().resolvedOptions().timeZone||'',lang:navigator.language||'',screen:`${screen.width}x${screen.height}`,viewport:`${innerWidth}x${innerHeight}`,
    net:(navigator.connection&&navigator.connection.effectiveType)||'',theme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light',src,ref:ref===location.hostname?'':ref,...uaInfo()};
  ['device','os','browser','app'].forEach(k=>{if(base[k])cl('set',k,base[k])});cl('set','source',src||ref||'direct');
  visitGeo().then(g=>{if(g.country)cl('set','country',g.country);if(g.region)cl('set','state',g.region);return api(Object.assign(base,g),0)}).catch(()=>{})}
function endVisit(){
  if(!VISIT.id||!WEDDING.apiUrl||!navigator.sendBeacon)return;
  const nav=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0],loadMs=nav&&nav.loadEventEnd>0?Math.round(nav.loadEventEnd):0;
  const body=JSON.stringify({action:'visitEnd',visitId:VISIT.id,duration:Math.round((Date.now()-VISIT.t0)/1000),scroll:VISIT.scroll,sections:[...VISIT.sections],actions:VISIT.actions,rsvp:VISIT.rsvp,loadMs,openAfter:VISIT.openAfter});
  try{navigator.sendBeacon(WEDDING.apiUrl,new Blob([body],{type:'text/plain;charset=utf-8'}))}catch{}}
startVisit();
addEventListener('pagehide',endVisit);
document.addEventListener('visibilitychange',()=>{if(document.hidden)endVisit()});
addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;if(h>0)VISIT.scroll=Math.max(VISIT.scroll,Math.min(100,Math.round(scrollY/h*100)));[25,50,75,100].forEach(m=>{if(VISIT.scroll>=m&&!VISIT.actions['scroll_'+m])track('scroll_'+m)})},{passive:true});
[['events','section.events'],['rsvp','#rsvp'],['photos','#photos']].forEach(([k,sel])=>{const el=$(sel);if(el)new IntersectionObserver((es,io)=>{if(es.some(e=>e.isIntersecting)){VISIT.sections.add(k);track('saw_'+k);io.disconnect()}},{threshold:.25}).observe(el)});
// First match wins, so specific selectors come before general ones.
const CLICKS=[['.ux-qr-btn','qr'],['.ux-share','share'],['#music',()=>musicOn?'music_off':'music_on'],
  ['[data-act=apple],#cal-ics','calendar_apple'],['[data-act=google],#cal-google','calendar_google'],['.g-all [data-g]','calendar_google_all'],['[data-g]','calendar_google_one'],['.date-btn','event_calendar'],
  ['#venue-link,a[href*="maps"],a[href^="geo:"]','map'],['.find-wa a','find_whatsapp'],['a[href*="wa.me"]','whatsapp'],['a[href^="tel:"]','call'],['a[href^="sms:"]','text'],['a[href^="mailto:"]','email'],
  ['.person',el=>'contact_'+((el.querySelector('b')||{}).textContent||'').toLowerCase().replace(/[^a-z]/g,'')],
  ['#find-open,#find-top-open','find_open'],['#fab','rsvp_button'],['[data-act=withdraw]','rsvp_withdraw'],['[data-act=edit]','rsvp_edit'],
  ['.lb-nav','photo_next'],['.car-dots button','photo_dot'],['#carousel','photo_open'],
  ['.tl-item',el=>{const h=el.querySelector('h3[id^="ev-"]');return h?'event_'+h.id.slice(3):''}]];
document.addEventListener('click',e=>{for(const[sel,k]of CLICKS){const el=e.target.closest(sel);if(el){const key=typeof k==='function'?k(el):k;if(key)track(key);break}}},{capture:true,passive:true});
document.addEventListener('hx:rsvp',e=>{const st=(e.detail&&e.detail.status)||'sent';VISIT.rsvp=st;track('rsvp_sent');cl('set','rsvp',st);cl('upgrade','rsvp sent');endVisit()});
document.addEventListener('input',e=>{if(!VISIT.rsvp&&e.target.closest('#rsvp-form')){VISIT.rsvp='started';track('rsvp_start')}},{passive:true});
document.addEventListener('change',e=>{const t=e.target;if(t.name==='status'&&t.checked&&t.closest('#rsvp-form'))track('rsvp_'+t.value)},{passive:true});
document.addEventListener('click',e=>{if(e.target.closest('#rsvp-submit'))setTimeout(()=>{if($('#rsvp-form .invalid'))track('rsvp_error')},60)},{passive:true});
try{localStorage.removeItem('hx-vid')}catch{}

/* ----- RSVP form ----- */
const RDAYS=(()=>{const out=[],s=Date.UTC(WEDDING.year,first.m-1,first.d),end=Date.UTC(WEDDING.year,muhurtham.m-1,muhurtham.d)+864e5;for(let t=s;t<=end;t+=864e5){const d=new Date(t);out.push({key:d.toISOString().slice(0,10),day:DAY[d.getUTCDay()].slice(0,3),label:`${d.getUTCDate()} ${MON[d.getUTCMonth()].slice(0,3)}`})}out[out.length-1].morning=true;return out})();
const dayText=i=>`${RDAYS[i].day} ${RDAYS[i].label}${RDAYS[i].morning?' (morning)':''}`;
const evDay=e=>RDAYS.findIndex(d=>d.key===`${WEDDING.year}-${pad(e.m)}-${pad(e.d)}`);
// Nothing is remembered between visits: a returning guest finds their RSVP by WhatsApp number.
const form=$('#rsvp-form'),F=form.elements,rs={plus:[],kids:0,mode:'new',saved:null,last:null};
const radioVal=(f,n)=>{const c=f.querySelector(`input[name="${n}"]:checked`);return c?c.value:''};
const setRadio=(f,n,v)=>f.querySelectorAll(`input[name="${n}"]`).forEach(i=>{i.checked=i.value===v;i.dataset.on=i.checked?'1':''});
document.addEventListener('click',e=>{const i=e.target.closest('[data-clearable] input[type=radio]');if(!i)return;if(i.dataset.on==='1'){i.checked=false;i.dataset.on='';i.dispatchEvent(new Event('change',{bubbles:true}))}else{i.closest('form').querySelectorAll(`input[name="${i.name}"]`).forEach(x=>x.dataset.on='');i.dataset.on='1'}});
$('#ticks').innerHTML=RDAYS.map((d,i)=>`<span style="left:${i*20}%"><b>${esc(d.label.split(' ')[0])}</b>${esc(d.label.split(' ')[1])}${d.morning?'<br>am':''}</span>`).join('');
const inRange=(a,b)=>WEDDING.events.filter(e=>{const i=evDay(e);return i>=a&&i<=b});
function syncRange(){
  let a=+F.arrival.value,b=+F.departure.value;
  if(a>=b){if(document.activeElement===F.departure)b=Math.min(5,a+1),a=b-1;else a=Math.max(0,b-1)}
  F.arrival.value=a;F.departure.value=b;$('#range').style.setProperty('--a',a);$('#range').style.setProperty('--b',b);F.arrival.style.zIndex=a>=4?3:1;
  const nights=b-a;$('#range-out').textContent=`${dayText(a)} → ${dayText(b)} · ${nights} night${nights>1?'s':''}`;
  $('#day-tips').textContent=dayTips(a,b);
  const list=$('#ev-list'),html=inRange(a,b).map(e=>`<li><b>${weekday(e).slice(0,3)} ${e.d} ${MON[e.m-1].slice(0,3)}</b><svg class="ev-ic" viewBox="0 0 48 48" aria-hidden="true">${ICONS[e.icon]||''}</svg><div>${esc(e.title)} <span>· ${time12(e.t)}</span></div></li>`).join('');
  if(list.dataset.k!==`${a}-${b}`){list.dataset.k=`${a}-${b}`;list.innerHTML=html}
  partyText()}
function dayTips(a,b){
  if(a===4)return 'The wedding is Thursday 9:47 AM, so please arrive by Wednesday.';
  if(a>=1)return 'Please reach Dallas by Monday 4 PM if you can.';
  if(b<4)return 'The wedding is Thu 3 Dec at 9:47 AM.';
  if(b===5)return 'Checkout Fri 10 AM, so flights after 1 PM work best.';
  return ''}
function setCollapse(el,open){el.classList.toggle('open',open);el.firstElementChild.inert=!open}
F.arrival.addEventListener('input',()=>syncRange());F.departure.addEventListener('input',()=>syncRange());
function poRows(added){$('#po-rows').innerHTML=rs.plus.map((p,i)=>`<div class="po${i===added?' new':''}"><input data-po="${i}" maxlength="50" placeholder="${i?`+1 #${i+1} name`:'+1 name, e.g. spouse'} (optional)" aria-label="+1 number ${i+1} name" value="${esc(p.name)}"><div class="chips" data-clearable>${['male','female'].map(g=>`<label class="chip"><input type="radio" name="po-${i}" value="${g}"${p.gender===g?' checked data-on="1"':''}><span>${g==='male'?'M':'F'}</span></label>`).join('')}</div></div>`).join('');setCollapse($('#po-note'),rs.plus.length>0)}
$('#po-rows').addEventListener('input',e=>{const i=e.target.dataset.po;if(i!==undefined)rs.plus[+i].name=e.target.value});
$('#po-rows').addEventListener('change',e=>{const m=/^po-(\d+)$/.exec(e.target.name||'');if(m)rs.plus[+m[1]].gender=radioVal($('#po-rows'),e.target.name)});
form.querySelectorAll('[data-stepper]').forEach(s=>s.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=+b.dataset.d;
  if(s.dataset.stepper==='plus'){const n=Math.max(0,Math.min(10,rs.plus.length+d));if(n===rs.plus.length)return;while(rs.plus.length<n)rs.plus.push({name:'',gender:''});rs.plus.length=n;poRows(d>0?n-1:-1);if(d>0)setTimeout(()=>{const i=$(`[data-po="${n-1}"]`);if(i)i.focus({preventScroll:true})},60)}else{const k=Math.max(0,Math.min(10,rs.kids+d));if(k===rs.kids)return;rs.kids=k}
  steppers();const o=s.querySelector('output');o.classList.remove('bump');void o.offsetWidth;o.classList.add('bump')}));
function steppers(){$('#plus-out').textContent=rs.plus.length;$('#kids-out').textContent=rs.kids;form.querySelectorAll('[data-stepper]').forEach(s=>{const v=s.dataset.stepper==='plus'?rs.plus.length:rs.kids;s.classList.toggle('has',v>0);s.querySelector('[data-d="-1"]').disabled=v<=0;s.querySelector('[data-d="1"]').disabled=v>=10});partyText()}
// Quick notes the guest can tap, three per situation: their reply, or what they just changed.
const MSGS={
  yes:['Can’t wait to celebrate with you both! 🎉','Congratulations Hemanth & Alekya! See you in Dallas.','So happy for you two. Counting the days!'],
  maybe:['Trying my best to make it, will confirm soon.','Waiting on travel plans, will update once booked.','Hoping to be there! Will let you know soon.'],
  no:['So sorry I can’t make it. Sending love and blessings!','Wish I could be there. Congratulations to you both!','Will miss the celebrations. Best wishes for your new journey!'],
  nowNo:['Sorry Hemanth, change in plans. I won’t be able to make it.','Something came up, so sorry to miss it. Blessings to you both!','Really sad to miss it. Will celebrate with you soon!'],
  nowMaybe:['Plans are a little uncertain now, will confirm soon.','Something came up, I’ll update once I know more.','Still hoping to make it, will confirm soon!'],
  nowYes:['Good news, I can make it after all! 🎉','Plans worked out, see you there!','Confirmed! Can’t wait to celebrate with you.'],
  longer:['Coming earlier to join more of the celebrations!','Extended my trip, see you for more days!','Got more time off, staying longer!'],
  shorter:['My dates changed, so I’ll be there for fewer days.','Had to shorten my trip, sorry to miss some events.','Can only make part of it now, see you soon!'],
  moved:['My travel dates changed. See you soon!','Moved my dates around, still coming!','New travel plans, same excitement!'],
  more:['Bringing a few more people with me!','My family can come too, hope that’s okay!','Our party grew, thank you for having us!'],
  fewer:['Fewer of us can make it now, sorry!','Some of my family can’t come anymore.','Smaller party now, but I’ll be there!'],
  stay:['We’ll need a place to stay, thank you!','Would love to stay at the venue if there’s room.','Please count us in for the stay.'],
  noStay:['We’ve arranged our own stay, thank you!','No room needed for us anymore.','Staying with family nearby, thank you!'],
  edit:['Small change in plans, all updated now.','My dates changed. See you soon!','Will confirm soon.']
};
function msgSituation(){const st=radioVal(form,'status'),o=rs.last;
  if(rs.mode!=='edit'||!o)return MSGS[st]?st:'';
  if(st&&st!==o.status)return st==='no'?'nowNo':st==='maybe'?'nowMaybe':'nowYes';
  if(st==='no')return 'no';
  const oa=RDAYS.findIndex(d=>d.key===o.arrival),od=RDAYS.findIndex(d=>d.key===o.departure),a=+F.arrival.value,b=+F.departure.value;
  if(oa>=0&&od>=0&&(a!==oa||b!==od))return b-a>od-oa?'longer':b-a<od-oa?'shorter':'moved';
  const was=1+(o.plusOnes||[]).length+(+o.kids||0),now=1+rs.plus.length+rs.kids;if(now!==was)return now>was?'more':'fewer';
  if(!!o.accommodation!==F.accommodation.checked)return F.accommodation.checked?'stay':'noStay';
  return 'edit'}
function msgChips(){const k=msgSituation(),box=$('#msg-chips');setCollapse($('#msg-wrap'),!!k);if(box.dataset.k===k)return;box.dataset.k=k;
  box.innerHTML=(MSGS[k]||[]).map(t=>`<button type="button"${F.message.value===t?' class="on"':''}>${esc(t)}</button>`).join('')}
const nameCase=s=>s.toLowerCase().replace(/(^|[\s\-'’.])(\p{L})/gu,(m,p,c)=>p+c.toUpperCase());
form.addEventListener('focusout',e=>{const t=e.target;if(!t.matches('[name=firstName],[name=lastName],[data-po]'))return;
  const v=nameCase(t.value.replace(/\s+/g,' ').trim());if(v!==t.value){t.value=v;if(t.dataset.po!==undefined)rs.plus[+t.dataset.po].name=v}});
function partyText(){const adults=1+rs.plus.length,n=adults+rs.kids;$('#party').textContent=`Your party: ${n} ${n>1?'people':'person'} (${adults} adult${adults>1?'s':''}${rs.kids?`, ${rs.kids} kid${rs.kids>1?'s':''}`:''})`;
  setCollapse($('#stay-wrap'),F.accommodation.checked);if(F.accommodation.checked){const s=Math.max(+F.arrival.value,1),nights=Math.max(0,+F.departure.value-s);$('#stay-hint').textContent=nights?`${nights} night${nights>1?'s':''} from ${dayText(s)} · ${n} ${n>1?'people':'person'}`:'No stay needed for these dates'}msgChips()}
function showGoing(){setCollapse($('#going'),radioVal(form,'status')!=='no');msgChips()}
form.addEventListener('change',e=>{if(e.target.name==='accommodation')partyText();showGoing()});
form.addEventListener('input',e=>{const f=e.target.closest('[data-err]');if(f){f.classList.remove('invalid');const er=f.querySelector('.err');if(er)er.textContent=''}});
const phoneOf=f=>{if(f.cc.value!=='other')return{cc:f.cc.value,number:f.phone.value};const c=f.ccx.value.replace(/\D/g,'');return{cc:c?'+'+c:'',number:f.phone.value}};
function ccSync(f){const o=f.cc.value==='other';f.ccx.hidden=!o;f.cc.parentNode.classList.toggle('oth',o)}
function setCc(f,cc){if(cc==='+1'||cc==='+91'){f.cc.value=cc;f.ccx.value=''}else{f.cc.value='other';f.ccx.value=cc||''}ccSync(f)}
[form,$('#find-form')].forEach(f=>{f.cc.addEventListener('change',()=>{ccSync(f);f.phone.value=phoneDigits(f,true);if(f.cc.value==='other')f.ccx.focus()});f.ccx.addEventListener('input',()=>{const d=f.ccx.value.replace(/\D/g,'').slice(0,4);f.ccx.value=d?'+'+d:''});
  // Digits only, and never more than 10 for USA/India. A pasted "+1 (469) 996-7434" keeps the right 10 digits.
  f.phone.addEventListener('beforeinput',()=>{f.phone.dataset.len=f.phone.value.length});
  f.phone.addEventListener('input',e=>{const bulk=e.inputType!=='insertText'||f.phone.value.length-(+f.phone.dataset.len||0)>1,d=phoneDigits(f,bulk);if(f.phone.value!==d)f.phone.value=d})});
const PHONE_LEN=10;
function phoneDigits(f,pasted){let d=f.phone.value.replace(/\D/g,'');if(f.cc.value==='other')return d.slice(0,14);const cc=f.cc.value.slice(1);if(pasted&&d.length>PHONE_LEN&&d.startsWith(cc))d=d.slice(cc.length);return d.replace(/^0+/,'').slice(0,PHONE_LEN)}
function phoneError(p,keep){const digits=String(p.number).replace(/\D/g,'');if(keep&&!digits)return '';
  if(p.cc==='+1'||p.cc==='+91')return digits.length===PHONE_LEN?'':digits.length?`WhatsApp number needs ${PHONE_LEN} digits. You’ve entered ${digits.length}.`:'Please enter your 10-digit WhatsApp number';
  if(p.cc)return digits.replace(/^0+/,'').length<6||digits.length>14?'Please enter a valid WhatsApp number':'';
  return digits.length<8||digits.length>15?'Add your country code, e.g. +44':''}
function fieldError(k,m){const el=form.querySelector(`[data-err="${k}"]`);if(!el)return;el.classList.toggle('invalid',!!m);const er=el.querySelector('.err');if(er)er.textContent=m||''}
F.phone.addEventListener('blur',()=>{if(F.phone.value)fieldError('phone',phoneError(phoneOf(F),false))});
function collect(){const a=+F.arrival.value,b=+F.departure.value;return{firstName:F.firstName.value.trim(),lastName:F.lastName.value.trim(),gender:radioVal(form,'gender'),phone:phoneOf(F),status:radioVal(form,'status'),arrival:a,departure:b,events:inRange(a,b).map(e=>e.id),plusOnes:rs.plus.map(p=>({name:p.name.trim(),gender:p.gender})),kids:rs.kids,accommodation:F.accommodation.checked,message:F.message.value.trim()}}
function fill(r){
  F.firstName.value=r.firstName||'';F.lastName.value=r.lastName||'';F.message.value=r.message||'';
  const ph=typeof r.phone==='string'?r.phone:'';rs.masked=ph.includes('•');
  if(rs.masked){const cc=ph.startsWith('+91')?'+91':ph.startsWith('+1')?'+1':'';setCc(F,cc);F.phone.value='';F.phone.placeholder=`Keep ${ph.replace(/^\+\d*\s*/,'')}, or type a new one`}
  else if(ph){const cc=ph.startsWith('+91')?'+91':ph.startsWith('+1')?'+1':'';setCc(F,cc);F.phone.value=cc?ph.slice(cc.length):ph}else if(r.phone&&r.phone.number!==undefined){setCc(F,r.phone.cc||'+1');F.phone.value=r.phone.number}
  ['gender','status'].forEach(n=>setRadio(form,n,r[n]||''));
  const ai=typeof r.arrival==='number'?r.arrival:RDAYS.findIndex(d=>d.key===r.arrival),di=typeof r.departure==='number'?r.departure:RDAYS.findIndex(d=>d.key===r.departure);
  F.arrival.value=ai>=0?ai:0;F.departure.value=di>0?di:5;syncRange();
  rs.plus=(r.plusOnes||[]).map(p=>({name:p.name||'',gender:p.gender||''}));rs.kids=+r.kids||0;poRows();steppers();
  F.accommodation.checked=!!r.accommodation;showGoing();partyText()}

function clientErrors(d){const e={};if(!d.firstName)e.firstName='Please enter your first name';if(!d.lastName)e.lastName='Please enter your last name';
  const pe=phoneError(d.phone,rs.mode==='edit'&&rs.masked);if(pe)e.phone=pe;
  if(!d.status)e.status='Please choose one';return e}
const MSG={firstName:'Please enter your first name',lastName:'Please enter your last name',phone:'Please enter a valid WhatsApp number',email:'That email doesn’t look right',status:'Please choose one',events:'Pick at least one event',days:'Please choose your dates',kids:'Please check the number of kids',plusOnes:'Up to 10 plus-ones'};
function showErrors(errs){form.querySelectorAll('[data-err]').forEach(el=>{const k=el.dataset.err,m=errs[k];el.classList.toggle('invalid',!!m);const er=el.querySelector(':scope > .err')||el.querySelector('.err');if(er)er.textContent=m?(typeof m==='string'&&m.length>12?m:MSG[k]||'Please check this'):''});
  const firstBad=form.querySelector('.invalid');if(firstBad){firstBad.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});const inp=firstBad.querySelector('input,select');if(inp)inp.focus({preventScroll:true})}}
const errText=e=>e&&e.code==='not_configured'?'RSVPs open very soon. Please try again later or message us on WhatsApp.':'We couldn’t reach the server. Your answers are still filled in, so please check your connection and try again.';
form.addEventListener('submit',async ev=>{ev.preventDefault();$('#form-error').textContent='';
  const d=collect(),errs=clientErrors(d);showErrors(errs);if(Object.keys(errs).length)return;
  const btn=$('#rsvp-submit'),label=btn.textContent;btn.disabled=true;btn.textContent='Sending…';
  try{
    let r=rs.mode==='edit'&&rs.saved?await api({action:'update',id:rs.saved.id,secret:rs.saved.secret,rsvp:d}):await api({action:'create',rsvp:d});
    if(!r.ok&&r.error==='exists'&&rs.mode!=='edit'){const f=await api({action:'find',phone:d.phone,firstName:d.firstName});
      if(f.ok){rs.saved={id:f.id,secret:f.secret};r=await api({action:'update',id:f.id,secret:f.secret,rsvp:d})}
      else{$('#form-error').textContent='This WhatsApp number already has an RSVP under a different first name. Use “Find my RSVP” below, or message us.';return}}
    if(r.ok){if(r.id)rs.saved={id:r.id,secret:r.secret};showDone(r.rsvp,true);return}
    if(r.error==='invalid'){showErrors(r.fields||{});$('#form-error').textContent='Please check the highlighted fields.';return}
    if(r.error==='not_found'){rs.saved=null;rs.mode='new';$('#form-error').textContent='We couldn’t find your earlier RSVP. Please send it again.';return}
    $('#form-error').textContent=r.error==='rate_limited'?'Too many attempts. Please wait a few minutes and try again.':'Something went wrong. Please try again.'
  }catch(e){$('#form-error').textContent=errText(e)}
  finally{btn.disabled=false;btn.textContent=label}});
function showDone(r,justSent){rs.last=r;rs.mode='view';const done=$('#rsvp-done'),st=r.status,going=st==='yes'||st==='maybe';
  const title={yes:`See you there, ${r.firstName}!`,maybe:`Thank you, ${r.firstName}`,no:`We’ll miss you, ${r.firstName}`,withdrawn:'Your RSVP is withdrawn'}[st];
  const lead={yes:'We can’t wait to celebrate with you.',maybe:'Please confirm when you can. You can update this any time.',no:'Thank you for letting us know. Your blessings mean the world to us.',withdrawn:'Changed your mind? You can RSVP again below.'}[st];
  const ai=RDAYS.findIndex(d=>d.key===r.arrival),di=RDAYS.findIndex(d=>d.key===r.departure),party=1+(r.plusOnes||[]).length+(+r.kids||0);
  const mine=going?WEDDING.events.filter(e=>(r.events||[]).includes(e.id)):[];
  const rows=[['RSVP',{yes:'Attending',maybe:'Tentative',no:'Can’t come',withdrawn:'Withdrawn'}[st]]].concat(going?[['Dates',ai>=0&&di>=0?`${dayText(ai)} → ${dayText(di)}`:''],['Party',`${party} ${party>1?'people':'person'}`],['Stay',r.accommodation?'Needed':'Not needed']]:[]);
  const wa=`https://wa.me/${WEDDING.contact.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Namaste Hemanth! ${r.firstName} ${r.lastName} here. I just sent my RSVP: ${rows[0][1]}${going?` (${party} ${party>1?'people':'person'})`:''}.`)}`;
  const cal=mine.length?`<div class="cal-box"><span class="lbl">Add ${mine.length>1?`your ${mine.length} events`:'it'} to your calendar</span><div class="cal-btns"><button class="btn solid" type="button" data-act="apple">${calSvg}Apple</button><button class="btn" type="button" data-act="google">${calSvg}Google</button></div><div class="collapse" id="g-wrap"><div><ul class="g-list">${mine.length>1?`<li class="g-all"><span>All ${mine.length} events at once<small>One tap adds a “Hemanth & Alekya’s Wedding” calendar</small></span><a href="${esc(gcalAll(mine))}" target="_blank" rel="noopener noreferrer" data-g>Add all</a></li>`:''}${mine.map(e=>`<li><span>${esc(e.title)}<small>${weekday(e).slice(0,3)} ${e.d} ${MON[e.m-1].slice(0,3)} · ${time12(e.t)}</small></span><a href="${esc(gcal(e))}" target="_blank" rel="noopener noreferrer" data-g>Add</a></li>`).join('')}</ul></div></div></div>`:'';
  done.className='rsvp-card done '+st;
  done.innerHTML=`<div class="tick" aria-hidden="true">${{yes:'✓',maybe:'?',no:'♡',withdrawn:'↺'}[st]}</div><h3>${esc(title)}</h3><p>${esc(lead)}</p><dl>${rows.filter(x=>x[1]).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>${cal}<div class="acts"><button class="btn solid" type="button" data-act="edit">${st==='withdrawn'?'RSVP again':'Change in plans? Update'}</button><a class="btn wa" style="background:linear-gradient(#1f8f4e,#13703a);color:#fff;border-color:#0f5c30" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">${waSvg}Tell Hemanth on WhatsApp</a>${st!=='withdrawn'?'<button class="btn ghost" type="button" data-act="withdraw">Withdraw my RSVP</button>':''}</div>`;
  if(mine.length)setCollapse($('#g-wrap'),false);
  done.hidden=false;form.hidden=true;exitEdit();if(justSent){document.dispatchEvent(new CustomEvent('hx:rsvp',{detail:{status:st}}));done.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'})}}
function enterEdit(r){fill(r.status==='withdrawn'?Object.assign({},r,{status:''}):r);rs.mode='edit';$('#edit-name').textContent=r.firstName;setCollapse($('#find-top'),false);setCollapse($('#edit-banner'),true);msgChips();$('#rsvp-submit').textContent='Update RSVP';$('#rsvp-done').hidden=true;form.hidden=false;form.classList.add('in');form.scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'})}
function exitEdit(){setCollapse($('#find-top'),true);setCollapse($('#edit-banner'),false);$('#rsvp-submit').textContent='Send RSVP';F.phone.placeholder='To update your RSVP later';msgChips()}
$('#edit-cancel').onclick=()=>{if(rs.last)showDone(rs.last);else{rs.mode='new';exitEdit()}};
$('#msg-chips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$('#msg-chips').querySelectorAll('.on').forEach(x=>x.classList.remove('on'));b.classList.add('on');F.message.value=b.textContent});
$('#rsvp-done').addEventListener('click',async e=>{const g=e.target.closest('[data-g]');if(g){setTimeout(()=>{g.textContent='Added ✓';g.classList.add('added')},400);return}
  const b=e.target.closest('[data-act]');if(!b)return;const r=rs.last;
  if(b.dataset.act==='edit')enterEdit(r);
  if(b.dataset.act==='apple')location.href=calFile(WEDDING.events.filter(ev=>(r.events||[]).includes(ev.id)));
  if(b.dataset.act==='google'){const mine=WEDDING.events.filter(ev=>(r.events||[]).includes(ev.id));if(mine.length===1)window.open(gcal(mine[0]),'_blank','noopener');else{const w=$('#g-wrap');setCollapse(w,!w.classList.contains('open'))}}
  if(b.dataset.act==='withdraw'&&await ask('You can RSVP again any time if your plans change.',{title:'Withdraw your RSVP?',ok:'Yes, withdraw',cancel:'Keep my RSVP'})){b.disabled=true;try{const x=await api({action:'withdraw',id:rs.saved.id,secret:rs.saved.secret});if(x.ok)showDone(x.rsvp);else tell('Could not withdraw. Please try again.')}catch(err){tell(errText(err))}b.disabled=false}});
const findForm=$('#find-form');
function openFind(){const f=findForm;f.cc.value=F.cc.value;f.ccx.value=F.ccx.value;ccSync(f);f.phone.value=F.phone.value;$('#find-error').textContent='';$('#find-help').hidden=true;$('#find').showModal()}
$('#find-open').onclick=openFind;$('#find-top-open').onclick=openFind;
findForm.addEventListener('submit',async e=>{e.preventDefault();const f=findForm,er=$('#find-error');er.textContent='';$('#find-help').hidden=true;
  const pe=phoneError(phoneOf(f),false);if(pe){er.textContent=pe;return}
  const btn=f.querySelector('[type=submit]');btn.disabled=true;
  try{const r=await api({action:'find',phone:phoneOf(f)});track(r.ok?'find_ok':'find_fail');
    if(r.ok){rs.saved={id:r.id,secret:r.secret};rs.last=r.rsvp;$('#find').close();enterEdit(r.rsvp)}
    else{er.textContent=r.error==='rate_limited'?'Too many attempts. Please wait a few minutes.':'We couldn’t find that number. Check it, or message Hemanth below.';if(r.error!=='rate_limited')findHelp(f)}}
  catch(err){er.textContent=errText(err)}finally{btn.disabled=false}});
// Ready-to-send WhatsApp notes to Hemanth (his Indian number has WhatsApp), most likely one first.
function findHelp(f){const p=phoneOf(f),digits=String(p.number).replace(/\D/g,''),name=[F.firstName.value,F.lastName.value].map(s=>nameCase(s.trim())).filter(Boolean).join(' ');
  const me=`Namaste Hemanth! ${name?`This is ${name}. `:''}I couldn’t find my RSVP on the website${digits?` with my number ${p.cc?p.cc+' ':''}${digits}`:''}.`;
  const opts=[['no','I can’t make it',`${me} Sadly I won’t be able to make it to the wedding. Sending love and blessings to you and Alekya! 🙏`],['change','My plans changed',`${me} My plans have changed and I’d like to update my RSVP: `],['help','Please help me find it',`${me} I’m still coming! Could you please help me find or update it? 🙏`]];
  if(radioVal(form,'status')!=='no')opts.push(opts.shift());
  $('#find-wa').innerHTML=opts.map(([,l,t])=>`<a href="https://wa.me/${WEDDING.contact.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(t)}" target="_blank" rel="noopener noreferrer">${waSvg}<span>${esc(l)}</span></a>`).join('');
  $('#find-help').hidden=false}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#fab').onclick=()=>$('#rsvp').scrollIntoView({behavior:reduce?'auto':'smooth'});
new IntersectionObserver(es=>es.forEach(e=>$('#fab').classList.toggle('away',e.isIntersecting)),{threshold:.05}).observe($('#rsvp'));
new IntersectionObserver(es=>es.forEach(e=>body.classList.toggle('form-focused',e.isIntersecting)),{threshold:.08}).observe($('#rsvp'));
exitEdit();syncRange();steppers();showGoing();store.del('hx-rsvp');store.del('hx-draft');

/* ----- Hidden admin dashboard: tap the temples at the bottom 3 times ----- */
let taps=[],admPw='',admData=null;
$('#admin-tap').addEventListener('click',()=>{const now=Date.now();taps=taps.filter(t=>now-t<1200).concat(now);if(taps.length>=3){taps=[];$('#adm-error').textContent='';$('#adm-form').pw.value='';$('#adm-login').showModal()}});
$('#adm-form').addEventListener('submit',async e=>{e.preventDefault();const pw=e.target.pw.value,er=$('#adm-error'),btn=e.target.querySelector('[type=submit]');er.textContent='';btn.disabled=true;
  try{const r=await api({action:'admin',password:pw});if(r.ok){admPw=pw;$('#adm-login').close();admData=r;renderAdmin();openAdmin()}else er.textContent='Incorrect password.'}
  catch(err){er.textContent=err.code==='not_configured'?'Connect the RSVP backend first (apiUrl).':'Could not reach the server.'}finally{btn.disabled=false}});
let admTimer=null;
function openAdmin(){const a=$('#admin');a.classList.remove('quiet');a.hidden=false;root.classList.add('locked');a.scrollTop=0;clearInterval(admTimer);admTimer=setInterval(()=>{if(!$('#adm-edit').open&&!document.hidden)reloadAdmin().catch(()=>{})},60000)}
function closeAdmin(){clearInterval(admTimer);$('#admin').hidden=true;admPw='';admData=null;admTab='overview';admKeep={};$('#admin').innerHTML='';if(opened)root.classList.remove('locked')}
const dKey=k=>{const i=RDAYS.findIndex(d=>d.key===k);return i<0?'':`${RDAYS[i].day} ${RDAYS[i].label}`};
// Admin times are shown in Central Time, where the wedding is.
const fmtTime=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleString('en-US',{timeZone:'America/Chicago',weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})+' CT'};
const STL={yes:'Attending',maybe:'Tentative',no:'Not attending',withdrawn:'Withdrawn'},GL={male:'M',female:'F',other:'Other'},TL={DFW:'DFW',DAL:'Love Field',drive:'Driving',other:'Other'},FL={veg:'Veg',nonveg:'Non-veg',jain:'Jain',vegan:'Vegan'};
function bars(rows,two=true,legend='Solid = attending · striped = tentative'){const max=Math.max(1,...rows.map(r=>r.a+(r.b||0)));return`<div class="bars">${rows.map(r=>`<div class="bar"><span>${esc(r.label)}</span><span class="t"><i class="y" style="width:${r.a/max*100}%"></i>${two?`<i class="m" style="width:${(r.b||0)/max*100}%"></i>`:''}</span><span class="n">${r.a}${two&&r.b?` <small style="color:#a86a00">+${r.b}</small>`:''}</span></div>`).join('')}</div>${two&&legend?`<p class="legend">${legend}</p>`:''}`}
function donut(parts){const tot=parts.reduce((a,p)=>a+p.v,0)||1;let off=25;return`<div class="donut"><svg viewBox="0 0 42 42" role="img" aria-label="Responses by status"><circle cx="21" cy="21" r="15.915" fill="none" stroke="#efe0bd" stroke-width="6"/>${parts.map(p=>{const len=p.v/tot*100,s=`<circle cx="21" cy="21" r="15.915" fill="none" stroke="${p.c}" stroke-width="6" stroke-dasharray="${len} ${100-len}" stroke-dashoffset="${off}"/>`;off-=len;return s}).join('')}<text x="21" y="23.5" text-anchor="middle" font-size="8" font-family="Cinzel,serif" fill="#6d1420">${tot===1&&!parts.some(p=>p.v)?0:tot}</text></svg><ul>${parts.map(p=>`<li><i style="background:${p.c}"></i>${esc(p.l)}: <b>${p.v}</b></li>`).join('')}</ul></div>`}
function histogram(days,cap){const max=Math.max(1,...days.map(d=>d.yes+d.maybe)),lbl=i=>`${RDAYS[i].day} ${RDAYS[i].label}${RDAYS[i].morning?' am':''}`;
  const stay=(d,i)=>{if(i===0||i===days.length-1)return'—';const t=d.stayingYes+d.stayingMaybe;return`<span class="${cap&&t>cap?'neg':''}">${d.stayingYes}${d.stayingMaybe?` <small>+${d.stayingMaybe}</small>`:''}${cap?` / ${cap}`:''}</span>`};
  return`<div class="hgram">${days.map((d,i)=>`<div class="hcol"><span class="htot">${d.yes}${d.maybe?`<small>+${d.maybe}</small>`:''}</span><div class="hstack" style="height:${(d.yes+d.maybe)/max*100}%">${d.maybe?`<i class="m" style="flex:${d.maybe}"></i>`:''}${d.yesKids?`<i class="k" style="flex:${d.yesKids}"></i>`:''}${d.yesAdults?`<i class="a" style="flex:${d.yesAdults}"></i>`:''}</div><span class="hday">${esc(RDAYS[i].day)}<br>${esc(RDAYS[i].label)}${RDAYS[i].morning?' am':''}</span></div>`).join('')}</div>
  <p class="legend"><i class="lg a"></i>Adults<i class="lg k"></i>Kids<i class="lg m"></i>Tentative</p>
  <table class="plan"><thead><tr><th>Day</th><th>Adults</th><th>Kids</th><th>Tentative</th><th>Staying</th></tr></thead><tbody>${days.map((d,i)=>`<tr><td>${esc(lbl(i))}</td><td>${d.yesAdults}</td><td>${d.yesKids}</td><td>${d.maybe}</td><td>${stay(d,i)}</td></tr>`).join('')}</tbody></table>`}
function renderAdmin(){const r=admData,s=r.stats,v=r.visits,g=s.accommodation.gender;
  const hc=h=>h.changes.find(c=>c.field==='headcount'),moves=r.history.filter(hc),wk=Date.now()-7*864e5;
  const net=moves.filter(h=>new Date(h.at)>wk).reduce((a,h)=>a+(+hc(h).after)-(+hc(h).before),0);
  const kp=[['g',s.people.yes,'Attending'],['a',s.people.maybe,'Tentative'],['r',s.responses.no,'Declined'],['',s.responses.total,'Responses'],['',s.people.adultsYes,'Adults'],['',s.people.kidsYes,'Kids'],['',s.people.plusOnesYes,'Plus-ones'],['',s.accommodation.people,'Need stay'],[s.accommodation.capacity&&s.accommodation.peakNight>s.accommodation.capacity?'r':'',`${s.accommodation.peakNight}${s.accommodation.capacity?` / ${s.accommodation.capacity}`:''}`,'Peak night'],[net<0?'r':net>0?'g':'',`${net>0?'+':net<0?'−':''}${Math.abs(net)}`,'Net change 7d'],['',v.unique??v.total,'Unique visitors']];
  const kpis=list=>`<div class="kpis">${list.map(([c,n,l])=>`<div class="kpi ${c}"><b>${n}</b><span>${l}</span></div>`).join('')}</div>`;
  const mail=r.mail&&r.mail.at?(r.mail.ok?`Last email ${esc(fmtTime(r.mail.at))} · ${r.mail.quota} left today`:`<b class="neg">Emails failing: ${esc(r.mail.error)}</b>`):'';
  const tabs=[['overview','Overview',''],['guests','Guests',r.rsvps.length],['history','History',r.history.length],['visits','Analytics',v.unique??'']];
  const pane=(k,html)=>`<section class="adm-pane" id="adm-${k}" role="tabpanel" aria-labelledby="adm-tab-${k}"${admTab===k?'':' hidden'}>${html}</section>`;
  $('#admin').innerHTML=`<div class="adm-wrap"><header class="adm-top"><div class="adm-title"><h2>RSVP dashboard</h2><p class="adm-sub">Updated ${esc(fmtTime(r.generatedAt))}${mail?` · ${mail}`:''}</p></div>
   <div class="adm-btns"><button class="btn solid" data-a="add">＋ Add guest</button><button class="btn adm-ic" data-a="refresh"><span aria-hidden="true">↻</span> Refresh</button><button class="btn adm-ic" data-a="csv"><span aria-hidden="true">⤓</span> CSV</button><button class="btn adm-ic close" data-a="close" aria-label="Close dashboard"><span aria-hidden="true">✕</span> Close</button></div></header>
   <nav class="adm-tabs" role="tablist" aria-label="Dashboard sections">${tabs.map(([k,l,n])=>`<button type="button" role="tab" id="adm-tab-${k}" data-tab="${k}" aria-controls="adm-${k}" aria-selected="${admTab===k}">${l}${n!==''?`<small>${n}</small>`:''}</button>`).join('')}</nav>
  ${pane('overview',`${kpis(kp)}<p class="adm-note">${s.responses.total} responses${s.responses.withdrawn?` · ${s.responses.withdrawn} withdrawn`:''}${s.dedup&&s.dedup.skipped?` · ${s.dedup.skipped} counted once (family replied separately)`:''} · refreshes every minute</p>
  <div class="adm-grid">
   <div class="panel wide"><h3>Daily headcount · plan food &amp; stay</h3>${histogram(s.perDay,s.accommodation.capacity)}<p class="legend">Stays start 30 Nov (29 Nov arrivals don’t need one); the ranch Airbnb holds ${s.accommodation.capacity||15}. Staying guests by gender: Male ${g.male} · Female ${g.female} · Other ${g.other} · Not given ${g.unspecified} · Kids ${s.accommodation.kids}.</p></div>
   <div class="panel"><h3>Changes in plans</h3>${moves.length?`<ol class="adm-tl">${moves.slice(0,20).map(h=>histItem(h)).join('')}</ol>`:'<p class="legend">No changes yet.</p>'}</div>
   <div class="panel"><h3>Headcount by event</h3>${bars(s.perEvent.map(e=>({label:e.label,a:e.yes,b:e.maybe})))}</div>
   <div class="panel"><h3>Responses</h3>${donut([{l:'Attending',v:s.responses.yes,c:'#2f7d43'},{l:'Tentative',v:s.responses.maybe,c:'#e0a100'},{l:'Not attending',v:s.responses.no,c:'#a3162b'},{l:'Withdrawn',v:s.responses.withdrawn,c:'#9b8f80'}])}</div>
  </div>`)}
  ${pane('guests',`<div class="adm-tools"><input type="search" id="adm-q" placeholder="Search name, phone, note" aria-label="Search guests"><select id="adm-st" aria-label="Filter by reply"><option value="">All replies</option><option value="yes">Attending</option><option value="maybe">Tentative</option><option value="no">Not attending</option><option value="withdrawn">Withdrawn</option></select><select id="adm-stay" aria-label="Filter by stay"><option value="">Any stay</option><option value="1">Needs stay</option></select><select id="adm-sort" aria-label="Sort guests"><option value="updatedAt">Recently updated</option><option value="name">Name A–Z</option><option value="party">Largest party</option><option value="arrival">Arriving first</option></select><div class="adm-view" role="group" aria-label="Show guests as">${['cards','table'].map(k=>`<button type="button" data-view="${k}" aria-pressed="${admView===k}">${k==='cards'?'Cards':'Table'}</button>`).join('')}</div></div><div class="${admView==='table'?'adm-tbl-wrap':'gc-list'}" id="adm-rows"></div>`)}
  ${pane('history',`<div class="adm-tools two"><input type="search" id="adm-hq" placeholder="Search by guest name" aria-label="Search history"><select id="adm-ha" aria-label="Filter by change"><option value="">Every change</option><option value="created">New RSVPs</option><option value="updated">Updates</option><option value="withdrawn">Withdrawals</option><option value="admin">Changes by you</option><option value="headcount">Headcount changes</option></select></div><p class="adm-note">Every change is kept, including RSVPs that were later deleted.</p><ol class="adm-tl" id="adm-hist"></ol>`)}
  ${pane('visits',visitsPane(v))}
  </div>`;
  const keep=admKeep;['q','st','stay','sort','hq','ha'].forEach(k=>{const el=$('#adm-'+k);if(el&&keep[k])el.value=keep[k]});
  admRows();admHist()}
let admTab='overview',admKeep={},admView='cards';
function guestTable(list,hist){const EV=Object.fromEntries(WEDDING.events.map(e=>[e.id,e]));
  const rows=list.map(x=>{const going=x.status==='yes'||x.status==='maybe',adults=1+x.plusOnes.length,name=`${esc(x.firstName)} ${esc(x.lastName)}`;
    return`<tr><td>${name}${x.source==='admin'?'<br><small>added by you</small>':''}</td><td><span class="pill ${esc(x.status)}">${STL[x.status]||esc(x.status)}</span></td><td>${going?`<b>${adults+x.kids}</b> <small>${adults} adult${adults>1?'s':''}${x.kids?` · ${x.kids} kid${x.kids>1?'s':''}`:''}</small>`:'—'}</td><td>${going?`${esc(dKey(x.arrival))}<br><small>→ ${esc(dKey(x.departure))}</small>`:'—'}</td><td>${going&&x.accommodation?'<span class="tag-chip stay">Needs stay</span>':'—'}</td><td>${going?x.events.map(id=>EV[id]?`<span class="ev-chip" style="--c:${esc(EV[id].accent)}">${esc(EV[id].title.replace(/ \(.*\)$/,'').replace(/ \/.*$/,''))}</span>`:'').join(''):'—'}</td><td>${going&&x.plusOnes.length?x.plusOnes.map(p=>esc([p.name||'Guest',GL[p.gender]||''].filter(Boolean).join(' · '))).join('<br>'):'—'}</td><td>${x.phone?`<a href="${esc('https://wa.me/'+x.phone.replace(/\D/g,''))}" target="_blank" rel="noopener noreferrer">${esc(x.phone)}</a>`:'—'}</td><td class="note">${esc(x.message)||'—'}</td><td><small>${esc(fmtTime(x.createdAt))}</small></td><td><small>${esc(fmtTime(x.updatedAt))}</small></td><td class="act"><button type="button" class="ico" data-edit="${esc(x.id)}" aria-label="Edit ${name}" title="Edit">✎</button><button type="button" class="ico" data-goto-hist="${esc(x.firstName+' '+x.lastName)}" aria-label="History of ${name}" title="History (${hist(x.id).length})">⧖</button><button type="button" class="ico del" data-del="${esc(x.id)}" aria-label="Delete ${name}" title="Delete">✕</button></td></tr>`}).join('');
  return`<table class="adm-tbl guests"><thead><tr><th>Guest</th><th>Reply</th><th>Party</th><th>Dates</th><th>Stay</th><th>Events</th><th>Plus-ones</th><th>WhatsApp</th><th>Note</th><th>Replied (CT)</th><th>Updated (CT)</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="12" class="adm-empty">No RSVPs match.</td></tr>'}</tbody></table>`}
const dur=s=>!s?'—':s>=3600?`${Math.floor(s/3600)}h ${Math.round(s%3600/60)}m`:s>=60?`${Math.floor(s/60)}m ${s%60}s`:`${s}s`;
const SEC={opened:'Opened',events:'Events',rsvp:'RSVP',photos:'Photos'};
const EVL={envelope_open:'Opened the envelope',music_on:'Turned music on',music_off:'Turned music off',qr:'Opened the QR code',share:'Tapped Share',map:'Opened the map',calendar_apple:'Added to Apple Calendar',calendar_google:'Added to Google Calendar',calendar_google_all:'Google: added all events',calendar_google_one:'Google: added one event',event_calendar:'Opened an event’s calendar',whatsapp:'Tapped a WhatsApp link',call:'Tapped a call link',text:'Tapped a text link',email:'Tapped an email link',find_open:'Opened “Find my RSVP”',find_ok:'Found their RSVP',find_fail:'Couldn’t find their RSVP',find_whatsapp:'Messaged Hemanth after not finding it',rsvp_button:'Tapped the RSVP button',rsvp_start:'Started the RSVP form',rsvp_yes:'Chose “Attending”',rsvp_maybe:'Chose “Tentative”',rsvp_no:'Chose “Can’t come”',rsvp_error:'Hit a form error',rsvp_sent:'Sent or updated an RSVP',rsvp_edit:'Opened “Update”',rsvp_withdraw:'Tapped “Withdraw”',photo_open:'Opened a photo',photo_next:'Swiped photos in full view',photo_dot:'Tapped photo dots',scroll_25:'Scrolled a quarter',scroll_50:'Scrolled halfway',scroll_75:'Scrolled three quarters',scroll_100:'Reached the end',saw_events:'Saw the events',saw_rsvp:'Saw the RSVP form',saw_photos:'Saw the photos'};
const evLabel=k=>EVL[k]||(k.startsWith('event_')?'Tapped event: '+((WEDDING.events.find(e=>'event_'+e.id===k)||{}).title||k.slice(6)):k.startsWith('contact_')?'Opened contact: '+k.slice(8).replace(/^./,c=>c.toUpperCase()):k.replace(/_/g,' '));
const PAL=['#a3162b','#c9a24a','#2f7d43','#2c5d8a','#8e2453','#e0a100','#5b3a8a','#d9480f','#6b3c12','#9b8f80'];
// Pie (donut) of the top 6 with the rest grouped as “Other”.
function pie(list){list=(list||[]).filter(x=>x.n);if(!list.length)return'<p class="legend">No data yet.</p>';const head=list.slice(0,6),rest=list.slice(6).reduce((a,x)=>a+x.n,0);
  return donut(head.map((x,i)=>({l:x.label,v:x.n,c:PAL[i]})).concat(rest?[{l:'Other',v:rest,c:PAL[9]}]:[]))}
// Ranked table with a share bar, for places and similar lists.
function rankTable(list,total,head='People',n=15){list=(list||[]).filter(x=>x.n);if(!list.length)return'<p class="legend">No data yet.</p>';
  return`<div class="adm-tbl-wrap mini"><table class="adm-tbl rank"><thead><tr><th>#</th><th>Name</th><th>${head}</th><th>Share</th></tr></thead><tbody>${list.slice(0,n).map((x,i)=>{const p=total?Math.round(x.n/total*100):0;return`<tr><td>${i+1}</td><td>${esc(x.label)}</td><td><b>${x.n}</b></td><td><span class="share"><i style="width:${p}%"></i></span> ${p}%</td></tr>`}).join('')}</tbody></table></div>`}
function columns(vals,labels,title){const max=Math.max(1,...vals);return`<div class="hours" style="grid-template-columns:repeat(${vals.length},1fr)">${vals.map((n,i)=>`<i style="height:${n/max*100}%" title="${esc(labels[i])} · ${n} ${title}"></i>`).join('')}</div>`}
function visitsPane(v){const A=v.analytics||{},F=A.funnel||{},P=A.people||0,pct=(a,b)=>b?Math.round(a/b*100)+'%':'—',top=(list,n=8)=>(list||[]).length?bars(list.slice(0,n).map(x=>({label:x.label,a:x.n})),false):'<p class="legend">No data yet.</p>';
  const k=[['g',v.unique??'—','Unique visitors'],['',A.returning??0,'Returning'],['',A.newPeople??0,'First-time'],['',v.total,'Total visits'],['a',v.uniqueToday??'—','Unique today'],['',v.today,'Visits today'],['',dur(A.avgDuration),'Avg time on page'],['',dur(A.medianDuration),'Typical time'],['',(A.avgScroll??0)+'%','Avg scrolled'],['',pct(F.opened,F.visited),'Opened envelope'],[F.sent?'g':'',pct(F.sent,F.visited),'Sent an RSVP'],['',A.avgOpenAfter?A.avgOpenAfter+'s':'—','Time to open'],['',A.avgLoadMs?(A.avgLoadMs/1000).toFixed(1)+'s':'—','Page load']];
  const steps=[['Visited',F.visited],['Opened the envelope',F.opened],['Saw the events',F.events],['Reached the RSVP form',F.rsvpSeen],['Started an RSVP',F.started],['Sent an RSVP',F.sent],['Saw the photos',F.photos]];
  const daily=(v.daily||[]).slice(-30),dLabel=d=>new Date(d.date+'T12:00').toLocaleDateString([],{month:'short',day:'numeric'});
  const dmax=Math.max(1,...daily.map(d=>d.visits));
  const dailyChart=daily.length?`<div class="dcols">${daily.map(d=>{const u=d.unique??d.visits,r=Math.max(0,d.visits-u);return`<div title="${esc(dLabel(d))}: ${u} unique, ${d.visits} visits"><i class="r" style="height:${r/dmax*100}%"></i><i class="u" style="height:${u/dmax*100}%"></i></div>`}).join('')}</div><div class="hours-l"><span>${esc(dLabel(daily[0]))}</span><span>${esc(dLabel(daily[daily.length-1]))}</span></div><p class="legend"><i class="lg a"></i>Unique visitors<i class="lg m"></i>Repeat visits</p>`:'<p class="legend">No visits yet.</p>';
  const evs=(A.events||[]),evRows=evs.map((e,i)=>`<tr><td>${i+1}</td><td>${esc(evLabel(e.label))}</td><td><b>${e.people}</b></td><td><span class="share"><i style="width:${P?Math.round(e.people/P*100):0}%"></i></span> ${pct(e.people,P)}</td><td>${e.total}</td></tr>`).join('');
  const recent=(A.recent||[]).map(r=>`<tr><td>${esc(fmtTime(r.at))}</td><td>${r.who?`<code>${esc(r.who)}</code>`:'—'}${r.returning?' <span class="tag-chip ret">returning</span>':''}</td><td>${esc(r.place||'—')}</td><td>${esc([r.device,r.os].filter(Boolean).join(' · '))}<br><small>${esc([r.browser,r.size,r.net&&r.net.toUpperCase(),r.theme==='dark'?'dark mode':''].filter(Boolean).join(' · '))}</small></td><td><span class="tag-chip src">${esc(r.source||'—')}</span></td><td>${dur(r.duration)}${r.openAfter?`<br><small>opened after ${r.openAfter}s</small>`:''}</td><td>${r.scroll?r.scroll+'%':'—'}</td><td>${(r.sections||[]).map(s=>`<span class="tag-chip">${esc(SEC[s]||s)}</span>`).join('')||'—'}</td><td>${(r.actions||[]).filter(s=>!/^(scroll_|saw_)/.test(s)).map(s=>`<span class="tag-chip act">${esc(evLabel(s))}</span>`).join('')||'—'}</td><td>${r.rsvp?`<span class="pill ${r.rsvp==='started'?'maybe':esc(r.rsvp)}">${r.rsvp==='started'?'Started':STL[r.rsvp]||'Sent'}</span>`:'—'}</td><td>${esc(r.tz||'—')}</td></tr>`).join('');
  const WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return `<div class="kpis">${k.map(([c,n,l])=>`<div class="kpi ${c}"><b>${n}</b><span>${l}</span></div>`).join('')}</div><p class="adm-note">No cookies or stored IDs. People are told apart by IP address, kept only as a scrambled code, so a family on one Wi‑Fi counts once and phones on mobile data may count twice. Place comes from the IP: right for the country, roughly right for the city. Breakdowns count people, not page loads. Microsoft Clarity gets the same events for its recordings and heatmaps.</p>
  <div class="adm-grid">
   <div class="panel wide"><h3>Visitors · last 30 days</h3>${dailyChart}</div>
   <div class="panel funnel"><h3>How far people got</h3>${bars(steps.map(([l,n])=>({label:`${l} · ${pct(n||0,F.visited)}`,a:n||0})),false)}</div>
   <div class="panel"><h3>New vs returning</h3>${pie(A.returningSplit)}</div>
   <div class="panel"><h3>Countries</h3>${pie(A.countries)}${rankTable(A.countries,P,'People',10)}</div>
   <div class="panel"><h3>States &amp; regions</h3>${top(A.regions,10)}</div>
   <div class="panel wide"><h3>Cities</h3>${rankTable(A.cities,P,'People',20)}</div>
   <div class="panel"><h3>Came from</h3>${pie(A.sources)}<p class="legend">Add ?src=family (or any word) to links you share to see them here. The QR code reports as “QR code”, the Share button as “Shared link”.</p></div>
   <div class="panel"><h3>Devices</h3>${pie(A.devices)}</div>
   <div class="panel"><h3>Phone &amp; computer systems</h3>${pie(A.os)}</div>
   <div class="panel"><h3>Browsers &amp; apps</h3>${pie(A.browsers)}</div>
   <div class="panel"><h3>Screen sizes</h3>${pie(A.sizes)}</div>
   <div class="panel"><h3>Connection &amp; display</h3>${top(A.networks)}<h3 style="margin-top:14px">Light or dark mode</h3>${pie(A.themes)}</div>
   <div class="panel"><h3>Time of day (Central)</h3>${columns(A.hours||[],(A.hours||[]).map((_,h)=>`${h}:00`),'visits')}<div class="hours-l"><span>12 am</span><span>6 am</span><span>12 pm</span><span>6 pm</span><span>11 pm</span></div></div>
   <div class="panel"><h3>Day of the week</h3>${bars((A.weekdays||[]).map((n,i)=>({label:WD[i],a:n})),false)}</div>
   <div class="panel wide"><h3>Everything people did</h3>${evRows?`<div class="adm-tbl-wrap mini"><table class="adm-tbl rank"><thead><tr><th>#</th><th>What</th><th>People</th><th>Share of visitors</th><th>Times</th></tr></thead><tbody>${evRows}</tbody></table></div>`:'<p class="legend">No taps recorded yet.</p>'}</div>
   <div class="panel"><h3>Their time zones</h3>${top(A.timezones)}</div>
   <div class="panel"><h3>Languages</h3>${top(A.languages)}</div>
  </div>
  <div class="panel wide" style="margin-top:12px"><h3>Recent visits</h3><div class="adm-tbl-wrap"><table class="adm-tbl"><thead><tr><th>When (CT)</th><th>Visitor</th><th>Place</th><th>Device</th><th>Came from</th><th>Time</th><th>Scrolled</th><th>Saw</th><th>Did</th><th>RSVP</th><th>Time zone</th></tr></thead><tbody>${recent||'<tr><td colspan="11" class="adm-empty">No visits recorded yet.</td></tr>'}</tbody></table></div></div>`}
const ACT={created:'Sent RSVP',updated:'Updated',withdrawn:'Withdrew','edited by admin':'Edited by you','added by admin':'Added by you','deleted by admin':'Deleted by you'};
const FLD={headcount:'Headcount',firstName:'First name',lastName:'Last name',plusOnes:'Plus-ones',kids:'Kids',accommodation:'Stay',arrival:'Arriving',departure:'Leaving',events:'Events',travel:'Travel',flight:'Flight',food:'Food',message:'Note',status:'Reply',gender:'Gender',phone:'WhatsApp',email:'Email'};
const actTone=a=>/delet|withdr/.test(a)?'r':/creat|add/.test(a)?'g':'a';
function histItem(h,withName=true){const ch=h.changes||[],only=/creat|add/.test(h.action)?'after':/delet/.test(h.action)?'before':'';
  const val=c=>only==='after'?`<b>${esc(c.after||'—')}</b>`:only==='before'?`<s>${esc(c.before||'—')}</s>`:`<s>${esc(c.before||'—')}</s><i aria-hidden="true">→</i><b>${esc(c.after||'—')}</b>`;
  return`<li class="hx-ev ${actTone(h.action)}"><div class="hx-ev-h">${withName?`<b>${esc(h.name)}</b>`:''}<span class="adm-tag ${actTone(h.action)}">${esc(ACT[h.action]||h.action)}</span><time datetime="${esc(h.at)}">${esc(fmtTime(h.at))}</time></div>${ch.length?`<dl class="chg">${ch.map(c=>`<dt>${esc(FLD[c.field]||c.field)}</dt><dd>${val(c)}</dd>`).join('')}</dl>`:''}</li>`}
function admRows(){const q=($('#adm-q')?.value||'').toLowerCase(),st=$('#adm-st')?.value||'',stay=$('#adm-stay')?.value||'',sort=$('#adm-sort')?.value||'updatedAt';
  const party=x=>1+x.plusOnes.length+x.kids,dir={name:1,arrival:1}[sort]||-1,key={name:x=>(x.firstName+' '+x.lastName).toLowerCase(),party,arrival:x=>x.arrival||'9',updatedAt:x=>x.updatedAt}[sort];
  const list=admData.rsvps.filter(x=>(!st||x.status===st)&&(!stay||x.accommodation&&x.status!=='no')&&(!q||[x.firstName,x.lastName,x.phone,x.email,x.message,x.plusOnes.map(p=>p.name).join(' ')].join(' ').toLowerCase().includes(q))).sort((a,b)=>{const A=key(a),B=key(b);return(A>B?1:A<B?-1:0)*dir});
  const hist=id=>admData.history.filter(h=>h.id===id);
  if(admView==='table'){$('#adm-rows').innerHTML=guestTable(list,hist);return}
  $('#adm-rows').innerHTML=list.map(x=>{const going=x.status==='yes'||x.status==='maybe',adults=1+x.plusOnes.length,hs=hist(x.id),name=`${esc(x.firstName)} ${esc(x.lastName)}`;
    return`<article class="gc"><div class="gc-h"><b>${name}</b><span class="pill ${esc(x.status)}">${STL[x.status]||esc(x.status)}</span></div>
    ${going?`<dl class="gc-d"><dt>Party</dt><dd>${party(x)} · ${adults} adult${adults>1?'s':''}${x.kids?`, ${x.kids} kid${x.kids>1?'s':''}`:''}</dd><dt>Dates</dt><dd>${esc(dKey(x.arrival))} → ${esc(dKey(x.departure))}</dd><dt>Stay</dt><dd>${x.accommodation?'<b class="stay">Needs stay</b>':'Not needed'}</dd>${x.plusOnes.length?`<dt>Plus-ones</dt><dd>${x.plusOnes.map(p=>esc([p.name||'Guest',GL[p.gender]||''].filter(Boolean).join(' · '))).join(', ')}</dd>`:''}<dt>Events</dt><dd>${x.events.map(id=>esc((WEDDING.events.find(e=>e.id===id)||{title:id}).title.replace(/ \(.*\)$/,''))).join(', ')||'—'}</dd>${x.gender?`<dt>Gender</dt><dd>${esc(GL[x.gender]||'')}</dd>`:''}</dl>`:''}
    ${x.message?`<p class="gc-note">“${esc(x.message)}”</p>`:''}
    <p class="gc-f">${x.phone?`<a href="${esc('https://wa.me/'+x.phone.replace(/\D/g,''))}" target="_blank" rel="noopener noreferrer">WhatsApp ${esc(x.phone)}</a>`:'<span>No number</span>'}<span>Updated ${esc(fmtTime(x.updatedAt))}</span>${x.source==='admin'?'<span>Added by you</span>':''}</p>
    <div class="gc-act"><button type="button" class="btn" data-edit="${esc(x.id)}" aria-label="Edit ${name}">Edit</button><button type="button" class="btn" data-hist="${esc(x.id)}" aria-expanded="false">History · ${hs.length}</button><button type="button" class="btn del" data-del="${esc(x.id)}" aria-label="Delete ${name}">Delete</button></div>
    <ol class="adm-tl mini" data-hist-for="${esc(x.id)}" hidden>${hs.map(h=>histItem(h,false)).join('')}</ol></article>`}).join('')||'<p class="adm-empty">No RSVPs match.</p>'}
function admHist(){const q=($('#adm-hq')?.value||'').toLowerCase(),a=$('#adm-ha')?.value||'';
  const list=admData.history.filter(h=>(!q||h.name.toLowerCase().includes(q))&&(!a||(a==='admin'?/admin/.test(h.action):a==='headcount'?h.changes.some(c=>c.field==='headcount'):h.action===a)));
  $('#adm-hist').innerHTML=list.slice(0,300).map(h=>histItem(h)).join('')+(list.length>300?`<li class="adm-empty">Showing the latest 300 of ${list.length}. Search a name to see older changes.</li>`:'')||'<li class="adm-empty">No changes match.</li>'}
$('#admin').addEventListener('input',e=>{if(e.target.closest('#adm-guests .adm-tools'))admRows();if(e.target.closest('#adm-history .adm-tools'))admHist()});
const ed=$('#ed-form');let edId=null,toastT;
ed.arrival.innerHTML=RDAYS.slice(0,-1).map((d,i)=>`<option value="${i}">${esc(dayText(i))}</option>`).join('');
ed.departure.innerHTML=RDAYS.map((d,i)=>i?`<option value="${i}">${esc(dayText(i))}</option>`:'').join('');
function edEvents(){const st=ed.status.value,a=+ed.arrival.value,b=+ed.departure.value;$('#ed-events').innerHTML=st==='no'||b<=a?'':inRange(a,b).map(e=>`<li><b>${weekday(e).slice(0,3)} ${e.d} ${MON[e.m-1].slice(0,3)}</b><div>${esc(e.title)}</div></li>`).join('')}
['arrival','departure','status'].forEach(n=>ed[n].addEventListener('change',edEvents));
function edPoRow(p){p=p||{name:'',gender:''};const d=document.createElement('div');d.className='po-ed';d.innerHTML=`<input maxlength="50" placeholder="Name (optional)" aria-label="Plus-one name" value="${esc(p.name)}"><select aria-label="Plus-one gender"><option value="">—</option><option value="male"${p.gender==='male'?' selected':''}>Male</option><option value="female"${p.gender==='female'?' selected':''}>Female</option></select><button type="button" aria-label="Remove plus-one">✕</button>`;$('#ed-po').appendChild(d)}
$('#ed-po-add').onclick=()=>{if($('#ed-po').children.length<10)edPoRow()};
$('#ed-po').addEventListener('click',e=>{const b=e.target.closest('button');if(b)b.parentElement.remove()});
function openEditor(x){edId=x?x.id:null;$('#ed-title').textContent=x?`Edit ${x.firstName} ${x.lastName}`:'Add guest';$('#ed-error').textContent='';ed.reset();$('#ed-po').innerHTML='';
  if(x){ed.firstName.value=x.firstName;ed.lastName.value=x.lastName;const ph=x.phone||'',cc=ph.startsWith('+91')?'+91':ph.startsWith('+1')?'+1':ph?'other':'+1';ed.cc.value=cc;ed.phone.value=cc==='other'?ph:ph.slice(cc.length);
    ed.status.value=x.status==='withdrawn'?'no':x.status;ed.gender.value=x.gender||'';const ai=RDAYS.findIndex(d=>d.key===x.arrival),di=RDAYS.findIndex(d=>d.key===x.departure);ed.arrival.value=ai>=0?ai:0;ed.departure.value=di>0?di:5;
    x.plusOnes.forEach(p=>edPoRow(p));ed.kids.value=x.kids||0;ed.accommodation.checked=!!x.accommodation;ed.message.value=x.message||''}
  else{ed.arrival.value=0;ed.departure.value=5;ed.kids.value=0}
  edEvents();$('#adm-edit').showModal()}
ed.addEventListener('submit',async e=>{e.preventDefault();const er=$('#ed-error'),a=+ed.arrival.value,b=+ed.departure.value,st=ed.status.value,evs=st==='no'?[]:inRange(a,b).map(x=>x.id);er.textContent='';
  if(!ed.firstName.value.trim()||!ed.lastName.value.trim()){er.textContent='First and last name are required.';return}
  if(st!=='no'&&b<=a){er.textContent='Leaving must be after arriving.';return}
  const rsvp={firstName:ed.firstName.value,lastName:ed.lastName.value,phone:ed.cc.value==='other'?{cc:'',number:ed.phone.value}:{cc:ed.cc.value,number:ed.phone.value},status:st,gender:ed.gender.value,arrival:a,departure:b,events:evs,
    plusOnes:[...$('#ed-po').children].map(r=>({name:r.querySelector('input').value,gender:r.querySelector('select').value})),kids:Math.max(0,Math.min(10,parseInt(ed.kids.value||'0',10)||0)),accommodation:ed.accommodation.checked,message:ed.message.value};
  const btn=ed.querySelector('[type=submit]');btn.disabled=true;
  try{const r=await api({action:'adminSave',password:admPw,id:edId,rsvp});if(r.ok){$('#adm-edit').close();await reloadAdmin();toast(edId?'Saved':'Guest added')}else er.textContent=r.error==='exists'?'Another RSVP already uses this WhatsApp number.':r.error==='invalid'?'Please check: '+Object.keys(r.fields||{}).join(', '):'Could not save.'}
  catch{er.textContent='Could not reach the server.'}finally{btn.disabled=false}});
function saveAdmKeep(){admKeep={};['q','st','stay','sort','hq','ha'].forEach(k=>{const el=$('#adm-'+k);if(el)admKeep[k]=el.value})}
async function reloadAdmin(){const a=$('#admin'),top=a.scrollTop;const r=await api({action:'admin',password:admPw});if(r.ok&&admPw){saveAdmKeep();admData=r;a.classList.add('quiet');renderAdmin();a.scrollTop=top}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}
$('#admin').addEventListener('click',async e=>{const a=e.target.closest('[data-a]'),tab=e.target.closest('[data-tab]'),hb=e.target.closest('[data-hist]'),del=e.target.closest('[data-del]'),edit=e.target.closest('[data-edit]');
  if(edit){openEditor(admData.rsvps.find(x=>x.id===edit.dataset.edit));return}
  if(tab){admTab=tab.dataset.tab;$('#admin').querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===tab)));$('#admin').querySelectorAll('.adm-pane').forEach(p=>{p.hidden=p.id!=='adm-'+admTab});$('#admin').scrollTop=0;return}
  if(hb){const list=$('#admin').querySelector(`[data-hist-for="${CSS.escape(hb.dataset.hist)}"]`);if(list){list.hidden=!list.hidden;hb.setAttribute('aria-expanded',String(!list.hidden))}return}
  const vw=e.target.closest('[data-view]');if(vw){admView=vw.dataset.view;saveAdmKeep();renderAdmin();return}
  const gh=e.target.closest('[data-goto-hist]');if(gh){saveAdmKeep();admKeep.hq=gh.dataset.gotoHist;admKeep.ha='';admTab='history';renderAdmin();$('#admin').scrollTop=0;return}
  if(del&&await ask('This also removes it from the Google Sheet.',{title:'Delete this RSVP permanently?',ok:'Delete',cancel:'Cancel'})){try{const r=await api({action:'adminDelete',password:admPw,id:del.dataset.del});if(r.ok){await reloadAdmin();toast('Deleted')}else tell('Delete failed. Please try again.')}catch{tell('Could not reach the server.')}return}
  if(!a)return;
  if(a.dataset.a==='add')openEditor(null);
  if(a.dataset.a==='close')closeAdmin();
  if(a.dataset.a==='refresh'){a.disabled=true;try{await reloadAdmin();toast('Up to date')}catch{tell('Could not reach the server.')}a.disabled=false}
  if(a.dataset.a==='csv'){const cell=v=>{let s=Array.isArray(v)?v.map(p=>typeof p==='object'?[p.name,p.gender].filter(Boolean).join(' / '):p).join(' | '):String(v??'');if(/^[=+\-@]/.test(s))s="'"+s;return/[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
    const visits=admTab==='visits',cols=visits?['at','who','returning','place','device','os','browser','source','tz','duration','scroll','sections','actions','rsvp']:['firstName','lastName','status','gender','phone','email','arrival','departure','events','plusOnes','kids','accommodation','travel','flight','food','message','createdAt','updatedAt'];
    const data=visits?((admData.visits.analytics||{}).recent||[]).map(r=>Object.assign({},r,{at:fmtTime(r.at)})):admData.rsvps;
    const csv=[cols.join(',')].concat(data.map(x=>cols.map(c=>cell(x[c])).join(','))).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'})),l=document.createElement('a');l.href=url;l.download=visits?'visits.csv':'rsvps.csv';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(url),4000)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#admin').hidden)closeAdmin()});


/* ----- Scroll: reveals, parallax, timeline drawing ----- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px',threshold:.12});
$$('[data-reveal]').forEach(el=>io.observe(el));
const hero=$('#hero'),heroArt=$('#hero-art'),heroCopy=$('#hero-copy'),tl=$('#tl'),items=$$('.tl-item'),nodes=items.map(i=>i.querySelector('.tl-node')),speeds=$$('[data-speed]');
let ticking=false,heroVisible=true;
function update(){ticking=false;const vh=innerHeight,y=scrollY;heroVisible=y<hero.offsetHeight;
  if(!reduce&&heroVisible){heroArt.style.transform=`translate3d(0,${(y*.38).toFixed(1)}px,0)`;heroCopy.style.transform=`translate3d(0,${(y*.16).toFixed(1)}px,0)`;heroCopy.style.opacity=Math.max(0,1-y/(vh*.7)).toFixed(3)}
  if(!reduce)speeds.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<-80||r.top>vh+80)return;el.style.transform=`translate3d(0,${((r.top+r.height/2-vh/2)*+el.dataset.speed).toFixed(1)}px,0) scale(1.14)`});
  const line=vh*.62,r=tl.getBoundingClientRect(),p=reduce?1:Math.min(1,Math.max(0,(line-r.top)/(r.height-30)));tl.style.setProperty('--p',p.toFixed(4));
  nodes.forEach((n,i)=>{const b=n.getBoundingClientRect();items[i].classList.toggle('lit',reduce||b.top+b.height/2<line)})}
const queue=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);update();

/* ----- Three.js: animated temple art + falling marigolds, jasmine & gold dust ----- */
let shower=null;
try{
  const T=THREE,art=$('#art');
  // Hero: original shader for swaying garlands, bells, light rays and glowing lamps
  const canvas=$('#scene'),renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=T.SRGBColorSpace;
  const scene=new T.Scene(),camera=new T.OrthographicCamera(-1,1,1,-1,0,1);let ready=false;
  const tex=new T.TextureLoader().load(art.src,()=>{ready=true;hero.classList.add('webgl')});tex.colorSpace=T.SRGBColorSpace;
  const uniforms={uImage:{value:tex},uTime:{value:0},uCover:{value:new T.Vector2(1,1)},uPointer:{value:new T.Vector2(0,0)}};
  const material=new T.ShaderMaterial({uniforms,depthWrite:false,depthTest:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`uniform sampler2D uImage;uniform float uTime;uniform vec2 uCover;uniform vec2 uPointer;varying vec2 vUv;void main(){vec2 uv=(vUv-.5)*uCover*.987+.5;uv+=uPointer*.002;float edge=smoothstep(.26,.45,abs(uv.x-.5));float sway=sin(uTime*.55+uv.y*8.)*.0016;uv.x+=sway*edge;float bells=exp(-pow((uv.y-.835)/.065,2.));uv.x+=sin(uTime*.72+uv.x*17.)*.0011*bells;vec4 c=texture2D(uImage,uv);float rays=pow(max(0.,sin((uv.x+uv.y*.22)*45.+sin(uTime*.2)*.35)),16.)*smoothstep(.2,.95,uv.y);c.rgb+=vec3(.045,.032,.008)*rays;vec2 f=vec2(abs(uv.x-.5)-.44,uv.y-.396);float glow=exp(-dot(f*vec2(26.,65.),f*vec2(26.,65.)));c.rgb+=vec3(.18,.08,.01)*glow*(.8+sin(uTime*8.)*.2);gl_FragColor=c;\n#include <colorspace_fragment>\n}`});
  const quad=new T.Mesh(new T.PlaneGeometry(2,2),material);quad.frustumCulled=false;scene.add(quad);
  const pointer={x:0,y:0};hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5});hero.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0});
  function sizeHero(){const w=hero.clientWidth,h=hero.clientHeight,a=w/h,ia=941/1672;renderer.setSize(w,h,false);uniforms.uCover.value.set(Math.min(1,a/ia),Math.min(1,ia/a))}

  // Overlay: petals, marigold heads and twinkling gold dust
  let fx=null;
  if(!reduce){
    const c2=$('#petals'),r2=new T.WebGLRenderer({canvas:c2,alpha:true,antialias:true,powerPreference:'low-power'});r2.setPixelRatio(Math.min(devicePixelRatio,1.5));r2.outputColorSpace=T.SRGBColorSpace;
    const s2=new T.Scene(),cam=new T.PerspectiveCamera(40,1,.1,20);cam.position.z=5;
    const wide=page.clientWidth>600,NP=0,NM=0,NS=wide?70:40;
    const shape=new T.Shape();shape.moveTo(0,-.6);shape.bezierCurveTo(-.6,-.2,-.55,.45,0,.5);shape.bezierCurveTo(.65,.3,.4,-.25,0,-.6);
    const petals=new T.InstancedMesh(new T.ShapeGeometry(shape,6),new T.MeshBasicMaterial({side:T.DoubleSide,transparent:true,opacity:.86,depthWrite:false}),NP);
    const palette=['#f08a1c','#f08a1c','#fcb415','#fcb415','#fffaf0','#fffaf0','#fffaf0','#b3122e'].map(c=>new T.Color(c));
    for(let i=0;i<NP;i++)petals.setColorAt(i,palette[i%palette.length]);petals.frustumCulled=false;s2.add(petals);
    const mc=document.createElement('canvas');mc.width=mc.height=128;const g=mc.getContext('2d');g.translate(64,64);
    [[60,22,'#c2410c','#f76707'],[50,20,'#e8590c','#ff922b'],[39,18,'#f76707','#ffa94d'],[28,15,'#f59f00','#ffd43b'],[17,11,'#fab005','#ffe066']].forEach(([r,n,c1,c3],k)=>{for(let i=0;i<n;i++){g.save();g.rotate(i/n*Math.PI*2+k*.4);const gr=g.createLinearGradient(0,0,r,0);gr.addColorStop(0,c3);gr.addColorStop(1,c1);g.fillStyle=gr;g.beginPath();g.ellipse(r*.56,0,r*.44,r*.17+3.5,0,0,Math.PI*2);g.fill();g.strokeStyle='rgba(110,35,0,.28)';g.lineWidth=1;g.stroke();g.restore()}});
    g.fillStyle='#d9480f';g.beginPath();g.arc(0,0,5,0,Math.PI*2);g.fill();
    const mtex=new T.CanvasTexture(mc);mtex.colorSpace=T.SRGBColorSpace;
    const heads=new T.InstancedMesh(new T.CircleGeometry(.5,28),new T.MeshBasicMaterial({map:mtex,transparent:true,opacity:.9,side:T.DoubleSide,depthWrite:false}),NM);heads.frustumCulled=false;s2.add(heads);
    const sp=new Float32Array(NS*3),ph=new Float32Array(NS);for(let i=0;i<NS;i++){sp[i*3]=(Math.random()-.5)*5;sp[i*3+1]=(Math.random()-.5)*4;sp[i*3+2]=Math.random()*2-1;ph[i]=Math.random()*6.28}
    const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(sp,3));sg.setAttribute('aPhase',new T.BufferAttribute(ph,1));
    const su={uTime:{value:0},uSize:{value:30*r2.getPixelRatio()}};
    const sparks=new T.Points(sg,new T.ShaderMaterial({uniforms:su,transparent:true,depthWrite:false,vertexShader:'attribute float aPhase;uniform float uTime;uniform float uSize;varying float vA;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vA=.15+.85*pow(.5+.5*sin(uTime*1.6+aPhase),4.);gl_PointSize=uSize*(.45+.55*vA)*(4./-mv.z);gl_Position=projectionMatrix*mv;}',fragmentShader:'varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float core=pow(max(0.,1.-d*2.),3.);float rays=max(0.,1.-abs(c.x)*16.)*max(0.,1.-abs(c.y)*2.2)+max(0.,1.-abs(c.y)*16.)*max(0.,1.-abs(c.x)*2.2);float a=clamp(core,0.,1.)*vA;gl_FragColor=vec4(mix(vec3(.93,.68,.22),vec3(1.,.97,.82),core),a);}'}));
    sparks.frustumCulled=false;s2.add(sparks);
    let halfW=1.6,halfH=1.8;
    const rnd=(a,b)=>a+Math.random()*(b-a),P=[],M=[];
    for(let i=0;i<NP;i++)P.push({x:rnd(-1,1),y:rnd(-1.1,1.1),z:rnd(-1.4,1),s:rnd(.04,.075),rx:rnd(0,6),ry:rnd(0,6),v:rnd(.12,.24),w:rnd(.4,1.1),k:rnd(0,6)});
    for(let i=0;i<NM;i++)M.push({x:rnd(-1,1),y:rnd(-1.1,1.1),z:rnd(-1.2,.6),s:rnd(.09,.14),r:rnd(0,6),t:rnd(-.5,.5),v:rnd(.14,.22),k:rnd(0,6)});
    const dummy=new T.Object3D();
    function sizeFx(){const w=page.clientWidth,h=innerHeight;r2.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();halfH=Math.tan(T.MathUtils.degToRad(20))*5;halfW=halfH*cam.aspect}
    shower=()=>{P.forEach(p=>{p.y=rnd(1,2.6)});M.forEach(m=>{m.y=rnd(1.1,2.4)})};
    fx={sizeFx,step(dt,clock){
      P.forEach((p,i)=>{if(dt){p.y-=dt*p.v;p.rx+=dt*p.w;p.ry+=dt*p.w*.7;if(p.y<-1.15){p.y=rnd(1.05,1.25);p.x=rnd(-1,1)}}
        dummy.position.set(p.x*halfW*1.15+Math.sin(clock*.7+p.k)*.12,p.y*halfH,p.z);dummy.rotation.set(p.rx,p.ry,p.rx*.6);dummy.scale.setScalar(p.s);dummy.updateMatrix();petals.setMatrixAt(i,dummy.matrix)});
      M.forEach((m,i)=>{if(dt){m.y-=dt*m.v;m.r+=dt*.5;if(m.y<-1.2){m.y=rnd(1.1,1.3);m.x=rnd(-1,1)}}
        dummy.position.set(m.x*halfW*1.1+Math.sin(clock*.5+m.k)*.15,m.y*halfH,m.z);dummy.rotation.set(Math.sin(clock*.8+m.k)*.5+m.t,Math.cos(clock*.6+m.k)*.4,m.r);dummy.scale.setScalar(m.s);dummy.updateMatrix();heads.setMatrixAt(i,dummy.matrix)});
      petals.instanceMatrix.needsUpdate=true;heads.instanceMatrix.needsUpdate=true;
      if(dt){for(let i=0;i<NS;i++){sp[i*3+1]+=dt*.06;if(sp[i*3+1]>halfH+.3){sp[i*3+1]=-halfH-.3;sp[i*3]=(Math.random()-.5)*2*halfW}}sg.attributes.position.needsUpdate=true}
      su.uTime.value=clock;r2.render(s2,cam)},
      init(){for(let i=0;i<NS;i++){sp[i*3]=(Math.random()-.5)*2*halfW;sp[i*3+1]=(Math.random()-.5)*2*halfH}sg.attributes.position.needsUpdate=true}};
    c2.addEventListener('webglcontextlost',e=>{e.preventDefault();fx=null;c2.style.display='none'});
    sizeFx();fx.init();
  }
  const resize=()=>{sizeHero();fx&&fx.sizeFx()};addEventListener('resize',resize);sizeHero();
  let clock=0,last=0,raf;
  function frame(now){raf=requestAnimationFrame(frame);const raw=Math.min(.05,(now-(last||now))/1e3);last=now;if(document.hidden)return;const dt=paused?0:raw;clock+=dt;
    if(ready&&heroVisible){uniforms.uTime.value=clock;uniforms.uPointer.value.lerp(new T.Vector2(reduce?0:pointer.x,reduce?0:pointer.y),.035);renderer.render(scene,camera)}
    if(fx&&(dt||!fx.drawn)){fx.step(dt,clock);fx.drawn=true}}
  requestAnimationFrame(frame);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;hero.classList.remove('webgl')});
}catch(err){console.warn('Invitation artwork remains available without WebGL.',err&&err.message)}
})();
