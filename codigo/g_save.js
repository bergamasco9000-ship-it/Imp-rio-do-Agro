// ===== Opções: som (volumes) e BACKUP do save (arquivo, compartilhar, código, restaurar, lembrete, cópia automática)
TABS.push(['cfg','⚙️ Opções']);
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}// pede ao navegador para não apagar os dados do jogo
const _svBk=save;save=function(){if(window._noSave)return;return _svBk.apply(this,arguments)};
const gDay=d=>Math.max(1,(d||0)-269);
const bkPack=()=>JSON.stringify({app:'imperio-do-agro',fmt:1,em:new Date().toISOString(),fazenda:S.farmName||'',dia:S.day,save:S});
const bkName=()=>'imperio-do-agro_'+String(S.farmName||'fazenda').normalize('NFD').replace(/[^\w]+/g,'-').toLowerCase()+'_dia'+gDay(S.day)+'.json';
function bkParse(txt){txt=(txt||'').trim();let o=null;
 try{o=JSON.parse(txt)}catch(e){try{o=JSON.parse(decodeURIComponent(escape(atob(txt))))}catch(e2){}}
 if(o&&o.app==='imperio-do-agro'&&o.save)o=o.save;return o&&o.v===2?o:null}
function bkMark(){S.bkAt=Date.now();save()}
const bkAgo=()=>{if(!S.bkAt)return 'nunca';const d=Math.floor((Date.now()-S.bkAt)/864e5);return d<=0?'hoje':d===1?'ontem':'há '+d+' dias'};
function pCfg(){const sl=(k,ic,n)=>'<div class="row" style="align-items:center;gap:8px"><span style="min-width:120px">'+ic+' '+n+'</span><input type="range" min="0" max="100" value="'+Math.round(SOM[k]*100)+'" style="flex:1" oninput="somSet(\''+k+'\',this.value)"><span class="dim" id="sv_'+k+'" style="min-width:36px;text-align:right">'+Math.round(SOM[k]*100)+'%</span></div>';
 const trk=MUS.trk&&MTRK[MUS.trk]?MTRK[MUS.trk].n:'—';
 return '<div class="card"><div class="row"><b>🔊 Som</b><button class="b '+(SOM.on?'gold':'gray')+'" data-act="somtg">'+(SOM.on?'Ligado':'Desligado')+'</button></div>'+sl('mus','🎻','Música')+sl('sfx','💥','Efeitos')+sl('amb','🐦','Ambiente')+'<div class="dim" style="font-size:12px">Tocando agora: <b>'+trk+'</b> · viola caipira de dia, moda à noite, forró na vila.</div></div>'
 +'<div class="card"><div class="row"><b>💾 Backup do progresso</b><span class="'+(S.bkAt&&Date.now()-S.bkAt<7*864e5?'grn':'red')+'">Último: '+bkAgo()+'</span></div>'
 +'<div class="dim">Seu jogo fica salvo só neste celular. Se limpar os dados do navegador, trocar de celular ou desinstalar, perde tudo. Guarde um backup no WhatsApp, Drive ou e-mail.</div>'
 +'<div class="btns" style="flex-wrap:wrap">'+(navigator.canShare?'<button class="b gold" data-act="bkshare">📤 Enviar backup (WhatsApp, Drive…)</button>':'')+'<button class="b gold" data-act="bkfile">💾 Baixar arquivo</button><button class="b" data-act="bkcode">📋 Copiar código</button><button class="b" data-act="bkrest">📥 Restaurar backup</button></div></div>'}
window.somSet=function(k,v){SOM[k]=v/100;somSave();aud();somApply();const e=document.getElementById('sv_'+k);if(e)e.textContent=v+'%'};
const _rpCfg=renderPanel;renderPanel=function(){if(tab!=='cfg')return _rpCfg();const P2=$('panel');try{P2.innerHTML=pCfg()}catch(err){P2.innerHTML='<div class="card red">'+err.message+'</div>'}};
const _stgCfg=ACT.somtg;ACT.somtg=function(){_stgCfg();if(typeof tab!=='undefined'&&tab==='cfg'&&$('menu')&&$('menu').style.display!=='none')renderPanel()};
Object.assign(ACT,{
 bkfile(){try{save();const b=new Blob([bkPack()],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=bkName();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);bkMark();toast('💾 Backup salvo na pasta Downloads: '+bkName(),'good');renderPanel()}catch(e){toast('Não consegui baixar. Use “Copiar código”.','bad')}},
 async bkshare(){try{save();const f=new File([bkPack()],bkName(),{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Backup Império do Agro',text:'Backup da '+(S.farmName||'fazenda')+' (dia '+gDay(S.day)+')'});bkMark();toast('📤 Backup enviado!','good');renderPanel()}else ACT.bkfile()}catch(e){if(e&&e.name!=='AbortError')ACT.bkfile()}},
 bkcode(){save();let code='';try{code=btoa(unescape(encodeURIComponent(JSON.stringify(S))))}catch(e){}
  showModal('<h3>📋 Código de backup</h3><div class="dim">Copie e cole num lugar seguro (bloco de notas, WhatsApp para você mesmo, e-mail). Para recuperar: ☰ › Opções › Restaurar.</div><textarea id="bkta" rows="6" style="width:100%;font-size:11px" readonly>'+code+'</textarea><div class="btns"><button class="b gold" data-act="bkcopy">Copiar</button><button class="b gray" data-act="close">Fechar</button></div>')},
 bkcopy(){const ta=document.getElementById('bkta');ta.select();try{navigator.clipboard.writeText(ta.value)}catch(e){document.execCommand('copy')}bkMark();toast('📋 Código copiado! Cole num lugar seguro.','good')},
 bkrest(){showModal('<h3>📥 Restaurar backup</h3><div class="card red">Isso SUBSTITUI o progresso atual deste mundo pelo do backup.</div><div class="dim">Escolha o arquivo de backup (.json):</div><input type="file" id="bkfi" accept=".json,application/json,text/plain" style="margin:6px 0;width:100%"><div class="dim">…ou cole o código:</div><textarea id="bkta" rows="4" style="width:100%;font-size:11px"></textarea><div class="btns"><button class="b gold" data-act="bkdo">Restaurar</button><button class="b gray" data-act="close">Cancelar</button></div>');
  document.getElementById('bkfi').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{document.getElementById('bkta').value=r.result};r.readAsText(f)}},
 bkdo(){const o=bkParse(document.getElementById('bkta').value);if(!o)return toast('Arquivo ou código inválido.','bad');
  showModal('<h3>📥 Confirmar</h3><div class="card">Backup da <b>'+(o.farmName||'fazenda')+'</b>, dia '+gDay(o.day)+', com '+R$(Math.round(o.money||0))+' em caixa e '+((o.herd||[]).length)+' animais.</div><div class="btns"><button class="b gold" data-act="bkok">Sim, restaurar</button><button class="b gray" data-act="close">Cancelar</button></div>');window._bkO=o},
 bkok(){const o=window._bkO;if(!o)return;try{o.bkAt=Date.now();window._noSave=1;localStorage.setItem(SK(SLOT),JSON.stringify(o));location.reload()}catch(e){toast('Erro ao restaurar: '+e.message,'bad')}}});
// cópia automática diária dentro do aparelho (protege contra save corrompido) + lembrete de backup
const _hdBk=hookDay;hookDay=function(){_hdBk.apply(this,arguments);try{if(SLOT&&S)localStorage.setItem(SK(SLOT)+'_auto',JSON.stringify(S))}catch(e){}};
let bkWarned=0,bkT=30;const _updBk=update;update=function(dt){_updBk(dt);if(!S||bkWarned)return;bkT-=dt;if(bkT>0)return;bkT=60;
 if(S.day<3)return;if(!S.bkAt||Date.now()-S.bkAt>5*864e5){bkWarned=1;toast('💾 Faz tempo que você não guarda um backup. Vá em ☰ › ⚙️ Opções › Enviar backup, para não perder a fazenda.','bad')}};
// tela inicial: restaurar de arquivo também
const _trBk=tRender;tRender=function(){_trBk.apply(this,arguments);try{if(TMODE==='imp'){const ta=document.getElementById('tcode');if(ta&&!document.getElementById('tfile')){const i=document.createElement('input');i.type='file';i.id='tfile';i.accept='.json,application/json,text/plain';i.style.cssText='margin:6px 0;width:100%';
   i.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const o=bkParse(r.result);ta.value=o?btoa(unescape(encodeURIComponent(JSON.stringify(o)))):r.result};r.readAsText(f)};ta.parentNode.insertBefore(i,ta)}}}catch(e){}};
