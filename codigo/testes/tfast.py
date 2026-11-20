from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:300]));pg.on('console',lambda m:(m.type=='error' and 'ERR_' not in m.text) and errs.append('CE:'+m.text[:300]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(800);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1300)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2600)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    # gala rápida
    print(E("""hideModal();S.tut=TUT.length;toast=function(){};S.money=3e7;S.rep=60;S.day=S.day-(S.day%30)+14+30;S.t=20.2/24;enterRoom('elite');return 1"""))
    pg.wait_for_timeout(1200)
    print(E("""hideModal();const r=ROOMS.elite,it=r.items.find(i=>i.act==='galasit');roomAct(it,r);const h0=S.herd.length,m0=S.money;let n=0;
 while(LIVE&&n<20000){n++;liveTick(.1);if(LIVE&&LIVE.L&&LIVE.phase==='open'&&LIVE.i%3===0&&LIVE.L.leader!=='p'&&LIVE.L.price<LIVE.L.start*1.6)livePlayerBid()}
 const txt=document.getElementById('mbox').innerText.slice(0,250);hideModal();roomAct(it,r);return [n,S.herd.length-h0,Math.round(m0-S.money),S.gala.done,S.gala.lots.length,txt,!!LIVE]"""))
    # semanal rápido com lote próprio
    print(E("""hideModal();const a=S.herd[0];a.cons=1;S.aucOpen={type:'comum',until:S.day+3,lots:null};openAuction();return 1"""))
    pg.wait_for_timeout(1500)
    print(E("""let n=0;const h0=S.herd.length;while(LIVE&&n<20000){n++;liveTick(.1);if(LIVE&&LIVE.L&&LIVE.phase==='open'&&!LIVE.L.own&&LIVE.L.leader!=='p'&&Math.random()<.05)livePlayerBid()}return [n,S.herd.length-h0,S.aucOpen&&S.aucOpen.lots.length,S.stats.aucWins]"""))
    print(errs[:5]);b.close()
