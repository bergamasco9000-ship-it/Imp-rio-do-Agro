// ===== Serviços de controle de javali (contratos) + pragas na lavoura (javali, capivara, maritaca) =====
// ---------- javali/capivara presos numa área própria
const _wmH=wmove;wmove=function(a,vx,vy,dt){if(!a.rc)return _wmH(a,vx,vy,dt);const rc=a.rc,nx=a.x+vx*dt,ny=a.y+vy*dt,ok=(x,y)=>{const tx=Math.floor(x/TS),ty=Math.floor(y/TS);return tx>=rc[0]&&ty>=rc[1]&&tx<=rc[2]&&ty<=rc[3]&&!SOL[ti(tx,ty)]&&G[ti(tx,ty)]!==2};let m=0;if(ok(nx,a.y)){a.x=nx;m=1}if(ok(a.x,ny)){a.y=ny;m=1}return m};
function fixRcTargets(){for(const a of WILD){if(!a.rc||a.st==='dead')continue;const rc=a.rc,tx=Math.floor(a.tx/TS),ty=Math.floor(a.ty/TS);if(tx<rc[0]||tx>rc[2]||ty<rc[1]||ty>rc[3]){a.tx=(rc[0]+Math.random()*(rc[2]-rc[0]+1))*TS;a.ty=(rc[1]+Math.random()*(rc[3]-rc[1]+1))*TS}}}
function spawnIn(sp,rc,tag){const a=spawnWild(sp,1);if(!a)return null;for(let k=0;k<30;k++){const x=ri(rc[0],rc[2]),y=ri(rc[1],rc[3]);if(!SOL[ti(x,y)]&&G[ti(x,y)]!==2){a.x=x*TS+8;a.y=y*TS+8;break}}a.tx=a.x;a.ty=a.y;a.rc=rc;Object.assign(a,tag);return a}
// ---------- contratos
const CTLOC={
 cana:{n:'Canavial da Usina Santa Cruz',rc:()=>[CANA.x0,CANA.y0,CANA.x1,CANA.y1],c:()=>({x:(CANA.x0+CANA.x1)/2*TS,y:(CANA.y0+CANA.y1)/2*TS}),who:()=>'Usina Santa Cruz',crop:'canavial'},
 rosa:{n:'Sítio da Família Silva',rc:()=>{const L=hmLot(HSD('rosa'));return[L.x0,L.y0,L.x1,L.y1]},c:()=>{const H=HSD('rosa');return{x:(H.x+H.hw+3)*TS,y:(H.y+2)*TS}},who:()=>'Dona Rosa Silva',crop:'milharal',npc:'rosa'},
 ze:{n:'Sítio do Zé do Campo',rc:()=>{const L=hmLot(HSD('ze'));return[L.x0,L.y0,L.x1,L.y1]},c:()=>{const H=HSD('ze');return{x:(H.x+H.hw+3)*TS,y:(H.y+2)*TS}},who:()=>'Zé do Campo',crop:'soja',npc:'ze'},
 benedita:{n:'Sítio da Dona Benedita',rc:()=>{const L=hmLot(HSD('benedita'));return[L.x0,L.y0,L.x1,L.y1]},c:()=>{const H=HSD('benedita');return{x:(H.x+H.hw+3)*TS,y:(H.y+2)*TS}},who:()=>'Dona Benedita',crop:'mandiocal',npc:'benedita'},
 bene:{n:'Rancho do Seu Bené',rc:()=>{const L=hmLot(HSD('bene'));return[L.x0,L.y0,L.x1,L.y1]},c:()=>{const H=HSD('bene');return{x:(H.x+H.hw+3)*TS,y:(H.y+2)*TS}},who:()=>'Seu Bené',crop:'roça',npc:'bene'}
};
function ensureCt(){if(!S.hct)S.hct={offers:[],act:null,done:0,next:S.day+3,kills:0};return S.hct}
function mkOffer(){const C=ensureCt(),keys=Object.keys(CTLOC).filter(k=>!C.offers.some(o=>o.loc===k)&&(!C.act||C.act.loc!==k));if(!keys.length)return null;
 const loc=Math.random()<.45&&keys.includes('cana')?'cana':pick(keys),L=CTLOC[loc],n=loc==='cana'?ri(5,9):ri(3,5),who=loc==='cana'&&Math.random()<.5?pick(RIV.map(r=>r[0])):L.who();
 const o={id:Date.now()%1e7,loc,n,who,pay:Math.round((loc==='cana'?650:480)*n*(1+LV()*.03)/100)*100,exp:S.day+ri(4,7)};C.offers.push(o);return o}
const ctActive=()=>S.hct&&S.hct.act;
function ctAccept(id){const C=ensureCt(),o=C.offers.find(q=>q.id===id);if(!o)return;if(C.act)return toast('Termine o serviço atual primeiro','bad');C.offers=C.offers.filter(q=>q!==o);C.act=Object.assign(o,{kills:0,sp:0,start:S.day});toast('🐗 Serviço aceito: '+o.n+' javalis em '+CTLOC[o.loc].n+'. Uma seta mostra o caminho. Vá com cães — de caminhonete é mais rápido!','good')}
function ctSpawn(){const A=S.hct.act,L=CTLOC[A.loc],rc=L.rc();A.sp=1;for(let i=0;i<A.n-A.kills;i++){const a=spawnIn('boar',rc,{ct:A.id});if(a){a.kg=rnd(70,130)*(i===0?1.3:1);a.male=i===0}}
 const truck=P.drive==='pick'||(S.veh&&S.veh.pos.pick&&Math.hypot(S.veh.pos.pick.x-P.x,S.veh.pos.pick.y-P.y)<200);A.pro=truck&&partyDogs().length>0;
 toast('🐗 Você chegou: '+L.who()+' disse que a vara de javalis está no '+L.crop+'.'+(A.pro?' Chegou de caminhonete com os cães: serviço profissional (+20% no pagamento)!':''),'good')}
function ctFinish(ok){const C=S.hct,A=C.act;if(!A)return;WILD.forEach(a=>{if(a.ct===A.id&&a.st!=='dead'){a.rc=null;a.st='flee'}});for(let i=WILD.length-1;i>=0;i--)if(WILD[i].ct===A.id&&WILD[i].st!=='dead')WILD.splice(i,1);
 if(ok){let pay=A.pay;if(A.pro)pay=Math.round(pay*1.2);if(S.day===A.start)pay=Math.round(pay*1.15);cash(pay,'Serviço: '+CTLOC[A.loc].n);C.done++;gainXP(60+A.n*12,'serviço');S.rep=Math.min(100,S.rep+2);const L=CTLOC[A.loc];if(L.npc)addFr(L.npc,12);const ri2=RIV.findIndex(r=>r[0]===A.who);if(ri2>=0&&S.rv)S.rv.rel[ri2]=Math.min(100,S.rv.rel[ri2]+8);
  showModal('<h3>✅ Serviço concluído!</h3><div class="card">'+A.who+' agradeceu: “Acabou com a praga, '+(S.farmName||'patrão')+'!”<br>Pagamento: <b class="grn">'+R$(pay)+'</b>'+(A.pro?' (inclui bônus de serviço profissional)':'')+(S.day===A.start?' · bônus de rapidez':'')+'<br><span class="dim">As carcaças são suas: venda no Posto do Caçador.</span></div><div class="btns"><button class="b gold" data-act="close">Boa!</button></div>')}
 else toast('⌛ O prazo do serviço em '+CTLOC[A.loc].n+' acabou. '+A.who+' chamou outro caçador.','bad');C.act=null}
const _kwH=killWild;killWild=function(a){const was=a.st;_kwH(a);if(was==='dead')return;const A=S.hct&&S.hct.act;if(a.ct&&A&&a.ct===A.id){A.kills++;tt('ctk','🐗 Javali abatido: '+A.kills+'/'+A.n,'good',2);if(A.kills>=A.n)setTimeout(()=>ctFinish(true),600)}if(a.pest){S.pest.k=(S.pest.k||0)+1}};
const _hlH=huntLegal;huntLegal=function(){const A=S.hct&&S.hct.act;if(A&&A.sp){const rc=CTLOC[A.loc].rc(),tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS);if(tx>=rc[0]-6&&tx<=rc[2]+6&&ty>=rc[1]-6&&ty<=rc[3]+6)return true}if(WILD.some(a=>a.pest&&a.st!=='dead'&&(Math.hypot(a.x-P.x,a.y-P.y)<520||(typeof AIM!=='undefined'&&Math.hypot(a.x-(AIM.rx+(AIM.sx||0)),a.y-6-(AIM.ry+(AIM.sy||0)))<40))))return true;return _hlH()};
// ---------- canavial
const CANED=new Set();
function drawCaneRow(g,ty){const C=CANA;for(let tx=C.x0;tx<=C.x1;tx++){const x=tx*TS,y=ty*TS+15,dmg=CANED.has(ti(tx,ty)),h=hs(tx,ty);
 for(let k=0;k<4;k++){const sx=x+2+k*3.6+h*2,H=(dmg?9:24)+((h*31+k*7)%5),sw=Math.sin(frame/24+tx*.6+k)*1.2;
  Rr(g,dmg?'#8a8a3a':'#5a8a2a',sx,y-H,1.6,H);for(let j=4;j<H;j+=5)Rr(g,'#a8b860',sx,y-j,1.6,.6);
  if(!dmg){Rr(g,'#4a9a3a',sx-3+sw,y-H-2,4,1.2);Rr(g,'#5aaa3a',sx+1+sw,y-H-4,4,1.2);Rr(g,'#3a7a2a',sx-2+sw*.6,y-H+6,3,1);Rr(g,'#6aba4a',sx+1+sw,y-H+3,4,1)}else Rr(g,'#6a5a2a',sx-2,y-2,5,1.4)}}}
function drawUsinaSign(g){const x=(CANA.x0-2)*TS+2,y=(CANA.y0)*TS+12;Rr(g,'#5a3a22',x,y-20,2,20);Rr(g,'#5a3a22',x+26,y-20,2,20);signBoard(g,x+14,y-26,'USINA SANTA CRUZ','#2a6a2a','#f4f0d8','#1a3a1a')}
const _mpH=movePlayer;movePlayer=function(dx,dy){const tx=Math.floor(P.x/TS),ty=Math.floor((P.y-2)/TS);if(tx>=CANA.x0&&tx<=CANA.x1&&ty>=CANA.y0&&ty<=CANA.y1&&!CANED.has(ti(tx,ty))){dx*=P.drive?.45:.6;dy*=P.drive?.45:.6}return _mpH(dx,dy)};
// ---------- pragas na lavoura
function ensurePest(){if(!S.pest)S.pest={scare:0,tela:0,k:0,lost:0};return S.pest}
const fieldRc=()=>{const f=fieldRect();return[f[0]-2,f[1]-2,f[2]+2,f[3]+2]};
const BIRDS=[];let pestHour=-1;
function pestHourly(){const P2=ensurePest(),h=Math.floor(S.t*24),n=S.crops.length;if(n<4)return;
 const night=h>=20||h<5,alive=WILD.filter(a=>a.pest&&a.st!=='dead');
 if(night&&!alive.some(a=>a.sp==='boar')&&Math.random()<.13*(P2.tela?.3:1)*(1-guardScore()/200)){const k=ri(2,3);for(let i=0;i<k;i++)spawnIn('boar',fieldRc(),{pest:1,kg:rnd(50,110)});toast('🐗 Barulho na lavoura: javalis estão comendo sua plantação!','bad')}
 if((h>=17&&h<20)&&!alive.some(a=>a.sp==='capy')&&Math.random()<.1*(P2.tela?.5:1)){for(let i=0;i<ri(2,4);i++)spawnIn('capy',fieldRc(),{pest:1});toast('🦫 Capivaras saíram do brejo e estão na sua lavoura!','bad')}
 if(((h>=6&&h<9)||(h>=16&&h<18))&&!BIRDS.length&&S.crops.some(c=>['milho','tomate','cafe','soja','trigo'].includes(c.c))&&Math.random()<.22*Math.pow(.5,P2.scare)*((S.up.pulv||0)?.5:1)){spawnBirds()}
 if(h===6)for(let i=WILD.length-1;i>=0;i--){const a=WILD[i];if(a.pest&&a.st!=='dead'&&!(a.held&&a.held.length)&&a.sp==='boar')WILD.splice(i,1)}
 if(h===20)for(let i=WILD.length-1;i>=0;i--){const a=WILD[i];if(a.pest&&a.st!=='dead'&&a.sp==='capy')WILD.splice(i,1)}}
function spawnBirds(){const f=fieldRect(),n=ri(5,9);for(let i=0;i<n;i++)BIRDS.push({x:(f[0]-14)*TS+rnd(-40,40),y:(f[1]-6)*TS+rnd(-30,30),tx:(f[0]+Math.random()*(f[2]-f[0]+1))*TS+8,ty:(f[1]+Math.random()*(f[3]-f[1]+1))*TS+8,st:'in',t:0,ph:Math.random()*6});toast('🦜 Um bando de maritacas pousou na lavoura!','bad')}
let pestAcc=0;
function stepPests(dt){const P2=ensurePest(),h=Math.floor(S.t*24);if(h!==pestHour){pestHour=h;pestHourly()}fixRcTargets();
 pestAcc+=dt;const tick=pestAcc>=1.6;if(tick)pestAcc=0;
 if(tick){for(const a of WILD){if(!a.pest||a.st==='dead'||a.st==='flee')continue;const c=cropAt(Math.floor(a.x/TS),Math.floor((a.y-2)/TS));if(c&&Math.random()<.5){c.age=Math.max(0,c.age-(a.sp==='boar'?4:2));if(c.age===0&&Math.random()<.4){S.crops.splice(S.crops.indexOf(c),1);CMAP.delete(c.y*MW+c.x);P2.lost++}tt('pestE',a.sp==='boar'?'🐗 Os javalis estão destruindo a lavoura!':'🦫 As capivaras estão comendo a lavoura!','bad',8)}}
  const gs=guardScore();if(gs>=30&&WILD.some(a=>a.pest&&a.st!=='dead'&&a.st!=='flee')&&Math.random()<gs/700){WILD.forEach(a=>{if(a.pest&&a.st!=='dead'){a.st='flee';a.rc=null}});toast('🐕 Seus cães de guarda espantaram os bichos da lavoura!','good')}}
 for(let i=BIRDS.length-1;i>=0;i--){const b=BIRDS[i];b.t+=dt;b.ph+=dt*14;const near=Math.hypot(b.x-P.x,b.y-P.y)<70;
  if(b.st==='in'){const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);if(d<2){b.st='eat';b.t=0}else{b.x+=dx/d*Math.min(d,70*dt);b.y+=dy/d*Math.min(d,70*dt)}}
  else if(b.st==='eat'){if(near||b.t>30*(1-.25*P2.scare)){b.st='out';b.ox=b.x+rnd(-300,300);b.oy=b.y-260;if(near)tt('birdsc','🦜 As maritacas saíram gritando!','good',3)}else if(tick&&Math.random()<.35){const c=cropAt(Math.floor(b.x/TS),Math.floor(b.y/TS));if(c&&['milho','tomate','cafe','soja','trigo'].includes(c.c))c.age=Math.max(0,c.age-1)}if(Math.random()<dt*.6){b.ty+=rnd(-6,6);b.tx+=rnd(-6,6);b.st='in'}}
  else{const dx=b.ox-b.x,dy=b.oy-b.y,d=Math.hypot(dx,dy);b.x+=dx/d*95*dt;b.y+=dy/d*95*dt;if(d<10)BIRDS.splice(i,1)}}
 // pisoteio do canavial
 if(tick){for(const a of WILD)if(a.ct&&a.st!=='dead'){const tx=Math.floor(a.x/TS),ty=Math.floor(a.y/TS);if(tx>=CANA.x0&&tx<=CANA.x1&&ty>=CANA.y0&&ty<=CANA.y1)CANED.add(ti(tx,ty))}}
 const A=S.hct&&S.hct.act;if(A){if(!A.sp){const c=CTLOC[A.loc].c();if(Math.hypot(c.x-P.x,c.y-P.y)<260)ctSpawn()}if(S.day>A.exp)ctFinish(false)}
}
function drawBird(g,b){const fl=b.st!=='eat',w=fl?Math.sin(b.ph)*2:0;Rr(g,'#2a9a3a',b.x-2,b.y-3,4,3);Rr(g,'#4ac04a',b.x-1.5,b.y-3,3,1);Rr(g,'#e8d040',b.x+1.5,b.y-3.5,1.4,1.2);Rr(g,'#c83a2a',b.x+1.8,b.y-2.4,.8,.8);
 if(fl){Rr(g,'#2a8a3a',b.x-4,b.y-4-w,3,1.4);Rr(g,'#2a8a3a',b.x+1,b.y-4-w,3,1.4)}else Rr(g,'#1a6a2a',b.x-3,b.y-1.6,2,1)}
function drawScarecrow(g,x,y){Rr(g,'rgba(0,0,0,.2)',x-5,y-1,10,2);Rr(g,'#6a4428',x-.8,y-22,1.6,22);Rr(g,'#6a4428',x-8,y-17,16,1.4);Rr(g,'#3a6aa8',x-5,y-18,10,9);Rr(g,'#c8302a',x-5,y-15,10,1);for(let i=0;i<3;i++)Rr(g,'#d8b04a',x-9+i*.6,y-17+i*1.5,2,1);for(let i=0;i<3;i++)Rr(g,'#d8b04a',x+7-i*.6,y-17+i*1.5,2,1);
 Rr(g,'#e8d8a8',x-3,y-24,6,6);Rr(g,'#222',x-1.6,y-22,1,1);Rr(g,'#222',x+.8,y-22,1,1);Rr(g,'#c8302a',x-1,y-20,2,.6);Rr(g,'#c8a040',x-6,y-25,12,2);Rr(g,'#b8902a',x-3,y-28,6,3);const sw=Math.sin(frame/18)*.8;Rr(g,'#3a6aa8',x-5+sw,y-9,4,3)}
const SCR=()=>{const f=fieldRect();return[[f[0]+2,f[1]+1],[f[2]-1,f[1]+1],[Math.round((f[0]+f[2])/2),f[3]]].map(([x,y])=>({x:x*TS+8,y:y*TS+12}))};
function drawTela(g){const f=fieldRect(),x0=(f[0]-1)*TS+6,y0=(f[1]-1)*TS+8,x1=(f[2]+2)*TS-6,y1=(f[3]+2)*TS-2;g.strokeStyle='rgba(180,190,200,.55)';g.lineWidth=.5;
 for(let x=x0;x<=x1;x+=10){Rr(g,'#7a7a82',x,y0-8,1.2,9);Rr(g,'#7a7a82',x,y1-8,1.2,9)}for(let y=y0;y<=y1;y+=10){Rr(g,'#7a7a82',x0,y-8,1.2,9);Rr(g,'#7a7a82',x1,y-8,1.2,9)}
 g.strokeRect(x0,y0-6,x1-x0,6);g.strokeRect(x0,y1-6,x1-x0,6)}
// ---------- desenho e setas
const _evoH=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoH(L,x0,x1,y0,y1);if(inRoom())return;
 if(CANA.x1*TS>x0-40&&CANA.x0*TS<x1+40&&CANA.y1*TS>y0-40&&CANA.y0*TS<y1+60){for(let ty=CANA.y0;ty<=CANA.y1;ty++)L.push([ty*TS+15,10,{draw:g=>drawCaneRow(g,ty)}]);L.push([CANA.y0*TS+12,10,{draw:drawUsinaSign}])}
 for(const b of BIRDS)if(b.x>x0-20&&b.x<x1+20&&b.y>y0-20&&b.y<y1+20)L.push([b.st==='eat'?b.y:b.y+400,10,{draw:g=>drawBird(g,b)}]);
 const P2=S.pest;if(P2){if(P2.scare)SCR().slice(0,P2.scare).forEach(s=>L.push([s.y,10,{draw:g=>drawScarecrow(g,s.x,s.y)}]));if(P2.tela){const f=fieldRect();L.push([(f[1]-1)*TS+8,10,{draw:drawTela}])}}};
const _dpH=drawPart;drawPart=function(g){_dpH(g);if(inRoom())return;const A=S.hct&&S.hct.act;let tgt=null;
 if(A){if(!A.sp)tgt=CTLOC[A.loc].c();else{const w=WILD.find(a=>a.ct===A.id&&a.st!=='dead');if(w)tgt={x:w.x,y:w.y}}}
 if(!tgt){const w=WILD.find(a=>a.pest&&a.st!=='dead');if(w)tgt={x:w.x,y:w.y,c:'#e0a431'}}
 if(tgt&&(tgt.x<CX||tgt.x>CX+VW||tgt.y<CY||tgt.y>CY+VH)){const ax=clamp(tgt.x,CX+10,CX+VW-10),ay=clamp(tgt.y,CY+34,CY+VH-14),d=Math.round(Math.hypot(tgt.x-P.x,tgt.y-P.y)/TS);Rr(g,'rgba(40,24,6,.85)',ax-7,ay-7,14,14);ptext(g,'J',ax-1.5,ay-3,tgt.c||'#ffb050');ptext(g,d+'M',ax-ptw(d+'M')/2,ay+9,'#ffd09a','#000')}};
const _updH=update;update=function(dt){_updH(dt);if(S)stepPests(dt)};
// ---------- painel, ofertas e compras
const _hdH=hookDay;hookDay=function(){_hdH();const C=ensureCt();C.offers=C.offers.filter(o=>o.exp>=S.day);
 if(LV()>=2&&S.day>=C.next&&C.offers.length<3){const o=mkOffer();C.next=S.day+ri(3,7);if(o)toast('📞 '+o.who+' ligou: “Tem '+o.n+' javalis acabando com meu '+CTLOC[o.loc].crop+'! Pago '+R$(o.pay)+'.” Veja em 🏆 Região.','good')}};
function ctPanel(){const C=ensureCt();let h='<div class="sec">🐗 SERVIÇOS DE CONTROLE DE JAVALI</div>';
 if(C.act){const A=C.act;h+='<div class="card" style="border-color:#e0a431"><div class="row"><b>Em andamento: '+CTLOC[A.loc].n+'</b><span class="gold">'+R$(A.pay)+'</span></div><div class="dim">Contratante: '+A.who+' · abatidos '+A.kills+'/'+A.n+' · prazo dia '+(A.exp%30+1)+'. Vá com cães; de caminhonete com os cães ganha +20%.</div><div class="btns"><button class="b gray" data-act="ctquit">Desistir</button></div></div>'}
 h+=C.offers.length?C.offers.map(o=>'<div class="card"><div class="row"><b>'+CTLOC[o.loc].n+'</b><span class="gold">'+R$(o.pay)+'</span></div><div class="dim">'+o.who+' · '+o.n+' javalis no '+CTLOC[o.loc].crop+' · até dia '+(o.exp%30+1)+'</div><div class="btns"><button class="b gold" data-act="ctacc" data-v="'+o.id+'">Aceitar</button></div></div>').join(''):'<div class="dim">Nenhum pedido agora. Fazendeiros ligam quando os javalis atacam.</div>';
 h+='<div class="dim">Serviços concluídos: '+C.done+'</div>';const P2=ensurePest();
 h+='<div class="sec">🌽 PROTEÇÃO DA LAVOURA</div><div class="card"><div class="dim">Javalis atacam de noite, capivaras ao entardecer e maritacas de manhã e à tarde. Cães de guarda ajudam a espantar. Plantas perdidas: '+P2.lost+'.</div>'
  +'<div class="row"><b>🎃 Espantalho ('+P2.scare+'/3)</b><span class="gold">'+R$(350)+'</span></div>'+(P2.scare<3?'<div class="btns"><button class="b" data-act="pestbuy" data-v="scare">Colocar espantalho</button></div>':'')
  +'<div class="row"><b>🕸️ Cerca de tela na lavoura</b><span class="gold">'+R$(4500)+'</span></div>'+(P2.tela?'<span class="grn">✔ instalada</span>':'<div class="btns"><button class="b" data-act="pestbuy" data-v="tela">Instalar</button></div>')+'</div>';
 return h}
Object.assign(ACT,{ctacc(e){ctAccept(+e.v)},ctquit(){ctFinish(false)},pestbuy(e){const P2=ensurePest();if(e.v==='scare'){if(P2.scare>=3)return;if(S.money<350)return toast('Dinheiro insuficiente','bad');cash(-350,'Espantalho');P2.scare++;toast('🎃 Espantalho colocado na lavoura','good')}else{if(P2.tela)return;if(S.money<4500)return toast('Dinheiro insuficiente','bad');cash(-4500,'Cerca de tela');P2.tela=1;toast('🕸️ Cerca de tela instalada em volta da lavoura','good')}}});
const _pRegH=pReg;pReg=function(){const h=_pRegH(),k=h.indexOf('<div class="sec">🤠 RIVAIS');return k>0?h.slice(0,k)+ctPanel()+h.slice(k):h+ctPanel()};
ACH.push(['hct1','Controlador de pragas','Conclua um serviço de controle de javali',()=>S.hct&&S.hct.done>=1,4000],['hct10','Terror dos javalis','Conclua 10 serviços de controle de javali',()=>S.hct&&S.hct.done>=10,30000]);
GUIDE.push({lv:2,ic:'🐗',t:'Serviços e pragas',h:'Fazendeiros ligam pedindo para acabar com javalis no canavial da Usina (sudeste, acima da estrada do sul) ou nos sítios. Aceite em 🏆 Região, siga a seta e leve cães: chegando de caminhonete com os cães ganha +20%. Na sua lavoura, javalis (noite), capivaras (tarde) e maritacas (manhã) comem as plantas: espante, use cães de guarda, espantalhos e cerca de tela.'});
