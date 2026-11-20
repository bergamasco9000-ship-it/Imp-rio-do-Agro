// ===== Cães lendários escondidos no mapa: 5 cães únicos para resgatar. Mais fortes que o Cáucaso, cada um com aparência própria,
// ===== vaga extra no canil, coleira de ouro, não se vendem e, se caírem numa briga, desmaiam (1 minuto para socorrer).
const LDGK=['fantasma','coronel','relampago','rastro','bravo'];
const LDGN={fantasma:'Fantasma',coronel:'Coronel',relampago:'Relâmpago',rastro:'Rastro',bravo:'Bravo'};
const LDGGEM={fantasma:'#8ad8ff',coronel:'#d8302a',relampago:'#ffe040',rastro:'#3ac06a',bravo:'#3a8ad8'};
const LDGDEF={
 fantasma:{n:'Pastor-do-Cáucaso albino',lv:1,p:60000,spd:86,bite:38,guard:100,track:60,herd:85,sz:2,col:'#ece6da',str:128,life:14,hpm:240,coat:.3,lgd:1,
  d:'O Fantasma da Serra Alta. Cresceu sozinho no meio dos lobos: pelo branco e grosso (−30% de dano) e olhos azul-gelo. Leva menos dano de lobo.',
  v:{len:18,h:8,leg:6.6,head:7.6,mz:2.4,ear:'crop',tail:'fluff',c:'#ece6da',bl:'#fbf8f2',dk:'#c6bcac',mask:'#d4cabc',ear_c:'#d2c6b4',tc:'#efe9de',tip:'#ffffff',chest:'#ffffff',ruff:'#f8f4ec',nose:'#c88a8a',jowl:1,shag:1,lg:'fantasma'}},
 coronel:{n:'Fila Brasileiro (linhagem do Rei)',lv:1,p:55000,spd:90,bite:42,guard:100,track:70,herd:70,sz:2,col:'#7a5230',str:118,life:13,hpm:215,coat:.15,lgd:1,
  d:'Neto do Rei, o fila do Coronel Bento. Tigrado escuro, papada pesada e cicatrizes de guarda. A mordida mais forte do canil: ladrão não escapa.',
  v:{len:17.6,h:7.6,leg:6.6,head:7.6,mz:2.8,ear:'drop',tail:'saber',c:'#7a5230',bl:'#8e6640',dk:'#4a3018',mask:'#14100c',brindle:'#2a1a0c',ear_c:'#1e140c',tc:'#5a3a20',jowl:1,lg:'coronel'}},
 relampago:{n:'Galgo Azul',lv:1,p:50000,spd:135,bite:34,guard:70,track:75,herd:60,sz:2,col:'#76808e',str:104,life:14,hpm:185,coat:.08,lgd:1,
  d:'Fugiu de uma corrida clandestina. O cão mais rápido da região: nenhum bicho escapa dele. Tem um raio branco desenhado no flanco.',
  v:{len:16,h:4.2,leg:8,head:5,mz:3.6,ear:'semi',tail:'whip',c:'#76808e',bl:'#c6ccd6',dk:'#56606c',chest:'#f2f2f0',sock:'#eeeeea',tc:'#76808e',ear_c:'#5a6470',nose:'#2a2a30',lg:'relampago'}},
 rastro:{n:'Bloodhound (Santo Humberto)',lv:1,p:50000,spd:92,bite:34,guard:85,track:150,herd:50,sz:2,col:'#9a4a22',str:106,life:14,hpm:190,coat:.12,lgd:1,
  d:'O melhor nariz do Brasil. Acha bicho ferido a quase 1 km (🐾 RASTRO) e mostra a trilha de sangue com uma seta.',
  v:{len:15.6,h:6,leg:5.4,head:6.6,mz:3.2,ear:'flop',tail:'up',c:'#9a4a22',bl:'#b8683a',dk:'#6a2e14',saddle:'#1e1410',ear_c:'#6a2e14',tc:'#9a4a22',tip:'#9a4a22',jowl:1,lg:'rastro'}},
 bravo:{n:'Mastim dos Alagados',lv:1,p:58000,spd:82,bite:40,guard:100,track:55,herd:65,sz:2,col:'#c69a5e',str:122,life:13,hpm:230,coat:.32,lgd:1,noVen:1,
  d:'Enfrentou jacarés para salvar um bezerro. Couro grosso (−32% de dano), imune a veneno de cobra e leva metade do dano de jacaré.',
  v:{len:18.6,h:8.4,leg:6,head:8.4,mz:3,ear:'drop',tail:'saber',c:'#c69a5e',bl:'#d8b07a',dk:'#8a6a3a',mask:'#18120e',ear_c:'#2a1e14',tc:'#b08850',jowl:1,lg:'bravo'}}};
// fora da lista da loja (Object.keys não vê), mas DOGS[k] funciona normalmente
for(const k of LDGK)Object.defineProperty(DOGS,k,{value:LDGDEF[k],enumerable:false,configurable:true,writable:true});
ITEMS.carnecao={n:'Carne fresca (para cão)',ic:'🥩',cat:'use',p:35};
GEAR.corda={n:'Corda de resgate (20 m)',p:180,d:'Para tirar animal de poço ou barranco.'};
const isLgd=d=>!!(d&&DOGS[d.breed]&&DOGS[d.breed].lgd);
// ---------- aparência única: detalhes desenhados por cima do cão base
const _ddsL=drawDogSprite;
drawDogSprite=function(g,x,y,dr,v,pose,ph,o){
 _ddsL.apply(this,arguments);if(!v||!v.lg)return;o=o||{};
 const f=(c,dx,dy,w,h)=>{if(w>0&&h>0)Rr(g,c,dr>0?x+dx:x-dx-w,y+dy,w,h)};
 const L=v.len,H=v.h,LG=v.leg,HS=v.head,half=L/2,c=v.c,k=v.lg;
 const run=pose==='run',walk=pose==='walk'||pose==='limp'||(pose==='sniff'&&o.mv),sit=pose==='sit',lie=pose==='lie'||pose==='sleep',sleep=!!o.sleep;
 let rearY=0,frontY=0,hdx=0,hdy=0,bob=0;
 if(run)bob=-Math.abs(Math.sin(ph))*1.3;else if(walk)bob=-Math.abs(Math.sin(ph))*.5;else if(!lie&&!sit)bob=Math.sin(frame/22)*.25;
 if(sit)rearY=LG-1.5;if(lie){rearY=LG-.5;frontY=LG-.5}
 if(pose==='hold'){frontY=1.5;hdx=1.2;hdy=2.5+(o.shake?Math.sin(frame*1.4)*.8:0);rearY=-.5}
 if(pose==='sniff'){hdy=LG+H-HS*.6;hdx=.8}if(pose==='point')hdx=1;if(o.hurt)hdy+=.5;
 const top=-(LG+H)+bob,hx=half-1+hdx,hy=top+frontY-HS+2+hdy,cy=hy+HS-1.4,ex=hx+HS-2.6,ey=hy+1.4,mx=hx+HS-1,mzh=Math.ceil(HS/2),my=hy+HS-1-mzh,ft=top+frontY,rt=top+rearY;
 if(k==='fantasma'){
  // capa de pelo no cangote, cicatriz no olho, olhos azul-gelo e bafo de frio
  f(shade(c,5),half-8,ft-1.1,4.4,2.2);f('#ffffff',half-7.4,ft-1.3,3,.6);
  f('#d89a9a',ex-.9,ey-1.6,.5,1.1);f('#d89a9a',ex-.5,ey-.6,.5,.8);f('#d89a9a',ex-.1,ey+1,.5,.9);
  if(!sleep){f('#6ac8ff',ex,ey,1,1);f('#e8f8ff',ex+.3,ey,.4,.4)}
  const cold=typeof daylight==='function'&&daylight()<.35;
  if(!sleep&&((frame>>5)%3===0||cold)){const t=(frame%32)/32;f('rgba(240,248,255,'+(.7-t*.6).toFixed(2)+')',mx+v.mz+t*3,my+.2-t*2,1.4+t,1.1)}
  if(cold)for(let i=0;i<3;i++){const p=((frame>>2)+i*13)%(L*3);if(p<L)f('rgba(200,236,255,.85)',-half+p,top+1+i*2,.5,.5)}
 }else if(k==='coronel'){
  // papada, focinho grisalho, estrela branca no peito, cicatrizes no ombro e testa franzida
  f(shade(c,-6),half-3.4,hy+HS-.6,2.6,2.4);f(shade(c,-18),half-3.2,hy+HS+1.5,2.2,.6);
  f('#a8a098',mx,my+.2,v.mz-.4,.5);f('#a8a098',mx+.6,my+mzh-1,.7,.5);f('#a8a098',hx+HS-3,hy+HS-2,.6,.6);
  if(!lie)f('#f0ece4',half-3,ft+H-3.4,1.6,2);f('#f0ece4',half-3.6,ft+H-2.8,2.8,.7);
  f('#c88a7a',half-6.2,ft+1.2,.5,2.4);f('#c88a7a',half-5.2,ft+1,.5,2.6);f('#c88a7a',half-4.2,ft+1.4,.5,2);
  f(shade(c,-28),hx+.8,hy+.5,HS-3.6,.4);
 }else if(k==='relampago'){
  // peito fundo, raio branco no flanco, orelha rosa dobrada, rabo em S e rastro de velocidade
  if(!lie){f(c,half-5.6,ft+H-.4,4.6,1.2);f(v.chest,half-4.6,ft+H+.4,3,.6)}
  const bx=-1.2,by=rt+.6;f('#fff8d8',bx+.6,by,1,1);f('#fff8d8',bx,by+.9,1,1);f('#fff8d8',bx-.4,by+1.7,1.8,.7);f('#fff8d8',bx+.4,by+2.3,1,1);f('#fff8d8',bx-.2,by+3.1,1,.8);
  f(v.ear_c,hx-.5,hy-.3,2.2,1.1);f(shade(v.ear_c,30),hx-.1,hy-.1,1,.5);
  if(!run&&!sit&&!lie){f(c,-half-1.4,rt+1.6,.8,3.6);f(c,-half-2.2,rt+5,1,.8);f(c,-half-1.4,rt+5.6,.8,.6)}
  if(run)for(let i=0;i<3;i++)f('rgba(255,250,210,.55)',-half-6-i*3-((frame>>1)%3),top+1+i*1.4,3,.4);
 }else if(k==='rastro'){
  // orelhas compridíssimas balançando, rugas na testa, olho caído com pálpebra vermelha, papada e farejo
  const sw=walk||run?Math.sin(ph)*.5:0;f(v.ear_c,hx+.2,hy+HS-.8+sw,2.4,2.8);f(shade(v.ear_c,-14),hx+.2,hy+HS+1.8+sw,2.4,.6);
  f(shade(c,-30),hx+.6,hy+.4,HS-3.4,.4);f(shade(c,-30),hx+.9,hy+.9,HS-3.8,.35);
  if(!sleep)f('#c84a3a',ex,ey+1,1,.45);
  f(shade(c,-8),half-3.2,hy+HS-.6,2.4,2.2);
  if(pose==='sniff'||(o.mv&&!run)){const t=(frame%40)/40;f('rgba(200,230,120,'+(.6-t*.6).toFixed(2)+')',mx+v.mz+.4+t*2,my+mzh+.6-t*3,.7,.7);f('rgba(200,230,120,'+(.4-t*.4).toFixed(2)+')',mx+v.mz+1+t*3,my+mzh-t*4,.6,.6)}
 }else if(k==='bravo'){
  // máscara preta no rosto todo, rugas, pescoço grosso, cicatrizes de jacaré e orelha rasgada
  f(c,half-4.6,hy+HS-2.8,1.8,4.2);
  f(shade(v.mask,26),hx+HS-3.4,hy+1,1,HS-2.4);f(v.mask,hx+HS-2.8,hy+.9,2.8,HS-2);f(shade(c,-24),hx+.8,hy+.5,HS-4.2,.4);f(shade(c,-24),hx+1.2,hy+1.1,HS-4.8,.35);
  if(!sleep){f('#111',ex,ey,1,1);f('#e8c070',ex+.3,ey+.2,.4,.4)}
  for(let i=0;i<3;i++)f('#d8a0a0',-half+2.4+i*1.5,rt+1.4+i*.3,.5,H-3.6);
  f(c,hx+2.2,hy+2,.7,.8);
 }
 // coleira: antes do resgate (o.wild) a coleira velha; depois, a coleira de ouro lendária com a pedra de cada um
 if(o.wild){if(k==='relampago')f('#a83020',half-3,cy,2.6,1.2);else if(k==='rastro')f('#a8865a',half-3,cy+.2,2.4,.7);return}
 const gem=LDGGEM[k]||'#fff',wide=k==='relampago';
 f('#7a5a10',half-3.7,cy-.3,3.8,wide?2.2:1.7);f('#f0c840',half-3.5,cy-.1,3.4,wide?1.8:1.2);f('#fff6c0',half-3.3,cy,.8,.4);
 if(k==='bravo')for(let i=0;i<3;i++){f('#f0c840',half-3.4+i*1.1,cy-.9,.6,.8);f('#f0c840',half-3.4+i*1.1,cy+1.2,.6,.8)}
 const md=k==='coronel'?2.4:1.7;f('#a07a18',half-2.6,cy+1,md,md);f('#f6d050',half-2.4,cy+1.2,md-.4,md-.4);f(gem,half-2.6+md/2-.4,cy+1+md/2-.4,.8,.8);
 if((frame>>4)%9===0)f('#ffffff',half-1.2,cy-.8,.5,.5);
};
// ---------- vaga extra, sem venda, perks de cada um
const _dHurtL=dogHurt;dogHurt=function(d,dmg,src,o){const D=d&&DOGS[d.breed];if(D&&D.lgd){o=Object.assign({},o||{});if(D.noVen)o.venom=0;if(src&&src.sp==='croc'&&d.breed==='bravo')dmg*=.5;if(src&&src.sp==='wolf'&&d.breed==='fantasma')dmg*=.6;if(d.faint>0){return}}return _dHurtL(d,dmg,src,o)};
const _dsL=ACT.dogsell;ACT.dogsell=function(e){const d=dogById(e.v);if(isLgd(d))return toast('⭐ '+d.name+' é um cão lendário: não se vende nem se troca.','bad');return _dsL(e)};
const _dtL=ACT.dogtrade;ACT.dogtrade=function(e){const id=String(e.v).split('|')[1],d=dogById(id);if(isLgd(d))return toast('⭐ '+d.name+' é lendário: não entra em troca.','bad');return _dtL(e)};
const _dbL=ACT.dogbuy;ACT.dogbuy=function(e){_dbL(e);const box=$('mbox');if(!box)return;box.querySelectorAll('[data-act="dogtrade"]').forEach(b=>{const d=dogById(String(b.dataset.v).split('|')[1]);if(isLgd(d)){const c=b.closest('.card');if(c)c.remove()}})};
// ---------- desmaio: o lendário não morre na hora; você tem 1 minuto para fazer um curativo
const _ddL=dogDie;dogDie=function(d,cause){if(isLgd(d)&&!d.dead){if(d.faint>0){d.hp=1;return}d.faint=60;d.hp=1;d.fcause=cause;try{releaseDog(d)}catch(e){}const r=dogRT(d);r.st='follow';r.tgt=null;
  toast('⭐ '+d.name+' DESMAIOU! Você tem 1 minuto para socorrer: chegue perto e toque ✋ (🩹 kit canino ou curativo improvisado)','bad');try{barkSnd(1)}catch(e){}return}
 return _ddL(d,cause)};
const _sdL=stepDogs;stepDogs=function(dt){if(!S||!S.dogs.some(d=>d.faint>0))return _sdL(dt);const F=S.dogs.filter(d=>d.faint>0);S.dogs=S.dogs.filter(d=>!(d.faint>0));try{_sdL(dt)}finally{for(const d of F)if(!S.dogs.includes(d)&&!d.dead)S.dogs.push(d)}};
const _drL=drawDog;drawDog=function(g,d){if(!(d&&d.faint>0))return _drL(g,d);const r=dogRT(d),v=DOGS[d.breed].v;
 drawDogSprite(g,r.x,r.y,r.dir||1,v,'sleep',0,{sleep:1,wounds:d.wounds,col:d.col||0,arm:d.arm||0});
 const top=r.y-v.leg-v.h-3,w=16,fr=clamp(d.faint/60,0,1);Rr(g,'#1c120b',r.x-w/2,top-8,w,2);Rr(g,fr<.3?'#e03030':'#e0a431',r.x-w/2,top-8,w*fr,2);if((frame>>4)&1)Rr(g,'#f4f4f0',r.x-1.5,top-13,3,3),Rr(g,'#e03030',r.x-.5,top-12.6,1,2.2),Rr(g,'#e03030',r.x-1.1,top-12,2.2,1)};
function ldgRevive(d){const kit=takeItem('vetkit',1);d.faint=0;d.wounds.forEach(w=>{w.band=1;w.bt=0});d.venom=0;d.hp=Math.round(dogMax(d)*(kit?.38:.16));const r=dogRT(d);r.st='follow';r.hurt=0;
 toast(kit?'🩹 Você enfaixou o '+d.name+' com o kit canino. Ele abriu os olhos! Leve à Dra. Marina.':'🩹 Sem kit: você rasgou a camisa e fez um curativo improvisado no '+d.name+'. Ele levantou, mas está fraco.','good')}
// ---------- onde cada um vive (posição escolhida uma vez, sempre num lugar alcançável)
const LDGT={fantasma:{t:[163,-20],g:5},coronel:{t:[-16,12],g:1},relampago:{t:[-16,96],g:4},rastro:{t:[60,184],g:4},bravo:{t:[250,112],g:6,water:1}};
const LDGREG={fantasma:'Serra Alta',coronel:'Mata do Oeste',relampago:'Campos do Oeste',rastro:'Cerrado do Sul',bravo:'Alagados'};
function ldgPlace(L){const pass=(x,y)=>x>=XMIN&&y>=YMIN&&x<MW&&y<RZ-2&&!SOL[ti(x,y)]&&G[ti(x,y)]!==2,seen=new Uint8Array(NT),q=[];
 const s0=[[60,47],[13,49],[120,57],[30,46]].find(([x,y])=>pass(x,y))||[60,47];q.push(ti(s0[0],s0[1]));seen[q[0]]=1;
 for(let h=0;h<q.length;h++){const i=q[h],x=tix(i),y=tiy(i);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!pass(nx,ny))continue;const j=ti(nx,ny);if(seen[j])continue;seen[j]=1;q.push(j)}}
 for(const k of LDGK){if(L.pos[k])continue;const T=LDGT[k];let best=null,bs=1e9;
  for(let dy=-28;dy<=28;dy++)for(let dx=-28;dx<=28;dx++){const x=T.t[0]+dx,y=T.t[1]+dy;if(x<XMIN+3||y<YMIN+3||x>=MW-3||y>=RZ-4)continue;if(!seen[ti(x,y)])continue;let ok=1;
   for(let yy=y-2;yy<=y+1&&ok;yy++)for(let xx=x-2;xx<=x+2;xx++){const i=ti(xx,yy);if(SOL[i]||FEN[i]||G[i]===2||G[i]===3){ok=0;break}}if(!ok)continue;
   let sc=Math.hypot(dx,dy)+(G[ti(x,y)]===T.g?0:16);if(T.water){let w=0;for(let yy=y-5;yy<=y+5&&!w;yy++)for(let xx=x-5;xx<=x+5;xx++)if(yy>=YMIN&&yy<RZ&&xx>=XMIN&&xx<MW&&G[ti(xx,yy)]===2){w=1;break}if(!w)sc+=40}
   if(sc<bs){bs=sc;best=[x,y]}}
  L.pos[k]=best||T.t}}
function ldgEnsure(){if(!S||typeof G==='undefined')return null;if(!S.lgd)S.lgd={pos:{},q:{},rt:-1,rb:-1};const L=S.lgd;for(const k of LDGK)if(!L.q[k])L.q[k]={st:0};if(LDGK.some(k=>!L.pos[k]))ldgPlace(L);
 for(const k of LDGK){const q=L.q[k];if(q.st<3&&S.dogs.some(d=>d.breed===k))q.st=3}return L}
const ldgSite=k=>{const p=S.lgd.pos[k];return{x:p[0]*TS+8,y:p[1]*TS+12}};
const LDR={};
function ldgRt(k){if(!LDR[k]){const s=ldgSite(k);LDR[k]={x:s.x,y:s.y,dir:-1,ph:0,mv:0,tx:null,ty:null,cd:0,bk:0,pack:0}}return LDR[k]}
const ldgOpen=k=>S.lgd&&S.lgd.q[k].st<3&&!S.dogs.some(d=>d.breed===k);
const ldgNight=()=>daylight()<.3;
function ldgVis(k){if(!ldgOpen(k))return false;const q=S.lgd.q[k];if(k==='fantasma')return ldgNight()||!!q.free;if(k==='relampago')return false;return true}
const ldgDirTxt=(dx,dy)=>Math.abs(dx)>Math.abs(dy)?(dx>0?'leste':'oeste'):(dy>0?'sul':'norte');
// ---------- boatos (Seu Tião e Bar do Tonhão)
const LDGRUM={
 fantasma:{t:'Lá em cima na Serra Alta, em noite fria, os tropeiros veem um cachorrão branco feito neblina perto de uma cabana abandonada. Os lobos vivem rondando ele. Dizem que é um Cáucaso albino, o maior que já se viu. Vá de noite e leve arma.',
  b:'Cê já ouviu do Fantasma? Cachorro branco do tamanho de um bezerro, lá na Serra Alta. Só aparece de noite, com os lobos em volta. Leva arma, compadre!'},
 coronel:{t:'Nas ruínas da sede velha da Boi de Ouro, na Mata do Oeste, vive um fila tigrado, neto do Rei, o cão do Coronel Bento. Não deixa ninguém chegar perto. Dizem que só obedece a quem levar a coleira de ouro da família... que está na Prefeitura, junto do busto do Coronel.',
  b:'O cachorro do Coronel? Vive nas ruínas da Mata do Oeste defendendo a casa até hoje. Já mordeu dois caçadores! O Seu João diz que a coleira de ouro do velho tá guardada na Prefeitura.'},
 relampago:{t:'Um galgo azul fugiu de uma corrida clandestina e sumiu nos Campos do Oeste. Um peão ouviu latido saindo de um poço velho... Quem for lá precisa levar corda (a Loja do Caçador vende).',
  b:'Nos Campos do Oeste tem um poço abandonado que late! Juro! Deve ser aquele galgo que fugiu da corrida. Corre mais que moto, dizem.'},
 rastro:{t:'No Cerrado do Sul anda um bloodhound sem dono, perto de um ipê caído. Farejador como aquele eu nunca vi. Mas é desconfiado: chegue agachado, deixe carne e volte três dias seguidos. Carne fresca eu vendo aqui.',
  b:'Tem um cachorro orelhudo no Cerrado do Sul que fareja onça a um quilômetro. Ninguém pega: é só chegar em pé que ele some no mato.'},
 bravo:{t:'Nos Alagados, lá no fim do Pantanal, um mastim gigante enfrentou os jacarés para salvar um bezerro. Ficou ferido num banco de areia e os jacarés estão esperando ele cansar. Se for, espante os jacarés e leve ele direto para a Dra. Marina.',
  b:'Um pescador viu um cachorrão ferido num banco de areia nos Alagados, cercado de jacaré. Valente que só! Chamam ele de Bravo.'}};
function ldgHear(k,quiet){const L=ldgEnsure();if(!L)return;const q=L.q[k];if(q.st<1){q.st=1;if(!quiet)toast('🗺️ Boato anotado: cão lendário na '+LDGREG[k]+' (veja o “?” no mapa)','good')}}
function ldgNextRumor(){const L=ldgEnsure();return LDGK.find(k=>L.q[k].st<1)}
function ldgSec(){const L=ldgEnsure();if(!L)return '';
 let h='<div class="sec">⭐ CÃES LENDÁRIOS ('+LDGK.filter(k=>L.q[k].st>=3).length+'/5)</div><div class="dim">Cinco cães únicos vivem escondidos pela região. Resgate e eles viram seus: mais fortes que qualquer um daqui, vaga extra no canil e coleira de ouro. Não se vendem.</div>';
 h+=LDGK.map(k=>{const q=L.q[k],D=DOGS[k];if(q.st<1)return '<div class="card dim">❔ ??? — ainda ninguém te contou.</div>';
  const own=S.dogs.find(d=>d.breed===k),st=q.st>=3?(own?'<span class="grn">✔ é seu</span>':'<span class="red">🕯️ perdido</span>'):q.st>=2?'<span class="gold">🐾 encontrado</span>':'<span class="dim">🔎 procurando</span>';
  return '<div class="card"><div style="display:flex;gap:8px;align-items:center">'+(q.st>=2?pv(k,own?own.id:0,84):'<div style="width:84px;text-align:center;font-size:30px">❔</div>')+'<div style="flex:1"><div class="row"><b>'+LDGN[k]+' <span class="dim">'+(q.st>=2?D.n:'')+'</span></b>'+st+'</div><div class="dim">📍 '+LDGREG[k]+'</div><div style="font-size:15px">'+LDGRUM[k].t+'</div></div></div></div>'}).join('');
 const nx=ldgNextRumor();
 h+='<div class="btns">'+(nx?(L.rt===S.day?'<span class="dim">Amanhã o Seu Tião lembra de mais histórias.</span>':'<button class="b gold" data-act="ldgtiao">💬 Perguntar sobre cães lendários</button>'):'')+'<button class="b" data-act="ldgmeat">🥩 Carne fresca '+R$(ITEMS.carnecao.p)+' (tem '+(S.inv.carnecao||0)+')</button></div>';
 return h}
ACT.ldgtiao=function(){const L=ldgEnsure(),k=ldgNextRumor();if(!k)return;L.rt=S.day;ldgHear(k,1);toast('🤠 Seu Tião: “Vou te contar uma... '+LDGN[k]+', lá na '+LDGREG[k]+'.”','good')};
ACT.ldgmeat=function(){const p=ITEMS.carnecao.p;if(S.money<p)return toast('Dinheiro insuficiente','bad');cash(-p,'Carne fresca');addItem('carnecao',1);toast('🥩 Carne fresca na mochila ('+S.inv.carnecao+')','good')};
const _dsmL=dogShopModal;dogShopModal=function(){_dsmL();reModal=dogShopModal;const box=$('mbox');if(!box)return;
 box.querySelectorAll('[data-act="dogsell"]').forEach(b=>{const d=dogById(b.dataset.v);if(isLgd(d)){const c=b.closest('.card');if(c)c.innerHTML='<div class="row"><b>'+d.name+' <span class="dim">'+DOGS[d.breed].n+'</span></b><span class="gold">⭐ lendário</span></div><div class="dim">Não se vende nem se troca.</div>'}});
 const all=box.querySelectorAll(':scope > .btns'),last=all[all.length-1],div=document.createElement('div');div.innerHTML=ldgSec();if(last)box.insertBefore(div,last);else box.appendChild(div)};
if(typeof barModal==='function'){const _bmL=barModal;barModal=function(){_bmL();const box=$('mbox');if(!box)return;const L=ldgEnsure();if(!L)return;const btns=[...box.children].reverse().find(e=>e.classList&&e.classList.contains('btns'));const div=document.createElement('div');div.className='card';
 div.innerHTML='<div class="row"><b>💬 Fofoca de cachorro</b><span class="dim">'+LDGK.filter(k=>L.q[k].st>=1).length+'/5 boatos</span></div><div class="dim">O pessoal do balcão sempre tem uma história de cão.</div><div class="btns">'+(L.rb===S.day?'<span class="dim">Volte amanhã para mais fofoca.</span>':'<button class="b gold" data-act="ldgbar">👂 Ouvir a fofoca (pague uma rodada R$ 20)</button>')+'</div>';if(btns)box.insertBefore(div,btns);else box.appendChild(div)}}
ACT.ldgbar=function(){const L=ldgEnsure();if(L.rb===S.day)return;if(S.money<20)return toast('Dinheiro insuficiente','bad');cash(-20,'Rodada no bar');L.rb=S.day;const k=ldgNextRumor()||pick(LDGK.filter(q=>ldgOpen(q)))||null;hideModal();
 if(!k)return toast('🍺 “Cachorro lendário? Já tá tudo com você, patrão!”');ldgHear(k,1);showModal('<h3>🍺 Fofoca no balcão</h3><div class="card">“'+LDGRUM[k].b+'”</div><div class="dim">📍 '+LDGREG[k]+' — marcado com “?” no mapa.</div><div class="btns"><button class="b gray" data-act="close">Valeu!</button></div>')};
// busto do Coronel: a coleira de ouro do Rei
if(typeof prefBusto==='function'){const _pbL=prefBusto;prefBusto=function(){_pbL();const box=$('mbox'),L=ldgEnsure();if(!box||!L)return;const q=L.q.coronel,btns=[...box.children].reverse().find(e=>e.classList&&e.classList.contains('btns'));const div=document.createElement('div');div.className='card';
 div.innerHTML='<b>🐕 Rei, o fila do Coronel</b><div class="dim">Na vitrine ao lado do busto: uma coleira de couro com placas de ouro e um medalhão de rubi. “Rei guardou a sede até o último dia. Seus netos ainda vigiam as ruínas da Mata do Oeste.”</div>'
  +(q.st>=3?'<div class="grn">✔ O Coronel já está com você, com a coleira da família.</div>':q.col?'<div class="grn">✔ A coleira de ouro está com você. Leve até as ruínas.</div>':'<div class="btns"><button class="b gold" data-act="ldgcol">🏅 Pegar a coleira (doação de R$ 2.000 ao museu)</button></div>');
 if(btns)box.insertBefore(div,btns);else box.appendChild(div);if(q.st<1)ldgHear('coronel')}}
ACT.ldgcol=function(){const q=ldgEnsure().q.coronel;if(q.col)return;if(S.money<2000)return toast('Dinheiro insuficiente','bad');cash(-2000,'Doação ao museu da Prefeitura');q.col=1;ldgHear('coronel',1);hideModal();toast('🏅 Seu João te entregou a coleira de ouro do Rei. Agora vá às ruínas da Mata do Oeste.','good')};
// Dra. Marina termina o tratamento do Bravo
const _npcL=npcModal;npcModal=function(id){_npcL(id);if(id!=='marina'||!S.lgd)return;const q=S.lgd.q.bravo,d=S.dogs.find(x=>x.breed==='bravo');if(!q||!q.vet||!d)return;q.vet=0;d.wounds=[];d.venom=0;d.hp=dogMax(d);d.faint=0;gainXP(150,'resgate');
 const box=$('mbox');if(box)box.insertAdjacentHTML('afterbegin','<div class="card"><b>🩺 Dra. Marina e o Bravo</b><div>“Esse cão é uma fortaleza! Costurei as mordidas de jacaré, tomou soro e vitamina. Em uma semana está melhor que novo.” <span class="grn">Bravo curado.</span></div></div>');toast('🩺 Bravo curado pela Dra. Marina! Agora ele está 100%.','good')};
// ---------- resgate
function ldgRescue(k,o){o=o||{};const L=ldgEnsure(),D=DOGS[k],nm=LDGN[k],q=L.q[k];if(!ldgOpen(k))return;q.st=3;q.day=S.day;
 const nd={id:Date.now()%1e7+77+LDGK.indexOf(k),breed:k,name:nm,sex:'M',age:ri(900,1300),wounds:o.wounds||[],col:0,arm:0,lgd:1};nd.hp=Math.round(dogMax(nd)*(o.hp||.7));if(nd.hp===100)nd.hp=101;
 S.dogs.push(nd);const R=LDR[k],r=dogRT(nd);if(R){r.x=R.x;r.y=R.y}r.st='follow';r.wag=4;
 const prev=dogById(S.dogAct);if(prev&&prev!==nd&&!prev.esc&&S.dogs.filter(d=>d.esc).length<2)prev.esc=1;S.dogAct=nd.id;
 for(const a of WILD)if(a.lgp===k)a.left=1;delete LDR[k];gainXP(400,'cão lendário');try{barkSnd(1)}catch(e){}
 try{addTrof('⭐','Resgatou '+nm+' ('+D.n+')')}catch(e){}
 const n=S.dogs.filter(d=>isLgd(d)).length;reModal=null;
 showModal('<h3>⭐ '+nm+' agora é seu!</h3><div class="card" style="display:flex;gap:10px;align-items:center">'+pv(k,nd.id,150)+'<div><b>'+D.n+'</b><div class="dim">'+D.d+'</div></div></div>'
  +'<div class="card">'+dogStats(nd,D)+'</div><div class="card dim" style="font-size:15px">⭐ Cão lendário: tem vaga extra no canil e coleira de ouro. Não se vende. Se cair numa briga ele <b>desmaia</b>: você tem 1 minuto para socorrer (✋ perto dele).'+(o.msg?'<br>'+o.msg:'')+'<br>Lendários resgatados: <b>'+n+'/5</b></div><div class="btns"><button class="b gold" data-act="close">Vamos, '+nm+'!</button></div>')}
// ---------- guias de lobo/jacaré em volta do cão
function ldgPack(k){return WILD.filter(a=>a.lgp===k&&a.st!=='dead'&&!a.left)}
function ldgSpawnPack(k,sp,n,water){const s=ldgSite(k),SP=SPECIES[sp];if(!SP)return 0;let made=0;
 for(let t=0;t<120&&made<n;t++){const an=rnd(0,6.28),rr=water?rnd(28,110):rnd(40,80),x=s.x+Math.cos(an)*rr,y=s.y+Math.sin(an)*rr*.7,tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(tx<XMIN||ty<YMIN||tx>=MW||ty>=RZ-1)continue;const i=ti(tx,ty);if(SOL[i])continue;if(water?G[i]!==2:G[i]===2)continue;
  WILD.push({id:++WID,sp,x,y,dir:x<s.x?1:-1,st:'idle',al:0,hp:SP.hp*rnd(.95,1.1),kg:rnd(SP.w[0],SP.w[1]),male:Math.random()<.6,pts:0,wait:rnd(.5,3),tx:x,ty:y,ft:0,fa:0,bleed:0,hitQ:'',vis:0,dt:0,hurt:0,cd:0,bt:0,lgp:k});made++}
 return made}
// ---------- cenário de cada esconderijo
function ldgCabin(g,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);R('rgba(0,0,0,.25)',-23,-2,46,4);
 for(let i=0;i<7;i++){R(i%2?'#5a3e28':'#4a3220',-20,-24+i*3.4,40,3.4);R('#6a4a30',-20,-24+i*3.4,40,.6)}R('#3a2616',-21.4,-25,2.6,25);R('#3a2616',18.8,-25,2.6,25);
 R('#120c08',-4.5,-16,9,16);R('#5a3a22',-4.5,-16,3.2,16);R('#3a2616',-5.2,-17.2,10.4,1.2);
 R('#141822',8,-19,7,6);R('#7a5a3a',8,-19,7,.8);R('#7a5a3a',11.2,-19,.8,6);R('#cfe0ee',9,-18,1.4,2);R('#cfe0ee',13.2,-16,1,1.6);R('#141822',-15,-19,6,5);R('#7a5a3a',-15,-19,6,.8);
 for(let i=0;i<10;i++){const w=50-i*5.2;R(i>5?'#f4f8fc':'#3a2a1c',-w/2,-26-i*1.7,w,1.8);if(i<=5)R('#4a3826',-w/2,-26-i*1.7,w,.5)}
 R('#f4f8fc',-26,-27,52,2.2);R('#ffffff',-25,-28,22,1);R('#ffffff',3,-28,18,1);R('#120c08',5,-32,6,2.4);R('#5a3a22',5,-29.8,7,.8);
 R('#eef4fa',-24,-2.4,10,2.6);R('#eef4fa',13,-2.4,12,2.6);R('#5a3a22',-30,-6,8,1.2);R('#4a3220',-29,-8,1,8)}
function ldgRuins(g,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);R('rgba(0,0,0,.22)',-28,-2,56,4);
 for(let r=0;r<6;r++)for(let c=0;c<4-(r>3?2:r>1?1:0);c++){const sx=-28+c*6+(r%2)*3,sy=-6-r*5;R(((r+c)%2)?'#8a8278':'#9a9288',sx,sy,5.6,4.6);R('#6a645c',sx,sy+4,5.6,.6);R('#b0a89c',sx,sy,5.6,.5)}
 R('#7a7268',-27,-40,7,12);R('#5a544c',-27,-40,7,1.2);R('#2a2420',-25.6,-39,4,1);
 for(let c=0;c<3;c++){R('#8e867c',14+c*5,-6,4.6,4.6);R('#6a645c',14+c*5,-1.8,4.6,.6)}R('#8e867c',16,-11,4.6,4.6);R('#8e867c',21,-11,4.6,4.6);R('#9a9288',18,-16,4.6,4.6);
 R('#3a2616',-3,-15,1.6,15);R('#3a2616',9,-15,1.6,15);R('#5a3e28',-3,-13,13.6,1.2);R('#5a3e28',-1,-8,10,1.2);R('#5a3e28',2,-13,1,6);
 R('#3a2616',-7,-24,20,7.6);R('#c8a040',-6.4,-23.4,18.8,6.4);R('#8a6a20',-6.4,-17.6,18.8,.6);ptext(g,'1898',x-4,y-22.2,'#3a2a10');
 for(let i=0;i<12;i++)R(i%2?'#3a6a2a':'#4a7a32',-28+i*2.4,-30+((i*7)%11),2,3);for(let i=0;i<5;i++)R('#3a6a2a',12+i*3,-12-((i*5)%7),2.2,2.6);
 R('#5a7a3a',-30,-3,6,3);R('#5a7a3a',24,-3,6,3)}
function ldgWell(g,x,y,t){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);R('rgba(0,0,0,.25)',-11,-2,22,4);
 R('#7a7268',-10,-10,20,10);for(let i=0;i<4;i++){R(i%2?'#8a8278':'#968e84',-10+i*5,-10,4.6,3.4);R(i%2?'#968e84':'#8a8278',-7.5+i*5,-6.6,4.6,3.4)}R('#5a544c',-10,-1.4,20,1.4);
 R('#14100c',-8,-12.4,16,3);R('#9a9288',-10,-13,20,1.4);R('#b0a89c',-10,-13,20,.5);
 R('#4a3220',-9,-26,1.6,14);R('#4a3220',7.4,-26,1.6,14);R('#3a2616',-11,-27,13,1.6);R('#5a3e28',-9.5,-22,18,1.2);R('#7a5a3a',-1,-22,2,2);R('#a8865a',-.4,-21,.6,8);
 if(t&&((frame>>5)%4===0)){R('#ffffff',3,-34,11,7);R('#1e140c',3,-34,11,.6);R('#1e140c',3,-27.6,11,.6);ptext(g,'AU',x+4.5,y-32.5,'#1e140c')}}
function ldgLog(g,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);R('rgba(0,0,0,.22)',-18,-1,36,3);
 R('#6a4a2a',-18,-6,34,5);R('#7a5a32',-18,-6,34,1.2);R('#4a3018',-18,-1.6,34,.8);R('#c8a060',16,-6,3,5);R('#a07a40',16.6,-5,1.6,3);for(let i=0;i<5;i++)R('#5a3a1e',-14+i*7,-5,.6,3);
 R('#5a3a1e',-12,-13,1.6,7);R('#5a3a1e',-4,-11,1.4,5);for(let i=0;i<9;i++)R(i%3?'#f0c830':'#e0a820',-16+((i*9)%28),-9-((i*5)%6),2.2,1.8);
 R('#a8865a',6,-1,6,1.2)}
function ldgSand(g,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);R('#d8c890',-26,-6,52,12);R('#e4d6a0',-22,-8,44,4);R('#cbb980',-24,4,48,2);
 R('#5a3a22',10,-3,16,4);R('#7a5232',11,-4,14,1.4);R('#3a2616',24,-3,2,3);R('#a8865a',13,-1,8,.6);
 for(let i=0;i<7;i++)R(i%2?'#5a8a3a':'#6a9a42',-26+i*7,-12-((i*3)%4),1.2,7)}
function ldgPaws(L,k,x0,x1,y0,y1){const p=S.lgd.pos[k],s=ldgSite(k),an=Math.atan2(45-p[1],30-p[0]),ca=Math.cos(an),sa=Math.sin(an),snow=G[ti(p[0],p[1])]===5;
 for(let i=3;i<44;i++){const w=Math.sin(i*1.7+p[0])*7,x=s.x+ca*i*9-sa*w+(i%2?2.5:-2.5),y=s.y+sa*i*9+ca*w;if(x<x0-10||x>x1+10||y<y0-10||y>y1+10)continue;
  const tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(tx<XMIN||ty<YMIN||tx>=MW||ty>=RZ)continue;const gi=G[ti(tx,ty)];if(gi===2||gi===3||SOL[ti(tx,ty)])continue;
  const c=snow?'rgba(70,90,120,.45)':'rgba(50,30,15,.38)';L.push([y-40,10,{draw:g=>{Rr(g,c,x-.8,y,1.8,1.4);Rr(g,c,x-1.4,y-1.2,.7,.7);Rr(g,c,x-.4,y-1.6,.7,.7);Rr(g,c,x+.6,y-1.2,.7,.7)}}])}}
const _evoL=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoL(L,x0,x1,y0,y1);if(!S||!S.lgd||inRoom())return;
 for(const k of LDGK){const s=ldgSite(k),open=ldgOpen(k);if(s.x<x0-420||s.x>x1+420||s.y<y0-420||s.y>y1+420)continue;
  if(open)ldgPaws(L,k,x0,x1,y0,y1);
  if(s.x<x0-60||s.x>x1+60||s.y<y0-30||s.y>y1+60)continue;
  if(k==='fantasma')L.push([s.y-14,10,{draw:g=>ldgCabin(g,s.x,s.y-14)}]);
  else if(k==='coronel')L.push([s.y-16,10,{draw:g=>ldgRuins(g,s.x,s.y-16)}]);
  else if(k==='relampago')L.push([s.y,10,{draw:g=>ldgWell(g,s.x,s.y,open)}]);
  else if(k==='rastro')L.push([s.y-8,10,{draw:g=>ldgLog(g,s.x+12,s.y-8)}]);
  else if(k==='bravo')L.push([s.y-30,10,{draw:g=>ldgSand(g,s.x,s.y)}]);
  if(!ldgVis(k))continue;const R=ldgRt(k),D=DOGS[k],q=S.lgd.q[k];
  let pose=R.mv?(R.run?'run':'walk'):'stand';if(k==='fantasma'&&!q.free)pose=ldgPack(k).length?'stand':'lie';if(k==='bravo')pose='lie';if(k==='rastro'&&!R.mv)pose=ldgNight()?'sleep':R.eat>0?'sniff':'sit';if(k==='coronel'&&!R.mv&&!R.bk)pose=ldgNight()?'lie':'stand';
  L.push([R.y,10,{draw:g=>drawDogSprite(g,R.x,R.y,R.dir,D.v,pose,R.ph,{wild:1,col:-1,mv:R.mv,bark:R.bk>0&&((frame>>2)&1),sleep:pose==='sleep',wounds:k==='bravo'?[{sev:3,bt:5},{sev:2,bt:5}]:null,hurt:k==='bravo'})}])}};
// ---------- interação nos esconderijos
const _ilL=interactList;interactList=function(){const L=_ilL();if(!S||!S.lgd||inRoom()||P.drive)return L;
 for(const d of S.dogs)if(d.faint>0){const r=dogRT(d);L.push({x:r.x,y:r.y-4,r:30,label:'🩹 Socorrer o '+d.name+' (desmaiado · '+Math.ceil(d.faint)+'s)',fn:()=>ldgRevive(d)})}
 for(const k of LDGK){if(!ldgOpen(k))continue;const s=ldgSite(k);if(Math.abs(s.x-P.x)>140||Math.abs(s.y-P.y)>140)continue;const q=S.lgd.q[k],R=ldgRt(k);
  if(k==='fantasma'){if(ldgVis(k)){if(q.free)L.push({x:R.x,y:R.y-6,r:34,label:'🤍 Chamar o Fantasma (estender a mão)',fn:()=>ldgRescue('fantasma',{hp:.75,wounds:[{sev:2,bt:0,inf:0,band:1,day:S.day,loc:'pescoço'}],msg:'Ele ainda tem mordidas de lobo enfaixadas.'})});
    else L.push({x:R.x,y:R.y-6,r:40,label:'🐺 O cão branco está cercado',fn:()=>toast('🐺 A matilha não deixa você chegar. Espante ou abata os lobos (tiro ou PEGA com seus cães).','bad')})}
   else L.push({x:s.x,y:s.y-20,r:40,label:'🏚️ Cabana abandonada',fn:()=>toast('🏚️ Pegadas enormes na neve e tufos de pelo branco... O cão só aparece à NOITE, quando os lobos descem a serra.')})}
  else if(k==='coronel')L.push({x:R.x,y:R.y-6,r:48,label:q.col?'🏅 Mostrar a coleira de ouro do Rei':'🐕 O cão das ruínas',fn:()=>{if(!q.col)return toast('🐕 Ele rosna e mostra os dentes. Dizem que só obedece a quem trouxer a coleira de ouro da família (busto do Coronel, na Prefeitura).','bad');ldgRescue('coronel',{hp:.9,msg:'Ele cheirou a coleira, abaixou as orelhas e deitou aos seus pés. A linhagem do Rei tem dono de novo.'})}});
  else if(k==='relampago')L.push({x:s.x,y:s.y-8,r:34,label:'🕳️ Poço velho (latido lá no fundo)',fn:()=>ldgWellTry()});
  else if(k==='rastro'){const near=Math.hypot(R.x-P.x,R.y-P.y);if(near<46&&!R.mv)L.push({x:R.x,y:R.y-4,r:40,label:'🥩 Deixar carne pro cão ('+(q.fed||0)+'/3 dias)',fn:()=>ldgFeed()})}
  else if(k==='bravo')L.push({x:s.x,y:s.y-6,r:36,label:ldgPack('bravo').length?'🐊 Cão ferido cercado de jacarés':'🩹 Socorrer o Bravo',fn:()=>{if(ldgPack('bravo').length)return toast('🐊 Ainda tem jacaré em volta do cão! Espante ou abata antes (cuidado com o bote).','bad');
   ldgRescue('bravo',{hp:.3,wounds:[{sev:3,bt:0,inf:0,band:1,day:S.day,loc:'pata traseira'},{sev:2,bt:0,inf:0,band:1,day:S.day,loc:'costela'}],msg:'<b>Leve o Bravo até a Dra. Marina</b> (veterinária da vila) para terminar o tratamento.'});q.vet=1;const v=BLD.find(b=>b.id==='vet');if(v)TIPT={f:()=>inRoom()?null:{x:v.door*TS+8,y:(v.y+v.h)*TS+8,h:'Dra. Marina'},until:Date.now()+600000}}})}
 return L};
function ldgWellTry(){ensureH();const q=S.lgd.q.relampago;if(!S.h.gear.corda)return toast('🕳️ Tem um cachorro latindo lá no fundo do poço! Você precisa de uma 🪢 corda (Loja do Caçador › Itens).','bad');
 if(q.cd&&Date.now()<q.cd)return toast('🪢 Arrume a corda de novo... (alguns segundos)');
 tgStart({ic:'🪢',n:'Tirando o cão do poço',d:'Ele está preso no fundo. Puxe a corda na hora certa (Espaço ou botão). 3 acertos tiram ele de lá.',em:'🕳️🪢🐕',btn:'PUXAR!',tries:5,w:.2,spd:1.25,end:n=>{if(n>=3){setTimeout(()=>{hideModal();ldgRescue('relampago',{hp:.5,wounds:[{sev:2,bt:0,inf:0,band:1,day:S.day,loc:'pata traseira'}],msg:'Estava magrinho e com a pata machucada da queda. Ração boa e ele volta a voar.'})},1400);return '🐕 Você puxou o galgo para fora do poço!'}q.cd=Date.now()+8000;return '🪢 A corda escorregou ('+n+'/3). Respire e tente de novo.'}})}
function ldgFeed(){const q=S.lgd.q.rastro,R=ldgRt('rastro');if(!P.sneak)return ldgSpook();if(q.last===S.day)return toast('🐕 Ele já comeu hoje. Volte amanhã, agachado.');
 ensureH();let food=null;if(takeItem('carnecao',1))food='carne fresca';else{const b=S.h.bag;if(b.length){let i=0;for(let j=1;j<b.length;j++)if(b[j].kg<b[i].kg)i=j;food=SPECIES[b[i].sp].n.toLowerCase();b.splice(i,1);P.carry=b.reduce((s,c)=>s+c.kg,0)}}
 if(!food)return toast('🥩 Você não tem carne. Compre carne fresca no Seu Tião (canil) ou leve uma caça abatida.','bad');
 q.fed=q.last===S.day-1?(q.fed||0)+1:1;q.last=S.day;R.eat=6;gainXP(20,'confiança');
 if(q.fed>=3)return setTimeout(()=>ldgRescue('rastro',{hp:.8,msg:'Três dias de carne e paciência: ele encostou o focinho na sua mão e veio junto.'}),1200),toast('🐕 Ele comeu e abanou o rabo pela primeira vez...','good');
 toast('🥩 Você deixou '+food+' e ficou quietinho. Ele comeu! Confiança '+q.fed+'/3 — volte amanhã (dias seguidos).','good')}
function ldgSpook(){const R=ldgRt('rastro'),s=ldgSite('rastro');if(R.mv)return;for(let t=0;t<30;t++){const an=Math.atan2(R.y-P.y,R.x-P.x)+rnd(-1,1),rr=rnd(5,8)*TS,x=R.x+Math.cos(an)*rr,y=R.y+Math.sin(an)*rr;if(Math.hypot(x-s.x,y-s.y)>12*TS||!freeAt(x,y))continue;R.tx=x;R.ty=y;R.mv=1;R.run=1;break}
 if(!R.mv){R.tx=s.x;R.ty=s.y;R.mv=1;R.run=1}tt('ldgsp','🐕 O cão desconfiado fugiu pro mato! Chegue AGACHADO (🐾 AGACHAR) e devagar.','bad',6)}
// ---------- comportamento por quadro
let ldgT=0;
const _upL=update;update=function(dt){_upL(dt);if(!S||!S.dogs)return;
 for(const d of S.dogs)if(d.faint>0){d.faint-=dt;if(d.faint<=0){d.faint=0;const c=d.fcause||'ferimentos';_ddL(d,c+' (não foi socorrido a tempo)')}}
 const L=ldgEnsure();if(!L)return;const IR=inRoom();
 for(const k of LDGK){if(!ldgOpen(k))continue;const R=ldgRt(k),s=ldgSite(k);R.bk=Math.max(0,R.bk-dt);R.cd=Math.max(0,R.cd-dt);if(R.eat>0)R.eat-=dt;
  if(R.mv&&R.tx!==null){const dx=R.tx-R.x,dy=R.ty-R.y,dd=Math.hypot(dx,dy),sp=(R.run?150:40)*dt;if(dd<2){R.mv=0;R.run=0;R.tx=null}else{R.x+=dx/dd*Math.min(sp,dd);R.y+=dy/dd*Math.min(sp,dd);R.dir=dx>0?1:-1;R.ph+=Math.min(sp,dd)*.5}}
  if(IR)continue;const dP=Math.hypot(R.x-P.x,R.y-P.y);
  if(k==='coronel'&&!L.q.coronel.col&&dP<100){R.dir=P.x>R.x?1:-1;if(dP<90&&R.cd<=0&&Math.random()<dt*2){R.bk=.5;try{barkSnd(1)}catch(e){}}
   if(dP<24&&R.cd<=0){R.cd=1.6;R.bk=.8;P.hp=Math.max(5,P.hp-6);P.hurt=.6;const ux=(P.x-R.x)/(dP||1),uy=(P.y-R.y)/(dP||1);for(let i=0;i<6;i++){const nx=P.x+ux*4,ny=P.y+uy*4;if(freeAt(nx,ny)){P.x=nx;P.y=ny}}tt('ldgcor','🐕 O cão das ruínas te deu um bote (-6)! Ele não deixa ninguém chegar... sem a coleira de ouro.','bad',5)}}
  if(k==='coronel'&&L.q.coronel.col&&dP<90){R.dir=P.x>R.x?1:-1}
  if(k==='rastro'&&!P.sneak&&dP<110&&!R.mv)ldgSpook();
  if(k==='rastro'&&!R.mv&&Math.hypot(R.x-s.x,R.y-s.y)>3&&dP>260){R.tx=s.x;R.ty=s.y;R.mv=1;R.run=0}
 }
 // lobos em volta da cabana (de noite) e jacarés em volta do Mastim
 for(const a of WILD){if(!a.lgp||a.st==='dead'||a.left)continue;const s=ldgSite(a.lgp),d=Math.hypot(a.x-s.x,a.y-s.y);if(a.st==='flee'||d>16*TS){a.left=1;continue}
  if(a.st==='idle'&&Math.hypot(a.tx-s.x,a.ty-s.y)>64){const an=rnd(0,6.28),w=a.sp==='croc';a.tx=s.x+Math.cos(an)*rnd(w?24:36,w?70:60);a.ty=s.y+Math.sin(an)*rnd(18,40)}}
 ldgT-=dt;if(ldgT>0||IR)return;ldgT=.5;
 for(const k of LDGK){if(!ldgOpen(k))continue;const q=L.q[k],s=ldgSite(k),R=ldgRt(k),dx=s.x-P.x,dy=s.y-P.y,dT=Math.hypot(dx,dy)/TS;
  if(k==='fantasma'){if(ldgNight()&&!q.free&&!R.pack&&dT<38){R.pack=ldgSpawnPack(k,'wolf',4,0)?1:0}
   if(R.pack&&!q.free&&!ldgPack(k).length){q.free=1;R.pack=0;toast('🐺 A matilha foi embora! O cão branco te olha da porta da cabana... chegue perto e estenda a mão.','good')}
   if(dT>75&&R.pack&&!q.free){for(let i=WILD.length-1;i>=0;i--)if(WILD[i].lgp===k&&WILD[i].st!=='dead')WILD.splice(i,1);R.pack=0}
   if(!ldgNight()&&R.pack&&!q.free&&dT>30){for(let i=WILD.length-1;i>=0;i--)if(WILD[i].lgp===k&&WILD[i].st!=='dead')WILD.splice(i,1);R.pack=0}}
  if(k==='bravo'){if(!R.pack&&dT<36){R.pack=ldgSpawnPack(k,'croc',3,1)?1:0;if(!R.pack)R.pack=2}
   if(R.pack&&dT>80){for(let i=WILD.length-1;i>=0;i--)if(WILD[i].lgp===k&&WILD[i].st!=='dead')WILD.splice(i,1);R.pack=0}}
  // latido distante e “achou”
  if(q.st<2&&dT<46&&dT>12&&(k!=='fantasma'||ldgNight())){if(Math.random()<.04){try{barkSnd(1)}catch(e){}tt('ldgb'+k,'🐾 '+(k==='relampago'?'Um latido abafado, como se viesse de dentro da terra,':'Um latido grosso')+' vindo do '+ldgDirTxt(dx,dy)+'... '+(q.st<1?'tem cachorro solto por aqui?':'é o cão da história!'),'',40);ldgHear(k,1)}}
  if(q.st<2&&dT<11){q.st=2;const msg={fantasma:ldgNight()?'🐺 Um cão BRANCO enorme na porta da cabana, cercado de lobos! Espante a matilha.':'🏚️ Uma cabana abandonada com pegadas enormes... ele deve aparecer à noite.',
    coronel:'🐕 Um fila tigrado enorme guarda as ruínas. Ele rosna: melhor não chegar perto sem a coleira de ouro da família.',relampago:'🕳️ O latido vem de dentro do poço velho! Tem um cão preso lá embaixo. Precisa de corda.',
    rastro:'🐕 Um bloodhound orelhudo perto do ipê caído. Desconfiado: chegue agachado e deixe carne, três dias seguidos.',bravo:'🐊 Um mastim ferido no banco de areia, com jacarés em volta! Espante os jacarés e socorra ele.'}[k];showModal('<h3>⭐ Cão lendário!</h3><div class="card">'+msg+'</div><div class="btns"><button class="b gold" data-act="close">Entendi</button></div>');reModal=null}}
 // Rastro: mostra a trilha de sangue com seta
 const rd=S.dogs.find(d=>d.breed==='rastro'&&!d.faint&&partyDogs().includes(d));if(rd){const r=dogRT(rd);if(r.st==='track'&&r.tgt&&WILD.includes(r.tgt)){const a=r.tgt;TIPT={f:()=>WILD.includes(a)?{x:a.x,y:a.y,h:'🩸 rastro de sangue'}:null,until:Date.now()+4000}}}};
// ---------- mapa: “?” nos boatos e 🐾 nos encontrados
const _mmL=mapModal;mapModal=function(){_mmL.apply(this,arguments);const cv=document.getElementById('wmapc'),L=S&&S.lgd;if(!cv||!L)return;const g=cv.getContext('2d'),s=4;g.textAlign='center';
 for(const k of LDGK){const q=L.q[k];if(q.st<1||!ldgOpen(k))continue;const p=L.pos[k],h=Math.abs(hsh(k)|0),ox=q.st>=2?0:((h%11)-5),oy=q.st>=2?0:(((h>>4)%9)-4),x=(p[0]+ox)*s,y=(p[1]+oy)*s;
  g.fillStyle='#000';g.beginPath();g.arc(x,y,10,0,7);g.fill();g.fillStyle=q.st>=2?'#ffd75e':'#c8a0ff';g.beginPath();g.arc(x,y,8,0,7);g.fill();g.fillStyle='#1e140c';g.font='bold 13px monospace';g.fillText(q.st>=2?'⭐':'?',x,y+4.5);
  const t=q.st>=2?LDGN[k].toUpperCase():'CAO LENDARIO?';g.font='bold 12px monospace';g.lineWidth=3;g.strokeStyle='#000';g.strokeText(t,x,y-13);g.fillStyle=q.st>=2?'#ffd75e':'#e0c8ff';g.fillText(t,x,y-13)}};
// ---------- vaga extra no canil para cada lendário (kennelCap soma os lendários)
if(typeof GUIDE!=='undefined')GUIDE.push({lv:2,ic:'⭐',t:'Cães lendários',h:'Cinco cães únicos vivem escondidos: Serra Alta, Mata do Oeste, Campos do Oeste, Cerrado do Sul e Alagados. Pergunte ao Seu Tião (canil) e ouça a fofoca no Bar do Tonhão: aparece um “?” no mapa. Perto, você ouve latidos e vê pegadas. Cada um tem um jeito de resgatar. Eles são mais fortes que o Cáucaso, têm vaga extra no canil, coleira de ouro e não se vendem. Se caírem numa briga, desmaiam: 1 minuto para socorrer.'});
