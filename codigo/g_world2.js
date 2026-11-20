// ===== Pessoas (parceiro e peão), casas personalizadas, fazenda que evolui =====
function drawPerson(g,o){
 const x=o.x,y=o.y,mv=o.mv,sw=mv?Math.sin(o.ph):0,by=y-(mv?Math.abs(Math.cos(o.ph)):0),side=o.dir>=2,dr=o.dir===3?1:-1,leg=o.pants||'#33384a',skin=o.skin||'#e8b890',wk=o.work?Math.sin(frame/3):0;
 Rr(g,'rgba(0,0,0,.3)',x-5,y-1,10,3);
 if(side){
  Rr(g,shade(leg,-15),x-1-sw*3,y-6,2,6);Rr(g,leg,x-1+sw*3,y-6,2,6);Rr(g,'#222',x-1+sw*3+(dr>0?1:0),y-1,2,1);
  Rr(g,o.shirt,x-3,by-14,6,9);Rr(g,shade(o.shirt,-28),x+dr*(1+(o.work?wk*3:-sw*3)),by-13-(o.work?2:0),2,7);
  Rr(g,skin,x-3,by-20,6,6);Rr(g,'#222',x+(dr>0?1:-2),by-17,1,1);
  Rr(g,o.hair,x-4,by-22,8,3);if(o.g==='f'){Rr(g,o.hair,x-(dr>0?4:-1)-(dr>0?0:0)-1+(dr>0?0:1),by-19,2,8)}
 }else{
  Rr(g,leg,x-3,y-6,2,6-Math.max(0,sw)*2);Rr(g,leg,x+1,y-6,2,6-Math.max(0,-sw)*2);Rr(g,'#222',x-3,y-1,3,1);Rr(g,'#222',x+1,y-1,3,1);
  Rr(g,o.shirt,x-4,by-14,8,9);Rr(g,shade(o.shirt,-28),x-5,by-13+(o.work?wk*3-2:sw*1.6),1,7);Rr(g,shade(o.shirt,-28),x+4,by-13+(o.work?-wk*3-2:-sw*1.6),1,7);
  Rr(g,skin,x-3,by-20,6,6);Rr(g,o.hair,x-4,by-22,8,3);if(o.g==='f'){Rr(g,o.hair,x-5,by-20,2,8);Rr(g,o.hair,x+3,by-20,2,8)}
  if(o.dir===0){Rr(g,'#222',x-2,by-17,1,1);Rr(g,'#222',x+1,by-17,1,1)}else Rr(g,o.hair,x-3,by-20,6,5);
 }
 if(o.hat)Rr(g,o.hat,x-6,by-23,12,2),Rr(g,shade(o.hat,-20),x-3,by-26,6,3);
 if(o.tool&&o.work){Rr(g,'#5a3a22',x+dr*5,by-14+wk*3,1,9);Rr(g,'#aaa',x+dr*4,by-6+wk*3,3,1)}
}
const inPast=(x,y)=>x>PAS.x*TS&&x<(PAS.x+pasW())*TS&&y>PAS.y*TS&&y<(PAS.y+PAS.h)*TS;
const HOME={x:8*TS+8,y:46*TS+6},ROADY=47*TS+10;
function buildRoute(o,tx,ty){
 const a=inPast(o.x,o.y),b=inPast(tx,ty),r=[];
 if(o.y<46*TS-4&&!a)r.push([o.x,ROADY]);
 else if(!a&&!b&&o.y>46*TS-4&&o.y<ROADY+30&&ty>ROADY+40&&tx>12*TS&&!(tx>56*TS&&tx<62*TS))r.push([o.x,ROADY]);
 if(a&&!b){r.push([11*TS,912],[152,912])}
 else if(!a&&b){if(Math.abs(o.x-152)>8||o.y<900)r.push([152,Math.max(o.y,ROADY)],[152,912]);r.push([11*TS,912])}
 else if(!a&&!b&&ty<44*TS&&tx>20*TS)r.push([tx,ROADY]);
 else if(!a&&!b&&tx>48*TS&&tx<58*TS&&ty>56*TS){r.push([60*TS-4,ROADY],[60*TS-4,ty])}
 r.push([tx,ty]);return r;
}
function wkStep(o,dt,spd){
 if(!o.route||!o.route.length)return true;
 const p=o.route[0],dx=p[0]-o.x,dy=p[1]-o.y,d=Math.hypot(dx,dy);
 if(d<3){o.route.shift();o.stuck=0;return !o.route.length}
 const nx=o.x+dx/d*spd*dt,ny=o.y+dy/d*spd*dt;let mv=0;
 if(!solidAt(nx,o.y-1)){o.x=nx;mv=1}if(!solidAt(o.x,ny-1)){o.y=ny;mv=1}
 if(mv){o.stuck=0;o.mv=1;o.ph+=spd*dt*.135;if(Math.abs(dx)>Math.abs(dy)*1.1)o.dir=dx>0?3:2;else o.dir=dy>0?0:1}
 else{o.stuck=(o.stuck||0)+dt;if(o.stuck>1.2){o.x=p[0];o.y=p[1];o.stuck=0}}
 return false;
}
const mkW=(x,y,extra)=>Object.assign({x,y,dir:0,ph:0,mv:0,st:'idle',t:0,route:[],stuck:0,vis:false,job:null,wait:2,work:0},extra);
// ---- parceiro(a)
const MATE=mkW(HOME.x,HOME.y,{spotT:15,healCd:0,spot:null});
const MATE_MODES={auto:['Automático','Cuida de tudo: gado, lavoura e galinhas'],cattle:['Gado','Alimenta o cocho e trata animais doentes'],crops:['Lavoura','Planta, rega e colhe'],chickens:['Galinhas','Recolhe ovos'],follow:['Me acompanhar','Te segue, avista animais, cura você e te protege'],guard:['Vigiar à noite','Fica de guarda e rende ladrões'],rest:['Descansar em casa','Cozinha marmitas (cura vida)']};
const MATEL={f:{n:'Lia',shirt:'#c8506a',hair:'#5a3422',hat:'#e0c070'},m:{n:'Rafa',shirt:'#4a7a9a',hair:'#3a2a1a',hat:'#c8a060'}};
function mateJob(){
 const m=S.mate.task;if(m==='follow'||m==='guard'||m==='rest')return null;
 const cat=m==='auto'||m==='cattle',cr=m==='auto'||m==='crops',ch=m==='auto'||m==='chickens',c=[];
 if(cat){
  if(S.feed<siloCap()*.4&&S.money>3000)c.push({k:'feed',x:TROUGH.x+24,y:TROUGH.y+16});
  const a=S.herd.find(a=>a.sick&&!a.led&&a.stall==null&&!a.lead);if(a){const s=spriteOf(a);c.push({k:'treat',a,x:s.x+8,y:s.y+10})}
 }
 if(cr){
  const fr=fieldRect();let best=null;
  for(const q of S.crops){if(cropStage(q)>=3){best={k:'harvest',c:q,x:q.x*TS+8,y:q.y*TS+14};break}}
  if(!best&&!S.up.irrig&&S.weather!=='chuva')for(const q of S.crops){if(!q.w){best={k:'water',c:q,x:q.x*TS+8,y:q.y*TS+14};break}}
  if(!best&&hasItem('seed_'+S.selSeed,1)&&CROPS[S.selSeed].lv<=LV()){for(let ty=fr[1];ty<=fr[3]&&!best;ty++)for(let tx=fr[0];tx<=fr[2];tx++)if(!cropAt(tx,ty)){best={k:'plant',tx,ty,x:tx*TS+8,y:ty*TS+14};break}}
  if(best)c.push(best);
 }
 if(ch&&S.chk.eggs>=3&&S.up.coop>0)c.push({k:'eggs',x:53*TS+16,y:59*TS+10});
 return c.length?pick(c):null;
}
function mateDo(j){
 const nm=S.mate.name;
 if(j.k==='feed'){const kg=Math.min(800,siloCap()-Math.floor(S.feed));if(kg>0){buyFeed(kg);toast('🌾 '+nm+' abasteceu o cocho')}}
 else if(j.k==='treat'){if(j.a&&j.a.sick)treat(j.a,1)}
 else if(j.k==='harvest'){const c=j.c;if(S.crops.includes(c)&&addItem(c.c,cropYield(c))){gainXP(CROPS[c.c].xp,'colheita');S.crops.splice(S.crops.indexOf(c),1);CMAP.delete(c.y*MW+c.x)}}
 else if(j.k==='water'){if(j.c)j.c.w=1}
 else if(j.k==='plant'){const sd='seed_'+S.selSeed;if(!cropAt(j.tx,j.ty)&&takeItem(sd,1)){const n={x:j.tx,y:j.ty,c:S.selSeed,age:0,w:0};S.crops.push(n);CMAP.set(j.ty*MW+j.tx,n)}}
 else if(j.k==='eggs'){const n=S.chk.eggs;if(n){const a=addItem('ovo',n);S.chk.eggs-=a}}
}
function stepMate(dt){
 if(!S.mate){MATE.vis=false;return}
 const h=dayHour(),L=MATEL[S.mate.g],mode=S.mate.task,night=h>=21.5||h<6.5;
 const stayOut=mode==='guard'||mode==='follow';
 if(night&&!stayOut){if(MATE.vis){MATE.vis=false;MATE.x=HOME.x;MATE.y=HOME.y;MATE.route=[];MATE.job=null}return}
 if(!MATE.vis){MATE.vis=true;MATE.x=HOME.x;MATE.y=HOME.y;MATE.st='idle';MATE.wait=1}
 MATE.mv=0;MATE.work=0;MATE.healCd=Math.max(0,MATE.healCd-dt);
 if(mode==='follow'){
  const dx=P.x-MATE.x,dy=P.y-MATE.y,d=Math.hypot(dx,dy);
  if(d>200){MATE.x=P.x-20;MATE.y=P.y}
  else if(d>28){MATE.route=[[P.x-dx/d*20,P.y-dy/d*20]];wkStep(MATE,dt,d>90?P.run?120:100:62)}
  MATE.spotT-=dt;
  if(MATE.spotT<=0){MATE.spotT=22;let best=null,bd=300;for(const a of WILD){if(a.st==='dead'||a.st==='flee')continue;const dd=Math.hypot(a.x-MATE.x,a.y-MATE.y);if(dd<bd){bd=dd;best=a}}
   if(best){MATE.spot={a:best,t:8};const ang=Math.atan2(best.y-P.y,best.x-P.x),dir=Math.abs(Math.cos(ang))>Math.abs(Math.sin(ang))?(Math.cos(ang)>0?'leste':'oeste'):(Math.sin(ang)>0?'sul':'norte');toast('👀 '+S.mate.name+' avistou um(a) '+SPECIES[best.sp].n+' a '+Math.round(bd/TS)+' m ao '+dir,'good')}}
  if(MATE.spot){MATE.spot.t-=dt;if(MATE.spot.t<=0||!WILD.includes(MATE.spot.a)||MATE.spot.a.st==='dead')MATE.spot=null}
  if(P.hp<45&&MATE.healCd<=0){MATE.healCd=90;P.hp=Math.min(100,P.hp+30);toast('💕 '+S.mate.name+' cuidou de você (+30 vida)','good')}
 }
 const thief=THV.find(t=>thActive(t)&&!t.camp&&Math.hypot(t.x-MATE.x,t.y-MATE.y)<500);
 if((mode==='guard'||mode==='auto')&&thief){
  MATE.route=[[thief.x,thief.y]];wkStep(MATE,dt,95);
  if(Math.hypot(thief.x-MATE.x,thief.y-MATE.y)<14&&Math.random()<dt*1.4)thiefDown(thief,S.mate.name);
  return;
 }
 if(mode==='guard'){
  MATE.wait-=dt;if(!MATE.route.length&&MATE.wait<=0){MATE.wait=rnd(3,7);MATE.route=[[rnd(8,26)*TS,rnd(52,60)*TS]]}wkStep(MATE,dt,36);return;
 }
 if(mode==='follow')return;
 if(MATE.st==='work'){MATE.work=1;MATE.t-=dt;if(MATE.t<=0){mateDo(MATE.job);MATE.job=null;MATE.st='idle';MATE.wait=.6}return}
 if(MATE.st==='go'){if(wkStep(MATE,dt,68)){MATE.st='work';MATE.t=1.3}return}
 MATE.wait-=dt;
 if(MATE.wait<=0){
  const j=mateJob();
  if(j){MATE.job=j;MATE.route=buildRoute(MATE,j.x,j.y);MATE.st='go'}
  else{MATE.wait=3;if(Math.hypot(MATE.x-10*TS,MATE.y-48*TS)>30){MATE.route=buildRoute(MATE,rnd(9,11)*TS,48*TS);MATE.st='go';MATE.job={k:'idle'}}}
 }
}
function drawMate(g){
 const L=MATEL[S.mate.g];
 drawPerson(g,{x:MATE.x,y:MATE.y,dir:MATE.dir,ph:MATE.ph,mv:MATE.mv,shirt:L.shirt,hair:L.hair,hat:L.hat,g:S.mate.g,work:MATE.work,tool:1});
 if(MATE.spot&&MATE.spot.a.st!=='dead'){const a=MATE.spot.a;Rr(g,'#ffd75e',a.x-2,a.y-30-((frame>>3)&1)*2,4,4);Rr(g,'#ffd75e',a.x-1,a.y-26,2,3)}
 if(S.mate.task==='guard'&&daylight()<.3)Rr(g,'#ffd75e',MATE.x+4,MATE.y-18,2,2);
}
function mateModal(){
 if(!S.mate)return;reModal=mateModal;const n=S.mate.name;
 showModal('<h3>'+(S.mate.g==='f'?'👩':'👨')+' '+n+' <span class="dim">· mora com você</span></h3><div class="card">“O que você precisa que eu faça hoje?”<div class="dim">Tarefa atual: <b class="gold">'+MATE_MODES[S.mate.task][0]+'</b></div></div>'
  +Object.keys(MATE_MODES).map(k=>'<div class="card '+(S.mate.task===k?'sel':'')+'"><div class="row"><b>'+MATE_MODES[k][0]+'</b><button class="b '+(S.mate.task===k?'gray':'gold')+'" data-act="matecmd" data-v="'+k+'">'+(S.mate.task===k?'Em andamento':'Pedir')+'</button></div><div class="dim">'+MATE_MODES[k][1]+'</div></div>').join('')
  +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
Object.assign(ACT,{
 matecmd(e){S.mate.task=e.v;MATE.route=[];MATE.st='idle';MATE.job=null;MATE.wait=.5;toast('💬 '+S.mate.name+': "'+['Pode deixar!','Já estou indo!','Deixa comigo.'][ri(0,2)]+'"','good')},
 matejoin(e){if(S.mate)return;S.mate={g:e.v,name:MATEL[e.v].n,task:'auto'};MATE.x=HOME.x;MATE.y=HOME.y;toast('💕 '+S.mate.name+' agora mora com você! Fale com '+(e.v==='f'?'ela':'ele')+' (tecla T) para dar ordens.','good');hideModal()}
});
const _sleepModal=sleepModal;
sleepModal=function(){
 _sleepModal();if(S.mate||LV()<3)return;const last=$('mbox').lastElementChild;if(!last)return;
 last.insertAdjacentHTML('beforebegin','<div class="card"><b>💕 Companhia</b><div class="dim">Convide alguém para morar com você e ajudar na fazenda: cuida do gado, da lavoura e das galinhas, vigia à noite e te acompanha na caça.</div><div class="btns"><button class="b gold" data-act="matejoin" data-v="f">Convidar Lia</button><button class="b gold" data-act="matejoin" data-v="m">Convidar Rafa</button></div></div>');
};
const _il2=interactList;
interactList=function(){const L=_il2();if(S.mate&&MATE.vis)L.push({x:MATE.x,y:MATE.y,r:24,label:'Falar com '+S.mate.name+' (comandos)',fn:mateModal});return L};
const _hd5=hookDay;
hookDay=function(){_hd5();if(S.mate){const n=S.mate.task==='rest'?3:1;addItem('marmita',n);if(S.mate.task==='rest')toast('🍱 '+S.mate.name+' preparou marmitas')}};
// ---- peão visível
const PEON=mkW(18*TS,47*TS,{});
function stepPeon(dt){
 if(!S.up.peao){PEON.vis=false;return}
 const h=dayHour();if(h<6.5||h>18.5){PEON.vis=false;PEON.x=17*TS+8;PEON.y=46*TS+4;PEON.route=[];PEON.st='idle';return}
 if(!PEON.vis){PEON.vis=true;PEON.x=17*TS+8;PEON.y=46*TS+4;PEON.wait=1}
 PEON.mv=0;PEON.work=0;
 if(PEON.st==='work'){PEON.work=1;PEON.t-=dt;if(PEON.t<=0){PEON.st='idle';PEON.wait=rnd(1,3)}return}
 if(PEON.st==='go'){if(wkStep(PEON,dt,40)){PEON.st='work';PEON.t=rnd(2.5,4.5)}return}
 PEON.wait-=dt;if(PEON.wait>0)return;
 const opts=[()=>[TROUGH.x+rnd(8,40),TROUGH.y+16],()=>{const a=pick(S.herd);if(!a)return null;const s=spriteOf(a);return[s.x+8,s.y+12]},()=>{const f=fieldRect();return[rnd(f[0],f[2]+1)*TS,(f[3]+1)*TS+6]},()=>[17*TS+8,46*TS+4],()=>[53*TS+16,59*TS+10]];
 const t=pick(opts)();if(!t){PEON.wait=2;return}
 PEON.route=buildRoute(PEON,t[0],t[1]);PEON.st='go';
}
function drawPeon(g){drawPerson(g,{x:PEON.x,y:PEON.y,dir:PEON.dir,ph:PEON.ph,mv:PEON.mv,shirt:'#a0482a',pants:'#3a4a6a',hair:'#2a1a10',hat:'#d8c080',work:PEON.work,tool:1,g:'m'})}
function workerItems(L){
 if(S.mate&&MATE.vis)L.push([MATE.y,11,{draw:drawMate}]);
 if(S.up.peao&&PEON.vis)L.push([PEON.y,11,{draw:drawPeon}]);
}
const _upd3=update;
update=function(dt){_upd3(dt);stepMate(dt);stepPeon(dt)};
// ---- casas personalizadas
function smoke(g,sx,sy){for(let i=0;i<4;i++)Rr(g,'rgba(225,225,225,'+(.55-i*.12).toFixed(2)+')',sx+Math.sin(frame/18+i)*2+i,sy-i*5-((frame>>3)%5),3+i,3+i)}
function bldExtra(g,b){
 const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,dx=b.door*TS-x,D=(c,a,bb,ww,hh)=>Rr(g,c,x+a,y+bb,ww,hh),id=b.id;
 const wins=[];for(let wx=8;wx<w-14;wx+=24)if(Math.abs(wx-dx)>20)wins.push(wx);
 if(id==='house'){
  const L=LV();
  if(L>=3)wins.forEach((wx,i)=>{D('#6a4a2a',wx-1,h-20,15,3);for(let k=0;k<5;k++)D(['#d84a5a','#f0d040','#e87ab0','#fff','#d84a5a'][k],wx+k*3,h-23+(k&1),2,3)});
  if(L>=3){D('#2a5a8a',dx-3,h-34,3,24);D('#2a5a8a',dx+16,h-34,3,24)}
  if(L>=5){D('rgba(255,255,255,.10)',0,14,w,h-14);D('#9a3a2a',w-18,-6,7,14);smoke(g,x+w-15,y-6);D('#5a3a22',dx-6,h-1,28,3);for(let i=0;i<4;i++)D('#8a5a2a',dx-6+i*9,10+14-14+ (h-34)+10,2,16)}
  if(L>=8){D('#e8d8b0',w,h-34,30,34);D('#7a3a2a',w-2,h-38,34,6);D('#3a2a1a',w+5,h-24,20,24);D('#6a6a72',w+6,h-23,18,22);for(let i=0;i<6;i++)D('#4a4a52',w+6,h-23+i*4,18,1);for(let i=0;i<4;i++)for(let j=0;j<2;j++){D('#2a4a8a',14+i*12,3+j*5,10,4);D('#7aa0d0',14+i*12,3+j*5,10,1)}D('#ccc',w-12,-9,1,5);D('#ddd',w-14,-11,5,2)}
  if(L>=12){D('#8a8a92',0,h-8,w,8);for(let i=0;i<w;i+=8)D('#6a6a72',i,h-8,1,8);D('#e8d8b0',20,-4,16,12);D('#9ad8f5',23,-1,10,6);D('#7a3a2a',17,-6,22,3);D('#ffd75e',w/2-4,14,8,2)}
 }else if(id==='barn'){
  D('#5a2a22',dx-10,18,36,2);D('#3a2616',dx-8,-2,6,6);D('#d8b04a',dx+8,-6,2,6);D('#d8b04a',dx+4,-4,10,1);if(frame%80<40)D('#d8b04a',dx+14,-5,2,2);
  if(S.up.silo>=1){for(let i=0;i<3;i++){D('#d8b04a',-10+i*6,h-5,6,5);D('#a8832a',-10+i*6,h-5,6,1)}}
  if(S.up.land>=2){D('#8a2a22',w,h-26,16,26);D('#5a2a22',w-2,h-30,20,6);D('#2a1a10',w+4,h-16,8,16)}
  if(S.up.peao){D('#ffd75e',dx+20,h-18,2,3);D('#5a3a22',dx+20,h-21,2,3)}
 }else if(id==='leilao'){
  ['#d83a2a','#f0d040','#2a8a3a'].forEach((c,i)=>{D('#5a3a22',8+i*26,-14,1,16);D(c,9+i*26,-14,7+((frame>>4)&1),5)});
  D('#fff',0,22,3,h-22);D('#fff',w-3,22,3,h-22);D('#fff',-2,20,7,2);D('#fff',w-5,20,7,2);D('#8a8a8a',dx-4,h,24,2);D('#7a7a7a',dx-6,h+2,28,2);D('#5a3a22',w/2-2,2,4,3);D('#8a5a2a',w/2-5,0,10,3);
 }else if(id==='banco'){
  D('#e8e8ee',2,22,4,h-22);D('#e8e8ee',w-6,22,4,h-22);D('#c8c8d0',0,18,8,3);D('#c8c8d0',w-8,18,8,3);D('#d8b04a',dx+2,-1,12,3);D('#2a5a3a',-2,h-34,w+4,3);for(let i=0;i<w;i+=6)D(i%12?'#fff':'#2a5a3a',i-2,h-31,6,4);D('#3a3a42',w-1,h-20,5,12);D('#2a8a3a',w,h-18,3,3);
 }else if(id==='agro'){
  for(let i=0;i<3;i++)D('#d8c090',-12+(i%2)*2,h-8-i*7,10,7),D('#8a6a3a',-10+(i%2)*2,h-6-i*7,6,2);
  D('#6a4a2a',w+2,h-10,8,10);D('#3a2616',w+2,h-10,8,2);D('#6a4a2a',w+11,h-8,8,8);D('#2a8a3a',-2,h-34,w+4,3);for(let i=0;i<w;i+=8)D(i%16?'#fff':'#2a8a3a',i-2,h-31,8,4);
  D('#222',w+14,h-4,5,5);D('#555',w+15,h-3,3,3);D('#8a6a3a',w+8,h-12,10,3);
 }else if(id==='delegacia'){
  D('#5a3a22',w-4,-18,2,22);D('#2a8a3a',w-2,-18,9+((frame>>4)&1),6);D('#ffd75e',w+1,-16,3,2);
  D('#ffd75e',w/2-3,24,6,6);D('#222',8,h-31,13,2);for(let i=0;i<4;i++)D('#444',10+i*3,h-31,1,10);D('#d83a2a',-1,h-20,3,3);D('#2a3aea',w-2,h-20,3,3);
 }else if(id==='padaria'){
  D('#a8502a',w-12,-6,6,12);smoke(g,x+w-9,y-6);
  for(let i=0;i<w+4;i+=6)D(i%12?'#fff':'#d83a2a',i-2,h-34,6,6);D('#d83a2a',-2,h-35,w+4,2);
  D('#8a5a2a',-12,h-12,10,2);D('#8a5a2a',-11,h-10,2,10);D('#8a5a2a',-4,h-10,2,10);D('#d8b04a',-10,h-14,6,2);D('#e8c070',w+4,h-8,8,8);D('#a8702a',w+5,h-9,6,2);
 }else if(id==='vet'){
  D('#fff',w/2-6,18,12,12);D('#2a9a5a',w/2-1,19,2,10);D('#2a9a5a',w/2-5,23,10,2);D('#5a3a22',-10,h-10,8,2);D('#5a3a22',-10,h-8,2,8);D('#5a3a22',-4,h-8,2,8);D('#e8c070',-8,h-14,3,4);D('#fff',dx+2,h+2,12,2);
 }else if(id==='canil'){
  D('#fff',w/2-5,19,10,4);D('#fff',w/2-6,21,3,3);D('#fff',w/2+3,21,3,3);D('#c8a070',-12,h-8,10,8);D('#8a5a2a',-12,h-10,10,3);D('#222',-9,h-5,4,5);D('#e8e8e8',w+4,h-3,6,2);D('#d84a2a',w+5,h-4,4,1);D('#5a3a22',w+14,h-8,1,8);
 }else if(id==='igreja'){
  D(shade(b.wall,-10),w/2-9,-30,18,32);for(let r=0;r<6;r++)D(b.roof,w/2-11+r,-38+r,22-r*2,1);D('#ffd75e',w/2-1,-46,2,10);D('#ffd75e',w/2-4,-43,8,2);D('#2a2a2a',w/2-3,-24,6,10);D('#d8b04a',w/2-2,-20,4,5);
  D('#d84a5a',dx+3,h-30,4,8);D('#4a7ad8',dx+7,h-30,4,8);D('#f0d040',dx+11,h-30,4,8);D('#8a8a8a',dx-4,h,24,2);
 }else if(id==='h1'){
  D('#9a3a2a',w-12,-5,6,10);smoke(g,x+w-9,y-5);for(let i=0;i<w;i+=6)D('#8a5a2a',i,h+1,3,5),D('#8a5a2a',0,h+3,w,1);for(let i=0;i<8;i++)D(['#d84a5a','#f0d040','#e87ab0'][i%3],4+i*11,h-2,3,3);
 }else if(id==='h2'){
  D('#e8d8b0',dx-8,h-8,32,2);D('#7a5a3a',dx-8,h-34,2,28);D('#7a5a3a',dx+22,h-34,2,28);D('#5a3a22',dx-9,h-36,35,3);D('#8a6a3a',dx-4,h-12,10,2);D('#ccc',w-10,-8,1,6);D('#ddd',w-13,-10,6,3);D('#6a8a4a',-6,h-8,4,8);
 }else if(id==='h3'){
  for(let i=0;i<5;i++)D('#4a3220',w+4,h-20+i*4,18,2),D('#5ac04a',w+5+i*3,h-21+i*4,3,3);D('#6a4a2a',w+22,h-24,1,12);D('#d8b04a',w+19,h-24,7,2);D('#c89050',w+20,h-28,5,4);D('#fff',-6,h-4,4,3);D('#2a2a2a',-3,h-1,2,1);
 }else if(id==='h4'){
  D('#3a8a4a',-8,h-12,10,10);D('#2a6a3a',-6,h-16,6,6);D('#5a3a22',-4,h-4,2,6);for(let i=0;i<3;i++)for(let j=0;j<2;j++){D('#2a4a8a',16+i*13,3+j*5,11,4);D('#7aa0d0',16+i*13,3+j*5,11,1)}D('#222',w+4,h-2,6,6);D('#222',w+12,h-2,6,6);D('#bbb',w+6,h-7,10,2);
 }else if(id==='lodge'){
  D('#e8dcc0',dx+2,6,1,5);D('#e8dcc0',dx+9,6,1,5);D('#e8dcc0',dx+1,6,10,1);D('#e8dcc0',dx-1,4,2,3);D('#e8dcc0',dx+11,4,2,3);D('#5a3a22',-12,h-10,9,3);D('#5a3a22',-11,h-7,9,3);D('#4a2a12',-12,h-4,9,3);
  D('#ffd75e',w-3,h-22,3,5);D('#8a5a2a',w-3,h-24,3,2);
 }else if(id==='posto'){
  D('#5a3a22',-10,h-16,2,16);D('#5a3a22',-10,h-16,12,2);D('#6a4a3a',-8,h-14,8,10);D('#3a2a1a',-6,h-8,4,4);D('#8a5a2a',w+3,h-8,9,8);D('#5a3a22',w+3,h-10,9,2);D('#ffd75e',w-3,h-22,3,5);
 }else if(id==='pescador'){
  D('#8a7a5a',w+2,h-16,2,16);D('#8a7a5a',w+14,h-16,2,16);D('#a89868',w+2,h-16,14,1);for(let i=0;i<3;i++){D('#9ab0c0',w+4+i*4,h-14,3,6);D('#fff',w+5+i*4,h-13,1,1)}
  D('#7a4a2a',-16,h-5,15,5);D('#5a3a22',-16,h-5,15,1);D('#ddd',-9,h-9,1,5);D('#d84a2a',-4,h-7,3,3);D('#d8d8d8',dx+3,h-30,3,10);
 }
}
const _db=drawBuilding;
drawBuilding=function(g,b){_db(g,b);bldExtra(g,b)};
// ---- fazenda que evolui
function fenceStyle(){const l=S.up.land;return l>=4?{r:'#f0ece0',p:'#8a8a92',base:1}:l>=2?{r:'#e8e4d8',p:'#c8c0a8'}:{r:'#8a6a42',p:'#5a3a22'}}
function lampPos(){
 if(!S.up||!S.up.light)return[];const xs=[9,17,25,33,41,49,57,65,73,81,89],n=S.up.light>=2?xs.length:5;
 return xs.slice(0,n).map(v=>({x:v*TS+4,y:46*TS+13}));
}
function drawTractor(g,x,y){
 Rr(g,'rgba(0,0,0,.25)',x-14,y-1,30,3);Rr(g,'#c8a02a',x-12,y-14,22,8);Rr(g,'#2a5a2a',x-3,y-23,11,10);Rr(g,'#9ad8f5',x-1,y-21,7,6);Rr(g,'#222',x-12,y-22,2,8);Rr(g,'#444',x+6,y-13,9,9);Rr(g,'#888',x+9,y-10,3,3);Rr(g,'#444',x-13,y-8,7,7);Rr(g,'#888',x-11,y-6,3,3);
 if((frame>>5)&1)Rr(g,'rgba(200,200,200,.5)',x-12,y-28,3,3);
}
function drawWindmill(g,x,y){
 Rr(g,'rgba(0,0,0,.25)',x-8,y-1,18,3);for(let i=0;i<26;i++){const wd=Math.max(2,9-i*.28);Rr(g,i%4<2?'#b8b0a0':'#a89880',x-wd/2,y-i,wd,1)}
 const a=frame/18;for(let k=0;k<4;k++){const an=a+k*Math.PI/2;for(let i=2;i<16;i++)Rr(g,'#e8e0d0',x+Math.cos(an)*i,y-27+Math.sin(an)*i,i<8?1:2,1.5)}Rr(g,'#6a6a6a',x-1,y-28,3,3);
}
function drawLab(g,x,y){
 Rr(g,'rgba(0,0,0,.25)',x+2,y+34,56,5);Rr(g,'#e8eef0',x,y+10,56,26);Rr(g,'#4a90d0',x-3,y,62,12);Rr(g,'#2a6aa0',x-3,y+11,62,2);Rr(g,'#2a2a3a',x+22,y+20,12,16);Rr(g,'#9ad8f5',x+6,y+18,11,9);Rr(g,'#9ad8f5',x+39,y+18,11,9);
 ptext(g,'GENETICA',x+12,y+3,'#fff');for(let i=0;i<6;i++){Rr(g,'#e0a431',x+20+(i&1)*3,y-8+i*1.5,2,1);Rr(g,'#6ac04a',x+23-(i&1)*3,y-8+i*1.5,2,1)}
}
function drawShed(g,x,y){
 Rr(g,'rgba(0,0,0,.25)',x+2,y+30,48,5);Rr(g,'#8a6a42',x,y+8,48,24);for(let i=0;i<48;i+=4)Rr(g,'#6a4a2a',x+i,y+8,1,24);Rr(g,'#6a3a2a',x-3,y,54,10);Rr(g,'#4a2a1a',x-3,y+9,54,2);Rr(g,'#2a1a10',x+16,y+14,16,18);Rr(g,'#5a3a22',x+18,y+16,12,16);
}
function drawBal(g,x,y){Rr(g,'rgba(0,0,0,.25)',x-14,y-1,30,3);Rr(g,'#6a6a70',x-14,y-5,28,5);Rr(g,'#9a9aa0',x-12,y-6,24,2);Rr(g,'#3a3a42',x+16,y-14,5,14);Rr(g,'#e8e8e0',x+15,y-20,8,6);Rr(g,'#222',x+17,y-18,4,2)}
function drawLamp(g,x,y){Rr(g,'#2a2a30',x-1,y-18,2,18);Rr(g,'#2a2a30',x-3,y-20,6,2);Rr(g,'#ffd75e',x-2,y-19,4,3)}
function drawGate(g){
 const x=152,y=915,st=S.up.land>=3;
 [x-2,x+30].forEach(px=>{Rr(g,st?'#8a8a92':'#5a3a22',px,y-30,6,32);if(st){Rr(g,'#6a6a72',px-1,y-32,8,3);Rr(g,'#aaa',px+1,y-26,2,6)}});
 Rr(g,st?'#6a6a72':'#4a2a12',x-4,y-34,42,4);Rr(g,'#8a5a2a',x+5,y-30,20,8);g.fillStyle='#ffd75e';g.font='5px monospace';g.fillText('BOI DE OURO',x-9,y-37);if(S.up.land>=4){Rr(g,'#ffd75e',x+13,y-40,4,3);Rr(g,'#ffd75e',x+12,y-39,6,1)}
}
function evoItems(L,x0,x1,y0,y1){
 const add=(x,y,fn)=>{if(x>x0-70&&x<x1+70&&y>y0-20&&y<y1+90)L.push([y,10,{draw:fn}])},U=S.up;
 add(160,918,drawGate);
 if(U.light)lampPos().forEach(l=>add(l.x,l.y,g=>drawLamp(g,l.x,l.y)));
 if(U.trator)add(24*TS+4,49*TS+8,g=>drawTractor(g,24*TS+4,49*TS+8));
 if(U.bal)add(20*TS,50*TS+6,g=>drawBal(g,20*TS,50*TS+6));
 if(U.ia)add(17*TS,37*TS+30,g=>drawLab(g,17*TS,36*TS));
 if(U.dep)add(8*TS+4,37*TS+30,g=>drawShed(g,8*TS+4,36*TS));
 if(U.irrig)add(5*TS,55*TS,g=>drawWindmill(g,5*TS,55*TS));
 [[18,55,2],[26,60,3],[34,54,4],[42,60,5]].forEach(t=>{if(U.land>=t[2])add(t[0]*TS,t[1]*TS,g=>drawTree(g,{x:t[0]*TS,y:t[1]*TS,k:1,s:1.1}))});
 if(LV()>=8)add(13*TS+12,46*TS+4,g=>{Rr(g,'#ccc',13*TS+11,46*TS-22,1,26);Rr(g,'#2a8a3a',13*TS+12,46*TS-22,10+((frame>>4)&1),6);Rr(g,'#ffd75e',13*TS+15,46*TS-20,4,2)});
}
function evoGround(g){
 const L=LV();
 if(L>=6){for(let x=6;x<=26;x++)for(let y=46;y<=50;y++){if(G[ti(x,y)]!==3)continue;if((x+y)%2===0)Rr(g,'rgba(160,150,130,.35)',x*TS+2,y*TS+2,6,5);else Rr(g,'rgba(120,110,95,.25)',x*TS+8,y*TS+8,6,5)}}
 const nf=Math.min(36,L*3);for(let i=0;i<nf;i++){const fx=4*TS+hs(i,1)*8.5*TS,fy=46*TS+4+hs(i,2)*TS*2.2;if(G[ti(Math.floor(fx/TS),Math.floor(fy/TS))]===3)continue;const c=['#d84a5a','#f0d040','#e87ab0','#fff','#a86ad8'][i%5];Rr(g,'#3f7a36',fx,fy+2,2,2);Rr(g,c,fx,fy,2,2)}
 if(S.up.irrig){const f=fieldRect();for(let ty=f[1];ty<=f[3];ty+=2)for(let tx=f[0];tx<=f[2];tx+=2){const sx=tx*TS+TS,sy=ty*TS+TS;Rr(g,'#5a8ac8',sx-1,sy-1,3,3);if(((frame>>3)+tx+ty)%3===0){Rr(g,'rgba(180,220,255,.55)',sx-3,sy-3,2,2);Rr(g,'rgba(180,220,255,.55)',sx+2,sy-2,2,2)}}}
 if(S.up.silo>=2)for(let i=0;i<3;i++)Rr(g,'#c9a24a',TROUGH.x+TROUGH.w+4+i*7,TROUGH.y+2,6,6);
}
const _dfs=drawFarmStatic;drawFarmStatic=function(g){_dfs(g);evoGround(g)};
function drawLights(g,ox,oy,dl){
 if(dl>.55)return;const a=clamp((.55-dl)/.35,0,1);
 g.setTransform(PS,0,0,PS,-Math.round(ox*PS),-Math.round(oy*PS));
 const gl=(x,y,r,al)=>{const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,214,110,'+al.toFixed(3)+')');gr.addColorStop(1,'rgba(255,214,110,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)};
 const x0=ox-60,x1=ox+VW+60,y0=oy-60,y1=oy+VH+60;
 for(const l of lampPos())if(l.x>x0&&l.x<x1&&l.y>y0&&l.y<y1){gl(l.x,l.y-16,34,.5*a);Rr(g,'rgba(255,240,170,'+(.8*a).toFixed(3)+')',l.x-2,l.y-18,4,3)}
 for(const b of BLD){const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS;if(x>x1||x+w<x0||y>y1||y+h<y0)continue;const dx=b.door*TS-x;
  for(let wx=8;wx<w-14;wx+=24)if(Math.abs(wx-dx)>20){gl(x+wx+6,y+h-26,16,.4*a);Rr(g,'rgba(255,215,110,'+(.75*a).toFixed(3)+')',x+wx+1,y+h-31,11,10)}}
 g.setTransform(PS,0,0,PS,0,0);
}
