from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:300]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(900);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1500)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2500)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    print(E("hideModal();for(let i=0;i<5;i++){S.herd.push(S.herd[0]||mk('nelore','F',800,50))};spawnThief();spawnOnca();return [THV.length,!!ONCA,oncaChance(),newbieSafe()]"))
    print(E("S.tut=TUT.length;return newbieSafe()"));pg.wait_for_timeout(2500)
    print(E("S.day+=6;return [newbieSafe(),S.tutEnd]"))
    print(E("spawnOnca();return [!!ONCA,oncaChance()>0]"))
    print(errs[:3]);b.close()
