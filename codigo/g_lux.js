// ===== Shopping de luxo em Campo Grande: lojas de grife (nomes de paródia), relógios, chapéus, botas e guarda-roupa =====
const LUXS=[
 {id:'moda',n:'Magazine da Moda',ic:'👕',d:'Roupa boa e barata para o dia a dia.',it:[
  {id:'polo',n:'Camisa polo',s:'top',p:450,o:{shirt:'polo',sc:'#2a5aa0'}},{id:'social',n:'Camisa social azul',s:'top',p:380,o:{shirt:'social',sc:'#a8c8e8'}},
  {id:'xadv',n:'Camisa xadrez vermelha',s:'top',p:300,o:{shirt:'xadrez',sc:'#b8342a'}},{id:'jeansp',n:'Calça jeans premium',s:'bot',p:520,o:{pc:'#2a4a7a'}},{id:'cargo',n:'Calça cáqui',s:'bot',p:340,o:{pc:'#a8905a'}}]},
 {id:'lv',n:'Luís Vitton',ic:'👜',d:'Couro, monograma dourado e preço de boi gordo.',it:[
  {id:'lvbag',n:'Bolsa monograma',s:'bag',p:18000,r:2,o:{bag:'#6a4a2a'}},{id:'lvjac',n:'Jaqueta de couro marrom',s:'top',p:32000,r:3,o:{shirt:'lisa',sc:'#f0e8d8',jacket:'#5a3a22'}},
  {id:'lvsc',n:'Cachecol monograma',s:'neck',p:6500,r:1,o:{scarfN:'#8a6a3a'}},{id:'lvbelt',n:'Cinto com fivela LV',s:'belt',p:5200,r:1,o:{buckle:'#e8c860'}}]},
 {id:'gu',n:'Guccio',ic:'🐍',d:'Moda italiana com listra verde e vermelha.',it:[
  {id:'gusilk',n:'Camisa de seda estampada',s:'top',p:9800,r:2,o:{shirt:'lisa',sc:'#2a6a4a'}},{id:'gubomb',n:'Jaqueta bomber',s:'top',p:21000,r:3,o:{shirt:'lisa',sc:'#f4f4f0',jacket:'#1f4a32',scarfN:'#b8342a'}},
  {id:'gupant',n:'Calça de alfaiataria',s:'bot',p:7500,r:1,o:{pc:'#1e1e24'}},{id:'gubelt',n:'Cinto GG dourado',s:'belt',p:4200,r:1,o:{buckle:'#f0d060'}}]},
 {id:'ar',n:'Armandi Ternos',ic:'🤵',d:'Ternos sob medida para leilão de elite e casamento.',it:[
  {id:'tpreto',n:'Terno preto com gravata vermelha',s:'top',p:28000,r:3,o:{shirt:'social',sc:'#f4f4f0',jacket:'#18181f',tie:'#b8242a',pc:'#18181f'}},
  {id:'tbranco',n:'Terno branco de fazendeiro',s:'top',p:26000,r:3,o:{shirt:'social',sc:'#f4f4f0',jacket:'#ece6d6',tie:'#6a4a2a',pc:'#ece6d6'}},
  {id:'tazul',n:'Terno azul-marinho',s:'top',p:24000,r:2,o:{shirt:'social',sc:'#e8eef4',jacket:'#1e2a48',tie:'#c8a040',pc:'#1e2a48'}}]},
 {id:'ro',n:'Rolês Relojoaria',ic:'⌚',d:'Os relógios mais caros do Centro-Oeste.',it:[
  {id:'rdate',n:'Rolês Datejust aço e ouro',s:'watch',p:52000,r:3,o:{},c:'#d8c070'},{id:'rsub',n:'Rolês Submariner ouro',s:'watch',p:85000,r:4,o:{},c:'#e8c840'},
  {id:'rday',n:'Rolês Daytona platina',s:'watch',p:140000,r:6,o:{},c:'#e8ecf0'},{id:'rdiam',n:'Rolês Presidente com diamantes',s:'watch',p:320000,r:9,o:{},c:'#fff8c0'}]},
 {id:'ch',n:'Chapelaria Texas',ic:'🤠',d:'Chapéus de couro, palha fina e feltro.',it:[
  {id:'hcouro',n:'Chapéu de couro legítimo',s:'hat',p:2500,r:1,o:{hat:'vaqueiro',hatc:'#3a2414'}},{id:'hstet',n:'Stetson branco premium',s:'hat',p:12000,r:2,o:{hat:'vaqueiro',hatc:'#f0ead8'}},
  {id:'hpana',n:'Panamá de palha fina',s:'hat',p:4800,r:1,o:{hat:'palha',hatc:'#e8dcb0'}},{id:'hgau',n:'Chapéu gaúcho preto',s:'hat',p:3200,r:1,o:{hat:'gaucho',hatc:'#1a1a1a'}},{id:'hpant',n:'Chapéu pantaneiro de couro',s:'hat',p:2800,r:1,o:{hat:'pantaneiro',hatc:'#5a3a22'}}]},
 {id:'bo',n:'Botas & Cia',ic:'👢',d:'Botas texanas feitas à mão.',it:[
  {id:'bcobra',n:'Bota texana de couro de cobra',s:'shoes',p:9500,r:2,o:{boots:'#8a7050'}},{id:'bjac',n:'Bota de couro de jacaré',s:'shoes',p:15000,r:2,o:{boots:'#3e4a32'}},{id:'bpreta',n:'Bota preta lustrada',s:'shoes',p:3800,r:1,o:{boots:'#141414'}}]},
 {id:'rb',n:'Ótica Ray-Bom',ic:'🕶️',d:'Óculos escuros para o sol do pantanal.',it:[
  {id:'oavi',n:'Óculos aviador dourado',s:'glasses',p:2900,r:1,o:{glasses:1}},{id:'owf',n:'Óculos quadrado preto',s:'glasses',p:1900,r:1,o:{glasses:1}}]}
];
const LUXI={};LUXS.forEach(st=>st.it.forEach(i=>{i.st=st.id;LUXI[i.id]=i}));
const SLOTN={top:'Camisa / paletó',bot:'Calça',hat:'Chapéu',shoes:'Botas',watch:'Relógio',bag:'Bolsa',neck:'Cachecol',belt:'Cinto',glasses:'Óculos'};
function ensureWd(){if(!S.wd)S.wd={own:{},eq:{}};return S.wd}
// aplica a roupa no boneco do jogador (modo casual)
const _lthLux=lookToH;lookToH=function(L){const H=_lthLux(L);if(S&&L===S.look&&S.wd){const E=S.wd.eq;for(const s of['bot','top','hat','shoes','neck','belt','bag','glasses']){const i=E[s]&&LUXI[E[s]];if(i)Object.assign(H,i.o)}}return H};
const _dpbLux=drawPlayerBase;drawPlayerBase=function(g){_dpbLux(g);const W=S.wd;if(!W||!W.eq.watch||S.h.outfit!=='casual'||P.drive||RMODE===4)return;const i=LUXI[W.eq.watch];if(!i)return;
 const bob=P.moving?Math.abs(Math.cos(P.ph))*.8:0,side=P.dir>=2,x=side?P.x+(P.dir===3?1.6:-2.6):P.x+3.4,y=P.y-bob-9.6;Rr(g,i.c,x,y,1.4,1);if(((frame+30)%140)<8){Rr(g,'#ffffff',x+.3,y-1.4,.6,3.6);Rr(g,'#ffffff',x-1,y+.2,3.2,.6)}};
function luxShopModal(){showModal('<h3>🛍️ Shopping Campo Grande</h3><div class="dim">Lojas de grife, relojoaria e chapelaria. Roupa nova aparece no seu personagem quando você veste (roupa casual).</div>'+
 LUXS.map(s=>'<div class="card"><div class="row"><b>'+s.ic+' '+s.n+'</b><span class="dim">'+s.it.length+' itens</span></div><div class="dim">'+s.d+'</div><div class="btns"><button class="b gold" data-act="lxst" data-v="'+s.id+'">Entrar</button></div></div>').join('')+
 '<div class="btns"><button class="b" data-act="wdrobe" data-v="city">👔 Meu guarda-roupa</button><button class="b" data-act="cshopold">🎁 Presentes e binóculo</button><button class="b gray" data-act="ccity">⬅️ Voltar</button></div>')}
function luxStore(id){const s=LUXS.find(x=>x.id===id),W=ensureWd();if(!s)return;LXV='st';
 showModal('<h3>'+s.ic+' '+s.n+'</h3><div class="dim">'+s.d+'</div>'+s.it.map(i=>{const own=W.own[i.id],on=W.eq[i.s]===i.id;return '<div class="card"'+(on?' style="border-color:#c8a040"':'')+'><div class="row"><b>'+i.n+'</b><span class="gold">'+R$(i.p)+'</span></div><div class="dim">'+SLOTN[i.s]+(i.r?' · +'+i.r+' reputação':'')+'</div><div class="btns">'+(own?(on?'<button class="b gray" data-act="lxoff" data-v="'+i.id+'">Tirar</button>':'<button class="b gold" data-act="lxon" data-v="'+i.id+'">Vestir</button>'):'<button class="b gold" data-act="lxbuy" data-v="'+i.id+'">Comprar</button>')+'</div></div>'}).join('')+
 '<div class="btns"><button class="b gray" data-act="cshop">⬅️ Lojas</button></div>')}
function wardrobe(from){LXV='wd';const W=ensureWd(),ids=Object.keys(W.own);
 const bySlot={};ids.forEach(id=>{const i=LUXI[id];if(i)(bySlot[i.s]=bySlot[i.s]||[]).push(i)});
 let h='<h3>👔 Guarda-roupa</h3><div class="dim">'+(S.h.outfit!=='casual'?'⚠️ Você está com roupa de caça. Troque para a casual para ver a roupa de grife.':'Vista e tire o que quiser.')+'</div>';
 if(!ids.length)h+='<div class="card dim">Vazio. Compre roupas no shopping de Campo Grande.</div>';
 for(const s in SLOTN){const L=bySlot[s];if(!L)continue;h+='<div class="sec">'+SLOTN[s].toUpperCase()+'</div>'+L.map(i=>{const on=W.eq[s]===i.id;return '<div class="card"'+(on?' style="border-color:#c8a040"':'')+'><div class="row"><b>'+i.n+'</b><span class="dim">'+LUXS.find(x=>x.id===i.st).n+'</span></div><div class="btns">'+(on?'<button class="b gray" data-act="lxoff" data-v="'+i.id+'">Tirar</button>':'<button class="b gold" data-act="lxon" data-v="'+i.id+'">Vestir</button>')+'</div></div>'}).join('')}
 const val=ids.reduce((s,id)=>s+(LUXI[id]?LUXI[id].p:0),0);h+='<div class="dim">Valor do guarda-roupa: '+R$(val)+'</div>';
 showModal(h+'<div class="btns">'+(from==='city'?'<button class="b gray" data-act="cshop">⬅️ Lojas</button>':'<button class="b gray" data-act="close">Fechar</button>')+'</div>');WDF=from}
let WDF='',LXS='',LXV='';
Object.assign(ACT,{
 cshopold:ACT.cshop,
 cshop(){luxShopModal()},
 lxst(e){LXS=e.v;luxStore(e.v)},
 lxbuy(e){const i=LUXI[e.v],W=ensureWd();if(!i||W.own[i.id])return;if(S.money<i.p)return toast('Dinheiro insuficiente','bad');cash(-i.p,i.n+' ('+LUXS.find(x=>x.id===i.st).n+')');W.own[i.id]=1;W.eq[i.s]=i.id;if(i.r)S.rep=Math.min(100,(S.rep||0)+i.r);S.t+=.25/24;
  if(S.h.outfit!=='casual')S.h.outfit='casual';toast('🛍️ Comprou e já vestiu: '+i.n+(i.r?' (+'+i.r+' reputação)':''),'good');luxStore(i.st)},
 lxon(e){const i=LUXI[e.v],W=ensureWd();if(!i||!W.own[i.id])return;W.eq[i.s]=i.id;if(S.h.outfit!=='casual')S.h.outfit='casual';toast('👔 Vestiu: '+i.n);LXV==='wd'?wardrobe(WDF):luxStore(i.st)},
 lxoff(e){const i=LUXI[e.v],W=ensureWd();if(!i)return;if(W.eq[i.s]===i.id)delete W.eq[i.s];toast('Tirou: '+i.n);LXV==='wd'?wardrobe(WDF):luxStore(i.st)},
 wdrobe(e){wardrobe(e.v||'')}
});
// guarda-roupa também em Melhorias
const _pUpLux=pUp;pUp=function(){const W=ensureWd(),n=Object.keys(W.own).length;return (n?'<div class="card"><div class="row"><b>👔 Guarda-roupa</b><span class="gold">'+n+' peças</span></div><div class="btns"><button class="b gold" data-act="wdrobe">Abrir</button></div></div>':'')+_pUpLux()};
// moradores reparam na roupa cara
let luxT=0;const _updLux=update;update=function(dt){_updLux(dt);luxT-=dt;if(luxT>0||!S.wd||!inTown())return;luxT=25;const E=S.wd.eq,val=Object.values(E).reduce((s,id)=>s+(LUXI[id]?LUXI[id].p:0),0);if(val<20000||S.h.outfit!=='casual')return;
 if(Math.random()<.5)toast('💬 '+pick(['“Olha o patrão chique!”','“Esse relógio aí vale uma boiada, hein?”','“Tá parecendo artista de novela!”','“Que roupa bonita, doutor!”','“Vai pra festa, é?”']))};
