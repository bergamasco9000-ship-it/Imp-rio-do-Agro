// ===== Interiores: cômodos personalizados para cada prédio =====
const RZ=168+EX; // linha onde começa a zona de interiores
const inRoomY=y=>y>=RZ*TS;
const inRoom=()=>P.y>=RZ*TS;
const CLERK={
 lodge:{n:'Seu Jorge',shirt:'#4d6b3a',hair:'#3a2a1a',hat:'#6b5a32',beard:1},
 banco:{n:'Gerente Sílvia',shirt:'#2a3a5a',hair:'#2a1a10',g:'f',pants:'#2a2a3a'},
 leilao:{n:'Leiloeiro Ademar',shirt:'#e8e0d0',hair:'#888',hat:'#3a2a1a',pants:'#3a2a1a'},
 igreja:{n:'Padre Antônio',shirt:'#1e1e24',hair:'#ccc',pants:'#1e1e24'},
 acougue:{n:'Tonho Açougueiro',shirt:'#f0f0f0',hair:'#222',pants:'#3a3a4a',apron:'#b03a2a',beard:1},
 posto:{n:'Guarda Cardoso',npc:'guarda'},pescador:{n:'Zeca',npc:'zeca'},agro:{n:'Zé do Campo',npc:'ze'},padaria:{n:'Dona Lourdes',npc:'lourdes'},
 vet:{n:'Dra. Marina',npc:'marina'},canil:{n:'Seu Tião',npc:'tiao'},delegacia:{n:'Xerife Ramos',npc:'ramos'},matadouro:{n:'Toninho (ajudante)',shirt:'#f0f0f0',hair:'#3a2a1a',pants:'#3a3a4a',apron:'#ddd'}
};
// k: tipo; x,y: tile dentro do cômodo; w,h: pegada sólida; act: interação
const ROOMDEF={
 house:{w:14,h:10,floor:'wood',wall:'#d8c49a',trim:'#7a5232',win:[3,10],items:[
  {k:'bed',x:1,y:2,w:2,h:2,act:'sleep'},{k:'wardrobe',x:3,y:2,w:2,h:1,act:'look'},{k:'fireplace',x:6,y:2,w:2,h:1},{k:'stove',x:11,y:2,w:2,h:1},{k:'sink',x:10,y:2,w:1,h:1},
  {k:'table',x:9,y:5,w:2,h:1},{k:'chair',x:8,y:5},{k:'chair',x:11,y:5},{k:'rug',x:5,y:4,w:0,h:0,rw:4,rh:3},{k:'sofa',x:5,y:6,w:3,h:1},{k:'gunrack',x:12,y:6,w:1,h:2,act:'guns'},{k:'dogbed',x:1,y:7},{k:'plant',x:12,y:8},{k:'plant',x:1,y:5}],
  wallx:[{k:'trophies',x:4},{k:'clock',x:9},{k:'frame',x:1}]},
 barn:{w:16,h:10,floor:'hay',wall:'#a63a2a',trim:'#5a1e14',win:[4,11],items:[
  {k:'hay',x:1,y:2,w:2,h:1},{k:'hay',x:1,y:3,w:2,h:1},{k:'hay',x:3,y:2,w:1,h:1},{k:'stall',x:6,y:2,w:1,h:2},{k:'stall',x:9,y:2,w:1,h:2},{k:'stall',x:12,y:2,w:1,h:2},
  {k:'sacks',x:13,y:6,w:2,h:1},{k:'desk',x:2,y:6,w:2,h:1,act:'herd'},{k:'cans',x:14,y:2,w:1,h:1},{k:'saddle',x:1,y:8}],wallx:[{k:'tools',x:4},{k:'tools',x:14}]},
 leilao:{w:16,h:11,floor:'wood',wall:'#e8dcc0',trim:'#7a1f1f',win:[2,13],items:[
  {k:'ring',x:5,y:4,w:6,h:3},{k:'bleach',x:1,y:2,w:3,h:2},{k:'bleach',x:12,y:2,w:3,h:2},{k:'podium',x:7,y:2,w:2,h:1,act:'shop'},{k:'clerk',x:8,y:2,dy:-2},{k:'chair',x:2,y:7},{k:'chair',x:3,y:7},{k:'chair',x:12,y:7},{k:'chair',x:13,y:7}],wallx:[{k:'board',x:4},{k:'flag',x:11}]},
 banco:{w:12,h:9,floor:'marble',wall:'#c8ccd4',trim:'#2f4a7a',win:[2,9],items:[
  {k:'counter',x:3,y:3,w:6,h:1,glass:1,act:'shop'},{k:'clerk',x:5,y:2},{k:'vault',x:9,y:2,w:2,h:1},{k:'plant',x:1,y:2},{k:'plant',x:10,y:6},{k:'rope',x:3,y:5,w:0,h:0},{k:'bench',x:1,y:6,w:2,h:1}],wallx:[{k:'frame',x:4},{k:'clock',x:7}]},
 agro:{w:14,h:9,floor:'wood',wall:'#d8c8a0',trim:'#2f6a3a',win:[2,11],items:[
  {k:'shelf',x:1,y:2,w:3,h:1,goods:'seeds'},{k:'shelf',x:10,y:2,w:3,h:1,goods:'tools'},{k:'counter',x:5,y:3,w:4,h:1,act:'shop'},{k:'clerk',x:7,y:2},{k:'sacks',x:1,y:6,w:2,h:1},{k:'sacks',x:11,y:6,w:2,h:1},{k:'barrel',x:4,y:6},{k:'talk',x:6,y:3,w:0,h:0,act:'npc'}],wallx:[{k:'poster',x:5},{k:'tools',x:9}]},
 delegacia:{w:12,h:9,floor:'concrete',wall:'#d0d4dc',trim:'#2f3a5a',win:[2],items:[
  {k:'desk',x:2,y:3,w:2,h:1,act:'npc'},{k:'clerk',x:3,y:2},{k:'cell',x:7,y:2,w:4,h:3},{k:'chair',x:2,y:5},{k:'plant',x:1,y:6},{k:'locker',x:5,y:2,w:1,h:1}],wallx:[{k:'wanted',x:1},{k:'wanted',x:4},{k:'flag',x:5}]},
 padaria:{w:12,h:9,floor:'check',wall:'#f0e0b8',trim:'#a8502a',win:[2,9],items:[
  {k:'oven',x:9,y:2,w:2,h:1},{k:'display',x:2,y:3,w:5,h:1,act:'npc'},{k:'clerk',x:4,y:2},{k:'table',x:2,y:6,w:1,h:1},{k:'chair',x:1,y:6},{k:'chair',x:3,y:6},{k:'table',x:8,y:6,w:1,h:1},{k:'chair',x:7,y:6},{k:'chair',x:9,y:6},{k:'shelf',x:7,y:2,w:2,h:1,goods:'bread'}],wallx:[{k:'menu',x:5}]},
 vet:{w:12,h:9,floor:'white',wall:'#e8f0f0',trim:'#2f7a6a',win:[2,9],items:[
  {k:'examtable',x:4,y:4,w:2,h:1},{k:'clerk',x:5,y:3},{k:'cabinet',x:1,y:2,w:2,h:1},{k:'cages',x:8,y:2,w:3,h:1},{k:'counter',x:7,y:5,w:3,h:1,act:'npc'},{k:'plant',x:1,y:6},{k:'scale',x:2,y:6}],wallx:[{k:'cross',x:6},{k:'frame',x:4}]},
 canil:{w:14,h:9,floor:'tile',wall:'#d8c8a0',trim:'#6a4a2a',win:[2,11],items:[
  {k:'kennel',x:1,y:2,w:3,h:2,breed:'kangal'},{k:'kennel',x:4,y:2,w:3,h:2,breed:'pastor'},{k:'kennel',x:7,y:2,w:3,h:2,breed:'beagle'},{k:'kennel',x:10,y:2,w:3,h:2,breed:'dogo'},
  {k:'counter',x:5,y:5,w:3,h:1,act:'npc'},{k:'clerk',x:6,y:4,dy:-1},{k:'shelf',x:1,y:6,w:2,h:1,goods:'pet'},{k:'bowls',x:10,y:6}],wallx:[{k:'bone',x:6}]},
 igreja:{w:12,h:12,floor:'stone',wall:'#e8e4dc',trim:'#5a5a6a',win:[1,10],stained:1,items:[
  {k:'altar',x:5,y:2,w:2,h:1,act:'pray'},{k:'carpet',x:5,y:3,w:0,h:0,rw:2,rh:8},{k:'clerk',x:4,y:2},
  {k:'pew',x:1,y:4,w:3,h:1},{k:'pew',x:8,y:4,w:3,h:1},{k:'pew',x:1,y:6,w:3,h:1},{k:'pew',x:8,y:6,w:3,h:1},{k:'pew',x:1,y:8,w:3,h:1},{k:'pew',x:8,y:8,w:3,h:1},{k:'candles',x:3,y:2},{k:'candles',x:8,y:2}],wallx:[{k:'crossbig',x:5}]},
 lodge:{w:14,h:10,floor:'wood',wall:'#7a5230',trim:'#3a2a1a',log:1,win:[2,11],items:[
  {k:'counter',x:5,y:4,w:4,h:1,act:'shop'},{k:'clerk',x:7,y:3},{k:'gunwall',x:1,y:2,w:3,h:1},{k:'gunwall',x:10,y:2,w:3,h:1},{k:'camorack',x:1,y:6,w:2,h:1},{k:'ammo',x:11,y:6,w:2,h:1},{k:'bearrug',x:5,y:6,w:0,h:0},{k:'fireplace',x:6,y:2,w:2,h:1}],wallx:[{k:'head',x:4,sp:'elk'},{k:'head',x:9,sp:'deer'}]},
 posto:{w:12,h:8,floor:'wood',wall:'#7a5230',trim:'#3a2a1a',log:1,win:[2,9],items:[{k:'freezer',x:8,y:2,w:2,h:1},{k:'counter',x:3,y:3,w:4,h:1,act:'shop'},{k:'clerk',x:5,y:2},{k:'scale',x:9,y:5},{k:'barrel',x:1,y:5}],wallx:[{k:'furs',x:1},{k:'head',x:6,sp:'boar'}]},
 pescador:{w:12,h:8,floor:'wood',wall:'#d8d0b0',trim:'#2f6a7a',win:[2,9],items:[{k:'aquarium',x:1,y:2,w:2,h:1},{k:'counter',x:4,y:3,w:4,h:1,act:'shop'},{k:'clerk',x:6,y:2},{k:'rods',x:9,y:2,w:2,h:1},{k:'barrel',x:10,y:5},{k:'boat',x:1,y:5,w:2,h:1}],wallx:[{k:'net',x:4},{k:'fishsign',x:7}]},
 acougue:{w:12,h:9,floor:'red',wall:'#f4f0ec',trim:'#a82a2a',win:[2,9],items:[{k:'meatcase',x:3,y:4,w:5,h:1,act:'shop'},{k:'clerk',x:5,y:3},{k:'hooks',x:1,y:2,w:3,h:1},{k:'hooks',x:8,y:2,w:3,h:1},{k:'scale',x:9,y:6},{k:'block',x:2,y:6,w:1,h:1}],wallx:[{k:'cutsign',x:5}]},
 matadouro:{w:12,h:9,floor:'white',wall:'#eef2f4',trim:'#5a6a7a',win:[2],items:[{k:'steeltable',x:3,y:4,w:3,h:1,act:'slaughter'},{k:'clerk',x:4,y:3},{k:'rail',x:1,y:2,w:4,h:1},{k:'coldroom',x:8,y:2,w:3,h:1,act:'camara'},{k:'sink',x:7,y:5},{k:'scale',x:9,y:6}],wallx:[{k:'cutsign',x:6}]}
};
const ROOMS={};
(function layout(){let cx=2,cy=RZ+2,rowH=0;for(const id in ROOMDEF){const r=ROOMDEF[id];if(cx+r.w>238){cx=2;cy+=rowH+2;rowH=0}ROOMS[id]=Object.assign({id,x:cx,y:cy},r);cx+=r.w+3;rowH=Math.max(rowH,r.h)}})();
const roomAt=(px,py)=>{const tx=Math.floor(px/TS),ty=Math.floor(py/TS);for(const id in ROOMS){const r=ROOMS[id];if(tx>=r.x&&tx<r.x+r.w&&ty>=r.y&&ty<r.y+r.h)return r}return null};
function carveRooms(){
 for(let y=RZ-1;y<MH;y++)for(let x=XMIN;x<MW;x++){G[ti(x,y)]=7;SOL[ti(x,y)]=1;FEN[ti(x,y)]=0}
 for(const id in ROOMS){const r=ROOMS[id];
  for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const wall=y<r.y+2||x===r.x||x===r.x+r.w-1||y===r.y+r.h-1;G[ti(x,y)]=8;SOL[ti(x,y)]=wall?1:0}
  r.door=r.x+Math.floor(r.w/2);SOL[ti(r.door,r.y+r.h-1)]=0;
  for(const it of r.items){if(!it.w)continue;for(let y=0;y<it.h;y++)for(let x=0;x<it.w;x++)SOL[ti(r.x+it.x+x,r.y+it.y+y)]=1}
 }
}
const _gwRm=genWorld;
genWorld=function(){_gwRm();
 for(let i=TREES.length-1;i>=0;i--)if(TREES[i].y>=(RZ-2)*TS)TREES.splice(i,1);
 for(let i=BUSH.length-1;i>=0;i--)if(BUSH[i].y>=(RZ-2)*TS)BUSH.splice(i,1);
 for(let i=DECO.length-1;i>=0;i--)if(DECO[i].y>=(RZ-2)*TS)DECO.splice(i,1);
 // açougue na vila
 for(let y=52;y<=60;y++)for(let x=93;x<=99;x++){SOL[ti(x,y)]=0;if(G[ti(x,y)]===2)G[ti(x,y)]=0}
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i];if(t.x>=133*TS&&t.x<141*TS&&t.y>=48*TS&&t.y<56*TS)TREES.splice(i,1)}
 for(let i=DECO.length-1;i>=0;i--){const t=DECO[i];if(t.x>=133*TS&&t.x<141*TS&&t.y>=48*TS&&t.y<56*TS)DECO.splice(i,1)}
 // (caminho do açougue antigo removido: a vila mudou)
 const ab=BLD.find(b=>b.id==='acougue');for(let y=ab.y;y<ab.y+ab.h;y++)for(let x=ab.x;x<ab.x+ab.w;x++)SOL[ti(x,y)]=1;
 carveRooms();prerender();
};
if(!BLD.some(b=>b.id==='acougue'))BLD.push({id:'acougue',x:134,y:50,w:6,h:5,door:136,roof:'#a82a2a',wall:'#f4f0ec',label:'Açougue do Tonho (vender carne)',sign:'AÇOUGUE'});
CURT.acougue='#e05050';
// ---- entrar / sair
let RET=null,FADE=0;
const fadeEl=document.createElement('div');fadeEl.style.cssText='position:fixed;inset:0;background:#000;z-index:30;pointer-events:none;opacity:0;transition:opacity .18s';document.body.appendChild(fadeEl);
function fade(fn){fadeEl.style.opacity=1;setTimeout(()=>{fn();setTimeout(()=>fadeEl.style.opacity=0,60)},190)}
function moveParty(x,y){rideDogs().forEach((d,i)=>{const r=dogRT(d);r.x=x+(i%2?14:-14);r.y=y+6+i*3;r.st=r.st==='hold'||r.st==='catch'?'follow':r.st});if(S.mate&&S.mate.task==='follow'){MATE.x=x+10;MATE.y=y+10}}
function enterRoom(id){
 const r=ROOMS[id],b=BLD.find(q=>q.id===id);if(!r||!b){enterBld(id);return}
 fade(()=>{RET={x:b.door*TS+8,y:(b.y+b.h)*TS+12};S.horseOn=false;P.aim=0;P.vx=P.vy=0;P.x=r.door*TS+8;P.y=(r.y+r.h-2)*TS+12;P.dir=1;camInit=0;moveParty(P.x,P.y-6)});
}
function exitRoom(){if(!RET){const b=BLD[0];RET={x:b.door*TS+8,y:(b.y+b.h)*TS+12}}const R=RET;fade(()=>{P.x=R.x;P.y=R.y;P.dir=0;P.vx=P.vy=0;camInit=0;RET=null;moveParty(P.x,P.y-4)})}
const _updRm=update;
update=function(dt){_updRm(dt);
 if(inRoom()){const r=roomAt(P.x,P.y);if(r&&Math.floor(P.y/TS)>=r.y+r.h-1&&!FADE){FADE=1;exitRoom();setTimeout(()=>FADE=0,500)}
  if(r)rideDogs().forEach(d=>{const q=dogRT(d);q.x=clamp(q.x,(r.x+1)*TS+8,(r.x+r.w-1)*TS-8);q.y=clamp(q.y,(r.y+2)*TS+8,(r.y+r.h-1)*TS-2)})}
};
// ---- desenho: piso e paredes
function drawFloorTile(g,f,x,y,tx,ty){
 const h=hs(tx*7,ty*3);
 if(f==='wood'||f==='hay'){Rr(g,(ty%2)?'#9a6a3a':'#a8743e',x,y,TS,TS);Rr(g,'#7a5028',x,y+7,TS,1);Rr(g,'#7a5028',x+((ty*5)%16),y,1,7);Rr(g,'#7a5028',x+((ty*5+8)%16),y+8,1,8);Rr(g,'#b8844a',x,y,TS,.8);if(f==='hay'&&h<.6)for(let i=0;i<4;i++)Rr(g,'#e0c060',x+((h*50+i*5)%15),y+((h*90+i*7)%15),3,1)}
 else if(f==='check'){Rr(g,(tx+ty)%2?'#f0ece4':'#3a3a42',x,y,TS,TS)}
 else if(f==='tile'||f==='white'){Rr(g,f==='white'?'#eef2f4':'#d8d0b8',x,y,TS,TS);Rr(g,f==='white'?'#c8d0d8':'#b8ae94',x,y,TS,1);Rr(g,f==='white'?'#c8d0d8':'#b8ae94',x,y,1,TS)}
 else if(f==='red'){Rr(g,(tx+ty)%2?'#c84a3a':'#f0ece4',x,y,TS,TS)}
 else if(f==='marble'){Rr(g,'#e8e6e2',x,y,TS,TS);Rr(g,'#c8c4bc',x,y,TS,1);Rr(g,'#c8c4bc',x,y,1,TS);if(h<.5)Rr(g,'#d4d0c8',x+3,y+((h*20)|0)%12,9,1)}
 else if(f==='stone'){Rr(g,'#a8a49c',x,y,TS,TS);Rr(g,'#8a867e',x,y+7,TS,1);Rr(g,'#8a867e',x+(ty%2?4:12),y,1,7);Rr(g,'#8a867e',x+(ty%2?10:2),y+8,1,8)}
 else{Rr(g,'#a8aab0',x,y,TS,TS);if(h<.3)Rr(g,'#989aa0',x+((h*40)|0)%12,y+5,3,2)}
}
function drawRoomShell(g,r){
 const X=r.x*TS,Y=r.y*TS,W=r.w*TS,H=r.h*TS,dl=daylight();
 for(let ty=r.y+2;ty<r.y+r.h-1;ty++)for(let tx=r.x+1;tx<r.x+r.w-1;tx++)drawFloorTile(g,r.floor,tx*TS,ty*TS,tx,ty);
 Rr(g,'rgba(0,0,0,.18)',X+TS,Y+2*TS,W-2*TS,4);
 // parede do fundo
 const wc=r.wall;Rr(g,wc,X+TS,Y,W-2*TS,2*TS);
 if(r.log)for(let i=0;i<2*TS;i+=5){Rr(g,shade(wc,14),X+TS,Y+i,W-2*TS,1);Rr(g,shade(wc,-30),X+TS,Y+i+4,W-2*TS,1)}
 else for(let i=TS;i<W-TS;i+=6)Rr(g,shade(wc,-10),X+i,Y+4,1,2*TS-10);
 Rr(g,shade(r.trim,-20),X+TS,Y,W-2*TS,3);Rr(g,r.trim,X+TS,Y+2*TS-6,W-2*TS,6);Rr(g,shade(r.trim,25),X+TS,Y+2*TS-6,W-2*TS,1);
 // janelas
 const sky=dl>.6?'#8ac8f0':dl>.3?'#e0905a':'#1a2a4a';
 for(const wx of (r.win||[])){const x=X+wx*TS+2,y=Y+5;if(r.stained){Rr(g,'#3a3a44',x-1,y-1,14,20);const cs=['#d84a5a','#4a7ad8','#f0d040','#4ab05a'];for(let i=0;i<4;i++)for(let j=0;j<5;j++)Rr(g,cs[(i+j)%4],x+i*3,y+j*4,3,4);continue}
  Rr(g,'#f0e8d8',x-1,y-1,14,13);Rr(g,sky,x,y,12,11);Rr(g,dl>.3?'#fff':'#f0f0a0',x+2,y+2,2,1);Rr(g,'#f0e8d8',x+5.5,y,1,11);Rr(g,'#f0e8d8',x,y+5,12,1);if(dl<.3)Rr(g,'#fff',x+8,y+2,1,1)}
 // paredes laterais e frente
 Rr(g,'#2a1a10',X,Y,TS,H);Rr(g,'#2a1a10',X+W-TS,Y,TS,H);Rr(g,shade(r.trim,-10),X+TS-3,Y+2*TS,3,H-3*TS);Rr(g,shade(r.trim,-10),X+W-TS,Y+2*TS,3,H-3*TS);
 Rr(g,'#2a1a10',X,Y+H-TS,W,TS);Rr(g,shade(r.trim,-10),X+TS,Y+H-TS,W-2*TS,3);
 const dx=r.door*TS;Rr(g,'#5a3a22',dx,Y+H-TS,TS,TS);Rr(g,'#8a3a2a',dx+2,Y+H-TS+2,TS-4,8);Rr(g,'#a84a3a',dx+2,Y+H-TS+2,TS-4,1);ptext(g,'SAIR',dx+.5,Y+H-5,'#ffd75e','#000');
 for(const wd of (r.wallx||[]))drawWallDeco(g,wd,X+wd.x*TS,Y);
 for(const it of r.items)if(it.k==='rug'||it.k==='carpet'||it.k==='bearrug'||it.k==='rope'||it.k==='stallspace')drawFurn(g,it,X+it.x*TS,Y+it.y*TS,r);
}
function drawWallDeco(g,d,x,y){
 const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 switch(d.k){
  case 'clock':R('#5a3a22',4,5,9,9);R('#f4f0e4',5,6,7,7);R('#222',8,7,1,3);R('#222',8,9,2,1);break;
  case 'frame':R('#8a5a2a',2,5,12,10);R('#7ab0d8',3,6,10,4);R('#5a9a3e',3,10,10,4);R('#f0e060',10,7,2,2);break;
  case 'trophies':{const H=S.h&&S.h.kills||{},sp=['deer','elk','boar','bear','wolf','whitedeer'].filter(k=>H[k]);sp.slice(0,4).forEach((k,i)=>drawHead(g,x+i*14,y+4,k));if(!sp.length){R('#6a4428',4,8,22,10);ptext(g,'TROFEUS',x+1,y+10,'#f0e0c0')}break}
  case 'tools':R('#5a3a22',2,4,1,18);R('#999',0,3,5,3);R('#5a3a22',8,4,1,18);R('#999',6,20,5,2);R('#5a3a22',12,6,1,14);R('#aaa',11,4,3,3);break;
  case 'board':R('#2a2a2a',2,4,30,14);R('#3a5a3a',3,5,28,12);ptext(g,'LOTE 7',x+5,y+7,'#fff');ptext(g,'R$ 9K',x+6,y+13,'#ffd75e');break;
  case 'flag':R('#5a3a22',2,3,1,22);R('#2a8a3a',3,3,10,7);R('#ffd75e',6,5,4,3);R('#2a4ab0',7,6,2,1);break;
  case 'poster':R('#f4ecd8',2,5,12,14);R('#5a9a3e',4,8,8,4);ptext(g,'MILHO',x+3,y+14,'#7a3a1a');break;
  case 'wanted':R('#e8d8a8',2,4,11,15);ptext(g,'PROC',x+3,y+6,'#7a1f1f');R('#7a5a3a',5,11,5,5);R('#e8b890',6,12,3,3);break;
  case 'menu':R('#2a2a2a',0,4,30,16);ptext(g,'PAO',x+2,y+6,'#fff');ptext(g,'BOLO',x+2,y+12,'#fff');ptext(g,'R$8',x+18,y+6,'#ffd75e');ptext(g,'R$20',x+15,y+12,'#ffd75e');break;
  case 'cross':R('#fff',4,5,10,10);R('#2a9a5a',8,6,2,8);R('#2a9a5a',5,9,8,2);break;
  case 'bone':R('#f4f0e4',3,10,10,3);R('#f4f0e4',1,9,3,5);R('#f4f0e4',12,9,3,5);break;
  case 'crossbig':R('#c8a040',13,2,4,22);R('#c8a040',8,7,14,4);break;
  case 'head':drawHead(g,x+2,y+4,d.sp);break;
  case 'furs':R('#8a6a4a',1,4,10,14);R('#6a4a2a',3,6,6,10);R('#c8a070',13,4,9,12);R('#a88050',15,6,5,8);break;
  case 'net':for(let i=0;i<5;i++){R('#c8b898',2+i*4,4,1,16);R('#c8b898',2,4+i*4,17,1)}R('#e05030',6,8,3,3);break;
  case 'fishsign':R('#2f6a7a',1,6,20,10);R('#9ac0d0',4,9,10,4);R('#9ac0d0',14,8,3,6);R('#222',5,10,1,1);break;
  case 'cutsign':R('#f4ecd8',0,4,26,16);R('#c84a3a',3,7,20,10);R('#f4ecd8',8,7,1,10);R('#f4ecd8',14,7,1,10);R('#f4ecd8',3,12,20,1);break;
 }
}
function drawHead(g,x,y,sp){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);R('#5a3a22',2,6,10,10);R('#7a5232',3,7,8,8);
 const c=sp==='bear'?'#4a3224':sp==='wolf'?'#7a7e84':sp==='boar'?'#3e322a':sp==='whitedeer'?'#f0f0f0':sp==='elk'?'#7a5a3a':'#9a6a3e';
 R(c,4,6,6,7);R(shade(c,-20),5,11,4,3);R('#111',5,8,1,1);R('#111',8,8,1,1);
 if(sp==='deer'||sp==='elk'||sp==='whitedeer'){const a='#e8dcc0',s=sp==='elk'?1.4:1;R(a,3,4,1,3);R(a,10,4,1,3);R(a,1,1,1,4*s);R(a,12,1,1,4*s);R(a,2,3,2,1);R(a,10,3,2,1);R(a,0,0,2,1);R(a,12,0,2,1)}
 if(sp==='boar'){R('#f0ecd8',4,12,1,2);R('#f0ecd8',9,12,1,2)}if(sp==='bear'||sp==='wolf'){R(c,3,4,2,2);R(c,9,4,2,2)}}
function drawFurn(g,it,x,y,r){
 const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W=(it.w||1)*TS,H=(it.h||1)*TS;
 switch(it.k){
  case 'rug':R('#8a2a2a',0,0,it.rw*TS,it.rh*TS);R('#c8a040',2,2,it.rw*TS-4,it.rh*TS-4);R('#8a2a2a',4,4,it.rw*TS-8,it.rh*TS-8);for(let i=6;i<it.rw*TS-6;i+=6)R('#c8a040',i,it.rh*TS/2-1,3,2);break;
  case 'carpet':R('#9a2a2a',0,0,it.rw*TS,it.rh*TS);R('#c8a040',1,0,1,it.rh*TS);R('#c8a040',it.rw*TS-2,0,1,it.rh*TS);break;
  case 'bearrug':R('#4a3224',0,0,40,22);R('#5a4030',4,3,32,16);R('#4a3224',-4,2,6,5);R('#4a3224',38,2,6,5);R('#4a3224',-4,16,6,5);R('#4a3224',38,16,6,5);R('#4a3224',14,-6,12,9);R('#111',17,-3,2,2);R('#111',22,-3,2,2);break;
  case 'rope':for(let i=0;i<3;i++){R('#c8a040',i*20,2,2,12);R('#c8a040',i*20-1,1,4,2)}R('#a01a2a',1,4,40,2);break;
  case 'bed':R('rgba(0,0,0,.2)',2,H-2,W,4);R('#6a4428',0,0,W,H);R('#8a5a32',0,0,W,4);R('#f4f0e4',2,4,W-4,8);R('#fff',4,5,10,5);R('#3a6ab0',2,12,W-4,H-14);R('#4a7ac8',2,12,W-4,2);for(let i=4;i<W-4;i+=6)R('#2a5aa0',i,16,3,H-20);break;
  case 'wardrobe':R('rgba(0,0,0,.2)',2,H-2,W,3);R('#5a3a22',0,-14,W,H+14);R('#7a5232',1,-13,W/2-1.5,H+12);R('#7a5232',W/2+.5,-13,W/2-1.5,H+12);R('#e0c060',W/2-3,-2,1.5,3);R('#e0c060',W/2+1.5,-2,1.5,3);break;
  case 'fireplace':R('#8a7a6a',0,-14,W,H+14);R('#6a5a4a',0,-14,W,3);R('#1a0e08',6,-4,W-12,H);{const f=frame>>2;R('#e05a1a',9,H-8-(f%3),W-18,6);R('#f0c040',11,H-6-(f%2),W-22,4);R('#5a3a22',8,H-3,W-16,2)}R('#5a4a3a',-2,-16,W+4,3);break;
  case 'stove':R('#3a3a3a',0,-6,W,H+6);R('#5a5a5a',0,-6,W,2);R('#222',4,-4,8,6);R('#222',18,-4,8,6);R('#e05a1a',6,H-6,5,3);R('#888',W-6,-20,4,14);break;
  case 'sink':R('#c8ccd0',0,-4,W,H+4);R('#8a9aa8',3,0,10,6);R('#aaa',7,-8,2,5);break;
  case 'table':R('rgba(0,0,0,.2)',2,H-2,W,3);R('#7a5232',0,2,W,H-6);R('#9a6a40',0,2,W,2);R('#5a3a22',2,H-4,2,4);R('#5a3a22',W-4,H-4,2,4);if(r.id==='house'){R('#f4f0e4',6,3,6,4);R('#e0a431',18,3,4,4)}break;
  case 'chair':R('#5a3a22',3,2,10,9);R('#7a5232',3,2,10,2);R('#5a3a22',3,-4,2,8);R('#5a3a22',11,-4,2,8);break;
  case 'sofa':R('#3a5a3a',0,0,W,H-2);R('#4a6a4a',2,4,W-4,H-8);R('#2a4a2a',0,0,W,4);R('#2a4a2a',0,0,4,H-2);R('#2a4a2a',W-4,0,4,H-2);break;
  case 'gunrack':R('#5a3a22',0,-10,W,H+10);R('#3a2414',1,-9,W-2,1.5);R('#3a2414',1,H-3,W-2,2);gunFurn(g,x,y-10,W,H+10,'rack');break;
  case 'dogbed':R('#8a3a2a',0,4,20,10);R('#c85a4a',2,6,16,6);break;
  case 'plant':R('#8a4a2a',3,6,10,8);R('#6a3a1a',3,6,10,2);R('#2f7a2f',1,-6,14,12);R('#4a9a3e',4,-8,8,8);R('#5ab04a',6,-6,3,3);break;
  case 'hay':R('rgba(0,0,0,.2)',2,H-2,W,3);R('#c8a040',0,-4,W,H+4);R('#e0c060',0,-4,W,3);for(let i=3;i<W;i+=5)R('#a88020',i,-2,1,H+2);R('#8a6a20',0,H/2,W,1);break;
  case 'stall':R('#6a4428',0,-8,W,H+8);R('#8a5a32',0,-8,W,2);break;
  case 'sacks':for(let i=0;i<it.w*2;i++){R('#d8c090',i*8,0,8,12);R('#a89060',i*8,0,8,2);R('#8a6a3a',i*8+3,4,2,2)}break;
  case 'desk':R('rgba(0,0,0,.2)',2,H-2,W,3);R('#6a4428',0,0,W,H-2);R('#8a5a32',0,0,W,3);R('#f4f0e4',6,1,8,6);R('#2a2a2a',W-10,-2,6,5);break;
  case 'cans':R('#c8ccd0',2,-4,6,14);R('#c8ccd0',9,-2,5,12);R('#9aa0a8',2,-4,6,2);break;
  case 'saddle':if(S.horse){R('#7a3a1a',0,0,14,8);R('#5a2a12',2,-2,10,4)}break;
  case 'ring':R('#8a6a44',0,0,W,H);R('#a8835a',4,4,W-8,H-8);for(let i=0;i<W;i+=8)R('#5a3a22',i,0,2,H);R('#7a5232',0,0,W,2);R('#7a5232',0,H-2,W,2);break;
  case 'bleach':for(let i=0;i<3;i++)R(i%2?'#7a5232':'#8a6a42',0,i*10,W,8);break;
  case 'podium':R('#5a3a22',0,-4,W,H+4);R('#7a1f1f',2,-2,W-4,8);R('#ffd75e',W/2-2,0,4,3);break;
  case 'counter':R('rgba(0,0,0,.2)',2,H-2,W,3);R('#5a3a22',0,0,W,H-2);R('#8a5a32',0,0,W,3);R('#6a4428',0,4,W,1);if(it.glass){R('rgba(180,220,255,.5)',0,-10,W,10);R('#9aa0a8',0,-11,W,1)}break;
  case 'vault':R('#6a6e76',0,-18,W,H+18);R('#8a8e96',4,-14,W-8,H+10);R('#4a4e56',W/2-5,-8,10,10);R('#c8ccd4',W/2-1,-6,2,6);break;
  case 'bench':R('#7a5232',0,2,W,6);R('#5a3a22',0,8,2,6);R('#5a3a22',W-2,8,2,6);break;
  case 'shelf':R('#6a4428',0,-14,W,H+14);for(let s=0;s<3;s++){R('#8a5a32',0,-12+s*9,W,1);for(let i=2;i<W-2;i+=4){const c=it.goods==='seeds'?['#e0a431','#5ab04a','#d84a5a','#8a5a2a'][(i+s)%4]:it.goods==='bread'?['#d8a050','#c8803a','#e8c070'][(i+s)%3]:it.goods==='pet'?['#d84a3a','#3a8ad8','#e0c040'][(i+s)%3]:['#888','#5a3a22','#aaa'][(i+s)%3];R(c,i,-11+s*9,3,7)}}break;
  case 'barrel':R('#6a4428',2,-2,12,14);R('#8a5a32',2,-2,12,2);R('#3a3a3a',2,2,12,1);R('#3a3a3a',2,8,12,1);break;
  case 'cell':R('#5a5e66',0,-4,W,H+4);R('#9a9ea6',2,-2,W-4,H);for(let i=4;i<W;i+=5)R('#3a3e46',i,-4,1.5,H+4);R('#3a3e46',0,H/2-4,W,2);break;
  case 'locker':R('#5a6a7a',0,-10,TS,TS+10);R('#4a5a6a',TS/2,-10,1,TS+10);break;
  case 'oven':R('#a8502a',0,-14,W,H+14);R('#8a3a1a',2,-12,W-4,4);R('#1a0e08',8,-4,W-16,10);R('#e05a1a',10,1+((frame>>3)&1),W-20,4);for(let i=0;i<W;i+=4)R('#8a3a1a',i,-14,2,2);break;
  case 'display':R('#7a5232',0,2,W,H-4);R('rgba(200,230,255,.55)',0,-8,W,10);R('#9aa0a8',0,-9,W,1);for(let i=4;i<W-4;i+=7){R('#d8a050',i,-4,5,4);R('#c8803a',i+1,-4,3,1)}break;
  case 'menuboard':break;
  case 'examtable':R('#c8ccd0',0,0,W,H-4);R('#e8eef2',0,0,W,3);R('#888',4,H-4,2,4);R('#888',W-6,H-4,2,4);break;
  case 'cabinet':R('#e8eef2',0,-14,W,H+14);R('#c8d0d8',W/2,-14,1,H+14);for(let i=0;i<3;i++)R(['#3a8ad8','#d84a5a','#5ab04a'][i],4+i*8,-10,4,6);break;
  case 'cages':for(let i=0;i<3;i++){R('#9aa0a8',i*16,-6,15,TS+6);R('#5a5e66',i*16+1,-5,13,TS+4);if(i!==1)drawDogSprite(g,x+i*16+8,y+TS-2,1,DOGS[i?'beagle':'vira'].v,'lie',0,{sleep:1});for(let j=2;j<15;j+=3)R('#c8ccd0',i*16+j,-6,1,TS+6)}break;
  case 'kennel':R('#8a8e96',0,-4,W,H+4);R('#c8b898',1,-3,W-2,H+2);drawDogSprite(g,x+W/2,y+H-6,frame%400<200?1:-1,DOGS[it.breed].v,frame%300<150?'sit':'stand',0,{wag:1,pant:1});for(let j=0;j<W;j+=4)R('#5a5e66',j,-4,1,H+4);R('#5a5e66',0,-4,W,1);break;
  case 'bowls':R('#c84a3a',0,6,8,4);R('#3a8ad8',10,6,8,4);R('#8a5a2a',1,6,6,1);break;
  case 'altar':R('#e8e4dc',0,-6,W,H+6);R('#c8a040',0,-6,W,2);R('#9a2a2a',4,-2,W-8,8);R('#f4f0e4',W/2-1,-14,2,8);R('#f4f0e4',W/2-4,-11,8,2);break;
  case 'pew':R('rgba(0,0,0,.2)',2,H-2,W,3);R('#6a4428',0,-4,W,H);R('#8a5a32',0,-4,W,2);R('#5a3a22',0,4,W,2);break;
  case 'candles':for(let i=0;i<3;i++){R('#f4f0e4',2+i*5,0,2,7);R(((frame>>3)+i)%2?'#f0c040':'#e07a1a',2+i*5,-2,2,2)}break;
  case 'gunwall':R('#5a3a22',0,-14,W,H+14);R('#6a4428',1,-13,W-2,.8);gunFurn(g,x,y,W,H,'wall');break;
  case 'camorack':R('#5a3a22',0,-10,2,H+10);R('#5a3a22',W-2,-10,2,H+10);R('#5a3a22',0,-10,W,2);['#4d6b3a','#3d5a30','#4a5a2a'].forEach((c,i)=>{R(c,3+i*9,-8,7,14);R(shade(c,-25),5+i*9,-4,3,3)});break;
  case 'ammo':for(let i=0;i<6;i++)R(['#c8a040','#3a5a3a','#a84a2a'][i%3],(i%3)*10,(i>2?6:-2),9,7);break;
  case 'freezer':R('#e8eef2',0,-4,W,H+4);R('#c8d0d8',0,-4,W,3);R('#9aa0a8',W/2-4,4,8,2);break;
  case 'scale':R('#5e646c',0,4,14,10);R('#9aa0a8',0,4,14,2);R('#2a2a2a',4,-6,6,8);R('#6ac04a',5,-5,4,3);break;
  case 'aquarium':R('#3a3a44',0,-10,W,H+10);R('#3a8ac8',2,-8,W-4,H+4);R('#f0a040',6+((frame>>3)%12),-2,4,2);R('#f0f040',16-((frame>>4)%10),2,3,2);R('#3a8a3a',4,H-6,2,5);R('#3a8a3a',W-8,H-8,2,7);break;
  case 'rods':for(let i=0;i<5;i++)R('#5a3a22',2+i*5,-16,1.5,H+16);R('#888',0,-16,W,1);break;
  case 'boat':R('#7a4a2a',0,4,W,10);R('#5a3a22',0,4,W,2);R('#9a6a3a',4,6,W-8,6);break;
  case 'meatcase':R('#7a2a2a',0,2,W,H-4);R('rgba(220,240,255,.55)',0,-8,W,10);R('#c8ccd0',0,-9,W,1);for(let i=3;i<W-6;i+=9){R('#c84a4a',i,-5,7,5);R('#f0d0c0',i+1,-5,2,1)}break;
  case 'hooks':R('#888',0,-14,W,2);for(let i=0;i<3;i++){R('#aaa',6+i*14,-12,1,4);R('#a8403a',3+i*14,-8,7,14);R('#e0a090',4+i*14,-6,2,10);R('#f0e0d0',8+i*14,-4,1,6)}break;
  case 'block':R('#8a5a32',0,0,TS,TS-2);R('#a8743e',0,0,TS,3);R('#ccc',3,-3,8,2);break;
  case 'steeltable':R('#9aa0a8',0,0,W,H-3);R('#c8ccd4',0,0,W,2);R('#6a7078',2,H-3,2,3);R('#6a7078',W-4,H-3,2,3);break;
  case 'rail':R('#888',0,-14,W,2);for(let i=0;i<4;i++)R('#aaa',6+i*14,-12,1,5);{const n=Math.min(4,Math.ceil(((S.camara||[]).reduce((s,c)=>s+c.kg,0))/120));for(let i=0;i<n;i++){R('#a8403a',2+i*14,-8,8,16);R('#e0a090',3+i*14,-6,2,12)}}break;
  case 'coldroom':R('#c8d0d8',0,-14,W,H+14);R('#9aa0a8',4,-10,W-8,H+8);R('#5e646c',W-10,-2,3,6);ptext(g,'FRIO',x+8,y-8,'#2a4a8a');break;
 }
}
function drawClerk(g,it,r){
 const C=CLERK[r.id];if(!C)return;let o;const x=(r.x+it.x)*TS+8,y=(r.y+it.y)*TS+12+(it.dy||0);
 if(C.npc){const n=npcById(C.npc);const L=NPCLOOK[C.npc]||{};o={shirt:n.col,hair:n.hair,hat:L.hat,pants:L.pants,g:L.g,skin:L.skin}}else o=Object.assign({},C);
 OL(g,x,y+3,30,42,c=>{drawPerson(c,Object.assign({x,y,dir:0,ph:0,mv:0},o));if(C.apron)Rr(c,C.apron,x-3,y-12,6,8);if(C.beard)Rr(c,'#3a2a1a',x-3,y-16,6,2)});
}
// itens com ordenação por profundidade (dentro do evoItems)
const _evoRm=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoRm(L,x0,x1,y0,y1);if(y1<RZ*TS)return;
 for(const id in ROOMS){const r=ROOMS[id];if((r.x+r.w)*TS<x0||r.x*TS>x1||(r.y+r.h)*TS<y0||r.y*TS>y1)continue;
  for(const it of r.items){if(it.k==='rug'||it.k==='carpet'||it.k==='bearrug'||it.k==='rope'||it.k==='talk'||it.k==='stallspace')continue;const px=(r.x+it.x)*TS,py=(r.y+it.y)*TS;
   if(it.k==='clerk')L.push([py+12+(it.dy||0),10,{draw:g=>drawClerk(g,it,r)}]);else L.push([py+(it.h||1)*TS-1,10,{draw:g=>drawFurn(g,it,px,py,r)}])}}
};
const _dfsRm=drawFarmStatic;
drawFarmStatic=function(g){_dfsRm(g);if(CY+VH<RZ*TS)return;for(const id in ROOMS){const r=ROOMS[id];if((r.x+r.w)*TS<CX||r.x*TS>CX+VW||(r.y+r.h)*TS<CY||r.y*TS>CY+VH)continue;drawRoomShell(g,r)}};
// ---- interações dentro dos cômodos
function roomAct(it,r){
 const id=r.id;
 if(it.act==='sleep')return sleepModal();
 if(it.act==='look')return lookModal();
 if(it.act==='guns')return toast('🔫 Suas armas: '+(ownedW().map(k=>WEAPONS[k].short||WEAPONS[k].n).join(', ')||'nenhuma'));
 if(it.act==='herd'){S.tf.barn=1;return openMenu('herd')}
 if(it.act==='pray'){if(S.prayD===S.day)return toast('🙏 Você já rezou hoje.');S.prayD=S.day;P.hp=Math.min(100,P.hp+20);S.rep=Math.min(100,S.rep+.3);return toast('🙏 Você acendeu uma vela e saiu em paz (+20 vida).','good')}
 if(it.act==='slaughter')return slaughterModal();
 if(it.act==='camara')return camaraModal();
 if(id==='acougue')return acougueModal();
 if(id==='agro'&&it.act==='npc')return npcModal('ze');
 return enterBld(id);
}
const _ilRm=interactList;
interactList=function(){
 if(!inRoom())return _ilRm().map(l=>{const b=BLD.find(q=>l.label===q.label&&Math.abs(l.x-(q.door*TS+8))<1);if(b&&ROOMS[b.id])return Object.assign({},l,{label:'🚪 Entrar: '+b.label,fn:()=>enterRoom(b.id)});return l});
 const r=roomAt(P.x,P.y);if(!r)return[];const L=[];
 for(const it of r.items){if(!it.act)continue;const C=CLERK[r.id];const px=(r.x+it.x+(it.w||1)/2)*TS,py=(r.y+it.y+(it.h||1))*TS+4;
  const lb={sleep:'🛏️ Dormir / salvar',look:'👕 Guarda-roupa (visual)',guns:'🔫 Suporte de armas',herd:'📋 Prancheta do rebanho',pray:'🙏 Rezar no altar',slaughter:'🔪 Mesa de abate',camara:'❄️ Câmara fria',npc:'💬 Falar com '+(C?C.n:''),shop:'🛒 '+(C?'Atendimento: '+C.n:'Balcão')}[it.act]||'Usar';
  L.push({x:px,y:py,r:26,label:lb,fn:()=>roomAct(it,r)})}
 L.push({x:r.door*TS+8,y:(r.y+r.h-1)*TS,r:16,label:'🚪 Sair',fn:exitRoom});
 return L;
};
// câmera e efeitos dentro
const _dsRm=drawScene;
drawScene=function(){
 if(inRoom()){const r=roomAt(P.x,P.y);if(r){const cxr=(r.x+r.w/2)*TS-VW/2,cyr=(r.y+r.h/2)*TS-VH/2-6;if(r.w*TS<=VW)cam.x=cxr;else cam.x=clamp(cam.x,r.x*TS-8,(r.x+r.w)*TS+8-VW);if(r.h*TS<=VH)cam.y=cyr;else cam.y=clamp(cam.y,r.y*TS-8,(r.y+r.h)*TS+8-VH)}}
 else cam.y=Math.min(cam.y,(RZ-1)*TS-VH);
 _dsRm();
 if(inRoom()){const r=roomAt(P.x,P.y);if(r){const g=X;g.setTransform(PS,0,0,PS,-Math.round(CX*PS),-Math.round(CY*PS));g.fillStyle='#0b0806';const x0=r.x*TS,y0=r.y*TS,x1=(r.x+r.w)*TS,y1=(r.y+r.h)*TS;g.fillRect(CX-2,CY-2,VW+4,y0-CY+2);g.fillRect(CX-2,y1,VW+4,CY+VH-y1+2);g.fillRect(CX-2,y0,x0-CX+2,y1-y0);g.fillRect(x1,y0,CX+VW-x1+2,y1-y0);g.setTransform(PS,0,0,PS,0,0)}}
};
