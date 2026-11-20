// ===== Arte detalhada dos animais: bichos da mata redesenhados, sombreamento de volume no gado, cavalos e cães =====
// ---------- sombreamento de volume (luz de cima, barriga e pernas mais escuras, brilho no ombro e na anca, textura de pelo)
function shadeSprite(cv,o){const g=cv.getContext('2d'),W=cv.width,H=cv.height;g.save();g.globalCompositeOperation='source-atop';
 const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(255,255,255,'+(o.top||.16)+')');gr.addColorStop(o.mid||.4,'rgba(255,255,255,0)');gr.addColorStop((o.mid||.4)+.18,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,'+(o.bot||.26)+')');g.fillStyle=gr;g.fillRect(0,0,W,H);
 (o.hi||[]).forEach(h=>{const rg=g.createRadialGradient(h[0]*W,h[1]*H,0,h[0]*W,h[1]*H,h[2]*W);rg.addColorStop(0,'rgba(255,255,255,'+(h[3]||.14)+')');rg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=rg;g.fillRect(0,0,W,H)});
 if(o.fur){let s=Math.abs((o.seed||7)*9301+49297)%2147483646+1;const r=()=>(s=(s*16807)%2147483647)/2147483647,pw=Math.max(1,Math.round(PS*.35)),ph=Math.max(1,Math.round(PS*.8));
  for(let i=0,n=Math.floor(W*H/(o.dens||45));i<n;i++){g.fillStyle=r()<.55?'rgba(0,0,0,'+o.fur+')':'rgba(255,255,255,'+(o.fur*.7)+')';g.fillRect(Math.floor(r()*W),Math.floor(r()*H),pw,ph)}}
 g.restore()}
// gado: aplica uma vez em cada sprite em cache
const _cspArt=cowSprite;cowSprite=function(a,cls,pose,k){const sp=_cspArt(a,cls,pose,k);if(sp&&!sp.sh){sp.sh=1;try{const C=CPAL[a.breed]||CPAL.nelore,dark=C.c<'#5';shadeSprite(sp.cv,{top:dark?.2:.12,bot:dark?.18:.24,mid:.38,hi:[[.68,.38,.22,dark?.16:.1],[.28,.36,.2,dark?.13:.08]],fur:dark?.07:.05,seed:hsh(a.breed+cls+pose)})}catch(e){}}return sp};
// ---------- cache genérico de sprites (contorno escuro + volume)
const WSPR=new Map();let WSPS=0;
function bakeOps(key,ops,shd){if(WSPS!==PS){WSPR.clear();WSPS=PS}let sp=WSPR.get(key);if(sp)return sp;
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of ops){x0=Math.min(x0,p[1]);y0=Math.min(y0,p[2]);x1=Math.max(x1,p[1]+p[3]);y1=Math.max(y1,p[2]+p[4])}
 const pad=1.2,sc=PS,W=Math.max(1,Math.ceil((x1-x0+pad*2)*sc)),H=Math.max(1,Math.ceil((y1-y0+pad*2)*sc)),cv=mkCanvas(W,H),g=cv.getContext('2d'),ox=-x0+pad,oy=-y0+pad,ol=.7;
 const FR=(x,y,w,h)=>{const a=Math.round(x*sc),b=Math.round(y*sc),c2=Math.max(a+1,Math.round((x+w)*sc)),d=Math.max(b+1,Math.round((y+h)*sc));g.fillRect(a,b,c2-a,d-b)};
 g.fillStyle='rgba(22,12,6,.85)';for(const p of ops)if(!p[5])FR(p[1]+ox-ol,p[2]+oy-ol,p[3]+ol*2,p[4]+ol*2);
 for(const p of ops){g.fillStyle=p[0];FR(p[1]+ox,p[2]+oy,p[3],p[4])}
 if(shd)shadeSprite(cv,shd);sp={cv,ox:-ox,oy:-oy,w:W/PS,h:H/PS};if(WSPR.size>700)WSPR.clear();WSPR.set(key,sp);return sp}
function blitSpr(g,sp,x,y,d){if(d>0)g.drawImage(sp.cv,x+sp.ox,y+sp.oy,sp.w,sp.h);else{g.save();g.translate(x,y);g.scale(-1,1);g.drawImage(sp.cv,sp.ox,sp.oy,sp.w,sp.h);g.restore()}}
// ---------- quadrúpede genérico com parâmetros por espécie (vista lateral, cabeça para a direita, pés em y=0)
function quadOps(P,pose,ph,o){const ops=[],R=(c,x,y,w,h,noOl)=>{if(w>0&&h>0)ops.push([c,x,y,w,h,noOl])};
 const L=P.L,bh=P.bh,lg=P.lg,c=P.c,dk=P.dk||shade(c,-38),lt=P.lt||shade(c,26),bel=P.bel,x0=-L/2,x1=L/2,run=pose==='run',walk=pose==='walk',gr=pose==='graze',al=pose==='alert';
 const A=run?2.6:walk?1.4:0,s1=Math.sin(ph)*A,s2=Math.sin(ph+Math.PI)*A,bob=run?-Math.abs(Math.cos(ph))*1.1:walk?-Math.abs(Math.cos(ph))*.3:0;
 const top=u=>{let t=-lg-bh+bob;if(u<.16)t+=Math.pow(1-u/.16,2)*bh*(P.rumpR||.38);if(u>.88)t+=Math.pow((u-.88)/.12,2)*bh*.28;t-=(P.hump||0)*Math.exp(-Math.pow((u-(P.humpU||.76))/.12,2));t+=Math.sin(u*Math.PI)*(P.arch||0);return t};
 const bot=u=>{let b=-lg+bob+Math.sin(u*Math.PI)*(P.sag||.4);if(u<.26)b-=(1-u/.26)*(P.tuck||1.4);if(u>.84)b+=(u-.84)*(P.chest||4);if(u<.05)b-=(.05-u)*20;return b};
 const legC=P.leg||c,legF=P.legF||shade(legC,-26),foot=P.foot||'#2a2420',lw1=P.lw1||2.1,lw2=P.lw2||1.2,fw=P.paw?lw2+.9:lw2+.4;
 const hx=x0+L*(P.hindU||.17),fx=x0+L*(P.frontU||.84);
 const leg=(x,far,front,s)=>{const col=far?legF:legC,ft=far?shade(foot,-10):foot,u=front?.84:.17,yb=bot(u);
  if(front){R(col,x-lw1/2+s*.3,yb-1.2,lw1,(-lg*.5)-yb+1.6+bob);R(col,x-lw2/2+s*.65,-lg*.52+bob*.5,lw2,lg*.52-.9);if(P.knee)R(shade(col,-16),x-lw2/2+s*.5,-lg*.5,lw2,.5)}
  else{R(col,x-lw1/2-.2+s*.25,yb-1.6,lw1+.4,(-lg*.46)-yb+1.6+bob);R(col,x-lw2/2+.7+s*.55,-lg*.5+bob*.5,lw2,.9);R(col,x-lw2/2+.3+s*.7,-lg*.46,lw2,lg*.46-.9);R(shade(col,-18),x-lw2/2+.7+s*.55,-lg*.5,.5,.9)}
  if(P.sock&&!far)R(P.sock,x-lw2/2+(front?s*.65:.3+s*.7),-lg*.28,lw2,lg*.28-.9);
  R(ft,x-fw/2+(front?s*.65:.3+s*.7)-(P.paw?0:.1),-1,fw,1)};
 // patas do lado de lá
 leg(fx-(P.legGap||1.6),1,1,s2);leg(hx+(P.legGap||1.6),1,0,s1);
 // rabo (atrás do corpo)
 const tu=top(.02);if(P.tail)P.tail(R,x0,tu,o,pose,ph,c,dk,lt);
 // corpo em colunas com barriga, sela e anca
 for(let x=x0;x<x1;x+=.5){const u=(x-x0)/L,t=top(u),b=bot(u),h=b-t;R(c,x,t,.5,h);R(lt,x,t,.5,Math.min(1,h*.15));
  if(P.saddle&&u>.3&&u<.78)R(P.saddle,x,t,.5,h*(.32-Math.abs(u-.54)*.4));
  if(bel)R(bel,x,b-h*(P.belF||.3),.5,h*(P.belF||.3));R(shade(bel||c,-22),x,b-.7,.5,.7);
  if(P.rump&&u<.13)R(P.rump,x,t+h*.18,.5,h*.62);if(P.mane&&u>.72)R(P.mane,x,t-.5,.5,h*.42);
  if(P.bristle&&u>.25&&((x*2)|0)%2===0)R(P.bristle,x,t-1.2-(u>.5&&u<.85?.6:0),.5,1.4)}
 if(P.fringe)for(let x=x0+L*.2;x<x1-1;x+=.9){const u=(x-x0)/L;R(P.fringe,x,bot(u)-.4,.8,1.3+hs(x,3)*1.2)}
 // pescoço e cabeça
 const nu=P.neckU||.86,nx0=x0+L*nu,ny0=top(nu)+bh*.3;let ang=(P.neckA||40)*Math.PI/180;if(gr)ang=-(P.grazeA||62)*Math.PI/180;else if(run)ang*=.55;else if(al)ang=Math.min(80,P.neckA+18)*Math.PI/180;
 const nl=gr?Math.max(P.neckL,(lg+bh*.3)*.95):P.neckL,hxp=nx0+Math.cos(ang)*nl,hyp=ny0-Math.sin(ang)*nl,nt0=P.neckT0||bh*.75,nt1=P.neckT1||P.hh*.85;
 const NP=[];for(let k=0;k<=12;k++){const t=k/12;NP.push([nx0+(hxp-nx0)*t,ny0+(hyp-ny0)*t,nt0+(nt1-nt0)*t])}NP.forEach(([px,py,tt])=>R(c,px-tt/2,py-tt/2,tt,tt));if(P.mane&&!gr)NP.forEach(([px,py,tt])=>R(P.mane,px-tt/2-.2,py-tt/2,tt*.55,tt));if(P.throat)NP.slice(2).forEach(([px,py,tt])=>R(P.throat,px+tt*.02,py,tt*.46,tt*.55));
 const hw=P.hw,hh=P.hh,tilt=gr?.55:run?.12:(P.tilt||.18);
 if(P.earsBehind!==false)ears(R,P,hxp,hyp,hh,pose,o,c,dk);
 for(let x=0;x<hw;x+=.5){const u=x/hw,h=hh*(1-(P.taper||.45)*Math.pow(u,1.3)),cy=hyp+x*tilt,mz=u>1-(P.muzL||.28);R(mz&&P.muz?P.muz:c,hxp-hw*.25+x,cy-h/2,.5,h);
  if(!mz)R(lt,hxp-hw*.25+x,cy-h/2,.5,.6);if(P.cheek&&u>.15&&u<.62)R(P.cheek,hxp-hw*.25+x,cy+h*.08,.5,h*.42);if(P.mask&&u>.3)R(P.mask,hxp-hw*.25+x,cy-h/2,.5,h*.45)}
 const tx=hxp-hw*.25+hw-.4,ty=hyp+hw*tilt;R(P.nose||'#1a1412',tx-.3,ty-hh*(1-(P.taper||.45))*.5,1,1);R(shade(P.muz||c,-40),tx-hw*.35,ty+hh*.12,hw*.3,.4);
 const ex=hxp+hw*.12,ey=hyp-hh*.18+hw*.37*tilt;R('#120c08',ex,ey,1.05,1.05);R('#fff',ex+.55,ey,.4,.4,1);if(P.eyeRing)R(P.eyeRing,ex-.3,ey+1,1.6,.4);
 if(P.beard)R(P.beard,hxp+hw*.25,hyp+hh*.4+hw*.3*tilt,1.4,2.6);
 if(P.tusk){R('#f4eedc',tx-hw*.42,ty-.4,.6,1.6);R('#f4eedc',tx-hw*.42-.4,ty-1.4,.6,1.2)}
 if(P.earsBehind===false)ears(R,P,hxp,hyp,hh,pose,o,c,dk);
 if(P.head)P.head(R,hxp,hyp,hw,hh,tilt,o,pose);
 // patas do lado de cá
 leg(hx,0,0,s2);leg(fx,0,1,s1);
 if(P.extra)P.extra(R,x0,x1,top,bot,o,pose);
 return ops}
function ears(R,P,hx,hy,hh,pose,o,c,dk){const e=P.ear||'point',s=P.earS||1,ex=hx-hh*.15,ey=hy-hh*.45,inn=P.earIn||'#d8a898';
 if(e==='point'){for(let i=0;i<4;i++)R(i<1?c:shade(c,-6),ex-.4*i*s,ey-i*.9*s,(2.2-i*.45)*s,1*s);R(inn,ex+.3*s,ey-1.6*s,.6*s,1.4*s,1)}
 else if(e==='big'){for(let i=0;i<4;i++)R(c,ex-1.2*i*s,ey-.7*i*s,(2.6-i*.35)*s,(1.2-i*.1)*s);R(inn,ex-1.6*s,ey-1.4*s,1.6*s,.6*s,1);if(pose==='alert'||pose==='run')R(c,ex-.2,ey-3*s,1.2*s,2.4*s)}
 else if(e==='round'){R(c,ex-.3,ey-1.4*s,2*s,1.8*s);R(shade(c,-24),ex+.2,ey-.9*s,1*s,.8*s,1)}
 else if(e==='long'){R(c,ex-.6,ey-5*s,1.4*s,5.2*s);R(c,ex+.9*s,ey-4.6*s,1.4*s,4.8*s);R(inn,ex-.2,ey-4.4*s,.6*s,3.8*s,1);R(inn,ex+1.3*s,ey-4*s,.6*s,3.4*s,1)}}
// galhada: haste principal que sobe, vai para trás e curva para a frente; pontas sobem da haste
function poly(R,pts,w,col,n){for(let i=0;i<pts.length-1;i++){const [x0,y0]=pts[i],[x1,y1]=pts[i+1],d=Math.hypot(x1-x0,y1-y0),k=Math.max(1,Math.ceil(d/.35));for(let j=0;j<=k;j++){const t=j/k;R(col,x0+(x1-x0)*t-w/2,y0+(y1-y0)*t-w/2,w,w,n)}}}
function antler(R,bx,by,n,sc,base,tip,w){const B=[[0,0],[-.9,-1.8],[-1.5,-3.8],[-1.1,-5.6],[.2,-6.8],[2,-7.4],[3.6,-7]].map(p=>[bx+p[0]*sc,by+p[1]*sc]);
 const far=B.map(p=>[p[0]+.9*sc,p[1]-.4*sc]);poly(R,far,w*.9,shade(base,-30),0);
 poly(R,B,w,base,0);R(shade(base,-25),bx-.6,by-.4,1.4*sc,1,0);
 const tines=[[1,-1.8,-.4],[2,-2.6,0],[3,-2.6,.3],[4,-2.4,.5],[5,-2,.6]].slice(0,n);tines.forEach(t=>{const p=B[t[0]];poly(R,[p,[p[0]+t[2]*sc,p[1]+t[1]*sc]],w*.75,tip,0)});
 if(sc>1.5)poly(R,[B[0],[B[0][0]+2.4*sc*.6,B[0][1]-.6*sc]],w*.8,tip,0)}
// rabos
const TAIL={
 deer:(R,x,t,o,pose,ph,c,dk,lt)=>{if(pose==='run'||o.flee){R(c,x-1.4,t-2.6,1.8,3.4);R('#fafaf6',x-1.6,t-3,1.6,3)}else{R(c,x-1.2,t+.6,1.6,3);R(dk,x-1.4,t+3,1.6,.8)}},
 bushy:(R,x,t,o,pose,ph,c,dk,lt,tip)=>{const sw=Math.sin(ph)*.6,up=pose==='run'?-1.6:0;for(let i=0;i<8;i++)R(i>5&&tip?tip:i<2?c:shade(c,-6),x-1-i*.75+sw*i*.1,t+1.2+i*.85+up*(1-i/8),2.4-Math.abs(i-4)*.12,1.6)},
 tuft:(R,x,t,o,pose,ph,c,dk)=>{const sw=Math.sin(ph*1.5)*.5;R(dk,x-.8,t+1,.7,3.2);R(dk,x-1.1+sw,t+3.8,1.2,1.6)},
 stub:(R,x,t,o,pose,ph,c,dk)=>{R(shade(c,-10),x-1,t+1.4,1.6,1.4)},
 cotton:(R,x,t)=>{R('#f8f8f4',x-1.4,t+.4,2,1.8)}};
// ---------- espécies
const WP={
 deer:{L:15,bh:6.8,lg:9.4,c:'#9a6a3c',bel:'#efe4d0',belF:.28,throat:'#f4eee2',neckA:58,neckL:6,neckT0:4.4,neckT1:2.8,hw:6,hh:3.3,taper:.5,muz:'#5a3e26',ear:'big',earS:1,tail:TAIL.deer,lw1:1.9,lw2:1.05,knee:1,cheek:'#e8dcc8',
  head:(R,hx,hy,hw,hh,tilt,o)=>{if(!o.male||!o.pts)return;const n=Math.min(5,Math.max(2,Math.ceil(o.pts/2)));antler(R,hx-.4,hy-hh*.5,n,1,'#d8c8a4','#f4ecd8',.95)}},
 elk:{L:22,bh:10,lg:12.5,c:'#8a5c34',lt:'#a87a4c',mane:'#4a3020',rump:'#e2cc9a',bel:'#5a3c22',belF:.22,neckA:52,neckL:8,neckT0:6.6,neckT1:3.6,hw:7.4,hh:4,taper:.42,muz:'#3e2a1a',ear:'big',earS:1.2,tail:TAIL.stub,lw1:2.6,lw2:1.4,knee:1,leg:'#5a3c22',
  head:(R,hx,hy,hw,hh,tilt,o)=>{if(!o.male)return;antler(R,hx-.8,hy-hh*.5,6,2.1,'#cbb894','#f2ead6',1.3)}},
 boar:{L:15,bh:8,lg:5.2,c:'#3a2e2a',lt:'#5a4a42',bristle:'#1e1612',arch:-.6,rumpR:.3,hump:1.2,humpU:.8,neckA:-8,neckL:2.4,neckT0:6.6,neckT1:5,hw:7.4,hh:5.2,taper:.5,muzL:.14,muz:'#6a5852',nose:'#8a6a64',tusk:1,ear:'point',earS:.8,tail:TAIL.tuft,lw1:2.4,lw2:1.2,grazeA:30,tilt:.32,
  extra:(R,x0,x1,top)=>{}},
 wolf:{L:14,bh:6,lg:7.8,c:'#8a8a86',lt:'#b0b0aa',saddle:'#4a4a48',bel:'#d8d4c8',belF:.32,throat:'#e8e4d8',cheek:'#e2ded2',neckA:30,neckL:3.6,neckT0:4.8,neckT1:3.4,hw:6,hh:3.6,taper:.55,muzL:.3,muz:'#9a9890',ear:'point',earS:1.1,tail:(R,x,t,o,p,ph,c,dk,lt)=>TAIL.bushy(R,x,t,o,p,ph,c,dk,lt,'#3a3a38'),paw:1,foot:'#3a3634',lw1:2,lw2:1.2},
 coyote:{L:12,bh:5,lg:6.8,c:'#a8845a',lt:'#c8a678',saddle:'#6a5a46',bel:'#e8dcc4',belF:.3,throat:'#efe6d2',cheek:'#e6dac2',neckA:32,neckL:3.2,neckT0:4,neckT1:2.8,hw:5.2,hh:3,taper:.58,muzL:.3,muz:'#b89a72',ear:'point',earS:1.2,tail:(R,x,t,o,p,ph,c,dk,lt)=>TAIL.bushy(R,x,t,o,p,ph,c,dk,lt,'#2a2420'),paw:1,foot:'#3a3028',lw1:1.7,lw2:1},
 bear:{L:22,bh:11,lg:7.4,c:'#5a3a22',lt:'#7a5636',hump:2.6,humpU:.78,arch:-.6,sag:1.2,tuck:.6,neckA:4,neckL:2.6,neckT0:8.6,neckT1:6,hw:7,hh:5.6,taper:.48,muzL:.3,muz:'#a07a52',ear:'round',earS:1.3,tail:TAIL.stub,lw1:4.4,lw2:3.4,paw:1,foot:'#2a1a10',leg:'#4a2e1a',legGap:2.4,
  extra:(R,x0,x1,top,bot)=>{for(let i=0;i<3;i++)R('#e8e0d0',x1-L_bearFX+i*.9,-.6,.4,.8)}},
 goat:{L:13,bh:8,lg:6.6,c:'#f2eee4',lt:'#ffffff',dk:'#c8c2b4',hump:1.6,humpU:.72,fringe:'#e2dccc',neckA:48,neckL:3.4,neckT0:5.2,neckT1:3.2,hw:5,hh:3.2,taper:.4,muz:'#e8e2d6',nose:'#2a2420',ear:'point',earS:.8,beard:'#e8e2d4',tail:TAIL.stub,lw1:2.4,lw2:1.4,foot:'#1a1612',
  head:(R,hx,hy,hw,hh)=>{const b='#1e1a16';R(b,hx-.4,hy-hh*.5-1.2,1,1.6);R(b,hx-1.2,hy-hh*.5-2.6,1,1.6);R(b,hx-2.2,hy-hh*.5-3.4,1.1,1.2)}},
 pronghorn:{L:14,bh:6.4,lg:8.8,c:'#c8905a',lt:'#dcac78',bel:'#f6f0e6',belF:.42,rump:'#f8f4ec',throat:'#f6f0e6',neckA:56,neckL:5.4,neckT0:4,neckT1:2.6,hw:5,hh:2.9,taper:.42,muz:'#2a2420',mask:'#2a2420',ear:'point',earS:.9,tail:TAIL.stub,lw1:1.8,lw2:1,knee:1,
  head:(R,hx,hy,hw,hh,tilt,o)=>{const b='#1a1612';R(b,hx-.2,hy-hh*.5-3.6,.9,3.8);R(b,hx-.8,hy-hh*.5-4.2,.9,1);R(b,hx+.6,hy-hh*.5-2.4,1,.7)},
  extra:(R,x0,x1,top)=>{const nx=x0+14*.86;R('#f6f0e6',nx+1.4,top(.9)-3.4,1.4,.8);R('#f6f0e6',nx+2.2,top(.9)-5.4,1.2,.8)}},
 capy:{L:15,bh:7.6,lg:3.6,c:'#8a6a4a',lt:'#a8885e',dk:'#5a4430',rumpR:.55,arch:-.8,sag:.6,tuck:.4,neckA:12,neckL:1.6,neckT0:6.4,neckT1:5.4,hw:6.4,hh:5.2,taper:.18,muzL:.16,muz:'#5a4430',ear:'round',earS:.8,tail:null,lw1:2.6,lw2:1.8,paw:1,foot:'#3a2a1c',grazeA:20,tilt:.1},
 rabbit:{L:5.4,bh:3.6,lg:1.6,c:'#a89880',lt:'#c8b8a0',bel:'#ece6da',belF:.35,rumpR:.6,neckA:30,neckL:1,neckT0:2.6,neckT1:2.2,hw:2.8,hh:2.4,taper:.35,muz:'#c8b8a0',ear:'long',earS:.8,earIn:'#e8b8b0',tail:TAIL.cotton,lw1:1.4,lw2:.8,foot:'#8a7a64',hindU:.22,grazeA:24}};
const L_bearFX=2.6;WP.whitedeer=Object.assign({},WP.deer,{c:'#ece6da',lt:'#ffffff',bel:'#fbf8f2',muz:'#c8b8a8',cheek:null,throat:null});
const WSHD={bear:{fur:.08,top:.14,bot:.3},boar:{fur:.09,top:.14,bot:.28},capy:{fur:.07},wolf:{fur:.07},coyote:{fur:.07},goat:{fur:.06,top:.1,bot:.18},elk:{fur:.06},deer:{fur:.05},whitedeer:{fur:.04,top:.1,bot:.2},pronghorn:{fur:.05},rabbit:{fur:.05}};
// ---------- aves e répteis
function turkeyOps(pose,ph,o){const ops=[],R=(c,x,y,w,h,n)=>{if(w>0&&h>0)ops.push([c,x,y,w,h,n])},b='#4a3426',ir='#6a5a2a',cp='#8a5a2a',run=pose==='run'||pose==='walk',s=Math.sin(ph)*(pose==='run'?2:1.2);
 const ly=(x,s0)=>{R('#c88a6a',x+s0*.4,-5.2,.8,4.4);R('#c88a6a',x-.4+s0*.6,-1,2,.8)};ly(.2,-s);
 for(let i=0;i<7;i++)R(i%2?'#2a1e16':cp,-7.4+i*.4,-12.6+i*1.1,2.6,1.4);R('#d8b888',-7.8,-12.8,1.4,4);
 for(let x=-6;x<4;x+=.5){const u=(x+6)/10,t=-11+Math.pow(u-.55,2)*6,bt=-5.2-Math.sin(u*Math.PI)*.6;R(b,x,t,.5,bt-t);if(((x*2)|0)%2)R(ir,x,t+.6,.5,(bt-t)*.5);R('#2a1e16',x,bt-.6,.5,.6)}
 for(let i=0;i<5;i++)R(i%2?'#f2ece0':'#2a2420',-3.4+i*1.1,-7.6,1.1,2.2);R('#2a1e16',-1,-4.8,.8,2.4);
 R(b,3.2,-11.6,1.6,4);R('#c8d8e8',3.6,-15,1.6,4);R('#8ab0d8',4,-16.2,1.6,1.6);R('#d83a2a',4.4,-13.2,1.4,2.6);R('#d83a2a',5.2,-15.6,.6,2.6);R('#e8c88a',5.4,-15.4,1.4,.6);R('#111',4.6,-15.6,.6,.6);ly(0,s);return ops}
function duckOps(pose,ph){const ops=[],R=(c,x,y,w,h,n)=>{if(w>0&&h>0)ops.push([c,x,y,w,h,n])},s=Math.sin(ph)*.8;
 R('#e88a2a',-1+s*.4,-1.2,1.6,1.2);R('#e88a2a',.6-s*.4,-1.2,1.6,1.2);
 for(let x=-4;x<3;x+=.5){const u=(x+4)/7,t=-5.2+Math.pow(u-.5,2)*3,b=-1.4;R('#b8b8b4',x,t,.5,b-t);R('#8a7a6a',x,t,.5,1.2)}R('#5a3a28',1.4,-5,2,3.2);R('#1a1a1a',-4.8,-5,1.4,2);R('#f8f8f8',-5.2,-5.6,.8,.8);R('#5a5a8a',-1.6,-4,2.6,.8);
 R('#f4f4f4',2.2,-6,1.8,.6);R('#1e5a2a',2,-8.6,2.6,2.8);R('#2a8a4a',2.2,-8.4,1,1);R('#111',3.4,-8,.5,.5);R('#e8c020',4.4,-7.4,2,.9);return ops}
function crocOps(pose,ph){const ops=[],R=(c,x,y,w,h,n)=>{if(w>0&&h>0)ops.push([c,x,y,w,h,n])},c='#4a5a2a',dk='#2e3a1a',bel='#a8a868',s=Math.sin(ph)*1.4;
 const lgs=(x,o)=>{R(dk,x+o*.4,-2.6,1.8,2.6);R(dk,x-.4+o*.8,-.8,2.6,.8)};lgs(-6,-s);lgs(5,s);
 for(let x=-22;x<16;x+=.5){const u=(x+22)/38,th=x<-6?2.6*(1-(x+22)/16)+.8:x<10?3.6:3.2-(x-10)*.25,t=-1-th+Math.sin(u*9+ph)*.15;R(c,x,t,.5,th);R(bel,x,-1.4,.5,.6);if(((x*2)|0)%3===0&&x<10)R(dk,x,t-.5,.5,.8);if(x>-6&&x<9&&((x*2)|0)%4===1)R(dk,x,t+.9,.5,.6)}
 R(c,15,-3.6,7,2.2);R(shade(c,8),15,-3.6,7,.5);R(dk,21,-1.6,1,.6);for(let i=0;i<5;i++)R('#f4f0e0',16+i*1.2,-1.6,.4,.6,1);R('#d8c040',15.6,-4.4,1,.8);R('#111',16,-4.2,.4,.4);
 lgs(-8,s);lgs(3,-s);return ops}
function snakeOps(sp,ph){const ops=[],R=(c,x,y,w,h,n)=>{if(w>0&&h>0)ops.push([c,x,y,w,h,n])},T={jararaca:{L:18,t:1.6,c:'#7a6a3a',p:'#3a2a18',k:'tri'},cascavel:{L:20,t:1.8,c:'#a8986a',p:'#5a4a2a',k:'dia'},sucuri:{L:52,t:4,c:'#5a6a2a',p:'#1e2414',k:'spot'}}[sp];
 const n=Math.round(T.L/.5);for(let i=0;i<n;i++){const x=-T.L/2+i*.5,u=i/n,tt=T.t*(u<.15?.4+u/.15*.6:u>.9?.9:1),y=-tt-1+Math.sin(u*7.5-ph)*(T.t*.55);R(T.c,x,y,.6,tt);R(shade(T.c,-26),x,y+tt-.4,.6,.4);
  if(T.k==='tri'&&i%7<3)R(T.p,x,y,.6,tt*(.4+(i%7)*.2));if(T.k==='dia'&&(i%6===2||i%6===3))R(T.p,x,y+tt*.15,.6,tt*.7);if(T.k==='spot'&&i%9<3)R(T.p,x,y+tt*.2,.6,tt*.6)}
 const hx=T.L/2,hy=-T.t*1.2-1+Math.sin(7.5-ph)*(T.t*.55);R(T.c,hx-.4,hy-T.t*.2,T.t*1.6,T.t*1.15);R(T.p,hx-.2,hy-T.t*.2,T.t*1.4,.4);R('#111',hx+T.t*.6,hy+T.t*.1,.5,.5);
 if(sp==='cascavel'){const rx=-T.L/2-1.6;for(let i=0;i<3;i++)R(i%2?'#c8b88a':'#e8d8aa',rx+i*.6,-2.4,.6,1.6)}return ops}
// ---------- escolha da pose e desenho
function wildPose(a){if(a.st==='dead')return['stand',0];if(a.st==='flee'||a.st==='charge')return['run',(frame>>2)&3];if(a.st==='alert')return['alert',0];
 const moving=!(a.wait>0);if(moving)return['walk',(frame>>3)&3];if(WP[a.sp]&&((frame>>7)+a.id)%3===0&&!['wolf','coyote','bear'].includes(a.sp))return['graze',0];return['stand',0]}
function wildSprite(a){const sp=a.sp,[pose,f]=wildPose(a),ph=f*Math.PI/2,male=!!a.male,pts=male?Math.min(12,a.pts||0):0,key=sp+'|'+pose+'|'+f+'|'+(male?1:0)+'|'+pts+'|'+(a.st==='flee'?1:0);
 if(WSPR.has(key)&&WSPS===PS)return WSPR.get(key);let ops;
 if(WP[sp])ops=quadOps(WP[sp],pose,ph,{male,pts,flee:a.st==='flee'});else if(sp==='turkey')ops=turkeyOps(pose,ph);else if(sp==='duck')ops=duckOps(pose,ph);else if(sp==='croc')ops=crocOps(pose,ph);else if(['jararaca','cascavel','sucuri'].includes(sp))ops=snakeOps(sp,ph);else return null;
 return bakeOps(key,ops,Object.assign({top:.14,bot:.24,mid:.42,hi:[[.62,.35,.25,.1]],seed:hsh(sp)},WSHD[sp]||{}))}
// tamanhos reais (comprimento para sombra, barra de vida e mordida dos cães) e centro do corpo para o tiro
Object.assign(WSZ,{rabbit:6,turkey:12,deer:22,whitedeer:22,boar:18,elk:30,duck:8,capy:16,croc:26,wolf:18,bear:26,goat:15,coyote:15,pronghorn:18,jararaca:14,cascavel:15,sucuri:26});
for(const k in WP){const sp=SPECIES[k],P=WP[k];if(sp)sp.sz=(P.lg+P.bh*.55)/4}
if(SPECIES.turkey)SPECIES.turkey.sz=2.1;if(SPECIES.duck)SPECIES.duck.sz=.9;if(SPECIES.croc)SPECIES.croc.sz=.6;['jararaca','cascavel','sucuri'].forEach(k=>{if(SPECIES[k])SPECIES[k].sz=.5});
// a arte nova entra pela via oficial de desenho (WDRAW) usando um apelido da espécie, para manter barras, lendários, alerta, sangue e transparência
let WAG=null;const WALIAS={};
Object.keys(SPECIES).filter(k=>WP[k]||['turkey','duck','croc','jararaca','cascavel','sucuri'].includes(k)).forEach(k=>{const al='~'+k;WALIAS[k]=al;Object.defineProperty(SPECIES,al,{value:SPECIES[k],enumerable:false,configurable:true});Object.defineProperty(WSZ,al,{get:()=>WSZ[k],enumerable:false,configurable:true});
 WDRAW[al]=(r,a)=>{if(RMODE===4||!WAG)return;const real=a.sp.slice(1),save=a.sp;a.sp=real;let sp;try{sp=wildSprite(a)}finally{a.sp=save}if(!sp)return;blitSpr(WAG,sp,a.x,a.y,a.dir>0?1:-1)}});
const _dwArt=drawWild;drawWild=function(g,a){const al=WALIAS[a.sp];if(!al)return _dwArt(g,a);WAG=g;const real=a.sp;a.sp=al;try{_dwArt(g,a)}finally{a.sp=real;WAG=null}};
// ---------- cavalos: sprites em cache com volume (sem listras), animados em 8 quadros
const HSPR=new Map();let HSPS=0;const _dhsArt=drawHorseS;
drawHorseS=function(g,x,y,dir,b,o){o=o||{};if(o.k&&o.k!==1)return _dhsArt(g,x,y,dir,b,o);if(HSPS!==PS){HSPR.clear();HSPS=PS}
 const side=dir>=2,f=o.mv?(((o.ph||0)%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*8|0:0,key=b+'|'+(side?'s':dir)+'|'+f+'|'+(o.mv?1:0)+'|'+(o.saddle?1:0)+'|'+(o.graze?1:0);
 if(RMODE===4)return;
 let sp=HSPR.get(key);if(!sp){const ox=30,oy=46,W=60,H=52,cv=mkCanvas(W*PS,H*PS),cg=cv.getContext('2d'),rm=RMODE,fr=frame;cg.setTransform(PS,0,0,PS,ox*PS,oy*PS);
  try{frame=0;RMODE=4;_dhsArt(cg,0,0,side?3:dir,b,Object.assign({},o,{ph:f*Math.PI/4,id:0}));RMODE=1;_dhsArt(cg,0,0,side?3:dir,b,Object.assign({},o,{ph:f*Math.PI/4,id:0}))}finally{RMODE=rm;frame=fr}
  const H2=HPAL[b]||{},dark=(H2.c||'#888')<'#6';shadeSprite(cv,{top:.14,bot:.24,mid:.36,hi:[[.62,.42,.14,dark?.16:.12],[.4,.44,.13,.1]],fur:.04,seed:hsh(b)});sp={cv,ox:-ox,oy:-oy,w:W,h:H};if(HSPR.size>300)HSPR.clear();HSPR.set(key,sp)}
 if(!side||dir===3)g.drawImage(sp.cv,x+sp.ox,y+sp.oy,sp.w,sp.h);else{g.save();g.translate(x,y);g.scale(-1,1);g.drawImage(sp.cv,sp.ox,sp.oy,sp.w,sp.h);g.restore()}};
// ---------- galinhas mais bonitas
drawChicken=function(g,c){const x=c.x,y=c.y,d=c.dir>0?1:-1,pk=c.wait>0&&((frame>>4)&1),wl=c.wait>0?0:((frame>>3)&1),R=(col,dx,dy,w,h)=>Rr(g,col,d>0?x+dx:x-dx-w,y+dy,w,h);
 Rr(g,'rgba(0,0,0,.22)',x-3.6,y-1,8,2);const w=!!c.k,b=w?'#f4f0e4':'#b0652f',b2=w?'#dcd6c6':'#8a4a22',b3=w?'#ffffff':'#c87a3e';
 R('#e8b030',-.6+wl*.4,-2.2,.6,2.2);R('#e8b030',1+(1-wl)*.4,-2.2,.6,2.2);R('#e8b030',-1,-.4,1.6,.4);R('#e8b030',.6,-.4,1.6,.4);
 R(w?'#e8e2d4':'#5a2a12',-4.2,-7.4,1.8,3);R(w?'#f4f0e4':'#2a4a3a',-4.6,-8.2,1.2,2.4);
 for(let i=-3.4;i<2.6;i+=.5){const u=(i+3.4)/6,t=-6.2+Math.pow(u-.55,2)*3.4,bt=-2.2-Math.sin(u*Math.PI)*.5;R(b,i,t,.5,bt-t);R(b3,i,t,.5,.5)}R(b2,-2.4,-5.2,3.2,1.6);R(b2,-2,-4,2.6,.6);
 const hx=pk?2.4:1.6,hy=pk?-3.6:-8.2;R(b,hx,hy,2.2,2.4);R(b3,hx,hy,2.2,.5);R('#d63a2a',hx+.2,hy-1,1.6,1.1);R('#d63a2a',hx+.6,hy-1.5,.8,.6);R('#e8b030',hx+2.2,hy+.8,1,.7);R('#d63a2a',hx+1.4,hy+2.2,.7,1);R('#111',hx+1.2,hy+.6,.5,.5)};
