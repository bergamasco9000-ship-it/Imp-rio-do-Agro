// ===== Coleta da caça animada: o caçador agacha, prepara o animal, levanta do chão e joga no ombro.
// ===== Depois carrega o último animal nas costas (os grandes vão arrastados) até vender na Loja do Caçador.
const _spPk=startPick;startPick=function(a){_spPk(a);if(AIM.pick){const dx=a.x-P.x,dy=a.y-P.y;P.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?0:1)}};
const pkPh=()=>{const k=AIM.pick;if(!k)return null;const u=clamp(k.t/k.T,0,1);return{u,crouch:u<.18?u/.18:u<.66?1:u<.9?1-(u-.66)/.24:0,lift:u<.66?0:Math.min(1,(u-.66)/.24),work:u>=.18&&u<.66}};
const _dwPk=drawWild;drawWild=function(g,a){if(a._lift&&AIM.pick&&AIM.pick.a===a)return;return _dwPk(g,a)};
function pkProxy(sp,x,y,dir,src){return Object.assign({},src||{},{sp,x,y,dir,st:'dead',vis:1,wait:0,dt:0,bleed:0})}
function drawShoulderCarcass(g,proxy,sx,sy,sc,rot){g.save();g.translate(sx,sy);g.rotate(rot||0);g.scale(sc,sc);g.translate(-sx,-sy);try{_dwPk(g,proxy)}catch(e){}g.restore()}
const BIGSP=new Set(['elk','bear','moose','boar_big','anta','capivara','jacare']);
const _dpbPk=drawPlayerBase;drawPlayerBase=function(g){const ph=pkPh();
 if(ph&&ph.crouch>0){g.save();g.translate(P.x,P.y);g.scale(1+.08*ph.crouch,1-.36*ph.crouch);g.translate(-P.x,-P.y);_dpbPk(g);g.restore()}else _dpbPk(g);
 if(ph){const a=AIM.pick.a,side=P.dir>=2?(P.dir===3?1:-1):0;
  if(ph.crouch>.5&&ph.lift===0){// braços até o animal e a faca trabalhando
   const hx=a.x-(side||0)*4,hy=a.y-2,sx0=P.x+(side||0)*2,sy0=P.y-10;let slc='#8a3a2a';try{slc=S.h.outfit==='casual'?(lookToH(S.look).slv||lookToH(S.look).sc):OUTFITS[S.h.outfit].c[0]}catch(e){}for(const o of[-1.2,1.2]){const ex=hx+o,ey=hy+(o>0?1:0);for(let k=0;k<=8;k++){const t=k/8;Rr(g,k<4?slc:'#c89a72',sx0+o*.6+(ex-sx0-o*.6)*t-.8,sy0+(ey-sy0)*t-.8,1.7,1.7)}}Rr(g,'#c89a72',hx-1.5,hy-1,3,2);
   if(ph.work&&((frame>>3)&1)){Rr(g,'#c8ccd2',hx+2,hy-3,.8,3);Rr(g,'#ffffff',hx+2,hy-3,.8,.8)}
   if(ph.work&&((frame>>4)&1))a._jig=1;else a._jig=0}
  if(ph.lift>0){a._lift=1;const k=Math.sin(ph.lift*Math.PI/2),big=BIGSP.has(a.sp)||a.kg>120,sx=a.x+(P.x-a.x)*k,sy=a.y+((P.y-(big?2:21))-a.y)*k;
   drawShoulderCarcass(g,pkProxy(a.sp,sx,sy,a.dir,a),sx,sy,big?1:1-.3*k,big?0:(side||1)*-.35*k);Rr(g,'#c89a72',P.x+3,P.y-17+4*(1-k),1.6,4)}}
 else if(S.h&&S.h.bag&&S.h.bag.length&&!P.drive&&!inRoom()&&RMODE!==4){// leva o último animal coletado
  const b=S.h.bag[S.h.bag.length-1],side=P.dir===2?-1:1,big=BIGSP.has(b.sp)||b.kg>90;
  if(big){const bx=P.x-side*20,by=P.y+2;Rr(g,'#5a3a22',Math.min(bx,P.x-side*3),P.y-6,Math.abs(P.x-side*3-bx),.8);drawShoulderCarcass(g,pkProxy(b.sp,bx,by,side,b),bx,by,.9,0)}
  else{/* desenhado antes do corpo (atrás dos ombros): ver abaixo */}}};
// animal pequeno/médio atravessado nos ombros: vai ATRÁS do caçador (de frente) ou na frente (de costas), com as patas penduradas
const _dpbPk0=drawPlayerBase;drawPlayerBase=function(g){const b=!AIM.pick&&S.h&&S.h.bag&&S.h.bag.length&&!P.drive&&!inRoom()&&RMODE!==4&&S.h.bag[S.h.bag.length-1];
 const small=b&&!(BIGSP.has(b.sp)||b.kg>90);if(!small)return _dpbPk0(g);const side=P.dir===2?-1:P.dir===3?1:0,bob=P.moving?Math.abs(Math.cos(P.ph))*.8:0,sx=P.x-side*1.5,sy=P.y-25+bob;
 const pr=Object.assign(pkProxy(b.sp,sx,sy,side||1,b),{st:'idle',wait:9});const draw=()=>drawShoulderCarcass(g,pr,sx,sy,.6,side?-side*.15:0);
 if(P.dir===1){_dpbPk0(g);draw()}else{draw();_dpbPk0(g);Rr(g,'#c89a72',P.x+(side||1)*3.4,P.y-18.5,1.6,2.5)}};
// tremidinha da carcaça enquanto é preparada
const _dwPk2=drawWild;drawWild=function(g,a){if(a._jig&&AIM.pick&&AIM.pick.a===a){g.save();g.translate(Math.sin(frame*.9)*.6,0);try{_dwPk2(g,a)}finally{g.restore()}return}return _dwPk2(g,a)};
const _fpPk=finishPick;finishPick=function(){const a=AIM.pick&&AIM.pick.a;if(a){a._lift=0;a._jig=0}try{ifx('step','grass',10)}catch(e){}return _fpPk()};

// a barra de progresso desce para não cobrir a animação
const progEl=document.getElementById('prog');const _updPk=update;update=function(dt){_updPk(dt);if(progEl)progEl.style.top=AIM.pick?'68%':'40%'};
