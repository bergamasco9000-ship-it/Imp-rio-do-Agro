// ===== Rosto do gado de verdade e cavalos fiéis a cada raça =====
// ---------- cabeça bovina em perfil: testa reta, cara inclinada para baixo, bochecha, focinho largo, orelha e chifre por raça
headOps=function(R,C,cls,X,Y,s,gr,chew){const calf=cls==='calf',bull=cls==='bull';
 const th=(gr?78:calf?34:42)*Math.PI/180,cs=Math.cos(th),sn=Math.sin(th),hl=(calf?6.2:8.4)*s,hh=(calf?4.1:4.8)*s*(bull?1.1:1),hm=(calf?2.7:3.3)*s*(bull?1.08:1);
 const PX=X+.3,PY=Y+.3,W=(u,v)=>[PX+u*cs-v*sn,PY+u*sn+v*cs];
 const tE=u=>{let t=0;if(u<s)t+=Math.pow(1-u/s,2)*.8*s;if(u>hl-1.3*s)t+=Math.pow((u-(hl-1.3*s))/(1.3*s),2)*.8*s;return t};
 const bE=u=>{let b;if(u<1.3*s)b=hh*.62+u/(1.3*s)*hh*.38;else if(u<3.3*s)b=hh;else if(u<hl-1.7*s)b=hh-(hh-hm)*((u-3.3*s)/(hl-5*s));else b=hm+.3*s*Math.sin((u-(hl-1.7*s))/(1.7*s)*Math.PI)+(chew?.35:0);
  if(u>hl-.6*s)b-=Math.pow((u-(hl-.6*s))/(.6*s),2)*1.1*s;return b};
 const fc=C.fc,cf=bull&&C.cfB?C.cfB:C.cf,cm=C.cm,BK='#1e1c1c',spots=!!C.spots,earC=spots?BK:(C.white?cf:shade(fc,-8)),earD=shade(earC,-24),pink='#d8a0a0',st=.36;
 const fL=shade(fc,13),fD=shade(fc,-14),fD2=shade(fc,-24),cmL=shade(cm,14);
 // orelha do lado de lá
 {const [ex,ey]=W(.9*s,.6*s);R(earD,ex-1.6*s,ey-.6*s,1.8*s,1*s)}
 // cabeça rasterizada em perfil
 for(let u=-.2;u<=hl;u+=st){const t0=tE(u),b0=bE(u),mz=u>hl-2*s;for(let v=t0;v<=b0;v+=st){const [wx,wy]=W(u,v);let col=mz?(v<t0+.6*s?cmL:cm):(v<t0+.8*s?fL:v>b0-.7*s?fD:fc);
  if(!mz&&u>1.6*s&&u<3.6*s&&v>hh*.55&&v<b0-.7*s)col=shade(fc,-6);
  if(spots&&!mz&&u<hl*.6&&v>1.2*s)col=v>b0-.7*s?'#141212':BK;if(mz&&u<hl-1.7*s&&v>b0-.5*s)col=fD2;R(col,wx-.22,wy-.22,st+.3,st+.3)}}
 // olho com pálpebra e brilho
 {const k=calf?1.18:1,[ex,ey]=W(2*s,1.25*s);R(spots?'#0e0c0c':fD2,ex-.95*s,ey-.7*s,1.9*s*k,1.5*s*k);R('#120c0a',ex-.6*s,ey-.5*s,1.2*s*k,1.1*s*k);R('#3a2a22',ex-.2*s,ey-.4*s,.5*s,.5*s);R('#fff',ex-.15*s,ey-.48*s,.42,.42);R(shade(fc,-34),ex-.85*s,ey-.85*s,1.7*s*k,.38);if(calf)R('#fff',ex+.25*s,ey,.3,.3)}
 // narina, boca e queixo
 {const [nx,ny]=W(hl-.75*s,.95*s);R('#140e0c',nx-.5*s,ny-.35*s,1*s,.75*s);R(shade(cm,24),nx-.6*s,ny-.75*s,1.1*s,.35);
  for(let u=hl-1.8*s;u<hl-.3*s;u+=.4){const [mx,my]=W(u,bE(u)-.25*s);R(shade(cm,-38),mx-.2,my-.2,.5,.4)}}
 // orelha do lado de cá
 {const [ex,ey]=W(1*s,1*s);
  if(C.ear==='long'){for(let i=0;i<9;i++)R(earC,ex-1.7*s-i*.08*s,ey-.2*s+i*.62*s,1.7*s+(i>5?.3:0),.8*s);for(let i=1;i<7;i++)R(pink,ex-1.2*s-i*.08*s,ey+.1*s+i*.6*s,.6*s,.6*s);R(earD,ex-1.9*s,ey+5.2*s,1.9*s,.5)}
  else if(C.ear==='zebu'){for(let i=0;i<8;i++)R(i>5?earD:earC,ex-1*s-i*.42*s,ey-.2*s+i*.5*s,1.7*s-i*.08*s,1.5*s*(1-i*.06));for(let i=2;i<6;i++)R('#c8a4a0',ex-1.1*s-i*.42*s,ey+.35*s+i*.5*s,.5*s,.5*s)}
  else{for(let i=0;i<6;i++)R(earC,ex-1.1*s-i*.44*s,ey-.4*s-i*.06*s,1.5*s,1.35*s*(1-i*.06));for(let i=1;i<5;i++)R(spots?'#6a5a5a':pink,ex-1.3*s-i*.42*s,ey+.05*s-i*.05*s,.7*s,.5*s);R(earD,ex-3.6*s,ey+.7*s,1.4*s,.4)}}
 // topete
 if(!spots&&!calf){const [tx,ty]=W(.5*s,.1*s);R(shade(fc,-10),tx-.8,ty-.5,1.8*s,.8*s)}
 if(calf)return;
 // chifres
 const ch=C.ch,tp='#3a3226',b=bull?1.35:1,[hx,hy]=W(.55*s,-.1*s),h=C.horn;
 if(h==='short'){poly(R,[[hx,hy],[hx+.2,hy-.8*b],[hx+.5,hy-1.3*b]],1.15,ch,0);R(tp,hx+.1,hy-1.8*b,.9,.6)}
 else if(h==='up'){poly(R,[[hx,hy],[hx-.3,hy-1.4*b],[hx-.2,hy-2.8*b],[hx+.5,hy-3.8*b]],1.15,ch,0);R(tp,hx+.2,hy-4.3*b,.9,.7)}
 else if(h==='curl'){poly(R,[[hx,hy],[hx+.9,hy-.7*b],[hx+2*b,hy-.7*b],[hx+2.6*b,hy+.2]],1.1,ch,0);R(tp,hx+2.4*b,hy+.4,.8,.8)}
 else if(h==='small'){poly(R,[[hx,hy],[hx+.6,hy-.9],[hx+1.3,hy-1.1]],.9,ch,0);R(tp,hx+1.2,hy-1.4,.7,.6)}};
// ---------- cavalos: cada raça com corpo, cabeça, crina, cauda e pelagem de verdade
const HB={
 crioulo:{coat:'Gateado',c:'#c69c5e',c2:'#aa8048',lt:'#d8b47a',pt:'#2a1e14',mn:'#221810',muz:'#2e2218',dorsal:1,bars:1,len:21,back:-23.8,bel:-13.8,neckA:38,neckL:8.8,arch:.7,hl:8.2,hh:4.4,ear:2,tailUp:0,tailL:13.5,tailW:3.4,mane:'full',lw:2.8,rump:1},
 mangalarga:{coat:'Tordilho',c:'#d8d6d0',c2:'#c0beb8',lt:'#eceae4',dap:'#eeede8',dapD:'#b4b2ac',pt:'#7a7874',mn:'#efeee8',mnD:'#c4c2bc',muz:'#5a5856',len:21.5,back:-24.4,bel:-14.6,neckA:54,neckL:10.4,arch:1.6,hl:8.6,hh:3.9,ear:2.3,tailUp:.3,tailL:15,tailW:2.8,mane:'long',lw:2.3,rump:.6},
 arabe:{coat:'Tordilho claro',c:'#f2f0ea',c2:'#dedcd6',lt:'#fbfaf6',pt:'#dcdad4',mn:'#fbfaf6',mnD:'#d6d4ce',muz:'#3e3e44',skin:1,len:19.5,back:-24,bel:-14.6,neckA:57,neckL:10,arch:2,hl:7.2,hh:3.7,dish:1,ear:1.8,tailUp:1,tailL:13,tailW:2.6,mane:'fine',lw:2.1,rump:.5},
 quarto:{coat:'Alazão',c:'#a8562a',c2:'#8c4420',lt:'#c06a38',pt:'#a8562a',mn:'#7a3816',muz:'#4a2414',blaze:1,socks:[1,0,0,1],len:21,back:-23.6,bel:-13.4,neckA:36,neckL:8.2,arch:.4,hl:7.4,hh:4.7,jaw:1,ear:1.7,tailUp:0,tailL:12,tailW:3,mane:'short',lw:3,rump:1.8},
 pantaneiro:{coat:'Baio',c:'#d6b87c',c2:'#bc9c62',lt:'#e6cc94',pt:'#3a2a18',mn:'#2e2214',muz:'#4a3a28',dorsal:1,star:1,len:19.5,back:-23.4,bel:-13.4,neckA:42,neckL:8.8,arch:.6,hl:8,hh:3.9,ear:2.1,tailUp:0,tailL:13.5,tailW:2.7,mane:'full',lw:2.3,rump:.6}};
// cores da vista de frente/costas iguais às da raça
for(const k in HB){const B=HB[k],H=HPAL[k]||(HPAL[k]={});Object.assign(H,{c:B.c,dk:B.c2,mn:B.mn,leg:B.pt,blaze:!!B.blaze,sock:!!B.socks,str:!!B.dorsal,dap:!!B.dap})}
function horseOps(b,ph,mv,graze,saddle){const B=HB[b]||HB.crioulo,ops=[],R=(c,x,y,w,h,n)=>{if(w>0&&h>0)ops.push([c,x,y,w,h,n])};
 const c=B.c,c2=B.c2,lt=B.lt,pt=B.pt,mn=B.mn,mnD=B.mnD||shade(mn,-22),len=B.len,x0=-13.4,x1=x0+len,bk=B.back,bl=B.bel;
 const sw=mv?ph:0,g1=Math.sin(sw)*3,g2=Math.sin(sw+Math.PI)*3,bob=mv?-Math.abs(Math.sin(sw))*.5:0;
 const top=u=>{let t=bk+bob;t+=Math.sin(u*Math.PI*2.1-.4)*.35;if(u<.1)t+=Math.pow(1-u/.1,2)*(3.6-B.rump*.6);if(u>.86)t+=Math.pow((u-.86)/.14,2)*1.4;if(u>.72&&u<.88)t-=Math.sin((u-.72)/.16*Math.PI)*.9;return t};
 const bot=u=>{let y=bl+bob+Math.sin(u*Math.PI)*.7;if(u<.22)y+=(1-u/.22)*(2.2+B.rump*.5);if(u>.22&&u<.32)y-=Math.sin((u-.22)/.1*Math.PI)*.6;if(u>.8)y+=(u-.8)*7;if(u<.04)y-=(.04-u)*40;return y};
 // pernas
 const legCol=(far)=>far?shade(pt,-22):pt,upCol=(far)=>far?shade(c,-26):c;
 const hind=(x,s,far,white)=>{const uc=upCol(far),lc=legCol(far),hd=far?'#1a1612':'#2a2420';
  for(let y=bot(.12)-1;y<-9.2;y+=.5){const t=(y-bot(.12))/(-9.2-bot(.12));R(uc,x-B.lw/2-.2+t*1.2+s*.25*t,y,B.lw+1.2-t*1.2,.6)}R(uc,x+.6+s*.3,-9.8,B.lw*.8,1.2);
  const cx=x+.9+s*.65;R(lc,cx-.75,-9,1.5,6.2);R(shade(lc,-18),cx+.4,-9,.4,6);R(lc,cx-.9,-3.2,1.8,1.2);R(white?'#f4f2ec':lc,cx-.8,-2.2,1.6,1.1);if(white){R('#f4f2ec',cx-.75,-6,1.5,4.8)}R(hd,cx-.9,-1.2,2.1,1.2);R(shade(hd,24),cx-.9,-1.2,2.1,.35)};
 const front=(x,s,far,white)=>{const uc=upCol(far),lc=legCol(far),hd=far?'#1a1612':'#2a2420',lift=s>1.2?(s-1.2)*.7:0;
  for(let y=bot(.86)-1;y<-8.6;y+=.5){const t=(y-bot(.86))/(-8.6-bot(.86));R(uc,x-B.lw/2+s*.3*t,y,B.lw-t*.5,.6)}
  if(B.bars&&!far)for(let i=0;i<3;i++)R(shade(c,-40),x-B.lw/2+.2,-12.4+i*1.2,B.lw-.6,.4);
  const cx=x+s*.7;R(lc,cx-.8,-8.8,1.7,1.4);R(lc,cx-.7,-7.6+(-lift),1.4,5);R(shade(lc,-18),cx+.3,-7.6,.4,5);R(lc,cx-.85,-3+(-lift),1.7,1.2);
  R(white?'#f4f2ec':lc,cx-.75,-2-lift,1.5,1);if(white)R('#f4f2ec',cx-.7,-6-lift,1.4,4.2);R(hd,cx-.75,-1.1-lift,2,1.1);R(shade(hd,24),cx-.75,-1.1-lift,2,.35)};
 const S=B.socks||[0,0,0,0],hx=x0+len*.14,fx=x0+len*.86;
 hind(hx+1.4,g2,1,0);front(fx+1.5,g1,1,0);
 // cauda (atrás do corpo)
 {const tx=x0+.4,ty=top(.02)+.6,up=B.tailUp;const pts=[];for(let i=0;i<=12;i++){const t=i/12,ang=Math.PI*(.5+.08)-(up?(1-t)*.9*up:0),r=t*B.tailL;pts.push([tx-Math.sin(t*1.5)*(1.4+up*2.4)-t*1.6*(1-up*.3),ty+(up?-Math.sin(t*Math.PI*.7)*3.6*up:0)+r*(up?.72:1)])}
  pts.forEach((p,i)=>{const t=i/12,w=B.tailW*(i<2?.55:1)*(1-t*.25);R(i<2?c:mn,p[0]-w/2,p[1]-.8,w,1.6);if(i>2){R(mnD,p[0]-w/2+.3,p[1]-.8,.4,1.6);R(shade(mn,16),p[0]+w/2-.8,p[1]-.8,.4,1.6)}})}
 // corpo
 for(let x=x0;x<x1;x+=.5){const u=(x-x0)/len,t=top(u),bt=bot(u),h=bt-t;R(c,x,t,.5,h);R(lt,x,t,.5,Math.min(1.2,h*.15));R(c2,x,bt-h*.3,.5,h*.3);R(shade(c2,-16),x,bt-.7,.5,.7);
  if(B.dorsal&&u>.04&&u<.84)R(shade(pt,8),x,t+.1,.5,.6)}
 // músculos: anca e espádua
 const mus=(cx,cy,rx,ry,col)=>{for(let a=-rx;a<=rx;a+=.5){const hh2=ry*Math.sqrt(Math.max(0,1-(a/rx)*(a/rx)));R(col,cx+a,cy-hh2,.5,.5,1)}};
 mus(x0+len*.16,top(.16)+3.6,3.4+B.rump*.4,2.6+B.rump*.3,shade(c,14));mus(x0+len*.78,top(.78)+4.4,2.4,3.2,shade(c,10));
 R(shade(c2,-10),x0+len*.66,bot(.66)-1.6,.6,1.2,1);
 if(B.dap){for(let i=0;i<26;i++){const u=.06+hs(i,7)*.8,x=x0+u*len,y=top(u)+1.4+hs(7,i)*(bot(u)-top(u)-3.2),r=.7+hs(i,9)*.4;R(B.dapD,x-r,y-r*.55,r*2,r*1.1,1);R(B.dapD,x-r*.55,y-r,r*1.1,r*2,1);R(B.dap,x-r*.6,y-r*.35,r*1.2,r*.7,1);R(B.dap,x-r*.35,y-r*.6,r*.7,r*1.2,1)}}
 // pescoço arqueado
 const wx=x0+len*.8,wy=top(.8)+.4;let na=(graze?-38:B.neckA)*Math.PI/180;if(mv&&!graze)na*=.92;
 const nL=graze?B.neckL*1.05:B.neckL,Px=wx+Math.cos(na)*nL,Py=wy-Math.sin(na)*nL+(graze?0:bob);
 const th=(graze?84:58)*Math.PI/180,cs=Math.cos(th),sn=Math.sin(th),H=(u,v)=>[Px+u*cs-v*sn,Py+u*sn+v*cs];
 const hl=B.hl,hh=B.hh*(B.jaw?1.05:1),hm=hh*.55,[Tx,Ty]=H(1.6,hh*.92),Cx=x1-.2,Cy=bot(.97)-2.6;
 for(let t=0;t<=1.0001;t+=.03){const ax=wx+(Px-wx)*t,ay=wy+(Py-wy)*t-Math.sin(t*Math.PI)*B.arch,bx=Cx+(Tx-Cx)*t,by=Cy+(Ty-Cy)*t+Math.sin(t*Math.PI)*.3,d=Math.hypot(bx-ax,by-ay),n=Math.max(1,Math.ceil(d/.45));
  for(let j=0;j<=n;j++){const k=j/n;R(k<.18?lt:k>.8?c2:c,ax+(bx-ax)*k-.3,ay+(by-ay)*k-.3,.8,.8)}}
 // crina
 const mT=B.mane==='short'?1.2:B.mane==='long'?3.8:B.mane==='fine'?3.2:3;
 for(let t=.04;t<=1;t+=.06){const ax=wx+(Px-wx)*t,ay=wy+(Py-wy)*t-Math.sin(t*Math.PI)*B.arch;if(B.mane==='short'){R(mn,ax-.5,ay-1,1.2,1.3);continue}
  const L2=mT*(.7+hs(t*50,3)*.5)*(graze?.8:1);for(let k=0;k<L2;k+=.5)R(k>L2-1?mnD:mn,ax-.6+k*.12,ay-.6+k*.9,1.2-(B.mane==='fine'?.3:0),.6)}
 // cabeça
 const tE=u=>{let t=0;if(u<.9)t+=Math.pow(1-u/.9,2)*.7;if(B.dish)t+=.55*Math.sin(Math.min(1,Math.max(0,(u-hl*.3)/(hl*.45)))*Math.PI);if(u>hl-.7)t+=Math.pow((u-(hl-.7))/.7,2)*.9;return t};
 const bE=u=>{let b;if(u<1.2)b=hh*.6+u/1.2*hh*.4;else if(u<2.8+(B.jaw?.4:0))b=hh;else if(u<hl-1.3)b=hh-(hh-hm)*((u-2.8)/(hl-4.1));else b=hm+.25*Math.sin((u-(hl-1.3))/1.3*Math.PI);if(u>hl-.5)b-=Math.pow((u-(hl-.5))/.5,2)*1;return b};
 for(let u=-.2;u<=hl;u+=.36){const t0=tE(u),b0=bE(u),mz=u>hl-1.7;for(let v=t0;v<=b0;v+=.36){const [x,y]=H(u,v);let col=v<t0+.7?lt:v>b0-.6?c2:c;
  if(mz)col=B.skin?(v<t0+.5?'#5a5a60':B.muz):(u>hl-1?B.muz:shade(c,-14));if(u>1.4&&u<3.2&&v>hh*.5&&v<b0-.5)col=shade(c,9);
  if(B.blaze&&u>.8&&u<hl-.3&&v<t0+1.1+(u>hl-2?.4:0))col='#f6f4ee';if(B.star&&Math.hypot(u-1.4,v-.9)<.75)col='#f6f4ee';R(col,x-.22,y-.22,.66,.66)}}
 {const [ex,ey]=H(hl*.24,1.05),k=B.dish?1.15:1;R(B.skin?'#4a4a50':shade(c,-30),ex-.85,ey-.6,1.7*k,1.3*k);R('#120c0a',ex-.6,ey-.45,1.25*k,1*k);R('#fff',ex-.15,ey-.4,.42,.42);R(shade(c,-36),ex-.8,ey-.8,1.6,.35)}
 {const [nx,ny]=H(hl-.7,.75);R('#140e0c',nx-.55,ny-.4,1.1,.85);R(shade(B.muz,30),nx-.6,ny-.8,1.2,.35);for(let u=hl-1.3;u<hl-.2;u+=.4){const [mx,my]=H(u,bE(u)-.25);R('#1a1210',mx-.2,my-.2,.5,.35)}}
 // orelhas e topete
 {const [ox,oy]=H(.25,-.1);for(let i=0;i<5;i++){R(shade(c,-26),ox-1.2+i*.05,oy-i*.45*B.ear/2,1.2-i*.18,.6)}for(let i=0;i<5;i++){const w=1.3-i*.2;R(i<1?c:shade(c,-4),ox-.2+i*.12,oy-.2-i*.48*B.ear/2,w,.6)}R(shade(c,-34),ox+.2,oy-1.2,.4,.9)
  if(B.mane!=='short')for(let i=0;i<5;i++){const [fx2,fy2]=H(.2+i*.38,.2+i*.12);R(mn,fx2-.4,fy2-.3,.9,.8)}}
 // arreio: cabeçada, rédeas, baixeiro, lombilho, pelego, barrigueira e estribo
 if(saddle){const [nbx,nby]=H(hl-2.3,0),[nbx2,nby2]=H(hl-2.3,bE(hl-2.3)),[pkx,pky]=H(.6,0),[bitx,bity]=H(hl-1.2,bE(hl-1.2)-.5);
  poly(R,[[nbx,nby],[nbx2,nby2]],.55,'#3a2210',1);poly(R,[[pkx,pky],H(1.4,1.6),[nbx2-.2,nby2-.6]],.5,'#3a2210',1);R('#c8ccd0',bitx-.5,bity-.5,1,1,1);
  const sx=-1;poly(R,[[bitx,bity],[wx-.4,wy+1.4],[sx+4.6,bk-1]],.45,'#2a1608',1);
  R('#a82a1a',sx-6.2,bk-.2,11.8,3.4);for(let i=0;i<12;i+=2)R('#e8c040',sx-6.2+i,bk+2.6,1,.8);R('#5a3a1a',sx-5.2,bk-1.6,9.8,2.6);R('#7a5230',sx-5.2,bk-1.6,9.8,.6);R('#3a2210',sx+3.8,bk-2.8,1.2,1.6);
  for(let i=0;i<11;i++)R(i%2?'#ece2c8':'#f6eed8',sx-5.6+i*.95,bk-2.6+(i%3)*.15,1.2,1.4);R('#d8ccb0',sx-5.6,bk-1.2,10.4,.5);
  R('#3a2210',sx-.2,bk+2.4,1,bot(.55)-bk-2.2);R('#2a1608',sx+.2,bk+1.8,.5,(-16.6)-(bk+1.8));R('#9aa0a6',sx-.4,-16.6,1.6,.5);R('#9aa0a6',sx-.4,-16.6,.4,1.4);R('#9aa0a6',sx+.8,-16.6,.4,1.4);R('#9aa0a6',sx-.4,-15.4,1.6,.4)}
 // pernas do lado de cá
 hind(hx,g1,0,S[0]);front(fx,g2,0,S[3]);
 return ops}
const _dhsB=drawHorseS;
drawHorseS=function(g,x,y,dir,b,o){o=o||{};const side=dir>=2;if(!side||(o.k&&o.k!==1)||!HB[b])return _dhsB(g,x,y,dir,b,o);
 const f=o.mv?(((o.ph||0)%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*8|0:0,key='H2|'+b+'|'+f+'|'+(o.mv?1:0)+'|'+(o.saddle?1:0)+'|'+(o.graze?1:0);
 if(RMODE!==1){Rr(g,'rgba(0,0,0,.28)',x-15,y-1.4,30,3);Rr(g,'rgba(0,0,0,.14)',x-17,y-.8,34,2)}if(RMODE===4)return;
 let sp=WSPR.get(key);if(!sp||WSPS!==PS){const B=HB[b],dark=B.c<'#8';sp=bakeOps(key,horseOps(b,f*Math.PI/4,o.mv,o.graze,o.saddle),{top:.12,bot:.22,mid:.38,hi:[[.3,.42,.12,dark?.14:.1],[.66,.44,.1,.08]],fur:.035,seed:hsh(b)})}
 blitSpr(g,sp,x,y,dir===3?1:-1)};
// ---------- cores reais das roupas de caça
OUTFITS.wood.c=['#6e7a4a','#3a4a26','#6a4e30'];OUTFITS.wood.n='Camuflagem Woodland (M81)';
OUTFITS.full.c=['#7a6a4c','#4a3a26','#5a6a32'];OUTFITS.full.n='Camuflagem de mata completa + balaclava';OUTFITS.full.d='Padrão de casca e folhas, capuz, balaclava e luvas.';
OUTFITS.ghillie.c=['#5a5a34','#4a5a2a','#7a6a3a'];OUTFITS.ghillie.d='Fios de juta em camadas, capuz e luvas. Vira parte do mato.';
