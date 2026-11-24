import {CONTENT as C} from './content.js';
import {fresh,dispatch,result,resumeClips} from './engine.js';
import {Atlas} from './map.js';
import {Voice,speakers} from './audio.js';
import {Strands} from './strands.js';
import {Talk,rubberBand,patch,stagger,reducedMotion,readingMs,mountPortrait} from './motion.js';
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
   While it is being read its slot in the list closes up; it reopens when the line ends. If no caption will show
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
function focusFor(){return ['landing','identity','briefing'].includes(state.stage)?'overview':['roundtable','transfer','closing','challenge','stanceClose','debrief'].includes(state.stage)?'nigeria':state.stage==='disputes'?'north':'spain';}
function render(){renderActions();renderStatus();const f=focusFor();if(lastFocus!==f){atlas.focus(f);lastFocus=f;}atlas.glowCountry(f==='nigeria'?'Nigeria':f==='overview'?null:'Spain');atlas.setSources(C.sources,state.opened,selectedSource,state.stage==='research');renderVoice();}
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
 if(state.stage==='stance'||state.stage==='stanceClose'){a.append(options(C.stances),commit('Confirm',()=>act(state.stage,{value:choice}),choice!==null));return;}
 if(state.stage==='research'){const g=el('div',{className:'group'});C.sources.forEach(s=>{const b=btn(s.title,()=>openSource(s.id),s.id===selectedSource?'selected':'');b.setAttribute('aria-label',s.title+(state.opened.includes(s.id)?', opened':', six hours'));g.append(b);});a.append(g,commit('Build claim',()=>act('researchDone'),state.opened.length>=2));return;}
 if(state.stage==='claim'){if(choice===null||attached.length===0&&!renderActions.claimAttachments){a.append(options(C.claims),commit('Attach sources',()=>{renderActions.claimAttachments=true;renderActions();},choice!==null));}else{a.append(paragraph('Choose two sources.'));for(const id of state.opened){const s=C.sources.find(x=>x.id===id);const b=btn(s.title,()=>{attached=attached.includes(id)?attached.filter(x=>x!==id):attached.length<2?[...attached,id]:attached;renderActions();},attached.includes(id)?'selected':'');b.setAttribute('aria-pressed',String(attached.includes(id)));a.append(b);}a.append(commit('Submit claim',()=>{act('claim',{value:choice,sources:attached});renderActions.claimAttachments=false;},attached.length===2),btn('Back',()=>{renderActions.claimAttachments=false;attached=[];renderActions();}));}return;}
 if(state.stage==='disputes'){a.append(options(C.mechanisms),commit('Confirm route',()=>act('route',{value:choice}),choice!==null));return;}
 if(state.stage==='enforcement'){a.append(options(['Invoke Article 155 now','Court enforcement first']),commit('Confirm',()=>act('enforce',{value:choice}),choice!==null));return;}
 if(state.stage==='transfer'){const f=C.features[state.decisions.length];a.append(paragraph(f.title,'eyebrow'),btn(state.checks.includes(f.id)?'Replay source check':'Check source · 6h',()=>act('check')),options(['Transfer','Adapt','Reject']),commit('Confirm',()=>act('transfer',{value:choice}),choice!==null));return;}
 if(state.stage==='closing'){const values=closingStep?C.limits:C.lessons;a.append(paragraph(closingStep?'Choose the limit.':'Choose the lesson.'));const g=el('div',{className:'group'});values.forEach((t,i)=>{const id=(closingStep?'LIMIT_':'LESSON_')+i,row=el('div',{className:'option-row'+(reading?.id===id?' reading':'')});row.dataset.clip=id;row.append(btn(t,()=>{if(closingStep)limit=i;else lesson=i;renderActions();},'option '+((closingStep?limit:lesson)===i?'selected':'')),readButton(()=>readOption(id)));g.append(row);});a.append(g);if(!closingStep)a.append(commit('Continue',()=>{closingStep=1;renderActions();},lesson!==null));else a.append(commit('Submit closing line',()=>act('closing',{lesson,limit}),limit!==null),btn('Back',()=>{closingStep=0;renderActions();}));return;}
 if(state.stage==='challenge'){a.append(options(['Concede and adjust','Defend with sources','Reframe as further research']),commit('Confirm response',()=>act('response',{value:choice}),choice!==null));return;}
 if(state.stage==='debrief'){a.append(el('h2',{textContent:result(state).label}),btn('Your choices',()=>openNotes('choices')),btn('What changed',()=>openNotes('changed')),btn('Your brief',()=>openNotes('brief')),btn('Restart',requestRestart));}
}
function openSource(id){selectedSource=id;act('source',{id});}
atlas.onSource=openSource;
function renderStatus(){const box=$('status');box.replaceChildren();if(['landing','identity','briefing'].includes(state.stage))return;const t=state.stage==='research'?`${24-state.paid}h research`:['roundtable','transfer','closing'].includes(state.stage)?`${state.reserve}h reserve`:['claim','disputes','enforcement'].includes(state.stage)?(state.stage==='claim'?'48h':'24h'):'72h';if(!['challenge','stanceClose','debrief'].includes(state.stage))box.append(el('span',{className:'status-chip',textContent:t}));const d=el('details',{className:'status-chip'});d.append(el('summary',{textContent:`AC ${state.ac} · Fit ${state.fr}`}));d.append(paragraph(`Analytical credibility: ${state.ac}/100. Fit risk: ${state.fr}/100. Higher credibility and lower fit risk strengthen your brief.`));box.append(d);}
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
 renderVoice.after?.();
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
await atlas.init();const manifest=await fetch('assets/audio-manifest.json').then(r=>r.json());mountGuide();voice=new Voice(manifest,renderVoice);voice.muted=!prefs.sound;voice.onLevel=energy=>{talk.audio=energy;talk.wake();};
// The task rail grows down to whatever is docked under it: the character card or its replay tab, and on
// phones (where the rail is full width) the guide too. Layout sizes only, so in-flight animations don't count.
// On phones the caption sits above the guide (or the open card) and the rail stops above the caption.
const dock=()=>{const c=$('character'),g=$('guide'),cap=$('caption'),mobile=innerWidth<=700,ch=c.childElementCount?c.offsetHeight:0,root=document.documentElement.style;let r=ch?ch+12+(mobile?14:0):0;
 if(mobile){if(g.dataset.phase!=='hidden')r=Math.max(r,26+g.offsetHeight+12);root.setProperty('--capb',r+'px');if(!cap.hidden&&cap.offsetHeight)r+=cap.offsetHeight+12;}root.setProperty('--dock',r+'px');
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
