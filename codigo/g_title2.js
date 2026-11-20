// ===== Tela inicial nova (cena animada em pixel art, logo, menu de madeira) + jogo pensado para celular deitado =====
const isTouchDev=()=>('ontouchstart' in window)||navigator.maxTouchPoints>0;
// ---------- fonte grande do logo (5x7)
const LGF={I:['11111','00100','00100','00100','00100','00100','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],P:['11110','10001','10001','11110','10000','10000','10000'],
 E:['11111','10000','10000','11110','10000','10000','11111'],R:['11110','10001','10001','11110','10100','10010','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],
 D:['11110','10001','10001','10001','10001','10001','11110'],A:['01110','10001','10001','11111','10001','10001','10001'],G:['01110','10001','10000','10111','10001','10001','01111'],' ':['00000','00000','00000','00000','00000','00000','00000']};
function lgWord(g,word,x,y,s,c1,c2,ol,acc){const cw=6*s;// contorno, sombra, preenchimento com degradê e brilho
 const each=(fn)=>{for(let i=0;i<word.length;i++){const gl=LGF[word[i]]||LGF[' '];for(let r=0;r<7;r++)for(let k=0;k<5;k++)if(gl[r][k]==='1')fn(x+i*cw+k*s,y+r*s,r)}};
 each((px,py)=>{g.fillStyle=ol;g.fillRect(px-2,py-2,s+4,s+4)});
 each((px,py)=>{g.fillStyle='rgba(0,0,0,.45)';g.fillRect(px+s,py+s,s,s)});
 each((px,py,r)=>{g.fillStyle=r<3?c1:c2;g.fillRect(px,py,s,s);if(r===0){g.fillStyle='rgba(255,255,255,.55)';g.fillRect(px,py,s,Math.max(1,s/3))}});
 if(acc!=null){const ax=x+acc*cw+2*s,ay=y-3*s;g.fillStyle=ol;g.fillRect(ax-2,ay-2,s*2+4,s*2+4);g.fillStyle=c1;g.fillRect(ax+s,ay,s,s);g.fillRect(ax,ay+s,s,s)}
 return word.length*cw}
// ---------- cena
const TSC={cows:[],birds:[],t:0,rider:{x:-40},dog:{x:-80}};
function tScene(){if(TSC.cows.length)return;const br=['nelore','angus','girolando','hereford','nelore','senepol','simental','nelore'];
 for(let i=0;i<8;i++){const a={id:900+i,breed:br[i],sex:i===2||i===5?'M':'F',age:i===7?150:900,w:480,gen:60,hp:100,breeder:i===5};TSC.cows.push({a,x:20+i*38+Math.random()*10,y:0,dir:Math.random()<.5?1:-1,mv:0,t:Math.random()*4,f:0})}
 for(let i=0;i<5;i++)TSC.birds.push({x:Math.random()*300,y:20+Math.random()*30,s:.25+Math.random()*.2,p:Math.random()*6})}
const IPE=[[.08,'#f0c818'],[.27,'#e86aa8'],[.46,'#f0c818'],[.63,'#ffffff'],[.83,'#e86aa8'],[.95,'#f0c818']];
function tDrawScene(g,W,H){const F=tF,hz=Math.round(H*.56);
 // céu do amanhecer
 const sky=g.createLinearGradient(0,0,0,hz+10);sky.addColorStop(0,'#3a78c8');sky.addColorStop(.55,'#8ec0e8');sky.addColorStop(.85,'#f8d8a0');sky.addColorStop(1,'#f8b878');g.fillStyle=sky;g.fillRect(0,0,W,hz+12);
 const sx=W*.78,sy=hz-28;g.fillStyle='rgba(255,240,180,.25)';g.beginPath();g.arc(sx,sy,30,0,7);g.fill();g.fillStyle='rgba(255,230,150,.35)';g.beginPath();g.arc(sx,sy,20,0,7);g.fill();g.fillStyle='#fff4c8';g.beginPath();g.arc(sx,sy,12,0,7);g.fill();
 for(let i=0;i<10;i++){const a=i/10*6.283+F*.002;g.fillStyle='rgba(255,240,180,.08)';g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+Math.cos(a)*120,sy+Math.sin(a)*120);g.lineTo(sx+Math.cos(a+.12)*120,sy+Math.sin(a+.12)*120);g.fill()}
 // nuvens
 for(let i=0;i<6;i++){const w=26+((i*37)%30),cx=((i*83+F*(.06+i*.012))%(W+80))-50,cy=8+((i*29)%40);g.fillStyle='rgba(120,150,190,.35)';g.fillRect(cx+3,cy+6,w,5);g.fillStyle='#ffffff';g.fillRect(cx,cy+3,w,5);g.fillRect(cx+5,cy,w*.45,4);g.fillRect(cx+w*.45,cy-2,w*.35,6);g.fillStyle='#e8f0f8';g.fillRect(cx,cy+7,w,1)}
 // pássaros
 for(const b of TSC.birds){b.x+=b.s;if(b.x>W+10){b.x=-10;b.y=14+Math.random()*34}const fl=Math.sin(F*.25+b.p)>0;g.fillStyle='#2a2a3a';g.fillRect(b.x,b.y,1,1);g.fillRect(b.x-1,b.y-(fl?1:0),1,1);g.fillRect(b.x+1,b.y-(fl?1:0),1,1);g.fillRect(b.x-2,b.y-(fl?2:-1),1,1);g.fillRect(b.x+2,b.y-(fl?2:-1),1,1)}
 // serra ao fundo
 g.fillStyle='#7a88b8';g.beginPath();g.moveTo(0,hz);for(let x=0;x<=W;x+=4)g.lineTo(x,hz-14-Math.sin(x*.021)*9-Math.sin(x*.057+1)*5);g.lineTo(W,hz+4);g.lineTo(0,hz+4);g.fill();
 g.fillStyle='#8e9ac4';for(let x=0;x<W;x+=4){const y=hz-14-Math.sin(x*.021)*9-Math.sin(x*.057+1)*5;g.fillRect(x,y,4,1)}
 // morros verdes com ipês
 g.fillStyle='#5a9a48';g.beginPath();g.moveTo(0,hz+6);for(let x=0;x<=W;x+=4)g.lineTo(x,hz-2-Math.sin(x*.03+2)*5);g.lineTo(W,H);g.lineTo(0,H);g.fill();
 for(const [u,c] of IPE){const x=Math.round(W*u),y=hz-1-Math.sin(x*.03+2)*5;g.fillStyle='#4a3020';g.fillRect(x,y-6,1,7);g.fillStyle=shade(c,-25);g.fillRect(x-4,y-11,9,5);g.fillStyle=c;g.fillRect(x-3,y-12,7,4);g.fillRect(x-5,y-9,3,2);g.fillRect(x+3,y-10,3,2)}
 // sede da fazenda
 const fx=Math.round(W*.12),fy=hz+16;
 g.fillStyle='rgba(0,0,0,.18)';g.fillRect(fx-2,fy,62,3);
 g.fillStyle='#f4efe4';g.fillRect(fx,fy-14,26,14);g.fillStyle='#b8442a';for(let k=0;k<6;k++)g.fillRect(fx-2+k,fy-20+k,30-k*2,1);g.fillRect(fx-3,fy-15,32,2);g.fillStyle='#3a6ab0';g.fillRect(fx+11,fy-8,4,8);g.fillRect(fx+3,fy-11,4,4);g.fillRect(fx+19,fy-11,4,4);g.fillStyle='#6a5a52';g.fillRect(fx+20,fy-24,3,6);
 if(F%90<60){g.fillStyle='rgba(230,230,230,.6)';g.fillRect(fx+21+Math.sin(F/20)*2,fy-28-(F%90)/12,2,2)}
 g.fillStyle='#a63a2a';g.fillRect(fx+32,fy-16,20,16);g.fillStyle='#7a2a1a';g.fillRect(fx+30,fy-19,24,4);g.fillStyle='#f4efe4';g.fillRect(fx+38,fy-9,8,9);g.fillStyle='#a63a2a';g.fillRect(fx+41,fy-9,2,9);
 // cata-vento
 const wx=fx+62,wy=fy-26;g.fillStyle='#8a8a90';g.fillRect(wx,wy,1,26);g.fillRect(wx-3,fy-1,7,1);for(let k=0;k<26;k+=5){g.fillRect(wx-1-k/10,wy+k,3+k/5,1)}
 for(let k=0;k<8;k++){const a=k/8*6.283+F*.05;g.fillStyle=k%2?'#e8e8e8':'#c83a2a';g.fillRect(wx+Math.cos(a)*5,wy+Math.sin(a)*5,1.5,1.5);g.fillRect(wx+Math.cos(a)*3,wy+Math.sin(a)*3,1,1)}
 // pasto da frente
 const gy=Math.round(H*.7);g.fillStyle='#6aac4a';g.fillRect(0,hz+18,W,H);g.fillStyle='#78bc54';g.fillRect(0,gy,W,H-gy);
 for(let i=0;i<70;i++){const x=(i*47)%W,y=hz+20+((i*31)%(H-hz-20)),sw=Math.sin(F*.05+i)*.6;g.fillStyle=i%3?'#4a8a36':'#8ccc5a';g.fillRect(x+sw,y,1,2);g.fillRect(x+1+sw,y-1,1,2)}
 for(let i=0;i<14;i++){const x=(i*71+13)%W,y=gy+8+((i*23)%(H-gy-12));g.fillStyle=['#f0e060','#ffffff','#e86aa8','#f08a3a'][i%4];g.fillRect(x,y,1,1);g.fillRect(x+1,y+1,1,1)}
 // cerca
 const ky=hz+22;for(let x=0;x<W;x+=12){g.fillStyle='#5a3a22';g.fillRect(x,ky-6,2,8)}g.fillStyle='#7a5232';g.fillRect(0,ky-5,W,1);g.fillRect(0,ky-2,W,1);
 // gado pastando e andando
 const ps0=PS;PS=1;const rm=RMODE;
 const L=[];for(const c of TSC.cows){c.t-=1/60;if(c.t<=0){c.mv=!c.mv;c.t=c.mv?2+Math.random()*3:3+Math.random()*5;if(c.mv&&Math.random()<.4)c.dir=-c.dir}if(c.mv){c.x+=c.dir*.12;c.f+=.08}if(c.x<-30)c.x=W+20;if(c.x>W+30)c.x=-20;
  const y=gy+6+(c.a.id%4)*Math.max(4,(H-gy-20)/4);L.push([y,()=>{try{drawCow(g,c.a,c.x,y-10,c.dir,c.mv?(c.f|0)%2:0)}catch(e){}},c.x+8])}
 TSC.rider.x+=.35;if(TSC.rider.x>W+60)TSC.rider.x=-60;const ry=gy-2;L.push([ry,()=>{try{drawCmtPeon(g,{x:TSC.rider.x,y:ry,dir:3,b:'crioulo',mv:1,ph:F*.12})}catch(e){}},TSC.rider.x]);
 TSC.dog.x+=.55;if(TSC.dog.x>W+40)TSC.dog.x=-90;L.push([ry+4,()=>{try{drawDogSprite(g,TSC.dog.x,ry+4,1,DOGS.collie.v,'run',F*.35,{})}catch(e){}},TSC.dog.x]);
 L.sort((a,b)=>a[0]-b[0]).forEach(o=>{g.save();const k=.5+.25*clamp((o[0]-gy)/(H-gy),0,1);g.translate(o[2],o[0]);g.scale(k,k);g.translate(-o[2],-o[0]);o[1]();g.restore()});RMODE=rm;PS=ps0;
 // borboletas
 for(let i=0;i<5;i++){const x=(i*61+F*.3*(i%2?1:-1)+W*4)%W,y=gy+4+Math.sin(F/20+i*2)*10+i*6,fl=(F>>2)%2;g.fillStyle=['#f0e060','#ffffff','#f08a3a','#8ac0f0','#e86aa8'][i];g.fillRect(x-fl,y,1,1);g.fillRect(x+1+fl,y,1,1)}
 // brilho dourado
 const vg=g.createLinearGradient(0,0,0,H);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(.75,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(20,10,0,.35)');g.fillStyle=vg;g.fillRect(0,0,W,H)}
function tDrawLogo(g,W,H,small){const s=small?2:3,w1=7*6*s,x1=Math.round(W/2-w1/2),y1=small?10:Math.round(H*.12)+Math.round(Math.sin(tF/40)*1.5);
 // emblema: chifres
 if(!small){const cx=Math.round(W/2),cy=y1-5;g.fillStyle='#3a1a08';g.fillRect(cx-12,cy-2,24,5);g.fillRect(cx-16,cy-6,5,6);g.fillRect(cx+11,cy-6,5,6);g.fillStyle='#f0d070';g.fillRect(cx-11,cy-1,22,3);g.fillRect(cx-15,cy-5,3,5);g.fillRect(cx+12,cy-5,3,5);g.fillStyle='#fff8d0';g.fillRect(cx-15,cy-5,1,2);g.fillRect(cx+14,cy-5,1,2);g.fillStyle='#c8902a';g.fillRect(cx-4,cy+2,8,3)}
 lgWord(g,'IMPERIO',x1,y1,s,'#fff0a0','#f0b020','#4a1e04',3);
 const s2=small?2:Math.max(2,s-1),w2=7*6*s2,x2=Math.round(W/2-w2/2),y2=y1+7*s+(small?5:7);lgWord(g,'DO AGRO',x2,y2,s2,'#c8f088','#5ab83a','#123a0e');
 // faixa
 const by=y2+7*s2+(small?4:6),txt='FAZENDA BRASIL',tw=ptw(txt)*(small?1:2),bw=tw+18,bx=Math.round(W/2-bw/2),bh=small?8:13;
 g.fillStyle='#123a0e';g.fillRect(bx-5,by+2,6,bh);g.fillRect(bx+bw-1,by+2,6,bh);g.fillStyle='#2a8a3a';g.fillRect(bx-4,by+3,4,bh-2);g.fillRect(bx+bw,by+3,4,bh-2);
 g.fillStyle='#3a2a12';g.fillRect(bx-1,by-1,bw+2,bh+2);const bg=g.createLinearGradient(bx,0,bx+bw,0);bg.addColorStop(0,'#1e8a3a');bg.addColorStop(.5,'#f0c820');bg.addColorStop(1,'#1e4aa8');g.fillStyle=bg;g.fillRect(bx,by,bw,bh);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(bx,by,bw,1);
 if(small)ptext(g,txt,Math.round(W/2-tw/2),by+2,'#ffffff','#000');else{g.save();g.translate(Math.round(W/2-tw/2),by+3);g.scale(2,2);for(const [dx,dy] of [[-.5,0],[.5,0],[0,-.5],[0,.5],[.5,.5]])ptext(g,txt,dx,dy,'#1a2a10');ptext(g,txt,0,0,'#ffffff');g.restore()}
 // brilho passando
 const sh=(tF*1.4)%(W*2.5);if(sh<w1+40){g.fillStyle='rgba(255,255,255,.35)';for(let k=0;k<7*s;k++)g.fillRect(x1+sh-20-k*.6,y1+k,3,1)}}
let TLOGO=1;
tDraw=function(){if(!tRun)return;tF++;tScene();const ar=innerWidth/innerHeight,H=180,W=Math.max(180,Math.round(H*ar));if(TC.width!==W||TC.height!==H){TC.width=W;TC.height=H}
 tg.imageSmoothingEnabled=false;try{tDrawScene(tg,W,H);if(TLOGO)tDrawLogo(tg,W,H,TLOGO===2)}catch(e){console.error(e)}requestAnimationFrame(tDraw)};
// ---------- menu
{const st=document.createElement('style');st.textContent=`
#title{background:#3a78c8!important;align-items:stretch!important}
#tbox{width:100%!important;max-width:none!important;max-height:none!important;height:100%;padding:0!important;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;overflow:visible!important}
#tbox .tmenu{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:0 0 4vh;padding:0 8px}
#tbox .wood{position:relative;font-family:'VT323',monospace;font-size:clamp(20px,3.4vw,30px);color:#fff4d8;letter-spacing:1px;padding:10px 22px 12px;min-width:150px;border:3px solid #2a1406;border-radius:4px;cursor:pointer;
 background:linear-gradient(#b8783a 0 12%,#9a5a28 12% 50%,#8a4e22 50% 88%,#6a3a18 88%);box-shadow:0 4px 0 #2a1406,inset 0 2px 0 rgba(255,220,160,.35),inset 0 -2px 0 rgba(0,0,0,.25);text-shadow:2px 2px 0 #3a1a08;transition:transform .08s}
#tbox .wood:hover,#tbox .wood:active{transform:translateY(-2px) scale(1.04);filter:brightness(1.12)}
#tbox .wood.gold{background:linear-gradient(#f8d060 0 12%,#e0a431 12% 50%,#c8861e 50% 88%,#8a5a12 88%);color:#3a1a04;text-shadow:1px 1px 0 #ffe8a0}
#tbox .tpanel.full{max-height:94vh;margin:3vh 8px}
@media (orientation:landscape) and (max-height:540px){#tbox .opt{font-size:17px!important;padding:5px 10px!important;margin:3px 0!important}#tbox .tpanel h2{font-size:22px;margin:0 0 2px}#tbox .wslot b{font-size:18px}#tbox .row2 button{font-size:18px;padding:4px 10px}#tbox .wslot{padding:6px 8px}#tbox .dim{font-size:15px}#tbox input{font-size:18px;padding:3px 6px}#tbox .wood{padding:6px 16px 8px;min-width:120px}}
#tbox .wood small{display:block;font-size:.6em;opacity:.85;margin-top:-2px}
#tbox .tpanel{background:linear-gradient(#5a3a1e,#4a2e16);border:4px solid #2a1406;border-radius:6px;box-shadow:0 6px 0 rgba(0,0,0,.35),inset 0 0 0 2px #8a5a2a;padding:10px 12px;margin:0 8px 3vh;width:min(920px,96vw);max-height:70vh;overflow:auto;color:#f3e6c8}
#tbox .tpanel h2{font-family:'VT323',monospace;font-size:28px;margin:0 0 6px;color:#ffd75e;text-shadow:2px 2px 0 #2a1406}
#tbox .slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px}
#tbox .wslot{margin:0!important}
#tbox .twocol{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (orientation:portrait){#tbox .twocol{grid-template-columns:1fr}#tbox .tpanel{max-height:62vh}}
#tbox .ver{position:fixed;right:8px;top:6px;font-family:'VT323',monospace;font-size:16px;color:rgba(255,255,255,.75);text-shadow:1px 1px 0 #000}
#tbox .flag{position:fixed;left:8px;top:6px;font-family:'VT323',monospace;font-size:16px;color:rgba(255,255,255,.85);text-shadow:1px 1px 0 #000}
#tbox .sub{display:none}`;document.head.appendChild(st)}
const lastSlot=()=>{let b=0,t=0;for(let n=1;n<=3;n++){try{const o=JSON.parse(localStorage.getItem(SK(n))||'null');if(o&&o.v===2){const s=o.savedAt||1;if(s>t){t=s;b=n}}}catch(e){}}return b};
const _tRenderOld=tRender;
tRender=function(){const B=$('tbox');TLOGO=TMODE==='main'?1:(TMODE==='slots'||TMODE==='about')&&innerHeight>540?2:0;
 if(TMODE==='main'){const L=lastSlot(),si=L&&slotInfo(L);
  B.innerHTML='<div class="tmenu">'+(si?'<button class="wood gold" data-t="play" data-n="'+L+'">▶ Continuar<small>'+si.name+' · dia '+si.day+'</small></button>':'')
  +'<button class="wood'+(si?'':' gold')+'" data-t="newpick">🌱 Novo jogo</button><button class="wood" data-t="slots">📂 Mundos</button><button class="wood" data-t="about">🤠 Sobre</button></div><div class="flag">🇧🇷 Feito no Brasil</div><div class="ver">v1.0</div>';return}
 if(TMODE==='slots'){TMODE='main';try{_tRenderOld()}finally{TMODE='slots'}const h=B.innerHTML.replace(/^[\s\S]*?(<div class="wslot)/,'$1');const tail=h.lastIndexOf('<div class="dim" style="text-align:center');const slots=tail>0?h.slice(0,tail):h;
  B.innerHTML='<div class="tpanel'+(innerHeight<=540?' full':'')+'"><h2>📂 Seus mundos</h2><div class="slots">'+slots+'</div><div class="dim" style="margin-top:6px">O jogo salva sozinho a cada dia. Use 💾 Backup para não perder seus mundos.</div><div class="row2" style="margin-top:8px"><button class="g" data-t="back">⬅ Voltar</button></div></div>';return}
 if(TMODE==='about'){B.innerHTML='<div class="tpanel"><h2>🤠 Império do Agro: Fazenda Brasil</h2><div class="twocol"><div>Comece com um sitiozinho, um cão e umas poucas cabeças de gado. Plante, crie, cace, pesque, dispute leilões com os vizinhos e construa um império do agro que vale <b>R$ 1 bilhão</b>.</div><div class="dim">🐂 12 raças de gado com preço de verdade<br>🌎 Mundo aberto: vila, mata, pantanal, cidade<br>🤠 Rivais vivos, rodeio, comitiva e caça<br>🏰 Fazendas pelo Brasil, indústrias e avião</div></div><div class="row2" style="margin-top:8px"><button class="g" data-t="back">⬅ Voltar</button></div></div>';return}
 _tRenderOld();const h=B.innerHTML.replace(/^[\s\S]*?(<div class="wslot)/,'$1');B.innerHTML='<div class="tpanel full">'+(TMODE==='new'?'<h2>🌱 Novo mundo</h2>':'')+h.replace('<div class="wslot has">','<div>')+'</div>';
 if(TMODE==='new'){const p=B.querySelector('.tpanel>div');if(p&&!p.dataset.tc){p.dataset.tc=1;const kids=[...p.children];const iDiff=kids.findIndex(e=>e.textContent==='Dificuldade');const iDog=kids.findIndex(e=>e.textContent==='Cão inicial');const iBtn=kids.findIndex(e=>e.classList&&e.classList.contains('row2'));
   if(iDiff>0&&iDog>iDiff&&iBtn>iDog){const c1=document.createElement('div'),c2=document.createElement('div'),wrap=document.createElement('div');wrap.className='twocol';kids.slice(0,iDog).forEach(e=>c1.appendChild(e));kids.slice(iDog,iBtn).forEach(e=>c2.appendChild(e));wrap.appendChild(c1);wrap.appendChild(c2);p.insertBefore(wrap,kids[iBtn]);const rb=kids[iBtn];rb.style.marginTop='10px';c2.appendChild(rb)}}}};
$('tbox').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;const t=b.dataset.t;
 if(t==='newpick'){let n=0;for(let k=1;k<=3;k++){const s=slotInfo(k);if(!s||s.bad){n=k;break}}if(n){TSEL=n;TMODE='new';TNEW={name:'',diff:'normal',dog:'vira'}}else{TMODE='slots';setTimeout(()=>toast&&toast('Os 3 mundos estão ocupados: apague um para criar outro.','bad'),50)}tRender();goLand()}
 else if(t==='slots'||t==='about'){TMODE=t;tRender()}
 else if(t==='play'||t==='create')goLand()});
// ---------- celular deitado: tela cheia + travar na horizontal quando possível
function goLand(){if(!isTouchDev())return;try{const d=document.documentElement;if(!document.fullscreenElement&&d.requestFullscreen)d.requestFullscreen({navigationUI:'hide'}).then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{});else if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}
const ROT=document.createElement('div');ROT.id='rot';ROT.innerHTML='<div class="rbox"><div class="ricon">📱</div><span class="rt">Gire o celular</span><div>Império do Agro foi feito para jogar com o celular <b>deitado</b>.</div><button data-act="rotok">Jogar em pé mesmo assim</button></div>';document.body.appendChild(ROT);
{const st=document.createElement('style');st.textContent=`
#rot{position:fixed;inset:0;z-index:200;background:rgba(20,12,4,.94);display:none;align-items:center;justify-content:center;text-align:center;color:#f3e6c8;font-family:'VT323',monospace;font-size:22px}
#rot .rbox{padding:20px;max-width:320px}#rot .rt{display:block;font-size:34px;color:#ffd75e;margin:8px 0}#rot b{color:#ffd75e}
#rot .ricon{font-size:64px;display:inline-block;animation:rotp 1.6s ease-in-out infinite}@keyframes rotp{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}
#rot button{margin-top:16px;font-family:'VT323',monospace;font-size:20px;padding:8px 14px;border-radius:6px;border:2px solid #000;background:#5a4a3a;color:#f3e6c8}
@media (orientation:landscape) and (max-height:540px){
 .touch #hot{flex-direction:row!important;left:50%!important;transform:translateX(-50%)!important;top:auto!important;bottom:8px!important;gap:4px!important}
 .touch #hot>div{width:38px!important;height:38px!important}
 #tut{max-width:33%!important;font-size:13px!important;top:96px!important;line-height:1.1!important}
 #hint{font-size:20px!important}
 #mbox{max-height:90vh!important}
}`;document.head.appendChild(st)}
let ROTOK=0;try{ROTOK=+localStorage.getItem('ida_rotok')||0}catch(e){}
function rotCheck(){const p=isTouchDev()&&innerHeight>innerWidth*1.05&&!ROTOK;ROT.style.display=p?'flex':'none'}
ROT.addEventListener('click',e=>{if(e.target.closest('[data-act="rotok"]')){ROTOK=1;try{localStorage.setItem('ida_rotok','1')}catch(e){}rotCheck()}});
addEventListener('resize',rotCheck);addEventListener('orientationchange',()=>setTimeout(rotCheck,200));setTimeout(rotCheck,300);
// zoom: no celular deitado mostra mais mundo (tela baixinha)
const _rsLand=resize;resize=function(){_rsLand();const w=innerWidth,h=innerHeight,dpr=Math.min(window.devicePixelRatio||1,2);if(isTouchDev()&&w>h&&h<=540){const ps=Math.max(2,Math.floor(h*dpr/235));if(ps!==PS){PS=ps;SC=ps/dpr;VW=CV.width/PS;VH=CV.height/PS;X.imageSmoothingEnabled=false}}};
tRender();
