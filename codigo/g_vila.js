// ===== VILA NOVA (mudou para o leste, encostada no Bairro Novo) + MATA no lugar da vila antiga + vida natural no mapa =====
// A vila ficou longe da sede: ruas tortas, praça da matriz com coreto, bar, jardins, árvores, moradores andando e conversando,
// cachorros de rua, galinhas, cavalo amarrado no bar e feira de sábado. No lugar antigo nasceu uma mata fechada com um córrego e ponte.
const VDB=(g,c,x,y,w,h)=>Rr(g,c,x,y,w,h);
const VBAR={x:137,y:42,w:5,h:4,door:139};
const VLAKE={cx:143.5,cy:73.3,rx:3.4,ry:2.3};
const CREEK=y=>70+2.4*Math.sin(y/6.5)+1.2*Math.sin(y/2.9);
let VTREES=[],VBENCH=[],VLAMP=[],VBEDS=[],BRIDGE=[];
function vilaCarve(){
 const st=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=ti(x,y);if(G[i]!==2)G[i]=3}};
 const clr=(x0,y0,x1,y1)=>{for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=x0&&tx<=x1&&ty>=y0&&ty<=y1){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
  for(let i=BUSH.length-1;i>=0;i--){const t=BUSH[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=x0&&tx<=x1&&ty>=y0&&ty<=y1)BUSH.splice(i,1)}
  if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--){const t=DECO[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=x0&&tx<=x1&&ty>=y0&&ty<=y1){if(!BLD.some(b=>tx>=b.x&&tx<b.x+b.w&&ty>=b.y&&ty<b.y+b.h))SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}};
 // ---- ruas da vila (nada de grade: becos, calçada e uma rua de baixo torta)
 clr(98,38,147,76);
 st(98,45,143,46);st(108,49,109,66);st(132,49,133,66);st(111,54,131,60);
 for(let x=98;x<=146;x++){const y=66+(x>124&&x<132?0:0);st(x,y,x,y)}
 st(137,67,138,84);st(98,49,99,51);
 for(const b of BLD){if(!TOWNZ(b.x,b.y))continue;const by=b.y+b.h;for(let y=by;y<=Math.min(by+2,76);y++){const i=ti(b.door,y);if(G[i]!==2&&!SOL[i])G[i]=3}}
 st(VBAR.door,VBAR.y+VBAR.h,VBAR.door,VBAR.y+VBAR.h);
 for(let y=VBAR.y;y<VBAR.y+VBAR.h;y++)for(let x=VBAR.x;x<VBAR.x+VBAR.w;x++)SOL[ti(x,y)]=1;
 // ---- lagoa da vila (do lado da Casa do Pescador)
 for(let y=69;y<=77;y++)for(let x=138;x<=148;x++){if(((x-VLAKE.cx)/VLAKE.rx)**2+((y-VLAKE.cy)/VLAKE.ry)**2<1){G[ti(x,y)]=2;SOL[ti(x,y)]=0}}
 // ---- árvores da vila: mangueiras, ipês e palmeiras em lugares escolhidos
 VTREES=[[112,55,1],[130,55,5],[112,60,0],[130,60,1],[116,60,4],[126,60,4],[100,49,0],[127,49,5],[106,57,1],[105,63,5],[118,66+0,0],[134,63,1],[146,64,4],[146,47,0],[142,50,5],[98,57,1],[144,57,0],[110,45,4]];
 for(const [x,y,k] of VTREES){const i=ti(x,y);if(SOL[i]||G[i]===2)continue;if(G[i]===3&&!(x>=111&&x<=131&&y>=54&&y<=60))continue;TREES.push({x:x*TS+8,y:y*TS+15,k,s:1.05+hs(x,y)*.3});SOL[i]=1}
 // bancos e postes de luz
 VBENCH=[[114,56],[127,56],[114,59],[127,59],[121,59.6]];VLAMP=[];for(let x=100;x<=142;x+=6){if(!SOL[ti(x,46)])VLAMP.push([x,46]);if(!SOL[ti(x+3,49)]&&G[ti(x+3,49)]!==2)VLAMP.push([x+3,49])}
 for(const[x,y]of VLAMP)SOL[ti(x,Math.floor(y))]=1;
 VBEDS=[[111,54,3,1],[129,54,3,1],[111,60,2,1],[130,60,2,1],[118,57,2,1],[123,57,2,1]];
 // ---- mata no lugar da vila antiga: córrego que desce do lago até um brejo, com ponte na estrada
 BRIDGE=[];
 for(let y=18;y<=72;y++){const c=CREEK(y),x0=Math.round(c-.9),x1=Math.round(c+.9);clr(x0-1,y,x1+1,y);for(let x=x0;x<=x1;x++){const i=ti(x,y);if(G[i]===3){if(y===47||y===48)BRIDGE.push([x,y]);continue}G[i]=2;SOL[i]=0;FEN[i]=0}}
 for(let y=70;y<=76;y++)for(let x=65;x<=76;x++){if(((x-70)/3.6)**2+((y-73.4)/2.2)**2<1){G[ti(x,y)]=2;SOL[ti(x,y)]=0}}
 clr(64,69,77,77);
 // placas e entrada da vila sem árvore na frente
 clr(92,41,100,46);if(typeof SIGNS!=='undefined')for(const q of SIGNS)clr(q.x-3,q.y-3,q.x+3,q.y+1);
 // fazenda mais natural: quebra-vento de árvores na divisa sul e oeste, bosque em volta do açude e árvores de sombra soltas no pasto
 const plant=(x,y,k)=>{const i=ti(x,y);if(SOL[i]||FEN[i]||G[i]===2||G[i]===3)return;for(const b of BLD)if(x>=b.x-1&&x<=b.x+b.w&&y>=b.y-1&&y<=b.y+b.h+1)return;TREES.push({x:x*TS+8+(hs(x,y)-.5)*6,y:y*TS+15,k,s:.9+hs(y,x)*.45});SOL[i]=1};
 for(let x=3;x<=56;x++){if(hs(x,129)<.55)plant(x,129,hs(x,7)<.5?0:1);if(hs(x,127)<.25)plant(x,127,1)}
 for(let y=73;y<=128;y++){if(hs(2,y)<.55)plant(2,y,hs(y,2)<.5?0:1);if(hs(4,y)<.2)plant(4,y,1)}
 for(let k=0;k<26;k++){const a=k/26*6.283,r=10+hs(k,5)*2.5,x=Math.round(21+Math.cos(a)*r),y=Math.round(96+Math.sin(a)*r*.62);if(hs(k,9)<.7)plant(x,y,hs(k,3)<.4?5:1)}
 for(const[x,y]of[[18,78],[40,80],[50,92],[12,112],[36,116],[52,122],[27,124],[48,104]])plant(x,y,hs(x,y)<.5?5:1);
 TREES.sort((a,b)=>a.y-b.y);
}
const _rfcVila=rfCarve;rfCarve=function(){_rfcVila();vilaCarve()};
// ---------- chão: praça de pedra portuguesa, canteiros, ponte, flores do campo, pátio da igreja
function vilaGround(g){
 // pedra portuguesa na praça (ondas)
 for(let y=54*TS;y<61*TS;y+=2)for(let x=111*TS;x<132*TS;x+=2){const w=Math.sin(x*.16+2.4*Math.sin(y*.085));VDB(g,w>.78?'#4a4a48':(hs(x,y)<.08?'#d8d2c6':'#ece8e0'),x,y,2,2)}
 for(let x=111*TS;x<132*TS;x+=2){VDB(g,'#b8b0a2',x,54*TS,2,1);VDB(g,'#b8b0a2',x,61*TS-1,2,1)}
 for(const[x,y,w,h]of VBEDS){VDB(g,'#6a4a2a',x*TS+1,y*TS+2,w*TS-2,h*TS-3);for(let i=0;i<w*6;i++){const px=x*TS+3+hs(i,x)*(w*TS-6),py=y*TS+4+hs(x,i)*(h*TS-8);VDB(g,'#3f7a32',px,py,3,3);VDB(g,['#e84a5a','#f0e060','#f4f4f4','#d86ab0'][i%4],px+1,py,1.4,1.4)}}
 // ponte de tábuas na estrada da mata
 for(const[x,y]of BRIDGE){const bx=x*TS,by=y*TS;VDB(g,'#8a6038',bx,by,TS,TS);for(let k=0;k<TS;k+=4){VDB(g,'#6a4428',bx+k,by,1,TS);VDB(g,'#a87a4a',bx+k+1,by,.6,TS)}}
 // flores do campo: manchas naturais na mata, nas clareiras e na beira das estradas
 for(let k=0;k<160;k++){const cx=hs(k,991)*MW,cy=hs(992,k)*(RZ-4),tx=Math.floor(cx),ty=Math.floor(cy),t=G[ti(tx,ty)];if(!(t===0||t===1||t===4))continue;if(TOWNZ(tx,ty))continue;const col=['#f0e060','#e87ab0','#a88ae0','#f4f4f4','#f08a3a'][k%5],r=14+hs(k,k)*26;
  for(let i=0;i<26;i++){const a=hs(i,k)*6.28,d=Math.sqrt(hs(k,i))*r,px=cx*TS+Math.cos(a)*d,py=cy*TS+Math.sin(a)*d*.6,ttx=Math.floor(px/TS),tty=Math.floor(py/TS);const tt=G[ti(ttx,tty)];if(tt===2||tt===3||SOL[ti(ttx,tty)])continue;VDB(g,'#2f6a28',px,py+1,1,2);VDB(g,col,px,py,1.6,1.6)}}
}
const _prVila=prerender;prerender=function(){if(PRDEF)return _prVila();_prVila();if(!GC)return;const g=GC.getContext('2d'),ps0=PS;PS=1;try{vilaGround(g)}catch(e){console.warn(e)}finally{PS=ps0}};
// ---------- objetos da vila
function drawBar(g){const x=VBAR.x*TS,y=VBAR.y*TS,w=VBAR.w*TS,h=VBAR.h*TS,by=y+h,n=dayHour()>=18||dayHour()<2;VDB(g,'rgba(0,0,0,.22)',x+3,by-1,w,5);
 VDB(g,'#e8c878',x,y+16,w,h-16);for(let i=0;i<w;i+=5)VDB(g,'#d8b868',x+i,y+16,1,h-16);
 for(let r=0;r<14;r+=2)VDB(g,r<2?'#c86a3a':'#a8502a',x-3+r*.2,y+2+r,w+6-r*.4,2);
 VDB(g,'#5a3a22',x+4,by-24,18,24);VDB(g,n?'#f8e08a':'#3a2a1a',x+6,by-22,14,12);VDB(g,'#1a2a3a',x+w-26,y+22,18,12);VDB(g,n?'#f8d070':'#7ab0d0',x+w-25,y+23,16,10);
 VDB(g,'#2a6a3a',x+2,y+8,w-4,9);ptext(g,'BAR DO TONHAO',x+w/2-ptw('BAR DO TONHAO')/2,y+10,'#ffe9a8');
 for(let i=0;i<w;i+=8)VDB(g,i%16?'#c83a2a':'#f4f4f0',x+i,by-34,8,4);VDB(g,'#5a3a22',x-1,by-34,2,34);VDB(g,'#5a3a22',x+w-1,by-34,2,34);
 // mesinha e cadeiras na calçada
 const tx=x+w-10,ty=by+14;VDB(g,'rgba(0,0,0,.2)',tx-8,ty-1,16,2);VDB(g,'#c8302a',tx-6,ty-10,12,2);VDB(g,'#9a2a1a',tx-1,ty-8,2,8);VDB(g,'#c8302a',tx-11,ty-6,4,6);VDB(g,'#c8302a',tx+7,ty-6,4,6);VDB(g,'#f0e060',tx-2,ty-13,3,3);VDB(g,'#8a5a2a',tx+2,ty-12,2,2)}
function drawHitch(g){const x=(VBAR.x-2)*TS,y=(VBAR.y+VBAR.h)*TS+14;VDB(g,'#5a3a22',x-12,y-10,26,2);VDB(g,'#4a2e18',x-12,y-10,2,10);VDB(g,'#4a2e18',x+12,y-10,2,10);OL(g,x,y+3,44,40,c=>drawHorseS(c,x+2,y+2,2,'crioulo',{saddle:1}))}
function drawCoreto(g){const cx=124*TS+8,by=57*TS+12;VDB(g,'rgba(0,0,0,.22)',cx-22,by-2,44,5);VDB(g,'#e8e4dc',cx-20,by-6,40,6);VDB(g,'#c8c4bc',cx-20,by-1,40,1.4);
 for(const o of[-18,-9,0,9,16])VDB(g,'#f4f0e8',cx+o,by-26,2.4,20);VDB(g,'#d8d4cc',cx-20,by-12,40,1.4);for(let i=-18;i<18;i+=3)VDB(g,'#f4f0e8',cx+i,by-12,1,6);
 for(let r=0;r<12;r+=2)VDB(g,r%4?'#3a7a5a':'#2a6a4a',cx-22+r,by-38+r,44-r*2,2);VDB(g,'#f0c040',cx-1,by-42,2,4);VDB(g,'#2a6a4a',cx-22,by-28,44,2)}
function drawVBench(g,x,y){const X=x*TS+8,Y=y*TS+14;VDB(g,'rgba(0,0,0,.2)',X-9,Y-1,18,2);VDB(g,'#7a5232',X-9,Y-7,18,2.4);VDB(g,'#5a3a22',X-9,Y-11,18,2);VDB(g,'#3a3a3a',X-8,Y-5,1.6,5);VDB(g,'#3a3a3a',X+6,Y-5,1.6,5)}
function drawVLamp(g,x,y){const X=x*TS+8,Y=y*TS+14,n=dayHour()>=18||dayHour()<5.5;VDB(g,'rgba(0,0,0,.2)',X-3,Y-1,6,2);VDB(g,'#2a2a2a',X-1,Y-30,2,30);VDB(g,'#2a2a2a',X-3,Y-2,6,2);VDB(g,'#2a2a2a',X-4,Y-34,8,4);VDB(g,n?'#fff2a0':'#c8c8b0',X-3,Y-33,6,2);if(n)VDB(g,'rgba(255,240,160,.12)',X-14,Y-38,28,16)}
function drawWelcome(g){const x=95*TS,y=45*TS+14;VDB(g,'rgba(0,0,0,.25)',x-4,y-1,70,3);for(const o of[0,60])VDB(g,'#4a2e18',x+o,y-30,4,30);VDB(g,'#1e140c',x-4,y-46,72,18);VDB(g,'#6a4428',x-3,y-45,70,16);VDB(g,'#8a6038',x-3,y-45,70,1.4);
 ptext(g,'BEM-VINDO',x+31-ptw('BEM-VINDO')/2,y-43,'#ffe9a8','#1e140c');ptext(g,'A VILA',x+31-ptw('A VILA')/2,y-36,'#ffffff','#1e140c');for(let i=0;i<5;i++)VDB(g,['#e84a5a','#f0e060','#d86ab0','#f4f4f4','#f08a3a'][i],x+6+i*12,y-3,4,3)}
function drawVaralV(g,x,y){const X=x*TS,Y=y*TS+14;VDB(g,'#5a3a22',X,Y-16,1.4,16);VDB(g,'#5a3a22',X+28,Y-16,1.4,16);VDB(g,'#ddd',X,Y-15,29,.6);const sw=Math.sin(frame/20)*.6;[['#e84a5a',3],['#3a7ac8',9],['#f4f4f0',15],['#f0c040',21]].forEach(([c,o])=>{VDB(g,c,X+o+sw,Y-14,5,6);VDB(g,shade(c,-20),X+o+sw,Y-9,5,1)})}
function drawBridgeRail(g,side){if(!BRIDGE.length)return;const xs=BRIDGE.map(b=>b[0]),x0=Math.min(...xs)*TS-4,x1=(Math.max(...xs)+1)*TS+4,y=side?49*TS+2:47*TS-2;VDB(g,'#5a3a22',x0,y-8,x1-x0,2);for(let x=x0;x<=x1;x+=8)VDB(g,'#4a2e18',x,y-10,2,10)}
// ---------- moradores: andam pelas ruas, param, conversam; crianças correm; feira de sábado
const VNODES=[[100,46.3],[106,46.3],[112,46.3],[118,46.3],[126,46.3],[134,46.3],[141,46.3],[108.6,52],[108.6,58],[108.6,64],[132.6,52],[132.6,58],[132.6,64],[113,55],[118,56.5],[122,58.5],[128,55.5],[129,59],[115,59],[102,66.4],[110,66.4],[118,66.4],[126,66.4],[134,66.4],[142,66.4],[137.6,72],[137.6,79]];
const VSHIRT=['#c83a2a','#3a6ab0','#5a8a3a','#e0a431','#8a4ac8','#f4f0e8','#d86a8a','#3a3a3a','#7a5a2a','#2a8a8a'];
const VPPL=[];
(function(){for(let i=0;i<14;i++){const n=VNODES[i%VNODES.length],kid=i%5===4,f=i%3===1;VPPL.push({x:n[0]*TS,y:n[1]*TS,tx:null,ty:null,wait:rnd(0,4),dir:0,ph:0,mv:0,kid,o:{shirt:VSHIRT[i%VSHIRT.length],hair:['#2a1a10','#5a3a22','#d8d8d8','#1a1a1a','#8a5a2a'][i%5],hat:i%4===0?'#d8c080':i%4===2?'#6a4a2a':null,pants:['#33384a','#4a3a2a','#2a4a6a','#6a2a3a'][i%4],g:f?'f':null,skin:['#e8b890','#c88a60','#a86a40','#f0c8a0'][i%4]},chat:0,day:i<10})}})();
const VDOGS=[{x:120*TS,y:62*TS,c:'#b8864e',dir:1,wait:2,tx:null,ty:null,ph:0,mv:0,pose:'stand'},{x:104*TS,y:57*TS,c:'#3a2a1a',dir:-1,wait:5,tx:null,ty:null,ph:0,mv:0,pose:'lie'}];
const VCHK=[];(function(){for(let i=0;i<5;i++)VCHK.push({x:(103+hs(i,4)*4)*TS,y:(64.5+hs(4,i)*1.2)*TS,dir:i%2?1:-1,wait:rnd(0,3),tx:0,ty:0})})();
const feiraOn=()=>S.day%7===6&&dayHour()>=6&&dayHour()<13;
const VLINES=['Bom dia! Já foi na feira de sábado aqui na praça?','O Bar do Tonhão tem a cerveja mais gelada da região.','Dizem que tem tesouro escondido na Fazenda Esperança...','A chuva tá demorando, o pasto lá da serra tá secando.','Meu neto quer ser peão de rodeio. Eu fico de cabelo em pé!','O padre falou que domingo tem missa com festa.','O córrego da mata tem lambari que é uma beleza.','Cuidado com onça perto do pasto, viu?','O preço do boi subiu essa semana, ouvi no leilão.','Vai ter festa no Parque de Exposições, não perca!'];
function stepVila(dt){if(inRoom())return;if(Math.abs(P.x-122*TS)>VW+700||Math.abs(P.y-58*TS)>VH+700)return;const h=dayHour(),night=h>=21||h<6;
 for(const p of VPPL){p.hid=night&&p.day||(p.kid&&(h>=19||h<7));if(p.hid)continue;p.chat=Math.max(0,p.chat-dt);
  if(p.wait>0){p.wait-=dt;p.mv=0;continue}
  if(p.tx===null){let n=pick(VNODES);if(feiraOn()&&Math.random()<.5)n=[112+Math.random()*18,59.4];p.tx=(n[0]+rnd(-.6,.6))*TS;p.ty=(n[1]+rnd(-.3,.3))*TS}
  const dx=p.tx-p.x,dy=p.ty-p.y,d=Math.hypot(dx,dy);
  if(d<2){p.tx=null;p.wait=rnd(2,9);p.mv=0;for(const q of VPPL)if(q!==p&&!q.hid&&q.mv===0&&Math.hypot(q.x-p.x,q.y-p.y)<22&&Math.random()<.5){p.chat=q.chat=rnd(3,6);p.dir=q.x>p.x?3:2;q.dir=q.x>p.x?2:3;p.wait=q.wait=Math.max(p.wait,4);break}continue}
  const sp=p.kid?26:13;const s=Math.min(d,sp*dt);let ax=dx/d,ay=dy/d;
  // anda pelas ruas: primeiro no eixo de maior diferença
  if(Math.abs(dx)>4&&Math.abs(dy)>4){if(Math.abs(dy)<Math.abs(dx)){ay=Math.sign(dy);ax=0}else{ax=Math.sign(dx);ay=0}}
  const nx=p.x+ax*s,ny=p.y+ay*s;if(!solidAt(nx,ny-2)){p.x=nx;p.y=ny}else{p.tx=null;p.wait=1}
  p.mv=1;p.ph+=dt*(p.kid?3.4:2.2);p.dir=Math.abs(ax)>Math.abs(ay)?(ax>0?3:2):(ay>0?0:1)}
 for(const d of VDOGS){if(d.wait>0){d.wait-=dt;d.mv=0;continue}if(d.tx===null){const n=pick(VNODES);d.tx=n[0]*TS+rnd(-10,10);d.ty=n[1]*TS+rnd(-4,4)}const dx=d.tx-d.x,dy=d.ty-d.y,dd=Math.hypot(dx,dy);if(dd<2){d.tx=null;d.wait=rnd(4,14);d.pose=pick(['sit','lie','stand','sniff']);d.mv=0;continue}const s=Math.min(dd,18*dt);d.x+=dx/dd*s;d.y+=dy/dd*s;d.mv=1;d.pose='walk';d.ph+=s*1.4;if(Math.abs(dx)>1.5)d.dir=dx>0?1:-1}
 for(const c of VCHK){if(c.wait>0){c.wait-=dt;continue}if(!c.tx){c.tx=(102.5+Math.random()*5)*TS;c.ty=(64.4+Math.random()*1.3)*TS}const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy);if(d<1){c.tx=0;c.wait=rnd(1,4);continue}c.x+=dx/d*6*dt;c.y+=dy/d*6*dt;c.dir=dx>0?1:-1}
}
function drawVPerson(g,p){OL(g,p.x,p.y+3,30,42,c=>{if(p.kid){c.save();c.translate(p.x,p.y);c.scale(.78,.78);c.translate(-p.x,-p.y)}drawPerson(c,Object.assign({x:p.x,y:p.y,dir:p.dir,ph:p.ph,mv:p.mv},p.o));if(p.kid)c.restore()});
 if(p.chat>0&&RMODE!==4&&((frame>>4)&3)){const y=p.y-(p.kid?24:31);VDB(g,'#1e140c',p.x+3,y,9,6);VDB(g,'#fff',p.x+3.5,y+.5,8,5);for(let i=0;i<3;i++)VDB(g,'#888',p.x+5+i*2,y+2.5,1,1)}}
function drawFeira(g,i){const x=(112+i*5)*TS,y=59*TS+14,cols=['#d83a2a','#3a7ac8','#e0a431','#3a9a4a'],c=cols[i%4];VDB(g,'rgba(0,0,0,.2)',x-2,y-1,36,3);for(const o of[0,30])VDB(g,'#5a3a22',x+o,y-24,2,24);
 for(let k=0;k<34;k+=4)VDB(g,(k/4)%2?c:'#f4f4f0',x-1+k,y-28,4,6);VDB(g,'#8a6038',x,y-12,32,4);
 const fr=[['#e84a2a','#f0c040','#5aa83a'],['#e8d060','#a84a2a','#6a8a3a'],['#f08a3a','#e84a5a','#c8a040'],['#5aa83a','#d8402a','#e8e060']][i%4];for(let k=0;k<7;k++)VDB(g,fr[k%3],x+2+k*4,y-15,3,3);
 OL(g,x+16,y-2,30,42,q=>drawPerson(q,{x:x+16,y:y-2,dir:0,ph:0,mv:0,shirt:VSHIRT[(i*3)%10],hair:'#2a1a10',hat:i%2?'#d8c080':null,pants:'#33384a',g:i%2?null:'f'}))}
// ---------- itens com profundidade
const _evoVila=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoVila(L,x0,x1,y0,y1);if(inRoom())return;
 const add=(x,y,fn,m)=>{if(x>x0-(m||80)&&x<x1+(m||80)&&y>y0-30&&y<y1+110)L.push([y,10,{draw:fn}])};
 add(VBAR.x*TS+40,(VBAR.y+VBAR.h)*TS,drawBar,100);add((VBAR.x-2)*TS,(VBAR.y+VBAR.h)*TS+14,drawHitch,60);add(124*TS+8,57*TS+12,drawCoreto,80);
 for(const[x,y]of VBENCH)add(x*TS+8,y*TS+14,g=>drawVBench(g,x,y));for(const[x,y]of VLAMP)add(x*TS+8,y*TS+14,g=>drawVLamp(g,x,y));
 add(95*TS+30,45*TS+14,drawWelcome,120);add(118*TS,64*TS+14,g=>drawVaralV(g,118,64.2),60);add(101*TS,66*TS-2,g=>drawVaralV(g,103,58.2),60);
 if(BRIDGE.length){add(BRIDGE[0][0]*TS,47*TS-2,g=>drawBridgeRail(g,0),80);add(BRIDGE[0][0]*TS,49*TS+2,g=>drawBridgeRail(g,1),80)}
 if(feiraOn())for(let i=0;i<4;i++)add((112+i*5)*TS+16,59*TS+14,g=>drawFeira(g,i),80);
 for(const p of VPPL)if(!p.hid)add(p.x,p.y,g=>drawVPerson(g,p),40);
 for(const d of VDOGS)add(d.x,d.y,g=>OL(g,d.x,d.y+4,48,36,c=>drawDogSprite(c,d.x,d.y,d.dir,Object.assign({},DOGS.vira.v,{c:d.c,bl:shade(d.c,30)}),d.pose,d.ph,{wag:d.pose==='stand'?1:0})),40);
 for(const c of VCHK)add(c.x,c.y,g=>drawChicken(g,c),30);
};
const _updVila=update;update=function(dt){_updVila(dt);stepVila(dt)};
// conversa com morador
const _ilVila=interactList;interactList=function(){const L=_ilVila();if(inRoom())return L;for(const p of VPPL){if(p.hid||Math.abs(p.x-P.x)>40||Math.abs(p.y-P.y)>40)continue;L.push({x:p.x,y:p.y,r:20,label:'💬 Conversar com morador',fn:()=>{p.chat=4;p.wait=Math.max(p.wait,4);p.dir=P.x>p.x?3:2;toast('💬 “'+pick(VLINES)+'”')}})}
 if(Math.abs(P.x-(VBAR.door*TS+8))<40&&Math.abs(P.y-(VBAR.y+VBAR.h)*TS)<40)L.push({x:VBAR.door*TS+8,y:(VBAR.y+VBAR.h)*TS+6,r:24,label:'🍺 Bar do Tonhão',fn:barModal});return L};
function barModal(){showModal('<h3>🍺 Bar do Tonhão</h3><div class="dim">Sinuca, viola no fim de semana e a fofoca da região.</div><div class="card"><div class="row"><b>🥤 Guaraná gelado</b><span class="gold">'+R$(6)+'</span></div><div class="dim">+8 de vida</div><div class="btns"><button class="b gold" data-act="vbar" data-v="g">Pedir</button></div></div><div class="card"><div class="row"><b>🍢 Porção de torresmo</b><span class="gold">'+R$(22)+'</span></div><div class="dim">+25 de vida</div><div class="btns"><button class="b gold" data-act="vbar" data-v="t">Pedir</button></div></div><div class="card"><div class="row"><b>👂 Ouvir a prosa do balcão</b><span class="dim">grátis</span></div><div class="btns"><button class="b" data-act="vbar" data-v="p">Escutar</button></div></div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
ACT.vbar=function(e){if(e.v==='p'){toast('👂 “'+pick(VLINES)+'”');return}const c=e.v==='g'?[6,8]:[22,25];if(S.money<c[0])return toast('Dinheiro insuficiente','bad');cash(-c[0],'Bar do Tonhão');P.hp=Math.min(100,P.hp+c[1]);toast('😋 +'+c[1]+' de vida','good')};
// ---------- bichos: não entram na vila; os da mata não entram na fazenda
const _wmVila=wmove;wmove=function(a,vx,vy,dt){const nx=Math.floor((a.x+vx*dt)/TS),ny=Math.floor((a.y+vy*dt)/TS);if(TOWNZ(nx,ny)&&!TOWNZ(Math.floor(a.x/TS),Math.floor(a.y/TS)))return 0;
 if(nx<59&&ny>=35&&ny<=131&&!(Math.floor(a.x/TS)<59&&Math.floor(a.y/TS)>=35)&&!a.pest)return 0;return _wmVila(a,vx,vy,dt)};
// ---------- natureza viva: vagalumes à noite e bandos de pássaros de dia
const FLOCK={on:0,x:0,y:0,vx:0,vy:0,n:0,t:0};let flT=8;
const _dpVila=drawPart;drawPart=function(g){_dpVila(g);if(inRoom())return;const h=dayHour(),tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS),b=bioAt(tx,ty);
 if((h>=19||h<4.5)&&(b===1||b===0||b===6)&&!TOWNZ(tx,ty)){for(let i=0;i<16;i++){const ph=frame/50+i*1.7,fx=CX+((hs(i,3)*VW+Math.sin(ph)*24+frame*.05*(i%3-1))%VW+VW)%VW,fy=CY+(hs(3,i)*VH+Math.cos(ph*1.3)*14),a=.5+.5*Math.sin(frame/12+i*2);if(a<.3)continue;VDB(g,'rgba(220,255,120,'+(a*.9).toFixed(2)+')',fx,fy,1.4,1.4);VDB(g,'rgba(220,255,120,'+(a*.25).toFixed(2)+')',fx-1.5,fy-1.5,4.4,4.4)}}
 if(h>6&&h<18){if(!FLOCK.on){flT-=1/60;if(flT<=0){flT=rnd(25,60);const dir=Math.random()<.5?1:-1;Object.assign(FLOCK,{on:1,x:dir>0?CX-40:CX+VW+40,y:CY+rnd(20,VH*.5),vx:dir*rnd(38,55),vy:rnd(-6,6),n:ri(5,9),t:0})}}
  else{FLOCK.t+=1/60;FLOCK.x+=FLOCK.vx/60;FLOCK.y+=FLOCK.vy/60;if(FLOCK.x<CX-80||FLOCK.x>CX+VW+80)FLOCK.on=0;
   for(let i=0;i<FLOCK.n;i++){const k=(i+1)>>1,s=i%2?1:-1,bx=FLOCK.x-Math.sign(FLOCK.vx)*k*7,by=FLOCK.y+s*k*4,w=((frame>>3)+i)&1;VDB(g,'rgba(0,0,0,.12)',bx-2,by+40,4,1.5);VDB(g,'#2a2a2a',bx-3,by-(w?1:0),3,1);VDB(g,'#2a2a2a',bx,by,1,1);VDB(g,'#2a2a2a',bx+1,by-(w?1:0),3,1)}}}
};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:1,ic:'🏘️',t:'A vila',h:'A vila fica a leste, depois da mata, encostada no Bairro Novo: siga a estrada saindo da sede. Tem praça da matriz com coreto, Bar do Tonhão, feira de sábado de manhã na praça e o Parque de Exposições no sul. Converse com os moradores.'});
