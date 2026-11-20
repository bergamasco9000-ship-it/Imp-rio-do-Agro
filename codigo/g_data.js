// ===== Dados da expansão: itens, lavoura, cães, níveis =====
const CROPS={
 milho:{n:'Milho',ic:'🌽',d:4,seed:12,sell:38,lv:1,xp:4,c:['#6fa83a','#9ab84a','#e0c040']},
 mandioca:{n:'Mandioca',ic:'🥔',d:6,seed:16,sell:62,lv:2,xp:6,c:['#5a9a3a','#7ab04a','#b89060']},
 tomate:{n:'Tomate',ic:'🍅',d:5,seed:18,sell:58,lv:2,xp:6,c:['#4a9a3a','#6aa83a','#d8402a']},
 trigo:{n:'Trigo',ic:'🌾',d:6,seed:20,sell:82,lv:4,xp:9,c:['#8aa83a','#c0b04a','#e8c860']},
 soja:{n:'Soja',ic:'🫘',d:8,seed:32,sell:140,lv:5,xp:14,c:['#4a9a4a','#6ab05a','#a8b84a']},
 cana:{n:'Cana-de-açúcar',ic:'🎋',d:10,seed:44,sell:215,lv:6,xp:20,c:['#5aa84a','#7ac05a','#b8d060']},
 cafe:{n:'Café',ic:'☕',d:14,seed:90,sell:470,lv:8,xp:36,c:['#2f7a3a','#4a9a4a','#c0302a']}
};
const ITEMS={ovo:{n:'Ovo caipira',ic:'🥚',cat:'prod',p:3.2},galinha:{n:'Galinha (abate)',ic:'🍗',cat:'prod',p:38}};
Object.keys(CROPS).forEach(k=>{
 ITEMS[k]={n:CROPS[k].n,ic:CROPS[k].ic,cat:'crop',p:CROPS[k].sell};
 ITEMS['seed_'+k]={n:'Semente de '+CROPS[k].n.toLowerCase(),ic:'🌱',cat:'seed',p:CROPS[k].seed,crop:k};
});
const DOGS={
 vira:{n:'Vira-lata',lv:1,p:0,spd:70,bite:6,guard:25,track:30,herd:20,sz:0,col:'#b8864e',d:'Fiel e esperto. Seu primeiro amigo.'},
 collie:{n:'Border Collie',lv:3,p:1500,spd:95,bite:5,guard:30,track:40,herd:90,sz:0,col:'#262626',wh:'#f2f2f2',d:'Pastor inteligente: o gado fica mais saudável e dócil.'},
 beagle:{n:'Beagle',lv:4,p:1800,spd:75,bite:4,guard:20,track:95,herd:10,sz:0,col:'#c8905a',wh:'#f4f0e4',d:'Faro apurado: rastreia animais feridos na mata.'},
 pastor:{n:'Pastor Alemão',lv:5,p:3500,spd:92,bite:14,guard:75,track:60,herd:50,sz:1,col:'#9a6e36',blk:'#222',d:'Guarda e ataque: persegue ladrões.'},
 kangal:{n:'Kangal',lv:8,p:9000,spd:86,bite:30,guard:100,track:50,herd:70,sz:2,col:'#cdb078',mask:'#2a2a2a',d:'Guardião de rebanho turco. Ladrões e predadores o temem.'}
};
const WLV={r22:2,shot12:3,bow:3,r308:4,r3006:6,mag300:9};
const UNL={
 1:'Milho, gado Nelore/Girolando, tutorial',
 2:'Galinheiro, mandioca e tomate, licença de caça, rifle .22',
 3:'Border Collie, Lavoura II, espingarda e arco',
 4:'Cão Beagle (rastreio), trigo, rifle .308',
 5:'Pastor Alemão (guarda), soja',
 6:'Cana-de-açúcar, Lavoura III, rifle .30-06 com luneta',
 7:'Mais respeito no leilão: lotes melhores',
 8:'Kangal (guardião), café',
 9:'Rifle .300 Magnum para o alce',
 10:'Fazendeiro lendário'
};
const lvOf=xp=>1+Math.floor(Math.sqrt(xp/40));
const LV=()=>lvOf(S.lv.xp);
const xpFor=l=>(l-1)*(l-1)*40;
function gainXP(n,why){
 if(!S.lv)return;const a=LV();S.lv.xp+=Math.max(1,Math.round(n));const b=LV();
 if(b>a){const un=[];for(let l=a+1;l<=b;l++)if(UNL[l])un.push('<b>Nível '+l+':</b> '+UNL[l]);
  toast('⭐ NÍVEL '+b+'!','good');
  setTimeout(()=>{if(typeof showModal==='function'&&!(typeof paused==='function'&&paused())){showModal('<h3>⭐ Você subiu para o nível '+b+'!</h3><div class="card">'+(un.join('<br>')||'Continue crescendo!')+'</div><div class="btns"><button class="b gold" data-act="close">Continuar</button></div>')}},400);
 }
}
function ensureG(){
 if(!S.lv)S.lv={xp:0};
 if(!S.inv)S.inv={seed_milho:10};
 if(!S.crops)S.crops=[];
 if(!S.chk)S.chk={n:0,eggs:0};
 if(!S.dogs)S.dogs=[{id:1,breed:'vira',name:'Tobi',hp:100}];
 if(!S.dogAct)S.dogAct=S.dogs[0].id;
 if(!S.q)S.q={act:[],done:0,list:[],day:-1,cnt:{}};
 if(S.tut===undefined)S.tut=0;
 if(!S.tf)S.tf={};
 if(!S.selSeed)S.selSeed='milho';
 if(!S.crim)S.crim={caught:0,lost:0,night:-1};
 ['lav','coop','irrig','kennel','light','dep','frig','piq','curral','ordenha'].forEach(k=>{if(S.up[k]===undefined)S.up[k]=0});
}
// ---- inventário
const invCount=()=>Object.keys(S.inv).reduce((s,k)=>s+S.inv[k],0);
const invCap=()=>60+(S.h&&S.h.gear.pack?60:0)+S.up.dep*100;
function addItem(id,n){
 n=n||1;const room=Math.max(0,invCap()-invCount()),a=Math.min(room,n);
 if(a>0)S.inv[id]=(S.inv[id]||0)+a;
 if(a<n)toast('Inventário cheio! Venda produtos na caixa de venda.','bad');
 return a;
}
const hasItem=(id,n)=>(S.inv[id]||0)>=(n||1);
function takeItem(id,n){n=n||1;if(!hasItem(id,n))return false;S.inv[id]-=n;if(S.inv[id]<=0)delete S.inv[id];return true}
const priceMult=()=>clamp(.9*mktEff()+.1,.8,1.3)*(1+townBonus())*(feiraHoje()?1.12:1);
const itemPrice=id=>Math.max(1,Math.round(ITEMS[id].p*(ITEMS[id].cat==='seed'?1:priceMult())*10)/10);
const money1=n=>R$(n);
