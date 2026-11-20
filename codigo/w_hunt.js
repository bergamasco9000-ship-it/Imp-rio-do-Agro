const WILD=[],BLOOD=[],SHOTS=[];let WID=0;
const AIM={ang:0,rx:0,ry:0,sx:0,sy:0,t:0,cd:0,relT:0,relTake:0,hold:0,br:3.5,bin:0,kick:0,mx:null,my:null,lure:null,pick:null};
function ensureH(){
 if(!S.h)S.h={lic:0,eq:null,own:{},ammo:{},mag:{},outfit:'casual',outs:{casual:1},gear:{},cons:{scent:0,lure:0,call:0},scentDay:-1,bag:[],xp:0,kills:{},clean:0,wounded:0,fines:0,earned:0};
 if(!S.wind)S.wind={a:rnd(0,6.28),s:.5};
}
const hLvl=()=>Math.floor(Math.sqrt((S.h.xp||0)/60));
const legalSeason=sp=>{const s=SPECIES[sp].season;return !s||s.includes(Math.floor((S.day%360)/30))};
function playerVis(){
 const o=OUTFITS[S.h.outfit],t=G[ti(Math.floor(P.x/TS),Math.floor(P.y/TS))],terr=t===1?1:t===3?.35:.5;
 let v=1-o.camo*terr;if(!P.moving)v*=.55;if(P.sneak)v*=.8;if(P.aim)v*=.9;return clamp(v,.08,1);
}
function noiseR(){
 let n=P.moving?(P.run?110:P.sneak?18:55):8;if(S.h.gear.boots)n*=.75;if(S.weather==='chuva')n*=.75;return n;
}
const scentMul=()=>S.h.scentDay===S.day?.5:1;
function spawnWild(spk,force){
 for(let k=0;k<50;k++){
  const rc=bioRect(SPECIES[spk].bio),tx=ri(rc[0],rc[2]),ty=ri(rc[1],rc[3]);if(G[ti(tx,ty)]!==rc[4]||SOL[ti(tx,ty)])continue;
  const x=tx*TS+8,y=ty*TS+8;if(!force&&Math.hypot(x-P.x,y-P.y)<240)continue;
  const sp=SPECIES[spk],male=Math.random()<.55;
  const a={id:++WID,sp:spk,x,y,dir:Math.random()<.5?1:-1,st:'idle',al:0,hp:sp.hp*rnd(.9,1.1),kg:rnd(sp.w[0],sp.w[1]),male,pts:male?ri(4,16):0,wait:rnd(1,6),tx:x,ty:y,ft:0,fa:0,bleed:0,hitQ:'',vis:0,dt:0,hurt:0,cd:0,bt:0};
  WILD.push(a);return a;
 }
}
function spawnAll(){Object.keys(SPECIES).forEach(k=>{for(let i=0;i<SPECIES[k].cnt;i++)spawnWild(k,0)})}
function hookDay(){
 ensureH();ensureG();dayFarm();dayCrime();genOffers();if(S.patrol&&S.day%30===0)cash(-1500,'Patrulha noturna');
 const cnt={};WILD.forEach(a=>{if(a.st!=='dead')cnt[a.sp]=(cnt[a.sp]||0)+1});
 Object.keys(SPECIES).forEach(k=>{const miss=SPECIES[k].cnt-(cnt[k]||0);for(let i=0;i<miss&&i<2;i++)if(Math.random()<.6)spawnWild(k,0)});
 S.wind.a+=gauss()*.6;S.wind.s=clamp(S.wind.s+gauss()*.15,.1,1);
 if(S.h.lic&&S.h.lic-S.day===10)toast('Sua licença de caça vence em 10 dias');
}
function wmove(a,vx,vy,dt){
 const nx=a.x+vx*dt,ny=a.y+vy*dt,rc=bioRect(SPECIES[a.sp].bio),wt=SPECIES[a.sp].water,ok=(x,y)=>{const tx=Math.floor(x/TS),ty=Math.floor(y/TS);return tx>=rc[0]&&ty>=rc[1]&&tx<=rc[2]&&ty<=rc[3]&&!SOL[ti(tx,ty)]&&(G[ti(tx,ty)]!==2||wt)};
 let moved=0;if(ok(nx,a.y)){a.x=nx;moved=1}if(ok(a.x,ny)){a.y=ny;moved=1}return moved;
}
function alarm(a,fromX,fromY){
 a.al=1.3;a.st='flee';a.ft=rnd(4,8);a.fa=Math.atan2(a.y-fromY,a.x-fromX)+rnd(-.5,.5);
}
function killWild(a){
 if(a.st==='dead')return;a.st='dead';a.dt=0;a.bleed=0;
 if(!legalSeason(a.sp)){const f=2500;cash(-f,'Multa: caça fora de temporada');S.h.fines+=f;S.rep=Math.max(0,S.rep-2);toast('🚔 Guarda florestal: caça fora de temporada! Multa de '+R$(f),'bad')}
}
function stepWild(dt){
 const dlv=daylight(),hr=S.t*24,act=(hr>5&&hr<9)||(hr>16&&hr<20)?1:(dlv<.2?.3:.6);
 const vm=playerVis(),nr=noiseR()*(AIM.bin?.7:1),wx=Math.cos(S.wind.a),wy=Math.sin(S.wind.a);
 const sight=(dlv<.25?75:175)*(S.h.gear.binoc&&AIM.bin?1.9:1);
 const lure=AIM.lure;if(lure){lure.t-=dt;if(lure.t<=0)AIM.lure=null}
 for(let i=WILD.length-1;i>=0;i--){
  const a=WILD[i],sp=SPECIES[a.sp],dx=P.x-a.x,dy=P.y-a.y,d=Math.hypot(dx,dy)||1;
  const tv=clamp(1-(d-sight*.55)/(sight*.45),0,1);a.vis+=(tv-a.vis)*Math.min(1,dt*6);
  if(a.st==='dead'){a.dt+=dt;if(a.dt>1200)WILD.splice(i,1);continue}
  if(a.bleed>0){a.hp-=a.bleed*dt;a.bleed=Math.max(.8,a.bleed-dt*.4);a.bt+=dt;if(a.bt>.35){a.bt=0;BLOOD.push({x:a.x+rnd(-2,2),y:a.y+rnd(-1,2),a:1});if(BLOOD.length>400)BLOOD.shift()}
   if(a.hp<=0){killWild(a);continue}}
  if((a.held&&a.held.length)||a.st==='bay'||a.st==='held')continue;
  let add=0;
  const face=a.dir>0?0:Math.PI,ang=Math.atan2(dy,dx);let df=Math.abs(ang-face);df=Math.min(df,6.283-df);
  const vr=sp.vis*(S.weather==='chuva'?.8:1)*(dlv<.25?.6:1);
  if((df<2||a.st==='alert')&&d<vr)add+=(1-d/vr)*vm*1.7;
  const cw=(-dx/d)*wx+(-dy/d)*wy;
  if(cw>.25){const sr=sp.smell*(.35+.65*cw)*(.5+S.wind.s)*scentMul();if(d<sr)add+=(1-d/sr)*1.5}
  const hr2=Math.min(sp.hear*(S.weather==='chuva'?.7:1),nr);if(d<hr2)add+=(1-d/hr2)*1.9;
  const lured=lure&&((lure.sp==='deer'&&(a.sp==='deer'||a.sp==='elk'))||lure.sp===a.sp)&&Math.hypot(lure.x-a.x,lure.y-a.y)<420&&a.st!=='flee';
  if(lured)add*=.35;
  a.al=clamp(a.al+(add?add*dt:-.2*dt),0,1.3);
  if(sp.aggr&&a.st!=='charge'&&a.st!=='flee'&&a.al>=1&&d<sp.aggr){a.st='charge';a.cd=.4}else if(a.st!=='charge'&&a.st!=='flee'&&a.al>=1)alarm(a,P.x,P.y);
  else if(a.st==='idle'&&a.al>.5){a.st='alert';a.wait=3}
  else if(a.st==='alert'&&a.al<.25)a.st='idle';
  if(a.st==='alert'){a.dir=dx>0?1:-1;continue}
  if(a.st==='flee'){
   a.ft-=dt;const spd=sp.flee*.65*(a.stam===undefined?1:(.35+.65*a.stam));
   if(!wmove(a,Math.cos(a.fa)*spd,Math.sin(a.fa)*spd,dt))a.fa+=1.6+rnd(0,1);
   a.dir=Math.cos(a.fa)>0?1:-1;
   if(a.ft<=0&&!a.hurt){a.st='idle';a.al=.2;a.wait=rnd(2,6)}
   else if(a.ft<=0)a.ft=3;
   if(a.hurt&&(a.sp==='boar'||sp.aggr)&&a.hp>0){a.st='charge'}
   continue;
  }
  if(a.st==='charge'){
   const sp2=sp.chg||70;if(!a.hurt&&d>(sp.aggr||200)*2.4){a.st='idle';a.al=.3;continue}a.dir=dx>0?1:-1;wmove(a,dx/d*sp2,dy/d*sp2,dt);a.cd-=dt;
   if(d<13&&a.cd<=0){a.cd=1.5;const dm=Math.round((sp.dmg||20)*(sp.venom&&S.h.gear.boots?.5:1));P.hp-=dm;P.hurt=.7;if(sp.venom)P.pois=Math.max(P.pois||0,22);toast('⚠️ '+sp.n+' te atacou! (-'+dm+' vida'+(sp.venom?', envenenado! use o soro 💉':'')+')','bad')}
   continue;
  }
  if(lured){a.st='idle';const ld=Math.hypot(lure.x-a.x,lure.y-a.y);if(ld>40){wmove(a,(lure.x-a.x)/ld*sp.spd*.9,(lure.y-a.y)/ld*sp.spd*.9,dt);a.dir=lure.x>a.x?1:-1;continue}}
  if(a.wait>0){a.wait-=dt*act;continue}
  const tdx=a.tx-a.x,tdy=a.ty-a.y,td=Math.hypot(tdx,tdy);
  if(td<3){a.wait=rnd(3,12);const g=rnd(0,6.28),r=rnd(30,110);a.tx=a.x+Math.cos(g)*r;a.ty=a.y+Math.sin(g)*r;a.ty=a.ty}
  else{if(!wmove(a,tdx/td*sp.spd,tdy/td*sp.spd,dt)){a.tx=a.x;a.ty=a.y}a.dir=tdx>0?1:-1}
 }
 for(const b of BLOOD)b.a-=dt/240;
 while(BLOOD.length&&BLOOD[0].a<=0)BLOOD.shift();
}
function huntLegal(){
 if(!S.h.lic||S.h.lic<=S.day){toast('Você precisa de uma licença de caça válida (Loja do Caçador)','bad');return false}
 if(inTown()&&!THV.some(t=>thActive(t))){toast('Proibido atirar na vila ou perto da sede! Só pode atirar em javali e capivara que estiverem comendo a lavoura. Para caçar, vá para a mata.','bad');return false}
 return true;
}
function snd(kind){
 try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();AC.resume&&AC.resume();
  const bow=kind==='bow',len=bow?.12:.5,b=AC.createBuffer(1,Math.floor(AC.sampleRate*len),AC.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,bow?3:2.2);
  const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=bow?3200:1300;
  const gn=AC.createGain();gn.gain.value=bow?.15:.5;s.connect(f);f.connect(gn);gn.connect(AC.destination);s.start();}catch(e){}
}
let AC=null;
function startReload(){
 const id=S.h.eq,w=WEAPONS[id];if(!w||AIM.relT>0)return;
 const need=w.cap-(S.h.mag[id]||0),have=S.h.ammo[w.ammo]||0,take=Math.min(need,have);
 if(need<=0)return;if(take<=0)return toast('Sem munição! Compre na Loja do Caçador.','bad');
 AIM.relT=w.rel*(1+take*.12);AIM.relTake=take;toast('Recarregando...');
}
function fire(){
 const id=S.h.eq,w=WEAPONS[id];if(!w||!P.aim)return;
 if(AIM.cd>0||AIM.relT>0)return;if(!huntLegal())return;
 if((S.h.mag[id]||0)<=0){startReload();return}
 S.h.mag[id]--;AIM.cd=w.rel;AIM.kick=.7;
 const ix=AIM.rx+AIM.sx,iy=AIM.ry+AIM.sy,d=Math.hypot(ix-P.x,iy-P.y);
 const pts=[];for(let i=0;i<w.pellets;i++)pts.push([ix+gauss()*w.spread*d,iy+gauss()*w.spread*d]);
 SHOTS.push({pts,t:d/w.speed,w,d});
 snd(id==='bow'?'bow':'gun');
}
function resolveShots(dt){
 for(let i=SHOTS.length-1;i>=0;i--){
  const s=SHOTS[i];s.t-=dt;if(s.t>0)continue;SHOTS.splice(i,1);
  if(hitThiefPts(s.pts,s.w))continue;
  let res='miss',hit=null,w0=s.w;
  const hitSet=new Set();
  for(const a of WILD){
   if(a.st==='dead')continue;const sp=SPECIES[a.sp];let dmg=0,vital=0,n=0;
   for(const p of s.pts){
    const d=Math.hypot(p[0]-a.x,p[1]-(a.y-sp.sz*4)),fall=clamp(1.15-s.d/s.w.range*.55,.25,1.1);
    if(d<=sp.vr*1.35){vital=1;dmg+=s.w.power*1.7*fall;n++}else if(d<=sp.br*1.35){dmg+=s.w.power*.7*fall;n++}
   }
   if(!n)continue;
   hit=a;a.hp-=dmg;a.hurt=1;a.hitQ=vital?'vital':(a.hitQ||'body');
   a.bleed=Math.max(a.bleed,vital?9:1.5+dmg/25);alarm(a,P.x,P.y);a.ft=6;
   res=vital?'vital':'body';
   if(a.hp<=-sp.hp*.3||(vital&&dmg>=sp.hp*1.2)){killWild(a)}
   break;
  }
  for(const a of WILD){if(a.st==='dead'||a===hit)continue;const dd=Math.hypot(a.x-P.x,a.y-P.y);if(dd<w0.noise*.9)alarm(a,P.x,P.y);else if(dd<w0.noise*1.6)a.al=Math.min(1.2,a.al+.5)}
  if(res==='vital')toast('🎯 Tiro certeiro no coração/pulmão!','good');
  else if(res==='body')toast('Atingiu o animal... ele fugiu ferido. Siga o rastro de sangue!','bad');
  else toast('Errou o tiro');
  if(res==='body')S.h.wounded++;
 }
}
function useItem(k){
 if(!S.h.cons[k])return toast('Você não tem este item','bad');
 if(k==='scent'){if(S.h.scentDay===S.day)return toast('Já está com o odor neutralizado hoje');S.h.scentDay=S.day;toast('🧪 Odor neutralizado pelo resto do dia','good')}
 else{AIM.lure={x:P.x,y:P.y,t:45,sp:k==='lure'?'deer':'turkey'};toast(k==='lure'?'Atrativo espalhado: fique parado e em silêncio...':'Chamariz soando... fique quieto!')}
 S.h.cons[k]--;
}
function carcassValue(c){
 const sp=SPECIES[c.sp];let v=c.kg*sp.price*c.q;
 if(sp.bounty)v+=sp.bounty*c.q;
 if(c.sp==='deer'&&c.pts>9)v+=(c.pts-9)*380*c.q;
 if(c.sp==='elk'&&c.pts>10)v+=(c.pts-10)*900*c.q;
 return Math.round(v);
}
function startPick(a){if(P.moving)return;AIM.pick={a,t:0,T:1.6+a.kg/60}}
function finishPick(){
 const a=AIM.pick.a;AIM.pick=null;const sp=SPECIES[a.sp];
 const q=(a.hitQ==='vital'?1:.72)*Math.max(.5,1-a.dt/500);
 S.h.bag.push({sp:a.sp,kg:Math.round(a.kg*.72*10)/10,q:Math.round(q*100)/100,pts:a.pts,male:a.male});
 const i=WILD.indexOf(a);if(i>=0)WILD.splice(i,1);
 S.h.xp+=sp.xp*(a.hitQ==='vital'?1.2:.7);gainXP(sp.xp*.6,'caça');S.h.kills[a.sp]=(S.h.kills[a.sp]||0)+1;if(a.hitQ==='vital')S.h.clean++;
 P.carry=S.h.bag.reduce((s,c)=>s+c.kg,0);
 toast('🦌 '+sp.n+' coletado ('+Math.round(a.kg*.72)+' kg'+(a.pts>=10?' · troféu '+a.pts+' pontas':'')+'). Leve à Loja do Caçador.','good');
}
function huntInteracts(L){
 for(const a of WILD)if(a.st==='dead')L.push({x:a.x,y:a.y,r:22,label:'Coletar '+SPECIES[a.sp].n+' ('+Math.round(a.kg*.72)+' kg)',fn:()=>startPick(a)});
}
function updateHunt(dt,inp){
 const w=WEAPONS[S.h.eq];
 AIM.t+=dt;AIM.cd=Math.max(0,AIM.cd-dt);AIM.kick=Math.max(0,AIM.kick-dt);
 if(AIM.relT>0){AIM.relT-=dt;if(AIM.relT<=0){S.h.mag[S.h.eq]=(S.h.mag[S.h.eq]||0)+AIM.relTake;S.h.ammo[w.ammo]-=AIM.relTake;toast('Recarregado')}}
 if(P.aim&&w){
  const mv=inp.mag>.1?inp:null;
  if(AIM.mx!==null){AIM.rx=AIM.mx;AIM.ry=AIM.my}
  if(mv){AIM.rx+=inp.x*110*dt;AIM.ry+=inp.y*110*dt;AIM.mx=null}
  let ddx=AIM.rx-P.x,ddy=AIM.ry-P.y,d=Math.hypot(ddx,ddy);const mr=w.range*1.1;
  if(d>mr){AIM.rx=P.x+ddx/d*mr;AIM.ry=P.y+ddy/d*mr;d=mr}
  if(d<20){AIM.rx=P.x+(ddx||1)/(d||1)*20;AIM.ry=P.y+(ddy||0)/(d||1)*20;d=20}
  AIM.ang=Math.atan2(AIM.ry-P.y,AIM.rx-P.x);
  P.dir=Math.abs(Math.cos(AIM.ang))>Math.abs(Math.sin(AIM.ang))?(Math.cos(AIM.ang)>0?3:2):(Math.sin(AIM.ang)>0?0:1);
  let A=(.8+d*.018)*w.stab*(1-clamp(hLvl()*.04,0,.3));
  if(P.sneak)A*=.7;if(P.moving)A*=2.2;if(AIM.kick>0)A*=2;if(S.h.gear.pack&&false)A*=1;
  if(AIM.hold&&AIM.br>0){A*=.2;AIM.br-=dt}else if(AIM.hold){A*=1.8}else AIM.br=Math.min(3.5,AIM.br+dt*.9);
  AIM.sx=(Math.sin(AIM.t*1.7)+.5*Math.sin(AIM.t*3.9+1))*A;AIM.sy=(Math.cos(AIM.t*1.3)+.5*Math.sin(AIM.t*4.3))*A;
 }
}
function drawWild(g,a){
 const sp=SPECIES[a.sp],x=a.x,y=a.y,d=a.dir>0?1:-1,mv=a.st==='flee'||a.st==='charge'?((frame>>2)&1):(a.wait>0?0:((frame>>3)&1));
 const c=sp.col,dk=shade(c,-45),lt=shade(c,45);
 const dead=a.st==='dead';g.save();g.globalAlpha=Math.min(1,a.vis*1.2);
 if(dead){g.translate(0,y-2);g.scale(1,-1);g.translate(0,-(y-2))}
 const W=WSZ[a.sp]||(a.sp==='elk'?22:a.sp==='deer'?16:a.sp==='boar'?15:a.sp==='turkey'?11:8);
 const r=(col,dx,dy,w,h)=>Rr(g,col,d>0?x+dx-(W>>1):x-dx-w+1+(W>>1),y+dy,w,h);
 Rr(g,'rgba(0,0,0,.25)',x-(W>>1)+1,y-1,W-2,2);
 const leg=(dx,h,i)=>r(dk,dx,-h,1,h+(((i+mv)&1)&&!dead?-1:0));
 if(a.sp==='deer'||a.sp==='whitedeer'){
  r(c,2,-8,9,5);r(lt,3,-4,7,1);r(c,10,-12,3,6);r(c,12,-13,4,3);r('#222',15,-12,1,1);r(dk,11,-14,1,2);
  [3,5,9,11].forEach((dx,i)=>leg(dx,4,i));
  r('#fff',a.st==='flee'?0:1,a.st==='flee'?-10:-8,a.st==='flee'?3:2,a.st==='flee'?4:2);
  if(a.male&&a.pts>0){r('#e8dcc0',12,-17,1,4);r('#e8dcc0',14,-17,1,4);for(let i=0;i<a.pts/4;i++){r('#e8dcc0',11+(i&1)*4-(i>>1),-17-(i>>1)-1,1,2)}}
 }else if(a.sp==='elk'){
  r(c,3,-13,12,7);r(lt,4,-7,10,1);r(c,14,-19,4,9);r(c,16,-21,5,4);r('#222',20,-20,1,1);r(dk,3,-13,12,2);
  [4,7,12,14].forEach((dx,i)=>leg(dx,6,i));r('#e8dcc0',3,-12,2,2);
  if(a.male){r('#e8dcc0',16,-28,1,7);r('#e8dcc0',19,-28,1,7);r('#e8dcc0',13,-27,4,1);r('#e8dcc0',19,-27,4,1);r('#e8dcc0',14,-30,1,3);r('#e8dcc0',21,-30,1,3)}
 }else if(a.sp==='boar'){
  r(c,2,-8,9,6);r(dk,3,-10,6,2);r(c,10,-8,4,5);r(shade(c,-25),13,-6,2,2);r('#f2ecd8',13,-4,1,1);[3,5,8,10].forEach((dx,i)=>leg(dx,3,i));r(dk,0,-8,2,1);r('#111',12,-8,1,1);
 }else if(a.sp==='turkey'){
  r(shade(c,25),0,-10,3,7);r(c,2,-7,6,5);r('#c0392b',8,-11,2,3);r(c,7,-10,2,5);r('#b06a3a',4,-2,1,2);r('#b06a3a',6,-2+(mv?-1:0),1,2);
 }else if(WDRAW[a.sp]){WDRAW[a.sp](r,a,c,dk,lt,leg,mv)
 }else{
  r(c,1,-4,5,3);r(c,5,-5,3,3);r(c,6,-8,1,3);r(c,7,-8,1,3);r('#fff',0,-4,1,1);r(dk,2,-1,1,1);r(dk,5,-1,1,1);
 }
 g.restore();g.globalAlpha=1;
 if(a.st==='alert'&&!dead){Rr(g,'#ffd75e',x-1,y-22,2,5);Rr(g,'#ffd75e',x-1,y-15,2,2)}
 if(dead){Rr(g,'rgba(150,15,10,.7)',x-4,y,9,3)}
}
function drawHuntOverlay(g){
 if(AIM.lure)for(let i=0;i<8;i++){const an=i*.785+AIM.t;Rr(g,'rgba(255,255,255,.35)',AIM.lure.x+Math.cos(an)*(6+(frame%30)/3),AIM.lure.y+Math.sin(an)*(6+(frame%30)/3),1,1)}
 if(AIM.bin&&S.h.gear.binoc){
  for(const a of WILD){if(a.st==='dead'||a.vis<.3)continue;const d=Math.hypot(a.x-P.x,a.y-P.y);if(d>380)continue;
   Rr(g,'#ffd75e',a.x-10,a.y-22,1,4);Rr(g,'#ffd75e',a.x+10,a.y-22,1,4);Rr(g,'#ffd75e',a.x-10,a.y+2,1,4);Rr(g,'#ffd75e',a.x+10,a.y+2,1,4);
   g.fillStyle='#fff';g.font='6px monospace';g.fillText(SPECIES[a.sp].n+' '+Math.round(d/TS)+'m',a.x-14,a.y-25)}
 }
}
function drawAimOverlay(g){
 if(AIM.bin&&S.h.gear.binoc){const gr=g.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.25,VW/2,VH/2,Math.min(VW,VH)*.55);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.85)');g.fillStyle=gr;g.fillRect(0,0,VW,VH)}
 if(!P.aim||!S.h.eq)return;
 const w=WEAPONS[S.h.eq],ox=CX,oy=CY,rx=AIM.rx+AIM.sx-ox,ry=AIM.ry+AIM.sy-oy;
 if(w.scope){const gr=g.createRadialGradient(rx,ry,26,rx,ry,60);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.7)');g.fillStyle=gr;g.fillRect(0,0,VW,VH)}
 const c=AIM.cd>0||AIM.relT>0?'rgba(255,90,70,.95)':'rgba(255,255,255,.95)';
 Rr(g,c,rx-8,ry,5,1);Rr(g,c,rx+4,ry,5,1);Rr(g,c,rx,ry-8,1,5);Rr(g,c,rx,ry+4,1,5);Rr(g,'rgba(255,60,40,.9)',rx,ry,1,1);
 const d=Math.hypot(AIM.rx-P.x,AIM.ry-P.y);g.fillStyle='#fff';g.font='6px monospace';g.fillText(Math.round(d/TS)+' m',rx+8,ry+12);
 if(AIM.relT>0)g.fillText('recarregando',rx-18,ry-12);
}
