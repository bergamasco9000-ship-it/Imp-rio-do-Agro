from playwright.sync_api import sync_playwright
import sys
PH=sys.argv[1:]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':844,'height':390},device_scale_factor=2,has_touch=True,is_mobile=True)
    errs=[];pg.on('pageerror',lambda e:errs.append('PE:'+str(e.stack)[:400]));pg.on('console',lambda m:(m.type=='error' and 'ERR_' not in m.text) and errs.append('CE:'+m.text[:300]))
    pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(800);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1300)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2600)
    E=lambda js:pg.evaluate("()=>{"+js+"}")
    E("hideModal();S.lv.xp=0;S.tut=TUT.length;renderTutBox();S.tips={preg:1,born:1,ready:1,labor:1,sick:1,emp:1,gringo:1};S.money=2e7;S.rep=70;S.tutEnd=-99")
    if 'cel' in PH:
        E("for(let i=0;i<20;i++){dayTick();hideModal()}");pg.wait_for_timeout(500)
        E("celOpen('home')");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_cel1.png')
        E("celOpen('chats')");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_cel2.png')
        E("CELCHAT='news';celOpen('chat','news')");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_cel3.png')
        for a in ['cot','agenda','leiloes','expo','faz']:
            E("celOpen('%s')"%a);pg.wait_for_timeout(200)
        E("celOpen('cot')");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_cel4.png')
        print('msgs',E("return S.cel.m.length+' '+celUnread()"))
    if 'week' in PH:
        E("hideModal();S.aucOpen={type:'comum',until:S.day+3,lots:null};S.herd[0].cons=1;S.t=10/24;openAuction()");pg.wait_for_timeout(2500)
        pg.screenshot(path='/tmp/N_week1.png')
        for k in range(8):
            pg.wait_for_timeout(1500);E("hideModal()")
            try:pg.click('[data-lv=bid]',timeout=500)
            except Exception:pass
        pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_week2.png')
        print('live',E("return LIVE?[LIVE.i,LIVE.lots.length,LIVE.msg,LIVE.t,LIVE.phase,LIVE.idle,paused(),document.getElementById('mbox').innerText.slice(0,150),menuOpen]:'acabou'"))
        for k in range(90):
            pg.wait_for_timeout(1000);E("hideModal()")
            if E("return !LIVE"):break
        print('fim semanal',E("return [!!LIVE,S.herd.length,Math.round(S.money)]"))
    if 'gala' in PH:
        E("hideModal();S.day=S.day-(S.day%30)+14+30;S.t=19/24;const b=BLD.find(q=>q.id==='elite');P.x=b.door*TS+8;P.y=(b.y+b.h)*TS+14;camInit=0")
        pg.wait_for_timeout(800);pg.screenshot(path='/tmp/N_gala0.png')
        print(E("return interactList().map(l=>l.label).filter(x=>/Gala|Entrar/.test(x)).join('|')"))
        E("enterRoom('elite')");pg.wait_for_timeout(1200);pg.screenshot(path='/tmp/N_gala1.png')
        E("const r=ROOMS.elite;P.x=(r.x+20)*TS;P.y=(r.y+7)*TS;camInit=0");pg.wait_for_timeout(600);pg.screenshot(path='/tmp/N_gala2.png')
        print(E("return interactList().map(l=>l.label).join('|')").encode('utf-8')[:600].decode('utf-8','ignore'))
        E("const r=ROOMS.elite,it=r.items.find(i=>i.act==='galasit');roomAct(it,r)");pg.wait_for_timeout(300)
        E("ACT.galawait();const r=ROOMS.elite,it=r.items.find(i=>i.act==='galasit');roomAct(it,r)");pg.wait_for_timeout(4000);pg.screenshot(path='/tmp/N_gala3.png')
        for k in range(10):
            pg.wait_for_timeout(900);E("hideModal()")
            try:pg.click('[data-lv=bid]',timeout=400)
            except Exception:pass
            if k==3:pg.screenshot(path='/tmp/N_gala4.png')
        print('gala',E("return LIVE?[LIVE.i,LIVE.msg,LIVE.L.price,LIVE.L.leader]:'acabou'"))
        for k in range(200):
            pg.wait_for_timeout(1000)
            if E("return !LIVE"):break
            E("hideModal()")
        print('fim gala',E("return [!!LIVE,S.herd.length,Math.round(S.money),document.getElementById('mbox').innerText.slice(0,200)]"))
    if 'expo' in PH:
        E("hideModal();S.expo={until:S.day+5,n:0};S.t=10/24;for(let i=0;i<3;i++){const a=mk('nelorepo',i?'F':'M',i===2?400:900,92);a.w=wmax(a)*.95;addA(a)}const J=ensureJ();const H=S.herd.slice(-3);J.ent.touro=H[0].id;J.ent.vaca=H[1].id;J.ent.jovem=H[2].id;P.x=110*TS;P.y=78*TS;camInit=0;ACT.jgo()")
        pg.wait_for_timeout(3000);pg.screenshot(path='/tmp/N_expo1.png')
        for k in range(80):
            pg.wait_for_timeout(500);E("hideModal()")
            st=E("return EXPO?[EXPO.ph,EXPO.insp,EXPO.ents[EXPO.insp]&&EXPO.ents[EXPO.insp].me,EXPO.meter]:null")
            if st and st[0]=='insp' and st[2] and st[3]>0.66 and st[3]<0.86:
                E("expoApruma()");print('aprumou',E("return EXPO.msg"))
            if st and st[0]=='ribbon':pg.screenshot(path='/tmp/N_expo2.png');break
        pg.wait_for_timeout(500)
        for k in range(200):
            pg.wait_for_timeout(500)
            if E("return !EXPO"):break
            E("hideModal()")
        print('fim expo',E("return [!!EXPO,document.getElementById('mbox').innerText.slice(0,300)]"))
    if 'ger' in PH:
        E("hideModal();ensureEmp();S.emp.farms.leite={lvl:0,adm:1,val:4.2e6,paid:4.2e6,day:S.day};gerHire('sede')");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_ger1.png')
        E("document.querySelector('[data-act=gerok]').click()");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_ger2.png')
        E("gerHire('leite')");E("document.querySelector('[data-act=gerok]').click()")
        E("for(let i=0;i<5;i++)S.herd[i].sick=1;for(let d=0;d<65;d++){dayTick();hideModal()}");
        print('ger',E("return [S.gm.m.n,S.emp.farms.leite.mgr.n,S.herd.filter(a=>a.sick).length,S.cel.m.filter(m=>m.c.startsWith('g_')).map(m=>m.t).slice(-5).join(' || ')]"))
        E("hideModal();celOpen('faz')");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/N_ger3.png')
        E("hideModal();P.x=26*TS;P.y=52*TS;S.t=10/24;camInit=0;GMP.x=27*TS;GMP.y=52*TS");pg.wait_for_timeout(800);pg.screenshot(path='/tmp/N_ger4.png')
    if 'pick' in PH:
        E("hideModal();S.t=9/24;P.x=150*TS;P.y=110*TS;camInit=0;S.h.outfit='hunt';const a={id:++WID,sp:'deer',x:P.x+14,y:P.y+2,kg:70,hp:0,st:'dead',dt:0,dir:1,al:0,vis:1,bleed:0,bt:0,ph:0,cd:0,ft:0,fa:0,wait:0,stam:1,hitQ:'vital',male:1,pts:8};WILD.push(a);window._D=a;startPick(a)");pg.wait_for_timeout(400)
        box=lambda:E("const r=CV.getBoundingClientRect(),s=r.width/CV.width*PS;return [r.left+(P.x-CX)*s,r.top+(P.y-CY)*s]")
        for k in range(7):
            pg.wait_for_timeout(int(1000*(1.6+70/60)/6))
            bx=box();pg.screenshot(path='/tmp/N_pick%d.png'%k,clip={'x':max(0,bx[0]-60),'y':max(0,bx[1]-80),'width':120,'height':100})
        print('bag',E("return S.h.bag.length"))
        E("P.x+=20;P.moving=1");pg.wait_for_timeout(300);bx=box();pg.screenshot(path='/tmp/N_pick7.png',clip={'x':max(0,bx[0]-60),'y':max(0,bx[1]-80),'width':120,'height':100})
    print('ERROS',errs[:8]);b.close()
