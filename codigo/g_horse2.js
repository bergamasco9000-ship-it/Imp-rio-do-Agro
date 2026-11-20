// ===== Cavalos de verdade (raças, potro xucro, doma, treino, três tambores) + comitiva de gado =====
Object.assign(HORSES,{quarto:{n:'Quarto de Milha',p:25000,lv:6,spd:205,col:'#a0522d'},pantaneiro:{n:'Cavalo Pantaneiro',p:12000,lv:4,spd:175,col:'#d8b878'}});
const HPAL={crioulo:{c:'#c8a060',dk:'#3a2a1a',mn:'#2a1e14',leg:'#3a2a1a',str:1},mangalarga:{c:'#c8c4bc',dk:'#8a8680',mn:'#e8e4dc',leg:'#8a8680',dap:1},arabe:{c:'#ece8e0',dk:'#b8b4ac',mn:'#f8f6f0',leg:'#d8d4cc',slim:1},quarto:{c:'#a0522d',dk:'#6a3018',mn:'#5a2a12',leg:'#a0522d',blaze:1,sock:1,bulk:1},pantaneiro:{c:'#d8b878',dk:'#8a6a3a',mn:'#5a4020',leg:'#7a5a30'}};
const HNAMES=['Trovão','Relâmpago','Pingo','Estrela','Tufão','Faísca','Corisco','Princesa','Ventania','Baio','Sereno','Pé de Pano','Canela','Rojão'];
function ensureHorses(){if(!S.horses){S.horses=S.horse?[Object.assign(S.horse,{id:1,sex:'M',age:1500,tame:100,sk:30,hp:100})]:[]}S.horses.forEach(h=>{if(h.tame===undefined){h.tame=100;h.sk=h.sk||30;h.age=h.age||1500;h.sex=h.sex||'M';h.hp=h.hp||100}});if(S.horse&&!S.horses.includes(S.horse)){const f=S.horses.find(h=>h.id===S.horse.id);if(f)S.horse=f}return S.horses}
const hSpdBonus=h=>1+(h.sk||0)/100*.18;
HSPD=function(){const h=S.horse;return h&&HORSES[h.b]?HORSES[h.b].spd*hSpdBonus(h):190};
toggleHorse=function(){if(!S.horse)return;if(P.drive)return;if(!S.horseOn&&P.aim)return;if(!S.horseOn&&S.horse.tame<80)return toast('🐴 '+S.horse.name+' ainda é xucro ('+Math.round(S.horse.tame)+'% domado). Dome na cocheira antes de montar.','bad');S.horseOn=!S.horseOn;toast(S.horseOn?'🐴 Você montou no '+S.horse.name:'Você desmontou')};
// ---------- desenho do cavalo em tamanho real
function drawHorseS(g,x,y,dir,b,o){o=o||{};const H=HPAL[b]||HPAL.crioulo,c=H.c,dk=H.dk,mn=H.mn,lt=shade(c,18),mv=o.mv,ph=o.ph||0,k=o.k||1;
 const side=dir>=2,d=dir===3?1:-1,r=(col,dx,dy,w,h)=>Rr(g,col,side?(d>0?x+dx*k:x-(dx+w)*k):x+dx*k,y+dy*k,w*k,h*k);
 Rr(g,'rgba(0,0,0,.28)',x-(side?15:7)*k,y-1.4,(side?30:14)*k,3);
 if(side){const sw=mv?ph:0,g1=Math.sin(sw)*3.2,g2=Math.sin(sw+Math.PI)*3.2,bh=H.bulk?11:H.slim?9:10;
  // pernas do lado de lá
  r(dk,-10+g2*.4,-14,2.2,8);r(dk,-10+g2,-6,1.8,5);r('#1e1a16',-10.2+g2,-1.2,2.4,1.2);r(dk,6+g1*.4,-14,2.2,8);r(dk,6+g1,-6,1.8,5);r('#1e1a16',5.8+g1,-1.2,2.4,1.2);
  // rabo
  const ts=Math.sin(frame/12+(o.id||0))*1.5+(mv?-2:0);r(mn,-15,-25,2.4,4);r(mn,-16+ts*.3,-22,2.4,8);r(mn,-16.5+ts*.6,-15,2.2,7);r(shade(mn,15),-15.5,-24,1,10);
  // corpo
  for(let i=-13;i<9;i+=.5){const u=(i+13)/22,top=-25+Math.sin(u*Math.PI)*-.6+(u<.15?(1-u/.15)*2.2:0)+(u>.8?-(u-.8)*4:0),bot=-14-Math.sin(u*Math.PI)*.8+(u>.75?(u-.75)*-2:0);r(c,i,top,.8,bot-top);r(lt,i,top,.8,1);r(shade(c,-14),i,bot-1,.8,1)}
  if(H.dap)for(let i=0;i<9;i++){r(shade(c,14),-10+hs(i,3)*18,-23+hs(3,i)*7,2,1.6)}
  if(H.str)r(dk,-12,-25.4,18,.8);
  // pernas do lado de cá
  r(c,-12+g1*.3,-16,3.6,4);r(H.leg,-11+g1*.4,-14,2.4,8);r(H.sock?'#f4f0e8':H.leg,-11+g1,-6,2,5);r('#1e1a16',-11.2+g1,-1.2,2.6,1.2);
  r(c,5+g2*.3,-16,3.2,4);r(H.leg,5.6+g2*.4,-14,2.4,8);r(H.sock?'#f4f0e8':H.leg,5.8+g2,-6,2,5);r('#1e1a16',5.6+g2,-1.2,2.6,1.2);
  // pescoço e cabeça
  const hb=mv?Math.sin(sw*2)*.6:0,gr=o.graze;
  if(gr){for(let i=0;i<7;i+=.5){const t=-24+i*2.2,bt=-16+i*2.2;r(c,8+i,t,.8,bt-t+4)}r(c,14,-6,4,6);r(c,16,-3,4,4);r(dk,19,-2,1.2,1.2);r('#111',15.5,-4.5,1,1)}
  else{for(let i=0;i<6;i+=.5){const t=-25-i*1.4+hb,bt=-15-i*1.6+hb;r(c,8+i,t,.8,bt-t);r(lt,8+i,t,.8,.8)}
   r(c,12.5,-35+hb,5,5);r(c,15,-33+hb,4.6,4);r(c,17.5,-31.5+hb,2.6,3.6);r(shade(c,-20),19.4,-30+hb,1,1.6);r('#111',14.6,-33.4+hb,1.1,1.1);r('#fff',15,-33.4+hb,.4,.4);
   r(shade(c,-10),12.6,-37.5+hb,1.4,2.6);r(shade(c,-10),14,-37+hb,1.2,2.2);if(H.blaze)r('#f4f0e8',16,-34+hb,1.4,5);
   for(let i=0;i<6;i+=1)r(mn,7+i,-27-i*1.5+hb+Math.sin(frame/10+i)*.3,1.6,3);r(mn,12,-37+hb,2,2)}
  // arreio e sela
  if(o.saddle){r('#5a2a12',-5,-26.5,9,3);r('#7a3a1a',-4.5,-27.2,8,1.4);r('#3a1a0a',-1,-24,1.2,7);r('#888',-1.4,-17,2,1.4);if(!gr){r('#3a1a0a',13,-33,5,.6);r('#3a1a0a',8,-28,6,.6)}}
 }else{const front=dir===0,sw=mv?Math.sin(ph)*2:0;
  r(H.leg,-5,-12+Math.max(0,sw),2.2,12-Math.max(0,sw));r(H.leg,3,-12+Math.max(0,-sw),2.2,12-Math.max(0,-sw));r('#1e1a16',-5.2,-1.2,2.6,1.2);r('#1e1a16',2.8,-1.2,2.6,1.2);
  r(c,-6,-24,12,13);r(lt,-6,-24,12,1.2);r(shade(c,-14),-6,-12,12,1);
  if(front){r(c,-2.5,-33,5,11);r(c,-2,-30,4,8);r(shade(c,-20),-1.6,-23.5,3.2,1.6);r('#111',-2.6,-30,1,1);r('#111',1.6,-30,1,1);r(shade(c,-10),-3,-35,1.4,2.4);r(shade(c,-10),1.6,-35,1.4,2.4);r(mn,-1,-34,2,3);if(H.blaze)r('#f4f0e8',-.6,-32,1.2,6)}
  else{r(mn,-1.2,-30,2.4,8);r(c,-2.5,-31,5,4);const ts=Math.sin(frame/12)*1;r(mn,-1.2+ts,-22,2.4,12)}
  if(o.saddle){r('#5a2a12',-6.4,-25,12.8,4);r('#7a3a1a',-5,-25.6,10,1.4)}}
}
drawHorse=function(g){const h=S.horse;drawHorseS(g,P.x,P.y,P.dir,h.b,{mv:P.moving,ph:P.ph*1.2,saddle:1,id:h.id})};
const _dplHo=drawPlayer;drawPlayer=function(g){if(P.drive)return _dplHo(g);if(S.horse&&S.horseOn){drawHorse(g);g.save();g.translate(P.dir>=2?(P.dir===3?-2:2):0,-17);_dpl(g);g.restore();if(P.dir===0)horseHeadF(g,P.x,P.y,S.horse.b)}else _dpl(g)};
function horseHeadF(g,x,y,b){const H=HPAL[b]||HPAL.crioulo,c=H.c;Rr(g,c,x-2.5,y-27,5,9);Rr(g,shade(c,-20),x-1.8,y-19.5,3.6,1.6);Rr(g,'#111',x-2.4,y-24,1,1);Rr(g,'#111',x+1.4,y-24,1,1);Rr(g,shade(c,-10),x-3,y-29,1.4,2.4);Rr(g,shade(c,-10),x+1.6,y-29,1.4,2.4);Rr(g,H.mn,x-1,y-28,2,2.5);if(H.blaze)Rr(g,'#f4f0e8',x-.6,y-26,1.2,6);Rr(g,'#3a1a0a',x-2.6,y-21,5.2,.6)}
// ---------- cocheira: cavalos que você não está montando
const RAIL={x:28,y:46};
function railPos(i){return{x:(RAIL.x+i*2.3)*TS+8,y:RAIL.y*TS+12}}
function drawRail(g){const x0=RAIL.x*TS,y=RAIL.y*TS+6;Rr(g,'rgba(0,0,0,.2)',x0,y+6,6*TS,3);for(let i=0;i<=3;i++)Rr(g,'#5a3a22',x0+i*2*TS,y-6,2.4,12);Rr(g,'#8a6a42',x0,y-4,6*TS+2,2);Rr(g,'#6a4a2a',x0,y-2.4,6*TS+2,.6);
 Rr(g,'#7a5232',x0+6*TS+6,y-4,10,8);Rr(g,'#3a7ab8',x0+6*TS+7,y-3,8,3);signBoard(g,x0+3*TS,y-16,'COCHEIRA','#5a3a22','#ffd75e','#1e140c')}
const idleHorses=()=>ensureHorses().filter(h=>h!==S.horse||!S.horseOn);
const _evoHo=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoHo(L,x0,x1,y0,y1);if(inRoom())return;const hs2=ensureHorses();
 if(RAIL.x*TS<x1+40&&(RAIL.x+8)*TS>x0-40&&RAIL.y*TS<y1+40&&RAIL.y*TS>y0-60){L.push([RAIL.y*TS+6,10,{draw:drawRail}]);idleHorses().slice(0,3).forEach((h,i)=>{const p=railPos(i);L.push([p.y,10,{draw:g=>OL(g,p.x,p.y,40,44,c=>drawHorseS(c,p.x,p.y,i%2?2:3,h.b,{graze:((frame>>7)+i)%3===0,saddle:h.tame>=80,id:h.id}))}])})}
 if(CMT.on)cmtItems(L,x0,x1,y0,y1);
};
// ---------- doma do potro xucro e treino
const DM={on:0,iv:null};
function horseModal(id){ensureHorses();reModal=null;const h=S.horses.find(q=>q.id===id);if(!h)return;const B=HORSES[h.b],act=S.horse===h;
 let o='<h3>🐴 '+h.name+'</h3><div class="dim">'+B.n+' · '+(h.sex==='F'?'égua':'cavalo')+' · '+Math.floor(h.age/30)+' meses</div><div class="card">'
  +'<div class="row"><b>Doma</b><span>'+Math.round(h.tame)+'%</span></div>'+bar(h.tame,h.tame>=80?'#5ac04a':'#e0a431')
  +'<div class="row"><b>Treino</b><span>'+Math.round(h.sk)+'/100</span></div>'+bar(h.sk,'#5fa8ff')
  +'<div class="dim">Velocidade '+Math.round(B.spd*hSpdBonus(h))+(h.b==='pantaneiro'?' · não perde velocidade na água/alagado':'')+'</div></div>';
 o+='<div class="btns">'+(h.tame<80?'<button class="b gold" data-act="hdoma" data-v="'+h.id+'">🤠 Domar (sessão)</button>':'<button class="b" data-act="htrain" data-v="'+h.id+'">🏇 Treinar ('+(h.tr===S.day?'amanhã':'hoje')+')</button>')+(act?'<span class="grn">✔ Montaria atual</span>':'<button class="b gold" data-act="hact" data-v="'+h.id+'">Usar este</button>')+'</div>';
 o+='<div class="btns"><button class="b gray" data-act="horsesell" data-v="'+h.id+'">Vender ('+R$(Math.round(B.p*(.5+h.tame/400+h.sk/250)))+')</button><button class="b gray" data-act="close">Fechar</button></div>';showModal(o)}
function domaStart(h){Object.assign(DM,{on:1,h,t:0,x:0,v:0,calm:0,push:0,err:0,n:0});dmRender();clearInterval(DM.iv);DM.iv=setInterval(()=>{if(!$('dmbox')){clearInterval(DM.iv);DM.on=0;return}const dt=.05,wild=1-DM.h.tame/100;DM.t+=dt;DM.v+=(gauss()*2.6*wild*(1+DM.t*.08)*(1-DM.calm*.5)+DM.x*1.05)*dt+DM.push;DM.push=0;DM.v*=.95;DM.x+=DM.v*dt;DM.calm=Math.max(0,DM.calm-dt*.25);DM.n++;DM.err+=Math.abs(DM.x);
 if(Math.abs(DM.x)>=1)return dmEnd(false);if(DM.t>=10)return dmEnd(true);dmRender()},50)}
function dmRender(){const b=$('dmbox');const inner='<div class="row"><b>⏱️ '+DM.t.toFixed(1)+'/10s</b><span class="dim">Calma '+Math.round(DM.calm*100)+'%</span></div><div style="position:relative;height:22px;background:#2a2a2a;border-radius:4px;margin:6px 0"><div style="position:absolute;left:35%;width:30%;top:0;bottom:0;background:#2f6a2a"></div><div style="position:absolute;top:0;bottom:0;width:6px;background:#ffd75e;left:calc('+((DM.x+1)/2*100)+'% - 3px)"></div></div><div style="font-size:34px">'+(Math.abs(DM.x)>.6?'🐎💨':'🐴')+'</div><div class="btns" style="justify-content:center"><button class="b" data-act="dml" style="font-size:20px">⬅ Rédea</button><button class="b gold" data-act="dmc" style="font-size:20px">🤚 Acalmar</button><button class="b" data-act="dmr" style="font-size:20px">Rédea ➡</button></div>';
 if(b){b.innerHTML=inner;return}showModal('<h3>🤠 Domando '+DM.h.name+'</h3><div class="dim">Segure 10 s em cima do potro. Puxe a rédea contra o pinote (⬅ ➡ ou A/D) e acalme ele (Espaço).</div><div id="dmbox" class="card" style="text-align:center">'+inner+'</div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>');reModal=null}
function dmEnd(ok){clearInterval(DM.iv);DM.on=0;const h=DM.h,gain=ok?Math.round(rnd(18,30)*(1-DM.err/DM.n*.6)):ri(3,7);h.tame=Math.min(100,h.tame+gain);if(!ok){P.hp=Math.max(5,P.hp-10);P.hurt=.6}gainXP(ok?25:5,'doma');
 const b=$('dmbox');if(b)b.innerHTML='<div style="font-size:36px">'+(ok?'🏆':'💥')+'</div><div>'+(ok?'Você aguentou! ':'O potro te derrubou (-10 vida). ')+h.name+' está '+Math.round(h.tame)+'% domado (+'+gain+').'+(h.tame>=80?'<br><b class="grn">Já dá para montar!</b>':'')+'</div>';if(h.tame>=80&&h.tame-gain<80)toast('🐴 '+h.name+' está domado!','good')}
addEventListener('keydown',e=>{if(!DM.on)return;const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft'){e.preventDefault();e.stopPropagation();DM.push=-.55}else if(k==='d'||k==='arrowright'){e.preventDefault();e.stopPropagation();DM.push=.55}else if(k===' '){e.preventDefault();e.stopPropagation();DM.calm=Math.min(1,DM.calm+.25)}},true);
Object.assign(ACT,{
 hdoma(e){const h=S.horses.find(q=>q.id===+e.v);if(!h)return;if(h.dm===S.day&&h.dmn>=2)return toast('O potro já está cansado. Mais doma amanhã.','bad');h.dmn=h.dm===S.day?(h.dmn||0)+1:1;h.dm=S.day;domaStart(h)},
 dml(){DM.push=-.55},dmr(){DM.push=.55},dmc(){DM.calm=Math.min(1,DM.calm+.25)},
 htrain(e){const h=S.horses.find(q=>q.id===+e.v);if(!h||h.tr===S.day)return toast('Já treinou hoje','bad');h.tr=S.day;tgStart({ic:'🏇',n:'Treino de '+h.name,d:'Faça a curva no tambor na hora certa (Espaço). Cada acerto melhora o cavalo.',em:'🛢️🏇🛢️',btn:'VIRAR!',tries:4,w:.2,spd:1.2+HORSES[h.b].spd/400,end:n=>{const g=n*2.5+1;h.sk=Math.min(100,h.sk+g);gainXP(8+n*3,'treino');return '🏇 '+h.name+' melhorou +'+g.toFixed(1)+' de treino (agora '+Math.round(h.sk)+'/100).'}})},
 hact(e){const h=S.horses.find(q=>q.id===+e.v);if(!h)return;S.horseOn=false;S.horse=h;toast('🐴 '+h.name+' é sua montaria agora','good');horseModal(h.id)},
 horsesell(e){const h=S.horses.find(q=>q.id===+e.v);if(!h)return;const p=Math.round(HORSES[h.b].p*(.5+h.tame/400+h.sk/250));cash(p,'Venda de cavalo');S.horses=S.horses.filter(q=>q!==h);if(S.horse===h){S.horseOn=false;S.horse=S.horses[0]||null}toast('🐴 '+h.name+' vendido por '+R$(p),'good');hideModal()},
 hbuy2(e){const[k,xu]=e.v.split(':'),B=HORSES[k];ensureHorses();if(S.horses.length>=4)return toast('A cocheira tem lugar para 4 cavalos','bad');if(LV()<B.lv)return toast('Requer nível '+B.lv,'bad');const p=xu?Math.round(B.p*.4):B.p;if(S.money<p)return toast('Dinheiro insuficiente','bad');cash(-p,B.n);
  const h={id:Date.now()%1e8,b:k,name:pick(HNAMES.filter(n=>!S.horses.some(q=>q.name===n))),sex:Math.random()<.5?'M':'F',age:xu?ri(400,600):ri(1100,2200),tame:xu?ri(5,20):100,sk:xu?0:ri(15,35),hp:100};S.horses.push(h);if(!S.horse||!S.horseOn&&S.horse.tame<80)S.horse=h;toast('🐴 '+h.name+' ('+B.n+(xu?', potro xucro':'')+') chegou na cocheira, ao lado do celeiro.','good');hideModal()}
});
ACT.horsebuy=function(e){ACT.hbuy2({v:e.v})};
npcModal=(old=>function(id){old(id);if(id!=='tiao')return;const mb=$('mbox');mb.querySelectorAll('.sec').forEach(s=>{if(s.textContent==='CAVALOS'){let n=s.nextElementSibling;while(n&&n.classList.contains('card')&&n.textContent.includes('🐴')){const nx=n.nextElementSibling;n.remove();n=nx}s.remove()}});
 const b=[...mb.children].filter(c=>c.classList.contains('btns')).pop();const h='<div class="sec">CAVALOS (cocheira: '+ensureHorses().length+'/4)</div>'+Object.keys(HORSES).map(k=>{const B=HORSES[k];return '<div class="card '+(LV()<B.lv?'lock':'')+'"><div class="row"><b>🐴 '+B.n+'</b><span class="gold">'+R$(B.p)+'</span></div><div class="dim">Velocidade '+B.spd+' · nível '+B.lv+(k==='pantaneiro'?' · anda bem na água':'')+'</div><div class="btns"><button class="b gold" data-act="hbuy2" data-v="'+k+'">Domado</button><button class="b" data-act="hbuy2" data-v="'+k+':1">Potro xucro '+R$(Math.round(B.p*.4))+'</button></div></div>'}).join('');if(b)b.insertAdjacentHTML('beforebegin',h)})(npcModal);
// pantaneiro não perde velocidade no alagado
const _mpHo=movePlayer;movePlayer=function(dx,dy){if(S.horseOn&&S.horse&&S.horse.b==='pantaneiro'&&floodAt(P.x,P.y-2)){dx/=.55;dy/=.55}return _mpHo(dx,dy)};
// treino passivo: andar a cavalo melhora
let rideAcc=0;const _updHo=update;update=function(dt){_updHo(dt);if(!S)return;if(S.horseOn&&S.horse&&P.moving){rideAcc+=dt;if(rideAcc>20){rideAcc=0;S.horse.sk=Math.min(100,(S.horse.sk||0)+.4)}}if(CMT.on)stepCmt(dt)};
const _hdHo=hookDay;hookDay=function(){_hdHo();ensureHorses().forEach(h=>{h.age++});if(S.horses.length>1)cash(-14*(S.horses.length-1),'Ração dos cavalos')};
// ---------- prova dos três tambores (dia 10 na Arena)
const tambDay=()=>fDom()===10;
function tamborModal(){if(!S.horse||S.horse.tame<80)return toast('Você precisa de um cavalo domado','bad');if(!tambDay())return toast('A prova dos Três Tambores é todo dia 10 na Arena','bad');const F=ensureF();if(F.tamb===S.day)return toast('Você já correu hoje','bad');
 const h=S.horse,B=HORSES[h.b];reModal=null;showModal('<h3>🛢️ Prova dos Três Tambores</h3><div class="card">Contorne os 3 tambores (Espaço na hora certa) e depois esporeie na reta final. Seu cavalo: <b>'+h.name+'</b> ('+B.n+', treino '+Math.round(h.sk)+'). Inscrição '+R$(300)+'.</div><div class="btns"><button class="b gold" data-act="tbgo">Largar!</button><button class="b gray" data-act="close">Agora não</button></div>')}
ACT.tbgo=function(){if(S.money<300)return toast('Dinheiro insuficiente','bad');cash(-300,'Inscrição tambores');ensureF().tamb=S.day;const h=S.horse,B=HORSES[h.b],base=19.5-(B.spd-160)/40-h.sk/100*2.2;
 tgStart({ic:'🛢️',n:'Três Tambores',d:'Vire rente ao tambor! Errar = derruba o tambor (+5 s).',em:'🛢️ 🛢️ 🛢️',btn:'VIRAR!',tries:3,w:.17,spd:1.35+B.spd/300,end:n=>{const t=Math.max(13.2,base+(3-n)*5*.75+rnd(-.6,.6)),sc=RIV.slice(0,6).map(r=>({n:r[1],t:Math.round(rnd(15.5,21)*100)/100}));sc.push({n:'Você',t:Math.round(t*100)/100,me:1});sc.sort((a,b)=>a.t-b.t);const pos=sc.findIndex(x=>x.me)+1,pr=[0,6000,3000,1500][pos]||0;if(pr)cash(pr,'Três Tambores');if(pos===1)addTrof('🛢️','Campeão dos Três Tambores · ano '+yearN());h.sk=Math.min(100,h.sk+2);gainXP(20+(4-Math.min(4,pos))*10,'tambores');
  return '⏱️ Seu tempo: <b>'+t.toFixed(2)+'s</b> · '+pos+'º lugar'+(pr?' · '+R$(pr):'')+'<br>'+sc.slice(0,4).map((x,i)=>(i+1)+'º '+x.n+' — '+x.t.toFixed(2)+'s').join('<br>')}})};
arenaModal=(old=>function(){old();const b=[...$('mbox').children].filter(c=>c.classList.contains('btns')).pop();if(b)b.insertAdjacentHTML('beforebegin','<div class="card"><div class="row"><b>🛢️ Três Tambores (dia 10)</b>'+(tambDay()?'<button class="b gold" data-act="atamb">Ir</button>':'')+'</div><div class="dim">Corrida de cavalo contornando 3 tambores. Precisa de cavalo domado.</div></div>')})(arenaModal);
ACT.atamb=()=>tamborModal();
EVENTS.push({k:'tamb',ic:'🛢️',n:'Três Tambores',is:d=>dom(d)===10,d:'Corrida de cavalos na Arena.'});
// ---------- COMITIVA DE GADO
const CMT={on:0};
const CMTD={leilao:{n:'Leilão da Vila',bonus:1.1,wp:()=>[[9*TS,56.5*TS],[9*TS,47.6*TS],[56*TS,47.6*TS],[102*TS,47.6*TS]]},
 frig:{n:'Frigorífico Pantaneiro',bonus:1.24,wp:()=>[[9*TS,56.5*TS],[9*TS,47.6*TS],[57*TS,47.6*TS],[97*TS,47.6*TS],[120*TS,47.6*TS],[124*TS,47.6*TS],[(FRIG.door)*TS+8,47.6*TS],[(FRIG.door)*TS+8,(FRIG.y+FRIG.h)*TS+20]]}};
const FORD={x0:152,x1:156};
function cmtCand(sel){return S.herd.filter(a=>!a.stall&&!a.lead&&!a.led&&a.age>=300&&(sel==='gordo'?(a.w>=430&&!a.breeder&&!(a.sex==='F'&&a.preg)):sel==='machos'?a.sex==='M'&&!a.breeder:!a.breeder&&!(a.sex==='F'&&a.preg))).sort((a,b)=>b.w-a.w)}
function cmtModal(){if(CMT.on)return toast('Já tem uma comitiva na estrada','bad');if(!ensureHorses().some(h=>h.tame>=80))return toast('Para tocar boiada você precisa de um cavalo domado (Tião, no Canil)','bad');reModal=cmtModal;
 const C=S.cmtSet||(S.cmtSet={dest:'leilao',sel:'gordo',n:10,pe:0});const cand=cmtCand(C.sel),n=Math.min(C.n,cand.length),est=cand.slice(0,n).reduce((s,a)=>s+valueOf(a,'mkt'),0)*CMTD[C.dest].bonus;
 const bt=(act,v,lab,on)=>'<button class="b '+(on?'gold':'')+'" data-act="'+act+'" data-v="'+v+'">'+lab+'</button>';
 showModal('<h3>🐂🏇 Comitiva de gado</h3><div class="dim">Toque a boiada a cavalo pela estrada. Fique atrás do gado para ele andar, busque as reses que se desgarram. Cães de escolta e peões ajudam.</div>'
  +'<div class="sec">DESTINO</div><div class="btns">'+bt('cmd','leilao','🏛️ Leilão da Vila (+10%, perto)',C.dest==='leilao')+bt('cmd','frig','🏭 Frigorífico (+24%, longe, travessia de rio)',C.dest==='frig')+'</div>'
  +'<div class="sec">QUAIS ANIMAIS</div><div class="btns">'+bt('cms','gordo','Bois gordos (450kg+)',C.sel==='gordo')+bt('cms','machos','Machos',C.sel==='machos')+bt('cms','todos','Todos (sem reprodutores/prenhas)',C.sel==='todos')+'</div>'
  +'<div class="btns">'+[5,10,20,40].map(k=>bt('cmn',k,k+' cab.',C.n===k)).join('')+'</div><div class="dim">'+n+' animais · valor estimado <b class="gold">'+R$(Math.round(est))+'</b></div>'
  +'<div class="sec">PEÕES DE COMITIVA (R$ 250 cada)</div><div class="btns">'+[0,1,2].map(k=>bt('cmp',k,k+' peão'+(k===1?'':'es'),C.pe===k)).join('')+'</div>'
  +'<div class="btns">'+(n>=3?'<button class="b gold" data-act="cmgo">🐂 Sair com a comitiva</button>':'<span class="dim">Precisa de pelo menos 3 animais</span>')+'<button class="b gray" data-act="close">Cancelar</button></div>')}
Object.assign(ACT,{cmd(e){S.cmtSet.dest=e.v},cms(e){S.cmtSet.sel=e.v},cmn(e){S.cmtSet.n=+e.v},cmp(e){S.cmtSet.pe=+e.v},cmgo(){cmtStart()},cmend(){cmtAbort()}});
function cmtStart(){const C=S.cmtSet,cand=cmtCand(C.sel).slice(0,C.n);if(cand.length<3)return;if(S.money<C.pe*250)return toast('Dinheiro insuficiente para os peões','bad');cash(-C.pe*250,'Peões de comitiva');hideModal();
 if(!S.horse||S.horse.tame<80)S.horse=S.horses.find(h=>h.tame>=80);S.horseOn=true;if(P.drive)vExit();
 const wp=CMTD[C.dest].wp(),R=10+Math.sqrt(cand.length)*8;Object.assign(CMT,{on:1,dest:C.dest,wp,wi:1,cx:wp[0][0],cy:wp[0][1],dx:0,dy:-1,pe:C.pe,t:0,ev:{},start:cand.length,lost:0,dead:0,cows:cand.map((a,i)=>{a.led=1;a.drive=1;const an=Math.random()*6.283,rr=Math.sqrt(Math.random())*R;return{a,ox:Math.cos(an)*rr,oy:Math.sin(an)*rr*.6,st:'herd',sx:0,sy:0,t:0}})});
 CMT.cows.forEach(c=>{const s=spriteOf(c.a);s.x=CMT.cx+c.ox-8;s.y=CMT.cy+c.oy-10;s.go=0});P.x=CMT.cx-20;P.y=CMT.cy+40;camInit=0;
 CMT.peons=Array.from({length:C.pe},(_,i)=>({x:CMT.cx+(i?30:-30),y:CMT.cy,ph:0,b:pick(['crioulo','pantaneiro','quarto']),cd:0}));
 toast('🐂🏇 A comitiva saiu! Fique ATRÁS da boiada para ela andar. Busque as que se desgarrarem.','good')}
function cmtAbort(){for(const c of CMT.cows){c.a.led=0;c.a.drive=0;cowBack(c.a)}CMT.on=0;toast('A comitiva voltou e o gado foi devolvido ao pasto.');hideModal()}
function cmtPos(c){return{x:CMT.cx+c.ox,y:CMT.cy+c.oy}}
function stepCmt(dt){const C=CMT;C.t+=dt;const n=C.cows.length;if(!n){C.on=0;return}
 const tg=C.wp[C.wi],tx=tg[0]-C.cx,ty=tg[1]-C.cy,td=Math.hypot(tx,ty)||1,ux=tx/td,uy=ty/td;C.dx=ux;C.dy=uy;
 const pdx=P.x-C.cx,pdy=P.y-C.cy,pd=Math.hypot(pdx,pdy),behind=pdx*ux+pdy*uy<15,push=pd<140&&behind,ford=C.cx>FORD.x0*TS&&C.cx<FORD.x1*TS;
 let v=push?(24+C.pe*3)*(ford?.5:1):0;if(C.pe&&!push&&pd<260)v=10;
 C.cx+=ux*Math.min(td,v*dt);C.cy+=uy*Math.min(td,v*dt);if(td<6){if(C.wi<C.wp.length-1)C.wi++;else return cmtArrive()}
 if(!push&&pd>=140&&C.t%6<dt)tt('cmtf','🐂 O gado parou: chegue por trás para tocar a boiada','bad',5);
 if(push&&pdx*ux+pdy*uy>15)tt('cmtfr','Você está na frente do gado! Vá para trás dele.','bad',5);
 const night=S.t*24>=19||S.t*24<5,storm=S.weather==='chuva';let pS=.004+(pd>200?.02:0)+(night?.006:0)+(ford?.03:0)+(storm?.006:0);
 // eventos
 if(C.dest==='frig'&&!C.ev.onca&&C.wi>=4&&Math.random()<dt*.05){C.ev.onca={x:C.cx+(Math.random()<.5?-1:1)*90,y:C.cy+60,t:0};toast('🐆 Uma onça está rondando a boiada! Chegue perto dela para espantar!','bad')}
 const O=C.ev.onca;if(O&&!O.done){O.t+=dt;const dO=Math.hypot(P.x-O.x,P.y-O.y);O.x+=(C.cx-O.x)*dt*.25;O.y+=(C.cy+20-O.y)*dt*.25;if(dO<60){O.done=1;O.flee=1;toast('🐆 A onça fugiu para o mato!','good');gainXP(20,'comitiva')}else if(O.t>9){O.done=1;O.flee=1;const vc=C.cows[ri(0,C.cows.length-1)];C.cows.splice(C.cows.indexOf(vc),1);C.dead++;vc.a.led=0;die(vc.a,'onça');toast('🐆 A onça pegou '+vc.a.name+'...','bad')}}
 if(O&&O.flee){O.x+=60*dt;O.y+=40*dt;O.t+=dt;if(O.t>16)O.gone=1}
 if(storm&&!C.ev.stamp&&night&&Math.random()<dt*.03){C.ev.stamp=1;FLASH=1;C.cows.slice(0,Math.ceil(n/3)).forEach(c=>{c.st='stray';c.sx=rnd(-1,1);c.sy=rnd(-1,1);c.t=0});toast('⚡ Um trovão assustou o gado: estouro da boiada!','bad')}
 // vaqueiros: cães e peões
 const dogs=partyDogs();C.dogT=(C.dogT||0)+dt;if(C.dogT>3.5&&dogs.length){C.dogT=0;const s=C.cows.find(c=>c.st==='stray'&&Math.hypot(cmtSp(c).x-C.cx,cmtSp(c).y-C.cy)<300);if(s){s.st='back';tt('cmtd','🐕 '+dogs[0].name+' cercou e trouxe '+s.a.name+' de volta!','good',4)}}
 for(const p of C.peons){p.cd-=dt;const s=C.cows.find(c=>c.st==='stray');let tx2=C.cx-ux*50+(C.peons.indexOf(p)?20:-20),ty2=C.cy-uy*50+(C.peons.indexOf(p)?14:-14);if(s&&p.cd<=0){const sp=cmtSp(s);tx2=sp.x;ty2=sp.y;if(Math.hypot(sp.x-p.x,sp.y-p.y)<20){s.st='back';p.cd=4}}const dx=tx2-p.x,dy=ty2-p.y,d=Math.hypot(dx,dy);if(d>3){const sp=Math.min(d,(s?90:Math.max(20,v+10))*dt);p.x+=dx/d*sp;p.y+=dy/d*sp;p.ph+=sp*.15;p.mv=1;p.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1)}else p.mv=0}
 // cada rês
 for(let i=C.cows.length-1;i>=0;i--){const c=C.cows[i],s=spriteOf(c.a);let wx,wy;
  if(c.st==='herd'){if(Math.random()<pS*dt*10/ Math.max(1,C.pe+1)){c.st='stray';const an=Math.atan2(uy,ux)+(Math.random()<.5?1:-1)*rnd(1,2.4);c.sx=Math.cos(an);c.sy=Math.sin(an);c.t=0}
   const t=cmtPos(c);wx=t.x+Math.sin(C.t*.7+i)*2;wy=t.y+(ford?Math.sin(C.t+i)*3+6:0)}
  else if(c.st==='stray'){c.t+=dt;const cs=cmtSp(c);wx=cs.x+c.sx*(c.t<10?14:2)*dt*20;wy=cs.y+c.sy*(c.t<10?14:2)*dt*20;if(Math.hypot(P.x-cs.x,P.y-cs.y)<40){c.st='back';tt('cmtb','🏇 Você trouxe '+c.a.name+' de volta pra boiada','good',2)}
   if(Math.hypot(cs.x-C.cx,cs.y-C.cy)>330&&c.t>25){C.cows.splice(i,1);C.lost++;c.a.led=0;c.a.drive=0;cowBack(c.a);toast('😞 '+c.a.name+' se perdeu da comitiva (voltou sozinha pra fazenda).','bad');continue}}
  else{const t=cmtPos(c);wx=t.x;wy=t.y;const cs=cmtSp(c);if(Math.hypot(cs.x-t.x,cs.y-t.y)<8)c.st='herd'}
  const cs=cmtSp(c),k=c.st==='stray'?1:c.st==='back'?Math.min(1,dt*3):Math.min(1,dt*2.2),nx=cs.x+(wx-cs.x)*k,ny=cs.y+(wy-cs.y)*k;
  if(Math.abs(nx-cs.x)>.05)s.dir=nx>cs.x?1:-1;s.f=Math.hypot(nx-cs.x,ny-cs.y)>.05?((frame>>4)&1):0;s.x=nx-8.5;s.y=ny-10;s.go=0;s.wait=1;s.lie=0}
}
const cmtSp=c=>{const s=spriteOf(c.a);return{x:s.x+8.5,y:s.y+10}};
function cmtArrive(){const C=CMT,D=CMTD[C.dest];let tot=0;const sold=C.cows.map(c=>c.a);sold.forEach(a=>{tot+=valueOf(a,'mkt')*D.bonus});tot=Math.round(tot/10)*10;
 S.herd=S.herd.filter(a=>!sold.includes(a));sold.forEach(a=>SP.delete(a.id));cash(tot,'Comitiva: '+D.n);S.stats.sold=(S.stats.sold||0)+sold.length;S.cmtDone=(S.cmtDone||0)+1;gainXP(40+sold.length*5,'comitiva');S.rep=Math.min(100,S.rep+2);C.on=0;
 if(sold.length>=20)addTrof('🐂','Comitiva de '+sold.length+' cabeças até o '+D.n);
 showModal('<h3>🏁 Comitiva chegou ao '+D.n+'!</h3><div class="card">Entregues: <b>'+sold.length+'</b> de '+C.start+' cabeças'+(C.lost?' · '+C.lost+' desgarrada(s) voltaram pra fazenda':'')+(C.dead?' · '+C.dead+' perdida(s) para a onça':'')+'<br>Pagamento com bônus de '+Math.round((D.bonus-1)*100)+'%: <b class="grn">'+R$(tot)+'</b><br><span class="dim">Tempo de estrada: '+Math.round(C.t/ (dayMs()/1000/24))+' horas.</span></div><div class="btns"><button class="b gold" data-act="close">Que viagem!</button></div>')}
function drawOncaC(g,O){const x=O.x,y=O.y,d=O.flee?1:(CMT.cx>x?1:-1),r=(c,dx,dy,w,h)=>Rr(g,c,d>0?x+dx:x-dx-w,y+dy,w,h),f=(frame>>3)&1;Rr(g,'rgba(0,0,0,.25)',x-12,y-1,24,3);
 r('#c89030',-11,-9,20,7);r('#e0b050',-10,-9,18,2);for(let i=0;i<6;i++)r('#3a2a10',-9+i*3,-8+(i%2)*2,1.6,1.6);r('#c89030',8,-12,6,6);r('#3a2a10',12,-10,1,1);r('#c89030',-14,-10,4,1.4);[-9,-5,3,6].forEach((dx,i)=>r('#b88020',dx+(i%2?f:-f),-3,2,3))}
function drawCmtPeon(g,p){drawHorseS(g,p.x,p.y,p.dir||3,p.b,{mv:p.mv,ph:p.ph,saddle:1});g.save();g.translate(0,-17);drawPerson(g,{x:p.x,y:p.y,dir:p.dir||3,ph:0,mv:0,shirt:'#8a5a2a',hair:'#2a1a10',hat:'#d8c080',pants:'#3a3a5a'});g.restore()}
function cmtItems(L,x0,x1,y0,y1){const C=CMT;for(const p of C.peons)if(p.x>x0-40&&p.x<x1+40)L.push([p.y,10,{draw:g=>OL(g,p.x,p.y,40,50,c=>drawCmtPeon(c,p))}]);const O=C.ev.onca;if(O&&!O.gone)L.push([O.y,10,{draw:g=>drawOncaC(g,O)}]);
 L.push([C.cy-200,10,{draw:g=>{if(RMODE===4)return;const t='COMITIVA '+C.cows.length+'/'+C.start,tw=ptw(t);Rr(g,'rgba(30,18,6,.7)',C.cx-tw/2-2,C.cy-60,tw+4,8);ptext(g,t,C.cx-tw/2,C.cy-58.5,'#ffd75e')}}])}
// vau (travessia) desenhado na estrada do Pantanal
const _pqHo=pqTint;pqTint=function(g){_pqHo(g);if(inRoom())return;const x0=FORD.x0*TS,x1=FORD.x1*TS,y0=45*TS,y1=51*TS;if(x1<CX||x0>CX+VW||y1<CY||y0>CY+VH)return;g.fillStyle='rgba(70,120,140,.62)';g.fillRect(x0,y0,x1-x0,y1-y0);for(let i=0;i<10;i++){const ph=(frame*.4+i*13)%(y1-y0);Rr(g,'rgba(220,240,250,.45)',x0+4+((i*23)%(x1-x0-8)),y0+ph,5,.8)}Rr(g,'rgba(196,224,214,.7)',x0,y0,1.5,y1-y0);Rr(g,'rgba(196,224,214,.7)',x1-1.5,y0,1.5,y1-y0)};
const _mpHo2=movePlayer;movePlayer=function(dx,dy){const tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS);if(tx>=FORD.x0&&tx<FORD.x1&&ty>=45&&ty<51&&!(S.horseOn&&S.horse&&S.horse.b==='pantaneiro')){dx*=.6;dy*=.6}return _mpHo2(dx,dy)};
// frigorífico
BART.frig=(g,b,x,y,w,h,dx)=>{const rh=h-38;shadowB(g,x,y,w,h);
 for(let i=0;i<4;i++)BW(g,'#7a7a82',x-22+i*6,y+h-18,1.6,18);BW(g,'#9a9aa2',x-22,y+h-16,20,1.2);BW(g,'#9a9aa2',x-22,y+h-9,20,1.2);for(let i=0;i<5;i++)BW(g,'#8a8a92',x-4+i*.8,y+h-6+i,6,1);
 wallCal(g,x,y+rh,w,h-rh,'#eef2f4','#4a6a8a');roofMetal(g,x,y,w,rh,'#a8b0b8');
 BW(g,'#2a4a6a',x-2,y+rh-4,w+4,10);ptext(g,'FRIGORIFICO PANTANEIRO',x+w/2-ptw('FRIGORIFICO PANTANEIRO')/2,y+rh-1.5,'#fff');
 stdWins(g,b,x,y,h,(g,a,c)=>winBars(g,a,c,'#c8ccd0'));doorRoll(g,x+dx,y+h-24);
 const tx=x+w+6,ty=y+h;BW(g,'rgba(0,0,0,.3)',tx,ty-1,40,3);BW(g,'#f4f4f4',tx,ty-22,28,18);BW(g,'#d8dcdc',tx,ty-6,28,2);ptext(g,'FRIO',tx+6,ty-16,'#2a4a6a');BW(g,'#c83a2a',tx+28,ty-14,11,10);BW(g,'#9ad0e0',tx+31,ty-12,6,4);BW(g,'#222',tx+3,ty-5,6,6);BW(g,'#222',tx+20,ty-5,6,6);BW(g,'#222',tx+31,ty-5,6,6)};
// início da comitiva: na porteira do pasto
const _ilHo=interactList;interactList=function(){const L=_ilHo();if(inRoom()||P.drive)return L;
 L.push({x:(PAS.x-1)*TS+8,y:56.5*TS,r:30,label:'🐂🏇 Organizar comitiva de gado',fn:cmtModal});
 if(CMT.on&&Math.hypot(CMT.cx-P.x,CMT.cy-P.y)<90)L.push({x:CMT.cx,y:CMT.cy,r:28,label:'🛑 Encerrar a comitiva e voltar',fn:()=>showModal('<h3>🛑 Encerrar comitiva?</h3><div class="card">O gado volta para a fazenda sem vender.</div><div class="btns"><button class="b red" data-act="cmend">Encerrar</button><button class="b gray" data-act="close">Continuar</button></div>')});
 ensureHorses().forEach((h,i)=>{if(h===S.horse&&S.horseOn)return;const idx=idleHorses().indexOf(h);if(idx<0||idx>2)return;const p=railPos(idx);L.push({x:p.x,y:p.y-8,r:26,label:'🐴 '+h.name+' ('+(h.tame<80?'xucro '+Math.round(h.tame)+'%':'domado')+')',fn:()=>horseModal(h.id)})});
 if(tambDay()&&Math.hypot(ARC.x-P.x,ARC.y-P.y)<120)L.push({x:ARC.x+40,y:ARC.y,r:30,label:'🛢️ Prova dos Três Tambores',fn:tamborModal});
 return L};
// seta para o destino da comitiva
const _dpHo=drawPart;drawPart=function(g){_dpHo(g);if(!CMT.on||inRoom())return;const tg=CMT.wp[CMT.wp.length-1];if(tg[0]<CX||tg[0]>CX+VW||tg[1]<CY||tg[1]>CY+VH){const ax=clamp(tg[0],CX+10,CX+VW-10),ay=clamp(tg[1],CY+34,CY+VH-14),d=Math.round(Math.hypot(tg[0]-P.x,tg[1]-P.y)/TS);Rr(g,'rgba(20,30,10,.85)',ax-7,ay-7,14,14);ptext(g,'C',ax-1.5,ay-3,'#9aff7a');ptext(g,d+'M',ax-ptw(d+'M')/2,ay+9,'#c8ffb0','#000')}};
ACH.push(['cmt1','Comitiveiro','Leve uma comitiva até o destino',()=>(S.cmtDone||0)>=1,6000],['domador','Domador','Dome um potro xucro',()=>S.horses&&S.horses.some(h=>h.tame>=80&&h.sk<40&&h.dm),5000],['tamb','Rainha dos tambores','Vença os Três Tambores',()=>S.fe&&S.fe.trof.some(t=>t.ic==='🛢️'),8000]);
GUIDE.push({lv:3,ic:'🐴',t:'Cavalos',h:'No Tião (Canil) você compra cavalos domados ou potros xucros (mais baratos). Os seus ficam na COCHEIRA ao lado do celeiro: clique num cavalo para domar (minijogo), treinar e escolher a montaria. Treino deixa o cavalo mais rápido. Todo dia 10 tem a prova dos Três Tambores na Arena. O Pantaneiro não perde velocidade na água.'},
 {lv:3,ic:'🐂',t:'Comitiva',h:'Na porteira do pasto, organize uma comitiva: escolha os animais e o destino (Leilão +10% ou Frigorífico +24%, longe, com travessia de rio e onça). Fique ATRÁS da boiada para ela andar, busque as reses desgarradas. Cães e peões ajudam.'});
const _ebHo=enterBld;enterBld=function(id){if(id!=='frig')return _ebHo(id);const n=S.herd.filter(a=>a.w>=430&&!a.breeder).length;reModal=null;
 showModal('<h3>🏭 Frigorífico Pantaneiro</h3><div class="card">“Aqui a gente paga melhor que o leilão: <b>+24% sobre o preço de mercado</b> para gado que chega em comitiva, a cavalo. Traz a boiada pela estrada, atravessando o córrego.”</div><div class="card"><div class="row"><b>Comitivas entregues</b><span class="gold">'+(S.cmtDone||0)+'</span></div><div class="dim">Você tem '+n+' animal(is) gordo(s) (430 kg+) prontos. Organize a comitiva na porteira do seu pasto.</div></div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')};
