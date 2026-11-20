// ===== Agarrão: urso, jacaré ou sucuri que chega colado te prende. Uma facada (F, E, ✋ ou o botão 🔪) solta,
// empurra o bicho e deixa ele atordoado ~2 s, parado e sem atacar: hora de mirar e atirar.
const GRABS={bear:'O urso te agarrou',croc:'O jacaré te prendeu na mordida',sucuri:'A sucuri se enrolou em você'};
let GRAB=null,GRABCD=0,STABCD=0,SB=null;
const knifeTier=()=>S.h.gear.bowie?2:S.h.gear.knife?1:0;
function stabEscape(){
 if(!GRAB||STABCD>0)return;const a=GRAB.a,sp=SPECIES[a.sp],t=knifeTier(),need=t?1:2;STABCD=.3;
 GRAB.hits=(GRAB.hits||0)+1;a.hp-=[10,26,36][t];a.hurt=1;a.bleed=Math.max(a.bleed||0,2+t*1.5);a.hitQ=a.hitQ||'body';
 for(let i=0;i<5;i++)BLOOD.push({x:a.x+rnd(-4,4),y:a.y+rnd(-2,1),a:1});P.hurt=.15;
 if(GRAB.hits<need){toast('🔪 Golpe com o canivete! Mais um!','good');return}
 const dir=a.x>P.x?1:-1;GRAB=null;
 if(a.hp<=0){killWild(a);toast('🔪 Facada fatal! O(a) '+sp.n+' caiu.','good');GRABCD=1;return}
 a.x=P.x+dir*26;a.y=P.y+2;a.dir=-dir;a.stun=t===2?2.6:2.1;a.cd=Math.max(a.cd||0,a.stun+.5);GRABCD=a.stun+2.5;P.inv=1;
 if(S.h.eq&&!P.aim&&!P.drive){toggleAim();AIM.rx=a.x;AIM.ry=a.y-6}
 toast('🔪 FACADA! O(a) '+sp.n+' te soltou e ficou tonto por '+Math.round(a.stun)+' s. ATIRE AGORA!'+(t?'':' (uma faca de caça solta com um golpe só)'),'good');
}
function stabBtn(){
 if(!SB){SB=document.createElement('button');SB.id='bStab';SB.textContent='🔪 FACADA';
  SB.style.cssText='position:fixed;left:50%;bottom:30%;transform:translateX(-50%);z-index:60;font:bold 20px monospace;padding:14px 24px;border-radius:14px;border:3px solid #fff;background:#c0281e;color:#fff;box-shadow:0 4px 0 #6a1010;display:none;touch-action:manipulation;animation:none';
  SB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();stabEscape()});document.body.appendChild(SB)}
 const on=!!GRAB&&!paused();if(SB._on!==on){SB._on=on;SB.style.display=on?'block':'none'}
 if(on)SB.style.transform='translateX(-50%) scale('+(1+.06*Math.sin(frame*.3))+')';
}
const _updGrb=update;
update=function(dt){
 const st=[];for(const a of WILD)if(a.stun>0&&a.st!=='dead')st.push([a,a.x,a.y]);
 _updGrb(dt);
 GRABCD=Math.max(0,GRABCD-dt);STABCD=Math.max(0,STABCD-dt);if(P.inv>0)P.inv-=dt;
 for(const [a,x,y] of st){if(a.st==='dead'||(a.held&&a.held.length)){a.stun=0;continue}a.x=x;a.y=y;a.stun-=dt;a.cd=Math.max(a.cd||0,.35)}
 if(GRAB){const a=GRAB.a;
  if(!WILD.includes(a)||a.st==='dead'||(a.held&&a.held.length)||P.drive||a.st!=='charge')GRAB=null;
  else{P.x=GRAB.px;P.y=GRAB.py;P.vx=P.vy=0;GRAB.t+=dt;a.x=P.x+GRAB.side*9+Math.sin(frame*1.3)*.6;a.y=P.y+1;a.dir=-GRAB.side}}
 else if(GRABCD<=0&&!P.drive&&!S.horseOn&&!(P.inv>0)){
  for(const a of WILD){if(a.st!=='charge'||!GRABS[a.sp]||a.stun>0||(a.held&&a.held.length))continue;
   if(Math.hypot(a.x-P.x,a.y-P.y)<14){GRAB={a,t:0,px:P.x,py:P.y,side:a.x>P.x?1:-1};toast('⚠️ '+GRABS[a.sp]+'! Aperte 🔪 FACADA'+(isTouch?'':' (F)')+' para se soltar!','bad');break}}
 }
 stabBtn();
};
addEventListener('keydown',e=>{if(!GRAB||paused())return;const k=e.key.toLowerCase();if(k==='f'||k==='e'||k===' '){e.preventDefault();e.stopImmediatePropagation();stabEscape()}},true);
const _ilGrb=interactList;interactList=function(){if(GRAB)return[{x:P.x,y:P.y,r:999,label:'🔪 FACADA para se soltar',fn:stabEscape}];return _ilGrb()};
const _dpGrb=drawPart;
drawPart=function(g){
 _dpGrb(g);
 for(const a of WILD){if(!(a.stun>0)||a.st==='dead')continue;const W=WSZ[a.sp]||14,y=a.y-W-8;
  for(let i=0;i<3;i++){const an=frame*.16+i*2.1;Rr(g,'#ffe25a',a.x+Math.cos(an)*7-1,y+Math.sin(an)*2.2-1,2,2);Rr(g,'#fff6b0',a.x+Math.cos(an)*7-.5,y+Math.sin(an)*2.2-.5,1,1)}}
 if(GRAB&&(frame>>3)&1){Rr(g,'#1c120b',P.x-5,P.y-40,10,8);Rr(g,'#e03030',P.x-4,P.y-39,8,6);Rr(g,'#fff',P.x-.5,P.y-38,1,3);Rr(g,'#fff',P.x-.5,P.y-34.5,1,1)}
};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:6,ic:'🔪',t:'Agarrado por urso',h:'Se um urso, jacaré ou sucuri te agarrar, aperte 🔪 FACADA (F). Ele te solta e fica tonto ~2 s sem atacar: mire e atire. Com faca de caça basta um golpe; sem faca são dois.'});
