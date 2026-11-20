// ===== MAIS VIDA: equipe de peões, rivais mais vivos, rodeio jogável, pesca de barco e torneio, estações no visual,
// noite viva (lua, lobo-guará, corujas, música no bar) e viagem para a cidade grande =====
const MB=(g,c,x,y,w,h)=>Rr(g,c,x,y,w,h);
const hrNow=()=>dayHour();
// ======================================================================= 1) EQUIPE DE PEÕES
const CREWR={
 vaq:{n:'Vaqueiro',ic:'🤠',sal:[2200,3000],d:'Campeia o gado a cavalo: o rebanho ganha mais peso e ele recolhe gado que fugir.'},
 trat:{n:'Tratador',ic:'🪣',sal:[1800,2400],d:'Põe sal e ração no cocho: gado mais saudável e pesado.'},
 cerq:{n:'Cerqueiro',ic:'🔨',sal:[1800,2300],d:'Conserta cerca todo dia: impede sabotagem de cerca dos rivais.'},
 trato:{n:'Tratorista',ic:'🚜',sal:[2400,3200],d:'Trabalha a lavoura no trator: a plantação cresce 20% mais rápido.'},
 ord:{n:'Ordenhador',ic:'🥛',sal:[1900,2500],d:'Tira leite das vacas paridas todo dia: +40% de leite no tanque.'}
};
const CNAMES=['Tonho','Zé Preto','Valdir','Juca','Nenê','Luizinho','Damião','Benedito','Sebastião','Chico','Dito','Marcão','Rosinha','Cida','Toninho','Joca','Raimundo','Gilmar','Aparecida','Tião Grande'];
const CLOOK=[['#8a5a2a','#2a1a10','#d8c080','#3a3a5a'],['#3a6a9a','#1a1a1a','#6a4a2a','#33384a'],['#a04a3a','#5a3a22','#e8d8b0','#4a3a2a'],['#5a7a3a','#2a1a10','#d8c080','#2a4a6a'],['#c8a060','#d8d8d8','#8a6a42','#3a3a3a'],['#6a3a8a','#1a1a1a',null,'#33384a']];
function ensureCrew(){if(!S.crew)S.crew={list:[],cand:[],cw:-1,nid:1};return S.crew}
const crewEff=c=>c.sk*(.55+c.hum/220);
const crewHas=r=>ensureCrew().list.some(c=>c.role===r&&c.off!==S.day);
function crewCands(){const C=ensureCrew(),w=Math.floor(S.day/7);if(C.cw!==w||!C.cand.length){C.cw=w;C.cand=[];const roles=Object.keys(CREWR);for(let i=0;i<3;i++){const r=roles[ri(0,roles.length-1)],R=CREWR[r],sk=Math.round(rnd(.6,1)*100)/100;C.cand.push({nm:pick(CNAMES),role:r,sk,sal:Math.round((R.sal[0]+(R.sal[1]-R.sal[0])*sk)/50)*50,lk:ri(0,CLOOK.length-1)})}}return C.cand}
function crewModal(){const C=ensureCrew(),cand=crewCands(),tot=C.list.reduce((s,c)=>s+c.sal,0);
 let h='<h3>👷 Equipe da fazenda</h3><div class="dim">Peões trabalham das 6h30 às 17h30 e você vê cada um fazendo o serviço. Salário todo dia 1º. Humor baixo rende menos e pode fazer o peão pedir as contas.</div>';
 h+='<div class="sec">CONTRATADOS ('+C.list.length+'/6) · folha '+R$(tot)+'/mês</div>';
 if(!C.list.length)h+='<div class="card dim">Ninguém contratado ainda.</div>';
 for(const c of C.list){const R=CREWR[c.role],hc=c.hum>65?'#4a9a3a':c.hum>35?'#e0a431':'#c8402a';
  h+='<div class="card"><div class="row"><b>'+R.ic+' '+c.nm+' · '+R.n+'</b><span class="gold">'+R$(c.sal)+'/mês</span></div><div class="dim">Habilidade '+Math.round(c.sk*100)+'% · '+(c.off===S.day?'🏖️ de folga hoje':'trabalhando')+'</div><div style="height:8px;background:#3a2a1a;border-radius:4px;margin:4px 0"><div style="height:8px;width:'+Math.round(c.hum)+'%;background:'+hc+';border-radius:4px"></div></div><div class="dim" style="font-size:13px">Humor '+Math.round(c.hum)+'%</div><div class="btns"><button class="b gold" data-act="crbon" data-v="'+c.id+'">💵 Bônus R$ 500</button><button class="b" data-act="croff" data-v="'+c.id+'">🏖️ Dar folga</button><button class="b gray" data-act="crfire" data-v="'+c.id+'">Demitir</button></div></div>'}
 h+='<div class="sec">CANDIDATOS DA SEMANA</div>';
 cand.forEach((c,i)=>{const R=CREWR[c.role];h+='<div class="card"><div class="row"><b>'+R.ic+' '+c.nm+' · '+R.n+'</b><span class="gold">'+R$(c.sal)+'/mês</span></div><div class="dim">'+R.d+'<br>Habilidade '+Math.round(c.sk*100)+'%</div><div class="btns"><button class="b gold" data-act="crhire" data-v="'+i+'">Contratar</button></div></div>'});
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ACT,{
 crhire(e){const C=ensureCrew(),c=C.cand[+e.v];if(!c)return;if(C.list.length>=6)return toast('Equipe cheia (máximo 6)','bad');if(C.list.filter(x=>x.role===c.role).length>=2)return toast('Já tem 2 '+CREWR[c.role].n.toLowerCase()+'s','bad');if(S.money<c.sal)return toast('Precisa ter o 1º salário em caixa','bad');cash(-c.sal,'Contratação: '+c.nm);C.list.push(Object.assign({id:C.nid++,hum:70,hired:S.day},c));C.cand.splice(+e.v,1);toast('👷 '+c.nm+' foi contratado(a) como '+CREWR[c.role].n.toLowerCase()+'!','good');crewModal()},
 crbon(e){const c=ensureCrew().list.find(x=>x.id===+e.v);if(!c)return;if(S.money<500)return toast('Dinheiro insuficiente','bad');cash(-500,'Bônus para '+c.nm);c.hum=Math.min(100,c.hum+20);toast('😄 '+c.nm+' ficou feliz com o bônus!','good');crewModal()},
 croff(e){const c=ensureCrew().list.find(x=>x.id===+e.v);if(!c)return;if(c.off===S.day)return toast(c.nm+' já está de folga hoje');c.off=S.day;c.hum=Math.min(100,c.hum+12);toast('🏖️ '+c.nm+' tirou o dia de folga.','good');crewModal()},
 crfire(e){const C=ensureCrew(),i=C.list.findIndex(x=>x.id===+e.v);if(i<0)return;const c=C.list[i],ac=Math.round(c.sal*.5);cash(-Math.min(ac,S.money),'Acerto de '+c.nm);C.list.splice(i,1);delete CRW[c.id];toast('📄 '+c.nm+' foi demitido(a). Acerto pago: '+R$(ac));crewModal()}
});
const _hdCrew=hookDay;hookDay=function(){_hdCrew();const C=ensureCrew();if(!C.list.length)return;
 if(S.day%30===1){const tot=C.list.reduce((s,c)=>s+c.sal,0);if(S.money>=tot){cash(-tot,'Salários da equipe');C.list.forEach(c=>c.hum=Math.min(100,c.hum+4))}else{C.list.forEach(c=>c.hum-=30);toast('⚠️ Faltou dinheiro para o salário da equipe! O humor despencou.','bad')}}
 for(const c of C.list.slice()){c.hum=clamp(c.hum+rnd(-1.6,1)+(S.weather==='chuva'?-.5:0)+(S.day-(c.off||-99)>10?-.6:.2),0,100);if(c.hum<15&&Math.random()<.25){C.list.splice(C.list.indexOf(c),1);delete CRW[c.id];toast('😠 '+c.nm+' pediu as contas: “Aqui não dá mais, patrão.”','bad')}}
 const e=r=>C.list.filter(c=>c.role===r&&c.off!==S.day).reduce((s,c)=>s+crewEff(c),0);
 const vq=e('vaq'),tr=e('trat'),tt=e('trato'),od=e('ord');
 if(vq||tr)for(const a of S.herd){const m=wmax(a);if(a.w<m)a.w+=Math.min(m-a.w,(m-a.w)*.0035*vq+.18*tr);a.hp=Math.min(100,a.hp+.5*tr)}
 if(tt)for(const c of S.crops)c.age+=.2*Math.min(1.5,tt);
 if(od){let add=0;for(const a of S.herd)if(a.lact>S.day)add+=(MILK[a.breed]||4)*(a.hp/100)*.4*Math.min(1.5,od);S.milkT=(S.milkT||0)+add}
};
// peões visíveis trabalhando
const CRW={};
function crewRT(c){if(!CRW[c.id])CRW[c.id]={x:17*TS+8,y:46*TS+4,dir:0,ph:0,mv:0,st:'idle',t:rnd(0,2),route:[],work:0};return CRW[c.id]}
const pasRc=()=>{const w=PWT[S.up.land||0];return[PAS.x*TS,PAS.y*TS,(PAS.x+w)*TS,(PAS.y+PAS.h)*TS]};
function stepCrew(dt){const C=S.crew;if(!C||!C.list.length||inRoom())return;const h=hrNow(),on=h>=6.5&&h<17.5;
 for(const c of C.list){const r=crewRT(c);r.vis=on&&c.off!==S.day;if(!r.vis){r.x=17*TS+8;r.y=46*TS+4;r.st='idle';continue}r.mv=0;r.work=0;
  if(c.role==='vaq'){const [x0,y0,x1,y1]=pasRc();if(!r.tx||Math.hypot(r.tx-r.x,r.ty-r.y)<3){if(r.st==='idle'){r.x=x0+30;r.y=y0+40;r.st='ride'}r.tx=x0+20+Math.random()*(x1-x0-40);r.ty=y0+24+Math.random()*(y1-y0-40);r.t=rnd(1,4)}
   if(r.t>0){r.t-=dt;continue}const dx=r.tx-r.x,dy=r.ty-r.y,d=Math.hypot(dx,dy),sp=26;r.x+=dx/d*sp*dt;r.y+=dy/d*sp*dt;r.mv=1;r.ph+=dt*2.4;r.dir=dx>0?3:2;continue}
  if(c.role==='trato'){const f=fieldRect(),x0=f[0]*TS+10,x1=(f[2]+1)*TS-10;if(r.st!=='trat'){r.st='trat';r.x=x0;r.row=0;r.dir=3}const nr=Math.max(1,f[3]-f[1]+1),yy=(f[1]+r.row%nr)*TS+14;r.y+=(yy-r.y)*Math.min(1,dt*2);r.x+=(r.dir===3?1:-1)*18*dt;if(r.dir===3&&r.x>x1){r.dir=2;r.row++}else if(r.dir===2&&r.x<x0){r.dir=3;r.row++}continue}
  if(r.st==='work'){r.work=1;r.t-=dt;if(r.t<=0){r.st='idle';r.t=rnd(.5,2)}continue}
  if(r.st==='go'){if(wkStep(r,dt,34)){r.st='work';r.t=rnd(3,6)}continue}
  r.t-=dt;if(r.t>0)continue;let tgt;
  if(c.role==='trat')tgt=Math.random()<.6?[TROUGH.x+rnd(6,40),TROUGH.y+16]:[17*TS+8,46*TS+4];
  else if(c.role==='cerq'){const [x0,y0,x1,y1]=pasRc(),s=ri(0,2);tgt=s===0?[x0+Math.random()*(x1-x0),y0-6]:s===1?[x0+Math.random()*(x1-x0),y1+10]:[x1+10,y0+Math.random()*(y1-y0)]}
  else tgt=[(RUN.x0+2+Math.random()*4)*TS,(RUN.y1+1)*TS+6];
  r.route=buildRoute(r,tgt[0],tgt[1]);r.st='go'}}
function drawCrew(g,c,r){const L=CLOOK[c.lk||0];
 if(c.role==='vaq'){OL(g,r.x,r.y,40,50,q=>{drawHorseS(q,r.x,r.y,r.dir,'crioulo',{mv:r.mv,ph:r.ph,saddle:1});q.save();q.translate(0,-17);drawPerson(q,{x:r.x,y:r.y,dir:r.dir,ph:0,mv:0,shirt:L[0],hair:L[1],hat:L[2]||'#d8c080',pants:L[3]});q.restore()})}
 else if(c.role==='trato')drawTractorV(g,r.x,r.y,r.dir,1);
 else{OL(g,r.x,r.y+3,30,42,q=>drawPerson(q,{x:r.x,y:r.y,dir:r.dir,ph:r.ph,mv:r.mv,shirt:L[0],hair:L[1],hat:L[2],pants:L[3],work:r.work,tool:c.role==='cerq'?1:0,g:/a$/.test(c.nm)?'f':'m'}));
  if(c.role!=='cerq'&&RMODE!==4){MB(g,'#8a929b',r.x+5,r.y-7,5,6);MB(g,c.role==='ord'?'#f4f4f0':'#c8a040',r.x+5.5,r.y-7,4,1.4)}
  if(c.role==='cerq'&&r.work&&RMODE!==4&&((frame>>3)&1))MB(g,'#ffe27a',r.x+7,r.y-14,2,2)}
 if(RMODE!==4&&Math.hypot(r.x-P.x,r.y-P.y)<70){const t=c.nm,tw=ptw(t);MB(g,'rgba(20,14,8,.6)',r.x-tw/2-2,r.y-(c.role==='vaq'?54:38),tw+4,8);ptext(g,t,r.x-tw/2,r.y-(c.role==='vaq'?52.5:36.5),'#ffd75e')}}
// ======================================================================= 6) RIVAIS MAIS VIVOS
function ensureSab(){if(!S.sab)S.sab={esc:[],last:null,boatoD:-1,news:[]};return S.sab}
let RAUC=null;
const _buyRv=ACT.buy;
ACT.buy=function(e){const x=S.listings[+e.v];if(!x||RAUC)return _buyRv(e);if(x.price>=6000&&Math.random()<.42&&typeof RIV!=='undefined'){const i=ri(0,RIV.length-1);RAUC={li:+e.v,a:x.a,price:Math.round(x.price*1.05),rv:i,max:x.price*rnd(1.08,1.45),me:x.price};aucModal('🙋 '+rvName(i)+' levantou a mão e cobriu seu lance!');return}return _buyRv(e)};
function aucModal(msg){const A=RAUC;if(!A)return;showModal('<h3>⚖️ Disputa no leilão</h3><div class="card"><b>'+A.a.name+'</b> · '+BREEDS[A.a.breed].n+' · '+Math.round(A.a.w)+' kg<br>'+msg+'</div><div class="card"><div class="row"><span>Lance atual de '+rvName(A.rv)+'</span><b class="gold">'+R$(A.price)+'</b></div><div class="dim">'+rvFarm(A.rv)+'</div></div><div class="btns"><button class="b gold" data-act="aucup">Cobrir: '+R$(Math.round(A.price*1.05))+'</button><button class="b gray" data-act="aucno">Desistir</button></div>')}
Object.assign(ACT,{
 aucup(){const A=RAUC;if(!A)return;const my=Math.round(A.price*1.05);if(S.money<my)return toast('Dinheiro insuficiente para cobrir','bad');
  if(my*1.05<=A.max&&Math.random()<.78){A.price=Math.round(my*1.05);aucModal(pick(['😤 '+rvName(A.rv)+' não larga o osso: cobriu de novo!','“Esse animal é meu!” — '+rvName(A.rv)+' subiu o lance.','O leiloeiro grita: dou-lhe uma... '+rvName(A.rv)+' cobriu!']));return}
  const x=S.listings[A.li];RAUC=null;hideModal();if(x&&buyAnimal(x.a,my,'Leilão disputado')){S.listings.splice(S.listings.indexOf(x),1);toast('🔨 Arrematado! Você venceu '+rvName(A.rv)+' e levou '+x.a.name+' por '+R$(my),'good');gainXP(10,'leilão')}},
 aucno(){const A=RAUC;if(!A)return;RAUC=null;hideModal();const x=S.listings[A.li];if(x)S.listings.splice(A.li,1);if(S.rk&&S.rk.v)S.rk.v[A.rv]+=A.price*.1;toast('🔨 '+rvName(A.rv)+' levou o animal por '+R$(A.price)+'.')}
});
const _hdRv2=hookDay;hookDay=function(){_hdRv2();const B=ensureSab();if(typeof RIV==='undefined')return;
 // rival compra terra e aumenta o rebanho
 if(S.day%30===10){const i=ri(0,RIV.length-1),ha=ri(40,160);if(S.rk&&S.rk.v)S.rk.v[i]*=1.05;const f=RF.find(z=>z.i===i);if(f&&f.n<20){f.n++;const p=f.pas;RFC.push({f:RF.indexOf(f),x:(p.x0+2)*TS,y:(p.y0+2)*TS,tx:(p.x0+3)*TS,ty:(p.y0+3)*TS,dir:1,wait:0,mv:0,ph:0,a:{id:-(9900+S.day),breed:RVP[i].br,sex:'F',age:600,name:'',w:420}})}
  toast('📰 '+rvName(i)+' comprou mais '+ha+' ha e aumentou o rebanho da '+rvFarm(i)+'.')}
 // sabotagem noturna
 B.esc=B.esc.filter(z=>{const art=z.a.sex==='M'?'O':'A';if(S.day-z.d>=2&&(S.up.peao||0)>0&&Math.random()<.35){S.herd.push(z.a);toast('🤠 O peão achou '+(art==='O'?'o ':'a ')+z.a.name+' na mata e trouxe de volta.','good');return false}
  if(S.day-z.d>4){if(Math.random()<.4){S.herd.push(z.a);toast('🐄 '+art+' '+z.a.name+' voltou sozinh'+(art==='O'?'o':'a')+' pela porteira, com fome.','good')}else toast('😞 '+art+' '+z.a.name+' que fugiu nunca foi encontrad'+(art==='O'?'o':'a')+' (furtad'+(art==='O'?'o':'a')+'?).','bad');return false}return true});
 if(S.herd.length>=8&&Math.random()<(B.last&&S.day-B.last.d<20?0:.025)){const i=ri(0,Math.min(8,RIV.length-1)),t=pick(['cerca','cerca','boato','racao']);B.last={i,t,d:S.day,rep:0};
  if(t==='cerca'){if(crewHas('cerq')){toast('🔨 Seu cerqueiro pegou um homem cortando a cerca de madrugada! Ele fugiu numa caminhonete da '+rvFarm(i)+'.','good')}
   else{const n=Math.min(ri(1,3),S.herd.length-4);for(let k=0;k<n;k++){const a=S.herd.splice(ri(0,S.herd.length-1),1)[0];if(!a)continue;B.esc.push({a,x:(62+Math.random()*10)*TS,y:(50+Math.random()*16)*TS,d:S.day,dir:1,ph:0})}
    if(crewHas('vaq')){const back=B.esc.splice(0);back.forEach(z=>S.herd.push(z.a));toast('🤠 Cortaram a cerca de noite, mas seu vaqueiro recolheu as '+back.length+' cabeças. Suspeita: '+rvFarm(i)+'.','good')}
    else toast('✂️ Cortaram a cerca de noite! '+n+' cabeça(s) fugiram para a MATA a leste da sede. Vá buscar em até 4 dias. Pode denunciar na delegacia.','bad')}}
  else if(t==='boato'){B.boatoD=S.day+3;toast('🗣️ Espalharam um boato de doença no seu gado. Seus animais valem 10% menos por 3 dias. Pode denunciar na delegacia.','bad')}
  else{if(guardScore()>=60)toast('🐕 Seus cães espantaram ladrões de ração de madrugada!','good');else{const kg=Math.min(Math.floor(S.feed),ri(300,800));S.feed-=kg;toast('🌾 Roubaram '+kg+' kg de ração do celeiro! Pode denunciar na delegacia.','bad')}}}
};
const _voSab=valueOf;valueOf=function(a,m){let v=_voSab(a,m);if(S&&S.sab&&S.sab.boatoD>=S.day)v*=.9;if(a&&a.nat)v*=1.3;return v};
function denuncia(){const B=ensureSab(),L=B.last;if(!L||L.rep||S.day-L.d>7)return toast('Nada para denunciar agora.');L.rep=1;
 if(Math.random()<.55){const ind=ri(5,20)*1000;cash(ind,'Indenização por sabotagem');if(S.rk&&S.rk.v)S.rk.v[L.i]*=.95;S.rep=Math.min(100,(S.rep||0)+2);showModal('<h3>🚔 Delegacia</h3><div class="card">O Xerife Ramos achou as provas: foi gente da <b>'+rvFarm(L.i)+'</b>. '+rvName(L.i)+' foi multado(a) e teve que te indenizar.</div><div class="gold">+'+R$(ind)+'</div><div class="btns"><button class="b gray" data-act="close">Justiça feita!</button></div>')}
 else showModal('<h3>🚔 Delegacia</h3><div class="card">“Sem prova não posso prender ninguém, patrão. Mas vou ficar de olho na '+rvFarm(L.i)+'.” — Xerife Ramos</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
// ======================================================================= 8) RODEIO JOGÁVEL
const BULLS=[{n:'Mansinho',d:.8,m:.7,b:0,c:'#8a6a4a'},{n:'Bandido',d:1,m:1,b:4,c:'#3a2a1e'},{n:'Tornado',d:1.25,m:1.6,b:9,c:'#5a3a22'},{n:'Pesadelo',d:1.5,m:2.4,b:15,c:'#1a1410'}];
const RDB={bull:1,prac:0,lean:0,hat:0};
function ensureRdc(){if(!S.rdc||S.rdc.y!==yearN())S.rdc={y:yearN(),me:0,n:0,rv:{}};return S.rdc}
const sundayRodeo=()=>S.day%7===0&&hrNow()>=13&&hrNow()<22;
rodeoModal=function(){ensureM();reModal=null;const pe=festaOn('peao'),ok=rodeoDay()||sundayRodeo();
 if(!ok)return toast('Rodeio: todo domingo à tarde, todo dia 25 e na Festa do Peão (agosto). Pra treinar, tem touro mecânico no Bar do Tonhão à noite.','bad');
 if(S.ev.rdD===S.day)return toast('Você já montou hoje. Volte no próximo rodeio!');
 RD.big=pe?1:0;RDB.prac=0;const C=ensureRdc();
 const tab=Object.entries(C.rv).map(([k,v])=>({n:RIV[k]?RIV[k][1]:'?',p:v})).concat([{n:'Você',p:C.me,me:1}]).sort((a,b)=>b.p-a.p).slice(0,5);
 showModal('<h3>🤠 '+(pe?'Rodeio da Festa do Peão':rodeoDay()?'Rodeio do dia 25':'Rodeio de Domingo')+'</h3><div class="dim">Escolha o touro. Mais bravo = mais difícil, nota e prêmio maiores. Inscrição '+R$(pe?600:200)+'.</div>'+BULLS.map((b,i)=>'<div class="card"><div class="row"><b>🐂 '+b.n+'</b><span class="gold">prêmio ×'+(b.m*(pe?3:1)).toFixed(1)+'</span></div><div class="dim">Bravura '+'🔥'.repeat(i+1)+' · nota +'+b.b+'</div><div class="btns"><button class="b gold" data-act="rdpick" data-v="'+i+'">Montar no '+b.n+'</button></div></div>').join('')+
 '<div class="sec">🏆 CIRCUITO DO ANO '+yearN()+' ('+C.n+'/6 rodeios)</div><div class="card">'+tab.map((x,i)=>'<div class="row"'+(x.me?' style="color:#ffd75e"':'')+'><span>'+(i+1)+'º '+x.n+'</span><b>'+x.p+' pts</b></div>').join('')+'</div><div class="btns"><button class="b gray" data-act="close">Agora não</button></div>')};
function rdCanvasHTML(){return '<div class="row"><b id="rdtm">0.0s / 8s</b><span class="dim" id="rdbl">'+BULLS[RDB.bull].n+'</span></div><canvas id="rdcv" width="320" height="190" style="width:100%;image-rendering:pixelated;border-radius:6px;background:#c8a060"></canvas><div style="position:relative;height:14px;background:linear-gradient(90deg,#c8402a,#e0a431 25%,#4a9a3a 40%,#4a9a3a 60%,#e0a431 75%,#c8402a);border-radius:4px;margin:6px 0"><div id="rdmk" style="position:absolute;top:-3px;width:6px;height:20px;background:#fff;border:1px solid #000;left:50%"></div></div><div class="btns" style="justify-content:center"><button class="b" data-act="rdl" style="font-size:24px;padding:10px 28px">⬅️</button><button class="b" data-act="rdr" style="font-size:24px;padding:10px 28px">➡️</button></div>'}
function rdStart(prac){RDB.prac=prac;Object.assign(RD,{on:1,x:0,v:0,t:0,push:0,err:0,n:0});RDB.hat=0;RDB.fall=0;const b=$('rdbox');if(b)b.innerHTML=rdCanvasHTML();clearInterval(RD.iv);const B=BULLS[RDB.bull];
 RD.iv=setInterval(()=>{const dt=.05;if(!$('rdcv')){clearInterval(RD.iv);RD.iv=null;RD.on=0;return}
  if(RDB.fall){RDB.fall+=dt;rdDraw();if(RDB.fall>1.4){clearInterval(RD.iv);RD.iv=null;rdFinish(false)}return}
  RD.t+=dt;RD.v+=(gauss()*3.1*(1+RD.t*.14)*B.d*(RD.big?1.12:1)+RD.x*1.15)*dt+RD.push;RD.push=0;RD.v*=.96;RD.x+=RD.v*dt;RD.n++;RD.err+=Math.abs(RD.x);
  if(Math.abs(RD.x)>=1){RDB.fall=.01;RDB.hat=1;snd&&snd('hit');return}if(RD.t>=8){clearInterval(RD.iv);RD.iv=null;rdDraw();return rdFinish(true)}rdDraw()},50)}
function rdDraw(){const cv=$('rdcv');if(!cv)return;const g=cv.getContext('2d'),W=320,H=190,t=RD.t,B=BULLS[RDB.bull],f=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const tm=$('rdtm');if(tm)tm.textContent=Math.min(8,t).toFixed(1)+'s / 8s';const mk=$('rdmk');if(mk)mk.style.left='calc('+((clamp(RD.x,-1,1)+1)/2*100)+'% - 3px)';
 f('#7a9ac8',0,0,W,40);for(let i=0;i<60;i++){const x=(i*37)%W,y=8+((i*13)%26);f(['#c83a2a','#3a6ab0','#f0e060','#f4f4f0','#5a8a3a'][i%5],x,y+(Math.sin(frame/3+i)>0.6?-1:0),3,4)}
 f('#5a3a22',0,40,W,6);for(let x=0;x<W;x+=16)f('#3a2414',x,38,3,12);f('#c8a060',0,46,W,H-46);for(let i=0;i<50;i++)f('#b89050',(i*53)%W,50+(i*29)%(H-56),4,2);
 const buck=Math.sin(t*7.5*B.d)*(.22+.06*B.d),hop=Math.max(0,Math.sin(t*7.5*B.d))*14,bx=150+Math.sin(t*2.1)*30,by=140-hop;
 g.save();g.translate(bx,by);g.rotate(buck);
 f('rgba(0,0,0,.25)',-50,30+hop,100,8);
 f(B.c,-40,-22,80,32);f(shade(B.c,16),-40,-22,80,6);f(B.c,30,-28,26,26);f(shade(B.c,-20),48,-18,10,12);f('#e8e0c8',52,-34,4,8);f('#e8e0c8',36,-34,4,8);f('#e8e0c8',56,-36,8,3);f('#e8e0c8',30,-36,8,3);f('#c83a2a',47,-22,3,3);
 const lk=Math.sin(t*15)*6;f(B.c,-36,8,9,22+lk*.3);f(B.c,-22,8,9,22-lk*.3);f(B.c,14,8,9,22+lk*.3);f(B.c,26,8,9,22-lk*.3);f('#1a1410',-36,28,9,4);f('#1a1410',-22,28,9,4);f('#1a1410',14,28,9,4);f('#1a1410',26,28,9,4);
 f('#1a1410',-50,-20+Math.sin(t*12)*6,12,4);f('#d8c8a0',-30,-24,50,3);
 if(!RDB.fall){g.save();g.translate(0,-22);g.rotate(clamp(RD.x,-1.2,1.2)*.9-buck*.5);
  f('#3a4a6a',-8,-6,6,12);f('#3a4a6a',2,-6,6,12);f('#c83a2a',-8,-26,16,20);f('#e8b890',-5,-36,10,10);f('#d8c080',-10,-40,20,4);f('#d8c080',-6,-46,12,6);f('#c83a2a',8,-24,14,4);f('#e8b890',20,-25,4,4);f('#c83a2a',-22,-30,14,4);f('#e8b890',-26,-36,5,7);g.restore()}
 g.restore();
 if(RDB.fall){const k=RDB.fall,dx=(RD.x>0?1:-1)*k*90;f('#c83a2a',bx+dx-8,by-40+k*k*60,16,20);f('#e8b890',bx+dx-5,by-50+k*k*60,10,10);f('#3a4a6a',bx+dx-8,by-20+k*k*60,16,8)}
 if(RDB.hat){const k=RDB.fall||0;f('#d8c080',bx-(RD.x>0?-1:1)*k*50-10,by-90-k*40+k*k*80,20,4);f('#d8c080',bx-(RD.x>0?-1:1)*k*50-6,by-96-k*40+k*k*80,12,6)}
 const cx=(bx+120)%W;f('#f4f4f0',cx,120,14,20);f('#e84a5a',cx,128,14,4);f('#3a6ab0',cx+2,140,4,10);f('#3a6ab0',cx+8,140,4,10);f('#f0c8a0',cx+3,108,9,10);f('#e84a5a',cx+5,112,4,3);f('#f0e060',cx+1,104,12,4)}
function rdFinish(ok){RD.on=0;const B=BULLS[RDB.bull],t=Math.min(8,RD.t),score=Math.round(t*10+(ok?(1-RD.err/RD.n)*20:0)+(ok?B.b:0));
 if(RDB.prac){const bx=$('rdbox');if(bx)bx.innerHTML='<div style="font-size:40px">'+(ok?'💪':'😂')+'</div><div>'+(ok?'Aguentou os 8s no touro mecânico!':'Caiu no colchão aos '+t.toFixed(1)+'s. A galera do bar deu risada!')+'</div><div>Nota '+score+'</div><div class="btns" style="justify-content:center"><button class="b gold" data-act="rdmec">De novo (R$ 10)</button></div>';if(ok&&S.rdPrac!==S.day){S.rdPrac=S.day;gainXP(5,'treino')}return}
 S.ev.rdD=S.day;const big=RD.big,sc=RIV.slice(0,7).map((r,i)=>({n:r[1],i,s:Math.round(rnd(25,95)+(big?4:0))}));sc.push({n:'Você',s:score,me:1});sc.sort((a,b)=>b.s-a.s);const pos=sc.findIndex(x=>x.me)+1,pr=ok?Math.round(([0,8000,4000,2000][pos]||600)*B.m*(big?3:1)):0;
 if(pr)cash(pr,'Rodeio ('+B.n+')');if(ok)gainXP(big?60:30,'rodeio');if(!ok){P.hp=Math.max(5,P.hp-12-RDB.bull*3);P.hurt=.7}
 const C=ensureRdc();const pts=[0,10,6,4,2,1];C.n++;C.me+=ok?(pts[pos]||0):0;sc.forEach((x,k)=>{if(!x.me)C.rv[x.i]=(C.rv[x.i]||0)+(pts[k+1]||0)});
 if(ok&&pos===1){S.ev.rdW=(S.ev.rdW||0)+1;addTrof('🤠','Campeão do rodeio no touro '+B.n+' · ano '+yearN())}
 let fin='';if(C.n===6){const best=Math.max(...Object.values(C.rv),0);if(C.me>=best){cash(50000,'Campeão do Circuito de Rodeio');addTrof('🏆','CAMPEÃO DO CIRCUITO DE RODEIO · ano '+yearN());fin='<div class="gold">🏆 VOCÊ É O CAMPEÃO DO CIRCUITO DO ANO! +R$ 50.000</div>'}else fin='<div class="dim">Circuito encerrado. Ano que vem tem mais!</div>'}
 try{rvRodeo(score)}catch(e){}
 const bx=$('rdbox');if(bx)bx.innerHTML='<div style="font-size:40px">'+(ok?'🏆':'💥')+'</div><div>'+(ok?'Você aguentou os 8 segundos no '+B.n+'!':'O '+B.n+' te derrubou aos '+t.toFixed(1)+'s')+'</div><div>Nota '+score+' · '+pos+'º lugar'+(pr?' · '+R$(pr):'')+'</div>'+fin+sc.slice(0,4).map((x,i)=>'<div class="dim" style="font-size:14px">'+(i+1)+'º '+x.n+' — '+x.s+'</div>').join('')}
Object.assign(ACT,{
 rdpick(e){const fee=RD.big?600:200;if(S.money<fee)return toast('Dinheiro insuficiente','bad');cash(-fee,'Inscrição rodeio');RDB.bull=+e.v;showModal('<h3>🤠 No brete com o '+BULLS[RDB.bull].n+'</h3><div class="dim">Equilibre com ⬅️ ➡️ (ou A/D) contra os pinotes. Aguente 8 segundos!</div><div id="rdbox" class="card"></div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>');rdStart(0)},
 rdmec(){if(S.money<10)return toast('Dinheiro insuficiente','bad');cash(-10,'Touro mecânico');RDB.bull=1;RD.big=0;showModal('<h3>🐂 Touro mecânico do Bar do Tonhão</h3><div class="dim">Treino sem prêmio e sem machucar. Equilibre com ⬅️ ➡️.</div><div id="rdbox" class="card"></div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>');rdStart(1)}
});
// ======================================================================= 9) PESCA DE BARCO + TORNEIO
Object.assign(FISH,{pacu:{n:'Pacu',ic:'🐟',p:40,w:[2,9],r:2,z:['barco','pant']},cachara:{n:'Cachara',ic:'🐟',p:85,w:[4,16],r:3,z:['barco']},jau:{n:'Jaú',ic:'🐋',p:380,w:[20,90],r:4,z:['barco']},piraiba:{n:'Piraíba',ic:'🐋',p:650,w:[40,160],r:4,z:['barco']}});
for(const k of['pacu','cachara','jau','piraiba'])ITEMS[k]={n:FISH[k].n,ic:FISH[k].ic,cat:'fish',p:FISH[k].p};
for(const k of['tilapia','bagre','traira','tucunare','dourado','pintado','pirarucu','bota'])if(FISH[k]&&!FISH[k].z.includes('barco'))FISH[k].z.push('barco');
ZN.barco='Barco no Pantanal';
boatDock=function(){let best=null,bd=1e9;for(let y=146;y<161;y++)for(let x=201;x<233;x++){if(G[ti(x,y)]!==2)continue;const d=Math.hypot(x-216,y-152);if(d<bd){bd=d;best={x:x*TS+8,y:y*TS+8}}}return best||{x:216*TS,y:152*TS}};
let boatFix=0;
function ensureTf(){if(!S.tfish)S.tfish={d:-1,best:0,done:-1};return S.tfish}
const tfDay=()=>dom(S.day)===15;
const inPesq=()=>P.x>196*TS&&P.x<237*TS&&P.y>134*TS&&P.y<165*TS;
const _onFishM=onFish;onFish=function(k,kg){_onFishM(k,kg);const T=ensureTf();if(T.d===S.day&&hrNow()<14&&inPesq()&&!FISH[k].junk&&kg>T.best){T.best=kg;toast('🏆 Torneio: seu maior peixe agora é '+FISH[k].n+' de '+kg+' kg!','good')}};
function tfResult(){const T=ensureTf();if(T.done===S.day)return;T.done=S.day;const sc=RIV.slice(0,6).map(r=>({n:r[1],kg:Math.round(rnd(3,55)*10)/10}));sc.push({n:'Você',kg:T.best,me:1});sc.sort((a,b)=>b.kg-a.kg);const pos=sc.findIndex(x=>x.me)+1,pr=T.best>0?([0,15000,8000,4000][pos]||0):0;
 if(pr)cash(pr,'Torneio de pesca');if(pos===1&&T.best>0)addTrof('🎣','Campeão do Torneio de Pesca do Pantanal ('+T.best+' kg)');
 showModal('<h3>🎣 Resultado do Torneio de Pesca</h3><div class="card">'+sc.map((x,i)=>'<div class="row"'+(x.me?' style="color:#ffd75e"':'')+'><span>'+(i+1)+'º '+x.n+'</span><b>'+x.kg+' kg</b></div>').join('')+'</div>'+(pr?'<div class="gold">Prêmio: '+R$(pr)+'</div>':'<div class="dim">Sem prêmio desta vez.</div>')+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
pesqModal=function(){const T=ensureTf(),own=vOwn('boat'),rent=ensureV().own.boat===2,h=hrNow();
 let tor='';if(tfDay()){if(T.d===S.day)tor='<div class="card">🏆 Você está inscrito no torneio de hoje! Maior peixe até agora: <b>'+(T.best||0)+' kg</b>. Pesque aqui no pesqueiro (píer ou barco) até as 14h.</div>';else if(h<12)tor='<div class="card">🏆 <b>Hoje tem Torneio de Pesca!</b> Das 6h às 14h, vence quem pegar o maior peixe. Prêmios de até R$ 15.000.<div class="btns"><button class="b gold" data-act="tfin">Inscrever (R$ 150)</button></div></div>';else tor='<div class="dim">Inscrições do torneio de hoje encerradas.</div>'}else tor='<div class="dim">🏆 Torneio de pesca todo dia 15, das 6h às 14h.</div>';
 showModal('<h3>🎣 Pesqueiro do Pantanal</h3><div class="card">Ranchos de pescador, barcos e a lagoa grande. Do barco saem os gigantes: jaú, piraíba e cachara.</div>'+tor+(own?(rent?'<div class="dim">🚤 Sua chalana alugada está no píer até o fim do dia.</div>':'<div class="dim">🚤 Sua chalana fica ancorada aqui na lagoa.</div>'):'<div class="card"><b>🚤 Alugar chalana</b> · R$ 250 por dia<div class="dim">Suba no barco e use 🎣 Pescar do barco no meio da lagoa.</div><div class="btns"><button class="b gold" data-act="boatrent">Alugar hoje</button></div></div>')+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')};
Object.assign(ACT,{
 tfin(){const T=ensureTf();if(S.money<150)return toast('Dinheiro insuficiente','bad');cash(-150,'Inscrição torneio de pesca');T.d=S.day;T.best=0;toast('🎣 Inscrito no torneio! Boa pescaria.','good');pesqModal()},
 boatrent(){if(S.money<250)return toast('Dinheiro insuficiente','bad');cash(-250,'Aluguel de chalana');const V=ensureV();V.own.boat=2;V.pos.boat=Object.assign({dir:3},boatDock());S.boatRent=S.day;hideModal();toast('🚤 Chalana alugada! Ela está no píer do pesqueiro.','good')}
});
const _hdFish=hookDay;hookDay=function(){_hdFish();const V=ensureV();if(V.own.boat===2&&S.boatRent<S.day){delete V.own.boat;delete V.pos.boat;if(P.drive==='boat'){P.drive=null}toast('🚤 O aluguel da chalana acabou.')}};
// ======================================================================= 10) ESTAÇÕES NO VISUAL
const SEAT=['rgba(40,120,40,.04)','rgba(200,130,40,.08)','rgba(210,175,90,.17)','rgba(120,210,90,.05)'];
const _dfsSea=drawFarmStatic;
drawFarmStatic=function(g){if(!inRoom()){const s=season(),dr=S.drought>0;const c=dr?'rgba(220,170,60,.22)':SEAT[s];g.fillStyle=c;const x0=Math.max(0,Math.floor(CX/TS)),x1=Math.min(MW-1,Math.ceil((CX+VW)/TS)),y0=Math.max(0,Math.floor(CY/TS)),y1=Math.min(RZ-2,Math.ceil((CY+VH)/TS));
  for(let y=y0;y<=y1;y++){let run=-1;for(let x=x0;x<=x1+1;x++){const t=x<=x1?G[y*MW+x]:-1,ok=t===0||t===1||t===4||t===6;if(ok&&run<0)run=x;else if(!ok&&run>=0){g.fillRect(run*TS,y*TS,(x-run)*TS,TS);run=-1}}}}
 _dfsSea(g)};
const SPART=[];
function seasonParts(g){if(inRoom()||S.weather==='chuva')return;const s=season(),dr=S.drought>0;const kind=s===1?'leaf':s===3?'petal':(s===2||dr)?'dust':null;if(!kind)return;
 if(SPART.length<(kind==='dust'?8:16)&&Math.random()<.2)SPART.push({x:CX+Math.random()*VW,y:CY-10,vx:rnd(-4,10),vy:rnd(6,12),a:Math.random()*6,k:kind,c:kind==='leaf'?pick(['#c86a2a','#e0a431','#a84a2a','#d8b040']):kind==='petal'?pick(['#f4c8d8','#f4f4f0','#e87ab0']):'rgba(200,170,110,.5)'});
 for(let i=SPART.length-1;i>=0;i--){const p=SPART[i];p.a+=.05;p.x+=(p.vx+Math.sin(p.a)*8)/60;p.y+=p.vy/60;if(p.y>CY+VH+10||p.x>CX+VW+20){SPART.splice(i,1);continue}
  if(p.k==='dust'){MB(g,p.c,p.x,p.y,3,1.5)}else{const w=Math.abs(Math.cos(p.a))*2+.6;MB(g,p.c,p.x,p.y,w,1.4)}}}
// ======================================================================= 11) NOITE MAIS VIVA
const moonPh=()=>(S.day%28)/28;
const moonName=()=>{const p=moonPh();return p<.06||p>.94?'🌑 Lua nova':p<.44?'🌓 Lua crescente':p<.56?'🌕 Lua cheia':'🌗 Lua minguante'};
const isNight=()=>{const h=hrNow();return h>=19.3||h<5};
// lobo-guará (só para observar: espécie protegida)
const LGU={on:0,x:0,y:0,tx:0,ty:0,dir:1,ph:0,mv:0,flee:0,howl:8};
function stepLobo(dt){if(inRoom()||!isNight()){LGU.on=0;return}const tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS),b=bioAt(tx,ty);
 if(!LGU.on){if((b===4||FARMZ(tx,ty)||b===1)&&!TOWNZ(tx,ty)&&Math.random()<.003){const a=Math.random()*6.28,r=rnd(170,240),x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r*.6;if(!solidAt(x,y-2)&&G[ti(Math.floor(x/TS),Math.floor(y/TS))]!==2)Object.assign(LGU,{on:1,x,y,tx:x,ty:y,flee:0})}return}
 const d=Math.hypot(LGU.x-P.x,LGU.y-P.y);if(d>520){LGU.on=0;return}
 if(d<85&&!P.sneak)LGU.flee=1;
 if(LGU.flee){const ax=(LGU.x-P.x)/d,ay=(LGU.y-P.y)/d;LGU.tx=LGU.x+ax*60;LGU.ty=LGU.y+ay*40}
 else if(Math.hypot(LGU.tx-LGU.x,LGU.ty-LGU.y)<3){LGU.tx=LGU.x+rnd(-70,70);LGU.ty=LGU.y+rnd(-40,40);LGU.wait=rnd(1,4)}
 if(LGU.wait>0&&!LGU.flee){LGU.wait-=dt;LGU.mv=0}else{const dx=LGU.tx-LGU.x,dy=LGU.ty-LGU.y,dd=Math.hypot(dx,dy)||1,sp=LGU.flee?70:20,nx=LGU.x+dx/dd*sp*dt,ny=LGU.y+dy/dd*sp*dt;if(!solidAt(nx,ny-2)){LGU.x=nx;LGU.y=ny}else{LGU.tx=LGU.x;LGU.ty=LGU.y}LGU.mv=1;LGU.ph+=dt*(LGU.flee?14:7);if(Math.abs(dx)>1)LGU.dir=dx>0?1:-1}
 LGU.howl-=dt;if(LGU.howl<=0&&d<360){LGU.howl=rnd(14,26);howlSnd(1-d/400)}}
function howlSnd(v){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(520,t);o.frequency.linearRampToValueAtTime(430,t+.9);o.frequency.linearRampToValueAtTime(300,t+1.6);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05*Math.max(.15,v),t+.2);g.gain.exponentialRampToValueAtTime(.0001,t+1.7);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+1.8)}catch(e){}}
function drawLobo(g){const x=LGU.x,y=LGU.y,d=LGU.dir,r=(c,dx,dy,w,h)=>MB(g,c,d>0?x+dx:x-dx-w,y+dy,w,h),s=LGU.mv?Math.sin(LGU.ph):0;
 MB(g,'rgba(0,0,0,.25)',x-10,y-1,20,3);for(const[lx,o]of[[-8,s],[-5,-s],[5,-s],[8,s]])r('#1a1410',lx+o*1.2,-13,1.6,13);
 r('#c8622a',-10,-20,19,8);r('#e0803a',-9,-20,16,2.4);r('#1a1410',-2,-22,9,5);r('#c8622a',8,-26,4,7);r('#c8622a',10,-28,7,5);r('#1a1410',15,-26,3,2.4);r('#f4f0e8',11,-24,4,1.2);r('#c8622a',10,-33,2,5);r('#c8622a',13,-33,2,5);r('#1a1410',10,-34,2,2);r('#1a1410',13,-34,2,2);r('#ffe27a',12,-28,1,1);
 r('#c8622a',-16,-20,7,3);r('#f4f0e8',-19,-21,4,3)}
// corujas nos postes e cercas
const OWLS=[];let owlT=3;
function stepOwls(dt){if(inRoom()||!isNight()){OWLS.length=0;return}owlT-=dt;if(owlT<=0&&OWLS.length<2){owlT=rnd(6,14);const cand=[];
 if(typeof DPOLES!=='undefined')for(const p of DPOLES)cand.push([p.x,p.y-36]);if(typeof rfFenceAt!=='undefined')for(const[fx,fy]of rfFenceAt)cand.push([fx*TS+8,fy*TS+2]);if(typeof FZF!=='undefined')for(const[fx,fy]of FZF)cand.push([fx*TS+8,fy*TS+2]);
 for(const t of TREES){if(Math.abs(t.x-P.x)<VW/2&&Math.abs(t.y-P.y)<VH/2)cand.push([t.x,t.y-38])}
 const vis=cand.filter(([x,y])=>Math.abs(x-P.x)<VW/2-10&&Math.abs(y-P.y)<VH/2-10&&Math.hypot(x-P.x,y-P.y)>70);if(vis.length){const[x,y]=pick(vis);OWLS.push({x,y,t:0,fly:0,hoot:rnd(2,6),hd:0})}}
 for(let i=OWLS.length-1;i>=0;i--){const o=OWLS[i];o.t+=dt;o.hoot-=dt;if(o.hoot<=0){o.hoot=rnd(6,12);hootSnd()}o.hd=Math.sin(o.t*.7)>0.3?1:Math.sin(o.t*.7)<-.3?-1:0;
  if(!o.fly&&Math.hypot(o.x-P.x,o.y-P.y)<45)o.fly=.01;if(o.fly){o.fly+=dt;o.x+=60*dt;o.y-=40*dt;if(o.fly>2.5)OWLS.splice(i,1)}else if(Math.abs(o.x-P.x)>VW||Math.abs(o.y-P.y)>VH)OWLS.splice(i,1)}}
function hootSnd(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime;for(const k of[0,.42]){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(380,t+k);o.frequency.linearRampToValueAtTime(330,t+k+.3);g.gain.setValueAtTime(.0001,t+k);g.gain.exponentialRampToValueAtTime(.025,t+k+.05);g.gain.exponentialRampToValueAtTime(.0001,t+k+.32);o.connect(g);g.connect(AC.destination);o.start(t+k);o.stop(t+k+.35)}}catch(e){}}
function drawOwl(g,o){const x=o.x,y=o.y;if(o.fly){const w=((frame>>2)&1);MB(g,'#8a7050',x-7,y-4-(w?2:0),5,2);MB(g,'#8a7050',x+2,y-4-(w?2:0),5,2);MB(g,'#a88a60',x-2,y-5,4,4);return}
 MB(g,'#8a7050',x-3,y-9,6,9);MB(g,'#c8b088',x-2,y-5,4,4);MB(g,'#a88a60',x-3.5,y-12,7,4);MB(g,'#8a7050',x-3.5,y-13,1.4,1.4);MB(g,'#8a7050',x+2.1,y-13,1.4,1.4);
 const bl=((frame+o.x)%180)<6;MB(g,bl?'#6a5030':'#ffe060',x-2.4+o.hd*.6,y-11,1.6,1.6);MB(g,bl?'#6a5030':'#ffe060',x+.8+o.hd*.6,y-11,1.6,1.6);MB(g,'#e0a431',x-.4+o.hd*.6,y-9.5,1,1)}
// música e gente no bar à noite
let BARMUS=null,barNote=0;
function barNight(){const h=hrNow();return h>=19||h<1}
function stepBarMusic(dt){const bx=(VBAR.x+2.5)*TS,by=(VBAR.y+VBAR.h)*TS,d=Math.hypot(P.x-bx,P.y-by),on=barNight()&&!inRoom()&&d<260;
 if(!on){if(BARMUS){try{BARMUS.g.gain.setTargetAtTime(0.0001,AC.currentTime,.3)}catch(e){}BARMUS=null}return}
 try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(!BARMUS){const g=AC.createGain();g.gain.value=0;g.connect(AC.destination);BARMUS={g}}BARMUS.g.gain.setTargetAtTime(.05*(1-d/260),AC.currentTime,.2);
  barNote-=dt;if(barNote<=0){const sc=[196,220,247,294,330,392,440],seq=[0,2,4,2,5,4,2,1,0,2,4,6,5,4,2,0],i=Math.floor(frame/14)%seq.length;barNote=.28;const t=AC.currentTime,o=AC.createOscillator(),e=AC.createGain();o.type='triangle';o.frequency.value=sc[seq[i]];e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(.8,t+.01);e.gain.exponentialRampToValueAtTime(.0001,t+.26);o.connect(e);e.connect(BARMUS.g);o.start(t);o.stop(t+.28)}}catch(e){}}
const BARPPL=[[-2.2,1.2,'#3a6ab0',null],[-.8,1.9,'#c83a2a','#d8c080'],[1.6,1.4,'#5a8a3a','#6a4a2a'],[3.2,2.2,'#e0a431',null],[4.6,1.3,'#8a4ac8','#d8c080']];
function drawBarCrowd(L,add){if(!barNight())return;const bx=VBAR.x*TS,by=(VBAR.y+VBAR.h)*TS;
 BARPPL.forEach((p,i)=>{const x=bx+p[0]*TS,y=by+p[1]*TS+4;add(x,y,g=>OL(g,x,y+3,30,42,q=>drawPerson(q,{x,y,dir:i%2?2:3,ph:frame/12+i,mv:(frame>>5)%3===i%3?1:0,shirt:p[2],hair:'#2a1a10',hat:p[3],pants:'#33384a',g:i===3?'f':null})))});
 const vx=bx+6.2*TS,vy=by+1.6*TS;add(vx,vy,g=>{OL(g,vx,vy+3,30,42,q=>drawPerson(q,{x:vx,y:vy,dir:2,ph:0,mv:0,shirt:'#f4f0e8',hair:'#1a1a1a',hat:'#1a1a1a',pants:'#2a2a3a'}));const st=(frame>>2)&1;MB(g,'#8a5a2a',vx-9,vy-16,9,6);MB(g,'#5a3a22',vx-14,vy-15,6,2);MB(g,'#1a1410',vx-6,vy-14,2,2);if(st)MB(g,'#ffe27a',vx-4,vy-18,1,1);
  if(RMODE!==4)for(let k=0;k<3;k++){const t=((frame+k*40)%120)/120;MB(g,'rgba(255,240,180,'+(1-t).toFixed(2)+')',vx-10+Math.sin(t*6+k)*6,vy-24-t*26,2,3)}})}
// ======================================================================= 12) CIDADE GRANDE
const BUSST={x:142*TS+8,y:46*TS+12};
function drawBusStop(g){const x=BUSST.x,y=BUSST.y;MB(g,'rgba(0,0,0,.2)',x-14,y-1,28,3);MB(g,'#6a6e76',x-12,y-22,2,22);MB(g,'#6a6e76',x+10,y-22,2,22);MB(g,'#2a6a8a',x-14,y-26,28,5);MB(g,'#3a8ab0',x-14,y-26,28,1.4);MB(g,'#7a5232',x-10,y-8,20,2);MB(g,'#5a3a22',x-9,y-6,1.4,6);MB(g,'#5a3a22',x+8,y-6,1.4,6);
 MB(g,'#f0c020',x+14,y-30,10,10);MB(g,'#1a1a1a',x+18.4,y-20,1.4,20);ptext(g,'BUS',x+14.5,y-27.5,'#1a1a1a')}
function cityArt(cv){const g=cv.getContext('2d'),W=cv.width,H=cv.height,f=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};const n=isNight();
 const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,n?'#0a1030':'#6aa8e0');sky.addColorStop(1,n?'#3a2a5a':'#f0c890');g.fillStyle=sky;g.fillRect(0,0,W,H);
 if(n)for(let i=0;i<40;i++)f('#fff',(i*71)%W,(i*37)%(H*.4),1,1);
 for(let i=0;i<14;i++){const bw=20+((i*37)%30),bh=50+((i*53)%90),x=i*26-10,y=H-30-bh;f(n?'#1a2030':'#4a5a70',x,y,bw,bh);for(let wy=y+6;wy<H-34;wy+=8)for(let wx=x+4;wx<x+bw-4;wx+=7)if(((wx*3+wy*7+i)%5)>1)f(n?'#ffe08a':'#a8c8e0',wx,wy,3,4)}
 f('#3a3a3a',0,H-30,W,30);for(let x=0;x<W;x+=24)f('#e8e8e0',x,H-16,12,2);g.fillStyle='#ffd75e';g.font='bold 18px monospace';g.textAlign='center';g.fillText('CAMPO GRANDE',W/2,22)}
const SHOP=[{id:'pres',n:'🎁 Presente para quem você ama',p:800,d:'Deixa seu parceiro(a) feliz (+reputação na família).'},{id:'rel',n:'⌚ Relógio de ouro',p:25000,d:'Status de fazendeiro de sucesso: +3 reputação.'},{id:'chap',n:'🤠 Chapéu de couro premium',p:1800,d:'Chapéu de grife para as festas: +1 reputação.'},{id:'bino',n:'🔭 Binóculo profissional',p:4500,d:'Para a caça: enxerga bicho mais longe.'}];
function cityModal(msg){const c='<canvas id="citycv" width="320" height="150" style="width:100%;border-radius:6px;display:block"></canvas>';
 showModal('<h3>🏙️ Campo Grande</h3>'+c+(msg?'<div class="card">'+msg+'</div>':'')+'<div class="dim">'+(dayHour()|0)+'h · '+moonName()+'</div>'+
 '<div class="btns" style="flex-wrap:wrap"><button class="b gold" data-act="cshop">🛍️ Shopping</button><button class="b gold" data-act="ccar">🚗 Concessionária</button><button class="b gold" data-act="cexpo">🐂 Exposição Nacional</button><button class="b" data-act="cchur">🍖 Churrascaria (R$ 90)</button><button class="b" data-act="chotel">🏨 Hotel (R$ 350)</button><button class="b gray" data-act="cback">🚌 Voltar para a vila</button></div>');
 const cv=document.getElementById('citycv');if(cv)cityArt(cv)}
function busModal(){const heli=S.emp&&S.emp.air&&S.emp.air.heli;showModal('<h3>🚌 Ponto de ônibus</h3><div class="card">Ônibus da Viação Pantaneira para <b>Campo Grande</b>, a cidade grande: shopping, concessionária, churrascaria, hotel e a Exposição Agropecuária Nacional.</div><div class="btns"><button class="b gold" data-act="cgo" data-v="bus">🚌 Ônibus · R$ 120 · 3 horas</button>'+(heli?'<button class="b gold" data-act="cgo" data-v="heli">🚁 Helicóptero · 40 min</button>':'')+'<button class="b gray" data-act="close">Agora não</button></div>')}
Object.assign(ACT,{
 cgo(e){if(e.v==='bus'){if(S.money<120)return toast('Dinheiro insuficiente','bad');cash(-120,'Passagem de ônibus');S.t+=3/24}else S.t+=.7/24;S.inCity=1;cityModal(e.v==='bus'?'Depois de 3 horas de estrada, você desce na rodoviária de Campo Grande.':'O helicóptero pousa no heliporto do shopping.')},
 cshop(){showModal('<h3>🛍️ Shopping Campo Grande</h3>'+SHOP.map(s=>'<div class="card"><div class="row"><b>'+s.n+'</b><span class="gold">'+R$(s.p)+'</span></div><div class="dim">'+s.d+'</div><div class="btns">'+(s.id!=='pres'&&S.cityItems&&S.cityItems[s.id]?'<span class="dim">✔ Você já tem</span>':'<button class="b gold" data-act="cbuy" data-v="'+s.id+'">Comprar</button>')+'</div></div>').join('')+'<div class="btns"><button class="b gray" data-act="ccity">⬅️ Voltar</button></div>')},
 cbuy(e){const s=SHOP.find(x=>x.id===e.v);if(!s)return;if(S.money<s.p)return toast('Dinheiro insuficiente','bad');cash(-s.p,'Shopping: '+s.n);S.cityItems=S.cityItems||{};S.cityItems[s.id]=1;S.t+=.5/24;
  if(s.id==='pres')S.rep=Math.min(100,(S.rep||0)+1);if(s.id==='rel')S.rep=Math.min(100,(S.rep||0)+3);if(s.id==='chap')S.rep=Math.min(100,(S.rep||0)+1);if(s.id==='bino'&&S.h&&S.h.gear)S.h.gear.binoc=1;
  toast('🛍️ Comprou: '+s.n,'good');ACT.cshop()},
 ccar(){const E=ensureEmp();showModal('<h3>🚗 Concessionária</h3>'+ECARS.map(c=>'<div class="card"><div class="row"><b>'+c.n+'</b><span class="gold">'+R$(c.p)+'</span></div><div class="dim">'+(c.d||'')+'</div><div class="btns">'+(E.lux.cars[c.id]?'<span class="dim">✔ Na sua garagem</span>':'<button class="b gold" data-act="ccarb" data-v="'+c.id+'">Comprar</button>')+'</div></div>').join('')+'<div class="btns"><button class="b gray" data-act="ccity">⬅️ Voltar</button></div>')},
 ccarb(e){ACT.elcar(e);ACT.ccar()},
 cexpo(){const ok=S.expoN!==curMon()+yearN()*12;const best=S.herd.slice().sort((a,b)=>valueOf(b)-valueOf(a)).slice(0,3);
  showModal('<h3>🐂 Exposição Agropecuária Nacional</h3><div class="dim">Os melhores criadores do Brasil. Uma inscrição por mês (R$ 2.000). Campeão nacional vale 30% a mais para sempre.</div>'+(ok?best.map(a=>'<div class="card"><div class="row"><b>'+a.name+'</b><span class="dim">'+BREEDS[a.breed].n+' · '+Math.round(a.w)+' kg</span></div><div class="dim">Valor '+R$(valueOf(a))+(a.nat?' · 🏅 já é campeão nacional':'')+'</div><div class="btns"><button class="b gold" data-act="cexpr" data-v="'+a.id+'">Inscrever</button></div></div>').join('')||'<div class="dim">Você não tem animais.</div>':'<div class="card">Você já competiu este mês. Volte no mês que vem!</div>')+'<div class="btns"><button class="b gray" data-act="ccity">⬅️ Voltar</button></div>')},
 cexpr(e){const a=S.herd.find(x=>x.id==e.v);if(!a)return;if(S.money<2000)return toast('Dinheiro insuficiente','bad');cash(-2000,'Inscrição Exposição Nacional');S.expoN=curMon()+yearN()*12;S.t+=2/24;
  const me=Math.log10(Math.max(1000,valueOf(a)))*20+(a.gen||0)/10+rnd(-6,6),sc=['Agropecuária Mato Grosso','Fazenda São Paulo Genética','Rancho Gaúcho','Grupo Goiás Elite','Cabanha Minas','Fazenda Bahia Real','Nelore Paraná'].map(n=>({n,s:rnd(78,104)}));sc.push({n:'Você · '+a.name,s:me,me:1});sc.sort((x,y)=>y.s-x.s);const pos=sc.findIndex(x=>x.me)+1,pr=[0,80000,35000,15000][pos]||0;
  if(pr)cash(pr,'Exposição Nacional');if(pos===1){a.nat=1;addTrof('🏅','Grande Campeão Nacional: '+a.name);S.rep=Math.min(100,(S.rep||0)+5)}gainXP(pos<=3?60:20,'exposição');
  showModal('<h3>🐂 Resultado da Exposição Nacional</h3><div class="card">'+sc.map((x,i)=>'<div class="row"'+(x.me?' style="color:#ffd75e"':'')+'><span>'+(i+1)+'º '+x.n+'</span><b>'+x.s.toFixed(1)+'</b></div>').join('')+'</div>'+(pr?'<div class="gold">'+(pos===1?'🏅 GRANDE CAMPEÃO NACIONAL! '+a.name+' agora vale 30% a mais. ':'')+'Prêmio '+R$(pr)+'</div>':'<div class="dim">Não deu pódio desta vez. Melhore a genética!</div>')+'<div class="btns"><button class="b gray" data-act="ccity">⬅️ Voltar</button></div>')},
 cchur(){if(S.money<90)return toast('Dinheiro insuficiente','bad');cash(-90,'Churrascaria rodízio');P.hp=Math.min(100,P.hp+45);S.t+=1.2/24;cityModal('🍖 Picanha, costela, cupim... Você saiu rolando da churrascaria. (+45 vida)')},
 chotel(){if(S.money<350)return toast('Dinheiro insuficiente','bad');cash(-350,'Hotel em Campo Grande');const h=hrNow();S.t+=((31-h)%24||24)/24;P.hp=100;cityModal('🏨 Você dormiu num hotel com ar-condicionado e café da manhã. Acordou novinho!')},
 ccity(){cityModal()},
 cback(){if(S.money<120&&!(S.emp&&S.emp.air&&S.emp.air.heli))return toast('Precisa de R$ 120 para a passagem','bad');if(!(S.emp&&S.emp.air&&S.emp.air.heli)){cash(-120,'Passagem de ônibus');S.t+=3/24}else S.t+=.7/24;S.inCity=0;P.x=BUSST.x;P.y=BUSST.y+10;camInit=0;hideModal();toast('🚌 De volta à vila.','good')}
});
// ======================================================================= ganchos gerais
const _updMore=update;update=function(dt){_updMore(dt);stepCrew(dt);stepLobo(dt);stepOwls(dt);stepBarMusic(dt);
 if(!boatFix&&S){boatFix=1;const V=ensureV();if(V.pos.boat&&!isWaterT(V.pos.boat.x,V.pos.boat.y))delete V.pos.boat}
 const T=S.tfish;if(T&&T.d===S.day&&hrNow()>=14&&T.done!==S.day&&!paused())tfResult();
 if(isNight()&&S.moonT!==S.day&&hrNow()>=19.3&&hrNow()<20){S.moonT=S.day;const p=moonPh();if(p>.44&&p<.56)toast('🌕 Lua cheia hoje! A noite fica clara e o lobo-guará sai para passear.')}};
const _evoMore=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoMore(L,x0,x1,y0,y1);if(inRoom())return;const add=(x,y,fn,m)=>{if(x>x0-(m||80)&&x<x1+(m||80)&&y>y0-30&&y<y1+110)L.push([y,10,{draw:fn}])};
 const C=S.crew;if(C)for(const c of C.list){const r=CRW[c.id];if(r&&r.vis)add(r.x,r.y,g=>drawCrew(g,c,r),60)}
 const B=S.sab;if(B)for(const z of B.esc){add(z.x,z.y+10,g=>OL(g,z.x+8.5,z.y+12,28,24,q=>drawCow(q,z.a,z.x,z.y,z.dir,0)),40)}
 if(LGU.on)add(LGU.x,LGU.y,drawLobo,40);for(const o of OWLS)add(o.x,o.y+40,g=>drawOwl(g,o),40);
 drawBarCrowd(L,add);add(BUSST.x,BUSST.y,drawBusStop,60)};
const _dpMore=drawPart;drawPart=function(g){_dpMore(g);seasonParts(g)};
// lua: reflexo nos lagos, estrelas na água e luar (depois da luz da noite)
const _dgMore=drawGuide;drawGuide=function(g){
 if(!inRoom()&&isNight()){const p=moonPh(),full=1-Math.abs(p-.5)*2,ox=CX,oy=CY;
  if(full>.3){g.save();g.globalCompositeOperation='lighter';g.fillStyle='rgba(40,55,90,'+(full*.09).toFixed(3)+')';g.fillRect(0,0,VW,VH);g.restore()}
  const x0=Math.floor(CX/TS),y0=Math.floor(CY/TS),x1=Math.ceil((CX+VW)/TS),y1=Math.ceil((CY+VH)/TS);let mx=null,md=1e9;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(G[ti(x,y)]!==2)continue;const h=hs(x,y);if(h<.18){const tw=Math.sin(frame/18+h*40)>.2;if(tw)MB(g,'rgba(255,255,230,.8)',x*TS+h*14-ox,y*TS+hs(y,x)*14-oy,1,1)}const d=Math.abs(x*TS-(CX+VW*.5))+Math.abs(y*TS-(CY+VH*.35));if(d<md&&G[ti(x+1,y)]===2&&G[ti(x-1,y)]===2&&G[ti(x,y+1)]===2){md=d;mx=[x,y]}}
  if(mx&&full>.05){const X=mx[0]*TS+8-ox,Y=mx[1]*TS+8-oy,r=5*full+2;for(let i=0;i<4;i++){const w=r*2-i*2+Math.sin(frame/10+i)*1.5;MB(g,'rgba(255,250,220,'+(.5-i*.1)*full+')',X-w/2,Y+i*2.2,w,1.4)}}}
 _dgMore(g)};
// interações
const _ilMore=interactList;interactList=function(){const L=_ilMore();if(inRoom())return L;const near=(x,y,r)=>Math.hypot(x-P.x,y-P.y)<(r||40);
 if(near(BUSST.x,BUSST.y,36))L.push({x:BUSST.x,y:BUSST.y,r:24,label:'🚌 Ponto de ônibus: viajar para Campo Grande',fn:busModal});
 if(P.drive==='boat')L.push({x:P.x,y:P.y,r:999,label:'🎣 Pescar do barco',fn:()=>fishStart('barco')});
 const C=S.crew;if(C)for(const c of C.list){const r=CRW[c.id];if(r&&r.vis&&near(r.x,r.y,30))L.push({x:r.x,y:r.y,r:22,label:'💬 Falar com '+c.nm+' ('+CREWR[c.role].n+')',fn:()=>toast('💬 '+c.nm+': “'+(c.hum>65?pick(['Tá tudo nos conformes, patrão!','Serviço é o que não falta, mas tô feliz aqui.','Esse gado tá bonito demais!']):c.hum>35?pick(['Tô meio cansado, viu...','Uma folguinha ia bem.','Tá puxado, mas a gente vai levando.']):pick(['Patrão, desse jeito não dá...','Tô pensando em ir embora.','Salário tá curto e o serviço pesado.']))+'”')})}
 const B=S.sab;if(B)for(const z of B.esc){if(near(z.x+8,z.y+10,34))L.push({x:z.x+8,y:z.y+10,r:24,label:'🐄 Tocar '+z.a.name+' de volta pra fazenda',fn:()=>{const i=B.esc.indexOf(z);if(i<0)return;B.esc.splice(i,1);S.herd.push(z.a);toast('🐄 '+z.a.name+' voltou pro pasto!','good')}})}
 if(B&&B.last&&!B.last.rep&&S.day-B.last.d<=7){const d=BLD.find(b=>b.id==='delegacia');if(d&&near(d.door*TS+8,(d.y+d.h)*TS+8,40))L.push({x:d.door*TS+8,y:(d.y+d.h)*TS+8,r:30,label:'🚔 Denunciar sabotagem ao Xerife',fn:denuncia})}
 if(LGU.on&&near(LGU.x,LGU.y,140))L.push({x:LGU.x,y:LGU.y,r:140,label:'👀 Observar o lobo-guará',fn:()=>{if(!S.loboV){S.loboV=1;gainXP(15,'natureza');toast('🐺 Que bicho bonito! O lobo-guará é o maior canídeo da América do Sul e come até fruta-do-lobo. Ele é protegido: não pode caçar. (+15 XP)','good')}else toast('🐺 O lobo-guará te olha de longe com as orelhas em pé...')}});
 return L};
// atalhos de menu: equipe em Melhorias e touro mecânico no bar
const _pUpMore=pUp;pUp=function(){const C=ensureCrew();return '<div class="card"><div class="row"><b>👷 Equipe da fazenda</b><span class="gold">'+C.list.length+'/6</span></div><div class="dim">Contrate vaqueiro, tratador, cerqueiro, tratorista e ordenhador. Eles trabalham na sua frente.</div><div class="btns"><button class="b gold" data-act="crew">Abrir equipe</button></div></div>'+_pUpMore()};
ACT.crew=()=>crewModal();
if(typeof barModal==='function'){const _bmMore=barModal;barModal=function(){_bmMore();const box=document.getElementById('mbox');if(!box)return;const btns=box.querySelector('.btns:last-child');const div=document.createElement('div');div.className='card';div.innerHTML=barNight()?'<div class="row"><b>🐂 Touro mecânico</b><span class="gold">'+R$(10)+'</span></div><div class="dim">Treine para o rodeio, sem prêmio e sem se machucar.</div><div class="btns"><button class="b gold" data-act="rdmec">Montar</button></div>':'<div class="dim">🐂 O touro mecânico e a viola começam às 19h.</div>';if(btns)box.insertBefore(div,btns);else box.appendChild(div)}}
if(typeof MAPPOI==='function'){}
if(typeof GUIDE!=='undefined'){GUIDE.push({lv:2,ic:'👷',t:'Equipe da fazenda',h:'Em Melhorias › 👷 Equipe, contrate até 6 peões (vaqueiro, tratador, cerqueiro, tratorista e ordenhador). Cada um tem salário e humor: dê bônus e folga para mantê-los felizes.'});
 GUIDE.push({lv:3,ic:'🤠',t:'Rodeio e circuito',h:'Tem rodeio todo domingo à tarde e todo dia 25 na Arena. Escolha o touro (Mansinho, Bandido, Tornado ou Pesadelo). Seis rodeios fecham o Circuito do ano, com R$ 50.000 para o campeão. Treine no touro mecânico do Bar do Tonhão à noite.'});
 GUIDE.push({lv:3,ic:'🚌',t:'Cidade grande',h:'No ponto de ônibus da vila (perto do Bar do Tonhão) você viaja para Campo Grande: shopping, concessionária, churrascaria, hotel e a Exposição Nacional, onde seu melhor animal pode virar Grande Campeão.'});
 GUIDE.push({lv:2,ic:'🎣',t:'Pesca de barco',h:'No Pesqueiro do Pantanal dá para alugar uma chalana (R$ 250/dia) e pescar do barco os gigantes: jaú, piraíba e cachara. Todo dia 15 tem Torneio de Pesca das 6h às 14h.'})}
