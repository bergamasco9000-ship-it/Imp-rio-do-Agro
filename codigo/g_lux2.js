// ===== Roupas de grife com detalhe de verdade no boneco: cintos, jaquetas, ternos, seda, bolsas, cachecóis, botas, óculos, chapéus e relógios
function luxBoot(R,L,x,y,w,h){const k=L.bootP;
 if(k==='cobra'){for(let j=0;j<h;j+=.7)for(let i=((j/.7)%2)*.45;i<w-.3;i+=.9){R('#c8b088',x+i,y+j,.45,.35);R('#4a3a24',x+i+.45,y+j+.35,.3,.3)}}
 else if(k==='jacare'){for(let j=0;j<h-.4;j+=.9)for(let i=((j/.9)%2)*.5;i<w-.4;i+=1){R('#2a3420',x+i,y+j,.85,.15);R('#2a3420',x+i,y+j,.15,.75);R('#5a6a48',x+i+.25,y+j+.25,.4,.3)}}
 if(L.bootShine||k){R('rgba(255,255,255,.55)',x+.4,y+.3,.6,.3);R('rgba(255,255,255,.35)',x+.3,y+h-1.2,.4,.4)}
 if(L.tallBoot)R(L.bootTip||'#c8c8d0',x+(w>2.9?2.2:1.8),y+h-.6,.8,.5)}// biqueira de metal
function luxBelt(R,L,x,wY,dir,side,dr){const k=L.beltK,bc=k==='gg'?'#141416':'#4a2a16',gd='#f0d060',gD='#a8801e',W=side?5.2:8.2,X=x-(side?2.6:4.1);
 R(bc,X,wY-.1,W,1.3);R(shade(bc,28),X,wY-.1,W,.25);R(shade(bc,-30),X,wY+1,W,.2);
 if(k==='lv'&&dir!==1){for(let i=0;i<W-.4;i+=1.05){if(!side&&Math.abs(X+i-x)<1.8)continue;R('#c8a060',X+.2+i,wY+.3,.35,.35);R('#8a6a3a',X+.65+i,wY+.55,.25,.25)}}
 if(k==='lv'&&dir===1)for(let i=0;i<W-.4;i+=1.05)R('#a8804a',X+.2+i,wY+.35,.3,.3);
 if(dir===0){
  if(k==='lv'){R(gD,x-1.75,wY-.55,3.5,2.3);R(gd,x-1.6,wY-.45,3.2,2);R('#fff8c0',x-1.5,wY-.4,1.2,.35);// fivela grande
   R(gD,x-1.25,wY-.2,.42,1.45);R(gD,x-1.25,wY+.95,1,.35);// L
   R(gD,x+.05,wY-.2,.38,1.05);R(gD,x+.95,wY-.2,.38,1.05);R(gD,x+.35,wY+.75,.7,.5)}// V
  else if(k==='gg'){const ring=(cx,flip)=>{R(gD,cx-1.15,wY-.55,2.3,2.3);R(gd,cx-1.05,wY-.45,2.1,2.1);R(bc,cx-.55,wY+.05,1.1,1.1);R(bc,cx+(flip?-1.05:.55),wY+.05,.5,.45);R(gd,cx+(flip?-.6:.1),wY+.5,.5,.3)};
   ring(x-.85,0);ring(x+.85,1);R('#fff8c0',x-1.8,wY-.4,.8,.3);R('#fff8c0',x+.2,wY-.4,.6,.3)}}
 else if(side){R(gD,x+dr*2.3-.6,wY-.55,1.2,2.3);R(gd,x+dr*2.3-.5,wY-.45,1,2.1);R('#fff8c0',x+dr*2.3-.4,wY-.4,.4,.5)}}
function luxJacket(R,L,x,sY,wY,dir,side,dr){const jc=L.jacket,jD=shade(jc,-30),jL=shade(jc,22),k=L.jk;
 if(k==='terno'){
  if(dir===0){R(jc,x-1.3,sY+3.6,2.6,4);// fecha embaixo
   R(jD,x-2.2,sY-.2,1,3.8);R(jD,x+1.2,sY-.2,1,3.8);R(jL,x-2.6,sY+.2,.5,3.2);R(jL,x+2.1,sY+.2,.5,3.2);// lapelas
   R(jD,x-1.4,sY+3.4,.4,.4);R(jD,x+1,sY+3.4,.4,.4);// entalhe das lapelas
   R(shade(jc,40),x-.2,sY+4.4,.45,.45);R(shade(jc,40),x-.2,sY+5.8,.45,.45);// botões
   R(jD,x-4,sY+5.6,2.2,.35);R(jD,x+1.8,sY+5.6,2.2,.35);R(jD,x+2.3,sY+1.8,1.6,.3);// bolsos
   R(L.psq||'#f4f4f0',x+2.5,sY+1.2,1.1,.65);R(shade(L.psq||'#f4f4f0',-25),x+2.9,sY+1.2,.3,.65);// lenço no bolso
   R(jL,x-4.5,sY,1,.4);R(jL,x+3.5,sY,1,.4)}// ombreiras
  else if(dir===1){R(jD,x-.2,sY+4.6,.4,3);R(jL,x-4.5,sY,9,.4);R(jD,x-4.5,sY+7.2,9,.4)}
  else{R(jD,x+(dr>0?.6:-1.2),sY,.6,3.6);R(jD,x+(dr>0?-1.8:1.2),sY+5.6,.6,.35);R(shade(jc,40),x+(dr>0?1.6:-2),sY+4.6,.4,.4)}}
 else if(k==='couro'){
  if(dir===0){R(jD,x-2.5,sY-.5,1.4,2.4);R(jD,x+1.1,sY-.5,1.4,2.4);R(jL,x-2.4,sY-.4,.4,1.8);R(jL,x+2,sY-.4,.4,1.8);// gola
   R('#c8ccd2',x-1.35,sY+.6,.3,6.8);R('#c8ccd2',x+1.05,sY+.6,.3,6.8);// zíperes
   R('#c8ccd2',x-4,sY+4.4,2,.25);R('#c8ccd2',x+2,sY+4.4,2,.25);R('#e8ecf0',x-2.1,sY+4.3,.4,.5);// bolsos com zíper
   R('rgba(255,255,255,.28)',x-4.1,sY+1,.45,2.6);R('rgba(255,255,255,.2)',x+3.4,sY+1.2,.4,2.2);R(jD,x-4.6,sY+6.8,3.4,.8);R(jD,x+1.2,sY+6.8,3.4,.8)}
  else if(dir===1){R(jD,x-4.5,sY+6.8,9,.8);R('rgba(255,255,255,.22)',x-3.4,sY+1,2.4,.4);R(jD,x-3,sY-.4,6,1)}
  else{R(jD,x+(dr>0?-2.6:1.2),sY-.4,1.4,1.6);R('#c8ccd2',x+(dr>0?1.6:-1.9),sY+.6,.3,6.6);R('rgba(255,255,255,.28)',x-.6,sY+1,.4,3);R(jD,x-2.6,sY+6.8,5.2,.8)}}
 else if(k==='bomber'){const rib=(yy,w0,x0)=>{R('#1f4a32',x0,yy,w0,.3);R('#b8342a',x0,yy+.3,w0,.3);R('#1f4a32',x0,yy+.6,w0,.3)};
  if(dir===0){R(jc,x-1.3,sY+1.6,2.6,6);R('#c8ccd2',x-.15,sY+1.4,.3,5.8);R('#e8ecf0',x-.3,sY+1.4,.6,.6);// fechada com zíper
   rib(sY+6.9,9,x-4.5);rib(sY-.5,4.4,x-2.2);
   R('#f0d060',x+1.9,sY+2,1.4,1);R('#1a1a1a',x+2.1,sY+2.3,1,.25);R('#f0d060',x+1.6,sY+1.7,.6,.4);R('#e8ecf0',x+3,sY+1.7,.6,.4);R('#c8302a',x+2.4,sY+3,.4,.4);// abelha bordada
   R(jD,x-4,sY+4,.35,2);R(jD,x+3.6,sY+4,.35,2);R(jL,x-4.3,sY+.6,.5,2)}
  else if(dir===1){rib(sY+6.9,9,x-4.5);rib(sY-.5,6,x-3);R('#f0d060',x-1.6,sY+2.4,3.2,1.6);R('#1a1a1a',x-1.4,sY+3,2.8,.3);R('#c8302a',x-.4,sY+2.6,.8,.4)}// abelha grande nas costas
  else{rib(sY+6.9,5.2,x-2.6);R('#c8ccd2',x+(dr>0?1.8:-2),sY+1.4,.3,5.6)}}}
function luxBag(R,L,x,sY,wY,dir,side,dr){const b=L.bag,bD=shade(b,-25),bL=shade(b,18),gd='#e0c070';
 const mono=(X,Y,w,h)=>{for(let j=.5;j<h-.4;j+=1)for(let i=.4+((j|0)%2)*.5;i<w-.4;i+=1){R(gd,X+i,Y+j,.35,.35)}};
 if(dir===0){for(let t=0;t<=1;t+=.07)R(bD,x-3.6+t*7.2,sY+.2+t*(wY-sY-.6),.7,.55);// alça atravessada
  R(b,x+2.7,wY-.6,3.4,3);R(bL,x+2.7,wY-.6,3.4,.5);mono(x+2.7,wY-.6,3.4,3);R(bD,x+2.7,wY+.8,3.4,.4);R(gd,x+4.1,wY+.7,.6,.6)}
 else if(dir===1){for(let t=0;t<=1;t+=.07)R(bD,x+3.6-t*7.2,sY+.2+t*(wY-sY-.6),.7,.55);R(b,x-6.1,wY-.6,3.4,3);mono(x-6.1,wY-.6,3.4,3)}
 else{R(bD,x-.4,sY,.7,wY-sY);const bx=x-dr*2.4-1.4;R(b,bx,wY-.8,2.8,3.2);R(bL,bx,wY-.8,2.8,.5);mono(bx,wY-.8,2.8,3.2);R(gd,bx+1.1,wY+.5,.6,.6)}}
function luxGlasses(R,L,hx,hy,side,dr){const avi=L.glassesK==='avi',fr=avi?'#d8b040':'#121214';
 if(!side){if(avi){R(fr,hx+.5,hy+2.25,5.4,.28);R('#1e2a3a',hx+.6,hy+2.5,2.2,1.5);R('#1e2a3a',hx+3.6,hy+2.5,2.2,1.5);R('#1e2a3a',hx+.9,hy+3.9,1.6,.4);R('#1e2a3a',hx+3.9,hy+3.9,1.6,.4);R('#6a8aaa',hx+.8,hy+2.6,.8,.4);R('#6a8aaa',hx+3.8,hy+2.6,.8,.4);R(fr,hx+2.8,hy+2.6,.8,.25)}
  else{R(fr,hx+.5,hy+2.2,2.5,1.9);R(fr,hx+3.4,hy+2.2,2.5,1.9);R('#0a0a0c',hx+.75,hy+2.45,2,1.4);R('#0a0a0c',hx+3.65,hy+2.45,2,1.4);R(fr,hx+2.9,hy+2.5,.6,.4);R('rgba(255,255,255,.5)',hx+.9,hy+2.5,.6,.3);R('rgba(255,255,255,.5)',hx+3.8,hy+2.5,.6,.3)}}
 else{const ex=hx;R(avi?'#1e2a3a':'#0a0a0c',ex-.5,hy+2.4,2.1,avi?1.6:1.3);R(fr,ex-.6,hy+2.2,2.3,.35);R(fr,ex+(dr>0?-2.6:1.6),hy+2.5,2.4,.3);if(avi)R('#6a8aaa',ex-.3,hy+2.6,.7,.4)}}
// ---------- liga os detalhes às peças das lojas
const LXO={
 jeansp:{pants:'jeans'},cargo:{cargoP:1},
 lvbag:{bag:'#6a4a2a'},lvjac:{jk:'couro',slv:'#5a3a22',slvHi:1,cuff:'#3a2414'},lvsc:{scarfP:'#e0c070',scarfN:'#7a5a32'},lvbelt:{beltK:'lv'},
 gusilk:{shirt:'seda',print:['#f0d060','#c8302a','#f4f4f0','#1a3a5a']},gubomb:{jk:'bomber',slv:'#1f4a32',cuff:'#b8342a'},gupant:{crease:1},gubelt:{beltK:'gg'},
 tpreto:{jk:'terno',slv:'#18181f',cuff:'#f4f4f0',crease:1,psq:'#b8242a'},tbranco:{jk:'terno',slv:'#ece6d6',cuff:'#ffffff',crease:1,psq:'#6a4a2a'},tazul:{jk:'terno',slv:'#1e2a48',cuff:'#f4f4f0',crease:1,psq:'#c8a040'},
 hcouro:{band:'#1a0e06',hatStitch:1,concho:'#c8c8d0'},hstet:{band:'#2a1a10',concho:'#f0d060'},hpana:{band:'#1a1a1a'},hpant:{band:'#c8a040'},
 bcobra:{bootP:'cobra',tallBoot:1},bjac:{bootP:'jacare',tallBoot:1,bootTip:'#d8c070'},bpreta:{bootShine:1,tallBoot:1},
 oavi:{glassesK:'avi'},owf:{glassesK:'sq'}};
for(const id in LXO)if(LUXI[id])Object.assign(LUXI[id].o,LXO[id]);
// ---------- relógio de verdade no pulso (acompanha o balanço do braço)
(function(){const W0=drawPlayerBase;drawPlayerBase=function(g){const W=S.wd,keep=W&&W.eq.watch;if(keep)W.eq.watch=null;try{W0(g)}finally{if(keep)W.eq.watch=keep}
 if(!keep||S.h.outfit!=='casual'||P.drive||RMODE===4)return;const i=LUXI[keep];if(!i)return;
 const mv=P.moving&&!P.aim,sw=mv?Math.sin(P.ph):0,bob=mv?Math.abs(Math.cos(P.ph))*(P.run?1.4:.8):0,by=P.y-bob+(P.sneak?2.5:0),sY=by-17.5,dir=P.dir,f=S.look.g==='f';
 let x,y;if(dir===0){const a2=-sw*.9;x=P.x+(f?3.9:4.3);y=sY+5.4+a2*.7}else if(dir===1){const a1=sw*.9;x=P.x-(f?5.6:6);y=sY+5.4+a1*.7}else{const dr=dir===3?1:-1;x=P.x-.8+sw*2.4*dr;y=sY+5.4}
 const c=i.c,d=shade(c,-35);Rr(g,d,x-.1,y-.1,2,1.3);Rr(g,c,x,y,1.8,1.1);if(dir!==1){Rr(g,i.id==='rsub'?'#1a2a6a':i.id==='rday'?'#f4f4f0':'#1a1a1a',x+.4,y+.15,1,.8);Rr(g,c,x+.8,y+.3,.2,.4)}
 if(i.id==='rdiam'){for(let k=0;k<4;k++)if(((frame+k*17)%60)<10)Rr(g,'#ffffff',x+(k%2)*1.4,y+(k>>1)*.9,.3,.3)}
 if(((frame+30)%140)<8){Rr(g,'#ffffff',x+.6,y-1.4,.5,3.8);Rr(g,'#ffffff',x-.8,y+.3,3.4,.5)}}})();
