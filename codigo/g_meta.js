// ===== Metas de longo prazo: ranking, títulos, mural, eventos, rodeio, conquistas, coleções =====
const RIV=[['Fazenda Santa Rita','Dona Cida',55e3,.012],['Sítio Dois Irmãos','Irmãos Prado',110e3,.011],['Fazenda Bela Vista','Seu Otávio',230e3,.01],['Agropecuária Serra Azul','Ricardo Lemos',480e3,.009],['Fazenda Três Marias','Dona Marta',900e3,.0085],['Haras Ouro Fino','Coronel Bento',1.6e6,.008],['Fazenda Rio Claro','Família Takeda',2.7e6,.0075],['Grupo Pantaneiro','Dr. Augusto',4.4e6,.007],['Fazenda Imperial','Barão Valdemar',7.5e6,.0065]];
const TITLES=[{n:'Sitiante',nw:0,rw:0},{n:'Fazendeiro',nw:150e3,rw:5000},{n:'Pecuarista',nw:600e3,rw:20000},{n:'Coronel',nw:2e6,rank:3,rw:60000},{n:'Barão do Agro',nw:6e6,rank:1,rw:200000}];
function ensureM(){
 if(!S.rk)S.rk={v:RIV.map(r=>r[2]),best:10,top1:0,last:10,hist:[]};
 if(!S.ach)S.ach={};if(!S.col)S.col={};if(!S.mur)S.mur={d:[],w:[],day:-1,wk:-1,done:0};if(!S.ev)S.ev={};
 if(!S.seenB)S.seenB={};if(!S.seenD)S.seenD={};if(S.title===undefined)S.title=0;
}
const myNW=()=>Math.round(netWorth());
function rankList(){const L=RIV.map((r,i)=>({n:r[0],o:r[1],v:S.rk.v[i]}));L.push({n:S.farmName||'Fazenda Boi de Ouro',o:'Você',v:myNW(),me:1});return L.sort((a,b)=>b.v-a.v)}
const myRank=()=>rankList().findIndex(x=>x.me)+1;
function weekRank(){
 S.rk.v=S.rk.v.map((v,i)=>Math.round(v*(1+RIV[i][3]*7/7+gauss()*.012)));
 const r=myRank(),old=S.rk.last;S.rk.last=r;S.rkLast=myNW();if(r<S.rk.best)S.rk.best=r;if(r===1)S.rk.top1++;
 S.rk.hist.unshift({d:S.day,r});if(S.rk.hist.length>8)S.rk.hist.pop();
 const prize=[0,25000,12000,6000,3000,1500][r]||0;if(prize)cash(prize,'Prêmio do ranking semanal');
 toast('🏆 Ranking da região: você está em '+r+'º'+(r<old?' (subiu '+(old-r)+')':r>old?' (caiu '+(r-old)+')':'')+(prize?' · prêmio '+R$(prize):''),r<=old?'good':'bad');
}
function checkTitle(){
 const nw=myNW(),r=myRank();let t=S.title;
 while(t+1<TITLES.length){const T=TITLES[t+1];if(nw>=T.nw&&(!T.rank||r<=T.rank))t++;else break}
 if(t>S.title){S.title=t;S.titleN=TITLES[t].n;const T=TITLES[t];cash(T.rw,'Título: '+T.n);S.rep=Math.min(100,S.rep+8);gainXP(80+t*60,'título');
  showModal('<h3>🎖️ Novo título: '+T.n+'!</h3><div class="card">A região inteira agora te conhece como <b class="gold">'+T.n+'</b>.<br>Prêmio: '+R$(T.rw)+' · +8 reputação.<br><span class="dim">A placa da porteira foi atualizada.</span></div><div class="btns"><button class="b gold" data-act="close">Uhuu!</button></div>')}
 S.titleN=TITLES[S.title].n;
}
// ---- agenda de eventos
const dom=d=>d%30+1,mon=d=>Math.floor((d%360)/30);
const EVENTS=[
 {k:'pesca',ic:'🎣',n:'Torneio de Pesca',is:d=>dom(d)===7,d:'O dia todo. Vale o MAIOR peixe que você pescar no dia.'},
 {k:'feira',ic:'🎪',n:'Feira Agropecuária',is:d=>dom(d)===15,d:'Preços +12% na caixa de venda e na padaria.'},
 {k:'rodeio',ic:'🤠',n:'Rodeio da Vila',is:d=>dom(d)===25,d:'Monte no touro por 8 segundos no Quadro de Avisos da praça.'},
 {k:'leilao',ic:'🔨',n:'Leilão semanal',is:d=>d%7===0&&d%28!==0,d:'Abre por 3 dias.'},
 {k:'elite',ic:'👑',n:'Leilão ELITE',is:d=>d%28===0,d:'Animais nobres de alta genética (reputação 15+).'},
 {k:'expo',ic:'🏆',n:'Exposição Agropecuária',is:d=>d%90===45,d:'5 dias. Inscreva animais e ganhe prêmios.'},
 {k:'rank',ic:'📊',n:'Ranking semanal',is:d=>d%7===3,d:'Prêmio para os 5 primeiros.'}
];
function upcoming(n){const L=[];for(let d=S.day;d<S.day+n;d++)EVENTS.forEach(e=>{if(e.is(d))L.push({d,e})});return L}
// ---- torneio de pesca
function onFish(k,kg){
 ensureM();if(dom(S.day)===7&&!FISH[k].junk){if(!S.ev.fb||S.ev.fbD!==S.day){S.ev.fb=0;S.ev.fbD=S.day}if(kg>S.ev.fb){S.ev.fb=kg;tt('torn','🎣 Torneio: seu maior peixe agora tem '+kg+' kg','good',2)}}
 if(typeof onFishSecret==='function')onFishSecret(k);
}
function endFishTourney(){
 if(S.ev.fbD!==S.day-1||!S.ev.fb)return;
 const sc=RIV.slice(0,6).map(r=>({n:r[1],kg:Math.round(rnd(1.5,14)*Math.pow(Math.random(),.6)*100)/100}));sc.push({n:'Você',kg:S.ev.fb,me:1});sc.sort((a,b)=>b.kg-a.kg);
 const pos=sc.findIndex(x=>x.me)+1,pr=[0,6000,3000,1200][pos]||0;if(pr){cash(pr,'Torneio de Pesca');gainXP(40/pos,'torneio')}
 S.ev.fishW=(S.ev.fishW||0)+(pos===1?1:0);
 showModal('<h3>🎣 Resultado do Torneio de Pesca</h3>'+sc.slice(0,5).map((x,i)=>'<div class="card '+(x.me?'sel':'')+'">'+(i+1)+'º · '+x.n+' — '+x.kg+' kg</div>').join('')+'<div class="card">Você ficou em <b class="gold">'+pos+'º</b>'+(pr?' · prêmio '+R$(pr):'')+'</div><div class="btns"><button class="b gold" data-act="close">OK</button></div>');S.ev.fb=0;
}
// ---- rodeio
const RD={on:0,x:0,v:0,t:0,iv:null,push:0};
function rodeoModal(){
 ensureM();reModal=null;
 if(dom(S.day)!==25)return toast('O rodeio acontece todo dia 25','bad');
 if(S.ev.rdD===S.day)return toast('Você já montou hoje. Volte no próximo rodeio!');
 showModal('<h3>🤠 Rodeio da Vila</h3><div class="card">Fique 8 segundos em cima do touro! Use <b>⬅️ ➡️</b> (ou A/D) para se equilibrar contra os pinotes. Inscrição R$ 200.</div><div id="rdbox" class="card" style="text-align:center"><div style="font-size:40px">🐂</div></div><div class="btns"><button class="b gold" data-act="rdgo">Montar!</button><button class="b gray" data-act="close">Agora não</button></div>');
}
function rdRender(){
 const b=$('rdbox');if(!b)return;
 b.innerHTML='<div class="row"><b>'+RD.t.toFixed(1)+'s / 8s</b><span class="dim">equilíbrio</span></div><div style="position:relative;height:26px;background:linear-gradient(90deg,#c8402a,#e0a431 25%,#4a9a3a 40%,#4a9a3a 60%,#e0a431 75%,#c8402a);border-radius:4px;margin:6px 0"><div style="position:absolute;top:-4px;width:6px;height:34px;background:#fff;border:1px solid #000;left:calc('+((RD.x+1)/2*100)+'% - 3px)"></div></div><div style="font-size:34px;transform:rotate('+(RD.x*35)+'deg)">🤠</div><div class="btns" style="justify-content:center"><button class="b" data-act="rdl" style="font-size:24px;padding:10px 26px">⬅️</button><button class="b" data-act="rdr" style="font-size:24px;padding:10px 26px">➡️</button></div>';
}
function rdEnd(ok){
 clearInterval(RD.iv);RD.iv=null;RD.on=0;const t=Math.min(8,RD.t),score=Math.round(t*10+(ok?(1-RD.err/RD.n)*20:0));
 const sc=RIV.slice(0,7).map(r=>({n:r[1],s:Math.round(rnd(20,92))}));sc.push({n:'Você',s:score,me:1});sc.sort((a,b)=>b.s-a.s);const pos=sc.findIndex(x=>x.me)+1,pr=ok?([0,8000,4000,2000][pos]||600):0;
 if(pr)cash(pr,'Rodeio');if(ok)gainXP(30,'rodeio');if(ok&&pos===1)S.ev.rdW=(S.ev.rdW||0)+1;if(!ok){P.hp=Math.max(5,P.hp-12);P.hurt=.7}
 const b=$('rdbox');if(b)b.innerHTML='<div style="font-size:40px">'+(ok?'🏆':'💥')+'</div><div>'+(ok?'Você aguentou os 8 segundos!':'O touro te derrubou aos '+t.toFixed(1)+'s (-12 vida)')+'</div><div>Nota '+score+' · '+pos+'º lugar'+(pr?' · '+R$(pr):'')+'</div>';
}
Object.assign(ACT,{
 rdgo(){if(RD.on)return;if(S.money<200)return toast('Dinheiro insuficiente','bad');cash(-200,'Inscrição rodeio');S.ev.rdD=S.day;Object.assign(RD,{on:1,x:0,v:0,t:0,err:0,n:0,push:0});rdRender();
  RD.iv=setInterval(()=>{const dt=.05;RD.t+=dt;RD.v+=(gauss()*2.6*(1+RD.t*.12)+RD.x*1.1)*dt+RD.push;RD.push=0;RD.v*=.96;RD.x+=RD.v*dt;RD.n++;RD.err+=Math.abs(RD.x);
   if(Math.abs(RD.x)>=1)return rdEnd(false);if(RD.t>=8)return rdEnd(true);if(!$('rdbox')){clearInterval(RD.iv);RD.on=0;return}rdRender()},50)},
 rdl(){if(RD.on)RD.push=-.55},rdr(){if(RD.on)RD.push=.55},
 rodeo(){rodeoModal()}
});
addEventListener('keydown',e=>{if(!RD.on)return;const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')ACT.rdl();if(k==='d'||k==='arrowright')ACT.rdr()});
// ---- mural de pedidos
function murItemPool(){const L=[];Object.keys(CROPS).forEach(k=>{if(CROPS[k].lv<=LV())L.push(k)});if(S.up.coop)L.push('ovo');if(LV()>=2)['tilapia','lambari','bagre'].forEach(k=>L.push(k));return L}
function mkMission(big){
 const t=pick(big?['item','item','hunt','sell','fish','auc']:['item','item','hunt','sell','fish']),M={id:++S.nid+'m',t,big};
 if(t==='item'){const k=pick(murItemPool());M.k=k;M.n=big?ri(15,35):ri(3,9);M.rw=Math.round(itemPrice(k)*M.n*(big?2.2:1.8)/10)*10+(big?1500:150)}
 else if(t==='hunt'){const pool=Object.keys(SPECIES).filter(k=>k!=='whitedeer'&&(!SPECIES[k].season||SPECIES[k].season.includes(mon(S.day)))&&(LV()>=4||['rabbit','turkey','duck','coyote','deer','boar'].includes(k)));M.k=pick(pool);M.n=big?ri(3,5):1;M.base=S.h.kills[M.k]||0;M.rw=Math.round(((SPECIES[M.k].w[0]+SPECIES[M.k].w[1])/2*SPECIES[M.k].price*.8+(SPECIES[M.k].bounty||0)+200)*M.n*(big?1.4:1)/10)*10}
 else if(t==='sell'){M.n=big?ri(4,8):ri(1,2);M.base=S.stats.sold;M.rw=M.n*(big?900:600)}
 else if(t==='fish'){M.n=big?ri(12,20):ri(3,6);M.base=(S.fish&&S.fish.cnt)||0;M.rw=M.n*(big?160:110)}
 else{M.n=big?2:1;M.base=S.stats.aucWins;M.rw=big?6000:2500}
 M.xp=Math.round(M.rw/(big?90:60));return M;
}
function mProg(M){if(M.t==='item')return Math.min(M.n,S.inv[M.k]||0);if(M.t==='hunt')return Math.min(M.n,(S.h.kills[M.k]||0)-M.base);if(M.t==='sell')return Math.min(M.n,S.stats.sold-M.base);if(M.t==='fish')return Math.min(M.n,((S.fish&&S.fish.cnt)||0)-M.base);return Math.min(M.n,S.stats.aucWins-M.base)}
function mText(M){const it=ITEMS[M.k];return M.t==='item'?'Entregar '+M.n+'× '+(it?it.ic+' '+it.n:M.k):M.t==='hunt'?'Abater '+M.n+'× '+SPECIES[M.k].n:M.t==='sell'?'Vender '+M.n+' cabeça(s) de gado':M.t==='fish'?'Pescar '+M.n+' peixes':'Arrematar '+M.n+' lote(s) em leilão'}
function refreshMural(){
 ensureM();const m=S.mur,wk=Math.floor(S.day/7);
 if(m.day!==S.day){m.day=S.day;m.d=[0,1,2].map(()=>mkMission(0))}
 if(m.wk!==wk){m.wk=wk;m.w=[0,1].map(()=>mkMission(1))}
}
function muralModal(){
 refreshMural();reModal=muralModal;S.tf.mural=1;const m=S.mur,ev=EVENTS.filter(e=>e.is(S.day));
 const card=M=>{const p=mProg(M),ok=p>=M.n;return '<div class="card '+(M.got?'lock':'')+'"><div class="row"><b>'+mText(M)+'</b><span class="gold">'+R$(M.rw)+'</span></div><div class="dim">'+(M.got?'✅ Concluído':'Progresso '+Math.max(0,p)+'/'+M.n+' · +'+M.xp+' XP')+'</div>'+(M.got?'':'<div class="btns"><button class="b '+(ok?'gold':'gray')+'" data-act="murdone" data-v="'+M.id+'">'+(M.t==='item'?'Entregar':'Receber')+'</button></div>')+'</div>'};
 showModal('<h3>📋 Quadro de Avisos</h3>'+(ev.length?'<div class="card" style="border-color:#e0a431"><b>HOJE:</b> '+ev.map(e=>e.ic+' '+e.n).join(' · ')+(ev.some(e=>e.k==='rodeio')?'<div class="btns"><button class="b gold" data-act="rodeo">🤠 Ir ao rodeio</button></div>':'')+'</div>':'')
  +'<div class="sec">PEDIDOS DO DIA (renovam amanhã)</div>'+m.d.map(card).join('')+'<div class="sec">PEDIDOS DA SEMANA</div>'+m.w.map(card).join('')
  +'<div class="dim">Pedidos concluídos: '+m.done+'</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
ACT.murdone=function(e){
 const M=[...S.mur.d,...S.mur.w].find(x=>x.id===e.v);if(!M||M.got)return;if(mProg(M)<M.n)return toast('Ainda não concluído','bad');
 if(M.t==='item'&&!takeItem(M.k,M.n))return;M.got=1;S.mur.done++;cash(M.rw,'Pedido do mural');gainXP(M.xp,'pedido');S.rep=Math.min(100,S.rep+(M.big?1:.3));toast('📋 Pedido concluído! +'+R$(M.rw),'good');
};
// quadro físico na praça
let BOARD={x:0,y:0};
const _gwM=genWorld;
genWorld=function(){_gwM();
 let best=null;for(let r=0;r<12&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r;dx++){const x=113+dx,y=55+dy;if(x<2||y<2)continue;const i=ti(x,y);if(G[i]===2||G[i]===3||SOL[i]||FEN[i]||nearBld(x,y-1)&&BLD.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<=b.y+b.h))continue;if(G[ti(x,y+1)]===3||G[ti(x,y-1)]===3){best={x,y};break}}
 if(!best)best={x:113,y:55};BOARD={x:best.x*TS+8,y:best.y*TS+12};SOL[ti(best.x,best.y)]=1;
};
function drawBoard(g){const x=BOARD.x,y=BOARD.y;Rr(g,'rgba(0,0,0,.25)',x-11,y-1,22,3);Rr(g,'#5a3a22',x-9,y-16,2,16);Rr(g,'#5a3a22',x+7,y-16,2,16);Rr(g,'#8a5a2a',x-11,y-22,22,13);Rr(g,'#6a4220',x-11,y-23,22,2);Rr(g,'#f4ecd8',x-9,y-20,6,7);Rr(g,'#e8e0a8',x-2,y-20,5,5);Rr(g,'#f4ecd8',x+4,y-19,5,8);Rr(g,'#c8402a',x-7,y-20,1,1);Rr(g,'#c8402a',x,y-20,1,1);Rr(g,'#c8402a',x+6,y-19,1,1);
 if(EVENTS.some(e=>e.is(S.day)&&['pesca','rodeio','feira','elite','expo'].includes(e.k))){Rr(g,'#ffd75e',x-1,y-31-((frame>>3)&1),2,5);Rr(g,'#ffd75e',x-1,y-25,2,2)}}
const _evoM=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoM(L,x0,x1,y0,y1);if(BOARD.x>x0-30&&BOARD.x<x1+30&&BOARD.y>y0-10&&BOARD.y<y1+40)L.push([BOARD.y,10,{draw:drawBoard}])};
const _ilM=interactList;interactList=function(){const L=_ilM();L.push({x:BOARD.x,y:BOARD.y,r:26,label:'📋 Quadro de Avisos (pedidos e eventos)',fn:muralModal});return L};
// ---- conquistas
const kc=()=>Object.keys(S.h.kills||{}).filter(k=>S.h.kills[k]>0).length;
const ACH=[
 ['bez','Primeiro bezerro','Tenha um nascimento',()=>S.stats.born>=1,500],
 ['v10','Negociante','Venda 10 cabeças',()=>S.stats.sold>=10,1500],
 ['v100','Mercador de gado','Venda 100 cabeças',()=>S.stats.sold>=100,15000],
 ['h50','Rebanho grande','Tenha 50 cabeças',()=>S.herd.length>=50,8000],
 ['auc1','Martelo batido','Arremate um lote em leilão',()=>S.stats.aucWins>=1,1000],
 ['exp1','Campeão de pista','Vença uma exposição',()=>S.stats.expoWins>=1,8000],
 ['k1','Primeira caçada','Abata um animal',()=>kc()>=1,500],
 ['k10','Caçador completo','Abata 10 espécies diferentes',()=>kc()>=10,12000],
 ['faca','À moda antiga','Abata um animal com a faca, com os cães segurando',()=>(S.h.knifeK||0)>=1,3000],
 ['urso','Mata-urso','Abata um urso',()=>(S.h.kills.bear||0)>=1,6000],
 ['f50','Anzol de ouro','Pesque 50 peixes',()=>S.fish&&S.fish.cnt>=50,5000],
 ['pira','Monstro do Pantanal','Pesque um pirarucu',()=>S.fish&&S.fish.rec.pirarucu,8000],
 ['torn','Rei do anzol','Vença um Torneio de Pesca',()=>(S.ev.fishW||0)>=1,5000],
 ['rod','Peão de boiadeiro','Vença um rodeio',()=>(S.ev.rdW||0)>=1,5000],
 ['mur','Prestativo','Conclua 25 pedidos do mural',()=>S.mur.done>=25,6000],
 ['cor','Amigo da vila','Chegue a 10 corações com alguém',()=>NPC_IDS.some(k=>hearts(k)>=10),8000],
 ['par','Lar doce lar','Tenha um(a) parceiro(a)',()=>!!S.mate,2000],
 ['dog3','Matilha','Tenha 3 cães',()=>S.dogs.length>=3,2000],
 ['dogv','Velho companheiro','Tenha um cão com 8 anos ou mais',()=>S.dogs.some(d=>d.age>=2880),5000],
 ['bolsa','Investidor','Tenha R$ 100 mil na bolsa',()=>pfValue()>=1e5,10000],
 ['top5','Nome respeitado','Fique entre os 5 primeiros do ranking',()=>S.rk.best<=5,10000],
 ['top1','O maior da região','Fique em 1º no ranking',()=>S.rk.best<=1,50000],
 ['ano','Um ano de lida','Complete 1 ano de fazenda',()=>S.day-270>=360,10000],
 ['leg1','Relíquia','Encontre uma arma histórica',()=>S.sec&&Object.keys(S.sec.found).length>=1,5000],
 ['leg6','Museu particular','Encontre todas as armas históricas',()=>S.sec&&Object.keys(S.sec.found).length>=6,60000],
 ['barao','Barão do Agro','Conquiste o título máximo',()=>S.title>=4,100000]
];
function checkAch(){
 for(const a of ACH){if(S.ach[a[0]])continue;let ok=false;try{ok=a[3]()}catch(e){}
  if(ok){S.ach[a[0]]=S.day;cash(a[4],'Conquista: '+a[1]);gainXP(20+a[4]/400,'conquista');toast('🏅 Conquista: '+a[1]+' (+'+R$(a[4])+')','good')}}
}
// ---- coleções
const COLS=[
 {k:'trof',n:'🦌 Troféus de caça',all:()=>Object.keys(SPECIES),has:k=>(S.h.kills[k]||0)>0,nm:k=>SPECIES[k].n,rw:40000},
 {k:'fish',n:'🐟 Peixes',all:()=>Object.keys(FISH).filter(k=>!FISH[k].junk),has:k=>S.fish&&S.fish.rec[k],nm:k=>FISH[k].n,rw:20000},
 {k:'gado',n:'🐄 Raças de gado',all:()=>Object.keys(BREEDS),has:k=>S.seenB[k],nm:k=>BREEDS[k].n,rw:30000},
 {k:'caes',n:'🐕 Raças de cães',all:()=>Object.keys(DOGS),has:k=>S.seenD[k],nm:k=>DOGS[k].n,rw:15000},
 {k:'armas',n:'🔫 Armas históricas',all:()=>Object.keys(WEAPONS).filter(k=>WEAPONS[k].leg),has:k=>S.h.own[k],nm:k=>WEAPONS[k].short||WEAPONS[k].n,rw:50000},
 {k:'moedas',n:'🪙 Moedas antigas',all:()=>typeof COINS!=='undefined'?COINS.map((c,i)=>i):[],has:i=>S.sec&&S.sec.coins&&S.sec.coins[i],nm:i=>COINS[i].n,rw:25000}
];
function checkCols(){
 S.herd.forEach(a=>S.seenB[a.breed]=1);S.dogs.forEach(d=>S.seenD[d.breed]=1);
 for(const c of COLS){if(S.col[c.k])continue;const all=c.all();if(all.length&&all.every(c.has)){S.col[c.k]=S.day;cash(c.rw,'Coleção completa');toast('📚 Coleção completa: '+c.n+' (+'+R$(c.rw)+')','good')}}
}
// ---- aba Região
function pReg(){
 ensureM();checkTitle();const L=rankList(),r=myRank(),t=S.title,nx=TITLES[t+1],nw=myNW();
 let h='<div class="card"><div class="row"><b>🎖️ '+TITLES[t].n+'</b><span class="gold">'+r+'º lugar</span></div><div class="dim">Patrimônio '+R$(nw)+' · melhor posição '+S.rk.best+'º'+(S.rk.top1?' · '+S.rk.top1+' semanas em 1º':'')+'</div>'
  +(nx?'<div class="dim">Próximo título: <b>'+nx.n+'</b> — patrimônio '+R$(nx.nw)+(nx.rank?' e top '+nx.rank+' no ranking':'')+'</div>'+bar(Math.min(100,nw/nx.nw*100),'#e0a431'):'<div class="gold">Título máximo alcançado!</div>')+'</div>';
 h+='<div class="sec">RANKING DA REGIÃO (atualiza todo dia '+'3, 10, 17…)</div>'+L.map((x,i)=>'<div class="card" style="padding:5px 8px;'+(x.me?'border-color:#e0a431':'')+'"><div class="row"><b>'+(i+1)+'º '+(i<3?['🥇','🥈','🥉'][i]:'')+' '+x.n+'</b><span class="'+(x.me?'gold':'dim')+'">'+R$(x.v)+'</span></div><div class="dim">'+x.o+'</div></div>').join('');
 h+='<div class="sec">AGENDA (próximos 30 dias)</div>'+upcoming(30).slice(0,10).map(u=>'<div class="card" style="padding:5px 8px"><b>'+(u.d===S.day?'HOJE':'Dia '+dom(u.d)+'/'+MONTHS[mon(u.d)])+'</b> · '+u.e.ic+' '+u.e.n+'<div class="dim">'+u.e.d+'</div></div>').join('');
 const na=ACH.filter(a=>S.ach[a[0]]).length;
 h+='<div class="sec">CONQUISTAS '+na+'/'+ACH.length+'</div>'+ACH.map(a=>'<div class="card" style="padding:5px 8px;'+(S.ach[a[0]]?'':'opacity:.6')+'"><div class="row"><b>'+(S.ach[a[0]]?'🏅 ':'🔒 ')+a[1]+'</b><span class="gold">'+R$(a[4])+'</span></div><div class="dim">'+a[2]+'</div></div>').join('');
 h+='<div class="sec">COLEÇÕES</div>'+COLS.map(c=>{const all=c.all(),n=all.filter(c.has).length;return '<div class="card"><div class="row"><b>'+c.n+'</b><span class="'+(S.col[c.k]?'grn':'dim')+'">'+n+'/'+all.length+(S.col[c.k]?' ✅':' · '+R$(c.rw))+'</span></div><div class="dim" style="font-size:15px">'+all.map(k=>c.has(k)?c.nm(k):'???').join(' · ')+'</div></div>'}).join('');
 return h;
}
// ---- ganchos
const _hdM=hookDay;
hookDay=function(){_hdM();ensureM();refreshMural();if(S.day%7===3)weekRank();endFishTourney();checkTitle();
 const ev=EVENTS.filter(e=>e.is(S.day)&&['pesca','rodeio'].includes(e.k));ev.forEach(e=>toast(e.ic+' Hoje: '+e.n+'! '+e.d,'good'));
 if(S.day%30===14)S.rk.v=S.rk.v.map(v=>Math.round(v*(1+gauss()*.01)));
};
let metaT=0;const _updM=update;update=function(dt){_updM(dt);metaT+=dt;if(metaT>2){metaT=0;ensureM();checkAch();checkCols()}};
const _rh=renderHUD;renderHUD=function(){_rh();const el=$('hudL');if(el&&S&&S.titleN&&el.firstElementChild&&!el.querySelector('.ttl'))el.firstElementChild.insertAdjacentHTML('beforeend',' <span class="ttl" style="color:#ffd75e;font-size:14px">🎖️'+S.titleN+' '+(S.rk?S.rk.last:10)+'º</span>')};
const _dg=drawGate;drawGate=function(g){_dg(g);const x=152,y=915,t=TITLES[S.title||0].n;Rr(g,'#3a2414',x+14,y-50,2,8);Rr(g,'#3a2414',x-6,y-57,46,8);Rr(g,'#8a5a2a',x-5,y-56,44,6);g.fillStyle='#ffd75e';g.font='4px monospace';g.fillText(t.toUpperCase(),x+17-t.length*1.2,y-51.5)};
