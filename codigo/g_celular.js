// ===== 📱 CELULAR DO FAZENDEIRO: mensagens (zap), cotações, agenda, leilões, fazendas/gerentes — o mundo conversa com você
const CELC={com:{n:'Comendador',ic:'🎩',c:'#3a1230'},vet:{n:'Dra. Lúcia · veterinária',ic:'🩺',c:'#2a6a5a'},ademar:{n:'Ademar · Leilão da Vila',ic:'🔨',c:'#7a1f1f'},
 elite:{n:'Leilões Estrelas do Agro',ic:'⭐',c:'#8a6a1a'},expo:{n:'Parque de Exposições',ic:'🏆',c:'#2f6a3a'},news:{n:'Agro Notícias',ic:'📰',c:'#2a3a6a'},
 banco:{n:'Banco da Vila',ic:'🏦',c:'#2f4a7a'},mae:{n:'Mãe',ic:'👩',c:'#a84a6a'},tonhao:{n:'Tonhão do Bar',ic:'🍺',c:'#8a5a1a'},rival:{n:'Rivais',ic:'🤠',c:'#5a3a22'}};
function ensureCel(){if(!S.cel)S.cel={m:[],nid:1,sick:0,usd:5.2,soja:128,hist:{arr:[],usd:[],soja:[]},seen:{}};return S.cel}
function celContact(k){if(CELC[k])return CELC[k];if(k.startsWith('g_')&&typeof gerContact==='function')return gerContact(k);if(k.startsWith('rv')){const i=+k.slice(2);return{n:(RIV[i]||['',''])[1]+' · '+(RIV[i]||[''])[0],ic:'🤠',c:'#5a3a22'}}return{n:k,ic:'💬',c:'#444'}}
function celMsg(c,t,act,quiet){if(!S)return;const C=ensureCel();C.m.push({id:C.nid++,c,t,d:S.day,h:Math.floor(S.t*24*60),r:0,act:act||null});if(C.m.length>220)C.m.splice(0,C.m.length-220);
 celBadge();if(!quiet){toast('📱 '+celContact(c).ic+' '+celContact(c).n+': '+t.slice(0,70)+(t.length>70?'…':''));try{ifx('ping',0,600)}catch(e){}try{navigator.vibrate&&navigator.vibrate(40)}catch(e){}}}
if(typeof FX!=='undefined')FX.ping=()=>{const t=AC.currentTime;sfxTone(1568,t,.12,.06);sfxTone(2093,t+.09,.18,.05)};
const celUnread=()=>S&&S.cel?S.cel.m.filter(m=>!m.r).length:0;
function celBadge(){const b=document.querySelector('[data-act="cel"]');if(!b)return;const n=celUnread();b.innerHTML='📱'+(n?'<span style="position:absolute;top:-4px;right:-4px;background:#d83a3a;color:#fff;border-radius:9px;font-size:8px;padding:2px 4px;font-family:sans-serif">'+(n>99?'99+':n)+'</span>':'');b.style.position='relative'}
const _rhCel=renderHUD;renderHUD=function(){_rhCel.apply(this,arguments);const r=document.getElementById('hudR');if(!r)return;if(!r.querySelector('[data-act="cel"]')){const b=document.createElement('button');b.dataset.act='cel';const m=r.querySelector('[data-act="somtg"]')||r.querySelector('[data-act="menu"]');r.insertBefore(b,m)}celBadge()};
// ---------- tela do celular
const hhmm=m=>String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const dTxt=d=>d===S.day?'hoje':d===S.day-1?'ontem':(d%30+1)+'/'+MONTHS[Math.floor((d%360)/30)];
let CELAPP='home',CELCHAT=null;
function celFrame(title,body,back){const now=hhmm(Math.floor(S.t*24*60));
 return '<div style="background:#0c0c10;border-radius:22px;padding:8px 8px 10px;border:3px solid #2a2a30;box-shadow:0 0 0 2px #000,inset 0 0 0 1px #3a3a44;max-width:520px;margin:-6px auto">'
 +'<div style="display:flex;justify-content:space-between;color:#ddd;font:11px sans-serif;padding:0 10px 4px"><b>'+now+'</b><span style="width:60px;height:10px;background:#000;border-radius:6px"></span><span>📶 🔋'+(70+S.day%30)+'%</span></div>'
 +'<div class="celbody" style="background:linear-gradient(#f4efe4,#e8e0cf);border-radius:14px;min-height:240px;max-height:62vh;overflow:auto;padding:8px;color:#2a1a10">'
 +(back?'<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><button class="b gray" data-act="celapp" data-v="'+back+'" style="padding:4px 8px">◀</button><b style="font:bold 15px sans-serif">'+title+'</b></div>':'')+body+'</div>'
 +'<div style="display:flex;justify-content:center;gap:40px;padding-top:7px"><button class="b gray" data-act="celapp" data-v="home" style="padding:3px 14px;border-radius:10px">⬤</button><button class="b gray" data-act="close" style="padding:3px 10px;border-radius:10px">Guardar</button></div></div>'}
function celHome(){const n=celUnread(),apps=[['chats','💬','Mensagens',n],['cot','📈','Cotações'],['agenda','📅','Agenda'],['leiloes','🔨','Leilões'],['expo','🏆','Exposição'],['faz','🏢','Fazendas']];
 return celFrame('', '<div style="text-align:center;font:bold 13px sans-serif;color:#5a4a3a;margin:4px 0 10px">'+(S.farmName||'Fazenda Boi de Ouro')+'</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'
 +apps.map(([k,ic,nm,b])=>'<div data-act="celapp" data-v="'+k+'" style="text-align:center;cursor:pointer;position:relative"><div style="font-size:30px;background:#fff;border-radius:14px;padding:8px 0;box-shadow:0 2px 4px rgba(0,0,0,.2)">'+ic+'</div><div style="font:12px sans-serif;margin-top:3px">'+nm+'</div>'+(b?'<span style="position:absolute;top:-4px;right:12px;background:#d83a3a;color:#fff;border-radius:9px;font:bold 11px sans-serif;padding:1px 6px">'+b+'</span>':'')+'</div>').join('')+'</div>'
 +'<div style="margin-top:12px;font:12px sans-serif;color:#6a5a4a;text-align:center">Toque num app. As mensagens chegam sozinhas durante o jogo.</div>')}
function celChats(){const C=ensureCel(),by={};for(const m of C.m){by[m.c]=m}const L=Object.values(by).sort((a,b)=>b.id-a.id);
 return celFrame('Mensagens',L.length?L.map(m=>{const k=celContact(m.c),un=C.m.filter(x=>x.c===m.c&&!x.r).length;return '<div data-act="celchat" data-v="'+m.c+'" style="display:flex;gap:8px;align-items:center;padding:7px 4px;border-bottom:1px solid #d8ccb8;cursor:pointer"><div style="width:38px;height:38px;border-radius:50%;background:'+k.c+';display:flex;align-items:center;justify-content:center;font-size:20px;flex:none">'+k.ic+'</div><div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><b style="font:bold 13px sans-serif">'+k.n+'</b><span style="font:11px sans-serif;color:'+(un?'#1a9a4a':'#8a7a6a')+'">'+dTxt(m.d)+'</span></div><div style="font:12px sans-serif;color:#5a4a3a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+m.t+'</div></div>'+(un?'<span style="background:#1a9a4a;color:#fff;border-radius:9px;font:bold 11px sans-serif;padding:1px 6px">'+un+'</span>':'')+'</div>'}).join(''):'<div class="dim">Nenhuma mensagem ainda.</div>','home')}
function celChat(c){const C=ensureCel(),k=celContact(c),L=C.m.filter(m=>m.c===c);L.forEach(m=>m.r=1);celBadge();let lastD=-1;
 return celFrame(k.ic+' '+k.n,'<div style="background:#e6ddc8;border-radius:10px;padding:6px">'+L.slice(-40).map(m=>{let s='';if(m.d!==lastD){lastD=m.d;s+='<div style="text-align:center;font:11px sans-serif;color:#7a6a5a;margin:6px 0">'+dTxt(m.d)+'</div>'}
  return s+'<div style="background:#fff;border-radius:2px 12px 12px 12px;padding:6px 9px;margin:4px 40px 4px 0;box-shadow:0 1px 1px rgba(0,0,0,.15);font:14px sans-serif;line-height:1.3">'+m.t+(m.act?'<div style="margin-top:5px"><button class="b gold" data-act="'+m.act.a+'" data-v="'+(m.act.v||'')+'" style="padding:4px 8px">'+m.act.l+'</button></div>':'')+'<div style="text-align:right;font:10px sans-serif;color:#9a8a7a">'+hhmm(m.h)+' ✓✓</div></div>'}).join('')+'</div>','chats')}
function celCot(){const C=ensureCel(),a=Math.round(arroba('nelore')),H=C.hist;const sp=(arr)=>{if(arr.length<2)return '';const mn=Math.min(...arr),mx=Math.max(...arr),w=120,h=28;return '<svg width="'+w+'" height="'+h+'" style="vertical-align:middle"><polyline fill="none" stroke="'+(arr[arr.length-1]>=arr[0]?'#1a9a4a':'#c83a2a')+'" stroke-width="2" points="'+arr.map((v,i)=>(i/(arr.length-1)*w).toFixed(1)+','+(h-2-(mx>mn?(v-mn)/(mx-mn):.5)*(h-4)).toFixed(1)).join(' ')+'"/></svg>'};
 const row=(n,v,arr,u)=>{const ch=arr.length>1?(arr[arr.length-1]/arr[0]-1)*100:0;return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 2px;border-bottom:1px solid #d8ccb8"><div><b style="font:bold 13px sans-serif">'+n+'</b><div style="font:12px sans-serif;color:#6a5a4a">'+u+'</div></div>'+sp(arr)+'<div style="text-align:right"><b style="font:bold 14px sans-serif">'+v+'</b><div style="font:12px sans-serif;color:'+(ch>=0?'#1a9a4a':'#c83a2a')+'">'+(ch>=0?'▲':'▼')+' '+Math.abs(ch).toFixed(1).replace('.',',')+'%</div></div></div>'};
 let h=row('🐂 Boi gordo','R$ '+a,H.arr,'arroba (15 kg) · Nelore')+row('🐮 Bezerro desmamado',R$(Math.round(a*7.8)),H.arr.map(x=>x*7.8),'cabeça · 210 kg')+row('🌱 Soja','R$ '+C.soja.toFixed(2).replace('.',','),H.soja,'saca de 60 kg')+row('💵 Dólar','R$ '+C.usd.toFixed(2).replace('.',','),H.usd,'comercial');
 if(typeof STK!=='undefined'&&S.bk&&S.bk.p)h+='<div style="font:bold 12px sans-serif;margin:8px 0 2px">📊 Bolsa</div>'+STK.slice(0,6).map(s=>'<div style="display:flex;justify-content:space-between;font:13px sans-serif;padding:3px 2px"><span>'+s.id+'</span><b>R$ '+(S.bk.p[s.id]||0).toFixed(2).replace('.',',')+'</b></div>').join('');
 return celFrame('Cotações',h+'<div style="font:11px sans-serif;color:#8a7a6a;margin-top:6px">Atualiza todo dia de manhã.</div>','home')}
function celAgenda(){const L=[];for(let d=S.day;d<S.day+35;d++){const dm=d%30+1,mo=Math.floor((d%360)/30),tag=dm+'/'+MONTHS[mo];
  if(d%7===0)L.push([d,tag,'🔨 Leilão semanal abre (3 dias) · Leilão da Vila']);if(dm===15)L.push([d,tag,'⭐ Leilão Estrelas do Agro · 20h · Salão de Gala']);if(d%90===45)L.push([d,tag,'🏆 Exposição Agropecuária (5 dias) · Arena']);
  if(dm===25)L.push([d,tag,'🐂 Rodeio e laço · Arena']);if(typeof FESTAS!=='undefined')for(const k in FESTAS){const f=FESTAS[k];if(mo===f.m&&f.d[0]===dm)L.push([d,tag,f.ic+' '+f.n])}
  if(S.com&&S.com.loan&&d%30===1)L.push([d,tag,'💰 Parcela do Comendador ('+R$(S.com.loan.parc)+')']);if(S.com&&S.com.ct&&d===S.com.ct.due)L.push([d,tag,'🐂 Prazo do contrato do Comendador ('+S.com.ct.n+' bois)'])}
 return celFrame('Agenda',L.map(([d,t,x])=>'<div style="display:flex;gap:8px;padding:6px 2px;border-bottom:1px solid #d8ccb8;font:13px sans-serif"><b style="min-width:56px;color:'+(d===S.day?'#c83a2a':'#5a4a3a')+'">'+(d===S.day?'HOJE':t)+'</b><span>'+x+'</span></div>').join(''),'home')}
function celLeiloes(){const A=S.aucOpen,dm=S.day%30+1,nx=(15-dm+30)%30,inv=typeof eliteInvited==='function'&&eliteInvited();
 let h='<div class="card"><b>🔨 Leilão da Vila (semanal)</b><div class="dim">'+(A?(A.type==='elite'?'👑 ELITE ':'')+'Aberto! Fecha em '+(A.until-S.day)+' dia(s). Vá ao prédio do leilão, no centro, e sente na arquibancada.':'Abre todo 7º dia, por 3 dias.')+'</div>'+(A?'<button class="b gold" data-act="celgo" data-v="leilao">📍 Me mostre o caminho</button>':'')+'</div>';
 h+='<div class="card"><b>⭐ Leilão Estrelas do Agro</b><div class="dim">As melhores genéticas do país, no Salão de Gala ao lado da Arena. Todo dia 15, às 20h, traje de gala. '+(nx===0?'<b class="gold">É HOJE!</b>':'Faltam '+nx+' dia(s).')+'</div><div>'+(inv?'<span class="grn">✅ Você está na lista de convidados.</span>':'<span class="red">🔒 Só convidados: reputação 50+ ou patrimônio de R$ 5 milhões.</span>')+'</div>'+(nx===0?'<button class="b gold" data-act="celgo" data-v="elite">📍 Me mostre o caminho</button>':'')+'</div>';
 return celFrame('Leilões',h,'home')}
function celExpo(){let h='';const ex=!!S.expo,next=(()=>{for(let d=S.day;d<S.day+100;d++)if(d%90===45)return d;return S.day})();
 h+='<div class="card"><b>🏆 Exposição Agropecuária</b><div class="dim">'+(ex?'<b class="gold">ABERTA</b> por mais '+(S.expo.until-S.day)+' dia(s). O julgamento ao vivo é na Arena, ao sul da vila.':'Próxima em '+(next-S.day)+' dia(s) (dia '+(next%30+1)+'/'+MONTHS[Math.floor((next%360)/30)]+').')+'</div>'+(ex?'<button class="b gold" data-act="celgo" data-v="arena">📍 Me mostre o caminho</button>':'')+'</div>';
 const T=typeof ensureF==='function'?ensureF().trof:[];h+='<div class="card"><b>Seus troféus ('+T.length+')</b>'+(T.length?T.slice(0,8).map(t=>'<div style="font:13px sans-serif">'+t.ic+' '+t.n+'</div>').join(''):'<div class="dim">Nenhum ainda.</div>')+'</div>';
 const champs=S.herd.filter(a=>a.title);if(champs.length)h+='<div class="card"><b>🎗️ Seus campeões</b>'+champs.slice(0,8).map(a=>'<div style="font:13px sans-serif">'+a.name+' · '+BREEDS[a.breed].n+' · gen '+a.gen+(a.titles?' · '+a.titles+'×':'')+'</div>').join('')+'</div>';
 return celFrame('Exposição',h,'home')}
function celFaz(){return celFrame('Fazendas',typeof gerFazHTML==='function'?gerFazHTML():'<div class="dim">Em breve.</div>','home')}
function celOpen(app,v){if(!S)return;CELAPP=app||'home';reModal=null;let h;
 if(CELAPP==='chats')h=celChats();else if(CELAPP==='chat')h=celChat(v||CELCHAT);else if(CELAPP==='cot')h=celCot();else if(CELAPP==='agenda')h=celAgenda();else if(CELAPP==='leiloes')h=celLeiloes();else if(CELAPP==='expo')h=celExpo();else if(CELAPP==='faz')h=celFaz();else h=celHome();
 showModal(h);reModal=()=>celOpen(CELAPP,CELCHAT)}
Object.assign(ACT,{cel(){celOpen('home')},celapp(e){celOpen(e.v)},celchat(e){CELCHAT=e.v;celOpen('chat',e.v)},
 celgo(e){const T={leilao:()=>bDoor('leilao'),elite:()=>bDoor('elite'),arena:()=>({x:106*TS+16,y:69*TS+4}),com:()=>bDoor('bar'),vet:()=>bDoor('vet')}[e.v];const p=T&&T();if(!p)return;CELWP={x:p.x,y:p.y,n:{leilao:'Leilão da Vila',elite:'Salão de Gala',arena:'Arena',com:'Bar do Tonhão',vet:'Veterinária'}[e.v]||''};hideModal();toast('📍 Siga a seta até '+CELWP.n)},
 celherd(){hideModal();openMenu('herd')}});
// ---------- seta de destino (GPS)
let CELWP=null;const celArrow=document.createElement('div');celArrow.id='celarrow';celArrow.style.cssText='position:fixed;z-index:7;pointer-events:none;display:none;font:bold 11px sans-serif;color:#fff;text-shadow:0 1px 2px #000';document.body.appendChild(celArrow);
function celArrowStep(){if(!CELWP||!S||inRoom()){celArrow.style.display='none';return}const d=Math.hypot(CELWP.x-P.x,CELWP.y-P.y);if(d<40){CELWP=null;celArrow.style.display='none';return}
 const r=CV.getBoundingClientRect(),s=r.width/CV.width*PS,sx=r.left+(CELWP.x-CX)*s,sy=r.top+(CELWP.y-CY)*s,cx=r.left+r.width/2,cy=r.top+r.height/2,on=sx>r.left+30&&sx<r.right-30&&sy>r.top+60&&sy<r.bottom-60;
 const ang=Math.atan2(sy-cy,sx-cx),R2=Math.min(r.width,r.height)/2-50,ax=on?sx:cx+Math.cos(ang)*Math.min(R2*1.6,r.width/2-40),ay=on?sy-40-Math.abs(Math.sin(frame/8))*6:cy+Math.sin(ang)*Math.min(R2,r.height/2-50);
 celArrow.style.display='block';celArrow.style.left=(ax-30)+'px';celArrow.style.top=(ay-20)+'px';celArrow.innerHTML='<div style="width:60px;text-align:center"><div style="font-size:26px;transform:rotate('+(on?90:ang*180/Math.PI)+'deg);color:#ffd84a">➤</div>'+CELWP.n+'<br>'+Math.round(d/TS)+' m</div>'}
// ---------- mensagens automáticas do mundo
const NEWS_UP=['Exportação de carne bate recorde e anima o mercado do boi.','Frigoríficos disputam boiada e arroba sobe.','Oferta curta de boi gordo no Centro-Oeste puxa o preço.','China amplia compra de carne brasileira.'];
const NEWS_DN=['Escalas cheias nos frigoríficos derrubam a arroba.','Chuvas aumentam a oferta de boi e o preço recua.','Exportação desacelera e mercado do boi fica pressionado.'];
const NEWS_GEN=['Safra de soja deve ser recorde, diz associação.','Leilões de genética movimentam milhões no interior.','Pesquisa: pasto bem manejado dobra a lotação por hectare.','Tecnologia de rastreamento de gado chega às pequenas propriedades.','Preço do milho sobe e encarece o confinamento.'];
const MAE=['Filho, tá se alimentando direito? Não vai ficar só no churrasco, hein.','Vi na TV que tá frio aí. Leva um casaco!','Tô orgulhosa de você, viu? Seu pai ia gostar de ver essa fazenda.','Quando vem me visitar? Faço aquele bolo de fubá.','Não esquece de rezar antes de dormir. Beijo!'];
const TONH=['Hoje tem sinuca valendo cerveja. Aparece aí, patrão!','Chegou cachaça nova de alambique. Tá uma beleza.','Teve briga no bar ontem, mas já tá tudo calmo. Hehe.'];
let celLastMkt=null;
const _hdCel=hookDay;hookDay=function(){_hdCel.apply(this,arguments);try{celDay()}catch(e){console.error(e)}};
function celDay(){const C=ensureCel(),dm=S.day%30+1;
 // cotações
 C.usd=clamp(C.usd*(1+rnd(-.012,.012)),4.2,6.6);C.soja=clamp(C.soja*(1+rnd(-.018,.018)),95,170);
 C.hist.arr.push(Math.round(arroba('nelore')));C.hist.usd.push(+C.usd.toFixed(2));C.hist.soja.push(+C.soja.toFixed(2));for(const k in C.hist)if(C.hist[k].length>14)C.hist[k].shift();
 const ar=C.hist.arr,ch=ar.length>1?ar[ar.length-1]/ar[ar.length-2]-1:0;
 if(Math.abs(ch)>.012||Math.random()<.18)celMsg('news',(ch>.012?pick(NEWS_UP):ch<-.012?pick(NEWS_DN):pick(NEWS_GEN))+' Arroba hoje: R$ '+ar[ar.length-1]+(ch?' ('+(ch>0?'+':'')+(ch*100).toFixed(1).replace('.',',')+'%)':'')+'.',{l:'📈 Ver cotações',a:'celapp',v:'cot'},true);
 // leilão semanal
 if(S.aucOpen&&S.aucOpen.until===S.day+3)celMsg('ademar',(S.aucOpen.type==='elite'?'👑 Leilão ELITE aberto!':'Bom dia! O leilão da semana abriu')+' Fica 3 dias. Venha para o pregão ao vivo: sente na arquibancada e levante a plaquinha. Se quiser vender, marque os animais em Rebanho › Pôr no leilão.',{l:'📍 Ir ao leilão',a:'celgo',v:'leilao'});
 // gala
 if(dm===13){if(typeof eliteInvited==='function'&&eliteInvited())celMsg('elite','Prezado(a) '+(S.farmName||'pecuarista')+', é uma honra convidá-lo(a) para o Leilão Estrelas do Agro, dia 15 às 20h, no Salão de Gala. Traje: terno. As melhores genéticas do Brasil estarão na pista.',{l:'⭐ Ver leilões',a:'celapp',v:'leiloes'});
  else if(!C.seen.galaLock){C.seen.galaLock=1;celMsg('elite','O Leilão Estrelas do Agro acontece todo dia 15, só para convidados (reputação 50+ ou patrimônio de R$ 5 milhões). Continue crescendo e o convite chega!',null,true)}}
 if(dm===15&&typeof eliteInvited==='function'&&eliteInvited())celMsg('elite','É hoje! 20h no Salão de Gala, ao lado da Arena. Sua mesa está reservada. 🥂',{l:'📍 Me leve lá',a:'celgo',v:'elite'});
 // exposição
 if((S.day+5)%90===45)celMsg('expo','Faltam 5 dias para a Exposição Agropecuária! Prepare seus melhores animais: genética, peso e saúde contam pontos.',null);
 if(S.expo&&S.expo.until===S.day+5)celMsg('expo','A Exposição abriu! Inscrições na Arena. O julgamento é ao vivo: você mesmo entra na pista com seu animal.',{l:'📍 Ir à Arena',a:'celgo',v:'arena'});
 // doentes
 const sick=S.herd.filter(a=>a.sick).length;if(sick>C.sick&&sick>0)celMsg('vet',sick===1?'Um animal seu está doente. Quanto antes tratar, menor o risco de perder.':'Tem '+sick+' animais doentes no seu rebanho! Trate logo para não perder ninguém.',{l:'🐄 Ver rebanho',a:'celherd'});C.sick=sick;
 // Comendador
 if(S.com&&S.com.met&&S.day%7===1)celMsg('com',pick(['Tenho negócios novos na mesa essa semana. Passa no camarote.','Meus rapazes separaram umas oportunidades pra você. Não demora.','O uísque tá gelando. E as propostas também.']),{l:'📍 Ir ao bar',a:'celgo',v:'com'});
 if(S.com&&S.com.loan&&S.day%30===0)celMsg('com','Amanhã é dia de parcela: '+R$(S.com.loan.parc)+'. Não me faça mandar os rapazes.');
 if(S.com&&S.com.ct&&S.com.ct.due===S.day+3)celMsg('com','Faltam 3 dias pro nosso contrato de '+S.com.ct.n+' bois. Espero que esteja tudo certo...');
 // vida
 if(Math.random()<.035)celMsg('mae',pick(MAE),null,true);if(Math.random()<.03)celMsg('tonhao',pick(TONH),null,true);
 if(Math.random()<.06&&typeof rankList==='function'){const L=rankList(),me=L.findIndex(x=>x.me),i=Math.floor(Math.random()*RIV.length),rv=L.findIndex(x=>x.n===RIV[i][0]);
  celMsg('rv'+i,rv<me?pick(['Ainda tô na sua frente no ranking, hein! 😏','Vi seu gado na estrada. Bonito... mas o meu é melhor.','Quando crescer, me liga. 😂']):pick(['Tá crescendo rápido, hein? Qual é o segredo?','Parabéns pela fazenda. Um dia a gente faz negócio.','Vou te alcançar, pode esperar!']),null,true)}}
// boas-vindas
const _updCel=update;let celT=0;update=function(dt){_updCel(dt);if(!S)return;celT+=dt;if(celT>.15){celT=0;celArrowStep()}
 if(!S.cel&&typeof TUT!=='undefined'&&S.tut>=TUT.length){ensureCel();celMsg('mae','Filho, comprei esse celular pra você não sumir! Aqui chegam mensagens do pessoal da região, cotação do boi e a agenda dos leilões. Te amo! ❤️',{l:'📱 Abrir celular',a:'cel'})}};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:1,ic:'📱',t:'Celular',h:'O botão 📱 no topo abre o celular: mensagens da veterinária, do leiloeiro, do Comendador e dos gerentes, cotação do boi, agenda de leilões e exposições, e suas fazendas. O número vermelho mostra mensagens novas.'});

{const st=document.createElement('style');st.textContent='.celbody .card{background:#fffdf8;color:#2a1a10;border:1px solid #d8ccb8;box-shadow:0 1px 2px rgba(0,0,0,.1)}.celbody .dim{color:#6a5a4a}.celbody .gold{color:#a8781a}.celbody .grn{color:#1a8a3a}.celbody .red{color:#c83a2a}.celbody b{color:#2a1a10}';document.head.appendChild(st)}
