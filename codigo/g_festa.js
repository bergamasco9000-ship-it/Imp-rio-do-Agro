// ===== Festas da vila, Parque de Exposições (arena), rodeio, prova do laço, julgamento de gado, troféus =====
const FESTAS={
 junina:{n:'Festa Junina',ic:'🔥',m:5,d:[24],deco:18,pl:'praca',desc:'Pescaria, argola, comidas típicas, correio elegante, fogueira e quadrilha à noite. Fogos às 21h.'},
 quermesse:{n:'Quermesse da Igreja',ic:'⛪',m:8,d:[12],deco:9,pl:'praca',desc:'Bingo, leilão de prendas para a igreja, argola e comidas.'},
 peao:{n:'Festa do Peão',ic:'🤠',m:7,d:[20,21,22],deco:14,pl:'arena',desc:'3 dias na Arena: rodeio valendo o triplo, prova do laço, grande julgamento de gado, roda-gigante e baile à noite.'},
 natal:{n:'Natal na Praça',ic:'🎄',m:11,d:[24,25],deco:1,pl:'praca',desc:'Árvore na praça, troca de presentes com os moradores e ceia.'},
 reveillon:{n:'Réveillon',ic:'🎆',m:11,d:[30],deco:26,pl:'praca',desc:'Queima de fogos à meia-noite na praça.'}
};
const fDom=()=>S.day%30+1;
const festaOn=k=>{const f=FESTAS[k];return curMon()===f.m&&f.d.includes(fDom())};
const festaDeco=k=>{const f=FESTAS[k];return curMon()===f.m&&fDom()>=f.deco&&fDom()<=f.d[f.d.length-1]};
function festaHoje(){for(const k in FESTAS)if(festaOn(k))return k;return null}
const rodeoDay=()=>fDom()===25||festaOn('peao');
const arenaOn=()=>rodeoDay()||!!S.expo;
const PRACA={x:121*TS+8,y:57*TS+4};
const ARC={x:111.5*TS+8,y:72*TS+8};
function festaArea(){const k=festaHoje(),h=S.t*24;if(h<8||h>23)return null;if(k)return FESTAS[k].pl==='arena'?{x:ARC.x,y:66*TS+10,r:110}:{x:PRACA.x,y:PRACA.y+6,r:150};if(arenaOn())return{x:ARC.x,y:66*TS+10,r:100};return null}
for(const k in FESTAS){const f=FESTAS[k];EVENTS.push({k:'f_'+k,ic:f.ic,n:f.n,is:d=>mon(d)===f.m&&f.d.includes(dom(d)),d:f.desc})}
EVENTS.forEach(e=>{if(e.k==='rodeio'){e.n='Rodeio e Prova do Laço';e.d='Na Arena (ao sul da vila): monte no touro e dispute o laço.'}if(e.k==='expo')e.d='5 dias. Julgamento de gado na Arena (touro, vaca e novilho).'});
ITEMS.pelucia={n:'Bicho de pelúcia',ic:'🧸',cat:'prod',p:30};LIKES.bisc.push('pelucia');LIKES.lourdes.push('pelucia');
const ensureF=()=>{if(!S.fe)S.fe={trof:[],dance:-1,correio:{},prendas:{},natal:{},laco:-1,jud:-1,eat:{},wish:-1};return S.fe};
function addTrof(ic,n){const F=ensureF();F.trof.unshift({ic,n,d:S.day});if(F.trof.length>40)F.trof.pop();toast('🏆 Troféu para a estante: '+n,'good')}
// ---------- barracas por festa (x,y em tiles; base da barraca na linha y)
const STALLS={
 junina:[{x:111.5,y:60,k:'pescaria',n:'PESCARIA',c:'#d83a2a'},{x:115,y:60,k:'argola',n:'ARGOLA',c:'#3a7ac8'},{x:125,y:60,k:'comida',n:'COMIDAS',c:'#e0a431'},{x:128.5,y:60,k:'correio',n:'CORREIO',c:'#d85a9a'}],
 quermesse:[{x:111.5,y:60,k:'bingo',n:'BINGO',c:'#3a9a4a'},{x:115,y:60,k:'prendas',n:'PRENDAS',c:'#8a4ac8'},{x:125,y:60,k:'comida',n:'COMIDAS',c:'#e0a431'},{x:128.5,y:60,k:'argola',n:'ARGOLA',c:'#3a7ac8'}],
 natal:[{x:125,y:60,k:'ceia',n:'CEIA',c:'#c8302a'},{x:111.5,y:60,k:'comida',n:'DOCES',c:'#3a8a3a'}],
 peao:[{x:128,y:69,k:'comida',n:'CHURRASCO',c:'#c8302a'},{x:131.5,y:69,k:'argola',n:'TIRO AO ALVO',c:'#3a7ac8'},{x:135,y:69,k:'pescaria',n:'PESCARIA',c:'#e0a431'}]
};
let STON=null;
function stallsNow(){if(festaDeco('junina'))return'junina';if(festaDeco('quermesse'))return'quermesse';if(festaDeco('natal')||festaDeco('reveillon'))return'natal';if(festaDeco('peao'))return'peao';return null}
function syncStalls(){const k=stallsNow();if(k===STON)return;
 const set=(key,v)=>{if(!key)return;for(const s of STALLS[key])for(let x=Math.floor(s.x);x<Math.floor(s.x)+3;x++)SOL[ti(x,s.y)]=v;if(key!=='peao'){SOL[ti(79,50)]=v;SOL[ti(80,50)]=v}};
 set(STON,0);STON=k;set(k,1);
 const pt=Math.floor(P.x/TS),pty=Math.floor((P.y-2)/TS);if(SOL[ti(pt,pty)])P.y+=TS;
}
// ---------- público (multidão decorativa)
const CROWD=[];let CRD=-1;
const CROWC=['#c83a2a','#3a7ac8','#e0a431','#3a9a4a','#8a4ac8','#e85a9a','#f0f0f0','#5a3a22','#2a6a7a'];
function buildCrowd(){CRD=S.day*10+(STON?1:0);CROWD.length=0;const k=festaHoje();if(!k&&!arenaOn())return;
 const pl=k?FESTAS[k].pl:'arena',n=pl==='arena'?12:16;
 for(let i=0;i<n;i++){const h=hs(i*7+S.day,i*13);const o={i,shirt:CROWC[(h*97|0)%CROWC.length],hair:['#222','#5a3a22','#8a7a5a','#ddd','#7a3a1a'][(h*53|0)%5],skin:['#e8b890','#c88a60','#a86a40','#e0b090'][(h*31|0)%4],g:h<.5?'f':'m',hat:h>.6?['#d8c080','#3a2a1a','#f0f0f0'][(h*11|0)%3]:null,ph:0,dir:0,kid:h>.88};
  if(pl==='arena'){o.x=ARC.x+(i%2?1:-1)*rnd(90,150);o.y=66*TS+rnd(4,14)+(i>8?60:0);if(i>8){o.x=(127+rnd(0,9))*TS;o.y=rnd(66,70)*TS+10}}
  else{o.x=(62+h*30)*TS;o.y=(49+((h*7)%3))*TS+8;o.dz=i<8;o.a=i/8*Math.PI*2}
  o.bx=o.x;o.by=o.y;CROWD.push(o)}
}
function stepCrowd(dt){const k=festaHoje(),h=S.t*24,dance=k==='junina'&&h>=18.5;
 for(const o of CROWD){if(dance&&o.dz){o.a+=dt*.55;const r=34;const nx=PRACA.x+Math.cos(o.a)*r,ny=PRACA.y+6+Math.sin(o.a)*r*.45;o.mv=1;o.dir=Math.abs(nx-o.x)>Math.abs(ny-o.y)?(nx>o.x?3:2):(ny>o.y?0:1);o.ph+=dt*9;o.x=nx;o.y=ny}
  else{o.mv=0;if(o.dz&&(Math.abs(o.x-o.bx)>1||Math.abs(o.y-o.by)>1)){o.x+=(o.bx-o.x)*Math.min(1,dt*2);o.y+=(o.by-o.y)*Math.min(1,dt*2)}o.dir=o.x<PRACA.x?3:2}}
}
const crowdVisible=()=>{const h=S.t*24;return h>=8&&h<23.6&&(festaHoje()||arenaOn())};
// ---------- desenho: barracas, fogueira, árvore, bandeirinhas, arena, roda-gigante
function drawStall(g,s){const x=s.x*TS,y=(s.y+1)*TS-2,w=46;
 Rr(g,'rgba(0,0,0,.25)',x,y-1,w,4);Rr(g,'#6a4428',x+2,y-22,2,22);Rr(g,'#6a4428',x+w-4,y-22,2,22);
 Rr(g,'#8a5a32',x+1,y-9,w-2,8);Rr(g,'#a87a48',x+1,y-9,w-2,2);Rr(g,'#5a3a22',x+1,y-2,w-2,1.5);
 const c=s.c;for(let i=0;i<w;i+=6){Rr(g,i%12?c:'#f4f0e0',x+i,y-28,6,7);Rr(g,i%12?shade(c,-25):'#d8d0c0',x+i,y-21,6,2);Rr(g,i%12?c:'#f4f0e0',x+i+1,y-19,4,2)}
 Rr(g,shade(c,-40),x-1,y-29,w+2,1.5);
 // mercadoria
 if(s.k==='comida'||s.k==='ceia'){for(let i=0;i<5;i++){Rr(g,'#f0e0c0',x+5+i*8,y-12,6,3);Rr(g,['#e0c040','#a8502a','#f0f0e0','#c8402a','#7a4a2a'][i],x+6+i*8,y-14,4,3)}if((frame>>4)&1)Rr(g,'rgba(240,240,240,.4)',x+12,y-20-((frame>>2)%5),2,2)}
 else if(s.k==='pescaria'){Rr(g,'#3a7ac8',x+6,y-14,34,6);for(let i=0;i<4;i++){const fx=x+8+((frame*.25+i*9)%30);Rr(g,['#ffd75e','#e85a9a','#5ac04a','#ff8a2a'][i],fx,y-13,4,2)}}
 else if(s.k==='argola'){for(let i=0;i<4;i++){Rr(g,'#f0e0c0',x+7+i*9,y-17,2,8);Rr(g,['#e83a3a','#3a7ac8','#ffd75e','#5ac04a'][i],x+5+i*9,y-12,6,1.5)}}
 else if(s.k==='correio'){for(let i=0;i<4;i++){Rr(g,'#f4f0f4',x+6+i*9,y-14,7,5);Rr(g,'#e85a9a',x+9+i*9,y-13,2,2)}}
 else if(s.k==='bingo'){Rr(g,'#f4f0e0',x+8,y-17,30,8);for(let i=0;i<9;i++)Rr(g,i%3?'#3a9a4a':'#c8302a',x+10+(i%5)*5,y-16+(i/5|0)*4,3,2)}
 else if(s.k==='prendas'){for(let i=0;i<4;i++){Rr(g,['#c8302a','#3a7ac8','#e0a431','#8a4ac8'][i],x+6+i*9,y-15,7,6);Rr(g,'#ffd75e',x+9+i*9,y-15,1,6)}}
 const tw=ptw(s.n);Rr(g,'#1e140c',x+w/2-tw/2-2,y-36,tw+4,8);ptext(g,s.n,x+w/2-tw/2,y-34.5,'#ffd75e');
}
function flameT(g,x,by,w,h,ph){for(let r=0;r<h;r++){const f=r/h,ww=w*Math.pow(1-f,.75),off=Math.sin(ph+f*4)*f*1.6;if(ww<.4)break;Rr(g,f<.25?'#c8301a':f<.6?'#ff7a1a':'#ffb030',x-ww/2+off,by-r-1,ww,1);if(ww>1.6&&f<.7)Rr(g,f<.4?'#ffd75e':'#fff0a0',x-ww*.28+off,by-r-1,ww*.56,1)}}
function drawBonfire(g){const x=PRACA.x,y=PRACA.y+2,h=S.t*24,lit=h>=17||h<1;
 Rr(g,'rgba(0,0,0,.3)',x-14,y-2,28,5);for(let i=0;i<6;i++){const a=i/6*Math.PI;Rr(g,'#6a4428',x-12+i*4,y-4-Math.sin(a)*3,4,4);Rr(g,'#4a2e1a',x-12+i*4,y-1-Math.sin(a)*3,4,1)}
 for(let i=0;i<7;i++){const a=-1.2+i*.4;Rr(g,i%2?'#7a5232':'#5a3a22',x+Math.sin(a)*7-1,y-6-Math.cos(a)*9,2.4,9)}
 if(lit){Rr(g,'rgba(255,140,40,.25)',x-11,y-8,22,6);for(let j=0;j<5;j++){const fx=x-8+j*4,hh=12+Math.sin(frame*.37+j*1.7)*3+(j===2?8:j===1||j===3?4:0);flameT(g,fx,y-4,6,hh,frame*.25+j)}
  for(let j=0;j<4;j++){const t=(frame*.6+j*17)%60;Rr(g,t<30?'#ffd75e':'#ff8a2a',x-3+Math.sin(j*3+t*.12)*7,y-20-t*.7,1,1)}}
 else{Rr(g,'#3a3a3a',x-6,y-8,12,3)}
}
function drawXmas(g){const x=PRACA.x,y=PRACA.y+3;
 Rr(g,'rgba(0,0,0,.3)',x-16,y-2,32,5);Rr(g,'#5a3a22',x-2,y-8,4,8);Rr(g,'#a83a2a',x-6,y-5,12,5);
 for(let r=0;r<5;r++){const w=30-r*6,yy=y-12-r*9;Rr(g,'#1e5a2a',x-w/2,yy-1,w,11);Rr(g,'#2a7a3a',x-w/2+2,yy-1,w-4,4);Rr(g,'#174a22',x-w/2,yy+8,w,2)}
 const cols=['#ff4a4a','#ffd75e','#4ac0ff','#ff8ae0','#8aff8a'];for(let i=0;i<18;i++){const a=hs(i,3),b=hs(3,i),r=Math.floor(b*5),w=30-r*6;const on=((frame>>4)+i)%3!==0;if(on)Rr(g,cols[i%5],x-w/2+2+a*(w-4),y-12-r*9+2+((i*7)%6),1.5,1.5)}
 Rr(g,'#ffd75e',x-2,y-62,4,4);Rr(g,'#fff4a0',x-1,y-64,2,8);Rr(g,'#fff4a0',x-4,y-61,8,2);
 [[-14,'#c8302a'],[-6,'#3a7ac8'],[8,'#e0a431'],[13,'#8a4ac8']].forEach(([dx,c])=>{Rr(g,c,x+dx,y-5,6,5);Rr(g,'#ffd75e',x+dx+2.5,y-5,1,5)});
}
const FLAGC=['#e83a3a','#ffd75e','#3a7ac8','#5ac04a','#f08ab0','#ff8a2a'];
function drawPole(g,x,y){Rr(g,'rgba(0,0,0,.25)',x-2,y-1,5,2);Rr(g,'#6a4428',x-1,y-30,2,30);Rr(g,'#8a5a32',x-1,y-30,1,30)}
const POLES=[111,116,121,126,131].map(x=>({x:x*TS+8,y:54*TS+10})).concat([111,116,121,126,131].map(x=>({x:x*TS+8,y:60*TS+10})));
function drawBunting(g){const h=S.t*24;
 const line=(x0,y0,x1,y1,sag)=>{const n=Math.max(4,Math.round((x1-x0)/6));for(let i=0;i<n;i++){const t=i/n,t2=(i+.5)/n,xx=x0+(x1-x0)*t,yy=y0+(y1-y0)*t+Math.sin(t*Math.PI)*sag,yy2=y0+(y1-y0)*t2+Math.sin(t2*Math.PI)*sag,sw=Math.sin(frame/20+i)*.6;
  Rr(g,'#3a2a1a',xx,yy,(x1-x0)/n+.5,.6);const c=FLAGC[i%FLAGC.length];Rr(g,c,xx+1,yy2+.5,3,2);Rr(g,c,xx+1.5+sw*.3,yy2+2.5,2,1.5);Rr(g,c,xx+2+sw*.5,yy2+4,1,1)}};
 for(let k=0;k<4;k++){line(POLES[k].x,POLES[k].y-29,POLES[k+1].x,POLES[k+1].y-29,8);line(POLES[k+5].x,POLES[k+5].y-29,POLES[k+6].x,POLES[k+6].y-29,8)}
 for(let k=0;k<5;k+=2)line(POLES[k].x,POLES[k].y-29,POLES[k+5].x,POLES[k+5].y-29,14);
 if(h>=18||h<1)for(const p of POLES){Rr(g,'#fff4a0',p.x-1.5,p.y-31,3,3)}
}
function drawArenaFenceH(g,y,top){const A=ARN;for(let x=A.rx0;x<=A.rx1;x++){if(top&&x>=A.gx0&&x<=A.gx1)continue;const px=x*TS,py=y*TS;
 Rr(g,'rgba(0,0,0,.2)',px,py+13,16,3);Rr(g,'#5a3a22',px+1,py,3,15);Rr(g,'#7a5232',px+1,py,1,15);Rr(g,'#a87a48',px,py+3,16,2.2);Rr(g,'#a87a48',px,py+8,16,2.2);Rr(g,'#7a5232',px,py+5,16,.8);Rr(g,'#7a5232',px,py+10,16,.8);if(x===A.rx1)Rr(g,'#5a3a22',px+12,py,3,15)}
 if(top){Rr(g,'#5a3a22',A.gx0*TS-2,y*TS-4,3,19);Rr(g,'#5a3a22',(A.gx1+1)*TS-1,y*TS-4,3,19)}}
function drawArenaFenceV(g,x,y){const px=x*TS+5,py=y*TS;Rr(g,'#5a3a22',px+1,py-2,3,16);Rr(g,'#7a5232',px+1,py-2,1,16);Rr(g,'#a87a48',px,py,6,TS);Rr(g,'#8a5a32',px+2.5,py,1,TS)}
function drawBleacher(g,left,act){const x0=(left?103:118)*TS,y0=69*TS-6,w=48,h=7*TS+12;
 Rr(g,'rgba(0,0,0,.28)',x0-2,y0+h-2,w+4,5);Rr(g,'#5a3a22',x0,y0,w,h);
 for(let s=0;s<3;s++){const sx=left?x0+s*16:x0+w-16-s*16,lift=(2-s)*0;Rr(g,s%2?'#8a5a32':'#a87a48',sx+1,y0+2-lift,14,h-6);Rr(g,'#c89a5a',sx+1,y0+2,14,1.5);for(let yy=0;yy<h-8;yy+=16)Rr(g,'#5a3a22',sx+1,y0+12+yy,14,1)}
 Rr(g,'#3a2414',left?x0:x0+w-3,y0-10,3,h+10);
 if(act){const hr=S.t*24;if(hr>=8&&hr<23.6)for(let s=0;s<3;s++)for(let j=0;j<7;j++){const hh=hs(s*11+(left?0:5),j*7);if(hh<.25)continue;const sx=(left?x0+s*16:x0+w-16-s*16)+3+hh*8,sy=y0+6+j*15+Math.sin(frame*.15+hh*20)*(rodeoLive()?1.4:.4);
  Rr(g,CROWC[(hh*99|0)%9],sx-2.5,sy+2,5,5);Rr(g,['#e8b890','#c88a60','#a86a40'][(hh*37|0)%3],sx-2,sy-2,4,4);Rr(g,hh>.6?'#d8c080':'#222',sx-2.5,sy-3,5,1.5)}}
}
const rodeoLive=()=>RD.on||(typeof LCO!=='undefined'&&LCO.on);
function drawBooth(g){const x=106*TS,y=69*TS-1;
 Rr(g,'rgba(0,0,0,.28)',x-1,y-2,34,4);Rr(g,'#5a3a22',x+2,y-14,3,14);Rr(g,'#5a3a22',x+27,y-14,3,14);Rr(g,'#8a5a32',x,y-30,32,17);Rr(g,'#a87a48',x,y-30,32,2);
 Rr(g,'#2a1c12',x+4,y-27,24,7);Rr(g,'#7ab0d8',x+5,y-26,22,5);Rr(g,'#c8302a',x-2,y-36,36,7);Rr(g,'#a8201a',x-2,y-30,36,1.5);
 Rr(g,'#888',x+30,y-40,6,4);Rr(g,'#aaa',x+34,y-41,3,6);Rr(g,'#888',x-4,y-40,6,4);Rr(g,'#aaa',x-5,y-41,3,6);
 ptext(g,'LOCUTOR',x+16-ptw('LOCUTOR')/2,y-35,'#ffd75e');
 if(arenaOn()&&S.t*24>=8&&S.t*24<23){Rr(g,'#c88a60',x+14,y-25,4,3);Rr(g,'#222',x+13,y-27,6,2)}
}
function drawPortal(g){const x0=110*TS,x1=113*TS+16,y=68*TS-1;
 for(const px of[x0+4,x1-8]){Rr(g,'rgba(0,0,0,.25)',px-2,y-1,8,3);Rr(g,'#5a3a22',px,y-34,5,34);Rr(g,'#7a5232',px,y-34,2,34)}
 Rr(g,'#3a2414',x0,y-40,x1-x0,7);Rr(g,'#8a5a32',x0+1,y-39,x1-x0-2,5);const t='ARENA DA VILA',tw=ptw(t);Rr(g,'#1e140c',(x0+x1)/2-tw/2-2,y-47,tw+4,8);ptext(g,t,(x0+x1)/2-tw/2,y-45.5,'#ffd75e');
 if(arenaOn()){for(let i=0;i<9;i++)Rr(g,FLAGC[i%6],x0+3+i*7,y-33+Math.sin(i)*.5,4,3)}
}
function drawChute(g){const x=115*TS,y=70*TS;
 Rr(g,'#5a3a22',x,y,2,16);Rr(g,'#5a3a22',x+30,y,2,16);Rr(g,'#a87a48',x,y+2,32,2);Rr(g,'#a87a48',x,y+8,32,2);
 if(rodeoDay()&&!RD.on){const bx=x+15,by=y+13,b=Math.sin(frame*.12)*.5,c='#3a2e28',d='#2a201c';
  Rr(g,'rgba(0,0,0,.3)',bx-11,by-1,24,3);Rr(g,d,bx-8,by-5,2,5);Rr(g,d,bx-4,by-5,2,5);Rr(g,d,bx+4,by-5,2,5);Rr(g,d,bx+8,by-5,2,5);
  Rr(g,c,bx-10,by-13+b,20,9);Rr(g,'#4a3a32',bx-9,by-13+b,18,2);Rr(g,c,bx+2,by-16+b,7,4);Rr(g,'#e8dcc0',bx-11,by-11+b,1,4);
  Rr(g,c,bx+9,by-14+b,6,6);Rr(g,'#5a4a42',bx+13,by-11+b,2,2);Rr(g,'#f0ecd8',bx+9,by-16+b,1,2);Rr(g,'#f0ecd8',bx+14,by-16+b,2,1);Rr(g,'#f0ecd8',bx+15,by-17+b,1,2);Rr(g,'#111',bx+12,by-12+b,1,1);
  Rr(g,'#c8302a',bx-3,by-14+b,8,1);}
 Rr(g,'#a87a48',x,y+5,32,2);
}
function drawArLight(g,x,y){Rr(g,'rgba(0,0,0,.25)',x-2,y-1,5,2);Rr(g,'#555',x-1,y-44,2,44);Rr(g,'#333',x-5,y-46,10,3);const on=S.t*24>=17.5||S.t*24<5;Rr(g,on?'#fff8c0':'#aaa',x-4,y-44,8,2)}
const ARLIGHTS=[[65.6,69.2],[77.4,69.2],[65.6,76.6],[77.4,76.6]].map(([x,y])=>({x:x*TS,y:y*TS}));
function drawWheel(g){const cx=125.5*TS,cy=71*TS-48,R=40,live=festaOn('peao')||rodeoDay(),ang=live?frame*.006:0,night=S.t*24>=17.5||S.t*24<5;
 Rr(g,'rgba(0,0,0,.25)',cx-26,71*TS+12,52,5);
 for(const s of[-1,1]){for(let i=0;i<56;i++){const t=i/56;Rr(g,'#7a7e84',cx+s*(4+t*22),cy+t*58,2,2)}}
 Rr(g,'#5a5e64',cx-28,71*TS+10,56,4);
 g.save();g.translate(cx,cy);g.rotate(ang);g.strokeStyle='#c8c8d0';g.lineWidth=1.2;g.beginPath();g.arc(0,0,R,0,Math.PI*2);g.stroke();g.beginPath();g.arc(0,0,R-6,0,Math.PI*2);g.stroke();
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*R,Math.sin(a)*R);g.stroke();if(night&&live){g.fillStyle=FLAGC[(i+((frame>>4)&7))%6];g.fillRect(Math.cos(a)*R-1.5,Math.sin(a)*R-1.5,3,3)}}
 g.restore();Rr(g,'#e0a431',cx-3,cy-3,6,6);
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2+ang,gx=cx+Math.cos(a)*R,gy=cy+Math.sin(a)*R;Rr(g,'#555',gx-.5,gy,1,4);Rr(g,FLAGC[i%6],gx-5,gy+4,10,7);Rr(g,shade(FLAGC[i%6],-30),gx-5,gy+10,10,1.5);Rr(g,'#f4f0e0',gx-4,gy+5,8,2)}
}
function drawCrowdP(g,o){drawPerson(g,{x:o.x,y:o.y,dir:o.dir,ph:o.ph,mv:o.mv,shirt:o.shirt,hair:o.hair,hat:o.hat,g:o.g,skin:o.skin})}
const _evoFe=evoItems;
evoItems=function(L,x0,x1,y0,y1){_evoFe(L,x0,x1,y0,y1);if(inRoom())return;
 const vis=(x,y,m)=>x>x0-(m||60)&&x<x1+(m||60)&&y>y0-20&&y<y1+80;
 // arena (permanente)
 if(vis(ARN.x0*TS,ARN.y0*TS,400)&&vis(116*TS,72*TS,260)){const A=ARN,act=arenaOn()||festaOn('peao');
  L.push([A.ry0*TS+14,10,{draw:g=>drawArenaFenceH(g,A.ry0,1)}]);L.push([A.ry1*TS+14,10,{draw:g=>drawArenaFenceH(g,A.ry1,0)}]);
  for(let y=A.ry0+1;y<A.ry1;y++){L.push([y*TS+15,10,{draw:g=>drawArenaFenceV(g,A.rx0,y)}]);L.push([y*TS+15,10,{draw:g=>drawArenaFenceV(g,A.rx1,y)}])}
  L.push([76*TS+5,10,{draw:g=>drawBleacher(g,1,act)}]);L.push([76*TS+5,10,{draw:g=>drawBleacher(g,0,act)}]);
  L.push([69*TS-1,10,{draw:drawBooth}]);L.push([68*TS-1,10,{draw:drawPortal}]);L.push([71*TS+2,10,{draw:drawChute}]);
  for(const l of ARLIGHTS)L.push([l.y,10,{draw:g=>drawArLight(g,l.x,l.y)}]);
  L.push([71*TS+15,10,{draw:drawWheel}]);
 }
 const sk=STON;
 if(sk){for(const s of STALLS[sk])if(vis(s.x*TS,s.y*TS))L.push([(s.y+1)*TS-2,10,{draw:g=>drawStall(g,s)}]);
  if(sk!=='peao'&&vis(PRACA.x,PRACA.y,120)){L.push([PRACA.y+3,10,{draw:sk==='natal'?drawXmas:drawBonfire}]);for(const p of POLES)if(vis(p.x,p.y))L.push([p.y,10,{draw:g=>drawPole(g,p.x,p.y)}])}}
 if(crowdVisible()){if(CRD!==S.day*10+(STON?1:0))buildCrowd();for(const o of CROWD)if(vis(o.x,o.y))L.push([o.y,10,{draw:g=>drawCrowdP(g,o)}])}
 {const h=S.t*24;if(festaHoje()&&!npcOut()&&h>=21&&h<23.5)for(const n of NPCS)if(vis(n.x,n.y))L.push([n.y,7,n])}
 if(LCO.on&&LCO.show)L.push([LCO.wy,10,{draw:drawLacoWorld}]);
};
// fogos de artifício
const FW=[];let fwT=0;
function fwTime(){const k=festaHoje(),h=S.t*24;if(k==='junina')return h>=21&&h<22.5;if(k==='peao')return h>=21.5&&h<22.5;if(k==='reveillon')return h>=23.6||h<.3;if(k==='natal'&&fDom()===24)return h>=23.7;return false}
function fwSpot(){const k=festaHoje();return k==='peao'?{x:ARC.x,y:70*TS}:{x:PRACA.x,y:PRACA.y}}
function stepFW(dt){
 if(fwTime()&&!inRoom()){fwT-=dt;if(fwT<=0){fwT=rnd(.5,1.3);const s=fwSpot();FW.push({x:s.x+rnd(-60,60),y:s.y,vy:-rnd(85,120),t:0,c:pick(FLAGC.concat(['#ffffff','#a0f0ff'])),p:null})}}
 for(let i=FW.length-1;i>=0;i--){const f=FW[i];f.t+=dt;
  if(!f.p){f.y+=f.vy*dt;f.vy+=40*dt;if(f.vy>-20||f.t>1.4){f.p=[];const n=22;for(let k=0;k<n;k++){const a=k/n*6.283,v=rnd(28,46);f.p.push({x:f.x,y:f.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v})}f.t=0;try{if(Math.hypot(f.x-P.x,f.y-P.y)<400){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(40,t+.25);gn.gain.setValueAtTime(.05,t);gn.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+.3)}}catch(e){}}}
  else{for(const p of f.p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=22*dt;p.vx*=.98}if(f.t>1.6)FW.splice(i,1)}}
}
const _dpFe=drawPart;
drawPart=function(g){_dpFe(g);if(inRoom())return;
 if(STON&&STON!=='peao')drawBunting(g);
 for(const f of FW){if(!f.p){Rr(g,'#fff4c0',f.x-.5,f.y,1.5,3);Rr(g,'rgba(255,200,120,.5)',f.x-.5,f.y+3,1,4)}else{const a=Math.max(0,1-f.t/1.6);for(const p of f.p){g.globalAlpha=a;Rr(g,f.c,p.x-1,p.y-1,2,2);Rr(g,'#fff',p.x-.5,p.y-.5,1,1)}g.globalAlpha=1}}
};
const _lpFe=lampPos;
lampPos=function(){const L=_lpFe();const h=S.t*24;if(h<17&&h>=5)return L;
 if(STON&&STON!=='peao'){for(const p of POLES)L.push({x:p.x,y:p.y-14});L.push({x:PRACA.x,y:PRACA.y+16})}
 for(const l of ARLIGHTS)L.push({x:l.x,y:l.y-28});
 if(festaOn('peao')||rodeoDay())L.push({x:125.5*TS,y:71*TS-30});
 for(const f of FW)if(f.p&&f.t<.6)L.push({x:f.x,y:f.y+14});
 return L};
// NPCs vão para a festa

let fnpcT=0;
function syncNPCs(){const A=festaArea();for(const n of NPCS){if(A&&!n.kid){if(n.ohx===undefined){n.ohx=n.hx;n.ohy=n.hy;n.hx=A.x+rnd(-A.r*.8,A.r*.8);n.hy=A.y+rnd(-12,14);if(Math.hypot(n.x-n.hx,n.y-n.hy)>260){n.x=n.hx;n.y=n.hy}n.tx=n.hx;n.ty=n.hy}}
 else if(!A&&n.ohx!==undefined){n.hx=n.ohx;n.hy=n.ohy;delete n.ohx;delete n.ohy;n.x=n.hx;n.y=n.hy;n.tx=n.hx;n.ty=n.hy}}}
const _updFe=update;update=function(dt){_updFe(dt);if(!S)return;syncStalls();stepFW(dt);if(crowdVisible())stepCrowd(dt);fnpcT+=dt;if(fnpcT>1){fnpcT=0;syncNPCs()}};
// ---------- MINIGAME de tempo (pescaria, argola, tiro ao alvo)
const TG={on:0,iv:null};
function tgStart(o){Object.assign(TG,{on:1,m:0,dir:1,tries:o.tries||3,hits:0,zc:rnd(.25,.75),w:o.w||.16,spd:o.spd||1.4,o,msg:''});tgRender();clearInterval(TG.iv);TG.iv=setInterval(()=>{if(!$('tgbox')){clearInterval(TG.iv);TG.on=0;return}TG.m+=TG.dir*.05*TG.spd;if(TG.m>=1){TG.m=1;TG.dir=-1}if(TG.m<=0){TG.m=0;TG.dir=1}const e=$('tgm');if(e)e.style.left=(TG.m*100)+'%'},50)}
function tgRender(){const o=TG.o;showModal('<h3>'+o.ic+' '+o.n+'</h3><div class="dim">'+o.d+'</div><div class="card" id="tgbox" style="text-align:center"><div style="font-size:34px">'+o.em+'</div><div>Tentativas: <b>'+TG.tries+'</b> · Acertos: <b class="gold">'+TG.hits+'</b></div><div style="position:relative;height:26px;background:#2a2a2a;border-radius:4px;margin:8px 0;overflow:hidden"><div style="position:absolute;top:0;bottom:0;background:#4a9a3a;left:'+((TG.zc-TG.w/2)*100)+'%;width:'+(TG.w*100)+'%"></div><div id="tgm" style="position:absolute;top:0;bottom:0;width:4px;background:#fff;left:'+(TG.m*100)+'%"></div></div><div class="gold">'+TG.msg+'</div>'
 +(TG.tries>0?'<div class="btns" style="justify-content:center"><button class="b gold" data-act="tghit" style="font-size:20px;padding:12px 28px">'+o.btn+'</button></div>':'')+'</div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>');reModal=null}
function tgEnd(){clearInterval(TG.iv);TG.on=0;const r=TG.o.end(TG.hits);const b=$('tgbox');if(b)b.insertAdjacentHTML('beforeend','<div class="card" style="margin-top:6px">'+r+'</div>')}
Object.assign(ACT,{tghit(){if(!TG.on||TG.tries<=0)return;TG.tries--;if(Math.abs(TG.m-TG.zc)<=TG.w/2){TG.hits++;TG.msg=pick(['Na mosca!','Acertou!','Boa!'])}else TG.msg=pick(['Errou por pouco…','Quase!','Passou longe!']);TG.zc=rnd(.2,.8);TG.w*=.92;TG.spd*=1.08;tgRender();if(TG.tries<=0)tgEnd()}});
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(TG.on&&(k===' '||k==='e')){e.preventDefault();ACT.tghit()}},true);
function playStall(k){const F=ensureF(),pe=festaOn('peao');
 if(!festaHoje())return toast('As barracas abrem no dia da festa','bad');const h=S.t*24;if(h<8)return toast('As barracas abrem às 8h','bad');
 if(k==='pescaria'){if(S.money<20)return toast('Dinheiro insuficiente','bad');cash(-20,'Pescaria da festa');tgStart({ic:'🎣',n:'Pescaria',d:'Fisgue os peixinhos de papelão quando o marcador passar na zona verde. R$ 20 por 3 tentativas.',em:'🐟🎣🐠',btn:'FISGAR!',tries:3,w:.18,spd:1.3,
  end:n=>{if(n>=3){addItem('pelucia',1);cash(300,'Prêmio da pescaria');gainXP(10,'festa');return '🏆 3 de 3! Você ganhou um 🧸 bicho de pelúcia e '+R$(300)+'!'}if(n===2){addItem('pelucia',1);return '🧸 Ganhou um bicho de pelúcia! (dá de presente pra alguém)'}if(n===1){cash(40,'Prêmio da pescaria');return '🍬 Ganhou um saquinho de doces e '+R$(40)+'.'}return '😅 Não pescou nada. Tente de novo!'}})}
 else if(k==='argola'){if(S.money<20)return toast('Dinheiro insuficiente','bad');cash(-20,pe?'Tiro ao alvo':'Argola');tgStart({ic:pe?'🎯':'⭕',n:pe?'Tiro ao alvo':'Jogo da argola',d:pe?'Acerte as latinhas! R$ 20 por 3 tiros.':'Jogue a argola nas garrafas! R$ 20 por 3 argolas.',em:pe?'🥫🥫🥫':'🍾🍾🍾',btn:pe?'ATIRAR!':'JOGAR!',tries:3,w:.15,spd:1.6,
  end:n=>{if(n>=3){addItem('pelucia',1);cash(400,'Prêmio da barraca');gainXP(12,'festa');return '🏆 Gabaritou! Pelúcia 🧸 e '+R$(400)+'!'}if(n===2){addItem('pelucia',1);return '🧸 Ganhou um bicho de pelúcia!'}if(n===1){cash(30,'Prêmio da barraca');return 'Ganhou um prêmio pequeno: '+R$(30)+'.'}return 'Nada desta vez!'}})}
 else if(k==='comida')foodModal();else if(k==='correio')correioModal();else if(k==='bingo')bingoStart();else if(k==='prendas')prendasModal();else if(k==='ceia')ceiaModal();
}
// comidas
const FOODS={junina:[['pamonha','🌽','Pamonha',15,30],['quentao','🍵','Quentão',12,18],['pe','🥜','Pé-de-moleque',8,10],['milho','🌽','Milho cozido',10,20]],quermesse:[['bolo','🍰','Bolo de fubá',10,18],['pastel','🥟','Pastel',12,22],['cuscuz','🍚','Cuscuz',10,20]],peao:[['churras','🍖','Espetinho',18,35],['pastel','🥟','Pastel',12,22],['pipoca','🍿','Pipoca',6,8],['caldo','🍲','Caldo de mocotó',15,30]],natal:[['rabanada','🍞','Rabanada',8,15],['panetone','🍞','Panetone',15,25],['pave','🍮','Pavê',10,18]]};
function foodModal(){const k=festaHoje()==='reveillon'?'natal':(festaHoje()||'junina'),F=ensureF();reModal=foodModal;
 showModal('<h3>🍽️ Barraca de comidas</h3><div class="dim">Comer recupera vida. Vida: '+Math.round(P.hp)+'/100</div>'+(FOODS[k]||FOODS.junina).map(f=>'<div class="card"><div class="row"><b>'+f[1]+' '+f[2]+'</b><span class="gold">'+R$(f[3])+'</span></div><div class="dim">+'+f[4]+' vida</div><div class="btns"><button class="b gold" data-act="feat" data-v="'+f.join('|')+'">Comer</button></div></div>').join('')+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
// correio elegante
function correioModal(){const F=ensureF(),used=F.correio[S.day]||0;reModal=correioModal;
 let h='<h3>💌 Correio elegante</h3><div class="dim">Mande um bilhetinho carinhoso (R$ 5). Aumenta a amizade. '+(3-used)+' bilhete(s) restante(s) hoje.</div>';
 if(S.mate)h+='<div class="card"><div class="row"><b>💕 Para '+S.mate.name+'</b><button class="b gold" data-act="fmail" data-v="mate">Enviar</button></div></div>';
 h+=NPC_IDS.map(id=>{const n=npcById(id);return n?'<div class="card"><div class="row"><b>'+n.n+'</b><span>'+'❤️'.repeat(Math.min(5,Math.ceil(hearts(id)/2)))+'</span><button class="b" data-act="fmail" data-v="'+id+'">Enviar</button></div></div>':''}).join('');
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
// prendas (quermesse)
const PRENDAS=[['🧸','Bicho de pelúcia',60,()=>addItem('pelucia',1)],['☕','Mudas de café (5)',120,()=>addItem('seed_cafe',5)],['🌽','Sementes de milho (20)',80,()=>addItem('seed_milho',20)],['🍰','Bolo da Dona Lourdes',50,()=>{P.hp=Math.min(100,P.hp+40)}],['🎣','Isca especial',70,()=>{addItem('minhoca',5)}],['🐔','Galinha caipira',90,()=>{if(S.chk){S.chk.n=(S.chk.n||0)+1;if(typeof syncCH==='function')syncCH()}else addItem('ovo',12)}]];
function prendasModal(){const F=ensureF(),c=F.prendas[S.day]||0;reModal=prendasModal;
 showModal('<h3>🎁 Leilão de prendas</h3><div class="dim">O dinheiro vai para a reforma da igreja. Cada prenda dá +1 de reputação ('+(3-c)+' restante(s) hoje).</div>'+PRENDAS.map((p,i)=>'<div class="card"><div class="row"><b>'+p[0]+' '+p[1]+'</b><span class="gold">'+R$(p[2])+'</span></div><div class="btns"><button class="b gold" data-act="fprenda" data-v="'+i+'">Arrematar</button></div></div>').join('')+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
// ceia de natal e presentes
function ceiaModal(){const F=ensureF();reModal=null;const done=F.natal.ceia===yearN();
 showModal('<h3>🎄 Ceia de Natal</h3><div class="card">A vila inteira se reúne para a ceia na praça.'+(done?'<br><span class="grn">Você já participou da ceia este ano.</span>':'')+'</div><div class="btns">'+(done?'':'<button class="b gold" data-act="fceia">🍗 Participar da ceia (R$ 100)</button>')+'<button class="b gray" data-act="close">Sair</button></div>')}
function xmasModal(){const F=ensureF();reModal=xmasModal;const y=yearN(),gv=F.natal['g'+y]||{};
 let h='<h3>🎄 Árvore de Natal</h3><div class="dim">'+(festaDeco('natal')?'Troque presentes com os moradores: um presente de Natal vale o triplo de amizade (1 por pessoa).':'')+'</div>';
 const inv=Object.keys(S.inv||{}).filter(k=>S.inv[k]>0&&ITEMS[k]&&ITEMS[k].cat!=='seed').slice(0,8);
 if(!inv.length)h+='<div class="card dim">Você não tem itens para presentear. Traga peixes, colheita, ovos ou um bicho de pelúcia.</div>';
 else h+=NPC_IDS.map(id=>{const n=npcById(id);if(!n)return'';if(gv[id])return '<div class="card"><b>'+n.n+'</b> <span class="grn">✔ presenteado</span></div>';return '<div class="card"><div class="row"><b>'+n.n+'</b><span class="dim">gosta de: '+(LIKES[id]||[]).map(k=>ITEMS[k]?ITEMS[k].ic:'').join('')+'</span></div><div class="btns">'+inv.map(k=>'<button class="b" data-act="fxgift" data-v="'+id+':'+k+'">'+ITEMS[k].ic+'</button>').join('')+'</div></div>'}).join('');
 if(festaOn('reveillon'))h+='<div class="card"><b>🥂 Réveillon</b><div class="dim">À meia-noite tem queima de fogos. Faça um pedido para o ano novo!</div><div class="btns">'+(F.wish===yearN()?'<span class="grn">Pedido feito ✨</span>':'<button class="b gold" data-act="fwish">✨ Fazer um pedido</button>')+'</div></div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ACT,{
 feat(e){const f=e.v.split('|'),c=+f[3];if(S.money<c)return toast('Dinheiro insuficiente','bad');cash(-c,f[2]);P.hp=Math.min(100,P.hp+(+f[4]));gainXP(1,'festa');toast(f[1]+' Hmm, '+f[2].toLowerCase()+' delicioso! +'+f[4]+' vida','good')},
 fmail(e){const F=ensureF(),u=F.correio[S.day]||0;if(u>=3)return toast('Você já mandou 3 bilhetes hoje','bad');if(S.money<5)return toast('Dinheiro insuficiente','bad');cash(-5,'Correio elegante');F.correio={[S.day]:u+1};
  if(e.v==='mate'){S.mate.af=(S.mate.af||0)+10;toast('💕 '+S.mate.name+' leu o bilhete e ficou toda sorridente!','good')}else{addFr(e.v,15);toast('💌 '+npcById(e.v).n+' recebeu seu bilhete!','good')}},
 fprenda(e){const F=ensureF(),c=F.prendas[S.day]||0,p=PRENDAS[+e.v];if(c>=3)return toast('Já arrematou 3 prendas hoje','bad');if(S.money<p[2])return toast('Dinheiro insuficiente','bad');cash(-p[2],'Prenda da quermesse');p[3]();F.prendas={[S.day]:c+1};S.rep=Math.min(100,S.rep+1);toast('🎁 Arrematou: '+p[1]+'! (+1 reputação)','good')},
 fceia(){const F=ensureF();if(F.natal.ceia===yearN())return;if(S.money<100)return toast('Dinheiro insuficiente','bad');cash(-100,'Ceia de Natal');F.natal.ceia=yearN();P.hp=100;S.rep=Math.min(100,S.rep+2);NPC_IDS.forEach(id=>addFr(id,4));if(S.mate)S.mate.af=(S.mate.af||0)+10;gainXP(25,'natal');toast('🎄 Que ceia! Vida cheia, +2 reputação e todos os moradores mais próximos de você.','good');hideModal()},
 fxgift(e){const F=ensureF(),y=yearN(),[id,k]=e.v.split(':');F.natal['g'+y]=F.natal['g'+y]||{};if(F.natal['g'+y][id])return;if(!takeItem(k,1))return;const like=(LIKES[id]||[]).includes(k);F.natal['g'+y][id]=1;addFr(id,like?60:30);toast('🎁 '+npcById(id).n+(like?' AMOU o presente!':' gostou do presente!'),'good')},
 fwish(){const F=ensureF();F.wish=yearN();const r=Math.random();if(r<.4){cash(5000,'Sorte de ano novo');toast('✨ Seu pedido foi ouvido: um cliente antigo pagou uma dívida de '+R$(5000)+'!','good')}else if(r<.7){S.rep=Math.min(100,S.rep+3);toast('✨ Ano novo, vida nova: +3 reputação!','good')}else{gainXP(80,'réveillon');toast('✨ Que venha um ano de muita fartura! (+XP)','good')}}
});
// ---------- BINGO
const BG={on:0,iv:null};
function bingoStart(){if(S.money<50)return toast('Dinheiro insuficiente','bad');cash(-50,'Cartela de bingo');const nums=[];while(nums.length<9){const n=ri(1,30);if(!nums.includes(n))nums.push(n)}
 const riv=[0,1,2].map(()=>{const r=[];while(r.length<9){const n=ri(1,30);if(!r.includes(n))r.push(n)}return r});
 Object.assign(BG,{on:1,card:nums,mk:Array(9).fill(0),riv,drawn:[],last:0,win:null});bgRender();clearInterval(BG.iv);BG.iv=setInterval(bgTick,1200)}
const BGL=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function bgTick(){if(!$('bgbox')){clearInterval(BG.iv);BG.on=0;return}if(BG.win)return;let n;do{n=ri(1,30)}while(BG.drawn.includes(n)&&BG.drawn.length<30);BG.drawn.push(n);BG.last=n;
 for(let r=0;r<3;r++){const c=BG.riv[r];if(BGL.some(l=>l.every(i=>BG.drawn.includes(c[i])&&(BG.drawn.indexOf(c[i])<BG.drawn.length-1||Math.random()<.6)))){BG.win='r'+r;break}}
 if(BG.win){clearInterval(BG.iv);BG.on=0}bgRender()}
function bgRender(){const nm=['Dona Cida','Biscoito','Seu João'];let h='<h3>🎱 Bingo da Quermesse</h3><div class="dim">Marque os números sorteados. Feche uma linha antes dos outros!</div><div class="card" id="bgbox" style="text-align:center"><div style="font-size:15px">Sorteado agora:</div><div style="font-size:40px;color:#ffd75e">'+(BG.last||'—')+'</div><div class="dim" style="font-size:14px">'+BG.drawn.slice(-10).join(' · ')+'</div>'
 +'<div style="display:grid;grid-template-columns:repeat(3,56px);gap:6px;justify-content:center;margin:8px 0">'+BG.card.map((n,i)=>'<button class="b '+(BG.mk[i]?'gold':'')+'" data-act="bgmark" data-v="'+i+'" style="font-size:20px;padding:10px 0">'+n+'</button>').join('')+'</div>';
 if(BG.win==='me')h+='<div class="gold"><b>🎉 BINGO! Você ganhou '+R$(1500)+'!</b></div>';else if(BG.win)h+='<div class="red"><b>'+nm[+BG.win[1]]+' gritou BINGO primeiro!</b></div>';
 showModal(h+'</div><div class="btns">'+(BG.win?'<button class="b gold" data-act="bgagain">Nova cartela (R$ 50)</button>':'')+'<button class="b gray" data-act="close">Sair</button></div>');reModal=null}
Object.assign(ACT,{
 bgmark(e){if(!BG.on||BG.win)return;const i=+e.v;if(!BG.drawn.includes(BG.card[i]))return toast('Esse número ainda não saiu!','bad');BG.mk[i]=1;if(BGL.some(l=>l.every(k=>BG.mk[k]))){BG.win='me';clearInterval(BG.iv);BG.on=0;cash(1500,'Bingo');gainXP(20,'bingo');S.rep=Math.min(100,S.rep+1)}bgRender()},
 bgagain(){bingoStart()}
});
// ---------- RITMO (quadrilha e baile)
const RH={on:0,iv:null};const ARW=['⬅️','⬆️','➡️','⬇️'];
function danceModal(kind){const F=ensureF();reModal=null;const h=S.t*24;
 if(F.dance===S.day)return toast('Você já dançou hoje. Amanhã tem mais!','bad');
 if(h<18.5&&h>=4)return toast(kind==='quadrilha'?'A quadrilha começa às 18h30, em volta da fogueira':'O baile começa às 18h30','bad');
 let o='<h3>'+(kind==='quadrilha'?'💃 Quadrilha':'🎤 Baile do Peão')+'</h3><div class="dim">Escolha seu par. Aperte a seta certa quando o círculo fechar. Dançar bem aproxima vocês!</div>';
 if(S.mate)o+='<div class="card"><div class="row"><b>💕 '+S.mate.name+'</b><button class="b gold" data-act="rhgo" data-v="'+kind+':mate">Dançar</button></div></div>';
 NPC_IDS.filter(id=>!npcById(id).kid&&hearts(id)>=2).slice(0,5).forEach(id=>{o+='<div class="card"><div class="row"><b>'+npcById(id).n+'</b><span>'+'❤️'.repeat(Math.min(5,Math.ceil(hearts(id)/2)))+'</span><button class="b" data-act="rhgo" data-v="'+kind+':'+id+'">Convidar</button></div></div>'});
 o+='<div class="card"><div class="row"><b>🙋 Entrar na roda com a turma</b><button class="b" data-act="rhgo" data-v="'+kind+':turma">Dançar</button></div></div>';
 showModal(o+'<div class="btns"><button class="b gray" data-act="close">Agora não</button></div>')}
function rhStart(kind,who){Object.assign(RH,{on:1,kind,who,beat:0,t:0,seq:Array.from({length:16},()=>ri(0,3)),hit:0,res:Array(16).fill(0),combo:0,best:0,pressed:0});ensureF().dance=S.day;rhRender();clearInterval(RH.iv);RH.iv=setInterval(rhTick,50)}
const RHB=.8,RHT=.6,RHW=.2;
function rhTick(){if(!$('rhbox')){clearInterval(RH.iv);RH.on=0;return}RH.t+=.05;
 if(RH.t>=RHB){if(!RH.pressed){RH.combo=0}RH.beat++;RH.t=0;RH.pressed=0;if(RH.beat>=16)return rhEnd();try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime+RHT,o=AC.createOscillator(),gn=AC.createGain();o.type='square';o.frequency.value=[392,440,494,523][RH.seq[RH.beat]];gn.gain.setValueAtTime(.03,t);gn.gain.exponentialRampToValueAtTime(.0001,t+.15);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+.16)}catch(e){}}
 const r=$('rhring');if(r){const k=Math.max(0,1-RH.t/RHT);r.style.transform='scale('+(1+k*1.6).toFixed(2)+')';r.style.borderColor=Math.abs(RH.t-RHT)<RHW?'#5ac04a':'#e0a431'}}
function rhRender(){const nm=RH.who==='mate'?S.mate.name:RH.who==='turma'?'a turma':npcById(RH.who).n;
 showModal('<h3>'+(RH.kind==='quadrilha'?'💃 Quadrilha':'🎤 Baile')+' com '+nm+'</h3><div class="card" id="rhbox" style="text-align:center"><div>Passo '+Math.min(16,RH.beat+1)+'/16 · Acertos <b class="gold">'+RH.hit+'</b> · Combo '+RH.combo+'</div>'
 +'<div style="position:relative;height:96px;display:flex;align-items:center;justify-content:center"><div id="rhring" style="position:absolute;width:64px;height:64px;border:4px solid #e0a431;border-radius:50%"></div><div style="font-size:40px">'+(RH.beat<16?ARW[RH.seq[RH.beat]]:'🎉')+'</div></div>'
 +'<div class="dim">Próximos: '+RH.seq.slice(RH.beat+1,RH.beat+4).map(i=>ARW[i]).join(' ')+'</div><div class="btns" style="justify-content:center">'+[0,1,3,2].map(i=>'<button class="b" data-act="rhp" data-v="'+i+'" style="font-size:26px;padding:8px 18px">'+ARW[i]+'</button>').join('')+'</div></div><div class="btns"><button class="b gray" data-act="close">Parar</button></div>');reModal=null}
function rhPress(i){if(!RH.on||RH.pressed||RH.beat>=16)return;RH.pressed=1;const ok=i===RH.seq[RH.beat]&&Math.abs(RH.t-RHT)<RHW;if(ok){RH.hit++;RH.combo++;RH.best=Math.max(RH.best,RH.combo)}else RH.combo=0;rhRender()}
function rhEnd(){clearInterval(RH.iv);RH.on=0;const n=RH.hit;let msg='';
 if(RH.who==='mate'){S.mate.af=(S.mate.af||0)+n*2;msg='💕 '+S.mate.name+(n>=12?' adorou dançar com você! Que noite!':n>=7?' se divertiu bastante.':' riu dos seus pisões no pé.')}
 else if(RH.who!=='turma'){addFr(RH.who,Math.round(n*1.6));msg='❤️ '+npcById(RH.who).n+(n>=12?' disse que você é o rei da pista!':' agradeceu a dança.')}
 else msg='🙌 A turma se animou com você!';
 let pr=0;if(n>=14){pr=RH.kind==='quadrilha'?1500:2500;cash(pr,'Concurso de dança');S.rep=Math.min(100,S.rep+1);if(n===16)addTrof('💃','Melhor par da '+(RH.kind==='quadrilha'?'Quadrilha':'Festa do Peão')+' · ano '+yearN())}
 gainXP(5+n,'dança');const b=$('rhbox');if(b)b.innerHTML='<div style="font-size:40px">'+(n>=12?'🌟':n>=7?'🙂':'😅')+'</div><div><b>'+n+'/16 passos certos</b> · melhor combo '+RH.best+'</div><div>'+msg+'</div>'+(pr?'<div class="gold">🏆 Vocês venceram o concurso de dança: '+R$(pr)+'!</div>':'')}
Object.assign(ACT,{rhgo(e){const[k,w]=e.v.split(':');rhStart(k,w)},rhp(e){rhPress(+e.v)}});
addEventListener('keydown',e=>{if(!RH.on)return;const m={arrowleft:0,a:0,arrowup:1,w:1,arrowright:2,d:2,arrowdown:3,s:3}[e.key.toLowerCase()];if(m!==undefined){e.preventDefault();e.stopPropagation();rhPress(m)}},true);
// ---------- RODEIO na arena (mensal e Festa do Peão)
rodeoModal=function(){
 ensureM();reModal=null;const pe=festaOn('peao');
 if(!rodeoDay())return toast('O rodeio acontece todo dia 25 na Arena (e na Festa do Peão em agosto)','bad');
 if(S.ev.rdD===S.day)return toast('Você já montou hoje. Volte no próximo rodeio!');
 RD.big=pe?1:0;
 showModal('<h3>🤠 '+(pe?'Rodeio da Festa do Peão':'Rodeio da Vila')+'</h3><div class="card">Fique 8 segundos em cima do touro! Use <b>⬅️ ➡️</b> (ou A/D) para se equilibrar contra os pinotes.'+(pe?'<br><b class="gold">Festa do Peão: prêmios TRIPLOS e troféu para o campeão!</b> Touro mais bravo.':'')+'<br>Inscrição '+R$(pe?600:200)+'.</div><div id="rdbox" class="card" style="text-align:center"><div style="font-size:40px">🐂</div></div><div class="btns"><button class="b gold" data-act="rdgo2">Montar!</button><button class="b gray" data-act="close">Agora não</button></div>');
};
Object.assign(ACT,{rdgo2(){if(RD.on)return;const fee=RD.big?600:200;if(S.money<fee)return toast('Dinheiro insuficiente','bad');cash(fee-200,'Inscrição rodeio (extra)');ACT.rdgo()}});
const _rdgoFe=ACT.rdgo;
rdEnd=function(ok){
 clearInterval(RD.iv);RD.iv=null;RD.on=0;const t=Math.min(8,RD.t),score=Math.round(t*10+(ok?(1-RD.err/RD.n)*20:0)),big=RD.big;
 const sc=RIV.slice(0,7).map(r=>({n:r[1],s:Math.round(rnd(20,92)+(big?4:0))}));sc.push({n:'Você',s:score,me:1});sc.sort((a,b)=>b.s-a.s);const pos=sc.findIndex(x=>x.me)+1,pr=ok?(([0,8000,4000,2000][pos]||600)*(big?3:1)):0;
 if(pr)cash(pr,'Rodeio');if(ok)gainXP(big?60:30,'rodeio');if(ok&&pos===1){S.ev.rdW=(S.ev.rdW||0)+1;addTrof('🤠',(big?'Campeão do Rodeio da Festa do Peão':'Campeão do Rodeio da Vila')+' · ano '+yearN())}if(!ok){P.hp=Math.max(5,P.hp-12);P.hurt=.7}
 rvRodeo(score);
 const b=$('rdbox');if(b)b.innerHTML='<div style="font-size:40px">'+(ok?'🏆':'💥')+'</div><div>'+(ok?'Você aguentou os 8 segundos!':'O touro te derrubou aos '+t.toFixed(1)+'s (-12 vida)')+'</div><div>Nota '+score+' · '+pos+'º lugar'+(pr?' · '+R$(pr):'')+'</div>'+sc.slice(0,4).map((x,i)=>'<div class="dim" style="font-size:14px">'+(i+1)+'º '+x.n+' — '+x.s+'</div>').join('');
};
// pinote mais bravo na Festa do Peão
ACT.rdgo=function(){_rdgoFe();if(RD.big&&RD.iv){clearInterval(RD.iv);RD.iv=setInterval(()=>{const dt=.05;RD.t+=dt;RD.v+=(gauss()*3.1*(1+RD.t*.14)+RD.x*1.15)*dt+RD.push;RD.push=0;RD.v*=.96;RD.x+=RD.v*dt;RD.n++;RD.err+=Math.abs(RD.x);
 if(Math.abs(RD.x)>=1)return rdEnd(false);if(RD.t>=8)return rdEnd(true);if(!$('rdbox')){clearInterval(RD.iv);RD.on=0;return}rdRender()},50)}};
// ---------- PROVA DO LAÇO
const LCO={on:0,iv:null,show:0,wy:0};
function lacoModal(){const F=ensureF();reModal=null;const pe=festaOn('peao');
 if(!rodeoDay())return toast('A prova do laço é no dia 25 e na Festa do Peão','bad');if(F.laco===S.day)return toast('Você já correu o laço hoje','bad');
 showModal('<h3>🪢 Prova do Laço</h3><div class="card">O bezerro sai do brete correndo e você vai atrás a cavalo.<br>1. Toque em <b>🌀 GIRAR</b> para rodar o laço até a força ficar no <b class="grn">verde</b>.<br>2. Quando estiver <b>perto</b> do bezerro, toque em <b>🪢 LAÇAR!</b><br>Ganha quem laçar mais rápido. Se errar, recolhe a corda e tenta de novo (perde tempo).<br>Inscrição '+R$(pe?450:150)+'.'+(pe?' <b class="gold">Prêmios triplos!</b>':'')+'</div><div id="lcbox" class="card" style="text-align:center"><div style="font-size:36px">🏇🪢🐂</div></div><div class="btns"><button class="b gold" data-act="lcgo">Correr!</button><button class="b gray" data-act="close">Agora não</button></div>')}
function lcRender(){const b=$('lcbox');if(!b)return;const d=LCO.cx-LCO.hx,inR=d>=3&&d<=13,pw=LCO.pw;
 b.innerHTML='<div class="row"><b>⏱️ '+LCO.t.toFixed(1)+'s</b><span class="dim">'+(LCO.rec>0?'recolhendo a corda…':inR?'<b class="grn">PERTO! Pode laçar</b>':d>13?'aproxime-se…':'muito perto')+'</span></div>'
 +'<div style="position:relative;height:44px;background:linear-gradient(#c8a060,#a87a48);border-radius:4px;margin:6px 0;overflow:hidden"><div style="position:absolute;bottom:2px;font-size:28px;left:calc('+Math.min(96,LCO.cx)+'% - 14px);transform:scaleX(-1)">🐂</div><div style="position:absolute;bottom:2px;font-size:30px;left:calc('+Math.min(96,LCO.hx)+'% - 15px);transform:scaleX(-1)">🏇</div></div>'
 +'<div class="dim" style="text-align:left">Força do laço</div><div style="position:relative;height:16px;background:#2a2a2a;border-radius:4px;overflow:hidden"><div style="position:absolute;top:0;bottom:0;left:55%;width:30%;background:#2f6a2a"></div><div style="position:absolute;top:0;bottom:0;left:0;width:'+(pw*100)+'%;background:'+(pw>=.55&&pw<=.85?'#5ac04a':'#e0a431')+';opacity:.85"></div></div>'
 +'<div class="btns" style="justify-content:center"><button class="b" data-act="lcspin" style="font-size:20px;padding:12px 18px">🌀 GIRAR</button><button class="b gold" data-act="lcthrow" style="font-size:20px;padding:12px 18px">🪢 LAÇAR!</button></div>'+(LCO.msg?'<div class="gold">'+LCO.msg+'</div>':'')}
function lcEnd(ok){clearInterval(LCO.iv);LCO.iv=null;LCO.on=0;LCO.show=0;const pe=LCO.big,t=LCO.t;
 const sc=RIV.slice(0,7).map(r=>({n:r[1],t:Math.round(rnd(6.5,16)*10)/10}));if(ok)sc.push({n:'Você',t:Math.round(t*10)/10,me:1});sc.sort((a,b)=>a.t-b.t);const pos=ok?sc.findIndex(x=>x.me)+1:0,pr=ok?(([0,5000,2500,1000][pos]||300)*(pe?3:1)):0;
 if(pr)cash(pr,'Prova do laço');if(ok)gainXP(pe?50:25,'laço');if(pos===1)addTrof('🪢',(pe?'Campeão do Laço da Festa do Peão':'Campeão da Prova do Laço')+' · ano '+yearN());
 const b=$('lcbox');if(b)b.innerHTML='<div style="font-size:40px">'+(ok?'🏆':'⌛')+'</div><div>'+(ok?'Laçou em <b>'+t.toFixed(1)+'s</b>! '+pos+'º lugar'+(pr?' · '+R$(pr):''):'O tempo acabou e o bezerro escapou!')+'</div>'+sc.slice(0,4).map((x,i)=>'<div class="dim" style="font-size:14px">'+(i+1)+'º '+x.n+' — '+x.t+'s</div>').join('')}
Object.assign(ACT,{
 lcgo(){const F=ensureF(),pe=festaOn('peao'),fee=pe?450:150;if(LCO.on)return;if(S.money<fee)return toast('Dinheiro insuficiente','bad');cash(-fee,'Inscrição do laço');F.laco=S.day;
  Object.assign(LCO,{on:1,big:pe,t:0,cx:12,hx:0,cv:24,pw:0,rec:0,msg:'',jit:0,show:1,wy:73*TS});showModal('<h3>🪢 Prova do Laço'+(pe?' · Festa do Peão':'')+'</h3><div id="lcbox" class="card" style="text-align:center"></div><div class="btns"><button class="b gray" data-act="close">Sair</button></div>');reModal=null;lcRender();
  LCO.iv=setInterval(()=>{if(!$('lcbox')){clearInterval(LCO.iv);LCO.on=0;LCO.show=0;return}const dt=.05;LCO.t+=dt;LCO.jit-=dt;if(LCO.jit<=0){LCO.jit=rnd(.4,1.1);LCO.cv=rnd(17,31)*(pe?1.1:1)}
   LCO.cx+=LCO.cv*dt*.5;if(LCO.cx>96)LCO.cx=6;LCO.hx+=(22+(LCO.cx-LCO.hx>14?8:0))*dt*.5;if(LCO.hx>LCO.cx-1)LCO.hx=LCO.cx-1;
   LCO.pw=Math.max(0,LCO.pw-dt*.28);if(LCO.rec>0){LCO.rec-=dt;if(LCO.rec<=0)LCO.msg=''}
   if(LCO.t>=25)return lcEnd(false);lcRender()},50)},
 lcspin(){if(!LCO.on||LCO.rec>0)return;LCO.pw=Math.min(1,LCO.pw+.16)},
 lcthrow(){if(!LCO.on||LCO.rec>0)return;const d=LCO.cx-LCO.hx,okd=d>=3&&d<=13,okp=LCO.pw>=.55&&LCO.pw<=.85;
  if(okd&&okp&&Math.random()<.9)return lcEnd(true);LCO.rec=1.5;LCO.pw=0;LCO.msg=!okp?(LCO.pw>.85?'Força demais! O laço passou por cima.':'Laço fraco! Caiu no chão.'):!okd?'Longe demais! Errou.':'O bezerro desviou!';lcRender()}
});
function drawLacoWorld(g){}
addEventListener('keydown',e=>{if(!LCO.on)return;const k=e.key.toLowerCase();if(k===' '){e.preventDefault();ACT.lcspin();lcRender()}if(k==='enter'||k==='l'){e.preventDefault();ACT.lcthrow()}},true);
// ---------- JULGAMENTO DE GADO
const JCAT=[{k:'touro',n:'🐂 Melhor Touro',f:a=>a.sex==='M'&&a.age>=700},{k:'vaca',n:'🐄 Melhor Vaca',f:a=>a.sex==='F'&&a.age>=700},{k:'jovem',n:'🐮 Melhor Novilho(a)',f:a=>a.age>=300&&a.age<700}];
const judgeEv=()=>festaOn('peao')?'p'+yearN():S.expo?'e'+S.expo.until:null;
function jScore(a){return a.gen*.5+30*Math.min(1,a.w/wmax(a))+a.hp*.2-(a.sick?15:0)+BREEDS[a.breed].tier*3+(a.title?2:0)}
function ensureJ(){const ev=judgeEv();if(!ev)return null;if(!S.fj||S.fj.ev!==ev)S.fj={ev,ent:{},done:0,res:null};return S.fj}
function judgeModal(){const J=ensureJ();reModal=null;if(!J)return toast('O julgamento acontece na Exposição (a cada 90 dias) e na Festa do Peão (agosto)','bad');reModal=judgeModal;
 const pe=J.ev[0]==='p',fee=pe?800:300;
 if(J.done)return showModal('<h3>🏆 Resultado do julgamento</h3>'+J.res+'<div class="btns"><button class="b gold" data-act="close">Fechar</button></div>');
 let h='<h3>🏆 '+(pe?'Grande Julgamento da Festa do Peão':'Julgamento da Exposição')+'</h3><div class="dim">Escolha até um animal por categoria (inscrição '+R$(fee)+' cada). Os jurados avaliam genética, peso para a idade, saúde e raça. Pódio dá prêmio, reputação, troféu e faixa de campeão (o animal valoriza).</div>';
 for(const c of JCAT){const id=J.ent[c.k],a=id&&find(id);h+='<div class="card"><div class="row"><b>'+c.n+'</b><span class="dim">'+(a?'inscrito':'—')+'</span></div>'+(a?'<div>'+a.name+' · '+BREEDS[a.breed].n+' · '+Math.round(a.w)+' kg · gen '+a.gen+'</div><div class="btns"><button class="b gray" data-act="jrem" data-v="'+c.k+'">Tirar</button></div>':'<div class="btns"><button class="b" data-act="jpick" data-v="'+c.k+'">Escolher animal</button></div>')+'</div>'}
 const n=Object.keys(J.ent).filter(k=>J.ent[k]).length;
 h+='<div class="btns">'+(n?'<button class="b gold" data-act="jgo">▶️ Começar o julgamento ('+R$(fee*n)+')</button>':'')+'<button class="b gray" data-act="close">Depois</button></div>';showModal(h)}
function jPick(cat){const J=ensureJ(),c=JCAT.find(x=>x.k===cat),used=Object.values(J.ent);reModal=null;
 const L=S.herd.filter(a=>c.f(a)&&!used.includes(a.id)).sort((a,b)=>jScore(b)-jScore(a)).slice(0,10);
 showModal('<h3>'+c.n+'</h3>'+(L.length?L.map(a=>'<div class="card"><div class="row"><b>'+a.name+' · '+BREEDS[a.breed].n+(a.title?' 🎗️':'')+'</b><button class="b gold" data-act="jset" data-v="'+cat+':'+a.id+'">Inscrever</button></div><div class="dim">'+Math.round(a.w)+' kg · gen '+a.gen+' · saúde '+Math.round(a.hp)+'%'+(a.sick?' · 🤒 doente':'')+' · '+Math.floor(a.age/30)+' meses</div></div>').join(''):'<div class="card dim">Nenhum animal seu se encaixa nesta categoria.</div>')+'<div class="btns"><button class="b gray" data-act="jback">Voltar</button></div>')}
function jRun(){const J=ensureJ(),pe=J.ev[0]==='p',fee=pe?800:300,cats=JCAT.filter(c=>J.ent[c.k]&&find(J.ent[c.k]));if(!cats.length)return;
 if(S.money<fee*cats.length)return toast('Dinheiro insuficiente','bad');cash(-fee*cats.length,'Inscrição no julgamento');
 let html='',best=9,firsts=0;
 for(const c of cats){const a=find(J.ent[c.k]),my=jScore(a)+rnd(-5,5);const rv=shuffle(RIV.map((r,i)=>i)).slice(0,5).map(i=>({n:RIV[i][1],f:RIV[i][0],s:42+i*3.2+rnd(-9,9)+(pe?3:0)}));
  const all=rv.concat([{n:'Você',f:a.name,s:my,me:1}]).sort((x,y)=>y.s-x.s),pos=all.findIndex(x=>x.me)+1;best=Math.min(best,pos);
  const pr=pos<=3?[pe?15000:6000,pe?7000:3000,pe?3000:1500][pos-1]:0;if(pr)cash(pr,'Prêmio do julgamento');S.rep=Math.min(100,S.rep+([pe?6:4,pe?3:2,1][pos-1]||0));
  if(pos===1){a.title=1;firsts++;S.stats.expoWins=(S.stats.expoWins||0)+1;addTrof('🏆',c.n.replace(/^\S+ /,'')+(pe?' · Festa do Peão':' · Exposição')+' · ano '+yearN()+' ('+a.name+')')}
  html+='<div class="card"><b>'+c.n+'</b>'+all.slice(0,4).map((x,i)=>'<div class="'+(x.me?'gold':'dim')+'" style="font-size:15px">'+['🥇','🥈','🥉','4º'][i]+' '+x.n+' — '+x.f+' ('+x.s.toFixed(0)+' pts)</div>').join('')+(pos>4?'<div class="gold" style="font-size:15px">'+pos+'º Você — '+a.name+'</div>':'')+(pr?'<div class="grn">Prêmio '+R$(pr)+(pos===1?' · 🎗️ faixa de campeão':'')+'</div>':'')+'</div>'}
 gainXP(20+firsts*30,'julgamento');J.done=1;J.res=html;rvJudge(best);judgeModal()}
Object.assign(ACT,{jpick(e){jPick(e.v)},jback(){judgeModal()},jset(e){const[c,id]=e.v.split(':');const J=ensureJ();J.ent[c]=+id||id;judgeModal()},jrem(e){const J=ensureJ();delete J.ent[e.v];judgeModal()},jgo(){jRun()},expo(e){judgeModal()}});
// ---------- arena: programação e interações
function arenaModal(){reModal=arenaModal;const pe=festaOn('peao'),rd=rodeoDay(),ex=!!S.expo,h=S.t*24;
 let o='<h3>📢 Arena da Vila</h3><div class="dim">'+(pe?'<b class="gold">🤠 FESTA DO PEÃO! Prêmios triplos.</b>':rd?'Hoje é dia de rodeio e laço!':ex?'Exposição aberta: julgamento de gado.':'Hoje não tem evento na arena.')+'</div>';
 const it=(ic,n,d,act,ok)=>'<div class="card"><div class="row"><b>'+ic+' '+n+'</b>'+(ok?'<button class="b gold" data-act="'+act+'">Ir</button>':'')+'</div><div class="dim">'+d+'</div></div>';
 o+=it('🐂','Rodeio em touro',rd?'Inscrição '+R$(pe?600:200)+'. Fique 8 s no touro.':'Todo dia 25 e na Festa do Peão.','arodeo',rd&&S.ev.rdD!==S.day);
 o+=it('🪢','Prova do laço',rd?'Inscrição '+R$(pe?450:150)+'. Lace o bezerro no menor tempo.':'Todo dia 25 e na Festa do Peão.','alaco',rd&&ensureF().laco!==S.day);
 o+=it('🏆','Julgamento de gado',ex||pe?'Touro, vaca e novilho. Inscreva seus melhores animais.':'Na Exposição (a cada 90 dias) e na Festa do Peão.','ajulg',ex||pe);
 if(pe)o+=it('🎤','Baile do Peão','A partir das 18h30. Dance com seu par!','abaile',h>=18.5||h<4);
 const nx=[];for(let d=S.day+1;d<S.day+120&&nx.length<4;d++){const dm=d%30+1,m=Math.floor((d%360)/30);if(dm===25)nx.push('Dia 25/'+MONTHS[m]+' · Rodeio e laço');if(d%90===45)nx.push('Dia '+dm+'/'+MONTHS[m]+' · Exposição (5 dias)');if(m===7&&dm===20)nx.push('Dia 20/Ago · 🤠 Festa do Peão (3 dias)')}
 o+='<div class="sec">PRÓXIMOS EVENTOS</div>'+nx.map(x=>'<div class="card" style="padding:5px 8px">'+x+'</div>').join('');
 const T=ensureF().trof;o+='<div class="sec">🏆 SEUS TROFÉUS ('+T.length+')</div>'+(T.length?T.slice(0,6).map(t=>'<div class="card" style="padding:5px 8px">'+t.ic+' '+t.n+'</div>').join(''):'<div class="dim">Ainda nenhum. Os troféus ficam na estante da sua casa.</div>');
 showModal(o+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ACT,{arodeo(){rodeoModal()},alaco(){lacoModal()},ajulg(){judgeModal()},abaile(){danceModal('baile')},arena(){arenaModal()}});
const _ilFe=interactList;
interactList=function(){const L=_ilFe();if(inRoom())return L;
 L.push({x:106*TS+16,y:69*TS+4,r:28,label:'📢 Arena: programação e inscrições',fn:arenaModal});
 if(rodeoDay()){L.push({x:116*TS,y:71*TS+12,r:26,label:'🐂 Montar no touro (rodeio)',fn:rodeoModal});L.push({x:110*TS,y:73*TS,r:30,label:'🪢 Prova do laço',fn:lacoModal})}
 if(S.expo||festaOn('peao'))L.push({x:113*TS,y:74*TS,r:30,label:'🏆 Julgamento de gado',fn:judgeModal});
 const sk=STON,fk=festaHoje();
 if(sk&&fk){for(const s of STALLS[sk])L.push({x:s.x*TS+23,y:(s.y+1)*TS+4,r:26,label:({pescaria:'🎣 Pescaria',argola:sk==='peao'?'🎯 Tiro ao alvo':'⭕ Argola',comida:'🍽️ '+s.n.charAt(0)+s.n.slice(1).toLowerCase(),correio:'💌 Correio elegante',bingo:'🎱 Bingo (R$ 50)',prendas:'🎁 Leilão de prendas',ceia:'🍗 Ceia de Natal'})[s.k],fn:()=>playStall(s.k)})}
 if(sk&&sk!=='peao'){if(sk==='natal')L.push({x:PRACA.x,y:PRACA.y+8,r:30,label:'🎄 Árvore de Natal (presentes)',fn:xmasModal});else if(fk==='junina')L.push({x:PRACA.x,y:PRACA.y+8,r:34,label:'💃 Fogueira: dançar quadrilha',fn:()=>danceModal('quadrilha')})}
 if(fk==='peao')L.push({x:ARC.x,y:68*TS,r:30,label:'🎤 Baile do Peão',fn:()=>danceModal('baile')});
 return L};
// ---------- avisos e estante de troféus
const _hdFe=hookDay;
hookDay=function(){_hdFe();ensureF();const k=festaHoje();
 for(const fk in FESTAS){const f=FESTAS[fk];if(curMon()===f.m&&fDom()===f.d[0])toast(f.ic+' Hoje: '+f.n+'! '+f.desc,'good');if(curMon()===f.m&&fDom()===f.d[0]-3)toast(f.ic+' Daqui a 3 dias: '+f.n+'. '+(f.pl==='arena'?'Prepare seus animais para o julgamento!':'A praça já está enfeitada.'))}
 if(fDom()===25&&!festaOn('peao'))toast('🤠 Hoje tem rodeio e prova do laço na Arena (ao sul da vila)!','good');
 if(festaOn('natal')&&fDom()===25){const g=NPC_IDS.filter(id=>hearts(id)>=4);if(g.length){let tot=0;g.forEach(id=>{const v=ri(2,6)*100;tot+=v});cash(tot,'Presentes de Natal');toast('🎁 Feliz Natal! '+g.map(id=>npcById(id).n).join(', ')+' te deram presentes ('+R$(tot)+').','good')}}
};
ROOMS.house.wallx.push({k:'cups',x:11});
const _dwdFe=drawWallDeco;
drawWallDeco=function(g,d,x,y){if(d.k!=='cups')return _dwdFe(g,d,x,y);const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),T=(S.fe&&S.fe.trof)||[];
 R('#5a3a22',-2,16,34,3);R('#7a5232',-2,16,34,1);R('#3a2414',0,19,2,3);R('#3a2414',28,19,2,3);
 const n=Math.min(6,T.length);for(let i=0;i<n;i++){const cx=1+i*5,c=T[i].ic==='🏆'?'#e0b040':T[i].ic==='🤠'?'#c8c8d0':'#d8904a';R(c,cx,10,4,3);R(shade(c,25),cx,10,4,1);R(c,cx+1.5,13,1,2);R(shade(c,-30),cx,15,4,1);R(c,cx-1,10.5,1,2);R(c,cx+4,10.5,1,2)}
 if(!n){R('#c8c8c8',12,11,5,1)}
};
ACH.push(['trof1','Primeiro troféu','Ganhe um troféu na Arena ou numa festa',()=>S.fe&&S.fe.trof.length>=1,3000],['trof10','Estante cheia','Ganhe 10 troféus',()=>S.fe&&S.fe.trof.length>=10,25000],['laco','Laçador','Vença a prova do laço',()=>S.fe&&S.fe.trof.some(t=>t.ic==='🪢'),5000],['peao','Rei da Festa do Peão','Seja campeão do rodeio na Festa do Peão',()=>S.fe&&S.fe.trof.some(t=>t.n.indexOf('Rodeio da Festa do Peão')>=0),20000]);
GUIDE.push({lv:1,ic:'🎉',t:'Festas da vila',h:'Festa Junina (24/jun), Quermesse (12/set), Festa do Peão (20 a 22/ago, na Arena), Natal (24 e 25/dez) e Réveillon (30/dez). Nas festas tem barracas com minijogos, comidas, correio elegante, bingo, quadrilha e baile (dance com seu par para ganhar corações), fogos à noite e prêmios.'},
 {lv:1,ic:'🏟️',t:'Arena e rodeio',h:'A Arena fica ao sul da vila. Todo dia 25 tem rodeio em touro e prova do laço. Na Exposição (a cada 90 dias) e na Festa do Peão tem julgamento de gado em 3 categorias. Campeões ganham troféus para a estante da sua casa e faixa que valoriza o animal.'});
