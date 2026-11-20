'use strict';
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const gauss=()=>(Math.random()+Math.random()+Math.random()-1.5)*1.6;
const R$=n=>(n<0?'-':'')+'R$ '+Math.round(Math.abs(n)).toLocaleString('pt-BR');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const MONTHS=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const NAMES=['Mimosa','Estrela','Barão','Trovão','Princesa','Boneca','Valente','Chico','Jade','Malhada','Tufão','Bela','Capitão','Dengosa','Fumaça','Gigante','Lua','Ouro','Pintada','Rajada','Sultão','Tereza','Ventania','Zeca','Xuxa','Nuvem','Safira','Tigrão','Moranguinho','Caramelo'];
const BUYERS=['Frigorífico Boi Forte','Fazenda Santa Clara','Dr. Almeida','Agro Pantanal','Cabanha Esperança','Sítio do Zé','Grupo Cerrado','Fazenda Três Marias','Coronel Tavares','Agropecuária Sol Nascente','Haras Vale Verde','Dona Lourdes'];
const BREEDS={
 nelore:{n:'Nelore',tier:0,pm:1,adult:480,col:'#e6e0d0',hump:1,rep:0,d:'Rústica, a base do rebanho brasileiro'},
 girolando:{n:'Girolando',tier:0,pm:.95,adult:440,col:'#f1efe8',spot:'#3b2a22',rep:0,d:'Mestiça leiteira, barata e dócil'},
 brahman:{n:'Brahman',tier:1,pm:1.12,adult:520,col:'#b4afa2',hump:1,rep:0,d:'Resistente ao calor, boa carcaça'},
 hereford:{n:'Hereford',tier:1,pm:1.22,adult:540,col:'#a8481f',face:'#f4f0e4',rep:6,d:'Carne de qualidade, cara branca'},
 angus:{n:'Angus',tier:2,pm:1.45,adult:560,col:'#1e1e24',rep:14,d:'Carne premium, alta marmorização'},
 wagyu:{n:'Wagyu',tier:3,pm:3.3,adult:520,col:'#2b1c19',rep:30,d:'A mais nobre: carne super premium'}
};
const REPS=[[0,'Pequeno Produtor'],[10,'Fazendeiro'],[25,'Pecuarista'],[50,'Criador de Elite'],[80,'Barão do Gado']];
const repName=r=>REPS.filter(x=>r>=x[0]).pop()[1];
const CAPS=[10,14,22,34,50,80],PW=[150,190,230,270,300,314];
const GEST=150,K=0.005,BASE_ARROBA=380,DAYMS=4000;
const UPS={
 land:{n:'Mais pasto e cercas',ic:'🌾',d:'Aumenta a capacidade de cabeças (lotação)',c:[10000,24000,50000,100000,220000]},
 cocho:{n:'Cochos e saleiros',ic:'🪣',d:'Suplemento rende mais: ganho de peso melhor',c:[6000,15000,36000]},
 vet:{n:'Veterinário de plantão',ic:'💉',d:'Menos doenças e tratamento mais barato',c:[8000,25000,70000]},
 mat:{n:'Maternidade',ic:'🍼',d:'Mais bezerros sobrevivem e vacas voltam a parir antes',c:[10000,30000]},
 silo:{n:'Silo e galpão de ração',ic:'🏗️',d:'Estoque maior e ração mais barata',c:[5000,15000,40000]},
 ia:{n:'Laboratório de inseminação',ic:'🧬',d:'Libera sêmen de touros campeões para melhorar o rebanho',c:[20000,55000]},
 bal:{n:'Balança e curral de manejo',ic:'⚖️',d:'Pesagem precisa: +2% por lote vendido ao frigorífico',c:[15000]},
 peao:{n:'Contratar peão',ic:'🤠',d:'Vacina, trata e compra ração sozinho (salário R$ 1.800/mês)',c:[3000]},
 cerca:{n:'Cerca elétrica e vigia',ic:'⚡',d:'Reduz roubo de gado e fugas',c:[9000,30000]},
 truck:{n:'Caminhão boiadeiro',ic:'🚚',d:'+4% nas vendas e comissão do leilão menor',c:[40000,95000]},
 trator:{n:'Trator e capineira',ic:'🚜',d:'Produz parte da ração: -30% no custo',c:[25000]}
};
const GOALS=[
 ['first','Primeira venda','Venda um animal',()=>S.stats.sold>=1,1000],
 ['born','Nasceu um bezerro','Tenha um bezerro nascido na fazenda',()=>S.stats.born>=1,1500],
 ['h15','Rebanho de 15','Tenha 15 cabeças',()=>S.herd.length>=15,3000],
 ['auc','Lance vencedor','Compre um animal em leilão',()=>S.stats.aucWins>=1,2000],
 ['k100','Patrimônio R$ 100 mil','',()=>netWorth()>=1e5,5000],
 ['expo','Campeão da expo','Vença uma exposição',()=>S.stats.expoWins>=1,4000],
 ['angus','Linhagem nobre','Tenha um Angus ou Wagyu',()=>S.herd.some(a=>BREEDS[a.breed].tier>=2),3000],
 ['wagyu','Rei da carne','Tenha um Wagyu',()=>S.herd.some(a=>a.breed==='wagyu'),8000],
 ['rep50','Criador de Elite','Alcance 50 de reputação',()=>S.rep>=50,10000],
 ['k500','Meio milhão','Patrimônio de R$ 500 mil',()=>netWorth()>=5e5,20000],
 ['k1m','Barão do Gado','Patrimônio de R$ 1 milhão',()=>netWorth()>=1e6,50000]
];
let S=null;
function newGame(){
 const g={v:2,day:270,t:.3,money:60000,debt:0,rep:0,feed:150,pasture:75,weather:'sol',wLeft:2,drought:0,mkt:1,shock:0,
  up:{},herd:[],nid:1,suppl:true,listings:[],offers:[],straws:[],aucOpen:null,expo:null,ledger:[],mIn:0,mOut:0,
  stats:{sold:0,born:0,aucWins:0,expoWins:0,bought:0,deaths:0},goals:{},started:0,intro:1};
 Object.keys(UPS).forEach(k=>g.up[k]=0);
 S=g;
 for(let i=0;i<4;i++)addA(mk('nelore','F',ri(720,1000),ri(40,60)));
 const bl=mk('nelore','M',ri(800,1000),ri(45,60));bl.breeder=true;addA(bl);
 addA(mk('nelore','M',300,50));addA(mk('girolando','F',260,45));
 newListings();
 return g;
}
function addA(a){S.herd.push(a);return a}
function wmax(a){return BREEDS[a.breed].adult*(a.sex==='M'?1.15:.85)*(.92+a.gen/600)}
function mk(breed,sex,age,gen){
 const a={id:S.nid++,name:pick(NAMES),breed,sex,age,gen:Math.round(clamp(gen,5,100)),hp:92,sick:0,preg:0,sire:null,rest:0,breeder:0,title:0,vacc:0,cons:0,born:0};
 a.w=Math.round(wmax(a)-(wmax(a)-32)*Math.exp(-K*age)+rnd(-8,8));
 return a;
}
const isWet=()=>{const m=Math.floor((S.day%360)/30);return m>=9||m<=2};
const mktEff=()=>clamp(S.mkt+S.shock,.65,1.6);
const arroba=b=>BASE_ARROBA*mktEff()*BREEDS[b].pm;
const ageMult=a=>1+.4*clamp(1-a.age/600,0,1);
const qMult=a=>.8+a.gen/100*.6;
function valueOf(a,mode){
 let v=a.w/30*arroba(a.breed)*ageMult(a)*(.85+.15*a.hp/100);
 const q=mode==='frig'?Math.min(qMult(a),1.05):qMult(a)*(a.title?1.25:1);
 if(a.sick)v*=.75;if(a.sex==="M"&&ready(a))v*=1.08;
 return v*q;
}
const frigFactor=()=>.92+.04*S.up.truck+.02*S.up.bal+.1*(S.up.frig||0);
const frigPrice=a=>valueOf(a,'frig')*frigFactor();
const comm=()=>S.up.truck>=2?.03:S.up.truck>=1?.04:.05;
const cap=()=>CAPS[S.up.land]+(typeof lotCap==='function'?lotCap():0);
const AU=()=>S.herd.reduce((s,a)=>s+a.w/450,0);
const ageTxt=a=>a.age<60?a.age+' dias':Math.floor(a.age/30)+' meses';
const ready=a=>a.age>=420&&a.w>=.9*wmax(a)&&!a.breeder&&!a.preg;
function netWorth(){
 return S.money-S.debt+S.herd.reduce((s,a)=>s+frigPrice(a),0)+Object.keys(UPS).reduce((s,k)=>{let t=0;for(let i=0;i<S.up[k];i++)t+=UPS[k].c[i]*.5;return s+t},0)+S.feed*1.2;
}
function cash(n,label){
 S.money+=n;if(n>0)S.mIn+=n;else S.mOut-=n;
 S.ledger.unshift({d:S.day,n,l:label});if(S.ledger.length>50)S.ledger.pop();
}
function toast(msg,cls){
 const t=$('toast'),d=document.createElement('div');d.textContent=msg;if(cls)d.className=cls;t.appendChild(d);
 setTimeout(()=>d.remove(),cls==='bad'?5200:3600);while(t.children.length>3)t.firstChild.remove();
}
function lotGen(elite){return elite?ri(62,98):ri(25,78)}
function randBreed(maxTier,minTier,rep){
 const ok=Object.keys(BREEDS).filter(k=>BREEDS[k].tier<=maxTier&&BREEDS[k].tier>=minTier&&(rep===undefined||BREEDS[k].rep<=rep));
 return pick(ok);
}
function newListings(){
 S.listings=[];
 for(let i=0;i<8;i++){
  const bk=Object.keys(BREEDS),br=bk[Math.min(bk.length-1,Math.floor(Math.pow(Math.random(),1.5)*bk.length))];
  const age=pick([150,210,270,360,480,700,900]),sex=Math.random()<.55?'F':'M';
  const a=mk(br,sex,age,lotGen(BREEDS[br].tier>=2));
  S.listings.push({a,price:Math.round(valueOf(a,'mkt')*rnd(1.02,1.12)/10)*10});
 }
}
function newStraws(){
 S.straws=S.straws||[];S.sem=[];
 const n=S.up.ia>=2?7:5;
 for(let i=0;i<n;i++){
  const br=randBreed(3,0),g=S.up.ia>=2?ri(78,99):ri(60,86);
  S.sem.push({br,g,p:Math.round(150*BREEDS[br].pm*(.5+g/60)/10)*10,id:i+Math.random()});
 }
}
