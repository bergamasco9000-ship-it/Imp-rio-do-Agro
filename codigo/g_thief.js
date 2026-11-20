// ===== Ladrões refeitos: quadrilha de caminhonete, corte de cerca, laço, confronto e prisão, esconderijo, defesas =====
const TROAD={x:-1.5*TS,y:66.5*TS},TPARK={x:5*TS,y:66.5*TS};
const THC=[['#2a2a30','#1a1a1e'],['#3a3226','#262018'],['#2a3442','#1a222c'],['#3a2a2a','#221818'],['#30362a','#1e221a']];
const THN=['Tonhão','Ligeirinho','Zé Mudo','Galego','Bigode','Corisco','Neném','Cabeça','Tatu','Gato'];
function ensureThf(){if(!S.thf)S.thf={cuts:[],stash:[],clue:0,camp:null,gang:0,trk:null,cuffs:2,def:{},boss:0,rec:0,fence:0};const T=S.thf;if(!T.def)T.def={};return T}
const TD=k=>!!(S.thf&&S.thf.def[k]);
let TRK=null;const TSHOT=[];
// ---------- chance de roubo à noite (com as defesas)
nightRoll=function(){
 const herd=S.herd.length;let p=clamp(.04+.005*LV()+.0007*herd+.002*(S.chk?S.chk.n:0),0,.3)*(1-.25*(S.up.cerca||0))*(1-.3*guardScore()/100)*(1-.2*(S.up.light||0));
 if(S.patrol)p*=.6;if(TD('vigia'))p*=.55;if(TD('alarme'))p*=.75;if(TD('holofote'))p*=.75;if(TD('cadeado'))p*=.85;if(TD('caes'))p*=1-.35*guardScore()/100;
 return Math.random()<p;
};
const gangChance=()=>LV()>=4&&S.herd.length>=8?clamp(.35+.04*LV()+.1*((S.thf&&S.thf.gang)||0),0,.85):0;
const armedChance=()=>clamp(.12+.04*LV()+.08*((S.thf&&S.thf.gang)||0),.12,.6);
let thId=0;function mkThief(o){const c=pick(THC);return Object.assign({id:++thId,x:TPARK.x,y:TPARK.y,st:'go',hp:2,hpM:2,loot:0,cow:null,spd:42,seen:false,ex:TROAD.x,ey:TROAD.y,cd:0,col:c[0],pants:c[1],dir:3,ph:0,mv:0,light:1,armed:Math.random()<armedChance(),nm:pick(THN),aimT:0,shCd:rnd(1,2),alert:0,t:0,path:null,pi:0},o)}
// ---------- cerca: escolher ponto de corte e aplicar cortes
function pasRect(){const w=pasW();return{x0:PAS.x,y0:PAS.y,x1:PAS.x+w-1,y1:PAS.y+PAS.h-1}}
function pickCut(cow){const r=pasRect(),s=cow?spriteOf(cow):null,cy=s?Math.floor((s.y+8)/TS):58,cx=s?Math.floor((s.x+8)/TS):r.x0+3;const C=[];
 for(let y=r.y0+1;y<r.y1;y++)if(y!==56&&y!==57)C.push({x:r.x0,y,ox:r.x0-1,oy:y,d:Math.abs(y-cy)+Math.abs(r.x0-cx)*.6});
 for(let x=r.x0+1;x<Math.min(r.x1,r.x0+12);x++)if(!(x>=CUR.x0-1&&x<=CUR.x1+1&&S.up.curral))C.push({x,y:r.y1,ox:x,oy:r.y1+1,d:Math.abs(x-cx)+Math.abs(r.y1-cy)*.6+2});
 C.sort((a,b)=>a.d-b.d);for(const c of C.slice(0,6))if(WALK(c.ox,c.oy))return c;return C[0]}
function applyCuts(){if(!S||!S.thf)return;for(const c of S.thf.cuts)FEN[ti(c.x,c.y)]=0}
const _rbfTh=rebuildFence;rebuildFence=function(){_rbfTh();applyCuts()};
function cutFence(c){const T=ensureThf();if(!T.cuts.some(q=>q.x===c.x&&q.y===c.y))T.cuts.push({x:c.x,y:c.y,d:S.day});FEN[ti(c.x,c.y)]=0;
 if(TD('alarme')){sirenSnd();tt('alarm','🚨 ALARME! A cerca do pasto foi cortada!','bad',4);S.thiefSeen=1;THV.forEach(t=>t.seen=true)}}
function repairCut(c){const T=ensureThf();T.cuts=T.cuts.filter(q=>q!==c);FEN[ti(c.x,c.y)]=1;try{tick(2)}catch(e){}}
// ---------- sons
function sirenSnd(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';for(let i=0;i<6;i++){o.frequency.setValueAtTime(600,t+i*.4);o.frequency.linearRampToValueAtTime(950,t+i*.4+.2);o.frequency.linearRampToValueAtTime(600,t+i*.4+.4)}g.gain.setValueAtTime(.035,t);g.gain.setValueAtTime(.0001,t+2.4);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+2.4)}catch(e){}}
function whistleSnd(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(1800,t);o.frequency.linearRampToValueAtTime(2600,t+.15);o.frequency.linearRampToValueAtTime(1700,t+.35);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.4);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.4)}catch(e){}}
function gunSnd(){try{snd('shot')}catch(e){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,b=AC.createBufferSource(),buf=AC.createBuffer(1,AC.sampleRate*.2,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);b.buffer=buf;const g=AC.createGain();g.gain.value=.25;b.connect(g);g.connect(AC.destination);b.start(t)}catch(e2){}}}
// ---------- chegada dos ladrões
spawnThief=function(){
 const T=ensureThf(),useChk=S.up.coop>0&&S.chk.n>0&&(S.herd.length===0||Math.random()<.35);
 if(!useChk&&!S.herd.length)return;
 const gang=!useChk&&Math.random()<gangChance();
 if(gang){const n=Math.random()<.5?2:3;TRK={x:TROAD.x-60,y:TROAD.y,st:'arrive',dir:1,col:pick(['#3a4a3a','#5a2a24','#2a3a5a','#4a4a4a']),flat:0,cows:[],t:0,lights:0};
  const roles=n===3?['vigia','corta','laca']:['corta','laca'];roles.forEach((r,i)=>THV.push(mkThief({role:r,st:'ride',x:TRK.x,y:TRK.y,hp:2,hpM:2,armed:r==='vigia'||Math.random()<armedChance()})));
  if(TD('caes')&&guardScore()>=30){S.thiefSeen=1;toast('🐕 Os cães estão latindo muito pro lado da trilha velha...','bad')}}
 else THV.push(mkThief({role:useChk?'galinha':'solo',tgt:useChk?'chk':'cow',x:TROAD.x,y:TROAD.y,st:'go'}));
 if(TD('vigia'))VG.alert=0;
 const gs=guardScore();if(gs>=30||S.up.light){S.thiefSeen=1;THV.forEach(t=>t.seen=true);if(!gang)toast('🐕 Latidos na fazenda! Alguém está rondando...','bad')}
};
// ---------- utilidades de movimento
function thMove(t,tx,ty,spd,dt,usePath){
 if(usePath){if(!t.path||t.ptx!==tx||t.pty!==ty){t.path=findPath(t.x,t.y,tx,ty)||[[tx,ty]];t.pi=0;t.ptx=tx;t.pty=ty}
  let p=t.path[t.pi];if(p&&Math.hypot(p[0]-t.x,p[1]-t.y)<4&&t.pi<t.path.length-1){t.pi++;p=t.path[t.pi]}if(!p)p=[tx,ty];if(t.pi>=t.path.length-1&&Math.hypot(p[0]-t.x,p[1]-t.y)<4)p=[tx,ty];tx=p[0];ty=p[1]}
 const dx=tx-t.x,dy=ty-t.y,d=Math.hypot(dx,dy);if(d<1.5){t.mv=0;return true}
 const s=Math.min(d,spd*dt);t.x+=dx/d*s;t.y+=dy/d*s;t.mv=1;t.ph+=s*.14;t.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1);return false}
function cowBack(c){if(!c||!S.herd.includes(c))return;c.led=0;const s=spriteOf(c),b=pasBounds();s.x=rnd(b.x0,b.x1);s.y=rnd(b.y0,b.y1);s.go=0;s.wait=rnd(1,3)}
releaseLoot=function(t){if(t.cow){const c=t.cow;t.cow=null;cowBack(c);toast('🐄 '+c.name+' ficou livre e voltou pro pasto.','good')}if(t.loot){S.chk.n+=t.loot;t.loot=0;syncCH()}};
const plVisible=t=>{const d=Math.hypot(P.x-t.x,P.y-t.y),dl=daylight(),r=(P.sneak?55:95)*(dl<.25?1:1.6)*(t.role==='vigia'?1.5:1);return d<r};
function gangFlee(why){for(const t of THV)if(thActive(t)&&!t.camp&&t.st!=='flee'){if(t.st!=='lead'||Math.random()<.6)releaseLoot(t);t.st='flee';t.path=null}if(TRK&&TRK.st==='park')TRK.st='wait';if(why)toast(why,'good')}
// ---------- tiro dos ladrões armados
function thShoot(t,dt){
 if(!t.armed||!t.alert||inRoom())return;const d=Math.hypot(P.x-t.x,P.y-t.y);if(d>130){t.aimT=0;return}
 t.shCd-=dt;if(t.shCd>0)return;t.aimT+=dt;t.dir=P.x>t.x?3:2;
 if(t.aimT>=.85){t.aimT=0;t.shCd=rnd(2.2,3.2);gunSnd();const hit=Math.random()<(P.moving?(P.sneak?.3:.42):.6)*(d<60?1.2:1);
  TSHOT.push({x0:t.x+(t.dir===3?6:-6),y0:t.y-11,x1:P.x+(hit?0:rnd(-14,14)),y1:P.y-10+(hit?0:rnd(-10,6)),t:.14});
  if(hit){const dm=ri(6,12)*(S.diff==='easy'?.6:S.diff==='real'?1.4:1);P.hp=Math.max(4,P.hp-dm);P.hurt=.6;tt('tshot','💥 O ladrão atirou em você! (-'+Math.round(dm)+' vida)','bad',1.5);if(P.hp<=8){t.st='flee';toast('🩸 Você está muito ferido! Os ladrões aproveitaram para fugir.','bad')}}}}
// ---------- IA principal
let thHour=-1,thDawn=-1;
stepThieves=function(dt){
 const hr=Math.floor(S.t*24),T=ensureThf();
 if(hr!==thHour){thHour=hr;if((hr>=22||hr<=4)&&!THV.some(t=>thActive(t)&&!t.camp)&&!TRK&&nightRoll())spawnThief();
  if(hr===6&&thDawn!==S.day){thDawn=S.day;dawnClean()}}
 stepTruck(dt);stepVigia(dt);
 for(let i=TSHOT.length-1;i>=0;i--){TSHOT[i].t-=dt;if(TSHOT[i].t<=0)TSHOT.splice(i,1)}
 for(let i=THV.length-1;i>=0;i--){const t=THV[i];t.t+=dt;
  if(t.st==='gone'){THV.splice(i,1);continue}
  if(t.camp){stepBandit(t,dt);continue}
  if(t.st==='ride'){if(TRK){t.x=TRK.x;t.y=TRK.y}continue}
  if(t.st==='down'||t.st==='surr'){t.mv=0;continue}
  if(t.st==='cuffed'){const bx=P.x-(P.dir===3?16:P.dir===2?-16:0),by=P.y-(P.dir===0?14:P.dir===1?-14:0)+2;if(Math.hypot(bx-t.x,by-t.y)>6)thMove(t,bx,by,95,dt,false);else t.mv=0;if(Math.hypot(P.x-t.x,P.y-t.y)>140){t.x=P.x-10;t.y=P.y}continue}
  if(t.heldT>0){t.heldT-=dt;t.mv=0;continue}
  const dP=Math.hypot(P.x-t.x,P.y-t.y);
  if(!t.seen&&dP<150&&!inRoom()){t.seen=true;toast('👀 Você vê um vulto de lanterna: ladrão na fazenda!','bad')}
  if(!t.alert&&!inRoom()&&plVisible(t)&&t.st!=='flee'){t.alert=1;
   if(t.role==='vigia'){whistleSnd();toast('😗 O vigia dos ladrões assobiou: “Sujou!”','bad');for(const o of THV)if(!o.camp)o.alert=1;if(!THV.some(o=>o.armed&&!o.camp))gangFlee()}
   else if(!t.armed){releaseLoot(t);t.st='flee';t.path=null}}
  if(t.alert)thShoot(t,dt);
  let spd=t.spd*(t.alert&&t.st!=='flee'?.6:1);
  switch(t.st){
   case 'go':{ // até o ponto de corte (ou galinheiro)
    if(t.role==='galinha'){if(thMove(t,53*TS+8,(RUN.y1+1)*TS+4,spd,dt,true)){const k=Math.min(S.chk.n,ri(1,3));S.chk.n-=k;t.loot=k;syncCH();S.crim.lost+=k;toast('🥷 Ladrão pegou '+k+' galinha(s)!','bad');t.st='flee';t.seen=true}break}
    if(t.role==='vigia'){if(thMove(t,TPARK.x+20,TPARK.y-26,spd,dt,true)){t.st='watch'}break}
    if(!t.cut){const leader=THV.find(o=>!o.camp&&o.cut&&o!==t);if(leader)t.cut=leader.cut;else{const c=S.herd.filter(a=>!a.led&&a.stall==null&&!a.lead);if(!c.length){t.st='flee';break}t.pick=pick(c);t.cut=pickCut(t.pick)}}
    const exist=T.cuts.find(q=>q.x===t.cut.x&&q.y===t.cut.y)||!FEN[ti(t.cut.x,t.cut.y)];
    if(thMove(t,t.cut.ox*TS+8,t.cut.oy*TS+10,spd,dt,true)){if(exist||t.role==='laca'&&THV.some(o=>o.role==='corta'&&o.st==='cut')){if(exist)t.st='enter';else t.mv=0}else{t.st='cut';t.ct=(TD('cadeado')?7:3.5)*(t.role==='solo'?1.3:1);if(TD('cadeado')&&t.role==='solo'&&Math.random()<.3){t.st='flee';toast('🔒 Um ladrão desistiu: a cerca reforçada com corrente não cedeu.','good')}}}
    break}
   case 'cut':{t.ct-=dt;t.mv=0;t.dir=t.cut.ox<t.cut.x?3:t.cut.oy>t.cut.y?1:2;if(((t.t*6)|0)%3===0&&Math.random()<.3)try{tick(5)}catch(e){}
    if(t.ct<=0){cutFence(t.cut);t.st=t.role==='corta'&&THV.some(o=>o.role==='laca'&&!o.camp)?'cover':'enter';THV.forEach(o=>{if(o.role==='laca'&&o.st==='go')o.st='enter'})}break}
   case 'cover':{thMove(t,t.cut.ox*TS+8,t.cut.oy*TS+10,spd,dt,false);if(!THV.some(o=>o.role==='laca'&&thActive(o)))t.st='flee';break}
   case 'enter':{if(!t.pick||!S.herd.includes(t.pick)||t.pick.led||t.pick.stall!=null){const c=S.herd.filter(a=>!a.led&&a.stall==null&&!a.lead);if(!c.length){t.st='flee';break}t.pick=pick(c)}
    const s=spriteOf(t.pick);s.go=0;s.wait=Math.max(s.wait,1);if(thMove(t,s.x+8+(t.x<s.x?-12:12),s.y+10,spd*.9,dt,false)){t.st='rope';t.rt=1.6;t.dir=t.x<s.x+8?3:2}break}
   case 'rope':{t.rt-=dt;t.mv=0;if(t.rt<=0){t.cow=t.pick;t.cow.led=1;toast('🥷 Laçaram '+t.cow.name+'! Estão levando pra fora da cerca.','bad');t.st='lead';t.leg=0}break}
   case 'lead':{const tg=t.leg===0?[t.cut.x*TS+8,t.cut.y*TS+10]:t.leg===1?[t.cut.ox*TS+8,t.cut.oy*TS+10]:[TRK&&TRK.st!=='gone'?TRK.x-(TRK.dir>0?30:-30):TROAD.x,TRK?TRK.y+6:TROAD.y];
    if(thMove(t,tg[0],tg[1],spd*.75,dt,t.leg===2)){if(t.leg<2)t.leg++;else{if(TRK&&TRK.st==='park'&&!TRK.flat){t.st='load';t.lt=2}else if(!TRK){stealCow(t);t.st='flee'}else{t.st='flee'}}}break}
   case 'load':{t.lt-=dt;t.mv=0;if(t.lt<=0){if(t.cow&&S.herd.includes(t.cow)){TRK.cows.push(t.cow);const c=t.cow;S.herd=S.herd.filter(a=>a!==c);SP.delete(c.id);t.cow=null;toast('🛻 Colocaram '+c.name+' na caminhonete!','bad')}t.st='board'}break}
   case 'watch':{t.mv=0;t.dir=((t.t/2)|0)%2?3:2;if(THV.filter(o=>!o.camp&&o!==t&&thActive(o)).every(o=>o.st==='board'||o.st==='ride'))t.st='board';break}
   case 'board':{if(!TRK||TRK.flat||TRK.st==='gone'){t.st='flee';break}if(thMove(t,TRK.x,TRK.y,spd,dt,true)){t.st='ride'}break}
   case 'flee':{t.light=0;const tgx=TRK&&!TRK.flat&&TRK.st!=='gone'?TRK.x:TROAD.x-20,tgy=TRK&&!TRK.flat&&TRK.st!=='gone'?TRK.y:TROAD.y;
    if(thMove(t,tgx,tgy,t.spd*1.45,dt,true)){if(TRK&&!TRK.flat&&TRK.st!=='gone')t.st='ride';else{if(t.cow){stealCow(t)}t.st='gone'}}break}
  }
  if(t.cow&&S.herd.includes(t.cow)){const s=spriteOf(t.cow);const bx=t.x-(t.dir===3?22:t.dir===2?-22:0)-8,by=t.y-(t.dir===0?16:t.dir===1?-16:0)-10;s.x+=(bx-s.x)*Math.min(1,dt*4);s.y+=(by-s.y)*Math.min(1,dt*4);s.dir=t.x>s.x+8?1:-1;s.go=0;s.wait=1;s.f=(frame>>4)&1}
 }
 // gangue toda no carro → vai embora
 if(TRK&&(TRK.st==='park'||TRK.st==='wait')){const g=THV.filter(t=>!t.camp&&t.st!=='gone'&&t.st!=='down'&&t.st!=='surr'&&t.st!=='cuffed');if(g.length&&g.every(t=>t.st==='ride')){TRK.st='leave';TRK.lights=1}if(!g.length&&!TRK.flat){TRK.st='leave';TRK.lights=1}}
};
function stealCow(t){const c=t.cow;if(!c)return;t.cow=null;if(S.herd.includes(c)){S.herd=S.herd.filter(a=>a!==c);SP.delete(c.id)}afterTheft([c],t.cut)}
function afterTheft(cows,cut){const T=ensureThf();cows.forEach(c=>{c.led=0;c.lead=0;c.stall=null;T.stash.push(c);S.crim.lost++});
 const cx=cut?cut.x:PAS.x,cy=cut?cut.y:60;T.trk={d:S.day,x:cx,y:cy,seen:0,truck:!!TRK};
 toast('😠 Roubaram '+cows.map(c=>c.name).join(', ')+'! Procure rastros perto da cerca: eles podem levar ao esconderijo.','bad')}
// ---------- caminhonete
function stepTruck(dt){if(!TRK)return;const R=TRK;R.t+=dt;
 if(R.st==='arrive'){R.dir=1;R.x+=40*dt;if(R.x>=TPARK.x){R.x=TPARK.x;R.st='park';THV.forEach(t=>{if(t.st==='ride'&&!t.camp){t.st='go';t.x=R.x+rnd(-8,8);t.y=R.y+rnd(4,10)}})}}
 else if(R.st==='leave'){if(R.flat){R.st='park';return}R.dir=-1;R.x-=55*dt;THV.forEach(t=>{if(t.st==='ride'&&!t.camp){t.x=R.x;t.y=R.y}});
  if(R.x<TROAD.x-90){if(R.cows.length)afterTheft(R.cows,THV.find(t=>t.cut)?THV.find(t=>t.cut).cut:null);THV.forEach(t=>{if(t.st==='ride'&&!t.camp)t.st='gone'});TRK=null}}
}
function truckHit(pts){if(!TRK||TRK.flat)return false;for(const p of pts){const rx=TRK.x,ry=TRK.y;if(Math.abs(p[0]-rx)<26&&p[1]>ry-22&&p[1]<ry+2){
  if(p[1]>ry-8){TRK.flat=1;TRK.lights=0;toast('💥 Pneu furado! A caminhonete não sai mais daí. Os ladrões vão fugir a pé.','good');const cows=TRK.cows.splice(0);cows.forEach(c=>{addA(c);c.led=0;cowBack(c)});if(cows.length)toast('🐄 '+cows.map(c=>c.name).join(', ')+' voltou(aram) pro pasto!','good');gangFlee();for(const t of THV)if(t.st==='ride'&&!t.camp){t.st='flee';t.x=TRK.x+rnd(-10,10);t.y=TRK.y+8}}
  else toast('💥 Acertou a lataria da caminhonete!','good');return true}}return false}
// ---------- dano, mordida, rendição
biteThief=function(t,power,d){if(!thActive(t))return;t.hp-=Math.max(.5,power/12);t.alert=1;
 if(t.hp<=0){thiefDown(t,d?d.name:'o cão');return}
 releaseLoot(t);if(power>=28&&!t.heldT){t.heldT=4.5;toast('🐕 '+(d?d.name:'O cão')+' agarrou o ladrão pela perna! Chegue perto e mande ele se render.','good')}else{t.st='flee';t.path=null;toast('🐕 '+(d?d.name:'O cão')+' mordeu o ladrão! Ele largou tudo e fugiu.','good')}};
thiefDown=function(t,by){if(!t||t.st==='down'||t.st==='cuffed')return;releaseLoot(t);t.st='down';t.mv=0;t.light=0;t.alert=0;t.downBy=by;
 toast('🙌 Ladrão rendido por '+by+'! Algeme e leve à Delegacia (recompensa cheia e pista), ou chame o xerife pelo rádio.','good')};
hitThiefPts=function(pts,w){if(truckHit(pts))return true;
 for(const t of THV){if(!thActive(t)&&t.st!=='surr')continue;
  for(const p of pts)if(Math.hypot(p[0]-t.x,p[1]-(t.y-9))<8){t.hp-=1;S.thiefSeen=1;t.alert=1;
   if(t.hp<=0)thiefDown(t,'você');else{releaseLoot(t);if(t.st!=='surr'){t.st=t.camp&&t.armed&&Math.random()<.5?t.st:'flee';t.path=null}t.spd*=.8;toast('💥 Acertou '+(t.boss?'o chefe':'o ladrão')+'! Ele está ferido.','good')}
   return true}}
 return false};
const _hlTh=huntLegal;huntLegal=function(){if(THV.some(t=>thActive(t)&&Math.hypot(t.x-P.x,t.y-P.y)<260)||(TRK&&Math.hypot(TRK.x-P.x,TRK.y-P.y)<260))return true;return _hlTh()};
let surCd=0;
function tryStop(t){if(surCd>0)return;surCd=2.5;const dogs=S.dogs.some(d=>{const r=dogRT(d);return Math.hypot(r.x-P.x,r.y-P.y)<90});
 let ch=.3+(S.h&&S.h.eq?.25:0)+(dogs?.15:0)+(t.hp<t.hpM?.25:0)+(t.heldT>0?.4:0)-(t.armed?.25:0)-(t.boss?.35:0)+(P.aim?.1:0);
 toast('🗣️ “PARADO! Mãos pra cima!”');
 if(Math.random()<ch){t.st='surr';t.mv=0;t.alert=0;t.light=0;releaseLoot(t);toast('🙌 '+(t.boss?'O chefe':'O ladrão')+' se rendeu! Agora algeme ele.','good')}
 else{t.alert=1;if(!t.armed){releaseLoot(t);t.st='flee';t.path=null;toast('🏃 Ele não obedeceu e saiu correndo!','bad')}else toast('🔫 Ele sacou a arma! Cuidado!','bad')}}
function cuff(t){const T=ensureThf();if(T.cuffs<=0)return toast('Você não tem algemas. Compre na Delegacia (Xerife Ramos).','bad');T.cuffs--;t.st='cuffed';t.mv=0;toast('🔗 Algemado! Leve '+(t.boss?'o chefe':'o ladrão')+' até a Delegacia (ele te segue).','good')}
function jail(t,how){const T=ensureThf(),full=how==='entrega',boss=!!t.boss;let b=(600+LV()*80)*(full?1.5:how==='radio'?.8:.5)+(boss?15000:0)+(t.camp?400:0);b=Math.round(b/10)*10;
 cash(b,'Recompensa do xerife');S.crim.caught++;if(S.q&&S.q.cnt)S.q.cnt.thief=(S.q.cnt.thief||0)+1;gainXP(full?60:30,'ladrão');S.rep=Math.min(100,S.rep+(full?2:1));if(full)T.cuffs++;
 if(boss){T.boss++;S.rep=Math.min(100,S.rep+6);addTrof&&addTrof('⭐','Prendeu o chefe da quadrilha ('+gangBoss()+')')}
 t.st='gone';let msg='🚔 '+(boss?'O chefe '+gangBoss():'O ladrão')+' foi preso! Recompensa '+R$(b)+'.';
 if(full&&!T.camp){T.clue+=2;msg+=' No interrogatório ele '+(T.clue>=3?'entregou onde fica o esconderijo da quadrilha!':'deu uma pista do esconderijo ('+T.clue+'/3).')}
 toast(msg,'good');if(T.clue>=3&&!T.camp)revealCamp()}
function dawnClean(){for(const t of THV){if(t.camp)continue;if(t.st==='surr'){t.st='gone';toast('🌅 O ladrão rendido aproveitou a sua demora e fugiu de madrugada.','bad')}else if(t.st==='down'){jail(t,'sheriff')}}
 if(TRK&&TRK.flat){TRK=null;cash(2000,'Caminhonete apreendida');toast('🚔 O xerife guinchou a caminhonete dos ladrões. Prêmio de '+R$(2000)+'.','good')}}
// ---------- rádio, delegacia, consertos (interações)
let radioT=0;
const _ilTh=interactList;
interactList=function(){const L=_ilTh();if(inRoom())return L;const T=ensureThf();surCd=Math.max(0,surCd);
 for(const t of THV){const d=Math.hypot(t.x-P.x,t.y-(P.y-4));
  if(thActive(t)&&t.st!=='ride'&&d<80)L.push({x:t.x,y:t.y-4,r:80,label:'🗣️ Parado! Mãos pra cima! ('+(t.boss?'chefe ':'')+(t.armed?'🔫 armado':'desarmado')+')',fn:()=>tryStop(t)});
  if((t.st==='surr'||t.st==='down')&&d<26)L.push({x:t.x,y:t.y-4,r:26,label:'🔗 Prender '+(t.boss?'o chefe':'o ladrão'),fn:()=>arrestModal(t)});}
 for(const c of T.cuts)L.push({x:c.x*TS+8,y:c.y*TS+10,r:24,label:'🔧 Consertar cerca cortada (R$ 60)',fn:()=>{if(S.money<60)return toast('Dinheiro insuficiente','bad');cash(-60,'Conserto de cerca');repairCut(c);toast('🔧 Cerca consertada!','good')}});
 if(T.trk&&!T.trk.seen&&S.day-T.trk.d<=3)L.push({x:T.trk.x*TS-4,y:T.trk.y*TS+10,r:26,label:'🔍 Examinar rastros dos ladrões',fn:()=>{T.trk.seen=1;T.clue++;toast('🔍 '+(T.trk.truck?'Marcas de pneu de caminhonete carregada':'Pegadas de bota funda')+' seguindo pela trilha velha a oeste… Pista '+T.clue+'/3.','good');if(T.clue>=3&&!T.camp)revealCamp()}});
 if(T.camp&&T.camp.x&&Math.hypot(T.camp.x*TS+90-P.x,T.camp.y*TS+30-P.y)<130&&!THV.some(t=>t.camp&&thActive(t)&&Math.hypot(t.x-P.x,t.y-P.y)<220)&&T.stash.length)L.push({x:T.camp.x*TS+96,y:T.camp.y*TS+34,r:44,label:'🐄 Recuperar o gado roubado ('+T.stash.length+')',fn:recoverStash});
 if(TRK&&TRK.flat&&Math.hypot(TRK.x-P.x,TRK.y-P.y)<40)L.push({x:TRK.x,y:TRK.y,r:40,label:'🛻 Caminhonete dos ladrões (pneu furado)',fn:()=>toast('O xerife vai guinchar a caminhonete de manhã. Você ganha um prêmio por ela.')});
 return L};
const _updTh=update;update=function(dt){_updTh(dt);if(!S)return;surCd=Math.max(0,surCd-dt);if(radioT>0){radioT-=dt;if(radioT<=0){let n=0;for(const t of THV)if(!t.camp&&(t.st==='surr'||t.st==='down'||t.st==='cuffed')){jail(t,'radio');n++}if(n)toast('🚔 O xerife chegou de viatura e levou '+n+' preso(s).','good')}}};
const _erTh=enterRoom;enterRoom=function(id){if(id==='delegacia'){const c=THV.filter(t=>t.st==='cuffed');c.forEach(t=>jail(t,'entrega'))}return _erTh(id)};
function arrestModal(t){const T=ensureThf();reModal=null;window._arT=t;
 showModal('<h3>🔗 Prender '+(t.boss?'o chefe '+gangBoss():'o ladrão “'+t.nm+'”')+'</h3><div class="card">'+(t.st==='down'?'Ele está no chão, ferido/rendido.':'Ele está de mãos pra cima.')+'<br><b>Algemar e levar à Delegacia</b>: recompensa cheia + pista do esconderijo no interrogatório.<br><b>Rádio</b>: o xerife vem buscar (recompensa menor, sem pista).'+(t.camp?'':'<br><span class="dim">Se deixar até as 6h, quem está de mãos pra cima foge.</span>')+'</div>'
 +'<div class="btns"><button class="b gold" data-act="thcuff">🔗 Algemar ('+T.cuffs+' algema'+(T.cuffs===1?'':'s')+')</button>'+(T.def.radio?'<button class="b blue" data-act="thradio">📻 Chamar o xerife</button>':'<span class="dim">Sem rádio (compre na Delegacia)</span>')+'<button class="b gray" data-act="close">Voltar</button></div>')}
Object.assign(ACT,{thcuff(){const t=window._arT;hideModal();if(t)cuff(t)},thradio(){hideModal();if(radioT>0)return;radioT=6;toast('📻 “Xerife Ramos, câmbio! Prendi ladrão aqui!” — “Tô indo aí!”','good')}});
// ---------- vigia noturno
const VG={x:9*TS,y:50*TS,ph:0,dir:2,mv:0,wp:0,alert:0,cd:0};
const vgOn=()=>TD('vigia')&&(()=>{const h=S.t*24;return h>=19||h<5.5})();
function stepVigia(dt){if(!vgOn())return;const r=pasRect(),W=[[r.x0-1,r.y0-1],[r.x1+1,r.y0-1],[r.x1+1,r.y1+1],[r.x0-1,r.y1+1]].map(p=>[p[0]*TS+8,p[1]*TS+10]);VG.cd=Math.max(0,VG.cd-dt);
 const th=THV.find(t=>thActive(t)&&!t.camp&&t.st!=='ride'&&Math.hypot(t.x-VG.x,t.y-VG.y)<130);
 if(th){if(!VG.alert){VG.alert=1;whistleSnd();toast('🔦 O vigia viu o ladrão e saiu atrás!','good')}thMove(VG,th.x,th.y,62,dt,false);if(Math.hypot(th.x-VG.x,th.y-VG.y)<12&&VG.cd<=0){VG.cd=2;if(Math.random()<.55)thiefDown(th,'o vigia');else{releaseLoot(th);th.st='flee';th.path=null;toast('🏃 O ladrão escapou do vigia!','bad')}}return}
 VG.alert=0;const p=W[VG.wp%4];if(thMove(VG,p[0],p[1],20,dt,true))VG.wp++}
function drawVigia(g){drawPerson(g,{x:VG.x,y:VG.y,dir:VG.dir,ph:VG.ph,mv:VG.mv,shirt:'#7a7048',hair:'#3a2a1a',hat:'#4a4030',pants:'#3a3a2a'});const lx=VG.x+(VG.dir===2?-5:5);Rr(g,'#8a8a8a',lx-1,VG.y-11,3,4);Rr(g,'#fff4b0',lx-.5,VG.y-10.5,2,2)}
// ---------- esconderijo
const gangBoss=()=>['Zé Navalha','Tião Corisco','Chico Brabo','Dona Onça','Joca Facão'][(S.thf&&S.thf.gang||0)%5];
const CAMPS=[[24,93],[38,18],[86,92],[20,26]];
function revealCamp(){const T=ensureThf();const c=CAMPS[(T.gang+ri(0,CAMPS.length-1))%CAMPS.length];T.camp={x:c[0],y:c[1],sp:0};clearCamp();
 showModal('<h3>🗺️ Esconderijo descoberto!</h3><div class="card">As pistas levam a um acampamento da quadrilha '+(c[1]>70?'no cerrado, ao sul':'na mata, ao norte')+'. Uma seta vermelha vai mostrar o caminho.<br><br>Lá estão '+(T.stash.length?'<b>'+T.stash.length+' animal(is) roubado(s)</b>':'as coisas roubadas')+' e o chefe, <b class="red">'+gangBoss()+'</b> — procurado pela polícia (recompensa '+R$(15000)+').<br><span class="dim">Leve arma, cães e cuidado: eles estão armados. De noite muitos dormem.</span></div><div class="btns"><button class="b gold" data-act="close">Vamos lá</button></div>')}
function clearCamp(){const C=S.thf&&S.thf.camp;if(!C)return;for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=C.x-3&&tx<=C.x+12&&ty>=C.y-3&&ty<=C.y+5){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--){const d=DECO[i],tx=Math.floor(d.x/TS),ty=Math.floor(d.y/TS);if(tx>=C.x-3&&tx<=C.x+12&&ty>=C.y-3&&ty<=C.y+5){SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}}
let campSp=null;function spawnCamp(){const T=ensureThf(),C=T.camp;const n=2+Math.min(3,T.gang);
 for(let i=0;i<n;i++)THV.push(mkThief({camp:1,st:'camp',x:(C.x+rnd(0,5))*TS,y:(C.y+rnd(0,3))*TS+8,hx:(C.x+2.5)*TS,hy:(C.y+1.5)*TS,hp:2,hpM:2,light:0,armed:Math.random()<.6+T.gang*.1}));
 THV.push(mkThief({camp:1,boss:1,st:'camp',x:(C.x+1)*TS,y:(C.y+1)*TS+8,hx:(C.x+1)*TS,hy:(C.y+1)*TS,hp:5,hpM:5,armed:true,light:0,nm:gangBoss(),col:'#5a1a1a',pants:'#1a1a1a'}))}
function stepBandit(t,dt){if(t.st==='cuffed'){const bx=P.x-(P.dir===3?16:-16),by=P.y+2;if(Math.hypot(bx-t.x,by-t.y)>6)thMove(t,bx,by,95,dt,false);else t.mv=0;if(Math.hypot(P.x-t.x,P.y-t.y)>140){t.x=P.x-10;t.y=P.y}return}
 const C=S.thf.camp;if(!C){t.st='gone';return}if(t.st==='down'||t.st==='surr'){t.mv=0;return}
 if(t.heldT>0){t.heldT-=dt;t.mv=0;return}
 const h=S.t*24,asleep=(h>=23||h<4.5)&&!t.boss&&!t.alert&&(t.id||0)%2===0;
 const dP=Math.hypot(P.x-t.x,P.y-t.y);if(!t.alert&&!inRoom()&&(asleep?dP<40:plVisible(t)||dP<70)){t.alert=1;whistleSnd();for(const o of THV)if(o.camp)o.alert=1;toast('🚨 A quadrilha te viu! '+(t.boss?gangBoss()+' gritou: “Pega ele!”':'“Polícia!”'),'bad')}
 if(t.st==='flee'){if(thMove(t,t.hx+(t.x<t.hx?-260:260),t.hy+rnd(-2,2),t.spd*1.3,dt,false))t.st='gone';return}
 if(t.alert){thShoot(t,dt);if(!t.armed){t.st='flee';return}if(dP>60)thMove(t,P.x,P.y,t.spd*.45,dt,false);else t.mv=0;if(t.hp<=1&&!t.boss&&Math.random()<dt*.5){t.st='flee'}return}
 if(asleep){t.mv=0;t.sleep=1;return}t.sleep=0;
 t.wt=(t.wt||0)-dt;if(t.wt<=0){t.wt=rnd(3,8);t.tx=t.hx+rnd(-30,30);t.ty=t.hy+rnd(-12,14)}thMove(t,t.tx||t.x,t.ty||t.y,14,dt,false)}
function recoverStash(){const T=ensureThf();const cows=T.stash.splice(0);let n=0;for(const c of cows){if(S.herd.length>=Math.floor(cap()*1.5))break;addA(c);c.led=0;c.lead=0;cowBack(c);n++}
 const rw=1500+n*500;cash(rw,'Recuperação do gado');T.rec+=n;gainXP(80+n*20,'recuperação');S.rep=Math.min(100,S.rep+3);
 THV.forEach(t=>{if(t.camp&&(t.st==='down'||t.st==='surr'))jail(t,'radio')});
 T.camp=null;T.clue=0;T.gang++;toast(n?'🐄 Você recuperou '+n+' animal(is)! O xerife pagou '+R$(rw)+' e desmontou o acampamento.':'🚔 O xerife desmontou o acampamento e pagou '+R$(rw)+'.','good');
 if(T.stash.length)toast('⚠️ Sem espaço no pasto: '+T.stash.length+' animal(is) foram vendidos pelo xerife a seu favor.');T.stash.forEach(c=>cash(Math.round(valueOf(c,'mkt')*.8),'Venda de gado recuperado'));T.stash=[]}
// ---------- desenho
function drawThiefFig(g,t){const x=t.x,y=t.y,pose=t.st;
 Rr(g,'rgba(0,0,0,.3)',x-6,y-1,12,3);
 if(pose==='down'){Rr(g,t.pants,x-6,y-5,5,4);Rr(g,t.pants,x+1,y-4,6,3);Rr(g,t.col,x-4,y-12,8,8);Rr(g,'#c89a70',x-3,y-17,6,5);Rr(g,'#1a1a1a',x-4,y-18,8,2);Rr(g,t.boss?'#a82020':'#3a3a3a',x-3,y-14,6,2);Rr(g,'#c8a050',x-5,y-8,10,1.2);if(((frame>>4)&1))Rr(g,'#ffd75e',x-1,y-24,2,2);return}
 const surr=pose==='surr',cuffed=pose==='cuffed',kneel=pose==='cut';
 drawPerson(g,{x,y:y+(kneel?3:0),dir:t.dir,ph:t.ph,mv:t.mv,shirt:t.col,hair:'#1a1a1a',hat:t.boss?'#2a1a10':(t.id%2?'#1a1a1a':null),pants:t.pants,skin:'#c89a70',work:kneel||pose==='rope'});
 const yy=y+(kneel?3:0),side=t.dir>=2,fr=t.dir===3?1:-1;
 // touca/boné e lenço no rosto
 if(!t.boss&&!(t.id%2))Rr(g,'#2a2a30',x-4,yy-22.5,8,3);
 if(t.dir!==1){Rr(g,t.boss?'#a82020':'#3a3a40',x-3,yy-17,6,2.6);if(side)Rr(g,t.boss?'#a82020':'#3a3a40',x+(fr>0?-4:2),yy-16,2,3)}
 // mochila / corda
 if(t.role==='laca'||t.role==='solo'){Rr(g,'#c8a050',x+(fr>0?-5:3),yy-13,2.5,4);Rr(g,'#a8803a',x+(fr>0?-5:3),yy-12,2.5,.6)}
 else if(!t.camp)Rr(g,'#3a2a1a',x+(fr>0?-6:3),yy-14,3,6);
 if(surr){Rr(g,'#c89a70',x-5,yy-24,2,6);Rr(g,'#c89a70',x+3,yy-24,2,6);return}
 if(cuffed){Rr(g,'#c0c0c8',x-1,yy-8,3,1.2);return}
 const hx=x+(t.dir===3?5:t.dir===2?-5:3),hy=yy-10;
 if(t.armed&&(t.alert||t.boss)){Rr(g,'#222',hx+(fr>0?0:-4),hy-1.5,5,1.6);Rr(g,'#222',hx+(fr>0?0:0),hy-1,1.5,3);if(t.aimT>.5&&((frame>>2)&1))Rr(g,'#ff3a2a',x-.5,yy-30,2,4)}
 else if(t.light&&!kneel){Rr(g,'#555',hx-1,hy-1,3,2.4);Rr(g,'#fff4b0',hx+(fr>0?2:-2),hy-.5,1.2,1.4)}
 if(kneel){Rr(g,'#aa2020',hx+(fr>0?1:-4),hy+2,4,1.4);Rr(g,'#888',hx+(fr>0?4:-5),hy+1.4,2,1);if((frame>>1)%5<2){Rr(g,'#ffe080',hx+(fr>0?6:-6),hy+1+rnd(-1,1),1,1);Rr(g,'#fff',hx+(fr>0?7:-7),hy+rnd(-1,2),1,1)}}
 if(pose==='rope'){const a=frame*.35,cx=x+fr*2,cy=yy-27;for(let i=0;i<12;i++){const an=i/12*6.283+a;Rr(g,'#c8a050',cx+Math.cos(an)*6,cy+Math.sin(an)*2.2,1.2,1)}Rr(g,'#c8a050',x+fr*3,yy-24,.8,6)}
 if(t.cow&&S.herd.includes(t.cow)){const s=spriteOf(t.cow);g.strokeStyle='#c8a050';g.lineWidth=.8;g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo((hx+s.x+16)/2,(hy+s.y+2)/2+6,s.x+8+(t.x>s.x+8?12:-4),s.y-2);g.stroke()}
 if(t.heldT>0&&((frame>>3)&1))Rr(g,'#fff',x-6,yy-28,1,3);
 if(t.boss&&RMODE!==4){const n=gangBoss().toUpperCase(),tw=ptw(n);Rr(g,'rgba(60,10,10,.75)',x-tw/2-2,yy-38,tw+4,8);ptext(g,n,x-tw/2,yy-36.5,'#ff8a7a')}
 if(!t.camp&&(t.seen||t.st!=='go')&&thActive(t)&&RMODE!==4)Rr(g,'#e33',x-1,yy-33,2,4),Rr(g,'#e33',x-1,yy-28,2,1.5);
 if(t.sleep&&RMODE!==4)ptext(g,'Z',x+4,yy-30-((frame>>4)&3),'#cfe0ff');
}
drawThief=function(g,t){if(t.st==='ride')return;drawThiefFig(g,t)};
function drawTruck(g){const R=TRK;if(!R)return;const x=R.x,y=R.y,d=R.dir,c=R.col,dk=shade(c,-30),lt=shade(c,20),X=(lx,w)=>d>0?x+lx:x-lx-w,r=(col,lx,ly,w,h)=>Rr(g,col,X(lx,w),y+ly,w,h),tilt=R.flat?1.5:0;
 Rr(g,'rgba(0,0,0,.32)',x-28,y-2,56,5);
 // carroceria (gaiola de madeira)
 r(dk,-26,-15+tilt,28,10);r(c,-26,-15+tilt,28,2);for(let i=0;i<6;i++)r('#7a5a32',-25+i*5,-24+tilt,1.6,10);r('#8a6a3a',-26,-24+tilt,28,1.6);r('#8a6a3a',-26,-19+tilt,28,1.2);
 R.cows.forEach((cw,i)=>{const C=CPAL[cw.breed]||CPAL.nelore;r(C.c,-22+i*7,-22+tilt,7,7);r(C.fc,-17+i*7,-25+tilt,4,4);r('#111',-15+i*7,-24+tilt,1,1)});
 // cabine
 r(c,2,-21,15,16);r(lt,2,-21,15,1.5);r('#9ad0e0',4,-19,7,6);r('#c8e8f0',4,-19,2,6);r(c,17,-14,9,9);r(lt,17,-14,9,1.2);r(dk,2,-6,24,1.5);r('#222',24,-11,2.5,3);
 r(R.lights?'#fff6b0':'#8a8a70',25,-12,1.5,2);r('#aa2020',-26.5,-13,1.2,2);
 if(THV.some(t=>t.st==='ride'&&!t.camp)){r('#c89a70',6,-17,3,3);r('#1a1a1a',6,-18,3,1.2)}
 // rodas
 for(const wx of[-18,14]){const fl=R.flat&&wx===14;r('#111',wx,-6+(fl?2:0),8,fl?5:7);r('#555',wx+2.5,-4+(fl?2:0),3,fl?1.5:3)}
 if(R.lights&&R.st==='leave'){g.fillStyle='rgba(255,246,176,.12)';g.beginPath();g.moveTo(X(26,0),y-11);g.lineTo(X(70,0),y-22);g.lineTo(X(70,0),y+4);g.fill()}
}
function drawCut(g,c){const x=c.x*TS,y=c.y*TS;Rr(g,'#5a3a22',x+1,y+2,3,13);Rr(g,'#5a3a22',x+12,y+4,3,11);g.strokeStyle='#9aa0a8';g.lineWidth=.6;g.beginPath();g.moveTo(x+3,y+5);g.lineTo(x+6,y+9);g.moveTo(x+3,y+9);g.lineTo(x+5,y+13);g.moveTo(x+13,y+6);g.lineTo(x+10,y+11);g.stroke();if(((frame>>5)&1))Rr(g,'#ffd75e',x+7,y-3,2,2)}
function drawHolo(g,x,y,on){Rr(g,'rgba(0,0,0,.25)',x-2,y-1,5,2);Rr(g,'#555',x-1,y-40,2,40);Rr(g,'#333',x-5,y-44,10,5);Rr(g,on?'#fffbe0':'#9a9a8a',x-4,y-42,8,3)}
const HOLO=[{x:9*TS+4,y:50*TS+2},{x:9*TS+4,y:64*TS+2}];
function camPxy(){const C=S.thf&&S.thf.camp;return C?{x:C.x*TS,y:C.y*TS}:null}
function drawCamp(g){const C=S.thf.camp,x=C.x*TS,y=C.y*TS,h=S.t*24,lit=h>=17||h<6;
 // barracas de lona
 [[0,0,'#2a5aa8'],[38,-6,'#3a6a3a']].forEach(([dx,dy,c])=>{const bx=x+dx,by=y+dy+20;Rr(g,'rgba(0,0,0,.3)',bx-2,by-1,30,4);for(let r=0;r<14;r++){const w=28-r*2;Rr(g,r<2?shade(c,-25):c,bx+r,by-r-1,w,1)}Rr(g,'#1a1a1a',bx+11,by-9,6,8);Rr(g,shade(c,25),bx+12,by-14,4,4)});
 // fogueira e mesa
 const fx=x+30,fy=y+30;Rr(g,'#4a3a2a',fx-6,fy-2,12,3);if(lit&&typeof flameT==='function'){flameT(g,fx-2,fy-1,5,9+Math.sin(frame*.4)*2,frame*.3);flameT(g,fx+2,fy-1,4,7+Math.sin(frame*.5+1)*2,frame*.35)}
 Rr(g,'#6a4428',x+48,y+24,16,3);Rr(g,'#5a3a22',x+49,y+27,2,5);Rr(g,'#5a3a22',x+61,y+27,2,5);Rr(g,'#c8a050',x+52,y+22,4,2);Rr(g,'#8a8a8a',x+57,y+22,3,2);
 // curral improvisado com o gado roubado
 const kx=x+72,ky=y+2;for(let i=0;i<7;i++){Rr(g,'#5a3a22',kx+i*15,ky,2,34);}Rr(g,'#9aa0a8',kx,ky+8,92,.6);Rr(g,'#9aa0a8',kx,ky+18,92,.6);Rr(g,'#9aa0a8',kx,ky+28,92,.6);
 const st=S.thf.stash;st.slice(0,3).forEach((cw,i)=>drawCow(g,cw,kx+6+i*28,ky+16+(i%2)*6,i%2?1:-1,0,1));
 if(st.length>3)ptext(g,'+'+(st.length-3),kx+86,ky-8,'#ffd75e','#000');
}
const _evoTh=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoTh(L,x0,x1,y0,y1);if(inRoom())return;const T=S.thf;
 if(TRK&&TRK.x>x0-60&&TRK.x<x1+60&&TRK.y>y0-30&&TRK.y<y1+30)L.push([TRK.y,10,{draw:g=>OL(g,TRK.x,TRK.y,60,30,drawTruck)}]);
 if(T){for(const c of T.cuts){const px=c.x*TS,py=c.y*TS;if(px>x0-20&&px<x1+20&&py>y0-20&&py<y1+20)L.push([py+15,10,{draw:g=>drawCut(g,c)}])}
  if(T.def.holofote)for(const h of HOLO)if(h.x>x0-20&&h.x<x1+20&&h.y>y0-50&&h.y<y1+20)L.push([h.y,10,{draw:g=>drawHolo(g,h.x,h.y,holoOn())}]);
  if(T.camp){const c=camPxy();if(c.x>x0-140&&c.x<x1+20&&c.y>y0-40&&c.y<y1+40){L.push([c.y+36,10,{draw:drawCamp}]);if(campSp!==T.camp.x+','+T.camp.y+','+T.gang){campSp=T.camp.x+','+T.camp.y+','+T.gang;spawnCamp()}}}}
 if(vgOn()&&VG.x>x0-20&&VG.x<x1+20&&VG.y>y0-20&&VG.y<y1+40)L.push([VG.y,10,{draw:g=>OL(g,VG.x,VG.y,30,40,drawVigia)}]);
};
const holoOn=()=>TD('holofote')&&THV.some(t=>thActive(t)&&!t.camp&&t.st!=='ride'&&Math.hypot(t.x-HOLO[0].x,t.y-(HOLO[0].y+HOLO[1].y)/2)<260);
let holoWas=0;
const _lpTh=lampPos;lampPos=function(){const L=_lpTh();for(const t of THV)if(t.light&&thActive(t)&&!t.camp)L.push({x:t.x+(t.dir===3?10:t.dir===2?-10:0),y:t.y+6});
 if(holoOn())for(const h of HOLO){L.push({x:h.x+20,y:h.y+8});L.push({x:h.x+50,y:h.y-10})}
 if(vgOn())L.push({x:VG.x,y:VG.y+6});if(TRK&&TRK.lights)L.push({x:TRK.x+(TRK.dir>0?40:-40),y:TRK.y+4});
 const c=camPxy();if(c){const h=S.t*24;if(h>=17||h<6)L.push({x:c.x+30,y:c.y+42})}
 return L};
const _dpTh=drawPart;drawPart=function(g){_dpTh(g);if(inRoom())return;
 for(const s of TSHOT){Rr(g,'#fff4b0',s.x0-1,s.y0-1,3,3);g.strokeStyle='rgba(255,240,180,.8)';g.lineWidth=.6;g.beginPath();g.moveTo(s.x0,s.y0);g.lineTo(s.x1,s.y1);g.stroke()}
 // lanternas: cone de luz
 for(const t of THV){if(!t.light||!thActive(t)||t.camp||t.st==='ride')continue;const fr=t.dir===3?1:t.dir===2?-1:0,fy=t.dir===0?1:t.dir===1?-1:0,hx=t.x+fr*5,hy=t.y-10;g.fillStyle='rgba(255,246,190,.13)';g.beginPath();g.moveTo(hx,hy);g.lineTo(hx+fr*46-fy*14,hy+fy*30+(fr?10:0)-(fr?14:0));g.lineTo(hx+fr*46+fy*14,hy+fy*30+(fr?18:0));g.fill()}
 // alarme piscando
 if(TD('alarme')&&S.thf.cuts.length&&((frame>>3)&1)){const b=BLD.find(q=>q.id==='barn');if(b)Rr(g,'#ff2a2a',b.x*TS+b.w*TS-6,b.y*TS+2,4,4)}
 // seta para o esconderijo / caminhonete
 const tgt=camPxy()||(TRK&&!TRK.flat&&TRK.st!=='leave'?{x:TRK.x,y:TRK.y}:null);
 if(tgt&&(tgt.x<CX||tgt.x>CX+VW||tgt.y<CY||tgt.y>CY+VH)){const ax=clamp(tgt.x,CX+10,CX+VW-10),ay=clamp(tgt.y,CY+34,CY+VH-14),d=Math.round(Math.hypot(tgt.x-P.x,tgt.y-P.y)/TS);Rr(g,'rgba(60,10,10,.85)',ax-7,ay-7,14,14);Rr(g,'#ff5a4a',ax-1,ay-4,2,5);Rr(g,'#ff5a4a',ax-1,ay+2,2,1.5);ptext(g,d+'M',ax-ptw(d+'M')/2,ay+9,'#ff9a8a','#000')}
};
// ---------- rastros no chão
const _pqTh=pqTint;pqTint=function(g){_pqTh(g);const T=S.thf;if(!T||!T.trk||S.day-T.trk.d>3||inRoom())return;const k=T.trk,x1=k.x*TS-2,y1=k.y*TS+10,x0=TPARK.x,y0=TPARK.y+4,n=Math.max(4,Math.round(Math.hypot(x1-x0,y1-y0)/9)),a=(.4-(S.day-k.d)*.09).toFixed(2);
 for(let i=0;i<=n;i++){const u=i/n,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u;Rr(g,'rgba(50,34,20,'+a+')',x+(i%2?2:-2),y,2,1.2)}
 if(k.truck){g.fillStyle='rgba(50,34,20,'+a+')';g.fillRect(TROAD.x,TPARK.y-1,TPARK.x-TROAD.x,1.2);g.fillRect(TROAD.x,TPARK.y+5,TPARK.x-TROAD.x,1.2)}};
// ---------- noite dormindo: roubo acontece sem você ver
nightSleepRoll=function(){
 const hr=S.t*24;if(hr>=5&&hr<22)return;const T=ensureThf();
 const hours=hr>=22?(24-hr)+5:Math.max(0,5-hr);let rolls=Math.ceil(hours/2),msg='',bad=0;
 for(let i=0;i<rolls;i++){if(!nightRoll())continue;const gs=guardScore()*(TD('caes')?1.5:1);
  if(Math.random()<gs/130){msg+='🐕 Seus cães afugentaram ladrões durante a noite. ';gainXP(15,'defesa');continue}
  if(TD('vigia')&&Math.random()<.5){msg+='🔦 O vigia espantou ladrões de madrugada. ';continue}
  if(TD('alarme')&&Math.random()<.45){msg+='🚨 O alarme disparou e você acordou a tempo: os ladrões fugiram. ';continue}
  if(S.up.coop>0&&S.chk.n>0&&(Math.random()<.4||!S.herd.length)){const k=Math.min(S.chk.n,ri(1,3));S.chk.n-=k;S.crim.lost+=k;msg+='🥷 Ladrões levaram '+k+' galinha(s). ';syncCH();bad=1}
  else if(S.herd.length){const gang=Math.random()<gangChance(),n=gang?ri(1,Math.min(3,S.herd.length)):1,cows=[];const pool=S.herd.filter(a=>a.stall==null);for(let j=0;j<n&&pool.length;j++){const c=pool.splice(ri(0,pool.length-1),1)[0];cows.push(c);S.herd=S.herd.filter(a=>a!==c);SP.delete(c.id)}
   if(cows.length){const cut=pickCut(null);cutFence(cut);T.stash.push(...cows);S.crim.lost+=cows.length;T.trk={d:S.day+1,x:cut.x,y:cut.y,seen:0,truck:gang};msg+='🥷 Roubaram '+cows.map(c=>c.name).join(', ')+' de madrugada'+(gang?' (caminhonete)':'')+' e cortaram a cerca! Procure rastros. ';bad=1}}
  break}
 if(msg)toast(msg,bad?'bad':'good');
};
// ---------- dia a dia: peão conserta cerca, fuga pela cerca cortada, salário do vigia
const _hdTh=hookDay;
hookDay=function(){_hdTh();const T=ensureThf();
 if(T.cuts.length&&S.up.peao&&S.money>=60*T.cuts.length){cash(-60*T.cuts.length,'Peão consertou cerca');T.cuts.forEach(c=>FEN[ti(c.x,c.y)]=1);toast('🔧 O peão consertou '+T.cuts.length+' trecho(s) de cerca cortada.','good');T.cuts=[]}
 else if(T.cuts.length&&S.herd.length&&Math.random()<.12){cash(-150,'Vizinho devolveu vaca');toast('🐄 Uma vaca escapou pela cerca cortada! Um vizinho achou e devolveu (R$ 150). Conserte a cerca!','bad')}
 if(S.day%30===0&&T.def.vigia)cash(-2200,'Salário do vigia noturno');
};
const _gwTh=genWorld;genWorld=function(){_gwTh();TRK=null;THV.length=0;TSHOT.length=0;campSp=null;if(S&&S.thf&&S.thf.camp)clearCamp()};
// ---------- Delegacia: segurança da fazenda
const DEFS=[['holofote','💡 Holofotes com sensor no pasto',3500,'Acendem sozinhos quando alguém chega perto. Assusta ladrões e ilumina tudo.'],['alarme','🚨 Alarme na cerca',2000,'Dispara quando cortam a cerca e às vezes te acorda de madrugada.'],['cadeado','🔒 Correntes e cadeados',800,'Cerca reforçada: cortar demora o dobro e alguns ladrões desistem.'],['vigia','🔦 Vigia noturno (R$ 2.200/mês)',0,'Ronda o pasto com lanterna das 19h às 5h e persegue ladrões.'],['caes','🐕 Soltar os cães à noite',0,'Os cães dormem soltos perto do pasto: farejam e latem antes.'],['radio','📻 Rádio comunicador',1200,'Chame o xerife para buscar ladrões rendidos.']];
function secCard(){const T=ensureThf();let h='<div class="sec">🛡️ SEGURANÇA DA FAZENDA</div>';
 h+='<div class="card"><div class="row"><b>🔗 Algemas</b><span class="gold">'+R$(150)+'</span></div><div class="dim">Você tem '+T.cuffs+'. Volta para você quando entrega o ladrão aqui.</div><div class="btns"><button class="b" data-act="thbuy" data-v="algema">Comprar 1</button></div></div>';
 DEFS.forEach(d=>{const on=T.def[d[0]],tog=d[0]==='vigia'||d[0]==='caes';h+='<div class="card"><div class="row"><b>'+d[1]+'</b><span class="'+(on?'grn':'gold')+'">'+(on?'✔ ativo':d[2]?R$(d[2]):'')+'</span></div><div class="dim">'+d[3]+'</div><div class="btns">'+(tog?'<button class="b '+(on?'gray':'gold')+'" data-act="thbuy" data-v="'+d[0]+'">'+(on?'Desligar':d[0]==='vigia'?'Contratar':'Ligar')+'</button>':on?'':'<button class="b gold" data-act="thbuy" data-v="'+d[0]+'">Comprar</button>')+'</div></div>'});
 h+='<div class="sec">🗺️ QUADRILHA</div><div class="card"><div class="row"><b>Procurado: '+gangBoss()+'</b><span class="gold">'+R$(15000)+'</span></div><div class="dim">'+(T.camp?'<b class="red">Esconderijo descoberto!</b> Siga a seta vermelha.':'Pistas: '+T.clue+'/3 (rastros na cerca e interrogatório de presos).')+(T.stash.length?' Gado roubado com eles: '+T.stash.length+'.':'')+(T.boss?' Chefes presos: '+T.boss+'.':'')+'</div></div>';
 return h}
Object.assign(ACT,{thbuy(e){const T=ensureThf(),k=e.v;if(k==='algema'){if(S.money<150)return toast('Dinheiro insuficiente','bad');cash(-150,'Algemas');T.cuffs++;toast('🔗 +1 algema','good')}
 else{const d=DEFS.find(q=>q[0]===k);if(k==='vigia'||k==='caes'){T.def[k]=!T.def[k];if(k==='vigia'&&T.def[k]){if(S.money<2200)return(T.def[k]=0,toast('Dinheiro insuficiente','bad'));cash(-2200,'Vigia noturno (1º mês)')}toast(T.def[k]?'✔ '+d[1]+' ativo':d[1]+' desligado','good')}
  else{if(T.def[k])return;if(S.money<d[2])return toast('Dinheiro insuficiente','bad');cash(-d[2],d[1]);T.def[k]=1;toast('✔ '+d[1]+' instalado!','good')}}
 npcModal('ramos')}});
const _npcTh=npcModal;npcModal=function(id){_npcTh(id);if(id!=='ramos')return;const mb=$('mbox'),b=[...mb.children].filter(c=>c.classList.contains('btns')).pop();if(b)b.insertAdjacentHTML('beforebegin',secCard());else mb.insertAdjacentHTML('beforeend',secCard());reModal=null};
ACH.push(['ladr5','Delegado honorário','Entregue 5 ladrões na Delegacia',()=>S.crim&&S.crim.caught>=5,8000],['chefe','Fim da quadrilha','Prenda o chefe de uma quadrilha',()=>S.thf&&S.thf.boss>=1,20000],['recup','Gado de volta','Recupere gado roubado no esconderijo',()=>S.thf&&S.thf.rec>=1,6000]);
GUIDE.push({lv:1,ic:'🥷',t:'Ladrões',h:'De madrugada podem vir ladrões a pé ou, a partir do nível 4, quadrilhas de caminhonete pela trilha velha a oeste. Eles cortam a cerca com alicate, laçam uma vaca e levam pra carroceria. Atire no PNEU para a caminhonete não sair. Chegue perto e mande “Parado!”: eles podem se render ou, se armados, atirar. Algeme e leve à Delegacia (recompensa e pista do esconderijo) ou chame o xerife pelo rádio. Examine os rastros na cerca: 3 pistas revelam o acampamento da quadrilha, onde está o gado roubado e o chefe procurado. Na Delegacia compre holofotes, alarme, correntes, rádio, algemas e contrate um vigia.'});
