// ===== Biomas detalhados: decoração, árvores nativas, água viva, pegadas, aves =====
const DECO=[],PRINTS=[];
const nearBld=(x,y)=>BLD.some(b=>x>=b.x-3&&x<=b.x+b.w+2&&y>=b.y-3&&y<=b.y+b.h+3);
const adjW=(x,y)=>G[ti(x+1,y)]===2||G[ti(x-1,y)]===2||G[ti(x,y+1)]===2||G[ti(x,y-1)]===2;
const inMountainLake=(x,y)=>x>=100&&y<=40;
const blob=(g,c,cx,cy,w,h)=>{for(let r=0;r<h;r++){const k=(r+.5-h/2)/(h/2),ww=Math.round(w*Math.sqrt(Math.max(0,1-k*k)));if(ww>0)Rr(g,c,Math.round(cx-ww/2),cy-h/2+r,ww,1)}};
const _pr=prerender;
prerender=function(){
 const ps0=PS;PS=1;_pr();const g=GC.getContext('2d');
 for(let y=YMIN+1;y<RZ-1;y++)for(let x=XMIN+1;x<MW-1;x++){
  const t=G[ti(x,y)],bx=x*TS,by=y*TS,h=hs(x*13+5,y*7+3);
  if(t===2){
   if(inMountainLake(x,y)){Rr(g,'#bcd6e4',bx,by,TS,TS);Rr(g,'#d8eaf2',bx+((h*10)|0),by+3,5,2);if(h<.4){Rr(g,'#e8f4fa',bx+2,by+((h*14)|0),9,1);Rr(g,'#e8f4fa',bx+10,by+((h*14)|0)-2,1,3)}if(h>.8)Rr(g,'#9ac0d4',bx+6,by+9,4,4)}
   if(adjW(x,y)&&(G[ti(x+1,y)]!==2||G[ti(x-1,y)]!==2||G[ti(x,y+1)]!==2||G[ti(x,y-1)]!==2)){
    const fc=inMountainLake(x,y)?'#f2f8fa':'rgba(220,240,255,.55)';
    if(G[ti(x,y-1)]!==2)Rr(g,fc,bx,by,TS,2);if(G[ti(x,y+1)]!==2)Rr(g,fc,bx,by+TS-2,TS,2);if(G[ti(x-1,y)]!==2)Rr(g,fc,bx,by,2,TS);if(G[ti(x+1,y)]!==2)Rr(g,fc,bx+TS-2,by,2,TS);
    if(!inMountainLake(x,y)&&(x>=100||x<30)&&h<.35){const lx=bx+3+((h*20)|0)%8,ly=by+4+((h*40)|0)%7;Rr(g,'#3a8a3a',lx,ly,5,3);Rr(g,'#2a6a2a',lx+2,ly+1,2,1);if(h<.15){Rr(g,'#f08ab0',lx+1,ly-1,2,2);Rr(g,'#fff',lx+1.5,ly-.5,1,1)}}
   }
   continue;
  }
  if(adjW(x,y)&&t!==3){const sc=t===5?'#e4ecf0':t===4?'#d8b878':t===6?'#5a4a2a':'#b8a070';if(G[ti(x,y-1)]===2)Rr(g,sc,bx,by,TS,3);if(G[ti(x,y+1)]===2)Rr(g,sc,bx,by+TS-3,TS,3);if(G[ti(x-1,y)]===2)Rr(g,sc,bx,by,3,TS);if(G[ti(x+1,y)]===2)Rr(g,sc,bx+TS-3,by,3,TS)}
  if(t===1){for(let i=0;i<3;i++){const hh=hs(x+i*31,y+i*17);Rr(g,['#8a5a2a','#b07a2a','#6a4a2a','#a8902a'][(hh*4)|0],bx+((hh*15)|0),by+((hs(y+i,x)*15)|0),2,1)}if(h<.12)Rr(g,'#4a3220',bx+2,by+10,7,1);if(h>.94)Rr(g,'rgba(255,240,170,.18)',bx,by,TS,TS)}
  else if(t===5){Rr(g,'#d4e2ea',bx+((h*12)|0),by+((hs(y,x)*12)|0),4,2);if(h<.08){blob(g,'#8a9098',bx+8,by+9,12,7);blob(g,'#a8b0b8',bx+7,by+8,7,3);blob(g,'#f4f8fa',bx+8,by+6,9,2)}if(h>.9)Rr(g,'#fff',bx+((h*99)|0)%14,by+((h*77)|0)%14,1,1)}
  else if(t===6){if(h<.04){blob(g,'#3e3424',bx+8,by+8,14,9);blob(g,'#4a4030',bx+9,by+7,9,5);if(h<.02)blob(g,'#4a6a7a',bx+7,by+9,6,3)}else if(h<.3)Rr(g,'#5a7a3a',bx+((h*40)|0)%12,by+((h*70)|0)%12,3,1);if(h>.85)Rr(g,'#7a9a4a',bx+4,by+4,1,6)}
  else if(t===4){if(h<.07){blob(g,'#c07048',bx+8+((h*30)|0)%4,by+8,10+((h*300)|0)%9,6+((h*700)|0)%6);blob(g,'#b0603a',bx+7,by+8,8,5)}for(let i=0;i<2;i++){const hh=hs(x+i*9,y+i*5);Rr(g,'#c8a04a',bx+((hh*14)|0),by+((hs(y+i,x+3)*14)|0),1,3)}}
 }
 PS=ps0;
};
const _gw=genWorld;
genWorld=function(){
 _gw();
 for(const t of TREES){const tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS),h=hs(tx+11,ty+5);
  if(tx>=100&&ty>40)t.k=h<.6?4:h<.75?6:t.k;
  else if(ty>=71&&tx<100&&!FARMZ(tx,ty))t.k=h<.2?3:h<.6?5:7;
  else if(FARMZ(tx,ty))t.k=h<.25?5:t.k;
  else if(ty<35&&tx<100&&h<.05)t.k=6;
  else if(tx>=100&&ty<=40&&h<.07)t.k=6;
 }
 DECO.length=0;
 for(let y=YMIN+2;y<MH-2;y++)for(let x=XMIN+2;x<MW-2;x++){
  const i=ti(x,y),t=G[i];if(SOL[i]||FEN[i]||t===3||t===2||nearBld(x,y))continue;
  if(G[ti(x,y+1)]===3||G[ti(x,y-1)]===3||G[ti(x+1,y)]===3||G[ti(x-1,y)]===3)continue;
  const h=hs(x*3+7,y*5+1),px=x*TS+4+hs(x,y+21)*8,py=y*TS+8+hs(x+21,y)*6;let k=null,sol=0;
  if(t===1){if(h<.012){k='log';sol=1}else if(h<.03)k='stump';else if(h<.06)k='mush';else if(h<.09)k='fern';else if(h<.1)k='mossrock'}
  else if(t===5){if(h<.03){k='boulder';sol=1}else if(h<.05)k='rock';else if(h<.065)k='deadbush'}
  else if(t===6){if(adjW(x,y)&&h<.4)k='reeds';else if(h<.04)k='tallgrass';else if(h<.047)k=adjW(x+1,y)||adjW(x,y+1)||h<.043?'egret':'jabiru'}
  else if(t===4){if(h<.018){k='termite';sol=1}else if(h<.03)k='rock';else if(h<.08)k='drygrass'}
  if(k){DECO.push({k,x:px,y:py,hx:px,hy:py,s:.85+hs(x,y)*.4,f:hs(y,x),fly:0,t:0});if(sol)SOL[i]=1}
 }
 DECO.sort((a,b)=>a.y-b.y);
};
// ---- árvores nativas
const _dtree=drawTree;
drawTree=function(g,t){
 if(t.k<4)return _dtree(g,t);
 const x=t.x,y=t.y,s=t.s,dry=!isWet();Rr(g,'rgba(0,0,0,.22)',x-7,y-2,14,3);
 if(t.k===4){const h=30*s;for(let i=0;i<h;i+=2)Rr(g,i%4?'#7a6a4a':'#5a4a32',x-1.5,y-i-2,3,2);const ty=y-h-2,sw=Math.sin(frame/40+t.x)*.6;
  for(let a=0;a<9;a++){const an=-Math.PI+a*Math.PI/8;for(let r=2;r<11;r++)Rr(g,a%2?'#3a7a3a':'#4a9a3a',x+Math.cos(an)*r+sw,ty+Math.sin(an)*r*.7+(r>7?r-7:0)*.4,1.6,1.2)}
  Rr(g,'#c8601a',x-2,ty+2,2,2);Rr(g,'#c8601a',x+1,ty+3,2,2);Rr(g,'#a8501a',x-1,ty+4,2,2)}
 else if(t.k===5||t.k===7){
  Rr(g,'#4a3020',x-1.5,y-10,3,10);Rr(g,'#4a3020',x-4,y-14,3,5);Rr(g,'#4a3020',x+1,y-15,3,6);Rr(g,'#3a2418',x,y-10,1,8);
  let c1,c2;if(t.k===5){const pink=hs(Math.floor(x),Math.floor(y))<.4;c1=dry?(pink?'#d860a0':'#f0c020'):'#4a8a3a';c2=dry?(pink?'#f090c0':'#f8e060'):'#6aaa4a'}else{c1=dry?'#7a8a3a':'#4a7a32';c2=dry?'#9aa84a':'#6a9a42'}
  const w=18*s;Rr(g,c1,x-w/2,y-24*s,w,9*s);Rr(g,c1,x-w/2-3,y-20*s,8,6);Rr(g,c1,x+w/2-4,y-21*s,8,6);Rr(g,c2,x-w/2+2,y-24*s,w/2,4);Rr(g,c2,x+2,y-19*s,5,3);
  if(t.k===5&&dry)for(let i=0;i<4;i++)Rr(g,c2,x-8+((frame/9+i*11+x)%18),y-2+((i*3)%3),1,1)}
 else{const snow=Math.floor(x/TS)>=100&&Math.floor(y/TS)<=40;Rr(g,'#7a7068',x-1.5,y-22*s,3,22*s);Rr(g,'#7a7068',x-7,y-17*s,7,1.5);Rr(g,'#7a7068',x+1,y-14*s,6,1.5);Rr(g,'#7a7068',x-7,y-20*s,1.5,4);Rr(g,'#7a7068',x+6,y-17*s,1.5,4);Rr(g,'#7a7068',x-2,y-27*s,1.5,6);
  if(snow){Rr(g,'#f4f8fa',x-7,y-18*s,7,1);Rr(g,'#f4f8fa',x+1,y-15*s,6,1)}}
};
// ---- decorações
function drawDeco(g,d){
 const x=d.x,y=d.y,s=d.s,sw=Math.sin(frame/30+d.f*9);
 switch(d.k){
  case 'log':Rr(g,'rgba(0,0,0,.25)',x-9,y-1,18,2);Rr(g,'#6a4428',x-9,y-6,18,5);Rr(g,'#4a2e1a',x-9,y-2,18,1);Rr(g,'#4a8a3a',x-7,y-7,9,2);Rr(g,'#c8a070',x+8,y-6,2,5);Rr(g,'#8a6040',x+8.5,y-5,1,3);if(d.f<.3){Rr(g,'#d84030',x-3,y-9,2,2);Rr(g,'#fff',x-2.5,y-8.5,.6,.6)}break;
  case 'stump':Rr(g,'rgba(0,0,0,.22)',x-4,y-1,8,2);Rr(g,'#6a4428',x-3,y-5,6,5);Rr(g,'#c8a070',x-3,y-6,6,2);Rr(g,'#8a6040',x-1.5,y-5.6,3,1);Rr(g,'#4a2e1a',x-4,y-1,2,1);Rr(g,'#4a2e1a',x+2,y-1,2,1);break;
  case 'mush':for(let i=0;i<3;i++){const mx=x-3+i*3,mh=2+((d.f*10+i)%2);Rr(g,'#f0e8d8',mx,y-mh,1,mh);Rr(g,d.f<.5?'#d84030':'#c8904a',mx-1,y-mh-1.5,3,1.6);if(d.f<.5)Rr(g,'#fff',mx,y-mh-1.4,.6,.6)}break;
  case 'fern':for(let i=-3;i<=3;i++)Rr(g,i%2?'#3f8a3a':'#2f6a2f',x+i*1.2+sw*.4,y-6+Math.abs(i)*.8,1,6-Math.abs(i)*.8);break;
  case 'mossrock':Rr(g,'#7a7a7a',x-4,y-4,8,4);Rr(g,'#9a9a9a',x-3,y-5,5,2);Rr(g,'#4a8a3a',x-3,y-5,4,1);break;
  case 'boulder':Rr(g,'rgba(0,0,0,.28)',x-9,y-1,18,3);Rr(g,'#6a7078',x-8,y-10*s,16,10*s);Rr(g,'#8a9098',x-6,y-11*s,10,4);Rr(g,'#4a5058',x+2,y-6*s,6,6*s);Rr(g,'#f4f8fa',x-7,y-12*s,12,2.5);Rr(g,'#f4f8fa',x-4,y-13*s,6,1.5);break;
  case 'rock':Rr(g,'rgba(0,0,0,.2)',x-3,y-1,7,2);Rr(g,'#7a7a80',x-3,y-3,6,3);Rr(g,'#9a9aa0',x-2,y-4,4,1.5);if(G[ti(Math.floor(x/TS),Math.floor(y/TS))]===5)Rr(g,'#fff',x-2,y-4.2,3,1);break;
  case 'deadbush':for(let i=-2;i<=2;i++)Rr(g,'#7a6a5a',x+i*1.5,y-4+Math.abs(i),.8,4-Math.abs(i));Rr(g,'#f4f8fa',x-1,y-5,2,.8);break;
  case 'reeds':for(let i=0;i<5;i++){const rx=x-4+i*2,rh=7+((d.f*17+i)%4),bend=sw*(1+i*.2);Rr(g,i%2?'#4a8a3a':'#5a9a3a',rx+bend*.3,y-rh,1,rh);if(i%2===0){Rr(g,'#6a4428',rx+bend*.5-.4,y-rh-2,1.8,3)}}break;
  case 'tallgrass':for(let i=0;i<4;i++)Rr(g,'#4a7a32',x-3+i*2+sw*.5,y-5-i%2,1,5+i%2);break;
  case 'termite':Rr(g,'rgba(0,0,0,.25)',x-6,y-1,12,2);Rr(g,'#a85a32',x-5,y-7,10,7);Rr(g,'#b8683a',x-4,y-11,8,4);Rr(g,'#a85a32',x-2.5,y-15,5,4);Rr(g,'#c87848',x-1.5,y-17,3,2);Rr(g,'#7a3a1a',x-3,y-6,1,1);Rr(g,'#7a3a1a',x+2,y-9,1,1);Rr(g,'#7a3a1a',x,y-13,1,1);break;
  case 'drygrass':for(let i=0;i<4;i++)Rr(g,i%2?'#c8a04a':'#d8b85a',x-3+i*2+sw*.6,y-4-i%2,1,4+i%2);break;
  case 'egret':case 'jabiru':{
   const jb=d.k==='jabiru',body=jb?'#f4f4f4':'#ffffff';
   if(d.fly){const fl=((frame>>2)&1);Rr(g,'rgba(0,0,0,.15)',d.hx+(d.x-d.hx)*.6-3,d.hy,6,1.5);Rr(g,body,x-3,y-12,7,3);Rr(g,body,x-6,y-13-(fl?2:-1),4,1.5);Rr(g,body,x+3,y-13-(fl?2:-1),4,1.5);Rr(g,jb?'#222':body,x+4,y-12,3,1.5);Rr(g,jb?'#222':'#e0b030',x+7,y-11.5,3,.8)}
   else{const bob=(frame>>5)%5===0?1:0;Rr(g,'rgba(0,0,0,.15)',x-3,y-1,7,1.5);Rr(g,jb?'#222':'#e0b030',x-1,y-5,.8,5);Rr(g,jb?'#222':'#e0b030',x+1,y-5,.8,5);Rr(g,body,x-3,y-10*(jb?1.2:1),7,5);if(jb){Rr(g,'#222',x+2,y-16+bob,2,5);Rr(g,'#d02020',x+2,y-12+bob,2,1.4);Rr(g,'#222',x+3,y-16+bob,4,1.2)}else{Rr(g,body,x+2,y-14+bob,1.6,5);Rr(g,body,x+2,y-15+bob,3,1.6);Rr(g,'#e0b030',x+5,y-14.6+bob,3,.8)}}
   break}
 }
}
function stepBirds(dt){
 for(const d of DECO){if(d.k!=='egret'&&d.k!=='jabiru')continue;const dd=Math.hypot(d.x-P.x,d.y-P.y);
  if(!d.fly&&dd<(P.sneak?35:75)&&!(d.cool>0)){d.fly=1;d.vx=(d.x>P.x?1:-1)*rnd(40,60);d.vy=-rnd(10,25);d.t=0}
  if(d.cool>0)d.cool-=dt;
  if(d.fly){d.t+=dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(d.t>8){d.fly=0;d.x=d.hx;d.y=d.hy;d.cool=20}}
 }
}
const _evo=evoItems;
evoItems=function(L,x0,x1,y0,y1){
 _evo(L,x0,x1,y0,y1);
 for(const d of DECO)if(d.x>x0-20&&d.x<x1+20&&d.y>y0-10&&d.y<y1+30)L.push([d.y,10,{draw:g=>drawDeco(g,d)}]);
};
// ---- água animada e pegadas (camada do chão)
const _dfs2=drawFarmStatic;
drawFarmStatic=function(g){
 _dfs2(g);
 const tx0=Math.max(XMIN,Math.floor(CX/TS)),tx1=Math.min(MW-1,Math.ceil((CX+VW)/TS)),ty0=Math.max(YMIN,Math.floor(CY/TS)),ty1=Math.min(MH-1,Math.ceil((CY+VH)/TS));
 for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){if(G[ti(x,y)]!==2||inMountainLake(x,y))continue;const h=hs(x+77,y+33);if(h>.35)continue;
  const a=.5+.5*Math.sin(frame/22+h*30);if(a>.55)Rr(g,'rgba(230,245,255,'+((a-.55)*1.4).toFixed(2)+')',x*TS+((h*40)|0)%12+Math.sin(frame/40+h*9)*1.5,y*TS+((h*90)|0)%13,3,1)}
 for(const p of PRINTS){const al=Math.max(0,1-p.t/p.l);Rr(g,p.c+(al*.5).toFixed(2)+')',p.x,p.y,p.w,p.h)}
};
function stepPrints(dt){
 for(let i=PRINTS.length-1;i>=0;i--){PRINTS[i].t+=dt;if(PRINTS[i].t>PRINTS[i].l)PRINTS.splice(i,1)}
 const add=(x,y,dog,o)=>{const t=G[ti(Math.floor(x/TS),Math.floor(y/TS))];if(t!==5&&t!==6&&t!==4)return;if(PRINTS.length>260)PRINTS.shift();PRINTS.push({x:x+o,y:y-1,w:dog?1.2:1.6,h:dog?1.2:1,t:0,l:t===5?40:18,c:t===5?'rgba(120,150,175,':t===6?'rgba(40,30,15,':'rgba(120,70,30,'})};
 if(P.moving){P.prT=(P.prT||0)-dt;if(P.prT<=0){P.prT=.22;P.prS=-(P.prS||1);add(P.x,P.y,0,P.prS*1.6)}}
 for(const d of S.dogs){const r=dogRT(d);if(!r.moving)continue;r.prT=(r.prT||0)-dt;if(r.prT<=0){r.prT=.18;add(r.x,r.y,1,rnd(-2,2))}}
}
// névoa do pantanal ao amanhecer e urubus no cerrado
const _dpr3=drawPart;
drawPart=function(g){
 _dpr3(g);const tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS),hr=S.t*24;
 if(!inRoom()&&tx>=100&&ty>40&&hr>4.5&&hr<9.5){const al=Math.min(1,Math.min(hr-4.5,9.5-hr))*.16;for(let i=0;i<9;i++){const mx=CX+((i*67+frame*.15)%(VW+60))-30,my=CY+30+i*(VH/9);Rr(g,'rgba(235,240,245,'+al.toFixed(3)+')',mx,my,48,7);Rr(g,'rgba(235,240,245,'+(al*.7).toFixed(3)+')',mx+8,my-3,30,3)}}
 if(!inRoom()&&bioAt(tx,ty)===4&&daylight()>.5)for(let i=0;i<3;i++){const an=frame/160+i*2.1,vx=CX+VW/2+Math.cos(an)*(50+i*14),vy=CY+VH/3+Math.sin(an)*(28+i*8),fl=((frame>>3)+i)&1;Rr(g,'#1a1a1a',vx-1,vy,3,1.2);Rr(g,'#1a1a1a',vx-5,vy-(fl?1:0),4,1);Rr(g,'#1a1a1a',vx+2,vy-(fl?1:0),4,1);Rr(g,'rgba(0,0,0,.12)',vx-3,vy+40,7,1.5)}
};
const _upd6=update;update=function(dt){_upd6(dt);stepBirds(dt);stepPrints(dt)};
