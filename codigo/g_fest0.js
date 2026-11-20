// ===== Parque de Exposições (arena) e paiol de feno: geração no mapa =====
const ARN={x0:102,y0:67,x1:121,y1:76,rx0:106,ry0:69,rx1:117,ry1:75,gx0:111,gx1:112};
const HAYP={x:24,y:42};
const inArn=(x,y)=>x>=ARN.x0&&y>=ARN.y0&&(x<=ARN.x1+6&&y<=ARN.y1||x<=138&&y<=70);
const _gwF0=genWorld;
genWorld=function(){_gwF0();
 const A=ARN;
 // limpa árvores e decoração na área do parque (inclui espaço da roda-gigante a leste)
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(inArn(tx,ty)||(tx>=HAYP.x-1&&tx<=HAYP.x+2&&ty>=HAYP.y-1&&ty<=HAYP.y+2)){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--){const d=DECO[i],tx=Math.floor(d.x/TS),ty=Math.floor(d.y/TS);if(inArn(tx,ty)){SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}
 for(let y=A.y0;y<=A.y1;y++)for(let x=A.x0;x<=138;x++){if(!inArn(x,y))continue;const i=ti(x,y);G[i]=0;SOL[i]=0;FEN[i]=0}
 // chão da arena (areia batida) e caminho de entrada
 for(let y=A.ry0+1;y<A.ry1;y++)for(let x=A.rx0+1;x<A.rx1;x++)G[ti(x,y)]=3;
 for(let y=A.y0;y<=A.ry0;y++)for(let x=A.gx0;x<=A.gx1;x++)G[ti(x,y)]=3;
 // cerca da arena (com porteira em cima)
 for(let x=A.rx0;x<=A.rx1;x++){if(x<A.gx0||x>A.gx1)SOL[ti(x,A.ry0)]=1;SOL[ti(x,A.ry1)]=1}
 for(let y=A.ry0;y<=A.ry1;y++){SOL[ti(A.rx0,y)]=1;SOL[ti(A.rx1,y)]=1}
 // arquibancadas
 for(let y=A.ry0;y<=A.ry1;y++)for(const x of[103,104,105,118,119,120])SOL[ti(x,y)]=1;
 // cabine do locutor e pilares do portal
 for(const[x,y]of[[106,67],[107,67],[106,68],[107,68],[110,67],[113,67]])SOL[ti(x,y)]=1;
 // roda-gigante (base)
 for(let x=124;x<=126;x++)SOL[ti(x,71)]=1;
 // trilha velha a oeste (por onde os ladrões entram)
 for(let x=0;x<=8;x++)for(let y=66;y<=67;y++){const i=ti(x,y);G[i]=3;SOL[i]=0;FEN[i]=0}
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx<=9&&ty>=64&&ty<=69){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 // paiol de feno ao lado do celeiro
 for(let y=HAYP.y;y<=HAYP.y+1;y++)for(let x=HAYP.x;x<=HAYP.x+1;x++){SOL[ti(x,y)]=1}
};
// ===== Sítios dos moradores (terreno preparado antes do pré-render) =====
const HMD=[
 {id:'benedita',n:'Sítio da Dona Benedita',x:84,y:94,hw:5,hh:4,g:4,style:'adobe',path:[[86,87,86,93]]},
 {id:'ze',n:'Sítio do Zé do Campo',x:66,y:88,hw:6,hh:4,g:4,style:'tijolo',path:[[66,87,70,87]]},
 {id:'rosa',n:'Sítio da Família Silva',x:80,y:27,hw:6,hh:4,g:0,style:'cal',path:[[66,26,80,26],[66,25,66,26]]},
 {id:'bene',n:'Rancho do Seu Bené',x:128,y:101,hw:6,hh:4,g:6,style:'palafita',path:[[130,87,130,100]]},
 {id:'lino',n:'Cabana do Seu Lino',x:144,y:10,hw:5,hh:4,g:5,style:'pedra',path:[[110,13,143,13]]}
];
const hmLot=h=>({x0:h.x-3,y0:h.y-1,x1:h.x+h.hw+8,y1:h.y+h.hh+6});
const inHomeLot=(x,y)=>HMD.some(h=>{const L=hmLot(h);return x>=L.x0&&x<=L.x1&&y>=L.y0&&y<=L.y1});
const _gwHM=genWorld;
genWorld=function(){_gwHM();
 for(const h of HMD){const L=hmLot(h);
  for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=L.x0-1&&tx<=L.x1+1&&ty>=L.y0-1&&ty<=L.y1+1){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
  if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--){const d=DECO[i],tx=Math.floor(d.x/TS),ty=Math.floor(d.y/TS);if(tx>=L.x0-1&&tx<=L.x1+1&&ty>=L.y0-1&&ty<=L.y1+1){SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}
  for(let y=L.y0;y<=L.y1;y++)for(let x=L.x0;x<=L.x1;x++){const i=ti(x,y);if(x<1||y<1||x>=MW-1||y>=RZ-1)continue;SOL[i]=0;FEN[i]=0;if(G[i]!==3)G[i]=h.g}
  for(const p of h.path){for(let y=p[1];y<=p[3];y++)for(let x=p[0];x<=p[2];x++){const i=ti(x,y);G[i]=3;SOL[i]=0}
   for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if(tx>=p[0]&&tx<=p[2]&&ty>=p[1]-1&&ty<=p[3]+1){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}}
  for(let y=h.y;y<h.y+h.hh;y++)for(let x=h.x;x<h.x+h.hw;x++)SOL[ti(x,y)]=1;
  for(let x=h.x;x<h.x+h.hw;x++)G[ti(x,h.y+h.hh)]=3;
 }
};
// ===== Canavial da Usina (serviço de controle de javali) e frigorífico =====
const CANA={x0:84,y0:77,x1:97,y1:83};
const FRIG={x:144,y:41,w:7,h:5,door:147};
const _gwCN=genWorld;
genWorld=function(){_gwCN();const C=CANA;
 for(let i=TREES.length-1;i>=0;i--){const t=TREES[i],tx=Math.floor(t.x/TS),ty=Math.floor(t.y/TS);if((tx>=C.x0-2&&tx<=C.x1+1&&ty>=C.y0-2&&ty<=C.y1+1)||(tx>=FRIG.x-3&&tx<=FRIG.x+FRIG.w+2&&ty>=FRIG.y-2&&ty<=FRIG.y+FRIG.h+2)){SOL[ti(tx,ty)]=0;TREES.splice(i,1)}}
 if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--){const d=DECO[i],tx=Math.floor(d.x/TS),ty=Math.floor(d.y/TS);if((tx>=C.x0-2&&tx<=C.x1+1&&ty>=C.y0-2&&ty<=C.y1+1)||(tx>=FRIG.x-3&&tx<=FRIG.x+FRIG.w+2&&ty>=FRIG.y-2&&ty<=FRIG.y+FRIG.h+2)){SOL[ti(tx,ty)]=0;DECO.splice(i,1)}}
 for(let y=C.y0-1;y<=C.y1;y++)for(let x=C.x0-2;x<=C.x1;x++){const i=ti(x,y);SOL[i]=0;FEN[i]=0;G[i]=y===C.y0-1||x<C.x0?3:0}
 for(let y=C.y1+1;y<=84;y++){const i=ti(C.x0-2,y);G[i]=3;SOL[i]=0}
 // frigorífico no fim da estrada do Pantanal
 for(let y=FRIG.y-1;y<=FRIG.y+FRIG.h+1;y++)for(let x=FRIG.x-2;x<=FRIG.x+FRIG.w+1;x++){const i=ti(x,y);SOL[i]=0;FEN[i]=0;G[i]=y===FRIG.y+FRIG.h?3:6}
 for(let y=FRIG.y+FRIG.h;y<=48;y++)for(let x=FRIG.door-1;x<=FRIG.door+1;x++){const i=ti(x,y);G[i]=3;SOL[i]=0}
 for(let y=FRIG.y;y<FRIG.y+FRIG.h;y++)for(let x=FRIG.x;x<FRIG.x+FRIG.w;x++)SOL[ti(x,y)]=1;
 if(!BLD.some(b=>b.id==='frig'))BLD.push({id:'frig',x:FRIG.x,y:FRIG.y,w:FRIG.w,h:FRIG.h,door:FRIG.door,roof:'#8a949c',wall:'#e8ecee',label:'Frigorífico Pantaneiro',sign:'FRIGORIFICO'});
};
