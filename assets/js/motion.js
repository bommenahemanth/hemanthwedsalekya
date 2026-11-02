
/* Hybrid front end only. Original RSVP/API/config handlers remain in the original script. */
(()=>{'use strict';
 const art=window.HX_CEREMONY_ART;
 const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const body=document.body,root=document.documentElement,loops=[];
 const tapLabel=$('.tap');if(tapLabel){const label=document.createElement('span');label.textContent=tapLabel.textContent;tapLabel.replaceChildren(label)}
 $('.events').id='celebrations';
 const sections=$$('.page .temple');
 sections.forEach((sec,i)=>{
   const light=document.createElement('div');light.className='section-glow';light.setAttribute('aria-hidden','true');sec.prepend(light);
   for(const side of ['left','right']){const rail=document.createElement('div');rail.className='border-rail is-'+side;rail.setAttribute('aria-hidden','true');sec.prepend(rail)}
   const div=sec.querySelector('.gopuram-div');
   if(div&&i<2){const img=new Image();img.src=art[['kalash','lamp'][i]];img.alt='';img.className='ritual-emblem';div.append(img)}
 });
 $$('.tl-item').forEach((li,i)=>{
   const key=['cocktails','haldi','kalash'][i];
   const im=new Image();im.src=art[key];im.alt='';im.className='ritual-icon';
   li.querySelector('.tl-node').append(im);
   const sceneKey=['cocktails','haldi','coconut'][i],scene=document.createElement('figure'),picture=new Image();
   scene.className='event-illustration event-background'+(sceneKey==='fire'?' holy-fire':'');scene.setAttribute('aria-hidden','true');
   picture.className='event-art';picture.src=art[sceneKey];picture.alt='';picture.decoding='async';
   const readability=document.createElement('div');readability.className='event-readability';readability.setAttribute('aria-hidden','true');
   scene.append(picture);li.querySelector('.card').append(scene,readability);
 });
 $('#rsvp>.eyebrow')?.remove();
 const closingNames=$('#photos .couple-line'),closingEnd=closingNames.nextElementSibling,signature=document.createElement('div');
 signature.className='signature-scene';signature.setAttribute('aria-label','Hemanth and Alekya');
 closingNames.before(signature);signature.append(closingNames);
 if(closingEnd?.classList.contains('lead'))signature.append(closingEnd);
 const frame=$('#photos .frame'),stone=new Image();
 stone.src=getComputedStyle(root).getPropertyValue('--art-arch').trim().replace(/^url\(["']?|["']?\)$/g,'');
 stone.alt='';stone.className='photo-stone';stone.setAttribute('aria-hidden','true');frame.append(stone);
 // Reserve real ink room for cursive flourishes after the embedded fonts load.
 function fitNames(){
   $$('.couple-line .script,.envelope-copy .script,.hero h1 .script,#events-title .gold').forEach(el=>{
     el.style.removeProperty('font-size');const parent=el.parentElement,ps=getComputedStyle(parent),box=parent.getBoundingClientRect(),available=box.width-(parseFloat(ps.paddingLeft)||0)-(parseFloat(ps.paddingRight)||0)-16;
     if(available<=0)return;const font=parseFloat(getComputedStyle(el).fontSize),range=document.createRange();range.selectNodeContents(el);const ink=typeof range.getBoundingClientRect==='function'?range.getBoundingClientRect().width:0,width=Math.max(el.scrollWidth||0,ink);
     if(width>available&&font>0)el.style.fontSize=(font*available/width).toFixed(2)+'px';
   });
 }
 if(document.fonts?.ready)document.fonts.ready.then(fitNames);else fitNames();
 let fitQueued=false;addEventListener('resize',()=>{if(fitQueued)return;fitQueued=true;requestAnimationFrame(()=>{fitQueued=false;fitNames()})},{passive:true});
 if(art.ganesha){const ganesh=new Image();ganesh.src=art.ganesha;ganesh.alt='Lord Ganesha';ganesh.className='env-ganesh-art';$('.env-ganesh').hidden=true;$('.env-ganesh').style.display='none';$('.env-ganesh').after(ganesh)}
 let calm=reduced.matches,visible=!document.hidden;
 function pauseLoops(){loops.forEach(t=>t.paused(calm||!visible))}
 function setCalm(value){calm=value||reduced.matches;body.classList.toggle('paused',calm);body.classList.toggle('calm',calm);document.dispatchEvent(new CustomEvent('hx:motion',{detail:calm}));pauseLoops()}
 // Transparent artwork has its own transform; the paper remains continuous.
 function foreground(parent,key,classes){const im=new Image();im.src=art[key];im.alt='';im.className='foreground '+classes;im.setAttribute('aria-hidden','true');parent.prepend(im);return im}
 // Fixed mirroring belongs to the outer slot. GSAP touches only the inner
 // sway layer, so it cannot decompose a reflection into a 180-degree turn.
 function ornament(parent,key,kind,side){
   const slot=document.createElement('div'),sway=document.createElement('div'),im=new Image();
   slot.className=`ornament-slot ${kind}-slot is-${side}`;slot.setAttribute('aria-hidden','true');
   sway.className='ornament-sway';im.className='ornament-art '+kind;im.src=art[key];im.alt='';
   sway.append(im);slot.append(sway);parent.append(slot);return slot;
 }
 foreground($('.events'),'garland','toran');
 sections.forEach(sec=>{foreground(sec,'bell','hanging-bell left');foreground(sec,'bell','hanging-bell right')});
 const procession=document.createElement('div');procession.className='ceremony-procession';procession.setAttribute('aria-hidden','true');
 for(const side of ['left','right'])ornament(procession,'elephant','elephant',side);
 const kalash=new Image();kalash.src=art.kalash;kalash.alt='';kalash.className='procession-kalash';procession.append(kalash);$('.events').append(procession);
 for(const side of ['left','right']){ornament(procession,'banana','plant',side);ornament(frame,'banana','plant',side)}
 for(const side of ['left','right'])foreground($('#photos'),'standing-lamp','lamp '+side);
  /* Large painted ceremony scenes have reserved space outside text and forms. */
 {
   function paintedScene(key,className,alt){
     const scene=document.createElement('figure'),image=document.createElement('img');
     scene.className='painted-scene '+className;
     image.className='painted-scene-art';image.src=art[key];image.alt=alt;image.decoding='async';
     scene.append(image);return scene;
   }
   if(art.pallaki){
     const scene=paintedScene('pallaki','scene-pallaki','Decorated South Indian wedding pallaki');
     $('.events .te-title').after(scene);
   }
   if(art.temple){
     const scene=paintedScene('temple','scene-temple','Hand-painted South Indian temple');
     $('#drive-line').after(scene);
   }
   if(art.sugarcane){
     const parade=$('.ceremony-procession');
     // Use one botanical pair in this scene; banana trees remain by the photos.
     parade.querySelectorAll('.plant-slot').forEach(plant=>plant.remove());
     for(const side of ['left','right'])ornament(parade,'sugarcane','sugarcane',side);
   }
 }

 /* Ceremony objects are placed with their related content, away from the form. */
{
 const musicScene=$('.scene-pallaki');
 if(musicScene&&art.mangalaMusic){
   musicScene.classList.add('mangala-vadyam-scene');
   const music=new Image();music.className='painted-scene-art music-instruments';music.src=art.mangalaMusic;
   music.alt='Nadaswaram, thavil and talam wedding instruments';music.decoding='async';musicScene.prepend(music);
 }
 const rsvpEmblem=$('#rsvp>.gopuram-div .ritual-emblem');
 if(rsvpEmblem&&art.pujaTray){rsvpEmblem.src=art.pujaTray;rsvpEmblem.parentElement.classList.add('puja-heading')}
 const marriage=$('.tl-item.main .event-background');
 if(marriage&&art.jeelakarra){
   const offering=new Image();offering.className='jeelakarra-art';offering.src=art.jeelakarra;offering.alt='';offering.decoding='async';marriage.append(offering);
 }
}

 if(window.gsap&&!reduced.matches){
   const loop=(el,vars)=>loops.push(gsap.to(el,{repeat:-1,yoyo:true,ease:'sine.inOut',...vars}));
   $$('.hanging-bell').forEach((el,i)=>{gsap.set(el,{rotation:i%2?3:-3});loop(el,{rotation:i%2?-3:3,duration:2.8+i*.25,delay:-i*.7})});
   loop($('.toran'),{skewX:.7,y:2,duration:4.6});
   $$('.plant-slot .ornament-sway').forEach((el,i)=>{gsap.set(el,{rotation:i%2?-3:3});loop(el,{rotation:i%2?3:-3,duration:5.6+i*.4,delay:-i*.8})});
   $$('.sugarcane-slot .ornament-sway').forEach((el,i)=>{gsap.set(el,{rotation:i%2?-3:3});loop(el,{rotation:i%2?3:-3,duration:6.4+i*.4,delay:-i*1.5})});
   $$('.scene-pallaki .painted-scene-art').forEach(el=>{gsap.set(el,{rotation:-.8});loop(el,{rotation:.8,duration:5.5})});
   $$('.elephant-slot .ornament-sway').forEach((el,i)=>{gsap.set(el,{rotation:i%2?-1.25:1.25});loop(el,{rotation:i%2?1.25:-1.25,duration:4.8,delay:-i*1.7})});
   $$('.section-glow').forEach((el,i)=>loop(el,{opacity:.35,duration:4.1+i}));
   $$('.lamp').forEach((el,i)=>loop(el,{filter:'drop-shadow(0 0 15px #edab4277)',duration:.8+i*.3}));
   $$('.ritual-icon').forEach((el,i)=>loop(el,{filter:'drop-shadow(0 0 7px #e5ac47bb)',duration:2.2+i*.12,delay:-i*.55}));
 }
 // A short warm wash bridges sections while their existing text reveals play.
 const entryObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting||reduced.matches||!window.gsap)return;
   const wash=entry.target.querySelector('.section-transition');
   gsap.killTweensOf(wash);gsap.fromTo(wash,{opacity:0},{opacity:.34,duration:.75,ease:'sine.inOut',repeat:1,yoyo:true});
 }),{threshold:.10,rootMargin:'0px 0px -8% 0px'});
 sections.forEach(sec=>{const wash=document.createElement('div');wash.className='section-transition';wash.setAttribute('aria-hidden','true');sec.prepend(wash);entryObserver.observe(sec)});
  /* Devotional emblems remain upright and static; their settings carry motion. */
 {
   if(art.namam){
     const namam=document.createElement('img');
     namam.className='hero-namam';namam.src=art.namam;
     namam.alt='Tirunamam of Sri Venkateswara';namam.decoding='async';
     $('#hero-copy').prepend(namam);
   }
   if(art.sitaRama){
     // Retain this element and its existing admin-tap listener.
     const heading=$('#photos .gopuram-div'),image=document.createElement('img'),caption=document.createElement('p');
     heading.classList.remove('devotional-heading');heading.classList.add('photo-blessing');
     heading.removeAttribute('aria-hidden');heading.replaceChildren();
     image.className='photo-blessing-art';image.src=art.sitaRama;
     image.alt='Sita and Rama';image.decoding='async';
     caption.className='photo-blessing-caption';caption.lang='te';
     caption.textContent='శ్రీ సీతారాముల ఆశీస్సులతో';
     heading.append(image,caption);
     // Ganesha remains prominent on the cover; this is the Sita–Rama blessing.
     $('#photos .shloka')?.remove();
   }
 }

 /* Generated whole flowers begin only after the envelope reveal completes. */
function initWeddingFlowers({art,root,body,reduced}){
 const canvas=document.createElement('canvas');canvas.id='wedding-flowers';canvas.setAttribute('aria-hidden','true');body.append(canvas);
 const ctx=canvas.getContext('2d');
 let width=0,height=0,dpr=1,raf=0,last=0,clock=0,destroyed=false,visible=!document.hidden,quiet=Boolean(reduced.matches);
 const random=(min,max)=>min+Math.random()*(max-min),images=new Map(),sprites=[];
 const specs=[['jasmineFlower',.25],['banthiOrange',.45],['banthiYellow',.65],['roseFlower',.80],['lotusFlower',.90],['mangoLeaf',1]];
 const sizes={jasmineFlower:[22,30],banthiOrange:[24,34],banthiYellow:[24,34],roseFlower:[26,36],lotusFlower:[30,42],mangoLeaf:[30,42]};
 function place(sprite,initial){
   const edge=Math.random()<.75,side=Math.random()<.5;
   sprite.edge=edge;sprite.x=edge?(side?random(.018,.15):random(.85,.982)):random(.28,.72);
   sprite.y=initial?random(-.08,1.04):random(-.22,-.04);
   sprite.speed=random(34,58);sprite.size=random(...sizes[sprite.key]);
   sprite.gentle=sprite.key==='lotusFlower'||sprite.key==='mangoLeaf';
   sprite.phase=random(0,Math.PI*2);sprite.angle=sprite.gentle?random(-.08,.08):random(0,Math.PI*2);sprite.spin=sprite.gentle?0:random(-.19,.19);
   sprite.sway=random(5,11);sprite.alpha=edge?random(.66,.88):random(.26,.40);
 }
 function resize(){
   const page=document.getElementById('page'),box=canvas.getBoundingClientRect(),pageWidth=page?.getBoundingClientRect().width;
   width=Math.max(1,box.width||pageWidth||Math.min(root.clientWidth||innerWidth||390,480));
   height=Math.max(1,box.height||innerHeight||root.clientHeight||844);
   dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
   if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
   const count=width<350?9:width<390?12:13;
   if(sprites.length!==count){sprites.length=0;for(let i=0;i<count;i++){const q=(i+.5)/count,key=specs.find(([,limit])=>q<limit)[0],sprite={key};place(sprite,true);sprites.push(sprite)}}
   if(quiet&&ctx)ctx.clearRect(0,0,width,height);
 }
 function state(){canvas.dataset.state=quiet?'reduced':!body.classList.contains('opening-complete')?'waiting-for-open':!visible?'hidden':images.size?'running':'loading'}
 function frame(now){
   raf=0;if(destroyed||quiet||!visible||!ctx||!body.classList.contains('opening-complete'))return;
   const dt=last?Math.min(.05,(now-last)/1000):0;last=now;clock+=dt;
   ctx.clearRect(0,0,width,height);
   for(const sprite of sprites){
     sprite.y+=dt*sprite.speed/height;sprite.angle+=dt*sprite.spin;
     if(sprite.y*height>height+sprite.size*2)place(sprite,false);
     const image=images.get(sprite.key);if(!image)continue;
     const x=sprite.x*width+Math.sin(clock*.35+sprite.phase)*sprite.sway,y=sprite.y*height;
     const tilt=(sprite.gentle ? .94 : .86)+(sprite.gentle ? .06 : .14)*Math.cos(clock*.55+sprite.phase),bob=1+(sprite.gentle ? .025 : .045)*Math.sin(clock*.8+sprite.phase);
     const rotation=sprite.gentle?sprite.angle+Math.sin(clock*.38+sprite.phase)*.08:sprite.angle;
     const naturalAspect=image.naturalWidth/image.naturalHeight||1;
     const imageWidth=naturalAspect>=1?sprite.size:sprite.size*naturalAspect,imageHeight=naturalAspect>=1?sprite.size/naturalAspect:sprite.size;
     ctx.save();ctx.globalAlpha=sprite.alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(tilt,bob);
     ctx.drawImage(image,-imageWidth/2,-imageHeight/2,imageWidth,imageHeight);ctx.restore();
   }
   raf=requestAnimationFrame(frame);
 }
 function start(){state();if(!destroyed&&!quiet&&visible&&ctx&&images.size&&!raf&&body.classList.contains('opening-complete')){last=0;raf=requestAnimationFrame(frame)}}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0}
 function onVisibility(){visible=!document.hidden;if(!visible)stop();else start();state()}
 function onPreference(){quiet=Boolean(reduced.matches);if(quiet){stop();if(ctx)ctx.clearRect(0,0,width,height)}else start();state()}
 function onResize(){resize();start()}
 document.addEventListener('visibilitychange',onVisibility);
 document.addEventListener('hx:opening-complete',start);
 if(reduced.addEventListener)reduced.addEventListener('change',onPreference);else reduced.addListener?.(onPreference);
 addEventListener('resize',onResize,{passive:true});
 resize();state();
 for(const [key] of specs){
   if(!art[key])continue;
   const image=new Image();image.decoding='async';let loaded=false;
   const ready=()=>{if(loaded||destroyed||!image.naturalWidth)return;loaded=true;images.set(key,image);start()};
   image.addEventListener('load',ready,{once:true});image.src=art[key];
   if(image.complete)ready();
   if(typeof image.decode==='function')image.decode().then(ready,()=>{});
 }
 return {canvas,destroy(){destroyed=true;stop();document.removeEventListener('visibilitychange',onVisibility);document.removeEventListener('hx:opening-complete',start);if(reduced.removeEventListener)reduced.removeEventListener('change',onPreference);else reduced.removeListener?.(onPreference);removeEventListener('resize',onResize);canvas.remove()}};
}
initWeddingFlowers({art,root,body,reduced});

 /* RSVP icon enhancement. Labels, native inputs and submission values stay intact. */
(()=>{
  const form=document.querySelector('#rsvp-form');
  if(!form)return;
  const rsvpArt=window.HX_CEREMONY_ART||{};
  const glyphs={
    male:'<circle cx="9" cy="15" r="5"/><path d="m13 11 7-7M15 4h5v5"/>',
    female:'<circle cx="12" cy="8" r="5"/><path d="M12 13v9M8 18h8"/>',
    other:'<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
    yes:'<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',
    maybe:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.3c-.7.4-1.1.9-1.1 1.7v.5M12 17h.01"/>',
    no:'<circle cx="12" cy="12" r="9"/><path d="m8.5 8.5 7 7m0-7-7 7"/>',
    dates:'<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3.5v4M17 3.5v4M3.5 10.5h17M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
    guests:'<circle cx="9" cy="7.5" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4.5V21"/>',
    stay:'<path d="M3 5v16M21 11v10M3 17h18M3 10h5v7M8 10h9a4 4 0 0 1 4 4v3"/><circle cx="5.5" cy="12.5" r="1"/>'
  };
  function glyph(key){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
    svg.classList.add('rsvp-ui-glyph');svg.innerHTML=glyphs[key]||'';return svg;
  }
  form.querySelector('input[name="gender"]')?.closest('.chips')?.classList.add('gender-choices');
  form.querySelectorAll('input[name="gender"]').forEach(input=>{
    const label=input.nextElementSibling;if(!label||label.querySelector('.rsvp-ui-glyph'))return;
    label.prepend(glyph(input.value));
  });
  form.querySelectorAll('input[name="status"]').forEach(input=>{
    const label=input.nextElementSibling;if(!label)return;
    let icon=label.querySelector('i');if(!icon){icon=document.createElement('i');label.prepend(icon)}
    icon.classList.add('rsvp-choice-icon');icon.setAttribute('aria-hidden','true');icon.replaceChildren(glyph(input.value));
  });
  const groups=[['fieldset[data-err="days"]>legend','dates'],['#going>div>fieldset:nth-of-type(2)>legend','guests'],['#going>div>fieldset:nth-of-type(3)>legend','stay']];
  groups.forEach(([selector,key])=>{const legend=form.querySelector(selector);if(legend&&!legend.querySelector('.rsvp-ui-glyph'))legend.prepend(glyph(key))});
  const eventById={sangeet:'cocktails',haldi:'haldi',muhurtham:'coconut'};
  const eventByText=[[/sangeet|cocktail/i,'cocktails'],[/haldi/i,'haldi'],[/marriage|muhurtham/i,'coconut']];
  const list=form.querySelector('#ev-list');
  function decorateEvents(){
    if(!list)return;
    Array.from(list.children).forEach(li=>{
      const key=eventById[li.dataset.eventId]||eventByText.find(([pattern])=>pattern.test(li.textContent))?.[1];
      if(!key||!rsvpArt[key])return;
      let icon=li.querySelector('.rsvp-event-art');
      if(!icon){icon=new Image();icon.className='rsvp-event-art';icon.alt='';icon.setAttribute('aria-hidden','true');icon.decoding='async';li.prepend(icon)}
      if(icon.getAttribute('src')!==rsvpArt[key])icon.src=rsvpArt[key];
      li.dataset.ritual=key;
    });
  }
  decorateEvents();
  // syncRange() replaces only the list's direct children when dates change.
  // Observe that boundary; decorating a child cannot retrigger this observer.
  if(list)new MutationObserver(decorateEvents).observe(list,{childList:true});
})();

 /* Eagerly warm all photos, foregrounds and CSS artwork before the tap/reveal.
    decode() happens off the critical interaction path; the deadline is finite. */
 body.dataset.preloadState='loading';root.dataset.assets='loading';
 const preloadSet=new Set(),preloadImages=[];
 $$('img').forEach(im=>{if(im.dataset.src&&!im.getAttribute('src'))im.src=im.dataset.src;im.loading='eager';im.decoding='async';if(im.src){preloadSet.add(im.src);preloadImages.push(im)}});
 const css=getComputedStyle(root);
 ['--envelope','--art-arch','--art-frame','--art-border'].forEach(key=>{const v=css.getPropertyValue(key).trim();const m=v.match(/^url\(["']?(.*?)["']?\)$/);if(m)preloadSet.add(m[1])});
 Object.values(art).forEach(src=>preloadSet.add(src));
 const existing=new Set(preloadImages.map(im=>im.src));
 preloadSet.forEach(src=>{if(existing.has(src))return;const im=new Image();im.decoding='async';im.src=src;preloadImages.push(im)});
 body.dataset.preloadCount=String(preloadImages.length);root.dataset.assetCount=String(preloadImages.length);
 let preloadExpired=false;
 const preloadDeadline=setTimeout(()=>{preloadExpired=true;if(body.dataset.preloadState==='loading'){body.dataset.preloadState='timeout';root.dataset.assets='timeout'}},5000);
 Promise.allSettled(preloadImages.map(im=>typeof im.decode==='function'?im.decode():im.complete?Promise.resolve():new Promise((resolve,reject)=>{im.addEventListener('load',resolve,{once:true});im.addEventListener('error',reject,{once:true})}))).then(results=>{clearTimeout(preloadDeadline);root.dataset.assetLoaded=String(results.filter(r=>r.status==='fulfilled').length);root.dataset.assetFailed=String(results.filter(r=>r.status==='rejected').length);if(!preloadExpired){body.dataset.preloadState='ready';root.dataset.assets='ready'}});
 /* Opening, about 7.3 s: a row of diyas lights around the envelope and its sparks run to the seal (0–1.6 s);
    an aarti flame circles the seal three times (1.4–2.9 s); the seal breaks with a bell (2.95 s); light runs from
    the seal along the four folds and round the rim (3–4.25 s); the flaps lift open slowly with the glow riding
    their edges while warm light spills from inside (4.2–6.3 s); a golden flash hands over to silk curtains that
    part on the temple arch (5.7–8 s). */
 const opening=document.createElement('div');opening.id='opening-light';opening.setAttribute('aria-hidden','true');body.append(opening);
 let openingActive=false;
 const smooth=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)};
 const ramp=(a,b,v)=>Math.min(1,Math.max(0,(v-a)/(b-a)));
 $('#open').addEventListener('click',()=>{
   if(openingActive||body.classList.contains('opening-complete'))return;
   if(reduced.matches){body.classList.add('opening-reveal','opening-complete');body.dataset.openingState='complete';root.classList.remove('locked');return}
   openingActive=true;body.dataset.openingState='playing';body.dataset.openingPhase='diyas';
   const env=$('#envelope'),seal=$('.envelope .seal-art'),heroArt=$('#hero-art'),r=env.getBoundingClientRect(),W=innerWidth,H=innerHeight;
   const ew=r.width||Math.min(W,480),eh=r.height||H,cx=r.left+ew*.507,cy=r.top+eh*.46,dpr=Math.min(devicePixelRatio||1,1.5);
   const canvasFor=(z,cls)=>{const c=document.createElement('canvas');c.className=cls;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);c.style.cssText=`position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:${z}`;const g=c.getContext('2d');if(g)g.setTransform(dpr,0,0,dpr,0,0);return [c,g]};
   const [lightCanvas,lc]=canvasFor(0,'opening-canvas');opening.removeAttribute('style');opening.replaceChildren(lightCanvas);opening.style.opacity='1';
   const curtains=document.createElement('div');curtains.id='ux-curtains';curtains.setAttribute('aria-hidden','true');curtains.innerHTML='<i></i><i></i>';body.append(curtains);
   // Diyas sit around the inside edge of the envelope, lit clockwise from the bottom centre.
   const L=r.left+ew*.08,R=r.left+ew*.92,T=r.top+eh*.1,B=r.top+eh*.9,pw=R-L,ph=B-T,per=2*(pw+ph);
   const onEdge=s=>{let d=(pw/2+s*per)%per;if(d<pw)return[R-d,B];d-=pw;if(d<ph)return[L,B-d];d-=ph;if(d<pw)return[L+d,T];d-=pw;return[R,T+d]};
   const diyas=Array.from({length:16},(_,i)=>{const [x,y]=onEdge(i/16);return{x,y,on:.15+i*.07,run:1.05+i*.025,ph:Math.random()*6.3}});
   // Glowing folds: each flap carries the inner half of the glow on its own edges, so the light moves with it as it opens.
   const pt=(x,y)=>[ew*x/100,eh*y/100],CL=pt(42,46.3),CR=pt(54.2,47.1),TL=pt(0,21.5),TR=pt(100,22),BL=pt(0,69.5),BR=pt(100,71.8);
   const SEAMS={tl:[CL,TL],tr:[CR,TR],bl:[CL,BL],br:[CR,BR]};
   const RIMS={tlUp:[TL,pt(0,0),pt(50,0)],trUp:[TR,pt(100,0),pt(50,0)],tlDown:[TL,pt(0,45.5)],blUp:[BL,pt(0,45.5)],trDown:[TR,pt(100,46.9)],brUp:[BR,pt(100,46.9)],blDown:[BL,pt(0,100),pt(50,100)],brDown:[BR,pt(100,100),pt(50,100)]};
   const FLAPS={top:['tl','tr','tlUp','trUp'],left:['tl','bl','tlDown','blUp'],right:['tr','br','trDown','brUp'],bottom:['bl','br','blDown','brDown']};
   const lenOf=ps=>ps.slice(1).reduce((s,p,i)=>s+Math.hypot(p[0]-ps[i][0],p[1]-ps[i][1]),0);
   const along=(ps,u)=>{let d=lenOf(ps)*u;for(let i=1;i<ps.length;i++){const a=ps[i-1],b=ps[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d<=l||i===ps.length-1){const k=l?Math.min(1,d/l):0;return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k]}d-=l}return ps[0]};
   const NS='http://www.w3.org/2000/svg',edgeSvgs=[],edgeLines=[];
   Object.entries(FLAPS).forEach(([side,keys])=>{
     const part=env.querySelector('.part.'+side);if(!part)return;
     const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','hx-edge');svg.setAttribute('viewBox',`0 0 ${ew} ${eh}`);svg.setAttribute('aria-hidden','true');
     svg.innerHTML=`<defs><filter id="hx-blur-${side}" filterUnits="userSpaceOnUse" x="-60" y="-60" width="${ew+120}" height="${eh+120}"><feGaussianBlur stdDeviation="7"/></filter><filter id="hx-soft-${side}" filterUnits="userSpaceOnUse" x="-60" y="-60" width="${ew+120}" height="${eh+120}"><feGaussianBlur stdDeviation="2.2"/></filter></defs>`;
     keys.forEach(k=>{const ps=SEAMS[k]||RIMS[k],len=lenOf(ps),g=document.createElementNS(NS,'g');
       g.style.strokeDasharray=`${len} ${len*3}`;g.style.strokeDashoffset=String(len+4);
       [['halo',`hx-blur-${side}`],['glow',`hx-soft-${side}`],['core','']].forEach(([c,f])=>{const p=document.createElementNS(NS,'path');p.setAttribute('d','M'+ps.map(q=>q.map(v=>v.toFixed(1)).join(' ')).join('L'));p.setAttribute('class',c);if(f)p.setAttribute('filter',`url(#${f})`);g.append(p)});
       svg.append(g);edgeLines.push({g,len,rim:!SEAMS[k]})});
     part.append(svg);edgeSvgs.push(svg)});
   const sparks=[];
   // The aarti circles a uniform gap outside the wax seal (same ellipse as .seal-art's clip), so the orbit is an ellipse.
   const ring=Math.max(10,ew*.03),rx=ew*.164+ring,ry=eh*.094+ring,reach=Math.hypot(W,H);
   let start=0,prev=0,raf=0,broke=false,revealed=false,flashed=false,parted=false,done=false;
   const flame=(x,y,s,a,flick)=>{
     const halo=lc.createRadialGradient(x,y-4*s,0,x,y-4*s,26*s);halo.addColorStop(0,`rgba(255,214,120,${.55*a})`);halo.addColorStop(1,'rgba(255,170,60,0)');
     lc.fillStyle=halo;lc.beginPath();lc.arc(x,y-4*s,26*s,0,6.283);lc.fill();
     const h=12*s*(1+.12*Math.sin(flick)),w=4.6*s,g=lc.createLinearGradient(x,y-h,x,y);g.addColorStop(0,`rgba(255,150,40,0)`);g.addColorStop(.35,`rgba(255,196,70,${a})`);g.addColorStop(1,`rgba(255,250,220,${a})`);
     lc.fillStyle=g;lc.beginPath();lc.moveTo(x,y-h);lc.bezierCurveTo(x+w,y-h*.45,x+w,y,x,y);lc.bezierCurveTo(x-w,y,x-w,y-h*.45,x,y-h);lc.fill();
   };
   const dot=(x,y,rad,a,col='255,232,170')=>{const g=lc.createRadialGradient(x,y,0,x,y,rad*4);g.addColorStop(0,`rgba(255,255,240,${a})`);g.addColorStop(.25,`rgba(${col},${a*.8})`);g.addColorStop(1,`rgba(${col},0)`);lc.fillStyle=g;lc.beginPath();lc.arc(x,y,rad*4,0,6.283);lc.fill()};
   const burst=(n,speed)=>{for(let i=0;i<n;i++){const a=Math.random()*6.283,v=speed*(.35+Math.random()*.65);sparks.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.7+Math.random()*.9,age:0,size:1+Math.random()*1.8})}};
   function finish(){
     if(done)return;done=true;body.dataset.openingState='complete';body.dataset.openingPhase='complete';body.classList.add('opening-reveal','opening-complete');
     root.classList.remove('locked');document.dispatchEvent(new CustomEvent('hx:opening-swell'));document.dispatchEvent(new CustomEvent('hx:opening-complete'));openingActive=false;
   }
   function cleanup(){cancelAnimationFrame(raf);opening.style.opacity='0';lightCanvas.remove();curtains.remove();edgeSvgs.forEach(s=>s.remove());finish()}
   function frame(now){
     raf=requestAnimationFrame(frame);start=start||now;const t=(now-start)/1000,dt=Math.min(.05,(now-(prev||now))/1000);prev=now;
     if(!lc){if(t>3.4&&!revealed){revealed=true;body.classList.add('hx-parts','opening-reveal')}if(t>6)cleanup();return}
     lc.clearRect(0,0,W,H);lc.globalCompositeOperation='lighter';
     body.dataset.openingPhase=t<1.35?'diyas':t<2.95?'aarti':t<4.2?'seal':'reveal';
     // Diyas, then their sparks run to the seal.
     diyas.forEach(d=>{
       const a=smooth(d.on,d.on+.25,t)*(1-smooth(2.1,2.8,t));if(a>0)flame(d.x,d.y,.9,a,t*9+d.ph);
       const u=ramp(d.run,d.run+.5,t);if(u>0&&u<1){const e=u*u,x=d.x+(cx-d.x)*e,y=d.y+(cy-d.y)*e;dot(x,y,2.4,.9);dot(d.x+(cx-d.x)*Math.max(0,e-.08),d.y+(cy-d.y)*Math.max(0,e-.08),1.4,.4)}
     });
     // The seal gathers light.
     const core=(.25*smooth(.3,1.6,t)+.6*smooth(1.2,2.9,t))*(1-.45*smooth(3.1,3.9,t))+.5*smooth(3.95,4.35,t)*(1-smooth(5.9,6.7,t));
     if(core>0){const rad=30+70*core+6*Math.sin(t*11),g=lc.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,`rgba(255,250,225,${.9*Math.min(1,core)})`);g.addColorStop(.35,`rgba(255,205,110,${.55*Math.min(1,core)})`);g.addColorStop(1,'rgba(255,160,50,0)');lc.fillStyle=g;lc.beginPath();lc.arc(cx,cy,rad,0,6.283);lc.fill()}
     if(t>1.6)seal?.classList.add('ux-seal-hot');
     // Aarti flame: three turns clockwise with a fading trail and falling sparks.
     const ai=smooth(1.35,1.6,t)*(1-smooth(2.85,3.05,t));
     if(ai>0){
       const ang=-Math.PI/2+smooth(1.35,2.95,t)*Math.PI*6;
       lc.strokeStyle=`rgba(255,210,120,${.16*ai})`;lc.lineWidth=1.2;lc.beginPath();lc.ellipse(cx,cy,rx,ry,0,0,6.283);lc.stroke();
       for(let k=22;k>=0;k--){const a=ang-k*.09,q=1-k/22;dot(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,1+2.4*q,ai*q*q)}
       flame(cx+Math.cos(ang)*rx,cy+Math.sin(ang)*ry,1.25,ai,t*12);
       if(Math.random()<.55)sparks.push({x:cx+Math.cos(ang)*rx,y:cy+Math.sin(ang)*ry,vx:(Math.random()-.5)*40,vy:-10-Math.random()*30,life:.6+Math.random()*.5,age:0,size:.8+Math.random()});
     }
     // The seal breaks: a few embers and a small vibration. The flaps take over from the single envelope image.
     if(t>=2.95&&!broke){broke=true;burst(18,90);try{navigator.vibrate&&navigator.vibrate(22)}catch{}seal?.classList.add('ux-seal-crack');body.classList.add('hx-parts');body.dataset.openingPhase='seal'}
     // Light runs from the seal along the four folds (3–3.75 s), then both ways round the rim until it meets (3.6–4.25 s).
     const seamU=smooth(3,3.75,t),rimU=smooth(3.6,4.25,t),edgeA=smooth(2.98,3.15,t)*(1-smooth(5.3,6.1,t))*(.9+.1*Math.sin(t*13));
     edgeSvgs.forEach(s=>{s.style.opacity=edgeA.toFixed(3)});
     edgeLines.forEach(e=>{e.g.style.strokeDashoffset=String((e.len+4)*(1-(e.rim?rimU:seamU)))});
     const heads=(lines,u)=>{if(u<=0||u>=1)return;Object.values(lines).forEach(ps=>{const [x,y]=along(ps,u);dot(r.left+x,r.top+y,3.2,.95);dot(r.left+x,r.top+y,9,.18)})};
     heads(SEAMS,seamU);heads(RIMS,rimU);
     // Warm light from inside as the flaps lift.
     const inner=smooth(4.2,5.4,t)*(1-smooth(5.9,6.8,t));
     if(inner>0){const rad=reach*(.22+.38*inner),g=lc.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,`rgba(255,248,222,${.62*inner})`);g.addColorStop(.4,`rgba(255,210,125,${.3*inner})`);g.addColorStop(1,'rgba(255,180,80,0)');lc.fillStyle=g;lc.fillRect(0,0,W,H)}
     if(t>=4.2&&!revealed){revealed=true;body.classList.add('opening-reveal');document.dispatchEvent(new CustomEvent('hx:opening-swell'))}
     // The silk curtains wait right behind the envelope, so the opening flaps reveal them (no empty stage), then they part.
     if(t>=4.1&&!flashed){flashed=true;curtains.classList.add('show')}
     if(t>=5.9&&!parted){parted=true;curtains.classList.add('part');if(heroArt)heroArt.animate([{scale:'1.14'},{scale:'1'}],{duration:2100,easing:'cubic-bezier(.2,.7,.2,1)'});document.dispatchEvent(new CustomEvent('hx:curtains-part'))}
     // Sparks.
     for(let i=sparks.length-1;i>=0;i--){const p=sparks[i];p.age+=dt;if(p.age>p.life){sparks.splice(i,1);continue}p.vx*=.985;p.vy=p.vy*.985+140*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;dot(p.x,p.y,p.size,1-p.age/p.life)}
     if(t>=6.6)finish();
     if(t>=7.6)cleanup();
   }
   raf=requestAnimationFrame(frame);
   setTimeout(()=>{if(!done)cleanup()},11000);
 });
 /* Soft bokeh and flame flicker keep every section alive without shifting text. */
 const canvas=document.createElement('canvas');canvas.id='ambient-lights';canvas.setAttribute('aria-hidden','true');body.append(canvas);
 const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,raf=0,last=0,time=0;
 const motes=Array.from({length:28},(_,i)=>({x:Math.random(),y:Math.random(),r:1.1+Math.random()*2.5,s:.004+Math.random()*.009,phase:Math.random()*6.28,edge:i%3!==0}));
 function size(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0)}
 function homaImageBox(image){
   if(!image.naturalWidth||!image.naturalHeight)return null;
   const box=image.getBoundingClientRect(),iw=image.naturalWidth,ih=image.naturalHeight,scale=Math.min(box.width/iw,box.height/ih);
   const width=iw*scale,height=ih*scale;
   return {left:box.left+(box.width-width)/2,top:box.top+(box.height-height)/2,width,height};
 }
 function paintHoma(image,t){
   const r=homaImageBox(image);if(!r||!r.width||!r.height)return;
   // The live fire grows from the wood inside the generated pit's inner rim.
   const cx=r.left+r.width*.54,base=r.top+r.height*.42,H=r.height*.24,spread=r.width*.16;
   ctx.save();ctx.beginPath();ctx.rect(r.left,r.top,r.width,r.height);ctx.clip();ctx.globalCompositeOperation='screen';
   const glow=ctx.createRadialGradient(cx,base-H*.2,0,cx,base-H*.2,H*1.15);
   glow.addColorStop(0,'rgba(255,176,36,.32)');glow.addColorStop(.5,'rgba(255,118,16,.13)');glow.addColorStop(1,'rgba(255,131,24,0)');
   ctx.fillStyle=glow;ctx.fillRect(cx-H*1.2,base-H*1.4,H*2.4,H*2.4);
   for(let j=0;j<7;j++){
     const x=cx+(j-3)*spread/4,phase=t*(3.4+j*.19)+j*1.67,fh=H*(.58+.26*Math.sin(phase)*Math.sin(phase*.57)),fw=spread*(.19+.025*(j%3)),tip=x+Math.sin(phase*.83)*fw*.8;
     const g=ctx.createLinearGradient(x,base-fh,x,base);g.addColorStop(0,'rgba(255,168,28,0)');g.addColorStop(.2,'rgba(255,181,50,.7)');g.addColorStop(.6,'rgba(255,219,105,.92)');g.addColorStop(1,'rgba(255,250,204,.84)');
     ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-fw,base);ctx.bezierCurveTo(x-fw*1.7,base-fh*.3,tip-fw*.4,base-fh*.64,tip,base-fh);ctx.bezierCurveTo(tip+fw*.3,base-fh*.6,x+fw*1.6,base-fh*.18,x+fw,base);ctx.closePath();ctx.fill();
   }
   for(let j=0;j<5;j++){const q=(t*.27+j*.21)%1,x=cx+Math.sin(j*2.7+t*.5)*spread*.65,y=base-H*q*1.6;ctx.fillStyle=`rgba(255,213,100,${(1-q)*.65})`;ctx.beginPath();ctx.arc(x,y,.55+(j%2)*.35,0,Math.PI*2);ctx.fill()}
   ctx.restore();
 }
 function draw(now){raf=0;if(!ctx||!visible||calm||!body.classList.contains('opened'))return;const dt=Math.min(.05,(now-(last||now))/1000);last=now;time+=dt;ctx.clearRect(0,0,w,h);
   const page=$('#page').getBoundingClientRect(),wide=page.width,ox=page.left;
   motes.forEach((p,i)=>{p.y-=p.s*dt;if(p.y<-.1)p.y=1.1;let x=ox+p.x*wide;if(p.edge)x=ox+(i%2?(0.88+p.x*.12):p.x*.12)*wide;x+=Math.sin(time*.22+p.phase)*9;
     const y=p.y*h,rad=p.r*(1+.22*Math.sin(time*.8+p.phase)),alpha=.08+.12*(.5+.5*Math.sin(time*.65+p.phase));
     const g=ctx.createRadialGradient(x,y,0,x,y,rad*8);g.addColorStop(0,`rgba(255,242,191,${alpha*1.7})`);g.addColorStop(.13,`rgba(255,218,126,${alpha})`);g.addColorStop(1,'rgba(255,191,76,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rad*8,0,Math.PI*2);ctx.fill();
   });
   $$('.foreground.lamp').forEach((lamp,i)=>{const r=lamp.getBoundingClientRect();if(r.bottom<0||r.top>h)return;const x=r.left+r.width*.5,y=r.top+r.height*.20,rad=18+Math.sin(time*7+i)*2;const g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,'rgba(255,246,204,.8)');g.addColorStop(.25,'rgba(255,201,85,.28)');g.addColorStop(1,'rgba(255,171,43,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rad,0,Math.PI*2);ctx.fill()});
   $$('.holy-fire .event-art').forEach(image=>{const r=image.getBoundingClientRect();if(r.bottom>0&&r.top<h)paintHoma(image,time)});
   // Scroll depth is confined to transparent side ornament, never names or controls.
   $$('.plant-slot,.sugarcane-slot').forEach(plant=>{const r=plant.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>h)return;const depth=Math.max(-4,Math.min(4,(r.top+r.height*.5-h*.5)*.012));plant.style.translate=`0 ${depth.toFixed(2)}px`});
   raf=requestAnimationFrame(draw)
 }
 function start(){last=0;if(ctx&&!raf&&!calm&&visible&&body.classList.contains('opened'))raf=requestAnimationFrame(draw)}
 new MutationObserver(start).observe(body,{attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;pauseLoops();if(!visible){cancelAnimationFrame(raf);raf=0}else start()});
 addEventListener('resize',size,{passive:true});reduced.addEventListener('change',()=>{setCalm(reduced.matches);if(calm){cancelAnimationFrame(raf);raf=0;if(ctx)ctx.clearRect(0,0,w,h);$$('.plant-slot').forEach(p=>p.style.translate='0 0')}else start()});
 size();setCalm(reduced.matches);start();
})();

