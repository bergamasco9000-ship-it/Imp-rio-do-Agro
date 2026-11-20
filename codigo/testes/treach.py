from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390})
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(700);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1200)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2400)
    r=pg.evaluate("""()=>{hideModal();S.tut=TUT.length;S.money=1e8;S.lv.xp=60*16*16;for(const k in UPS)S.up[k]=(UPS[k].c||[1]).length;rebuildFence();
 const sx=Math.floor(P.x/TS),sy=Math.floor(P.y/TS);const R=new Uint8Array(MW*MH),Q=[ti(sx,sy)];R[Q[0]]=1;
 while(Q.length){const i=Q.pop(),x=i%MW,y=(i/MW)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=MW||ny>=RZ-1)continue;const j=ti(nx,ny);if(R[j]||SOL[j]||FEN[j])continue;if(G[j]===2)continue;R[j]=1;Q.push(j)}}
 let reach=0;for(let i=0;i<R.length;i++)reach+=R[i];
 const pts=new Map();for(let ty=2;ty<RZ-2;ty+=1)for(let tx=2;tx<MW-2;tx+=1){P.x=tx*TS+8;P.y=ty*TS+8;let L;try{L=interactList()}catch(e){continue}for(const l of L){const k=l.label+'|'+Math.round(l.x)+','+Math.round(l.y);if(!pts.has(k))pts.set(k,l)}}
 const bad=[];for(const [k,l] of pts){if(/Pescar|Falar com|pegada|rastro|Pegar|bicho|Javali|Capivara|Veado|Tatu|Paca|Onça|Cobra|Lobo|Jacaré|Anta|Ema|Tamanduá|Seriema|Quati|Cateto|Queixada/i.test(l.label))continue;const r=Math.max(1,Math.ceil((l.r||20)/TS));let ok=false;const cx=Math.floor(l.x/TS),cy=Math.floor(l.y/TS);
  for(let dy=-r;dy<=r&&!ok;dy++)for(let dx=-r;dx<=r;dx++){const x=cx+dx,y=cy+dy;if(x<0||y<0||x>=MW||y>=RZ)continue;if(R[ti(x,y)]&&Math.hypot(x*TS+8-l.x,y*TS+8-l.y)<(l.r||20)+6){ok=true;break}}
  if(!ok&&l.y<RZ*TS)bad.push(l.label+' @'+cx+','+cy)}
 return {reach,pts:pts.size,bad:[...new Set(bad)].slice(0,60)}}""")
    print('tiles alcançáveis',r['reach'],'pontos',r['pts']);[print('  INALCANÇÁVEL:',x) for x in r['bad']]
    b.close()
