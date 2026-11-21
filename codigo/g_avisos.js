// ===== Avisos fora do meio da tela: ficam numa faixa no alto, entre o painel do dinheiro e os botões do topo,
// ===== o mais novo em cima. O rótulo de ação (✋) desce para cima da barra de itens e não cobre mais o personagem.
{const st=document.createElement('style');st.textContent=
 '#toast{left:var(--tL,184px)!important;right:var(--tR,312px)!important;top:var(--tT,6px)!important;bottom:auto!important;flex-direction:column-reverse!important;align-items:center!important;gap:3px!important}'+
 '#toast div{background:rgba(24,15,9,.86)!important;padding:1px 7px!important;font-size:14px!important;line-height:1.08!important;max-width:100%!important;border-radius:6px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.35)}'+
 '#toast div:not(:last-child){opacity:.72}'+
 '.touch #hint{top:auto!important;bottom:54px!important}';
 document.head.appendChild(st)}
function toastBand(){const t=$('toast');if(!t)return;const W=innerWidth;let L=184,R=312,T=6;
 try{const hl=$('hudL'),hr=$('hudR');if(hl&&hl.offsetParent!==null){const b=hl.getBoundingClientRect();if(b.width)L=Math.round(b.right+6)}if(hr){const b=hr.getBoundingClientRect();if(b.width)R=Math.round(W-b.left+6)}
  if(typeof placeBar!=='undefined'&&placeBar.style.display!=='none'){const b=placeBar.getBoundingClientRect();if(b.height&&b.top<60)T=Math.round(b.bottom+4)}}catch(e){}
 if(W-L-R<240){const m=Math.max(6,Math.round((W-Math.min(W-12,420))/2));L=m;R=m}
 t.style.setProperty('--tL',L+'px');t.style.setProperty('--tR',R+'px');t.style.setProperty('--tT',T+'px')}
const _toastAv=toast;toast=function(msg,cls){toastBand();const r=_toastAv.apply(this,arguments);const t=$('toast');if(t&&t.getBoundingClientRect().width<300)while(t.children.length>2)t.firstChild.remove();return r};
addEventListener('resize',()=>setTimeout(toastBand,200));setTimeout(toastBand,1500);
