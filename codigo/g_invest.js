// ===== Investimentos com valores reais (nov/2026): renda fixa, ações, cripto, dólar e ouro =====
// Valores iniciais: Bitcoin ~R$ 388,5 mil (13/nov/2026), Ethereum ~R$ 10,5 mil, dólar R$ 5,65, ouro ~R$ 720/g,
// Selic 13,75% (Copom 04/nov/2026), IPCA projetado 5,6% em 2026, Ibovespa ~171 mil pontos (BOVA11 ~R$ 166).
{const t=TABS.find(t=>t[0]==='bolsa');if(t)t[1]='📈 Investimentos'}
const NEWA=[
 {id:'BOVA11',n:'Fundo de índice Ibovespa',cls:'acao',sec:'idx',p0:166,vol:.012,beta:1,dv:0,d:'Acompanha o Ibovespa (~171 mil pontos em nov/2026). Diversificado: as 80 maiores empresas da B3.'},
 {id:'BTC',n:'Bitcoin',cls:'cripto',sec:'btc',p0:388500,vol:.031,mu:.0007,dec:6,d:'A maior criptomoeda. Em nov/2026 vale ~US$ 69 mil (~R$ 388 mil). Pode cair ou subir 10% em poucos dias. Compre frações.'},
 {id:'ETH',n:'Ethereum',cls:'cripto',sec:'eth',p0:10500,vol:.042,mu:.0006,dec:5,d:'Segunda maior cripto. Ainda mais volátil que o bitcoin; costuma andar junto com ele.'},
 {id:'USD',n:'Dólar americano',cls:'fx',sec:'usd',p0:5.65,vol:.0085,dec:2,d:'Proteção contra crise e eleição. Câmbio com spread de 1%.'},
 {id:'OURO',n:'Ouro 24k (grama)',cls:'fx',sec:'ouro',p0:720,vol:.011,dec:2,d:'Reserva de valor milenar. Sobe em crises e quando o dólar sobe.'}
];
const ACLS={acao:'Ações (B3)',cripto:'Criptomoedas',fx:'Dólar e ouro'};
function stkCls(s){return s.cls||(s.sec==='cripto'?'cripto':'acao')}
// remove o "Tesouro Selic" antigo da lista de ações (agora é renda fixa de verdade) e coloca os novos ativos
{const i=STK.findIndex(s=>s.id==='SELIC');if(i>=0)STK.splice(i,1);NEWA.forEach(a=>{if(!STK.find(s=>s.id===a.id))STK.push(a)});const bc=STK.find(s=>s.id==='BOIC');if(bc){bc.cls='cripto';bc.n='Boi Coin (memecoin do agro)';bc.d='Moeda de brincadeira criada por influenciador do agro. Risco extremo: pode multiplicar ou virar pó.'}}
STK.forEach(s=>{if(!s.cls)s.cls=stkCls(s)});
// ---------- renda fixa
const RFP=[
 {id:'poup',ic:'🐷',n:'Poupança',ir:0,car:0,d:'Rende 0,5% ao mês + TR (regra com Selic acima de 8,5%). Isenta de IR, rende pouco.',rate:b=>(Math.pow(1.005+(b.tr||.0012),12)-1)*100},
 {id:'selic',ic:'🏛️',n:'Tesouro Selic 2031',ir:1,car:0,d:'Título do governo federal: o investimento mais seguro do país. Rende a taxa Selic.',rate:b=>b.selic-.02},
 {id:'cdb',ic:'🏦',n:'CDB Banco do Agro 105% do CDI',ir:1,car:0,d:'Empréstimo para o banco, com garantia do FGC até R$ 250 mil. Liquidez diária.',rate:b=>(b.selic-.1)*1.05},
 {id:'lca',ic:'🌾',n:'LCA 93% do CDI',ir:0,car:90,d:'Letra de Crédito do Agronegócio: seu dinheiro financia o agro. Isenta de IR. Carência de 90 dias.',rate:b=>(b.selic-.1)*.93},
 {id:'ipca',ic:'📜',n:'Tesouro IPCA+ 2035',ir:1,car:0,mtm:1,d:'Paga a inflação + 7,2% ao ano. Antes do vencimento o preço oscila: se os juros sobem, ele cai.',rate:b=>((1+b.ipca/100)*(1.072)-1)*100}
];
const irReg=d=>d<=180?.225:d<=360?.2:d<=720?.175:.15;
// ---------- estado
const _ensBkOld=ensureBk;
ensureBk=function(){let fresh=false;if(!S.bk){fresh=true;_ensBkOld()}const b=S.bk;
 if(!b.v2){b.v2=1;b.rf=[];b.ipca=5.6;b.tr=.0012;b.copom=S.day+20;b.ms={m:Math.floor(S.day/30),acao:0,cripto:0,fx:0};b.selic=13.75;b.irPago=b.tax||0;
  if(b.pf.SELIC){const v=Math.round(b.pf.SELIC.q*(b.p.SELIC||100));b.rf.push({id:'selic',v,c:v,d:S.day});delete b.pf.SELIC}delete b.p.SELIC;delete b.hist.SELIC;
  NEWA.forEach(a=>{b.p[a.id]=a.p0;b.hist[a.id]=backHist(a,a.p0,60)})}
 if(fresh)NEWA.forEach(a=>{b.p[a.id]=a.p0;b.hist[a.id]=backHist(a,a.p0,60)});
 STK.forEach(s=>{if(b.p[s.id]===undefined){b.p[s.id]=s.p0;b.hist[s.id]=backHist(s,s.p0,60)}});
 if(!b.ms)b.ms={m:Math.floor(S.day/30),acao:0,cripto:0,fx:0};if(!b.rf)b.rf=[];return b};
const BHF={BTC:1.1,ETH:1.12,USD:.97,OURO:1.01,BOVA11:.97};
function backHist(s,p,n){const w=[0];for(let i=1;i<n;i++)w.push(w[i-1]+(s.vol||.01)*.8*gauss());const f=Math.log(BHF[s.id]||1),e=w[n-1];return w.map((v,i)=>{const t=i/(n-1),l=v-e*t+f*(1-t);return Math.round(p*Math.exp(l)*100)/100})}
// ---------- mercado: um passo por dia de jogo
bkStep=function(quiet){const b=ensureBk();
 if(Math.random()<.04)b.reg=pick([-1,0,0,1,1]);
 // inflação e Copom (a cada 45 dias)
 b.ipca=clamp(b.ipca+gauss()*.04+(4.5-b.ipca)*.004,2.5,9);b.tr=clamp((b.selic-8.5)*.0003,0,.002);
 let dSel=0;if(S.day>=b.copom){b.copom=S.day+45;const real=b.selic-b.ipca;let mv=0;if(b.ipca>6)mv=.5;else if(b.ipca>5.2)mv=Math.random()<.5?0:.25;else if(real>7)mv=-.5;else if(real>6)mv=-.25;mv=clamp(mv,6.5-b.selic,16-b.selic);dSel=mv;b.selic=Math.round((b.selic+mv)*100)/100;
  if(!quiet){const t=mv>0?'Copom sobe a Selic para '+b.selic.toFixed(2).replace('.',',')+'% ao ano':mv<0?'Copom corta a Selic para '+b.selic.toFixed(2).replace('.',',')+'% ao ano':'Copom mantém a Selic em '+b.selic.toFixed(2).replace('.',',')+'% ao ano';b.news.unshift({d:S.day,t,up:mv<=0});if(b.news.length>8)b.news.pop();toast('🏛️ '+t+' (inflação '+b.ipca.toFixed(1)+'%)',mv>0?'bad':'good')}}
 const m=b.reg*.0011+gauss()*.0085,mk=mktEff(),cf=clamp(mk/b.lastMkt-1,-.05,.05);b.lastMkt=mk;const mon=Math.floor((S.day%360)/30);
 const sh={};b.shocks=b.shocks.filter(x=>{sh[x.sec]=(sh[x.sec]||0)+x.per;return--x.d>0});
 const cr=gauss(),fx=gauss()*.0085+(5.5-(b.p.USD||5.65))*.002-m*.25+(sh.usd||0);
 STK.forEach(s=>{let p=b.p[s.id],r;
  if(s.sec==='btc')r=(s.mu||0)+s.vol*(cr*.85+gauss()*.5)+(Math.random()<.015?gauss()*.09:0)+(sh.btc||0)+(sh.cripto||0);
  else if(s.sec==='eth')r=(s.mu||0)+s.vol*(cr*.8+gauss()*.6)+(Math.random()<.015?gauss()*.11:0)+(sh.eth||0)+(sh.cripto||0);
  else if(s.sec==='usd')r=fx;
  else if(s.sec==='ouro')r=.0002+s.vol*gauss()*.8+fx*.55-m*.1+(sh.ouro||0);
  else{r=(s.beta||1)*m+s.vol*gauss()+.00025-(b.selic-11)*.00025*(s.beta||1)-dSel*.01*(s.beta||1);
   if(s.sec==='frig')r+=1.2*cf;else if(s.sec==='terra')r+=.5*cf;else if(s.sec==='agro')r-=.3*cf-fx*.3;
   else if(s.sec==='caca'&&mon>=8&&mon<=10)r+=.0008;else if(s.sec==='banco')r+=(b.selic-11)*.0005;
   else if(s.sec==='cripto'){r=s.vol*gauss()+cr*.03+(Math.random()<.02?gauss()*.15:0)}
   r+=(sh[s.sec]||0)+(sh.all||0)}
  p*=Math.max(.5,Math.exp(r));b.p[s.id]=Math.max(.01,Math.round(p*100)/100);const h=b.hist[s.id]||(b.hist[s.id]=[]);h.push(b.p[s.id]);if(h.length>90)h.shift()});
 // renda fixa rende todo dia
 b.rf.forEach(x=>{const P=RFP.find(r=>r.id===x.id);if(!P)return;let d=Math.pow(1+P.rate(b)/100,1/360)-1;if(P.mtm)d+=-dSel/100*6+gauss()*.0012;x.v*=1+d});
 if(quiet)return;
 if(Math.random()<.08){const n=pick(INVN);b.shocks.push({sec:n.sec,per:n.per,d:n.d});b.news.unshift({d:S.day,t:n.t,up:n.per>0});if(b.news.length>8)b.news.pop()}
 if(S.day%30===0){let tot=0;STK.forEach(s=>{const q=b.pf[s.id]&&b.pf[s.id].q;if(q&&s.dv){tot+=Math.round(q*b.p[s.id]*s.dv)}});if(tot>0){cash(tot,'Dividendos');b.divs+=tot;toast('💰 Dividendos recebidos: '+R$(tot),'good')}}
 const mi=Math.floor(S.day/30);if(b.ms.m!==mi)b.ms={m:mi,acao:0,cripto:0,fx:0}};
const INVN=STKN.concat([
 {sec:'cripto',per:.035,d:3,t:'Grandes gestoras compram bitcoin via ETF: cripto em alta'},
 {sec:'cripto',per:-.04,d:3,t:'Corretora de cripto é hackeada: pânico no mercado'},
 {sec:'btc',per:.03,d:2,t:'País anuncia bitcoin nas reservas nacionais'},
 {sec:'btc',per:-.03,d:2,t:'Saídas recordes dos ETFs de bitcoin derrubam o preço'},
 {sec:'eth',per:.035,d:2,t:'Atualização da rede Ethereum anima investidores'},
 {sec:'usd',per:.006,d:3,t:'Incerteza fiscal: dólar dispara frente ao real'},
 {sec:'usd',per:-.005,d:3,t:'Fluxo estrangeiro forte derruba o dólar'},
 {sec:'ouro',per:.006,d:3,t:'Tensão geopolítica: ouro bate recorde'},
 {sec:'idx',per:.006,d:3,t:'Estrangeiros voltam à B3: Ibovespa sobe forte'},
 {sec:'idx',per:-.007,d:3,t:'Risco fiscal derruba o Ibovespa'}
]);
// ---------- valores e impostos
const rfValue=()=>S.bk&&S.bk.rf?S.bk.rf.reduce((s,x)=>s+x.v,0):0;
const _nwInv=netWorth;netWorth=function(){return _nwInv()+rfValue()};
function clsVal(c){const b=S.bk;return STK.filter(s=>s.cls===c).reduce((t,s)=>t+((b.pf[s.id]&&b.pf[s.id].q)||0)*b.p[s.id],0)}
function clsCost(c){const b=S.bk;return STK.filter(s=>s.cls===c).reduce((t,s)=>t+((b.pf[s.id]&&b.pf[s.id].q)||0)*((b.pf[s.id]&&b.pf[s.id].avg)||0),0)}
const ISENT={acao:20000,cripto:35000,fx:35000};
const fmtQ=(q,s)=>{const d=s.dec||0;return d?q.toLocaleString('pt-BR',{maximumFractionDigits:d}):String(Math.round(q))};
const fmtP=p=>p<10?'R$ '+p.toFixed(2).replace('.',','):R$(p);
// ---------- tela
let INVT='resumo';
function chartSVG(h,w,hh,big){const mn=Math.min(...h),mx=Math.max(...h),rg=(mx-mn)||1,up=h[h.length-1]>=h[0],col=up?'#6ac04a':'#e0503a';
 const pts=h.map((v,i)=>[(i/(h.length-1)*w),(hh-4-(v-mn)/rg*(hh-10))]);const line=pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
 let s='<svg width="'+w+'" height="'+hh+'" viewBox="0 0 '+w+' '+hh+'" style="display:block">';if(big){for(let i=0;i<4;i++)s+='<line x1="0" x2="'+w+'" y1="'+(6+i*(hh-10)/3)+'" y2="'+(6+i*(hh-10)/3)+'" stroke="rgba(255,255,255,.08)"/>';s+='<polygon fill="'+col+'" opacity=".15" points="0,'+hh+' '+line+' '+w+','+hh+'"/>'}
 return s+'<polyline fill="none" stroke="'+col+'" stroke-width="'+(big?2:1.6)+'" points="'+line+'"/></svg>'}
const pct=(a,b)=>((a/b-1)*100),pctS=v=>'<span class="'+(v>=0?'grn':'red')+'">'+(v>=0?'+':'')+v.toFixed(2).replace('.',',')+'%</span>';
pBolsa=function(){
 if(LV()<4)return '<div class="card lock"><b>📈 Investimentos</b><div class="red">Libera no nível 4. Continue plantando, criando e caçando!</div></div>';
 const b=ensureBk(),tabs=[['resumo','📊 Resumo'],['rf','🏛️ Renda fixa'],['acao','📈 Ações'],['cripto','₿ Cripto'],['fx','💵 Dólar e ouro']];
 let h='<div class="btns" style="flex-wrap:wrap">'+tabs.map(t=>'<button class="b '+(INVT===t[0]?'gold':'')+'" data-act="invt" data-v="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>';
 h+='<div class="card" style="padding:6px 8px"><div class="dim">Selic <b>'+b.selic.toFixed(2).replace('.',',')+'%</b> · CDI '+(b.selic-.1).toFixed(2).replace('.',',')+'% · IPCA '+b.ipca.toFixed(1).replace('.',',')+'% · Dólar '+fmtP(b.p.USD)+' · BTC '+R$(b.p.BTC)+' · próximo Copom em '+Math.max(0,b.copom-S.day)+' dias</div></div>';
 if(INVT==='resumo')h+=invResumo(b);else if(INVT==='rf')h+=invRF(b);else h+=invCls(b,INVT);
 return h};
function invResumo(b){const rf=rfValue(),rfC=b.rf.reduce((s,x)=>s+x.c,0),rows=[['🏛️ Renda fixa',rf,rfC],['📈 Ações',clsVal('acao'),clsCost('acao')],['₿ Cripto',clsVal('cripto'),clsCost('cripto')],['💵 Dólar e ouro',clsVal('fx'),clsCost('fx')]],tot=rows.reduce((s,r)=>s+r[1],0),totC=rows.reduce((s,r)=>s+r[2],0);
 let h='<div class="card"><div class="row"><b>💼 Total investido</b><span class="gold">'+R$(tot)+'</span></div><div class="dim">Lucro em aberto '+pctS(totC?pct(tot,totC):0)+' ('+R$(tot-totC)+') · lucro já realizado '+R$(b.realized)+' · dividendos '+R$(b.divs)+' · IR pago '+R$(b.irPago||0)+'</div>';
 h+=rows.map(r=>'<div class="row" style="margin-top:4px"><span>'+r[0]+'</span><span>'+R$(r[1])+' <span class="dim">'+(tot?Math.round(r[1]/tot*100):0)+'%</span></span></div><div style="height:6px;background:#2a1a10;border-radius:3px"><i style="display:block;height:6px;border-radius:3px;background:#c8a040;width:'+(tot?r[1]/tot*100:0)+'%"></i></div>').join('')+'</div>';
 const rendaMes=b.rf.reduce((s,x)=>{const P=RFP.find(r=>r.id===x.id);return s+x.v*(Math.pow(1+P.rate(b)/100,1/12)-1)},0);
 h+='<div class="card dim">Sua renda fixa rende cerca de <b class="grn">'+R$(rendaMes)+'</b> por mês. Cada dia de jogo é um dia de mercado. Ações: vendas de até R$ 20 mil no mês são isentas de IR; cripto, dólar e ouro: até R$ 35 mil. Acima disso, 15% sobre o lucro.</div>';
 if(b.news.length)h+='<div class="sec">NOTÍCIAS DO MERCADO</div>'+b.news.slice(0,5).map(n=>'<div class="card" style="padding:6px 8px"><span class="dim">Dia '+n.d+'</span> '+(n.up?'🟢 ':'🔴 ')+n.t+'</div>').join('');
 return h}
function invRF(b){return RFP.map(P=>{const pos=b.rf.filter(x=>x.id===P.id),v=pos.reduce((s,x)=>s+x.v,0),c=pos.reduce((s,x)=>s+x.c,0),lock=pos.some(x=>S.day-x.d<P.car);
 return '<div class="card"><div class="row"><b>'+P.ic+' '+P.n+'</b><span class="gold">'+P.rate(b).toFixed(2).replace('.',',')+'% a.a.</span></div><div class="dim">'+P.d+(P.ir?' IR regressivo: 22,5% até 180 dias … 15% após 2 anos.':'')+'</div>'
  +(v?'<div>Aplicado '+R$(c)+' → <b>'+R$(v)+'</b> '+pctS(pct(v,c))+(lock?' <span class="dim">· em carência</span>':'')+'</div>':'')
  +'<div class="btns">'+[1000,10000,100000].map(a=>'<button class="b gold" data-act="rfin" data-v="'+P.id+':'+a+'">+'+(a>=1000?(a/1000)+' mil':a)+'</button>').join('')+'<button class="b gold" data-act="rfin" data-v="'+P.id+':max">Tudo</button>'+(v?'<button class="b red" data-act="rfout" data-v="'+P.id+'">Resgatar</button>':'')+'</div></div>'}).join('')}
function invCls(b,c){return STK.filter(s=>s.cls===c).map(s=>{const hst=b.hist[s.id],p=b.p[s.id],prev=hst[hst.length-2]||p,pos=b.pf[s.id]||{q:0,avg:0},q=pos.q;
 return '<div class="card"><div class="row"><b>'+s.id+' <span class="dim">'+s.n+'</span></b><span class="gold">'+fmtP(p)+'</span></div>'
  +'<div class="row"><span class="dim">Dia '+pctS(pct(p,prev))+' · '+hst.length+' dias '+pctS(pct(p,hst[0]))+(s.dv?' · dividendo '+(s.dv*100).toFixed(2).replace('.',',')+'%/mês':'')+'</span>'+chartSVG(hst,96,28)+'</div>'
  +(q?'<div>Você tem <b>'+fmtQ(q,s)+'</b> ('+R$(q*p)+') · preço médio '+fmtP(pos.avg)+' '+pctS(pct(p,pos.avg))+'</div>':'')
  +'<div class="btns"><button class="b" data-act="invdet" data-v="'+s.id+'">📈 Gráfico</button>'+[1000,10000].map(a=>'<button class="b gold" data-act="invbuy" data-v="'+s.id+':'+a+'">+R$ '+(a/1000)+' mil</button>').join('')+(q?'<button class="b red" data-act="invsell" data-v="'+s.id+':1">Vender tudo</button>':'')+'</div></div>'}).join('')}
function invDet(id){const b=ensureBk(),s=STK.find(x=>x.id===id),hst=b.hist[id],p=b.p[id],pos=b.pf[id]||{q:0,avg:0},mx=Math.max(...hst),mn=Math.min(...hst);reModal=()=>invDet(id);
 showModal('<h3>'+s.id+' · '+s.n+'</h3><div class="row"><b class="gold" style="font-size:26px">'+fmtP(p)+'</b><span>'+pctS(pct(p,hst[hst.length-2]||p))+' hoje</span></div>'
  +'<div class="card" style="padding:4px">'+chartSVG(hst,300,130,1)+'<div class="row dim"><span>'+hst.length+' dias atrás</span><span>hoje</span></div></div>'
  +'<div class="dim">Máxima '+fmtP(mx)+' · mínima '+fmtP(mn)+' · variação no período '+pctS(pct(p,hst[0]))+'</div><div class="card dim">'+s.d+'</div>'
  +(pos.q?'<div class="card">Você tem <b>'+fmtQ(pos.q,s)+'</b> '+(s.id==='OURO'?'gramas':s.id==='USD'?'dólares':s.cls==='acao'?'cotas/ações':s.id)+' = <b>'+R$(pos.q*p)+'</b> · médio '+fmtP(pos.avg)+' '+pctS(pct(p,pos.avg))+'</div>':'')
  +'<div class="sec">COMPRAR</div><div class="btns">'+[1000,10000,100000].map(a=>'<button class="b gold" data-act="invbuy" data-v="'+id+':'+a+'">R$ '+(a/1000)+' mil</button>').join('')+'<button class="b gold" data-act="invbuy" data-v="'+id+':max">Tudo</button></div>'
  +(pos.q?'<div class="sec">VENDER</div><div class="btns">'+[[.25,'25%'],[.5,'50%'],[1,'Tudo']].map(x=>'<button class="b red" data-act="invsell" data-v="'+id+':'+x[0]+'">'+x[1]+'</button>').join('')+'</div>':'')
  +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
const SPRD={acao:.0003,cripto:.005,fx:.01};
Object.assign(ACT,{
 invt(e){INVT=e.v},invdet(e){invDet(e.v)},
 invbuy(e){const b=ensureBk(),[id,a]=e.v.split(':'),s=STK.find(x=>x.id===id),p=b.p[id],fee=SPRD[s.cls]||.0003;let val=a==='max'?S.money:+a;val=Math.min(val,S.money);
  let q=val/(p*(1+fee));if(s.cls==='acao'||!s.dec)q=Math.floor(q);else q=Math.floor(q*Math.pow(10,s.dec))/Math.pow(10,s.dec);if(q<=0)return toast('Dinheiro insuficiente','bad');
  const cost=q*p*(1+fee);cash(-cost,'Compra '+id);const pos=b.pf[id]||(b.pf[id]={q:0,avg:0});pos.avg=(pos.avg*pos.q+cost)/(pos.q+q);pos.q+=q;S.tf.bolsa=1;
  toast('✅ Comprou '+fmtQ(q,s)+' '+id+' por '+R$(cost),'good');if(id==='BTC')S.tf.btc=1},
 invsell(e){const b=ensureBk(),[id,f]=e.v.split(':'),s=STK.find(x=>x.id===id),pos=b.pf[id];if(!pos||!pos.q)return;let q=pos.q*(+f||1);if(s.cls==='acao'||!s.dec)q=Math.max(1,Math.floor(q));q=Math.min(q,pos.q);
  const p=b.p[id],fee=SPRD[s.cls]||.0003,gross=q*p*(1-fee),profit=gross-pos.avg*q,c=s.cls;b.ms[c]=(b.ms[c]||0)+gross;const tax=b.ms[c]>ISENT[c]&&profit>0?profit*.15:0;
  cash(gross-tax,'Venda '+id);b.realized+=profit-tax;b.irPago=(b.irPago||0)+tax;pos.q-=q;if(pos.q<=1e-9)delete b.pf[id];if(profit>0)gainXP(Math.min(80,profit/300),'investimento');
  toast((profit>=0?'📈 Lucro ':'📉 Prejuízo ')+R$(profit-tax)+' vendendo '+fmtQ(q,s)+' '+id+(tax?' (IR '+R$(tax)+')':' (isento de IR)'),profit>=0?'good':'bad')},
 rfin(e){const b=ensureBk(),[id,a]=e.v.split(':');let v=a==='max'?Math.floor(S.money):Math.min(+a,Math.floor(S.money));if(v<100)return toast('Mínimo de R$ 100','bad');cash(-v,'Aplicação: '+RFP.find(r=>r.id===id).n);b.rf.push({id,v,c:v,d:S.day});S.tf.bolsa=1;toast('✅ Aplicou '+R$(v),'good')},
 rfout(e){const b=ensureBk(),P=RFP.find(r=>r.id===e.v);let tot=0,tax=0,locked=0;b.rf=b.rf.filter(x=>{if(x.id!==P.id)return true;if(S.day-x.d<P.car){locked++;return true}const g=x.v-x.c,t=P.ir&&g>0?g*irReg(S.day-x.d):0;tot+=x.v-t;tax+=t;b.realized+=g-t;return false});
  if(!tot&&locked)return toast('🔒 A LCA tem carência de 90 dias','bad');if(!tot)return;b.irPago=(b.irPago||0)+tax;cash(Math.round(tot),'Resgate: '+P.n);toast('💰 Resgatou '+R$(tot)+(tax?' (IR '+R$(tax)+')':' (isento)')+(locked?' · parte ainda em carência':''),'good')}
});
ACT.stbuy=e=>ACT.invbuy({v:e.v.split(':')[0]+':'+(e.v.split(':')[1]==='max'?'max':1000)});ACT.stsell=e=>ACT.invsell({v:e.v.split(':')[0]+':1'});
ACH.push(['hodl','Hodler','Tenha 0,1 bitcoin',()=>S.bk&&S.bk.pf.BTC&&S.bk.pf.BTC.q>=.1,15000],['rentista','Rentista','Tenha R$ 500 mil em renda fixa',()=>rfValue()>=5e5,20000]);
GUIDE.push({lv:4,ic:'📈',t:'Investimentos',h:'No MENU › 📈 Investimentos: renda fixa (Poupança, Tesouro Selic, CDB, LCA isenta e Tesouro IPCA+), ações (fundo do Ibovespa e empresas do agro), criptomoedas (Bitcoin e Ethereum com valor real de nov/2026, compra em frações) e dólar e ouro. Cada dia de jogo é um dia de mercado; o Copom muda a Selic a cada 45 dias. IR como no Brasil: ações isentas até R$ 20 mil de vendas no mês, cripto até R$ 35 mil, renda fixa com tabela regressiva.'});
