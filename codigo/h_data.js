const WEAPONS={
 r22:{n:'Rifle .22 LR',p:1200,ammo:'a22',cap:10,rel:.7,range:260,pellets:1,spread:0,power:16,noise:200,stab:.8,speed:1100,d:'Caça miúda: coelho e peru. Silencioso.'},
 shot12:{n:'Espingarda calibre 12',p:1800,ammo:'cart12',cap:2,rel:1.1,range:170,pellets:8,spread:.07,power:30,noise:380,stab:1,speed:1400,d:'Curta distância, dispersão de chumbo.'},
 bow:{n:'Arco composto',p:3200,ammo:'arrow',cap:1,rel:1.4,range:210,pellets:1,spread:0,power:50,noise:40,stab:1.1,speed:520,d:'Quase silencioso, voo lento: exige antecipar o alvo.'},
 r308:{n:'Rifle .308 Winchester',p:4500,ammo:'a308',cap:5,rel:1.1,range:480,pellets:1,spread:0,power:62,noise:520,stab:.85,speed:2500,d:'Veado e javali a média distância.'},
 r3006:{n:'Rifle .30-06 com luneta',p:7500,ammo:'a3006',cap:5,rel:1.1,range:640,pellets:1,spread:0,power:78,noise:560,stab:.55,speed:2800,d:'Luneta: mira bem mais firme à distância.'},
 mag300:{n:'Rifle .300 Magnum',p:14000,ammo:'a300',cap:3,rel:1.5,range:720,pellets:1,spread:0,power:115,noise:640,stab:.5,speed:3000,d:'Para o alce. Coice forte.'}
};
const AMMO={a22:{n:'.22 LR (50)',p:60,q:50},cart12:{n:'Cartuchos 12 (10)',p:90,q:10},arrow:{n:'Flechas (6)',p:140,q:6},a308:{n:'.308 Win (10)',p:180,q:10},a3006:{n:'.30-06 (10)',p:210,q:10},a300:{n:'.300 Mag (5)',p:260,q:5}};
const OUTFITS={
 casual:{n:'Roupa comum',camo:0,p:0,c:['#3a5aa0','#c9a36f','#5a4a3a'],d:'Aparece a quilômetros.'},
 wood:{n:'Camuflagem Woodland',camo:.35,p:1200,c:['#4d6b3a','#2f4a28','#6b5a32'],d:'Padrão de mata: bom na floresta.'},
 full:{n:'Camuflagem completa + máscara',camo:.55,p:2800,c:['#3d5a30','#1f3a1c','#7a6a3a'],d:'Cobre rosto e mãos.'},
 ghillie:{n:'Traje Ghillie',camo:.8,p:5200,c:['#4a5a2a','#2a3a18','#7a7a3a'],d:'O melhor disfarce. Vira parte do mato.'}
};
const GEAR={
 boots:{n:'Botas silenciosas',p:1500,d:'Passos 25% mais silenciosos.'},
 binoc:{n:'Binóculo (tecla B)',p:900,d:'Enxerga animais e distâncias bem mais longe.'},
 pack:{n:'Mochila reforçada',p:1400,d:'Carrega peso sem perder velocidade.'}
};
const CONS={scent:{n:'Neutralizador de odor',p:80,d:'Reduz o cheiro pelo resto do dia.'},lure:{n:'Atrativo de cervídeo',p:120,d:'Atrai veados por um tempo.'},call:{n:'Chamariz de peru',p:150,d:'Atrai perus selvagens.'}};
const SPECIES={
 rabbit:{n:'Coelho',w:[1.5,2.6],spd:42,flee:150,vis:140,hear:120,smell:90,vr:3,br:5,hp:12,price:22,season:null,cnt:9,col:'#a89880',sz:1,xp:4},
 turkey:{n:'Peru selvagem',w:[5,10],spd:34,flee:130,vis:190,hear:140,smell:30,vr:4,br:7,hp:26,price:32,season:[2,3,9,10],cnt:5,col:'#4a3426',sz:1.2,xp:10},
 deer:{n:'Veado-de-cauda-branca',w:[45,110],spd:36,flee:230,vis:200,hear:180,smell:250,vr:6,br:10,hp:70,price:16,season:[9,10,11,0],cnt:7,col:'#9a6a3c',sz:1.6,xp:30},
 boar:{n:'Javali',w:[45,120],spd:34,flee:150,vis:110,hear:160,smell:240,vr:6,br:10,hp:95,price:9,bounty:250,season:null,cnt:5,col:'#3a2e2a',sz:1.5,xp:22},
 elk:{n:'Alce',w:[200,380],spd:36,flee:200,vis:220,hear:200,smell:280,vr:8,br:14,hp:170,price:24,season:[9,10],cnt:1,col:'#7a5230',sz:2.2,xp:90}
};
