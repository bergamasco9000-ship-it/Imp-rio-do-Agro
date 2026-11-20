# Varredura completa de bugs: simulação longa + invariantes, salas, interações no mapa inteiro, crawler de botões, save/load
import json,sys,time
from playwright.sync_api import sync_playwright
PH=sys.argv[1:] or ['sim','rooms','world','crawl','save']
URL='file:///home/claude/build/world.html'
ALL={}
def newpage(b):
    pg=b.new_page(viewport={'width':844,'height':390},has_touch=True,is_mobile=True)
    errs=[]
    pg.on('pageerror',lambda e:errs.append('PE:'+(str(e.stack) or str(e))[:400].replace('file:///home/claude/build/world.html','')))
    pg.on('console',lambda m:(m.type=='error' and 'ERR_' not in m.text) and errs.append('CE:'+m.text[:300]))
    pg.on('dialog',lambda d:d.accept())
    pg.goto(URL);pg.wait_for_timeout(800);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1300)
    pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2600)
    pg.evaluate("()=>{hideModal();S.tut=TUT.length;renderTutBox();S.tips={preg:1,born:1,ready:1,labor:1,sick:1,emp:1,gringo:1}}")
    return pg,errs
LATE="""()=>{S.money=8e7;S.lv.xp=60*16*16;for(const k in UPS){const u=UPS[k];S.up[k]=(u.c||[1]).length}rebuildFence&&rebuildFence();S.rep=90;S.h.lic=S.day+999;
 for(const k in WEAPONS){S.h.own[k]=1}for(const k in AMMO)S.h.ammo[k]=200;for(let i=0;i<120;i++)S.herd.push(mk(pick(Object.keys(BREEDS)),i%3?'F':'M',ri(200,1600),ri(10,99)));
 try{ensureEmp&&ensureEmp()}catch(e){}try{ensureWd();for(const id in LUXI)S.wd.own[id]=1}catch(e){}S.tf=S.tf||{};S.tf.cabare=1;S.tf.tonhoOk=1}"""
def summary(name,errs,extra=None):
    u=[];[u.append(e) for e in errs if e not in u]
    ALL[name]={'n':len(errs),'uniq':u[:40],'extra':extra}
    print('=====',name,'erros:',len(errs),'únicos:',len(u));[print('  ',x[:330]) for x in u[:40]]
    if extra:print('  extra:',json.dumps(extra,ensure_ascii=False)[:3000])

with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
    # ---------- 1. simulação longa: 2 anos de jogo, com o jogador andando pelo mapa, checando invariantes
    if 'sim' in PH:
        pg,errs=newpage(b)
        r=pg.evaluate("""()=>{const out={bad:[],len:{}},E=[];const arrs=()=>({TRF:TRF.length,WILD:WILD.length,COPS:COPS.length,BLOOD:(typeof BLOOD!=='undefined'?BLOOD.length:0),toasts:document.getElementById('toast').children.length,herd:S.herd.length,NPCS:NPCS.length,SP:SP.size});
 const chk=(tag)=>{const B=[];if(!isFinite(S.money))B.push('money '+S.money);if(!isFinite(S.pasture)||S.pasture<0||S.pasture>100.5)B.push('pasture '+S.pasture);
  const ids=new Set();for(const a of S.herd){if(ids.has(a.id))B.push('id duplicado '+a.id);ids.add(a.id);if(!isFinite(a.w)||a.w<=0)B.push('peso '+a.id+' '+a.w);if(!isFinite(a.age))B.push('idade '+a.id);if(!BREEDS[a.breed])B.push('raça '+a.breed)}
  for(const k in S)if(typeof S[k]==='number'&&!isFinite(S[k]))B.push('S.'+k+'='+S[k]);
  if(B.length)out.bad.push(tag+': '+B.slice(0,6).join(' | '))};
 for(let d=0;d<730;d++){try{
   if(d%7===0){P.x=(5+Math.random()*200)*TS;P.y=(5+Math.random()*150)*TS;if(P.y>=RZ*TS)P.y=60*TS}
   for(let k=0;k<12;k++){update(1/20)}if(d%10===0)drawScene();
   dayTick();if(document.getElementById('modal').style.display==='flex')hideModal();
   if(d%30===0){chk('dia'+d);out.len['d'+d]=arrs()}
  }catch(e){E.push('d'+d+': '+e.message+' @'+(e.stack||'').split('\\n').slice(1,3).join(' '));if(E.length>12)break}}
 chk('fim');out.len.fim=arrs();out.E=E;out.money=Math.round(S.money);out.herd=S.herd.length;return out}""")
        errs+= r['E']
        summary('simulação 2 anos',errs,{'invariantes':r['bad'][:15],'arrays':r['len'],'money':r['money'],'herd':r['herd']})
        pg.close()
    # ---------- 2. todas as salas: entrar, interagir com cada item, clicar cada botão do modal
    if 'rooms' in PH:
        pg,errs=newpage(b)
        pg.evaluate(LATE)
        pg.evaluate("()=>{S.t=22/24}")
        rooms=pg.evaluate("Object.keys(ROOMS)")
        noact=[];labels={}
        for rid in rooms:
            n=pg.evaluate("""(rid)=>{const r=ROOMS[rid];RET={x:60*TS,y:50*TS};P.x=(r.x+r.w/2)*TS;P.y=(r.y+r.h-2)*TS+8;camInit=0;try{update(1/30);drawScene()}catch(e){console.error('room draw '+rid+': '+e.message)}return (r.items||[]).length}""",rid)
            for i in range(n):
                res=pg.evaluate("""([rid,i])=>{const r=ROOMS[rid],it=r.items[i];if(!it.act)return null;hideModal();const x=(r.x+it.x+(it.w||1)/2)*TS,y=(r.y+it.y+(it.h||1))*TS+4;P.x=x;P.y=y+8;
   let L;try{L=interactList()}catch(e){console.error('interactList '+rid+': '+e.message);return 'ERR'}const e=L.find(l=>Math.abs(l.x-x)<2&&Math.abs(l.y-y)<2);if(!e)return 'sem rótulo: '+rid+'.'+it.k+' act='+it.act;
   try{e.fn()}catch(err){console.error('act '+rid+'.'+it.act+': '+err.message+' '+(err.stack||'').split('\\n')[1])}return e.label}""",[rid,i])
                if res and res.startswith('sem rótulo'):noact.append(res)
                elif res: labels[rid+'.'+str(i)]=res
                pg.wait_for_timeout(30)
                k=pg.evaluate("document.getElementById('modal').style.display==='flex'?document.querySelectorAll('#mbox [data-act]').length:0")
                for j in range(min(k,14)):
                    pg.evaluate("""([rid,i,j])=>{const bl=['close','totitle','bkok','bkdo','bkrest','delok','reset2','tutskip','sleep','cmdpay'];const r=ROOMS[rid],it=r.items[i];const el=document.querySelectorAll('#mbox [data-act]')[j];if(el&&!bl.includes(el.dataset.act))try{el.click()}catch(e){console.error('btn '+e.message)}
     hideModal();const x=(r.x+it.x+(it.w||1)/2)*TS,y=(r.y+it.y+(it.h||1))*TS+4;P.x=x;P.y=y+8;const L=interactList(),e=L.find(l=>Math.abs(l.x-x)<2&&Math.abs(l.y-y)<2);if(e)try{e.fn()}catch(err){}}""",[rid,i,j])
                pg.evaluate("()=>{hideModal();if(typeof closeMenu==='function')closeMenu()}")
            # sair da sala
            pg.evaluate("()=>{try{exitRoom()}catch(e){console.error('exitRoom: '+e.message)}}");pg.wait_for_timeout(450)
        summary('salas ('+str(len(rooms))+')',errs,{'itens com ação sem rótulo':noact[:30]})
        pg.close()
    # ---------- 3. mapa inteiro: toda interação disponível em cada ponto (portas, NPCs, placas, segredos)
    if 'world' in PH:
        pg,errs=newpage(b)
        pg.evaluate(LATE)
        r=pg.evaluate("""()=>{const seen=new Set(),E=[],stuck=[],n={pts:0,acts:0};
 for(let ty=2;ty<RZ-2;ty+=2)for(let tx=2;tx<MW-2;tx+=2){P.x=tx*TS+8;P.y=ty*TS+8;n.pts++;let L;try{L=interactList()}catch(e){E.push('interactList @'+tx+','+ty+': '+e.message);continue}
  for(const l of L){const key=l.label+'|'+Math.round(l.x/32)+','+Math.round(l.y/32);if(seen.has(key))continue;seen.add(key);n.acts++;const bx=P.x,by=P.y;
   try{l.fn()}catch(e){E.push('fn "'+l.label+'" @'+tx+','+ty+': '+e.message+' '+(e.stack||'').split('\\n')[1])}
   try{hideModal();if(menuOpen)closeMenu();if(inRoom()){exitRoom()}}catch(e){E.push('pós "'+l.label+'": '+e.message)}
   P.x=bx;P.y=by;S.horseOn=false;if(P.drive&&typeof vExit==='function')try{vExit()}catch(e){}P.drive=null}}
 // NPCs presos dentro de parede
 for(const c of NPCS){const tx=Math.floor(c.x/TS),ty=Math.floor(c.y/TS);if(SOL[ti(tx,ty)])stuck.push(c.id+' @'+tx+','+ty)}
 return {E,n,stuck}}""")
        pg.wait_for_timeout(1500)
        summary('mapa inteiro',errs+r['E'],{'pontos/ações':r['n'],'NPCs dentro de parede':r['stuck']})
        pg.close()
    # ---------- 4. crawler de botões: todas as abas do menu, NPCs, prédios, lojas, até 2 níveis
    if 'crawl' in PH:
        pg,errs=newpage(b)
        pg.evaluate(LATE)
        roots=pg.evaluate("""()=>{const R=[];TABS.forEach(t=>R.push('openMenu("'+t[0]+'")'));NPCS.forEach(n=>R.push('npcModal("'+n.id+'")'));BLD.forEach(b=>R.push('enterBld("'+b.id+'")'));
  if(typeof LUXS!=='undefined')LUXS.forEach(s=>R.push('luxStore("'+s.id+'")'));['muralModal()','fishShop()','kennelModal()','coopModal()','sleepModal()','helpModal()','useModal()','lodgeModal("arms")','lodgeModal("sell")','cmdMain(1)','cmdArms()','breedGuide()','impModal&&impModal()'].forEach(f=>R.push(f));return R}""")
        bl=['close','totitle','bkok','bkdo','bkrest','delok','reset2','tutskip','menuclose','help','reload','newgame','tdel','tdelok']
        done=0
        for root in roots:
            try:pg.evaluate("()=>{hideModal();closeMenu();if(inRoom())exitRoom();"+root+"}")
            except Exception as e:errs.append('root '+root+': '+str(e)[:160]);continue
            sel="(menuOpen?'#panel [data-act]':'#mbox [data-act]')"
            n=pg.evaluate("document.querySelectorAll("+sel+").length")
            for i in range(min(n,40)):
                for j in range(-1,6):
                    try:
                        pg.evaluate("""([root,i,j,bl])=>{hideModal();closeMenu();if(inRoom())exitRoom();eval(root);const s=menuOpen?'#panel [data-act]':'#mbox [data-act]';const el=document.querySelectorAll(s)[i];if(!el||bl.includes(el.dataset.act))return;el.click();
   if(j>=0){const s2=document.getElementById('modal').style.display==='flex'?'#mbox [data-act]':(menuOpen?'#panel [data-act]':null);if(!s2)return;const e2=document.querySelectorAll(s2)[j];if(e2&&!bl.includes(e2.dataset.act))e2.click()}}""",[root,i,j,bl])
                        done+=1
                    except Exception as e:errs.append('crawl '+root+' '+str(i)+'/'+str(j)+': '+str(e)[:200])
            if len(errs)>200:break
        pg.evaluate("()=>{hideModal();closeMenu()}")
        summary('crawler de botões',errs,{'cliques':done,'raízes':len(roots)})
        pg.close()
    # ---------- 5. save → recarregar → continuar: dados batem?
    if 'save' in PH:
        pg,errs=newpage(b)
        pg.evaluate(LATE)
        pg.evaluate("()=>{for(let d=0;d<40;d++){dayTick();hideModal()}save()}")
        a=pg.evaluate("()=>JSON.stringify(S)")
        pg.reload();pg.wait_for_timeout(1500)
        pg.evaluate("()=>{const b=[...document.querySelectorAll('[data-t]')].find(x=>/continuar/i.test(x.textContent));if(b)b.click()}");pg.wait_for_timeout(2500)
        bb=pg.evaluate("()=>S?JSON.stringify(S):null")
        diff=[]
        if bb:
            A=json.loads(a);B=json.loads(bb)
            for k in A:
                if k not in B:diff.append('sumiu '+k)
                elif json.dumps(A[k],sort_keys=True)!=json.dumps(B[k],sort_keys=True) and k not in ('t','lastSave','saved','ts','play','pt'):diff.append('mudou '+k)
        else: diff.append('não carregou')
        pg.evaluate("()=>{for(let k=0;k<200;k++)update(1/30);drawScene()}")
        summary('save/load',errs,{'diferenças':diff[:30]})
        pg.close()
    b.close()
json.dump(ALL,open('/tmp/sweep_result.json','w'),ensure_ascii=False,indent=1)
