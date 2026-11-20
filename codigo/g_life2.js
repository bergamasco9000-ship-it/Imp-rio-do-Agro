// ===== Vida própria dos moradores: rotina diária, sítios que evoluem, hortas, animais, feirinha =====
Object.assign(ITEMS,{queijo:{n:'Queijo minas',ic:'🧀',cat:'prod',p:32},charque:{n:'Charque pantaneiro',ic:'🥩',cat:'prod',p:45},rapadura:{n:'Rapadura',ic:'🟫',cat:'prod',p:12}});
// ---------- novos moradores
[{id:'benedita',n:'Dona Benedita',role:'Raizeira do cerrado',col:'#8a4a6a',hair:'#d8d8d8',lines:['Chá de boldo cura tudo, meu filho.','Aqui no cerrado a gente planta mandioca e reza pra chover.','Minhas cabritas dão um leite que é uma bênção.']},
 {id:'rosa',n:'Dona Rosa Silva',role:'Sitiante',col:'#c8603a',hair:'#3a2414',lines:['A família Silva vive da roça há três gerações.','Tomate bom é tomate de quintal.','Toda madrugada eu tiro o leite das vacas antes do sol.']},
 {id:'bene',n:'Seu Bené',role:'Peão pantaneiro',col:'#5a7a8a',hair:'#2a1a10',lines:['Na cheia a gente leva o gado pro alto, de comitiva.','Pantaneiro não tem pressa, tem tempo.','O pintado tá subindo o rio essa semana.']},
 {id:'lino',n:'Seu Lino',role:'Ermitão apicultor',col:'#6a6a4a',hair:'#eeeeee',lines:['Aqui em cima o silêncio é o melhor vizinho.','Abelha brava é abelha de flor boa.','Já vi coisa estranha nessas montanhas…']}
].forEach(n=>{const h=HMD.find(q=>q.id===n.id);n.hx=(h.x+h.hw/2)*TS;n.hy=(h.y+h.hh+1)*TS+4;n.x=n.hx;n.y=n.hy;n.wait=1;n.tx=n.x;n.ty=n.y;n.dir=1;NPCS.push(n);NPC_IDS.push(n.id)});
Object.assign(NPCLOOK,{benedita:{g:'f',hat:'#e8e0d0',skin:'#a86a40',pants:'#6a3a4a'},rosa:{g:'f',hat:'#d8c080',skin:'#d8a070',pants:'#3a4a6a'},bene:{hat:'#6a4a2a',skin:'#a86a40',pants:'#4a3a2a'},lino:{skin:'#e0b090',pants:'#4a4030'}});
Object.assign(LIKES,{benedita:['mandioca','galinha','cafe'],rosa:['tomate','ovo','pelucia'],bene:['pintado','dourado','charque'],lino:['mel','truta','cafe']});
// ---------- lugares
const DOORP=id=>{const b=BLD.find(q=>q.id===id);return b?{x:b.door*TS+8,y:(b.y+b.h)*TS+6}:null};
const HSD=id=>HMD.find(h=>h.id===id);
const hsDoor=h=>({x:(h.x+Math.floor(h.hw/2))*TS+8,y:(h.y+h.hh)*TS+8});
const HOMEOF={joao:'h1',lourdes:'h2',bisc:'h2',ramos:'h3',marina:'h4',tiao:'canil',zeca:'pescador',guarda:'posto',ze:'hs:ze',benedita:'hs:benedita',rosa:'hs:rosa',bene:'hs:bene',lino:'hs:lino'};
const YARDOWN={h1:'joao',h2:'lourdes',h3:'ramos',h4:'marina'};
function homePt(id){const k=HOMEOF[id];if(!k)return null;if(k.startsWith('hs:'))return hsDoor(HSD(k.slice(3)));return DOORP(k)}
const WORKP={joao:{x:116*TS,y:57*TS},lourdes:DOORP('padaria'),ramos:DOORP('delegacia'),marina:DOORP('vet'),tiao:DOORP('canil'),ze:DOORP('agro'),zeca:{x:142*TS+8,y:71*TS},guarda:{x:112*TS,y:40*TS}};
const PRACA2={x:121*TS,y:58*TS},IGREJA=DOORP('igreja'),PADP=DOORP('padaria');
// rotina: [hora de início, atividade, lugar]
const SCHED={
 joao:[[6,'home'],[7,'idle','padaria'],[8,'work'],[12,'home'],[13.5,'work'],[17,'idle','praca'],[19.5,'home']],
 lourdes:[[5.5,'work'],[12,'home'],[13,'work'],[18,'idle','praca'],[20,'home']],
 ramos:[[7,'work'],[12,'idle','padaria'],[13,'work'],[18,'patrol'],[21,'home']],
 marina:[[7,'work'],[12,'home'],[13,'work'],[17,'idle','praca'],[19,'home']],
 tiao:[[6,'patrol'],[7.5,'work'],[18,'idle','praca'],[20,'home']],
 ze:[[5.5,'plots'],[7,'work'],[17,'pen'],[18.5,'idle','porch'],[19.5,'home']],
 bisc:[[7,'school'],[11,'home'],[12.5,'play'],[17,'idle','praca'],[19,'home']],
 zeca:[[4.5,'fish'],[10,'work'],[16,'fish'],[19,'home']],
 guarda:[[6,'patrol'],[12,'home'],[13,'patrol'],[18,'home']],
 benedita:[[5,'plots'],[11,'home'],[13,'pen'],[16,'idle','porch'],[18,'home']],
 rosa:[[5,'pen'],[7,'plots'],[11,'home'],[13,'plots'],[16,'pen'],[18,'home']],
 bene:[[5,'pen'],[9,'patrol'],[12,'home'],[14,'fish'],[17,'pen'],[18.5,'home']],
 lino:[[6,'bees'],[10,'pen'],[12,'home'],[14,'patrol'],[17,'home']]
};
function curAct(n){const h=S.t*24,dw=S.day%7;let L=SCHED[n.id];if(!L)return['idle'];
 if(dw===0&&h>=8.5&&h<11&&['joao','lourdes','marina','ramos','bisc','tiao','benedita','rosa'].includes(n.id))return['mass'];
 if(dw===6&&n.id==='rosa'&&h>=8&&h<12)return['idle','padaria'];
 if(S.day%30===14&&n.id==='benedita'&&h>=8&&h<13)return['idle','praca'];
 if(n.id==='bisc'&&(dw===0||dw===6)&&h>=7&&h<11)return['play'];
 let a=L[L.length-1];for(const e of L)if(h>=e[0])a=e;if(h<L[0][0])a=[0,'home'];return a.slice(1)}
function actTarget(n,a){const k=a[0],home=homePt(n.id),H=HOMEOF[n.id]&&HOMEOF[n.id].startsWith('hs:')?HSD(HOMEOF[n.id].slice(3)):null;
 switch(k){
  case 'home':return home;case 'work':return WORKP[n.id]||home;
  case 'mass':return{x:IGREJA.x+rnd(-24,24),y:IGREJA.y+rnd(2,10)};
  case 'school':return{x:IGREJA.x+20,y:IGREJA.y};
  case 'idle':{const p=a[1];if(p==='praca')return{x:PRACA2.x+rnd(-60,60),y:PRACA2.y+rnd(-10,12)};if(p==='padaria')return{x:PADP.x+rnd(-14,14),y:PADP.y+rnd(2,8)};if(p==='porch'&&home)return{x:home.x+rnd(-20,20),y:home.y+2};return home}
  case 'plots':if(H){const P=hsPlots(H);const t=P.length?pick(P):null;if(t)return{x:t[0]*TS+8,y:t[1]*TS+12}}return home;
  case 'pen':if(H){const p=hsPen(H);return{x:(p.x0+1+rnd(0,p.w-2))*TS,y:(p.y0-0)*TS+2}}return home;
  case 'bees':if(H)return{x:(H.x-2)*TS+rnd(-6,6),y:(H.y+2)*TS+rnd(0,10)};return home;
  case 'fish':{if(n.id==='zeca')return{x:141*TS+rnd(-8,8),y:71*TS+6};if(H)return{x:(H.x+H.hw+3)*TS,y:(H.y-2)*TS};return home}
  case 'play':return pick([{x:PRACA2.x+rnd(-50,50),y:PRACA2.y+rnd(-8,10)},{x:127*TS+rnd(-10,10),y:66*TS},{x:110*TS,y:57*TS}]);
  case 'patrol':{if(n.id==='ramos')return pick([{x:100*TS,y:47*TS},{x:140*TS,y:47*TS},{x:121*TS,y:61*TS},{x:109*TS,y:58*TS}]);if(n.id==='tiao')return{x:131*TS+rnd(-40,40),y:65*TS+rnd(-4,4)};if(n.id==='guarda')return pick([{x:112*TS,y:40*TS},{x:109*TS,y:20*TS},{x:109*TS,y:8*TS},{x:100*TS,y:47*TS}]);if(H)return{x:(H.x+rnd(-4,10))*TS,y:(H.y+rnd(-3,8))*TS};return home}
 }return home}
// ---------- movimento com rotina
const _drawNPCL=drawNPC;drawNPC=function(g,n){if(n.hid)return;_drawNPCL(g,n);if(RMODE===4)return;
 if(n.id==='lino'){Rr(g,'#eeeeee',n.x-3,n.y-16,6,4);Rr(g,'#d8d8d8',n.x-2,n.y-13,4,2)}
 if(n.task==='plots'&&n.work){const s=Math.sin(frame/5)*2;Rr(g,'#6a4428',n.x+4,n.y-14+s,1,10);Rr(g,'#888',n.x+3,n.y-4+s,4,1.4)}
 if(n.chat>0&&((frame>>4)&3)!==0){Rr(g,'#1e140c',n.x+3,n.y-31,9,6);Rr(g,'#fff',n.x+3.5,n.y-30.5,8,5);for(let i=0;i<3;i++)Rr(g,'#888',n.x+5+i*2,n.y-28.5,1,1);Rr(g,'#fff',n.x+5,n.y-25.6,2,1.4)}
 if(n.task==='mass'||n.task==='school')return};
function npcGo(n,tx,ty,dt,spd){if(!n.path||n.ptx!==tx||n.pty!==ty){n.path=(Math.hypot(tx-n.x,ty-n.y)>40&&n.y<RZ*TS)?findPath(n.x,n.y,tx,ty):null;if(!n.path)n.path=[[tx,ty]];n.pi=0;n.ptx=tx;n.pty=ty}
 let p=n.path[n.pi];if(p&&Math.hypot(p[0]-n.x,p[1]-n.y)<3&&n.pi<n.path.length-1){n.pi++;p=n.path[n.pi]}if(!p||(n.pi>=n.path.length-1&&Math.hypot(p[0]-n.x,p[1]-n.y)<3))p=[tx,ty];
 const dx=p[0]-n.x,dy=p[1]-n.y,d=Math.hypot(dx,dy);if(d<1.5){n.mv=0;return true}const s=Math.min(d,spd*dt);n.x+=dx/d*s;n.y+=dy/d*s;n.mv=1;n.dir=dx>0?1:-1;n.stk=0;return false}
stepNPC=function(dt){
 for(const n of NPCS){n.chat=Math.max(0,(n.chat||0)-dt);
  if(n.ohx!==undefined){n.hid=0;n.task='festa';if(n.wait>0){n.wait-=dt;n.mv=0;continue}if(npcGo(n,n.tx,n.ty,dt,15)){n.wait=rnd(2,7);n.tx=n.hx+rnd(-22,22);n.ty=n.hy+rnd(-8,8)}continue}
  const a=curAct(n),key=a.join(':');
  if(key!==n.akey){n.akey=key;n.task=a[0];n.goal=actTarget(n,a);n.hid=0;n.arr=0;n.work=0;n.path=null;n.wait=0}
  if(!n.goal){n.mv=0;continue}
  const far=Math.hypot(n.goal.x-n.x,n.goal.y-n.y);
  if(n.hid){if(a[0]!=='home'&&a[0]!=='school'&&a[0]!=='mass')n.hid=0;else continue}
  if(far>2.5&&!n.arr){if(far>1400||(far>520&&!evis(n.x,n.y,60)&&!evis(n.goal.x,n.goal.y,60))){n.x=n.goal.x;n.y=n.goal.y}npcGo(n,n.goal.x,n.goal.y,dt,n.kid?20:16);continue}
  // chegou
  if(!n.arr){n.arr=1;n.mv=0;n.wait=rnd(1,3);if(a[0]==='home'||a[0]==='school'){n.hid=1;continue}}
  if(a[0]==='mass'){n.hid=1;continue}
  if(n.wait>0){n.wait-=dt;n.mv=0;continue}
  // dentro da atividade: pequenas andadas e trabalho
  const t=a[0];n.work=0;
  if(t==='plots'||t==='pen'||t==='bees'||t==='fish'){const g=actTarget(n,a);n.wt=(n.wt||0)-dt;if(!n.wx||n.wt<=0){n.wx=g.x;n.wy=g.y;n.wt=rnd(4,9)}if(npcGo(n,n.wx,n.wy,dt,12)){n.work=t!=='fish'?1:0;n.dir=t==='pen'?n.dir:n.dir}if(t==='plots'&&n.work&&Math.random()<dt*.15)hsHarvest(n.id);continue}
  if(t==='patrol'||t==='play'){if(!n.wx||Math.hypot(n.wx-n.x,n.wy-n.y)<3){const g=actTarget(n,a);n.wx=g.x;n.wy=g.y;n.wait=rnd(1,4)}npcGo(n,n.wx,n.wy,dt,t==='play'?22:14);continue}
  // parado conversando / atendendo
  if(!n.wx||Math.hypot(n.wx-n.x,n.wy-n.y)<2){n.wx=n.goal.x+rnd(-14,14);n.wy=n.goal.y+rnd(-5,5);n.wait=rnd(3,8);
   const o=NPCS.find(m=>m!==n&&!m.hid&&Math.hypot(m.x-n.x,m.y-n.y)<26&&(m.task==='idle'||m.task==='work'));if(o&&Math.random()<.6){n.chat=rnd(3,6);o.chat=n.chat;n.dir=o.x>n.x?1:-1;o.dir=-n.dir;n.wx=n.x;n.wy=n.y}}
  npcGo(n,n.wx,n.wy,dt,10)}
};
// visíveis fora do horário padrão e escondidos dentro de casa
const _ilL2=interactList;
interactList=function(){let L=_ilL2();const hidN=new Set(NPCS.filter(n=>n.hid).map(n=>'Falar com '+n.n));if(hidN.size)L=L.filter(it=>!hidN.has(it.label));
 if(!npcOut())for(const n of NPCS)if(!n.hid&&n.y<RZ*TS)L.push({x:n.x,y:n.y-4,r:22,label:'Falar com '+n.n,fn:()=>npcModal(n.id)});
 if(!inRoom())for(const h of HMD){const d=hsDoor(h),o=npcById(h.id);if(Math.hypot(d.x-P.x,d.y-P.y)<60)L.push({x:d.x,y:d.y,r:30,label:(o&&!o.hid?'🧺 Feirinha: ':'🏠 ')+h.n,fn:()=>hsModal(h.id)})}
 return L};
const _evoL2=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoL2(L,x0,x1,y0,y1);if(inRoom())return;
 const hr=S.t*24,fx=typeof festaHoje==='function'&&festaHoje()&&hr>=21&&hr<23.5;
 if(!npcOut()&&!fx)for(const n of NPCS)if(!n.hid&&n.x>x0&&n.x<x1&&n.y>y0&&n.y<y1+30)L.push([n.y,7,n]);
 for(const h of HMD){const Lt=hmLot(h);if(Lt.x1*TS<x0-40||Lt.x0*TS>x1+40||Lt.y1*TS<y0-40||Lt.y0*TS>y1+60)continue;hsItems(h,L)}
};
// ---------- sítios: estágio, horta, animais
function hm(id){if(!S.hm)S.hm={};let m=S.hm[id];if(!m){const H=HSD(id);m=S.hm[id]={st:Math.min(2,Math.floor(S.day/120)+(Math.random()<.5?1:0)),next:S.day+ri(15,30),pl:[],stock:{}};}if(!m.pl)m.pl=[];return m}
function homeStage(bid){const o=YARDOWN[bid];return o?hm(o).st:0}
const CROPOF={benedita:['mandioca','milho'],ze:['milho','soja'],rosa:['tomate','milho'],bene:['milho','mandioca'],lino:['trigo','tomate'],joao:['tomate','tomate'],lourdes:['tomate','milho'],ramos:['milho','milho'],marina:['tomate','tomate']};
const ANIOF={benedita:'cabra',ze:'girolando',rosa:'girolando',bene:'nelore',lino:'cabra'};
const STNEWS={benedita:['','fez um galinheiro de bambu','cercou um piquete e comprou 2 cabritas','construiu um paiol de pau-a-pique e plantou um pomar','puxou um cômodo novo na casa e comprou uma carroça'],
 ze:['','ergueu um galinheiro','fez um curral e comprou 2 vacas leiteiras','construiu um paiol e plantou laranjeiras','ampliou a casa e comprou um trator velho'],
 rosa:['','aumentou a horta e o galinheiro','comprou 2 vacas e fez um curral','construiu um paiol e uma caixa d’água','fez uma varanda nova e comprou uma carroça'],
 bene:['','fez um galinheiro sobre estacas','montou um curral pantaneiro com 2 vacas','construiu um galpão e um píer','aumentou o rancho e comprou uma chalana'],
 lino:['','fez mais caixas de abelha','cercou um piquete para as cabras','construiu um depósito de pedra','ampliou a cabana com um alpendre'],
 joao:['','colocou vasos na porta','pôs floreiras nas janelas','fez uma hortinha no quintal','comprou uma bicicleta'],lourdes:['','colocou vasos na porta','pôs floreiras nas janelas','fez uma hortinha no quintal','comprou uma bicicleta'],ramos:['','colocou vasos na porta','pôs floreiras nas janelas','fez uma hortinha no quintal','comprou uma bicicleta'],marina:['','colocou vasos na porta','pôs floreiras nas janelas','fez uma hortinha no quintal','comprou uma bicicleta']};
const hsPlotN=st=>[4,6,9,12,12][st];
function hsPlots(H){const st=hm(H.id).st,n=hsPlotN(st),L=[];for(let i=0;i<n;i++)L.push([H.x+H.hw+1+(i%4),H.y+Math.floor(i/4)]);return L}
function hsPen(H){return{x0:H.x-2,y0:H.y+H.hh+2,w:7,h:4}}
function hsAnimN(H){const st=hm(H.id).st;return[0,0,2,3,5][st]}
function applyHomeSol(){for(const H of HMD){const st=hm(H.id).st,p=hsPen(H);for(let x=p.x0;x<p.x0+p.w;x++)for(let y=p.y0;y<p.y0+p.h;y++){const edge=x===p.x0||y===p.y0||x===p.x0+p.w-1||y===p.y0+p.h-1;SOL[ti(x,y)]=st>=2&&edge&&!(y===p.y0&&x===p.x0+3)?1:0}}}
function hsHarvest(id){const m=hm(id);const H=HSD(id);if(!H)return;const n=hsPlotN(m.st);while(m.pl.length<n)m.pl.push(ri(0,3));for(let i=0;i<n;i++){const c=CROPS[(CROPOF[id]||['milho'])[i%2]];if(m.pl[i]>=c.d){m.pl[i]=0;const k=(CROPOF[id]||['milho'])[i%2];m.stock[k]=Math.min(12,(m.stock[k]||0)+2);break}}}
const _hdL2=hookDay;
hookDay=function(){_hdL2();let ch=0;
 for(const id of Object.keys(CROPOF)){const m=hm(id),n=hsPlotN(m.st);while(m.pl.length<n)m.pl.push(ri(0,3));for(let i=0;i<m.pl.length;i++)if(S.weather==='chuva'||Math.random()<.8)m.pl[i]++;
  for(let i=0;i<m.pl.length;i++){const c=CROPS[(CROPOF[id])[i%2]];if(m.pl[i]>c.d+3){m.pl[i]=0;const k=CROPOF[id][i%2];m.stock[k]=Math.min(12,(m.stock[k]||0)+2)}}
  const an=ANIOF[id];if(an){if(an==='cabra'){m.stock.leitecabra=Math.min(8,(m.stock.leitecabra||0)+(m.st>=2?1:0))}else{if(m.st>=2)m.stock.queijo=Math.min(6,(m.stock.queijo||0)+1)}if(m.st>=1)m.stock.ovo=Math.min(18,(m.stock.ovo||0)+3)}
  if(id==='lino')m.stock.mel=Math.min(8,(m.stock.mel||0)+1);if(id==='bene'&&m.st>=2)m.stock.charque=Math.min(5,(m.stock.charque||0)+(Math.random()<.4?1:0));if(id==='benedita')m.stock.rapadura=Math.min(10,(m.stock.rapadura||0)+1);
  if(m.st<4&&S.day>=m.next){m.st++;m.next=S.day+ri(22,40);ch=1;const nn=npcById(id);if(nn)toast('🏡 Novidade na região: '+nn.n+' '+STNEWS[id][m.st]+'!','good');BCACHE.clear()}}
 if(ch)applyHomeSol();
};
const _gwL2=genWorld;genWorld=function(){_gwL2();HSOLOK=0};
// animais do cercado (runtime)
const HAN={};
function hsAnimals(H){const n=hsAnimN(H),p=hsPen(H);let A=HAN[H.id];if(!A)A=HAN[H.id]=[];const br=ANIOF[H.id];
 while(A.length<n){const i=A.length,a={id:-500-HMD.indexOf(H)*10-i,breed:br==='cabra'?'nelore':br,sex:i===0&&n>=3?'M':'F',age:i===n-1&&n>=3?150:900,w:i===n-1&&n>=3?140:480,gen:50,hp:90,x:(p.x0+1.5+Math.random()*(p.w-3))*TS,y:(p.y0+1.5+Math.random()*(p.h-3))*TS,dir:1,f:0,tx:0,ty:0,wt:rnd(1,5),goat:br==='cabra'};A.push(a)}A.length=n;return A}
function stepHsAnimals(dt){for(const H of HMD){const A=HAN[H.id];if(!A)continue;const p=hsPen(H);for(const a of A){a.wt-=dt;if(a.wt<=0){a.wt=rnd(3,9);a.tx=(p.x0+1.2+Math.random()*(p.w-3))*TS;a.ty=(p.y0+1.4+Math.random()*(p.h-2.8))*TS}if(a.tx){const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d>1){const s=Math.min(d,7*dt);a.x+=dx/d*s;a.y+=dy/d*s;a.dir=dx>0?1:-1;a.f=(frame>>4)&1}else{a.tx=0;a.f=0}}}}}
let HSOLOK=0;const _updL2=update;update=function(dt){_updL2(dt);if(!S)return;if(!HSOLOK){HSOLOK=1;applyHomeSol()}stepHsAnimals(dt)};
function drawGoat(g,a){const x=a.x,y=a.y,d=a.dir,c=a.id%2?'#f0ece4':'#8a6a4a',r=(col,dx,dy,w,h)=>Rr(g,col,d>0?x+dx:x-dx-w,y+dy,w,h),f=a.f?1:0;
 Rr(g,'rgba(0,0,0,.25)',x-7,y-1,14,2.4);r('#4a3a2a',-5+f,-5,1.4,5);r('#4a3a2a',3-f,-5,1.4,5);r(c,-6,-11,12,6.5);r(shade(c,14),-5.5,-11.4,10,1.2);r('#4a3a2a',-4-f,-5,1.4,5);r('#4a3a2a',4+f,-5,1.4,5);
 r(c,5,-14,4,5);r(c,7,-13,3.5,4);r('#222',8,-12.5,.9,.9);r('#5a4a3a',5.5,-16.5,1,3);r('#5a4a3a',6.5,-17,1,2);r(shade(c,-20),9.6,-10.5,1,2.5);r(c,-7,-11,1.4,2)}
function drawPlot(g,x,y,age,ck){const c=CROPS[ck],st=Math.min(3,Math.floor(age/c.d*3.0001));Rr(g,'#6b4a2c',x+1,y+2,14,13);Rr(g,'#5a3a22',x+1,y+6,14,1);Rr(g,'#5a3a22',x+1,y+11,14,1);
 if(age<=0)return;const col=c.c[Math.min(2,st)];for(let i=0;i<3;i++)for(let j=0;j<2;j++){const px=x+3+i*4.5,py=y+5+j*5;if(st===0){Rr(g,'#5ab04a',px,py,1.6,1.6)}else{Rr(g,'#3a8a3a',px-.5,py-st*1.4,2.6,st*1.6+.8);Rr(g,col,px-1+(st>2?0:.5),py-st*1.6-1,st>2?3.4:2,st>2?2.2:1.4)}}}
function drawPen(g,H){const p=hsPen(H),x0=p.x0*TS,y0=p.y0*TS,x1=(p.x0+p.w)*TS,y1=(p.y0+p.h)*TS,gx=(p.x0+3)*TS;
 Rr(g,'rgba(110,80,40,.25)',x0+4,y0+6,x1-x0-8,y1-y0-10);Rr(g,'#7a5a32',x0+18,y1-14,14,5);Rr(g,'#c8a040',x0+19,y1-14,12,1.4);
 for(let x=x0+2;x<=x1-2;x+=8){if(x>gx-1&&x<gx+TS+1)continue;Rr(g,'#5a3a22',x,y0+2,2,10)}for(const yy of[y0+5,y0+9])for(let x=x0+2;x<x1-2;x+=1){if(x>gx&&x<gx+TS)continue;Rr(g,'#8a6a42',x,yy,1,1.2)}}
function drawPenSides(g,H){const p=hsPen(H),x0=p.x0*TS,y0=p.y0*TS,x1=(p.x0+p.w)*TS,y1=(p.y0+p.h)*TS;for(let y=y0+8;y<y1;y+=8){Rr(g,'#5a3a22',x0+2,y-8,2,10);Rr(g,'#5a3a22',x1-4,y-8,2,10)}Rr(g,'#8a6a42',x0+2,y0+5,1.2,y1-y0-6);Rr(g,'#8a6a42',x1-3,y0+5,1.2,y1-y0-6);for(let x=x0+2;x<=x1-2;x+=8)Rr(g,'#5a3a22',x,y1-10,2,10);Rr(g,'#8a6a42',x0+2,y1-7,x1-x0-4,1.2);Rr(g,'#8a6a42',x0+2,y1-3,x1-x0-4,1.2)}
function drawCoop(g,x,y){Rr(g,'rgba(0,0,0,.25)',x-1,y-1,22,3);Rr(g,'#c8a070',x,y-12,20,12);for(let i=0;i<20;i+=3)Rr(g,'#a8804a',x+i,y-12,.7,12);for(let r=0;r<5;r++)Rr(g,'#8a5a2a',x-1+r,y-17+r,22-r*2,1.2);Rr(g,'#2a1a10',x+8,y-7,5,7);Rr(g,'#8a6a42',x+10,y-1,2,4);
 for(let i=0;i<3;i++){const cx=x+3+i*7+Math.sin(frame/20+i)*2,cy=y+4+(i%2)*2;Rr(g,i?'#f4f0e4':'#c8602a',cx,cy-3,4,3);Rr(g,'#e83a2a',cx+3,cy-4,1,1);Rr(g,'#e0a431',cx+4,cy-2.6,1,.8)}}
function drawWell(g,x,y){Rr(g,'rgba(0,0,0,.25)',x-1,y-1,16,3);Rr(g,'#8a8478',x,y-8,14,8);for(let i=0;i<14;i+=3.5)Rr(g,'#6a645a',x+i,y-8,.6,8);Rr(g,'#2a3a4a',x+2,y-9,10,2);Rr(g,'#5a3a22',x,y-20,2,12);Rr(g,'#5a3a22',x+12,y-20,2,12);for(let r=0;r<4;r++)Rr(g,'#8a5a2a',x-2+r,y-24+r,18-r*2,1.2);Rr(g,'#6a4428',x+2,y-17,10,1.2);Rr(g,'#7a5a32',x+6,y-16,2,4)}
function drawShed(g,x,y){Rr(g,'rgba(0,0,0,.25)',x-1,y-1,30,3);wallBoards(g,x,y-16,28,16,'#9a7048');roofMetal(g,x,y-26,28,10,'#9aa3ab');Rr(g,'#3a2414',x+9,y-12,10,12);for(let i=0;i<4;i++)Rr(g,'#d8b04a',x+10+i*2.2,y-6,2,6)}
function drawFruit(g,x,y,c){Rr(g,'rgba(0,0,0,.2)',x-6,y-1,12,3);Rr(g,'#5a3a22',x-1,y-10,2,10);blob(g,'#3a8a3a',x,y-15,14,11);blob(g,'#4aa04a',x-1,y-17,9,6);for(let i=0;i<5;i++)Rr(g,c,x-5+hs(i,x)*10,y-19+hs(x,i)*8,1.6,1.6)}
function drawCart(g,x,y,tr){if(tr){Rr(g,'rgba(0,0,0,.25)',x-1,y-1,24,3);Rr(g,'#c83a2a',x+4,y-11,14,6);Rr(g,'#c83a2a',x+12,y-17,6,6);Rr(g,'#9ad0e0',x+13,y-16,4,3);Rr(g,'#222',x,y-8,9,8);Rr(g,'#555',x+3,y-5,3,3);Rr(g,'#222',x+16,y-5,5,5);Rr(g,'#555',x+17.5,y-3.5,2,2);Rr(g,'#333',x+14,y-22,1,6);return}
 Rr(g,'rgba(0,0,0,.25)',x-1,y-1,24,3);Rr(g,'#8a6a42',x+2,y-9,18,5);for(let i=0;i<18;i+=3)Rr(g,'#6a4a2a',x+2+i,y-9,.6,5);Rr(g,'#5a3a22',x+20,y-6,8,1.2);Rr(g,'#3a2414',x+6,y-8,8,8);Rr(g,'#8a6a42',x+7,y-7,6,6);Rr(g,'#3a2414',x+9.5,y-4.5,1,1)}
function drawHives(g,x,y,n){for(let i=0;i<n;i++){const hx=x+(i%3)*9,hy=y+Math.floor(i/3)*8;Rr(g,'rgba(0,0,0,.2)',hx,hy-1,8,2);Rr(g,'#5a3a22',hx+1,hy-2,1,2);Rr(g,'#5a3a22',hx+6,hy-2,1,2);Rr(g,'#f0d070',hx,hy-9,8,7);Rr(g,'#d8b050',hx,hy-6,8,.6);Rr(g,'#e8e0d0',hx-.5,hy-10,9,1.4)}
 for(let i=0;i<4;i++){const t=frame*.05+i*1.7;Rr(g,'#2a2a2a',x+8+Math.cos(t)*12,y-8+Math.sin(t*1.3)*6,1,1)}}
function hsItems(H,L){const m=hm(H.id),st=m.st,ox=H.x*TS,oy=H.y*TS;const hb={id:'hs_'+H.id,x:H.x,y:H.y,w:H.hw,h:H.hh,door:H.x+Math.floor(H.hw/2),hs:H};
 L.push([(H.y+H.hh)*TS,10,{draw:g=>bCached(g,hb)}]);
 const P=hsPlots(H);while(m.pl.length<P.length)m.pl.push(ri(0,6));L.push([P.length?P[0][1]*TS+1:oy,10,{draw:g=>{P.forEach((p,i)=>drawPlot(g,p[0]*TS,p[1]*TS,m.pl[i],(CROPOF[H.id]||['milho'])[i%2]))}}]);
 L.push([(H.y+H.hh-1)*TS+14,10,{draw:g=>drawWell(g,(H.x-3)*TS+2,(H.y+H.hh)*TS-2)}]);
 if(st>=1)L.push([(H.y+H.hh+1)*TS+12,10,{draw:g=>drawCoop(g,(H.x+H.hw+1)*TS,(H.y+H.hh+1)*TS+10)}]);
 if(st>=2){const p=hsPen(H);L.push([p.y0*TS+12,10,{draw:g=>drawPen(g,H)}]);L.push([(p.y0+p.h)*TS,10,{draw:g=>drawPenSides(g,H)}]);for(const a of hsAnimals(H))L.push([a.y+2,10,{draw:g=>{if(a.goat)drawGoat(g,a);else drawCow(g,a,a.x-8.5,a.y-10,a.dir,a.f,1)}}])}
 if(st>=3){L.push([(H.y+2)*TS+14,10,{draw:g=>drawShed(g,(H.x+H.hw+5)*TS+4,(H.y+3)*TS)}]);L.push([(H.y-1)*TS+14,10,{draw:g=>{drawFruit(g,(H.x+1)*TS,(H.y-.2)*TS,'#f0a020');drawFruit(g,(H.x+H.hw-1)*TS,(H.y-.4)*TS,'#e84a3a')}}])}
 if(st>=4)L.push([(H.y+H.hh+2)*TS,10,{draw:g=>drawCart(g,(H.x+H.hw+5)*TS,(H.y+H.hh+2)*TS,H.id==='ze')}]);
 if(H.id==='lino')L.push([(H.y+3)*TS,10,{draw:g=>drawHives(g,(H.x-3)*TS,(H.y+1)*TS,3+st)}]);
}
// casas dos sítios (desenho realista por estilo)
function hsArt(style){return(g,b,x,y,w,h,dx,v)=>{const H=b.hs,rh=h-32;shadowB(g,x,y,w,h);
 if(v>=4){const ex=x+w;if(style==='pedra')wallStone(g,ex,y+h-24,20,24);else if(style==='adobe')wallAdobe(g,ex,y+h-24,20,24);else wallCal(g,ex,y+h-24,20,24,'#f0ead8','#a87a48');if(style==='adobe')roofThatch(g,ex-2,y+h-36,22,12);else roofClay(g,ex-2,y+h-36,22,12,'#b05a30');winColonial(g,ex+4,y+h-18,'#f0ead8','#5a7a3a')}
 if(style==='palafita'){for(let i=0;i<w;i+=10)Rr(g,'#5a3a22',x+i+2,y+h-4,3,6);wallBoards(g,x,y+rh,w,h-rh-4,'#9a7a52');roofMetal(g,x,y,w,rh,'#8a949c');Rr(g,'#7a5a32',x-4,y+h-5,w+8,3);for(let i=0;i<w+8;i+=4)Rr(g,'#5a3a22',x-4+i,y+h-5,.6,3);for(let i=0;i<4;i++)Rr(g,'#7a5a32',x+dx+3,y+h-2+i*1.5,10,1)}
 else if(style==='pedra'){wallStone(g,x,y+rh,w,h-rh);roofShingle(g,x,y,w,rh,'#4a3a2a');chimney(g,x+w-12,y+1,'#7a7468')}
 else if(style==='adobe'){wallAdobe(g,x,y+rh,w,h-rh);roofThatch(g,x,y,w,rh)}
 else if(style==='tijolo'){wallBrick(g,x,y+rh,w,h-rh,'#b0583a');roofClay(g,x,y,w,rh,'#a84a2a',true);chimney(g,x+w-14,y+2,'#8a4a2a')}
 else{wallCal(g,x,y+rh,w,h-rh,'#f0ead8','#c86a3a');roofClay(g,x,y,w,rh,'#b5532e',true);chimney(g,x+8,y+2,'#c8b8a0')}
 for(let wx=8;wx<w-14;wx+=24)if(Math.abs(wx-dx)>20)winColonial(g,x+wx,y+h-30,style==='pedra'?'#6a5a3a':'#f0ead8',style==='adobe'?'#4a6a3a':style==='palafita'?'#c86a2a':'#3a5a8a');
 doorWood(g,x+dx,y+h-24,style==='adobe'?'#4a6a3a':'#6a4a2a');
 if(v>=1){Rr(g,'#5a3a22',x-2,y+h-30,2,30);Rr(g,'#5a3a22',x+w,y+h-30,2,30);bench(g,x+2,y+h)}
 if(v>=2)plantPot(g,x+dx+18,y+h,'#e84a5a');
 if(v>=3){Rr(g,'#8a8a92',x+w-6,y-14,10,10);Rr(g,'#6a6a72',x+w-6,y-14,10,1.4);Rr(g,'#5a3a22',x+w-5,y-4,1.5,8);Rr(g,'#5a3a22',x+w+2,y-4,1.5,8)}
 const sn={benedita:'SITIO BENEDITA',ze:'SITIO DO ZE',rosa:'SITIO SILVA',bene:'RANCHO DO BENE',lino:'CABANA DO LINO'}[H.id];signBoard(g,x+w/2,y+rh-9,sn,'#6a4a2a','#f4e8c8','#2a1a10')}}
for(const H of HMD)BART['hs_'+H.id]=hsArt(H.style);
const _bVarL2=bVar;bVar=function(b){if(b.id&&b.id.startsWith('hs_'))return hm(b.id.slice(3)).st;return _bVarL2(b)};
// feirinha do sítio
const HSELL={benedita:['mandioca','milho','ovo','leitecabra','rapadura'],ze:['milho','soja','ovo','queijo'],rosa:['tomate','milho','ovo','queijo'],bene:['milho','ovo','queijo','charque'],lino:['mel','leitecabra','trigo','tomate']};
function hsModal(id){const H=HSD(id),m=hm(id),o=npcById(id);reModal=()=>hsModal(id);
 const here=o&&!o.hid&&Math.hypot(o.x-P.x,o.y-P.y)<200;
 let h='<h3>🏡 '+H.n+'</h3><div class="dim">'+['Começando a vida: casinha e uma hortinha.','Já tem galinheiro e horta maior.','Tem curral com animais.','Paiol, pomar e caixa d’água.','Sítio completo e caprichado!'][m.st]+(m.st<4?' Cresce com o tempo.':'')+'</div>';
 if(!here)h+='<div class="card dim">'+(o?o.n:'O dono')+' não está em casa agora ('+({home:'descansando',plots:'na roça',pen:'no curral',fish:'pescando',patrol:'andando por aí',work:'trabalhando na vila',idle:'na vila',mass:'na missa'}[o&&o.task]||'fora')+'). Volte mais tarde.</div>';
 else{h+='<div class="card"><i>“'+pick(o.lines)+'”</i></div><div class="sec">🧺 FEIRINHA (produção do sítio)</div>';
  h+=(HSELL[id]||[]).map(k=>{const q=m.stock[k]||0,p=Math.round(ITEMS[k].p*1.15);return '<div class="card" style="padding:5px 8px"><div class="row"><b>'+ITEMS[k].ic+' '+ITEMS[k].n+'</b><span class="gold">'+R$(p)+'</span></div><div class="row"><span class="dim">'+q+' disponível</span>'+(q?'<button class="b" data-act="hsbuy" data-v="'+id+':'+k+'">Comprar</button>':'')+'</div></div>'}).join('');
  if(id==='benedita')h+='<div class="card"><div class="row"><b>🌿 Garrafada de ervas</b><span class="gold">'+R$(120)+'</span></div><div class="dim">Ela prepara na hora: cura 60 de vida e cuida dos ferimentos dos seus cães.</div><div class="btns"><button class="b gold" data-act="hsherb">Tomar</button></div></div>'}
 showModal(h+'<div class="btns"><button class="b" data-act="hstalk" data-v="'+id+'">💬 Conversar</button><button class="b gray" data-act="close">Tchau</button></div>')}
Object.assign(ACT,{
 hsbuy(e){const[id,k]=e.v.split(':'),m=hm(id),p=Math.round(ITEMS[k].p*1.15);if(!(m.stock[k]>0))return;if(S.money<p)return toast('Dinheiro insuficiente','bad');if(!addItem(k,1))return toast('Mochila cheia','bad');cash(-p,'Feirinha');m.stock[k]--;addFr(id,1)},
 hsherb(){if(S.money<120)return toast('Dinheiro insuficiente','bad');cash(-120,'Garrafada');P.hp=Math.min(100,P.hp+60);S.dogs.forEach(d=>{if(d.wounds)d.wounds=Math.max(0,d.wounds-1);d.hp=Math.min(100,(d.hp||100)+20)});toast('🌿 Que gosto amargo… mas você já se sente melhor!','good');addFr('benedita',3)},
 hstalk(e){hideModal();npcModal(e.v)}
});
// falas mudam conforme a vida evolui
const _npcL2=npcModal;npcModal=function(id){const n=npcById(id);if(n&&CROPOF[id]){const m=hm(id),ex=[];if(m.st>=2&&ANIOF[id])ex.push(ANIOF[id]==='cabra'?'As cabritas estão dando bastante leite.':'Minhas vacas estão gordinhas esse mês.');if((m.pl||[]).some((a,i)=>a>=CROPS[CROPOF[id][i%2]].d))ex.push('A '+CROPS[CROPOF[id][0]].n.toLowerCase()+' tá no ponto de colher!');if(m.st>=1&&m.next-S.day<6&&m.st<4)ex.push('Tô juntando um dinheirinho pra '+STNEWS[id][m.st+1].replace(/^(fez|construiu|comprou|ergueu|montou|cercou|puxou|ampliou|aumentou|colocou|pôs)/,'fazer')+'.');n._base=n._base||n.lines;n.lines=n._base.concat(ex)}
 const tk=n&&n.task;_npcL2(id);if(n&&tk){const t={home:'',work:'',plots:'(trabalhando na roça)',pen:'(cuidando dos animais)',fish:'(pescando)',patrol:'(fazendo a ronda)',play:'(brincando)',idle:'',mass:'(na missa)',festa:'(curtindo a festa)'}[tk];if(t){const r=document.querySelector('#mbox .row .dim');if(r&&!r.dataset.t){r.dataset.t=1;r.textContent+=' '+t}}}};
GUIDE.push({lv:1,ic:'🏡',t:'Moradores e sítios',h:'Cada morador tem rotina: acorda, trabalha, almoça, vai à missa no domingo, passeia na praça e dorme em casa. Novos vizinhos vivem afastados: Dona Benedita (cerrado, sudoeste), Família Silva (beira da mata, norte da vila), Seu Bené (Pantanal) e Seu Lino (montanha). O Zé do Campo mora num sítio ao sul. Os sítios crescem com o tempo: horta, galinheiro, curral com animais, paiol, pomar. Visite a feirinha deles para comprar o que produzem.'});
