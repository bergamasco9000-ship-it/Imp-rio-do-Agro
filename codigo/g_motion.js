// ===== Movimento 2.0: poeira que sai do pé que pisa (cor do chão), pó de neve, respingo de lama e de chuva,
// ===== derrapada ao frear correndo, pegadas que somem devagar (bota e ferradura) e poeira do galope.
const MPRINTS=[],MPART=[];let MPH=null,MSK=0,MV0=0;
const PLIFE={3:35,4:30,5:90,6:60};
const TCOL={0:'176,200,130',1:'150,176,110',3:'204,178,132',4:'218,190,136',5:'244,248,252',6:'96,74,44'};
const terrAt=(x,y)=>{const tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(tx<XMIN||ty<YMIN||tx>=MW||ty>=RZ-1)return -1;return G[ti(tx,ty)]};
function mPuff(x,y,n,c,o){o=o||{};for(let i=0;i<n;i++){if(MPART.length>220)MPART.shift();MPART.push({x:x+rnd(-1.6,1.6),y:y-rnd(0,1.2),vx:(o.vx||0)+rnd(-9,9),vy:rnd(-7,-2)-(o.up||0),t:0,l:rnd(.4,.7)*(o.l||1),c,s:rnd(1.8,2.8)*(o.s||1),k:'p'})}}
function mChip(x,y,n,c,o){o=o||{};for(let i=0;i<n;i++){if(MPART.length>220)MPART.shift();MPART.push({x:x+rnd(-1.4,1.4),y:y-rnd(.5,1.5),vx:(o.vx||0)+rnd(-14,14),vy:rnd(-26,-12)*(o.up||1),t:0,l:rnd(.35,.55),c,s:rnd(.6,1),k:'c',gy:y+rnd(-.5,1.5)})}}
// um pé (ou casco) bateu no chão
function mFoot(alt,ride){const t=terrAt(P.x,P.y);if(t<0||t===2)return;const dir=P.dir,sd=dir>=2,dr=dir===3?1:-1,run=!!P.run;
 let fx=P.x,fy=P.y-.4;
 if(ride){fx+=sd?(alt?-dr*7.5:dr*5):(alt?-2.4:2.4);fy=P.y+(sd?.6:alt?-3:1.5)}
 else if(sd)fx+=dr*(run?2.6:1.8)*(alt?1:.4);else fx+=alt?-1.7:1.6;
 // pegada
 if(PLIFE[t]){MPRINTS.push({x:fx,y:fy,dir,t:0,k:t,ride:!!ride});if(MPRINTS.length>180)MPRINTS.shift()}
 const c=TCOL[t]||TCOL[0],big=ride?1.5:1,back=sd?-dr*(run?14:6):0,rain=S.weather==='chuva'&&t!==5;
 if(t===3||t===4){if(run||ride)mPuff(fx,fy,ride?4:3,c,{vx:back,s:big,l:ride?1.2:1});else if(Math.random()<.6)mPuff(fx,fy,1,c,{s:.9})}
 else if(t===5){mChip(fx,fy,run||ride?4:1,c,{vx:back*.6});if(run||ride)mPuff(fx,fy,1,c,{s:big*.9})}
 else if(t===6){mChip(fx,fy,run||ride?4:2,c,{vx:back*.5,up:.8})}
 else if(run||ride){mChip(fx,fy,2,'96,140,64',{vx:back*.4,up:.7});if(ride||Math.random()<.5)mPuff(fx,fy,1,c,{s:.8*big})}
 if(rain&&(run||ride||Math.random()<.5))mChip(fx,fy,3,'190,214,236',{up:.7})}
function mStep(dt){
 for(let i=MPART.length-1;i>=0;i--){const p=MPART[i];p.t+=dt;if(p.t>p.l){MPART.splice(i,1);continue}
  if(p.k==='p'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=1-dt*3;p.vy*=1-dt*2.5}else{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;if(p.y>p.gy){p.y=p.gy;p.vx*=.5;p.vy=0}}}
 for(let i=MPRINTS.length-1;i>=0;i--){const p=MPRINTS[i];p.t+=dt*(S.weather==='chuva'?2.5:1);if(p.t>(PLIFE[p.k]||30))MPRINTS.splice(i,1)}
 if(inRoom()||P.drive){MPH=null;return}
 const ride=!!(S.horseOn&&S.horse);
 if(P.moving&&!P.aim){const ph=ride?P.ph*1.2*2:P.ph,k=Math.floor((ph-Math.PI/2)/Math.PI);if(MPH!==null&&k!==MPH)mFoot(k&1,ride);MPH=k}else MPH=null;
 // derrapada: vinha rápido e freou forte ou deu meia-volta
 const sp=Math.hypot(P.vx,P.vy);MSK=Math.max(0,MSK-dt);
 if(MV0>95&&(MV0-sp)/Math.max(dt,.001)>700&&MSK<=0){const t=terrAt(P.x,P.y);if(t>=0&&t!==2){MSK=.6;const c=TCOL[t]||TCOL[0],dr=P.dir===3?1:P.dir===2?-1:0;if(t===5||t===6)mChip(P.x,P.y,5,c,{vx:dr*20});mPuff(P.x+dr*2,P.y-.5,ride?5:3,c,{vx:dr*22,s:ride?1.5:1.1})}}
 MV0=sp;
 // cães correndo e bichos fugindo também levantam poeira / neve / lama
 const x0=CX-20,x1=CX+VW+20,y0=CY-20,y1=CY+VH+20,kick=(o,x,y,vx)=>{o._dT=(o._dT||0)-dt;if(o._dT>0)return;o._dT=.14;const t=terrAt(x,y);if(t<0||t===2)return;const c=TCOL[t]||TCOL[0];
  if(t===5||t===6)mChip(x,y,2,c,{vx:-vx*.15});if(t!==0&&t!==1||Math.random()<.3)mPuff(x,y,1,c,{vx:-vx*.2,s:.9})};
 for(const d of S.dogs){const r=dogRT(d);if(r.x<x0||r.x>x1||r.y<y0||r.y>y1){r._lx=r.x;r._ly=r.y;continue}const v=r._lx===undefined?0:Math.hypot(r.x-r._lx,r.y-r._ly)/Math.max(dt,.001);if(v>95)kick(r,r.x,r.y,(r.x-r._lx)/Math.max(dt,.001));r._lx=r.x;r._ly=r.y}
 let nW=0;for(const a of WILD){if(nW>8)break;if(a.st!=='flee'&&a.st!=='charge')continue;if(a.x<x0||a.x>x1||a.y<y0||a.y>y1||a.vis<.3)continue;nW++;kick(a,a.x,a.y,a.dir*120)}}
const _spM=stepPart;stepPart=function(dt){P.dust=9;P.prT=9;_spM(dt);mStep(dt)};
function mDraw(g){for(const p of MPART){const a=1-p.t/p.l;if(p.k==='p'){const s=p.s+p.t*5,al=(a*.72).toFixed(2),c='rgba('+p.c+','+al+')';Rr(g,c,p.x-s/2,p.y-s/4,s,s/2);Rr(g,c,p.x-s/4,p.y-s/2,s/2,s)}
 else Rr(g,'rgba('+p.c+','+(a*.9).toFixed(2)+')',p.x,p.y,p.s,p.s)}}
const _dpM=drawPart;drawPart=function(g){_dpM(g);if(!inRoom())mDraw(g)};
// pegadas no chão (desenhadas junto do chão, embaixo de tudo)
function mPrints(g){if(inRoom()||!MPRINTS.length)return;const x0=CX-8,x1=CX+VW+8,y0=CY-8,y1=CY+VH+8;
 for(const p of MPRINTS){if(p.x<x0||p.x>x1||p.y<y0||p.y>y1)continue;const L=PLIFE[p.k]||30,a=Math.min(1,(1-p.t/L)*1.8);if(a<=0)continue;
  const col=(p.k===5?'rgba(118,138,168,':p.k===6?'rgba(38,26,12,':'rgba(96,66,32,')+((p.k===5?.55:p.k===6?.5:.34)*a).toFixed(2)+')';
  if(p.ride){Rr(g,col,p.x-1.3,p.y-1.2,2.6,.7);Rr(g,col,p.x-1.3,p.y-1.2,.7,2);Rr(g,col,p.x+.6,p.y-1.2,.7,2)}
  else if(p.dir>=2){const f=p.dir===3?1:-1;Rr(g,col,p.x-1.5,p.y-.6,3,1.1);Rr(g,col,p.x+(f>0?1.4:-2.1),p.y-.4,.7,.7)}
  else{Rr(g,col,p.x-.65,p.y-1.6,1.3,2.8);Rr(g,col,p.x-.5,p.y-2.1,1,.5)}}}
const _dfsM=drawFarmStatic;drawFarmStatic=function(g){_dfsM(g);mPrints(g)};
