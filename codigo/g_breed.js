// ===== Raças nobres novas, guia das raças na loja e "linha de criação" (trabalhar com uma raça) =====
// pm = fator sobre a arroba (bonificação/ágio de raça); adult = peso adulto médio (kg)
Object.assign(BREEDS,{
 senepol:{n:'Senepol',tier:1,pm:1.2,adult:520,col:'#a63c1a',rep:8,d:'Taurino adaptado ao calor do Caribe: carne macia e não sofre no sol'},
 brangus:{n:'Brangus',tier:2,pm:1.28,adult:560,col:'#1c1c22',hump:1,rep:10,d:'Angus com zebu: carne marmorizada e rusticidade'},
 simental:{n:'Simental',tier:1,pm:1.1,adult:620,col:'#c8803a',face:'#f4efe2',rep:5,d:'Alemã, cresce rápido e pesa muito: bom para vender por arroba'},
 charoles:{n:'Charolês',tier:1,pm:1.08,adult:660,col:'#efe6cc',rep:5,d:'Francesa, a mais pesada de todas, mas sofre no calor e na seca'},
 gir:{n:'Gir Leiteiro',tier:1,pm:.92,adult:430,col:'#a8502a',hump:1,spot:'#e8d8c0',rep:4,d:'Zebu leiteiro brasileiro: leite no pasto, sem frescura e sem doença'},
 nelorepo:{n:'Nelore PO',tier:2,pm:1.05,adult:510,col:'#f1eee8',hump:1,rep:12,d:'Nelore puro de origem, com registro: genética de elite para touros e matrizes'}
});
Object.assign(CPAL,{
 senepol:{c:'#a63c1a',lt:'#c4552a',dk:'#7a2a10',cf:'#a63c1a',fc:'#a8401e',cm:'#3a1a10',hoof:'#2a1a12',ch:'#000',sw:'#2a1a12',ear:'flat',hump:0,dew:.3,horn:'none'},
 brangus:{c:'#1c1c22',lt:'#34343e',dk:'#101014',cf:'#1c1c22',fc:'#202026',cm:'#141418',hoof:'#0e0e10',ch:'#000',sw:'#0e0e10',ear:'long',hump:.55,dew:.8,horn:'none'},
 simental:{c:'#c8803a',lt:'#dc9a52',dk:'#9a5a22',cf:'#c8803a',fc:'#f4efe2',cm:'#f0c0b0',hoof:'#4a3a30',ch:'#ece2c8',sw:'#f4efe2',ear:'flat',hump:0,dew:.3,horn:'short',white:'#f4efe2',stocky:1},
 charoles:{c:'#efe6cc',lt:'#fbf6e6',dk:'#d2c6a2',cf:'#efe6cc',fc:'#f2eada',cm:'#e8c0b0',hoof:'#5a4a3a',ch:'#e8dcc0',sw:'#d8ccb0',ear:'flat',hump:0,dew:.4,horn:'short',stocky:1},
 gir:{c:'#a8502a',lt:'#c06a3e',dk:'#7a3418',cf:'#a8502a',fc:'#b05a30',cm:'#3a2018',hoof:'#2a1a12',ch:'#c8b898',sw:'#2a1a12',ear:'long',hump:1,dew:1.2,horn:'curl',spots:'#ecdcc4',dairy:1},
 nelorepo:{c:'#f2efe8',lt:'#ffffff',dk:'#cfcabe',cf:'#dcd7cc',cfB:'#a8a398',fc:'#f4f1ea',cm:'#2e2a28',hoof:'#262220',ch:'#d8ccb0',sw:'#262220',ear:'zebu',hump:1.25,dew:1.2,horn:'short',eye:'#2e2a28'}
});
Object.assign(MILK,{senepol:4,brangus:4,simental:7,charoles:4,gir:13,nelorepo:3});
// características de cada raça (gr: velocidade de engorda; rus: perda de peso na seca/fome (menor = mais rústica); sk: chance de doença)
const BTR={
 nelore:{f:'🐂 Rústica · arroba',gr:1,rus:.6,sk:.8,carne:2,peso:3},
 girolando:{f:'🥛 Leite',gr:.95,rus:.8,sk:1,carne:1,peso:2},
 brahman:{f:'☀️ Rústica · calor',gr:1.05,rus:.6,sk:.8,carne:2,peso:3},
 hereford:{f:'🥩 Corte',gr:1.05,rus:1.25,sk:1.2,carne:3,peso:3},
 angus:{f:'🥩 Carne premium',gr:1.1,rus:1.2,sk:1.15,carne:4,peso:4},
 wagyu:{f:'💎 Carne de luxo',gr:.85,rus:1.3,sk:1.2,carne:5,peso:3},
 senepol:{f:'🥩 Premium no calor',gr:1.05,rus:.75,sk:.85,carne:4,peso:3},
 brangus:{f:'🥩 Carne + rusticidade',gr:1.08,rus:.8,sk:.9,carne:4,peso:4},
 simental:{f:'⚖️ Peso · arroba',gr:1.2,rus:1.1,sk:1.05,carne:3,peso:5},
 charoles:{f:'⚖️ Peso máximo',gr:1.15,rus:1.3,sk:1.2,carne:3,peso:5},
 gir:{f:'🥛 Leite rústico',gr:.95,rus:.6,sk:.8,carne:1,peso:2},
 nelorepo:{f:'🧬 Genética · touros',gr:1,rus:.6,sk:.8,carne:2,peso:3,gen:78}
};
const BINFO={
 nelore:['A base do gado brasileiro (80% do rebanho). Aguenta calor, carrapato e seca.','Barata e segura. Vende bem por arroba, mas não ganha ágio de carne nobre.'],
 girolando:['Mestiça Gir × Holandês: a vaca de leite mais comum do Brasil.','Dá muito leite. O macho vale pouco para corte.'],
 brahman:['Zebu americano, mais pesado que o Nelore e muito resistente ao calor.','Ótima para cruzar e para quem tem pasto fraco.'],
 hereford:['Taurina inglesa de cara branca. Carne de qualidade.','Sofre no calor forte e pega mais carrapato.'],
 angus:['A carne premium mais famosa: marmoreio e maciez. Frigoríficos pagam ágio.','Precisa de pasto bom e sofre na seca.'],
 wagyu:['Japonesa, a carne mais cara do mundo. Cada boi vale uma fortuna.','Engorda devagar, é delicada e cara de comprar.'],
 senepol:['Taurina do Caribe adaptada ao calor: carne macia sem sofrer no sol, sem chifre.','Ótima escolha para carne nobre no clima do Centro-Oeste.'],
 brangus:['Cruzamento Angus × zebu: carne marmorizada com a rusticidade do zebu.','Equilibrada: vale mais que o Nelore e aguenta bem a seca.'],
 simental:['Alemã, cresce rápido e fica pesadona. Vende muito peso por cabeça.','Também dá um leite razoável. Precisa de pasto e ração.'],
 charoles:['Francesa, a raça mais pesada. Ocupa mais pasto, mas cada boi rende muitas arrobas.','Sofre no calor e na seca: perde peso rápido sem ração.'],
 gir:['Zebu leiteiro brasileiro. Dá leite no pasto, no calor, quase sem doença.','Dá menos leite que a Girolando, mas gasta menos e adoece pouco.'],
 nelorepo:['Nelore Puro de Origem, com registro na associação. Genética de elite.','Caro. Os bezerros nascem melhores e os touros rendem como reprodutores.']
};
// ---------- efeito das características no dia a dia
const _dtBr=dayTick;dayTick=function(){const W=new Map(S.herd.map(a=>[a.id,[a.w,a.sick]]));_dtBr();
 for(const a of S.herd){const p=W.get(a.id),T=BTR[a.breed];if(!p||!T)continue;const dw=a.w-p[0];
  if(dw>0)a.w=Math.min(wmax(a),p[0]+dw*T.gr);else if(dw<0)a.w=p[0]+dw*T.rus;
  if(a.sick&&!p[1]&&T.sk<1&&Math.random()<1-T.sk)a.sick=0;else if(!a.sick&&T.sk>1&&Math.random()<.002*(T.sk-1))a.sick=1}};
const _mkBr=mk;mk=function(br,sex,age,gen){const a=_mkBr(br,sex,age,gen);const T=BTR[a.breed];if(T&&T.gen&&a.gen<T.gen)a.gen=ri(T.gen,96);return a};
// ---------- linha de criação (associação da raça)
const lineBr=()=>S.line&&S.line.br;
const lineShare=()=>{const br=lineBr();if(!br||!S.herd.length)return 0;return S.herd.filter(a=>a.breed===br).length/S.herd.length};
const _voBr=valueOf;valueOf=function(a,m){let v=_voBr(a,m);if(m==='frig'&&lineBr()===a.breed&&S.line.d<=S.day){v*=1.06;if(lineShare()>=.8)v*=1.04}return v};
const BRW={nelore:30,girolando:10,brahman:8,hereford:6,angus:6,wagyu:2,senepol:6,brangus:6,simental:6,charoles:6,gir:6,nelorepo:4};
function pickBreed(){const br=lineBr(),ks=Object.keys(BRW),w=ks.map(k=>BRW[k]*(k===br?6:1)),t=w.reduce((a,b)=>a+b,0);let r=Math.random()*t;for(let i=0;i<ks.length;i++){r-=w[i];if(r<=0)return ks[i]}return 'nelore'}
const _nlBr=newListings;newListings=function(){_nlBr();
 for(let i=0;i<S.listings.length;i++){const x=S.listings[i],nb=pickBreed();if(nb!==x.a.breed){const a=mk(nb,x.a.sex,x.a.age,lotGen(BREEDS[nb].tier>=2));S.listings[i]={a,price:Math.round(valueOf(a,'mkt')*rnd(1.02,1.12)/10)*10}}}};
// ---------- guia das raças com desenho
const BIMG={};
function breedImg(br){if(BIMG[br])return BIMG[br];const c=mkCanvas(96,64),g=c.getContext('2d');const a={id:7,breed:br,sex:'M',age:900,w:BREEDS[br].adult*1.1,gen:80,hp:100,name:''};
 g.imageSmoothingEnabled=false;g.save();g.scale(2,2);try{drawCow(g,a,15,16,1,0)}catch(e){}g.restore();BIMG[br]=c.toDataURL();return BIMG[br]}
function brPrices(br){const s=(sex,age)=>{let t=0;for(let k=0;k<6;k++){const a=mk(br,sex,age,BTR[br]&&BTR[br].gen?85:60);t+=valueOf(a,'mkt')}return t/6};
 return{bez:s('M',240),nov:s('F',540),boi:(()=>{const a=mk(br,'M',720,60);a.w=wmax(a)*.95;return frigPrice(a)})(),tou:s('M',1100)*(br==='nelorepo'?2.4:1.6)}}
const dots=(n,c)=>'<span style="letter-spacing:1px;color:'+(c||'#e0a431')+'">'+'●'.repeat(n)+'<span style="opacity:.25">'+'●'.repeat(5-n)+'</span></span>';
function bScore(br){const T=BTR[br],B=BREEDS[br];return{carne:T.carne,peso:T.peso,cresc:clamp(Math.round((T.gr-.8)*12.5),1,5),rus:clamp(Math.round((1.4-T.rus)*5.5),1,5),leite:clamp(Math.round((MILK[br]||3)/3.2),1,5)}}
function breedCard(br,full){const B=BREEDS[br],T=BTR[br],I=BINFO[br]||['',''],sc=bScore(br),pr=brPrices(br),mine=lineBr()===br,lock=S.rep<B.rep;
 return '<div class="card"'+(mine?' style="border-color:#c8a040"':'')+'><div style="display:flex;gap:8px;align-items:center"><img src="'+breedImg(br)+'" style="width:88px;height:58px;image-rendering:pixelated;background:#7aa84a;border-radius:6px;flex:none"><div style="flex:1"><div class="row"><b>'+B.n+'</b><span class="gold" style="font-size:12px">'+T.f+'</span></div><div class="dim" style="font-size:12px">'+I[0]+'</div></div></div>'
 +(full?'<div class="dim" style="margin-top:4px;font-size:12px">'+I[1]+'</div>':'')
 +'<table style="width:100%;font-size:12px;margin-top:4px"><tr><td>🥩 Carne</td><td>'+dots(sc.carne)+'</td><td>⚖️ Peso</td><td>'+dots(sc.peso)+'</td></tr><tr><td>📈 Engorda</td><td>'+dots(sc.cresc)+'</td><td>🌵 Rústica</td><td>'+dots(sc.rus)+'</td></tr><tr><td>🥛 Leite</td><td>'+dots(sc.leite)+'</td><td>💰 Arroba</td><td class="gold">'+R$(arroba(br))+'</td></tr></table>'
 +'<div class="dim" style="font-size:12px;margin-top:3px">Preço hoje: bezerro '+R$(Math.round(pr.bez/100)*100)+' · novilha '+R$(Math.round(pr.nov/100)*100)+' · boi gordo '+R$(Math.round(pr.boi/100)*100)+' · touro '+R$(Math.round(pr.tou/500)*500)+'</div>'
 +(lock?'<div class="red" style="font-size:12px">Precisa de reputação '+B.rep+' para comprar no mercado</div>':'')
 +(full?(mine?'<div class="grn">✅ Esta é a sua linha de criação'+(S.line.d>S.day?' (registro sai em '+(S.line.d-S.day)+' dias)':'')+'</div>':'<div class="btns"><button class="b gold" data-act="brline" data-v="'+br+'">Trabalhar com esta raça</button></div>'):'')+'</div>'}
function breedGuide(){reModal=()=>breedGuide();const br=lineBr(),sh=Math.round(lineShare()*100);
 showModal('<h3>📘 Raças de gado</h3><div class="card dim">Cada raça é boa para uma coisa. Preços calculados com a arroba de hoje (R$ '+Math.round(BASE_ARROBA*mktEff())+').<br><b>Linha de criação:</b> escolha uma raça para trabalhar. Você entra na associação da raça e ganha <b>+6% no frigorífico</b> nos animais dela, <b>+4% extra</b> se 80% do rebanho for dela (lote padronizado), mais animais dela no mercado e <b>10% de desconto</b> com o importador.</div>'
 +(br?'<div class="card" style="border-color:#c8a040"><b>Sua linha: '+BREEDS[br].n+'</b><div class="dim">'+sh+'% do seu rebanho é '+BREEDS[br].n+(sh>=80?' · ✅ lote padronizado (+4%)':' · falta chegar a 80% para o bônus do lote padronizado')+'</div></div>':'')
 +'<div class="sec">CORTE</div>'+['nelore','brahman','senepol','brangus','angus','hereford','wagyu'].map(b=>breedCard(b,1)).join('')
 +'<div class="sec">PESO / ARROBA</div>'+['simental','charoles'].map(b=>breedCard(b,1)).join('')
 +'<div class="sec">LEITE</div>'+['girolando','gir'].map(b=>breedCard(b,1)).join('')
 +'<div class="sec">GENÉTICA</div>'+breedCard('nelorepo',1)
 +'<div class="btns"><button class="b gray" data-act="close">Fechar</button></div>')}
Object.assign(ACT,{
 brguide(){breedGuide()},
 brline(e){const br=String(e.v).replace('!','');if(!BREEDS[br])return;const fee=S.line?8000:3000;if(S.money<fee)return toast('Precisa de '+R$(fee)+' para a taxa da associação','bad');
  if(S.line&&!String(e.v).endsWith('!'))return showModal('<h3>Trocar de linha?</h3><div class="card">Você sai da associação da '+BREEDS[S.line.br].n+' e entra na da '+BREEDS[br].n+'. Taxa de '+R$(fee)+' e 7 dias para sair o registro.</div><div class="btns"><button class="b gold" data-act="brline" data-v="'+br+'!">Trocar</button><button class="b gray" data-act="brguide">Voltar</button></div>');
  cash(-fee,'Associação de criadores: '+BREEDS[br].n);S.line={br,d:S.day+7};gainXP(20,'raça');toast('📜 Você se inscreveu na Associação de Criadores de '+BREEDS[br].n+'. O registro sai em 7 dias.','good');breedGuide()}
});
// loja: guia no topo e etiqueta do foco de cada raça nos anúncios
const _pmBr=pMarket;pMarket=function(){let h=_pmBr();
 for(const k in BREEDS){const B=BREEDS[k],T=BTR[k];if(!T)continue;h=h.split('<b>'+B.n+' ').join('<b>'+B.n+' <span class="dim" style="font-size:11px">'+T.f+'</span> ')}
 return '<div class="card" style="border-color:#c8a040"><div class="row"><b>📘 Guia das raças</b><span class="dim">'+(lineBr()?'linha: '+BREEDS[lineBr()].n:'sem linha')+'</span></div><div class="dim">Veja para que cada raça é boa, preços de hoje, e escolha a sua linha de criação.</div><div class="btns"><button class="b gold" data-act="brguide">Abrir guia</button></div></div>'+h};
// ficha do animal mostra o foco e a linha
if(typeof GUIDE!=='undefined')GUIDE.push({lv:2,ic:'📘',t:'Raças e linha de criação',h:'No Mercado, abra o Guia das raças: cada raça é boa para uma coisa (carne, peso, leite, genética). Escolha uma linha de criação para ganhar bônus no frigorífico com a raça que você cria.'});
