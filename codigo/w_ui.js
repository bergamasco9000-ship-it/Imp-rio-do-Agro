let SEL=0,menuOpen=false,reModal=null,LSEC='arms';
const paused=()=>menuOpen||$('modal').style.display==='flex';
function showModal(h){$('mbox').innerHTML=h;$('modal').style.display='flex';modalOpen=true}
function hideModal(){
 $('modal').style.display='none';if(AUC&&AUC.timer)clearInterval(AUC.timer);AUC=null;reModal=null;modalOpen=menuOpen;renderAll();
}
function openMenu(t){tab=t||tab;lim=15;menuOpen=true;modalOpen=true;$('menu').style.display='block';$('menu').scrollTop=0;renderAll()}
function closeMenu(){menuOpen=false;modalOpen=$('modal').style.display==='flex';$('menu').style.display='none';renderHUD()}
function renderAll(){
 renderHUD();
 if(!menuOpen)return;
 $('tabs').innerHTML=TABS.map(t=>'<button data-act="tab" data-v="'+t[0]+'" class="'+(tab===t[0]?'on':'')+'">'+t[1]+'</button>').join('');
 renderPanel();
}
function renderHUD(){
 const mon=Math.floor((S.day%360)/30),hh=Math.floor(S.t*24),mm=Math.floor((S.t*24%1)*60);
 const wa=S.wind?S.wind.a:0;
 $('hudL').innerHTML='<div class="m '+(S.money<0?'red':'')+'">'+R$(S.money)+'</div><div>'+(S.day%30+1)+'/'+MONTHS[mon]+' · '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')+'</div>'
  +'<div class="dim" style="font-size:16px">'+(S.drought>0?'🌵 Seca':S.weather==='chuva'?'🌧️ Chuva':isWet()?'☀️ Chuvas':'☀️ Seca')+' · Vento <span style="display:inline-block;transform:rotate('+wa+'rad);color:#9ad8f5">➤</span></div>'
  +(P.hp<100?'<div class="bar"><i style="width:'+Math.max(0,P.hp)+'%;background:#d9503f"></i></div>':'');
 setH($('hudR'),[[0,'⏸'],[1,'▶'],[6,'⏩'],[20,'⏭']].map(s=>'<button data-act="spd" data-v="'+s[0]+'" class="'+(speed===s[0]?'on':'')+'">'+s[1]+'</button>').join('')+'<button data-act="menu">☰</button><button data-act="help">?</button>');
}
function updateHuntHud(){
 const h=$('hudH'),id=S.h.eq,w=id&&WEAPONS[id];
 if(!w){h.style.display='none'}else{
  h.style.display='block';
  h.innerHTML='<b>'+w.n+'</b> · 🔫 '+(S.h.mag[id]||0)+'/'+(S.h.ammo[w.ammo]||0)+(AIM.relT>0?' (recarregando)':'')
  +'<br><span class="dim" style="font-size:16px">Camuflagem '+Math.round((1-playerVis())*100)+'% · Ruído '+Math.round(noiseR())+' · Carga '+Math.round(P.carry)+' kg · Nv '+hLvl()+'</span>';
 }
 $('bAim').style.display=w?'flex':'none';$('bBin').style.display=S.h.gear.binoc?'flex':'none';
 $('bUse').style.display=(S.h.cons.scent||S.h.cons.lure||S.h.cons.call)?'flex':'none';
 ['bFire','bHold','bRel'].forEach(i=>$(i).style.display=P.aim?'flex':'none');
 $('bAim').classList.toggle('on',!!P.aim);$('bSneak').classList.toggle('on',!!P.sneak);$('bBin').classList.toggle('on',!!AIM.bin);
}
// ---------- hunt tab & shop
function pHunt(){
 const H=S.h,licOk=H.lic>S.day;
 let h='<div class="card"><h3>🎒 Caçador nível '+hLvl()+'</h3><div class="dim">Abates: '+Object.keys(H.kills).map(k=>SPECIES[k].n+' '+H.kills[k]).join(', ')+(Object.keys(H.kills).length?'':'nenhum ainda')+' · Tiros limpos: '+H.clean+' · Multas: '+R$(H.fines)+'</div>'
 +'<div>Licença: '+(licOk?'<b class="grn">válida por '+(H.lic-S.day)+' dias</b>':'<b class="red">não possui</b> (compre na Loja do Caçador, no meio da mata, ao norte)')+'</div></div>';
 h+='<div class="sec">ARMAS</div>';
 const ow=Object.keys(WEAPONS).filter(k=>H.own[k]);
 h+=ow.length?ow.map(k=>'<div class="card '+(H.eq===k?'sel':'')+'"><div class="row"><b>'+wIcon(k,1)+' '+WEAPONS[k].n+'</b><span class="dim">'+(H.mag[k]||0)+'/'+WEAPONS[k].cap+' · reserva '+(H.ammo[WEAPONS[k].ammo]||0)+'</span></div><div class="btns"><button class="b '+(H.eq===k?'gray':'gold')+'" data-act="hequip" data-v="'+k+'">'+(H.eq===k?'Equipada':'Equipar')+'</button></div></div>').join(''):'<div class="dim">Nenhuma arma. Visite a Loja do Caçador.</div>';
 h+='<div class="sec">ROUPAS</div>'+Object.keys(OUTFITS).filter(k=>H.outs[k]).map(k=>{const o=OUTFITS[k];return '<div class="card '+(H.outfit===k?'sel':'')+'"><div class="row"><b><span class="sw" style="background:'+o.c[0]+'"></span>'+o.n+'</b><span class="gold">camuflagem '+Math.round(o.camo*100)+'%</span></div><div class="btns"><button class="b '+(H.outfit===k?'gray':'gold')+'" data-act="hwear" data-v="'+k+'">'+(H.outfit===k?'Vestindo':'Vestir')+'</button></div></div>'}).join('');
 h+='<div class="sec">EQUIPAMENTO</div><div class="card dim">'+Object.keys(GEAR).map(k=>GEAR[k].n+': '+(H.gear[k]?'✅':'—')).join(' · ')+'<br>'+Object.keys(CONS).map(k=>CONS[k].n+': '+H.cons[k]).join(' · ')+'</div>';
 h+='<div class="sec">CARCAÇAS NA MOCHILA ('+Math.round(P.carry)+' kg)</div>'+(H.bag.length?H.bag.map(c=>'<div class="card"><div class="row"><b>'+SPECIES[c.sp].n+(c.pts>=10?' 🏆'+c.pts:'')+'</b><span class="gold">'+R$(carcassValue(c))+'</span></div><div class="dim">'+c.kg+' kg · qualidade '+Math.round(c.q*100)+'%</div></div>').join('')+'<div class="dim">Venda na Loja do Caçador.</div>':'<div class="dim">Vazia.</div>');
 h+='<div class="sec">COMO CAÇAR</div><div class="card dim" style="line-height:1.2">• Mire (🎯) e atire só na mata. Perto da fazenda é proibido.<br>• <b>Vento:</b> a seta ➤ mostra para onde o cheiro vai. Aproxime-se com o vento soprando do animal para você.<br>• Agache (🐾) e use camuflagem: parado e agachado você quase some.<br>• Segure o fôlego (😮‍💨) para firmar a mira. Tiro no peito = abate limpo. Tiro ruim = bicho ferido: siga o <b class="red">rastro de sangue</b>.<br>• Respeite as temporadas: fora delas há multa. Javali e coelho valem o ano todo.<br>• Colete a carcaça (✋) e venda na loja. Troféus valem muito mais.</div>';
 return h;
}
function lodgeModal(sec){
 LSEC=sec||LSEC;reModal=()=>lodgeModal();const H=S.h,licOk=H.lic>S.day;
 const secs=[['arms','Armas'],['ammo','Munição'],['cloth','Roupas'],['gear','Itens'],['lic','Licença'],['sell','Vender caça']];
 let h='<h3>🌲 Loja do Caçador</h3><div class="dim">"Aqui no fundo da mata a gente só vende o que presta." Licença: '+(licOk?'<span class="grn">válida</span>':'<span class="red">necessária</span>')+' · Caixa '+R$(S.money)+'</div>'
 +'<div class="pills" style="margin-top:6px">'+secs.map(s=>'<button data-act="lodge" data-v="'+s[0]+'" class="'+(LSEC===s[0]?'on':'')+'">'+s[1]+'</button>').join('')+'</div>';
 const item=(name,desc,price,btn)=>'<div class="card"><div class="row"><b>'+name+'</b><span class="gold">'+(price?R$(price):'')+'</span></div><div class="dim">'+desc+'</div><div class="btns">'+btn+'</div></div>';
 if(LSEC==='arms')h+=Object.keys(WEAPONS).filter(k=>(!WEAPONS[k].leg&&!WEAPONS[k].blk)||H.own[k]).map(k=>{const w=WEAPONS[k];return item(wIcon(k)+' '+w.n,wDesc(k),H.own[k]?0:w.p,H.own[k]?'<span class="grn">Você já tem</span>':'<button class="b gold" data-act="hbuy" data-v="w:'+k+'">Comprar</button>')}).join('');
 if(LSEC==='ammo')h+=Object.keys(AMMO).map(k=>{const a=AMMO[k];return item(a.n,'Em estoque: '+(H.ammo[k]||0),a.p,'<button class="b" data-act="hbuy" data-v="a:'+k+'">Comprar</button>')}).join('');
 if(LSEC==='cloth')h+=Object.keys(OUTFITS).filter(k=>k!=='casual').map(k=>{const o=OUTFITS[k];return item('<span class="sw" style="background:'+o.c[0]+'"></span>'+o.n,o.d+' Camuflagem '+Math.round(o.camo*100)+'%.',H.outs[k]?0:o.p,H.outs[k]?'<button class="b gray" data-act="hwear" data-v="'+k+'">'+(H.outfit===k?'Vestindo':'Vestir')+'</button>':'<button class="b gold" data-act="hbuy" data-v="o:'+k+'">Comprar</button>')}).join('');
 if(LSEC==='gear')h+=Object.keys(GEAR).map(k=>{const g=GEAR[k];return item(g.n,g.d,H.gear[k]?0:g.p,H.gear[k]?'<span class="grn">Você já tem</span>':'<button class="b gold" data-act="hbuy" data-v="g:'+k+'">Comprar</button>')}).join('')
  +Object.keys(CONS).map(k=>{const c=CONS[k];return item(c.n+' (tem '+H.cons[k]+')',c.d,c.p,'<button class="b" data-act="hbuy" data-v="c:'+k+'">Comprar</button>')}).join('');
 if(LSEC==='lic'){
  h+=item('Licença de caça (1 ano)','Obrigatória para usar armas. Valor R$ 600.'+(licOk?' Vence em '+(H.lic-S.day)+' dias.':''),600,'<button class="b gold" data-act="hlic">'+(licOk?'Renovar':'Tirar licença')+'</button>');
  h+='<div class="card"><b>Temporadas de caça</b><table>'+Object.keys(SPECIES).map(k=>{const s=SPECIES[k].season;return '<tr><td>'+SPECIES[k].n+'</td><td class="dim">'+(s?s.map(m=>MONTHS[m]).join(' '):'o ano todo')+'</td><td class="'+(legalSeason(k)?'grn':'red')+'">'+(legalSeason(k)?'ABERTA':'FECHADA')+'</td></tr>'}).join('')+'</table><div class="dim">Caça fora de temporada = multa de R$ 2.500 e perda de reputação.</div></div>';
 }
 if(LSEC==='sell'){
  const tot=H.bag.reduce((s,c)=>s+carcassValue(c),0);
  h+=H.bag.length?H.bag.map((c,i)=>item(SPECIES[c.sp].n+(c.pts>=10?' 🏆 '+c.pts+' pontas':''),c.kg+' kg · qualidade '+Math.round(c.q*100)+'%'+(c.q<.8?' (tiro ruim/demora)':''),carcassValue(c),'<button class="b gold" data-act="hsell" data-v="'+i+'">Vender</button>')).join('')+'<div class="btns"><button class="b gold" data-act="hsell" data-v="all">Vender tudo '+R$(tot)+'</button></div>':'<div class="dim">Sua mochila está vazia. Cace e traga a carcaça.</div>';
 }
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Sair da loja</button></div>');
}
function cowModal(id){
 const a=find(id);if(!a)return hideModal();reModal=()=>cowModal(id);SEL=id;
 showModal('<div class="row"><b class="px" style="font-size:10px">🐄 '+a.name+'</b><button class="b gray" data-act="close">✕</button></div>'+card(a)+'<div class="btns"><button class="b" data-act="pet" data-id="'+id+'">❤️ Fazer carinho'+(a.pet===S.day?' (feito)':'')+'</button></div>');
}
function troughModal(){
 reModal=troughModal;
 showModal('<h3>🪣 Cocho</h3><div class="card"><div>Estoque de ração: <b class="gold">'+Math.floor(S.feed)+' / '+siloCap()+' kg</b></div><div class="dim">Preço '+R$(feedPrice())+'/kg · Pasto '+Math.round(S.pasture)+'%</div><div class="btns">'+[100,500,2000].map(v=>'<button class="b" data-act="feed" data-v="'+v+'">+'+v+' kg</button>').join('')+'<button class="b '+(S.suppl?'':'gray')+'" data-act="suppl">Suplemento: '+(S.suppl?'LIGADO':'DESLIGADO')+'</button></div></div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function mailModal(){
 reModal=mailModal;
 showModal('<h3>📬 Caixa de correio</h3>'+(S.offers.length?S.offers.map(o=>{const a=find(o.id);return a?'<div class="card"><div class="row"><span>'+o.buyer+' quer <b>'+a.name+'</b> por <b class="gold">'+R$(o.price)+'</b></span><button class="b gold" data-act="offer" data-id="'+o.id+'">Aceitar</button></div><div class="dim">Válida até o dia '+o.exp+'</div></div>':''}).join(''):'<div class="dim">Nenhuma proposta de compra por enquanto.</div>')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function useModal(){
 showModal('<h3>🧪 Usar item</h3>'+Object.keys(CONS).map(k=>'<div class="card"><div class="row"><b>'+CONS[k].n+' ('+S.h.cons[k]+')</b><button class="b" data-act="huse" data-v="'+k+'">Usar</button></div><div class="dim">'+CONS[k].d+'</div></div>').join('')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function sleepModal(){showModal('<h3>🛏️ Dormir?</h3><p>Descansar até a manhã seguinte e salvar o jogo.</p><div class="btns"><button class="b gold" data-act="sleep">Dormir</button><button class="b gray" data-act="close">Agora não</button></div>')}
function helpModal(){
 showModal('<h3>🐂 Fazenda Boi de Ouro</h3><div style="line-height:1.25"><p>Ande pelo mundo e cuide da sua fazenda: entre no <b>pasto</b> (portão à esquerda), faça carinho nas vacas e abasteça o <b>cocho</b>.</p>'
 +'<p>• <b>Celeiro:</b> gerencia o rebanho · <b>Casa:</b> dorme e salva · <b>Leilões, Banco e Casa Agro</b> ficam na cidade, a leste (siga a estrada).</p>'
 +'<p>• Ao <b>norte</b>, pela trilha na mata, fica a <b>Loja do Caçador</b>: licença, armas, roupas camufladas e venda da caça.</p>'
 +'<p>• Dica: ponha a ração em dia antes da seca e vacine nas campanhas de maio e novembro.</p>'
 +'<p class="dim">PC: WASD, Shift correr, E agir, botão direito mirar, clique atirar, C agachar. Celular: joystick e botões na tela.</p></div><div class="btns"><button class="b gold" data-act="close">Vamos lá!</button></div>');
}
// ---------- actions
Object.assign(ACT,{
 menu(){openMenu()},menuclose(){closeMenu()},
 spd(e){speed=+e.v},
 pet(e){const a=find(e.id);if(a&&a.pet!==S.day){a.pet=S.day;a.hp=Math.min(100,a.hp+3);S.rep=Math.min(100,S.rep+.03);toast('❤️ '+a.name+' gostou do carinho','good')}},
 sleep(){if(S.t>=.25)dayTick();S.t=.3;P.hp=100;save();hideModal();toast('☀️ Bom dia! Jogo salvo.','good')},
 lodge(e){LSEC=e.v},
 hbuy(e){
  const [k,id]=e.v.split(':'),H=S.h;let price=0;
  if(k==='w'){price=WEAPONS[id].p;if(!(H.lic>S.day))return toast('Tire a licença de caça primeiro!','bad')}
  if(k==='a')price=AMMO[id].p;if(k==='o')price=OUTFITS[id].p;if(k==='g')price=GEAR[id].p;if(k==='c')price=CONS[id].p;
  if(S.money<price)return toast('Dinheiro insuficiente','bad');
  cash(-price,'Loja do Caçador');
  if(k==='w'){H.own[id]=1;if(!H.eq)ACT.hequip({v:id})}
  if(k==='a'){H.ammo[id]=(H.ammo[id]||0)+AMMO[id].q;const ew=H.eq&&WEAPONS[H.eq];if(ew&&ew.ammo===id){const t=Math.min(ew.cap-(H.mag[H.eq]||0),H.ammo[id]);H.mag[H.eq]=(H.mag[H.eq]||0)+t;H.ammo[id]-=t}}
  if(k==='o'){H.outs[id]=1;H.outfit=id}
  if(k==='g')H.gear[id]=1;
  if(k==='c')H.cons[id]++;
  toast('Comprado!','good');
 },
 hequip(e){const H=S.h,w=WEAPONS[e.v];H.eq=e.v;const need=w.cap-(H.mag[e.v]||0),take=Math.min(need,H.ammo[w.ammo]||0);H.mag[e.v]=(H.mag[e.v]||0)+take;H.ammo[w.ammo]=(H.ammo[w.ammo]||0)-take;P.aim=0},
 hwear(e){S.h.outfit=e.v},
 hlic(){if(S.money<600)return toast('Dinheiro insuficiente','bad');cash(-600,'Licença de caça');S.h.lic=Math.max(S.h.lic,S.day)+360;toast('Licença válida por 1 ano','good')},
 hsell(e){
  const H=S.h;let list=e.v==='all'?H.bag.slice():[H.bag[+e.v]],t=0;
  list.forEach(c=>{if(c){t+=carcassValue(c);H.bag.splice(H.bag.indexOf(c),1)}});
  if(t){cash(t,'Venda de caça');H.earned+=t;S.rep=Math.min(100,S.rep+.15*list.length);toast('💰 Caça vendida: '+R$(t),'good')}
  P.carry=H.bag.reduce((s,c)=>s+c.kg,0);
 },
 huse(e){useItem(e.v);hideModal()},
 reset2(){newGame();ensureH();S.aucOpen={type:'comum',until:273,lots:null};newStraws();SEL=0;SP.clear();WILD.length=0;BLOOD.length=0;rebuildFence();spawnAll();P.x=13*TS;P.y=47*TS+8;hideModal();closeMenu();helpModal()}
});
function enterBld(id){
 if(id==='house')sleepModal();else if(id==='barn')openMenu('herd');else if(id==='leilao')openMenu('auc');
 else if(id==='banco')openMenu('fin');else if(id==='agro')openMenu('market');else if(id==='lodge')lodgeModal('arms');
}
function interactList(){
 const L=[];
 BLD.forEach(b=>L.push({x:b.door*TS+8,y:(b.y+b.h)*TS+6,r:22,label:b.label,fn:()=>enterBld(b.id)}));
 L.push({x:TROUGH.x+24,y:TROUGH.y+14,r:28,label:'Cocho (ração)',fn:troughModal});
 L.push({x:MAILBOX.x,y:MAILBOX.y+12,r:20,label:'Caixa de correio'+(S.offers.length?' ('+S.offers.length+')':''),fn:mailModal});
 for(const a of S.herd){const s=spriteOf(a);L.push({x:s.x+8,y:s.y+5,r:20,label:a.name+' ('+BREEDS[a.breed].n+')',fn:()=>cowModal(a.id),cow:1})}
 huntInteracts(L);return L;
}
let NEAR=null;
function findNear(){
 let best=null,bs=9;for(const it of interactList()){const d=Math.hypot(it.x-P.x,it.y-(P.y-4));if(d<it.r&&d/it.r<bs){bs=d/it.r;best=it}}NEAR=best;
}
function interact(){if(P.aim||paused())return;findNear();if(NEAR)NEAR.fn()}
// ---------- input
const KEY={};let jx=0,jy=0,jid=null;
const isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;if(isTouch)document.body.classList.add('touch');
function toggleAim(){
 if(!S.h.eq)return toast('Equipe uma arma na aba Caça (Menu)','bad');
 P.aim=!P.aim;AIM.bin=0;AIM.mx=null;
 if(P.aim){const v=[[0,1],[0,-1],[-1,0],[1,0]][P.dir];AIM.rx=P.x+v[0]*90;AIM.ry=P.y-6+v[1]*90}
}
function toggleBin(){if(!S.h.gear.binoc)return;AIM.bin=!AIM.bin;if(AIM.bin)P.aim=0}
addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();KEY[k]=1;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
 if(k==='escape'){if($('modal').style.display==='flex')hideModal();else if(menuOpen)closeMenu();else openMenu()}
 if(paused())return;
 if(k==='e'||k==='enter')interact();if(k===' '){P.aim?fire():interact()}
 if(k==='q')toggleAim();if(k==='c')P.sneak=!P.sneak;if(k==='r')startReload();if(k==='b')toggleBin();if(k==='u')useModal();if(k==='m')openMenu();if(k==='h')helpModal();if(k==='z')setCmd(dogRT(activeDog()).st==='stay'?'follow':'stay');if(k==='x')setCmd('attack');if(k==='v')setCmd('track');if(/^[1-6]$/.test(k))hotUse(+k-1);if(k==='t'&&typeof mateModal==='function')mateModal();
});
addEventListener('keyup',e=>{KEY[e.key.toLowerCase()]=0});
CV.addEventListener('mousemove',e=>{if(!P.aim)return;const r=CV.getBoundingClientRect();AIM.mx=(e.clientX-r.left)/r.width*VW+CX;AIM.my=(e.clientY-r.top)/r.height*VH+CY});
CV.addEventListener('mousedown',e=>{if(paused())return;if(e.button===2)toggleAim();else if(e.button===0&&P.aim)fire()});
CV.addEventListener('contextmenu',e=>e.preventDefault());
function jmove(e){const r=$('joy').getBoundingClientRect();let dx=(e.clientX-r.left-r.width/2)/58,dy=(e.clientY-r.top-r.height/2)/58;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}jx=dx;jy=dy;$('knob').style.transform='translate('+dx*34+'px,'+dy*34+'px)'}
function jend(e){if(e.pointerId!==jid)return;jid=null;jx=jy=0;$('knob').style.transform=''}
$('joy').addEventListener('pointerdown',e=>{jid=e.pointerId;$('joy').setPointerCapture(e.pointerId);jmove(e);e.preventDefault()});
$('joy').addEventListener('pointermove',e=>{if(e.pointerId===jid)jmove(e)});
$('joy').addEventListener('pointerup',jend);$('joy').addEventListener('pointercancel',jend);
const bind=(id,f,up)=>{const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();if(paused())return;f()});if(up){el.addEventListener('pointerup',up);el.addEventListener('pointerleave',up);el.addEventListener('pointercancel',up)}};
bind('bE',interact);bind('bAim',toggleAim);bind('bFire',fire);bind('bSneak',()=>{P.sneak=!P.sneak});bind('bRel',startReload);bind('bBin',toggleBin);bind('bUse',useModal);
bind('bDogA',()=>setCmd('attack'));bind('bDogT',()=>setCmd('track'));bind('bDogS',()=>setCmd(dogRT(activeDog()).st==='stay'?'follow':'stay'));
bind('bHold',()=>{KEY.hold=1},()=>{KEY.hold=0});
function getInput(){
 let x=(KEY.d||KEY.arrowright?1:0)-(KEY.a||KEY.arrowleft?1:0),y=(KEY.s||KEY.arrowdown?1:0)-(KEY.w||KEY.arrowup?1:0),run=!!KEY.shift;
 if(x||y){const m=Math.hypot(x,y);x/=m;y/=m;return{x,y,mag:1,run}}
 const m=Math.hypot(jx,jy);if(m>.15)return{x:jx/Math.max(m,1),y:jy/Math.max(m,1),mag:m,run:m>.93};
 return{x:0,y:0,mag:0,run:false};
}
function update(dt){
 const inp=getInput();AIM.hold=P.aim&&(KEY.shift||KEY.hold)?1:0;
 if(P.aim){P.moving=0;P.run=0;P.vx=P.vy=0}
 else{
  let sp=70;if(P.sneak)sp=34;else if(inp.run&&!AIM.bin)sp=(S.horse&&S.horseOn?HSPD():118);if(AIM.bin)sp*=.5;
  if(S.horse&&S.horseOn&&!P.sneak&&sp<110)sp=Math.max(sp,110);
  sp*=clamp(1-Math.max(0,P.carry-(S.h.gear.pack?70:35))/220,.55,1);
  const on=inp.mag>.15,tvx=on?inp.x*sp:0,tvy=on?inp.y*sp:0,ac=(on?640:1100)*dt;
  P.vx+=clamp(tvx-P.vx,-ac,ac);P.vy+=clamp(tvy-P.vy,-ac,ac);
  const spd=Math.hypot(P.vx,P.vy);P.moving=spd>7?1:0;P.run=spd>96?1:0;
  if(on)P.dir=Math.abs(inp.x)>Math.abs(inp.y)*1.1?(inp.x>0?3:2):(inp.y>0?0:1);
  if(P.moving){
   const bx=P.x,by=P.y;movePlayer(P.vx*dt,0);if(P.x===bx&&Math.abs(P.vx)>1)P.vx=0;movePlayer(0,P.vy*dt);if(P.y===by&&Math.abs(P.vy)>1)P.vy=0;
   P.ph+=spd*dt*(P.sneak?.15:.135);
   if(AIM.pick)AIM.pick=null;
  }
 }
 if(AIM.pick){AIM.pick.t+=dt;if(AIM.pick.t>=AIM.pick.T)finishPick()}
 stepPart(dt);stepCows(dt);stepCH(dt);stepDogs(dt);stepThieves(dt);stepNPC(dt);updateTut(dt);stepWild(dt);updateHunt(dt,inp);resolveShots(dt);
 S.wind.a+=gauss()*.03*dt;
 if(P.hp<100&&P.hp>0)P.hp=Math.min(100,P.hp+dt*.5);
 if(P.hp<=0){P.hp=60;cash(-500,'Hospital');P.x=8*TS+8;P.y=47*TS+8;P.aim=0;S.t=Math.max(S.t,.35);toast('🏥 Você desmaiou e acordou na cidade. Hospital: R$ 500.','bad')}
 if(P.aim&&!S.h.eq)P.aim=0;
}
let last=performance.now(),hudT=0,camInit=0;
function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;frame++;
 if(!paused()&&!S.over){
  const mult=(P.aim||AIM.bin)?Math.min(speed,1):speed;
  S.t+=dt*mult*1000/dayMs();let n=0;
  while(S.t>=1&&n++<10){S.t-=1;dayTick();dayFlag=1}
  if(dayFlag){dayFlag=0;if(S.over)gameOver()}
  update(dt);
  findNear();
  const hint=$('hint');
  if(NEAR&&!P.aim){hint.style.display='block';hint.textContent=(isTouch?'✋ ':'[E] ')+NEAR.label}else hint.style.display='none';
  const pk=$('prog');if(AIM.pick){pk.style.display='block';$('progt').textContent='Coletando...';$('progb').style.width=Math.min(100,AIM.pick.t/AIM.pick.T*100)+'%'}else pk.style.display='none';
 }
 let tx=P.x-VW/2+P.vx*.2,ty=P.y-10-VH/2+P.vy*.2;if(P.aim){tx+=(AIM.rx-P.x)*.45;ty+=(AIM.ry-P.y)*.45}
 tx=clamp(tx,0,WW-VW);ty=clamp(ty,0,WH-VH);
 if(!camInit){cam.x=tx;cam.y=ty;camInit=1}else{const k=1-Math.exp(-dt*8);cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k}
 drawScene();
 hudT+=dt;if(hudT>.2){hudT=0;updateHuntHud();if(!paused())renderHUD()}
 requestAnimationFrame(loop);
}
function gameOver(){showModal('<h3>💀 Falência</h3><p>Você ficou sem caixa e com dívidas demais.</p><div class="btns"><button class="b red" data-act="reset2">Recomeçar</button></div>')}
document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-act]');if(!el)return;
 const f=ACT[el.dataset.act];if(!f)return;
 f({id:el.dataset.id,v:el.dataset.v});
 const k=el.dataset.act;
 if(['enter','bid','leave','help','close','menu','menuclose','sleep','reset2','huse'].includes(k))return;
 renderAll();if(reModal&&$('modal').style.display==='flex')reModal();
});
