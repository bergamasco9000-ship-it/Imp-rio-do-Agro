// ===== Gado em tamanho real: sprites por raça, sexo e idade (cache por pose) =====
const CPAL={
 nelore:{c:'#e9e5dc',lt:'#f6f4ee',dk:'#c9c4b8',cf:'#d6d1c6',cfB:'#a9a49a',fc:'#ece8e0',cm:'#3a3634',hoof:'#2a2624',ch:'#d8ccb0',sw:'#2a2624',ear:'zebu',hump:1,dew:1,horn:'short',eye:'#3a3634'},
 girolando:{c:'#f2f0ea',lt:'#ffffff',dk:'#d4d0c6',cf:'#f2f0ea',fc:'#f2f0ea',cm:'#e8a8a0',hoof:'#3a2a20',ch:'#e8dcc0',sw:'#1e1c1c',ear:'flat',hump:.35,dew:.4,horn:'none',spots:'#1e1c1c',dairy:1},
 brahman:{c:'#bdb8ae',lt:'#d4d0c8',dk:'#9a958c',cf:'#9f9a90',cfB:'#7c776f',fc:'#c4c0b6',cm:'#2e2a28',hoof:'#262220',ch:'#c8b898',sw:'#262220',ear:'long',hump:1.35,dew:1.5,horn:'up',eye:'#2e2a28'},
 hereford:{c:'#9a3d1e',lt:'#b8552c',dk:'#73290f',cf:'#9a3d1e',fc:'#f4efe2',cm:'#f0b8a8',hoof:'#4a3a30',ch:'#ece2c8',sw:'#f4efe2',ear:'flat',hump:0,dew:.25,horn:'curl',white:'#f4efe2'},
 angus:{c:'#232329',lt:'#4c4c5a',dk:'#121216',cf:'#26262c',fc:'#2a2a32',cm:'#18181c',hoof:'#101012',ch:'#000',sw:'#101012',ear:'flat',hump:0,dew:.2,horn:'none',stocky:1},
 wagyu:{c:'#3b2820',lt:'#5a4236',dk:'#24170f',cf:'#3b2820',fc:'#3e2a22',cm:'#1e1614',hoof:'#140e0c',ch:'#d8ccb4',sw:'#140e0c',ear:'flat',hump:0,dew:.2,horn:'small',slim:1}
};
// padrões de manchas da girolanda (x,y,w,h no corpo, coordenadas locais)
const GSPOT=[
 [[-12,-17,6,5],[-3,-16,6,6],[3,-12,4,4],[8,-17,3,4],[-9,-11,4,3]],
 [[-13,-15,4,7],[-6,-17,8,5],[4,-16,5,7],[-2,-11,3,3]],
 [[-10,-17,9,4],[0,-13,5,5],[6,-17,5,3],[-13,-12,3,4],[8,-12,3,3]],
 [[-13,-17,5,9],[-4,-15,4,4],[2,-17,7,4],[-1,-11,6,3],[9,-15,2,5]]
];
const CSPR=new Map();let CSPS=0;
function cowCls(a){return a.age<240?'calf':(a.sex==='M'&&a.age>=400&&a.breeder?'bull':a.sex==='M'?'steer':'cow')}
function cowScale(a,cls){const r=Math.cbrt(Math.max(20,a.w)/520);return cls==='calf'?clamp(r*1.3,.56,.98):cls==='bull'?clamp(r*1.1,.85,1.25):clamp(r,.72,1.13)}
// gera a lista de retângulos (virado para a direita; origem = meio do chão entre as patas)
const smooth=(x,c,w)=>{const d=(x-c)/w;return Math.max(0,1-d*d)};
function cowOps(br,cls,pose,v){
 const C=CPAL[br]||CPAL.nelore,o=[],R=(c,x,y,w,h)=>{if(w>0&&h>0)o.push([c,x,y,w,h])};
 const bull=cls==='bull',calf=cls==='calf',fem=cls==='cow',ly=pose==='ly0'||pose==='ly1',gr=pose==='gr';
 const wk=pose==='w0'?1:pose==='w1'?.35:pose==='w2'?-1:pose==='w3'?-.35:0;
 const c=C.c,lt=C.lt,dk=C.dk,cf=bull&&C.cfB?C.cfB:C.cf,W=C.white,hoof=C.hoof,zebu=!!C.hump&&C.hump>=1;
 // proporções
 const L=calf?{x0:-9,x1:6.6,top:-13.2,bel:-7.4,lg:7.4,hs:.82}:{x0:-14,x1:10.5,top:-17,bel:C.stocky?-6.9:C.slim?-7.9:-7.3,lg:C.stocky?8.2:zebu?9.6:9,hs:1};
 if(ly){L.top=calf?-8.6:-11.6;L.bel=0}
 const len=L.x1-L.x0,hump=(!calf&&C.hump)?Math.min(bull?1.75:1.5,C.hump*(bull?1.45:fem?.7:1)):0;
 const T=x=>{const u=(x-L.x0)/len;let t=L.top+.35*Math.sin(u*Math.PI*2.1);            // linha do dorso
  if(u<.12)t+= (1-u/.12)**2*(calf?2.4:3.2);                                           // garupa arredondada
  if(C.dairy&&!calf)t-=.7*smooth(u,.18,.08);                                          // ossos da bacia (leiteira)
  if(zebu&&!calf)t+=.9*(1-u)*(u<.3?1:0);                                              // garupa caída (zebu)
  if(hump)t-=hump*(ly?2.6:3.1)*smooth(x,L.x1-4.6,2.6+(bull?.5:0))*(x<L.x1-4.6?1:1);             // cupim
  if(bull&&!calf)t-=1.3*smooth(x,L.x1-1.5,4);
  if(u>.93)t+=(u-.93)*14*(ly?1:.6);if(ly)t+=1.6*Math.pow(1-Math.sin(u*Math.PI),2);return t};
 const B=x=>{const u=(x-L.x0)/len;if(ly)return u<.04||u>.96?-1:0;let b=L.bel+(calf?.2:.5)*Math.sin(u*Math.PI)*-1;
  if(u<.22)b-=(calf?1.4:2)*(1-u/.22);                                                 // vazio do flanco
  if(u>.8)b-=(u-.8)*(calf?3:4.5);                                                     // peito
  if(u<.05)b-=(.05-u)*30;return b};
 const sx=(x,top,bot)=>[top,bot];
 const legs=(far)=>{if(ly)return;const col=far?dk:c,colF=far?dk:cf,low=far?dk:(W||c),lowF=far?dk:(W||cf),off=far?1:0,ws=wk*(calf?1.1:1.6)*(far?-1:1),lg=L.lg;
  const hx=L.x0+(calf?2.6:3.4)+(far?2.2:0),fx=L.x1-(calf?2.8:3.6)-(far?2:0),w1=calf?1.7:2.6,w2=calf?1.3:1.9;
  // traseira: coxa → jarrete → canela
  R(col,hx-.2+ws*.3,-lg-.3,w1,lg*.48);R(low,hx+.3+ws*.6,-lg*.55,w2,lg*.55-1);R(shade(low,-14),hx+.3+ws*.6,-lg*.55,.5,lg*.3);
  R(hoof,hx+ws*.6,-1.15,w2+.7,1.15);
  // dianteira: antebraço → joelho → canela
  R(colF,fx+ws*-.3,-lg-.2,w1-.2,lg*.5);R(lowF,fx+.2-ws*.6,-lg*.52,w2,lg*.52-1);R(shade(lowF,-14),fx+.2-ws*.6,-lg*.4,.5,lg*.25);
  R(hoof,fx-.1-ws*.6,-1.15,w2+.7,1.15)};
 legs(1);
 // corpo em colunas (silhueta arredondada)
 const st=.5;
 for(let x=L.x0;x<L.x1;x+=st){const t=T(x),b=B(x),u=(x-L.x0)/len,col=u>.68?cf:c;R(col,x,t,st,b-t);
  R(u>.68?shade(cf,14):lt,x,t,st,1.1);if(!ly)R(shade(col,-16),x,b-1,st,1);
  if(!calf&&!ly&&u>.18&&u<.62)R(shade(col,-5),x,t+(b-t)*.66,st,.5);
  if(!ly&&u>.27&&u<.31)R(shade(col,-10),x,t+1.5,.5,(b-t)-3)}
 // manchas (girolando)
 if(C.spots){GSPOT[v%4].forEach(p=>{const sc=calf?.62:1,px=L.x0+(p[0]+14)*sc*(len/(calf?15.6:24.5))/(calf?1/.62*0+1:1);for(let x=px;x<px+p[2]*sc;x+=st){if(x<L.x0||x>=L.x1)continue;const t=T(x),b=B(x),y0=t+((p[1]+17)/10)*(b-t)*.95,y1=Math.min(b-.4,y0+p[3]*sc*(ly?.7:1));const e=(x<px+.6||x>px+p[2]*sc-1)?.5:0;R(C.spots,x,Math.max(t+.3,y0+e),st,y1-Math.max(t+.3,y0+e)-e)}})}
 // marcas brancas (hereford)
 if(W&&!ly){for(let x=L.x0+len*.22;x<L.x1-1;x+=st){const b=B(x);R(W,x,b-(x>L.x1-5?2.6:1.3),st,x>L.x1-5?2.6:1.3)}}
 // úbere e bolsa
 if(!ly&&fem){const d=C.dairy?1.45:1,ux=L.x0+len*.26;R('#e8b0ac',ux,B(ux+1)-.6,4.2*d,2.3*d);R('#f4c8c4',ux+.4,B(ux+1)-.6,2.6*d,.7);R('#d0908c',ux+.5,B(ux+1)+1.5*d,.7,1.1);R('#d0908c',ux+3.1*d,B(ux+1)+1.5*d,.7,1.1)}
 if(ly&&fem&&C.dairy)R('#e8b0ac',L.x0+7,-1.6,5,1.6);
 if(!ly&&bull&&!calf){const bx=L.x0+len*.2;R(shade(c,-35),bx,B(bx)-.4,2.6,3.2);R(shade(c,-50),bx+.6,B(bx)+2.4,1.4,1.2);R(dk,L.x0+len*.55,B(L.x0+len*.55)-.4,3,1.4)}
 legs(0);
 // pescoço, barbela, cabeça
 const hs=L.hs,gx=L.x1-1.2;let px,py;  // px,py = nuca
 if(ly){px=gx+2.4;py=(calf?-12.2:-15.2)}else if(gr){px=gx+3;py=-9.6*hs}else{px=gx+3.2*hs;py=(calf?-14.2:-16.2+(zebu?.4:0))}
 const nt0=T(gx),nb0=B(gx)-(ly?2:0);
 for(let x=gx;x<px+.6;x+=st){const u=(x-gx)/Math.max(.5,px+.6-gx),t=nt0+(py+.8-nt0)*u-(bull&&!calf?2.4*Math.sin(u*Math.PI):0),b=nb0+((py+(calf?4.6:bull?7.6:6.2)*hs)-nb0)*u+(bull?1.2*Math.sin(u*Math.PI):0);R(cf,x,t,st,b-t);R(shade(cf,12),x,t,st,.9)}
 if(C.dew&&!calf&&!ly){const k=C.dew*(bull?1.6:fem?.8:1);for(let x=gx-.5;x<gx+3.6;x+=st){const u=(x-gx+.5)/4.1,b=B(gx)+(ly?-2:0)+k*2.2*Math.sin(u*Math.PI)+(gr?u*2:0);R(cf,x,B(gx)-1.2,st,b-B(gx)+1.2)}}
 
 headOps(R,C,cls,px,py,hs*(calf?1.05:1),gr,pose==='ly1');
 return o;
}
function headOps(R,C,cls,X,Y,s,gr,chew){
 const fc=C.fc,cf=cls==='bull'&&C.cfB?C.cfB:C.cf,st=.5,ln=7.4*s,dn=gr?1.9:.85;  // dn = inclinação do focinho para baixo
 const top=x=>Y+(x<2.4*s?0:(x-2.4*s)*dn*.62),bot=x=>Y+5.6*s+(x<3*s?-(3*s-x)*.15:(x-3*s)*dn*.42)-(x>ln-1.6*s?(x-(ln-1.6*s))*.5:0)+(chew&&x>ln-2.6*s?.4:0);
 // orelhas atrás
 if(C.ear==='long'){R(shade(cf,-8),X-.9*s,Y+1.1*s,1.8*s,6.2*s);R(shade(cf,-24),X-.9*s,Y+6.8*s,1.8*s,.6);R('#c89494',X-.4*s,Y+1.8*s,.6,3.4*s)}
 for(let x=0;x<ln;x+=st){const t=top(x),b=bot(x),mz=x>ln-2.3*s;R(mz?C.cm:fc,X+x,t,st,b-t);
  if(!mz)R(shade(fc,16),X+x,t,st,.8);else R(shade(C.cm,18),X+x,t,st,.6);
  if(x<ln-2.3*s)R(shade(fc,-12),X+x,b-.7,st,.7)}
 if(C.spots){for(let x=0;x<3*s;x+=st)R(C.spots,X+x,top(x),st,(bot(x)-top(x))*(x<1.6*s?.95:.5));}
 const nx=X+ln-.8,ny=top(ln-.5)+1;R(shade(C.cm,-38),nx-.1,ny,.8,.8);R(shade(C.cm,-30),X+ln-2.2*s,bot(ln-1)-.5,2*s,.45);
 const ex=X+2.6*s,ey=Y+1.5*s;R(C.eye||shade(fc,-45),ex-.25,ey-.25,1.8*s,1.6*s);R('#111',ex,ey,1.2*s,1.15*s);R('#fff',ex+.45*s,ey,.4,.4);
 if(cls==='calf'){R('#111',ex,ey,1.25*s,1.25*s);R('#fff',ex+.5*s,ey,.4,.4)}
 if(C.ear==='zebu'){R(shade(cf,-4),X-2*s,Y+1.2*s,3*s,1.5*s);R(shade(cf,-22),X-2.3*s,Y+1.7*s,.6,.8)}
 else if(C.ear==='flat'){R(shade(fc,-18),X-1.8*s,Y+1.1*s,2.6*s,1.4*s);R('#d89090',X-1.2*s,Y+1.5*s,1.4*s,.6)}
 if(cls==='calf')return;
 const h=C.horn,ch=C.ch,tp='#3a3226',b=cls==='bull'?1.35:1,hx=X+1.2*s,hy=Y;
 if(h==='short'){R(ch,hx,hy-1.5*b,1.3,1.7*b);R(tp,hx+.1,hy-1.9*b,1,.6)}
 else if(h==='up'){R(ch,hx-.3,hy-1.4*b,1.4,1.6*b);R(ch,hx+.4,hy-3*b,1.1,1.8);R(tp,hx+.6,hy-3.5*b,.8,.7)}
 else if(h==='curl'){R(ch,hx-.6,hy-.8,2.8*b,1.2);R(ch,hx+2*b,hy-.4,1.1,1.6);R(tp,hx+2.2*b,hy+1,.8,.7)}
 else if(h==='small'){R(ch,hx,hy-1,1.9,1);R(tp,hx+1.5,hy-1.3,.8,.7)}
 if(C.stocky)R(shade(fc,10),X+.6,Y-.5,2.4,.8);
}
function cowSprite(a,cls,pose,k){
 const v=((a.id%4)+4)%4,kb=Math.round(k*20)/20,key=a.breed+'|'+cls+'|'+pose+'|'+kb+'|'+(CPAL[a.breed]&&CPAL[a.breed].spots?v:0)+'|'+PS;
 if(CSPS!==PS){CSPR.clear();CSPS=PS}
 let sp=CSPR.get(key);if(sp)return sp;
 const ops=cowOps(a.breed,cls,pose,v);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of ops){x0=Math.min(x0,p[1]);y0=Math.min(y0,p[2]);x1=Math.max(x1,p[1]+p[3]);y1=Math.max(y1,p[2]+p[4])}
 const pad=1.2,sc=PS*kb,W=Math.ceil((x1-x0+pad*2)*sc),H=Math.ceil((y1-y0+pad*2)*sc),cv=mkCanvas(W,H),g=cv.getContext('2d'),ox=-x0+pad,oy=-y0+pad,ol=.75/kb;
 const FR=(x,y,w,h)=>{const a=Math.round(x*sc),b=Math.round(y*sc),c2=Math.max(a+1,Math.round((x+w)*sc)),d=Math.max(b+1,Math.round((y+h)*sc));g.fillRect(a,b,c2-a,d-b)};
 g.fillStyle='rgba(22,12,6,.85)';for(const p of ops)FR(p[1]+ox-ol,p[2]+oy-ol,p[3]+ol*2,p[4]+ol*2);
 for(const p of ops){g.fillStyle=p[0];FR(p[1]+ox,p[2]+oy,p[3],p[4])}
 try{shadeSprite(cv,{top:.13,bot:.2,mid:.42,hi:[[.5,.3,.18,.08]],fur:.035,seed:hsh(a.breed+v)})}catch(e){}
 sp={cv,ox:-ox*kb,oy:-oy*kb,w:W/PS,h:H/PS,kb};if(CSPR.size>600)CSPR.clear();CSPR.set(key,sp);return sp;
}
drawCow=function(g,a,x,y,dir,f,mini){
 const s=SP.get(a.id),cls=cowCls(a),k=cowScale(a,cls),cx=x+8.5,fy=y+10,lie=!mini&&s&&s.lie,C=CPAL[a.breed]||CPAL.nelore;
 const shw=(cls==='calf'?20:30)*k;
 if(RMODE!==1){Rr(g,'rgba(0,0,0,.26)',cx-shw/2,fy-1.2,shw,2.4);Rr(g,'rgba(0,0,0,.14)',cx-shw/2-1.5,fy-.6,shw+3,1.4)}
 if(RMODE===4)return;
 let pose='st';
 if(lie)pose=((frame>>3)+a.id)%6<3?'ly1':'ly0';
 else{let mv=0;if(s){mv=Math.abs(s.x-(s._px||s.x))+Math.abs(s.y-(s._py||s.y))>.02;s._px=s.x;s._py=s.y}
  if(mv||f){const ph=((frame>>3)+a.id)&3;pose='w'+ph}else if(((frame+a.id*37)%600)<200)pose='gr'}
 const sp=cowSprite(a,cls,pose,k),d=dir>0?1:-1;
 // rabo (animado)
 const tsw=Math.sin(frame/14+a.id)*(cls==='calf'?.8:1.4),tb=lie?-10:(cls==='calf'?-12.5:-16.6),tl=lie?6:(cls==='calf'?6:10);
 const tx=(lx,lyy,w,h,c)=>Rr(g,c,d>0?cx+lx*k:cx-(lx+w)*k,fy+lyy*k,w*k,h*k);
 if(!lie||true){const base=cls==='calf'?-8.6:-13.8;tx(base-1,tb,1,tl*.6,C.c===C.lt?C.dk:shade(C.c,-14));tx(base-1+tsw*.4,tb+tl*.6,1,tl*.4,shade(C.c,-14));tx(base-1.4+tsw*.7,tb+tl-1,1.8,2.4,C.sw)}
 if(d>0)g.drawImage(sp.cv,cx+sp.ox,fy+sp.oy,sp.w,sp.h);
 else{g.save();g.translate(cx,fy);g.scale(-1,1);g.drawImage(sp.cv,sp.ox,sp.oy,sp.w,sp.h);g.restore()}
 // ícones de estado
 const top=fy-(lie?18:cls==='calf'?17:24)*k-(C.hump&&cls==='bull'?4:0),ix=cx-1.5;
 if(a.labor){const p=(frame>>3)&1;Rr(g,'#1e140c',ix,top-10-p,3,8);Rr(g,'#ff4a3a',ix+.5,top-9.5-p,2,5);Rr(g,'#ff4a3a',ix+.5,top-3.5-p,2,1.5)}
 else if(a.sick){Rr(g,'#1e140c',ix-.5,top-5.5,4,4);Rr(g,'#e33',ix,top-4,3,1);Rr(g,'#e33',ix+1,top-5,1,3)}
 else if(a.preg){Rr(g,'#f08ac0',ix,top-4,3,2)}
 if(a.title){Rr(g,'#ffd75e',ix+5,top-5,2,2);Rr(g,'#c8302a',ix+5.5,top-3,1,2)}
 if(a.breeder&&!lie)Rr(g,'#5fa8ff',ix-4,top-4,2,2);
 if(SEL===a.id){Rr(g,'#ffd75e',cx-1,top-9,3,1);Rr(g,'#ffd75e',cx,top-8,1,2)}
};
// cercas: deixa espaço para o tamanho novo
const _pbCow=pasBounds;pasBounds=function(){const b=_pbCow();return{x0:b.x0+9,x1:Math.max(b.x0+12,b.x1-8),y0:b.y0+10,y1:b.y1}};
