// ===== Vila: veterinária com atendimento de verdade, Banco do Agro novo (salão grande) e a PREFEITURA MUNICIPAL
// ---------- pessoas fixas dentro dos salões (aparência própria, de costas, sentadas...)
const CIV={
 rec:{n:'Recepcionista Ana',g:'f',shirt:'#f4f0e8',hair:'#3a2210',pants:'#2a3a2a',look:{g:'f',jacket:'#2f5a3a',jk:'terno',slv:'#2f5a3a',cuff:'#f4f0e8',skirt:'#2a3a2a'}},
 rec2:{n:'Recepcionista Lívia',g:'f',shirt:'#f4f0e8',hair:'#e0c070',pants:'#2a3a2a',look:{g:'f',jacket:'#2f5a3a',jk:'terno',slv:'#2f5a3a',cuff:'#f4f0e8',skirt:'#2a3a2a'}},
 v1:{n:'Vereador Osmar',shirt:'#f4f4f0',hair:'#9a9a9a',pants:'#2a2a2a',look:{jacket:'#2a2a3a',jk:'terno',slv:'#2a2a3a',cuff:'#fff',tie:'#8a1a2a',beard:'bigode'}},
 v2:{n:'Vereadora Célia',g:'f',shirt:'#f4f4f0',hair:'#2a1a10',pants:'#3a1a2a',look:{g:'f',jacket:'#6a2a4a',jk:'terno',slv:'#6a2a4a',cuff:'#fff',skirt:'#3a1a2a',pearls:1}},
 v3:{n:'Vereador Tavinho',shirt:'#e8e0d0',hair:'#3a2a1a',pants:'#3a3a2a',look:{jacket:'#3a4a2a',jk:'terno',slv:'#3a4a2a',cuff:'#fff',tie:'#c8a040'}},
 v4:{n:'Vereador Dito',shirt:'#f0e8d8',hair:'#c8c8c8',pants:'#4a3a2a',look:{jacket:'#5a4a3a',jk:'terno',slv:'#5a4a3a',cuff:'#fff',tie:'#2a4a8a',beard:'barba'}},
 at1:{n:'Atendente Joice',g:'f',shirt:'#2f5a3a',hair:'#1a1a1a',pants:'#2a2a2a'},
 at2:{n:'Atendente Marcos',shirt:'#2f5a3a',hair:'#5a3a22',pants:'#2a2a2a'},
 c1:{n:'Dona Zefa',g:'f',shirt:'#c86a8a',hair:'#d8d8d8',pants:'#5a4a8a'},
 c2:{n:'Seu Lauro',shirt:'#7a9ac8',hair:'#3a2a1a',pants:'#3a3a2a',hat:'#c8a870'},
 c3:{n:'Cidadão',shirt:'#d8a040',hair:'#1a1a1a',pants:'#2a3a5a'},
 t1:{n:'Caixa Renata',g:'f',shirt:'#f4f4f0',hair:'#5a2a10',pants:'#1a2a4a',look:{g:'f',jacket:'#1a2a4a',jk:'terno',slv:'#1a2a4a',cuff:'#fff',skirt:'#1a2a4a'}},
 t2:{n:'Caixa Paulo',shirt:'#f4f4f0',hair:'#1a1a1a',pants:'#1a2a4a',look:{jacket:'#1a2a4a',jk:'terno',slv:'#1a2a4a',cuff:'#fff',tie:'#c8a040'}},
 t3:{n:'Caixa Bia',g:'f',shirt:'#f4f4f0',hair:'#e8c060',pants:'#1a2a4a',look:{g:'f',jacket:'#1a2a4a',jk:'terno',slv:'#1a2a4a',cuff:'#fff',skirt:'#1a2a4a'}},
 k1:{n:'Fazendeiro',shirt:'#8a5a3a',hair:'#2a1a10',pants:'#3a4a6a',hat:'#6a4a2a'},
 k2:{n:'Cliente',g:'f',shirt:'#5a8a5a',hair:'#3a2a1a',pants:'#3a3a4a'},
 k3:{n:'Aposentado',shirt:'#d8d0c0',hair:'#a8a8a8',pants:'#5a4a3a'},
 vetat:{n:'Lúcia (atendente)',g:'f',shirt:'#2f7a6a',hair:'#5a3a22',pants:'#e8f0f0'}};
const _dcCiv=drawClerk;drawClerk=function(g,it,r){
 if(it.when==='joao'&&!joaoIn())return;
 if(!it.who&&!it.npc&&!it.dir)return _dcCiv(g,it,r);
 const x=(r.x+it.x)*TS+8+(it.ox||0),y=(r.y+it.y)*TS+12+(it.dy||0),dir=it.dir||0;
 if(it.npc){const n=npcById(it.npc);if(!n)return;const st=(typeof NPCSTY!=='undefined'&&NPCSTY[it.npc])||{};OL(g,x,y+3,30,44,c=>drawHuman(c,{x,y,dir,ph:0,mv:0,hid:hsh(it.npc),smile:1},Object.assign(personLook({shirt:n.col,hair:n.hair}),{hat:null,beard:null,skirt:null},st)));return}
 const w=CIV[it.who]||it.who;OL(g,x,y+3,30,44,c=>drawPerson(c,Object.assign({x,y,dir,ph:0,mv:0,smile:1},w)))};
// rótulos dos itens com ação própria
const _ilCiv=interactList;interactList=function(){const L=_ilCiv();if(!inRoom())return L;const r=roomAt(P.x,P.y);if(!r)return L;
 for(const it of r.items){if(!it.lbl||!it.act)continue;const px=(r.x+it.x+(it.w||1)/2)*TS,py=(r.y+it.y+(it.h||1))*TS+4;for(const l of L)if(Math.abs(l.x-px)<1&&Math.abs(l.y-py)<1)l.label=it.lbl}return L};
// ---------- VETERINÁRIA: fala com a Dra. Marina na mesa de exame, e a farmácia tem atendente
{const V=ROOMS.vet;if(V){const ex=V.items.find(i=>i.k==='examtable');if(ex){ex.act='npc'}const ct=V.items.find(i=>i.k==='counter');if(ct){ct.act='vetfarm';ct.lbl='🛒 Farmácia veterinária (remédios e kits)'}
 if(!V.items.some(i=>i.who==='vetat'))V.items.push({k:'clerk',x:8,y:4,who:'vetat'})}}
// ---------- desenho dos móveis novos
const PFG='#c8a040';// dourado
function pfFlag(g,x,y,k,t){// bandeira pendurada (k: br, est, mun)
 const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),w=12,h=8,wv=i=>Math.sin((t||0)+i*.7)*.8;
 for(let i=0;i<w;i++){const o=wv(i);if(k==='br'){R('#1f8a3a',i,o,1,h);if(i>1&&i<w-2){const m=Math.min(i-1,w-2-i)/(w/2-2);R('#f0d040',i,o+h/2-m*3,1,m*6)}if(i>=4&&i<=7)R('#2a3a9a',i,o+2.5,1,3)}
  else if(k==='est'){R('#f4f4f0',i,o,1,h);R('#c83a2a',i,o,1,2.6);R('#1a1a1a',i,o+5.4,1,2.6)}
  else{R('#f4f4f0',i,o,1,h);R('#2f6a3a',i,o,1,1);R('#2f6a3a',i,o+h-1,1,1);if(i>=4&&i<=7){R(PFG,i,o+2,1,4)}}}}
const _dfCiv=drawFurn;drawFurn=function(g,it,x,y,r){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),F=frame,W=(it.w||1)*TS,H=(it.h||1)*TS;
 switch(it.k){
  // ===== PREFEITURA
  case 'pf_recep':{R('rgba(0,0,0,.22)',2,H-2,W,4);R('#5a2a16',0,-2,W,H);R('#7a3a20',2,0,W-4,H-5);R('#f2ece0',-2,-5,W+4,4);R('#d8d0c0',-2,-2,W+4,1);R(PFG,-2,-5,W+4,1);
   for(let i=8;i<W-8;i+=16)R('#6a321a',i,1,1,H-6);R(PFG,W/2-7,1,14,9);R('#2f6a3a',W/2-6,2,12,7);R(PFG,W/2-2,3,4,4);R('#f2ece0',W/2-1,4,2,2);
   R('#1a1a1a',10,-13,10,7);R('#3a6ab0',11,-12,8,5);R('#2a2a2a',14,-6,2,2);R('#1a1a1a',W-20,-13,10,7);R('#3a6ab0',W-19,-12,8,5);R('#2a2a2a',W-16,-6,2,2);
   R('#f4f4f0',W/2-15,-8,7,3);R('#e04a3a',W/2+10,-9,3,4);R('#3a8a3a',W/2+10,-12,3,3);
   R('#2f5a3a',W/2-22,-22,44,8);R(PFG,W/2-22,-22,44,1);ptext(g,'RECEPCAO',x+W/2-16,y-20,'#f0e0a0');R('#2a2a2a',W/2-1,-14,2,6);break}
  case 'pf_bandeiras':{for(let i=0;i<3;i++){const px=x+[4,18,84][i];Rr(g,'#4a3a2a',px-3,y+H-5,7,5);Rr(g,PFG,px-1,y+H-6,3,2);Rr(g,'#c8b890',px,y-30,1.2,H+26);Rr(g,PFG,px-.8,y-33,2.8,3);pfFlag(g,px+1.2,y-29,['br','est','mun'][i],F/18+i)}break}
  case 'pf_busto':{R('rgba(0,0,0,.25)',1,H-2,W,4);R('#8a8478',2,-6,W-4,H+4);R('#a8a296',3,-6,W-6,2);R('#6a6458',2,H-4,W-4,2);R(PFG,4,0,W-8,3);
   R('#7a7466',4,-16,8,10);R('#8a8478',5,-24,6,9);R('#a8a296',6,-23,4,2);R('#5a5448',6,-20,1,1);R('#5a5448',9,-20,1,1);R('#6a6458',5,-25,6,2);break}
  case 'pf_maquete':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#5a3a22',0,2,W,H-4);R('#7a5232',0,2,W,2);R('#3a2a1a',2,H-2,2,2);R('#3a2a1a',W-4,H-2,2,2);
   R('rgba(200,230,255,.35)',-1,-12,W+2,15);R('#9ab0c0',-1,-12,W+2,1);R('#5a9a4a',2,-8,W-4,9);R('#c8b890',2,-3,W-4,1.4);R('#c8b890',W/2-1,-8,1.4,9);
   for(const[a,b,c]of[[5,-8,'#d84a3a'],[11,-7,'#f4f0e4'],[20,-7,'#4a7ad8'],[28,-8,'#f0d040'],[36,-7,'#e8e0d0']]){R(c,a,b,5,4);R(shade(c,-30),a,b,5,1)}R('#f4f4f0',W-12,-11,6,7);R(PFG,W-10,-13,2,2);
   ptext(g,'MAQUETE',x+W/2-14,y+4,'#f0e0a0');break}
  case 'pf_guiche':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#2f4a3a',0,0,W,H-2);R('#3f5a4a',0,0,W,3);R('#e8e0cc',-1,-3,W+2,3);R('rgba(180,220,240,.45)',0,-15,W,12);R('#b8bcc4',0,-16,W,1.2);
   for(const cx of[W*.27,W*.73]){R('#b8bcc4',cx-1,-15,1,12);R('#1a1a1a',cx-5,-5,10,1.2)}R('#b8bcc4',W/2,-15,1.4,12);
   R('#1a1a1a',W*.27-20,-26,40,9);ptext(g,'PROTOCOLO',x+W*.27-18,y-24,'#7ad04a');R('#1a1a1a',W*.73-18,-26,36,9);ptext(g,'TRIBUTOS',x+W*.73-16,y-24,'#7ad04a');
   R('#1a0808',W/2-9,-38,18,9);ptext(g,'0'+(40+((F>>8)%60)),x+W/2-6,y-36,'#ff4a3a');break}
  case 'pf_mesacamara':{R('rgba(0,0,0,.2)',2,H-2,W,4);R('#4a2a16',0,-2,W,H);R('#2f6a3a',-1,-5,W+2,4);R(PFG,-1,-2,W+2,1);for(let i=10;i<W;i+=22){R('#1a1a1a',i,-10,1,6);R('#3a3a3a',i-1,-11,3,2);R('#f4f0e4',i+3,-6,7,2.4)}R('#5a3a22',W-14,-7,6,2);R('#3a2a1a',W-12,-9,2,3);
   R('#f4f0e4',W/2-10,1,20,6);ptext(g,'MESA',x+W/2-8,y+2,'#2f5a3a');break}
  case 'pf_bancada':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#5a3a22',0,-3,W,H-1);R('#7a5232',0,-3,W,3);for(let i=8;i<W;i+=16){R('#1a1a1a',i,-9,1,6);R('#3a3a3a',i-1,-10,3,2);R('#f4f0e4',i+3,-5,6,2)}break}
  case 'pf_portagab':{R('#3a2010',-2,-28,W+4,H+26);R('#6a3a1a',1,-25,W/2-2,H+22);R('#6a3a1a',W/2+1,-25,W/2-2,H+22);R('#7a4a26',3,-23,W/2-6,8);R('#7a4a26',W/2+3,-23,W/2-6,8);R('#7a4a26',3,-11,W/2-6,10);R('#7a4a26',W/2+3,-11,W/2-6,10);
   R(PFG,W/2-3,-8,2,4);R(PFG,W/2+1,-8,2,4);R(PFG,-2,-30,W+4,2);R('#1a2a1a',W/2-20,-40,40,9);R(PFG,W/2-20,-40,40,1);ptext(g,'GABINETE',x+W/2-16,y-38,'#f0e0a0');break}
  case 'pf_coluna':{R('rgba(0,0,0,.25)',1,H-3,W,4);R('#e8e2d4',1,H-6,W-2,5);R('#d8d0c0',1,H-2,W-2,1);R('#f6f2e8',3,-36,W-6,H+30);R('#d8d0c0',W-5,-36,2,H+30);for(let i=5;i<W-5;i+=3)R('#e0d8c8',i,-34,1,H+26);R(PFG,1,-38,W-2,3);R('#e8e2d4',0,-41,W,3);break}
  case 'pf_mesagab':{R('rgba(0,0,0,.25)',2,H-2,W,4);R('#4a2010',0,-4,W,H+2);R('#6a3018',2,-2,W-4,H-4);for(let i=12;i<W-8;i+=20)R('#5a2814',i,-1,1,H-6);R(PFG,0,-4,W,1);R('#2f5a3a',8,-8,W-16,4);R('#5a2814',0,-8,W,1);
   R('#f4f0e4',12,-11,8,5);R('#f4f0e4',14,-12,8,5);R('#1a1a1a',W-22,-12,6,4);R('#3a3a3a',W-21,-13,4,1);R(PFG,W-12,-18,1,8);R(PFG,W-15,-19,7,2);R('#f8e8a0',W-14,-17,5,1);
   R(PFG,W/2-18,-8,36,7);ptext(g,souPrefeito()?'VOCE':'PREFEITO',x+W/2-(souPrefeito()?8:16),y-7,'#2a1a10');R('#2a2a6a',W/2+16,-10,2,3);break}
  case 'pf_cadeira':{const cx=x+8,cy=y+4;Rr(g,'#2a1208',cx-7,cy-24,14,20);Rr(g,'#4a2210',cx-6,cy-23,12,18);for(let i=0;i<3;i++)Rr(g,PFG,cx-5+i*5,cy-22,1,1);Rr(g,'#2a1208',cx-8,cy-6,16,5);break}
  case 'pf_estante':{R('rgba(0,0,0,.2)',1,H-2,W,3);R('#4a2a16',0,-34,W,H+32);R('#2a1608',2,-32,W-4,H+28);const cs=['#8a1a1a','#1a3a6a','#2f6a3a','#c8a040','#5a2a5a','#d8d0c0'];
   for(let s=0;s<4;s++){const sy=-30+s*11;R('#5a3a22',2,sy+9,W-4,2);for(let i=3;i<W-4;i+=3){const h0=hsh(it.x+'b'+s+i)%3;R(cs[(i+s*2)%6],i,sy+1+h0,2.4,8-h0)}}R(PFG,W/2-3,-31,6,5);break}
  case 'pf_mesinha':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#4a2a16',2,2,W-4,H-6);R('#6a3a1a',2,2,W-4,2);R('#f4f0e4',8,0,8,4);R('#d84a3a',10,1,4,1);R('#e8e2d8',W-14,-2,6,5);R('#3a8a3a',W-13,-6,4,5);break}
  case 'pf_bandeira1':{const px=x+6;Rr(g,'#4a3a2a',px-3,y+H-5,7,5);Rr(g,'#c8b890',px,y-28,1.2,H+24);Rr(g,PFG,px-.8,y-31,2.8,3);pfFlag(g,px+1.2,y-27,it.f||'br',F/20);break}
  case 'pf_lustres':{const rm=r,ys=(rm.y+2.6)*TS;const xs=rm.id==='prefgab'?[rm.w/2]:rm.id==='banco'?[5,13.5,22]:[6,18,30];
   for(const lx of xs){const X=(rm.x+lx)*TS;Rr(g,PFG,X-.5,(rm.y+.6)*TS,1,ys-(rm.y+.6)*TS);Rr(g,PFG,X-9,ys,18,2);Rr(g,'#e8c860',X-7,ys+2,14,1.4);for(let k=-2;k<=2;k++){Rr(g,'#fffaf0',X+k*4-.5,ys-3,1,3);Rr(g,(F>>3)%5===k+2?'#fff8c0':'#ffd870',X+k*4-.5,ys-5,1,2);Rr(g,'rgba(220,240,255,.8)',X+k*4-.4,ys+3+Math.abs(k),.8,2)}
    }break}
  // ===== BANCO
  case 'bk_caixas':{R('rgba(0,0,0,.22)',2,H-2,W,4);R('#1a2a4a',0,-2,W,H);R('#24365a',2,1,W-4,H-6);for(let i=16;i<W;i+=32)R(PFG,i,1,1,H-6);R('#ece8e0',-2,-5,W+4,4);R('#c8c4bc',-2,-2,W+4,1);
   R('rgba(170,210,240,.42)',0,-22,W,17);R('#b8bcc4',0,-23,W,1.4);const wins=[40,104,184];for(let i=0;i<=W;i+=32)R('#b8bcc4',i-.5,-22,1.2,17);
   wins.forEach((cx,i)=>{R('#1a1a1a',cx-6,-8,12,1.4);R('#2a2a2a',cx+7,-9,4,3);R('#4ab04a',cx+8,-8.4,2,1);R('#0a1a3a',cx-16,-33,32,9);R(PFG,cx-16,-33,32,1);ptext(g,'CAIXA '+(i+1),x+cx-14,y-31,'#f0e0a0');R((F>>5)%3===i?'#ff4a3a':'#4ad04a',cx+17,-31,3,3)});break}
  case 'bk_cofre':{const cx=W/2,cy=-8;R('#3a3e46',-2,-30,W+4,H+28);R('#4a4e56',0,-28,W,H+24);
   R('#2a1a08',4,-24,W/2-6,H+18);for(let s=0;s<3;s++)for(let i=0;i<4;i++){R('#f0c040',6+i*5,-4-s*5,4,3);R('#c8961a',6+i*5,-2-s*5,4,1)}R('#8a5a2a',8,-20,9,6);R('#6a4a1a',8,-20,9,1);
   g.fillStyle='#8a8e96';g.beginPath();g.arc(x+cx+8,y+cy,15,0,Math.PI*2);g.fill();g.fillStyle='#a8acb4';g.beginPath();g.arc(x+cx+8,y+cy,12,0,Math.PI*2);g.fill();g.fillStyle='#6a6e76';g.beginPath();g.arc(x+cx+8,y+cy,4,0,Math.PI*2);g.fill();
   const a0=F/60;for(let k=0;k<3;k++){const a=a0+k*2.09;Rr(g,'#c8ccd4',x+cx+8+Math.cos(a)*4-1,y+cy+Math.sin(a)*4-1,Math.cos(a)*6+2,2)}for(let k=0;k<8;k++){const a=k*.785;Rr(g,'#5a5e66',x+cx+8+Math.cos(a)*13.5-1,y+cy+Math.sin(a)*13.5-1,2,2)}
   R('#c8ccd4',W-6,-26,3,H+20);R('#1a1a1a',W/2-14,-38,28,8);ptext(g,'COFRE',x+W/2-9,y-36,'#f0e0a0');break}
  case 'bk_atm':{for(let i=0;i<3;i++){const ax=i*16+1;R('rgba(0,0,0,.25)',ax+1,H-2,14,3);R('#2a3a5a',ax,-18,14,H+16);R('#3a4a6a',ax+1,-17,12,4);ptext(g,'24H',x+ax+1.5,y-16.5,'#f0d060');R('#0a1a2a',ax+2,-11,10,7);R((F>>4)%4===i?'#5ad0ff':'#3a8ad0',ax+3,-10,8,5);
    R('#1a1a1a',ax+3,-2,8,1);for(let k=0;k<3;k++)for(let j=0;j<2;j++)R('#c8ccd4',ax+3+k*3,1+j*2.6,2,1.6);R('#1a1a1a',ax+4,H-6,6,1)}break}
  case 'bk_gerente':{R('rgba(0,0,0,.22)',2,H-2,W,4);R('#2a1a10',0,-3,W,H+1);R('#4a2a18',2,-1,W-4,H-4);R('#1a2a4a',6,-6,W-12,3);R(PFG,0,-3,W,1);
   R('#1a1a1a',W-22,-17,14,10);R('#3a6ab0',W-21,-16,12,7);R('#5ad0ff',W-19,-14,4,1);R('#2a2a2a',W-16,-7,4,2);R('#f4f0e4',8,-8,9,4);R('#2a2a2a',20,-7,2,3);R(PFG,22,-6,6,2);
   R('#f4f0e4',W/2-16,0,32,7);ptext(g,'GERENTE',x+W/2-14,y+1,'#1a2a4a');
   for(const cx of[W*.3,W*.7]){R('#1a2a4a',cx-5,H+2,10,8);R('#24365a',cx-5,H+2,10,2);R('#1a2a4a',cx-5,H-4,2,8);R('#1a2a4a',cx+3,H-4,2,8)}break}
  case 'bk_sofa':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#1a2a4a',0,0,W,H-2);R('#24365a',3,3,W-6,H-8);R('#122040',0,0,W,4);R('#122040',0,0,4,H-2);R('#122040',W-4,0,4,H-2);for(let i=10;i<W-6;i+=12)R('#2a3e66',i,4,1,H-10);break}
  case 'bk_mesa':{R('rgba(0,0,0,.2)',2,H-2,W,3);R('#ece8e0',0,0,W,4);R('#c8c4bc',0,4,W,1);R('#5a5e66',W/2-2,5,4,H-7);R('#5a5e66',W/2-8,H-3,16,2);R('#f4f0e4',4,-2,7,3);R('#f4f0e4',W-12,-2,7,3);R('#1a2a8a',W/2-1,-3,1,3);R('#5a5e66',W/2-3,-1,6,1);break}
  case 'bk_coluna':{R('rgba(0,0,0,.25)',1,H-3,W,4);R('#1a2a4a',1,H-6,W-2,5);R('#f2f0ea',3,-36,W-6,H+30);R('#d8d4cc',W-5,-36,2,H+30);for(let i=5;i<W-5;i+=3)R('#e4e0d8',i,-34,1,H+26);R(PFG,1,-38,W-2,3);R('#1a2a4a',0,-41,W,3);break}
  case 'bk_bebedouro':{R('rgba(0,0,0,.2)',2,H-2,12,3);R('#e8e8ec',3,-6,10,H+4);R('#c8ccd4',3,-6,10,1);R('#9ad0f0',4,-16,8,10);R('#6ab0e0',4,-12,8,6);R('#2a2a2a',6,-2,4,2);break}
 }
 return _dfCiv(g,it,x,y,r)};
// ---------- paredes
const _dwCiv=drawWallDeco;drawWallDeco=function(g,wd,x,y){const R=(c,a,b,w,h)=>Rr(g,c,x+a,y+b,w,h),F=frame;
 switch(wd.k){
  case 'pf_brasao':{const W=4*TS,cx=W/2;R('#1a3a2a',cx-36,1,72,29);R(PFG,cx-36,1,72,1);R(PFG,cx-36,29,72,1);
   g.fillStyle=PFG;g.beginPath();g.moveTo(x+cx-10,y+5);g.lineTo(x+cx+10,y+5);g.lineTo(x+cx+10,y+16);g.lineTo(x+cx,y+23);g.lineTo(x+cx-10,y+16);g.closePath();g.fill();
   g.fillStyle='#2f6a3a';g.beginPath();g.moveTo(x+cx-8,y+7);g.lineTo(x+cx+8,y+7);g.lineTo(x+cx+8,y+15);g.lineTo(x+cx,y+21);g.lineTo(x+cx-8,y+15);g.closePath();g.fill();
   R('#f0d060',cx-4,9,8,6);R('#f0d060',cx-6,8,2,2);R('#f0d060',cx+4,8,2,2);R('#2a1a10',cx-2,11,1,1);R('#2a1a10',cx+1,11,1,1);R('#f0d060',cx-2,15,4,2);
   for(let i=0;i<5;i++){R('#4a8a3a',cx-20+i*2,18-i*2,2,2);R('#4a8a3a',cx+18-i*2,18-i*2,2,2)}ptext(g,'VILA BOI DE OURO',x+cx-32,y+24,'#f0e0a0');break}
  case 'pf_retrato':{R(PFG,1,3,14,18);R('#3a2a1a',2,4,12,16);const h=hsh('ret'+x)%4;R(['#e8b890','#c89a70','#a87a50','#e8c8a0'][h],6,8,5,6);R(['#3a2a1a','#888','#1a1a1a','#c8c8c8'][h],5,6,7,3);R('#1a2a4a',4,14,9,6);R('#f4f4f0',7,14,3,3);R(PFG,4,21,8,2);break}
  case 'pf_camarasign':{const W=7*TS;R('#2f5a3a',4,5,W-8,13);R(PFG,4,5,W-8,1);R(PFG,4,17,W-8,1);ptext(g,'CAMARA MUNICIPAL',x+W/2-31,y+9,'#f0e0a0');break}
  case 'pf_mural':{const W=3*TS;R('#8a6a3a',2,3,W-4,20);R('#c8a878',3,4,W-6,18);for(let i=0;i<5;i++)R('#f4f0e4',5+i*8,6+(i%2)*3,6,8);R('#d84a3a',8,6,1,1);R('#2a6ad8',24,9,1,1);R('#2f5a3a',2,0,W-4,5);ptext(g,'AVISOS',x+W/2-11,y+.3,'#f0e0a0');break}
  case 'pf_mapa':{const W=4*TS;R('#4a2a16',2,3,W-4,22);R('#8ac0e0',4,5,W-8,18);R('#7ab04a',6,7,W-14,13);R('#c8b070',10,12,W-24,2);R('#c8b070',W/2-1,7,2,13);R('#3a7ad8',W-14,9,4,9);R('#d84a3a',W/2-3,11,4,4);R('#f0d040',14,9,2,2);R('#f0d040',W-22,16,2,2);R('#f4f0e4',W/2-19,18,38,6);ptext(g,'MUNICIPIO',x+W/2-17,y+18.5,'#2a1a10');break}
  case 'bk_logo':{const W=6*TS,cx=W/2;R('#0a1a3a',6,3,W-12,22);R(PFG,6,3,W-12,1.4);R(PFG,6,24,W-12,1.4);
   R(PFG,cx-38,8,12,12);R('#0a1a3a',cx-36,10,8,8);R(PFG,cx-35,12,6,5);R(PFG,cx-38,7,3,3);R(PFG,cx-29,7,3,3);// cabeça de boi
   ptext(g,'BANCO DO AGRO',x+cx-20,y+10,'#f0d060');ptext(g,'DESDE 1952',x+cx-14,y+17,'#c8b88a');break}
  case 'bk_cotacoes':{const W=4*TS;R('#0a0a0e',1,2,W-2,24);R('#3a3a42',1,2,W-2,1);let usd=5.2,soja=128,arr=320;try{const C=ensureCel();usd=C.usd;soja=C.soja}catch(e){}try{arr=Math.round(ARR_P())}catch(e){try{arr=Math.round(arroba('nelore')||arr)}catch(e2){}}
   const ln=[['ARROBA',arr,'#7ad04a'],['DOLAR',usd.toFixed(2).replace('.',','),'#ffd060'],['SOJA',Math.round(soja),'#7ad04a']];ln.forEach((l,i)=>{ptext(g,l[0],x+4,y+4+i*7,'#c8c8d0');ptext(g,String(l[1]),x+W-6-String(l[1]).length*4,y+4+i*7,l[2])});
   if((F>>5)&1)R('#ff4a3a',W-5,3,2,2);break}
  case 'bk_relogios':{const W=4*TS;['BSB','LON','NY'].forEach((n,i)=>{const cx=8+i*21;R('#1a2a4a',cx-1,4,13,13);R('#f4f0e8',cx,5,11,11);const hh=(S.t*24+[0,3,-2][i]+24)%12,ah=hh/12*Math.PI*2-Math.PI/2;Rr(g,'#1a1a1a',x+cx+5,y+10,Math.cos(ah)*3+.6,Math.sin(ah)*3+.6);Rr(g,'#1a1a1a',x+cx+5,y+7,.8,3.4);ptext(g,n,x+cx+6-n.length*2,y+19,'#1a2a4a')});break}
 }
 return _dwCiv(g,wd,x,y)};
// ---------- piso: tapete vermelho, parquet da Câmara, tapete persa do gabinete, passadeira e fila do banco
function civFloor(g,r){const X=r.x*TS,Y=r.y*TS;const R=(c,a,b,w,h)=>Rr(g,c,X+a,Y+b,w,h);
 if(r.id==='pref'){for(let ty=2;ty<=10;ty++)for(let tx=1;tx<=11;tx++)drawFloorTile(g,'wood',(r.x+tx)*TS,(r.y+ty)*TS,r.x+tx,r.y+ty);R('#5a3a22',11*TS+15,2*TS,1,9*TS);
  const mx=18*TS,my=8.5*TS;g.fillStyle='#2f6a3a';g.beginPath();g.arc(X+mx,Y+my,30,0,Math.PI*2);g.fill();g.fillStyle='#e8e6e2';g.beginPath();g.arc(X+mx,Y+my,27,0,Math.PI*2);g.fill();g.fillStyle=PFG;g.beginPath();g.arc(X+mx,Y+my,20,0,Math.PI*2);g.fill();g.fillStyle='#e8e6e2';g.beginPath();g.arc(X+mx,Y+my,18,0,Math.PI*2);g.fill();
  for(let k=0;k<8;k++){const a=k*Math.PI/4;Rr(g,'#2f6a3a',X+mx+Math.cos(a)*24-1.5,Y+my+Math.sin(a)*24-1.5,3,3)}
  R('#7a1414',17*TS-2,6*TS,2*TS+4,7*TS);R('#9a1c1c',17*TS+1,6*TS,2*TS-2,7*TS);R(PFG,17*TS,6*TS,1,7*TS);R(PFG,19*TS-1,6*TS,1,7*TS);for(let i=6*TS+6;i<13*TS;i+=12)R('#b02a2a',18*TS-3,i,6,2)}
 else if(r.id==='prefgab'){R('#5a1414',3*TS,3*TS,11*TS,6*TS);R('#1a2a5a',3*TS+3,3*TS+3,11*TS-6,6*TS-6);R('#8a1c1c',3*TS+7,3*TS+7,11*TS-14,6*TS-14);for(let i=3*TS+10;i<14*TS-10;i+=8){R(PFG,i,3*TS+5,2,2);R(PFG,i,9*TS-7,2,2)}
  g.fillStyle='#c8a040';g.beginPath();g.ellipse(X+8.5*TS,Y+6*TS,22,10,0,0,Math.PI*2);g.fill();g.fillStyle='#8a1c1c';g.beginPath();g.ellipse(X+8.5*TS,Y+6*TS,18,7,0,0,Math.PI*2);g.fill()}
 else if(r.id==='banco'){R('#0a1a3a',13*TS-2,6*TS,2*TS+4,6*TS);R('#1a2a4a',13*TS+1,6*TS,2*TS-2,6*TS);R(PFG,13*TS,6*TS,1,6*TS);R(PFG,15*TS-1,6*TS,1,6*TS);
  for(let i=0;i<5;i++){const px=(8.6+i*2.6)*TS,py=6.3*TS;Rr(g,'#8a6a1a',X+px-1.5,Y+py+5,3,1.5);Rr(g,PFG,X+px-.6,Y+py-3,1.4,8);Rr(g,'#f0d060',X+px-1,Y+py-4,2.2,2);if(i<4)for(let k=1;k<10;k++){const t=k/10;Rr(g,'#2a3e8a',X+px+t*2.6*TS,Y+py-1.5+Math.sin(t*Math.PI)*2.4,1.6,1.2)}}}}
const _drsCiv=drawRoomShell;drawRoomShell=function(g,r){_drsCiv(g,r);if(r.id==='pref'||r.id==='prefgab'||r.id==='banco')civFloor(g,r)};
// ---------- BANCO DO AGRO: salão novo, bem maior (o prédio da vila continua o mesmo por fora)
ROOMS.banco={id:'banco',x:192,y:RZ+29,w:28,h:13,floor:'marble',wall:'#d8dce4',trim:'#1a2a4a',win:[],items:[
 {k:'bk_caixas',x:6,y:4,w:14,h:1,act:'bk_caixa',lbl:'🏦 Caixas: empréstimos e finanças'},{k:'clerk',x:8,y:3,who:'t1'},{k:'clerk',x:12,y:3,who:'t2'},{k:'clerk',x:17,y:3,who:'t3'},
 {k:'clerk',x:8,y:5,who:'k1',dir:1,dy:3},{k:'clerk',x:11,y:6,who:'k2',dir:1,dy:4},{k:'clerk',x:13,y:6,who:'k3',dir:1,dy:4},
 {k:'bk_cofre',x:22,y:2,w:4,h:1,act:'bk_cofre',lbl:'🔒 Cofre-forte'},{k:'guard',x:21,y:3},
 {k:'bk_gerente',x:20,y:7,w:4,h:1,act:'bk_inv',lbl:'📈 Gerente Sílvia: investimentos'},{k:'clerk',x:21,y:6,dy:2},
 {k:'bk_atm',x:1,y:8,w:3,h:1,act:'bk_atm',lbl:'🏧 Caixa eletrônico (extrato)'},{k:'bk_mesa',x:4,y:10,w:2,h:1},
 {k:'bk_sofa',x:1,y:4,w:3,h:1},{k:'bk_bebedouro',x:26,y:6,w:1,h:1},
 {k:'bk_coluna',x:9,y:10,w:1,h:1},{k:'bk_coluna',x:19,y:10,w:1,h:1},
 {k:'luxplant',x:1,y:11},{k:'luxplant',x:26,y:11},{k:'luxplant',x:26,y:2},{k:'luxplant',x:5,y:2},{k:'guard',x:16,y:10}],
 wallx:[{k:'bk_cotacoes',x:1},{k:'bk_logo',x:10},{k:'bk_relogios',x:16}]};
// os lustres do banco usam o mesmo desenho
{const _dfL=drawFurn;drawFurn=function(g,it,x,y,r){if(it.k==='bk_lustres')return _dfL(g,Object.assign({},it,{k:'pf_lustres'}),x,y,r);return _dfL(g,it,x,y,r)}}
function bkExtrato(){reModal=bkExtrato;const fin=(S.fin||[]).reduce((s,x)=>s+(x.bal||0),0),L=(S.ledger||[]).slice(0,10);
 showModal('<h3>🏧 Caixa eletrônico 24h</h3><div class="card"><div class="row"><span>Saldo em conta</span><b class="gold">'+R$(S.money)+'</b></div><div class="row"><span>Empréstimo</span><b class="'+(S.debt?'red':'')+'">'+R$(S.debt||0)+'</b></div><div class="row"><span>Financiamentos</span><b class="'+(fin?'red':'')+'">'+R$(fin)+'</b></div><div class="row"><span>Patrimônio total</span><b>'+R$(myNW())+'</b></div></div>'
  +'<div class="sec">ÚLTIMOS LANÇAMENTOS</div><div class="card"><table>'+(L.map(e=>'<tr><td class="dim">dia '+(e.d%30+1)+'</td><td>'+e.l+'</td><td class="right '+(e.n>0?'grn':'red')+'">'+R$(e.n)+'</td></tr>').join('')||'<tr><td class="dim">Sem movimentos</td></tr>')+'</table></div>'
  +'<div class="btns"><button class="b gold" data-act="bkcaixa">🏦 Ir ao caixa</button><button class="b gray" data-act="close">Sair</button></div>')}
function bkCofre(){showModal('<h3>🔒 Cofre-forte</h3><div class="card">O segurança deixa você espiar pela porta redonda de aço: barras de ouro, malotes lacrados e as caixas-fortes dos clientes. A porta pesa 9 toneladas e só abre com dois gerentes.<br><br><b>Seu dinheiro no Banco do Agro:</b> <span class="gold">'+R$(Math.max(0,S.money))+'</span></div><div class="btns"><button class="b" data-act="bkext">📄 Ver extrato</button><button class="b gray" data-act="close">Sair</button></div>')}
function bkGerente(){showModal('<h3>📈 Gerente Sílvia</h3><div class="card">“Bom dia! Aqui você aplica o dinheiro, acompanha a bolsa e negocia financiamento para terra, máquina e gado. Em que posso ajudar?”</div><div class="btns"><button class="b gold" data-act="bkgo" data-v="bolsa">📈 Investimentos</button><button class="b" data-act="bkgo" data-v="fin">🏦 Empréstimos e financiamentos</button><button class="b" data-act="bkext">📄 Extrato</button><button class="b gray" data-act="close">Tchau</button></div>')}
ACT.bkext=()=>bkExtrato();ACT.bkcaixa=()=>{hideModal();openMenu('fin')};ACT.bkgo=e=>{hideModal();openMenu(e.v)};
// ---------- PREFEITURA MUNICIPAL (prédio grande na avenida, ao lado do lago, a leste do frigorífico)
if(!BLD.some(b=>b.id==='pref'))BLD.push({id:'pref',x:168,y:40,w:18,h:6,door:177,roof:'#3a4a5a',wall:'#f4eedf',label:'Prefeitura Municipal',sign:'PREFEITURA'});
const prefB=()=>BLD.find(b=>b.id==='pref');
const _rfcPref=rfCarve;rfCarve=function(){_rfcPref();const b=prefB();if(b){
  for(let y=b.y-1;y<b.y+b.h;y++)for(let x=b.x-2;x<=b.x+b.w+1;x++){const i=ti(x,y);SOL[i]=x>=b.x&&x<b.x+b.w&&y>=b.y?1:0;if(!(x>=b.x&&x<b.x+b.w&&y>=b.y))G[i]=G[i]===1||G[i]===2?0:G[i]}
  for(let y=b.y-3;y<b.y+b.h+1;y++)for(let x=b.x-3;x<=b.x+b.w+2;x++){const i=ti(x,y);if(G[i]===5)G[i]=0}for(let x=b.door-3;x<=b.door+3;x++){const i=ti(x,b.y+b.h);G[i]=3;SOL[i]=0}
  const inR=t=>t.x>=(b.x-2)*TS&&t.x<=(b.x+b.w+2)*TS&&t.y>=(b.y-1)*TS&&t.y<=(b.y+b.h+.6)*TS;for(const A of[TREES,BUSH])for(let i=A.length-1;i>=0;i--)if(inR(A[i])){const t=A[i];SOL[ti(Math.floor(t.x/TS),Math.floor(t.y/TS))]=0;A.splice(i,1)}
  if(typeof DECO!=='undefined')for(let i=DECO.length-1;i>=0;i--)if(inR(DECO[i]))DECO.splice(i,1);if(typeof BOULD!=='undefined')for(let i=BOULD.length-1;i>=0;i--){const q=BOULD[i];if(q.x>=b.x-2&&q.x<=b.x+b.w+1&&q.y>=b.y-1&&q.y<b.y+b.h)BOULD.splice(i,1)}}
 // estrada do Bairro Novo até o Salão de Gala (que saiu de cima dos terrenos)
 const e=BLD.find(q=>q.id==='elite');if(e){for(let x=157;x<=e.door+1;x++)for(const y of[84]){const i=ti(x,y);G[i]=3;SOL[i]=0;FEN[i]=0}
  const inE=t=>t.y>=83.2*TS&&t.y<=85*TS&&t.x>=156*TS&&t.x<=(e.door+2)*TS;for(const A of[TREES,BUSH])for(let i=A.length-1;i>=0;i--)if(inE(A[i])){SOL[ti(Math.floor(A[i].x/TS),Math.floor(A[i].y/TS))]=0;A.splice(i,1)}}};
if(typeof BART!=='undefined')BART.pref=function(g,b,x,y,w,h,dx){const R=(c,a,bb,ww,hh)=>Rr(g,c,x+a,y+bb,ww,hh);
 R('rgba(0,0,0,.3)',4,h-2,w,6);
 R('#e8e0cc',0,6,w,h-14);for(let i=10;i<h-10;i+=6)R('#ddd4bc',0,i,w,1);// paredes de pedra clara
 R('#c8c0ac',-2,h-10,w+4,10);R('#b8b09c',-2,h-10,w+4,1.4);R('#d8d0bc',-2,h-5,w+4,1);// embasamento
 R('#d8ccb0',-3,3,w+6,5);R(PFG,-3,7,w+6,1);R('#ece4d0',-1,-2,w+2,5);for(let i=2;i<w-2;i+=6){R('#f6f0e2',i,-6,3,5);R('#d8d0bc',i+2,-6,1,5)}R('#ece4d0',-1,-7,w+2,2);// cornija e balaustrada
 const win=(wx,wy)=>{R('#c8bea6',wx-2,wy-2,16,22);R('#f6f0e2',wx-1,wy-1,14,20);R('#2a3a4a',wx,wy,12,18);R('#6a9ac0',wx+1,wy+1,10,8);R('#5a8ab0',wx+1,wy+10,10,7);R('#f6f0e2',wx+5.5,wy,1,18);R('#f6f0e2',wx,wy+9,12,1);R('#2f6a4a',wx-5,wy,4,18);R('#2f6a4a',wx+13,wy,4,18);R('#c8bea6',wx-2,wy+18,16,2);
  g.fillStyle='#f6f0e2';g.beginPath();g.arc(x+wx+6,y+wy,7,Math.PI,0);g.fill();g.fillStyle='#2a3a4a';g.beginPath();g.arc(x+wx+6,y+wy,5.5,Math.PI,0);g.fill()};
 for(const wx of[10,34,58,w-70,w-46,w-22]){win(wx,16);win(wx,48)}// alas com dois andares
 R('#d8ccb0',-1,40,dx-50,3);R('#d8ccb0',dx+50,40,w-dx-49,3);
 // pórtico central
 R('#f6f0e2',dx-50,6,100,h-16);R('#e8e0cc',dx-50,6,100,2);
 g.fillStyle='#e8e0cc';g.beginPath();g.moveTo(x+dx-56,y+8);g.lineTo(x+dx,y-22);g.lineTo(x+dx+56,y+8);g.closePath();g.fill();g.fillStyle='#f6f0e2';g.beginPath();g.moveTo(x+dx-46,y+6);g.lineTo(x+dx,y-17);g.lineTo(x+dx+46,y+6);g.closePath();g.fill();R(PFG,dx-56,7,112,2);
 R(PFG,dx-9,-11,18,14);R('#2f6a3a',dx-7,-9,14,10);R('#f0d060',dx-3,-7,6,5);R('#f0d060',dx-5,-8,2,2);R('#f0d060',dx+3,-8,2,2);// brasão no frontão
 R('#2f5a3a',dx-46,10,92,9);R(PFG,dx-46,10,92,1);R(PFG,dx-46,18,92,1);ptext(g,'PREFEITURA MUNICIPAL',x+dx-40,y+12,'#f0e0a0');
 for(let i=0;i<6;i++){const cx=dx-42+i*16.8;R('#fbf8f0',cx-3,22,7,h-34);R('#ddd6c6',cx+2,22,2,h-34);R(PFG,cx-4,20,9,2.4);R('#e8e0cc',cx-4,h-13,9,2.4)}
 // torre do relógio
 R('#ece4d0',dx-13,-44,26,24);R('#d8ccb0',dx-13,-44,26,2);R('#d8ccb0',dx+10,-44,3,24);R(PFG,dx-14,-21,28,2);g.fillStyle='#f6f0e2';g.beginPath();g.arc(x+dx,y-33,8,0,Math.PI*2);g.fill();g.fillStyle=PFG;g.beginPath();g.arc(x+dx,y-33,8,0,Math.PI*2);g.lineWidth=1.2;g.strokeStyle=PFG;g.stroke();
 R('#1a1a1a',dx-.5,-39,1,6);R('#1a1a1a',dx,-33.5,4,1);g.fillStyle='#3a6a5a';g.beginPath();g.arc(x+dx,y-44,13,Math.PI,0);g.fill();R(PFG,dx-13,-45,26,1.4);R(PFG,dx-1,-58,2,3);
 // portas, escadaria, lampiões e floreiras
 R('#c8bea6',dx-14,h-40,28,30);R('#3a2010',dx-11,h-37,22,27);R('#6a3a1a',dx-10,h-36,9.5,26);R('#6a3a1a',dx+.5,h-36,9.5,26);R('#7a4a26',dx-8,h-33,6,9);R('#7a4a26',dx+2,h-33,6,9);R(PFG,dx-2,h-22,1.4,3);R(PFG,dx+.6,h-22,1.4,3);
 g.fillStyle='#c8bea6';g.beginPath();g.arc(x+dx,y+h-37,14,Math.PI,0);g.fill();g.fillStyle='#8ab0d0';g.beginPath();g.arc(x+dx,y+h-37,10,Math.PI,0);g.fill();R('#f6f0e2',dx-.5,h-47,1,10);
 for(let s=0;s<3;s++)R(s%2?'#d8d0bc':'#e8e0cc',dx-26-s*4,h-10+s*3.4,52+s*8,3.4);
 for(const lx of[dx-22,dx+20]){R('#1a1a1a',lx,h-30,2,20);R('#1a1a1a',lx-2,h-34,6,4);R(S&&S.t*24>=18||S&&S.t*24<6?'#ffe08a':'#e8e0b0',lx-1,h-33,4,3)}
 for(const fx of[6,w-30]){R('#8a6a4a',fx,h-12,24,5);for(let i=0;i<8;i++){R('#3a8a3a',fx+1+i*3,h-15,3,4);R(['#e84a5a','#f0d040','#e87ab0'][i%3],fx+1.5+i*3,h-16,2,2)}}
 R('#2f5a3a',w-66,h-24,38,9);R(PFG,w-66,h-24,38,1);ptext(g,'ANO 1898',x+w-63,y+h-22,'#f0e0a0')};
const _blPref=bLive;bLive=function(g,b){_blPref(g,b);if(b.id!=='pref')return;const x=b.x*TS,y=b.y*TS,dx=b.door*TS-x;
 pfFlag(g,x+dx+1,y-62,'br',frame/9);Rr(g,'#c8b890',x+dx,y-62,1,6);
 ['est','br','mun'].forEach((k,i)=>{const px=x+dx-82+i*14;Rr(g,'#d8d0bc',px,y+b.h*TS-34,1.2,32);Rr(g,PFG,px-.8,y+b.h*TS-36,2.8,2.4);pfFlag(g,px+1.2,y+b.h*TS-34,k,frame/9+i)})};
// ---------- salão da prefeitura (36 x 14) e gabinete (18 x 11)
ROOMS.pref={id:'pref',x:134,y:RZ+29,w:36,h:14,floor:'marble',wall:'#efe6d2',trim:'#2f5a3a',win:[],items:[
 {k:'pf_bandeiras',x:15,y:2,w:6,h:1},{k:'clerk',x:16,y:4,who:'rec',dy:-1},{k:'clerk',x:19,y:4,who:'rec2',dy:-1},
 {k:'pf_recep',x:14,y:5,w:8,h:1,act:'pf_recep',lbl:'💬 Recepção da Prefeitura'},
 {k:'pf_coluna',x:12,y:3,w:1,h:1},{k:'pf_coluna',x:23,y:3,w:1,h:1},{k:'pf_coluna',x:12,y:10,w:1,h:1},{k:'pf_coluna',x:23,y:10,w:1,h:1},
 {k:'clerk',x:4,y:2,who:'v1',dy:3},{k:'clerk',x:7,y:2,who:'v2',dy:3},
 {k:'pf_mesacamara',x:3,y:3,w:6,h:1,act:'pf_camara',lbl:'🏛️ Câmara Municipal: votação da semana'},{k:'podium',x:10,y:4,w:1,h:1},
 {k:'pf_bancada',x:1,y:6,w:4,h:1},{k:'pf_bancada',x:6,y:6,w:4,h:1},{k:'clerk',x:2,y:7,who:'v3',dir:1,dy:-2},{k:'clerk',x:7,y:7,who:'v4',dir:1,dy:-2},
 {k:'pew',x:1,y:9,w:4,h:1},{k:'pew',x:6,y:9,w:4,h:1},
 {k:'pf_portagab',x:30,y:2,w:3,h:1,act:'pf_gab',lbl:'🚪 Gabinete do Prefeito'},{k:'guard',x:33,y:3},
 {k:'pf_guiche',x:24,y:4,w:5,h:1,act:'pf_serv',lbl:'📋 Protocolo: merenda escolar e eleições'},{k:'clerk',x:25,y:3,who:'at1'},{k:'clerk',x:27,y:3,who:'at2'},
 {k:'mbench',x:25,y:8,w:3,h:1},{k:'mbench',x:30,y:8,w:3,h:1},{k:'clerk',x:26,y:7,who:'c1',dy:5},{k:'clerk',x:31,y:7,who:'c2',dy:5},{k:'clerk',x:28,y:6,who:'c3',dir:1,dy:2},
 {k:'pf_maquete',x:30,y:5,w:3,h:1,act:'pf_obras',lbl:'🏗️ Maquete: obras da cidade'},
 {k:'pf_busto',x:9,y:11,w:1,h:1,act:'pf_busto',lbl:'🗿 Busto do fundador'},
 {k:'luxplant',x:1,y:12},{k:'luxplant',x:34,y:12},{k:'luxplant',x:14,y:12},{k:'luxplant',x:21,y:12},{k:'luxplant',x:34,y:5}],
 wallx:[{k:'pf_camarasign',x:2},{k:'pf_retrato',x:12},{k:'pf_brasao',x:16},{k:'pf_retrato',x:22},{k:'pf_mural',x:25},{k:'clock',x:28}]};
ROOMS.prefgab={id:'prefgab',x:172,y:RZ+29,w:18,h:11,floor:'wood',wall:'#e8dcc0',trim:'#5a3a22',win:[13],items:[
 {k:'pf_bandeira1',x:5,y:2,w:1,h:1,f:'br'},{k:'pf_bandeira1',x:11,y:2,w:1,h:1,f:'mun'},
 {k:'pf_cadeira',x:8,y:3,w:0,h:0},{k:'clerk',x:8,y:3,npc:'joao',when:'joao',dy:4},
 {k:'pf_mesagab',x:6,y:4,w:5,h:1,act:'pf_joao',lbl:'💬 Mesa do prefeito'},
 {k:'chair',x:7,y:6},{k:'chair',x:9,y:6},
 {k:'pf_estante',x:1,y:2,w:3,h:1},{k:'pf_estante',x:14,y:2,w:3,h:1},
 {k:'luxsofa',x:1,y:6,w:3,h:1},{k:'pf_mesinha',x:1,y:8,w:3,h:1},{k:'cabinet',x:14,y:6,w:2,h:1},
 {k:'luxplant',x:15,y:9},{k:'luxplant',x:12,y:9}],
 wallx:[{k:'pf_mapa',x:6},{k:'clock',x:11}]};
CLERK.pref={n:'Recepcionista Ana',shirt:'#2f5a3a',hair:'#3a2210',g:'f',pants:'#2a3a2a'};CLERK.prefgab={n:'Seu João',npc:'joao'};
// sai do gabinete de volta para o salão
const _exPref=exitRoom;exitRoom=function(){const cr=inRoom()&&roomAt(P.x,P.y);if(cr&&cr.id==='prefgab'&&RET){const Rt=RET,back=SUBSTK.pop()||null;fade(()=>{P.x=Rt.x;P.y=Rt.y;P.dir=0;P.vx=P.vy=0;camInit=0;RET=back});return}return _exPref()};
// expediente: aberta das 6h às 22h
const _erPref=enterRoom;enterRoom=function(id){if(id==='pref'){const h=S.t*24;if(h<6||h>=22)return toast('🏛️ Prefeitura fechada. Expediente das 6h às 22h.','bad')}return _erPref(id)};
// Seu João trabalha no gabinete (depois que você já conversou com ele na praça)
HIDEW=n=>n.id==='joao'&&!!(S&&S.tf&&S.tf.joao);
Object.defineProperty(WORKP,'joao',{configurable:true,get(){const b=prefB();return S&&S.tf&&S.tf.joao&&b?{x:b.door*TS+8,y:(b.y+b.h)*TS+8}:{x:116*TS,y:57*TS}}});
function joaoIn(){const n=typeof npcById==='function'&&npcById('joao');return !!(n&&n.hid&&n.task==='work'&&HIDEW(n))}
const souPrefeito=()=>!!(S&&S.emp&&S.emp.pol&&S.emp.pol.pref&&S.day<S.emp.pol.prefEnd);
// ---------- ações dentro da prefeitura e do banco
const _raCiv=roomAct;roomAct=function(it,r){switch(it.act){
 case 'vetfarm':return npcModal('marina');
 case 'bk_caixa':return openMenu('fin');case 'bk_inv':return bkGerente();case 'bk_atm':return bkExtrato();case 'bk_cofre':return bkCofre();
 case 'pf_recep':return prefRecep();case 'pf_serv':return prefServ();case 'pf_camara':return prefCamara();case 'pf_obras':return prefObras();case 'pf_busto':return prefBusto();case 'pf_joao':return prefJoao();
 case 'pf_gab':return goSub('prefgab',{x:(r.x+it.x+1.5)*TS,y:(r.y+it.y+2)*TS+8});}
 return _raCiv(it,r)};
function prefRecep(){showModal('<h3>🏛️ Prefeitura de Vila Boi de Ouro</h3><div class="card">'+CIV.rec.n+': “Bom dia! Seja bem-vindo à Prefeitura.'+(souPrefeito()?' Que honra, senhor prefeito!':'')+' Em que posso ajudar?”</div>'
 +'<div class="card dim">📋 <b>Protocolo</b> (guichês à direita): merenda escolar e eleições.<br>🏛️ <b>Câmara Municipal</b> (à esquerda): votação de um projeto toda semana.<br>🚪 <b>Gabinete</b> (fundo, à direita): '+(joaoIn()?'o Seu João está atendendo agora.':'o Seu João atende das 8h às 12h e das 13h30 às 17h.')+'<br>🏗️ <b>Maquete</b>: obras que a cidade precisa.</div>'
 +'<div class="btns"><button class="b gold" data-act="pfserv">📋 Protocolo</button><button class="b" data-act="pfcam">🏛️ Câmara</button><button class="b" data-act="pfobras">🏗️ Obras</button><button class="b gray" data-act="close">Obrigado</button></div>')}
ACT.pfserv=()=>prefServ();ACT.pfcam=()=>prefCamara();ACT.pfobras=()=>prefObras();
// merenda escolar: pedido da semana, paga 40% acima da caixa de venda
const MERQ={milho:[20,40],mandioca:[10,20],tomate:[12,24],trigo:[8,16],soja:[8,14],ovo:[30,60]};
function merenda(){S.pref=S.pref||{};const M=S.pref,w=Math.floor(S.day/7);if(M.w!==w){M.w=w;M.done=0;const pool=Object.keys(MERQ).filter(k=>ITEMS[k]&&(k==='ovo'?S.up&&S.up.coop:(CROPS[k]&&CROPS[k].lv<=LV()+1)));
  const a=pick(pool),rest=pool.filter(x=>x!==a),b=rest.length&&Math.random()<.7?pick(rest):null;M.ord=[a,b].filter(Boolean).map(k=>({k,n:ri(MERQ[k][0],MERQ[k][1]),got:0}))}return M}
function prefServ(){reModal=prefServ;const M=merenda(),left=7-S.day%7;
 let h='<h3>📋 Protocolo da Prefeitura</h3><div class="sec">🍎 MERENDA ESCOLAR</div><div class="card">A escola compra comida dos produtores da cidade. Paga <b>40% a mais</b> que a caixa de venda e dá reputação. Pedido novo toda semana (faltam '+left+' dia(s)).</div>';
 h+=M.ord.map((o,i)=>{const it=ITEMS[o.k],have=S.inv[o.k]||0,need=o.n-o.got,p=Math.round(itemPrice(o.k)*1.4*10)/10;return '<div class="card"><div class="row"><b>'+it.ic+' '+it.n+'</b><span class="gold">'+R$(p)+' cada</span></div><div class="dim">Entregue '+o.got+'/'+o.n+' · você tem '+have+'</div><div class="btns">'+(need<=0?'<span class="grn">✅ Completo</span>':have>0?'<button class="b gold" data-act="pfmer" data-v="'+i+'">Entregar '+Math.min(have,need)+' ('+R$(Math.min(have,need)*p)+')</button>':'<span class="dim">Colha e traga aqui</span>')+'</div></div>'}).join('');
 if(M.done)h+='<div class="card grn">✅ Pedido da semana entregue. A diretora mandou agradecer!</div>';
 h+='<div class="sec">🗳️ ELEIÇÕES MUNICIPAIS</div>'+prefPolHTML();
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
ACT.pfmer=function(e){const M=merenda(),o=M.ord[+e.v];if(!o)return;const have=S.inv[o.k]||0,n=Math.min(have,o.n-o.got);if(n<=0)return;const p=Math.round(itemPrice(o.k)*1.4*10)/10;
 takeItem(o.k,n);o.got+=n;cash(Math.round(n*p),'Merenda escolar: '+ITEMS[o.k].n);gainXP(n,'merenda');
 if(!M.done&&M.ord.every(x=>x.got>=x.n)){M.done=1;S.rep=Math.min(100,(S.rep||0)+2);gainXP(60,'merenda');toast('🍎 Pedido da merenda completo! As crianças agradecem. +2 reputação','good')}else toast('🍎 Entregue '+n+' '+ITEMS[o.k].n.toLowerCase()+' para a escola','good')};
function prefPolHTML(){const E=S.emp,P0=E&&E.pol,pf=souPrefeito();
 if(pf)return '<div class="card grn">🏛️ Você é o prefeito até o dia '+(P0.prefEnd%30+1)+'/'+MONTHS[Math.floor((P0.prefEnd%360)/30)].slice(0,3)+'. Salário de R$ 30 mil, ITR e licenças pela metade. Sua mesa fica no gabinete.</div>';
 if(P0&&P0.elec){const ch=elecChance();return '<div class="card">📅 Eleição em <b>'+(P0.elec-S.day)+' dia(s)</b> contra <b>'+P0.rival+'</b> · chance estimada '+Math.round(ch*100)+'%'+(P0.poll?'<div class="dim">📊 Pesquisa: você '+P0.poll.me+'% × '+P0.poll.rv+'% · indecisos '+P0.poll.nd+'%</div>':'')+'<div class="btns">'+(P0.camp<3?'<button class="b gold" data-act="epcamp">Reforçar campanha ('+R$s(1e6)+')</button>':'<span class="dim">Campanha no máximo</span>')+'</div></div>'}
 const ch=E?Math.round(elecChance()*100)+'%':'—';
 return '<div class="card">Quer ser prefeito? Precisa de <b>reputação 60+</b> e R$ 1,5 milhão para a campanha. O mandato dura 180 dias: salário de R$ 30 mil e impostos pela metade.<div class="dim">Sua chance hoje: '+ch+' (reputação, doações de obras, festa e time ajudam).</div><div class="btns">'+((S.rep||0)>=60?'<button class="b gold" data-act="epcand">Lançar candidatura ('+R$s(1.5e6)+')</button>':'<span class="red">Reputação '+Math.round(S.rep||0)+'/60</span>')+'</div></div>'}
// Câmara: um projeto por semana
const PROJ=[
 {t:'Asfaltar a estrada da zona rural até as fazendas',pop:.75,sim:{rep:2},nao:{rep:-1},d:'Os produtores querem; custa caro para a cidade.'},
 {t:'Taxa de iluminação de R$ 2.000 por fazenda',pop:.35,sim:{rep:1,money:-2000},nao:{rep:1},d:'Postes novos na vila, mas quem paga é o produtor.'},
 {t:'Feira do produtor aos sábados na praça',pop:.8,sim:{rep:2},nao:{rep:-1},d:'Mais movimento e venda direta para o povo.'},
 {t:'Patrulha rural da PM contra ladrões de gado (R$ 5.000 dos produtores)',pop:.6,sim:{rep:1,money:-5000,patrol:30},nao:{},d:'Se passar, ladrões aparecem bem menos por 30 dias.'},
 {t:'Reforma da ponte do rio',pop:.7,sim:{rep:1},nao:{rep:-1},d:'A ponte velha range quando passa caminhão.'},
 {t:'Festa junina municipal com quadrilha e fogueira',pop:.85,sim:{rep:1},nao:{rep:-2},d:'O povo adora. Ninguém quer ser contra.'},
 {t:'Proibir caminhão boiadeiro no centro da vila',pop:.45,sim:{rep:-1},nao:{rep:1},d:'Os moradores reclamam do barulho; os produtores, do desvio.'},
 {t:'Bolsa de estudos para filhos de peões',pop:.7,sim:{rep:2,money:-3000},nao:{rep:-1},d:'Os produtores ajudam com R$ 3.000 cada.'}];
function prefCamara(){reModal=prefCamara;S.pref=S.pref||{};const C=S.pref,w=Math.floor(S.day/7),p=PROJ[(w*5+3)%PROJ.length],voted=C.vw===w;
 let h='<h3>🏛️ Câmara Municipal</h3><div class="card dim">Vereadores: '+[CIV.v1,CIV.v2,CIV.v3,CIV.v4].map(v=>v.n.replace(/^Vereador(a)? /,'')).join(', ')+' e mais 5. Toda semana tem um projeto em votação, e os produtores podem falar na tribuna.</div>';
 h+='<div class="card"><b>📜 Projeto da semana</b><div>'+p.t+'</div><div class="dim">'+p.d+'</div></div>';
 if(voted)h+='<div class="card '+(C.res?'grn':'red')+'">'+(C.res?'✅ Aprovado':'❌ Rejeitado')+' por '+C.pl+'. Você foi '+(C.vs?'a favor':'contra')+'. Novo projeto na semana que vem.</div>';
 else h+='<div class="btns"><button class="b gold" data-act="pfvote" data-v="1">🙋 Discursar a favor</button><button class="b red" data-act="pfvote" data-v="0">✋ Discursar contra</button></div>';
 if(C.patrol>S.day)h+='<div class="card grn">🚓 Patrulha rural ativa até o dia '+(C.patrol%30+1)+'.</div>';
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Sair</button></div>')}
ACT.pfvote=function(e){S.pref=S.pref||{};const C=S.pref,w=Math.floor(S.day/7);if(C.vw===w)return;const p=PROJ[(w*5+3)%PROJ.length],sim=e.v==='1';
 const ch=clamp(p.pop+(sim?.18:-.18)+(souPrefeito()?(sim?.15:-.15):0),.05,.95),pass=Math.random()<ch,yes=pass?ri(5,8):ri(1,4);
 C.vw=w;C.vs=sim?1:0;C.res=pass?1:0;C.pl=yes+' a '+(9-yes);const ef=(sim?p.sim:p.nao)||{};
 if(ef.rep)S.rep=clamp((S.rep||0)+ef.rep,0,100);if(pass&&ef.money&&sim)cash(ef.money,'Câmara: '+p.t.slice(0,30));if(pass&&ef.patrol&&sim)C.patrol=S.day+ef.patrol;
 toast((pass?'✅ Aprovado ':'❌ Rejeitado ')+C.pl+'. '+(ef.rep?'Reputação '+(ef.rep>0?'+':'')+ef.rep:''),pass===sim?'good':'bad')};
if(typeof spawnThief==='function'){const _stPat=spawnThief;spawnThief=function(){if(S&&S.pref&&S.pref.patrol>S.day&&Math.random()<.65)return;return _stPat.apply(this,arguments)}}
function prefObras(){reModal=prefObras;let h='<h3>🏗️ Obras da cidade</h3><div class="card dim">A maquete mostra o que a vila precisa. Quem doa uma obra ganha reputação, a cidade cresce e o prédio leva o seu nome (fica no Bairro Novo, à beira da estrada).</div>';
 if(!empOn())h+='<div class="card">🔒 Com <b>R$ 1 milhão de patrimônio</b> você vira um grande produtor e pode doar obras para a cidade.</div>';
 else{const E=ensureEmp();h+=EDON.map(d=>{const o=E.vila.don[d.id],st=o?(S.day<o.d?'<span class="gold">🏗️ Em obra · pronta em '+(o.d-S.day)+' dia(s)</span>':'<span class="grn">✅ Inaugurada com seu nome</span>'):'<button class="b gold" data-act="evdon" data-v="'+d.id+'">Doar '+R$s(d.p)+'</button>';
  return '<div class="card"><div class="row"><b>'+d.ic+' '+d.n+'</b><span class="gold">'+R$s(d.p)+'</span></div><div class="dim">+'+d.rep+' reputação · +'+d.pop+' moradores · '+d.d+'</div><div class="btns">'+st+'</div></div>'}).join('')}
 showModal(h+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function prefBusto(){showModal('<h3>🗿 Coronel Bento Ferreira (1861–1934)</h3><div class="card">Fundou a Vila Boi de Ouro em 1898, com 40 cabeças de gado, um carro de boi e muita teimosia. Dizem que escolheu o lugar porque o boi dele, o Ouro, se recusou a atravessar o rio.<br><br><i>“Terra boa é a que o boi escolhe.”</i></div><div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
// mesa do gabinete: o Seu João atende; se você for prefeito, a mesa é sua
const DECR=[{t:'Mutirão de limpeza na vila',rep:1},{t:'Feriado municipal do Dia do Peão',rep:2,money:-20000},{t:'Reforço da patrulha rural por 30 dias',rep:1,patrol:30,money:-15000},{t:'Vacinação gratuita dos cães da cidade',rep:1,money:-8000}];
function prefJoao(){if(souPrefeito())return prefMesa();
 if(joaoIn()){npcModal('joao');const box=$('mbox'),b=[...box.children].filter(c=>c.classList&&c.classList.contains('btns')).pop();if(b){const d=document.createElement('div');d.innerHTML='<div class="sec">🗳️ ELEIÇÕES</div>'+prefPolHTML();b.before(d)}reModal=prefJoao;return}
 const h=S.t*24;showModal('<h3>🪑 Gabinete do Prefeito</h3><div class="card">A cadeira está vazia. Na mesa, um bilhete: <i>“Fui atender o povo. Expediente: 8h às 12h e 13h30 às 17h. — João”</i>'+(h>=17&&h<19.5?'<br><br>A esta hora ele costuma estar <b>na praça</b>.':'')+'</div><div class="sec">🗳️ ELEIÇÕES</div>'+prefPolHTML()+'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
function prefMesa(){reModal=prefMesa;S.pref=S.pref||{};const C=S.pref,w=Math.floor(S.day/7),done=C.dw===w;
 showModal('<h3>🏛️ Sua mesa de prefeito</h3><div class="card">'+(joaoIn()?'Seu João, agora seu vice, entra com uma pilha de papéis: “Bom dia, prefeito! Tem decreto para assinar.”':'Uma pilha de papéis espera a sua assinatura.')+'</div>'+prefPolHTML()
  +'<div class="sec">✍️ DECRETO DA SEMANA</div>'+(done?'<div class="card grn">Você já assinou o decreto desta semana.</div>':DECR.map((d,i)=>'<div class="card"><div class="row"><b>'+d.t+'</b><span class="gold">'+(d.money?R$s(-d.money):'grátis')+'</span></div><div class="dim">+'+d.rep+' reputação'+(d.patrol?' · ladrões aparecem bem menos':'')+'</div><div class="btns"><button class="b gold" data-act="pfdecr" data-v="'+i+'">Assinar</button></div></div>').join(''))
  +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
ACT.pfdecr=function(e){S.pref=S.pref||{};const C=S.pref,w=Math.floor(S.day/7),d=DECR[+e.v];if(!d||C.dw===w||!souPrefeito())return;if(d.money&&S.money<-d.money)return toast('Dinheiro insuficiente','bad');
 C.dw=w;if(d.money)cash(d.money,'Decreto: '+d.t);S.rep=clamp((S.rep||0)+d.rep,0,100);if(d.patrol)C.patrol=S.day+d.patrol;toast('✍️ Decreto assinado: '+d.t+'. +'+d.rep+' reputação','good')};
// ---------- jogo salvo dentro do salão antigo do banco: sai na porta
let civT=0;const _updCiv=update;update=function(dt){_updCiv(dt);civT-=dt;if(civT>0)return;civT=1;if(inRoom()&&!roomAt(P.x,P.y)&&typeof FADE!=='undefined'&&!FADE){const b=BLD.find(q=>q.id==='banco')||BLD[0];P.x=b.door*TS+8;P.y=(b.y+b.h)*TS+12;RET=null;camInit=0}};
// ---------- mapa: nome da prefeitura
const _mmCiv=mapModal;mapModal=function(){_mmCiv.apply(this,arguments);const cv=document.getElementById('wmapc');if(!cv)return;const g=cv.getContext('2d'),b=prefB(),s=4;if(!b)return;
 g.textAlign='center';g.font='bold 14px monospace';g.lineWidth=4;g.strokeStyle='rgba(0,0,0,.8)';const tx=(b.x+b.w/2)*s,ty=(b.y-1)*s;g.strokeText('PREFEITURA',tx,ty);g.fillStyle='#ffffff';g.fillText('PREFEITURA',tx,ty)};
// ---------- celular: Seu João avisa quando a prefeitura abre
if(typeof GUIDE!=='undefined')GUIDE.push({lv:2,ic:'🏛️',t:'Prefeitura',h:'Na avenida, a leste do frigorífico. Protocolo: merenda escolar (compra sua colheita 40% mais caro) e eleições. Câmara: um projeto por semana. Gabinete: o Seu João atende das 8h às 12h e das 13h30 às 17h. Maquete: obras que você pode doar.'});
