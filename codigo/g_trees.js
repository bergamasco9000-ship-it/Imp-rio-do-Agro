// ===== Árvores estilo Stardew: copa em tufos de folhas, luz de cima-esquerda, tronco com raízes, pinheiros em camadas =====
const _treeSpOld=treeSprite;
function trBuf(W,H){return{W,H,a:new Int8Array(W*H).fill(-1)}}
function trInk(b,px,pal,x0,y0){// pinta o buffer e contorna (contorno = cor mais escura da paleta)
 const{W,H,a}=b;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=a[y*W+x];if(k<0)continue;
  const e=x===0||y===0||x===W-1||y===H-1||a[y*W+x-1]<0||a[y*W+x+1]<0||a[(y-1)*W+x]<0||a[(y+1)*W+x]<0;
  px(x0+x,y0+y,e?pal[0]:pal[k])}}
function trCanopy(b,cs,seed,ccx,ccy,R,opt){
 const{W,H,a}=b,own=new Int16Array(W*H).fill(-1);opt=opt||{};
 cs.forEach((c,ci)=>{for(let y=Math.max(0,c[1]-c[2]-2|0);y<Math.min(H,c[1]+c[2]+2);y++)for(let x=Math.max(0,c[0]-c[2]-2|0);x<Math.min(W,c[0]+c[2]+2);x++){
  const dx=x+.5-c[0],dy=(y+.5-c[1])*(opt.sq||1),d=Math.hypot(dx,dy)+(ih(x,y,seed)-.5)*1.5;if(d<=c[2])own[y*W+x]=ci}});
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ci=own[y*W+x];if(ci<0)continue;const c=cs[ci];
  const nx=(x+.5-c[0])/c[2],ny=(y+.5-c[1])/c[2],gx=(x+.5-ccx)/R,gy=(y+.5-ccy)/R;
  let L=-(nx*.55+ny*.75)*.6-(gx*.5+gy*.85)*.55+.13+(ih(x,y,seed+3)-.5)*.3;
  // textura de folhas: escamas 4x3 em fileiras desencontradas
  const row=Math.floor(y/3),sx=x+(row&1)*2,lx=sx&3,ly=y-row*3,cell=ih(sx>>2,row,seed+5);
  if(ly===0&&(lx===1||lx===2)&&cell<.7)L+=.3;else if(ly===2&&lx===3)L-=.32;else if(ly===2&&lx===0&&cell>.6)L-=.18;
  let k=L>.6?4:L>.2?3:L>-.28?2:1;
  const bl=y+1<H?own[(y+1)*W+x]:-1;if(bl>=0&&bl!==ci&&cs[bl][1]>c[1]+1)k=Math.max(1,k-1);// sombra entre tufos
  const ab=y-1>=0?own[(y-1)*W+x]:-1;if(ab>=0&&ab!==ci&&cs[ab][1]<c[1]-1&&k<4&&ly!==2)k=Math.min(4,k+1);// borda de cima do tufo da frente pega luz
  if(gy>.62)k=Math.max(1,k-1);
  a[y*W+x]=k}
}
function trTrunk(px,ax,ay,h,w,col,seed,flare){
 const B=hex3(col),C=(f)=>'rgb('+B.map(q=>Math.max(0,Math.min(255,q*f|0)))+')';
 for(let y=0;y<h;y++){const fl=flare&&y<3?(3-y)*.8:0,hw=w/2+fl;
  for(let x=Math.floor(-hw);x<Math.ceil(hw);x++){const rel=(x+hw)/(hw*2);let f=rel<.3?1.18:rel>.72?.68:.92;
   if(((x*7+Math.floor(y/2)*3+seed)%5)===0&&rel>.2&&rel<.8)f*=.78;// fendas da casca
   if(y>h-4)f*=.72;// sombra da copa
   px(ax+x,ay-y,(x===Math.floor(-hw)||x===Math.ceil(hw)-1)?C(.45):C(f))}}
 if(flare){px(ax-Math.ceil(w/2)-3,ay,C(.5));px(ax+Math.ceil(w/2)+2,ay,C(.5));}
}
function trShadow(g,ax,ay,rx,ry){for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx+2;x++){const e=(x/(rx+.5))**2+(y/(ry+.5))**2;if(e<1){g.fillStyle='rgba(20,30,10,'+(e<.55?.3:.18)+')';g.fillRect(ax+x+3,ay+y,1,1)}}}
treeSprite=function(k,v,s,dry,snow){
 if(!(k===0||k===1||k===2||k===5||k===7))return _treeSpOld(k,v,s,dry,snow);
 const key='T2|'+k+'|'+v+'|'+s+'|'+dry+'|'+snow;if(SPR.has(key))return SPR.get(key);
 const W=48,H=72,ax=24,ay=66,c=mkCanvas(W,H),g=c.getContext('2d'),px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x|0,y|0,1,1)};
 const sd=v*97+k*13+(dry?5:0);let split=ay-8;
 if(k===1||k===7||k===5){
  const big=k===1,cer=k===7,ipe=k===5;
  const pink=v%3===0;
  const pal=ipe?(dry?(pink?['#4a1232','#9a3a70','#c85a98','#e886bc','#ffc4e2']:['#4a3608','#b08414','#d8aa1e','#f0cc3a','#fff08a']):['#0e2a14','#24602a','#348034','#4c9c42','#78bc5a'])
   :dry?(cer?['#26260e','#56601e','#6c7a28','#889632','#a8b44a']:['#26300e','#566a22','#6e822c','#8a9e38','#aebc52'])
   :(cer?['#10281a','#285a2a','#3a7232','#54903e','#78ac52']:['#0c2a16','#215a28','#317834','#489840','#70b85a']);
  const R=(big?12:cer?9.5:8.5)*s,cy=ay-(big?27:cer?22:24)*s,cx=ax+(ih(v,1,sd)-.5)*2;
  trShadow(g,ax,ay,Math.round(R*1.05),3);
  const th=Math.round(ay-(cy+R*.55));trTrunk(px,ax,ay,th,big?5:4,cer?'#5a3e26':ipe?'#4a3222':'#5e3e24',sd,1);
  if(cer||ipe){// galhos aparentes
   for(const[d,yy,l]of[[-1,.62,6],[1,.72,6],[-1,.85,4]]){const y0=ay-Math.round(th*yy);for(let j=0;j<l;j++){px(ax+d*(2+j),y0-Math.round(j*.7),'#4a3220');px(ax+d*(2+j),y0-Math.round(j*.7)+1,'#2e1e14')}}}
  const cs=[[cx,cy+R*.05,R*.62]],n=big?7:6;
  for(let i=0;i<n;i++){const an=(i/n)*6.283+ih(i,v,sd)*.7-1.2,dd=R*(.56+ih(v,i,sd+1)*.16);cs.push([cx+Math.cos(an)*dd*(cer?1.35:1.08),cy+Math.sin(an)*dd*(cer?.6:.8),R*(.3+ih(i,v,sd+2)*.2)])}
  for(let i=0;i<2;i++)cs.push([cx+(i?.3:-.32)*R+(ih(i,v,sd+6)-.5)*3,cy-R*.58+ih(i,v,sd+4)*2,R*(.34+ih(v,i,sd+7)*.1)]);// topo em tufos
  cs.sort((a,b)=>a[1]-b[1]);
  const b=trBuf(W,H);trCanopy(b,cs,sd,cx,cy,R,{sq:cer?1.15:1});trInk(b,px,pal,0,0);
  split=Math.round(cy+R*.85);
  if(!dry&&big&&v===0)for(let i=0;i<5;i++){const an=ih(i,v,4)*6.28,rr=R*(.25+ih(v,i,4)*.6),fx=Math.round(cx+Math.cos(an)*rr),fy=Math.round(cy+Math.sin(an)*rr*.8);px(fx,fy,'#ff8088');px(fx+1,fy,'#d83a48');px(fx,fy+1,'#b82a3a');px(fx+1,fy+1,'#7a1424')}
  if(ipe&&dry)for(let i=0;i<8;i++)px(ax-11+((ih(i,v,7)*22)|0),ay-1+((ih(v,i,7)*3)|0),pal[3]);// flores caídas
 }else{// pinheiros (0) e araucária-azulada (2)
  const pal=k===2?['#0c2420','#1c4a3c','#28604c','#3a7a62','#58987c']:dry?['#0e2618','#224a26','#2e5e2e','#40763a','#5a8e48']:['#0a2414','#1a4a26','#245e2e','#33783a','#4e9448'];
  trShadow(g,ax,ay,9,2);trTrunk(px,ax,ay,8,3,'#4a3020',sd,1);
  const b=trBuf(W,H),T=5,base=ay-5,top=Math.round(ay-50*s);
  for(let t=0;t<T;t++){const ty0=Math.round(top+(base-top)*t/T*.94),ty1=Math.round(top+(base-top)*(t+1)/T+2),hw=(3.5+t*3.1)*s;
   for(let y=ty0;y<=ty1;y++){const f=(y-ty0)/Math.max(1,ty1-ty0),half=hw*Math.pow(f,.85)+.6+(ih(y,t,sd)-.5)*.8;
    for(let x=-Math.ceil(half);x<=Math.ceil(half);x++){if(Math.abs(x)>half)continue;
     if(y>=ty1-1&&(((x+t*3+40)%4)<2)&&Math.abs(x)>1&&y===ty1)continue;// pontas caídas dos galhos
     if(y===ty1-1&&(((x+t*3+40)%4)===0)&&Math.abs(x)>half-2)continue;
     let kk=x<-half*.3?3:x>half*.35?1:2;
     if(y<ty0+3&&x<=0)kk=Math.min(4,kk+1);
     if(((x-y+80)%4===0)&&x<0)kk=Math.min(4,kk+1);else if(((x+y+80)%4===0)&&x>0)kk=Math.max(1,kk-1);// agulhas
     if(ih(x,y,sd)<.08)kk=Math.max(1,kk-1);
     if(y>ty1-3&&kk>1&&t<T-1)kk--;// sombra embaixo de cada camada
     b.a[y*W+ax+x]=kk}}}
  trInk(b,px,pal,0,0);
  if(snow)for(let t=0;t<T;t++){const ty0=Math.round(top+(base-top)*t/T*.94),hw=(3.5+t*3.1)*s;for(let x=-Math.ceil(hw*.7);x<=Math.ceil(hw*.5);x++){const yy=ty0+Math.round(Math.abs(x)/Math.max(1,hw)*(Math.max(1,(base-top)/T)))+1;px(ax+x,yy,x<0?'#f6fafc':'#d8e6ee');if(ih(x,t,5)<.5)px(ax+x,yy+1,'#e4eef4')}}
  split=Math.round(base-4);
 }
 const o={c,ax,ay,split};SPR.set(key,o);return o};
// ---------- contorno escuro nas construções (como no Stardew): escurece a borda de dentro da silhueta, uma vez por desenho em cache
function inkCanvas(cv,t,k){try{const g=cv.getContext('2d'),W=cv.width,H=cv.height,im=g.getImageData(0,0,W,H),D=im.data,A=new Uint8Array(W*H);
 for(let i=0;i<W*H;i++)A[i]=D[i*4+3];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(A[i]<200)continue;let e=0;
  for(let d=1;d<=t&&!e;d++){if(x-d<0||A[i-d]<40||x+d>=W||A[i+d]<40||y-d<0||A[i-d*W]<40||y+d>=H||A[i+d*W]<40)e=d}
  if(!e)continue;const f=e<t?k:k*.6,o=i*4;D[o]=D[o]*(1-f)+34*f;D[o+1]=D[o+1]*(1-f)+22*f;D[o+2]=D[o+2]*(1-f)+14*f}
 g.putImageData(im,0,0)}catch(e){}}
const _bcInk=bCached;bCached=function(g,b){if(RMODE!==4&&!inRoom()){const v=bVar(b),key=b.id+'|'+b.x+','+b.y+'|'+v+'|'+PS,c=BCACHE.get(key);if(c&&!c.ink){c.ink=1;c.sh=null;inkCanvas(c.cv,Math.max(1,Math.round(PS*.9)),.66)}}return _bcInk(g,b)};
// ---------- arbustos com a mesma copa de folhas
bushSprite=function(k,v){const key='B2'+k+v;if(SPR.has(key))return SPR.get(key);const W=22,H=16,c=mkCanvas(W,H),g=c.getContext('2d'),px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x|0,y|0,1,1)};
 for(let x=-8;x<=9;x++){g.fillStyle='rgba(20,30,10,.24)';g.fillRect(11+x,13,1,1);if(Math.abs(x)<7){g.fillStyle='rgba(20,30,10,.16)';g.fillRect(11+x,14,1,1)}}
 const cs=[[7,9,4.4],[15,9,4.2],[11,6.5,4.8],[11,10,4.6],[5+ih(v,1,3)*2,7,3]].sort((a,b)=>a[1]-b[1]),b=trBuf(W,H);
 trCanopy(b,cs,v*11+3,11,8,6.5);trInk(b,px,['#0c2a16','#215a28','#317834','#489840','#70b85a'],0,0);
 if(k)for(let i=0;i<5;i++){const x=5+((ih(i,v,9)*11)|0),y=4+((ih(v,i,9)*7)|0);px(x,y,'#ff8088');px(x+1,y,'#d83a48');px(x,y+1,'#9a1a2a')}
 const o={c};SPR.set(key,o);return o};
drawBush=function(g,t){const sp=bushSprite(t.k?1:0,(hs(Math.floor(t.x),Math.floor(t.y))*3)|0);g.drawImage(sp.c,t.x-11,t.y-13)};
