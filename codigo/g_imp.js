// ===== O Gringo: importador de gado escondido no fim da estrada do norte, com entrega de caminhão até a fazenda =====
const GRG={x0:181,y0:2,x1:195,y1:11,hx:183,hy:3,door:185,tx:188};
if(!BLD.some(b=>b.id==='gringo'))BLD.push({id:'gringo',x:GRG.hx,y:GRG.hy,w:5,h:4,door:GRG.door,roof:'#4a5a3a',wall:'#d8c8a0',label:'Rancho do Gringo (importação de gado)',sign:'IMPORT'});
CURT.gringo='#c8a060';
function gringoCarve(){
 for(let y=GRG.y0;y<=GRG.y1+1;y++)for(let x=GRG.x0;x<=GRG.x1;x++){const i=ti(x,y);SOL[i]=0;FEN[i]=0;G[i]=0}
 for(let y=GRG.y1-2;y<=13;y++){G[ti(GRG.tx,y)]=3;G[ti(GRG.tx+1,y)]=3}
 for(let x=GRG.x0+2;x<=GRG.x1-1;x++){G[ti(x,GRG.y1-2)]=3;G[ti(x,GRG.y1-1)]=3}
 const inA=t=>{const x=Math.floor(t.x/TS),y=Math.floor(t.y/TS);return x>=GRG.x0-1&&x<=GRG.x1+1&&y>=GRG.y0&&y<=13};
 for(let i=TREES.length-1;i>=0;i--)if(inA(TREES[i]))TREES.splice(i,1);
 for(let i=BUSH.length-1;i>=0;i--)if(inA(BUSH[i]))BUSH.splice(i,1);
 if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--)if(inA({x:BOULD[i].x*TS,y:BOULD[i].y*TS}))BOULD.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(inA(DECO[i]))DECO.splice(i,1);
 const b=BLD.find(q=>q.id==='gringo');for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)SOL[ti(x,y)]=1;
 // curralzinho de quarentena
 for(let x=190;x<=194;x++){FEN[ti(x,3)]=1;FEN[ti(x,7)]=1}for(let y=3;y<=7;y++){FEN[ti(190,y)]=1;FEN[ti(194,y)]=1}
}
const _rfcImp=rfCarve;rfCarve=function(){_rfcImp();gringoCarve()};
// ---------- catálogo
const IMPS=[
 {br:'wagyu',o:'Austrália',fl:'🇦🇺'},{br:'angus',o:'Uruguai',fl:'🇺🇾'},{br:'hereford',o:'Argentina',fl:'🇦🇷'},{br:'senepol',o:'Ilhas Virgens (EUA)',fl:'🇻🇮'},
 {br:'brangus',o:'Texas (EUA)',fl:'🇺🇸'},{br:'simental',o:'Alemanha',fl:'🇩🇪'},{br:'charoles',o:'França',fl:'🇫🇷'},{br:'brahman',o:'Texas (EUA)',fl:'🇺🇸'},
 {br:'nelorepo',o:'Uberaba (MG), leilão de elite',fl:'🇧🇷'},{br:'gir',o:'Minas Gerais, central de elite',fl:'🇧🇷'}
];
const IMPFRETE=3500;
function ensureImp(){if(!S.imp)S.imp={met:0,ord:null,cat:null,cm:-1,n:0};return S.imp}
function impCat(){const I=ensureImp(),m=Math.floor(S.day/30);if(I.cm===m&&I.cat)return I.cat;I.cm=m;
 const L=IMPS.slice().sort(()=>Math.random()-.5).slice(0,6);if(lineBr()&&IMPS.some(x=>x.br===lineBr())&&!L.some(x=>x.br===lineBr()))L[0]=IMPS.find(x=>x.br===lineBr());
 I.cat=L.map((x,k)=>{const sex=k%2?'M':'F',age=sex==='M'?ri(640,760):ri(480,600),a=mk(x.br,sex,age,ri(88,97));a.w=Math.round(wmax(a)*(sex==='M'?.86:.8));return{br:x.br,o:x.o,fl:x.fl,a,price:Math.round((valueOf(a,'mkt')*1.55+IMPFRETE)/100)*100,sold:0}});return I.cat}
const impDisc=br=>lineBr()===br&&S.line.d<=S.day?.9:1;
function gringoModal(msg){const I=ensureImp();reModal=()=>gringoModal();
 if(!I.met){I.met=1;gainXP(30,'descoberta');if(typeof addTrof==='function')try{addTrof('gringo','Achou o Gringo')}catch(e){}}
 const O=I.ord,cat=impCat();let h='<h3>🌎 Rancho do Gringo</h3><div class="card"><i>“Hallo, amigo! Me chamam de Gringo, mas o nome é Klaus. Trago gado de fora: Austrália, Uruguai, Estados Unidos, Europa. Tudo com quarentena, exame e papel do Ministério. Você escolhe aqui, eu entrego no seu pasto.”</i></div>'+(msg?'<div class="card grn">'+msg+'</div>':'');
 if(O){const left=O.day-S.day;h+='<div class="card" style="border-color:#c8a040"><b>🚚 Sua encomenda</b><div class="dim">'+O.a.length+' animal(is): '+O.a.map(a=>BREEDS[a.breed].n+(a.sex==='F'?' ♀':' ♂')).join(', ')+'</div><div>'+(O.st==='road'?'O caminhão está na estrada agora!':left>0?'Em quarentena. Sai daqui em '+left+' dia(s), às 7h.':'Sai hoje às 7h.')+'</div></div>'}
 h+='<div class="sec">CATÁLOGO DO MÊS · '+(O?'espere a entrega para encomendar de novo':'pague agora, entrega em 5 a 9 dias')+'</div>';
 h+=cat.map((c,k)=>{const a=c.a,B=BREEDS[a.breed],pr=Math.round(c.price*impDisc(a.breed));return '<div class="card'+(c.sold?' lock':'')+'"><div style="display:flex;gap:8px;align-items:center"><img src="'+breedImg(a.breed)+'" style="width:72px;height:48px;image-rendering:pixelated;background:#7aa84a;border-radius:6px;flex:none"><div style="flex:1"><div class="row"><b>'+c.fl+' '+B.n+(a.sex==='F'?' ♀ novilha':' ♂ touro')+'</b><span class="gold">'+R$(pr)+'</span></div><div class="dim" style="font-size:12px">'+c.o+' · '+ageTxt(a)+' · '+Math.round(a.w)+' kg · genética '+a.gen+' '+stars(a.gen)+'</div><div class="dim" style="font-size:12px">'+BTR[a.breed].f+(impDisc(a.breed)<1?' · <span class="grn">−10% (sua linha)</span>':'')+'</div></div></div>'
  +(c.sold?'<div class="dim">Já encomendado</div>':'<div class="btns"><button class="b gold" data-act="impadd" data-v="'+k+'"'+(O&&O.st!=='wait'?' disabled':'')+'>'+(O?'Juntar na encomenda':'Encomendar')+'</button></div>')+'</div>'}).join('');
 h+='<div class="dim" style="font-size:12px">Preço inclui frete, quarentena e exames ('+R$(IMPFRETE)+' por cabeça). Animais importados chegam com genética alta: os bezerros nascem melhores.</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>';
 showModal(h)}
Object.assign(ACT,{
 impadd(e){const I=ensureImp(),c=impCat()[+e.v];if(!c||c.sold)return;if(I.ord&&I.ord.st!=='wait')return toast('O caminhão já saiu. Espere a entrega.','bad');if(I.ord&&I.ord.a.length>=8)return toast('O caminhão leva no máximo 8 animais','bad');
  if(S.herd.length+(I.ord?I.ord.a.length:0)+1>cap()*1.3)return toast('Seu pasto não aguenta mais animais. Amplie a fazenda antes.','bad');
  const pr=Math.round(c.price*impDisc(c.a.breed));if(S.money<pr)return toast('Dinheiro insuficiente','bad');cash(-pr,'Importação: '+BREEDS[c.a.breed].n);c.sold=1;S.stats.bought=(S.stats.bought||0)+1;
  if(!I.ord)I.ord={a:[],day:S.day+ri(5,9),st:'wait'};I.ord.a.push(c.a);c.a.name=pick(NAMES);gainXP(15,'importação');S.rep=Math.min(100,(S.rep||0)+.5);
  gringoModal('✅ '+BREEDS[c.a.breed].n+' encomendado! Chega no seu pasto no dia '+(I.ord.day-269)+'.')}
});
const _ebImp=enterBld;enterBld=function(id){if(id==='gringo')return gringoModal();return _ebImp(id)};
// ---------- caminhão: sai do rancho e vai pela estrada até a fazenda
const IROUTE=[[188.5,9.5],[188.5,13.6],[196.6,13.6],[196.6,48.6],[13,48.6]];
let IMPT=null;
function impStart(O){O.st='road';IMPT={i:0,x:IROUTE[0][0]*TS,y:IROUTE[0][1]*TS,dir:0,st:'go',t:0,cows:[],O};toast('🚚 O caminhão do Gringo saiu do rancho com seus '+O.a.length+' animais. A seta mostra onde ele está.','good')}
function impArrive(O,quiet){const I=ensureImp();O.a.forEach(a=>{a.born=0;addA(a)});I.ord=null;I.n++;S.seenB=S.seenB||{};O.a.forEach(a=>S.seenB[a.breed]=1);if(!quiet)toast('🐄 Seus animais importados estão no pasto!','good');else toast('🐄 Enquanto você estava fora, o Gringo entregou '+O.a.length+' animais importados no pasto.','good')}
function stepImp(dt){const I=S&&S.imp;if(!I||!I.ord)return;const O=I.ord;
 if(O.st==='wait'&&(S.day>O.day||(S.day===O.day&&dayHour()>=7))){if(S.day>O.day+1){impArrive(O,1);return}impStart(O)}
 if(O.st==='road'&&!IMPT){impArrive(O,1);return}
 if(!IMPT)return;const T=IMPT,mult=Math.max(1,Math.min(speed||1,20)),sp=58*mult;
 if(T.st==='go'){const w=IROUTE[T.i+1];if(!w){T.st='unload';T.t=0;return}const tx=w[0]*TS,ty=w[1]*TS,dx=tx-T.x,dy=ty-T.y,d=Math.hypot(dx,dy);
  if(d<sp*dt+1){T.x=tx;T.y=ty;T.i++}else{T.x+=dx/d*sp*dt;T.y+=dy/d*sp*dt}T.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1)}
 else if(T.st==='unload'){T.t+=dt*mult;const n=T.O.a.length,k=Math.floor(T.t/1.2);
  while(T.cows.length<Math.min(n,k)){const a=T.O.a[T.cows.length];T.cows.push({a,x:T.x+30,y:T.y+4,p:0,dir:1,ph:0})}
  for(const c of T.cows){if(c.p>=3)continue;const W=[[11.5*TS,49.4*TS],[9.6*TS,56.6*TS],[15*TS+rnd(-20,20),56*TS+rnd(-20,20)]][c.p],dx=W[0]-c.x,dy=W[1]-c.y,d=Math.hypot(dx,dy),s=26*mult;c.ph+=dt*4;c.dir=dx>=0?1:-1;
   if(d<s*dt+1){c.p++;if(c.p>=3){c.a.born=0;addA(c.a);const s2=spriteOf(c.a);s2.x=c.x;s2.y=c.y}}else{c.x+=dx/d*s*dt;c.y+=dy/d*s*dt}}
  if(T.cows.length>=n&&T.cows.every(c=>c.p>=3)){const I2=ensureImp();I2.ord=null;I2.n++;O.a.forEach(a=>S.seenB[a.breed]=1);toast('🐄 '+n+' animais importados descarregados no pasto! “Bom negócio, amigo!”','good');gainXP(30,'importação');T.st='back';T.i=IROUTE.length-1}}
 else if(T.st==='back'){const w=IROUTE[T.i-1];if(!w){IMPT=null;return}const tx=w[0]*TS,ty=w[1]*TS,dx=tx-T.x,dy=ty-T.y,d=Math.hypot(dx,dy);if(d<sp*dt+1){T.x=tx;T.y=ty;T.i--}else{T.x+=dx/d*sp*dt;T.y+=dy/d*sp*dt}T.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1)}}
const _updImp=update;update=function(dt){_updImp(dt);if(!paused())try{stepImp(Math.min(dt,.1))}catch(e){console.error(e)}};
// ---------- desenho: rancho, gringo, curral, caminhão e seta
const GNPC={x:187*TS+8,y:9*TS+4};
const _evoImp=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoImp(L,x0,x1,y0,y1);if(inRoom())return;
 if(GRG.x1*TS>x0-60&&GRG.x0*TS<x1+60&&GRG.y0*TS<y1+60){
  const I=S.imp,away=IMPT&&IMPT.st!=='go'?0:IMPT?1:0;
  npcAt(L,GNPC.x,GNPC.y,{shirt:'#e8e0c8',hair:'#e8d080',hat:'#6a5a3a',pants:'#3a4a5a',beard:1,skin:'#f0c8a8',dir:0});
  // curral de quarentena com animais
  const cat=I&&I.cat||[];[0,1,2].forEach(k=>{const c=cat[k];if(!c||c.sold)return;const x=(191+k*1.2)*TS,y=(4.6+k%2*1.4)*TS;L.push([y+12,10,{draw:g=>drawCow(g,c.a,x,y,k%2?1:-1,0)}])});
  if(!IMPT){const x=192*TS,y=10.2*TS;L.push([y,10,{draw:g=>drawBoiadeiro(g,x,y,2,'#2a5a8a',0)}])}
  // placa discreta na estrada
  L.push([13*TS,10,{draw:g=>{const x=GRG.tx*TS-14,y=12.2*TS;Rr(g,'#5a3a22',x+10,y-10,2,12);Rr(g,'#c8b080',x,y-18,26,9);ptext(g,'K.',x+3,y-16,'#3a2a1a');Rr(g,'#3a2a1a',x+14,y-15,9,1.2);Rr(g,'#3a2a1a',x+20,y-17,1.2,5)}}])}
 if(IMPT){const T=IMPT;if(T.x>x0-120&&T.x<x1+120&&T.y>y0-80&&T.y<y1+80)L.push([T.y,10,{draw:g=>{drawBoiadeiro(g,T.x,T.y,T.dir,'#2a5a8a',1)}}]);
  for(const c of T.cows)if(c.p<3)L.push([c.y,10,{draw:g=>drawCow(g,c.a,c.x,c.y,c.dir,((c.ph*2)|0)%2)}])}
};
const _dpImp=drawPart;drawPart=function(g){_dpImp(g);if(!IMPT||inRoom())return;const T=IMPT;if(T.x>=CX&&T.x<=CX+VW&&T.y>=CY&&T.y<=CY+VH)return;
 const ax=clamp(T.x,CX+12,CX+VW-12),ay=clamp(T.y,CY+40,CY+VH-16),an=Math.atan2(T.y-ay,T.x-ax);Rr(g,'rgba(20,50,90,.85)',ax-8,ay-8,16,16);ptext(g,'🚚',ax-6,ay-6,'#fff');
 Rr(g,'#f0d060',ax+Math.cos(an)*9-1.5,ay+Math.sin(an)*9-1.5,3,3)};
const _ilImp=interactList;interactList=function(){const L=_ilImp();if(inRoom()||P.drive)return L;if(Math.hypot(P.x-GNPC.x,P.y-GNPC.y)<60)L.push({x:GNPC.x,y:GNPC.y,r:30,label:'🌎 Falar com o Gringo (importação)',fn:()=>gringoModal()});return L};
// boato no bar / na Casa Agro para achar o Gringo
const _hdImp=hookDay;hookDay=function(){_hdImp();const I=ensureImp();if(!I.met&&!I.hint&&(LV()>=6||(S.rep||0)>=15)&&Math.random()<.08){I.hint=1;toast('🍺 Ouviu no bar: “tem um gringo no fim da estrada do norte, depois da curva da mata, que traz gado de fora do país...”','good')}};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:6,ic:'🌎',t:'Gado importado',h:'Dizem que um gringo, no fim da estrada do norte, traz gado de raça de fora do país. Ele entrega de caminhão no seu pasto.'});
