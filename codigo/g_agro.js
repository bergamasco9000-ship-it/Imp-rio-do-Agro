// ===== Agroindústria (queijaria, engenho, alambique, torrefação, marca própria) + visitas especiais =====
const AGRO={
 queijaria:{n:'Queijaria',ic:'🧀',w:5,h:4,days:8,cost:180000,lv:5,d:'Queijaria artesanal legalizada: o leite do tanque vira queijo minas frescal e queijo canastra curado. Leite de cabra vira queijo de cabra.'},
 engenho:{n:'Engenho de rapadura',ic:'🟫',w:6,h:4,days:10,cost:120000,lv:6,d:'Moenda, fornalha e tachos de cobre: a cana vira rapadura e açúcar mascavo.'},
 alambique:{n:'Alambique',ic:'🥃',w:6,h:4,days:12,cost:250000,lv:7,d:'Alambique de cobre de 500 L: destila a cana em cachaça. Envelhecida em barril de amburana vale muito mais.'},
 torrefacao:{n:'Torrefação de café',ic:'☕',w:5,h:4,days:10,cost:200000,lv:8,d:'Torrador de 15 kg e empacotadora: torra e embala seu café. Com a marca forte, faz café especial.'}
};
Object.assign(BT,AGRO);
const AGI={qfresco:{n:'Queijo minas frescal (kg)',ic:'🧀',p0:36},qcurado:{n:'Queijo canastra curado (peça 1 kg)',ic:'🧀',p0:105},qcabra:{n:'Queijo de cabra (kg)',ic:'🧀',p0:95},
 rapcx:{n:'Fardo de rapadura (20 × 500 g)',ic:'🟫',p0:100},mascavo:{n:'Açúcar mascavo (saco 10 kg)',ic:'🟤',p0:95},cachaca:{n:'Cachaça prata (caixa 12 garrafas)',ic:'🍶',p0:420},cachacav:{n:'Cachaça envelhecida (caixa 12 garrafas)',ic:'🥃',p0:900},
 cafet:{n:'Café torrado (fardo 12 × 500 g)',ic:'☕',p0:360},cafeg:{n:'Café especial (fardo 12 × 500 g)',ic:'☕',p0:720}};
Object.keys(AGI).forEach(k=>{ITEMS[k]={n:AGI[k].n,ic:AGI[k].ic,cat:'prod',p:AGI[k].p0}});
// in = insumos por lote · oc = custo de produção por lote (lenha, embalagens, mão de obra, impostos)
const RCP={
 queijaria:[{id:'qf',n:'Queijo frescal',in:{milk:100},out:{qfresco:10},oc:40,d:1},{id:'qc',n:'Queijo canastra (cura de 7 dias)',in:{milk:100},out:{qcurado:9},oc:120,d:7},{id:'qb',n:'Queijo de cabra',in:{leitecabra:30},out:{qcabra:5},oc:60,d:3}],
 engenho:[{id:'rp',n:'Rapadura',in:{cana:1},out:{rapcx:8},oc:450,d:3},{id:'ms',n:'Açúcar mascavo',in:{cana:1},out:{mascavo:8},oc:350,d:4}],
 alambique:[{id:'cp',n:'Cachaça prata',in:{cana:1},out:{cachaca:10},oc:3300,d:8},{id:'ce',n:'Cachaça envelhecida (barril de amburana)',in:{cana:1},out:{cachacav:10},oc:3700,d:30}],
 torrefacao:[{id:'ct',n:'Café torrado',in:{cafe:1},out:{cafet:2},oc:150,d:2},{id:'cs',n:'Café especial',in:{cafe:2},out:{cafeg:3},oc:400,d:5,rep:15}]
};
const INN={milk:'L de leite do tanque',leitecabra:'L de leite de cabra',cana:'t de cana',cafe:'@ de café'};
function ensureAg(){if(!S.ag)S.ag={q:{},brand:null,rep:0,selo:0,made:0,tvB:0};return S.ag}
const agMult=()=>{const A=ensureAg();return 1+(A.brand?.1:0)+A.rep/100*.15+(A.selo?.05:0)+(A.tvB>=S.day?.1:0)};
function agPrices(){const m=agMult();Object.keys(AGI).forEach(k=>{ITEMS[k].p=Math.round(AGI[k].p0*m)})}
const inHave=k=>k==='milk'?Math.floor(S.milkT||0):(S.inv[k]||0);
function inTake(k,n){if(k==='milk')S.milkT=Math.max(0,S.milkT-n);else takeItem(k,n)}
// ---------- construções: aplicar sem cercado
const _apAg=applyBlds;applyBlds=function(){ensureB();const all=S.blds;S.blds=all.filter(b=>!AGRO[b.type]);try{_apAg()}finally{S.blds=all}
 for(const b of all){if(!AGRO[b.type])continue;const B=BT[b.type];for(let y=b.y;y<b.y+B.h;y++)for(let x=b.x;x<b.x+B.w;x++)SOL[ti(x,y)]=1;
  if(!BLD.some(q=>q.id===b.type))BLD.push({id:b.type,x:b.x,y:b.y,w:B.w,h:B.h,door:b.x+2,roof:'#8a3a22',wall:'#f0ebe0',label:B.ic+' '+B.n,sign:null,custom:1})}};
const _dbaAg=drawBuiltArt;drawBuiltArt=function(g,t,x,y){if(!AGRO[t])return _dbaAg(g,t,x,y);if(BLD.some(b=>b.id===t&&b.x*TS===x&&b.y*TS===y))return;const B=BT[t];drawBuildingArt(g,{id:t,x:x/TS,y:y/TS,w:B.w,h:B.h,door:x/TS+2})};
// ---------- arte das agroindústrias
BART.queijaria=(g,b,x,y,w,h,dx)=>{const rh=h-40;shadowB(g,x,y,w,h);
 wallCal(g,x,y+rh,w,h-rh,'#f6f2e8','#3a6aa8');roofClay(g,x,y,w,rh,'#b5532e');chimney(g,x+w-14,y-4,'#c8c0b0');
 signBoard(g,x+w/2,y+rh-9,'QUEIJARIA','#f6f2e8','#2a4a8a','#1a2a4a');
 stdWins(g,b,x,y,h,(g,a,c)=>{winColonial(g,a,c,'#f4f4f4','#3a6aa8');for(let i=0;i<3;i++){BW(g,'#e8c860',a+1+i*4,c+7,3,2.4);BW(g,'#c8a040',a+1+i*4,c+9,3,.6)}});
 doorWood(g,x+dx,y+h-24,'#3a6aa8');
 for(let i=0;i<3;i++){const lx=x+w+1+i*5,ly=y+h;BW(g,'#a8b0b8',lx,ly-9,5,9);BW(g,'#d8dee4',lx+1,ly-9,1.4,9);BW(g,'#7a828a',lx+1,ly-11,3,2);BW(g,'#5a626a',lx-.5,ly-6,6,.8)}
 bench(g,x-16,y+h)};
BART.engenho=(g,b,x,y,w,h,dx)=>{const rh=h-38;shadowB(g,x,y,w,h);
 for(let i=0;i<5;i++)BW(g,'#5a3a22',x+i*(w-3)/4,y+rh,3,h-rh);wallBoards(g,x,y+h-14,w,14,'#9a6a3a');BW(g,'#2a1a10',x+3,y+rh+2,w-6,h-rh-16);
 BW(g,'#3a2a1a',x+10,y+h-30,28,3);BW(g,'#b86a2a',x+10,y+h-27,28,9);BW(g,'#e08a3a',x+11,y+h-27,26,1.6);BW(g,'#5a3a1a',x+12,y+h-18,24,4);
 for(let i=0;i<5;i++)BW(g,i%2?'#f0a020':'#e04a1a',x+14+i*4,y+h-17,3,2);
 BW(g,'#c8a050',x+w-30,y+h-32,18,14);for(let i=0;i<5;i++)BW(g,'#8a6a2a',x+w-30+i*4,y+h-32,1,14);
 roofClay(g,x,y,w,rh,'#a8482a');signBoard(g,x+w/2,y+rh-9,'ENGENHO','#5a3a22','#ffd75e');
 const mx=x-15,my=y+h-2;BW(g,'#6a6a62',mx,my-12,13,12);BW(g,'#8a8a82',mx+1,my-12,11,2);BW(g,'#4a4a42',mx+3,my-10,7,7);BW(g,'#7a5a32',mx+5.5,my-26,2,15);BW(g,'#7a5a32',mx-2,my-24,17,2);
 for(let i=0;i<6;i++){BW(g,'#7ab04a',x+w+2+i*2,y+h-14+(i%2),1.4,14);BW(g,'#c8d07a',x+w+2+i*2,y+h-15+(i%2),1.4,2)}};
BART.alambique=(g,b,x,y,w,h,dx)=>{const rh=h-40;shadowB(g,x,y,w,h);
 wallBrick(g,x,y+rh,w,h-rh,'#a8502e');roofMetal(g,x,y,w,rh,'#8a9298');signBoard(g,x+w/2,y+rh-9,'ALAMBIQUE','#3a2414','#f0c060');
 stdWins(g,b,x,y,h,(g,a,c)=>winArch(g,a,c,'#5a3a22'));doorWood(g,x+dx,y+h-24,'#5a3a22',1);
 const ax=x+w+1,ay=y+h;BW(g,'#7a7a7a',ax,ay-5,11,5);BW(g,'#e04a1a',ax+2,ay-4,7,2.4);BW(g,'#c87a3a',ax,ay-17,11,12);BW(g,'#e8a060',ax+2,ay-16,3,9);BW(g,'#a85a2a',ax+3,ay-22,5,5);BW(g,'#c87a3a',ax+7,ay-24,7,1.6);BW(g,'#c87a3a',ax+13,ay-24,1.6,13);BW(g,'#8a9aa8',ax+11,ay-11,5,11);
 for(let i=0;i<2;i++){barrel(g,x-15+i*7,y+h);if(!i)barrel(g,x-11.5,y+h-8)}};
BART.torrefacao=(g,b,x,y,w,h,dx)=>{const rh=h-40;shadowB(g,x,y,w,h);
 wallCal(g,x,y+rh,w,h-rh,'#efe2c8','#6a3a1a');roofClay(g,x,y,w,rh,'#9a4a2a');chimney(g,x+8,y-6,'#7a4a2a');
 signBoard(g,x+w/2,y+rh-9,'CAFE TORRADO','#3a1e10','#f0d8a8');stdWins(g,b,x,y,h,(g,a,c)=>winColonial(g,a,c,'#f4ecd8','#6a3a1a'));doorWood(g,x+dx,y+h-24,'#6a3a1a');
 sacks(g,x+w+1,y+h,4,'#d8c8a0');BW(g,'#3a2414',x-15,y+h-10,13,10);BW(g,'#5a3a22',x-14,y+h-9,11,2);for(let i=0;i<5;i++)BW(g,'#4a2a12',x-13+i*2,y+h-6+(i%2),1.4,1.4)};
const _blAg=bLive;bLive=function(g,b){_blAg(g,b);if(!AGRO[b.id])return;const q=(ensureAg().q[b.id]||[]).some(t=>t.done>S.day),x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS;if(!q)return;
 if(b.id==='queijaria')smoke(g,x+w-11,y-5);else if(b.id==='torrefacao')smoke(g,x+11,y-7);else if(b.id==='engenho'){smoke(g,x+22,y+h-30);const s=Math.sin(frame/12);Rr(g,'#7a5a32',x-9+s*7,b.y*TS+h-27,2,2)}else if(b.id==='alambique'){smoke(g,x+w+11,y+h-8);if((frame>>4)%3===0)Rr(g,'#e8f0f8',x+w+24,y+h-12+((frame>>2)%4),1,1.4)}};
// ---------- tela de produção
const agBatch={};
function agModal(t){ensureAg();agPrices();reModal=()=>agModal(t);const B=BT[t],Q=S.ag.q[t]=S.ag.q[t]||[];let h='<h3>'+B.ic+' '+B.n+'</h3><div class="dim">Marca: <b>'+(S.ag.brand?'“'+S.ag.brand+'”':'sem marca')+'</b> · prestígio '+Math.round(S.ag.rep)+'/100'+(S.ag.selo?' · ✅ selo de inspeção':'')+' · preços ×'+agMult().toFixed(2)+'</div>';
 h+='<div class="sec">EM PRODUÇÃO ('+Q.length+'/2)</div>'+(Q.length?Q.map((q,i)=>{const r=RCP[t].find(z=>z.id===q.r),ok=S.day>=q.done,out=Object.keys(r.out).map(k=>r.out[k]*q.n+'× '+AGI[k].ic+' '+AGI[k].n).join(', ');return '<div class="card"><div class="row"><b>'+r.n+' ×'+q.n+'</b>'+(ok?'<button class="b gold" data-act="agget" data-v="'+t+':'+i+'">✅ Retirar</button>':'<span class="dim">faltam '+(q.done-S.day)+' dia(s)</span>')+'</div>'+bar(ok?100:(S.day-q.t0)/(q.done-q.t0)*100,ok?'#5ac04a':'#e0a431')+'<div class="dim">'+out+'</div></div>'}).join(''):'<div class="dim">Nada no fogo.</div>');
 h+='<div class="sec">RECEITAS</div>'+RCP[t].map(r=>{const m=agBatch[t+r.id]||1,inS=Object.keys(r.in).map(k=>(r.in[k]*m)+' '+INN[k]+' (tem '+inHave(k)+')').join(' + ')+(r.oc?' + '+R$(r.oc*m)+' de custo (lenha, embalagem, mão de obra, impostos)':''),can=Object.keys(r.in).every(k=>inHave(k)>=r.in[k]*m)&&S.money>=(r.oc||0)*m,out=Object.keys(r.out).map(k=>r.out[k]*m+'× '+AGI[k].n+' ('+R$(ITEMS[k].p)+' cada)').join(', '),lock=r.rep&&S.ag.rep<r.rep;
  return '<div class="card '+(lock?'lock':'')+'"><div class="row"><b>'+r.n+'</b><span class="dim">⏱️ '+r.d+' dia(s)</span></div><div class="dim">Usa '+inS+'</div><div class="dim">Faz '+out+'</div>'+(lock?'<div class="red">Requer prestígio da marca '+r.rep+'</div>':'<div class="btns">'+[1,2,3].map(k=>'<button class="b '+(m===k?'gold':'')+'" data-act="agm" data-v="'+t+':'+r.id+':'+k+'">×'+k+'</button>').join('')+'<button class="b '+(can&&Q.length<2?'gold':'gray')+'" data-act="agmk" data-v="'+t+':'+r.id+'">Produzir</button></div>')+'</div>'}).join('');
 if(!S.ag.brand)h+='<div class="sec">MARCA PRÓPRIA</div><div class="card">Registre a marca no INPI, faça rótulos e ganhe +10% em todos os produtos. Cada lote produzido aumenta o prestígio da marca (até +15%).<div class="btns"><input id="agbn" maxlength="22" placeholder="'+(S.farmName||'Fazenda')+'" style="font:18px VT323,monospace;padding:4px;width:60%"><button class="b gold" data-act="agbrand">Registrar ('+R$(8000)+')</button></div></div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ACT,{
 agm(e){const[t,r,k]=e.v.split(':');agBatch[t+r]=+k},
 agmk(e){const[t,id]=e.v.split(':'),r=RCP[t].find(z=>z.id===id),m=agBatch[t+id]||1,Q=S.ag.q[t]=S.ag.q[t]||[];if(Q.length>=2)return toast('Os 2 lugares de produção estão ocupados','bad');if(r.rep&&S.ag.rep<r.rep)return;
  for(const k in r.in)if(inHave(k)<r.in[k]*m)return toast('Falta '+INN[k]+(k==='milk'?' (ordenhe as vacas no curral)':k==='cana'||k==='cafe'?' (plante e colha na lavoura)':''),'bad');
  if(r.oc&&S.money<r.oc*m)return toast('Falta dinheiro para o custo de produção ('+R$(r.oc*m)+')','bad');
  for(const k in r.in)inTake(k,r.in[k]*m);if(r.oc)cash(-r.oc*m,'Produção: '+r.n);Q.push({r:id,n:m,t0:S.day,done:S.day+r.d});gainXP(6+r.d*m,'agroindústria');toast(BT[t].ic+' '+r.n+' ×'+m+' começou: pronto em '+r.d+' dia(s)','good')},
 agget(e){const[t,i]=e.v.split(':'),Q=S.ag.q[t],q=Q&&Q[+i];if(!q||S.day<q.done)return;const r=RCP[t].find(z=>z.id===q.r),outs=q.left||Object.fromEntries(Object.keys(r.out).map(k=>[k,r.out[k]*q.n])),left={};
  for(const k in outs){const got=addItem(k,outs[k]);if(got<outs[k])left[k]=outs[k]-got}
  if(Object.keys(left).length){q.left=left;toast('Inventário cheio: o resto fica guardado aqui até você voltar','bad')}
  else{Q.splice(+i,1);S.ag.made+=q.n;S.ag.rep=Math.min(100,S.ag.rep+(S.ag.brand?1.2:.4)*q.n);toast('📦 '+r.n+' ×'+q.n+' no inventário. Venda na caixa de venda ou na feira.','good')}},
 agbrand(){const el=$('agbn'),n=((el&&el.value)||S.farmName||'Fazenda').trim().slice(0,22);if(S.money<8000)return toast('Dinheiro insuficiente','bad');cash(-8000,'Registro de marca');S.ag.brand=n;S.ag.rep=Math.max(S.ag.rep,5);agPrices();toast('🏷️ Marca “'+n+'” registrada! Seus produtos agora saem com rótulo próprio.','good');gainXP(30,'marca')}
});
const _ebAg=enterBld;enterBld=function(id){if(AGRO[id])return agModal(id);return _ebAg(id)};
const _hdAg=hookDay;hookDay=function(){_hdAg();const A=ensureAg();agPrices();for(const t in A.q)A.q[t].forEach(q=>{if(q.done===S.day)toast(BT[t].ic+' '+BT[t].n+': produção pronta para retirar!','good')});A.rep=Math.max(0,A.rep-.05);visDay()};
// ---------- VISITAS ESPECIAIS
const VIS={
 tv:{n:'Equipe de TV do “Campo em Foco”',ic:'📺',van:'#f4f4f4',stripe:'#2a6ad8',logo:'TV',ppl:[{shirt:'#2a6ad8',pants:'#2a2a3a',hair:'#3a2414',g:'f',mic:1},{shirt:'#3a3a3a',pants:'#3a3a4a',hair:'#1a1a1a',cam:1}]},
 buyer:{n:'Comprador estrangeiro',ic:'🌎',van:'#2a2a2a',stripe:'#c8a040',logo:'',ppl:[{shirt:'#e8e8e8',pants:'#3a3a4a',hair:'#d8c890',hat:'#f0e8d0',suit:1}]},
 fiscal:{n:'Fiscal da Defesa Agropecuária',ic:'📋',van:'#f4f4f4',stripe:'#2a8a3a',logo:'DEF',ppl:[{shirt:'#e0c020',pants:'#3a4a6a',hair:'#3a2414',g:'f',board:1}]}
};
const FBUYERS=[['Sr. Takeshi Yamada','criador do Japão'],['Sr. Hans Becker','importador da Alemanha'],['Sr. Diego Ferreyra','pecuarista do Uruguai'],['Sra. Amira Haddad','compradora do Oriente Médio']];
const VAN={x:26*TS,y:47*TS+10};
function ensureVis(){if(!S.vis)S.vis={next:S.day+8,cur:null,n:{}};return S.vis}
const visHere=()=>{const V=ensureVis(),c=V.cur,h=S.t*24;return c&&c.day===S.day&&h>=8&&h<17&&!c.done?c:null};
function visDay(){const V=ensureVis();if(V.cur&&V.cur.day<S.day){const c=V.cur;if(c.k==='fiscal'&&!c.done)fiscalInspect(true);V.cur=null;V.next=S.day+ri(10,20)}
 if(!V.cur&&S.day>=V.next&&S.tut>=TUT.length){const opts=[];if(Object.keys(AGRO).some(hasB)||S.rep>=35)opts.push('tv');if(S.herd.filter(a=>a.gen>=70).length>=2)opts.push('buyer');if(S.herd.length>=10||Object.keys(AGRO).some(hasB))opts.push('fiscal');if(!opts.length){V.next=S.day+5;return}
  const k=pick(opts),c={k,day:S.day+1};if(k==='buyer'){const b=pick(FBUYERS);c.who=b[0];c.from=b[1];c.max=ri(2,4)}if(k==='tv')c.q=[];V.cur=c;
  const msg={tv:'📺 Ligaram da TV: amanhã a equipe do programa “Campo em Foco” vem gravar na sua fazenda (8h–17h)! Fale com a repórter.',buyer:'🌎 '+c.who+', '+c.from+', visita sua fazenda amanhã (8h–17h) procurando animais de genética alta.',fiscal:'📋 Aviso: amanhã a fiscal da Defesa Agropecuária vem inspecionar a fazenda (8h–17h). Confira as vacinas!'}[k];
  setTimeout(()=>toast(msg,'good'),1500)}}
function drawVan(g,v){const x=VAN.x,y=VAN.y,c=v.van;Rr(g,'rgba(0,0,0,.3)',x-28,y-2,58,5);Rr(g,c,x-28,y-26,50,22);Rr(g,shade(c,-25),x-28,y-6,56,3);Rr(g,c,x+18,y-18,10,14);Rr(g,'#4a6a8a',x+20,y-16,7,6);Rr(g,'#2a3a4a',x+12,y-23,6,7);Rr(g,'#4a6a8a',x+12,y-23,5,6);
 Rr(g,v.stripe,x-28,y-14,56,3);if(v.logo){Rr(g,v.stripe,x-20,y-23,ptw(v.logo)+4,8);ptext(g,v.logo,x-18,y-21.5,'#fff')}Rr(g,'#2a2a2a',x-22,y-6,9,8);Rr(g,'#2a2a2a',x+12,y-6,9,8);Rr(g,'#8a8a8a',x-19,y-3,3,3);Rr(g,'#8a8a8a',x+15,y-3,3,3);Rr(g,'#f0e8a0',x+27,y-12,2,3);
 if(v===VIS.tv){Rr(g,'#9aa',x-6,y-30,2,4);Rr(g,'#ccc',x-10,y-34,10,4)}}
function visPos(i){return{x:VAN.x-40-i*14,y:VAN.y+6+i*3}}
function drawVisitor(g,c,o,i){const p=visPos(i),f=Math.sin(frame/40+i);drawPerson(g,{x:p.x,y:p.y,dir:Math.hypot(P.x-p.x,P.y-p.y)<120?(P.x>p.x?3:2):0,ph:0,mv:0,shirt:o.shirt,pants:o.pants,hair:o.hair,hat:o.hat,g:o.g||'m'});
 if(o.mic){Rr(g,'#2a2a2a',p.x+4,p.y-15,1,4);Rr(g,'#c83a2a',p.x+3.5,p.y-17,2,2.4)}if(o.cam){Rr(g,'#1a1a1a',p.x-9,p.y-22,9,6);Rr(g,'#3a3a3a',p.x-12,p.y-21,3,4);Rr(g,(frame>>4)&1?'#ff3030':'#600',p.x-2,p.y-21,1.2,1.2)}
 if(o.board){Rr(g,'#8a6a42',p.x+3,p.y-16,5,7);Rr(g,'#fff',p.x+3.6,p.y-15.4,3.8,5.8)}if(o.suit){Rr(g,'#2a2a3a',p.x-5,p.y-15,2,8);Rr(g,'#2a2a3a',p.x+3,p.y-15,2,8);Rr(g,'#a82a2a',p.x-.5,p.y-14,1,4)}}
const _evoAg=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoAg(L,x0,x1,y0,y1);if(inRoom())return;const c=visHere();if(!c)return;const v=VIS[c.k];if(VAN.x>x0-80&&VAN.x<x1+80&&VAN.y>y0-40&&VAN.y<y1+60){L.push([VAN.y,10,{draw:g=>OL(g,VAN.x,VAN.y,70,40,q=>drawVan(q,v))}]);v.ppl.forEach((o,i)=>{const p=visPos(i);L.push([p.y,10,{draw:g=>OL(g,p.x,p.y,30,36,q=>drawVisitor(q,c,o,i))}])})}};
const _ilAg=interactList;interactList=function(){const L=_ilAg();if(inRoom()||P.drive)return L;const c=visHere();if(c){const p=visPos(0);L.push({x:p.x,y:p.y,r:30,label:VIS[c.k].ic+' '+(c.k==='buyer'?c.who:VIS[c.k].n),fn:()=>visModal()})}return L};
const _dpAg=drawPart;drawPart=function(g){_dpAg(g);const c=visHere();if(!c||inRoom())return;const p=visPos(0);if(p.x<CX||p.x>CX+VW||p.y<CY||p.y>CY+VH){const ax=clamp(p.x,CX+10,CX+VW-10),ay=clamp(p.y,CY+34,CY+VH-14);Rr(g,'rgba(40,20,60,.85)',ax-7,ay-7,14,14);ptext(g,'!',ax-1.5,ay-3,'#ffd75e')}else{const b=Math.sin(frame/8)*1.5;Rr(g,'#ffd75e',p.x-1,p.y-34+b,2,5);Rr(g,'#ffd75e',p.x-1,p.y-27+b,2,2)}};
function visModal(){const c=visHere();if(!c)return;reModal=null;if(c.k==='tv')return tvModal(c);if(c.k==='buyer')return buyerModal(c);return fiscalModal(c)}
// TV
const TVQ=[['O que faz o gado da sua fazenda ser diferente?',['Pasto bem cuidado, água limpa e manejo calmo.','Sei lá, boi é tudo igual.','Dou um monte de remédio pra crescer rápido.']],
 ['Como vocês enfrentam a seca?',['Feno guardado, reserva de água e pasto descansado.','A gente reza e espera.','Vendo tudo e compro de novo depois.']],
 ['Qual recado pro produtor que está começando?',['Começar pequeno, cuidar bem e não desistir.','Desiste, que dá muito trabalho.','Só compra o boi mais caro que tiver.']],
 ['E a onça, atrapalha a criação?',['A gente protege o gado à noite e convive com ela.','Nem sei o que é onça.','Onça? Eu nunca deixo ninguém saber onde ela está.']],
 ['Qual o segredo dos seus produtos da roça?',['Matéria-prima fresca, capricho e paciência.','Faço de qualquer jeito, o povo compra.','É segredo industrial, comprei pronto.']],
 ['O que mudou na fazenda desde que você chegou?',['Muita coisa: cerca nova, gado melhor e muito trabalho.','Nada, tá tudo igual.','Deixei tudo pro peão e fui pra cidade.']]];
function tvModal(c){if(!c.q.length){const idx=[0,1,2,3,4,5].sort(()=>Math.random()-.5).slice(0,3);c.q=idx.map(i=>({i,ord:[0,1,2].sort(()=>Math.random()-.5)}));c.step=0;c.sc=0}
 if(c.step>=3)return tvEnd(c);const q=c.q[c.step],Q=TVQ[q.i];showModal('<h3>📺 Gravando: “Campo em Foco”</h3><div class="card">🎤 <b>Repórter Carla:</b> '+Q[0]+'</div><div class="dim">Pergunta '+(c.step+1)+'/3 · a câmera está rodando!</div><div class="btns" style="flex-direction:column;align-items:stretch">'+q.ord.map(o=>'<button class="b" data-act="tvans" data-v="'+o+'">'+Q[1][o]+'</button>').join('')+'</div>');reModal=null}
ACT.tvans=function(e){const c=visHere();if(!c||c.k!=='tv')return;if(+e.v===0)c.sc++;c.step++;tvModal(c)};
function tvEnd(c){c.done=1;const A=ensureAg(),s=c.sc;S.rep=Math.min(100,S.rep+s*2);A.rep=Math.min(100,A.rep+s*4);if(s>=2)A.tvB=S.day+6;cash(1500,'Cachê da reportagem');agPrices();gainXP(20+s*15,'reportagem');S.vis.n.tv=(S.vis.n.tv||0)+1;
 showModal('<h3>📺 Reportagem gravada!</h3><div class="card">'+['A reportagem ficou meio sem graça…','Ficou boa! Os vizinhos vão comentar.','Ficou ótima! O Brasil inteiro vai ver sua fazenda.','Ficou incrível! Você virou celebridade do campo!'][s]+'<br>Respostas boas: <b>'+s+'/3</b> · cachê '+R$(1500)+' · reputação +'+s*2+(s>=2?'<br><b class="grn">Boom de vendas: produtos da fazenda +10% por 6 dias!</b>':'')+'</div><div class="btns"><button class="b gold" data-act="close">Valeu!</button></div>')}
// comprador estrangeiro
const buyerEl=c=>S.herd.filter(a=>a.gen>=70&&!a.lead&&!a.led&&a.stall==null&&a.age>=200).sort((a,b)=>b.gen-a.gen).slice(0,8);
function buyerModal(c){const L=buyerEl(c);c.sold=c.sold||0;showModal('<h3>🌎 '+c.who+'</h3><div class="card">“Boa tarde! Sou '+c.from.split(' ').slice(-3).join(' ')+'. Procuro animais de genética excelente (70+) e pago <b>80% acima do mercado</b>. Levo até '+c.max+'.”</div><div class="dim">Já vendidos: '+c.sold+'/'+c.max+'</div>'
 +(L.length?L.map(a=>{const p=Math.round(valueOf(a,'mkt')*1.8);return '<div class="card"><div class="row"><b>'+a.name+' · '+(BREEDS[a.breed]?BREEDS[a.breed].n:a.breed)+' '+(a.sex==='F'?'♀':'♂')+'</b><span class="gold">'+R$(p)+'</span></div><div class="dim">Genética '+a.gen+' · '+Math.round(a.w)+' kg'+(a.breeder?' · reprodutor':'')+'</div><div class="btns">'+(c.sold<c.max?'<button class="b gold" data-act="bysell" data-v="'+a.id+'">Vender</button>':'')+'</div></div>'}).join(''):'<div class="card dim">Você não tem animais com genética 70+.</div>')
 +'<div class="btns"><button class="b gray" data-act="close">Até logo</button></div>');reModal=null}
ACT.bysell=function(e){const c=visHere();if(!c||c.k!=='buyer'||c.sold>=c.max)return;const a=S.herd.find(x=>x.id===+e.v);if(!a)return;const p=Math.round(valueOf(a,'mkt')*1.8);cash(p,'Exportação: '+a.name);S.herd=S.herd.filter(x=>x!==a);SP.delete(a.id);S.stats.sold++;S.rep=Math.min(100,S.rep+1);c.sold++;gainXP(25,'exportação');S.vis.n.buy=(S.vis.n.buy||0)+1;toast('🌎 '+a.name+' vai viajar! +'+R$(p),'good');if(c.sold>=c.max){c.done=1;toast('🌎 '+c.who+' fechou a compra e agradeceu: “Fazenda de primeira!”','good');hideModal()}else buyerModal(c)};
// fiscal
function fiscalScore(){const n=S.herd.length||1,vr=S.herd.filter(a=>a.vacc>S.day).length/n,sick=S.herd.filter(a=>a.sick).length,agro=Object.keys(AGRO).some(hasB);return{vr,sick,agro,sc:Math.round(25+vr*55+(sick?Math.max(-20,-sick*6):20)+(S.up.vet?5:0))}}
function fiscalModal(c){const F=fiscalScore();showModal('<h3>📋 Fiscal Sandra</h3><div class="card">“Bom dia! Vim fazer a inspeção sanitária de rotina. Vou olhar a vacinação do rebanho, os animais doentes'+(F.agro?' e a sua agroindústria':'')+'.”</div><div class="card"><div class="row"><b>Vacinados</b><span>'+Math.round(F.vr*100)+'%</span></div><div class="row"><b>Doentes</b><span>'+F.sick+'</span></div></div><div class="btns"><button class="b gold" data-act="fisok">Pode inspecionar</button><button class="b gray" data-act="close">Só um minuto (vacinar antes)</button></div>');reModal=null}
ACT.fisok=()=>fiscalInspect(false);
function fiscalInspect(auto){const V=ensureVis(),c=V.cur;if(!c||c.done)return;c.done=1;const F=fiscalScore(),A=ensureAg();let r;
 if(F.sc>=70){const nw=!A.selo;A.selo=1;S.rep=Math.min(100,S.rep+3);gainXP(30,'inspeção');r='✅ <b>Aprovado!</b> Nota '+F.sc+'. '+(nw?'Sua fazenda ganhou o <b>selo de inspeção</b>: produtos da agroindústria valem +5%.':'O selo de inspeção foi renovado.')}
 else if(F.sc>=45){r='⚠️ <b>Aprovado com ressalvas.</b> Nota '+F.sc+'. “Vacine mais o rebanho e cuide dos doentes até a próxima visita.”'}
 else{cash(-1500,'Multa da fiscalização');A.selo=0;S.rep=Math.max(0,S.rep-2);r='❌ <b>Reprovado.</b> Nota '+F.sc+'. Multa de '+R$(1500)+(F.agro?' e o selo de inspeção foi suspenso':'')+'. Vacine o rebanho no curral.'}
 agPrices();V.n.fis=(V.n.fis||0)+1;if(auto)setTimeout(()=>toast('📋 A fiscal inspecionou a fazenda sem você: '+r.replace(/<[^>]+>/g,''),F.sc>=45?'good':'bad'),800);else showModal('<h3>📋 Resultado da inspeção</h3><div class="card">'+r+'</div><div class="btns"><button class="b gold" data-act="close">Ok</button></div>')}
// ---------- registro, guia, conquistas
ACH.push(['agro1','Mão na massa','Produza um lote na agroindústria',()=>S.ag&&S.ag.made>=1,4000],['brand','Marca registrada','Registre sua marca própria',()=>S.ag&&!!S.ag.brand,6000],['tv','Estrela da TV','Grave uma reportagem com 3 respostas boas',()=>S.ag&&S.ag.tvB>0,8000],['selo','Selo de qualidade','Passe na inspeção sanitária',()=>S.ag&&S.ag.selo,6000]);
UNL[5]+=' · Queijaria';UNL[6]+=' · Engenho';UNL[7]+=' · Alambique';UNL[8]=(UNL[8]||'')+' · Torrefação';
GUIDE.push({lv:5,ic:'🧀',t:'Agroindústria',h:'Em 🏗️ Obras você constrói Queijaria (leite do tanque), Engenho de rapadura e Alambique (cana) e Torrefação (café). Entre no prédio, escolha a receita e o tamanho do lote: depois de alguns dias, retire os produtos e venda. Registre uma marca própria para ganhar +10% e prestígio a cada lote. Queijo canastra e cachaça envelhecida demoram, mas valem muito.'},
 {lv:4,ic:'📺',t:'Visitas especiais',h:'De vez em quando chega uma visita (avisada no dia anterior, das 8h às 17h, ao lado da casa): a equipe de TV (responda bem e venda mais), um comprador estrangeiro (paga 80% a mais por genética 70+) ou a fiscal sanitária (vacine o rebanho para ganhar o selo de inspeção; reprovado leva multa).'});
// ---------- consistência após carregar o jogo
let fixAcc=0;const _updAg=update;update=function(dt){_updAg(dt);if(!S)return;fixAcc+=dt;if(fixAcc<2)return;fixAcc=0;
 if(!CMT.on)for(const a of S.herd)if(a.drive){a.drive=0;a.led=0;cowBack(a)}
 const A=S.hct&&S.hct.act;if(A&&A.sp&&A.kills<A.n&&!WILD.some(w=>w.ct===A.id&&w.st!=='dead'))A.sp=0;
 ensureHorses()};
