import assert from 'node:assert/strict';
import {fresh,dispatch,fit,result,weakest,resumeClips} from '../app/engine.js';
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync(new URL('../app/assets/audio-manifest.json',import.meta.url)));
const ids=new Set(manifest.map(x=>x.id));let seen=new Set();let checks=0;
function run(s,type,p){const r=dispatch(s,type,p);for(const id of r.clips){assert(ids.has(id),'Missing audio '+id);seen.add(id);}checks++;return r.state;}
function begin(stance=1){let s=fresh();s=run(s,'start');s=run(s,'identity',{name:'Ada',matric:'DPA001'});s=run(s,'briefingDone');return run(s,'stance',{value:stance});}
function research(s,all=true){for(const id of all?['constitution','basque','catalonia','andalusia']:['basque','andalusia'])s=run(s,'source',{id});s=run(s,'researchDone');s=run(s,'claim',{value:0,sources:['basque','andalusia']});assert.throws(()=>dispatch(s,'claim',{value:0,sources:['basque','andalusia']}));return run(s,'continue');}
let s=begin();assert.throws(()=>dispatch(s,'researchDone'));s=research(s);assert.equal(s.reserve,0);
for(const value of [0,1,2]){s=run(s,'route',{value});assert.throws(()=>dispatch(s,'route',{value}));s=run(s,'continue');}
assert.equal(s.stage,'roundtable');s=run(s,'roundtableDone');assert.throws(()=>dispatch(s,'check'));
for(const value of [1,0,2]){s=run(s,'transfer',{value});assert.throws(()=>dispatch(s,'transfer',{value}));s=run(s,'continue');}
s=run(s,'closing',{lesson:0,limit:0});assert.throws(()=>dispatch(s,'closing',{lesson:0,limit:0}));s=run(s,'continue');assert.equal(s.challenge,'transfer');s=run(s,'response',{value:1});s=run(s,'continue');s=run(s,'stanceClose',{value:1});assert.deepEqual(result(s),{score:100,band:0,label:'Brief adopted'});
assert.equal(fit(0,['basque','andalusia']),20);assert.equal(fit(1,['constitution','catalonia']),20);assert.equal(fit(2,['catalonia','basque']),5);assert.equal(fit(3,['constitution','catalonia']),15);
let free=begin(0);assert.equal(free.paid,0);free=run(free,'source',{id:'basque'});free=run(free,'researchDone');assert.equal(free.reserve,12);
// Every dispute route combination and both escalation follow-ups; all card choices.
for(const a of [0,1,2,3])for(const b of [0,1,2,3])for(const c of [0,1,2,3])for(const follow of [0,1]){
 let t=research(begin(2),false);for(const value of [a,b,c]){t=run(t,'route',{value});t=run(t,'continue');}
 assert.equal(t.escalated,a!==0||b!==1);
 if(t.stage==='enforcement'){t=run(t,'enforce',{value:follow});assert.throws(()=>dispatch(t,'enforce',{value:follow}));t=run(t,'continue');assert.equal(t.art155,follow===0);}
 t=run(t,'roundtableDone');t=run(t,'check');const hours=t.reserve;t=run(t,'check');assert.equal(t.reserve,hours);
 for(const value of [a%3,b%3,c%3]){t=run(t,'transfer',{value});t=run(t,'continue');}
 t=run(t,'closing',{lesson:a,limit:b});t=run(t,'continue');t=run(t,'response',{value:c%3});t=run(t,'continue');t=run(t,'stanceClose',{value:2});assert(result(t).score>=0&&result(t).score<=100);assert(t.ac>=0&&t.ac<=100);assert(t.fr>=0&&t.fr<=100);for(const id of resumeClips(t))assert(ids.has(id));
}
assert.equal(weakest({...fresh(),scores:{asymmetry:20,mechanisms:30,transfer:30,limits:20}}),'transfer');
assert.equal(result({...s,fr:30,ac:1}).band,1); // One level only, not two.
assert.equal(new Set(manifest.map(x=>x.file)).size,manifest.length);
console.log(JSON.stringify({passed:true,actionsChecked:checks,uniqueTriggeredClips:seen.size,manifestClips:ids.size}));
