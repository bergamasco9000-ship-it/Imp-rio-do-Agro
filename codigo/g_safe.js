// ===== Proteção do dinheiro: o caixa nunca mais vira "NaN"
// 1) qualquer lançamento inválido é recusado (e anotado para eu achar a causa)
// 2) se o caixa já estiver estragado (save antigo), recupera pela cópia automática do dia + extrato
let MONEY_OK=null,MASKT=0;const NANSEEN={};
const _cashSafe=cash;cash=function(n,l){
 if(typeof n!=='number'||!isFinite(n)){console.error('CASHNAN '+l+' '+n+' '+((new Error().stack||'').split('\n').slice(2,5).join(' | ')));
  try{(S.nanLog=S.nanLog||[]).unshift({d:S.day,l:String(l||'?')});if(S.nanLog.length>10)S.nanLog.length=10}catch(e){}
  const k=String(l||'?');if(!NANSEEN[k]){NANSEEN[k]=1;try{toast('🛡️ Lançamento com erro bloqueado: “'+k+'”. Seu dinheiro está protegido.','bad')}catch(e){}}return}
 return _cashSafe.apply(this,arguments)};
function moneyRecover(){if(!S)return;const bad=v=>typeof v!=='number'||!isFinite(v);if(!bad(S.money)){MONEY_OK=S.money;return}
 let v=null,how='';
 if(MONEY_OK!==null){v=MONEY_OK;how='o último valor certo'}
 if(v===null){try{const raw=localStorage.getItem(SK(SLOT)+'_auto'),A=raw&&JSON.parse(raw);
   if(A&&!bad(A.money)&&A.day<=S.day){let add=0;for(const e of(S.ledger||[]))if(e&&e.d>=A.day&&!bad(e.n))add+=e.n;v=Math.round(A.money+add);how='a cópia automática do dia '+gDay(A.day)+' + o extrato'}}catch(e){}}
 if(v===null){v=0;how='';S.mAsk=1;MASKT=performance.now()+1800}
 S.money=v;MONEY_OK=v;for(const k of['mIn','mOut'])if(bad(S[k]))S[k]=0;
 if(S.ledger)for(const e of S.ledger)if(e&&bad(e.n)){e.n=0;e.l=(e.l||'')+' (erro corrigido)'}
 if(how)setTimeout(()=>{try{toast(how?'🛠️ Seu caixa estava com erro (NaN). Recuperei pelo '+how+': '+R$(v)+'.':'🛠️ Seu caixa estava com erro (NaN) e não deu para recuperar o valor. Ele foi zerado.',how?'good':'bad')}catch(e){}},1500)}
// sem como recuperar: pergunta ao jogador quanto ele tinha (o jogo é dele)
function moneyAsk(){reModal=null;showModal('<h3>🛠️ Caixa com erro</h3><div class="card">O dinheiro da sua fazenda tinha virado “NaN” (um erro de conta) e não ficou nenhuma cópia para recuperar. Já corrigi o erro.</div><div class="dim">Quanto você tinha em caixa, mais ou menos?</div><input id="mfix" type="number" inputmode="numeric" min="0" max="50000000" placeholder="Ex.: 150000" style="width:100%;font-size:20px;margin:6px 0"><div class="btns"><button class="b gold" data-act="mfixok">Confirmar</button><button class="b gray" data-act="mfixzero">Começar do zero</button></div>')}
ACT.mfixzero=function(){delete S.mAsk;hideModal();toast('Caixa começando do zero.');try{save()}catch(e){}};
ACT.mfixok=function(){const el=document.getElementById('mfix'),v=Math.round(+((el&&el.value)||0));if(!isFinite(v)||v<0||v>5e7)return toast('Digite um valor entre 0 e 50.000.000','bad');delete S.mAsk;S.money=v;MONEY_OK=v;S.ledger&&S.ledger.unshift({d:S.day,n:v,l:'Caixa recuperado (erro corrigido)'});hideModal();toast('✅ Caixa recuperado: '+R$(v),'good');try{save()}catch(e){}};
// dívida e financiamentos com erro também são consertados
function debtFix(){if(!S)return;if(typeof S.debt==='number'&&!isFinite(S.debt))S.debt=0;if(Array.isArray(S.fin))for(const f of S.fin){if(!isFinite(f.bal))f.bal=0;if(!isFinite(f.left))f.left=0}}
const _upSafe=update;update=function(dt){moneyRecover();debtFix();if(S&&S.mAsk&&!modalOpen&&performance.now()>=MASKT){MASKT=performance.now()+8000;moneyAsk()}return _upSafe(dt)};
// conserta números faltando em saves antigos (causa comum do NaN)
let SANT=0;function numFix(){if(!S)return;const f=(o,k,d)=>{if(o&&(typeof o[k]!=='number'||!isFinite(o[k])))o[k]=d};
 if(S.up)for(const k in S.up)if(typeof S.up[k]!=='number'||!isFinite(S.up[k]))S.up[k]=0;
 if(S.up&&typeof UPS!=='undefined')for(const k in UPS)f(S.up,k,0);f(S,'feed',0);f(S,'debt',0);
 if(S.crew&&Array.isArray(S.crew.list))for(const c of S.crew.list){f(c,'sal',2500);f(c,'hum',70);f(c,'sk',.5)}
 if(S.crew&&Array.isArray(S.crew.cand))for(const c of S.crew.cand)f(c,'sal',2500);
 if(S.gm&&S.gm.m)f(S.gm.m,'sal',9000);
 if(S.emp&&S.emp.farms)for(const k in S.emp.farms){const m=S.emp.farms[k]&&S.emp.farms[k].mgr;if(m)f(m,'sal',9000)}}
const _upSafe2=update;update=function(dt){if((SANT-=dt)<=0){SANT=5;try{numFix()}catch(e){}}return _upSafe2(dt)};
