# Detecta coisas "tremendo": entidades que invertem a direção várias vezes por segundo (bug do tipo das vacas no piquete)
import json
from playwright.sync_api import sync_playwright
SCEN=[('fazenda_piquetes',"S.up.piq=2;rebuildFence();for(let i=0;i<30;i++)S.herd.push(mk('nelore',i%2?'F':'M',ri(300,900),50));P.x=30*TS;P.y=48*TS;S.t=10/24",["movePq(2)","movePq(0)","movePq(1)"]),
 ('vila_dia',"P.x=125*TS;P.y=55*TS;S.t=11/24",[]),('vila_noite',"P.x=125*TS;P.y=55*TS;S.t=21/24",[]),('bar_frente',"P.x=147*TS;P.y=47*TS;S.t=20/24",[]),
 ('recinto',"P.x=101*TS;P.y=33*TS;S.t=10/24",[]),('touros',"P.x=114*TS;P.y=30*TS;S.t=10/24",[]),('rivais',"P.x=200*TS;P.y=70*TS;S.t=10/24",[]),('mata',"P.x=150*TS;P.y=110*TS;S.t=7/24",[]),
 ('estrada',"P.x=100*TS;P.y=46*TS;S.t=12/24;for(let i=0;i<4;i++)trfSpawn()",[]),('gringo',"P.x=188*TS;P.y=9*TS;S.t=10/24",[]),
 ('curral_noite',"S.up.curral=1;S.up.piq=1;rebuildFence();for(let i=0;i<25;i++)S.herd.push(mk('girolando',i%4?'F':'M',ri(100,900),50));P.x=20*TS;P.y=62*TS;S.t=22/24",[]),
 ('cachorros_seguindo',"P.x=40*TS;P.y=45*TS;S.t=10/24;window._walk=1",[]),
 ('piquetes_rapido',"speed=20;S.up.piq=2;rebuildFence();for(let i=0;i<30;i++)S.herd.push(mk('nelore',i%2?'F':'M',ri(300,900),50));P.x=30*TS;P.y=48*TS;S.t=8/24",["movePq(2)","movePq(0)","movePq(1)"]),
 ('vila_rapido',"speed=20;P.x=125*TS;P.y=55*TS;S.t=8/24",[]),
 ('festa',"P.x=125*TS;P.y=55*TS;S.t=21.5/24;S.day=S.day-S.day%30+24",[])]
JS="""(acts)=>{const ents=()=>{const L=[];const add=(k,o,x,y)=>{if(o&&isFinite(x)&&isFinite(y))L.push([k,o,x,y])};
 S.herd.forEach(a=>{const s=spriteOf(a);add('vaca:'+a.id,s,s.x,s.y)});NPCS.forEach(n=>add('npc:'+n.id,n,n.x,n.y));VPPL.forEach((v,i)=>add('vila:'+i,v,v.x,v.y));VDOGS.forEach((v,i)=>add('cão_vila:'+i,v,v.x,v.y));VCHK.forEach((v,i)=>add('galinha:'+i,v,v.x,v.y));
 WILD.forEach(w=>{if(Math.hypot(w.x-P.x,w.y-P.y)<500)add('bicho:'+w.sp+w.id,w,w.x,w.y)});(S.dogs||[]).forEach(d=>add('cão:'+d.id,d,d.x,d.y));BARF.forEach((v,i)=>add('bar:'+i,v,v.x,v.y));
 if(RVIS)add('visitante_recinto',RVIS,RVIS.x,RVIS.y);TRF.forEach((v,i)=>{const q=trfPos(v);add('carro:'+v.k+i,v,q.x,q.y)});COPS.forEach((c,i)=>add('pm:'+i,c,c.x,c.y));if(typeof IMPT!=='undefined'&&IMPT)add('caminhão_gringo',IMPT,IMPT.x,IMPT.y);
 if(typeof ensureRv==='function'){}return L};
 const H=new Map();let ai=0;const N=30*24;
 for(let f=0;f<N;f++){if(window._walk){const k=Math.floor(f/120)%4;P.x+=[1,0,-1,0][k]*1.2;P.y+=[0,1,0,-1][k]*1.2;P.moving=1;P.ph+=.2}if(acts.length&&f%(Math.floor(N/acts.length))===0&&ai<acts.length){eval(acts[ai++])}update(1/30);
  for(const [k,o,x,y] of ents()){let h=H.get(k);if(!h){h={o,px:x,py:y,vx:0,vy:0,flips:0,mov:0,path:0,x0:x,y0:y,fr:0};H.set(k,h)}const vx=x-h.px,vy=y-h.py;h.fr++;
   const sp=Math.hypot(vx,vy);if(sp>.04&&sp<20){h.mov++;h.path+=sp;if((vx*h.vx<0&&Math.abs(vx)>.03&&Math.abs(h.vx)>.03)||(vy*h.vy<0&&Math.abs(vy)>.03&&Math.abs(h.vy)>.03))h.flips++;if(Math.abs(vx)>.03)h.vx=vx;if(Math.abs(vy)>.03)h.vy=vy}
   if(sp>=20)h.tele=(h.tele||0)+1;h.px=x;h.py=y}}
 const out=[];for(const [k,h] of H){const secs=h.fr/30,fps=h.flips/Math.max(1,secs),net=Math.hypot(h.px-h.x0,h.py-h.y0);if((fps>1.2&&h.mov>h.fr*.4)||(h.tele>2))out.push(k+' inversões/s='+fps.toFixed(1)+' andando='+Math.round(100*h.mov/h.fr)+'% caminho='+Math.round(h.path)+' deslocamento='+Math.round(net)+(h.tele?' saltos='+h.tele:'')+' @'+Math.round(h.px/TS)+','+Math.round(h.py/TS))}
 return out}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);errs=[]
    for name,setup,acts in SCEN:
        pg=b.new_page(viewport={'width':844,'height':390});pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        pg.goto('file:///home/claude/build/world.html');pg.wait_for_timeout(700);pg.evaluate("()=>{try{localStorage.clear()}catch(e){}}");pg.reload();pg.wait_for_timeout(1200)
        pg.click('[data-t="newpick"]');pg.click('[data-t="create"]');pg.wait_for_timeout(2400)
        pg.evaluate("()=>{hideModal();S.tut=TUT.length;renderTutBox();toast=function(){};S.tutEnd=-99;"+setup+";camInit=0}")
        r=pg.evaluate(JS,acts)
        print('==',name,len(r));[print('   ',x) for x in r[:25]]
        pg.close()
    print('erros',errs[:5]);b.close()
