// ===== Polícia abate bicho na vila, carros fazem curva/retorno em vez de sumir, legítima defesa
// ---------- TRÂNSITO: no fim da estrada o carro entra na estrada que cruza ou faz o retorno; só some fora do mapa ou longe da tela
const trfEndS=v=>{const r=TRT[v.r];return v.dir>0?r.b:r.a};
const trfEdge=(x,y)=>x<=XMIN+5||x>=MW-6||y<=YMIN+5||y>=RZ-8;
function trfPlan(v){const r=TRT[v.r],e=trfEndS(v),P0=trfPos({r:v.r,dir:v.dir,s:e}),ex=r.h?e:r.c,ey=r.h?r.c:e,opts=[];
 for(let j=0;j<TRT.length;j++){const q=TRT[j];if(j===v.r||q.h===r.h)continue;if(v.k==='car'&&!q.h)continue;// carro de passeio só anda nas estradas de leste-oeste
  const near=q.h?Math.abs(q.c-ey)<5*TS&&ex>q.a-3*TS&&ex<q.b+3*TS:Math.abs(q.c-ex)<3*TS&&ey>q.a-5*TS&&ey<q.b+5*TS;if(!near)continue;
  const ns=clamp(q.h?ex:ey,q.a,q.b);for(const nd of[1,-1])if((nd>0?q.b-ns:ns-q.a)>5*TS)opts.push({j,nd,ns})}
 if(opts.length){const o=pick(opts),P2=trfPos({r:o.j,dir:o.nd,s:o.ns});return{x0:P0.x,y0:P0.y,cx:r.h?P2.x:P0.x,cy:r.h?P0.y:P2.y,x2:P2.x,y2:P2.y,j:o.j,nd:o.nd,ns:o.ns,t:0}}
 if(trfEdge(Math.floor(ex/TS),Math.floor(ey/TS)))return null;
 const P2=trfPos({r:v.r,dir:-v.dir,s:e});// retorno
 return{x0:P0.x,y0:P0.y,cx:r.h?P0.x+v.dir*34:(P0.x+P2.x)/2,cy:r.h?(P0.y+P2.y)/2:P0.y+v.dir*34,x2:P2.x,y2:P2.y,j:v.r,nd:-v.dir,ns:e,t:0}}
const _tpF3=trfPos;trfPos=function(v){const T=v.turn;if(!T)return _tpF3(v);const t=T.t,u=1-t,x=u*u*T.x0+2*u*t*T.cx+t*t*T.x2,y=u*u*T.y0+2*u*t*T.cy+t*t*T.y2,dx=2*u*(T.cx-T.x0)+2*t*(T.x2-T.cx),dy=2*u*(T.cy-T.y0)+2*t*(T.y2-T.cy);
 let dir=Math.abs(dx)>=Math.abs(dy)*.8?(dx>0?3:2):(dy>0?0:1);if(v.k==='car')dir=dx>.01?3:dx<-.01?2:(T.dl||3);T.dl=dir;return{x,y,dir}};
stepTraffic=function(dt){
 if(inRoom())return;trfT-=dt;if(trfT<=0){trfT=rnd(2.2,5);if(TRF.length<5)trfSpawn()}
 const OB=trfObstacles();
 for(let i=TRF.length-1;i>=0;i--){const v=TRF[i],r=TRT[v.r],p=trfPos(v);
  if(v.turn){const T=v.turn;let tgt=v.v*.45;if(Math.hypot(P.x-p.x,P.y-p.y)<26)tgt=0;for(const o of OB)if(typeof o[2]==='object'&&Math.hypot(o[0]-p.x,o[1]-p.y)<22)tgt=0;
   const cs=v.cs===undefined?tgt:v.cs;v.cs=tgt<cs?Math.max(tgt,cs-150*dt):Math.min(tgt,cs+38*dt);v.mv=v.cs>1;
   const len=T.len||(T.len=Math.hypot(T.cx-T.x0,T.cy-T.y0)+Math.hypot(T.x2-T.cx,T.y2-T.cy)+1);T.t=Math.min(1,T.t+v.cs*dt/len);
   if(T.t>=1){v.r=T.j;v.dir=T.nd;v.s=T.ns;v.turn=null}continue}
  const ahead=(ax,ay)=>r.h?(ax-p.x)*v.dir:(ay-p.y)*v.dir,lat=(ax,ay)=>r.h?Math.abs(ay-p.y):Math.abs(ax-p.x),L=v.k==='truck'?84:v.k==='car'?50:44;
  const tx=Math.floor(p.x/TS),ty=Math.floor(p.y/TS);let tgt=v.v*(TOWNZ(tx,ty)?.45:1);let block=null;
  for(const o of OB){const a=ahead(o[0],o[1]);if(a<-6||a>L+70)continue;if(lat(o[0],o[1])>15)continue;if(a<L+18){tgt=0;block=o;break}tgt=Math.min(tgt,v.v*.3)}
  for(const w of TRF)if(w!==v&&!w.turn&&w.r===v.r&&w.dir===v.dir){const d=(w.s-v.s)*v.dir;if(d>0&&d<L+34)tgt=Math.min(tgt,d<L+16?0:(w.cs||w.v))}
  // freia chegando no fim da estrada (curva ou retorno)
  if(!v.edge){const left=(trfEndS(v)-v.s)*v.dir;if(left<70)tgt=Math.min(tgt,Math.max(v.v*.45,left))}
  if(block&&block[2]==='p'){v.hk-=dt;if(v.hk<=0){v.hk=4;honk(v.k==='truck');tt('honk','🚚 Bi-biii! Saia da estrada!','bad',6)}}
  if(block&&typeof block[2]==='object'){v.wt=(v.wt||0)+dt;if(v.wt>1.6){const q=block[2];const lane=p.y;q.tx=q.x;q.ty=(q.y<=lane?q.y-22:q.y+22);q.wait=0;v.wt=0}}else v.wt=0;
  const cs=v.cs===undefined?tgt:v.cs;v.cs=tgt<cs?Math.max(tgt,cs-150*dt):Math.min(tgt,cs+38*dt);
  v.s+=v.dir*v.cs*dt;v.mv=v.cs>1;
  if(!v.edge&&(v.dir>0?v.s>=r.b:v.s<=r.a)){const pl=trfPlan(v);if(pl){v.s=trfEndS(v);v.turn=pl}else v.edge=1}
  const q=trfPos(v);if(q.x<XMIN*TS-80||q.x>WW+80||q.y<YMIN*TS-80||q.y>RZ*TS+80||Math.hypot(q.x-P.x,q.y-P.y)>900)TRF.splice(i,1)}};
// ---------- POLÍCIA: bicho que entra na vila é abatido pela PM
const COPS=[];let copScan=0;const COPN=['Soldado Silva','Cabo Nogueira','Sargento Lima','Soldado Rocha','Cabo Andrade','Soldado Pires'];
const wildTown=a=>TOWNZ(Math.floor(a.x/TS),Math.floor(a.y/TS));
function copHome(){const d=BLD.find(b=>b.id==='delegacia');return d?{x:(d.door+.5)*TS,y:(d.y+d.h)*TS+10}:{x:132*TS,y:47*TS}}
function copSpawn(a){const h=copHome(),dx=h.x-a.x,dy=h.y-a.y,d=Math.hypot(dx,dy)||1,far=Math.min(d,(typeof VW!=='undefined'?VW/2:220)+30);
 const pd=Math.hypot(P.x-a.x,P.y-a.y);// chega correndo do lado da delegacia, de fora da tela se ela for longe
 const sx=d>far?a.x+dx/d*far:h.x,sy=d>far?a.y+dy/d*far:h.y;
 const n=COPN.filter(x=>!COPS.some(c=>c.n===x));COPS.push({x:sx,y:sy,tgt:a,st:'run',cd:.6,ph:0,dir:0,n:pick(n.length?n:COPN),flash:0,tr:null,shots:0});
 if(pd<420)tt('cop'+a.id,'🚔 PM: “Deixa com a gente, patrão! Sai de perto do bicho!”','',8)}
function stepCops(dt){if(inRoom())return;
 copScan-=dt;if(copScan<=0){copScan=.5;for(const a of WILD){if(a.st==='dead'||a.cop||!wildTown(a))continue;const sp=SPECIES[a.sp];if(!sp)continue;
   if(sp.aggr||a.st==='charge'||a.hurt||Math.hypot(a.x-P.x,a.y-P.y)<300){a.cop=1;copSpawn(a);if(sp.aggr&&Math.random()<.6){a.cop=2;copSpawn(a)}}}}
 for(let i=COPS.length-1;i>=0;i--){const c=COPS[i],a=c.tgt;c.flash=Math.max(0,c.flash-dt);if(c.tr)c.tr.t-=dt;
  if(c.st!=='back'&&(!a||a.st==='dead'||WILD.indexOf(a)<0))c.st='back';
  if(c.st!=='back'&&a&&!wildTown(a)&&Math.hypot(a.x-c.x,a.y-c.y)>220){c.st='back';a.cop=0}// bicho fugiu da vila: PM desiste
  if(c.st==='run'){const dx=a.x-c.x,dy=a.y-c.y,d=Math.hypot(dx,dy)||1;c.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1);
   if(d>78){const s=118*dt;c.x+=dx/d*s;c.y+=dy/d*s;c.ph+=dt*14;c.mv=1}else{c.st='aim';c.cd=.45;c.mv=0}}
  else if(c.st==='aim'){const dx=a.x-c.x,dy=a.y-6-c.y,d=Math.hypot(dx,dy)||1;c.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1);c.mv=0;c.ang=Math.atan2(dy,dx);
   if(d>140){c.st='run';continue}
   c.cd-=dt;if(c.cd<=0){c.cd=rnd(.55,.9);c.shots++;c.flash=.08;snd('gun');if(typeof wake==='function')try{wake(c.x,c.y,300)}catch(e){}
    const hit=Math.random()<.85;c.tr={x:a.x+(hit?0:rnd(-14,14)),y:a.y-6+(hit?0:rnd(-10,10)),t:.07};
    if(hit){a.hp-=rnd(38,60);a.hurt=1;a.bleed=Math.max(a.bleed||0,2);if(typeof BLOOD!=='undefined')BLOOD.push({x:a.x,y:a.y,a:1});
     if(a.hp<=0){a.st='dead';a.dt=1140;a.bleed=0;a.pol=1;const sp=SPECIES[a.sp];toast('🚔 '+c.n+' abateu '+(sp?'o(a) '+sp.n.toLowerCase():'o bicho')+' na vila. “Tá tudo certo, pessoal!”','good');S.stats&&(S.stats.policeKill=(S.stats.policeKill||0)+1)}}}}
  else{const h=copHome(),dx=h.x-c.x,dy=h.y-c.y,d=Math.hypot(dx,dy)||1;c.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1);c.mv=1;c.ph+=dt*9;const s=60*dt;c.x+=dx/d*s;c.y+=dy/d*s;
   if(d<10||Math.hypot(c.x-P.x,c.y-P.y)>700)COPS.splice(i,1)}}}
function drawCop(g,c){OL(g,c.x,c.y+3,30,42,k=>{drawPerson(k,{x:c.x,y:c.y,dir:c.dir,ph:c.ph,mv:c.mv,shirt:'#3a4a6a',hair:'#1a1a1a',pants:'#1e2638'});
  const side=c.dir>=2,d=c.dir===3?1:-1;Rr(k,'#1e2638',c.x-4.5,c.y-23,9,3);Rr(k,'#141a28',c.x-(side?(d>0?-1:5):5),c.y-21,side?5:10,1.2);Rr(k,'#e8c040',c.x-1,c.y-22.5,2,1.5);
  Rr(k,'#1a1a1a',c.x-4,c.y-7,8,1.2);if(c.dir===0)Rr(k,'#e8c040',c.x+1.5,c.y-13,1.5,1.5);
  if(c.st==='aim'){const a=c.ang||0,flip=Math.cos(a)<0,gx=c.x+Math.cos(a)*5,gy=c.y-10+Math.sin(a)*4;gunAt(k,'grz17',gx,gy,a,.55,flip);
   if(c.flash>0){const mx=gx+Math.cos(a)*5,my=gy+Math.sin(a)*5;Rr(k,'#fff6a0',mx-2,my-2,4,4);Rr(k,'#ff9a2a',mx-1,my-1,2,2)}}
  else{Rr(k,'#1a1a1a',c.x+(side?-d*1:3),c.y-8,2,4)}});
 if(c.tr&&c.tr.t>0){g.save();g.strokeStyle='rgba(255,240,160,.85)';g.lineWidth=.8;g.beginPath();const a=c.ang||0;g.moveTo(c.x+Math.cos(a)*10,c.y-10+Math.sin(a)*9);g.lineTo(c.tr.x,c.tr.y);g.stroke();g.restore()}}
const _evoCop=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoCop(L,x0,x1,y0,y1);if(inRoom())return;for(const c of COPS)if(c.x>x0-40&&c.x<x1+40&&c.y>y0-40&&c.y<y1+60)L.push([c.y,10,{draw:g=>drawCop(g,c)}])};
const _updCop=update;update=function(dt){_updCop(dt);if(S&&!paused())try{stepCops(Math.min(dt,.1))}catch(e){console.error(e)}};
// ---------- legítima defesa: bicho bravo vindo pra cima a menos de ~7 m, pode atirar mesmo perto da sede/vila
const _hlF3=huntLegal;huntLegal=function(){if(S.h.lic&&S.h.lic>S.day&&WILD.some(a=>a.st==='charge'&&Math.hypot(a.x-P.x,a.y-P.y)<110)){tt('ldef','⚠️ Legítima defesa: o bicho veio pra cima de você.','',20);return true}return _hlF3()};
// ---------- abre a ligação entre estradas (ex.: fim da estrada perto da ponte e a estrada de terra que desce) — tira as árvores do meio
function junctionCarve(){const bad=new Set();
 for(const q of TRT)if(!q.h)for(const r of TRT)if(r.h){const qc=Math.floor(q.c/TS),rc=Math.floor(r.c/TS);if(qc<Math.floor(r.a/TS)-3||qc>Math.floor(r.b/TS)+3)continue;
  for(const end of[q.a,q.b]){const ey=Math.floor(end/TS);if(Math.abs(ey-rc)>6||(ey>=rc-1&&ey<=rc))continue;const y0=Math.min(ey,rc-1),y1=Math.max(ey,rc);
   for(let y=y0;y<=y1;y++)for(let x=qc-2;x<=qc+1;x++){if(x<XMIN+1||y<YMIN+1||x>=MW-1||y>=RZ-2)continue;bad.add(x+','+y);const i=ti(x,y);if(G[i]===2||BLD.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h))continue;if(x>=qc-1)G[i]=3;SOL[i]=0}}}
 const hit=t=>bad.has(Math.floor(t.x/TS)+','+Math.floor(t.y/TS))||bad.has(Math.floor(t.x/TS)+','+Math.floor((t.y-1)/TS));
 for(let i=TREES.length-1;i>=0;i--)if(hit(TREES[i])){const t=TREES[i];SOL[ti(Math.floor(t.x/TS),Math.floor((t.y-1)/TS))]=0;TREES.splice(i,1)}
 for(let i=BUSH.length-1;i>=0;i--)if(hit(BUSH[i]))BUSH.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(hit(DECO[i]))DECO.splice(i,1);
 if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--){const b=BOULD[i];if(bad.has(b.x+','+b.y)||bad.has((b.x+1)+','+b.y)){SOL[ti(b.x,b.y)]=0;if(b.big)SOL[ti(b.x+1,b.y)]=0;BOULD.splice(i,1)}}}
const _rfcF3=rfCarve;rfCarve=function(){_rfcF3();junctionCarve()};
// ---------- proteção de iniciante: sem onça, ladrão, praga na lavoura nem sabotagem durante o tutorial e 5 dias depois
const tutOn=()=>S&&typeof TUT!=='undefined'&&S.tut<TUT.length;
const newbieSafe=()=>{if(!S)return false;if(tutOn())return true;if(S.tutEnd==null)S.tutEnd=S.day;return S.day<S.tutEnd+5};
const _stNb=spawnThief;spawnThief=function(){if(newbieSafe())return;return _stNb.apply(this,arguments)};
const _phNb=pestHourly;pestHourly=function(){if(newbieSafe())return;return _phNb.apply(this,arguments)};
const _soNb=spawnOnca;spawnOnca=function(){if(newbieSafe())return;return _soNb.apply(this,arguments)};
const _ocNb=oncaChance;oncaChance=function(){return newbieSafe()?0:_ocNb()};
const _hdNb=hookDay;hookDay=function(){if(!newbieSafe()||typeof ensureSab!=='function')return _hdNb();const B=ensureSab(),old=B.last;B.last={i:0,t:'-',d:S.day,rep:1};try{_hdNb()}finally{if(B.last&&B.last.t==='-')B.last=old}};
let nbT=0;const _updNb=update;update=function(dt){_updNb(dt);if(!S)return;nbT-=dt;if(nbT>0)return;nbT=2;
 if(!tutOn()&&S.tutEnd==null){S.tutEnd=S.day;toast('🛡️ Proteção de iniciante: por mais 5 dias nada de onça, ladrão ou praga na lavoura. Use esse tempo para comprar cachorro, arrumar a cerca e pegar licença de caça.','good')}
 if(S.tutEnd!=null&&!S.nbWarn&&S.day>=S.tutEnd+4){S.nbWarn=1;toast('⚠️ Amanhã acaba a proteção de iniciante: onça, ladrões e javalis podem aparecer. Cachorros, cerca boa e luz no curral ajudam muito.','bad')}};
// ---------- nada de tiro dentro de salas (bar, cabaré, lojas, shopping...)
const _hlRoom=huntLegal;huntLegal=function(){if(inRoom()){tt('noshot','🚫 Aqui dentro não! Guarde a arma.','bad',4);return false}return _hlRoom()};
