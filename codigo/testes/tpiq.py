from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e.stack)[:300]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(900);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1500)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2500)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    E("hideModal();S.tut=TUT.length;renderTutBox();toast=function(){};S.up.piq=2;rebuildFence();for(let i=0;i<20;i++)S.herd.push(mk('nelore',i%2?'F':'M',ri(300,900),50));P.x=30*TS;P.y=48*TS")
    def sim(sec):
        E("for(let i=0;i<%d;i++)stepCows(1/30)"%(sec*30))
    def stat():
        return E("const L=S.herd.map(a=>pqOf(spriteOf(a).x+8));return [S.pq.a,[0,1,2].map(i=>L.filter(x=>x===i).length)]")
    print('inicio',stat())
    E("movePq(2)");sim(90);print('->3',stat())
    E("movePq(0)");sim(90);print('->1',stat())
    # oscilação: posição média muda pouco quando parados?
    E("window._p=S.herd.map(a=>{const s=spriteOf(a);return [s.x,s.y]})");sim(1)
    print('mov 1s',E("return Math.max(...S.herd.map((a,i)=>Math.hypot(spriteOf(a).x-_p[i][0],spriteOf(a).y-_p[i][1]))).toFixed(1)"))
    E("movePq(1)");sim(60);print('->2',stat());E("movePq(0)");sim(60);print('->1',stat())
    print(errs[:3]);b.close()
