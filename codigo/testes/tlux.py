from playwright.sync_api import sync_playwright
combos=[{'top':'tpreto','belt':'lvbelt','watch':'rsub','hat':'hstet','shoes':'bjac','glasses':'oavi'},
 {'top':'lvjac','belt':'lvbelt','bag':'lvbag','neck':'lvsc','bot':'gupant','shoes':'bcobra','hat':'hcouro','glasses':'owf'},
 {'top':'gubomb','belt':'gubelt','bot':'gupant','watch':'rdiam'},
 {'top':'gusilk','belt':'gubelt','bot':'jeansp','shoes':'bpreta','hat':'hpana'},
 {'top':'tbranco','belt':'gubelt','watch':'rday','hat':'hstet','shoes':'bcobra'}]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':844,'height':390},device_scale_factor=8,has_touch=True,is_mobile=True)
    errs=[];pg.on('pageerror',lambda e:errs.append('PE:'+str(e.stack)[:500]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(900);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1500)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2500)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    E("hideModal();S.tut=TUT.length;renderTutBox();S.t=12/24;toast=function(){};P.x+=3*TS;S.dogs.forEach(d=>d.dead=1)")
    i=0
    import json
    for c in combos:
        E("ensureWd();S.wd.eq=%s;for(const k in S.wd.eq)S.wd.own[S.wd.eq[k]]=1;S.h.outfit='casual'"%json.dumps(c))
        for d in [0,3,1]:
            E("P.dir=%d;P.moving=0"%d);pg.wait_for_timeout(200)
            box=E("const r=CV.getBoundingClientRect(),s=r.width/CV.width*PS;return [r.left+(P.x-CX)*s,r.top+(P.y-CY)*s]")
            pg.screenshot(path='/tmp/L%d.png'%i,clip={'x':box[0]-11,'y':box[1]-40,'width':22,'height':42});i+=1
    print(errs[:3]);b.close()
