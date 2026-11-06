
/* Small delights layered on top: slider motion, rolling numbers, pointer magic, blessings and evening lanterns. */
(()=>{'use strict';
 const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s)),body=document.body;
 const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||body.classList.contains('calm');
 const opened=()=>body.dataset.openingState==='complete';
 const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch{}};
 const art=window.HX_CEREMONY_ART||{},petals=['jasmineFlower','banthiOrange','banthiYellow','roseFlower','lotusFlower'].filter(k=>art[k]).map(k=>art[k]);
 const layer=document.createElement('div');layer.className='dl-layer';layer.setAttribute('aria-hidden','true');body.append(layer);
 let live=0;
 function petal(x,y,{size=14,dx=0,dy=60,spin=180,ms=1100,delay=0}={}){
   if(!petals.length||live>40)return;live++;
   const im=new Image();im.src=petals[(Math.random()*petals.length)|0];im.alt='';im.style.width=im.style.height=size+'px';layer.append(im);
   im.animate([{transform:`translate(${x-size/2}px,${y-size/2}px) scale(.4) rotate(0deg)`,opacity:0},{opacity:.95,offset:.15},{transform:`translate(${x-size/2+dx}px,${y-size/2+dy}px) scale(1) rotate(${spin}deg)`,opacity:0}],{duration:ms,delay,easing:'cubic-bezier(.2,.6,.4,1)',fill:'both'}).onfinish=()=>{im.remove();live--};
 }
 function shower(){
   if(calm())return;buzz([10,40,10]);
   const w=innerWidth,n=w<500?28:40;
   for(let i=0;i<n;i++){
     if(i%2)petal(Math.random()*w,-20,{size:14+Math.random()*12,dx:(Math.random()-.5)*80,dy:innerHeight*(.5+Math.random()*.5),spin:(Math.random()-.5)*600,ms:2200+Math.random()*1200,delay:Math.random()*700});
     else{const g=document.createElement('i'),x=Math.random()*w,rot=Math.random()*720;g.className='dl-rice';layer.append(g);
       g.animate([{transform:`translate(${x}px,-20px) rotate(0deg)`,opacity:1},{transform:`translate(${x+(Math.random()-.5)*60}px,${innerHeight*(.4+Math.random()*.6)}px) rotate(${rot}deg)`,opacity:0}],{duration:1600+Math.random()*900,delay:Math.random()*600,easing:'cubic-bezier(.35,.1,.6,1)',fill:'both'}).onfinish=()=>g.remove()}
   }
 }

 const form=$('#rsvp-form');

 /* ---------- 5, 18: event buttons buzz ---------- */
 document.addEventListener('click',e=>{if(e.target.closest('#ev-pick button'))buzz(8)});

 /* ---------- 7, 9: RSVP blocks reveal each time they scroll into view; heading lines draw ---------- */
 const rv=$$('#rsvp-form fieldset');
 if(rv.length&&'IntersectionObserver' in window&&!calm()){
   rv.forEach(f=>f.classList.add('dl-rv'));
   const io=new IntersectionObserver(es=>es.forEach(e=>{
     if(e.isIntersecting)e.target.classList.add('dl-in');
     else if(e.boundingClientRect.top>innerHeight)e.target.classList.remove('dl-in');
   }),{threshold:.12});
   rv.forEach(f=>io.observe(f));
   // Replay the page's own one-time reveals when they are scrolled back into view from below.
   const io2=new IntersectionObserver(es=>es.forEach(e=>{
     if(!opened())return;
     if(e.isIntersecting)e.target.classList.add('in');
     else if(e.boundingClientRect.top>innerHeight*1.05)e.target.classList.remove('in');
   }),{threshold:.05});
   $$('.page [data-reveal]').filter(el=>!el.closest('#rsvp-form')&&el.id!=='rsvp-form').forEach(el=>io2.observe(el));
 }

 /* ---------- 8: decorations drift a touch slower than the text ---------- */
 const decos=$$('.page .deco, .page .thoranam');
 if(decos.length&&!calm()){
   let raf=0;
   const drift=()=>{raf=0;const h=innerHeight;decos.forEach(d=>{const r=d.getBoundingClientRect();if(r.bottom<-200||r.top>h+200)return;const off=Math.max(-12,Math.min(12,((r.top+r.height/2)-h/2)*-.04));d.style.translate=`0 ${off.toFixed(1)}px`})};
   addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(drift)},{passive:true});drift();
 }

 /* ---------- 10: numbers roll when they change ---------- */
 const roll=(el,dirOf)=>{if(!el)return;let prev=el.textContent;new MutationObserver(()=>{const now=el.textContent;if(now===prev||calm()){prev=now;return}const up=dirOf?dirOf(prev,now):true;prev=now;
   el.animate([{transform:`translateY(${up?60:-60}%)`,opacity:0},{transform:'none',opacity:1}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'})}).observe(el,{childList:true,characterData:true,subtree:true})};
 const num=(a,b)=>parseFloat(b)>=parseFloat(a);
 ['#plus-out','#kids-out'].forEach(s=>{const el=$(s);if(el){el.classList.add('dl-roll');roll(el,num)}});
 ['#party','#range-out'].forEach(s=>roll($(s),(a,b)=>(parseInt((b.match(/\d+/)||[0])[0])||0)>=(parseInt((a.match(/\d+/)||[0])[0])||0)));

 /* ---------- 12, 13: petal trail and tap flowers ---------- */
 if(petals.length){
   let lx=0,ly=0,lt=0;
   addEventListener('pointermove',e=>{
     if(calm()||!opened())return;
     const touch=e.pointerType!=='mouse';if(touch&&!e.isPrimary)return;
     const now=performance.now(),d=Math.hypot(e.clientX-lx,e.clientY-ly);
     if(now-lt<(touch?90:55)||d<(touch?30:22))return;lt=now;lx=e.clientX;ly=e.clientY;
     petal(e.clientX,e.clientY,{size:10+Math.random()*6,dx:(Math.random()-.5)*30,dy:40+Math.random()*40,spin:(Math.random()-.5)*360,ms:900+Math.random()*400});
   },{passive:true});
   const busy='a,button,input,label,select,textarea,summary,dialog,[role=button],[tabindex],.chip,.range,.stepper,.ux-dots,.carousel,#fab,.frame';
   addEventListener('click',e=>{
     if(calm()||!opened()||e.target.closest(busy))return;
     for(let i=0;i<7;i++){const a=Math.random()*Math.PI*2,v=30+Math.random()*40;petal(e.clientX,e.clientY,{size:12+Math.random()*8,dx:Math.cos(a)*v,dy:Math.sin(a)*v+50,spin:(Math.random()-.5)*400,ms:1000+Math.random()*500})}
   });
 }

 /* ---------- 14: event cards tilt toward the pointer with a soft shine ---------- */
 if(!calm())$$('.temple .tl-item .card').forEach(card=>{
   const sh=document.createElement('span');sh.className='dl-shine';sh.setAttribute('aria-hidden','true');card.append(sh);
   const go=e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,mag=Math.min(7,Math.hypot(x,y)*12);
     card.style.setProperty('--mx',((x+.5)*100).toFixed(1)+'%');card.style.setProperty('--my',((y+.5)*100).toFixed(1)+'%');
     card.style.rotate=mag>.2?`${(-y).toFixed(3)} ${x.toFixed(3)} 0 ${mag.toFixed(2)}deg`:'';card.classList.add('dl-tilt')};
   const off=()=>{card.style.rotate='';card.classList.remove('dl-tilt')};
   card.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')go(e)});
   card.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')go(e)});
   card.addEventListener('pointerleave',off);card.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')off()});card.addEventListener('pointercancel',off);
 });

 /* ---------- 15: warm glow follows the pointer over the RSVP card ---------- */
 if(form&&!calm()){
   const g=document.createElement('span');g.className='dl-glow';g.setAttribute('aria-hidden','true');form.prepend(g);
   form.addEventListener('pointermove',e=>{const r=form.getBoundingClientRect();form.style.setProperty('--gx',(e.clientX-r.left)+'px');form.style.setProperty('--gy',(e.clientY-r.top)+'px');form.classList.add('dl-glowing')},{passive:true});
   form.addEventListener('pointerleave',()=>form.classList.remove('dl-glowing'));
 }

 /* ---------- 16, 17: pull down at the top, or shake the phone, for a blessing shower ---------- */
 let lastShower=0;const bless=()=>{const t=Date.now();if(t-lastShower<4000||!opened())return;lastShower=t;shower()};
 let y0=null;
 addEventListener('touchstart',e=>{y0=scrollY<=0&&e.touches.length===1?e.touches[0].clientY:null},{passive:true});
 addEventListener('touchmove',e=>{if(y0!=null&&scrollY<=0&&e.touches[0].clientY-y0>90){y0=null;bless()}},{passive:true});
 if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission!=='function'){
   let hits=0,hitAt=0;
   addEventListener('devicemotion',e=>{const a=e.acceleration||{};const m=Math.hypot(a.x||0,a.y||0,a.z||0);if(m<18)return;const t=Date.now();hits=t-hitAt<600?hits+1:1;hitAt=t;if(hits>=3){hits=0;bless()}},{passive:true});
 }

 /* ---------- 19: the RSVP folds into an envelope and flies off ---------- */
 let sendAt=null;
 document.addEventListener('pointerdown',e=>{const b=e.target.closest('#rsvp-submit');if(b){const r=b.getBoundingClientRect();sendAt={x:r.left+r.width/2,y:r.top+r.height/2}}},{passive:true});
 document.addEventListener('hx:rsvp',()=>{
   buzz([12,50,24]);
   if(calm()||!sendAt)return;const {x,y}=sendAt;sendAt=null;
   const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 64 46');s.setAttribute('width','64');s.setAttribute('height','46');
   s.innerHTML='<rect x="2" y="2" width="60" height="42" rx="5" fill="#fff6dc" stroke="#c9a24a" stroke-width="2"/><path d="M3 4l29 22L61 4" fill="none" stroke="#c9a24a" stroke-width="2"/><path class="flap" d="M3 4l29 22L61 4Z" fill="#f1d48a" stroke="#c9a24a" stroke-width="2"/><circle cx="32" cy="27" r="6" fill="#8a1020"/><text x="32" y="30" font-size="7" text-anchor="middle" fill="#f6dc95" font-family="Georgia">H&amp;A</text>';
   layer.append(s);
   s.animate([
     {transform:`translate(${x-32}px,${y-23}px) scale(.3)`,opacity:0},
     {transform:`translate(${x-32}px,${y-23}px) scale(1.1)`,opacity:1,offset:.2},
     {transform:`translate(${x-32}px,${y-23}px) scale(1)`,opacity:1,offset:.4},
     {transform:`translate(${x-32+innerWidth*.35}px,${-80}px) scale(.5) rotate(-18deg)`,opacity:0}
   ],{duration:1600,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'}).onfinish=()=>s.remove();
   const flap=s.querySelector('.flap');flap.style.transformOrigin='32px 4px';flap.style.transformBox='view-box';
   flap.animate([{transform:'scaleY(-1)'},{transform:'scaleY(-1)',offset:.25},{transform:'scaleY(1)',offset:.45},{transform:'scaleY(1)'}],{duration:1600,fill:'forwards'});
 });

 /* ---------- 20: a balloon floats up when a kid is added ---------- */
 const kidsOut=$('#kids-out');
 if(kidsOut){let prev=+kidsOut.textContent||0;new MutationObserver(()=>{const n=+kidsOut.textContent||0;if(n>prev&&!calm()){
   const b=$('[data-stepper=kids] [data-d="1"]'),r=b.getBoundingClientRect(),col=['#e0475a','#f1b73a','#5aa0e0','#7cc576','#c77ddb'][n%5];
   const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 44');s.setAttribute('width','22');s.setAttribute('height','40');
   s.innerHTML=`<ellipse cx="12" cy="11" rx="9" ry="11" fill="${col}"/><ellipse cx="9" cy="7" rx="2.5" ry="3.5" fill="#fff" opacity=".45"/><path d="M12 22l-2 3h4z" fill="${col}"/><path d="M12 25q-3 6 0 10t0 9" fill="none" stroke="#8a6a4a" stroke-width=".8"/>`;
   layer.append(s);const x=r.left+r.width/2-11,y=r.top-30;
   s.animate([{transform:`translate(${x}px,${y}px) scale(.4)`,opacity:0},{transform:`translate(${x+6}px,${y-30}px) scale(1) rotate(6deg)`,opacity:1,offset:.25},{transform:`translate(${x-8}px,${y-110}px) rotate(-6deg)`,opacity:1,offset:.7},{transform:`translate(${x+4}px,${y-170}px) rotate(4deg)`,opacity:0}],{duration:2200,easing:'ease-out',fill:'forwards'}).onfinish=()=>s.remove();
 }prev=n}).observe(kidsOut,{childList:true,characterData:true,subtree:true})}

 /* ---------- 21: a heart floats up when an adult +1 is added ---------- */
 const plusOut=$('#plus-out');
 if(plusOut){let prev=+plusOut.textContent||0;new MutationObserver(()=>{const n=+plusOut.textContent||0;if(n>prev&&!calm()){
   const b=$('[data-stepper=plus] [data-d="1"]'),r=b.getBoundingClientRect(),col=['#d2414f','#c9a24a','#e0607a','#a3162b'][n%4];
   const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('width','26');s.setAttribute('height','26');
   s.innerHTML=`<path d="M12 21s-7.5-4.6-9.4-9.3C1.2 8.2 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 5.8 3.7 4.4 7.2C19.5 16.4 12 21 12 21z" fill="${col}"/><path d="M7.5 8.2c.6-1 1.6-1.5 2.6-1.4" stroke="#fff" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".6"/>`;
   layer.append(s);const x=r.left+r.width/2-13,y=r.top-28;
   s.animate([{transform:`translate(${x}px,${y}px) scale(.3)`,opacity:0},{transform:`translate(${x-4}px,${y-24}px) scale(1.15)`,opacity:1,offset:.22},{transform:`translate(${x+8}px,${y-90}px) scale(1) rotate(-8deg)`,opacity:1,offset:.65},{transform:`translate(${x-2}px,${y-150}px) scale(.9) rotate(6deg)`,opacity:0}],{duration:1900,easing:'ease-out',fill:'forwards'}).onfinish=()=>s.remove();
 }prev=n}).observe(plusOut,{childList:true,characterData:true,subtree:true})}

 /* ---------- 22: sky lanterns drift up after 6 PM Dallas time ---------- */
 const lan=document.createElement('div');lan.className='dl-lanterns';lan.setAttribute('aria-hidden','true');
 lan.innerHTML=Array.from({length:7},(_,i)=>`<i style="left:${8+i*13+(i%2)*4}%;--s:${10+(i*7)%8}px;--t:${20+(i*5)%12}s;--d:-${(i*3.7).toFixed(1)}s"></i>`).join('');body.append(lan);
 const clock=(()=>{const q=new URLSearchParams(location.search).get('now'),t=q?Date.parse(q+(/[zZ]|[+-]\d\d:?\d\d$/.test(q)?'':'-06:00')):NaN,skew=isNaN(t)?0:t-Date.now();return()=>Date.now()+skew})();
 const evening=()=>{const h=+new Date(clock()).toLocaleString('en-US',{timeZone:'America/Chicago',hour:'numeric',hourCycle:'h23'});body.classList.toggle('dl-evening',!calm()&&(h>=18||h<5))};
 evening();setInterval(evening,6e4);
})();
