// ===== Passe de arte: chão por pixel, sprites sombreados, contornos, luz, chuva, fonte pixel =====
// ---------- utilidades
const ih=(x,y,s)=>{let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296};
function vn(x,y,s){const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
 const a=ih(x0,y0,s),b=ih(x0+1,y0,s),c=ih(x0,y0+1,s),d=ih(x0+1,y0+1,s);return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy}
const hex3=c=>{c=c.replace('#','');return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]};
const PAL={
 0:['#3f7a2e','#4c8a34','#5a9a3d','#69aa47','#82bf58'].map(hex3),
 1:['#2a5424','#32622a','#3b7232','#46823a','#579244'].map(hex3),
 3:['#86663f','#977449','#a88352','#b8935f','#caa672'].map(hex3),
 4:['#b2945a','#c3a46a','#d2b67e','#dec48e','#ead4a2'].map(hex3),
 5:['#aebfcc','#c2d1dc','#d6e2ea','#e6eef4','#f6faff'].map(hex3),
 6:['#344d23','#3f5a2b','#4b6836','#587741','#69884d'].map(hex3),
 red:['#9a6442','#a8704c','#b67e58','#c28c64','#cf9a72'].map(hex3),
 mud:['#3e3222','#4a3c2a','#564634','#62523e','#706048'].map(hex3),
 litter:['#7a4e24','#9a6a2a','#b0862e','#8a5a2a','#6a4a22'].map(hex3),
 sand:['#b49a64','#c4aa72','#d2b880','#ddc590','#e8d4a2'].map(hex3),
 wshal:hex3('#62b0dc'),wdeep:hex3('#244f8f'),ice:['#a8c8da','#bcd6e4','#cfe2ec','#e2eef4','#f4fafc'].map(hex3)
};
// ---------- fonte pixel 3x5
const PF={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'111111101101101',N:'101111111111101',O:'010101101101010',P:'110101110100100',Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110',' ':'000000000000000','.':'000000000000010','-':'000000111000000','!':'010010010000010','&':'010101010101011',"'":'010010000000000',':':'000010000010000','(':'001010010010001',')':'100010010010100','/':'001001010100100','º':'010101010000000'};
const pclean=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase();
const ptw=s=>pclean(s).length*4-1;
function ptext(g,s,x,y,c,sh){s=pclean(s);for(let i=0;i<s.length;i++){const gl=PF[s[i]]||PF[' '];for(let k=0;k<15;k++)if(gl[k]==='1'){const px=x+i*4+k%3,py=y+((k/3)|0);if(sh)Rr(g,sh,px+.5,py+.5,1,1);Rr(g,c,px,py,1,1)}}}
// ---------- CHÃO (ImageData por pixel)
prerender=function(){
 const GW=AW*TS,GH=(RZ-YMIN)*TS;GC=document.createElement('canvas');GC.width=GW;GC.height=GH;const g=GC.getContext('2d');// só a parte de fora (as salas têm desenho próprio)
 // profundidade da água (BFS por tile)
 const dep=new Float32Array(NT).fill(-1),q=[];
 for(let y=YMIN;y<RZ;y++)for(let x=XMIN;x<MW;x++){const i=ti(x,y);if(G[i]!==2)continue;let land=false;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx>=XMIN&&ny>=YMIN&&nx<MW&&ny<MH&&G[ti(nx,ny)]!==2)land=true}if(land){dep[i]=0;q.push(i)}}
 for(let h=0;h<q.length;h++){const i=q[h],x=tix(i),y=tiy(i);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<XMIN||ny<YMIN||nx>=MW||ny>=MH)continue;const j=ti(nx,ny);if(G[j]===2&&dep[j]<0){dep[j]=Math.min(4,dep[i]+1);q.push(j)}}}
 const depAt=(px,py)=>{const fx=px/16-.5,fy=py/16-.5,x0=Math.floor(fx),y0=Math.floor(fy),ax=fx-x0,ay=fy-y0;const s=(x,y)=>{if(x<XMIN||y<YMIN||x>=MW||y>=MH)return 0;const v=dep[ti(x,y)];return v<0?-.6:v};
  return (s(x0,y0)*(1-ax)+s(x0+1,y0)*ax)*(1-ay)+(s(x0,y0+1)*(1-ax)+s(x0+1,y0+1)*ax)*ay};
 const LF=new Float32Array(NT);for(let i=0;i<NT;i++)LF[i]=vn(tix(i)/5.5,tiy(i)/5.5,123);
 const lfAt=(px,py)=>{const fx=px/16-.5,fy=py/16-.5,x0=Math.floor(fx),y0=Math.floor(fy),ax=fx-x0,ay=fy-y0,s2=(x,y)=>x<XMIN||y<YMIN||x>=MW||y>=MH?.5:LF[ti(x,y)];
  return (s2(x0,y0)*(1-ax)+s2(x0+1,y0)*ax)*(1-ay)+(s2(x0,y0+1)*(1-ax)+s2(x0+1,y0+1)*ax)*ay};
 const land=t=>t!==2,grassy=t=>t===0||t===1||t===4||t===5||t===6;
 let wcT=-1,wcV=false,wLand=0,wNarV=false;const wNear=(tx,ty)=>{const i=ti(tx,ty);if(i===wcT)return wcV;wcT=i;wcV=false;wNarV=true;
  for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[1,-1],[-1,1],[1,1]]){const n=gt(tx+a,ty+b);if(n>=0&&n!==2){if(!wcV)wLand=n;wcV=true}}
  for(const[a,b]of[[2,0],[-2,0],[0,2],[0,-2],[1,1],[-1,-1],[1,-1],[-1,1]]){const j=gt(tx+a,ty+b)===2?dep[ti(tx+a,ty+b)]:-1;if(j>=1){wNarV=false;break}}return wcV};
 const wNar=()=>wNarV;
 let lfC=.5;
 const gt=(x,y)=>(x<XMIN||y<YMIN||x>=MW||y>=MH)?-1:G[ti(x,y)];
 const SH=256;// desenha em faixas para gastar menos memória no celular
 for(let sy=0;sy<GH;sy+=SH){const hh=Math.min(SH,GH-sy),img=g.createImageData(GW,hh),D=img.data;let o=0;
 for(let py=sy+YMIN*TS;py<sy+hh+YMIN*TS;py++){const ty=py>>4,ly=py&15;
  if(ty>=RZ-1){for(let px0=0;px0<GW;px0++,o+=4){D[o]=11;D[o+1]=8;D[o+2]=6;D[o+3]=255}continue}
  for(let px=XMIN*TS;px<MW*TS;px++,o+=4){
   const tx=px>>4,lx=px&15;let t=G[ti(tx,ty)],m=t;const jn=ih(px,py,7),en=vn(px/3.3,py/3.3,11);
   // transições
   if(t===3||t===2||t===0||t===1||t===4||t===6||t===5){
    const nb=[[lx,gt(tx-1,ty)],[15-lx,gt(tx+1,ty)],[ly,gt(tx,ty-1)],[15-ly,gt(tx,ty+1)]];
    for(const[d,n]of nb){if(n<0||n===t)continue;
     if(t===3&&grassy(n)){if(d<1.2+en*3.2){m=n;break}}
     else if(t===2&&land(n)&&tx>=100&&ty<=40){const w=1.6+en*2.6;if(d<w){m=100+n;break}else if(d<w+1.4){m=200;}}
     else if(t!==2&&t!==3&&grassy(n)&&n!==t){if(d<7&&jn<(1-d/7)*.5)m=n}
    }
    if(t===2&&m===2&&!(tx>=100&&ty<=40)&&wNear(tx,ty)){// margem orgânica: campo de profundidade suavizado + ondulação
     const d=depAt(px,py),e=d<0?(d+.3)/.6*16:8+d*16,amp=wNar(tx,ty)?4:12,wob=(vn(px/18,py/18,31)-.5)*amp+(vn(px/5,py/5,33)-.5)*2.5,v=e+wob;
     if(v<3.6)m=100+wLand;else if(v<5)m=200}
    if(t===3&&m===3){for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const n=gt(tx+a,ty+b);if(!grassy(n)||gt(tx+a,ty)!==3||gt(tx,ty+b)!==3)continue;const cx=a<0?lx:15-lx,cy=b<0?ly:15-ly;if(Math.hypot(cx,cy)<1.6+en*2.4){m=n;break}}}
   }
   let r,gg,bb;
   if(m===2||m===200){
    const mtn=tx>=100&&ty<=40;
    if(mtn){const P=PAL.ice,v=vn(px/10,py/10,5);let k=Math.min(4,Math.max(0,(v*3.4+(jn-.5)*.5+1)|0));if(Math.abs(vn(px/9,py/9,9)-.5)<.018)k=4;if(m===200)k=4;[r,gg,bb]=P[k]}
    else{const d=Math.max(0,depAt(px,py)),f=Math.min(1,Math.max(0,d/2.6+(vn(px/22,py/11,3)-.5)*.22));
     r=PAL.wshal[0]+(PAL.wdeep[0]-PAL.wshal[0])*f;gg=PAL.wshal[1]+(PAL.wdeep[1]-PAL.wshal[1])*f;bb=PAL.wshal[2]+(PAL.wdeep[2]-PAL.wshal[2])*f;
     const sh=(d>.4&&ih(px>>2,py,41)<.01?16:0)+(d>.4&&ih((px+2)>>2,py-1,41)<.01?-8:0);r+=sh;gg+=sh;bb+=sh;
     if(m===200){r=r*.55+230*.45;gg=gg*.55+240*.45;bb=bb*.55+250*.45}}
   }else if(m>=100){
    const n=m-100,P=n===5?PAL.ice:n===6?PAL.mud:n===4?PAL.sand:n===1?PAL.mud:PAL.sand;[r,gg,bb]=P[Math.min(4,(1+vn(px/4,py/4,2)*2.5+(jn-.5)*.8)|0)];
   }else{
    let P=PAL[m]||PAL[0],v=vn(px/7,py/7,m+1)*.65+vn(px/23,py/23,m+31)*.35,k=v*3.3+(jn-.5)*.9+.35;
    if(m===0||m===1||m===6||m===4||m===5){if((px&3)===0)lfC=lfAt(px,py);k+=(lfC-.5)*(m===5?1:1.7)}
    if(m===4){const rv=vn(px/26,py/26,77)+(en-.5)*.05;if(rv>.6){const e=rv-.665;if(e>.025||(e>-.045&&jn<(e+.045)/.07)){P=PAL.red;k=vn(px/5,py/5,8)*3+(jn-.5)+(e<.04?.6:0)}}}
    if(m===6&&vn(px/18,py/18,61)>.7){P=PAL.mud;k=vn(px/5,py/5,8)*3}
    if(m===1&&ih(px,py,21)<.07){P=PAL.litter;k=ih(px,py,22)*4.99}
    let kk=Math.max(0,Math.min(4,k|0));
    if(m===0||m===1||m===6){const b0=ih(px,py,3)<.045,b1=ih(px,py+1,3)<.045,b2=ih(px,py-1,3)<.045;if(b0||b1)kk=Math.min(4,kk+(b0?2:1));else if(b2)kk=Math.max(0,kk-1)}
    if(m===4&&(ih(px,py,3)<.035||ih(px,py+1,3)<.035))kk=4;
    if(m===3){if(jn<.012)kk=4;else if(ih(px,py-1,7)<.012)kk=0}
    if(m===5&&jn<.004)kk=4;
    [r,gg,bb]=P[kk];
   }
   D[o]=r;D[o+1]=gg;D[o+2]=bb;D[o+3]=255;
  }
 }
 g.putImageData(img,0,sy)}
 g.setTransform(1,0,0,1,-XMIN*TS,-YMIN*TS);// daqui em diante desenha em coordenadas do mundo
 const ps0=PS;PS=1;
 for(let y=YMIN+1;y<RZ-1;y++)for(let x=XMIN+1;x<MW-1;x++){
  const t=G[ti(x,y)],bx=x*TS,by=y*TS,h=hs(x*13+5,y*7+3);
  if(t===0&&h<.06){const c=['#f0e060','#fff','#e87ab0','#a88ae0'][(h*70|0)%4];for(let i=0;i<3;i++){const fx=bx+3+((hs(x+i,y)*10)|0),fy=by+3+((hs(y+i,x)*10)|0);Rr(g,'#2f6a28',fx,fy+1,1,2);Rr(g,c,fx,fy,1,1);Rr(g,c,fx+1,fy+.5,.6,.6)}}
  if(t===2&&!(x>=100&&y<=40)&&(x>=100||x<30)&&adjW(x,y)&&h<.25){const lx=bx+3+((h*20)|0)%8,ly=by+4+((h*40)|0)%7;Rr(g,'#2f7a32',lx,ly,5,3);Rr(g,'#3e9a3e',lx+1,ly,3,1);Rr(g,'#1f5a24',lx+2,ly+1,2,1);if(h<.1){Rr(g,'#f08ab0',lx+1,ly-1,2,2);Rr(g,'#ffd0e0',lx+1,ly-1,1,1)}}
  if(t===5&&h<.05){Rr(g,'#7a8088',bx+5,by+8,7,4);Rr(g,'#9aa2aa',bx+6,by+8,4,1);Rr(g,'#f4f8fa',bx+5,by+7,6,1.5)}
 }
 PS=ps0;
};
// ---------- sprites cacheados (árvores e arbustos)
const SPR=new Map();
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function blobFill(px,w,h,circles,pal,seed,lightOnly){
 // circles: [cx,cy,r]; pal: [outline,dark,mid,light,hi]
 const own=new Int16Array(w*h).fill(-1);
 circles.forEach((c,ci)=>{for(let y=Math.max(0,c[1]-c[2]-1|0);y<Math.min(h,c[1]+c[2]+2);y++)for(let x=Math.max(0,c[0]-c[2]-1|0);x<Math.min(w,c[0]+c[2]+2);x++){const dx=x+.5-c[0],dy=y+.5-c[1],d=Math.hypot(dx,dy)+(ih(x,y,seed)-.5)*1.3;if(d<=c[2])own[y*w+x]=ci}});
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ci=own[y*w+x];if(ci<0)continue;const c=circles[ci],nx=(x+.5-c[0])/c[2],ny=(y+.5-c[1])/c[2];
  let L=-(nx*.6+ny*.8)+.15+(ih(x,y,seed+3)-.5)*.5;const below=y+1<h?own[(y+1)*w+x]:-1;
  let k=L>.55?4:L>.15?3:L>-.35?2:1;if(below>=0&&below!==ci&&circles[below][1]>c[1])k=Math.max(1,k-1);
  if(ih(x,y,seed+9)<.08)k=Math.max(1,k-1);
  const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const xx=x+a,yy=y+b;return xx<0||yy<0||xx>=w||yy>=h||own[yy*w+xx]<0});
  px(x,y,edge&&!lightOnly?pal[0]:pal[k]);}
}
function treeSprite(k,v,s,dry,snow){
 const key=k+'|'+v+'|'+s+'|'+dry+'|'+snow;if(SPR.has(key))return SPR.get(key);
 const W=48,H=72,ax=24,ay=66,c=mkCanvas(W,H),g=c.getContext('2d'),px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)},R=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
 const sd=v*97+k*13+(dry?5:0);
 // sombra
 for(let y=-3;y<=2;y++)for(let x=-12;x<=13;x++){if((x/12.5)**2+(y/3)**2<1&&ih(x,y,1)>.15){g.fillStyle='rgba(0,0,0,'+(.22-Math.abs(y)*.03)+')';g.fillRect(ax+x+2,ay+y,1,1)}}
 const trunk=(h,w,col)=>{const bark=hex3(col);for(let y=0;y<h;y++)for(let x=-Math.ceil(w/2);x<Math.floor(w/2);x++){let f=x<-w/4?1.15:x>w/5?.75:.95;if(ih(x,y,sd)<.18)f*=.8;if(y>h-3&&Math.abs(x)>=w/2-1){}px(ax+x,ay-y,'rgb('+bark.map(q=>Math.min(255,q*f|0))+')')}
  px(ax-Math.ceil(w/2)-1,ay,col);px(ax+Math.floor(w/2),ay,col);R('#1e140c',ax-Math.ceil(w/2)-1,ay+1,w+2,1)};
 let split=ay-8;
 if(k===1||k===7){
  const pal=dry?(k===7?['#2a2a12','#5a6428','#6e7a30','#8a9438','#a8b048']:['#2a3010','#5a6a24','#728030','#8a9a3a','#a8b44a']):(k===7?['#14301a','#2e5a2a','#3e7232','#548a3c','#6ea048']:['#12321a','#265e2a','#347a34','#4c963e','#6eb455']);
  trunk(k===7?13:12,k===7?5:4,k===7?'#4a3020':'#5a3a22');
  if(k===7){R('#4a3020',ax-6,ay-15,6,2);R('#4a3020',ax+2,ay-17,5,2)}
  const r0=(k===7?7.5:10)*s,cy=ay-(k===7?20:24)*s,cs=[];const n=k===7?5:6;
  for(let i=0;i<n;i++){const an=ih(i,v,sd)*6.28,dd=(i?r0*.62:0);cs.push([ax+Math.cos(an)*dd*1.1,cy+Math.sin(an)*dd*.7-(i?2:0),(i?r0*(.55+ih(v,i,sd)*.25):r0)])}
  cs.sort((a,b)=>a[1]-b[1]);blobFill(px,W,H,cs,pal,sd);
  split=Math.round(cy+r0*.9);
  if(!dry&&k===1&&v%2===0)for(let i=0;i<4;i++){const fx=ax-6+((ih(i,v,4)*12)|0),fy=cy-4+((ih(v,i,4)*8)|0);px(fx,fy,'#d84a5a');px(fx+1,fy,'#a82a3a')}
 }else if(k===0||k===2){
  trunk(7,3,'#4a3020');
  const pal=k===2?['#0e261e','#1f4a3a','#2a5a48','#3a6e58','#4e8670']:dry?['#10261a','#244a26','#2e5a2e','#3e6e36','#54843e']:['#0c2416','#1e4a26','#285e2e','#36743a','#4c8c46'];
  const tiers=4,base=ay-6,top=ay-46*s;
  for(let t=0;t<tiers;t++){const ty0=top+(base-top)*t/tiers-2,ty1=top+(base-top)*(t+1)/tiers+3,hw=(5+t*3.2)*s;
   for(let y=Math.floor(ty0);y<=ty1;y++){const f=(y-ty0)/(ty1-ty0),half=hw*f+.6+(ih(y,t,sd)-.5)*1.4;for(let x=-Math.ceil(half);x<=Math.ceil(half);x++){if(Math.abs(x)>half)continue;const edge=Math.abs(x)>half-1||y>=ty1-.5;let kk=x<-half*.3?3:x>half*.35?1:2;if(y<ty0+2&&x<0)kk=4;if(ih(x,y,sd)<.1)kk=Math.max(1,kk-1);
    let col=edge?pal[0]:pal[kk];if(snow&&(y-ty0<3+(ih(x,t,5)*2)|0)&&!edge)col=x<0?'#f6fafc':'#d8e6ee';if(snow&&edge&&y-ty0<2)col='#b8ccd8';px(ax+x,y,col)}}}
  split=Math.round(base-4);
 }else if(k===3){
  const P=['#1c3a14','#3a6a24','#4a8030','#5e9a3c','#7ab84e'],col=(x,y,w,h)=>{for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const e=xx===0||xx===w-1||yy===0;const kk=e?0:xx<w/3?4:xx>w*.66?1:(xx%2?2:3);px(x+xx,y+yy,P[kk])}};
  const hh=Math.round(24*s);col(ax-3,ay-hh,6,hh);col(ax-9,ay-hh*.7|0,4,8);col(ax-9,ay-hh*.45|0,7,3);col(ax+4,ay-hh*.55|0,4,9);col(ax+3,ay-hh*.3|0,6,3);
  if(v%2)for(let i=0;i<3;i++)px(ax-1+i,ay-hh-1,i===1?'#f0d040':'#e87ab0');split=ay;
 }else if(k===4){
  const hh=Math.round(34*s);for(let y=0;y<hh;y++){const c2=y%4<2?'#7a6a4a':'#5e4e34';R(c2,ax-1,ay-y,3,1);px(ax+1,ay-y,'#4a3c28')}
  const ty=ay-hh,P=['#1a3a1a','#2e6a2e','#3e8a3a','#58a84a'];
  for(let a=0;a<11;a++){const an=-Math.PI*1.02+a*Math.PI*1.04/10;for(let r=2;r<14;r++){const x=ax+Math.cos(an)*r,y=ty+Math.sin(an)*r*.75+(r>8?(r-8)*.6:0);px(x|0,y|0,r>12?P[0]:P[a%2?1:2]);if(r%2===0)px((x+Math.cos(an+1.57)*1.2)|0,(y+1)|0,P[3])}}
  R('#2e6a2e',ax-2,ty-1,5,3);for(let i=0;i<5;i++)R(i%2?'#c8601a':'#a84a14',ax-3+i*1.4|0,ty+2+(i%2),2,2);split=ty+4;
 }else if(k===5){
  trunk(10,3,'#3e2a1c');R('#3e2a1c',ax-5,ay-14,5,2);R('#3e2a1c',ax+1,ay-16,5,2);R('#3e2a1c',ax-6,ay-17,2,3);R('#3e2a1c',ax+5,ay-19,2,3);
  const pink=v%3===0,pal=dry?(pink?['#5a1a3a','#b04a80','#d064a0','#ec8ac0','#ffc0e0']:['#5a4210','#c09018','#e0b020','#f4d040','#fff090']):['#14321a','#2e6a2e','#3e8236','#56a044','#76b85a'];
  const cs=[[ax-6,ay-22*s,6*s],[ax+5,ay-23*s,6*s],[ax,ay-27*s,7*s],[ax-1,ay-21*s,5*s]];cs.sort((a,b)=>a[1]-b[1]);blobFill(px,W,H,cs,pal,sd);split=Math.round(ay-17*s);
  if(dry)for(let i=0;i<6;i++)px(ax-9+((ih(i,v,7)*18)|0),ay+((ih(v,i,7)*3)|0)-1,pal[3]);
 }else{
  const col='#6e665e',dk='#4e4842';for(let y=0;y<24*s;y++){R(col,ax-1,ay-y,3,1);px(ax+1,ay-y,dk)}
  const br=[[ax-1,ay-16*s,-1],[ax+1,ay-13*s,1],[ax,ay-21*s,-1],[ax+1,ay-19*s,1]];br.forEach(([x,y,d],i)=>{for(let j=0;j<7-i;j++){px(x+d*j,y-j*.6|0,j>4?dk:col);if(snow&&j%2===0)px(x+d*j,(y-j*.6|0)-1,'#f4f8fa')}});split=ay;
 }
 const o={c,ax,ay,split};SPR.set(key,o);return o;
}
const isSnowAt=(x,y)=>Math.floor(x/TS)>=100&&Math.floor(y/TS)<=40;
drawTree=function(g,t){
 const v=(hs(Math.floor(t.x),Math.floor(t.y))*4)|0,s=t.s>1.12?1.2:t.s<.95?.9:1.05,dry=!isWet()&&t.k!==0&&t.k!==2&&t.k!==3?1:0,snow=(t.k===2||t.k===6)&&isSnowAt(t.x,t.y)?1:0;
 const sp=treeSprite(t.k,v,s,dry,snow),x=t.x-sp.ax,y=t.y-sp.ay;
 const behind=P.y<t.y-2&&P.y>t.y-58&&Math.abs(P.x-t.x)<14&&(t.k===0||t.k===1||t.k===2||t.k===4||t.k===5||t.k===7);
 const sw=(t.k===3||t.k===6)?0:Math.sin(frame/55+t.x*.07)*.45*(S.weather==='chuva'?2:1);
 if(behind)g.globalAlpha=.5;
 g.drawImage(sp.c,0,sp.split,48,72-sp.split,x,y+sp.split,48,72-sp.split);
 g.drawImage(sp.c,0,0,48,sp.split,x+sw,y,48,sp.split);
 g.globalAlpha=1;
};
function bushSprite(k,v){const key='b'+k+v;if(SPR.has(key))return SPR.get(key);const c=mkCanvas(20,14),g=c.getContext('2d'),px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)};
 for(let x=-8;x<=8;x++)if(ih(x,v,2)>.2){g.fillStyle='rgba(0,0,0,.2)';g.fillRect(10+x,12,1,1)}
 blobFill(px,20,14,[[7,8,4.2],[13,8,4],[10,6,4.6]].sort((a,b)=>a[1]-b[1]),['#12321a','#265e2a','#347a34','#4c963e','#6eb455'],v*11+3);
 if(k)for(let i=0;i<4;i++){const x=5+((ih(i,v,9)*10)|0),y=4+((ih(v,i,9)*6)|0);px(x,y,'#d84a5a');px(x,y+1,'#8a1a2a')}
 const o={c};SPR.set(key,o);return o}
function drawBush(g,t){const sp=bushSprite(t.k?1:0,(hs(Math.floor(t.x),Math.floor(t.y))*3)|0);g.drawImage(sp.c,t.x-10,t.y-12)}
// ---------- gado
drawCow=function(g,a,x,y,dir,f,mini){
 const B=BREEDS[a.breed],calf=a.age<240,bull=a.sex==='M'&&a.age>=400,c=B.col,lt=shade(c,22),dk=shade(c,-30),dd=shade(c,-55),Wd=calf?11:17,face=B.face||c;
 const r=(col,dx,dy,w,h)=>Rr(g,col,dir>0?x+dx:x+Wd-dx-w,y+dy,w,h);
 const tsw=Math.sin(frame/12+a.id)*.8,graze=!f&&((frame+a.id*37)%600)<180;
 Rr(g,'rgba(0,0,0,.26)',x,y+(calf?7.5:9.5),Wd,1.6);
 if(calf){
  [[1,0],[3,1],[6,1],[8,0]].forEach(([dx,i])=>{r(i?dk:dd,dx,5,1,(i+f)%2?2.5:2);r('#2a1c14',dx,7,1,.6)});
  r(c,1,2,7,3.5);r(lt,2,2,5,1);r(dk,1,4.6,7,.6);r(dk,0,2.5,1,2+tsw*.3);
  const hy=graze?2:0;r(c,6,1+hy,2,3);r(face,7,1+hy,3,3);r(shade(face,-25),7,1+hy,1,1.5);r('#e8a0a0',9.6,2.6+hy,.8,1.4);r('#111',8.4,1.8+hy,.8,.8);
  if(B.spot){r(B.spot,2,2,2,2);r(B.spot,5,3,1.5,1.5)}
 }else{
  const lg=i=>(i+f)%2?3.2:2.6;
  [[2,1],[4,0],[11,1],[13,0]].forEach(([dx,far],i)=>{r(far?dd:dk,dx,6.6,1.4,lg(i));r('#2a1c14',dx,6.6+lg(i)-.6,1.4,.7)});
  r(c,1,2,11,5);r(c,2,1.5,9,.6);r(lt,2,2,9,1);r(shade(c,8),2,3,6,1);r(dk,2,6,9,1);r(dk,1,6,1,.8);
  if(a.sex==='F'&&!calf)r('#e8a0a8',4.5,6.8,2,1);
  if(B.hump){r(c,8,0,3.4,2.2);r(lt,8.4,0,2.2,.8)}
  if(B.spot){r(B.spot,3,2,3,2.4);r(B.spot,7,4,2.4,2);r(B.spot,4.5,5,1.6,1);r(B.spot,9.6,2.2,1.4,1.6)}
  r(dk,0,2.5,1,3+tsw*.4);r(dd,-.4+tsw*.3,5.4,1.4,1.4);
  const hy=graze?3:0;
  r(c,11,1+hy*.5,2.4,4);if(B.hump)r(dk,11.5,5.4,1.4,1.6);
  r(face,12,1+hy,4,3.6);r(shade(face,15),12.4,1+hy,2,1);r(shade(face,-20),12,3.8+hy,4,.8);
  r(B.tier>=3||B.hump?shade(face,-35):'#e8a0a0',15,2.6+hy,1.6,2);r('#2a1010',16,3+hy,.6,.6);
  r('#111',13.8,2+hy,.9,.9);r('#fff',13.8,2+hy,.4,.4);
  if(B.hump)r(dk,11.6,2.4+hy,1,2.4);else r(dk,11.2,1.6+hy,1.2,1);
  if(bull||B.tier>=3){r('#f2ecd8',12.4,0+hy,1,1);r('#d8d0b8',13.4,-.6+hy,.8,.8)}
 }
 const ix=x+(Wd>>1)-1;
 if(a.sick){Rr(g,'#e33',ix,y-6,3,1);Rr(g,'#e33',ix+1,y-7,1,3);}
 else if(a.preg)Rr(g,'#f08ac0',ix,y-5,3,2);
 if(a.title)Rr(g,'#ffd75e',ix+4,y-6,2,2);
 if(a.breeder)Rr(g,'#5fa8ff',ix-3,y-5,2,2);
};
// ---------- prédios
const CURT={house:'#d86a6a',leilao:'#e0c070',banco:'#6a8ad8',agro:'#7ac07a',delegacia:'#8a8aa0',padaria:'#f0a0a0',vet:'#a0d8c0',canil:'#e0b080',igreja:'#c8a0e0',h1:'#e87ab0',h2:'#7ab0e8',h3:'#f0d040',h4:'#a0e0a0',lodge:'#a06030',posto:'#906040',pescador:'#60a0c0'};
function drawBuildingArt(g,b){
 const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,wall=b.wall,roof=b.roof,dx=b.door*TS-x;
 Rr(g,'rgba(0,0,0,.22)',x+3,y+h-1,w,5);Rr(g,'rgba(0,0,0,.12)',x+w,y+16,4,h-14);
 // parede
 Rr(g,wall,x,y+14,w,h-14);
 if(b.log){for(let i=14;i<h;i+=5){Rr(g,shade(wall,14),x,y+i,w,1);Rr(g,shade(wall,-28),x,y+i+4,w,1);Rr(g,shade(wall,-40),x-1,y+i+1,2,3);Rr(g,shade(wall,-40),x+w-1,y+i+1,2,3)}}
 else for(let i=0;i<w;i+=5){Rr(g,shade(wall,-14),x+i,y+14,1,h-14);Rr(g,shade(wall,8),x+i+1,y+14,1,h-14);if(hs(i,b.x)<.3)Rr(g,shade(wall,-8),x+i+2,y+16+((hs(b.y,i)*20)|0),2,1)}
 Rr(g,'rgba(0,0,0,.28)',x,y+14,w,3);Rr(g,'rgba(0,0,0,.12)',x,y+17,w,2);
 Rr(g,'#7a7468',x-1,y+h-3,w+2,3);for(let i=0;i<w;i+=6)Rr(g,'#5e584e',x+i+((i/6)%2?3:0),y+h-3,1,3);Rr(g,'#9a948a',x-1,y+h-3,w+2,.7);
 Rr(g,shade(wall,-45),x-1,y+14,1,h-14);Rr(g,shade(wall,-45),x+w,y+14,1,h-14);
 // telhado
 const rd=shade(roof,-22),rl=shade(roof,18);
 for(let r=0;r<14;r+=2){Rr(g,r<2?rl:roof,x-3,y+r,w+6,2);const off=(r/2)%2?2:0;for(let i=-3+off;i<w+3;i+=4)Rr(g,rd,x+i,y+r,1,2);Rr(g,shade(roof,-12),x-3,y+r+1.4,w+6,.6)}
 Rr(g,rl,x-3,y,w+6,.8);Rr(g,shade(roof,-45),x-4,y-1,w+8,1);Rr(g,shade(roof,-45),x-4,y,1,14);Rr(g,shade(roof,-45),x+w+3,y,1,14);
 Rr(g,shade(roof,-40),x-3,y+13,w+6,2);Rr(g,'rgba(0,0,0,.35)',x-3,y+15,w+6,1);
 // porta
 Rr(g,shade(wall,-50),x+dx-1,y+h-25,18,25);Rr(g,'#3a2616',x+dx,y+h-24,16,24);Rr(g,'#6a4a2a',x+dx+2,y+h-22,12,22);
 Rr(g,'#7a5a36',x+dx+3,y+h-21,4,8);Rr(g,'#7a5a36',x+dx+9,y+h-21,4,8);Rr(g,'#7a5a36',x+dx+3,y+h-11,4,8);Rr(g,'#7a5a36',x+dx+9,y+h-11,4,8);
 Rr(g,'#5a3a1e',x+dx+2,y+h-22,1,22);Rr(g,'#f0c040',x+dx+12,y+h-11,1.5,1.5);
 Rr(g,'#8a8478',x+dx-2,y+h,20,2);Rr(g,'#a8a294',x+dx-2,y+h,20,.7);
 // janelas
 const cu=CURT[b.id]||'#d86a6a';
 for(let wx=x+8;wx<x+w-14;wx+=24)if(Math.abs(wx-(x+dx))>20){
  Rr(g,shade(wall,-55),wx-1,y+h-33,15,14);Rr(g,'#f0e8d8',wx,y+h-32,13,12);Rr(g,'#2a4a6a',wx+1,y+h-31,11,10);
  Rr(g,'#5a8ab8',wx+1,y+h-31,11,5);Rr(g,'#8ac0e8',wx+1,y+h-31,5,3);Rr(g,'#d0ecff',wx+2,y+h-30,2,1);
  Rr(g,'#f0e8d8',wx+6,y+h-31,1,10);Rr(g,'#f0e8d8',wx+1,y+h-26,11,1);
  Rr(g,cu,wx+1,y+h-31,2,9);Rr(g,cu,wx+10,y+h-31,2,9);Rr(g,shade(cu,-30),wx+2.4,y+h-31,.6,9);
  Rr(g,shade(wall,-30),wx-1,y+h-20,15,2);Rr(g,shade(wall,20),wx-1,y+h-20,15,.7);
 }
 if(b.id==='barn'){Rr(g,'#f3ead8',x+dx-2,y+22,20,2);Rr(g,'#f3ead8',x+dx-2,y+h-2,20,2);for(let i=0;i<16;i++){Rr(g,'#f3ead8',x+dx+i,y+h-24+((i*24/16)|0),1,1);Rr(g,'#f3ead8',x+dx+15-i,y+h-24+((i*24/16)|0),1,1)}}
 if(b.sign){const tw=ptw(b.sign)+6;Rr(g,'#1e140c',x+w/2-tw/2-1,y+2,tw+2,11);Rr(g,'#4a3020',x+w/2-tw/2,y+3,tw,9);Rr(g,'#6a4428',x+w/2-tw/2,y+3,tw,1);ptext(g,b.sign,x+w/2-tw/2+3,y+5,'#ffd75e','#1e140c')}
 if(b.id==='house'){Rr(g,'#7a3a2a',x+w-11,y+1,7,13);for(let i=0;i<13;i+=2)Rr(g,'#5a2a1e',x+w-11+(i%4?0:3),y+1+i,3,.6);Rr(g,'#4a2418',x+w-12,y,9,2)}
}
drawBuilding=function(g,b){drawBuildingArt(g,b);bldExtra(g,b)};
// ---------- NPCs com corpo completo
const NPCLOOK={joao:{hat:'#3a2a1a',pants:'#2a2a3a'},lourdes:{g:'f',skin:'#c88a60'},ramos:{hat:'#222',pants:'#222'},marina:{g:'f'},tiao:{hat:'#d8c080',skin:'#a86a40'},ze:{hat:'#c8a860',skin:'#d8a070'},bisc:{},zeca:{hat:'#2a5a7a',skin:'#b07a50'},guarda:{hat:'#3a5a2a',pants:'#3a4a2a'}};
const _dnpc=drawNPC;
drawNPC=function(g,n){
 if(n.kid)return _dnpc(g,n);
 if(n._lx===undefined){n._lx=n.x;n._ly=n.y;n._ph=0;n._d=0}
 const mx=n.x-n._lx,my=n.y-n._ly,md=Math.hypot(mx,my);if(md>.01){n._ph+=md*.14;n._d=Math.abs(mx)>Math.abs(my)?(mx>0?3:2):(my>0?0:1)}n._lx=n.x;n._ly=n.y;
 const L=NPCLOOK[n.id]||{};
 drawPerson(g,{x:n.x,y:n.y,dir:n._d,ph:n._ph,mv:n.mv,shirt:n.col,hair:n.hair,hat:L.hat,pants:L.pants,g:L.g,skin:L.skin});
 if(n.id==='lourdes'){Rr(g,'#fff',n.x-3,n.y-11,6,5)}
 if(n.id==='marina'){Rr(g,'#f4f4f4',n.x-4,n.y-14,1.5,9);Rr(g,'#f4f4f4',n.x+2.5,n.y-14,1.5,9)}
 const flag=npcHasQuest(n.id)||(S.tut<TUT.length&&TUT[S.tut].npc===n.id);
 if(flag){const b=(frame>>4)&1;Rr(g,'#1e140c',n.x-1.5,n.y-34-b,3,8);Rr(g,'#ffd75e',n.x-1,n.y-33.5-b,2,5);Rr(g,'#ffd75e',n.x-1,n.y-27.5-b,2,1.5)}
};
// ---------- contorno (outline) para personagens e animais
let LOWQ=0;
const OC=mkCanvas(64,64),oc=OC.getContext('2d'),OS=mkCanvas(64,64),os=OS.getContext('2d');
function OL(g,cx,bottom,w,h,fn){
 if(LOWQ>1){fn(g);return}
 RMODE=4;try{fn(g)}catch(e){}RMODE=1;try{fn(g)}finally{RMODE=0}
}
const _dm2=drawMate;drawMate=function(g){OL(g,MATE.x,MATE.y+3,30,40,c=>_dm2(c))};
const _dp2=drawPeon;drawPeon=function(g){OL(g,PEON.x,PEON.y+3,30,40,c=>_dp2(c))};
// ---------- cerca, cocho, fonte, caixa, casinha do cão, solo
function drawFence(g,px,py,fs){
 Rr(g,'rgba(0,0,0,.18)',px,py+13,TS,2);
 Rr(g,shade(fs.r,-35),px,py+6,TS,2.4);Rr(g,fs.r,px,py+5,TS,1.6);Rr(g,shade(fs.r,25),px,py+5,TS,.6);
 Rr(g,shade(fs.r,-35),px,py+11,TS,2.4);Rr(g,fs.r,px,py+10,TS,1.6);Rr(g,shade(fs.r,25),px,py+10,TS,.6);
 Rr(g,shade(fs.p,-40),px+5.5,py+2,4,12.5);Rr(g,fs.p,px+6,py+2,3,12);Rr(g,shade(fs.p,25),px+6,py+2,1,12);Rr(g,shade(fs.p,35),px+6,py+1.4,3,1);
 if(fs.base){Rr(g,'#7e7e86',px,py+13,TS,3);Rr(g,'#a8a8b0',px,py+13,TS,.8);for(let i=0;i<TS;i+=5)Rr(g,'#5e5e66',px+i,py+13,.6,3)}
}
function drawTrough(g){const T=TROUGH;Rr(g,'rgba(0,0,0,.2)',T.x+1,T.y+T.h,T.w,2);Rr(g,'#4a2e18',T.x-1,T.y-1,T.w+2,T.h+2);Rr(g,'#7a5232',T.x,T.y,T.w,T.h);Rr(g,'#9a6a40',T.x,T.y,T.w,1);
 for(let i=6;i<T.w;i+=8)Rr(g,'#5a3a22',T.x+i,T.y,1,T.h);Rr(g,'#2a1a0e',T.x+2,T.y+2,T.w-4,5);
 if(S.feed>5){const fw=Math.max(3,(T.w-4)*Math.min(1,S.feed/Math.max(50,siloCap())));Rr(g,'#c9a24a',T.x+2,T.y+2,fw,5);for(let i=0;i<fw;i+=2)Rr(g,i%4?'#e0bc60':'#a8862e',T.x+2+i,T.y+2+((i*7)%4),1,1)}}
function drawFountain(g,fx,fy){
 Rr(g,'rgba(0,0,0,.2)',fx+2,fy+30,32,4);Rr(g,'#5e646c',fx-1,fy-1,34,34);Rr(g,'#a8aeb6',fx,fy,32,32);Rr(g,'#c8ced6',fx,fy,32,1.5);
 for(let i=0;i<32;i+=6){Rr(g,'#8a9098',fx+i,fy,.7,3);Rr(g,'#8a9098',fx+i+3,fy+29,.7,3)}
 Rr(g,'#4a5058',fx+3,fy+3,26,26);Rr(g,'#3a7ab8',fx+4,fy+4,24,24);Rr(g,'#5aa0d8',fx+4,fy+4,24,6);
 for(let k=0;k<3;k++){const rr=((frame/3+k*9)%12)+3;g.globalAlpha=Math.max(0,.6-rr/20);Rr(g,'#d8f0ff',fx+16-rr,fy+16,rr*2,.6);Rr(g,'#d8f0ff',fx+16-rr*.7,fy+16-rr*.6,rr*1.4,.6);Rr(g,'#d8f0ff',fx+16-rr*.7,fy+16+rr*.6,rr*1.4,.6)}g.globalAlpha=1;
 Rr(g,'#7a8088',fx+13,fy+10,6,14);Rr(g,'#a8aeb6',fx+13,fy+10,2,14);Rr(g,'#c8ced6',fx+11,fy+9,10,2);
 for(let i=0;i<5;i++){const t=((frame*.6+i*7)%18)/18,a=i*1.26;Rr(g,'rgba(220,240,255,'+(.9-t*.7).toFixed(2)+')',fx+16+Math.cos(a)*t*8,fy+5+t*t*10-Math.sin(t*3.1)*6,1.2,1.2)}
 Rr(g,'#e8f6ff',fx+15,fy+3+((frame>>2)&1),2,6);
}
function drawShipBox(g){const X0=SHIPBOX.x,Y0=SHIPBOX.y;Rr(g,'rgba(0,0,0,.2)',X0+1,Y0+12,19,2);Rr(g,'#4a2e18',X0-1,Y0-1,20,14);Rr(g,'#8a5a2a',X0,Y0,18,12);for(let i=0;i<12;i+=4)Rr(g,'#6a4220',X0,Y0+i,18,.7);Rr(g,'#a8743a',X0,Y0,18,.8);Rr(g,'#5a3a22',X0-1,Y0-2,20,3);Rr(g,'#7a5232',X0-1,Y0-2,20,.8);Rr(g,'#e0a431',X0+7,Y0+4,4,2);Rr(g,'#fff0a0',X0+7,Y0+4,1,1)}
function drawDogHouse(g){const X0=12*TS,Y0=42*TS+6;Rr(g,'rgba(0,0,0,.2)',X0+1,Y0+12,19,2);Rr(g,'#8a5a32',X0,Y0+2,18,10);for(let i=0;i<18;i+=3)Rr(g,'#6a4222',X0+i,Y0+2,.7,10);
 for(let r=0;r<6;r++)Rr(g,r%2?'#7a2a1a':'#5a1e12',X0-1+r*.0,Y0-4+r,20,1);Rr(g,'#3a120a',X0-2,Y0+1,22,1.4);Rr(g,'#1a0e08',X0+6,Y0+5,6,7);Rr(g,'#2a1810',X0+6,Y0+5,6,1);ptext(g,(S.dogs[0]&&S.dogs[0].name)||'',X0+9-ptw((S.dogs[0]&&S.dogs[0].name)||'')/2,Y0-3.5,'#f0e0c0')}
function drawSoil(g,tx,ty,wet){const X0=tx*TS,Y0=ty*TS,b=wet?'#45301e':'#77542f',d=wet?'#33231a':'#5e4226',l=wet?'#5a4028':'#8d6a40';
 Rr(g,b,X0+1,Y0+1,14,14);for(let i=0;i<4;i++){Rr(g,d,X0+1,Y0+3+i*4,14,1);Rr(g,l,X0+1,Y0+2+i*4,14,.7)}if(hs(tx,ty)<.4)Rr(g,l,X0+3+((hs(ty,tx)*8)|0),Y0+5,1,1)}
// ---------- iluminação, nuvens e chuva
const LC=mkCanvas(8,8),lc=LC.getContext('2d');
function lightPass(g,ox,oy,dl){
 const dk=(1-dl)*.68,hr=S.t*24;
 if(dl>.15&&dl<.8){const k=Math.max(0,1-Math.abs(dl-.42)/.3),gr=g.createLinearGradient(0,0,0,VH);gr.addColorStop(0,'rgba(255,120,60,'+(.18*k).toFixed(3)+')');gr.addColorStop(1,'rgba(255,180,90,'+(.05*k).toFixed(3)+')');g.fillStyle=gr;g.fillRect(0,0,VW,VH)}
 if(dk<.04)return;
 const W=Math.ceil(VW/2),H=Math.ceil(VH/2);if(LC.width!==W||LC.height!==H){LC.width=W;LC.height=H}
 lc.setTransform(1,0,0,1,0,0);lc.globalCompositeOperation='source-over';lc.clearRect(0,0,W,H);lc.fillStyle='rgba(8,12,44,'+dk.toFixed(3)+')';lc.fillRect(0,0,W,H);
 lc.globalCompositeOperation='destination-out';lc.setTransform(.5,0,0,.5,0,0);
 const hole=(x,y,r,a)=>{const sx=x-ox,sy=y-oy;if(sx<-r||sy<-r||sx>VW+r||sy>VH+r)return;const gr=lc.createRadialGradient(sx,sy,0,sx,sy,r);gr.addColorStop(0,'rgba(0,0,0,'+a+')');gr.addColorStop(.55,'rgba(0,0,0,'+(a*.55)+')');gr.addColorStop(1,'rgba(0,0,0,0)');lc.fillStyle=gr;lc.fillRect(sx-r,sy-r,r*2,r*2)};
 if(dk>.25)hole(P.x,P.y-10,52,.85);
 for(const l of lampPos())hole(l.x,l.y-14,44,.9);
 for(const b of BLD){const x=b.x*TS,w=b.w*TS,y=b.y*TS,h=b.h*TS,dx=b.door*TS-x;if(x-ox>VW+40||x+w-ox<-40||y-oy>VH+40||y+h-oy<-40)continue;for(let wx=8;wx<w-14;wx+=24)if(Math.abs(wx-dx)>20)hole(x+wx+6,y+h-20,26,.6)}
 if(S.mate&&MATE.vis&&S.mate.task==='guard')hole(MATE.x,MATE.y-10,30,.6);
 for(const t of THV)if(t.st!=='gone'&&t.light)hole(t.x,t.y-8,20,.4);
 lc.globalCompositeOperation='source-over';lc.setTransform(1,0,0,1,0,0);
 g.imageSmoothingEnabled=true;g.drawImage(LC,0,0,W,H,0,0,VW,VH);g.imageSmoothingEnabled=false;
}
const CLOUDS2=[0,1,2,3].map(i=>({x:ih(i,1,1)*WW,y:ih(i,2,1)*WH,r:90+ih(i,3,1)*80,s:4+ih(i,4,1)*5}));
function cloudShadows(g,ox,oy){if(daylight()<.4)return;g.fillStyle='rgba(10,20,10,.07)';for(const c of CLOUDS2){const x=((c.x+frame*c.s*.016)%(WW+400))-200-ox,y=c.y-oy;if(x<-c.r*2||x>VW+c.r*2||y<-c.r||y>VH+c.r)continue;g.beginPath();g.ellipse(x,y,c.r,c.r*.55,0,0,7);g.ellipse(x+c.r*.6,y+c.r*.15,c.r*.7,c.r*.4,0,0,7);g.fill()}}
const SPL=[];
function rainPass(g){
 const gr=g.createLinearGradient(0,0,0,VH);gr.addColorStop(0,'rgba(30,40,70,.30)');gr.addColorStop(1,'rgba(30,50,80,.14)');g.fillStyle=gr;g.fillRect(0,0,VW,VH);
 for(let i=0;i<110;i++){const sp=5+(i%3)*1.5,rx=((i*53.3+frame*sp*.45)%(VW+40))-20,ry=(i*29.7+frame*sp)%(VH+20)-10,l=3+(i%3)*1.5;g.fillStyle='rgba(200,220,255,'+(.35+(i%3)*.15)+')';for(let k=0;k<l;k++)g.fillRect(rx-k*.35,ry+k,1/PS*2,1)}
 if(SPL.length<40)SPL.push({x:Math.random()*VW,y:Math.random()*VH,t:0});
 for(let i=SPL.length-1;i>=0;i--){const s=SPL[i];s.t+=.06;if(s.t>1){SPL.splice(i,1);continue}const r=1+s.t*3;g.fillStyle='rgba(210,230,255,'+(.6*(1-s.t)).toFixed(2)+')';g.fillRect(s.x-r,s.y,r*2,.6);g.fillRect(s.x-.3,s.y-1-s.t*2,.6,.6)}
 if(S.weather==='chuva'&&Math.random()<.0015)FLASH=1;
 if(FLASH>0){g.fillStyle='rgba(230,240,255,'+(FLASH*.5).toFixed(2)+')';g.fillRect(0,0,VW,VH);FLASH-=.08}
}
let FLASH=0;
// ---------- HUD: barra de atalhos e teclas
setInterval(()=>{const k=document.querySelector('.keys');if(k&&S&&S.tut!==undefined)k.style.display=(S.tut>=4||S.playT>600)?'none':''},1000);
// ---------- porteira
drawGate=function(g){
 const x=152,y=915,st=S.up.land>=3,nm=pclean(S.farmName||'Fazenda Boi de Ouro').replace(/^FAZENDA /,'').slice(0,16),tl=TITLES[S.title||0].n;
 const post=px=>{Rr(g,'rgba(0,0,0,.25)',px+1,y,8,3);if(st){Rr(g,'#6e6e76',px-1,y-34,8,36);for(let i=0;i<36;i+=5)Rr(g,'#585860',px-1+((i/5)%2?3:0),y-34+i,4,.7);Rr(g,'#9a9aa2',px-1,y-34,2,36);Rr(g,'#4a4a52',px-2,y-37,10,4);Rr(g,'#b8b8c0',px-2,y-37,10,1)}
  else{Rr(g,'#3a2414',px-1,y-33,8,35);Rr(g,'#6a4428',px,y-33,6,35);Rr(g,'#8a5a32',px,y-33,2,35);for(let i=0;i<35;i+=6)Rr(g,'#4a2e18',px+2,y-31+i,3,.7);Rr(g,'#c8a070',px,y-34,6,2);Rr(g,'#8a6040',px+2,y-34,2,1)}};
 post(x-2);post(x+30);
 Rr(g,'#2a180c',x-5,y-36,44,6);Rr(g,st?'#5e5e66':'#5a3a20',x-4,y-35,42,4);Rr(g,st?'#8a8a92':'#7a5232',x-4,y-35,42,1);
 const tw=ptw(nm)+8,sx=x+17-tw/2;Rr(g,'#2a180c',sx-1,y-47,tw+2,12);Rr(g,'#8a5a2a',sx,y-46,tw,10);Rr(g,'#a8743a',sx,y-46,tw,1);Rr(g,'#6a4220',sx,y-37,tw,1);ptext(g,nm,sx+4,y-43,'#ffd75e','#2a180c');
 if(S.up.land>=4){Rr(g,'#ffd75e',x+15,y-52,4,3);Rr(g,'#ffd75e',x+14,y-51,6,1);Rr(g,'#c89a20',x+15,y-49,4,1)}
 const pw=ptw(tl)+6,px=x+17-pw/2,sw=Math.sin(frame/40)*.4;
 Rr(g,'#888',px+2,y-31,.6,3);Rr(g,'#888',px+pw-2.6,y-31,.6,3);Rr(g,'#2a180c',px-1+sw,y-28.5,pw+2,8);Rr(g,'#e8dcc0',px+sw,y-27.5,pw,6);ptext(g,tl,px+3+sw,y-27,'#5a2a12');
};

function drawMailbox(g){const x=MAILBOX.x,y=MAILBOX.y;Rr(g,'rgba(0,0,0,.22)',x-2,y+9,7,2);Rr(g,'#3a2414',x-.5,y-1,3,11);Rr(g,'#6a4428',x,y-1,2,11);Rr(g,'#5a1a12',x-4,y-6,11,7);Rr(g,'#b23a2c',x-3,y-6,9,6);Rr(g,'#d85a48',x-3,y-6,9,1.2);Rr(g,'#7a2218',x-3,y-1,9,1);Rr(g,'#1e0e08',x+4.6,y-4,1.4,2.6);
 if(S.offers.length){Rr(g,'#5a3a22',x+6,y-11,1,7);Rr(g,'#ffd75e',x+6.5,y-11,3,2.5);Rr(g,'#f4ecd8',x-2,y-7.5,5,2)}else{Rr(g,'#5a3a22',x+6,y-7,1,3);Rr(g,'#c8402a',x+6.5,y-7,2.5,1.5)}}
const _gwA=genWorld;genWorld=function(){_gwA();for(const t of TREES){const tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=100&&ty>40&&t.k===0)t.k=1}};

{const st=document.createElement('style');st.textContent='.touch #hint{bottom:auto!important;top:178px!important}';document.head.appendChild(st)}
