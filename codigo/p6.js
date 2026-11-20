function showModal(h){$('mbox').innerHTML=h;$('modal').style.display='flex';modalOpen=true}
function hideModal(){$('modal').style.display='none';modalOpen=false;if(AUC&&AUC.timer){clearInterval(AUC.timer)}AUC=null;renderAll()}
function helpModal(){
 showModal('<h3>🐂 Fazenda Boi de Ouro</h3><div style="line-height:1.25">'
 +'<p>• <b>Cuide do pasto:</b> cada pasto comporta um número de cabeças. Na seca o capim acaba: use <b>ração</b>.</p>'
 +'<p>• <b>Crie:</b> vacas e um touro (marque "Reprodutor") geram bezerros. Machos engordam e vão ao frigorífico; boas fêmeas ficam no plantel.</p>'
 +'<p>• <b>Genética importa:</b> animais de ★ alta valem muito mais, principalmente em leilão e exposições.</p>'
 +'<p>• <b>Leilões:</b> abrem todo 7º dia. Compre barato disputando lances ou ponha seus melhores animais à venda com preço de reserva.</p>'
 +'<p>• <b>Vacine</b> nas campanhas de maio e novembro e trate os doentes. Doença e fome matam.</p>'
 +'<p>• Invista em <b>melhorias</b>, ganhe reputação e abra as raças nobres: Hereford, Angus e Wagyu.</p>'
 +'<p>• Toque numa vaquinha no cenário para selecioná-la. O jogo salva sozinho.</p></div><div class="btns"><button class="b gold" data-act="close">Bora trabalhar!</button></div>');
}
let AUC=null;
function openAuction(){
 const A=S.aucOpen;if(!A)return;if(!A.lots)A.lots=makeLots(A.type);
 for(const a of S.herd)if(a.cons&&!A.lots.some(l=>l.own&&l.a.id===a.id))A.lots.push(mkLot(a,1,A.type==='elite'));
 A.lots=A.lots.filter(l=>!l.own||S.herd.some(a=>a.id===l.a.id&&a.cons));
 AUC={q:shuffle(A.lots),cur:null,msg:'',timer:null,total:A.lots.length,n:0};
 nextLot();AUC.timer=setInterval(aucTick,850);
}
function nextLot(){
 if(!AUC.q.length){hideModal();toast('Fim do pregão');save();return}
 AUC.cur=AUC.q.shift();AUC.n++;AUC.msg='O leiloeiro abre o lote...';
 const L=AUC.cur,a=L.a,B=BREEDS[a.breed];
 showModal('<div class="row"><span class="big">'+(S.aucOpen.type==='elite'?'👑 ELITE':'🔨 LEILÃO')+'</span><span class="dim">Lote '+AUC.n+'/'+AUC.total+'</span></div>'
 +'<canvas id="lc" width="120" height="64"></canvas><div><b>'+B.n+' '+(a.sex==='F'?'♀':'♂')+'</b> <span class="gold">'+stars(a.gen)+'</span> '+(L.own?'<span class="tag y">SEU LOTE · reserva '+R$(L.reserve)+'</span>':'')+'</div>'
 +'<div class="dim">'+ageTxt(a)+' · '+Math.round(a.w)+' kg · gen '+a.gen+' · saúde '+Math.round(a.hp)+'%</div>'
 +'<div class="card" style="text-align:center;margin-top:8px"><div class="dim">Lance atual</div><div class="big" id="lp"></div><div id="ll" class="dim"></div></div><div id="lm" style="min-height:22px"></div>'
 +'<div class="btns"><button class="b gold" id="lb" data-act="bid"></button><button class="b gray" data-act="leave">Sair do pregão</button></div>');
 const g=$('lc').getContext('2d');Rr(g,'#79c26a',0,0,120,64);for(let i=0;i<40;i++)Rr(g,'#5f9f52',(i*37)%120,(i*17)%64,2,1);Rr(g,'#8a6a42',0,50,120,3);
 const s=2;g.save();g.scale(2,2);drawCow(g,a,21,17,1,0);g.restore();
 aucUpdate();
}
function aucUpdate(){
 const L=AUC&&AUC.cur;if(!L||!$('lp'))return;
 $('lp').textContent=L.price<L.start?'Aguardando abertura: '+R$(L.start):R$(L.price);
 $('ll').textContent=L.leader===null?'Sem lances':L.leader==='p'?'Líder: VOCÊ':'Líder: '+L.bidders[L.leader].n;
 $('lm').textContent=AUC.msg;const b=$('lb');
 if(L.own||L.fin){b.style.display='none'}else{b.style.display='';const nx=L.price+L.inc;b.textContent='Dar lance '+R$(nx);b.disabled=L.leader==='p'||S.money<nx}
}
function aucTick(){
 const L=AUC&&AUC.cur;if(!L||L.fin)return;
 const nx=L.price+L.inc,c=[];
 L.bidders.forEach((b,i)=>{if(L.leader!==i&&b.max>=nx)c.push(i)});
 let bid=null;for(const i of shuffle(c))if(Math.random()<(L.price<L.start?.7:.4)){bid=i;break}
 if(bid!==null){L.price=nx;L.leader=bid;L.idle=0;AUC.msg='🙋 '+L.bidders[bid].n+': '+R$(nx)}
 else{
  L.idle++;
  if(L.leader!==null&&L.idle>=(L.leader==='p'?2:3)){hammer(L)}
  else if(L.leader===null&&L.idle>=5){L.fin=1;AUC.msg='Sem interessados. Lote retirado.';dropLot(L);setTimeout(()=>AUC&&nextLot(),1500)}
  else if(L.idle===2)AUC.msg='Dou-lhe uma...';else if(L.idle===3)AUC.msg='Dou-lhe duas...';
 }
 aucUpdate();
}
function dropLot(L){S.aucOpen.lots=S.aucOpen.lots.filter(x=>x!==L)}
function hammer(L){
 L.fin=1;const a=L.a;
 if(L.leader==='p'){
  const pr=L.price;
  if(buyAnimal(a,pr,'Leilão')){S.stats.aucWins++;gainXP(25);S.rep=Math.min(100,S.rep+.4);AUC.msg='🔨 ARREMATADO por você: '+R$(pr)+'!';dropLot(L)}
  else AUC.msg='Compra não concluída.';
 }else if(L.own){
  if(L.price>=L.reserve){
   const net=Math.round(L.price*(1-comm()));cash(net,'Leilão: '+a.name);S.stats.sold++;
   const ag=S.herd.find(x=>x.id===a.id);S.herd=S.herd.filter(x=>x.id!==a.id);SP.delete(a.id);
   S.rep=Math.min(100,S.rep+(L.price>=valueOf(a,'mkt')?.8:.3));
   AUC.msg='🔨 VENDIDO para '+L.bidders[L.leader].n+' por '+R$(L.price)+' (líquido '+R$(net)+')';
  }else{AUC.msg='Não atingiu a reserva ('+R$(L.reserve)+'). Retirado.';const ag=S.herd.find(x=>x.id===a.id);if(ag)ag.cons=0}
  dropLot(L);
 }else{AUC.msg='Vendido para '+L.bidders[L.leader].n+' por '+R$(L.price);dropLot(L)}
 renderHUD();aucUpdate();setTimeout(()=>AUC&&nextLot(),1900);
}
function enterExpo(a){
 if(S.money<300)return toast('Dinheiro insuficiente','bad');
 cash(-300,'Inscrição na exposição');a.expo=S.expo.until;
 const sc=a.gen*.5+30*Math.min(1,a.w/wmax(a))+a.hp*.2-(a.sick?15:0)+rnd(-8,8);
 const riv=[1,2,3,4,5].map(()=>rnd(38,80));const pos=riv.filter(r=>r>sc).length+1;
 const prize=[6000,3000,1500][pos-1]||0,r=[8,4,2][pos-1]||0.3;
 S.rep=Math.min(100,S.rep+r);if(prize)cash(prize,'Prêmio da exposição');
 if(pos===1){a.title=1;S.stats.expoWins++}
 showModal('<h3>🏆 Exposição</h3><p>'+a.name+' ficou em <b class="gold">'+pos+'º lugar</b> de 6 (nota '+sc.toFixed(0)+').</p><p>'+(prize?'Prêmio: <b class="grn">'+R$(prize)+'</b> e +'+r+' de reputação.':'Sem prêmio, mas a vitrine rende um pouco de fama.')+(pos===1?'<br>🏆 Título de Campeão: o animal vale mais em leilões!':'')+'</p><div class="btns"><button class="b gold" data-act="close">Ok</button></div>');
}
function aiModal(id){
 const a=find(id);if(!a)return;
 showModal('<h3>🧬 Inseminar '+a.name+'</h3><div class="dim">Sucesso '+(S.up.ia>=2?80:65)+'%. Escolha a palha:</div>'+S.straws.map((s,i)=>'<div class="card"><div class="row"><b>'+BREEDS[s.br].n+' <span class="gold">gen '+s.g+'</span></b><button class="b blue" data-act="doai" data-id="'+id+'" data-v="'+i+'">Usar</button></div></div>').join('')+'<div class="btns"><button class="b gray" data-act="close">Cancelar</button></div>');
}
const ACT={
 tab(e){tab=e.v;lim=15},spd(e){speed=+e.v},help(){helpModal()},close(){hideModal()},flt(e){flt=e.v;lim=15},more(){lim+=15},
 sell(e){const a=find(e.id);if(!a)return;if(a.gen>=80&&!confirm2(a))return;const p=sellFrig(a);toast('💰 '+a.name+' vendido por '+R$(p),'good')},
 cons(e){const a=find(e.id);if(a)a.cons=a.cons?0:1},
 res(e){const a=find(e.id);if(a)a.resPct=clamp((a.resPct||.85)+ +e.v,.5,1.3)},
 treat(e){const a=find(e.id);if(a&&!treat(a))toast('Sem dinheiro','bad')},
 vacc(e){const a=find(e.id);if(a&&!vaccinate(a))toast('Sem dinheiro','bad')},
 vaccall(){let n=0;S.herd.forEach(a=>{if(vaccinate(a))n++});toast(n+' animais vacinados')},
 breeder(e){const a=find(e.id);if(a)a.breeder=a.breeder?0:1},
 feed(e){const n=buyFeed(+e.v);toast(n?'+'+n+' kg de ração':'Sem espaço no silo ou dinheiro',n?'':'bad')},
 suppl(){S.suppl=!S.suppl},
 sellready(){const l=S.herd.filter(a=>a.sex==='M'&&ready(a));let t=0;l.forEach(a=>t+=sellFrig(a));toast(l.length?'💰 '+l.length+' vendidos: '+R$(t):'Nenhum animal pronto',l.length?'good':'bad')},
 offer(e){const o=S.offers.find(x=>x.id==e.id),a=find(e.id);if(!o||!a)return;cash(o.price,'Venda: '+a.name);S.stats.sold++;S.rep=Math.min(100,S.rep+.3);S.herd=S.herd.filter(x=>x!==a);SP.delete(a.id);S.offers=S.offers.filter(x=>x!==o);toast('💰 Vendido por '+R$(o.price),'good')},
 buy(e){const x=S.listings[+e.v];if(!x)return;if(buyAnimal(x.a,x.price,'Compra')){S.listings.splice(+e.v,1);toast('🐄 Comprou '+x.a.name,'good')}},
 straw(e){const s=S.sem[+e.v];if(!s)return;if(S.money<s.p)return toast('Dinheiro insuficiente','bad');cash(-s.p,'Sêmen '+BREEDS[s.br].n);S.straws.push({br:s.br,g:s.g});S.sem.splice(+e.v,1);toast('Palha adquirida','good')},
 ai(e){aiModal(e.id)},
 doai(e){const a=find(e.id),s=S.straws[+e.v];if(!a||!s)return;S.straws.splice(+e.v,1);
  if(Math.random()<(S.up.ia>=2?.8:.65)){a.preg=1;a.sire={br:s.br,g:s.g};toast('✅ '+a.name+' emprenhou!','good')}else toast('Não pegou desta vez...','bad');hideModal()},
 expo(e){const a=find(e.id);if(a)enterExpo(a)},
 enter(){openAuction()},bid(){
  const L=AUC&&AUC.cur;if(!L||L.fin||L.own||L.leader==='p')return;const nx=L.price+L.inc;
  if(S.money<nx)return toast('Dinheiro insuficiente','bad');
  if(S.herd.length>=Math.floor(cap()*1.5))return toast('Sem espaço no pasto!','bad');
  L.price=nx;L.leader='p';L.idle=0;AUC.msg='✋ Você deu lance: '+R$(nx);aucUpdate()},
 leave(){hideModal()},
 upg(e){const c=upCost(e.v);if(c===null)return;if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Melhoria: '+UPS[e.v].n);S.up[e.v]++;if(e.v==='ia')newStraws();toast('✅ '+UPS[e.v].n+' nível '+S.up[e.v],'good')},
 loan(e){const lim=20000+Math.max(0,netWorth())*.5-S.debt;if(+e.v>lim)return toast('Limite insuficiente','bad');S.debt+=+e.v;cash(+e.v,'Empréstimo')},
 pay(e){const v=Math.min(+e.v,S.debt,Math.max(0,Math.floor(S.money)));if(v<=0)return;S.debt-=v;cash(-v,'Pagamento do empréstimo')},
 reset(){showModal('<h3>Novo jogo?</h3><p>Todo o progresso será perdido.</p><div class="btns"><button class="b red" data-act="reset2">Sim, recomeçar</button><button class="b gray" data-act="close">Cancelar</button></div>')},
 reset2(){newGame();S.aucOpen={type:'comum',until:273,lots:null};newStraws();SEL=0;SP.clear();hideModal();helpModal()}
};
function confirm2(a){return true}
document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-act]');if(!el)return;
 const f=ACT[el.dataset.act];if(!f)return;
 f({id:el.dataset.id,v:el.dataset.v});
 if(S.over)return;
 if(el.dataset.act==='enter'||el.dataset.act==='bid'||el.dataset.act==='leave'||el.dataset.act==='help')return;
 renderAll();
});
let last=performance.now();
function loop(now){
 const dt=Math.min(100,now-last);last=now;frame++;
 if(!modalOpen&&speed>0&&!S.over){
  S.t+=dt*speed/DAYMS;let n=0;
  while(S.t>=1&&n++<10){S.t-=1;dayTick();dayFlag=1}
  if(dayFlag){dayFlag=0;renderAll();if(S.over)gameOver()}
 }
 vt=speed>4?.5:S.t;stepSprites();drawScene(X);requestAnimationFrame(loop);
}
function gameOver(){showModal('<h3>💀 Falência</h3><p>Você ficou sem caixa e com dívidas demais. O banco tomou a fazenda.</p><div class="btns"><button class="b red" data-act="reset2">Recomeçar</button></div>')}
if(!load()){newGame();S.aucOpen={type:'comum',until:273,lots:null};newStraws()}
renderAll();
if(S.intro){S.intro=0;helpModal()}
requestAnimationFrame(loop);
</script></body></html>
