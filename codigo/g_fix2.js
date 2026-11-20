// ===== Correções: trânsito (não entra na fazenda, não atravessa árvores, para para pedestres), barreira invisível na estrada,
// ===== Bar do Tonhão por dentro e gente de verdade na frente do bar
// ---------- estradas
TRT[0].a=Math.max(TRT[0].a,61*TS);TRT[1].a=Math.max(TRT[1].a,61*TS);
const isFarmT=(x,y)=>x<59&&y>=35&&y<=131;
function laneTiles(r){const c=Math.floor(r.c/TS),L=[];for(let k=Math.floor(r.a/TS);k<=Math.floor(r.b/TS);k++)for(const o of[c-1,c])L.push(r.h?[k,o]:[o,k]);return L}
function roadCarve(){
 const bad=new Set();for(const r of TRT){for(const [x,y] of laneTiles(r)){if(x<XMIN+1||y<YMIN+1||x>=MW-1||y>=RZ-2)continue;const i=ti(x,y);
   if(SOL[i]&&!BLD.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h)&&G[i]!==1&&G[i]!==2){SOL[i]=0;if(G[i]!==3)G[i]=3}}
  const c=Math.floor(r.c/TS);for(let k=Math.floor(r.a/TS);k<=Math.floor(r.b/TS);k++)for(let o=c-2;o<=c+1;o++){const x=r.h?k:o,y=r.h?o:k;if(isFarmT(x,y)||TOWNZ(x,y))continue;bad.add(x+','+y)}}
 const hit=t=>bad.has(Math.floor(t.x/TS)+','+Math.floor(t.y/TS));
 for(let i=TREES.length-1;i>=0;i--)if(hit(TREES[i])){const t=TREES[i];SOL[ti(Math.floor(t.x/TS),Math.floor((t.y-1)/TS))]=0;TREES.splice(i,1)}
 for(let i=BUSH.length-1;i>=0;i--)if(hit(BUSH[i]))BUSH.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(hit(DECO[i]))DECO.splice(i,1);
 if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--){const b=BOULD[i];if(bad.has(b.x+','+b.y)||bad.has((b.x+1)+','+b.y)){SOL[ti(b.x,b.y)]=0;if(b.big)SOL[ti(b.x+1,b.y)]=0;BOULD.splice(i,1)}}}
const _rfcFx2=rfCarve;rfCarve=function(){_rfcFx2();roadCarve()};
// ---------- carros: pedestres, bichos e o jogador param o carro; devagar na vila; acelera e freia suave
function trfObstacles(){const L=[];const add=(x,y,k)=>L.push([x,y,k]);add(P.x,P.y,'p');
 if(typeof VPPL!=='undefined')for(const p of VPPL)if(!p.hid)add(p.x,p.y,p);
 if(typeof VDOGS!=='undefined')for(const d of VDOGS)add(d.x,d.y,'d');
 if(typeof VCHK!=='undefined')for(const c of VCHK)add(c.x,c.y,'c');
 if(typeof BARF!=='undefined')for(const b of BARF)if(b.vis)add(b.x,b.y,'b');
 for(const n of NPCS)if(n.x!==undefined)add(n.x,n.y,'n');
 if(typeof WILD!=='undefined')for(const w of WILD)if(!w.dead&&w.x!==undefined)add(w.x,w.y,'w');
 if(typeof rideDogs==='function')try{rideDogs().forEach(d=>{const r=dogRT(d);add(r.x,r.y,'g')})}catch(e){}
 if(typeof IMPT!=='undefined'&&IMPT)add(IMPT.x,IMPT.y,'t');
 return L}
stepTraffic=function(dt){
 if(inRoom())return;trfT-=dt;if(trfT<=0){trfT=rnd(2.2,5);if(TRF.length<5)trfSpawn()}
 const OB=trfObstacles();
 for(let i=TRF.length-1;i>=0;i--){const v=TRF[i],r=TRT[v.r],p=trfPos(v);if(r.h&&v.s<r.a-40){TRF.splice(i,1);continue}
  const ahead=(ax,ay)=>r.h?(ax-p.x)*v.dir:(ay-p.y)*v.dir,lat=(ax,ay)=>r.h?Math.abs(ay-p.y):Math.abs(ax-p.x),L=v.k==='truck'?84:v.k==='car'?50:44;
  const tx=Math.floor(p.x/TS),ty=Math.floor(p.y/TS);let tgt=v.v*(TOWNZ(tx,ty)?.45:1);let block=null;
  for(const o of OB){const a=ahead(o[0],o[1]);if(a<-6||a>L+70)continue;if(lat(o[0],o[1])>15)continue;
   if(a<L+18){tgt=0;block=o;break}tgt=Math.min(tgt,v.v*.3)}
  for(const w of TRF)if(w!==v&&w.r===v.r&&w.dir===v.dir){const d=(w.s-v.s)*v.dir;if(d>0&&d<L+34)tgt=Math.min(tgt,d<L+16?0:(w.cs||w.v))}
  if(block&&block[2]==='p'){v.hk-=dt;if(v.hk<=0){v.hk=4;honk(v.k==='truck');tt('honk','🚚 Bi-biii! Saia da estrada!','bad',6)}}
  if(block&&typeof block[2]==='object'){v.wt=(v.wt||0)+dt;if(v.wt>1.6){const q=block[2];const lane=p.y;q.tx=q.x;q.ty=(q.y<=lane?q.y-22:q.y+22);q.wait=0;v.wt=0}}else v.wt=0;
  const cs=v.cs===undefined?tgt:v.cs;v.cs=tgt<cs?Math.max(tgt,cs-150*dt):Math.min(tgt,cs+38*dt);
  v.s+=v.dir*v.cs*dt;v.mv=v.cs>1;
  if(v.s<r.a-60||v.s>r.b+40||Math.hypot(p.x-P.x,p.y-P.y)>900)TRF.splice(i,1)}};
// ---------- Bar do Tonhão por dentro
ROOMS.bar={id:'bar',x:2,y:RZ+30,w:14,h:10,floor:'red',wall:'#e8c070',trim:'#2f7a4a',win:[],items:[
 {k:'clerk',x:3,y:2},{k:'balcao',x:1,y:3,w:6,h:1,act:'balcao'},{k:'freezerb',x:8,y:2,w:2,h:1,act:'freezer'},{k:'jukebox',x:12,y:2,w:1,h:1,act:'juke'},
 {k:'sinuca',x:9,y:5,w:3,h:2,act:'sinuca'},{k:'cueman',x:8,y:6},
 {k:'mesab',x:2,y:6,w:1,h:1,act:'papo'},{k:'patron',x:1,y:6,s:'#3a6ab0',h:'#2a1a10',d:3},{k:'patron',x:3,y:6,s:'#c83a2a',h:'#d8c080',d:2,hat:'#6a4a2a'},
 {k:'mesab',x:12,y:7,w:1,h:1,act:'papo'},{k:'patron',x:11,y:7,s:'#5a8a3a',h:'#3a2a1a',d:3,hat:'#e8dcb0'},
 {k:'banq',x:2,y:4},{k:'banq',x:4,y:4},{k:'banq',x:6,y:4}],
 wallx:[{k:'garrafas',x:1},{k:'placabar',x:5},{k:'tvfut',x:9},{k:'flamula',x:12}]};
CLERK.bar={n:'Tonhão',shirt:'#f0ece0',hair:'#1a1a1a',pants:'#2a2a3a',beard:1,apron:'#7a5232'};
const _dfBar=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W=(it.w||1)*TS,H=(it.h||1)*TS;
 switch(it.k){
 case 'balcao':R('rgba(0,0,0,.25)',2,H-1,W,4);R('#6a3a1a',0,0,W,H);R('#8a5226',0,0,W,3);R('#4a2810',0,H-3,W,3);for(let i=8;i<W;i+=16)R('#5a3016',i,4,1,H-8);
  R('#c8c8d0',W-30,-8,3,9);R('#c8c8d0',W-24,-8,3,9);R('#d8a020',W-31,-9,5,2);R('#d8a020',W-25,-9,5,2);// chopeira
  for(let i=0;i<3;i++){R('#f0d060',10+i*14,-5,4,6);R('#ffffff',10+i*14,-6,4,2)}R('#3a2a1a',58,-4,8,5);R('#e8d8b0',59,-3,6,3);break;// copos e petisco
 case 'freezerb':R('rgba(0,0,0,.25)',1,H-1,W,4);R('#e8e8ec',0,-6,W,H+5);R('#c8302a',0,-6,W,4);R('#9ac8e8',3,-1,W-6,H-6);for(let i=0;i<5;i++)R(['#3a6a2a','#c8a040','#8a2a1a'][i%3],5+i*5,1,3,7);ptext(g,'GELADA',x+4,y-5,'#ffffff');break;
 case 'jukebox':{const on=S.juke&&S.juke>S.day*1440+dayHour()*60-30;R('rgba(0,0,0,.25)',1,H-1,W,3);R('#7a2a1a',0,-14,W,H+12);R('#f0c040',1,-13,W-2,4);R('#e85a3a',2,-8,W-4,8);R('#2a1a10',3,1,W-6,6);for(let i=0;i<3;i++)R(on&&(frame>>3)%3===i?'#ffffff':'#f0d060',4+i*3,-6,2,4);break}
 case 'sinuca':{R('rgba(0,0,0,.3)',2,H-2,W,4);R('#5a3016',0,0,W,H-2);R('#2a7a3a',3,3,W-6,H-8);R('#3a8a4a',3,3,W-6,2);for(const [a,b] of[[2,2],[W/2-1,1],[W-4,2],[2,H-7],[W/2-1,H-6],[W-4,H-7]])R('#1a1a1a',a,b,2.4,2.4);
  const bx=[10,16,20,13,24],by=[8,10,7,14,12],bc=['#ffffff','#e8c020','#c8302a','#2a4ac8','#1a1a1a'];for(let i=0;i<5;i++){R(bc[i],bx[i],by[i],2.2,2.2)}R('#4a2810',4,H-2,3,4);R('#4a2810',W-7,H-2,3,4);break}
 case 'mesab':R('rgba(0,0,0,.25)',1,H-1,W+2,3);R('#e8e8e0',-2,2,W+4,4);R('#c8c8c0',-2,6,W+4,1);R('#c8c8c0',1,6,2,H-6);R('#c8c8c0',W-3,6,2,H-6);R('#3a6a2a',2,-3,2,6);R('#7a4a1a',7,-2,2,5);R('#f0d060',11,-1,3,4);R('#c8a080',4,1,6,2);break;
 case 'banq':R('rgba(0,0,0,.2)',2,12,12,3);R('#8a5226',3,6,10,3);R('#4a2810',4,9,2,6);R('#4a2810',10,9,2,6);break;
 case 'patron':{const px=x+8,py=y+12;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:it.d||0,ph:0,mv:0,shirt:it.s,hair:it.h,hat:it.hat,pants:'#2a2a3a'});const up=((frame+it.x*40)%300)<40;Rr(c,'#f0d060',px+(it.d===2?-6:4),py-(up?14:10),2.4,3.4);Rr(c,'#ffffff',px+(it.d===2?-6:4),py-(up?14:10),2.4,1)});break}
 case 'cueman':{const px=x+8,py=y+12,ph=frame/30;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:3,ph:0,mv:0,shirt:'#e0a431',hair:'#2a1a10',pants:'#3a3a5a',hat:'#5a3a22'});const k=Math.sin(ph)*2;Rr(c,'#c8a060',px+4+k,py-8,12,1.2);Rr(c,'#f4f4f0',px+15+k,py-8.2,1.6,1.6)});break}
 default:return _dfBar(g,it,x,y,r)}};
const _dwBar=drawWallDeco;drawWallDeco=function(g,wd,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 if(wd.k==='garrafas'){R('#5a3016',0,8,64,2);R('#5a3016',0,18,64,2);for(let i=0;i<12;i++){const c=['#3a7a2a','#8a3a1a','#e8e0c8','#c89020','#2a4a8a'][i%5];R(c,2+(i%6)*10,(i<6?1:11),4,7);R('#d8c890',3+(i%6)*10,(i<6?0:10),2,2)}return}
 if(wd.k==='placabar'){R('#2f7a4a',0,4,58,14);R('#f0d060',1,5,56,1);R('#f0d060',1,16,56,1);ptext(g,'BAR DO TONHAO',x+3,y+8,'#ffffff');return}
 if(wd.k==='tvfut'){R('#1a1a1a',0,2,30,20);R('#3a9a3a',2,4,26,15);R('#e8e8e8',14,4,1,15);R('#e8e8e8',2,11,26,1);const bx=4+((frame>>2)%22),by=6+Math.abs(((frame>>3)%12)-6);R('#ffffff',bx,by,2,2);R('#c8302a',8,8,2,3);R('#2a4ac8',20,12,2,3);R('#3a3a3a',13,22,4,3);return}
 if(wd.k==='flamula'){for(let i=0;i<6;i++){const c=['#2a8a3a','#f0c020','#2a4aa8','#ffffff','#c8302a','#f0c020'][i];R('#5a3016',i*7,4,7,1);R(c,i*7+1,5,5,3);R(c,i*7+2,8,3,2)}return}
 return _dwBar(g,wd,x,y)};
const BARLN=['“O Tonhão serve a cerveja mais gelada da região, isso eu garanto.”','“Ontem o Zé apostou o cavalo na sinuca e perdeu. Voltou a pé!”','“Dizem que o gringo lá do norte trouxe um touro que vale mais que a minha fazenda.”','“Esse ano a arroba vai subir, escreve o que eu tô falando.”','“Viu a onça perto da mata? Meu cachorro não dorme mais.”','“Domingo tem rodeio na arena, vai ser bonito.”','“O Seu Otávio tá construindo silo novo, o homem tá crescendo.”','“Na seca o capim some. Guarda ração, compadre.”'];
function barEnter(){fade(()=>{RET={x:VBAR.door*TS+8,y:(VBAR.y+VBAR.h)*TS+12};S.horseOn=false;P.aim=0;P.vx=P.vy=0;const r=ROOMS.bar;P.x=(r.x+Math.floor(r.w/2))*TS+8;P.y=(r.y+r.h-2)*TS+12;P.dir=1;camInit=0});setTimeout(()=>toast('🍺 Tonhão: “Chega mais, '+(S.farmName?'patrão':'compadre')+'! O que vai ser hoje?”','good'),400)}
const _raBar=roomAct;roomAct=function(it,r){if(r.id!=='bar')return _raBar(it,r);
 if(it.act==='balcao')return barModal();
 if(it.act==='freezer'){if(S.money<8)return toast('Dinheiro insuficiente','bad');cash(-8,'Bar do Tonhão');P.hp=Math.min(100,P.hp+6);return toast('🧊 Uma gelada de longneck. (+6 de vida)','good')}
 if(it.act==='juke'){S.juke=S.day*1440+dayHour()*60;return toast('🎶 Você colocou uma moda de viola na jukebox. O bar inteiro cantou junto!','good')}
 if(it.act==='papo')return toast('🗣️ '+pick(BARLN));
 if(it.act==='sinuca')return sinucaModal();
 return _raBar(it,r)};
function sinucaModal(){showModal('<h3>🎱 Sinuca valendo</h3><div class="card"><i>“Bora uma partida, compadre? Quem perder paga.”</i></div><div class="btns">'+[20,50,100].map(v=>'<button class="b gold" data-act="sinuca" data-v="'+v+'">Apostar '+R$(v)+'</button>').join('')+'<button class="b gray" data-act="close">Agora não</button></div>')}
ACT.sinuca=function(e){const v=+e.v;if(S.money<v)return toast('Dinheiro insuficiente','bad');const win=Math.random()<.48+(LV()>=10?.04:0);cash(win?v:-v,'Sinuca no bar');hideModal();toast(win?'🎱 Encaçapou a bola 8! Você ganhou '+R$(v)+'.':'🎱 Errou a bola 8 na caçapa... perdeu '+R$(v)+'.',win?'good':'bad');gainXP(4,'sinuca')};
const BARLB={balcao:()=>'🍺 Balcão: pedir ao Tonhão',freezer:()=>'🧊 Pegar uma gelada (R$ 8)',juke:()=>'🎶 Jukebox',sinuca:()=>'🎱 Jogar sinuca',papo:()=>'💬 Puxar conversa'};
const _ilBar=interactList;interactList=function(){const L=_ilBar();
 if(inRoom()){const r=roomAt(P.x,P.y);if(r&&r.id==='bar')for(const l of L){const it=r.items.find(i=>i.act&&BARLB[i.act]&&Math.abs((r.x+i.x+(i.w||1)/2)*TS-l.x)<1&&Math.abs((r.y+i.y+(i.h||1))*TS+4-l.y)<1);if(it)l.label=BARLB[it.act]()}return L}
 for(const l of L)if(l.label==='🍺 Bar do Tonhão'){l.label='🚪 Entrar: Bar do Tonhão';l.fn=barEnter}return L};
// ---------- gente na frente do bar: mesas, cadeiras, conversa, entra e sai, ninguém fica no meio da estrada
const BTAB=[[145.6,46.35],[148.9,46.35]];
const BSEAT=[[144.9,46.55,3],[146.4,46.55,2],[148.2,46.55,3],[149.7,46.55,2]],BSTAND=[[136.6,46.45,3],[137.6,46.45,2],[138.6,46.5,2],[151,46.5,2]];
const BARF=[];(function(){const SH=['#3a6ab0','#c83a2a','#5a8a3a','#e0a431','#8a4ac8','#2a8a8a','#d86a8a','#7a5a3a'],HT=[null,'#d8c080','#6a4a2a',null,'#e8dcb0','#3a2a1a',null,'#c8a060'];
 for(let i=0;i<8;i++)BARF.push({i,x:(152+i)*TS,y:46.5*TS,vis:0,st:'off',t:rnd(0,30),spot:null,dir:2,ph:0,mv:0,o:{shirt:SH[i],hair:['#2a1a10','#1a1a1a','#5a3a22','#d8d8d8'][i%4],hat:HT[i],pants:['#2a2a3a','#3a4a6a','#4a3a2a'][i%3],g:i===2||i===6?'f':null},cup:0,raise:0})})();
function barWant(){const h=dayHour(),dw=Math.floor(S.day%7);if(h>=19||h<1)return dw>=5?8:6;if(h>=1&&h<2.5)return 2;if(h>=16)return 3;if(h>=11&&h<14)return 2;return 0}
const spotFree=sp=>!BARF.some(b=>b.spot===sp&&b.st!=='off');
function stepBarF(dt){const want=barWant(),act=BARF.filter(b=>b.st!=='off').length;
 if(act<want){const b=BARF.find(q=>q.st==='off'&&q.t<=0);if(b){const free=BSEAT.concat(BSTAND).filter(spotFree);if(free.length){b.spot=pick(free);b.x=(Math.random()<.5?133:153)*TS;b.y=46.5*TS;b.st='go';b.vis=1;b.cup=0}}}
 for(const b of BARF){b.t-=dt;if(b.st==='off')continue;
  if(b.st==='go'||b.st==='leave'||b.st==='door'){if(b.st==='go'&&!b.spot){b.st='leave'}const tx=b.st==='leave'?(b.x<139*TS?128:154)*TS:b.st==='door'?(VBAR.door+.5)*TS:b.spot[0]*TS,ty=b.st==='door'||b.st==='leave'?46.4*TS:b.spot[1]*TS;
   const dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy);if(d<1.5){if(b.st==='leave'){b.st='off';b.vis=0;b.spot=null;b.t=rnd(20,80);continue}if(b.st==='door'){b.st='inside';b.vis=0;b.t=rnd(8,25);continue}b.st='stay';b.t=rnd(25,70);b.mv=0;b.dir=b.spot[2];continue}
   const s=Math.min(d,(b.drunk?11:15)*dt);b.x+=dx/d*s;b.y+=dy/d*s+(b.drunk?Math.sin(frame/9+b.i)*.15:0);b.mv=1;b.ph+=dt*2.2;b.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1)}
  else if(b.st==='inside'){if(b.t<=0){b.vis=1;b.cup=1;b.x=(VBAR.door+.5)*TS;b.y=46.4*TS;if(!b.spot){const free=BSEAT.concat(BSTAND).filter(spotFree);b.spot=free.length?pick(free):null}b.st=b.spot?'go':'leave'}}
  else if(b.st==='stay'){b.mv=0;b.raise=Math.max(0,b.raise-dt);if(Math.random()<dt/14&&b.cup)b.raise=1.2;
   const nb=BARF.filter(q=>q!==b&&q.st==='stay'&&Math.abs(q.x-b.x)<40);if(nb.length&&Math.random()<dt/6){const q=pick(nb);b.dir=q.x>b.x?3:2}
   b.drunk=dayHour()>=23||dayHour()<2;
   if(b.t<=0){const r=Math.random(),over=BARF.filter(q=>q.st!=='off').length>barWant();if(over||r<.3){b.st='leave';b.spot=null}else if(r<.75){b.st='door'}else{const free=BSEAT.concat(BSTAND).filter(spotFree);if(free.length){b.spot=pick(free);b.st='go'}else{b.st='leave';b.spot=null}}}}}}
const _updBarF=update;update=function(dt){_updBarF(dt);if(paused()||inRoom())return;if(Math.abs(P.x-140*TS)>VW+300||Math.abs(P.y-46*TS)>VH+300)return;try{stepBarF(Math.min(dt,.1)*Math.max(1,Math.min(speed||1,6)))}catch(e){console.error(e)}};
// substitui a "turma parada" antiga por essa
drawBarCrowd=function(L,add){const x0=CX-40,x1=CX+VW+40;
 for(const t of BTAB){const x=t[0]*TS,y=t[1]*TS;if(x<x0||x>x1)continue;add(x,y,g=>{Rr(g,'rgba(0,0,0,.2)',x-9,y+1,18,3);Rr(g,'#e8e8e0',x-9,y-8,18,4);Rr(g,'#c8c8c0',x-9,y-4,18,1);Rr(g,'#c8c8c0',x-7,y-4,2,6);Rr(g,'#c8c8c0',x+5,y-4,2,6);Rr(g,'#3a6a2a',x-5,y-13,2,6);Rr(g,'#f0d060',x+1,y-11,3,4);Rr(g,'#ffffff',x+1,y-12,3,1)},20)}
 for(const s of BSEAT){const x=s[0]*TS,y=s[1]*TS;if(x<x0||x>x1)continue;add(x,y-1,g=>{Rr(g,'#c8302a',x-4,y-6,8,2);Rr(g,'#a82418',x+(s[2]===3?-4:2),y-12,2,7);Rr(g,'#a82418',x-4,y-4,1.4,5);Rr(g,'#a82418',x+2.6,y-4,1.4,5)},20)}
 for(const b of BARF){if(!b.vis||b.x<x0||b.x>x1)continue;const sit=b.st==='stay'&&BSEAT.includes(b.spot);add(b.x,b.y,g=>{const yy=b.y+(sit?2:0);OL(g,b.x,yy+3,30,42,q=>{drawPerson(q,Object.assign({x:b.x,y:yy,dir:b.dir,ph:b.ph,mv:b.mv},b.o));if(b.cup){const hx=b.x+(b.dir===2?-6:4),hy=yy-(b.raise>0?15:10);Rr(q,'#f0d060',hx,hy,2.4,3.4);Rr(q,'#ffffff',hx,hy,2.4,1)}})},40)}};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:2,ic:'🍺',t:'Bar do Tonhão',h:'O Bar do Tonhão, na vila, agora tem salão: balcão, freezer, jukebox, TV com futebol e sinuca valendo aposta. A turma conta as fofocas da região.'});
