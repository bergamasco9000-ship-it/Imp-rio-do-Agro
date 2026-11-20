// ===== Bar do Tonhão maior + casa do Tonhão atrás do balcão + cabaré escondido no fundo falso do guarda-roupa =====
ROOMS.bar=Object.assign(ROOMS.bar,{w:20,h:11,items:[
 {k:'clerk',x:3,y:2},{k:'balcao',x:1,y:3,w:7,h:1,act:'balcao'},{k:'banq',x:2,y:4},{k:'banq',x:4,y:4},{k:'banq',x:6,y:4},
 {k:'portatonho',x:9,y:2,w:1,h:1,act:'casa'},{k:'freezerb',x:11,y:2,w:2,h:1,act:'freezer'},{k:'jukebox',x:17,y:2,w:1,h:1,act:'juke'},
 {k:'sinuca',x:13,y:5,w:3,h:2,act:'sinuca'},{k:'cueman',x:12,y:6},
 {k:'palquinho',x:1,y:7,w:3,h:2,act:'seresta'},
 {k:'mesab',x:6,y:6,w:1,h:1,act:'papo'},{k:'patron',x:5,y:6,s:'#3a6ab0',h:'#2a1a10',d:3},{k:'patron',x:7,y:6,s:'#c83a2a',h:'#d8c080',d:2,hat:'#6a4a2a'},
 {k:'truco',x:9,y:8,w:2,h:1,act:'truco'},
 {k:'mesab',x:17,y:8,w:1,h:1,act:'papo'},{k:'patron',x:16,y:8,s:'#5a8a3a',h:'#3a2a1a',d:3,hat:'#e8dcb0'},
 {k:'mesab',x:14,y:9,w:1,h:1,act:'papo'},{k:'patron',x:15,y:9,s:'#d86a8a',h:'#5a3a22',d:2,g:'f'}],
 wallx:[{k:'garrafas',x:1},{k:'placabar',x:4},{k:'flamula',x:11},{k:'tvfut',x:14},{k:'rodeio',x:18}]});
ROOMS.tonho={id:'tonho',x:24,y:RZ+30,w:12,h:9,floor:'wood',wall:'#c8d8b8',trim:'#6a4a2a',win:[2,9],items:[
 {k:'bed',x:1,y:2,w:2,h:2},{k:'wardrobe',x:4,y:2,w:2,h:1,act:'armario'},{k:'table',x:8,y:5,w:2,h:1},{k:'chair',x:7,y:5},{k:'chair',x:10,y:5},
 {k:'stove',x:10,y:2,w:1,h:1},{k:'sink',x:9,y:2,w:1,h:1},{k:'sofa',x:2,y:6,w:3,h:1},{k:'rug',x:2,y:4,w:0,h:0,rw:4,rh:2},{k:'plant',x:1,y:6},{k:'tvvelha',x:7,y:2,w:1,h:1,act:'tvv'}],
 wallx:[{k:'frame',x:3},{k:'clock',x:6},{k:'frame',x:9}]};
ROOMS.cabare={id:'cabare',x:38,y:RZ+30,w:18,h:11,floor:'check',wall:'#3a1230',trim:'#c8a040',win:[],items:[
 {k:'luzes',x:1,y:0,w:0,h:0},
 {k:'palco',x:6,y:2,w:6,h:2,act:'show'},
 {k:'clerk',x:2,y:4},{k:'balcao2',x:1,y:5,w:3,h:1,act:'drinkc'},
 {k:'velvet',x:14,y:2,w:3,h:1},{k:'patronc',x:15,y:2,s:'#1a1a1a',h:'#c8c8c8',d:0,hat:'#1a1a1a'},
 {k:'mesac',x:14,y:6,w:1,h:1,act:'papoc'},{k:'patronc',x:13,y:6,s:'#7a1a2a',h:'#2a1a10',d:3},{k:'patronc',x:15,y:6,s:'#2a4a7a',h:'#5a3a22',d:2,hat:'#e8dcb0'},
 {k:'mesac',x:5,y:7,w:1,h:1,act:'papoc'},{k:'patronc',x:4,y:7,s:'#3a6a3a',h:'#1a1a1a',d:3,hat:'#6a4a2a'},
 {k:'cartas',x:9,y:7,w:2,h:1,act:'cartas'},
 {k:'mesac',x:16,y:8,w:1,h:1,act:'dancar'}],
 wallx:[{k:'neon',x:1},{k:'cortina',x:5},{k:'cortina',x:12},{k:'globo',x:8}]};
CLERK.cabare={n:'Dona Rosa',shirt:'#a8204a',hair:'#1a1a1a',g:'f',pants:'#1a1a1a'};
const cabOn=()=>{const h=dayHour();return h>=20||h<4};
// ---------- entrar e sair (cada porta volta para onde você entrou)
const SUBSTK=[];
function goSub(id,back){const r=ROOMS[id];fade(()=>{SUBSTK.push(RET);RET=back;P.vx=P.vy=0;P.x=(r.x+Math.floor(r.w/2))*TS+8;P.y=(r.y+r.h-2)*TS+12;P.dir=1;camInit=0})}
const _exB2=exitRoom;exitRoom=function(){const cr=inRoom()&&roomAt(P.x,P.y);if(cr&&(cr.id==='tonho'||cr.id==='cabare')&&RET){const R=RET,back=SUBSTK.pop()||null;fade(()=>{P.x=R.x;P.y=R.y;P.dir=0;P.vx=P.vy=0;camInit=0;RET=back});return}if(cr&&cr.id==='bar')SUBSTK.length=0;return _exB2()};
// ---------- desenho dos móveis novos
const _dfB2=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W=(it.w||1)*TS,H=(it.h||1)*TS,on=cabOn(),F=frame;
 switch(it.k){
 case 'portatonho':R('#4a2810',-1,-30,W+2,32);R('#7a4a22',1,-28,W-2,30);R('#5a3016',3,-24,W-6,9);R('#5a3016',3,-12,W-6,9);R('#e8c040',W-5,-12,2,2);R('#f4f0e4',1,-37,W-2,7);ptext(g,'PRIV',x+2,y-36,'#7a1a1a');break;
 case 'palquinho':{R('rgba(0,0,0,.25)',1,H-2,W,4);R('#7a4a22',0,4,W,H-6);R('#9a6232',0,4,W,2);for(let i=6;i<W;i+=12)R('#5a3016',i,6,1,H-10);const n=dayHour()>=19||dayHour()<1,px=x+W/2,py=y+12;
  if(n){OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:0,ph:0,mv:0,shirt:'#f0ece0',hair:'#3a2a1a',hat:'#e8dcb0',pants:'#2a2a3a'});const k=(F>>3)%2;Rr(c,'#a8602a',px-6,py-9,9,5);Rr(c,'#7a4018',px-4,py-8,3,3);Rr(c,'#d8c090',px+2,py-8-k,6,1)});if((F>>4)%3===0)ptext(g,'♪',x+W-10,y-12-((F>>2)%6),'#f0d060')}
  else{R('#a8602a',W/2-5,-4,9,5);R('#7a4018',W/2-3,-3,3,3)}break}
 case 'truco':{R('rgba(0,0,0,.25)',1,H-1,W,3);R('#2a6a3a',0,2,W,H-6);R('#5a3016',0,H-4,W,2);R('#5a3016',3,H-2,2,4);R('#5a3016',W-5,H-2,2,4);for(let i=0;i<4;i++){R('#f4f0e4',6+i*5,4,3,4);R(i%2?'#c8302a':'#1a1a1a',7+i*5,5,1,1)}R('#f0c040',W/2-2,8,4,2);
  for(const [dx,d] of[[-6,3],[W+6,2]]){const px=x+dx,py=y+12;OL(g,px,py+3,30,42,c=>drawPerson(c,{x:px,y:py,dir:d,ph:0,mv:0,shirt:dx<0?'#8a5a2a':'#3a5a8a',hair:'#2a1a10',hat:dx<0?'#5a3a22':null,pants:'#2a2a3a'}))}break}
 case 'tvvelha':R('rgba(0,0,0,.2)',0,H-2,W,3);R('#5a3016',0,0,W,H-2);R('#3a3a3a',1,-10,W-2,11);R('#6a8a9a',3,-8,W-6,7);if((F>>3)%2)R('#9ab8c8',4,-7,3,2);R('#1a1a1a',W/2,-14,1,4);R('#1a1a1a',W/2-4,-14,8,1);break;
 case 'luzes':{const rm=ROOMS.cabare;Rr(g,on?'rgba(40,0,30,.38)':'rgba(10,0,10,.5)',(rm.x+1)*TS,(rm.y+2)*TS,(rm.w-2)*TS,(rm.h-3)*TS);if(!on)break;const cols=['rgba(255,60,160,.16)','rgba(80,160,255,.16)','rgba(255,220,60,.16)','rgba(120,255,160,.14)'];for(let i=0;i<14;i++){const a=F/50+i*1.7,lx=(rm.x+1+((Math.sin(a)*.5+.5)*(rm.w-2)))*TS,ly=(rm.y+3+((Math.cos(a*1.3+i)*.5+.5)*(rm.h-5)))*TS;Rr(g,cols[i%4],lx-10,ly-4,20,8);Rr(g,cols[(i+1)%4],lx-6,ly-6,12,12)}break}
 case 'palco':{R('rgba(0,0,0,.35)',0,H-2,W,5);R('#5a1a3a',0,6,W,H-6);R('#c8a040',0,6,W,2);R('#7a2a4a',0,8,W,H-10);for(let i=0;i<8;i++)R(on&&((F>>3)+i)%2?'#fff0a0':'#8a6a2a',4+i*12,H-4,3,2);
  if(on){for(let k=0;k<2;k++){const px=x+24+k*44,py=y+14,sw=Math.sin(F/8+k*2)*2.2,c=k?'#c8302a':'#e8c020';OL(g,px+sw,py+3,30,42,cv=>{drawPerson(cv,{x:px+sw,y:py,dir:0,ph:F/7+k,mv:1,shirt:c,hair:k?'#1a1a1a':'#8a4a1a',g:'f',pants:c});for(let f=0;f<5;f++)Rr(cv,shade(c,25),px+sw-4+f*2,py-4+(f%2),1,4+((F>>2)+f)%2)})}
   const sx=x+W-14,sy=y+14;OL(g,sx,sy+3,30,42,cv=>{drawPerson(cv,{x:sx,y:sy,dir:0,ph:0,mv:0,shirt:'#f0ece0',hair:'#3a2a1a',hat:'#3a2a1a',pants:'#2a2a3a'});const k=Math.sin(F/5)*2;Rr(cv,'#7a1a1a',sx-7-k,sy-10,6,6);Rr(cv,'#e8e8e8',sx-1,sy-10,1,6);Rr(cv,'#7a1a1a',sx+k,sy-10,6,6)});
   if((F>>4)%2)ptext(g,'♫',x+W-30,y-((F>>2)%8),'#ff8ad8');
   for(const [a,c] of[[18,'rgba(255,240,160,.12)'],[W-18,'rgba(255,120,200,.12)']]){g.fillStyle=c;g.beginPath();g.moveTo(x+a,y-20);g.lineTo(x+a-14,y+H);g.lineTo(x+a+14,y+H);g.fill()}}
  else{R('#3a1a2a',10,0,W-20,8);ptext(g,'FECHADO',x+W/2-ptw('FECHADO')/2,y+10,'#c8a040')}break}
 case 'balcao2':R('rgba(0,0,0,.3)',2,H-1,W,4);R('#2a0a1a',0,0,W,H);R('#c8a040',0,0,W,2);R('#4a1a2a',0,4,W,H-6);for(let i=0;i<3;i++){R('#e8c8a0',6+i*12,-6,3,6);R('#ffffff',6+i*12,-7,3,2)}R('#8a2a1a',W-10,-10,4,10);R('#c8a040',W-10,-11,4,2);break;
 case 'mesac':R('rgba(0,0,0,.3)',0,H-1,W+2,3);R('#2a0a1a',-3,2,W+6,5);R('#c8a040',-3,2,W+6,1);R('#1a0610',W/2-1,7,2,H-7);R('#f0e0c0',1,-1,3,4);R('#c83a6a',8,-2,2,5);if(cabOn()&&(frame>>4)%2)R('#fff4c8',9,-4,1,2);break;
 case 'cartas':{R('rgba(0,0,0,.3)',1,H-1,W,3);R('#1a5a2a',0,2,W,H-6);R('#c8a040',0,2,W,1);R('#3a1a10',3,H-3,2,4);R('#3a1a10',W-5,H-3,2,4);for(let i=0;i<5;i++)R('#f4f0e4',5+i*5,4,3,4);for(let i=0;i<3;i++)R(['#c83030','#2a2a2a','#f0c040'][i],12+i*3,9-i,4,1.4);
  if(cabOn())for(const [dx,d,s] of[[-6,3,'#5a2a5a'],[W+6,2,'#1a1a1a']]){const px=x+dx,py=y+12;OL(g,px,py+3,30,42,c=>drawPerson(c,{x:px,y:py,dir:d,ph:0,mv:0,shirt:s,hair:'#2a1a10',hat:d===2?'#1a1a1a':null,pants:'#1a1a1a'}))}break}
 case 'patronc':if(!cabOn())break;// fecha de dia
 case 'patron':{const px=x+8,py=y+12;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:it.d||0,ph:0,mv:0,shirt:it.s,hair:it.h,hat:it.hat,g:it.g,pants:'#2a2a3a'});const up=((frame+it.x*40)%300)<40;Rr(c,it.k==='patronc'?'#e8c8a0':'#f0d060',px+(it.d===2?-6:4),py-(up?14:10),2.4,3.4);Rr(c,'#ffffff',px+(it.d===2?-6:4),py-(up?14:10),2.4,1)});break}
 default:return _dfB2(g,it,x,y,r)}};
const _dwB2=drawWallDeco;drawWallDeco=function(g,wd,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),on=cabOn();
 if(wd.k==='rodeio'){R('#f0e0b0',0,2,22,24);R('#7a2a1a',1,3,20,6);ptext(g,'RODEIO',x+1,y+4,'#f0e0b0');R('#5a3016',6,13,10,7);R('#5a3016',5,12,3,3);R('#5a3016',14,12,3,3);R('#3a2a1a',9,10,4,4);return}
 if(wd.k==='neon'){const c=on?((frame>>4)%2?'#ff4ab0':'#ff7ad0'):'#5a2a4a';R('#1a0610',0,3,62,14);R(c,0,3,62,1);R(c,0,16,62,1);ptext(g,'CABARE DA ROSA',x+3,y+7,c);if(on){g.fillStyle='rgba(255,80,180,.12)';g.fillRect(x-4,y,70,22)}return}
 if(wd.k==='cortina'){for(let i=0;i<4;i++){R(i%2?'#7a1030':'#9a1a40',i*4,0,4,30)}R('#c8a040',0,0,16,2);R('#c8a040',2,16,12,2);return}
 if(wd.k==='globo'){const F=frame;R('#c8c8d0',14,0,1,8);for(let i=0;i<4;i++)for(let j=0;j<4;j++)R(((i+j+(F>>3))%3)?'#e8e8f0':'#9a9ab0',9+i*3,8+j*3,3,3);if(on)for(let k=0;k<6;k++){const a=F/40+k;R('rgba(255,255,255,.7)',15+Math.cos(a)*30,14+Math.sin(a*1.3)*8,1.5,1.5)}return}
 return _dwB2(g,wd,x,y)};
// ---------- interações
const CABLN=['“Aqui ninguém viu ninguém, compadre. O que acontece no cabaré fica no cabaré.”','“Dizem que tem um tesouro do cangaço enterrado perto das ruínas, depois da mata.”','“O xerife Ramos? Esse aí aparece aqui toda sexta, disfarçado de bigode.”','“O gringo do norte traz touro que vale uma fortuna... mas cobra caro, viu?”','“Se você quer ganhar o leilão, chega cedo. O Coronel nunca aguenta passar de 120%.”','“Ouvi dizer que a cachoeira esconde uma gruta. Ninguém volta de lá com fome.”'];
const _raB2=roomAct;roomAct=function(it,r){
 if(r.id==='bar'){if(it.act==='casa'){if(!S.tf.tonhoOk){S.tf.tonhoOk=1;toast('🍺 Tonhão: “Aí é a minha casa, compadre... Pode entrar, mas não mexe no guarda-roupa, hein?” 😉')}return goSub('tonho',{x:(r.x+it.x)*TS+8,y:(r.y+it.y+1)*TS+12})}
  if(it.act==='seresta')return toast(dayHour()>=19||dayHour()<1?'🎸 O violeiro toca uma moda de viola antiga. O bar inteiro fica quieto para ouvir.':'🎸 O violeiro só chega à noite. O palquinho está vazio.');
  if(it.act==='truco')return trucoModal('truco')}
 if(r.id==='tonho'){if(it.act==='armario'){if(!S.tf.cabare){S.tf.cabare=1;gainXP(60,'segredo');if(typeof addTrof==='function')try{addTrof('cabare','Achou o cabaré escondido')}catch(e){}
   return showModal('<h3>🚪 O guarda-roupa do Tonhão</h3><div class="card">Você abre o guarda-roupa. Atrás dos casacos, o fundo de madeira está solto... Você empurra e ele abre como uma porta! Do outro lado vem uma música de sanfona e um cheiro de perfume.<br><br><b>Você achou o Cabaré da Rosa, o segredo mais bem guardado da vila.</b></div><div class="btns"><button class="b gold" data-act="cabin">Entrar</button><button class="b gray" data-act="close">Fechar o armário</button></div>')}
   return goSub('cabare',{x:(r.x+it.x+1)*TS,y:(r.y+it.y+1)*TS+12})}
  if(it.act==='tvv')return toast('📺 A TV de tubo do Tonhão só pega um canal, e está passando novela.')}
 if(r.id==='cabare'){const C=CLERK.cabare;
  if(!cabOn()&&it.act!=='papoc')return toast('🌙 O cabaré só abre às 20h. De dia as cadeiras ficam em cima das mesas.');
  if(it.act==='show'){if(S.money<30)return toast('Dinheiro insuficiente','bad');cash(-30,'Couvert do show');P.hp=Math.min(100,P.hp+8);gainXP(6,'show');return toast('💃 As dançarinas fazem um número de forró com o sanfoneiro. O salão inteiro aplaude! (+8 de vida)','good')}
  if(it.act==='drinkc')return showModal('<h3>🥃 Balcão da Dona Rosa</h3><div class="card"><i>“Boa noite, meu bem. O que vai ser?”</i></div>'+[['w','🥃 Dose de uísque 12 anos',45,15],['c','🍹 Caipirinha de limão',18,8],['a','💧 Água com gás',4,2]].map(o=>'<div class="card"><div class="row"><b>'+o[1]+'</b><span class="gold">'+R$(o[2])+'</span></div><div class="dim">+'+o[3]+' de vida</div><div class="btns"><button class="b gold" data-act="cabdr" data-v="'+o[0]+'">Pedir</button></div></div>').join('')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
  if(it.act==='cartas')return trucoModal('cartas');
  if(it.act==='dancar'){gainXP(5,'forró');return toast('🪗 Você tira uma moça para dançar forró. Dois pra lá, dois pra cá... e não pisou no pé dela!','good')}
  if(it.act==='papoc')return toast('🗣️ '+pick(CABLN))}
 return _raB2(it,r)};
ACT.cabin=function(){hideModal();const r=ROOMS.tonho,it=r.items.find(i=>i.act==='armario');goSub('cabare',{x:(r.x+it.x+1)*TS,y:(r.y+it.y+1)*TS+12})};
ACT.cabdr=function(e){const o={w:[45,15],c:[18,8],a:[4,2]}[e.v];if(!o)return;if(S.money<o[0])return toast('Dinheiro insuficiente','bad');cash(-o[0],'Cabaré da Rosa');P.hp=Math.min(100,P.hp+o[1]);toast('😌 +'+o[1]+' de vida','good')};
function trucoModal(k){const t=k==='truco';showModal('<h3>'+(t?'🃏 Truco valendo':'🎴 Mesa de cartas do cabaré')+'</h3><div class="card"><i>'+(t?'“Truco, ladrão! Quem perder paga a rodada.”':'“Aqui a aposta é alta, forasteiro. Senta se tiver coragem.”')+'</i></div><div class="btns">'+(t?[20,50,100]:[200,1000,5000]).map(v=>'<button class="b gold" data-act="trucoj" data-v="'+v+'">Apostar '+R$(v)+'</button>').join('')+'<button class="b gray" data-act="close">Agora não</button></div>')}
ACT.trucoj=function(e){const v=+e.v;if(S.money<v)return toast('Dinheiro insuficiente','bad');const win=Math.random()<.47;cash(win?v:-v,v>=200?'Cartas no cabaré':'Truco no bar');hideModal();toast(win?'🃏 “SEIS!” Você ganhou a mão e levou '+R$(v)+'.':'🃏 O adversário pediu truco e você correu... perdeu '+R$(v)+'.',win?'good':'bad');gainXP(4,'cartas')};
const B2LB={casa:()=>'🚪 Porta dos fundos (casa do Tonhão)',seresta:()=>'🎸 Ouvir o violeiro',truco:()=>'🃏 Jogar truco valendo',armario:()=>S.tf.cabare?'🚪 Fundo falso do guarda-roupa':'👗 Mexer no guarda-roupa',tvv:()=>'📺 TV velha',show:()=>'💃 Assistir ao show (R$ 30)',drinkc:()=>'🥃 Balcão da Dona Rosa',cartas:()=>'🎴 Mesa de cartas (aposta alta)',dancar:()=>'🪗 Dançar forró',papoc:()=>'💬 Puxar conversa'};
const _ilB2=interactList;interactList=function(){const L=_ilB2();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r||!(r.id==='bar'||r.id==='tonho'||r.id==='cabare'))return L;
 for(const l of L){const it=r.items.find(i=>i.act&&B2LB[i.act]&&Math.abs((r.x+i.x+(i.w||1)/2)*TS-l.x)<1&&Math.abs((r.y+i.y+(i.h||1))*TS+4-l.y)<1);if(it)l.label=B2LB[it.act]();if(l.label==='🚪 Sair'&&r.id!=='bar')l.label=r.id==='cabare'?'🚪 Voltar pelo guarda-roupa':'🚪 Voltar para o bar'}return L};
// música no cabaré
const _updB2=update;update=function(dt){_updB2(dt);if(!inRoom())return;const r=roomAt(P.x,P.y);if(r&&r.id==='cabare'&&cabOn()&&!S.tf.cabTip){S.tf.cabTip=1;setTimeout(()=>toast('🪗 Dona Rosa: “Seja bem-vindo ao Cabaré da Rosa, meu bem. Aqui tem o melhor forró da região.”','good'),600)}};
