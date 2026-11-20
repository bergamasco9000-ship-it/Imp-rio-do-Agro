// ===== Cães e ladrões =====
const THV=[],DR=new Map();const thActive=t=>t.st!=='gone'&&t.st!=='down'&&t.st!=='surr'&&t.st!=='cuffed'&&t.st!=='ride';let lastHour=-1;
const kennelCap=()=>[1,2,3,5][S.up.kennel||0];
const dogDef=d=>DOGS[d.breed];
const guardScore=()=>S.dogs.reduce((m,d)=>Math.max(m,DOGS[d.breed].guard),0);
function dogRT(d){
 let r=DR.get(d.id);
 if(!r){r={x:P.x-18,y:P.y,dir:1,cd:0,st:'follow',tgt:null,bark:0,wag:0};DR.set(d.id,r)}
 return r;
}
function activeDog(){return S.dogs.find(d=>d.id===S.dogAct)||S.dogs[0]}
function setCmd(c){
 const d=activeDog();if(!d)return;const r=dogRT(d);
 if(c==='follow'||c==='stay'){r.st=c;r.tgt=null;toast('🐕 '+d.name+': '+(c==='follow'?'seguindo você':'fica aqui'))}
 else if(c==='attack'){
  const t=THV.filter(t=>thActive(t)).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y))[0];
  if(!t)return toast('Não há ninguém para atacar','bad');r.st='attack';r.tgt=t;toast('🐕 '+d.name+' partiu pra cima do ladrão!','good');
 }else if(c==='track'){
  const sk=DOGS[d.breed].track,R=200+sk*5;let best=null,bd=1e9;
  for(const a of WILD){if(a.st==='dead'||(a.hurt&&a.st!=='dead')){const dd=Math.hypot(a.x-P.x,a.y-P.y);if(dd<R&&dd<bd){bd=dd;best=a}}}
  if(!best)return toast('🐕 '+d.name+' não achou rastro de animal ferido por perto','bad');
  r.st='track';r.tgt=best;toast('🐕 '+d.name+' farejando o rastro...','good');
 }
}
function stepDogs(dt){
 for(const d of S.dogs){
  const r=dogRT(d),def=DOGS[d.breed],act=d.id===S.dogAct;let tx=null,ty=null,spd=def.spd*.7;
  r.cd=Math.max(0,r.cd-dt);r.bark=Math.max(0,r.bark-dt);
  if(act){
   if(r.st==='follow'){const dx=P.x-r.x,dy=P.y-r.y,dd=Math.hypot(dx,dy);if(dd>26){tx=P.x-dx/dd*14;ty=P.y-dy/dd*14;if(dd>90)spd=def.spd*1.2}}
   else if(r.st==='attack'){
    const t=r.tgt;if(!t||t.st==='gone'||t.st==='down'){r.st='follow';r.tgt=null}
    else{tx=t.x;ty=t.y;spd=def.spd*1.35;if(Math.hypot(t.x-r.x,t.y-r.y)<10&&r.cd<=0){r.cd=1.1;biteThief(t,def.bite,d)}}
   }else if(r.st==='track'){
    const a=r.tgt;if(!a||!WILD.includes(a)){r.st='follow';r.tgt=null}
    else{tx=a.x;ty=a.y;spd=def.spd*.9;if(Math.hypot(a.x-r.x,a.y-r.y)<14){r.bark=1;if(r.cd<=0){r.cd=2.5;toast('🐕 '+d.name+' achou! Au au!','good')}tx=null}}
   }
  }else if(d.esc){escortDog(d,r,def,dt);continue}else{
   const t=THV.find(t=>t.st!=='gone'&&t.st!=='down'&&Math.hypot(t.x-r.x,t.y-r.y)<120+def.guard);
   if(t&&def.guard>=40){tx=t.x;ty=t.y;spd=def.spd*1.3;if(Math.hypot(t.x-r.x,t.y-r.y)<10&&r.cd<=0){r.cd=1.1;biteThief(t,def.bite,d)}}
   else{r.wait=(r.wait||0)-dt;if(r.wait<=0){r.wait=rnd(2,6);r.wx=12*TS+rnd(-36,70);r.wy=43*TS+rnd(0,40)}tx=r.wx;ty=r.wy;spd=def.spd*.35;if(Math.hypot(tx-r.x,ty-r.y)<3)tx=null}
  }
  if(tx!==null){const dx=tx-r.x,dy=ty-r.y,dd=Math.hypot(dx,dy)||1;r.x+=dx/dd*spd*dt;r.y+=dy/dd*spd*dt;if(Math.abs(dx)>.5)r.dir=dx>0?1:-1;r.moving=1}else r.moving=0;
 }
}
function drawDog(g,d){
 const r=dogRT(d),def=DOGS[d.breed],x=r.x,y=r.y,dr=r.dir,mv=r.moving?((frame>>3)&1):0,s=def.sz;
 const W=[10,13,16][s],H=[5,7,9][s];
 const f=(col,dx,dy,w,h)=>Rr(g,col,dr>0?x+dx:x-dx-w+1,y+dy,w,h);
 Rr(g,'rgba(0,0,0,.25)',x,y-1,W,2);
 const c=def.col,dk=shade(c,-40);
 f(c,1,-H-1,W-4,H-2);f(def.wh||c,2,-3,W-6,2);f(dk,0,-H-1+(r.moving&&mv?-1:0),2,2);
 f(c,W-4,-H-3,4+s,H-1);f(def.mask||c,W-1,-H-1,2+s,3);f('#111',W+1+s,-H-1,1,1);f(dk,W-3,-H-4,1,2);
 f(dk,2,-2,1,2+(mv?0:-1));f(dk,W-5,-2,1,2+(mv?-1:0));f(dk,4+s,-2,1,2);
 if(def.blk)f(def.blk,2,-H-1,W-6,2);
 if(r.bark>0)Rr(g,'#fff',x+(dr>0?W+2:-6),y-H-6,4,3);
 if(d.id===S.dogAct)Rr(g,'#ffd75e',x+(W>>1),y-H-6,2,2);
}
// ---- ladrões
function nightRoll(){
 const herd=S.herd.length,p=clamp(.04+.005*LV()+.0007*herd+.002*S.chk.n,0,.3)*(1-.25*(S.up.cerca||0))*(1-.3*guardScore()/100)*(1-.2*(S.up.light||0));
 return Math.random()<p;
}
function spawnThief(){
 const useChk=S.up.coop>0&&S.chk.n>0&&(S.herd.length===0||Math.random()<.5);
 if(!useChk&&!S.herd.length)return;
 const ex=3*TS,ey=60*TS;
 THV.push({x:ex,y:ey,st:'approach',tgt:useChk?'chk':'cow',hp:2,loot:0,cow:null,spd:44,seen:false,ex,ey,cd:0,col:pick(['#2a2a2a','#4a3a2a','#2a3a4a'])});
 const gs=guardScore();
 if(gs>=30||S.up.light){S.thiefSeen=1;THV[THV.length-1].seen=true;toast('🐕 Latidos na fazenda! Alguém está rondando...','bad')}
}
function tgtPos(t){
 if(t.tgt==='chk')return{x:53*TS+8,y:57*TS};
 if(t.cow&&S.herd.includes(t.cow))return{x:t.ex,y:t.ey};
 const c=S.herd.filter(a=>!a.led&&a.stall==null&&!a.lead);if(!c.length)return null;
 if(!t.pick||!S.herd.includes(t.pick)||t.pick.led)t.pick=c[Math.floor(Math.random()*c.length)];
 const s=spriteOf(t.pick);return{x:s.x+8,y:s.y+8};
}
function biteThief(t,power,d){
 t.hp-=Math.max(1,power/10);
 if(t.hp<=0)thiefDown(t,'o cão');else{releaseLoot(t);t.st='flee';toast('🐕 '+(d?d.name:'O cão')+' mordeu o ladrão! Ele largou tudo e fugiu.','good')}
}
function releaseLoot(t){
 if(t.cow){t.cow.led=0;t.cow=null}
 if(t.loot){S.chk.n+=t.loot;t.loot=0;syncCH()}
}
function thiefDown(t,by){
 releaseLoot(t);t.st='down';t.dt=0;S.crim.caught++;S.q.cnt.thief=(S.q.cnt.thief||0)+1;
 const bounty=600+LV()*80;cash(bounty,'Recompensa do xerife');gainXP(40,'ladrão');S.rep=Math.min(100,S.rep+1);
 toast('🚔 Ladrão rendido por '+by+'! Xerife pagou '+R$(bounty),'good');
}
function hitThiefPts(pts,w){
 for(const t of THV){
  if(t.st==='gone'||t.st==='down')continue;
  for(const p of pts)if(Math.hypot(p[0]-t.x,p[1]-(t.y-8))<9){
   t.hp-=1;S.thiefSeen=1;
   if(t.hp<=0)thiefDown(t,'você');else{releaseLoot(t);t.st='flee';toast('💥 Acertou o ladrão! Ele largou o roubo e saiu mancando.','good')}
   return true;
  }
 }
 return false;
}
function stepThieves(dt){
 const hr=Math.floor(S.t*24);
 if(hr!==lastHour){
  lastHour=hr;
  if((hr>=22||hr<=4)&&!THV.some(t=>t.st!=='gone')&&nightRoll())spawnThief();
 }
 for(let i=THV.length-1;i>=0;i--){
  const t=THV[i];
  if(t.st==='gone'){THV.splice(i,1);continue}
  if(t.st==='down'){t.dt+=dt;if(t.dt>2.5)t.st='gone';continue}
  const dP=Math.hypot(P.x-t.x,P.y-t.y);if(dP<150&&!t.seen){t.seen=true;toast('👀 Você vê um vulto: ladrão na fazenda!','bad')}
  let tx=null,ty=null,spd=t.spd;
  if(t.st==='approach'){const g=tgtPos(t);if(!g){t.st='flee'}else{tx=g.x;ty=g.y;if(Math.hypot(g.x-t.x,g.y-t.y)<9){
    if(t.tgt==='chk'){const k=Math.min(S.chk.n,ri(1,3));S.chk.n-=k;t.loot=k;syncCH();S.crim.lost+=k;toast('🥷 Ladrão levou '+k+' galinha(s)!','bad')}
    else if(t.pick){t.cow=t.pick;t.cow.led=1;toast('🥷 Ladrão está levando '+t.cow.name+'!','bad')}
    t.st='flee';t.seen=true}}}
  if(t.st==='flee'){tx=t.ex;ty=t.ey;spd=t.spd*1.5;if(Math.hypot(t.ex-t.x,t.ey-t.y)<8){
    if(t.cow&&S.herd.includes(t.cow)){const c=t.cow;S.herd=S.herd.filter(a=>a!==c);SP.delete(c.id);S.crim.lost++;toast('😠 O ladrão fugiu com '+c.name+'!','bad')}
    t.st='gone'}}
  if(tx!==null){const dx=tx-t.x,dy=ty-t.y,dd=Math.hypot(dx,dy)||1;t.x+=dx/dd*spd*dt;t.y+=dy/dd*spd*dt;t.dir=dx>0?1:-1;t.mv=1}
  if(t.cow&&S.herd.includes(t.cow)){const s=spriteOf(t.cow);s.x=t.x-14;s.y=t.y-4;s.go=0;s.wait=1}
 }
}
function drawThief(g,t){
 const x=t.x,y=t.y,st=t.mv?((frame>>3)&1):0;
 Rr(g,'rgba(0,0,0,.3)',x-5,y-1,10,3);
 if(t.st==='down'){Rr(g,t.col,x-7,y-5,14,5);Rr(g,'#e8b890',x+7,y-5,4,4);Rr(g,'#ffd75e',x-2,y-12+(frame>>3&1),3,3);return}
 Rr(g,'#222',x-3,y-6,2,6-(st?1:0));Rr(g,'#222',x+1,y-6,2,5+(st?0:1));
 Rr(g,t.col,x-4,y-14,8,9);Rr(g,'#e8b890',x-3,y-19,6,5);Rr(g,'#111',x-4,y-21,8,3);Rr(g,'#111',x-3,y-17,6,1);
 if(t.loot)Rr(g,'#f4f0e4',x+4,y-9,4,4);
 if(t.seen||t.st!=='approach')Rr(g,'#e33',x-1,y-28,2,5),Rr(g,'#e33',x-1,y-22,2,2);
}
function nightSleepRoll(){
 const hr=S.t*24;if(hr>=5&&hr<22)return;
 const hours=hr>=22?(24-hr)+5:Math.max(0,5-hr);let rolls=Math.ceil(hours/2),msg='';
 for(let i=0;i<rolls;i++){
  if(!nightRoll())continue;
  const gs=guardScore();
  if(Math.random()<gs/130){msg+='🐕 Seus cães afugentaram um ladrão durante a noite. ';gainXP(15,'defesa');continue}
  if(S.up.coop>0&&S.chk.n>0&&(Math.random()<.5||!S.herd.length)){const k=Math.min(S.chk.n,ri(1,3));S.chk.n-=k;S.crim.lost+=k;msg+='🥷 Ladrões levaram '+k+' galinha(s). ';syncCH()}
  else if(S.herd.length){const c=pick(S.herd);S.herd=S.herd.filter(a=>a!==c);SP.delete(c.id);S.crim.lost++;msg+='🥷 Ladrões levaram '+c.name+'! ';}
  break;
 }
 if(msg)toast(msg,msg.includes('afugentaram')&&!msg.includes('levaram')?'good':'bad');
}
function dayCrime(){
 const mh=S.dogs.reduce((m,d)=>Math.max(m,DOGS[d.breed].herd),0);
 if(mh>=60)S.herd.forEach(a=>{a.hp=Math.min(100,a.hp+mh/160)});
}
