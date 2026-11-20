// ===== Tamanhos realistas: gado e bichos da mata proporcionais ao humano (≈1,75 m = 25 px)
// vaca nelore ≈1,4 m de cernelha e 2,4 m de comprimento; touro ≈1,6 m no cupim; veado ≈1,7 m com chifres; alce ≈2,6 m; sucuri ≈5 m
const _csSz=cowScale;cowScale=function(a,cls){return _csSz(a,cls)*(cls==='bull'?1.1:cls==='calf'?1.15:1.2)};
const WSC={rabbit:.72,turkey:1.3,deer:1.7,whitedeer:1.7,boar:1.45,elk:1.9,duck:.95,capy:1.2,croc:[1.3,1.12],wolf:1.3,bear:1.5,goat:1.2,coyote:1.2,pronghorn:1.15,jararaca:[1.5,1.1],cascavel:[1.45,1.1],sucuri:[2.6,1.4]};
const wsc=k=>{const f=WSC[k];return f?(Array.isArray(f)?f:[f,f]):null};
for(const k in WSC){const sp=SPECIES[k];if(!sp)continue;const [sx,sy]=wsc(k),m=Math.sqrt(sx*sy);sp.sz*=sy;sp.br*=m;sp.vr*=m}
// (o desenho dos bichos agora é feito em tamanho real em g_wildart.js)
