// ===== Vida: amizade, pesca, cavalo, contratos de exportação, feira, ambiente =====
const feiraHoje=()=>S.day%30===15;
const NPC_IDS=['joao','lourdes','ramos','marina','tiao','ze','bisc','zeca','guarda'];
const LIKES={joao:['trigo','cafe','dourado'],lourdes:['ovo','milho','tomate'],ramos:['cafe','pintado','tucunare'],marina:['tomate','mandioca'],tiao:['galinha','traira'],ze:['soja','cana'],bisc:['lambari','tilapia','ovo'],zeca:['minhoca','dourado','pirarucu'],guarda:['galinha','cafe']};
const frS=()=>{if(!S.fr)S.fr={};if(!S.frd)S.frd={};if(!S.frm)S.frm={};return S.fr};
const hearts=id=>Math.min(10,Math.floor(((S.fr||{})[id]||0)/20));
const townBonus=()=>S.fr?Math.min(.1,NPC_IDS.reduce((s,k)=>s+hearts(k),0)*.004):0;
[{id:'zeca',n:'Zeca Pescador',role:'Pescador',hx:114*TS,hy:55*TS,col:'#2f6a7a',hair:'#6a5a3a',lines:['Hoje o dourado tá mordendo!','Paciência é a melhor isca.','No Pantanal tem pirarucu do tamanho de gente.']},
 {id:'guarda',n:'Guarda Cardoso',role:'Guarda-parque',hx:114*TS,hy:40*TS,col:'#3a6a3a',hair:'#222',lines:['Lobo e urso não perdoam descuido.','Respeite a temporada. A multa é pesada.','Dizem que há um cervo branco nessas matas...']}
].forEach(n=>{n.x=n.hx;n.y=n.hy;n.wait=rnd(1,4);n.tx=n.x;n.ty=n.y;n.dir=1;NPCS.push(n)});
function addFr(id,n){
 frS();const a=hearts(id);S.fr[id]=Math.min(200,(S.fr[id]||0)+n);const b=hearts(id);
 for(let h=a+1;h<=b;h++){
  const rw={2:[400,0],5:[1500,60],8:[3000,120],10:[8000,300]}[h];
  if(rw){cash(rw[0],'Presente de '+npcById(id).n);gainXP(rw[1]||10,'amizade');if(h===10)S.rep=Math.min(100,S.rep+3);toast('❤️ '+npcById(id).n+' agora tem '+h+' corações! Presente: '+R$(rw[0]),'good')}
  else toast('❤️ '+npcById(id).n+': '+h+' corações','good');
 }
}
const _npcModal=npcModal;
npcModal=function(id){
 const first=!(S.frd&&S.frd[id]===S.day);
 _npcModal(id);if(!NPC_IDS.includes(id))return;
 frS();if(first){S.frd[id]=S.day;addFr(id,3)}
 const mb=$('mbox'),last=mb.lastElementChild;if(!last)return;
 const hr=hearts(id),inv=Object.keys(S.inv).filter(k=>ITEMS[k]&&ITEMS[k].cat!=='seed').slice(0,6);
 let h='<div class="card"><div class="row"><b>'+'❤️'.repeat(hr)+'🤍'.repeat(10-hr)+'</b><span class="dim">'+(S.fr[id]||0)+'/200</span></div>'
  +(inv.length?'<div class="dim">🎁 Presentear:</div><div class="btns">'+inv.map(k=>'<button class="b" data-act="gift" data-v="'+id+':'+k+'">'+ITEMS[k].ic+'</button>').join('')+'</div>':'<div class="dim">Traga colheitas, ovos ou peixes de presente (ele(a) gosta de: '+LIKES[id].map(k=>ITEMS[k]?ITEMS[k].n:k).join(', ')+').</div>');
 if(id==='zeca')h+='<div class="btns"><button class="b gold" data-act="fishshop">🎣 Loja de pesca</button></div>';
 if(id==='guarda')h+='<div class="btns"><button class="b gold" data-act="lodge" data-v="sell">🦌 Vender caça</button></div>';
 last.insertAdjacentHTML('beforebegin',h+'</div>');
};
// ---- pesca
const FISH={
 lambari:{n:'Lambari',ic:'🐟',p:6,w:[.05,.15],r:1,z:['pond','lake','oasis']},
 tilapia:{n:'Tilápia',ic:'🐟',p:14,w:[.4,1.5],r:1,z:['pond','lake','pant']},
 carpa:{n:'Carpa',ic:'🐠',p:20,w:[1,4],r:2,z:['pond','oasis']},
 bagre:{n:'Bagre',ic:'🐟',p:26,w:[1,3.5],r:2,z:['pond','lake','pant','oasis']},
 traira:{n:'Traíra',ic:'🐟',p:34,w:[.8,3],r:2,z:['lake','pant']},
 tucunare:{n:'Tucunaré',ic:'🐠',p:60,w:[1,5],r:3,z:['lake','pant']},
 dourado:{n:'Dourado',ic:'🐡',p:110,w:[3,12],r:3,z:['lake','pant']},
 pintado:{n:'Pintado',ic:'🐟',p:90,w:[5,18],r:3,z:['pant']},
 pirarucu:{n:'Pirarucu',ic:'🐋',p:420,w:[30,90],r:4,z:['pant']},
 bota:{n:'Bota velha',ic:'👢',p:1,w:[.3,.6],r:0,junk:1,z:['pond','lake','pant','oasis']}
};
Object.keys(FISH).forEach(k=>{ITEMS[k]={n:FISH[k].n,ic:FISH[k].ic,cat:'fish',p:FISH[k].p}});
const RODS=[{n:'Vara de bambu',p:0,lv:1,luck:0,win:.17,spd:1},{n:'Vara de fibra de vidro',p:450,lv:3,luck:.12,win:.21,spd:.8},{n:'Vara de carbono + carretilha',p:2400,lv:7,luck:.3,win:.27,spd:.6}];
const ZN={pond:'Açude da fazenda',lake:'Lago da floresta',pant:'Pantanal',oasis:'Lagoa do cerrado'};
const FS={st:'ready',zone:'pond',t:0,wt:0,need:0,miss:0,fish:null,m:0,dir:1,zc:.5,iv:null,msg:'',spd:1};
const fishEnsure=()=>{if(!S.fish)S.fish={rod:0,own:[1],rec:{},cnt:0}};
function nearWater(){
 if(LV()<2)return null;const cx=Math.floor(P.x/TS),cy=Math.floor((P.y-4)/TS);let best=null,bd=99;
 for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=cx+dx,y=cy+dy;if(x<1||y<1||x>=MW-1||y>=MH-1||G[ti(x,y)]!==2)continue;const d=Math.hypot(dx,dy);if(d<bd){bd=d;best={x:x*TS+8,y:y*TS+8,z:x>=100?'pant':y>=71?'oasis':(x<30&&y>55)?'pond':'lake'}}}
 return best;
}
const _il=interactList;
interactList=function(){const L=_il(),w=nearWater();if(w)L.push({x:w.x,y:w.y,r:30,label:'🎣 Pescar ('+ZN[w.z]+')',fn:()=>fishStart(w.z)});return L};
function fishStart(z){fishEnsure();FS.zone=z;FS.st='ready';FS.msg='';reModal=fishRender;fishRender();if(!FS.iv)FS.iv=setInterval(fishTick,50)}
function fishPool(){
 const dl=daylight(),dawn=dl>.15&&dl<.7,rod=RODS[S.fish.rod],pool=[];
 Object.keys(FISH).forEach(k=>{const f=FISH[k];if(!f.z.includes(FS.zone))return;
  let w=f.junk?.5:[0,5,3,1.4,.35][f.r];if(f.r>=3)w*=(1+rod.luck*3)*(dawn?1.4:1);if(f.r===4)w*=(1+rod.luck*2);pool.push([k,w])});
 let tot=pool.reduce((s,p)=>s+p[1],0),x=Math.random()*tot;for(const p of pool){x-=p[1];if(x<=0)return p[0]}return pool[0][0];
}
function fishRender(){
 if(!$('modal')||modalOpen===false&&FS.st==='ready'&&!FS.iv)return;
 const rod=RODS[S.fish.rod];let h='<h3>🎣 '+ZN[FS.zone]+'</h3><div class="dim">'+rod.n+' · '+(daylight()>.15&&daylight()<.7?'🌅 hora boa de pesca':'')+'</div><div class="card" id="fbox" style="text-align:center">';
 if(FS.st==='ready')h+='<div style="font-size:42px">🌊</div><div>'+(FS.msg||'Lance a linha e espere a fisgada.')+'</div><div class="btns" style="justify-content:center"><button class="b gold" data-act="fcast">🎣 Lançar a linha</button></div>';
 else if(FS.st==='wait')h+='<div style="font-size:42px">🪝</div><div>Aguardando a fisgada…</div><div class="btns" style="justify-content:center"><button class="b gray" data-act="fcancel">Recolher</button></div>';
 else if(FS.st==='bite')h+='<div style="font-size:42px">❗🐟</div><div class="gold"><b>FISGOU! PUXA AGORA!</b></div><div class="btns" style="justify-content:center"><button class="b gold" data-act="fpull" style="font-size:20px;padding:12px 28px">PUXAR!</button></div>';
 else if(FS.st==='fight'){const f=FISH[FS.fish];h+='<div>Peixe lutando! Pare o marcador na <b class="grn">zona verde</b> ('+FS.need+' restante'+(FS.need>1?'s':'')+') · Linha: '+(FS.miss?'⚠️ tensa':'✔️ ok')+'</div><div id="fbar" style="position:relative;height:26px;background:#2a2a2a;border-radius:4px;margin:8px 0;overflow:hidden"><div id="fz" style="position:absolute;top:0;bottom:0;background:#4a9a3a;left:'+((FS.zc-RODS[S.fish.rod].win/2)*100)+'%;width:'+(RODS[S.fish.rod].win*100)+'%"></div><div id="fm" style="position:absolute;top:0;bottom:0;width:4px;background:#fff;left:'+(FS.m*100)+'%"></div></div><div class="btns" style="justify-content:center"><button class="b gold" data-act="fpull" style="font-size:20px;padding:12px 28px">PUXAR!</button></div>'}
 else h+='<div style="font-size:42px">'+(FS.fish&&FISH[FS.fish]?FISH[FS.fish].ic:'🌊')+'</div><div>'+FS.msg+'</div><div class="btns" style="justify-content:center"><button class="b gold" data-act="fcast">🎣 Pescar de novo</button></div>';
 showModal(h+'</div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>');
}
function fishTick(){
 if($('modal').style.display!=='flex'||!$('fbox')){clearInterval(FS.iv);FS.iv=null;FS.st='ready';return}
 const dt=.05;
 if(FS.st==='wait'){FS.t+=dt;if(FS.t>=FS.wt){FS.st='bite';FS.t=0;fishRender()}}
 else if(FS.st==='bite'){FS.t+=dt;if(FS.t>1.4){FS.st='result';FS.fish=null;FS.msg='A fisgada passou… ele escapou!';fishRender()}}
 else if(FS.st==='fight'){FS.m+=FS.dir*dt*FS.spd;if(FS.m>=1){FS.m=1;FS.dir=-1}if(FS.m<=0){FS.m=0;FS.dir=1}const m=$('fm');if(m)m.style.left=(FS.m*100)+'%'}
}
function fishNewZone(){FS.zc=rnd(.2,.8);FS.m=0;FS.dir=1;FS.spd=1.0+.3*FISH[FS.fish].r}
function fishDone(msg){FS.st='result';FS.msg=msg;fishRender()}
Object.assign(ACT,{
 fcast(){fishEnsure();const rod=RODS[S.fish.rod];FS.st='wait';FS.t=0;FS.wt=rnd(2,6.5)*rod.spd*(S.weather==='chuva'?.75:1);fishRender()},
 fcancel(){FS.st='ready';fishRender()},
 fpull(){
  if(FS.st==='bite'){FS.fish=fishPool();const f=FISH[FS.fish];FS.miss=0;
   if(f.junk){fishCatch();return}
   FS.need=f.r;FS.st='fight';fishNewZone();fishRender();return}
  if(FS.st==='fight'){
   const win=RODS[S.fish.rod].win;
   if(Math.abs(FS.m-FS.zc)<=win/2){FS.need--;if(FS.need<=0)fishCatch();else{fishNewZone();fishRender()}}
   else{FS.miss++;if(FS.miss>=2)fishDone('💥 A linha arrebentou e o peixe fugiu!');else fishRender()}
  }
 },
 fishshop(){fishShop()},
 rodbuy(e){const i=+e.v,r=RODS[i];fishEnsure();if(S.fish.own.includes(i)){S.fish.rod=i;return}if(LV()<r.lv)return toast('Requer nível '+r.lv,'bad');if(S.money<r.p)return toast('Dinheiro insuficiente','bad');cash(-r.p,'Vara de pescar');S.fish.own.push(i);S.fish.rod=i;toast('🎣 Nova vara!','good')},
 fishsell(){fishEnsure();let t=0;Object.keys(S.inv).forEach(k=>{if(ITEMS[k]&&ITEMS[k].cat==='fish'){t+=itemPrice(k)*1.2*S.inv[k];delete S.inv[k]}});if(!t)return toast('Sem peixes para vender');t=Math.round(t);cash(t,'Venda de peixes');toast('🐟 Peixes vendidos: '+R$(t),'good')},
 gift(e){
  const[id,k]=e.v.split(':');if(!takeItem(k,1))return;const like=LIKES[id].includes(k);
  addFr(id,like?12:ITEMS[k].cat==='fish'?4:3);toast(like?'😍 '+npcById(id).n+' adorou!':'🙂 '+npcById(id).n+' agradeceu.','good');
 }
});
function fishCatch(){
 const k=FS.fish,f=FISH[k],rod=RODS[S.fish.rod];
 let kg=Math.round((f.w[0]+(f.w[1]-f.w[0])*Math.pow(Math.random(),1.8-rod.luck))*100)/100;if(typeof onFish==='function')onFish(k,kg);
 if(Math.random()<.015&&!f.junk){const m=Math.round(rnd(300,1500));cash(m,'Baú encontrado');return fishDone('📦 Você puxou um baú do fundo com '+R$(m)+'!')}
 if(!addItem(k,1))return fishDone('Mochila cheia! O peixe foi solto.');
 const r=S.fish.rec[k]||(S.fish.rec[k]={kg:0,n:0});r.n++;const nr=kg>r.kg;if(nr)r.kg=kg;S.fish.cnt++;
 if(!f.junk)gainXP(2+f.r*3,'pesca');
 fishDone(f.ic+' '+f.n+' de <b>'+kg+' kg</b> ('+R$(f.p)+')'+(nr&&r.n>1?' · 🏆 novo recorde!':r.n===1&&!f.junk?' · 📖 nova espécie!':''));
}
addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();
 if(FS.iv&&(k===' '||k==='enter'||k==='e')&&$('fbox')){e.preventDefault();if(FS.st==='bite'||FS.st==='fight')ACT.fpull();else if(FS.st==='ready'||FS.st==='result')ACT.fcast()}
 if(k==='g')toggleHorse();
});
function fishShop(){
 fishEnsure();reModal=fishShop;
 showModal('<h3>🎣 Casa do Pescador</h3><div class="dim">Peixes são comprados com +20%. Vara atual: <b class="gold">'+RODS[S.fish.rod].n+'</b></div>'
  +RODS.map((r,i)=>'<div class="card '+(LV()<r.lv&&!S.fish.own.includes(i)?'lock':'')+'"><div class="row"><b>'+r.n+'</b><span class="gold">'+(r.p?R$(r.p):'grátis')+'</span></div><div class="dim">Zona de acerto '+Math.round(r.win*100)+'% · sorte '+Math.round(r.luck*100)+'% · requer nível '+r.lv+'</div><div class="btns"><button class="b gold" data-act="rodbuy" data-v="'+i+'">'+(S.fish.own.includes(i)?(S.fish.rod===i?'Em uso':'Usar'):'Comprar')+'</button></div></div>').join('')
  +'<div class="btns"><button class="b gold" data-act="fishsell">Vender todos os peixes</button><button class="b gray" data-act="close">Sair</button></div>');
}
function pFish(){
 fishEnsure();const F=S.fish;
 return '<div class="card"><div class="row"><b>🎣 Pesca</b><span class="gold">'+F.cnt+' capturas</span></div><div class="dim">Vara: '+RODS[F.rod].n+'. Chegue perto de qualquer água (nível 2+) e aperte E. Madrugada e entardecer rendem peixes raros. Compre varas na Casa do Pescador (Pantanal).</div></div><div class="sec">ÁLBUM DE PEIXES</div>'
 +Object.keys(FISH).filter(k=>!FISH[k].junk).map(k=>{const r=F.rec[k];return '<div class="card"><div class="row"><b>'+(r?FISH[k].ic+' '+FISH[k].n:'❔ ???')+'</b><span class="dim">'+FISH[k].z.map(z=>ZN[z]).join(' · ')+'</span></div><div class="dim">'+(r?'Pescados '+r.n+' · recorde '+r.kg+' kg · '+R$(FISH[k].p)+'/un':'Ainda não pescado')+'</div></div>'}).join('');
}
// ---- cavalo
const HORSES={crioulo:{n:'Cavalo Crioulo',p:9000,lv:5,spd:165,col:'#8a5a3a'},mangalarga:{n:'Mangalarga Marchador',p:18000,lv:8,spd:190,col:'#c8a070'},arabe:{n:'Árabe de corrida',p:40000,lv:12,spd:225,col:'#d8d8d8'}};
let HSPD=()=>S.horse&&HORSES[S.horse.b]?HORSES[S.horse.b].spd:190;
function toggleHorse(){
 if(!S.horse)return;if(!S.horseOn&&P.aim)return;S.horseOn=!S.horseOn;toast(S.horseOn?'🐴 Você montou':'Você desmontou');
}
ACT.horsebuy=function(e){
 const h=HORSES[e.v];if(!h)return;if(LV()<h.lv)return toast('Requer nível '+h.lv,'bad');if(S.money<h.p)return toast('Dinheiro insuficiente','bad');
 cash(-h.p,h.n);S.horse={b:e.v,name:'Trovão'};S.horseOn=false;toast('🐴 '+h.n+' comprado! Tecla G ou botão 🐴 para montar.','good');
};
const _npcModal2=npcModal;
npcModal=function(id){
 _npcModal2(id);if(id!=='tiao')return;const last=$('mbox').lastElementChild;if(!last)return;
 last.insertAdjacentHTML('beforebegin','<div class="sec">CAVALOS</div>'+Object.keys(HORSES).map(k=>{const h=HORSES[k],own=S.horse&&S.horse.b===k;return '<div class="card '+(LV()<h.lv?'lock':'')+'"><div class="row"><b>🐴 '+h.n+'</b><span class="gold">'+R$(h.p)+'</span></div><div class="dim">Velocidade '+h.spd+' · requer nível '+h.lv+' · ração R$ 14/dia · barulhento: afasta a caça</div><div class="btns">'+(own?'<span class="grn">Você tem</span>':'<button class="b gold" data-act="horsebuy" data-v="'+k+'">Comprar</button>')+'</div></div>'}).join(''));
};
const _pv=playerVis;playerVis=function(){let v=_pv();if(S.horseOn)v=Math.min(1,v*1.35);return v};
const _nr=noiseR;noiseR=function(){return _nr()*(S.horseOn?1.4:1)};
function drawHorse(g){
 const h=HORSES[S.horse.b],c=h.col,dk=shade(c,-40),lt=shade(c,30),x=P.x,y=P.y,mv=P.moving,sw=mv?P.ph*1.2:0;
 Rr(g,'rgba(0,0,0,.3)',x-9,y-1,18,3);
 if(P.dir>=2){
  const d=P.dir===3?1:-1,r=(col,dx,dy,w,hh)=>Rr(g,col,d>0?x+dx-10:x-dx-w+10,y+dy,w,hh);
  [3,6,13,16].forEach((dx,i)=>{const o=mv?Math.round(Math.sin(sw+i*1.6)*2):0;r(dk,dx,-7-(o>0?1:0),2,7+(o>0?-0:0));r('#222',dx,-1,2,1)});
  r(c,2,-12,16,7);r(lt,3,-6,14,1);r(c,15,-19,5,9);r(c,18,-20,6,4);r(dk,14,-20,2,9);r('#222',22,-19,1,1);r(dk,0,-12,3,8+(mv?1:0));r('#7a1f1f',6,-13,6,2);
 }else{
  const f=P.dir===0;
  Rr(g,c,x-5,y-14,10,9);Rr(g,lt,x-4,y-6,8,1);Rr(g,dk,x-5,y-7,2,7);Rr(g,dk,x+3,y-7,2,7);
  if(f){Rr(g,c,x-2,y-20,4,8);Rr(g,dk,x-3,y-22,6,3);Rr(g,'#222',x-1,y-18,1,1);Rr(g,'#222',x+1,y-18,1,1)}else Rr(g,dk,x-1,y-8,2,5);
  Rr(g,'#7a1f1f',x-4,y-14,8,2);
 }
}
const _dpl=drawPlayer;
drawPlayer=function(g){if(S.horse&&S.horseOn){drawHorse(g);g.save();g.translate(0,-7);_dpl(g);g.restore()}else _dpl(g)};
const _upd=update;
update=function(dt){if(P.aim&&S.horseOn)S.horseOn=false;_upd(dt)};
{const hb=document.createElement('div');hb.className='cb';hb.id='bHorse';hb.style.cssText='right:16px;bottom:290px;width:50px;height:50px;font-size:24px';hb.textContent='🐴';document.body.appendChild(hb);bind('bHorse',()=>toggleHorse());
 setInterval(()=>{hb.style.visibility=S.horse?'visible':'hidden'},700)}
// ---- contratos de exportação
const ctEnsure=()=>{if(!S.ct)S.ct={list:[],done:0}};
const ctElig=c=>S.herd.filter(a=>ready(a)&&(!c.sex||a.sex===c.sex)&&(!c.tier||BREEDS[a.breed].tier>=c.tier));
function genCt(){
 ctEnsure();S.ct.list=S.ct.list.filter(c=>c.exp>S.day);
 const T=[{t:'Exportação para a Ásia',sex:'M',n:[3,6],pr:[.18,.3]},{t:'Rede de churrascarias',sex:'F',n:[2,4],pr:[.15,.25]},{t:'Frigorífico Premium',tier:2,n:[1,3],pr:[.3,.5]},{t:'Festival gastronômico',n:[2,5],pr:[.12,.22]}];
 while(S.ct.list.length<3){const k=pick(T);S.ct.list.push({id:++S.nid+'x',t:k.t,sex:k.sex,tier:k.tier,n:ri(k.n[0],k.n[1]),pr:Math.round(rnd(k.pr[0],k.pr[1])*100)/100,exp:S.day+ri(20,40)})}
}
function pCt(){
 if(LV()<6)return '<div class="card lock"><b>📜 Contratos de exportação</b><div class="red">Libera no nível 6.</div></div>';
 ctEnsure();genCt();
 return '<div class="card"><b>📜 Contratos</b><div class="dim">Entregue animais prontos para abate (peso final) e receba um prêmio sobre o preço do frigorífico. Contratos cumpridos: '+S.ct.done+'</div></div>'
 +S.ct.list.map(c=>{const n=ctElig(c).length;return '<div class="card"><div class="row"><b>'+c.t+'</b><span class="gold">+'+Math.round(c.pr*100)+'%</span></div><div class="dim">'+c.n+' cabeças'+(c.sex?(c.sex==='M'?' (machos)':' (fêmeas)'):'')+(c.tier?' (raça nobre)':'')+' · prontos: '+n+' · '+Math.max(0,c.exp-S.day)+' dias</div><div class="btns"><button class="b '+(n>=c.n?'gold':'gray')+'" data-act="ctdeliver" data-v="'+c.id+'">Entregar</button></div></div>'}).join('');
}
ACT.ctdeliver=function(e){
 ctEnsure();const c=S.ct.list.find(x=>x.id===e.v);if(!c)return;const el=ctElig(c).sort((a,b)=>frigPrice(a)-frigPrice(b));
 if(el.length<c.n)return toast('Faltam animais prontos para este contrato','bad');
 let tot=0;el.slice(0,c.n).forEach(a=>{const p=sellFrig(a),b=Math.round(p*c.pr);cash(b,'Bônus de contrato');tot+=p+b});
 S.ct.list=S.ct.list.filter(x=>x!==c);S.ct.done++;gainXP(30+c.n*8,'contrato');toast('📜 Contrato entregue: '+R$(tot),'good');
};
UPS.frig={n:'Frigorífico próprio',ic:'🏭',d:'Abate e venda direta: +10% em todas as vendas ao frigorífico',c:[150000],lv:[12]};
// ---- dia
const _hd3=hookDay;
hookDay=function(){
 _hd3();frS();ctEnsure();
 if(S.day%12===0)genCt();
 if(feiraHoje())toast('🎪 Feira Agropecuária hoje! Preços +12% na caixa de venda e na padaria.','good');
 if(S.horse)cash(-14,'Ração do cavalo');
 if(LV()>=7){const bulls=S.herd.filter(a=>a.sex==='M'&&a.age>=540&&valueOf(a,'mkt')>6000);
  if(bulls.length&&Math.random()<.06){const b=bulls.sort((a,c)=>valueOf(c,'mkt')-valueOf(a,'mkt'))[0],m=Math.round(1200+valueOf(b,'mkt')*.06);cash(m,'Reprodutor: '+b.name);toast('🐂 '+b.name+' rendeu '+R$(m)+' como reprodutor!','good')}}
 if(S.up.frig&&S.day%30===0){const d=Math.round(8000+S.herd.length*350);cash(d,'Lucro do frigorífico');toast('🏭 Seu frigorífico lucrou '+R$(d),'good')}
};
Object.assign(UNL,{11:'Fazendeiro veterano',12:'Cavalo Árabe, Frigorífico próprio',13:'Lotes premium nos leilões',14:'Magnata em ascensão',15:'Barão do Agro'});
UNL[2]+=' · Pesca';UNL[4]+=' · Bolsa de Valores';UNL[5]+=' · Cavalo Crioulo';UNL[6]+=' · Contratos de exportação';UNL[7]+=' · Renda de reprodutor';
GOALS.push(
 ['inv1','Investidor','Faça sua primeira compra na bolsa',()=>S.bk&&(Object.keys(S.bk.pf).length>0||S.bk.realized!==0),2000],
 ['inv2','Carteira de R$ 50 mil','Tenha R$ 50 mil em ativos',()=>pfValue()>=5e4,8000],
 ['pesca1','Pescador','Pesque 10 peixes',()=>S.fish&&S.fish.cnt>=10,1500],
 ['pesca2','Mestre pescador','Registre 8 espécies',()=>S.fish&&Object.keys(S.fish.rec).filter(k=>FISH[k]&&!FISH[k].junk).length>=8,6000],
 ['cav','Cavaleiro','Compre um cavalo',()=>!!S.horse,3000],
 ['ctd','Exportador','Cumpra 3 contratos',()=>S.ct&&S.ct.done>=3,10000],
 ['hunt1','Caçador de elite','Cace 5 espécies diferentes',()=>S.h&&Object.keys(S.h.kills).length>=5,5000],
 ['lend','A lenda do cervo branco','Cace o cervo albino',()=>S.h&&S.h.kills.whitedeer>0,15000],
 ['amg','Querido na vila','Chegue a 5 corações com alguém',()=>NPC_IDS.some(k=>hearts(k)>=5),4000]
);
// ---- vida ambiente
const AMB=[];
function stepAmb(dt){
 const dl=daylight(),t=G[ti(Math.floor(P.x/TS),Math.floor(P.y/TS))];
 if(AMB.length<28&&Math.random()<dt*7){
  const px=P.x+rnd(-VW/2,VW/2),py=P.y+rnd(-VH/2,VH/2),tt=G[ti(clamp(Math.floor(px/TS),0,MW-1),clamp(Math.floor(py/TS),0,MH-1))];
  if(dl<.3&&(tt===0||tt===1||tt===6))AMB.push({k:'ff',x:px,y:py,t:0,l:rnd(4,9),s:rnd(0,6)});
  else if(dl>.55&&(tt===0||tt===1)&&S.weather!=='chuva')AMB.push({k:'bf',x:px,y:py,t:0,l:rnd(5,10),s:rnd(0,6),c:pick(['#f0e060','#f08ab0','#fff','#8ac0f0'])});
  else if(tt===5)AMB.push({k:'sn',x:px,y:P.y-VH/2-4,t:0,l:rnd(4,8),s:rnd(0,6)});
  else if(tt===1&&dl>.3)AMB.push({k:'lf',x:px,y:P.y-VH/2-4,t:0,l:rnd(4,8),s:rnd(0,6)});
 }
 for(let i=AMB.length-1;i>=0;i--){const a=AMB[i];a.t+=dt;a.s+=dt;
  if(a.k==='ff'){a.x+=Math.cos(a.s*1.3)*8*dt;a.y+=Math.sin(a.s*.9)*6*dt}
  else if(a.k==='bf'){a.x+=Math.cos(a.s*2.1)*14*dt+6*dt;a.y+=Math.sin(a.s*3)*9*dt}
  else if(a.k==='sn'){a.y+=22*dt;a.x+=Math.sin(a.s*2)*8*dt}
  else{a.y+=14*dt;a.x+=Math.sin(a.s*3)*12*dt}
  if(a.t>a.l)AMB.splice(i,1)}
}
function drawAmb(g){
 for(const a of AMB){
  if(a.k==='ff'){const al=.5+.5*Math.sin(a.s*4);Rr(g,'rgba(240,240,120,'+(al*.9).toFixed(2)+')',a.x,a.y,2,2);Rr(g,'rgba(240,240,120,'+(al*.25).toFixed(2)+')',a.x-1,a.y-1,4,4)}
  else if(a.k==='bf'){const f=((a.s*8)|0)&1;Rr(g,a.c,a.x,a.y,f?3:1,2);Rr(g,'#333',a.x+1,a.y,1,2)}
  else if(a.k==='sn')Rr(g,'rgba(255,255,255,.9)',a.x,a.y,1.5,1.5);
  else Rr(g,'#b0742a',a.x,a.y,2,1);
 }
}
const _sp=stepPart;stepPart=function(dt){_sp(dt);stepAmb(dt)};
const _dpr=drawPart;drawPart=function(g){_dpr(g);drawAmb(g)};
