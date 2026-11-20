// ===== Veículos em tamanho real (pessoa ~1,75 m = 24 px → carro de 4,5 m, caminhão de 10 m) =====
function vScale(fn,s){return function(g,x,y,...a){if(!g||g.canvas!==CV)return fn.call(this,g,x,y,...a);g.save();g.translate(x,y);g.scale(s,s);g.translate(-x,-y);try{return fn.call(this,g,x,y,...a)}finally{g.restore()}}}
carW=vScale(carW,1.7);
drawBoiadeiro=vScale(drawBoiadeiro,1.65);
drawTractorV=vScale(drawTractorV,1.2);
// caminhonete dos ladrões (desenho próprio usa TRK)
{const _dtk=drawTruck;drawTruck=function(g,...a){const R=typeof TRK!=='undefined'?TRK:null;if(!R||a.length)return _dtk(g,...a);g.save();g.translate(R.x,R.y);g.scale(1.3,1.3);g.translate(-R.x,-R.y);try{return _dtk(g)}finally{g.restore()}}}
