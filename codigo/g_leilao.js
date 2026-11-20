// ===== 🔨 LEILÃO AO VIVO: pregão semanal na arquibancada do Leilão da Vila + ⭐ Leilão Estrelas do Agro no Salão de Gala
// (leiloeiro cantando o lance, rivais e convidados levantando a plaquinha em tempo real, o animal desfilando na pista, telão)
// ---------- convidados da gala (personagens inventados que representam os "tipos" do agro)
const GALA=[
 {id:'braulio',n:'Dr. Bráulio Mattos',tag:'o Rei da Soja, de Sorriso (MT)',num:7,bud:1.25,agr:.55,pref:['nelorepo','angus','brangus'],p:{shirt:'#f4f4f0',hair:'#c8c8c8',pants:'#1e2a48',look:{hair:'calvo',jacket:'#1e2a48',jk:'terno',slv:'#1e2a48',cuff:'#ffffff',psq:'#c8a040',tie:'#2a4a8a',glasses:1,beard:'nenhuma',belly:1,crease:1}},
  fala:['Soja paga o boi, e o boi paga a festa. Hahaha!','Comprei mais 5 mil hectares no Mato Grosso esse ano.','Genética boa é igual soja boa: tem que ter semente certa.']},
 {id:'leo',n:'Léo Ventania',tag:'cantor sertanejo e criador',num:22,bud:.9,agr:.75,pref:['nelorepo','brahman','senepol'],p:{shirt:'#1a1a1a',hair:'#3a2a1a',pants:'#1a1a1a',hat:'#f4f0e4',look:{hat:'vaqueiro',hatc:'#f4f0e4',band:'#c8a040',concho:'#f0d060',jacket:'#2a2a3a',jk:'couro',slv:'#2a2a3a',glasses:1,glassesK:'avi',beltK:'gg',beard:'cavanhaque',bootP:'jacare',tallBoot:1}},
  fala:['Ô trem bão! Esse touro aí dá até modão.','Vou botar esse boi no clipe novo, uai.','Já cantei pra 80 mil pessoas, mas lance alto me deixa nervoso.']},
 {id:'vitoria',n:'Dona Vitória Albuquerque',tag:'herdeira do Nelore, de Goiás',num:3,bud:1.4,agr:.6,pref:['nelorepo','gir','nelore'],p:{g:'f',shirt:'#f4f0e4',hair:'#e8d070',pants:'#8a1a22',look:{g:'f',hair:'coque',hc:'#e8d070',jacket:'#b8242a',jk:'terno',slv:'#b8242a',cuff:'#f4f0e4',skirt:'#8a1a22',beard:null,pearls:1}},
  fala:['Meu avô começou com 12 vacas. Hoje são 40 mil cabeças.','Nelore de pista é coisa séria, meu bem.','Gosto de gente que trabalha de verdade no campo.']},
 {id:'joaquim',n:'Coronel Joaquim Cabral',tag:'o Barão do Pantanal (MS)',num:15,bud:1,agr:.45,pref:['nelore','nelorepo','brahman'],p:{shirt:'#f4f0e4',hair:'#e8e8e8',pants:'#d8ccb0',hat:'#e8dcb0',look:{hat:'pantaneiro',hatc:'#e8dcb0',band:'#1a1a1a',jacket:'#d8ccb0',jk:'terno',slv:'#d8ccb0',cuff:'#ffffff',beard:'bigode',hc:'#f0f0f0',old:1,psq:'#2a6a3a'}},
  fala:['No meu tempo, a boiada atravessava o Pantanal a cavalo.','Cheia boa é cheia que a gente sabe a hora de sair.','Lance alto é que nem onça: tem que ter coragem.']},
 {id:'ph',n:'PH Agro',tag:'influenciador do agro (2 milhões de seguidores)',num:41,bud:.55,agr:.85,pref:['angus','wagyu','senepol'],p:{shirt:'#ffffff',hair:'#1a1a1a',pants:'#5a5e66',look:{hair:'topete',jacket:'#5a5e66',jk:'terno',slv:'#5a5e66',cuff:'#ffffff',beard:'nenhuma',glasses:1,glassesK:'sq'}},phone:1,
  fala:['Fala, galera! Tô aqui no maior leilão do Brasil! 📱','Se esse vídeo bater 1 milhão eu compro o touro.','O agro é tech, o agro é pop, o agro é tudo, mano.']},
 {id:'ricardo',n:'Ricardo Nogueira',tag:'banqueiro da Faria Lima',num:9,bud:1.15,agr:.5,pref:['wagyu','angus','nelorepo'],p:{shirt:'#ffffff',hair:'#4a3a2a',pants:'#2a2c30',look:{jacket:'#2a2c30',jk:'terno',slv:'#2a2c30',cuff:'#ffffff',tie:'#6a1a2a',psq:'#ffffff',beard:'nenhuma',crease:1}},
  fala:['Boi é o melhor ativo de 2026. Rende mais que a Selic.','Comprei cotas de touro como diversificação de portfólio.','Meu gerente de banco não entende de gado. Eu também não, mas confio no Excel.']},
 {id:'kenji',n:'Kenji Takeda',tag:'criador de Wagyu (SP)',num:18,bud:.95,agr:.5,pref:['wagyu','angus'],p:{shirt:'#ffffff',hair:'#1a1a1a',pants:'#141418',look:{jacket:'#141418',jk:'terno',slv:'#141418',cuff:'#ffffff',tie:'#1a1a1a',glasses:1,beard:'nenhuma',skin:'#e8c8a0'}},
  fala:['Marmoreio é arte. O Wagyu certo vale cada centavo.','Meu pai trouxe a primeira genética do Japão nos anos 90.','Paciência é o segredo da carne perfeita.']},
 {id:'helena',n:'Dona Helena Prado',tag:'dona da Agropecuária Prado (SP)',num:5,bud:1.05,agr:.55,pref:['girolando','gir','nelorepo'],p:{g:'f',shirt:'#f4f0e4',hair:'#2a1a10',pants:'#1a4a3a',look:{g:'f',hair:'comprido',hc:'#2a1a10',jacket:'#1a5a3a',jk:'terno',slv:'#1a5a3a',cuff:'#f4f0e4',skirt:'#1a4a3a',beard:null,glasses:1,glassesK:'sq',pearls:1}},
  fala:['Leite é o meu forte. Uma Gir campeã faz uma fazenda.','Já fui jurada em três exposições nacionais.','Aqui ninguém compra no impulso... exceto o PH.']},
 {id:'bento',n:'Seu Bento Kuhn',tag:'pecuarista gaúcho (RS)',num:30,bud:.85,agr:.6,pref:['angus','hereford','brangus'],p:{shirt:'#f4f0e4',hair:'#8a6a4a',pants:'#3a2a1a',hat:'#1a1a1a',look:{hat:'gaucho',hatc:'#1a1a1a',jacket:'#3a2a1a',jk:'terno',slv:'#3a2a1a',cuff:'#f4f0e4',scarfN:'#c8302a',beard:'bigode'}},
  fala:['Bah, tchê! Angus de pampa não tem igual.','Chimarrão de manhã e lance de noite.','Lá no Sul o frio deixa a carne mais macia, barbaridade!']},
 {id:'com',n:'Comendador Aurélio Valadares',tag:'o dono da noite',num:1,bud:1.6,agr:.4,pref:['nelorepo','wagyu','angus','brahman'],p:{shirt:'#f4f0e4',hair:'#c8c8c8',pants:'#f4f0e4',hat:'#f0e8d0',look:{hat:'vaqueiro',hatc:'#f0e8d0',jacket:'#f4f0e4',jk:'terno',slv:'#f4f0e4',cuff:'#ffffff',psq:'#c8302a',tie:'#c8302a',beard:'bigode',hc:'#d0d0d0'}},cigar:1,
  fala:['Ora, ora... você por aqui. Gosto de ver.','Não disputa comigo o lote 5. É um conselho.','Aqui todo mundo é amigo... até o martelo bater.']}];
const GALAF=['#1a1a2a','#2a1a1a','#1a2a2a','#2a2a2a','#3a2a1a','#141418'];// ternos dos demais convidados
const LBRD=k=>BREEDS[k]?k:'nelore';
// ---------- prédio: Salão de Gala, ao lado da Arena
if(!BLD.some(b=>b.id==='elite'))BLD.push({id:'elite',x:167,y:77,w:13,h:7,door:173,roof:'#2a1a12',wall:'#f4efe4',label:'Salão de Gala · Leilões Estrelas do Agro',sign:'GALA'});
const _rfcElite=rfCarve;rfCarve=function(){_rfcElite();const b=BLD.find(q=>q.id==='elite');if(!b)return;
 for(let y=b.y-1;y<=b.y+b.h+2;y++)for(let x=b.x-2;x<=b.x+b.w+1;x++){const i=ti(x,y);if(x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h){SOL[i]=1;continue}SOL[i]=0}
 for(let y=b.y+b.h;y<=b.y+b.h+3;y++)for(let x=b.door-1;x<=b.door+1;x++)G[ti(x,y)]=3;
 const inR=t=>t.x>=(b.x-2)*TS&&t.x<=(b.x+b.w+2)*TS&&t.y>=(b.y-1)*TS&&t.y<=(b.y+b.h+3)*TS;for(const A of[TREES,BUSH])for(let i=A.length-1;i>=0;i--)if(inR(A[i]))A.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(inR(DECO[i]))DECO.splice(i,1);if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--){const q=BOULD[i];if(q.x>=b.x-2&&q.x<=b.x+b.w+1&&q.y>=b.y-1&&q.y<=b.y+b.h+3)BOULD.splice(i,1)}};
if(typeof BART!=='undefined')BART.elite=function(g,b,x,y,w,h,dx){const R=(c,a,bb,ww,hh)=>Rr(g,c,x+a,y+bb,ww,hh);
 R('rgba(0,0,0,.3)',4,h-2,w,6);R('#e8e0d0',0,14,w,h-14);R('#d8ccb8',0,h-10,w,10);// paredes de mármore
 for(let i=0;i<9;i++){const cx=10+i*((w-20)/8);R('#fbf8f0',cx-3,20,7,h-30);R('#d8d0c0',cx+2,20,2,h-30);R('#c8a040',cx-4,18,9,3);R('#c8a040',cx-4,h-11,9,3)}// colunas
 g.fillStyle='#2a1a12';g.beginPath();g.moveTo(-4,16);g.lineTo(w/2,-6);g.lineTo(w+4,16);g.closePath();g.fill();g.fillStyle='#c8a040';g.fillRect(-4,14,w+8,3);// frontão
 g.fillStyle='#fbf8f0';g.beginPath();g.moveTo(10,14);g.lineTo(w/2,0);g.lineTo(w-10,14);g.closePath();g.fill();R('#c8a040',w/2-10,4,20,8);ptext(g,'GALA',x+w/2-8,y+6,'#2a1a12');
 R('#1a1a1a',8,24,w-16,12);R('#c8a040',8,24,w-16,1.5);R('#c8a040',8,35,w-16,1.5);ptext(g,'LEILOES ESTRELAS DO AGRO',x+w/2-48,y+28,'#f0d060');
 R('#3a1a10',dx-10,h-24,36,24);R('#c8a040',dx-11,h-26,38,3);R('#5a2a18',dx-8,h-22,15,22);R('#5a2a18',dx+9,h-22,15,22);R('#f0d060',dx+5,h-12,2,4);R('#f0d060',dx+9,h-12,2,4);
 for(const wx of[24,w-60])for(let k=0;k<2;k++){R('#2a1a12',wx+k*20,40,14,20);R('#f8d888',wx+k*20+2,42,10,16);R('#c8a040',wx+k*20-1,39,16,2)}};
const _ebElite=enterRoom;enterRoom=function(id){if(id!=='elite')return _ebElite(id);const h=S.t*24,dm=S.day%30+1;
 if(dm!==15||h<18)return toast('⭐ Salão de Gala fechado. O Leilão Estrelas do Agro é todo dia 15, a partir das 18h (leilão às 20h).');
 if(!eliteInvited())return toast('🕴️ Recepcionista: “Boa noite. Seu nome não está na lista de convidados.” (reputação 50+ ou patrimônio de R$ 5 milhões)','bad');
 return _ebElite(id)};
function eliteInvited(){return S&&((S.rep||0)>=50||myNW()>=5e6||(S.cel&&S.cel.inv===Math.floor(S.day/30)))}
// ---------- o salão por dentro (40 x 12)
const GT=[[3,6],[7,6],[11,6],[15,6],[24,6],[28,6],[32,6],[36,6],[3,9],[7,9],[11,9],[15,9],[24,9],[28,9],[32,9],[36,9]];// mesas redondas
const MYT=12;// a mesa do jogador (índice em GT)
ROOMS.elite={id:'elite',x:90,y:RZ+30,w:41,h:12,door:110,floor:'marble',wall:'#2a1018',trim:'#c8a040',win:[],items:[
 {k:'tapetegala',x:0,y:0,w:0,h:0},
 {k:'palco',x:16,y:2,w:9,h:1},{k:'pistag',x:15,y:3,w:11,h:2},{k:'pisteiro',x:13,y:4},{k:'pisteiro',x:27,y:4},
 {k:'barchamp',x:36,y:2,w:3,h:1,act:'champ'},{k:'recep',x:106-90,y:10,w:2,h:1},{k:'segur',x:113-90,y:10},{k:'segur',x:106-90-2,y:10},
 ...GT.map((p,i)=>({k:'mesagala',x:p[0],y:p[1],w:2,h:1,t:i,act:i===MYT?'galasit':'galatalk'})),{k:'lustres',x:0,y:11,w:0,h:0}],
 wallx:[{k:'bannergala',x:1},{k:'quadrog',x:6},{k:'quadrog',x:11},{k:'telao',x:26},{k:'bannergala',x:38}]};
CLERK.elite={n:'Ademar Júnior (leiloeiro)',shirt:'#ffffff',hair:'#3a2a1a',pants:'#141418'};
function galaSeats(){// quem senta em cada mesa (famosos espalhados + convidados genéricos)
 const S0=[],fam=GALA.map(x=>x.id);const order=[0,4,8,1,5,9,13,2,6,10,14,3,7,11,15];let k=0;
 for(let t=0;t<GT.length;t++){const a=[];if(t===MYT){a.push(null)}else{const f=order.indexOf(t);if(f>=0&&f<fam.length)a.push(fam[f]);a.push('g'+t)}S0.push(a)}return S0}
const GSEAT=galaSeats();
function galaGuestDraw(g,id,x,y,dir){if(!id)return;const G1=GALA.find(q=>q.id===id);let p;
 if(G1)p=G1.p;else{const h=hsh(id),f=h%3===0;p={g:f?'f':'m',shirt:'#f4f0e4',hair:['#2a1a10','#5a3a22','#c8c8c8','#1a1a1a','#e8d070'][h%5],pants:GALAF[h%6],look:{g:f?'f':'m',jacket:f?['#6a1a3a','#1a3a6a','#3a1a5a'][h%3]:GALAF[h%6],jk:'terno',slv:f?['#6a1a3a','#1a3a6a','#3a1a5a'][h%3]:GALAF[h%6],cuff:'#ffffff',tie:!f&&h%2?['#6a1a2a','#1a2a5a','#c8a040'][h%3]:null,skirt:f?'#1a1a1a':null,beard:f?null:['nenhuma','bigode','barba'][h%3],pearls:f}}}
 drawPerson(g,Object.assign({x,y,dir,ph:0,mv:0},p));const L=p.look||{};
 if(L.pearls&&dir===0)for(let i=0;i<5;i++)Rr(g,'#fffaf0',x-2+i*1,y-17.6+(i===0||i===4?0:.5),.7,.7);
 if(G1&&G1.cigar&&dir===0){Rr(g,'#5a3016',x+2,y-19.5,2.6,.8);Rr(g,((frame>>3)%8)<4?'#ff8a3a':'#c84a1a',x+4.6,y-19.5,.6,.8)}
 if(G1&&G1.phone&&dir===0){Rr(g,'#1a1a1a',x+3.5,y-22,1.6,2.6);if((frame>>4)%2)Rr(g,'#ff3a3a',x+4,y-21.6,.5,.5)}
 const B=LIVE&&LIVE.room==='elite'&&LIVE.bidders.find(b=>b.id===id);if(B&&B.paddle>0)drawPaddle(g,x+(dir===1?-1:1)*3,y-14,B.num,B.paddle)}
function drawPaddle(g,x,y,num,t){const up=Math.min(1,t*4)*Math.min(1,(t)/.15),hy=y-6-8*Math.min(1,up);Rr(g,'#e8c8a0',x-.6,hy+6,1.4,y-hy-4);Rr(g,'#5a3a22',x-.3,hy+3,.7,4);
 Rr(g,'#1a1a1a',x-3.4,hy-4.4,6.8,6.8);Rr(g,'#fbf8f0',x-3,hy-4,6,6);Rr(g,'#c8a040',x-3,hy-4,6,1);ptext(g,String(num),x-(String(num).length*2)+.5,hy-2,'#1a1a1a')}
const _dfLei=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),F=frame,W=(it.w||1)*TS,H=(it.h||1)*TS;
 switch(it.k){
 case 'tapetegala':{const rm=ROOMS.elite,X=(rm.x+19)*TS,Y=(rm.y+5)*TS;Rr(g,'#5a0a14',X,Y,3*TS,(rm.h-5)*TS);Rr(g,'#8a1424',X+3,Y,3*TS-6,(rm.h-5)*TS);Rr(g,'#c8a040',X+2,Y,1,(rm.h-5)*TS);Rr(g,'#c8a040',X+3*TS-3,Y,1,(rm.h-5)*TS);
  Rr(g,'rgba(255,220,150,.07)',rm.x*TS,(rm.y+2)*TS,rm.w*TS,(rm.h-2)*TS);return}
 case 'lustres':{const rm=ROOMS.elite;for(const lx of[7,15,26,34]){const X=(rm.x+lx)*TS,Y=(rm.y+3.2)*TS;Rr(g,'#c8a040',X-.5,(rm.y+1.6)*TS,1,Y-(rm.y+1.6)*TS);
   for(let k=0;k<7;k++){const a=k/7*Math.PI*2;Rr(g,'#e8f0ff',X+Math.cos(a)*9-1,Y+Math.sin(a)*3,2,4);Rr(g,'#ffffff',X+Math.cos(a)*9-.5,Y+Math.sin(a)*3,1,1)}Rr(g,'#f0d060',X-5,Y-2,10,3);if(((F+lx*9)%90)<6)Rr(g,'#ffffff',X+3,Y+2,1.5,1.5)}return}
 case 'palco':{R('rgba(0,0,0,.35)',-2,H,W+4,4);R('#3a1a10',-2,-8,W+4,H+8);R('#c8a040',-2,-8,W+4,1.5);R('#5a2a18',0,-6,W,H+4);
  const px=W/2;R('#2a1a12',px-9,-14,18,14);R('#c8a040',px-9,-14,18,2);R('#c8a040',px-3,-9,6,4);// púlpito
  const ll=LIVE&&LIVE.room==='elite';OL(g,x+px,y-12,30,42,c=>drawPerson(c,{x:x+px,y:y-12,dir:0,ph:0,mv:0,shirt:'#ffffff',hair:'#3a2a1a',pants:'#141418',look:{jacket:'#141418',jk:'terno',slv:'#141418',cuff:'#ffffff',tie:'#1a1a1a',beard:'nenhuma'}}));
  R('#1a1a1a',px+3,-30,1,6);R('#3a3a3a',px+2.4,-31,2,2);// microfone
  if(ll){const s=LIVE.hammerT>0;if(s){R('#5a3016',px+5,-30,1.4,6);R('#3a2010',px+3,-33,6,3)}}
  if(ll&&LIVE.bubble)bubble(g,x+px,y-44,LIVE.bubble);return}
 case 'pistag':{R('#c8b088',0,0,W,H);for(let i=0;i<60;i++)R('#b89a70',(i*37)%W,(i*23)%H,2,1);R('#c8a040',0,-1,W,1.5);R('#c8a040',0,H-1,W,1.5);for(let k=0;k<=W;k+=24){R('#c8a040',k,-4,1.5,H+4)}
  if(LIVE&&LIVE.room==='elite'&&LIVE.L)liveRingDraw(g,x+12,x+W-12,y+H-4);return}
 case 'pisteiro':{const ll=LIVE&&LIVE.room==='elite',up=ll&&LIVE.lastBid<.7;OL(g,x+8,y+12,30,42,c=>{drawPerson(c,{x:x+8,y:y+12,dir:0,ph:0,mv:0,shirt:'#ffffff',hair:'#2a1a10',pants:'#141418',hat:'#1a1a1a',look:{hat:'vaqueiro',hatc:'#1a1a1a',jacket:'#141418',jk:'terno',slv:'#141418',cuff:'#ffffff',tie:'#c8a040'}});if(up){Rr(c,'#141418',x+12,y-6,2,7);Rr(c,'#e8c8a0',x+12,y-8,2,2)}});
  if(up)bubble(g,x+8,y-22,'OPA!');return}
 case 'barchamp':R('rgba(0,0,0,.3)',0,H-1,W+2,3);R('#2a1a12',0,-6,W,H+6);R('#c8a040',0,-6,W,1.5);for(let i=0;i<6;i++){R('#e8f0f8',4+i*7,-12,3,6);R('#f0d060',4.5+i*7,-10,2,3)}R('#1a3a1a',W-10,-16,4,10);R('#c8a040',W-10,-16,4,2);
  OL(g,x+W/2,y-8,30,42,c=>drawPerson(c,{x:x+W/2,y:y-8,dir:0,ph:0,mv:0,shirt:'#ffffff',hair:'#1a1a1a',pants:'#141418',look:{vest:'#141418',tie:'#1a1a1a'}}));return;
 case 'recep':R('#2a1a12',0,-4,W,H+2);R('#c8a040',0,-4,W,1.5);R('#f4f0e4',6,-8,8,4);OL(g,x+W/2,y-6,30,42,c=>drawPerson(c,{x:x+W/2,y:y-6,dir:0,ph:0,mv:0,g:'f',shirt:'#141418',hair:'#2a1a10',pants:'#141418',look:{g:'f',hair:'coque',skirt:'#141418',pearls:1}}));return;
 case 'segur':OL(g,x+8,y+12,30,42,c=>{drawPerson(c,{x:x+8,y:y+12,dir:0,ph:0,mv:0,shirt:'#141416',hair:'#1a1a1a',pants:'#141416'});Rr(c,'#0a0a0c',x+5.8,y-5,4.4,1.2);Rr(c,'#c8c8d0',x+10.6,y-5.5,.4,2.4)});return;
 case 'mesagala':{const seats=GSEAT[it.t]||[],cx=x+W/2,cy=y+8;
  galaGuestDraw(g,seats[0],cx-6,cy-2,0);if(seats[1])galaGuestDraw(g,seats[1],cx+7,cy-3,0);
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(cx,cy+7,15,5,0,0,Math.PI*2);g.fill();g.fillStyle='#f8f4ec';g.beginPath();g.ellipse(cx,cy+2,14,6,0,0,Math.PI*2);g.fill();g.fillStyle='#e8e0d0';g.fillRect(cx-14,cy+2,28,5);
  g.fillStyle='#c8a040';g.beginPath();g.ellipse(cx,cy+2,14,6,0,0,Math.PI*2);g.lineWidth=.6;g.strokeStyle='#c8a040';g.stroke();
  R('#e8f0f8',W/2-6,4,2,4);R('#f0d060',W/2-5.5,5,1,2);R('#e8f0f8',W/2+5,3,2,4);R('#f0d060',W/2+5.5,4,1,2);R('#fbf8f0',W/2-1.5,2,3,4);R('#ff9a3a',W/2-.5,1,1,1.5);// taças e vela
  R('#1a1a1a',W/2-4,7.5,8,3);ptext(g,String(it.t+1),cx-(String(it.t+1).length*2)+.5,cy+5.6,'#f0d060');return}
 }
 return _dfLei(g,it,x,y,r)};
function bubble(g,x,y,t){t=String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase();const w=t.length*4+6;Rr(g,'#1a1a1a',x-w/2-1,y-1,w+2,9);Rr(g,'#fffef8',x-w/2,y,w,7);Rr(g,'#fffef8',x-2,y+7,3,2);ptext(g,t,x-w/2+3,y+1,'#1a1a1a')}
const _dwLei=drawWallDeco;drawWallDeco=function(g,wd,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 if(wd.k==='telao'){const W=11*TS;R('#0a0a0c',0,1,W,30);R('#1a1a2a',2,3,W-4,26);R('#c8a040',0,0,W,1.2);const L=LIVE&&LIVE.room==='elite'&&LIVE.L;
  if(L){g.save();g.beginPath();g.rect(x+4,y+4,60,24);g.clip();Rr(g,'#5a8a3a',x+4,y+4,60,24);drawCow(g,L.a,x+22,y+12,1,0);g.restore();
   ptext(g,'LOTE '+(LIVE.i+1)+'/'+LIVE.lots.length,x+68,y+5,'#f0d060');ptext(g,noAc(BREEDS[L.a.breed].n).slice(0,10)+(L.a.sex==='M'?' M':' F'),x+68,y+12,'#ffffff');ptext(g,'GEN '+L.a.gen,x+68,y+19,'#8ad0ff');
   const pv=L.price>=L.start?L.price:L.start;ptext(g,chantShort(pv),x+122,y+5,'#7ad04a');ptext(g,L.leader===null?'ABERTO':L.leader==='p'?'VOCE!':noAc(liveBidderName2(L.leader)).slice(0,11),x+122,y+12,L.leader==='p'?'#7ad04a':'#ffffff');for(let k=0;k<5;k++)Rr(g,k<Math.round(L.a.gen/20)?'#f0d060':'#3a3a4a',x+122+k*6,y+19,4,4)}
  else{ptext(g,'LEILOES ESTRELAS DO AGRO',x+40,y+10,'#f0d060');ptext(g,'AS MELHORES GENETICAS DO BRASIL',x+30,y+18,'#ffffff')}return}
 if(wd.k==='bannergala'){R('#2a1018',2,2,44,26);R('#c8a040',2,2,44,1.5);R('#c8a040',2,26.5,44,1.5);for(let k=0;k<5;k++)Rr(g,'#f0d060',x+8+k*8,y+8,4,4);ptext(g,'ESTRELAS',x+8,y+16,'#f0d060');ptext(g,'DO AGRO',x+10,y+21,'#ffffff');return}
 if(wd.k==='quadrog'){R('#c8a040',0,4,34,24);R('#3a5a2a',2,6,30,20);R('#c8b088',2,18,30,8);R('#f0ece0',8,10,16,8);R('#e8e0d0',20,9,6,4);R('#1a1a1a',24,11,1,1);R('#3a3a3a',9,17,2,5);R('#3a3a3a',21,17,2,5);return}
 return _dwLei(g,wd,x,y)};
const noAc=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase();
// ---------- números falados pelo leiloeiro
function chantTxt(v){v=Math.round(v);if(v>=1e6){const m=Math.floor(v/1e6),r=Math.round((v%1e6)/1000);return m+(m>1?' milhões':' milhão')+(r?' e '+r+' mil':'')}if(v>=1e4)return Math.round(v/1000)+' mil';return R$(v)}
function chantShort(v){return v>=1e6?(v/1e6).toFixed(2).replace('.',',')+' MI':v>=1e4?Math.round(v/1000)+' MIL':Math.round(v).toLocaleString('pt-BR')}
// ---------- motor do leilão ao vivo
let LIVE=null;
function liveBidderName2(id){const G1=GALA.find(q=>q.id===id);return G1?G1.n.split(' ').slice(-1)[0]:String(id)}
function liveBidderName(i){const b=LIVE&&LIVE.bidders[i];return b?b.n:'?'}
function eliteLots(){const pool=['nelorepo','nelorepo','angus','wagyu','brahman','senepol','gir','brangus','nelorepo'].map(LBRD),L=[],nm=['Imperador','Rainha do Cerrado','Jaguar','Majestade','Faraó','Estrela Guia','Diamante Negro','Soberana','Tufão','Princesa do Vale','Rei Leão','Dama de Ouro'];
 for(let i=0;i<8;i++){const sex=i%3===1?'F':'M',a=mk(pool[i],sex,ri(620,1150),ri(96,100));a.gen=Math.max(a.gen,96+(i%5));a.w=Math.round(wmax(a)*rnd(.9,.98));a.name=nm[(i*5+S.day)%nm.length]+' '+['FIV','TE','da Estrela','PO','REM'][i%5];a.breeder=sex==='M'?1:0;if(i===0||i===4){a.title=1;a.titles=ri(2,6)}
  const base=(sex==='M'?rnd(.6,1.4):rnd(.35,.8))*1e6*(1+(a.gen-96)*.18)*(a.title?1.35:1)*(a.breed==='wagyu'?1.15:1);const start=Math.round(base*.55/10000)*10000;
  const bidders=GALA.map(G1=>{const pf=G1.pref.includes(a.breed)?1.25:.8;return{id:G1.id,n:G1.n,num:G1.num,max:base*rnd(.7,1.9)*G1.bud*pf,agr:G1.agr,paddle:0}});L.push({a,start,price:start,inc:0,leader:null,bidders,el:1,desc:a.title?'Grande Campeão '+a.titles+'× em exposições nacionais':sex==='F'?'Doadora de embriões, filha de campeões':'Reprodutor provado, filhos de pista'})}return L}
function liveInc(v){const x=Math.max(50,v*.06),p=Math.pow(10,Math.floor(Math.log10(x))),m=x/p;return (m<1.5?1:m<3.5?2:m<7.5?5:10)*p}// incremento ~6%, arredondado bonito (1-2-5)
function liveStart(room,lots,seat){if(LIVE)return;const isE=room==='elite';
 const bidders=isE?GALA.map(G1=>({id:G1.id,n:G1.n,num:G1.num,paddle:0})):[];
 if(!isE){const names=[...new Set(lots.flatMap(l=>l.bidders.map(b=>b.n)))];names.forEach((n,i)=>bidders.push({id:'b'+i,n,num:10+((hsh(n)%80)),paddle:0,seat:i}))}
 LIVE={room,lots,i:-1,L:null,phase:'intro',t:0,idle:0,next:1.2,msg:'',bubble:'',hammerT:0,lastBid:9,bidders,seat,myNum:isE?77:ri(100,199),log:[],won:[],spent:0};
 liveNext();liveUI()}
function liveNext(){LIVE.i++;if(LIVE.i>=LIVE.lots.length)return liveEnd();const L=LIVE.L=LIVE.lots[LIVE.i];L.inc=liveInc(L.start);L.price=L.start-L.inc;L.leader=null;L.fin=0;
 LIVE.phase='intro';LIVE.t=0;LIVE.idle=0;LIVE.next=2.2;const a=L.a;LIVE.bubble='LOTE '+(LIVE.i+1);
 LIVE.msg='🎤 '+(LIVE.room==='elite'?'Senhoras e senhores, lote '+(LIVE.i+1)+': '+a.name+', '+BREEDS[a.breed].n+', genética '+a.gen+'! '+(L.desc||'')+'. Abrimos em '+chantTxt(L.start)+'!':'Lote '+(LIVE.i+1)+'! '+BREEDS[a.breed].n+' '+(a.sex==='F'?'fêmea':'macho')+', '+Math.round(a.w)+' quilos. Quem abre com '+chantTxt(L.start)+'?')}
function liveBidAI(){const L=LIVE.L,nx=L.price<L.start?L.start:L.price+L.inc;const C=[];
 if(LIVE.room==='elite'){for(const b of L.bidders){if(L.leader===b.id||b.max<nx)continue;C.push(b)}}
 else L.bidders.forEach((b,i)=>{if(L.leader!==i&&b.max>=nx)C.push(Object.assign({idx:i},b))});
 if(!C.length)return false;const b=pick(C);const pr=(L.price<L.start?.75:.5)*(b.agr?(.6+b.agr*.6):1);if(Math.random()>pr)return false;
 const jump=Math.random()<.18&&b.max>=nx+L.inc*2?L.inc:0;L.price=nx+jump;L.leader=LIVE.room==='elite'?b.id:b.idx;LIVE.idle=0;LIVE.lastBid=0;L.inc=liveInc(nx);
 const who=LIVE.room==='elite'?LIVE.bidders.find(x=>x.id===b.id):LIVE.bidders.find(x=>x.n===b.n);if(who)who.paddle=1.1;
 LIVE.msg='🙋 '+(who?who.n:b.n)+(who&&LIVE.room==='elite'?' (plaquinha '+who.num+')':'')+': '+chantTxt(L.price)+'! '+(jump?'Pulou o lance! ':'')+pick(['Quem dá mais?','Tenho '+chantTxt(L.price)+'!','Vai deixar passar?','Olha a genética, gente!','É pouco pelo que vale!']);LIVE.bubble=chantShort(L.price);return true}
function liveTick(dt){if(!LIVE)return;const L=LIVE.L;LIVE.t+=dt;LIVE.lastBid+=dt;if(LIVE.hammerT>0)LIVE.hammerT-=dt;for(const b of LIVE.bidders)if(b.paddle>0)b.paddle-=dt;if(P.paddle>0)P.paddle-=dt;
 if(!L)return;if(LIVE.phase==='intro'){if(LIVE.t>2.4){LIVE.phase='open';LIVE.t=0}return}
 if(LIVE.phase==='sold'){if(LIVE.t>2.8)liveNext();return}
 LIVE.idle+=dt;LIVE.next-=dt;if(LIVE.next<=0){LIVE.next=rnd(.3,.75);if(!(L.leader==='p'&&LIVE.idle<.6))liveBidAI()}
 if(L.leader===null&&LIVE.idle>7.5){LIVE.phase='sold';LIVE.t=0;L.fin=1;LIVE.msg='Sem lance. Lote retirado.';LIVE.bubble='RETIRADO';if(L.own){const ag=S.herd.find(x=>x.id===L.a.id);if(ag)ag.cons=0}liveDrop(L);return}
 if(L.leader!==null){if(LIVE.idle>2.4&&LIVE.idle-dt<=2.4){LIVE.msg='🎤 Dou-lhe uma... '+chantTxt(L.price)+'!';LIVE.bubble='DOU-LHE UMA'}
  if(LIVE.idle>4&&LIVE.idle-dt<=4){LIVE.msg='🎤 Dou-lhe duas... Última chance!';LIVE.bubble='DOU-LHE DUAS'}
  if(LIVE.idle>5.6)liveHammer()}}
function liveHammer(){const L=LIVE.L,a=L.a;LIVE.phase='sold';LIVE.t=0;L.fin=1;LIVE.hammerT=.6;LIVE.bubble='VENDIDO!';try{ifx('bad',0,10)}catch(e){}
 if(L.leader==='p'){const pr=L.price,fee=LIVE.room==='elite'?0:0;if(buyAnimal(a,pr,LIVE.room==='elite'?'Leilão Estrelas do Agro':'Leilão')){if(LIVE.room==='elite'){a.breeder=a.sex==='M'?1:0;S.rep=Math.min(100,S.rep+2);gainXP(120,'leilão de elite')}else{S.stats.aucWins=(S.stats.aucWins||0)+1;gainXP(25);S.rep=Math.min(100,S.rep+.4)}LIVE.won.push(a.name);LIVE.spent+=pr;LIVE.msg='🔨 VENDIDO para a plaquinha '+LIVE.myNum+': VOCÊ! '+R$(pr)+'. Parabéns!';try{ifx('coin',0,10)}catch(e){}}else LIVE.msg='Compra não concluída (dinheiro ou espaço).';liveDrop(L)}
 else if(L.own){if(L.price>=L.reserve){const net=Math.round(L.price*(1-comm()));cash(net,'Leilão: '+a.name);S.stats.sold++;S.herd=S.herd.filter(x=>x.id!==a.id);SP.delete(a.id);S.rep=Math.min(100,S.rep+(L.price>=valueOf(a,'mkt')?.8:.3));LIVE.msg='🔨 SEU LOTE VENDIDO para '+liveBidderName(LIVE.bidders.findIndex(b=>b.n===L.bidders[L.leader].n))+' por '+R$(L.price)+' (líquido '+R$(net)+')!'}
  else{LIVE.msg='Não atingiu a reserva ('+R$(L.reserve)+'). Seu animal volta pra fazenda.';const ag=S.herd.find(x=>x.id===a.id);if(ag)ag.cons=0}liveDrop(L)}
 else{const nm=LIVE.room==='elite'?(GALA.find(g=>g.id===L.leader)||{}).n:L.bidders[L.leader].n;LIVE.msg='🔨 Vendido para '+nm+' por '+R$(L.price)+'!';liveDrop(L)}renderHUD()}
function liveDrop(L){if(LIVE.room==='leilao'&&S.aucOpen&&S.aucOpen.lots)S.aucOpen.lots=S.aucOpen.lots.filter(x=>x!==L);if(LIVE.room==='elite'&&S.gala&&S.gala.lots)S.gala.lots=S.gala.lots.filter(x=>x!==L)}
function livePlayerBid(){const L=LIVE&&LIVE.L;if(!L||LIVE.phase!=='open'||L.own||L.leader==='p')return;const nx=L.price<L.start?L.start:L.price+L.inc;if(S.money<nx)return toast('Dinheiro insuficiente para '+R$(nx),'bad');
 L.price=nx;L.leader='p';LIVE.idle=0;LIVE.lastBid=0;L.inc=liveInc(nx);P.paddle=1.2;LIVE.msg='🙋 Plaquinha '+LIVE.myNum+' (você): '+chantTxt(nx)+'! '+pick(['Opa, entrou no jogo!','Olha o fazendeiro forte!','Tenho '+chantTxt(nx)+'! Quem dá mais?']);LIVE.bubble=chantShort(nx);try{ifx('click',0,10)}catch(e){}}
function liveEnd(){const W=LIVE.won,room=LIVE.room,sp=LIVE.spent;LIVE=null;liveUI();
 if(room==='elite'){S.gala=S.gala||{};S.gala.done=Math.floor(S.day/30);showModal('<h3>⭐ Fim do Leilão Estrelas do Agro</h3><div class="card">'+(W.length?'Você arrematou <b class="gold">'+W.join(', ')+'</b> por '+R$(sp)+'. Os animais seguem amanhã para a sua fazenda em caminhão climatizado.':'Você não arrematou nenhum lote desta vez, mas foi visto entre os grandes.')+'</div><div class="dim">O próximo leilão de gala é dia 15 do mês que vem.</div><div class="btns"><button class="b gold" data-act="close">Fechar</button></div>')}
 else{toast('🔨 Fim do pregão');save()}}
function liveLeave(){if(!LIVE)return;const L=LIVE.L;if(L&&L.leader==='p'&&LIVE.phase==='open'){return toast('Você é o líder deste lote! Espere o martelo bater.','bad')}const room=LIVE.room;LIVE=null;liveUI();if(room==='elite'){S.gala=S.gala||{};S.gala.done=Math.floor(S.day/30)}toast('Você saiu do pregão.')}
// ---------- desfile do animal na pista + condutor
function liveRingDraw(g,x0,x1,y){const L=LIVE.L,t=LIVE.t+LIVE.i*3,u=.5+.5*Math.sin(t*.55),x=x0+(x1-x0)*u,dir=Math.cos(t*.55)>=0?1:-1,f=(frame>>3)&1;
 drawCow(g,L.a,x-8,y-12,dir,f);const hx=x+dir*14;OL(g,hx,y+2,30,42,c=>drawPerson(c,{x:hx,y:y+2,dir:dir>0?3:2,ph:frame*.12,mv:1,shirt:'#ffffff',hair:'#2a1a10',pants:'#f4f4f0',hat:'#f4f0e4',look:{hat:'vaqueiro',hatc:'#f4f0e4'}}));Rr(g,'#5a3a22',Math.min(hx,x)-2,y-6,Math.abs(hx-x)+2,.8)}
// ---------- plaquinha na mão do jogador
const _dpbLei=drawPlayerBase;drawPlayerBase=function(g){_dpbLei(g);if(LIVE&&P.paddle>0&&!P.drive)drawPaddle(g,P.x+(P.dir===2?-4:4),P.y-15,LIVE.myNum,P.paddle)};
// ---------- o pregão semanal agora é ao vivo na arquibancada
const LSEAT=[[2,3],[3,3],[13,3],[14,3],[2,7],[13,7],[1.5,5],[14.5,5]];// lugares dos rivais na sala do leilão (relativo à sala)
openAuction=function(){const A=S.aucOpen;if(!A)return toast('Nenhum leilão aberto agora.');if(!A.lots)A.lots=makeLots(A.type);
 for(const a of S.herd)if(a.cons&&!A.lots.some(l=>l.own&&l.a.id===a.id))A.lots.push(mkLot(a,1,A.type==='elite'));A.lots=A.lots.filter(l=>!l.own||S.herd.some(a=>a.id===l.a.id&&a.cons));
 if(!A.lots.length)return toast('Não há lotes neste leilão.');const r=ROOMS.leilao;hideModal();if(typeof closeMenu==='function')closeMenu();
 const go=()=>{const seat={x:(r.x+3)*TS+8,y:(r.y+7)*TS+10};P.x=seat.x;P.y=seat.y;P.dir=1;liveStart('leilao',shuffle(A.lots.slice()),seat)};
 if(!inRoom()||roomAt(P.x,P.y)!==r){enterRoom('leilao');setTimeout(go,700)}else go()};
const _evoLei=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoLei(L,x0,x1,y0,y1);if(!LIVE||LIVE.room!=='leilao'||!inRoom())return;const r=ROOMS.leilao;
 LIVE.bidders.forEach((b,i)=>{const s=LSEAT[i%LSEAT.length],x=(r.x+s[0])*TS+8,y=(r.y+s[1])*TS+12;L.push([y+20,10,{draw:g=>{OL(g,x,y,30,42,c=>drawPerson(c,{x,y,dir:0,ph:0,mv:0,shirt:['#8a3a2a','#2a5a8a','#5a7a3a','#7a5a2a','#3a3a5a'][hsh(b.n)%5],hair:'#3a2a1a',pants:'#33384a',hat:hsh(b.n)%2?'#5a3a22':null}));if(b.paddle>0)drawPaddle(g,x+3,y-14,b.num,b.paddle)}}])});
 const rx=(r.x+5)*TS,ry=(r.y+6.6)*TS;if(LIVE.L)L.push([(r.y+7.3)*TS,10,{draw:g=>liveRingDraw(g,rx+14,rx+6*TS-14,ry)}]);
 if(LIVE.bubble){const C=CLERK.leilao;L.push([(r.y+9)*TS,10,{draw:g=>bubble(g,(r.x+8.5)*TS,(r.y+1)*TS-6,LIVE.bubble)}])}};
// ---------- gala: sentar na mesa, conversar com os convidados, champanhe
const _raLei=roomAct;roomAct=function(it,r){
 if(r.id==='elite'&&it.act==='galasit'){if(LIVE)return;const M=Math.floor(S.day/30);if(S.gala&&S.gala.done===M)return toast('O leilão desta noite já terminou. Até o mês que vem!');
  const h=S.t*24;if(h<20){return showModal('<h3>🍾 Coquetel</h3><div class="card">O leilão começa às <b>20h</b>. Aproveite para cumprimentar os convidados e tomar um champanhe.</div><div class="btns"><button class="b gold" data-act="galawait">⏩ Esperar até as 20h</button><button class="b gray" data-act="close">Ok</button></div>')}
  const t=GT[MYT],seat={x:(r.x+t[0]+1)*TS,y:(r.y+t[1]+1)*TS+14};P.x=seat.x;P.y=seat.y;P.dir=1;S.gala=S.gala||{};if(!S.gala.lots||S.gala.m!==M){S.gala.lots=eliteLots();S.gala.m=M}
  return liveStart('elite',S.gala.lots.slice(),seat)}
 if(r.id==='elite'&&it.act==='galatalk'){const s=GSEAT[it.t]||[],G1=GALA.find(q=>q.id===s[0]);if(!G1)return toast(pick(['“Boa noite! Que festa, hein?”','“Já viu o touro do lote 1? Uma pintura.”','“Dizem que o Comendador vai abrir a carteira hoje.”']));
  S.gala=S.gala||{};S.gala.rel=S.gala.rel||{};const k=G1.id+':'+Math.floor(S.day/30),first=!S.gala.rel[k];if(first){S.gala.rel[k]=1;S.rep=Math.min(100,S.rep+.5);gainXP(10,'contatos')}
  return showModal('<h3>🤝 '+G1.n+'</h3><div class="dim">'+G1.tag+' · plaquinha '+G1.num+'</div><div class="card" style="font-size:18px"><i>“'+pick(G1.fala)+'”</i></div>'+(first?'<div class="grn">Novo contato importante: +reputação.</div>':'')+'<div class="btns"><button class="b gray" data-act="close">Com licença</button></div>')}
 if(r.id==='elite'&&it.act==='champ'){if(S.money<600)return toast('Dinheiro insuficiente','bad');cash(-600,'Champanhe no Salão de Gala');P.hp=Math.min(100,P.hp+10);if(typeof bebeu==='function')bebeu();return toast('🥂 Uma taça de champanhe francês. Saúde!','good')}
 return _raLei(it,r)};
ACT.galawait=function(){S.t=Math.max(S.t,20/24);hideModal();toast('🕗 20h: o leiloeiro sobe ao palco!')};
const _ilLei=interactList;interactList=function(){if(LIVE)return[];const L=_ilLei();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r||r.id!=='elite')return L;
 for(const l of L){const it=r.items.find(i=>i.act&&Math.abs((r.x+i.x+(i.w||1)/2)*TS-l.x)<1&&Math.abs((r.y+i.y+(i.h||1))*TS+4-l.y)<1);if(!it)continue;
  if(it.act==='galasit')l.label='🪑 Sentar na sua mesa (nº '+(MYT+1)+')';else if(it.act==='champ')l.label='🥂 Champanhe (R$ 600)';else if(it.act==='galatalk'){const G1=GALA.find(q=>q.id===(GSEAT[it.t]||[])[0]);l.label=G1?'🤝 Cumprimentar '+G1.n:'💬 Conversar (mesa '+(it.t+1)+')'}else if(l.label==='🚪 Sair')l.label='🚪 Sair do salão'}
 return L};
// ---------- painel do pregão (embaixo da tela)
const liveBox=document.createElement('div');liveBox.id='livebox';liveBox.style.cssText='position:fixed;left:50%;bottom:6px;transform:translateX(-50%);width:min(620px,96vw);z-index:8;display:none;background:rgba(18,10,6,.9);border:2px solid #c8a040;border-radius:10px;padding:6px 9px;color:#f3e6c8;font:13px sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.6)';document.body.appendChild(liveBox);
liveBox.addEventListener('click',e=>{const b=e.target.closest('[data-lv]');if(!b)return;e.stopPropagation();const k=b.dataset.lv;if(k==='bid')livePlayerBid();else if(k==='leave')liveLeave();liveUI(1)});
let liveUIT=0,liveUIK='';
function liveUI(force){if(!LIVE){liveBox.style.display='none';return}liveBox.style.display='block';const L=LIVE.L;if(!L)return;const a=L.a,B=BREEDS[a.breed],nx=L.price<L.start?L.start:L.price+L.inc,cur=L.price>=L.start?L.price:null;
 const lead=L.leader===null?'sem lances':L.leader==='p'?'<b style="color:#7ad04a">VOCÊ (plaquinha '+LIVE.myNum+')</b>':(LIVE.room==='elite'?(GALA.find(g=>g.id===L.leader)||{}).n:L.bidders[L.leader].n);
 const can=LIVE.phase==='open'&&!L.own&&L.leader!=='p'&&S.money>=nx;
 const k=[LIVE.i,L.price,L.leader,LIVE.phase,LIVE.msg,can,S.money>=nx].join('|');if(!force&&k===liveUIK)return;liveUIK=k;
 liveBox.innerHTML='<div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span style="color:#f0d060;font-weight:bold">'+(LIVE.room==='elite'?'⭐ ESTRELAS DO AGRO':'🔨 PREGÃO AO VIVO')+' · LOTE '+(LIVE.i+1)+'/'+LIVE.lots.length+'</span><span>'+a.name+' · '+B.n+' '+(a.sex==='M'?'♂':'♀')+' · gen <b style="color:#f0d060">'+a.gen+'</b> '+stars(a.gen)+' · '+Math.round(a.w)+' kg'+(a.title?' · 🎗️':'')+(L.own?' · <b style="color:#ffb04a">SEU LOTE (reserva '+R$(L.reserve)+')</b>':'')+'</span></div>'
 +'<div style="display:flex;align-items:center;gap:10px;margin:3px 0"><div style="font:bold 22px sans-serif;color:#7ad04a;min-width:150px">'+(cur?R$(cur):'abre em '+R$(L.start))+'</div><div style="flex:1">Líder: '+lead+'<div style="color:#d8c8a8;font-style:italic;font-size:12px;min-height:16px">'+LIVE.msg+'</div></div></div>'
 +'<div style="display:flex;gap:6px">'+(L.own?'<span style="flex:1;color:#ffb04a">Torça pelos lances!</span>':'<button data-lv="bid" class="b gold" style="flex:1;font-size:13px" '+(can?'':'disabled')+'>🙋 Levantar a plaquinha · '+R$(nx)+'</button>')+'<button data-lv="leave" class="b gray" style="font-size:12px">🚪 Sair</button></div>'+(S.money<nx&&!L.own?'<div class="red" style="font-size:11px">Saldo: '+R$(S.money)+'</div>':'')}
const _updLei=update;update=function(dt){_updLei(dt);if(!LIVE||!S)return;try{liveTick(Math.min(dt,.1));if(LIVE&&LIVE.seat){P.x=LIVE.seat.x;P.y=LIVE.seat.y;P.vx=P.vy=0;P.moving=0;P.dir=1}liveUIT+=dt;if(liveUIT>.12){liveUIT=0;liveUI()}}catch(e){console.error(e);LIVE=null;liveUI()}};
const _fadeLei=fade;fade=function(fn){if(LIVE&&LIVE.seat)LIVE=null,liveUI();return _fadeLei(fn)};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:3,ic:'🔨',t:'Leilão ao vivo',h:'Quando o leilão semanal abrir, entre no prédio do Leilão da Vila e use “Entrar no pregão”: você senta na arquibancada e levanta a plaquinha a cada lance. Todo dia 15, às 20h, tem o Leilão Estrelas do Agro no Salão de Gala (ao lado da Arena), só para convidados.'});
