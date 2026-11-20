// ===== Pesca e caça: peixes da estação, lendas, álbum com medalhas =====
Object.assign(FISH,{
 pacu:{n:'Pacu',ic:'🐟',p:48,w:[2,8],r:2,z:['pant','lake'],sea:[11,0,1,2,3]},
 tambaqui:{n:'Tambaqui',ic:'🐠',p:120,w:[5,22],r:3,z:['pant'],sea:[0,1,2],fl:1},
 piranha:{n:'Piranha',ic:'🐟',p:22,w:[.3,1.6],r:1,z:['pant','oasis'],sea:[6,7,8,9]},
 piraputanga:{n:'Piraputanga',ic:'🐠',p:44,w:[.8,3],r:2,z:['lake','pant'],sea:[8,9,10]},
 corvina:{n:'Corvina',ic:'🐟',p:40,w:[1,5],r:2,z:['lake','oasis'],sea:[3,4,5]},
 truta:{n:'Truta-arco-íris',ic:'🐟',p:55,w:[.5,3.5],r:2,z:['mtn']},
 trutad:{n:'Truta-dourada',ic:'🐡',p:150,w:[1.5,6],r:3,z:['mtn'],sea:[5,6,7]},
 // lendas
 lg_moeda:{n:'Carpa Dourada “Moeda”',ic:'🐠',p:3000,w:[18,26],r:4,leg:1,z:['pond'],cond:()=>{const h=S.t*24;return h>=5&&h<7.5},hint:'No açude da fazenda, só nos primeiros raios de sol.'},
 lg_relampago:{n:'Dourado “Relâmpago”',ic:'🐡',p:5000,w:[22,30],r:4,leg:1,z:['lake'],cond:()=>{const m=curMon();return m>=8&&m<=10&&S.weather==='chuva'},hint:'No lago da floresta, num dia de chuva da primavera.'},
 lg_dente:{n:'Traíra “Dente de Ferro”',ic:'🐟',p:3500,w:[8,12],r:4,leg:1,z:['oasis'],cond:()=>{const h=S.t*24;return h>=20||h<4},hint:'Na lagoa do cerrado, depois que escurece.'},
 lg_gigante:{n:'Pirarucu “Velho Gigante”',ic:'🐋',p:12000,w:[160,220],r:4,leg:1,z:['pant'],cond:()=>S.sea&&S.sea.fl>=2&&S.fish.rod>=1,hint:'No Pantanal, na cheia forte. Precisa de vara boa.'},
 lg_fantasma:{n:'Truta “Fantasma do Gelo”',ic:'🐟',p:6000,w:[9,14],r:4,leg:1,z:['mtn'],cond:()=>{const m=curMon(),h=S.t*24;return m>=5&&m<=7&&h>=5&&h<9},hint:'No lago da montanha, nas manhãs geladas do inverno.'}
});
FISH.bota.z.push('mtn');ZN.mtn='Lago da montanha';
['pacu','tambaqui','piranha','piraputanga','corvina','truta','trutad'].forEach(k=>{ITEMS[k]={n:FISH[k].n,ic:FISH[k].ic,cat:'fish',p:FISH[k].p}});
const LEGF=Object.keys(FISH).filter(k=>FISH[k].leg);
const fishSeasonOk=f=>!f.sea||f.sea.includes(curMon());
const ensureLg=()=>{if(!S.lg)S.lg={fish:{},hunt:{},seen:{},med:{},sp:{}};return S.lg};
fishPool=function(){
 const dl=daylight(),dawn=dl>.15&&dl<.7,rod=RODS[S.fish.rod],pool=[],lg=ensureLg();
 for(const k of LEGF){const f=FISH[k];if(f.z.includes(FS.zone)&&!lg.fish[k]&&f.cond()){lg.seen[k]=1;if(Math.random()<.05*(1+rod.luck*2))return k}}
 Object.keys(FISH).forEach(k=>{const f=FISH[k];if(f.leg||!f.z.includes(FS.zone)||!fishSeasonOk(f))return;
  let w=f.junk?.5:[0,5,3,1.4,.35][f.r];if(f.r>=3)w*=(1+rod.luck*3)*(dawn?1.4:1);if(f.r===4)w*=(1+rod.luck*2);if(f.sea)w*=1.6;if(f.fl&&!(S.sea&&S.sea.fl>=2))return;pool.push([k,w])});
 let tot=pool.reduce((s,p)=>s+p[1],0),x=Math.random()*tot;for(const p of pool){x-=p[1];if(x<=0)return p[0]}return pool.length?pool[0][0]:'bota';
};
const _fcL=fishCatch;
fishCatch=function(){const k=FS.fish,f=FISH[k];if(!f||!f.leg)return _fcL();
 const lg=ensureLg(),kg=Math.round(rnd(f.w[0],f.w[1])*10)/10;lg.fish[k]={kg,d:S.day};S.fish.cnt++;
 cash(f.p,'Lenda: '+f.n);gainXP(250,'lenda');S.rep=Math.min(100,S.rep+3);
 setTimeout(()=>toast('🏆✨ LENDA! '+f.n+' foi empalhado e pendurado na parede da sua casa.','good'),300);
 fishDone('✨🏆 <b class="gold">LENDA!</b><br>'+f.ic+' '+f.n+' de <b>'+kg+' kg</b>!<br>Prêmio da colônia de pesca: '+R$(f.p)+'<br><span class="dim">Ele vai para a parede de troféus da sua casa.</span>');
};
const _fnzL=fishNewZone;fishNewZone=function(){_fnzL();if(FISH[FS.fish]&&FISH[FS.fish].leg)FS.spd=2.3};
COLS.forEach(c=>{if(c.k==='fish')c.all=()=>Object.keys(FISH).filter(k=>!FISH[k].junk&&!FISH[k].leg)});
// ---------- lendas da caça
const LEGH={
 whitedeer:{n:'Cervo albino',sp:'whitedeer',bio:'Floresta',hint:'Surge na mata em qualquer época. A vila comenta quando ele aparece.'},
 tanque:{n:'Javali “Tanque”',sp:'boar',bio:'Floresta',mon:[5,6,7],sc:1.45,kgx:1.9,hpx:2.6,bounty:9000,hint:'No inverno, um javali do tamanho de um bezerro revira a floresta.'},
 cicatriz:{n:'Urso “Cicatriz”',sp:'bear',bio:'Montanha',mon:[3,4],sc:1.3,kgx:1.5,hpx:2.2,bounty:16000,hint:'No outono, antes de hibernar, um urso marcado desce a montanha.'},
 lazaro:{n:'Jacaré “Velho Lázaro”',sp:'croc',bio:'Pantanal',mon:[6,7,8,9],sc:1.4,kgx:1.8,hpx:2.4,bounty:14000,hint:'Na seca, quando as águas baixam, o jacaré mais velho do Pantanal aparece.'},
 raio:{n:'Antílope “Raio”',sp:'pronghorn',bio:'Cerrado',mon:[8,9,10],sc:1.3,kgx:1.6,hpx:1.8,bounty:8000,hint:'Na primavera, um antílope mais rápido que o vento corre pelo cerrado.'}
};
function spawnLeg(k){const L=LEGH[k],sp=SPECIES[L.sp],a=spawnWild(L.sp,0);if(!a)return null;a.leg=k;a.kg=sp.w[1]*L.kgx;a.hp=sp.hp*L.hpx;a.male=true;if(L.sp==='pronghorn')a.pts=16;return a}
const _hdL=hookDay;
hookDay=function(){_hdL();const lg=ensureLg(),m=curMon();
 for(const k in LEGH){const L=LEGH[k];if(!L.mon)continue;const alive=WILD.find(w=>w.leg===k&&w.st!=='dead');
  if(!L.mon.includes(m)){if(alive&&!(alive.held&&alive.held.length)){WILD.splice(WILD.indexOf(alive),1)}continue}
  if(lg.hunt[k]||alive)continue;
  if(Math.random()<.12&&spawnLeg(k)){lg.seen[k]=1;toast('🗣️ Corre na vila: viram o '+L.n+' por '+(L.bio==='Montanha'?'lá na montanha':L.bio==='Pantanal'?'lá no Pantanal':L.bio==='Cerrado'?'lá no cerrado':'lá na floresta')+'!','good')}}
 if(WILD.some(w=>w.sp==='whitedeer'))lg.seen.whitedeer=1;
};
const _fpL=finishPick;
finishPick=function(){const a=AIM.pick&&AIM.pick.a;if(!a)return _fpL();const H=S.h,old=H.rec&&H.rec[a.sp]?H.rec[a.sp].kg:0;_fpL();
 const lg=ensureLg(),k=a.leg||(a.sp==='whitedeer'?'whitedeer':null);if(!k)return;
 if(a.leg&&H.rec&&H.rec[a.sp])H.rec[a.sp].kg=old;
 lg.hunt[k]={kg:Math.round(a.kg*.72),d:S.day};lg.seen[k]=1;
 if(a.leg){const L=LEGH[k];cash(L.bounty,'Lenda: '+L.n);gainXP(220,'lenda');S.rep=Math.min(100,S.rep+4);
  showModal('<h3>✨🏆 LENDA ABATIDA!</h3><div class="card" style="text-align:center"><div style="font-size:40px">🏆</div><b class="gold">'+L.n+'</b><br>'+Math.round(a.kg)+' kg · '+L.bio+'<br>Prêmio dos fazendeiros da região: <b class="grn">'+R$(L.bounty)+'</b><br><span class="dim">A cabeça foi para a parede de troféus da sua casa. A vila inteira vai comentar por meses!</span></div><div class="btns"><button class="b gold" data-act="close">Que caçada!</button></div>')}
};
const _dwL=drawWild;
drawWild=function(g,a){if(!a.leg)return _dwL(g,a);const L=LEGH[a.leg],s=L.sc;
 g.save();g.translate(a.x,a.y);g.scale(s,s);g.translate(-a.x,-a.y);_dwL(g,a);g.restore();
 if(RMODE===4||a.st==='dead')return;
 const W=(WSZ[a.sp]||14)*s;if(((frame+a.id*7)>>3)%4===0)Rr(g,'#ffd75e',a.x-W/2+((frame*.7+a.id)%W),a.y-W-4+Math.sin(frame*.2)*2,1,1);
 if(a.vis>.6&&Math.hypot(a.x-P.x,a.y-P.y)<170){const t=L.n.replace(/[“”]/g,''),tw=ptw(t);Rr(g,'rgba(30,18,6,.7)',a.x-tw/2-2,a.y-W-16,tw+4,8);ptext(g,t,a.x-tw/2,a.y-W-14.5,'#ffd75e')}
};
// ---------- medalhas e álbum
const MEDAL=['','🥉','🥈','🥇'];
const medalOf=(kg,w)=>{if(!kg)return 0;const f=(kg-w[0])/(w[1]-w[0]);return f>=.88?3:f>=.6?2:f>=.25?1:0};
const fishMed=k=>{const r=S.fish&&S.fish.rec[k];return r?medalOf(r.kg,FISH[k].w):0};
const huntMed=k=>{const r=S.h&&S.h.rec&&S.h.rec[k];return r&&r.kg?medalOf(r.kg/.72,SPECIES[k].w):0};
const albFish=()=>Object.keys(FISH).filter(k=>!FISH[k].junk&&!FISH[k].leg);
const albHunt=()=>Object.keys(SPECIES).filter(k=>k!=='whitedeer');
function goldCount(){return albFish().filter(k=>fishMed(k)===3).length+albHunt().filter(k=>huntMed(k)===3).length}
const legCount=()=>{const lg=S.lg||{fish:{},hunt:{}};return Object.keys(lg.fish).length+Object.keys(lg.hunt).length};
function checkMedals(){const lg=ensureLg();
 const chk=(id,m,nm)=>{const o=lg.med[id]||0;if(m>o){lg.med[id]=m;const rw=[0,200,800,2500][m];cash(rw,'Medalha do álbum');toast(MEDAL[m]+' Medalha de '+['','bronze','prata','ouro'][m]+': '+nm+' (+'+R$(rw)+')','good')}};
 albFish().forEach(k=>chk('f_'+k,fishMed(k),FISH[k].n));albHunt().forEach(k=>chk('h_'+k,huntMed(k),SPECIES[k].n));
}
let medT=0;const _updL=update;update=function(dt){_updL(dt);medT+=dt;if(medT>3&&S){medT=0;if(S.fish&&S.h)checkMedals()}};
const mtxt=a=>a?a.map(m=>MONTHS[m]).join(' '):'o ano todo';
function pAlbum(){
 const lg=ensureLg(),fs=albFish(),hs2=albHunt(),seen=fs.filter(k=>S.fish&&S.fish.rec[k]).length+hs2.filter(k=>(S.h.kills[k]||0)>0).length;
 let h='<div class="card"><div class="row"><b>📒 Álbum do Pescador e Caçador</b><span class="gold">'+seen+'/'+(fs.length+hs2.length)+'</span></div><div class="dim">Medalha pelo peso do seu recorde: 🥉 bom · 🥈 grande · 🥇 troféu. Cada medalha nova paga um prêmio. Lendas capturadas: <b class="gold">'+legCount()+'/'+(LEGF.length+Object.keys(LEGH).length)+'</b> · Ouros: <b class="gold">'+goldCount()+'</b></div></div>';
 h+='<div class="sec">✨ LENDAS</div>';
 const lc=(ic,n,where,got,seen2,hint)=>'<div class="card" style="'+(got?'border-color:#e0a431':'')+'"><div class="row"><b>'+(got?'🏆 '+ic+' '+n:seen2?'🗣️ '+n:'❓ ??????')+'</b><span class="'+(got?'gold':'dim')+'">'+(got?got.kg+' kg':where)+'</span></div><div class="dim" style="font-size:15px">'+(got?'Capturado no dia '+(got.d%30+1)+'/'+MONTHS[Math.floor((got.d%360)/30)]:hint)+'</div></div>';
 LEGF.forEach(k=>{const f=FISH[k];h+=lc(f.ic,f.n,ZN[f.z[0]],lg.fish[k],lg.seen[k],f.hint)});
 Object.keys(LEGH).forEach(k=>{const L=LEGH[k];h+=lc('🦌',L.n,L.bio,lg.hunt[k],lg.seen[k],L.hint+(L.mon?' ('+mtxt(L.mon)+')':''))});
 h+='<div class="sec">🐟 PEIXES</div>';
 fs.forEach(k=>{const f=FISH[k],r=S.fish&&S.fish.rec[k],md=fishMed(k),ok=fishSeasonOk(f);
  h+='<div class="card" style="padding:5px 8px"><div class="row"><b>'+(r?f.ic+' '+f.n:'❓ ???')+' '+MEDAL[md]+'</b><span class="dim">'+(r?r.kg+' kg · '+r.n+'×':'')+'</span></div><div class="dim" style="font-size:15px">'+f.z.map(z=>ZN[z]).join(', ')+' · '+(f.sea?'<span class="'+(ok?'grn':'')+'">'+mtxt(f.sea)+(ok?' (agora!)':'')+'</span>':'o ano todo')+(f.fl?' · só na cheia':'')+' · até '+f.w[1]+' kg</div></div>'});
 h+='<div class="sec">🦌 CAÇA</div>';
 hs2.forEach(k=>{const s=SPECIES[k],n=S.h.kills[k]||0,r=S.h.rec&&S.h.rec[k],md=huntMed(k);
  h+='<div class="card" style="padding:5px 8px"><div class="row"><b>'+(n?s.n:'❓ ???')+' '+MEDAL[md]+'</b><span class="dim">'+(n?n+' abate(s)'+(r&&r.kg?' · '+Math.round(r.kg/.72)+' kg vivo':''):'')+'</span></div><div class="dim" style="font-size:15px">'+(BIONAME[s.bio||'f'])+' · temporada: '+mtxt(s.season)+' · até '+s.w[1]+' kg</div></div>'});
 return h;
}
ACH.push(['lend1','Contador de causos','Capture uma lenda (peixe ou caça)',()=>legCount()>=1,5000],['lend5','Caçador de lendas','Capture 5 lendas',()=>legCount()>=5,30000],['lendall','Mito da região','Capture todas as lendas',()=>legCount()>=LEGF.length+Object.keys(LEGH).length,150000],['ouro10','Medalhista','Tenha 10 medalhas de ouro no álbum',()=>goldCount()>=10,25000]);
// ---------- parede de troféus da casa
function drawLegPlaque(g,x,y,k,isFish){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 R('#c8a040',0,4,14,13);R('#ffe08a',0,4,14,1);R('#6a4428',1,5,12,11);R('#8a5a32',2,6,10,9);
 if(isFish){const c=k==='lg_moeda'?'#e0b040':k==='lg_relampago'?'#d8a020':k==='lg_dente'?'#5a6a3a':k==='lg_gigante'?'#8a3a2a':'#a8c0c8';R(c,3,9,7,4);R(shade(c,-25),3,12,7,1);R(c,10,8,2,2);R(c,10,12,2,2);R('#111',4,10,1,1);R('#fff',4.5,9.5,.5,.5)}
 else{const sp=LEGH[k].sp;if(sp==='croc'){R('#3f5a34',3,8,4,6);R('#4f6a40',6,9,6,3);R('#f0ecd8',7,11,5,.6);R('#ffd75e',4,9,1,1)}
  else if(sp==='pronghorn'){R('#c8905a',4,7,6,7);R('#fff',5,12,4,2);R('#111',4,3,1,5);R('#111',9,3,1,5);R('#111',5,9,1,1);R('#111',8,9,1,1)}
  else{g.save();drawHead(g,x,y,sp==='whitedeer'?'whitedeer':sp);g.restore()}}
 R('#ffd75e',5,16,4,1.5);
}
const _dwdL=drawWallDeco;
drawWallDeco=function(g,d,x,y){
 if(d.k!=='trophies')return _dwdL(g,d,x,y);
 const lg=S.lg||{fish:{},hunt:{}},it=[];Object.keys(lg.hunt).forEach(k=>it.push([k,0]));Object.keys(lg.fish).forEach(k=>it.push([k,1]));
 if(!it.length)return _dwdL(g,d,x,y);
 const H=S.h&&S.h.kills||{},reg=['deer','elk','boar','bear','wolf'].filter(k=>H[k]);
 it.slice(0,4).forEach((t,i)=>drawLegPlaque(g,x+i*14,y,t[0],t[1]));
 reg.slice(0,Math.max(0,4-it.length)).forEach((k,i)=>drawHead(g,x+(it.length+i)*14,y+4,k));
};
GUIDE.push({lv:2,ic:'📒',t:'Álbum e lendas',h:'Cada estação traz peixes diferentes (pacu e tambaqui na cheia, piranha na seca, truta-dourada no inverno). Seus recordes ganham medalhas 🥉🥈🥇 com prêmio. Existem 5 peixes e 5 animais LENDÁRIOS que só aparecem em certas condições. As dicas ficam no menu 📒 Álbum.'});
