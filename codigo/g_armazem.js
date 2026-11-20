// ===== ARMAZÉM DA FAZENDA: toda a colheita (e os ovos) fica guardada aqui, atrás da casa, e você vende quando o preço estiver bom.
// Cada produto tem seu preço do dia (sobe e desce com a época e o mercado). Dá para ampliar na Casa Agro › Melhorias.
const ARMCAP=[300,1000,3000,10000];
const ARMN=['Paiol de madeira','Galpão de alvenaria','Galpão grande com câmara fria','Silos metálicos com secador'];
const armOK=k=>!!(ITEMS[k]&&(ITEMS[k].cat==='crop'||k==='ovo'));
const armCap=()=>ARMCAP[Math.min(3,(S&&S.up&&S.up.arm)||0)];
const armCount=()=>Object.keys(S.inv).reduce((s,k)=>s+(armOK(k)?S.inv[k]:0),0);
const bagCount=()=>Object.keys(S.inv).reduce((s,k)=>s+(armOK(k)?0:S.inv[k]),0);
function ensureArm(){if(!S.arm)S.arm={auto:'vender',sold:0};return S.arm}
// ---------- a colheita vai para o armazém; a mochila fica só com sementes, comida, remédios etc.
addItem=function(id,n){n=n||1;
 if(armOK(id)){const room=Math.max(0,armCap()-armCount()),a=Math.min(room,n);if(a>0){S.inv[id]=(S.inv[id]||0)+a;tt('armh','📦 '+ITEMS[id].ic+' Guardado no armazém ('+armCount()+'/'+armCap()+')','good',6)}
  if(a<n)tt('armfull','📦 Armazém cheio! Venda parte da colheita ou amplie o armazém (Casa Agro › Melhorias).','bad',8);return a}
 const room=Math.max(0,invCap()-bagCount()),a=Math.min(room,n);if(a>0)S.inv[id]=(S.inv[id]||0)+a;if(a<n)toast('🎒 Mochila cheia!','bad');return a};
// ---------- preço de cada produto no dia: época do ano + mercado + sorte
const CPH={milho:0,mandioca:1.4,tomate:2.7,trigo:4.0,soja:.7,cana:5.1,cafe:3.4};
function cropF(id){return S&&S.cpx&&S.cpx[id]||1}
function cpxStep(k){const doy=(S.day%360)/360,tgt=1+.13*Math.sin(2*Math.PI*doy+(CPH[k]||0));let f=S.cpx[k]||tgt;f+=(tgt-f)*.1+gauss()*.03;if(Math.random()<.02)f*=Math.random()<.5?1.15:.87;S.cpx[k]=clamp(f,.72,1.4)}
function cpxEnsure(){if(S.cpx&&S.cph)return;S.cpx={};S.cph={};const d0=S.day;for(const k in CROPS){S.cph[k]=[]}for(let i=29;i>=0;i--){S.day=d0-i;for(const k in CROPS){cpxStep(k);S.cph[k].push(itemPrice(k))}}S.day=d0}
function cpxDay(){cpxEnsure();for(const k in CROPS){cpxStep(k);const h=S.cph[k];h.push(itemPrice(k));if(h.length>30)h.shift()}}
const _hdArm=hookDay;hookDay=function(){_hdArm();if(S)cpxDay();if(S&&S.tut>=TUT.length&&typeof tip==='function'&&!(S.tips&&S.tips.arm))tip('arm','📦 <b>Armazém da fazenda</b>: tudo que você colhe (e os ovos) fica guardado no armazém, <b>atrás da sua casa</b>. Cada produto tem preço do dia: guarde e venda quando estiver bom!',{go:()=>{const b=armB();return b&&!inRoom()?{x:b.door*TS+8,y:(b.y+b.h)*TS+6,h:'armazém'}:null}})};
function avgP(k){const h=(S.cph&&S.cph[k])||[];return h.length?h.reduce((a,b)=>a+b,0)/h.length:itemPrice(k)}
function trendTxt(k){const p=itemPrice(k),a=avgP(k),d=Math.round((p/a-1)*100);return d>=4?'<span class="grn">▲ '+d+'% acima da média</span>':d<=-4?'<span class="red">▼ '+(-d)+'% abaixo da média</span>':'<span class="dim">● na média do mês</span>'}
function sparkP(k){const arr=((S.cph&&S.cph[k])||[]).slice();arr.push(itemPrice(k));if(arr.length<2)return '';const mn=Math.min(...arr),mx=Math.max(...arr),w=110,h=26;
 return '<svg width="'+w+'" height="'+h+'" style="vertical-align:middle"><polyline fill="none" stroke="'+(arr[arr.length-1]>=arr[0]?'#3ac06a':'#e05a4a')+'" stroke-width="2" points="'+arr.map((v,i)=>(i/(arr.length-1)*w).toFixed(1)+','+(h-2-(mx>mn?(v-mn)/(mx-mn):.5)*(h-4)).toFixed(1)).join(' ')+'"/></svg>'}
// ---------- melhoria: ampliar o armazém; a "Depósito maior" antiga vira carroça (espaço na mochila)
Object.assign(UPS,{arm:{n:'Ampliar o armazém',ic:'📦',d:'Mais espaço para guardar a colheita: 1.000, 3.000 e 10.000 sacas/caixas.',c:[18000,60000,180000],lv:[2,4,6],ln:ARMN.slice(1)}});
if(UPS.dep){UPS.dep.n='Carroça e balaios';UPS.dep.d='+100 de espaço na mochila para carregar sementes, comida e remédios.';UPS.dep.ln=['Carrinho de mão e balaios','Carroça de burro']}
// ---------- o prédio: atrás da casa, entre a casa e o celeiro (escolhe um lugar livre se você já construiu algo ali)
const ARMSPOTS=[[9,35],[2,35],[17,35],[26,49]];
function armSpotOK(x,y){const w=8,h=5;for(const b of BLD)if(b.id!=='armazem'&&x<b.x+b.w+1&&x+w>b.x-1&&y<b.y+b.h+1&&y+h>b.y-1)return false;
 for(const o of (S&&S.blds||[]).concat(S&&S.obra?[S.obra]:[])){const q=typeof BT!=='undefined'&&BT[o.type];if(q&&x<o.x+q.w+1&&x+w>o.x-1&&y<o.y+q.h+1&&y+h>o.y-1)return false}return true}
const armB=()=>BLD.find(b=>b.id==='armazem');
const _rfcArm=rfCarve;rfCarve=function(){_rfcArm();if(!S)return;const A=ensureArm();try{cpxEnsure()}catch(e){}let p=A.pos;if(!p||!armSpotOK(p[0],p[1]))p=ARMSPOTS.find(q=>armSpotOK(q[0],q[1]))||ARMSPOTS[0];A.pos=p;
 let b=armB();if(!b){b={id:'armazem',x:p[0],y:p[1],w:8,h:5,door:p[0]+4,roof:'#8a8e96',wall:'#e8e0cc',label:'Armazém da fazenda',sign:'ARMAZEM'};BLD.push(b)}else{b.x=p[0];b.y=p[1];b.door=p[0]+4}
 for(let y=b.y-1;y<=b.y+b.h;y++)for(let x=b.x-1;x<=b.x+b.w;x++){const i=ti(x,y),inF=x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h;SOL[i]=inF?1:0;if(!inF&&y===b.y+b.h&&Math.abs(x-b.door)<=1)G[i]=3}
 const inR=t=>t.x>=(b.x-1)*TS&&t.x<=(b.x+b.w+1)*TS&&t.y>=(b.y-1)*TS&&t.y<=(b.y+b.h+.7)*TS;for(const L of[TREES,BUSH])for(let i=L.length-1;i>=0;i--)if(inR(L[i]))L.splice(i,1);
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(inR(DECO[i]))DECO.splice(i,1)};
const _bvArm=bVar;bVar=function(b){if(b.id==='armazem')return Math.min(3,S.up.arm||0);return _bvArm(b)};
if(typeof BART!=='undefined')BART.armazem=function(g,b,x,y,w,h,dx,v){const R=(c,a,bb,ww,hh)=>Rr(g,c,x+a,y+bb,ww,hh);v=v||0;
 R('rgba(0,0,0,.3)',4,h-2,w,6);
 if(v>=3)for(const sx of[-28,w+3]){const sw=24,top=-14,bot=h-2;// silos metálicos
  R('rgba(0,0,0,.25)',sx+3,bot-2,sw,5);const sh=['#c8ccd4','#b8bcc4','#a8acb4','#9aa0a8','#8a9098','#7a8088'];for(let i=0;i<6;i++)R(sh[i],sx+i*4,top,4,bot-top);
  for(let yy=top+6;yy<bot;yy+=9)R('#6a7078',sx,yy,sw,1.2);g.fillStyle='#9aa0a8';g.beginPath();g.moveTo(x+sx-1,y+top);g.lineTo(x+sx+sw/2,y+top-13);g.lineTo(x+sx+sw+1,y+top);g.closePath();g.fill();
  g.fillStyle='#b8bcc4';g.beginPath();g.moveTo(x+sx-1,y+top);g.lineTo(x+sx+sw/2,y+top-13);g.lineTo(x+sx+sw/2,y+top);g.closePath();g.fill();R('#5a5e66',sx+sw/2-2,top-15,4,3);
  for(let yy=top+2;yy<bot-2;yy+=3)R('#4a4e56',sx+sw-4,yy,3,1);R('#4a4e56',sx+sw-4,top+1,1,bot-top-3);R('#4a4e56',sx+sw-2,top+1,1,bot-top-3);R('#3a3e46',sx+sw/2-4,bot-12,8,10)}
 if(v===0){// paiol de madeira
  R('#7a5230',0,22,w,h-22);for(let i=2;i<w;i+=6){R('#6a4428',i,22,1,h-22);R('#8a6238',i+2,24,2,h-26)}
  g.fillStyle='#8a8e96';g.beginPath();g.moveTo(x-6,y+24);g.lineTo(x+w/2,y-4);g.lineTo(x+w+6,y+24);g.closePath();g.fill();
  g.strokeStyle='#6a6e76';g.lineWidth=1;for(let i=0;i<12;i++){const t=i/11;g.beginPath();g.moveTo(x+w/2,y-4);g.lineTo(x-6+t*(w+12),y+24);g.stroke()}
  R('#4a2c18',dx-14,h-30,28,30);R('#6a4428',dx-12,h-28,11,28);R('#6a4428',dx+1,h-28,11,28);R('#4a2c18',dx-12,h-20,24,1.4);R('#c8a040',dx-1,h-16,2,3);
  R('#e8dcc0',dx-16,26,32,9);ptext(g,'PAIOL',x+dx-10,y+28,'#5a3a22')}
 else{// galpão de alvenaria com telhado em arco
  R('#efe8d8',0,24,w,h-24);R('#d8d0bc',0,h-8,w,8);for(let i=8;i<w;i+=24)R('#e0d8c6',i,26,2,h-34);
  g.fillStyle='#9aa0a8';g.beginPath();g.moveTo(x-5,y+26);g.quadraticCurveTo(x+w/2,y-18,x+w+5,y+26);g.closePath();g.fill();
  g.save();g.beginPath();g.moveTo(x-5,y+26);g.quadraticCurveTo(x+w/2,y-18,x+w+5,y+26);g.closePath();g.clip();for(let i=-4;i<w+6;i+=4)Rr(g,'#b0b6be',x+i,y-10,1,40);g.restore();R('#7a8088',-5,25,w+10,2);
  R('#5a6068',dx-20,h-38,40,38);R('#7a8088',dx-18,h-36,36,36);for(let i=0;i<36;i+=3)R('#6a7078',dx-18+i,h-36,1,36);R('#3a3e46',dx-1,h-36,2,36);R('#c8a040',dx-20,h-40,40,2);
  R('#2f5a3a',dx-24,28,48,10);R('#c8a040',dx-24,28,48,1);ptext(g,'ARMAZEM',x+dx-14,y+30.5,'#f0e0a0');
  for(const wx of[10,w-26]){R('#3a4048',wx,34,16,8);R('#6a8ab0',wx+1,35,14,6);R('#3a4048',wx+7.5,35,1,6)}
  if(v>=2){R('#d8dce4',w-24,h-30,18,16);R('#9aa0a8',w-22,h-28,14,12);for(let i=0;i<5;i++)R('#6a7078',w-21,h-27+i*2.4,12,1);R('#3a6ab0',w-12,h-16,3,2);ptext(g,'FRIO',x+w-23,y+h-37,'#2a4a7a')}
  R('#8a7a5a',-4,h-6,dx-24,6);R('#a89a7a',-4,h-6,dx-24,1.4)}
 // sacas na porta (mais sacas quanto mais cheio)
 const fill=S&&S.inv?Math.min(1,armCount()/armCap()):0,ns=Math.round(fill*9);for(let i=0;i<ns;i++){const sx=dx+(i%2?22:-30)+((i>>1)%3)*4.5,sy=h-6-Math.floor(i/6)*4;R('#e0cc90',sx,sy,6,4.4);R('#c8b070',sx,sy+3,6,1.4);R('#8a6a3a',sx+2,sy,2,1)}};
// ---------- por dentro: pilhas que crescem com o estoque
const ARMZ=[['milho',1,2],['trigo',4,2],['soja',11,2],['cafe',14,2],['mandioca',1,6],['cana',4,6],['tomate',11,6],['ovo',14,6]];
ROOMS.armazem={id:'armazem',x:221,y:RZ+30,w:18,h:12,floor:'conc',wall:'#cfc6b2',trim:'#6a5a3a',win:[],items:[
 ...ARMZ.map(z=>({k:'arm_pilha',c:z[0],x:z[1],y:z[2],w:3,h:2,act:'arm_pilha'})),
 {k:'arm_balcao',x:7,y:4,w:4,h:1,act:'arm_main'},{k:'clerk',x:8,y:3,who:{n:'Comprador Valdir',shirt:'#3a6a3a',hair:'#3a2a1a',pants:'#3a3a2a',hat:'#e8e0c8'},dy:3},
 {k:'arm_balanca',x:5,y:9,w:2,h:1,act:'arm_main'},{k:'arm_empilha',x:13,y:9},{k:'arm_fardo',x:1,y:9,w:2,h:1}],
 wallx:[{k:'arm_logo',x:1},{k:'arm_precos',x:6},{k:'arm_cap',x:13}]};
const ARMLK={milho:['#e8d090','#c8a040'],trigo:['#efe4c4','#a8865a'],soja:['#d8c8a0','#5a8a3a'],cafe:['#a8865a','#2f5a3a'],mandioca:['#c89a6a','#7a4a2a']};
function armSack(g,k,x,y){const c=ARMLK[k]||ARMLK.milho;Rr(g,shade(c[0],-25),x,y+4,7,1.4);Rr(g,c[0],x,y,7,4.6);Rr(g,shade(c[0],18),x+1,y,5,1);Rr(g,c[1],x+2,y+1.6,3,1.6);Rr(g,shade(c[0],-35),x+3,y-1,1,1.4)}
function armStack(g,k,x,y,W,H,q){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 R('rgba(0,0,0,.2)',1,H-3,W,4);R('#8a6a3a',1,H-6,W-2,4);for(let i=3;i<W-2;i+=7)R('#6a4a2a',i,H-6,2,4);
 const n=q<=0?0:clamp(Math.ceil(18*Math.log(1+q)/Math.log(1+Math.max(40,armCap()/4))),1,18),rows=[6,5,4,3];let left=n,ry=0;
 for(let r=0;r<rows.length&&left>0;r++){const m=Math.min(rows[r],left),ox=(W-rows[r]*7)/2+((6-rows[r])*0),yy=H-11-ry;
  for(let i=0;i<m;i++){const sx=x+ox+i*7+(r%2?.0:0),sy=y+yy;
   if(k==='tomate'){Rr(g,'#8a5a2a',sx,sy,6.6,5);Rr(g,'#a8743e',sx,sy,6.6,1.2);for(let j=0;j<3;j++)Rr(g,'#d83a2a',sx+1+j*1.8,sy-1,1.6,1.6)}
   else if(k==='ovo'){Rr(g,'#d8c8a8',sx,sy+1,6.6,4);for(let j=0;j<3;j++)for(let l=0;l<2;l++)Rr(g,'#fff8ec',sx+.6+j*2,sy+1.4+l*1.8,1.4,1.2)}
   else if(k==='cana'){for(let j=0;j<3;j++){Rr(g,j%2?'#b8c860':'#9ab84a',sx-1,sy+j*1.5,8.4,1.3);Rr(g,'#6a7a2a',sx+3,sy+j*1.5,.8,1.3)}}
   else armSack(g,k,sx,sy)}
  left-=m;ry+=4.6}
 R('#e8dcc0',W/2-17,H-1,34,11);R('#6a4a2a',W/2-17,H-1,34,1);const nm=ASHL[k]||ASH[k]||noAcA(ITEMS[k].n.split(' ')[0]).slice(0,8);ptext(g,nm,x+W/2-nm.length*2,y+H+.5,'#3a2a1a');ptext(g,String(q),x+W/2-String(q).length*2,y+H+5.5,q?'#2a6a2a':'#9a8a7a')}
const ASH={milho:'MILHO',mandioca:'MAND.',tomate:'TOMAT',trigo:'TRIGO',soja:'SOJA',cana:'CANA',cafe:'CAFE',ovo:'OVO'},ASHL={mandioca:'MANDIOCA',tomate:'TOMATE',ovo:'OVOS'};
const noAcA=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase();
const _dfArm=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),W=(it.w||1)*TS,H=(it.h||1)*TS,F=frame;
 switch(it.k){
  case 'arm_pilha':{const cold=(it.c==='tomate'||it.c==='ovo')&&(S.up.arm||0)>=2;if(cold){R('rgba(200,225,240,.55)',-2,-4,W+4,H+2);R('#6a9ac0',-2,-5,W+4,1.6);R('#6a9ac0',-2,-5,1.6,H+3);R('#6a9ac0',W+.4,-5,1.6,H+3);ptext(g,'FRIO',x+W/2-8,y-3.5,'#2a4a7a')}armStack(g,it.c,x,y,W,H,S.inv[it.c]||0);return}
  case 'arm_balcao':{R('rgba(0,0,0,.2)',2,H-2,W,4);R('#5a3a22',0,-2,W,H);R('#7a5232',0,-2,W,3);R('#f4f0e4',6,-6,9,5);R('#2a2a2a',W-18,-9,10,7);R('#4a8a4a',W-17,-8,8,4);R('#1a1a1a',W-14,-2,2,1);R('#c8a040',22,-5,6,3);
   R('#2f5a3a',W/2-24,3,48,8);R('#c8a040',W/2-24,3,48,1);ptext(g,'COOPERATIVA',x+W/2-21,y+4.5,'#f0e0a0');break}
  case 'arm_balanca':{R('rgba(0,0,0,.2)',1,H-2,W,3);R('#5a6068',0,4,W,H-6);R('#7a8088',1,4,W-2,2);R('#3a3e46',W-6,-14,4,18);R('#1a1a1a',W-9,-20,10,7);R('#ff5a3a',W-8,-18,8,3);ptext(g,'KG',x+W-7,y-14,'#c8c8c8');break}
  case 'arm_empilha':{const ex=x+2,ey=y+2;Rr(g,'rgba(0,0,0,.25)',ex-1,ey+12,22,4);Rr(g,'#e8b020',ex,ey,16,11);Rr(g,'#c89010',ex,ey+8,16,3);Rr(g,'#2a2a2a',ex+2,ey-8,1.4,9);Rr(g,'#2a2a2a',ex+11,ey-8,1.4,9);Rr(g,'#2a2a2a',ex+2,ey-8,10.4,1.4);Rr(g,'#3a3e46',ex+16,ey-10,2,20);Rr(g,'#8a8e96',ex+17,ey+8,7,1.4);Rr(g,'#1a1a1a',ex+1,ey+10,4,4);Rr(g,'#1a1a1a',ex+11,ey+10,4,4);Rr(g,'#1a1a1a',ex+5,ey-6,4,5);break}
  case 'arm_fardo':{for(let i=0;i<2;i++)for(let j=0;j<2-i;j++){const fx=4+j*12+i*6,fy=H-10-i*7;R('#d8c060',fx,fy,11,7);R('#b8a040',fx,fy+5,11,2);R('#8a6a2a',fx+3,fy,1,7);R('#8a6a2a',fx+7,fy,1,7)}break}
 }
 return _dfArm(g,it,x,y,r)};
const _dwArm=drawWallDeco;drawWallDeco=function(g,wd,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h);
 if(wd.k==='arm_logo'){R('#2f5a3a',2,6,58,14);R('#c8a040',2,6,58,1);R('#c8a040',2,19,58,1);ptext(g,'ARMAZEM',x+17,y+8,'#f0e0a0');ptext(g,noAcA(ARMN[Math.min(3,S.up.arm||0)]).slice(0,14),x+4,y+13.5,'#c8d8b8');return}
 if(wd.k==='arm_precos'){const W=6*TS;R('#0a0a0e',1,1,W-2,29);R('#3a3a42',1,1,W-2,1);const ks=['milho','mandioca','tomate','trigo','soja','cana','cafe','ovo'];
  ks.forEach((k,i)=>{if(!ITEMS[k])return;const col=i>>2,row=i%4,px=x+4+col*46,py=y+3+row*6.6,p=itemPrice(k),a=k==='ovo'?p:avgP(k),up=p>=a*1.04,dn=p<=a*.96;
   ptext(g,ASH[k]||noAcA(ITEMS[k].n).slice(0,5),px,py,'#c8c8d0');const v=p>=10?String(Math.round(p)):String(p.toFixed(1)).replace('.',',');ptext(g,v,px+24,py,up?'#7ad04a':dn?'#ff6a4a':'#ffd060')});return}
 if(wd.k==='arm_cap'){const W=4*TS,f=Math.min(1,armCount()/armCap());R('#3a2a1a',2,5,W-4,18);R('#e8dcc0',3,6,W-6,16);ptext(g,'ESTOQUE',x+6,y+7.5,'#3a2a1a');R('#5a4a3a',5,14,W-10,5);R(f>.9?'#d83a2a':f>.7?'#e0a431':'#4ab04a',5,14,(W-10)*f,5);return}
 return _dwArm(g,wd,x,y)};
// rótulo de cada pilha com quantidade e preço
const _ilArm=interactList;interactList=function(){const L=_ilArm();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r||r.id!=='armazem')return L;
 for(const it of r.items){if(!it.act)continue;const px=(r.x+it.x+(it.w||1)/2)*TS,py=(r.y+it.y+(it.h||1))*TS+4;for(const l of L)if(Math.abs(l.x-px)<1&&Math.abs(l.y-py)<1){
  if(it.act==='arm_pilha'){const k=it.c,q=S.inv[k]||0;l.label=ITEMS[k].ic+' '+ITEMS[k].n.split(' (')[0]+': '+q+' · '+R$(itemPrice(k))+' cada'}else l.label='📦 Comprador da cooperativa: vender a colheita'}}return L};
const _raArm=roomAct;roomAct=function(it,r){if(it.act==='arm_main')return armModal();if(it.act==='arm_pilha')return armItem(it.c);return _raArm(it,r)};
// ---------- telas de venda
function armRows(){return Object.keys(S.inv).filter(k=>armOK(k)&&S.inv[k]>0).sort((a,b)=>itemPrice(b)*S.inv[b]-itemPrice(a)*S.inv[a])}
function armModal(){reModal=armModal;cpxEnsure();const A=ensureArm(),ks=armRows(),tot=ks.reduce((s,k)=>s+itemPrice(k)*S.inv[k],0),f=armCount()/armCap();
 let h='<h3>📦 Armazém da fazenda</h3><div class="card"><div class="row"><b>'+ARMN[Math.min(3,S.up.arm||0)]+'</b><span>'+armCount()+' / '+armCap()+'</span></div>'+bar(f*100,f>.9?'#d83a2a':'#4ab04a')+'<div class="dim">Comprador Valdir, da cooperativa: “Pago o preço do dia. Quem guarda e espera o preço subir ganha mais.” '+(feiraHoje()?'<b class="grn">Hoje é dia de feira: +12%!</b>':'Dia de feira (16) paga 12% a mais.')+'</div></div>';
 h+=ks.length?ks.map(k=>{const it=ITEMS[k],q=S.inv[k],p=itemPrice(k);return '<div class="card"><div class="row"><b>'+it.ic+' '+it.n+' ×'+q+'</b><span class="gold">'+R$(p)+' cada</span></div><div class="row" style="align-items:center">'+(CROPS[k]?sparkP(k):'<span></span>')+'<span style="font-size:13px">'+(CROPS[k]?trendTxt(k):'')+'</span></div><div class="btns">'
  +(q>=10?'<button class="b" data-act="armsell" data-v="'+k+':10">Vender 10 ('+R$(p*10)+')</button>':'')+(q>=4?'<button class="b" data-act="armsell" data-v="'+k+':half">Metade ('+R$(p*Math.floor(q/2))+')</button>':'')+'<button class="b gold" data-act="armsell" data-v="'+k+':all">Tudo ('+R$(p*q)+')</button></div></div>'}).join('')
  +'<div class="btns"><button class="b gold" data-act="armsell" data-v="all">💰 Vender o armazém todo ('+R$(tot)+')</button></div>':'<div class="card dim">Armazém vazio. Plante, colha e junte ovos: tudo vem para cá sozinho.</div>';
 h+='<div class="sec">🌾 PREÇO DE HOJE (por saca/caixa)</div><div class="card" style="font-size:14px">'+Object.keys(CROPS).filter(k=>CROPS[k].lv<=LV()+2).map(k=>'<div class="row"><span>'+CROPS[k].ic+' '+CROPS[k].n+'</span><span>'+R$(itemPrice(k))+' · '+trendTxt(k)+'</span></div>').join('')+'<div class="dim" style="margin-top:4px">Na seca e na entressafra o preço sobe. Cada produto tem a sua época.</div></div>';
 if(has('colh'))h+='<div class="sec">🚜 COLHEITADEIRA</div><div class="card">Quando ela colhe às 17h: <b>'+(A.auto==='guardar'?'guarda no armazém':'vende na hora na cooperativa')+'</b>.<div class="btns"><button class="b" data-act="armauto">'+(A.auto==='guardar'?'Passar a vender na hora':'Passar a guardar no armazém')+'</button></div></div>';
 if((S.up.arm||0)<3)h+='<div class="dim">📈 Amplie o armazém na Casa Agro › Melhorias (até 10.000).</div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function armItem(k){reModal=()=>armItem(k);cpxEnsure();const it=ITEMS[k],q=S.inv[k]||0,p=itemPrice(k),hist=(S.cph&&S.cph[k])||[],best=hist.length?Math.max(...hist):p,worst=hist.length?Math.min(...hist):p;
 showModal('<h3>'+it.ic+' '+it.n+'</h3><div class="card"><div class="row"><span>No armazém</span><b>'+q+'</b></div><div class="row"><span>Preço hoje</span><b class="gold">'+R$(p)+'</b></div>'+(CROPS[k]?'<div class="row"><span>Últimos 30 dias</span>'+sparkP(k)+'</div><div class="row"><span>Mais alto / mais baixo</span><span>'+R$(best)+' / '+R$(worst)+'</span></div><div>'+trendTxt(k)+'</div>':'')+'</div>'
  +(q?'<div class="btns">'+(q>=10?'<button class="b" data-act="armsell" data-v="'+k+':10">Vender 10</button>':'')+(q>=4?'<button class="b" data-act="armsell" data-v="'+k+':half">Vender metade</button>':'')+'<button class="b gold" data-act="armsell" data-v="'+k+':all">Vender tudo ('+R$(p*q)+')</button></div>':'<div class="dim">Nada guardado ainda.</div>')
  +'<div class="btns"><button class="b" data-act="armmain">📦 Ver o armazém todo</button><button class="b gray" data-act="close">Fechar</button></div>')}
ACT.armmain=()=>armModal();
ACT.armauto=()=>{const A=ensureArm();A.auto=A.auto==='guardar'?'vender':'guardar';toast(A.auto==='guardar'?'🚜 A colheitadeira vai guardar a colheita no armazém.':'🚜 A colheitadeira vai vender na hora.','good')};
ACT.armsell=function(e){const A=ensureArm();let t=0,n0=0;const sell=(k,n)=>{n=Math.min(n,S.inv[k]||0);if(n<=0)return;const v=itemPrice(k)*n;takeItem(k,n);t+=v;n0+=n};
 if(e.v==='all')armRows().forEach(k=>sell(k,S.inv[k]));else{const[k,m]=e.v.split(':'),q=S.inv[k]||0;sell(k,m==='all'?q:m==='half'?Math.floor(q/2):+m)}
 if(!t)return;t=Math.round(t);cash(t,'Armazém: venda para a cooperativa');gainXP(t/50,'venda');S.tf.sell=1;A.sold=(A.sold||0)+t;try{ifx('cash',0,5)}catch(err){}toast('💰 Vendeu '+n0+' do armazém por '+R$(t),'good')};
// ---------- colheitadeira: pode guardar em vez de vender
const _caArm=colheitaAuto;colheitaAuto=function(){if(!(S.arm&&S.arm.auto==='guardar'))return _caArm();let n=0,rp=0,cost=0,over=0,ov=0;
 for(const c of S.crops.slice()){if(cropStage(c)<3)continue;const y=cropYield(c),k=c.c,room=Math.max(0,armCap()-armCount()),a=Math.min(room,y);if(a>0)S.inv[k]=(S.inv[k]||0)+a;n+=a;if(y>a){over+=y-a;ov+=itemPrice(k)*(y-a)}
  S.crops.splice(S.crops.indexOf(c),1);CMAP.delete(c.y*MW+c.x);const sd=CROPS[k].seed;if(S.money-cost>=sd&&CROPS[k].lv<=LV()){const nc={x:c.x,y:c.y,c:k,age:0,w:0};S.crops.push(nc);CMAP.set(c.y*MW+c.x,nc);cost+=sd;rp++}}
 if(!n&&!over)return;const diesel=Math.round((n+over)*4);if(ov)cash(Math.round(ov),'Cooperativa: sobra da colheita (armazém cheio)');cash(-cost-diesel,'Replantio e diesel');gainXP((n+over)*2,'colheita');
 toast('🌾 A colheitadeira guardou '+n+' no armazém'+(over?' e vendeu '+over+' que não couberam':'')+(rp?' · '+rp+' canteiros replantados':''),'good')};
// ---------- inventário (☰): mochila separada do armazém
const _pInvArm=pInv;pInv=function(){let h=_pInvArm();const bc=bagCount(),cap=invCap();
 h=h.replace(/<b>🎒 Inventário<\/b><span>[^<]*<\/span>/,'<b>🎒 Mochila</b><span>'+bc+' / '+cap+'</span>').replace(/width:\s*[\d.]+%/,'width:'+Math.min(100,bc/cap*100)+'%').replace('Venda produtos na caixa de venda (ao lado da casa) ou na padaria.','A colheita e os ovos ficam no 📦 armazém da fazenda (atrás da casa).');
 return h.replace('<div class="sec">COLHEITA</div>','<div class="sec">📦 NO ARMAZÉM DA FAZENDA · '+armCount()+' / '+armCap()+'</div>')};
// ---------- celular: preço da colheita no app de cotações
const _cfArm=celFrame;celFrame=function(t,b,back){if(t==='Cotações'){cpxEnsure();const mk='<div style="font:11px sans-serif;color:#8a7a6a;margin-top:6px">',rows='<div style="font:bold 12px sans-serif;margin:8px 0 2px">🌾 Sua colheita (preço da cooperativa)</div>'+Object.keys(CROPS).filter(k=>CROPS[k].lv<=LV()+2).map(k=>{const p=itemPrice(k),a=avgP(k),d=Math.round((p/a-1)*100);return '<div style="display:flex;justify-content:space-between;align-items:center;font:13px sans-serif;padding:3px 2px"><span>'+CROPS[k].ic+' '+CROPS[k].n+(S.inv[k]?' <span style="color:#8a7a6a">('+S.inv[k]+' guardados)</span>':'')+'</span><b>'+R$(p)+' <span style="font-size:11px;color:'+(d>=0?'#1a9a4a':'#c83a2a')+'">'+(d>=0?'+':'')+d+'%</span></b></div>'}).join('');
 b=b.includes(mk)?b.replace(mk,rows+mk):b+rows}return _cfArm(t,b,back)};
// ---------- mapa e guia
const _mmArm=mapModal;mapModal=function(){_mmArm.apply(this,arguments);const cv=document.getElementById('wmapc'),b=armB();if(!cv||!b)return;const g=cv.getContext('2d'),s=4;g.textAlign='center';g.font='bold 12px monospace';g.lineWidth=3;g.strokeStyle='rgba(0,0,0,.8)';g.strokeText('ARMAZEM',(b.x+b.w/2)*s,(b.y-.5)*s);g.fillStyle='#ffd75e';g.fillText('ARMAZEM',(b.x+b.w/2)*s,(b.y-.5)*s)};
if(typeof GUIDE!=='undefined')GUIDE.push({lv:1,ic:'📦',t:'Armazém da fazenda',h:'Fica atrás da casa. Tudo que você colhe (e os ovos) vai para lá sozinho. Cada produto tem o preço do dia: veja a tendência e venda quando estiver acima da média. Na seca/entressafra e no dia de feira (16) paga mais. Amplie na Casa Agro › Melhorias: 300 → 1.000 → 3.000 → 10.000.'});
// ---------- segurança: se a posição do jogador ficar inválida, volta para a porta de casa (evita tela travada)
const _updSafe=update;update=function(dt){_updSafe(dt);if(S&&P&&(!isFinite(P.x)||!isFinite(P.y))){const b=BLD.find(q=>q.id==='house')||BLD[0];P.x=b.door*TS+8;P.y=(b.y+b.h)*TS+12;P.vx=P.vy=0;RET=null;camInit=0}};
