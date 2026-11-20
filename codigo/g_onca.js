const ONCA_HEAD=['.....ddd..............','....dcccd.............','....dccod.............','..oodcoodooo..........','.oooooKooooKoooo......','.ogKgggoKgggKoooo.....','.gggggKgggggKKKooo....','oKggKggggggKeKeKggoo..','ogggggKgKggwdddwgggppp','oKgggggggggwwwwwcggpnp','ogggKggKgggggccWWWWWWK','.gggggggKgcccWKWKWKWWW','.gKgggKccccccWWKWKWWW.','..cccccccccdKKKKKKKK..','...ccccccwwwwwwwww....','.....cccwwwwwwww......'];
// ===== ONÇA-PINTADA realista: corpo musculoso, cabeça maciça e redonda, rosetas com pintas dentro, barriga branca com manchas, patas largas e cauda grossa
function oncaOps2(pose,f,night){const ops=[],R=(c,x,y,w,h,n)=>{if(w>0&&h>0)ops.push([c,x,y,w,h,n])},K='#1a1108';
 const stalk=pose==='stalk',run=pose==='run'||pose==='attack',att=pose==='attack',ph=f*Math.PI/2;
 const L=19.5,x0=-10.5,x1=x0+L,lg=stalk?3.6:5.6,bh=7,crouch=stalk?1:0;
 const A=run?2.8:pose==='walk'||stalk?1.5:0,s1=Math.sin(ph)*A,s2=Math.sin(ph+Math.PI)*A,bob=run?-Math.abs(Math.cos(ph))*1.2:0,ext=att?1.4:0;
 const C1='#c4822c',C2='#dca04a',C3='#ecc888',BE='#f7efdf';
 let seed=7;const rr=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const top=u=>{let t=-lg-bh+bob;if(u<.13)t+=Math.pow(1-u/.13,2)*2.8;t+=Math.sin(u*Math.PI)*.4;t-=(stalk?2.6:1.1)*Math.exp(-Math.pow((u-.8)/.09,2));if(u>.88)t+=Math.pow((u-.88)/.12,2)*2.2;return t};
 const bot=u=>{let b=-lg+bob;if(u<.22)b-=(1-u/.22)*1.8;b+=.9*Math.exp(-Math.pow((u-.42)/.14,2));if(u>.78)b+=(u-.78)*4;if(u<.04)b-=(.04-u)*30;return b};
 // patas: antebraço que afina até o punho e pata larga com dedos; traseira com coxa, jarrete e pata
 const paw=(cx,far)=>{const pc=far?'#b47a30':'#e0b060';R(pc,cx-1.4,-1.9,3,.5);R(pc,cx-1.7,-1.5,3.6,1.5);R(far?'#7a5a3a':'#b8884a',cx-1.7,-.45,3.6,.45);if(!far){R('#8a6a48',cx-.3,-1.3,.3,.9,1);R('#8a6a48',cx+.7,-1.3,.3,.9,1)}};
 const front=(x,s,far)=>{const c=far?'#b47a30':C2,y0=bot(.86)-1.5,y1=-1.9;for(let y=y0;y<y1;y+=.5){const t=(y-y0)/(y1-y0),w=3.5-t*1.1,cx=x+s*.7*t+crouch*1.2*t;R(c,cx-w/2,y,w,.6);if(!far){R(C3,cx+w/2-.7,y,.6,.6);R(shade(c,-12),cx-w/2,y,.4,.6)}}
  const cx=x+s*.7+crouch*1.2+ext;paw(cx+.3,far);if(!far){R(K,x-.6+s*.4,-lg*.48,.6,.55,1);R(K,x+.5+s*.5,-lg*.3,.55,.5,1);R(K,x-.2+s*.6,-lg*.15,.5,.45,1)}};
 const hind=(x,s,far)=>{const c=far?'#b47a30':C2,ky=-lg*.52,hy=-lg*.26;
  for(let y=bot(.17)-2.6;y<ky;y+=.5){const t=(y-bot(.17)+2.6)/(ky-bot(.17)+2.6),w=4.6-t*1.6,cx=x+.6*t+s*.3*t;R(c,cx-w/2,y,w,.6)}
  for(let y=ky;y<hy;y+=.5){const t=(y-ky)/(hy-ky),cx=x+.6-t*1+s*.5*t;R(c,cx-1.3,y,2.6,.6)}
  for(let y=hy;y<-1.9;y+=.5){const t=(y-hy)/(-1.9-hy),cx=x-.4+t*.6+s*(.5+.25*t)-crouch*.6*t;R(c,cx-1.1,y,2.2,.6);if(!far)R(shade(c,-12),cx-1.1,y,.4,.6)}
  paw(x+.3+s*.75-crouch*.6,far);if(!far){R(K,x-1.4,bot(.17)-1.2,.7,.6,1);R(K,x+.3,ky+.6,.6,.5,1)}};
 const hx=x0+L*.17,fx=x0+L*.83;front(fx+1.8,s2,1);hind(hx+1.8,s1,1);
 // cauda: curva em J (desce rente à coxa e a ponta vira para cima), mais fina na ponta, pintas e anéis pretos no fim
 {const bx=x0+.8,by=top(.03)+1.2,sw=Math.sin(ph)*1.1;let P0=[bx,by],P1,P2,P3;
  if(run){P1=[bx-4.5,by+.8];P2=[bx-9.5,by+5.2];P3=[bx-13,by-.6+sw*.4]}else if(stalk){P1=[bx-2.6,by+4.2];P2=[bx-8.4,by+7.4];P3=[bx-11.2,by+3.2+sw*.6]}else{P1=[bx-4.4,by+.6];P2=[bx-7.8+sw*.5,by+8.6];P3=[bx-4.6+sw,by+10.4]}
  const B=t=>{const m=1-t;return[m*m*m*P0[0]+3*m*m*t*P1[0]+3*m*t*t*P2[0]+t*t*t*P3[0],m*m*m*P0[1]+3*m*m*t*P1[1]+3*m*t*t*P2[1]+t*t*t*P3[1]]};
  for(let t=0;t<=1.0001;t+=.025){const [px,py]=B(t),w=2.3-t*.9,ring=t>.55&&Math.floor((t-.55)/.09)%2===0,tip=t>.93;R(tip||ring?K:C2,px-w/2,py-w/2,w,w);if(!tip&&!ring){R(C1,px-w/2,py-w/2,w,w*.35);R(C3,px-w/2,py+w*.15,w,w*.3)}}
  for(let i=0;i<6;i++){const [px,py]=B(.08+i*.075);R(K,px-.3+(i%2)*.4,py-.35,.6,.55,1)}}
 // corpo: dorso mais escuro, flancos dourados, lateral clara e barriga branca
 for(let x=x0;x<x1;x+=.5){const u=(x-x0)/L,t=top(u),b=bot(u),h=b-t;R(C2,x,t,.5,h);R(C1,x,t,.5,h*.26);R(shade(C1,-10),x,t,.5,.6);R(C3,x,t+h*.6,.5,h*.2);R(BE,x,b-h*.22,.5,h*.22);R('#d8ccb4',x,b-.6,.5,.6)}
 const blob=(cx,cy,rx,ry,c)=>{for(let a=-rx;a<=rx;a+=.5){const hh=ry*Math.sqrt(Math.max(0,1-(a/rx)*(a/rx)));R(c,cx+a,cy-hh,.5,hh*2,1)}};
 blob(x0+L*.82,top(.8)+3.6,2.4,2.6,'rgba(255,232,175,.2)');blob(x0+L*.17,top(.17)+3.2,3.1,2.6,'rgba(255,232,175,.18)');
 // rosetas: anéis quebrados, miolo mais escuro e 1–2 pintas dentro
 for(let col=0;col<6;col++)for(let row=0;row<3;row++){const u=Math.min(.88,.1+col*.14+(row%2)*.06+rr()*.03),t=top(u),b=bot(u),h=b-t,v=.27+row*.17+rr()*.04;if(v>.66){rr();continue}const cx=x0+u*L,cy=t+h*v,r=1.15+rr()*.35-(row===0?.15:0);
  R('#b9711e',cx-r*.55,cy-r*.5,r*1.1,r,1);const segs=8;for(let k=0;k<segs;k++){if(rr()<.25)continue;const a=k/segs*Math.PI*2+.3,px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r*.8;R(K,px-.27,py-.26,.55,.52,1)}
  R(K,cx-.25,cy-.22,.48,.45,1);if(rr()<.4)R(K,cx+.3,cy+.15,.4,.4,1)}
 for(let i=0;i<6;i++){const u=.12+i*.13,cx=x0+u*L,t=top(u);R(K,cx-.35,t+.8,.8,.45,1)}
 for(let i=0;i<5;i++){const u=.28+i*.11+rr()*.03,cx=x0+u*L,b=bot(u);R(K,cx-.5,b-1.2-rr()*.4,1.1+rr()*.4,.7,1)}
 // pescoço: a nuca desce do ombro até atrás da orelha e a garganta branca sobe do peito até embaixo da mandíbula
 const nb=top(.93),hd=stalk?2.2:run?.7:0;
 const px=.47,HX=x1-3.1,HY=top(.8)-.7+hd+(att?-.5:0),HB=HY+16*px;
 {const xa=x1-5.5,xb=HX+7,tA=top((xa-x0)/L),tB=HY+3.5*px,bA=bot((x1-2.5-x0)/L),bB=HB-.3,cl=v=>Math.max(0,Math.min(1,v)),sm=v=>v*v*(3-2*v);
  for(let x=xa;x<xb;x+=.4){const t=tA+(tB-tA)*sm(cl((x-xa)/(HX+1.5-xa))),b=bA+(bB-bA)*cl((x-(x1-2.5))/(xb-(x1-2.5))),h=b-t;if(h<=0)continue;
   R(C2,x,t,.42,h);R(C1,x,t,.42,h*.22);R(C3,x,t+h*.56,.42,h*.2);R(BE,x,b-h*.25,.42,h*.25)}
  const nk=(x,y,w)=>R(K,x,y,w,.42,1);nk(x1-3.6,tA+1.3,.7);nk(x1-2.2,tA+2.6,.6);nk(x1-4.4,tA+3.4,.6);
  for(let i=0;i<3;i++){const x=x1-1.6+i*1.6,f=cl((x-(x1-2.5))/(xb-(x1-2.5))),b=bA+(bB-bA)*f;nk(x,b-1.1,.9)}}
 // cabeça feita a partir de fotos de perfil: crânio largo e abaulado, orelha pequena e redonda atrás, testa que desce até o nariz rosado,
 // olho âmbar amendoado com mancha branca embaixo, almofada do bigode branca com pintas, lábio preto, queixo branco.
 // Um contorno escuro separa a cabeça do pescoço; no ataque só a mandíbula de baixo abre, girando na dobra da boca
 {const G=ONCA_HEAD,PAL={K,o:C1,g:C2,c:C3,w:'#f6eedc',W:'#f1e4c8',p:'#c47f6c',n:'#5a2a22',e:night?'#f6f27a':'#d89a2a',d:'#6e3f14'};
  const sh=(r,c)=>att&&r>=14&&c>=9?(c-8.5)*.3*px:0,at=(r,c)=>{const ch=(G[r]||'')[c];return ch&&ch!=='.'};
  const RC='#5a3312',q=.27;for(let r=0;r<G.length;r++)for(let c=0;c<G[r].length;c++){if(!at(r,c))continue;const x=HX+c*px,y=HY+r*px+sh(r,c);if(!at(r-1,c))R(RC,x-q,y-q,px+q*2,q,1);if(!at(r,c+1))R(RC,x+px,y-q,q,px+q*2,1);if(!at(r+1,c))R(RC,x-q,y+px,px+q*2,q,1);if(!at(r,c-1)&&r>=6)R(RC,x-q,y-q,q,px+q*2,1)}
  if(att){for(let c=9;c<=18;c++){const o=sh(14,c),y=HY+14*px;R('#5e1410',HX+c*px,y-.05,px+.02,o+.1,1);if(c>=10&&c<=15)R('#b84a50',HX+c*px,y+o*.5,px+.02,o*.5,1)}}
  for(let r=0;r<G.length;r++){const row=G[r];for(let c=0;c<row.length;c++){const ch=row[c];if(ch==='.')continue;R(PAL[ch],HX+c*px,HY+r*px+sh(r,c),px+.02,px+.02)}}
  if(att){const y=HY+14*px;for(let c=10;c<=17;c++)R(K,HX+c*px,y+sh(14,c),px+.02,.15,1);
   R('#fbf8f0',HX+16.9*px,y-.05,px*.9,px*1.7,1);R('#fbf8f0',HX+18.1*px,y-.05,px*.6,px*.6,1);R('#fbf8f0',HX+11.5*px,y-.05,px*.7,px*.8,1);
   R('#fbf8f0',HX+15.2*px,y+sh(14,15.2)-px*1.2,px*.8,px*1.25,1);R('#fbf8f0',HX+12.4*px,y+sh(14,12.4)-px*.6,px*.6,px*.6,1)}
  R('#fff',HX+12*px,HY+7*px,.17,.17,1);if(night)R('rgba(246,242,122,.35)',HX+11*px,HY+6*px,5*px,3*px,1);
  for(let i=0;i<3;i++)R('rgba(250,248,240,.9)',HX+21.6*px,HY+(10.6+i*.9)*px,1.5-i*.2,.17,1)}
 front(fx,s1,0);hind(hx,s2,0);
 return ops}
oncaSpr=function(pose,f,night){const key='ONF|'+pose+'|'+f+'|'+(night?1:0);let s=WSPR.get(key);if(s&&WSPS===PS)return s;
 return bakeOps(key,oncaOps2(pose,f,night),{top:.12,bot:.24,mid:.42,hi:[[.62,.36,.2,.1],[.3,.36,.18,.08]],fur:.05,dens:40,seed:91})};
drawOnca=function(g){const o=ONCA;if(!o)return;const st=o.st,pose=st==='attack'?'attack':st==='flee'?'run':st==='stalk'?'stalk':'walk',f=pose==='attack'?2:(frame>>(pose==='run'?2:3))&3,night=daylight()<.35;
 if(RMODE!==1){Rr(g,'rgba(0,0,0,.28)',o.x-14,o.y-1.3,28,2.8);Rr(g,'rgba(0,0,0,.14)',o.x-16,o.y-.7,32,1.6)}if(RMODE===4)return;blitSpr(g,oncaSpr(pose,f,night),o.x,o.y,o.dir>0?1:-1)};
