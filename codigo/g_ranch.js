// ===== Fazenda realista (simples): piquetes, curral, água e sombra, parto, ordenha, onça =====
Object.assign(UPS,{
 piq:{n:'Divisão em piquetes',ic:'🚧',d:'Divide o pasto em 2 e depois 3 piquetes. O capim do piquete vazio descansa e rebrota mais rápido.',c:[6000,15000],lv:[2,4]},
 curral:{n:'Curral de manejo',ic:'🐂',d:'Brete, tronco e balança: pese, vacine, trate, embarque o gado e ordenhe as vacas.',c:[9000],lv:[2]},
 ordenha:{n:'Ordenhadeira mecânica',ic:'🥛',d:'Ordenha todas as vacas sozinha todo dia e tanque resfriado de 1.500 L.',c:[18000],lv:[5]}
});
const MILK={girolando:16,nelore:3,brahman:4,hereford:5,angus:5,wagyu:3};
const CUR={x0:11,y0:64,x1:17,y1:69};
function ensureR(){
 ['piq','curral','ordenha'].forEach(k=>{if(S.up[k]===undefined)S.up[k]=0});
 if(!S.pq)S.pq={a:0,q:[S.pasture,S.pasture,S.pasture],mvT:0};
 if(S.milkT===undefined)S.milkT=0;
 S.herd.forEach(a=>{if(a.lact===undefined)a.lact=(a.sex==='F'&&a.age>=800&&Math.random()<.4)?S.day+ri(60,200):0});
}
const nPq=()=>1+Math.min(2,S.up.piq||0);
function pqCols(){const w=pasW(),n=nPq(),d=[];for(let k=1;k<n;k++)d.push(PAS.x+Math.round(w*k/n));return d}
function pqRange(i){const w=pasW(),d=pqCols(),n=nPq();return[i===0?PAS.x+1:d[i-1]+1,i===n-1?PAS.x+w-2:d[i]-1]}
function pqOf(px){const tx=Math.floor(px/TS),d=pqCols();let i=0;while(i<d.length&&tx>=d[i])i++;return i}
pasBounds=function(){ensureR();const r=pqRange(Math.min(S.pq.a,nPq()-1));return{x0:r[0]*TS+4,x1:(r[1]+1)*TS-22,y0:(PAS.y+1)*TS+4,y1:(PAS.y+PAS.h-1)*TS-14}};
const pqQ=i=>i===S.pq.a?S.pasture:(S.pq.q[i]===undefined?S.pasture:S.pq.q[i]);
function movePq(i){ensureR();if(i===S.pq.a)return;S.pq.q[S.pq.a]=S.pasture;S.pq.a=i;S.pasture=pqQ(i);S.pq.q[i]=S.pasture;S.pq.mvT=40;S.herd.forEach(a=>{const s=spriteOf(a);s.go=0;s.wait=rnd(0,2);s.lie=0});toast('🚧 Gado indo para o piquete '+(i+1)+' (capim '+Math.round(S.pasture)+'%)','good')}
// cercas: divisórias, abertura para o curral e o curral
const _rbf=rebuildFence;
rebuildFence=function(){_rbf();if(!S)return;ensureR();
 for(const d of pqCols())for(let y=PAS.y+1;y<PAS.y+PAS.h-1;y++)if(y!==56&&y!==57)FEN[ti(d,y)]=1;
 if(S.up.curral){const y1=PAS.y+PAS.h-1;FEN[ti(13,y1)]=0;FEN[ti(14,y1)]=0;
  for(let x=CUR.x0;x<=CUR.x1;x++){if(x!==13&&x!==14)FEN[ti(x,CUR.y0)]=1;FEN[ti(x,CUR.y1)]=1}
  for(let y=CUR.y0;y<=CUR.y1;y++){if(y!==67)FEN[ti(CUR.x0,y)]=1;if(y!==66&&y!==67)FEN[ti(CUR.x1,y)]=1}}
};
const _gwR=genWorld;
genWorld=function(){_gwR();
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=CUR.x0-1&&tx<=CUR.x1+2&&ty>=CUR.y0-1&&ty<=CUR.y1+1){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 for(let i=DECO.length-1;i>=0;i--){const d=DECO[i],tx=Math.floor(d.x/TS),ty=Math.floor(d.y/TS);if(tx>=CUR.x0-1&&tx<=CUR.x1+2&&ty>=CUR.y0-1&&ty<=CUR.y1+1){SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}
 for(let y=CUR.y0;y<=CUR.y1;y++)for(let x=CUR.x0;x<=CUR.x1+1;x++)if(G[ti(x,y)]===2)G[ti(x,y)]=0;
 rebuildFence();
};
const _upgR=ACT.upg;ACT.upg=function(e){const k=e.v,b=S.up[k];_upgR(e);if(S.up[k]!==b&&(k==='piq'||k==='curral'||k==='land')){ensureR();rebuildFence();if(k==='piq')toast('🚧 Use as porteiras das divisórias para trocar o gado de piquete.','good')}};
// sombra e água
function shadeSpots(){const L=[[20,61]];[[18,55,2],[26,60,3],[34,54,4],[42,60,5]].forEach(t=>{if(S.up.land>=t[2])L.push([t[0],t[1]])});return L.filter(p=>p[0]<PAS.x+pasW()-1).map(p=>({x:p[0]*TS,y:p[1]*TS}))}
function waterSpots(){const L=[{x:15*TS,y:59*TS+4}];const n=nPq();for(let i=1;i<n;i++){const r=pqRange(i);L.push({x:r[0]*TS+14,y:(PAS.y+1)*TS+12,pq:i})}return L}
// comportamento do gado
stepCows=function(dt){
 ensureR();if(S.pq.mvT>0)S.pq.mvT-=dt;
 const b=pasBounds(),h=dayHour(),hot=h>=11&&h<=15&&S.weather!=='chuva',night=h<5.5||h>20.5,dcols=pqCols();
 for(const a of S.herd){
  const s=spriteOf(a),cur=pqOf(s.x+8);
  if(a.lead||a.led||a.stall!=null)continue;
  if(a.labor){s.go=0;s.lie=1;continue}
  if(Math.hypot(s.x+8-P.x,s.y+5-P.y)<24){s.go=0;s.lie=0;continue}
  if(cur!==S.pq.a){
   // atravessa a porteira da divisória: chega na porteira e só para depois de passar para o outro lado (antes ficava indo e voltando)
   const nx=cur+(S.pq.a>cur?1:-1),gx=dcols[Math.max(cur,nx)-1]*TS,gy=56*TS+4;
   if(s.pass==null&&Math.abs(s.x-gx)<6&&Math.abs(s.y-gy)<6)s.pass=gx+(nx>cur?28:-28);
   const tx=s.pass!=null?s.pass:gx,ty=gy,dx=tx-s.x,dy=ty-s.y,d=Math.hypot(dx,dy)||1,sp=Math.min(d,18*dt);
   s.x+=dx/d*sp;s.y+=dy/d*sp;if(Math.abs(dx)>.5)s.dir=dx>0?1:-1;s.f=(frame>>4)&1;s.lie=0;s.go=0;
   if(s.pass!=null&&Math.abs(s.x-s.pass)<1.5){s.pass=null;s.wait=rnd(.3,1.5)}
   continue;
  }
  s.pass=null;
  s.x=clamp(s.x,b.x0-2,b.x1+2);s.y=clamp(s.y,b.y0,b.y1);
  if(s.wait>0){s.wait-=dt;s.f=0;if(!s.lie&&s.wait>4&&(night||(hot&&Math.random()<.5))&&Math.random()<dt*.6)s.lie=1;continue}
  if(s.lie&&!night&&!hot&&Math.random()<dt*.3)s.lie=0;
  if(s.lie){s.wait=rnd(3,8);continue}
  if(!s.go){
   let tg=null;
   const mom=a.age<200&&a.mom?S.herd.find(m=>m.id===a.mom):null;
   if(mom){const ms=spriteOf(mom);tg={x:ms.x+rnd(-8,8),y:ms.y+rnd(2,7)}}
   else if(hot&&Math.random()<.65){const sh=shadeSpots().filter(p=>pqOf(p.x)===S.pq.a);if(sh.length){const p=pick(sh);tg={x:p.x-8+rnd(-12,12),y:p.y-4+rnd(-4,6)}}}
   if(!tg&&Math.random()<.18){const w=waterSpots().filter(p=>pqOf(p.x)===S.pq.a);if(w.length){const p=pick(w);tg={x:p.x-6+rnd(-6,6),y:p.y+4}}}
   if(!tg)for(let k=0;k<8;k++){const tx=rnd(b.x0,b.x1),ty=rnd(b.y0,b.y1);if(G[ti(Math.floor((tx+8)/TS),Math.floor(ty/TS))]!==2){tg={x:tx,y:ty};break}}
   if(tg){s.tx=clamp(tg.x,b.x0,b.x1);s.ty=clamp(tg.y,b.y0,b.y1)}s.go=1;
  }
  const dx=s.tx-s.x,dy=s.ty-s.y,d=Math.hypot(dx,dy);
  if(d<2){s.go=0;s.wait=rnd(3,11);continue}
  const sp=(a.sick?8:a.age<200?17:13)*dt;s.x+=dx/d*sp;s.y+=dy/d*sp;if(Math.abs(dx)>.5)s.dir=dx>0?1:-1;s.f=(frame>>4)&1;
 }
};
// vaca deitada
const _dcR=drawCow;
drawCow=function(g,a,x,y,dir,f,mini){
 const s=SP.get(a.id);
 if(!mini&&s&&s.lie){
  const B=BREEDS[a.breed],calf=a.age<240,c=B.col,lt=shade(c,22),dk=shade(c,-30),Wd=calf?11:17,face=B.face||c,r=(col,dx,dy,w,h)=>Rr(g,col,dir>0?x+dx:x+Wd-dx-w,y+dy,w,h);
  Rr(g,'rgba(0,0,0,.24)',x-1,y+(calf?6.5:8.5),Wd+2,2);
  if(calf){r(dk,1,5,7,1.5);r(c,1,3,7,3);r(lt,2,3,5,1);r(face,7,1.5,3,3);r('#111',8.4,2.3,.8,.8)}
  else{r(dk,2,8,10,1.2);r(c,1,4,11,4.4);r(c,2,3.5,9,.6);r(lt,2,4,9,1);r(dk,2,7.6,9,.6);if(B.hump){r(c,8,2.4,3.4,2);r(lt,8.4,2.4,2.2,.8)}if(B.spot){r(B.spot,3,4,3,2.2);r(B.spot,7,5,2.4,2)}
   const jaw=((frame>>3)+a.id)%6<3?.3:0;r(c,11,2.6,2.4,4);r(face,12,2.4,4,3.6);r(shade(face,-20),12,5.2+jaw,4,.8);r(B.hump?shade(face,-35):'#e8a0a0',15,4,1.6,2);r('#111',13.8,3.4,.9,.9);r(dk,-.2,6,1.4,1.4)}
  if(a.labor){const p=(frame>>3)&1;Rr(g,'#1e140c',x+Wd/2-1.5,y-10-p,3,8);Rr(g,'#ff4a3a',x+Wd/2-1,y-9.5-p,2,5);Rr(g,'#ff4a3a',x+Wd/2-1,y-3.5-p,2,1.5)}
  else if(a.sick){const ix=x+(Wd>>1)-1;Rr(g,'#e33',ix,y-2,3,1);Rr(g,'#e33',ix+1,y-3,1,3)}
  return;
 }
 _dcR(g,a,x,y,dir,f,mini);
};
// desenho: bebedouros, árvore de sombra fixa, curral
function drawWaterTrough(g,x,y){Rr(g,'rgba(0,0,0,.2)',x-1,y+7,22,2);Rr(g,'#5e646c',x-1,y-1,22,9);Rr(g,'#9aa0a8',x,y,20,7);Rr(g,'#c0c6ce',x,y,20,1);Rr(g,'#3a7ab8',x+2,y+2,16,3);Rr(g,'#8ac8f0',x+3+((frame>>4)%10),y+2,3,1);Rr(g,'#4a4a52',x+19,y-5,2,6)}
function drawCurral(g){
 if(!S.up.curral){const x=CUR.x0*TS+20,y=CUR.y0*TS+40;Rr(g,'#5a3a22',x+20,y-2,2,12);Rr(g,'#e8dcc0',x+4,y-9,34,9);ptext(g,'CURRAL',x+9,y-7,'#5a2a12');return}
 const x0=CUR.x0*TS,y0=CUR.y0*TS,x1=(CUR.x1+1)*TS,y1=(CUR.y1+1)*TS;
 for(let ty=CUR.y0;ty<=CUR.y1;ty++)for(let tx=CUR.x0;tx<=CUR.x1;tx++){const h=hs(tx*3,ty*5);Rr(g,h<.5?'#8a6a44':'#7c5e3a',tx*TS,ty*TS,TS,TS);Rr(g,'#6a4e30',tx*TS+((h*12)|0),ty*TS+((hs(ty,tx)*12)|0),3,2)}
 const fs={r:'#8a6a42',p:'#5a3a22'};
 for(let tx=CUR.x0;tx<=CUR.x1;tx++){if(tx!==13&&tx!==14)drawFence(g,tx*TS,CUR.y0*TS,fs);drawFence(g,tx*TS,CUR.y1*TS,fs)}
 for(let ty=CUR.y0+1;ty<CUR.y1;ty++){if(ty!==67)drawFence(g,CUR.x0*TS,ty*TS,fs);if(ty!==66&&ty!==67)drawFence(g,CUR.x1*TS,ty*TS,fs)}
}
function drawCurralTop(g){
 if(!S.up.curral)return;const bx=15*TS,by=65*TS;
 // brete (corredor) com tronco e balança
 Rr(g,'rgba(0,0,0,.2)',bx,by+44,30,3);
 for(let i=0;i<4;i++){Rr(g,'#4a2e18',bx+i*9,by,2,44);}
 for(let r=0;r<3;r++)Rr(g,'#7a5232',bx,by+8+r*12,29,2);
 Rr(g,'#5e646c',bx+3,by+30,24,10);Rr(g,'#9aa0a8',bx+3,by+30,24,1.2);Rr(g,'#2a2a2a',bx+30,by+29,9,10);Rr(g,'#6ac04a',bx+31,by+30,7,3);ptext(g,'KG',bx+31.5,by+33.5,'#ddd');
 Rr(g,'#3a3a44',bx+2,by+14,26,3);Rr(g,'#6a6a74',bx+2,by+14,26,1);Rr(g,'#3a3a44',bx+13,by+10,3,14);
 // embarcadouro (rampa)
 const ex=(CUR.x1+1)*TS,ey=66*TS;Rr(g,'rgba(0,0,0,.2)',ex,ey+32,26,3);Rr(g,'#6a4428',ex,ey+2,26,30);for(let i=0;i<30;i+=4)Rr(g,'#4a2e18',ex,ey+2+i,26,1);Rr(g,'#4a2e18',ex+24,ey-6,3,38);Rr(g,'#4a2e18',ex,ey-6,3,10);Rr(g,'#7a5232',ex,ey-6,27,2);
 if(S.milkT>0||S.up.ordenha){const tx=12*TS+4,ty=66*TS;Rr(g,'rgba(0,0,0,.2)',tx-3,ty+18,26,3);Rr(g,'#b8c0c8',tx-2,ty,22,18);Rr(g,'#e0e6ec',tx,ty,3,18);Rr(g,'#8a929b',tx-3,ty-2,24,3);ptext(g,'LEITE',tx-1,ty+7,'#2a4a8a');const f=Math.min(1,S.milkT/(S.up.ordenha?1500:300));Rr(g,'#2a2a2a',tx+21,ty+2,2,14);Rr(g,'#f4f4f4',tx+21,ty+16-14*f,2,14*f)}
}
const _dfsR=drawFarmStatic;drawFarmStatic=function(g){_dfsR(g);drawCurral(g)};
const _evoR=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoR(L,x0,x1,y0,y1);ensureR();
 L.push([20*TS+2,10,{draw:g=>drawTree(g,{x:20*TS,y:61*TS,k:1,s:1.15})}]);
 waterSpots().slice(1).forEach(p=>L.push([p.y+8,10,{draw:g=>drawWaterTrough(g,p.x-10,p.y-2)}]));
 L.push([70*TS-6,10,{draw:drawCurralTop}]);
 if(ONCA)L.push([ONCA.y,10,{draw:g=>OL(g,ONCA.x,ONCA.y+4,40,26,c=>drawOnca(c))}]);
};
// tingimento do capim por piquete
function pqTint(g){const dry=!isWet(),pw=pasW();g.globalAlpha=.28;for(let tx=PAS.x+1;tx<PAS.x+pw-1;tx++){const q=pqQ(pqOf(tx*TS+8));g.fillStyle=mix(dry?'#9a9a46':'#7ac04a','#b0a050',1-q/100);for(let ty=PAS.y+1;ty<PAS.y+PAS.h-1;ty++)if(G[ti(tx,ty)]!==2)g.fillRect(tx*TS,ty*TS,TS,TS)}g.globalAlpha=1}
// rebrota dos piquetes vazios + leite diário + parto pendente
const _hdR=hookDay;
hookDay=function(){_hdR();ensureR();const n=nPq();
 for(let i=0;i<n;i++){if(i===S.pq.a)continue;const q=pqQ(i),gr=(isWet()?1.2:.5)*(S.weather==='chuva'?1.5:1)*(S.drought>0?.2:1)*4*(1-q/100)*1.9;S.pq.q[i]=clamp(q+gr,0,100)}
 S.pq.q[S.pq.a]=S.pasture;
 if(S.up.peao&&n>1&&S.pasture<35){let best=-1,bq=S.pasture+25;for(let i=0;i<n;i++)if(i!==S.pq.a&&pqQ(i)>bq){bq=pqQ(i);best=i}if(best>=0){movePq(best);toast('🧑‍🌾 O peão trocou o gado de piquete (capim fraco)')}}
 const cap=S.up.ordenha?1500:300;let auto=0;
 S.herd.forEach(a=>{if(a.lact>S.day&&a.milked!==S.day-1&&(S.up.ordenha||S.up.peao)){auto+=MILK[a.breed]*(a.hp/100)*(S.up.ordenha?.95:.55)}});
 if(auto>0){S.milkT=Math.min(cap,S.milkT+auto)}
 if(S.day%2===0&&S.milkT>=1){const L=Math.round(S.milkT),v=Math.round(L*2.75*(feiraHoje()?1.12:1));cash(v,'Laticínio: '+L+' L de leite');S.milkT=0;toast('🚚 Caminhão do laticínio coletou '+L+' L de leite: '+R$(v),'good')}
};
// ---- parto
function birthOK(a,assist){
 const sg=a.sire?a.sire.g:a.gen,sb=a.sire?a.sire.br:a.breed;let g=(a.gen+sg)/2+gauss()*6+(S.up.ia?1:0)+(assist?2:0),br=a.breed;
 if(sb!==a.breed){g+=4;br=Math.random()<.5?sb:a.breed}
 a.preg=0;a.sire=null;a.rest=70-12*(S.up.mat||0);a.labor=0;a.lact=S.day+240;
 const c=mk(br,Math.random()<.5?'F':'M',0,g);c.w=ri(28,38);c.hp=assist?100:85;c.mom=a.id;addA(c);S.stats.born++;gainXP(assist?25:8,'nascimento');
 const s=spriteOf(c),ms=spriteOf(a);s.x=ms.x+4;s.y=ms.y+4;
 toast('🐮 '+a.name+' pariu '+c.name+' ('+BREEDS[br].n+', '+(c.sex==='F'?'fêmea':'macho')+')'+(assist?' — graças a você!':''),'good');return c;
}
function birthLost(a){a.preg=0;a.sire=null;a.rest=90;a.labor=0;a.hp=Math.max(10,a.hp-20);toast('💔 '+a.name+' teve um parto difícil e perdeu o bezerro.','bad')}
birth=function(a){
 ensureR();
 if(a.labor){if(S.day>a.labor){if(S.up.peao&&Math.random()<.7)birthOK(a,false);else if(Math.random()<.45)birthOK(a,false);else birthLost(a)}return}
 if(Math.random()<.28-.06*(S.up.mat||0)){a.labor=S.day;toast('🚨 '+a.name+' está num parto difícil no pasto! Vá ajudar ou chame a veterinária.','bad')}
 else birthOK(a,false);
};
const PT={a:null,st:0,m:0,dir:1,zc:.5,hits:0,miss:0,iv:null};
function partoModal(a){
 PT.a=a;reModal=null;showModal('<h3>🐄 Parto difícil: '+a.name+'</h3><div class="card">O bezerro está com dificuldade para nascer. Você pode ajudar puxando no ritmo das contrações, ou chamar a Dra. Marina.</div><div id="ptbox" class="card" style="text-align:center"><div style="font-size:38px">🐄💦</div></div><div class="btns"><button class="b gold" data-act="ptgo">🤲 Ajudar</button><button class="b" data-act="ptvet">⚕️ Chamar veterinária R$ 400</button><button class="b gray" data-act="close">Agora não</button></div>');
}
function ptRender(){const b=$('ptbox');if(!b)return;b.innerHTML='<div>Puxe quando o marcador estiver na <b class="grn">contração</b> (verde) — '+PT.hits+'/3 · erros '+PT.miss+'/2</div><div style="position:relative;height:26px;background:#2a2a2a;border-radius:4px;margin:8px 0;overflow:hidden"><div style="position:absolute;top:0;bottom:0;background:#4a9a3a;left:'+((PT.zc-.11)*100)+'%;width:22%"></div><div style="position:absolute;top:0;bottom:0;width:4px;background:#fff;left:'+(PT.m*100)+'%"></div></div><div class="btns" style="justify-content:center"><button class="b gold" data-act="ptpull" style="font-size:20px;padding:12px 28px">PUXAR!</button></div>'}
function ptEnd(ok){clearInterval(PT.iv);PT.iv=null;PT.st=0;const a=PT.a;if(!a||!S.herd.includes(a))return;const b=$('ptbox');
 if(ok){birthOK(a,true);if(b)b.innerHTML='<div style="font-size:40px">🐄🐮</div><div class="grn">Nasceu! Bezerro forte e saudável.</div>'}
 else{if(Math.random()<.5){birthOK(a,false);if(b)b.innerHTML='<div style="font-size:40px">🐮</div><div>Foi difícil, mas o bezerro nasceu.</div>'}else{birthLost(a);if(b)b.innerHTML='<div style="font-size:40px">💔</div><div>Não deu dessa vez...</div>'}}
 const btns=$('mbox').querySelector('.btns:last-child');if(btns)btns.innerHTML='<button class="b gold" data-act="close">Fechar</button>'}
Object.assign(ACT,{
 ptgo(){if(PT.st)return;Object.assign(PT,{st:1,m:0,dir:1,zc:rnd(.25,.75),hits:0,miss:0});ptRender();PT.iv=setInterval(()=>{if(!$('ptbox')){clearInterval(PT.iv);PT.iv=null;PT.st=0;return}PT.m+=PT.dir*.05*(1.1+PT.hits*.25);if(PT.m>=1){PT.m=1;PT.dir=-1}if(PT.m<=0){PT.m=0;PT.dir=1}const mk2=$('ptbox').querySelector('div[style*="width:4px"]');if(mk2)mk2.style.left=(PT.m*100)+'%'},50)},
 ptpull(){if(!PT.st)return;if(Math.abs(PT.m-PT.zc)<=.11){PT.hits++;if(PT.hits>=3)return ptEnd(true);PT.zc=rnd(.2,.8)}else{PT.miss++;if(PT.miss>=2)return ptEnd(false)}ptRender()},
 ptvet(){const a=PT.a;if(!a)return;if(S.money<400)return toast('Dinheiro insuficiente','bad');cash(-400,'Veterinária: parto');birthOK(a,true);hideModal()}
});
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(PT.st&&(k===' '||k==='e')){e.preventDefault();ACT.ptpull()}if(MK.on){if(k==='a'||k==='arrowleft')ACT.mkl();if(k==='d'||k==='arrowright')ACT.mkr()}});
// ---- curral e ordenha
const MK={on:0,a:null,L:0,max:0,last:0,t:0,iv:null};
const lactating=()=>S.herd.filter(a=>a.lact>S.day&&a.sex==='F');
function curralModal(){
 ensureR();reModal=curralModal;const rd=S.herd.filter(ready),sick=S.herd.filter(a=>a.sick),lac=lactating(),cap=S.up.ordenha?1500:300;
 let h='<h3>🐂 Curral de manejo</h3><div class="card"><div class="row"><b>'+S.herd.length+' cabeças</b><span class="gold">'+rd.length+' prontas para abate</span></div><div class="dim">'+(sick.length?'🤒 '+sick.length+' doente(s) · ':'')+'🥛 tanque '+Math.round(S.milkT)+'/'+cap+' L (o caminhão coleta a cada 2 dias)</div></div>';
 h+='<div class="btns"><button class="b gold" data-act="cpesar">⚖️ Pesar o rebanho</button><button class="b" data-act="cvac">💉 Vacinar todos</button><button class="b" data-act="ctrat">🩺 Tratar doentes</button>'+(rd.length?'<button class="b gold" data-act="cemb">🚚 Embarcar '+rd.length+' prontos</button>':'')+'</div>';
 if(S.pesoD===S.day)h+='<div class="sec">PESAGEM DE HOJE</div>'+S.herd.slice().sort((a,b)=>b.w-a.w).slice(0,40).map(a=>{const wm=wmax(a);return '<div class="card" style="padding:4px 8px"><div class="row"><b>'+a.name+' <span class="dim">'+BREEDS[a.breed].n+' '+(a.sex==='F'?'♀':'♂')+'</span></b><span>'+Math.round(a.w)+' kg · '+(a.w/15).toFixed(1)+' @</span></div><div class="dim">'+(ready(a)?'<span class="grn">✅ pronto para abate</span>':a.age<420?'em crescimento':'falta ~'+Math.max(0,Math.round(.9*wm-a.w))+' kg')+(a.preg?' · prenhe':'')+'</div></div>'}).join('');
 h+='<div class="sec">🥛 ORDENHA</div>'+(lac.length?lac.map(a=>'<div class="card" style="padding:5px 8px"><div class="row"><b>'+a.name+' <span class="dim">'+BREEDS[a.breed].n+'</span></b><span class="dim">~'+Math.round(MILK[a.breed]*a.hp/100)+' L/dia</span></div><div class="btns">'+(a.milked===S.day?'<span class="dim">Já ordenhada hoje</span>':'<button class="b gold" data-act="mkgo" data-v="'+a.id+'">Ordenhar</button>')+'</div></div>').join(''):'<div class="dim">Nenhuma vaca dando leite. Vacas dão leite por ~8 meses depois de parir. Girolando é a raça leiteira.</div>')
  +(S.up.ordenha?'<div class="dim">A ordenhadeira mecânica ordenha todas sozinha de madrugada.</div>':'');
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
}
function mkRender(){const b=$('mkbox');if(!b)return;const f=Math.min(1,MK.L/MK.max);
 b.innerHTML='<div class="row"><b>'+MK.a.name+'</b><span>'+MK.L.toFixed(1)+' / '+MK.max.toFixed(1)+' L · '+Math.max(0,8-MK.t).toFixed(1)+'s</span></div><div style="display:flex;justify-content:center;margin:6px 0"><div style="width:46px;height:56px;border:3px solid #aab;border-top:none;border-radius:0 0 8px 8px;position:relative;background:#2a2a2a;overflow:hidden"><div style="position:absolute;left:0;right:0;bottom:0;height:'+(f*100)+'%;background:#f4f4f0"></div></div></div><div class="dim" style="text-align:center">Alterne ⬅️ ➡️ no ritmo (teclas A/D). Repetir o mesmo lado incomoda a vaca!</div><div class="btns" style="justify-content:center"><button class="b" data-act="mkl" style="font-size:24px;padding:10px 26px">⬅️</button><button class="b" data-act="mkr" style="font-size:24px;padding:10px 26px">➡️</button></div>'}
function mkEnd(){clearInterval(MK.iv);MK.iv=null;MK.on=0;const a=MK.a,L=Math.max(0,Math.min(MK.L,MK.max)),cap=S.up.ordenha?1500:300;a.milked=S.day;const add=Math.min(L,cap-S.milkT);S.milkT+=add;gainXP(3+L/3,'ordenha');toast('🥛 '+L.toFixed(1)+' L de leite de '+a.name+(add<L?' (tanque cheio!)':''),'good');reModal=curralModal;curralModal()}
Object.assign(ACT,{
 cpesar(){S.pesoD=S.day;if(S.pesoXP!==S.day){S.pesoXP=S.day;gainXP(5,'manejo')}S.herd.forEach(a=>a.pesado=S.day)},
 cvac(){let n=0;S.herd.forEach(a=>{if(vaccinate(a))n++});toast(n?'💉 '+n+' animais vacinados':'Todos já estão vacinados (ou sem dinheiro)',n?'good':'')},
 ctrat(){let n=0;S.herd.filter(a=>a.sick).forEach(a=>{if(S.money>=treatCost()){treat(a,true);n++}});toast(n?'🩺 '+n+' animais tratados':'Nenhum doente para tratar',n?'good':'')},
 cemb(){const rd=S.herd.filter(ready);let t=0;rd.forEach(a=>{const bonus=a.pesado>=S.day-7?1.03:1;const p=sellFrig(a);if(bonus>1){const b=Math.round(p*.03);cash(b,'Bônus de pesagem');t+=b}t+=p});toast('🚚 '+rd.length+' animais embarcados: '+R$(t),'good')},
 mkgo(e){const a=S.herd.find(x=>x.id==e.v);if(!a||a.milked===S.day||MK.on)return;reModal=null;Object.assign(MK,{on:1,a,L:0,max:MILK[a.breed]*a.hp/100,last:0,t:0});
  showModal('<h3>🥛 Ordenha</h3><div id="mkbox" class="card"></div>');mkRender();MK.iv=setInterval(()=>{if(!$('mkbox')){clearInterval(MK.iv);MK.on=0;return}MK.t+=.1;if(MK.t>=8||MK.L>=MK.max)return mkEnd();mkRender()},100)},
 mkl(){mkTap(1)},mkr(){mkTap(2)}
});
function mkTap(sd){if(!MK.on)return;if(sd!==MK.last)MK.L+=MK.max/15*rnd(.85,1.15);else{MK.L=Math.max(0,MK.L-MK.max/25);tt('mkk','🐄 Muuu! Ela não gostou...','',2)}MK.last=sd;mkRender()}
// ---- onça
let ONCA=null;
function drawOnca(g){
 const o=ONCA,x=o.x,y=o.y,d=o.dir,mv=o.st!=='attack',ph=frame*(o.st==='flee'?.5:.2),r=(c,dx,dy,w,h)=>Rr(g,c,d>0?x+dx:x-dx-w,y+dy,w,h),c='#d89a3a',lt='#f0d8a0',dk='#2a1a0a';
 Rr(g,'rgba(0,0,0,.28)',x-11,y-1,22,2.5);
 [-7,-4,4,7].forEach((dx,i)=>{const s=mv?Math.sin(ph+i*1.6)*1.4:0;r(i%2?shade(c,-25):c,dx+s,-4,1.8,4);r(dk,dx+s,-.8,1.8,.8)});
 r(c,-9,-9,16,5.5);r(lt,-8,-5,14,1.5);r(shade(c,15),-8,-9,13,1);
 [[-7,-8],[-4,-7],[-1,-8.5],[2,-7],[5,-8],[-6,-6],[0,-6],[4,-6]].forEach(([a,b])=>{r(dk,a,b,1.6,1.2);r(dk,a+.4,b+1.2,.8,.4)});
 r(c,-14+Math.sin(frame/10)*1,-9,5,1.4);r(dk,-15+Math.sin(frame/10)*1,-9.2,1.4,1.4);
 const hy=o.st==='stalk'?2:0;r(c,6,-12+hy,5.5,5);r(lt,8.4,-8.6+hy,3,1.6);r(dk,6.6,-13+hy,1.4,1.4);r(dk,9.4,-13+hy,1.4,1.4);r('#2a2a12',8.6,-11+hy,1,1);r('#1a0a0a',11,-9.6+hy,.8,.8);
 if(daylight()<.35){r('#e8f060',8.6,-11+hy,1,1)}
}
function oncaChance(){const dogs=S.dogs.filter(d=>!d.dead&&!(d.id===S.dogAct||d.esc)&&hpF(d)>.3).length;return clamp(.12+(S.herd.some(a=>a.age<240)?.06:0)-dogs*.035-(S.up.light||0)*.03-(S.up.cerca||0)*.02,.03,.2)}
function spawnOnca(){
 const free=S.herd.filter(a=>a.stall==null&&!a.lead),calves=free.filter(a=>a.age<240),tgt=calves.length?pick(calves):free.slice().sort((a,b)=>a.hp-b.hp)[0];if(!tgt)return;
 const side=Math.random()<.5;ONCA={x:side?PAS.x*TS-70:(PAS.x+rnd(2,pasW()-2))*TS,y:side?(PAS.y+rnd(2,PAS.h-2))*TS:(PAS.y+PAS.h)*TS+90,tgt,st:'stalk',t:0,dir:1,life:0};
 toast('🐕 Os cachorros estão inquietos... algo ronda o pasto!','bad');
}
function oncaScare(by){if(!ONCA||ONCA.st==='flee')return;ONCA.st='flee';ONCA.t=0;toast('🐆 '+by+' espantou uma onça-pintada do pasto!','good');gainXP(15,'proteção')}
function stepOnca(dt){
 const h=dayHour(),key=h>=21?S.day:h<4?S.day-1:null;
 if(key!==null&&!ONCA&&S.oncaD!==key&&LV()>=3&&S.herd.length){S.oncaD=key;if(Math.random()<oncaChance())spawnOnca()}
 if(!ONCA)return;const o=ONCA;o.life+=dt;
 if(!S.herd.includes(o.tgt)&&o.st!=='flee'){o.st='flee'}
 const s=o.tgt&&S.herd.includes(o.tgt)?spriteOf(o.tgt):null;
 if(o.st!=='flee'){
  const pd=Math.hypot(P.x-o.x,P.y-o.y);if(pd<(daylight()<.3?85:110))return oncaScare('Você');
  for(const d of S.dogs){if(d.dead||hpF(d)<.3)continue;const r=dogRT(d);if(Math.hypot(r.x-o.x,r.y-o.y)<42){barkSnd(DOGS[d.breed].sz>1);return oncaScare(d.name)}}
  if(h>4.5&&h<20)return oncaScare('A luz do dia');
 }
 if(o.st==='stalk'&&s){const tx=s.x+8,ty=s.y+6,dx=tx-o.x,dy=ty-o.y,dd=Math.hypot(dx,dy);o.dir=dx>0?1:-1;if(dd<10){o.st='attack';o.t=0;s.wait=6;s.go=0}else{o.x+=dx/dd*26*dt;o.y+=dy/dd*26*dt}}
 else if(o.st==='attack'){o.t+=dt;if(o.t>4.5&&s){const a=o.tgt;die(a,'onça');toast('🐆 Uma onça-pintada matou '+a.name+' no pasto!','bad');o.st='flee';o.t=0}}
 else if(o.st==='flee'){o.t+=dt;const cx=(PAS.x+pasW()/2)*TS,cy=(PAS.y+PAS.h/2)*TS,dx=o.x-cx,dy=o.y-cy,dd=Math.hypot(dx,dy)||1;o.dir=dx>0?1:-1;o.x+=dx/dd*95*dt;o.y+=dy/dd*95*dt;if(o.t>7)ONCA=null}
}
const _updR=update;update=function(dt){_updR(dt);stepOnca(dt);
 if(ONCA&&ONCA.st!=='flee')for(const d of S.dogs){if(d.dead||d.id===S.dogAct||d.esc||hpF(d)<.3)continue;const r=dogRT(d);const dx=ONCA.x-r.x,dy=ONCA.y-r.y,dd=Math.hypot(dx,dy);if(dd<320&&dd>2){const sp=dogSpd(d)*1.35*dt;r.x+=dx/dd*sp;r.y+=dy/dd*sp;r.dir=dx>0?1:-1;r.moving=1;r.run=1;r.bark=.4;r.ph+=sp*.3}}
};
const _fireR=fire;fire=function(){const eq=S.h.eq,m=eq?S.h.mag[eq]:0;_fireR();if(!ONCA||!eq||S.h.mag[eq]>=m)return;const tx=AIM.rx+AIM.sx,ty=AIM.ry+AIM.sy;
 if(Math.hypot(tx-ONCA.x,ty-(ONCA.y-6))<12){ONCA=null;cash(-20000,'Multa ambiental (IBAMA)');S.rep=Math.max(0,S.rep-10);showModal('<h3>⚖️ Multa ambiental</h3><div class="card">A onça-pintada é uma espécie protegida por lei. Abater uma onça rendeu multa de '+R$(20000)+' e perda de reputação.<br><span class="dim">Para proteger o gado, espante: chegue perto, dê um tiro para o alto, deixe cães de guarda soltos e invista em holofotes.</span></div><div class="btns"><button class="b gray" data-act="close">Entendi</button></div>')}
 else if(Math.hypot(P.x-ONCA.x,P.y-ONCA.y)<320)oncaScare('O tiro para o alto')};
const _slR=ACT.sleep;ACT.sleep=function(e){const h=dayHour();if(LV()>=3&&S.herd.length&&S.oncaD!==S.day&&(h>=18||h<4)){S.oncaD=S.day;if(Math.random()<oncaChance()){const g=S.dogs.filter(d=>!d.dead&&!(d.id===S.dogAct||d.esc)&&hpF(d)>.3);const prot=g.reduce((s,d)=>s+DOGS[d.breed].guard,0);
 if(prot>=60||Math.random()<prot/80)toast('🐕 De madrugada, os cães espantaram uma onça do pasto!','good');else{const fr=S.herd.filter(a=>a.stall==null&&!a.lead),c=fr.filter(a=>a.age<240);const v=c.length?pick(c):(Math.random()<.4&&fr.length?pick(fr):null);if(v){die(v,'onça');toast('🐆 De madrugada, uma onça matou '+v.name+'. Cães de guarda e holofotes ajudam a proteger.','bad')}}}}
 return _slR(e)};
// indicador da onça fora da tela
const _dprR=drawPart;drawPart=function(g){_dprR(g);if(!ONCA||ONCA.st==='flee')return;if(ONCA.x>CX&&ONCA.x<CX+VW&&ONCA.y>CY&&ONCA.y<CY+VH)return;const ax=clamp(ONCA.x,CX+10,CX+VW-10),ay=clamp(ONCA.y,CY+34,CY+VH-12),p=(frame>>3)&1;Rr(g,'rgba(120,10,10,.8)',ax-7,ay-7,14,14);Rr(g,p?'#ffd75e':'#ff6a3a',ax-2,ay-4,4,6);Rr(g,p?'#ffd75e':'#ff6a3a',ax-2,ay+3,4,2)};
// ---- interações
const _ilR=interactList;
interactList=function(){const L=_ilR();ensureR();
 pqCols().forEach((d,k)=>{const left=k,right=k+1,to=S.pq.a===left?right:S.pq.a===right?left:right;L.push({x:d*TS+8,y:57*TS,r:22,label:'🚪 Levar o gado para o piquete '+(to+1)+' (capim '+Math.round(pqQ(to))+'%)',fn:()=>movePq(to)})});
 L.push({x:14*TS+8,y:CUR.y0*TS+40,r:40,label:S.up.curral?'🐂 Curral de manejo':'🐂 Curral (construa em Melhorias)',fn:()=>S.up.curral?curralModal():toast('Construa o curral de manejo no menu Melhorias (nível 2).')});
 S.herd.forEach(a=>{if(!a.labor)return;const s=spriteOf(a);L.push({x:s.x+8,y:s.y+6,r:26,label:'🚨 Ajudar no parto de '+a.name,fn:()=>partoModal(a)})});
 return L};
// guia
GUIDE.splice(4,0,
 {lv:2,ic:'🚧',t:'Piquetes, água e sombra',h:'Compre a divisão em piquetes (Melhorias). Use a porteira da divisória para mudar o gado: o capim do piquete vazio descansa e rebrota. Cada piquete tem bebedouro. Nas horas quentes o gado procura sombra; à noite ele deita. Com peão, ele troca os piquetes sozinho.'},
 {lv:2,ic:'🐂',t:'Curral, parto e ordenha',h:'No curral (Melhorias) você pesa o rebanho, vacina, trata e embarca os animais prontos (bônus de 3% se pesados na semana). Vacas dão leite por ~8 meses depois de parir: ordenhe no curral (alterne ⬅️➡️) — a Girolando é a leiteira. O caminhão do laticínio busca o leite a cada 2 dias. Às vezes um parto é difícil: um ❗ vermelho aparece sobre a vaca — vá ajudar ou chame a veterinária.'},
 {lv:3,ic:'🐆',t:'Onça no pasto',h:'À noite uma onça-pintada pode rondar o pasto atrás de bezerros. Ela é protegida por lei: não atire nela! Espante chegando perto, com um tiro para o alto ou com cães de guarda soltos na fazenda. Holofotes e cercas reforçadas diminuem as visitas.'}
);
setTimeout(()=>{try{const s=document.createElement('style');document.head.appendChild(s)}catch(e){}},0);
