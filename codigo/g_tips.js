// ===== Dicas na hora certa, avisos de problema e Capítulo 2 do tutorial (Seu rebanho) =====
// ---------- alvo temporário para a seta (dicas e avisos)
let TIPT=null,TIPUI=null;// {f:()=>pos, until}, {sel:()=>seletor, until}
const _gtTip=guideTarget;guideTarget=function(){const t=_gtTip();if(t)return t;if(TIPT&&Date.now()<TIPT.until){try{const p=TIPT.f();if(p&&isFinite(p.x))return p}catch(e){}}return null};
const cowPos=a=>{if(!a||!S.herd.includes(a))return null;const s=spriteOf(a);return{x:s.x+8,y:s.y-2,h:a.name}};
setInterval(()=>{try{if(!S||S.tut<TUT.length&&TUT[S.tut].ui)return;if(TIPUI&&Date.now()<TIPUI.until&&!document.querySelector('.tuthl')){const sel=TIPUI.sel();const el=sel&&document.querySelector(sel);if(el){const r=el.getBoundingClientRect();if(r.width){el.classList.add('tuthl');const A=$('tutArrow'),up=r.top<70;A.textContent=up?'👆':'👇';A.style.display='block';A.style.left=Math.round(clamp(r.left+r.width/2-18,4,innerWidth-44))+'px';A.style.top=Math.round(up?r.bottom+2:r.top-44)+'px';setTimeout(()=>{el.classList.remove('tuthl')},240)}}}}catch(e){}},250);
// ---------- dicas (cada uma aparece uma vez)
const TIPQ=[];let tipLast=0;
function tip(id,html,o){S.tips=S.tips||{};if(S.tips[id]||TIPQ.some(q=>q.id===id))return;TIPQ.push({id,html,o:o||{}})}
function tipPump(){if(!TIPQ.length||paused()||Date.now()-tipLast<4000)return;if(S.tut<TUT.length&&!TIPQ[0].o.urgent&&S.tut<3)return;const q=TIPQ.shift();S.tips[q.id]=1;tipLast=Date.now();
 TIPT=q.o.go?{f:q.o.go,until:Date.now()+(q.o.secs||25)*1000}:null;TIPUI=q.o.ui?{sel:q.o.ui,until:Date.now()+(q.o.secs||25)*1000}:null;
 showModal('<h3>💡 Dica</h3><div class="card">'+q.html+'</div><div class="btns">'+(q.o.btn?'<button class="b gold" data-act="'+q.o.btn[1]+'" data-v="'+(q.o.btn[2]||'')+'">'+q.o.btn[0]+'</button>':'')+'<button class="b'+(q.o.btn?' gray':' gold')+'" data-act="close">Entendi</button></div>')}
ACT.tipherd=function(){hideModal();openMenu('herd')};
ACT.tipbulls=function(){hideModal();TIPT={f:()=>({x:114.5*TS,y:32.4*TS,h:'baia dos touros'}),until:Date.now()+600000};toast('🐂 Siga a seta até a baia dos touros, ao lado do leilão.','good')};
ACT.tipmarket=function(){hideModal();openMenu('market')};
let tipT=0;
function tipScan(){if(!S||!S.herd)return;const H=S.herd;
 const pg=H.find(a=>a.preg>0&&a.preg<140);if(pg)tip('preg','🤰 <b>'+pg.name+' está prenhe!</b> A gestação dura 150 dias. Vaca prenha tem um <b>sinal rosa</b> em cima dela (a seta mostra).<br>Depois do parto ela descansa uns 2 meses e já pode emprenhar de novo.',{go:()=>cowPos(pg)});
 if(S.stats&&S.stats.born>0){const c=H.find(a=>a.age<20);tip('born','🐮 <b>Nasceu um bezerro!</b> A genética (estrelas) dele é a <b>média da mãe e do pai</b>.<br>• <b>Fêmea:</b> vira matriz e dá mais bezerros.<br>• <b>Macho:</b> engorda e vira boi para vender (ou touro, se for muito bom).',{go:()=>cowPos(c)})}
 const rd=H.find(a=>a.sex==='M'&&ready(a));if(rd)tip('ready','🐂 <b>'+rd.name+' está pronto para abate!</b> Chegou no peso máximo: daqui pra frente ele só come e não engorda mais.<br>Venda no <b>☰ › Rebanho › Vender prontos</b>.',{go:()=>cowPos(rd),ui:()=>menuOpen?'[data-act="sellready"]':'[data-act="menu"]',btn:['Abrir rebanho','tipherd'],secs:40});
 const lb=H.find(a=>a.labor);if(lb){tip('labor','🚨 <b>Parto difícil!</b> Vá até <b>'+lb.name+'</b> (siga a seta) e toque em ✋ para ajudar. Se ninguém ajudar até amanhã, ela pode perder o bezerro.<br>Com peão a chance de dar certo é maior.',{go:()=>cowPos(lb),urgent:1,secs:120});if(S.tips&&S.tips.labor&&(!TIPT||Date.now()>TIPT.until))TIPT={f:()=>lb.labor?cowPos(lb):null,until:Date.now()+60000}}
 const sk=H.find(a=>a.sick);if(sk)tip('sick','🤒 <b>'+sk.name+' está doente</b> (cruz vermelha em cima). Toque nela com ✋ e escolha <b>Tratar</b>, ou trate todos no curral. Gado doente perde peso e pode morrer.<br>Vacinar na campanha (maio e novembro) evita muita doença.',{go:()=>cowPos(sk)});
 if(myNW()>=1e6)tip('emp','🏰 <b>Você passou de R$ 1 milhão!</b> Liberou o <b>Império do Agro</b>: comprar fazendas pelo Brasil, indústrias e muito mais. Fica no ☰ › Império.',{ui:()=>menuOpen?'#tabs [data-v="emp"]':'[data-act="menu"]',secs:40});
 if(LV()>=6&&S.imp&&!S.imp.met&&S.imp.hint)tip('gringo','🌎 Dizem que um <b>gringo</b> no fim da estrada do norte vende gado importado com genética de elite. Vale a visita!');
}
// ---------- avisos de problema (no máximo um a cada 7 dias por tipo)
function warn(id,html,o){S.warn=S.warn||{};if(S.warn[id]&&S.day-S.warn[id]<(o&&o.every||7))return;S.warn[id]=S.day;TIPQ.push({id:'w_'+id+'_'+S.day,html,o:Object.assign({urgent:1},o||{})})}
function warnDay(){if(!S||!S.herd||S.herd.length<3)return;const H=S.herd,cows=H.filter(a=>a.sex==='F'&&a.age>=420),bulls=H.filter(a=>a.sex==='M'&&a.breeder&&a.age>=400),mal=H.filter(a=>a.sex==='M'&&a.age>=400&&!a.breeder);
 if(cows.length>=2&&!bulls.length){const cand=mal.sort((a,b)=>b.gen-a.gen)[0];
  warn('nobull','⚠️ <b>Você está sem touro reprodutor!</b> Nenhuma vaca vai emprenhar e o rebanho para de crescer.<br>'+(cand?'Você tem o <b>'+cand.name+'</b> ('+stars(cand.gen)+'): abra a ficha dele e toque em <b>Reprodutor</b>. Ou ':'')+'compre um touro na baia dos touros, ao lado do leilão.',{btn:['Ir aos touros','tipbulls']})}
 else if(bulls.length&&cows.length>bulls.length*18)warn('fewbull','⚠️ Você tem '+cows.length+' vacas e só '+bulls.length+' touro(s). Cada touro cobre umas 18 vacas: as outras demoram para emprenhar. Compre mais um touro.',{btn:['Ir aos touros','tipbulls'],every:20});
 if(H.length>cap())warn('full','⚠️ <b>Pasto lotado:</b> '+H.length+' animais para '+cap()+' de lotação. O capim acaba, o gado emagrece e adoece mais.<br>Venda animais ou amplie o pasto em ☰ › Melhorias.',{every:10});
 if(S.pasture<22&&S.feed<50&&!S.up.peao)warn('nofeed','⚠️ <b>Capim acabando e cocho vazio!</b> O gado vai emagrecer. Compre ração no cocho (seta) — ou contrate um peão, que compra sozinho.',{go:()=>({x:TROUGH.x+24,y:TROUGH.y+14,h:'cocho'}),every:5});
 const rd=H.filter(a=>a.sex==='M'&&ready(a));S.rdDays=rd.length>=4?(S.rdDays||0)+1:0;if(S.rdDays>=12)warn('stuck','💸 Você tem <b>'+rd.length+' bois prontos parados</b> há dias. Eles comem, mas não engordam mais: cada dia parado é dinheiro perdido. Venda no ☰ › Rebanho › Vender prontos.',{ui:()=>menuOpen?'[data-act="sellready"]':'[data-act="menu"]',btn:['Abrir rebanho','tipherd'],every:15});
 const old=H.filter(a=>a.sex==='F'&&a.age>3300&&!a.preg);if(old.length>=3)warn('old','👵 Você tem '+old.length+' vacas velhas que quase não emprenham mais. Venda e coloque novilhas no lugar.',{every:30});
}
const _hdTip=hookDay;hookDay=function(){_hdTip();try{warnDay()}catch(e){console.error(e)}};
const _updTip=update;update=function(dt){_updTip(dt);tipT+=dt;if(tipT>1){tipT=0;try{tipScan();tipPump()}catch(e){console.error(e)}}};
// ---------- Capítulo 2: Seu rebanho
const _bmTip=bullModal;bullModal=function(k){S.tf.bullv=1;return _bmTip(k)};
const _brgTip=breedGuide;breedGuide=function(){S.tf.brg=1;return _brgTip()};
const _sfTip=sellFrig;sellFrig=function(a){const r=_sfTip(a);if(a&&a.sex==='M')S.tf.soldboi=1;return r};
TUT.push(
 {t:'<b>Capítulo 2 — Seu rebanho.</b> Vaca só emprenha com <b>touro Reprodutor</b>. Vá à <b>baia dos TOUROS</b>, ao lado da Casa de Leilões (seta), e toque num touro para ver a ficha dele.',done:()=>S.tf.bullv,go:()=>inRoom()?null:{x:114.5*TS,y:32.4*TS,h:'baia dos touros'},rw:[500,40]},
 {t:'Tenha um <b>touro Reprodutor</b>: compre um na baia, ou abra ☰ › Rebanho, escolha um macho adulto e toque em <b>Reprodutor</b>.',done:()=>S.herd.some(a=>a.sex==='M'&&a.breeder),go:()=>null,ui:()=>menuOpen?(document.querySelector('#panel [data-act="breeder"]')?'#panel [data-act="breeder"]':'#tabs [data-v="herd"]'):'[data-act="menu"]',rw:[500,40]},
 {t:'Agora é esperar uma vaca <b>emprenhar</b> (aparece um sinal rosa em cima dela). Leva umas semanas: use ⏩ para passar o tempo.',done:()=>S.herd.some(a=>a.preg>0)||S.stats.born>0,go:()=>null,rw:[400,40]},
 {t:'Quando um macho chega no peso de abate ele fica <b>pronto</b>. Venda um boi: ☰ › Rebanho › <b>Vender prontos</b>. (Se ainda não tem nenhum pronto, siga jogando.)',done:()=>S.tf.soldboi||S.stats.sold>0,go:()=>null,ui:()=>S.herd.some(a=>a.sex==='M'&&ready(a))?(menuOpen?'[data-act="sellready"]':'[data-act="menu"]'):null,rw:[600,50]},
 {t:'Cada raça é boa para uma coisa. Abra ☰ › Mercado › <b>Guia das raças</b> e veja qual combina com você.',done:()=>S.tf.brg,go:()=>null,ui:()=>menuOpen?(document.querySelector('[data-act="brguide"]')?'[data-act="brguide"]':'#tabs [data-v="market"]'):'[data-act="menu"]',rw:[400,40]},
 {t:'<b>Capítulo 2 concluído!</b> Resumo: touro bom = bezerros melhores · venda os prontos · venda vacas velhas · não deixe faltar comida. As dicas 💡 vão aparecer quando algo novo acontecer.',done:()=>S.tf.final2,go:()=>null,rw:[1000,80],tap:1}
);
{const _tok=ACT.tutok;ACT.tutok=function(){if(S.tut===TUT.length-1){S.tf.final2=1}return _tok.apply(this,arguments)}}
