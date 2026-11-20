// ===== Lavoura, galinheiro, caixa de venda =====
const FIELDR=[[28,41,32,43],[28,41,38,44],[28,38,43,44]];
const FULLF=[28,38,43,44];
const RUN={x0:49,y0:51,x1:57,y1:58};
const SHIPBOX={x:13*TS,y:44*TS};
const COOPCAP=[0,8,16,30];
const CMAP=new Map();
const fieldRect=()=>FIELDR[Math.min(2,S.up.lav||0)];
const inRect=(tx,ty,r)=>tx>=r[0]&&tx<=r[2]&&ty>=r[1]&&ty<=r[3];
function rebuildCMap(){CMAP.clear();S.crops.forEach(c=>CMAP.set(c.y*MW+c.x,c))}
const cropAt=(x,y)=>CMAP.get(y*MW+x);
function cropStage(c){return Math.min(3,Math.floor(c.age/CROPS[c.c].d*3.0001))}
function playerInField(){return inRect(Math.floor(P.x/TS),Math.floor((P.y-4)/TS),fieldRect())}
function tend(){
 const fr=fieldRect(),px=P.x,py=P.y-4;let pl=0,wa=0,ha=0,nos=0;
 for(let ty=fr[1];ty<=fr[3];ty++)for(let tx=fr[0];tx<=fr[2];tx++){
  const cx=tx*TS+8,cy=ty*TS+8;if(Math.hypot(cx-px,cy-py)>26)continue;
  const c=cropAt(tx,ty);
  if(c){
   if(cropStage(c)>=3){if(addItem(c.c,cropYield(c))){ha++;gainXP(CROPS[c.c].xp,'colheita');S.crops.splice(S.crops.indexOf(c),1);CMAP.delete(ty*MW+tx);S.tf.harvest=1}}
   else if(!c.w){c.w=1;wa++;S.tf.water=1}
  }else{
   const sd='seed_'+S.selSeed;
   if(hasItem(sd,1)&&CROPS[S.selSeed].lv<=LV()){takeItem(sd,1);const n={x:tx,y:ty,c:S.selSeed,age:0,w:0};S.crops.push(n);CMAP.set(ty*MW+tx,n);pl++;S.tf.plant=1}else nos=1;
  }
 }
 const parts=[];if(ha)parts.push('colheu '+ha);if(pl)parts.push('plantou '+pl);if(wa)parts.push('regou '+wa);
 if(parts.length)toast('🌱 '+parts.join(', '),'good');
 else toast(nos?'Sem sementes selecionadas. Compre na Casa Agro e escolha no Inventário.':'Nada a fazer aqui agora. Plantas regadas crescem de noite.');
}
function growCrops(){
 const rain=S.weather==='chuva';
 for(const c of S.crops){
  if(c.w||rain||S.up.irrig){if(cropStage(c)<3)c.age++}
  c.w=0;
 }
}
// ---- galinhas
const CH=[];
function chkBounds(){return{x0:RUN.x0*TS+4,x1:(RUN.x1+1)*TS-12,y0:RUN.y0*TS+8,y1:(RUN.y1+1)*TS-14}}
function syncCH(){
 const b=chkBounds();
 while(CH.length<S.chk.n)CH.push({x:rnd(b.x0,b.x1),y:rnd(b.y0,b.y1),dir:1,wait:rnd(0,3),tx:0,ty:0,go:0,k:Math.random()<.5});
 while(CH.length>S.chk.n)CH.pop();
}
function stepCH(dt){
 syncCH();const b=chkBounds();
 for(const c of CH){
  if(c.wait>0){c.wait-=dt;continue}
  if(!c.go){c.tx=rnd(b.x0,b.x1);c.ty=rnd(b.y0,b.y1);c.go=1}
  const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy);
  if(d<2){c.go=0;c.wait=rnd(1,5);continue}
  c.x+=dx/d*18*dt;c.y+=dy/d*18*dt;c.dir=dx>0?1:-1;
 }
}
function drawChicken(g,c){
 const x=c.x,y=c.y,d=c.dir,pk=c.wait>0&&((frame>>4)&1);
 const r=(col,dx,dy,w,h)=>Rr(g,col,d>0?x+dx:x-dx-w+1,y+dy,w,h);
 Rr(g,'rgba(0,0,0,.22)',x,y-1,7,2);
 const body=c.k?'#f4f0e4':'#b0652f';
 r(body,1,-5,5,4);r(shade(body,-30),0,-6,2,3);r(body,5,pk?-3:-7,2,pk?2:3);r('#d63a2a',5,pk?-4:-8,2,1);r('#e8b030',7,pk?-2:-6,1,1);r('#e8b030',2,-1,1,1);r('#e8b030',4,-1,1,1);
}
function drawFarmStatic(g){
 const fr=fieldRect(),F=FULLF;
 // área à venda
 if((S.up.lav||0)<2){Rr(g,'rgba(60,40,20,.25)',F[0]*TS,F[1]*TS,(F[2]-F[0]+1)*TS,(F[3]-F[1]+1)*TS);Rr(g,'#5a3a22',(F[2])*TS,F[1]*TS-2,2,12);Rr(g,'#e8dcc0',F[2]*TS-8,F[1]*TS-8,18,8);ptext(g,'VENDE',F[2]*TS-6,F[1]*TS-7,'#7a1f1f')}
 // solo
 Rr(g,'#6b4a2c',fr[0]*TS,fr[1]*TS,(fr[2]-fr[0]+1)*TS,(fr[3]-fr[1]+1)*TS);
 for(let ty=fr[1];ty<=fr[3];ty++){
  for(let tx=fr[0];tx<=fr[2];tx++){
   const c=cropAt(tx,ty),w=c&&(c.w||S.weather==='chuva'||S.up.irrig);
   drawSoil(g,tx,ty,w);
  }
 }
 for(let ty=fr[1];ty<=fr[3];ty++)for(let tx=fr[0];tx<=fr[2];tx++){const c=cropAt(tx,ty);if(c)drawCrop(g,c)}
 Rr(g,'#8a6a42',fr[0]*TS-3,(fr[3]+1)*TS,(fr[2]-fr[0]+1)*TS+6,2);
 // galinheiro e cercado
 const rx=RUN.x0*TS,ry=RUN.y0*TS,rw=(RUN.x1-RUN.x0+1)*TS,rh=(RUN.y1-RUN.y0+1)*TS;
 Rr(g,'rgba(180,150,80,.30)',rx,ry,rw,rh);
 for(let tx=RUN.x0;tx<=RUN.x1;tx++)for(const ty of [RUN.y0,RUN.y1]){if(ty===RUN.y1&&(tx===53||tx===54))continue;Rr(g,'#8a6a42',tx*TS,ty*TS+6,TS,2);Rr(g,'#8a6a42',tx*TS,ty*TS+10,TS,2);Rr(g,'#5a3a22',tx*TS+6,ty*TS+3,3,11)}
 for(let ty=RUN.y0;ty<=RUN.y1;ty++)for(const tx of [RUN.x0,RUN.x1]){Rr(g,'#8a6a42',tx*TS+6,ty*TS,2,TS);Rr(g,'#5a3a22',tx*TS+5,ty*TS+3,4,10)}
 const cx=51*TS,cy=52*TS;
 if(S.up.coop>0){
  Rr(g,'rgba(0,0,0,.25)',cx,cy+30,50,4);Rr(g,'#b8864a',cx,cy+10,48,22);Rr(g,'#8a5a2a',cx-3,cy+4,54,8);Rr(g,'#5a3a22',cx-3,cy+2,54,3);
  Rr(g,'#2a1a10',cx+18,cy+18,12,14);Rr(g,'#e8dcc0',cx+4,cy+16,8,6);
  if(S.chk.eggs>0){Rr(g,'#fff7e0',cx+36,cy+24,4,5);Rr(g,'#fff7e0',cx+41,cy+26,4,5)}
 }else{Rr(g,'#5a3a22',cx+16,cy+10,2,14);Rr(g,'#e8dcc0',cx+2,cy+6,32,10);ptext(g,'GALINHEIRO',cx-1,cy+8,'#7a1f1f')}
 // caixa de venda
 drawShipBox(g);
 // canil
 drawDogHouse(g);
 // fonte da praça
 drawFountain(g,120*TS,56*TS);
}
function drawCrop(g,c){
 const s=cropStage(c),k=CROPS[c.c],x=c.x*TS+8,y=c.y*TS+13;
 if(s===0){Rr(g,k.c[0],x-1,y-3,2,3);Rr(g,k.c[1],x-2,y-4,1,1);Rr(g,k.c[1],x+1,y-4,1,1)}
 else if(s===1){Rr(g,k.c[0],x-1,y-6,2,6);Rr(g,k.c[1],x-4,y-6,3,2);Rr(g,k.c[1],x+1,y-8,3,2)}
 else if(s===2){Rr(g,k.c[0],x-1,y-9,2,9);Rr(g,k.c[1],x-5,y-8,4,3);Rr(g,k.c[1],x+1,y-11,5,3);Rr(g,k.c[0],x-4,y-4,3,2)}
 else{Rr(g,k.c[0],x-1,y-11,2,11);Rr(g,k.c[1],x-5,y-9,4,3);Rr(g,k.c[1],x+1,y-12,5,3);Rr(g,k.c[2],x-3,y-8-((frame>>5)&1),3,4);Rr(g,k.c[2],x+1,y-6,3,4);Rr(g,'rgba(255,255,255,.7)',x-2,y-14-((frame>>4)&1),1,1)}
}
function dayFarm(){
 growCrops();
 const n=S.chk.n,cap=COOPCAP[S.up.coop];
 if(S.up.coop>0&&n>0){
  const need=n*.05,fed=S.feed>=need;if(fed)S.feed-=need;
  S.chk.eggs=Math.min(cap*3,S.chk.eggs+Math.round(n*(fed?.8:.3)*rnd(.8,1.2)));
 }
}
// ---- modais
function shipModal(){
 reModal=shipModal;
 const ks=Object.keys(S.inv).filter(k=>ITEMS[k]&&ITEMS[k].cat!=='seed'&&ITEMS[k].cat!=='use'),tot=ks.reduce((s,k)=>s+itemPrice(k)*S.inv[k],0);
 showModal('<h3>📦 Caixa de venda</h3>'+(ks.length?ks.map(k=>'<div class="card"><div class="row"><b>'+ITEMS[k].ic+' '+ITEMS[k].n+' x'+S.inv[k]+'</b><span class="gold">'+R$(itemPrice(k)*S.inv[k])+'</span></div><div class="btns"><button class="b" data-act="shipsell" data-v="'+k+'">Vender</button></div></div>').join('')+'<div class="btns"><button class="b gold" data-act="shipsell" data-v="all">Vender tudo '+R$(tot)+'</button></div>':'<div class="dim">Nada para vender. Colha, junte ovos e traga aqui. Preço segue o mercado ('+Math.round(priceMult()*100)+'%).</div>')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function coopModal(){
 reModal=coopModal;const cap=COOPCAP[S.up.coop];
 if(!S.up.coop)return showModal('<h3>🐔 Galinheiro</h3><p>Você ainda não tem um galinheiro. Construa na Casa Agro (Melhorias), a partir do nível 2. Galinhas dão ovos todo dia e ainda atraem raposas e ladrões...</p><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
 showModal('<h3>🐔 Galinheiro</h3><div class="card"><div>Galinhas: <b class="gold">'+S.chk.n+' / '+cap+'</b> · Ovos no ninho: <b class="gold">'+S.chk.eggs+'</b></div><div class="dim">Cada galinha come 50 g de ração por dia (do seu estoque). Sem ração, botam menos.</div><div class="btns"><button class="b gold" data-act="eggs">Coletar ovos</button><button class="b" data-act="hbuyc">Comprar galinha R$ 45</button><button class="b gray" data-act="hsellc">Vender galinha</button></div></div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function seedSection(){
 let h='<h3>🌱 Sementes (Nível '+LV()+')</h3>';
 Object.keys(CROPS).forEach(k=>{const c=CROPS[k],lock=c.lv>LV();
  h+='<div class="card '+(lock?'lock':'')+'"><div class="row"><b>'+c.ic+' '+c.n+'</b><span class="gold">semente '+R$(c.seed)+'</span></div><div class="dim">Cresce em '+c.d+' dias · vende ~'+R$(c.sell)+'</div>'+(lock?'<div class="red">Requer nível '+c.lv+'</div>':'<div class="btns"><button class="b" data-act="seedbuy" data-v="'+k+':5">+5</button><button class="b" data-act="seedbuy" data-v="'+k+':20">+20</button></div>')+'</div>'});
 return h;
}
Object.assign(ACT,{
 shipsell(e){
  const ks=e.v==='all'?Object.keys(S.inv).filter(k=>ITEMS[k]&&ITEMS[k].cat!=='seed'&&ITEMS[k].cat!=='use'):[e.v];let t=0;
  ks.forEach(k=>{if(!S.inv[k])return;const v=itemPrice(k)*S.inv[k];t+=v;takeItem(k,S.inv[k])});
  if(t){cash(Math.round(t),'Venda na caixa');gainXP(t/50,'venda');S.tf.sell=1;toast('💰 Vendido: '+R$(t),'good')}
 },
 eggs(){const n=S.chk.eggs;if(!n)return toast('Sem ovos por enquanto');const a=addItem('ovo',n);S.chk.eggs-=a;if(a)toast('🥚 '+a+' ovos coletados','good')},
 hbuyc(){if(S.chk.n>=COOPCAP[S.up.coop])return toast('Galinheiro lotado. Amplie na Casa Agro.','bad');if(S.money<45)return toast('Dinheiro insuficiente','bad');cash(-45,'Galinha');S.chk.n++;syncCH()},
 hsellc(){if(S.chk.n<=0)return;S.chk.n--;cash(38,'Venda de galinha');syncCH()},
 seedbuy(e){const [k,n]=e.v.split(':'),q=+n,c=CROPS[k];if(c.lv>LV())return toast('Nível insuficiente','bad');const cost=c.seed*q;if(S.money<cost)return toast('Dinheiro insuficiente','bad');const a=addItem('seed_'+k,q);if(a){cash(-c.seed*a,'Sementes');toast('Comprou '+a+' sementes','good')}},
 selseed(e){S.selSeed=e.v;toast('Semente selecionada: '+CROPS[e.v].n)}
});
