// ===== Economia com valores reais (2026) + financiamento rural =====
// Referências (nov/2026): arroba do boi ~R$ 380-390 (Cepea), bezerro de desmama ~R$ 3.600, leite ~R$ 2,70/L,
// milho ~R$ 66/sc, soja ~R$ 137/sc, café arábica ~R$ 1.600/sc, trator 75 cv usado ~R$ 70-130 mil (FIPE),
// Hilux SRX 2026 ~R$ 317 mil, caminhão Atego seminovo ~R$ 330-500 mil, pasto em MS ~R$ 12-20 mil/ha, vaqueiro ~R$ 2.200/mês.
const ECONV=2;
// ---------- lotação: reforma do pasto + terras compradas
CAPS.splice(0,CAPS.length,12,18,28,42,60,85);
function lotCap(){return S&&S.lots?(S.lots.leste?25:0)+(S.lots.sul?40:0):0}
// ---------- melhorias, máquinas e obras com preço de verdade
const has=k=>(S.up[k]||0)>0;
const UPX={
 land:{n:'Reforma de pasto e cercas',d:'Reforma, adubação e cerca nova: aumenta a lotação (cabeças por hectare).',c:[25000,60000,130000,240000,420000],ln:['Cerca nova e limpeza do pasto','Reforma de 10 ha com braquiária','Adubação e piquetes','Pasto rotacionado com bebedouros','Pastejo intensivo irrigado']},
 cocho:{c:[12000,30000,70000],ln:['Cochos de madeira e saleiro','Cochos cobertos','Cocho de concreto com trato mecanizado']},
 vet:{c:[15000,40000,100000],d:'Farmácia veterinária e contrato com veterinário: menos doenças e tratamento mais barato.'},
 mat:{c:[25000,70000]},
 silo:{c:[35000,90000,220000],ln:['Silo trincheira','Galpão de ração (300 m²)','Silo metálico e misturador']},
 ia:{c:[30000,90000],ln:['Botijão de sêmen e curral de IA','Laboratório de IATF']},
 bal:{c:[38000],ln:['Balança eletrônica de gado']},
 peao:{c:[3500],d:'Vacina, trata e compra ração sozinho. Salário R$ 2.400 por mês (todo dia 1º).'},
 cerca:{c:[18000,60000]},
 truck:{c:[130000,480000],ln:['Caminhão boiadeiro usado (MB 1113, gaiola de madeira)','Caminhão boiadeiro seminovo (Atego 2426, gaiola metálica)'],
  rq:[()=>S.herd.length>=25||'Rebanho de 25 cabeças ou mais',()=>S.lots&&S.lots.leste||'Compre o Lote Leste (fazenda maior)']},
 trator:{n:'Trator',d:'Prepara a terra, planta, colhe e rega quando você dirige na lavoura. Trator também reduz o custo da ração (capineira).',c:[85000,240000],ln:['Trator usado 75 cv (Valtra BF 75, 2008)','Trator novo 75 cv 4x4 (o usado entra na troca): mais rápido e +5% de produção'],
  rq:[()=>(S.up.lav||0)>=1||'Amplie a lavoura primeiro (Ampliar a lavoura Nv 1)',()=>S.lots&&(S.lots.leste||S.lots.sul)||'Precisa de mais terra (Lote Leste ou Lote Sul)']},
 lav:{d:'Prepara mais área de lavoura (destoca, calcário e adubação) a leste do celeiro.',c:[15000,40000],rq:[null,()=>has('trator')||'Lavoura grande precisa de trator']},
 coop:{c:[3500,10000,26000]},
 irrig:{d:'Pivô de aspersão: rega tudo sozinho e aumenta a produção (+15%).',c:[60000],rq:[()=>(S.up.lav||0)>=1||'Amplie a lavoura primeiro']},
 kennel:{c:[5000,12000,25000]},
 light:{c:[8000,25000]},
 dep:{d:'Galpão de depósito: +100 de espaço no inventário.',c:[20000,60000],ln:['Depósito de 60 m²','Galpão de 200 m²']},
 frig:{n:'Cota no frigorífico (sociedade)',d:'Você vira sócio de um frigorífico com SIF: +10% em todas as vendas de gado.',c:[1200000],rq:[()=>S.herd.length>=60||'Rebanho de 60 cabeças ou mais']},
 piq:{c:[15000,40000]},
 curral:{c:[65000],ln:['Curral de madeira com brete, tronco e embarcador']},
 ordenha:{c:[18000],ln:['Ordenhadeira balde ao pé + tanque de 1.500 L']}
};
for(const k in UPX){if(!UPS[k])continue;const x=UPX[k];if(x.c)UPS[k].c=x.c;['n','d','ln','rq'].forEach(f=>{if(x[f])UPS[k][f]=x[f]})}
Object.assign(UPS,{
 impl:{n:'Implementos agrícolas',ic:'🪛',d:'Grade aradora e plantadeira para o trator: +15% de produção na lavoura.',c:[48000],lv:[5],ln:['Grade aradora 16 discos + plantadeira 4 linhas'],rq:[()=>has('trator')||'Precisa de trator']},
 pulv:{n:'Pulverizador',ic:'🧴',d:'Controle de pragas e doenças: +5% de produção e as pragas comem menos.',c:[32000],lv:[6],ln:['Pulverizador de barra 600 L'],rq:[()=>has('trator')||'Precisa de trator']},
 colh:{n:'Colheitadeira',ic:'🌾',d:'Colhe a lavoura toda sozinha às 17h, vende direto na cooperativa e replanta (+5% de produção).',c:[420000],lv:[9],ln:['Colheitadeira de grãos usada (2012)'],rq:[()=>(S.up.lav||0)>=2||'Precisa da lavoura grande (Ampliar a lavoura Nv 2)',()=>S.lots&&S.lots.sul||'Precisa do Lote Sul (fazenda grande)']}
});
['impl','pulv','colh'].forEach(k=>{if(S&&S.up&&S.up[k]===undefined)S.up[k]=0});
// ---------- lavoura: preço por saca/caixa como no mercado, insumos de verdade
const CROPX={milho:['Milho (saca 60 kg)',66,20],mandioca:['Mandioca (saco 25 kg)',60,18],tomate:['Tomate (caixa 20 kg)',80,26],trigo:['Trigo (saca 60 kg)',72,22],soja:['Soja (saca 60 kg)',137,42],cana:['Cana (tonelada)',155,45],cafe:['Café (arroba 15 kg)',400,160]};
for(const k in CROPX){const[n,s,sd]=CROPX[k];CROPS[k].sell=s;CROPS[k].seed=sd;ITEMS[k].n=n;ITEMS[k].p=s;ITEMS['seed_'+k].p=sd;ITEMS['seed_'+k].n='Semente e adubo de '+CROPS[k].n.toLowerCase()}
function cropYield(c){const y=1+(has('impl')?.15:0)+(S.up.irrig?.15:0)+(has('pulv')?.05:0)+(has('colh')?.05:0)+((S.up.trator||0)>=2?.05:0);return Math.floor(y)+(Math.random()<y%1?1:0)}
// ---------- galinheiro maior (granja caipira) e produtos a preço de verdade
COOPCAP.splice(0,COOPCAP.length,0,12,30,60);if(UPS.coop)UPS.coop.d='Galinheiro caipira: 12, 30 e 60 galinhas poedeiras';
Object.assign(ITEMS.ovo,{n:'Ovo caipira',p:1.1});Object.assign(ITEMS.galinha,{n:'Galinha caipira (abatida)',p:55});
if(ITEMS.la)ITEMS.la.p=14;if(ITEMS.mel)Object.assign(ITEMS.mel,{n:'Pote de mel (1 kg)',p:45});if(ITEMS.leitecabra)ITEMS.leitecabra.p=5;if(ITEMS.couro)ITEMS.couro.p=95;
if(ITEMS.queijo)Object.assign(ITEMS.queijo,{n:'Queijo minas (kg)',p:38});if(ITEMS.charque)Object.assign(ITEMS.charque,{n:'Charque (kg)',p:52});if(ITEMS.rapadura)Object.assign(ITEMS.rapadura,{n:'Rapadura (500 g)',p:6});
if(typeof MEAT!=='undefined'){MEAT.boi.ppk=26;MEAT.porco.ppk=13;MEAT.cordeiro.ppk=34;MEAT.cabrito.ppk=32}
ACT.hbuyc=function(){if(S.chk.n>=COOPCAP[S.up.coop])return toast('Galinheiro lotado. Amplie na Casa Agro.','bad');if(S.money<55)return toast('Dinheiro insuficiente','bad');cash(-55,'Galinha poedeira');S.chk.n++;syncCH()};
ACT.hsellc=function(){if(S.chk.n<=0)return;S.chk.n--;cash(50,'Venda de galinha');syncCH()};
// ---------- terras, veículos, animais de serviço, armas
LOTS.forEach(l=>{if(l.id==='leste')Object.assign(l,{p:420000,ha:30,d:'30 ha de pasto formado (R$ 14 mil/ha): +25 cabeças de lotação e espaço para obras.'});if(l.id==='sul')Object.assign(l,{p:650000,ha:50,d:'50 ha de cerrado (R$ 13 mil/ha): +40 cabeças de lotação e espaço para obras.'})});
if(typeof VEH!=='undefined'){Object.assign(VEH.pick,{p:165000,n:'Picape 4x4 de caça (Hilux 2016)'});Object.assign(VEH.boat,{p:42000,n:'Chalana de alumínio 6 m + motor'})}
Object.assign(HORSES.crioulo,{p:12000});Object.assign(HORSES.mangalarga,{p:25000});Object.assign(HORSES.arabe,{p:60000});if(HORSES.quarto)HORSES.quarto.p=35000;if(HORSES.pantaneiro)HORSES.pantaneiro.p=9000;
Object.assign(DOGS.collie,{p:2500});Object.assign(DOGS.beagle,{p:2200});Object.assign(DOGS.pastor,{p:3500});Object.assign(DOGS.kangal,{p:12000});if(DOGS.dogo)DOGS.dogo.p=6000;if(DOGS.fila)DOGS.fila.p=5000;
Object.entries({r22:2800,shot12:4500,bow:3800,r308:12000,r3006:16000,mag300:26000}).forEach(([k,p])=>{if(WEAPONS[k])WEAPONS[k].p=p});
Object.entries({a22:90,cart12:85,arrow:180,a308:300,a3006:320,a300:290}).forEach(([k,p])=>{if(AMMO[k])AMMO[k].p=p});
ACT.courosell=function(){const n=S.inv.couro||0;if(!n)return;takeItem('couro',n);const t=Math.round(n*95*priceMult());cash(t,'Couro');toast('🟫 '+n+' couro(s) vendido(s): '+R$(t),'good')};
// ---------- FINANCIAMENTO RURAL (como o Moderfrota / Plano Safra)
const FINR={maq:{n:'Moderfrota (máquinas)',ent:.2,m:24,r:.0085},terra:{n:'Crédito fundiário (terra)',ent:.25,m:36,r:.008},inv:{n:'Plano Safra (investimento)',ent:.2,m:24,r:.009}};
function ensureFin(){if(!S.fin)S.fin=[];return S.fin}
const finLeft=()=>ensureFin().reduce((s,f)=>s+f.bal,0);
const finMonthly=()=>ensureFin().reduce((s,f)=>s+f.parc,0);
const finLimit=()=>Math.max(0,Math.round(Math.max(150000,netWorth()*.7)-finLeft()));
function finPlan(price,kind){const F=FINR[kind],ent=Math.round(price*F.ent),pv=price-ent,parc=Math.round(pv*F.r/(1-Math.pow(1+F.r,-F.m)));return{ent,pv,parc,m:F.m,r:F.r,kind}}
function finBtn(price,kind,act,v){const p=finPlan(price,kind);return '<button class="b" data-act="'+act+'" data-v="'+v+'" data-fin="1">🏦 Financiar: '+R$(p.ent)+' + '+p.m+'× '+R$(p.parc)+'</button>'}
function finStart(price,kind,label){const p=finPlan(price,kind);const lim=finLimit()+price*(kind==='terra'?.8:.6);if(p.pv>lim)return toast('O banco não aprovou: crédito disponível '+R$(lim)+' (já contando o bem como garantia). Quite financiamentos ou aumente o patrimônio.','bad'),false;if(S.money<p.ent)return toast('Falta dinheiro para a entrada ('+R$(p.ent)+')','bad'),false;
 cash(-p.ent,'Entrada: '+label);ensureFin().push({n:label,kind,bal:p.pv,parc:p.parc,left:p.m,r:p.r,late:0});toast('🏦 Financiamento aprovado: '+label+' · '+p.m+' parcelas de '+R$(p.parc)+' (todo dia 1º)','good');return true}
function finMonth(){const L=ensureFin();for(const f of L){const j=f.bal*f.r,amort=Math.min(f.bal,f.parc-j);if(S.money>=f.parc){cash(-f.parc,'Parcela: '+f.n);f.bal=Math.max(0,f.bal-amort);f.left--;f.late=0}
  else{f.late++;f.bal+=j+f.parc*.02;S.rep=Math.max(0,S.rep-1);toast('⚠️ Parcela de '+f.n+' atrasada! Juros de mora. Tenha dinheiro em caixa no dia 1º.','bad');if(f.late>=3){S.debt+=Math.round(f.bal);f.bal=0;f.left=0;toast('🏦 O banco transferiu o saldo de '+f.n+' para sua dívida (juros maiores).','bad')}}}
 S.fin=L.filter(f=>f.left>0&&f.bal>1)}
Object.assign(ACT,{finpay(e){const f=ensureFin()[+e.v];if(!f)return;const v=Math.ceil(f.bal);if(S.money<v)return toast('Dinheiro insuficiente para quitar','bad');cash(-v,'Quitação: '+f.n);f.bal=0;f.left=0;S.fin=S.fin.filter(x=>x!==f);toast('✅ '+f.n+' quitado!','good')}});
// botão de financiar: o mesmo data-act com data-fin=1
let FINCLICK=0;document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act]');FINCLICK=b&&b.dataset.fin==='1'?1:0},true);
document.addEventListener('touchstart',e=>{const b=e.target.closest&&e.target.closest('[data-act]');FINCLICK=b&&b.dataset.fin==='1'?1:0},{capture:true,passive:true});
// ---------- requisitos de máquinas (terra maior) + tela de melhorias
function upReq(k){const u=UPS[k],l=S.up[k]||0,r=u.rq&&u.rq[l];if(!r)return null;const v=r();return v===true?null:v}
const _upgEc=ACT.upg;ACT.upg=function(e){const k=e.v,c=upCost(k);if(c===null)return;const u=UPS[k],rq=u.lv?u.lv[S.up[k]||0]:0;if(rq&&rq>LV())return toast('Requer nível '+rq,'bad');const why=upReq(k);if(why)return toast('🔒 '+why,'bad');
 const lab=(u.ln&&u.ln[S.up[k]||0])||u.n;if(FINCLICK&&c>=25000){FINCLICK=0;if(!finStart(c,k==='land'||k==='frig'?'inv':'maq',lab))return;S.up[k]=(S.up[k]||0)+1;if(k==='ia'&&typeof newStraws==='function')newStraws();toast('✅ '+lab,'good');return}
 FINCLICK=0;if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Melhoria: '+lab);S.up[k]=(S.up[k]||0)+1;if(k==='ia'&&typeof newStraws==='function')newStraws();toast('✅ '+lab,'good')};
pUp=function(){const tot=ensureFin().length;return '<div class="card dim">💡 Preços reais de 2026. Máquinas grandes só valem a pena (e só liberam) com mais terra. Itens acima de R$ 25 mil podem ser <b>financiados</b> (entrada + parcelas mensais).'+(tot?' Você tem '+tot+' financiamento(s): parcelas de '+R$(finMonthly())+'/mês.':'')+'</div>'+Object.keys(UPS).map(k=>{
 const u=UPS[k],l=S.up[k]||0,c=upCost(k),rq=u.lv?u.lv[l]:0,lock=rq&&rq>LV(),why=c!==null&&!lock?upReq(k):null,nx=u.ln&&u.ln[l];
 return '<div class="card '+(lock||why?'lock':'')+'"><div class="row"><b>'+u.ic+' '+u.n+'</b><span class="gold">Nv '+l+'/'+u.c.length+'</span></div><div class="dim">'+u.d+'</div>'+(nx&&c!==null?'<div>➡️ <b>'+nx+'</b></div>':'')
 +(c===null?'<div class="grn">Nível máximo'+(u.ln&&u.ln[l-1]?': '+u.ln[l-1]:'')+'</div>':lock?'<div class="red">Requer nível '+rq+' de jogador</div>':why?'<div class="red">🔒 '+why+'</div>':'<div class="btns"><button class="b '+(S.money>=c?'gold':'gray')+'" data-act="upg" data-v="'+k+'">Comprar '+R$(c)+'</button>'+(c>=25000?finBtn(c,k==='land'||k==='frig'?'inv':'maq','upg',k):'')+'</div>')+'</div>'}).join('')};
// veículos e terras também financiáveis
if(typeof vehCard==='function'){vehCard=function(k){const V=VEH[k],own=vOwn(k);return '<div class="card '+(LV()<V.lv?'lock':'')+'"><div class="row"><b>'+V.ic+' '+V.n+'</b><span class="gold">'+R$(V.p)+'</span></div><div class="dim">'+V.d+' · requer nível '+V.lv+'</div><div class="btns">'+(own?'<span class="grn">✔ Você tem</span>':'<button class="b gold" data-act="vbuy" data-v="'+k+'">À vista</button>'+finBtn(V.p,'maq','vbuy',k))+'</div></div>'};
 const _vbEc=ACT.vbuy;ACT.vbuy=function(e){const k=e.v,V=VEH[k];if(!FINCLICK)return _vbEc(e);FINCLICK=0;ensureV();if(vOwn(k)||LV()<V.lv)return _vbEc(e);const p0=V.p;if(!finStart(p0,'maq',V.n))return;const m=S.money;S.money+=p0;_vbEc(e);if(!vOwn(k))S.money=m}}
const _lbEc=ACT.lotbuy;ACT.lotbuy=function(e){if(!FINCLICK)return _lbEc(e);FINCLICK=0;ensureB();const l=LOTS.find(x=>x.id===e.v);if(!l||S.lots[l.id])return;if(LV()<l.lv)return toast('Requer nível '+l.lv,'bad');if(!finStart(l.p,'terra',l.n))return;S.lots[l.id]=1;gainXP(40,'terreno');toast('🗺️ '+l.n+' agora é seu! +'+(l.id==='leste'?25:40)+' cabeças de lotação.','good')};
// tela de obras: adiciona financiamento e descrição de hectares para os terrenos
if(typeof pObras==='function'){const _poEc=pObras;pObras=function(){let h=_poEc();LOTS.forEach(l=>{if(!l.ha||S.lots[l.id])return;const i=h.indexOf('data-act="lotbuy" data-v="'+l.id+'">');if(i<0)return;const j=h.indexOf('</button>',i)+9;h=h.slice(0,j)+finBtn(l.p,'terra','lotbuy',l.id)+'<div class="dim" style="width:100%">'+l.d+'</div>'+h.slice(j)});return h}}
// finanças: lista dos financiamentos
const _pfEc=pFin;pFin=function(){const L=ensureFin();let f='<div class="card"><h3>🏦 Financiamentos rurais</h3><div class="dim">Limite de crédito: '+R$(finLimit())+' + o próprio bem como garantia · juros de 0,8 a 0,9% ao mês. As parcelas saem do caixa todo dia 1º; atrasar gera juros de mora.</div>'
 +(L.length?L.map((x,i)=>'<div class="row"><span>'+x.n+'<br><span class="dim">'+x.left+' parcelas de '+R$(x.parc)+(x.late?' · <span class="red">'+x.late+' atrasada(s)</span>':'')+'</span></span><span><b>'+R$(x.bal)+'</b> <button class="b" data-act="finpay" data-v="'+i+'">Quitar</button></span></div>').join(''):'<div class="dim">Nenhum financiamento. Compre máquinas, veículos e terras financiados nas Melhorias, na Casa Agro e nas Obras.</div>')+'</div>';
 return f+_pfEc()};
// patrimônio: terras, obras, veículos e cavalos contam; financiamento desconta
const _nwEc=netWorth;netWorth=function(){let v=_nwEc();if(!S)return v;if(S.lots)LOTS.forEach(l=>{if(l.p&&S.lots[l.id])v+=l.p*.95});
 if(S.blds)S.blds.forEach(b=>{const B=BT[b.type];if(B&&B.cost)v+=B.cost*.6});if(S.veh&&typeof VEH!=='undefined')for(const k in S.veh.own)if(S.veh.own[k]&&VEH[k]&&VEH[k].p)v+=VEH[k].p*.7;
 if(S.horses)S.horses.forEach(h=>{if(HORSES[h.b])v+=HORSES[h.b].p*.6});return v-finLeft()};
// ---------- custos e eventos mensais + colheitadeira
const _hdEc=hookDay;hookDay=function(){_hdEc();if(S.day%30===0)finMonth();
 if(has('colh')){S.colhD=S.colhD||0}};
let colhAcc=0;const _updEc=update;update=function(dt){_updEc(dt);if(!S)return;if(typeof VEH!=='undefined'&&VEH.trat)VEH.trat.spd=(S.up.trator||0)>=2?155:120;if(!has('colh'))return;const h=S.t*24;if(h>=17&&S.colhD!==S.day){S.colhD=S.day;colheitaAuto()}};
function colheitaAuto(){let n=0,v=0,rp=0,cost=0;for(const c of S.crops.slice()){if(cropStage(c)<3)continue;const y=cropYield(c),p=itemPrice(c.c)*y;v+=p;n+=y;const k=c.c;S.crops.splice(S.crops.indexOf(c),1);CMAP.delete(c.y*MW+c.x);
  const sd=CROPS[k].seed;if(S.money+v-cost>=sd&&CROPS[k].lv<=LV()){const nc={x:c.x,y:c.y,c:k,age:0,w:0};S.crops.push(nc);CMAP.set(c.y*MW+c.x,nc);cost+=sd;rp++}}
 if(!n)return;const diesel=Math.round(n*4);v=Math.round(v);cash(v,'Cooperativa: colheita mecanizada');cash(-cost-diesel,'Replantio e diesel');gainXP(n*2,'colheita');toast('🌾 A colheitadeira colheu '+n+' sacas/unidades e vendeu na cooperativa por '+R$(v)+(rp?' · '+rp+' canteiros replantados':''),'good')}
// ---------- salvar antigo: avisa da economia nova
const _ldEc=typeof afterLoad==='function'?afterLoad:null;
function econMigrate(){if(!S||S.econV>=ECONV)return;const old=S.econV;S.econV=ECONV;ensureFin();['impl','pulv','colh'].forEach(k=>{if(S.up[k]===undefined)S.up[k]=0});
 if(old===undefined&&S.day>275)setTimeout(()=>showModal('<h3>💰 Economia atualizada</h3><div class="card">Agora os preços seguem os valores reais de 2026: arroba a ~R$ 380, sacas de milho, soja e café a preço de mercado, tratores, caminhões, picapes, terras e construções com preço de verdade.<br><br>Para comprar máquinas grandes você pode <b>financiar</b> (entrada + parcelas mensais), como no Plano Safra. Máquinas grandes só liberam quando a fazenda cresce.</div><div class="btns"><button class="b gold" data-act="close">Entendi</button></div>'),2500)}
const _hdEc2=hookDay;hookDay=function(){econMigrate();_hdEc2()};
setInterval(()=>{try{if(S&&S.econV!==ECONV)econMigrate()}catch(e){}},3000);
GUIDE.push({lv:2,ic:'💰',t:'Economia e financiamento',h:'Os preços seguem o mercado real (2026): boi gordo ~R$ 380 a arroba, bezerro ~R$ 3.600, saca de milho R$ 66, soja R$ 137, arroba de café R$ 400, ovo R$ 1,10. Máquinas, veículos e terras custam o que custam de verdade. Itens acima de R$ 25 mil podem ser financiados com entrada de 20% e parcelas mensais (dia 1º). Máquinas grandes (trator novo, colheitadeira, caminhão seminovo) só liberam quando você tem mais terra.'});
