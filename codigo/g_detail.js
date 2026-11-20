// ===== DETALHES DO MAPA: morros, paredões e pedras; posto na rodovia; capela, cemitério e fazenda abandonada; silos da cooperativa
// e usina; pesqueiro; trânsito nas estradas; peões nas fazendas rivais; placas, postes, porteiras, mata-burros e cata-ventos.
const DB=(g,c,x,y,w,h)=>Rr(g,c,x,y,w,h);
const dvis=(x,y,m)=>x>CX-(m||60)&&x<CX+VW+(m||60)&&y>CY-(m||60)&&y<CY+VH+(m||100);
// ---------- lugares (tiles)
const PL={
 posto:{x0:62,y0:135,x1:77,y1:142},capela:{x0:87,y0:135,x1:91,y1:140},cemit:{x0:93,y0:136,x1:98,y1:142},
 ruina:{x0:76,y0:146,x1:97,y1:161},coop:{x0:61,y0:77,x1:73,y1:84},usina:{x0:74,y0:76,x1:81,y1:84},pesq:{x0:200,y0:137,x1:234,y1:162}
};
const inPL=(x,y,m)=>{m=m||0;for(const k in PL){const r=PL[k];if(x>=r.x0-m&&x<=r.x1+m&&y>=r.y0-m&&y<=r.y1+m)return k}return null};
// ---------- morros (elipses) e paredões
const HILLS=[
 {cx:122,cy:7,rx:7,ry:3.4,k:'snow'},{cx:172,cy:7,rx:9,ry:3.8,k:'snow'},{cx:168,cy:26,rx:7,ry:3.6,k:'snow'},{cx:140,cy:30,rx:6,ry:3.2,k:'snow'},
 {cx:68,cy:155,rx:5.5,ry:3.6,k:'red'},{cx:16,cy:22,rx:6,ry:3.2,k:'moss'},{cx:84,cy:120-0,rx:0,ry:0,k:'none'}
].filter(h=>h.rx>0);
const CLIFFS=[{x0:150,x1:190,y:36,k:'snow'},{x0:120,x1:133,y:36,k:'snow'}];
const HFACE=18;// altura da face sul em px
const hillBot=(h,x)=>{const u=(x-h.cx)/h.rx;return u*u>=1?null:h.cy+h.ry*Math.sqrt(1-u*u)};
const hillTop=(h,x)=>{const u=(x-h.cx)/h.rx;return u*u>=1?null:h.cy-h.ry*Math.sqrt(1-u*u)};
let BOULD=[],DPOLES=[],SIGNS=[],KMS=[],MILLS=[],GATES=[];
function dClearTrees(test){
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(test(tx,ty)){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 for(let i=BUSH.length-1;i>=0;i--){const t=BUSH[i];if(test(Math.floor(t.x/TS),Math.floor(t.y/TS)))BUSH.splice(i,1)}
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--){const t=DECO[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(test(tx,ty)){if(SOL[ti(tx,ty)]&&!FEN[ti(tx,ty)])SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}
}
function detailCarve(){
 // lugares: chão limpo
 dClearTrees((x,y)=>!!inPL(x,y,1));
 for(const k in PL){const r=PL[k];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++){const i=ti(x,y);SOL[i]=0;FEN[i]=0}}
 const fill=(t,x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)G[ti(x,y)]=t};
 const sol=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)SOL[ti(x,y)]=1};
 // posto
 fill(3,62,135,77,142);sol(72,136,76,139);sol(65,138,65,138);sol(67,138,67,138);sol(69,138,69,138);sol(62,139,63,141);sol(77,135,77,135);sol(66,141,70,141);
 // capela e cemitério + trilha velha até a ruína
 fill(3,87,140,91,140);sol(88,136,91,139);
 for(let x=93;x<=98;x++){SOL[ti(x,136)]=1;if(x!==95&&x!==96)SOL[ti(x,142)]=1}for(let y=136;y<=142;y++){SOL[ti(93,y)]=1;SOL[ti(98,y)]=1}
 fill(3,86,135,86,147);fill(3,87,146,88,147);
 // fazenda abandonada
 sol(80,148,87,152);sol(90,149,95,152);sol(85,156,85,156);
 // cooperativa e usina
 fill(3,61,83,81,84);sol(62,81,67,82);sol(68,78,73,82);sol(74,77,80,81);
 // pesqueiro: margem de terra, lagoa grande, píer e ranchos
 const P2=PL.pesq;fill(6,P2.x0,P2.y0,P2.x1,P2.y1);
 for(let y=P2.y0;y<=P2.y1;y++)for(let x=P2.x0;x<=P2.x1;x++){if(((x-217)/15)**2+((y-154)/6.6)**2<1)G[ti(x,y)]=2}
 fill(3,212,135,213,146);fill(3,203,144,231,146);fill(3,216,147,217,151);
 sol(204,140,209,143);sol(222,140,227,143);sol(213,141,214,142);
 // morros: piso sólido (topo + face sul); some se tiver segredo, prédio ou fazenda embaixo
 const hBad=h=>{const x0=h.cx-h.rx-2,x1=h.cx+h.rx+2,y0=h.cy-h.ry-2,y1=h.cy+h.ry+3;return(typeof SECP!=='undefined'&&Object.values(SECP).some(p=>p.tx>=x0&&p.tx<=x1&&p.ty>=y0&&p.ty<=y1))||BLD.some(b=>b.x<=x1&&b.x+b.w>=x0&&b.y<=y1&&b.y+b.h>=y0)};
 for(let i=HILLS.length-1;i>=0;i--)if(hBad(HILLS[i]))HILLS.splice(i,1);
 for(const h of HILLS){const x0=Math.floor(h.cx-h.rx),x1=Math.ceil(h.cx+h.rx);
  dClearTrees((x,y)=>x>=x0-1&&x<=x1+1&&y>=h.cy-h.ry-2&&y<=h.cy+h.ry+3);
  for(let x=x0;x<=x1;x++){const t=hillTop(h,x+.5),b=hillBot(h,x+.5);if(t===null)continue;for(let y=Math.floor(t);y<=Math.floor(b+HFACE/TS);y++){if(G[ti(x,y)]===3)continue;SOL[ti(x,y)]=1}}}
 for(const c of CLIFFS){dClearTrees((x,y)=>x>=c.x0-1&&x<=c.x1+1&&y>=c.y-2&&y<=c.y+2);for(let x=c.x0;x<=c.x1;x++){if(G[ti(x,c.y)]===3||G[ti(x,c.y+1)]===3)continue;SOL[ti(x,c.y)]=1;SOL[ti(x,c.y+1)]=1}}
 // pedras grandes
 BOULD=[];const rsv=(x,y)=>inPL(x,y,2)||RF.some(f=>x>=f.x0-2&&x<=f.x1+2&&y>=f.y0-2&&y<=f.y1+2)||(typeof inHomeLot==='function'&&inHomeLot(x,y))||FARMZ(x,y)||(x<100&&y>=35&&y<71)||HILLS.some(h=>Math.abs(x-h.cx)<h.rx+2&&Math.abs(y-h.cy)<h.ry+3);
 const okT=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const i=ti(x+dx,y+dy);if(G[i]===3||G[i]===2||SOL[i]||FEN[i])return false}return!rsv(x,y)};
 const nearSec=(x,y)=>typeof SECP!=='undefined'&&Object.values(SECP).some(p=>Math.abs(p.tx-x)<4&&Math.abs(p.ty-y)<4);
 const areas=[[101,3,236,39,'snow',22],[61,72,98,164,'red',12],[2,132,59,165,'red',6],[3,3,97,33,'moss',8]];
 for(const [ax0,ay0,ax1,ay1,k,n] of areas){let made=0;for(let t=0;t<n*30&&made<n;t++){const x=ax0+Math.floor(hs(t*7+ax0,ay0*3+t)*(ax1-ax0)),y=ay0+Math.floor(hs(ay1+t*13,t*5+ax1)*(ay1-ay0));if(y>=RZ-4||!okT(x,y)||nearSec(x,y))continue;const big=hs(x,y)<.45;
   if(big&&!okT(x+1,y))continue;BOULD.push({x,y,k,big,s:hs(y,x)});SOL[ti(x,y)]=1;if(big)SOL[ti(x+1,y)]=1;made++}}
 // postes, placas e marcos de km
 DPOLES=[];const poleRow=(y,x0,x1)=>{let last=null;for(let x=x0;x<=x1;x+=8){let xx=x;while(xx<x+4&&(SOL[ti(xx,y)]||G[ti(xx,y)]===3||G[ti(xx,y)]===2||inPL(xx,y,1)))xx++;if(xx>=x+4){last=null;continue}const p={x:xx*TS+8,y:y*TS+14,prev:last};SOL[ti(xx,y)]=1;DPOLES.push(p);last=p}};
 poleRow(46,100,236);poleRow(135,2,236);poleRow(84,100,150);
 KMS=[];for(let k=1;k<=6;k++){const x=k*38;if(!SOL[ti(x,132)]&&G[ti(x,132)]!==3&&G[ti(x,132)]!==2)KMS.push({x:x*TS+8,y:132*TS+14,n:k*4})}
 SIGNS=[
  {x:61,y:45,L:[[-1,'SEDE',13,47],[1,'VILA',116,50]]},
  {x:96,y:45,L:[[1,'VILA',116,50],[-1,'SEDE',13,47]]},
  {x:158,y:45,L:[[0,'RODOVIA SUL',160,133],[1,'HARAS',219,54],[-1,'VILA',116,50]]},
  {x:57,y:88,L:[[0,'RODOVIA SUL',60,133],[1,'BAIRRO NOVO',130,80],[-1,'LOTE SUL',30,78]]},
  {x:57,y:131,L:[[-1,'SANTA RITA',15,138],[1,'POSTO',68,136],[2,'VILA',116,50]]},
  {x:158,y:131,L:[[2,'RIO CLARO',183,92],[1,'PESQUEIRO',214,140],[-1,'PANTANEIRO',130,138]]},
  {x:110,y:44,L:[[2,'SERRA',108,10]]},{x:198,y:44,L:[[2,'SERRA AZUL',214,24]]}
 ].filter(s=>{if(SOL[ti(s.x,s.y)]||G[ti(s.x,s.y)]===2)return false;SOL[ti(s.x,s.y)]=1;return true});
 // cata-ventos e caixas d'água nas fazendas rivais e na sua
 MILLS=[];for(const f of RF){const x=f.barn.x+f.barn.w+2,y=f.barn.y+3;if(x<f.x1-1&&!SOL[ti(x,y)]&&!SOL[ti(x+2,y)]){MILLS.push({x:x*TS+8,y:y*TS+14,tank:{x:(x+2)*TS+8,y:y*TS+14},s:hs(x,y)});SOL[ti(x,y)]=1;SOL[ti(x+2,y)]=1}}
 for(const [x,y] of[[14,76],[50,112]]){if(!SOL[ti(x,y)]&&!SOL[ti(x+2,y)]&&G[ti(x,y)]!==3){MILLS.push({x:x*TS+8,y:y*TS+14,tank:{x:(x+2)*TS+8,y:y*TS+14},s:hs(x,y)});SOL[ti(x,y)]=1;SOL[ti(x+2,y)]=1}}
 // porteiras e mata-burros
 GATES=RF.map(f=>f.gate==='n'?{t:'n',x:f.gx,y:f.y0,w:2}:{t:'w',x:f.x0,y:f.gy,w:2}).concat([{t:'w',x:58,y:85,w:2,mine:1},{t:'w',x:58,y:106,w:1,mine:1},{t:'n',x:44,y:131,w:1,mine:1}]);
}
const _rfcD=rfCarve;rfCarve=function(){_rfcD();detailCarve()};
// ---------- pintura no chão (pré-render): morros, paredões, pátio do posto, píer, mata-burros
function paintHill(g,h){
 const PALH={snow:{top:'#e8eef2',top2:'#d0dae2',rim:'#ffffff',f1:'#7a8088',f2:'#5a6068',f3:'#9aa0a8'},red:{top:'#c9a05e',top2:'#a8803e',rim:'#e0c080',f1:'#a0502a',f2:'#7a3a1e',f3:'#c06a3a'},moss:{top:'#4f8a3a',top2:'#3f7030',rim:'#6aa84a',f1:'#6a6a62',f2:'#4a4a44',f3:'#8a8a80'}}[h.k];
 const x0=(h.cx-h.rx)*TS,x1=(h.cx+h.rx)*TS;
 // sombra na base
 for(let x=x0;x<x1;x+=2){const b=hillBot(h,x/TS);if(b===null)continue;DB(g,'rgba(0,0,0,.22)',x+4,b*TS+HFACE-2,2,6)}
 // face sul (paredão de pedra)
 for(let x=x0;x<x1;x+=2){const b=hillBot(h,x/TS);if(b===null)continue;const by=b*TS;for(let y=0;y<HFACE;y+=2){const n=hs(x*3+y,y*7+h.cx);DB(g,n<.18?PALH.f2:n>.85?PALH.f3:PALH.f1,x,by+y,2,2)}
  if(hs(x,h.cy)<.12)DB(g,PALH.f2,x,by+3,1,HFACE-4);DB(g,'rgba(0,0,0,.25)',x,by+HFACE-3,2,3)}
 // topo
 for(let x=x0;x<x1;x+=2){const t=hillTop(h,x/TS),b=hillBot(h,x/TS);if(t===null)continue;for(let y=t*TS;y<b*TS;y+=2){const n=hs(x+5,y*3+h.cy),v=(y-t*TS)/((b-t)*TS);DB(g,n<.3?PALH.top2:PALH.top,x,y,2,2);if(h.k==='red'&&n>.94)DB(g,'#6a8a3a',x,y,2,2);if(h.k==='snow'&&n>.96)DB(g,'#8a9098',x,y,2,2);if(h.k==='moss'&&n>.93)DB(g,'#2f5a28',x,y,2,2)}
  DB(g,PALH.rim,x,t*TS,2,1.5);DB(g,'rgba(0,0,0,.18)',x,b*TS-2,2,2)}
}
function paintCliff(g,c){const y=c.y*TS;for(let x=c.x0*TS;x<(c.x1+1)*TS;x+=2){const tx=Math.floor(x/TS);if(G[ti(tx,c.y)]===3||G[ti(tx,c.y+1)]===3)continue;const top=y-4+hs(x,3)*5;
  for(let yy=top;yy<y+26;yy+=2){const n=hs(x*5+yy,yy);DB(g,n<.2?'#4e545c':n>.82?'#a0a6ae':'#767c84',x,yy,2,2)}DB(g,'#f4f8fa',x,top-2,2,3);DB(g,'rgba(0,0,0,.25)',x,y+24,2,5);if(hs(x,9)<.08)DB(g,'#3a4048',x,top+4,1,18)}}
function paintGround(g){
 for(const h of HILLS)paintHill(g,h);for(const c of CLIFFS)paintCliff(g,c);
 // pátio de concreto do posto com faixas
 const px=62*TS,py=135*TS,pw=16*TS,ph=8*TS;DB(g,'#a8a49c',px,py,pw,ph);for(let x=0;x<pw;x+=32)DB(g,'#8e8a82',px+x,py,1,ph);for(let y=0;y<ph;y+=32)DB(g,'#8e8a82',px,py+y,pw,1);
 for(let i=0;i<14;i++){const x=px+hs(i,1)*pw,y=py+hs(1,i)*ph;DB(g,'rgba(40,36,30,.25)',x,y,6+hs(i,i)*8,3)}
 for(let x=64;x<=70;x+=2)DB(g,'#e8c840',x*TS+6,139*TS+2,4,1);DB(g,'#e8e8e0',62*TS,140*TS+6,16*TS,1);
 // píer de tábuas
 for(let y=144;y<=151;y++)for(let x=216;x<=217;x++){const bx=x*TS,by=y*TS;DB(g,'#8a6038',bx,by,TS,TS);for(let k=0;k<TS;k+=4){DB(g,'#6a4428',bx,by+k,TS,1);DB(g,'#a87a4a',bx,by+k+1,TS,.6)}}
 for(let y=145;y<=151;y+=2){DB(g,'#4a2e18',216*TS-2,y*TS,3,5);DB(g,'#4a2e18',218*TS-1,y*TS,3,5)}
 // mata-burros
 for(const q of GATES){const n=q.t==='n';for(let k=0;k<q.w;k++){const bx=(n?q.x+k:q.x)*TS,by=(n?q.y:q.y+k)*TS;DB(g,'#2a241e',bx+1,by+2,TS-2,TS-4);for(let j=0;j<5;j++){if(n)DB(g,'#9a9aa0',bx+1,by+3+j*2.4,TS-2,1.2);else DB(g,'#9a9aa0',bx+2+j*2.6,by+2,1.2,TS-4)}}}
 // cemitério: chão de terra batida
 for(let y=137;y<=141;y++)for(let x=94;x<=97;x++){DB(g,'#a88a5a',x*TS,y*TS,TS,TS);if(hs(x,y)<.4)DB(g,'#6a8a3a',x*TS+hs(y,x)*12,y*TS+4,3,2)}
}
const _prD=prerender;
prerender=function(){if(PRDEF)return _prD();_prD();if(!GC)return;const g=GC.getContext('2d'),ps0=PS;PS=1;try{paintGround(g)}catch(e){console.warn(e)}finally{PS=ps0}};
// ---------- desenho de objetos
function drawBoulder(g,b){const x=b.x*TS+(b.big?16:8),y=b.y*TS+14,w=b.big?26:15,h=b.big?18:11,C=b.k==='snow'?['#6a7078','#8a9098','#4a5058','#f4f8fa']:b.k==='red'?['#8a4a2a','#a8643a','#6a3420','#c8865a']:['#6a6a62','#8a8a80','#4a4a44','#4f8a3a'];
 DB(g,'rgba(0,0,0,.28)',x-w/2-1,y-2,w+4,4);DB(g,C[0],x-w/2,y-h,w,h);DB(g,C[0],x-w/2+2,y-h-2,w-4,3);DB(g,C[1],x-w/2+2,y-h-1,w*.55,4);DB(g,C[1],x-w/2+1,y-h+3,3,h-6);DB(g,C[2],x+w/2-5,y-h+2,4,h-3);DB(g,C[2],x-w/2,y-3,w,3);
 if(b.big){DB(g,C[2],x-2,y-h+4,1,h-7);DB(g,C[1],x+3,y-h+6,4,3)}
 if(b.k==='snow')DB(g,C[3],x-w/2+2,y-h-3,w*.6,2.5);else if(b.k==='moss'){DB(g,C[3],x-w/2+1,y-h-2,w*.5,2);DB(g,C[3],x+w/2-6,y-h,4,1.5)}else if(b.s<.5)DB(g,'#6a8a3a',x+w/2-3,y-4,3,3)}
function drawPole(g,p){const x=p.x,y=p.y;DB(g,'rgba(0,0,0,.25)',x-2,y-1,6,2);DB(g,'#5a3a22',x-1.2,y-34,2.6,34);DB(g,'#7a5232',x-1.2,y-34,1,34);DB(g,'#4a2e18',x-7,y-31,15,1.6);for(const o of[-6,0,6])DB(g,'#c8d8e0',x+o-.6,y-33.4,1.4,2);
 if(p.prev){const q=p.prev,n=12;for(const o of[-6,6]){for(let i=0;i<n;i++){const t=i/n,t2=(i+1)/n,ax=q.x+o+(x-q.x)*t,ay=q.y-33+(y-q.y)*t+Math.sin(Math.PI*t)*4;DB(g,'#2a2a2a',ax,ay,(x-q.x)/n+.4,.6)}}}}
function arrowPx(g,x,y,d,c){if(d===1){DB(g,c,x,y+1,4,1);DB(g,c,x+3,y,1,3);DB(g,c,x+4,y+1,1,1)}else if(d===-1){DB(g,c,x,y+1,4,1);DB(g,c,x,y,1,3);DB(g,c,x-1,y+1,1,1)}else if(d===0){DB(g,c,x+1,y,1,4);DB(g,c,x,y+2,3,1);DB(g,c,x+1,y+4,1,1)}else{DB(g,c,x+1,y,1,4);DB(g,c,x,y+1,3,1);DB(g,c,x+1,y-1,1,1)}}
function drawDirSign(g,s){const x=s.x*TS+8,y=s.y*TS+14;DB(g,'rgba(0,0,0,.25)',x-3,y-1,7,2);DB(g,'#5a3a22',x-1,y-14-s.L.length*8,2.4,14+s.L.length*8);
 s.L.forEach((l,i)=>{const km=Math.max(1,Math.round(Math.hypot(l[2]-s.x,l[3]-s.y)*.05)),t=l[1]+' '+km+'KM',tw=ptw(t)+9,by=y-14-(s.L.length-i)*8,bx=l[0]===-1?x-tw+2:x-1;
  DB(g,'#1e140c',bx-1,by-1,tw+2,8);DB(g,'#2f6a3a',bx,by,tw,6);DB(g,'#4a8a52',bx,by,tw,.8);ptext(g,t,bx+(l[0]===-1?7:2),by+.6,'#ffffff');arrowPx(g,l[0]===-1?bx+2:bx+tw-6,by+1,l[0],'#ffe27a')})}
function drawKm(g,k){const x=k.x,y=k.y;DB(g,'rgba(0,0,0,.2)',x-3,y-1,7,2);DB(g,'#e8e8e0',x-3,y-11,7,11);DB(g,'#2a2a2a',x-3,y-11,7,1);ptext(g,String(k.n),x-ptw(String(k.n))/2,y-8,'#1a1a1a')}
function drawMill(g,m){const x=m.x,y=m.y,a=frame*.06+m.s*6;DB(g,'rgba(0,0,0,.25)',x-7,y-2,14,3);
 for(let i=0;i<40;i+=3){const w=9-i*.15;DB(g,'#6a6e76',x-w/2,y-i-1,1,1.6);DB(g,'#6a6e76',x+w/2-1,y-i-1,1,1.6)}DB(g,'#8a8e96',x-5,y-14,10,1);DB(g,'#8a8e96',x-3.5,y-28,7,1);
 const hx=x,hy=y-42;for(let k=0;k<8;k++){const an=a+k*Math.PI/4;for(let r=2;r<9;r+=1.2)DB(g,k%2?'#d8d8d0':'#b8b8b0',hx+Math.cos(an)*r-.7,hy+Math.sin(an)*r-.7,1.6,1.6)}DB(g,'#3a3a3a',hx-1.5,hy-1.5,3,3);DB(g,'#c83a2a',hx+2,hy-2,9,3);DB(g,'#a02a1a',hx+9,hy-4,2,6);
 const t=m.tank;if(t){const tx=t.x,ty=t.y;DB(g,'rgba(0,0,0,.25)',tx-8,ty-2,16,3);for(const o of[-6,5])DB(g,'#5a3a22',tx+o,ty-22,2,22);DB(g,'#4a2e18',tx-6,ty-12,13,1);DB(g,'#2a5a8a',tx-8,ty-34,17,13);DB(g,'#3a7ab0',tx-8,ty-34,17,2);DB(g,'#1a3a5a',tx-8,ty-22,17,1.4);for(let i=0;i<4;i++)DB(g,'#23507a',tx-6+i*4,ty-32,1,10)}}
function drawPorteira(g,q){if(q.mine&&q.w<2)return;const n=q.t==='n';
 if(n){const x0=q.x*TS-3,x1=(q.x+q.w)*TS+1,y=q.y*TS+12;for(const x of[x0,x1]){DB(g,'rgba(0,0,0,.25)',x-1,y,5,2);DB(g,'#4a2e18',x,y-34,4,34);DB(g,'#6a4428',x,y-34,1.4,34)}DB(g,'#4a2e18',x0-3,y-38,x1-x0+10,4);DB(g,'#6a4428',x0-3,y-38,x1-x0+10,1);DB(g,'#3a2414',x0-1,y-34,x1-x0+6,1.5)}
 else{const x=q.x*TS+6,y0=q.y*TS+2,y1=(q.y+q.w)*TS+12;for(const y of[y0,y1]){DB(g,'rgba(0,0,0,.25)',x-1,y,6,2);DB(g,'#4a2e18',x,y-30,4,30);DB(g,'#6a4428',x,y-30,1.4,30)}for(let k=0;k<3;k++)DB(g,'#7a5232',x-14,y1-20+k*5,14,1.6);DB(g,'#4a2e18',x-14,y1-22,1.6,18)}}
// --- posto
function drawCanopy(g){const X0=63*TS+6,X1=72*TS,yT=135*TS-4,yB=139*TS+12;for(const x of[64*TS+6,70*TS+6]){DB(g,'#c8c8c0',x,yT+14,4,yB-yT-14);DB(g,'#e8e8e0',x,yT+14,1.2,yB-yT-14);DB(g,'#2a8a3a',x,yB-12,4,3)}
 DB(g,'rgba(0,0,0,.18)',X0+4,yT+20,X1-X0,6);DB(g,'#f4f4f0',X0,yT,X1-X0,14);DB(g,'#2a8a3a',X0,yT+8,X1-X0,4);DB(g,'#f0c020',X0,yT+12,X1-X0,2);DB(g,'#d8d8d0',X0,yT,X1-X0,1);ptext(g,'POSTO RODOVIA',(X0+X1)/2-ptw('POSTO RODOVIA')/2,yT+2,'#2a6a32');
 const n=dayHour()>=18||dayHour()<5.5;for(let x=X0+10;x<X1-6;x+=22)DB(g,n?'#fff8c0':'#c8c8b8',x,yT+14,8,1.4)}
function drawPump(g,x){const X=x*TS+4,Y=138*TS+14;DB(g,'rgba(0,0,0,.25)',X-1,Y-1,10,3);DB(g,'#2a8a3a',X,Y-18,8,18);DB(g,'#f4f4f0',X+1,Y-16,6,6);DB(g,'#1a2a1a',X+2,Y-15,4,2);DB(g,'#5ad85a',X+2,Y-15,(frame>>4)%4+1,1);DB(g,'#f0c020',X,Y-19,8,2);DB(g,'#1a1a1a',X+8,Y-12,1.4,8);DB(g,'#1a1a1a',X+8,Y-5,3,1.2);DB(g,'#c8c8c0',X+1,Y-8,6,3)}
function drawStore(g){const x=72*TS,y=136*TS,w=5*TS,h=4*TS,by=y+h;DB(g,'rgba(0,0,0,.22)',x+3,by-1,w,5);DB(g,'#e8e2d4',x,y+16,w,h-16);DB(g,'#d8d0c0',x,y+16,w,2);
 DB(g,'#2a3a4a',x+4,y+26,w-30,22);DB(g,'#7ab0d0',x+5,y+27,w-32,20);DB(g,'#a8d8f0',x+6,y+28,8,8);for(let i=x+5;i<x+w-28;i+=12)DB(g,'#e8e2d4',i,y+27,1,20);
 const dx=x+w-22;DB(g,'#3a2a1a',dx,by-26,16,26);DB(g,'#7ab0d0',dx+2,by-24,12,14);DB(g,'#c8a040',dx+11,by-12,1.5,1.5);
 DB(g,'#2a8a3a',x-2,y+6,w+4,10);DB(g,'#f0c020',x-2,y+14,w+4,2);ptext(g,'LANCHONETE',x+w/2-ptw('LANCHONETE')/2,y+8,'#ffffff');DB(g,'#c8c8c0',x-2,y+4,w+4,2);
 DB(g,'#c83a2a',x+6,by-6,8,6);DB(g,'#f4f4f0',x+7,by-5,6,1);DB(g,'#5a3a22',x+18,by-4,12,1.4);DB(g,'#5a3a22',x+19,by-3,1,3);DB(g,'#5a3a22',x+28,by-3,1,3)}
function drawBorr(g){const x=62*TS,y=139*TS,w=2*TS,by=142*TS;DB(g,'rgba(0,0,0,.22)',x+2,by-1,w,4);DB(g,'#b8a888',x,y+8,w,by-y-8);DB(g,'#8a8a92',x-2,y+2,w+4,8);for(let i=0;i<w+4;i+=3)DB(g,'#6a6a72',x-2+i,y+2,1,8);
 DB(g,'#2a2a2a',x+6,by-18,14,18);ptext(g,'PNEU',x+w/2-ptw('PNEU')/2,y+12,'#c83a2a');
 for(let k=0;k<4;k++){DB(g,'#141414',x+w+1,by-6-k*5,10,5);DB(g,'#3a3a3a',x+w+3,by-5-k*5,6,3)}DB(g,'#141414',x-9,by-6,8,6);DB(g,'#3a3a3a',x-7,by-5,4,4)}
function drawPylon(g){const x=77*TS+8,y=135*TS+14;DB(g,'rgba(0,0,0,.25)',x-3,y-1,8,3);DB(g,'#8a8a92',x-1.5,y-46,3,46);DB(g,'#1a1a1a',x-15,y-62,30,20);DB(g,'#2a8a3a',x-14,y-61,28,6);ptext(g,'POSTO',x-ptw('POSTO')/2,y-60,'#ffffff');ptext(g,'DIESEL 6,19',x-14,y-53,'#f0c020');ptext(g,'GASOL 5,89',x-14,y-47,'#f0c020')}
// --- caminhão boiadeiro
function drawBoiadeiro(g,x,y,dir,c,drv){const side=dir>=2,d=dir===3?1:-1,r=(col,dx,dy,w,h)=>Rr(g,col,side?(d>0?x+dx:x-dx-w):x+dx,y+dy,w,h),C=c||'#c83a2a',hl=drv&&(dayHour()>=18||dayHour()<5.5);
 if(side){Rr(g,'rgba(0,0,0,.3)',x-40,y-2,80,6);
  r('#5a4632',-38,-34,52,26);for(let i=0;i<6;i++)r('#7a6040',-38,-33+i*4.4,52,2);for(let i=0;i<8;i++)r('#4a3624',-38+i*7,-34,1.4,26);
  for(let i=0;i<5;i++){const cx=-34+i*10;r(i%2?'#e8e2d4':'#c8a080',cx,-30+((i*7)%3),5,4);r('#1a1a1a',cx+3,-29+((i*7)%3),1,1)}
  r('#2a2a2a',-38,-8,52,3);r(C,16,-30,20,22);r(shade(C,20),16,-30,20,2);r('#1a2a3a',26,-27,9,9);r('#7ab0d0',27,-26,7,7);if(drv)r('#c89a70',28,-24,3,3);r('#1a1a1a',34,-16,3,8);r(hl?'#fff8c0':'#d8d0a0',35,-14,2,3);r('#c8c8c0',36,-9,3,2);r('#8a8a8a',14,-38,2,10);
  for(const wx of[-34,-22,22]){r('#141414',wx,-9,10,10);r('#4a4a4a',wx+2,-7,6,6);r('#9a9aa0',wx+3.5,-5.5,3,3)}}
 else{const front=dir===0;Rr(g,'rgba(0,0,0,.3)',x-16,y-2,32,6);r('#141414',-16,-10,6,10);r('#141414',10,-10,6,10);
  if(front){r(C,-14,-34,28,28);r('#1a2a3a',-11,-31,22,9);r('#7ab0d0',-10,-30,20,7);r('#d8d8d0',-12,-16,24,4);r(hl?'#fff8c0':'#e8e0b0',-13,-11,5,3);r(hl?'#fff8c0':'#e8e0b0',8,-11,5,3);if(drv)r('#c89a70',-3,-29,5,4)}
  else{r('#5a4632',-14,-38,28,32);for(let i=0;i<6;i++)r('#7a6040',-14,-37+i*5,28,2);r('#c83a2a',-13,-8,4,2);r('#c83a2a',9,-8,4,2)}}}
// --- capela, cemitério e ruína
function drawCapela(g){const x=88*TS,y=136*TS,w=4*TS,h=4*TS,by=y+h,cx=x+w/2;DB(g,'rgba(0,0,0,.22)',x+3,by-1,w,5);DB(g,'#f4f0e8',x,y+18,w,h-18);DB(g,'#3a6ab0',x,by-4,w,4);DB(g,'#3a6ab0',x,y+18,w,2);
 for(let r=0;r<12;r+=2)DB(g,r<2?'#d86a4a':'#b5532e',x-3+r*.3,y+6+r,w+6-r*.6,2);
 DB(g,'#f4f0e8',cx-8,y-6,16,14);DB(g,'#b5532e',cx-10,y-10,20,4);DB(g,'#2a2a2a',cx-3,y-3,6,6);DB(g,'#c8a040',cx-2,y-2+((frame>>5)&1),4,4);DB(g,'#5a3a22',cx-.8,y-22,1.6,12);DB(g,'#5a3a22',cx-4,y-18,8,1.6);
 DB(g,'#5a3a22',cx-7,by-22,14,22);DB(g,'#7a5232',cx-6,by-21,12,21);DB(g,'#5a3a22',cx-.5,by-21,1,21);DB(g,'#c8a040',cx+3,by-11,1.4,1.4);DB(g,'#9a948a',cx-9,by,18,2);
 DB(g,'#3a6ab0',x+5,y+24,6,8);DB(g,'#3a6ab0',x+w-11,y+24,6,8);DB(g,'#f0e060',x+7,y+26,2,4);DB(g,'#f0e060',x+w-9,y+26,2,4)}
function drawCemit(g){const x0=93*TS,y0=136*TS,x1=99*TS,y1=143*TS;
 const wall=(x,y,w,h)=>{DB(g,'#d8d4cc',x,y-8,w,h+8);DB(g,'#f0ece4',x,y-8,w,1.4);DB(g,'#a8a49c',x,y+h-1,w,1)};
 wall(x0,y0+6,x1-x0,6);wall(x0,y0+6,6,y1-y0-6);wall(x1-6,y0+6,6,y1-y0-6);wall(x0,y1-6,2*TS,6);wall(x0+4*TS,y1-6,x1-x0-4*TS,6);
 DB(g,'#3a3a3a',x0+2*TS,y1-16,1.4,12);DB(g,'#3a3a3a',x0+4*TS-1,y1-16,1.4,12);for(let i=0;i<8;i++)DB(g,'#3a3a3a',x0+2*TS+2+i*3.6,y1-14,1,10);
 for(let r=0;r<3;r++)for(let c=0;c<3;c++){const gx=x0+14+c*24,gy=y0+30+r*28,k=hs(r,c);DB(g,'rgba(0,0,0,.2)',gx-4,gy,10,2);
  if(k<.5){DB(g,'#f4f4f0',gx,gy-13,2,13);DB(g,'#f4f4f0',gx-3,gy-10,8,2)}else{DB(g,'#8a8a90',gx-3,gy-10,8,10);DB(g,'#a8a8b0',gx-2,gy-12,6,3);DB(g,'#6a6a70',gx-1,gy-7,4,.8)}
  DB(g,'#8a6a42',gx-4,gy,10,3);if(k>.3&&k<.8){DB(g,'#d84a5a',gx-2,gy-1,2,2);DB(g,'#f0e060',gx+2,gy-1,2,2)}}
 for(const [cx,cy] of[[x0+10,y0+12],[x1-10,y0+12]]){DB(g,'#5a3a22',cx-1,cy-2,2,6);for(let i=0;i<26;i+=2)DB(g,i%4?'#1f4a2a':'#2a5a32',cx-3+Math.sin(i)*.5-(i<6?1:i>20?-1:0),cy-4-i,6-(i>18?(i-18)*.5:0),2)}}
function drawRuina(g){const x=80*TS,y=148*TS,w=8*TS,h=5*TS,by=y+h;DB(g,'rgba(0,0,0,.22)',x+3,by-1,w,5);
 const wall=(wx,wy,ww,wh,k)=>{for(let i=0;i<ww;i+=4)for(let j=0;j<wh;j+=3){const n=hs(wx+i,wy+j+k);if(n<.12)continue;DB(g,n<.4?'#9a8a72':n<.8?'#b0a088':'#7a6a54',wx+i,wy+j,4,3)}};
 wall(x,y+18,w,h-18,1);for(let i=0;i<w;i+=4){const top=y+18-hs(i,3)*16;wall(x+i,top,4,y+18-top,2)}
 for(const wx of[x+10,x+40,x+86])DB(g,'#1e1814',wx,by-34,14,12);DB(g,'#1e1814',x+60,by-26,16,26);DB(g,'#4a3a2a',x+60,by-26,3,26);
 for(let i=0;i<5;i++)DB(g,'#4a3626',x+8+i*22,y+6+(i%2)*4,2.4,16);DB(g,'#4a3626',x+6,y+10,w-14,2);
 for(let i=0;i<12;i++){const vx=x+hs(i,7)*w,vy=y+20+hs(7,i)*(h-24);DB(g,'#3f7030',vx,vy,3,5);DB(g,'#4f8a3a',vx+1,vy+3,3,3)}
 for(let i=0;i<10;i++)DB(g,'#8a7a62',x-6+hs(i,2)*(w+12),by-2+hs(2,i)*5,4+hs(i,i)*5,3);
 const bx=90*TS,bw=6*TS,bb=153*TS;for(let i=0;i<4;i++){const px=bx+4+i*30;DB(g,'#4a3626',px,bb-38+(i===2?12:0),3,38-(i===2?12:0))}DB(g,'#4a3626',bx+4,bb-38,bw-40,2.4);DB(g,'#3a2a1e',bx+50,bb-30,40,2);DB(g,'#5a4632',bx+20,bb-6,30,4);
 if(dayHour()>=19||dayHour()<4.5){const t=frame/40,gx=x+30+Math.sin(t)*18,gy=y+10+Math.cos(t*1.3)*6,a=.35+.25*Math.sin(frame/9);DB(g,'rgba(200,240,255,'+a.toFixed(2)+')',gx-3,gy-3,6,6);DB(g,'rgba(200,240,255,'+(a*.4).toFixed(2)+')',gx-7,gy-7,14,14)}}
function drawPoco(g){const x=85*TS+8,y=156*TS+14;DB(g,'rgba(0,0,0,.25)',x-10,y-1,20,3);DB(g,'#7a7a72',x-9,y-10,18,10);DB(g,'#9a9a92',x-9,y-10,18,2);DB(g,'#1a1610',x-6,y-9,12,3);for(let i=0;i<4;i++)DB(g,'#5a5a54',x-9+i*5,y-6,1,6);
 DB(g,'#4a3626',x-8,y-26,2,16);DB(g,'#4a3626',x+6,y-22,2,12);DB(g,'#4a3626',x-8,y-26,10,2);DB(g,'#8a8a8a',x,y-24,1,9);DB(g,'#6a4a2a',x-2,y-16,4,3)}
function drawDeadTree(g,x,y){DB(g,'rgba(0,0,0,.2)',x-6,y-2,12,3);DB(g,'#6a6058',x-2,y-30,4,30);DB(g,'#6a6058',x-10,y-28,9,2);DB(g,'#6a6058',x+1,y-22,9,2);DB(g,'#6a6058',x-10,y-34,2,7);DB(g,'#6a6058',x+8,y-28,2,7);DB(g,'#5a5048',x-1,y-30,1,28)}
// --- cooperativa e usina
function drawSilo(g,i){const x=(62+i*2)*TS+2,by=82*TS+14,w=28,h=58;DB(g,'rgba(0,0,0,.25)',x+3,by-2,w,5);DB(g,'#b8c0c8',x,by-h,w,h);for(let k=0;k<w;k+=3)DB(g,'#9aa2ab',x+k,by-h,1,h);DB(g,'#d8e0e6',x+2,by-h,5,h);DB(g,'#7a828b',x+w-4,by-h,4,h);for(let k=10;k<h;k+=12)DB(g,'#8a929b',x,by-h+k,w,1);
 for(let r=0;r<8;r+=2)DB(g,'#a8b0b8',x+r,by-h-8+r,w-r*2,2);DB(g,'#6d7580',x+w/2-2,by-h-10,4,3);for(let k=0;k<h;k+=4)DB(g,'#4a4a4a',x+w-7,by-h+k,4,1);DB(g,'#4a4a4a',x+w-7,by-h,1,h);DB(g,'#4a4a4a',x+w-4,by-h,1,h)}
function drawArmazem(g){const x=68*TS,y=78*TS,w=6*TS,h=5*TS,by=y+h;DB(g,'rgba(0,0,0,.22)',x+3,by-1,w,5);DB(g,'#c8c0a8',x,y+20,w,h-20);for(let i=0;i<w;i+=4)DB(g,'#b0a890',x+i,y+20,1,h-20);
 for(let r=0;r<20;r+=2){const inset=Math.max(0,8-r)*1.2;DB(g,r<4?'#a8b0b8':'#8a929b',x-3+inset,y+r,w+6-inset*2,2)}for(let i=0;i<w+6;i+=5)DB(g,'#6d7580',x-3+i,y+6,1,14);
 DB(g,'#3a3a3a',x+w/2-14,by-30,28,30);for(let i=0;i<6;i++)DB(g,'#5a5a5a',x+w/2-14,by-29+i*5,28,1);DB(g,'#2a6a32',x+6,y+24,w-12,8);ptext(g,'COOPERATIVA',x+w/2-ptw('COOPERATIVA')/2,y+25.5,'#ffffff');
 for(let i=0;i<3;i++){DB(g,'#d8b860',x+8+i*8,by-8,7,8);DB(g,'#b89840',x+8+i*8,by-8,7,1)}}
function drawUsina(g){const x=74*TS,y=77*TS,w=7*TS,h=5*TS,by=y+h;DB(g,'rgba(0,0,0,.22)',x+3,by-1,w,5);DB(g,'#a8503a',x,y+16,w,h-16);for(let j=16;j<h;j+=4)for(let i=(j/4)%2?0:4;i<w;i+=8)DB(g,'#8a3e2c',x+i,y+j,7,1);
 DB(g,'#6d7580',x-2,y+10,w+4,7);DB(g,'#8a929b',x-2,y+10,w+4,1.4);DB(g,'#2a2a2a',x+20,by-28,24,28);for(let i=0;i<5;i++)DB(g,'#4a4a4a',x+20,by-27+i*5.5,24,1);
 for(const wx of[x+8,x+56,x+82])if(wx<x+w-10){DB(g,'#1a2a3a',wx,y+24,10,10);DB(g,'#e8c860',wx+1,y+25,8,4)}
 const cx=x+w-18;DB(g,'#8a3e2c',cx,y-50,10,66);for(let k=0;k<66;k+=6)DB(g,'#a8503a',cx,y-50+k,10,1);DB(g,'#5a2a1e',cx-1,y-52,12,4);DB(g,'#f4f0e8',cx,y-40,10,3);
 DB(g,'#c8c8c0',x+4,by-44,16,30);DB(g,'#e8e8e0',x+4,by-44,16,2);DB(g,'#9a9a92',x+4,by-16,16,2);
 const hx=x+4,hy=by+6;for(let i=0;i<14;i++)DB(g,i%3?'#6a8a3a':'#8aa04a',hx+i*3,hy-4-((i*5)%4),4,4+((i*5)%4))}
// --- pesqueiro
function drawRancho(g,x0,sign){const x=x0*TS,y=140*TS,w=6*TS,h=4*TS,by=y+h;DB(g,'rgba(0,0,0,.22)',x+3,by-1,w,5);for(let i=0;i<w;i+=10)DB(g,'#4a3626',x+i+2,by-8,3,8);
 DB(g,'#8a6038',x,y+18,w,h-26);for(let i=0;i<w;i+=4)DB(g,'#6a4428',x+i,y+18,1,h-26);
 for(let r=0;r<18;r+=2)DB(g,r%4?'#c8a860':'#b09048',x-4+r*.4,y+r,w+8-r*.8,2);for(let i=0;i<w+8;i+=3)DB(g,'#9a7a38',x-4+i,y+14+((i*7)%4),1,4);
 DB(g,'#2a1a10',x+w/2-6,by-24,12,16);DB(g,'#1a2a3a',x+8,y+24,10,8);DB(g,'#1a2a3a',x+w-18,y+24,10,8);DB(g,'#6a4428',x-2,by-8,w+4,2);
 if(sign){DB(g,'#1e140c',x+w/2-38,y-14,76,10);DB(g,'#2f6a7a',x+w/2-37,y-13,74,8);ptext(g,'PESQUEIRO',x+w/2-ptw('PESQUEIRO')/2,y-11.5,'#ffffff')}}
function drawVaral(g){const x=213*TS,y=142*TS+14;DB(g,'#4a3626',x,y-18,2,18);DB(g,'#4a3626',x+26,y-18,2,18);DB(g,'#3a2a1a',x,y-18,28,1);for(let i=0;i<4;i++){const fx=x+3+i*6;DB(g,'#9aa0a8',fx,y-17,3,8);DB(g,'#c8ccd0',fx,y-17,1,6);DB(g,'#6a7078',fx+1,y-9,1,2)}}
function drawBoat(g,x,y,c){const b=Math.sin(frame/22+x)*.8;DB(g,'rgba(0,0,0,.18)',x-14,y+3+b,28,3);DB(g,c,x-14,y-4+b,28,6);DB(g,shade(c,-30),x-14,y+1+b,28,1.6);DB(g,shade(c,25),x-12,y-4+b,24,1);DB(g,'#5a3a22',x-8,y-3+b,16,2);DB(g,'#2a2a2a',x+12,y-6+b,3,4)}
// ---------- tráfego
const TRT=[{h:1,c:48*TS,a:(XMIN+1)*TS,b:(MW-2)*TS},{h:1,c:86*TS,a:8*TS,b:(MW-2)*TS},{h:1,c:134*TS,a:(XMIN+1)*TS,b:(MW-2)*TS},{h:0,c:60*TS,a:52*TS,b:(RZ-3)*TS},{h:0,c:161*TS,a:48*TS,b:133*TS}];
const TRF=[];let trfT=2;
function trfSpawn(){
 const cand=TRT.map((r,i)=>({r,i,d:r.h?Math.abs(P.y-r.c):Math.abs(P.x-r.c)})).filter(o=>o.d<320&&(o.r.h?P.x>o.r.a-200&&P.x<o.r.b+200:P.y>o.r.a-200&&P.y<o.r.b+200));if(!cand.length)return;
 const o=pick(cand),r=o.r,dir=Math.random()<.5?1:-1,pp=r.h?P.x:P.y,span=(r.h?VW:VH)/2+90+rnd(0,140);let s=pp-dir*span;s=clamp(s,r.a,r.b);if(Math.abs(s-pp)<(r.h?VW:VH)/2+40)return;
 const kinds=r.h?['car','car','pick','truck','truck','trat']:['pick','pick','truck','trat'],k=pick(kinds);if(k==='trat'&&o.i===0&&Math.abs(P.x-76*TS)<40*TS)return;
 const car=k==='car'?pick(ECARS):null;
 TRF.push({r:o.i,dir,s,k,c:car?car.c:pick(['#c83a2a','#e8e8e8','#2a6ad8','#3a4a32','#d8a52a']),t:car?car.t:null,v:{car:72,pick:62,truck:46,trat:22}[k],hk:0})}
function trfPos(v){const r=TRT[v.r];if(r.h)return{x:v.s,y:r.c+(v.dir>0?9:-3),dir:v.dir>0?3:2};return{x:r.c+(v.dir>0?-8:8),y:v.s,dir:v.dir>0?0:1}}
function stepTraffic(dt){
 if(inRoom()){return}trfT-=dt;if(trfT<=0){trfT=rnd(2.2,5);if(TRF.length<5)trfSpawn()}
 for(let i=TRF.length-1;i>=0;i--){const v=TRF[i],r=TRT[v.r],p=trfPos(v);
  let sp=v.v;const ahead=(ax,ay)=>r.h?(ax-p.x)*v.dir:(ay-p.y)*v.dir,lat=(ax,ay)=>r.h?Math.abs(ay-p.y):Math.abs(ax-p.x),L=v.k==='truck'?84:v.k==='car'?50:44;
  const pa=ahead(P.x,P.y);if(pa>0&&pa<L+14&&lat(P.x,P.y)<12){sp=0;v.hk-=dt;if(v.hk<=0){v.hk=4;honk(v.k==='truck');tt('honk','🚚 Bi-biii! Saia da estrada!','bad',6)}}
  for(const w of TRF)if(w!==v&&w.r===v.r&&w.dir===v.dir){const d=(w.s-v.s)*v.dir;if(d>0&&d<L+30)sp=Math.min(sp,d<L+14?0:w.v)}
  v.s+=v.dir*sp*dt;v.mv=sp>0;
  if(v.s<r.a-40||v.s>r.b+40||Math.hypot(p.x-P.x,p.y-P.y)>900)TRF.splice(i,1)}
}
function honk(big){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime;for(let k=0;k<2;k++){const o=AC.createOscillator(),gn=AC.createGain();o.type='square';o.frequency.value=big?220:340;gn.gain.setValueAtTime(.0001,t+k*.22);gn.gain.exponentialRampToValueAtTime(.05,t+k*.22+.02);gn.gain.exponentialRampToValueAtTime(.0001,t+k*.22+.18);o.connect(gn);gn.connect(AC.destination);o.start(t+k*.22);o.stop(t+k*.22+.2)}}catch(e){}}
function drawTrf(g,v){const p=trfPos(v);if(v.k==='car')carW(g,p.x,p.y,v.c,v.t,p.dir===3?1:-1);else if(v.k==='pick')drawPickup(g,p.x,p.y,p.dir,1);else if(v.k==='trat')drawTractorV(g,p.x,p.y,p.dir,1);else drawBoiadeiro(g,p.x,p.y,p.dir,v.c,1)}
// ---------- peões nas rivais
const RW=[];
(function(){RF.forEach((f,fi)=>{const p=f.pas,yb=(f.barn.y+f.barn.h)*TS+16,cl=RVP[f.i].lk;
 if(f.kind==='leite'){RW.push({t:'milk',f:fi,x:(f.barn.door+1)*TS,y:yb,cow:{id:-(9500+fi),breed:RVP[f.i].br,sex:'F',age:900,name:'',w:420}})}
 if(f.kind==='lavoura'&&f.crop){const c=f.crop;RW.push({t:'trat',f:fi,x:c.x0*TS+8,y:(c.y0+.5)*TS+12,dir:3,row:0})}
 const nr=f.kind==='haras'?2:f.kind==='leite'||f.kind==='lavoura'?0:1;
 for(let k=0;k<nr;k++)RW.push({t:'ride',f:fi,x:(p.x0+2+k*4)*TS,y:(p.y0+2+k*3)*TS,tx:0,ty:0,dir:3,b:['crioulo','pantaneiro','quarto','mangalarga'][(fi+k)%4],wait:k*2,ph:0,mv:0,shirt:['#8a5a2a','#3a5a8a','#6a2a2a'][k%3]});
 RW.push({t:'walk',f:fi,x:(f.house.x+f.house.w+1)*TS,y:(f.yard.y0+1)*TS+4,tx:0,ty:0,dir:0,wait:rnd(0,3),ph:0,mv:0,shirt:['#5a7a3a','#c8a060','#3a6aa0','#a04a3a'][fi%4]});
});})();
function stepWorkers(dt){if(inRoom())return;for(const w of RW){const f=RF[w.f];if(Math.abs(w.x-P.x)>VW+240||Math.abs(w.y-P.y)>VH+240)continue;
 if(w.t==='trat'){const c=f.crop,yy=(c.y0+.5+w.row*2)*TS+12;w.y+=(yy-w.y)*Math.min(1,dt*2);const x0=c.x0*TS+20,x1=(c.x1+1)*TS-20;w.x+=(w.dir===3?1:-1)*20*dt;if(w.dir===3&&w.x>x1){w.dir=2;w.row=(w.row+1)%Math.max(1,Math.floor((c.y1-c.y0)/2))}else if(w.dir===2&&w.x<x0){w.dir=3;w.row=(w.row+1)%Math.max(1,Math.floor((c.y1-c.y0)/2))}continue}
 if(w.t==='milk')continue;
 if(w.wait>0){w.wait-=dt;w.mv=0;continue}
 if(!w.tx){if(w.t==='ride'){const p=f.pas;w.tx=(p.x0+2+Math.random()*(p.x1-p.x0-4))*TS;w.ty=(p.y0+2+Math.random()*(p.y1-p.y0-4))*TS}else{const Y=f.yard;w.tx=(Y.x0+1+Math.random()*(Y.x1-Y.x0-2))*TS;w.ty=(Y.y0+.6+Math.random()*1.6)*TS}}
 const dx=w.tx-w.x,dy=w.ty-w.y,d=Math.hypot(dx,dy);if(d<2){w.tx=0;w.wait=rnd(2,7);w.mv=0;continue}
 const sp=w.t==='ride'?24:14;w.x+=dx/d*sp*dt;w.y+=dy/d*sp*dt;w.mv=1;w.ph+=dt*(w.t==='ride'?2.4:2.2);w.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1);if(w.t==='ride'&&w.dir<2)w.dir=dx>0?3:2}}
function drawWorker(g,w){
 if(w.t==='ride'){OL(g,w.x,w.y+3,44,52,c=>drawCmtPeon(c,{x:w.x,y:w.y,dir:w.dir,b:w.b,mv:w.mv,ph:w.ph}));return}
 if(w.t==='trat'){drawTractorV(g,w.x,w.y,w.dir,1);return}
 if(w.t==='milk'){const cx=w.x+18,cy=w.y-10;OL(g,cx+8.5,cy+12,28,24,c=>drawCow(c,w.cow,cx,cy,-1,0));const b=(frame>>3)&1;
  OL(g,w.x,w.y+3,30,42,c=>drawPerson(c,{x:w.x,y:w.y,dir:3,ph:0,mv:0,shirt:'#c86a8a',hair:'#3a2a1a',hat:'#e8d8b0',pants:'#4a3a5a',g:'f'}));DB(g,'#9aa0a8',w.x+5,w.y-5,6,6);DB(g,'#f4f4f0',w.x+6,w.y-5,4,1.4);if(b)DB(g,'#f4f4f0',w.x+8,w.y-9,1,3);
  DB(g,'#b8c0c8',w.x-14,w.y-10,6,10);DB(g,'#d8e0e6',w.x-14,w.y-10,6,1.6);DB(g,'#b8c0c8',w.x-7,w.y-10,6,10);return}
 OL(g,w.x,w.y+3,30,42,c=>drawPerson(c,{x:w.x,y:w.y,dir:w.dir,ph:w.ph,mv:w.mv,shirt:w.shirt,hair:'#2a1a10',hat:'#d8c080',pants:'#3a3a5a'}));if(!w.mv){DB(g,'#7a7a82',w.x+5,w.y-8,5,5);DB(g,'#c8a040',w.x+6,w.y-8,3,1.4)}}
// ---------- atualização
const _updD=update;update=function(dt){_updD(dt);stepTraffic(dt);stepWorkers(dt);if(S.borrD!==undefined){VEH.pick.spd=S.borrD>=S.day?260:235}};
// ---------- itens com profundidade
const _evoD=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoD(L,x0,x1,y0,y1);if(inRoom())return;
 const add=(x,y,fn,m)=>{if(x>x0-(m||80)&&x<x1+(m||80)&&y>y0-30&&y<y1+110)L.push([y,10,{draw:fn}])};
 for(const b of BOULD)add(b.x*TS+8,b.y*TS+14,g=>drawBoulder(g,b));
 for(const p of DPOLES)add(p.x,p.y,g=>drawPole(g,p),140);
 for(const s of SIGNS)add(s.x*TS+8,s.y*TS+14,g=>drawDirSign(g,s),90);
 for(const k of KMS)add(k.x,k.y,g=>drawKm(g,k));
 for(const m of MILLS)add(m.x,m.y,g=>drawMill(g,m),60);
 for(const q of GATES)add(q.x*TS+8,(q.t==='n'?q.y*TS+12:(q.y+q.w)*TS+12),g=>drawPorteira(g,q));
 // posto
 add(67*TS,139*TS+12,drawCanopy,140);for(const x of[65,67,69])add(x*TS+8,138*TS+14,g=>drawPump(g,x));add(74*TS,140*TS,drawStore,100);add(63*TS,142*TS,drawBorr);add(77*TS+8,135*TS+14,drawPylon);add(68*TS,141*TS+14,g=>drawBoiadeiro(g,68*TS+4,141*TS+14,3,'#2a6ad8',0),120);
 // capela, cemitério, ruína
 add(90*TS,140*TS,drawCapela,90);add(96*TS,137*TS,drawCemit,100);add(84*TS,153*TS,drawRuina,140);add(85*TS+8,156*TS+14,drawPoco);add(78*TS+8,151*TS,g=>drawDeadTree(g,78*TS+8,151*TS));add(95*TS+8,157*TS,g=>drawDeadTree(g,95*TS+8,157*TS));
 // cooperativa e usina
 for(let i=0;i<3;i++)add((63+i*2)*TS,82*TS+14,g=>drawSilo(g,i),80);add(71*TS,83*TS,drawArmazem,100);add(77*TS,82*TS,drawUsina,120);add(71*TS,84*TS+14,g=>drawBoiadeiro(g,71*TS,84*TS+12,2,'#e8e8e8',0),110);
 // pesqueiro
 add(207*TS,144*TS,g=>drawRancho(g,204,1),100);add(225*TS,144*TS,g=>drawRancho(g,222,0),100);add(214*TS,142*TS+14,drawVaral);
 add(213*TS,149*TS,g=>drawBoat(g,213*TS,149*TS,'#2a6a7a'),60);add(221*TS,150*TS,g=>drawBoat(g,221*TS,150*TS,'#8a3a2a'),60);add(209*TS,152*TS,g=>drawBoat(g,209*TS,152*TS,'#3a7a3a'),60);
 // trânsito e peões
 for(const v of TRF){const p=trfPos(v);add(p.x,p.y,g=>drawTrf(g,v),120)}
 for(const w of RW)add(w.x,w.y,g=>drawWorker(g,w));
};
// fumaça da usina
const SMKU=[];let smkT=0;
const _dpD=drawPart;drawPart=function(g){_dpD(g);if(inRoom())return;const cx=79*TS+5,cy=77*TS-52;if(dvis(cx,cy,120)){smkT-=1;if(smkT<=0){smkT=6;SMKU.push({x:cx+rnd(-2,2),y:cy,t:0})}}
 for(let i=SMKU.length-1;i>=0;i--){const s=SMKU[i];s.t+=1;s.y-=.35;s.x+=.18+Math.sin(s.t/20)*.15;const a=Math.max(0,.5-s.t/260),r=3+s.t/18;if(a<=0){SMKU.splice(i,1);continue}DB(g,'rgba(210,210,205,'+a.toFixed(2)+')',s.x-r,s.y-r,r*2,r*2)}};
// ---------- interações
function lancheModal(){const it=[['cafe','☕ Café coado',6,6],['pastel','🥟 Pastel de carne',14,18],['prato','🍛 Prato feito',28,40],['xtudo','🍔 X-tudo caprichado',36,55]];
 showModal('<h3>🍔 Lanchonete do Posto Rodovia</h3><div class="dim">Caminhoneiros, peões e viajantes param aqui. Comida recupera vida.</div>'+it.map(x=>'<div class="card"><div class="row"><b>'+x[1]+'</b><span class="gold">'+R$(x[2])+'</span></div><div class="dim">+'+x[3]+' de vida</div><div class="btns"><button class="b gold" data-act="pfood" data-v="'+x[0]+'">Comprar</button></div></div>').join('')+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
ACT.pfood=function(e){const m={cafe:[6,6],pastel:[14,18],prato:[28,40],xtudo:[36,55]}[e.v];if(!m)return;if(S.money<m[0])return toast('Dinheiro insuficiente','bad');cash(-m[0],'Lanchonete do posto');P.hp=Math.min(100,P.hp+m[1]);toast('😋 Delícia! +'+m[1]+' de vida','good')};
function borrModal(){const own=typeof vOwn==='function'&&vOwn('pick'),on=S.borrD>=S.day;showModal('<h3>🛞 Borracharia do Posto</h3><div class="card">'+(own?(on?'Pneus calibrados e óleo trocado: a caminhonete anda 10% mais rápido até o dia '+(S.borrD+1)+'.':'Calibrar os pneus e trocar o óleo da caminhonete deixa ela 10% mais rápida por 5 dias.'):'Sem caminhonete por enquanto. Compre uma com o Zé do Campo.')+'</div><div class="btns">'+(own&&!on?'<button class="b gold" data-act="borr">Fazer o serviço '+R$(180)+'</button>':'')+'<button class="b gray" data-act="close">Sair</button></div>')}
ACT.borr=function(){if(S.money<180)return toast('Dinheiro insuficiente','bad');cash(-180,'Borracharia');S.borrD=S.day+4;hideModal();toast('🛞 Pneus calibrados! Caminhonete +10% de velocidade por 5 dias','good')};
function capelaModal(){const hoje=S.capD===S.day,dom=S.day%7===0;showModal('<h3>⛪ Capelinha de São Benedito</h3><div class="card"><i>Uma capelinha branca na beira da rodovia. Velas acesas, fitas coloridas e fotos de bois e cavalos deixadas como promessa.</i></div>'+(hoje?'<div class="dim">Você já rezou aqui hoje.</div>':'<div class="btns"><button class="b gold" data-act="capreza">🙏 Acender uma vela e rezar</button></div>')+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
ACT.capreza=function(){if(S.capD===S.day)return;S.capD=S.day;S.rep=Math.min(100,(S.rep||0)+(S.day%7===0?2:1));hideModal();toast(pick(['🕯️ Que São Benedito proteja o gado e a família.','🕯️ Pediu chuva boa e pasto verde.','🕯️ Uma paz tomou conta. (+reputação)']),'good')};
function tumuloModal(){showModal('<h3>🪦 Cemitério Velho</h3><div class="card">Na lápide mais antiga, quase apagada:<br><b>CEL. TIBÚRCIO DE ALMEIDA · 1891–1957</b><br><i>“Dono da Fazenda Esperança. Guardou no poço o que o banco não levou.”</i></div><div class="dim">Outras lápides: Maria das Dores (1902–1979) · José Pião (1920–1988) · Nhô Quim, tropeiro (1888–1950).</div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
function pocoAct(){if(S.ruinT){toast('O poço está seco e vazio. Só restam pedras e teias.');return}S.ruinT=S.day;const v=25000;cash(v,'Tesouro do Coronel Tibúrcio');gainXP(80,'tesouro');showModal('<h3>💰 O tesouro do Coronel!</h3><div class="card">Puxando a corda podre do poço, sai um baú de ferro enferrujado. Dentro: moedas de ouro antigas, um relógio de bolso e a escritura da Fazenda Esperança.</div><div class="gold">+'+R$(v)+' e +80 XP</div><div class="btns"><button class="b gray" data-act="close">Que sorte!</button></div>')}
function vendeModal(kind){const ks=kind==='usina'?['cana']:['milho','soja','trigo'],bon=kind==='usina'?1.12:1.08,nm=kind==='usina'?'🏭 Usina Santa Cruz':'🌾 Cooperativa Agro';
 const rows=ks.map(k=>{const n=S.inv[k]||0,p=Math.round(itemPrice(k)*bon*100)/100;return '<div class="card"><div class="row"><b>'+CROPS[k].ic+' '+CROPS[k].n+' ×'+n+'</b><span class="gold">'+R$(p)+' un.</span></div>'+(n?'<div class="btns"><button class="b gold" data-act="vcoop" data-v="'+kind+':'+k+'">Vender tudo ('+R$(Math.round(n*p))+')</button></div>':'<div class="dim">Você não tem '+CROPS[k].n.toLowerCase()+' no estoque.</div>')+'</div>'}).join('');
 showModal('<h3>'+nm+'</h3><div class="dim">'+(kind==='usina'?'A usina paga 12% acima do mercado pela cana-de-açúcar.':'A cooperativa paga 8% acima do mercado pelos grãos.')+'</div>'+rows+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
ACT.vcoop=function(e){const[kind,k]=e.v.split(':'),n=S.inv[k]||0;if(!n)return;const bon=kind==='usina'?1.12:1.08,v=Math.round(n*itemPrice(k)*bon);S.inv[k]=0;cash(v,(kind==='usina'?'Usina':'Cooperativa')+': '+CROPS[k].n);gainXP(Math.min(40,n*CROPS[k].xp*.05),'venda');toast('💰 Vendeu '+n+' '+CROPS[k].n.toLowerCase()+' por '+R$(v),'good');vendeModal(kind)};
function pesqModal(){showModal('<h3>🎣 Pesqueiro do Pantanal</h3><div class="card">Ranchos de pescador, barcos de alumínio e um píer comprido entrando na lagoa grande. Dizem que aqui sai pintado de mais de 20 kg.</div><div class="dim">Ande até a ponta do píer ou a beira da lagoa e use 🎣 Pescar.</div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
const _ilD=interactList;
interactList=function(){const L=_ilD();if(inRoom())return L;const near=(x,y)=>Math.abs(x-P.x)<70&&Math.abs(y-P.y)<70;
 const A=(x,y,l,fn)=>{if(near(x,y))L.push({x,y,r:24,label:l,fn})};
 A(74*TS+8,140*TS+6,'🍔 Lanchonete do posto',lancheModal);A(62*TS+16,142*TS+6,'🛞 Borracharia',borrModal);
 A(90*TS,140*TS+6,'⛪ Capelinha de São Benedito',capelaModal);A(95*TS+8,143*TS+4,'🪦 Ler as lápides do cemitério velho',tumuloModal);
 A(85*TS+8,157*TS+8,S.ruinT?'🕳️ Poço velho (vazio)':'🕳️ Puxar a corda do poço velho',pocoAct);A(86*TS+8,146*TS,'🏚️ Fazenda Esperança (abandonada)',()=>showModal('<h3>🏚️ Fazenda Esperança</h3><div class="card"><i>Casarão de 1920 em ruínas. O telhado caiu, sobrou o madeiramento do paiol e um poço de pedra. Dizem que à noite aparece uma luz andando entre as paredes.</i></div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>'));
 A(70*TS+8,83*TS+8,'🌾 Cooperativa: vender grãos',()=>vendeModal('coop'));A(77*TS,82*TS+8,'🏭 Usina Santa Cruz: vender cana',()=>vendeModal('usina'));
 A(207*TS,144*TS+6,'🎣 Rancho do Pesqueiro',pesqModal);
 for(const s of SIGNS){const x=s.x*TS+8,y=s.y*TS+14;if(near(x,y))L.push({x,y,r:20,label:'🪧 Placa: '+s.L.map(l=>l[1]).join(' · '),fn:()=>toast('🪧 '+s.L.map(l=>l[1]+' '+Math.max(1,Math.round(Math.hypot(l[2]-s.x,l[3]-s.y)*.05))+' km').join(' · '))})}
 return L};
// no mapa da região
const _mpoiD=MAPPOI;
if(typeof mapModal==='function'){const _mmD=mapModal;mapModal=function(){_mmD();const cv=document.getElementById('wmapc');if(!cv)return;const g=cv.getContext('2d'),s=4;g.textAlign='center';g.font='bold 13px monospace';
 for(const p of[['POSTO',69,134],['CAPELA',90,135],['RUINAS',86,147],['USINA',77,76],['COOPERATIVA',66,76],['PESQUEIRO',217,143]]){g.lineWidth=4;g.strokeStyle='rgba(0,0,0,.85)';g.strokeText(p[0],p[1]*s,p[2]*s);g.fillStyle='#9ad8ff';g.fillText(p[0],p[1]*s,p[2]*s)}}}
if(typeof GUIDE!=='undefined')GUIDE.push({lv:2,ic:'🛣️',t:'Lugares da região',h:'Na Rodovia Sul tem o Posto Rodovia (lanchonete e borracharia), a Capelinha de São Benedito e o Cemitério Velho. Perto do canavial ficam a Cooperativa (paga 8% a mais pelos grãos) e a Usina Santa Cruz (12% a mais pela cana). No sudeste do pantanal, o Pesqueiro. E dizem que a Fazenda Esperança, abandonada, guarda um segredo...'});
