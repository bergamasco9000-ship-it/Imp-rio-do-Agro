// ===== Controles para PC/notebook: clique para andar e interagir, atalhos, teclas nas janelas, tela de controles =====
const PCK={rdl:'A ←',rdr:'D →',mkl:'A ←',mkr:'D →',tghit:'Espaço',fpull:'Espaço',fcast:'Espaço',ptpull:'Espaço',slhold:'Espaço',lcspin:'Espaço',lcthrow:'L',rhp:'',close:'Esc',jback:'Esc',bgagain:'N'};
const SPDS=[0,1,6,20];
// ---------- números nas opções das janelas (1–9) e dicas de tecla
function pcBadges(){if(isTouch)return;const box=$('mbox');if(!box)return;let n=1;
 box.querySelectorAll('button[data-act]').forEach(b=>{const a=b.dataset.act;if(a in PCK){const k=PCK[a];if(k){if(b.dataset.k!==k)b.dataset.k=k}else if(b.dataset.k)delete b.dataset.k;return}
  if(b.disabled||b.offsetParent===null)return;if(n<=9){const k=String(n++);if(b.dataset.k!==k)b.dataset.k=k}else if(b.dataset.k)delete b.dataset.k})}
if(!isTouch){new MutationObserver(()=>pcBadges()).observe($('mbox'),{childList:true,subtree:true});
 const st=document.createElement('style');st.textContent=
 'body:not(.touch) #mbox button[data-k]::before{content:attr(data-k);display:inline-block;min-width:13px;margin-right:5px;padding:0 3px;font-size:13px;line-height:15px;background:rgba(0,0,0,.45);color:#ffe9a8;border:1px solid rgba(255,233,168,.55);border-radius:3px;vertical-align:middle}'
 +'#ptip{position:fixed;z-index:9;pointer-events:none;background:rgba(20,13,8,.88);color:#ffe9a8;border:1px solid #e0a431;padding:1px 6px;font-size:17px;display:none;white-space:nowrap}'
 +'body:not(.touch) #cv{cursor:default}body:not(.touch) .keys{font-size:14px}';
 document.head.appendChild(st)}
// ---------- textos: “toque” vira “clique/aperte” no PC
function pcText(h){if(isTouch||typeof h!=='string')return h;return h.replace(/toque AGIR/gi,'aperte E').replace(/Toque em /g,'Clique em ').replace(/toque em /g,'clique em ').replace(/Toque /g,'Clique ').replace(/ toque /g,' clique ').replace(/ toque$/g,' clique')}
const _smPC=showModal;showModal=function(h){_smPC(pcText(h))};
if(!isTouch){if(typeof TUT!=='undefined')TUT.forEach(t=>{if(t.t)t.t=pcText(t.t)});if(typeof GUIDE!=='undefined')GUIDE.forEach(g=>{g.h=pcText(g.h)})}
// ---------- clique para andar / interagir
const GO={on:0,path:null,i:0,tx:0,ty:0,label:null,run:0,st:0,lx:0,ly:0,mk:null};
function goStop(){GO.on=0;GO.path=null;GO.label=null}
function worldAt(e){const r=CV.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*VW+CX,y:(e.clientY-r.top)/r.height*VH+CY}}
function pickAt(w){let best=null,bd=1e9;for(const it of interactList()){const d=Math.hypot(it.x-w.x,it.y-w.y),lim=Math.max(14,Math.min(it.r,26));if(d<lim&&d<bd){bd=d;best=it}}return best}
function goTo(x,y,it,run){
 GO.tx=x;GO.ty=y;GO.label=it?it.label:null;GO.run=run;GO.st=0;GO.lx=P.x;GO.ly=P.y;GO.i=0;GO.mk={x,y,t:0,it:!!it};
 if(it){const d=Math.hypot(it.x-P.x,it.y-(P.y-4));if(d<it.r){goStop();it.fn();return}}
 GO.path=inRoom()?null:findPath(P.x,P.y,x,y+(it?6:0));GO.on=1;GO.rt=0;if(GO.path&&GO.path.length>1){let L=0;for(let i=1;i<GO.path.length;i++)L+=Math.hypot(GO.path[i][0]-GO.path[i-1][0],GO.path[i][1]-GO.path[i-1][1]);if(L>220)GO.run=1}
}
function goArrive(){const lb=GO.label;goStop();if(!lb)return;let best=null,bd=1e9;for(const it of interactList()){if(it.label!==lb)continue;const d=Math.hypot(it.x-P.x,it.y-(P.y-4));if(d<bd){bd=d;best=it}}
 if(best&&bd<best.r+14)best.fn();else{findNear();if(NEAR)NEAR.fn()}}
const _giPC=getInput;
getInput=function(){const r=_giPC();if(r.mag>0){if(GO.on)goStop();return r}if(!GO.on||P.aim||AIM.bin)return r;
 let p=GO.path&&GO.path[GO.i];
 if(p&&Math.hypot(p[0]-P.x,p[1]-P.y)<5&&GO.i<GO.path.length-1){GO.i++;p=GO.path[GO.i]}
 if(!p||(GO.path&&GO.i>=GO.path.length-1&&Math.hypot(p[0]-P.x,p[1]-P.y)<5))p=[GO.tx,GO.ty];
 const dx=p[0]-P.x,dy=p[1]-P.y,d=Math.hypot(dx,dy);if(d<3){return r}
 return{x:dx/d,y:dy/d,mag:1,run:GO.run||!!KEY.shift}};
const _updPC=update;
update=function(dt){_updPC(dt);if(GO.mk){GO.mk.t+=dt;if(GO.mk.t>1.2)GO.mk=null}if(!GO.on)return;if(paused()){goStop();return}
 if(GO.label){GO.rt+=dt;if(GO.rt>.6){GO.rt=0;let cur=null,cd=1e9;for(const it of interactList())if(it.label===GO.label){const d=Math.hypot(it.x-GO.tx,it.y-GO.ty);if(d<cd){cd=d;cur=it}}if(cur&&cd>20){const lb=GO.label,run=GO.run;goTo(cur.x,cur.y,cur,run);GO.label=lb;GO.mk=null;return}}}
 if(GO.label){let best=null;for(const it of interactList())if(it.label===GO.label){const d=Math.hypot(it.x-P.x,it.y-(P.y-4));if(d<it.r){best=it;break}}if(best){goArrive();return}}
 else if(Math.hypot(GO.tx-P.x,GO.ty-P.y)<4){goStop();return}
 GO.st+=dt;if(GO.st>.7){if(Math.hypot(P.x-GO.lx,P.y-GO.ly)<3){if(GO.label&&Math.hypot(GO.tx-P.x,GO.ty-P.y)<40)goArrive();else goStop()}GO.st=0;GO.lx=P.x;GO.ly=P.y}};
const _dpPC=drawPart;drawPart=function(g){_dpPC(g);const m=GO.mk;if(!m)return;const k=m.t/1.2,r=3+k*6,a=(1-k).toFixed(2),c=m.it?'255,215,94':'255,255,255';
 Rr(g,'rgba('+c+','+a+')',m.x-r,m.y-.5,r*2,1);Rr(g,'rgba('+c+','+a+')',m.x-.5,m.y-r*.5,1,r);Rr(g,'rgba('+c+','+a+')',m.x-r*.7,m.y-r*.35,1,1);Rr(g,'rgba('+c+','+a+')',m.x+r*.7,m.y-r*.35,1,1)};
if(!isTouch){
 const tip=document.createElement('div');tip.id='ptip';document.body.appendChild(tip);let hovT=0;
 CV.addEventListener('mousedown',e=>{if(e.button!==0||paused()||P.aim||AIM.bin||(typeof PLACE!=='undefined'&&PLACE))return;const w=worldAt(e),it=pickAt(w);
  if(it)goTo(it.x,it.y,it,e.shiftKey);else goTo(w.x,w.y,null,e.shiftKey)});
 CV.addEventListener('mousemove',e=>{const now=performance.now();if(now-hovT<70)return;hovT=now;if(paused()||P.aim){tip.style.display='none';CV.style.cursor=P.aim?'crosshair':'default';return}
  const it=pickAt(worldAt(e));if(it){CV.style.cursor='pointer';tip.textContent=it.label;tip.style.left=(e.clientX+14)+'px';tip.style.top=(e.clientY+10)+'px';tip.style.display='block'}else{CV.style.cursor='default';tip.style.display='none'}});
 CV.addEventListener('mouseleave',()=>{tip.style.display='none'});
}
// ---------- atalhos extras
function setSpeed(v){speed=v;renderHUD();toast(v===0?'⏸ Jogo pausado (P para continuar)':'▶ Velocidade '+({1:'normal',6:'rápida ⏩',20:'muito rápida ⏭'})[v])}
let lastSpd=1;
function nextTab(d){const i=TABS.findIndex(t=>t[0]===tab);tab=TABS[(i+d+TABS.length)%TABS.length][0];lim=15;renderAll();$('menu').scrollTop=0}
addEventListener('keydown',e=>{
 if(document.getElementById('title'))return;const k=e.key.toLowerCase(),modal=$('modal').style.display==='flex';
 if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
 if(modal&&/^[1-9]$/.test(k)){const b=document.querySelector('#mbox button[data-k="'+k+'"]');if(b){e.preventDefault();b.click()}return}
 if(modal&&k==='n'){const b=document.querySelector('#mbox button[data-act="bgagain"]');if(b)b.click()}
 if(k==='tab'){e.preventDefault();if(modal)return;if(menuOpen)nextTab(e.shiftKey?-1:1);else openMenu();return}
 if(k==='m'&&menuOpen&&!modal){e.preventDefault();closeMenu();return}
 if(k==='p'){if(speed>0){lastSpd=speed;setSpeed(0)}else setSpeed(lastSpd||1);return}
 if(k==='+'||k==='='){const i=SPDS.indexOf(speed);setSpeed(SPDS[Math.min(SPDS.length-1,Math.max(1,i+1))]);return}
 if(k==='-'||k==='_'){const i=SPDS.indexOf(speed);setSpeed(SPDS[Math.max(1,i-1)]);return}
 if(k==='f1'){e.preventDefault();controlsModal();return}
});
// H abre os controles no PC (o “?” continua abrindo a ajuda geral)
if(!isTouch){const _hmPC=helpModal;helpModal=function(){_hmPC();const b=document.querySelector('#mbox .btns');if(b&&!b.querySelector('[data-act="ctlhelp"]'))b.insertAdjacentHTML('afterbegin','<button class="b blue" data-act="ctlhelp">🎮 Controles do teclado</button>')}}
ACT.ctlhelp=()=>controlsModal();
function controlsModal(){reModal=null;
 const row=(k,d)=>'<div style="display:flex;flex-wrap:nowrap;justify-content:space-between;gap:12px;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.06)"><span style="color:#ffe9a8;flex:0 0 auto">'+k+'</span><span style="text-align:right;flex:1 1 auto">'+d+'</span></div>';
 const sec=(t,rows)=>'<div class="sec">'+t+'</div><div class="card" style="font-size:17px;padding:4px 10px">'+rows.join('')+'</div>';
 showModal('<h3>🎮 Controles no computador</h3>'
  +sec('🖱️ MOUSE',[row('Clique no chão','andar até lá'),row('Clique em pessoa/animal/objeto','ir até lá e interagir'),row('Shift + clique','ir correndo'),row('Passar o mouse','mostra o nome do que dá para usar'),row('Botão direito','mirar a arma'),row('Clique (mirando)','atirar'),row('Clique nos botões','tudo funciona com o mouse')])
  +sec('🚶 MOVIMENTO',[row('W A S D ou setas','andar'),row('Shift','correr'),row('C','agachar (andar em silêncio)'),row('G','montar / descer do cavalo')])
  +sec('✋ AÇÕES',[row('E, Enter ou Espaço','interagir com o que está perto'),row('1 a 6','barra rápida'),row('U','usar item (remédio, curativo…)'),row('T','falar com seu parceiro(a)'),row('F','faca (quando os cães seguram a caça)')])
  +sec('🎯 CAÇA',[row('Q ou botão direito','mirar / guardar a arma'),row('Espaço ou clique','atirar'),row('Segurar Shift','prender a respiração (mira firme)'),row('R','recarregar'),row('B','binóculo')])
  +sec('🐕 CÃES',[row('X','PEGAR: soltar os cães na caça'),row('V','rastrear'),row('Z','junto / fica')])
  +sec('📋 MENUS E TEMPO',[row('M ou Tab','abrir o menu'),row('Tab / Shift+Tab','trocar de aba no menu'),row('Esc','fechar janela ou menu'),row('1 a 9','escolher a opção numerada nas janelas'),row('P','pausar / continuar'),row('+ e −','mudar a velocidade do tempo'),row('H ou F1','esta tela de controles'),row('Enter / Esc','confirmar / cancelar a obra')])
  +sec('🎲 MINIJOGOS',[row('Espaço','pescar, puxar no parto, argola, pescaria, girar o laço, abate'),row('L','laçar o bezerro'),row('A/D ou ← →','equilíbrio no rodeio, ordenha'),row('Setas ou WASD','passos da quadrilha e do baile'),row('1 a 9','marcar números do bingo')])
  +'<div class="btns"><button class="b gold" data-act="close">Entendi</button></div>')}
// H: no PC abre os controles
addEventListener('keydown',e=>{if(isTouch||document.getElementById('title'))return;const k=e.key.toLowerCase();if(k==='h'&&!paused()){e.stopImmediatePropagation();controlsModal()}},true);
// dicas nos botões da tela (tooltip com a tecla)
const _rhPC=renderHUD;renderHUD=function(){_rhPC();if(isTouch)return;const r=$('hudR');if(!r)return;r.querySelectorAll('button').forEach(b=>{const a=b.dataset.act,v=b.dataset.v;const t=a==='spd'?({0:'Pausar (P)',1:'Velocidade normal (−)',6:'Rápido (+)',20:'Muito rápido (+)'})[v]:a==='menu'?'Menu (M ou Tab)':a==='help'?'Ajuda':'';if(t&&b.title!==t)b.title=t})};
{const k=document.querySelector('.keys');if(k)k.textContent='WASD andar · clique: ir/interagir · Shift correr · E interagir · botão direito mirar · M/Tab menu · P pausar · H controles';}
GUIDE.forEach(g=>{if(g.t==='Controles'&&!isTouch)g.h='<b>Computador:</b> clique no chão para andar e em qualquer coisa para ir até ela e interagir · WASD/setas andam · Shift corre · E/Espaço interage · botão direito/Q mira e clique atira · R recarrega · B binóculo · 1–6 barra rápida · U usar item · F faca · X/V/Z cães · G cavalo · T parceiro(a) · M/Tab menu · Esc fecha · P pausa · +/− velocidade · 1–9 escolhem opções nas janelas · <b>H mostra todos os controles</b>.'});
