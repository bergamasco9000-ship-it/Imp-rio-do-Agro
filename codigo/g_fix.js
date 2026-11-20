// ===== Caminho inteligente (desvia de cercas) + baias do celeiro + cabresto =====
const WALK=(x,y)=>x>=XMIN&&y>=YMIN&&x<MW&&y<RZ-1&&!SOL[ti(x,y)]&&!FEN[ti(x,y)]&&G[ti(x,y)]!==2;
const PFQ=new Int32Array(NT),PFP=new Int32Array(NT),PFS=new Uint32Array(NT);let PFT=0;
function findPath(fx,fy,tx,ty){
 let sx=Math.floor(fx/TS),sy=Math.floor((fy-2)/TS);const gx=Math.floor(tx/TS),gy=Math.floor((ty-2)/TS);
 if(!WALK(sx,sy)){let b=null;for(let r=1;r<=2&&!b;r++)for(let dy=-r;dy<=r&&!b;dy++)for(let dx=-r;dx<=r;dx++)if(WALK(sx+dx,sy+dy)){b=[sx+dx,sy+dy];break}if(!b)return null;sx=b[0];sy=b[1]}
 const gb=!WALK(gx,gy);PFT++;let h=0,t=0,si=ti(sx,sy),found=-1;PFQ[t++]=si;PFS[si]=PFT;PFP[si]=-1;
 while(h<t){const i=PFQ[h++],x=tix(i),y=tiy(i);
  if((x===gx&&y===gy)||(gb&&Math.abs(x-gx)<=1&&Math.abs(y-gy)<=1)){found=i;break}
  for(let k=0;k<4;k++){const nx=x+(k===0?1:k===1?-1:0),ny=y+(k===2?1:k===3?-1:0);if(!WALK(nx,ny))continue;const j=ti(nx,ny);if(PFS[j]===PFT)continue;PFS[j]=PFT;PFP[j]=i;PFQ[t++]=j}}
 if(found<0)return null;
 const tiles=[];for(let i=found;i>=0;i=PFP[i])tiles.push(i);tiles.reverse();
 const pts=[];for(let k=1;k<tiles.length;k++){const a=tiles[k-1],b=tiles[k],c=tiles[k+1];if(c!==undefined&&(b-a)===(c-b))continue;pts.push([tix(b)*TS+8,tiy(b)*TS+10])}
 if(!gb)pts.push([tx,ty]);if(!pts.length)pts.push([tx,ty]);return pts;
}
function lineFree(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/6);for(let i=1;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;if(solidAt(x,y-1)||solidAt(x-3,y-1)||solidAt(x+3,y-1))return false}return true}
buildRoute=function(o,tx,ty){return findPath(o.x,o.y,tx,ty)||[[tx,ty]]};
wkStep=function(o,dt,spd){
 if(!o.route||!o.route.length)return true;
 if(o.route.length===1&&!inRoomY(o.y)){const g=o.route[0];if(!lineFree(o.x,o.y,g[0],g[1])){const key=Math.floor(g[0]/TS/2)+','+Math.floor(g[1]/TS/2);if(!o.pc||o.pc.k!==key||!o.pc.p.length){o.pc={k:key,p:findPath(o.x,o.y,g[0],g[1])||[g]}}o.route=o.pc.p}}
 const p=o.route[0],dx=p[0]-o.x,dy=p[1]-o.y,d=Math.hypot(dx,dy);
 if(d<3){o.route.shift();o.stuck=0;return !o.route.length}
 const st=Math.min(spd*dt,d),nx=o.x+dx/d*st,ny=o.y+dy/d*st;let mv=0;
 if(!solidAt(nx,o.y-1)){o.x=nx;mv=1}if(!solidAt(o.x,ny-1)){o.y=ny;mv=1}
 if(mv&&Math.hypot(o.x-(o.lx||0),o.y-(o.ly||0))>.05){o.stuck=0;o.mv=1;o.ph+=spd*dt*.135;if(Math.abs(dx)>Math.abs(dy)*1.1)o.dir=dx>0?3:2;else o.dir=dy>0?0:1}
 else{o.stuck=(o.stuck||0)+dt;o.mv=0;
  if(o.stuck>.6){const goal=o.route[o.route.length-1],np=findPath(o.x,o.y,goal[0],goal[1]);o.rep=(o.rep||0)+1;if(np&&o.rep<4){o.route=np;o.pc=null;o.stuck=0}else if(o.stuck>2){o.x=p[0];o.y=p[1];o.stuck=0;o.rep=0}}}
 o.lx=o.x;o.ly=o.y;if(!o.route.length)o.rep=0;
 return false;
};
// ---- baias no celeiro
{const R=ROOMS.barn;R.items=R.items.filter(it=>it.k!=='stall'&&it.k!=='cans'&&!(it.k==='hay'&&it.x===3));
 [0,1,2].forEach(i=>{R.items.push({k:'stallwall',x:5+i*3,y:2,w:1,h:2});R.items.push({k:'stallspace',x:6+i*3,y:2,w:2,h:2,act:'stall',idx:i})});R.items.push({k:'stallwall',x:14,y:2,w:1,h:2});}
const _dfF=drawFurn;
drawFurn=function(g,it,x,y,r){
 if(it.k==='stallwall'){Rr(g,'#5a3a22',x+4,y-10,8,it.h*TS+10);Rr(g,'#7a5232',x+4,y-10,8,2);Rr(g,'#4a2e18',x+4,y+6,8,1.5);return}
 if(it.k==='stallspace'){Rr(g,'#c8a040',x,y,32,32);for(let i=0;i<10;i++)Rr(g,i%2?'#e0c060':'#a88020',x+((i*7)%28)+2,y+((i*11)%26)+3,4,1);Rr(g,'#6a4428',x+2,y-6,28,6);Rr(g,'#c9a24a',x+4,y-5,24,3);Rr(g,'#5e646c',x+24,y+22,7,7);Rr(g,'#3a7ab8',x+25,y+23,5,3);
  const a=S.herd.find(c=>c.stall===it.idx&&c.age>=240);if(!a){ptext(g,'VAZIA',x+6,y+14,'#7a5a20')}return}
 _dfF(g,it,x,y,r);
};
const stallPos=(i,calf)=>{const R=ROOMS.barn;return{x:(R.x+6+i*3)*TS+(calf?16:7),y:(R.y+2)*TS+(calf?20:12)}};
const freeStall=()=>{for(let i=0;i<3;i++)if(!S.herd.some(a=>a.stall===i&&a.age>=240))return i;return -1};
let LEAD=null;const TRAIL=[];
function startLead(a){if(LEAD)return toast('Você já está puxando '+LEAD.name,'bad');if(a.stall!=null)return toast(a.name+' está no celeiro','bad');a.lead=1;LEAD=a;TRAIL.length=0;hideModal();toast('🪢 Puxando '+a.name+' no cabresto. Leve até a porta do celeiro (ao lado da casa).','good')}
function dropLead(back){if(!LEAD)return;const a=LEAD;a.lead=0;LEAD=null;if(back){SP.delete(a.id)}}
function putInStall(a,i){a.stall=i;a.lead=0;S.herd.filter(c=>c.mom===a.id&&c.age<240).forEach(c=>c.stall=i);gainXP(5,'manejo');toast('🐄 '+a.name+' está na baia '+(i+1)+' do celeiro. Lá ela come no cocho, fica protegida e o parto é bem mais seguro.','good')}
function releaseStall(i){const L=S.herd.filter(c=>c.stall===i);L.forEach(c=>{c.stall=null;SP.delete(c.id)});if(L.length)toast('🐄 '+L.map(c=>c.name).join(' e ')+' voltaram para o pasto','good')}
const _enR=enterRoom;
enterRoom=function(id){
 if(LEAD){const a=LEAD;if(id==='barn'){const i=freeStall();if(i<0){toast('Todas as 3 baias estão ocupadas. Solte uma vaca primeiro.','bad');dropLead(true)}else{dropLead(false);putInStall(a,i)}}else{toast(a.name+' ficou esperando e voltou para o pasto.');dropLead(true)}}
 _enR(id);
};
const _updF=update;
update=function(dt){_updF(dt);
 if(LEAD){if(!S.herd.includes(LEAD)){LEAD=null}else{const l=TRAIL[TRAIL.length-1];if(!l||Math.hypot(P.x-l[0],P.y-l[1])>5){TRAIL.push([P.x,P.y]);if(TRAIL.length>60)TRAIL.shift()}
  const tg=TRAIL.length>5?TRAIL[TRAIL.length-5]:[P.x-16,P.y],s=spriteOf(LEAD),cx=s.x+8,cy=s.y+8,dx=tg[0]-cx,dy=tg[1]-cy,d=Math.hypot(dx,dy);s.lie=0;s.go=0;
  if(d>3){const sp=Math.min(d,Math.max(40,Math.hypot(P.vx,P.vy)*1.1)*dt*(d>60?2:1));s.x+=dx/d*sp;s.y+=dy/d*sp;s.dir=dx>0?1:-1;s.f=(frame>>3)&1}else s.f=0;
  if(d>220){s.x=tg[0]-8;s.y=tg[1]-8}}}
 for(const a of S.herd){if(a.stall==null)continue;const s=spriteOf(a),p=stallPos(a.stall,a.age<240);s.x=p.x;s.y=p.y;s.dir=1;s.f=0;s.go=0;s.lie=a.labor||daylight()<.25?1:0}
};
// linha do cabresto
const _dpF=drawPart;drawPart=function(g){_dpF(g);if(!LEAD)return;const s=spriteOf(LEAD),hx=s.x+(s.dir>0?15:2),hy=s.y+3;g.strokeStyle='#8a5a2a';g.lineWidth=.8;g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo((hx+P.x)/2,(hy+P.y-8)/2+6,P.x+(P.dir===3?3:-3),P.y-9);g.stroke()};
// janela da vaca: botões novos
const _cowM=cowModal;
cowModal=function(id){_cowM(id);const a=S.herd.find(x=>x.id==id);if(!a)return;const mb=$('mbox'),last=mb&&mb.lastElementChild;if(!last)return;
 const h=a.stall!=null?'<div class="card">🏠 Na baia '+(a.stall+1)+' do celeiro'+(a.preg?' · faltam ~'+Math.max(0,GEST-a.preg)+' dias para parir':'')+'<div class="btns"><button class="b" data-act="stallfree" data-v="'+a.stall+'">Soltar no pasto</button></div></div>'
  :a.lead?'<div class="btns"><button class="b" data-act="leadstop">Soltar o cabresto</button></div>'
  :a.age>=240?'<div class="btns"><button class="b gold" data-act="leadgo" data-v="'+a.id+'">🪢 Levar no cabresto (para o celeiro)</button></div>':'';
 last.insertAdjacentHTML('beforebegin',h)};
Object.assign(ACT,{
 leadgo(e){const a=S.herd.find(x=>x.id==e.v);if(a)startLead(a)},
 leadstop(){dropLead(true);hideModal();toast('Você soltou o cabresto')},
 stallfree(e){releaseStall(+e.v);hideModal()},
 stallhelp(e){const a=S.herd.find(x=>x.id==e.v);if(a)partoModal(a)}
});
function stallModal(i){reModal=()=>stallModal(i);const a=S.herd.find(c=>c.stall===i&&c.age>=240),calf=S.herd.filter(c=>c.stall===i&&c.age<240);
 if(!a)return showModal('<h3>🐄 Baia '+(i+1)+'</h3><div class="card">Baia vazia, com palha limpa, cocho e água.<div class="dim">Para trazer uma vaca: no pasto, fale com ela e escolha “Levar no cabresto”, depois entre no celeiro. Na baia ela come ração (R$ 12/dia), fica protegida de onça e ladrão, e o parto difícil fica raro.</div></div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>');
 showModal('<h3>🐄 Baia '+(i+1)+': '+a.name+'</h3><div class="card">'+BREEDS[a.breed].n+' · '+Math.round(a.w)+' kg · saúde '+Math.round(a.hp)+'%'+(a.preg?'<br>🤰 Prenhe: faltam ~'+Math.max(0,GEST-a.preg)+' dias para parir':'')+(calf.length?'<br>🐮 Com '+calf.map(c=>c.name).join(', '):'')+(a.labor?'<br><b class="red">🚨 Em trabalho de parto difícil!</b>':'')+'</div>'
  +'<div class="btns">'+(a.labor?'<button class="b gold" data-act="stallhelp" data-v="'+a.id+'">🤲 Ajudar no parto</button>':'')+'<button class="b" data-act="stallfree" data-v="'+i+'">Soltar no pasto</button><button class="b gray" data-act="close">Fechar</button></div>')}
const _raF=roomAct;roomAct=function(it,r){if(it.act==='stall')return stallModal(it.idx);return _raF(it,r)};
const _ilF=interactList;interactList=function(){const L=_ilF();if(inRoom()){const r=roomAt(P.x,P.y);if(r&&r.id==='barn')L.forEach(l=>{if(l.label==='Usar'){const it=r.items.find(q=>q.act==='stall'&&Math.abs(((r.x+q.x+1)*TS)-l.x)<2);if(it){const a=S.herd.find(c=>c.stall===it.idx&&c.age>=240);l.label='🐄 Baia '+(it.idx+1)+(a?': '+a.name+(a.labor?' 🚨':''):' (vazia)')}}})}
 else if(LEAD){L.push({x:P.x,y:P.y,r:6,label:'🪢 Puxando '+LEAD.name+' (entre no celeiro)',fn:()=>toast('Leve '+LEAD.name+' até a porta do celeiro.')})}return L};
// parto e trato na baia
const _brF=birth;
birth=function(a){if(a.stall!=null&&!a.labor){if(Math.random()<.06){a.labor=S.day;toast('🚨 '+a.name+' entrou em parto difícil na baia do celeiro!','bad')}else birthOK(a,true);return}_brF(a)};
const _boF=birthOK;birthOK=function(a,as){const c=_boF(a,as);if(c&&a.stall!=null)c.stall=a.stall;return c};
const _hdF=hookDay;hookDay=function(){_hdF();const st=S.herd.filter(a=>a.stall!=null&&a.age>=240);if(st.length){cash(-12*st.length,'Ração das baias');st.forEach(a=>{a.hp=Math.min(100,a.hp+3);a.w=Math.min(wmax(a),a.w+.6)})}};
GUIDE.push({lv:2,ic:'🏠',t:'Baias do celeiro',h:'Fale com uma vaca no pasto e escolha “Levar no cabresto”. Ela segue você; entre no celeiro e ela vai para uma das 3 baias. Lá ela come ração (R$ 12/dia), fica protegida de onça e ladrão e o parto difícil fica raro — ótimo para vacas prenhes. Solte pela baia ou pela ficha da vaca.'});
