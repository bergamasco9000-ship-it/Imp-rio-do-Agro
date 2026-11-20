// ===== Quem mora com você: arma, roupa de caça e equipamentos (colete, binóculo, kit, rádio, lanterna)
const MEQ={vest:{n:'Colete à prova de balas',ic:'🦺',p:4800,d:'Enfrenta ladrão sem medo: rende bandido de longe e bem mais rápido.'},
 bino:{n:'Binóculo',ic:'🔭',p:900,d:'Avista bichos duas vezes mais longe, e com mais frequência.'},
 kit:{n:'Kit de primeiros socorros',ic:'🩹',p:1200,d:'Cura mais (+50 de vida), mais vezes, e também cuida do cachorro.'},
 radio:{n:'Rádio comunicador',ic:'📻',p:750,d:'Avisa pelo rádio quando aparece ladrão ou onça, e a seta mostra onde.'},
 lamp:{n:'Lanterna tática',ic:'🔦',p:400,d:'De noite enxerga longe: pega ladrão com mais facilidade.'}};
const mEq=()=>{const m=S.mate;if(!m)return {};if(!m.eq)m.eq={};return m.eq};
const mEle=()=>S.mate&&S.mate.g==='f'?'ela':'ele';
const M2={cd:0,aim:0,tx:0,ty:0,flash:0,thT:0,dcd:0,rt:0,warned:{}};
// ---------- tela: equipamento
const _mmEq=mateModal;mateModal=function(){_mmEq();if(!S.mate)return;const box=$('mbox'),b=[...box.children].filter(c=>c.classList&&c.classList.contains('btns')).pop();if(!b)return;
 const E=mEq(),H=S.h||{own:{},ammo:{},outs:{}},nm=S.mate.name,own=Object.keys(H.own||{}).filter(k=>H.own[k]&&WEAPONS[k]),w=E.gun&&WEAPONS[E.gun];
 let h='<div class="sec">🎒 EQUIPAMENTO DE '+nm.toUpperCase()+'</div>';
 h+='<div class="card"><div class="row"><b>🔫 Arma</b><span class="gold">'+(w?w.n:'nenhuma')+'</span></div><div class="dim">'+(w?'Usa a sua munição ('+(H.ammo[w.ammo]||0)+' na caixa). Atira em bicho que vem te atacar, espanta onça do pasto e rende ladrão.':'Empreste uma das suas armas: '+mEle()+' protege você, o gado e a casa.')+'</div><div class="btns">'
  +(own.length?own.filter(k=>k!==E.gun).map(k=>'<button class="b" data-act="meqgun" data-v="'+k+'">Dar '+WEAPONS[k].n.replace(/ \(.*\)/,'')+'</button>').join(''):'<span class="dim">Você ainda não tem arma (Loja do Caçador ou Comendador).</span>')+(w?'<button class="b gray" data-act="meqgun" data-v="">Guardar a arma</button>':'')+'</div></div>';
 const outs=Object.keys(OUTFITS).filter(k=>k!=='casual'&&H.outs&&H.outs[k]);
 h+='<div class="card"><div class="row"><b>👕 Roupa de caça</b><span class="gold">'+(E.out&&OUTFITS[E.out]?OUTFITS[E.out].n:'roupa do dia a dia')+'</span></div><div class="btns">'+(outs.length?outs.filter(k=>k!==E.out).map(k=>'<button class="b" data-act="meqout" data-v="'+k+'">Vestir '+OUTFITS[k].n+'</button>').join(''):'<span class="dim">Compre camuflagem na Loja do Caçador para emprestar.</span>')+(E.out?'<button class="b gray" data-act="meqout" data-v="">Roupa normal</button>':'')+'</div></div>';
 h+=Object.keys(MEQ).map(k=>{const q=MEQ[k];return '<div class="card"><div class="row"><b>'+q.ic+' '+q.n+'</b>'+(E[k]?'<span class="grn">✅ Usando</span>':'<button class="b gold" data-act="meqbuy" data-v="'+k+'">Comprar '+R$(q.p)+'</button>')+'</div><div class="dim">'+q.d+'</div></div>'}).join('');
 const d=document.createElement('div');d.innerHTML=h;b.before(d)};
ACT.meqgun=function(e){const E=mEq(),k=e.v||null;if(k&&!(S.h&&S.h.own[k]))return;E.gun=k;toast(k?'🔫 '+S.mate.name+' pegou o(a) '+WEAPONS[k].n+'. “Pode deixar que eu cuido.”':'🔫 '+S.mate.name+' guardou a arma.','good')};
ACT.meqout=function(e){const E=mEq();E.out=e.v||null;toast(e.v?'👕 '+S.mate.name+' vestiu '+OUTFITS[e.v].n+'.':'👕 '+S.mate.name+' voltou para a roupa do dia a dia.','good')};
ACT.meqbuy=function(e){const q=MEQ[e.v],E=mEq();if(!q||E[e.v])return;if(S.money<q.p)return toast('Dinheiro insuficiente','bad');cash(-q.p,q.n+' para '+S.mate.name);E[e.v]=1;toast(q.ic+' '+S.mate.name+' agora tem '+q.n.toLowerCase()+'!','good')};
// ---------- tiro: defende você e a casa
function mateShot(tx,ty){const E=mEq(),w=WEAPONS[E.gun];if(!w)return false;const H=S.h;if((H.ammo[w.ammo]||0)<=0){tt('mammo','🔫 '+S.mate.name+': “Acabou a munição da '+w.n+'!”','bad',30);return false}
 H.ammo[w.ammo]--;M2.cd=w.rel*1.6+.7;M2.aim=.5;M2.flash=.12;M2.tx=tx;M2.ty=ty;MATE.dir=Math.abs(tx-MATE.x)>Math.abs(ty-MATE.y)?(tx>MATE.x?3:2):(ty>MATE.y?0:1);
 try{ifx('shot',E.gun,.2)}catch(err){}for(const a of WILD){if(a.st==='dead')continue;const dd=Math.hypot(a.x-MATE.x,a.y-MATE.y);if(dd<w.noise*.9)alarm(a,MATE.x,MATE.y)}return true}
function mateHit(a){const E=mEq(),w=WEAPONS[E.gun],sp=SPECIES[a.sp],d=Math.hypot(a.x-MATE.x,a.y-MATE.y);if(!mateShot(a.x,a.y-sp.sz*4))return;
 const pHit=clamp(.82-d/w.range*.45,.25,.85);if(Math.random()>pHit)return tt('mmiss','🔫 '+S.mate.name+' atirou no(a) '+sp.n+' e errou!','bad',3);
 const vital=Math.random()<.35,dmg=w.power*(vital?1.7:.75)*(w.pellets>1?2.2:1);a.hp-=dmg;a.hurt=1;a.hitQ=vital?'vital':(a.hitQ||'body');a.bleed=Math.max(a.bleed,vital?9:1.5+dmg/25);a.ft=6;
 if(a.hp<=-sp.hp*.3||(vital&&dmg>=sp.hp*1.2)||a.hp<=0){const s0=sp.season;sp.season=null;try{killWild(a)}finally{sp.season=s0}toast('🔫 '+S.mate.name+' abateu o(a) '+sp.n+' que vinha atacar! (legítima defesa, sem multa)','good');gainXP(10,'defesa')}
 else{a.st='flee';a.al=1.2;toast('🔫 '+S.mate.name+' acertou o(a) '+sp.n+', que fugiu ferido(a).','good')}}
const _updMeq=update;update=function(dt){if(S&&S.mate&&!paused()&&MATE.vis&&S.mate.task==='follow'&&mEq().kit&&P.hp<60&&MATE.healCd<=0&&Math.hypot(P.x-MATE.x,P.y-MATE.y)<120){MATE.healCd=60;P.hp=Math.min(100,P.hp+50);toast('🩹 '+S.mate.name+' fez um curativo em você (+50 vida)','good')}
 _updMeq(dt);if(!S||!S.mate||paused())return;const E=mEq();M2.cd-=dt;M2.aim-=dt;M2.flash-=dt;M2.dcd-=dt;M2.rt-=dt;
 if(!MATE.vis||inRoom())return;const w=E.gun&&WEAPONS[E.gun];
 // bicho atacando você ou ela
 if(w&&M2.cd<=0){let best=null,bd=1e9;for(const a of WILD){if(a.st==='dead'||a.st==='flee')continue;const sp=SPECIES[a.sp],dP=Math.hypot(a.x-P.x,a.y-P.y),dM=Math.hypot(a.x-MATE.x,a.y-MATE.y);
   const threat=a.st==='charge'&&(dP<220||dM<220)||(sp.aggr&&sp.dmg&&dP<Math.min(140,sp.aggr));if(threat&&dM<w.range*.95&&dM<bd){bd=dM;best=a}}
  if(best)mateHit(best);
  // onça no pasto: tiro para cima, ela foge (onça é protegida, não pode matar)
  else if(typeof ONCA!=='undefined'&&ONCA&&ONCA.st!=='flee'&&Math.hypot(ONCA.x-MATE.x,ONCA.y-MATE.y)<320){if(mateShot(MATE.x+(ONCA.x>MATE.x?20:-20),MATE.y-40))oncaScare(S.mate.name+' (tiro para o alto)')}}
 // ladrão: com arma rende de longe; colete e lanterna ajudam
 const night=typeof daylight==='function'&&daylight()<.3;
 const th=THV.find(t=>thActive(t)&&!t.camp&&Math.hypot(t.x-MATE.x,t.y-MATE.y)<(w?140:(E.vest?40:0)));
 if(th){M2.thT+=dt*(E.vest?1.6:1)*(night&&E.lamp?1.5:1);if(w&&M2.cd<=0&&M2.thT<.3)mateShot(MATE.x+(th.x>MATE.x?30:-30),MATE.y-40);if(M2.thT>=2){M2.thT=0;thiefDown(th,S.mate.name+(w?' (de arma na mão)':''))}}else M2.thT=0;
 // rádio: avisa e marca onde está o perigo
 if(E.radio&&M2.rt<=0){M2.rt=2;const t=THV.find(x=>thActive(x)&&!x.camp);const k=t?'th'+(t.id||THV.indexOf(t)):(typeof ONCA!=='undefined'&&ONCA&&ONCA.st!=='flee')?'onca'+S.day:null;
  if(k&&!M2.warned[k]){M2.warned[k]=1;const tgt=t||ONCA;toast('📻 '+S.mate.name+' (rádio): “'+(t?'Tem ladrão aqui na fazenda!':'Onça rondando o pasto!')+' Siga a seta.”','bad');TIPT={f:()=>tgt&&(t?thActive(t):ONCA===tgt)?{x:tgt.x,y:tgt.y,h:t?'ladrão':'onça'}:null,until:Date.now()+90000};}}
 // kit: cura mais e cuida do cachorro
 if(E.kit&&S.mate.task==='follow'){
  const dg=S.dogAct&&dogById(S.dogAct);if(dg&&!dg.dead&&M2.dcd<=0&&dg.hp<dogMax(dg)*.5){M2.dcd=75;dg.hp=Math.min(dogMax(dg),dg.hp+30);if(dg.wounds)dg.wounds.forEach(x=>x.band=1);toast('🩹 '+S.mate.name+' fez curativo no '+dg.name+' (+30)','good')}}
 // binóculo: avista mais longe e mais vezes
 if(E.bino&&S.mate.task==='follow'&&MATE.spotT>9){MATE.spotT=9;let best=null,bd=650;for(const a of WILD){if(a.st==='dead'||a.st==='flee')continue;const dd=Math.hypot(a.x-MATE.x,a.y-MATE.y);if(dd<bd&&dd>120){bd=dd;best=a}}
  if(best&&(!MATE.spot||MATE.spot.a!==best)){MATE.spot={a:best,t:10};const ang=Math.atan2(best.y-P.y,best.x-P.x),dir=Math.abs(Math.cos(ang))>Math.abs(Math.sin(ang))?(Math.cos(ang)>0?'leste':'oeste'):(Math.sin(ang)>0?'sul':'norte');tt('mspot','🔭 '+S.mate.name+' avistou um(a) '+SPECIES[best.sp].n+' a uns '+Math.round(bd/TS)+' passos, ao '+dir+'!','good',8)}}};
// ---------- desenho: roupa de caça, colete, arma nas costas ou na mão
const _dmEq=drawMate;drawMate=function(g){if(!S.mate||!MATE.vis)return _dmEq(g);const E=mEq(),x=MATE.x,y=MATE.y;
 if(E.out&&OUTFITS[E.out]){const c=OUTFITS[E.out].c;OL(g,x,y+3,30,40,cc=>drawPerson(cc,{x,y,dir:MATE.dir,ph:MATE.ph,mv:MATE.mv,shirt:c[0],pants:c[1],hat:c[2],hair:'#3a2a1a',g:S.mate.g,work:MATE.work}));
  if(MATE.spot&&MATE.spot.a.st!=='dead'){const a=MATE.spot.a;Rr(g,'#ffd75e',a.x-2,a.y-30-((frame>>3)&1)*2,4,4);Rr(g,'#ffd75e',a.x-1,a.y-26,2,3)}}
 else _dmEq(g);
 const side=MATE.dir===2?-1:1,back=MATE.dir===1;
 if(E.vest){Rr(g,'#2f3a2a',x-4.5,y-17,9,7);Rr(g,'#3f4a36',x-3.5,y-16,7,2);Rr(g,'#c8b070',x-1,y-14,2,1)}
 if(E.radio)Rr(g,'#1a1a1a',x+3.5*side,y-14,1.6,3.4);
 const w=E.gun&&WEAPONS[E.gun];if(!w)return;const pist=!!w.pist;
 if(M2.aim>0){const ang=Math.atan2(M2.ty-(y-14),M2.tx-x),L=pist?7:13;for(let i=0;i<=L;i+=1.2)Rr(g,i<3?'#5a3a22':'#2a2a2a',x+Math.cos(ang)*(2+i)-.6,y-14+Math.sin(ang)*(2+i)-.6,1.4,1.4);
  if(M2.flash>0){const fx=x+Math.cos(ang)*(4+L),fy=y-14+Math.sin(ang)*(4+L);Rr(g,'#fff4a0',fx-2,fy-2,4,4);Rr(g,'#ffb030',fx-1,fy-3,2,6);g.strokeStyle='rgba(255,240,180,.55)';g.lineWidth=.7;g.beginPath();g.moveTo(fx,fy);g.lineTo(M2.tx,M2.ty);g.stroke()}}
 else if(pist){Rr(g,'#3a2414',x+3*side,y-11,2.4,4);Rr(g,'#2a2a2a',x+3.4*side,y-12,1.6,2)}
 else if(!back){for(let i=0;i<14;i++)Rr(g,i<5?'#5a3a22':'#2a2a2a',x-6*side+i*.8*side,y-20+i*.85,1.3,1.3)}
 else for(let i=0;i<14;i++)Rr(g,i<5?'#5a3a22':'#2a2a2a',x-6+i*.85,y-21+i*.9,1.5,1.5)};
