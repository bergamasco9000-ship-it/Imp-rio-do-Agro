from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page(viewport={'width':844,'height':390})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:300]));pg.on('console',lambda m:(m.type=='error' and 'ERR_' not in m.text) and errs.append('CE:'+m.text[:300]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(800);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1300)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2600)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    print(E("""hideModal();S.tut=TUT.length;toast=function(){};S.money=5e7;ensureEmp();for(const f of EFARMS.slice(0,4)){S.emp.farms[f.id]={lvl:0,adm:1,val:f.p,paid:f.p,day:S.day};gerHire(f.id);const c=gerCands(f.id)[0];c.hon=.1;ACT.gerok({v:f.id+'|0'})}
 hideModal();const out=[];for(let m=0;m<14;m++){for(let d=0;d<30;d++){dayTick();hideModal()}const k=Object.keys(S.emp.dec||{});out.push(k.join(','));for(const fid of k){ACT.gerdec({v:fid});const btn=document.querySelector('#mbox [data-act=gerdo]');if(btn)btn.click();hideModal()}}
 return [out.join(' | '),EFARMS.slice(0,4).map(f=>{const o=S.emp.farms[f.id];return o.mgr?o.mgr.n+' sk'+o.mgr.sk.toFixed(2)+' mood'+o.mgr.mood.toFixed(2)+' caught'+o.mgr.caught:'(sem gerente)'}).join(' ; '),S.emp.dre[0].f]"""))
    print(errs[:5]);b.close()
