from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':844,'height':390},device_scale_factor=2,has_touch=True,is_mobile=True)
    errs=[];pg.on('pageerror',lambda e:errs.append('PE:'+str(e.stack)[:500]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(900);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1500)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2500)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    E("hideModal();S.tut=TUT.length;renderTutBox();S.t=10.2/24;toast=function(){};S.money=2e6")
    E("""const c=document.createElement('canvas');c.width=1500;c.height=360;c.id='sh';c.style='position:fixed;left:0;top:0;z-index:99999';document.body.appendChild(c);const g=c.getContext('2d');g.fillStyle='#140e08';g.fillRect(0,0,1500,360);let i=0;for(const id of ['rdate','rsub','rday','rdiam','rmosca']){wDraw(g,id,150+i*300,180,95,0);i++}""")
    pg.set_viewport_size({'width':1500,'height':360});pg.wait_for_timeout(300);pg.screenshot(path='/tmp/W1.png');E("document.getElementById('sh').remove()");pg.set_viewport_size({'width':844,'height':390})
    E("luxStore('ro')");pg.wait_for_timeout(500);pg.screenshot(path='/tmp/W2.png')
    E("ACT.lxbuy({v:'rmosca'})");pg.wait_for_timeout(300);E("ACT.lxzoom({v:'rmosca'})");pg.wait_for_timeout(800);pg.screenshot(path='/tmp/W3.png')
    print(E("return S.wd.eq.watch"));print(errs[:3]);b.close()
