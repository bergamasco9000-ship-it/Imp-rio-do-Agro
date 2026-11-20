// ===== CABANA DO CAÇADOR: armas penduradas, taxidermia, troféus lendários, armadilhas e câmera de trilha + ONÇA redesenhada =====
const CAB={x:32,y:9,w:6,h:5,door:34,price:85000,obra:4};
const TRAPS={laco:{n:'Laço de arame',ic:'🪢',p:90,sp:['rabbit','turkey'],ch:.32,d:'Pega coelho e peru (respeite a temporada do peru).'},
 gaiola:{n:'Gaiola-armadilha',ic:'🪤',p:1900,sp:['boar','capy','coyote'],ch:.26,d:'Controle de javali autorizado. Também pega capivara e coiote.'},
 cam:{n:'Câmera de trilha',ic:'📸',p:950,photo:1,d:'Fotografa os bichos que passam, inclusive os lendários. As fotos ficam na mesa da cabana.'}};
const MBASE=[{id:'madeira',n:'Madeira de lei'},{id:'tronco',n:'Tronco rústico'},{id:'pedra',n:'Pedra do rio'},{id:'ouro',n:'Placa dourada'}];
const MPOSE=[{id:'alert',n:'Alerta'},{id:'stand',n:'Em pé'},{id:'graze',n:'Pastando'},{id:'run',n:'Correndo'}];
const PEDS=[[4,7],[9,7],[4,4],[9,4]];
function ensureCab(){if(!S.cab)S.cab={st:0,d:0,mounts:[],tinv:{laco:0,gaiola:0,cam:0},placed:[],photos:[],nid:1};const C=S.cab;C.tinv=C.tinv||{laco:0,gaiola:0,cam:0};C.placed=C.placed||[];C.photos=C.photos||[];C.mounts=C.mounts||[];return C}
const cabSt=()=>{const C=S&&S.cab;if(!C||!C.st)return 0;return S.day<C.d?1:2};
// ---------- cômodo interno (fica na zona de interiores, depois do matadouro)
const CABRY=(()=>{let my=0;for(const id in ROOMS)my=Math.max(my,ROOMS[id].y);let mx=0;for(const id in ROOMS)if(ROOMS[id].y===my)mx=Math.max(mx,ROOMS[id].x+ROOMS[id].w);return mx+3+14<=MW-2?[mx+3,my]:[2,my+14]})();
ROOMS.cabana={id:'cabana',x:CABRY[0],y:CABRY[1],w:14,h:10,floor:'wood',wall:'#6a4428',trim:'#3a2414',log:1,win:[12],items:[
 {k:'cabguns',x:1,y:2,w:2,h:1,act:'cabguns'},{k:'fireplace',x:6,y:2,w:2,h:1},{k:'cabtaxi',x:10,y:2,w:3,h:1,act:'cabtaxi'},
 {k:'cabtraps',x:1,y:5,w:2,h:2,act:'cabtraps'},{k:'bearrug',x:5,y:4,w:0,h:0},{k:'cabtable',x:10,y:5,w:2,h:1,act:'cabtable'},{k:'chair',x:12,y:5},
 {k:'bed',x:11,y:7,w:2,h:1,act:'sleep'},{k:'cabped',x:4,y:7,w:1,h:1,act:'cabped',slot:0},{k:'cabped',x:9,y:7,w:1,h:1,act:'cabped',slot:1},{k:'cabped',x:4,y:4,w:1,h:1,act:'cabped',slot:2},{k:'cabped',x:9,y:4,w:1,h:1,act:'cabped',slot:3}],
 wallx:[{k:'cabheads',x:0}]};
CLERK.cabana=null;
// ---------- mundo: clareira, caminho até a estrada e o prédio
const _gwCab=genWorld;genWorld=function(){_gwCab();
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=CAB.x-2&&tx<=CAB.x+CAB.w+2&&ty>=CAB.y-2&&ty<=CAB.y+CAB.h+2){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 if(typeof BUSH!=='undefined')for(let i=BUSH.length-1;i>=0;i--){const t=BUSH[i];if(t.x>=(CAB.x-2)*TS&&t.x<=(CAB.x+CAB.w+2)*TS&&t.y>=(CAB.y-2)*TS&&t.y<=(CAB.y+CAB.h+3)*TS)BUSH.splice(i,1)}
 for(let i=DECO.length-1;i>=0;i--){const t=DECO[i];if(t.x>=(CAB.x-2)*TS&&t.x<=(CAB.x+CAB.w+2)*TS&&t.y>=(CAB.y-2)*TS&&t.y<=(CAB.y+CAB.h+3)*TS)DECO.splice(i,1)}
 for(let y=CAB.y-1;y<=CAB.y+CAB.h+1;y++)for(let x=CAB.x-1;x<=CAB.x+CAB.w+1;x++){SOL[ti(x,y)]=0;FEN[ti(x,y)]=0}
 for(let x=CAB.door;x<=47;x++){const i=ti(x,CAB.y+CAB.h);G[i]=3;SOL[i]=0}for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(ty>=CAB.y+CAB.h-1&&ty<=CAB.y+CAB.h+1&&tx>=CAB.door&&tx<=47){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 cabRefresh();prerender()};
function cabRefresh(){if(!S)return;const st=cabSt(),i=BLD.findIndex(b=>b.id==='cabana');
 if(st&&i<0){BLD.push({id:'cabana',x:CAB.x,y:CAB.y,w:CAB.w,h:CAB.h,door:CAB.door,roof:'#3a4a2a',wall:'#7a5230',label:st===2?'Cabana do Caçador (sua)':'🏗️ Obra: Cabana do Caçador',sign:'CABANA',log:1,custom:1});for(let y=CAB.y;y<CAB.y+CAB.h;y++)for(let x=CAB.x;x<CAB.x+CAB.w;x++)SOL[ti(x,y)]=1}
 else if(st&&i>=0)BLD[i].label=st===2?'Cabana do Caçador (sua)':'🏗️ Obra: Cabana do Caçador'}
const _bvCab=bVar;bVar=function(b){if(b.id==='cabana')return cabSt();return _bvCab(b)};
BART.cabana=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);shadowB(g,x,y,w,h);const rh=h-38;
 // chaminé de pedra à esquerda
 for(let j=0;j<h+14;j+=3)for(let i=0;i<10;i+=3.4)BW(g,['#8a867c','#9a968c','#7a766c'][(i+j)%3|0],x-8+i+((j/3)%2)*1.6,y-14+j,3.2,2.8);BW(g,'#5a564e',x-9,y-16,12,2.4);
 // paredes de tronco
 wallLogs(g,x,y+rh,w,h-rh,'#7a5230');for(let j=0;j<h-rh;j+=5){BW(g,'#5a3a22',x-2.4,y+rh+j,3.4,4.2);BW(g,'#8a6038',x-2,y+rh+j+.6,2.6,1);BW(g,'#5a3a22',x+w-1,y+rh+j,3.4,4.2);BW(g,'#8a6038',x+w-.6,y+rh+j+.6,2.6,1)}
 // telhado de tabuinhas com musgo
 roofShingle(g,x-6,y,w+12,rh+4,'#4a3a26');for(let i=0;i<14;i++)BW(g,i%3?'#4a6a2a':'#5a7a3a',x-4+hs(i,3)*(w+8),y+2+hs(3,i)*(rh-2),3+hs(i,5)*3,1.2);
 // varanda: piso, colunas e telhadinho
 BW(g,'#6a4428',x-4,y+h-3,w+8,3);BW(g,'#8a5a32',x-4,y+h-3,w+8,.8);for(const px of [x-3,x+w+1.4])BW(g,'#5a3a22',px,y+h-24,1.8,22);BW(g,'#3a2a1a',x-5,y+h-26,w+10,2.6);BW(g,'#5a4a32',x-5,y+h-26,w+10,.8);
 // porta, janela com luz e chifres em cima da porta
 doorWood(g,x+dx,y+h-24,'#5a3a22',0);const ax=x+dx+8,ay=y+h-31;BW(g,'#5a3a22',ax-3,ay+1,6,4);BW(g,'#e8dcc0',ax-1,ay-2,2,3);poly((c,a,b,w2,h2)=>BW(g,c,a,b,w2,h2),[[ax-1,ay],[ax-4,ay-3],[ax-6,ay-7]],1,'#e8dcc0');poly((c,a,b,w2,h2)=>BW(g,c,a,b,w2,h2),[[ax+1,ay],[ax+4,ay-3],[ax+6,ay-7]],1,'#e8dcc0');BW(g,'#e8dcc0',ax-5,ay-5,1,3);BW(g,'#e8dcc0',ax+4,ay-5,1,3);
 const wx=x+(dx>w/2?10:w-26);BW(g,'#3a2414',wx-1,y+h-27,18,14);BW(g,'#2a2a30',wx,y+h-26,16,12);BW(g,'#3a2414',wx+7.5,y+h-26,1,12);BW(g,'#3a2414',wx,y+h-20.5,16,1);BW(g,'#5a3a22',wx-2,y+h-14,20,2);
 // cadeira de balanço, lenha empilhada, toco com machado, couro esticado e lampião
 BW(g,'#6a4428',x+dx+22,y+h-12,6,1.4);BW(g,'#6a4428',x+dx+26,y+h-18,1.4,7);BW(g,'#5a3a22',x+dx+21,y+h-4,8,1.2);BW(g,'#6a4428',x+dx+22,y+h-11,1,7);BW(g,'#6a4428',x+dx+27,y+h-11,1,7);
 for(let r=0;r<3;r++)for(let i=0;i<5-r;i++){const lx=x+w+4+i*4+r*2,ly=y+h-4-r*3.6;BW(g,'#7a5232',lx,ly,3.8,3.6);BW(g,'#c8a070',lx+.6,ly+.6,2.6,2.4);BW(g,'#a87a48',lx+1.4,ly+1.2,1,1)}
 BW(g,'#7a5232',x-16,y+h-6,7,6);BW(g,'#c8a070',x-16,y+h-6,7,1.4);BW(g,'#5a3a22',x-12,y+h-13,1,8);BW(g,'#9aa0a6',x-14,y+h-14,4,2.4);
 BW(g,'#5a3a22',x+4,y+h-22,1,20);BW(g,'#5a3a22',x+14,y+h-22,1,20);BW(g,'#5a3a22',x+4,y+h-22,11,1);BW(g,'#c8a070',x+5.4,y+h-20.4,8.2,9);BW(g,'#a87a48',x+6,y+h-19,7,6.8);BW(g,'#8a5a32',x+8,y+h-17,3,3);
 wallLamp(g,x+dx-5,y+h-26)};
const _blCab=bLive;bLive=function(g,b){_blCab(g,b);if(b.id!=='cabana'||cabSt()<2)return;const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,dx=(b.door-b.x)*TS;smoke(g,x-3,y-16);
 const hr=S.t*24;if(hr>=18||hr<6){const wx=x+(dx>w/2?10:w-26);Rr(g,'#f0b050',wx,y+h-26,7.5,5.5);Rr(g,'#f0b050',wx+8.5,y+h-26,7.5,5.5);Rr(g,'#e09040',wx,y+h-20,7.5,6);Rr(g,'#e09040',wx+8.5,y+h-20,7.5,6);Rr(g,'rgba(255,190,90,.15)',wx-8,y+h-12,32,14)}};
// entrar só quando a obra terminar
const _erCab=enterRoom;enterRoom=function(id){if(id==='cabana'&&cabSt()<2)return toast('🏗️ A cabana ainda está em obra: pronta em '+Math.max(1,S.cab.d-S.day)+' dia(s)');return _erCab(id)};
// compra
function cabBuyModal(){const C=ensureCab();reModal=null;
 showModal('<h3>🪓 Cabana do Caçador</h3><div class="card">Uma cabana de troncos só sua, numa clareira da mata, perto da Loja do Caçador.<br><br>🔫 <b>Parede de armas</b>: suas armas ficam penduradas e você troca a que leva.<br>🦌 <b>Bancada de taxidermia</b>: empalhe o que caçar (cabeça na parede ou corpo inteiro no pedestal) e escolha base, pose e lado.<br>🏆 <b>Lendas</b>: a cabeça de cada lendário que você abater vai para a parede com placa dourada.<br>🪤 <b>Armadilhas</b>: laço, gaiola para javali e câmera de trilha.<br>🛏️ Cama para dormir e salvar na mata.</div><div class="row"><b>Preço (troncos de eucalipto tratado, pedra e mão de obra)</b><b class="gold">'+R$(CAB.price)+'</b></div><div class="dim">Obra de '+CAB.obra+' dias.</div><div class="btns"><button class="b gold" data-act="cabbuy">Construir</button><button class="b gray" data-act="close">Agora não</button></div>')}
ACT.cabbuy=function(){const C=ensureCab();if(C.st)return;if(S.money<CAB.price)return toast('Dinheiro insuficiente','bad');cash(-CAB.price,'Cabana do Caçador');C.st=1;C.d=S.day+CAB.obra;cabRefresh();hideModal();toast('🪓 A obra da sua cabana começou! Pronta em '+CAB.obra+' dias.','good')};
// ---------- objetos fora: placa do terreno, armadilhas
function trapAt(t){return{x:t.x,y:t.y}}
const _evoCab=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoCab(L,x0,x1,y0,y1);if(inRoom())return;const C=S.cab;
 const sx=(CAB.door+1)*TS+10,sy=(CAB.y+CAB.h)*TS+14;if(cabSt()===0&&sx>x0-40&&sx<x1+40&&sy>y0-40&&sy<y1+60)L.push([sy,10,{draw:g=>{BW(g,'#5a3a22',sx-.8,sy-14,1.6,14);BW(g,'#3a2414',sx-13,sy-24,26,11);BW(g,'#e8d8b0',sx-12,sy-23,24,9);ptext(g,'CABANA',sx-11.5,sy-22.4,'#5a2a12');ptext(g,'A VENDA',sx-11.8,sy-17.6,'#2a5a2a')}}]);
 if(!C)return;for(const t of C.placed){if(t.x<x0-40||t.x>x1+40||t.y<y0-40||t.y>y1+60)continue;L.push([t.y,10,{draw:g=>drawTrap(g,t)}])}};
function drawTrap(g,t){const x=t.x,y=t.y;Rr(g,'rgba(0,0,0,.2)',x-9,y-1,18,2.4);
 if(t.k==='laco'){Rr(g,'#5a3a22',x-.6,y-8,1.2,8);g.strokeStyle='#9aa0a6';g.lineWidth=.5;g.beginPath();g.ellipse(x+3,y-2,3,1.6,0,0,7);g.stroke();Rr(g,'#9aa0a6',x,y-7,3,.4);if(t.catch){const sp=cabSprite(t.catch.sp,'stand',t.catch);if(sp){g.save();g.translate(x+3,y);g.scale(.8,.8);g.translate(-x-3,-y);g.translate(0,y-1);g.scale(1,-1);g.translate(0,-(y-1));blitSpr(g,sp,x+3,y,1);g.restore()}}}
 else if(t.k==='gaiola'){const W=26,H=12;Rr(g,'#4a4e54',x-W/2,y-H,W,1.2);Rr(g,'#4a4e54',x-W/2,y-1,W,1.2);if(t.catch){const sp=cabSprite(t.catch.sp,'stand',t.catch);if(sp){g.save();g.translate(x,y-1);g.scale(.62,.62);g.translate(-x,-(y-1));blitSpr(g,sp,x,y-1,(t.id%2)?1:-1);g.restore()}}
  for(let i=0;i<=W;i+=2.6)Rr(g,'#6a6e74',x-W/2+i,y-H,.6,H);Rr(g,'#5a5e64',x-W/2,y-H*.55,W,.5);Rr(g,t.catch?'#6a6e74':'rgba(0,0,0,0)',x+W/2-.6,y-H,.6,H);if(!t.catch){Rr(g,'#6a6e74',x+W/2,y-H-6,.6,7);Rr(g,'#6a6e74',x+W/2,y-H-6,4,.6)}Rr(g,'#c8a040',x-1,y-3,2,1.6)}
 else{Rr(g,'#5a3a22',x-.8,y-12,1.6,12);Rr(g,'#4a5a2a',x-3,y-14,6,5);Rr(g,'#3a4a22',x-3,y-14,6,1);Rr(g,'#1a1a1a',x-1.6,y-12.4,2,2);Rr(g,'#3a3a3a',x+1,y-12.4,1,1);if((frame>>4)&1)Rr(g,'#ff3a2a',x+1.2,y-10.6,.6,.6)}}
// ---------- simulação das armadilhas (1 checagem por hora de jogo)
let cabAcc=0;const _updCab=update;update=function(dt){_updCab(dt);if(!S||!S.cab)return;cabAcc+=dt;if(cabAcc<2.5)return;cabAcc=0;const C=S.cab;
 if(cabSt()===2&&C.st===1){C.st=2;cabRefresh();toast('🪓 Sua Cabana do Caçador ficou pronta, na clareira perto da Loja do Caçador!','good')}
 for(const t of C.placed){if(t.k==='cam'){const near=WILD.filter(a=>a.st!=='dead'&&Math.hypot(a.x-t.x,a.y-t.y)<230);for(const a of near){const key=(a.leg||a.sp)+'|'+S.day;if(C.photos.some(p=>p.key===key))continue;C.photos.unshift({key,sp:a.sp,leg:a.leg||null,d:S.day,h:Math.floor(S.t*24),tx:Math.round(t.x/TS),ty:Math.round(t.y/TS),male:!!a.male,pts:a.pts||0});if(C.photos.length>24)C.photos.length=24;if(a.leg)toast('📸 Sua câmera de trilha fotografou o '+LEGH[a.leg].n+'!','good')}continue}
  if(t.catch)continue;const T=TRAPS[t.k],ok=T.sp.filter(k=>SPECIES[k]&&legalSeason(k));if(!ok.length)continue;
  const cand=WILD.filter(a=>a.st!=='dead'&&!a.leg&&!(a.held&&a.held.length)&&ok.includes(a.sp)&&Math.hypot(a.x-t.x,a.y-t.y)<200);let got=null;
  if(cand.length&&Math.random()<T.ch*.16){got=cand[0];WILD.splice(WILD.indexOf(got),1)}else if(Math.random()<T.ch*.02){const sp=pick(ok),s=SPECIES[sp];got={sp,kg:rnd(s.w[0],s.w[1]),male:Math.random()<.5,pts:0}}
  if(got){const s=SPECIES[got.sp];t.catch={sp:got.sp,kg:Math.round((got.kg||s.w[1]*.7)*.72*10)/10,q:.96,pts:got.pts||0,male:!!got.male};toast('🪤 Sua '+T.n.toLowerCase()+' pegou: '+s.n+'!','good')}}};
// interações fora: armar armadilha, ver armadilha, comprar cabana
const _ilCab=interactList;interactList=function(){if(inRoom()){const r=roomAt(P.x,P.y);if(r&&r.id==='cabana')return cabRoomList(r);return _ilCab()}const L=_ilCab();if(P.drive)return L;const C=S.cab;
 const sx=(CAB.door+1)*TS+10,sy=(CAB.y+CAB.h)*TS+14;if(cabSt()===0&&Math.hypot(P.x-sx,P.y-sy)<40)L.push({x:sx,y:sy,r:30,label:'🪓 Cabana do Caçador à venda ('+R$(CAB.price)+')',fn:cabBuyModal});
 if(C){for(const t of C.placed)if(Math.hypot(P.x-t.x,P.y-t.y)<30)L.push({x:t.x,y:t.y,r:24,label:TRAPS[t.k].ic+' '+(t.catch?'Armadilha com '+SPECIES[t.catch.sp].n+'!':t.k==='cam'?'Câmera de trilha':'Ver '+TRAPS[t.k].n.toLowerCase()),fn:()=>trapModal(t.id)});
  const has=C.tinv.laco+C.tinv.gaiola+C.tinv.cam;if(has&&!inTown()&&!C.placed.some(t=>Math.hypot(P.x-t.x,P.y-t.y)<40)&&G[ti(Math.floor(P.x/TS),Math.floor(P.y/TS))]!==2)L.push({x:P.x,y:P.y+2,r:12,label:'🪤 Armar armadilha aqui',fn:trapPlaceModal})}
 return L};
function trapPlaceModal(){const C=ensureCab();reModal=null;
 showModal('<h3>🪤 Armar aqui</h3><div class="dim">Armadilhas armadas: '+C.placed.length+'/8. Volte de vez em quando para ver se pegou algo.</div>'+Object.keys(TRAPS).map(k=>{const T=TRAPS[k];return '<div class="card"><div class="row"><b>'+T.ic+' '+T.n+'</b><span>Na mochila: '+C.tinv[k]+'</span></div><div class="dim">'+T.d+'</div><div class="btns">'+(C.tinv[k]?'<button class="b gold" data-act="trapset" data-v="'+k+'">Armar</button>':'<span class="dim">Compre na prateleira da cabana</span>')+'</div></div>'}).join('')+'<div class="btns"><button class="b gray" data-act="close">Cancelar</button></div>')}
function trapModal(id){const C=ensureCab(),t=C.placed.find(q=>q.id===id);if(!t)return;reModal=()=>trapModal(id);const T=TRAPS[t.k];
 let h='<h3>'+T.ic+' '+T.n+'</h3>';if(t.k==='cam'){const n=C.photos.filter(p=>p.tx===Math.round(t.x/TS)&&p.ty===Math.round(t.y/TS)).length;h+='<div class="card">Fotos desta câmera: <b>'+n+'</b>. Veja todas na mesa da cabana.</div>'}
 else if(t.catch){const s=SPECIES[t.catch.sp];h+='<div class="card">'+cabImg(t.catch.sp,'stand',t.catch,120)+'<b>'+s.n+'</b> · '+t.catch.kg+' kg de carcaça</div><div class="btns"><button class="b gold" data-act="trapget" data-v="'+id+'">Levar a carcaça</button></div>'}
 else h+='<div class="card dim">Armada há '+(S.day-t.d)+' dia(s). Ainda nada.</div>';
 showModal(h+'<div class="btns"><button class="b" data-act="trapback" data-v="'+id+'">Recolher armadilha</button><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ACT,{
 trapset(e){const C=ensureCab(),k=e.v;if(!TRAPS[k]||!C.tinv[k])return;if(C.placed.length>=8)return toast('Máximo de 8 armadilhas armadas','bad');C.tinv[k]--;C.placed.push({id:C.nid++,k,x:Math.round(P.x+(P.dir===2?-14:P.dir===3?14:0)),y:Math.round(P.y+(P.dir===0?12:P.dir===1?-10:2)),d:S.day,catch:null});hideModal();toast(TRAPS[k].ic+' '+TRAPS[k].n+' armada!','good')},
 trapget(e){const C=ensureCab(),t=C.placed.find(q=>q.id===+e.v);if(!t||!t.catch)return;ensureH();S.h.bag.push(Object.assign({},t.catch));P.carry=S.h.bag.reduce((s,c)=>s+c.kg,0);gainXP(10,'armadilha');toast('🎒 Carcaça na mochila: '+SPECIES[t.catch.sp].n,'good');t.catch=null;hideModal()},
 trapback(e){const C=ensureCab(),i=C.placed.findIndex(q=>q.id===+e.v);if(i<0)return;const t=C.placed[i];if(t.catch){ensureH();S.h.bag.push(Object.assign({},t.catch));P.carry=S.h.bag.reduce((s,c)=>s+c.kg,0)}C.tinv[t.k]++;C.placed.splice(i,1);hideModal();toast('Armadilha recolhida')},
 trapbuy(e){const C=ensureCab(),T=TRAPS[e.v];if(!T)return;if(S.money<T.p)return toast('Dinheiro insuficiente','bad');cash(-T.p,'Armadilha: '+T.n);C.tinv[e.v]++;toast(T.ic+' '+T.n+' na mochila','good')}});
// ---------- dentro da cabana
function cabRoomList(r){const L=[],lb={cabguns:'🔫 Parede de armas',cabtaxi:'🦌 Bancada de taxidermia',cabtraps:'🪤 Prateleira de armadilhas',cabtable:'📸 Mesa: fotos e coleção',sleep:'🛏️ Dormir / salvar',cabped:'🏆 Pedestal'};
 for(const it of r.items){if(!it.act)continue;const px=(r.x+it.x+(it.w||1)/2)*TS,py=(r.y+it.y+(it.h||1))*TS+4;let label=lb[it.act]||'Usar';if(it.act==='cabped'){const m=pedMount(it.slot);label=m?'🏆 '+SPECIES[m.sp].n+' empalhado':'🏆 Pedestal vazio'}
  L.push({x:px,y:py,r:24,label,fn:()=>cabAct(it,r)})}
 L.push({x:r.door*TS+8,y:(r.y+r.h-1)*TS,r:16,label:'🚪 Sair',fn:exitRoom});return L}
function cabAct(it,r){if(it.act==='sleep')return sleepModal();if(it.act==='cabguns')return gunsModal();if(it.act==='cabtaxi')return taxiModal();if(it.act==='cabtraps')return trapShelfModal();if(it.act==='cabtable')return tableModal();if(it.act==='cabped'){const m=pedMount(it.slot);return m?mountEdit(m.id):taxiModal()}}
const _raCab=roomAct;roomAct=function(it,r){if(r&&r.id==='cabana')return cabAct(it,r);return _raCab(it,r)};
const pedMount=s=>{const C=S.cab;if(!C)return null;return C.mounts.filter(m=>m.kind==='full')[s]||null};
function gunsModal(){ensureH();reModal=gunsModal;const H=S.h,ow=ownedW();
 let h='<h3>🔫 Parede de armas</h3><div class="dim">Suas armas ficam penduradas aqui. Pegue a que vai levar para a mata.</div>';
 h+=ow.length?ow.map(k=>{const w=WEAPONS[k],a=AMMO[w.ammo];return '<div class="card'+(H.eq===k?' sel':'')+'"><div class="row"><b>'+wIcon(k,1)+' '+w.n+'</b><span class="dim">'+(H.mag[k]||0)+'/'+w.cap+' · estoque '+(H.ammo[w.ammo]||0)+'</span></div><div class="btns">'+(H.eq===k?'<span class="grn">✋ Na mão</span><button class="b" data-act="cabhang">Pendurar na parede</button>':'<button class="b gold" data-act="hequip" data-v="'+k+'">Pegar esta</button>')+'</div></div>'}).join(''):'<div class="card dim">Você ainda não tem armas. Compre na Loja do Caçador.</div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
ACT.cabhang=function(){const H=S.h;if(!H.eq)return;if(typeof AIM!=='undefined')AIM.relT=0;H.eq=null;P.aim=0;toast('🔫 Arma pendurada na parede da cabana')};
function trapShelfModal(){const C=ensureCab();reModal=trapShelfModal;
 let h='<h3>🪤 Prateleira de armadilhas</h3><div class="dim">Compre e leve na mochila. Na mata, chegue no lugar e use “Armar armadilha aqui”. Armadas: '+C.placed.length+'/8.</div>';
 h+=Object.keys(TRAPS).map(k=>{const T=TRAPS[k];return '<div class="card"><div class="row"><b>'+T.ic+' '+T.n+'</b><span class="gold">'+R$(T.p)+'</span></div><div class="dim">'+T.d+' Na mochila: '+C.tinv[k]+'</div><div class="btns"><button class="b gold" data-act="trapbuy" data-v="'+k+'">Comprar</button></div></div>'}).join('');
 if(C.placed.length)h+='<div class="sec">ARMADAS</div><div class="card">'+C.placed.map(t=>'<div class="row"><span>'+TRAPS[t.k].ic+' '+TRAPS[t.k].n+' · '+bioName(t.x,t.y)+'</span><span class="'+(t.catch?'grn':'dim')+'">'+(t.k==='cam'?'fotografando':t.catch?SPECIES[t.catch.sp].n+'!':'vazia')+'</span></div>').join('')+'</div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function bioName(x,y){const b=typeof bioAt==='function'?bioAt(Math.floor(x/TS),Math.floor(y/TS)):'';return {f:'Floresta',m:'Montanha',c:'Cerrado',p:'Pantanal'}[b]||'Mata'}
function tableModal(){const C=ensureCab(),lg=typeof ensureLg==='function'?ensureLg():{hunt:{}};reModal=tableModal;
 let h='<h3>📸 Mesa do caçador</h3><div class="sec">FOTOS DA CÂMERA DE TRILHA</div>';
 h+=C.photos.length?'<div style="display:flex;flex-wrap:wrap;gap:6px">'+C.photos.slice(0,12).map(p=>'<div class="card" style="width:46%;padding:4px;text-align:center">'+cabImg(p.sp,'stand',p,140,1)+'<div style="font-size:13px">'+(p.leg?'✨ <b class="gold">'+LEGH[p.leg].n+'</b>':SPECIES[p.sp].n)+'</div><div class="dim" style="font-size:12px">Dia '+(p.d%30+1)+' · '+String(p.h).padStart(2,'0')+'h · '+bioName(p.tx*TS,p.ty*TS)+'</div></div>').join('')+'</div>':'<div class="card dim">Nenhuma foto ainda. Arme uma câmera de trilha na mata.</div>';
 const lgk=Object.keys(lg.hunt||{});h+='<div class="sec">🏆 COLEÇÃO</div><div class="card">'+(lgk.map(k=>'<div class="row"><span>✨ '+LEGH[k].n+'</span><span class="gold">'+lg.hunt[k].kg+' kg</span></div>').join('')+C.mounts.map(m=>'<div class="row"><span>'+(m.kind==='head'?'🦌 Cabeça':'🏆 Corpo inteiro')+': '+SPECIES[m.sp].n+(m.pts>=8?' ('+m.pts+' pontas)':'')+'</span><span class="dim">'+m.kg+' kg</span></div>').join('')||'<span class="dim">Nada empalhado ainda.</span>')+'</div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
// taxidermia
const mCost=(c,kind)=>Math.round((kind==='head'?700+c.kg*6:1800+c.kg*15)/10)*10;
function taxiModal(){ensureH();const C=ensureCab(),bag=S.h.bag;reModal=taxiModal;
 let h='<h3>🦌 Bancada de taxidermia</h3><div class="dim">Escolha uma carcaça da mochila. A cabeça vai para a parede; o corpo inteiro vai para um pedestal ('+C.mounts.filter(m=>m.kind==='full').length+'/4). Cabeças na parede: '+C.mounts.filter(m=>m.kind==='head').length+'/6.</div>';
 h+=bag.length?bag.map((c,i)=>'<div class="card"><div class="row">'+cabImg(c.sp,'alert',c,84,1)+'<span style="flex:1;margin-left:6px"><b>'+SPECIES[c.sp].n+(c.pts>=8?' 🏆'+c.pts:'')+'</b><br><span class="dim">'+c.kg+' kg · qualidade '+Math.round(c.q*100)+'%</span></span></div><div class="btns"><button class="b gold" data-act="mkmount" data-v="'+i+':head">Cabeça ('+R$(mCost(c,'head'))+')</button><button class="b gold" data-act="mkmount" data-v="'+i+':full">Corpo inteiro ('+R$(mCost(c,'full'))+')</button></div></div>').join(''):'<div class="card dim">Mochila vazia. Cace e traga uma carcaça para empalhar.</div>';
 if(C.mounts.length)h+='<div class="sec">SEUS TROFÉUS (toque para personalizar)</div>'+C.mounts.map(m=>'<div class="card"><div class="row">'+cabImg(m.sp,m.kind==='full'?m.pose:'alert',m,72,1)+'<span style="flex:1;margin-left:6px"><b>'+SPECIES[m.sp].n+'</b> · '+(m.kind==='head'?'cabeça na parede':'corpo inteiro')+'<br><span class="dim">Base: '+MBASE.find(b=>b.id===m.base).n+(m.kind==='full'?' · pose: '+MPOSE.find(p=>p.id===m.pose).n:'')+'</span></span></div><div class="btns"><button class="b" data-act="mtedit" data-v="'+m.id+'">Personalizar</button></div></div>').join('');
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function mountEdit(id){const C=ensureCab(),m=C.mounts.find(q=>q.id===id);if(!m)return;reModal=()=>mountEdit(id);
 let h='<h3>🏆 '+SPECIES[m.sp].n+'</h3>'+cabImg(m.sp,m.kind==='full'?m.pose:'alert',m,200)+'<div class="card"><b>Base</b><div class="btns" style="flex-wrap:wrap">'+MBASE.map(b=>'<button class="b '+(m.base===b.id?'gold':'')+'" data-act="mtset" data-v="'+id+':base:'+b.id+'">'+b.n+'</button>').join('')+'</div>';
 if(m.kind==='full')h+='<b>Pose</b><div class="btns" style="flex-wrap:wrap">'+MPOSE.map(p=>'<button class="b '+(m.pose===p.id?'gold':'')+'" data-act="mtset" data-v="'+id+':pose:'+p.id+'">'+p.n+'</button>').join('')+'</div>';
 h+='<b>Lado</b><div class="btns"><button class="b '+(m.dir<0?'gold':'')+'" data-act="mtset" data-v="'+id+':dir:-1">⬅️ Esquerda</button><button class="b '+(m.dir>0?'gold':'')+'" data-act="mtset" data-v="'+id+':dir:1">➡️ Direita</button></div></div>';
 showModal(h+'<div class="btns"><button class="b red" data-act="mtsell" data-v="'+id+'">Vender a colecionador ('+R$(mtValue(m))+')</button><button class="b gray" data-act="close">Pronto</button></div>')}
const mtValue=m=>Math.round(mCost(m,m.kind)*1.6+(m.pts>=8?m.pts*400:0));
Object.assign(ACT,{
 mkmount(e){const C=ensureCab(),[i,kind]=e.v.split(':'),c=S.h.bag[+i];if(!c)return;const cnt=C.mounts.filter(m=>m.kind===kind).length;if(kind==='head'&&cnt>=6)return toast('A parede já tem 6 cabeças. Venda ou troque uma.','bad');if(kind==='full'&&cnt>=4)return toast('Os 4 pedestais estão ocupados.','bad');
  if(['jararaca','cascavel','sucuri','duck'].includes(c.sp)&&kind==='head')return toast('Esse bicho fica melhor de corpo inteiro','bad');const p=mCost(c,kind);if(S.money<p)return toast('Dinheiro insuficiente','bad');cash(-p,'Taxidermia: '+SPECIES[c.sp].n);
  S.h.bag.splice(+i,1);P.carry=S.h.bag.reduce((s,q)=>s+q.kg,0);const m={id:C.nid++,sp:c.sp,kind,base:'madeira',pose:'alert',dir:C.mounts.length%2?-1:1,kg:c.kg,pts:c.pts||0,male:!!c.male,d:S.day};C.mounts.push(m);gainXP(25,'taxidermia');toast('🦌 Ficou lindo! Personalize a base e a pose.','good');mountEdit(m.id)},
 mtedit(e){mountEdit(+e.v)},
 mtset(e){const [id,k,v]=e.v.split(':'),m=ensureCab().mounts.find(q=>q.id===+id);if(!m)return;m[k]=k==='dir'?+v:v},
 mtsell(e){const C=ensureCab(),i=C.mounts.findIndex(q=>q.id===+e.v);if(i<0)return;const m=C.mounts[i];cash(mtValue(m),'Troféu vendido: '+SPECIES[m.sp].n);C.mounts.splice(i,1);hideModal();toast('💰 Troféu vendido a um colecionador')}});
// ---------- arte dos troféus (usa os mesmos desenhos dos bichos)
function cabSprite(sp,pose,o,ph){o=o||{};const male=!!o.male,pts=male?Math.min(12,o.pts||0):0,key='CB|'+sp+'|'+pose+'|'+(male?1:0)+'|'+pts;
 let ops;const P2=pose==='run'?'run':pose;if(WP[sp])ops=quadOps(WP[sp],P2,ph||Math.PI/2,{male,pts});else if(sp==='turkey')ops=turkeyOps('stand',0);else if(sp==='duck')ops=duckOps('stand',0);else if(sp==='croc')ops=crocOps('stand',0);else if(['jararaca','cascavel','sucuri'].includes(sp))ops=snakeOps(sp,1);else return null;
 return bakeOps(key,ops,Object.assign({top:.14,bot:.24,mid:.42,hi:[[.62,.35,.25,.1]],seed:hsh(sp)},WSHD[sp]||{}))}
const CABIMG={};function cabImg(sp,pose,o,w,inl){const key=sp+'|'+pose+'|'+(o&&o.male?1:0)+'|'+(o&&o.pts||0);if(!CABIMG[key]){const s=cabSprite(sp,pose,o);if(!s)return '';const sc=3,cv=mkCanvas(Math.ceil(s.w*sc)+8,Math.ceil(s.h*sc)+8),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(s.cv,4,4,s.w*sc,s.h*sc);CABIMG[key]=cv.toDataURL()}
 return '<img src="'+CABIMG[key]+'" style="width:'+(inl?w+'px':'100%')+';max-width:'+(w||200)+'px;image-rendering:pixelated;'+(inl?'flex:none':'display:block;margin:0 auto 6px')+'" alt="">'}
function plaque(g,x,y,w,h,base,gold){const col={madeira:'#6a3a1a',tronco:'#8a6038',pedra:'#8a867c',ouro:'#3a2414'}[base]||'#6a3a1a';
 Rr(g,'rgba(0,0,0,.25)',x+1,y+1,w,h);Rr(g,col,x,y,w,h);Rr(g,shade(col,22),x,y,w,1);Rr(g,shade(col,-22),x,y+h-1,w,1);Rr(g,shade(col,-12),x+1.4,y+1.4,w-2.8,h-2.8);Rr(g,col,x+2,y+2,w-4,h-4);
 if(base==='tronco')for(let i=0;i<3;i++)Rr(g,shade(col,-18),x+2+i*2,y+2+i*2,w-4-i*4,.5);if(base==='pedra')for(let i=0;i<5;i++)Rr(g,'#5a7a3a',x+hs(i,3)*(w-2),y+h-2,2,1);
 if(gold||base==='ouro'){Rr(g,'#c8a040',x,y,w,.8);Rr(g,'#c8a040',x,y+h-.8,w,.8);Rr(g,'#e8c860',x+w/2-4,y+h-3.4,8,2)}}
function mountHead(g,cx,y,sp,o,gold){const s=cabSprite(sp,'alert',o);plaque(g,cx-7,y+10,14,11,o.base||'madeira',gold);if(!s)return;
 const isFlat=['croc','jararaca','cascavel','sucuri','duck','turkey','rabbit'].includes(sp),cw=s.cv.width,ch2=s.cv.height,sx=isFlat?0:cw*.5,sw=isFlat?cw:cw*.5,sh=isFlat?ch2:ch2*.7,sc=Math.min(20/(sw/PS),19/(sh/PS));
 g.save();g.translate(cx,y+21);if((o.dir||1)<0)g.scale(-1,1);g.drawImage(s.cv,sx,0,sw,sh,-sw/PS*sc*.45,-sh/PS*sc,sw/PS*sc,sh/PS*sc);g.restore()}
function pedestal(g,x,y,m){const base=m?m.base:'madeira';const by=y+TS;Rr(g,'rgba(0,0,0,.25)',x-1,by-2,TS+2,3);
 if(base==='tronco'){Rr(g,'#7a5232',x,by-7,TS,7);Rr(g,'#c8a070',x,by-8,TS,2);for(let i=0;i<3;i++)Rr(g,'#a87a48',x+3+i*1.5,by-7.6,TS-6-i*3,.4)}
 else if(base==='pedra'){Rr(g,'#8a867c',x-1,by-6,TS+2,6);Rr(g,'#a8a49a',x,by-7,TS-2,2);Rr(g,'#5a7a3a',x+2,by-7.4,4,1);Rr(g,'#5a7a3a',x+10,by-6.8,3,1)}
 else{const c=base==='ouro'?'#3a2414':'#6a3a1a';Rr(g,c,x,by-8,TS,8);Rr(g,shade(c,24),x,by-8,TS,1);Rr(g,shade(c,-20),x+1,by-2,TS-2,2);if(base==='ouro')Rr(g,'#e8c860',x+4,by-5,8,2)}
 if(!m)return;const s=cabSprite(m.sp,m.pose,m);if(!s)return;const sc=Math.min(1,30/s.w);g.save();g.translate(x+TS/2,by-7.5);g.scale(sc*(m.dir||1),sc);g.drawImage(s.cv,s.ox,s.oy,s.w,s.h);g.restore()}
const _dfCab=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W=(it.w||1)*TS,H=(it.h||1)*TS;
 switch(it.k){
  case 'cabguns':{const top=-22;R('rgba(0,0,0,.25)',1,H-2,W,3);R('#4a2a14',0,top,W,H-top);R('#6a3e20',1,top+1,W-2,H-top-6);R('#2a1a0e',2,top+2,W-4,H-top-9);R('#7a4a26',0,top,W,1.6);R('#3a2210',0,H-5,W,5);R('#8a5a32',2,H-4,W-4,.6);R('#c8a040',W/2-1,H-3,2,1);
   const ks=ownedW().filter(k=>k!==S.h.eq).slice(0,5);ks.forEach((k,i)=>{const M=GUNM[k];if(!M)return;const sc=Math.min(.9,(H-top-10)/M.len),gx=x+4+i*((W-8)/Math.max(1,ks.length-1||1));gunAt(g,k,ks.length===1?x+W/2:gx,y+H-7,-Math.PI/2,sc,0)});
   R('rgba(180,220,255,.14)',2,top+2,W-4,H-top-9);R('rgba(255,255,255,.22)',4,top+3,1,H-top-12);R('rgba(255,255,255,.12)',W-8,top+3,.6,H-top-12);if(S.h.eq)ptext(g,'1 NA MAO',x+2.5,y+top-5,'#e8d8b0');break}
  case 'cabtaxi':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#7a5232',0,0,W,H-4);R('#9a6a3a',0,0,W,2);R('#5a3a22',2,H-4,2,4);R('#5a3a22',W-4,H-4,2,4);
   const C=S.cab,nm=C&&C.mounts.length?C.mounts[C.mounts.length-1]:null;if(nm&&S.day-nm.d<1){const s=cabSprite(nm.sp,'stand',nm);if(s){g.save();g.translate(x+W/2,y+3);g.scale(.55,.55);g.drawImage(s.cv,s.ox,s.oy,s.w,s.h);g.restore()}}
   R('#e8e0d0',4,-3,4,4);R('#c8c0b0',4,-3,4,1);R('#8a6a3a',10,-2,1,3);R('#c8c8c8',10,-3,1,1.4);R('#8a6a3a',12,-2,1,3);R('#5a3a22',12,-3,1,1);
   for(let i=0;i<3;i++){R('rgba(200,230,255,.6)',W-14+i*4,-4,3,4);R('#2a2a2a',W-13.4+i*4,-2.6,1.2,1.2)}R('#5a7a9a',W-24,-1,6,1);R('#d8c890',W-30,-2,5,2);
   R('#3a2414',W/2-13,H-3.4,26,3);ptext(g,'TAXIDERMIA',x+W/2-12,y+H-3.2,'#e8d8b0');break}
  case 'cabtraps':{R('#5a3a22',0,-14,W,H+14);R('#3a2414',0,-14,W,1.2);for(let j=0;j<3;j++)R('#7a5232',1,-6+j*10,W-2,1.4);
   for(let i=0;i<4;i++){R('#4a4e54',3,4+i*.6,12,.5)}for(let i=0;i<5;i++)R('#6a6e74',3+i*2.8,4,.5,6);R('#4a4e54',3,10,12,.5);
   g.strokeStyle='#9aa0a6';g.lineWidth=.5;for(let i=0;i<3;i++){g.beginPath();g.ellipse(x+20+i*4,y-9,1.6,2.4,0,0,7);g.stroke()}
   R('#4a5a2a',W-9,-4,6,5);R('#1a1a1a',W-7.6,-2.6,2,2);R('#ff3a2a',W-4.4,-2,.8,.8);R('#9a8a6a',3,H-6,10,5);R('#7a6a4a',3,H-6,10,1);break}
  case 'cabtable':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#7a5232',0,2,W,H-6);R('#9a6a3a',0,2,W,1.4);R('#5a3a22',2,H-4,2,4);R('#5a3a22',W-4,H-4,2,4);
   R('#e8dcb0',4,3,13,8);R('#7a9a5a',5,4,5,3);R('#5a8ab8',10,5,5,2);R('#c83a2a',8,6,1,1);const C=S.cab;if(C&&C.photos.length)for(let i=0;i<Math.min(3,C.photos.length);i++){R('#f4f4f0',W-12+i*2.6,3+i,6,5);R('#4a5a3a',W-11.4+i*2.6,3.6+i,4.8,3.4)}
   R('#3a3a3a',W-4,-3,2,5);R((S.t*24>=18||S.t*24<6)?'#ffd75e':'#e8d8a0',W-4.6,-6,3.2,3.4);R('#3a3a3a',W-4.8,-6.6,3.6,.8);break}
  case 'cabped':pedestal(g,x,y,pedMount(it.slot));break;
  default:_dfCab(g,it,x,y,r)}};
const _dwdCab=drawWallDeco;drawWallDeco=function(g,d,x,y){if(d.k!=='cabheads')return _dwdCab(g,d,x,y);const C=S.cab,lg=typeof ensureLg==='function'?ensureLg():{hunt:{}},r=ROOMS.cabana,X=r.x*TS;
 const slots=[3.6,5.1,7,9.1,10.7,12.3],list=[];for(const k in (lg.hunt||{})){const L=LEGH[k];if(L)list.push({sp:L.sp,male:1,pts:L.sp==='pronghorn'?16:12,base:'ouro',gold:1,leg:k})}
 if(C)C.mounts.filter(m=>m.kind==='head').forEach(m=>list.push(m));
 list.slice(0,6).forEach((m,i)=>{mountHead(g,X+slots[i]*TS,y+2,m.sp,m,m.gold)});
 // lendas a mais ficam numa faixa dourada sobre a lareira
 if(list.length>6){Rr(g,'#c8a040',X+6.2*TS,y+2,1.6*TS,5);ptext(g,'+'+(list.length-6),X+6.6*TS,y+2.6,'#2a1a10')}};
GUIDE.push({lv:6,ic:'🪓',t:'Cabana do Caçador',h:'Na clareira perto da Loja do Caçador há um terreno à venda. Construa sua cabana: parede de armas para pegar ou pendurar a arma, bancada de taxidermia (cabeça na parede ou corpo inteiro no pedestal, com base, pose e lado), cabeças dos lendários abatidos com placa dourada, prateleira de armadilhas (laço, gaiola para javali e câmera de trilha) e mesa com as fotos da câmera.'});
// ===== ONÇA-PINTADA redesenhada: rosetas, barriga clara, cauda anelada, cabeça larga e olhos âmbar
const ONCAP={L:19,bh:7,lg:5.8,c:'#d8973a',lt:'#eab35c',bel:'#f6ecd4',belF:.34,throat:'#f6ecd4',cheek:'#f2e4c4',neckA:10,neckL:2.4,neckT0:6.6,neckT1:5.4,hw:6.2,hh:5.4,taper:.3,muzL:.24,muz:'#f2e2c2',nose:'#9a5a4a',ear:'round',earS:1.1,earIn:'#2a1a0a',paw:1,foot:'#c88838',lw1:2.9,lw2:2.2,legGap:2.2,tilt:.12,hump:.4,humpU:.8,
 tail:(R,x,t,o,pose,ph,c)=>{const up=pose==='run'?-1.2:0;for(let i=0;i<13;i++){const u=i/12,tx=x-1-i*.72,ty=t+1.2+Math.sin(u*Math.PI*.9)*5.2+up*(1-u)-u*u*1.4+Math.sin(i*.5+ph)*.25;R(c,tx,ty,2,2);R('#f2e4c4',tx,ty+1.4,2,.6);if(i>6&&i%2===1)R('#1a120a',tx,ty,1.2,2);if(i===12)R('#1a120a',tx-.4,ty,2.2,2)}},
 head:(R,hx,hy,hw,hh,tilt,o)=>{const ex=hx+hw*.12,ey=hy-hh*.18+hw*.37*tilt;R(o.night?'#f4f070':'#d8a030',ex-.2,ey-.1,1.5,1.2);R('#120c08',ex+.3,ey,.6,1.05);for(let i=0;i<7;i++)R('#1a120a',hx-hw*.2+hs(i,4)*hw*.55,hy-hh*.45+hs(4,i)*hh*.5,.6,.6);R('#fff',hx+hw*.5,hy+hh*.15,1.6,.9,1);R('#5a3a22',hx+hw*.45,hy+hh*.35,2.2,.3,1)},
 extra:(R,x0,x1,top,bot)=>{const K='#1e140a';for(let i=0;i<20;i++){const u=.07+((i*.618)%1)*.84,x=x0+u*19,tt=top(u),bb=bot(u),y=tt+1.3+hs(11,i)*(bb-tt)*.5,r=.95+hs(i,13)*.35;R('#c07a2c',x-r*.5,y-r*.5,r,r,1);R(K,x-r*.7,y-r,r*1.3,.5,1);R(K,x-r*.6,y+r-.5,r*1.1,.5,1);R(K,x-r,y-r*.6,.5,r*1.1,1);R(K,x+r-.5,y-r*.3,.5,r*.7,1);if(i%3===0)R(K,x-.2,y-.2,.45,.45,1)}
  for(let i=0;i<10;i++){const u=hs(i,17)>.5?.12+hs(i,19)*.08:.82+hs(i,19)*.06;R('#1a120a',x0+u*19+hs(i,23)*1.5,-4.6+hs(23,i)*3.4,.6,.6)}}};
function oncaSpr(pose,f,night){const key='ON|'+pose+'|'+f+'|'+(night?1:0);let s=WSPR.get(key);if(s&&WSPS===PS)return s;const P2=pose==='stalk'?Object.assign({},ONCAP,{lg:3.8,neckA:-6,hump:1.2}):ONCAP;
 return bakeOps(key,quadOps(P2,pose==='stalk'?'walk':pose,f*Math.PI/2,{night}),{top:.14,bot:.26,mid:.42,hi:[[.6,.35,.22,.1]],fur:.05,seed:77})}
drawOnca=function(g){const o=ONCA;if(!o)return;const st=o.st,pose=st==='flee'||st==='attack'?'run':st==='stalk'?'stalk':'walk',f=st==='attack'?2:(frame>>(pose==='run'?2:3))&3,night=daylight()<.35;
 if(RMODE!==1)Rr(g,'rgba(0,0,0,.28)',o.x-12,o.y-1.2,24,2.6);if(RMODE===4)return;blitSpr(g,oncaSpr(pose,f,night),o.x,o.y,o.dir>0?1:-1)};
drawOncaC=function(g,O){const d=O.flee?1:(CMT.cx>O.x?1:-1);Rr(g,'rgba(0,0,0,.28)',O.x-12,O.y-1.2,24,2.6);blitSpr(g,oncaSpr(O.flee?'run':'stalk',(frame>>2)&3,daylight()<.35),O.x,O.y,d)};
