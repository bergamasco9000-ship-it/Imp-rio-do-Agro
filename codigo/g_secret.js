// ===== Segredos: armas históricas escondidas, pistas, detector de metais, moedas antigas =====
Object.assign(WEAPONS,{
 betsy:{leg:1,short:'Old Betsy',n:'"Old Betsy" — rifle de pederneira de Davy Crockett',p:0,ammo:'polvora',cap:1,rel:3.2,range:430,pellets:1,spread:0,power:72,noise:620,stab:.55,speed:1300,d:'Rifle longo de pederneira. Um tiro só, recarga lenta — mas certeiro.'},
 lucretia:{leg:1,short:'Lucretia Borgia',n:'"Lucretia Borgia" — Springfield 1866 de Buffalo Bill',p:0,ammo:'a5070',cap:1,rel:1.6,range:540,pellets:1,spread:0,power:98,noise:640,stab:.55,speed:1900,d:'O rifle .50-70 dos caçadores de bisão. Golpe pesado.'},
 oakley:{leg:1,short:'Marlin de Annie Oakley',n:'Rifle Marlin .22 de Annie Oakley',p:0,ammo:'a22',cap:25,rel:.9,range:320,pellets:1,spread:0,power:24,noise:150,stab:.3,speed:1250,d:'Leve, silencioso e firme como nenhum outro. Carregador de 25.'},
 corbett:{leg:1,short:'Rigby de Jim Corbett',n:'Rifle Rigby .275 de Jim Corbett',p:0,ammo:'a275',cap:5,rel:1,range:640,pellets:1,spread:0,power:88,noise:540,stab:.38,speed:2600,d:'Leve e precisa. A arma do caçador de devoradores de homens.'},
 roosevelt:{leg:1,short:'Big Medicine',n:'Winchester 1895 .405 "Big Medicine" de Theodore Roosevelt',p:0,ammo:'a405',cap:4,rel:1.2,range:580,pellets:1,spread:0,power:135,noise:680,stab:.55,speed:2200,d:'Alavanca e calibre de safári: derruba urso e alce.'},
 lampiao:{leg:1,short:'Mosquetão do cangaço',n:'Mosquetão Mauser do bando de Lampião',p:0,ammo:'a7mm',cap:5,rel:1.2,range:600,pellets:1,spread:0,power:82,noise:560,stab:.48,speed:2500,d:'Mauser enfeitado com tachas de metal, ao estilo do cangaço.'}
});
const LAMMO={polvora:{n:'Pólvora e balas de chumbo (10)',p:120,q:10},a5070:{n:'.50-70 Government (10)',p:260,q:10},a275:{n:'.275 Rigby (10)',p:240,q:10},a405:{n:'.405 Winchester (10)',p:300,q:10},a7mm:{n:'7×57 Mauser (10)',p:220,q:10}};
Object.assign(WL,{
 betsy:{len:22,seg:[[0,7,2.2,'#6a3a1a'],[6,9,2.4,'#8a6a2a'],[9,22,1.2,'#5a5a5a']]},
 lucretia:{len:19,seg:[[0,6,2.4,'#5a3218'],[6,9,2.2,'#4a4a4a'],[9,16,2,'#5a3218'],[9,19,1.4,'#333']]},
 oakley:{len:16,seg:[[0,5,2,'#8a5a2a'],[5,8,2,'#c8a040'],[8,16,1.2,'#444']]},
 corbett:{len:18,seg:[[0,6,2.2,'#6a4220'],[6,9,2,'#2a2a2a'],[9,18,1.3,'#3a3a3a']]},
 roosevelt:{len:19,seg:[[0,6,2.4,'#7a4a22'],[6,10,2.6,'#222'],[10,19,1.6,'#3a3a3a'],[6,8,1,'#222',1.6]]},
 lampiao:{len:17,seg:[[0,6,2.2,'#6a4220'],[1,5,.6,'#e0c060'],[6,9,2,'#2a2a2a'],[9,17,1.4,'#3a3a3a']]}
});
const SECRETS=[
 {id:'betsy',w:'betsy',n:'Cabana do velho caçador',bio:[60,3,96,32,1],kind:'cabin',dig:0,
  clue:'Uma garrafa com um bilhete amarelado: “Na mata do norte, onde nenhum caminho chega, a cabana do velho Joaquim guarda o rifle que ele jurava ter vindo do Tennessee.”',
  hist:'Davy Crockett (1786–1836) foi um famoso homem da fronteira americana, caçador de ursos e deputado, morto na Batalha do Álamo. Chamava seu rifle de “Old Betsy”.'},
 {id:'lucretia',w:'lucretia',n:'Árvore oca gigante',bio:[3,3,40,32,1],kind:'hollow',dig:0,
  clue:'O Guarda Cardoso te conta: “Meu avô dizia que um caçador americano escondeu um rifle de bisão numa árvore oca enorme, no canto oeste da mata.”',
  hist:'Buffalo Bill Cody (1846–1917) ganhou o apelido caçando bisões para alimentar trabalhadores da ferrovia. Seu rifle Springfield 1866 se chamava “Lucretia Borgia”. Depois criou o famoso show do Velho Oeste.'},
 {id:'corbett',w:'corbett',n:'Caverna da montanha',bio:[130,2,157,20,5],kind:'cave',dig:0,
  clue:'No estômago do urso havia um pedaço de couro com letras: “…caverna no alto da montanha, a leste, a Rigby do velho Corbett…”',
  hist:'Jim Corbett (1875–1955) caçou na Índia tigres e leopardos que atacavam vilarejos, salvando muitas vidas. Usava um rifle Rigby .275. Mais tarde virou escritor e defensor da preservação dos tigres.'},
 {id:'roosevelt',w:'roosevelt',n:'Acampamento abandonado',bio:[101,22,125,39,5],kind:'camp',dig:1,
  clue:'O dono do Posto do Caçador te entrega uma carta antiga: “Para quem honrar 5 contratos: enterrei o Big Medicine perto da barraca rasgada, no pé da montanha, a oeste.”',
  hist:'Theodore Roosevelt (1858–1919), presidente dos EUA, foi caçador e naturalista. Na expedição à África em 1909 chamava sua Winchester 1895 .405 de “big medicine” para leões. Também ajudou a criar parques nacionais.'},
 {id:'oakley',w:'oakley',n:'Barco afundado',bio:[130,75,157,97,6],kind:'boat',dig:0,near:2,
  clue:'Preso no anzol, um mapa molhado: um barquinho desenhado na margem do Pantanal, bem ao sudeste, e as letras “A.O.”',
  hist:'Annie Oakley (1860–1926) foi a maior atiradora de exibição da história: acertava moedas no ar e cartas de baralho de lado. Estrela do show de Buffalo Bill, usou rifles Marlin .22.'},
 {id:'lampiao',w:'lampiao',n:'Ruínas do cangaço',bio:[3,86,40,97,4],kind:'ruin',dig:1,
  clue:'Seu Zé baixa a voz: “Meu pai era do sertão. Dizia que perto das ruínas de pau-a-pique, no canto sudoeste do cerrado, tem um mosquetão do bando de Lampião enterrado.”',
  hist:'Virgulino Ferreira, o Lampião (1898–1938), foi o mais famoso cangaceiro do sertão nordestino. Os cangaceiros enfeitavam chapéus, cartucheiras e armas com metal e couro trabalhado.'}
];
const COINS=[{n:'Réis de D. Pedro II'},{n:'Dobrão de ouro'},{n:'Moeda de prata colonial'},{n:'Patacão'},{n:'Vintém de cobre'},{n:'Dólar de prata 1880'},{n:'Peso espanhol'},{n:'Tostão de 1900'}];
const SECP={},COINP=[];
const secS=()=>{if(!S.sec)S.sec={clue:{},found:{},coins:{},pa:0,det:0};return S.sec};
function spotIn(r,salt,needWater){
 for(let k=0;k<4000;k++){const x=r[0]+Math.floor(hs(k*7+salt,k*3+1)*(r[2]-r[0])),y=r[1]+Math.floor(hs(k*5+2,k*11+salt)*(r[3]-r[1]));
  if(x<XMIN+3||y<YMIN+3||x>MW-4||y>RZ-4)continue;const i=ti(x,y);if(G[i]!==r[4]||SOL[i]||FEN[i]||nearBld(x,y))continue;
  let ok=true;const rr=salt<100?4:1;for(let dy=-rr;dy<=rr;dy++)for(let dx=-rr;dx<=rr;dx++)if(G[ti(clamp(x+dx,XMIN,MW-1),clamp(y+dy,YMIN,MH-1))]===3)ok=false;if(!ok)continue;
  if(needWater&&!adjW(x,y))continue;return{x:x*TS+8,y:y*TS+12,tx:x,ty:y}}
 return{x:r[0]*TS+40,y:r[1]*TS+40,tx:r[0]+2,ty:r[1]+2};
}
const _gwS=genWorld;
genWorld=function(){_gwS();
 SECRETS.forEach((s,i)=>{const p=spotIn(s.bio,31+i*17,s.near===2);SECP[s.id]=p;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)SOL[ti(p.tx+dx,p.ty+dy)]=0;for(let j=DECO.length-1;j>=0;j--)if(Math.hypot(DECO[j].x-p.x,DECO[j].y-p.y)<34)DECO.splice(j,1)});
 const R=[[3,3,97,33,1],[101,2,157,39,5],[101,42,157,97,6],[2,72,97,97,4]];COINP.length=0;COINS.forEach((c,i)=>COINP.push(spotIn(R[i%4],101+i*29,0)));
};
// ---- desenhos dos locais
function drawSecret(g,s){
 const p=SECP[s.id],x=p.x,y=p.y,f=secS().found[s.id];
 const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 if(s.kind==='cabin'){R('rgba(0,0,0,.3)',-20,-1,40,4);for(let i=0;i<5;i++)R(i%2?'#5a3a22':'#6a4428',-18,-18+i*3.6,36,3.4);R('#3a2414',-20,-24,22,6);R('#4a2e1a',2,-22,18,3);R('#2a1a10',-4,-14,8,14);R('#7a7a6a',12,-28,5,10);R('#4a8a3a',-18,-20,8,2);R('#4a8a3a',8,-6,10,2)}
 else if(s.kind==='hollow'){R('rgba(0,0,0,.3)',-14,-1,28,4);R('#4a3020',-10,-30,20,30);R('#3a2418',-10,-30,4,30);R('#5a3a24',4,-30,6,30);R('#140c06',-4,-16,8,11);R('#2a1a10',-5,-17,10,1);R('#3a7a32',-20,-52,40,24);R('#2f6a2f',-16,-56,30,8);R('#4a8a3a',-12,-50,14,6);R('#4a3020',-14,-2,6,2);R('#4a3020',9,-2,6,2)}
 else if(s.kind==='cave'){R('rgba(0,0,0,.3)',-22,-1,44,4);R('#6a7078',-22,-26,44,26);R('#8a9098',-18,-30,36,6);R('#f4f8fa',-18,-32,36,3);R('#4a5058',-20,-14,6,14);R('#0c0806',-9,-18,18,18);R('#1a1210',-7,-20,14,3);R('#f4f8fa',-24,-28,8,2)}
 else if(s.kind==='camp'){R('rgba(0,0,0,.25)',-18,-1,36,3);for(let i=0;i<10;i++)R(i<5?'#b8a878':'#a89868',-12+i,-14+Math.abs(i-5)*2.6,2,14-Math.abs(i-5)*2.6);R('#3a2a1a',-2,-9,3,9);R('#e8e8e0',-3,-12,1,4);R('#4a4a4a',8,-3,8,3);R('#2a2a2a',9,-4,6,1);R('#f4f8fa',-12,-15,24,1)}
 else if(s.kind==='boat'){R('rgba(0,0,0,.2)',-16,0,32,3);R('#5a3a22',-15,-6,30,6);R('#7a5232',-13,-7,26,2);R('#3a2414',-15,-6,3,6);R('#6a8a9a',-4,-3,14,3);R('#7a5232',-2,-16,1.5,10);R('#c8b898',-1,-15,6,6);R('#3a8a3a',10,-9,4,3)}
 else{R('rgba(0,0,0,.25)',-20,-1,40,4);R('#b8885a',-18,-12,12,12);R('#a8784a',-18,-14,8,2);R('#b8885a',4,-9,14,9);R('#7a5a3a',-15,-8,3,4);R('#5a3a22',-1,-20,2,20);R('#5a3a22',-5,-15,10,2);R('#4a8a3a',14,-20,3,20);R('#4a8a3a',10,-14,4,2);R('#4a8a3a',10,-18,2,4);R('#4a8a3a',17,-12,4,2)}
 if(s.dig&&!f){R('#6a4a2a',-3,4,7,3);R('#5a3a1a',-1,3,1,5);R('#5a3a1a',-3,5,5,1)}
 if(!f&&secS().clue[s.id]&&((frame>>4)%3===0))R('#ffd75e',-1,-40,2,2);
}
const _evoS=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoS(L,x0,x1,y0,y1);for(const s of SECRETS){const p=SECP[s.id];if(p&&p.x>x0-40&&p.x<x1+40&&p.y>y0-10&&p.y<y1+60)L.push([p.y,10,{draw:g=>drawSecret(g,s)}])}};
// ---- interação
function giveLegend(s){
 const W=WEAPONS[s.w];secS().found[s.id]=S.day;S.h.own[s.w]=1;AMMO[W.ammo]=AMMO[W.ammo]||LAMMO[W.ammo];S.h.ammo[W.ammo]=(S.h.ammo[W.ammo]||0)+15;S.h.mag[s.w]=W.cap;
 gainXP(200,'relíquia');S.rep=Math.min(100,S.rep+4);reModal=null;
 showModal('<h3>✨ Relíquia encontrada!</h3><div class="card" style="text-align:center">'+wIcon(s.w)+'<br><b class="gold">'+W.n+'</b></div><div class="card">'+s.hist+'</div><div class="card dim">'+wDesc(s.w)+'<br>Veio com 15 munições. Mais munição na Loja do Caçador.<br><i>(A arma escondida aqui é ficção do jogo; a história da pessoa é real.)</i></div><div class="btns"><button class="b gold" data-v="'+s.w+'" data-act="hequip">Equipar</button><button class="b gray" data-act="close">Fechar</button></div>');
}
function secretAct(s){
 const sc=secS();if(sc.found[s.id])return toast('Você já explorou este lugar.');
 if(s.dig&&!sc.pa)return toast('A terra aqui foi mexida… você precisa de uma pá (Seu Zé vende).','bad');
 if(!sc.clue[s.id]){sc.clue[s.id]=1;toast('🔎 Você encontrou algo sem pista nenhuma! Que faro!','good')}
 giveLegend(s);
}
const _ilS=interactList;
interactList=function(){const L=_ilS();const sc=secS();
 for(const s of SECRETS){const p=SECP[s.id];if(!p||sc.found[s.id])continue;L.push({x:p.x,y:p.y,r:28,label:(s.dig?'⛏️ Cavar — ':'🔎 Explorar — ')+s.n,fn:()=>secretAct(s)})}
 if(sc.det)COINP.forEach((c,i)=>{if(!sc.coins[i]&&Math.hypot(c.x-P.x,c.y-P.y)<18)L.push({x:c.x,y:c.y,r:20,label:'⛏️ Cavar (o detector apitou forte!)',fn:()=>digCoin(i)})});
 return L};
function digCoin(i){const sc=secS();if(!sc.pa)return toast('Precisa de uma pá','bad');sc.coins[i]=S.day;const m=ri(800,3000);cash(m,'Tesouro enterrado');gainXP(40,'tesouro');toast('🪙 Você desenterrou: '+COINS[i].n+' e '+R$(m)+' em joias velhas!','good')}
function giveClue(id,silent){const sc=secS();if(sc.clue[id]||sc.found[id])return;sc.clue[id]=S.day;const s=SECRETS.find(x=>x.id===id);
 showModal('<h3>📜 Uma pista!</h3><div class="card"><i>'+s.clue+'</i></div><div class="dim">As pistas ficam no menu 🏆 Região › Segredos. Uma estrelinha brilha sobre o local quando você chegar perto.</div><div class="btns"><button class="b gold" data-act="close">Vou procurar!</button></div>')}
// fontes das pistas
function onFishSecret(k){const z=FS.zone;if(z==='lake'&&Math.random()<.05)giveClue('betsy');if(z==='pant'&&Math.random()<.05)giveClue('oakley')}
const _fpS=finishPick;finishPick=function(){const a=AIM.pick&&AIM.pick.a;_fpS();if(a&&a.sp==='bear')giveClue('corbett')};
const _hdS=hookDay;hookDay=function(){_hdS();const sc=secS();
 if(hearts('guarda')>=3)giveClue('lucretia');if(hearts('ze')>=4)giveClue('lampiao');if(S.h&&(S.h.ctDone||0)>=5)giveClue('roosevelt');
 Object.keys(sc.found).forEach(id=>{const W=WEAPONS[SECRETS.find(s=>s.id===id).w];AMMO[W.ammo]=AMMO[W.ammo]||LAMMO[W.ammo]})};
// loja do Seu Zé: pá e detector
Object.assign(ACT,{
 buypa(){const sc=secS();if(sc.pa)return;if(S.money<150)return toast('Dinheiro insuficiente','bad');cash(-150,'Pá');sc.pa=1;toast('⛏️ Pá comprada','good')},
 buydet(){const sc=secS();if(sc.det)return;if(LV()<4)return toast('Requer nível 4','bad');if(S.money<2500)return toast('Dinheiro insuficiente','bad');cash(-2500,'Detector de metais');sc.det=1;toast('📡 Detector de metais! Ele apita quando há metal enterrado por perto.','good')}
});
const _npcS=npcModal;
npcModal=function(id){_npcS(id);if(id!=='ze')return;const last=$('mbox').lastElementChild;if(!last)return;const sc=secS();
 last.insertAdjacentHTML('beforebegin','<div class="sec">FERRAMENTAS</div><div class="card"><div class="row"><b>⛏️ Pá</b><span class="gold">'+R$(150)+'</span></div><div class="dim">Para cavar onde a terra foi mexida.</div><div class="btns">'+(sc.pa?'<span class="grn">Você tem</span>':'<button class="b gold" data-act="buypa">Comprar</button>')+'</div></div><div class="card '+(LV()<4?'lock':'')+'"><div class="row"><b>📡 Detector de metais</b><span class="gold">'+R$(2500)+'</span></div><div class="dim">Apita perto de tesouros enterrados espalhados pelos 4 biomas. Requer nível 4.</div><div class="btns">'+(sc.det?'<span class="grn">Você tem</span>':'<button class="b gold" data-act="buydet">Comprar</button>')+'</div></div>')};
// sinal do detector
const DET=document.createElement('div');DET.style.cssText='position:fixed;top:44px;left:50%;transform:translateX(-50%);z-index:7;font:16px "VT323",monospace;color:#fff;text-shadow:1px 1px 0 #000;pointer-events:none;display:none';document.body.appendChild(DET);
let detT=0;
const _updS=update;update=function(dt){_updS(dt);const sc=secS();if(!sc.det){DET.style.display='none';return}
 let bd=1e9;COINP.forEach((c,i)=>{if(!sc.coins[i])bd=Math.min(bd,Math.hypot(c.x-P.x,c.y-P.y))});SECRETS.forEach(s=>{if(s.dig&&!sc.found[s.id]){const p=SECP[s.id];bd=Math.min(bd,Math.hypot(p.x-P.x,p.y-P.y))}});
 if(bd>220){DET.style.display='none';return}DET.style.display='block';const lv=Math.max(1,Math.min(5,Math.ceil((220-bd)/44)));DET.textContent='📡 '+'▮'.repeat(lv)+'▯'.repeat(5-lv);
 detT-=dt;if(detT<=0){detT=.2+bd/200;try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),gn=AC.createGain(),t=AC.currentTime;o.frequency.value=600+lv*180;gn.gain.setValueAtTime(.04,t);gn.gain.exponentialRampToValueAtTime(.0001,t+.08);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+.09)}catch(e){}}
};
function pSecrets(){const sc=secS();
 return '<div class="sec">🗝️ SEGREDOS '+Object.keys(sc.found).length+'/'+SECRETS.length+'</div><div class="dim">Armas de atiradores e caçadores famosos estão escondidas pelo mapa. Pistas vêm da pesca, da caça, dos contratos e da amizade com os moradores — ou explore por conta própria.</div>'
 +SECRETS.map(s=>{const f=sc.found[s.id],c=sc.clue[s.id];return '<div class="card"><div class="row"><b>'+(f?'✨ '+WEAPONS[s.w].short:c?'📜 '+s.n:'❓ ???')+'</b><span class="dim">'+(f?'encontrada':c?'pista':'')+'</span></div>'+(c&&!f?'<div class="dim"><i>'+s.clue+'</i></div>':'')+(f?'<div class="dim">'+s.n+'</div>':'')+'</div>'}).join('')
 +'<div class="card"><b>🪙 Tesouros enterrados</b> <span class="dim">'+Object.keys(sc.coins).length+'/'+COINS.length+(sc.det?'':' · precisa do detector de metais')+'</span></div>';
}
const _pReg=pReg;pReg=function(){return _pReg()+pSecrets()};
