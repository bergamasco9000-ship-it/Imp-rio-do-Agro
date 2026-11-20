// ===== Cavalo de verdade: fica onde você deixou, só monta de perto, vem no assobio e leva a caça no lombo (estilo RDR2)
const HMR=36;// distância para montar (px)
let HRIDE=null,HWAS=false,HLAST=null,HCALL=null;
function hRail(h){const L=idleHorses(),i=L.indexOf(h);if(i<0||i>2)return null;const p=railPos(i);return{x:p.x,y:p.y,dir:i%2?2:3,rail:1}}
function hWhere(h){if(!h)return null;if(S.horseOn&&h===S.horse)return{x:P.x,y:P.y,dir:P.dir};return h.pos||hRail(h)}
const hDist=h=>{const p=hWhere(h);return p?Math.hypot(p.x-P.x,p.y-P.y):1e9};
function hNear(){ensureHorses();const L=S.horses.filter(h=>!(S.horseOn&&h===S.horse)&&hDist(h)<HMR).sort((a,b)=>hDist(a)-hDist(b));if(!L.length)return null;if(L.includes(S.horse)&&S.horse.tame>=80)return S.horse;return L.find(h=>h.tame>=80)||L[0]}
const nearRail=(x,y)=>Math.abs(x-(RAIL.x+3)*TS)<5*TS&&Math.abs(y-RAIL.y*TS)<3*TS;
const railFree=()=>idleHorses().length<3;
// deixa o cavalo parado num lugar (ou amarrado na cocheira, se for perto dela)
function hPark(h,at){if(!h||!at||!isFinite(at.x)||!isFinite(at.y))return;
 if(nearRail(at.x,at.y)&&railFree()&&!(h.load&&h.load.length)){h.pos=null;return 'rail'}
 h.pos={x:Math.round(at.x),y:Math.round(at.y),dir:at.dir===undefined?3:at.dir};return 'here'}
function hMount(h){if(!h)return;if(h.tame<80)return toast('🐴 '+h.name+' ainda é xucro ('+Math.round(h.tame)+'% domado). Dome na cocheira antes de montar.','bad');
 const p=hWhere(h);if(HCALL&&HCALL.h===h)HCALL=null;S.horse=h;h.pos=null;
 if(p&&freeAt(p.x,p.y)){P.x=p.x;P.y=p.y}if(p&&p.dir!==undefined)P.dir=p.dir;P.vx=P.vy=0;
 S.horseOn=true;HRIDE=h;HWAS=true;HLAST={x:P.x,y:P.y,dir:P.dir};
 const n=hLoadFromBag(h,1);if(!n)toast('🐴 Você montou no '+h.name)}
function hStepAside(){const opts=P.dir>=2?[[0,13],[0,-13],[14,0],[-14,0]]:[[14,0],[-14,0],[0,13],[0,-13]];for(const[dx,dy]of opts)if(freeAt(P.x+dx,P.y+dy)){P.x+=dx;P.y+=dy;return}}
function hDismount(silent){const h=HRIDE||S.horse;S.horseOn=false;HWAS=false;HRIDE=null;if(!h)return;const w=hPark(h,{x:P.x,y:P.y,dir:P.dir});hStepAside();
 if(!silent)toast(w==='rail'?'🐴 '+h.name+' ficou amarrado na cocheira':'Você desmontou. O '+h.name+' fica esperando aqui 🐴')}
function hArrow(h){TIPT={f:()=>{if(inRoom())return null;const p=hWhere(h);return p&&!(S.horseOn&&S.horse===h)?{x:p.x,y:p.y,h:h.name}:null},until:Date.now()+90000}}
// botão 🐴 / tecla G: perto monta, montado desmonta, longe assobia
toggleHorse=function(){ensureHorses();if(!S.horses.length)return;if(P.drive)return;if(inRoom())return toast('🐴 Os cavalos ficam lá fora');
 if(S.horseOn)return hDismount();if(P.aim)return;
 const h=hNear();if(h)return hMount(h);
 const t=S.horse&&S.horse.tame>=80?S.horse:S.horses.find(q=>q.tame>=80);
 if(!t){const x=S.horse||S.horses[0];return toast('🐴 '+x.name+' ainda é xucro ('+Math.round(x.tame)+'% domado). Dome na cocheira antes de montar.','bad')}
 const p=hWhere(t);if(!p)return toast('🐴 O '+t.name+' está dentro da cocheira. Vá até lá.');
 const m=Math.round(Math.hypot(p.x-P.x,p.y-P.y)/TS);hArrow(t);
 if(HCALL&&HCALL.h===t)return toast('🎵 O '+t.name+' já está vindo ('+m+' m)...');
 try{whistleSnd()}catch(e){}
 if(m>70)return toast('🎵 Fiuuu... O '+t.name+' está longe demais para ouvir ('+m+' m). Siga a seta até ele.','bad');
 if(!t.pos)t.pos={x:p.x,y:p.y,dir:p.dir};HCALL={h:t,t:0,st:0,mv:0,ph:0};toast('🎵 Fiuuu! O '+t.name+' ouviu e está vindo ('+m+' m)','good')};
// ---------- carga de caça no lombo
const hLoadMax=h=>h.b==='quarto'||h.b==='pantaneiro'?360:280;
const hLoadKg=h=>(h.load||[]).reduce((s,c)=>s+c.kg,0);
function hCanTake(h,c){const L=h.load||[];if(hLoadKg(h)+c.kg>hLoadMax(h))return false;return hipSmall(c)?L.filter(hipSmall).length<4:L.filter(q=>!hipSmall(q)).length<2}
const bagKg=()=>S.h.bag.reduce((s,c)=>s+c.kg,0);
function hLoadFromBag(h,auto){ensureH();const bag=S.h.bag;if(!bag.length)return 0;h.load=h.load||[];const nm=[];
 for(let i=bag.length-1;i>=0;i--){const c=bag[i];if(hCanTake(h,c)){h.load.push(c);bag.splice(i,1);nm.push(SPECIES[c.sp].n)}}
 P.carry=bagKg();DRAG=null;
 if(nm.length){try{ifx('step','grass',10)}catch(e){}toast('🦌 '+nm.join(', ')+(nm.length>1?' amarrados':' amarrado')+' no lombo do '+h.name+(bag.length?' · '+bag.length+' não couberam':'')+' ('+Math.round(hLoadKg(h))+'/'+hLoadMax(h)+' kg)','good')}
 else if(!auto)toast('🐴 O '+h.name+' já está carregado demais ('+Math.round(hLoadKg(h))+'/'+hLoadMax(h)+' kg)','bad');
 return nm.length}
function hUnload(h,quiet){ensureH();if(!h||!h.load||!h.load.length)return 0;const n=h.load.length;S.h.bag.push(...h.load);h.load=[];P.carry=bagKg();if(!quiet)toast('📦 Você tirou '+n+' carcaça'+(n>1?'s':'')+' do lombo do '+h.name,'good');return n}
// desenho da caça no cavalo: o bicho atravessado no lombo, com a cabeça pendurada do nosso lado, e os pequenos no arreio
function hDrawLoad(g,h,x,y,dir){const L=h&&h.load;if(!L||!L.length||RMODE===4)return;
 const side=dir>=2,f=dir===3?1:-1,big=L.filter(c=>!hipSmall(c)),sm=L.filter(hipSmall),col=c=>(SPECIES[c.sp]&&SPECIES[c.sp].col)||'#8a6a4a';
 if(side){
  big.slice(0,2).forEach((c,i)=>{const W=wsz(c.sp),sc=clamp(19/W,.45,.85),cx=x-f*(7.8+i*3.4),cy=y-24.4+i*.5;
   g.save();g.beginPath();g.rect(x-40,cy-.4,80,40);g.clip();
   try{const pr=Object.assign(pkProxy(c.sp,cx,cy+W*.4,-f,c),{st:'idle',wait:9});drawShoulderCarcass(g,pr,cx,cy,sc,-f*Math.PI/2)}catch(e){}g.restore();
   const k=col(c);Rr(g,shade(k,-12),cx-3.2,cy-2.4,6.4,2.8);Rr(g,shade(k,14),cx-2.8,cy-2.6,5.6,.8);Rr(g,shade(k,-30),cx-3.2,cy+.2,6.4,.5);
   Rr(g,'#6a4a2a',cx-1.6,cy-2.8,.7,6.4);Rr(g,'#6a4a2a',cx+1.2,cy-2.8,.7,6.4)});
  sm.slice(0,4).forEach((c,i)=>{try{drawHip(g,c,x+f*(2.6+i*1.5),y-19.6+(i%2)*.5,f,1)}catch(e){}});
 }else{
  big.slice(0,2).forEach((c,i)=>{const k=col(c),yy=y-27.4-i*2.2;Rr(g,shade(k,-8),x-7,yy,14,3.2);Rr(g,shade(k,14),x-6.6,yy,13.2,.8);Rr(g,shade(k,-26),x-8.2,yy+1,1.8,5.4);Rr(g,shade(k,-26),x+6.4,yy+1,1.8,5.4);Rr(g,'#6a4a2a',x-.5,yy-.4,1,3.8)});
  sm.slice(0,2).forEach((c,i)=>{const k=col(c);Rr(g,k,x+(i?5.6:-7.6),y-21,2,4.4);Rr(g,shade(k,-20),x+(i?5.6:-7.6),y-17,2,1)});
 }}
const _dhs3=drawHorseS;drawHorseS=function(g,x,y,dir,b,o){_dhs3(g,x,y,dir,b,o);if(o&&o.id&&RMODE!==4&&S&&S.horses){const h=S.horses.find(q=>q.id===o.id);if(h&&h.load&&h.load.length)hDrawLoad(g,h,x,y,dir)}};
// carga pesa: o cavalo corre um pouco menos
const _hspd3=HSPD;HSPD=function(){const v=_hspd3(),h=S.horse;return h&&h.load&&h.load.length?v*clamp(1-hLoadKg(h)/1100,.74,1):v};
// montado, a caça que não coube vai na garupa (não arrasta corda)
const _dpbH3=drawPlayerBase;drawPlayerBase=function(g){if(S&&S.horseOn&&S.h&&S.h.bag&&S.h.bag.length&&!P.drive){const b=S.h.bag;S.h.bag=[];try{_dpbH3(g)}finally{S.h.bag=b}return}return _dpbH3(g)};
// para coletar um bicho abatido, você desce do cavalo (ele fica ali do lado)
const _spH3=startPick;startPick=function(a){if(S.horseOn&&!P.drive){hDismount(1);P.moving=false}return _spH3(a)};
// ---------- cavalo parado no mundo
const _evoH3=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoH3(L,x0,x1,y0,y1);if(!S||!S.horses||inRoom())return;
 for(const h of S.horses){const p=h.pos;if(!p||(S.horseOn&&h===S.horse))continue;if(p.x<x0-50||p.x>x1+50||p.y<y0-20||p.y>y1+60)continue;
  const call=HCALL&&HCALL.h===h,mv=call&&HCALL.mv,ph=call?HCALL.ph:0;
  L.push([p.y,10,{draw:g=>OL(g,p.x,p.y,40,44,c=>drawHorseS(c,p.x,p.y,p.dir,h.b,{mv,ph,saddle:h.tame>=80,graze:!mv&&((frame>>7)+(h.id%7))%3===0,id:h.id}))}])}};
const _ilH3=interactList;interactList=function(){const L=_ilH3();if(!S||!S.horses||inRoom()||P.drive)return L;ensureH();const bag=S.h.bag;
 for(const h of S.horses){if(S.horseOn&&h===S.horse)continue;const p=hWhere(h);if(!p||Math.hypot(p.x-P.x,p.y-P.y)>60)continue;const f=p.dir===3?1:p.dir===2?-1:0,rx=p.x-f*9,ry=p.y-6;
  if(h.tame>=80&&bag.length&&bag.some(c=>hCanTake(h,c)))L.push({x:rx,y:ry,r:34,label:'🦌 Amarrar a caça no '+h.name,fn:()=>hLoadFromBag(h)});
  else if(h.load&&h.load.length)L.push({x:rx,y:ry,r:30,label:'📦 Tirar a caça do '+h.name+' ('+h.load.length+')',fn:()=>hUnload(h)});
  if(h.pos&&h.tame>=80)L.push({x:p.x+f*3,y:p.y-8,r:26,label:'🐴 Montar no '+h.name,fn:()=>hMount(h)})}
 // peão busca cavalo solto longe
 const far=S.horses.filter(h=>h.pos&&!h.fetch&&Math.hypot(h.pos.x-RAIL.x*TS,h.pos.y-RAIL.y*TS)>30*TS);
 if(far.length&&!S.horseOn)L.push({x:RAIL.x*TS-10,y:RAIL.y*TS+8,r:24,label:'🤠 Peão: buscar o '+far[0].name+' (R$ 40)',fn:()=>{const h=far[0];if(S.money<40)return toast('Dinheiro insuficiente','bad');cash(-40,'Peão buscou cavalo');h.fetch=S.day;toast('🤠 O peão foi buscar o '+h.name+'. Amanhã cedo ele está na cocheira.','good')}});
 return L};
const _hdH3=hookDay;hookDay=function(){_hdH3();if(S&&S.horses)for(const h of S.horses)if(h.fetch!==undefined&&h.fetch<S.day&&!(S.horseOn&&h===S.horse)){h.pos=null;delete h.fetch}};
// cocheira: botão de montar no cavalo que está ali
const _hmH3=horseModal;horseModal=function(id){_hmH3(id);const h=S.horses&&S.horses.find(q=>q.id===id);const box=$('mbox');if(!h||!box||S.horseOn||h.tame<80)return;const b=box.querySelector('.btns');if(b)b.insertAdjacentHTML('afterbegin','<button class="b gold" data-act="hmount" data-v="'+h.id+'">🐴 Montar agora</button>')};
ACT.hmount=function(e){const h=S.horses.find(q=>q.id===+e.v);hideModal();if(!h)return;if(hDist(h)>70)return toast('Chegue perto do '+h.name+' para montar','bad');hMount(h)};
// loja do caçador / taxidermia: descarregar o cavalo que está aí na porta
function hNearLoaded(){return(S.horses||[]).find(h=>h.load&&h.load.length&&(S.horseOn&&h===S.horse||h.pos&&Math.hypot(h.pos.x-(RET&&inRoom()?RET.x:P.x),h.pos.y-(RET&&inRoom()?RET.y:P.y))<300))}
function hLoadCard(){const h=hNearLoaded();if(!h)return '';const v=h.load.reduce((s,c)=>s+carcassValue(c),0);
 return '<div class="card"><div class="row"><b>🐴 No lombo do '+h.name+'</b><span class="gold">'+R$(v)+'</span></div><div class="dim">'+h.load.map(c=>SPECIES[c.sp].n+' '+Math.round(c.kg)+' kg').join(' · ')+'</div><div class="btns"><button class="b gold" data-act="hunload" data-v="'+h.id+'">📦 Descarregar aqui</button></div></div>'}
ACT.hunload=function(e){const h=S.horses.find(q=>q.id===+e.v);if(h)hUnload(h)};
const _lmH3=lodgeModal;lodgeModal=function(sec){_lmH3(sec);if(LSEC!=='sell')return;const c=hLoadCard();if(!c)return;const box=$('mbox'),pl=box&&box.querySelector('.pills');if(pl)pl.insertAdjacentHTML('afterend',c)};
if(typeof taxiModal==='function'){const _txH3=taxiModal;taxiModal=function(){_txH3();const c=hLoadCard();if(!c)return;const box=$('mbox'),h3=box&&box.querySelector('h3');if(h3)h3.insertAdjacentHTML('afterend',c)}}
// ---------- estado: de onde você desceu (entrou em casa, no carro, mirou...) o cavalo fica lá
const _upH3=update;update=function(dt){
 if(S&&S.horses){if(HWAS&&!S.horseOn){const h=HRIDE||S.horse;if(h&&HLAST&&!h.pos){const at=Object.assign({},HLAST);if(inRoom()||P.drive){for(const dx of[22,-22,30,-30])if(freeAt(at.x+dx,at.y)){at.x+=dx;break}}hPark(h,at)}HRIDE=null}}
 _upH3(dt);if(!S||!S.horses)return;
 if(S.horseOn&&S.horse){if(S.horse.pos)S.horse.pos=null;HRIDE=S.horse;if(!inRoom()&&!P.drive&&isFinite(P.x)&&isFinite(P.y))HLAST={x:P.x,y:P.y,dir:P.dir}}
 HWAS=!!S.horseOn;
 if(HCALL){const h=HCALL.h,p=h.pos;if(!p||(S.horseOn&&S.horse===h)||!S.horses.includes(h)){HCALL=null;return}
  const dx=P.x-p.x,dy=P.y-p.y,d=Math.hypot(dx,dy);HCALL.t+=dt;
  if(d<22||inRoom()){HCALL=null;if(!inRoom()){p.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1);toast('🐴 O '+h.name+' chegou. Toque 🐴 para montar.','good')}return}
  const sp=(d>220?185:115)*dt,ux=dx/d,uy=dy/d;let ok=0;
  for(const a of[0,.55,-.55,1.1,-1.1,1.65,-1.65]){const c=Math.cos(a),s=Math.sin(a),vx=ux*c-uy*s,vy=ux*s+uy*c,nx=p.x+vx*sp,ny=p.y+vy*sp;if(freeAt(nx,ny)){p.x=nx;p.y=ny;ok=1;p.dir=Math.abs(vx)>Math.abs(vy)*.8?(vx>0?3:2):(vy>0?0:1);break}}
  HCALL.mv=ok;if(ok){HCALL.ph+=sp*.16;HCALL.st=0}else HCALL.st+=dt;
  if(HCALL.st>2.5||HCALL.t>50){toast('🐴 O '+h.name+' não achou caminho até você. Siga a seta até ele.','bad');hArrow(h);HCALL.mv=0;HCALL=null}}};
// mapa: onde estão os cavalos soltos
const _mmH3=mapModal;mapModal=function(){_mmH3.apply(this,arguments);const cv=document.getElementById('wmapc');if(!cv||!S.horses)return;const g=cv.getContext('2d'),s=4;g.textAlign='center';
 for(const h of S.horses){const p=h.pos;if(!p||(S.horseOn&&h===S.horse))continue;const x=p.x/TS*s,y=p.y/TS*s;g.fillStyle='#000';g.beginPath();g.arc(x,y,7,0,7);g.fill();g.fillStyle='#c8905a';g.beginPath();g.arc(x,y,5,0,7);g.fill();g.font='bold 12px monospace';g.lineWidth=3;g.strokeStyle='#000';g.strokeText('🐴 '+pclean(h.name),x,y-10);g.fillStyle='#ffe0b0';g.fillText('🐴 '+pclean(h.name),x,y-10)}};
// saves antigos / posição inválida: volta para a cocheira
{const fix=()=>{if(!S||!S.horses)return;for(const h of S.horses){const p=h.pos;if(p&&(!isFinite(p.x)||!isFinite(p.y)||p.y>=RZ*TS||p.x<XMIN*TS||p.x>=MW*TS||p.y<YMIN*TS))h.pos=null}};setTimeout(fix,1500);setInterval(fix,15000)}
if(typeof GUIDE!=='undefined')GUIDE.push({lv:2,ic:'🐴',t:'Cavalo de verdade',h:'O cavalo fica onde você desceu. Perto dele, o botão 🐴 monta. Longe, o 🐴 assobia e ele vem até você (até uns 70 m). Abateu um bicho? Desça, colete e chegue no cavalo: “Amarrar a caça” põe a carcaça no lombo (até 2 grandes e 4 pequenas). Na Loja do Caçador, “Descarregar aqui” para vender.'});
