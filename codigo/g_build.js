// ===== Obras com pedreiro, lotes, porcos, ovelhas/cabras, abelhas, matadouro e açougue =====
const LOTS=[{id:'sede',n:'Sede da fazenda',x0:2,y0:36,x1:30,y1:70,p:0,lv:1},{id:'leste',n:'Lote Leste',x0:31,y0:36,x1:58,y1:70,p:35000,lv:4},{id:'sul',n:'Lote Sul',x0:2,y0:71,x1:58,y1:84,p:70000,lv:7},{id:'varzea',n:'Várzea do Açude',x0:2,y0:87,x1:58,y1:105,p:90000,lv:8},{id:'retiro',n:'Retiro (fundo da fazenda)',x0:2,y0:107,x1:58,y1:130,p:120000,lv:9}];
const BT={
 apiario:{n:'Apiário',ic:'🐝',w:5,h:4,days:5,cost:6000,lv:4,d:'Caixas de abelha para produzir mel. Flores, lavoura e ipês florindo aumentam a produção.'},
 chiq:{n:'Chiqueiro',ic:'🐖',w:6,h:6,days:8,cost:12000,lv:5,d:'Galpão e baia com lama para criar porcos. Leitões crescem rápido e as porcas dão ninhadas grandes.'},
 aprisco:{n:'Aprisco',ic:'🐑',w:7,h:6,days:10,cost:15000,lv:6,d:'Abrigo para ovelhas (lã) e cabras (leite).'},
 matadouro:{n:'Matadouro',ic:'🔪',w:7,h:5,days:20,cost:60000,lv:8,d:'Abata seus animais, limpe e guarde a carne na câmara fria para vender no açougue da vila, com lucro maior.'}
};
function ensureB(){
 if(!S.lots)S.lots={sede:1};if(!S.blds)S.blds=[];if(S.obra===undefined)S.obra=null;
 if(!S.pigs)S.pigs=[];if(!S.flock)S.flock=[];if(!S.bees)S.bees={hives:0,honey:0,suit:0};if(!S.camara)S.camara=[];if(S.abateD===undefined)S.abateD={d:-1,n:0};
}
const hasB=t=>S.blds&&S.blds.some(b=>b.type===t);
const bOf=t=>S.blds.find(b=>b.type===t);
const ownLot=(x,y)=>LOTS.some(l=>S.lots[l.id]&&x>=l.x0&&x<=l.x1&&y>=l.y0&&y<=l.y1);
// ---- validação do terreno
function rectHit(x,y,w,h,a,b,c,d){return x<=c&&x+w-1>=a&&y<=d&&y+h-1>=b}
function siteOK(t,x,y){
 const B=BT[t];if(!B)return false;const pw=pasW();
 if(rectHit(x,y,B.w,B.h,PAS.x-1,PAS.y-1,PAS.x+pw,PAS.y+PAS.h))return false;
 if(rectHit(x,y,B.w,B.h,FULLF[0]-1,FULLF[1]-1,FULLF[2]+1,FULLF[3]+1))return false;
 if(rectHit(x,y,B.w,B.h,RUN.x0-1,RUN.y0-1,RUN.x1+1,RUN.y1+1))return false;
 if(rectHit(x,y,B.w,B.h,CUR.x0-1,CUR.y0-1,CUR.x1+2,CUR.y1+1))return false;
 if(rectHit(x,y,B.w,B.h,21,39,25,46))return false;
 for(const b of BLD)if(rectHit(x,y,B.w,B.h,b.x-1,b.y-1,b.x+b.w,b.y+b.h+1))return false;
 for(const o of S.blds.concat(S.obra?[S.obra]:[])){const q=BT[o.type];if(rectHit(x,y,B.w,B.h,o.x-1,o.y-1,o.x+q.w,o.y+q.h))return false}
 for(let yy=y;yy<y+B.h;yy++)for(let xx=x;xx<x+B.w;xx++){if(!ownLot(xx,yy))return false;const i=ti(xx,yy);if(G[i]===2||G[i]===3||FEN[i])return false;if(SOL[i]&&!TREES.some(t=>Math.floor(t.x/TS)===xx&&Math.floor(t.y/TS)===yy)&&!DECO.some(d=>Math.floor(d.x/TS)===xx&&Math.floor(d.y/TS)===yy))return false}
 return true;
}
// ---- modo de posicionamento
let PLACE=null;
const placeBar=document.createElement('div');placeBar.style.cssText='position:fixed;left:50%;bottom:120px;transform:translateX(-50%);z-index:9;display:none;gap:8px;background:rgba(30,18,10,.9);border:2px solid #e0a431;border-radius:8px;padding:8px 10px;font:18px "VT323",monospace;color:#f3e6c8;text-align:center';document.body.appendChild(placeBar);
function startPlace(t){ensureB();const B=BT[t];if(S.obra)return toast('O pedreiro já está ocupado com outra obra.','bad');if(LV()<B.lv)return toast('Requer nível '+B.lv,'bad');if(hasB(t))return toast('Você já tem um '+B.n,'bad');
 PLACE={t,x:0,y:0,ok:false,crew:1};closeMenu();hideModal();
 placeBar.style.display='block';placeRender();toast('🏗️ Ande pela fazenda para escolher o local. Verde = pode construir.');}
function placeRender(){if(!PLACE)return;const B=BT[PLACE.t],c=Math.round(B.cost*(PLACE.crew===2?1.3:1)),d=Math.ceil(B.days*(PLACE.crew===2?.6:1));
 placeBar.innerHTML='<b>'+B.ic+' '+B.n+'</b> · '+R$(c)+' · '+d+' dias<br><span style="font-size:15px">Pedreiros: <button class="b" data-pc="1" style="font-size:15px;padding:2px 8px'+(PLACE.crew===1?';background:#e0a431':'')+'">1</button> <button class="b" data-pc="2" style="font-size:15px;padding:2px 8px'+(PLACE.crew===2?';background:#e0a431':'')+'">2 (+30%, mais rápido)</button></span><br><button class="b gold" data-pc="ok">✅ Construir aqui</button> <button class="b gray" data-pc="no">❌ Cancelar</button>'}
placeBar.addEventListener('click',e=>{const b=e.target.closest('[data-pc]');if(!b)return;const v=b.dataset.pc;if(v==='ok')confirmPlace();else if(v==='no')cancelPlace();else{PLACE.crew=+v;placeRender()}});
addEventListener('keydown',e=>{if(!PLACE)return;const k=e.key.toLowerCase();if(k==='enter'){e.preventDefault();confirmPlace()}if(k==='escape'){e.preventDefault();e.stopImmediatePropagation();cancelPlace()}},true);
function cancelPlace(){PLACE=null;placeBar.style.display='none'}
function confirmPlace(){if(!PLACE)return;if(!PLACE.ok)return toast('Não dá para construir aqui (fora do seu terreno ou em cima de algo).','bad');const B=BT[PLACE.t],c=Math.round(B.cost*(PLACE.crew===2?1.3:1));if(S.money<c)return toast('Dinheiro insuficiente','bad');
 cash(-c,'Obra: '+B.n);const days=Math.ceil(B.days*(PLACE.crew===2?.6:1));
 for(let yy=PLACE.y;yy<PLACE.y+B.h;yy++)for(let xx=PLACE.x;xx<PLACE.x+B.w;xx++){for(let i=TREES.length-1;i>=0;i--)if(Math.floor(TREES[i].x/TS)===xx&&Math.floor(TREES[i].y/TS)===yy)TREES.splice(i,1);for(let i=DECO.length-1;i>=0;i--)if(Math.floor(DECO[i].x/TS)===xx&&Math.floor(DECO[i].y/TS)===yy)DECO.splice(i,1);SOL[ti(xx,yy)]=0}
 S.obra={type:PLACE.t,x:PLACE.x,y:PLACE.y,start:S.day+S.t,days,crew:PLACE.crew};gainXP(20,'obra');
 toast('🧱 Obra contratada! '+B.n+' fica pronto em '+days+' dias. Venha ver o pedreiro trabalhando.','good');cancelPlace();
}
const _updB=update;
update=function(dt){_updB(dt);ensureB();
 if(PLACE){const B=BT[PLACE.t],fv=FV[P.dir];PLACE.x=Math.floor(P.x/TS)+fv[0]*3-Math.floor(B.w/2);PLACE.y=Math.floor(P.y/TS)+fv[1]*3-(fv[1]<0?B.h:fv[1]>0?0:Math.floor(B.h/2));PLACE.ok=siteOK(PLACE.t,PLACE.x,PLACE.y)}
 if(S.obra){const o=S.obra,p=(S.day+S.t-o.start)/o.days;if(p>=1)finishObra();else stepMason(dt,p)}
 stepPigs(dt);stepFlock(dt);
};
function obraP(){const o=S.obra;return o?clamp((S.day+S.t-o.start)/o.days,0,1):0}
function finishObra(){const o=S.obra,B=BT[o.type];S.blds.push({type:o.type,x:o.x,y:o.y});S.obra=null;applyBlds();gainXP(60,'obra');
 showModal('<h3>🎉 Obra concluída!</h3><div class="card" style="text-align:center"><div style="font-size:40px">'+B.ic+'</div><b>'+B.n+'</b> está pronto.<br><span class="dim">'+B.d+'</span></div><div class="btns"><button class="b gold" data-act="close">Ver</button></div>');for(let i=0;i<40;i++)PART.push({x:(o.x+B.w/2)*TS+rnd(-30,30),y:(o.y+B.h/2)*TS+rnd(-20,10),vx:rnd(-30,30),vy:rnd(-60,-20),t:0,l:rnd(.8,1.6),c:pick(['255,215,94','255,120,120','120,200,255','160,230,120'])})}
// aplica solidez e cercados das construções prontas
function penRect(b){const B=BT[b.type];if(b.type==='chiq')return{x0:b.x,y0:b.y+3,x1:b.x+B.w-1,y1:b.y+B.h-1};if(b.type==='aprisco')return{x0:b.x,y0:b.y+3,x1:b.x+B.w-1,y1:b.y+B.h-1};return null}
function applyBlds(){ensureB();
 for(const b of S.blds){const B=BT[b.type];
  if(b.type==='matadouro'){for(let y=b.y;y<b.y+B.h;y++)for(let x=b.x;x<b.x+B.w;x++)SOL[ti(x,y)]=1;if(!BLD.some(q=>q.id==='matadouro'))BLD.push({id:'matadouro',x:b.x,y:b.y,w:B.w,h:B.h,door:b.x+3,roof:'#5a6a7a',wall:'#eef2f4',label:'Matadouro',sign:'MATADOURO',custom:1})}
  else if(b.type==='apiario'){for(let x=b.x;x<b.x+B.w;x++){FEN[ti(x,b.y)]=1;FEN[ti(x,b.y+B.h-1)]=x===b.x+2?0:1}for(let y=b.y;y<b.y+B.h;y++){FEN[ti(b.x,y)]=1;FEN[ti(b.x+B.w-1,y)]=1}}
  else{for(let y=b.y;y<b.y+3;y++)for(let x=b.x;x<b.x+B.w;x++)SOL[ti(x,y)]=1;const p=penRect(b);for(let x=p.x0;x<=p.x1;x++){FEN[ti(x,p.y1)]=x===p.x0+2?0:1}for(let y=p.y0;y<=p.y1;y++){FEN[ti(p.x0,y)]=1;FEN[ti(p.x1,y)]=1}}
 }
}
const _gwB=genWorld;genWorld=function(){_gwB();ensureB();for(const b of S.blds){const B=BT[b.type];for(let yy=b.y;yy<b.y+B.h;yy++)for(let xx=b.x;xx<b.x+B.w;xx++){for(let i=TREES.length-1;i>=0;i--)if(Math.floor(TREES[i].x/TS)===xx&&Math.floor(TREES[i].y/TS)===yy)TREES.splice(i,1);for(let i=DECO.length-1;i>=0;i--)if(Math.floor(DECO[i].x/TS)===xx&&Math.floor(DECO[i].y/TS)===yy)DECO.splice(i,1);SOL[ti(xx,yy)]=0}}if(S.obra){const o=S.obra,B=BT[o.type];for(let yy=o.y;yy<o.y+B.h;yy++)for(let xx=o.x;xx<o.x+B.w;xx++)SOL[ti(xx,yy)]=0}applyBlds()};
const _rbfB=rebuildFence;rebuildFence=function(){_rbfB();if(S&&S.blds)applyBlds()};
// ---- pedreiro ao vivo
const MASONS=[mkW(0,0,{}),mkW(0,0,{})];
function stepMason(dt,p){
 const o=S.obra,B=BT[o.type],h=dayHour(),work=h>=7&&h<17.5;
 MASONS.forEach((m,i)=>{
  if(i>=o.crew||!work){m.vis=false;m.x=(o.x-1)*TS;m.y=(o.y+B.h)*TS;return}
  m.vis=true;m.mv=0;m.work=0;
  if(m.st==='work'){m.work=1;m.t-=dt;if(m.t<=0){m.st='idle';m.wait=rnd(.5,1.5)}
   m.snd=(m.snd||0)-dt;if(m.snd<=0){m.snd=.45;if(Math.hypot(P.x-m.x,P.y-m.y)<160)tick(i);for(let k=0;k<2;k++)PART.push({x:m.x+rnd(-6,6),y:m.y-4,vx:rnd(-12,12),vy:rnd(-18,-6),t:0,l:.4,c:'200,190,170'})}return}
  if(m.st==='go'){if(wkStep(m,dt,32)){m.st='work';m.t=rnd(3,6)}return}
  m.wait=(m.wait||0)-dt;if(m.wait>0)return;
  const pile=m.pile=!m.pile;const tx=pile?(o.x-1)*TS+8:(o.x+rnd(.5,B.w-.5))*TS,ty=pile?(o.y+B.h-1)*TS:(o.y+B.h)*TS+4;
  m.route=[[tx,ty]];m.st='go';
 });
}
let tickT=0;function tick(i){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=320+i*90;g.gain.setValueAtTime(.025,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.06)}catch(e){}}
function drawMason(g,m,i){OL(g,m.x,m.y+3,30,40,c=>{drawPerson(c,{x:m.x,y:m.y,dir:m.dir,ph:m.ph,mv:m.mv,shirt:i?'#c86a2a':'#e0a431',pants:'#3a4a6a',hair:'#2a1a10',hat:'#f0d040',work:m.work,tool:1,g:'m'});Rr(c,'#f0d040',m.x-4,m.y-23,8,2)})}
// ---- desenhos das construções prontas
function drawBuiltArt(g,t,x,y){
 const B=BT[t],W=B.w*TS;
 if(t==='apiario'){
  const fs={r:'#8a6a42',p:'#5a3a22'};for(let i=0;i<B.w;i++){drawFence(g,x+i*TS,y,fs);if(i!==2)drawFence(g,x+i*TS,y+(B.h-1)*TS,fs)}for(let j=1;j<B.h-1;j++){drawFence(g,x,y+j*TS,fs);drawFence(g,x+(B.w-1)*TS,y+j*TS,fs)}
  const n=Math.max(1,S.bees?S.bees.hives:1);for(let k=0;k<Math.min(8,n);k++){const hx=x+12+(k%4)*14,hy=y+22+Math.floor(k/4)*16;Rr(g,'rgba(0,0,0,.2)',hx,hy+10,12,2);Rr(g,'#e8d8a8',hx,hy,12,10);Rr(g,'#c8b888',hx,hy+4,12,1);Rr(g,'#5a7a9a',hx-1,hy-2,14,3);Rr(g,'#3a2a1a',hx+4,hy+7,4,1.5);
   for(let b=0;b<3;b++){const a=frame/9+b*2.1+k;Rr(g,'#2a1a0a',hx+6+Math.cos(a)*7,hy-2+Math.sin(a*1.3)*4,1,1);Rr(g,'#f0c020',hx+6+Math.cos(a)*7+.5,hy-2+Math.sin(a*1.3)*4,.6,.6)}}
  for(let k=0;k<6;k++)Rr(g,['#f08ab0','#f0e060','#a88ae0'][k%3],x+4+k*12,y+B.h*TS-12,2,2);
  return;
 }
 if(t==='matadouro')return;
 const shedH=3*TS,roof=t==='chiq'?'#8a5a3a':'#6a7a4a',wall=t==='chiq'?'#d8b8a0':'#c8b08a';
 const p=penRect({type:t,x:x/TS,y:y/TS});
 Rr(g,'rgba(0,0,0,.2)',x+3,y+shedH-1,W,4);Rr(g,wall,x,y+12,W,shedH-12);for(let i=0;i<W;i+=5)Rr(g,shade(wall,-14),x+i,y+12,1,shedH-12);
 for(let r=0;r<12;r+=2){Rr(g,r<2?shade(roof,18):roof,x-2,y+r,W+4,2);for(let i=-2+((r/2)%2?2:0);i<W+2;i+=4)Rr(g,shade(roof,-22),x+i,y+r,1,2)}Rr(g,shade(roof,-40),x-2,y+11,W+4,2);
 Rr(g,'#3a2616',x+W/2-8,y+shedH-20,16,20);Rr(g,'#1a0e08',x+W/2-6,y+shedH-18,12,18);
 Rr(g,'#f4ecd8',x+6,y+16,18,9);ptext(g,t==='chiq'?'PORCOS':'OVELHAS',x+7,y+18,'#7a2a12');
}
function drawPenFloor(g,b){const p=penRect(b);if(!p)return;for(let ty=p.y0;ty<=p.y1;ty++)for(let tx=p.x0;tx<=p.x1;tx++){const h=hs(tx*5,ty*3);if(b.type==='chiq'){Rr(g,h<.5?'#6a5034':'#5e4630',tx*TS,ty*TS,TS,TS);if(h<.35)Rr(g,'#4a3a26',tx*TS+3,ty*TS+5,9,5)}else{Rr(g,h<.5?'#b8a060':'#a89050',tx*TS,ty*TS,TS,TS);if(h<.3)Rr(g,'#e0c060',tx*TS+4,ty*TS+6,6,2)}}
 const fs={r:'#8a6a42',p:'#5a3a22'};for(let x=p.x0;x<=p.x1;x++)if(!(x===p.x0+2))drawFence(g,x*TS,p.y1*TS,fs);for(let y=p.y0;y<p.y1;y++){drawFence(g,p.x0*TS,y*TS,fs);drawFence(g,p.x1*TS,y*TS,fs)}
 Rr(g,'#5e646c',(p.x1-1)*TS-6,p.y0*TS+4,18,7);Rr(g,'#3a7ab8',(p.x1-1)*TS-4,p.y0*TS+6,14,3);}
// estágios da obra
function drawObra(g){
 const o=S.obra,B=BT[o.type],x=o.x*TS,y=o.y*TS,W=B.w*TS,H=B.h*TS,p=obraP();
 Rr(g,'#8a6a44',x,y,W,H);for(let i=0;i<14;i++)Rr(g,'#6a4e30',x+hs(i,o.x)*W,y+hs(o.y,i)*H,4,2);
 [[0,0],[W-2,0],[0,H-2],[W-2,H-2]].forEach(([a,b])=>{Rr(g,'#c8a070',x+a,y+b-6,2,8);Rr(g,'#e0402a',x+a,y+b-7,2,2)});
 Rr(g,'rgba(255,255,255,.7)',x,y-2,W,.6);Rr(g,'rgba(255,255,255,.7)',x,y+H-2,W,.6);Rr(g,'rgba(255,255,255,.7)',x,y,.6,H);Rr(g,'rgba(255,255,255,.7)',x+W-1,y,.6,H);
 const bx=x-TS,by=y+H-TS;if(p<.95){for(let i=0;i<Math.max(1,Math.round(5*(1-p)));i++)for(let j=0;j<3;j++)Rr(g,j%2?'#a84a32':'#c05a3a',bx+(i%3)*5,by+8-j*3-Math.floor(i/3)*9,4,2.5);Rr(g,'#d8c090',bx+2,by+12,12,5);Rr(g,'#c8b080',bx+5,by+10,6,3)}
 const fH=Math.min(1,p/.22);Rr(g,'#9a9aa0',x+1,y+H-4*fH-1,W-2,4*fH);
 if(p>.2){const wp=clamp((p-.2)/.6,0,1);g.save();g.beginPath();g.rect(x-4,y+H-(H+30)*wp,W+8,(H+30)*wp);g.clip();
  if(o.type==='matadouro')drawBuildingArt(g,{id:'matadouro',x:o.x,y:o.y,w:B.w,h:B.h,door:o.x+3,roof:'#5a6a7a',wall:'#eef2f4',sign:p>.85?'MATADOURO':null});else{if(o.type!=='apiario'){const b={type:o.type,x:o.x,y:o.y};drawPenFloor(g,b)}drawBuiltArt(g,o.type,x,y)}
  g.restore();
  if(p<.85&&o.type!=='apiario'){for(let i=0;i<=B.w;i+=2){Rr(g,'#b8b8c0',x+i*TS-1,y-6,1.5,H+6)}for(let j=0;j<H;j+=14)Rr(g,'#8a6a42',x-2,y+j,W+4,2)}
 }
 const tw=ptw(Math.round(p*100)+'%')+4;Rr(g,'#1e140c',x+W/2-22,y-16,44,9);Rr(g,'#e0a431',x+W/2-21,y-15,42*p,7);ptext(g,Math.round(p*100)+'%',x+W/2-tw/2+2,y-14,'#fff','#000');
}
// ---- porcos
const PIGN=['Bolota','Toicinho','Pipoca','Torresmo','Rosinha','Linguiça','Barrigudo','Fofinha','Salame','Bacon'];
function mkPig(sex,age,w){return{id:Date.now()%1e8+Math.floor(Math.random()*1e4),sex,age,w,name:pick(PIGN),preg:0,x:0,y:0,tx:0,ty:0,wait:0,lie:0}}
const pigMax=p=>p.sex==='F'?190:220;
function stepPigs(dt){if(!hasB('chiq'))return;const b=bOf('chiq'),p=penRect(b),x0=(p.x0+1)*TS+4,x1=p.x1*TS-14,y0=p.y0*TS+8,y1=p.y1*TS-2;
 for(const a of S.pigs){if(!a.x||a.x<x0-20||a.x>x1+20||a.y<y0-20||a.y>y1+20){a.x=rnd(x0,x1);a.y=rnd(y0,y1)}
  if(a.wait>0){a.wait-=dt;continue}const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d<2||!a.tx){a.tx=rnd(x0,x1);a.ty=rnd(y0,y1);a.wait=rnd(2,8);a.lie=Math.random()<.35?1:0;continue}a.lie=0;const sp=(a.age<60?16:9)*dt;a.x+=dx/d*sp;a.y+=dy/d*sp;a.dir=dx>0?1:-1}}
function drawPig(g,a){const x=a.x,y=a.y,d=a.dir||1,s=a.age<60?.55:clamp(a.w/150,.65,1.15),c='#f0b0b0',dk='#d08888',r=(col,dx,dy,w,h)=>Rr(g,col,d>0?x+dx*s:x-dx*s-w*s,y+dy*s,w*s,h*s);
 Rr(g,'rgba(0,0,0,.25)',x-7*s,y-1,14*s,2);
 if(!a.lie)[-5,-2,3,5].forEach((dx,i)=>r(i%2?dk:c,dx,-3,1.6,3+(frame>>4&1)*((i%2)?.4:0)));
 r(c,-7,a.lie?-6:-9,13,a.lie?6:7);r(shade(c,12),-6,a.lie?-6:-9,11,1.5);r(dk,-7,a.lie?-1:-3,13,1);
 r(c,5,a.lie?-7:-10,5,5);r('#f8c8c8',9,a.lie?-5:-8,2.4,2.4);r('#a05a5a',10,a.lie?-4.6:-7.6,.6,.6);r('#a05a5a',10,a.lie?-3.4:-6.4,.6,.6);r('#222',7.4,a.lie?-6:-9,.9,.9);r(dk,5,a.lie?-8:-11,2,2);
 r(dk,-8.5,a.lie?-5:-8,1.4,1.4);r(dk,-9.5,a.lie?-6:-9,1,1);
 if(a.mud)r('#6a5034',-4,a.lie?-4:-6,4,2)}
// ---- ovelhas e cabras
const FLOCKN=['Dolly','Lanosa','Floco','Neve','Bé','Cabrita','Mimosa','Barbicha','Algodão','Chiquinha'];
function mkFlock(sp,sex,age){return{id:Date.now()%1e8+Math.floor(Math.random()*1e4),sp,sex,age,w:sp==='ovelha'?(age<90?12:55):(age<90?8:45),wool:sp==='ovelha'?rnd(10,60):0,lact:0,preg:0,name:pick(FLOCKN),x:0,y:0,tx:0,ty:0,wait:0}}
function stepFlock(dt){if(!hasB('aprisco'))return;const b=bOf('aprisco'),p=penRect(b),x0=(p.x0+1)*TS+4,x1=p.x1*TS-14,y0=p.y0*TS+8,y1=p.y1*TS-2;
 for(const a of S.flock){if(!a.x||a.x<x0-20||a.x>x1+20||a.y<y0-20||a.y>y1+20){a.x=rnd(x0,x1);a.y=rnd(y0,y1)}if(a.wait>0){a.wait-=dt;continue}const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d<2||!a.tx){a.tx=rnd(x0,x1);a.ty=rnd(y0,y1);a.wait=rnd(2,7);continue}const sp=(a.age<60?18:11)*dt;a.x+=dx/d*sp;a.y+=dy/d*sp;a.dir=dx>0?1:-1}}
function drawFlock(g,a){const x=a.x,y=a.y,d=a.dir||1,s=a.age<60?.6:1,r=(col,dx,dy,w,h)=>Rr(g,col,d>0?x+dx*s:x-dx*s-w*s,y+dy*s,w*s,h*s),mv=a.wait<=0;
 Rr(g,'rgba(0,0,0,.25)',x-6*s,y-1,12*s,2);
 if(a.sp==='ovelha'){const wl=.4+a.wool/100*.9,wc='#f4f0e4';[-4,-1,3,5].forEach((dx,i)=>r('#2a2a2a',dx,-4,1.2,4+(mv&&((frame>>3)+i)%2?-.6:0)));
  r(shade(wc,-12),-6-wl,-9-wl,12+wl*2,6+wl);r(wc,-5-wl,-10-wl,10+wl*2,5+wl);for(let i=0;i<4;i++)r('#fff',-5+i*3,-10-wl,2,1.5);
  r('#2a2a2a',5,-11,4,4);r('#2a2a2a',4,-11,1.5,2);r('#fff',7.4,-10,.8,.8)}
 else{const c=a.id%3===0?'#f0ece4':a.id%3===1?'#8a5a32':'#3a3a3a',dk=shade(c,-30);[-4,-1,3,5].forEach((dx,i)=>r(dk,dx,-4,1.2,4+(mv&&((frame>>3)+i)%2?-.6:0)));
  r(c,-6,-9,11,5);r(shade(c,15),-5,-9,9,1);r(c,4,-12,3,4);r(c,5,-13,4,4);r(dk,6,-10,3,1);r('#111',6.6,-12,.8,.8);r('#c8b898',5,-15,1,2.4);r('#c8b898',4,-16,1,1.4);r(dk,8,-9.6,1,2);r(c,-7,-10,1.4,2)}
 if(a.sp==='cabra'&&a.lact>S.day)r('#f0b0c0',-1,-4.6,2,1)}
// lista de desenho
const _evoB=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoB(L,x0,x1,y0,y1);ensureB();
 for(const b of S.blds){const B=BT[b.type],x=b.x*TS,y=b.y*TS;if(x>x1+20||x+B.w*TS<x0-20||y>y1+20||y+B.h*TS<y0-60)continue;
  if(b.type==='matadouro')continue;
  if(b.type==='apiario')L.push([y+B.h*TS-4,10,{draw:g=>drawBuiltArt(g,'apiario',x,y)}]);
  else L.push([y+3*TS,10,{draw:g=>drawBuiltArt(g,b.type,x,y)}]);}
 if(hasB('chiq'))for(const a of S.pigs)L.push([a.y,10,{draw:g=>OL(g,a.x,a.y+3,30,22,c=>drawPig(c,a))}]);
 if(hasB('aprisco'))for(const a of S.flock)L.push([a.y,10,{draw:g=>OL(g,a.x,a.y+3,30,26,c=>drawFlock(c,a))}]);
 if(S.obra){const o=S.obra,B=BT[o.type];L.push([(o.y+B.h)*TS,10,{draw:drawObra}]);MASONS.forEach((m,i)=>{if(m.vis)L.push([m.y,10,{draw:g=>drawMason(g,m,i)}])})}
 if(PLACE)L.push([1e9,10,{draw:drawGhost}]);
};
const _dfsB=drawFarmStatic;drawFarmStatic=function(g){_dfsB(g);ensureB();for(const b of S.blds)if(b.type==='chiq'||b.type==='aprisco')drawPenFloor(g,b)};
function drawGhost(g){const B=BT[PLACE.t],x=PLACE.x*TS,y=PLACE.y*TS,W=B.w*TS,H=B.h*TS,ok=PLACE.ok;
 for(const l of LOTS){const own=S.lots[l.id];g.fillStyle=own?'rgba(80,220,80,.06)':'rgba(220,60,60,.06)';g.fillRect(l.x0*TS,l.y0*TS,(l.x1-l.x0+1)*TS,(l.y1-l.y0+1)*TS);g.strokeStyle=own?'rgba(80,220,80,.6)':'rgba(220,60,60,.6)';g.lineWidth=1;g.setLineDash([4,3]);g.strokeRect(l.x0*TS,l.y0*TS,(l.x1-l.x0+1)*TS,(l.y1-l.y0+1)*TS);g.setLineDash([]);if(!own)ptext(g,l.n+' - '+R$(l.p),l.x0*TS+6,l.y0*TS+6,'#ffb0a0','#000')}
 g.fillStyle=ok?'rgba(80,220,80,.35)':'rgba(230,60,60,.4)';g.fillRect(x,y,W,H);g.strokeStyle=ok?'#6f6':'#f66';g.lineWidth=1.5;g.strokeRect(x,y,W,H);
 g.globalAlpha=.55;if(PLACE.t==='matadouro')drawBuildingArt(g,{id:'matadouro',x:PLACE.x,y:PLACE.y,w:B.w,h:B.h,door:PLACE.x+3,roof:'#5a6a7a',wall:'#eef2f4',sign:'MATADOURO'});else drawBuiltArt(g,PLACE.t,x,y);g.globalAlpha=1}
// ---- interações nos animais e construções
const _ilB=interactList;
interactList=function(){const L=_ilB();if(inRoom())return L;ensureB();
 for(const b of S.blds){const B=BT[b.type];
  if(b.type==='chiq')L.push({x:(b.x+2)*TS+8,y:(b.y+B.h)*TS+4,r:30,label:'🐖 Chiqueiro ('+S.pigs.length+' porcos)',fn:pigModal});
  if(b.type==='aprisco')L.push({x:(b.x+2)*TS+8,y:(b.y+B.h)*TS+4,r:30,label:'🐑 Aprisco ('+S.flock.length+' animais)',fn:flockModal});
  if(b.type==='apiario')L.push({x:(b.x+2)*TS+8,y:(b.y+B.h)*TS+4,r:30,label:'🐝 Apiário ('+S.bees.hives+' caixas, '+S.bees.honey.toFixed(1)+' kg de mel)',fn:beeModal});}
 if(S.obra){const o=S.obra,B=BT[o.type];L.push({x:(o.x+B.w/2)*TS,y:(o.y+B.h)*TS+4,r:40,label:'🧱 Obra: '+B.n+' ('+Math.round(obraP()*100)+'%)',fn:()=>toast('🧱 '+B.n+': '+Math.round(obraP()*100)+'% pronto · faltam ~'+Math.max(0,Math.ceil(o.days*(1-obraP())))+' dias')})}
 return L};
// ---- dia a dia
const _hdB=hookDay;
hookDay=function(){_hdB();ensureB();
 if(hasB('chiq')&&S.pigs.length){let cost=0;const corn=Math.min(S.inv.milho||0,S.pigs.length);if(corn)takeItem('milho',corn);
  for(const a of S.pigs.slice()){a.age++;cost+=a.age<60?2:4;const m=pigMax(a);a.w+=(m-a.w)*.028;a.mud=Math.random()<.4;
   if(a.sex==='F'&&a.age>=200){if(a.preg){a.preg++;if(a.preg>=40){a.preg=0;const n=ri(6,10);for(let i=0;i<n;i++){const c=mkPig(Math.random()<.5?'F':'M',0,2);c.x=a.x;c.y=a.y;S.pigs.push(c)}toast('🐖 '+a.name+' deu cria a '+n+' leitões!','good');gainXP(10,'leitões')}}else if(S.pigs.some(q=>q.sex==='M'&&q.age>=200)&&Math.random()<.04)a.preg=1}}
  if(S.pigs.length>30){const ex=S.pigs.length-30;S.pigs.splice(30,ex);toast('🐖 Chiqueiro lotado (30): '+ex+' leitões vendidos para vizinhos.')}
  cost=Math.max(0,cost-corn*4);if(cost)cash(-cost,'Ração dos porcos')}
 if(hasB('aprisco')&&S.flock.length){let cost=0;for(const a of S.flock){a.age++;cost+=2;const m=a.sp==='ovelha'?65:50;a.w+=(m-a.w)*.02;if(a.sp==='ovelha')a.wool=Math.min(100,a.wool+1.7);
   if(a.sex==='F'&&a.age>=240&&!a.preg&&S.flock.some(q=>q.sp===a.sp&&q.sex==='M'&&q.age>=240)&&Math.random()<.035)a.preg=1;else if(a.preg){a.preg++;if(a.preg>=50){a.preg=0;a.lact=a.sp==='cabra'?S.day+120:0;const n=Math.random()<.35?2:1;for(let i=0;i<n;i++){const c=mkFlock(a.sp,Math.random()<.5?'F':'M',0);c.x=a.x;c.y=a.y;S.flock.push(c)}toast((a.sp==='ovelha'?'🐑 ':'🐐 ')+a.name+' teve '+(n>1?'gêmeos':'um filhote')+'!','good')}}
   if(a.sp==='cabra'&&a.lact>S.day)addItem('leitecabra',1)}cash(-cost,'Trato do aprisco')}
 if(hasB('apiario')&&S.bees.hives){const fl=(!isWet()?1.4:.9)*(S.weather==='chuva'?.4:1)*(1+(S.crops.length>8?.25:0));S.bees.honey=Math.min(S.bees.hives*12,S.bees.honey+S.bees.hives*.22*fl)}
};
// ---- modais dos animais
function pigModal(){ensureB();reModal=pigModal;const P2=S.pigs,fat=P2.filter(a=>a.w>=100&&a.age>=90);
 showModal('<h3>🐖 Chiqueiro</h3><div class="card">'+P2.length+'/30 porcos · '+P2.filter(a=>a.sex==='F'&&a.age>=200).length+' matrizes · '+P2.filter(a=>a.age<60).length+' leitões<div class="dim">Ração ~R$ 4/porco por dia (milho do seu inventário reduz o custo). Porcas parem 6–10 leitões. Com 100 kg o porco está gordo.</div></div>'
  +'<div class="btns"><button class="b gold" data-act="pigbuy" data-v="leitao">Leitão R$ 350</button><button class="b gold" data-act="pigbuy" data-v="F">Matriz R$ 1.600</button><button class="b gold" data-act="pigbuy" data-v="M">Cachaço R$ 2.200</button>'+(fat.length?'<button class="b" data-act="pigsell">Vender '+fat.length+' gordos (R$ 9/kg)</button>':'')+'</div>'
  +P2.slice().sort((a,b)=>b.w-a.w).slice(0,30).map(a=>'<div class="card" style="padding:4px 8px"><div class="row"><b>'+a.name+' '+(a.sex==='F'?'♀':'♂')+'</b><span>'+Math.round(a.w)+' kg</span></div><div class="dim">'+(a.age<60?'leitão':a.w>=100?'<span class="grn">gordo</span>':'engordando')+(a.preg?' · prenhe ('+(40-a.preg)+' dias)':'')+'</div></div>').join('')
  +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function flockModal(){ensureB();reModal=flockModal;const F=S.flock,ov=F.filter(a=>a.sp==='ovelha'),cb=F.filter(a=>a.sp==='cabra'),ready=ov.filter(a=>a.wool>=80);
 showModal('<h3>🐑 Aprisco</h3><div class="card">'+ov.length+' ovelhas · '+cb.length+' cabras (máx. 24)<div class="dim">Ovelhas dão lã a cada ~2 meses (tosquia). Cabras dão leite depois de parir — ele vai direto para o seu inventário.</div></div>'
  +'<div class="btns"><button class="b gold" data-act="flbuy" data-v="ovelha:F">Ovelha R$ 900</button><button class="b gold" data-act="flbuy" data-v="ovelha:M">Carneiro R$ 1.200</button><button class="b gold" data-act="flbuy" data-v="cabra:F">Cabra R$ 800</button><button class="b gold" data-act="flbuy" data-v="cabra:M">Bode R$ 1.000</button>'+(ready.length?'<button class="b" data-act="tosquia">✂️ Tosquiar '+ready.length+' ovelhas</button>':'')+'</div>'
  +F.map(a=>'<div class="card" style="padding:4px 8px"><div class="row"><b>'+(a.sp==='ovelha'?'🐑 ':'🐐 ')+a.name+' '+(a.sex==='F'?'♀':'♂')+'</b><span>'+Math.round(a.w)+' kg</span></div><div class="dim">'+(a.sp==='ovelha'?'Lã '+Math.round(a.wool)+'%':a.lact>S.day?'dando leite':'')+(a.preg?' · prenhe':'')+(a.age<60?' · filhote':'')+'</div></div>').join('')
  +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function beeModal(){ensureB();reModal=beeModal;const B=S.bees;
 showModal('<h3>🐝 Apiário</h3><div class="card">'+B.hives+'/8 caixas · <b class="gold">'+B.honey.toFixed(1)+' kg de mel</b> (máx. '+B.hives*12+')<div class="dim">A seca com ipês e flores rende mais mel; chuva atrapalha. '+(B.suit?'Você tem o macacão de apicultor.':'Sem macacão você leva ferroadas!')+'</div></div>'
  +'<div class="btns"><button class="b gold" data-act="hivebuy">Comprar caixa + enxame R$ 600</button>'+(B.suit?'':'<button class="b gold" data-act="suitbuy">Macacão de apicultor R$ 450</button>')+(B.honey>=1?'<button class="b" data-act="honey">🍯 Colher o mel</button>':'')+'</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ITEMS,{la:{n:'Lã crua (kg)',ic:'🧶',cat:'animal',p:28},mel:{n:'Pote de mel',ic:'🍯',cat:'animal',p:38},leitecabra:{n:'Leite de cabra (L)',ic:'🥛',cat:'animal',p:9},couro:{n:'Couro cru',ic:'🟫',cat:'animal',p:180}});
Object.assign(ACT,{
 pigbuy(e){ensureB();if(S.pigs.length>=30)return toast('Chiqueiro cheio','bad');const v=e.v,p=v==='leitao'?350:v==='F'?1600:2200;if(S.money<p)return toast('Dinheiro insuficiente','bad');cash(-p,'Porco');const a=v==='leitao'?mkPig(Math.random()<.5?'F':'M',30,15):mkPig(v,260,140);S.pigs.push(a);toast('🐖 '+a.name+' chegou ao chiqueiro','good')},
 pigsell(){const fat=S.pigs.filter(a=>a.w>=100&&a.age>=90);let t=0;fat.forEach(a=>{t+=Math.round(a.w*9*priceMult());S.pigs.splice(S.pigs.indexOf(a),1)});cash(t,'Venda de porcos');toast('🐖 '+fat.length+' porcos vendidos: '+R$(t),'good')},
 flbuy(e){ensureB();if(S.flock.length>=24)return toast('Aprisco cheio','bad');const[sp,sx]=e.v.split(':'),p=sp==='ovelha'?(sx==='F'?900:1200):(sx==='F'?800:1000);if(S.money<p)return toast('Dinheiro insuficiente','bad');cash(-p,sp);const a=mkFlock(sp,sx,300);S.flock.push(a);toast((sp==='ovelha'?'🐑 ':'🐐 ')+a.name+' chegou ao aprisco','good')},
 tosquia(){let kg=0;S.flock.filter(a=>a.sp==='ovelha'&&a.wool>=80).forEach(a=>{const k=Math.round(2+a.wool/100*2.5);kg+=k;a.wool=0});const got=addItem('la',kg);gainXP(4+kg/2,'tosquia');toast('✂️ Tosquia feita: '+got+' kg de lã','good')},
 hivebuy(){ensureB();if(S.bees.hives>=8)return toast('Apiário cheio (8 caixas)','bad');if(S.money<600)return toast('Dinheiro insuficiente','bad');cash(-600,'Caixa de abelhas');S.bees.hives++;toast('🐝 Nova caixa de abelhas instalada','good')},
 suitbuy(){if(S.money<450)return toast('Dinheiro insuficiente','bad');cash(-450,'Macacão de apicultor');S.bees.suit=1;toast('🐝 Macacão de apicultor comprado','good')},
 honey(){const B=S.bees,n=Math.floor(B.honey);if(n<1)return;const got=addItem('mel',n);B.honey-=got;if(!B.suit){const st=ri(2,5);P.hp=Math.max(5,P.hp-st*4);P.hurt=.7;toast('🐝 Ai! '+st+' ferroadas (-'+st*4+' vida). Compre o macacão!','bad')}gainXP(3+got,'mel');toast('🍯 Você colheu '+got+' potes de mel','good')}
});
// ---- matadouro e açougue
const MEAT={boi:{n:'Carne bovina',ic:'🥩',ppk:24},porco:{n:'Carne suína',ic:'🥓',ppk:16},cordeiro:{n:'Carne de cordeiro',ic:'🍖',ppk:30},cabrito:{n:'Carne de cabrito',ic:'🍖',ppk:28}};
const camCap=()=>S.camCap||800;
const camKg=()=>S.camara.reduce((s,c)=>s+c.kg,0);
const SL={a:null,kind:null,step:0,t:0,iv:null};
const SLSTEPS=[['⚡','Insensibilizar (abate humanitário)'],['🩸','Sangria'],['🧼','Esfola e limpeza'],['🔪','Cortes e embalagem']];
function slaughterModal(){ensureB();reModal=slaughterModal;
 if(S.abateD.d!==S.day){S.abateD={d:S.day,n:0}}
 const cows=S.herd.filter(a=>a.age>=300&&!a.preg&&!a.labor&&a.w>=250),pigs=S.pigs.filter(a=>a.w>=80),sh=S.flock.filter(a=>a.w>=25&&a.age>=120),left=4-S.abateD.n;
 const row=(ic,a,v,kind)=>'<div class="card" style="padding:4px 8px"><div class="row"><b>'+ic+' '+a.name+'</b><span>'+Math.round(a.w)+' kg → ~'+Math.round(a.w*yieldOf(kind))+' kg de carne</span></div><div class="btns"><button class="b gold" data-act="slgo" data-v="'+kind+':'+a.id+'">Abater</button></div></div>';
 showModal('<h3>🔪 Matadouro — mesa de abate</h3><div class="card">Hoje a equipe ainda dá conta de <b>'+left+'</b> animais. Câmara fria: '+Math.round(camKg())+'/'+camCap()+' kg.<div class="dim">A carne vai para a câmara fria. Venda no Açougue do Tonho, na vila: rende bem mais que vender vivo.</div></div>'
  +(cows.length?'<div class="sec">GADO</div>'+cows.slice().sort((a,b)=>b.w-a.w).slice(0,20).map(a=>row('🐄',a,0,'boi')).join(''):'')
  +(pigs.length?'<div class="sec">PORCOS</div>'+pigs.map(a=>row('🐖',a,0,'porco')).join(''):'')
  +(sh.length?'<div class="sec">OVELHAS E CABRAS</div>'+sh.map(a=>row(a.sp==='ovelha'?'🐑':'🐐',a,0,a.sp==='ovelha'?'cordeiro':'cabrito')).join(''):'')
  +(!cows.length&&!pigs.length&&!sh.length?'<div class="dim">Nenhum animal no ponto de abate.</div>':'')
  +(S.camCap?'':'<div class="btns"><button class="b" data-act="camup">Ampliar câmara fria para 2.500 kg — R$ 20.000</button></div>')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
const yieldOf=k=>k==='boi'?.52:k==='porco'?.75:.48;
function slRender(){const b=$('slbox');if(!b)return;b.innerHTML=SLSTEPS.map((s,i)=>'<div class="row" style="opacity:'+(i<SL.step?.5:1)+'"><span>'+s[0]+' '+s[1]+'</span><span>'+(i<SL.step?'✅':i===SL.step?'<span style="display:inline-block;width:70px;height:8px;background:#1c120b;vertical-align:middle"><i style="display:block;height:100%;width:'+Math.min(100,SL.t/2.2*100)+'%;background:#e0a431"></i></span>':'')+'</span></div>').join('')+(SL.step<4?'<div class="btns" style="justify-content:center"><button class="b gold" data-act="slhold" style="font-size:18px;padding:10px 20px">'+SLSTEPS[SL.step][0]+' Segure: '+SLSTEPS[SL.step][1]+'</button></div>':'')}
let SLHOLD=0;
document.addEventListener('pointerdown',e=>{if(e.target.closest('[data-act="slhold"]'))SLHOLD=1});document.addEventListener('pointerup',()=>SLHOLD=0);
addEventListener('keydown',e=>{if(SL.a&&(e.key===' '||e.key==='Enter')){SLHOLD=1;e.preventDefault()}});addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')SLHOLD=0});
Object.assign(ACT,{
 slgo(e){const[kind,id]=e.v.split(':');if(S.abateD.n>=4)return toast('A equipe já abateu 4 animais hoje. Volte amanhã.','bad');
  const a=kind==='boi'?S.herd.find(x=>x.id==id):kind==='porco'?S.pigs.find(x=>x.id==id):S.flock.find(x=>x.id==id);if(!a)return;
  const kg=Math.round(a.w*yieldOf(kind));if(camKg()+kg>camCap())return toast('Câmara fria cheia! Venda carne no açougue primeiro.','bad');
  Object.assign(SL,{a,kind,step:0,t:0});reModal=null;showModal('<h3>🔪 Abate: '+a.name+'</h3><div class="dim">Segure o botão (ou a barra de espaço) em cada etapa.</div><div id="slbox" class="card"></div>');slRender();
  clearInterval(SL.iv);SL.iv=setInterval(()=>{if(!$('slbox')){clearInterval(SL.iv);SL.a=null;return}if(SLHOLD&&SL.step<4){SL.t+=.05;if(SL.t>=2.2){SL.step++;SL.t=0;if(SL.step>=4){slDone();return}}slRender()}},50)},
 slhold(){},
 camup(){if(S.money<20000)return toast('Dinheiro insuficiente','bad');cash(-20000,'Câmara fria maior');S.camCap=2500;toast('❄️ Câmara fria ampliada para 2.500 kg','good')}
});
function slDone(){clearInterval(SL.iv);const a=SL.a,k=SL.kind,kg=Math.round(a.w*yieldOf(k));let ppk=MEAT[k].ppk;
 if(k==='boi'){ppk*=BREEDS[a.breed].pm*(.85+.15*(a.hp/100));S.herd.splice(S.herd.indexOf(a),1);SP.delete(a.id);addItem('couro',1)}else if(k==='porco')S.pigs.splice(S.pigs.indexOf(a),1);else S.flock.splice(S.flock.indexOf(a),1);
 S.camara.push({t:k,kg,ppk:Math.round(ppk*100)/100,n:a.name,breed:a.breed||null});S.abateD.n++;S.abateN=(S.abateN||0)+1;gainXP(12+kg/40,'abate');SL.a=null;
 const b=$('slbox');if(b)b.innerHTML='<div style="text-align:center;font-size:36px">'+MEAT[k].ic+'❄️</div><div style="text-align:center">'+kg+' kg de '+MEAT[k].n.toLowerCase()+' guardados na câmara fria.'+(k==='boi'?'<br>+1 couro cru no inventário.':'')+'</div><div class="btns" style="justify-content:center"><button class="b gold" data-act="close">OK</button></div>'}
function camaraModal(){ensureB();reModal=camaraModal;const T={};S.camara.forEach(c=>{T[c.t]=T[c.t]||{kg:0,v:0};T[c.t].kg+=c.kg;T[c.t].v+=c.kg*c.ppk});
 showModal('<h3>❄️ Câmara fria</h3><div class="card">'+Math.round(camKg())+'/'+camCap()+' kg</div>'+(Object.keys(T).length?Object.keys(T).map(k=>'<div class="card"><div class="row"><b>'+MEAT[k].ic+' '+MEAT[k].n+'</b><span>'+Math.round(T[k].kg)+' kg</span></div><div class="dim">Valor no açougue: ~'+R$(T[k].v*priceMult())+'</div></div>').join(''):'<div class="dim">Vazia.</div>')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function acougueModal(){ensureB();reModal=acougueModal;const tot=S.camara.reduce((s,c)=>s+c.kg*c.ppk,0)*priceMult(),kg=camKg();
 showModal('<h3>🥩 Açougue do Tonho</h3><div class="card">“Carne boa, limpa e bem cortada eu compro tudo!”<div class="dim">O Tonho busca a carne da sua câmara fria. Preço por kg: bovina R$ '+MEAT.boi.ppk+' × raça (Wagyu vale muito mais), suína R$ '+MEAT.porco.ppk+', cordeiro R$ '+MEAT.cordeiro.ppk+', cabrito R$ '+MEAT.cabrito.ppk+'. Feira e amizade aumentam o preço.</div></div>'
  +(kg?'<div class="card"><div class="row"><b>Na sua câmara: '+Math.round(kg)+' kg</b><span class="gold">'+R$(tot)+'</span></div><div class="btns"><button class="b gold" data-act="meatsell">Vender toda a carne</button></div></div>':'<div class="dim">'+(hasB('matadouro')?'Sua câmara fria está vazia. Abata animais no matadouro.':'Você ainda não tem matadouro. Construa no menu 🏗️ Obras (nível 8).')+'</div>')
  +((S.inv.couro||0)?'<div class="card"><div class="row"><b>🟫 Couro cru ×'+S.inv.couro+'</b><span class="gold">'+R$(S.inv.couro*180*priceMult())+'</span></div><div class="btns"><button class="b" data-act="courosell">Vender couros</button></div></div>':'')
  +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ACT,{
 meatsell(){const t=Math.round(S.camara.reduce((s,c)=>s+c.kg*c.ppk,0)*priceMult()),kg=camKg();if(!kg)return;S.camara=[];cash(t,'Açougue: '+Math.round(kg)+' kg de carne');S.meatSold=(S.meatSold||0)+kg;gainXP(10+kg/50,'açougue');toast('🥩 Tonho comprou '+Math.round(kg)+' kg de carne: '+R$(t),'good')},
 courosell(){const n=S.inv.couro||0;if(!n)return;takeItem('couro',n);const t=Math.round(n*180*priceMult());cash(t,'Couros');toast('🟫 '+n+' couros vendidos: '+R$(t),'good')}
});
// ---- aba Obras
function pObras(){ensureB();
 let h='<div class="card"><b>🏗️ Obras da fazenda</b><div class="dim">Escolha a construção, ande até o local (verde = pode) e contrate o pedreiro. Ele trabalha das 7h às 17h e você acompanha a obra subindo dia a dia.</div></div>';
 if(S.obra){const o=S.obra,B=BT[o.type];h+='<div class="card" style="border-color:#e0a431"><b>🧱 Em obra: '+B.ic+' '+B.n+'</b>'+bar(obraP()*100,'#e0a431')+'<div class="dim">'+Math.round(obraP()*100)+'% · faltam ~'+Math.max(0,Math.ceil(o.days*(1-obraP())))+' dias · '+o.crew+' pedreiro(s)</div></div>'}
 h+='<div class="sec">CONSTRUÇÕES</div>'+Object.keys(BT).map(k=>{const B=BT[k],own=hasB(k),lock=LV()<B.lv;return '<div class="card '+(lock?'lock':'')+'"><div class="row"><b>'+B.ic+' '+B.n+'</b><span class="gold">'+R$(B.cost)+'</span></div><div class="dim">'+B.d+'</div><div class="dim">⏱️ '+B.days+' dias de obra · '+B.w+'×'+B.h+' · requer nível '+B.lv+'</div><div class="btns">'+(own?'<span class="grn">✅ Construído</span>':S.obra&&S.obra.type===k?'<span class="gold">Em obra</span>':lock?'<span class="red">Nível '+B.lv+'</span>':'<button class="b gold" data-act="build" data-v="'+k+'">Escolher local</button>')+'</div></div>'}).join('');
 h+='<div class="sec">TERRENOS</div>'+LOTS.map(l=>{const own=S.lots[l.id],lock=LV()<l.lv;return '<div class="card '+(lock&&!own?'lock':'')+'"><div class="row"><b>🗺️ '+l.n+'</b><span class="gold">'+(own?'Seu':R$(l.p))+'</span></div><div class="dim">'+(l.x1-l.x0+1)+'×'+(l.y1-l.y0+1)+' de área'+(own?'':' · requer nível '+l.lv)+'</div><div class="btns">'+(own?'<span class="grn">✅ Seu</span>':lock?'<span class="red">Nível '+l.lv+'</span>':'<button class="b gold" data-act="lotbuy" data-v="'+l.id+'">Comprar terreno</button>')+'</div></div>'}).join('');
 return h;
}
Object.assign(ACT,{
 build(e){startPlace(e.v)},
 lotbuy(e){ensureB();const l=LOTS.find(x=>x.id===e.v);if(!l||S.lots[l.id])return;if(LV()<l.lv)return toast('Requer nível '+l.lv,'bad');if(S.money<l.p)return toast('Dinheiro insuficiente','bad');cash(-l.p,'Terreno: '+l.n);S.lots[l.id]=1;gainXP(40,'terreno');toast('🗺️ '+l.n+' agora é seu! Mais espaço para construir.','good')}
});
Object.assign(UNL,{});UNL[4]+=' · Apiário · Lote Leste';UNL[5]+=' · Chiqueiro';UNL[6]+=' · Aprisco';UNL[7]+=' · Lote Sul';UNL[8]=(UNL[8]||'')+' · Matadouro';
GUIDE.push({lv:4,ic:'🏗️',t:'Obras e terrenos',h:'No menu 🏗️ Obras você escolhe a construção, anda até o local (verde = pode, vermelho = não) e contrata o pedreiro. Ele trabalha de dia e a obra sobe aos poucos: estacas, alicerce, paredes, telhado. Com 2 pedreiros sai mais rápido. Compre terrenos vizinhos para ter mais espaço.'},
 {lv:4,ic:'🐝',t:'Abelhas',h:'Apiário (nível 4): compre caixas com enxame e colha o mel. Use o macacão para não levar ferroadas. A seca com flores dá mais mel.'},
 {lv:5,ic:'🐖',t:'Porcos',h:'Chiqueiro (nível 5): compre leitões, uma matriz e um cachaço. Porcas dão 6–10 leitões. Com 100 kg o porco está gordo: venda vivo ou leve ao matadouro.'},
 {lv:6,ic:'🐑',t:'Ovelhas e cabras',h:'Aprisco (nível 6): ovelhas dão lã a cada ~2 meses (tosquia) e cabras dão leite depois de parir.'},
 {lv:8,ic:'🔪',t:'Matadouro e açougue',h:'Matadouro (nível 8, 20 dias de obra): entre, use a mesa de abate e siga as etapas. A carne vai para a câmara fria. Venda ao Tonho, no Açougue da vila: paga bem mais que vender o animal vivo. O couro também vale dinheiro.'});
