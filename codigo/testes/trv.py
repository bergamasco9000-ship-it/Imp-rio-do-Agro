from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(700);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1200)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2400)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    E("hideModal();S.tut=TUT.length;S.money=1e6;for(let i=0;i<400;i++)update(1/30)")
    for fi in range(3):
        print(E("rfInfo(%d);const b=document.querySelector('[data-act=rvherd]');if(!b)return 'sem botão';b.click();const n=document.querySelectorAll('[data-act=rvof1]').length;document.querySelector('[data-act=rvof1]').click();return n+' animais; oferta: '+document.querySelectorAll('[data-act=rvoffer]').length+' botões'"%fi))
    E("document.querySelector('[data-act=rvoffer][data-v$=\"|1.25\"]').click()");print(E("return S.herd.length"))
    print(errs);b.close()
