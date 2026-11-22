// ===== Gráficos 2.0: água com brilho e ondinhas que se mexem, sombra das construções no chão e vinheta suave na tela
// ---------- água viva: reflexos que correm e cintilam (só nos tiles de água visíveis)
function gfxWater(g){const x0=Math.floor(CX/TS)-1,x1=Math.ceil((CX+VW)/TS)+1,y0=Math.floor(CY/TS)-1,y1=Math.min(RZ-2,Math.ceil((CY+VH)/TS)+1),t=frame/60,dl=daylight();
 const hiA=.18+dl*.3;
 for(let ty=Math.max(YMIN,y0);ty<=y1;ty++)for(let tx=Math.max(XMIN,x0);tx<=Math.min(MW-1,x1);tx++){if(G[ti(tx,ty)]!==2||inMountainLake(tx,ty))continue;
  const h=hs(tx*7+3,ty*13+1),h2=hs(ty*5+2,tx*11+7),bx=tx*TS,by=ty*TS;
  // onda que corre devagar
  const ox=(h*16+t*(3+h2*3))%16,oy=2+h2*11,a=(.5+.5*Math.sin(t*1.3+h*9))*hiA;
  if(a>.04){Rr(g,'rgba(235,246,255,'+a.toFixed(2)+')',bx+ox,by+oy,3,.6);if(ox>13)Rr(g,'rgba(235,246,255,'+a.toFixed(2)+')',bx+ox-16,by+oy,3,.6)}
  // segunda ondinha mais escura
  const ox2=(h2*16+t*2.2)%16,oy2=(oy+7)%15;Rr(g,'rgba(20,50,100,.12)',bx+ox2,by+oy2,2.5,.5);
  // cintilado do sol
  if(dl>.4){const sp=Math.sin(t*4+h*40);if(sp>.93){const sx=bx+((h2*97)|0)%15,sy=by+((h*53)|0)%15;Rr(g,'rgba(255,255,255,.9)',sx,sy,1,1);Rr(g,'rgba(255,255,255,.45)',sx-1,sy,3,1);Rr(g,'rgba(255,255,255,.45)',sx,sy-1,1,3)}}}}
const _dfsGfx=drawFarmStatic;drawFarmStatic=function(g){_dfsGfx(g);if(inRoom())return;try{gfxWater(g)}catch(e){}};
// ---------- vinheta: cantos um pouco mais escuros, puxa o olho pro centro
let VIGC=null,VIGK='';
function gfxVignette(g){const k=VW+'x'+VH;if(k!==VIGK){VIGK=k;const w=Math.max(8,Math.round(VW/3)),h=Math.max(8,Math.round(VH/3));VIGC=document.createElement('canvas');VIGC.width=w;VIGC.height=h;
  const c=VIGC.getContext('2d'),r=Math.hypot(w,h)/2,gr=c.createRadialGradient(w/2,h/2,r*.62,w/2,h/2,r*1.05);gr.addColorStop(0,'rgba(10,6,2,0)');gr.addColorStop(1,'rgba(10,6,2,.22)');c.fillStyle=gr;c.fillRect(0,0,w,h)}
 g.drawImage(VIGC,0,0,VW,VH)}
const _lpGfx=lightPass;lightPass=function(g,ox,oy,dl){_lpGfx(g,ox,oy,dl);try{gfxVignette(g)}catch(e){}};
