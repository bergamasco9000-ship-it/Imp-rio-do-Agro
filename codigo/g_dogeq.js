// ===== Equipamentos dos cães com detalhe de verdade: coletes (nylon laranja refletivo / tático com placas, bolsos e espinhos),
// ===== coleiras (nylon com plaquinha / couro com tachas e fivela / aço com espinhos) e coleira GPS com antena e luz piscando.
// Tudo é desenhado por cima do cão (depois do pelo longo e dos detalhes dos lendários), acompanhando a pose.
function dogGeo(v,pose,ph,o){const L=v.len,H=v.h,LG=v.leg,HS=v.head,half=L/2;
 const run=pose==='run',walk=pose==='walk'||pose==='limp'||(pose==='sniff'&&o.mv),sit=pose==='sit',lie=pose==='lie'||pose==='sleep';
 let rearY=0,frontY=0,hdx=0,hdy=0,bob=0;
 if(run)bob=-Math.abs(Math.sin(ph))*1.3;else if(walk)bob=-Math.abs(Math.sin(ph))*.5;else if(!lie&&!sit)bob=Math.sin(frame/22)*.25;
 if(sit)rearY=LG-1.5;if(lie){rearY=LG-.5;frontY=LG-.5}
 if(pose==='hold'){frontY=1.5;hdx=1.2;hdy=2.5+(o.shake?Math.sin(frame*1.4)*.8:0);rearY=-.5}
 if(pose==='sniff'){hdy=LG+H-HS*.6;hdx=.8}if(pose==='point')hdx=1;if(o.hurt)hdy+=.5;
 const top=-(LG+H)+bob,hx=half-1+hdx,hy=top+frontY-HS+2+hdy;
 return{L,H,LG,HS,half,top,rearY,frontY,hx,hy,nb:top+frontY,run,walk,sit,lie}}
// ---------- coletes
function eqVest(f,G,v,lv){const{half,top,rearY,frontY,H,sit}=G;
 const T=lv===1?{b:'#e4561c',hi:'#ff8c4c',lo:'#b4410f',ed:'#7a2a0a',st:'#2a2420'}:{b:'#4e5a3a',hi:'#66744c',lo:'#3a4530',ed:'#262c1c',st:'#1c2016'};
 // painel de trás (até a cintura) e da frente (até o peito); sentado, só o da frente
 const xr0=sit?-half*.3:-half+1,xr1=.8,xf0=sit?-half*.3:0,xf1=half-3.3,yr=top+rearY-.3,hr=Math.max(1.8,H-1.3),yf=top+frontY-.3,hf=Math.max(2,H-.5);
 const pan=(x0,x1,y0,h)=>{const w=x1-x0;if(w<=0)return;f(T.b,x0+.45,y0,w-.9,.5);f(T.b,x0,y0+.4,w,h-.4);f(T.hi,x0+.45,y0,w-.9,.45);f(T.lo,x0,y0+h-.7,w,.7);f(T.ed,x0+.3,y0+h-.15,w-.6,.35)};
 if(!sit)pan(xr0,xr1,yr,hr);pan(xf0,xf1,yf,hf);
 const P=sit?[[xf0,xf1,yf,hf]]:[[xr0,xr1,yr,hr],[xf0,xf1,yf,hf]],x00=sit?xf0:xr0;
 // borda da frente (gola) e de trás
 f(T.ed,xf1-.35,yf+.5,.4,hf-.8);f(T.ed,x00,P[0][2]+.5,.35,P[0][3]-.8);
 if(lv===1){
  // faixa refletiva prateada com brilho correndo
  for(const[x0,x1,y0,h]of P){const sy=y0+h*.42;f('#e8f0f2',x0+.2,sy,x1-x0-.6,.7);f('#9aa8ae',x0+.2,sy+.55,x1-x0-.6,.2)}
  const span=xf1-x00,gx=x00+((frame*.22)%(span+8))-4;if(gx>x00&&gx<xf1-1){const yy=(sit||gx>=xr1?yf+hf*.42:yr+hr*.42);f('#ffffff',gx,yy,.7,.7)}
  // cinta da barriga e do peito, com fivela
  if(!sit){f(T.st,-1.6,yr+.4,.8,hr+.9);f('#c8ccd0',-1.75,yr+hr-.2,1.1,.6)}
  f(T.st,xf1-1.2,yf+.4,.8,hf+.5);f('#c8ccd0',xf1-1.35,yf+hf-.3,1.1,.6);
  // etiqueta branca com cruz vermelha
  if(xf1-xf0>3.4){const ex=xf1-3.2,ey=yf+.7;f('#f4f0e6',ex,ey,1.6,1.15);f('#d83a2a',ex+.55,ey+.15,.5,.85);f('#d83a2a',ex+.3,ey+.35,1,.45)}
 }else{
  // fitas MOLLE com travas
  for(const[x0,x1,y0,h]of P)for(const ry of[y0+1.2,y0+2.4]){if(ry>y0+h-1)continue;f(T.lo,x0+.3,ry,x1-x0-.7,.5);for(let xx=x0+.8;xx<x1-.6;xx+=1.3)f(T.hi,xx,ry,.35,.5)}
  // bolsinho com tampa e botão
  if(!sit&&hr>2.8&&xr1-xr0>4){const px=-half+2.2,py=yr+.9;f(T.ed,px-.15,py-.1,2.7,2.1);f('#46522f',px,py,2.4,1.8);f(T.hi,px,py,2.4,.5);f('#141410',px+1,py+.75,.45,.4)}
  // placa do peito com rebites
  f(T.ed,xf1-2.6,yf+.5,2.1,hf-.9);f('#404c32',xf1-2.45,yf+.65,1.8,hf-1.25);f(T.hi,xf1-2.45,yf+.65,1.8,.35);f('#9a9e94',xf1-2.3,yf+.95,.35,.35);f('#9a9e94',xf1-1.2,yf+.95,.35,.35);
  // velcro cáqui
  if(xf1-xf0>4.4){f('#c8b888',xf0+.6,yf+.8,1.7,.9);f('#5a4a2a',xf0+.95,yf+1.05,1,.4)}
  // espinhos de aço no dorso
  for(let sx=x00+.8;sx<xf1-.7;sx+=1.6){const ty=(!sit&&sx<xr1?yr:yf);f('#4e5258',sx,ty-.35,.8,.45);f('#b8bcc2',sx+.16,ty-.85,.5,.55);f('#f4f6f8',sx+.27,ty-1.2,.27,.38)}
 }
 // pelo longo escapando por baixo do colete
 if(v.shag){const fc=v.bl||v.c;for(const[x0,x1,y0,h]of P)for(let xx=x0+.4;xx<x1-.4;xx+=1.25)f(fc,xx,y0+h+.15,.7,.8+((xx*7|0)%2)*.4)}
}
// ---------- coleiras
function eqBand(f,pts,th,c){for(const[x,y]of pts)f(c,x-.4,y-th/2,.8,th)}
function eqCollar(f,G,v,col,gps){const{half,hy,nb}=G;
 const x0=half-3.05,y0=Math.max(hy+2.4,nb-.1),x1=half-.55,y1=y0+.8,N=6,pts=[];for(let i=0;i<=N;i++){const t=i/N;pts.push([x0+(x1-x0)*t,y0+(y1-y0)*t])}
 const dx=x1-x0,dy=y1-y0,dl=Math.hypot(dx,dy)||1,nx=dy/dl,ny=-dx/dl,sw=G.run||G.walk?Math.sin(frame/5)*.25:0;
 if(gps)eqBand(f,pts.map(([x,y])=>[x-.95,y+.35]),.85,'#f08c1c');
 if(col===0){eqBand(f,pts,1.15,'#c42e28');eqBand(f,pts.map(([x,y])=>[x,y-.32]),.35,'#ee6a5a');
  f('#c8ccd0',x1-.55,y1+.35,.9,.5);f('#e8b840',x1-.45+sw,y1+.8,1,1);f('#fff0b0',x1-.3+sw,y1+.9,.35,.35)}
 else if(col===1){eqBand(f,pts,1.55,'#5e3418');eqBand(f,pts.map(([x,y])=>[x,y-.45]),.4,'#8a5630');
  for(const i of[1,3,5]){const[x,y]=pts[i];f('#9a7a30',x-.35,y-.25,.75,.75);f('#f6d880',x-.3,y-.3,.5,.5)}
  const[bx,by]=pts[0];f('#d8b850',bx-.6,by-.85,1.1,1.7);f('#5e3418',bx-.35,by-.55,.6,1.1);
  f('#d6dadc',x1-.6+sw,y1+.8,1.3,.7);f('#d6dadc',x1-.75+sw,y1+.65,.5,1);f('#d6dadc',x1+.3+sw,y1+.65,.5,1)}
 else if(col===2){eqBand(f,pts,1.6,'#222222');eqBand(f,pts.map(([x,y])=>[x,y-.5]),.35,'#4a4a4a');
  for(const i of[1,3,5])for(const s of[1,-1]){const[x,y]=pts[i];for(let k=0;k<3;k++){const d=.65+k*.34,w=[.62,.44,.26][k];f(['#6e7278','#c0c4ca','#ffffff'][k],x+nx*d*s-w/2,y+ny*d*s-w/2,w,w)}}
  f('#aab0b6',x1-.6,y1+.4,1.2,1.2);f('#222',x1-.25,y1+.75,.5,.5)}
 if(gps){const bx=x1-1.9,by=y1+.9;f('#151617',bx-.15,by-.15,2.5,2);f('#2e3134',bx,by,2.2,1.7);f('#55595e',bx,by,2.2,.4);
  if((frame>>4)&1)f('#3cff6e',bx+1.5,by+.75,.5,.5);else f('#1c5a2c',bx+1.5,by+.75,.5,.5);
  const ax=bx+.2,ay=by,tx=x0-1.2+sw*2,ty=y0-2.6;for(let i=0;i<=6;i++){const t=i/6;f('#141414',ax+(tx-ax)*t,ay+(ty-ay)*t,.35,.35)}f('#e04a20',tx-.15,ty-.25,.65,.65)}
}
// coleira dos lendários: a de ouro fica, mas recebe tachas ou espinhos conforme a compra
function eqLgdCollar(f,G,col,gps){const{half,hy,HS}=G,cy=hy+HS-1.4;
 if(col===1)for(let i=0;i<3;i++){f('#9a7a30',half-3.3+i*1.1,cy+.05,.6,.6);f('#fff2b8',half-3.25+i*1.1,cy,.35,.35)}
 if(col===2)for(let i=0;i<3;i++){f('#c0c4ca',half-3.3+i*1.1,cy-.95,.55,.8);f('#ffffff',half-3.18+i*1.1,cy-1.25,.3,.35);f('#c0c4ca',half-3.3+i*1.1,cy+1.3,.55,.8)}
 if(gps){const bx=half-3.4,by=cy+1.6;f('#2e3134',bx,by,2,1.5);f('#55595e',bx,by,2,.35);if((frame>>4)&1)f('#3cff6e',bx+1.4,by+.6,.45,.45);for(let i=0;i<=5;i++)f('#141414',bx-.2-i*.35,by-i*.62,.35,.35);f('#e04a20',bx-2.1,by-3.5,.6,.6)}}
const _ddsEq=drawDogSprite;
drawDogSprite=function(g,x,y,dr,v,pose,ph,o){o=o||{};const arm=o.arm|0,col=o.col===undefined?-1:+o.col,gps=!!o.gps;
 if(!v||(!arm&&col<0&&!gps))return _ddsEq.apply(this,arguments);
 _ddsEq.call(this,g,x,y,dr,v,pose,ph,Object.assign({},o,{arm:0,col:-1,gps:0}));
 const f=(c,dx,dy,w,h)=>{if(w>0&&h>0)Rr(g,c,dr>0?x+dx:x-dx-w,y+dy,w,h)},G=dogGeo(v,pose,ph,o);
 if(arm===1||arm===2)eqVest(f,G,v,arm);
 if(v.lg)eqLgdCollar(f,G,col,gps);else if(col>=0||gps)eqCollar(f,G,v,col<0?0:col,gps);
};
// ---------- vitrine de equipamentos (Seu Tião) e ficha do cão
const EQI=[{k:'arm',lv:1,ic:'🦺',fx:'−30% de dano. Laranja com faixa refletiva: outros caçadores enxergam de longe.'},
 {k:'arm',lv:2,ic:'🛡️',fx:'−55% de dano. Placa no peito, bolsos e espinhos no dorso. (−6% de velocidade)'},
 {k:'col',lv:1,ic:'🟤',fx:'Devolve 2 de dano a quem morde e protege 12% o pescoço.'},
 {k:'col',lv:2,ic:'⚙️',fx:'Devolve 5 de dano e protege 25% o pescoço (bom contra lobo e urso).'},
 {k:'gps',lv:1,ic:'📡',fx:'Antena e luz verde piscando: mostra onde ele está fora da tela.'}];
const eqName=e=>e.k==='arm'?DARM[e.lv].n:e.k==='col'?COLL[e.lv].n:'Coleira GPS';
const eqPrice=e=>e.k==='arm'?DARM[e.lv].p:e.k==='col'?COLL[e.lv].p:1600;
const pvEq=(d,ov,w,solo)=>pv(d.breed,d.id,w||104).replace('<canvas ','<canvas data-eq=\''+JSON.stringify(Object.assign(solo?{arm:0,col:0,gps:0}:{arm:d.arm||0,col:d.col||0,gps:d.gps?1:0},ov))+'\' ');
{const st=document.createElement('style');st.textContent='.eqg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin-top:6px}.eqt{background:rgba(0,0,0,.22);border:2px solid #5a4630;border-radius:7px;padding:5px;text-align:center;font-size:14px;line-height:1.1;display:flex;flex-direction:column;align-items:center;gap:3px}.eqt.own{border-color:#5ac04a}.eqt.up{border-color:#3a3226;opacity:.7}.eqt b{font-size:15px}.eqt .b{font-size:15px;padding:3px 8px}';document.head.appendChild(st)}
function eqTiles(d,buy){return '<div class="eqg">'+EQI.map(e=>{const cur=e.k==='gps'?(d.gps?1:0):(d[e.k]||0),own=cur===e.lv,better=cur>e.lv,ov={};ov[e.k]=e.lv;
  if(!buy&&!own)return '';
  const st=own?'<span class="grn">✔ Usando</span>':better?'<span class="dim">Já tem melhor</span>':'<button class="b gold" data-act="'+(e.k==='arm'?'dogarm':e.k==='col'?'dcol':'dgps')+'" '+(e.k==='gps'?'data-id="'+d.id+'"':'data-v="'+d.id+':'+e.lv+'"')+'>Comprar '+R$(eqPrice(e))+'</button>';
  return '<div class="eqt'+(own?' own':better?' up':'')+'">'+pvEq(d,ov,104,!buy)+'<b>'+e.ic+' '+eqName(e)+'</b><div class="dim">'+e.fx+'</div>'+st+'</div>'}).join('')+'</div>'}
const _dsEq=dogSection;dogSection=function(buy){if(!buy)return _dsEq(buy);
 return '<div class="sec">CÃES — EQUIPAMENTOS</div><div class="dim">Toque em “Comprar” e veja na foto como fica no seu cão.</div>'+S.dogs.map(d=>{ensureDog(d);const mx=dogMax(d),act=d.id===S.dogAct;
  return '<div class="card"><div style="display:flex;gap:8px;align-items:center">'+pv(d.breed,d.id,72)+'<div style="flex:1"><div class="row"><b>'+d.name+' <span class="dim">'+DOGS[d.breed].n+'</span></b><span class="'+(d.hp<mx*.4?'red':'grn')+'">❤️ '+Math.round(d.hp)+'</span></div><div class="dim">'+(act?'⭐ ativo':d.esc?'escoltando':'na fazenda')+' · agarre '+Math.round(effStr(d))+'</div></div></div>'
   +eqTiles(d,1)+'<div class="btns"><button class="b" data-act="dmodal" data-id="'+d.id+'">Detalhes e cuidados</button></div></div>'}).join('')};
const _dmodEq=dogModal;dogModal=function(id){_dmodEq(id);const d=dogById(id),box=$('mbox');if(!d||!box)return;const sec=[...box.querySelectorAll('.sec')].find(s=>/EQUIPAMENTO/.test(s.textContent));if(!sec)return;const card=sec.nextElementSibling;if(!card)return;
 const has=(d.arm||0)||(d.col||0)||d.gps;card.innerHTML=(has?eqTiles(d,0):'<div class="dim">Só a coleira simples de nylon.</div>')+(d.col||isLgd(d)?'':'<div class="dim" style="margin-top:4px">🔴 Coleira simples de nylon com plaquinha.</div>')+(isLgd(d)?'<div class="gold" style="margin-top:4px">⭐ Coleira de ouro lendária</div>':'')+'<div class="dim" style="margin-top:4px">Compre coletes, coleiras e GPS no Canil do Seu Tião.</div>'};
