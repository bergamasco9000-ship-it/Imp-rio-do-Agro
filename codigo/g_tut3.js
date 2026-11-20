// ===== Tutorial com setas: seta grande no mundo (também dentro dos prédios), seta na borda com distância e seta nos botões da tela =====
const bDoor=id=>{const b=BLD.find(q=>q.id===id);return b?{x:b.door*TS+8,y:(b.y+b.h)*TS+6}:null};
const rItem=(rid,act)=>{const r=ROOMS[rid];if(!r)return null;const it=r.items.find(i=>i.act===act);return it?{x:(r.x+it.x+(it.w||1)/2)*TS,y:(r.y+it.y)*TS+4}:null};
const inR=id=>{if(!inRoom())return false;const r=roomAt(P.x,P.y);return!!r&&r.id===id};
const fieldC=()=>{const F=fieldRect();return{x:((F[0]+F[2])/2)*TS+8,y:((F[1]+F[3])/2)*TS+8}};
function nearCow(){let b=null,bd=1e9;for(const a of S.herd){if(a.age<200)continue;const s=spriteOf(a),d=Math.hypot(s.x-P.x,s.y-P.y);if(d<bd){bd=d;b=s}}return b?{x:b.x+8,y:b.y-2}:{x:10*TS,y:56*TS+8}}
const inPasture=()=>P.x>PAS.x*TS&&P.x<(PAS.x+pasW())*TS&&P.y>PAS.y*TS&&P.y<(PAS.y+PAS.h)*TS;
// passo = {t: texto, done, go(): {x,y,h: dica curta} | null, ui(): seletor de botão na tela}
const TUT3=[
 {t:'Bem-vindo à fazenda! Siga a <b>seta amarela</b> até a porta do celeiro vermelho e toque em ✋ para entrar.',done:()=>S.tf.barn||inR('barn'),go:()=>({...bDoor('barn'),h:'porta do celeiro'})},
 {t:'Você está no celeiro. Vá até a <b>📋 prancheta</b> em cima da mesa (a seta mostra) e toque em ✋. Ela mostra todo o seu rebanho.',done:()=>S.tf.barn,go:()=>inR('barn')?{...rItem('barn','herd'),h:'prancheta'}:{...bDoor('barn'),h:'volte ao celeiro'}},
 {t:'Feche o rebanho e saia pela porta de baixo. Vá ao <b>pasto</b> e faça carinho numa vaca: chegue perto dela e toque em ✋.',done:()=>S.tf.pet,go:()=>inRoom()?null:inPasture()?{...nearCow(),h:'vaca'}:{x:9.6*TS,y:56.6*TS,h:'porteira do pasto'},ui:()=>menuOpen?'[data-act="menuclose"]':null},
 {t:'O gado precisa de comida na seca. Vá ao <b>cocho</b> (seta) e toque em ✋. Depois toque no botão de comprar ração.',done:()=>S.tf.feedb,go:()=>({x:TROUGH.x+24,y:TROUGH.y+14,h:'cocho'}),ui:()=>'#mbox [data-act="feed"]'},
 {t:'Agora a lavoura: vá até a <b>terra marrom</b> (seta), fique em cima dos canteiros e toque em ✋ para plantar milho.',done:()=>S.tf.plant,go:()=>({...fieldC(),h:'lavoura'})},
 {t:'Toque em ✋ de novo na lavoura para <b>regar</b>. Planta sem água não cresce.',done:()=>S.tf.water,go:()=>({...fieldC(),h:'lavoura'})},
 {t:'As plantas crescem de noite. Entre em <b>casa</b> e durma na <b>cama</b> (seta). Dormir também salva o jogo.',done:()=>S.tf.slept,go:()=>inR('house')?{...rItem('house','sleep'),h:'cama'}:{...bDoor('house'),h:'porta de casa'},ui:()=>'#mbox [data-act="sleep"]'},
 {t:'O milho leva 4 dias. Regue todo dia (chuva também rega). Quando <b>brilhar</b>, toque em ✋ na lavoura para colher. Use ⏩ para passar o tempo.',done:()=>S.tf.harvest,go:()=>inRoom()?null:{...fieldC(),h:'lavoura'}},
 {t:'Venda a colheita na <b>caixa de venda</b> ao lado da casa (seta).',done:()=>S.tf.sell,go:()=>inRoom()?null:{x:SHIPBOX.x+9,y:SHIPBOX.y+16,h:'caixa de venda'}},
 {t:'Siga a estrada para o leste até a <b>vila</b> e converse com <b>Seu João</b>, o prefeito (seta). Dica: o ⏩ não acelera a caminhada, mas o cavalo sim!',done:()=>S.tf.joao,go:()=>{if(inRoom())return null;const n=npcById('joao');return n?{x:n.x,y:n.y-10,h:'Seu João'}:null}},
 {t:'Entre na <b>Casa de Leilões</b> (seta) e fale com o leiloeiro no púlpito. Aqui você compra e vende gado.',done:()=>S.tf.auc,go:()=>inR('leilao')?{...rItem('leilao','shop'),h:'leiloeiro'}:inRoom()?null:{...bDoor('leilao'),h:'Casa de Leilões'}},
 {t:'Do lado do leilão fica o <b>Recinto</b>: o gado à venda fica nas baias. Ande pelo corredor e toque numa baia para ver o animal de perto.',done:()=>S.tf.rct,go:()=>inRoom()?null:{x:101.5*TS,y:33.8*TS,h:'recinto'}},
 {t:'Na praça há um <b>📋 Quadro de Avisos</b> com pedidos que pagam bem. Vá até ele (seta).',done:()=>S.tf.mural,go:()=>inRoom()?null:{x:BOARD.x,y:BOARD.y,h:'quadro de avisos'}},
 {t:'Sua vida ❤️ fica no canto. Compre um <b>🥖 pão</b> com Dona Lourdes na padaria (seta). Ele vai para a barra rápida.',done:()=>S.tf.bread||hasItem('pao',1),go:()=>{if(inR('padaria')){const r=ROOMS.padaria,it=r.items.find(i=>i.act==='npc');return it?{x:(r.x+it.x+2)*TS,y:(r.y+it.y)*TS+4,h:'Dona Lourdes'}:null}if(inRoom())return null;return{...bDoor('padaria'),h:'padaria'}}},
 {t:'Seu cão te segue. Toque no <b>nome dele</b> no canto da tela (seta) para ver vida, idade e ferimentos.',done:()=>S.tf.dogm,go:()=>null,ui:()=>'[data-dg]'},
 {t:'Abra o <b>MENU ☰</b> (seta) e depois a aba <b>🏆 Região</b>: título, ranking contra os vizinhos e conquistas.',done:()=>S.tf.reg,go:()=>null,ui:()=>menuOpen?'#tabs [data-v="reg"]':'[data-act="menu"]'},
 {t:'Pronto! Sua meta: subir de Sitiante a Barão do Agro e ser o 1º da região. No ☰ › Guia tem tudo explicado. Boa sorte!',done:()=>S.tf.final,go:()=>null,rw:[500,40],tap:1}
];
TUT3.forEach(s=>{if(!s.rw)s.rw=[200,20]});
// troca a lista antiga pela nova (saves antigos: quem já terminou continua terminado)
const TUTOLD=TUT.length;TUT.length=0;TUT3.forEach(s=>TUT.push(s));
function tutMigrate(){if(!S||S.tutV===3)return;if(S.tut>=TUTOLD)S.tut=TUT.length;else if(S.tut>0){const map=[0,2,3,4,5,6,7,8,9,10,10,12,13,14,15,16];S.tut=map[S.tut]||S.tut}S.tutV=3}
const _utT3=updateTut;updateTut=function(dt){tutMigrate();if(!S.tf.rct&&Math.abs(P.x-101.5*TS)<5*TS&&Math.abs(P.y-34*TS)<1.5*TS&&!inRoom())S.tf.rct=1;_utT3(dt);tutUI()};
// ---------- seta no mundo
function tutGo(){if(S.tut>=TUT.length)return null;const s=TUT[S.tut];if(!s.go)return null;try{const t=s.go();return t&&isFinite(t.x)?t:null}catch(e){return null}}
guideTarget=function(){const t=tutGo();if(t)return t;return null};
drawGuide=function(g){const t=guideTarget();if(!t)return;const sx=t.x-CX,sy=t.y-CY,bob=Math.sin(frame/7)*3;
 if(sx>-4&&sx<VW+4&&sy>-4&&sy<VH+4){
  // anel pulsando no chão + seta grande
  const r=8+((frame%40)/40)*8,al=1-((frame%40)/40);g.globalAlpha=al*.8;for(let a=0;a<6.28;a+=.35)Rr(g,'#ffd75e',sx+Math.cos(a)*r-1,sy+4+Math.sin(a)*r*.45-1,2,2);g.globalAlpha=1;
  const ay=sy-30+bob;Rr(g,'#3a2400',sx-6,ay-1,13,9);Rr(g,'#ffd75e',sx-5,ay,11,7);Rr(g,'#3a2400',sx-9,ay+7,19,2);
  for(let i=0;i<8;i++){Rr(g,'#3a2400',sx-9+i-.5,ay+8+i,19-i*2+1,1.2);Rr(g,'#ffd75e',sx-8+i,ay+8+i,17-i*2,1)}
  if(t.h){const w=ptw(t.h)+6,lx=clamp(sx-w/2,2,VW-w-2);Rr(g,'rgba(40,24,0,.85)',lx,ay-11,w,9);ptext(g,t.h,lx+3,ay-10,'#ffd75e')}}
 else{const cx=VW/2,cy=VH/2,a=Math.atan2(sy-cy,sx-cx),m=Math.min(cx,cy)-24,ex=clamp(cx+Math.cos(a)*(cx-22),22,VW-22),ey=clamp(cy+Math.sin(a)*(cy-30),40,VH-30),d=Math.round(Math.hypot(t.x-P.x,t.y-P.y)/TS*1.5);
  const pulse=1+Math.sin(frame/6)*.12;g.save();g.translate(ex,ey);g.rotate(a);g.scale(pulse,pulse);
  g.fillStyle='#3a2400';g.beginPath();g.moveTo(13,0);g.lineTo(-8,-10);g.lineTo(-4,0);g.lineTo(-8,10);g.closePath();g.fill();
  g.fillStyle='#ffd75e';g.beginPath();g.moveTo(11,0);g.lineTo(-6,-8);g.lineTo(-2.5,0);g.lineTo(-6,8);g.closePath();g.fill();g.restore();
  const lab=(t.h?t.h+' · ':'')+d+' m',w=ptw(lab)+6,lx=clamp(ex-w/2,2,VW-w-2),ly=clamp(ey+(Math.sin(a)>0?-22:14),30,VH-14);Rr(g,'rgba(40,24,0,.85)',lx,ly,w,9);ptext(g,lab,lx+3,ly+1,'#ffd75e')}};
// ---------- seta nos botões da tela (HTML)
const TUA=document.createElement('div');TUA.id='tutArrow';TUA.textContent='👇';document.body.appendChild(TUA);
(()=>{const st=document.createElement('style');st.textContent='#tutArrow{position:fixed;z-index:60;font-size:34px;pointer-events:none;display:none;filter:drop-shadow(0 0 3px #000);animation:tutb .6s ease-in-out infinite alternate}@keyframes tutb{from{transform:translateY(-4px)}to{transform:translateY(6px)}}.tuthl{outline:3px solid #ffd75e!important;outline-offset:2px;box-shadow:0 0 12px 4px rgba(255,215,94,.8)!important;animation:tuthl .7s ease-in-out infinite alternate}@keyframes tuthl{from{outline-color:#ffd75e}to{outline-color:#fff6c8}}';document.head.appendChild(st)})();
let TUHL=null;
function tutUI(){let el=null;if(S&&S.tut<TUT.length){const s=TUT[S.tut];if(s.ui){try{const sel=s.ui();if(sel)el=document.querySelector(sel)}catch(e){}}
  if(!el&&!paused()){const t=tutGo();if(t&&typeof NEAR!=='undefined'&&NEAR&&Math.hypot(NEAR.x-t.x,NEAR.y-t.y)<56){const bE=$('bE');el=bE&&bE.getBoundingClientRect().width>0&&getComputedStyle(bE).display!=='none'?bE:$('hint')}}
  if(el&&el.id==='hint'&&el.style.display==='none')el=null;
  if(el){const r=el.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>innerHeight)el=null}}
 if(TUHL&&TUHL!==el){TUHL.classList.remove('tuthl');TUHL=null}
 if(!el){TUA.style.display='none';return}
 if(!el.classList.contains('tuthl')){el.classList.add('tuthl');if(el.closest&&el.closest('#tabs'))try{el.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}}TUHL=el;const r=el.getBoundingClientRect();
 const up=r.top<70;TUA.textContent=up?'👆':'👇';TUA.style.display='block';TUA.style.left=Math.round(clamp(r.left+r.width/2-18,4,innerWidth-44))+'px';TUA.style.top=Math.round(up?r.bottom+2:r.top-44)+'px'}
setInterval(()=>{try{if(S)tutUI()}catch(e){}},250);
// ---------- dica do que fazer agora + botão de pular
const _rtbT3=renderTutBox;renderTutBox=function(){_rtbT3();if(!S||S.tut>=TUT.length)return;const el=$('tut');if(!el||el.style.display==='none')return;
 if(!el.querySelector('[data-act="tutskip"]'))el.insertAdjacentHTML('beforeend','<div style="margin-top:4px;font-size:12px;opacity:.75;pointer-events:auto"><span data-act="tutskip" style="text-decoration:underline;cursor:pointer">pular tutorial</span></div>')};
// mostra o passo novo quando carrega um jogo salvo
setTimeout(()=>{try{if(S){tutMigrate();renderTutBox()}}catch(e){}},1500);
