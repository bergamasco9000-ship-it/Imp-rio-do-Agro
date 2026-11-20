// ===== Herói: vida, veneno, cobras, barra rápida, armas detalhadas, cães escolta/armadura =====
Object.assign(SPECIES,{
 jararaca:{n:'Jararaca',bio:'f',w:[.8,2],spd:12,flee:60,vis:80,hear:80,smell:10,vr:2,br:3,hp:8,price:40,season:null,cnt:12,col:'#6a5a2a',sz:.6,xp:12,aggr:26,chg:60,dmg:9,venom:1},
 cascavel:{n:'Cascavel',bio:'c',w:[1,3],spd:12,flee:60,vis:80,hear:80,smell:10,vr:2,br:3,hp:9,price:55,season:null,cnt:10,col:'#9a8a52',sz:.6,xp:15,aggr:28,chg:62,dmg:11,venom:1},
 sucuri:{n:'Sucuri',bio:'p',water:1,w:[20,60],spd:14,flee:60,vis:90,hear:80,smell:20,vr:4,br:6,hp:60,price:30,bounty:300,season:null,cnt:3,col:'#3a5a2a',sz:1.4,xp:45,aggr:34,chg:55,dmg:22}
});
SPECIES.boar.aggr=80;SPECIES.boar.chg=78;SPECIES.boar.dmg=18;
Object.assign(WSZ,{jararaca:10,cascavel:10,sucuri:18});
const snk=(r,a,c,dk,mv)=>{const n=a.sp==='sucuri'?18:9;for(let i=0;i<n;i++)r(i%4<2?c:dk,i,-2-(((i>>1)+(mv?1:0))&1),1,2);r(c,n,-4,3,3);r('#111',n+1,-4,1,1);if((frame>>3)&1)r('#d33',n+3,-3,2,1);if(a.sp==='cascavel')r('#d8c8a0',-2,-3,2,2)};
WDRAW.jararaca=WDRAW.cascavel=WDRAW.sucuri=(r,a,c,dk,lt,leg,mv)=>snk(r,a,c,dk,mv);
// patch dano com veneno é feito no código de ataque; aqui: vinheta, veneno e barra de vida
ITEMS.kit={n:'Kit de primeiros socorros',ic:'🩹',cat:'use',p:120};
ITEMS.antiv={n:'Soro antiofídico',ic:'💉',cat:'use',p:150};
ITEMS.pao={n:'Pão fresco',ic:'🥖',cat:'use',p:8};
ITEMS.marmita={n:'Marmita caseira',ic:'🍱',cat:'use',p:30};
const USE={kit:{hp:55,t:'Você fez um curativo (+55 vida)'},antiv:{hp:15,cure:1,t:'Soro aplicado: veneno curado'},pao:{hp:12,t:'Você comeu um pão (+12 vida)'},marmita:{hp:38,t:'Você comeu a marmita (+38 vida)'}};
function useFood(k){
 if(!USE[k]||!hasItem(k,1))return false;if(P.hp>=100&&!(USE[k].cure&&P.pois>0)){toast('Vida já está cheia');return false}
 takeItem(k,1);P.hp=Math.min(100,P.hp+USE[k].hp);if(USE[k].cure)P.pois=0;toast('💚 '+USE[k].t,'good');return true;
}
const vig=document.createElement('div');vig.id='vig';vig.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:6;opacity:0;transition:opacity .15s';document.body.appendChild(vig);
const hpb=document.createElement('div');hpb.id='hpb';hpb.style.cssText='position:fixed;top:44px;right:6px;z-index:7;font:16px "VT323",monospace;color:#fff;text-align:center;pointer-events:none;text-shadow:1px 1px 0 #000';document.body.appendChild(hpb);
let _lastHp=100;
const _upd2=update;
update=function(dt){
 if(P.pois>0){P.pois-=dt;P.hp=Math.max(P.hp>3?3:P.hp,P.hp-dt*1.1);if(P.pois<=0)toast('O veneno passou')}
 if(P.hp<_lastHp-.8)P.hurt=.7;_lastHp=P.hp;P.hurt=Math.max(0,(P.hurt||0)-dt);
 _upd2(dt);
};
setInterval(()=>{
 const low=P.hp<35,a=Math.max(P.hurt||0,0)*.9+(low?.25+.1*Math.sin(frame/8):0)+(P.pois>0?.1:0);
 vig.style.opacity=Math.min(1,a);vig.style.background=P.pois>0&&!P.hurt?'radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(40,160,40,.7) 100%)':'radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(200,0,0,.75) 100%)';
 setHTML(hpb,'❤️ <span style="display:inline-block;width:90px;height:8px;background:#1c120b;border:1px solid #000;vertical-align:middle"><i style="display:block;height:100%;width:'+Math.max(0,P.hp)+'%;background:'+(P.hp<35?'#e03030':P.hp<65?'#e0a431':'#5ac04a')+'"></i></span>'+(P.pois>0?' ☠️':''));
},120);
// ---- barra rápida
const hot=document.createElement('div');hot.id='hot';hot.style.cssText='position:fixed;bottom:58px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:7';document.body.appendChild(hot);{const st=document.createElement('style');st.textContent='.touch #hot{flex-direction:column;left:6px!important;transform:none!important;bottom:auto!important;top:262px;gap:3px!important}.touch #hot>div{width:34px!important;height:34px!important;font-size:16px!important}';document.head.appendChild(st)}
const ownedW=()=>Object.keys(WEAPONS).filter(k=>S.h&&S.h.own[k]);
function hotSlots(){
 const w=S.h.eq,ws=ownedW(),cons=(S.h.cons.scent||0)+(S.h.cons.lure||0)+(S.h.cons.call||0),sd=S.selSeed;
 return [
  {ic:w?wIcon(w,1):'✋',n:w?(S.h.mag[w]||0)+'/'+WEAPONS[w].cap:'',f:()=>{if(ws.length>1)ACT.hequip({v:ws[(ws.indexOf(w)+1)%ws.length]});else if(ws.length===1)ACT.hequip({v:ws[0]})}},
  {ic:'🩹',n:S.inv.kit||0,f:()=>useFood('kit')},
  {ic:'💉',n:S.inv.antiv||0,f:()=>useFood('antiv')},
  {ic:'🥖',n:(S.inv.pao||0)+(S.inv.marmita||0),f:()=>{if(!useFood('marmita'))useFood('pao')}},
  {ic:'🧪',n:cons,f:()=>useModal()},
  {ic:CROPS[sd].ic,n:S.inv['seed_'+sd]||0,f:()=>{const ks=Object.keys(CROPS).filter(k=>CROPS[k].lv<=LV()&&S.inv['seed_'+k]);if(ks.length){S.selSeed=ks[(ks.indexOf(sd)+1)%ks.length];toast('Semente: '+CROPS[S.selSeed].n)}else toast('Sem sementes. Compre na Casa Agro.')}}
 ];
}
function hotUse(i){if(paused())return;const s=hotSlots()[i];if(s)s.f()}
setInterval(()=>{
 if(!S||!S.h){return}hot.style.display=modalOpen?'none':'flex';
 setHTML(hot,hotSlots().map((s,i)=>'<div data-hot="'+i+'" style="width:44px;height:44px;background:rgba(40,28,18,.85);border:2px solid '+(i===0&&S.h.eq?'#e0a431':'rgba(255,255,255,.4)')+';border-radius:6px;position:relative;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;touch-action:none">'+s.ic+'<small style="position:absolute;right:2px;bottom:0;font-size:12px;color:#ffd75e">'+s.n+'</small><small style="position:absolute;left:3px;top:0;font-size:11px;color:#bbb">'+(i+1)+'</small></div>').join(''));
},250);
hot.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-hot]');if(el){e.preventDefault();hotUse(+el.dataset.hot)}});
// ---- armas detalhadas
const WL={
 r22:{len:15,seg:[[0,5,2,'#7a5230'],[5,8,2,'#333'],[8,15,1.2,'#5a5a5a'],[14,15,2,'#222']]},
 shot12:{len:17,seg:[[0,5,2.4,'#7a5230'],[5,8,2.4,'#444'],[8,17,2,'#666'],[10,13,2.8,'#5a3a22']]},
 r308:{len:17,seg:[[0,6,2.2,'#5a4a32'],[6,9,2,'#2a2a2a'],[9,17,1.4,'#444'],[7,8,3,'#222']]},
 r3006:{len:18,seg:[[0,6,2.2,'#4a3220'],[6,9,2,'#2a2a2a'],[9,18,1.4,'#3a3a3a'],[6,12,1.6,'#111',-2.4],[6,7,2,'#58a',-2.4],[12,13,2,'#58a',-2.4]]},
 mag300:{len:20,seg:[[0,7,2.4,'#2a2a2a'],[7,10,2.2,'#1a1a1a'],[10,19,1.6,'#3a3a3a'],[19,20,2.6,'#222'],[5,14,2,'#111',-2.6],[5,6,2.4,'#58a',-2.6],[13,14,2.4,'#58a',-2.6]]}
};
function wIcon(k,small){
 const w=WL[k],sc=small?1.6:3,wd=(w?w.len:16)*sc+4;let b='';
 if(k==='bow')b='<path d="M10 2 Q2 8 10 14" stroke="#6a4a2a" stroke-width="2" fill="none"/><line x1="10" y1="2" x2="10" y2="14" stroke="#ddd" stroke-width=".7"/><line x1="4" y1="8" x2="24" y2="8" stroke="#bbb" stroke-width="1"/>';
 else if(w)w.seg.forEach(s=>{b+='<rect x="'+(2+s[0]*sc)+'" y="'+(8-s[2]*sc/2+(s[4]||0)*sc)+'" width="'+((s[1]-s[0])*sc)+'" height="'+(s[2]*sc)+'" fill="'+s[3]+'"/>'});
 return '<svg width="'+(k==='bow'?(small?26:30):wd)+'" height="'+(small?18:16)+'" viewBox="0 0 '+(k==='bow'?28:wd)+' 16" style="vertical-align:middle;shape-rendering:crispEdges"'+(small?' preserveAspectRatio="xMidYMid meet"':'')+'>'+b+'</svg>';
}
function wDesc(k){const w=WEAPONS[k];return w.d+'<br><span class="dim">💥 Dano '+w.power+' · 🎯 Alcance '+Math.round(w.range/TS)+' m · ⏱️ Recarga '+w.rel+'s · 🔫 Carregador '+w.cap+' · 🔊 Ruído '+w.noise+' · ✋ Firmeza '+clamp(Math.round(100*(1.15-w.stab)/.85),5,100)+'%</span>'}
function drawGun(g,x,y,k){
 const w=WL[k];
 if(P.aim){
  const a=AIM.ang,ca=Math.cos(a),sa=Math.sin(a),by=y-9;
  if(k==='bow'){for(let i=-7;i<=7;i++){const px=x+ca*9+(-sa)*i*.9-ca*Math.abs(i)*.18,py=by+sa*9+ca*i*.9-sa*Math.abs(i)*.18;Rr(g,'#6a4a2a',px,py,1.6,1.6)}Rr(g,'#ddd',x+ca*3,by+sa*3,1,1);Rr(g,'#ccc',x+ca*5,by+sa*5,1,1)}
  else if(w)w.seg.forEach(s=>{for(let i=s[0];i<s[1];i+=.7){const off=s[4]||0;Rr(g,s[3],x+ca*(i+2)-sa*off,by+sa*(i+2)+ca*off,s[2],s[2])}});
  return;
 }
 const d=P.dir===2?-1:1;
 if(k==='bow'){for(let i=-6;i<=6;i++)Rr(g,'#6a4a2a',x+(-d)*4-Math.abs(i)*.15*(-d),y-12+i*.9,1.4,1.4);return}
 if(w)for(let i=0;i<w.len*.75;i+=.8){const f=i/(w.len*.75),s=w.seg.find(s=>i/.75>=s[0]&&i/.75<s[1])||w.seg[0];Rr(g,s[3],x+d*(-3+f*7),y-6-f*12,Math.min(2,s[2]),Math.min(2,s[2]))}
}
// ---- cães: escolta e armadura
const DARM=[{n:'Sem proteção',p:0,red:0},{n:'Colete de nylon',p:800,red:.3,col:'#d84a2a'},{n:'Colete tático com espinhos',p:2200,red:.55,col:'#34402f'}];
function escortDog(d,r,def,dt){
 const esc=S.dogs.filter(x=>x.esc&&x.id!==S.dogAct),i=esc.indexOf(d),arm=DARM[d.arm||0];
 d.hp=d.hp===undefined?100:d.hp;r.cd=Math.max(0,r.cd-dt);
 let tx,ty,spd=def.spd*.9,eng=null;
 if(d.hp>20){
  eng=WILD.find(a=>a.st==='charge'&&Math.hypot(a.x-P.x,a.y-P.y)<170)||THV.find(t=>thActive(t)&&Math.hypot(t.x-P.x,t.y-P.y)<170);
 }
 if(eng){tx=eng.x;ty=eng.y;spd=def.spd*1.35;
  if(Math.hypot(eng.x-r.x,eng.y-r.y)<11&&r.cd<=0){r.cd=1.1;r.bark=.8;
   if(eng.sp){eng.hp-=def.bite*2.5;if(eng.hp<=0)killWild(eng);const sp=SPECIES[eng.sp];d.hp-=(sp.dmg||10)*(1-arm.red)*.45;if(d.hp<20){d.hp=20;toast('🐕 '+d.name+' se feriu e recuou!','bad')}}
   else biteThief(eng,def.bite,d)}}
 else{const ang=Math.PI*(.75+.5*(i<0?0:i)),dist=34+(i<0?0:i)*8,gx=P.x-Math.cos(ang*0+(P.dir===3?0:P.dir===2?Math.PI:P.dir===0?-Math.PI/2:Math.PI/2))*dist+Math.cos(ang)*10,gy=P.y-Math.sin(P.dir===1?-Math.PI/2:P.dir===0?Math.PI/2:0)*dist*0+Math.sin(ang)*10;
  tx=gx;ty=gy+(i<0?0:i)*6;const dd=Math.hypot(tx-r.x,ty-r.y);if(dd<8)tx=null;else if(dd>100)spd=def.spd*1.3}
 if(tx!=null){const dx=tx-r.x,dy=ty-r.y,dd=Math.hypot(dx,dy)||1;r.x+=dx/dd*spd*dt;r.y+=dy/dd*spd*dt;if(Math.abs(dx)>.5)r.dir=dx>0?1:-1;r.moving=1}else r.moving=0;
}
const _drawDog=drawDog;
drawDog=function(g,d){
 _drawDog(g,d);const r=dogRT(d),def=DOGS[d.breed],arm=DARM[d.arm||0],s=def.sz,W=[10,13,16][s],H=[5,7,9][s],dr=r.dir,x=r.x,y=r.y;
 const f=(c,dx,dy,w,h)=>Rr(g,c,dr>0?x+dx:x-dx-w+1,y+dy,w,h);
 if(arm.col){f(arm.col,2,-H,W-6,3);f('#ddd',3,-H,1,1);if(d.arm===2){f('#bbb',3,-H-1,1,1);f('#bbb',5,-H-1,1,1);f('#bbb',7,-H-1,1,1)}}
 if(d.esc&&d.id!==S.dogAct)Rr(g,'#6ac04a',x+(W>>1),y-H-6,2,2);
 if((d.hp===undefined?100:d.hp)<=25)Rr(g,'#e03030',x+(W>>1)-1,y-H-9,3,1),Rr(g,'#e03030',x+(W>>1),y-H-10,1,3);
};
Object.assign(ACT,{
 dogesc(e){const d=S.dogs.find(x=>x.id==+e.id);if(!d||d.id===S.dogAct)return toast('O cão ativo já te acompanha. Troque o ativo no canil.');
  if(!d.esc&&S.dogs.filter(x=>x.esc).length>=2)return toast('No máximo 2 cães de escolta além do ativo','bad');
  d.esc=!d.esc;toast(d.esc?'🐕 '+d.name+' vai te escoltar':'🐕 '+d.name+' volta a vigiar a fazenda')},
 dogarm(e){const[id,lv]=e.v.split(':'),d=S.dogs.find(x=>x.id==+id),a=DARM[+lv];if(!d||!a)return;if((d.arm||0)>=+lv)return;if(S.money<a.p)return toast('Dinheiro insuficiente','bad');cash(-a.p,a.n+' para '+d.name);d.arm=+lv;toast('🛡️ '+d.name+' recebeu: '+a.n,'good')},
 dogheal(e){const d=S.dogs.find(x=>x.id==+e.id);if(!d||(d.hp===undefined?100:d.hp)>=100)return;if(S.money<200)return toast('Dinheiro insuficiente','bad');cash(-200,'Veterinário do cão');d.hp=100;toast('💚 '+d.name+' foi tratado','good')},
 buyuse(e){const k=e.v,it=ITEMS[k];if(S.money<it.p)return toast('Dinheiro insuficiente','bad');if(addItem(k,1)){cash(-it.p,it.n);toast('Comprou '+it.n,'good')}}
});
function dogSection(buy){
 return '<div class="sec">CÃES (escolta e proteção)</div>'+S.dogs.map(d=>{const def=DOGS[d.breed],hp=d.hp===undefined?100:Math.round(d.hp),act=d.id===S.dogAct;
  return '<div class="card"><div class="row"><b>🐕 '+d.name+' <span class="dim">'+def.n+'</span></b><span class="'+(hp<40?'red':'grn')+'">vida '+hp+'</span></div><div class="dim">'+DARM[d.arm||0].n+(act?' · cão ativo (te segue)':d.esc?' · escoltando':' · vigiando a fazenda')+'</div><div class="btns">'
  +(act?'':'<button class="b '+(d.esc?'gold':'')+'" data-act="dogesc" data-id="'+d.id+'">'+(d.esc?'Escolta: ON':'Levar comigo')+'</button>')
  +(hp<100?'<button class="b" data-act="dogheal" data-id="'+d.id+'">Tratar R$ 200</button>':'')
  +(buy?DARM.slice(1).map((a,i)=>(d.arm||0)>=i+1?'':'<button class="b gold" data-act="dogarm" data-v="'+d.id+':'+(i+1)+'">'+a.n+' '+R$(a.p)+'</button>').join(''):'')+'</div></div>'}).join('');
}
const _pInv=pInv;pInv=function(){return _pInv()+dogSection(0)};
const _npcModal3=npcModal;
npcModal=function(id){
 _npcModal3(id);const last=$('mbox').lastElementChild;if(!last)return;
 if(id==='tiao')last.insertAdjacentHTML('beforebegin',dogSection(1));
 if(id==='marina')last.insertAdjacentHTML('beforebegin','<div class="sec">FARMÁCIA</div>'+['kit','antiv'].map(k=>'<div class="card"><div class="row"><b>'+ITEMS[k].ic+' '+ITEMS[k].n+' <span class="dim">(tem '+(S.inv[k]||0)+')</span></b><span class="gold">'+R$(ITEMS[k].p)+'</span></div><div class="btns"><button class="b gold" data-act="buyuse" data-v="'+k+'">Comprar</button></div></div>').join(''));
 if(id==='lourdes')last.insertAdjacentHTML('beforebegin','<div class="card"><div class="row"><b>🥖 Pão fresco <span class="dim">(tem '+(S.inv.pao||0)+')</span></b><span class="gold">'+R$(8)+'</span></div><div class="btns"><button class="b gold" data-act="buyuse" data-v="pao">Comprar</button></div></div>');
};
const _hd4=hookDay;
hookDay=function(){_hd4();0};
