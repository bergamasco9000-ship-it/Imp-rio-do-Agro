const SP=new Map();
const feedPrice=()=>1.6*(S.mkt*.4+.6)*(1-.05*S.up.silo)*(S.up.trator?.7:1);
const siloCap=()=>[400,1500,5000,15000][S.up.silo];
const treatCost=()=>Math.round(180*(1-.25*S.up.vet));
const vaccCost=()=>12;
function buyFeed(kg){
 kg=Math.min(Math.floor(kg),siloCap()-Math.floor(S.feed));if(kg<=0)return 0;
 const p=feedPrice();if(S.money<kg*p)kg=Math.floor(Math.max(0,S.money)/p);
 if(kg<=0)return 0;cash(-Math.round(kg*p),'Ração '+kg+' kg');S.feed+=kg;return kg;
}
function die(a,why){
 S.herd=S.herd.filter(x=>x!==a);SP.delete(a.id);S.stats.deaths++;
 toast('💀 '+a.name+' morreu ('+why+')','bad');
}
function treat(a,auto){
 const c=treatCost();if(S.money<c)return false;
 cash(-c,'Veterinário: '+a.name);a.sick=0;a.hp=Math.min(100,a.hp+10);if(!auto)toast(a.name+' foi tratado');return true;
}
function vaccinate(a){if(a.vacc>S.day||S.money<vaccCost())return false;cash(-vaccCost(),'Vacina');a.vacc=S.day+180;return true}
function birth(a){
 const sg=a.sire?a.sire.g:a.gen,sb=a.sire?a.sire.br:a.breed;
 let g=(a.gen+sg)/2+gauss()*6+(S.up.ia?1:0),br=a.breed;
 if(sb!==a.breed){g+=4;br=Math.random()<.5?sb:a.breed}
 a.preg=0;a.sire=null;a.rest=70-12*S.up.mat;
 if(Math.random()<.9+.04*S.up.mat){
  const c=mk(br,Math.random()<.5?'F':'M',0,g);c.w=ri(28,38);c.hp=85;addA(c);S.stats.born++;if(typeof gainXP==='function')gainXP(8);
  toast('🐮 '+a.name+' pariu '+c.name+' ('+BREEDS[br].n+', '+(c.sex==='F'?'fêmea':'macho')+')','good');
 }else toast(a.name+' perdeu o bezerro...','bad');
}
function makeLots(type){
 const el=type==='elite',lots=[];
 const pool=el?['hereford','angus','angus','wagyu','brahman','wagyu']:['nelore','nelore','nelore','girolando','girolando','brahman','hereford'];
 for(let i=0;i<(el?6:7);i++){
  const a=mk(pick(pool),Math.random()<.5?'F':'M',pick([210,300,420,540,700,900]),lotGen(el));
  lots.push(mkLot(a,0,el));
 }
 return lots;
}
function mkLot(a,own,el){
 const v=valueOf(a,'mkt'),n=el?5:4,names=shuffle(BUYERS),b=[];
 for(let i=0;i<n;i++)b.push({n:names[i],max:v*rnd(own?.85:.82,own?1.3:1.22)*(own?(1+S.rep/400)*(a.title?1.1:1):1)});
 const inc=Math.max(50,Math.round(v*.03/50)*50),start=Math.max(100,Math.round(v*.45/50)*50);
 return {a,own,start,inc,price:start-inc,reserve:own?v*(a.resPct||.85):0,bidders:b,leader:null,idle:0};
}
function dayTick(){
 S.day++;const dom=S.day%30,mon=Math.floor((S.day%360)/30);
 if(--S.wLeft<=0){S.weather=Math.random()<(isWet()?.35:.07)?'chuva':'sol';S.wLeft=ri(1,4)}
 if(S.drought>0){S.drought--;S.weather='sol';if(!S.drought)toast('☔ A seca acabou','good')}
 if(S.outbreak>0)S.outbreak--;
 S.shock*=.97;
 S.mkt=clamp(S.mkt+((isWet()?.96:1.1)-S.mkt)*.012+rnd(-.014,.014),.75,1.4);
 const load=S.herd.length?AU()/cap():0;
 const gr=(isWet()?1.2:.5)*(S.weather==='chuva'?1.5:1)*(S.drought>0?.2:1)*4*(1-S.pasture/100);
 S.pasture=clamp(S.pasture+gr-load*1.6,0,100);
 const need=S.herd.reduce((s,a)=>s+a.w/450*1.8,0);let fed=0;
 if(S.suppl&&S.herd.length&&(S.pasture<45)){
  if(S.up.peao&&S.feed<need*3)buyFeed(need*8);
  fed=Math.min(1,S.feed/need);S.feed=Math.max(0,S.feed-need);
 }
 if(S.up.peao&&S.camp>S.day)S.herd.forEach(a=>vaccinate(a));
 const bulls=S.herd.filter(a=>a.sex==='M'&&a.breeder&&a.age>=400&&a.hp>40&&!a.sick);
 const fert=S.herd.filter(a=>a.sex==='F'&&a.age>=420&&!a.preg&&a.rest<=0).length||1;
 const bf=Math.min(1,bulls.length*18/fert);
 for(const a of S.herd.slice()){
  a.age++;
  let eff=.3+.7*Math.min(1,S.pasture/55)+.45*fed+.04*S.up.cocho;if(a.sick)eff*=.4;eff=Math.min(eff,1.3);
  const wm=wmax(a);if(a.w<wm)a.w+=(wm-a.w)*K*eff;
  if(eff<.55){a.hp-=1.2;a.w-=a.w*.0015}else a.hp+=.7;
  const p=.003*(1-.2*S.up.vet)*(a.vacc>S.day?.3:1)*(load>1.1?2:1)*(S.pasture<20?1.7:1)*(a.age<120?1.5:1)*(S.weather==='chuva'?1.3:1)*(S.outbreak>0?4:1);
  if(!a.sick&&Math.random()<p)a.sick=1;
  if(a.sick){a.hp-=3;if(S.up.peao&&S.money>=treatCost())treat(a,true);else if(a.hp>55&&Math.random()<.03)a.sick=0}
  a.hp=clamp(a.hp,0,100);
  if(a.hp<=0){die(a,a.sick?'doença':'fome');continue}
  if(a.age>4300&&Math.random()<.002){die(a,'velhice');continue}
  if(a.sex==='F'){
   if(a.preg){a.preg++;if(a.preg>=GEST)birth(a)}
   else if(a.rest>0)a.rest--;
   else if(a.age>=420&&!a.sick&&a.w>.65*wm&&bulls.length&&Math.random()<.025*bf*(a.hp/100)){
    const b=pick(bulls);a.preg=1;a.sire={br:b.breed,g:b.gen};
   }
  }
 }
 if(Math.random()<.035)randomEvent();
 if(S.herd.length&&Math.random()<.07&&S.offers.length<3){
  const c=S.herd.filter(a=>a.age>300&&!a.cons);
  if(c.length){const a=pick(c);if(!S.offers.some(o=>o.id===a.id))S.offers.push({id:a.id,price:Math.round(valueOf(a,'mkt')*rnd(1.1,1.35)/10)*10,buyer:pick(BUYERS),exp:S.day+6});toast('📞 Proposta de compra por '+a.name)}
 }
 S.offers=S.offers.filter(o=>o.exp>S.day&&S.herd.some(a=>a.id===o.id));
 if(dom===0){
  if(mon===4||mon===10){S.camp=S.day+30;toast('💉 Campanha de vacinação aberta por 30 dias!')}
  if(S.up.peao)cash(-2400,'Salário do peão');
  cash(-(60+90*S.up.land+(typeof lotCap==='function'?lotCap()*4:0)),'Impostos (ITR) e taxas');
  if(S.debt>0){const i=Math.round(S.debt*(typeof loanRate==='function'?loanRate():.012));S.debt+=i;toast('Juros do banco: '+R$(i),'bad')}
  toast('📒 Mês fechado: entrou '+R$(S.mIn)+', saiu '+R$(S.mOut));S.mIn=S.mOut=0;newStraws();
 }
 if(S.day%7===0){
  newListings();
  const el=S.day%28===0&&S.rep>=15;
  S.herd.forEach(a=>a.cons=0);
  S.aucOpen={type:el?'elite':'comum',until:S.day+3,lots:null};
  toast(el?'🔨 Leilão ELITE aberto por 3 dias!':'🔨 Leilão semanal aberto por 3 dias');
 }else if(S.aucOpen&&S.day>=S.aucOpen.until){S.aucOpen=null;S.herd.forEach(a=>a.cons=0);toast('O leilão encerrou')}
 if(S.day%90===45){S.expo={until:S.day+5,n:0};toast('🏆 Exposição agropecuária aberta por 5 dias!')}
 else if(S.expo&&S.day>=S.expo.until)S.expo=null;
 for(const g of GOALS)if(!S.goals[g[0]]&&g[3]()){S.goals[g[0]]=1;cash(g[4],'Meta: '+g[1]);toast('🎯 Meta cumprida: '+g[1]+' (+'+R$(g[4])+')','good')}
 if(S.money<-25000&&netWorth()<-10000)S.over=1;
 if(S.day%5===0)save();
}
function randomEvent(){
 const r=Math.random();
 if(r<.18){if(!S.drought){S.drought=ri(20,40);toast('🌵 Seca! O pasto vai sofrer por semanas. Garanta ração!','bad')}}
 else if(r<.33){S.pasture=Math.min(100,S.pasture+18);toast('🌧️ Chuva forte: o pasto reviveu','good')}
 else if(r<.45){S.shock=.14;toast('📈 Mercado aquecido: arroba em alta!','good')}
 else if(r<.57){S.shock=-.14;toast('📉 Arroba em queda. Talvez segurar os animais?','bad')}
 else if(r<.72){if(S.herd.length>4&&Math.random()<1-.4*S.up.cerca){const a=pick(S.herd);S.herd=S.herd.filter(x=>x!==a);S.offers=S.offers.filter(o=>o.id!==a.id);toast('🥷 Ladrões levaram '+a.name+'! Cerca elétrica ajuda.','bad')}}
 else if(r<.88){S.outbreak=15;toast('🦠 Surto na região! Vacinados ficam mais protegidos.','bad')}
 else if(r<.93){if(S.herd.length>3){die(pick(S.herd),'raio')}}
 else{const a=pick(S.herd.filter(x=>x.sex==='F'));if(a&&Math.random()<.6){a.hp=100;toast('🍀 '+a.name+' está radiante de saúde','good')}}
}
function sellFrig(a){
 const p=Math.round(frigPrice(a));cash(p,'Venda: '+a.name);S.stats.sold++;if(typeof gainXP==='function')gainXP(3+p/250);
 S.herd=S.herd.filter(x=>x!==a);SP.delete(a.id);S.rep=Math.min(100,S.rep+(a.gen>70?.4:.1));return p;
}
function buyAnimal(a,price,label){
 if(S.money<price)return toast('Dinheiro insuficiente','bad'),false;
 if(S.herd.length>=Math.floor(cap()*1.5))return toast('Sem espaço! Compre mais pasto.','bad'),false;
 cash(-price,label+': '+a.name);S.stats.bought++;a.id=S.nid++;a.vacc=0;addA(a);return true;
}
function upCost(k){const u=UPS[k],l=S.up[k];return l>=u.c.length?null:u.c[l]}
function save(){try{localStorage.setItem('fbo_save',JSON.stringify(S))}catch(e){}}
function load(){try{const s=localStorage.getItem('fbo_save');if(s){const o=JSON.parse(s);if(o&&o.v===2){S=o;return true}}}catch(e){}return false}
