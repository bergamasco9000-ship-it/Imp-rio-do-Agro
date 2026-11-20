let tab='herd',flt='all',lim=15,speed=1,modalOpen=false,dayFlag=0;
const TABS=[['herd','🐄 Rebanho'],['market','🏪 Mercado'],['auc','🔨 Leilão'],['up','🔧 Melhorias'],['fin','🏦 Finanças'],['goals','🎯 Metas']];
const find=id=>S.herd.find(a=>a.id==id);
const bar=(v,c)=>'<div class="bar"><i style="width:'+clamp(v,0,100)+'%;background:'+c+'"></i></div>';
const stars=g=>'★'.repeat(Math.max(1,Math.round(g/20)))+'☆'.repeat(5-Math.max(1,Math.round(g/20)));
function renderAll(){renderHUD();$('tabs').innerHTML=TABS.map(t=>'<button data-act="tab" data-v="'+t[0]+'" class="'+(tab===t[0]?'on':'')+'">'+t[1]+'</button>').join('');renderPanel()}
function renderHUD(){
 const mon=Math.floor((S.day%360)/30),yr=Math.floor(S.day/360)+1;
 const sp=[[0,'⏸'],[1,'▶'],[2,'▶▶'],[4,'▶▶▶'],[10,'⏩']].map(s=>'<button data-act="spd" data-v="'+s[0]+'" class="'+(speed===s[0]?'on':'')+'">'+s[1]+'</button>').join('');
 $('hud').innerHTML='<div><div class="m '+(S.money<0?'red':'')+'">'+R$(S.money)+'</div><small>Patrimônio '+R$(netWorth())+(S.debt?' · Dívida '+R$(S.debt):'')+'<br>'+repName(S.rep)+' · rep. '+Math.floor(S.rep)+'</small></div>'
 +'<div><b>'+(S.day%30+1)+'/'+MONTHS[mon]+' · Ano '+yr+'</b><small>'+(S.drought>0?'🌵 Seca':S.weather==='chuva'?'🌧️ Chuva':isWet()?'☀️ Estação chuvosa':'☀️ Estação seca')+' · @ Nelore '+R$(arroba('nelore'))+'</small></div>'
 +'<div class="spd">'+sp+'<button data-act="help">?</button></div>';
}
function tagsOf(a){
 let t='';
 if(ready(a))t+='<span class="tag g">Pronto p/ abate</span>';
 if(a.sick)t+='<span class="tag r">Doente</span>';
 if(a.preg)t+='<span class="tag p">Prenhe '+Math.round(a.preg/GEST*100)+'%</span>';
 if(a.vacc>S.day)t+='<span class="tag g">Vacinado</span>';
 if(a.breeder)t+='<span class="tag y">Reprodutor</span>';
 if(a.title)t+='<span class="tag y">🏆 Campeão</span>';
 if(a.cons)t+='<span class="tag y">No leilão</span>';
 return t;
}
function card(a){
 const B=BREEDS[a.breed],fp=Math.round(frigPrice(a));let b='';
 b+='<button class="b gold" data-act="sell" data-id="'+a.id+'">Vender '+R$(fp)+'</button>';
 if(S.aucOpen)b+='<button class="b blue" data-act="cons" data-id="'+a.id+'">'+(a.cons?'Tirar do leilão':'Pôr no leilão')+'</button>';
 if(a.sick)b+='<button class="b red" data-act="treat" data-id="'+a.id+'">Tratar '+R$(treatCost())+'</button>';
 if(a.vacc<=S.day)b+='<button class="b gray" data-act="vacc" data-id="'+a.id+'">Vacinar</button>';
 if(a.sex==='M'&&a.age>=300)b+='<button class="b gray" data-act="breeder" data-id="'+a.id+'">'+(a.breeder?'Tirar de reprodutor':'Reprodutor')+'</button>';
 if(S.up.ia&&a.sex==='F'&&!a.preg&&a.age>=420&&S.straws&&S.straws.length)b+='<button class="b blue" data-act="ai" data-id="'+a.id+'">Inseminar</button>';
 if(S.expo&&a.expo!==S.expo.until&&a.age>=300)b+='<button class="b gold" data-act="expo" data-id="'+a.id+'">Expor R$ 300</button>';
 return '<div class="card '+(SEL===a.id?'sel':'')+'"><div class="row"><b>'+a.name+' <span class="dim">'+B.n+' '+(a.sex==='F'?'♀':'♂')+'</span></b><span class="gold">'+stars(a.gen)+'</span></div>'
 +'<div class="dim">'+ageTxt(a)+' · '+Math.round(a.w)+' kg ('+(a.w*.5/15).toFixed(1)+' @) · gen '+a.gen+' · saúde '+Math.round(a.hp)+'%</div>'+bar(a.hp,a.hp>60?'#5fd95a':a.hp>30?'#e0a431':'#d9503f')+'<div style="margin-top:4px">'+tagsOf(a)+'</div><div class="btns">'+b+'</div></div>';
}
function renderPanel(){
 const P=$('panel'),fn={herd:pHerd,market:pMarket,auc:pAuc,up:pUp,fin:pFin,goals:pGoals}[tab];P.innerHTML=fn();
}
function pHerd(){
 const n=S.herd.length,pc=S.pasture,load=AU()/cap();
 let h='<div class="card"><div class="row"><b>Pasto</b><span>'+n+' / '+cap()+' cabeças'+(n>cap()?' <span class="red">LOTADO</span>':'')+'</span></div>'+bar(pc,pc>50?'#5fd95a':pc>25?'#e0a431':'#d9503f')
 +'<div class="row" style="margin-top:4px"><span class="dim">Ração: '+Math.floor(S.feed)+' / '+siloCap()+' kg · '+R$(feedPrice())+'/kg</span><span class="dim">Lotação '+Math.round(load*100)+'%</span></div>'
 +'<div class="btns"><button class="b" data-act="feed" data-v="'+Math.min(500,siloCap())+'">Comprar ração</button><button class="b '+(S.suppl?'':'gray')+'" data-act="suppl">Suplemento: '+(S.suppl?'LIGADO':'DESLIGADO')+'</button>'
 +'<button class="b gray" data-act="vaccall">Vacinar todos</button><button class="b gold" data-act="sellready">Vender prontos ('+S.herd.filter(a=>a.sex==='M'&&ready(a)).length+')</button></div></div>';
 if(S.camp>S.day)h+='<div class="card"><b class="gold">💉 Campanha de vacinação aberta</b> <span class="dim">(vacina protege 180 dias)</span></div>';
 if(S.offers.length)h+='<div class="card"><h3>📞 Propostas</h3>'+S.offers.map(o=>{const a=find(o.id);return '<div class="row" style="margin-bottom:4px"><span>'+o.buyer+' quer '+a.name+' por <b class="gold">'+R$(o.price)+'</b></span><button class="b gold" data-act="offer" data-id="'+o.id+'">Aceitar</button></div>'}).join('')+'</div>';
 const f={all:a=>1,F:a=>a.sex==='F'&&a.age>=240,M:a=>a.sex==='M'&&a.age>=240,calf:a=>a.age<240,sick:a=>a.sick,ready:a=>ready(a),preg:a=>a.preg};
 h+='<div class="pills">'+[['all','Todos'],['F','Fêmeas'],['M','Machos'],['calf','Bezerros'],['preg','Prenhes'],['ready','Prontos'],['sick','Doentes']].map(x=>'<button data-act="flt" data-v="'+x[0]+'" class="'+(flt===x[0]?'on':'')+'">'+x[1]+'</button>').join('')+'</div>';
 let l=S.herd.filter(f[flt]).sort((a,b)=>(b.id===SEL)-(a.id===SEL)||frigPrice(b)-frigPrice(a));
 if(!l.length)h+='<div class="dim">Nenhum animal aqui.</div>';
 h+=l.slice(0,lim).map(card).join('');
 if(l.length>lim)h+='<button class="b gray" data-act="more">Mostrar mais ('+(l.length-lim)+')</button>';
 return h;
}
function pMarket(){
 let h='<h3>Compra direta de criadores</h3><div class="dim" style="margin-bottom:6px">Atualiza toda semana. Reputação libera raças nobres.</div>';
 S.listings.forEach((x,i)=>{const a=x.a,B=BREEDS[a.breed],lock=S.rep<B.rep;
  h+='<div class="card '+(lock?'lock':'')+'"><div class="row"><b>'+B.n+' '+(a.sex==='F'?'♀':'♂')+' <span class="gold">'+stars(a.gen)+'</span></b><span class="gold">'+R$(x.price)+'</span></div><div class="dim">'+ageTxt(a)+' · '+Math.round(a.w)+' kg · gen '+a.gen+'</div>'
  +(lock?'<div class="red">Requer reputação '+B.rep+'</div>':'<div class="btns"><button class="b" data-act="buy" data-v="'+i+'">Comprar</button></div>')+'</div>'});
 h+='<h3>🌾 Ração</h3><div class="card"><div class="dim">Estoque '+Math.floor(S.feed)+'/'+siloCap()+' kg · '+R$(feedPrice())+' por kg</div><div class="btns">'+[100,500,2000,99999].map(v=>'<button class="b" data-act="feed" data-v="'+v+'">'+(v>9999?'Encher silo':'+'+v+' kg')+'</button>').join('')+'</div></div>';
 if(S.up.ia){h+='<h3>🧬 Sêmen de touros campeões</h3>';(S.sem||[]).forEach((s,i)=>{h+='<div class="card"><div class="row"><b>'+BREEDS[s.br].n+' <span class="gold">gen '+s.g+'</span></b><span class="gold">'+R$(s.p)+'</span></div><div class="btns"><button class="b blue" data-act="straw" data-v="'+i+'">Comprar palha</button></div></div>'});
  h+='<div class="dim">Palhas em estoque: '+((S.straws||[]).length)+'. Use no botão Inseminar das vacas.</div>'}
 h+='<h3>Preço da arroba por raça</h3><div class="card"><table>'+Object.keys(BREEDS).map(k=>'<tr><td>'+BREEDS[k].n+'</td><td class="right gold">'+R$(arroba(k))+'</td></tr>').join('')+'</table><div class="dim">Mercado '+(mktEff()>1.08?'aquecido':mktEff()<.92?'fraco':'estável')+'. Entressafra (seca) costuma pagar mais.</div></div>';
 return h;
}
function pAuc(){
 let h='';const A=S.aucOpen;
 if(!A)h+='<div class="card"><b>Nenhum leilão aberto.</b><div class="dim">Todo 7º dia abre um leilão semanal por 3 dias. A cada 28 dias há um leilão ELITE (Angus, Wagyu...) para quem tem reputação 15+.</div></div>';
 else{
  if(!A.lots)A.lots=makeLots(A.type);
  const left=A.until-S.day;
  h+='<div class="card"><h3>'+(A.type==='elite'?'👑 LEILÃO ELITE':'🔨 Leilão Semanal')+'</h3><div class="dim">Fecha em '+left+' dia(s). Comissão do leiloeiro: '+Math.round(comm()*100)+'%</div><div class="btns"><button class="b gold" data-act="enter">Entrar no pregão</button></div></div>';
  const mine=S.herd.filter(a=>a.cons);
  h+='<h3>Seus lotes ('+mine.length+')</h3>';
  if(!mine.length)h+='<div class="dim" style="margin-bottom:8px">Vá em Rebanho e use "Pôr no leilão". Animais de boa genética rendem mais aqui do que no frigorífico.</div>';
  mine.forEach(a=>{h+='<div class="card"><div class="row"><b>'+a.name+'</b><span>Reserva: <b class="gold">'+R$(valueOf(a,'mkt')*(a.resPct||.85))+'</b> ('+Math.round((a.resPct||.85)*100)+'%)</span></div><div class="btns"><button class="b gray" data-act="res" data-id="'+a.id+'" data-v="-.05">-5%</button><button class="b gray" data-act="res" data-id="'+a.id+'" data-v=".05">+5%</button><button class="b gray" data-act="cons" data-id="'+a.id+'">Retirar</button></div></div>'});
  h+='<h3>Lotes à venda</h3>'+A.lots.filter(l=>!l.own).map(l=>{const a=l.a,B=BREEDS[a.breed];return '<div class="card"><div class="row"><b>'+B.n+' '+(a.sex==='F'?'♀':'♂')+' <span class="gold">'+stars(a.gen)+'</span></b><span class="dim">lance inicial '+R$(l.start)+'</span></div><div class="dim">'+ageTxt(a)+' · '+Math.round(a.w)+' kg · gen '+a.gen+'</div></div>'}).join('');
 }
 h+='<h3>🏆 Exposição agropecuária</h3>';
 h+=S.expo?'<div class="card"><b class="gold">Aberta por mais '+(S.expo.until-S.day)+' dia(s)!</b><div class="dim">Inscreva um animal no Rebanho (R$ 300). Pódio dá prêmio, reputação e valoriza o animal.</div></div>':'<div class="card dim">Acontece a cada 90 dias. Prepare seus melhores animais: bem alimentados, saudáveis e de boa genética.</div>';
 return h;
}
function pUp(){
 return Object.keys(UPS).map(k=>{const u=UPS[k],l=S.up[k],c=upCost(k);
  return '<div class="card"><div class="row"><b>'+u.ic+' '+u.n+'</b><span class="gold">Nv '+l+'/'+u.c.length+'</span></div><div class="dim">'+u.d+'</div>'+(c===null?'<div class="grn">Nível máximo</div>':'<div class="btns"><button class="b '+(S.money>=c?'gold':'gray')+'" data-act="upg" data-v="'+k+'">Comprar '+R$(c)+'</button></div>')+'</div>'}).join('');
}
function pFin(){
 const lim=20000+Math.max(0,netWorth())*.5-S.debt;
 let h='<div class="card"><div class="row"><span>Caixa</span><b class="gold">'+R$(S.money)+'</b></div><div class="row"><span>Rebanho (frigorífico)</span><span>'+R$(S.herd.reduce((s,a)=>s+frigPrice(a),0))+'</span></div><div class="row"><span>Dívida no banco</span><b class="'+(S.debt?'red':'')+'">'+R$(S.debt)+'</b></div><div class="row"><span>Patrimônio líquido</span><b>'+R$(netWorth())+'</b></div></div>'
 +'<div class="card"><h3>🏦 Banco do Agro</h3><div class="dim">Juros 1,2% ao mês. Limite disponível: '+R$(Math.max(0,lim))+'</div><div class="btns">'+[10000,50000].map(v=>'<button class="b" data-act="loan" data-v="'+v+'">Pegar '+R$(v)+'</button>').join('')+[10000,99999999].map(v=>'<button class="b gray" data-act="pay" data-v="'+v+'">'+(v>1e6?'Quitar tudo':'Pagar '+R$(v))+'</button>').join('')+'</div></div>'
 +'<h3>Últimas movimentações</h3><div class="card"><table>'+(S.ledger.slice(0,25).map(e=>'<tr><td class="dim">d'+e.d+'</td><td>'+e.l+'</td><td class="right '+(e.n>0?'grn':'red')+'">'+R$(e.n)+'</td></tr>').join('')||'<tr><td class="dim">Sem movimentos</td></tr>')+'</table></div>'
 +'<div class="btns"><button class="b red" data-act="reset">Novo jogo</button></div>';
 return h;
}
function pGoals(){
 return GOALS.map(g=>'<div class="card '+(S.goals[g[0]]?'':'lock')+'"><div class="row"><b>'+(S.goals[g[0]]?'✅ ':'⬜ ')+g[1]+'</b><span class="gold">+'+R$(g[4])+'</span></div><div class="dim">'+(g[2]||'')+'</div></div>').join('');
}
