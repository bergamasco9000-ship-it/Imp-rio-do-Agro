// ===== Recinto de venda ao lado do leilão: o gado à venda fica em baias, você anda, olha e escolhe =====
const RCT={x0:96,y0:29,x1:107,y1:38,ay:33};// corredor nas linhas 33-34
const RPEN=[];for(let r=0;r<2;r++)for(let k=0;k<4;k++)RPEN.push({x0:96+k*3,y0:r?35:30,cx:(97.5+k*3)*TS,cy:(r?36.6:31.6)*TS,row:r});
function rctCarve(){
 for(let y=RCT.y0;y<=RCT.y1;y++)for(let x=RCT.x0-1;x<=RCT.x1;x++){const i=ti(x,y);G[i]=y===33||y===34?3:0;SOL[i]=0;FEN[i]=0}
 const inA=t=>{const x=Math.floor(t.x/TS),y=Math.floor(t.y/TS);return x>=RCT.x0-2&&x<=RCT.x1+1&&y>=RCT.y0-1&&y<=RCT.y1+1};
 for(let i=TREES.length-1;i>=0;i--)if(inA(TREES[i]))TREES.splice(i,1);
 if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--)if(inA({x:BOULD[i].x*TS,y:BOULD[i].y*TS}))BOULD.splice(i,1);
 for(let i=BUSH.length-1;i>=0;i--)if(inA(BUSH[i]))BUSH.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(inA(DECO[i]))DECO.splice(i,1);
 for(const p of RPEN)for(let y=p.y0;y<p.y0+3;y++)for(let x=p.x0;x<p.x0+3;x++)SOL[ti(x,y)]=1;
 for(let x=RCT.x0-1;x<=RCT.x1;x++){SOL[ti(x,29)]=1;SOL[ti(x,38)]=1}for(let y=29;y<=38;y++)SOL[ti(RCT.x0-1,y)]=1;
}
const _rfcRct=rfCarve;rfCarve=function(){_rfcRct();rctCarve()};
// cada anúncio ocupa uma baia
function penX(x){if(!x)return null;if(x.pen==null||S.listings.some(y=>y!==x&&y.pen===x.pen)){const used=new Set(S.listings.filter(y=>y!==x).map(y=>y.pen));for(let k=0;k<RPEN.length;k++)if(!used.has(k)){x.pen=k;break}}return RPEN[x.pen]||null}
const penOf=i=>penX(S.listings[i]);
const RCOW=new Map();// animação dos bois nas baias
function rcowSt(x,i){let s=RCOW.get(x.a.id);if(!s){const p=penX(x);s={x:p.cx+rnd(-6,6),y:p.cy+rnd(-4,4),dir:Math.random()<.5?1:-1,t:rnd(1,5),tx:0,ty:0,mv:0,ph:0};RCOW.set(x.a.id,s)}return s}
function stepRct(dt){if(!S.listings)return;S.listings.forEach((x,i)=>{const p=penX(x);if(!p)return;const s=rcowSt(x,i);s.t-=dt;
 if(s.t<=0&&!s.mv){s.tx=p.cx+rnd(-12,12);s.ty=p.cy+rnd(-6,5);s.mv=1;s.t=rnd(3,8)}
 if(s.mv){const dx=s.tx-s.x,dy=s.ty-s.y,d=Math.hypot(dx,dy);if(d<1){s.mv=0}else{s.x+=dx/d*6*dt;s.y+=dy/d*6*dt;s.dir=dx>=0?1:-1;s.ph+=dt*3}}})}
// ---------- visitas dos rivais ao recinto
let RVIS=null;
function rvVisitStep(dt){const h=dayHour();
 if(!RVIS){if(h>=8&&h<16&&S.listings&&S.listings.length&&Math.random()<dt/90){const i=ri(0,Math.min(8,RIV.length-1)),p=RVP[i];if(!p)return;
   RVIS={i,x:(RCT.x1+1.5)*TS,y:33.9*TS,st:'in',tx:0,t:0,look:p.lk,dir:2,ph:0,mv:1,lx:pick(S.listings)}}return}
 const V=RVIS;
 if(V.st==='in'||V.st==='out'){const p=penX(V.lx)||RPEN[0],tx=V.st==='in'?p.cx:(RCT.x1+2)*TS,dx=tx-V.x;V.mv=1;V.dir=dx>0?3:2;V.ph+=dt*6;if(Math.abs(dx)<2){if(V.st==='in'){V.st='look';V.t=rnd(8,18);V.mv=0;V.dir=p.row?0:1}else RVIS=null}else V.x+=Math.sign(dx)*Math.min(Math.abs(dx),30*dt)}
 else if(V.st==='look'){V.t-=dt;if(V.t<=0){const x=V.lx,li=S.listings.indexOf(x);
   if(li>=0&&Math.random()<.3&&!(typeof RAUC!=='undefined'&&RAUC&&RAUC.li===li)){const pn=x.pen;S.listings.splice(li,1);RCOW.delete(x.a.id);if(S.rk&&S.rk.v)S.rk.v[V.i]+=x.price*.1;const f=typeof RF!=='undefined'&&RF.find(z=>z.i===V.i);if(f&&f.n<22)f.n++;
    rvLog(V.i,'Comprou '+BREEDS[x.a.breed].n+' '+(x.a.sex==='F'?'♀':'♂')+' no recinto do leilão por '+R$(x.price));
    if(Math.hypot(P.x-V.x,P.y-V.y)<420)toast('🤠 '+rvName(V.i)+' comprou '+(x.a.sex==='F'?'a':'o')+' '+BREEDS[x.a.breed].n+' da baia '+(pn+1)+' por '+R$(x.price)+'.','bad')}
   V.st='out'}}}
const _updRct=update;update=function(dt){_updRct(dt);if(paused()||inRoom())return;const near=Math.abs(P.x-102*TS)<40*TS&&Math.abs(P.y-34*TS)<30*TS;if(near){stepRct(Math.min(dt,.1));}rvVisitStep(Math.min(dt,.1)*Math.max(1,Math.min(speed||1,6)))};
// ---------- desenho
const _evoRct=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoRct(L,x0,x1,y0,y1);if(inRoom())return;if(RCT.x1*TS<x0-40||RCT.x0*TS>x1+40||RCT.y0*TS>y1+40||RCT.y1*TS<y0-60)return;
 // chão e cercas
 L.push([RCT.y0*TS-60,10,{draw:g=>{for(const p of RPEN){Rr(g,'#a8885a',p.x0*TS,p.y0*TS,3*TS,3*TS);for(let k=0;k<6;k++)Rr(g,'#9a7a4a',p.x0*TS+hs(k,p.x0)*44,p.y0*TS+hs(p.y0,k)*44,3,1.4)}
  Rr(g,'#8a6a3a',(RCT.x0-1)*TS,33*TS,(RCT.x1-RCT.x0+2)*TS,2*TS)}}]);
 const rail=(x,y,w,h,ly)=>L.push([ly,10,{draw:g=>{Rr(g,'#5a3a22',x,y,w,h);Rr(g,'#7a5232',x,y,w,Math.min(h,1.4))}}]);
 for(const p of RPEN){const X=p.x0*TS,Y=p.y0*TS,W=3*TS,H=3*TS;
  for(const yy of[Y+H*.45,Y+H-2])rail(X,yy-6,W,2,yy);rail(X,Y-6,W,2,Y);rail(X,Y+H-12,W,2,Y+H);
  for(const xx of[X,X+W-2])L.push([Y+H,10,{draw:g=>{Rr(g,'#4a2e18',xx,Y-10,2.4,H+8);Rr(g,'#7a5232',xx-1,Y+H*.45-7,4,1.6)}}]);
  // porteira do lado do corredor e plaquinha com preço
  const gy=p.row?Y:Y+H;L.push([gy+1,10,{draw:g=>{Rr(g,'#c8b080',X+4,gy-8,W-8,2);Rr(g,'#c8b080',X+4,gy-4,W-8,2);for(let k=0;k<4;k++)Rr(g,'#c8b080',X+5+k*12,gy-9,1.4,8)}}])}
 S.listings&&S.listings.forEach((x,i)=>{const p=penX(x);if(!p)return;const s=rcowSt(x,i);L.push([s.y,10,{draw:g=>{drawCow(g,x.a,s.x,s.y,s.dir,s.mv?((s.ph*2)|0)%2:0)}}]);
  const gy=p.row?p.y0*TS:(p.y0+3)*TS,tx=p.x0*TS+14;L.push([gy+2,10,{draw:g=>{Rr(g,'#f4f0e4',tx,gy-17,20,7);Rr(g,'#3a2a1a',tx,gy-17,20,1);ptext(g,String(x.pen+1),tx+8,gy-16,'#3a2a1a')}}])});
 // placa
 L.push([29*TS+2,10,{draw:g=>{const x=(RCT.x1-1)*TS,y=29*TS;Rr(g,'#4a2e18',x+4,y-20,2,20);Rr(g,'#4a2e18',x+40,y-20,2,20);Rr(g,'#7a1f1f',x,y-34,46,15);Rr(g,'#e8dcc0',x+1,y-33,44,1);ptext(g,'RECINTO',x+5,y-31,'#f4e8c8')}}]);
 if(RVIS){const V=RVIS;npcAt(L,V.x,V.y,Object.assign({},V.look,{dir:V.dir,mv:V.mv,ph:V.ph}))}
};
// ---------- olhar e comprar
function rctModal(i){const x=S.listings[i];if(!x)return;const a=x.a,B=BREEDS[a.breed],T=BTR[a.breed]||{f:''},lock=S.rep<B.rep;reModal=null;
 showModal('<h3>🐄 Baia '+(x.pen+1)+': '+a.name+'</h3><div class="card"><div style="display:flex;gap:8px;align-items:center"><img src="'+breedImg(a.breed)+'" style="width:96px;height:64px;image-rendering:pixelated;background:#a8885a;border-radius:6px"><div><b>'+B.n+' '+(a.sex==='F'?'♀ fêmea':'♂ macho')+'</b><div class="gold" style="font-size:12px">'+T.f+'</div><div class="dim" style="font-size:12px">'+ageTxt(a)+' · '+Math.round(a.w)+' kg ('+(a.w/30).toFixed(1).replace('.',',')+' @ de carcaça)<br>Genética '+a.gen+' '+stars(a.gen)+' · saúde '+Math.round(a.hp)+'%</div></div></div>'
 +'<div class="dim" style="margin-top:4px;font-size:12px">'+(BINFO[a.breed]?BINFO[a.breed].join(' '):B.d)+'</div></div>'
 +'<div class="card"><div class="row"><span>Preço pedido</span><b class="gold">'+R$(x.price)+'</b></div><div class="row"><span>Valeria hoje no frigorífico</span><span>'+R$(Math.round(frigPrice(a)))+'</span></div>'
 +(a.sex==='M'&&a.age<420?'<div class="dim" style="font-size:12px">Garrote: ainda engorda até ficar pronto para abate.</div>':'')+(a.sex==='F'&&a.age>=420?'<div class="dim" style="font-size:12px">Já pode emprenhar: vira matriz do seu rebanho.</div>':'')+'</div>'
 +(lock?'<div class="card red">O criador só vende essa raça para quem tem reputação '+B.rep+'.</div>':'')
 +'<div class="btns">'+(lock?'':'<button class="b gold" data-act="rctbuy" data-v="'+i+'">Comprar ('+R$(x.price)+')</button>')+'<button class="b gray" data-act="close">Voltar</button></div>')}
ACT.rctbuy=function(e){const i=+e.v,x=S.listings[i];if(!x)return;const n0=S.herd.length;ACT.buy({v:i});if(S.herd.length>n0){hideModal();RCOW.delete(x.a.id);toast('🚛 '+x.a.name+' vai no caminhão do leilão até a sua fazenda.','good')}else if(!modalOpen)hideModal()};
const _ilRct=interactList;interactList=function(){const L=_ilRct();if(inRoom()||P.drive||!S.listings)return L;if(Math.abs(P.x-102*TS)>9*TS||Math.abs(P.y-34*TS)>5*TS)return L;
 S.listings.forEach((x,i)=>{const p=penX(x);if(!p)return;const px=p.cx,py=(p.row?35:33)*TS+(p.row?2:6);L.push({x:px,y:py,r:22,label:'🐄 Baia '+(x.pen+1)+': '+BREEDS[x.a.breed].n+(x.a.sex==='F'?' ♀':' ♂')+' · '+R$(x.price),fn:()=>rctModal(i)})});return L};
// o mercado avisa onde ver os animais
const _pmRct=pMarket;pMarket=function(){return '<div class="card"><b>🐄 Quer ver os animais de perto?</b><div class="dim">Eles ficam nas baias do Recinto, ao lado da Casa de Leilões. Ande pelo corredor e escolha.</div></div>'+_pmRct()};
// ---------- diário dos rivais (usado também pela vida das fazendas rivais)
function rvLog(i,t){if(!S.rlog)S.rlog={};const L=S.rlog[i]=S.rlog[i]||[];L.unshift({d:S.day,t});if(L.length>8)L.length=8}
