// ===== Tela inicial, mundos (saves) e dificuldade =====
let SLOT=0;
const SK=n=>'fbo_w'+n;
save=function(){if(!SLOT||!S)return;try{S.savedAt=Date.now();localStorage.setItem(SK(SLOT),JSON.stringify(S))}catch(e){}};
load=function(){try{const s=localStorage.getItem(SK(SLOT));if(s){const o=JSON.parse(s);if(o&&o.v===2){S=o;return true}}}catch(e){}return false};
try{if(!localStorage.getItem(SK(1))&&localStorage.getItem('fbo_save'))localStorage.setItem(SK(1),localStorage.getItem('fbo_save'))}catch(e){}
const DIFF={easy:{n:'Tranquilo',d:'+50% de dinheiro inicial e metade dos ladrões.',m:1.5},normal:{n:'Normal',d:'Equilibrado. O jeito pensado do jogo.',m:1},real:{n:'Realista',d:'-30% de dinheiro inicial e 40% mais ladrões. Cão que morre não volta.',m:.7}};
const _nrT=nightRoll;
nightRoll=function(){const d=S.diff||'normal';if(d==='easy'&&Math.random()<.5)return false;const r=_nrT();if(!r&&d==='real')return Math.random()<.045;return r};
function slotInfo(n){
 try{const s=localStorage.getItem(SK(n));if(!s)return null;const o=JSON.parse(s);
  return{name:o.farmName||'Fazenda Boi de Ouro',day:o.day-269,lv:lvOf((o.lv&&o.lv.xp)||0),money:o.money,nw:o.rkLast||0,diff:(DIFF[o.diff]||DIFF.normal).n,h:Math.floor((o.playT||0)/3600),m:Math.floor((o.playT||0)%3600/60),title:o.titleN||'Sitiante',dogs:(o.dogs||[]).length,herd:(o.herd||[]).length,at:o.savedAt}}catch(e){return{bad:1}}
}
const TI=document.createElement('div');TI.id='title';
TI.innerHTML='<canvas id="tcv"></canvas><div id="tbox"></div>';
document.body.appendChild(TI);
{const st=document.createElement('style');st.textContent=`
#title{position:fixed;inset:0;z-index:60;background:#1a0f08;display:flex;align-items:center;justify-content:center;overflow:auto}
#tcv{position:fixed;inset:0;width:100%;height:100%;image-rendering:pixelated}
#tbox{position:relative;width:min(560px,94vw);max-height:94vh;overflow:auto;padding:10px;margin:auto}
#tbox .logo{font-family:'Press Start 2P',monospace;text-align:center;line-height:1.25;margin:6px 0 2px}#tbox .lg1{display:block;color:#ffd75e;font-size:clamp(22px,7.5vw,40px);text-shadow:3px 3px 0 #6a2a0a,0 0 12px rgba(255,200,60,.45);letter-spacing:2px}#tbox .lg2{display:block;color:#7ad04a;font-size:clamp(18px,6vw,32px);text-shadow:3px 3px 0 #1e4a12;letter-spacing:2px}#tbox .lgtag{text-align:center;margin:4px auto 8px;width:max-content;padding:3px 10px;font-family:'Press Start 2P',monospace;font-size:clamp(9px,2.6vw,13px);color:#fff;background:linear-gradient(90deg,#1e7a2e,#f0c020,#1e4aa8);border:2px solid #3a2a12;box-shadow:2px 2px 0 #000;text-shadow:1px 1px 0 #000;letter-spacing:1px}
#tbox .sub{text-align:center;color:#fff;font-size:20px;text-shadow:2px 2px 0 #000;margin-bottom:12px}
#tbox .wslot{background:rgba(30,18,10,.88);border:3px solid #6a4a2a;border-radius:8px;padding:10px 12px;margin:8px 0;color:#f3e6c8}
#tbox .wslot.has{border-color:#e0a431}
#tbox .wslot b{font-size:22px}
#tbox .row2{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
#tbox button{font-family:'VT323',monospace;font-size:21px;padding:7px 14px;border-radius:6px;border:2px solid #000;background:#e0a431;color:#2a1a0a;cursor:pointer;box-shadow:0 3px 0 #7a5a12}
#tbox button.g{background:#5a4a3a;color:#f3e6c8;box-shadow:0 3px 0 #2a1a0a}
#tbox button.r{background:#c8402a;color:#fff;box-shadow:0 3px 0 #6a1a0a}
#tbox button.big{font-size:26px;padding:10px 26px}
#tbox input,#tbox textarea{width:100%;font-family:'VT323',monospace;font-size:22px;padding:6px;border-radius:6px;border:2px solid #6a4a2a;background:#f3e6c8;color:#2a1a0a}
#tbox .opt{display:block;text-align:left;width:100%;margin:5px 0;background:#3a2a1a;color:#f3e6c8;box-shadow:0 3px 0 #1a0f08}
#tbox .opt.on{background:#e0a431;color:#2a1a0a}
#tbox .dim{color:#c8b896;font-size:18px}`;document.head.appendChild(st)}
// cenário animado
const TC=$('tcv'),tg=TC.getContext('2d');let tF=0,tRun=true;
function tDraw(){
 if(!tRun)return;tF++;const W=160,H=90;TC.width=W;TC.height=H;const ps=PS;PS=1;
 const sky=tg.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#2a1a4a');sky.addColorStop(.45,'#c8503a');sky.addColorStop(.7,'#f0a040');tg.fillStyle=sky;tg.fillRect(0,0,W,H);
 tg.fillStyle='#ffd75e';tg.beginPath();tg.arc(112,52,11,0,7);tg.fill();tg.fillStyle='rgba(255,220,120,.25)';tg.beginPath();tg.arc(112,52,17,0,7);tg.fill();
 for(let i=0;i<5;i++){const cx=((i*41+tF*.05)%200)-20;Rr(tg,'rgba(255,200,170,.5)',cx,10+i*6,18,2);Rr(tg,'rgba(255,200,170,.35)',cx+4,9+i*6,10,1)}
 tg.fillStyle='#5a3a4a';tg.beginPath();tg.moveTo(0,60);for(let x=0;x<=W;x+=8)tg.lineTo(x,56-Math.sin(x*.05)*6-Math.sin(x*.13)*3);tg.lineTo(W,H);tg.lineTo(0,H);tg.fill();
 Rr(tg,'#3a4a2a',0,64,W,26);Rr(tg,'#4a5a2a',0,64,W,2);
 for(let x=2;x<W;x+=10){Rr(tg,'#2a1a10',x,62,2,9);}Rr(tg,'#2a1a10',0,64,W,1);Rr(tg,'#2a1a10',0,67,W,1);
 Rr(tg,'#2a1a10',18,44,22,20);Rr(tg,'#1a0f08',16,40,26,5);Rr(tg,'#1a0f08',20,36,18,4);Rr(tg,'#e0a431',26,50,4,4);Rr(tg,'#2a1a10',46,50,3,14);Rr(tg,'#1a0f08',41,40,13,12);
 const cow=(x,y,f)=>{Rr(tg,'#1a0f08',x,y-6,12,5);Rr(tg,'#1a0f08',x+(f?11:-3),y-8,4,4);Rr(tg,'#1a0f08',x+1,y-1,1.5,3);Rr(tg,'#1a0f08',x+9,y-1,1.5,3)};
 cow(60,75,1);cow(84,79,0);cow(130,76,1);
 const dx=((tF*.4)%220)-30;drawDogSprite(tg,dx,85,1,DOGS.kangal.v,'run',tF*.35,{});
 for(let i=0;i<6;i++){const fx=(i*29+Math.sin(tF/40+i)*6)%W,fy=70+Math.sin(tF/25+i*2)*6;if((tF+i*7)%40<28)Rr(tg,'rgba(255,240,140,.8)',fx,fy,1,1)}
 PS=ps;requestAnimationFrame(tDraw);
}
requestAnimationFrame(tDraw);
let TMODE='main',TSEL=0,TNEW={name:'',diff:'normal',dog:'vira'},TDEL=0;
function tRender(){
 const B=$('tbox');let h='<div class="logo"><span class="lg1">IMPÉRIO</span><span class="lg2">DO AGRO</span></div><div class="lgtag">FAZENDA BRASIL</div><div class="sub">gado · lavoura · caça · pesca</div>';
 if(TMODE==='main'){
  for(let n=1;n<=3;n++){const s=slotInfo(n);
   if(s&&!s.bad)h+='<div class="wslot has"><b>🌾 Mundo '+n+' — '+s.name+'</b><div class="dim">Dia '+s.day+' · Nível '+s.lv+' · '+R$(s.money)+' · '+s.title+'</div><div class="dim">🐄 '+s.herd+' cabeças · 🐕 '+s.dogs+' cães · '+s.diff+' · ⏱️ '+s.h+'h'+String(s.m).padStart(2,'0')+'</div><div class="row2"><button class="big" data-t="play" data-n="'+n+'">▶ Jogar</button>'+(TDEL===n?'<button class="r" data-t="delok" data-n="'+n+'">Confirmar: apagar para sempre</button><button class="g" data-t="delno">Cancelar</button>':'<button class="g" data-t="del" data-n="'+n+'">🗑️ Apagar</button><button class="g" data-t="exp" data-n="'+n+'">💾 Backup</button>')+'</div></div>';
   else h+='<div class="wslot"><b>➕ Mundo '+n+' — vazio</b><div class="row2"><button data-t="new" data-n="'+n+'">Criar novo mundo</button><button class="g" data-t="imp" data-n="'+n+'">📥 Importar backup</button></div></div>'}
  h+='<div class="dim" style="text-align:center;margin-top:6px;text-shadow:1px 1px 0 #000">O jogo salva sozinho a cada dia. Os mundos ficam guardados neste aparelho/navegador — use 💾 Backup para não perder.</div>';
 }else if(TMODE==='new'){
  h+='<div class="wslot has"><b>Novo mundo '+TSEL+'</b><div class="dim">Nome da fazenda</div><input id="tname" maxlength="24" placeholder="Fazenda Boi de Ouro" value="'+TNEW.name.replace(/"/g,'')+'">'
   +'<div class="dim" style="margin-top:8px">Dificuldade</div>'+Object.keys(DIFF).map(k=>'<button class="opt '+(TNEW.diff===k?'on':'')+'" data-t="diff" data-v="'+k+'"><b>'+DIFF[k].n+'</b> — '+DIFF[k].d+'</button>').join('')
   +'<div class="dim" style="margin-top:8px">Cão inicial</div>'+['vira','collie','beagle'].map(k=>'<button class="opt '+(TNEW.dog===k?'on':'')+'" data-t="dog" data-v="'+k+'"><b>'+DOGS[k].n+'</b> — '+DOGS[k].d+'</button>').join('')
   +'<div class="row2" style="margin-top:10px"><button class="big" data-t="create">Começar ▶</button><button class="g" data-t="back">Voltar</button></div></div>';
 }else if(TMODE==='exp'){
  let code='';try{code=btoa(unescape(encodeURIComponent(localStorage.getItem(SK(TSEL))||'')))}catch(e){}
  h+='<div class="wslot has"><b>💾 Backup do Mundo '+TSEL+'</b><div class="dim">Copie este código e guarde (bloco de notas, e-mail...). Para recuperar, use "Importar backup" num espaço vazio.</div><textarea id="tcode" rows="6" readonly>'+code+'</textarea><div class="row2"><button data-t="copy">Copiar</button><button class="g" data-t="back">Voltar</button></div></div>';
 }else if(TMODE==='imp'){
  h+='<div class="wslot has"><b>📥 Importar no Mundo '+TSEL+'</b><div class="dim">Cole o código de backup:</div><textarea id="tcode" rows="6"></textarea><div class="row2"><button data-t="impok">Importar</button><button class="g" data-t="back">Voltar</button></div></div>';
 }
 B.innerHTML=h;
}
$('tbox').addEventListener('click',e=>{
 const b=e.target.closest('[data-t]');if(!b)return;const t=b.dataset.t,n=+b.dataset.n;
 if(t==='play'){tLoad(()=>startGame(n));return}
 else if(t==='new'){TSEL=n;TMODE='new';TNEW={name:'',diff:'normal',dog:'vira'}}
 else if(t==='diff'){TNEW.name=$('tname').value;TNEW.diff=b.dataset.v}
 else if(t==='dog'){TNEW.name=$('tname').value;TNEW.dog=b.dataset.v}
 else if(t==='create'){TNEW.name=$('tname').value.trim()||'Fazenda Boi de Ouro';const o=TNEW;tLoad(()=>startGame(TSEL,o));return}
 else if(t==='back'){TMODE='main';TDEL=0}
 else if(t==='del')TDEL=n;else if(t==='delno')TDEL=0;
 else if(t==='delok'){try{localStorage.removeItem(SK(n))}catch(e){}TDEL=0}
 else if(t==='exp'){TSEL=n;TMODE='exp'}
 else if(t==='imp'){TSEL=n;TMODE='imp'}
 else if(t==='copy'){const ta=$('tcode');ta.select();try{navigator.clipboard.writeText(ta.value)}catch(e){document.execCommand('copy')}b.textContent='Copiado ✓';return}
 else if(t==='impok'){try{const js=decodeURIComponent(escape(atob($('tcode').value.trim())));const o=JSON.parse(js);if(!o||o.v!==2)throw 0;localStorage.setItem(SK(TSEL),js);TMODE='main'}catch(err){alert('Código inválido')}}
 tRender();
});
function tLoad(fn){$('tbox').innerHTML='<div class="logo"><span class="lg1">IMPÉRIO</span><span class="lg2">DO AGRO</span></div><div class="lgtag">FAZENDA BRASIL</div><div class="sub">Preparando o mundo…</div>';setTimeout(fn,60)}
function startGame(n,opt){
 SLOT=n;tRun=false;TI.remove();
 const fresh=!load();
 if(fresh){newGame();S.aucOpen={type:'comum',until:273,lots:null};newStraws()}
 if(fresh&&opt){S.farmName=opt.name;S.diff=opt.diff;S.money=Math.round(S.money*DIFF[opt.diff].m)}
 ensureH();ensureG();
 if(fresh&&opt&&S.dogs[0]){S.dogs[0].breed=opt.dog;delete S.dogs[0]._ok;S.dogs[0].hp=undefined}
 rebuildCMap();syncCH();resize();addEventListener('resize',resize);genWorld();spawnAll();genOffers();renderAll();updateHuntHud();
 if(S.intro){S.intro=0;helpModal()}
 save();requestAnimationFrame(loop);
}
const _updT=update;update=function(dt){_updT(dt);S.playT=(S.playT||0)+dt};
ACT.totitle=function(){save();location.reload()};
newGame();
tRender();
