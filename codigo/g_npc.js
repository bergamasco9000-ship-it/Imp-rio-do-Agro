// ===== Vila: NPCs, missões, tutorial =====
const NPCS=[
 {id:'joao',n:'Seu João',role:'Prefeito',hx:116*TS,hy:57*TS+4,col:'#7a5a2a',hair:'#dddddd',lines:['A vila agradece quem planta e cria com honestidade.','Cuide bem do gado e da terra, rapaz!','Dizem que tem javali demais na mata ao norte.']},
 {id:'lourdes',n:'Dona Lourdes',role:'Padeira',hx:104*TS,hy:55*TS+8,col:'#c8506a',hair:'#5a3a22',lines:['Meu bolo de milho é famoso. Traz milho e ovos que eu pago bem!','Ovo caipira fresquinho é outra coisa.']},
 {id:'ramos',n:'Xerife Ramos',role:'Xerife',hx:132*TS,hy:46*TS+10,col:'#3a4a7a',hair:'#222222',lines:['Ladrão de gado anda solto por aqui. Fique de olho de noite.','Cachorro bom vale por três peões.']},
 {id:'marina',n:'Dra. Marina',role:'Veterinária',hx:101*TS,hy:64*TS+8,col:'#e8e8f0',hair:'#7a3a1a',lines:['Gado vacinado é gado saudável.','Cuidado com a seca: o pasto some e o rebanho sofre.']},
 {id:'tiao',n:'Seu Tião',role:'Canil',hx:131*TS,hy:64*TS+8,col:'#5a7a3a',hair:'#8a7a5a',lines:['Cachorro não é bicho, é família.','Um Kangal no pasto faz o ladrão mudar de ideia.']},
 {id:'ze',n:'Zé do Campo',role:'Casa Agro',hx:123*TS,hy:45*TS+10,col:'#8a6a2a',hair:'#3a2a1a',lines:['Semente boa dá colheita boa. Veja o que chegou.','Regar todo dia, é o segredo.']},
 {id:'bisc',n:'Biscoito',role:'Moleque da vila',hx:119*TS,hy:59*TS,col:'#e0a431',hair:'#222222',kid:1,lines:['Meu cachorro é maior que o seu!','Já viu um alce? Dizem que tem um na mata!','Eu vou ser fazendeiro igual você.']}
];
NPCS.forEach(n=>{n.x=n.hx;n.y=n.hy;n.wait=rnd(1,4);n.tx=n.x;n.ty=n.y;n.dir=1});
const npcById=id=>NPCS.find(n=>n.id===id);
const dayHour=()=>S.t*24;
const npcOut=()=>{const h=dayHour();return h>=6&&h<21.5};
function stepNPC(dt){
 for(const n of NPCS){
  if(n.wait>0){n.wait-=dt;n.mv=0;continue}
  const dx=n.tx-n.x,dy=n.ty-n.y,d=Math.hypot(dx,dy);
  if(d<2){n.wait=rnd(2,7);n.tx=n.hx+rnd(-22,22);n.ty=n.hy+rnd(-8,8);n.mv=0;continue}
  n.x+=dx/d*14*dt;n.y+=dy/d*14*dt;n.dir=dx>0?1:-1;n.mv=1;
 }
}
function drawNPC(g,n){
 const x=n.x,y=n.y,st=n.mv?((frame>>3)&1):0,k=n.kid?-4:0;
 Rr(g,'rgba(0,0,0,.3)',x-5,y-1,10,3);
 Rr(g,'#33384a',x-3,y-6-k*0,2,6-(st?1:0));Rr(g,'#33384a',x+1,y-6,2,5+(st?0:1));
 Rr(g,n.col,x-4,y-14-k,8,9+k);Rr(g,'#e8b890',x-3,y-19-k,6,5);Rr(g,n.hair,x-4,y-21-k,8,3);
 if(n.id==='ramos'){Rr(g,'#222',x-5,y-22,10,2);Rr(g,'#ffd75e',x+1,y-12,2,2)}
 if(n.id==='lourdes')Rr(g,'#fff',x-4,y-10,8,5);
 if(n.id==='marina')Rr(g,'#4a90d0',x-4,y-13,8,2);
 const flag=npcHasQuest(n.id)||(S.tut<TUT.length&&TUT[S.tut].npc===n.id);
 if(flag){Rr(g,'#ffd75e',x-1,y-30-((frame>>4)&1),2,5);Rr(g,'#ffd75e',x-1,y-24-((frame>>4)&1),2,2)}
}
// ---- missões
const QNPC=['joao','lourdes','ze','ramos'];
function questPool(id){
 const lv=LV();let p=['milho'];if(lv>=2)p.push('ovo','tomate','mandioca');if(lv>=4)p.push('trigo');if(lv>=5)p.push('soja');if(lv>=6)p.push('cana');if(lv>=8)p.push('cafe');
 if(id==='lourdes')p=p.filter(k=>['ovo','milho','trigo','tomate'].includes(k));
 if(id==='ze')p=p.filter(k=>k!=='ovo');
 return p;
}
function genOffers(){
 S.q.offer=S.q.offer||{};
 QNPC.forEach(id=>{
  const o=S.q.offer[id];if(o&&o.exp>S.day)return;
  if(id==='ramos'){const n=LV()>=3?ri(1,2):1;S.q.offer[id]={kind:'thief',n,reward:1200*n,xp:60*n,exp:S.day+7};return}
  const it=pick(questPool(id)),n=ri(4,9);
  S.q.offer[id]={kind:'item',item:it,n,reward:Math.round(n*ITEMS[it].p*1.45),xp:10+n*3,exp:S.day+5};
 });
}
const npcHasQuest=id=>!!(S.q&&((S.q.offer&&S.q.offer[id]&&S.q.offer[id].exp>S.day&&!S.q.act.some(a=>a.giver===id))||S.q.act.some(a=>a.giver===id&&canDeliver(a))));
function canDeliver(a){return a.kind==='thief'?(S.q.cnt.thief||0)-a.base>=a.n:hasItem(a.item,a.n)}
function qText(a){return a.kind==='thief'?'Render '+a.n+' ladrão(ões) ('+Math.min(a.n,(S.q.cnt.thief||0)-a.base)+'/'+a.n+')':'Entregar '+a.n+'x '+ITEMS[a.item].ic+' '+ITEMS[a.item].n+' ('+Math.min(a.n,S.inv[a.item]||0)+'/'+a.n+')'}
// ---- diálogo
function npcModal(id){
 const n=npcById(id);if(!n)return;reModal=()=>npcModal(id);
 if(id==='joao')S.tf.joao=1;
 let h='<div class="row"><b class="px" style="font-size:10px"><span class="sw" style="background:'+n.col+'"></span>'+n.n+'</b><span class="dim">'+n.role+'</span></div><div class="card" style="margin-top:6px">“'+pick(n.lines)+'”</div>';
 const mine=S.q.act.filter(a=>a.giver===id);
 mine.forEach(a=>{h+='<div class="card"><div class="row"><b>📜 Missão</b><span class="gold">'+R$(a.reward)+' · +'+a.xp+' XP</span></div><div>'+qText(a)+'</div><div class="btns"><button class="b gold" data-act="qdeliver" data-v="'+a.id+'" '+(canDeliver(a)?'':'disabled')+'>Entregar</button><button class="b gray" data-act="qdrop" data-v="'+a.id+'">Desistir</button></div></div>'});
 const o=S.q.offer&&S.q.offer[id];
 if(o&&o.exp>S.day&&!mine.length)h+='<div class="card"><div class="row"><b>📜 Pedido</b><span class="gold">'+R$(o.reward)+' · +'+o.xp+' XP</span></div><div>'+(o.kind==='thief'?'Prenda '+o.n+' ladrão(ões) que rondam a fazenda.':'Preciso de '+o.n+'x '+ITEMS[o.item].ic+' '+ITEMS[o.item].n+'.')+'</div><div class="btns"><button class="b" data-act="qaccept" data-v="'+id+'">Aceitar</button></div></div>';
 if(id==='lourdes'){const ks=['ovo','milho','trigo','tomate'].filter(k=>S.inv[k]);h+='<div class="card"><b>🥖 Padaria compra (+15%)</b><div class="btns">'+(ks.length?ks.map(k=>'<button class="b" data-act="sellnpc" data-v="'+k+'">'+ITEMS[k].ic+' '+S.inv[k]+' · '+R$(itemPrice(k)*1.15*S.inv[k])+'</button>').join(''):'<span class="dim">Traga ovos, milho, trigo ou tomate.</span>')+'</div></div>'}
 if(id==='ze')h+='<div class="btns"><button class="b gold" data-act="zeseeds">Ver sementes</button></div>';
 if(id==='marina'){const sick=S.herd.filter(a=>a.sick).length,unv=S.herd.filter(a=>a.vacc<=S.day).length;h+='<div class="card"><b>⚕️ Clínica</b><div class="btns"><button class="b red" data-act="vettreat">Tratar doentes ('+sick+') '+R$(sick*100)+'</button><button class="b" data-act="vetvacc">Vacinar não vacinados ('+unv+') '+R$(unv*6)+'</button></div></div>'}
 if(id==='ramos')h+='<div class="card"><b>🚔 Delegacia</b><div class="dim">Ladrões presos: '+S.crim.caught+' · Perdas: '+S.crim.lost+'</div><div class="btns"><button class="b '+(S.patrol?'gold':'')+'" data-act="patrol">Patrulha noturna: '+(S.patrol?'ATIVA (R$ 1.500/mês)':'contratar R$ 1.500/mês')+'</button></div></div>';
 if(id==='tiao')h+='<div class="btns"><button class="b gold" data-act="dogshop">Ver cachorros à venda</button></div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Tchau</button></div>');
}
function dogShopModal(){
 reModal=dogShopModal;
 showModal('<h3>🐕 Canil do Seu Tião</h3><div class="dim">Vagas no canil: '+S.dogs.length+' / '+kennelCap()+' (amplie na Casa Agro)</div>'+Object.keys(DOGS).map(k=>{const d=DOGS[k],own=S.dogs.some(x=>x.breed===k),lock=d.lv>LV();
  return '<div class="card '+(lock?'lock':'')+'"><div class="row"><b>'+d.n+'</b><span class="gold">'+(d.p?R$(d.p):'grátis')+'</span></div><div class="dim">'+d.d+'<br>Guarda '+d.guard+' · Rastreio '+d.track+' · Pastoreio '+d.herd+' · Mordida '+d.bite+'</div>'+(lock?'<div class="red">Requer nível '+d.lv+'</div>':own?'<div class="grn">Você já tem</div>':'<div class="btns"><button class="b gold" data-act="dogbuy" data-v="'+k+'">Comprar</button></div>')+'</div>'}).join('')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function kennelModal(){
 reModal=kennelModal;
 showModal('<h3>🏠 Canil da fazenda</h3>'+S.dogs.map(d=>{const df=DOGS[d.breed],act=d.id===S.dogAct;return '<div class="card '+(act?'sel':'')+'"><div class="row"><b>'+d.name+' <span class="dim">'+df.n+'</span></b><span class="dim">Guarda '+df.guard+' · Rastro '+df.track+'</span></div><div class="btns"><button class="b '+(act?'gray':'gold')+'" data-act="dogact" data-v="'+d.id+'">'+(act?'Companheiro de aventura':'Levar comigo')+'</button></div></div>'}).join('')+'<div class="dim">Comandos: botões 🐕 na tela (Atacar, Rastrear, Ficar) ou teclas 1 2 3. Cães que ficam no canil vigiam a fazenda à noite.</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
Object.assign(ACT,{
 qaccept(e){const o=S.q.offer[e.v];if(!o)return;if(S.q.act.length>=5)return toast('Muitas missões ativas','bad');S.q.act.push({id:S.day*10+S.q.act.length+Math.floor(Math.random()*1000),giver:e.v,kind:o.kind,item:o.item,n:o.n,reward:o.reward,xp:o.xp,base:S.q.cnt.thief||0});S.q.offer[e.v].exp=S.day;toast('📜 Missão aceita','good')},
 qdeliver(e){const a=S.q.act.find(x=>x.id==e.v);if(!a||!canDeliver(a))return;if(a.kind==='item')takeItem(a.item,a.n);cash(a.reward,'Missão: '+npcById(a.giver).n);gainXP(a.xp,'missão');S.q.act.splice(S.q.act.indexOf(a),1);S.q.done++;S.rep=Math.min(100,S.rep+.4);toast('✅ Missão concluída: '+R$(a.reward),'good')},
 qdrop(e){S.q.act=S.q.act.filter(x=>x.id!=e.v)},
 sellnpc(e){const k=e.v,n=S.inv[k]||0;if(!n)return;const v=Math.round(itemPrice(k)*1.15*n);takeItem(k,n);cash(v,'Padaria');gainXP(v/50,'venda');S.tf.sell=1;toast('💰 '+R$(v),'good')},
 zeseeds(){showModal('<div class="row"><b class="px" style="font-size:10px">Zé do Campo</b></div>'+seedSection()+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');reModal=()=>ACT.zeseeds()},
 vettreat(){const l=S.herd.filter(a=>a.sick),c=l.length*100;if(!l.length)return toast('Nenhum animal doente');if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Clínica veterinária');l.forEach(a=>{a.sick=0;a.hp=Math.min(100,a.hp+10)});toast('Animais tratados','good')},
 vetvacc(){const l=S.herd.filter(a=>a.vacc<=S.day),c=l.length*6;if(!l.length)return toast('Todos vacinados');if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Vacinas');l.forEach(a=>a.vacc=S.day+180);toast('Rebanho vacinado','good')},
 patrol(){S.patrol=!S.patrol;toast(S.patrol?'Patrulha contratada':'Patrulha dispensada')},
 dogshop(){dogShopModal()},
 dogbuy(e){const d=DOGS[e.v];if(d.lv>LV())return;if(S.dogs.length>=kennelCap())return toast('Canil cheio! Amplie na Casa Agro.','bad');if(S.money<d.p)return toast('Dinheiro insuficiente','bad');cash(-d.p,'Cachorro');const nm=pick(['Rex','Thor','Nina','Bolinha','Fiel','Duque','Mel','Trovão','Bela','Zeus']);S.dogs.push({id:Date.now()%1e7+S.dogs.length,breed:e.v,name:nm,hp:100});toast('🐕 '+nm+' ('+d.n+') chegou à fazenda!','good')},
 dogact(e){S.dogAct=+e.v;const r=dogRT(activeDog());r.st='follow'},
 dogcmd(e){setCmd(e.v)}
});
// ---- tutorial
const TUT=[
 {t:'Bem-vindo à fazenda! Vá até o celeiro (prédio vermelho) e entre nele.',done:()=>S.tf.barn,tgt:()=>({x:17*TS+8,y:46*TS+8}),rw:[200,15]},
 {t:'Vá ao pasto (portão à esquerda, abaixo da estrada) e faça carinho em uma vaca: chegue perto e toque AGIR.',done:()=>S.tf.pet,tgt:()=>({x:10*TS,y:56*TS+8}),rw:[200,15]},
 {t:'Abasteça o cocho dentro do pasto: compre ração.',done:()=>S.tf.feedb,tgt:()=>({x:TROUGH.x+24,y:TROUGH.y+14}),rw:[200,15]},
 {t:'Plante milho na lavoura (terra marrom a leste do celeiro). Fique sobre os canteiros e toque AGIR.',done:()=>S.tf.plant,tgt:()=>({x:30*TS,y:42*TS}),rw:[200,20]},
 {t:'Toque AGIR de novo na lavoura para regar as plantas.',done:()=>S.tf.water,tgt:()=>({x:30*TS,y:42*TS}),rw:[100,15]},
 {t:'Vá para casa e durma: as plantas crescem de noite (precisam de rega). Use ⏩ para acelerar o tempo.',done:()=>S.tf.slept,tgt:()=>({x:8*TS+8,y:46*TS+8}),rw:[200,20]},
 {t:'O milho leva 4 dias. Regue todo dia (chuva também rega) e colha quando brilhar: toque AGIR na lavoura.',done:()=>S.tf.harvest,tgt:()=>({x:30*TS,y:42*TS}),rw:[300,30]},
 {t:'Venda a colheita na caixa de venda ao lado da casa.',done:()=>S.tf.sell,tgt:()=>({x:SHIPBOX.x+9,y:SHIPBOX.y+16}),rw:[300,30]},
 {t:'Siga a estrada para leste até a vila e converse com Seu João, o prefeito.',done:()=>S.tf.joao,tgt:()=>({x:116*TS,y:57*TS}),npc:'joao',rw:[500,40]},
 {t:'Visite a Casa de Leilões (a cada 7 dias abre um leilão). Compre e venda gado lá.',done:()=>S.tf.auc,tgt:()=>({x:102*TS+8,y:45*TS+6}),rw:[500,40]},
 {t:'Ao norte, na mata, há a Loja do Caçador. Visite e conheça a caça. (Licença a partir do nível 2.)',done:()=>S.tf.lodge,tgt:()=>({x:49*TS+8,y:11*TS+6}),rw:[500,60]}
];
let tutT=0;
function updateTut(dt){
 tutT+=dt;if(tutT<.4)return;tutT=0;
 if(S.tut>=TUT.length)return;
 if(!S.tf.moved&&(Math.abs(P.x-13*TS)>40||Math.abs(P.y-(47*TS+8))>40))S.tf.moved=1;
 const s=TUT[S.tut];
 if(s.done()){cash(s.rw[0],'Tutorial');gainXP(s.rw[1],'tutorial');S.tut++;toast(S.tut>=TUT.length?'🎓 Tutorial concluído! Agora é com você.':'✅ Passo concluído! +'+R$(s.rw[0]),'good');renderTutBox()}
}
function renderTutBox(){
 const el=$('tut');let h='';
 if(S.tut<TUT.length)h='<b class="gold">Tutorial '+(S.tut+1)+'/'+TUT.length+'</b><br>'+TUT[S.tut].t;
 else if(S.q.act.length){const a=S.q.act[0];h='<b class="gold">📜 '+npcById(a.giver).n+'</b><br>'+qText(a)}
 el.style.display=h?'block':'none';el.innerHTML=h;
}
function guideTarget(){
 if(S.tut<TUT.length){const f=TUT[S.tut].tgt;return f?f():null}
 return null;
}
function drawGuide(g){
 const t=guideTarget();if(!t)return;
 const ox=CX,oy=CY,sx=t.x-ox,sy=t.y-oy;
 const bob=Math.sin(frame/8)*2;
 if(sx>8&&sx<VW-8&&sy>8&&sy<VH-8){Rr(g,'#ffd75e',sx-3,sy-22+bob,7,2);Rr(g,'#ffd75e',sx-2,sy-20+bob,5,2);Rr(g,'#ffd75e',sx-1,sy-18+bob,3,2);Rr(g,'#ffd75e',sx,sy-16+bob,1,2)}
 else{const a=Math.atan2(t.y-(P.y-8),t.x-P.x),cx=VW/2,cy=VH/2,m=Math.min(cx,cy)-18;
  const ex=cx+Math.cos(a)*m*(VW/VH>1?1.6:.9),ey=cy+Math.sin(a)*m*1.3;
  const px=clamp(ex,10,VW-10),py=clamp(ey,10,VH-10);
  for(let i=0;i<8;i++)Rr(g,'#ffd75e',px+Math.cos(a)*(i-2),py+Math.sin(a)*(i-2),3,3);
  Rr(g,'#2a1a10',px-1,py-1,1,1)}
}
