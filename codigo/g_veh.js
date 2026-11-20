// ===== Veículos: caminhonete de caça (cães na caçamba), trator e chalana =====
const VEH={
 pick:{n:'Caminhonete de caça 4x4',ic:'🛻',p:95000,lv:4,spd:235,shop:'ze',d:'Picape com gaiola na caçamba para os cães, guincho, santo-antônio com faróis de caça e pneus de barro. Leva seus cães de escolta.'},
 trat:{n:'Trator',ic:'🚜',p:0,lv:1,spd:120,shop:null,d:'Comprado como melhoria na Casa Agro. Passe com ele na lavoura: colhe, rega e planta sozinho.'},
 boat:{n:'Chalana pantaneira',ic:'🚤',p:28000,lv:3,spd:150,shop:'zeca',d:'Barco de madeira com motor de rabeta. Navega nos rios, lagos e campos alagados do Pantanal. Pesca embarcada com peixes maiores.'}
};
const VPARK={pick:{x:4*TS+8,y:48*TS+4,dir:3},trat:{x:24*TS+4,y:49*TS+8,dir:3},boat:null};
function ensureV(){if(!S.veh)S.veh={own:{},pos:{}};if(S.up.trator)S.veh.own.trat=1;return S.veh}
const vOwn=k=>{const V=ensureV();return!!V.own[k]};
function vPos(k){const V=ensureV();if(!V.pos[k]){if(k==='boat'){const p=boatDock();V.pos[k]={x:p.x,y:p.y,dir:3}}else V.pos[k]={...VPARK[k]}}return V.pos[k]}
function boatDock(){let best=null,bd=1e9;for(let y=70;y<76;y++)for(let x=138;x<148;x++){if(G[ti(x,y)]!==2)continue;const d=Math.hypot(x-143,y-73);if(d<bd){bd=d;best={x:x*TS+8,y:y*TS+10}}}return best||{x:118*TS,y:60*TS}}
const isWaterT=(x,y)=>{const tx=Math.floor(x/TS),ty=Math.floor(y/TS);return G[ti(tx,ty)]===2||(typeof FLB!=='undefined'&&FLB>0&&FLOOD[ti(tx,ty)])};
// ---------- entrar / sair
let ENG=null;
function engine(on,kind){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(on&&!ENG){const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o2.type='square';o.frequency.value=kind==='trat'?38:kind==='boat'?55:46;o2.frequency.value=o.frequency.value*1.5;g.gain.value=0;o.connect(g);o2.connect(g);g.connect(AC.destination);o.start();o2.start();ENG={o,o2,g}}
 else if(!on&&ENG){ENG.g.gain.value=0;ENG.o.stop();ENG.o2.stop();ENG=null}}catch(e){}}
function vEnter(k){const p=vPos(k);if(S.horseOn)S.horseOn=false;P.aim=0;AIM.bin=0;P.sneak=0;P.drive=k;P.x=p.x;P.y=p.y;P.dir=p.dir||3;P.vx=P.vy=0;engine(true,k);
 const dogs=k==='pick'?rideDogs().length:0;toast(VEH[k].ic+' '+VEH[k].n+(dogs?' · '+dogs+' cão(es) na caçamba':'')+'. '+(isTouch?'✋':'[E]')+' para sair.','good')}
function vExit(){const k=P.drive;if(!k)return;const p=vPos(k);p.x=P.x;p.y=P.y;p.dir=P.dir;
 if(k==='boat'){let ok=null;for(const[dx,dy]of[[0,18],[0,-18],[18,0],[-18,0],[0,30],[30,0],[-30,0],[0,-30]]){const x=P.x+dx,y=P.y+dy;if(!isWaterT(x,y)&&!solidAt(x,y-2)){ok=[x,y];break}}if(!ok)return toast('Chegue perto da margem para descer','bad');P.drive=null;engine(false);P.x=ok[0];P.y=ok[1]}
 else{P.drive=null;engine(false);for(const[dx,dy]of[[0,16],[0,-16],[-24,0],[24,0]]){if(!solidAt(P.x+dx,P.y+dy-2)){P.x+=dx;P.y+=dy;break}}}
 rideDogs().forEach((d,i)=>{const r=dogRT(d);r.x=P.x+(i%2?10:-10);r.y=P.y+6;r.st='follow'});toast('Você desceu')}
// ---------- movimento
const _giV=getInput;getInput=function(){const r=_giV();if(P.drive){r.run=false;P.sneak=0}return r};
const vSpd=k=>{const tx=Math.floor(P.x/TS),ty=Math.floor((P.y-2)/TS),g=G[ti(tx,ty)];if(k==='boat')return VEH.boat.spd;const b=VEH[k].spd;return b*(g===3?1.12:g===1?.62:g===5?.55:g===4?.85:.8)};
const _mpV=movePlayer;
movePlayer=function(dx,dy){const k=P.drive;if(!k)return _mpV(dx,dy);const f=vSpd(k)/70;dx*=f;dy*=f;
 if(k==='boat'){const nx=P.x+dx,ny=P.y+dy;if(isWaterT(nx,P.y))P.x=nx;if(isWaterT(P.x,ny))P.y=ny;return}
 if(floodAt&&floodAt(P.x+dx,P.y+dy)){dx*=.3;dy*=.3}
 return _mpV(dx,dy)};
let vT=0,lastTend=0;
const _updV=update;
update=function(dt){_updV(dt);if(!S)return;const k=P.drive;
 if(k){P.aim=0;if(inRoom()){vExit()}const sp=Math.hypot(P.vx,P.vy);if(ENG){ENG.g.gain.value=.018+Math.min(.02,sp/9000);ENG.o.frequency.value=(k==='trat'?34:k==='boat'?50:42)+sp*.14;ENG.o2.frequency.value=ENG.o.frequency.value*1.5}
  if(k==='pick')rideDogs().forEach(d=>{const r=dogRT(d);r.x=P.x;r.y=P.y;r.st='follow';r.moving=0});
  if(k==='trat'&&playerInField()){lastTend+=dt;if(lastTend>.5){lastTend=0;tractorTend()}}
  vT+=dt}};
function tractorTend(){const fr=fieldRect();let ha=0,pl=0,wa=0;for(let ty=fr[1];ty<=fr[3];ty++)for(let tx=fr[0];tx<=fr[2];tx++){const cx=tx*TS+8,cy=ty*TS+8;if(Math.hypot(cx-P.x,cy-(P.y-4))>30)continue;const c=cropAt(tx,ty);
 if(c){if(cropStage(c)>=3){if(addItem(c.c,cropYield(c))){ha++;gainXP(CROPS[c.c].xp*.6,'colheita');S.crops.splice(S.crops.indexOf(c),1);CMAP.delete(ty*MW+tx)}}else if(!c.w){c.w=1;wa++}}
 else{const sd='seed_'+S.selSeed;if(hasItem(sd,1)&&CROPS[S.selSeed].lv<=LV()){takeItem(sd,1);const n={x:tx,y:ty,c:S.selSeed,age:0,w:1};S.crops.push(n);CMAP.set(ty*MW+tx,n);pl++}}}
 if(ha||pl||wa)tt('trat','🚜 Trator: '+[ha?'colheu '+ha:'',pl?'plantou '+pl:'',wa?'regou '+wa:''].filter(Boolean).join(', '),'good',1.2)}
// ---------- interações
const _ilV=interactList;
interactList=function(){if(P.drive)return[{x:P.x,y:P.y-4,r:60,label:'🚪 Sair '+(P.drive==='boat'?'da chalana':P.drive==='trat'?'do trator':'da caminhonete'),fn:vExit}];
 const L=_ilV();if(inRoom())return L;ensureV();
 for(const k of Object.keys(VEH)){if(!vOwn(k))continue;const p=vPos(k);if(Math.hypot(p.x-P.x,p.y-P.y)<70)L.push({x:p.x,y:p.y-6,r:k==='boat'?40:30,label:VEH[k].ic+' '+(k==='boat'?'Subir na chalana':'Dirigir '+(k==='trat'?'o trator':'a caminhonete')),fn:()=>vEnter(k)})}
 return L};
// cães não aparecem andando enquanto estão na caçamba
const _ddV=drawDog;drawDog=function(g,d){if(P.drive==='pick'&&rideDogs().includes(d))return;_ddV(g,d)};
// mira e cômodos bloqueados dirigindo
const _fireV=typeof fire==='function'?fire:null;
addEventListener('keydown',e=>{if(P&&P.drive&&['q','r','b','c','g','x','v','z','f'].includes(e.key.toLowerCase())){e.stopImmediatePropagation();if(e.key.toLowerCase()==='q'||e.key.toLowerCase()==='g')tt('drv','Desça do veículo primeiro ('+(isTouch?'✋':'E')+')','bad',1.5)}},true);
// ---------- desenho
function drawPickup(g,x,y,dir,drv){const side=dir>=2,d=dir===3?1:-1,c='#3a4a32',dk='#26301f',lt='#55684a',hl=S.t*24>=18||S.t*24<5.5;
 const r=(col,dx,dy,w,h)=>Rr(g,col,side?(d>0?x+dx:x-dx-w):x+dx,y+dy,w,h);
 if(side){Rr(g,'rgba(0,0,0,.32)',x-36,y-2,72,6);
  // caçamba com gaiola
  r(dk,-34,-20,34,13);r(c,-34,-20,34,2.4);r(lt,-34,-20,34,.8);for(let i=0;i<7;i++)r('#2a2a2a',-33+i*5.3,-32,1.2,12);r('#2a2a2a',-34,-33,34,1.6);r('#2a2a2a',-34,-26,34,1);
  // cães sentados
  if(drv&&partyDogs){rideDogs().slice(0,3).forEach((dg,i)=>{const v=DOGS[dg.breed].v;drawDogSprite(g,side?(d>0?x-26+i*10:x+26-i*10):x,y-17,d,v,'sit',0,{pant:1,wag:(frame>>3)&1,arm:dg.arm||0,col:dg.col||0})});for(let i=0;i<7;i++)r('rgba(40,40,40,.85)',-33+i*5.3,-27,1,6)}
  // cabine
  r(c,0,-30,20,23);r(lt,0,-30,20,1.6);r('#1a2a3a',3,-28,14,9);r('#7ab0d0',4,-27,6,7);r('#a8d8f0',11,-27,5,7);r(dk,9.5,-28,1.2,9);
  if(drv){r('#c89a70',6,-25,4,4);r('#7a4a2a',5.5,-27,5,1.6)}
  r(c,20,-21,16,14);r(lt,20,-21,16,1.4);r(dk,20,-14,16,1);r('#222',33,-18,3,6);r(hl&&drv?'#fff8c0':'#d8d0a0',35,-19,2,3);r('#aaa',36,-13,4,4);r('#555',38,-12,3,2);
  // santo-antônio com faróis de caça
  r('#1a1a1a',-2,-36,2,8);r('#1a1a1a',-2,-36,22,1.8);for(let i=0;i<3;i++)r(hl&&drv?'#fff8c0':'#c8c8b0',3+i*6,-39,4,3);
  r('#8a8a8a',-36,-10,3,3);r('#2a2a2a',-35,-8,72,2);
  // rodas
  for(const wx of[-28,22]){r('#141414',wx,-11,12,12);r('#3a3a3a',wx+2,-9,8,8);r('#9a9aa0',wx+4,-7,4,4);r('#141414',wx+1,-12,10,1.4)}
  r('#5a3a22',-30,-12,8,1);r('#5a3a22',24,-12,8,1)}
 else{const front=dir===0;Rr(g,'rgba(0,0,0,.32)',x-19,y-2,38,6);
  r('#141414',-19,-12,6,12);r('#141414',13,-12,6,12);r(c,-16,-34,32,28);r(lt,-16,-34,32,1.6);
  if(front){r('#1a2a3a',-12,-32,24,8);r('#7ab0d0',-11,-31,22,6);r('#a8d8f0',-11,-31,7,6);r(dk,-16,-22,32,8);r('#555',-10,-18,20,4);for(let i=0;i<5;i++)r('#333',-9+i*4,-18,1,4);r(hl&&drv?'#fff8c0':'#d8d0a0',-15,-20,5,3);r(hl&&drv?'#fff8c0':'#d8d0a0',10,-20,5,3);r('#888',-17,-10,34,3);r('#555',-3,-12,6,3)}
  else{r(dk,-14,-31,28,18);if(drv)rideDogs().slice(0,2).forEach((dg,i)=>{const v=DOGS[dg.breed].v;drawDogSprite(g,x-6+i*12,y-16,i?1:-1,v,'sit',0,{pant:1})});r('#2a2a2a',-15,-36,30,2);for(let i=0;i<6;i++)r('#2a2a2a',-14+i*5.4,-36,1,10);r('#b8302a',-15,-12,4,2);r('#b8302a',11,-12,4,2);r('#888',-17,-10,34,3)}
  if(drv&&front){r('#c89a70',-3,-30,5,4)}}
}
function drawTractorV(g,x,y,dir,drv){const side=dir>=2,d=dir===3?1:-1,r=(col,dx,dy,w,h)=>Rr(g,col,side?(d>0?x+dx:x-dx-w):x+dx,y+dy,w,h),Y='#d8a52a',G2='#2a6a2a';
 Rr(g,'rgba(0,0,0,.3)',x-22,y-2,44,5);
 if(side){r('#141414',-20,-22,20,22);r('#3a3a3a',-17,-19,14,14);r(Y,-13,-15,6,6);for(let i=0;i<8;i++){const a=i/8*6.283+(drv?frame*.08:0);r('#141414',-10+Math.cos(a)*10.5-1,-11+Math.sin(a)*10.5-1,2.4,2.4)}
  r(G2,-4,-34,16,16);r('#9ad0e0',-2,-32,12,9);r('#1a1a1a',-5,-35,18,2);r(Y,0,-18,24,9);r(shade(Y,-20),0,-11,24,2);r('#333',18,-26,2,9);if(drv&&((frame>>3)&1))r('rgba(90,90,90,.5)',17,-30,4,3);
  r('#141414',12,-11,11,11);r('#3a3a3a',14,-9,7,7);r(Y,16,-7,3,3);if(drv){r('#c89a70',2,-29,4,4);r('#d8c080',1,-31,6,1.6)}}
 else{r('#141414',-20,-18,7,18);r('#141414',13,-18,7,18);r(Y,-12,-22,24,14);r(G2,-9,-36,18,15);r('#9ad0e0',-7,-34,14,8);r('#1a1a1a',-10,-37,20,2);if(dir===0){r('#555',-6,-14,12,4);r('#fff8c0',-11,-16,3,2);r('#fff8c0',8,-16,3,2)}if(drv)r('#c89a70',-2,-31,4,4)}
}
function drawBoat(g,x,y,dir,drv){const side=dir>=2,d=dir===3?1:-1,r=(col,dx,dy,w,h)=>Rr(g,col,side?(d>0?x+dx:x-dx-w):x+dx,y+dy,w,h),bob=Math.sin(frame/18)*.8;y+=bob;
 if(side){Rr(g,'rgba(20,60,80,.35)',x-30,y-1,60,4);r('#6a4428',-26,-9,52,7);r('#8a5a32',-28,-11,56,3);r('#a87a48',-28,-11,56,1);r('#5a3a22',22,-14,8,6);r('#c84a2a',-26,-6,52,1.4);
  r('#7a5232',-12,-12,8,2);r('#7a5232',4,-12,8,2);r('#333',-30,-14,4,7);r('#555',-33,-8,2,6);if(drv&&Math.hypot(P.vx,P.vy)>10){for(let i=0;i<4;i++)r('rgba(230,245,250,.7)',-36-i*5,-2+(i%2),4,1.2)}
  if(drv){r('#c89a70',-25,-20,4,4)}}
 else{Rr(g,'rgba(20,60,80,.35)',x-10,y-1,20,4);r('#6a4428',-8,-26,16,24);r('#8a5a32',-9,-28,18,3);r('#a87a48',-9,-28,18,1);r('#7a5232',-7,-18,14,2);r('#7a5232',-7,-10,14,2);r('#333',-2,dir===1?-1:-32,4,4);if(drv)r('#c89a70',-2,-16,4,4)}}
const _dplV=drawPlayer;
drawPlayer=function(g){const k=P.drive;if(!k)return _dplV(g);
 if(k==='boat'){drawBoat(g,P.x,P.y,P.dir,1);g.save();g.translate(0,-10);_dplV(g);g.restore();return}
 if(k==='pick')drawPickup(g,P.x,P.y,P.dir,1);else{drawTractorV(g,P.x,P.y,P.dir,1)}};
const _evoV=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoV(L,x0,x1,y0,y1);if(inRoom())return;ensureV();
 for(const k of Object.keys(VEH)){if(!vOwn(k)||P.drive===k)continue;const p=vPos(k);if(p.x<x0-60||p.x>x1+60||p.y<y0-40||p.y>y1+40)continue;
  L.push([p.y,10,{draw:g=>{if(k==='pick')OL(g,p.x,p.y,80,46,c=>drawPickup(c,p.x,p.y,p.dir||3,0));else if(k==='trat')OL(g,p.x,p.y,50,40,c=>drawTractorV(c,p.x,p.y,p.dir||3,0));else drawBoat(g,p.x,p.y,p.dir||3,0)}}])}};
// o trator antigo parado vira o trator dirigível
const _dfsV=drawFarmStatic;
// faróis à noite
const _lpV=lampPos;lampPos=function(){const L=_lpV();if(P.drive&&P.drive!=='boat'&&(S.t*24>=18||S.t*24<5.5)){const fx=P.dir===3?40:P.dir===2?-40:0,fy=P.dir===0?30:P.dir===1?-30:0;L.push({x:P.x+fx,y:P.y+fy+6});L.push({x:P.x+fx*1.8,y:P.y+fy*1.8+6})}return L};
// ---------- compra
Object.assign(ACT,{vbuy(e){const k=e.v,V=VEH[k];ensureV();if(vOwn(k))return;if(LV()<V.lv)return toast('Requer nível '+V.lv,'bad');if(S.money<V.p)return toast('Dinheiro insuficiente','bad');cash(-V.p,V.n);S.veh.own[k]=1;S.veh.pos[k]=null;vPos(k);toast(V.ic+' '+V.n+' comprada! Está estacionada '+(k==='boat'?'no rio, perto da casa do pescador':'ao lado da sua casa')+'.','good');hideModal()}});
function vehCard(k){const V=VEH[k],own=vOwn(k);return '<div class="card '+(LV()<V.lv?'lock':'')+'"><div class="row"><b>'+V.ic+' '+V.n+'</b><span class="gold">'+R$(V.p)+'</span></div><div class="dim">'+V.d+' · requer nível '+V.lv+'</div><div class="btns">'+(own?'<span class="grn">✔ Você tem</span>':'<button class="b gold" data-act="vbuy" data-v="'+k+'">Comprar</button>')+'</div></div>'}
const _npcV=npcModal;npcModal=function(id){_npcV(id);const shop=id==='ze'?['pick']:id==='zeca'?['boat']:null;if(!shop)return;const mb=$('mbox'),b=[...mb.children].filter(c=>c.classList.contains('btns')).pop();const h='<div class="sec">VEÍCULOS</div>'+shop.map(vehCard).join('');if(b)b.insertAdjacentHTML('beforebegin',h);else mb.insertAdjacentHTML('beforeend',h);reModal=null};
// trator do upgrade antigo deixa de ser desenho fixo
if(typeof drawTractor==='function'){drawTractor=function(){}}
ACH.push(['pick','Caminhonete na estrada','Compre a caminhonete de caça',()=>!!(S.veh&&S.veh.own.pick),5000],['boat','Comandante','Compre a chalana pantaneira',()=>!!(S.veh&&S.veh.own.boat),3000]);
GUIDE.push({lv:3,ic:'🛻',t:'Veículos',h:'Caminhonete de caça (Zé, Casa Agro): dirija com WASD, seus cães de escolta vão na caçamba. Trator (melhoria da Casa Agro): passe na lavoura e ele colhe, rega e planta sozinho. Chalana (Zeca, pescador): navega no rio e no alagado do Pantanal. Chegue perto e use ✋/[E] para entrar e sair.'});
