// ===== Obras: escolher o lugar ficou fácil — mostra onde cabe (verde), gruda no lugar livre mais perto,
// ===== diz o motivo quando não pode, e arbusto/pedra não atrapalham mais (o pedreiro limpa, igual árvore)
let OBX=null;// cache da sessão de posicionamento
function obxBuild(){const clear=new Set();const add=(L)=>{for(const q of L||[])clear.add(Math.floor(q.x/TS)+','+Math.floor(q.y/TS))};add(TREES);add(DECO);if(typeof BUSH!=='undefined')add(BUSH);
 if(typeof BOULD!=='undefined')for(const q of BOULD)clear.add(q.x+','+q.y);OBX={clear,key:'',zones:null,zt:null};return OBX}
function siteWhy(t,x,y){const B=BT[t];if(!B)return 'tipo';const pw=pasW();if(!OBX)obxBuild();
 if(rectHit(x,y,B.w,B.h,PAS.x-1,PAS.y-1,PAS.x+pw,PAS.y+PAS.h))return 'pasto';
 if(rectHit(x,y,B.w,B.h,FULLF[0]-1,FULLF[1]-1,FULLF[2]+1,FULLF[3]+1))return 'lavoura';
 if(rectHit(x,y,B.w,B.h,RUN.x0-1,RUN.y0-1,RUN.x1+1,RUN.y1+1))return 'galinheiro';
 if(rectHit(x,y,B.w,B.h,CUR.x0-1,CUR.y0-1,CUR.x1+2,CUR.y1+1))return 'curral';
 if(rectHit(x,y,B.w,B.h,21,39,25,46))return 'cocho';
 for(const b of BLD)if(rectHit(x,y,B.w,B.h,b.x-1,b.y-1,b.x+b.w,b.y+b.h+1))return 'predio';
 for(const o of S.blds.concat(S.obra?[S.obra]:[])){const q=BT[o.type];if(rectHit(x,y,B.w,B.h,o.x-1,o.y-1,o.x+q.w,o.y+q.h))return 'obra'}
 for(let yy=y;yy<y+B.h;yy++)for(let xx=x;xx<x+B.w;xx++){if(!ownLot(xx,yy))return 'lote';const i=ti(xx,yy);if(G[i]===2||G[i]===3)return 'estrada';if(FEN[i])return 'cerca';if(SOL[i]&&!OBX.clear.has(xx+','+yy))return 'objeto'}
 return ''}
siteOK=function(t,x,y){return siteWhy(t,x,y)===''};
const WHYTXT={pasto:'em cima do pasto',lavoura:'em cima da lavoura',galinheiro:'no galinheiro',curral:'no curral',cocho:'colado no cocho',predio:'colado em outro prédio (deixe 1 quadrinho de folga)',obra:'em cima de outra construção',lote:'fora do seu terreno — compre mais terra na Casa Agro',estrada:'em cima da estrada/caminho',cerca:'em cima de cerca',objeto:'em cima de algum objeto'};
// todos os lugares onde cabe (calcula uma vez por obra)
function obxZones(t){if(!OBX)obxBuild();const k=t+'|'+S.up.land+'|'+S.blds.length+'|'+Object.keys(S.lots).join();if(OBX.key===k)return OBX;OBX.key=k;
 const B=BT[t],tiles=new Set(),anchors=[];for(const l of LOTS){if(!S.lots[l.id])continue;for(let y=l.y0;y<=l.y1;y++)for(let x=l.x0;x<=l.x1;x++)if(siteOK(t,x,y)){anchors.push([x,y]);for(let yy=y;yy<y+B.h;yy++)for(let xx=x;xx<x+B.w;xx++)tiles.add(xx+','+yy)}}
 OBX.zones=tiles;OBX.anchors=anchors;return OBX}
const _spObx=startPlace;startPlace=function(t){OBX=null;const r=_spObx.apply(this,arguments);if(PLACE){obxBuild();obxZones(t);if(!OBX.anchors.length)toast('😕 Não cabe em lugar nenhum do seu terreno. Compre mais terra na Casa Agro.','bad')}return r};
// gruda no lugar livre mais perto (até 6 quadrinhos) e mostra o motivo
let obxLast='';const _updObx=update;update=function(dt){_updObx(dt);if(!PLACE)return;const Z=obxZones(PLACE.t);
 const why=siteWhy(PLACE.t,PLACE.x,PLACE.y);PLACE.why=why;PLACE.snap=0;
 if(why){let best=null,bd=1e9;for(const[ax,ay]of Z.anchors){const d=Math.abs(ax-PLACE.x)+Math.abs(ay-PLACE.y);if(d<bd&&d<=10){bd=d;best=[ax,ay]}}if(best){PLACE.x=best[0];PLACE.y=best[1];PLACE.ok=true;PLACE.snap=1}}
 const el=document.getElementById('pwhy');if(el){const txt=PLACE.ok?(PLACE.snap?'✅ Ajustado para o lugar livre':'✅ Pode construir aqui'):'❌ '+(WHYTXT[why]||why);if(txt!==obxLast){obxLast=txt;el.textContent=txt;el.style.color=PLACE.ok?'#7ad04a':'#ff8a6a'}}};
const _prObx=placeRender;placeRender=function(){_prObx.apply(this,arguments);obxLast='';if(!document.getElementById('pwhy')){const d=document.createElement('div');d.id='pwhy';d.style.cssText='font:13px sans-serif;margin-top:2px';placeBar.appendChild(d);
 const nb=document.createElement('button');nb.className='b';nb.style.cssText='font-size:13px;padding:1px 6px;margin-top:2px';nb.textContent='📍 Lugar livre mais perto';nb.addEventListener('click',e=>{e.stopPropagation();obxNear()});const row=placeBar.querySelector('[data-pc="no"]');(row?row.parentNode:placeBar).appendChild(nb)}};
function obxNear(){if(!PLACE)return;const Z=obxZones(PLACE.t),B=BT[PLACE.t],px=P.x/TS,py=P.y/TS;let best=null,bd=1e9;for(const[ax,ay]of Z.anchors){const d=Math.hypot(ax+B.w/2-px,ay+B.h/2-py);if(d<bd){bd=d;best=[ax,ay]}}
 if(!best)return toast('Não cabe em lugar nenhum do seu terreno. Compre mais terra na Casa Agro.','bad');TIPT={f:()=>PLACE?{x:(best[0]+B.w/2)*TS,y:(best[1]+B.h+1)*TS,h:'lugar livre'}:null,until:Date.now()+300000};toast('📍 Siga a seta até o lugar livre ('+Math.round(bd)+' passos).','good')}
// sombra verde onde cabe
const _dgObx=drawGhost;drawGhost=function(g){if(PLACE){const Z=obxZones(PLACE.t);g.fillStyle='rgba(90,230,90,.16)';const x0=Math.floor(CX/TS)-2,y0=Math.floor(CY/TS)-2,x1=x0+Math.ceil(VW/PS/TS)+60,y1=y0+Math.ceil(VH/PS/TS)+40;
 for(const k of Z.zones){const[xx,yy]=k.split(',').map(Number);if(xx>=x0&&xx<=x1&&yy>=y0&&yy<=y1)g.fillRect(xx*TS,yy*TS,TS,TS)}}return _dgObx(g)};
// na hora de construir, o pedreiro também tira arbusto e pedra
const _cpObx=confirmPlace;confirmPlace=function(){if(PLACE&&PLACE.ok){const B=BT[PLACE.t],inF=(tx,ty)=>tx>=PLACE.x&&tx<PLACE.x+B.w&&ty>=PLACE.y&&ty<PLACE.y+B.h;
  if(typeof BUSH!=='undefined')for(let i=BUSH.length-1;i>=0;i--)if(inF(Math.floor(BUSH[i].x/TS),Math.floor(BUSH[i].y/TS)))BUSH.splice(i,1);
  if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--)if(inF(BOULD[i].x,BOULD[i].y))BOULD.splice(i,1)}
 const r=_cpObx.apply(this,arguments);if(!PLACE)OBX=null;return r};
const _cnObx=cancelPlace;cancelPlace=function(){OBX=null;return _cnObx.apply(this,arguments)};
// painel compacto no topo (antes ficava no meio da tela, em cima do lugar da obra)
placeBar.style.cssText='position:fixed;left:186px;top:4px;z-index:9;display:none;background:rgba(30,18,10,.92);border:2px solid #e0a431;border-radius:8px;padding:4px 8px;font:15px "VT323",monospace;color:#f3e6c8;text-align:center;max-width:min(330px,calc(100vw - 520px));min-width:250px;line-height:1.15';
{const st=document.createElement('style');st.textContent='#pwhy{font-size:13px}';document.head.appendChild(st)}
const _prObx2=placeRender;placeRender=function(){_prObx2.apply(this,arguments);for(const b of placeBar.querySelectorAll('button')){b.style.fontSize='13px';b.style.padding='1px 6px'}placeBar.querySelectorAll('br').forEach((br,i)=>{if(i===0)br.replaceWith(document.createTextNode(' '))})};
