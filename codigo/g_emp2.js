// ===== IMPÉRIO: presença no mundo (heliponto, hangar, Bairro Novo, ponte, asfalto, praça, carro na sede, faixa de prefeito) e ilustrações do menu =====
// ---------- helicóptero: fica onde pousou, decola e pousa com animação
const HPAD={x:6*TS,y:53*TS+8},HANG={x:6*TS,y:61*TS};let HELIA=null,HELIUP=null,PLANEA=null;
const heliPos=()=>S.emp&&S.emp.hpos?S.emp.hpos:HPAD;
const heliBusy=()=>!!(HELIUP||HELIA);
function landSpot(x,y){const okAt=(tx,ty)=>{for(const dx of [-34,-14,0,14,28])for(const dy of [-2,-14,12]){const px=tx+dx,py=ty+dy;if(solidAt(px,py))return false;const i=ti(Math.floor(px/TS),Math.floor(py/TS));if(G[i]===2)return false}return true};
 for(let r=0;r<8;r++)for(let a=0;a<16;a++){const tx=x+Math.cos(a*.39)*r*TS,ty=y+Math.sin(a*.39)*r*TS;if(okAt(tx,ty))return{x:tx,y:ty}}return{x,y}}
function bdoor(id){const b=BLD.find(q=>q.id===id);return b?{x:b.door*TS+8,y:(b.y+b.h)*TS+14}:null}
const HDEST=[['sede','🏡 Sede (heliponto)',()=>({x:HPAD.x,y:HPAD.y})],['vila','🏘️ Praça da vila',()=>({x:BOARD.x+10,y:BOARD.y+14})],['bairro','🏗️ Bairro Novo (BR)',()=>({x:116*TS,y:88*TS})],['banco','🏦 Banco e leilão',()=>bdoor('leilao')],['arena','🤠 Arena de rodeio',()=>({x:ARC.x,y:ARC.y+70})],
 ['mata','🌲 Loja do Caçador (mata norte)',()=>bdoor('lodge')],['posto','🦌 Posto do Caçador',()=>bdoor('posto')],['pesca','🎣 Casa do Pescador',()=>bdoor('pescador')],['frig','🏭 Frigorífico (Pantanal)',()=>({x:FRIG.door*TS+8,y:(FRIG.y+FRIG.h)*TS+22})],
 ['cana','🎋 Canavial da usina',()=>({x:(CANA.x0-1)*TS,y:(CANA.y0+2)*TS})],['lino','🐝 Seu Lino (serra)',()=>{const h=HMD.find(q=>q.id==='lino');return h?{x:(h.x+2)*TS,y:(h.y+5)*TS}:null}],['benedita','🌿 Dona Benedita (cerrado)',()=>{const h=HMD.find(q=>q.id==='benedita');return h?{x:(h.x+2)*TS,y:(h.y+5)*TS}:null}]];
function heliOk(){if(!S.emp||!S.emp.air.heli)return false;if(inRoom()){toast('Saia do prédio primeiro','bad');return false}if(typeof CMT!=='undefined'&&CMT.on){toast('Termine a comitiva antes de voar','bad');return false}if(heliBusy())return false;return true}
function heliModal(){if(!heliOk())return;reModal=null;
 showModal('<h3>🚁 Para onde vamos?</h3>'+empArt('air','heli',200)+'<div class="dim">O piloto leva você e seus cães. Combustível: R$ 1.500 por voo. O helicóptero fica esperando onde pousar.</div><div class="btns" style="flex-direction:column;align-items:stretch">'+HDEST.map(d=>'<button class="b" data-act="hfly" data-v="'+d[0]+'">'+d[1]+'</button>').join('')+'</div><div class="btns"><button class="b gray" data-act="close">Cancelar</button></div>')}
ACT.hfly=function(e){const d=HDEST.find(x=>x[0]===e.v);if(!d||!heliOk())return;const t0=d[2]();if(!t0)return;if(S.money<1500)return toast('Sem dinheiro para o combustível','bad');cash(-1500,'Combustível do helicóptero');hideModal();
 if(P.drive&&typeof vExit==='function')vExit();S.horseOn=false;P.vx=P.vy=0;const hp=heliPos();HELIUP={t:0,x:hp.x,y:hp.y,dest:e.v,t0,nm:d[1].replace(/^\S+\s/,'')};S.emp.flights=(S.emp.flights||0)+1};
function heliArrive(){const U=HELIUP;HELIUP=null;const E=S.emp;let hx,hy,px,py;
 if(U.dest==='sede'){hx=HPAD.x;hy=HPAD.y;px=HPAD.x+46;py=HPAD.y+8;E.hpos=null}else{const s=landSpot(U.t0.x+30,U.t0.y);hx=s.x;hy=s.y;px=s.x-40;py=s.y+6;if(solidAt(px,py-1)){px=s.x+40}E.hpos={x:hx,y:hy}}
 fade(()=>{P.x=px;P.y=py;P.dir=0;P.vx=P.vy=0;camInit=0;if(typeof moveParty==='function')moveParty(P.x,P.y-4);HELIA={x:hx,y:hy,t:0,pl:1}});toast('🚁 Pousando: '+U.nm,'good')}
function heliCall(){if(!heliOk())return;if(P.drive)return toast('Desça do veículo primeiro','bad');const hp=heliPos();if(Math.hypot(P.x-hp.x,P.y-hp.y)<90)return toast('O helicóptero já está aqui do seu lado');if(S.money<3000)return toast('Dinheiro insuficiente','bad');
 cash(-3000,'Helicóptero: buscar o patrão');const s=landSpot(P.x+46,P.y-2);S.emp.hpos={x:s.x,y:s.y};HELIA={x:s.x,y:s.y,t:0,pl:0};if(menuOpen)closeMenu();hideModal();toast('🚁 O piloto está chegando para te buscar!','good')}
// ---------- helicóptero Robinson R44 detalhado (vista lateral, bico para a direita, chão em y=0)
function drawHeli(g,x,y,lift,rot,spin,o){o=o||{};const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 if(lift<80){const k=Math.max(.3,1-lift/100),a=.3*k;R('rgba(0,0,0,'+a.toFixed(2)+')',-20*k,-1.6,40*k,3.2);R('rgba(0,0,0,'+(a*.55).toFixed(2)+')',-25*k,-1,50*k,2)}
 if(spin&&lift<34)for(let i=0;i<12;i++){const an=i*.52+frame*.06,r=16+((frame*.7+i*7)%18);R('rgba(205,185,145,'+Math.max(0,.42-lift/80).toFixed(2)+')',Math.cos(an)*r-1.5,-1.5+Math.sin(an)*r*.28,3+r*.07,1.6)}
 g.save();g.translate(x,y-lift);if(o.tilt)g.rotate(o.tilt);const Q=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);
 const W='#f6f6f2',W2='#e4e4de',W3='#c8c8c0',RED='#c8302a',GOLD='#e0b040',GL='rgba(30,56,86,.8)',GT='rgba(140,190,230,.55)',SH='rgba(235,248,255,.75)',M='#8a8e96',M2='#c0c4cc',DK='#33373e',blink=((frame>>4)&1)===1;
 // esqui e montantes do outro lado
 Q('#5e626a',-12.6,-2.8,27,1);Q('#5e626a',15,-3.6,1.2,1);Q('#5e626a',-5.8,-7,1,4.4);Q('#5e626a',7.8,-7,1,4.4);
 // cone de cauda afinando
 for(let i=0;i<26;i++){const t=i/26,h=3.2-1.6*t,yc=-13.4-t*1,xx=-13-i;Q(W2,xx,yc-h/2,1.05,h);Q(W,xx,yc-h/2,1.05,h*.42);Q(W3,xx,yc+h/2-.5,1.05,.5);Q(RED,xx,yc+h*.08,1.05,Math.max(.35,h*.2))}
 g.save();g.translate(-28.5,-15.6);g.scale(.42,.42);ptext(g,'PT-BOI',0,0,'#2a2a2a');g.restore();
 // estabilizador e deriva
 Q(W3,-37,-15.6,5.4,.9);Q(W,-37,-15.8,5.4,.4);Q(RED,-32.2,-16.6,.8,2.2);
 Q(W2,-40.6,-23.6,2.4,2);Q(W2,-40,-21.8,2.8,3);Q(W2,-39.6,-19,3,3.8);Q(W,-40.4,-23.4,.8,7.6);Q(RED,-40.8,-24,2.6,1.2);
 Q(W2,-39,-14.6,2.2,4.6);Q(W3,-38.8,-10.2,1.8,1);Q(M,-38.6,-9.4,.7,1.6);Q(M,-39.2,-8,1.9,.6);
 Q(blink?'#ff3a2a':'#8a1a10',-40.4,-24.9,1.4,1);if(blink)Q('rgba(255,80,60,.28)',-41.8,-26,4.2,3.2);
 // rotor de cauda
 Q(M2,-40,-17.6,2.4,2);Q(M,-40,-16,2.4,.5);const tx=-38.6,ty=-16.4;
 if(spin){for(let a=0;a<14;a++){const an=a*.449;Q('rgba(50,52,58,.3)',tx+Math.cos(an)*3.5-.4,ty+Math.sin(an)*3.5-.4,.8,.8)}const ta=frame*.9;for(let k=-3;k<=3;k++)Q('rgba(36,38,42,.7)',tx+Math.cos(ta)*k-.3,ty+Math.sin(ta)*k-.3,.7,.7)}
 else{Q(DK,tx-.3,ty-3.4,.6,6.8);Q('#f4f4f4',tx-.3,ty-3.6,.6,.8);Q('#f4f4f4',tx-.3,ty+2.8,.6,.8)}Q(DK,tx-.5,ty-.5,1,1);
 // motor exposto, carenagem da transmissão e escapamento
 Q('#6e727a',-13.2,-16.8,3.6,7.4);for(let i=0;i<4;i++)Q('#50545c',-12.9,-16+i*1.7,3,.5);Q('#9a3a2a',-12.2,-10,1.4,1);
 Q(W2,-13.8,-20.4,11.4,3.6);Q(W,-13.4,-20.8,10.4,.6);Q(W3,-13.8,-17.2,11.4,.5);for(let i=0;i<4;i++){Q('#6a6a6a',-12.4+i*2.1,-19.7,1.3,.45);Q('#6a6a6a',-12.4+i*2.1,-18.7,1.3,.45)}
 Q('#5a5a5a',-15.8,-11.2,3.2,1.4);Q('#2a2a2a',-16.2,-11,.6,1);
 // mastro e cabeça do rotor
 Q(W2,-2.8,-22.6,4.2,2.6);Q(W,-2.6,-22.8,3.8,.5);Q('#6a6e76',-1,-24.8,1.7,2.4);Q(M,-1.9,-23.4,3.5,.7);Q(M2,-1.7,-24.4,.4,1);Q(M2,.9,-24.4,.4,1);
 // cabine (bolha)
 Q(W,-9.6,-17.8,18.4,11.6);Q(W,-8,-18.8,15.4,1.2);Q(W,-5.2,-19.4,9.4,.8);Q(W2,-11.8,-16,2.4,9.2);Q(W2,-13,-14.2,1.4,6.6);
 Q(W,8.6,-17,2.4,10.6);Q(W,11,-15.8,1.8,8.8);Q(W,12.8,-14.2,1.2,6);Q(W,14,-12.6,.8,3.2);
 Q(W3,-9.2,-7,19.2,.8);Q(W3,-6,-6.4,14,.6);Q(W3,10.4,-7.8,2.6,.8);Q('#ffffff',-6.8,-19.1,8.4,.4);
 // piloto e passageiro atrás do vidro
 Q('#26262a',3.6,-15,1.6,6.2);Q(o.shirt||'#2a4a7a',5,-11.8,3.8,3.4);Q('#e0b088',5.4,-15.6,3,3.2);Q('#3a2a1a',5.2,-16,3.2,1);Q('#26262a',5,-16.3,3.6,.6);Q('#26262a',4.8,-14.8,1,1.9);Q('#26262a',7.6,-13.4,1.6,.4);
 if(o.pass){Q('#26262a',-4.4,-14.6,1.4,5.6);Q(o.pass,-3,-11.8,3.6,3);Q('#e0b088',-2.8,-15,2.8,3);Q(o.hat||'#5a3a22',-3.6,-15.8,4.4,1);Q(o.hat||'#5a3a22',-2.8,-16.8,2.8,1)}
 // vidros com reflexo
 Q(GL,3,-16.8,8.2,8.4);Q(GL,11.2,-15.4,1.8,7);Q(GL,13,-13.6,.9,4.4);Q(GT,3,-16.8,8.2,2.2);Q(GT,11.2,-15.4,1.8,1.6);Q(SH,8,-16,.8,2.6);Q(SH,9.2,-14.8,.6,1.6);Q('rgba(235,248,255,.45)',4,-16.2,.5,5.2);Q(GL,9.6,-9.2,2.8,1.6);
 Q(GL,-6.4,-16.2,8.6,6.8);Q(GT,-6.4,-16.2,8.6,1.6);Q('rgba(235,248,255,.6)',-2,-15.6,.6,3);Q(GL,-9.2,-15.4,2.2,4.6);
 Q(W,2.2,-17,1,9.4);Q('#a8a8a0',-6.9,-16.6,.4,10.2);Q('#a8a8a0',-6.9,-6.8,9.4,.4);Q('#a8a8a0',2.4,-16.6,.4,10.2);Q('#5a5a5a',-.4,-8.8,1.8,.5);Q('#7a7a7a',-6.6,-14,.5,.5);Q('#7a7a7a',-6.6,-9,.5,.5);
 // pintura: faixa vermelha e dourada
 Q(RED,-12.8,-9.6,25.4,1.3);Q(GOLD,-12.8,-8.2,25.4,.5);Q(RED,12.4,-9.8,1.8,1.4);Q(GOLD,-5.2,-11.4,1.2,1.2);Q(GOLD,-5.6,-11.8,.6,.6);Q(GOLD,-4.2,-11.8,.6,.6);
 // degrau, montantes e esqui deste lado
 Q(M,-3,-5.6,5,.5);Q(M,-7.6,-6.8,1.3,5);Q(M,6.2,-6.8,1.3,5);Q(M2,-7.6,-6.8,.4,5);Q(M2,6.2,-6.8,.4,5);Q(M,-7.6,-7,14.6,.6);
 Q(M,-14.6,-2.2,28.6,1.2);Q(M2,-14.6,-2.2,28.6,.4);Q(M,14,-3,1.4,1.2);Q(M,15.2,-4,1,1.2);Q('#4a4e56',-12,-1.2,2.2,.6);Q('#4a4e56',8,-1.2,2.2,.6);
 // luzes
 Q('#3aff6a',12.4,-7.6,.8,.8);Q(o.night||spin?'#fff6c0':'#d8d0a0',13.2,-8.8,1,.8);
 if(o.night&&lift>2){g.fillStyle='rgba(255,245,190,.13)';g.beginPath();g.moveTo(13.6,-8.4);g.lineTo(28,lift);g.lineTo(8,lift);g.closePath();g.fill()}
 // rotor principal (2 pás)
 if(spin){Q('rgba(40,44,50,.15)',-31,-26.8,62,2.2);Q('rgba(40,44,50,.2)',-27,-26.2,54,1.1);const L=31*Math.abs(Math.cos(rot*1.3));Q('rgba(30,32,36,.72)',-.3-L,-26,L*2,.9);Q('rgba(240,240,240,.35)',-31.4,-26.4,1,1.4);Q('rgba(240,240,240,.35)',30.4,-26.4,1,1.4)}
 else{Q(DK,0,-26,30.6,.9);Q(DK,-31,-26,30.8,.9);Q(DK,20,-25.7,10.6,.9);Q(DK,-31,-25.7,10.6,.9);Q('#f4f4f4',29.6,-25.8,1.2,.9);Q('#f4f4f4',-31.2,-25.8,1.2,.9);Q('#5a5e66',-31,-26,61.6,.3)}
 Q('#4a4e56',-1.8,-26.4,3.2,1.2);Q(M2,-.6,-26.9,1,.5);
 g.restore()}
function heliS(g,x,y,l,r,sp,o){g.save();g.translate(x,y);g.scale(1.5,1.5);drawHeli(g,0,0,l/1.5,r,sp,o);g.restore()}
// ---------- avião agrícola Embraer Ipanema EMB-203 (chão em y=0)
function drawPlane(g,x,y,d,o){o=o||{};const r=(c,a,b,w,h)=>Rr(g,c,d>0?x+a:x-a-w,y+b,w,h),Y='#f2c418',Y2='#d8a810',Y3='#b08408',GR='#2a8a3a',M='#8a8e96',blink=((frame>>4)&1)===1;
 if(!o.fly)r('rgba(0,0,0,.25)',-19,-1,40,2.2);
 r(Y3,-5,-8,15,1.1);r(Y3,-21,-10.6,6,.8);
 r('#1e1e1e',-17.8,-2,1.8,1.8);r(M,-17.2,-4.2,.6,2.4);
 for(let i=0;i<15;i++){const t=i/14,top=-14+4.4*t,bot=-5-2.8*t;r(Y,-5-i,top,1.05,bot-top);r(Y2,-5-i,bot-1,1.05,1);r('#fbe070',-5-i,top,1.05,.4)}
 r(Y,-21.2,-17.4,4,7.4);r(Y,-20.6,-18.6,3,1.4);r(Y,-21.6,-11.2,5,1.4);r(Y3,-19.4,-18.2,.4,8);r(GR,-21.2,-18.8,3.4,1);r(blink?'#ff3a2a':'#8a1a10',-20,-19.8,1,1);
 r(Y2,-22.2,-9.8,7,1);r(Y,-22.2,-9.8,7,.4);
 r(Y,-5,-14.8,17,10);r('#fbe070',-5,-14.8,17,.6);r(Y2,-5,-5.8,17,1);
 r(Y,3,-16.4,8,1.6);r(Y,4,-17.2,6,.8);r('#fbe070',4.5,-17.2,4,.4);r('#9a9a9a',6,-17.8,2,.6);
 r('#26323e',-4.6,-18.8,7.6,4.2);r('#5a8ab8',-4.2,-18.4,6.8,3.6);r('rgba(225,242,255,.7)',-3.4,-18,.6,2.6);r('#e8e8e8',-1.2,-18.8,.5,4.2);r('#e8e8e8',2.4,-18.6,.5,4);
 r('#e0b088',-2.8,-17.6,2.4,2.2);r('#f4f4f4',-3,-18.2,2.8,1);r(Y2,-4.8,-19.2,8,.5);r('#4a4a4a',3,-20,.4,1.6);
 r(Y2,12,-13.6,6,8.4);r(Y,12,-13.6,6,.8);for(let i=0;i<3;i++)r(Y3,13+i*1.6,-11.8,.6,2.2);r('#4a4a4a',13,-5.6,3,.8);r('#2a2a2a',15.8,-5.6,.6,.8);
 r('#e8e8e8',18,-11.2,1.2,5);r('#e8e8e8',19.2,-10.4,.8,3.4);r('#c8c8c8',18,-7.2,1.2,.8);
 if(o.prop){r('rgba(60,60,60,.26)',19.8,-17.6,1,18);r('rgba(255,255,255,.4)',19.8,-17.6+((frame*3)%16),1,1.4)}else{r('#222',19.8,-17.2,.9,6.8);r('#222',19.8,-7.8,.9,6.8);r(Y,19.8,-17.6,.9,.8);r(Y,19.8,-1.4,.9,.8)}
 r(GR,-18,-9.8,13,.8);r(GR,-5,-9.4,23,1.1);r('#f4f4f4',-5,-8.3,23,.4);
 r(Y,-6,-6.8,17,1.6);r(Y2,-6,-5.4,17,.6);r('#fbe070',-6,-6.8,17,.4);r(GR,10.4,-7,1,2);
 r('#9aa0a6',-8,-4.4,19,.6);for(let i=0;i<7;i++)r('#5a5e64',-7+i*3,-4,.5,.8);
 r(M,6.2,-5.2,1,3.2);r(Y,4.6,-3.6,4.6,2.2);r(Y2,4.6,-1.8,4.6,.6);r('#1a1a1a',5.6,-1.4,2.8,1.4);
 g.save();g.translate(d>0?x-16.4:x+16.4-9,y-13.6);g.scale(.36,.36);ptext(g,'PT-IPA',0,0,'#1e5a2a');g.restore()}
// ---------- jatinho Embraer Phenom 100 (chão em y=10)
function drawJet(g,x,y){const r=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W='#f6f6f8',W2='#dfe1e6',B='#1a3a7a',GD='#c8a040';
 r('rgba(0,0,0,.2)',-30,9.4,60,2.4);
 r(W2,-9,1.2,20,1.6);r('#b8bcc4',-9.6,-2,.8,3.4);
 r('#1a1a1a',20.4,6.6,2.4,3);r('#8a8e96',21.2,1.8,.8,5);r('#1a1a1a',-5.2,6.6,3.4,3);r('#1a1a1a',-1.4,6.6,3.4,3);r('#8a8e96',-3.2,2.4,1,4.4);
 for(let i=0;i<5;i++){const t=i/4,h=6-3*t;r(W,-26-i,-2-h/2+t*-.6,1.05,h);r(W2,-26-i,-2+h/2-1+t*-.6,1.05,1)}
 r(W,-26,-6,48,8);r('#ffffff',-24,-6,44,.6);r(W2,-26,1,48,1.2);
 r(W,22,-5.4,3,6.8);r(W,25,-4.4,2,4.8);r(W,27,-3.2,1.4,2.6);r(W2,22,0,5,1.2);
 r('#1e2a3a',19,-5.8,4.4,2.2);r('#3a5a7a',19.6,-5.4,3.2,1);r('rgba(230,245,255,.7)',20.4,-5.6,.6,1.4);
 for(let i=0;i<4;i++){r('#1e2a3a',-6+i*5,-4,2.4,2.2);r('#5a7a9a',-6+i*5,-4,2.4,.7);r('rgba(255,255,255,.6)',-5.6+i*5,-3.8,.5,.5)}
 r('#a8acb4',14,-5,.4,6);r('#a8acb4',18.2,-5,.4,6);r('#a8acb4',14,-5,4.2,.4);r('#8a8e96',17.2,-2,.6,.6);
 r(B,-26,.2,52,1);r(GD,-26,1.3,52,.4);
 r(W,-21,-10,12,4.6);r('#ffffff',-21,-10,12,.6);r(W2,-21,-6,12,.8);r('#2a2a2a',-9.6,-9.6,.8,3.8);r('#3a3a3a',-22,-9.4,1,3.4);r(W2,-17,-5.6,5,1.4);r(B,-20,-8.2,8,.6);
 for(let i=0;i<11;i++){const yy=-6-i,x0=-26-i*.75,w=8.4-i*.42;r(i>6?B:W,x0-w,yy,w,1.05);r(i>6?'#2a4a8a':W2,x0-w,yy,.6,1.05)}r(W,-39,-17.4,10.4,1.2);r(B,-39,-16.4,10.4,.4);r('#2a2a2a',-34.6,-14,.6,3);
 g.save();g.translate(-24,-4.6);g.scale(.42,.42);ptext(g,'PR-BOI',0,0,B);g.restore()}
// ---------- carros (mundo)
function carW(g,x,y,c,t,d){const R=(col,a,b,w,h)=>Rr(g,col,d>0?x+a:x-a-w,y+b,w,h),dk=shade(c,-30),lt=shade(c,26),GL='#2a3a4a',GT='#7aa4c8',CH='#d8dce0';
 Rr(g,'rgba(0,0,0,.28)',x-18,y-1.6,36,3.2);
 const wheel=wx=>{R('#141414',wx-3,-4.4,6,5.4);R('#2a2a2a',wx-2.4,-3.8,4.8,4.2);R('#b8bcc4',wx-1.6,-3,3.2,2.6);R('#6a6e76',wx-.4,-2.2,.8,1);R(dk,wx-3.6,-5.2,7.2,1)};
 if(t==='sport'){R(c,-16,-7.6,32,5.4);R(lt,-16,-7.6,32,.8);R(c,-8,-11.6,16,4.2);R(lt,-7,-11.8,13,.5);R(GL,-6,-11,6,3.4);R(GL,.6,-11,6.4,3.4);R(GT,-6,-11,6,1);R(GT,.6,-11,6.4,1);R(c,-.2,-11.4,.8,4);R(dk,-16,-2.8,32,1.4);R(dk,-3,-7,.4,4.2);R('#1a1a1a',-1.8,-5.8,1.6,.4);
  R('#fff6c0',14.4,-7,1.8,1.2);R('#d82a2a',-16,-6.6,1.2,1.4);R(dk,-17,-8.6,3,1);R('#1a1a1a',7.4,-9.4,1.4,1);R(CH,-16,-3.2,2,.6)}
 else if(t==='suv'){R(c,-16,-13,32,10.8);R(lt,-16,-13,32,.8);R('#1a1a1a',-14,-14.4,26,1);R('#1a1a1a',-12,-15.2,.6,1);R('#1a1a1a',8,-15.2,.6,1);
  for(const [a,w] of [[-13.4,7.6],[-4.6,7.6],[4.2,6.4]]){R(GL,a,-11.6,w,4.2);R(GT,a,-11.6,w,1.2)}R(dk,-5.4,-11.6,.8,9);R(dk,3.4,-11.6,.8,9);R('#1a1a1a',-3,-6,1.6,.4);R('#1a1a1a',5.4,-6,1.6,.4);
  R(dk,-16,-3.6,32,1.6);R('#2a2a2a',-18.6,-10.6,2.8,6.4);R('#4a4a4a',-18.2,-9.6,2,4.4);R('#fff6c0',14.6,-9.4,1.6,2.2);R('#d82a2a',-16,-11,1,2.4);R(CH,14.6,-4.2,2,1);R('#1a1a1a',11.4,-10.4,1.6,1.2)}
 else{R(c,-17,-8,34,5.8);R(lt,-17,-8,34,.8);R(c,0,-13.4,14.4,5.6);R(lt,.6,-13.6,13,.6);R(GL,2,-12.4,5.4,4);R(GL,8.4,-12.4,5,4);R(GT,2,-12.4,5.4,1.1);R(GT,8.4,-12.4,5,1.1);R(dk,7.6,-12.4,.6,9.8);R('#1a1a1a',9.6,-6.4,1.6,.4);R('#1a1a1a',3.4,-6.4,1.6,.4);
  R(dk,-17,-8.4,17,.8);R(CH,-17,-9.6,16.4,.6);R(CH,-17,-9.6,.6,1.6);R(CH,-.8,-9.6,.6,1.6);R(dk,-17,-2.8,34,1.4);R('#fff6c0',15.6,-7,1.6,1.8);R('#d82a2a',-17.2,-7.6,1,2);R(CH,15.4,-3.4,2.2,1);R(CH,-18,-3.4,1.6,1);R('#1a1a1a',13.4,-11,1.6,1.2)}
 wheel(-10);wheel(10)}
// ---------- heliponto, hangar e acessórios
const nightE=()=>S.t*24>=18.3||S.t*24<5.6;
function drawHeliport(g,x,cy){const night=nightE(),F=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(a,b,w,h)};
 F('rgba(50,80,30,.35)',x-34,cy-27,68,52);F('#b4b0a8',x+31,cy+8,144-(x+31)+1,7);F('#a29e96',x+31,cy+14,144-(x+31)+1,1);
 F('#aaa69e',x-31,cy-24,62,46);for(let i=0;i<70;i++)F(hs(i,11)>.5?'#a09c94':'#b6b2aa',x-30+hs(i,3)*60,cy-23+hs(3,i)*44,1+hs(i,i)*2,1);
 for(let i=0;i<6;i++)F('rgba(60,50,40,.12)',x-20+hs(i,5)*36,cy-14+hs(5,i)*24,5+hs(i,6)*6,3);
 for(let k=1;k<4;k++)F('#98948c',x-31+k*15.5,cy-24,.5,46);F('#98948c',x-31,cy-1,62,.5);F('#8a867e',x-31,cy+21,62,1.4);F('#c0bcb4',x-31,cy-24,62,.8);
 for(let i=0;i<60;i+=6){F('#f4f4f0',x-29+i,cy-22,3.4,.9);F('#f4f4f0',x-29+i,cy+19,3.4,.9)}for(let j=0;j<42;j+=6){F('#f4f4f0',x-29,cy-22+j,.9,3.4);F('#f4f4f0',x+28,cy-22+j,.9,3.4)}
 g.strokeStyle='#f4f4f0';g.lineWidth=1.6;g.beginPath();g.arc(x,cy-1,17,0,7);g.stroke();g.strokeStyle='#f0c020';g.lineWidth=1;g.setLineDash([3,2]);g.beginPath();g.arc(x,cy-1,12.5,0,7);g.stroke();g.setLineDash([]);
 F('#f4f4f0',x-6,cy-9,2.6,16);F('#f4f4f0',x+3.4,cy-9,2.6,16);F('#f4f4f0',x-6,cy-2.3,12,2.6);
 g.save();g.translate(x+11,cy+10.4);g.scale(.5,.5);ptext(g,'2.5',0,0,'#f4f4f0');g.restore();g.save();g.translate(x-12.4,cy-20.6);g.scale(.45,.45);ptext(g,'BOI DE OURO',0,0,'#f0c020');g.restore();
 for(const [a,b] of [[-24,-17],[24,-17],[-24,15],[24,15]]){F('#5a5a5a',x+a-1,cy+b-1,2,2);F('#8a8a8a',x+a-.5,cy+b-.5,1,1)}
 for(const [a,b] of [[-31,-24],[0,-24],[31,-24],[-31,-1],[31,-1],[-31,22],[0,22],[31,22]]){F('#3a3a3a',x+a-1.4,cy+b-1.4,2.8,2.8);F(night?'#7aff9a':'#3a8a4a',x+a-.8,cy+b-.8,1.6,1.6);if(night)F('rgba(110,255,150,.22)',x+a-4,cy+b-4,8,8)}
 if(night)F('rgba(255,240,200,.07)',x-31,cy-24,62,46)}
function drawApron(g,x,y){const F=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(a,b,w,h)};F('rgba(50,80,30,.3)',x-36,y-34,72,78);F('#9e9a90',x-34,y-32,68,34);F('#a6a298',x-18,y+2,36,40);
 for(let i=0;i<40;i++)F(hs(i,21)>.5?'#949086':'#aca89e',x-33+hs(i,8)*64,y-30+hs(8,i)*70,1+hs(i,4)*2,1);for(let k=0;k<4;k++)F('#8e8a80',x-18+k*12,y+2,.5,40);F('#8e8a80',x-18,y+22,36,.5);
 for(let j=4;j<40;j+=7)F('#f0c020',x-.6,y+j,1.2,4);F('#f0c020',x-18,y+2,36,.6)}
function windsock(g,px,py){const night=nightE(),B=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);B('#5a5a5a',px-2,py-1,4,2);B('#d8d8d8',px-.6,py-30,1.2,30);B('#a8a8a8',px+.2,py-30,.4,30);for(let j=0;j<30;j+=7)B('#c83a2a',px-.6,py-30+j,1.2,2);
 const a=S.wind?S.wind.a:0,sp=S.wind&&S.wind.s!==undefined?clamp(S.wind.s,0,1):.6,dir=Math.cos(a)>=0?1:-1;B('#3a3a3a',px-1.2,py-31.4,2.4,1);B('#3a3a3a',px+dir*1.4-.3,py-32.6,.6,4.4);
 for(let i=0;i<5;i++){const w=3.2,sx=px+dir*(1.6+i*3),sag=(1-sp)*i*1.15,wv=Math.sin(frame/7+i)*.5*sp,h=3.8-i*.45;B(i%2?'#f4f4f4':'#f06a1a',dir>0?sx:sx-w,py-32.4+sag+wv+(3.8-h)/2,w,h)}
 B(night&&((frame>>5)&1)?'#ff3a2a':'#8a1a10',px-.7,py-34.2,1.4,1.4)}
function floodP(g,px,py){const night=nightE();BW(g,'#5a5a5a',px-2,py-1,4,2);BW(g,'#6a6e76',px-.7,py-32,1.4,32);BW(g,'#3a3a3a',px-1,py-34.4,6.4,3.2);BW(g,night?'#fff4c8':'#d8d4c0',px+.2,py-31.6,5,1.2);
 if(night){g.fillStyle='rgba(255,240,190,.10)';g.beginPath();g.moveTo(px+1,py-31);g.lineTo(px+70,py+34);g.lineTo(px+14,py+44);g.closePath();g.fill()}}
function avgas(g,px,py){const B=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);B('rgba(0,0,0,.22)',px-12,py-1.5,26,3);B('#8a867e',px-8,py-2,16,2);B('#5a5e64',px-6,py-6,1.4,4);B('#5a5e64',px+4.6,py-6,1.4,4);
 B('#f4f4f0',px-7,py-13,14,7.4);B('#ffffff',px-7,py-13,14,1.2);B('#d8d8d0',px-7,py-7,14,1.2);B('#e2e2da',px-7.8,py-12.4,.8,6.2);B('#e2e2da',px+7,py-12.4,.8,6.2);B('#c8302a',px-7,py-10.6,14,1.6);
 g.save();g.translate(px-5.6,py-10.3);g.scale(.32,.32);ptext(g,'AVGAS 100LL',0,0,'#fff');g.restore();B('#9a9aa2',px-1,py-14.6,2,1.6);
 B('#3a6ab8',px+8.6,py-9,3.4,8);B('#2a2a2a',px+9.2,py-8,2.2,1.4);B('#7ad87a',px+9.6,py-7.6,1.4,.6);B('#1a1a1a',px+12,py-6,.6,4);B('#1a1a1a',px+12,py-2.4,2.4,.6);
 B('#c8302a',px-11.6,py-6.4,2.4,5.8);B('#1a1a1a',px-11.2,py-7.4,1.6,1);B('#e8e8e8',px-11.6,py-4.6,2.4,.6);B('#1a1a1a',px-12.4,py-1.4,4,.6)}
function padSign(g,px,py){const B=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);B('#5a3a22',px-9,py-8,1.2,8);B('#5a3a22',px+8,py-8,1.2,8);B('#c8302a',px-11,py-15,22,8);B('#f4f4f0',px-10.4,py-14.4,20.8,6.8);
 g.save();g.translate(px-9,py-13.6);g.scale(.45,.45);ptext(g,'HELIPONTO',0,0,'#c8302a');g.restore();g.save();g.translate(px-9.2,py-10.6);g.scale(.36,.36);ptext(g,'AREA RESTRITA',0,0,'#2a2a2a');g.restore()}
function drawHangar(g,x,y,pl){const night=nightE(),B=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);B('rgba(0,0,0,.22)',x-34,y-2,70,4);
 B('#2c3036',x-30,y-30,60,30);B('#3a3e46',x-30,y-12,60,12);B('#26292e',x-30,y-30,60,2);
 for(let i=0;i<3;i++){const lx=x-20+i*20;B('#5a5e64',lx-.3,y-30,.6,3);B(night?'#fff6d0':'#e8e4c8',lx-2,y-27,4,1);if(night)B('rgba(255,246,200,.12)',lx-8,y-26,16,24)}
 B('#7a5a3a',x-28,y-10,12,1.4);B('#5a3a22',x-27.4,y-8.6,1,8.6);B('#5a3a22',x-17.6,y-8.6,1,8.6);B('#c8302a',x-27,y-13.4,4.6,3.4);B('#a8201a',x-27,y-11.4,4.6,.6);B('#8a8e96',x-22,y-12.4,4,2.4);
 B('#5a5e64',x-29,y-24,10,8);for(let i=0;i<4;i++)B(['#e8e8e8','#c8a040','#3a6ab8','#c8302a'][i],x-28+i*2.4,y-22+(i%2),1,4.4);
 for(let i=0;i<2;i++){B('#2a5aa8',x+21+i*4.4,y-7.6,4,7.6);B('#1a4a8a',x+21+i*4.4,y-6,4,.6);B('#1a4a8a',x+21+i*4.4,y-2.4,4,.6);B('#5a8ad8',x+21.6+i*4.4,y-7.6,.8,7.6)}
 if(pl){drawPlane(g,x+1,y-1.5,1,{});B('#f0c020',x+4.6,y-1.6,1.4,1.4);B('#f0c020',x+9.4,y-1.6,1.4,1.4)}else B('#f0c020',x-4,y-2,8,.8);
 for(let i=0;i<=66;i+=1.5){const t=i/66,hh=7*Math.sin(Math.PI*t),xx=x-33+i;B(((i/1.5)|0)%2?'#a8aeb4':'#969ca2',xx,y-37-hh,1.5,6+hh*.3);B('#c8ced4',xx,y-37-hh,1.5,.5)}
 for(let k=0;k<=6;k++){const t=k/6,hh=7*Math.sin(Math.PI*t);B('#7a8088',x-33+t*66-.4,y-37-hh,.8,6)}B('#6a7078',x-33,y-31.4,66,1.6);B('#8a9096',x-33,y-30,66,.6);
 for(const sx of [-33,27]){B('#9aa0a6',x+sx,y-30,6,30);for(let i=0;i<6;i+=1.2)B('#80868c',x+sx+i,y-30,.4,30);B('#b8bec4',x+sx,y-30,.8,30)}B('#5a5e64',x-33,y-30.6,66,.8);
 B('#1e3a6a',x-10,y-37.4,20,5.4);B('#f0c020',x-10,y-32.4,20,.5);g.save();g.translate(x-7.2,y-36.2);g.scale(.6,.6);ptext(g,'HANGAR',0,0,'#fff');g.restore();
 B(night&&((frame>>5)&1)?'#ff3a2a':'#8a1a10',x-.7,y-45.6,1.4,1.4)}
const CARIC={};function carIco(c){if(CARIC[c.id])return CARIC[c.id];const cv=mkCanvas(96,44),g=cv.getContext('2d'),R=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w,h)},d=shade(c.c,-25),l=shade(c.c,25);
 R('rgba(0,0,0,.25)',8,38,80,4);if(c.t==='sport'){R(c.c,8,22,80,12);R(c.c,26,14,38,9);R(l,26,14,38,2);R('#9ad0f0',30,16,13,6);R('#9ad0f0',46,16,14,6);R(d,8,30,80,4);R('#ffd75e',84,24,4,3);R('#c83a2a',8,24,3,3)}
 else if(c.t==='suv'){R(c.c,8,14,80,20);R(l,8,14,80,2);R('#9ad0f0',14,17,14,8);R('#9ad0f0',32,17,14,8);R('#9ad0f0',50,17,14,8);R(d,8,30,80,4);R('#3a3a3a',4,22,4,10);R('#ffd75e',84,20,4,4);R('#2a2a2a',22,10,52,3)}
 else{R(c.c,6,20,84,14);R(c.c,46,10,30,12);R(l,46,10,30,2);R('#9ad0f0',50,13,10,7);R('#9ad0f0',63,13,10,7);R(d,6,30,84,4);R(d,6,20,38,2);R('#ffd75e',86,22,4,4);R('#c0c0c0',4,28,4,4)}
 for(const wx of [22,72]){g.fillStyle='#141414';g.beginPath();g.arc(wx,34,7,0,7);g.fill();g.fillStyle='#9a9aa2';g.beginPath();g.arc(wx,34,3.4,0,7);g.fill()}return CARIC[c.id]=cv.toDataURL()}
// ---------- luxo: arte da sede por nível
const _bvEmp=bVar;bVar=function(b){if(b.id==='house'&&S&&S.emp&&S.emp.lux.house>0)return 10+S.emp.lux.house;if(b.id&&b.id.startsWith('v_')){const V=VB.find(q=>q.id===b.id);return V?vSt(V.k,V.key):0}return _bvEmp(b)};
const _bhEmp=BART.house;BART.house=(g,b,x,y,w,h,dx,v)=>{if(v<10)return _bhEmp(g,b,x,y,w,h,dx,v);const L=v-10;
 if(L===1){_bhEmp(g,b,x,y,w,h,dx,4);BW(g,'#7a4a2a',x-2,y+h-16,w+4,2);for(let i=0;i<6;i++)BW(g,'#f4efe4',x+2+i*(w-6)/5,y+h-16,2,16);flowerBox(g,x+2,y+h+2,w-4);return}
 shadowB(g,x,y,w,h);
 if(L>=3){const px=x-38,py=y+h-26;BW(g,'#c8b89a',px-2,py-2,36,26);for(let i=0;i<36;i+=4)BW(g,'#b8a88a',px-2+i,py-2,.6,26);BW(g,'#2a8ac8',px+1,py+1,30,20);BW(g,'#5ab8e8',px+1,py+1,30,3);for(let i=0;i<5;i++)BW(g,'rgba(255,255,255,.5)',px+4+i*6,py+6+(i*2)%3*4,3,.8);BW(g,'#e8e0d0',px+28,py+2,2,8);BW(g,'#c83a2a',px+4,py-6,6,5);BW(g,'#f4f4f4',px+12,py-6,6,5);BW(g,'#f0d040',px+20,py-9,8,1);BW(g,'#8a6a42',px+23.5,py-9,1,7);
  for(const tx of [px+2,px+31]){BW(g,'#8a6a3a',tx,py-30,2,30);for(let i=0;i<5;i++)BW(g,'#3a8a2a',tx-6+i*3,py-34+Math.abs(i-2)*2,4,3)}}
 const fl=L>=3?2:1,wallH=fl>1?26:h-24,top=y+h-wallH*fl-(fl>1?4:0),wc=L===4?'#fbf6ea':'#f6f0e2',bar=L===4?'#c8a040':'#3a6a9a',WX=winXs(b),shc=L===4?'#2a4a2a':'#3a6a9a';
 for(let f=0;f<fl;f++){const wy=y+h-wallH*(f+1)-(f?4:0);wallCal(g,x-4,wy,w+8,wallH+(f?4:0),wc,f===0?bar:null);
  WX.forEach(wx=>winColonial(g,x+wx,wy+(f?4:5),'#f4f4f4',shc));if(f===1)winColonial(g,x+dx+1,wy+4,'#f4f4f4',shc);
  if(f===1){BW(g,'#8a6a42',x-6,wy+wallH+2,w+12,2);for(let i=0;i<24;i++)BW(g,'#f4f4f4',x-5+i*(w+10)/24,wy+wallH-3,.8,5);BW(g,'#f4f4f4',x-6,wy+wallH-4,w+12,1)}}
 roofClay(g,x-8,top-22,w+16,22,L===4?'#8a3a22':'#b5532e',true);chimney(g,x+w-14,top-18,'#e8e0d0');
 if(L>=4){const tx=x+w/2-10;BW(g,'#f4efe4',tx,top-36,20,22);roofClay(g,tx-3,top-48,26,12,'#8a3a22',true);BW(g,'#c8a040',tx+9,top-54,2,6);BW(g,'#ffd75e',tx+7.5,top-56,5,3);winArch(g,tx+3.5,top-30,'#c8a040')}
 BW(g,'#e8e0d0',x-6,y+h-3,w+12,3);for(let i=0;i<5;i++){const cx=x-4+i*(w+5)/4;BW(g,'#fbfbf6',cx,y+h-wallH,3,wallH-2);BW(g,'#d8d0c0',cx+2.2,y+h-wallH,.8,wallH-2)}BW(g,L===4?'#c8a040':'#8a6a42',x-6,y+h-wallH-2,w+12,2);
 doorWood(g,x+dx,y+h-24,L===4?'#5a2a12':'#6a4428',1);wallLamp(g,x+dx-4,y+h-26);wallLamp(g,x+dx+19,y+h-26);
 for(let i=0;i<4;i++)plantPot(g,x-8+i*((w+16)/3),y+h+2,['#e84a5a','#f0d040','#f08ab0','#fff'][i]);
 if(L>=2){for(const tx of (L>=3?[x+w+12]:[x-16,x+w+12])){BW(g,'#7a5a3a',tx,y+h-44,3,44);for(let i=0;i<7;i++)BW(g,i%2?'#2a7a2a':'#3a9a3a',tx-7+i*2.3,y+h-50+Math.abs(i-3)*2.4,4,4)}}
 if(L>=4){const fx=x+w/2,fy=y+h+10;BW(g,'#c8c0b0',fx-9,fy-4,18,5);BW(g,'#5ab8e8',fx-7,fy-3.5,14,3);BW(g,'#e8e0d0',fx-1.5,fy-12,3,9);BW(g,'rgba(200,235,255,.8)',fx-4,fy-14,8,2)}};
// ---------- BAIRRO NOVO: negócios e doações viram prédios de verdade na beira da BR (leste do rio)
const VB=[
 {id:'v_posto',k:'biz',key:'posto',x:104,w:7,door:108,lab:'Posto Boi de Ouro (seu)',sign:'POSTO BOI DE OURO'},
 {id:'v_mercado',k:'biz',key:'mercado',x:112,w:6,door:114,lab:'Supermercado Boi de Ouro (seu)',sign:'SUPERMERCADO'},
 {id:'v_churras',k:'biz',key:'churras',x:119,w:6,door:121,lab:'Churrascaria Boi de Ouro (sua)',sign:'CHURRASCARIA'},
 {id:'v_loja',k:'biz',key:'loja',x:126,w:6,door:128,lab:'Agropecuária Boi de Ouro (sua)',sign:'AGROPECUARIA'},
 {id:'v_hotel',k:'biz',key:'hotel',x:133,w:7,door:136,lab:'Hotel-Fazenda Boi de Ouro (seu)',sign:'HOTEL FAZENDA'},
 {id:'v_escola',k:'don',key:'escola',x:141,w:7,door:144,lab:'Escola Municipal (sua doação)',sign:'ESCOLA MUNICIPAL'},
 {id:'v_saude',k:'don',key:'saude',x:150,w:6,door:152,lab:'Posto de Saúde (sua doação)',sign:'POSTO DE SAUDE'}];
const VBY=80,VBH=4;
function vbClearArea(){for(const V of VB){const x0=V.x-1,x1=V.x+V.w,y0=VBY-1,y1=VBY+VBH;
  for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=x0&&tx<=x1&&ty>=y0&&ty<=y1){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
  if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--){const d=DECO[i],tx=Math.floor(d.x/TS),ty=Math.floor(d.y/TS);if(tx>=x0&&tx<=x1&&ty>=y0&&ty<=y1){SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=ti(x,y);if(G[i]!==3){G[i]=0}SOL[i]=0;FEN[i]=0}}
 for(let x=103;x<=156;x++){const i=ti(x,84);G[i]=3;SOL[i]=0}}
function vbRefresh(){if(!S)return;for(const V of VB){const st=S.emp?vSt(V.k,V.key):0,i=BLD.findIndex(b=>b.id===V.id);
  if(st&&i<0){BLD.push({id:V.id,x:V.x,y:VBY,w:V.w,h:VBH,door:V.door,roof:'#8a8a8a',wall:'#eee',label:st===1?'🏗️ Obra: '+V.lab.replace(/ \(.*\)/,''):V.lab,sign:V.sign,custom:1});for(let y=VBY;y<VBY+VBH;y++)for(let x=V.x;x<V.x+V.w;x++)SOL[ti(x,y)]=1;
   const px=Math.floor(P.x/TS),py=Math.floor((P.y-2)/TS);if(px>=V.x&&px<V.x+V.w&&py>=VBY&&py<VBY+VBH){P.y=(VBY+VBH)*TS+10}}
  else if(!st&&i>=0){BLD.splice(i,1);for(let y=VBY;y<VBY+VBH;y++)for(let x=V.x;x<V.x+V.w;x++)SOL[ti(x,y)]=0}
  else if(st&&i>=0){BLD[i].label=st===1?'🏗️ Obra: '+V.lab.replace(/ \(.*\)/,''):V.lab}}}
const _gwEmp=genWorld;genWorld=function(){_gwEmp();vbClearArea();vbRefresh();prerender()};
// obra: fundação, paredes subindo, andaime, betoneira
function vbObra(g,b,x,y,w,h,dx){shadowB(g,x,y,w,h);BW(g,'#a8a49a',x-2,y+h-4,w+4,4);const k=.55;
 for(let i=0;i<w;i+=8){const hh=(h-14)*k*(.6+hs(i,x)*.5);wallBrick(g,x+i,y+h-4-hh,8,hh,'#b8603a')}
 for(let i=0;i<=w;i+=w/4){BW(g,'#c89a5a',x+i-1,y+8,2,h-10)}for(let j=0;j<3;j++)BW(g,'#c89a5a',x-2,y+12+j*14,w+4,1.6);for(let j=0;j<3;j++)BW(g,'#8a6a3a',x,y+13+j*14,w,1);
 BW(g,'#e8e0d0',x+w-30,y+h-14,10,8);BW(g,'#f08020',x+w-28,y+h-20,12,9);BW(g,'#d86010',x+w-28,y+h-12,12,2);BW(g,'#2a2a2a',x+w-27,y+h-4,3,3);BW(g,'#2a2a2a',x+w-19,y+h-4,3,3);
 BW(g,'#d8c8a0',x+6,y+h-7,16,7);BW(g,'#c8b890',x+9,y+h-10,10,3);BW(g,'#9a9a9a',x+26,y+h-6,14,6);for(let i=0;i<3;i++)BW(g,'#8a8a8a',x+26,y+h-6+i*2,14,.5);
 BW(g,'#f4f0e4',x+w/2-22,y-2,44,12);BW(g,'#2a6a3a',x+w/2-22,y-2,44,3);ptext(g,'EM OBRAS',x+w/2-15,y+3.5,'#2a2a2a');BW(g,'#5a3a22',x+w/2-20,y+10,1.4,10);BW(g,'#5a3a22',x+w/2+18,y+10,1.4,10)}
function pumpB(g,x,y,c){BW(g,'#e8e8e8',x,y-14,7,14);BW(g,c,x,y-14,7,3);BW(g,'#2a2a2a',x+1.5,y-10,4,3);BW(g,'#7ad87a',x+2,y-9.5,3,1.6);BW(g,'#1a1a1a',x+7,y-9,1,6);BW(g,'#1a1a1a',x+7,y-3,2,1)}
BART.v_posto=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);shadowB(g,x+44,y,w-44,h);
 // loja de conveniência
 wallTile(g,x+44,y+24,w-44,h-24);roofMetal(g,x+42,y+12,w-42,14,'#e8e8e8');BW(g,'#2a8a3a',x+42,y+24,w-42,5);BW(g,'#f0d040',x+42,y+29,w-42,1.6);ptext(g,'CONVENIENCIA',x+48,y+25,'#fff');
 doorGlass(g,x+dx,y+h-24);winGlass(g,x+dx+22,y+h-30,'#c8c8c8');winGlass(g,x+dx+40,y+h-30,'#c8c8c8');
 // cobertura das bombas
 BW(g,'#d8d8d8',x-2,y+10,46,6);BW(g,'#2a8a3a',x-2,y+16,46,4);BW(g,'#f0d040',x-2,y+20,46,1.2);ptext(g,'POSTO',x+10,y+11,'#2a8a3a');BW(g,'#f0d040',x+32,y+11,6,4);for(const cx of [x+3,x+37]){BW(g,'#c8c8c8',cx,y+21,3,h-21);BW(g,'#a8a8a8',cx+2,y+21,1,h-21)}
 BW(g,'#c8c8c0',x+4,y+h-4,36,4);pumpB(g,x+10,y+h-3,'#d8302a');pumpB(g,x+26,y+h-3,'#2a6ad8');
 // totem de preços
 const tx=x-14;BW(g,'#3a3a3a',tx+5,y+16,3,h-16);BW(g,'#2a8a3a',tx,y-6,13,24);BW(g,'#f0d040',tx,y-6,13,4);BW(g,'#1a1a1a',tx+1,y-1,11,18);ptext(g,'G',tx+1.5,y+.5,'#ffd75e');ptext(g,'E',tx+1.5,y+6.5,'#7ad87a');ptext(g,'D',tx+1.5,y+12.5,'#f4f4f4')};
BART.v_mercado=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);const rh=h-42;shadowB(g,x,y,w,h);
 wallCal(g,x,y+rh,w,h-rh,'#f4f4ee','#c83a2a');roofMetal(g,x-2,y,w+4,rh+2,'#b8c0c8');BW(g,'#c83a2a',x-2,y+rh,w+4,10);BW(g,'#f0d040',x-2,y+rh+10,w+4,1.6);ptext(g,'SUPERMERCADO',x+w/2-23,y+rh+2.5,'#fff');
 for(let i=0;i<w;i+=8)BW(g,i%16?'#f4f4f4':'#2a8a3a',x+i,y+h-34,8,5);for(let i=0;i<w;i+=8)BW(g,i%16?'#d8d8d8':'#1a6a2a',x+i,y+h-29.5,8,1);
 for(const wx of [x+4,x+w-34]){BW(g,'#8a8a8a',wx-1,y+h-28,31,22);BW(g,'#3a5a7a',wx,y+h-27,29,20);BW(g,'#7aaad0',wx,y+h-27,29,7);for(let i=0;i<4;i++){BW(g,['#e84a3a','#f0d040','#5ac04a','#f08a2a'][i],wx+2+i*7,y+h-15,5,3);BW(g,'#c8c8c8',wx+1,y+h-12,27,1)}BW(g,'#c8e4f8',wx+2,y+h-26,3,8)}
 doorGlass(g,x+dx,y+h-24);for(let i=0;i<3;i++){const cx=x+dx+20+i*5;BW(g,'#9aa0a8',cx,y+h-7,5,4);BW(g,'#6a7078',cx,y+h-3,1,1);BW(g,'#6a7078',cx+4,y+h-3,1,1)}
 for(let i=0;i<3;i++){BW(g,'#8a5a2a',x+dx-18+i*6,y+h-6,5,5);BW(g,['#e84a3a','#f0a020','#5ac04a'][i],x+dx-17.5+i*6,y+h-7,4,2)}};
BART.v_churras=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);const rh=h-40;shadowB(g,x,y,w,h);
 wallBrick(g,x,y+rh,w,h-rh,'#a8502a');roofClay(g,x-2,y,w+4,rh,'#8a3a22',true);chimney(g,x+w-16,y-6,'#7a3a22');
 BW(g,'#3a2210',x+w/2-27,y+rh-11,54,10);BW(g,'#5a3a1a',x+w/2-26,y+rh-10,52,8);ptext(g,'CHURRASCARIA',x+w/2-23,y+rh-8.5,'#ffd75e');
 BW(g,'#f4f0e0',x+w/2-4,y+rh-17,8,4);BW(g,'#f4f0e0',x+w/2-8,y+rh-19,4,2);BW(g,'#f4f0e0',x+w/2+4,y+rh-19,4,2);
 stdWins(g,b,x,y,h,(g,a,c)=>{BW(g,'#3a2210',a-1,c+1,15,13);BW(g,'#f8d890',a,c+2,13,11);BW(g,'#e8b860',a,c+8,13,5);BW(g,'#3a2210',a+6,c+2,1,11)});
 doorWood(g,x+dx,y+h-24,'#5a3a1a',1);
 // mesas na varanda
 for(const mx of [x+w+4]){BW(g,'#c8402a',mx,y+h-22,22,3);BW(g,'#e85a3a',mx+3,y+h-24,16,2);BW(g,'#5a3a22',mx+10,y+h-19,2,12);BW(g,'#8a5a32',mx+3,y+h-8,16,2);BW(g,'#5a3a22',mx+4,y+h-6,1.4,5);BW(g,'#5a3a22',mx+16,y+h-6,1.4,5)}
 BW(g,'#4a4a4a',x-14,y+h-12,12,4);BW(g,'#2a2a2a',x-13,y+h-8,1.4,8);BW(g,'#2a2a2a',x-4,y+h-8,1.4,8);for(let i=0;i<4;i++)BW(g,'#8a3a1a',x-13+i*3,y+h-14,2,2)};
BART.v_loja=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);const rh=h-40;shadowB(g,x,y,w,h);
 wallBoards(g,x,y+rh,w,h-rh,'#3a7a3a');roofMetal(g,x-2,y,w+4,rh,'#9aa3ab');signBoard(g,x+w/2,y+rh-11,'AGROPECUARIA','#f0d040','#1a4a1a','#1a3a1a');
 stdWins(g,b,x,y,h,(g,a,c)=>winBars(g,a,c,'#d8d0b0'));doorRoll(g,x+dx,y+h-24);
 sacks(g,x+dx-22,y+h,6,'#e8dcb8');sacks(g,x+dx+22,y+h,5,'#d8c8a0');barrel(g,x+w+2,y+h);barrel(g,x+w+9,y+h);
 BW(g,'#7a4a22',x+w+3,y+h-22,14,2);BW(g,'#5a2a12',x+w+4,y+h-21,12,6);BW(g,'#c8a040',x+w+9,y+h-19,2,2);BW(g,'#5a3a22',x+w+9,y+h-15,2,15)};
BART.v_hotel=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);const rh=h-42;shadowB(g,x,y,w,h);
 wallCal(g,x,y+rh,w,h-rh,'#f6e8b0','#3a6a9a');roofClay(g,x-4,y,w+8,rh,'#b5532e',true);chimney(g,x+16,y+2,'#e8e0d0');
 signBoard(g,x+w/2,y+rh-10,'HOTEL FAZENDA','#2a4a7a','#ffd75e','#1a2a4a');for(let i=0;i<4;i++)BW(g,'#ffd75e',x+w/2-10+i*6,y+rh-1,3,3);
 stdWins(g,b,x,y,h,(g,a,c)=>winColonial(g,a,c,'#f4f4f4','#2a6a3a'));doorWood(g,x+dx,y+h-24,'#5a3a22',1);wallLamp(g,x+dx-4,y+h-26);wallLamp(g,x+dx+19,y+h-26);
 BW(g,'#a83a2a',x-3,y+h-2,w+6,3);for(const cx of [x-2,x+w/3,x+w*2/3,x+w-1]){BW(g,'#f4efe4',cx,y+rh+2,3,h-rh-4);BW(g,'#d8d0c0',cx+2,y+rh+2,1,h-rh-4)}
 BW(g,'#d84a3a',x+8,y+h-16,16,1);for(let i=0;i<16;i+=2)BW(g,i%4?'#f0d040':'#3a8a3a',x+8+i,y+h-15+Math.sin(i/16*Math.PI)*3,2,1.5);
 for(const tx of [x-12]){BW(g,'#7a5a3a',tx,y+h-40,3,40);for(let i=0;i<7;i++)BW(g,i%2?'#2a7a2a':'#3a9a3a',tx-7+i*2.3,y+h-46+Math.abs(i-3)*2.4,4,4)}};
BART.v_escola=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);const rh=h-40;shadowB(g,x,y,w,h);
 wallCal(g,x,y+rh,w,h-rh,'#f8f4e8','#2a5aa8');BW(g,'#f0c020',x,y+h-9,w,2);roofClay(g,x-2,y,w+4,rh,'#c0602e',true);
 signBoard(g,x+w/2,y+rh-11,'ESCOLA MUNICIPAL','#fff','#2a5aa8','#1a3a7a');stdWins(g,b,x,y,h,(g,a,c)=>winGlass(g,a,c,'#2a5aa8'));doorGlass(g,x+dx,y+h-24);
 // mastro e parquinho
 BW(g,'#c8c8c8',x-10,y-10,1.6,h+10);BW(g,'#8a8a8a',x-12,y+h-2,6,2);
 const px=x+w+2;BW(g,'#c83a2a',px,y+h-20,2,20);BW(g,'#c83a2a',px+14,y+h-20,2,20);BW(g,'#c83a2a',px,y+h-21,16,2);BW(g,'#5a5a5a',px+4.5,y+h-19,.6,12);BW(g,'#5a5a5a',px+10,y+h-19,.6,12);BW(g,'#f0c020',px+3.5,y+h-7,8,1.6);
 BW(g,'#2a6ad8',px+18,y+h-14,2,14);BW(g,'#f0c020',px+18,y+h-15,5,2);for(let i=0;i<5;i++)BW(g,'#e84a3a',px+21+i*1.4,y+h-14+i*2.6,2,2);BW(g,'#e0c890',x+w+1,y+h-1,29,2)};
BART.v_saude=(g,b,x,y,w,h,dx,v)=>{if(v<2)return vbObra(g,b,x,y,w,h,dx);const rh=h-38;shadowB(g,x,y,w,h);
 wallTile(g,x,y+rh,w,h-rh);BW(g,'#2a6ab8',x,y+rh+6,w,3);roofMetal(g,x-2,y,w+4,rh,'#e8ecee');
 const cx=x+w/2,kx=x+12;BW(g,'#fff',kx-7,y+rh-15,14,14);BW(g,'#d82a2a',kx-1.6,y+rh-13,3.2,10);BW(g,'#d82a2a',kx-5,y+rh-9.6,10,3.2);
 signBoard(g,cx+10,y+rh-11,'POSTO DE SAUDE','#fff','#d82a2a','#8a1a1a');stdWins(g,b,x,y,h,(g,a,c)=>winGlass(g,a,c+3,'#c8d0d8'));doorGlass(g,x+dx,y+h-24);
};
function ambul(g,ax,ay){Rr(g,'rgba(0,0,0,.25)',ax-1,ay-2,32,3);Rr(g,'#f8f8f8',ax,ay-16,22,13);Rr(g,'#f8f8f8',ax+22,ay-11,8,8);Rr(g,'#9ad0f0',ax+24,ay-10,5,4);Rr(g,'#d82a2a',ax,ay-9,30,2);Rr(g,'#d82a2a',ax+8,ay-14,2,5);Rr(g,'#d82a2a',ax+6.5,ay-12.5,5,2);const bl=(frame>>4)&1;Rr(g,bl?'#2a6ad8':'#9ab0e8',ax+4,ay-17.5,4,1.6);Rr(g,bl?'#ff8a8a':'#d82a2a',ax+12,ay-17.5,4,1.6);
 for(const wx of [ax+5,ax+23]){Rr(g,'#141414',wx-2.5,ay-4,5,4.4);Rr(g,'#9a9aa2',wx-1,ay-2.8,2,2)}}
// animações
const _blEmp=bLive;bLive=function(g,b){_blEmp(g,b);if(!b.id||!b.id.startsWith('v_'))return;const x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,V=VB.find(q=>q.id===b.id);if(!V||vSt(V.k,V.key)<2)return;const hr=S.t*24;
 if(b.id==='v_churras'){smoke(g,x+w-13,y-6);if((hr>=11&&hr<15)||(hr>=18&&hr<22))smoke(g,x-8,y+h-16)}
 else if(b.id==='v_hotel'||b.id==='v_escola'){const fx=b.id==='v_escola'?x-8.4:x+w/2-4,fy=b.id==='v_escola'?y-10:y-20;if(b.id==='v_hotel'){Rr(g,'#5a3a22',fx-1,fy,1,14)}for(let i=0;i<9;i++){const wv=Math.sin(frame/10+i*.7)*1.2;Rr(g,'#2a9a3a',fx+i,fy+wv,1,6)}Rr(g,'#f0d040',fx+2,fy+1.4+Math.sin(frame/10+2)*1.2,4,3);Rr(g,'#2a4a9a',fx+3,fy+2+Math.sin(frame/10+2)*1.2,2,1.6)}
 else if(b.id==='v_posto'){const tx=x-14;Rr(g,'#ffd75e',tx+6,y+.5,6,4);Rr(g,'#7ad87a',tx+6,y+6.5,6,4);Rr(g,'#f4f4f4',tx+6,y+12.5,6,4);ptext(g,'629',tx+5.5,y+.5,'#1a1a1a');ptext(g,'439',tx+5.5,y+6.5,'#1a1a1a');ptext(g,'609',tx+5.5,y+12.5,'#1a1a1a')}};
// lotes vazios, gente trabalhando, carros
function lotSign(g,V){const x=V.x*TS,y=VBY*TS,w=V.w*TS,h=VBH*TS,cx=x+w/2;for(const [a,c] of [[x+2,y+h-2],[x+w-3,y+h-2],[x+2,y+8],[x+w-3,y+8]]){Rr(g,'#8a6a3a',a,c-6,1.4,6);Rr(g,'#e85a3a',a,c-6,1.4,1.4)}
 Rr(g,'rgba(240,240,240,.6)',x+3,y+h-6,w-6,.5);Rr(g,'rgba(240,240,240,.6)',x+3,y+4,w-6,.5);Rr(g,'rgba(240,240,240,.6)',x+2.5,y+4,.5,h-10);Rr(g,'rgba(240,240,240,.6)',x+w-2.5,y+4,.5,h-10);
 Rr(g,'#5a3a22',cx-1,y+h-18,2,18);Rr(g,'#1e140c',cx-21,y+h-31,42,15);Rr(g,'#f4ecd8',cx-20,y+h-30,40,13);ptext(g,'TERRENO',cx-13.5,y+h-28.5,'#8a3a1a');ptext(g,'BAIRRO NOVO',cx-19.5,y+h-22.5,'#3a6a3a')}
function npcAt(L,x,y,o,scale){if(!evis(x,y,40))return;L.push([y,10,{draw:g=>{if(scale){g.save();g.translate(x,y);g.scale(scale,scale);g.translate(-x,-y)}OL(g,x,y+3,30,40,c=>drawPerson(c,Object.assign({x,y,dir:0,ph:frame*.12,mv:0},o)));if(scale)g.restore()}}])}
const evis=(x,y,m)=>x>CX-(m||60)&&x<CX+VW+(m||60)&&y>CY-(m||60)&&y<CY+VH+(m||90);
const _evoEmp=evoItems;evoItems=function(L,x0,x1,y0,y1){_evoEmp(L,x0,x1,y0,y1);if(inRoom())return;const E=S.emp,hr=S.t*24,day=hr>=7&&hr<19;
 // Bairro Novo: lotes e moradores
 if(CY+VH>74*TS&&CY<90*TS&&CX+VW>100*TS){for(const V of VB){const st=E?vSt(V.k,V.key):0,cx=V.door*TS+8,by=(VBY+VBH)*TS;
  if(!st){if(evis(cx,by))L.push([by-2,10,{draw:g=>lotSign(g,V)}]);continue}
  if(st===1){npcAt(L,cx-30,by+8,{shirt:'#e0a431',pants:'#3a4a6a',hat:'#f0d040',work:1,dir:2});npcAt(L,cx+26,by+10,{shirt:'#c86a2a',pants:'#3a4a6a',hat:'#f0d040',work:1,dir:3});continue}
  if(!day&&V.key!=='hotel'&&V.key!=='posto')continue;
  if(V.key==='posto'){npcAt(L,V.x*TS+20,by+2,{shirt:'#f08a20',pants:'#2a3a5a',hat:null,dir:3});if(evis(V.x*TS+30,by)){const cc=['#c83a2a','#e8e8e8','#2a6ad8','#1a1a1a'][Math.floor(S.day/1)%4];L.push([by-6,10,{draw:g=>carW(g,V.x*TS+32,by-6,cc,'pick',1)}])}}
  else if(V.key==='mercado'){npcAt(L,cx+22,by+6,{shirt:'#e85a9a',g:'f',dir:2});npcAt(L,cx-16,by+9,{shirt:'#3a7ac8',dir:3})}
  else if(V.key==='churras'&&((hr>=11&&hr<15)||(hr>=18&&hr<22))){npcAt(L,V.x*TS-8,by-4,{shirt:'#f4f4f4',pants:'#2a2a2a',hat:'#f4f4f4',hatS:'touca',work:1,dir:0});npcAt(L,(V.x+V.w)*TS+14,by-2,{shirt:'#3a9a4a',dir:2})}
  else if(V.key==='loja')npcAt(L,cx+20,by+6,{shirt:'#3a7a3a',pants:'#5a4a3a',hat:'#d8c080',work:1,dir:2});
  else if(V.key==='hotel'&&hr>=8&&hr<21)npcAt(L,cx-30,by+4,{shirt:'#f0d040',g:'f',hat:'#e8d8a0',dir:0});
  else if(V.key==='escola'&&hr>=7&&hr<12&&S.day%7<5){for(let i=0;i<4;i++)npcAt(L,(V.x+V.w)*TS+8+i*9,by+2+(i%2)*6,{shirt:['#f4f4f4','#2a5aa8','#f4f4f4','#2a5aa8'][i],pants:'#2a3a6a',dir:i%4,mv:1,ph:frame*.2+i},.72)}
  else if(V.key==='saude'){npcAt(L,cx+18,by+4,{shirt:'#f4f4f4',pants:'#f4f4f4',g:'f',dir:0});const ax=(V.x+V.w)*TS-30;if(evis(ax,by+12))L.push([by+12,10,{draw:g=>ambul(g,ax,by+12)}])}}}
 if(!E)return;
 // helicóptero
 if(E.air.heli){let hp=heliPos(),l=0,r=0,sp=0;const o={night:nightE()};
  if(HELIUP){const t=HELIUP.t;hp=HELIUP;l=t<.7?0:(t-.7)*(t-.7)*34;r=frame*.9*Math.min(1,.25+t);sp=1;o.tilt=t>1?-.06*Math.min(1,(t-1)*2):0;if(t>.35)o.pass='#c83a2a'}
  else if(HELIA){const t=HELIA.t;hp=HELIA;l=Math.max(0,44-t*30);r=frame*.9*Math.max(.15,1-Math.max(0,t-1.5)/2.4);sp=t<3.6;o.tilt=l>3?.05:0;if(HELIA.pl&&t<1.5)o.pass='#c83a2a'}
  if(evis(hp.x,hp.y,110))L.push([hp.y,10,{draw:g=>heliS(g,hp.x,hp.y,l,r,sp,o)}]);
  const x=HPAD.x,cy=HPAD.y-6;if(evis(x,cy,120)){L.push([cy-20,10,{draw:g=>windsock(g,x+37,cy-20)}]);L.push([cy-22,10,{draw:g=>floodP(g,x-36,cy-22)}]);L.push([cy+36,10,{draw:g=>avgas(g,x-12,cy+36)}]);L.push([cy+37,10,{draw:g=>padSign(g,x+17,cy+37)}])}}
 // hangar com o avião agrícola
 if(E.air.plane&&evis(HANG.x,HANG.y,100))L.push([HANG.y,10,{draw:g=>drawHangar(g,HANG.x,HANG.y,!PLANEA)}]);
 // carro favorito estacionado na frente da sede
 if(E.lux.fav&&E.lux.house>=2&&E.lux.cars[E.lux.fav]){const c=ECARS.find(q=>q.id===E.lux.fav),cx=4.3*TS,cy=47.4*TS;if(c&&evis(cx,cy))L.push([cy,10,{draw:g=>carW(g,cx,cy,c.c,c.t,1)}]);
  const c2=ECARS.filter(q=>E.lux.cars[q.id]&&q.id!==E.lux.fav).slice(-1)[0];if(c2&&evis(12.9*TS,46.9*TS))L.push([46.9*TS,10,{draw:g=>carW(g,12.9*TS,46.9*TS,c2.c,c2.t,-1)}])}
 // praça reformada
 if(vReady('don','praca')&&evis(120*TS,57*TS,160))for(const it of PRCX)L.push([it[1],10,{draw:g=>it[2](g,it[0],it[1])}]);
 // grades da ponte
 if(vReady('don','ponte')&&evis(122*TS,48*TS,120)){L.push([46.6*TS,10,{draw:g=>bridgeRail(g,46.4*TS)}]);L.push([49.6*TS,10,{draw:g=>bridgeRail(g,49.4*TS)}])}};
function bridgeRail(g,y){const x0=118.6*TS,x1=125.4*TS;BW(g,'#e8e8e4',x0,y-6,x1-x0,1.6);BW(g,'#c8c8c4',x0,y-4.4,x1-x0,.6);for(let x=x0;x<=x1;x+=8){BW(g,'#f4f4f0',x,y-6,1.6,6);BW(g,'#a8a8a4',x+1.2,y-6,.4,6)}BW(g,'#a8a49a',x0-2,y-2,4,3);BW(g,'#a8a49a',x1-2,y-2,4,3)}
// praça: estátua do fazendeiro, canteiros, postes antigos e bancos
const statue=(g,x,y)=>{BW(g,'rgba(0,0,0,.25)',x-9,y-1,18,3);BW(g,'#9a948a',x-8,y-8,16,8);BW(g,'#b8b2a6',x-8,y-8,16,1.4);BW(g,'#7a746a',x-6,y-5,12,3);BW(g,'#c8a040',x-4,y-4.4,8,1.6);const b='#8a6a3a',bd='#6a4a22';
 BW(g,bd,x-2.6,y-16,2.2,8);BW(g,bd,x+.6,y-16,2.2,8);BW(g,b,x-3.6,y-25,7.2,10);BW(g,bd,x-5,y-24,1.8,7);BW(g,bd,x+3.4,y-28,1.8,6);BW(g,b,x-2.4,y-30,4.8,5);BW(g,bd,x-5.5,y-31.5,11,1.4);BW(g,b,x-3.4,y-34,6.8,2.8);BW(g,'#a88a52',x-3.6,y-25,1,10)};
const lampP=(g,x,y)=>{BW(g,'#2a2a2a',x-1.5,y-2,3,2);BW(g,'#2a2a2a',x-.6,y-24,1.2,22);BW(g,'#2a2a2a',x-3,y-26,6,1.2);const on=S.t*24>=18||S.t*24<6;BW(g,on?'#ffe9a0':'#e8e0c0',x-2.4,y-30,4.8,4);BW(g,'#2a2a2a',x-3,y-31,6,1);if(on)Rr(g,'rgba(255,230,150,.18)',x-9,y-34,18,14)};
const bedP=(g,x,y)=>{BW(g,'#8a8478',x-10,y-5,20,5);BW(g,'#5a3a22',x-9,y-4.4,18,4);for(let i=0;i<9;i++){BW(g,'#3a8a3a',x-8.6+i*2,y-7,2,3);BW(g,['#e84a5a','#f0d040','#f08ab0','#fff','#8a4ac8'][i%5],x-8.4+i*2,y-8,1.6,1.6)}};
const PRCX=[[113.5*TS,56.6*TS,statue],[116.0*TS,54.4*TS,lampP],[122.0*TS,54.4*TS,lampP],[116.0*TS,58.6*TS,lampP],[122.0*TS,58.6*TS,lampP],[115.2*TS,56.9*TS,bedP],[122.6*TS,53.9*TS,bedP],[111.4*TS,54.4*TS,(g,x,y)=>bench(g,x,y)],[111.4*TS,59.0*TS,(g,x,y)=>bench(g,x,y)]];
// asfalto e ponte no chão
function asphaltRow(g,y0,x0,x1){const a=Math.max(x0,CX-8),b=Math.min(x1,CX+VW+8);if(b<=a||y0>CY+VH+8||y0+2*TS<CY-8)return;
 g.fillStyle='#3e3e44';g.fillRect(a,y0,b-a,2*TS);g.fillStyle='#4a4a50';for(let x=Math.floor(a/7)*7;x<b;x+=7)g.fillRect(x+(hs(x,y0)*5|0),y0+3+(hs(y0,x)*24|0),1,1);
 g.fillStyle='#e8e8e8';g.fillRect(a,y0+1.2,b-a,.8);g.fillRect(a,y0+2*TS-2,b-a,.8);g.fillStyle='#f0c020';for(let x=Math.floor(a/16)*16;x<b;x+=16)g.fillRect(x,y0+TS-.5,8,1)}
const _pqEmp=pqTint;pqTint=function(g){_pqEmp(g);if(inRoom()||!S.emp)return;const E=S.emp;
 if(E.air.heli){const x=HPAD.x,cy=HPAD.y-6;if(x>CX-70&&x<CX+VW+70&&cy>CY-60&&cy<CY+VH+60)drawHeliport(g,x,cy)}
 if(E.air.plane){const x=HANG.x,y=HANG.y;if(x>CX-60&&x<CX+VW+60&&y>CY-60&&y<CY+VH+80)drawApron(g,x,y)}
 const pon=vReady('don','ponte');
 if(vReady('don','asfalto')){asphaltRow(g,47*TS,8*TS,98*TS);asphaltRow(g,47*TS,98*TS,150*TS);asphaltRow(g,85*TS,0,MW*TS)}
 if(pon){const x0=118.6*TS,x1=125.4*TS,y0=46.4*TS,y1=49.4*TS;if(x1>CX&&x0<CX+VW&&y1>CY&&y0<CY+VH){g.fillStyle='rgba(20,40,50,.35)';g.fillRect(x0,y1,x1-x0,6);g.fillStyle='#a8a49a';g.fillRect(x0,y0,x1-x0,y1-y0);g.fillStyle='#bab6ac';g.fillRect(x0,y0,x1-x0,1.4);g.fillStyle='#8a867c';g.fillRect(x0,y1-1.4,x1-x0,1.4);
  if(vReady('don','asfalto')){g.fillStyle='#3e3e44';g.fillRect(x0,47*TS,x1-x0,2*TS);g.fillStyle='#f0c020';for(let x=x0;x<x1;x+=16)g.fillRect(x,48*TS-.5,8,1)}else{g.fillStyle='#9a9488';for(let x=x0;x<x1;x+=6)g.fillRect(x,y0+2,.6,y1-y0-4)}
  g.fillStyle='#7a766c';for(const px of [x0+18,x1-22])g.fillRect(px,y1,4,8)}}};
// ponte: sem atolar no vau
const _mpEmp=movePlayer;movePlayer=function(dx,dy){if(HELIUP||(HELIA&&HELIA.pl&&HELIA.t<1.5))return;if(S&&S.emp&&vReady('don','ponte')){const tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS);if(tx>=FORD.x0&&tx<FORD.x1&&ty>=46&&ty<=49&&!(S.horseOn&&S.horse&&S.horse.b==='pantaneiro')){dx/=.6;dy/=.6}}return _mpEmp(dx,dy)};
// esconde o jogador dentro do helicóptero e faixa de prefeito
const _dplEmp=drawPlayer;drawPlayer=function(g){if((HELIUP&&HELIUP.t>.35)||(HELIA&&HELIA.pl&&HELIA.t<1.5))return;_dplEmp(g)};
const _dpbEmp=drawPlayerBase;drawPlayerBase=function(g){_dpbEmp(g);const E=S.emp;if(!E||!E.pol.pref||S.day>=E.pol.prefEnd||P.drive)return;const x=P.x,by=P.y-(P.moving?Math.abs(Math.cos(P.ph))*.8:0),side=P.dir>=2;
 if(side){Rr(g,'#2a9a3a',x-1,by-17,2.4,8);Rr(g,'#f0d040',x-.4,by-17,1,8)}else{for(let i=0;i<7;i++){Rr(g,i<3?'#2a9a3a':i<5?'#f0d040':'#2a4aa8',x-3.6+i*1.05,by-17.4+i*1.1,1.6,1.6)}}};
// chegada no helicóptero, avião pulverizando, metas
let empAcc=0;const _updEmp=update;update=function(dt){_updEmp(dt);if(!S)return;
 if(HELIUP){HELIUP.t+=dt;if(HELIUP.t>1.8&&!HELIUP.f){HELIUP.f=1;heliArrive()}}
 if(HELIA){HELIA.t+=dt;if(HELIA.t>4.2)HELIA=null}
 if(PLANEA){PLANEA.t+=dt;PLANEA.x+=140*dt;const f=fieldRect();PLANEA.spray=PLANEA.x>f[0]*TS-20&&PLANEA.x<(f[2]+1)*TS+20;if(PLANEA.x>(f[2]+30)*TS)PLANEA=null}
 empAcc+=dt;if(empAcc>3){empAcc=0;if(S.emp&&S.emp.air.plane&&!PLANEA&&S.day%3===0&&S.t*24>8&&S.t*24<10&&S.emp.sprayD!==S.day){S.emp.sprayD=S.day;const f=fieldRect();PLANEA={x:(f[0]-30)*TS,y:(f[1]+2)*TS,t:0};S.crops.forEach(c=>{c.w=1})}checkEmpGoals()}};
const _dpEmp=drawPart;drawPart=function(g){_dpEmp(g);if(PLANEA&&!inRoom()){const p=PLANEA;Rr(g,'rgba(0,0,0,.16)',p.x-18,p.y+2,38,3);drawPlane(g,p.x,p.y-22,1,{prop:1,fly:1});if(p.spray)for(let i=0;i<16;i++){const a=(p.t*9+i*11)%30,bx=p.x-8+(i%7)*3;Rr(g,'rgba(230,240,255,'+Math.max(0,.55-a/60).toFixed(2)+')',bx-a*1.7,p.y-26+a*.85+Math.sin(i)*1.5,1.4+a*.09,1.4+a*.09)}}};
const _ilEmp=interactList;interactList=function(){const L=_ilEmp();if(inRoom()||P.drive||!S.emp)return L;const E=S.emp;
 if(E.air.heli&&!heliBusy()){const hp=heliPos();if(Math.hypot(P.x-hp.x,P.y-hp.y)<56)L.push({x:hp.x,y:hp.y,r:46,label:'🚁 Voar de helicóptero',fn:heliModal})}
 if(E.air.plane&&Math.hypot(P.x-HANG.x,P.y-HANG.y)<44)L.push({x:HANG.x,y:HANG.y,r:36,label:'🛩️ Avião agrícola (pulveriza a cada 3 dias de manhã)',fn:()=>{EMPT='air';openMenu('emp')}});
 if(vReady('don','praca')&&Math.hypot(P.x-113.5*TS,P.y-57.4*TS)<26)L.push({x:113.5*TS,y:56.6*TS,r:22,label:'🗿 Estátua do fazendeiro',fn:()=>toast('🗿 “Homenagem da Vila a '+(S.farmName||'Fazenda Boi de Ouro')+', que fez a cidade crescer.”')});
 return L};
// entrar nos prédios do Bairro Novo
const _ebEmp=enterBld;enterBld=function(id){if(!id||!id.startsWith('v_'))return _ebEmp(id);vbModal(id)};
function vbModal(id){const V=VB.find(q=>q.id===id);if(!V||!S.emp)return;const st=vSt(V.k,V.key),it=(V.k==='biz'?EBIZ:EDON).find(x=>x.id===V.key),v=S.emp.vila[V.k][V.key];reModal=()=>vbModal(id);
 if(st===1)return showModal('<h3>🏗️ Obra: '+it.n+'</h3>'+empArt('vb',id,200)+'<div class="card">O mestre de obras mostrou o andamento: '+Math.round((1-(v.d-S.day)/it.ob)*100)+'% pronto.<br>Inauguração em <b>'+(v.d-S.day)+' dia(s)</b>.</div><div class="btns"><button class="b gold" data-act="close">Ok</button></div>');
 const D=S.emp.dre[0],m=D&&D.f&&D.f[V.key],hr=S.t*24;let h='<h3>'+it.ic+' '+it.n+'</h3>'+empArt('vb',id,220)+'<div class="card">';
 if(V.k==='biz')h+='<div class="row"><span>Dono</span><b>Você</b></div><div class="row"><span>Aluguel</span><b class="grn">~'+R$(it.al)+'/mês</b></div>'+(m!==undefined?'<div class="row"><span>Último mês</span><b class="grn">'+R$s(m)+'</b></div>':'')+'<div class="row"><span>Funcionários</span><b>'+({posto:9,mercado:14,churras:11,loja:6,hotel:22}[V.key])+'</b></div>';
 h+='<div class="dim">'+it.d+'</div></div><div class="btns">';
 const svc={mercado:['🥪 Lanche (R$ 25): +40 de vida','vsnack'],churras:['🍖 Rodízio (R$ 89): vida cheia','vchurras'],posto:['☕ Café e pão de queijo (R$ 12): +15 de vida','vcafe'],hotel:['🧖 Spa do hotel (R$ 350): vida cheia','vspa'],loja:['🧰 Comprar sementes e ração (5% off)','vloja'],saude:['🩺 Consulta grátis: vida cheia','vsaude'],escola:['🍎 Visitar a escola (+1 reputação/semana)','vescola']}[V.key];
 if(svc)h+='<button class="b gold" data-act="'+svc[1]+'">'+svc[0]+'</button>';if(V.key==='churras')h+='<button class="b" data-act="vclient">🤝 Receber compradores (R$ 1.500, +2 rep, 1×/semana)</button>';
 showModal(h+'<button class="b gray" data-act="close">Sair</button></div>')}
const heal=(n,c,l)=>{if(c&&S.money<c)return toast('Dinheiro insuficiente','bad'),false;if(c)cash(-c,l);P.hp=Math.min(100,P.hp+n);return true};
Object.assign(ACT,{vsnack(){if(heal(40,25,'Lanche no mercado'))toast('🥪 Sanduíche de mortadela e guaraná. +40 de vida','good')},vchurras(){if(heal(100,89,'Rodízio na churrascaria'))toast('🍖 Picanha, costela e cupim. Vida cheia!','good')},vcafe(){if(heal(15,12,'Café no posto'))toast('☕ Cafezinho com pão de queijo. +15 de vida','good')},
 vspa(){if(heal(100,350,'Spa do hotel'))toast('🧖 Massagem e ofurô. Vida cheia!','good')},vsaude(){heal(100,0);toast('🩺 A enfermeira fez um curativo e te liberou. Vida cheia!','good')},vloja(){hideModal();openMenu('market')},
 vescola(){const E=S.emp,w=Math.floor(S.day/7);if(E.escW===w)return toast('Você já visitou a escola esta semana');E.escW=w;S.rep=Math.min(100,S.rep+1);toast('🍎 As crianças cantaram uma música para você. +1 reputação','good')},
 vclient(){const E=S.emp,w=Math.floor(S.day/7);if(E.chW===w)return toast('Já recebeu compradores esta semana');if(S.money<1500)return toast('Dinheiro insuficiente','bad');E.chW=w;cash(-1500,'Almoço com compradores');S.rep=Math.min(100,S.rep+2);toast('🤝 Almoço de negócios fechado. +2 reputação','good')}});
// ---------- ILUSTRAÇÕES DO MENU (desenhadas com a mesma arte do jogo e guardadas em cache)
const EART={};
function prevCv(W,H,fn){const cv=mkCanvas(W*3,H*3),g=cv.getContext('2d'),rm=RMODE;g.imageSmoothingEnabled=false;RMODE=0;try{g.setTransform(3,0,0,3,0,0);fn(g,W,H)}catch(e){console.error('arte',e)}finally{RMODE=rm}return cv.toDataURL()}
function empArt(kind,id,mw,inl){const k=kind+'|'+id;let u=EART[k];if(!u){const sz=kind==='house'?[200,120]:kind==='bull'||kind==='horse'?[64,44]:[160,64];u=EART[k]=prevCv(sz[0],sz[1],(g,W,H)=>ARTF[kind](g,W,H,id))}
 return inl?'<img src="'+u+'" style="width:'+(mw||84)+'px;height:auto;image-rendering:pixelated;border-radius:6px;flex:none" alt="">':'<img src="'+u+'" style="width:100%;max-width:'+(mw||260)+'px;height:auto;image-rendering:pixelated;display:block;margin:0 auto 6px;border-radius:6px" alt="">'}
function aSky(g,W,H,hz,c1,c2,night){for(let y=0;y<hz;y+=2)Rr(g,mix(c1,c2,y/hz),0,y,W,2);if(!night){Rr(g,'#fff6c0',W-28,6,9,9);Rr(g,'#fffbe0',W-26,8,5,5);for(const [cx,cy] of [[20,8],[78,12]]){Rr(g,'#fbfbff',cx,cy,18,4);Rr(g,'#fbfbff',cx+4,cy-3,10,4)}}else for(let i=0;i<20;i++)Rr(g,'#fff',hs(i,3)*W,hs(3,i)*hz*.8,1,1)}
function aGround(g,W,H,hz,c){Rr(g,c,0,hz,W,H-hz);for(let i=0;i<90;i++)Rr(g,shade(c,hs(i,7)>.5?10:-12),hs(i,1)*W,hz+hs(1,i)*(H-hz),2,1)}
function aHills(g,W,hz,c){for(let x=0;x<W;x+=2){const h=6+Math.sin(x*.05)*4+Math.sin(x*.13+1)*2;Rr(g,c,x,hz-h,2,h)}}
function aTree(g,x,y,c){Rr(g,'#5a3a22',x-1,y-10,2.4,10);Rr(g,c||'#2a7a2a',x-7,y-20,14,8);Rr(g,shade(c||'#2a7a2a',14),x-5,y-24,10,5);Rr(g,shade(c||'#2a7a2a',-14),x-7,y-14,14,2)}
function aPalm(g,x,y){Rr(g,'#7a5a3a',x,y-22,2,22);for(let i=0;i<7;i++)Rr(g,i%2?'#2a7a2a':'#3a9a3a',x-7+i*2.3,y-26+Math.abs(i-3)*2.4,4,3)}
function aFence(g,y,x0,x1){Rr(g,'#8a6a42',x0,y-6,x1-x0,1.2);Rr(g,'#8a6a42',x0,y-3,x1-x0,1.2);for(let x=x0;x<x1;x+=10)Rr(g,'#6a4a2a',x,y-8,1.6,8)}
function aCow(g,x,y,br,sex,dir,age){drawCow(g,{id:Math.abs(hsh(br+x+'|'+y))%9973+1,breed:br,sex:sex||'F',age:age||1400,w:sex==='M'?820:500,hp:100},x-8.5,y-10,dir||1,0,0)}
function aShed(g,x,y,w,h,wall,roof,txt){Rr(g,'rgba(0,0,0,.2)',x+2,y,w,3);Rr(g,wall,x,y-h,w,h);Rr(g,shade(wall,-14),x,y-h,w,1.4);Rr(g,roof,x-2,y-h-5,w+4,5);Rr(g,shade(roof,18),x-2,y-h-5,w+4,1.2);if(txt)ptext(g,txt,x+w/2-ptw(txt)/2,y-h+3,'#2a2a2a')}
function aSilo(g,x,y,w,h){Rr(g,'#c8ccd0',x,y-h,w,h);for(let j=0;j<h;j+=4)Rr(g,'#a8acb0',x,y-h+j,w,.6);Rr(g,'#e8ecf0',x+2,y-h,2,h);Rr(g,'#a8acb0',x,y-h-4,w,4);Rr(g,'#b8bcc0',x+2,y-h-6,w-4,2);Rr(g,'#8a8e92',x+w/2-1,y-h-8,2,2)}
function aTruck(g,x,y,c,box){Rr(g,'rgba(0,0,0,.25)',x-2,y-1,40,3);Rr(g,box||'#f4f4f4',x,y-14,26,11);Rr(g,c,x+26,y-11,10,8);Rr(g,'#9ad0f0',x+31,y-10,4,3.4);for(const wx of [x+6,x+30]){Rr(g,'#141414',wx-2.5,y-4,5,4.4);Rr(g,'#9a9aa2',wx-1,y-2.8,2,2)}}
const ARTF={
 farm(g,W,H,id){const f=EFARMS.find(x=>x.id===id)||EFARMS[0],t=f.tp,hz=26;aSky(g,W,H,hz,'#6ab0e8','#cfe8f4');
  if(id==='pantanal'){aGround(g,W,H,hz,'#6a9a3a');for(const [px,py,w] of [[8,40,40],[96,50,52],[60,32,26]]){Rr(g,'#3a8ac8',px,py,w,7);Rr(g,'#6ab0e0',px+2,py,w-4,2)}aPalm(g,30,38);aPalm(g,128,36);aPalm(g,140,40);
   aCow(g,56,52,'nelore','F',1);aCow(g,78,58,'nelore','F',-1);aCow(g,112,46,'nelore','M',1);Rr(g,'#f4f4f4',90,30,5,5);Rr(g,'#1a1a1a',94,26,2,4);Rr(g,'#c82a2a',94,29,2,2);Rr(g,'#1a1a1a',90,35,1,4);Rr(g,'#1a1a1a',93,35,1,4);return}
  if(t==='cafe'){aHills(g,W,hz,'#4a7a3a');aGround(g,W,H,hz,'#7a5a3a');for(let r=0;r<5;r++){const y=hz+6+r*8;for(let x=(r%2)*4;x<W;x+=9){Rr(g,'#1e5a22',x,y-5,7,6);Rr(g,'#2a7a2a',x+1,y-6,5,2);if(hs(x,r)>.4)Rr(g,'#d82a2a',x+2,y-3,1.4,1.4);if(hs(r,x)>.5)Rr(g,'#e84a3a',x+4,y-2,1.4,1.4)}}aShed(g,118,hz+4,26,12,'#f4efe4','#b5532e');return}
  if(t==='cana'){aGround(g,W,H,hz,'#8a9a3a');for(let x=0;x<W;x+=3){const h=18+hs(x,2)*10;Rr(g,'#7aa03a',x,H-h,1.6,h);Rr(g,'#a8c84a',x-2,H-h-2,5,1.4);Rr(g,'#5a8a2a',x+1,H-h+6,3,1)}aTruck(g,110,hz+6,'#c83a2a','#8aa83a');return}
  if(t==='graos'){aGround(g,W,H,hz,'#c8a040');for(let r=0;r<9;r++){const y=hz+2+r*4.2;Rr(g,r%2?'#a8882a':'#d8b84a',0,y,W,2)}Rr(g,'#8a8e94',6,hz+4,140,1.4);for(let x=6;x<146;x+=12){Rr(g,'#8a8e94',x,hz+4,1,8);Rr(g,'#5a5e64',x-1,hz+11,3,3);Rr(g,'#9ad0f0',x+4,hz+6,.6,3)}aSilo(g,138,hz+2,10,16);aSilo(g,126,hz+2,10,13);return}
  if(t==='confina'){aGround(g,W,H,hz,'#8a7a5a');for(let r=0;r<3;r++){const y=hz+12+r*12;aFence(g,y,4,150);for(let x=10;x<146;x+=14)aCow(g,x+(r%2)*6,y-1,'nelore',hs(x,r)>.5?'M':'F',hs(r,x)>.5?1:-1)}Rr(g,'#c8c8c8',4,hz+2,146,2);aSilo(g,140,hz+2,12,20);return}
  aHills(g,W,hz,'#5a9a3a');aGround(g,W,H,hz,'#6aa83a');aTree(g,18,hz+12,'#2a7a2a');aFence(g,hz+12,30,W);
  if(t==='leite'){aShed(g,104,hz+16,40,20,'#c83a2a','#5a3a22','');Rr(g,'#f4f4f4',120,hz+3,8,13);Rr(g,'#f4f4f4',104,hz-4,40,1.4);aCow(g,40,H-6,'girolando','F',1);aCow(g,70,H-10,'girolando','F',-1);aCow(g,90,H-4,'girolando','F',1);Rr(g,'#c8ccd0',150,hz+12,5,6);return}
  if(t==='misto'){Rr(g,'#c8a040',90,hz+2,W-90,H-hz);for(let r=0;r<8;r++)Rr(g,'#a8882a',90,hz+4+r*4.5,W-90,1.4);aSilo(g,146,hz+2,10,18);aCow(g,40,H-8,'nelore','F',1);aCow(g,66,H-4,'nelore','M',-1);return}
  const n=t==='engorda'?5:3;for(let i=0;i<n;i++)aCow(g,36+i*24,H-6-(i%2)*8,'nelore',t==='engorda'?'M':'F',i%2?-1:1,t==='engorda'?900:1400);if(t==='cria'){aCow(g,120,H-8,'nelore','F',1,180)}},
 ind(g,W,H,id){const hz=34;aSky(g,W,H,hz,'#6ab0e8','#d8ecf8');aGround(g,W,H,hz,'#8a9a6a');Rr(g,'#9a968c',0,H-12,W,12);for(let x=0;x<W;x+=16)Rr(g,'#f4f4f4',x,H-6.5,8,1);
  if(id==='armazem'){for(let i=0;i<4;i++)aSilo(g,14+i*22,H-12,18,30);Rr(g,'#8a8e94',104,H-48,6,36);Rr(g,'#8a8e94',94,H-48,32,3);aShed(g,112,H-12,40,16,'#c8ccd0','#9aa3ab','GRAOS');aTruck(g,60,H-2,'#2a6ad8','#c8a040');return}
  if(id==='laticinio'){aShed(g,10,H-12,90,26,'#f4f4f4','#9aa3ab','LATICINIO');Rr(g,'#2a6ab8',10,H-26,90,3);for(let i=0;i<5;i++)Rr(g,'#9ad0f0',16+i*16,H-22,8,6);for(let i=0;i<2;i++){Rr(g,'#d8dce0',108+i*16,H-40,12,28);Rr(g,'#f4f8fc',110+i*16,H-40,2,28);Rr(g,'#b8bcc0',108+i*16,H-42,12,3)}aTruck(g,100,H-2,'#2a6ab8','#e8ecf0');return}
  if(id==='frigo'){aShed(g,6,H-12,110,24,'#eef0f2','#9aa3ab','FRIGORIFICO SIF');Rr(g,'#c83a2a',6,H-24,110,2.4);for(let i=0;i<7;i++)Rr(g,'#5a6a7a',12+i*15,H-20,7,6);Rr(g,'#c8ccd0',120,H-46,6,34);for(let i=0;i<3;i++)Rr(g,'rgba(240,240,240,'+(.6-i*.15)+')',118+i*2,H-52-i*6,8+i*2,5);aTruck(g,100,H-2,'#c83a2a','#f4f4f4');aTruck(g,40,H-2,'#2a6ad8','#f4f4f4');return}
  if(id==='usina'){for(let i=0;i<3;i++){Rr(g,'#a8502a',20+i*14,H-58,7,46);Rr(g,'#c8603a',20+i*14,H-58,2,46);for(let j=0;j<3;j++)Rr(g,'rgba(230,230,230,'+(.6-j*.15)+')',18+i*14+j*3,H-64-j*6,10+j*2,5)}aShed(g,64,H-12,52,22,'#e8e4d8','#9aa3ab','USINA');for(let i=0;i<2;i++){Rr(g,'#f4f4f4',122+i*16,H-30,13,18);Rr(g,'#d8d8d8',122+i*16,H-32,13,3)}Rr(g,'#8aa83a',2,H-18,16,6);Rr(g,'#a8c84a',4,H-20,12,3);return}
  if(id==='trading'){Rr(g,'#2a6ab8',0,H-20,W,20);for(let i=0;i<16;i++)Rr(g,'#5a9ad8',hs(i,4)*W,H-18+hs(4,i)*16,6,1);Rr(g,'#9a968c',0,H-24,W,4);Rr(g,'#3a3a44',20,H-18,92,10);Rr(g,'#c83a2a',20,H-10,92,2);Rr(g,'#f4f4f4',96,H-30,14,12);Rr(g,'#2a3a4a',98,H-28,10,2);
   const cc=['#c83a2a','#2a6ad8','#f0a020','#3a9a4a','#8a4ac8'];for(let r=0;r<2;r++)for(let i=0;i<7;i++)Rr(g,cc[(i+r*2)%5],24+i*10,H-24-r*6,9,5.4);Rr(g,'#f0c020',126,H-60,3,40);Rr(g,'#f0c020',126,H-60,30,3);Rr(g,'#f0c020',150,H-60,3,40);Rr(g,'#3a3a3a',140,H-57,1,14);return}
  if(id==='central'){aShed(g,16,H-12,80,24,'#f4f4f4','#9aa3ab','CENTRAL DE SEMEN');Rr(g,'#2a8a3a',16,H-24,80,2.4);for(let i=0;i<4;i++){Rr(g,'#c8ccd0',100+i*9,H-22,7,10);Rr(g,'#e8ecf0',101+i*9,H-24,5,3)}aCow(g,140,H-12,'nelore','M',-1);aCow(g,8,H-12,'angus','M',1);return}},
 air(g,W,H,id){const hz=46;aSky(g,W,H,hz,'#4a98e0','#d8ecf8');aGround(g,W,H,hz,'#6aa83a');Rr(g,'#7a766c',0,hz+6,W,10);for(let x=4;x<W;x+=14)Rr(g,'#f4f4f4',x,hz+10.5,7,1.2);
  g.save();if(id==='plane'){g.translate(78,hz+8);g.scale(2.1,2.1);drawPlane(g,0,0,1,{})}else if(id==='heli'){g.translate(88,hz+12);g.scale(2,2);drawHeli(g,0,0,0,0,0,{})}else{g.translate(80,34);g.scale(1.9,1.9);drawJet(g,0,0)}g.restore()},
 vb(g,W,H,id){const V=VB.find(q=>q.id===id);if(!V)return;aSky(g,W,H,18,'#6ab0e8','#d8ecf8');aGround(g,W,H,18,'#6aa83a');Rr(g,'#b8a888',0,H-6,W,6);const w=V.w*TS,h=VBH*TS,sc=Math.min(1,(W-36)/(w+60)),bx=W/2-w*sc/2;
  g.save();g.translate(bx,H-6-h*sc);g.scale(sc,sc);const b={id:V.id,x:0,y:0,w:V.w,h:VBH,door:V.door-V.x};try{BART[V.id](g,b,0,0,w,h,(V.door-V.x)*TS,2)}finally{g.restore()}},
 don(g,W,H,id){if(id==='escola'||id==='saude')return ARTF.vb(g,W,H,'v_'+id);const hz=22;aSky(g,W,H,hz,'#6ab0e8','#d8ecf8');
  if(id==='praca'){aGround(g,W,H,hz,'#b8a888');aTree(g,14,H-12);aTree(g,146,H-12);g.save();g.translate(40,H-6);g.scale(1.3,1.3);statue(g,0,0);g.restore();lampP(g,70,H-10);lampP(g,126,H-10);bedP(g,98,H-8);bench(g,104,H-14);Rr(g,'#c8c0b0',84,H-30,26,8);Rr(g,'#5ab8e8',86,H-29,22,5);Rr(g,'#e8e0d0',95.5,H-40,3,12);return}
  if(id==='ponte'){aGround(g,W,H,hz,'#6aa83a');Rr(g,'#3a8ac8',50,hz,60,H-hz);for(let i=0;i<10;i++)Rr(g,'#6ab0e0',52+hs(i,9)*54,hz+4+hs(9,i)*30,6,1);Rr(g,'#a8a49a',0,hz+12,W,14);Rr(g,'#8a867c',0,hz+25,W,2);for(let x=0;x<W;x+=8){Rr(g,'#f4f4f0',x,hz+6,1.6,6)}Rr(g,'#e8e8e4',0,hz+6,W,1.6);for(const px of [58,98])Rr(g,'#7a766c',px,hz+27,6,H-hz-27);carW(g,40,hz+24,'#c83a2a','pick',1);return}
  aGround(g,W,H,hz,'#6aa83a');Rr(g,'#3e3e44',0,hz+12,W,24);Rr(g,'#e8e8e8',0,hz+13,W,1);Rr(g,'#e8e8e8',0,hz+34,W,1);for(let x=0;x<W;x+=16)Rr(g,'#f0c020',x,hz+23.5,8,1.4);carW(g,50,hz+30,'#e8e8e8','suv',1);carW(g,112,hz+22,'#2a6ad8','pick',-1);Rr(g,'#2a8a3a',140,hz-2,12,8);ptext(g,'BR',141,hz,'#fff');Rr(g,'#8a8a8a',145,hz+6,1.6,6)},
 festa(g,W,H){const hz=30;aSky(g,W,H,hz,'#0a1030','#3a2a5a',1);for(const [fx,fy,c] of [[30,12,'#ff5a5a'],[80,8,'#ffd75e'],[126,14,'#7ad8ff']])for(let i=0;i<12;i++){const a=i*.52;Rr(g,c,fx+Math.cos(a)*8,fy+Math.sin(a)*8,1.4,1.4);Rr(g,c,fx+Math.cos(a)*4,fy+Math.sin(a)*4,1,1)}
  aGround(g,W,H,hz,'#8a6a42');for(let i=0;i<70;i++)Rr(g,['#c83a2a','#3a7ac8','#e0a431','#f4f4f4','#3a9a4a'][i%5],hs(i,2)*W,hz+2+hs(2,i)*8,2,3);Rr(g,'#c8a070',20,hz+14,120,22);aFence(g,hz+15,20,140);aFence(g,H-2,20,140);
  Rr(g,'#3a2a1a',60,H-20,16,8);Rr(g,'#2a1a10',74,H-24,3,3);Rr(g,'#c8a070',62,H-12,2,4);Rr(g,'#c8a070',72,H-12,2,4);Rr(g,'#c83a2a',66,H-30,6,8);Rr(g,'#e8b890',67,H-34,4,4);Rr(g,'#5a3a22',65,H-36,8,2);
  Rr(g,'#c83a2a',40,hz-6,80,8);ptext(g,'FESTA DO PEAO',53,hz-4.5,'#ffd75e')},
 time(g,W,H){aSky(g,W,H,16,'#4a98e0','#d8ecf8');Rr(g,'#5a5e64',0,16,W,14);for(let i=0;i<120;i++)Rr(g,['#f0d040','#2a8a3a','#f4f4f4','#c83a2a'][i%4],hs(i,5)*W,17+hs(5,i)*12,1.6,1.6);Rr(g,'#3a9a3a',0,30,W,H-30);for(let x=0;x<W;x+=16)Rr(g,'#2a8a2a',x,30,8,H-30);
  Rr(g,'#f4f4f4',0,32,W,.8);Rr(g,'#f4f4f4',W/2-.4,32,.8,H-32);g.strokeStyle='#f4f4f4';g.lineWidth=.8;g.beginPath();g.arc(W/2,47,9,0,7);g.stroke();Rr(g,'#f4f4f4',4,38,1,18);Rr(g,'#f4f4f4',4,38,8,1);Rr(g,'#f4f4f4',4,55,8,1);Rr(g,'#f4f4f4',W-5,38,1,18);Rr(g,'#f4f4f4',W-12,38,8,1);Rr(g,'#f4f4f4',W-12,55,8,1);
  drawPerson(g,{x:60,y:56,dir:3,ph:1,mv:1,shirt:'#f0d040',pants:'#2a8a3a'});drawPerson(g,{x:96,y:52,dir:2,ph:2,mv:1,shirt:'#c83a2a',pants:'#f4f4f4'});Rr(g,'#f4f4f4',74,54,3,3);Rr(g,'#1a1a1a',75,55,1,1)},
 pref(g,W,H){const hz=20;aSky(g,W,H,hz,'#6ab0e8','#d8ecf8');aGround(g,W,H,hz,'#b8a888');Rr(g,'#f4efe4',34,18,92,36);Rr(g,'#3a6a9a',34,48,92,6);roofClay(g,30,8,100,12,'#b5532e',true);for(let i=0;i<5;i++)winColonial(g,40+i*18,26,'#f4f4f4','#2a5a2a');Rr(g,'#1e140c',62,10,36,8);ptext(g,'PREFEITURA',63,11.5,'#ffd75e');
  Rr(g,'#c8c8c8',20,4,1.4,50);Rr(g,'#2a9a3a',21.4,5,12,8);Rr(g,'#f0d040',24,6.4,6,5);Rr(g,'#2a4a9a',25.6,7.6,3,2.4);for(let i=0;i<8;i++)drawPerson(g,{x:20+i*16,y:H-2,dir:1,shirt:['#c83a2a','#3a7ac8','#e0a431','#3a9a4a'][i%4]})},
 haras(g,W,H){const hz=26;aSky(g,W,H,hz,'#6ab0e8','#d8ecf8');aHills(g,W,hz,'#5a9a3a');aGround(g,W,H,hz,'#6aa83a');Rr(g,'#c83a2a',70,hz-8,80,26);Rr(g,'#f4f4f4',70,hz-8,80,1.6);roofGambrel(g,68,hz-22,84,14,'#5a3a22');for(let i=0;i<5;i++){Rr(g,'#3a2210',74+i*15,hz+2,10,10);Rr(g,'#f4f4f4',74+i*15,hz+2,10,1)}
  aFence(g,H-4,0,66);drawHorseS(g,22,H-8,3,'quarto',{});drawHorseS(g,52,H-12,2,'arabe',{})},
 lock(g,W,H){ARTF.farm(g,W,H,'imperio');Rr(g,'rgba(0,0,0,.35)',0,0,W,H);Rr(g,'#c8a040',W/2-10,H/2-4,20,16);Rr(g,'#a8802a',W/2-10,H/2+8,20,4);g.strokeStyle='#c8a040';g.lineWidth=3;g.beginPath();g.arc(W/2,H/2-6,7,Math.PI,0);g.stroke();Rr(g,'#5a3a1a',W/2-1.5,H/2+1,3,6)},
 house(g,W,H,L){L=+L||0;Rr(g,'#6ab0e8',0,0,W,40);aSky(g,W,H,40,'#6ab0e8','#d8ecf8');aGround(g,W,H,40,'#6aa83a');Rr(g,'#b8a07a',0,H-14,W,14);const b=BLD.find(q=>q.id==='house')||{id:'house',x:6,y:42,w:6,h:4,door:8};
  const w=b.w*TS,h=b.h*TS,x=70,y=H-16-h;const v=L>0?10+L:4;g.save();g.translate(x-b.x*TS,y-b.y*TS);try{BART.house(g,b,b.x*TS,b.y*TS,w,h,(b.door-b.x)*TS,v)}finally{g.restore()}},
 bull(g,W,H,id){const [br,oid]=String(id).split('|');aSky(g,W,H,18,'#8ac0ec','#e0f0f8');aGround(g,W,H,18,'#6aa83a');drawCow(g,{id:(+oid||7)%9973+1,breed:br,sex:'M',age:1500,w:980,hp:100,breeder:1},W/2-8.5,H-14,1,0,0);Rr(g,'#c8a040',4,4,8,10);Rr(g,'#e8c060',5,5,6,6);Rr(g,'#c83a2a',5,12,2,5);Rr(g,'#2a6ad8',9,12,2,5)},
 horse(g,W,H,b){aSky(g,W,H,18,'#8ac0ec','#e0f0f8');aGround(g,W,H,18,'#6aa83a');drawHorseS(g,W/2,H-6,3,b,{});Rr(g,'#c8a040',4,4,8,10);Rr(g,'#e8c060',5,5,6,6);Rr(g,'#c83a2a',5,12,2,5);Rr(g,'#2a6ad8',9,12,2,5)}
};
