from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390},device_scale_factor=2)
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(700);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1200)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2400)
    r=pg.evaluate("""()=>{hideModal();S.tut=TUT.length;S.up.land=5;S.up.piq=2;rebuildFence();for(let i=0;i<500;i++)S.herd.push(mk('nelore',i%2?'F':'M',ri(100,1500),50));P.x=30*TS;P.y=58*TS;camInit=0;
 const T=[];for(let k=0;k<120;k++){const t=performance.now();update(1/30);drawScene();T.push(performance.now()-t)}T.sort((a,b)=>a-b);return [T[60].toFixed(1),T[114].toFixed(1)]}""")
    print('500 cabeças: p50/p95 ms',r);b.close()
