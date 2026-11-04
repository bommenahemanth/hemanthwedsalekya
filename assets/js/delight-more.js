
/* More delights: kolam, garlands, page lifts, toran, living art, card flips, form touches, seal, atmosphere. */
(()=>{'use strict';
 const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s)),body=document.body;
 const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||body.classList.contains('calm');
 const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch{}};
 const art=window.HX_CEREMONY_ART||{},NS='http://www.w3.org/2000/svg';
 const seen=(el,fn,threshold=.35)=>{if(!el)return;const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();fn()}},{threshold});io.observe(el)};

 /* 1: kolam draws itself behind the RSVP heading */
 const title=$('#rsvp-title');
 if(title){
   const pts=(fn,n=180)=>Array.from({length:n+1},(_,i)=>{const t=i/n*Math.PI*2,[x,y]=fn(t);return`${i?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`}).join('')+'Z';
   const k=document.createElementNS(NS,'svg');k.setAttribute('class','dl-kolam');k.setAttribute('viewBox','-110 -62 220 124');k.setAttribute('aria-hidden','true');
   k.innerHTML=`<path class="k1" pathLength="1" d="${pts(t=>{const r=88+12*Math.cos(8*t);return[r*Math.cos(t),.5*r*Math.sin(t)]})}"/><path class="k2" pathLength="1" d="${pts(t=>{const r=58+9*Math.cos(6*t+.5);return[r*Math.cos(t),.52*r*Math.sin(t)]})}"/><circle class="r" pathLength="1" cx="0" cy="0" r="24" transform="scale(1 .52)"/>`+
     Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return`<circle class="d" cx="${(74*Math.cos(a)).toFixed(1)}" cy="${(38*Math.sin(a)).toFixed(1)}" r="2.2"/>`}).join('');
   title.prepend(k);
   seen(title,()=>k.classList.add('on'),.6);
 }

 $$('.page .temple').forEach(sec=>['t','b'].forEach(k=>{const d=document.createElement('div');d.className='dl-seam '+k;d.setAttribute('aria-hidden','true');sec.append(d)}));

 /* 2: garlands bounce with scroll speed; 3: sections lift in like turning a page */
 const garlands=$$('.thoranam');
 if(!calm()){
   let lastY=scrollY,lastT=performance.now(),relax=0;
   addEventListener('scroll',()=>{const t=performance.now(),v=Math.abs(scrollY-lastY)/Math.max(16,t-lastT);lastY=scrollY;lastT=t;
     const s=1+Math.min(.14,v*.08);garlands.forEach(g=>{const r=g.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)g.style.scale=`1 ${s.toFixed(3)}`});
     clearTimeout(relax);relax=setTimeout(()=>garlands.forEach(g=>g.style.scale=''),120)},{passive:true});
   $$('main .sec').forEach(sec=>seen(sec,()=>sec.animate([{translate:'0 34px',scale:'.985',filter:'drop-shadow(0 -14px 18px #4a061022)'},{translate:'0 0',scale:'1',filter:'drop-shadow(0 0 0 #4a061000)'}],{duration:900,easing:'cubic-bezier(.2,.7,.2,1)'}),.08));
 }

 /* 4: mango-leaf toran across the top of the welcome page */
 const hero=$('#hero');
 if(hero&&art.mangoLeaf){
   const t=document.createElement('div');t.className='dl-toran';t.setAttribute('aria-hidden','true');
   const n=Math.max(9,Math.min(17,Math.round(innerWidth/34)));
   t.innerHTML=Array.from({length:n},(_,i)=>`<img src="${art.mangoLeaf}" alt="" style="--r:${(i%2?4:-4)+((i*37)%7-3)}deg;--dl:${(i*.05).toFixed(2)}s">`).join('');
   if(getComputedStyle(hero).position==='static')hero.style.position='relative';
   hero.append(t);
   let busy=0;addEventListener('scroll',()=>{if(calm()||busy||scrollY>innerHeight)return;busy=1;t.classList.remove('flutter');void t.offsetWidth;t.classList.add('flutter');setTimeout(()=>busy=0,1900)},{passive:true});
 }

 /* 5: glints on the event pictures; 6: cards flip to show where, when and calendar; 7 is CSS */
 const S=window.HX_SCHEDULE||{events:[]};
 $$('.tl-item .card').forEach((card,i)=>{
   const fig=card.querySelector('.event-illustration');
   if(fig&&!calm())for(let j=0;j<3;j++){const g=document.createElement('i');g.className='dl-glint';g.style.cssText=`left:${55+((i*23+j*17)%35)}%;top:${30+((i*31+j*29)%50)}%;--d:${(j*1.2+i*.4).toFixed(1)}s`;fig.append(g)}
   const ev=S.events[i];if(!ev)return;
   const hint=document.createElement('span');hint.className='dl-flip-hint';hint.setAttribute('aria-hidden','true');hint.textContent='↻';card.append(hint);
   const back=document.createElement('div');back.className='dl-back';back.hidden=true;card.append(back);
   card.setAttribute('tabindex','0');card.setAttribute('role','button');card.setAttribute('aria-expanded','false');
   const fill=()=>{
     const when=(card.querySelector('.time')||{}).textContent||'',where=($('#venue-text')||{}).textContent||'',map=($('#venue-link')||{}).href||'';
     const name=(card.querySelector('h3')||{}).textContent||'';
     back.innerHTML=`<h4>${name}</h4><p>${when.trim()}</p><p>${where}</p><div class="acts">${map?`<a class="btn" href="${map}" target="_blank" rel="noopener noreferrer">Directions</a>`:''}<a class="btn" href="assets/cal/${ev.id}.ics">Add to calendar</a></div><small>Tap to flip back</small>`;
   };
   let turning=false;
   const flip=()=>{
     if(turning)return;turning=true;const open=back.hidden;if(open)fill();buzz(8);
     const swap=()=>{back.hidden=!open;hint.hidden=open;card.setAttribute('aria-expanded',String(open))};
     if(calm()){swap();turning=false;return}
     card.animate([{rotate:'0 1 0 0deg'},{rotate:'0 1 0 90deg'}],{duration:220,easing:'ease-in'}).onfinish=()=>{swap();
       card.animate([{rotate:'0 1 0 -90deg'},{rotate:'0 1 0 0deg'}],{duration:260,easing:'cubic-bezier(.2,.8,.3,1.2)'}).onfinish=()=>turning=false};
   };
   card.addEventListener('click',e=>{if(e.target.closest('a,button'))return;flip()});
   card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}});
 });

 /* 8: the name, signed in gold; 11: phone tick; 12: the send button lights when ready */
 const form=$('#rsvp-form');
 if(form){
   const F=form.elements,sign=document.createElement('p');sign.className='dl-sign';sign.setAttribute('aria-hidden','true');
   const nameField=F.fullName&&F.fullName.closest('.field');if(nameField)nameField.before(sign);
   let shown='';
   const writeName=()=>{const v=(F.fullName.value||'').replace(/\s+/g,' ').trim();sign.classList.toggle('on',!!v);
     if(v===shown)return;
     if(v.startsWith(shown)&&!calm()){sign.append(...Array.from(v.slice(shown.length)).map(c=>{const s=document.createElement('span');s.textContent=c===' '?'\u00a0':c;return s}))}
     else sign.textContent=v;
     shown=v};
   const ok=document.createElement('span');ok.className='dl-ok';ok.setAttribute('aria-hidden','true');
   const phoneBox=F.phone&&F.phone.closest('.phone');if(phoneBox)phoneBox.append(ok);
   const phoneOk=()=>{const d=(F.phone.value||'').replace(/\D/g,''),cc=F.cc?F.cc.value:'+1';if(!d)return /keep/i.test(F.phone.placeholder||'');return cc==='+1'?(d.length===10||(d.length===11&&d[0]==='1')):cc==='+91'?d.length===10:d.length>=6&&d.length<=15};
   const submit=$('#rsvp-submit');
   const update=()=>{writeName();const p=phoneOk();ok.classList.toggle('on',p&&!!(F.phone.value||'').trim());
     const st=form.querySelector('input[name=status]:checked');submit&&submit.classList.toggle('dl-ready',!!st&&p&&(F.fullName.value||'').trim().length>1)};
   form.addEventListener('input',update);form.addEventListener('change',update);
   new MutationObserver(update).observe(F.phone,{attributes:true,attributeFilter:['placeholder']});
   setInterval(()=>{if(!form.hidden)update()},1500);update();
 }

 /* 13: wax seal on the confirmation; 14: the party appears one by one */
 const FIG={
   male:'<circle cx="10" cy="6" r="4.6" fill="#7a3b1e"/><path d="M5.6 4.6c1-3 7.8-3 8.8 0-2-.9-6.8-.9-8.8 0z" fill="#2b1a10"/><path d="M4 29V17.5c0-3.2 2.6-5.5 6-5.5s6 2.3 6 5.5V29z" fill="#8a1020"/><path d="M10 12.5v7" stroke="#f6dc95" stroke-width="1"/>',
   female:'<circle cx="14.6" cy="4" r="2.2" fill="#2b1a10"/><circle cx="10" cy="6" r="4.6" fill="#7a3b1e"/><path d="M5.5 5c.6-3.2 8.4-3.6 9 .2-2.3-1.2-6.6-1.3-9-.2z" fill="#2b1a10"/><path d="M2.5 29c.8-7 2.6-15 7.5-16.5 4.9 1.5 6.7 9.5 7.5 16.5z" fill="#c2185b"/><path d="M6 15c3 3 6 6 10 7" stroke="#f6dc95" stroke-width="1.4" fill="none"/>',
   adult:'<circle cx="10" cy="6" r="4.6" fill="#7a3b1e"/><path d="M2.5 29c0-9 3-14.5 7.5-14.5s7.5 5.5 7.5 14.5z" fill="#a3162b"/>',
   kid:'<circle cx="10" cy="7" r="5" fill="#7a3b1e"/><path d="M3 29c0-8 3-13 7-13s7 5 7 13z" fill="#e0a100"/>'};
 const person=(kind,d)=>`<svg class="${kind==='kid'?'kid':kind}" viewBox="0 0 20 30" style="--d:${d}s" aria-hidden="true">${FIG[kind]}</svg>`;
 let party=null;
 document.addEventListener('pointerdown',e=>{if(e.target.closest('#rsvp-submit'))party={me:(document.querySelector('#rsvp-form input[name=gender]:checked')||{}).value||'',plus:+($('#plus-out')||{}).textContent||0,kids:+($('#kids-out')||{}).textContent||0}},{passive:true});
 document.addEventListener('hx:rsvp',e=>{
   const st=e.detail&&e.detail.status,done=$('#rsvp-done');if(!done)return;
   if(st==='yes'||st==='maybe'){
     const seal=document.createElement('div');seal.className='dl-seal';seal.setAttribute('aria-hidden','true');seal.textContent='H&A';done.append(seal);
     if(!calm())seal.animate([{scale:2.6,opacity:0,rotate:'-30deg'},{scale:.92,opacity:1,rotate:'-12deg',offset:.7},{scale:1,rotate:'-12deg'}],{duration:700,delay:900,easing:'cubic-bezier(.5,0,.3,1)',fill:'backwards'}).onfinish=()=>buzz(30);
     if(party){const h=done.querySelector('h3'),box=document.createElement('div');box.className='dl-party';box.setAttribute('aria-hidden','true');let i=0;
       const me=party.me==='female'?'female':party.me==='male'?'male':'adult';
       box.innerHTML=person(me,(.5+i++*.12).toFixed(2))+Array.from({length:Math.min(11,party.plus)},()=>person('adult',(.5+i++*.12).toFixed(2))).join('')+Array.from({length:Math.min(10,party.kids)},()=>person('kid',(.5+i++*.12).toFixed(2))).join('');
       if(h)h.after(box)}
   }
   party=null;
 });

 /* 15: gold dust; 16: morning/evening tint; 17: glow on the wedding morning */
 const dust=document.createElement('div');dust.className='dl-dust';dust.setAttribute('aria-hidden','true');
 dust.innerHTML=Array.from({length:12},(_,i)=>`<i style="left:${(i*8.3+3)%100}%;--s:${2+(i*5)%3}px;--t:${22+(i*7)%14}s;--d:-${(i*2.9).toFixed(1)}s"></i>`).join('');
 const tint=document.createElement('div');tint.className='dl-tint';tint.setAttribute('aria-hidden','true');
 const dawn=document.createElement('div');dawn.className='dl-dawn';dawn.setAttribute('aria-hidden','true');dawn.innerHTML='<b>✨ Muhurtham at 9:47 AM</b>';
 if(!calm())body.append(dust,tint,dawn);
 const clock=(()=>{const q=new URLSearchParams(location.search).get('now'),t=q?Date.parse(q+(/[zZ]|[+-]\d\d:?\d\d$/.test(q)?'':'-06:00')):NaN,skew=isNaN(t)?0:t-Date.now();return()=>Date.now()+skew})();
 const sky=()=>{const now=new Date(clock()),o={timeZone:'America/Chicago'},h=+now.toLocaleString('en-US',{...o,hour:'numeric',hourCycle:'h23'}),m=+now.toLocaleString('en-US',{...o,minute:'numeric'}),day=now.toLocaleDateString('en-CA',o);
   body.classList.toggle('dl-morning',h>=5&&h<11);body.classList.toggle('dl-eve',h>=17||h<5);
   body.classList.toggle('dl-muhurtham',day==='2026-12-03'&&h*60+m>=300&&h*60+m<587)};
 sky();setInterval(sky,6e4);

 /* 18: a gold shine passes over buttons under the mouse */
 document.addEventListener('pointerover',e=>{
   if(e.pointerType!=='mouse'||calm())return;const b=e.target.closest('.btn,#ev-pick button,.date-btn,.ux-share');
   if(!b||b.disabled||b.contains(e.relatedTarget))return;
   if(getComputedStyle(b).position==='static')b.style.position='relative';
   let w=b.querySelector(':scope>.dl-sheen');if(!w){w=document.createElement('span');w.className='dl-sheen';w.setAttribute('aria-hidden','true');w.innerHTML='<i></i>';b.append(w)}
   w.firstChild.animate([{left:'-60%'},{left:'130%'}],{duration:650,easing:'ease-out'});
 });

 /* "More" button at the bottom left: goes to the next section, hides on the last one */
 const down=document.createElement('button');down.type='button';down.className='dl-down';down.setAttribute('aria-label','Scroll down to see more');
 down.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg><span>More</span>';body.append(down);
 const secs=()=>$$('main > section').filter(s=>s.offsetHeight>200);
 const nextSec=()=>secs().find(s=>s.getBoundingClientRect().top>90);
 let dRaf=0;const dUpdate=()=>{dRaf=0;const ready=body.dataset.openingState==='complete',n=nextSec(),nearEnd=innerHeight+scrollY>=document.documentElement.scrollHeight-40;down.classList.toggle('show',ready&&!!n&&!nearEnd&&$('#admin')?.hidden!==false)};
 addEventListener('scroll',()=>{if(!dRaf)dRaf=requestAnimationFrame(dUpdate)},{passive:true});
 document.addEventListener('hx:opening-complete',()=>setTimeout(dUpdate,600));setInterval(dUpdate,1500);
 down.addEventListener('click',()=>{const n=nextSec();if(n)n.scrollIntoView({behavior:calm()?'auto':'smooth',block:'start'});buzz(8)});

 /* 19: a lotus under the section dots opens as you read down the page */
 const dots=$('.ux-dots');
 if(dots){
   const l=document.createElementNS(NS,'svg');l.setAttribute('class','dl-lotus');l.setAttribute('viewBox','0 0 22 18');l.setAttribute('aria-hidden','true');
   l.innerHTML=['p1','p2','p4','p5','p3'].map(c=>`<path class="${c}" d="M11 16C8 12 8.5 6 11 2c2.5 4 3 10 0 14Z"/>`).join('');
   const ICON=[
     '<path d="M3 14c2 5.5 16 5.5 18 0z" fill="#d9a441" stroke="#8a6420"/><path class="fl" d="M12 3.5c2.2 3 2.2 5.4 0 7.2-2.2-1.8-2.2-4.2 0-7.2z" fill="#ff9a2e" stroke="#e0601a" stroke-width=".6"/>',
     '<g class="bell"><path d="M12 2.5v2" stroke="#8a6420" stroke-width="1.4"/><path d="M12 4.5c-4 0-6 3-6 7v3.5l-2 2.5h16l-2-2.5v-3.5c0-4-2-7-6-7z" fill="#e8c06a" stroke="#8a6420"/><circle cx="12" cy="19.6" r="1.7" fill="#8a6420"/></g>',
     '<g class="env"><rect x="3" y="6" width="18" height="13" rx="2" fill="#fff6dc" stroke="#a3162b" stroke-width="1.3"/><path d="M3.6 7l8.4 6.2L20.4 7" fill="none" stroke="#a3162b" stroke-width="1.3"/><circle cx="12" cy="13.4" r="1.8" fill="#a3162b"/></g>',
     '<rect x="3" y="5" width="18" height="14" rx="2" fill="#fff6dc" stroke="#8a6420" stroke-width="1.3"/><path class="ht" d="M12 16.5s-4.2-2.6-4.2-5.2a2.1 2.1 0 0 1 4.2-.9 2.1 2.1 0 0 1 4.2.9c0 2.6-4.2 5.2-4.2 5.2z" fill="#d2414f"/>'];
   $$('.ux-dots button i').forEach((ic,k)=>{if(!ICON[k])return;ic.classList.add('dl-ic');ic.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`});
   dots.append(l);
   l.setAttribute('role','button');l.setAttribute('tabindex','0');l.setAttribute('aria-label','Go to the end of the invitation');l.removeAttribute('aria-hidden');l.style.cursor='pointer';l.style.pointerEvents='auto';
   const toEnd=()=>{scrollTo({top:document.documentElement.scrollHeight,behavior:calm()?'auto':'smooth'});buzz(8)};
   l.addEventListener('click',toEnd);l.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toEnd()}});
   let raf=0;const open=()=>{raf=0;const max=document.documentElement.scrollHeight-innerHeight;l.style.setProperty('--o',(max>0?Math.min(1,scrollY/max):0).toFixed(3))};
   addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(open)},{passive:true});open();
 }

})();
