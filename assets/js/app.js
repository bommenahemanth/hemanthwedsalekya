
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
  photos:['photos/03.jpg','photos/04.webp','photos/06.webp','photos/05.webp','photos/02.webp'],
  // Set to true (and PHOTOS_OPEN=yes on the backend) to let guests share photos.
  photoDrop:false,
  music:{src:'music/pipa-says.m4a',credit:'Music: “What the Pipa Says” (琵琶語) by Lin Hai, © 2003 Wind Music International',link:'https://open.spotify.com/track/0XeklzlYWRCqgplYDVitZl'},
  events:[
    {id:'sangeet',short:'Sangeet',art:'cocktails',d:1,m:12,t:'18:00',hrs:4,icon:'music',accent:'#8e2453',title:'Sangeet / Cocktail Party',te:'సంగీత్',note:'An evening of music, dance and cheers. Come ready to celebrate!'},
    {id:'haldi',short:'Haldi',art:'haldi',d:2,m:12,t:'10:00',hrs:3,icon:'haldi',accent:'#e0a100',title:'Haldi',te:'హల్దీ · పసుపు',note:'Turmeric, laughter and a golden glow. Wear something yellow!'},
    {id:'muhurtham',short:'Wedding',art:'coconut',d:3,m:12,t:'09:47',hrs:3,icon:'mangalsutra',accent:'#c9a24a',main:true,title:'Marriage (Muhurtham)',te:'శుభ ముహూర్తం',note:'Jeelakarra–Bellam at the auspicious hour, as two families become one.'}
  ]
};
/* ===================================== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=document.documentElement,body=document.body,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
window.HX_SCHEDULE=Object.freeze({year:WEDDING.year,tz:WEDDING.tz,events:WEDDING.events.map(({id,d,m,t,hrs})=>({id,d,m,t,hrs}))});
// Themed replacements for the browser's confirm()/alert() boxes; both resolve when the guest answers.
function ask(msg,{title='Are you sure?',ok='OK',cancel='Cancel',info=false,notes=null}={}){const d=$('#ux-ask');if(!d||!d.showModal)return Promise.resolve(info||window.confirm(msg));$('#ux-ask-title').textContent=title;$('#ux-ask-msg').textContent=msg;$('#ux-ask-notes').hidden=!notes;$('#ux-ask-note').value='';$('#ux-ask-chips').innerHTML=(notes||[]).map(t=>`<button type="button">${esc(t)}</button>`).join('');$('#ux-ask-ok').textContent=ok;$('#ux-ask-cancel').textContent=cancel;$('#ux-ask-cancel').hidden=info;d.classList.toggle('info',info);d.returnValue='';d.showModal();$('#ux-ask-ok').focus();return new Promise(res=>d.addEventListener('close',()=>res(d.returnValue==='ok'),{once:true}))}
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
 $('#drive-line').textContent=WEDDING.airports.map(a=>`~${a.mins} min from ${a.code==='DAL'?'Love Field':a.code} Airport`).join(' · ')}

/* ----- Calendar ----- */
const utc=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
const summary=e=>`${e.title} · Hemanth & Alekya’s Wedding`,details=e=>`${e.note}\n\nWith love, Hemanth Bommena & Alekya Vemula`;
const gcal=e=>'https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:summary(e),dates:utc(startOf(e))+'/'+utc(endOf(e)),details:details(e),location:placeOf(e)});
const icsText=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([,;])/g,'\\$1');
const fold=l=>{const out=[];let cur='';for(const ch of l){if(new TextEncoder().encode(cur+ch).length>73){out.push(cur);cur=' '+ch}else cur+=ch}out.push(cur);return out.join('\r\n')};
const vevent=e=>['BEGIN:VEVENT',`UID:${e.id}-${WEDDING.year}@hemanth-alekya.wedding`,`DTSTAMP:${utc(new Date())}`,`DTSTART:${utc(startOf(e))}`,`DTEND:${utc(endOf(e))}`,`SUMMARY:${icsText(summary(e))}`,`DESCRIPTION:${icsText(details(e))}`,...(placeOf(e)?[`LOCATION:${icsText(placeOf(e))}`]:[]),'BEGIN:VALARM','ACTION:DISPLAY',`DESCRIPTION:${icsText('Tomorrow: '+e.title)}`,'TRIGGER:-P1D','END:VALARM','BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Reminder','TRIGGER:-PT2H','END:VALARM','END:VEVENT'];
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
 const who=()=>{const n=$('#rsvp-form').elements.fullName.value.replace(/\s+/g,' ').trim();return n||(rs.last?`${rs.last.firstName} ${rs.last.lastName}`:'')};
 const tone=p=>`--c1:${p.c1};--c2:${p.c2}`;
 $('#people').innerHTML=C.map((p,i)=>`<button type="button" class="person" style="${tone(p)}" data-i="${i}" aria-haspopup="dialog"><span class="medal" aria-hidden="true">${esc(p.name[0])}</span><b>${esc(p.name)}</b><small>${esc(p.role)}</small><span class="te" lang="te">${esc(p.te)}</span></button>`).join('');
 function openPerson(p){const n=who(),hi=`Hey ${p.name}! ${n?`It’s ${n} here. `:''}Quick question about the wedding: `;
   const groom=p.name==='Hemanth',phones=p.phones||[],usa=phones.find(ph=>ph.tag==='USA'||/^\+1/.test(ph.n))||phones[0],india=phones.find(ph=>ph.tag==='India'||/^\+91/.test(ph.n))||phones[0];
   const head=`<div class="ct-head ceremonial-head" style="${tone(p)}"><span class="medal lg" aria-hidden="true">${esc(p.name[0])}</span><p class="eyebrow">${esc(p.relation)}</p><h3 id="ct-name">${esc(p.name)}</h3><p class="te" lang="te">${esc(p.te)}</p></div>`;
   const routes=groom?`<div class="ct-routes" aria-label="Contact Hemanth"><a class="btn wa" href="https://wa.me/${india.n.replace(/\D/g,'')}?text=${e(hi)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Hemanth on his Indian number">${waSvg}<span>WhatsApp</span></a><a class="btn call" href="tel:${esc(usa.n)}" aria-label="Call Hemanth on his USA number">${phoneSvg}<span>Call</span></a><a class="btn imsg" href="sms:bommenahemanth@gmail.com" aria-label="iMessage Hemanth">${imsgSvg}<span>iMessage</span></a></div>`:
     phones.map(ph=>`<div class="ct-num"><div class="ct-acts"><a class="btn wa" href="https://wa.me/${ph.n.replace(/\D/g,'')}?text=${e(hi)}" target="_blank" rel="noopener noreferrer">${waSvg}<span>WhatsApp</span></a><a class="btn call" href="tel:${ph.n}">${phoneSvg}<span>Call</span></a>${ph.sms===false?'':`<a class="btn imsg" href="sms:${ph.n}?&body=${e(hi)}">${imsgSvg}<span>${apple?'iMessage':'Text'}</span></a>`}</div></div>`).join('');
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

/* ----- Visit analytics: no cookies. One record per tab session; a random ID kept in this browser tells repeat visits
   apart even when the network changes, and the backend stores only a salted hash of it plus coarse place. ----- */
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
  if(p.has('me'))try{localStorage.setItem('hx-owner','1')}catch{}
  if(src||p.has('me'))try{p.delete('src');p.delete('utm_source');p.delete('me');history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:'')+location.hash)}catch{}
  if(!WEDDING.apiUrl)return;
  // The couple's own devices (admin login or a ?me link) are left out of the visitor numbers.
  let vid='';try{if(localStorage.getItem('hx-owner'))return;vid=localStorage.getItem('hx-vid')||'';if(!vid){vid=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);localStorage.setItem('hx-vid',vid)}}catch{}
  try{VISIT.id=sessionStorage.getItem('hx-visit')||'';if(VISIT.id)return;VISIT.id=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);sessionStorage.setItem('hx-visit',VISIT.id)}catch{return}
  let ref='';try{ref=document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):''}catch{}
  const base={action:'visit',visitId:VISIT.id,vid,tz:Intl.DateTimeFormat().resolvedOptions().timeZone||'',lang:navigator.language||'',screen:`${screen.width}x${screen.height}`,viewport:`${innerWidth}x${innerHeight}`,
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
const CLICKS=[['.ux-qr-btn','qr'],['.ux-card-btn','card_download'],['.ux-share','share'],['#music',()=>musicOn?'music_off':'music_on'],
  ['[data-act=apple],#cal-ics','calendar_apple'],['[data-act=google],#cal-google','calendar_google'],['.g-all [data-g]','calendar_google_all'],['[data-g]','calendar_google_one'],['.date-btn','event_calendar'],
  ['#venue-link,a[href*="maps"],a[href^="geo:"]','map'],['.find-wa a','find_whatsapp'],['a[href*="wa.me"]','whatsapp'],['a[href^="tel:"]','call'],['a[href^="sms:"]','text'],['a[href^="mailto:"]','email'],
  ['.person',el=>'contact_'+((el.querySelector('b')||{}).textContent||'').toLowerCase().replace(/[^a-z]/g,'')],
  ['#find-top-open','find_open'],['#fab','rsvp_button'],['[data-act=withdraw]','rsvp_withdraw'],['[data-act=edit]','rsvp_edit'],
  ['.lb-nav','photo_next'],['.car-dots button','photo_dot'],['#carousel','photo_open'],
  ['.tl-item',el=>{const h=el.querySelector('h3[id^="ev-"]');return h?'event_'+h.id.slice(3):''}]];
document.addEventListener('click',e=>{for(const[sel,k]of CLICKS){const el=e.target.closest(sel);if(el){const key=typeof k==='function'?k(el):k;if(key)track(key);break}}},{capture:true,passive:true});
document.addEventListener('hx:rsvp',e=>{const st=(e.detail&&e.detail.status)||'sent';VISIT.rsvp=st;track('rsvp_sent');cl('set','rsvp',st);cl('upgrade','rsvp sent');endVisit()});
document.addEventListener('input',e=>{if(!VISIT.rsvp&&e.target.closest('#rsvp-form')){VISIT.rsvp='started';track('rsvp_start')}},{passive:true});
document.addEventListener('change',e=>{const t=e.target;if(t.name==='status'&&t.checked&&t.closest('#rsvp-form'))track('rsvp_'+t.value)},{passive:true});
document.addEventListener('click',e=>{if(e.target.closest('#rsvp-submit'))setTimeout(()=>{if($('#rsvp-form .invalid'))track('rsvp_error')},60)},{passive:true});
try{localStorage.removeItem('hx-vid')}catch{}

/* ----- RSVP form ----- */
// 1 Dec to the checkout morning; the indices match the backend's DAYS.
const RDAYS=(()=>{const out=[],s=Date.UTC(WEDDING.year,WEDDING.events[0].m-1,WEDDING.events[0].d),end=Date.UTC(WEDDING.year,muhurtham.m-1,muhurtham.d)+864e5;for(let t=s;t<=end;t+=864e5){const d=new Date(t);out.push({key:d.toISOString().slice(0,10),day:DAY[d.getUTCDay()].slice(0,3),label:`${d.getUTCDate()} ${MON[d.getUTCMonth()].slice(0,3)}`})}out[out.length-1].morning=true;return out})();
// Older RSVPs may hold 29/30 Nov; treat those as 1 Dec.
const dIdx=k=>k&&k<RDAYS[0].key?0:RDAYS.findIndex(d=>d.key===k);
const dayText=i=>`${RDAYS[i].day} ${RDAYS[i].label}${RDAYS[i].morning?' (morning)':''}`;
// The slider stops at the wedding day; its last stop means staying through it and checking out the next morning.
const FIRSTSTOP=RDAYS.findIndex(d=>d.key===`${WEDDING.year}-${pad(WEDDING.events[0].m)}-${pad(WEDDING.events[0].d)}`),LASTSTOP=RDAYS.length-2,dA=()=>+F.arrival.value,dB=()=>+F.departure.value===LASTSTOP?LASTSTOP+1:+F.departure.value;
const evDay=e=>RDAYS.findIndex(d=>d.key===`${WEDDING.year}-${pad(e.m)}-${pad(e.d)}`);
// Nothing is remembered between visits: a returning guest finds their RSVP by WhatsApp number.
const form=$('#rsvp-form'),F=form.elements,rs={plus:[],kids:0,mode:'new',saved:null,last:null};
const radioVal=(f,n)=>{const c=f.querySelector(`input[name="${n}"]:checked`);return c?c.value:''};
const setRadio=(f,n,v)=>f.querySelectorAll(`input[name="${n}"]`).forEach(i=>{i.checked=i.value===v;i.dataset.on=i.checked?'1':''});
document.addEventListener('click',e=>{const i=e.target.closest('[data-clearable] input[type=radio]');if(!i)return;if(i.dataset.on==='1'){i.checked=false;i.dataset.on='';i.dispatchEvent(new Event('change',{bubbles:true}))}else{i.closest('form').querySelectorAll(`input[name="${i.name}"]`).forEach(x=>x.dataset.on='');i.dataset.on='1'}});
$('#ticks').innerHTML=RDAYS.slice(FIRSTSTOP,LASTSTOP+1).map((d,i)=>`<span style="left:${i*100/(LASTSTOP-FIRSTSTOP)}%"><b>${esc(d.label.split(' ')[0])}</b>${esc(d.label.split(' ')[1])}</span>`).join('');
const inRange=(a,b)=>WEDDING.events.filter(e=>{const i=evDay(e);return i>=a&&i<=b});
// Events inside the chosen dates that the guest has skipped (e.g. only coming for the wedding).
const skip=new Set(),chosen=()=>inRange(dA(),dB()).filter(e=>!skip.has(e.id));
$('#ev-pick').innerHTML=WEDDING.events.map(e=>`<button type="button" data-ev="${e.id}"><img src="${(window.HX_CEREMONY_ART||{})[e.art]||''}" alt=""><span>${esc(e.short)}</span><small>${time12(e.t).replace(':00','')}</small><i aria-hidden="true"></i></button>`).join('');
$('#ev-pick').addEventListener('click',ev=>{const b=ev.target.closest('[data-ev]');if(!b)return;
  const ids=new Set(chosen().map(e=>e.id));
  if(ids.has(b.dataset.ev)){if(ids.size===1){shake(b);return}ids.delete(b.dataset.ev)}else ids.add(b.dataset.ev);
  const days=WEDDING.events.filter(e=>ids.has(e.id)).map(evDay),a=Math.min(...days),last=Math.max(...days);
  F.arrival.value=a;F.departure.value=a===last&&last<LASTSTOP?last+1:last;
  skip.clear();inRange(a,dB()).forEach(e=>{if(!ids.has(e.id))skip.add(e.id)});syncRange()});
function syncRange(){
  let a=+F.arrival.value,b=+F.departure.value;
  // Arriving on the wedding day itself is allowed; otherwise leaving is at least a day after arriving.
  if(a>b||(a===b&&b<LASTSTOP)){if(document.activeElement===F.departure)b=Math.min(LASTSTOP,a+1),a=Math.min(a,b-(b<LASTSTOP?1:0));else a=Math.max(FIRSTSTOP,b===LASTSTOP?b:b-1)}
  a=Math.max(FIRSTSTOP,a);b=Math.max(FIRSTSTOP+1,b);
  F.arrival.value=a;F.departure.value=b;const span=LASTSTOP-FIRSTSTOP;$('#range').style.setProperty('--pa',(a-FIRSTSTOP)/span*100+'%');$('#range').style.setProperty('--pb',(LASTSTOP-b)/span*100+'%');F.arrival.style.zIndex=a>=LASTSTOP-1?3:1;
  const nights=dB()-a;$('#range-out').textContent=a===b?`${dayText(a)} · the wedding day`:`${dayText(a)} → ${dayText(b)} · ${nights} night${nights>1?'s':''}`;
  $('#day-tips').textContent=dayTips(a,dB());
  const sel=chosen();$$('#ev-pick [data-ev]').forEach(x=>x.setAttribute('aria-pressed',sel.some(e=>e.id===x.dataset.ev)));
  partyText()}
function dayTips(a,b){
  const t=[];
  if(a===FIRSTSTOP)t.push('Flying in on 1 Dec? Try to reach Dallas by 3 PM.');
  if(b<LASTSTOP)t.push('The wedding is Thu 3 Dec at 9:47 AM.');
  else if(a===LASTSTOP)t.push('The Muhurtham is at 9:47 AM, so please come by 8 AM.');
  else if(b===LASTSTOP+1)t.push('Checkout Fri, 4 Dec at 10 AM from the Airbnb.');
  return t.join('\n')}
function setCollapse(el,open){el.classList.toggle('open',open);el.firstElementChild.inert=!open}
F.arrival.addEventListener('input',()=>{skip.clear();syncRange()});F.departure.addEventListener('input',()=>{skip.clear();syncRange()});
form.querySelectorAll('[data-stepper]').forEach(s=>s.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=+b.dataset.d;
  if(s.dataset.stepper==='plus'){const n=Math.max(0,Math.min(10,rs.plus.length+d));if(n===rs.plus.length)return;while(rs.plus.length<n)rs.plus.push({name:'',gender:''});rs.plus.length=n}else{const k=Math.max(0,Math.min(10,rs.kids+d));if(k===rs.kids)return;rs.kids=k}
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
  moreEvents:['Adding more events, can’t wait to join!','I’ll be at more of the celebrations now!','Plans opened up, see you at more events!'],
  fewerEvents:['Sorry, I’ll miss a few events, but see you at the rest!','Plans changed a bit, I can only make some of the events.','Will miss part of it, but can’t wait to see you!'],
  withdraw:['Sorry, last-minute change of plans. Sending you both love and blessings!','Something came up and I can’t make it. Wishing you a beautiful wedding!','So sorry to miss it. Congratulations, will celebrate with you soon!'],
  edit:['Small change in plans, all updated now.','Just updating my details, see you soon!','Updated my RSVP, can’t wait!']
};
function msgSituation(){const st=radioVal(form,'status'),o=rs.last;
  if(rs.mode!=='edit'||!o)return MSGS[st]?st:'';
  if(st&&st!==o.status)return st==='no'?'nowNo':st==='maybe'?'nowMaybe':'nowYes';
  if(st==='no')return 'no';
  const oa=dIdx(o.arrival),od=dIdx(o.departure),a=dA(),b=dB();
  if(oa>=0&&od>=0&&(a!==oa||b!==od))return b-a>od-oa?'longer':b-a<od-oa?'shorter':'moved';
  const oe=o.events||[],ne=chosen().map(e=>e.id);if(oe.length&&oe.slice().sort().join()!==ne.slice().sort().join())return ne.length>=oe.length?'moreEvents':'fewerEvents';
  const was=1+(o.plusOnes||[]).length+(+o.kids||0),now=1+rs.plus.length+rs.kids;if(now!==was)return now>was?'more':'fewer';
  if(!!o.accommodation!==F.accommodation.checked)return F.accommodation.checked?'stay':'noStay';
  return 'edit'}
function msgChips(){const k=msgSituation(),box=$('#msg-chips');setCollapse($('#msg-wrap'),!!k);if(box.dataset.k===k)return;box.dataset.k=k;
  box.innerHTML=(MSGS[k]||[]).map(t=>`<button type="button"${F.message.value===t?' class="on"':''}>${esc(t)}</button>`).join('')}
const nameCase=s=>s.toLowerCase().replace(/(^|[\s\-'’.])(\p{L})/gu,(m,p,c)=>p+c.toUpperCase());
form.addEventListener('focusout',e=>{const t=e.target;if(!t.matches('[name=fullName]'))return;
  const v=nameCase(t.value.replace(/\s+/g,' ').trim());if(v!==t.value)t.value=v});
function partyText(){const adults=1+rs.plus.length,n=adults+rs.kids;$('#party').textContent=`Your party: ${n} ${n>1?'people':'person'} (${adults} adult${adults>1?'s':''}${rs.kids?`, ${rs.kids} kid${rs.kids>1?'s':''}`:''})`;
  setCollapse($('#stay-wrap'),F.accommodation.checked);if(F.accommodation.checked){const s=dA(),nights=Math.max(0,dB()-s);$('#stay-hint').textContent=nights?`${nights} night${nights>1?'s':''} from ${dayText(s)} · ${n} ${n>1?'people':'person'}`:'No stay needed for these dates'}msgChips()}
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
// One name box: the first word is the first name, the rest the last name.
const splitName=v=>{const w=nameCase(String(v||'').replace(/\s+/g,' ').trim()).split(' ').filter(Boolean);return{first:w[0]||'',last:w.slice(1).join(' ')}};
function collect(){const a=dA(),b=dB(),nm=splitName(F.fullName.value);return{firstName:nm.first,lastName:nm.last,gender:radioVal(form,'gender'),phone:phoneOf(F),status:radioVal(form,'status'),arrival:a,departure:b,events:chosen().map(e=>e.id),plusOnes:rs.plus.map(p=>({name:p.name.trim(),gender:p.gender})),kids:rs.kids,accommodation:F.accommodation.checked,message:F.message.value.trim()}}
function fill(r){
  F.fullName.value=[r.firstName,r.lastName].filter(Boolean).join(' ');F.message.value=r.message||'';
  const ph=typeof r.phone==='string'?r.phone:'';rs.masked=ph.includes('•');
  if(rs.masked){const cc=ph.startsWith('+91')?'+91':ph.startsWith('+1')?'+1':'';setCc(F,cc);F.phone.value='';F.phone.placeholder=`Keep ${ph.replace(/^\+\d*\s*/,'')}, or type a new one`}
  else if(ph){const cc=ph.startsWith('+91')?'+91':ph.startsWith('+1')?'+1':'';setCc(F,cc);F.phone.value=cc?ph.slice(cc.length):ph}else if(r.phone&&r.phone.number!==undefined){setCc(F,r.phone.cc||'+1');F.phone.value=r.phone.number}
  ['gender','status'].forEach(n=>setRadio(form,n,r[n]||''));
  const ai=typeof r.arrival==='number'?r.arrival:dIdx(r.arrival),di=typeof r.departure==='number'?r.departure:dIdx(r.departure);
  F.arrival.value=ai>=0?Math.max(FIRSTSTOP,Math.min(ai,LASTSTOP)):FIRSTSTOP;F.departure.value=di>0?Math.max(FIRSTSTOP+1,Math.min(di,LASTSTOP)):LASTSTOP;
  skip.clear();if(r.events&&r.events.length)inRange(dA(),dB()).forEach(e=>{if(!r.events.includes(e.id))skip.add(e.id)});syncRange();
  rs.plus=(r.plusOnes||[]).map(p=>({name:p.name||'',gender:p.gender||''}));rs.kids=+r.kids||0;steppers();
  F.accommodation.checked=!!r.accommodation;showGoing();partyText()}

function clientErrors(d){const e={};if(!d.firstName)e.name='Please enter your name';
  const pe=phoneError(d.phone,rs.mode==='edit'&&rs.masked);if(pe)e.phone=pe;
  if(!d.status)e.status='Please choose one';return e}
const MSG={firstName:'Please enter your first name',lastName:'Please enter your last name',phone:'Please enter a valid WhatsApp number',email:'That email doesn’t look right',status:'Please choose one',events:'Pick at least one event',days:'Please choose your dates',kids:'Please check the number of kids',plusOnes:'Up to 10 plus-ones'};
function showErrors(errs){form.querySelectorAll('[data-err]').forEach(el=>{const k=el.dataset.err,m=errs[k];el.classList.toggle('invalid',!!m);const er=el.querySelector(':scope > .err')||el.querySelector('.err');if(er)er.textContent=m?(typeof m==='string'&&m.length>12?m:MSG[k]||'Please check this'):''});
  const firstBad=form.querySelector('.invalid');if(firstBad){firstBad.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});const inp=firstBad.querySelector('input,select');if(inp)inp.focus({preventScroll:true})}}
const errText=e=>e&&e.code==='not_configured'?'RSVPs open very soon. Please try again later or message us on WhatsApp.':'We couldn’t reach the server. Your answers are still filled in, so please check your connection and try again.';
// Server calls take a few seconds: the button spins and shows what is happening, then a green tick on success.
function busyBtn(btn,steps){const html=btn.innerHTML;let k=0;btn.disabled=true;btn.classList.remove('ok');btn.classList.add('busy');
  btn.innerHTML=`<i class="bspin" aria-hidden="true"></i><span class="btxt in" role="status">${esc(steps[0])}</span>`;
  const t=setInterval(()=>{if(++k>=steps.length){clearInterval(t);return}const x=btn.querySelector('.btxt');if(x){x.classList.remove('in');void x.offsetWidth;x.textContent=steps[k];x.classList.add('in')}},1400);
  return{async ok(msg){clearInterval(t);btn.classList.add('ok');btn.innerHTML=`<i class="bok" aria-hidden="true">✓</i><span class="btxt in" role="status">${esc(msg)}</span>`;await new Promise(r=>setTimeout(r,reduce?0:650))},
    end(label){clearInterval(t);btn.classList.remove('busy','ok');if(label)btn.textContent=label;else btn.innerHTML=html;btn.disabled=false}}}
const shake=el=>{el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')};
form.addEventListener('submit',async ev=>{ev.preventDefault();$('#form-error').textContent='';
  const d=collect(),errs=clientErrors(d);showErrors(errs);if(Object.keys(errs).length)return;
  const editing=rs.mode==='edit',going=d.status==='yes'||d.status==='maybe';rs.sit=editing?msgSituation():d.status;
  const bb=busyBtn($('#rsvp-submit'),editing?['Updating your RSVP…','Saving your changes…','Letting Hemanth & Alekya know…','Almost done…']:['Sending your RSVP…',going?'Saving your dates…':'Saving your reply…','Letting Hemanth & Alekya know…','Almost done…']);
  form.classList.add('sending');
  try{
    let r=rs.mode==='edit'&&rs.saved?await api({action:'update',id:rs.saved.id,secret:rs.saved.secret,rsvp:d}):await api({action:'create',rsvp:d});
    if(!r.ok&&r.error==='exists'&&rs.mode!=='edit'){const f=await api({action:'find',phone:d.phone,firstName:d.firstName});
      if(f.ok){rs.saved={id:f.id,secret:f.secret};r=await api({action:'update',id:f.id,secret:f.secret,rsvp:d})}
      else{$('#form-error').textContent='This WhatsApp number already has an RSVP under a different first name. Use “Find my RSVP” below, or message us.';return}}
    if(r.ok){if(r.id)rs.saved={id:r.id,secret:r.secret};await bb.ok(editing?'Updated':'Sent');showDone(r.rsvp,true);return}
    if(r.error==='invalid'){const fl=Object.assign({},r.fields||{});if(fl.firstName||fl.lastName){fl.name='Please enter your name';delete fl.firstName;delete fl.lastName}showErrors(fl);$('#form-error').textContent='Please check the highlighted fields.';return}
    if(r.error==='not_found'){rs.saved=null;rs.mode='new';$('#form-error').textContent='We couldn’t find your earlier RSVP. Please send it again.';return}
    $('#form-error').textContent=r.error==='rate_limited'?'Too many attempts. Please wait a few minutes and try again.':'Something went wrong. Please try again.'
  }catch(e){$('#form-error').textContent=errText(e)}
  finally{form.classList.remove('sending');bb.end(rs.mode==='edit'?'Update RSVP':'Send RSVP');if($('#form-error').textContent)shake($('#form-error'))}});
// A warm, ready-to-send WhatsApp note to Hemanth that fits what the guest just did.
function heyHemanth(k,r,n,dates,mine){const name=r.firstName||'me',evs=mine.map(e=>e.short).join(mine.length>2?', ':' and ').replace(/, ([^,]*)$/,' and $1')||'the wedding',party=`party of ${n}`;
  const T={
    yes:`Hey Hemanth! 🎉 It’s ${name}, and we’re coming! ${n>1?`We’re a ${party}, `:''}see you at ${evs}. Can’t wait to celebrate you and Alekya!`,
    maybe:`Hey Hemanth! It’s ${name} 🤞 Trying my very best to make it, so I’ve said tentative for now. Will confirm soon!`,
    no:`Hey Hemanth, it’s ${name}. So sorry I can’t make it 😔 Sending you and Alekya loads of love and blessings!`,
    withdrawn:`Hey Hemanth, it’s ${name}. Plans changed last minute and I had to withdraw my RSVP 😞 Really sorry! Wishing you both a beautiful wedding.`,
    nowYes:`Hey Hemanth! Plans worked out, I’m coming after all! 🎉 ${n>1?`We’re a ${party}. `:''}See you there!`,
    nowMaybe:`Hey Hemanth, it’s ${name}. Things got a little uncertain 🤞 I’ve switched to tentative and will confirm soon!`,
    nowNo:`Hey Hemanth, it’s ${name}. Really sorry, my plans changed and I can’t make it anymore 😔 Sending you both lots of love!`,
    longer:`Hey Hemanth! Good news, I’m staying longer 🎊 Now ${dates}. More time to celebrate!`,
    shorter:`Hey Hemanth, quick heads-up: I had to shorten my trip, now ${dates}. Still can’t wait to see you!`,
    moved:`Hey Hemanth! My travel dates moved a little, now ${dates}. All updated on the RSVP 👍`,
    more:`Hey Hemanth! Our gang just got bigger 😄 We’re now a ${party}. Hope that’s okay!`,
    fewer:`Hey Hemanth, small change: we’re now a ${party}. Still super excited!`,
    moreEvents:`Hey Hemanth! I’m joining more of the fun ✨ See you at ${evs}!`,
    fewerEvents:`Hey Hemanth, heads-up: I’ll miss a couple of events, but I’ll be there for ${evs}!`,
    stay:`Hey Hemanth! Turns out we’ll need a place to stay 🛏️ I’ve updated the RSVP.`,
    noStay:`Hey Hemanth! We’ve sorted our own stay, so no room needed for us 😊`,
    edit:`Hey Hemanth! Just tweaked a few details on my RSVP. See you soon! 🎉`};
  return T[k]||T[r.status]||T.edit}
function showDone(r,justSent){rs.last=r;rs.mode='view';const done=$('#rsvp-done'),st=r.status,going=st==='yes'||st==='maybe';
  const title={yes:`See you there, ${r.firstName}!`,maybe:`Thank you, ${r.firstName}`,no:`We’ll miss you, ${r.firstName}`,withdrawn:'Your RSVP is withdrawn'}[st];
  const lead={yes:'We can’t wait to celebrate with you.',maybe:'Please confirm when you can. You can update this any time.',no:'Thank you for letting us know. Your blessings mean the world to us.',withdrawn:'Changed your mind? You can RSVP again below.'}[st];
  const ai=dIdx(r.arrival),di=dIdx(r.departure),party=1+(r.plusOnes||[]).length+(+r.kids||0);
  const mine=going?WEDDING.events.filter(e=>(r.events||[]).includes(e.id)):[];
  const rows=[['RSVP',{yes:'Attending',maybe:'Tentative',no:'Can’t come',withdrawn:'Withdrawn'}[st]]].concat(going?[['Dates',ai>=0&&di>=0?`${dayText(ai)} → ${dayText(di)}`:''],['Party',`${party} ${party>1?'people':'person'}`],['Stay',r.accommodation?'Needed':'Not needed']]:[]);
  const wa=`https://wa.me/${WEDDING.contact.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(heyHemanth(rs.sit||st,r,party,ai>=0&&di>=0?`${dayText(ai)} → ${dayText(di)}`:'',mine))}`;rs.sit='';
  const cal=mine.length?`<div class="cal-box"><span class="lbl">Add ${mine.length>1?`your ${mine.length} events`:'it'} to your calendar</span><div class="cal-btns"><button class="btn solid" type="button" data-act="apple">${calSvg}Apple</button><button class="btn" type="button" data-act="google">${calSvg}Google</button></div><div class="collapse" id="g-wrap"><div><ul class="g-list">${mine.length>1?`<li class="g-all"><span>All ${mine.length} events at once<small>One tap adds a “Hemanth & Alekya’s Wedding” calendar</small></span><a href="${esc(gcalAll(mine))}" target="_blank" rel="noopener noreferrer" data-g>Add all</a></li>`:''}${mine.map(e=>`<li><span>${esc(e.title)}<small>${weekday(e).slice(0,3)} ${e.d} ${MON[e.m-1].slice(0,3)} · ${time12(e.t)}</small></span><a href="${esc(gcal(e))}" target="_blank" rel="noopener noreferrer" data-g>Add</a></li>`).join('')}</ul></div></div></div>`:'';
  done.className='rsvp-card done '+st;
  done.innerHTML=`<div class="tick" aria-hidden="true">${{yes:'✓',maybe:'<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M6.5 3h11M6.5 21h11M8 3c0 5 3.6 6.2 3.6 9S8 16 8 21M16 3c0 5-3.6 6.2-3.6 9S16 16 16 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9.6 6.5h4.8L12 10z M8.9 20h6.2L12 16.6z" fill="currentColor"/></svg>',no:'♡',withdrawn:'↺'}[st]}</div><h3>${esc(title)}</h3><p>${esc(lead)}</p><dl>${rows.filter(x=>x[1]).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>${cal}<div class="acts"><button class="btn solid" type="button" data-act="edit">${st==='withdrawn'?'RSVP again':'Change in plans? Update'}</button><a class="btn wa" style="background:linear-gradient(#1f8f4e,#13703a);color:#fff;border-color:#0f5c30" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">${waSvg}Tell Hemanth on WhatsApp</a>${st!=='withdrawn'?'<button class="btn ghost" type="button" data-act="withdraw">Withdraw my RSVP</button>':''}</div>`;
  if(mine.length)setCollapse($('#g-wrap'),false);
  done.hidden=false;form.hidden=true;exitEdit();if(justSent){document.dispatchEvent(new CustomEvent('hx:rsvp',{detail:{status:st}}));done.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'})}}
function enterEdit(r){fill(r.status==='withdrawn'?Object.assign({},r,{status:''}):r);rs.mode='edit';$('#edit-name').textContent=r.firstName;setCollapse($('#find-top'),false);setCollapse($('#edit-banner'),true);msgChips();$('#rsvp-submit').textContent='Update RSVP';$('#rsvp-done').hidden=true;form.hidden=false;form.classList.add('in');form.scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'})}
function exitEdit(){setCollapse($('#find-top'),true);setCollapse($('#edit-banner'),false);$('#rsvp-submit').textContent='Send RSVP';F.phone.placeholder='To update your RSVP later';msgChips()}
$('#edit-cancel').onclick=()=>{if(rs.last)showDone(rs.last);else{rs.mode='new';exitEdit()}};
$('#ux-ask-chips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#ux-ask-chips .on').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('#ux-ask-note').value=b.textContent});
$('#msg-chips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$('#msg-chips').querySelectorAll('.on').forEach(x=>x.classList.remove('on'));b.classList.add('on');F.message.value=b.textContent});
$('#rsvp-done').addEventListener('click',async e=>{const g=e.target.closest('[data-g]');if(g){setTimeout(()=>{g.textContent='Added ✓';g.classList.add('added')},400);return}
  const b=e.target.closest('[data-act]');if(!b)return;const r=rs.last;
  if(b.dataset.act==='edit')enterEdit(r);
  if(b.dataset.act==='apple')location.href=calFile(WEDDING.events.filter(ev=>(r.events||[]).includes(ev.id)));
  if(b.dataset.act==='google'){const mine=WEDDING.events.filter(ev=>(r.events||[]).includes(ev.id));if(mine.length===1)window.open(gcal(mine[0]),'_blank','noopener');else{const w=$('#g-wrap');setCollapse(w,!w.classList.contains('open'))}}
  if(b.dataset.act==='withdraw'&&await ask('You can RSVP again any time if your plans change.',{title:'Withdraw your RSVP?',ok:'Yes, withdraw',cancel:'Keep my RSVP',notes:MSGS.withdraw})){const note=$('#ux-ask-note').value.trim(),bb=busyBtn(b,['Withdrawing…','Updating the guest list…','Almost done…']);try{const x=await api({action:'withdraw',id:rs.saved.id,secret:rs.saved.secret,message:note});if(x.ok){await bb.ok('Withdrawn');rs.sit='withdrawn';showDone(x.rsvp);return}tell('Could not withdraw. Please try again.')}catch(err){tell(errText(err))}bb.end()}});
const findForm=$('#find-form');
function openFind(){const f=findForm;f.cc.value=F.cc.value;f.ccx.value=F.ccx.value;ccSync(f);f.phone.value=F.phone.value;$('#find-error').textContent='';$('#find-help').hidden=true;$('#find').showModal()}
$('#find-top-open').onclick=openFind;
findForm.addEventListener('submit',async e=>{e.preventDefault();const f=findForm,er=$('#find-error');er.textContent='';$('#find-help').hidden=true;
  const pe=phoneError(phoneOf(f),false);if(pe){er.textContent=pe;return}
  const bb=busyBtn(f.querySelector('[type=submit]'),['Looking up your number…','Finding your RSVP…','Almost there…']);f.classList.add('sending');
  try{const r=await api({action:'find',phone:phoneOf(f)});track(r.ok?'find_ok':'find_fail');
    if(r.ok){rs.saved={id:r.id,secret:r.secret};rs.last=r.rsvp;await bb.ok(`Found ${nameCase(r.rsvp.firstName||'it')}`);$('#find').close();enterEdit(r.rsvp)}
    else{er.textContent=r.error==='rate_limited'?'Too many attempts. Please wait a few minutes.':'We couldn’t find that number. Check it, or message Hemanth below.';if(r.error!=='rate_limited')findHelp(f);shake(f.querySelector('.phone'))}}
  catch(err){er.textContent=errText(err);shake(f.querySelector('.phone'))}finally{f.classList.remove('sending');bb.end()}});
// Ready-to-send WhatsApp notes to Hemanth (his Indian number has WhatsApp), most likely one first.
function findHelp(f){const p=phoneOf(f),digits=String(p.number).replace(/\D/g,''),name=nameCase(F.fullName.value.replace(/\s+/g,' ').trim());
  const me=`Hey Hemanth! ${name?`It’s ${name}. `:''}I couldn’t find my RSVP on the website${digits?` with my number ${p.cc?p.cc+' ':''}${digits}`:''}.`;
  const opts=[['no','I can’t make it',`${me} Sadly I won’t be able to make it to the wedding. Sending love and blessings to you and Alekya! 🙏`],['change','My plans changed',`${me} My plans have changed and I’d like to update my RSVP: `],['help','Please help me find it',`${me} I’m still coming! Could you please help me find or update it? 🙏`]];
  if(radioVal(form,'status')!=='no')opts.push(opts.shift());
  $('#find-wa').innerHTML=opts.map(([,l,t])=>`<a href="https://wa.me/${WEDDING.contact.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(t)}" target="_blank" rel="noopener noreferrer">${waSvg}<span>${esc(l)}</span></a>`).join('');
  $('#find-help').hidden=false}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#fab').onclick=()=>$('#rsvp').scrollIntoView({behavior:reduce?'auto':'smooth'});
new IntersectionObserver(es=>es.forEach(e=>$('#fab').classList.toggle('away',e.isIntersecting)),{threshold:.05}).observe($('#rsvp'));
new IntersectionObserver(es=>es.forEach(e=>body.classList.toggle('form-focused',e.isIntersecting)),{threshold:.08}).observe($('#rsvp'));
exitEdit();syncRange();steppers();showGoing();store.del('hx-rsvp');store.del('hx-draft');

/* ----- Countdown, the wedding-week "Today" bar and evening diyas. ?now=2026-12-02T19:00 previews another moment. ----- */
const NOW=(()=>{const q=new URLSearchParams(location.search).get('now'),t=q?Date.parse(q+(/[zZ]|[+-]\d\d:?\d\d$/.test(q)?'':WEDDING.tz)):NaN,skew=isNaN(t)?0:t-Date.now();return()=>Date.now()+skew})();
const ctDate=t=>new Date(t).toLocaleDateString('en-CA',{timeZone:'America/Chicago'}),ctHour=t=>+new Date(t).toLocaleString('en-US',{timeZone:'America/Chicago',hour:'numeric',hourCycle:'h23'});
let cdPrev=[];
function tickCountdown(){const cd=$('#countdown');if(!cd)return;const now=NOW(),s=+startOf(muhurtham),e=+endOf(muhurtham);
  if(now>=e){cd.innerHTML=`<span class="cd-done">Married on ${muhurtham.d} ${MON[muhurtham.m-1]} ${WEDDING.year} 🙏</span>`;return}
  if(now>=s){cd.innerHTML='<span class="cd-done">The Muhurtham is happening now 🪔</span>';return}
  const left=Math.floor((s-now)/1e3),vals=[Math.floor(left/86400),Math.floor(left%86400/3600),Math.floor(left%3600/60),left%60],units=['day','hr','min','sec'];
  cd.innerHTML=vals.map((n,i)=>`<span class="cd-u"><b class="${cdPrev.length&&cdPrev[i]!==n?'flip':''}">${i?String(n).padStart(2,'0'):n}</b><small>${units[i]}${n===1?'':'s'}</small></span>`).join('<i aria-hidden="true">:</i>');
  cd.setAttribute('aria-label',`${vals[0]} days, ${vals[1]} hours and ${vals[2]} minutes to the Muhurtham`);cdPrev=vals}
let todayShut=false;
function tickToday(){const bar=$('#today-bar'),now=NOW(),day=ctDate(now),evDays=new Set(WEDDING.events.map(e=>ctDate(startOf(e))));
  body.classList.toggle('diya-night',evDays.has(day)&&ctHour(now)>=18);
  const list=WEDDING.events.filter(e=>ctDate(startOf(e))===day&&+endOf(e)>now);
  if(!list.length||todayShut||!body.classList.contains('opened')){bar.hidden=true;return}
  const e=list[0],live=now>=+startOf(e),wa=`https://wa.me/${WEDDING.contact.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Hey Hemanth! On my way to the ${e.title} 🚗 See you soon!`)}`;
  bar.style.setProperty('--accent',e.accent);
  bar.innerHTML=`<span class="tb-ic" aria-hidden="true"><svg viewBox="0 0 48 48">${ICONS[e.icon]||''}</svg></span><span class="tb-t"><small>${live?'Happening now':'Today'}${list.length>1?` · ${list.length-1} more later`:''}</small><b>${esc(e.title)}</b><span>${time12(e.t)} · ${esc(WEDDING.venue.short||WEDDING.venue.name)}</span></span><a class="tb-b" href="${esc(mapHref(mapQuery(e)))}" target="_blank" rel="noopener noreferrer" aria-label="Directions">${mapSvg}</a><a class="tb-b wa" href="${esc(wa)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Hemanth">${waSvg}</a><button type="button" class="tb-x" aria-label="Hide">✕</button>`;
  if(bar.hidden){bar.hidden=false;bar.classList.remove('in');void bar.offsetWidth;bar.classList.add('in')}}
$('#today-bar').addEventListener('click',e=>{if(e.target.closest('.tb-x')){todayShut=true;$('#today-bar').hidden=true}});
tickCountdown();tickToday();setInterval(tickCountdown,1e3);setInterval(tickToday,15e3);
document.addEventListener('hx:opening-complete',()=>setTimeout(tickToday,1200));

/* ----- Guest photos: off until WEDDING.photoDrop is true (and the backend has PHOTOS_OPEN=yes) ----- */
const thumb=(id,w)=>`https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${w}`;
const photoTile=(p,fresh,src)=>`<a class="pd-tile${fresh?' fresh':''}" href="https://drive.google.com/file/d/${encodeURIComponent(p.fileId)}/view" target="_blank" rel="noopener noreferrer"><img src="${esc(src||thumb(p.fileId,600))}" alt="Photo shared by ${esc(p.name)}" loading="lazy" decoding="async"><span>${esc(p.name)}</span></a>`;
async function loadPhotos(){try{const r=await api({action:'photos'});if(!r.ok||(!r.open&&!r.photos.length))return;
  $('#share-photos').hidden=false;$('#pd-up').hidden=!r.open;$('#pd-grid').innerHTML=r.photos.map(p=>photoTile(p)).join('')||'<p class="wall-empty">No photos yet. Be the first!</p>'}catch{}}
// Photos are shrunk to 1600px JPEGs in the browser so they upload quickly from phones.
function shrink(file){return new Promise((res,rej)=>{const url=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{const k=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight)),w=Math.round(im.naturalWidth*k),h=Math.round(im.naturalHeight*k),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);URL.revokeObjectURL(url);const jpg=c.toDataURL('image/jpeg',.82);res({data:jpg.split(',')[1],w,h,preview:jpg})};
  im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('bad'))};im.src=url})}
$('#pd-file').addEventListener('change',async e=>{const files=[...e.target.files].slice(0,20),er=$('#pd-error'),name=$('#pd-name').value.trim();e.target.value='';er.textContent='';if(!files.length)return;
  if(!name){er.textContent='Please add your name first';$('#pd-name').focus();shake(er);return}
  const prog=$('#pd-progress');let ok=0;
  for(const f of files){const li=document.createElement('li');li.innerHTML=`<i class="bspin" aria-hidden="true"></i><b>${esc(f.name)}</b><em>Preparing…</em>`;prog.append(li);
    try{const s=await shrink(f);li.querySelector('em').textContent='Uploading…';const r=await api({action:'photo',name,data:s.data,w:s.w,h:s.h});if(!r.ok)throw new Error(r.error);
      li.classList.add('done');li.querySelector('em').textContent='Shared ✓';ok++;$('#pd-grid .wall-empty')?.remove();$('#pd-grid').insertAdjacentHTML('afterbegin',photoTile(r.photo,true,s.preview))}
    catch(err){li.classList.add('bad');li.querySelector('em').textContent=err.message==='closed'?'Photo sharing isn’t open yet':'Couldn’t upload, please try again'}
    setTimeout(()=>{li.classList.add('out');setTimeout(()=>li.remove(),400)},3500)}
  if(ok)track('photo_upload')});
if(WEDDING.photoDrop)document.addEventListener('hx:opening-complete',()=>setTimeout(loadPhotos,1500),{once:true});

/* ----- Hidden admin dashboard: tap the temples at the bottom 3 times ----- */
let taps=[],admPw='',admData=null;
$('#admin-tap').addEventListener('click',()=>{const now=Date.now();taps=taps.filter(t=>now-t<1200).concat(now);if(taps.length>=3){taps=[];$('#adm-error').textContent='';$('#adm-form').pw.value='';$('#adm-login').showModal()}});
$('#adm-form').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,pw=f.pw.value,er=$('#adm-error'),btn=f.querySelector('[type=submit]'),lt=$('#adm-load-t');if(!pw){f.pw.focus();return}
  er.textContent='';btn.disabled=true;f.classList.remove('shake','done');f.classList.add('busy');lt.textContent='Checking password…';
  // The backend takes a few seconds, so the steps it is working through are shown meanwhile.
  const steps=[[900,'Gathering RSVPs…'],[2200,'Counting visitors…'],[3800,'Drawing the charts…'],[6000,'Almost there…']].map(([ms,t])=>setTimeout(()=>{lt.textContent=t},ms));
  try{const r=await api({action:'admin',password:pw});steps.forEach(clearTimeout);
    if(r.ok){try{localStorage.setItem('hx-owner','1')}catch{}admPw=pw;admData=tidyAdm(r);admSig=admSigOf(r);lt.textContent='Welcome back';f.classList.add('done');await new Promise(res=>setTimeout(res,450));$('#adm-login').close();renderAdmin();openAdmin()}
    else{er.textContent='Incorrect password.';f.classList.add('shake')}}
  catch(err){console.error(err);steps.forEach(clearTimeout);er.textContent=err.code==='not_configured'?'Connect the RSVP backend first (apiUrl).':'Could not reach the server.';f.classList.add('shake')}
  finally{btn.disabled=false;f.classList.remove('busy','done')}});
// An older backend may still report 29/30 Nov and removed events; show only today's plan.
function tidyAdm(r){const s=r.stats||{},ids=WEDDING.events.map(e=>e.id);if(s.perEvent)s.perEvent=s.perEvent.filter(e=>ids.includes(e.id));if(s.perDay)s.perDay=s.perDay.filter(d=>!d.key||d.key>=RDAYS[0].key);return r}
let admTimer=null;
function openAdmin(){const a=$('#admin');a.classList.remove('leaving');a.hidden=false;root.classList.add('locked');a.scrollTop=0;clearInterval(admTimer);admTimer=setInterval(()=>{if(!$('#adm-edit').open&&!$('#adm-vdel').open&&!document.hidden)reloadAdmin().catch(()=>{})},60000)}
function closeAdmin(){clearInterval(admTimer);const a=$('#admin');a.classList.add('leaving');setTimeout(()=>{a.hidden=true;a.classList.remove('leaving');a.innerHTML='';if(opened)root.classList.remove('locked')},380);admPw='';admData=null;admSessions=null;admSig='';admTab='overview';admKeep={}}
const dKey=k=>{const i=dIdx(k);return i<0?'':`${RDAYS[i].day} ${RDAYS[i].label}`};
// Admin times are shown in Central Time, where the wedding is.
const fmtTime=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleString('en-US',{timeZone:'America/Chicago',weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})+' CT'};
const STL={yes:'Attending',maybe:'Tentative',no:'Not attending',withdrawn:'Withdrawn'},GL={male:'M',female:'F',other:'Other'},TL={DFW:'DFW',DAL:'Love Field',drive:'Driving',other:'Other'},FL={veg:'Veg',nonveg:'Non-veg',jain:'Jain',vegan:'Vegan'};
function bars(rows,two=true,legend='Solid = attending · striped = tentative'){const max=Math.max(1,...rows.map(r=>r.a+(r.b||0)));return`<div class="bars">${rows.map(r=>`<div class="bar"><span>${esc(r.label)}</span><span class="t"><i class="y" style="width:${r.a/max*100}%"></i>${two?`<i class="m" style="width:${(r.b||0)/max*100}%"></i>`:''}</span><span class="n">${r.a}${two&&r.b?` <small style="color:#a86a00">+${r.b}</small>`:''}</span></div>`).join('')}</div>${two&&legend?`<p class="legend">${legend}</p>`:''}`}
function donut(parts){const tot=parts.reduce((a,p)=>a+p.v,0)||1;let off=25;return`<div class="donut"><svg viewBox="0 0 42 42" role="img" aria-label="Responses by status"><circle cx="21" cy="21" r="15.915" fill="none" stroke="#efe0bd" stroke-width="6"/>${parts.map(p=>{const len=p.v/tot*100,s=`<circle class="seg" cx="21" cy="21" r="15.915" fill="none" stroke="${p.c}" stroke-width="6" stroke-dasharray="${len} ${100-len}" stroke-dashoffset="${off}"/>`;off-=len;return s}).join('')}<text x="21" y="23.5" text-anchor="middle" font-size="8" font-family="Cinzel,serif" fill="#6d1420">${tot===1&&!parts.some(p=>p.v)?0:tot}</text></svg><ul>${parts.map(p=>`<li${p.k&&p.l!=='Other'?`${lever(p.k,p.l)} class="lever" tabindex="0" role="button"`:''}><i style="background:${p.c}"></i>${esc(p.l)}: <b>${p.v}</b></li>`).join('')}</ul></div>`}
// Labels come from the backend's own day list, so an older backend with extra days still renders.
function histogram(all,cap){const days=all.filter(d=>!d.key||d.key>=RDAYS[0].key),max=Math.max(1,...days.map(d=>d.yes+d.maybe)),part=d=>{const w=String(d.label||d.key||'').replace(/\s*\(morning\)/,' am').split(' ');return[w[0]||'',w.slice(1).join(' ')]},lbl=i=>part(days[i]).join(' ');
  const stay=(d,i)=>{if(i===days.length-1)return'—';const t=d.stayingYes+d.stayingMaybe;return`<span class="${cap&&t>cap?'neg':''}">${d.stayingYes}${d.stayingMaybe?` <small>+${d.stayingMaybe}</small>`:''}${cap?` / ${cap}`:''}</span>`};
  return`<div class="hgram">${days.map((d,i)=>`<div class="hcol"><span class="htot">${d.yes}${d.maybe?`<small>+${d.maybe}</small>`:''}</span><div class="hstack" style="height:${(d.yes+d.maybe)/max*100}%">${d.maybe?`<i class="m" style="flex:${d.maybe}"></i>`:''}${d.yesKids?`<i class="k" style="flex:${d.yesKids}"></i>`:''}${d.yesAdults?`<i class="a" style="flex:${d.yesAdults}"></i>`:''}</div><span class="hday">${esc(part(d)[0])}<br>${esc(part(d)[1])}</span></div>`).join('')}</div>
  <p class="legend"><i class="lg a"></i>Adults<i class="lg k"></i>Kids<i class="lg m"></i>Tentative</p>
  <table class="plan"><thead><tr><th>Day</th><th>Adults</th><th>Kids</th><th>Tentative</th><th>Staying</th></tr></thead><tbody>${days.map((d,i)=>`<tr><td>${esc(lbl(i))}</td><td>${d.yesAdults}</td><td>${d.yesKids}</td><td>${d.maybe}</td><td>${stay(d,i)}</td></tr>`).join('')}</tbody></table>`}
const ICO={backup:'<svg viewBox="0 0 24 24"><path d="M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M3 4h18v3H3zM10 11h4"/></svg>',add:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',refresh:'<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>',ok:'<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',csv:'<svg viewBox="0 0 24 24"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>',out:'<svg viewBox="0 0 24 24"><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m15 8 4 4-4 4M19 12H9"/></svg>',filter:'<svg viewBox="0 0 24 24"><path d="M4 5h16l-6 7.5V19l-4 1v-7.5Z"/></svg>',trash:'<svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/></svg>',reset:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/></svg>',clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>'};
const timeOnly=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleTimeString('en-US',{timeZone:'America/Chicago',hour:'numeric',minute:'2-digit'})+' CT'};
function admChips(r){const s=r.stats,m=r.mail;
  return[`<span class="ac" title="${esc(fmtTime(r.generatedAt))}">${ICO.clock}<b id="adm-upd">${esc(timeOnly(r.generatedAt))}</b></span>`,`<span class="ac g"><b>${s.responses.total}</b> response${s.responses.total===1?'':'s'}</span>`,
    s.responses.withdrawn?`<span class="ac m"><b>${s.responses.withdrawn}</b> withdrawn</span>`:'',s.dedup&&s.dedup.skipped?`<span class="ac" title="Family members who replied separately are counted once"><b>${s.dedup.skipped}</b> counted once</span>`:'',
    m&&m.at?(m.ok?`<span class="ac b" title="Last email ${esc(fmtTime(m.at))}">✉ <b>${m.quota}</b> emails left</span>`:`<span class="ac r" title="${esc(m.error)}">✉ Emails failing</span>`):''].join('')}
function renderAdmin(quiet){const r=admData,s=r.stats,g=s.accommodation.gender;admSessions=visitSessions(r.visits.log);
  const hc=h=>h.changes.find(c=>c.field==='headcount'),moves=r.history.filter(hc),wk=Date.now()-7*864e5;
  const net=moves.filter(h=>new Date(h.at)>wk).reduce((a,h)=>a+(+hc(h).after)-(+hc(h).before),0);
  const people=new Set(admSessions.map(x=>x.key)).size;
  const kp=[['g',s.people.yes,'Attending'],['a',s.people.maybe,'Tentative'],['r',s.responses.no,'Declined'],['',s.responses.total,'Responses'],['',s.people.adultsYes,'Adults'],['',s.people.kidsYes,'Kids'],['',s.people.plusOnesYes,'Plus-ones'],['',s.accommodation.people,'Need stay'],[s.accommodation.capacity&&s.accommodation.peakNight>s.accommodation.capacity?'r':'',`${s.accommodation.peakNight}${s.accommodation.capacity?` / ${s.accommodation.capacity}`:''}`,'Peak night'],[net<0?'r':net>0?'g':'',`${net>0?'+':net<0?'−':''}${Math.abs(net)}`,'Net change 7d'],['',people,'Unique visitors']];
  const X=r.extras||{},tabs=[['overview','Overview',''],['guests','Guests',r.rsvps.length],['invites','Invites',(X.invites||[]).length||''],['plan','Rooms & food',''],['checkin','Check-in',''],...(X.photosOpen||(X.photos||[]).length?[['bless','Photos',(X.photos||[]).length||'']]:[]),['history','History',r.history.length],['visits','Analytics',people]];
  const pane=(k,html)=>`<section class="adm-pane" id="adm-${k}" role="tabpanel" aria-labelledby="adm-tab-${k}"${admTab===k?'':' hidden'}>${html}</section>`;
  const ib=(a,cls,label,icon)=>`<button type="button" class="ib ${cls}" data-a="${a}" aria-label="${label}" title="${label}">${icon}</button>`;
  $('#admin').innerHTML=`<div class="adm-wrap${quiet?' quiet':''}"><header class="adm-top"><h2>RSVP dashboard</h2><div class="adm-chips" id="adm-chips">${admChips(r)}</div>
   <div class="adm-btns">${ib('add','add','Add a guest',ICO.add)}${ib('refresh','refresh','Refresh',`<span class="i1">${ICO.refresh}</span><span class="i2">${ICO.ok}</span>`)}${ib('csv','csv','Download CSV',ICO.csv)}${ib('backup','backup','Email me a backup',ICO.backup)}${ib('close','out','Log out',ICO.out)}</div></header>
   <nav class="adm-tabs" role="tablist" aria-label="Dashboard sections">${tabs.map(([k,l,n])=>`<button type="button" role="tab" id="adm-tab-${k}" data-tab="${k}" aria-controls="adm-${k}" aria-selected="${admTab===k}">${l}${n!==''?`<small>${n}</small>`:''}</button>`).join('')}</nav>
  ${pane('overview',`${kpis(kp)}
  <div class="adm-grid">
   <div class="panel wide"><h3>Daily headcount · plan food &amp; stay</h3>${histogram(s.perDay,s.accommodation.capacity)}<div class="adm-chips left"><span class="ac">Stays from ${esc(dayText(0))}</span><span class="ac">Airbnb holds <b>${s.accommodation.capacity||15}</b></span><span class="ac">Staying: <b>${g.male}</b> M · <b>${g.female}</b> F${g.other?` · <b>${g.other}</b> other`:''}${g.unspecified?` · <b>${g.unspecified}</b> not given`:''} · <b>${s.accommodation.kids}</b> kids</span></div></div>
   <div class="panel"><h3>Changes in plans</h3>${moves.length?`<ol class="adm-tl">${moves.slice(0,20).map(h=>histItem(h)).join('')}</ol>`:'<p class="legend">No changes yet.</p>'}</div>
   <div class="panel"><h3>Headcount by event</h3>${bars(s.perEvent.map(e=>({label:e.label,a:e.yes,b:e.maybe})))}</div>
   <div class="panel"><h3>Responses</h3>${donut([{l:'Attending',v:s.responses.yes,c:'#2f7d43'},{l:'Tentative',v:s.responses.maybe,c:'#e0a100'},{l:'Not attending',v:s.responses.no,c:'#a3162b'},{l:'Withdrawn',v:s.responses.withdrawn,c:'#9b8f80'}])}</div>
  </div>`)}
  ${pane('guests',`<div class="adm-tools"><input type="search" id="adm-q" placeholder="Search name, phone, note" aria-label="Search guests"><select id="adm-st" aria-label="Filter by reply"><option value="">All replies</option><option value="yes">Attending</option><option value="maybe">Tentative</option><option value="no">Not attending</option><option value="withdrawn">Withdrawn</option></select><select id="adm-stay" aria-label="Filter by stay"><option value="">Any stay</option><option value="1">Needs stay</option></select><select id="adm-sort" aria-label="Sort guests"><option value="updatedAt">Recently updated</option><option value="name">Name A–Z</option><option value="party">Largest party</option><option value="arrival">Arriving first</option></select><div class="adm-view" role="group" aria-label="Show guests as">${['cards','table'].map(k=>`<button type="button" data-view="${k}" aria-pressed="${admView===k}">${k==='cards'?'Cards':'Table'}</button>`).join('')}</div></div><div class="${admView==='table'?'adm-tbl-wrap':'gc-list'}" id="adm-rows"></div>`)}
  ${pane('history',`<div class="adm-tools two"><input type="search" id="adm-hq" placeholder="Search by guest name" aria-label="Search history"><select id="adm-ha" aria-label="Filter by change"><option value="">Every change</option><option value="created">New RSVPs</option><option value="updated">Updates</option><option value="withdrawn">Withdrawals</option><option value="admin">Changes by you</option><option value="headcount">Headcount changes</option></select></div><div class="adm-chips left"><span class="ac" id="hg-count"></span><span class="ac">Kept even for deleted RSVPs</span><button type="button" class="ac hg-all" data-a="hg-all">Expand all</button></div><div class="hg-list" id="adm-hist"></div>`)}
  ${pane('invites',invitesPane())}${pane('plan',planPane())}${pane('checkin',checkinPane())}${pane('bless',blessPane())}
  ${pane('visits',visitsPane())}
  </div>`;
  const keep=admKeep;['q','st','stay','sort','hq','ha'].forEach(k=>{const el=$('#adm-'+k);if(el&&keep[k])el.value=keep[k]});
  admRows();admHist();hostRender();anRender({noReveal:true});admReveal($('#admin'),quiet)}
let admTab='overview',admKeep={},admView='cards';
function guestTable(list,hist){const EV=Object.fromEntries(WEDDING.events.map(e=>[e.id,e]));
  const rows=list.map(x=>{const going=x.status==='yes'||x.status==='maybe',adults=1+x.plusOnes.length,name=`${esc(x.firstName)} ${esc(x.lastName)}`;
    return`<tr><td>${name}${x.source==='admin'?'<br><small>added by you</small>':''}</td><td><span class="pill ${esc(x.status)}">${STL[x.status]||esc(x.status)}</span></td><td>${going?`<b>${adults+x.kids}</b> <small>${adults} adult${adults>1?'s':''}${x.kids?` · ${x.kids} kid${x.kids>1?'s':''}`:''}</small>`:'—'}</td><td>${going?`${esc(dKey(x.arrival))}<br><small>→ ${esc(dKey(x.departure))}</small>`:'—'}</td><td>${going&&x.accommodation?'<span class="tag-chip stay">Needs stay</span>':'—'}</td><td>${going?x.events.map(id=>EV[id]?`<span class="ev-chip" style="--c:${esc(EV[id].accent)}">${esc(EV[id].title.replace(/ \(.*\)$/,'').replace(/ \/.*$/,''))}</span>`:'').join(''):'—'}</td><td>${going&&x.plusOnes.length?x.plusOnes.map(p=>esc([p.name||'Guest',GL[p.gender]||''].filter(Boolean).join(' · '))).join('<br>'):'—'}</td><td>${x.phone?`<a href="${esc('https://wa.me/'+x.phone.replace(/\D/g,''))}" target="_blank" rel="noopener noreferrer">${esc(x.phone)}</a>`:'—'}</td><td class="note">${esc(x.message)||'—'}</td><td><small>${esc(fmtTime(x.createdAt))}</small></td><td><small>${esc(fmtTime(x.updatedAt))}</small></td><td class="act"><button type="button" class="ico" data-edit="${esc(x.id)}" aria-label="Edit ${name}" title="Edit">✎</button><button type="button" class="ico" data-goto-hist="${esc(x.firstName+' '+x.lastName)}" aria-label="History of ${name}" title="History (${hist(x.id).length})">⧖</button><button type="button" class="ico del" data-del="${esc(x.id)}" aria-label="Delete ${name}" title="Delete">✕</button></td></tr>`}).join('');
  return`<table class="adm-tbl guests"><thead><tr><th>Guest</th><th>Reply</th><th>Party</th><th>Dates</th><th>Stay</th><th>Events</th><th>Plus-ones</th><th>WhatsApp</th><th>Note</th><th>Replied (CT)</th><th>Updated (CT)</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="12" class="adm-empty">No RSVPs match.</td></tr>'}</tbody></table>`}
const dur=s=>!s?'—':s>=3600?`${Math.floor(s/3600)}h ${Math.round(s%3600/60)}m`:s>=60?`${Math.floor(s/60)}m ${s%60}s`:`${s}s`;
const SEC={opened:'Opened',events:'Events',rsvp:'RSVP',photos:'Photos'};
const EVL={envelope_open:'Opened the envelope',music_on:'Turned music on',music_off:'Turned music off',qr:'Opened the QR code',share:'Tapped Share',map:'Opened the map',calendar_apple:'Added to Apple Calendar',calendar_google:'Added to Google Calendar',calendar_google_all:'Google: added all events',calendar_google_one:'Google: added one event',event_calendar:'Opened an event’s calendar',whatsapp:'Tapped a WhatsApp link',call:'Tapped a call link',text:'Tapped a text link',email:'Tapped an email link',find_open:'Opened “Find my RSVP”',find_ok:'Found their RSVP',find_fail:'Couldn’t find their RSVP',find_whatsapp:'Messaged Hemanth after not finding it',rsvp_button:'Tapped the RSVP button',rsvp_start:'Started the RSVP form',rsvp_yes:'Chose “Attending”',rsvp_maybe:'Chose “Tentative”',rsvp_no:'Chose “Can’t come”',rsvp_error:'Hit a form error',rsvp_sent:'Sent or updated an RSVP',rsvp_edit:'Opened “Update”',rsvp_withdraw:'Tapped “Withdraw”',photo_open:'Opened a photo',photo_next:'Swiped photos in full view',photo_dot:'Tapped photo dots',scroll_25:'Scrolled a quarter',scroll_50:'Scrolled halfway',scroll_75:'Scrolled three quarters',scroll_100:'Reached the end',saw_events:'Saw the events',saw_rsvp:'Saw the RSVP form',saw_photos:'Saw the photos',photo_upload:'Shared photos'};
const evLabel=k=>EVL[k]||(k.startsWith('event_')?'Tapped event: '+((WEDDING.events.find(e=>'event_'+e.id===k)||{}).title||k.slice(6)):k.startsWith('contact_')?'Opened contact: '+k.slice(8).replace(/^./,c=>c.toUpperCase()):k.replace(/_/g,' '));
const PAL=['#a3162b','#c9a24a','#2f7d43','#2c5d8a','#8e2453','#e0a100','#5b3a8a','#d9480f','#6b3c12','#9b8f80'];
function columns(vals,labels,title){const max=Math.max(1,...vals);return`<div class="hours" style="grid-template-columns:repeat(${vals.length},1fr)">${vals.map((n,i)=>`<i style="height:${n/max*100}%;--i:${i}" title="${esc(labels[i])} · ${n} ${title}"></i>`).join('')}</div>`}
const kpis=list=>`<div class="kpis">${list.map(([c,n,l,d])=>`<div class="kpi ${c}"><b>${n}</b><span>${l}</span>${d||''}</div>`).join('')}</div>`;
/* ----- Analytics: de-duplicated, filtered and charted in the browser from one row per visit ----- */
const CTF=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23',weekday:'short'});
const WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function ctParts(t){const o={};CTF.formatToParts(new Date(t)).forEach(p=>{o[p.type]=p.value});return{d:`${o.year}-${o.month}-${o.day}`,h:(+o.hour)%24,wd:WD.indexOf(o.weekday)}}
const RSTEP={'':0,started:1,sent:2,no:2,maybe:2,yes:2};
const joinPlace=(...x)=>x.filter(Boolean).join(', ');
const sizeOf=w=>!w?'':w<360?'Small phone':w<440?'Phone':w<820?'Large phone / small tablet':w<1200?'Tablet / laptop':'Desktop';
// Every breakdown, and the filter that clicking one of its rows applies.
const DIM={country:{l:'Country',f:s=>s.country},region:{l:'State',f:s=>joinPlace(s.region,s.cc)},city:{l:'City',f:s=>joinPlace(s.city,s.region,s.cc)},device:{l:'Device',f:s=>s.device},os:{l:'System',f:s=>s.os},browser:{l:'Browser',f:s=>s.browser},source:{l:'Came from',f:s=>s.source},size:{l:'Screen',f:s=>sizeOf(s.w)},net:{l:'Connection',f:s=>s.net&&s.net.toUpperCase()},theme:{l:'Display',f:s=>s.theme&&(s.theme==='dark'?'Dark mode':'Light mode')},tz:{l:'Time zone',f:s=>s.tz},lang:{l:'Language',f:s=>s.lang}};
let admSessions=null,admSig='',anShown=40;
const AF={range:'all',from:'',to:'',h0:0,h1:23,who:'',dims:{}};
// Reloads and new tabs within 30 minutes of the same person's last activity count as one visit.
function visitSessions(log){const rows=(log||[]).filter(r=>r&&r.at).slice().sort((a,b)=>a.at<b.at?-1:a.at>b.at?1:0),last={},out=[],GAP=30*60e3;
  rows.forEach(r=>{const key=r.p||'v:'+(r.id||r.at),t=Date.parse(r.at),s=last[key],d=+r.dur||0;
    if(s&&t-s.end<GAP){s.n++;s.dur+=d;s.scroll=Math.max(s.scroll,+r.scroll||0);(r.sec||[]).forEach(x=>s.sec.add(x));Object.entries(r.act||{}).forEach(([k,n])=>{s.act[k]=(s.act[k]||0)+(+n||0)});if((RSTEP[r.rsvp]||0)>(RSTEP[s.rsvp]||0))s.rsvp=r.rsvp;s.load=s.load||+r.load||0;s.open=s.open||+r.open||0;s.end=Math.max(s.end,t+d*1e3);return}
    const c=ctParts(t),n=Object.assign({},r,{key,t,end:t+d*1e3,n:1,dur:d,scroll:+r.scroll||0,sec:new Set(r.sec||[]),act:Object.assign({},r.act||{}),load:+r.load||0,open:+r.open||0,d:c.d,h:c.h,wd:c.wd});
    last[key]=n;out.push(n)});
  const per={};out.forEach(s=>{per[s.key]=(per[s.key]||0)+1});out.forEach(s=>{s.multi=per[s.key]>1});
  return out}
const dayKey=t=>ctParts(t).d;
function afRange(){const today=dayKey(Date.now()),back=n=>dayKey(Date.now()-n*864e5);
  return AF.range==='today'?[today,today]:AF.range==='7d'?[back(6),today]:AF.range==='30d'?[back(29),today]:AF.range==='custom'?[AF.from||'0000-00-00',AF.to||'9999-99-99']:['0000-00-00','9999-99-99']}
function afApply(all,range){const [a,b]=range||afRange(),hOk=h=>AF.h0<=AF.h1?h>=AF.h0&&h<=AF.h1:h>=AF.h0||h<=AF.h1,dims=Object.entries(AF.dims);
  return all.filter(s=>s.d>=a&&s.d<=b&&hOk(s.h)&&(!AF.who||(AF.who==='new')===!s.multi)&&dims.every(([k,v])=>DIM[k].f(s)===v))}
function vstats(ss){const people={};ss.forEach(s=>{(people[s.key]=people[s.key]||[]).push(s)});
  const P=Object.values(people),n=P.length,avg=l=>l.length?Math.round(l.reduce((a,b)=>a+b,0)/l.length):0;
  const top=f=>{const c={};P.forEach(vs=>new Set(vs.map(f).filter(Boolean)).forEach(k=>{c[k]=(c[k]||0)+1}));return Object.keys(c).map(k=>({label:k,n:c[k]})).sort((a,b)=>b.n-a.n||(a.label<b.label?-1:1))};
  const by={};Object.keys(DIM).forEach(k=>{by[k]=top(DIM[k].f)});
  const hours=Array(24).fill(0),weekdays=Array(7).fill(0);ss.forEach(s=>{hours[s.h]++;if(s.wd>=0)weekdays[s.wd]++});
  const durs=ss.map(s=>s.dur).filter(d=>d>0).sort((a,b)=>a-b);
  const ev={};ss.forEach(s=>Object.entries(s.act).forEach(([k,v])=>{if(!(+v))return;const e=ev[k]=ev[k]||{label:k,p:new Set(),total:0};e.p.add(s.key);e.total+=+v}));
  const ret=P.filter(vs=>vs[0].multi).length,has=f=>P.filter(vs=>vs.some(f)).length,days={};
  ss.forEach(s=>{const d=days[s.d]=days[s.d]||{date:s.d,visits:0,p:new Set()};d.visits++;d.p.add(s.key)});
  return{people:n,visits:ss.length,returning:ret,newPeople:n-ret,by,hours,weekdays,
    avgDuration:avg(durs),medianDuration:durs.length?durs[Math.floor(durs.length/2)]:0,avgScroll:avg(ss.map(s=>s.scroll)),avgLoadMs:avg(ss.map(s=>s.load).filter(Boolean)),avgOpenAfter:avg(ss.map(s=>s.open).filter(Boolean)),
    events:Object.values(ev).map(e=>({label:e.label,people:e.p.size,total:e.total})).sort((a,b)=>b.people-a.people||b.total-a.total),
    funnel:{visited:n,opened:has(s=>s.sec.has('opened')),events:has(s=>s.sec.has('events')),rsvpSeen:has(s=>s.sec.has('rsvp')),photos:has(s=>s.sec.has('photos')),started:has(s=>(RSTEP[s.rsvp]||0)>=1),sent:has(s=>(RSTEP[s.rsvp]||0)>=2)},
    days}}
// Every day in the chosen range (up to the last 60), so quiet days show as gaps rather than disappearing.
// Newest first; switches to weeks once there are more than five weeks of days.
function dayList(days,all){const keys=Object.keys(days).sort(),[a,b]=afRange();if(!keys.length)return[];
  let from=a>'0000-00-00'?a:(all.length?all[0].d:keys[0]),to=b<'9999-99-99'?b:dayKey(Date.now());if(to<keys[keys.length-1])to=keys[keys.length-1];if(from>keys[0]&&!(a>'0000-00-00'))from=keys[0];
  const md=k=>new Date(k+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}),list=[];
  for(let t=Date.parse(to+'T12:00:00Z');list.length<1100;t-=864e5){const k=new Date(t).toISOString().slice(0,10);if(k<from)break;const d=days[k];list.push({date:k,visits:d?d.visits:0,p:d?d.p:new Set()})}
  if(list.length<=35)return list.map(x=>({date:x.date,label:md(x.date),short:md(x.date),visits:x.visits,unique:x.p.size}));
  const out=[];for(let i=0;i<list.length;i+=7){const g=list.slice(i,i+7),p=new Set();g.forEach(x=>x.p.forEach(v=>p.add(v)));const start=g[g.length-1].date,end=g[0].date;
    out.push({date:start,label:`Week of ${md(start)} – ${md(end)}`,short:md(start),visits:g.reduce((n,x)=>n+x.visits,0),unique:p.size,week:true})}
  return out}
const hourLabel=h=>`${h%12||12} ${h<12?'am':'pm'}`;
function visitsPane(){const ranges=[['today','Today'],['7d','7 days'],['30d','30 days'],['all','All time'],['custom','Custom']];
  return`<div class="af" id="af"><div class="af-row"><div class="af-seg" role="group" aria-label="Date range">${ranges.map(([k,l])=>`<button type="button" data-range="${k}" aria-pressed="${AF.range===k}">${l}</button>`).join('')}</div>
   <button type="button" class="ib sm filt" data-a="af-more" aria-label="More filters" title="More filters" aria-expanded="false">${ICO.filter}<i class="badge" id="af-n" hidden></i></button><button type="button" class="ib sm del" data-a="vdel" aria-label="Delete visits" title="Delete visits">${ICO.trash}</button></div>
   <div class="collapse${AF.range==='custom'?' open':''}" id="af-custom"><div><div class="af-row dates"><label>From <input type="date" id="af-from" value="${esc(AF.from)}"></label><label>To <input type="date" id="af-to" value="${esc(AF.to)}"></label></div></div></div>
   <div class="collapse" id="af-more"><div><div class="af-grid">
    <label>Time of day <span class="af-pair"><select id="af-h0" aria-label="From hour">${Array.from({length:24},(_,h)=>`<option value="${h}"${AF.h0===h?' selected':''}>${hourLabel(h)}</option>`).join('')}</select><i>to</i><select id="af-h1" aria-label="To hour">${Array.from({length:24},(_,h)=>`<option value="${h}"${AF.h1===h?' selected':''}>${hourLabel(h)}</option>`).join('')}</select></span></label>
    <label>Visitors <select id="af-who"><option value="">Everyone</option><option value="new"${AF.who==='new'?' selected':''}>First-time only</option><option value="ret"${AF.who==='ret'?' selected':''}>Returning only</option></select></label>
    ${['country','device','source'].map(k=>`<label>${DIM[k].l} <select data-dim="${k}"><option value="">Any</option></select></label>`).join('')}
   </div></div></div>
   <div class="af-chips" id="af-chips"></div></div><div id="adm-an"></div>`}
function afSync(){const all=admSessions||[],A0=vstats(all);
  $$('#af [data-dim]').forEach(sel=>{const k=sel.dataset.dim,cur=AF.dims[k]||'';sel.innerHTML=`<option value="">Any</option>`+A0.by[k].map(x=>`<option${x.label===cur?' selected':''}>${esc(x.label)}</option>`).join('')});
  const chips=Object.entries(AF.dims).map(([k,v])=>`<button type="button" class="fchip" data-undim="${k}">${esc(DIM[k].l)}: <b>${esc(v)}</b><i aria-hidden="true">✕</i></button>`);
  if(AF.who)chips.push(`<button type="button" class="fchip" data-unwho>${AF.who==='new'?'First-time':'Returning'}<i aria-hidden="true">✕</i></button>`);
  if(AF.h0!==0||AF.h1!==23)chips.push(`<button type="button" class="fchip" data-unhours>${hourLabel(AF.h0)} – ${hourLabel(AF.h1)}<i aria-hidden="true">✕</i></button>`);
  if(chips.length>1)chips.push(`<button type="button" class="fchip clear" data-a="af-reset">${ICO.reset}Clear all</button>`);
  $('#af-chips').innerHTML=chips.join('');const n=$('#af-n');n.hidden=!chips.length;n.textContent=Object.keys(AF.dims).length+(AF.who?1:0)+(AF.h0!==0||AF.h1!==23?1:0);
  $$('#af [data-range]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.range===AF.range)))}
// Charts whose rows act as filters: tap a row to narrow everything to it.
const lever=(k,label)=>DIM[k]?` data-dim-k="${k}" data-dim-v="${esc(label)}"`:'';
function anPie(k,A){const list=A.by[k].filter(x=>x.n);if(!list.length)return'<p class="legend">No data yet.</p>';const head=list.slice(0,6),rest=list.slice(6).reduce((a,x)=>a+x.n,0);
  return donut(head.map((x,i)=>({l:x.label,v:x.n,c:PAL[i],k})).concat(rest?[{l:'Other',v:rest,c:PAL[9]}]:[]))}
function anBars(k,A,n=10){const list=A.by[k].slice(0,n);return list.length?`<div class="bars">${list.map(x=>{const max=A.by[k][0].n||1;return`<div class="bar lever"${lever(k,x.label)} tabindex="0" role="button"><span>${esc(x.label)}</span><span class="t"><i class="y" style="width:${x.n/max*100}%"></i></span><span class="n">${x.n}</span></div>`}).join('')}</div>`:'<p class="legend">No data yet.</p>'}
function anRank(k,A,n=12){const list=A.by[k].filter(x=>x.n),P=A.people;if(!list.length)return'<p class="legend">No data yet.</p>';
  return`<div class="adm-tbl-wrap mini"><table class="adm-tbl rank"><thead><tr><th>#</th><th>${esc(DIM[k].l)}</th><th>People</th><th>Share</th></tr></thead><tbody>${list.slice(0,n).map((x,i)=>{const p=P?Math.round(x.n/P*100):0;return`<tr class="lever"${lever(k,x.label)} tabindex="0"><td data-v="${i+1}">${i+1}</td><td>${esc(x.label)}</td><td data-v="${x.n}"><b>${x.n}</b></td><td data-v="${p}"><span class="share"><i style="width:${p}%"></i></span> ${p}%</td></tr>`}).join('')}</tbody></table></div>${list.length>n?`<p class="legend">Top ${n} of ${list.length}. Tap one to filter.</p>`:''}`}
function linkBoard(ss){const by={};ss.forEach(s=>{const k=s.source||'Direct / unknown',b=by[k]=by[k]||{p:new Set(),sent:new Set(),open:new Set()};b.p.add(s.key);if((RSTEP[s.rsvp]||0)>=2)b.sent.add(s.key);if(s.sec.has('opened'))b.open.add(s.key)});
  const rows=Object.entries(by).map(([k,b])=>({k,p:b.p.size,o:b.open.size,s:b.sent.size})).sort((a,b)=>b.s-a.s||b.p-a.p);if(!rows.length)return'<p class="legend">No visits in this range.</p>';
  return`<div class="adm-tbl-wrap mini"><table class="adm-tbl rank"><thead><tr><th>#</th><th>Link</th><th>People</th><th>Opened</th><th>Sent RSVP</th><th>Conversion</th></tr></thead><tbody>${rows.map((r,i)=>{const c=r.p?Math.round(r.s/r.p*100):0;return`<tr class="lever"${lever('source',r.k)} tabindex="0"><td data-v="${i+1}">${i+1}</td><td>${esc(r.k)}</td><td data-v="${r.p}"><b>${r.p}</b></td><td data-v="${r.o}">${r.o}</td><td data-v="${r.s}"><b>${r.s}</b></td><td data-v="${c}"><span class="share"><i style="width:${c}%"></i></span> ${c}%</td></tr>`}).join('')}</tbody></table></div>`}
function anRender(o={}){const el=$('#adm-an');if(!el)return;if(!o.keep)anShown=40;afSync();
  const all=admSessions||[],ss=afApply(all),A=vstats(ss),F=A.funnel,P=A.people,pct=(a,b)=>b?Math.round(a/b*100)+'%':'—';
  // The same filters over the equally long period just before, for the arrows on the main numbers.
  const [ra,rb]=afRange(),span=ra>'0000-00-00'&&rb<'9999-99-99'?Math.round((Date.parse(rb)-Date.parse(ra))/864e5)+1:0,shift=n=>new Date(Date.parse(ra)-n*864e5).toISOString().slice(0,10);
  const B=span?vstats(afApply(all,[shift(span),shift(1)])):null;
  const dl=(now,was)=>{if(!B||!was&&!now)return'';if(!was)return'<small class="dl up">new</small>';const c=Math.round((now-was)/was*100);return c?`<small class="dl ${c>0?'up':'down'}" title="vs the ${span} day${span>1?'s':''} before">${c>0?'▲':'▼'} ${Math.abs(c)}%</small>`:'<small class="dl">=</small>'};
  const k=[['g',P,'Unique visitors',dl(P,B&&B.people)],['',A.returning,'Returning'],['',A.newPeople,'First-time'],['',A.visits,'Visits',dl(A.visits,B&&B.visits)],['',dur(A.avgDuration),'Avg time on page'],['',dur(A.medianDuration),'Typical time'],['',A.avgScroll+'%','Avg scrolled'],['',pct(F.opened,F.visited),'Opened envelope'],[F.sent?'g':'',pct(F.sent,F.visited),'Sent an RSVP',dl(F.sent,B&&B.funnel.sent)],['',A.avgOpenAfter?A.avgOpenAfter+'s':'—','Time to open'],['',A.avgLoadMs?(A.avgLoadMs/1000).toFixed(1)+'s':'—','Page load']];
  const steps=[['Visited',F.visited],['Opened the envelope',F.opened],['Saw the events',F.events],['Reached the RSVP form',F.rsvpSeen],['Started an RSVP',F.started],['Sent an RSVP',F.sent],['Saw the photos',F.photos]];
  const daily=dayList(A.days,all),dmax=Math.max(1,...daily.map(d=>d.visits)),weeks=daily.length&&daily[0].week;
  const dailyChart=daily.length?`<div class="dscroll"><div class="dcols">${daily.map((d,i)=>{const u=d.unique,r=Math.max(0,d.visits-u);return`<div style="--i:${i}" title="${esc(d.label)}: ${u} ${u===1?'person':'people'}, ${d.visits} visit${d.visits===1?'':'s'}"><b>${d.visits||''}</b><i class="r" style="height:${r/dmax*100}%"></i><i class="u" style="height:${u/dmax*100}%"></i><span>${esc(d.short)}</span></div>`}).join('')}</div></div><p class="legend"><i class="lg a"></i>People<i class="lg m"></i>Repeat visits<span class="dnote">${weeks?'By week':'By day'} · newest first${daily.length>8?' · scroll for older':''}</span></p>`:'<p class="legend">No visits in this range.</p>';
  const evRows=A.events.map((e,i)=>`<tr><td data-v="${i+1}">${i+1}</td><td>${esc(evLabel(e.label))}</td><td data-v="${e.people}"><b>${e.people}</b></td><td data-v="${e.people}"><span class="share"><i style="width:${P?Math.round(e.people/P*100):0}%"></i></span> ${pct(e.people,P)}</td><td data-v="${e.total}">${e.total}</td></tr>`).join('');
  const recent=ss.slice().reverse(),rows=recent.slice(0,anShown).map(r=>`<tr><td data-v="${r.t}">${esc(fmtTime(r.at))}${r.n>1?`<br><small>${r.n} loads, counted once</small>`:''}</td><td>${r.p?`<code>${esc(r.p.slice(0,6))}</code>`:'—'}${r.multi?' <span class="tag-chip ret">returning</span>':''}</td><td>${esc(joinPlace(r.city,r.region,r.country)||'—')}</td><td>${esc([r.device,r.os].filter(Boolean).join(' · '))}<br><small>${esc([r.browser,sizeOf(r.w),r.net&&r.net.toUpperCase(),r.theme==='dark'?'dark mode':''].filter(Boolean).join(' · '))}</small></td><td><span class="tag-chip src">${esc(r.source||'—')}</span></td><td data-v="${r.dur}">${dur(r.dur)}${r.open?`<br><small>opened after ${r.open}s</small>`:''}</td><td data-v="${r.scroll}">${r.scroll?r.scroll+'%':'—'}</td><td>${[...r.sec].map(s=>`<span class="tag-chip">${esc(SEC[s]||s)}</span>`).join('')||'—'}</td><td>${Object.keys(r.act).filter(s=>r.act[s]>0&&!/^(scroll_|saw_)/.test(s)).map(s=>`<span class="tag-chip act">${esc(evLabel(s))}</span>`).join('')||'—'}</td><td>${r.rsvp?`<span class="pill ${r.rsvp==='started'?'maybe':esc(r.rsvp)}">${r.rsvp==='started'?'Started':STL[r.rsvp]||'Sent'}</span>`:'—'}</td><td>${esc(r.tz||'—')}</td></tr>`).join('');
  el.innerHTML=`${kpis(k)}<div class="adm-chips left"><span class="ac">No cookies</span><span class="ac">IPs kept scrambled</span><span class="ac">Reloads within 30 min count once</span><span class="ac">Charts count people</span><span class="ac">Times in CT</span></div>
  <div class="adm-grid">
   <div class="panel wide"><h3>Visitors by day</h3>${dailyChart}</div>
   <div class="panel funnel"><h3>How far people got</h3>${bars(steps.map(([l,n])=>({label:`${l} · ${pct(n||0,F.visited)}`,a:n||0})),false)}</div>
   <div class="panel"><h3>New vs returning</h3>${donut([{l:'First-time',v:A.newPeople,c:PAL[0]},{l:'Returning',v:A.returning,c:PAL[3]}])}</div>
   <div class="panel"><h3>Countries</h3>${anPie('country',A)}${anRank('country',A,10)}</div>
   <div class="panel"><h3>States &amp; regions</h3>${anBars('region',A)}</div>
   <div class="panel wide"><h3>Cities</h3>${anRank('city',A,20)}</div>
   <div class="panel"><h3>Came from</h3>${anPie('source',A)}</div>
   <div class="panel wide"><h3>Links that brought guests</h3>${linkBoard(ss)}<div class="linkgen"><input id="lg-name" placeholder="Name or group, e.g. Meghana or office" aria-label="Who the link is for"><button type="button" class="ib sm" data-a="lg-copy" aria-label="Copy link" title="Copy link">${ICO.csv}</button></div><p class="legend" id="lg-out">Make a personal link to see who each person’s sharing brings in. The short is.gd link can’t carry this tag.</p></div>
   <div class="panel"><h3>Devices</h3>${anPie('device',A)}</div>
   <div class="panel"><h3>Phone &amp; computer systems</h3>${anPie('os',A)}</div>
   <div class="panel"><h3>Browsers &amp; apps</h3>${anPie('browser',A)}</div>
   <div class="panel"><h3>Screen sizes</h3>${anPie('size',A)}</div>
   <div class="panel"><h3>Connection &amp; display</h3>${anBars('net',A)}<h3 style="margin-top:14px">Light or dark mode</h3>${anPie('theme',A)}</div>
   <div class="panel"><h3>Time of day (CT)</h3>${columns(A.hours,A.hours.map((_,h)=>hourLabel(h)),'visits')}<div class="hours-l"><span>12 am</span><span>6 am</span><span>12 pm</span><span>6 pm</span><span>11 pm</span></div></div>
   <div class="panel"><h3>Day of the week</h3>${bars(A.weekdays.map((n,i)=>({label:WD[i],a:n})),false)}</div>
   <div class="panel wide"><h3>Everything people did</h3>${evRows?`<div class="adm-tbl-wrap mini"><table class="adm-tbl rank"><thead><tr><th>#</th><th>What</th><th>People</th><th>Share of visitors</th><th>Times</th></tr></thead><tbody>${evRows}</tbody></table></div>`:'<p class="legend">No taps in this range.</p>'}</div>
   <div class="panel"><h3>Their time zones</h3>${anBars('tz',A,8)}</div>
   <div class="panel"><h3>Languages</h3>${anBars('lang',A,8)}</div>
   <div class="panel wide"><h3>Visits <small class="h3n">${recent.length}</small></h3><input type="search" class="an-q" id="an-q" placeholder="Search place, device, source…" aria-label="Search visits"><div class="adm-tbl-wrap"><table class="adm-tbl"><thead><tr><th>When (CT)</th><th>Visitor</th><th>Place</th><th>Device</th><th>Came from</th><th>Time</th><th>Scrolled</th><th>Saw</th><th>Did</th><th>RSVP</th><th>Time zone</th></tr></thead><tbody>${rows||'<tr><td colspan="11" class="adm-empty">No visits in this range.</td></tr>'}</tbody></table></div>${recent.length>anShown?`<button type="button" class="btn more-btn" data-a="an-more">Show ${Math.min(40,recent.length-anShown)} more</button>`:''}</div>
  </div>`;
  if(!o.noReveal)admReveal(el,o.instant)}
// Panels fade up as they scroll into view; their bars, columns and pies draw in at the same moment.
let revealIO=null;
function admReveal(root,instant){const items=[...root.querySelectorAll('.kpi,.panel,.adm-chips .ac')].filter(x=>!x.classList.contains('in'));
  if(instant||!('IntersectionObserver' in window)){items.forEach(x=>x.classList.add('rv','in'));countUp(root,true);return}
  revealIO=revealIO||new IntersectionObserver(es=>{let k=0;es.forEach(e=>{if(!e.isIntersecting)return;revealIO.unobserve(e.target);e.target.style.setProperty('--d',(k++*.05).toFixed(2)+'s');e.target.classList.add('in');countUp(e.target)})},{root:$('#admin'),rootMargin:'0px 0px -6% 0px',threshold:.06});
  items.forEach(x=>{x.classList.add('rv');revealIO.observe(x)})}
function countUp(el,instant){const list=el.matches&&el.matches('.kpi')?[el.querySelector('b')]:[...el.querySelectorAll('.kpi b')];
  list.forEach(b=>{if(!b||b.dataset.done)return;b.dataset.done=1;const m=/^(\D*)(\d+)(.*)$/.exec(b.textContent);if(!m||instant||reduce)return;const to=+m[2],t0=performance.now();if(to<2)return;
    const step=now=>{const k=Math.min(1,(now-t0)/700),e=1-Math.pow(1-k,3);b.textContent=m[1]+Math.round(to*e)+m[3];if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)})}
function sortTable(th){const tr=th.parentNode,i=[...tr.children].indexOf(th),tb=th.closest('table').tBodies[0];if(!tb)return;const rows=[...tb.rows].filter(r=>!r.querySelector('.adm-empty'));if(rows.length<2)return;
  const dir=th.dataset.dir==='desc'?'asc':'desc';tr.querySelectorAll('th').forEach(x=>{delete x.dataset.dir;x.removeAttribute('aria-sort')});th.dataset.dir=dir;th.setAttribute('aria-sort',dir==='asc'?'ascending':'descending');
  const val=r=>{const c=r.cells[i];if(!c)return'';const v=c.dataset.v;return v!==undefined&&v!==''&&!isNaN(+v)?+v:c.textContent.trim().toLowerCase()};
  rows.sort((a,b)=>{const A=val(a),B=val(b),c=typeof A==='number'&&typeof B==='number'?A-B:String(A).localeCompare(String(B));return dir==='asc'?c:-c});
  rows.forEach((r,k)=>{r.style.setProperty('--i',Math.min(k,20));r.classList.remove('resort');void r.offsetWidth;r.classList.add('resort');tb.appendChild(r)})}
/* ----- Host tools: invites and nudges, thank-yous, rooms and food, check-in, blessings and photos ----- */
const HX={ci:'',inv:'open',invQ:''};
const xapi=async(kind,body={})=>{const r=await api(Object.assign({action:'adminExtra',kind,password:admPw},body));if(!r.ok)throw new Error(r.error||'failed');return r};
const digits10=p=>String(p||'').replace(/\D/g,'').slice(-10);
const firstOf=n=>String(n||'').trim().split(/\s+/)[0]||'there';
const waLink=(phone,text)=>`https://wa.me/${String(phone).replace(/\D/g,'')}?text=${encodeURIComponent(text)}`;
const nudgeText=n=>`Hi ${firstOf(n)}! Hemanth & Alekya here. We’d love to celebrate with you (1 – 3 Dec, Celina TX). Could you let us know if you can make it? It takes a minute: https://bommenahemanth.github.io/hemanthwedsalekya/`;
const thanksText=n=>`Dear ${firstOf(n)}, thank you so much for celebrating with us and for all your blessings 🙏 It meant the world to us. Our wedding site: ${SITE}\n\nWith love, Hemanth & Alekya`;
const going=x=>x.status==='yes'||x.status==='maybe',partyOf=x=>1+x.plusOnes.length+(+x.kids||0);
function matchInvite(inv){const d=digits10(inv.phone),k=nameKey(inv.name);return admData.rsvps.find(x=>(d&&digits10(x.phone)===d)||nameKey(x.firstName+' '+x.lastName)===k)}
const nameKey=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z\s]/g,'').replace(/\s+/g,' ').trim();

function invitesPane(){return`<div class="adm-chips left" id="inv-chips"></div>
  <details class="hx-card"><summary>${ICO.add}<b>Add people you invited</b></summary><div class="hx-body"><textarea id="inv-paste" rows="5" placeholder="One per line: Name, WhatsApp number&#10;Ravi Kumar, 469 555 1234&#10;Lakshmi Rao, +91 98765 43210"></textarea><button type="button" class="btn solid" data-x="inv-add">Add to the list</button></div></details>
  <div class="adm-tools two"><input type="search" id="inv-q" placeholder="Search invited guests" aria-label="Search invited guests"></div>
  <div class="af-seg inv-seg" role="group" aria-label="Show">${[['open','Not replied'],['done','Replied'],['all','Everyone']].map(([k,l])=>`<button type="button" data-inv="${k}" aria-pressed="${HX.inv===k}">${l}</button>`).join('')}</div>
  <ul class="hx-list" id="inv-list"></ul>
  <h3 class="hx-h">Thank-yous <small>after the wedding</small></h3><ul class="hx-list" id="ty-list"></ul>`}
function invRender(){const E=admData.extras||{},list=(E.invites||[]).map(i=>Object.assign({},i,{r:matchInvite(i)})),q=HX.invQ.toLowerCase();
  const replied=list.filter(i=>i.r).length,nudged=list.filter(i=>!i.r&&i.nudgedAt).length;
  $('#inv-chips').innerHTML=`<span class="ac"><b>${list.length}</b> invited</span><span class="ac g"><b>${replied}</b> replied</span><span class="ac r"><b>${list.length-replied}</b> waiting</span><span class="ac b"><b>${nudged}</b> nudged</span>`;
  const shown=list.filter(i=>(HX.inv==='all'||(HX.inv==='done')===!!i.r)&&(!q||(i.name+' '+i.phone).toLowerCase().includes(q))).sort((a,b)=>(!!a.nudgedAt-!!b.nudgedAt)||a.name.localeCompare(b.name));
  $('#inv-list').innerHTML=shown.map((i,k)=>`<li class="hx-row" style="--i:${Math.min(k,15)}"><span class="hg-av sm" aria-hidden="true">${esc(i.name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase())}</span><span class="hx-main"><b>${esc(i.name)}</b><small>${esc(i.phone||'No number')}${i.r?` · <span class="pill ${esc(i.r.status)}">${STL[i.r.status]||esc(i.r.status)}</span>`:i.nudgedAt?` · nudged ${esc(fmtTime(i.nudgedAt))}`:''}</small></span>
    ${!i.r&&i.phone?`<a class="ib sm wa${i.nudgedAt?' done':''}" href="${esc(waLink(i.phone,nudgeText(i.name)))}" target="_blank" rel="noopener noreferrer" data-x="nudge" data-id="${esc(i.id)}" aria-label="WhatsApp ${esc(i.name)} a reminder" title="Send a reminder">${waSvg}</a>`:''}<button type="button" class="ib sm del" data-x="inv-del" data-id="${esc(i.id)}" aria-label="Remove ${esc(i.name)}" title="Remove">${ICO.trash}</button></li>`).join('')||`<li class="adm-empty">${list.length?'Nobody here.':'Add the people you invited to see who hasn’t replied yet.'}</li>`;
  const th=E.thanked||{},att=admData.rsvps.filter(x=>x.status==='yes'&&x.phone);
  $('#ty-list').innerHTML=att.map((x,k)=>{const n=`${x.firstName} ${x.lastName}`;return`<li class="hx-row" style="--i:${Math.min(k,15)}"><span class="hg-av sm" aria-hidden="true">${esc((x.firstName[0]||'')+(x.lastName[0]||''))}</span><span class="hx-main"><b>${esc(n)}</b><small>${th[x.id]?`Thanked ${esc(fmtTime(th[x.id]))}`:`Party of ${partyOf(x)}`}</small></span><a class="ib sm wa${th[x.id]?' done':''}" href="${esc(waLink(x.phone,thanksText(n)))}" target="_blank" rel="noopener noreferrer" data-x="thank" data-id="${esc(x.id)}" aria-label="Thank ${esc(n)} on WhatsApp" title="Send a thank-you">${waSvg}</a></li>`}).join('')||'<li class="adm-empty">Attending guests will appear here.</li>'}

function planPane(){return`<div class="panel"><h3>Food per event</h3><div id="food-tbl"></div><button type="button" class="btn more-btn" data-x="food-csv">${ICO.csv} Caterer CSV</button></div>
  <div class="panel" style="margin-top:12px"><h3>Rooms</h3><div id="rooms"></div></div>`}
function planRender(){const s=admData.stats,ev=s.perEvent;
  $('#food-tbl').innerHTML=`<div class="adm-tbl-wrap mini"><table class="adm-tbl rank food"><thead><tr><th>Event</th><th>Adults</th><th>Kids</th><th>Tentative</th><th>Plan for</th></tr></thead><tbody>${ev.map(e=>{const ad=e.yes-(e.yesKids||0),pl=e.yes+e.maybe;return`<tr><td>${esc(e.label)}</td><td data-v="${ad}"><b>${ad}</b></td><td data-v="${e.yesKids||0}">${e.yesKids||0}</td><td data-v="${e.maybe}">${e.maybe}</td><td data-v="${pl}"><b>${pl}</b></td></tr>`}).join('')}</tbody></table></div><p class="legend">“Plan for” adds tentative guests. Families who replied separately are counted once.</p>`;
  const R=(admData.extras||{}).rooms||{rooms:[],assign:{}},stay=admData.rsvps.filter(x=>going(x)&&x.accommodation),used={};
  stay.forEach(x=>{const r=R.assign[x.id];if(r)used[r]=(used[r]||0)+partyOf(x)});
  const free=stay.filter(x=>!R.assign[x.id]).reduce((a,x)=>a+partyOf(x),0);
  $('#rooms').innerHTML=`<div class="rooms">${R.rooms.map(r=>{const u=used[r.id]||0,pct=r.beds?Math.min(100,u/r.beds*100):0;return`<div class="room${u>r.beds?' over':''}"><input value="${esc(r.name)}" data-room-name="${esc(r.id)}" aria-label="Room name"><label>Beds <input type="number" min="0" max="50" value="${r.beds}" data-room-beds="${esc(r.id)}"></label><span class="room-bar"><i style="width:${pct}%"></i></span><small>${u} / ${r.beds} placed</small><button type="button" class="ib sm del" data-x="room-del" data-id="${esc(r.id)}" aria-label="Remove room">${ICO.trash}</button></div>`}).join('')}<button type="button" class="room add" data-x="room-add">${ICO.add}<span>Add a room</span></button></div>
   <div class="adm-chips left" style="margin-top:12px"><span class="ac ${free?'r':'g'}"><b>${free}</b> not placed</span><span class="ac"><b>${stay.reduce((a,x)=>a+partyOf(x),0)}</b> need a stay</span></div>
   <ul class="hx-list">${stay.map(x=>`<li class="hx-row"><span class="hx-main"><b>${esc(x.firstName+' '+x.lastName)}</b><small>${partyOf(x)} ${partyOf(x)>1?'people':'person'} · ${esc(dKey(x.arrival))} → ${esc(dKey(x.departure))}</small></span><select data-assign="${esc(x.id)}" aria-label="Room for ${esc(x.firstName)}"><option value="">Not placed</option>${R.rooms.map(r=>`<option value="${esc(r.id)}"${R.assign[x.id]===r.id?' selected':''}>${esc(r.name)}</option>`).join('')}</select></li>`).join('')||'<li class="adm-empty">Guests who need a stay appear here.</li>'}</ul>`}
let roomsT=0;
function roomsSave(){clearTimeout(roomsT);roomsT=setTimeout(async()=>{const R=admData.extras.rooms;try{await xapi('rooms',{rooms:R.rooms,assign:R.assign});toast('Rooms saved ✓')}catch{tell('Could not save the rooms.')}},700)}

function checkinPane(){return`<div class="af-seg ci-seg" role="group" aria-label="Event" id="ci-seg"></div><div class="ci-meter" id="ci-meter"></div><div class="adm-tools two"><input type="search" id="ci-q" placeholder="Find a guest" aria-label="Find a guest"></div><ul class="hx-list" id="ci-list"></ul><button type="button" class="btn more-btn" data-x="walkin">${ICO.add} Add a walk-in</button>`}
function ciRender(){const ev=admData.stats.perEvent;if(!HX.ci){const now=Date.now(),next=WEDDING.events.find(e=>+endOf(e)>now);HX.ci=next?next.id:ev[0].id}
  const e=ev.find(x=>x.id===HX.ci)||ev[0],ins=((admData.extras||{}).checkins||[]).filter(c=>c.event===e.id),arrived={};ins.forEach(c=>{const k=c.rsvpId||'walk:'+c.name;arrived[k]=Math.max(0,(arrived[k]||0)+(+c.count||0))});
  const total=Object.values(arrived).reduce((a,b)=>a+b,0),expect=e.yes,pct=expect?Math.min(100,total/expect*100):0;
  $('#ci-seg').innerHTML=ev.map(x=>`<button type="button" data-ci="${esc(x.id)}" aria-pressed="${x.id===e.id}">${esc(x.label.replace(/ \(.*\)$/,'').replace(/ \/.*$/,''))}</button>`).join('');
  $('#ci-meter').innerHTML=`<div class="ci-num"><b>${total}</b><span>of ${expect} expected${e.maybe?` (+${e.maybe} tentative)`:''}</span></div><span class="ci-bar"><i style="width:${pct}%"></i></span>`;
  const q=($('#ci-q')?.value||'').toLowerCase(),isPrivate=!WEDDING.events.some(w=>w.id===e.id);
  const guests=admData.rsvps.filter(x=>going(x)&&(isPrivate||x.events.includes(e.id))&&(!q||(x.firstName+' '+x.lastName).toLowerCase().includes(q)));
  const walk=Object.keys(arrived).filter(k=>k.startsWith('walk:')&&arrived[k]>0);
  $('#ci-list').innerHTML=guests.map(x=>{const a=arrived[x.id]||0,n=partyOf(x);return`<li class="hx-row ci${a?' in':''}"><span class="hx-main"><b>${esc(x.firstName+' '+x.lastName)}</b><small>${n} ${n>1?'people':'person'}${x.status==='maybe'?' · tentative':''}${a?` · ${a} arrived`:''}</small></span><button type="button" class="ci-btn" data-x="${a?'ci-undo':'ci-in'}" data-id="${esc(x.id)}" data-n="${a||n}" data-name="${esc(x.firstName+' '+x.lastName)}">${a?'✓ Here':'Arrived'}</button></li>`}).join('')+walk.map(k=>`<li class="hx-row ci in"><span class="hx-main"><b>${esc(k.slice(5))}</b><small>Walk-in · ${arrived[k]} arrived</small></span><button type="button" class="ci-btn" data-x="ci-undo" data-id="" data-n="${arrived[k]}" data-name="${esc(k.slice(5))}">✓ Here</button></li>`).join('')||'<li class="adm-empty">No guests for this event yet.</li>'}

function blessPane(){return`<div class="adm-chips left" id="bl-chips"></div><div class="bl-photos" id="bl-photos"></div>`}
function blRender(){if(!$('#bl-photos'))return;const E=admData.extras||{},P=E.photos||[];
  $('#bl-chips').innerHTML=`<span class="ac b"><b>${P.length}</b> photos</span><span class="ac ${E.photosOpen?'g':''}">Photo sharing ${E.photosOpen?'on':'off'}</span>`;
  $('#bl-photos').innerHTML=P.map(p=>`<figure class="bl-ph${p.hidden?' off':''}"><img src="${esc(thumb(p.fileId,300))}" alt="Photo by ${esc(p.name)}" loading="lazy"><figcaption>${esc(p.name)}</figcaption><span><button type="button" class="ib sm" data-x="photo-hide" data-id="${esc(p.id)}" data-h="${p.hidden?'':'1'}" aria-label="${p.hidden?'Show':'Hide'}">${p.hidden?'👁':'🙈'}</button><button type="button" class="ib sm del" data-x="photo-del" data-id="${esc(p.id)}" aria-label="Delete">${ICO.trash}</button></span></figure>`).join('')||'<p class="adm-empty">Guests’ photos will appear here once sharing opens.</p>'}
function hostRender(){admData.extras=Object.assign({invites:[],checkins:[],photos:[],thanked:{},rooms:{rooms:[],assign:{}}},admData.extras||{});invRender();planRender();ciRender();blRender()}

$('#admin').addEventListener('click',async e=>{const b=e.target.closest('[data-x],[data-inv],[data-ci]');if(!b)return;const E=admData.extras;
  if(b.dataset.inv){HX.inv=b.dataset.inv;$$('#admin [data-inv]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));invRender();return}
  if(b.dataset.ci){HX.ci=b.dataset.ci;ciRender();return}
  const id=b.dataset.id,x=b.dataset.x;
  try{
    if(x==='inv-add'){const lines=$('#inv-paste').value.split(/\n/).map(l=>l.trim()).filter(Boolean).map(l=>{const m=/^(.*?)[,;\t]+\s*([+\d][\d\s().-]{6,})$/.exec(l);return m?{name:m[1].trim(),phone:m[2]}:{name:l}});if(!lines.length)return;
      const bb=busyBtn(b,['Adding…']);try{const r=await xapi('invitesAdd',{list:lines});await bb.ok(`${r.added} added`);$('#inv-paste').value='';await reloadAdmin(true)}finally{bb.end()}}
    if(x==='inv-del'&&await ask('They stay on any RSVP they sent; this only removes them from your invite list.',{title:'Remove from the list?',ok:'Remove'})){await xapi('inviteDelete',{id});E.invites=E.invites.filter(i=>i.id!==id);invRender();toast('Removed')}
    if(x==='nudge'){const i=E.invites.find(v=>v.id===id);if(i&&!i.nudgedAt){i.nudgedAt=new Date().toISOString();invRender();xapi('inviteMark',{id,field:'nudgedAt'}).catch(()=>{})}}
    if(x==='thank'){E.thanked=E.thanked||{};if(!E.thanked[id]){E.thanked[id]=new Date().toISOString();invRender();xapi('thank',{id}).catch(()=>{})}}
    if(x==='food-csv'){const rows=[['Event','Adults','Kids','Tentative','Plan for']].concat(admData.stats.perEvent.map(v=>[v.label,v.yes-(v.yesKids||0),v.yesKids||0,v.maybe,v.yes+v.maybe]));const url=URL.createObjectURL(new Blob([rows.map(r=>r.map(c=>/[",]/.test(c)?`"${String(c).replace(/"/g,'""')}"`:c).join(',')).join('\n')],{type:'text/csv'})),l=document.createElement('a');l.href=url;l.download='food-per-event.csv';l.click();setTimeout(()=>URL.revokeObjectURL(url),4000);toast('Caterer CSV downloaded')}
    if(x==='room-add'){E.rooms.rooms.push({id:Math.random().toString(36).slice(2,10),name:`Room ${E.rooms.rooms.length+1}`,beds:2});planRender();roomsSave()}
    if(x==='room-del'){E.rooms.rooms=E.rooms.rooms.filter(r=>r.id!==id);Object.keys(E.rooms.assign).forEach(k=>{if(E.rooms.assign[k]===id)delete E.rooms.assign[k]});planRender();roomsSave()}
    if(x==='ci-in'||x==='ci-undo'){const n=+b.dataset.n||1,rec={at:new Date().toISOString(),event:HX.ci,rsvpId:id,name:b.dataset.name,count:x==='ci-in'?n:-n};b.disabled=true;
      E.checkins.push(rec);ciRender();if(x==='ci-in'){toast(`${b.dataset.name} · ${n} arrived ✓`)}
      try{await xapi('checkin',rec)}catch(err){E.checkins.pop();ciRender();throw err}}
    if(x==='walkin'){const name=(prompt('Walk-in name')||'').trim();if(!name)return;const n=Math.max(1,Math.min(20,parseInt(prompt('How many people?','1')||'1',10)||1));const rec={at:new Date().toISOString(),event:HX.ci,rsvpId:'',name,count:n};E.checkins.push(rec);ciRender();await xapi('checkin',rec);toast(`${name} · ${n} arrived ✓`)}
    if(x==='photo-hide'){const it=E.photos.find(v=>v.id===id);it.hidden=!!b.dataset.h;blRender();await xapi('photoHide',{id,hidden:it.hidden});toast(it.hidden?'Hidden from the site':'Shown on the site')}
    if(x==='photo-del'&&await ask('The photo also goes to the Drive trash.',{title:'Delete this photo?',ok:'Delete'})){
      b.closest('figure')?.classList.add('gone');await xapi('photoDelete',{id});E.photos=E.photos.filter(v=>v.id!==id);setTimeout(blRender,300);toast('Deleted')}
  }catch(err){tell('Could not reach the server. Please try again.')}});
$('#admin').addEventListener('input',e=>{const t=e.target;if(t.id==='inv-q'){HX.invQ=t.value;invRender()}if(t.id==='ci-q')ciRender();
  const R=admData&&admData.extras&&admData.extras.rooms;if(!R)return;
  if(t.dataset.roomName){const r=R.rooms.find(v=>v.id===t.dataset.roomName);if(r){r.name=t.value;roomsSave()}}
  if(t.dataset.roomBeds){const r=R.rooms.find(v=>v.id===t.dataset.roomBeds);if(r){r.beds=Math.max(0,Math.min(50,+t.value||0));roomsSave()}}});
$('#admin').addEventListener('change',e=>{const t=e.target;if(!t.dataset.assign)return;const R=admData.extras.rooms;if(t.value)R.assign[t.dataset.assign]=t.value;else delete R.assign[t.dataset.assign];planRender();roomsSave()});
const ACT={created:'Sent RSVP',updated:'Updated',withdrawn:'Withdrew','edited by admin':'Edited by you','added by admin':'Added by you','deleted by admin':'Deleted by you'};
const FLD={headcount:'Headcount',firstName:'First name',lastName:'Last name',plusOnes:'Plus-ones',kids:'Kids',accommodation:'Stay',arrival:'Arriving',departure:'Leaving',events:'Events',travel:'Travel',flight:'Flight',food:'Food',message:'Note',status:'Reply',gender:'Gender',phone:'WhatsApp',email:'Email'};
const actTone=a=>/delet|withdr/.test(a)?'r':/creat|add/.test(a)?'g':'a';
const EVT=Object.fromEntries(WEDDING.events.map(e=>[e.title,e]));
const evWhen=e=>`${weekday(e).slice(0,3)} ${e.d} ${MON[e.m-1].slice(0,3)} · ${time12(e.t)}`;
// Events as a numbered, dated mini-timeline in wedding order; added ones in green, dropped ones struck through.
function evTimeline(before,after,only){const split=v=>String(v||'').split(', ').map(t=>t.trim()).filter(Boolean);
  const B=new Set(only==='after'?[]:split(before)),A=new Set(only==='before'?[]:split(after)),order=t=>EVT[t]?WEDDING.events.indexOf(EVT[t]):99;
  const all=[...new Set([...B,...A])].sort((x,y)=>order(x)-order(y));if(!all.length)return'<span class="muted">No events</span>';
  return`<ol class="evl">${all.map((t,i)=>{const e=EVT[t],st=only==='before'?'drop':only?'':A.has(t)&&!B.has(t)?'add':B.has(t)&&!A.has(t)?'drop':'';
    return`<li class="${st}" style="--c:${esc(e?e.accent:'#b8862b')}"><i class="evn">${i+1}</i>${e?`<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[e.icon]||''}</svg>`:'<span></span>'}<span><b>${esc(t)}</b>${e?`<small>${esc(evWhen(e))}</small>`:''}</span>${st&&!only?`<em>${st==='add'?'added':'dropped'}</em>`:''}</li>`}).join('')}</ol>`}
const pillOf=v=>{const k={attending:'yes',tentative:'maybe',withdrawn:'withdrawn'}[String(v).toLowerCase()]||(/not|can|declin/i.test(v)?'no':'');return k?`<span class="pill ${k}">${esc(v)}</span>`:esc(v)};
function chgVal(c,only){const f=c.field,b=c.before,a=c.after;if(f==='events')return evTimeline(b,a,only);
  const show=v=>{v=String(v??'');if(!v)return'<span class="muted">—</span>';if(f==='status')return pillOf(v);if(f==='arrival'||f==='departure')return`<span class="dchip">${ICO.clock}${esc(v)}</span>`;
    if(f==='message')return`<q>${esc(v)}</q>`;if(f==='accommodation')return`<span class="dchip">${esc(v)}</span>`;return`<span>${esc(v)}</span>`};
  if(only==='after')return show(a);if(only==='before')return`<span class="was">${show(b)}</span>`;
  const d=f==='headcount'||f==='kids'?(+a||0)-(+b||0):0;
  return`<span class="was">${show(b)}</span><i class="arr" aria-hidden="true">→</i>${show(a)}${d?`<span class="delta ${d>0?'up':'down'}">${d>0?'+':'−'}${Math.abs(d)}</span>`:''}`}
function histItem(h,withName=true,step){const ch=h.changes||[],only=/creat|add/.test(h.action)?'after':/delet/.test(h.action)?'before':'';
  return`<li class="hx-ev ${actTone(h.action)}"${step?` data-step="${step}"`:''}><div class="hx-ev-h">${withName?`<b>${esc(h.name)}</b>`:''}<span class="adm-tag ${actTone(h.action)}">${esc(ACT[h.action]||h.action)}</span><time datetime="${esc(h.at)}">${esc(fmtTime(h.at))}</time></div>${ch.length?`<dl class="chg">${ch.map(c=>`<dt>${esc(FLD[c.field]||c.field)}</dt><dd>${chgVal(c,only)}</dd>`).join('')}</dl>`:''}</li>`}
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
// History grouped per guest: newest activity first, and each guest's latest change on top (numbered in the order they happened).
function admHist(){const q=($('#adm-hq')?.value||'').toLowerCase(),a=$('#adm-ha')?.value||'',el=$('#adm-hist');if(!el)return;
  const hit=h=>!a||(a==='admin'?/admin/.test(h.action):a==='headcount'?h.changes.some(c=>c.field==='headcount'):h.action===a);
  const cur=Object.fromEntries(admData.rsvps.map(x=>[x.id,x])),groups={};
  admData.history.forEach(h=>{const r=cur[h.id],name=r?`${r.firstName} ${r.lastName}`:h.name;if(q&&!(name+' '+h.name).toLowerCase().includes(q)||!hit(h))return;(groups[h.id||h.name]=groups[h.id||h.name]||{id:h.id,name,list:[]}).list.push(h)});
  const gs=Object.values(groups).map(g=>{g.list.sort((x,y)=>x.at<y.at?1:x.at>y.at?-1:0);g.last=g.list[0].at;return g}).sort((x,y)=>x.last<y.last?1:-1);
  el.innerHTML=gs.slice(0,200).map((g,i)=>{const r=cur[g.id],st=r?r.status:'deleted',ini=g.name.split(/\s+/).map(w=>w[0]||'').join('').slice(0,2).toUpperCase(),party=r&&(st==='yes'||st==='maybe')?1+r.plusOnes.length+(+r.kids||0):0;
    return`<details class="hg ${esc(st)}"${i<5||q?' open':''} style="--i:${Math.min(i,12)}"><summary><span class="hg-av" aria-hidden="true">${esc(ini)}</span><span class="hg-n"><b>${esc(g.name)}</b><small>${g.list.length} change${g.list.length>1?'s':''} · ${esc(fmtTime(g.last))}</small></span><span class="hg-tags">${r?`<span class="pill ${esc(st)}">${STL[st]||esc(st)}</span>`:'<span class="pill withdrawn">Deleted</span>'}${party?`<span class="ac">${party} ${party>1?'people':'person'}</span>`:''}</span><i class="hg-chev" aria-hidden="true"></i></summary><ol class="adm-tl hg-tl">${g.list.map((h,k)=>histItem(h,false,g.list.length-k)).join('')}</ol></details>`}).join('')||'<p class="adm-empty">No changes match.</p>';
  const n=$('#hg-count');if(n)n.textContent=`${gs.length} guest${gs.length===1?'':'s'} · ${gs.reduce((t,g)=>t+g.list.length,0)} changes`}
$('#admin').addEventListener('input',e=>{if(e.target.closest('#adm-guests .adm-tools'))admRows();if(e.target.closest('#adm-history .adm-tools'))admHist();
  if(e.target.id==='an-q'){const q=e.target.value.trim().toLowerCase();e.target.nextElementSibling.querySelectorAll('tbody tr').forEach(r=>{r.hidden=!!q&&!r.textContent.toLowerCase().includes(q)})}});
$('#admin').addEventListener('change',e=>{const t=e.target;if(!t.closest('#af'))return;
  if(t.id==='af-from'||t.id==='af-to'){AF.from=$('#af-from').value;AF.to=$('#af-to').value;if(AF.from&&AF.to&&AF.from>AF.to)[AF.from,AF.to]=[AF.to,AF.from]}
  else if(t.id==='af-h0'||t.id==='af-h1')AF[t.id.slice(3)]=+t.value;else if(t.id==='af-who')AF.who=t.value;
  else if(t.dataset.dim){if(t.value)AF.dims[t.dataset.dim]=t.value;else delete AF.dims[t.dataset.dim]}
  anRender()});
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
    ed.status.value=x.status==='withdrawn'?'no':x.status;ed.gender.value=x.gender||'';const ai=dIdx(x.arrival),di=dIdx(x.departure);ed.arrival.value=ai>=0?ai:0;ed.departure.value=di>0?di:RDAYS.length-1;
    x.plusOnes.forEach(p=>edPoRow(p));ed.kids.value=x.kids||0;ed.accommodation.checked=!!x.accommodation;ed.message.value=x.message||''}
  else{ed.arrival.value=0;ed.departure.value=RDAYS.length-1;ed.kids.value=0}
  edEvents();$('#adm-edit').showModal()}
ed.addEventListener('submit',async e=>{e.preventDefault();const er=$('#ed-error'),a=+ed.arrival.value,b=+ed.departure.value,st=ed.status.value,evs=st==='no'?[]:inRange(a,b).map(x=>x.id);er.textContent='';
  if(!ed.firstName.value.trim()){er.textContent='First name is required.';return}
  if(st!=='no'&&b<=a){er.textContent='Leaving must be after arriving.';return}
  const rsvp={firstName:ed.firstName.value,lastName:ed.lastName.value,phone:ed.cc.value==='other'?{cc:'',number:ed.phone.value}:{cc:ed.cc.value,number:ed.phone.value},status:st,gender:ed.gender.value,arrival:a,departure:b,events:evs,
    plusOnes:[...$('#ed-po').children].map(r=>({name:r.querySelector('input').value,gender:r.querySelector('select').value})),kids:Math.max(0,Math.min(10,parseInt(ed.kids.value||'0',10)||0)),accommodation:ed.accommodation.checked,message:ed.message.value};
  const btn=ed.querySelector('[type=submit]');btn.disabled=true;
  try{const r=await api({action:'adminSave',password:admPw,id:edId,rsvp});if(r.ok){$('#adm-edit').close();await reloadAdmin();toast(edId?'Saved':'Guest added')}else er.textContent=r.error==='exists'?'Another RSVP already uses this WhatsApp number.':r.error==='invalid'?'Please check: '+Object.keys(r.fields||{}).join(', '):'Could not save.'}
  catch{er.textContent='Could not reach the server.'}finally{btn.disabled=false}});
function saveAdmKeep(){admKeep={};['q','st','stay','sort','hq','ha'].forEach(k=>{const el=$('#adm-'+k);if(el)admKeep[k]=el.value})}
const admSigOf=r=>JSON.stringify([r.rsvps,r.history.slice(0,5),r.history.length,(r.visits.log||[]).length,(r.visits.log||[]).slice(-40),r.mail]);
async function reloadAdmin(manual){const a=$('#admin'),t0=Date.now();const r=await api({action:'admin',password:admPw});if(!r.ok||!admPw)throw new Error(r.error||'failed');
  // Keep the refresh spinner visible long enough to read as feedback.
  if(manual)await new Promise(res=>setTimeout(res,Math.max(0,750-(Date.now()-t0))));const top=a.scrollTop;
  const sig=admSigOf(r);
  if(!manual&&sig===admSig){admData.generatedAt=r.generatedAt;const u=$('#adm-upd');if(u)u.textContent=timeOnly(r.generatedAt);return}
  admSig=sig;saveAdmKeep();admData=tidyAdm(r);const more=$('#af-more')?.classList.contains('open');renderAdmin(!manual);if(more)setCollapse($('#af-more'),true);a.scrollTo({top,behavior:'instant'})}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}
$('#admin').addEventListener('click',async e=>{const a=e.target.closest('[data-a]'),tab=e.target.closest('[data-tab]'),hb=e.target.closest('[data-hist]'),del=e.target.closest('[data-del]'),edit=e.target.closest('[data-edit]');
  if(edit){openEditor(admData.rsvps.find(x=>x.id===edit.dataset.edit));return}
  if(tab){const order=['overview','guests','invites','plan','checkin','bless','history','visits'],from=order.indexOf(admTab);admTab=tab.dataset.tab;const dir=order.indexOf(admTab)>=from?'r':'l';
    $('#admin').querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===tab)));
    $('#admin').querySelectorAll('.adm-pane').forEach(p=>{const on=p.id==='adm-'+admTab;p.hidden=!on;if(on){p.classList.remove('from-l','from-r');void p.offsetWidth;p.classList.add('from-'+dir)}});
    const nav=$('#admin .adm-tabs');if(nav&&$('#admin').scrollTop>nav.offsetTop)$('#admin').scrollTo({top:nav.offsetTop,behavior:'smooth'});return}
  const th=e.target.closest('.adm-tbl th');if(th&&th.textContent.trim()){sortTable(th);return}
  const lv=e.target.closest('[data-dim-k]');if(lv){AF.dims[lv.dataset.dimK]=lv.dataset.dimV;anRender();toast(`Showing ${DIM[lv.dataset.dimK].l.toLowerCase()}: ${lv.dataset.dimV}`);return}
  const rg=e.target.closest('[data-range]');if(rg){AF.range=rg.dataset.range;setCollapse($('#af-custom'),AF.range==='custom');anRender();return}
  const ud=e.target.closest('[data-undim]');if(ud){delete AF.dims[ud.dataset.undim];anRender();return}
  if(e.target.closest('[data-unwho]')){AF.who='';anRender();return}
  if(e.target.closest('[data-unhours]')){AF.h0=0;AF.h1=23;anRender();return}
  if(hb){const list=$('#admin').querySelector(`[data-hist-for="${CSS.escape(hb.dataset.hist)}"]`);if(list){list.hidden=!list.hidden;hb.setAttribute('aria-expanded',String(!list.hidden))}return}
  const vw=e.target.closest('[data-view]');if(vw){admView=vw.dataset.view;saveAdmKeep();renderAdmin();return}
  const gh=e.target.closest('[data-goto-hist]');if(gh){saveAdmKeep();admKeep.hq=gh.dataset.gotoHist;admKeep.ha='';admTab='history';renderAdmin();$('#admin').scrollTop=0;return}
  if(del&&await ask('This also removes it from the Google Sheet.',{title:'Delete this RSVP permanently?',ok:'Delete',cancel:'Cancel'})){try{const r=await api({action:'adminDelete',password:admPw,id:del.dataset.del});if(r.ok){await reloadAdmin();toast('Deleted')}else tell('Delete failed. Please try again.')}catch{tell('Could not reach the server.')}return}
  if(!a)return;
  if(a.dataset.a==='add')openEditor(null);
  if(a.dataset.a==='close'){toast('Logged out');closeAdmin()}
  if(a.dataset.a==='refresh'){if(a.classList.contains('spin'))return;a.classList.remove('ok','bad');a.classList.add('spin');
    try{await reloadAdmin(true);const b=$('#admin [data-a=refresh]');if(b){b.classList.add('ok');setTimeout(()=>b.classList.remove('ok'),1600)}toast('Refreshed ✓')}
    catch{const b=$('#admin [data-a=refresh]')||a;b.classList.remove('spin');b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),700);tell('Could not reach the server.')}
    finally{const b=$('#admin [data-a=refresh]');if(b)b.classList.remove('spin');a.classList.remove('spin')}}
  if(a.dataset.a==='af-more'){const c=$('#af-more'),open=!c.classList.contains('open');setCollapse(c,open);a.setAttribute('aria-expanded',String(open));a.classList.toggle('on',open)}
  if(a.dataset.a==='hg-all'){const ds=$$('#adm-hist details'),open=ds.some(d=>!d.open);ds.forEach(d=>{d.open=open});a.textContent=open?'Collapse all':'Expand all'}
  if(a.dataset.a==='backup'&&await ask('A copy of every tab (RSVPs, history, visits, photos, invites, check-ins) will be emailed to you as CSV files.',{title:'Email me a backup?',ok:'Send backup'})){a.classList.add('spin');try{const r=await xapi('backup');toast(`Backup emailed ✓ (${r.files} files)`)}catch{tell('Could not send the backup.')}a.classList.remove('spin')}
  if(a.dataset.a==='lg-copy'){const n=($('#lg-name').value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24);if(!n){$('#lg-name').focus();return}
    const url=`${SITE.split('?')[0]}?src=${n}`;try{await navigator.clipboard.writeText(url);toast('Link copied ✓')}catch{}$('#lg-out').innerHTML=`<code>${esc(url)}</code>`}
  if(a.dataset.a==='af-reset'){Object.assign(AF,{h0:0,h1:23,who:'',dims:{}});anRender()}
  if(a.dataset.a==='an-more'){anShown+=40;anRender({keep:true,instant:true})}
  if(a.dataset.a==='vdel'){const [f,t]=afRange(),days=(admSessions||[]).map(x=>x.d).sort(),vf=$('#vdel-form');vf.from.value=f>'0000-00-00'?f:(days[0]||dayKey(Date.now()));vf.to.value=t<'9999-99-99'?t:(days[days.length-1]||dayKey(Date.now()));$('#vdel-error').textContent='';$('#adm-vdel').showModal()}
  if(a.dataset.a==='csv'){const cell=v=>{let s=Array.isArray(v)?v.map(p=>typeof p==='object'?[p.name,p.gender].filter(Boolean).join(' / '):p).join(' | '):String(v??'');if(/^[=+\-@]/.test(s))s="'"+s;return/[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
    a.classList.remove('pop');void a.offsetWidth;a.classList.add('pop');
    const visits=admTab==='visits',cols=visits?['at','who','returning','place','device','os','browser','source','tz','duration','scroll','sections','actions','rsvp']:['firstName','lastName','status','gender','phone','email','arrival','departure','events','plusOnes','kids','accommodation','travel','flight','food','message','createdAt','updatedAt'];
    const data=visits?afApply(admSessions||[]).slice().reverse().map(r=>({at:fmtTime(r.at),who:r.p.slice(0,6),returning:r.multi?'yes':'no',place:joinPlace(r.city,r.region,r.country),device:r.device,os:r.os,browser:r.browser,source:r.source,tz:r.tz,duration:r.dur,scroll:r.scroll,sections:[...r.sec],actions:Object.keys(r.act).filter(k=>r.act[k]>0),rsvp:r.rsvp})):admData.rsvps;
    const csv=[cols.join(',')].concat(data.map(x=>cols.map(c=>cell(x[c])).join(','))).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'})),l=document.createElement('a');l.href=url;l.download=visits?'visits.csv':'rsvps.csv';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast(`${visits?'Visits':'RSVPs'} CSV downloaded`)}});
async function vdelRun(body,label){const er=$('#vdel-error'),btns=$$('#vdel-form button');btns.forEach(b=>{b.disabled=true});er.textContent='';
  try{const r=await api(Object.assign({action:'adminVisitsDelete',password:admPw},body));if(!r.ok){er.textContent=r.error==='invalid'?'Please pick valid dates.':'Could not delete.';return}
    $('#adm-vdel').close();await reloadAdmin(true);toast(`Deleted ${r.removed} visit row${r.removed===1?'':'s'}${label}`)}
  catch{er.textContent='Could not reach the server.'}finally{btns.forEach(b=>{b.disabled=false})}}
$('#vdel-form').addEventListener('submit',e=>{e.preventDefault();const f=e.target;if(!f.from.value||!f.to.value){$('#vdel-error').textContent='Pick both dates.';return}
  const [a,b]=[f.from.value,f.to.value].sort();vdelRun({from:a,to:b},a===b?` from ${a}`:` from ${a} to ${b}`)});
$('#vdel-all').addEventListener('click',async()=>{$('#adm-vdel').close();if(await ask('Every visit and all analytics will be removed from the Google Sheet. RSVPs are not affected.',{title:'Delete all analytics?',ok:'Delete everything',cancel:'Keep'})){$('#adm-vdel').showModal();vdelRun({all:true},'')}});
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
// The 3D library arrives just after the page is ready (hx:three); a tap that came first still gets its petal shower.
function startThree(){try{
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
}catch(err){console.warn('Invitation artwork remains available without WebGL.',err&&err.message)}}
if(window.THREE)startThree();else addEventListener('hx:three',()=>{startThree();if(opened&&shower)shower()},{once:true});
})();
