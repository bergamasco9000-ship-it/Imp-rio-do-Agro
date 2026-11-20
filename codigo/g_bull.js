// ===== Touros: baia própria no recinto, ficha de reprodutor, compra que já marca reprodutor; ofertas no gado dos rivais =====
const BPEN=[0,1,2].map(k=>({x0:110+k*3,y0:29,cx:(111.5+k*3)*TS,cy:30.6*TS}));
function bullCarve(){for(let y=28;y<=33;y++)for(let x=110;x<=119;x++){const i=ti(x,y);G[i]=y>=32?3:0;SOL[i]=0;FEN[i]=0}
 const inA=t=>{const x=Math.floor(t.x/TS),y=Math.floor(t.y/TS);return x>=109&&x<=120&&y>=27&&y<=34};
 for(let i=TREES.length-1;i>=0;i--)if(inA(TREES[i]))TREES.splice(i,1);for(let i=BUSH.length-1;i>=0;i--)if(inA(BUSH[i]))BUSH.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(inA(DECO[i]))DECO.splice(i,1);
 if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--)if(inA({x:BOULD[i].x*TS,y:BOULD[i].y*TS}))BOULD.splice(i,1);
 for(const p of BPEN)for(let y=29;y<=31;y++)for(let x=p.x0;x<p.x0+3;x++)SOL[ti(x,y)]=1;for(let x=110;x<=119;x++)SOL[ti(x,28)]=1;for(let y=28;y<=33;y++)SOL[ti(119,y)]=1;
 // touros das fazendas rivais
 if(typeof RFC!=='undefined')RFC.forEach(c=>{if(c.a&&c.a.sex==='M'&&c.a.age>=400)c.a.breeder=1})}
const _rfcBull=rfCarve;rfCarve=function(){_rfcBull();bullCarve()};
// ---------- touros à venda (3 por semana: comum, bom e elite)
function bullPrice(a){return Math.round(valueOf(a,'mkt')*(1+Math.pow(a.gen/100,2)*3)/500)*500}
function newBulls(){S.bulls=[[38,58],[60,78],[82,96]].map(([g0,g1],k)=>{const br=k===2&&Math.random()<.4?pick(['nelorepo','angus','senepol','brangus']):pickBreed();const a=mk(br,'M',ri(820,1300),ri(g0,g1));a.w=Math.round(wmax(a)*rnd(.9,.98));a.breeder=1;a.name=pick(EBN||NAMES);return{a,price:bullPrice(a),pen:k}})}
const _nlBull=newListings;newListings=function(){_nlBull();newBulls()};
function ensureBulls(){if(!S.bulls)newBulls();return S.bulls}
const herdF=()=>S.herd.filter(a=>a.sex==='F'&&a.age>=300);
const myBulls=()=>S.herd.filter(a=>a.sex==='M'&&a.breeder);
function bullModal(k){const x=ensureBulls().find(b=>b.pen===k);if(!x)return;const a=x.a,B=BREEDS[a.breed],T=BTR[a.breed]||{f:''},F=herdF(),mb=myBulls(),lock=S.rep<B.rep;reModal=null;
 const fg=F.length?F.reduce((s,c)=>s+c.gen,0)/F.length:50,cur=mb.length?Math.max(...mb.map(b=>b.gen)):null,now=cur!=null?(fg+cur)/2:null,nw=(fg+a.gen)/2;
 const cross=F.length&&F.filter(c=>c.breed!==a.breed).length/F.length>.5;
 showModal('<h3>🐂 Touro '+a.name+'</h3><div class="card"><div style="display:flex;gap:8px;align-items:center"><img src="'+breedImg(a.breed)+'" style="width:96px;height:64px;image-rendering:pixelated;background:#a8885a;border-radius:6px"><div><b>'+B.n+' · reprodutor</b><div class="gold" style="font-size:12px">'+T.f+'</div><div class="dim" style="font-size:12px">'+ageTxt(a)+' · '+Math.round(a.w)+' kg<br>Genética '+a.gen+' '+stars(a.gen)+'</div></div></div></div>'
 +'<div class="card"><b>🧬 O que ele faz no seu rebanho</b><div class="dim" style="font-size:12px">Cobre até 18 vacas. Os bezerros nascem com a média da genética da mãe e do pai.</div>'
 +'<div class="row"><span>Suas matrizes</span><span>'+F.length+' vacas · média '+Math.round(fg)+' '+stars(fg)+'</span></div>'
 +(now!=null?'<div class="row"><span>Bezerros com seu touro atual</span><span>'+Math.round(now)+' '+stars(now)+'</span></div>':'<div class="red" style="font-size:12px">Você está sem touro: nenhuma vaca emprenha!</div>')
 +'<div class="row"><span>Bezerros com '+a.name+'</span><b class="'+(now==null||nw>now?'grn':'red')+'">'+Math.round(nw+(cross?4:0))+' '+stars(nw+(cross?4:0))+'</b></div>'
 +(cross?'<div class="dim" style="font-size:12px">+4 de vigor híbrido: cruzamento com raça diferente das suas vacas.</div>':'')
 +(mb.length&&F.length>mb.length*18?'':mb.length&&F.length<=mb.length*18?'<div class="dim" style="font-size:12px">Seus '+mb.length+' touro(s) já dão conta das vacas. Este pode substituir um mais fraco.</div>':'')+'</div>'
 +'<div class="card"><div class="row"><span>Preço</span><b class="gold">'+R$(x.price)+'</b></div><div class="dim" style="font-size:12px">Touro vale mais que boi: você paga pela genética, não pela carne (no frigorífico ele valeria '+R$(Math.round(frigPrice(a)))+').</div></div>'
 +(lock?'<div class="card red">O criador só vende '+B.n+' para quem tem reputação '+B.rep+'.</div>':'')
 +'<div class="btns">'+(lock?'':'<button class="b gold" data-act="bullbuy" data-v="'+k+'">Comprar touro</button>')+'<button class="b gray" data-act="close">Voltar</button></div>')}
function bullSwapModal(nb){const mb=myBulls().filter(b=>b!==nb).sort((p,q)=>p.gen-q.gen);if(!mb.length){hideModal();return}
 showModal('<h3>🐂 '+nb.name+' já é seu reprodutor!</h3><div class="card">Quer vender algum touro antigo para o frigorífico?</div>'+mb.map(b=>'<div class="card"><div class="row"><b>'+b.name+' · '+BREEDS[b.breed].n+'</b><span>'+stars(b.gen)+'</span></div><div class="dim">'+ageTxt(b)+' · genética '+b.gen+'</div><div class="btns"><button class="b red" data-act="bullsell" data-v="'+b.id+'">Vender ('+R$(Math.round(frigPrice(b)))+')</button></div></div>').join('')+'<div class="btns"><button class="b gray" data-act="close">Manter todos</button></div>')}
Object.assign(ACT,{
 bullbuy(e){const B=ensureBulls(),x=B.find(b=>b.pen===+e.v);if(!x)return;const a=x.a;if(S.herd.length>=Math.floor(cap()*1.3))return toast('Pasto lotado: venda animais antes','bad');
  if(!buyAnimal(a,x.price,'Touro reprodutor'))return;a.breeder=true;S.bulls.splice(B.indexOf(x),1);toast('🐂 '+a.name+' comprado e já marcado como Reprodutor. Vai de caminhão para a sua fazenda.','good');gainXP(20,'touro');bullSwapModal(a)},
 bullsell(e){const b=S.herd.find(a=>a.id===+e.v);if(!b)return;b.breeder=false;const v=sellFrig(b);toast('💰 Vendeu '+b.name+' por '+R$(Math.round(v||0)),'good');const nb=myBulls()[0];if(nb&&myBulls().length>1)bullSwapModal(nb);else hideModal()}
});
// ---------- desenho da baia dos touros
const BCOW=new Map();
const _evoBull=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoBull(L,x0,x1,y0,y1);if(inRoom()||110*TS>x1+40||120*TS<x0-40||28*TS>y1+40||34*TS<y0-60)return;
 L.push([27*TS,10,{draw:g=>{for(const p of BPEN){Rr(g,'#9a7a4a',p.x0*TS,29*TS,3*TS,3*TS);for(let k=0;k<5;k++)Rr(g,'#8a6a3a',p.x0*TS+hs(k,p.x0)*40,29*TS+hs(p.x0,k)*40,3,1.4)}}}]);
 for(const p of BPEN){const X=p.x0*TS,Y=29*TS,W=3*TS,H=3*TS,rail=(x,y,w,h,ly)=>L.push([ly,10,{draw:g=>{Rr(g,'#3a2414',x,y,w,h);Rr(g,'#5a3a22',x,y,w,1.2)}}]);
  rail(X,Y-6,W,2.4,Y);rail(X,Y+H*.45-6,W,2.4,Y+H*.45);rail(X,Y+H-12,W,2.4,Y+H);rail(X,Y+H-6,W,2.4,Y+H);
  for(const xx of[X,X+W-2.6])L.push([Y+H,10,{draw:g=>{Rr(g,'#2a1a0e',xx,Y-10,3,H+8)}}])}
 L.push([28*TS,10,{draw:g=>{const x=113*TS,y=28*TS;Rr(g,'#3a2414',x+4,y-18,2,18);Rr(g,'#3a2414',x+52,y-18,2,18);Rr(g,'#1a1a1a',x,y-32,58,15);Rr(g,'#c8a040',x+1,y-31,56,1);ptext(g,'TOUROS',x+8,y-29,'#f0d060')}}]);
 for(const x of ensureBulls()){const p=BPEN[x.pen];if(!p)continue;let s=BCOW.get(x.a.id);if(!s){s={x:p.cx,y:p.cy,dir:1,t:rnd(2,6),tx:0,ty:0,mv:0,ph:0};BCOW.set(x.a.id,s)}
  s.t-=1/60;if(s.t<=0&&!s.mv){s.tx=p.cx+rnd(-10,10);s.ty=p.cy+rnd(-4,4);s.mv=1;s.t=rnd(4,9)}if(s.mv){const dx=s.tx-s.x,dy=s.ty-s.y,d=Math.hypot(dx,dy);if(d<1)s.mv=0;else{s.x+=dx/d*.08;s.y+=dy/d*.08;s.dir=dx>=0?1:-1;s.ph+=.05}}
  L.push([s.y,10,{draw:g=>drawCow(g,x.a,s.x,s.y,s.dir,s.mv?((s.ph*2)|0)%2:0)}]);
  L.push([32*TS+2,10,{draw:g=>{const n=Math.max(1,Math.round(x.a.gen/20)),tx=p.x0*TS+24-n*3;Rr(g,'#1a1a1a',tx-2,32*TS-9,n*6+2,6);for(let k=0;k<n;k++)Rr(g,'#f0d060',tx+k*6,32*TS-8,4,4)}}])}};
const _ilBull=interactList;interactList=function(){const L=_ilBull();if(inRoom()||P.drive)return L;
 if(Math.abs(P.x-114.5*TS)<7*TS&&Math.abs(P.y-32.5*TS)<3*TS)for(const x of ensureBulls()){const p=BPEN[x.pen];if(!p)continue;L.push({x:p.cx,y:32.2*TS,r:24,label:'🐂 Touro '+BREEDS[x.a.breed].n+' '+stars(x.a.gen)+' · '+R$(x.price),fn:()=>bullModal(x.pen)})}
 // ofertas no gado dos rivais
 if(typeof RFC!=='undefined'){const f=RF.find(z=>P.x>=z.x0*TS&&P.x<=(z.x1+1)*TS&&P.y>=z.y0*TS&&P.y<=(z.y1+1)*TS);if(f){const fi=RF.indexOf(f);for(const c of RFC){if(c.f!==fi||!c.a||c.horse)continue;if(Math.hypot(c.x+8-P.x,c.y+6-P.y)>40)continue;
   L.push({x:c.x+8,y:c.y+6,r:30,label:'🤝 Fazer oferta: '+BREEDS[c.a.breed].n+(c.a.sex==='M'?' ♂':' ♀')+' de '+rvName(f.i),fn:()=>rvOfferModal(f,c)})}}}
 return L};
// ---------- oferta no gado do vizinho
function rvAnimal(c){const a=c.a;if(!a.gen)a.gen=Math.round(35+hs(Math.abs(a.id)%977,13)*45+(a.breeder?10:0));if(!a.hp)a.hp=95;if(!a.name)a.name=pick(NAMES);a.w=Math.max(a.w||0,a.age>=600?wmax(a)*.9:a.w||300);return a}
function rvOfferModal(f,c){const a=rvAnimal(c),i=f.i,R=ensureRv(),rel=Math.round(R.rel[i]),val=Math.round(valueOf(a,'mkt')*(a.breeder?2.2:1)/100)*100,key=f.i+':'+a.id;
 S.rvoff=S.rvoff||{};const no=S.rvoff[key]===S.day;reModal=null;
 showModal('<h3>🤝 Oferta para '+rvName(i)+'</h3><div class="card"><div style="display:flex;gap:8px;align-items:center"><img src="'+breedImg(a.breed)+'" style="width:96px;height:64px;image-rendering:pixelated;background:#7aa84a;border-radius:6px"><div><b>'+a.name+' · '+BREEDS[a.breed].n+' '+(a.sex==='M'?(a.breeder?'♂ touro':'♂'):'♀')+'</b><div class="dim" style="font-size:12px">'+ageTxt(a)+' · '+Math.round(a.w)+' kg · genética '+a.gen+' '+stars(a.gen)+'</div></div></div></div>'
 +'<div class="card"><div class="row"><span>Valor de mercado</span><b class="gold">'+R$(val)+'</b></div><div class="row"><span>Relação com '+rvName(i)+'</span><span>'+rel+'/100 '+(rel>=60?'😊':rel>=30?'😐':'😠')+'</span></div><div class="dim" style="font-size:12px">'+(a.breeder?'É o touro dele: vai ser difícil ele largar. ':'')+'Oferta baixa pode ofender. Amigos vendem mais fácil.</div></div>'
 +(no?'<div class="card red">'+rvName(i)+' já disse que não quer mais conversar sobre esse animal hoje.</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>':
 '<div class="btns" style="flex-wrap:wrap">'+[.8,.9,1,1.1,1.25].map(m=>'<button class="b '+(m>=1?'gold':'')+'" data-act="rvoffer" data-v="'+f.i+'|'+a.id+'|'+m+'">'+Math.round(m*100)+'% · '+R$(Math.round(val*m/100)*100)+'</button>').join('')+'<button class="b gray" data-act="close">Desistir</button></div>'))}
ACT.rvoffer=function(e){const [fi,id,m]=String(e.v).split('|'),f=RF.find(z=>z.i===+fi),c=f&&RFC.find(q=>q.a&&q.a.id===+id);if(!f||!c)return hideModal();const a=rvAnimal(c),R=ensureRv(),rel=R.rel[f.i],val=Math.round(valueOf(a,'mkt')*(a.breeder?2.2:1)/100)*100,price=Math.round(val*+m/100)*100;
 if(S.money<price)return toast('Dinheiro insuficiente','bad');if(S.herd.length>=Math.floor(cap()*1.3))return toast('Seu pasto está lotado','bad');
 let p=clamp((+m-.78)*2.4,0,1)*(.55+rel/100*.9)*(a.breeder?.55:1)*(f.n<=6?.3:1);const ok=Math.random()<p;S.rvoff=S.rvoff||{};
 if(!ok){S.rvoff[f.i+':'+a.id]=S.day;if(+m<.88)R.rel[f.i]=Math.max(0,rel-3);hideModal();const L=RVP[f.i];return toast('🙅 '+rvName(f.i)+': '+(+m<.88?'“Tá me achando com cara de bobo? Por esse preço, nem pensar.”':a.breeder?'“Esse touro é o xodó da fazenda. Não vendo.”':'“Hmm... não, vou ficar com ela por enquanto.”'),'bad')}
 cash(-price,'Compra de '+rvName(f.i));const i2=RFC.indexOf(c);RFC.splice(i2,1);f.n=Math.max(0,f.n-1);rvMoney(f.i,price*.2);R.rel[f.i]=Math.min(100,rel+(+m>=1.1?3:1));
 const na=mk(a.breed,a.sex,a.age,a.gen);na.gen=a.gen;na.w=Math.round(a.w);na.name=a.name;na.breeder=a.breeder&&a.sex==='M';addA(na);S.stats.bought=(S.stats.bought||0)+1;
 rvLog(f.i,'Vendeu '+(a.sex==='F'?'uma':'um')+' '+BREEDS[a.breed].n+' para você por '+R$(price)+'.');hideModal();toast('🤝 Negócio fechado! '+rvName(f.i)+' manda o peão levar '+na.name+' até a sua fazenda. ('+R$(price)+')','good');gainXP(15,'negócio')};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:2,ic:'🐂',t:'Touros e ofertas',h:'Touros ficam na baia própria ao lado do recinto do leilão. A ficha mostra quanto ele melhora seus bezerros, e ao comprar ele já vira Reprodutor. Nas fazendas rivais, chegue perto de um animal para fazer uma oferta.'});
