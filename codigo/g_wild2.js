// ===== Biomas, novos animais, contratos de caça, recordes =====
const bioRect=b=>b==='m'?[101,YMIN+2,MW-4,39,5]:b==='p'?[101,42,MW-4,RZ-4,6]:b==='c'?pick([[XMIN+3,72,-1,RZ-4,4],[61,72,98,RZ-4,4],[0,166,98,RZ-4,4]]):[XMIN+3,YMIN+3,97,75,1];
// mais bicho para a terra nova: cada bioma cresce na mesma proporção da área onde o bicho pode aparecer
// (mesma densidade de antes em todo lugar). Medido: serra ×2,84, pantanal ×2,2, cerrado ×3,67, mata ×2,27
// bicho longe de você (fora da tela) é atualizado em turnos (1/4 por quadro) para o celular aguentar
let WLOD=0;const _swLod=stepWild;stepWild=function(dt){if(WILD.length<110||!P)return _swLod(dt);WLOD=(WLOD+1)&3;const far=[],keep=[];
 for(let i=0;i<WILD.length;i++){const a=WILD[i];if(Math.abs(a.x-P.x)+Math.abs(a.y-P.y)>1500&&((a.id||i)&3)!==WLOD)far.push(a);else keep.push(a)}
 if(!far.length)return _swLod(dt);WILD.length=0;for(const a of keep)WILD.push(a);try{_swLod(dt)}finally{for(const a of far)WILD.push(a)}};
const BIONAME={f:'Floresta',m:'Montanha nevada',p:'Pantanal',c:'Cerrado'};
const inTown=()=>{const tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS);return TOWNZ(tx,ty)||(tx<59&&ty>=35&&ty<=70)};
const WSZ={duck:9,capy:13,croc:24,wolf:14,bear:20,goat:14,coyote:12,pronghorn:15,whitedeer:16};
Object.values(SPECIES).forEach(s=>{if(!s.bio)s.bio='f'});
Object.assign(SPECIES,{
 duck:{n:'Pato selvagem',bio:'p',water:1,w:[.8,1.6],spd:40,flee:210,vis:170,hear:150,smell:20,vr:3,br:5,hp:9,price:30,season:[4,5,6,7,8],cnt:9,col:'#6a5a3a',sz:1,xp:6},
 capy:{n:'Capivara',bio:'p',water:1,w:[35,65],spd:26,flee:120,vis:130,hear:150,smell:140,vr:5,br:8,hp:60,price:7,season:null,cnt:5,col:'#8a6a4a',sz:1.3,xp:16},
 croc:{n:'Jacaré-do-pantanal',bio:'p',water:1,w:[90,220],spd:24,flee:90,vis:150,hear:120,smell:100,vr:6,br:9,hp:150,price:12,bounty:900,aggr:55,chg:62,dmg:28,season:null,cnt:3,col:'#3f5a34',sz:1.9,xp:70},
 wolf:{n:'Lobo-cinzento',bio:'m',w:[28,50],spd:44,flee:210,vis:210,hear:210,smell:300,vr:5,br:8,hp:65,price:18,bounty:700,aggr:150,chg:80,dmg:12,season:null,cnt:5,col:'#7a7e84',sz:1.3,xp:50},
 bear:{n:'Urso-pardo',bio:'m',w:[180,380],spd:32,flee:150,vis:120,hear:170,smell:320,vr:8,br:14,hp:230,price:14,bounty:1600,aggr:140,chg:78,dmg:35,season:[3,4,8,9,10],cnt:2,col:'#4a3224',sz:2.2,xp:130},
 goat:{n:'Cabra-montesa',bio:'m',w:[45,95],spd:40,flee:280,vis:270,hear:190,smell:210,vr:5,br:9,hp:60,price:42,season:[8,9,10],cnt:5,col:'#d8d4c8',sz:1.4,xp:55},
 coyote:{n:'Coiote',bio:'c',w:[9,17],spd:46,flee:240,vis:200,hear:210,smell:240,vr:4,br:6,hp:26,price:10,bounty:200,season:null,cnt:7,col:'#a8845a',sz:1.1,xp:16},
 pronghorn:{n:'Antílope-americano',bio:'c',w:[38,62],spd:52,flee:320,vis:250,hear:170,smell:200,vr:5,br:9,hp:52,price:24,season:[8,9,10],cnt:6,col:'#c8905a',sz:1.4,xp:30},
 whitedeer:{n:'Cervo albino (lendário)',bio:'f',w:[70,120],spd:40,flee:280,vis:230,hear:210,smell:300,vr:6,br:10,hp:85,price:60,bounty:6000,season:null,cnt:0,col:'#f4f4f4',sz:1.6,xp:250}
});
const WDRAW={
 wolf(r,a,c,dk,lt,leg){r(c,2,-8,9,4);r(lt,3,-4,7,1);r(c,10,-10,4,4);r(dk,13,-8,2,2);r(dk,11,-12,1,2);r(dk,13,-12,1,2);r(dk,0,-8,2,2);r(dk,1,-6,2,1);[3,5,8,10].forEach((dx,i)=>leg(dx,3,i));r(a.st==='charge'?'#f33':'#fc3',12,-9,1,1)},
 coyote(r,a,c,dk,lt,leg){r(c,2,-6,8,3);r(lt,3,-3,6,1);r(c,9,-8,3,3);r(dk,11,-7,2,1);r(dk,9,-10,1,2);r(dk,11,-10,1,2);r(lt,0,-6,2,3);[3,5,8,9].forEach((dx,i)=>leg(dx,3,i))},
 bear(r,a,c,dk,lt,leg){r(c,2,-13,14,8);r(shade(c,-18),4,-15,6,3);r(c,15,-13,5,5);r(lt,19,-10,2,2);r(dk,16,-15,2,2);r('#111',20,-11,1,1);r(dk,3,-5,2,5);r(dk,7,-5,2,5);r(dk,12,-5,2,5);r(dk,15,-5,2,5);r(a.st==='charge'?'#f33':'#222',18,-12,1,1)},
 goat(r,a,c,dk,lt,leg){r(c,2,-8,8,4);r(lt,3,-4,6,1);r(c,9,-12,3,5);r(lt,11,-10,2,2);r('#6a5a3a',9,-15,1,3);r('#6a5a3a',8,-16,1,1);r('#fff',12,-8,1,2);[3,5,8,9].forEach((dx,i)=>leg(dx,4,i))},
 pronghorn(r,a,c,dk,lt,leg){r(c,2,-10,9,4);r('#fff',3,-6,7,1);r(c,10,-14,2,6);r(c,11,-15,4,3);r('#222',11,-18,1,3);r('#fff',1,-10,2,3);[3,5,9,10].forEach((dx,i)=>leg(dx,5,i))},
 duck(r,a,c,dk,lt,leg,mv){const f=a.st==='flee'?-9:0;r(c,1,-4+f,6,3);r('#2f6a3a',6,-7+f,2,3);r('#e8b830',8,-6+f,2,1);r(dk,2,-4+f-(mv?2:0),3,2);if(!f)r('#e08a30',3,-1,1,1)},
 capy(r,a,c,dk,lt,leg){r(c,1,-8,10,5);r(shade(c,-12),10,-9,4,4);r(dk,13,-7,1,1);r(dk,11,-10,1,1);[2,4,8,10].forEach((dx,i)=>leg(dx,3,i))},
 croc(r,a,c,dk,lt,leg){r(c,2,-4,18,3);r(dk,4,-5,14,1);r(c,19,-4,6,2);r(dk,19,-5,3,1);r(c,-4,-3,6,2);r(dk,5,-2,2,2);r(dk,14,-2,2,2);r('#fff',23,-2,1,1);r(a.st==='charge'?'#f33':'#fc3',20,-5,1,1)}
};
// novos prédios
BLD.push({id:'posto',x:111,y:35,w:6,h:4,door:113,roof:'#3a2a1a',wall:'#7a5230',label:'Posto do Caçador (vender caça)',sign:'POSTO',log:1});
BLD.push({id:'pescador',x:140,y:66,w:6,h:4,door:142,roof:'#2f6a7a',wall:'#d8d0b0',label:'Casa do Pescador',sign:'PESCA'});
const _eb=enterBld;
enterBld=function(id){if(id==='posto'){lodgeModal('sell');return}if(id==='pescador'){fishShop();return}_eb(id)};
// ---- contratos e recordes
const hx=()=>{const H=S.h;if(!H.ct)H.ct=[];if(!H.rec)H.rec={};if(!H.ctDone)H.ctDone=0;return H};
function genHuntCt(){
 const H=hx();H.ct=H.ct.filter(c=>c.exp>S.day);
 const pool=Object.keys(SPECIES).filter(k=>k!=='whitedeer');
 while(H.ct.length<3){
  const k=pick(pool),sp=SPECIES[k],small=sp.w[1]<12||k==='turkey',n=small?ri(2,5):(sp.w[0]>150?1:ri(1,2));
  const unit=(sp.w[0]+sp.w[1])/2*.72*sp.price+(sp.bounty||0);
  H.ct.push({id:++S.nid+'c',sp:k,n,got:0,reward:Math.round(n*unit*rnd(1.5,2.1)/10)*10,exp:S.day+ri(12,24)});
 }
}
const _fpk=finishPick;
finishPick=function(){
 const a=AIM.pick&&AIM.pick.a;const kg=a?Math.round(a.kg*.72*10)/10:0;_fpk();if(!a)return;
 const H=hx(),r=H.rec[a.sp]||(H.rec[a.sp]={kg:0,pts:0});
 if(kg>r.kg){if(r.kg>0)toast('🏆 Novo recorde de '+SPECIES[a.sp].n+': '+kg+' kg!','good');r.kg=kg}
 if(a.pts>r.pts)r.pts=a.pts;
 if(a.sp==='whitedeer'){gainXP(150,'lenda');S.rep=Math.min(100,S.rep+3);toast('🦌✨ LENDA! Você abateu o cervo albino. A vila inteira comenta.','good')}
 H.ct.forEach(c=>{if(c.sp===a.sp&&c.got<c.n){c.got++;if(c.got>=c.n){cash(c.reward,'Contrato de caça');gainXP(c.reward/60,'contrato');H.ctDone++;toast('📜 Contrato cumprido! +'+R$(c.reward),'good')}}});
 H.ct=H.ct.filter(c=>c.got<c.n);
};
const _hd1=hookDay;
hookDay=function(){
 _hd1();const H=hx();genHuntCt();
 if(!WILD.some(w=>w.sp==='whitedeer')&&Math.random()<.04){if(spawnWild('whitedeer',0))toast('🦌 Moradores comentam que viram um cervo branco na mata...')}
};
function huntExtra(){
 const H=hx();let h='<div class="sec">CONTRATOS DA LOJA</div>';
 h+=H.ct.length?H.ct.map(c=>'<div class="card"><div class="row"><b>'+SPECIES[c.sp].n+' ×'+c.n+'</b><span class="gold">'+R$(c.reward)+'</span></div><div class="dim">Progresso '+c.got+'/'+c.n+' · bioma: '+BIONAME[SPECIES[c.sp].bio]+' · '+Math.max(0,c.exp-S.day)+' dias</div></div>').join(''):'<div class="dim">Novos contratos amanhã.</div>';
 h+='<div class="dim">Contratos pagam ao coletar a carcaça (precisa de licença; respeite a temporada).</div>';
 h+='<div class="sec">LIVRO DE CAÇA</div>'+Object.keys(SPECIES).map(k=>{const s=SPECIES[k],n=S.h.kills[k]||0,r=H.rec[k];
  return '<div class="card"><div class="row"><b>'+(n?s.n:'???')+'</b><span class="dim">'+BIONAME[s.bio]+'</span></div><div class="dim">'+(n?('Abates '+n+(r?' · recorde '+r.kg+' kg'+(r.pts>=8?' · '+r.pts+' pontas':''):'')):'Ainda não caçado')+(s.aggr&&n?' · ⚠️ perigoso':'')+'</div></div>'}).join('');
 return h+'<div class="dim" style="margin-top:6px">⚠️ Lobos, ursos e jacarés atacam quando se sentem ameaçados. Leve um rifle potente e cuidado com o vento.</div>';
}
const _pHunt=pHunt;
pHunt=function(){return _pHunt()+huntExtra()};
