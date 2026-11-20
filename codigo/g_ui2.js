// ===== UI da expansão: inventário, nível, melhorias, integração =====
Object.assign(UPS,{
 lav:{n:'Ampliar a lavoura',ic:'🌾',d:'Mais canteiros no campo (a leste do celeiro)',c:[8000,24000],lv:[3,6]},
 coop:{n:'Galinheiro',ic:'🐔',d:'Construa e amplie: 8, 16 e 30 galinhas',c:[3000,9000,25000],lv:[2,4,7]},
 irrig:{n:'Irrigação por aspersão',ic:'💧',d:'Rega todos os canteiros sozinha',c:[15000],lv:[4]},
 kennel:{n:'Ampliar o canil',ic:'🐕',d:'Mais vagas para cães: 2, 3 e 5',c:[4000,10000,22000],lv:[2,4,6]},
 light:{n:'Holofotes e alarme',ic:'💡',d:'Menos roubos e alerta de ladrões à noite',c:[6000,20000],lv:[3,6]},
 dep:{n:'Depósito maior',ic:'📦',d:'+100 de espaço no inventário',c:[5000,14000],lv:[2,5]}
});
UPS.land.lv=[1,2,3,5,7];
function pUp(){
 return Object.keys(UPS).map(k=>{
  const u=UPS[k],l=S.up[k]||0,c=upCost(k),rq=u.lv?u.lv[l]:0,lock=rq&&rq>LV();
  return '<div class="card '+(lock?'lock':'')+'"><div class="row"><b>'+u.ic+' '+u.n+'</b><span class="gold">Nv '+l+'/'+u.c.length+'</span></div><div class="dim">'+u.d+'</div>'
  +(c===null?'<div class="grn">Nível máximo</div>':lock?'<div class="red">Requer nível '+rq+' de jogador</div>':'<div class="btns"><button class="b '+(S.money>=c?'gold':'gray')+'" data-act="upg" data-v="'+k+'">Comprar '+R$(c)+'</button></div>')+'</div>'}).join('');
}
const _pMarket=pMarket;
pMarket=function(){return seedSection()+_pMarket()};
Object.assign(ACT,{
 upg(e){
  const k=e.v,c=upCost(k);if(c===null)return;const u=UPS[k],rq=u.lv?u.lv[S.up[k]]:0;
  if(rq&&rq>LV())return toast('Requer nível '+rq,'bad');
  if(S.money<c)return toast('Dinheiro insuficiente','bad');
  cash(-c,'Melhoria: '+u.n);S.up[k]++;if(k==='ia')newStraws();if(k==='land')rebuildFence();if(k==='coop')syncCH();
  gainXP(c/350,'melhoria');toast('✅ '+u.n+' nível '+S.up[k],'good');
 }
});
const _sleep=ACT.sleep,_pet=ACT.pet,_feed=ACT.feed,_hbuy=ACT.hbuy,_hlic=ACT.hlic,_r2=ACT.reset2;
ACT.sleep=function(e){nightSleepRoll();S.tf.slept=1;_sleep(e);renderTutBox()};
ACT.pet=function(e){_pet(e);S.tf.pet=1};
ACT.feed=function(e){const b=S.feed;_feed(e);if(S.feed>b)S.tf.feedb=1};
ACT.hlic=function(e){if(LV()<2)return toast('A licença de caça requer nível 2','bad');_hlic(e)};
ACT.hbuy=function(e){const[k,id]=e.v.split(':');if(k==='w'&&WLV[id]>LV())return toast('Requer nível '+WLV[id],'bad');_hbuy(e)};
ACT.reset2=function(){_r2();ensureG();rebuildCMap();THV.length=0;DR.clear();CH.length=0;renderTutBox()};
function pInv(){
 const sd=S.selSeed;
 let h='<div class="card"><div class="row"><b>🎒 Inventário</b><span>'+invCount()+' / '+invCap()+'</span></div>'+bar(invCount()/invCap()*100,'#e0a431')
 +'<div class="dim">Semente para plantar: <b class="gold">'+CROPS[sd].ic+' '+CROPS[sd].n+'</b> ('+(S.inv['seed_'+sd]||0)+' un.)</div><div class="dim">Venda produtos na caixa de venda (ao lado da casa) ou na padaria.</div></div>';
 const cat=(t,f)=>{const ks=Object.keys(S.inv).filter(k=>ITEMS[k]&&f(ITEMS[k]));if(!ks.length)return'';return '<div class="sec">'+t+'</div>'+ks.map(k=>{const it=ITEMS[k];
  return '<div class="card '+(it.crop===sd?'sel':'')+'"><div class="row"><b>'+it.ic+' '+it.n+' ×'+S.inv[k]+'</b><span class="gold">'+R$(itemPrice(k))+' un.</span></div>'+(it.cat==='seed'?'<div class="btns"><button class="b '+(it.crop===sd?'gray':'gold')+'" data-act="selseed" data-v="'+it.crop+'">'+(it.crop===sd?'Selecionada':'Usar para plantar')+'</button></div>':'')+'</div>'}).join('')};
 h+=cat('SEMENTES',i=>i.cat==='seed')+cat('COLHEITA',i=>i.cat==='crop')+cat('PRODUTOS',i=>i.cat==='prod');
 if(!Object.keys(S.inv).length)h+='<div class="dim">Vazio. Compre sementes na Casa Agro.</div>';
 const H=S.h;h+='<div class="sec">EQUIPAMENTO DE CAÇA</div><div class="card dim">Arma: '+(H.eq?WEAPONS[H.eq].n:'nenhuma')+' · Roupa: '+OUTFITS[H.outfit].n+' · Carcaças: '+H.bag.length+' ('+Math.round(P.carry)+' kg)<br>Veja a aba 🏹 Caça para trocar.</div>';
 return h;
}
function pLv(){
 const l=LV(),a=xpFor(l),b=xpFor(l+1),pct=(S.lv.xp-a)/(b-a)*100;
 let h='<div class="card"><div class="row"><b class="px" style="font-size:12px">⭐ Nível '+l+'</b><span class="dim">'+S.lv.xp+' / '+b+' XP</span></div>'+bar(pct,'#9ad8f5')+'<div class="dim">Ganhe XP vendendo, colhendo, criando, caçando, cumprindo missões e defendendo a fazenda.</div></div>';
 h+='<div class="sec">MISSÕES ATIVAS</div>'+(S.q.act.length?S.q.act.map(a=>'<div class="card"><div class="row"><b>'+npcById(a.giver).n+'</b><span class="gold">'+R$(a.reward)+'</span></div><div>'+qText(a)+'</div></div>').join(''):'<div class="dim">Nenhuma. Converse com o pessoal da vila (os "!" amarelos).</div>');
 h+='<div class="sec">DESBLOQUEIOS</div>'+Object.keys(UNL).map(k=>'<div class="card '+(k<=l?'':'lock')+'"><b>'+(k<=l?'✅':'🔒')+' Nível '+k+'</b><div class="dim">'+UNL[k]+'</div></div>').join('');
 h+='<div class="sec">ESTATÍSTICAS</div><div class="card dim">Missões: '+S.q.done+' · Ladrões presos: '+S.crim.caught+' · Perdas por roubo: '+S.crim.lost+' · Reputação '+Math.floor(S.rep)+'</div>';
 return h;
}
function farmInteracts(L){
 if(playerInField())L.push({x:P.x,y:P.y-4,r:1,label:'Lavoura: plantar/regar/colher',fn:tend});
 L.push({x:53*TS,y:55*TS+4,r:28,label:S.up.coop?'Galinheiro':'Galinheiro (requer nível 2)',fn:coopModal});
 L.push({x:SHIPBOX.x+9,y:SHIPBOX.y+16,r:22,label:'Caixa de venda',fn:shipModal});
 L.push({x:12*TS+10,y:43*TS+10,r:22,label:'Canil da fazenda',fn:kennelModal});
 if(npcOut())for(const n of NPCS)L.push({x:n.x,y:n.y-4,r:22,label:'Falar com '+n.n,fn:()=>npcModal(n.id)});
}
function interactList(){
 const L=[];
 BLD.forEach(b=>{if(!b.deco)L.push({x:b.door*TS+8,y:(b.y+b.h)*TS+6,r:22,label:b.label,fn:()=>enterBld(b.id)})});
 L.push({x:TROUGH.x+24,y:TROUGH.y+14,r:28,label:'Cocho (ração)',fn:troughModal});
 L.push({x:MAILBOX.x,y:MAILBOX.y+12,r:20,label:'Caixa de correio'+(S.offers.length?' ('+S.offers.length+')':''),fn:mailModal});
 for(const a of S.herd){if(a.led)continue;const s=spriteOf(a);L.push({x:s.x+8,y:s.y+5,r:20,label:a.name+' ('+BREEDS[a.breed].n+')',fn:()=>cowModal(a.id),cow:1})}
 farmInteracts(L);huntInteracts(L);return L;
}
function enterBld(id){
 if(id==='house')sleepModal();
 else if(id==='barn'){S.tf.barn=1;openMenu('herd')}
 else if(id==='leilao'){S.tf.auc=1;openMenu('auc')}
 else if(id==='banco')openMenu('fin');
 else if(id==='agro')openMenu('market');
 else if(id==='lodge'){S.tf.lodge=1;lodgeModal('arms')}
 else if(id==='padaria')npcModal('lourdes');else if(id==='vet')npcModal('marina');
 else if(id==='canil')npcModal('tiao');else if(id==='delegacia')npcModal('ramos');
}
function renderHUD(){
 const mon=Math.floor((S.day%360)/30),hh=Math.floor(S.t*24),mm=Math.floor((S.t*24%1)*60),wa=S.wind?S.wind.a:0;
 const l=LV(),pct=Math.max(0,Math.min(100,(S.lv.xp-xpFor(l))/(xpFor(l+1)-xpFor(l))*100));
 $('hudL').innerHTML='<div class="m '+(S.money<0?'red':'')+'">'+R$(S.money)+'</div>'
  +'<div style="font-size:15px;color:#9ad8f5">⭐ Nv '+l+' <span style="display:inline-block;width:54px;height:5px;background:#1c120b;vertical-align:middle"><i style="display:block;height:100%;width:'+pct+'%;background:#9ad8f5"></i></span></div>'
  +'<div>'+(S.day%30+1)+'/'+MONTHS[mon]+' · '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')+'</div>'
  +'<div class="dim" style="font-size:16px">'+(S.drought>0?'🌵 Seca':S.weather==='chuva'?'🌧️ Chuva':isWet()?'☀️ Chuvas':'☀️ Seca')+' · Vento <span style="display:inline-block;transform:rotate('+wa+'rad);color:#9ad8f5">➤</span></div>'
  +(P.hp<100?'<div class="bar"><i style="width:'+Math.max(0,P.hp)+'%;background:#d9503f"></i></div>':'');
 setH($('hudR'),[[0,'⏸'],[1,'▶'],[6,'⏩'],[20,'⏭']].map(s=>'<button data-act="spd" data-v="'+s[0]+'" class="'+(speed===s[0]?'on':'')+'">'+s[1]+'</button>').join('')+'<button data-act="menu">☰</button><button data-act="help">?</button>');
 renderTutBox();
}
function helpModal(){
 showModal('<h3>🐂 Fazenda Boi de Ouro</h3><div style="line-height:1.25"><p>Cresça de pequeno produtor a barão do gado: <b>crie gado</b>, plante, tenha <b>galinhas</b> e <b>cães</b>, cace na mata e <b>suba de nível</b> para liberar tudo.</p>'
 +'<p>• Siga a <b>seta amarela</b> e o quadro do <b>Tutorial</b> no alto da tela.</p>'
 +'<p>• <b>Casa:</b> dormir/salvar · <b>Celeiro:</b> rebanho · <b>Lavoura:</b> terra marrom a leste · <b>Vila:</b> estrada a leste · <b>Mata de caça:</b> trilha ao norte.</p>'
 +'<p>• <b>À noite</b> ladrões podem rondar. Cães, cerca elétrica e holofotes ajudam. Atire neles ou mande o cão atacar.</p>'
 +'<p class="dim">PC: WASD, Shift correr, E agir, botão direito mirar, clique atirar, C agachar, 1 seguir/ficar, 2 atacar, 3 rastrear. Celular: joystick e botões na tela.</p></div><div class="btns"><button class="b gold" data-act="close">Vamos lá!</button></div>');
}
