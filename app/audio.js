export const speakers={guide:'Guide',narrator:'Narrator',eze:'Dr Ngozi Eze',marin:'Prof. Elena Marín',sani:'Mr Yakubu Sani',governors:'Governors’ Forum delegate',federal:'Federal Ministry delegate',assembly:'National Assembly delegate'};
export class Voice {
 constructor(manifest,onChange){this.byId=Object.fromEntries(manifest.map(a=>[a.id,a]));this.onChange=onChange;this.audio=new Audio();this.queue=[];this.lastQueue=[];this.current=null;this.playing=false;this.fallback=false;this.muted=false;this.generation=0;this.audio.onended=()=>this.next();this.audio.onpause=()=>{this.playing=false;this.emit();};this.audio.onplay=()=>{this.playing=true;this.emit();this.meter();};this.audio.onerror=()=>{if(this.current){this.fallback=true;this.playing=false;this.emit();}};}
 async meter(){
  try{if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.analyser=this.ctx.createAnalyser();this.analyser.fftSize=256;this.media=this.ctx.createMediaElementSource(this.audio);this.media.connect(this.analyser);this.analyser.connect(this.ctx.destination);this.samples=new Uint8Array(this.analyser.fftSize);}await this.ctx.resume();cancelAnimationFrame(this.meterFrame);const frame=()=>{if(!this.playing)return;this.analyser.getByteTimeDomainData(this.samples);let sum=0;for(const b of this.samples)sum+=((b-128)/128)**2;this.onLevel?.(Math.min(1,Math.sqrt(sum/this.samples.length)*5));this.meterFrame=requestAnimationFrame(frame);};frame();}catch{/* CSS speaking state remains a visual playback fallback. */}
 }
 emit(){this.onChange(this);}
 async play(ids){this.stop();this.lastQueue=[...ids];this.queue=ids.filter(i=>this.byId[i]);await this.next();}
 stop(){this.generation++;this.queue=[];this.audio.pause();this.audio.removeAttribute('src');this.current=null;this.playing=false;this.fallback=false;this.emit();}
 async next(){this.generation++;const gen=this.generation;this.audio.pause();const id=this.queue.shift();if(!id){this.playing=false;this.fallback=false;this.emit();return;}this.current=this.byId[id];this.fallback=false;this.playing=false;this.emit();if(this.muted){this.fallback=true;this.emit();return;}
 // HEAD prevents repeatedly requesting absent media; no invented TTS voice.
 try{const r=await fetch(this.current.file,{method:'HEAD'});if(gen!==this.generation)return;if(!r.ok)throw Error('missing');this.audio.src=this.current.file;await this.audio.play();}catch{if(gen!==this.generation)return;this.fallback=true;this.playing=false;this.emit();}}
 toggle(){if(this.fallback)return;if(this.playing)this.audio.pause();else if(this.audio.src)this.audio.play().catch(()=>{this.fallback=true;this.emit();});}
 replay(){if(this.current)this.play([this.current.id]);else if(this.lastQueue.length)this.play(this.lastQueue);}
 mute(value){this.muted=value;if(value){this.audio.pause();if(this.current)this.fallback=true;this.emit();}else if(this.current){const id=this.current.id;this.queue.unshift(id);this.next();}}
}
