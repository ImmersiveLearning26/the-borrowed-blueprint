import {CONTENT as C} from './content.js';
import {fresh,dispatch,result,resumeClips,weakest} from './engine.js';
import {Atlas} from './map.js';
import {Voice,speakers} from './audio.js';
import {Strands} from './strands.js';
import {Talk,rubberBand,patch,stagger,reducedMotion,readingMs,mountPortrait} from './motion.js';
import {mountHover,strandText} from './hover.js';
const talk=new Talk();
const $=id=>document.getElementById(id), el=(tag,props={})=>Object.assign(document.createElement(tag),props);
const devMode=new URLSearchParams(location.search).has('dev');
const KEY=devMode?'borrowed-blueprint-dev-v1':'borrowed-blueprint-v1';
let saved;try{saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version!==1)saved=null;}catch{saved=null;}
let state=fresh(),selectedSource=null,choice=null,attached=[],lesson=null,limit=null,closingStep=0,characterMin=false,lastVoiceId=null,lastSpeaker=null,lastFocus='',lastCharacterClips={},cardFolded=true,foldTimer=0,reading=null,captionHeld=false;
let prefs={sound:true,cc:false,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,text:1};try{prefs={...prefs,...JSON.parse(localStorage.getItem(KEY+'-prefs')||'{}')};}catch{}
const atlas=new Atlas($('atlas'),$('markers'));
let voice;
const btn=(text,fn,cls='')=>{const b=el('button',{textContent:text,className:cls});b.onclick=fn;return b;};
const icon=(text,label,fn)=>{const b=btn(text,fn,'icon');const name=({'Ⅱ':'pause','▷':'play','↻':'arrow-counter-clockwise','−':'minus','×':'x','›':'skip-forward'})[text];if(name){b.textContent='';const image=el('img',{src:'assets/icons/'+name+'.svg',alt:''});image.width=18;image.height=18;b.append(image);}b.setAttribute('aria-label',label);b.title=label;return b;};
function toast(t){$('toast').textContent=t;$('toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('visible'),4000);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));saved=state;}catch{toast('This browser could not save your progress. Keep this tab open.');}}
function act(type,p={}){try{const r=dispatch(state,type,p);state=r.state;choice=null;attached=[];if(type==='claim')renderActions.claimAttachments=false;if(type==='closing')closingStep=0;save();render();voice.play(r.clips);}catch(e){toast(e.message);if(type==='check')voice.play(['S4_NO_HOURS']);}}
function options(values,select=choice,onSelect=i=>{choice=i;renderActions();}){const group=el('div',{className:'group'});group.setAttribute('role','radiogroup');values.forEach((v,i)=>{const b=btn(v,()=>onSelect(i),i===select?'selected':'');b.setAttribute('role','radio');b.setAttribute('aria-checked',String(i===select));group.append(b);});return group;}
// A play control that sits inside the option's lower-right corner: a 44px hit area around a small glass dot.
function readButton(fn){const b=icon('▷','Read this option aloud',fn);b.className='read';const dot=el('span',{className:'dot'});dot.append(...b.childNodes);b.append(dot);return b;}
/* Reading an option aloud: the option squeezes into a small glass circle, shoots toward the caption (fast, then
   easing in, along an arc), and ripples out there as the caption opens from that point and its text rises in.
   While it is being read the option stays in place, greyed out and inactive, until the line ends. If no caption will show
   (sound on, captions off), the circle flies to the guide's orb instead. */
function readOption(id){const rowEl=[...$('actions').querySelectorAll('.option-row')].find(r=>r.dataset.clip===id);if(reducedMotion()||!rowEl){voice.play([id]);return;}
 const r=rowEl.querySelector('.option').getBoundingClientRect(),fly=el('div',{className:'flyer'});Object.assign(fly.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});document.body.append(fly);
 reading={id,started:false};captionHeld=true;renderActions();voice.play([id]);
 requestAnimationFrame(async()=>{const cap=$('caption'),D=28,cx=r.left+r.width/2,cy=r.top+r.height/2;
  const tr=!cap.hidden?cap.getBoundingClientRect():$('guide').querySelector('.agent').getBoundingClientRect(),tx=!cap.hidden?tr.left+Math.min(64,tr.width/2):tr.left+tr.width/2,ty=tr.top+tr.height/2;
  // 1. Squeeze: the card pulls in to a circle and settles with a small squash.
  await fly.animate([{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',borderRadius:'18px',scale:'1 1'},{left:cx-D/2+'px',top:cy-D/2+'px',width:D+'px',height:D+'px',borderRadius:D/2+'px',scale:'1.18 .84',offset:.82},{left:cx-D/2+'px',top:cy-D/2+'px',width:D+'px',height:D+'px',borderRadius:D/2+'px',scale:'1 1'}],{duration:380,easing:'cubic-bezier(.7,0,.84,0)',fill:'forwards'}).finished;
  // 2. Fly: an arc, very fast at first, then slowing as it reaches the caption.
  const qx=(cx+tx)/2+(ty-cy)*.18,qy=Math.min(cy,ty)-Math.abs(tx-cx)*.22,N=28,frames=[];
  for(let k=0;k<=N;k++){const u=1-Math.pow(1-k/N,4),m=1-u,x=m*m*cx+2*m*u*qx+u*u*tx,y=m*m*cy+2*m*u*qy+u*u*ty;frames.push({translate:`${(x-cx).toFixed(1)}px ${(y-cy).toFixed(1)}px`,offset:k/N});}
  await fly.animate(frames,{duration:640,easing:'linear',fill:'forwards'}).finished;
  // 3. Ripple: the circle rings outward and the caption opens from the point it landed on.
  captionHeld=false;const now=cap.getBoundingClientRect();cap.style.setProperty('--rx',(tx-now.left)+'px');cap.style.setProperty('--ry',(ty-now.top)+'px');renderVoice();
  if(!cap.hidden){cap.classList.remove('ripple-in');void cap.offsetWidth;cap.classList.add('ripple-in');cap.addEventListener('animationend',e=>{if(e.target===cap)cap.classList.remove('ripple-in');},{once:false});}
  fly.classList.add('ripple');fly.animate([{scale:'1',opacity:1},{scale:'9',opacity:0}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}).finished.then(()=>fly.remove());});}
function commit(text,fn,enabled=true){const b=btn(text,fn,'primary');b.disabled=!enabled;return b;}
function paragraph(t,cls='hint'){return el('p',{textContent:t,className:cls});}
// The task above a set of choices, on dark blue glass (the orb's blue) so it reads over the map: the task in bold,
// the situation it is about in medium, then the options themselves in regular weight.
function task(title,ctx=''){const d=el('div',{className:'task-card'});d.append(el('p',{className:'task-t',textContent:title}));if(ctx)d.append(el('p',{className:'task-c',textContent:ctx}));return d;}
function focusFor(){return ['landing','identity','briefing'].includes(state.stage)?'overview':['roundtable','transfer','closing','challenge','stanceClose','debrief'].includes(state.stage)?'nigeria':state.stage==='disputes'?'north':'spain';}
function render(){renderActions();renderStatus();const f=focusFor();if(lastFocus!==f){atlas.focus(f);lastFocus=f;}atlas.glowCountry(f==='nigeria'?'Nigeria':f==='overview'?null:'Spain');atlas.setSources(C.sources,state.opened,selectedSource,state.stage==='research');renderVoice();syncEnding();}
// ---- Explainer films ----
// A spoken line with a film shows it in a small glass card on the left side, above the guide (and above the caption
// when one shows); the film's edges feather into the glass. Hovering (or tapping, on touch) springs the card out
// toward the middle of the map with controls; it folds back when the pointer leaves, on Esc or on close.
// The film is muted (the voice is the sound) and locked to the line; it pauses with the voice.
// It plays by itself the first time a line is heard; on replays a "Watch the film" chip offers it.
// Reduced motion or data-saver shows the still poster.
let films={};const filmSeen=new Set((()=>{try{return JSON.parse(localStorage.getItem(KEY+'-films')||'[]');}catch{return [];}})());
const saveData=()=>navigator.connection?.saveData===true;
const SPRING='linear(0,.009,.035 2.1%,.141 4.4%,.723 12.9%,.938 16.7%,1.017 19.4%,1.077,1.121 24.3%,1.149 27.1%,1.159 29.9%,1.154 32.8%,1.129 35.8%,1.051 43.1%,1.017 46.9%,.991 51%,.977 56.1%,.975 63.1%,.997 76.9%,1.003 83.8%,1)';
// Thin line icons for the film controls (1.5 px on a 24 px grid, round caps), drawn in currentColor so they stay
// hairline-light at any size, like SF Symbols at a light weight.
const FI={play:'<path d="M8 5.5v13l10.5-6.5z" stroke-linejoin="round"/>',pause:'<path d="M9 5.5v13M15 5.5v13"/>','arrow-counter-clockwise':'<path d="M4.5 9.5A8 8 0 1 1 5 15"/><path d="M4.5 4.5v5h5" stroke-linejoin="round"/>',x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'};
const ICON=n=>'<svg class="fi" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">'+FI[n]+'</svg>';
function syncFilm(cur,v){const box=$('film'),f=cur&&films[cur.id];
 if(!f||state.stage==='landing'||state.stage==='debrief'){if(box.dataset.clip&&!(cur&&box.dataset.clip===cur.id))closeFilm();return;}
 if(box.dataset.clip!==cur.id){box.dataset.clip=cur.id;if(filmSeen.has(cur.id))filmChip(f,cur.id);else openFilm(f,cur.id);return;}
 const vid=box.querySelector('video');if(!vid)return;
 if(v.playing||v.fallback){if(vid.paused&&!vid.ended)vid.play().catch(()=>{});box.classList.remove('paused');}
 else if(v.current){vid.pause();box.classList.add('paused');}
 filmIcons();}
function filmIcons(){const box=$('film'),b=box.querySelector('.film-play');if(b){const vid=box.querySelector('video'),playing=vid&&!vid.paused;b.innerHTML=ICON(playing?'pause':'play');b.setAttribute('aria-label',playing?'Pause the film and the voice':'Play the film and the voice');}}
function openFilm(f,id){const box=$('film'),still=reducedMotion()||saveData();filmSeen.add(id);try{localStorage.setItem(KEY+'-films',JSON.stringify([...filmSeen]));}catch{}
 const swap=box.classList.contains('on');const expanded=box.classList.contains('expanded');const held=swap?box.querySelector('.film-frame video'):null;box.className='on'+(swap?' swap':'')+(expanded?' expanded':'');box.replaceChildren();
 const frame=el('div',{className:'film-frame'});
 if(still){frame.append(el('img',{src:f.poster,alt:''}));box.append(frame);return;}
 // See-through films: HEVC with alpha for Safari (Chrome skips the QuickTime type), VP9 with alpha for the rest.
 const vid=el('video');Object.assign(vid,{muted:true,playsInline:true,preload:'auto',poster:f.poster});vid.setAttribute('muted','');vid.setAttribute('playsinline','');if(f.hevc)vid.append(el('source',{src:f.hevc,type:'video/quicktime; codecs="hvc1"'}));vid.append(el('source',{src:f.film,type:'video/webm'}));frame.append(vid);
 // The films are one continuous queue: the next film opens on the frame the last one ended on, so hold the old
 // frame on top until the new film is actually playing, then drop it (a clean hand-off, no wipe or flash).
 if(held){held.pause();held.classList.add('film-held');frame.append(held);const drop=()=>{held.remove();clearTimeout(t);};const t=setTimeout(drop,900);vid.addEventListener('playing',()=>requestAnimationFrame(drop),{once:true});}
 const bar=el('div',{className:'film-bar'}),prog=el('span',{className:'film-progress'});prog.append(el('i'));
 const play=btn('',()=>{voice.toggle();if(vid.paused)vid.play().catch(()=>{});else vid.pause();filmIcons();},'film-play');
 const again=btn('',()=>{voice.replay();vid.currentTime=0;vid.play().catch(()=>{});},'film-again');again.innerHTML=ICON('arrow-counter-clockwise');again.setAttribute('aria-label','Replay the line and film');
 const close=btn('',()=>filmCollapse(),'film-close');close.innerHTML=ICON('x');close.setAttribute('aria-label','Shrink the film');
 bar.append(play,again,prog,close);box.append(frame,bar);
 vid.addEventListener('timeupdate',()=>prog.style.setProperty('--p',(vid.currentTime/(vid.duration||1)).toFixed(3)));
 vid.addEventListener('play',filmIcons);vid.addEventListener('pause',filmIcons);vid.play().catch(()=>{});filmIcons();
 box.onpointerenter=e=>{if(e.pointerType==='mouse'){clearTimeout(box._t);box._t=setTimeout(filmExpand,260);}};
 box.onpointerleave=e=>{if(e.pointerType==='mouse')clearTimeout(box._t);};
 frame.onclick=()=>{if(!box.classList.contains('expanded'))filmExpand();};}
function filmChip(f,id){const box=$('film');filmCollapse(true);box.className='chip';box.replaceChildren(btn('▶ Watch the film',()=>{box.dataset.clip=id;openFilm(f,id);},'film-chip'));}
function closeFilm(){const box=$('film');box.dataset.clip='';if(!box.classList.contains('on')&&!box.classList.contains('chip'))return;filmCollapse(true);box.querySelector('video')?.pause();if(reducedMotion()){box.className='';box.replaceChildren();return;}
 box.classList.add('closing');setTimeout(()=>{if(box.classList.contains('closing')){box.className='';box.replaceChildren();}},230);}
// Expand from the card toward the middle of the free map area (FLIP, on the spring); fold back faster.
function filmTarget(){const mobile=innerWidth<=700,rail=mobile?0:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rail'))||290,gap=mobile?14:32;
 const freeW=innerWidth-(mobile?0:rail+gap),w=Math.min(880,freeW-(mobile?28:96)),h=w*9/16+60;return {left:(freeW-w)/2,top:Math.max(80,(innerHeight-h)/2),width:w};}
function filmExpand(){const box=$('film');if(!box.classList.contains('on')||box.classList.contains('expanded'))return;const first=box.getBoundingClientRect();
 const t=filmTarget();box.classList.add('expanded');Object.assign(box.style,{left:t.left+'px',top:t.top+'px',width:t.width+'px'});document.body.classList.add('film-open');
 const last=box.getBoundingClientRect();if(!reducedMotion())box.animate([{transform:`translate(${first.left-last.left}px,${first.top-last.top}px) scale(${first.width/last.width})`},{transform:'none'}],{duration:620,easing:SPRING,transformOrigin:'0 0'});
 const track=e=>{const r=box.getBoundingClientRect(),inside=e.clientX>=r.left-24&&e.clientX<=r.right+24&&e.clientY>=r.top-24&&e.clientY<=r.bottom+24;clearTimeout(box._c);if(!inside)box._c=setTimeout(()=>filmCollapse(),420);};
 const key=e=>{if(e.key==='Escape')filmCollapse();};box._track=track;box._key=key;document.addEventListener('pointermove',track);document.addEventListener('keydown',key);}
function filmCollapse(instant=false){const box=$('film');clearTimeout(box._c);clearTimeout(box._t);if(box._track){document.removeEventListener('pointermove',box._track);document.removeEventListener('keydown',box._key);box._track=null;}
 if(!box.classList.contains('expanded'))return;const first=box.getBoundingClientRect();box.classList.remove('expanded');box.style.left=box.style.top=box.style.width='';document.body.classList.remove('film-open');
 const last=box.getBoundingClientRect();if(!instant&&!reducedMotion()&&last.width)box.animate([{transform:`translate(${first.left-last.left}px,${first.top-last.top}px) scale(${first.width/last.width})`},{transform:'none'}],{duration:300,easing:'cubic-bezier(.32,.72,0,1)',transformOrigin:'0 0'});}
// Lock the film to the voice: if they drift more than 0.15 s apart, the film jumps to the narration's position.
function lockFilm(){const vid=$('film').querySelector('video');if(!vid||!voice||!voice.playing||$('film').dataset.clip!==voice.current?.id)return;const t=voice.audio.currentTime;if(Math.abs(vid.currentTime-t)>.15&&t<(vid.duration||1e9)-.05)vid.currentTime=t;}
// ---- End page ----
// The AI bubble glides to the centre, grows and pulses, looping circle → box → wobbly blob → circle. After one loop it
// glides left and the outcome opens out of it: verdict, score, Dr Eze's verdict line, the four rubric strands (weakest
// marked), credibility and fit risk, whether you held your position, and the review actions.
let endTimer=0;
const STRANDS=[['asymmetry','Asymmetry',20],['mechanisms','Mechanism matching',30],['transfer','Transfer judgement',30],['limits','Lessons and limits',20]];
function syncEnding(){const on=state.stage==='debrief',b=document.body;if(on===b.classList.contains('ending'))return;clearTimeout(endTimer);
 if(on){renderEnding();b.classList.add('ending');talk.ending=true;talk.orb?.set({listening:true,speed:.6,energy:.42,level:undefined});endTimer=setTimeout(revealEnding,reducedMotion()?0:2600);}
 else{b.classList.remove('ending','ending-reveal');talk.ending=false;talk.orb?.set({listening:false,speed:0,energy:.18,level:undefined});$('ending').replaceChildren();}}
// The outcome reveals itself progressively (after the Annnimate rotating-words wheel). The orb glides left and
// pulses; a spark of its light travels to the right and the outcome turns up on a 3D drum of words: the four strands,
// credibility, fit risk, landing on the verdict. The colour of the orb sweeps through the words as they land. Dots
// under the drum (and the wheel, arrows or a tap on a word) turn it; tapping the centre word opens it into a glass
// card with what it means. Restart stands on its own, in the primary ink.
const DRUM={step:24,gap:1.2,dim:.14,blur:6,blurFrom:.2};
const bez=(x1,y1,x2,y2)=>t=>{let a=t;for(let i=0;i<6;i++){const x=3*(1-a)**2*a*x1+3*(1-a)*a*a*x2+a**3-t,dx=3*(1-a)**2*x1+6*(1-a)*a*(x2-x1)+3*a*a*(1-x2);if(Math.abs(dx)<1e-6)break;a-=x/dx;a=Math.min(1,Math.max(0,a));}return 3*(1-a)**2*a*y1+3*(1-a)*a*a*y2+a**3;};
const SPIN=bez(.3,.9,.1,1),SETTLE=bez(.7,0,.16,1);
let drum=null;
function endItems(r){const weak=weakest(state);
 return [...STRANDS.map(([key,label,max])=>({key,label,val:state.scores[key]||0,max,weak:key===weak})),
  {key:'ac',label:'Credibility',val:state.ac,max:100},{key:'fr',label:'Fit risk',val:state.fr,max:100},
  {key:'verdict',label:r.label,val:r.score,max:100}];}
function renderEnding(){const r=result(state),e=$('ending');e.replaceChildren();if(drum)drum.kill();
 const items=endItems(r),last=items.length-1;
 const stage=el('div',{className:'end-drum'}),list=el('ul',{className:'rw-list'});list.setAttribute('aria-label','Your outcome');
 const lis=items.map((it,i)=>{const li=el('li',{className:'rw-item'+(it.key==='verdict'?' verdict':'')+(it.weak?' weak':'')});const b=el('button',{type:'button',className:'rw-word'});
  b.append(el('span',{className:'w',textContent:it.label}),el('span',{className:'v',textContent:it.key==='verdict'?String(it.val):it.max===100?String(it.val):`${it.val}/${it.max}`}));
  b.setAttribute('aria-label',`${it.label}, ${it.val} of ${it.max}`);b.onclick=()=>{touch();if(drum.cur()===i)openEndDetail(items[i],b);else drum.go(i);};li.append(b);list.append(li);return li;});
 const nav=el('div',{className:'rw-nav'});const dots=items.map((it,i)=>{const d=el('button',{type:'button',className:'rw-dot'});d.setAttribute('aria-label','Go to '+it.label);d.onclick=()=>{touch();drum.go(i);};nav.append(d);return d;});
 const open=btn('',()=>{touch();openEndDetail(items[drum.cur()],lis[drum.cur()].firstChild);},'rw-open');open.innerHTML='<svg class="fi" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>';open.setAttribute('aria-label','Open');
 const restart=btn('',requestRestart,'primary end-restart');restart.innerHTML=ICON('arrow-counter-clockwise');restart.setAttribute('aria-label','Restart');restart.title='Restart';
 const foot=el('div',{className:'end-foot'});foot.append(nav,restart);
 const band=el('div',{className:'rw-band'});stage.append(band,list,open,foot);const detail=el('div',{className:'end-detail',hidden:true});detail.setAttribute('role','dialog');detail.setAttribute('aria-label','Outcome detail');
 e.append(stage,detail);
 const n=items.length,wrap=x=>((x%n)+n)%n,cyc=d=>d-n*Math.round(d/n);let lastUser=0,auto=0;const touch=()=>{lastUser=performance.now();};
 drum={p:0,raf:0,n,cur(){return wrap(Math.round(this.p));},stop(){cancelAnimationFrame(this.raf);},kill(){this.stop();clearInterval(auto);},
  render(){const p=this.p,itemH=lis[0].offsetHeight||48,R=itemH*DRUM.gap/(2*Math.sin(DRUM.step*Math.PI/360));list.style.height=Math.round(R*2)+'px';band.style.top=open.style.top=Math.round(R)+'px';band.style.height=(itemH+10)+'px';list.style.perspective=Math.round(R*4)+'px';
   lis.forEach((li,i)=>{const d=cyc(i-p),a=d*DRUM.step;if(Math.abs(a)>=90){li.style.visibility='hidden';return;}const near=Math.max(0,1-Math.abs(d)),fade=1-Math.abs(a)/90;
    li.style.visibility='';li.style.transform=`translate(-50%,-50%) translateZ(${-R}px) rotateX(${-a}deg) translateZ(${R}px)`;li.style.opacity=String(DRUM.dim*fade+(1-DRUM.dim)*near);
    li.style.setProperty('--wt',String(Math.round(400+200*near)));const depth=Math.max(0,(Math.abs(a)/90-DRUM.blurFrom)/(1-DRUM.blurFrom)),b=Math.round(DRUM.blur*depth*depth*2)/2;li.style.filter=b>0?`blur(${b}px)`:'';
    li.firstChild.tabIndex=this.cur()===i?0:-1;});
   dots.forEach((d,k)=>{const near=Math.max(0,1-Math.abs(cyc(k-p)));d.style.setProperty('--rw-dot',String(1+1.6*near));d.style.opacity=String(.3+.7*near);d.toggleAttribute('aria-current',this.cur()===k);});},
  tween(to,dur,ease,done){this.stop();const from=this.p,t0=performance.now();const f=now=>{const k=Math.min(1,(now-t0)/dur);this.p=from+(to-from)*ease(k);this.render();if(k<1)this.raf=requestAnimationFrame(f);else done?.();};this.raf=requestAnimationFrame(f);},
  go(i){const cp=Math.round(this.p),to=cp+cyc(i-wrap(cp));if(reducedMotion()){this.p=to;this.render();return;}this.tween(to,900,SETTLE,()=>sweep(lis[wrap(to)]));},
  // after it lands, the drum keeps turning by itself, one word every 10 s, round and round; it waits while a card is open
  // or for a few seconds after you have turned it yourself
  autoplay(){clearInterval(auto);auto=setInterval(()=>{if(!lis[0].isConnected){clearInterval(auto);return;}if(stage.classList.contains('behind')||document.hidden||performance.now()-lastUser<8000)return;this.go(this.cur()+1);},10000);},
  spin(){if(reducedMotion()){this.p=last;this.render();this.autoplay();return;}this.p=0;this.render();this.tween(last+.15,2400,SPIN,()=>this.tween(last,600,SETTLE,()=>{sweep(lis[last]);stage.classList.add('landed');this.autoplay();}));}};
 drum.render();
 // the wheel, arrows and Enter turn and open the drum
 let wheelT=0;stage.addEventListener('wheel',ev=>{ev.preventDefault();const now=performance.now();if(now-wheelT<260)return;wheelT=now;touch();drum.go(drum.cur()+(ev.deltaY>0?1:-1));},{passive:false});
 stage.addEventListener('keydown',ev=>{if(ev.key==='ArrowDown'||ev.key==='ArrowRight'){ev.preventDefault();touch();drum.go(drum.cur()+1);}if(ev.key==='ArrowUp'||ev.key==='ArrowLeft'){ev.preventDefault();touch();drum.go(drum.cur()-1);}});}
// the colour of the orb runs through a word as it lands
function sweep(li){const w=li?.querySelector('.w');if(!w||reducedMotion())return;w.classList.remove('sweep');void w.offsetWidth;w.classList.add('sweep');}
function revealEnding(){document.body.classList.add('ending-reveal');const e=$('ending'),stage=e.querySelector('.end-drum');if(!stage)return;
 if(reducedMotion()){drum.spin();stage.classList.add('landed');return;}
 // the orb pulses, then a spark of its light travels along a curve into the drum, and the words begin to turn
 document.body.classList.add('end-pulse');const orb=$('guide').querySelector('.agent').getBoundingClientRect(),to=stage.getBoundingClientRect();
 const x0=orb.left+orb.width/2,y0=orb.top+orb.height/2,x1=to.left+to.width/2,y1=to.top+to.height/2-20;
 const spark=el('span',{className:'end-spark'});spark.style.offsetPath=`path('M ${x0} ${y0} C ${x0+80} ${y0-90} ${x1-120} ${y1-70} ${x1} ${y1}')`;document.body.append(spark);
 spark.animate([{offsetDistance:'0%',opacity:0,scale:.4},{opacity:1,scale:1,offset:.15},{offsetDistance:'100%',opacity:.9,scale:1.4}],{duration:760,delay:520,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}).finished.then(()=>{spark.animate([{opacity:.9,scale:1.4},{opacity:0,scale:3}],{duration:420,easing:'ease-out',fill:'forwards'}).finished.then(()=>spark.remove());stage.classList.add('lit');drum.spin();});}
// A word opens into a glass card with what it means.
function openEndDetail(it,from){const e=$('ending'),d=e.querySelector('.end-detail'),stage=e.querySelector('.end-drum');d.replaceChildren();
 const close=btn('',()=>closeEndDetail(),'end-close');close.innerHTML=ICON('x');close.setAttribute('aria-label','Close');
 const head=el('div',{className:'det-head'});
 if(it.key==='verdict'){const r=result(state),line=id=>voice?.byId[id]?.text||'';
  const score=el('div',{className:'end-score hot'});score.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="44" pathLength="100"/><circle class="fill" cx="50" cy="50" r="44" pathLength="100" style="--s:${r.score}"/></svg><b>${r.score}</b><small>/ 100</small>`;
  const t=el('div',{className:'end-titles'});t.append(el('p',{className:'kicker',textContent:'Your brief · Outcome'}),el('h2',{textContent:r.label}));head.append(score,t,close);
  const verdict=[line('BAND_'+r.band),line(state.stance===state.stanceClose?'S5_HELD':'S5_CHANGED')];if(state.fr>=30||state.ac<50)verdict.push('Your result dropped one level because fit risk reached 30 or credibility fell below 50.');
  const lines=el('div',{className:'end-lines'});lines.append(...verdict.filter(Boolean).map(x=>el('p',{className:'end-line',textContent:x})));
  const more=el('div',{className:'end-more'});
  for(const [mode,label] of [['choices','Your choices'],['changed','What changed'],['brief','Your brief']]){const x=el('details',{className:'end-x'}),sm=el('summary');sm.append(el('span',{textContent:label}),el('i',{className:'chev'}));const inner=el('div',{className:'x-body'});x.append(sm,inner);
   x.addEventListener('toggle',()=>{if(x.open&&!inner.childElementCount){notes(inner,mode);if(!inner.childElementCount)inner.append(paragraph('Nothing recorded for this run.'));}});
   sm.addEventListener('click',ev=>{if(x._hover){ev.preventDefault();x._hover=false;}});
   x.addEventListener('pointerenter',ev=>{if(ev.pointerType!=='mouse'||x.open)return;clearTimeout(x._t);x._t=setTimeout(()=>{x._hover=true;x.open=true;},250);});
   x.addEventListener('pointerleave',ev=>{if(ev.pointerType!=='mouse')return;clearTimeout(x._t);if(x._hover){x._hover=false;x.open=false;}});more.append(x);}
  d.append(head,lines,more);}
 else{const pct=it.val/it.max,c=2*Math.PI*40;
  const ring=el('div',{className:'end-score'+(it.weak||it.key==='fr'?' hot':'')});ring.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="44" pathLength="100"/><circle class="fill" cx="50" cy="50" r="44" pathLength="100" style="--s:${Math.round(pct*100)}"/></svg><b>${it.val}</b><small>/ ${it.max}</small>`;
  const t=el('div',{className:'end-titles'});t.append(el('p',{className:'kicker',textContent:it.weak?'Weakest strand':it.key==='ac'||it.key==='fr'?'Your standing':'Strand'}),el('h2',{textContent:it.label}));head.append(ring,t,close);
  const say={ac:'Credibility rises when the evidence you attach supports what you claim.',fr:'Fit risk rises when you borrow a feature without checking it against Nigeria.'}[it.key]||strandText(it.key);
  d.append(head,el('p',{className:'end-line',textContent:say}));}
 // grow out of the word (FLIP), on the app's spring; the drum steps back
 d.hidden=false;stage.classList.add('behind');const a=from.getBoundingClientRect(),b=d.getBoundingClientRect();
 if(!reducedMotion())d.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`,opacity:.2,borderRadius:'999px'},{transform:'none',opacity:1,borderRadius:'28px'}],{duration:620,easing:SPRING,transformOrigin:'0 0'});
 requestAnimationFrame(()=>d.classList.add('in'));close.focus({preventScroll:true});
 d._key=ev=>{if(ev.key==='Escape')closeEndDetail();};document.addEventListener('keydown',d._key);}
function closeEndDetail(){const e=$('ending'),d=e.querySelector('.end-detail'),stage=e.querySelector('.end-drum');if(!d||d.hidden)return;document.removeEventListener('keydown',d._key);
 const done=()=>{d.hidden=true;d.classList.remove('in');stage.classList.remove('behind');stage.querySelector('.rw-item:not([style*="hidden"]) .rw-word[tabindex="0"]')?.focus({preventScroll:true});};
 if(reducedMotion())return done();d.animate([{opacity:1,transform:'none'},{opacity:0,transform:'scale(.94)'}],{duration:200,easing:'cubic-bezier(.7,0,.84,0)'}).finished.then(done);}
// The task panel is built off-screen, then patched in place (so hover, press and selection transitions run).
// A new step stages in: the old content leaves fast, the new children rise in order.
function renderActions(){const a=$('actions'),next=el('div');buildActions(next);const cls=state.stage==='landing'?'landing':characterMin?'expanded':'';const key=state.stage+'|'+!!state.pending+'|'+closingStep+'|'+!!renderActions.claimAttachments;const changed=key!==renderActions.key;renderActions.key=key;
 const snap=a.childNodes.length&&!reducedMotion()?a.cloneNode(true):null;
 if(!changed&&patch(a,[...next.childNodes])){a.className=cls;return;}
 if(changed)a.replaceChildren(...next.childNodes);a.className=cls;a.scrollTop=0;stagger(a,snap);renderVoice.after?.();}
function buildActions(a){if(state.stage!=='closing'&&reading){reading=null;captionHeld=false;}
 if(state.stage==='landing'){a.append(el('h1',{textContent:'The Borrowed Blueprint'}));if(saved&&saved.stage!=='landing'){const r=el('div',{className:'resume'});r.append(btn('Continue',()=>{state=structuredClone(saved);render();voice.play(resumeClips(state));},'primary'),btn('Restart',requestRestart));a.append(r);}else a.append(btn('Start',()=>act('start'),'primary'));return;}
 if(state.pending){a.append(commit('Continue',()=>act('continue')),btn('Replay',()=>voice.play(state.pending.clips)));return;}
 if(state.stage==='identity'){const form=el('form');const n=el('input',{name:'name',autocomplete:'name',required:true,maxLength:80}),m=el('input',{name:'matric',required:true,maxLength:50});for(const [text,input] of [['Name',n],['Matriculation number',m]]){const l=el('label',{textContent:text});l.append(input);form.append(l,el('br'));}const b=btn('Continue',()=>{},'primary');b.type='submit';form.append(b);form.onsubmit=e=>{e.preventDefault();act('identity',{name:n.value,matric:m.value});};a.append(form);return;}
 if(['briefing','roundtable'].includes(state.stage)){a.append(btn('Replay',()=>voice.play(resumeClips(state))),commit('Continue',()=>act(state.stage==='briefing'?'briefingDone':'roundtableDone')));return;}
 if(state.stage==='stance'||state.stage==='stanceClose'){a.append(task(state.stage==='stance'?'Choose your opening position':'Your closing position',state.stage==='stance'?'':'After everything you have seen, where do you stand now?'),options(C.stances),commit('Confirm',()=>act(state.stage,{value:choice}),choice!==null));return;}
 if(state.stage==='research'){a.append(task('Open at least two sources','Each source costs 6 of your research hours.'));const g=el('div',{className:'group'});C.sources.forEach(s=>{const b=btn(s.title,()=>openSource(s.id),s.id===selectedSource?'selected':'');b.setAttribute('aria-label',s.title+(state.opened.includes(s.id)?', opened':', six hours'));g.append(b);});a.append(g,commit('Build claim',()=>act('researchDone'),state.opened.length>=2));return;}
 if(state.stage==='claim'){if(choice===null||attached.length===0&&!renderActions.claimAttachments){a.append(task('Choose the claim you will defend'),options(C.claims),commit('Attach sources',()=>{renderActions.claimAttachments=true;renderActions();},choice!==null));}else{a.append(task('Attach two sources','Pick the two that best support your claim.'));for(const id of state.opened){const s=C.sources.find(x=>x.id===id);const b=btn(s.title,()=>{attached=attached.includes(id)?attached.filter(x=>x!==id):attached.length<2?[...attached,id]:attached;renderActions();},attached.includes(id)?'selected':'');b.setAttribute('aria-pressed',String(attached.includes(id)));a.append(b);}a.append(commit('Submit claim',()=>{act('claim',{value:choice,sources:attached});renderActions.claimAttachments=false;},attached.length===2),btn('Back',()=>{renderActions.claimAttachments=false;attached=[];renderActions();}));}return;}
 if(state.stage==='disputes'){a.append(task('Send this dispute to the body that can settle it',C.disputes[state.routes.length]||''),options(C.mechanisms),commit('Confirm route',()=>act('route',{value:choice}),choice!==null));return;}
 if(state.stage==='enforcement'){a.append(task('The region will ignore the ruling','Choose how to enforce it.'),options(['Invoke Article 155 now','Court enforcement first']),commit('Confirm',()=>act('enforce',{value:choice}),choice!==null));return;}
 if(state.stage==='transfer'){const f=C.features[state.decisions.length];a.append(task('Transfer, adapt or reject for Nigeria',f.title),btn(state.checks.includes(f.id)?'Replay source check':'Check source · 6h',()=>act('check')),options(['Transfer','Adapt','Reject']),commit('Confirm',()=>act('transfer',{value:choice}),choice!==null));return;}
 if(state.stage==='closing'){const values=closingStep?C.limits:C.lessons;a.append(task(closingStep?'Choose the limit':'Choose the lesson',closingStep?'The Nigerian condition that limits your lesson.':'What Nigeria can take from Spain.'));const g=el('div',{className:'group'});values.forEach((t,i)=>{const id=(closingStep?'LIMIT_':'LESSON_')+i,row=el('div',{className:'option-row'+(reading?.id===id?' reading':'')});row.dataset.clip=id;row.append(btn(t,()=>{if(closingStep)limit=i;else lesson=i;renderActions();},'option '+((closingStep?limit:lesson)===i?'selected':'')),readButton(()=>readOption(id)));g.append(row);});a.append(g);if(!closingStep)a.append(commit('Continue',()=>{closingStep=1;renderActions();},lesson!==null));else a.append(commit('Submit closing line',()=>act('closing',{lesson,limit}),limit!==null),btn('Back',()=>{closingStep=0;renderActions();}));return;}
 if(state.stage==='challenge'){a.append(task('A delegate challenges your weakest strand',voice?.byId['CHALLENGE_'+state.challenge]?.text||''),options(['Concede and adjust','Defend with sources','Reframe as further research']),commit('Confirm response',()=>act('response',{value:choice}),choice!==null));return;}
 if(state.stage==='debrief')return;/* the end page (#ending) carries the outcome and its actions */
}
function openSource(id){selectedSource=id;act('source',{id});}
// Which hover explainer (H1–H12) belongs to the element under the pointer, and the element it grows from.
function hoverKey(t){if(!(t instanceof Element))return null;
 const chip=t.closest('#status .status-chip');if(chip){if(chip.tagName==='DETAILS')return {key:'H3',anchor:chip,side:'below'};const x=chip.textContent;return /research/.test(x)?{key:'H1',anchor:chip,side:'below'}:/reserve/.test(x)?{key:'H2',anchor:chip,side:'below'}:null;}
 const li=t.closest('.end-num[data-i]');if(li){const i=+li.dataset.i,[key,label,max]=STRANDS[i]||[];if(!key)return null;return {key:`H12:${key}:${label}:${((state.scores[key]||0)/max).toFixed(2)}`,anchor:li,side:'right',around:$('ending')};}
 const b=t.closest('#actions [role=radio],#actions .option-row');if(!b)return null;const i=[...b.parentNode.children].indexOf(b);
 const k={claim:'H4',transfer:'H9',closing:'H10',challenge:'H11'}[state.stage]||(state.stage==='disputes'?['H5','H6','H7','H8'][i]:state.stage==='enforcement'?['H8','H7'][i]:null);
 return k?{key:k,anchor:b,side:'left'}:null;}
atlas.onSource=openSource;
function renderStatus(){const box=$('status');box.replaceChildren();if(['landing','identity','briefing'].includes(state.stage))return;const t=state.stage==='research'?`${24-state.paid}h research`:['roundtable','transfer','closing'].includes(state.stage)?`${state.reserve}h reserve`:['claim','disputes','enforcement'].includes(state.stage)?(state.stage==='claim'?'48h to the meeting':'24h to the meeting'):'72h to the meeting';if(!['challenge','stanceClose','debrief'].includes(state.stage))box.append(el('span',{className:'status-chip',textContent:t}));const d=el('details',{className:'status-chip'});d.append(el('summary',{textContent:`AC ${state.ac} · Fit ${state.fr}`}));d.append(paragraph(`Analytical credibility: ${state.ac}/100. Fit risk: ${state.fr}/100. Higher credibility and lower fit risk strengthen your brief.`));box.append(d);}
// The ribbon waveform: three strands, flat at rest. motion.js draws them from the voice level each frame.
function wave(){return '<svg class="ribbon" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 15 L100 15"/><path d="M0 15 L100 15"/><path d="M0 15 L100 15"/></svg>';}
// The agent orb (from The Analyst’s Brief): one persistent WebGL globe, still at rest, its strands follow the voice.
function mountGuide(){const g=$('guide');g.innerHTML='<div class="agent"><div class="globe"></div><button class="hit" type="button" aria-label="Replay guide" title="Replay guide"></button></div><div class="guide-controls"></div>';g.querySelector('.hit').onclick=()=>voice.replay();try{talk.orb=new Strands(g.querySelector('.globe'),{energy:.18,glassSize:1.1,maxDevicePixelRatio:1.5,speed:0});}catch{g.classList.add('globe-fallback');}}
// Portraits draw into a canvas (cover crop, never stretched); hydrate() mounts them once they are in the page.
function portrait(s,reveal=false){const d=el('div',{className:'portrait '+s});d.setAttribute('role','img');d.setAttribute('aria-label',speakers[s]);const i=['eze','marin','sani'].indexOf(s);if(i<0){d.classList.add('delegate');d.textContent=s==='governors'?'GF':s==='federal'?'FM':'NA';}else{const c=el('canvas');c.setAttribute('aria-hidden','true');c.dataset.index=i;if(reveal)c.dataset.reveal='';d.append(c);}return d;}
function hydrate(root){root.querySelectorAll('.portrait canvas:not([data-mounted])').forEach(c=>{c.dataset.mounted='';mountPortrait(c,+c.dataset.index,'reveal' in c.dataset);});}
function renderVoice(){if(!voice)return;const v=voice,cur=v.current,isCharacter=cur&&!['guide','narrator'].includes(cur.speaker);let fresh=false;if(cur?.id!==lastVoiceId){lastVoiceId=cur?.id;characterMin=false;clearTimeout(foldTimer);foldTimer=0;if(isCharacter){fresh=cardFolded||lastSpeaker!==cur.speaker;lastSpeaker=cur.speaker;lastCharacterClips[cur.speaker]=cur.id;cardFolded=false;}}const showSpeaker=isCharacter?cur.speaker:lastSpeaker;
 const who=cur?(isCharacter?'character':'guide'):null,mode=!cur?'idle':v.playing?'audio':v.fallback?'text':'idle';talk.set(who,mode,cur?(cur.id+'·'+cur.text):'');
 // Announce, then fold (rail-card rule): the card stays open while its speaker talks, then folds to a portrait
 // tab (text lines: reading time + 1.2s, at least 5s; on phones 2.6s, since the caption carries the line;
 // audio: 1.2s after it ends). Hover or focus reopens it.
 if(characterMin||(cur&&!isCharacter))cardFolded=true;
 if(!cardFolded&&!foldTimer&&(!isCharacter||mode==='text'))foldTimer=setTimeout(()=>{cardFolded=true;foldTimer=0;renderVoice();},isCharacter?(innerWidth<=700?2600:Math.max(5000,readingMs(cur.text)+1200)):1200);
 const shouldExpand=!!showSpeaker&&!cardFolded;const card=el('div');
 if(showSpeaker&&state.stage!=='landing'){const name=speakers[showSpeaker],replay=()=>{if(isCharacter&&cur.speaker===showSpeaker){characterMin=false;cardFolded=false;v.replay();}else{const id=lastCharacterClips[showSpeaker];if(id)v.play([id]);}};
  const c=el('div',{className:'person-card'+(who==='character'&&mode!=='idle'?' speaking':'')+(fresh?' enter':'')});const hit=btn('',replay,'portrait-hit');hit.setAttribute('aria-label','Replay '+name);
  const badge=el('span',{className:'badge'});badge.setAttribute('aria-hidden','true');badge.innerHTML='<img src="assets/icons/arrow-counter-clockwise.svg" alt="" width="12" height="12">';
  const more=el('div',{className:'more'}),inner=el('div'),controls=el('div',{className:'audio-controls'});controls.innerHTML=wave();const row=el('div',{className:'audio-buttons'});row.append(icon(v.playing?'Ⅱ':'▷','Pause or resume character',()=>v.toggle()),icon('↻','Replay character',replay),icon('›','Skip to next audio line',()=>v.next()),icon('−','Minimise character',()=>{characterMin=true;renderVoice();}));controls.append(row);
  inner.append(el('div',{className:'person-name',textContent:name}),controls);more.append(inner);c.append(portrait(showSpeaker,fresh&&!cardFolded),hit,badge,more);card.append(c);}
 // Same speaker: update in place, so folding and reopening morph smoothly. A new speaker enters fresh.
 const live=$('character'),ckey=(showSpeaker||'')+'|'+(state.stage==='landing');if(ckey!==renderVoice.ckey||fresh||!patch(live,[...card.childNodes]))live.replaceChildren(...card.childNodes);renderVoice.ckey=ckey;live.className=shouldExpand?'':'folded';hydrate(live);
 const g=$('guide');g.className=shouldExpand?'aside':who==='guide'&&mode!=='idle'?'speaking':'';g.dataset.phase=state.stage==='landing'?'hidden':'rest';g.querySelector('.hit').tabIndex=state.stage==='landing'?-1:0;const gc=el('div');gc.innerHTML=wave();gc.append(icon(v.playing?'Ⅱ':'▷','Pause or resume audio',()=>v.toggle()),icon('↻','Replay audio',()=>v.replay()),icon('›','Skip to next audio line',()=>v.next()));patch(g.querySelector('.guide-controls'),[...gc.childNodes]);
 if(reading){if(cur?.id===reading.id)reading.started=true;else if(reading.started){reading=null;captionHeld=false;renderActions();}}
 const live$=$('caption'),cap=el('div');live$.classList.toggle('held',captionHeld);live$.hidden=!cur||!(prefs.cc||v.fallback||!prefs.sound)||(innerWidth<=700&&shouldExpand);/* phones: the caption follows the card's 2.6s announce */if(live$.hidden)live$.replaceChildren();else{cap.append(el('span',{className:'speaker-label',textContent:speakers[cur.speaker]}),el('span',{textContent:cur.text}));if(v.fallback||!prefs.sound){const cc=el('div',{className:'caption-controls'});cc.append(btn(v.queue.length?'Next line':'Close text',()=>{if(v.queue.length)v.next();else{v.current=null;v.fallback=false;v.emit();}},'small'));cap.append(cc);}patch(live$,[...cap.childNodes]);}
 atlas.setReserve(!live$.hidden&&state.stage==='research'&&innerWidth>700?live$.getBoundingClientRect().top:0);
 if(isCharacter&&showSpeaker)lastSpeaker=showSpeaker;
 renderVoice.after?.();syncFilm(cur,v);
}
// ---- Multi-level drawer menu: one menu, levels pushed and popped like an iOS navigation stack. ----
const CHEV='<svg class="chev" viewBox="0 0 256 256" aria-hidden="true"><path d="M96 48l80 80-80 80" fill="none" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function drow(label,{to,action,value,danger}={}){const b=btn('',()=>to?pushLevel(to):action(),'drow'+(danger?' danger':''));b.append(el('span',{className:'drow-label',textContent:label}));if(value!==undefined)b.append(el('span',{className:'drow-value',textContent:value}));if(to)b.insertAdjacentHTML('beforeend',CHEV);return b;}
function dgroup(...rows){const g=el('div',{className:'dgroup'});g.append(...rows);return g;}
const textSizes=[['Small',.9],['Default',1],['Large',1.12],['Extra large',1.25]];
const LEVELS={
 menu:{title:'Menu',build:d=>d.append(dgroup(drow('Your brief',{to:'brief'}),drow('Your choices',{to:'choices'}),drow('What changed',{to:'changed'})),dgroup(drow('Settings',{to:'settings'}),drow('Replay current briefing',{action:()=>{closeDrawer();voice.play(resumeClips(state));}}),drow('Reset map view',{action:()=>{closeDrawer();atlas.focus(focusFor());}})),dgroup(drow('Restart',{to:'restart',danger:true})))},
 brief:{title:'Your brief',build:d=>notes(d,'brief')},choices:{title:'Your choices',build:d=>notes(d,'choices')},changed:{title:'What changed',build:d=>notes(d,'changed')},
 settings:{title:'Settings',build:d=>{const g=dgroup();for(const [key,text] of [['sound','Sound'],['cc','Captions'],['reduced','Reduce motion']]){const l=el('label',{className:'drow'}),i=el('input',{type:'checkbox',checked:prefs[key]});i.setAttribute('role','switch');i.onchange=()=>{prefs[key]=i.checked;if(key==='sound')voice.mute(!i.checked);applyPrefs();};l.append(el('span',{className:'drow-label',textContent:text}),i);g.append(l);}d.append(g,dgroup(drow('Text size',{to:'textsize',value:(textSizes.find(x=>x[1]===prefs.text)||textSizes[1])[0]})));}},
 textsize:{title:'Text size',build:d=>{const g=dgroup();g.setAttribute('role','radiogroup');for(const [t,v] of textSizes){const r=drow(t,{action:()=>{prefs.text=v;applyPrefs();g.querySelectorAll('.drow').forEach(x=>x.setAttribute('aria-checked',String(x===r)));}});r.setAttribute('role','radio');r.setAttribute('aria-checked',String(prefs.text===v));g.append(r);}d.append(g);}},
 restart:{title:'Restart this attempt?',build:d=>d.append(paragraph('This clears the saved brief on this device.'),dgroup(drow('Restart',{danger:true,action:()=>{closeDrawer();voice.stop();state=fresh();selectedSource=null;lastSpeaker=null;lastVoiceId=null;choice=null;attached=[];lesson=null;limit=null;closingStep=0;save();saved=null;render();}}),drow('Keep my brief',{action:()=>drawerStack.length>1?popLevel():closeDrawer()})))}
};
let drawerStack=[];
function paneFor(level){const p=el('div',{className:'pane'});LEVELS[level].build(p);return p;}
function setHead(){const top=drawerStack.at(-1),d=$('drawer');d.querySelector('.drawer-title').textContent=LEVELS[top].title;const back=d.querySelector('.back');back.hidden=drawerStack.length<2;if(!back.hidden){const prev=LEVELS[drawerStack.at(-2)].title;back.setAttribute('aria-label','Back to '+prev);back.querySelector('span').textContent=prev;}}
function openDrawer(path){drawerStack=[...path];const body=$('drawerBody');body.replaceChildren(paneFor(drawerStack.at(-1)));setHead();body.scrollTop=0;if(!$('drawer').open)$('drawer').showModal();}
function closeDrawer(){$('drawer').close();}
function slide(level,dir){const body=$('drawerBody'),old=body.querySelector('.pane:last-child'),next=paneFor(level);body.append(next);setHead();body.scrollTop=0;
 if(reducedMotion()||!old){old?.remove();return;}
 const push=dir==='push',o={duration:push?460:320,easing:push?'cubic-bezier(.32,.72,0,1)':'cubic-bezier(.32,.72,0,1)'};
 old.style.pointerEvents='none';old.animate([{translate:'0 0',opacity:1},{translate:push?'-28% 0':'100% 0',opacity:push?0:1}],{...o,fill:'forwards'}).finished.then(()=>old.remove());
 next.animate([{translate:push?'100% 0':'-28% 0',opacity:push?1:0},{translate:'0 0',opacity:1}],o);
 const t=$('drawer').querySelector('.drawer-title');t.animate([{opacity:0,translate:(push?'14px':'-14px')+' 0'},{opacity:1,translate:'0 0'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});}
function pushLevel(level){drawerStack.push(level);slide(level,'push');}
function popLevel(){if(drawerStack.length<2)return;drawerStack.pop();slide(drawerStack.at(-1),'pop');}
const openNotes=(mode='brief')=>openDrawer(['menu',mode]);
function notes(d,mode='brief'){if(mode==='brief'){d.append(paragraph(state.name?`${state.name} · ${state.matric}`:'Your brief is being prepared.'));if(state.claim!==null){d.append(el('h3',{textContent:'Asymmetry'}),paragraph(C.claims[state.claim]),paragraph(state.attached.map(id=>C.sources.find(x=>x.id===id).title).join(' · ')));}if(state.closing)d.append(el('h3',{textContent:'Lessons and limits'}),paragraph(state.closing.text));for(const id of state.opened){const s=C.sources.find(x=>x.id===id);d.append(el('h3',{textContent:s.title}),paragraph(s.text),btn('Replay source',()=>voice.play(['SRC_'+id])));}return;}
 if(mode==='changed'){if(state.stance!==null)d.append(el('h3',{textContent:'Opening position'}),paragraph(C.stances[state.stance]));if(state.stanceClose!==null)d.append(el('h3',{textContent:'Closing position'}),paragraph(C.stances[state.stanceClose]));if(state.stage==='debrief'){const r=result(state);d.append(paragraph(`${r.score}/100 · ${r.label}`));for(const [k,v] of Object.entries(state.scores))d.append(paragraph(`${k}: ${v}/${k==='asymmetry'||k==='limits'?20:30}`));d.append(paragraph(`Final adjustment: ${state.adjustment}. ${state.fr>=30||state.ac<50?'The final band fell one level because fit risk reached 30 or credibility fell below 50.':'No risk-based band reduction.'}`));}}
 if(mode==='choices'){state.routes.forEach((r,i)=>d.append(paragraph('Dispute '+(i+1)+': your route — '+C.mechanisms[r]+'. Best match — '+C.mechanisms[i]+'.')));state.decisions.forEach((r,i)=>d.append(paragraph(C.features[i].title+': '+['Transfer','Adapt','Reject'][r]+'. Strongest supported choice — '+['Transfer','Adapt','Reject'][C.features[i].points.indexOf(10)]+'.')));}
 for(const id of state.checks){const f=C.features.find(x=>x.id===id);d.append(el('h3',{textContent:'Checked: '+f.title}),paragraph(f.check));}
 for(const l of state.log){const ar=el('article');ar.append(el('strong',{textContent:l.label}));const keys=Object.entries(l).filter(([k])=>!['label','stage'].includes(k));for(const [k,v] of keys)ar.append(el('div',{className:'record-value',textContent:`${k}: ${Array.isArray(v)?v.join(', '):v}`}));d.append(ar);}if(!state.log.length)d.append(paragraph('Your decisions will appear here.'));}
function applyPrefs(){document.body.classList.toggle('reduced',prefs.reduced);document.documentElement.style.setProperty('--scale',prefs.text);$('cc').setAttribute('aria-pressed',String(prefs.cc));$('cc').setAttribute('aria-label',prefs.cc?'Hide captions':'Show captions');$('sound').setAttribute('aria-label',prefs.sound?'Mute sound':'Enable sound');$('sound').style.opacity=prefs.sound?'1':'.45';const si=$('sound').querySelector('img');if(si)si.src='assets/icons/'+(prefs.sound?'speaker-high':'speaker-slash')+'.svg';localStorage.setItem(KEY+'-prefs',JSON.stringify(prefs));renderVoice();}
const settings=()=>openDrawer(['menu','settings']);
const requestRestart=()=>openDrawer(['restart']);
$('drawer').querySelector('.close').onclick=closeDrawer;$('drawer').querySelector('.back').onclick=popLevel;$('menu').onclick=()=>openDrawer(['menu']);$('notes').onclick=()=>openNotes();$('settings').onclick=settings;$('cc').onclick=()=>{prefs.cc=!prefs.cc;applyPrefs();};$('sound').onclick=()=>{prefs.sound=!prefs.sound;voice.mute(!prefs.sound);applyPrefs();};
await atlas.init();const manifest=await fetch('assets/audio-manifest.json').then(r=>r.json());films=await fetch('assets/films/films.json').then(r=>r.ok?r.json():{}).catch(()=>({}));mountGuide();mountHover(hoverKey);
document.addEventListener('pointerdown',e=>{const t=e.target;
 const film=$('film');if(film.classList.contains('expanded')&&!film.contains(t))filmCollapse();
 const d=document.querySelector('#ending .end-detail');if(d&&!d.hidden&&!d.contains(t)&&!t.closest?.('.rw-open'))closeEndDetail();
 for(const x of document.querySelectorAll('#status details[open]'))if(!x.contains(t))x.open=false;
 const dr=$('drawer');if(dr.open&&t===dr){const r=dr.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDrawer();}},true);voice=new Voice(manifest,renderVoice);voice.audio.addEventListener('timeupdate',lockFilm);voice.audio.addEventListener('play',lockFilm);voice.muted=!prefs.sound;voice.onLevel=energy=>{talk.audio=energy;talk.wake();};
// The task rail grows down to whatever is docked under it: the character card or its replay tab, and on
// phones (where the rail is full width) the guide too. Layout sizes only, so in-flight animations don't count.
// On phones the caption sits above the guide (or the open card) and the rail stops above the caption.
const dock=()=>{const c=$('character'),g=$('guide'),cap=$('caption'),mobile=innerWidth<=700,ch=c.childElementCount?c.offsetHeight:0,root=document.documentElement.style;let r=ch?ch+12+(mobile?14:0):0;
 if(mobile){if(g.dataset.phase!=='hidden')r=Math.max(r,26+g.offsetHeight+12);root.setProperty('--capb',r+'px');if(!cap.hidden&&cap.offsetHeight)r+=cap.offsetHeight+12;}else root.setProperty('--filmb',(cap.hidden||!cap.offsetHeight?112:110+cap.offsetHeight+16)+'px');root.setProperty('--dock',r+'px');
 // Set the rail's height directly too: Chrome can be slow to re-resolve a changed custom property inside calc(),
 // which let an opening card overlap the rail for about a second.
 const a=$('actions');a.style.maxHeight=a.classList.contains('landing')?'':Math.max(0,Math.round(mobile?innerHeight*.57-r:innerHeight-96-32-r))+'px';};
for(const id of ['character','guide','caption'])new ResizeObserver(dock).observe($(id));addEventListener('resize',dock);renderVoice.after=dock;
// iOS rubber banding at the ends of every scroll area.
rubberBand($('actions'));rubberBand($('drawerBody'));rubberBand($('caption'));for(const [id,name] of [['notes','notebook'],['sound','speaker-high'],['cc','closed-captioning'],['settings','gear-six']]){const b=$(id);b.textContent='';const image=el('img',{src:'assets/icons/'+name+'.svg',alt:''});image.width=20;image.height=20;b.append(image);}applyPrefs();render();
// ---- Developer page ----
// Only the registered developer email opens it. Option/Alt+Shift+D is the shortcut. The email itself is not in the
// code, only its SHA-256 fingerprint. The signed-in email comes from the host's sign-in (window.BLUEPRINT_SESSION,
// once the backend contract is built); until then a developer signs in for this tab from the shortcut.
// This is a browser-side gate: it hides the page, it is not access control. Real protection needs server sign-in.
const DEV_EMAIL_SHA256='78a684e988cc455e951e8a6c9e6ea13d33b4f5bab00e6cbf9c7d647135aa8d38';
const sha256=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(t).trim().toLowerCase())))].map(b=>b.toString(16).padStart(2,'0')).join('');
async function devAllowed(){const host=window.BLUEPRINT_SESSION?.email;if(host)return (await sha256(host))===DEV_EMAIL_SHA256;return sessionStorage.getItem('bb-dev')===DEV_EMAIL_SHA256;}
// The page runs in the sandbox (?dev=1, its own save key), so it never touches a learner's saved run.
function mountDev(){if($('dev').childElementCount){$('dev').hidden=false;return;}const d=$('dev');d.hidden=false;d.append(document.createTextNode('DEV · '));const s=el('select');for(const stage of ['landing','identity','briefing','stance','research','claim','disputes','enforcement','roundtable','transfer','closing','challenge','stanceClose','debrief'])s.append(el('option',{value:stage,textContent:stage}));s.onchange=()=>{voice.stop();state={...fresh(),name:'Preview learner',matric:'DEMO',stage:s.value,stance:0,opened:['constitution','basque','catalonia','andalusia'],paid:12,reserve:12,claim:0,attached:['basque','andalusia'],challenge:'transfer',closing:{lesson:0,limit:0,text:C.lessons[0]+', '+C.limits[0]},scores:{asymmetry:20,mechanisms:20,transfer:25,limits:20}};selectedSource='basque';lastSpeaker=null;lastVoiceId=null;render();};d.append(s,btn('Play stage audio',()=>voice.play(resumeClips(state))));window.__blueprint={get state(){return state;},dispatch:act,voice,atlas,render};}
LEVELS.devsign={title:'Developer access',build:d=>{const f=el('form',{className:'dev-sign'});const i=el('input',{type:'email',autocomplete:'email',required:true,placeholder:'Email address'});i.setAttribute('aria-label','Email address');const msg=el('p',{className:'hint'});msg.setAttribute('role','status');const b=btn('Continue',()=>{},'primary');b.type='submit';f.append(i,b,msg);
 f.onsubmit=async ev=>{ev.preventDefault();const h=await sha256(i.value);if(h===DEV_EMAIL_SHA256){sessionStorage.setItem('bb-dev',h);closeDrawer();if(!devMode)location.search='?dev=1';else mountDev();}else{msg.textContent='This email doesn’t have developer access.';i.select();}};
 d.append(paragraph('Sign in with the email registered for developer tools.'),f);setTimeout(()=>i.focus(),60);}};
addEventListener('keydown',async e=>{if(!(e.altKey&&e.shiftKey&&e.code==='KeyD'))return;e.preventDefault();
 if(!(await devAllowed())){openDrawer(['devsign']);return;}
 if(!devMode){location.search='?dev=1';return;}
 if(!$('dev').childElementCount)mountDev();else $('dev').hidden=!$('dev').hidden;});
if(devMode)devAllowed().then(ok=>{if(ok)mountDev();});
