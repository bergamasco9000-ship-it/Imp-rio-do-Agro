// ===== Bolsa de valores e investimentos =====
const STK=[
 {id:'BFRG3',n:'Frigorífico Boi Forte',sec:'frig',p0:28,vol:.017,beta:1,dv:.004,d:'Compra gado. Sobe quando a arroba sobe.'},
 {id:'AGRI3',n:'Agro Insumos Sul',sec:'agro',p0:46,vol:.015,beta:.9,dv:.003,d:'Sementes, adubo e máquinas.'},
 {id:'PAMP3',n:'Fazenda Pampa S.A.',sec:'terra',p0:62,vol:.014,beta:.8,dv:.006,d:'Grande fazenda de pecuária no Sul.'},
 {id:'PANT3',n:'Pantanal Agropecuária',sec:'terra',p0:18,vol:.02,beta:1.1,dv:.004,d:'Fazendas no Pantanal. Mais arriscada.'},
 {id:'LAVA3',n:'Laticínios Vale Verde',sec:'def',p0:34,vol:.01,beta:.5,dv:.005,d:'Defensiva: cai e sobe pouco.'},
 {id:'CACA3',n:'Armas & Caça Brasil',sec:'caca',p0:21,vol:.02,beta:1.2,dv:.002,d:'Sobe na temporada de caça.'},
 {id:'BAGR4',n:'Banco do Agro',sec:'banco',p0:38,vol:.012,beta:.9,dv:.006,d:'Lucra com juros altos.'},
 {id:'FIIT11',n:'Fundo de Terras (FII)',sec:'fii',p0:100,vol:.006,beta:.3,dv:.0075,d:'Aluguel de terras: renda mensal estável.'},
 {id:'BOIC',n:'Boi Coin (cripto)',sec:'cripto',p0:80,vol:.06,beta:.2,dv:0,d:'Altíssimo risco. Pode dobrar ou virar pó.'},
 {id:'SELIC',n:'Tesouro Selic',sec:'rf',p0:100,vol:0,beta:0,dv:0,d:'Renda fixa: rende a taxa Selic, sem risco.'}
];
const STKN=[
 {sec:'frig',per:-.012,d:4,t:'Febre aftosa no Sul: frigoríficos sofrem com embargos'},
 {sec:'frig',per:.01,d:4,t:'China abre mercado para a carne brasileira'},
 {sec:'agro',per:.008,d:4,t:'Safra recorde puxa vendas de insumos'},
 {sec:'agro',per:-.008,d:3,t:'Alta do dólar encarece insumos importados'},
 {sec:'terra',per:.009,d:5,t:'Preço da terra dispara no Centro-Oeste'},
 {sec:'terra',per:-.01,d:4,t:'Seca prolongada derruba valor das fazendas'},
 {sec:'def',per:.006,d:4,t:'Consumo de lácteos bate recorde'},
 {sec:'caca',per:.012,d:4,t:'Governo amplia temporada de caça de controle'},
 {sec:'caca',per:-.012,d:3,t:'Novo projeto restringe venda de munição'},
 {sec:'banco',per:.008,d:4,t:'Banco Central sinaliza juros altos por mais tempo'},
 {sec:'cripto',per:.05,d:2,t:'Boi Coin é citada por influenciador famoso: dispara!'},
 {sec:'cripto',per:-.06,d:2,t:'Exchange de Boi Coin é hackeada: pânico no mercado'},
 {sec:'all',per:-.006,d:4,t:'Crise internacional derruba as bolsas'},
 {sec:'all',per:.005,d:4,t:'Otimismo global: bolsas em alta'}
];
function ensureBk(){
 if(S.bk)return;
 const b=S.bk={p:{},hist:{},pf:{},reg:0,selic:10.5,news:[],shocks:[],realized:0,tax:0,lastMkt:mktEff(),divs:0};
 STK.forEach(s=>{b.p[s.id]=Math.round(s.p0*rnd(.9,1.1)*100)/100;b.hist[s.id]=[b.p[s.id]]});
 for(let i=0;i<30;i++)bkStep(1);
}
function bkStep(quiet){
 const b=S.bk;
 if(Math.random()<.04)b.reg=pick([-1,0,0,1,1]);
 b.selic=clamp(b.selic+gauss()*.07+(10.5-b.selic)*.01,6,16);
 const m=b.reg*.0012+gauss()*.008,mk=mktEff(),cf=clamp(mk/b.lastMkt-1,-.05,.05);b.lastMkt=mk;
 const mon=Math.floor((S.day%360)/30);
 const sh={};b.shocks=b.shocks.filter(x=>{sh[x.sec]=(sh[x.sec]||0)+x.per;return--x.d>0});
 STK.forEach(s=>{
  let p=b.p[s.id];
  if(s.sec==='rf')p*=1+b.selic/100/360;
  else{
   let r=s.beta*m+s.vol*gauss()+s.vol*s.vol*.5+.00015-(b.selic-10.5)*.0003*s.beta;
   if(s.sec==='frig')r+=1.2*cf;else if(s.sec==='terra')r+=.5*cf;else if(s.sec==='agro')r-=.3*cf;
   else if(s.sec==='caca'&&mon>=8&&mon<=10)r+=.0008;else if(s.sec==='banco')r+=(b.selic-10.5)*.0006;
   else if(s.sec==='cripto'&&Math.random()<.02)r+=gauss()*.15;
   r+=(sh[s.sec]||0)+(sh.all||0)*(s.sec==='rf'?0:1);
   p*=Math.max(.5,1+r);
  }
  b.p[s.id]=Math.max(.5,Math.round(p*100)/100);const h=b.hist[s.id];h.push(b.p[s.id]);if(h.length>40)h.shift();
 });
 if(quiet)return;
 if(Math.random()<.07){const n=pick(STKN);b.shocks.push({sec:n.sec,per:n.per,d:n.d});b.news.unshift({d:S.day,t:n.t,up:n.per>0});if(b.news.length>6)b.news.pop()}
 if(S.day%30===0){
  let tot=0;STK.forEach(s=>{const q=b.pf[s.id]&&b.pf[s.id].q;if(q&&s.dv){const v=Math.round(q*b.p[s.id]*s.dv);tot+=v}});
  if(tot>0){cash(tot,'Dividendos da bolsa');b.divs+=tot;toast('💰 Dividendos recebidos: '+R$(tot),'good')}
 }
}
const pfValue=()=>S.bk?STK.reduce((s,k)=>s+((S.bk.pf[k.id]&&S.bk.pf[k.id].q)||0)*S.bk.p[k.id],0):0;
const pfCost=()=>S.bk?STK.reduce((s,k)=>s+((S.bk.pf[k.id]&&S.bk.pf[k.id].q)||0)*((S.bk.pf[k.id]&&S.bk.pf[k.id].avg)||0),0):0;
const _nw=netWorth;
netWorth=function(){return _nw()+pfValue()};
const loanRate=()=>S.bk?(S.bk.selic/12+.4)/100:.012;
const _hd2=hookDay;
hookDay=function(){_hd2();ensureBk();bkStep(0)};
function spark(h,w,hh){
 const mn=Math.min(...h),mx=Math.max(...h),rg=(mx-mn)||1,pts=h.map((v,i)=>(i/(h.length-1)*w).toFixed(1)+','+(hh-2-(v-mn)/rg*(hh-4)).toFixed(1)).join(' ');
 const up=h[h.length-1]>=h[0];
 return '<svg width="'+w+'" height="'+hh+'" viewBox="0 0 '+w+' '+hh+'"><polyline fill="none" stroke="'+(up?'#6ac04a':'#e0503a')+'" stroke-width="1.6" points="'+pts+'"/></svg>';
}
function pBolsa(){
 if(LV()<4)return '<div class="card lock"><b>📈 Bolsa de Valores</b><div class="red">Libera no nível 4. Continue plantando, criando e caçando!</div></div>';
 ensureBk();const b=S.bk,val=pfValue(),cost=pfCost(),pl=val-cost;
 let h='<div class="card"><div class="row"><b>📈 Carteira</b><span class="gold">'+R$(val)+'</span></div><div class="dim">Caixa '+R$(S.money)+' · Lucro aberto <span class="'+(pl>=0?'grn':'red')+'">'+(pl>=0?'+':'')+R$(pl)+'</span> · Realizado '+R$(b.realized)+' · Dividendos '+R$(b.divs)+'</div>'
 +'<div class="dim">Selic '+b.selic.toFixed(2)+'% a.a. · Mercado: <b>'+(b.reg>0?'📈 alta':b.reg<0?'📉 baixa':'➡️ lateral')+'</b> · Corretagem 0,3% · IR 15% sobre o lucro ao vender</div></div>';
 if(b.news.length)h+='<div class="sec">NOTÍCIAS</div>'+b.news.slice(0,4).map(n=>'<div class="card" style="padding:6px 8px"><span class="dim">Dia '+n.d+'</span> '+(n.up?'🟢 ':'🔴 ')+n.t+'</div>').join('');
 h+='<div class="sec">ATIVOS</div>';
 STK.forEach(s=>{
  const hist=b.hist[s.id],p=b.p[s.id],prev=hist[hist.length-2]||p,ch=(p/prev-1)*100,m30=(p/hist[0]-1)*100,pos=b.pf[s.id]||{q:0,avg:0},q=pos.q;
  h+='<div class="card"><div class="row"><b>'+s.id+' <span class="dim">'+s.n+'</span></b><span class="gold">'+R$(p)+'</span></div>'
  +'<div class="row"><span class="dim">'+s.d+'</span>'+spark(hist,90,26)+'</div>'
  +'<div class="dim">Dia <span class="'+(ch>=0?'grn':'red')+'">'+(ch>=0?'+':'')+ch.toFixed(2)+'%</span> · 40 dias <span class="'+(m30>=0?'grn':'red')+'">'+(m30>=0?'+':'')+m30.toFixed(1)+'%</span>'+(s.dv?' · dividendo '+(s.dv*100).toFixed(2)+'%/mês':'')+'</div>'
  +(q?'<div class="dim">Você tem <b>'+q+'</b> · médio '+R$(pos.avg)+' · <span class="'+(p>=pos.avg?'grn':'red')+'">'+((p/pos.avg-1)*100).toFixed(1)+'%</span></div>':'')
  +'<div class="btns"><button class="b gold" data-act="stbuy" data-v="'+s.id+':1">Comprar 1</button><button class="b gold" data-act="stbuy" data-v="'+s.id+':10">×10</button><button class="b gold" data-act="stbuy" data-v="'+s.id+':max">Máx</button>'
  +(q?'<button class="b" data-act="stsell" data-v="'+s.id+':1">Vender 1</button><button class="b red" data-act="stsell" data-v="'+s.id+':all">Tudo</button>':'')+'</div></div>';
 });
 return h;
}
Object.assign(ACT,{
 stbuy(e){
  ensureBk();const[id,qs]=e.v.split(':'),b=S.bk,p=b.p[id];let q=qs==='max'?Math.floor(S.money/(p*1.003)):+qs;
  if(q<1)return toast('Dinheiro insuficiente','bad');
  const cost=p*q,fee=Math.max(1,cost*.003);if(S.money<cost+fee)return toast('Dinheiro insuficiente','bad');
  cash(-(cost+fee),'Compra '+id+' ×'+q);const pos=b.pf[id]||(b.pf[id]={q:0,avg:0});pos.avg=(pos.avg*pos.q+cost+fee)/(pos.q+q);pos.q+=q;
  S.tf.bolsa=1;toast('Comprou '+q+' '+id,'good');
 },
 stsell(e){
  ensureBk();const[id,qs]=e.v.split(':'),b=S.bk,pos=b.pf[id];if(!pos||!pos.q)return;let q=qs==='all'?pos.q:Math.min(+qs,pos.q);
  const p=b.p[id],gross=p*q,fee=Math.max(1,gross*.003),profit=gross-pos.avg*q-fee,tax=Math.max(0,profit*.15);
  cash(gross-fee-tax,'Venda '+id+' ×'+q);b.realized+=profit-tax;b.tax+=tax;pos.q-=q;if(pos.q<=0)delete b.pf[id];
  if(profit>0)gainXP(Math.min(60,profit/200),'investimento');
  toast('Vendeu '+q+' '+id+' · '+(profit>=0?'lucro ':'prejuízo ')+R$(profit-tax)+(tax?' (IR '+R$(tax)+')':''),profit>=0?'good':'bad');
 }
});
