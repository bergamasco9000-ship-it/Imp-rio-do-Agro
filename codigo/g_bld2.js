// ===== Prédios realistas em vista 3/4 (telhado de cima + fachada), com cache por variante =====
const BCACHE=new Map();let BCPS=0;
const BW=(g,c,x,y,w,h)=>Rr(g,c,x,y,w,h);
const winXs=b=>{const w=b.w*TS,dx=b.door*TS-b.x*TS,L=[];for(let wx=8;wx<w-14;wx+=24)if(Math.abs(wx-dx)>20)L.push(wx);return L};
// ---------- telhados
function roofClay(g,x,y,w,rh,col,hip){const c=col||'#b5532e',dk=shade(c,-28),lt=shade(c,16),dd=shade(c,-48),ov=4;
 for(let r=0;r<rh;r+=3){const ins=hip?Math.max(0,(rh-r)*.7-2):0,x0=x-ov+ins,ww=w+ov*2-ins*2,row=(r/3)|0;BW(g,c,x0,y+r,ww,3);
  for(let i=(row%2?1.5:0);i<ww;i+=3){BW(g,lt,x0+i,y+r,1.2,2.2);BW(g,dk,x0+i+1.6,y+r+.4,1,2.4)}BW(g,dd,x0,y+r+2.5,ww,.6)}
 if(hip){for(let r=0;r<rh;r++){const ins=Math.max(0,(rh-r)*.7-2);BW(g,'rgba(0,0,0,.16)',x-ov+ins-.5,y+r,Math.min(ins+.5,8),1);BW(g,'rgba(0,0,0,.16)',x+w+ov-ins-Math.min(ins,8),y+r,Math.min(ins,8),1)}
  const ins0=rh*.7-2;BW(g,dd,x-ov+ins0,y-1.5,w+ov*2-ins0*2,2.5);BW(g,lt,x-ov+ins0,y-1.5,w+ov*2-ins0*2,.8)}
 else{BW(g,dd,x-ov,y-1.5,w+ov*2,2.5);BW(g,lt,x-ov,y-1.5,w+ov*2,.8);for(let i=0;i<w+ov*2;i+=4)BW(g,dk,x-ov+i,y-1.5,.6,2.5)}
 // beiral com pontas das telhas
 BW(g,dd,x-ov,y+rh-1,w+ov*2,2);for(let i=0;i<w+ov*2;i+=3)BW(g,dk,x-ov+i+.5,y+rh-.6,2,1.6);BW(g,'rgba(0,0,0,.35)',x,y+rh+1,w,2)}
function roofMetal(g,x,y,w,rh,col,arc){const c=col||'#9aa3ab',lt=shade(c,22),dk=shade(c,-26),ov=3;
 for(let r=0;r<rh;r++){const k=arc?Math.sin((r/rh)*Math.PI/2):1,sh=arc?shade(c,Math.round((1-k)*30-8)):c;BW(g,sh,x-ov,y+r,w+ov*2,1)}
 for(let i=0;i<w+ov*2;i+=3){BW(g,lt,x-ov+i,y,.8,rh);BW(g,dk,x-ov+i+1.8,y,.6,rh)}
 if(!arc){BW(g,dk,x-ov,y-1,w+ov*2,2);BW(g,lt,x-ov,y-1,w+ov*2,.6)}for(let i=6;i<rh;i+=9)BW(g,'rgba(0,0,0,.08)',x-ov,y+i,w+ov*2,.6);
 BW(g,shade(c,-40),x-ov,y+rh-1,w+ov*2,2);BW(g,'rgba(0,0,0,.3)',x,y+rh+1,w,2);
 if(rh>12&&!arc){BW(g,'rgba(140,80,40,.25)',x+w*.2,y+rh*.4,3,rh*.5);BW(g,'rgba(140,80,40,.2)',x+w*.7,y+rh*.3,2,rh*.6)}}
function roofShingle(g,x,y,w,rh,col){const c=col||'#5a3a24',dk=shade(c,-25),lt=shade(c,14),ov=4;
 for(let r=0;r<rh;r+=3){BW(g,r%6?c:shade(c,6),x-ov,y+r,w+ov*2,3);for(let i=(r%6?2:0);i<w+ov*2;i+=4)BW(g,dk,x-ov+i,y+r,.7,3);BW(g,lt,x-ov,y+r,w+ov*2,.5)}
 BW(g,shade(c,-40),x-ov,y-1.5,w+ov*2,2.5);BW(g,shade(c,-45),x-ov,y+rh-1,w+ov*2,2);BW(g,'rgba(0,0,0,.33)',x,y+rh+1,w,2)}
function roofThatch(g,x,y,w,rh){const ov=5;for(let r=0;r<rh;r++){const ins=Math.max(0,(rh-r)*.45-1);BW(g,r%3?'#b89a52':'#a8884a',x-ov+ins,y+r,w+ov*2-ins*2,1)}
 for(let i=0;i<w+ov*2;i+=2){const h=hs(i,y)*3;BW(g,'#8a6a32',x-ov+i,y+rh-2+h*.4,1,2+h);BW(g,'#d8c070',x-ov+i+1,y+2+hs(y,i)*rh*.8,.6,3)}BW(g,'#6a5226',x+rh*.45-ov,y-1,w-rh*.9+ov*2,2);BW(g,'rgba(0,0,0,.3)',x,y+rh+1,w,2)}
function roofGambrel(g,x,y,w,rh,col){const c=col||'#4a3a34',dk=shade(c,-22),lt=shade(c,14),ov=4,k=Math.round(rh*.42);
 for(let r=0;r<rh;r+=3){const up=r<k;BW(g,up?shade(c,12):c,x-ov,y+r,w+ov*2,3);for(let i=(r%6?2:0);i<w+ov*2;i+=4)BW(g,dk,x-ov+i,y+r,.7,3)}
 BW(g,lt,x-ov,y+k,w+ov*2,1);BW(g,shade(c,-35),x-ov,y+k+1,w+ov*2,.8);BW(g,shade(c,-40),x-ov,y-1.5,w+ov*2,2.5);BW(g,shade(c,-45),x-ov,y+rh-1,w+ov*2,2);BW(g,'rgba(0,0,0,.33)',x,y+rh+1,w,2)}
// ---------- paredes
function wallCal(g,x,y,w,hh,col,bar){const c=col||'#f0ebe0';BW(g,c,x,y,w,hh);for(let i=0;i<w;i+=3)for(let j=0;j<hh;j+=4){const h=hs(x+i,y+j);if(h<.18)BW(g,shade(c,-7),x+i+h*6,y+j+h*8,1.5,1)}
 if(bar){BW(g,bar,x,y+hh-7,w,7);BW(g,shade(bar,18),x,y+hh-7,w,.8);for(let i=0;i<w;i+=7)if(hs(i,x)<.4)BW(g,shade(bar,-12),x+i,y+hh-4,3,1)}
 BW(g,'rgba(0,0,0,.18)',x,y,w,3);BW(g,shade(c,-30),x-1,y,1,hh);BW(g,shade(c,-30),x+w,y,1,hh)}
function wallBoards(g,x,y,w,hh,col){const c=col||'#a87a48';BW(g,c,x,y,w,hh);for(let i=0;i<w;i+=4){BW(g,shade(c,-22),x+i,y,.8,hh);BW(g,shade(c,10),x+i+1,y,.8,hh);if(hs(i,y)<.4)BW(g,shade(c,-30),x+i+2,y+hs(y,i)*hh,.8,.8)}BW(g,'rgba(0,0,0,.2)',x,y,w,3);BW(g,shade(c,-40),x-1,y,1,hh);BW(g,shade(c,-40),x+w,y,1,hh)}
function wallLogs(g,x,y,w,hh,col){const c=col||'#8a5a32';BW(g,c,x,y,w,hh);for(let j=0;j<hh;j+=5){BW(g,shade(c,16),x,y+j,w,1.2);BW(g,shade(c,-30),x,y+j+4,w,1);BW(g,shade(c,-12),x-2,y+j+.5,3,4);BW(g,shade(c,-12),x+w-1,y+j+.5,3,4);BW(g,shade(c,-40),x-1.5,y+j+1.5,1.5,2);BW(g,shade(c,-40),x+w,y+j+1.5,1.5,2);for(let i=6;i<w;i+=11)if(hs(i,j+y)<.5)BW(g,shade(c,-22),x+i,y+j+2,2,.8)}BW(g,'rgba(0,0,0,.2)',x,y,w,2)}
function wallBrick(g,x,y,w,hh,col){const c=col||'#b0583a';BW(g,c,x,y,w,hh);for(let j=0;j<hh;j+=3){BW(g,shade(c,-22),x,y+j+2.4,w,.6);for(let i=(j%6?2:0);i<w;i+=5)BW(g,shade(c,-22),x+i,y+j,.6,2.4);for(let i=(j%6?3:1);i<w;i+=10)BW(g,shade(c,hs(i,j)*14-7),x+i,y+j,3.6,2.3)}BW(g,'rgba(0,0,0,.2)',x,y,w,3)}
function wallTile(g,x,y,w,hh){BW(g,'#f4f4f0',x,y,w,hh);for(let j=0;j<hh;j+=4)BW(g,'#d8dcdc',x,y+j,w,.5);for(let i=0;i<w;i+=4)BW(g,'#d8dcdc',x+i,y,.5,hh);for(let i=0;i<w;i+=8)BW(g,'#a82a2a',x+i,y+hh-9,4,4);BW(g,'rgba(0,0,0,.15)',x,y,w,3)}
function wallStone(g,x,y,w,hh){BW(g,'#8a8478',x,y,w,hh);for(let j=0;j<hh;j+=4)for(let i=((j/4)%2)*3;i<w;i+=6){const h=hs(x+i,y+j);BW(g,shade('#9a948a',h*20-10),x+i+.4,y+j+.4,5.2,3.2)}BW(g,'rgba(0,0,0,.2)',x,y,w,3)}
function wallAdobe(g,x,y,w,hh){BW(g,'#c89a6a',x,y,w,hh);for(let i=0;i<20;i++){const a=hs(i,x),b2=hs(x,i);BW(g,'#a87a4a',x+a*w,y+b2*hh,3,1.5)}for(let i=3;i<w;i+=9)if(hs(i,y)<.5){BW(g,'#7a5a32',x+i,y+4+hs(y,i)*10,1,5);BW(g,'#7a5a32',x+i-2,y+7+hs(y,i)*10,5,1)}BW(g,'#b08050',x,y+hh-5,w,5);BW(g,'rgba(0,0,0,.18)',x,y,w,3)}
// ---------- janelas, portas e enfeites
function winColonial(g,wx,wy,frame,sh){BW(g,frame,wx-1,wy-1,15,14);BW(g,'#2a3a4a',wx+.5,wy+.5,12,11);BW(g,'#6a9ac8',wx+1,wy+1,11,5);BW(g,'#a8d0f0',wx+1,wy+1,4,2.5);BW(g,frame,wx+6,wy,1,12);BW(g,frame,wx,wy+5.5,13,1);
 BW(g,sh,wx-5,wy-.5,4,13);BW(g,sh,wx+14,wy-.5,4,13);for(let i=1;i<12;i+=2){BW(g,shade(sh,-25),wx-5,wy+i,4,.6);BW(g,shade(sh,-25),wx+14,wy+i,4,.6)}BW(g,shade(frame,-20),wx-2,wy+12,17,1.6);BW(g,shade(frame,15),wx-2,wy+12,17,.5)}
function winGlass(g,wx,wy,frame){BW(g,frame,wx-1,wy-1,15,14);BW(g,'#3a5a7a',wx,wy,13,12);BW(g,'#7aaad0',wx,wy,13,6);BW(g,'#c8e4f8',wx+1,wy+1,3,8);BW(g,frame,wx+6,wy,1,12)}
function winBars(g,wx,wy,frame){winGlass(g,wx,wy,frame);for(let i=1;i<13;i+=3)BW(g,'#2a2a2a',wx+i,wy,.8,12);BW(g,'#2a2a2a',wx,wy+5.5,13,.8)}
function winArch(g,wx,wy,frame,glass){BW(g,frame,wx-1,wy-3,15,16);BW(g,frame,wx+1,wy-5,11,2);BW(g,glass||'#3a5a7a',wx,wy-2,13,14);BW(g,glass?shade(glass,30):'#7aaad0',wx,wy-2,13,5);BW(g,frame,wx+6,wy-2,1,14);BW(g,'#c8e4f8',wx+1,wy-1,2,6)}
function doorWood(g,dx,dy,col,arch){const c=col||'#6a4a2a';BW(g,shade(c,-40),dx-1,dy-1,18,25);if(arch){BW(g,shade(c,-40),dx+1,dy-3,14,3)}BW(g,shade(c,-25),dx,dy,16,24);BW(g,c,dx+1.5,dy+1.5,6,22);BW(g,c,dx+8.5,dy+1.5,6,22);
 for(const px of[2.5,9.5]){BW(g,shade(c,12),px+dx,dy+3,4,8);BW(g,shade(c,12),px+dx,dy+13,4,8)}BW(g,'#e0b040',dx+7,dy+12,1,2);BW(g,'#e0b040',dx+9,dy+12,1,2);BW(g,'#8a8478',dx-2,dy+24,20,2);BW(g,'#a8a294',dx-2,dy+24,20,.7)}
function doorGlass(g,dx,dy){BW(g,'#5a5a62',dx-1,dy-1,18,25);BW(g,'#3a5a7a',dx,dy,16,24);BW(g,'#8abada',dx+1,dy+1,6,22);BW(g,'#8abada',dx+9,dy+1,6,22);BW(g,'#c8e4f8',dx+2,dy+2,2,10);BW(g,'#ccc',dx+7,dy+10,2,4);BW(g,'#8a8478',dx-2,dy+24,20,2)}
function doorRoll(g,dx,dy){BW(g,'#4a4a52',dx-2,dy-1,20,25);BW(g,'#2a2018',dx,dy+4,16,20);BW(g,'#8a8a92',dx-1,dy,18,4);for(let i=0;i<4;i+=1.2)BW(g,'#6a6a72',dx-1,dy+i,18,.4);BW(g,'#c8a050',dx+2,dy+14,5,10);BW(g,'#a87a32',dx+9,dy+16,5,8);BW(g,'#8a8478',dx-2,dy+24,20,2)}
function signBoard(g,cx,y,txt,bg,fg,bd){const tw=ptw(txt)+6;BW(g,bd||'#1e140c',cx-tw/2-1,y-1,tw+2,10);BW(g,bg||'#4a3020',cx-tw/2,y,tw,8);BW(g,shade(bg||'#4a3020',20),cx-tw/2,y,tw,.8);ptext(g,txt,cx-tw/2+3,y+1.5,fg||'#ffd75e',bd||'#1e140c')}
function plantPot(g,x,y,c){BW(g,'#a8502a',x,y-4,5,4);BW(g,'#8a3a1a',x,y-4,5,1);BW(g,'#3a8a3a',x-1,y-9,7,5);BW(g,'#4aa04a',x,y-10,4,2);if(c){BW(g,c,x,y-9,2,2);BW(g,c,x+3,y-8,2,2)}}
function flowerBox(g,x,y,w){BW(g,'#7a4a2a',x,y,w,3);for(let i=0;i<w;i+=3){BW(g,'#3a8a3a',x+i,y-2,2.4,2.2);BW(g,['#e84a5a','#f0d040','#f08ab0','#fff'][(i/3|0)%4],x+i+.5,y-3,1.6,1.6)}}
function wallLamp(g,x,y){BW(g,'#2a2a2a',x,y,3,1);BW(g,'#2a2a2a',x+1,y-3,1,3);BW(g,'#f0e8b0',x,y-5,3,3);BW(g,'#2a2a2a',x-.5,y-6,4,1)}
function bench(g,x,y){BW(g,'#7a5232',x,y-5,14,2);BW(g,'#5a3a22',x+1,y-3,1.5,3);BW(g,'#5a3a22',x+11.5,y-3,1.5,3);BW(g,'#8a6242',x,y-9,14,1.5);BW(g,'#5a3a22',x+1,y-9,1,4);BW(g,'#5a3a22',x+12,y-9,1,4)}
function barrel(g,x,y){BW(g,'#7a4a2a',x,y-8,6,8);BW(g,'#5a5a5a',x,y-7,6,.8);BW(g,'#5a5a5a',x,y-2,6,.8);BW(g,'#9a6a3a',x+1,y-8,1.5,8)}
function sacks(g,x,y,n,c){for(let i=0;i<n;i++){const sx=x+(i%3)*6+((i/3|0)%2)*3,sy=y-4-((i/3)|0)*4;BW(g,c||'#e0d0a8',sx,sy,6,4);BW(g,shade(c||'#e0d0a8',-18),sx,sy+3,6,1);BW(g,'#2a8a3a',sx+2,sy+1,2,1.5)}}
function stoneBase(g,x,y,w){BW(g,'#7a7468',x-1,y-3,w+2,3);for(let i=0;i<w;i+=6)BW(g,'#5e584e',x+i+((i/6)%2?3:0),y-3,1,3);BW(g,'#9a948a',x-1,y-3,w+2,.7)}
function chimney(g,x,y,col){BW(g,col||'#9a5a3a',x,y,6,10);for(let j=0;j<10;j+=2.5)BW(g,shade(col||'#9a5a3a',-25),x,y+j,6,.5);BW(g,'#4a2a1a',x-1,y-1,8,2)}
function shadowB(g,x,y,w,h){BW(g,'rgba(0,0,0,.22)',x+3,y+h-1,w+2,5);BW(g,'rgba(0,0,0,.12)',x+w,y+12,5,h-12)}
// ---------- desenhos por prédio
const BART={};
function stdWins(g,b,x,y,h,fn){for(const wx of winXs(b))fn(g,x+wx,y+h-32)}
BART.house=(g,b,x,y,w,h,dx,v)=>{const st=v,rh=h-34;shadowB(g,x,y,w,h);
 if(st>=3){const gx=x-27;wallCal(g,gx,y+h-30,26,30,'#f2ede2','#3a6a9a');roofClay(g,gx-2,y+h-46,30,16,'#b5532e');BW(g,'#4a4a52',gx+4,y+h-24,18,24);for(let i=0;i<6;i++)BW(g,'#3a3a42',gx+4,y+h-24+i*4,18,1);BW(g,'#c83a2a',gx+6,y+h-10,14,6);BW(g,'#222',gx+7,y+h-5,3,3);BW(g,'#222',gx+16,y+h-5,3,3)}
 wallCal(g,x,y+rh,w,h-rh,'#f4efe4','#3a6a9a');roofClay(g,x,y,w,rh,'#b5532e',true);
 chimney(g,x+w-16,y+2,'#c8b8a0');if(st>=4)for(let i=0;i<3;i++){BW(g,'#1a2a4a',x+10+i*12,y+rh*.35,10,rh*.42);BW(g,'#5a7aaa',x+10+i*12,y+rh*.35,10,1);BW(g,'#3a5a8a',x+15+i*12,y+rh*.35,.6,rh*.42)}
 stdWins(g,b,x,y,h,(g,a,c)=>winColonial(g,a,c,'#f4efe4','#2a5a8a'));
 doorWood(g,x+dx,y+h-24,'#2a5a8a');wallLamp(g,x+dx-4,y+h-26);
 // alpendre com colunas e rede
 if(st>=1){BW(g,'#a83a2a',x-3,y+h-2,w+6,3);for(let i=0;i<w+6;i+=4)BW(g,'#8a2a1a',x-3+i,y+h-2,.6,3);for(const cx of[x-2,x+w-1,...(w>80?[x+w/2-1]:[])]){BW(g,'#f4efe4',cx,y+rh+2,3,h-rh-4);BW(g,'#d8d0c0',cx+2,y+rh+2,1,h-rh-4)}
  bench(g,x+4,y+h-2);BW(g,'#d84a3a',x+w-26,y+h-14,14,1);for(let i=0;i<14;i+=2)BW(g,i%4?'#f0d040':'#3a8a3a',x+w-26+i,y+h-13+Math.sin(i/14*Math.PI)*3,2,1.5)}
 if(st>=2){winXs(b).forEach(wx=>flowerBox(g,x+wx-2,y+h-19,17));plantPot(g,x+dx-8,y+h,'#f08ab0');plantPot(g,x+dx+19,y+h,'#f0d040')}
 if(st>=4){BW(g,'#8a8a92',x-4,y+h+1,w+8,3);for(let i=0;i<w+8;i+=5)BW(g,'#6a6a72',x-4+i,y+h+1,.6,3)}
 BW(g,'#5a3a22',x+w-8,y+h-6,2,6);BW(g,'#c8302a',x+w-10,y+h-10,6,4);BW(g,'#ffd75e',x+w-9,y+h-9,4,1)};
BART.barn=(g,b,x,y,w,h,dx,v)=>{const rh=h-40;shadowB(g,x,y,w,h);
 if(v&2){BW(g,'#8a2a22',x+w,y+h-26,18,26);roofMetal(g,x+w-2,y+h-36,22,10,'#8a9098');BW(g,'#2a1a10',x+w+4,y+h-16,10,16);BW(g,'#e8dcc0',x+w+4,y+h-16,10,1)}
 wallBoards(g,x,y+rh,w,h-rh,'#a8342a');roofGambrel(g,x,y,w,rh,'#4a4040');
 // frontão branco, janela do palheiro e portão em X
 BW(g,'#f3ead8',x,y+rh+1,w,1.5);BW(g,'#f3ead8',x-1,y+rh,1.5,h-rh);BW(g,'#f3ead8',x+w-.5,y+rh,1.5,h-rh);
 const hx=x+dx-1;BW(g,'#f3ead8',hx,y+rh+3,18,11);BW(g,'#3a2416',hx+1.5,y+rh+4.5,15,8);for(let i=0;i<6;i++)BW(g,'#d8b04a',hx+2+i*2.4,y+rh+9+hs(i,x)*2,2,4-hs(i,x)*2);BW(g,'#c8a040',hx+2,y+rh+11,14,1.5);
 BW(g,'#5a3a22',hx+8,y+rh+1,2,3);BW(g,'#888',hx+7,y+rh,4,1);
 BW(g,'#f3ead8',x+dx-4,y+h-28,24,28);BW(g,'#7a2a20',x+dx-2,y+h-26,20,26);for(let i=0;i<20;i++){BW(g,'#f3ead8',x+dx-2+i,y+h-26+i*1.3,1.2,1.2);BW(g,'#f3ead8',x+dx+17-i,y+h-26+i*1.3,1.2,1.2)}BW(g,'#f3ead8',x+dx+7.5,y+h-26,1,26);BW(g,'#4a4a4a',x+dx-4,y+h-29,24,1);
 stdWins(g,b,x,y,h,(g,a,c)=>{BW(g,'#f3ead8',a-1,c-1,15,14);BW(g,'#2a3a4a',a,c,13,12);BW(g,'#6a9ac8',a,c,13,5);BW(g,'#f3ead8',a+6,c,1,12);BW(g,'#f3ead8',a,c+5.5,13,1)});
 // cata-vento no topo
 const cx=x+w/2;BW(g,'#3a3a3a',cx-.5,y-12,1,12);BW(g,'#3a3a3a',cx-4,y-7,8,.6);BW(g,'#3a3a3a',cx-.5,y-10,1,6);BW(g,'#c89a30',cx-3,y-14,6,3);BW(g,'#c89a30',cx+2,y-16,2,2);BW(g,'#c89a30',cx-4,y-15,2,1);
 if(v&1)for(let i=0;i<3;i++){BW(g,'#d8b04a',x-12+i*5,y+h-5,6,5);BW(g,'#a8832a',x-12+i*5,y+h-5,6,1);BW(g,'#a8832a',x-10+i*5,y+h-5,.8,5)}
 BW(g,'#7a7468',x+dx-6,y+h,28,2)};
BART.leilao=(g,b,x,y,w,h,dx)=>{const rh=h-38;shadowB(g,x,y,w,h);
 // currais de espera e rampa de embarque ao lado
 for(let i=0;i<3;i++){BW(g,'#7a5a32',x+w+2,y+h-14+i*5,16,1.4)}for(let i=0;i<4;i++)BW(g,'#5a3a22',x+w+2+i*5,y+h-16,1.6,16);BW(g,'#6a4a2a',x-14,y+h-10,12,2);for(let i=0;i<4;i++)BW(g,'#8a6a3a',x-14+i*3,y+h-14+i*1.5,3,1);
 wallCal(g,x,y+rh,w,h-rh,'#efe6d2','#8a2a22');roofMetal(g,x,y,w,rh,'#a8b0b8',true);
 // platibanda com letreiro
 BW(g,'#8a2a22',x-2,y+rh-3,w+4,10);BW(g,'#a83a2a',x-2,y+rh-3,w+4,1.5);signBoard(g,x+w/2,y+rh-1,'LEILAO DE GADO','#f4ead0','#8a2a22','#5a1a14');
 stdWins(g,b,x,y,h,(g,a,c)=>winGlass(g,a,c,'#f4ead0'));
 BW(g,'#3a2a1a',x+dx-6,y+h-26,28,26);BW(g,'#6a4a2a',x+dx-4,y+h-24,24,24);for(let i=0;i<24;i+=3)BW(g,'#5a3a1e',x+dx-4+i,y+h-24,.8,24);BW(g,'#2a1a10',x+dx+6,y+h-24,4,24);
 BW(g,'#8a8478',x+dx-8,y+h,32,2);BW(g,'#7a7468',x+dx-10,y+h+2,36,2)};
BART.banco=(g,b,x,y,w,h,dx)=>{shadowB(g,x,y,w,h);const top=y+8;
 BW(g,'#d8d4cc',x-2,top,w+4,h-8);for(let j=0;j<h-8;j+=4)BW(g,'#c8c4bc',x-2,top+j,w+4,.5);
 // frontão triangular
 for(let r=0;r<12;r++){const ww=(w+8)*(r/12);BW(g,r<2?'#b8b4ac':'#e8e4dc',x+w/2-ww/2,y-4+r,ww,1)}BW(g,'#a8a49c',x-4,y+7,w+8,2);BW(g,'#f0ece4',x-4,y+7,w+8,.6);
 BW(g,'#2a5a3a',x+w/2-6,y+1,12,5);ptext(g,'$',x+w/2-1,y+1.5,'#ffd75e');
 BW(g,'#2a5a3a',x+4,top+5,w-8,8);ptext(g,'BANCO DO AGRO',x+w/2-ptw('BANCO DO AGRO')/2,top+6.5,'#ffd75e');
 for(const cx of[x+1,x+w-6,...(w>90?[x+w/3,x+w*2/3-4]:[])]){BW(g,'#f4f0e8',cx,top+15,5,h-26);BW(g,'#d0ccc4',cx+3.5,top+15,1.5,h-26);BW(g,'#e8e4dc',cx-1,top+14,7,2);BW(g,'#e8e4dc',cx-1,y+h-5,7,2)}
 stdWins(g,b,x,y,h,(g,a,c)=>winArch(g,a,c,'#f4f0e8'));doorGlass(g,x+dx,y+h-24);
 for(let i=0;i<3;i++)BW(g,i%2?'#c8c4bc':'#b8b4ac',x+dx-4-i*2,y+h+i*1.2,24+i*4,1.4);
 BW(g,'#3a3a42',x+w+1,y+h-20,6,14);BW(g,'#2a8a3a',x+w+2,y+h-19,4,2);BW(g,'#9ad8f5',x+w+2,y+h-16,4,3);BW(g,'#222',x+w+2,y+h-11,4,1);ptext(g,'24H',x+w,y+h-26,'#2a8a3a')};
BART.agro=(g,b,x,y,w,h,dx)=>{const rh=h-40;shadowB(g,x,y,w,h);
 sacks(g,x-16,y+h,6,'#e0d0a8');sacks(g,x+w+2,y+h,5,'#d8c8a0');BW(g,'#5a5a62',x+w+20,y+h-12,10,12);BW(g,'#7a7a82',x+w+20,y+h-12,10,1.5);for(let i=0;i<12;i+=2)BW(g,'#8a8a92',x+w+20,y+h-12+i,10,.4);
 BW(g,'#3a6aaa',x-14,y+h-14,8,10);BW(g,'#5a8aca',x-14,y+h-14,8,1.5);
 wallCal(g,x,y+rh,w,h-rh,'#ece2c4','#2a7a3a');roofMetal(g,x,y,w,rh,'#9aa3ab');
 BW(g,'#2a7a3a',x-2,y+rh-4,w+4,12);BW(g,'#3a9a4a',x-2,y+rh-4,w+4,1.5);signBoard(g,x+w/2,y+rh-1,'CASA AGRO','#f4f0d8','#2a6a2a','#1a4a1a');
 BW(g,'#2a7a3a',x-3,y+h-30,w+6,2);for(let i=0;i<w+6;i+=6)BW(g,i%12?'#f4f0e0':'#2a7a3a',x-3+i,y+h-28,6,4);
 stdWins(g,b,x,y,h,(g,a,c)=>{winGlass(g,a,c+2,'#f4f0e0');sacks(g,a+1,c+14,2,'#d8c8a0')});doorRoll(g,x+dx,y+h-24)};
BART.delegacia=(g,b,x,y,w,h,dx)=>{const rh=h-40;shadowB(g,x,y,w,h);
 wallCal(g,x,y+rh,w,h-rh,'#e8ecf0','#2a3a6a');roofClay(g,x,y,w,rh,'#8a4a32',true);
 BW(g,'#2a3a6a',x,y+rh+2,w,6);ptext(g,'POLICIA',x+w/2-ptw('POLICIA')/2,y+rh+3,'#f0f0f0');
 BW(g,'#ffd75e',x+w/2-3,y+rh+10,6,6);BW(g,'#2a3a6a',x+w/2-1.5,y+rh+11.5,3,3);
 stdWins(g,b,x,y,h,(g,a,c)=>winBars(g,a,c,'#f0f0f0'));doorWood(g,x+dx,y+h-24,'#2a3a6a');wallLamp(g,x+dx-4,y+h-26);wallLamp(g,x+dx+18,y+h-26);
 BW(g,'#c8c8c8',x+w+6,y-20,1.5,h+18);BW(g,'#888',x+w+5,y+h-3,4,3);
 // viatura
 const vx=x+w+12,vy=y+h+2;BW(g,'rgba(0,0,0,.3)',vx,vy-1,26,3);BW(g,'#f0f0f0',vx,vy-9,26,7);BW(g,'#1a1a1a',vx,vy-5,26,2);BW(g,'#f0f0f0',vx+5,vy-14,13,6);BW(g,'#7ab0d0',vx+7,vy-13,9,4);BW(g,'#222',vx+3,vy-3,5,5);BW(g,'#222',vx+18,vy-3,5,5);BW(g,'#888',vx+4.5,vy-1.5,2,2);BW(g,'#888',vx+19.5,vy-1.5,2,2);ptext(g,'POL',vx+6,vy-7,'#1a1a1a')};
BART.padaria=(g,b,x,y,w,h,dx)=>{const rh=h-40;shadowB(g,x,y,w,h);
 // forno a lenha ao lado
 BW(g,'#c8b8a0',x+w+1,y+h-16,14,16);for(let r=0;r<6;r++)BW(g,'#b5532e',x+w+1+r,y+h-22+r,14-r*2,1);BW(g,'#2a1a10',x+w+4,y+h-10,8,7);BW(g,'#ff8a2a',x+w+5,y+h-6,6,2);BW(g,'#8a6a42',x+w+3,y+h-2,4,2);
 wallCal(g,x,y+rh,w,h-rh,'#f6dcb0','#a8502a');roofClay(g,x,y,w,rh,'#c0602e',true);chimney(g,x+w-14,y,'#a8502a');
 signBoard(g,x+w/2,y+rh-9,'PADARIA','#fff4e0','#a8502a','#6a2a10');
 BW(g,'#c83a2a',x-3,y+h-32,w+6,2);for(let i=0;i<w+6;i+=6){BW(g,i%12?'#fff':'#c83a2a',x-3+i,y+h-30,6,5);BW(g,i%12?'#e8e0d0':'#a82a1a',x-3+i,y+h-25.5,6,1)}
 stdWins(g,b,x,y,h,(g,a,c)=>{BW(g,'#6a3a1a',a-1,c+2,15,13);BW(g,'#f8f0e0',a,c+3,13,11);for(let i=0;i<3;i++){BW(g,'#d8a050',a+1+i*4,c+6,3.4,2.4);BW(g,'#b8702a',a+1+i*4,c+6,3.4,.6);BW(g,'#e8c070',a+1+i*4,c+10,3.4,2.4)}BW(g,'#c8a070',a,c+9,13,.6)});
 doorWood(g,x+dx,y+h-24,'#8a4a2a');
 // mesinha com guarda-sol
 const tx=x-14;BW(g,'#5a3a22',tx+5,y+h-14,1.5,14);BW(g,'#e84a3a',tx-1,y+h-19,14,3);BW(g,'#fff',tx+3,y+h-19,4,3);BW(g,'#7a5232',tx,y+h-7,12,2);BW(g,'#5a3a22',tx+1,y+h-5,1,5);BW(g,'#5a3a22',tx+10,y+h-5,1,5)};
BART.vet=(g,b,x,y,w,h,dx)=>{const rh=h-38;shadowB(g,x,y,w,h);
 // tronco de contenção ao lado
 for(let i=0;i<3;i++)BW(g,'#7a7a82',x-16+i*6,y+h-14,1.6,14);BW(g,'#9a9aa2',x-16,y+h-14,14,1.4);BW(g,'#9a9aa2',x-16,y+h-8,14,1.4);
 wallCal(g,x,y+rh,w,h-rh,'#f6f8f8','#2a9a6a');roofMetal(g,x,y,w,rh,'#c8ccd0');
 BW(g,'#2a9a6a',x-2,y+rh-3,w+4,9);ptext(g,'CLINICA VETERINARIA',x+w/2-ptw('CLINICA VETERINARIA')/2,y+rh-.5,'#fff');
 BW(g,'#fff',x+w-13,y+rh+8,10,10);BW(g,'#2a9a5a',x+w-9,y+rh+9,2,8);BW(g,'#2a9a5a',x+w-12,y+rh+12,8,2);
 stdWins(g,b,x,y,h,(g,a,c)=>winGlass(g,a,c,'#e0e8e8'));doorGlass(g,x+dx,y+h-24)};
BART.canil=(g,b,x,y,w,h,dx)=>{const rh=h-38;shadowB(g,x,y,w,h);
 // casinhas e cerquinha
 for(let i=0;i<2;i++){const cx=x+w+2+i*13;BW(g,'#c89a5a',cx,y+h-9,11,9);for(let r=0;r<4;r++)BW(g,'#a83a2a',cx-1+r,y+h-13+r,13-r*2,1);BW(g,'#2a1a10',cx+3,y+h-6,5,6)}
 for(let i=0;i<6;i++)BW(g,'#f4f0e0',x-18+i*3,y+h-7,1.4,7);BW(g,'#f4f0e0',x-18,y+h-5,17,1);
 wallCal(g,x,y+rh,w,h-rh,'#f6d878','#c86a2a');roofClay(g,x,y,w,rh,'#8a5a2a',true);
 signBoard(g,x+w/2,y+rh-9,'PET SHOP','#fff4d8','#c86a2a','#6a3a10');
 for(let i=0;i<4;i++){const px=x+6+i*((w-12)/3),py=y+rh+14+(i%2)*3;BW(g,'#c86a2a',px,py,3,2.6);BW(g,'#c86a2a',px-1,py-2,1.4,1.4);BW(g,'#c86a2a',px+1,py-2.6,1.4,1.4);BW(g,'#c86a2a',px+3,py-2,1.4,1.4)}
 stdWins(g,b,x,y,h,(g,a,c)=>{winGlass(g,a,c,'#fff4d8');BW(g,'#e84a3a',a+2,c+8,3,1);BW(g,'#3a7ac8',a+7,c+8,3,1)});doorGlass(g,x+dx,y+h-24)};
BART.igreja=(g,b,x,y,w,h,dx)=>{shadowB(g,x,y,w,h);const tw=20,tx=x+w/2-tw/2;
 wallCal(g,x,y+14,w,h-14,'#f6f2ea','#d8c8a0');
 // frontão barroco e torre sineira
 for(let r=0;r<10;r++){const ww=w*(.35+.65*Math.sin((r/10)*Math.PI/2));BW(g,'#f6f2ea',x+w/2-ww/2,y+4+r,ww,1)}BW(g,'#d8c8a0',x-1,y+13,w+2,2);BW(g,'#c8b890',x+w/2-ww0(w)/2,y+3,ww0(w),1.5);
 BW(g,'#f6f2ea',tx,y-34,tw,40);BW(g,'#e0dad0',tx+tw-3,y-34,3,40);BW(g,'#d8c8a0',tx-1,y-35,tw+2,2);BW(g,'#d8c8a0',tx-1,y-14,tw+2,1.5);
 BW(g,'#3a3a3a',tx+5,y-30,10,12);BW(g,'#3a3a3a',tx+6,y-32,8,2);BW(g,'#c8a040',tx+7,y-27,6,6);BW(g,'#a8802a',tx+7,y-22,6,1);BW(g,'#5a4a2a',tx+9.5,y-30,1,4);
 for(let r=0;r<9;r++)BW(g,'#4a6a8a',tx+1+r*1.1,y-44+r,tw-2-r*2.2,1);BW(g,'#ffd75e',tx+tw/2-.5,y-54,1.6,11);BW(g,'#ffd75e',tx+tw/2-3.5,y-50,7.6,1.6);
 // rosácea, porta em arco e janelas em arco
 BW(g,'#c8a040',x+w/2-4,y+16,8,8);BW(g,'#3a6aaa',x+w/2-3,y+17,6,6);BW(g,'#e84a3a',x+w/2-1,y+19,2,2);BW(g,'#ffd75e',x+w/2-3,y+19.5,6,.6);BW(g,'#ffd75e',x+w/2-.3,y+17,.6,6);
 stdWins(g,b,x,y,h,(g,a,c)=>winArch(g,a,c,'#d8c8a0','#5a4a8a'));
 const ddx=x+dx;BW(g,'#d8c8a0',ddx-3,y+h-29,22,29);BW(g,'#d8c8a0',ddx-1,y+h-31,18,2);doorWood(g,ddx,y+h-24,'#2a6a5a',true);
 for(let i=0;i<3;i++)BW(g,i%2?'#d0ccc4':'#bab6ae',ddx-6-i*3,y+h+i*1.3,28+i*6,1.5)};
const ww0=w=>w*.35;
function villaHouse(col,shut,roof){return(g,b,x,y,w,h,dx,v)=>{const rh=h-34;shadowB(g,x,y,w,h);
 wallCal(g,x,y+rh,w,h-rh,col,shade(col,-30));roofClay(g,x,y,w,rh,roof,false);
 BW(g,'#f6f2ea',x-1,y+rh,2,h-rh);BW(g,'#f6f2ea',x+w-1,y+rh,2,h-rh);
 stdWins(g,b,x,y,h,(g,a,c)=>{winColonial(g,a,c,'#f6f2ea',shut);BW(g,'#f6f2ea',a-2,c-3,17,2)});
 doorWood(g,x+dx,y+h-24,shut,true);BW(g,'#f6f2ea',x+dx-2,y+h-27,20,2);
 homeYard(g,b,x,y,w,h,dx,v)}}
BART.h1=villaHouse('#f2d070','#2a6a4a','#b5532e');BART.h2=villaHouse('#a8c8e8','#2a4a8a','#a84a2a');BART.h3=villaHouse('#f0b8c8','#7a2a4a','#b85a30');BART.h4=villaHouse('#b8d8a8','#5a3a22','#b04e2c');
function cabin(sign,extra){return(g,b,x,y,w,h,dx)=>{const rh=h-36;shadowB(g,x,y,w,h);
 for(let i=0;i<4;i++){BW(g,'#7a5232',x-14,y+h-4-i*3,12,3);for(let j=0;j<3;j++)BW(g,'#c8a070',x-13+j*4,y+h-3.5-i*3,2,2)}
 wallLogs(g,x,y+rh,w,h-rh,'#7a4a28');roofShingle(g,x,y,w,rh,'#4a3020');chimney(g,x+8,y+2,'#7a7468');
 BW(g,'#5a3a22',x-3,y+h-30,w+6,2);for(const cx of[x-2,x+w-1])BW(g,'#6a4428',cx,y+h-30,3,30);
 stdWins(g,b,x,y,h,(g,a,c)=>{BW(g,'#3a2414',a-1,c-1,15,14);BW(g,'#2a3a4a',a,c,13,12);BW(g,'#e8b050',a+1,c+1,11,5);BW(g,'#3a2414',a+6,c,1,12)});
 doorWood(g,x+dx,y+h-24,'#5a3a22');signBoard(g,x+w/2,y+rh-9,sign,'#3a2414','#ffd75e','#1a0e06');
 // galhada sobre a porta
 const ax=x+dx+8,ay=y+h-31;BW(g,'#e8dcc0',ax-8,ay,16,1.4);BW(g,'#e8dcc0',ax-8,ay-4,1.4,4);BW(g,'#e8dcc0',ax+7,ay-4,1.4,4);BW(g,'#e8dcc0',ax-5,ay-3,1.2,3);BW(g,'#e8dcc0',ax+4,ay-3,1.2,3);BW(g,'#7a5a3a',ax-2,ay+1,4,3);
 if(extra)extra(g,b,x,y,w,h,dx)}}
BART.lodge=cabin('LOJA DO CACADOR',(g,b,x,y,w,h)=>{BW(g,'#a87a4a',x+w+2,y+h-22,12,14);for(let i=0;i<4;i++)BW(g,'#8a5a2a',x+w+3,y+h-21+i*3,10,1);BW(g,'#5a3a22',x+w+1,y+h-24,14,2)});
BART.posto=cabin('POSTO',(g,b,x,y,w,h)=>{BW(g,'#5a3a22',x+w+2,y+h-24,2,24);BW(g,'#5a3a22',x+w+2,y+h-24,14,2);BW(g,'#888',x+w+12,y+h-22,1,6);BW(g,'#aaa',x+w+11,y+h-16,3,2);BW(g,'#555',x+w+6,y+h-8,8,4);BW(g,'#888',x+w+7,y+h-10,6,2)});
BART.pescador=(g,b,x,y,w,h,dx)=>{const rh=h-36;shadowB(g,x,y,w,h);
 // deck, barco e redes
 BW(g,'#8a6a42',x-4,y+h-2,w+8,4);for(let i=0;i<w+8;i+=4)BW(g,'#6a4a2a',x-4+i,y+h-2,.6,4);for(const px of[x-3,x+w/2,x+w+2])BW(g,'#5a3a22',px,y+h+1,2,4);
 BW(g,'#7a4a2a',x-24,y+h-6,18,6);BW(g,'#5a3a22',x-24,y+h-6,18,1.4);BW(g,'#9a6a3a',x-22,y+h-4,14,1);BW(g,'#ddd',x-16,y+h-14,1,8);
 wallBoards(g,x,y+rh,w,h-rh,'#7ab0c0');roofMetal(g,x,y,w,rh,'#8a949c');
 signBoard(g,x+w/2,y+rh-9,'PESCA','#f4f0e0','#2a6a8a','#1a3a4a');
 stdWins(g,b,x,y,h,(g,a,c)=>winColonial(g,a,c,'#f4f0e0','#c86a2a'));doorWood(g,x+dx,y+h-24,'#c86a2a');
 for(let i=0;i<5;i++)for(let j=0;j<4;j++)BW(g,'rgba(240,240,230,.7)',x+w+3+i*2.4,y+h-26+j*2.4,.5,2.4);BW(g,'#5a3a22',x+w+2,y+h-28,13,1.4);
 BW(g,'#c8a050',x+w+6,y+h-14,2,8);BW(g,'#e84a3a',x+w+5,y+h-6,4,2)};
BART.acougue=(g,b,x,y,w,h,dx)=>{const rh=h-38;shadowB(g,x,y,w,h);
 wallTile(g,x,y+rh,w,h-rh);roofClay(g,x,y,w,rh,'#a84a2a',true);
 BW(g,'#a82a2a',x-3,y+h-32,w+6,2);for(let i=0;i<w+6;i+=6)BW(g,i%12?'#f4f0ec':'#a82a2a',x-3+i,y+h-30,6,4);
 signBoard(g,x+w/2,y+rh-9,'ACOUGUE DO TONHO','#f4f0ec','#a82a2a','#5a1010');
 stdWins(g,b,x,y,h,(g,a,c)=>{winGlass(g,a,c+2,'#d8dcdc');BW(g,'#a83a2a',a+2,c+8,9,3);BW(g,'#e86a6a',a+3,c+8.5,7,1)});
 BW(g,'#5a5a5a',x+dx-1,y+h-25,18,25);for(let i=0;i<16;i+=2)BW(g,i%4?'rgba(220,220,220,.8)':'rgba(180,200,220,.8)',x+dx+i,y+h-24,1.6,24);BW(g,'#8a8478',x+dx-2,y+h,20,2)};
BART.matadouro=(g,b,x,y,w,h,dx)=>{const rh=h-40;shadowB(g,x,y,w,h);
 BW(g,'#8a9098',x+w+2,y+h-16,12,10);BW(g,'#5a6068',x+w+3,y+h-15,10,8);for(let i=0;i<3;i++)BW(g,'#3a4048',x+w+4+i*3,y+h-14,2,6);BW(g,'#c8ccd0',x+w+2,y+h-6,12,1);
 for(let i=0;i<4;i++)BW(g,'#7a7a82',x-18+i*5,y+h-16,1.6,16);BW(g,'#9a9aa2',x-18,y+h-14,16,1.2);BW(g,'#9a9aa2',x-18,y+h-8,16,1.2);
 wallCal(g,x,y+rh,w,h-rh,'#e8ecee','#7a8a96');roofMetal(g,x,y,w,rh,'#a8b0b8');
 signBoard(g,x+w/2,y+rh-9,'MATADOURO','#f4f6f8','#3a4a5a','#1a2a3a');
 stdWins(g,b,x,y,h,(g,a,c)=>winBars(g,a,c,'#c8ccd0'));doorRoll(g,x+dx,y+h-24)};
// ---------- quintal das casas da vila (evolui com o tempo, ver g_life2)
function homeYard(g,b,x,y,w,h,dx,v){if(!v)return;
 if(v>=1){plantPot(g,x+dx-7,y+h,'#e84a5a');plantPot(g,x+dx+18,y+h,'#f0d040')}
 if(v>=2)winXs(b).forEach(wx=>flowerBox(g,x+wx-2,y+h-19,17));
 if(v>=3){BW(g,'#7a4a2a',x+w+1,y+h-6,10,6);for(let i=0;i<4;i++){BW(g,'#3a8a3a',x+w+2+i*2.4,y+h-9,2,3);BW(g,'#d84a3a',x+w+2.5+i*2.4,y+h-8,1,1)}BW(g,'#5a3a22',x-6,y+h-14,1,14);BW(g,'#5a3a22',x-16,y+h-14,1,14);BW(g,'#ddd',x-16,y+h-13,11,.4);BW(g,'#e84a5a',x-14,y+h-13,3,4);BW(g,'#4a8ad8',x-10,y+h-13,3,5)}
 if(v>=4){BW(g,'#2a2a2a',x+w+2,y+h-4,9,1);BW(g,'#2a2a2a',x+w+2,y+h-3,2.4,2.4);BW(g,'#2a2a2a',x+w+8.6,y+h-3,2.4,2.4);BW(g,'#c83a2a',x+w+4,y+h-6,4,1.4)}}
// ---------- cache e animações
function bVar(b){if(b.id==='house'){const L=LV();return L>=12?4:L>=8?3:L>=5?2:L>=3?1:0}if(b.id==='barn')return(S.up.silo>=1?1:0)+(S.up.land>=2?2:0);if(/^h[1-4]$/.test(b.id)&&typeof homeStage==='function')return homeStage(b.id);return 0}
function bCached(g,b){const v=bVar(b),key=b.id+'|'+b.x+','+b.y+'|'+v+'|'+PS;if(BCPS!==PS){BCACHE.clear();BCPS=PS}
 let c=BCACHE.get(key);const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,mx=40,mt=60,mb=20;
 if(!c){const cv=mkCanvas((w+mx*2)*PS,(h+mt+mb)*PS),cg=cv.getContext('2d'),rm=RMODE;RMODE=0;cg.setTransform(PS,0,0,PS,(-x+mx)*PS,(-y+mt)*PS);
  try{BART[b.id](cg,b,x,y,w,h,b.door*TS-x,v)}finally{RMODE=rm}c={cv};if(BCACHE.size>80)BCACHE.clear();BCACHE.set(key,c)}
 g.drawImage(c.cv,x-mx,y-mt,w+mx*2,h+mt+mb)}
function bLive(g,b){const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,id=b.id;
 if(id==='house')smoke(g,x+w-13,y+1);else if(id==='padaria')smoke(g,x+w-11,y-1);else if(id==='lodge'||id==='posto')smoke(g,x+11,y+1);
 else if(id==='delegacia'){const fx=x+w+7.5,fy=y-20;for(let i=0;i<8;i++){const wv=Math.sin(frame/10+i*.7)*1.2;Rr(g,'#2a9a3a',fx+i,fy+wv,1,7)}Rr(g,'#f0d040',fx+2,fy+2+Math.sin(frame/10+2)*1.2,4,3);Rr(g,'#2a4a9a',fx+3,fy+3+Math.sin(frame/10+2)*1.2,2,1.4);
  const n=S.t*24>=18||S.t*24<6;const vx=x+w+12;if(n&&((frame>>4)&1))Rr(g,'#ff3a3a',vx+8,y+h-14,3,2);else if(n)Rr(g,'#3a6aff',vx+15,y+h-14,3,2);else Rr(g,'#c83a3a',vx+8,y+h-14,10,1.6)}
 else if(id==='leilao'){['#d83a2a','#f0d040','#2a8a3a'].forEach((c,i)=>{const px=x+10+i*((w-20)/2);Rr(g,'#5a3a22',px,y-14,1,16);for(let k=0;k<6;k++)Rr(g,c,px+1+k,y-14+Math.sin(frame/9+k*.8+i)*1,1,5)})}
 else if(id==='barn'&&S.up.peao){Rr(g,'#ffd75e',x+b.door*TS-x+22,y+h-20,2,3)}
 else if(id==='igreja'&&S.day%7===0&&S.t*24>=8.5&&S.t*24<9.2){const sw=Math.sin(frame/6)*2;Rr(g,'#c8a040',x+w/2-3+sw,y-27,6,6)}
}
const _dbArtOld=drawBuildingArt;
drawBuildingArt=function(g,b){if(BART[b.id]&&BLD.includes(b)){bCached(g,b);return}if(BART[b.id]){BART[b.id](g,b,b.x*TS,b.y*TS,b.w*TS,b.h*TS,b.door*TS-b.x*TS,0);return}_dbArtOld(g,b)};
drawBuilding=function(g,b){drawBuildingArt(g,b);if(BART[b.id])bLive(g,b);else bldExtra(g,b)};
