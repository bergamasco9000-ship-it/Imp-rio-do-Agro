# Império do Agro: Fazenda Brasil

Jogo de fazenda brasileiro em um único HTML (canvas 2D), jogado no celular deitado e instalado como app (PWA).
O dono não programa: fala em português, quer as mudanças prontas e publicadas no app dele.

## Como o projeto está organizado
- `codigo/` → código-fonte. Cada `g_*.js` é uma parte do jogo; `build.sh` junta tudo (na ordem certa) em `codigo/world.html` e checa a sintaxe (`SYNTAX_OK`).
- `index.html` (raiz) → o jogo montado + tags do PWA (manifest e service worker). É isso que o Netlify publica.
- `sw.js` → service worker (cache `ida-vN`, busca a versão nova primeiro). Suba o número a cada publicação.
- `manifest.webmanifest`, `icons/`, `privacidade.html` → app/PWA.
- Publicação: push na `main` → Netlify (site `imperiodoagrobr`) publica sozinho em ~1 min → https://imperiodoagrobr.netlify.app

## Fluxo para uma mudança
1. Editar ou criar um `codigo/g_*.js` (arquivo novo: adicionar `+F('novo.js')` no `build.sh`, na posição certa).
2. `bash codigo/build.sh` → precisa dar `SYNTAX_OK`.
3. Testar com Playwright (exemplos em `codigo/testes/`; viewport de celular deitado 844x390, `has_touch`). Para começar jogo novo: clicar `[data-t="newpick"]` e depois `[data-t="create"]`.
4. Gerar o `index.html` da raiz: o `world.html` com `<link rel="manifest" href="manifest.webmanifest">`, theme-color e ícones antes do `<title>`, e o registro do `sw.js` antes do `</body>`. Subir a versão em `sw.js`.
5. Commit e push na `main`.

## Padrões do código
- Mapa: x vai de `XMIN` (-32) até `MW` (272), y de `YMIN` (-32) até `MH`; a área de fora termina em `RZ` (200) e as salas ficam de `RZ` para baixo (posicione salas novas como `y:RZ+n`). Índice de tile sempre por `ti(x,y)` (e `tix(i)`/`tiy(i)` para voltar); nunca `y*MW+x` para `G/SOL/FEN`. Loops pelo mapa todo começam em `XMIN`/`YMIN`.
- Tudo global, num único `<script>`. Mudanças são feitas por **embrulho**: `const _x=fn;fn=function(){...;return _x(...)}` (funciona com update, hookDay, drawFurn, roomAct, interactList, evoItems, rfCarve, stepTraffic, drawPlayerBase, lookToH, huntLegal…).
- `paused()` é FUNÇÃO. Itens em `evoItems` usam a camada 10: `L.push([y,10,{draw:g=>...}])`.
- Salas: `ROOMS[id]={id,x,y,w,h,floor,wall,trim,win,items:[{k,x,y,w,h,act}],wallx:[{k,x}]}` na zona interna (y≥168). `goSub(id,volta)` entra em sub-sala; `exitRoom` sai.
- Desenho: `Rr(g,cor,x,y,w,h)`, `OL`, `drawPerson`, `drawHuman` (boneco detalhado), `ptext` (fonte 3x5 sem acento), `shade(cor,±n)`.
- Jogo: `toast`, `tt(chave,msg,cls,seg)`, `cash`, `R$`, `gainXP`, `ri`, `rnd`, `pick`, `clamp`, `S` (save), `P` (jogador).
- Marcas reais viram paródia (Rolês, Luís Vitton, Guccio, Bellini, Grauz…) por causa da Play Store.
- Textos do jogo em português do Brasil.
