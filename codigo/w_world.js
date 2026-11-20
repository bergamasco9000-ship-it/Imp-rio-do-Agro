const TS=16,MW=240,MH=212,WW=MW*TS,WH=MH*TS;
const G=new Uint8Array(MW*MH),SOL=new Uint8Array(MW*MH),FEN=new Uint8Array(MW*MH);
const ti=(x,y)=>y*MW+x;
function hs(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
const PWT=[14,18,22,27,32,38],PAS={x:10,y:50,h:14};
const pasW=()=>PWT[S.up.land];
const BLD=[
 {id:'house',x:6,y:42,w:6,h:4,door:8,roof:'#7a3a2a',wall:'#d8c49a',label:'Casa (dormir e salvar)'},
 {id:'barn',x:14,y:41,w:8,h:5,door:17,roof:'#4e2f2a',wall:'#a63a2a',label:'Celeiro (rebanho)'},
 {id:'leilao',x:99,y:40,w:8,h:5,door:102,roof:'#7a1f1f',wall:'#e8dcc0',label:'Casa de Leilões',sign:'LEILÃO'},
 {id:'banco',x:111,y:41,w:6,h:5,door:113,roof:'#2f4a7a',wall:'#c8ccd4',label:'Banco do Agro',sign:'BANCO'},
 {id:'agro',x:120,y:40,w:7,h:5,door:123,roof:'#2f6a3a',wall:'#d8c8a0',label:'Casa Agro (sementes e melhorias)',sign:'AGRO'},
 {id:'delegacia',x:130,y:41,w:6,h:5,door:132,roof:'#2f3a5a',wall:'#d0d4dc',label:'Delegacia',sign:'XERIFE'},
 {id:'padaria',x:102,y:50,w:6,h:5,door:104,roof:'#a8502a',wall:'#f0e0b8',label:'Padaria',sign:'PADARIA'},
 {id:'vet',x:99,y:59,w:6,h:5,door:101,roof:'#2f7a6a',wall:'#e8f0f0',label:'Clínica Veterinária',sign:'VET'},
 {id:'canil',x:135,y:58,w:6,h:5,door:137,roof:'#6a4a2a',wall:'#d8c8a0',label:'Canil e Pet Shop',sign:'PETS'},
 {id:'igreja',x:118,y:49,w:7,h:5,door:121,roof:'#5a5a6a',wall:'#e8e4dc',label:'Igreja',sign:'IGREJA',deco:1},
 {id:'h1',x:112,y:61,w:6,h:4,door:114,roof:'#7a3a2a',wall:'#d8c49a',deco:1},
 {id:'h2',x:119,y:62,w:6,h:4,door:121,roof:'#3a5a7a',wall:'#e0d4b0',deco:1},
 {id:'h3',x:125,y:61,w:6,h:4,door:127,roof:'#5a7a3a',wall:'#d8c8a8',deco:1},
 {id:'h4',x:141,y:60,w:6,h:4,door:143,roof:'#8a5a3a',wall:'#e4d8c0',deco:1},
 {id:'lodge',x:47,y:6,w:7,h:5,door:49,roof:'#3a2a1a',wall:'#7a5230',label:'Loja do Caçador',sign:'CAÇA',log:1}
];
const TROUGH={x:12*TS,y:53*TS,w:48,h:10};
const MAILBOX={x:12*TS+4,y:46*TS+4};
let GC=null,TREES=[],BUSH=[];
function carve(t,x0,y0,x1,y1){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<MW&&y<MH)G[ti(x,y)]=t}
const FARMZ=(x,y)=>x<60&&y>=71&&y<=130;
const TOWNZ=(x,y)=>x>=98&&x<=147&&y>=38&&y<=76;
const MATAZ=(x,y)=>x>=59&&x<98&&y>=35&&y<=75;
const bioAt=(x,y)=>TOWNZ(x,y)?0:x>=100?(y<=40?5:6):(y<35||MATAZ(x,y)?1:(y<71||FARMZ(x,y)?0:4));
function genWorld(){
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)G[ti(x,y)]=bioAt(x,y);
 // lake and pond
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  if(((x-72)/9)**2+((y-12)/5)**2<1)G[ti(x,y)]=2;
  if(x>=14&&x<=17&&y>=60&&y<=62)G[ti(x,y)]=2;
  if(x>=100&&y>40&&y<MH-2&&x<MW-2&&!TOWNZ(x,y)&&Math.sin(x*.21)+Math.sin(y*.27+2)+Math.sin((x+y)*.13)>1.55)G[ti(x,y)]=2;
  if(x>=100&&y<=40&&((x-132)/7)**2+((y-20)/4)**2<1)G[ti(x,y)]=2;
  if(((x-30)/4)**2+((y-85)/3)**2<1)G[ti(x,y)]=2;
 }
 // paths
 carve(3,8,47,92,48);carve(3,47,8,48,48);carve(3,48,25,66,26);carve(3,65,15,66,26);carve(3,44,11,56,12);carve(3,6,46,26,50);
 carve(3,93,47,150,48);carve(3,108,6,109,47);carve(3,59,52,60,98);carve(3,8,85,150,86);
 carve(3,9,47,9,58);
 // estradas da região ampliada
 carve(3,150,47,236,48);carve(3,150,85,236,86);carve(3,59,98,60,162);carve(3,2,133,236,134);carve(3,160,48,161,133);carve(3,196,14,197,47);carve(3,144,13,197,13);carve(3,2,106,57,106);carve(3,44,87,44,132);
 const cl=(x,y)=>Math.sin(x*.31)+Math.sin(y*.37+1)+Math.sin((x*.7+y*.9)*.19)>1.5;
 TREES=[];BUSH=[];
 const prot=(x,y)=>(x>=42&&x<=58&&y>=2&&y<=14)||G[ti(x,y)]===3||(x>=26&&x<=46&&y>=34&&y<=46)||(x>=47&&x<=58&&y>=49&&y<=60)||TOWNZ(x,y)||(x>=4&&x<=27&&y>=39&&y<=51)||(x>=108&&x<=118&&y>=32&&y<=42)||(x>=108&&x<=118&&y>=48&&y<=58)||(x>=28&&x<=33&&y>=82&&y<=89);
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
  const t=G[ti(x,y)],h=hs(x,y);
  if(t===2||prot(x,y))continue;
  let ok=false;
  if(TOWNZ(x,y))ok=false;
  else if(x>=100){ok=y<=40?(!cl(x,y)&&h<.3):(h<.06);}
  else if(MATAZ(x,y))ok=!cl(x+7,y+3)&&h<.42&&G[ti(x,y)]!==3;
  else if(FARMZ(x,y))ok=h<.012&&G[ti(x,y)]!==3;
  else if(y>=71)ok=h<.03;
  else if(y<35)ok=!cl(x,y)&&h<.36&&!(G[ti(x,y+1)]===3&&h<.2);
  else ok=h<.05&&(x<5||y<38||y>66||(x>30&&x<58&&y>52));
  if(x<3||x>MW-4||y<2||y>MH-4||(y>RZ-6&&y<RZ))ok=h<.9;
  if(ok){const k=(x>=100&&y<=40)?2:(y>=71&&!FARMZ(x,y)&&!MATAZ(x,y))?3:(hs(y,x)<.55?0:1);TREES.push({x:x*TS+8+(hs(x+3,y)-.5)*6,y:y*TS+15,k,s:.8+hs(x,y+9)*.4});SOL[ti(x,y)]=1}
  else if((y<35&&x<100||MATAZ(x,y))&&h>.88)BUSH.push({x:x*TS+8,y:y*TS+12,k:hs(x,y+4)<.5?0:1});
 }
 TREES.sort((a,b)=>a.y-b.y);
 BLD.forEach(b=>{for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)SOL[ti(x,y)]=1;
  for(let y=b.y;y<=b.y+b.h+1;y++)for(let x=b.x-1;x<=b.x+b.w;x++){const i=ti(x,y);if(!SOL[i]&&G[i]!==2&&G[i]!==3&&G[i]!==1)G[i]=3}});
 for(let x=0;x<MW;x++){SOL[ti(x,0)]=1;SOL[ti(x,MH-1)]=1}
 for(let y=0;y<MH;y++){SOL[ti(0,y)]=1;SOL[ti(MW-1,y)]=1}
 [[74,48],[75,48],[74,49],[75,49],[51,52],[52,52],[53,52],[51,53],[52,53],[53,53],[12,42],[13,44]].forEach(p=>SOL[ti(p[0],p[1])]=1);
 rebuildFence();prerender();
}
function rebuildFence(){
 FEN.fill(0);const w=pasW(),x0=PAS.x,y0=PAS.y,y1=PAS.y+PAS.h-1,x1=PAS.x+w-1;
 for(let x=x0;x<=x1;x++){FEN[ti(x,y0)]=1;FEN[ti(x,y1)]=1}
 for(let y=y0;y<=y1;y++){FEN[ti(x0,y)]=1;FEN[ti(x1,y)]=1}
 FEN[ti(x0,56)]=0;FEN[ti(x0,57)]=0;
 for(let x=RUN.x0;x<=RUN.x1;x++){FEN[ti(x,RUN.y0)]=1;if(x!==53&&x!==54)FEN[ti(x,RUN.y1)]=1}
 for(let y=RUN.y0;y<=RUN.y1;y++){FEN[ti(RUN.x0,y)]=1;FEN[ti(RUN.x1,y)]=1}
 for(let y=y0+1;y<y1;y++)for(let x=x0+1;x<x1;x++)SOL[ti(x,y)]===1&&0;
}
function prerender(){
 GC=document.createElement('canvas');GC.width=WW;GC.height=WH;const g=GC.getContext('2d');
 const base=['#5c9c3e','#3f7a36','#3a7fc4','#b08a58','#d6bf84','#e6eef2','#4f6b3a'];
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  const t=G[ti(x,y)],bx=x*TS,by=y*TS;Rr(g,base[t],bx,by,TS,TS);
  for(let i=0;i<7;i++){
   const h=hs(x*7+i,y*13+i*5),px=(h*16)|0,py=(hs(y*5+i,x*11+i)*16)|0;
   let c=shade(base[t],(h-.5)*46);
   if(t===2)c=h>.7?'#8cc4f0':shade(base[t],(h-.5)*30);
   Rr(g,c,bx+px,by+py,t===2?3:1+(i&1),1);
  }
  if(t===0&&hs(x+50,y+7)<.05){Rr(g,'#f0e060',bx+5,by+6,2,2);Rr(g,'#fff',bx+9,by+10,2,2)}
  if(t===1&&hs(x+9,y+90)<.06){Rr(g,'#2f5a28',bx+3,by+9,6,2)}
  if(t===4&&hs(x+3,y+8)<.08){Rr(g,'#a8935a',bx+4,by+8,3,1);Rr(g,'#8a8a5a',bx+9,by+5,1,3)}
  if(t===5&&hs(x+7,y+2)<.12){Rr(g,'#fff',bx+((hs(x,y)*12)|0),by+((hs(y,x)*12)|0),2,1)}
  if(t===6&&hs(x+1,y+4)<.22){const c=hs(x,y)<.5?'#3a5a2a':'#6a8a4a';Rr(g,c,bx+3,by+6,1,5);Rr(g,c,bx+5,by+4,1,7);Rr(g,c,bx+8,by+7,1,4)}
  if(t===3)for(let i=0;i<2;i++)Rr(g,'#8a6a40',bx+((hs(x,y+i)*14)|0),by+((hs(y,x+i)*14)|0),2,2);
 }
}
// ---- player
const P={x:13*TS,y:47*TS+8,vx:0,vy:0,ph:0,dust:0,dir:0,moving:0,sneak:0,run:0,aim:0,hp:100,hold:0,breath:3,noise:0,carry:0};
const cam={x:0,y:0},VW0=240,VH0=360;let VW=VW0,VH=VH0,SC=2;
const solidAt=(px,py)=>{const x=Math.floor(px/TS),y=Math.floor(py/TS);if(x<0||y<0||x>=MW||y>=MH)return true;const i=ti(x,y);return SOL[i]||FEN[i]||G[i]===2};
const freeAt=(x,y)=>!(solidAt(x-4,y)||solidAt(x+4,y)||solidAt(x-4,y-5)||solidAt(x+4,y-5));
function movePlayer(dx,dy){
 if(dx&&freeAt(P.x+dx,P.y))P.x+=dx;
 if(dy&&freeAt(P.x,P.y+dy))P.y+=dy;
}
function resize(){
 const w=innerWidth,h=innerHeight,dpr=Math.min(window.devicePixelRatio||1,2);
 SC=clamp(Math.round(Math.min(w/190,h/170)),2,5);PS=Math.max(1,Math.round(SC*dpr));
 CV.width=Math.round(w*dpr);CV.height=Math.round(h*dpr);VW=CV.width/PS;VH=CV.height/PS;
 CV.style.width=CV.width/dpr+'px';CV.style.height=CV.height/dpr+'px';X.imageSmoothingEnabled=false;
}
const CV=$('cv'),X=CV.getContext('2d');
// ---- cows
function pasBounds(){return{x0:(PAS.x+1)*TS+4,x1:(PAS.x+pasW()-1)*TS-22,y0:(PAS.y+1)*TS+4,y1:(PAS.y+PAS.h-1)*TS-14}}
function spriteOf(a){
 let s=SP.get(a.id);
 if(!s){const b=pasBounds();s={x:rnd(b.x0,b.x1),y:rnd(b.y0,b.y1),dir:1,f:0,wait:rnd(0,3),tx:0,ty:0,go:0};SP.set(a.id,s)}
 return s;
}
function stepCows(dt){
 const b=pasBounds();
 for(const a of S.herd){
  const s=spriteOf(a);
  if(s.x>b.x1)s.x=b.x1;if(s.y>b.y1)s.y=b.y1;
  if(Math.hypot(s.x+8-P.x,s.y+5-P.y)<26){s.go=0;continue}
  if(s.wait>0){s.wait-=dt;s.f=0;continue}
  if(!s.go){for(let k=0;k<8;k++){const tx=rnd(b.x0,b.x1),ty=rnd(b.y0,b.y1);if(G[ti(Math.floor(tx/TS),Math.floor(ty/TS))]!==2){s.tx=tx;s.ty=ty;break}}s.go=1}
  const dx=s.tx-s.x,dy=s.ty-s.y,d=Math.hypot(dx,dy);
  if(d<2){s.go=0;s.wait=rnd(2,9);continue}
  const sp=(a.sick?8:14)*dt;s.x+=dx/d*sp;s.y+=dy/d*sp;if(Math.abs(dx)>.5)s.dir=dx>0?1:-1;s.f=(frame>>4)&1;
 }
}
// ---- drawing
function drawTree(g,t){
 const x=Math.round(t.x),y=Math.round(t.y),s=t.s,dry=!isWet();
 Rr(g,'rgba(0,0,0,.22)',x-7,y-2,14,3);
 Rr(g,'#5a3a22',x-2,y-8,4,8);Rr(g,'#42291a',x,y-8,2,8);
 const c1=dry?'#6a7a2a':'#2f6b2f',c2=dry?'#8a9a3a':'#3f8a3a',c3=dry?'#a8b44a':'#57a84a';
 if(t.k===2){
  for(let i=0;i<4;i++){const w=Math.round((15-i*3.4)*s);Rr(g,'#2c5a4a',x-w/2|0,y-10-i*7*s|0,w,8);Rr(g,'#e8f2f4',x-w/2|0,y-10-i*7*s|0,w,3)}
 }else if(t.k===3){
  Rr(g,'#6a9a3a',x-2,y-14*s|0,4,14*s|0);Rr(g,'#4a7a2a',x,y-14*s|0,2,14*s|0);Rr(g,'#6a9a3a',x-6,y-9*s|0,4,2);Rr(g,'#6a9a3a',x-6,y-12*s|0,2,5);Rr(g,'#6a9a3a',x+3,y-7*s|0,4,2);Rr(g,'#6a9a3a',x+5,y-11*s|0,2,6);
 }else if(t.k===0){
  const h=Math.round(26*s);
  for(let i=0;i<4;i++){const w=Math.round((16-i*3.5)*s);Rr(g,c1,x-w/2|0,y-10-i*7*s|0,w,8)}
  for(let i=0;i<4;i++){const w=Math.round((10-i*2.4)*s);Rr(g,c2,x-w/2|0,y-10-i*7*s|0,w,4)}
 }else{
  const w=Math.round(20*s);Rr(g,c1,x-w/2|0,y-26*s|0,w,17*s|0);Rr(g,c2,x-w/2+2|0,y-26*s|0,w-6,12*s|0);Rr(g,c3,x-w/2+3|0,y-27*s|0,w/2|0,5)
 }
}
function drawBuilding(g,b){
 const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS;
 Rr(g,'rgba(0,0,0,.25)',x+2,y+h-2,w,5);
 Rr(g,b.wall,x,y+14,w,h-14);
 if(b.log)for(let i=14;i<h;i+=5)Rr(g,'#5a3a22',x,y+i,w,1);
 else for(let i=0;i<w;i+=6)Rr(g,shade(b.wall,-16),x+i,y+14,1,h-14);
 for(let r=0;r<14;r++){const ins=Math.round((13-r)*.9);Rr(g,r%3===0?shade(b.roof,-15):b.roof,x-3+ins*0,y+r,w+6,1)}
 Rr(g,shade(b.roof,-30),x-3,y+13,w+6,2);
 const dx=b.door*TS-x;
 Rr(g,'#3a2616',x+dx,y+h-24,16,24);Rr(g,'#6a4a2a',x+dx+2,y+h-22,12,22);Rr(g,'#e0a431',x+dx+11,y+h-11,2,2);
 for(let wx=x+8;wx<x+w-14;wx+=24)if(Math.abs(wx-(x+dx))>20){Rr(g,'#3a2616',wx,y+h-32,13,12);Rr(g,'#9ad8f5',wx+1,y+h-31,11,10);Rr(g,'#fff',wx+6,y+h-31,1,10)}
 if(b.id==='barn'){Rr(g,'#f3ead8',x+dx-2,y+22,20,2);Rr(g,'#f3ead8',x+dx-2,y+h-2,20,2);for(let i=0;i<16;i++){Rr(g,'#f3ead8',x+dx+i,y+h-24+((i*24/16)|0),1,1);Rr(g,'#f3ead8',x+dx+15-i,y+h-24+((i*24/16)|0),1,1)}}
 if(b.sign){Rr(g,'#2a1a10',x+w/2-16,y+3,32,9);g.fillStyle='#ffd75e';g.font='7px monospace';g.fillText(b.sign,x+w/2-14,y+11)}
 if(b.id==='house'){Rr(g,'#5a3a22',x+w-10,y+4,5,10)}
}
function drawPlayer(g){drawPlayerBase(g)}
function drawPlayerBase(g){
 const o=OUTFITS[S.h.outfit],c=o.c,x=P.x,y=P.y,sn=P.sneak?3:0,mv=P.moving&&!P.aim;
 const sw=mv?Math.sin(P.ph):0,bob=mv?Math.abs(Math.cos(P.ph))*(P.run?1.7:1):Math.sin(frame/28)*.25+.25,by=y-bob;
 const side=P.dir>=2,dr=P.dir===3?1:-1,leg='#33384a',legd='#262a38',skin=(S.look&&typeof LK!=='undefined'?LK.skin[S.look.skin]:'#e8b890');
 Rr(g,'rgba(0,0,0,.3)',x-5+(mv?0:0),y-1,10,3);
 if(side){
  const o1=sw*3.4,o2=-o1;
  Rr(g,legd,x-1+o2,y-6+sn,2,6-sn-(o2*dr>1.5?1:0));Rr(g,'#1a1208',x-1+o2+(dr>0?1:0),y-1-(o2*dr>1.5?1:0),2,1);
  Rr(g,leg,x-1+o1,y-6+sn,2,6-sn-(o1*dr>1.5?1:0));Rr(g,'#2a1a10',x-1+o1+(dr>0?1:0),y-1-(o1*dr>1.5?1:0),2,1);
  Rr(g,c[0],x-3,by-14+sn,6,9);
  if(S.h.outfit!=='casual')for(let i=0;i<6;i++)Rr(g,c[1],x-3+((i*5)%5),by-14+sn+((i*3)%8),2,2);
  Rr(g,shade(c[0],-28),x-1-sw*3,by-13+sn,2,7);
  Rr(g,skin,x-3,by-20+sn,6,6);Rr(g,'#222',x+(dr>0?1:-2),by-17+sn,1,1);Rr(g,'#d89870',x+(dr>0?3:-4),by-16+sn,1,1);
  Rr(g,S.h.outfit==='ghillie'?c[1]:c[2],x-4,by-22+sn,8,3);Rr(g,c[2],x+(dr>0?2:-5),by-20+sn,3,1);
  if(S.h.outfit==='full'||S.h.outfit==='ghillie')Rr(g,c[1],x+(dr>0?0:-3),by-17+sn,3,2);
 }else{
  const l1=Math.max(0,sw)*2.6,l2=Math.max(0,-sw)*2.6;
  Rr(g,leg,x-3,y-6+sn,2,6-sn-l1);Rr(g,'#2a1a10',x-3,y-1-l1,3,1);
  Rr(g,leg,x+1,y-6+sn,2,6-sn-l2);Rr(g,'#2a1a10',x+1,y-1-l2,3,1);
  Rr(g,c[0],x-4,by-14+sn,8,9);
  if(S.h.outfit!=='casual'){for(let i=0;i<7;i++)Rr(g,c[1],x-4+((i*5)%7),by-14+sn+((i*3)%8),2,2);Rr(g,c[2],x-3,by-9+sn,2,2)}
  Rr(g,shade(c[0],-28),x-5,by-13+sn+sw*1.6,1,7);Rr(g,shade(c[0],-28),x+4,by-13+sn-sw*1.6,1,7);
  Rr(g,skin,x-3,by-20+sn,6,6);
  Rr(g,S.h.outfit==='ghillie'?c[1]:c[2],x-4,by-22+sn,8,3);
  if(S.h.outfit==='full'||S.h.outfit==='ghillie')Rr(g,c[1],x-3,by-17+sn,6,2);
  if(P.dir===0){Rr(g,'#222',x-2,by-17+sn,1,1);Rr(g,'#222',x+1,by-17+sn,1,1)}else Rr(g,c[2],x-3,by-20+sn,6,5);
 }
 if(S.h.outfit==='ghillie')for(let i=0;i<8;i++)Rr(g,i%2?c[1]:c[2],x-5+i,by-6+sn,1,3+(Math.sin(frame/6+i)>.4?1:0));
 if(S.h.eq&&WEAPONS[S.h.eq])drawGun(g,x,by+sn,S.h.eq);
}
// ---- partículas (poeira ao andar)
const PART=[];
function stepPart(dt){
 if(P.moving&&!P.aim&&(P.run||(G[ti(Math.floor(P.x/TS),Math.floor(P.y/TS))]===3&&!P.sneak))){
  P.dust-=dt;if(P.dust<=0){P.dust=P.run?.07:.16;const t=G[ti(Math.floor(P.x/TS),Math.floor(P.y/TS))];
   PART.push({x:P.x+rnd(-3,3),y:P.y-1,vx:rnd(-9,9),vy:rnd(-12,-4),t:0,l:rnd(.3,.5),c:t===3?'200,175,130':t===1?'110,160,80':'190,220,150'})}
 }
 for(let i=PART.length-1;i>=0;i--){const p=PART[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=30*dt;if(p.t>p.l)PART.splice(i,1)}
}
function drawPart(g){for(const p of PART){const a=1-p.t/p.l;Rr(g,'rgba('+p.c+','+(a*.8).toFixed(2)+')',p.x,p.y,a>.5?2:1,a>.5?2:1)}}
function drawScene(){
 const g=X;CX=Math.round(cam.x*PS)/PS;CY=Math.round(cam.y*PS)/PS;const ox=CX,oy=CY;
 g.setTransform(1,0,0,1,0,0);g.fillStyle='#1e3a1e';g.fillRect(0,0,CV.width,CV.height);
 g.setTransform(PS,0,0,PS,0,0);g.drawImage(GC,ox,oy,VW,VH,0,0,VW,VH);
 g.setTransform(PS,0,0,PS,-Math.round(ox*PS),-Math.round(oy*PS));
 const dry=!isWet(),dl=daylight();
 // pasture tint
 const pw=pasW();pqTint(g);
 drawFarmStatic(g);
 for(const b of BLOOD)Rr(g,'rgba(150,15,10,'+Math.max(.15,b.a).toFixed(2)+')',b.x,b.y,2,2);
 const L=[],x0=ox-30,x1=ox+VW+30,y0=oy-10,y1=oy+VH+50;
 for(const t of TREES)if(t.x>x0&&t.x<x1&&t.y>y0&&t.y<y1)L.push([t.y,0,t]);
 for(const t of BUSH)if(t.x>x0&&t.x<x1&&t.y>y0&&t.y<y1)L.push([t.y,5,t]);
 for(const b of BLD)if(b.x*TS<x1&&(b.x+b.w)*TS>x0&&(b.y+b.h)*TS>y0)L.push([(b.y+b.h)*TS,1,b]);
 for(const a of S.herd){const s=spriteOf(a);if(s.x>x0&&s.x<x1&&s.y>y0&&s.y<y1)L.push([s.y+10,2,a,s])}
 for(const a of WILD)if(a.vis>.05&&a.x>x0&&a.x<x1&&a.y>y0&&a.y<y1)L.push([a.y,3,a]);
 for(const c of CH)L.push([c.y,6,c]);
 if(npcOut())for(const n of NPCS)L.push([n.y,7,n]);
 for(const d of S.dogs){const r=dogRT(d);L.push([r.y,8,d])}
 for(const t of THV)if(t.st!=='gone')L.push([t.y,9,t]);
 workerItems(L);evoItems(L,x0,x1,y0,y1);
 L.push([P.y,4]);
 L.sort((a,b)=>a[0]-b[0]);
 // fence & trough & misc drawn first (low objects)
 for(let y=PAS.y;y<PAS.y+PAS.h;y++)for(let x=PAS.x;x<PAS.x+pw;x++){
  if(!FEN[ti(x,y)])continue;const px=x*TS,py=y*TS;if(px<x0||px>x1||py<y0||py>y1)continue;
  const eh=x===PAS.x||x===PAS.x+pw-1;
  drawFence(g,px,py,fenceStyle());
  if(S.up.cerca)Rr(g,'#ffd75e',px+6,py,3,2);
 }
 drawTrough(g);
 drawMailbox(g);
 if(S.up.silo){const sx=23*TS,sy=41*TS,h=34+S.up.silo*8;Rr(g,'rgba(0,0,0,.25)',sx,sy+5*TS-2,16,4);Rr(g,'#b8c0c8',sx,sy+5*TS-h,16,h);Rr(g,'#8a929b',sx,sy+5*TS-h,3,h);Rr(g,'#6d7580',sx-1,sy+5*TS-h-3,18,4)}
 if(S.up.truck)drawTruck(g,26*TS,43*TS+4);
 for(const it of L){
  if(it[1]===0)drawTree(g,it[2]);
  else if(it[1]===5)drawBush(g,it[2])
  else if(it[1]===1)drawBuilding(g,it[2]);
  else if(it[1]===2){const s=it[3],a=it[2];OL(g,s.x+8.5,s.y+12,28,24,c=>drawCow(c,a,s.x,s.y,s.dir,s.f))}
  else if(it[1]===3){const a=it[2];OL(g,a.x,a.y+6,74,62,c=>drawWild(c,a))}
  else if(it[1]===6){const c0=it[2];OL(g,c0.x+3,c0.y+3,16,16,c=>drawChicken(c,c0))}
  else if(it[1]===7){const n=it[2];OL(g,n.x,n.y+3,30,42,c=>drawNPC(c,n))}
  else if(it[1]===8){const d=it[2],r=dogRT(d);OL(g,r.x,r.y+4,48,36,c=>drawDog(c,d))}
  else if(it[1]===9){const t=it[2];OL(g,t.x,t.y+4,34,40,c=>drawThief(c,t))}
  else if(it[1]===10||it[1]===11)it[2].draw(g);
  else OL(g,P.x,P.y+5,66,60,c=>drawPlayer(c));
 }
 drawPart(g);
 drawHuntOverlay(g);
 g.setTransform(PS,0,0,PS,0,0);
 // day/night & weather
 const IR=inRoom();if(!IR&&S.weather!=='chuva')cloudShadows(g,ox,oy);
 if(!IR)lightPass(g,ox,oy,dl);
 if(!IR)drawLights(g,ox,oy,dl);
 if(S.weather==='chuva'&&!IR)rainPass(g);
 if(S.drought>0&&!IR){g.fillStyle='rgba(220,150,40,.12)';g.fillRect(0,0,VW,VH)}
 drawGuide(g);
 drawAimOverlay(g);
}
function drawTruck(g,tx,ty){Rr(g,'rgba(0,0,0,.25)',tx,ty+14,40,3);Rr(g,'#c8c8c8',tx,ty,28,14);Rr(g,'#c0392b',tx+28,ty+4,10,10);Rr(g,'#9ad8f5',tx+33,ty+5,4,4);Rr(g,'#111',tx+3,ty+12,6,5);Rr(g,'#111',tx+28,ty+12,6,5)}
const daylight=()=>clamp(.5+.6*Math.sin((S.t-.25)*Math.PI*2),0,1);
