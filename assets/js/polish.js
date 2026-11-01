
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
 [$('.events .tz-note'),$('#rsvp .reach'),$('#photos .signature-scene')||$('#photos .couple-line')].forEach(anchor=>{
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
   if(st==='yes'||st==='maybe')setTimeout(()=>{burst(card.querySelector('.tick')||card);chime()},700);
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
     const src=im.getAttribute('src')||im.dataset.src||'',thumb=/^photos\/\d+\.jpg$/.test(src)?src.replace('photos/','photos/thumbs/'):'';
     if(thumb){slide.style.backgroundImage=`url("${thumb}")`;slide.classList.add('ux-thumb')}
     if(im.complete&&im.naturalWidth)return;
     const ready=()=>im.classList.remove('ux-wait');
     im.classList.add('ux-fade','ux-wait');im.addEventListener('load',ready,{once:true});im.addEventListener('error',ready,{once:true});
   });
 }

 /* ---------- Share the invitation ---------- */
 const og=document.querySelector('meta[property="og:url"]'),shareUrl=og&&/^https?:\/\//.test(og.content)?og.content:location.href.split('#')[0];
 const sig=$('#photos .ux-kolam')||$('#photos .signature-scene');
 if(sig){
   const wrap=document.createElement('div');wrap.className='ux-share-wrap';
   wrap.innerHTML='<button type="button" class="btn solid ux-share"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4"/></svg>Share our invitation</button>';
   sig.after(wrap);
   wrap.querySelector('button').addEventListener('click',async()=>{
     const text='Hemanth & Alekya invite you to their wedding celebrations \u00b7 29 Nov \u2013 3 Dec 2026 \ud83d\ude4f';
     if(navigator.share){try{await navigator.share({title:document.title,text,url:shareUrl});return}catch(err){if(err&&err.name==='AbortError')return}}
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
     +`<div class="ux-steps-path" aria-hidden="true">${Array.from({length:7},(_,i)=>`<div class="ux-step ${i%2?'r':'l'}" style="--i:${i}">${foot(i%2===0,'groom')}${foot(i%2===0,'bride')}</div>`).join('')}</div>`
     +'<p class="ux-steps-cap" aria-hidden="true"><span class="te">ఏడడుగులు</span>Seven steps, together</p>';
   sigScene.after(row);
   once(row,()=>{const pace=calm()?0:520;[...row.querySelectorAll('.ux-step')].forEach((s,i)=>setTimeout(()=>s.classList.add('on'),calm()?0:350+i*pace));setTimeout(()=>row.classList.add('done'),calm()?0:350+7*pace+250)},.9);
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
})();
