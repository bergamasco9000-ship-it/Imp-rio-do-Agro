// ===== Fazendas rivais vivas: plantam, compram semente, colhem, constroem, vendem e compram gado — como você =====
// cada fazenda ganha uma roça ao lado do pasto (a lavoura grande da fazenda de lavoura continua a mesma)
RF.forEach(f=>{if(!f.crop){const p=f.pas;f.crop={x0:p.x0+1,y0:p.y0+1,x1:p.x0+5,y1:p.y1-1,small:1};p.x0=f.crop.x1+2}});
const RVC={soja:{n:'soja',sc:'sacas',sd:42,pr:137,ha:58,d:110,c1:'#6aa83a',c2:'#d8c060'},milho:{n:'milho',sc:'sacas',sd:20,pr:66,ha:110,d:120,c1:'#5a9a32',c2:'#c8a860'},capim:{n:'capim para silagem',sc:'toneladas',sd:6,pr:180,ha:35,d:70,c1:'#4a9a3a',c2:'#8ab040'},cana:{n:'cana',sc:'toneladas',sd:45,pr:155,ha:80,d:150,c1:'#4a8a3a',c2:'#a8b860'}};
const RVB=[{k:'caixa',n:"caixa d'água",c:25000,d:5},{k:'silo',n:'silo metálico',c:90000,d:12},{k:'curral',n:'curral novo',c:60000,d:10},{k:'galpao',n:'galpão de máquinas',c:180000,d:20},{k:'casa',n:'reforma da sede',c:150000,d:18}];
function rvSlot(f,k){const h=f.house,b=f.barn;
 if(k==='silo')return{x:h.x+h.w+1,y:f.y0+3,w:2,h:3};if(k==='caixa')return{x:h.x+h.w+3,y:f.y0+3,w:1,h:3};
 if(k==='galpao'){const x=b.x+b.w+1;return f.x1-1-x>=5?{x,y:f.y0+2,w:5,h:4}:null}
 if(k==='curral'){const p=f.pas;return{x:p.x1-5,y:p.y0+1,w:4,h:3}}if(k==='casa')return{x:h.x,y:h.y,w:h.w,h:h.h};return null}
function ensureRL(){if(!S.rl)S.rl={};RF.forEach(f=>{if(!S.rl[f.i])S.rl[f.i]={crop:{c:null,st:'fallow',d0:S.day-ri(0,20),len:0},bl:{},pj:null,hv:null,bv:null}});return S.rl}
const rvV=i=>S.rk&&S.rk.v?S.rk.v[i]:(RIV[i]?RIV[i][2]:1e5);
function rvMoney(i,d){if(S.rk&&S.rk.v)S.rk.v[i]=Math.max(20000,S.rk.v[i]+d)}
function rvNews(f,t,big){rvLog(f.i,t);const near=Math.hypot(P.x-(f.x0+f.x1)/2*TS,P.y-(f.y0+f.y1)/2*TS)<700;if(near||(big&&Math.random()<.35))toast('📰 '+rvName(f.i)+': '+t)}
function cropFor(f){const m=Math.floor((S.day%360)/30);// 0=out ... meses do jogo: 0-2 chuva, 3-8 seca, 9-11 chuva
 if(f.kind==='lavoura')return m>=9||m<=0?'soja':m<=2?'milho':null;if(f.kind==='leite'||f.kind==='haras')return m>=9||m<=3?'capim':null;
 if(f.i===4||f.i===8)return m>=9||m<=1?'cana':null;return m>=9||m<=0?'milho':m<=2?'capim':null}
function plotHa(f){const c=f.crop;return Math.max(1,Math.round((c.x1-c.x0+1)*(c.y1-c.y0+1)/(c.small?3:4)))}
function rvDay(){const R=ensureRL();
 for(const f of RF){const r=R[f.i],C=r.crop,ha=plotHa(f);
  // lavoura
  if(C.st==='fallow'&&S.day-C.d0>=4){const k=cropFor(f);if(k){const K=RVC[k],cost=Math.round(K.ha*K.pr*ha*.72);C.c=k;C.st='prep';C.d0=S.day;rvMoney(f.i,-cost);
    rvNews(f,'Comprou '+(ha*2)+' sacos de semente e o adubo de '+K.n+' na Casa Agro ('+R$(cost)+') e está preparando a terra.')}}
  else if(C.st==='prep'&&S.day-C.d0>=2){C.st='grow';C.d0=S.day;C.len=RVC[C.c].d;rvLog(f.i,'Plantou '+ha+' ha de '+RVC[C.c].n+'.')}
  else if(C.st==='grow'&&S.day-C.d0>=C.len){C.st='ripe';C.d0=S.day}
  else if(C.st==='ripe'&&S.day-C.d0>=ri(1,4)){C.st='harv';C.d0=S.day}
  else if(C.st==='harv'&&S.day-C.d0>=2){const K=RVC[C.c],q=Math.round(K.ha*ha*rnd(.7,1.15)),v=Math.round(q*K.pr*mktEff()*.9);rvMoney(f.i,v);C.st='fallow';C.d0=S.day;
   rvNews(f,'Colheu '+q.toLocaleString('pt-BR')+' '+K.sc+' de '+K.n+' e vendeu na cooperativa por '+R$(v)+'.',v>200000)}
  // obras
  if(r.pj&&S.day>=r.pj.d1){const B=RVB.find(b=>b.k===r.pj.k);r.bl[B.k]=1;if(B.k==='casa'){r.hv=Math.min(13,(r.hv!=null?r.hv:f.hv)+1);f.hv=r.hv;if(typeof RFB!=='undefined')RFB.clear()}rvSol(f,B.k);r.pj=null;rvNews(f,'Terminou a obra: '+B.n+'! 🏗️',1)}
  else if(!r.pj&&Math.random()<.025){const opts=RVB.filter(b=>!r.bl[b.k]&&rvSlot(f,b.k)&&rvV(f.i)*.12>b.c);if(opts.length){const B=opts[0];r.pj={k:B.k,d0:S.day,d1:S.day+B.d};rvMoney(f.i,-B.c*.25);rvNews(f,'Começou a construir: '+B.n+' ('+R$(B.c)+'). Pedreiros trabalhando.')}}
  // gado: nascimentos e vendas
  if(S.day%30===15){const nb=ri(0,2),ns=f.kind==='haras'?0:ri(0,3);for(let k=0;k<nb&&f.n<22;k++)rvAddCow(f,1);let sold=0;for(let k=0;k<ns&&f.n>6;k++){if(rvDelCow(f)){sold++}}
   if(sold){const v=Math.round(sold*arroba('nelore')*18*(BREEDS[RVP[f.i].br]?BREEDS[RVP[f.i].br].pm:1));rvMoney(f.i,v*.25);rvNews(f,'Embarcou '+sold+' boi(s) gordo(s) para o frigorífico: '+R$(v)+'.')}
   if(nb)rvLog(f.i,'Nasceram '+nb+' bezerro(s) na fazenda.')}
 }}
function rvAddCow(f,calf){const p=f.pas,fi=RF.indexOf(f),x=(p.x0+2+Math.random()*(p.x1-p.x0-4))*TS,y=(p.y0+2+Math.random()*(p.y1-p.y0-4))*TS;f.n++;RFC.push({f:fi,x,y,tx:x,ty:y,dir:1,wait:rnd(0,4),mv:0,ph:0,a:{id:-(9900+S.day*7+ri(0,999)),breed:RVP[f.i].br||'nelore',sex:'F',age:calf?60:600,name:'',w:calf?80:420}})}
function rvDelCow(f){const fi=RF.indexOf(f),i=RFC.findIndex(c=>c.f===fi&&c.a&&!c.horse);if(i<0)return false;RFC.splice(i,1);f.n--;return true}
function rvSol(f,k){const s=rvSlot(f,k);if(!s||k==='casa'||k==='curral')return;for(let y=s.y;y<s.y+s.h;y++)for(let x=s.x;x<s.x+s.w;x++)SOL[ti(x,y)]=1}
const _hdRvl=hookDay;hookDay=function(){_hdRvl();try{rvDay()}catch(e){console.error(e)}};
// aplica o que já foi construído quando carrega o jogo
const _rfcRvl=rfCarve;rfCarve=function(){_rfcRvl();if(!S)return;const R=ensureRL();RF.forEach(f=>{const r=R[f.i];if(r.hv!=null)f.hv=r.hv;for(const k in r.bl)rvSol(f,k);
 const c=f.crop;for(let y=c.y0;y<=c.y1;y++)for(let x=c.x0;x<=c.x1;x++){const i=ti(x,y);SOL[i]=0;if(G[i]===3)G[i]=0}})};
// ---------- desenho: roça por fase, obras, construções novas
const _dfsRvl=drawFarmStatic;drawFarmStatic=function(g){const keep=RF.map(f=>f.crop);RF.forEach(f=>f.crop=null);try{_dfsRvl(g)}finally{RF.forEach((f,i)=>f.crop=keep[i])}
 if(inRoom()||!S.rl)return;const x0=CX,x1=CX+VW,y0=CY,y1=CY+VH;
 for(const f of RF){if(!rfVis(f,x0,x1,y0,y1))continue;const r=S.rl[f.i];if(!r)continue;const C=r.crop,K=C.c&&RVC[C.c],c=f.crop;
  const prog=C.st==='grow'?clamp((S.day-C.d0+dayHour()/24)/C.len,0,1):C.st==='ripe'||C.st==='harv'?1:0;
  for(let y=c.y0;y<=c.y1;y++){const py=y*TS;if(py<y0-TS||py>y1)continue;
   Rr(g,C.st==='fallow'?'#8a7a4a':'#6a4a2a',c.x0*TS,py+1,(c.x1-c.x0+1)*TS,14);
   for(let x=c.x0;x<=c.x1;x++){const px=x*TS;if(px<x0-TS||px>x1)continue;const k=hs(x,y);Rr(g,'#4a2e18',px,py+6,TS,1.2);Rr(g,'#4a2e18',px,py+12,TS,1.2);
    if(C.st==='fallow'){if(k<.6)Rr(g,'#b8a060',px+k*10,py+4,3,1)}
    else if(C.st==='grow'||C.st==='ripe'||(C.st==='harv'&&x>c.x0+((c.x1-c.x0)*(S.t%1)))){const hgt=1+prog*9,col=prog>.85?K.c2:K.c1;for(let j=0;j<3;j++){const xx=px+2+j*5;Rr(g,shade(col,-20),xx,py+6-hgt,1.6,hgt);Rr(g,col,xx-1,py+6-hgt,3.4,Math.min(3,hgt));Rr(g,shade(col,-20),xx,py+12-hgt*.8,1.6,hgt*.8);Rr(g,col,xx-1,py+12-hgt*.8,3.4,Math.min(3,hgt))}}}}}};
const _evoRvl=evoItems;evoItems=function(L,X0,X1,Y0,Y1){_evoRvl(L,X0,X1,Y0,Y1);if(inRoom()||!S.rl)return;
 for(const f of RF){if(!rfVis(f,X0,X1,Y0,Y1))continue;const r=S.rl[f.i];if(!r)continue;
  for(const k in r.bl){const s=rvSlot(f,k);if(!s||k==='casa')continue;L.push([(s.y+s.h)*TS,10,{draw:g=>drawRvBld(g,k,s)}])}
  if(r.pj){const s=rvSlot(f,r.pj.k);if(s){const B=RVB.find(b=>b.k===r.pj.k),pr=clamp((S.day-r.pj.d0+dayHour()/24)/(r.pj.d1-r.pj.d0),0,1);
   L.push([(s.y+s.h)*TS,10,{draw:g=>drawRvObra(g,s,pr,r.pj.k)}]);const wx=(s.x+s.w)*TS+6,wy=(s.y+s.h)*TS+2,h=dayHour();if(h>=7&&h<17)npcAt(L,wx,wy,{shirt:'#d8a030',hat:'#f0d040',hair:'#3a2a1a',pants:'#3a4a6a',dir:2,ph:frame*.2,mv:0})}}
  // trator na roça quando prepara ou colhe
  const C=r.crop;if((C.st==='prep'||C.st==='harv')&&f.crop.small){const c=f.crop,span=(c.x1-c.x0)*TS,t=(frame/60*16)%(span*2),tx=c.x0*TS+8+(t<span?t:span*2-t),row=Math.floor(frame/60*16/span)%Math.max(1,c.y1-c.y0),ty=(c.y0+1+row)*TS+6,dir=t<span?3:2;
   L.push([ty,10,{draw:g=>drawTractorV(g,tx,ty,dir,1)}])}}};
function drawRvBld(g,k,s){const x=s.x*TS,y=s.y*TS,w=s.w*TS,h=s.h*TS,R=(c,a,b,ww,hh)=>Rr(g,c,x+a,y+b,ww,hh);
 if(k==='silo'){R('rgba(0,0,0,.22)',2,h-2,w,4);R('#a8b0b8',2,-6,w-4,h+4);for(let i=0;i<8;i++)R('#8a929a',2,-4+i*6,w-4,1);R('#c8d0d8',4,-6,3,h+4);R('#7a828a',0,-12,w,7);R('#9aa2aa',3,-15,w-6,4);R('#5a6268',w/2-1,-19,2,5)}
 else if(k==='caixa'){R('rgba(0,0,0,.2)',0,h-2,w+2,3);R('#5a3a22',3,0,1.6,h);R('#5a3a22',w-4,0,1.6,h);R('#3a6ab0',0,-8,w,10);R('#5a8ad0',1,-8,3,10);R('#2a4a8a',0,-9,w,2)}
 else if(k==='galpao'){R('rgba(0,0,0,.22)',2,h-2,w,4);R('#c8ccd0',0,8,w,h-8);for(let i=0;i<w;i+=6)R('#b0b4b8',i,8,1,h-8);R('#8a9096',-3,0,w+6,10);R('#a8aeb4',-3,0,w+6,2);R('#3a3a3a',w/2-16,h-26,32,26);R('#4a4a4a',w/2-14,h-24,28,24);R('#d8a52a',w/2-10,h-12,8,8);ptext(g,'GALPAO',x+6,y+10,'#3a3a3a')}
 else if(k==='curral'){R('rgba(0,0,0,.12)',0,h-2,w,3);for(const yy of[0,h-2]){R('#5a3a22',0,yy-6,w,2);R('#7a5232',0,yy-2,w,2)}for(const xx of[0,w-2]){R('#5a3a22',xx,-6,2,h+2)}for(let i=0;i<w;i+=16)R('#4a2e18',i,-8,2.4,10);R('#8a6a3a',4,h/2,w-8,2)}}
function drawRvObra(g,s,pr,k){const x=s.x*TS,y=s.y*TS,w=s.w*TS,h=s.h*TS,R=(c,a,b,ww,hh)=>Rr(g,c,x+a,y+b,ww,hh);
 if(k==='casa'){R('#c8a060',-4,h-30,6,30);R('#c8a060',w-2,h-30,6,30);for(let i=0;i<3;i++)R('#8a6a3a',-4,h-30+i*10,w+8,1.6);return}
 const hh=Math.max(4,h*pr);R('rgba(0,0,0,.18)',0,h-2,w,4);R('#b8b0a0',2,h-hh,w-4,hh);for(let i=0;i<hh;i+=5)R('#a09888',2,h-i,w-4,1);
 R('#c8a060',-2,-4,2,h+4);R('#c8a060',w,-4,2,h+4);for(let i=0;i<4;i++)R('#c8a060',-2,h-6-i*12,w+4,1.6);
 R('#c84a2a',w+4,h-6,8,5);R('#e8e0d0',w+5,h-10,7,4);R('#9a9a9a',-10,h-5,8,5)}
// ---------- tratores parados quando a roça não precisa
const _swRvl=stepWorkers;stepWorkers=function(dt){_swRvl(dt);if(!S.rl)return;for(const w of RW){if(w.t!=='trat')continue;const f=RF[w.f],r=S.rl[f.i];if(!r)continue;const st=r.crop.st;if(st!=='prep'&&st!=='harv'&&st!=='grow'){w.x=(f.barn.door+1)*TS;w.y=(f.barn.y+f.barn.h)*TS+18;w.dir=0}}};
// ---------- ficha da fazenda rival mostra o que está acontecendo
function rvStatus(f){const r=ensureRL()[f.i],C=r.crop,K=C.c&&RVC[C.c];let t='';
 const st={fallow:'terra descansando',prep:'preparando a terra para '+(K?K.n:''),grow:(K?K.n:'')+' crescendo ('+Math.round(clamp((S.day-C.d0)/C.len,0,1)*100)+'%)',ripe:(K?K.n:'')+' pronta para colher',harv:'colhendo '+(K?K.n:'')}[C.st];
 t+='<div class="row"><span>🌱 Roça ('+plotHa(f)+' ha)</span><span class="dim">'+st+'</span></div>';
 t+='<div class="row"><span>🐄 Rebanho</span><span class="dim">'+f.n+' cabeças</span></div>';
 if(r.pj){const B=RVB.find(b=>b.k===r.pj.k);t+='<div class="row"><span>🏗️ Obra</span><span class="dim">'+B.n+' · faltam '+Math.max(0,r.pj.d1-S.day)+' dias</span></div>'}
 const bl=Object.keys(r.bl).map(k=>RVB.find(b=>b.k===k).n);if(bl.length)t+='<div class="dim">Já construiu: '+bl.join(', ')+'</div>';
 const L=(S.rlog&&S.rlog[f.i])||[];if(L.length)t+='<div class="sec">ÚLTIMAS NOTÍCIAS</div>'+L.slice(0,6).map(e=>'<div class="dim" style="font-size:12px">dia '+(e.d-269)+': '+e.t+'</div>').join('');
 return '<div class="card"><b>📋 O que está acontecendo na '+rvFarm(f.i)+'</b>'+t+'</div>'}
const _riRvl=rfInfo;rfInfo=function(fi){_riRvl(fi);try{const box=document.getElementById('mbox'),f=RF[fi];if(box&&f){const btn=box.querySelector('.btns');const html=rvStatus(f);if(btn)btn.insertAdjacentHTML('beforebegin',html);else box.insertAdjacentHTML('beforeend',html)}}catch(e){console.error(e)}};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:3,ic:'📰',t:'Vizinhos vivos',h:'As fazendas rivais plantam, colhem, constroem silos e galpões, vendem boi e compram no recinto do leilão. Visite a porteira delas para ver o que estão fazendo.'});
