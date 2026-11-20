// ===== Tutorial atualizado, guia e dicas de desbloqueio =====
TUT.push(
 {t:'Na praça da vila há um 📋 Quadro de Avisos: pedidos diários e semanais que pagam bem, e a agenda de eventos. Vá até ele.',done:()=>S.tf.mural,tgt:()=>({x:BOARD.x,y:BOARD.y}),rw:[400,30]},
 {t:'Sua vida ❤️ fica no canto. Bichos, cobras e quedas machucam. Compre um 🥖 pão com Dona Lourdes (padaria) — ele vai para a barra rápida (teclas 1–6).',done:()=>S.tf.bread||hasItem('pao',1),tgt:()=>{const n=npcById('lourdes');return{x:n.x,y:n.y}},rw:[200,20]},
 {t:'Seu cão te segue. Toque no nome dele no canto direito para ver vida, idade e ferimentos.',done:()=>S.tf.dogm,tgt:null,rw:[200,20]},
 {t:'Abra o MENU › 🏆 Região: veja seu título, o ranking contra os outros fazendeiros, a agenda e as conquistas.',done:()=>S.tf.reg,tgt:null,rw:[300,30]},
 {t:'Meta da sua vida: suba de Sitiante a Barão do Agro e chegue ao 1º lugar da região. Explore, cumpra pedidos e procure os 🗝️ segredos escondidos no mapa. Boa sorte!',done:()=>S.tf.final,tgt:null,rw:[500,40],tap:1}
);
const _rtb=renderTutBox;
renderTutBox=function(){_rtb();const s=TUT[S.tut];if(s&&s.tap){const el=$('tut');el.insertAdjacentHTML('beforeend','<div class="btns"><button class="b gold" data-act="tutok">Entendi!</button></div>')}};
ACT.tutok=function(){S.tf.final=1};
ACT.tutskip=function(){S.tut=TUT.length;renderTutBox();hideModal();toast('Tutorial pulado. Reveja no 📖 Guia.')};
const _dm=dogModal;dogModal=function(id){S.tf.dogm=1;_dm(id)};
const _bu=ACT.buyuse;ACT.buyuse=function(e){_bu(e);if(e.v==='pao')S.tf.bread=1};
// ---- guia
const GUIDE=[
 {lv:1,ic:'🎯',t:'O objetivo',h:'Você começa como <b>Sitiante</b>, com pouco dinheiro e um cão. A meta é virar <b>Barão do Agro</b> e ser o <b>1º do ranking</b> da região contra 9 fazendeiros que também crescem. Patrimônio = dinheiro + gado + terras + investimentos − dívidas. Cada título dá prêmio e muda a placa da sua porteira.'},
 {lv:1,ic:'🎮',t:'Controles',h:'<b>Computador:</b> WASD anda · Shift corre · E interage · C agacha · Q/botão direito mira · clique/Espaço atira · R recarrega · B binóculo · F faca · 1–6 barra rápida · Z junto/fica (cães) · X PEGAR · V rastrear · G cavalo · T parceiro(a) · M/Esc menu.<br><b>Celular:</b> joystick à esquerda e botões à direita. ✋ = agir.'},
 {lv:1,ic:'🐄',t:'Gado',h:'Mantenha o cocho cheio e o pasto bom. Animais engordam e valem mais quando estão <b>prontos</b> (peso de abate). Venda no frigorífico (curral) ou no leilão semanal. Fêmeas dão cria; genética ★ alta vale muito mais. Doentes: trate na Dra. Marina.'},
 {lv:1,ic:'🌽',t:'Lavoura e galinhas',h:'Plante, regue todo dia (chuva rega) e colha quando brilhar. Venda na caixa ao lado da casa. Galinheiro dá ovos todo dia.'},
 {lv:1,ic:'📋',t:'Quadro de Avisos',h:'Na praça. 3 pedidos por dia e 2 por semana: entregar itens, caçar, pescar, vender gado, arrematar lotes. Mostra os eventos do dia.'},
 {lv:1,ic:'📅',t:'Eventos do mês',h:'Dia 7: 🎣 Torneio de Pesca (vale o maior peixe do dia). Dia 15: 🎪 Feira (+12% nos preços). Dia 25: 🤠 Rodeio (no Quadro de Avisos). Leilão toda semana e ELITE a cada 28 dias. Exposição a cada 90 dias. Ranking toda semana com prêmio para o top 5.'},
 {lv:1,ic:'❤️',t:'Vida e barra rápida',h:'Você leva dano de animais, cobras (veneno ☠️ — use soro 💉) e quedas no rodeio. Cure com kit 🩹, pão 🥖 ou marmita 🍱. Teclas 1–6 usam a barra rápida.'},
 {lv:1,ic:'🐕',t:'Cães',h:'Cada cão tem idade, vida, força de agarre e faro. Leve até 2 de escolta além do ativo. <b>PEGAR (X)</b>: soltam atrás da caça; se a barra ficar <b class="grn">verde</b>, chegue perto e aperte <b>F</b> para sangrar com a faca. Feridas sangram e podem infeccionar: faça curativo. Coleira de espinhos fere quem morde seu cão. Coleira GPS mostra onde ele está.'},
 {lv:2,ic:'🏹',t:'Caça',h:'Precisa de licença (Loja do Caçador). Respeite o vento e a camuflagem, mire nos pontos vitais e siga o rastro de sangue. Cada bioma tem seus bichos: floresta, montanha nevada (leste), pantanal (sudeste) e cerrado (sul). Lobo, urso, jacaré e javali atacam!'},
 {lv:2,ic:'🎣',t:'Pesca',h:'Chegue na beira de qualquer água e aperte E. Puxe na fisgada e pare o marcador na zona verde. Varas melhores na Casa do Pescador (Pantanal). Madrugada e entardecer dão peixes raros.'},
 {lv:3,ic:'💕',t:'Parceiro(a)',h:'Na sua casa, convide Lia ou Rafa para morar com você. Tecla T para dar ordens: cuidar do gado, lavoura, galinhas, te acompanhar na caça ou vigiar à noite.'},
 {lv:4,ic:'📈',t:'Bolsa de Valores',h:'Ações de frigorífico, fazendas, banco, cripto e Tesouro Selic. Notícias mexem nos preços; alguns pagam dividendos todo mês. Corretagem 0,3% e IR de 15% sobre o lucro.'},
 {lv:4,ic:'🗝️',t:'Segredos',h:'Seis armas históricas de atiradores e caçadores famosos estão escondidas: numa cabana, numa árvore oca, numa caverna, num acampamento, num barco afundado e em ruínas do sertão. Pistas vêm da pesca, da caça, dos contratos e de amigos da vila. Uma pá (Seu Zé) cava onde a terra foi mexida; o detector de metais acha tesouros enterrados.'},
 {lv:5,ic:'🐴',t:'Cavalo',h:'Compre com Seu Tião. Tecla G (ou 🐴) monta e desmonta. Muito mais rápido, mas barulhento para a caça.'},
 {lv:6,ic:'📜',t:'Contratos',h:'Contratos de exportação pagam bônus por gado pronto. Contratos de caça (Loja do Caçador) pagam ao coletar a carcaça.'},
 {lv:7,ic:'🐂',t:'Reprodutores',h:'Touros de alto valor rendem dinheiro como reprodutores de vez em quando.'}
];
function pGuia(){S.tf.reg=S.tf.reg||0;const dl=S.dayLen||DAYDEF;return '<div class="card"><b>⏱️ Duração do dia</b><div class="dim">Quanto tempo real dura um dia no jogo (velocidade ▶). Os botões ⏩ continuam acelerando quando você quiser.</div><div class="btns">'+[2,4,8,12].map(m=>'<button class="b '+(dl===m*60?'gold':'')+'" data-act="daylen" data-v="'+m+'">'+m+' min</button>').join('')+'</div></div><div class="card"><b>📖 Guia do fazendeiro</b><div class="dim">Tudo que o jogo tem, liberado conforme seu nível.</div></div>'
 +GUIDE.map(g=>LV()>=g.lv?'<div class="card"><b>'+g.ic+' '+g.t+'</b><div style="font-size:17px">'+g.h+'</div></div>':'<div class="card lock"><b>🔒 '+g.t+'</b><div class="dim">Libera no nível '+g.lv+'</div></div>').join('')}
// dicas quando um recurso é liberado
let lvT=0;
const _updG=update;update=function(dt){_updG(dt);lvT+=dt;if(lvT<1.5)return;lvT=0;if(S.lvSeen===undefined)S.lvSeen=LV();
 if(LV()>S.lvSeen&&!modalOpen){const news=GUIDE.filter(g=>g.lv>S.lvSeen&&g.lv<=LV());S.lvSeen=LV();
  if(news.length)showModal('<h3>⭐ Nível '+LV()+'! Novidades</h3>'+news.map(g=>'<div class="card"><b>'+g.ic+' '+g.t+'</b><div style="font-size:17px">'+g.h+'</div></div>').join('')+'<div class="btns"><button class="b gold" data-act="close">Bora!</button></div>')}};
const _pRegT=pReg;pReg=function(){S.tf.reg=1;return _pRegT()};

const DAYDEF=240;function dayMs(){return (S&&S.dayLen||DAYDEF)*1000}
ACT.daylen=function(e){S.dayLen=+e.v*60;toast('⏱️ Agora cada dia dura '+e.v+' minutos','good')};
