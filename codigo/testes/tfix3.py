from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':844,'height':390},device_scale_factor=2,has_touch=True,is_mobile=True)
    errs=[];pg.on('pageerror',lambda e:errs.append('PE:'+str(e.stack)[:500]));pg.on('console',lambda m:m.type=='error' and errs.append('CE:'+m.text[:300]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(900);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1500)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2500)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    E("hideModal();S.tut=TUT.length;renderTutBox();S.tips={preg:1,born:1,ready:1,labor:1,sick:1,emp:1,gringo:1};S.t=22/24;S.money=900000;S.rep=60;S.tf.cabare=1;S.tf.tonhoOk=1;S.tf.cabTip=1")
    # VIP
    E("barEnter()");pg.wait_for_timeout(1500);E("hideModal();goSub('cabare',{x:(ROOMS.bar.x+10)*TS,y:(ROOMS.bar.y+3)*TS+12})");pg.wait_for_timeout(1300)
    E("const r=ROOMS.cabare;P.x=(r.x+21.5)*TS;P.y=(r.y+5)*TS;P.dir=1");pg.wait_for_timeout(600);pg.screenshot(path='/tmp/V1.png')
    print(E("return interactList().filter(l=>!l.label.startsWith('Falar')).map(l=>l.label).join('|')"))
    E("const r=ROOMS.cabare;roomAct(r.items.find(i=>i.act==='vip'),r)");pg.wait_for_timeout(500);E("ACT.cabvip()");pg.wait_for_timeout(2200)
    print('room',E("return roomAt(P.x,P.y).id"))
    E("hideModal();const r=ROOMS.vipcab;P.x=(r.x+7.5)*TS;P.y=(r.y+6)*TS;P.dir=1");pg.wait_for_timeout(700);pg.screenshot(path='/tmp/V2.png')
    print(E("return interactList().filter(l=>!l.label.startsWith('Falar')).map(l=>l.label).join('|')"))
    E("const r=ROOMS.vipcab;roomAct(r.items.find(i=>i.act==='comendador'),r)");pg.wait_for_timeout(1500);print('modal',E("return !!document.querySelector('#cmdtx')"))
    E("hideModal();exitRoom()");pg.wait_for_timeout(1500);print('back',E("return roomAt(P.x,P.y)&&roomAt(P.x,P.y).id"))
    E("hideModal();exitRoom()");pg.wait_for_timeout(1500);E("hideModal();exitRoom()");pg.wait_for_timeout(1500);E("hideModal();exitRoom()");pg.wait_for_timeout(1500)
    print('out',E("return inRoom()"))
    # police
    E("hideModal();S.t=12/24;P.x=120*TS;P.y=60*TS;camInit=0");pg.wait_for_timeout(800)
    E("const sp='boar';spawnTest=1;const a={id:++WID,sp,x:P.x+90,y:P.y,kg:80,hp:SPECIES.boar.hp||90,st:'charge',dir:-1,al:1.2,vis:1,bleed:0,bt:0,ph:0,cd:.4,ft:0,fa:0,wait:0,stam:1};WILD.push(a);window._A=a")
    print('wild ok',E("return WILD.length"))
    for t in range(6):
        pg.wait_for_timeout(700)
        if t==2: pg.screenshot(path='/tmp/V3.png')
    print('cops',E("return [COPS.length,COPS.map(c=>c.st).join(','),_A.st,Math.round(_A.hp),P.hp]"))
    pg.screenshot(path='/tmp/V4.png')
    # traffic
    E("P.x=70*TS;P.y=46*TS;camInit=0;TRF.length=0;TRF.push({r:0,dir:-1,s:66*TS,k:'truck',c:'#c83a2a',t:null,v:46,hk:0});TRF.push({r:0,dir:-1,s:68.5*TS,k:'car',c:'#2a6ad8',t:ECARS[0].t,v:72,hk:0})")
    for t in range(12):
        pg.wait_for_timeout(500)
        if t in (3,5,8): pg.screenshot(path='/tmp/T%d.png'%t)
        print(E("return TRF.map(v=>v.k+':'+v.r+':'+v.dir+':'+Math.round(trfPos(v).x)+','+Math.round(trfPos(v).y)+(v.turn?'T'+v.turn.t.toFixed(2):'')).join(' | ')"))
    print(errs[:5])
    b.close()
