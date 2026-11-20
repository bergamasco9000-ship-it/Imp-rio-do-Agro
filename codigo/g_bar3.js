// ===== Bar e cabaré maiores, clima adulto (sem conteúdo sexual): show burlesco, camarote VIP com charuto e uísque, roleta clandestina, ressaca =====
// novas posições na zona de interiores (linha 198)
Object.assign(ROOMS.bar,{w:26,h:12,items:[
 {k:'clerk',x:3,y:2},{k:'balcao',x:1,y:3,w:8,h:1,act:'balcao'},{k:'banq',x:2,y:4},{k:'banq',x:4,y:4},{k:'banq',x:6,y:4},{k:'banq',x:8,y:4},
 {k:'portatonho',x:10,y:2,w:1,h:1,act:'casa'},{k:'freezerb',x:12,y:2,w:2,h:1,act:'freezer'},{k:'jukebox',x:23,y:2,w:1,h:1,act:'juke'},
 {k:'sinuca',x:15,y:4,w:3,h:2,act:'sinuca'},{k:'cueman',x:14,y:5},{k:'sinuca',x:20,y:4,w:3,h:2,act:'sinuca'},
 {k:'dardo',x:25,y:6,w:0,h:0},{k:'dardoman',x:22,y:8,act:'dardo'},
 {k:'palquinho',x:1,y:8,w:3,h:2,act:'seresta'},
 {k:'mesab',x:6,y:7,w:1,h:1,act:'papo'},{k:'patron',x:5,y:7,s:'#3a6ab0',h:'#2a1a10',d:3},{k:'patron',x:7,y:7,s:'#c83a2a',h:'#d8c080',d:2,hat:'#6a4a2a'},
 {k:'truco',x:10,y:8,w:2,h:1,act:'truco'},
 {k:'domino',x:15,y:9,w:2,h:1,act:'domino'},
 {k:'mesab',x:19,y:9,w:1,h:1,act:'papo'},{k:'patron',x:18,y:9,s:'#5a8a3a',h:'#3a2a1a',d:3,hat:'#e8dcb0'},{k:'patron',x:20,y:9,s:'#d86a8a',h:'#5a3a22',d:2,g:'f'},
 {k:'mesab',x:7,y:10,w:1,h:1,act:'papo'},{k:'patron',x:6,y:10,s:'#e0a431',h:'#1a1a1a',d:3},
 {k:'ventilador',x:12,y:0,w:0,h:0}],
 wallx:[{k:'garrafas',x:1},{k:'placabar',x:5},{k:'flamula',x:13},{k:'tvfut',x:17},{k:'rodeio',x:21},{k:'banheiro',x:24}]});
Object.assign(ROOMS.tonho,{x:30});
ROOMS.cabare=Object.assign(ROOMS.cabare,{x:44,w:26,h:12,items:[
 {k:'luzes',x:1,y:0,w:0,h:0},
 {k:'palco',x:8,y:2,w:8,h:2,act:'show'},
 {k:'clerk',x:2,y:4},{k:'balcao2',x:1,y:5,w:4,h:1,act:'drinkc'},
 {k:'roleta',x:4,y:8,w:2,h:2,act:'roleta'},{k:'croupier',x:6,y:9},
 {k:'cartas',x:10,y:8,w:2,h:1,act:'cartas'},
 {k:'mesac',x:15,y:6,w:1,h:1,act:'papoc'},{k:'patronc',x:14,y:6,s:'#7a1a2a',h:'#2a1a10',d:3},{k:'patronc',x:16,y:6,s:'#2a4a7a',h:'#5a3a22',d:2,hat:'#e8dcb0'},
 {k:'mesac',x:15,y:9,w:1,h:1,act:'dancar'},{k:'patronc',x:16,y:9,s:'#c8a040',h:'#1a1a1a',d:2,g:'f'},
 {k:'portavip',x:21,y:2,w:1,h:1,act:'vip'},{k:'seguranca',x:19,y:3},{k:'seguranca',x:23,y:3},{k:'corda',x:20,y:4,w:1,h:1},{k:'corda',x:22,y:4,w:1,h:1},
 {k:'mesac',x:22,y:8,w:1,h:1,act:'papoc'},{k:'patronc',x:23,y:8,s:'#3a2a1a',h:'#8a8a8a',d:2,hat:'#5a3a22'},{k:'patronc',x:21,y:8,s:'#c83a6a',h:'#2a1a10',d:3,g:'f'}],
 wallx:[{k:'neon',x:1},{k:'cortina',x:7},{k:'cortina',x:15},{k:'globo',x:11},{k:'vipplaca',x:20}]});
const vipHoje=()=>S.cabVip===S.day||(S.cabVip===S.day-1&&dayHour()<4);
// ---------- desenho
const _dfB3=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W=(it.w||1)*TS,H=(it.h||1)*TS,F=frame,on=cabOn();
 switch(it.k){
 case 'dardo':R('#3a2414',-6,-58,14,14);R('#c8302a',-5,-57,12,12);R('#f0e0b0',-3,-55,8,8);R('#2a6a2a',-1,-53,4,4);R('#c8302a',0,-52,2,2);break;
 case 'dardoman':{const px=x+8,py=y+12,k=((F>>4)%6)===0;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:3,ph:0,mv:0,shirt:'#2a8a8a',hair:'#3a2a1a',hat:'#c8a060',pants:'#3a3a5a'});Rr(c,'#c8c8c8',px+5,py-(k?14:11),4,1)});break}
 case 'domino':{R('rgba(0,0,0,.25)',1,H-1,W,3);R('#e8e0d0',0,2,W,H-6);R('#c8c0b0',0,H-4,W,1);R('#8a8a80',3,H-3,2,4);R('#8a8a80',W-5,H-3,2,4);for(let i=0;i<6;i++){R('#f8f8f0',4+i*4,5+(i%2)*2,3,5);R('#1a1a1a',5+i*4,6+(i%2)*2,1,1);R('#1a1a1a',5+i*4,8+(i%2)*2,1,1)}
  for(const [dx,d] of[[-6,3],[W+6,2]]){const px=x+dx,py=y+12;OL(g,px,py+3,30,42,c=>drawPerson(c,{x:px,y:py,dir:d,ph:0,mv:0,shirt:dx<0?'#e8e0d0':'#8a6a4a',hair:'#d8d8d8',hat:dx<0?'#e8dcb0':null,pants:'#4a4a5a',beard:1}))}break}
 case 'ventilador':{const rm=ROOMS.bar,cx=(rm.x+rm.w/2)*TS,cy=(rm.y+2.2)*TS,a=F*.3;Rr(g,'#5a5a5a',cx-1,cy-6,2,6);for(let k=0;k<3;k++){const aa=a+k*2.09;Rr(g,'rgba(90,60,30,.85)',cx+Math.cos(aa)*6-3,cy+Math.sin(aa)*2-1,6,2)}Rr(g,'#3a3a3a',cx-2,cy-1,4,3);break}
 case 'roleta':{R('rgba(0,0,0,.35)',1,H-2,W,4);R('#2a0a10',0,2,W,H-4);R('#c8a040',0,2,W,1.4);const cx=x+W/2,cy=y+H/2,a=on?F*.15:0;for(let k=0;k<12;k++){const aa=a+k*.5236;g.fillStyle=k===0?'#2a8a3a':k%2?'#c8302a':'#1a1a1a';g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,11,aa,aa+.5236);g.fill()}g.fillStyle='#c8a040';g.beginPath();g.arc(cx,cy,3,0,7);g.fill();if(on){const ba=-F*.22;R('#ffffff',Math.cos(ba)*8+W/2-1,Math.sin(ba)*8+H/2-1,2,2)}break}
 case 'croupier':{if(!on)break;const px=x+8,py=y+12;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:2,ph:0,mv:0,shirt:'#f4f0e4',hair:'#1a1a1a',pants:'#1a1a1a'});Rr(c,'#1a1a1a',px-2,py-15,4,1.4)});break}
 case 'corda':{for(const dx of[0,W-3])R('#c8a040',dx,-10,3,14),R('#f0d060',dx,-11,3,2);R('#9a1a30',2,-6,W-4,2);R('#9a1a30',W/2-1,-5,2,2);break}
 case 'seguranca':{const px=x+8,py=y+12;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:0,ph:0,mv:0,shirt:'#1a1a1a',hair:'#1a1a1a',pants:'#1a1a1a'});Rr(c,'#1a1a1a',px-5,py-13,10,2)});break}
 case 'charutaria':R('rgba(0,0,0,.3)',0,H-1,W+2,3);R('#4a2810',0,-10,W,H+10);R('#7a4a22',1,-9,W-2,H+8);for(let i=0;i<4;i++){R('#8a5a2a',2,-6+i*7,W-4,1);for(let k=0;k<3;k++)R('#5a3016',3+k*4,-9+i*7,3,2)}R('#c8a040',1,-11,W-2,2);break;
 case 'fumaca':{if(!on)break;const rm=ROOMS.cabare;for(let k=0;k<8;k++){const sx=(rm.x+20+((k*37+F*.05)%5))*TS,sy=(rm.y+2+((k*13+F*.03)%6))*TS;Rr(g,'rgba(220,220,230,.06)',sx-12,sy-6,24,10)}break}
 case 'palco':if(it.w>=8){R('rgba(0,0,0,.35)',0,H-2,W,5);R('#5a1a3a',0,6,W,H-6);R('#c8a040',0,6,W,2);R('#7a2a4a',0,8,W,H-10);for(let i=0;i<12;i++)R(on&&((F>>3)+i)%2?'#fff0a0':'#8a6a2a',4+i*10,H-4,3,2);
  if(on){const C=['#e8c020','#c8302a','#2a2a2a'];for(let k=0;k<3;k++){const px=x+20+k*30,py=y+14,kick=((F>>3)+k*3)%12<3,sw=Math.sin(F/9+k*2)*1.6,c=C[k];OL(g,px+sw,py+3,30,46,cv=>{drawPerson(cv,{x:px+sw,y:py,dir:0,ph:F/7+k,mv:1,shirt:c,hair:['#8a4a1a','#1a1a1a','#c8a050'][k],g:'f',pants:'#1a1a1a'});
     Rr(cv,'#1a1a1a',px+sw-3,py-21,6,1.4);Rr(cv,'#1a1a1a',px+sw-2,py-24,4,3);for(let f=0;f<6;f++)Rr(cv,shade(c,30),px+sw-5+f*2,py-5+(f%2),1,3+((F>>2)+f)%2);
     const fa=Math.sin(F/10+k)*3;Rr(cv,'#f4e8f0',px+sw+5,py-14+fa,5,6);Rr(cv,'#e8c8e0',px+sw+6,py-16+fa,3,3);if(kick)Rr(cv,'#1a1a1a',px+sw+2,py-4,5,1.6)})}
   const band=[['#7a1a1a','sanfona'],['#3a5a8a','zabumba'],['#2a6a3a','triangulo']];band.forEach(([s,ins],k)=>{const bx=x+W-36+k*14,by=y+8;OL(g,bx,by+3,30,42,cv=>{drawPerson(cv,{x:bx,y:by,dir:0,ph:0,mv:0,shirt:'#f0ece0',hair:'#3a2a1a',hat:'#3a2a1a',pants:'#2a2a3a'});const b=Math.sin(F/5+k)*1.5;if(ins==='sanfona'){Rr(cv,s,bx-6-b,by-10,5,6);Rr(cv,'#e8e8e8',bx-1,by-10,1,6);Rr(cv,s,bx+b,by-10,5,6)}else if(ins==='zabumba'){Rr(cv,s,bx-5,by-9,10,6);Rr(cv,'#e8e0d0',bx-5,by-9,10,1.4);Rr(cv,'#c8a060',bx+3,by-12+b,1,4)}else{Rr(cv,'#c8c8d0',bx+2,by-12,1,6);Rr(cv,'#c8c8d0',bx+2,by-6,5,1);Rr(cv,'#c8c8d0',bx+6,by-12,1,6)}})});
   if((F>>4)%2)ptext(g,'♫',x+W-40,y-((F>>2)%8),'#ff8ad8');
   for(const [a,c] of[[24,'rgba(255,240,160,.12)'],[W/2,'rgba(160,200,255,.10)'],[W-40,'rgba(255,120,200,.12)']]){g.fillStyle=c;g.beginPath();g.moveTo(x+a,y-22);g.lineTo(x+a-16,y+H);g.lineTo(x+a+16,y+H);g.fill()}}
  else{R('#3a1a2a',10,0,W-20,8);ptext(g,'FECHADO',x+W/2-ptw('FECHADO')/2,y+10,'#c8a040')}break}
  return _dfB3(g,it,x,y,r);
 default:return _dfB3(g,it,x,y,r)}};
const _dwB3=drawWallDeco;drawWallDeco=function(g,wd,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 if(wd.k==='banheiro'){R('#5a3016',0,0,16,28);R('#7a4a22',1,1,14,27);R('#f4f0e4',3,4,10,6);ptext(g,'WC',x+4,y+6,'#2a4a8a');return}
 if(wd.k==='vipplaca'){const c=cabOn()?'#f0d060':'#6a5a2a';R('#1a0610',0,4,44,12);R(c,0,4,44,1);R(c,0,15,44,1);ptext(g,'CAMAROTE',x+6,y+8,c);return}
 return _dwB3(g,wd,x,y)};
// ---------- interações novas
const _raB3=roomAct;roomAct=function(it,r){
 if(r.id==='bar'){if(it.act==='dardo'){const pts=ri(5,60);return toast(pts>=50?'🎯 Na mosca! '+pts+' pontos. A turma vibrou!':'🎯 Você jogou 3 dardos: '+pts+' pontos.',pts>=50?'good':'')}
  if(it.act==='domino')return toast('🁡 Os velhinhos do dominó: “Senta aí que a gente te ensina, mas valendo café!”')}
 if(r.id==='cabare'){if(!cabOn()&&it.act!=='papoc')return toast('🌙 O cabaré só abre às 20h.');
  if(it.act==='roleta')return roletaModal();
  if(it.act==='vip'){if(vipHoje())return toast('🕴️ Segurança: “Pode passar, doutor.”','good');
   return showModal('<h3>🕴️ Camarote VIP</h3><div class="card"><i>“O camarote é só pra quem é grande, doutor. Charuto cubano, uísque 18 anos e mesa reservada.”</i></div><div class="card"><div class="row"><b>Entrada da noite</b><span class="gold">'+R$(1500)+'</span></div><div class="dim">'+((S.rep||0)>=50?'Você tem reputação de Barão: o dono libera de graça.':'Com reputação 50 a entrada é liberada.')+'</div></div><div class="btns"><button class="b gold" data-act="cabvip">'+((S.rep||0)>=50?'Entrar':'Pagar e entrar')+'</button><button class="b gray" data-act="close">Agora não</button></div>')}
  if(it.act==='charuto'||it.act==='uisque'){if(!vipHoje())return toast('🕴️ Segurança: “Só no camarote, doutor.”','bad');
   if(it.act==='charuto'){if(S.money<250)return toast('Dinheiro insuficiente','bad');cash(-250,'Charuto no camarote');S.rep=Math.min(100,(S.rep||0)+.5);return toast('🚬 Um charuto cubano no camarote, fechando negócio com os grandes da região. (+reputação)','good')}
   if(S.money<180)return toast('Dinheiro insuficiente','bad');cash(-180,'Uísque 18 anos');bebeu();P.hp=Math.min(100,P.hp+20);return toast('🥃 Uísque 18 anos, gelo de água de coco. (+20 de vida)','good')}}
 return _raB3(it,r)};
ACT.cabvip=function(){if((S.rep||0)<50){if(S.money<1500)return toast('Dinheiro insuficiente','bad');cash(-1500,'Camarote VIP')}S.cabVip=S.day;hideModal();toast('🥂 Bem-vindo ao camarote! Charuto e uísque à disposição.','good');gainXP(10,'vip')};
function roletaModal(){showModal('<h3>🎡 Roleta clandestina</h3><div class="card"><i>“Façam suas apostas!” — vermelho ou preto paga 2×, um número de 1 a 12 paga 10×.</i></div>'
 +'<div class="dim">Valor da ficha:</div><div class="btns">'+[100,500,2000].map(v=>'<button class="b '+(S.rlV===v?'gold':'')+'" data-act="rlv" data-v="'+v+'">'+R$(v)+'</button>').join('')+'</div>'
 +'<div class="btns"><button class="b" style="background:#c8302a;color:#fff" data-act="rlb" data-v="red">🔴 Vermelho</button><button class="b" style="background:#1a1a1a;color:#fff" data-act="rlb" data-v="black">⚫ Preto</button></div>'
 +'<div class="btns" style="flex-wrap:wrap">'+Array.from({length:12},(_,i)=>'<button class="b" data-act="rlb" data-v="'+(i+1)+'">'+(i+1)+'</button>').join('')+'</div><div class="btns"><button class="b gray" data-act="close">Sair da mesa</button></div>')}
ACT.rlv=function(e){S.rlV=+e.v;roletaModal()};
ACT.rlb=function(e){const v=S.rlV||100;if(S.money<v)return toast('Dinheiro insuficiente','bad');const n=ri(0,12),col=n===0?'green':n%2?'red':'black';
 let win=0;if(e.v==='red'||e.v==='black'){if(col===e.v)win=v}else if(+e.v===n)win=v*9;cash(win?win:-v,'Roleta clandestina');
 toast('🎡 Deu '+n+' '+(col==='red'?'🔴':col==='black'?'⚫':'🟢')+(win?' — você ganhou '+R$(win)+'!':' — perdeu '+R$(v)+'.'),win?'good':'bad');roletaModal()};
// ---------- bebida demais dá ressaca
function bebeu(){const d=S.day+(dayHour()<6?-1:0);if(!S.drk||S.drk.d!==d)S.drk={d,n:0};S.drk.n++;if(S.drk.n===4)toast('🥴 Você já está bem alegrinho... mais uma e amanhã é ressaca.','bad');if(S.drk.n>=5)S.hang=d+1}
const _cabdr3=ACT.cabdr;ACT.cabdr=function(e){const m=S.money;_cabdr3(e);if(S.money<m&&e.v!=='a')bebeu()};
const _vbar3=ACT.vbar;ACT.vbar=function(e){const m=S.money;_vbar3(e);if(S.money<m&&e.v==='g')bebeu()};
const _hdB3=hookDay;hookDay=function(){_hdB3();if(S.hang&&S.hang===S.day){S.hang=0;P.hp=Math.max(15,P.hp-25);setTimeout(()=>toast('🤕 Ressaca braba! A cabeça lateja e o corpo não ajuda (−25 de vida). Água e torresmo ajudam.','bad'),1500)}};
const B3LB={dardo:()=>'🎯 Jogar dardos',domino:()=>'🁡 Mesa do dominó',roleta:()=>'🎡 Roleta clandestina',vip:()=>vipHoje()?'🥂 Camarote VIP (liberado)':'🕴️ Camarote VIP',charuto:()=>'🚬 Charuto cubano (R$ 250)',uisque:()=>'🥃 Uísque 18 anos (R$ 180)'};
const _ilB3=interactList;interactList=function(){const L=_ilB3();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r||!(r.id==='bar'||r.id==='cabare'))return L;
 for(const l of L){const it=r.items.find(i=>i.act&&B3LB[i.act]&&Math.abs((r.x+i.x+(i.w||1)/2)*TS-l.x)<1&&Math.abs((r.y+i.y+(i.h||1))*TS+4-l.y)<1);if(it)l.label=B3LB[it.act]()}return L};
