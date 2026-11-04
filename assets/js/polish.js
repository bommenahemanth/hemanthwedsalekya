
/* Navigation, reveals, small touches, photo helpers and sharing. Runs last, after the invitation is built. */
(()=>{'use strict';
 const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
 const root=document.documentElement,body=document.body,motion=matchMedia('(prefers-reduced-motion: reduce)');
 const calm=()=>motion.matches||body.classList.contains('calm');
 const glide=el=>{if(el)el.scrollIntoView({behavior:calm()?'auto':'smooth',block:'start'})};
 const tick=()=>{try{if(navigator.vibrate)navigator.vibrate(8)}catch{}};
 const once=(el,fn,threshold=.6)=>{if(!el)return;const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();fn()}},{threshold});io.observe(el)};

 /* ---------- Garland progress line and diya section lamps ---------- */
 const sections=[['#hero','Welcome'],['.events','Celebrations'],['#rsvp','RSVP'],['#photos','Photos']].map(([s,label])=>({el:$(s),label})).filter(s=>s.el);
 const bar=document.createElement('div');bar.className='ux-progress';bar.setAttribute('aria-hidden','true');bar.innerHTML='<i></i>';
 const nav=document.createElement('nav');nav.className='ux-dots';nav.setAttribute('aria-label','Invitation sections');
 nav.innerHTML=sections.map((s,i)=>`<button type="button" data-i="${i}" aria-label="Go to ${s.label}"><i></i><span>${s.label}</span></button>`).join('');
 body.append(bar,nav);
 const lamps=$$('.ux-dots button');
 nav.addEventListener('click',e=>{const b=e.target.closest('button');if(b){tick();glide(sections[+b.dataset.i].el)}});
 let current=-1,sayT=0,raf=0;
 function setCurrent(i,announce){
   if(i===current)return;current=i;
   lamps.forEach((b,j)=>b.setAttribute('aria-current',String(j===i)));
   if(announce&&!calm()){clearTimeout(sayT);lamps.forEach(b=>b.classList.remove('ux-say'));lamps[i].classList.add('ux-say');sayT=setTimeout(()=>lamps[i].classList.remove('ux-say'),1400)}
 }
 function onScroll(){
   if(raf)return;
   raf=requestAnimationFrame(()=>{
     raf=0;const max=root.scrollHeight-innerHeight,on=root.classList.contains('ux-on');
     bar.style.setProperty('--ux-p',max>0?Math.min(1,Math.max(0,scrollY/max)).toFixed(4):'0');
     let idx=0;sections.forEach((s,i)=>{if(s.el.getBoundingClientRect().top<=innerHeight*.45)idx=i});
     setCurrent(idx,on);
     if(on&&scrollY>40)root.classList.add('ux-scrolled');
   });
 }
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});
 setCurrent(0,false);
 const turnOn=()=>{if(!root.classList.contains('ux-on')){root.classList.add('ux-on');onScroll()}};
 const watchOpen=()=>{if(body.classList.contains('opening-complete'))turnOn();else if(body.classList.contains('opened'))setTimeout(turnOn,9500)};
 new MutationObserver(watchOpen).observe(body,{attributes:true,attributeFilter:['class']});watchOpen();
 document.addEventListener('click',e=>{
   const a=e.target.closest('a[href^="#"]'),id=a&&a.getAttribute('href');
   const target=id&&id.length>1&&document.getElementById(id.slice(1));
   if(target){e.preventDefault();glide(target)}
 });
 const cue=$('.cue');if(cue)cue.addEventListener('click',()=>glide(sections[1]&&sections[1].el));

 /* ---------- Kolam dividers that draw themselves ---------- */
 function kolam(){
   const ns='http://www.w3.org/2000/svg',n=7,gap=30,W=240,H=52,cy=26,x0=(W-(n-1)*gap)/2;
   const wave=sign=>{let d=`M${x0-gap/2} ${cy}`;for(let i=0;i<n;i++){const x=x0+i*gap;d+=` Q${x} ${cy+(i%2?1:-1)*sign*22} ${x+gap/2} ${cy}`}return d};
   const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('class','ux-kolam');svg.setAttribute('aria-hidden','true');
   [['k1',1],['k2',-1]].forEach(([cls,sign])=>{const p=document.createElementNS(ns,'path');p.setAttribute('class',cls);p.setAttribute('d',wave(sign));svg.append(p)});
   for(let i=0;i<n;i++){const c=document.createElementNS(ns,'circle');c.setAttribute('cx',x0+i*gap);c.setAttribute('cy',cy);c.setAttribute('r',2.3);c.style.transitionDelay=`${.5+i*.12}s`;svg.append(c)}
   return svg;
 }
 [$$('.events .tz-note').pop(),$('#rsvp .reach')].forEach(anchor=>{
   if(!anchor)return;const k=kolam();anchor.after(k);
   k.querySelectorAll('path').forEach(p=>p.style.setProperty('--len',Math.ceil(p.getTotalLength()+2)));
   if(calm())k.classList.add('ux-drawn');else once(k,()=>k.classList.add('ux-drawn'),.8);
 });

 /* ---------- A soft lamp-glow across each heading as it arrives ---------- */
 $$('h2.title').forEach(h=>once(h,()=>{if(calm())return;setTimeout(()=>{h.classList.add('ux-shine');h.addEventListener('animationend',()=>h.classList.remove('ux-shine'),{once:true})},650)},.8));

 /* ---------- "Today" glow on the event happening today (wedding time zone) ---------- */
 const S=window.HX_SCHEDULE;
 function today(){
   if(!S)return;
   const m=/^([+-])(\d\d):(\d\d)$/.exec(S.tz||''),off=m?(m[1]==='-'?-1:1)*(+m[2]*60+ +m[3]):0;
   const now=new Date(Date.now()+off*6e4),y=now.getUTCFullYear(),mo=now.getUTCMonth()+1,d=now.getUTCDate(),mins=now.getUTCHours()*60+now.getUTCMinutes();
   $$('.tl-item').forEach((li,i)=>{
     const e=S.events[i];if(!e)return;
     const [hh,mm]=e.t.split(':').map(Number),start=hh*60+mm,end=start+(e.hrs||3)*60;
     const on=y===S.year&&mo===e.m&&d===e.d&&mins<end,card=li.querySelector('.card');
     li.classList.toggle('ux-today',on);
     let badge=li.querySelector('.ux-today-badge');
     if(on&&card){if(!badge){badge=document.createElement('span');badge.className='ux-today-badge';card.append(badge)}badge.textContent=mins>=start?'Happening now':'Today'}
     else if(badge)badge.remove();
   });
 }
 today();setInterval(today,6e4);

 /* ---------- RSVP celebration: flowers and a temple bell for yes / maybe, a quiet glow otherwise ---------- */
 function burst(el){
   const art=window.HX_CEREMONY_ART||{},keys=['jasmineFlower','banthiOrange','banthiYellow','roseFlower','lotusFlower'].filter(k=>art[k]);
   if(calm()||!keys.length||!el)return;
   const r=el.getBoundingClientRect(),ox=r.left+r.width/2,oy=r.top+r.height/2,layer=document.createElement('div');
   layer.className='ux-burst';layer.setAttribute('aria-hidden','true');body.append(layer);
   const n=innerWidth<500?22:30;let left=n;
   for(let i=0;i<n;i++){
     const im=new Image(),s=18+Math.random()*16;im.src=art[keys[i%keys.length]];im.alt='';im.style.width=im.style.height=s+'px';layer.append(im);
     const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.3,v=120+Math.random()*170,dx=Math.cos(a)*v,dy=Math.sin(a)*v,fall=260+Math.random()*220,rot=(Math.random()-.5)*540,x=ox-s/2,y=oy-s/2;
     im.animate([
       {transform:`translate(${x}px,${y}px) scale(.3)`,opacity:0},
       {transform:`translate(${x+dx*.55}px,${y+dy*.55}px) scale(1) rotate(${rot*.4}deg)`,opacity:1,offset:.25},
       {transform:`translate(${x+dx}px,${y+dy+fall}px) scale(.9) rotate(${rot}deg)`,opacity:0}
     ],{duration:1900+Math.random()*900,easing:'cubic-bezier(.2,.6,.35,1)',fill:'forwards'}).onfinish=()=>{if(--left===0)layer.remove()};
   }
 }
 // Akshintalu: turmeric rice showered over the confirmation, as elders do at the muhurtham.
 function rice(el){
   if(calm()||!el)return;
   const r=el.getBoundingClientRect(),n=innerWidth<500?50:80;
   for(let i=0;i<n;i++){
     const g=document.createElement('i'),x=r.left+Math.random()*r.width,y0=-20-Math.random()*140,y1=Math.max(40,r.top)+r.height*(.25+Math.random()*.6),rot=Math.random()*720,dx=(Math.random()-.5)*70;
     g.className='rice';g.setAttribute('aria-hidden','true');body.append(g);
     g.animate([{transform:`translate(${x}px,${y0}px) rotate(0deg)`,opacity:1},{transform:`translate(${x+dx}px,${y1}px) rotate(${rot}deg)`,opacity:1,offset:.85},{transform:`translate(${x+dx*1.2}px,${y1+12}px) rotate(${rot+40}deg)`,opacity:0}],
       {duration:1500+Math.random()*900,delay:Math.random()*600,easing:'cubic-bezier(.35,.1,.6,1)',fill:'both'}).onfinish=()=>g.remove();
   }
 }
 function chime(){
   const bgm=$('#bgm');if(!bgm||bgm.paused)return;
   try{
     const AC=window.AudioContext||window.webkitAudioContext,ctx=chime.ctx||(chime.ctx=new AC()),t=ctx.currentTime+.02,out=ctx.createGain();
     out.gain.value=.16;out.connect(ctx.destination);
     [[1,1],[2.76,.45],[5.4,.22],[8.93,.1]].forEach(([ratio,g])=>{
       const o=ctx.createOscillator(),v=ctx.createGain();o.type='sine';o.frequency.value=523.25*ratio;
       v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(g,t+.008);v.gain.exponentialRampToValueAtTime(.0001,t+2.8/(ratio*.6+.4));
       o.connect(v).connect(out);o.start(t);o.stop(t+3);
     });
   }catch{}
 }
 document.addEventListener('hx:rsvp',e=>{
   const st=e.detail&&e.detail.status,card=$('#rsvp-done');if(!card)return;
   if(st==='yes'||st==='maybe')setTimeout(()=>{burst(card.querySelector('.tick')||card);rice(card);chime()},700);
   else{card.classList.remove('ux-soft');void card.offsetWidth;card.classList.add('ux-soft')}
 });

 /* ---------- Tap feedback and gentle form errors ---------- */
 document.addEventListener('pointerdown',e=>{if(e.target.closest('.status-choices .chip,.chips .chip,.stepper button,#rsvp-submit,.switch,.msg-chips button,#fab,.car-dots button,.date-btn,.ux-share'))tick()},{passive:true});
 const submit=$('#rsvp-submit');
 if(submit)submit.addEventListener('click',()=>setTimeout(()=>$$('#rsvp-form .invalid').forEach(el=>{el.classList.remove('ux-nudge');void el.offsetWidth;el.classList.add('ux-nudge')}),40));

 /* ---------- Photos: counter, one-time swipe hint, blur-up ---------- */
 const carousel=$('#carousel'),dotsBox=$('#car-dots');
 if(carousel&&dotsBox){
   const count=document.createElement('p');count.className='ux-count';count.setAttribute('aria-hidden','true');dotsBox.after(count);
   const update=()=>{const b=Array.from(dotsBox.children),i=b.findIndex(x=>x.getAttribute('aria-current')==='true');count.textContent=b.length>1?`${Math.max(0,i)+1} / ${b.length}`:''};
   new MutationObserver(update).observe(dotsBox,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-current']});update();
   let seen=false;try{seen=localStorage.getItem('hx-swipe-hint')==='1'}catch{}
   if(!seen&&matchMedia('(pointer: coarse)').matches){
     const hint=document.createElement('div');hint.className='ux-swipe';hint.setAttribute('aria-hidden','true');hint.innerHTML='<b>\u2039</b> Swipe <b>\u203a</b>';carousel.append(hint);
     const done=()=>{hint.classList.remove('show');setTimeout(()=>hint.remove(),600);try{localStorage.setItem('hx-swipe-hint','1')}catch{}};
     once(carousel,()=>{hint.classList.add('show');setTimeout(done,3200)});
     carousel.addEventListener('touchstart',done,{once:true,passive:true});
   }
   $$('#track .slide').forEach(slide=>{
     const im=slide.querySelector('img');if(!im)return;
     const src=im.getAttribute('src')||im.dataset.src||'',thumb=/^photos\/\d+\.(jpg|webp)$/.test(src)?src.replace('photos/','photos/thumbs/').replace(/\.webp$/,'.jpg'):'';
     if(thumb){slide.style.backgroundImage=`url("${thumb}")`;slide.classList.add('ux-thumb')}
     if(im.complete&&im.naturalWidth)return;
     const ready=()=>im.classList.remove('ux-wait');
     im.classList.add('ux-fade','ux-wait');im.addEventListener('load',ready,{once:true});im.addEventListener('error',ready,{once:true});
   });
 }

 /* ---------- Share the invitation ---------- */
 const shareUrl='https://bommenahemanth.github.io/hemanthwedsalekya/';
 const sig=$('#photos .ux-kolam')||$('#photos .signature-scene');
 if(sig){
   const wrap=document.createElement('div');wrap.className='ux-share-wrap';
   wrap.innerHTML='<button type="button" class="btn solid ux-share"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4"/></svg>Share</button>';
   sig.after(wrap);
   wrap.querySelector('button').addEventListener('click',async()=>{
     const text='Hemanth & Alekya invite you to their wedding celebrations \u00b7 1 \u2013 3 Dec 2026 \ud83d\ude4f';
     // Link goes in the text: with a separate url field, phones preview the redirect target (github.io) instead.
     if(navigator.share){try{await navigator.share({title:document.title,text:`${text}\n${shareUrl}`});return}catch(err){if(err&&err.name==='AbortError')return}}
     window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${shareUrl}`)}`,'_blank','noopener');
   });
 }

 /* ---------- Names written in gold as the curtains part ---------- */
 const names=$$('.hero h1 .script');
 if(names.length&&!calm()&&!body.classList.contains('opening-complete'))root.classList.add('ux-prewrite');
 let wrote=false;
 const writeNames=()=>{if(wrote)return;wrote=true;names.forEach((n,i)=>setTimeout(()=>n.classList.add('ux-write'),250+i*800));setTimeout(()=>root.classList.remove('ux-prewrite'),4400)};
 document.addEventListener('hx:curtains-part',writeNames);
 document.addEventListener('hx:opening-complete',()=>setTimeout(writeNames,300));

 /* ---------- Layered depth: decorations drift at their own speed while scrolling ---------- */
 const layers=[['.elephant-slot',.07],['.painted-scene',.045],['.foreground.lamp',.05]].flatMap(([s,k])=>$$(s).map(el=>({el,k})));
 function depth(){
   if(calm())return;const mid=innerHeight/2;
   layers.forEach(({el,k})=>{const r=el.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;el.style.translate=`0 ${Math.max(-22,Math.min(22,(r.top+r.height/2-mid)*-k)).toFixed(1)}px`});
 }
 addEventListener('scroll',()=>requestAnimationFrame(depth),{passive:true});

 /* ---------- Gold dust that follows the finger (or the mouse wheel) ---------- */
 let lastDust=0,liveDust=0,mx=-1,my=-1;
 function dust(x,y){
   const now=performance.now();
   if(calm()||!root.classList.contains('ux-on')||root.classList.contains('locked')||now-lastDust<70||liveDust>24)return;
   lastDust=now;liveDust++;const d=document.createElement('i');d.className='ux-dust';d.style.left=x+'px';d.style.top=y+'px';body.append(d);
   const dx=(Math.random()-.5)*36,dy=-14-Math.random()*26;
   d.animate([{transform:'translate(0,0) scale(1)',opacity:.95},{transform:`translate(${dx}px,${dy}px) scale(.3)`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.2,.6,.4,1)'}).onfinish=()=>{d.remove();liveDust--};
 }
 addEventListener('touchmove',e=>{const t=e.touches&&e.touches[0];if(t)dust(t.clientX+(Math.random()-.5)*14,t.clientY+(Math.random()-.5)*14)},{passive:true});
 addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
 addEventListener('wheel',()=>{if(mx>=0)dust(mx+(Math.random()-.5)*16,my+(Math.random()-.5)*16)},{passive:true});

 /* ---------- Temple doors swing open the first time the photos come into view ---------- */
 if(carousel&&!calm()){
   const doors=document.createElement('div');doors.className='ux-doors';doors.setAttribute('aria-hidden','true');doors.innerHTML='<i></i><i></i>';carousel.append(doors);
   once(carousel,()=>setTimeout(()=>{doors.classList.add('open');setTimeout(()=>doors.remove(),2700)},250),.55);
 }

 /* ---------- Saptapadi ending: groom's and bride's footprints walk seven steps together under the names ---------- */
 const sigScene=$('#photos .signature-scene');
 if(sigScene){
   // A right foot drawn pointing up (big toe on the left), turned to walk right; left feet are mirrored.
   const SOLE='M10 14.2C6 14.6 3.8 17.6 4 21.6 4.2 25 7.8 27.4 8.6 31 9.2 33.6 7.4 35.4 7.4 38 7.6 41.4 9.8 43.4 12.7 43.4 15.8 43.4 17.8 41 17.6 37.8 17.4 34.6 17.7 31.6 18.7 28.6 19.7 25.6 20.8 22.4 20.4 19.4 20 16 17.2 14.2 13.8 14 12.4 13.9 11.2 14 10 14.2Z';
   const TOES=[[8.2,9,3.2,4],[12.9,7,2.1,2.6],[16.4,8.3,1.85,2.3],[19.1,10.6,1.6,2],[21,13.4,1.3,1.6]].map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('');
   // Feet turn out slightly, as in a real stride.
   const foot=(left,who)=>`<svg class="ux-foot ${who}" viewBox="0 0 44 24"><g transform="rotate(${left?-7:7} 22 12) translate(44 0) rotate(90)${left?' translate(24 0) scale(-1 1)':''}"><path d="${SOLE}"/>${TOES}</g></svg>`;
   const row=document.createElement('div');row.className='ux-steps';row.setAttribute('role','img');row.setAttribute('aria-label','Saptapadi: seven steps taken together');
   row.innerHTML=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ux-haldi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6cf5f"/><stop offset="1" stop-color="#c27c12"/></linearGradient><linearGradient id="ux-kumkum" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2384f"/><stop offset="1" stop-color="#9c0f26"/></linearGradient></defs></svg>`
     +`<div class="ux-steps-path" aria-hidden="true">${Array.from({length:7},(_,i)=>`<div class="ux-step ${i%2?'r':'l'}" style="--i:${i}">${foot(i%2===0,'groom')}${foot(i%2===0,'bride')}</div>`).join('')}</div>`;
   sigScene.after(row);
   once(row,()=>{const pace=calm()?0:520;[...row.querySelectorAll('.ux-step')].forEach((s,i)=>setTimeout(()=>s.classList.add('on'),calm()?0:350+i*pace));setTimeout(()=>row.classList.add('done'),calm()?0:350+7*pace+250)},.9);
 }

 /* ---------- Small QR button: opens a big QR on a pure white screen (brightest the page can be) for friends to scan ---------- */
 const share=$('#photos .ux-share-wrap');
 if(share){
   const btn=document.createElement('button');btn.type='button';btn.className='btn ux-qr-btn';btn.setAttribute('aria-haspopup','dialog');
   btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"/><path d="M6 6h1v1H6zM17 6h1v1h-1zM6 17h1v1H6zM14 14h3v3h-3zM18 18h3v3h-3z"/></svg>QR code';
   share.append(btn);
   const ov=document.createElement('div');ov.className='ux-qr-full';ov.hidden=true;ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','QR code for our invitation');
   ov.innerHTML=`<div class="ux-qr-card"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" shape-rendering="crispEdges"><path d="M2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM15 2h1v1h-1zM17 2h1v1h-1zM18 2h1v1h-1zM20 2h1v1h-1zM21 2h1v1h-1zM24 2h1v1h-1zM25 2h1v1h-1zM32 2h1v1h-1zM33 2h1v1h-1zM34 2h1v1h-1zM35 2h1v1h-1zM36 2h1v1h-1zM37 2h1v1h-1zM38 2h1v1h-1zM2 3h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM12 3h1v1h-1zM13 3h1v1h-1zM14 3h1v1h-1zM15 3h1v1h-1zM22 3h1v1h-1zM24 3h1v1h-1zM25 3h1v1h-1zM26 3h1v1h-1zM28 3h1v1h-1zM32 3h1v1h-1zM38 3h1v1h-1zM2 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM13 4h1v1h-1zM14 4h1v1h-1zM17 4h1v1h-1zM18 4h1v1h-1zM20 4h1v1h-1zM27 4h1v1h-1zM28 4h1v1h-1zM30 4h1v1h-1zM32 4h1v1h-1zM34 4h1v1h-1zM35 4h1v1h-1zM36 4h1v1h-1zM38 4h1v1h-1zM2 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM16 5h1v1h-1zM20 5h1v1h-1zM21 5h1v1h-1zM22 5h1v1h-1zM24 5h1v1h-1zM26 5h1v1h-1zM27 5h1v1h-1zM28 5h1v1h-1zM32 5h1v1h-1zM34 5h1v1h-1zM35 5h1v1h-1zM36 5h1v1h-1zM38 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM17 6h1v1h-1zM20 6h1v1h-1zM23 6h1v1h-1zM26 6h1v1h-1zM28 6h1v1h-1zM29 6h1v1h-1zM32 6h1v1h-1zM34 6h1v1h-1zM35 6h1v1h-1zM36 6h1v1h-1zM38 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM16 7h1v1h-1zM21 7h1v1h-1zM22 7h1v1h-1zM24 7h1v1h-1zM26 7h1v1h-1zM32 7h1v1h-1zM38 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM26 8h1v1h-1zM28 8h1v1h-1zM30 8h1v1h-1zM32 8h1v1h-1zM33 8h1v1h-1zM34 8h1v1h-1zM35 8h1v1h-1zM36 8h1v1h-1zM37 8h1v1h-1zM38 8h1v1h-1zM11 9h1v1h-1zM13 9h1v1h-1zM15 9h1v1h-1zM16 9h1v1h-1zM17 9h1v1h-1zM18 9h1v1h-1zM19 9h1v1h-1zM20 9h1v1h-1zM22 9h1v1h-1zM26 9h1v1h-1zM29 9h1v1h-1zM30 9h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM11 10h1v1h-1zM12 10h1v1h-1zM14 10h1v1h-1zM18 10h1v1h-1zM22 10h1v1h-1zM23 10h1v1h-1zM28 10h1v1h-1zM29 10h1v1h-1zM36 10h1v1h-1zM37 10h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM9 11h1v1h-1zM12 11h1v1h-1zM14 11h1v1h-1zM15 11h1v1h-1zM16 11h1v1h-1zM17 11h1v1h-1zM18 11h1v1h-1zM20 11h1v1h-1zM21 11h1v1h-1zM22 11h1v1h-1zM23 11h1v1h-1zM24 11h1v1h-1zM25 11h1v1h-1zM27 11h1v1h-1zM28 11h1v1h-1zM30 11h1v1h-1zM33 11h1v1h-1zM36 11h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM16 12h1v1h-1zM19 12h1v1h-1zM20 12h1v1h-1zM24 12h1v1h-1zM25 12h1v1h-1zM27 12h1v1h-1zM30 12h1v1h-1zM31 12h1v1h-1zM33 12h1v1h-1zM34 12h1v1h-1zM2 13h1v1h-1zM4 13h1v1h-1zM9 13h1v1h-1zM10 13h1v1h-1zM12 13h1v1h-1zM15 13h1v1h-1zM17 13h1v1h-1zM19 13h1v1h-1zM22 13h1v1h-1zM26 13h1v1h-1zM27 13h1v1h-1zM28 13h1v1h-1zM29 13h1v1h-1zM33 13h1v1h-1zM34 13h1v1h-1zM35 13h1v1h-1zM36 13h1v1h-1zM38 13h1v1h-1zM3 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM16 14h1v1h-1zM17 14h1v1h-1zM20 14h1v1h-1zM21 14h1v1h-1zM22 14h1v1h-1zM24 14h1v1h-1zM26 14h1v1h-1zM27 14h1v1h-1zM28 14h1v1h-1zM31 14h1v1h-1zM32 14h1v1h-1zM34 14h1v1h-1zM35 14h1v1h-1zM36 14h1v1h-1zM37 14h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM7 15h1v1h-1zM10 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM15 15h1v1h-1zM16 15h1v1h-1zM18 15h1v1h-1zM20 15h1v1h-1zM21 15h1v1h-1zM22 15h1v1h-1zM26 15h1v1h-1zM27 15h1v1h-1zM28 15h1v1h-1zM29 15h1v1h-1zM30 15h1v1h-1zM32 15h1v1h-1zM33 15h1v1h-1zM34 15h1v1h-1zM36 15h1v1h-1zM37 15h1v1h-1zM38 15h1v1h-1zM4 16h1v1h-1zM5 16h1v1h-1zM6 16h1v1h-1zM7 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM12 16h1v1h-1zM15 16h1v1h-1zM16 16h1v1h-1zM18 16h1v1h-1zM20 16h1v1h-1zM21 16h1v1h-1zM23 16h1v1h-1zM24 16h1v1h-1zM26 16h1v1h-1zM28 16h1v1h-1zM34 16h1v1h-1zM36 16h1v1h-1zM37 16h1v1h-1zM5 17h1v1h-1zM6 17h1v1h-1zM9 17h1v1h-1zM12 17h1v1h-1zM17 17h1v1h-1zM20 17h1v1h-1zM22 17h1v1h-1zM23 17h1v1h-1zM29 17h1v1h-1zM30 17h1v1h-1zM31 17h1v1h-1zM32 17h1v1h-1zM33 17h1v1h-1zM34 17h1v1h-1zM37 17h1v1h-1zM38 17h1v1h-1zM4 18h1v1h-1zM8 18h1v1h-1zM13 18h1v1h-1zM14 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM19 18h1v1h-1zM20 18h1v1h-1zM26 18h1v1h-1zM27 18h1v1h-1zM29 18h1v1h-1zM35 18h1v1h-1zM36 18h1v1h-1zM37 18h1v1h-1zM5 19h1v1h-1zM7 19h1v1h-1zM10 19h1v1h-1zM11 19h1v1h-1zM12 19h1v1h-1zM13 19h1v1h-1zM14 19h1v1h-1zM17 19h1v1h-1zM19 19h1v1h-1zM20 19h1v1h-1zM21 19h1v1h-1zM24 19h1v1h-1zM25 19h1v1h-1zM26 19h1v1h-1zM29 19h1v1h-1zM32 19h1v1h-1zM38 19h1v1h-1zM3 20h1v1h-1zM8 20h1v1h-1zM9 20h1v1h-1zM10 20h1v1h-1zM11 20h1v1h-1zM12 20h1v1h-1zM17 20h1v1h-1zM18 20h1v1h-1zM19 20h1v1h-1zM23 20h1v1h-1zM24 20h1v1h-1zM27 20h1v1h-1zM28 20h1v1h-1zM29 20h1v1h-1zM33 20h1v1h-1zM35 20h1v1h-1zM37 20h1v1h-1zM38 20h1v1h-1zM6 21h1v1h-1zM7 21h1v1h-1zM11 21h1v1h-1zM13 21h1v1h-1zM14 21h1v1h-1zM16 21h1v1h-1zM17 21h1v1h-1zM19 21h1v1h-1zM20 21h1v1h-1zM21 21h1v1h-1zM24 21h1v1h-1zM25 21h1v1h-1zM26 21h1v1h-1zM28 21h1v1h-1zM30 21h1v1h-1zM31 21h1v1h-1zM33 21h1v1h-1zM35 21h1v1h-1zM37 21h1v1h-1zM38 21h1v1h-1zM3 22h1v1h-1zM4 22h1v1h-1zM5 22h1v1h-1zM6 22h1v1h-1zM8 22h1v1h-1zM12 22h1v1h-1zM15 22h1v1h-1zM17 22h1v1h-1zM18 22h1v1h-1zM23 22h1v1h-1zM25 22h1v1h-1zM26 22h1v1h-1zM28 22h1v1h-1zM30 22h1v1h-1zM31 22h1v1h-1zM34 22h1v1h-1zM38 22h1v1h-1zM5 23h1v1h-1zM7 23h1v1h-1zM9 23h1v1h-1zM10 23h1v1h-1zM12 23h1v1h-1zM16 23h1v1h-1zM17 23h1v1h-1zM18 23h1v1h-1zM23 23h1v1h-1zM25 23h1v1h-1zM28 23h1v1h-1zM33 23h1v1h-1zM35 23h1v1h-1zM36 23h1v1h-1zM2 24h1v1h-1zM3 24h1v1h-1zM6 24h1v1h-1zM7 24h1v1h-1zM8 24h1v1h-1zM10 24h1v1h-1zM12 24h1v1h-1zM13 24h1v1h-1zM15 24h1v1h-1zM16 24h1v1h-1zM18 24h1v1h-1zM19 24h1v1h-1zM24 24h1v1h-1zM25 24h1v1h-1zM27 24h1v1h-1zM28 24h1v1h-1zM31 24h1v1h-1zM34 24h1v1h-1zM35 24h1v1h-1zM4 25h1v1h-1zM5 25h1v1h-1zM13 25h1v1h-1zM16 25h1v1h-1zM18 25h1v1h-1zM19 25h1v1h-1zM20 25h1v1h-1zM21 25h1v1h-1zM22 25h1v1h-1zM27 25h1v1h-1zM29 25h1v1h-1zM30 25h1v1h-1zM31 25h1v1h-1zM35 25h1v1h-1zM36 25h1v1h-1zM37 25h1v1h-1zM2 26h1v1h-1zM3 26h1v1h-1zM4 26h1v1h-1zM5 26h1v1h-1zM6 26h1v1h-1zM8 26h1v1h-1zM9 26h1v1h-1zM10 26h1v1h-1zM11 26h1v1h-1zM20 26h1v1h-1zM21 26h1v1h-1zM24 26h1v1h-1zM25 26h1v1h-1zM27 26h1v1h-1zM28 26h1v1h-1zM30 26h1v1h-1zM32 26h1v1h-1zM33 26h1v1h-1zM34 26h1v1h-1zM35 26h1v1h-1zM36 26h1v1h-1zM38 26h1v1h-1zM5 27h1v1h-1zM7 27h1v1h-1zM10 27h1v1h-1zM13 27h1v1h-1zM17 27h1v1h-1zM21 27h1v1h-1zM26 27h1v1h-1zM28 27h1v1h-1zM29 27h1v1h-1zM31 27h1v1h-1zM32 27h1v1h-1zM33 27h1v1h-1zM34 27h1v1h-1zM35 27h1v1h-1zM37 27h1v1h-1zM38 27h1v1h-1zM3 28h1v1h-1zM4 28h1v1h-1zM6 28h1v1h-1zM7 28h1v1h-1zM8 28h1v1h-1zM10 28h1v1h-1zM11 28h1v1h-1zM12 28h1v1h-1zM13 28h1v1h-1zM15 28h1v1h-1zM16 28h1v1h-1zM17 28h1v1h-1zM18 28h1v1h-1zM20 28h1v1h-1zM21 28h1v1h-1zM26 28h1v1h-1zM34 28h1v1h-1zM35 28h1v1h-1zM36 28h1v1h-1zM2 29h1v1h-1zM4 29h1v1h-1zM6 29h1v1h-1zM7 29h1v1h-1zM10 29h1v1h-1zM17 29h1v1h-1zM20 29h1v1h-1zM22 29h1v1h-1zM23 29h1v1h-1zM26 29h1v1h-1zM30 29h1v1h-1zM31 29h1v1h-1zM34 29h1v1h-1zM4 30h1v1h-1zM8 30h1v1h-1zM14 30h1v1h-1zM15 30h1v1h-1zM16 30h1v1h-1zM17 30h1v1h-1zM19 30h1v1h-1zM20 30h1v1h-1zM21 30h1v1h-1zM22 30h1v1h-1zM23 30h1v1h-1zM24 30h1v1h-1zM27 30h1v1h-1zM29 30h1v1h-1zM30 30h1v1h-1zM31 30h1v1h-1zM32 30h1v1h-1zM33 30h1v1h-1zM34 30h1v1h-1zM36 30h1v1h-1zM37 30h1v1h-1zM10 31h1v1h-1zM11 31h1v1h-1zM12 31h1v1h-1zM13 31h1v1h-1zM14 31h1v1h-1zM18 31h1v1h-1zM20 31h1v1h-1zM21 31h1v1h-1zM23 31h1v1h-1zM25 31h1v1h-1zM26 31h1v1h-1zM27 31h1v1h-1zM30 31h1v1h-1zM34 31h1v1h-1zM35 31h1v1h-1zM36 31h1v1h-1zM38 31h1v1h-1zM2 32h1v1h-1zM3 32h1v1h-1zM4 32h1v1h-1zM5 32h1v1h-1zM6 32h1v1h-1zM7 32h1v1h-1zM8 32h1v1h-1zM11 32h1v1h-1zM12 32h1v1h-1zM13 32h1v1h-1zM15 32h1v1h-1zM17 32h1v1h-1zM18 32h1v1h-1zM19 32h1v1h-1zM21 32h1v1h-1zM22 32h1v1h-1zM24 32h1v1h-1zM27 32h1v1h-1zM28 32h1v1h-1zM30 32h1v1h-1zM32 32h1v1h-1zM34 32h1v1h-1zM35 32h1v1h-1zM37 32h1v1h-1zM38 32h1v1h-1zM2 33h1v1h-1zM8 33h1v1h-1zM10 33h1v1h-1zM11 33h1v1h-1zM12 33h1v1h-1zM13 33h1v1h-1zM14 33h1v1h-1zM22 33h1v1h-1zM23 33h1v1h-1zM26 33h1v1h-1zM29 33h1v1h-1zM30 33h1v1h-1zM34 33h1v1h-1zM35 33h1v1h-1zM37 33h1v1h-1zM38 33h1v1h-1zM2 34h1v1h-1zM4 34h1v1h-1zM5 34h1v1h-1zM6 34h1v1h-1zM8 34h1v1h-1zM11 34h1v1h-1zM12 34h1v1h-1zM13 34h1v1h-1zM15 34h1v1h-1zM16 34h1v1h-1zM19 34h1v1h-1zM20 34h1v1h-1zM22 34h1v1h-1zM25 34h1v1h-1zM26 34h1v1h-1zM28 34h1v1h-1zM30 34h1v1h-1zM31 34h1v1h-1zM32 34h1v1h-1zM33 34h1v1h-1zM34 34h1v1h-1zM35 34h1v1h-1zM37 34h1v1h-1zM38 34h1v1h-1zM2 35h1v1h-1zM4 35h1v1h-1zM5 35h1v1h-1zM6 35h1v1h-1zM8 35h1v1h-1zM10 35h1v1h-1zM13 35h1v1h-1zM20 35h1v1h-1zM23 35h1v1h-1zM25 35h1v1h-1zM26 35h1v1h-1zM32 35h1v1h-1zM34 35h1v1h-1zM37 35h1v1h-1zM2 36h1v1h-1zM4 36h1v1h-1zM5 36h1v1h-1zM6 36h1v1h-1zM8 36h1v1h-1zM10 36h1v1h-1zM12 36h1v1h-1zM13 36h1v1h-1zM15 36h1v1h-1zM19 36h1v1h-1zM20 36h1v1h-1zM23 36h1v1h-1zM25 36h1v1h-1zM26 36h1v1h-1zM29 36h1v1h-1zM32 36h1v1h-1zM34 36h1v1h-1zM35 36h1v1h-1zM37 36h1v1h-1zM2 37h1v1h-1zM8 37h1v1h-1zM10 37h1v1h-1zM11 37h1v1h-1zM12 37h1v1h-1zM17 37h1v1h-1zM18 37h1v1h-1zM20 37h1v1h-1zM21 37h1v1h-1zM25 37h1v1h-1zM27 37h1v1h-1zM29 37h1v1h-1zM31 37h1v1h-1zM32 37h1v1h-1zM34 37h1v1h-1zM35 37h1v1h-1zM36 37h1v1h-1zM2 38h1v1h-1zM3 38h1v1h-1zM4 38h1v1h-1zM5 38h1v1h-1zM6 38h1v1h-1zM7 38h1v1h-1zM8 38h1v1h-1zM13 38h1v1h-1zM15 38h1v1h-1zM16 38h1v1h-1zM18 38h1v1h-1zM19 38h1v1h-1zM20 38h1v1h-1zM24 38h1v1h-1zM26 38h1v1h-1zM27 38h1v1h-1zM28 38h1v1h-1zM33 38h1v1h-1zM34 38h1v1h-1zM35 38h1v1h-1zM36 38h1v1h-1zM37 38h1v1h-1zM38 38h1v1h-1z"/></svg><p>Scan to open our invitation</p><small>Hemanth &amp; Alekya · 1 – 3 Dec 2026</small><span class="ux-qr-link">bommenahemanth.github.io/hemanthwedsalekya</span></div><button type="button" class="ux-qr-x" aria-label="Close the QR code">✕</button>`;
   body.append(ov);
   let wake=null;
   const close=()=>{if(ov.hidden)return;ov.classList.remove('show');setTimeout(()=>{ov.hidden=true},300);try{wake&&wake.release()}catch{}wake=null;btn.focus({preventScroll:true})};
   // Keeps the screen awake while a friend scans; browsers don't let a page raise screen brightness itself.
   btn.addEventListener('click',async()=>{ov.hidden=false;void ov.offsetWidth;ov.classList.add('show');ov.querySelector('.ux-qr-x').focus({preventScroll:true});try{wake=await navigator.wakeLock?.request('screen')}catch{}});
   ov.addEventListener('click',close);
   document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 }

 /* ---------- Secret admin: tap the groom, then the bride, in the closing painting ---------- */
 if(sigScene){
   let groomAt=0;
   sigScene.addEventListener('click',e=>{
     const r=sigScene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
     if(y<.42||x<.15||x>.85)return;
     if(x<.5){groomAt=Date.now();return}
     if(Date.now()-groomAt<4000){groomAt=0;const tap=$('#admin-tap');if(tap)for(let i=0;i<3;i++)tap.click()}
   });
 }

 /* ---------- Ready: replay a tap on the envelope that came in while the page was still loading ---------- */
 root.classList.remove('hx-loading');
 if(window.__hxEarlyOpen){window.__hxEarlyOpen=0;const open=$('#open');if(open)open.click()}
 /* ---------- Gold ripple where a button is tapped ---------- */
 document.addEventListener('pointerdown',e=>{
   const b=e.target.closest('.page .btn,.sheet .btn,.ib');if(!b||b.disabled||calm())return;
   if(getComputedStyle(b).position==='static')b.style.position='relative';
   let w=b.querySelector(':scope>.rp-wrap');if(!w){w=document.createElement('span');w.className='rp-wrap';w.setAttribute('aria-hidden','true');b.append(w)}
   const r=b.getBoundingClientRect(),d=document.createElement('i');d.className='rp';d.style.left=(e.clientX-r.left)+'px';d.style.top=(e.clientY-r.top)+'px';w.append(d);setTimeout(()=>d.remove(),700);
 },{passive:true});

 /* ---------- The photo frame tilts with the mouse, or with the phone where no permission prompt is needed ---------- */
 const frame=$('.temple.invite .frame');
 if(frame&&!calm()){
   let raf=0,tx=0,ty=0;
   const set=()=>{raf=0;frame.style.setProperty('--rx',ty.toFixed(2)+'deg');frame.style.setProperty('--ry',tx.toFixed(2)+'deg')};
   const go=(x,y)=>{tx=x;ty=y;frame.classList.add('tilt');if(!raf)raf=requestAnimationFrame(set)};
   frame.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=frame.getBoundingClientRect();go(((e.clientX-r.left)/r.width-.5)*12,-((e.clientY-r.top)/r.height-.5)*12)});
   frame.addEventListener('pointerleave',()=>go(0,0));
   if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission!=='function')
     addEventListener('deviceorientation',e=>{if(e.gamma==null||!frame.classList.contains('in'))return;go(Math.max(-6,Math.min(6,e.gamma/6)),Math.max(-6,Math.min(6,(e.beta-45)/8)))},{passive:true});
 }

 /* ---------- Diyas along the edges on event evenings (body.diya-night is set by the Today check) ---------- */
 const nd=document.createElement('div');nd.className='night-diyas';nd.setAttribute('aria-hidden','true');
 nd.innerHTML=Array.from({length:12},(_,i)=>`<i style="${i%2?'right':'left'}:6px;top:${12+Math.floor(i/2)*15}%;--f:${(i*.23).toFixed(2)}s"></i>`).join('');body.append(nd);
})();
