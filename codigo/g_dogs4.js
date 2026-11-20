// ===== Cães: morte de verdade (sangramento sem curativo e brigas da escolta) e troca de cachorro no canil do Seu Tião
// ---------- sangramento: com 1 de vida e ainda sangrando, o cão morre em poucos segundos se ninguém fizer curativo
const _bleedD4=bleedDog;bleedDog=function(d,r,dt){if(d.dead)return;_bleedD4(d,r,dt);if(d.dead)return;
 const bleeding=d.venom>0||d.wounds.some(w=>!w.band&&w.bt>0);
 if(bleeding&&d.hp<=1.05){r.bleedOut=(r.bleedOut||0)+dt;
  if(r.bleedOut<dt*1.5)toast('🩸 '+d.name+' está morrendo! Faça um curativo (🩹) AGORA!','bad');
  if(r.bleedOut>=9){dogDie(d,d.venom>0?'veneno de cobra, sem soro a tempo':'sangrou até a morte, sem curativo');return}}
 else r.bleedOut=0};
// ---------- valor do cão (o Seu Tião paga 60% do que ele vale hoje)
function dogValue(d){const D=DOGS[d.breed];if(!D)return 0;const base=D.p||250,life=D.life*360,age=d.age||0;
 let f=age<180?.55:age<300?.8:age>life*.75?Math.max(.25,1-(age-life*.75)/(life*.25)*.75):1;
 f*=.6+.4*clamp(d.hp/dogMax(d),0,1);if(d.wounds&&d.wounds.some(w=>w.inf))f*=.8;
 const eq=(DARM[d.arm||0].p+COLL[d.col||0].p+(d.gps?1600:0))*.5;
 return Math.round((base*f+eq)*.6/10)*10}
const dogAgeTxt=d=>typeof ageTxtD==='function'?ageTxtD(d):Math.floor((d.age||0)/360)+' anos';
function dogLeave(d,why){releaseDog(d);S.dogs=S.dogs.filter(x=>x!==d);DR.delete(d.id);if(S.dogAct===d.id)S.dogAct=S.dogs[0]?S.dogs[0].id:null;
 S.tiao=S.tiao||[];S.tiao.unshift({d:Object.assign({},d,{esc:0}),v:dogValue(d),day:S.day});if(S.tiao.length>4)S.tiao.length=4}
// ---------- loja do canil: seus cães (vender/trocar) e os que o Seu Tião recebeu
const _dsm4=dogShopModal;dogShopModal=function(){_dsm4();reModal=dogShopModal;const box=$('mbox');if(!box)return;const h3=box.querySelector('h3');if(!h3)return;
 let h='<div class="sec">🔁 SEUS CÃES: VENDER OU TROCAR</div><div class="dim">O Seu Tião fica com o seu cão e paga 60% do que ele vale (idade, saúde e equipamento contam). Assim abre vaga para um melhor. Se você comprar com o canil cheio, ele aceita o seu como parte do pagamento.</div>';
 h+=S.dogs.length?S.dogs.map(d=>{const v=dogValue(d);return '<div class="card"><div class="row"><b>'+d.name+' <span class="dim">'+DOGS[d.breed].n+' · '+dogAgeTxt(d)+'</span></b><span class="gold">'+(v?R$(v):'sem valor')+'</span></div><div class="dim">Vida '+Math.round(d.hp)+'/'+dogMax(d)+(d.id===S.dogAct?' · seu companheiro':'')+'</div><div class="btns"><button class="b" data-act="dogsell" data-v="'+d.id+'">🤝 Deixar com o Seu Tião'+(v?' por '+R$(v):'')+'</button></div></div>'}).join(''):'<div class="card dim">Você não tem cães agora.</div>';
 if(S.tiao&&S.tiao.length)h+='<div class="sec">🐾 RECEBIDOS PELO SEU TIÃO</div>'+S.tiao.map((t,i)=>'<div class="card"><div class="row"><b>'+t.d.name+' <span class="dim">'+DOGS[t.d.breed].n+'</span></b><span class="gold">'+R$(Math.round(t.v*1.25))+'</span></div><div class="dim">Ainda está aqui no canil. Dá para levar de volta.</div><div class="btns"><button class="b gold" data-act="dogback" data-v="'+i+'">🏠 Levar de volta</button></div></div>').join('');
 const div=document.createElement('div');div.innerHTML=h;h3.after(div)};
ACT.dogsell=function(e){const d=dogById(e.v);if(!d)return;const v=dogValue(d);
 reModal=null;
 showModal('<h3>🤝 Deixar '+d.name+'?</h3><div class="card">'+d.name+' ('+DOGS[d.breed].n+', '+dogAgeTxt(d)+') vai ficar com o Seu Tião'+(v?' e você recebe <b class="gold">'+R$(v)+'</b>':'')+'. Os equipamentos vão junto.<br><span class="dim">Depois dá para levar de volta pagando um pouco mais, enquanto ele ainda estiver no canil.</span></div><div class="btns"><button class="b gold" data-act="dogsellok" data-v="'+d.id+'">Sim, deixar</button><button class="b gray" data-act="dogshop">Voltar</button></div>')};
ACT.dogsellok=function(e){const d=dogById(e.v);if(!d)return;const v=dogValue(d);dogLeave(d);if(v)cash(v,'Cão vendido ao canil: '+d.name);toast('🐕 '+d.name+' ficou com o Seu Tião'+(v?' (+'+R$(v)+')':'')+'. Ele vai ser bem cuidado.','good');dogShopModal()};
ACT.dogback=function(e){const t=S.tiao&&S.tiao[+e.v];if(!t)return;if(S.dogs.length>=kennelCap())return toast('Canil da fazenda cheio. Deixe um cão aqui ou amplie na Casa Agro.','bad');const p=Math.round(t.v*1.25);if(S.money<p)return toast('Dinheiro insuficiente','bad');
 cash(-p,'Cão de volta: '+t.d.name);S.tiao.splice(+e.v,1);const d=t.d;d.dead=0;S.dogs.push(d);if(!S.dogAct)S.dogAct=d.id;toast('🐕 '+d.name+' voltou para casa abanando o rabo!','good');dogShopModal()};
// compra com canil cheio: oferece a troca
const _dbuy4=ACT.dogbuy;ACT.dogbuy=function(e){const[k,pup]=String(e.v).split(':'),D=DOGS[k];if(!D||D.lv>LV())return;
 if(S.dogs.length<kennelCap()||!S.dogs.length)return _dbuy4(e);const p=pup?Math.round(D.p*.55):D.p;
 reModal=null;
 showModal('<h3>🔁 Canil cheio: trocar?</h3><div class="card">Sua fazenda tem vaga para '+kennelCap()+' cão(es). Deixe um com o Seu Tião como parte do pagamento do <b>'+D.n+(pup?' (filhote)':'')+'</b> ('+R$(p)+'):</div>'
  +S.dogs.map(d=>{const v=dogValue(d),pay=Math.max(0,p-v);return '<div class="card"><div class="row"><b>'+d.name+' <span class="dim">'+DOGS[d.breed].n+' · '+dogAgeTxt(d)+'</span></b><span class="gold">vale '+R$(v)+'</span></div><div class="btns"><button class="b gold" data-act="dogtrade" data-v="'+e.v+'|'+d.id+'">Trocar e pagar '+R$(pay)+(v>p?' (sobra '+R$(v-p)+')':'')+'</button></div></div>'}).join('')
  +'<div class="dim">Para ter mais vagas, amplie o canil na Casa Agro.</div><div class="btns"><button class="b gray" data-act="dogshop">Voltar</button></div>')};
ACT.dogtrade=function(e){const[bk,id]=String(e.v).split('|'),[k,pup]=bk.split(':'),D=DOGS[k],d=dogById(id);if(!D||!d)return;const p=pup?Math.round(D.p*.55):D.p,v=dogValue(d),pay=p-v;
 if(pay>0&&S.money<pay)return toast('Dinheiro insuficiente','bad');const old=d.name;dogLeave(d);if(pay>0)cash(-pay,'Troca de cão: '+old+' + dinheiro');else if(pay<0)cash(-pay,'Troca de cão: troco do Seu Tião');
 const sex=Math.random()<.5?'M':'F',nm=pick(sex==='M'?NAMES_M:NAMES_F),nd={id:Date.now()%1e7+S.dogs.length+7,breed:k,name:nm,sex,age:pup?ri(70,110):ri(420,800),wounds:[],col:0,arm:0};nd.hp=dogMax(nd);S.dogs.push(nd);
 if(!S.dogAct||!dogById(S.dogAct))S.dogAct=nd.id;hideModal();toast('🔁 '+old+' ficou com o Seu Tião. '+nm+' ('+D.n+(pup?', filhote':'')+') é o seu novo cão!','good')};
ACT.dogshop=function(){dogShopModal()};
// memorial também lembra quem foi trocado
const _km4=kennelModal;kennelModal=function(){_km4();if(!S.tiao||!S.tiao.length)return;const box=$('mbox'),b=[...box.children].filter(c=>c.classList&&c.classList.contains('btns')).pop();if(!b)return;
 const div=document.createElement('div');div.innerHTML='<div class="sec">🤝 COM O SEU TIÃO</div>'+S.tiao.map(t=>'<div class="card dim">'+t.d.name+' · '+DOGS[t.d.breed].n+' — está no canil da vila</div>').join('');b.before(div)};
