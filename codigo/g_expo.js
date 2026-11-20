// ===== 🏆 EXPOSIÇÃO AO VIVO: você entra na pista da Arena puxando seu animal no cabresto, o jurado avalia um por um,
// ===== ordena a fila, dá as faixas e anuncia o Grande Campeão. Campeões valem mais e trazem convite para a gala.
let EXPO=null;
const EXRB=['nelore','nelorepo','angus','brahman','hereford','senepol','brangus','gir','girolando'].filter(k=>BREEDS[k]);
const exRing=()=>({x0:(ARN.rx0+1)*TS,x1:ARN.rx1*TS,y0:(ARN.ry0+1)*TS+4,y1:ARN.ry1*TS-2,cx:((ARN.rx0+ARN.rx1)/2+.5)*TS,cy:((ARN.ry0+ARN.ry1)/2+.5)*TS});
function expoEntrants(c,a,pe){const R0=exRing(),riv=shuffle(RIV.map((r,i)=>i)).slice(0,4);const L=riv.map((i,k)=>{const s=42+i*3.2+rnd(-9,9)+(pe?3:0),ra=mk(pick(EXRB),c.k==='vaca'?'F':c.k==='touro'?'M':(Math.random()<.5?'F':'M'),c.k==='jovem'?ri(320,650):ri(750,1300),clamp(Math.round(s*1.15),40,99));ra.w=Math.round(wmax(ra)*rnd(.85,.97));
  return{a:ra,n:RIV[i][1],f:RIV[i][0],s,me:0,hl:{shirt:['#f4f4f0','#e8d8b0','#c8dce8','#f0e0e0'][k%4],hat:['#f4f0e4','#5a3a22','#1a1a1a','#d8c8a0'][k%4]}}});
 L.push({a,n:'Você',f:S.farmName||'Fazenda Boi de Ouro',s:jScore(a)+rnd(-5,5),me:1});const order=shuffle(L);order.forEach((e,i)=>{e.x=R0.x0+8;e.y=R0.y0;e.slot=i});return order}
function expoStart(){const J=ensureJ();if(!J)return;const pe=J.ev[0]==='p',fee=pe?800:300,cats=JCAT.filter(c=>J.ent[c.k]&&find(J.ent[c.k]));if(!cats.length)return;
 if(S.money<fee*cats.length)return toast('Dinheiro insuficiente','bad');cash(-fee*cats.length,'Inscrição no julgamento');hideModal();
 EXPO={pe,cats,ci:-1,ph:'',t:0,html:'',best:9,firsts:0,J,msg:'',bonus:0,meter:0,tried:0};expoNextCat();expoUI(1)}
function expoNextCat(){EXPO.ci++;if(EXPO.ci>=EXPO.cats.length)return expoFinish();const c=EXPO.cats[EXPO.ci],a=find(EXPO.J.ent[c.k]);
 EXPO.cat=c;EXPO.ents=expoEntrants(c,a,EXPO.pe);EXPO.ph='enter';EXPO.t=0;EXPO.bonus=0;EXPO.tried=0;EXPO.insp=-1;EXPO.judge={x:exRing().cx,y:exRing().y0-10,dir:0};EXPO.msg='🎤 Atenção, Arena! Entram na pista os animais da categoria '+c.n.replace(/^\S+ /,'')+'!';
 const R0=exRing();EXPO.ents.forEach((e,i)=>{e.x=(ARN.gx0+.5)*TS;e.y=ARN.ry0*TS+6;e.delay=i*.6})}
function expoSlot(i,n){const R0=exRing();return{x:R0.x0+16+i*((R0.x1-R0.x0-32)/(Math.max(1,n-1))),y:R0.cy+4}}
function moveTo(o,tx,ty,sp,dt){const dx=tx-o.x,dy=ty-o.y,d=Math.hypot(dx,dy);if(d<.6){o.mv=0;return true}const s=Math.min(d,sp*dt);o.x+=dx/d*s;o.y+=dy/d*s;o.mv=1;if(Math.abs(dx)>.3)o.dir=dx>0?1:-1;return false}
function expoTick(dt){const E=EXPO;if(!E)return;E.t+=dt;const R0=exRing(),n=E.ents.length;
 if(E.ph==='enter'){let ok=true;E.ents.forEach((e,i)=>{if(E.t<e.delay){ok=false;return}const s=expoSlot(i,n);if(!moveTo(e,s.x,s.y,26,dt))ok=false});if(ok&&E.t>2){E.ph='parade';E.t=0;E.msg='🎤 Os animais desfilam pela pista. Observem o andar, a musculatura e o aprumo!'}}
 else if(E.ph==='parade'){E.ents.forEach((e,i)=>{const u=(E.t*.32+i/n)%1,a=u*Math.PI*2,tx=R0.cx+Math.cos(a)*(R0.x1-R0.x0)*.42,ty=R0.cy+Math.sin(a)*(R0.y1-R0.y0)*.42;moveTo(e,tx,ty,40,dt)});if(E.t>7){E.ph='line';E.t=0;E.msg='🎤 Alinhem os animais para o jurado!'}}
 else if(E.ph==='line'){let ok=true;E.ents.forEach((e,i)=>{const s=expoSlot(i,n);if(!moveTo(e,s.x,s.y,34,dt))ok=false;});if(ok){E.ents.forEach(e=>e.dir=1);E.ph='insp';E.t=0;E.insp=0;E.msg='🧑‍⚖️ O jurado começa a avaliação.'}}
 else if(E.ph==='insp'){const e=E.ents[E.insp];if(!e){E.ph='rank';E.t=0;expoRank();return}const tx=e.x+(E.t<1.4?-4:22),ty=e.y+10;moveTo(E.judge,tx,ty,46,dt);
  if(e.me){E.meter=(Math.sin(E.t*4.2)+1)/2;if(E.t<.1)E.msg='🧑‍⚖️ O jurado chegou no SEU animal! Toque em “Aprumar” quando a barra estiver no verde.'}
  if(E.t>(e.me?3.6:2.1)){E.insp++;E.t=0;if(e.me&&!E.tried)E.msg='O jurado anotou sem você ajeitar o animal.'}}
 else if(E.ph==='rank'){let ok=true;E.ents.forEach((e,i)=>{const s=expoSlot(e.rank,n);if(!moveTo(e,s.x,s.y,30,dt))ok=false});moveTo(E.judge,R0.x0+4,R0.cy+16,40,dt);if(ok&&E.t>2.5){E.ph='ribbon';E.t=0;const w=E.ents.find(x=>x.rank===0);E.msg='🏆 '+(w.me?'É SEU! ':'')+E.cat.n.replace(/^\S+ /,'')+': '+w.a.name+', de '+w.f+'! A Arena aplaude!';try{ifx(w.me?'level':'good',0,10)}catch(e){}}}
 else if(E.ph==='ribbon'){if(E.t>4.2){expoAward();E.ph='out';E.t=0}}
 else if(E.ph==='out'){let ok=true;E.ents.forEach(e=>{if(!moveTo(e,(ARN.gx0+.5)*TS,ARN.ry0*TS+4,34,dt))ok=false});if(ok||E.t>4)expoNextCat()}}
function expoRank(){const E=EXPO;const me=E.ents.find(x=>x.me);me.s+=E.bonus;const L=E.ents.slice().sort((x,y)=>y.s-x.s);L.forEach((e,i)=>e.rank=i);E.msg='🧑‍⚖️ O jurado reorganiza a fila: o melhor fica à esquerda...'}
function expoAward(){const E=EXPO,c=E.cat,pe=E.pe,me=E.ents.find(x=>x.me),pos=me.rank+1,a=me.a,all=E.ents.slice().sort((x,y)=>x.rank-y.rank);E.best=Math.min(E.best,pos);
 const pr=pos<=3?[pe?15000:6000,pe?7000:3000,pe?3000:1500][pos-1]:0;if(pr)cash(pr,'Prêmio do julgamento');S.rep=Math.min(100,S.rep+([pe?6:4,pe?3:2,1][pos-1]||0));
 if(pos===1){a.title=1;a.titles=(a.titles||0)+1;E.firsts++;S.stats.expoWins=(S.stats.expoWins||0)+1;addTrof('🏆',c.n.replace(/^\S+ /,'')+(pe?' · Festa do Peão':' · Exposição')+' · ano '+yearN()+' ('+a.name+')');S.cel=S.cel||null;if(S.cel)S.cel.inv=Math.floor(S.day/30)+(S.day%30+1>15?1:0)}
 E.html+='<div class="card"><b>'+c.n+'</b>'+all.slice(0,4).map((x,i)=>'<div class="'+(x.me?'gold':'dim')+'" style="font-size:15px">'+['🥇','🥈','🥉','4º'][i]+' '+x.n+' — '+x.a.name+' ('+x.s.toFixed(0)+' pts)</div>').join('')+(pos>4?'<div class="gold" style="font-size:15px">'+pos+'º Você — '+a.name+' ('+me.s.toFixed(0)+' pts)</div>':'')+(pr?'<div class="grn">Prêmio: '+R$(pr)+'</div>':'')+'</div>'}
function expoFinish(){const E=EXPO;EXPO=null;expoUI();gainXP(20+E.firsts*30,'julgamento');E.J.done=1;E.J.res=E.html+(E.firsts?'<div class="card gold">🎗️ Campeões ganham faixa, valem mais na venda e nos leilões, e você recebe convite para o Leilão Estrelas do Agro deste mês!</div>':'');
 try{rvJudge(E.best)}catch(e){}if(E.firsts&&typeof celMsg==='function')celMsg('elite','Parabéns pelo título na Exposição! Seu nome entrou na lista de convidados do Leilão Estrelas do Agro deste mês. 🥂',{l:'⭐ Ver leilões',a:'celapp',v:'leiloes'});judgeModal()}
// ---------- botões
ACT.jgo=function(){expoStart()};
function expoApruma(){const E=EXPO;if(!E||E.ph!=='insp'||E.tried)return;const e=E.ents[E.insp];if(!e||!e.me)return;E.tried=1;const ok=E.meter>.62&&E.meter<.9;E.bonus=ok?4:-1;P.paddle=0;
 E.msg=ok?'✅ Perfeito! O animal ficou aprumado e o jurado sorriu: +4 pontos.':'😬 Puxou na hora errada, o animal se mexeu: −1 ponto.';try{ifx(ok?'good':'bad',0,10)}catch(err){}expoUI(1)}
// ---------- desenho na pista
function drawRibbon(g,x,y,k){const c=['#f0c020','#d8dce2','#c87a3a'][k];Rr(g,shade(c,-30),x-1,y+3,2,6);Rr(g,shade(c,-30),x+1,y+3,2,5);g.fillStyle=c;g.beginPath();g.arc(x+1,y+1,3.4,0,Math.PI*2);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(x+1,y+1,1.4,0,Math.PI*2);g.fill()}
const _evoEx=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoEx(L,x0,x1,y0,y1);if(!EXPO||inRoom())return;const E=EXPO;
 for(const e of E.ents){const d=e.dir||1,hx=e.x+d*15,hy=e.y+11;L.push([e.y+10,10,{draw:g=>{drawCow(g,e.a,e.x-8,e.y-2,d,e.mv?((frame>>3)&1):0);Rr(g,'#5a3a22',Math.min(hx,e.x+d*6),e.y+2,Math.abs(hx-(e.x+d*6))+1,.8);
   if(!e.me)OL(g,hx,hy,30,42,c=>drawPerson(c,{x:hx,y:hy,dir:e.mv?(d>0?3:2):0,ph:frame*.12,mv:e.mv,shirt:e.hl.shirt,hair:'#3a2a1a',pants:'#f4f4f0',hat:e.hl.hat}));
   if(E.ph==='ribbon'&&e.rank<3)drawRibbon(g,e.x,e.y-14,e.rank);if(E.ph==='insp'&&E.ents[E.insp]===e)Rr(g,'rgba(255,240,150,.5)',e.x-10,e.y+10,20,2)}}])}
 const j=E.judge;L.push([j.y,10,{draw:g=>{OL(g,j.x,j.y,30,42,c=>drawPerson(c,{x:j.x,y:j.y,dir:j.mv?((j.dir||1)>0?3:2):0,ph:frame*.12,mv:j.mv,shirt:'#ffffff',hair:'#c8c8c8',pants:'#3a3a3a',hat:'#e8dcb0',look:{hat:'vaqueiro',hatc:'#e8dcb0',jacket:'#2a3a5a',jk:'terno',slv:'#2a3a5a',cuff:'#fff',beard:'bigode'}}));Rr(g,'#c8a070',j.x+3,j.y-12,3.5,4.5);Rr(g,'#ffffff',j.x+3.5,j.y-11.5,2.5,3)}}]);
 if(E.ph==='ribbon'){for(let i=0;i<24;i++){const t=(E.t*40+i*13)%60;L.push([9e9,10,{draw:g=>Rr(g,FLAGC[i%6],exRing().x0+(i*37)%(exRing().x1-exRing().x0),exRing().y0-20+t,2,2)}])}}};
// jogador puxando o próprio animal
const _updEx=update;update=function(dt){_updEx(dt);if(!EXPO||!S)return;try{expoTick(Math.min(dt,.1));if(EXPO){const me=EXPO.ents.find(x=>x.me),d=me.dir||1;P.x=me.x+d*15;P.y=me.y+11;P.vx=P.vy=0;P.moving=me.mv?1:0;if(me.mv){P.ph+=dt*9;P.dir=d>0?3:2}else P.dir=0}expoUI()}catch(e){console.error(e);EXPO=null;expoUI()}};
const _ilEx=interactList;interactList=function(){if(EXPO)return[];return _ilEx()};
// ---------- painel da pista
const exBox=document.createElement('div');exBox.id='expobox';exBox.style.cssText='position:fixed;left:50%;bottom:6px;transform:translateX(-50%);width:min(600px,96vw);z-index:8;display:none;background:rgba(14,20,8,.9);border:2px solid #7ad04a;border-radius:10px;padding:6px 9px;color:#f3e6c8;font:13px sans-serif';document.body.appendChild(exBox);
exBox.addEventListener('click',e=>{const b=e.target.closest('[data-ex]');if(!b)return;e.stopPropagation();if(b.dataset.ex==='apr')expoApruma()});
let exK='';function expoUI(force){if(!EXPO){exBox.style.display='none';return}exBox.style.display='block';const E=EXPO,e=E.ph==='insp'&&E.ents[E.insp],my=e&&e.me&&!E.tried;const k=[E.ci,E.ph,E.msg,my,Math.round(E.meter*20)].join('|');if(!force&&k===exK)return;exK=k;
 exBox.innerHTML='<div style="display:flex;justify-content:space-between"><b style="color:#7ad04a">🏆 '+(E.pe?'GRANDE JULGAMENTO · FESTA DO PEÃO':'JULGAMENTO DA EXPOSIÇÃO')+'</b><span>'+E.cat.n+' · '+(E.ci+1)+'/'+E.cats.length+'</span></div><div style="margin:3px 0;font-style:italic;min-height:17px">'+E.msg+'</div>'
 +(my?'<div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:14px;background:#3a2a1a;border-radius:7px;position:relative;overflow:hidden"><div style="position:absolute;left:62%;width:28%;top:0;bottom:0;background:#3a8a2a"></div><div style="position:absolute;left:'+(E.meter*100)+'%;top:-2px;width:4px;height:18px;background:#fff"></div></div><button data-ex="apr" class="b gold" style="font-size:13px">✋ Aprumar o animal</button></div>':'')}
// campeões valem mais
const _voEx=valueOf;valueOf=function(a,k){const v=_voEx.apply(this,arguments);return a&&a.titles?v*(1+Math.min(.4,.08*a.titles)):v};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:3,ic:'🏆',t:'Exposição ao vivo',h:'Na Exposição (a cada 90 dias) e na Festa do Peão, inscreva seus melhores animais na Arena. Você entra na pista puxando o animal; quando o jurado chegar nele, toque em “Aprumar” com a barra no verde para ganhar pontos. Campeões ganham faixa, valem mais e garantem convite para o Leilão Estrelas do Agro.'});
