// ===== Ajustes: lojas/banco/melhorias só no lugar certo, botão do mapa no topo, botões de tiro mais altos
// ===== (fora do selo do app), revólver/pistola como arma secundária (botão SACAR / tecla Q)
// ---------- ☰ só com o que é seu; mercado, melhorias, obras, leilão, banco e império só no lugar certo
const MLOC={market:'agro',up:'agro',obras:'agro',auc:'leilao',fin:'banco',bolsa:'banco',emp:'house'};
const MGRP={agro:['market','up','obras'],leilao:['auc'],banco:['fin','bolsa'],house:['emp','bolsa']};
const MLOCN={agro:'Casa Agro',leilao:'Casa de Leilões',banco:'Banco',house:'escritório da sua casa'};
const MWHAT={market:'O mercado fica',up:'As melhorias ficam',obras:'As obras ficam',auc:'O leilão fica',fin:'As finanças ficam',bolsa:'Os investimentos ficam',emp:'O Império do Agro fica'};
const MNA={agro:'na Casa Agro, na vila',leilao:'na Casa de Leilões, na vila',banco:'no Banco, na vila',house:'no escritório da sua casa'};
let MLOCX=null;// lugar liberado por um balcão de fora (ex.: loja do Bairro Novo)
function locNow(){if(!S||typeof P==='undefined')return null;if(MLOCX)return MLOCX;
 if(inRoom()){const r=roomAt(P.x,P.y);return r&&MGRP[r.id]?r.id:null}
 if(typeof HANG!=='undefined'&&Math.hypot(P.x-HANG.x,P.y-HANG.y)<60&&S.emp)return 'house';return null}
const tabOk=t=>!MLOC[t]||(MGRP[locNow()]||[]).includes(t);
const tabDef=()=>{const l=locNow();return l?MGRP[l][0]:'herd'};
function placeArrow(loc){const b=bDoor(loc);if(!b)return false;TIPT={f:()=>inRoom()?null:Object.assign({},b,{h:MLOCN[loc]}),until:Date.now()+600000};return true}
function tabBlocked(t){const loc=MLOC[t],ar=placeArrow(loc);
 toast('📍 '+(MWHAT[t]||'Isso fica')+' '+MNA[loc]+(t==='bolsa'?' (ou no escritório da sua casa)':'')+'. Vá até lá'+(ar?' e siga a seta':'')+'.','bad')}
const _omF4=openMenu;openMenu=function(t){
 if(t&&!tabOk(t)){tabBlocked(t);return}
 const l=locNow();if(!t&&l&&!MGRP[l].includes(tab))tab=MGRP[l][0];if(!tabOk(t||tab))tab=tabDef();return _omF4(t)};
const _closeF4=closeMenu;closeMenu=function(){MLOCX=null;return _closeF4.apply(this,arguments)};
const _tabF4=ACT.tab;ACT.tab=function(e){if(e&&!tabOk(e.v)){tabBlocked(e.v);return}return _tabF4(e)};
const _raF4=renderAll;renderAll=function(){if(menuOpen&&!tabOk(tab))tab=tabDef();_raF4.apply(this,arguments);const el=$('tabs');if(!el||!menuOpen)return;const loc=locNow();
 const L=TABS.filter(t=>tabOk(t[0])).sort((a,b)=>(MLOC[a[0]]?0:1)-(MLOC[b[0]]?0:1));
 const h=(loc?'<span class="locn">📍 '+MLOCN[loc]+'</span>':'')+L.map(t=>'<button data-act="tab" data-v="'+t[0]+'" class="'+(tab===t[0]?'on':'')+(MLOC[t[0]]?' loc':'')+'">'+t[1]+'</button>').join('');
 if(el._h4!==h){el._h4=h;el.innerHTML=h}};
{const st=document.createElement('style');st.textContent='#tabs button.loc{border-color:#e0a431!important}#tabs .locn{font:11px sans-serif;color:#f0d060;padding:0 6px;align-self:center;white-space:nowrap}';document.head.appendChild(st)}
// loja do Bairro Novo continua vendendo sementes e ração com desconto
if(ACT.vloja){const _vlF4=ACT.vloja;ACT.vloja=function(){MLOCX='agro';return _vlF4.apply(this,arguments)}}
// ---------- escritório na casa: Império, investimentos e equipe
if(ROOMS.house&&!ROOMS.house.items.some(i=>i.act==='office'))ROOMS.house.items.push({k:'desk',x:8,y:2,w:2,h:1,act:'office'});
function officeModal(){const imp=myNW()>=1e6||(S.emp&&Object.keys(S.emp.farms||{}).length);
 showModal('<h3>💼 Escritório</h3><div class="card">Sua escrivaninha: daqui você cuida dos negócios grandes.'+(imp?'':'<br><span class="dim">O <b>Império do Agro</b> libera quando o patrimônio passar de R$ 1 milhão.</span>')+'</div><div class="btns">'
  +(imp?'<button class="b gold" data-act="offgo" data-v="emp">🏰 Império do Agro</button>':'')+'<button class="b" data-act="offgo" data-v="bolsa">📈 Investimentos</button>'+(typeof crewModal==='function'?'<button class="b" data-act="crew">👷 Equipe da fazenda</button>':'')+'<button class="b gray" data-act="close">Fechar</button></div>')}
ACT.offgo=function(e){hideModal();openMenu(e.v)};
const _raOff=roomAct;roomAct=function(it,r){if(it.act==='office')return officeModal();return _raOff(it,r)};
const _ilOff=interactList;interactList=function(){const L=_ilOff();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r||r.id!=='house')return L;const it=r.items.find(i=>i.act==='office');if(!it)return L;
 const x=(r.x+it.x+(it.w||1)/2)*TS,y=(r.y+it.y+(it.h||1))*TS+4;for(const l of L)if(l.label==='Usar'&&Math.abs(l.x-x)<1&&Math.abs(l.y-y)<1)l.label='💼 Escritório';return L};
// ---------- textos que mandavam abrir pelo ☰
{const s=TUT.find(x=>x.t&&x.t.includes('Guia das raças'));if(s){s.t='Cada raça é boa para uma coisa. Abra ☰ › <b>📖 Guia</b> › <b>Guia das raças</b> e veja qual combina com você.';s.ui=()=>menuOpen?(document.querySelector('[data-act="brguide"]')?'[data-act="brguide"]':'#tabs [data-v="guia"]'):'[data-act="menu"]'}}
const _pgF4=pGuia;pGuia=function(){return '<div class="btns" style="margin-bottom:6px"><button class="b gold" data-act="brguide">🐄 Guia das raças</button><button class="b" data-act="wmap">🗺️ Mapa da região</button></div>'+_pgF4()};
ACT.tipmarket=function(){hideModal();placeArrow('agro');toast('🏪 Siga a seta até a Casa Agro, na vila.','good')};
const _warnF4=warn;warn=function(id,h,o){return _warnF4(id,String(h).split('amplie o pasto em ☰ › Melhorias').join('amplie o pasto na <b>Casa Agro</b> (Melhorias), na vila'),o)};
const _tipF4=tip;tip=function(id,h,o){if(id==='emp'){h='🏰 <b>Você passou de R$ 1 milhão!</b> Liberou o <b>Império do Agro</b>: comprar fazendas pelo Brasil, indústrias e muito mais. Fica na <b>escrivaninha do escritório</b>, dentro da sua casa.';o=Object.assign({},o||{},{ui:null,go:()=>inRoom()?null:Object.assign({},bDoor('house'),{h:'sua casa'})})}return _tipF4(id,h,o)};
// ---------- botão do mapa no topo, ao lado do celular
const _rhF4=renderHUD;renderHUD=function(){_rhF4.apply(this,arguments);const r=document.getElementById('hudR');if(!r||r.querySelector('[data-act="wmap"]'))return;const b=document.createElement('button');b.dataset.act='wmap';b.textContent='🗺️';const c=r.querySelector('[data-act="cel"]')||r.querySelector('[data-act="somtg"]')||r.querySelector('[data-act="menu"]');r.insertBefore(b,c)};
// ---------- botões de tiro mais altos: o selo do app no canto de baixo não fica mais em cima da mira
{const st=document.createElement('style');st.textContent='#bAim{right:96px!important;bottom:142px!important}#bFire{right:92px!important;bottom:68px!important}#bBin{right:100px!important;bottom:206px!important}#bSec{right:168px;bottom:206px;width:50px;height:50px;font-size:20px}#bSec.on{background:rgba(200,140,40,.9)}';document.head.appendChild(st)}
// ---------- arma secundária: revólver/pistola no coldre, saca com um toque
const isPist=k=>!!(k&&WEAPONS[k]&&WEAPONS[k].pist);
const wPrice=k=>(WEAPONS[k]&&(WEAPONS[k].p||WEAPONS[k].price))||0;
function ensureSec(){const H=S&&S.h;if(!H)return null;if(H.eq2&&(!H.own[H.eq2]||!WEAPONS[H.eq2]||H.eq2===H.eq))H.eq2=null;
 if(!H.eq2&&H.eq&&WEAPONS[H.eq]){const own=Object.keys(H.own).filter(k=>H.own[k]&&WEAPONS[k]&&k!==H.eq),want=(isPist(H.eq)?own.filter(k=>!isPist(k)):own.filter(isPist)).sort((a,b)=>wPrice(b)-wPrice(a));if(want[0])H.eq2=want[0]}
 return H.eq2}
let SWAPPING=0;const _heqF4=ACT.hequip;
ACT.hequip=function(e){const k=e&&e.v,H=S.h;if(SWAPPING||!k)return _heqF4(e);
 if(isPist(k)&&H.eq&&WEAPONS[H.eq]&&!isPist(H.eq)){if(H.eq2===k)return swapArm();H.eq2=k;renderHUD();secBtn();toast('🔫 '+WEAPONS[k].n+' no coldre. Toque em 🔫 SACAR para usar.','good');return}
 if(H.eq&&H.eq!==k&&isPist(H.eq)!==isPist(k))H.eq2=H.eq;return _heqF4(e)};
ACT.cmdeq=function(e){ACT.hequip({v:e.v});hideModal();if(S.h.eq!==e.v)return;toast('🔫 '+WEAPONS[e.v].n+' na mão.','good')};
function swapArm(){const H=S.h;if(!H)return;ensureSec();if(!H.eq2||!H.own[H.eq2])return toast('Você não tem arma secundária. Compre um revólver ou pistola com o Comendador.','bad');
 if(P.drive||inRoom())return;const a=H.eq,b=H.eq2;AIM.relT=0;const wasAim=P.aim;SWAPPING=1;try{ACT.hequip({v:b})}finally{SWAPPING=0}H.eq2=a&&WEAPONS[a]?a:null;
 if(wasAim)P.aim=1;// troca rápida: continua mirando
 try{ifx('click',0,10)}catch(err){}toast((isPist(b)?'🔫 Sacou: ':'🎯 Pegou: ')+WEAPONS[b].n+' ('+(H.mag[b]||0)+'/'+WEAPONS[b].cap+')');renderHUD();secBtn()}
ACT.swaparm=swapArm;
addEventListener('keydown',e=>{if(e.repeat||!S||!S.h)return;if((e.key==='q'||e.key==='Q')&&e.shiftKey){e.preventDefault();if(!paused())swapArm()}});
const secEl=document.createElement('div');secEl.id='bSec';secEl.className='cb';secEl.style.display='none';document.body.appendChild(secEl);
secEl.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!paused())swapArm()});
let secLast='';function secBtn(){let h='';if(S&&S.h){ensureSec();const H=S.h,ok=!!(H.eq2&&H.own[H.eq2])&&!inRoom()&&!P.drive&&!(typeof LIVE!=='undefined'&&LIVE)&&!(typeof EXPO!=='undefined'&&EXPO);
 if(ok)h=isPist(H.eq)?'🎯<small>RIFLE</small>':'🔫<small>SACAR</small>'}
 if(h!==secLast){secLast=h;secEl.style.display=h?'':'none';if(h)secEl.innerHTML=h;secEl.classList.toggle('on',h.includes('RIFLE'))}}
let secT=0;const _updSec=update;update=function(dt){_updSec(dt);secT-=dt;if(secT<=0){secT=.35;secBtn()}};
// a secundária aparece no coldre enquanto a principal está na mão
const _dpbSec=drawPlayerBase;drawPlayerBase=function(g){_dpbSec(g);const H=S.h;if(!H||!H.eq2||!isPist(H.eq2)||H.eq2===H.eq||!H.own[H.eq2]||P.drive||RMODE===4||inRoom())return;
 const mv=P.moving&&!P.aim,bob=mv?Math.abs(Math.cos(P.ph))*(P.run?1.4:.8):0,aim=P.aim;P.aim=0;try{drawGun(g,P.x,P.y-bob+(P.sneak?2.5:0)-3.2,H.eq2)}catch(err){}finally{P.aim=aim}};
// guia de controles
if(typeof GUIDE!=='undefined'){const c=GUIDE.find(x=>x.t==='Controles');if(c&&!c.h.includes('SACAR'))c.h+='<br><b>Arma secundária:</b> com revólver ou pistola no coldre, toque em 🔫 SACAR (Shift+Q no computador) para trocar com o rifle.'}
