// ===== Cães realistas: raças, idade, vida, feridas, coleiras, pegada e abate com faca =====
Object.assign(DOGS.vira,{str:20,life:14,hpm:90,v:{len:11,h:4,leg:4,head:5,mz:2,ear:'semi',tail:'curl',c:'#b8864e',bl:'#e2c08a'}});
Object.assign(DOGS.collie,{str:14,life:13,hpm:85,v:{len:12,h:5,leg:4.5,head:5,mz:2.5,ear:'semi',tail:'fluff',c:'#262626',bl:'#f2f2f2',chest:'#f2f2f2',blaze:'#f2f2f2',sock:'#f2f2f2',tip:'#f2f2f2',ruff:'#f2f2f2'}});
Object.assign(DOGS.beagle,{str:10,life:13,hpm:75,v:{len:10,h:4,leg:3.5,head:5,mz:2,ear:'flop',tail:'up',c:'#c8905a',bl:'#f4f0e4',saddle:'#2a2a2a',sock:'#f4f0e4',chest:'#f4f0e4',tip:'#ffffff',blaze:'#f4f0e4',ear_c:'#8a5a2a'}});
Object.assign(DOGS.pastor,{str:42,life:11,hpm:110,v:{len:14,h:5,leg:5,head:5,mz:3,ear:'prick',tail:'saber',c:'#b07a3a',bl:'#d8a860',saddle:'#262626',mask:'#262626',ear_c:'#2a2a2a',tc:'#3a2a1a'}});
Object.assign(DOGS.kangal,{str:88,life:12,hpm:140,v:{len:16,h:6,leg:6,head:6,mz:2.5,ear:'drop',tail:'curl',c:'#d2b47c',bl:'#e6cf9c',mask:'#2a2a2a',ear_c:'#2a2a2a'}});
DOGS.dogo={n:'Dogo Argentino',lv:6,p:7500,spd:94,bite:26,guard:70,track:55,herd:25,sz:2,col:'#f2f0ea',str:72,life:11,hpm:125,d:'Cão de agarre criado para javali e puma. Corre, pega e não solta.',v:{len:15,h:6,leg:6,head:6,mz:2.5,ear:'crop',tail:'whip',c:'#f2f0ea',bl:'#ffffff',dk:'#cfc8bc',nose:'#a07878',ear_c:'#e8d0c8'}};
DOGS.fila={n:'Fila Brasileiro',lv:7,p:8500,spd:84,bite:28,guard:95,track:60,herd:55,sz:2,col:'#b8874a',str:78,life:10,hpm:135,d:'Gigante tigrado brasileiro. Guarda feroz e agarre pesado.',v:{len:16,h:7,leg:6,head:7,mz:2.5,ear:'drop',tail:'saber',c:'#b8874a',bl:'#c89a5a',mask:'#2a2018',brindle:'#5a3a1a',ear_c:'#3a2a1a',tc:'#6a4a2a'}};
UNL[6]+=' · Dogo Argentino';UNL[7]+=' · Fila Brasileiro';
const COLL=[{n:'Coleira simples',p:0,refl:0,neck:0},{n:'Coleira de couro com tachas',p:450,refl:2,neck:.12},{n:'Coleira de espinhos de aço',p:1200,refl:5,neck:.25}];
Object.assign(GEAR,{knife:{n:'Faca de caça',p:350,d:'Sangria do animal que os cães estão segurando (tecla F ou ✋).'},bowie:{n:'Faca Bowie de aço carbono',p:1200,d:'Abate 40% mais rápido e mais seguro.'}});
ITEMS.vetkit={n:'Kit de curativo canino',ic:'🩹',cat:'use',p:90};
ITEMS.antibio={n:'Antibiótico veterinário',ic:'💊',cat:'use',p:140};
const NAMES_M=['Rex','Thor','Duque','Zeus','Bruto','Trovão','Fumaça','Paçoca','Tufão','Bandido','Xerife','Sansão'],NAMES_F=['Nina','Mel','Bela','Pandora','Luna','Pipoca','Jade','Kira','Amora','Fera','Laika'];
// ---- utilidades
const TT={};function tt(k,msg,cls,sec){const n=performance.now();if(TT[k]&&n-TT[k]<(sec||4)*1000)return;TT[k]=n;toast(msg,cls)}
const dogMax=d=>DOGS[d.breed].hpm||100;
function ensureDog(d){
 if(d._ok)return;d._ok=1;
 if(d.age===undefined)d.age=d.breed==='vira'?900:520;
 if(!d.sex)d.sex=Math.random()<.5?'M':'F';
 if(!d.wounds)d.wounds=[];
 if(d.hp===undefined||d.hp===100&&dogMax(d)>100)d.hp=dogMax(d);
 d.hp=Math.min(d.hp,dogMax(d));d.col=d.col||0;d.arm=d.arm||0;d.venom=d.venom||0;
}
function ageF(d){const L=DOGS[d.breed].life*360,a=d.age;if(a<180)return .45+a/180*.35;if(a<360)return .8+.2*(a-180)/180;if(a>L*.7)return Math.max(.45,1-(a-L*.7)/(L*.3)*.5);return 1}
const hpF=d=>clamp(d.hp/dogMax(d),0,1);
const effStr=d=>DOGS[d.breed].str*ageF(d)*(.4+.6*hpF(d));
const dogSpd=d=>DOGS[d.breed].spd*ageF(d)*(hpF(d)<.4?.7:1)*(d.arm===2?.94:1);
const feedD=d=>[5,9,14][DOGS[d.breed].sz];
function stageTxt(d){const L=DOGS[d.breed].life*360;return d.age<240?'🍼 Filhote':d.age<540?'Jovem':d.age>L*.9?'👴 Idoso':d.age>L*.7?'Veterano':'💪 Adulto'}
const ageTxtD=d=>{const y=Math.floor(d.age/360),m=Math.floor(d.age%360/30);return (y?y+' ano'+(y>1?'s':''):'')+(y&&m?' e ':'')+(m||!y?m+' '+(m===1?'mês':'meses'):'')};
const partyDogs=()=>S.dogs.filter(d=>!d.dead&&(d.id===S.dogAct||d.esc));
const rideDogs=()=>partyDogs().filter(d=>dogRT(d).st!=='stay');
const _dogRT0=dogRT;dogRT=function(d){if(!d)return{st:'follow',x:0,y:0};const r=_dogRT0(d);if(r.ph===undefined){r.ph=0;r.idle=0;r.pant=0;r.wag=0;r.hurt=0}return r};
function preyRes(a){
 const sp=SPECIES[a.sp];if(a.hp0===undefined)a.hp0=a.hp;
 let r=a.kg*.38+(sp.aggr?12:0);if(a.sp==='bear')r+=25;if(a.sp==='croc'||a.sp==='sucuri')r+=15;
 return r*(.55+.45*clamp(a.hp/a.hp0,0,1))*(a.stam===undefined?1:.75+.25*a.stam);
}
let BAC=null;
function barkSnd(big){
 try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime;
  for(let k=0;k<2;k++){const o=AC.createOscillator(),gn=AC.createGain(),fl=AC.createBiquadFilter(),f0=big?230:400,t0=t+k*.17;
   o.type='sawtooth';o.frequency.setValueAtTime(f0*1.5,t0);o.frequency.exponentialRampToValueAtTime(f0*.7,t0+.1);
   fl.type='bandpass';fl.frequency.value=f0*2.2;gn.gain.setValueAtTime(.0001,t0);gn.gain.exponentialRampToValueAtTime(.11,t0+.01);gn.gain.exponentialRampToValueAtTime(.0001,t0+.12);
   o.connect(fl);fl.connect(gn);gn.connect(AC.destination);o.start(t0);o.stop(t0+.14)}}catch(e){}
}
// ---- sprite detalhado
function drawDogSprite(g,x,y,dr,v,pose,ph,o){
 o=o||{};
 const f=(c,dx,dy,w,h)=>{if(w>0&&h>0)Rr(g,c,dr>0?x+dx:x-dx-w,y+dy,w,h)};
 const L=v.len,H=v.h,LG=v.leg,HS=v.head,half=L/2,c=v.c,dk=v.dk||shade(c,-35),bl=v.bl||shade(c,30),tc=v.tc||c,ec=v.ear_c||dk;
 const run=pose==='run',walk=pose==='walk'||pose==='limp'||(pose==='sniff'&&o.mv),sit=pose==='sit',lie=pose==='lie'||pose==='sleep';
 let rearY=0,frontY=0,hdx=0,hdy=0,bob=0;
 if(run)bob=-Math.abs(Math.sin(ph))*1.3;else if(walk)bob=-Math.abs(Math.sin(ph))*.5;else if(!lie&&!sit)bob=Math.sin(frame/22)*.25;
 if(sit)rearY=LG-1.5;
 if(lie){rearY=LG-.5;frontY=LG-.5}
 if(pose==='hold'){frontY=1.5;hdx=1.2;hdy=2.5+(o.shake?Math.sin(frame*1.4)*.8:0);rearY=-.5}
 if(pose==='sniff'){hdy=LG+H-HS*.6;hdx=.8}
 if(pose==='point')hdx=1;
 if(o.hurt)hdy+=.5;
 const top=-(LG+H)+bob;
 Rr(g,'rgba(0,0,0,.28)',x-half-1.5,y-1.2,L+3,2.5);
 // pernas articuladas: ombro→cotovelo→punho→pata na frente; quadril→joelho→jarrete→pata atrás.
 // Andar em 4 tempos (trás, frente do mesmo lado, trás e frente do outro); correndo, galope. A pata fica parada no chão enquanto apoia.
 const ik=(x0,y0,x1,y1,a,b,s)=>{const dx=x1-x0,dy=y1-y0,d0=Math.hypot(dx,dy)||.01,dm=Math.min(a+b-.02,Math.max(Math.abs(a-b)+.02,d0)),base=Math.atan2(dy,dx),al=Math.acos(clamp((a*a+dm*dm-b*b)/(2*a*dm),-1,1));return[x0+Math.cos(base+s*al)*a,y0+Math.sin(base+s*al)*a]};
 const seg=(x0,y0,x1,y1,w0,w1,col)=>{const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/.45));for(let k=0;k<=n;k++){const t=k/n,w=w0+(w1-w0)*t;f(col,x0+(x1-x0)*t-w/2,y0+(y1-y0)*t-w/2,w,w)}};
 const GW={nr:0,nf:.25,fr:.5,ff:.75},GR={nr:0,fr:.1,nf:.52,ff:.62},lw=clamp(LG*.42,1.5,2.7);
 const leg=(dx,phs,far,front)=>{
  const lc=far?dk:c,sock=far?shade(dk,-4):(v.sock||shade(c,-18));
  if(lie){if(front)f(lc,dx,-1.6,3.2,1.6),f(sock,dx+2.4,-1.6,1,1.6);else f(lc,dx-1,-2.2,3.5,2.2);return}
  if(sit&&!front){f(lc,dx-1.2,-3.2,4,2.6);f(sock,dx+1.2,-1,2.2,1);return}
  const key=(far?'f':'n')+(front?'f':'r');let fx=0,fy=0,lf=0;
  const gt=run?{st:.42,S:LG*1.25,L:LG*.4,o:GR}:walk?{st:.62,S:LG*.62,L:LG*.22,o:GW}:null;
  if(gt){const t=((ph/(2*Math.PI)+gt.o[key])%1+1)%1;if(t<gt.st){fx=gt.S/2-gt.S*(t/gt.st)}else{const u=(t-gt.st)/(1-gt.st);fx=-gt.S/2+gt.S*u*u*(3-2*u);lf=Math.sin(Math.PI*u);fy=-lf*gt.L}}
  if(pose==='limp'&&front&&!far){fy=-LG*.35;fx=.6;lf=1}
  if(pose==='point'&&front&&!far){fy=-LG*.42;fx=1;lf=1}
  if(pose==='hold'){fx=front?1.4:-1.8}
  if(sit&&front){fx=.4}
  const cx=dx+1,hy=-LG+(front?frontY:rearY)+bob-.7,px=cx+fx;
  if(front){
   const wx=px+.3+lf*.8,wy=fy-LG*.2+lf*.35,[ex,ey]=ik(cx,hy,wx,wy,LG*.5,LG*.42,1);
   seg(cx,hy,ex,ey,lw*1.12,lw,lc);seg(ex,ey,wx,wy,lw,lw*.82,lc);seg(wx,wy,px+.2,fy-.6,lw*.78,lw*.72,sock);
   f(sock,px-.6,fy-1,lw+.9,1)
  }else{
   const hx2=px-.7-lf*.7,hy2=fy-LG*.34+lf*.2,[kx,ky]=ik(cx,hy,hx2,hy2,LG*.52,LG*.44,-1);
   seg(cx-.2,hy,kx,ky,lw*1.45,lw*1.05,lc);seg(kx,ky,hx2,hy2,lw*.95,lw*.75,lc);seg(hx2,hy2,px,fy-.6,lw*.72,lw*.7,sock);
   f(sock,px-.5,fy-1,lw+.8,1)
  }
 };
 leg(-half+2.2,0,1,0);leg(half-2.2,0,1,1);
 // cauda (atrás do corpo)
 const tw=o.wag?Math.sin(frame*(o.wag>2?.9:.45))*1.2:0,ty0=top+rearY;
 if(run)f(tc,-half-3.4,ty0+.6,3.6,1.3);
 else if(sit||lie)f(tc,-half-2.6,-1.2,3,1.1);
 else if(v.tail==='curl'){f(tc,-half-1.2,ty0-2+tw*.3,2,2.2);f(tc,-half-.2,ty0-3+tw*.3,2.2,1.4);f(shade(tc,15),-half+1,ty0-2.4,1.2,1.2)}
 else if(v.tail==='saber'){f(tc,-half-1.2,ty0+.8,1.8,3);f(tc,-half-2.2+tw*.4,ty0+3,1.6,2.6)}
 else if(v.tail==='fluff'){f(tc,-half-1.6,ty0+.8,2.2,3);f(tc,-half-2.6+tw*.6,ty0+3,2.2,2.6);f(v.tip||tc,-half-2.2+tw*.6,ty0+5.2,1.6,1)}
 else if(v.tail==='up'){f(tc,-half-.8+tw,ty0-3.4,1.3,3.8);f(v.tip||'#fff',-half-.8+tw,ty0-4.4,1.3,1.1)}
 else{f(tc,-half-1,ty0+.4,1.2,1.2);f(tc,-half-2+tw*.6,ty0+1.2,1.1,3.2)}
 // corpo
 f(c,-half,top+rearY,half+.6,H);f(c,0,top+frontY,half,H);
 if(sit){f(c,-half+1,top+rearY-1.2,half,1.4)}
 f(shade(c,-12),-half,top+rearY,half,1);f(shade(c,-12),0,top+frontY,half-1,1);
 f(bl,-half+2,top+rearY+H-1,half,1);f(bl,0,top+frontY+H-1,half-2.5,1);
 f(v.chest||bl,half-3.2,top+frontY+H-1.6,3.2,1.8);
 if(v.saddle){f(v.saddle,-half+1,top+rearY,half,Math.ceil(H*.55));f(v.saddle,0,top+frontY,half-2.5,Math.ceil(H*.5))}
 if(v.brindle)for(let i=-half+1;i<half-1;i+=1.8)f(v.brindle,i,top+(i<0?rearY:frontY)+1,.8,H-2);
 if(o.thick)f(shade(c,-20),-half+2,top+rearY+1,L-5,.6);
 // armadura / colete
 if(o.arm===1){f('#d84a2a',-half+1.5,top+frontY+.5,L-4.5,H-1.2);f('#f0f060',-half+1.5,top+frontY+H/2,L-4.5,.8);f('#222',half-4,top+frontY+.5,.7,H-1.2)}
 if(o.arm===2){f('#3a4632',-half+1,top+frontY,L-3.5,H-.6);f('#2a3424',-half+2,top+frontY+1,3,2);f('#2a3424',2,top+frontY+1,3,2);f('#d8d8a0',-1,top+frontY+.3,2,.8);for(let i=-half+2;i<half-2;i+=2)f('#9a9a9a',i,top+frontY-.6,.7,.8)}
 // pernas da frente (perto)
 leg(-half+1,0,0,0);leg(half-3.2,0,0,1);
 // feridas
 if(o.wounds)o.wounds.forEach((w,i)=>{const wx=-half+2+(i*3.3)%(L-4),wy=top+(wx<0?rearY:frontY)+1+(i%2);if(w.band)f('#f4f4f0',wx,wy,2,1.4);else{f('#a01010',wx,wy,1.4,1.2);if(w.bt>0&&((frame>>3)+i)%2)f('#d02020',wx,wy+1.4,.8,.8)}if(w.inf)f('#8aa83a',wx+.4,wy-.6,.8,.6)});
 // cabeça
 const hx=half-1+hdx,hy=top+frontY-HS+2+hdy;
 f(c,half-3.2,hy+2,3.2,top+frontY-hy-1);
 if(v.ruff)f(v.ruff,half-3.6,hy+HS-2,3,3);
 f(c,hx,hy,HS-1,HS-1);f(shade(c,-10),hx,hy,HS-1,1);
 const mzh=Math.ceil(HS/2),my=hy+HS-1-mzh,mz=v.mz;
 f(v.mask||shade(c,8),hx+HS-1,my,mz,mzh-(o.bark?1:0));
 if(v.mask)f(v.mask,hx+HS-3,hy+1,2.2,2.2);
 if(v.blaze)f(v.blaze,hx+HS-2.2,hy,1.1,HS-1.6);
 if(o.bark){f('#6a1414',hx+HS-1,my+mzh-1,mz,1);f(v.mask||c,hx+HS-1,my+mzh,mz-.4,1)}
 if(o.pant&&!o.bark){f('#6a1414',hx+HS-1,my+mzh-.6,mz-.6,.6);f('#e46a7a',hx+HS-1+mz-1.8,my+mzh,1.2,1.6+Math.sin(frame/4)*.3)}
 if(pose==='hold')f('#f4f0e8',hx+HS-1+mz-1.4,my+mzh-.6,.7,.7);
 if(v.jowl)f(shade(v.mask||c,-10),hx+HS-1,my+mzh-.4,1.4,1.4);
 f(v.nose||'#111',hx+HS-1+mz-1,my-.2,1.1,1.1);
 if(o.sleep)f(shade(c,-45),hx+HS-2.8,hy+1.8,1.2,.4);else{f('#111',hx+HS-2.6,hy+1.4,1,1);f('#fff',hx+HS-2.3,hy+1.4,.4,.4)}
 if(v.saddle&&v.ear_c==='#8a5a2a')f('#c8905a',hx,hy+.5,1.4,HS-2);
 if(v.ear==='prick'){if(run)f(ec,hx-.2,hy-.8,2.6,1.4);else{f(ec,hx+.4,hy-2.8,2,3.2);f(shade(ec,40),hx+.9,hy-1.8,.8,1.6)}}
 else if(v.ear==='semi'){f(ec,hx+.5,hy-2,2,2.4);f(ec,hx+2.2,hy-1.6,1,1)}
 else if(v.ear==='flop'){f(ec,hx+.4,hy+.4,2.2,HS-(run?1.5:.4))}
 else if(v.ear==='drop'){f(ec,hx+.4,hy-.2,2.4,3.2)}
 else f(ec,hx+.6,hy-1.6,1.4,2.2);
 // coleira
 const cy=hy+HS-1.4;
 if(o.col===0)f('#a03020',half-3,cy,2.6,1);
 if(o.col===1){f('#5a3218',half-3.2,cy,3,1.3);f('#e0c060',half-2.8,cy+.3,.6,.6);f('#e0c060',half-1.4,cy+.3,.6,.6)}
 if(o.col===2){f('#3a3a3a',half-3.4,cy,3.2,1.4);for(let i=0;i<3;i++){f('#e8e8e8',half-3.2+i*1.1,cy-.8,.6,.8);f('#e8e8e8',half-3.2+i*1.1,cy+1.4,.6,.8)}}
 if(o.gps){f('#222',half-2.6,cy+1.2,1.8,1.6);f('#3a8a3a',half-2.2,cy+1.6,.8,.6);f('#444',half-2.4,cy-2.6,.4,3)}
 if(o.sleep){const z=(frame>>4)%3;Rr(g,'#e8f0ff',x+(dr>0?hx+2:-hx-3)+z,y+hy-4-z*2,1.5,1.5)}
}
// ---- danos, sangramento e morte
function dogHurt(d,dmg,src,o){
 o=o||{};ensureDog(d);if(d.dead)return;const r=dogRT(d),arm=DARM[d.arm||0],col=COLL[d.col||0],neckHit=src&&src.sp&&['wolf','coyote','bear','croc'].includes(src.sp);
 let m=dmg*(1-arm.red)*(1-(col.neck||0)*(neckHit?1.6:1));m=Math.max(.5,m);d.hp-=m;r.hurt=.6;
 const sev=m<5?1:m<12?2:3;
 d.wounds.push({sev,bt:sev*22,inf:0,band:0,day:S.day,loc:pick(neckHit?['pescoço','pescoço','orelha']:['pata dianteira','pata traseira','costela','orelha','focinho','pescoço'])});if(d.wounds.length>7)d.wounds.shift();
 if(o.venom){d.venom=45;tt('ven'+d.id,'🐍 '+d.name+' foi picado(a) por cobra! Use soro antiofídico 💉','bad',6)}
 if(col.refl&&src&&src.sp&&src.st!=='dead'){src.hp-=col.refl;src.hurt=1;for(let i=0;i<3;i++)BLOOD.push({x:src.x+rnd(-3,3),y:src.y+rnd(-2,1),a:1});if(src.hp<=0){src.hitQ='body';src.dogKill=1;killWild(src);tt('refl','🔩 A coleira de espinhos feriu o '+SPECIES[src.sp].n+' até a morte!','good')}else tt('refl'+src.id,'🔩 '+SPECIES[src.sp].n+' se feriu na coleira de espinhos de '+d.name,'good',8)}
 tt('dh'+d.id,'🐕 '+d.name+' ferido(a) ('+['','leve','médio','grave'][sev]+')'+(src&&src.sp?' pelo '+SPECIES[src.sp].n:''),'bad',3);
 if(d.hp<=0){dogDie(d,src&&src.sp?'morto(a) por '+SPECIES[src.sp].n:'ferimentos');return}
 if(d.hp<dogMax(d)*.28&&r.st!=='retreat'){releaseDog(d);r.st='retreat';r.tgt=null;toast('🐕 '+d.name+' está muito ferido(a) e recuou! Faça um curativo.','bad')}
}
function dogDie(d,cause){
 releaseDog(d);d.dead=1;if(!S.dogMem)S.dogMem=[];S.dogMem.unshift({name:d.name,breed:d.breed,age:d.age,cause,day:S.day});
 S.dogs=S.dogs.filter(x=>x!==d);DR.delete(d.id);if(S.dogAct===d.id&&S.dogs[0])S.dogAct=S.dogs[0].id;
 showModal('<h3>🕯️ Adeus, '+d.name+'</h3><div class="card">'+DOGS[d.breed].n+' · '+ageTxtD(d)+'<br>'+cause+'.<br><span class="dim">Ficará no memorial do canil.</span></div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function releaseDog(d){const r=dogRT(d),a=r.tgt;if(a&&a.held)a.held=a.held.filter(i=>i!==d.id);if(r.st==='hold'||r.st==='catch'){r.st='follow';r.tgt=null}}
function bleedDog(d,r,dt){
 let b=0;for(const w of d.wounds)if(!w.band&&w.bt>0){b+=w.sev*.09;w.bt-=dt}
 if(d.venom>0){d.venom-=dt;b+=.45}
 if(b>0){d.hp=Math.max(1,d.hp-b*dt);r.bdrop=(r.bdrop||0)-dt;if(r.bdrop<=0&&d.wounds.some(w=>!w.band&&w.bt>0)){r.bdrop=.6;BLOOD.push({x:r.x+rnd(-2,2),y:r.y+rnd(-1,1),a:.8})}
  if(d.hp<dogMax(d)*.2)tt('bl'+d.id,'🩸 '+d.name+' está sangrando muito! Faça um curativo (🩹)','bad',15)}
}
// ---- pegada / caça com cães
function tryGrip(d,r,a){
 const sp=SPECIES[a.sp],res=preyRes(a);r.cd=.75;
 if(sp.venom||a.kg<4){
  if(sp.venom&&Math.random()<.45)dogHurt(d,ri(3,7),a,{venom:1});
  a.hitQ='body';a.dogKill=1;killWild(a);r.st='follow';r.tgt=null;r.wag=4;
  partyDogs().forEach(x=>{const q=dogRT(x);if(q.tgt===a){q.st='follow';q.tgt=null}});
  toast('🐕 '+d.name+' pegou o(a) '+sp.n+'!','good');return;
 }
 const ch=clamp(.3+.55*effStr(d)/res,.15,.95)*(a.stam===undefined?1:1.35-a.stam*.35)*(sp.aggr?.8:1);
 if(Math.random()<ch){
  r.st='hold';r.tgt=a;if(!a.held)a.held=[];if(!a.held.includes(d.id))a.held.push(d.id);a.st='held';barkSnd(DOGS[d.breed].sz>1);
  tt('grip'+a.id,'🐕 '+d.name+' AGARROU o(a) '+sp.n+'!'+(a.held.length===1&&effStr(d)<res?' Ele sozinho não aguenta!':''),'good',3);
  for(const o of WILD)if(o!==a&&o.st!=='dead'&&Math.hypot(o.x-a.x,o.y-a.y)<170)alarm(o,a.x,a.y);
 }else if(sp.aggr&&Math.random()<.5)dogHurt(d,sp.dmg*.5,a);
}
function catchCmd(){
 const ps=partyDogs().filter(d=>d.hp>dogMax(d)*.3);if(!ps.length)return toast('Nenhum cão em condições de caçar','bad');
 let best=null,bd=1e9;for(const a of WILD){if(a.st==='dead'||a.vis<.15)continue;const dd=Math.hypot(a.x-P.x,a.y-P.y);if(dd<320&&dd<bd){bd=dd;best=a}}
 if(!best)return toast('🐕 Nenhum animal à vista para soltar os cães','bad');
 ps.forEach(d=>{const r=dogRT(d);r.st='catch';r.tgt=best;r.bark=1});barkSnd(1);
 const tot=ps.reduce((s,d)=>s+effStr(d),0),res=preyRes(best);
 toast('🐕 PEGA! '+ps.map(d=>d.name).join(' e ')+' atrás do(a) '+SPECIES[best.sp].n+(tot<res*.9?' — ⚠️ forte demais para eles!':''),tot<res*.9?'bad':'good');
}
const _setCmd=setCmd;
setCmd=function(c){
 if(c==='attack'&&!THV.some(t=>thActive(t))){catchCmd();return}
 if(c==='follow'||c==='stay'){partyDogs().forEach(d=>{const r=dogRT(d);if(r.st==='hold'||r.st==='catch')releaseDog(d);if(c==='follow'){r.recall=1;r.noAuto=10;r.ret=1;r.defT=undefined}r.st=c;r.tgt=null});toast('🐕 '+(c==='follow'?'Aqui! Junto!':'Fica!'));return}
 _setCmd(c);
};
function stepPrey(dt){
 for(const a of WILD){
  if(a.stam!==undefined&&!(a.chT>0))a.stam=Math.min(1,a.stam+dt/25);if(a.chT>0)a.chT-=dt;
  if(a.st==='dead'){if(a.held)a.held=null;continue}
  const sp=SPECIES[a.sp];
  if(a.held){
   a.held=a.held.filter(id=>{const d=S.dogs.find(x=>x.id===id);if(!d)return false;const r=dogRT(d);return r.st==='hold'&&r.tgt===a});
   if(!a.held.length){a.held=null;a.ratio=0;a.st=sp.aggr?'charge':'flee';a.ft=4;a.fa=Math.atan2(a.y-P.y,a.x-P.x);continue}
   const dogs=a.held.map(id=>S.dogs.find(x=>x.id===id)),grip=dogs.reduce((s,d)=>s+effStr(d),0),res=preyRes(a),ratio=grip/res;a.ratio=ratio;a.st='held';
   if(ratio<1){
    a.dragA=a.dragA===undefined?Math.atan2(a.y-P.y,a.x-P.x):a.dragA+gauss()*dt;const s=(1-ratio)*sp.spd*.9;wmove(a,Math.cos(a.dragA)*s,Math.sin(a.dragA)*s,dt);a.dir=Math.cos(a.dragA)>0?1:-1;
    if(Math.random()<dt*(1-ratio)*.55){const d=pick(dogs);releaseDog(d);dogRT(d).st='catch';dogRT(d).tgt=a;dogRT(d).cd=1.6;dogHurt(d,sp.aggr?sp.dmg*.4:clamp(a.kg/18,1,10),a);tt('free'+a.id,'💢 O(a) '+sp.n+' se soltou de '+d.name+'!','bad',3)}
   }
   for(const d of dogs)a.hp-=DOGS[d.breed].bite*ageF(d)*dt*.06;
   if(a.hp<=0){a.hitQ='body';a.dogKill=1;killWild(a);dogs.forEach(d=>{const r=dogRT(d);r.st='follow';r.tgt=null;r.wag=4});toast('🐕 Os cães mataram o(a) '+sp.n+' (carne machucada, vale menos)','bad');continue}
   a.acd=(a.acd===undefined?1:a.acd)-dt;
   if(a.acd<=0){a.acd=rnd(1.1,1.8);let dm=sp.aggr?sp.dmg*.55:clamp(a.kg/14,1,16);if(!sp.aggr&&a.kg<40)dm*=.4;dm*=clamp(1.4-ratio*.5,.35,1.3);if(Math.random()<(sp.aggr?.8:.5))dogHurt(pick(dogs),dm,a)}
   const W=WSZ[a.sp]||(a.sp==='elk'?22:a.sp==='deer'?16:a.sp==='boar'?15:12);
   dogs.forEach((d,i)=>{const r=dogRT(d);if(!r||d.dead)return;const side=i%2?1:-1,hl=DOGS[d.breed].v.len/2;r.x=a.x+side*(W/2+hl*.55)+Math.sin(frame*.9+i)*.5;r.y=a.y+(i>1?3:-.5)+(i>1?1:0);r.dir=side>0?-1:1;r.moving=0;r.pose='hold'});
  }else if(a.st==='bay'){
   const foes=partyDogs().filter(d=>{const r=dogRT(d);return r.st==='catch'&&r.tgt===a});
   if(!foes.length){a.bayT=(a.bayT||0)+dt;if(a.bayT>1.5){a.bayT=0;a.st=sp.aggr?'charge':'flee';a.ft=4;a.fa=Math.atan2(a.y-P.y,a.x-P.x)}continue}
   a.bayT=0;let n=null,nd=1e9;for(const d of foes){const r=dogRT(d),dd=Math.hypot(r.x-a.x,r.y-a.y);if(dd<nd){nd=dd;n=d}}
   const r=dogRT(n);a.dir=r.x>a.x?1:-1;a.acd=(a.acd===undefined?1:a.acd)-dt;
   if(nd>16)wmove(a,(r.x-a.x)/nd*20,(r.y-a.y)/nd*20,dt);
   if(a.acd<=0&&nd<15){a.acd=rnd(1,1.6);const dodge=clamp(DOGS[n.breed].spd/180,.15,.5);if(Math.random()>dodge)dogHurt(n,sp.dmg*.6,a);else tt('dodge'+n.id,'🐕 '+n.name+' desviou do ataque!','good',5)}
   if(Math.hypot(P.x-a.x,P.y-a.y)<15&&a.acd<=.2&&Math.random()<dt*2){P.hp-=Math.round(sp.dmg*.5);P.hurt=.7;toast('⚠️ O(a) '+sp.n+' acuado te acertou!','bad');a.acd=1.4}
  }
 }
}
// ---- IA dos cães
const FV=[[0,1],[0,-1],[-1,0],[1,0]],DH={x:12*TS+9,y:44*TS+2};
stepDogs=function(dt){
 const party=partyDogs(),night=daylight()<.22;
 party.forEach((d,i)=>d._pi=i);
 for(const d of S.dogs.slice()){
  ensureDog(d);if(d.dead)continue;const r=dogRT(d),def=DOGS[d.breed];
  r.cd=Math.max(0,r.cd-dt);r.bark=Math.max(0,r.bark-dt);r.pant=Math.max(0,r.pant-dt*.35);r.wag=Math.max(0,r.wag-dt);r.hurt=Math.max(0,r.hurt-dt);r.pose=null;
  bleedDog(d,r,dt);if(d.dead)continue;
  if(r.st==='hold'){const a=r.tgt;if(!a||a.st==='dead'||!WILD.includes(a)){r.st='follow';r.tgt=null;r.wag=4}else{r.pant=4;continue}}
  const inP=party.includes(d),mx=dogMax(d);let tx=null,ty=null,spd=dogSpd(d)*.7;
  if(!inP&&(r.st==='catch'||r.st==='hold'))releaseDog(d);
  if(inP){
   const dP=Math.hypot(P.x-r.x,P.y-r.y);
   if(r.recall&&dP<40)r.recall=0;
   if(dP>280&&r.st!=='catch'&&r.st!=='stay'&&!(r.recall&&dP<1400)){r.x=P.x-FV[P.dir][0]*(20+d._pi*12)+(d._pi%2?10:-10);r.y=P.y-FV[P.dir][1]*(20+d._pi*12);r.recall=0}
   if(r.st==='follow'&&!(r.noAuto>0)){const ch=WILD.find(a=>a.st==='charge'&&Math.hypot(a.x-P.x,a.y-P.y)<(S.dogDef?90:170));if(ch){if(S.dogDef&&hpF(d)>.45&&Math.hypot(ch.x-P.x,ch.y-P.y)<90){r.st='catch';r.tgt=ch;r.bark=1;r.defT=8;tt('def'+d.id,'🐕 '+d.name+' foi te defender do(a) '+SPECIES[ch.sp].n+'! (🐕 Junto chama de volta)','good',8)}else{r.bark=.4;r.growl=1;tt('gr'+ch.id,'🐕 '+d.name+' está rosnando: '+SPECIES[ch.sp].n+' vindo! Aperte PEGA para soltar o cão.','bad',10)}}}
   if(r.noAuto>0)r.noAuto-=dt;
   if(r.st==='retreat'){tx=P.x-FV[P.dir][0]*12;ty=P.y-FV[P.dir][1]*12;spd=dogSpd(d)*.8;if(dP<18)tx=null;if(hpF(d)>.45)r.st='follow'}
   else if(r.st==='attack'){const t=r.tgt;if(!t||!thActive(t)){r.st='follow';r.tgt=null}else{tx=t.x;ty=t.y;spd=dogSpd(d)*1.4;r.bark=.3;if(Math.hypot(t.x-r.x,t.y-r.y)<10&&r.cd<=0){r.cd=1.1;biteThief(t,def.bite,d)}}}
   else if(r.st==='catch'){
    const a=r.tgt;if(r.defT!==undefined){r.defT-=dt;if(r.defT<=0&&a&&a.st!=='held'){r.defT=undefined;r.st='follow';r.tgt=null;r.noAuto=8}}
    if(a&&r.st==='catch'&&dP>380&&!(a.held&&a.held.length)){r.st='follow';r.tgt=null;r.recall=1;r.noAuto=6;tt('far'+d.id,'🐕 '+d.name+' desistiu: o(a) '+SPECIES[a.sp].n+' fugiu pra longe demais. Ele está voltando.','bad',6)}
    if(r.st!=='catch'){}
    else if(!a||!WILD.includes(a)||a.st==='dead'){r.st='follow';r.tgt=null}
    else{
     const dd=Math.hypot(a.x-r.x,a.y-r.y),sp=SPECIES[a.sp];tx=a.x;ty=a.y;spd=dogSpd(d)*1.45;
     if(r.bsT===undefined||r.bsT<=0){r.bsT=rnd(.8,1.6);r.bark=.35;if(dd<260)barkSnd(def.sz>1)}r.bsT-=dt;
     if(!(a.held&&a.held.length)){
      a.chT=1;if(a.stam===undefined)a.stam=1;a.stam=Math.max(.12,a.stam-dt/(9+sp.flee/60));a.al=1.3;
      if(sp.aggr&&dd<48&&!sp.venom)a.st='bay';
      else if(a.st!=='bay'){a.st='flee';a.fa=Math.atan2(a.y-r.y,a.x-r.x)+Math.sin(frame*.03+a.id)*.5;a.ft=Math.max(a.ft||0,1.5)}
     }
     const W=WSZ[a.sp]||12;if(dd<W/2+def.v.len/2&&r.cd<=0)tryGrip(d,r,a);
    }
   }
   else if(r.st==='track'){const a=r.tgt;if(!a||!WILD.includes(a)){r.st='follow';r.tgt=null}else{tx=a.x;ty=a.y;spd=dogSpd(d)*.85;r.pose='sniff';if(Math.hypot(a.x-r.x,a.y-r.y)<14){tx=null;r.pose='point';r.bark=1;if(r.cd<=0){r.cd=2.5;barkSnd();toast('🐕 '+d.name+' achou! Au au!','good')}}}}
   else if(r.st==='stay'){r.pose='sit'}
   else{
    const i=d._pi,fv=FV[P.dir],sd=i%2?1:-1,mvP=P.moving&&Math.hypot(P.vx,P.vy)>4;
    if(mvP||r.gx===undefined||Math.hypot(r.gx-P.x,r.gy-P.y)>34){r.gx=mvP?P.x-fv[0]*(18+i*10)+(-fv[1])*sd*(6+i*3):P.x+sd*(15+(i>>1)*16);r.gy=mvP?P.y-fv[1]*(16+i*9)+fv[0]*sd*(5+i*2)+2:P.y+3+(i>>1)*8}
    const gx=r.gx,gy=r.gy,gd=Math.hypot(gx-r.x,gy-r.y);
    if(gd>(mvP?8:26))r.ret=1;
    if(r.ret){tx=gx;ty=gy;r.sx=undefined;spd=r.recall?dogSpd(d)*1.5:gd>70?dogSpd(d)*1.3:Math.max(dogSpd(d)*.55,Math.hypot(P.vx,P.vy)*1.05);if(gd<(mvP?3:6)){r.ret=0;tx=null}}
    else if(!mvP){
     r.idle+=dt;r.snT=(r.snT||rnd(4,9))-dt;
     if(r.snT<=0){r.snT=rnd(7,14);r.sx=gx+rnd(-12,12);r.sy=gy+rnd(-6,6)}
     if(r.sx!==undefined){tx=r.sx;ty=r.sy;spd=20;r.pose='sniff';if(Math.hypot(r.sx-r.x,r.sy-r.y)<1.5){r.sx=undefined;tx=null}}
     if(r.idle>1.5&&tx===null){for(const a of WILD){if(a.st==='dead'||a.st==='flee'||a.vis<.25)continue;const ad=Math.hypot(a.x-r.x,a.y-r.y);if(ad<170){r.pose='point';if(Math.abs(a.x-r.x)>6)r.dir=a.x>r.x?1:-1;const ang=Math.atan2(a.y-r.y,a.x-r.x),dn=Math.abs(Math.cos(ang))>Math.abs(Math.sin(ang))?(Math.cos(ang)>0?'leste':'oeste'):(Math.sin(ang)>0?'sul':'norte');tt('pt'+a.id,'👃 '+d.name+' está apontando: '+SPECIES[a.sp].n+' ao '+dn+' ('+Math.round(ad/TS)+' m)','good',25);break}}}
    }
   }
  }else{
   const t=THV.find(t=>thActive(t)&&Math.hypot(t.x-r.x,t.y-r.y)<120+def.guard);
   if(t&&def.guard>=40&&hpF(d)>.3){tx=t.x;ty=t.y;spd=dogSpd(d)*1.3;r.bark=.4;if(Math.hypot(t.x-r.x,t.y-r.y)<10&&r.cd<=0){r.cd=1.1;biteThief(t,def.bite,d)}if(r.cd<=0&&Math.random()<dt)barkSnd(def.sz>1)}
   else if(night||hpF(d)<.4){const o=(S.dogs.indexOf(d)%4)*7-10;tx=DH.x+o;ty=DH.y+(o>5?4:0);spd=dogSpd(d)*.5;if(Math.hypot(tx-r.x,ty-r.y)<2){tx=null;r.pose=night?'sleep':'lie'}}
   else{r.wait=(r.wait||0)-dt;if(r.wait<=0){r.wait=rnd(3,8);r.wx=12*TS+rnd(-30,90);r.wy=47*TS+rnd(-6,30)}tx=r.wx;ty=r.wy;spd=dogSpd(d)*.32;if(Math.hypot(tx-r.x,ty-r.y)<3){tx=null;r.idle+=dt}else r.pose='sniff'}
  }
  r.dcd=Math.max(0,(r.dcd||0)-dt);
  if(tx!==null){const dx=tx-r.x,dy=ty-r.y,dd=Math.hypot(dx,dy);if(dd>.8){const s=Math.min(spd*dt,dd);r.x+=dx/dd*s;r.y+=dy/dd*s;const nd=dx>0?1:-1;if(nd!==r.dir&&Math.abs(dx)>1.2&&(r.dcd<=0||Math.abs(dx)>dd*.7&&dd>10)){r.dir=nd;r.dcd=.35}r.moving=1;r.idle=0;r.run=spd>dogSpd(d)*.95;const lg=def.v.leg;r.ph+=s*(r.run?2*Math.PI*.42/(lg*1.25):2*Math.PI*.62/(lg*.62));if(r.run)r.pant=Math.min(6,r.pant+dt*2)}else r.moving=0}else r.moving=0;
 }
 stepPrey(dt);
};
// ---- desenho
drawDog=function(g,d){
 if(d.dead)return;ensureDog(d);const r=dogRT(d),def=DOGS[d.breed],v=def.v,hl=v.len/2;
 let pose=r.pose;const limp=hpF(d)<.35||d.wounds.some(w=>w.sev>=3&&!w.band);
 if(!pose)pose=r.moving?(r.run?'run':limp?'limp':'walk'):(r.st==='stay'?'sit':r.idle>10?'lie':r.idle>3?'sit':'stand');
 if(pose==='sniff'&&!r.moving&&r.moving!==0)pose='sniff';
 const happy=hpF(d)>.5&&Math.hypot(P.x-r.x,P.y-r.y)<50;
 drawDogSprite(g,r.x,r.y,r.dir||1,v,pose,r.ph,{mv:r.moving,bark:r.bark>0&&((frame>>2)&1),wag:r.wag>0?3:happy&&pose!=='sleep'?1:0,pant:r.pant>.5,sleep:pose==='sleep',shake:pose==='hold',hurt:r.hurt>0,arm:d.arm||0,col:d.col||0,gps:d.gps,wounds:d.wounds});
 const top=r.y-v.leg-v.h-v.head-3;
 if(d.id===S.dogAct)Rr(g,'#ffd75e',r.x-1,top-3,2,2);else if(d.esc)Rr(g,'#6ac04a',r.x-1,top-3,2,2);
 if(hpF(d)<.7||r.st==='hold'||r.st==='catch'){const w=12,f=hpF(d);Rr(g,'#1c120b',r.x-w/2,top-6,w,1.6);Rr(g,f<.3?'#e03030':f<.6?'#e0a431':'#5ac04a',r.x-w/2,top-6,w*f,1.6)}
 if(r.hurt>.3)Rr(g,'#fff',r.x+(r.dir>0?hl+2:-hl-4),top+2,2,1);
};
const _dw=drawWild;
drawWild=function(g,a){
 if(a.held&&a.held.length&&a.st!=='dead'){
  g.save();g.translate(Math.sin(frame*1.7)*.7,0);_dw(g,a);g.restore();
  const W=WSZ[a.sp]||14,top=a.y-(W+12),w=24,rt=clamp((a.ratio||0)/2,0,1);
  Rr(g,'#1c120b',a.x-w/2-1,top-1,w+2,4);Rr(g,(a.ratio||0)>=1?'#5ac04a':'#e05030',a.x-w/2,top,w*rt,2);Rr(g,'#fff',a.x-.5,top-1,1,4);
  if(KN&&KN.a===a){Rr(g,'#1c120b',a.x-w/2-1,top+4,w+2,3);Rr(g,'#f0f0f0',a.x-w/2,top+4.5,w*KN.t/KN.T,2)}
 }else if(a.st==='bay'){_dw(g,a);if((frame>>3)&1)Rr(g,'rgba(200,170,120,.6)',a.x-6,a.y-2,12,2)}
 else _dw(g,a);
};
// GPS e partículas extras
const _dpr2=drawPart;
drawPart=function(g){
 _dpr2(g);
 for(const d of S.dogs){if(!d.gps||d.dead)continue;const r=dogRT(d);if(r.x>CX&&r.x<CX+VW&&r.y>CY&&r.y<CY+VH)continue;
  const ax=clamp(r.x,CX+8,CX+VW-8),ay=clamp(r.y,CY+30,CY+VH-12),dist=Math.round(Math.hypot(r.x-P.x,r.y-P.y)/TS);
  Rr(g,'rgba(20,20,20,.75)',ax-6,ay-6,12,12);Rr(g,'#6ac04a',ax-2,ay-2,4,4);ptext(g,dist+'M',ax-ptw(dist+'M')/2,ay+7,'#fff')}
};
// ---- faca
let KN=null;
function startKnife(a){
 if(!S.h.gear.knife&&!S.h.gear.bowie)return toast('Você precisa de uma faca de caça (Loja do Caçador)','bad');
 if(!(S.h.lic>S.day))return toast('Você precisa de uma licença de caça válida','bad');
 P.aim=0;KN={a,t:0,T:S.h.gear.bowie?.9:1.5,st:0};toast('🔪 Segure firme… (não se mexa)');
}
function stepKnife(dt){
 if(!KN)return;const a=KN.a,sp=SPECIES[a.sp];
 if(!WILD.includes(a)||a.st==='dead'||!a.held||!a.held.length){KN=null;return}
 if(P.moving||Math.hypot(a.x-P.x,a.y-P.y)>32){KN=null;toast('Abate cancelado','bad');return}
 KN.t+=dt;KN.st-=dt;
 if(KN.st<=0){KN.st=.5;const rt=a.ratio||0;if(rt<1.15&&Math.random()<(1.15-rt)*(S.h.gear.bowie?.5:.8)){const dm=Math.round(sp.aggr?sp.dmg*.6:clamp(a.kg/12,3,14));P.hp-=dm;P.hurt=.7;KN=null;toast('💢 O(a) '+sp.n+' se debateu e te acertou! (-'+dm+')','bad');return}}
 if(KN.t>=KN.T){
  a.hitQ='vital';a.knife=1;killWild(a);const ds=(a.held||[]).map(id=>S.dogs.find(x=>x.id===id)).filter(Boolean);
  ds.forEach(d=>{const r=dogRT(d);r.st='follow';r.tgt=null;r.wag=5});a.held=null;KN=null;
  S.h.knifeK=(S.h.knifeK||0)+1;gainXP(sp.xp*.5+10,'faca');ds.forEach(d=>d.exp=(d.exp||0)+1);
  toast('🔪 Abate limpo com faca! Carne de primeira. Bom trabalho, '+ds.map(d=>d.name).join(' e ')+'!','good');
 }
}
const _il3=interactList;
interactList=function(){
 const L=_il3();
 for(const a of WILD){if(a.st==='dead'||!a.held||!a.held.length)continue;const ok=(a.ratio||0)>=1,n=SPECIES[a.sp].n;
  L.push({x:a.x,y:a.y-4,r:28,label:ok?'🔪 Sangrar '+n+' (cães segurando)':'⚠️ '+n+' se debatendo — falta força nos cães',fn:()=>ok?startKnife(a):toast('Os cães não estão dominando. Solte mais cães ou atire com cuidado (pode acertar um cão!).','bad')})}
 return L;
};
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'&&!paused()){const a=WILD.find(a=>a.held&&a.held.length&&a.st!=='dead'&&Math.hypot(a.x-P.x,a.y-P.y)<30);if(a){if((a.ratio||0)>=1)startKnife(a);else toast('Os cães ainda não dominaram o animal','bad')}}});
// tiro perto dos cães
const _fire2=fire;
fire=function(){
 const eq=S.h.eq,m=eq?S.h.mag[eq]:0,tx=AIM.rx+AIM.sx,ty=AIM.ry+AIM.sy;_fire2();
 if(eq&&S.h.mag[eq]<m)for(const d of S.dogs){const r=dogRT(d);if(Math.hypot(r.x-tx,r.y-6-ty)<9&&Math.random()<.4){dogHurt(d,WEAPONS[eq].power*.45,null);toast('💥 VOCÊ ACERTOU '+d.name.toUpperCase()+'! Cuidado ao atirar perto dos cães.','bad');break}}
};
const _upd5=update;update=function(dt){_upd5(dt);stepKnife(dt)};
// ---- rotina diária
function dayDogs(){
 let food=0;
 for(const d of S.dogs.slice()){
  ensureDog(d);d.age++;food+=feedD(d);
  for(const w of d.wounds){w.bt=0;if(w.band){w.heal=(w.heal||0)+1;}else if(!w.inf&&Math.random()<.22){w.inf=1;toast('🦠 A ferida de '+d.name+' ('+w.loc+') infeccionou! Use antibiótico.','bad')}if(w.inf)d.hp-=4*w.sev}
  d.wounds=d.wounds.filter(w=>!(w.band&&!w.inf&&w.heal>=w.sev));
  if(d.hp<=0){dogDie(d,'infecção não tratada');continue}
  d.hp=Math.min(dogMax(d),d.hp+(d.wounds.length?5:14+(S.up.kennel||0)*3));
  const L=DOGS[d.breed].life*360;
  if(d.age===L*.7)toast('🐕 '+d.name+' está ficando veterano(a): perde força e velocidade com o tempo.');
  if(d.age>L*.85&&Math.random()<.0035*Math.pow(d.age/L,4))dogDie(d,'partiu de velhice, com '+ageTxtD(d)+', depois de uma vida fiel');
 }
 if(food)cash(-food,'Ração dos cães');
}
const _hd6=hookDay;hookDay=function(){_hd6();dayDogs()};
// ---- tratamento e equipamento
function dogById(id){return S.dogs.find(x=>x.id==id)}
const vetCost=d=>150+d.wounds.length*80+(d.wounds.some(w=>w.inf)?150:0)+(d.venom>0?120:0)+Math.round((dogMax(d)-d.hp)*2);
Object.assign(ACT,{
 dvkit(e){const d=dogById(e.id);if(!d)return;const op=d.wounds.filter(w=>!w.band);if(!op.length)return toast('Nenhuma ferida aberta');if(!takeItem('vetkit',1))return toast('Sem kit de curativo canino (Dra. Marina vende)','bad');op.forEach(w=>{w.band=1;w.bt=0});d.hp=Math.min(dogMax(d),d.hp+8);toast('🩹 Curativo feito em '+d.name,'good')},
 dabio(e){const d=dogById(e.id);if(!d||!d.wounds.some(w=>w.inf))return toast('Sem infecção');if(!takeItem('antibio',1))return toast('Sem antibiótico (Dra. Marina vende)','bad');d.wounds.forEach(w=>w.inf=0);toast('💊 Infecção tratada','good')},
 dsoro(e){const d=dogById(e.id);if(!d||!(d.venom>0))return toast('Não está envenenado');if(!takeItem('antiv',1))return toast('Sem soro antiofídico','bad');d.venom=0;toast('💉 Veneno neutralizado','good')},
 dogdef(e){S.dogDef=!S.dogDef;toast(S.dogDef?'🛡️ Cães vão te defender quando um bicho atacar perto':'🛡️ Cães só atacam quando você mandar (PEGA)');if(e.id)dogModal(+e.id)},
 dpet(e){const d=dogById(e.id);if(!d)return;dogRT(d).wag=5;if(d.petD!==S.day){d.petD=S.day;d.hp=Math.min(dogMax(d),d.hp+3)}toast('❤️ '+d.name+' abanou o rabo!','good')},
 dvet(e){const d=dogById(e.id);if(!d)return;const c=vetCost(d);if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,'Clínica canina: '+d.name);d.wounds=[];d.venom=0;d.hp=dogMax(d);toast('⚕️ '+d.name+' foi tratado(a) e está 100%','good')},
 dcol(e){const[id,lv]=e.v.split(':'),d=dogById(id),c=COLL[+lv];if(!d||!c||(d.col||0)>=+lv)return;if(S.money<c.p)return toast('Dinheiro insuficiente','bad');cash(-c.p,c.n);d.col=+lv;toast('🔩 '+d.name+' recebeu: '+c.n,'good')},
 dgps(e){const d=dogById(e.id);if(!d||d.gps)return;if(S.money<1600)return toast('Dinheiro insuficiente','bad');cash(-1600,'Coleira GPS');d.gps=1;toast('📡 Coleira GPS em '+d.name+': você vê onde ele está fora da tela','good')},
 dmodal(e){dogModal(e.id)},
 dact(e){S.dogAct=+e.id;const d=dogById(e.id);d.esc=0;dogRT(d).st='follow';toast('🐕 '+d.name+' é o cão ativo')}
});
const statBar=(lbl,v,mx,c,txt)=>'<div class="row" style="font-size:15px"><span style="width:96px;display:inline-block">'+lbl+'</span><span style="flex:1;margin:0 6px">'+bar(v/mx*100,c)+'</span><span class="dim" style="width:42px;text-align:right">'+txt+'</span></div>';
const pv=(breed,id,w)=>'<canvas data-dogpv="'+breed+'"'+(id?' data-id="'+id+'"':'')+' width="128" height="80" style="width:'+(w||96)+'px;height:'+((w||96)*.625)+'px;image-rendering:pixelated;background:linear-gradient(#7ab04a,#5c9c3e);border-radius:4px;flex:none"></canvas>';
function dogStats(d,def){
 const s=d?effStr(d):def.str,sp=d?dogSpd(d):def.spd;
 return statBar('💪 Agarre',s,100,'#e0a431',Math.round(s))+statBar('⚡ Velocidade',sp,110,'#9ad8f5',Math.round(sp))+statBar('🦷 Mordida',def.bite,30,'#d9503f',def.bite)+statBar('🛡️ Guarda',def.guard,100,'#6ac04a',def.guard)+statBar('👃 Faro',def.track,100,'#c08ad8',def.track);
}
function dogModal(id){
 const d=dogById(id);if(!d)return;ensureDog(d);reModal=()=>dogModal(id);const def=DOGS[d.breed],mx=dogMax(d),act=d.id===S.dogAct,r=dogRT(d);
 let h='<div class="row"><b class="px" style="font-size:10px">🐕 '+d.name+' '+(d.sex==='F'?'♀':'♂')+'</b><button class="b gray" data-act="close">✕</button></div>';
 h+='<div class="card" style="display:flex;gap:8px;align-items:center">'+pv(d.breed,d.id,112)+'<div><b>'+def.n+'</b><div class="dim">'+ageTxtD(d)+' · '+stageTxt(d)+'</div><div class="dim">Vive ~'+def.life+' anos · ração '+R$(feedD(d))+'/dia</div><div class="dim">'+(act?'⭐ Cão ativo':d.esc?'Escoltando você':'Vigiando a fazenda')+(d.exp?' · '+d.exp+' abates':'')+'</div></div></div>';
 h+='<div class="card">'+statBar('❤️ Vida',d.hp,mx,d.hp<mx*.3?'#e03030':'#5ac04a',Math.round(d.hp)+'/'+mx)+dogStats(d,def)+'<div class="dim" style="font-size:14px">Agarre = força para segurar caça. Javali pede ~30–60, alce ~80–145, urso ~100–170. Some vários cães.</div></div>';
 h+='<div class="sec">FERIMENTOS</div>'+(d.wounds.length||d.venom>0?'<div class="card">'+(d.venom>0?'<div class="red">☠️ Envenenado ('+Math.ceil(d.venom)+'s)</div>':'')+d.wounds.map(w=>'<div>'+['','🟡 Leve','🟠 Médio','🔴 Grave'][w.sev]+' · '+w.loc+' · '+(w.inf?'<span style="color:#8ac03a">🦠 infeccionado</span>':w.band?'<span class="grn">🩹 enfaixado</span>':w.bt>0?'<span class="red">🩸 sangrando</span>':'<span class="dim">aberto</span>')+'</div>').join('')
  +'<div class="btns"><button class="b gold" data-act="dvkit" data-id="'+d.id+'">🩹 Curativo ('+(S.inv.vetkit||0)+')</button><button class="b" data-act="dabio" data-id="'+d.id+'">💊 Antibiótico ('+(S.inv.antibio||0)+')</button><button class="b" data-act="dsoro" data-id="'+d.id+'">💉 Soro ('+(S.inv.antiv||0)+')</button></div><div class="dim">Ferida aberta pode infeccionar à noite. Tratamento completo na Dra. Marina.</div></div>':'<div class="dim">Nenhum ferimento. 🐾</div>');
 h+='<div class="sec">EQUIPAMENTO</div><div class="card">🦺 '+DARM[d.arm||0].n+'<br>🔩 '+COLL[d.col||0].n+'<br>📡 '+(d.gps?'Coleira GPS':'Sem GPS')+'<div class="dim">Compre no Canil do Seu Tião.</div></div>';
 h+='<div class="btns"><button class="b" data-act="dpet" data-id="'+d.id+'">❤️ Carinho</button>'+(act?'':'<button class="b gold" data-act="dact" data-id="'+d.id+'">⭐ Tornar ativo</button><button class="b '+(d.esc?'gold':'')+'" data-act="dogesc" data-id="'+d.id+'">'+(d.esc?'Escolta: ON':'🐕 Levar comigo')+'</button>')+'<button class="b '+(S.dogDef?'gold':'gray')+'" data-act="dogdef" data-id="'+d.id+'">🛡️ Defesa sozinho: '+(S.dogDef?'LIGADA':'DESLIGADA')+'</button><button class="b gray" data-act="close">Fechar</button></div><div class="dim" style="font-size:14px">Com a defesa desligada os cães só atacam quando você aperta PEGA. 🐕 Junto sempre chama de volta.</div>';
 showModal(h);
}
dogSection=function(buy){
 return '<div class="sec">CÃES'+(buy?' — EQUIPAMENTOS':'')+'</div>'+S.dogs.map(d=>{ensureDog(d);const mx=dogMax(d),act=d.id===S.dogAct;
  let h='<div class="card"><div style="display:flex;gap:8px;align-items:center">'+pv(d.breed,d.id,72)+'<div style="flex:1"><div class="row"><b>'+d.name+' <span class="dim">'+DOGS[d.breed].n+'</span></b><span class="'+(d.hp<mx*.4?'red':'grn')+'">❤️ '+Math.round(d.hp)+'</span></div><div class="dim">'+ageTxtD(d)+' · '+stageTxt(d)+' · agarre '+Math.round(effStr(d))+(d.wounds.length?' · 🩸 '+d.wounds.length:'')+'</div><div class="dim">'+(act?'⭐ ativo':d.esc?'escoltando':'na fazenda')+'</div></div></div>';
  if(buy){h+='<div class="btns">'+DARM.slice(1).map((a,i)=>(d.arm||0)>=i+1?'':'<button class="b gold" data-act="dogarm" data-v="'+d.id+':'+(i+1)+'">🦺 '+a.n+' '+R$(a.p)+'</button>').join('')+COLL.slice(1).map((c,i)=>(d.col||0)>=i+1?'':'<button class="b gold" data-act="dcol" data-v="'+d.id+':'+(i+1)+'">🔩 '+c.n+' '+R$(c.p)+'</button>').join('')+(d.gps?'':'<button class="b gold" data-act="dgps" data-id="'+d.id+'">📡 GPS '+R$(1600)+'</button>')+'</div><div class="dim" style="font-size:14px">Tachas: devolvem 2 de dano a quem morde. Espinhos de aço: devolvem 5 e protegem o pescoço (25%, mais contra lobo e urso).</div>'}
  return h+'<div class="btns"><button class="b" data-act="dmodal" data-id="'+d.id+'">Detalhes e cuidados</button></div></div>'}).join('');
};
dogShopModal=function(){
 reModal=dogShopModal;
 showModal('<h3>🐕 Canil do Seu Tião</h3><div class="dim">Vagas: '+S.dogs.length+' / '+kennelCap()+' (amplie na Casa Agro). Filhote custa 55%, mas leva meses até ter força.</div>'+Object.keys(DOGS).map(k=>{const d=DOGS[k],lock=d.lv>LV();
  return '<div class="card '+(lock?'lock':'')+'"><div style="display:flex;gap:8px;align-items:center">'+pv(k,0,96)+'<div><b>'+d.n+'</b><div class="dim">'+d.d+'</div><div class="dim">Vida '+d.hpm+' · vive ~'+d.life+' anos · porte '+['pequeno','médio','grande'][d.sz]+'</div></div></div>'+dogStats(null,d)
  +(lock?'<div class="red">Requer nível '+d.lv+'</div>':'<div class="btns"><button class="b gold" data-act="dogbuy" data-v="'+k+'">Adulto '+(d.p?R$(d.p):'(adotar grátis)')+'</button>'+(d.p?'<button class="b" data-act="dogbuy" data-v="'+k+':pup">🍼 Filhote '+R$(Math.round(d.p*.55))+'</button>':'')+'</div>')+'</div>'}).join('')
  +'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>');
};
ACT.dogbuy=function(e){
 const[k,pup]=e.v.split(':'),d=DOGS[k];if(!d||d.lv>LV())return;if(S.dogs.length>=kennelCap())return toast('Canil cheio! Amplie na Casa Agro.','bad');
 const p=pup?Math.round(d.p*.55):d.p;if(S.money<p)return toast('Dinheiro insuficiente','bad');if(p)cash(-p,'Cachorro: '+d.n);
 const sex=Math.random()<.5?'M':'F',nm=pick(sex==='M'?NAMES_M:NAMES_F),nd={id:Date.now()%1e7+S.dogs.length,breed:k,name:nm,sex,age:pup?ri(70,110):ri(420,800),wounds:[],col:0,arm:0};
 nd.hp=dogMax(nd);S.dogs.push(nd);toast('🐕 '+nm+' ('+d.n+(pup?', filhote':'')+') chegou à fazenda!','good');
};
kennelModal=function(){
 reModal=kennelModal;
 showModal('<h3>🏠 Canil da fazenda</h3><div class="dim">Clique em um cão para ver vida, ferimentos e equipamentos. Cães fora da escolta vigiam a fazenda e dormem aqui à noite.</div>'+dogSection(0)
  +(S.dogMem&&S.dogMem.length?'<div class="sec">🕯️ MEMORIAL</div>'+S.dogMem.map(m=>'<div class="card dim">'+m.name+' · '+DOGS[m.breed].n+' · '+Math.floor(m.age/360)+' anos — '+m.cause+'</div>').join(''):'')
  +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
};
const _npcModal4=npcModal;
npcModal=function(id){
 _npcModal4(id);if(id!=='marina')return;const last=$('mbox').lastElementChild;if(!last)return;
 last.insertAdjacentHTML('beforebegin','<div class="sec">CLÍNICA CANINA</div>'+['vetkit','antibio'].map(k=>'<div class="card"><div class="row"><b>'+ITEMS[k].ic+' '+ITEMS[k].n+' <span class="dim">(tem '+(S.inv[k]||0)+')</span></b><span class="gold">'+R$(ITEMS[k].p)+'</span></div><div class="btns"><button class="b gold" data-act="buyuse" data-v="'+k+'">Comprar</button></div></div>').join('')
  +S.dogs.filter(d=>d.wounds.length||d.hp<dogMax(d)||d.venom>0).map(d=>'<div class="card"><div class="row"><b>🐕 '+d.name+'</b><span class="dim">❤️ '+Math.round(d.hp)+'/'+dogMax(d)+' · '+d.wounds.length+' ferida(s)</span></div><div class="btns"><button class="b gold" data-act="dvet" data-id="'+d.id+'">Tratamento completo '+R$(vetCost(d))+'</button></div></div>').join(''));
};
// retratos nos menus
setInterval(()=>{
 document.querySelectorAll('canvas[data-dogpv]:not([data-done])').forEach(cv=>{
  cv.dataset.done=1;const b=cv.dataset.dogpv,d=cv.dataset.id?dogById(cv.dataset.id):null,g=cv.getContext('2d'),ps=PS;PS=4;g.setTransform(4,0,0,4,0,0);
  Rr(g,'rgba(60,110,40,.5)',0,15,32,5);
  drawDogSprite(g,15,18,1,DOGS[b].v,d&&d.hp<dogMax(d)*.35?'lie':'stand',0,{wag:1,pant:1,arm:d?d.arm:0,col:d?d.col:0,gps:d&&d.gps,wounds:d?d.wounds:null});PS=ps;
 });
},250);
// HUD dos cães
const dhud=document.createElement('div');dhud.id='dhud';dhud.style.cssText='position:fixed;top:64px;right:6px;z-index:7;font:15px "VT323",monospace;color:#fff;text-shadow:1px 1px 0 #000;display:flex;flex-direction:column;gap:2px;align-items:flex-end';document.body.appendChild(dhud);
dhud.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-dg]');if(el){e.preventDefault();dogModal(el.dataset.dg)}});
setInterval(()=>{
 if(!S||!S.dogs)return;if(modalOpen){dhud.style.display='none';return}dhud.style.display='flex';
 setHTML(dhud,partyDogs().map(d=>{const f=hpF(d),r=dogRT(d),st={hold:'🦷 segurando',catch:'💨 caçando',retreat:'🤕 recuou',stay:'💤 parado',track:'👃 rastreando',attack:'⚔️ atacando'}[r.st]||'';
  return '<div data-dg="'+d.id+'" style="cursor:pointer;background:rgba(20,14,8,.6);padding:1px 5px;border-radius:4px">🐕 '+d.name+' <span style="display:inline-block;width:46px;height:6px;background:#1c120b;vertical-align:middle"><i style="display:block;height:100%;width:'+f*100+'%;background:'+(f<.3?'#e03030':f<.6?'#e0a431':'#5ac04a')+'"></i></span>'+(d.wounds.some(w=>!w.band&&w.bt>0)?' 🩸':'')+(d.venom>0?' ☠️':'')+(d.wounds.some(w=>w.inf)?' 🦠':'')+' <span style="color:#ffd75e">'+st+'</span></div>'}).join(''));
},200);
{const b=document.getElementById('bDogA');if(b)b.innerHTML='🦷<small>PEGAR</small>'}
const _pHunt2=pHunt;
pHunt=function(){return _pHunt2()+'<div class="sec">CAÇA COM CÃES</div><div class="card dim" style="font-size:15px">1) Leve cães (ativo + até 2 de escolta). 2) Com um animal à vista, aperte <b>PEGAR</b> (tecla X). Os cães perseguem, cansam a presa e agarram. 3) Se a força de agarre somada vencer a resistência do bicho, a barra fica <b class="grn">verde</b>: chegue perto e aperte <b>F / ✋</b> para sangrar com a faca (carne de primeira). Barra vermelha = o bicho arrasta os cães e pode se soltar.<br>Javali: Pastor Alemão já segura. Alce e urso: Kangal, Dogo ou Fila — de preferência em dupla. Use colete e coleira de espinhos: animais que mordem seus cães se ferem. Trate feridas com curativo para evitar infecção.</div>'};
