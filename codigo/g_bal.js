// ===== Equilíbrio do mapa maior: cada bicho cresce na mesma proporção da área onde ele pode aparecer
// (mesma densidade de antes em todo lugar). Medido nos biomas: serra ×2,84, pantanal ×2,2, cerrado ×3,67, mata ×2,27.
// Fica no fim do build para pegar todas as espécies (algumas são criadas em arquivos depois do g_wild2).
const BIOMUL={m:2.84,p:2.2,c:3.67,f:2.27};for(const k in SPECIES){const s=SPECIES[k];if(s.cnt0===undefined)s.cnt0=s.cnt;s.cnt=Math.round(s.cnt0*(BIOMUL[s.bio]||2.3))}
