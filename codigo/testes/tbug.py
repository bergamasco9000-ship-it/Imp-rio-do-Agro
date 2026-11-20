from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':800,'height':450})
    errs=[];pg.on('pageerror',lambda e:errs.append('PE:'+str(e)[:300]))
    pg.on('dialog',lambda d:d.accept())
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(900)
    pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}")
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(3400)
    pg.evaluate("()=>{hideModal();S.tut=99;S.money=3e6;S.lv.xp=40*16*16;S.up.kennel=3;S.up.coop=2;S.up.lav=3;S.h.lic=S.day+999;S.h.own.r308=1;S.h.ammo.a308=50;S.h.eq='r308';S.h.mag.r308=5;S.h.gear.knife=1;S.mate={g:'f',name:'Lia',task:'auto'};S.horse={b:'crioulo'};secS().pa=1;secS().det=1;ACT.dogbuy({v:'kangal'});S.dogs[1].esc=1}")
    # play loop across map
    r=pg.evaluate("""()=>{const E=[];for(let k=0;k<1500;k++){try{if(k%100===0){P.x=(5+Math.random()*150)*TS;P.y=(5+Math.random()*90)*TS;}P.vx=0;update(1/30);if(k%25===0)drawScene()}catch(e){E.push('loop:'+e.message+' @'+(e.stack||'').split('\\n')[1]);if(E.length>5)break}}return E}""")
    print('loop',r)
    r=pg.evaluate("""()=>{const E=[];for(let d=0;d<400;d++){try{dayTick();if(document.getElementById('modal').style.display==='flex')hideModal()}catch(e){E.push('day'+d+':'+e.message+' '+(e.stack||'').split('\\n')[1]);if(E.length>5)break}}return [E,S.day,Math.round(S.money),S.herd.length,S.dogs.length]}""")
    print('days',r)
    tabs=pg.evaluate("TABS.map(t=>t[0])")
    black=['totitle','reset2','menuclose','close','sleep','delok','help','tutskip']
    for t in tabs:
        for rep in range(2):
            pg.evaluate("(t)=>{hideModal();openMenu(t)}",t)
            acts=pg.evaluate("Array.from(document.querySelectorAll('#panel [data-act]')).map((e,i)=>i)")
            n=len(acts)
            for i in range(0,min(n,30)):
                try:
                    pg.evaluate("([t,i,bl])=>{openMenu(t);const el=document.querySelectorAll('#panel [data-act]')[i];if(el&&!bl.includes(el.dataset.act))el.click();hideModal()}",[t,i,black])
                except Exception as e: errs.append('click '+t+str(e)[:120])
        pg.evaluate("()=>closeMenu()")
    print('tabs ok',len(tabs))
    # npcs and buildings
    pg.evaluate("()=>{S.day=S.day-S.day%30+24}")
    ids=pg.evaluate("NPCS.map(n=>n.id)")
    for i in ids:
        pg.evaluate("(i)=>{hideModal();npcModal(i)}",i)
        n=pg.evaluate("document.querySelectorAll('#mbox [data-act]').length")
        for k in range(min(n,25)):
            pg.evaluate("([i,k,bl])=>{npcModal(i);const el=document.querySelectorAll('#mbox [data-act]')[k];if(el&&!bl.includes(el.dataset.act))el.click()}",[i,k,black])
    bl=pg.evaluate("BLD.map(b=>b.id)")
    for i in bl:
        try:pg.evaluate("(i)=>{hideModal();enterBld(i)}",i)
        except Exception as e:errs.append('bld '+i+str(e)[:100])
        n=pg.evaluate("document.querySelectorAll('#mbox [data-act]').length")
        for k in range(min(n,25)):
            pg.evaluate("([i,k,bl])=>{hideModal();enterBld(i);const el=document.querySelectorAll('#mbox [data-act]')[k];if(el&&!bl.includes(el.dataset.act))el.click()}",[i,k,black])
    for f in ['muralModal()','rodeoModal()','mateModal()','fishShop()','kennelModal()','dogShopModal()','shipModal()','coopModal()','sleepModal()','helpModal()','dogModal(S.dogs[0].id)','useModal()','lodgeModal("arms")','lodgeModal("sell")','troughModal()','mailModal()','fishStart("lake")']:
        try:pg.evaluate("()=>{hideModal();"+f+"}")
        except Exception as e:errs.append(f+':'+str(e)[:150])
        n=pg.evaluate("document.querySelectorAll('#mbox [data-act]').length")
        for k in range(min(n,25)):
            try:pg.evaluate("([k,bl])=>{hideModal();"+f+";const el=document.querySelectorAll('#mbox [data-act]')[k];if(el&&!bl.includes(el.dataset.act))el.click()}",[k,black])
            except Exception as e:errs.append(f+' btn'+str(k)+':'+str(e)[:150])
    pg.evaluate("()=>hideModal()")
    # interact everything near secrets/boards
    r=pg.evaluate("""()=>{const E=[];try{for(const s of SECRETS){P.x=SECP[s.id].x;P.y=SECP[s.id].y+14;const L=interactList();const it=L.find(l=>Math.hypot(l.x-P.x,l.y-P.y)<l.r+10);if(it)it.fn();hideModal()}}catch(e){E.push(e.message)}return [E,Object.keys(S.sec.found).length]}""")
    print('secrets',r)
    # save/load roundtrip + old save compat
    r=pg.evaluate("""()=>{const E=[];try{save();const s=JSON.parse(localStorage.getItem('fbo_w1'));delete s.rk;delete s.mur;delete s.sec;delete s.ach;delete s.col;delete s.ev;delete s.bk;delete s.fish;delete s.fr;S=s;ensureH();ensureG();for(let i=0;i<10;i++)dayTick();hideModal();openMenu('reg');openMenu('bolsa');openMenu('fish');closeMenu();for(let k=0;k<200;k++)update(1/30);drawScene()}catch(e){E.push(e.message+' '+(e.stack||'').split('\\n')[1])}return E}""")
    print('compat',r)
    print('ERRS',len(errs));print('\n'.join(errs[:25]))
    b.close()
