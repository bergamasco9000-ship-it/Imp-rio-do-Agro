// ===== Relojoaria Rolês: relógios desenhados em detalhe (vitrine, "ver de perto" e no pulso) + o Oyster "O Tempo Voa", pintado por moscas
LUXS.find(s=>s.id==='ro').it.push({id:'rmosca',n:'Rolês Oyster “O Tempo Voa” (pintado por moscas)',s:'watch',p:250000,r:7,o:{},c:'#d8dce2',st:'ro'});
LUXI.rmosca=LUXS.find(s=>s.id==='ro').it.find(i=>i.id==='rmosca');
const WSPEC={
 rdate:{n:'Datejust 41 · aço e ouro amarelo',band:'jubilee',metal:['#e8ecf0','#c8ccd2'],gold:['#f4d870','#c89a2a'],bezel:'fluted',dial:['#f0e2b8','#d8c08a'],idx:'baton',date:1,txt:'DATEJUST',d:'Bisel canelado de ouro, mostrador champanhe com raios de sol, pulseira Jubilee de cinco elos em aço e ouro, data com lupa “cíclope” às 3 horas.'},
 rsub:{n:'Submariner · ouro amarelo 18k',band:'oyster',metal:['#f4d870','#c89a2a'],gold:['#f4d870','#c89a2a'],bezel:'diver',bezC:'#1a2a6a',dial:['#24367a','#121c48'],idx:'dots',date:1,mercedes:1,txt:'SUBMARINER',d:'Todo em ouro, bisel giratório de cerâmica azul com escala de 60 minutos, mostrador azul “sunburst”, ponteiro Mercedes e marcadores luminosos.'},
 rday:{n:'Daytona · platina 950',band:'oyster',metal:['#f0f4f8','#b8c0c8'],gold:['#f0f4f8','#b8c0c8'],bezel:'tachy',bezC:'#6a3a20',dial:['#cfe6f4','#a8c8e0'],idx:'baton',sub:1,txt:'DAYTONA',d:'Platina com mostrador azul-gelo (exclusivo da platina), bisel taquímetro marrom “chestnut” e três submostradores do cronógrafo.'},
 rdiam:{n:'Day-Date Presidente · ouro e diamantes',band:'president',metal:['#f4d870','#c89a2a'],gold:['#f4d870','#c89a2a'],bezel:'diamond',dial:['#f8f4ec','#e0d8c8'],idx:'diamond',day:1,date:1,txt:'DAY-DATE',d:'O relógio dos presidentes: ouro maciço, bisel cravejado com 44 diamantes, índices de diamante, dia da semana às 12 e data às 3.'},
 rmosca:{n:'Oyster Perpetual “O Tempo Voa”',band:'oyster',metal:['#e8ecf0','#c0c6ce'],gold:['#e8ecf0','#c0c6ce'],bezel:'smooth',dial:['#fbf8f0','#eee8da'],idx:'baton',flies:1,txt:'OYSTER PERPETUAL',d:'Peça única, inspirada num projeto de arte real: as moscas foram alimentadas com corantes e soltas sobre o mostrador branco de um Oyster Perpetual de verdade, deixando pintas coloridas por todo lado. Cada pinta é única no mundo, e uma mosquinha ficou de lembrança.'}};
function wGrad(g,x0,y0,x1,y1,c){const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,shade(c[0],18));gr.addColorStop(.35,c[0]);gr.addColorStop(.6,c[1]);gr.addColorStop(.85,shade(c[0],10));gr.addColorStop(1,shade(c[1],-20));return gr}
function wDraw(g,id,cx,cy,R,t){const S0=WSPEC[id];if(!S0)return;const m=S0.metal,au=S0.gold,TAU=Math.PI*2;g.save();
 // pulseira
 const bw=R*1.12;for(const dir of[-1,1]){const y0=cy+dir*R*.95,len=R*1.7;for(let k=0;k<6;k++){const yy=dir<0?y0-(k+1)*len/6:y0+k*len/6,w=bw*(1-k*.035),x=cx-w/2,h=len/6-1;
   if(S0.band==='oyster'){g.fillStyle=wGrad(g,x,0,x+w,0,m);g.fillRect(x,yy,w*.3,h);g.fillRect(x+w*.7,yy,w*.3,h);g.fillStyle=wGrad(g,x,0,x+w,0,[shade(m[0],12),m[0]]);g.fillRect(x+w*.31,yy,w*.38,h);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,yy+h,w,1)}
   else if(S0.band==='jubilee'){g.fillStyle=wGrad(g,x,0,x+w,0,m);g.fillRect(x,yy,w*.22,h);g.fillRect(x+w*.78,yy,w*.22,h);for(let j=0;j<3;j++){g.fillStyle=wGrad(g,x,0,x+w,0,j===1?m:au);g.fillRect(x+w*(.24+j*.18),yy+(j%2?h/2:0),w*.16,h/2-.5);g.fillRect(x+w*(.24+j*.18),yy+(j%2?0:h/2),w*.16,h/2-.5)}g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x,yy+h,w,1)}
   else{g.fillStyle=wGrad(g,x,0,x+w,0,m);for(let j=0;j<3;j++){const xx=x+j*w/3+.5;g.beginPath();g.roundRect?g.roundRect(xx,yy,w/3-1,h,h*.4):g.rect(xx,yy,w/3-1,h);g.fill()}g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x+w*.4,yy+1,w*.2,h*.3)}}}
 // alças e coroa
 g.fillStyle=wGrad(g,cx-R,0,cx+R,0,m);g.fillRect(cx-bw/2-1,cy-R*1.1,bw+2,R*2.2);
 g.fillStyle=wGrad(g,0,cy-R*.18,0,cy+R*.18,m);g.fillRect(cx+R*1.02,cy-R*.17,R*.2,R*.34);for(let i=0;i<4;i++){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(cx+R*1.04+i*R*.045,cy-R*.17,R*.015,R*.34)}
 if(S0.sub){g.fillStyle=wGrad(g,0,0,0,1,m);g.fillRect(cx+R*.85,cy-R*.62,R*.22,R*.16);g.fillRect(cx+R*.85,cy+R*.46,R*.22,R*.16)}
 // caixa
 g.beginPath();g.arc(cx,cy,R*1.06,0,TAU);g.fillStyle=wGrad(g,cx-R,cy-R,cx+R,cy+R,m);g.fill();g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=1;g.stroke();
 // bisel
 const bz=S0.bezel;g.beginPath();g.arc(cx,cy,R,0,TAU);
 if(bz==='diver'||bz==='tachy'){g.fillStyle=S0.bezC;g.fill();g.fillStyle=bz==='diver'?'#f4e8b0':'#f4f0e4';g.strokeStyle=g.fillStyle;for(let i=0;i<60;i++){const a=i/60*TAU-Math.PI/2,big=i%5===0,r1=R*.98,r2=R*(big?.84:.92);g.lineWidth=big?R*.03:R*.012;g.beginPath();g.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);g.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);g.stroke()}
  if(bz==='diver'){g.beginPath();g.moveTo(cx,cy-R*.97);g.lineTo(cx-R*.08,cy-R*.84);g.lineTo(cx+R*.08,cy-R*.84);g.closePath();g.fillStyle='#f4e8b0';g.fill();g.beginPath();g.arc(cx,cy-R*.82,R*.03,0,TAU);g.fillStyle='#e8f0d0';g.fill()}
  else{g.font='bold '+Math.max(5,R*.09)+'px sans-serif';g.textAlign='center';g.fillText('TACHYMETRE',cx,cy-R*.86)}}
 else if(bz==='fluted'){g.fillStyle=wGrad(g,cx-R,cy-R,cx+R,cy+R,au);g.fill();for(let i=0;i<48;i++){const a=i/48*TAU;g.strokeStyle=i%2?'rgba(255,255,220,.75)':'rgba(120,80,10,.6)';g.lineWidth=R*.04;g.beginPath();g.moveTo(cx+Math.cos(a)*R*.99,cy+Math.sin(a)*R*.99);g.lineTo(cx+Math.cos(a)*R*.84,cy+Math.sin(a)*R*.84);g.stroke()}}
 else if(bz==='diamond'){g.fillStyle=wGrad(g,cx-R,cy-R,cx+R,cy+R,au);g.fill();for(let i=0;i<44;i++){const a=i/44*TAU,x=cx+Math.cos(a)*R*.91,y=cy+Math.sin(a)*R*.91;g.beginPath();g.arc(x,y,R*.065,0,TAU);g.fillStyle='#eef6ff';g.fill();g.fillStyle='#ffffff';g.fillRect(x-R*.02,y-R*.035,R*.03,R*.03);if(((t||0)+i*7)%50<4){g.fillStyle='#fff';g.fillRect(x-R*.12,y-.5,R*.24,1);g.fillRect(x-.5,y-R*.12,1,R*.24)}}}
 else{g.fillStyle=wGrad(g,cx-R,cy-R,cx+R,cy+R,m);g.fill()}
 // mostrador
 const dr=R*.82;g.beginPath();g.arc(cx,cy,dr,0,TAU);const dg=g.createRadialGradient(cx-dr*.3,cy-dr*.3,dr*.1,cx,cy,dr);dg.addColorStop(0,shade(S0.dial[0],12));dg.addColorStop(.7,S0.dial[0]);dg.addColorStop(1,S0.dial[1]);g.fillStyle=dg;g.fill();
 g.save();g.clip();for(let i=0;i<90;i++){const a=i/90*TAU;g.strokeStyle=i%2?'rgba(255,255,255,.07)':'rgba(0,0,0,.05)';g.lineWidth=dr*.02;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*dr,cy+Math.sin(a)*dr);g.stroke()}// raios de sol
 if(S0.flies){// as pintas das moscas: manchas orgânicas irregulares, cada uma de um tom
  const fr=k=>{const v=Math.sin(k*12.9898+78.233)*43758.5453;return v-Math.floor(v)};for(let i=0;i<120;i++){const r=Math.floor(fr(i)*1e6),a=fr(i+.37)*6.283,d=Math.sqrt(fr(i+.71))*dr*.95,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d,s=dr*(.012+((r>>4)%7)/260),col=['#ff3a8a','#2a8aff','#ffd21a','#24c86a','#ff7a1a','#9a4aff','#1ad8d8','#ff4a3a'][r%8];
   g.fillStyle=col;g.beginPath();g.ellipse(x,y,s*(1+(r>>12)%3*.4),s,(r%31)/5,0,TAU);g.fill();if(r%4===0){g.beginPath();g.arc(x+s*1.6,y+s*.4,s*.5,0,TAU);g.fill()}if(r%7===0){g.strokeStyle=col;g.lineWidth=s*.6;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+s*3,y-s*2,x+s*4.5,y+s*.5);g.stroke()}}}
 g.restore();
 // índices
 for(let i=0;i<12;i++){const a=i/12*TAU-Math.PI/2;if((S0.date&&i===3)||(S0.sub&&(i===3||i===9||i===6)))continue;const x=cx+Math.cos(a)*dr*.78,y=cy+Math.sin(a)*dr*.78;
  if(S0.idx==='diamond'){g.beginPath();g.arc(x,y,dr*.06,0,TAU);g.fillStyle='#eef6ff';g.fill();g.strokeStyle='#c89a2a';g.lineWidth=1;g.stroke();g.fillStyle='#fff';g.fillRect(x-dr*.02,y-dr*.03,dr*.025,dr*.025)}
  else if(S0.idx==='dots'){g.fillStyle=wGrad(g,x-3,y-3,x+3,y+3,au);if(i===0){g.beginPath();g.moveTo(x,y+dr*.07);g.lineTo(x-dr*.08,y-dr*.06);g.lineTo(x+dr*.08,y-dr*.06);g.fill()}else if(i%3===0)g.fillRect(x-dr*.035,y-dr*.08,dr*.07,dr*.16);else{g.beginPath();g.arc(x,y,dr*.055,0,TAU);g.fill()}g.fillStyle='#f0f4e0';g.beginPath();g.arc(x,y,dr*.03,0,TAU);g.fill()}
  else{g.save();g.translate(x,y);g.rotate(a+Math.PI/2);g.fillStyle=wGrad(g,-3,0,3,0,au);const w=i===0?dr*.11:dr*.05;g.fillRect(-w/2,-dr*.09,w,dr*.18);if(i===0){g.fillStyle='rgba(0,0,0,.4)';g.fillRect(-.5,-dr*.09,1,dr*.18)}g.restore()}}
 for(let i=0;i<60;i++){if(i%5===0)continue;const a=i/60*TAU;g.fillStyle=S0.dial[0]>'#8'?'rgba(40,40,40,.5)':'rgba(240,240,240,.5)';g.fillRect(cx+Math.cos(a)*dr*.93-.4,cy+Math.sin(a)*dr*.93-.4,.8,.8)}
 // coroa e nome
 const tc=S0.dial[0]>'#8'?'#1a1a1a':'#f0f0f0';g.fillStyle=S0.gold[0];g.beginPath();const kx=cx,ky=cy-dr*.48,ks=dr*.07;g.moveTo(kx-ks*1.5,ky+ks);g.lineTo(kx-ks*1.5,ky-ks*.4);g.lineTo(kx-ks*.75,ky+ks*.2);g.lineTo(kx,ky-ks);g.lineTo(kx+ks*.75,ky+ks*.2);g.lineTo(kx+ks*1.5,ky-ks*.4);g.lineTo(kx+ks*1.5,ky+ks);g.closePath();g.fill();
 g.fillStyle=tc;g.textAlign='center';g.font='bold '+Math.max(5,dr*.12)+'px serif';g.fillText('ROLÊS',cx,cy-dr*.27);g.font=Math.max(4,dr*.075)+'px sans-serif';if(S0.sub){g.fillText(S0.txt,cx,cy-dr*.17)}else{g.fillText(S0.txt,cx,cy+dr*.38);g.fillText('SUPERLATIVE CHRONOMETER',cx,cy+dr*.48)}
 // complicações
 if(S0.sub)for(const [ox,oy] of[[-.42,0],[.42,0],[0,.42]]){const sx=cx+ox*dr,sy=cy+oy*dr;g.beginPath();g.arc(sx,sy,dr*.2,0,TAU);g.fillStyle='#e8f0f6';g.fill();g.strokeStyle='#5a6a7a';g.lineWidth=1;g.stroke();for(let i=0;i<12;i++){const a=i/12*TAU;g.fillStyle='#3a4a5a';g.fillRect(sx+Math.cos(a)*dr*.16-.4,sy+Math.sin(a)*dr*.16-.4,.8,.8)}g.strokeStyle='#2a3a4a';g.lineWidth=1.2;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+Math.cos(ox*9)*dr*.15,sy+Math.sin(ox*9)*dr*.15);g.stroke()}
 if(S0.date){const x=cx+dr*.62,y=cy;g.fillStyle='#ffffff';g.fillRect(x-dr*.1,y-dr*.08,dr*.2,dr*.16);g.fillStyle='#1a1a1a';g.font='bold '+Math.max(5,dr*.12)+'px sans-serif';g.fillText(String(((S&&S.day)||0)%28+1),x,y+dr*.045);g.beginPath();g.arc(x,y,dr*.15,0,TAU);g.fillStyle='rgba(200,230,255,.25)';g.fill();g.strokeStyle='rgba(255,255,255,.5)';g.stroke()}// lupa cíclope
 if(S0.day){g.fillStyle='#ffffff';g.fillRect(cx-dr*.3,cy-dr*.72,dr*.6,dr*.17);g.fillStyle='#1a1a1a';g.font='bold '+Math.max(4,dr*.11)+'px sans-serif';g.fillText(['DOMINGO','SEGUNDA','TERÇA','QUARTA','QUINTA','SEXTA','SÁBADO'][((S&&S.day)||0)%7],cx,cy-dr*.6)}
 // ponteiros (hora do jogo)
 const hr=((typeof S!=='undefined'&&S)?S.t*24:10.1),mi=(hr%1)*60,se=((t||0)/6)%60;const hand=(a,len,w,col,merc)=>{g.save();g.translate(cx,cy);g.rotate(a);g.fillStyle=col;g.fillRect(-w/2,-len,w,len+dr*.1);if(merc){g.beginPath();g.arc(0,-len*.72,w*1.6,0,TAU);g.fill();g.fillStyle='#e8f0d0';g.beginPath();g.arc(0,-len*.72,w*.9,0,TAU);g.fill()}else{g.fillStyle='#e8f0d0';g.fillRect(-w/4,-len*.9,w/2,len*.6)}g.restore()};
 const hc=S0.gold[0]>'#e'?shade(S0.gold[0],-10):S0.gold[0];hand((hr%12)/12*TAU,dr*.48,dr*.07,hc,S0.mercedes);hand(mi/60*TAU,dr*.72,dr*.05,hc);
 g.save();g.translate(cx,cy);g.rotate(se/60*TAU);g.fillStyle=S0.mercedes?'#f0d060':'#c8302a';g.fillRect(-.5,-dr*.8,1,dr*.95);g.beginPath();g.arc(0,-dr*.62,dr*.035,0,TAU);g.fill();g.restore();
 g.beginPath();g.arc(cx,cy,dr*.04,0,TAU);g.fillStyle=hc;g.fill();
 if(S0.flies){// a mosquinha que ficou
  const fx=cx+dr*.36,fy=cy+dr*.2,fs=dr*.06;g.fillStyle='rgba(200,220,240,.55)';g.beginPath();g.ellipse(fx-fs*.9,fy-fs*.5,fs*1.3,fs*.55,-.6,0,TAU);g.fill();g.beginPath();g.ellipse(fx+fs*.9,fy-fs*.5,fs*1.3,fs*.55,.6,0,TAU);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.ellipse(fx,fy,fs*.55,fs*1.1,0,0,TAU);g.fill();g.beginPath();g.arc(fx,fy-fs*1.1,fs*.45,0,TAU);g.fill();g.fillStyle='#8a1a1a';g.fillRect(fx-fs*.45,fy-fs*1.35,fs*.3,fs*.3);g.fillRect(fx+fs*.15,fy-fs*1.35,fs*.3,fs*.3);
  g.strokeStyle='#1a1a1a';g.lineWidth=.6;for(const s of[-1,1])for(let k=0;k<3;k++){g.beginPath();g.moveTo(fx,fy-fs*.3+k*fs*.4);g.lineTo(fx+s*fs*1.2,fy+k*fs*.5);g.stroke()}}
 // vidro de safira: reflexo
 g.beginPath();g.arc(cx,cy,dr,Math.PI*1.05,Math.PI*1.55);g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=dr*.06;g.stroke();g.beginPath();g.arc(cx-dr*.25,cy-dr*.3,dr*.5,Math.PI,Math.PI*1.5);g.strokeStyle='rgba(255,255,255,.15)';g.lineWidth=dr*.2;g.stroke();
 g.restore()}
const WIMG={};function watchImg(id,big){const k=id+(big?'B':'');if(WIMG[k])return WIMG[k];const W=big?300:110,H=big?360:132,c=mkCanvas(W,H),g=c.getContext('2d');
 const bg=g.createRadialGradient(W/2,H/2,10,W/2,H/2,W*.7);bg.addColorStop(0,'#3a2e22');bg.addColorStop(1,'#140e08');g.fillStyle=bg;g.fillRect(0,0,W,H);wDraw(g,id,W/2,H/2,W*.3,0);return WIMG[k]=c.toDataURL()}
// vitrine com foto de cada relógio + "ver de perto"
const _lsW=luxStore;luxStore=function(id){_lsW(id);if(id!=='ro')return;const s=LUXS.find(x=>x.id==='ro'),cards=document.querySelectorAll('#mbox .card');
 s.it.forEach((it,i)=>{const c=[...cards].find(x=>{const b=x.querySelector('b');return b&&b.textContent===it.n});if(!c)return;const d=document.createElement('div');d.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:4px';d.innerHTML='<img src="'+watchImg(it.id)+'" style="width:84px;height:101px;border-radius:6px;border:2px solid #c8a040;flex:none"><div class="dim" style="font-size:12px">'+(WSPEC[it.id]?WSPEC[it.id].d:'')+'</div>';c.insertBefore(d,c.firstChild.nextSibling);
  const b=document.createElement('button');b.className='b';b.dataset.act='lxzoom';b.dataset.v=it.id;b.textContent='🔍 Ver de perto';const bt=c.querySelector('.btns');if(bt)bt.appendChild(b)})};
ACT.lxzoom=function(e){const id=e.v,S0=WSPEC[id],i=LUXI[id];if(!S0)return;let T=0;showModal('<h3>⌚ '+i.n+'</h3><div style="text-align:center"><canvas id="wzoom" width="600" height="720" style="width:260px;height:312px;border-radius:10px;border:3px solid #c8a040;background:#140e08"></canvas></div><div class="card"><b>'+S0.n+'</b><div class="dim">'+S0.d+'</div><div class="row"><span>Preço</span><span class="gold">'+R$(i.p)+'</span></div></div><div class="btns"><button class="b gray" data-act="lxst" data-v="ro">⬅️ Vitrine</button></div>');
 const cv=document.getElementById('wzoom'),g=cv.getContext('2d');const loop=()=>{if(!document.getElementById('wzoom'))return;T++;g.clearRect(0,0,600,720);const bg=g.createRadialGradient(300,360,20,300,360,500);bg.addColorStop(0,'#3a2e22');bg.addColorStop(1,'#120c06');g.fillStyle=bg;g.fillRect(0,0,600,720);wDraw(g,id,300,360,180,T);requestAnimationFrame(loop)};loop()};
// ---------- no pulso: pulseira, caixa, bisel, mostrador e brilho, com cor de cada modelo
const WPC={rdate:{b:'#d8dce2',bz:'#e8c040',dl:'#e8d8a8'},rsub:{b:'#e8c040',bz:'#1a2a6a',dl:'#24367a'},rday:{b:'#e8ecf0',bz:'#6a3a20',dl:'#bcdcf0'},rdiam:{b:'#e8c040',bz:'#f4faff',dl:'#f8f4ec'},rmosca:{b:'#d8dce2',bz:'#e8ecf0',dl:'#fbf8f0'}};
(function(){const W0=drawPlayerBase;drawPlayerBase=function(g){const W=S.wd,keep=W&&W.eq.watch;if(keep)W.eq.watch=null;try{W0(g)}finally{if(keep)W.eq.watch=keep}
 if(!keep||S.h.outfit!=='casual'||P.drive||RMODE===4)return;const i=LUXI[keep],pc=WPC[keep];if(!i||!pc)return;
 const mv=P.moving&&!P.aim,sw=mv?Math.sin(P.ph):0,bob=mv?Math.abs(Math.cos(P.ph))*(P.run?1.4:.8):0,by=P.y-bob+(P.sneak?2.5:0),sY=by-17.5,dir=P.dir,f=S.look.g==='f';
 let x,y;if(dir===0){x=P.x+(f?3.9:4.3);y=sY+5.2-sw*.63}else if(dir===1){x=P.x-(f?5.6:6);y=sY+5.2+sw*.63}else{const dr=dir===3?1:-1;x=P.x-.8+sw*2.4*dr;y=sY+5.2}
 const R=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);R(shade(pc.b,-30),x-.15,y-.2,2.1,1.6);R(pc.b,x-.05,y-.1,1.9,1.4);R(shade(pc.b,25),x-.05,y-.1,1.9,.3);
 if(dir!==1){R(pc.bz,x+.25,y+.05,1.3,1.1);R(pc.dl,x+.45,y+.25,.9,.7);if(keep==='rmosca'){R('#ff3a8a',x+.5,y+.3,.22,.22);R('#2a8aff',x+1.05,y+.6,.2,.2);R('#ffd21a',x+.8,y+.28,.18,.18);R('#24c86a',x+.6,y+.75,.18,.18)}if(keep==='rday'){R('#5a6a7a',x+.55,y+.5,.2,.2);R('#5a6a7a',x+1.05,y+.5,.2,.2)}R(keep==='rsub'?'#f0e8b0':'#2a2a2a',x+.88,y+.35,.15,.45);
  if(keep==='rdiam')for(let k=0;k<4;k++)if(((frame+k*17)%50)<9)R('#ffffff',x+.2+(k%2)*1.3,y+(k>>1)*1.05,.3,.3)}
 if(((frame+30)%150)<7){R('#ffffff',x+.75,y-1.5,.45,3.8);R('#ffffff',x-.7,y+.55,3.4,.45)}}})();
