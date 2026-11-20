// ===== Armas detalhadas: desenho realista de cada arma (no mundo, na mira, nos ícones e nos armeiros) =====
// Cada arma é desenhada deitada, coronha à esquerda (x=0) e cano à direita (x=len); y=0 é a linha do cano.
const GB={ // helpers de desenho em unidades do jogo
 r(c,col,x,y,w,h){c.fillStyle=col;c.fillRect(x,y,w,h)},
 p(c,col,pts){c.fillStyle=col;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fill()},
 l(c,col,pts,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.stroke()},
 o(c,col,x,y,r){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill()},
 clip(c,pts,fn){c.save();c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.clip();fn();c.restore()},
 grain(c,pts,x0,x1,y0,y1,col,col2,seed,tiger){GB.clip(c,pts,()=>{for(let i=0;i<14;i++){const yy=y0+(y1-y0)*(i/14)+Math.sin(i*1.7+seed)*.12;c.strokeStyle=i%3?col:col2;c.lineWidth=.07+(i%4===0?.05:0);c.beginPath();c.moveTo(x0,yy);for(let x=x0;x<=x1;x+=.5)c.lineTo(x,yy+Math.sin(x*.9+i*2.1+seed)*.09+Math.sin(x*.27+i)*.12);c.stroke()}
  if(tiger){c.strokeStyle='rgba(110,50,15,.38)';for(let x=x0;x<x1;x+=.6+Math.abs(Math.sin(x*3.1+seed))*.5){c.lineWidth=.1+Math.abs(Math.sin(x*7))*.12;c.beginPath();c.moveTo(x,y0);c.quadraticCurveTo(x+.35,(y0+y1)/2,x-.1,y1);c.stroke()}}
  // reflexo do verniz
  c.fillStyle='rgba(255,240,210,.16)';c.fillRect(x0,y0+(y1-y0)*.12,x1-x0,.18)})},
 check(c,x0,y0,w,h,col){c.fillStyle=col;for(let x=0;x<w;x+=.32)for(let y=((x/.32)%2)*.16;y<h;y+=.32)c.fillRect(x0+x,y0+y,.12,.12)},
 barrel(c,x0,x1,t0,t1,col,hi){GB.p(c,col,[[x0,-t0],[x1,-t1],[x1,t1],[x0,t0]]);GB.r(c,hi,x0,-t0*.62,x1-x0,.12);GB.r(c,shade(col,-30),x0,t0*.55,x1-x0,.1);GB.r(c,'#0a0a0c',x1-.12,-t1,.12,t1*2)},
 guard(c,x0,x1,y0,dep,col){GB.l(c,col,[[x0,y0],[x0+.1,y0+dep*.8],[x0+.5,y0+dep],[x1-.3,y0+dep],[x1,y0+dep*.4],[x1,y0]],.2)},
 trig(c,x,y0,col){GB.l(c,col,[[x,y0],[x-.05,y0+.4],[x-.22,y0+.75]],.22)},
 swivel(c,x,y,col){c.strokeStyle=col;c.lineWidth=.12;c.beginPath();c.arc(x,y+.28,.24,0,7);c.stroke()},
 scope(c,a,b,cy,rt,ro,re,col,hi){// a=ocular, b=objetiva
  const ob=b-1.5,ey=a+1.3;GB.p(c,col,[[a,cy-re],[ey,cy-rt],[ob,cy-rt],[b,cy-ro],[b,cy+ro],[ob,cy+rt],[ey,cy+rt],[a,cy+re]]);
  GB.r(c,hi,a+.2,cy-re*.7,b-a-.4,.14);GB.r(c,shade(col,-35),a+.2,cy+rt*.5,b-a-.4,.12);
  const m=(ey+ob)/2;GB.r(c,col,m-.45,cy-rt-.55,.9,.6);GB.r(c,hi,m-.45,cy-rt-.55,.9,.12);for(let i=0;i<4;i++)GB.r(c,shade(col,-40),m-.4+i*.24,cy-rt-.5,.08,.5);
  GB.r(c,shade(col,-20),m-.3,cy+rt-.05,.6,.35);GB.r(c,col,a,cy-re,.25,re*2);
  GB.r(c,'#4a7ab8',b-.1,cy-ro*.85,.12,ro*1.7);GB.r(c,'#cfe8ff',b-.08,cy-ro*.6,.08,.3);
  return m},
 rings(c,xs,cy,rt,col){xs.forEach(x=>{GB.r(c,col,x-.3,cy-rt-.08,.6,rt*2+.16);GB.r(c,col,x-.22,cy+rt,.44,-cy-rt-.55);GB.r(c,shade(col,25),x-.3,cy-rt-.08,.6,.12)})},
 sling(c,x0,y0,x1,y1,sag,col){c.strokeStyle=shade(col,-25);c.lineWidth=.42;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2,Math.max(y0,y1)+sag,x1,y1);c.stroke();c.strokeStyle=col;c.lineWidth=.3;c.stroke();c.strokeStyle=shade(col,25);c.lineWidth=.06;c.stroke()}
};
// coronha esportiva genérica: devolve o polígono
function stockPts(o){const f=o.f,mc=o.mc,sy=o.straight;return[[0,-.95],mc?[.9,-1.25]:[1.2,-.95],mc?[3.9,-1.2]:[3.9,-.85],[5.1,-.35],[6.1,-.3],[6.2,.38],[f-.4,.4],[f,.5],[f,1.05],[f-.5,1.2],[8.4,1.3],[7.2,1.35],sy?[6.2,1.25]:[6.55,1.3],sy?[5.4,1.45]:[6.05,2.5],sy?[5.4,1.45]:[5.45,2.6],sy?[5.4,1.45]:[5.05,2.35],[4.7,1.6],[3,2],[0,2.75]]}
const GUNM={
 r22:{len:14.5,draw(c){const W='#b07a42',WD='#7a4a22',S='#1e2024',H='#5a5e66';const st=[[0,-.85],[3.8,-.75],[5.1,-.3],[5.8,-.28],[5.8,.32],[11.8,.34],[12,.55],[11.9,1],[7.6,1.15],[6.6,1.2],[6.2,1.2],[5.7,2.3],[5,2.25],[4.7,1.45],[0,2.4]];
  GB.p(c,W,st);GB.grain(c,st,0,12,-.9,2.4,WD,shade(W,-25),1);GB.r(c,'#1a1a1a',-.35,-.85,.38,3.25);GB.check(c,5.0,-.1,.7,1.2,shade(W,-30));
  GB.barrel(c,8.6,14.5,.32,.28,S,H);GB.r(c,'#8a8e96',11.3,-.36,.35,1.2);GB.r(c,S,5.4,-.6,3.3,1.05);GB.r(c,H,5.4,-.6,3.3,.14);GB.r(c,'#0a0a0c',6.4,-.35,1.1,.3);GB.r(c,'#c8ccd2',7.2,-.05,.55,.22);
  GB.r(c,'#0e0e10',6.4,.45,1,.8);GB.r(c,'#2a2a2e',6.45,.5,.9,.1);GB.guard(c,6.7,7.9,.45,.95,S);GB.trig(c,7.2,.45,'#3a3a3e');GB.r(c,S,14.1,-.62,.18,.34);GB.o(c,'#e8d890',14.2,-.66,.1);GB.r(c,S,10.6,-.6,.35,.26);GB.swivel(c,1.6,2.15,'#888');GB.swivel(c,11.4,.95,'#888')}},
 shot12:{len:17,draw(c){const W='#6a3a1e',WD='#3a1e0e',S='#24262e',H='#666a78',SV='#c4c2b8';const st=[[0,-.9],[4,-.7],[5.3,-.25],[6,-.2],[6,1.05],[5.6,1.4],[5.3,2.4],[4.6,2.35],[4.4,1.5],[0,2.6]];
  GB.p(c,W,st);GB.grain(c,st,0,6,-.9,2.6,WD,shade(W,-20),2);GB.r(c,'#2a1a10',-.35,-.9,.38,3.5);GB.check(c,4.6,0,.9,1.2,shade(W,-30));
  GB.p(c,SV,[[5.9,-.85],[8.4,-.85],[8.4,1.1],[7.4,1.15],[6.3,1.25],[5.9,1]]);for(let i=0;i<18;i++){const a=i*.9;c.strokeStyle='rgba(60,60,60,.55)';c.lineWidth=.06;c.beginPath();c.arc(6.6+(i%5)*.38,-.3+Math.floor(i/5)*.38,.16,a,a+3.5);c.stroke()}
  GB.r(c,'#8a8880',5.9,-.85,2.5,.14);GB.r(c,S,6.1,-1.05,.9,.25);GB.o(c,'#8a8880',8.1,.75,.16);
  GB.barrel(c,8.4,17,.42,.38,S,H);c.save();c.translate(0,.82);GB.barrel(c,8.4,17,.42,.38,S,H);c.restore();GB.r(c,'#0a0a0c',8.4,.38,8.6,.08);GB.r(c,'#3a3a44',8.4,-.6,8.6,.14);GB.o(c,'#f4f4f0',16.8,-.62,.14);
  const fe=[[8.3,1.15],[12.2,1.15],[12.4,1.55],[12,1.85],[8.6,1.85],[8.3,1.6]];GB.p(c,W,fe);GB.grain(c,fe,8.3,12.4,1.1,1.9,WD,shade(W,-20),5);GB.check(c,9.2,1.3,2.4,.4,shade(W,-30));
  GB.guard(c,6.5,7.7,1.15,.8,SV);GB.trig(c,6.95,1.15,'#3a3a3e');GB.trig(c,7.3,1.15,'#3a3a3e')}},
 r308:{len:16,draw(c){const W='#7a4520',WD='#4a2410',S='#22242a',H='#5a5e68';const st=stockPts({f:12.6});
  GB.sling(c,1.7,2.55,12,1.25,1.6,'#6a3a1a');GB.p(c,W,st);GB.grain(c,st,0,12.6,-1,2.8,WD,shade(W,-22),3);GB.r(c,'#1a1a1a',-.4,-.95,.42,3.7);GB.check(c,5.2,-.05,.9,1.3,shade(W,-30));GB.check(c,8.6,.55,2.4,.5,shade(W,-30));
  GB.barrel(c,9,16,.42,.3,S,H);GB.r(c,S,5.7,-.68,.6,.95);GB.r(c,S,6.2,-.78,3,1.18);GB.r(c,H,6.2,-.78,3,.15);GB.r(c,'#0a0a0c',7.2,-.55,1.3,.3);GB.r(c,'#9aa0a8',7.3,-.5,1.1,.2);
  GB.l(c,S,[[8.6,-.1],[8.4,.5],[8.1,1.1]],.26);GB.o(c,S,8.05,1.2,.32);GB.o(c,H,7.95,1.1,.1);GB.r(c,S,7.4,1.15,1.6,.4);
  GB.guard(c,6.6,7.9,1.2,.85,S);GB.trig(c,7.2,1.2,'#3a3a3e');GB.p(c,S,[[15.2,-.3],[15.6,-.3],[15.6,-.75],[15.4,-.75]]);GB.o(c,'#e0c070',15.5,-.78,.1);GB.r(c,S,11,-.7,.55,.4);GB.r(c,'#e8e8e8',11.2,-.66,.12,.12);
  GB.swivel(c,1.7,2.3,'#9a9a9a');GB.swivel(c,12,1,'#9a9a9a')}},
 r3006:{len:16.5,draw(c){const W='#8a4a1e',WD='#4a2410',S='#1e2026',H='#5a5e68';const st=stockPts({f:12.8,mc:1});
  GB.p(c,W,st);GB.grain(c,st,0,12.8,-1.3,2.8,WD,shade(W,-25),4);GB.p(c,shade(W,-12),[[1.3,-1],[3.6,-1],[4,-.5],[3.6,.4],[1.3,.4]]);GB.r(c,'#1a1a1a',-.4,-.95,.42,3.7);GB.r(c,'#e8e8e8',-.02,-.95,.06,3.7);
  GB.check(c,5.2,-.05,.9,1.3,shade(W,-32));GB.check(c,8.6,.55,2.6,.5,shade(W,-32));GB.r(c,'#1a1210',12.3,.4,.5,.8);
  GB.barrel(c,9,16.5,.42,.3,S,H);GB.r(c,S,5.7,-.68,.6,.95);GB.r(c,S,6.2,-.78,3,1.18);GB.r(c,H,6.2,-.78,3,.15);
  GB.l(c,S,[[8.6,-.1],[8.4,.5],[8.1,1.1]],.26);GB.o(c,S,8.05,1.2,.32);GB.guard(c,6.6,7.9,1.2,.85,S);GB.trig(c,7.2,1.2,'#3a3a3e');GB.r(c,S,7.4,1.15,1.6,.4);
  GB.rings(c,[6.7,8.9],-1.85,.46,'#17181c');GB.scope(c,4.8,11.2,-1.85,.46,.82,.6,'#1a1b20','#4a4e58');GB.r(c,'#c8a040',10.1,-2.25,.12,.8);
  GB.swivel(c,1.7,2.3,'#9a9a9a');GB.swivel(c,12.2,1,'#9a9a9a')}},
 mag300:{len:18,draw(c){const B='#2a2c2e',BD='#16181a',SS='#a8acb2',SH='#e0e4e8';const st=stockPts({f:13.2,mc:1});
  GB.p(c,B,st);GB.clip(c,st,()=>{for(let i=0;i<260;i++){const r=hsh(i*17);c.fillStyle=i%2?'#36383c':'#202224';c.fillRect((r%1400)/100,((r>>11)%420)/100-1.3,.12,.12)}});GB.r(c,'#111',-.45,-.95,.48,3.7);
  GB.p(c,BD,[[5.3,-.1],[6,-.1],[6,1.2],[5.6,2.2],[5.3,1.4]]);GB.r(c,'#3a3c40',8.6,.6,3.2,.4);
  // bipé dobrado
  GB.r(c,'#1a1a1c',12.6,1.1,.5,.4);GB.r(c,'#2a2a2e',9.4,1.4,3.4,.22);GB.r(c,'#2a2a2e',9.4,1.66,3.4,.22);GB.r(c,'#4a4a50',9.4,1.4,.25,.48);
  GB.barrel(c,9.2,17,.5,.36,SS,SH);for(let i=0;i<5;i++)GB.r(c,'#6a6e74',10.5+i*1.2,-.12,.9,.1);
  GB.r(c,'#3a3c40',17,-.48,1,.96);for(let i=0;i<3;i++)GB.r(c,'#0a0a0c',17.2+i*.27,-.3,.12,.6);GB.r(c,'#6a6e74',17,-.48,1,.12);
  GB.r(c,'#1a1a1c',5.7,-.7,.6,.95);GB.r(c,SS,6.2,-.8,3.1,1.2);GB.r(c,SH,6.2,-.8,3.1,.15);GB.r(c,'#2a2a2e',7.2,-.55,1.3,.3);
  GB.l(c,'#3a3c40',[[8.7,-.1],[8.5,.5],[8.2,1.1]],.26);GB.o(c,'#1a1a1c',8.15,1.22,.36);GB.guard(c,6.6,7.9,1.2,.85,'#1a1a1c');GB.trig(c,7.2,1.2,'#c8a030');
  GB.rings(c,[6.6,9.2],-2.05,.5,'#111214');const m=GB.scope(c,4.5,12.2,-2.05,.5,1.05,.65,'#121316','#40444c');GB.o(c,'#1a1b1e',m+.2,-2.05,.42);GB.o(c,'#2a2c30',m+.2,-2.05,.24);GB.r(c,'#d83a2a',m-.15,-2.75,.3,.1);
  GB.swivel(c,1.7,2.3,'#666');GB.swivel(c,12.8,1,'#666')}},
 // ---------- armas históricas
 betsy:{len:21,draw(c){const W='#c47a38',WD='#6a3414',S='#3a3028',H='#6a5e52',BR='#d8b040';const st=[[0,-1.2],[.6,-1.05],[4.2,-.75],[5.6,-.3],[6.4,-.32],[6.4,.32],[19.8,.38],[19.9,.95],[8.6,1.05],[7.2,1.15],[6,1.3],[5.4,1.5],[3.5,2.2],[.5,3.1],[0,3.1]];
  GB.p(c,W,st);GB.grain(c,st,0,20,-1.3,3.2,WD,'#8a4a1a',6,1);
  GB.p(c,BR,[[-.25,-1.25],[.15,-1.2],[.35,0],[.2,2],[.35,3.15],[-.2,3.2],[-.35,1]]);GB.p(c,BR,[[.8,.0],[3.2,.25],[3.2,1.45],[.8,1.85]]);GB.r(c,shade(BR,-30),1,.5,2,.08);GB.r(c,shade(BR,-30),1,.95,2,.08);GB.o(c,shade(BR,-30),2.9,.85,.12);
  GB.barrel(c,7.6,21,.42,.36,S,H);GB.r(c,'#2a2018',7.6,-.08,13.4,.08);GB.r(c,'#8a6a40',8.4,.55,11.4,.18);for(const x of [10.5,14.5,18.5])GB.r(c,BR,x,.5,.7,.4);GB.r(c,BR,19.6,.4,.25,.65);
  // fecho de pederneira
  GB.p(c,'#4a4440',[[6.2,-.1],[8.6,-.1],[8.8,.3],[8.4,.7],[6.2,.7]]);GB.r(c,'#7a746c',6.2,-.1,2.6,.1);GB.l(c,'#2a2624',[[6.5,.3],[6.4,-.4],[6.8,-.9],[7.2,-.85]],.28);GB.r(c,'#c8c0a8',6.9,-1.1,.5,.32);GB.r(c,'#2a2624',6.85,-1.25,.6,.18);
  GB.l(c,'#3a3634',[[7.9,.0],[7.9,-.85],[7.6,-1.05]],.22);GB.r(c,'#5a5450',7.75,-.05,.5,.18);
  GB.l(c,BR,[[6.9,1.05],[6.9,1.7],[7.4,2],[8.6,1.9],[9.2,1.15]],.2);GB.l(c,BR,[[6.9,1.7],[6.2,1.95]],.2);GB.trig(c,7.6,1.05,'#3a3634');GB.trig(c,7.95,1.05,'#3a3634');
  GB.r(c,BR,20.4,-.62,.25,.3);GB.r(c,S,12.5,-.55,.4,.2)}},
 lucretia:{len:19,draw(c){const W='#6a3a1c',WD='#3a1e0e',S='#2a2c32',H='#5a606c',CH='#6a7080';const st=[[0,-.95],[4,-.75],[5.4,-.3],[6.2,-.3],[6.2,.4],[15.8,.42],[15.9,.95],[8.6,1.1],[7.2,1.2],[6,1.3],[5.3,1.55],[3,2.1],[0,2.8]];
  GB.sling(c,1.8,2.5,14.8,1.05,1.8,'#7a5a3a');GB.p(c,W,st);GB.grain(c,st,0,16,-1,2.9,WD,shade(W,-18),7);GB.r(c,S,-.35,-.95,.38,3.75);
  GB.barrel(c,8.6,19,.42,.34,S,H);GB.r(c,'#8a6a40',9,.5,9.4,.16);
  // bloco de culatra "trapdoor"
  GB.p(c,CH,[[7.6,-.42],[9.8,-.42],[9.8,-.98],[8.2,-1.1],[7.6,-.8]]);GB.r(c,'#8aa0b8',8,-1,1.2,.15);GB.o(c,'#3a3c44',9.6,-.7,.16);GB.r(c,'#9a7a4a',7.9,-.95,.5,.2);
  GB.p(c,CH,[[5.8,-.15],[8.2,-.15],[8.2,.65],[5.8,.65]]);GB.l(c,'#2a2c32',[[6.1,.3],[5.9,-.5],[6.3,-.95],[6.7,-.9]],.3);
  for(const x of [11,13.5,15.6])GB.r(c,'#b8bcc4',x,-.48,.4,1.45);GB.guard(c,6.6,8,1.15,.85,S);GB.trig(c,7.2,1.15,'#3a3a3e');
  GB.r(c,S,10,-.85,1.3,.45);GB.r(c,S,10.1,-1.3,.25,.5);GB.r(c,S,18.6,-.64,.2,.3);GB.swivel(c,1.8,2.2,'#9a9a9a');GB.swivel(c,14.8,.95,'#9a9a9a')}},
 oakley:{len:14.5,draw(c){const W='#7a4422',WD='#3a1e0c',S='#1e2030',H='#4a5070',GD='#e0b84a';const st=[[0,-.9],[3.6,-.7],[4.8,-.35],[5.4,-.3],[5.4,1.05],[5.1,1.3],[3,1.7],[0,2.45]];
  GB.p(c,W,st);GB.grain(c,st,0,5.5,-1,2.5,WD,'#a8602a',8,0);GB.p(c,'#3a3a44',[[-.3,-.95],[.1,-.9],[.25,.6],[.1,2.45],[-.3,2.5],[-.15,.8]]);GB.o(c,GD,2.2,.5,.18);
  // receptor com têmpera colorida e gravação a ouro
  GB.p(c,'#6a6070',[[5.3,-.65],[8.1,-.65],[8.3,-.2],[8.3,.85],[5.3,1.0]]);GB.clip(c,[[5.3,-.65],[8.1,-.65],[8.3,-.2],[8.3,.85],[5.3,1.0]],()=>{for(let i=0;i<40;i++){const r=hsh(i*31+5);c.fillStyle=['rgba(90,110,200,.55)','rgba(200,150,60,.5)','rgba(150,80,160,.45)'][i%3];c.fillRect(5.3+(r%300)/100,-.65+((r>>9)%170)/100,.35,.22)}
   c.strokeStyle=GD;c.lineWidth=.06;for(let i=0;i<6;i++){c.beginPath();c.arc(5.9+i*.42,.15+(i%2)*.3,.2,i,i+4);c.stroke()}});
  GB.l(c,'#2a2a34',[[5.6,-.4],[5.5,-.95],[5.9,-1.05]],.24);GB.l(c,S,[[5.6,1],[5.8,1.7],[6.8,1.8],[7.6,1.3],[8,.9]],.22);GB.trig(c,6.6,.95,GD);
  GB.p(c,S,[[8.3,-.4],[14.5,-.3],[14.5,.3],[8.3,.4]]);GB.r(c,H,8.3,-.32,6.2,.1);GB.r(c,'#0e0e18',8.3,.0,6.2,.06);
  GB.r(c,'#2a2c3c',8.3,.42,5.6,.42);GB.r(c,H,8.3,.46,5.6,.08);const fe=[[8.3,.4],[11.4,.42],[11.4,.95],[8.3,1.0]];GB.p(c,W,fe);GB.grain(c,fe,8.3,11.4,.4,1,WD,'#a8602a',9,0);GB.r(c,'#b8bcc8',13.4,.4,.35,.5);
  GB.o(c,GD,14.3,-.45,.12);GB.r(c,S,10.6,-.55,.4,.25)}},
 corbett:{len:16,draw(c){const W='#5a3418',WD='#2a1608',S='#1a1c24',H='#4a5060';const st=stockPts({f:12.2,straight:0});
  GB.p(c,W,st);GB.grain(c,st,0,12.2,-1,2.8,WD,shade(W,-15),10);GB.r(c,'#1a1210',-.38,-.95,.4,3.7);GB.check(c,5.1,-.1,1,1.35,shade(W,-25));GB.check(c,8.4,.55,2.7,.5,shade(W,-25));GB.p(c,'#0e0a08',[[11.6,.4],[12.2,.5],[12.2,1.05],[11.6,1.15]]);
  GB.barrel(c,9,16,.4,.3,S,H);GB.r(c,S,5.7,-.66,.6,.92);GB.r(c,S,6.2,-.76,3,1.15);GB.r(c,H,6.2,-.76,3,.14);GB.r(c,'#d8b040',6.6,-.15,.9,.12);
  GB.l(c,S,[[8.6,-.1],[8.5,.4],[8.3,.9]],.24);GB.p(c,S,[[8.1,.85],[8.6,.95],[8.4,1.45],[7.95,1.3]]);GB.guard(c,6.6,7.9,1.2,.85,S);GB.trig(c,7.2,1.2,'#3a3a3e');
  for(let i=0;i<3;i++)GB.r(c,S,10.6+i*.3,-.78+(i?.15:0),.18,.4-(i?.15:0));GB.r(c,'#f4f0e8',10.62,-.72,.1,.1);GB.p(c,S,[[15.2,-.3],[15.7,-.3],[15.7,-.8],[15.35,-.8]]);GB.o(c,'#f4f4f0',15.55,-.85,.1);
  GB.swivel(c,1.7,2.3,'#9a9a9a');GB.swivel(c,11.8,1,'#9a9a9a')}},
 roosevelt:{len:16,draw(c){const W='#7a4a22',WD='#3a200c',S='#1c1e26',H='#4a505e';const st=[[0,-.95],[3.8,-.75],[5,-.35],[5.6,-.32],[5.6,1.2],[5.2,1.45],[3,1.9],[0,2.6]];
  GB.p(c,W,st);GB.grain(c,st,0,5.7,-1,2.7,WD,shade(W,-18),11);GB.r(c,'#2a2a2e',-.38,-.95,.4,3.6);
  GB.p(c,S,[[5.5,-.85],[9.3,-.85],[9.3,1.25],[8,1.25],[8,2.25],[9.3,2.25],[9.3,1.25],[5.5,1.25]]);GB.p(c,S,[[8,1.2],[9.3,1.2],[9.3,2.3],[8.1,2.3]]);GB.r(c,H,5.5,-.85,3.8,.14);GB.r(c,H,8.05,1.25,.12,1);
  GB.r(c,'#0a0a0e',6.4,-.6,1.4,.3);GB.l(c,'#2a2c34',[[5.8,-.5],[5.7,-1.05],[6.1,-1.15]],.24);GB.l(c,S,[[5.7,1.2],[5.8,1.95],[6.9,2.1],[7.8,1.6],[8,1.3]],.24);GB.trig(c,6.6,1.2,'#3a3a3e');
  GB.p(c,S,[[9.3,-.42],[16,-.32],[16,.32],[9.3,.42]]);GB.r(c,H,9.3,-.34,6.7,.12);GB.r(c,'#0e0e14',9.3,.0,3.4,.06);
  const fe=[[9.2,.42],[12.6,.42],[12.9,.75],[12.6,1.05],[9.2,1.1]];GB.p(c,W,fe);GB.grain(c,fe,9.2,13,.4,1.1,WD,shade(W,-18),12);
  GB.r(c,S,11.6,-.78,1.1,.42);GB.r(c,S,11.7,-1.3,.2,.55);GB.p(c,S,[[15.3,-.3],[15.8,-.3],[15.8,-.8],[15.5,-.8]]);GB.o(c,'#e8d070',15.65,-.82,.1);GB.swivel(c,1.6,2.25,'#8a8a8a')}},
 lampiao:{len:15.5,draw(c){const W='#4a2a14',WD='#24120a',S='#1e2026',H='#4a4e58',BR='#e0c060';const st=[[0,-.85],[3.8,-.7],[5,-.3],[6,-.3],[6,.38],[14,.4],[14,1.0],[8.4,1.12],[7.2,1.2],[6.2,1.25],[5.6,1.45],[3,2.0],[0,2.6]];
  GB.sling(c,1.8,2.4,12.8,1.1,1.9,'#8a5a2a');for(let i=0;i<6;i++){const t=(i+1)/7,sx=1.8+(12.8-1.8)*t,sy=2.4+(1.1-2.4)*t+1.9*4*t*(1-t)*.5;GB.o(c,BR,sx,sy,.16)}
  GB.p(c,W,st);GB.grain(c,st,0,14,-.9,2.7,WD,shade(W,-15),13);GB.r(c,'#2a2a2e',-.35,-.85,.38,3.5);
  GB.p(c,W,[[9,-.42],[13.6,-.38],[13.6,-.05],[9,-.05]]);GB.barrel(c,8.6,15.5,.36,.3,S,H);GB.p(c,W,[[9,-.48],[13.6,-.44],[13.6,-.1],[9,-.1]]);GB.r(c,shade(W,15),9,-.48,4.6,.1);
  // tachas de metal amarelo do cangaço
  const tk=[[1,.2],[1.8,-.2],[1.8,.6],[2.6,.2],[1.8,1.4],[1,1.0],[2.6,1.0],[3.4,.6],[3.4,1.4],[4.2,.9],[10,.7],[11,.7],[12,.7],[10.5,-.27],[11.5,-.27],[12.5,-.27]];tk.forEach(([x,y])=>{GB.o(c,BR,x,y,.17);GB.o(c,'#fff4c0',x-.05,y-.05,.05)});
  GB.r(c,S,5.7,-.62,.4,.9);GB.r(c,S,6.1,-.72,2.9,1.1);GB.r(c,H,6.1,-.72,2.9,.14);GB.l(c,S,[[8.6,-.1],[9.0,.6]],.24);GB.o(c,S,9.05,.75,.32);
  for(const x of [10,13.6])GB.r(c,'#9aa0a8',x,-.56,.32,1.62);GB.guard(c,6.6,7.9,1.15,.8,S);GB.trig(c,7.2,1.15,'#3a3a3e');GB.r(c,S,14.9,-.75,.3,.45);GB.r(c,S,9.4,-.78,.6,.3);
  GB.r(c,'#c83a2a',.6,2.3,.25,.7);GB.r(c,'#c83a2a',.95,2.3,.25,.55)}},
 bow:{len:13,bow:1,draw(c){// arco composto em pé: empunhadura em x=0
  const R='#2a2c22',RC='#4a5a32',L='#3a4a2a',CM='#7a7e84';
  GB.l(c,L,[[.2,-3],[-.6,-4.8],[-1.8,-6]],.62);GB.l(c,L,[[.2,3],[-.6,4.8],[-1.8,6]],.62);GB.l(c,shade(L,20),[[.1,-3.1],[-.7,-4.9],[-1.8,-6.05]],.12);GB.l(c,shade(L,20),[[.1,3.1],[-.7,4.9],[-1.8,6.05]],.12);
  [[-.4,-4.3],[-1,-5.2],[-.4,4.3],[-1,5.2]].forEach(([a,b],i)=>GB.o(c,i%2?'#6a6a3a':'#2a3a1a',a,b,.2));
  GB.p(c,R,[[-.2,-3.4],[.6,-3.4],[.9,-1.4],[.5,-.6],[.6,.9],[.9,1.6],[.6,3.4],[-.2,3.4],[-.5,1.2],[-.4,-1.2]]);GB.clip(c,[[-.2,-3.4],[.6,-3.4],[.9,-1.4],[.5,-.6],[.6,.9],[.9,1.6],[.6,3.4],[-.2,3.4],[-.5,1.2],[-.4,-1.2]],()=>{for(let i=0;i<20;i++){const r=hsh(i*7);c.fillStyle=i%2?RC:'#1a1c14';c.fillRect(-.5+(r%140)/100,-3.4+((r>>8)%680)/100,.5,.4)}});
  GB.o(c,'#0e0e0a',.25,-2.4,.28);GB.o(c,'#0e0e0a',.25,2.4,.28);GB.r(c,'#5a3a22',-.45,-.5,.8,1.4);for(let i=0;i<5;i++)GB.r(c,'#3a2414',-.45,-.4+i*.28,.8,.08);
  GB.o(c,CM,-1.9,-6.2,.75);GB.o(c,CM,-1.9,6.2,.75);GB.o(c,'#3a3c40',-1.9,-6.2,.35);GB.o(c,'#3a3c40',-1.9,6.2,.35);GB.o(c,'#b8bcc2',-2.1,-6.4,.15);GB.o(c,'#b8bcc2',-2.1,6,.15);
  GB.l(c,'#1a1a1a',[[-1.6,-5.6],[-.8,0],[-1.6,5.6]],.08);
  GB.r(c,'#1a1a1c',.7,-1.9,1.2,.9);GB.o(c,'#3cd03c',1.3,-1.7,.12);GB.o(c,'#f0d020',1.3,-1.45,.12);GB.o(c,'#e83a2a',1.3,-1.2,.12);
  GB.r(c,'#1a1a1c',.6,.75,4.4,.28);GB.r(c,'#3a3a3a',4.8,.6,.6,.58);GB.r(c,'#c0c0c0',.6,-.45,.5,.2)}}
};
// ---------- sprites em cache (resolução da tela)
const GSPR={};
function gunSpr(k,ps){ps=Math.max(4,Math.min(10,Math.round(ps||PS)));const key=k+'|'+ps;if(GSPR[key])return GSPR[key];const M=GUNM[k];if(!M)return null;
 const bow=M.bow,uw=bow?6:M.len+2,uh=bow?14:10,ox=bow?3:1,oy=bow?7:5,cv=mkCanvas(Math.ceil(uw*ps),Math.ceil(uh*ps)),c=cv.getContext('2d');
 c.setTransform(ps,0,0,ps,ox*ps,oy*ps);try{M.draw(c)}catch(e){}
 const sl=mkCanvas(cv.width,cv.height),s=sl.getContext('2d');s.drawImage(cv,0,0);s.globalCompositeOperation='source-in';s.fillStyle='rgba(22,12,6,.85)';s.fillRect(0,0,sl.width,sl.height);
 return GSPR[key]={cv,sl,uw,uh,ox,oy,len:M.len,bow}}
function blitGun(g,sp){if(RMODE===4){g.drawImage(sp.sl,-sp.ox-OLT,-sp.oy,sp.uw,sp.uh);g.drawImage(sp.sl,-sp.ox+OLT,-sp.oy,sp.uw,sp.uh);g.drawImage(sp.sl,-sp.ox,-sp.oy-OLT,sp.uw,sp.uh);g.drawImage(sp.sl,-sp.ox,-sp.oy+OLT,sp.uw,sp.uh);return}g.drawImage(sp.cv,-sp.ox,-sp.oy,sp.uw,sp.uh)}
function gunAt(g,k,bx,by,ang,sc,flip){if(RMODE&&RMODE!==1&&RMODE!==4)return;const sp=gunSpr(k);if(!sp)return;g.save();g.imageSmoothingEnabled=false;g.translate(bx,by);g.rotate(ang);if(sc&&sc!==1)g.scale(sc,sc);if(flip)g.scale(1,-1);blitGun(g,sp);g.restore()}
// ---------- desenho na mão do jogador
const _dgOld=drawGun;
drawGun=function(g,x,y,k){if(!GUNM[k])return _dgOld(g,x,y,k);if(RMODE&&RMODE!==1&&RMODE!==4)return;const M=GUNM[k];
 if(P.aim){const a=AIM.ang,ca=Math.cos(a),flip=ca<0,by=y-9,kick=AIM.kick||0;
  if(M.bow){g.save();g.imageSmoothingEnabled=false;g.translate(x,by);g.rotate(a);if(flip)g.scale(1,-1);const sp=gunSpr(k);
   g.save();g.translate(8.2,0);blitGun(g,sp);g.restore();
   if(RMODE!==4){const nk=AIM.relT>0?6.4:.8;g.strokeStyle='#e8e4d8';g.lineWidth=.16;g.beginPath();g.moveTo(8.2-1.9,-6.2);g.lineTo(nk,0);g.lineTo(8.2-1.9,6.2);g.stroke();
    if(AIM.relT<=0){g.fillStyle='#1a1a1c';g.fillRect(.8,-.12,10.8,.24);g.fillStyle='#b8bcc2';g.beginPath();g.moveTo(11.6,-.45);g.lineTo(12.8,0);g.lineTo(11.6,.45);g.fill();g.fillStyle='#e83a2a';g.fillRect(1,-.5,1.4,.38);g.fillStyle='#f4f4f0';g.fillRect(1,.12,1.4,.38);g.fillStyle='#e8c040';g.fillRect(.7,-.18,.3,.36)}}
   g.restore();return}
  gunAt(g,k,x-ca*(2+kick*2),by-Math.sin(a)*(2+kick*2),a,1,flip);return}
 const d=P.dir===2?-1:1;
 if(M.bow){if(P.dir===1)gunAt(g,k,x-.5,y-11,.25,.85,0);else gunAt(g,k,x+(P.dir>=2?-d*2.6:3.2),y-11,P.dir>=2?-d*.25:.12,.85,0);return}
 if(P.dir===0)gunAt(g,k,x-3.4,y-3.8,-1.12,1,0);
 else if(P.dir===1)gunAt(g,k,x+3.6,y-4.2,-2.05,1,1);
 else gunAt(g,k,x+d*1.6,y-3.2,d>0?-2.05:-1.09,1,d>0)};
// ---------- ícones (lojas, inventário, barra rápida)
const GICO={};
function gunIco(k){if(GICO[k])return GICO[k];const sp=gunSpr(k,8);if(!sp)return null;return GICO[k]=sp.cv.toDataURL()}
const _wIcOld=wIcon;
wIcon=function(k,small){const M=GUNM[k];if(!M)return _wIcOld(k,small);const src=gunIco(k);if(!src)return _wIcOld(k,small);const sp=gunSpr(k,8);
 const sc=small?(M.bow?2.4:2.1):(M.bow?7:7.4),w=Math.round(sp.uw*sc),h=Math.round(sp.uh*sc);
 const img='<img src="'+src+'" width="'+w+'" height="'+h+'" style="vertical-align:middle;max-width:100%;height:auto;'+(small?'':'filter:drop-shadow(2px 2px 0 rgba(0,0,0,.45));')+'" alt="">';
 return small?img:'<span style="display:block;width:100%;box-sizing:border-box;text-align:center;background:linear-gradient(#3a2a1c,#2a1c12);border-radius:6px;padding:2px 0;margin:2px 0 4px">'+img+'</span>'};
// ---------- armeiros e paredes com armas (dentro de casa / pousada)
function gunFurn(g,x,y,W,H,kind){const ks=kind==='rack'?ownedW().slice(0,4):ownedW().concat(['r22','shot12','r308']).filter((k,i,a)=>a.indexOf(k)===i).slice(0,4);
 ks.forEach((k,i)=>{const M=GUNM[k];if(!M)return;if(kind==='rack'){const sc=Math.min(.9,(H+8)/M.len);gunAt(g,k,x+3.5+i*(W-5)/Math.max(1,ks.length),y+H-1,-Math.PI/2+.08,sc,0)}
  else{const sc=Math.min(.95,(W-4)/M.len);gunAt(g,k,x+2,y-10+i*5.5,0,sc,0)}})}
