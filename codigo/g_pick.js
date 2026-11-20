// ===== Coleta da caça animada: o caçador agacha, prepara o animal, levanta do chão e joga no ombro.
// ===== Depois carrega o último animal nas costas (os grandes vão arrastados) até vender na Loja do Caçador.
const _spPk=startPick;startPick=function(a){_spPk(a);if(AIM.pick){const dx=a.x-P.x,dy=a.y-P.y;P.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1)}};
const pkPh=()=>{const k=AIM.pick;if(!k)return null;const u=clamp(k.t/k.T,0,1);return{u,crouch:u<.18?u/.18:u<.66?1:u<.9?1-(u-.66)/.24:0,lift:u<.66?0:Math.min(1,(u-.66)/.24),work:u>=.18&&u<.66}};
const _dwPk=drawWild;drawWild=function(g,a){if(a._lift&&AIM.pick&&AIM.pick.a===a)return;return _dwPk(g,a)};
function pkProxy(sp,x,y,dir,src){return Object.assign({},src||{},{sp,x,y,dir,st:'dead',vis:1,wait:0,dt:0,bleed:0})}
function drawShoulderCarcass(g,proxy,sx,sy,sc,rot){g.save();g.translate(sx,sy);g.rotate(rot||0);g.scale(sc,sc);g.translate(-sx,-sy);try{_dwPk(g,proxy)}catch(e){}g.restore()}
const BIGSP=new Set(['elk','bear','moose','boar_big','anta','capivara','jacare']);
// pequenos (coelho, peru) vão pendurados no cinto; o resto é arrastado numa corda que segue o caçador
const hipSmall=b=>b&&b.kg<14&&!BIGSP.has(b.sp);
let DRAG=null;
function hipPos(){const side=P.dir===2?-1:P.dir===3?1:0;return{x:P.x+(side?-side*2.5:3.5),y:P.y-9,side}}
function dragUpd(b){const side=P.dir===2?-1:P.dir===3?1:0;
 if(!DRAG||DRAG.b!==b||Math.hypot(DRAG.x-P.x,DRAG.y-P.y)>90)DRAG={b,x:P.x-side*18,y:P.y+(side?2:P.dir===1?14:-12)};
 const Lr=BIGSP.has(b.sp)||b.kg>90?20:16,dx=DRAG.x-P.x,dy=DRAG.y-(P.y+1),d=Math.hypot(dx,dy);if(d>Lr){DRAG.x=P.x+dx*Lr/d;DRAG.y=P.y+1+dy*Lr/d}
 return DRAG}
function drawRope(g,x0,y0,x1,y1){const n=Math.max(4,Math.round(Math.hypot(x1-x0,y1-y0)/1.5));for(let k=0;k<=n;k++){const t=k/n;Rr(g,'#7a5530',x0+(x1-x0)*t-.45,y0+(y1-y0)*t+Math.sin(t*Math.PI)*1.6-.45,.9,.9)}}
const wsz=sp=>(typeof WSZ!=='undefined'&&WSZ[sp])||12;
// pendurado de cabeça para baixo no cinto (pivô no meio do corpo)
function drawHip(g,b,x,y,side,k){const f=side||1,W=wsz(b.sp),sc=.6,len=W*sc,cx=x,cy=y+1.5+len/2,h=W*.8;
 Rr(g,'#5a3a22',x-.4,y-.5,.9,2.2);const pr=Object.assign(pkProxy(b.sp,cx,cy+h/2,f,b),{st:'idle',wait:9});
 drawShoulderCarcass(g,pr,cx,cy,sc,f*Math.PI/2*(k===undefined?1:k))}
// carcaça arrastada: deitada de patas para cima, centrada na ponta da corda
function dragProxy(b,x,y,dir){const H=wsz(b.sp)*.8;return pkProxy(b.sp,x,y+2-H/2,dir,b)}
function handPos(){const side=P.dir===2?-1:P.dir===3?1:0;return{x:P.x+(side?side*2.5:3),y:P.y-8}}
const _dpbPk=drawPlayerBase;drawPlayerBase=function(g){const ph=pkPh();
 const bag=S.h&&S.h.bag,b=!ph&&bag&&bag.length&&!P.drive&&!inRoom()&&RMODE!==4?bag[bag.length-1]:null;
 if(b&&!hipSmall(b)){// arrastado: carcaça deitada atrás, corda até a mão
  const D=dragUpd(b),h=handPos(),pr=dragProxy(b,D.x,D.y,D.x<P.x?1:-1),behind=D.y<P.y-1;
  const body=()=>{_dpbPk(g)};if(behind){try{_dwPk(g,pr)}catch(e){}drawRope(g,h.x,h.y,D.x,D.y-2);body()}else{body();drawRope(g,h.x,h.y,D.x,D.y-2);try{_dwPk(g,pr)}catch(e){}}
  Rr(g,'#c89a72',h.x-.8,h.y-.8,1.6,1.6);return}
 if(b&&hipSmall(b)){const hp=hipPos();if(P.dir===1){drawHip(g,b,hp.x,hp.y,hp.side);_dpbPk(g)}else{_dpbPk(g);drawHip(g,b,hp.x,hp.y,hp.side)}return}
 if(ph&&ph.crouch>0){g.save();g.translate(P.x,P.y);g.scale(1+.08*ph.crouch,1-.36*ph.crouch);g.translate(-P.x,-P.y);_dpbPk(g);g.restore()}else _dpbPk(g);
 if(ph){const a=AIM.pick.a,side=P.dir>=2?(P.dir===3?1:-1):0;
  if(ph.crouch>.5&&ph.lift===0){// braços até o animal e a faca trabalhando
   const hx=a.x-(side||0)*4,hy=a.y-2,sx0=P.x+(side||0)*2,sy0=P.y-10;let slc='#8a3a2a';try{slc=S.h.outfit==='casual'?(lookToH(S.look).slv||lookToH(S.look).sc):OUTFITS[S.h.outfit].c[0]}catch(e){}for(const o of[-1.2,1.2]){const ex=hx+o,ey=hy+(o>0?1:0);for(let k=0;k<=8;k++){const t=k/8;Rr(g,k<4?slc:'#c89a72',sx0+o*.6+(ex-sx0-o*.6)*t-.8,sy0+(ey-sy0)*t-.8,1.7,1.7)}}Rr(g,'#c89a72',hx-1.5,hy-1,3,2);
   if(ph.work&&((frame>>3)&1)){Rr(g,'#c8ccd2',hx+2,hy-3,.8,3);Rr(g,'#ffffff',hx+2,hy-3,.8,.8)}
   if(ph.work&&((frame>>4)&1))a._jig=1;else a._jig=0}
  if(ph.lift>0){const k=Math.sin(ph.lift*Math.PI/2),small=a.kg*.72<14&&!BIGSP.has(a.sp);if(small)a._lift=1;
   if(small){// levanta e prende no cinto
    const hp=hipPos(),W=wsz(a.sp),tx=hp.x,ty=hp.y+1.5+W*.3,sx=a.x+(tx-a.x)*k,sy=a.y-W*.4+(ty-(a.y-W*.4))*k-Math.sin(k*Math.PI)*5;
    if(k>.95)drawHip(g,{sp:a.sp,kg:a.kg},hp.x,hp.y,hp.side);else drawShoulderCarcass(g,Object.assign(pkProxy(a.sp,sx,sy+W*.4,a.dir,a),{st:'idle',wait:9}),sx,sy,1-.4*k,(hp.side||1)*Math.PI/2*k)}
   else{// amarra a corda: o bicho fica no chão e a corda estica até a mão
    const h=handPos(),cy=a.y-4+wsz(a.sp)*.4,ex=a.x+(h.x-a.x)*k,ey=cy+(h.y-cy)*k;drawRope(g,a.x,cy,ex,ey);Rr(g,'#c89a72',ex-.8,ey-.8,1.6,1.6)}}}};
// tremidinha da carcaça enquanto é preparada
const _dwPk2=drawWild;drawWild=function(g,a){if(a._jig&&AIM.pick&&AIM.pick.a===a){g.save();g.translate(Math.sin(frame*.9)*.6,0);try{_dwPk2(g,a)}finally{g.restore()}return}return _dwPk2(g,a)};
const _fpPk=finishPick;finishPick=function(){const a=AIM.pick&&AIM.pick.a;if(a){a._lift=0;a._jig=0}try{ifx('step','grass',10)}catch(e){}const r=_fpPk();try{const bg=S.h.bag,b=bg[bg.length-1];if(a&&b&&!hipSmall(b))DRAG={b,x:a.x,y:a.y-2+wsz(a.sp)*.4}}catch(e){}return r};

// a barra de progresso desce para não cobrir a animação
const progEl=document.getElementById('prog');const _updPk=update;update=function(dt){_updPk(dt);if(progEl)progEl.style.top=AIM.pick?'68%':'40%'};
