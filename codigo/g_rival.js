// ===== Fazendas rivais: personalidades, desafios com aposta, leilão, propostas, visitas na vila, notícias =====
const RVP=[
 {t:'Leiteira caprichosa',br:'girolando',lk:{shirt:'#c86a8a',hair:'#8a8a8a',g:'f',skin:'#d8a080',hat:'#e8d8b0'},hi:['Bom dia, vizinho! O leite lá em casa está rendendo que é uma beleza.','Quem acorda cedo ordenha mais, meu filho.'],up:['Ainda chego no seu calcanhar, você vai ver!'],dn:['Vocês, novatos, têm muito o que aprender com a Santa Rita.'],win:['Hehe, a sorte ajudou a velha aqui!'],lose:['Parabéns! Ganhou com justiça.']},
 {t:'Brincalhões e apostadores',br:'nelore',lk:{shirt:'#3a7ac8',hair:'#3a2a1a',hat:'#6a4a2a'},hi:['E aí, parceiro! Bora apostar alguma coisa?','Os Prado nunca recusam um desafio!'],up:['Tá correndo, hein? Mas a gente te alcança!'],dn:['Olha quem está atrás dos irmãos Prado! Hahaha!'],win:['HAHA! Paga a cerveja, perdedor!'],lose:['Aaah, não acredito! Revanche!']},
 {t:'Tradicional e desconfiado',br:'nelore',lk:{shirt:'#7a6a4a',hair:'#dddddd',hat:'#3a2a1a',skin:'#c88a60'},hi:['Hm. Gado se cria com paciência, não com pressa.','No meu tempo não tinha essas modernidades.'],up:['Hm... você até que leva jeito.'],dn:['Fazenda se faz em décadas, rapaz.'],win:['Experiência não se compra.'],lose:['Hm. Bem jogado.']},
 {t:'Especulador do leilão',br:'angus',lk:{shirt:'#2a2a3a',hair:'#1a1a1a',hat:'#d8d0c0',pants:'#2a2a3a'},hi:['Negócio é negócio. Tô de olho nos melhores lotes do leilão.','Comprar barato e vender caro, simples assim.'],up:['Seu patrimônio está subindo... interessante.'],dn:['No leilão eu sempre dou o lance mais alto.'],win:['Dinheiro na mão, como sempre.'],lose:['Tsc. Você teve sorte desta vez.']},
 {t:'Campeã de exposição',br:'hereford',lk:{shirt:'#8a2a5a',hair:'#5a2a1a',g:'f',hat:'#f0e8d0'},hi:['Minhas vacas têm mais faixas que muita fazenda grande.','Na pista do julgamento eu sou imbatível!'],up:['Seu rebanho está ficando bonito, admito.'],dn:['Traga um animal de verdade para a pista.'],win:['Mais uma faixa para a coleção!'],lose:['Bom animal o seu. Muito bom.']},
 {t:'Arrogante e peão de rodeio',br:'brahman',lk:{shirt:'#c8302a',hair:'#222',hat:'#f0f0f0',pants:'#2a3a5a',skin:'#c88a60'},hi:['Sou o Coronel Bento, campeão de rodeio desta região!','Quer aprender a montar? Pergunte ao Coronel.'],up:['Hmpf. Não se ache só porque cresceu um pouco.'],dn:['Você ainda está no jardim de infância do agro.'],win:['O Coronel nunca perde!'],lose:['Isso... não vai se repetir!']},
 {t:'Tecnologia e lavoura',br:'angus',lk:{shirt:'#f0f0f0',hair:'#111',hat:'#2a5a3a',skin:'#e8c8a0'},hi:['Nossos drones mapearam cada hectare.','Dados e genética: é o futuro.'],up:['Sua produtividade melhorou. Bom trabalho.'],dn:['Já pensou em investir em tecnologia?'],win:['Os números não mentem.'],lose:['Interessante. Vamos estudar o seu método.']},
 {t:'Grupo empresarial',br:'wagyu',lk:{shirt:'#3a4a6a',hair:'#8a8a8a',pants:'#1a1a2a',skin:'#e0b090'},hi:['O Grupo Pantaneiro compra tudo que tem valor.','Já pensou em vender sua fazenda? Faço boa proposta.'],up:['Você está ficando grande. Isso me preocupa.'],dn:['Fazendas pequenas não sobrevivem sozinhas.'],win:['Negócios são negócios.'],lose:['Hm. Vou rever minhas estratégias.']},
 {t:'O maior de todos',br:'wagyu',lk:{shirt:'#5a1a2a',hair:'#eeeeee',hat:'#1a1a1a',pants:'#1a1a1a',skin:'#e8c8a0'},hi:['A Fazenda Imperial é a maior da região há 40 anos.','Respeito se conquista, não se pede.'],up:['Então você é o novo nome que todos comentam...'],dn:['Volte quando for alguém.'],win:['É por isso que sou o Barão.'],lose:['...Admito. Você tem fibra.']}
];
const RVSTAKE=[2000,3000,5000,8000,12000,18000,25000,35000,50000];
const rvName=i=>RIV[i][1],rvFarm=i=>RIV[i][0];
function ensureRv(){if(!S.rv)S.rv={rel:RIV.map(()=>30),ch:null,news:[],vis:{i:-1,d:-1},nextV:S.day+2,nextC:S.day+8,sale:[],talk:{},won:0,lost:0};return S.rv}
function rvNeighbors(){ensureM();const L=rankList(),me=L.findIndex(x=>x.me),out=[];for(let d=-2;d<=2;d++){const x=L[me+d];if(x&&!x.me){const i=RIV.findIndex(r=>r[0]===x.n);if(i>=0)out.push(i)}}return out.length?out:[0]}
function nextRival(){ensureM();const L=rankList(),me=L.findIndex(x=>x.me),x=L[me-1]||L[me+1];return{i:RIV.findIndex(r=>r[0]===x.n),v:x.v,above:!!L[me-1]}}
function rvLine(i,k){return pick(RVP[i][k])}
function rvNews(t){const R=ensureRv();R.news.unshift({d:S.day,t});if(R.news.length>12)R.news.pop()}
// ---------- desafios
const CHT={
 peso:{ic:'⚖️',mk:(c,i)=>{c.until=S.day+ri(10,18);c.kg=Math.round(560+i*42+rnd(-30,60));c.txt='Quem tiver o animal mais pesado no dia '+(c.until%30+1)+'. O meu está com uns '+c.kg+' kg.'},
  chk:c=>S.day>=c.until?(Math.max(0,...S.herd.map(a=>a.w))>=c.kg?1:-1):0,prog:c=>'Seu mais pesado: '+Math.round(Math.max(0,...S.herd.map(a=>a.w)))+' kg'},
 cab:{ic:'🐄',mk:(c,i)=>{c.until=S.day+20;c.n=S.herd.length+ri(6,10);c.txt='Duvido você chegar a '+c.n+' cabeças até o dia '+(c.until%30+1)+'.'},
  chk:c=>S.herd.length>=c.n?1:S.day>=c.until?-1:0,prog:c=>'Você tem '+S.herd.length+'/'+c.n},
 pesca:{ic:'🎣',mk:(c,i)=>{c.until=S.day+12;c.kg=Math.round(rnd(4,9+i*.8)*10)/10;c.best=0;c.txt='Pegue um peixe com mais de '+c.kg+' kg em 12 dias. Eu já peguei um desse tamanho!'},
  chk:c=>c.best>=c.kg?1:S.day>=c.until?-1:0,prog:c=>'Seu maior peixe no desafio: '+(c.best||0)+' kg'},
 caca:{ic:'🦌',mk:(c,i)=>{const pool=['deer','boar','turkey','coyote','capy','pronghorn','goat'].filter(k=>SPECIES[k]&&legalSeason(k));c.sp=pick(pool.length?pool:['boar']);const s=SPECIES[c.sp];c.kg=Math.round((s.w[0]+(s.w[1]-s.w[0])*.55)*.72);c.until=S.day+15;c.ok=0;c.txt='Abata um(a) '+s.n+' com mais de '+c.kg+' kg de carcaça em 15 dias.'},
  chk:c=>c.ok?1:S.day>=c.until?-1:0,prog:c=>'Ainda não'},
 rodeio:{ic:'🤠',mk:(c,i)=>{c.sc=Math.round(rnd(58,82));let d=S.day+1;while((d%30)+1!==25)d++;c.until=d+1;c.res=0;c.txt='No próximo rodeio (dia 25) eu tiro nota '+c.sc+'. Quero ver você passar!'},
  chk:c=>c.res?c.res:S.day>c.until?-1:0,prog:c=>'Rodeio no dia 25'},
 julg:{ic:'🏆',mk:(c,i)=>{c.until=S.day+40;c.res=0;c.txt='No próximo julgamento de gado da Arena, um animal seu tem que ficar no pódio (até 3º).'},
  chk:c=>c.res?c.res:S.day>c.until?-1:0,prog:c=>'Julgamento na Arena (exposição ou Festa do Peão)'}
};
function newChallenge(i,type){
 const R=ensureRv();if(R.ch)return null;const pool=Object.keys(CHT).filter(k=>k!=='caca'||(S.h&&S.h.lic>S.day));type=type||pick(pool);
 const st=Math.max(1000,Math.min(RVSTAKE[i],Math.round(Math.max(0,S.money)*.25/500)*500));
 const c={i,type,stake:st,acc:0,exp:S.day+3};CHT[type].mk(c,i);R.ch=c;return c;
}
function resolveCh(r){const R=ensureRv(),c=R.ch;if(!c||!c.acc)return;const i=c.i;
 if(r>0){cash(c.stake,'Aposta com '+rvName(i));R.rel[i]=Math.min(100,R.rel[i]+12);R.won++;gainXP(40,'desafio');S.rep=Math.min(100,S.rep+1);
  showModal('<h3>🏆 Você venceu o desafio!</h3><div class="card"><b>'+rvName(i)+'</b> ('+rvFarm(i)+'): “'+rvLine(i,'lose')+'”<br>Você ganhou <b class="grn">'+R$(c.stake)+'</b> e mais respeito na região.</div><div class="btns"><button class="b gold" data-act="close">Boa!</button></div>');rvNews(rvName(i)+' perdeu uma aposta para '+(S.farmName||'você')+'.')}
 else{cash(-c.stake,'Aposta com '+rvName(i));R.rel[i]=Math.max(0,R.rel[i]-4);R.lost++;
  toast('😤 Você perdeu o desafio de '+rvName(i)+': -'+R$(c.stake)+'. “'+rvLine(i,'win')+'”','bad')}
 R.ch=null;R.nextC=S.day+ri(6,12);
}
function checkCh(){const R=ensureRv(),c=R.ch;if(!c)return;if(!c.acc){if(S.day>c.exp){R.rel[c.i]=Math.max(0,R.rel[c.i]-2);toast('🤷 '+rvName(c.i)+' achou que você ficou com medo do desafio.');R.ch=null;R.nextC=S.day+ri(5,9)}return}
 const r=CHT[c.type].chk(c);if(r)resolveCh(r)}
// ganchos dos desafios
const _onFishRv=onFish;onFish=function(k,kg){_onFishRv(k,kg);const c=S.rv&&S.rv.ch;if(c&&c.acc&&c.type==='pesca'&&!FISH[k].junk&&kg>(c.best||0)){c.best=kg;checkCh()}};
const _fpRv=finishPick;finishPick=function(){const a=AIM.pick&&AIM.pick.a;_fpRv();const c=S.rv&&S.rv.ch;if(a&&c&&c.acc&&c.type==='caca'&&a.sp===c.sp&&a.kg*.72>=c.kg){c.ok=1;checkCh()}};
function rvRodeo(score){const c=S.rv&&S.rv.ch;if(c&&c.acc&&c.type==='rodeio'){c.res=score>c.sc?1:-1;checkCh()}}
function rvJudge(bestPos){const c=S.rv&&S.rv.ch;if(c&&c.acc&&c.type==='julg'){c.res=bestPos<=3?1:-1;checkCh()}}
Object.assign(ACT,{
 rvacc(){const c=S.rv.ch;if(!c||c.acc)return;c.acc=1;S.rv.rel[c.i]=Math.min(100,S.rv.rel[c.i]+3);toast('🤝 Desafio aceito! Aposta de '+R$(c.stake)+'.','good')},
 rvdec(){const c=S.rv.ch;if(!c||c.acc)return;S.rv.rel[c.i]=Math.max(0,S.rv.rel[c.i]-2);S.rv.ch=null;S.rv.nextC=S.day+ri(5,9);toast('Você recusou o desafio.')},
 rvprop(e){const i=+e.v;if(S.rv.ch)return toast('Já existe um desafio em andamento','bad');const c=newChallenge(i);if(c){c.acc=1;toast('🤝 '+rvName(i)+' topou! '+c.txt,'good')}rivalModal(i)},
 rvtalk(e){const i=+e.v,R=ensureRv();if(R.talk[i]===S.day)return;R.talk[i]=S.day;R.rel[i]=Math.min(100,R.rel[i]+2);rivalModal(i,1)},
 rvbuy(e){const R=ensureRv(),k=+e.v,s=R.sale[k];if(!s)return;if(S.money<s.price)return toast('Dinheiro insuficiente','bad');if(S.herd.length>=Math.floor(cap()*1.5))return toast('Sem espaço no pasto!','bad');
  cash(-s.price,'Compra de '+rvName(R.vis.i));const a=s.a;a.id=S.nid++;addA(a);R.sale.splice(k,1);R.rel[R.vis.i]=Math.min(100,R.rel[R.vis.i]+4);S.stats.bought=(S.stats.bought||0)+1;toast('🐂 '+a.name+' agora é seu!','good');rivalModal(R.vis.i)}
});
// ---------- leilão: rivais disputam lotes
const _mkLotRv=mkLot;
mkLot=function(a,own,el){const L=_mkLotRv(a,own,el);try{if(L&&L.bidders&&Math.random()<(el?.75:.4)){const nb=rvNeighbors(),i=pick(nb),b=L.bidders[0];b.n='🤠 '+rvName(i)+' ('+rvFarm(i)+')';b.max*=rnd(1.04,1.22);b.rv=i}}catch(e){}return L};
// ---------- visitas na vila
const RVN={x:126*TS,y:58*TS,tx:126*TS,ty:58*TS,wait:0,dir:0,ph:0,mv:0};
const rvVisiting=()=>S.rv&&S.rv.vis.d===S.day&&S.rv.vis.i>=0&&(()=>{const h=S.t*24;return h>=8&&h<18})();
function rvHome(){const f=typeof festaArea==='function'?festaArea():null;return f||{x:126*TS,y:58*TS+4,r:50}}
function stepRvN(dt){if(!rvVisiting())return;const H=rvHome();
 if(RVN.wait>0){RVN.wait-=dt;RVN.mv=0;return}
 const dx=RVN.tx-RVN.x,dy=RVN.ty-RVN.y,d=Math.hypot(dx,dy);
 if(d<2||d>400){if(d>400){RVN.x=H.x;RVN.y=H.y}RVN.wait=rnd(2,6);RVN.tx=H.x+rnd(-H.r,H.r);RVN.ty=H.y+rnd(-14,14);RVN.mv=0;return}
 RVN.x+=dx/d*15*dt;RVN.y+=dy/d*15*dt;RVN.mv=1;RVN.ph+=dt*2.2;RVN.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1);
}
function drawRvN(g){const i=S.rv.vis.i,l=RVP[i].lk;drawPerson(g,{x:RVN.x,y:RVN.y,dir:RVN.dir,ph:RVN.ph,mv:RVN.mv,shirt:l.shirt,hair:l.hair,hat:l.hat,pants:l.pants,g:l.g,skin:l.skin});
 if(RMODE===4)return;if(Math.hypot(RVN.x-P.x,RVN.y-P.y)<90){const t=rvName(i),tw=ptw(t);Rr(g,'rgba(40,10,10,.65)',RVN.x-tw/2-2,RVN.y-37,tw+4,8);ptext(g,t,RVN.x-tw/2,RVN.y-35.5,'#ffb080')}
 if(S.rv.ch&&!S.rv.ch.acc&&S.rv.ch.i===i){const b=(frame>>4)&1;Rr(g,'#1e140c',RVN.x-1.5,RVN.y-46-b,3,8);Rr(g,'#ff8a5a',RVN.x-1,RVN.y-45.5-b,2,5);Rr(g,'#ff8a5a',RVN.x-1,RVN.y-39.5-b,2,1.5)}
}
function rivalModal(i,talked){
 const R=ensureRv();reModal=null;const L=rankList(),me=L.findIndex(x=>x.me),ri2=L.findIndex(x=>x.n===rvFarm(i)),ahead=ri2<me,p=RVP[i];
 const line=talked?pick(p.hi):ahead?pick(p.dn):pick(p.up);
 let h='<h3>🤠 '+rvName(i)+'</h3><div class="dim">'+rvFarm(i)+' · '+p.t+' · '+(ri2+1)+'º no ranking</div><div class="card"><i>“'+line+'”</i></div>'
  +'<div class="card"><div class="row"><b>Respeito</b><span class="dim">'+Math.round(R.rel[i])+'/100</span></div>'+bar(R.rel[i],'#e0a431')+'<div class="dim">Patrimônio dele(a): '+R$(S.rk.v[i])+' · o seu: '+R$(myNW())+'</div></div>';
 const c=R.ch;
 if(c&&c.i===i&&!c.acc)h+='<div class="card" style="border-color:#e05a3a"><b>'+CHT[c.type].ic+' Desafio: aposta de '+R$(c.stake)+'</b><div>'+c.txt+'</div><div class="btns"><button class="b gold" data-act="rvacc">Aceito!</button><button class="b gray" data-act="rvdec">Recusar</button></div></div>';
 else if(c&&c.i===i)h+='<div class="card"><b>'+CHT[c.type].ic+' Desafio em andamento ('+R$(c.stake)+')</b><div class="dim">'+c.txt+'<br>'+CHT[c.type].prog(c)+'</div></div>';
 else if(!c)h+='<div class="btns"><button class="b" data-act="rvprop" data-v="'+i+'">🎲 Propor um desafio</button></div>';
 if(R.vis.i===i&&R.vis.d===S.day&&R.sale.length){h+='<div class="sec">🐂 ANIMAIS QUE '+rvName(i).toUpperCase()+' VENDE HOJE</div>'+R.sale.map((s,k)=>{const a=s.a;return '<div class="card"><div class="row"><b>'+a.name+' · '+BREEDS[a.breed].n+' '+(a.sex==='M'?'♂':'♀')+'</b><span class="gold">'+R$(s.price)+'</span></div><div class="dim">'+Math.round(a.w)+' kg · genética <b class="gold">'+a.gen+'</b> · '+Math.floor(a.age/30)+' meses</div><div class="btns"><button class="b gold" data-act="rvbuy" data-v="'+k+'">Comprar</button></div></div>'}).join('')}
 h+='<div class="btns">'+(R.talk[i]!==S.day?'<button class="b" data-act="rvtalk" data-v="'+i+'">💬 Conversar</button>':'')+'<button class="b gray" data-act="close">Tchau</button></div>';
 showModal(h);
}
const _evoRv=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoRv(L,x0,x1,y0,y1);if(rvVisiting()&&RVN.x>x0&&RVN.x<x1&&RVN.y>y0&&RVN.y<y1+30)L.push([RVN.y,10,{draw:drawRvN}])};
const _ilRv=interactList;interactList=function(){const L=_ilRv();if(rvVisiting())L.push({x:RVN.x,y:RVN.y,r:24,label:'🤠 Falar com '+rvName(S.rv.vis.i)+' (rival)',fn:()=>rivalModal(S.rv.vis.i)});return L};
const _updRv=update;update=function(dt){_updRv(dt);if(S&&S.rv)stepRvN(dt)};
// ---------- dia a dia
const RVNEWS=[
 i=>{const v=ri(4,12)*10000;S.rk.v[i]+=v;return rvName(i)+' comprou um touro reprodutor de '+R$(v)+'.'},
 i=>{const v=Math.round(S.rk.v[i]*.03);S.rk.v[i]-=v;return 'Ladrões levaram gado da '+rvFarm(i)+'. Prejuízo de '+R$(v)+'.'},
 i=>rvFarm(i)+' bateu recorde de produção este mês.',
 i=>{S.rk.v[i]=Math.round(S.rk.v[i]*1.02);return rvFarm(i)+' arrematou os melhores lotes do leilão.'},
 i=>rvName(i)+' anda dizendo na vila que '+(S.farmName||'a sua fazenda')+' não chega a lugar nenhum.',
 i=>rvFarm(i)+' contratou mais 3 peões e aumentou o pasto.',
 i=>{S.rk.v[i]=Math.round(S.rk.v[i]*.985);return 'A seca castigou a '+rvFarm(i)+'. Perderam animais.'}
];
const _hdRv=hookDay;
hookDay=function(){_hdRv();const R=ensureRv();checkCh();
 if(!R.ch&&S.day>=R.nextC&&S.day>15){const nb=rvNeighbors(),i=pick(nb),c=newChallenge(i);if(c){toast('📨 '+rvName(i)+' te desafiou: '+CHT[c.type].ic+' aposta de '+R$(c.stake)+'. Responda em 🏆 Região (3 dias).','good');if(!R.vis||R.vis.d!==S.day){R.vis={i,d:S.day};mkSale(i)}}}
 if(S.day>=R.nextV){const nb=rvNeighbors(),i=pick(nb);R.vis={i,d:S.day};R.nextV=S.day+ri(3,6);mkSale(i);RVN.x=RVN.tx=126*TS;RVN.y=RVN.ty=58*TS;toast('🤠 '+rvName(i)+' ('+rvFarm(i)+') está passeando pela vila hoje.')}
 if(Math.random()<.14){const i=pick(rvNeighbors());rvNews(pick(RVNEWS)(i))}
 if(S.herd.length&&Math.random()<.04&&S.offers.length<3){const c=S.herd.filter(a=>a.age>300&&(a.gen>=60||a.title)&&!S.offers.some(o=>o.id===a.id));if(c.length){const a=pick(c),i=pick(rvNeighbors());S.offers.push({id:a.id,price:Math.round(valueOf(a,'mkt')*rnd(1.35,1.7)/10)*10,buyer:'🤠 '+rvName(i),exp:S.day+5});toast('📞 '+rvName(i)+' quer comprar '+a.name+'! Proposta no menu Rebanho.')}}
 const R2=R;if(R2.rel.some((r,i)=>r>=70&&Math.random()<.01)){const i=R2.rel.findIndex(r=>r>=70);const it=pick(['milho','cafe','tomate','dourado']);if(ITEMS[it]&&addItem(it,3))toast('🎁 '+rvName(i)+' te mandou um presente: 3× '+ITEMS[it].n+'. Rivais que se respeitam!','good')}
};
function mkSale(i){const R=ensureRv(),p=RVP[i];R.sale=[0,1].map(k=>{const a=mk(k===0?p.br:pick(['nelore','brahman','hereford','angus',p.br]),k===0?'M':'F',ri(500,900),ri(68,90)+Math.min(8,i));a.breeder=a.sex==='M'?1:0;a.w=Math.round(a.w);return{a,price:Math.round(valueOf(a,'mkt')*rnd(1.25,1.45)/50)*50}})}
// ---------- painel na Região
function rivalPanel(){const R=ensureRv(),nr=nextRival();let h='<div class="sec">🤠 RIVAIS</div>';
 if(nr.i>=0)h+='<div class="card" style="border-color:#e05a3a"><div class="row"><b>'+(nr.above?'Próximo alvo: ':'Na sua cola: ')+rvFarm(nr.i)+'</b><span class="dim">'+rvName(nr.i)+'</span></div><div class="dim">'+(nr.above?'Faltam <b class="gold">'+R$(Math.max(0,nr.v-myNW()))+'</b> de patrimônio para passar.':'Está só '+R$(Math.max(0,myNW()-nr.v))+' atrás de você.')+'</div></div>';
 const c=R.ch;if(c){h+='<div class="card"><div class="row"><b>'+CHT[c.type].ic+' Desafio de '+rvName(c.i)+'</b><span class="gold">'+R$(c.stake)+'</span></div><div>'+c.txt+'</div><div class="dim">'+(c.acc?CHT[c.type].prog(c)+' · termina dia '+(c.until%30+1)+'/'+MONTHS[Math.floor((c.until%360)/30)]:'Responda até o dia '+(c.exp%30+1))+'</div>'+(c.acc?'':'<div class="btns"><button class="b gold" data-act="rvacc">Aceito!</button><button class="b gray" data-act="rvdec">Recusar</button></div>')+'</div>'}
 h+='<div class="dim">Desafios: '+R.won+' vitórias · '+R.lost+' derrotas.'+(rvVisiting()?' Hoje <b>'+rvName(R.vis.i)+'</b> está na vila.':'')+'</div>';
 if(R.news.length)h+='<div class="sec">📰 NOTÍCIAS DA REGIÃO</div>'+R.news.slice(0,6).map(n=>'<div class="card" style="padding:5px 8px"><span class="dim">'+(n.d%30+1)+'/'+MONTHS[Math.floor((n.d%360)/30)]+'</span> '+n.t+'</div>').join('');
 h+='<div class="sec">RESPEITO DOS RIVAIS</div>'+RIV.map((r,i)=>'<div class="card" style="padding:4px 8px"><div class="row"><b>'+r[1]+'</b><span class="dim">'+RVP[i].t+'</span></div>'+bar(R.rel[i],'#e0a431')+'</div>').join('');
 return h}
const _pRegRv=pReg;
pReg=function(){const h=_pRegRv(),k=h.indexOf('<div class="sec">AGENDA');return k>0?h.slice(0,k)+rivalPanel()+h.slice(k):h+rivalPanel()};
ACH.push(['rv5','Bom de aposta','Vença 5 desafios de rivais',()=>S.rv&&S.rv.won>=5,15000],['rvres','Respeitado','Chegue a 90 de respeito com um rival',()=>S.rv&&S.rv.rel.some(r=>r>=90),10000]);
GUIDE.push({lv:1,ic:'🤠',t:'Fazendas rivais',h:'As outras fazendas da região disputam o ranking com você. Elas lançam desafios com aposta (peso do boi, pesca, caça, rodeio, julgamento), disputam lotes no leilão, fazem propostas pelos seus melhores animais e às vezes passeiam pela vila — converse, aposte ou compre animais de elite delas. Tudo fica em 🏆 Região.'});
const _pHerdRv=pHerd;pHerd=function(){if(S.offers&&S.offers.length)S.offers=S.offers.filter(o=>S.herd.some(a=>a.id===o.id));return _pHerdRv()};
