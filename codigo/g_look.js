// ===== Visual do personagem e do parceiro(a): roupas de fazenda =====
const LK={
 skin:['#f4d0b0','#e8b890','#d09a6a','#a86e44','#7a4a2a','#5a3420'],
 hair:['curto','topete','comprido','rabo','coque','careca'],
 hc:['#1a1210','#3a2a1a','#6a4a2a','#c8a050','#a8401a','#c8c8c8'],
 hat:['vaqueiro','palha','bone','gaucho','nenhum'],
 hatc:['#6a4a2a','#2a2a2a','#e8dcc0','#8a2a2a','#3a5a3a','#c8a060'],
 shirt:['xadrez','lisa','jeans','regata','colete'],
 sc:['#b03a2a','#3a5aa0','#3a7a3a','#e0c040','#e8e4dc','#5a3a6a','#2a2a2a','#d87a2a'],
 pants:['jeans','caqui','preta','bombacha','macacao'],
 boots:['#5a3a1a','#2a1a10','#8a5a32','#7a2a1a'],
 beard:['nenhuma','bigode','cavanhaque','barba']
};
const LKN={hair:{curto:'Curto',topete:'Topete',comprido:'Comprido',rabo:'Rabo de cavalo',coque:'Coque',careca:'Careca'},hat:{vaqueiro:'Chapéu de vaqueiro',palha:'Chapéu de palha',bone:'Boné',gaucho:'Chapéu gaúcho',nenhum:'Sem chapéu'},shirt:{xadrez:'Camisa xadrez',lisa:'Camisa lisa',jeans:'Camisa jeans',regata:'Regata',colete:'Colete de couro'},pants:{jeans:'Calça jeans',caqui:'Calça cáqui',preta:'Calça preta',bombacha:'Bombacha',macacao:'Macacão jeans'},beard:{nenhuma:'Sem barba',bigode:'Bigode',cavanhaque:'Cavanhaque',barba:'Barba'}};
const defLook=g=>g==='f'?{g:'f',skin:1,hair:'comprido',hc:2,hat:'palha',hatc:2,shirt:'xadrez',sc:5,pants:'jeans',boots:2,beard:'nenhuma'}:{g:'m',skin:1,hair:'curto',hc:1,hat:'vaqueiro',hatc:0,shirt:'xadrez',sc:0,pants:'jeans',boots:0,beard:'nenhuma'};
function ensureL(){if(!S.look)S.look=defLook('m');if(S.mate&&!S.mateLook){const L=defLook(S.mate.g);if(S.mate.g==='m'){L.shirt='jeans';L.sc=1;L.hat='bone';L.hatc=3}S.mateLook=L}}
const PANTC={jeans:'#3a5a8a',caqui:'#a89060',preta:'#2a2a30',bombacha:'#4a3a2a',macacao:'#3a5a8a'};
function drawFarmer(g,o,L){
 const x=o.x,y=o.y,mv=o.mv,sw=mv?Math.sin(o.ph):0,bob=o.bob!==undefined?o.bob:(mv?Math.abs(Math.cos(o.ph))*(o.run?1.6:1):Math.sin(frame/28)*.25+.25),sn=o.sneak?3:0,by=y-bob+sn;
 const side=o.dir>=2,dr=o.dir===3?1:-1,skin=LK.skin[L.skin]||LK.skin[1],hc=LK.hc[L.hc],sc=LK.sc[L.sc],pc=PANTC[L.pants],bc=LK.boots[L.boots],hatc=LK.hatc[L.hatc],f=L.g==='f';
 const wk=o.work?Math.sin(frame/3):0,shirtC=L.shirt==='jeans'?'#5a7ab0':sc,sd=shade(shirtC,-28),arm=L.shirt==='regata'?skin:shirtC;
 Rr(g,'rgba(0,0,0,.3)',x-5,y-1,10,3);
 const torso=(tx,tw)=>{Rr(g,shirtC,tx,by-14,tw,9);
  if(L.shirt==='xadrez'){for(let i=0;i<tw;i+=2)Rr(g,sd,tx+i,by-14,.8,9);for(let j=1;j<9;j+=3)Rr(g,sd,tx,by-14+j,tw,.8);Rr(g,shade(shirtC,25),tx,by-14,tw,.6)}
  else if(L.shirt==='jeans'){Rr(g,'#4a6aa0',tx,by-14,tw,1);Rr(g,'#8aa0c8',tx+1,by-12,2,2);Rr(g,'#e0c060',tx+tw/2-.3,by-13,.6,7)}
  else if(L.shirt==='regata'){Rr(g,skin,tx,by-14,1,2);Rr(g,skin,tx+tw-1,by-14,1,2)}
  else if(L.shirt==='colete'){Rr(g,'#7a4a22',tx,by-14,tw,9);Rr(g,shirtC,tx+tw/2-1,by-14,2,9);Rr(g,'#5a3418',tx+tw/2-1.5,by-14,.6,9);Rr(g,'#e0c060',tx+1,by-10,.8,.8)}
  if(L.pants==='macacao'){Rr(g,'#3a5a8a',tx+1,by-11,tw-2,6);Rr(g,'#3a5a8a',tx+1,by-14,1,3);Rr(g,'#3a5a8a',tx+tw-2,by-14,1,3);Rr(g,'#e0c060',tx+1,by-11,1,1);Rr(g,'#e0c060',tx+tw-2,by-11,1,1)}
  else{Rr(g,'#3a2414',tx,by-6,tw,1.2);Rr(g,'#e0c060',tx+tw/2-1,by-6.2,2,1.6)}
  if(f)Rr(g,shade(shirtC,-12),tx+1,by-12,tw-2,.6);
 };
 const hair=(hx,front)=>{
  if(L.hair==='careca')return;
  if(L.hair==='comprido'){Rr(g,hc,hx-1,by-21,8,3);if(side)Rr(g,hc,dr>0?hx-1:hx+4,by-20,3,8);else{Rr(g,hc,hx-1,by-20,1.6,8);Rr(g,hc,hx+5.4,by-20,1.6,8)}if(o.dir===1)Rr(g,hc,hx,by-20,6,8)}
  else if(L.hair==='rabo'){Rr(g,hc,hx-.5,by-21,7,2.5);if(side)Rr(g,hc,dr>0?hx-2:hx+6,by-19,2,6);else if(o.dir===1)Rr(g,hc,hx+2,by-19,2,7)}
  else if(L.hair==='coque'){Rr(g,hc,hx-.5,by-21,7,2.5);Rr(g,hc,hx+1.5,by-24,3,3)}
  else if(L.hair==='topete'){Rr(g,hc,hx-.5,by-22,7,3);Rr(g,hc,hx+(side?(dr>0?3:0):1),by-23.5,4,2)}
  else Rr(g,hc,hx-.5,by-21.5,7,2.5);
  if(o.dir===1&&L.hair!=='comprido')Rr(g,hc,hx,by-20,6,4);
 };
 const hat=(hx)=>{if(L.hat==='nenhum')return;const d=shade(hatc,-25),l=shade(hatc,20);
  if(L.hat==='vaqueiro'){Rr(g,hatc,hx-3,by-21.5,12,1.6);Rr(g,d,hx-3,by-20.4,12,.6);Rr(g,hatc,hx,by-25,6,3.6);Rr(g,l,hx+.5,by-25,5,.8);Rr(g,'#2a1a10',hx,by-22.4,6,.9);Rr(g,hatc,hx-3.5,by-22.4,1.2,1);Rr(g,hatc,hx+8.3,by-22.4,1.2,1)}
  else if(L.hat==='palha'){Rr(g,'#e8d090',hx-3.5,by-21.4,13,1.6);for(let i=-3;i<9;i+=2)Rr(g,'#c8a860',hx+i,by-21.2,.6,1.2);Rr(g,'#e8d090',hx,by-24.4,6,3.2);Rr(g,'#b03a2a',hx,by-22.2,6,.8)}
  else if(L.hat==='bone'){Rr(g,hatc,hx-.5,by-23,7,3);Rr(g,l,hx,by-23,5,.8);if(side)Rr(g,d,dr>0?hx+5.5:hx-3.5,by-20.6,4,1);else if(o.dir===0)Rr(g,d,hx,by-20.4,6,1.2);Rr(g,'#fff',hx+2.5,by-22.4,1,1)}
  else{Rr(g,'#1e1e22',hx-3.5,by-21.4,13,1.4);Rr(g,'#1e1e22',hx,by-24.6,6,3.4);Rr(g,'#5a3a22',hx,by-22.2,6,.6);Rr(g,'#c8a040',hx+5,by-22.2,.8,.8)}
 };
 const beard=(hx,side2)=>{const bc2=hc;if(L.beard==='bigode')Rr(g,bc2,side2?(dr>0?hx+3:hx):hx+1.5,by-16.5,side2?3:3,.8);else if(L.beard==='cavanhaque'){Rr(g,bc2,side2?(dr>0?hx+3:hx+1):hx+2,by-15.5,2,1.6);Rr(g,bc2,side2?(dr>0?hx+3:hx):hx+1.5,by-16.5,3,.6)}else if(L.beard==='barba'){Rr(g,bc2,hx,by-17,6,2.6);Rr(g,shade(bc2,15),hx+1,by-16.4,4,.6)}};
 if(side){
  const o1=sw*3.4,o2=-o1,lw=L.pants==='bombacha'?2.6:2;
  Rr(g,shade(pc,-18),x-1+o2,by-6,lw,6-sn-(o2*dr>1.5?1:0)+bob*0);Rr(g,bc,x-1+o2+(dr>0?.6:-.6),y-2.2-(o2*dr>1.5?1:0),2.8,2.2);
  Rr(g,pc,x-1+o1,by-6,lw,6-sn-(o1*dr>1.5?1:0)+bob*0);Rr(g,bc,x-1+o1+(dr>0?.6:-.6),y-2.2-(o1*dr>1.5?1:0),2.8,2.2);
  torso(x-3,6);
  Rr(g,arm,x-1-(o.work?-wk*3:sw*3),by-13-(o.work?2:0),2,6);Rr(g,skin,x-1-(o.work?-wk*3:sw*3),by-7-(o.work?2:0),2,1.4);
  Rr(g,skin,x-3,by-20,6,6);Rr(g,shade(skin,-15),x-3,by-15,6,1);Rr(g,'#1a1210',x+(dr>0?1:-2),by-17.6,1,1);Rr(g,shade(skin,-20),x+(dr>0?3:-4),by-16.4,1,1);
  hair(x-3,0);beard(x-3,1);hat(x-3);
 }else{
  const l1=Math.max(0,sw)*2.6,l2=Math.max(0,-sw)*2.6,lw=L.pants==='bombacha'?2.6:2;
  Rr(g,pc,x-3,by-6,lw,6-sn-l1);Rr(g,bc,x-3.2,y-2.2-l1,2.8,2.2);
  Rr(g,pc,x+1,by-6,lw,6-sn-l2);Rr(g,bc,x+.6,y-2.2-l2,2.8,2.2);
  torso(x-4,8);
  Rr(g,arm,x-5,by-13+(o.work?wk*3-2:sw*1.6),1.4,6);Rr(g,arm,x+3.6,by-13+(o.work?-wk*3-2:-sw*1.6),1.4,6);Rr(g,skin,x-5,by-7+(o.work?wk*3-2:sw*1.6),1.4,1.4);Rr(g,skin,x+3.6,by-7+(o.work?-wk*3-2:-sw*1.6),1.4,1.4);
  Rr(g,skin,x-3,by-20,6,6);Rr(g,shade(skin,-15),x-3,by-15,6,1);
  if(o.dir===0){Rr(g,'#1a1210',x-2,by-17.6,1,1);Rr(g,'#1a1210',x+1,by-17.6,1,1);if(f){Rr(g,'#1a1210',x-2.4,by-18.2,.6,.6);Rr(g,'#1a1210',x+1.8,by-18.2,.6,.6);Rr(g,'#d87a7a',x-.6,by-15.8,1.2,.6)}beard(x-3,0)}
  hair(x-3,o.dir===0);hat(x-3);
 }
 if(o.tool&&o.work){Rr(g,'#5a3a22',x+dr*5,by-14+wk*3,1,9);Rr(g,'#aaa',x+dr*4,by-6+wk*3,3,1)}
}
// jogador: roupa comum usa o visual; camuflagens mantêm o traje de caça
const _dpb=drawPlayerBase;
drawPlayerBase=function(g){
 ensureL();
 if(S.h.outfit==='casual'){drawFarmer(g,{x:P.x,y:P.y,dir:P.dir,ph:P.ph,mv:P.moving&&!P.aim,run:P.run,sneak:P.sneak},S.look);if(S.h.eq&&WEAPONS[S.h.eq]){const mv=P.moving&&!P.aim,bob=mv?Math.abs(Math.cos(P.ph))*(P.run?1.7:1):Math.sin(frame/28)*.25+.25;drawGun(g,P.x,P.y-bob+(P.sneak?3:0),S.h.eq)}}
 else _dpb(g);
};
drawMate=function(g){ensureL();if(!S.mate)return;OL(g,MATE.x,MATE.y+3,30,40,c=>drawFarmer(c,{x:MATE.x,y:MATE.y,dir:MATE.dir,ph:MATE.ph,mv:MATE.mv,work:MATE.work,tool:1},S.mateLook));
 if(MATE.spot&&MATE.spot.a.st!=='dead'){const a=MATE.spot.a;Rr(g,'#ffd75e',a.x-2,a.y-30-((frame>>3)&1)*2,4,4);Rr(g,'#ffd75e',a.x-1,a.y-26,2,3)}};
// ---- editor
let LOOKWHO='me';
function lookModal(){ensureL();reModal=lookModal;const L=LOOKWHO==='me'?S.look:S.mateLook,who=LOOKWHO;
 const row=(k,lbl,names)=>{const arr=LK[k],v=L[k],idx=typeof v==='number'?v:arr.indexOf(v),val=typeof v==='number'?'<span style="display:inline-block;width:22px;height:14px;vertical-align:middle;border:1px solid #000;background:'+arr[v]+'"></span>':(names?names[v]:v);
  return '<div class="row" style="margin:3px 0"><span style="width:110px">'+lbl+'</span><span style="display:flex;align-items:center;gap:6px"><button class="b" data-act="lk" data-v="'+k+':-1" style="padding:2px 10px">◀</button><span style="min-width:120px;text-align:center">'+val+'</span><button class="b" data-act="lk" data-v="'+k+':1" style="padding:2px 10px">▶</button></span></div>'};
 showModal('<h3>👕 Guarda-roupa</h3>'+(S.mate?'<div class="btns"><button class="b '+(who==='me'?'gold':'')+'" data-act="lkwho" data-v="me">Você</button><button class="b '+(who==='mate'?'gold':'')+'" data-act="lkwho" data-v="mate">'+S.mate.name+'</button></div>':'')
  +'<div class="card" style="text-align:center"><canvas data-lookpv="'+who+'" width="264" height="132" style="width:264px;height:132px;image-rendering:pixelated;background:linear-gradient(#8ac8f0,#7ab04a 70%);border-radius:6px"></canvas></div>'
  +'<div class="card">'+row('g','Corpo',{m:'Masculino',f:'Feminino'})+row('skin','Pele')+row('hair','Cabelo',LKN.hair)+row('hc','Cor do cabelo')+row('beard','Barba',LKN.beard)+row('hat','Chapéu',LKN.hat)+row('hatc','Cor do chapéu')+row('shirt','Camisa',LKN.shirt)+row('sc','Cor da camisa')+row('pants','Calça',LKN.pants)+row('boots','Botas')+'</div>'
  +'<div class="dim">'+(who==='me'&&S.h.outfit!=='casual'?'Você está com roupa de caça ('+OUTFITS[S.h.outfit].n+'). O visual aparece com a roupa comum.':'O visual é gratuito e pode ser trocado quando quiser.')+'</div>'
  +(who==='me'&&S.h.outfit!=='casual'?'<div class="btns"><button class="b" data-act="hwear" data-v="casual">Vestir roupa comum</button></div>':'')
  +'<div class="btns"><button class="b gold" data-act="close">Pronto</button></div>')}
LK.g=['m','f'];
Object.assign(ACT,{
 lk(e){const[k,d]=e.v.split(':'),L=LOOKWHO==='me'?S.look:S.mateLook,arr=LK[k];let i=typeof L[k]==='number'?L[k]:arr.indexOf(L[k]);i=(i+(+d)+arr.length)%arr.length;L[k]=typeof L[k]==='number'?i:arr[i];if(k==='g'&&LOOKWHO==='mate'&&S.mate)S.mate.g=L.g},
 lkwho(e){LOOKWHO=e.v},
 lookopen(){LOOKWHO='me';lookModal()}
});
setInterval(()=>{document.querySelectorAll('canvas[data-lookpv]').forEach(cv=>{if(!S||!S.look)return;const L=cv.dataset.lookpv==='mate'?S.mateLook:S.look;if(!L)return;const g=cv.getContext('2d'),ps=PS;PS=4;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.setTransform(4,0,0,4,0,0);
 [[0,12],[2,33],[3,54]].forEach(([d,x])=>drawFarmer(g,{x,y:30,dir:d,ph:frame*.12,mv:d>=2,bob:0},L));PS=ps})},120);
const _pInvL=pInv;pInv=function(){return '<div class="btns"><button class="b gold" data-act="lookopen">👕 Mudar visual</button></div>'+_pInvL()};
