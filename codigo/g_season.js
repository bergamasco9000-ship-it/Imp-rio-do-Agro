// ===== Estações do ano: geada, seca e queimadas, feno, cheia do Pantanal, ipês =====
const SEAS=[{n:'Verão',ic:'☀️'},{n:'Outono',ic:'🍂'},{n:'Inverno',ic:'❄️'},{n:'Primavera',ic:'🌸'}];
const seaOf=m=>(m===11||m<=1)?0:m<=4?1:m<=7?2:3;
const curMon=()=>Math.floor((S.day%360)/30);
const season=()=>seaOf(curMon());
const yearN=()=>Math.floor(S.day/360)+1;
function ensureSea(){if(!S.sea)S.sea={frostD:-1,cover:0,calf:0,hay:0,burn:{},fl:FLOODLV[curMon()],secaY:-1,fireD:-1};if(!S.sea.burn)S.sea.burn={};return S.sea}
const FROSTSENS={milho:1,tomate:1,soja:1,cana:1,cafe:1};
const calvesOut=()=>S.herd.filter(a=>a.age<120&&a.stall==null);
// ---------- previsão e efeitos diários
function frostChance(){const m=curMon();let p=m===5?.13:m===6?.15:m===7?.07:0;if(S.diff==='easy')p*=.6;return p}
function frostWarn(){
 const sens=S.crops.filter(c=>FROSTSENS[c.c]).length,cv=calvesOut().length,cc=Math.max(50,sens*8),bc=cv*15;
 const h='<h3>🥶 Previsão de GEADA para amanhã cedo!</h3><div class="card">Na madrugada a temperatura vai cair abaixo de zero.<br>• Plantas sensíveis (milho, tomate, soja, cana, café) <b class="red">morrem</b> sem proteção. Trigo e mandioca aguentam.<br>• Bezerros pequenos no pasto <b class="red">sofrem</b> com o frio.<br>• O pasto queima um pouco.</div>'
  +'<div class="card"><div class="row"><b>🌱 Cobrir a lavoura com lona</b><span class="gold">'+R$(cc)+'</span></div><div class="dim">'+sens+' canteiro(s) sensível(is).</div><div class="btns">'+(S.sea.cover?'<span class="grn">✔ Lavoura coberta</span>':sens?'<button class="b gold" data-act="frcover" data-v="'+cc+'">Cobrir</button>':'<span class="dim">Nada sensível plantado</span>')+'</div></div>'
  +'<div class="card"><div class="row"><b>🐄 Recolher os bezerros (cama de palha)</b><span class="gold">'+R$(bc)+'</span></div><div class="dim">'+cv+' bezerro(s) com menos de 4 meses no pasto. (Os que estão nas baias já estão protegidos.)</div><div class="btns">'+(S.sea.calf?'<span class="grn">✔ Bezerros abrigados</span>':cv?'<button class="b gold" data-act="frcalf" data-v="'+bc+'">Recolher</button>':'<span class="dim">Nenhum bezerro pequeno</span>')+'</div></div>'
  +'<div class="btns"><button class="b gray" data-act="close">Ok</button></div>';
 if(!modalOpen&&!menuOpen)showModal(h);else toast('🥶 Previsão de geada para amanhã cedo! Veja o clima em 🏆 Região.','bad');
}
function applyFrost(){
 const sea=ensureSea();let dead=0,hurt=0;
 if(!sea.cover){const keep=[];for(const c of S.crops){if(FROSTSENS[c.c]){dead++;continue}keep.push(c)}S.crops=keep;rebuildCMap()}
 S.pasture=Math.max(0,S.pasture-10);if(S.pq&&S.pq.q)S.pq.q=S.pq.q.map(q=>Math.max(0,(q||0)-10));
 if(!sea.calf)for(const a of calvesOut()){a.hp-=22;hurt++;if(a.hp<=0)die(a,'geada')}
 sea.cover=0;sea.calf=0;
 toast('🥶 Geada esta madrugada!'+(dead?' '+dead+' planta(s) queimaram.':'')+(hurt?' '+hurt+' bezerro(s) sentiram o frio.':'')+' O pasto amarelou.',dead||hurt?'bad':'good');
}
function hayNeed(){return S.herd.reduce((s,a)=>s+a.w/450*1.8,0)}
function useHay(){
 const sea=ensureSea();if(!sea.hay||!S.herd.length||!S.suppl||S.pasture>=45)return;
 const need=hayNeed(),cap=typeof siloCap==='function'?siloCap():5000;let n=0;
 while(sea.hay>0&&S.feed<need*3&&S.feed+250<=cap+250){S.feed+=250;sea.hay--;n++}
 if(n)tt('hay','🌾 '+n+' fardo(s) de feno foram para o cocho','good',3);
}
const _hdSea=hookDay;
hookDay=function(){_hdSea();const sea=ensureSea(),m=curMon(),dm=S.day%30;
 if(sea.frostD===S.day)applyFrost();
 if(sea.frostD<S.day&&Math.random()<frostChance()){sea.frostD=S.day+1;frostWarn()}
 // seca do inverno
 if((m===7||m===8)&&!S.drought&&sea.secaY!==yearN()&&Math.random()<(dm<3?.35:.05)){sea.secaY=yearN();S.drought=ri(25,42);toast('🌵 A seca do inverno chegou: pasto fraco e risco de queimadas. Use o feno e a ração!','bad')}
 if(S.weather==='chuva'&&FIRE.length){FIRE.length=0;FSET.clear();toast('🌧️ A chuva apagou a queimada','good')}
 if((S.drought>0||m===7||m===8)&&!FIRE.length&&Math.random()<(S.drought>0?.09:.04)&&S.day>5)startFire();
 for(const k in sea.burn)if(S.day-sea.burn[k]>7)delete sea.burn[k];
 useHay();
 const fl=FLOODLV[m];if(fl!==sea.fl){const up=fl>sea.fl;sea.fl=fl;buildFlood();if(up&&fl===1)toast('🌊 Começou a cheia no Pantanal: os campos alagam e os peixes da cheia aparecem','good');if(!fl)toast('🏞️ As águas do Pantanal baixaram')}
 if(dm===0){const s=seaOf(m),ps=seaOf((m+11)%12);if(s!==ps)toast(SEAS[s].ic+' Começou o '+SEAS[s].n+'! '+['Chuvas fortes, pasto verde e cheia no Pantanal.','O tempo começa a secar. Ótima época para fazer feno.','Frio, geadas e seca. Proteja a lavoura e os bezerros.','Os ipês florescem e as chuvas voltam aos poucos.'][s],'good')}
};
Object.assign(ACT,{
 frcover(e){const c=+e.v;if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Lona contra geada');S.sea.cover=1;toast('🌱 Lavoura coberta com lona','good');frostWarn()},
 frcalf(e){const c=+e.v;if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Abrigo dos bezerros');S.sea.calf=1;toast('🐄 Bezerros recolhidos no galpão','good');frostWarn()},
 bombeiro(){if(!FIRE.length)return;if(S.money<2500)return toast('Dinheiro insuficiente','bad');cash(-2500,'Bombeiros');FIRE.length=0;FSET.clear();toast('🚒 Os bombeiros apagaram a queimada','good');hideModal()}
});
// ---------- QUEIMADAS
const FIRE=[],FSET=new Set(),SMK=[];let fireAcc=0,fireBurned=0,fireCd=0;
const inVillage=(x,y)=>x>=57&&x<=98&&y>=37&&y<=67;
function flammable(x,y){
 if(x<2||y<2||x>=MW-2||y>=RZ-2)return false;const i=ti(x,y),g=G[i];
 if(!(g===0||g===1||g===4))return false;if(SOL[i]||inVillage(x,y)||inArn(x,y))return false;
 if(BLD.some(b=>x>=b.x-1&&x<=b.x+b.w&&y>=b.y-1&&y<=b.y+b.h))return false;
 if(FEN[i]&&Math.random()<.7)return false;return true;
}
function fireRegion(x,y){return y<35?'na beira da mata':y>=71?'no cerrado':x>60?'perto da vila':'no campo'}
function startFire(){
 for(let k=0;k<80;k++){
  const zone=Math.random()<.5?[8,24,60,36]:[6,66,58,80],x=ri(zone[0],zone[2]),y=ri(zone[1],zone[3]);
  if(!flammable(x,y))continue;if(Math.hypot(x*TS-P.x,y*TS-P.y)<120)continue;
  FIRE.length=0;FSET.clear();fireBurned=0;igniteT(x,y);igniteT(x+1,y);S.sea.fireD=S.day;
  toast('🔥 QUEIMADA '+fireRegion(x,y)+'! Vá até lá e use '+(isTouch?'✋':'[E]')+' para abafar o fogo antes que chegue no pasto.','bad');return true}
 return false;
}
function igniteT(x,y){if(!flammable(x,y))return;const i=ti(x,y);if(FSET.has(i)||S.sea.burn[i]!==undefined)return;FSET.add(i);FIRE.push({i,x,y,t:0,life:rnd(9,15),h:hs(x,y)});fireBurned++}
function stepFire(dt){
 fireCd=Math.max(0,fireCd-dt);
 for(let i=SMK.length-1;i>=0;i--){const s=SMK[i];s.y+=s.vy*dt;s.x+=s.vx*dt;s.r+=dt*3;s.a-=dt*.35;if(s.a<=0)SMK.splice(i,1)}
 if(!FIRE.length)return;
 fireAcc+=dt;
 while(fireAcc>=.25){fireAcc-=.25;
  for(let k=FIRE.length-1;k>=0;k--){const f=FIRE[k];f.t+=.25;
   if(Math.random()<.075&&fireBurned<70){const d=[[1,0],[-1,0],[0,1],[0,-1]][ri(0,3)];igniteT(f.x+d[0],f.y+d[1])}
   if(Math.random()<.18&&SMK.length<90)SMK.push({x:f.x*TS+rnd(3,13),y:f.y*TS+rnd(0,6),vx:rnd(-3,3)+Math.cos(S.wind?S.wind.a:0)*6,vy:rnd(-14,-8),r:2,a:.45});
   if(f.t>=f.life){S.sea.burn[f.i]=S.day;FSET.delete(f.i);FIRE.splice(k,1);
    if(f.x>=PAS.x&&f.x<PAS.x+pasW()&&f.y>=PAS.y&&f.y<PAS.y+PAS.h){S.pasture=Math.max(0,S.pasture-1.5);tt('fpas','🔥 O fogo está queimando o pasto!','bad',6)}}
  }
  if(!FIRE.length)toast('🔥 A queimada se apagou sozinha. Ficou o rastro de cinzas.')
 }
 const px=Math.floor(P.x/TS),py=Math.floor((P.y-2)/TS);if(FSET.has(ti(px,py))&&!inRoom()){P.hp-=5*dt;P.hurt=.3;tt('fhot','🔥 Cuidado, você está pisando no fogo!','bad',3);if(P.hp<5)P.hp=5}
}
function fireBeat(){
 if(fireCd>0)return;fireCd=.3;let n=0;
 for(let k=FIRE.length-1;k>=0;k--){const f=FIRE[k],d=Math.hypot(f.x*TS+8-P.x,f.y*TS+10-P.y);if(d<30){S.sea.burn[f.i]=S.day;FSET.delete(f.i);FIRE.splice(k,1);n++;for(let j=0;j<4;j++)SMK.push({x:f.x*TS+rnd(2,14),y:f.y*TS+rnd(2,12),vx:rnd(-5,5),vy:rnd(-10,-4),r:3,a:.6})}}
 if(n){P.work=.4;gainXP(n*.6,'fogo');try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,b=AC.createBufferSource(),buf=AC.createBuffer(1,AC.sampleRate*.12,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);b.buffer=buf;const gn=AC.createGain();gn.gain.value=.08;b.connect(gn);gn.connect(AC.destination);b.start(t)}catch(e){}}
 if(!FIRE.length&&n){S.rep=Math.min(100,S.rep+1);gainXP(30,'fogo');toast('🧯 Fogo apagado! A vizinhança agradece (+1 reputação)','good')}
}
function nearFire(){let best=null,bd=40;for(const f of FIRE){const d=Math.hypot(f.x*TS+8-P.x,f.y*TS+10-P.y);if(d<bd){bd=d;best=f}}return best}
function drawFlame(g,f){
 const x=f.x*TS,y=f.y*TS,a=Math.min(1,f.t/1.5,(f.life-f.t)/2.5);if(a<=0)return;
 Rr(g,'rgba(40,20,10,.45)',x+1,y+4,14,11);
 for(let j=0;j<3;j++){const fx=x+4+j*4+Math.sin(frame*.3+j+f.h*9)*.8,hh=(7+((f.h*31+j*7)%5)+Math.sin(frame*.45+j*2+f.h*20)*2.5)*a;if(typeof flameT==='function')flameT(g,fx,y+14,5,hh,frame*.3+j+f.h*10)}
 if(((frame+f.h*50)|0)%9<2)Rr(g,'#ffd75e',x+4+f.h*8,y+2-((frame>>1)%6),1,1);
}
// ---------- FENO
function hayModal(){
 const sea=ensureSea();reModal=hayModal;const n=S.pq&&S.pq.q?S.pq.q.length:1,dry=S.drought>0,tr=S.up&&S.up.trator;
 let h='<h3>🌾 Paiol de feno</h3><div class="card"><div class="row"><b>'+sea.hay+' / 24 fardos</b><span class="dim">250 kg cada</span></div>'+bar(sea.hay/24*100,'#e0c060')+'<div class="dim">Na seca e no inverno o pasto quase não cresce. Os fardos vão sozinhos para o cocho quando o pasto fica fraco e a ração acaba (com a suplementação ligada).</div></div>';
 h+='<div class="sec">ENFARDAR PASTO</div><div class="dim">Corte o capim de um piquete bem verde (70%+) para fazer feno. O piquete perde 35% de capim. '+(tr?'Com o trator sai de graça.':'Custa R$ 40 por fardo (aluguel da enfardadeira). Com trator é grátis.')+'</div>';
 for(let i=0;i<n;i++){const q=Math.round(pqQ(i)),b=Math.max(0,Math.round((q-35)/8)),ok=q>=70&&!dry&&i!==S.pq.a;
  h+='<div class="card"><div class="row"><b>Piquete '+(i+1)+(i===S.pq.a?' (gado aqui)':'')+'</b><span class="'+(q>=70?'grn':'dim')+'">'+q+'%</span></div><div class="btns">'+(ok?'<button class="b gold" data-act="hayc" data-v="'+i+'">Enfardar → '+Math.min(b,24-sea.hay)+' fardos'+(tr?'':' · '+R$(Math.min(b,24-sea.hay)*40))+'</button>':'<span class="dim">'+(dry?'Na seca não dá para enfardar':i===S.pq.a?'Tire o gado antes':'Capim baixo demais')+'</span>')+'</div></div>'}
 if(n<=1)h+='<div class="dim">Dica: com 2 ou mais piquetes (Casa Agro) você descansa um e faz feno dele.</div>';
 h+='<div class="sec">COMPRAR FENO</div><div class="card"><div class="row"><b>Fardo de feno</b><span class="gold">'+R$(feno$())+'</span></div><div class="dim">Mais caro na seca.</div><div class="btns"><button class="b" data-act="haybuy" data-v="1">+1</button><button class="b" data-act="haybuy" data-v="5">+5</button></div></div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
const feno$=()=>Math.round(250*feedPrice()*(S.drought>0?1.5:.85));
Object.assign(ACT,{
 hayc(e){const sea=ensureSea(),i=+e.v,q=pqQ(i),b=Math.min(Math.max(0,Math.round((q-35)/8)),24-sea.hay);if(!b)return toast('Paiol cheio','bad');const c=S.up.trator?0:b*40;if(S.money<c)return toast('Dinheiro insuficiente','bad');if(c)cash(-c,'Enfardadeira');S.pq.q[i]=Math.max(0,q-35);sea.hay+=b;gainXP(b*2,'feno');toast('🌾 '+b+' fardos de feno guardados no paiol','good')},
 haybuy(e){const sea=ensureSea(),n=Math.min(+e.v,24-sea.hay),c=n*feno$();if(!n)return toast('Paiol cheio','bad');if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Feno');sea.hay+=n;toast('🌾 +'+n+' fardo(s)','good')}
});
function drawHay(g){
 const n=Math.min(24,(S.sea&&S.sea.hay)||0),bx=HAYP.x*TS,by=(HAYP.y+2)*TS-2;
 Rr(g,'rgba(0,0,0,.25)',bx-1,by-2,34,4);
 // estrado + cobertura
 Rr(g,'#5a3a22',bx,by-3,32,3);Rr(g,'#3a2414',bx+1,by-24,2,22);Rr(g,'#3a2414',bx+29,by-24,2,22);
 let k=0;for(let row=0;row<4&&k<n;row++){const cnt=Math.min(6-row,n-k),w=5;for(let j=0;j<cnt;j++,k++){const x=bx+3+row*2.5+j*w,y=by-7-row*5;Rr(g,'#c8a040',x,y,w-.5,5);Rr(g,'#e0c060',x,y,w-.5,1.4);Rr(g,'#9a7a2a',x+1.5,y,1,5);Rr(g,'#9a7a2a',x+3.2,y,1,5)}}
 Rr(g,'#7a3a2a',bx-2,by-28,36,4);Rr(g,'#5a2a1e',bx-2,by-25,36,1.5);for(let i=0;i<36;i+=4)Rr(g,'#8a4a32',bx-2+i,by-28,2,4);
 const t=String(n);ptext(g,'FENO '+t,bx+16-ptw('FENO '+t)/2,by-35,'#ffd75e','#1e140c');
}
// ---------- CHEIA DO PANTANAL
const FLOODLV=[2,3,3,2,1,0,0,0,0,0,0,1];
const FLOOD=new Uint8Array(MW*MH),FLX=100,FLY=88,FLW=60,FLH=44;let FLC=null,FLB=-1;
function buildFlood(){
 const lv=(S.sea&&S.sea.fl)||0;FLOOD.fill(0);FLB=lv;if(!lv){FLC=null;return}
 for(let y=FLY+1;y<FLY+FLH-1;y++)for(let x=FLX+1;x<FLX+FLW-2;x++){const i=ti(x,y);if(!(G[i]===6||G[i]===3)||SOL[i])continue;if(x>=105&&x<=121&&y>=42&&y<=61)continue;if(inHomeLot(x,y))continue;
  if(BLD.some(b=>x>=b.x-1&&x<=b.x+b.w&&y>=b.y-1&&y<=b.y+b.h+1))continue;
  const v=Math.sin(x*.21)+Math.sin(y*.27+2)+Math.sin((x+y)*.13);let near=0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(G[ti(x+a,y+b)]===2)near=1;
  if(v>1.55-lv*.36||(near&&v>1.55-lv*.5))FLOOD[i]=1}
 FLC=mkCanvas(FLW*TS,FLH*TS);const g=FLC.getContext('2d'),R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},wet=(x,y)=>FLOOD[ti(x,y)]||G[ti(x,y)]===2;
 for(let y=FLY;y<FLY+FLH;y++)for(let x=FLX;x<FLX+FLW;x++){const i=ti(x,y);if(!FLOOD[i])continue;const bx=(x-FLX)*TS,by=(y-FLY)*TS,h=hs(x*7,y*3);
  R('rgba(78,128,140,.84)',bx,by,TS,TS);R('rgba(110,162,176,.5)',bx+((h*9)|0),by+3+((h*7)|0),5,1);if(h>.5)R('rgba(60,104,118,.45)',bx+((h*13)|0)%10,by+9,6,2);
  const n=!wet(x,y-1),so=!wet(x,y+1),w=!wet(x-1,y),e=!wet(x+1,y);
  if(n)R('rgba(196,224,214,.75)',bx,by,TS,1.5);if(so)R('rgba(70,96,60,.6)',bx,by+TS-1.5,TS,1.5);if(w)R('rgba(196,224,214,.7)',bx,by,1.5,TS);if(e)R('rgba(196,224,214,.7)',bx+TS-1.5,by,1.5,TS);
  if(n&&w)g.clearRect(bx,by,3,3);if(n&&e)g.clearRect(bx+TS-3,by,3,3);if(so&&w)g.clearRect(bx,by+TS-3,3,3);if(so&&e)g.clearRect(bx+TS-3,by+TS-3,3,3);
  if(h<.22){const lx=bx+2+((h*50)|0)%10,ly=by+3+((h*90)|0)%9;R('#3a7a3a',lx,ly,4,3);R('#4a9a4a',lx+1,ly,2,1);if(h<.07){R('#b07ad8',lx+1,ly-1,2,2)}}
  if(h>.85){R('#5a7a3a',bx+11,by+4,1,7);R('#5a7a3a',bx+13,by+6,1,5);R('#7a5a2a',bx+11,by+3,1,2)}}
}
const floodAt=(x,y)=>FLB>0&&FLOOD[ti(Math.floor(x/TS),Math.floor(y/TS))];
const _mpSea=movePlayer;movePlayer=function(dx,dy){if(floodAt(P.x,P.y-2)){dx*=.55;dy*=.55}return _mpSea(dx,dy)};
const _nwSea=nearWater;
nearWater=function(){let w=_nwSea();if(w&&w.x>=100*TS&&w.y<=41*TS)w.z='mtn';
 if(!w&&LV()>=2&&FLB>0){const cx=Math.floor(P.x/TS),cy=Math.floor((P.y-4)/TS);for(let dy=-1;dy<=1&&!w;dy++)for(let dx=-1;dx<=1;dx++)if(FLOOD[ti(cx+dx,cy+dy)]){w={x:(cx+dx)*TS+8,y:(cy+dy)*TS+8,z:'pant'};break}}
 return w};
// ---------- IPÊS (jul–set)
const IPEC=[['#e2559a','#f07ab8','#b83a7a'],['#f0c020','#ffe066','#c89a10'],['#f4f0f4','#ffffff','#d8c8d8']];const IPS=new Map();
function ipeSprite(c,s){const key=c+'|'+s;if(IPS.has(key))return IPS.get(key);const w=Math.round(32*s),h=Math.round(25*s),cv=mkCanvas(w,h),g=cv.getContext('2d'),P3=IPEC[c];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=(x-w/2)/(w/2),dy=(y-h/2)/(h/2),d=dx*dx+dy*dy,n=ih(x,y,c+3);if(d>1-n*.35)continue;g.fillStyle=n<.25?P3[2]:n>.72?P3[1]:P3[0];g.fillRect(x,y,1,1)}
 const r={c:cv,w,h};IPS.set(key,r);return r}
const _dtSea=drawTree;
drawTree=function(g,t){_dtSea(g,t);const m=curMon();if(m<6||m>8||!(t.k===0||t.k===1||t.k===3))return;
 if(t.ipe===undefined){const h=hs(Math.floor(t.x)*3+1,Math.floor(t.y)*5+2);t.ipe=h<.11?(h<.055?0:h<.104?1:2):-1}
 if(t.ipe<0)return;const sc=t.s>1.12?1.2:t.s<.95?.9:1.05,sp=ipeSprite(t.ipe,sc),sw=Math.sin(frame/55+t.x*.07)*.45;
 g.drawImage(sp.c,t.x-sp.w/2+sw,t.y-(t.k===3?24:36)*sc-sp.h/2);
 const P3=IPEC[t.ipe];for(let i=0;i<5;i++){const a=hs(t.x+i,t.y),b=hs(t.y+i,t.x);Rr(g,P3[i%2],t.x-10+a*20,t.y-3+b*5,1.5,1)}
};
// ---------- desenho: chão (cinzas, cheia, geada), itens e partículas
const _pqtSea=pqTint;
pqTint=function(g){_pqtSea(g);if(inRoom())return;const sea=ensureSea(),x0=CX-16,x1=CX+VW+16,y0=CY-16,y1=CY+VH+16;
 if(FLB!==sea.fl)buildFlood();
 if(FLC){const sx=Math.max(x0,FLX*TS),sy=Math.max(y0,FLY*TS),ex=Math.min(x1,(FLX+FLW)*TS),ey=Math.min(y1,(FLY+FLH)*TS);
  if(ex>sx&&ey>sy){g.drawImage(FLC,sx-FLX*TS,sy-FLY*TS,ex-sx,ey-sy,sx,sy,ex-sx,ey-sy);
   const tx0=Math.floor(sx/TS),tx1=Math.ceil(ex/TS),ty0=Math.floor(sy/TS),ty1=Math.ceil(ey/TS);for(let y=ty0;y<ty1;y++)for(let x=tx0;x<tx1;x++){if(!FLOOD[ti(x,y)])continue;const h=hs(x,y*3);if(h>.3)continue;const ph=(frame*.03+h*20)%6;if(ph<3)Rr(g,'rgba(220,240,250,'+(.35-ph*.1).toFixed(2)+')',x*TS+3+h*20%8,y*TS+5+h*40%7,4,.8)}}}
 for(const k in sea.burn){const i=+k,x=i%MW,y=(i/MW)|0,px=x*TS,py=y*TS;if(px<x0||px>x1||py<y0||py>y1)continue;const age=S.day-sea.burn[k],a=Math.max(0,.62-age*.08);if(a<=0)continue;
  Rr(g,'rgba(34,26,20,'+a.toFixed(2)+')',px,py,TS,TS);const h=hs(x,y);Rr(g,'rgba(70,60,52,'+a.toFixed(2)+')',px+h*10,py+3,4,2);if(age===0&&((frame+x*7)>>4)%5===0)Rr(g,'#ff8a2a',px+4+h*7,py+8,1,1)}
 if(sea.frostD===S.day){const hr=S.t*24,k=hr<7?1:hr<10?1-(hr-7)/3:0;if(k>0){g.fillStyle='rgba(226,240,255,'+(.4*k).toFixed(3)+')';g.fillRect(x0,y0,x1-x0,y1-y0);
   for(let y=Math.floor(y0/TS);y<y1/TS;y++)for(let x=Math.floor(x0/TS);x<x1/TS;x++){const h=hs(x*5,y*9);if(h<.5){const tw=((frame/8+h*40)|0)%9;Rr(g,'rgba(255,255,255,'+((tw<2?.9:.45)*k).toFixed(2)+')',x*TS+h*14,y*TS+(h*29)%14,1,1)}}}}
};
const _evoSea=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoSea(L,x0,x1,y0,y1);
 const hx=HAYP.x*TS;if(hx>x0-40&&hx<x1+10&&HAYP.y*TS<y1&&(HAYP.y+2)*TS>y0-30)L.push([(HAYP.y+2)*TS-2,10,{draw:drawHay}]);
 for(const f of FIRE){const px=f.x*TS,py=f.y*TS;if(px>x0-20&&px<x1+20&&py>y0-20&&py<y1+10)L.push([py+13,10,{draw:g=>drawFlame(g,f)}])}
};
const _dpSea=drawPart;
drawPart=function(g){_dpSea(g);if(inRoom())return;
 for(const s of SMK)Rr(g,'rgba(90,86,84,'+(s.a*.6).toFixed(2)+')',s.x-s.r/2,s.y-s.r/2,s.r,s.r);
 if(floodAt(P.x,P.y-2)){const r=5+Math.sin(frame*.2)*1.2;Rr(g,'rgba(220,240,250,.55)',P.x-r,P.y-1,r*2,1);if(P.moving)Rr(g,'rgba(220,240,250,.4)',P.x-r-2,P.y+1,r*2+4,.8)}
 if(FIRE.length){let cx=0,cy=0;for(const f of FIRE){cx+=f.x;cy+=f.y}cx=cx/FIRE.length*TS+8;cy=cy/FIRE.length*TS+8;
  if(cx<CX||cx>CX+VW||cy<CY||cy>CY+VH){const ax=clamp(cx,CX+10,CX+VW-10),ay=clamp(cy,CY+34,CY+VH-14),d=Math.round(Math.hypot(cx-P.x,cy-P.y)/TS);
   Rr(g,'rgba(40,10,5,.8)',ax-7,ay-7,14,14);Rr(g,'#ff8a2a',ax-3,ay-3+((frame>>3)&1),6,6);Rr(g,'#ffd75e',ax-1,ay-1,2,3);ptext(g,d+'M',ax-ptw(d+'M')/2,ay+9,'#ffb080','#000')}}
};
const _lpSea=lampPos;lampPos=function(){const L=_lpSea();if(FIRE.length&&daylight()<.5)for(let k=0;k<FIRE.length&&k<10;k+=2){const f=FIRE[k];L.push({x:f.x*TS+8,y:f.y*TS+22})}return L};
const _ilSea=interactList;
interactList=function(){const L=_ilSea();if(inRoom())return L;
 const f=nearFire();if(f)L.push({x:f.x*TS+8,y:f.y*TS+10,r:40,label:'🔥 Abafar o fogo ('+FIRE.length+' focos)',fn:fireBeat});
 L.push({x:HAYP.x*TS+16,y:(HAYP.y+2)*TS,r:28,label:'🌾 Paiol de feno ('+((S.sea&&S.sea.hay)||0)+' fardos)',fn:hayModal});
 return L};
const _updSea=update;update=function(dt){_updSea(dt);if(S&&S.sea)stepFire(dt)};
// ---------- HUD e painel do clima
function seaLabel(){const s=SEAS[season()];return s.ic+' '+s.n+(S.drought>0?' · 🌵 Seca':S.weather==='chuva'?' · 🌧️':'')+(S.sea&&S.sea.frostD===S.day+1?' · 🥶':'')+(FIRE.length?' · 🔥':'')}
const _rhSea=renderHUD;renderHUD=function(){_rhSea();const el=$('hudL');if(!el||!S)return;const d=el.children[3];if(d&&d.classList.contains('dim')){const wa=S.wind?S.wind.a:0,h=seaLabel()+' · <span style="display:inline-block;transform:rotate('+wa+'rad);color:#9ad8f5">➤</span>';if(d._sh!==h){d._sh=h;d.innerHTML=h}}};
function climaCard(){const sea=ensureSea(),m=curMon(),s=season(),fl=sea.fl;
 const risk=m===5||m===6?'<b class="red">alto</b>':m===7?'médio':'nenhum';
 let h='<div class="sec">🌦️ CLIMA E ESTAÇÃO</div><div class="card"><div class="row"><b>'+SEAS[s].ic+' '+SEAS[s].n+'</b><span class="dim">'+MONTHS[m]+' · ano '+yearN()+'</span></div>'
  +'<div class="dim" style="font-size:16px">🥶 Risco de geada: '+risk+(sea.frostD===S.day+1?' · <b class="red">GEADA AMANHÃ</b>':'')+'<br>🌵 Seca: '+(S.drought>0?'<b class="red">'+S.drought+' dias restantes</b>':(m>=6&&m<=8?'época de seca':'—'))+'<br>🌊 Pantanal: '+['águas baixas','cheia começando','cheia','cheia máxima'][fl]+'<br>🌾 Feno no paiol: '+sea.hay+' fardos'+(m>=6&&m<=8?'<br>🌸 Os ipês estão florindo!':'')+'</div>'
  +(FIRE.length?'<div class="red"><b>🔥 Queimada ativa: '+FIRE.length+' focos!</b></div><div class="btns"><button class="b red" data-act="bombeiro">🚒 Chamar bombeiros (R$ 2.500)</button></div>':'')+'</div>';
 return h}
const _pRegSea=pReg;pReg=function(){return climaCard()+_pRegSea()};
GUIDE.push({lv:1,ic:'🌦️',t:'Estações do ano',h:'Verão (dez–fev): chuva e pasto verde, cheia no Pantanal. Outono (mar–mai): bom para fazer feno. Inverno (jun–ago): geadas, seca e queimadas. Primavera (set–nov): ipês floridos e volta das chuvas. Veja a previsão em 🏆 Região.'},
 {lv:1,ic:'🥶',t:'Geada',h:'No inverno chega um aviso na véspera. Cubra a lavoura sensível com lona e recolha os bezerros pequenos, ou eles sofrem. Trigo e mandioca aguentam o frio.'},
 {lv:1,ic:'🔥',t:'Queimadas',h:'Na seca o fogo pode começar no campo ou na mata. Uma seta vermelha mostra onde é. Chegue perto e use ✋/[E] repetidas vezes para abafar. Se chegar no pasto, o capim queima. A chuva apaga tudo.'},
 {lv:2,ic:'🌾',t:'Feno',h:'No paiol ao lado do celeiro você enfarda um piquete bem verde (70%+) e guarda até 24 fardos. Na seca, quando o pasto fica fraco, o feno vai sozinho para o cocho.'},
 {lv:2,ic:'🌊',t:'Cheia do Pantanal',h:'De dezembro a maio os campos do Pantanal alagam. Você anda mais devagar na água, mas dá para pescar no alagado e aparecem peixes da cheia, como pacu e tambaqui.'});
