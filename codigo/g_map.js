// ===== MAPA AMPLIADO: região de 240×166 tiles (antes 160×100). A fazenda cresce para o sul (Lote Sul, Várzea do Açude e Retiro),
// novas estradas, serra e pantanal maiores, as 9 fazendas rivais construídas no mapa e um mapa da região (tecla N ou aba Região).
// ---- pré-render uma vez só por genWorld (antes rodava 4 vezes)
let PRDEF=0,PRDIRTY=0;
const _prMap=prerender;prerender=function(){if(PRDEF){PRDIRTY=1;return}_prMap()};
// ---- novos terrenos da fazenda
(function(){const L=id=>LOTS.find(l=>l.id===id);
 const s=L('sul');if(s)Object.assign(s,{n:'Lote Sul',d:'50 ha de pasto ao sul da sede (R$ 13 mil/ha): +40 cabeças de lotação e espaço para obras.'});
 const v=L('varzea');if(v)Object.assign(v,{p:780000,ha:60,d:'60 ha de várzea com o açude (R$ 13 mil/ha): +50 cabeças de lotação, água o ano todo e espaço para obras.'});
 const r=L('retiro');if(r)Object.assign(r,{p:1150000,ha:90,d:'90 ha no fundo da fazenda (R$ 12,8 mil/ha): +75 cabeças de lotação e muito espaço para obras.'});
})();
const _lotCapMap=lotCap;lotCap=function(){return _lotCapMap()+(S&&S.lots?(S.lots.varzea?50:0)+(S.lots.retiro?75:0):0)};
// ---- mais bichos nas regiões maiores
for(const k in SPECIES){const b=SPECIES[k].bio;if(b==='m'||b==='p'||b==='c')SPECIES[k].cnt=Math.max(1,Math.round(SPECIES[k].cnt*1.5))}
// ---- fazendas rivais (i = índice em RIV/RVP). gate = lado do portão; road = trecho de estrada até a rodovia
const RF=[
 {i:0,x0:4,y0:138,x1:26,y1:158,gate:'n',gx:15,road:[[15,135,15,137]],hv:0,bv:0,kind:'leite',n:7},
 {i:1,x0:32,y0:138,x1:54,y1:156,gate:'n',gx:43,road:[[43,135,43,137]],hv:0,bv:1,n:8},
 {i:2,x0:64,y0:107,x1:96,y1:128,gate:'w',gy:117,road:[[61,117,63,117]],hv:1,bv:1,n:10},
 {i:3,x0:200,y0:16,x1:232,y1:34,gate:'w',gy:25,road:[[198,25,199,25]],hv:2,bv:1,n:10},
 {i:4,x0:166,y0:54,x1:196,y1:76,gate:'w',gy:65,road:[[162,65,165,65]],hv:3,bv:3,n:11,kind:'expo'},
 {i:5,x0:204,y0:54,x1:234,y1:80,gate:'n',gx:219,road:[[219,49,219,53]],hv:4,bv:3,n:6,kind:'haras'},
 {i:6,x0:168,y0:92,x1:198,y1:124,gate:'n',gx:183,road:[[183,87,183,91]],hv:4,bv:3,n:9,kind:'lavoura'},
 {i:7,x0:104,y0:138,x1:156,y1:162,gate:'n',gx:130,road:[[130,135,130,137]],hv:12,bv:3,n:16},
 {i:8,x0:206,y0:92,x1:236,y1:128,gate:'n',gx:221,road:[[221,87,221,91]],hv:13,bv:3,n:14}
];
const RFC=[];// gado e cavalos das rivais
function rfLayout(f){
 const hw=f.hv>=12?8:6;f.house={id:'house',x:f.x0+3,y:f.y0+3,w:hw,h:4,door:f.x0+3+(hw>>1)-1};
 f.barn={id:'barn',x:f.x0+3+hw+5,y:f.y0+2,w:8,h:5,door:f.x0+3+hw+5+3};
 const top=f.y0+11;f.pas={x0:f.x0+2,y0:top,x1:f.x1-2,y1:f.y1-2};
 if(f.kind==='lavoura'){f.crop={x0:f.x0+3,y0:top+1,x1:f.x0+Math.floor((f.x1-f.x0)/2),y1:f.y1-3};f.pas.x0=f.crop.x1+3}
 f.yard={x0:f.x0+2,y0:f.y0+7,x1:f.x1-2,y1:f.y0+9};
 if(f.gate==='n'){f.gt={x:f.gx,y:f.y0}}else{f.gt={x:f.x0,y:f.gy}}
 f.own={x:(f.house.door+1)*TS+14,y:(f.house.y+f.house.h)*TS+14};
}
RF.forEach(rfLayout);
const rfFenceAt=[];// [x,y] dos mourões
function rfFence(){
 rfFenceAt.length=0;if(typeof farmFence==='function')farmFence();
 for(const f of RF){
  const gate=(x,y)=>f.gate==='n'?(y===f.y0&&(x===f.gx||x===f.gx+1)):(x===f.x0&&(y===f.gy||y===f.gy+1));
  for(let x=f.x0;x<=f.x1;x++)for(const y of[f.y0,f.y1])if(!gate(x,y)){FEN[ti(x,y)]=1;rfFenceAt.push([x,y])}
  for(let y=f.y0+1;y<f.y1;y++)for(const x of[f.x0,f.x1])if(!gate(x,y)){FEN[ti(x,y)]=1;rfFenceAt.push([x,y])}
  const p=f.pas;
  for(let x=p.x0;x<=p.x1;x++)for(const y of[p.y0,p.y1]){FEN[ti(x,y)]=1;rfFenceAt.push([x,y])}
  for(let y=p.y0+1;y<p.y1;y++)for(const x of[p.x0,p.x1]){FEN[ti(x,y)]=1;rfFenceAt.push([x,y])}
 }
}
const _rbfMap=rebuildFence;rebuildFence=function(){_rbfMap();rfFence()};
// cerca da divisa da fazenda (sul e leste da parte nova) e o açude grande da várzea
const FZF=[];
function farmFence(){FZF.length=0;const gap=(x,y)=>(x===58&&(y===85||y===86||y===106))||(y===131&&(x===44));
 for(let y=71;y<=131;y++)if(!gap(58,y)){FEN[ti(58,y)]=1;FZF.push([58,y])}
 for(let x=1;x<58;x++)if(!gap(x,131)){FEN[ti(x,131)]=1;FZF.push([x,131])}}
function farmCarve(){
 for(let y=88;y<=103;y++)for(let x=8;x<=34;x++){if((((x-21)/8.5)**2+((y-96)/4.6)**2)<1){G[ti(x,y)]=2;SOL[ti(x,y)]=0}}
 const inA=a=>{const x=a.x/TS,y=a.y/TS;return(((x-21)/9.5)**2+((y-96)/5.6)**2)<1};
 for(let i=TREES.length-1;i>=0;i--)if(inA(TREES[i])){const t=TREES[i];SOL[ti(Math.floor(t.x/TS),Math.floor((t.y-1)/TS))]=0;TREES.splice(i,1)}
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(inA(DECO[i]))DECO.splice(i,1);
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if((tx===58||ty===131)&&FARMZ(Math.min(tx,57),Math.min(ty,130))){SOL[ti(tx,Math.floor((t.y-1)/TS))]=0;TREES.splice(i,1)}}
}
function rfCarve(){farmCarve();
 const inR=(x,y,m)=>RF.some(f=>x>=f.x0-m&&x<=f.x1+m&&y>=f.y0-m&&y<=f.y1+m);
 for(const f of RF){
  for(let y=f.y0-1;y<=f.y1+1;y++)for(let x=f.x0-1;x<=f.x1+1;x++){if(x<XMIN+1||y<YMIN+1||x>=MW-1||y>=RZ-1)continue;const i=ti(x,y);if(G[i]!==3)G[i]=0;SOL[i]=0}
  const Y=f.yard;for(let y=Y.y0;y<=Y.y1;y++)for(let x=Y.x0;x<=Y.x1;x++)G[ti(x,y)]=3;
  if(f.gate==='n')for(let y=f.y0;y<Y.y0;y++){G[ti(f.gx,y)]=3;G[ti(f.gx+1,y)]=3}else for(let x=f.x0;x<=f.x0+2;x++){G[ti(x,f.gy)]=3;G[ti(x,f.gy+1)]=3}
  for(const r of f.road)carve(3,r[0],r[1],r[2]+(f.gate==='n'?1:0),r[3]+(f.gate==='w'?1:0));
  for(const b of[f.house,f.barn])for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)SOL[ti(x,y)]=1;
 }
 const out=a=>!inR(Math.floor(a.x/TS),Math.floor(a.y/TS),1);
 for(let i=TREES.length-1;i>=0;i--)if(!out(TREES[i]))TREES.splice(i,1);
 for(let i=BUSH.length-1;i>=0;i--)if(!out(BUSH[i]))BUSH.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(!out(DECO[i]))DECO.splice(i,1);
 rfFence();
 // gado/cavalos
 RFC.length=0;RF.forEach((f,fi)=>{const p=f.pas,br=f.kind==='haras'?null:RVP[f.i].br,HBR=['quarto','arabe','mangalarga','crioulo','pantaneiro'];
  for(let k=0;k<f.n;k++){const x=(p.x0+1.5+hs(fi*31+k,7)*(p.x1-p.x0-3))*TS,y=(p.y0+1.5+hs(fi*17+k,3)*(p.y1-p.y0-3))*TS;
   const c={f:fi,x,y,tx:x,ty:y,dir:hs(k,fi)<.5?1:-1,wait:rnd(0,6),mv:0,ph:0};
   if(f.kind==='haras'&&k<f.n){c.horse=HBR[k%HBR.length]}else c.a={id:-(9000+fi*40+k),breed:br,sex:k===0&&f.n>5?'M':'F',age:k%5===4?150:700+k*40,name:'',w:420};
   RFC.push(c)}
  if(f.kind==='haras')for(let k=0;k<4;k++){const x=(p.x0+2+hs(k,99)*(p.x1-p.x0-4))*TS,y=(p.y0+2+hs(99,k)*(p.y1-p.y0-4))*TS;RFC.push({f:fi,x,y,tx:x,ty:y,dir:1,wait:rnd(0,6),mv:0,ph:0,a:{id:-(9000+fi*40+30+k),breed:RVP[f.i].br,sex:'F',age:800,name:'',w:420}})}
 });
}
const _gwMap=genWorld;
genWorld=function(){
 if(S&&S.sea&&S.sea.burn&&S.mapV!==2){const ow=S.mapW||160,nb={};for(const k in S.sea.burn){const i=+k,x=i%ow,y=(i/ow)|0;nb[ti(x,y)]=S.sea.burn[k]}S.sea.burn=nb}
 if(S){S.mapW=MW;S.mapV=2}
 PRDEF=1;PRDIRTY=0;try{_gwMap();rfCarve()}finally{PRDEF=0}
 prerender();
};
// ---- vida nas rivais
const _updMap=update;
update=function(dt){_updMap(dt);
 if(inRoom())return;
 for(const c of RFC){if(Math.abs(c.x-P.x)>VW+200||Math.abs(c.y-P.y)>VH+200){continue}const f=RF[c.f],p=f.pas;
  if(c.wait>0){c.wait-=dt;c.mv=0;continue}
  const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy);
  if(d<2){c.wait=rnd(3,10);c.tx=(p.x0+1.4+Math.random()*(p.x1-p.x0-2.8))*TS;c.ty=(p.y0+1.3+Math.random()*(p.y1-p.y0-2.6))*TS;c.mv=0;continue}
  const sp=c.horse?13:7;c.x+=dx/d*sp*dt;c.y+=dy/d*sp*dt;c.mv=1;c.ph+=dt*sp*.25;if(Math.abs(dx)>1)c.dir=dx>0?1:-1}
};
// ---- desenho: cercas, lavoura e terreiro
const RFB=new Map();let RFBPS=0;
function rfBld(g,b,art,v){if(RFBPS!==PS){RFB.clear();RFBPS=PS}const key=b.x+','+b.y+'|'+art+'|'+v,x=b.x*TS,y=b.y*TS,w=b.w*TS,h=b.h*TS,mx=v>=10?90:48,mt=64,mb=22;let c=RFB.get(key);
 if(!c){const cv=mkCanvas((w+mx*2)*PS,(h+mt+mb)*PS),cg=cv.getContext('2d'),rm=RMODE;RMODE=0;cg.setTransform(PS,0,0,PS,(-x+mx)*PS,(-y+mt)*PS);try{BART[art](cg,b,x,y,w,h,b.door*TS-x,v)}catch(e){}finally{RMODE=rm}c=cv;if(RFB.size>40)RFB.clear();RFB.set(key,c)}
 g.drawImage(c,x-mx,y-mt,w+mx*2,h+mt+mb)}
const rfVis=(f,x0,x1,y0,y1)=>f.x1*TS>x0-60&&f.x0*TS<x1+60&&f.y1*TS>y0-60&&f.y0*TS<y1+90;
const _dfsMap=drawFarmStatic;
drawFarmStatic=function(g){_dfsMap(g);if(inRoom())return;const x0=CX,x1=CX+VW,y0=CY,y1=CY+VH;
 for(const f of RF){if(!rfVis(f,x0,x1,y0,y1))continue;
  if(f.crop){const c=f.crop;for(let y=c.y0;y<=c.y1;y++){const py=y*TS;if(py<y0-TS||py>y1)continue;Rr(g,'#6a4a2a',c.x0*TS,py+2,(c.x1-c.x0+1)*TS,12);for(let x=c.x0;x<=c.x1;x++){const px=x*TS;if(px<x0-TS||px>x1)continue;const k=hs(x,y);Rr(g,'#4a2e18',px,py+7,TS,1);Rr(g,k<.5?'#5aa83a':'#6ab84a',px+2,py+3,3,5);Rr(g,'#4a9a2a',px+9,py+2,3,6);Rr(g,'#e8d060',px+3,py+2,1,1)}}}
 }
 const fs={r:'#8a6a42',p:'#5a3a22'},mfs=fenceStyle();
 for(const [x,y] of FZF){const px=x*TS,py=y*TS;if(px<x0-TS||px>x1||py<y0-TS||py>y1+TS)continue;drawFence(g,px,py,mfs)}
 for(const [x,y] of rfFenceAt){const px=x*TS,py=y*TS;if(px<x0-TS||px>x1||py<y0-TS||py>y1+TS)continue;drawFence(g,px,py,fs)}
};
function rfSign(g,f){const t=pclean(rvFarm(f.i)),tw=ptw(t)+8,x=(f.gate==='n'?(f.gx+1)*TS:f.x0*TS+8),y=(f.gate==='n'?f.y0*TS-2:(f.gy)*TS-6),bx=f.gate==='n'?x-tw/2-26:x-tw/2;
 Rr(g,'rgba(0,0,0,.25)',bx+2,y+2,tw,2);Rr(g,'#3a2414',bx+3,y-14,2,16);Rr(g,'#3a2414',bx+tw-5,y-14,2,16);Rr(g,'#1e140c',bx-1,y-25,tw+2,12);Rr(g,'#6a4428',bx,y-24,tw,10);Rr(g,'#8a6038',bx,y-24,tw,1.2);ptext(g,t,bx+4,y-21.5,'#ffe9a8','#1e140c')}
function rfOwner(g,f){const l=RVP[f.i].lk,o=f.own,t=frame/60+f.i;OL(g,o.x,o.y+3,30,42,c=>drawPerson(c,{x:o.x,y:o.y,dir:Math.sin(t*.3)>0?0:3,ph:0,mv:0,shirt:l.shirt,hair:l.hair,hat:l.hat,pants:l.pants,g:l.g,skin:l.skin}));
 if(RMODE!==4&&Math.hypot(o.x-P.x,o.y-P.y)<90){const n=rvName(f.i),tw=ptw(n);Rr(g,'rgba(40,10,10,.65)',o.x-tw/2-2,o.y-37,tw+4,8);ptext(g,n,o.x-tw/2,o.y-35.5,'#ffb080')}}
const _evoMap=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoMap(L,x0,x1,y0,y1);if(inRoom())return;
 for(const f of RF){if(!rfVis(f,x0,x1,y0,y1))continue;
  L.push([(f.house.y+f.house.h)*TS,10,{draw:g=>rfBld(g,f.house,'house',f.hv)}]);
  L.push([(f.barn.y+f.barn.h)*TS,10,{draw:g=>rfBld(g,f.barn,'barn',f.bv)}]);
  const sy=f.gate==='n'?f.y0*TS-2:f.gy*TS-6;L.push([sy,10,{draw:g=>rfSign(g,f)}]);
  L.push([f.own.y,10,{draw:g=>rfOwner(g,f)}]);
 }
 for(const c of RFC){if(c.x<x0-40||c.x>x1+40||c.y<y0-30||c.y>y1+40)continue;
  if(c.horse)L.push([c.y,10,{draw:g=>OL(g,c.x,c.y+3,44,40,q=>drawHorseS(q,c.x,c.y,c.dir>0?3:2,c.horse,{mv:c.mv,ph:c.ph}))}]);
  else L.push([c.y+10,10,{draw:g=>OL(g,c.x+8.5,c.y+12,28,24,q=>drawCow(q,c.a,c.x,c.y,c.dir,c.mv))}]);
 }
};
// ---- conversa e placa
function rfInfo(fi){if(typeof ensureM==='function')ensureM();const f=RF[fi],i=f.i,p=RVP[i],L=rankList(),pos=L.findIndex(x=>x.n===rvFarm(i))+1,nw=S.rk&&S.rk.v?S.rk.v[i]:RIV[i][2];
 const what=f.kind==='haras'?'cavalos de raça e gado '+BREEDS[p.br].n:f.kind==='lavoura'?'lavoura com tecnologia e gado '+BREEDS[p.br].n:f.kind==='leite'?'leite de vacas '+BREEDS[p.br].n:f.kind==='expo'?'gado '+BREEDS[p.br].n+' de exposição':'gado '+BREEDS[p.br].n;
 showModal('<h3>📜 '+rvFarm(i)+'</h3><div class="card">Dono(a): <b>'+rvName(i)+'</b> · '+p.t+'<br>Cria: '+what+'<br>Patrimônio: <b class="gold">'+R$(nw)+'</b> · '+pos+'º no ranking da região</div><div class="dim">O dono fica perto da casa. Chegue perto para conversar, propor desafios e ver os animais à venda nos dias de visita.</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
const _ilMap=interactList;
interactList=function(){const L=_ilMap();if(inRoom())return L;
 RF.forEach((f,fi)=>{const o=f.own;if(Math.abs(o.x-P.x)<60&&Math.abs(o.y-P.y)<60)L.push({x:o.x,y:o.y,r:26,label:'🤠 Falar com '+rvName(f.i)+' ('+rvFarm(f.i)+')',fn:()=>{if(typeof ensureM==='function')ensureM();rivalModal(f.i,0)}});
  const sx=f.gate==='n'?(f.gx+1)*TS-26:f.x0*TS+8,sy=f.gate==='n'?f.y0*TS:f.gy*TS;if(Math.abs(sx-P.x)<50&&Math.abs(sy-P.y)<50)L.push({x:sx,y:sy,r:26,label:'📜 '+rvFarm(f.i),fn:()=>rfInfo(fi)})});
 return L};
// ---- mapa da região
const MAPPOI=()=>[
 {n:pclean(S.farmName||'Sua fazenda'),x:30,y:45,c:'#ffd75e',big:1},{n:'VILA',x:120,y:56,c:'#ffffff',big:1},{n:'MATA',x:78,y:58,c:'#b8f0a0',big:1},{n:'BAIRRO NOVO',x:130,y:80,c:'#ffffff'},
 {n:'LOJA DO CACADOR',x:50,y:9,c:'#ffffff'},{n:'SERRA',x:130,y:28,c:'#cfe8ff',big:1},{n:'PANTANAL',x:140,y:60,c:'#cfe8a0',big:1},{n:'CERRADO',x:80,y:146,c:'#ffe0a0',big:1},
 {n:'SERRA ALTA',x:160,y:-14,c:'#cfe8ff',big:1},{n:'MATA DO OESTE',x:-14,y:16,c:'#b8f0a0',big:1},{n:'CAMPOS DO OESTE',x:-15,y:88,c:'#ffe0a0',big:1},{n:'CERRADO DO SUL',x:62,y:186,c:'#ffe0a0',big:1},{n:'ALAGADOS',x:256,y:110,c:'#cfe8a0',big:1},{n:'LOTE SUL',x:30,y:78,c:'#b8f0a0'},{n:'VARZEA',x:30,y:96,c:'#b8f0a0'},{n:'RETIRO',x:30,y:118,c:'#b8f0a0'}
].concat(RF.map(f=>({n:pclean(rvFarm(f.i).replace(/^(Fazenda|Sítio) /,'')),x:(f.x0+f.x1)/2,y:f.y0-1.5,c:'#ffb080',rv:1})));
function mapModal(){
 showModal('<h3>🗺️ Mapa da região</h3><div style="overflow:auto;max-height:62vh;border-radius:6px"><canvas id="wmapc" width="960" height="668" style="width:720px;max-width:none;image-rendering:pixelated;display:block"></canvas></div><div class="dim">Amarelo: você e sua fazenda · laranja: fazendas rivais · verde: terrenos da sua fazenda (compre em 🏗️ Obras).</div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
 const cv=document.getElementById('wmapc');if(!cv||!GC)return;const g=cv.getContext('2d'),s=4,W=AW*s,H=(RZ-1-YMIN)*s;cv.width=W;cv.height=H;cv.style.width=Math.round(W*.75)+'px';
 g.imageSmoothingEnabled=true;g.drawImage(GC,0,0,AW*TS,(RZ-1-YMIN)*TS,0,0,W,H);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(0,0,W,H);g.translate(-XMIN*s,-YMIN*s);
 for(const l of LOTS){const own=S.lots&&S.lots[l.id];g.strokeStyle=own?'rgba(255,215,94,.9)':'rgba(140,240,120,.7)';g.lineWidth=2;g.setLineDash(own?[]:[6,4]);g.strokeRect(l.x0*s,l.y0*s,(l.x1-l.x0+1)*s,(l.y1-l.y0+1)*s)}g.setLineDash([]);
 for(const f of RF){g.strokeStyle='#ff9a5a';g.lineWidth=2;g.strokeRect(f.x0*s,f.y0*s,(f.x1-f.x0+1)*s,(f.y1-f.y0+1)*s)}
 g.textAlign='center';for(const p of MAPPOI()){g.font=(p.big?'bold 19px':'bold 14px')+' monospace';g.lineWidth=4;g.strokeStyle='rgba(0,0,0,.8)';g.strokeText(p.n,p.x*s,p.y*s);g.fillStyle=p.c;g.fillText(p.n,p.x*s,p.y*s)}
 const px=P.x/TS*s,py=P.y/TS*s;g.fillStyle='#000';g.beginPath();g.arc(px,py,9,0,7);g.fill();g.fillStyle='#ffd75e';g.beginPath();g.arc(px,py,6,0,7);g.fill();g.font='bold 13px monospace';g.lineWidth=4;g.strokeStyle='#000';g.strokeText('VOCÊ',px,py-13);g.fillStyle='#ffd75e';g.fillText('VOCÊ',px,py-13);
 const wrap=cv.parentElement,sc=wrap.scrollWidth/cv.width;wrap.scrollLeft=Math.max(0,(px-XMIN*s)*sc-wrap.clientWidth/2);wrap.scrollTop=Math.max(0,(py-YMIN*s)*sc-wrap.clientHeight/2);
}
ACT.wmap=()=>mapModal();
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='n'&&!paused()&&!(P&&P.drive)){mapModal()}});
const _pRegMap=pReg;pReg=function(){return '<div class="btns"><button class="b gold" data-act="wmap">🗺️ Abrir o mapa da região</button></div>'+_pRegMap()};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:1,ic:'🗺️',t:'Mapa da região',h:'A região ficou bem maior: serra e pantanal até o leste, cerrado ao sul e as 9 fazendas rivais com casa, curral e gado. Abra o mapa em MENU › 🏆 Região (ou tecla N). A sua fazenda cresce para o sul: compre Lote Sul, Várzea do Açude e Retiro em 🏗️ Obras.'});
