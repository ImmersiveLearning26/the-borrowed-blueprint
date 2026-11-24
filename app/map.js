export class Atlas {
 constructor(svg,markers){this.svg=svg;this.markers=markers;this.current=null;this.frame=0;this.selected=null;this.mode='overview';this.markersData=[];this.onSource=()=>{};}
 async init(){[this.cfg,this.regions]=await Promise.all(['map-config.json','regions.json'].map(f=>fetch('assets/'+f).then(r=>r.json())));const t=await fetch('assets/atlas-master.svg').then(r=>r.text());const doc=new DOMParser().parseFromString(t,'image/svg+xml');this.svg.innerHTML=doc.documentElement.innerHTML;this.svg.querySelector('image').setAttribute('href','assets/ocean-texture.png');const ns='http://www.w3.org/2000/svg';this.highlights=document.createElementNS(ns,'g');this.svg.append(this.highlights);
// A thin glow line around the country in focus: a blurred halo under a hairline, drawn on when the country changes.
// Stroke widths and blur are reset every camera frame so they stay the same on screen at any zoom.
const defs=this.svg.querySelector('defs')||this.svg.insertBefore(document.createElementNS(ns,'defs'),this.svg.firstChild);defs.insertAdjacentHTML('beforeend','<filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>');
this.glow=document.createElementNS(ns,'g');this.glow.setAttribute('class','country-glow');this.glow.innerHTML='<path class="halo" filter="url(#glow)" pathLength="1"/><path class="line" pathLength="1"/>';this.svg.insertBefore(this.glow,this.highlights);
// A thin dashed line that leads from one place to the next while the camera travels (revealed through a mask).
defs.insertAdjacentHTML('beforeend','<mask id="trailMask" maskUnits="userSpaceOnUse" x="-20000" y="-20000" width="60000" height="60000"><path class="trail-reveal" pathLength="1"/></mask>');
this.trail=document.createElementNS(ns,'g');this.trail.setAttribute('class','trail');this.trail.innerHTML='<path class="trail-line" mask="url(#trailMask)"/><circle class="trail-start"/><circle class="trail-end"/><g class="traveler"><circle class="ring"/><circle class="ring r2"/><circle class="core"/></g>';this.svg.append(this.trail);this.focus('overview',true);window.addEventListener('resize',()=>this.focus(this.mode,true));}
 xy(lon,lat){const [w,s,e,n]=this.cfg.bounds;const merc=l=>180/Math.PI*Math.log(Math.tan(Math.PI/4+l*Math.PI/360));return [(lon-w)*this.cfg.width/(e-w),(merc(n)-merc(lat))*this.cfg.width/(e-w)];}
 boxFor(mode){const boxes={overview:[-19,1,18,49],spain:[-10,35.2,4.8,44.5],north:[-9,37.4,4,44.3],nigeria:[1.7,3.4,15,14.6]};const b=boxes[mode]||boxes.spain;const a=this.xy(b[0],b[3]),z=this.xy(b[2],b[1]);return [a[0],a[1],z[0]-a[0],z[1]-a[1]];}
 // Places the journey connects (lon, lat).
 anchor(mode){return ({spain:[-3.7,40.4],north:[-2.6,43],nigeria:[7.5,9.06]})[mode];}
 // Where a place should sit on screen: the centre of the free map area (left of the rail; on phones, above it).
 screenSpot(){const W=innerWidth,H=innerHeight,mobile=W<=700;return mobile?[W/2,75+H*.17]:[20+(W-380)/2,80+((this.reserveTop?this.reserveTop-16:H-80)-80)/2];}
 targetFor(mode){const W=innerWidth,H=innerHeight,mobile=W<=700;const [x,y,w,h]=this.boxFor(mode);const usableW=mobile?W-40:W-380,usableH=mobile?H*.34:Math.max(200,(this.reserveTop?this.reserveTop-16:H-80)-80);const scale=Math.min(usableW/w,usableH/h);const vx=x-(usableW/scale-w)/2-20/scale;const vy=y-(usableH/scale-h)/2-(mobile?75:80)/scale;return [vx,vy,W/scale,H/scale];}
 applyView(v){this.current=v;this.svg.setAttribute('viewBox',v.join(' '));const W=innerWidth;this.svg.querySelectorAll('text').forEach(t=>t.setAttribute('font-size',String(12*v[2]/W)));this.placeMarkers();}
 focus(mode,instant=false){if(!this.cfg)return;const prev=this.mode;this.mode=mode;cancelAnimationFrame(this.frame);
  if(this.journeying){this.journeying=false;this.svg.parentElement.style.transform='';const g=this.pendingGlow;this.pendingGlow=undefined;this.glowName=null;if(g!==undefined)this.glowCountry(g);}
  const target=this.targetFor(mode),from=this.current||target;
  const reduced=instant||document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const a=this.anchor(prev),b=this.anchor(mode);
  // Crossing between countries is a journey; everything else is a short camera move.
  if(!reduced&&prev!==mode&&a&&b&&(prev==='nigeria')!==(mode==='nigeria'))return this.journey(a,b,from,target);
  const start=performance.now(),long=mode==='overview'||prev==='overview';const duration=long?1100:620;
  const stage=this.svg.parentElement,tiltMax=prev&&prev!==mode&&!reduced?(long?7:4):0;
  const step=(now)=>{const t=reduced?1:Math.min(1,(now-start)/duration);const e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;this.applyView(from.map((v,i)=>v+(target[i]-v)*e));
   const lift=Math.sin(Math.PI*t);stage.style.transform=tiltMax?`perspective(1200px) rotateX(${(tiltMax*lift).toFixed(2)}deg) scale(${(1+.05*lift*tiltMax/7).toFixed(4)})`:'';
   if(t<1)this.frame=requestAnimationFrame(step);else stage.style.transform='';};this.frame=requestAnimationFrame(step);}
 /* The journey (about 3.8s). 1: the camera closes in on where you are and a dot starts pulsing there.
    2: it travels along a winding S-shaped route, the dashed line drawing behind the dot, the map tilting and
    leaning into each bend. 3: it rises out to frame the destination country, and only then does the country's
    glow line draw around it. */
 journey(a,b,from,target){
  const stage=this.svg.parentElement,W=innerWidth,H=innerHeight,[sx,sy]=this.screenSpot();
  const P0=this.xy(...a),P3=this.xy(...b),dx=P3[0]-P0[0],dy=P3[1]-P0[1],len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,bend=len*.42;
  const P1=[P0[0]+dx*.28+nx*bend,P0[1]+dy*.28+ny*bend],P2=[P0[0]+dx*.72-nx*bend,P0[1]+dy*.72-ny*bend];
  const bez=u=>{const m=1-u;return [0,1].map(i=>m*m*m*P0[i]+3*m*m*u*P1[i]+3*m*u*u*P2[i]+u*u*u*P3[i]);};
  const dir=u=>{const p=bez(Math.max(0,u-.01)),q=bez(Math.min(1,u+.01));return Math.atan2(q[1]-p[1],q[0]-p[0]);};
  const d=`M${P0} C${P1} ${P2} ${P3}`;this.startTrail(d,P0,P3);
  this.journeying=true;this.pendingGlow=this.glowName;this.glow.classList.remove('on');
  const ratio=H/W,tw=Math.min(from[2],target[2])*.7,view=(c,w)=>[c[0]-sx*w/W,c[1]-sy*w*ratio/H,w,w*ratio];
  const lerp=(p,q,k)=>p.map((v,i)=>v+(q[i]-v)*k),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,inOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  const D=3800,A=.18,B=.8,start=performance.now(),traveler=this.trail.querySelector('.traveler'),reveal=this.svg.querySelector('.trail-reveal'),base=dir(0);
  const step=now=>{const t=Math.min(1,(now-start)/D);let v,u=0;
   if(t<A){v=lerp(from,view(P0,tw),ease(t/A));}
   else if(t<B){u=inOut((t-A)/(B-A));v=view(bez(u),tw*(1+.22*Math.sin(Math.PI*u)));}
   else{u=1;v=lerp(view(P3,tw),target,ease((t-B)/(1-B)));}
   this.applyView(v);reveal.style.strokeDashoffset=String(1-u);const p=bez(u);traveler.setAttribute('transform',`translate(${p[0]} ${p[1]})`);
   // Tilt back while travelling; lean (roll) a little into each bend of the route.
   const lift=Math.sin(Math.PI*t),lean=t>A&&t<B?Math.max(-1,Math.min(1,(dir(u)-base)*1.4)):0;
   stage.style.transform=`perspective(1200px) rotateX(${(9*lift).toFixed(2)}deg) rotateZ(${(-2.2*lean*lift).toFixed(2)}deg) scale(${(1+.08*lift).toFixed(4)})`;
   if(t<1){this.frame=requestAnimationFrame(step);return;}
   stage.style.transform='';this.journeying=false;this.endTrail();const g=this.pendingGlow;this.pendingGlow=undefined;this.glowName=null;this.glowCountry(g);};
  this.frame=requestAnimationFrame(step);}
 startTrail(d,P0,P3){clearTimeout(this.trailTimer);this.trail.classList.remove('fade','arrived');this.trail.classList.add('on');
  this.trail.querySelector('.trail-line').setAttribute('d',d);const r=this.svg.querySelector('.trail-reveal');r.setAttribute('d',d);r.style.strokeDashoffset='1';
  for(const [c,[cx,cy]] of [['.trail-start',P0],['.trail-end',P3]]){const el=this.trail.querySelector(c);el.setAttribute('cx',cx);el.setAttribute('cy',cy);}}
 endTrail(){this.trail.classList.add('arrived');this.trailTimer=setTimeout(()=>{this.trail.classList.add('fade');this.trailTimer=setTimeout(()=>this.trail.classList.remove('on','fade','arrived'),700);},2400);}
 // Reframe into free space: keep the map (and its pins) above a panel whose top edge is at `top` px (0 = none).
 setReserve(top){top=Math.round(top||0);if(Math.abs(top-(this.reserveTop||0))<8)return;this.reserveTop=top;this.focus(this.mode);}
 glowCountry(name){if(this.journeying){this.pendingGlow=name;return;}if(!this.cfg||name===this.glowName)return;this.glowName=name;const c=this.cfg.countries.find(x=>x.name===name);this.glow.classList.remove('on');if(!c){this.glow.querySelectorAll('path').forEach(p=>p.removeAttribute('d'));return;}this.glow.querySelectorAll('path').forEach(p=>p.setAttribute('d',c.path));this.glow.getBoundingClientRect();requestAnimationFrame(()=>this.glow.classList.add('on'));}
 strokes(){if(!this.current)return;const k=this.current[2]/innerWidth;this.svg.style.setProperty('--px',k);this.svg.querySelector('#glow feGaussianBlur')?.setAttribute('stdDeviation',(2.4*k).toFixed(3));}
 setSources(sources,opened,selected,enabled){this.markersData=enabled?sources:[];const ids=this.markersData.map(s=>s.id).join('|');
  if(ids!==this.markerIds){this.markerIds=ids;this.markers.replaceChildren();this.markersData.forEach((s,i)=>{const b=document.createElement('button');b.className='marker';b.dataset.id=s.id;b.style.setProperty('--i',i);b.innerHTML='<span class="pin" aria-hidden="true"><i class="ripple"></i><i class="ripple"></i><img src="assets/pin.png" alt="" width="24" height="36"></span><span class="label"></span>';b.querySelector('.label').textContent=s.title;b.onclick=()=>this.onSource(s.id);this.markers.append(b);});}
  for(const s of this.markersData){const b=this.markers.querySelector(`[data-id="${s.id}"]`);b.classList.toggle('selected',s.id===selected);b.classList.toggle('opened',opened.includes(s.id));b.setAttribute('aria-label',`${s.title}${opened.includes(s.id)?', replay source':', open source for six hours'}`);}
  this.selected=selected;const src=sources.find(s=>s.id===selected);
  // A source tied to named communities lights those; a national source (the 1978 Constitution) lights every one, in turn.
  const names=!src?[]:src.regions?.length?src.regions:this.regions.filter(r=>r.country==='ESP').map(r=>r.name);const key=names.join('|');
  if(key!==this.regionKey){this.regionKey=key;this.highlights.innerHTML=this.regions.filter(r=>r.country==='ESP'&&names.includes(r.name)).map((r,i)=>`<g class="region" style="--i:${i}"><path class="region-halo" filter="url(#glow)" d="${r.path}"/><path class="region-hot" d="${r.path}"/></g>`).join('');}this.placeMarkers();}
 placeMarkers(){if(!this.current)return;this.strokes();const [x,y,w,h]=this.current;this.markersData.forEach(s=>{const p=this.xy(s.lon,s.lat),b=this.markers.querySelector(`[data-id="${s.id}"]`);if(b){b.style.left=(p[0]-x)/w*innerWidth+'px';b.style.top=(p[1]-y)/h*innerHeight+'px';}});;this.tuck();}
 // Labels sit right of their pin; one that would touch another pin or label flips to the left.
 layoutLabels(){const ms=[...this.markers.querySelectorAll('.marker')];if(ms.length<2)return;ms.forEach(m=>m.classList.remove('flip'));const ov=(a,b)=>a.left<b.right+6&&a.right>b.left-6&&a.top<b.bottom+2&&a.bottom>b.top-2;const hits=m=>{const r=m.getBoundingClientRect();return ms.some(o=>o!==m&&ov(r,o.getBoundingClientRect()));};
  for(const m of ms.sort((a,b)=>a.getBoundingClientRect().left-b.getBoundingClientRect().left)){if(hits(m)){m.classList.add('flip');if(hits(m))m.classList.remove('flip');}}}
 tuck(){this.layoutLabels();const boxes=[...this.markers.querySelectorAll('.marker')].map(m=>m.getBoundingClientRect());this.svg.querySelectorAll('text').forEach(t=>{const r=t.getBoundingClientRect();t.classList.toggle('tucked',boxes.some(b=>r.left<b.right+4&&r.right>b.left-4&&r.top<b.bottom+2&&r.bottom>b.top-2));});}
}
