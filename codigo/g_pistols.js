// ===== Revólveres e pistolas (nomes fictícios), coldres no boneco, e o Comendador do camarote com negócios e armas =====
const PIST={
 tau38:{n:'Revólver Taurino .38 Special',p:6500,ammo:'a38',cap:6,rel:1.8,range:150,pellets:1,spread:.015,power:30,noise:300,stab:1,speed:900,d:'O clássico do sertão: oxidado, cabo de madeira, 6 tiros. Coldre de couro na cintura e cartucheira.',rep:10,rel:0,hol:'cint',revo:1},
 grz17:{n:'Pistola Grauz G17 9mm',p:9800,ammo:'a9',cap:17,rel:1.3,range:170,pellets:1,spread:.012,power:28,noise:320,stab:.95,speed:1000,d:'Austríaca de polímero preto: leve, confiável, 17 tiros. Coldre tático na coxa.',rep:20,rel:5,hol:'perna'},
 cor1911:{n:'Pistola Coronel 1911 .45',p:22000,ammo:'a45',cap:7,rel:1.4,range:170,pellets:1,spread:.01,power:42,noise:360,stab:.9,speed:950,d:'Aço escovado e talas de jacarandá. A pistola dos coronéis. Coldre de couro trabalhado.',rep:35,rel:15,hol:'cint'},
 bel92c:{n:'Pistola Bellini 92 Cromada 9mm',p:34000,ammo:'a9',cap:15,rel:1.3,range:180,pellets:1,spread:.009,power:30,noise:320,stab:.9,speed:1000,d:'Italiana cromada, espelhada, com cabo de madrepérola. Coldre de ombro de couro preto, por baixo do paletó.',rep:45,rel:30,hol:'ombro'},
 pyt357:{n:'Revólver Píton .357 Magnum 6"',p:48000,ammo:'a357',cap:6,rel:1.9,range:210,pellets:1,spread:.008,power:58,noise:470,stab:.8,speed:1250,d:'Inox polido com cano ventilado de 6 polegadas. Ronco de trovão. Coldre de cintura com cartucheira.',rep:55,rel:40,hol:'cint',revo:1},
 agu50:{n:'Pistola Águia .50 Dourada',p:120000,ammo:'a50',cap:7,rel:1.7,range:220,pellets:1,spread:.012,power:85,noise:620,stab:.6,speed:1400,d:'Banhada a ouro 24k com tigrado no cano. Só para quem manda na região. Coldre de ombro de couro de jacaré.',rep:70,rel:60,hol:'ombro'}
};
for(const k in PIST){WEAPONS[k]=Object.assign({blk:1,pist:1},PIST[k]);WLV[k]=1}
Object.assign(AMMO,{a38:{n:'.38 Special (24)',p:180,q:24},a9:{n:'9mm (50)',p:260,q:50},a45:{n:'.45 ACP (25)',p:240,q:25},a357:{n:'.357 Magnum (24)',p:320,q:24},a50:{n:'.50 AE (14)',p:480,q:14}});
// ---------- desenho detalhado (unidades do jogo; x = da traseira do cabo até a boca do cano; y negativo = para cima)
const PG={
 chrome:(c,x,y,w,h,base)=>{const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#ffffff');g.addColorStop(.25,base||'#dfe4ea');g.addColorStop(.55,'#9aa2ac');g.addColorStop(.75,'#e8ecf0');g.addColorStop(1,'#6a727c');c.fillStyle=g;c.fillRect(x,y,w,h)},
 gold:(c,x,y,w,h)=>{const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#fff6c0');g.addColorStop(.3,'#f0c840');g.addColorStop(.6,'#b8862a');g.addColorStop(.8,'#f4d860');g.addColorStop(1,'#8a6418');c.fillStyle=g;c.fillRect(x,y,w,h)},
 steel:(c,x,y,w,h,dark)=>{const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,dark?'#5a5e66':'#c8ccd2');g.addColorStop(.45,dark?'#2a2c30':'#8a9098');g.addColorStop(1,dark?'#141518':'#4a5058');c.fillStyle=g;c.fillRect(x,y,w,h)},
 serr:(c,x0,x1,y0,y1,col)=>{for(let x=x0;x<x1;x+=.2){c.fillStyle=col;c.fillRect(x,y0,.08,y1-y0)}},
 grip:(c,pts,col,tex,seed)=>{GB.p(c,col,pts);GB.clip(c,pts,()=>{if(tex==='check'){c.fillStyle='rgba(0,0,0,.35)';for(let x=-1;x<4;x+=.22)for(let y=-1;y<4;y+=.22)if(((x+y)*10|0)%2===0)c.fillRect(x,y,.09,.09)}
   else if(tex==='pearl'){for(let i=0;i<40;i++){const r=hsh(i*31+(seed||0));c.fillStyle=['rgba(255,220,240,.5)','rgba(200,240,255,.45)','rgba(255,255,255,.6)','rgba(230,210,180,.4)'][i%4];c.fillRect((r%300)/100,((r>>9)%340)/100-.2,.35,.18)}}
   else if(tex==='wood'){for(let i=0;i<9;i++){c.strokeStyle=i%2?'rgba(50,20,5,.45)':'rgba(255,200,140,.18)';c.lineWidth=.06;c.beginPath();c.moveTo(-.5,i*.4-.3);c.quadraticCurveTo(1.5,i*.4+.3,3,i*.4-.2);c.stroke()}}
   else if(tex==='poly'){c.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<60;i++){const r=hsh(i*13);c.fillRect((r%300)/100,((r>>9)%340)/100,.08,.08)}}
   c.fillStyle='rgba(255,255,255,.12)';c.fillRect(0,0,4,.15)})},
 guard:(c,x0,x1,y0,dep,col,w)=>GB.l(c,col,[[x0,y0],[x0-.05,y0+dep*.75],[x0+.4,y0+dep],[x1-.25,y0+dep],[x1,y0+dep*.5],[x1,y0]],w||.22),
 sight:(c,x,y,col,dot)=>{c.fillStyle=col;c.fillRect(x,y,.3,.22);if(dot){c.fillStyle=dot;c.fillRect(x+.1,y+.02,.1,.1)}}
};
Object.assign(GUNM,{
 tau38:{len:7.2,draw(c){const BL='#2a2c34',BH='#5a5e6a';
  PG.grip(c,[[.5,.2],[2.2,.1],[2.1,.6],[1.7,3.1],[.5,3.2],[.1,2.8],[.45,.8]],'#7a4220','wood',3);GB.r(c,'#c8a040',1.05,1.6,.25,.25);
  PG.steel(c,.4,-.95,2.3,1.15,1);GB.p(c,BL,[[2.2,-.95],[4.3,-.95],[4.3,.35],[3.1,.45],[2.2,.25]]);
  PG.steel(c,2.45,-.9,1.7,1.25,1);for(let i=0;i<3;i++){GB.r(c,'#121318',2.6+i*.55,-.75,.3,.95);GB.r(c,BH,2.62+i*.55,-.72,.08,.88)}
  PG.steel(c,4.2,-.8,3,.55,1);GB.r(c,BL,4.2,-.25,1.8,.45);GB.r(c,'#0a0a0c',7.05,-.75,.15,.45);PG.sight(c,6.8,-1.02,'#1a1a1e');GB.r(c,BH,4.3,-.78,2.8,.1);
  GB.p(c,BL,[[.2,-1.4],[.9,-1],[.7,-.8],[.1,-1.1]]);GB.r(c,'#3a3a40',.95,-1.1,1,.18);
  PG.guard(c,2.1,3.3,.35,.95,BL);GB.trig(c,2.6,.35,'#4a4a52')}},
 grz17:{len:7.4,draw(c){const P='#26282c',S='#1c1d20',H='#4a4e56';
  PG.grip(c,[[.6,-.05],[2.4,-.05],[2.3,.5],[2.05,3.2],[.55,3.25],[.2,2.9],[.55,.6]],P,'poly');for(let i=0;i<3;i++)GB.r(c,'#1a1b1e',.75+i*.42,1.1,.12,1.7);GB.r(c,'#121314',.5,3.05,1.65,.35);
  PG.steel(c,.9,-1.15,6.5,1.05,1);GB.r(c,S,.9,-.2,6.5,.12);PG.serr(c,1.2,2.4,-1.05,-.3,'#0e0f11');PG.serr(c,5.7,6.6,-1.05,-.3,'#0e0f11');
  GB.r(c,'#0a0a0c',3.3,-1.05,1.2,.45);GB.r(c,'#b89a50',3.4,-.95,1,.25);// janela de ejeção com o cano
  GB.p(c,P,[[1.6,-.15],[7.2,-.15],[7.2,.35],[4.6,.4],[2.4,.45]]);for(let i=0;i<3;i++)GB.r(c,'#1a1b1e',5.2+i*.5,.05,.25,.25);
  PG.sight(c,1.05,-1.38,'#1a1b1e','#ffffff');PG.sight(c,6.95,-1.38,'#1a1b1e','#ffffff');GB.r(c,'#c8c8d0',6.4,-.75,.35,.15);
  PG.guard(c,2.45,4.1,.4,1,P,.28);GB.trig(c,3.05,.4,'#3a3c40');GB.r(c,'#4a4c52',3.02,.48,.07,.4)}},
 cor1911:{len:7.6,draw(c){const S='#a8aeb6';
  PG.grip(c,[[.55,-.05],[2.35,-.05],[2.25,.5],[1.95,3.25],[.5,3.3],[.15,2.95],[.5,.55]],'#5a2410','check');GB.o(c,'#d8d8d8',1.15,.75,.14);GB.o(c,'#d8d8d8',1.05,2.6,.14);
  GB.r(c,'#8a9098',.25,-.05,.4,3.2);// mola de segurança da empunhadura
  PG.steel(c,.8,-1.2,6.8,1.05);PG.serr(c,1.05,2.3,-1.1,-.3,'#5a6068');GB.r(c,'#0a0a0c',3.6,-1.1,1.1,.4);GB.r(c,'#d8b860',3.7,-1,.9,.22);
  GB.r(c,'#5a6068',7.35,-.95,.25,.65);GB.o(c,'#3a3e44',7.47,-.62,.1);// bucha do cano
  GB.p(c,S,[[1.6,-.15],[7.1,-.15],[7.1,.3],[4.5,.35],[2.3,.4]]);GB.r(c,'#6a7078',2.4,-.1,.4,.25);GB.o(c,'#5a6068',3,.1,.12);
  GB.p(c,'#6a7078',[[.2,-1.5],[.95,-1.15],[.8,-.9],[.15,-1.2]]);PG.sight(c,1.0,-1.42,'#5a6068');PG.sight(c,7.1,-1.4,'#5a6068');
  PG.guard(c,2.35,3.9,.4,.95,'#8a9098');GB.trig(c,2.9,.35,'#c8ccd2')}},
 bel92c:{len:7.8,draw(c){
  PG.grip(c,[[.55,-.05],[2.45,-.05],[2.35,.5],[2.05,3.3],[.5,3.35],[.15,2.95],[.5,.55]],'#f4ece8','pearl',7);GB.r(c,'rgba(120,100,90,.35)',.6,.2,.08,2.9);GB.o(c,'#c8a040',1.2,.9,.16);GB.o(c,'#c8a040',1.1,2.55,.16);
  PG.chrome(c,.85,-1.15,6.95,.95);PG.serr(c,1.1,2.2,-1.05,-.3,'rgba(80,90,100,.7)');
  GB.r(c,'#1a1b1e',3.2,-1.15,2.4,.25);PG.chrome(c,3.2,-.9,2.4,.3,'#c8ccd2');// topo aberto com o cano à mostra (marca da 92)
  GB.r(c,'#d8a840',3.3,-.85,.7,.2);
  GB.r(c,'#ffffff',1,-1.05,6.6,.1);GB.r(c,'rgba(0,0,0,.25)',1,-.32,6.6,.1);
  GB.p(c,'#b8c0c8',[[1.6,-.2],[7.4,-.2],[7.4,.25],[4.6,.32],[2.4,.4]]);PG.chrome(c,1.7,-.18,5.6,.4,'#d0d6dc');
  GB.p(c,'#d8dce2',[[.15,-1.45],[.95,-1.1],[.8,-.85],[.1,-1.15]]);GB.o(c,'#e8ecf0',1.5,-.7,.18);GB.r(c,'#1a1b1e',1.45,-.75,.1,.12);
  PG.sight(c,1.05,-1.37,'#9aa2ac','#ffffff');PG.sight(c,7.45,-1.37,'#9aa2ac','#ffffff');
  PG.guard(c,2.45,4.3,.4,1.05,'#d8dce2',.26);GB.trig(c,3.05,.38,'#f4f4f4');
  c.fillStyle='rgba(255,255,255,.85)';c.fillRect(5.6,-1.05,.25,.12);c.fillRect(2.6,.05,.18,.1)}},
 pyt357:{len:9,draw(c){
  PG.grip(c,[[.5,.2],[2.25,.1],[2.15,.6],[1.75,3.2],[.5,3.3],[.1,2.9],[.45,.8]],'#6a3418','check');GB.r(c,'#c8a040',1.0,1.5,.3,.3);
  PG.chrome(c,.4,-1.0,2.4,1.25,'#d8dde2');GB.p(c,'#c8cdd2',[[2.2,-1],[4.4,-1],[4.4,.4],[3.1,.5],[2.2,.3]]);
  PG.chrome(c,2.45,-.95,1.8,1.3,'#d0d6dc');for(let i=0;i<3;i++){GB.r(c,'#8a9098',2.6+i*.56,-.8,.3,1);GB.r(c,'#ffffff',2.62+i*.56,-.77,.08,.94)}
  PG.chrome(c,4.3,-.95,4.7,.62,'#e0e4e8');PG.chrome(c,4.3,-.35,4.7,.55,'#c8ccd2');// cano + capa do ejetor
  GB.r(c,'#c8ccd2',4.4,-1.25,4.5,.28);for(let i=0;i<7;i++)GB.r(c,'#3a3e44',4.6+i*.6,-1.2,.32,.18);// costela ventilada
  GB.r(c,'#0a0a0c',8.85,-.9,.15,.5);PG.sight(c,8.6,-1.5,'#9aa2ac','#e83a2a');
  GB.p(c,'#9aa2ac',[[.1,-1.5],[.9,-1.05],[.7,-.85],[0,-1.2]]);GB.r(c,'#b8bec6',.9,-1.15,1,.18);
  PG.guard(c,2.1,3.3,.4,.95,'#c8ccd2');GB.trig(c,2.6,.38,'#e8ecf0')}},
 agu50:{len:8.6,draw(c){
  PG.grip(c,[[.6,-.05],[2.6,-.05],[2.5,.55],[2.2,3.45],[.55,3.5],[.15,3.05],[.55,.6]],'#1a1a1c','check');GB.o(c,'#e8c040',1.2,1.7,.25);GB.r(c,'#e8c040',.55,3.3,1.7,.25);
  PG.gold(c,.85,-1.45,7.75,1.3);PG.serr(c,1.1,2.4,-1.35,-.35,'rgba(120,80,10,.7)');
  c.save();c.beginPath();c.rect(3.6,-1.45,4.9,1.3);c.clip();c.strokeStyle='rgba(60,30,0,.55)';for(let x=3.4;x<9;x+=.42){c.lineWidth=.1+Math.abs(Math.sin(x*5))*.1;c.beginPath();c.moveTo(x,-1.45);c.quadraticCurveTo(x+.3,-.8,x-.1,-.15);c.stroke()}c.restore();// tigrado
  GB.r(c,'#fff6c0',1,-1.38,7.5,.12);GB.r(c,'#0a0a0c',8.45,-1.2,.15,.6);GB.r(c,'#5a4010',3.4,-1.35,1,.3);
  GB.p(c,'#d8b040',[[1.7,-.15],[8.3,-.15],[8.3,.4],[5,.45],[2.5,.5]]);PG.gold(c,1.8,-.12,6.4,.45);
  GB.p(c,'#c89a30',[[.15,-1.75],[1,-1.4],[.85,-1.1],[.1,-1.4]]);PG.sight(c,1.05,-1.7,'#8a6418');PG.sight(c,8.2,-1.7,'#8a6418');
  PG.guard(c,2.6,4.4,.45,1.1,'#d8b040',.3);GB.trig(c,3.2,.4,'#fff0a0')}}
});
// ---------- no boneco: coldre (parado) e na mão estendida (mirando)
const HOLC={tau38:'#7a4220',grz17:'#1a1b1e',cor1911:'#8a5226',bel92c:'#1a1414',pyt357:'#6a3a1a',agu50:'#3a4a2a'};
const _dgPist=drawGun;drawGun=function(g,x,y,k){const W=WEAPONS[k];if(!W||!W.pist||!GUNM[k])return _dgPist(g,x,y,k);if(RMODE&&RMODE!==1&&RMODE!==4)return;
 if(P.aim){const a=AIM.ang,ca=Math.cos(a),flip=ca<0,by=y-8.5,kick=AIM.kick||0;gunAt(g,k,x+ca*(4.5-kick*2),by+Math.sin(a)*(4.5-kick*2),a-(flip?-1:1)*kick*.35,.62,flip);return}
 const d=P.dir===2?-1:1,side=P.dir>=2,hc=HOLC[k]||'#5a3016',hl=shade(hc,25),R=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);
 // cinto
 if(W.hol!=='ombro'){if(P.dir===0||P.dir===1){R('#3a2414',x-3.6,y-6.2,7.2,1.1);R('#c8a040',x-.6,y-6.3,1.2,1.2)}else{R('#3a2414',x-2.4,y-6.2,4.8,1.1)}
  if(W.revo&&RMODE!==4){for(let i=0;i<(side?3:5);i++){const bx=side?x-d*.2-i*.8*d-.2:x-3+i*.9+(i>1?1.2:0);if(!side&&i===2)continue;R('#d8b040',bx,y-6.6,.45,.9);R('#b8862a',bx,y-6.0,.45,.3)}}}
 if(W.hol==='ombro'){
  if(P.dir===0){R(hc,x-3,y-14,1,7);R(hc,x+2,y-14,1,7);R(hc,x-3,y-9.5,6,.8);R('#c8a040',x-.4,y-9.7,.8,.8)}
  else if(P.dir===1){R(hc,x-3,y-14,1,8);R(hc,x+2,y-14,1,8);R(hc,x-2.6,y-11,5.2,.9)}
  else{const hx=x-d*.5,hy=y-9.5;R(hc,hx-2.2,hy-3.4,1,3.4);gunAt(g,k,hx+d*.9,hy+.4,d>0?Math.PI*.96:Math.PI*.04,.4,d>0);R(hc,hx-d*.4-1.6,hy-1.2,3.4,2.6);R(hl,hx-d*.4-1.6,hy-1.2,3.4,.5);if(RMODE!==4)R('#c8a040',hx-d*.4-.3,hy-.2,.6,.6)}
  return}
 const leg=W.hol==='perna',hx=side?x+d*1.2:x+(P.dir===0?3.2:-3.2),hy=y-(leg?3.2:5.4);
 if(P.dir===1){R(hc,hx-1.3,hy-1,2.6,leg?4:4.6);R(hl,hx-1.3,hy-1,2.6,.5);return}
 gunAt(g,k,hx+(side?-d*.4:0),hy-2.6,side?(d>0?Math.PI*.58:Math.PI*.42):Math.PI*.5,.5,side&&d<0);
 R(hc,hx-1.4,hy-.4,2.8,leg?4.2:4.6);R(hl,hx-1.4,hy-.4,.5,leg?4.2:4.6);if(RMODE!==4){R(shade(hc,-30),hx-1.4,hy-.4,2.8,.4);for(let i=0;i<4;i++)R('rgba(255,230,180,.35)',hx+1,hy+.3+i,.3,.4)}
 if(leg){R(shade(hc,-20),hx-1.6,hy+1.6,3.2,.6);R(shade(hc,-20),hx-.4,hy-2.6,.8,2.4)}};
// a Loja do Caçador não vende essas (só o Comendador)
// ---------- O COMENDADOR (camarote do cabaré)
const CMD={n:'Comendador Aurélio Valadares',short:'Comendador'};
let CMDPORT=null;function cmdPortrait(){if(CMDPORT)return CMDPORT;const c=mkCanvas(64,80),g=c.getContext('2d');g.imageSmoothingEnabled=false;const bg=g.createLinearGradient(0,0,0,80);bg.addColorStop(0,'#3a1230');bg.addColorStop(1,'#120410');g.fillStyle=bg;g.fillRect(0,0,64,80);
 const ps=PS;PS=1;const rm=RMODE;RMODE=0;g.save();g.scale(3.2,3.2);try{drawPerson(g,{x:10,y:27,dir:0,ph:0,mv:0,shirt:'#f4f0e4',hair:'#c8c8c8',hat:'#f0e8d0',pants:'#f4f0e4'});Rr(g,'#c8c8c8',7.5,13.6,5,1.6);Rr(g,'#1a1a1a',9.4,17,1.2,4);Rr(g,'#c8302a',9.6,17,.8,1.2);Rr(g,'#5a3016',13,15.4,3,1);Rr(g,'#ff8a3a',16,15.4,.8,1)}catch(e){}g.restore();PS=ps;RMODE=rm;
 g.fillStyle='rgba(220,220,230,.35)';g.fillRect(52,30,4,3);g.fillRect(54,24,5,3);g.fillRect(56,18,4,3);return CMDPORT=c.toDataURL()}
const _dfCmd=drawFurn;drawFurn=function(g,it,x,y,r){const F=frame;
 if(it.k==='comendador'){const px=x+8,py=y+14;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:0,ph:0,mv:0,shirt:'#f4f0e4',hair:'#c8c8c8',hat:'#f0e8d0',pants:'#f4f0e4'});Rr(c,'#1a1a1a',px-.5,py-15,1,4);Rr(c,'#c8302a',px-.4,py-15,.8,1.2);Rr(c,'#c8c8c8',px-2.5,py-17.6,5,1.2);
   const puff=((F>>2)%60)<30;Rr(c,'#5a3016',px+3,py-16.5,3,.9);Rr(c,puff?'#ff8a3a':'#c84a1a',px+6,py-16.5,.8,.9);Rr(c,'#e8c8a0',px-6,py-11,2.4,3);Rr(c,'#c8902a',px-6,py-10,2.4,2);Rr(c,'#c8a040',px+1,py-11,1,1)});
  if(RMODE!==4)for(let i=0;i<3;i++){const t=((F+i*40)%120)/120;Rr(g,'rgba(220,220,230,'+(.35*(1-t)).toFixed(2)+')',px+7+t*4+Math.sin(t*6+i)*1.5,py-18-t*14,2+t*2,1.6+t)}return}
 if(it.k==='guarda'){const px=x+8,py=y+12;OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py,dir:0,ph:0,mv:0,shirt:'#141416',hair:'#1a1a1a',pants:'#141416'});Rr(c,'#0a0a0c',px-2.2,py-17,4.4,1.2);Rr(c,'#f4f4f4',px-.4,py-13,.8,2.5);Rr(c,'#1a1a1a',px-.3,py-12.6,.6,2);Rr(c,'#c8c8d0',px+2.6,py-17.5,.4,2.4)});return}
 if(it.k==='mesacom'){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W=TS;R('rgba(0,0,0,.35)',-2,13,W+4,4);R('#1a0610',-4,2,W+8,6);R('#c8a040',-4,2,W+8,1);R('#0a0208',W/2-1,8,2,6);R('#4a2810',-1,-6,3,8);R('#c8a040',-1,-7,3,1.5);R('#e8c8a0',5,-3,3,4);R('#c8902a',5,-2,3,3);R('#3a3a3a',10,-1,4,2);R('#5a3016',10.5,-1.6,3,.8);R('#ff8a3a',13.4,-1.6,.6,.8);return}
 return _dfCmd(g,it,x,y,r)};
// ---------- conversa (caixa de diálogo com retrato e texto digitado)
function ensureCom(){if(!S.com)S.com={met:0,rel:0,wk:-1,off:[],ct:null,loan:null,tip:null,drinkD:-1};return S.com}
let CMDTY=null;
function cmdSay(txt,opts){clearInterval(CMDTY);const html='<div style="display:flex;gap:10px;align-items:flex-start"><img src="'+cmdPortrait()+'" style="width:84px;height:105px;image-rendering:pixelated;border:3px solid #c8a040;border-radius:4px;flex:none;box-shadow:0 0 12px rgba(200,160,64,.4)"><div style="flex:1"><div class="gold" style="font-family:\'Press Start 2P\',monospace;font-size:11px;margin-bottom:4px">'+CMD.n.toUpperCase()+'</div><div class="dim" style="font-size:12px;margin-bottom:4px">🎩 terno branco · charuto cubano · dois seguranças</div><div id="cmdtx" style="font-size:19px;line-height:1.2;min-height:60px;color:#f3e6c8;font-style:italic"></div></div></div>'
 +'<div id="cmdop" style="display:none">'+opts.map(o=>'<button class="b '+(o.c||'')+'" style="display:block;width:100%;text-align:left;margin:4px 0" data-act="'+o.a+'" data-v="'+(o.v||'')+'">'+o.t+'</button>').join('')+'</div>';
 showModal('<div style="background:linear-gradient(#2a0a20,#1a0614);margin:-4px;padding:8px;border-radius:6px">'+html+'</div>');reModal=null;
 const el=document.getElementById('cmdtx'),op=document.getElementById('cmdop');let i=0;const full='“'+txt+'”';
 const fin=()=>{clearInterval(CMDTY);el.textContent=full;op.style.display='block'};el.onclick=fin;CMDTY=setInterval(()=>{i+=2;el.textContent=full.slice(0,i);if(i>=full.length)fin()},22)}
const cmdName=()=>S.farmName&&(S.rep||0)>=40?'Barão':(S.rep||0)>=20?'doutor':'rapaz';
function cmdOffers(){const C=ensureCom(),wk=Math.floor(S.day/7);if(C.wk===wk&&C.off.length)return C.off;C.wk=wk;const rep=S.rep||0,L=[];
 if(rep>=10)L.push({t:'ct',n:ri(5,14),pr:+rnd(.12,.18).toFixed(2)});
 if(rep>=15)L.push({t:'tip'});
 if(rep>=20){const br=pick(['nelorepo','angus','wagyu','brangus','senepol']);const a=mk(br,'M',ri(900,1300),ri(95,99));a.w=Math.round(wmax(a)*.95);a.breeder=1;a.name=pick(['Imperador','Dom Pedro','Majestade','Sultão','Barão']);L.push({t:'bull',a,price:Math.round(bullPrice(a)*1.3/1000)*1000})}
 if(rep>=25)L.push({t:'loan',v:Math.round(clamp(myNW()*.3,100000,2000000)/10000)*10000});
 return C.off=L}
function cmdMain(first){const C=ensureCom();const nm=cmdName();
 const greet=first?'Senta, '+nm+'. Me chamam de Comendador. Aqui no meu camarote se fala baixo, se bebe do bom e se paga à vista. Dizem que você é gente séria... vamos ver.':pick(['Ora, ora... olha quem voltou. Senta, '+nm+'. O uísque é por minha conta hoje.','Fala, '+nm+'. Tempo é dinheiro, e o meu vale mais que o seu. O que manda?','Meus rapazes disseram que você estava chegando. Senta aí.']);
 const ops=[{t:'💼 Que negócios o senhor tem pra mim?',a:'cmdneg'},{t:'🔫 Ouvi dizer que o senhor tem umas… ferramentas.',a:'cmdarm'},{t:'🥃 Só vim tomar um uísque com o senhor. (R$ 180)',a:'cmddrk'}];
 if(C.ct&&S.herd.filter(a=>a.sex==='M'&&ready(a)).length>=C.ct.n)ops.unshift({t:'🐂 Vim entregar os '+C.ct.n+' bois do nosso contrato.',a:'cmdent',c:'gold'});
 if(C.loan)ops.push({t:'💰 Quero quitar o empréstimo agora ('+R$(Math.round(C.loan.bal))+')',a:'cmdpay'});
 ops.push({t:'🚪 Com licença, Comendador.',a:'close',c:'gray'});cmdSay(greet,ops)}
const cmdLock=k=>{const W=WEAPONS[k],C=ensureCom();return (S.rep||0)<W.rep?'reputação '+W.rep:(C.rel<W.rel?'confiança do Comendador '+W.rel:null)};
function cmdArms(){const C=ensureCom(),H=S.h;let h='<div style="background:linear-gradient(#2a0a20,#1a0614);margin:-4px;padding:8px;border-radius:6px"><h3 style="color:#f0d060">🔫 As ferramentas do Comendador</h3><div class="card"><i>“Um dos meus rapazes abre a maleta em cima da mesa. Veludo vermelho por dentro.” — Confiança dele em você: <b>'+Math.round(C.rel)+'/100</b></i></div>';
 for(const k in PIST){const W=WEAPONS[k],lk=cmdLock(k),own=H.own[k];
  h+='<div class="card'+(lk&&!own?' lock':'')+'" style="border-color:'+(own?'#7ad04a':'#6a2a4a')+'">'+wIcon(k)+'<div class="row"><b>'+W.n+'</b><span class="gold">'+(own?'':R$(W.p))+'</span></div><div class="dim" style="font-size:12px">'+W.d+'</div><div class="dim" style="font-size:12px">💥 '+W.power+' · 🎯 '+Math.round(W.range/TS)+' m · 🔫 '+W.cap+' tiros · munição '+AMMO[W.ammo].n+'</div>'
  +'<div class="btns">'+(own?(H.eq===k?'<span class="grn">Na cintura</span>':'<button class="b gold" data-act="hequip" data-v="'+k+'">Usar</button>')+'<button class="b" data-act="cmdammo" data-v="'+W.ammo+'">Munição ('+R$(AMMO[W.ammo].p)+')</button>':lk?'<span class="red">🔒 Precisa de '+lk+'</span>':'<button class="b gold" data-act="cmdbuy" data-v="'+k+'">Comprar</button>')+'</div></div>'}
 showModal(h+'<div class="btns"><button class="b gray" data-act="cmdback">⬅ Voltar para a mesa</button></div></div>')}
function cmdNeg(){const L=cmdOffers(),C=ensureCom();if(!L.length)return cmdSay('Negócio comigo é pra gente grande, rapaz. Volta quando tiver nome na região.',[{t:'⬅ Voltar',a:'cmdback'}]);
 const ops=L.map((o,i)=>{if(o.t==='ct')return C.ct?null:{t:'🐂 Contrato: '+o.n+' bois gordos em 30 dias, '+Math.round(o.pr*100)+'% acima do frigorífico',a:'cmdok',v:i};
  if(o.t==='tip')return C.tip&&C.tip.until>S.day?null:{t:'📈 Uma dica quente da bolsa ('+R$(tipPrice())+')',a:'cmdok',v:i};
  if(o.t==='bull')return o.sold?null:{t:'🐂 Touro de elite '+BREEDS[o.a.breed].n+' “'+o.a.name+'” '+stars(o.a.gen)+' — '+R$(o.price),a:'cmdok',v:i};
  if(o.t==='loan')return C.loan?null:{t:'💰 Empréstimo de '+R$(o.v)+' a 0,9% ao mês (12 parcelas)',a:'cmdok',v:i}}).filter(Boolean);
 cmdSay(ops.length?'Tenho umas coisas na mesa essa semana. Escolhe com calma... mas não me faz perder tempo.':'Por essa semana é só, '+cmdName()+'. Volta semana que vem.',ops.concat([{t:'⬅ Voltar',a:'cmdback',c:'gray'}]))}
const tipPrice=()=>Math.round(clamp(myNW()*.01,5000,80000)/1000)*1000;
Object.assign(ACT,{
 cmdback(){cmdMain()},cmdneg(){cmdNeg()},cmdarm(){cmdArms()},
 cmddrk(){const C=ensureCom();if(S.money<180)return toast('Dinheiro insuficiente','bad');cash(-180,'Uísque com o Comendador');P.hp=Math.min(100,P.hp+15);if(typeof bebeu==='function')bebeu();if(C.drinkD!==S.day){C.drinkD=S.day;C.rel=Math.min(100,C.rel+3)}
  cmdSay(pick(['Bom homem. Quem bebe comigo não esquece o caminho de volta.','Esse aqui é 18 anos, '+cmdName()+'. Mais velho que muito peão por aí.','Sabe por que eu gosto de você? Você não fala demais.']),[{t:'💼 Falando em negócios…',a:'cmdneg'},{t:'🚪 Com licença.',a:'close',c:'gray'}])},
 cmdbuy(e){const k=e.v,W=WEAPONS[k],C=ensureCom();if(!W||cmdLock(k))return;if(S.money<W.p)return toast('Dinheiro insuficiente','bad');cash(-W.p,'Compra com o Comendador');const H=S.h;H.own[k]=1;H.ammo[W.ammo]=(H.ammo[W.ammo]||0)+AMMO[W.ammo].q*2;C.rel=Math.min(100,C.rel+5);gainXP(30,'arma');
  cmdSay(pick(['Boa escolha. Ela vai com duas caixas de munição, presente da casa. Ninguém precisa saber de onde veio.','Essa aí tem história, '+cmdName()+'. Cuida bem dela.','Negócio fechado. Meus rapazes já embrulharam.']),[{t:'🔫 Colocar no coldre agora',a:'cmdeq',v:k,c:'gold'},{t:'⬅ Voltar para a maleta',a:'cmdarm'}])},
 cmdeq(e){ACT.hequip({v:e.v});hideModal();toast('🔫 '+WEAPONS[e.v].n+' no coldre. Botão de mira para sacar.','good')},
 cmdammo(e){const a=AMMO[e.v];if(S.money<a.p)return toast('Dinheiro insuficiente','bad');cash(-a.p,'Munição');S.h.ammo[e.v]=(S.h.ammo[e.v]||0)+a.q;toast('📦 +'+a.q+' de '+a.n,'good');cmdArms()},
 cmdok(e){const C=ensureCom(),o=cmdOffers()[+e.v];if(!o)return;
  if(o.t==='ct'){C.ct={n:o.n,pr:o.pr,due:S.day+30};C.rel=Math.min(100,C.rel+2);return cmdSay('Fechado. '+o.n+' bois gordos em 30 dias. Eu pago '+Math.round(o.pr*100)+'% acima do frigorífico. Mas olha… eu não gosto de atraso.',[{t:'🤝 Pode confiar, Comendador.',a:'cmdback',c:'gold'}])}
  if(o.t==='tip'){const p=tipPrice();if(S.money<p)return toast('Dinheiro insuficiente','bad');cash(-p,'Dica do Comendador');const s=pick(STK.filter(x=>x.cls==='acao'||!x.cls)),good=Math.random()<.75;C.tip={id:s.id,until:S.day+20,good};return cmdSay('Compra '+s.id+' ('+s.n+'). Até o fim do mês ela sobe bonito. Você não ouviu isso de mim.',[{t:'🤫 Entendido.',a:'cmdback',c:'gold'}])}
  if(o.t==='bull'){if(S.herd.length>=Math.floor(cap()*1.3))return toast('Pasto lotado','bad');if(!buyAnimal(o.a,o.price,'Touro do Comendador'))return;o.a.breeder=true;o.sold=1;C.rel=Math.min(100,C.rel+4);return cmdSay('Esse touro veio de um leilão fechado em São Paulo. Os filhos dele vão valer ouro. Já mandei pro seu pasto.',[{t:'⬅ Voltar',a:'cmdback'}])}
  if(o.t==='loan'){C.loan={bal:o.v,parc:Math.round(o.v*.009/(1-Math.pow(1.009,-12))),left:12};cash(o.v,'Empréstimo do Comendador');return cmdSay('Está na sua conta. Parcela todo dia 1º. E '+cmdName()+'… meus rapazes cobram pessoalmente quem esquece.',[{t:'🤝 Combinado.',a:'cmdback',c:'gold'}])}},
 cmdent(){const C=ensureCom(),ct=C.ct;if(!ct)return;const L=S.herd.filter(a=>a.sex==='M'&&ready(a)).sort((a,b)=>b.w-a.w).slice(0,ct.n);if(L.length<ct.n)return;let tot=0;L.forEach(a=>{tot+=sellFrig(a)||0});const extra=Math.round(tot*ct.pr);cash(extra,'Ágio do contrato do Comendador');C.ct=null;C.rel=Math.min(100,C.rel+10);S.rep=Math.min(100,(S.rep||0)+2);gainXP(60,'contrato');
  cmdSay('Palavra cumprida. Gosto assim. Aqui está o seu ágio: '+R$(extra)+' a mais do que o frigorífico pagou.',[{t:'⬅ Voltar',a:'cmdback',c:'gold'}])},
 cmdpay(){const C=ensureCom();if(!C.loan)return;const v=Math.round(C.loan.bal);if(S.money<v)return toast('Dinheiro insuficiente','bad');cash(-v,'Quitação do empréstimo do Comendador');C.loan=null;C.rel=Math.min(100,C.rel+5);cmdSay('Conta zerada. É assim que se faz negócio comigo.',[{t:'⬅ Voltar',a:'cmdback'}])}
});
// prazos, parcelas e a dica da bolsa
const _hdCmd=hookDay;hookDay=function(){_hdCmd();const C=S.com;if(!C)return;
 if(C.ct&&S.day>C.ct.due){C.ct=null;C.rel=Math.max(0,C.rel-15);S.rep=Math.max(0,(S.rep||0)-5);toast('😠 Você não entregou os bois do Comendador. Ele não gostou nada disso (−confiança, −reputação).','bad')}
 if(C.loan&&S.day%30===1){const L=C.loan,p=Math.min(L.parc,Math.round(L.bal*1.009));if(S.money>=p){cash(-p,'Parcela do Comendador');L.bal=L.bal*1.009-p;L.left--;if(L.left<=0||L.bal<1)C.loan=null}else{L.bal*=1.1;C.rel=Math.max(0,C.rel-20);S.rep=Math.max(0,(S.rep||0)-3);toast('🕴️ Dois homens de terno preto vieram “lembrar” da parcela do Comendador. A dívida subiu 10%.','bad')}}
 if(C.tip&&S.day<=C.tip.until&&typeof ensureBk==='function'){ensureBk();const b=S.bk;if(b.p[C.tip.id])b.p[C.tip.id]*=C.tip.good?1.012:.992}};
// interação no camarote
const _raCmd=roomAct;roomAct=function(it,r){if(r.id==='vipcab'&&it.act==='comendador'){if(!cabOn())return toast('🌙 O Comendador só aparece à noite.');const C=ensureCom(),first=!C.met;C.met=1;return cmdMain(first)}return _raCmd(it,r)};
const _ilCmd=interactList;interactList=function(){const L=_ilCmd();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r||r.id!=='vipcab')return L;for(const l of L){const it=r.items.find(i=>i.act==='comendador'&&Math.abs((r.x+i.x+.5)*TS-l.x)<1&&Math.abs((r.y+i.y+1)*TS+4-l.y)<1);if(it)l.label='🎩 Sentar à mesa do Comendador'}return L};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:5,ic:'🎩',t:'O Comendador',h:'No camarote do cabaré escondido fica o Comendador, um bilionário de terno branco. Ele oferece contratos de boi com ágio, touros de elite, empréstimos, dicas da bolsa… e vende revólveres e pistolas para quem tem reputação.'});
// ---------- SALA VIP do Comendador (separada do cabaré, atrás da porta acolchoada com seguranças)
ROOMS.vipcab={id:'vipcab',x:72,y:RZ+30,w:16,h:11,floor:'marble',wall:'#24101c',trim:'#c8a040',win:[],items:[
 {k:'tapetevip',x:0,y:0,w:0,h:0},
 {k:'adega',x:1,y:2,w:2,h:1,act:'uisque'},{k:'charutaria',x:14,y:2,w:1,h:2,act:'charuto'},
 {k:'guarda',x:5,y:3},{k:'comendador',x:7,y:3},{k:'guarda',x:9,y:3},{k:'mesacom',x:7,y:4,w:1,h:1,act:'comendador'},
 {k:'velvet',x:2,y:6,w:3,h:1},{k:'patronc',x:3,y:6,s:'#2a2a3a',h:'#5a4a3a',d:0,hat:'#e8dcb0'},
 {k:'velvet',x:11,y:6,w:3,h:1},{k:'patronc',x:12,y:6,s:'#f4f0e4',h:'#1a1a1a',d:0},
 {k:'cofre',x:14,y:8,w:1,h:1},{k:'luxplant',x:1,y:8},{k:'luxplant',x:10,y:2}],
 wallx:[{k:'quadroc',x:2},{k:'lareira',x:6},{k:'cabecaboi',x:12}]};
const _dfVip=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),F=frame,W=(it.w||1)*TS,H=(it.h||1)*TS;
 switch(it.k){
 case 'tapetevip':{const rm=ROOMS.vipcab,X=(rm.x+4)*TS,Y=(rm.y+3)*TS+6,w=8*TS,h=5*TS;Rr(g,'#5a0a14',X,Y,w,h);Rr(g,'#8a1424',X+3,Y+3,w-6,h-6);Rr(g,'#c8a040',X+5,Y+5,w-10,1);Rr(g,'#c8a040',X+5,Y+h-6,w-10,1);Rr(g,'#c8a040',X+5,Y+5,1,h-10);Rr(g,'#c8a040',X+w-6,Y+5,1,h-10);
  for(let i=0;i<5;i++)Rr(g,'rgba(200,160,64,.5)',X+w/2-2-i*10,Y+h/2-1,3,3),Rr(g,'rgba(200,160,64,.5)',X+w/2-1+i*10,Y+h/2-1,3,3);
  Rr(g,'rgba(255,200,120,.06)',(rm.x+1)*TS,(rm.y+2)*TS,(rm.w-2)*TS,(rm.h-3)*TS);return}
 case 'comendador':{const px=x+8,py=y+12;
  R('rgba(0,0,0,.3)',-4,15,24,4);R('#3a0610',-5,-14,26,20);R('#6a0e1c',-3,-12,22,16);for(let i=0;i<4;i++)for(let k=0;k<3;k++)R('#c8a040',-1+i*6,-10+k*5,1,1);R('#c8a040',-5,-15,26,1.5);// poltrona de couro capitonê
  OL(g,px,py+3,30,42,c=>{drawPerson(c,{x:px,y:py-2,dir:0,ph:0,mv:0,shirt:'#f4f0e4',hair:'#c8c8c8',hat:'#f0e8d0',pants:'#f4f0e4'});Rr(c,'#1a1a1a',px-.5,py-17,1,4);Rr(c,'#c8302a',px-.4,py-17,.8,1.2);Rr(c,'#c8c8c8',px-2.5,py-19.6,5,1.2);Rr(c,'#e8c040',px+2.4,py-13,1,1);
   const puff=((F>>2)%60)<30;Rr(c,'#5a3016',px+3,py-18.5,3,.9);Rr(c,puff?'#ff8a3a':'#c84a1a',px+6,py-18.5,.8,.9);Rr(c,'#e8c8a0',px-7,py-12,2.4,3);Rr(c,'#c8902a',px-7,py-11,2.4,2);Rr(c,'#f0d060',px+1,py-13,1,1)});
  R('#5a0a16',-6,4,7,9);R('#5a0a16',15,4,7,9);R('#c8a040',-6,4,7,1);R('#c8a040',15,4,7,1);R('#4a0812',0,6,16,7);// braços e assento cobrem as pernas: sentado
  if(RMODE!==4)for(let i=0;i<3;i++){const t=((F+i*40)%120)/120;Rr(g,'rgba(220,220,230,'+(.35*(1-t)).toFixed(2)+')',px+7+t*4+Math.sin(t*6+i)*1.5,py-20-t*14,2+t*2,1.6+t)}return}
 case 'portavip':{R('rgba(0,0,0,.35)',-6,0,W+12,4);R('#c8a040',-5,-32,W+10,34);R('#5a0a16',-3,-30,W+6,32);for(let i=0;i<3;i++)for(let k=0;k<5;k++)R('#c8a040',-1+i*7,-27+k*6,1.2,1.2);R('#f0d060',W-3,-15,2,4);R('#f0d060',1,-15,2,4);
  const on=cabOn()&&(F>>5)%2;R(on?'#ff3a8a':'#6a1a3a',-2,-38,W+4,6);ptext(g,'VIP',x+3,y-37,on?'#fff0f8':'#a85a7a');return}
 case 'adega':R('rgba(0,0,0,.3)',0,H-1,W+2,3);R('#2a140a',0,-20,W,H+20);R('#4a2810',2,-18,W-4,H+16);for(let i=0;i<3;i++){R('#2a140a',2,-14+i*7,W-4,1);for(let k=0;k<5;k++){const cc=['#6a2a10','#2a4a1a','#c8902a','#5a1020','#c8902a'][(i+k)%5];R(cc,4+k*5.5,-19+i*7,3,5);R('#f0d060',4+k*5.5,-19+i*7,3,1)}}R('#c8a040',0,-21,W,1.5);R('#e8e8f0',4,H-8,4,4);R('#c8902a',4,H-6,4,2);return;
 case 'cofre':R('rgba(0,0,0,.3)',-1,H-1,W+3,3);R('#2a2c30',0,-8,W,H+8);R('#4a4e56',1,-7,W-2,H+6);R('#1a1c1e',3,-5,W-6,H+2);Rr(g,'#c8a040',x+W/2-2,y+H/2-6,4,4);R('#8a9098',W-4,0,2,4);return;
 }
 return _dfVip(g,it,x,y,r)};
const _dwVip=drawWallDeco;drawWallDeco=function(g,wd,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),F=frame;
 if(wd.k==='lareira'){R('#5a4a40',0,4,48,28);R('#8a7a6a',2,6,44,4);R('#1a0a06',8,12,32,20);const fl=(F>>2)%4;for(let i=0;i<5;i++){const h=8+((i*7+fl*3)%6);R(i%2?'#ff9a2a':'#ffd24a',11+i*6,32-h,4,h);R('#ff5a1a',12+i*6,32-h/2,2,h/2)}R('#c8a040',0,4,48,1.5);R('#e8c040',20,6,8,3);return}
 if(wd.k==='quadroc'){R('#c8a040',0,5,30,22);R('#2a4a2a',2,7,26,18);R('#6a8a4a',2,17,26,8);R('#e8d8a0',6,10,8,5);R('#3a2a1a',16,13,8,5);R('#f4f0e4',18,12,2,2);return}
 if(wd.k==='cabecaboi'){R('#5a3016',6,8,18,16);R('#f0e8d8',0,8,6,3);R('#f0e8d8',24,8,6,3);R('#e8dcc8',-2,5,3,4);R('#e8dcc8',29,5,3,4);R('#3a2010',9,10,12,12);R('#1a0a06',11,14,2,2);R('#1a0a06',17,14,2,2);R('#7a5a3a',12,19,6,4);R('#c8a040',4,24,22,3);return}
 return _dwVip(g,wd,x,y)};
// entrar e sair
const _raVip=roomAct;roomAct=function(it,r){
 if(r.id==='cabare'&&it.act==='vip'&&cabOn()&&vipHoje())return goSub('vipcab',{x:(r.x+it.x+.5)*TS,y:(r.y+it.y+2)*TS+10});
 if(r.id==='vipcab'&&(it.act==='charuto'||it.act==='uisque'))return _raVip(it,ROOMS.cabare);
 return _raVip(it,r)};
const _cvVip=ACT.cabvip;ACT.cabvip=function(e){const had=vipHoje();_cvVip(e);if(!had&&vipHoje()){const r=ROOMS.cabare,it=r.items.find(i=>i.act==='vip');setTimeout(()=>{if(roomAt(P.x,P.y)===r)goSub('vipcab',{x:(r.x+it.x+.5)*TS,y:(r.y+it.y+2)*TS+10})},500)}};
const _exVip=exitRoom;exitRoom=function(){const cr=inRoom()&&roomAt(P.x,P.y);if(cr&&cr.id==='vipcab'&&RET){const Rt=RET,back=SUBSTK.pop()||null;fade(()=>{P.x=Rt.x;P.y=Rt.y;P.dir=0;P.vx=P.vy=0;camInit=0;RET=back});return}return _exVip()};
B3LB.vip=()=>vipHoje()?'🚪 Entrar na sala VIP':'🕴️ Sala VIP (seguranças)';
const _ilVip=interactList;interactList=function(){const L=_ilVip();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r||r.id!=='vipcab')return L;
 for(const l of L){if(l.label==='🚪 Sair')l.label='🚪 Voltar para o cabaré';const it=r.items.find(i=>i.act&&Math.abs((r.x+i.x+(i.w||1)/2)*TS-l.x)<1&&Math.abs((r.y+i.y+(i.h||1))*TS+4-l.y)<1);if(it&&B3LB[it.act]&&it.act!=='vip')l.label=B3LB[it.act]()}return L};
