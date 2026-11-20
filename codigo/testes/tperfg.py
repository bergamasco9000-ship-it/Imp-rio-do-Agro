from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390},device_scale_factor=2)
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(800);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1300)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2600)
    pg.evaluate("()=>{hideModal();S.tut=TUT.length;toast=function(){};S.rep=60;S.day=S.day-(S.day%30)+14+30;S.t=20.2/24;enterRoom('elite')}");pg.wait_for_timeout(1200)
    for where in ['centro','mesa']:
        if where=='mesa':pg.evaluate("()=>{hideModal();const r=ROOMS.elite,it=r.items.find(i=>i.act==='galasit');roomAct(it,r)}");pg.wait_for_timeout(3000)
        r=pg.evaluate("()=>{hideModal();const T=[];for(let k=0;k<90;k++){const t=performance.now();update(1/30);drawScene();T.push(performance.now()-t)}T.sort((a,b)=>a-b);return [T[45].toFixed(1),T[85].toFixed(1)]}")
        print(where,r)
    b.close()
