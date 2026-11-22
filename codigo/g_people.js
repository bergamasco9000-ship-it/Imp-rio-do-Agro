let HLEAN=0;
// ===== Pessoas com mais detalhe (jogador, parceiro, moradores, peões, visitantes) + correção do tutorial =====
(()=>{const st=document.createElement('style');st.textContent='#tut button,#tut .btns{pointer-events:auto}';document.head.appendChild(st)})();
function setH(el,h){if(!el)return;if(el._h!==h){el._h=h;el.innerHTML=h}}
// tutorial: a caixa só é redesenhada quando muda (antes era recriada a cada 0,2 s e o botão "Entendi!" não pegava o toque)
renderTutBox=function(){const el=$('tut');if(!el)return;let h='';
 if(S.tut<TUT.length){const s=TUT[S.tut];h='<b class="gold">Tutorial '+(S.tut+1)+'/'+TUT.length+'</b><br>'+s.t+(s.tap?'<div class="btns"><button class="b gold" data-act="tutok">Entendi!</button></div>':'')}
 else if(S.q&&S.q.act.length){const a=S.q.act[0];h='<b class="gold">📜 '+npcById(a.giver).n+'</b><br>'+qText(a)}
 el.style.display=h?'block':'none';setH(el,h)};
ACT.tutok=function(){S.tf.final=1;const s=TUT[S.tut];if(s&&s.tap&&s.done()){cash(s.rw[0],'Tutorial');gainXP(s.rw[1],'tutorial');S.tut++;toast(S.tut>=TUT.length?'🎓 Tutorial concluído! Agora é com você.':'✅ Passo concluído! +'+R$(s.rw[0]),'good');renderTutBox()}};
// ---------- utilidades
const hsh=s=>{let h=7;s=String(s);for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)};
const SKINS=['#f4d0b0','#e8b890','#d8a070','#c08458','#a86e44','#8a5a36','#6a4228'];
// ---------- o boneco detalhado
function drawHuman(g,o,L){
 const x=o.x,y=o.y,dir=o.dir||0,side=dir>=2,dr=dir===3?1:-1,mv=!!o.mv,ph=o.ph||0,sw=mv?Math.sin(ph):0,id=o.hid||0;
 const breath=mv?0:Math.sin(frame/38+id)*.22,bob=o.bob!==undefined?o.bob:(mv?Math.abs(Math.cos(ph))*(o.run?1.4:.8):0),sn=o.sneak?2.5:0;
 const by=y-bob+sn,f=L.g==='f',sk=L.skin,skD=shade(sk,-18),skL=shade(sk,10),hc=L.hc,hcD=shade(hc,-22),hcL=shade(hc,22);
 const sc=L.sc,scD=shade(sc,-26),scL=shade(sc,18),pc=L.pc,pcD=shade(pc,-22),pcL=shade(pc,16),bt=L.boots,btD=shade(bt,-25);
 const blink=((frame+id*53)%230)<5,wk=o.work?Math.sin(frame/3.2):0,R=(c,a,b,w,h)=>Rr(g,c,a,b,w,h);
 const sY=by-17.5+breath*.5,wY=by-10.2; // ombro e cintura
 // sombra
 R('rgba(0,0,0,.28)',x-5,y-1.2,10,2.4);R('rgba(0,0,0,.18)',x-6,y-.8,12,1.6);
 const camo=L.camo,ck=L.camoK||'wood',blot=(cx,cy,w,h,seed)=>{if(!camo)return;
  if(ck==='full'){for(let i=0;i<w;i+=1.05){const r=hsh(seed*7+Math.round(i*13));R(camo[1],cx+i,cy+(r%30)/30*1.6,.45,h-(r%30)/30*2.2);if(r%3===0)R(shade(camo[1],-14),cx+i+.4,cy+((r>>5)%30)/30*h*.6,.35,h*.3)}
   for(let i=0;i<Math.floor(w*h/4.5);i++){const r=hsh(seed*31+i*7),lx=cx+(r%100)/100*(w-1.8),ly=cy+((r>>7)%100)/100*(h-1.6),lc=[camo[2],'#6a7a3a','#8a7a4a','#4a5a2a'][i%4];R(lc,lx,ly,1.6,.8);R(lc,lx+.4,ly-.4,.8,1.6)}return}
  if(ck==='ghillie'){for(let i=0;i<Math.floor(w*h/3);i++){const r=hsh(seed*17+i*5);R([camo[1],camo[2],'#6a6a3a','#5a4a2a','#8a8a4a'][i%5],cx+(r%100)/100*(w-.6),cy+((r>>7)%100)/100*(h-1.6),.5,1.4+(r>>14)%2*.8)}return}
  const cols=[camo[1],camo[2],'#1c1c16','#b8a878'];for(let i=0;i<Math.floor(w*h/5.5)+2;i++){const r=hsh(seed*13+i*17),k=i%4,c2=cols[k],bx=cx+(r%100)/100*(w-2.2),byy=cy+((r>>7)%100)/100*(h-1.6);
   if(k===2){R(c2,bx,byy,.9,.7);R(c2,bx+.5,byy+.4,.7,.6)}else if(k===3){R(c2,bx,byy,1.2,.6)}else{const ww=2+(r>>14)%3*.6;R(c2,bx,byy,ww,1);R(c2,bx+.5,byy+.8,ww*.7,.8);R(c2,bx-.3,byy+.4,.6,.6)}}};
 // ---------- cabelo comprido atrás do corpo
 if(!side&&dir===0&&(L.hair==='comprido')&&!L.scarf){R(hcD,x-4,by-21,8,7);}
 // ---------- pernas e botas
 const skirt=L.skirt;
 if(side){const st=o.run&&mv?4.2:3,o1=sw*st,o2=-o1,cp=mv?Math.cos(ph)*dr:0,lk=o.run?1.9:1.15,lift1=mv?Math.max(0,cp)*lk:0,lift2=mv?Math.max(0,-cp)*lk:0,crouch=o.sneak?1:0;
  const leg=(ox,c,cD,lf)=>{const lx=x-1.25+ox*.85,kb=-dr*lf*(o.run?1.2:.85)+dr*crouch*1.5,kT=by-5.9,bot=by-2.3-lf,th=kT-(by-9.5)+.5;
   R(c,lx,by-9.5,2.5,th);R(c,lx+kb,kT,2.5,bot-kT);R(cD,lx+(dr>0?0:1.9),by-9.5,.6,th);R(cD,lx+kb+(dr>0?0:1.9),kT,.6,bot-kT);
   if(Math.abs(kb)>.3){R(c,lx+kb*.5,kT-.6,2.5,1.4);R(shade(c,-10),lx+kb*.5+(dr>0?1.7:0),kT-.4,.8,.9)}
   if(L.crease){R(shade(c,16),lx+(dr>0?1.8:.4),by-9.3,.3,th-.3);R(shade(c,16),lx+kb+(dr>0?1.8:.4),kT,.3,bot-kT-.2)}if(L.cargoP)R(cD,lx+.5,by-6.8,1.6,1.9);if(L.pants==='bombacha')R(c,lx-.4+kb*.4,by-7.5,3.3,3.5-lf);
   const bx=x-1.4+ox+kb,byy=y-2.6-lf;R(bt,bx,byy,2.8,2.6);R(bt,bx+(dr>0?2.2:-1),byy+1,1.6,1.6);R(btD,bx-(dr>0?.2:0),byy+2.1,3.4+.6,.5);if(L.bootP)luxBoot(R,L,bx,byy-(L.tallBoot?2:0),2.8,2.6+(L.tallBoot?2:0));R(btD,bx+(dr>0?0:2.2),byy+2,.8,.6);R(shade(bt,15),bx,byy,2.8,.5);if(L.tallBoot){R(bt,bx+.1,byy-2,2.6,2.2);R(shade(bt,15),bx+.1,byy-2,2.6,.4);for(let k=0;k<3;k++)R('#c8b890',bx+(dr>0?1.8:.4),byy-1.6+k*.7,.5,.3)}if(L.hunt&&c!==sk){R(shade(c,-16),lx+(dr>0?.3:.2),by-8,2,2);R(shade(c,-28),lx+(dr>0?.3:.2),by-8,2,.4)}};
  if(skirt){leg(o2,skD,skD,lift2);leg(o1,sk,skD,lift1);}else{leg(o2,pcD,shade(pcD,-15),lift2);leg(o1,pc,pcD,lift1)}
 }else{const lk=o.run?2.4:1.5,l1=mv?Math.max(0,sw)*lk:0,l2=mv?Math.max(0,-sw)*lk:0,spr=o.sneak?.7:0;
  const leg=(lx,lf,c,cD)=>{R(c,lx,by-9.5,2.5,7.2-lf);R(cD,lx+1.9,by-9.5,.6,7.2-lf);if(!skirt){if(L.crease)R(shade(c,16),lx+1.05,by-9.3,.3,6.9-lf);if(L.cargoP){R(cD,lx+(lx<x?-.25:1.45),by-6.8,1.3,1.9);R(shade(c,12),lx+(lx<x?-.25:1.45),by-6.8,1.3,.3)}}if(L.pants==='jeans'&&!skirt)R(pcL,lx+.5,by-8,.4,4);if(L.pants==='bombacha'&&!skirt){R(c,lx-.5,by-8,3.5,3.8-lf);R(cD,lx+.4,by-7.5,.4,3)}
   const byy=y-2.6-lf;R(bt,lx-.15,byy,2.8,2.6);R(shade(bt,18),lx-.15,byy,2.8,.5);R(btD,lx-.3,byy+2.1,3.1,.5);if(L.bootP)luxBoot(R,L,lx-.15,byy-(L.tallBoot?2:0),2.8,2.6+(L.tallBoot?2:0));if(dir===0)R(shade(bt,10),lx+.3,byy+1.2,1.4,.6);if(L.tallBoot){R(bt,lx-.05,byy-2,2.6,2.2);R(shade(bt,15),lx-.05,byy-2,2.6,.4);if(dir===0)for(let k=0;k<3;k++)R('#c8b890',lx+1,byy-1.6+k*.7,.6,.3)}if(L.hunt&&c!==sk&&dir===0){R(shade(c,-16),lx+(lx<x?-.3:1.2),by-8.2,1.7,2.1);R(shade(c,-28),lx+(lx<x?-.3:1.2),by-8.2,1.7,.4)}};
  if(skirt){leg(x-3-spr,l1,sk,skD);leg(x+.5+spr,l2,sk,skD)}else{leg(x-3-spr,l1,pc,pcD);leg(x+.5+spr,l2,pc,pcD);R(pc,x-1-spr,by-9.5,2+spr*2,1.5);if(spr){R(shade(pc,-14),x-3-spr,by-6.4,2.5,.6);R(shade(pc,-14),x+.5+spr,by-6.4,2.5,.6)}}
 }
 if(skirt){const top=by-11,h=6.8;for(let i=0;i<h;i+=.5){const w=(side?5.6:7)+i*.45;R(i%2?skirt:shade(skirt,-6),x-w/2,top+i,w,.5)}R(shade(skirt,-25),x-((side?5.6:7)+h*.45)/2,top+h-.5,(side?5.6:7)+h*.45,.5);R(shade(skirt,20),x-(side?2.8:3.5),top,(side?5.6:7),.5)}
 blot(x-3.2,by-9.5,6.4,7,id+3);
 const lean=side&&mv&&o.run?dr*.9:side&&o.sneak?dr*1.1:0;if(lean){g.save();g.translate(Math.round(lean*PS)/PS,0)}HLEAN=lean;
 // ---------- braço de trás (perfil)
 const runA=!!(o.run&&mv&&!o.work),armSw=o.work?wk*2.6:sw*(runA?3.2:2.4),sleeve=L.shirt==='regata'?sk:(L.coat||L.slv||sc),sleeveD=shade(sleeve,-30);
 if(side){const ax=x-.8-armSw*dr;if(runA){R(sleeveD,ax,sY+1,1.7,3.6);const fx=ax+(armSw*dr<0?dr*1.1:-dr*.5);R(sleeveD,fx,sY+3.8,1.7,1.7);R(shade(sk,-25),fx+dr*.3,sY+5.1,1.5,1.3)}else{R(sleeveD,ax,sY+1,1.7,5);R(shade(sk,-25),ax+.1,sY+6,1.5,1.4)}}
 // ---------- tronco
 const fem=f&&!L.coat;
 for(let i=0;i<7.4;i+=.5){const t=i/7.4,w=side?(5.2-t*.4+(fem&&t>.25&&t<.5?.6:0)):(f?8.2-t*1.6+(t>.8?.4:0):9-t*1.6);const tx=side?x-2.6+(fem&&t>.25&&t<.5&&dr>0?0:0):x-w/2;
  R(sc,side?x-w/2+(dr>0?.3:-.3):tx,sY+i,w,.5)}
 if(L.belly){R(sc,x-(side?(dr>0?2:3.6):4.7),wY-3.4,side?5.6:9.4,3.6);R(scD,x-(side?(dr>0?2:3.6):4.7),wY-.4,side?5.6:9.4,.5)}
 const tL=side?x-2.6:x-4.5,tW=side?5.2:9;
 if(!side){R(scD,x+2.6,sY+.5,1.2,7);R(scL,x-3.6,sY+.5,.8,6)}else R(scD,x+(dr>0?-2.6:1.6),sY+.5,1,7);
 // estampas e detalhes da camisa
 const st=L.shirt;
 if(st==='xadrez'){for(let i=0;i<tW;i+=1.6)R(scD,tL+i,sY,.6,7.4);for(let j=.8;j<7.4;j+=1.6)R(scD,tL,sY+j,tW,.5);for(let i=.8;i<tW;i+=3.2)R(scL,tL+i,sY,.3,7.4)}
 else if(st==='jeans'){R(shade(sc,-10),tL,sY,tW,.6);if(!side&&dir===0){R(scL,x-3.2,sY+1.4,2,1.6);R(scL,x+1.2,sY+1.4,2,1.6);R('#e0c060',x-.2,sY+.8,.4,6)}}
 else if(st==='camo'){blot(tL,sY,tW,7.4,id)}
 else if(st==='farda'){if(dir===0){R(scD,x-3.4,sY+1.4,2.2,1.8);R(scD,x+1.2,sY+1.4,2.2,1.8);R(scL,x-3.4,sY+1.4,2.2,.4);R(scL,x+1.2,sY+1.4,2.2,.4);R(shade(sc,-12),x-.2,sY+.5,.4,6.8)}R(scD,x-4.6,sY,1.6,.7);R(scD,x+3,sY,1.6,.7)}
 else if(st==='polo'&&dir===0){R(scL,x-1.6,sY,3.2,1);R(scD,x-.3,sY+1,.6,2);R('#e0e0e0',x+1.6,sY+2,1,1)}
 if(L.print&&L.print.length)for(let i=0;i<22;i++){const r=hsh(i*29+7),px=tL+(r%100)/100*(tW-.8),py=sY+((r>>7)%100)/100*6.8,c=L.print[i%L.print.length];R(c,px,py,.8,.6);R(c,px+.2,py-.2,.4,1);R(shade(c,-30),px+.5,py+.4,.3,.3)}
 if(L.vest){const vc=L.vest;if(side)R(vc,x-2.6+(dr>0?0:.4),sY,4.8,7.4);else{R(vc,x-4.5,sY,3.2,7.4);R(vc,x+1.3,sY,3.2,7.4);if(dir===1)R(vc,x-4.5,sY,9,7.4);R(shade(vc,-20),x-1.4,sY+.5,.4,6.8);R(shade(vc,-20),x+1.2,sY+.5,.4,6.8);if(L.vestPk){R(shade(vc,-15),x-4,sY+3.5,2,1.6);R(shade(vc,-15),x+2,sY+3.5,2,1.6)}}}
 if(L.jacket){const jc=L.jacket;if(!side&&dir===0){R(jc,x-4.6,sY,3.4,7.6);R(jc,x+1.2,sY,3.4,7.6);R(shade(jc,-25),x-1.3,sY,.5,7.6);R(shade(jc,-25),x+1.1,sY,.5,7.6);R(shade(jc,15),x-2.4,sY,1,2);R(shade(jc,15),x+1.6,sY,1,2)}else R(jc,side?x-2.6:x-4.5,sY,side?5.2:9,7.6)}
 if(L.jacket&&L.jk)luxJacket(R,L,x,sY,wY,dir,side,dr);
 if(L.coat&&!side&&dir===0){R(scL,x-1.2,sY,2.4,4)}
 if(L.coat){const cc=L.coat,ccD=shade(cc,-18);if(!side&&dir===0){R(cc,x-4.8,sY,3.6,10);R(cc,x+1.2,sY,3.6,10);R(ccD,x-1.4,sY+1,.4,9);R(ccD,x-4,sY+5,1.8,1.4);R(ccD,x+2.2,sY+5,1.8,1.4)}else if(dir===1)R(cc,x-4.6,sY,9.2,10.4);else{R(cc,x-2.8,sY,5.6,10.4);R(ccD,x+(dr>0?-2.8:2.3),sY,.5,10.4)}}
 // colarinho, botões, gravata
 if(dir===0&&!L.coat){if(st!=='regata'&&st!=='camo'){R(scL,x-1.8,sY-.2,1.6,1.2);R(scL,x+.2,sY-.2,1.6,1.2);R(skD,x-.5,sY,1,1)}
  if(st==='xadrez'||st==='lisa'||st==='social'){for(let j=1.6;j<7;j+=1.8)R(shade(sc,35),x-.25,sY+j,.5,.5)}
  if(st==='lisa'||st==='xadrez')R(scD,x-3.4,sY+1.6,2,.4)}
 if(L.tie&&dir===0){R(L.tie,x-.5,sY+.4,1,5);R(shade(L.tie,-20),x-.7,sY+.2,1.4,.8)}
 if(L.scarfN&&dir!==1){R(L.scarfN,x-2.2,sY-.4,4.4,1.4);if(dir===0){R(L.scarfN,x-.6,sY+.8,1.6,2.4);R(shade(L.scarfN,-20),x-.6,sY+2.6,1.6,.5);if(L.scarfP){R(L.scarfN,x+.6,sY+.6,1.4,3.6);for(let i=0;i<4;i++){R(L.scarfP,x-1.9+i*1.1,sY-.1,.35,.35);R(L.scarfP,x-.3,sY+1+i*.5,.3,.3);R(L.scarfP,x+1,sY+1.2+i*.6,.3,.3)}for(let i=0;i<3;i++){R(shade(L.scarfN,-30),x-.5+i*.5,sY+3.1,.25,.8);R(shade(L.scarfN,-30),x+.7+i*.45,sY+4.2,.25,.8)}}}else if(L.scarfP){R(L.scarfN,x+(dr>0?-2.2:.8),sY+.8,1.4,3);R(L.scarfP,x-1,sY,.35,.35)}}
 if(L.apron&&dir!==1){const ac=L.apron;if(side)R(ac,x+(dr>0?.6:-2.6),sY+1.6,2,9);else{R(ac,x-3,sY+1.2,6,9.4);R(shade(ac,-10),x-3,sY+5.6,6,.5);R(shade(ac,-15),x-2,sY+6.6,4,2);R(ac,x-.4,sY-.2,.8,1.4)}}
 // cinto
 if(!skirt&&!L.coat){if(L.beltK)luxBelt(R,L,x,wY,dir,side,dr);else{R('#3a2414',x-(side?2.6:4.1),wY,side?5.2:8.2,1.1);if(dir===0){R(L.buckle||'#d8b860',x-.9,wY-.1,1.8,1.3);R(shade(L.buckle||'#d8b860',-30),x-.4,wY+.3,.8,.5)}else if(side)R('#d8b860',x+dr*2.2-.4,wY,.8,1.1)}}
 if(L.holster&&!L.coat){const hx=side?x-dr*1.4:x+3.2;R('#2a1a10',hx,wY+.4,1.6,3.2);R('#1a1a1a',hx+.4,wY-.6,.8,1.4)}
 if(L.badge&&dir===0){R('#ffd75e',x-3.2,sY+1.4,1.4,1.4);R('#c8a030',x-2.8,sY+1.8,.6,.6)}
 if(L.steth&&dir===0){R('#3a3a3a',x-1.8,sY,.4,3.6);R('#3a3a3a',x+1.4,sY,.4,3.6);R('#3a3a3a',x-1.8,sY+3.4,3.6,.4);R('#b8c0c8',x-.4,sY+3.6,1,1)}
 if(L.bag)luxBag(R,L,x,sY,wY,dir,side,dr);
 if(L.hunt){const vc=L.huntVest||'#4a4a32',vD=shade(vc,-22),vL=shade(vc,14);
  if(dir===0){R(vc,x-4.6,sY+.2,3.3,7.6);R(vc,x+1.3,sY+.2,3.3,7.6);R(vD,x-1.4,sY+.3,.4,7.4);R(vD,x+1.2,sY+.3,.4,7.4);R(vL,x-4.6,sY+.2,3.3,.5);R(vL,x+1.3,sY+.2,3.3,.5);
   for(let i=0;i<5;i++){R('#c8a040',x-4.3+i*.62,sY+2.2,.42,1.2);R('#8a2a1a',x-4.3+i*.62,sY+3.2,.42,.4)}R(vD,x-4.4,sY+1.9,3,.35);R(vD,x+1.6,sY+4.2,2.6,2.4);R(vL,x+1.6,sY+4.2,2.6,.5);R('#9a9aa0',x+2.6,sY+4.4,.6,.4);R(vD,x-4.3,sY+5.2,2.6,2);R(vL,x-4.3,sY+5.2,2.6,.45);
   if(L.binoc){R('#1e1e1e',x-1.7,sY+.2,.35,2.6);R('#1e1e1e',x+1.35,sY+.2,.35,2.6);R('#2a2a2a',x-1.8,sY+2.6,1.5,2.2);R('#2a2a2a',x+.3,sY+2.6,1.5,2.2);R('#3a3a3a',x-.4,sY+3.2,.8,.8);R('#6a8aa8',x-1.6,sY+4.6,1.1,.4);R('#6a8aa8',x+.5,sY+4.6,1.1,.4)}
   if(L.pack){R('#4a3e2a',x-3.9,sY-.2,1,4);R('#4a3e2a',x+2.9,sY-.2,1,4)}}
  else if(dir===1){if(L.pack){R('#5a4e34',x-3.6,sY+.2,7.2,8);R(shade('#5a4e34',-20),x-3.6,sY+7.6,7.2,.6);R('#6a5e44',x-3.4,sY+.2,6.8,2.2);R('#3a3020',x-.4,sY+2.2,.8,1.2);R('#4a3e2a',x-3,sY+4.4,6,.5);R('#3a3a3a',x-3.6,sY+3,.6,3);R('#3a3a3a',x+3,sY+3,.6,3);R('#7a6a4a',x-2.8,sY+5,2.4,2);R('#7a6a4a',x+.4,sY+5,2.4,2)}else{R(vc,x-4.6,sY+.2,9.2,7.6);R(vL,x-4.6,sY+.2,9.2,.5);R(vD,x-.2,sY+.6,.4,7);R(vD,x-4.6,sY+3.6,9.2,.4);R(vD,x-3.8,sY+4.4,3,2.2);R(vD,x+.8,sY+4.4,3,2.2);R(vL,x-3.8,sY+4.4,3,.4);R(vL,x+.8,sY+4.4,3,.4)}}
  else{R(vc,x-2.7+(dr>0?.1:.3),sY+.2,5,7.6);R(vD,x-2.7+(dr>0?.1:.3),sY+3.8,5,.4);R(vD,x+(dr>0?.4:-2.2),sY+4.2,1.8,2);for(let i=0;i<3;i++)R('#c8a040',x+(dr>0?.6:-2)+i*.6,sY+2.2,.4,1.1);
   if(L.pack){const px=x-dr*3.2-(dr>0?1.6:0);R('#5a4e34',px,sY+.2,2.6,7.4);R('#6a5e44',px,sY+.2,2.6,1.6);R('#3a3020',x-dr*.2-.3,sY,.6,7)}}
  const kx=side?x-dr*.6-.5:x+3.3;if(dir!==1){R('#3a2414',kx,wY+.5,1.1,3.4);R('#c8c8c8',kx+.25,wY-.6,.6,1.2);R('#2a1a10',kx+.15,wY-1,.8,.5)}}
 // ---------- braços (frente)
 const hand=(hx,hy)=>{R(L.gloves||sk,hx,hy,1.7,1.6);R(L.gloves?shade(L.gloves,-20):skD,hx,hy+1.1,1.7,.5)};
 if(side){const ax=x-.8+armSw*dr,ay=sY+1+(o.work?-1.5:0);
  if(runA){R(sleeve,ax-.1,ay-.6,1.9,4);R(sleeveD,ax+(dr>0?1.3:-.1),ay,.5,3.4);const fx=ax+(armSw*dr>0?dr*1.2:-dr*.5);R(sleeve,fx-.1,ay+2.6,1.9,1.9);if(L.shirt!=='regata')R(L.cuff||shade(sleeve,20),fx-.1,ay+4,1.9,.5);hand(fx+dr*.2,ay+4.2)}
  else{R(sleeve,ax-.1,ay-.6,1.9,5.6);R(sleeveD,ax+(dr>0?1.3:-.1),ay,.5,5);if(L.shirt!=='regata')R(L.cuff||shade(sleeve,20),ax-.1,ay+4.6,1.9,L.cuff?.7:.5);hand(ax,ay+5)}}
 else{const ka=runA?1.7:.9,a1=o.work?wk*2.5-1.5:sw*ka-(runA?1.6:0),a2=o.work?-wk*2.5-1.5:-sw*ka-(runA?1.6:0),ax1=x-(f?5.6:6),ax2=x+(f?3.9:4.3);
  R(sleeve,ax1,sY+.4+a1*.3,1.8,6+a1*.4);R(sleeve,ax2,sY+.4+a2*.3,1.8,6+a2*.4);R(sleeveD,ax1,sY+.4,.5,6);R(sleeveD,ax2+1.3,sY+.4,.5,6);
  if(L.shirt!=='regata'){R(L.cuff||shade(sleeve,22),ax1,sY+5.9+a1*.7-(L.cuff?.2:0),1.8,L.cuff?.7:.5);R(L.cuff||shade(sleeve,22),ax2,sY+5.9+a2*.7-(L.cuff?.2:0),1.8,L.cuff?.7:.5);if(L.slvHi){R(shade(sleeve,30),ax1+.3,sY+1+a1*.3,.35,3.5);R(shade(sleeve,30),ax2+.3,sY+1+a2*.3,.35,3.5)}}
  hand(ax1+.05,sY+6.3+a1*.7);hand(ax2+.05,sY+6.3+a2*.7)}
 if(L.ghillie){const gc=[camo[1],camo[2],'#6a6a3a','#5a4a2a','#8a8a4a','#4a5a2a'],w0=side?6.4:11;for(let r2=0;r2<4;r2++)for(let i=0;i<(side?8:13);i++){const r=hsh(i*7+r2*31+id),gx=x-w0/2+i*(w0/(side?8:13)),gy=sY-1.4+r2*3.6+((r%6)/3);R(gc[(i+r2)%6],gx,gy+Math.sin(frame/7+i+r2)*.3,.8,2.6+(r%3)*.7)}for(let i=0;i<11;i++){const r=hsh(i*13+id);R(gc[i%6],x-(side?3:5)+i*(side?.6:1),by-7+Math.sin(frame/6+i)*.3,.7,2.4+(r%3)*.6)}}
 // ---------- pescoço e cabeça
 const hy=by-25.2+breath*.6+(o.kidHead?1:0),hx=x-3.2;
 R(skD,x-1,hy+6.2,2,1.4);
 // cabeça arredondada
 if(side){R(sk,x-3,hy+.6,6,5.6);R(sk,x-2.5,hy,5,6.6);R(sk,x+(dr>0?2.8:-3.6),hy+2.8,.8,1.4);R(skD,x-3,hy+5.6,6,.6)}
 else{R(sk,hx,hy+.6,6.4,5.4);R(sk,hx+.5,hy,5.4,6.6);if(f)R(sk,hx+.8,hy+6.4,4.8,.3);R(skD,hx,hy+5.4,6.4,.6);R(skD,hx+.6,hy+6,5.2,.6);if(dir===0){R(sk,hx-.5,hy+2.2,.6,1.6);R(sk,hx+6.3,hy+2.2,.6,1.6);R(skD,hx-.5,hy+3,.4,.6);R(skD,hx+6.5,hy+3,.4,.6)}}
 // rosto
 const eyeC=L.eye||'#2a1a10';
 if(L.paint&&!L.mask){if(dir===0){R('#2a3a1c',hx+.6,hy+3.9,2,.5);R('#2a3a1c',hx+3.8,hy+3.9,2,.5);R('#4a5a2a',hx+.8,hy+4.6,1.6,.4);R('#4a5a2a',hx+4,hy+4.6,1.6,.4);R('#3a4a24',hx+2.6,hy+1.2,1.2,.5)}else if(side){R('#2a3a1c',x+dr*.6-1,hy+3.9,2.4,.5);R('#4a5a2a',x+dr*.6-.8,hy+4.6,2,.4)}}
 if(dir===0){
  if(L.mask){R(L.mask,hx,hy+2.6,6.4,4.2);R(shade(L.mask,-18),hx,hy+4.6,6.4,.5)}
  if(blink){R(skD,hx+1.1,hy+3,1.3,.4);R(skD,hx+4,hy+3,1.3,.4)}
  else{const lc=(frame+id*97)%640,lx=mv?0:lc<90?.45:lc>330&&lc<420?-.45:0;R('#f4f0e8',hx+1,hy+2.6,1.5,1.1);R('#f4f0e8',hx+3.9,hy+2.6,1.5,1.1);R(eyeC,hx+1.6+lx-(lx>0?.1:0),hy+2.6,.9,1.1);R(eyeC,hx+3.9+lx,hy+2.6,.9,1.1);R('#fff',hx+1.7+lx,hy+2.6,.35,.35);R('#fff',hx+4+lx,hy+2.6,.35,.35);if(f){R('#1a1210',hx+.8,hy+2.3,1.8,.35);R('#1a1210',hx+3.8,hy+2.3,1.8,.35)}}
  R(L.brow||hcD,hx+.9,hy+1.7,1.7,.45);R(L.brow||hcD,hx+3.8,hy+1.7,1.7,.45);
  if(!L.mask){R(skD,hx+2.9,hy+3.6,.7,1.2);R(shade(sk,-30),hx+2.7,hy+4.6,1,.3);
   R(f?'#c05a5a':shade(sk,-35),hx+2.2,hy+5.3,2,.45);if(o.smile)R(shade(sk,-35),hx+1.9,hy+5,.4,.4),R(shade(sk,-35),hx+4.1,hy+5,.4,.4);
   if(f||L.blush)R('rgba(230,110,110,.35)',hx+.8,hy+4.2,1.2,.7),R('rgba(230,110,110,.35)',hx+4.4,hy+4.2,1.2,.7);
   if(L.old){R(skD,hx+.8,hy+4,.4,.6);R(skD,hx+5.2,hy+4,.4,.6);R(skD,hx+1.4,hy+1.2,1,.3);R(skD,hx+3.9,hy+1.2,1,.3)}
   if(L.glasses){if(L.glassesK)luxGlasses(R,L,hx,hy,0,0);else{R('#1a1a1a',hx+.7,hy+2.3,2.1,.4);R('#1a1a1a',hx+3.6,hy+2.3,2.1,.4);R('#1a1a1a',hx+2.7,hy+2.6,1,.35);R('rgba(200,230,255,.35)',hx+.8,hy+2.7,1.9,1.2);R('rgba(200,230,255,.35)',hx+3.7,hy+2.7,1.9,1.2)}}}
 }else if(side){const ex=x+dr*1.5-.45,fx=x+(dr>0?3:-3.6);
  if(L.mask)R(L.mask,x+(dr>0?-.5:-3),hy+2.6,3.6,4.2);
  if(blink)R(skD,ex-.3,hy+3,1.3,.4);else{R('#f4f0e8',ex-.2,hy+2.6,1.4,1.1);R(eyeC,ex+(dr>0?.4:-.2),hy+2.6,.8,1.1);if(f)R('#1a1210',ex-.3,hy+2.3,1.6,.35)}
  R(L.brow||hcD,ex-.4,hy+1.7,1.7,.45);
  if(!L.mask){R(sk,fx,hy+3,.7,1.4);R(skD,fx+(dr>0?0:.2),hy+4.2,.5,.3);R(f?'#c05a5a':shade(sk,-35),x+dr*2-.5,hy+5.2,1.4,.4);R(skD,x-dr*.6-.4,hy+2.4,.9,1.6);R(shade(sk,-28),x-dr*.6-.2,hy+2.9,.4,.6);if(f||L.blush)R('rgba(230,110,110,.35)',x+dr*1.2-.5,hy+4.2,1.2,.7)}
  if(L.glasses&&L.glassesK){luxGlasses(R,L,ex,hy,1,dr)}else if(L.glasses){R('#1a1a1a',ex-.5,hy+2.3,2,.4);R('#1a1a1a',x-dr*.6-.2,hy+2.5,dr>0?ex-x:x-ex,.35)}
 }
 // barba
 const bd=L.beard,bc=L.bc||hc;
 if(bd&&bd!=='nenhuma'&&dir!==1){const bxL=side?x+(dr>0?-.6:-2.4):hx;
  if(bd==='bigode'){if(side)R(bc,x+dr*2-.9,hy+4.7,2,.6);else{R(bc,hx+1.6,hy+4.7,3.2,.7);R(bc,hx+1.3,hy+5.1,.6,.6);R(bc,hx+4.5,hy+5.1,.6,.6)}}
  else if(bd==='cavanhaque'){if(side){R(bc,x+dr*2-.9,hy+4.7,2,.5);R(bc,x+dr*1.8-.8,hy+5.6,1.8,1.2)}else{R(bc,hx+1.8,hy+4.7,2.8,.5);R(bc,hx+2.3,hy+5.6,1.8,1.3)}}
  else{const long=bd==='longa';if(side){R(bc,x-.6+(dr>0?0:-1.8),hy+3.6,4.2,2.6+(long?3:0));R(bc,x+dr*2.6-.5,hy+4.4,1,1.6)}else{R(bc,hx,hy+3.4,.9,2.8);R(bc,hx+5.5,hy+3.4,.9,2.8);R(bc,hx+.4,hy+4.6,5.6,2.2+(long?3.2:0));R(shade(bc,15),hx+1.6,hy+5.4,.5,1.2+(long?2.5:0));R(shade(bc,15),hx+4,hy+5.6,.5,1+(long?2.5:0));R(f?'#c05a5a':shade(sk,-30),hx+2.4,hy+5,1.6,.4)}}}
 // cabelo
 const hs=L.hair;
 if(!L.scarf&&hs!=='careca'){
  if(dir===1){if(hs==='calvo'){R(sk,hx+.5,hy,5.4,6);R(hc,hx,hy+2.4,6.4,3.4);R(skL,hx+1.8,hy+.6,2,.8)}else{R(hc,hx,hy,6.4,5.6);R(hc,hx+.5,hy-.4,5.4,.6);R(hcL,hx+1.2,hy+.6,.5,3);R(hcL,hx+3.8,hy+.6,.5,3.4);R(hcD,hx,hy+5,6.4,.6);
   if(hs==='comprido')R(hc,hx-.2,hy+4,6.8,6.6),R(hcD,hx+1,hy+5,.5,5),R(hcD,hx+4,hy+5,.5,5.4);if(hs==='rabo'){R(hc,x-.8,hy+4.5,1.8,4.6);R(hcD,x-.8,hy+4.5,1.8,.6);R(L.tieC||'#c83a3a',x-.9,hy+4.3,2,.6)}if(hs==='coque')R(hc,x-1.4,hy-1.6,2.8,2.2),R(hcL,x-.6,hy-1.4,1,.5)}}
  else if(side){const back=dr>0?x-3.2:x+.4;
   if(hs==='calvo'){R(hc,back,hy+2.4,2.8,3);R(skL,x-1,hy+.4,2,.6)}
   else{R(hc,x-2.6,hy-.4,5.2,1.4);R(hc,x-3.1,hy+.6,6.2,1.2);R(hc,back,hy+.6,2.8,4.4);R(hcL,x-1.5,hy-.2,2.4,.4);R(hc,x+(dr>0?2.2:-3.2),hy+.8,1,1.2);
    if(hs==='topete')R(hc,x+(dr>0?-.4:-2.6),hy-1.4,3,1.3),R(hcL,x+(dr>0?.2:-2),hy-1.3,1.6,.4);
    if(hs==='comprido')R(hc,back-(dr>0?.3:-.3),hy+3,3,6.6),R(hcD,back+.8,hy+4,.4,5);
    if(hs==='rabo'){R(hc,back-(dr>0?1.4:-1.4)+(dr>0?0:1),hy+2.2,1.6,4.6);R(L.tieC||'#c83a3a',back+(dr>0?-.2:1.8),hy+2,1,1)}
    if(hs==='coque')R(hc,back+(dr>0?-.6:.6),hy-.6,2.6,2.4)}}
  else{ // frente
   if(hs==='calvo'){R(hc,hx-.3,hy+1.8,1.4,2.8);R(hc,hx+5.3,hy+1.8,1.4,2.8);R(skL,hx+2,hy+.4,2,.6)}
   else{R(hc,hx-.2,hy-.4,6.8,1.6);R(hc,hx+.5,hy-.8,5.4,.6);R(hc,hx-.3,hy+.8,1,2.4);R(hc,hx+5.7,hy+.8,1,2.4);R(hcL,hx+1.4,hy-.4,.5,1.2);R(hcL,hx+3.6,hy-.5,.5,1.2);
    if(hs==='curto'||hs==='topete'){R(hc,hx+.8,hy+1.1,1.4,.6);R(hc,hx+3.4,hy+1.1,1.8,.5)}
    if(hs==='topete'){R(hc,hx+1,hy-1.8,4,1.5);R(hcL,hx+1.6,hy-1.7,2.4,.4)}
    if(hs==='comprido'){R(hc,hx-.8,hy+.8,1.4,8.6);R(hc,hx+5.8,hy+.8,1.4,8.6);R(hcD,hx-.4,hy+3,.4,6);R(hcD,hx+6.3,hy+3,.4,6);R(hc,hx+.6,hy+1.1,2.6,.6)}
    if(hs==='rabo'||hs==='coque'){R(hc,hx+.6,hy+1.1,2.4,.5);R(hc,hx+3.6,hy+1.1,2.2,.5)}
    if(hs==='coque'){R(hc,x-1.4,hy-2.2,2.8,2);R(hcL,x-.6,hy-2,1,.5)}}}
 }
 if(L.scarf){const sfc=L.scarf;R(sfc,hx-.5,hy-.8,7.4,3.2);if(dir!==1)R(shade(sfc,-15),hx-.5,hy+2,7.4,.6);if(side||dir===1){R(sfc,side?(dr>0?x-3.6:x+1.6):x-1,hy+2.4,2,3)}R(shade(sfc,20),hx+.6,hy-.4,1,.5);R(shade(sfc,20),hx+3.6,hy-.4,1,.5)}
 // chapéus
 const ht=L.hat,hc2=L.hatc;
 if(ht&&ht!=='nenhum'){const d=shade(hc2,-25),l=shade(hc2,18),cy=hy-.4;
  if(ht==='vaqueiro'||ht==='pantaneiro'){const bw=ht==='pantaneiro'?13.6:12;R(hc2,x-bw/2,cy+.4,bw,1.3);R(hc2,x-bw/2-.3,cy-.4,1.2,1);R(hc2,x+bw/2-.9,cy-.4,1.2,1);R(d,x-bw/2+.6,cy+1.3,bw-1.2,.5);R(l,x-bw/2+1,cy+.4,bw-2,.4);
   R(hc2,x-3.1,cy-3.4,6.2,3.8);R(hc2,x-2.7,cy-3.9,5.4,.6);R(d,x-.4,cy-3.8,.8,1.6);R(l,x-2.6,cy-3.3,1.6,.5);R(L.band||'#2a1a10',x-3.1,cy-.6,6.2,.9);if(ht==='pantaneiro')R('#c8a040',x+2,cy-.6,.8,.9);if(L.concho&&dir!==1){R(L.concho,x+(side?dr*1.2-.6:-.7),cy-.75,1.4,1.2);R('#fff8d0',x+(side?dr*1.2-.4:-.5),cy-.7,.5,.4)}if(L.hatStitch)for(let i=0;i<6;i++)R(shade(hc2,30),x-bw/2+1+i*(bw-2)/6,cy+.9,.6,.2)}
  else if(ht==='palha'){R('#e8d090',x-6.5,cy+.4,13,1.4);for(let i=-6;i<6.5;i+=1.4)R('#c8a860',x+i,cy+.6,.5,1);R('#b89850',x-6.2,cy+1.6,12.4,.4);R('#e8d090',x-3,cy-3,6,3.6);for(let i=-2.6;i<3;i+=1.3)R('#c8a860',x+i,cy-2.6,.4,3);R(L.band||'#b03a2a',x-3,cy-.5,6,.8)}
  else if(ht==='bone'){R(hc2,x-3.4,cy-2.6,6.8,3);R(hc2,x-2.8,cy-3.1,5.6,.6);R(l,x-2.4,cy-2.8,4,.5);if(L.capCamo)blot(x-3.4,cy-3,6.8,3,77);else R('#fff',x-.4,cy-3.2,.8,.5);
   if(side)R(d,x+(dr>0?2.6:-6.6),cy-.2,4,1.1);else if(dir===0){R(d,x-3,cy+.1,6,1.1);R(shade(hc2,-40),x-3,cy+1,6,.3);R(L.logo||'#ffd75e',x-.8,cy-2,1.6,1.1)}}
  else if(ht==='gaucho'){R('#1e1e22',x-6.2,cy+.5,12.4,1.1);R('#1e1e22',x-3.1,cy-3,6.2,3.6);R('#3a3a40',x-3.1,cy-3,6.2,.4);R('#5a3a22',x-3.1,cy-.4,6.2,.6);if(dir===0)R('#5a3a22',x-3,cy+1.6,.4,4.6),R('#5a3a22',x+2.6,cy+1.6,.4,4.6)}
  else if(ht==='pescador'){R(hc2,x-4.8,cy+.2,9.6,1.6);R(d,x-4.8,cy+1.4,9.6,.5);R(hc2,x-3.3,cy-2.6,6.6,3);R(l,x-3,cy-2.6,6,.5);R(d,x-3.3,cy-.4,6.6,.5)}
  else if(ht==='ranger'){R(hc2,x-6,cy+.4,12,1.2);R(d,x-6,cy+1.2,12,.4);R(hc2,x-3,cy-3.6,6,4);R(d,x-.3,cy-3.6,.6,2);R(d,x-2,cy-3.4,.4,1.6);R(d,x+1.6,cy-3.4,.4,1.6);R(L.band||'#5a3a22',x-3,cy-.6,6,.8)}
  else if(ht==='touca'){R(hc2,x-3.4,cy-1.8,6.8,3.6);R(l,x-3.4,cy+1.2,6.8,.7);R(d,x-3,cy-1.4,.4,2.6);R(d,x-.2,cy-1.6,.4,2.8);R(d,x+2.6,cy-1.4,.4,2.6)}
  else if(ht==='capuz'){if(dir===1){R(hc2,x-3.9,cy-1.8,7.8,9);R(shade(hc2,-16),x-3.9,cy+6.4,7.8,.6);R(shade(hc2,12),x-3,cy-1.8,6,.6)}else if(side){R(hc2,x-3.4,cy-1.8,6.8,2.8);R(hc2,x-(dr>0?3.8:-1.4),cy-1,2.6,8.2);R(shade(hc2,-24),x+(dr>0?2.3:-3.3),cy+.6,.7,5.6)}else{R(hc2,x-3.9,cy-1.8,7.8,2.8);R(hc2,hx-.9,hy,1.5,7.2);R(hc2,hx+5.8,hy,1.5,7.2);R(shade(hc2,-30),hx+.3,hy+1,5.8,.7);R(shade(hc2,-22),hx+.5,hy+.9,.5,5.6);R(shade(hc2,-22),hx+5.3,hy+.9,.5,5.6)}if(L.camo)blot(x-3.8,cy-1.8,7.6,2.6,91);if(L.ghillie)for(let i=0;i<9;i++)R([L.camo[1],L.camo[2],'#6a6a3a'][i%3],x-4+i*.95,cy-2.4+Math.sin(frame/7+i)*.3,.7,2+(i%3)*.6)}
  else if(ht==='veu'){R('#e8e0c8',x-5.5,cy+.4,11,1.2);R('#e8e0c8',x-3,cy-2.8,6,3.4);if(dir!==1){R('rgba(40,40,40,.45)',hx-.6,hy+1,7.6,6.8)}}
 }
 // ferramenta
 if(o.tool&&o.work){const tx=x+(side?dr*4.5:5.5),ty=sY+wk*2.4;R('#6a4428',tx,ty-2,1,11);R('#9a9a9a',tx-(side&&dr<0?2:0),ty+8.4,3,1.2)}
 if(lean)g.restore();
}
// ---------- visual do jogador e do parceiro (guarda-roupa) no boneco novo
function lookToH(L){return{g:L.g,skin:LK.skin[L.skin]||LK.skin[1],hair:L.hair,hc:LK.hc[L.hc],hat:L.hat==='nenhum'?null:L.hat,hatc:LK.hatc[L.hatc],shirt:L.shirt==='colete'?'lisa':L.shirt,
 sc:L.shirt==='jeans'?'#5a7ab0':LK.sc[L.sc],vest:L.shirt==='colete'?'#7a4a22':null,pants:L.pants,pc:PANTC[L.pants],boots:LK.boots[L.boots],beard:L.beard,
 skirt:null,overall:L.pants==='macacao'}}
drawFarmer=function(g,o,L){const H=lookToH(L);drawHuman(g,Object.assign({hid:hsh(L.hair+L.sc)},o),H);
 if(H.overall){const x=o.x,dir=o.dir||0,mv=o.mv,bob=mv?Math.abs(Math.cos(o.ph||0))*.8:0,by=o.y-bob+(o.sneak?2.5:0),sY=by-17.5;if(dir!==1&&dir<2){Rr(g,'#3a5a8a',x-3.4,sY+3,6.8,5.2);Rr(g,'#3a5a8a',x-3,sY,1.2,3.2);Rr(g,'#3a5a8a',x+1.8,sY,1.2,3.2);Rr(g,'#e0c060',x-2.8,sY+3,.8,.8);Rr(g,'#e0c060',x+2,sY+3,.8,.8);Rr(g,'#2f4a72',x-1.4,sY+4,2.8,1.8)}else if(dir===1){Rr(g,'#3a5a8a',x-3,sY,1.2,7);Rr(g,'#3a5a8a',x+1.8,sY,1.2,7)}}};
// roupas de caça do jogador no boneco novo
const _dpbPp=drawPlayerBase;
drawPlayerBase=function(g){ensureL();const ou=S.h.outfit,mv=P.moving&&!P.aim,bob=mv?Math.abs(Math.cos(P.ph))*(P.run?1.4:.8):0,o={x:P.x,y:P.y,dir:P.dir,ph:P.ph,mv,run:P.run,sneak:P.sneak,hid:7};
 if(ou==='casual')drawFarmer(g,o,S.look);
 else{const c=OUTFITS[ou].c,H=lookToH(S.look),gr=S.h.gear||{};Object.assign(H,{shirt:'camo',sc:c[0],pc:c[0],camo:c,camoK:ou,vest:null,jacket:null,coat:null,tie:null,overall:false,hunt:ou,huntVest:ou==='wood'?'#4a4a32':ou==='full'?'#5a4a32':'#4a4a2a',hat:ou==='wood'?'bone':'capuz',hatc:ou==='wood'?c[0]:c[0],capCamo:ou==='wood',logo:null,mask:ou==='wood'?null:(ou==='full'?'#3a3226':c[1]),paint:ou==='wood',gloves:ou==='wood'?null:'#2e2e22',ghillie:ou==='ghillie',boots:'#3a2a18',tallBoot:1,binoc:!!gr.binoc,pack:!!gr.pack});drawHuman(g,o,H)}
 if(S.h.eq&&WEAPONS[S.h.eq])drawGun(g,P.x,P.y-bob+(P.sneak?2.5:0)-3.2,S.h.eq)};
// ---------- moradores: cada um com seu jeito
const NPCSTY={
 joao:{hair:'calvo',hc:'#d8d8d8',beard:'bigode',bc:'#e8e8e8',hat:'vaqueiro',hatc:'#3a2a1a',shirt:'social',sc:'#f0ece0',jacket:'#7a5a2a',tie:'#a82a2a',pc:'#2a2a3a',belly:1,old:1,skin:'#e0aa80'},
 lourdes:{g:'f',hair:'coque',hc:'#5a3a22',shirt:'lisa',sc:'#c8506a',apron:'#f4f4f0',scarf:'#f4f4f0',skirt:'#7a3a4a',skin:'#c88a60',boots:'#5a3a2a'},
 ramos:{hair:'curto',hc:'#222',beard:'bigode',hat:'vaqueiro',hatc:'#1e1e1e',band:'#c8a040',shirt:'farda',sc:'#3a4a7a',pc:'#222430',badge:1,holster:1,boots:'#1a1a1a',skin:'#d8a070'},
 marina:{g:'f',hair:'rabo',hc:'#7a3a1a',tieC:'#4a90d0',shirt:'lisa',sc:'#4a90d0',coat:'#f4f4f6',steth:1,pc:'#3a5a8a',glasses:1,skin:'#f0c8a0'},
 tiao:{hair:'curto',hc:'#8a7a5a',beard:'barba',bc:'#a8a08a',hat:'palha',shirt:'xadrez',sc:'#5a7a3a',pc:'#6a5a40',old:1,skin:'#a86a40'},
 ze:{hair:'curto',hc:'#3a2a1a',hat:'bone',hatc:'#2a6a3a',logo:'#ffd75e',shirt:'polo',sc:'#8a6a2a',pc:'#3a5a8a',skin:'#d8a070',beard:'cavanhaque'},
 zeca:{hair:'curto',hc:'#6a5a3a',hat:'pescador',hatc:'#c8b88a',shirt:'lisa',sc:'#2f6a7a',vest:'#8a8a5a',vestPk:1,pc:'#a89060',beard:'barba',bc:'#6a5a3a',skin:'#b07a50'},
 guarda:{hair:'curto',hc:'#222',hat:'ranger',hatc:'#6a5a3a',shirt:'farda',sc:'#3a6a3a',pc:'#3a4a2a',badge:1,boots:'#2a1a10',skin:'#c08458'},
 benedita:{g:'f',hair:'coque',hc:'#d8d8d8',scarf:'#e8c040',shirt:'lisa',sc:'#8a4a6a',skirt:'#5a3a5a',scarfN:'#c8603a',old:1,skin:'#8a5a36',bag:'#a88050',boots:'#6a4a2a'},
 rosa:{g:'f',hair:'comprido',hc:'#3a2414',hat:'palha',band:'#3a7a3a',shirt:'xadrez',sc:'#c8603a',skirt:'#3a5a8a',skin:'#d8a070'},
 bene:{hair:'curto',hc:'#2a1a10',hat:'pantaneiro',hatc:'#5a3a22',shirt:'lisa',sc:'#5a7a8a',scarfN:'#c83a2a',pants:'bombacha',pc:'#4a3a2a',skin:'#9a6a40',beard:'bigode'},
 lino:{hair:'comprido',hc:'#eeeeee',beard:'longa',bc:'#f4f4f4',hat:'palha',shirt:'lisa',sc:'#6a6a4a',pc:'#5a5040',old:1,skin:'#e0b090'},
 bisc:{hair:'curto',hc:'#222',hat:'bone',hatc:'#c83a2a',shirt:'regata',sc:'#e0a431',pc:'#3a5a8a',skin:'#a86e44',boots:'#f4f4f4'}
};
function personLook(o){const k=(o.shirt||'')+(o.hair||'')+(o.pants||'')+(o.hat||''),h=hsh(k),f=o.g==='f';
 return{g:o.g||'m',skin:o.skin||SKINS[h%SKINS.length],hair:f?['comprido','rabo','coque'][h%3]:['curto','topete','curto','calvo'][(h>>3)%4],hc:o.hair||'#2a1a10',
  hat:o.hat?(o.hatS||['vaqueiro','palha','vaqueiro','bone'][(h>>5)%4]):null,hatc:o.hat||'#5a3a22',shirt:o.shirtS||['lisa','xadrez','jeans','lisa'][(h>>7)%4],sc:o.shirt||'#8a6a4a',
  pants:'jeans',pc:o.pants||'#33384a',boots:o.boots||['#5a3a1a','#2a1a10','#7a4a22'][(h>>9)%3],beard:f?null:['nenhuma','bigode','nenhuma','barba','cavanhaque'][(h>>11)%5],
  apron:o.apron||null,mask:o.mask||null,skirt:o.skirt||(f&&(h>>13)%3===0?shade(o.shirt||'#8a6a4a',-30):null)}}
drawPerson=function(g,o){const L=Object.assign(personLook(o),o.look||{});drawHuman(g,Object.assign({hid:hsh((o.shirt||'')+(o.hair||''))%997},o),L)};
// moradores principais
drawNPC=function(g,n){if(n.hid)return;
 if(n._lx===undefined){n._lx=n.x;n._ly=n.y;n._ph=0;n._d=0}
 const mx=n.x-n._lx,my=n.y-n._ly,md=Math.hypot(mx,my);if(md>.01){n._ph+=md*.14;n._d=Math.abs(mx)>Math.abs(my)?(mx>0?3:2):(my>0?0:1)}n._lx=n.x;n._ly=n.y;
 const st=NPCSTY[n.id],base=personLook({shirt:n.col,hair:n.hair,g:(NPCLOOK[n.id]||{}).g,skin:(NPCLOOK[n.id]||{}).skin}),L=Object.assign(base,{hat:null,beard:null,skirt:null},st||{});
 if(L.hat&&!L.hatc)L.hatc='#5a3a22';if(n.id==='lino'&&n.task==='bees'){L.hat='veu'}
 const near=Math.hypot(P.x-n.x,P.y-n.y)<40,d=!n.mv&&near?(Math.abs(P.x-n.x)>Math.abs(P.y-n.y)?(P.x>n.x?3:2):(P.y>n.y?0:1)):n._d;
 if(n.kid){g.save();g.translate(n.x,n.y);g.scale(.74,.74);g.translate(-n.x,-n.y);drawHuman(g,{x:n.x,y:n.y,dir:d,ph:n._ph,mv:n.mv,hid:hsh(n.id),smile:1},L);g.restore()}
 else drawHuman(g,{x:n.x,y:n.y,dir:d,ph:n._ph,mv:n.mv,hid:hsh(n.id),smile:near,work:n.task==='plots'&&n.work,tool:n.task==='plots'},L);
 if(RMODE===4)return;
 const flag=npcHasQuest(n.id)||(S.tut<TUT.length&&TUT[S.tut].npc===n.id);
 if(flag){const b=(frame>>4)&1;Rr(g,'#1e140c',n.x-1.5,n.y-37-b,3,8);Rr(g,'#ffd75e',n.x-1,n.y-36.5-b,2,5);Rr(g,'#ffd75e',n.x-1,n.y-30.5-b,2,1.5)}
 if(n.chat>0&&((frame>>4)&3)!==0){Rr(g,'#1e140c',n.x+3,n.y-34,9,6);Rr(g,'#fff',n.x+3.5,n.y-33.5,8,5);for(let i=0;i<3;i++)Rr(g,'#888',n.x+5+i*2,n.y-31.5,1,1);Rr(g,'#fff',n.x+5,n.y-28.6,2,1.4)}
};
// peão, parceiro na lida, pedreiros, vigia, ladrões, rivais e visitantes já usam drawPerson; só ajustes de estilo
const _dp2Pp=drawPeon;drawPeon=function(g){OL(g,PEON.x,PEON.y+3,30,44,c=>drawPerson(c,{x:PEON.x,y:PEON.y,dir:PEON.dir,ph:PEON.ph,mv:PEON.mv,shirt:'#a0482a',pants:'#3a4a6a',hair:'#2a1a10',hat:'#d8c080',work:PEON.work,tool:1,g:'m',look:{hat:'palha',shirt:'xadrez',beard:'bigode',skin:'#a86e44',scarfN:'#e8e0c8'}}))};
drawVigia=(old=>function(g){drawPerson(g,{x:VG.x,y:VG.y,dir:VG.dir,ph:VG.ph,mv:VG.mv,shirt:'#7a7048',hair:'#3a2a1a',hat:'#4a4030',pants:'#3a3a2a',look:{shirt:'farda',hat:'bone',hatc:'#2a2a2a',badge:1,holster:1,boots:'#1a1a1a'}});
 const lx=VG.x+(VG.dir===2?-6:6);if(S.t*24>=18||S.t*24<6){Rr(g,'#8a8a8a',lx,VG.y-11,1.6,3);Rr(g,'#fff6c0',lx+.2,VG.y-11.5,1.2,1)}})(drawVigia);
// ladrões: touca e lenço no rosto agora vêm do próprio boneco
drawThiefFig=(old=>function(g,t){if(t.st==='down')return old(g,t);const x=t.x,y=t.y,kneel=t.st==='cut',yy=y+(kneel?3:0);
 drawPerson(g,{x,y:yy,dir:t.dir,ph:t.ph,mv:t.mv,shirt:t.col,hair:'#1a1a1a',hat:t.boss?'#2a1a10':'#2a2a30',pants:t.pants,skin:'#c89a70',work:kneel||t.st==='rope',look:{hat:t.boss?'vaqueiro':(t.id%2?'bone':'touca'),hatc:t.boss?'#2a1a10':(t.id%2?'#1a1a1a':'#2a2a30'),mask:t.boss?'#a82020':'#3a3a40',shirt:t.boss?'xadrez':'lisa',beard:'nenhuma'}});
 const side=t.dir>=2,fr=t.dir===3?1:-1;
 if(t.role==='laca'||t.role==='solo'){Rr(g,'#c8a050',x+(fr>0?-5.5:3),yy-15,2.5,4.4);Rr(g,'#a8803a',x+(fr>0?-5.5:3),yy-14,2.5,.6)}
 if(t.st==='surr'){Rr(g,'#c89a70',x-6,yy-27,1.7,4);Rr(g,'#c89a70',x+4.3,yy-27,1.7,4)}
 if(t.st==='cuffed'){Rr(g,'#c8c8d0',x-1.5,yy-9,3,1.2)}
 if(t.carry){Rr(g,'#5a4a3a',x-4,yy-19,8,4)}})(drawThiefFig);
// montaria: o boneco novo tem pernas mais longas, então senta um pouco mais baixo
drawPlayer=(old=>function(g){if(!P.drive&&S.horse&&S.horseOn){drawHorse(g);g.save();g.translate(P.dir>=2?(P.dir===3?-2:2):0,-14.5);_dpl(g);g.restore();if(P.dir===0)horseHeadF(g,P.x,P.y,S.horse.b)}else old(g)})(drawPlayer);
drawCmtPeon=function(g,p){drawHorseS(g,p.x,p.y,p.dir||3,p.b,{mv:p.mv,ph:p.ph,saddle:1});g.save();g.translate(0,-14.5);drawPerson(g,{x:p.x,y:p.y,dir:p.dir||3,ph:0,mv:0,shirt:'#8a5a2a',hair:'#2a1a10',hat:'#d8c080',pants:'#3a3a5a',look:{hat:'pantaneiro',hatc:'#5a3a22',scarfN:'#c83a2a',pants:'bombacha',pc:'#4a3a2a'}});g.restore()};
// atendentes dentro das lojas
if(typeof drawClerk==='function')drawClerk=function(g,it,r){const C=CLERK[r.id];if(!C)return;let o;const x=(r.x+it.x)*TS+8,y=(r.y+it.y)*TS+12+(it.dy||0);
 if(C.npc){const n=npcById(C.npc);const st=NPCSTY[C.npc]||{};OL(g,x,y+3,30,44,c=>drawHuman(c,{x,y,dir:0,ph:0,mv:0,hid:hsh(C.npc),smile:1},Object.assign(personLook({shirt:n.col,hair:n.hair}),{hat:null,beard:null,skirt:null},st)));return}
 o=Object.assign({},C);OL(g,x,y+3,30,44,c=>drawPerson(c,Object.assign({x,y,dir:0,ph:0,mv:0,smile:1,look:{apron:C.apron||null,beard:C.beard?'barba':null}},o)))};
