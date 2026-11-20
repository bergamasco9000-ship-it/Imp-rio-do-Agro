// ===== Pastor-do-Cáucaso: o cão mais forte do canil. Gigante de pelo longo cinza-acastanhado, máscara escura, juba no pescoço,
// franja de pelo na barriga, culote nas coxas e cauda peluda. O pelo grosso amortece mordidas e garras.
DOGS.caucaso={n:'Pastor-do-Cáucaso',lv:9,p:18000,spd:76,bite:32,guard:100,track:45,herd:75,sz:2,col:'#9a8a72',str:98,life:11,hpm:175,coat:.25,
 d:'O mais forte do canil: até 90 kg, criado para enfrentar lobos e ursos. O pelo grosso reduz 25% do dano e protege o pescoço.',
 v:{len:17,h:7.5,leg:6,head:7,mz:2.2,ear:'crop',tail:'fluff',c:'#9a8a72',bl:'#cdbd9f',dk:'#6a5c4a',mask:'#3a3028',ear_c:'#3a3028',tc:'#8c7c66',tip:'#c8b898',chest:'#cdbd9f',ruff:'#ac9c82',jowl:1,shag:1}};
UNL[9]+=' · Pastor-do-Cáucaso (o cão mais forte)';
// pelo longo desenhado por cima do corpo base
const _ddsC=drawDogSprite;
drawDogSprite=function(g,x,y,dr,v,pose,ph,o){
 _ddsC.apply(this,arguments);if(!v||!v.shag)return;o=o||{};
 const f=(c,dx,dy,w,h)=>{if(w>0&&h>0)Rr(g,c,dr>0?x+dx:x-dx-w,y+dy,w,h)};
 const L=v.len,H=v.h,LG=v.leg,HS=v.head,half=L/2,c=v.c,dk=v.dk,bl=v.bl,rf=v.ruff;
 const run=pose==='run',walk=pose==='walk'||pose==='limp'||(pose==='sniff'&&o.mv),sit=pose==='sit',lie=pose==='lie'||pose==='sleep';
 let rearY=0,frontY=0,hdx=0,hdy=0,bob=0;
 if(run)bob=-Math.abs(Math.sin(ph))*1.3;else if(walk)bob=-Math.abs(Math.sin(ph))*.5;else if(!lie&&!sit)bob=Math.sin(frame/22)*.25;
 if(sit)rearY=LG-1.5;if(lie){rearY=LG-.5;frontY=LG-.5}
 if(pose==='hold'){frontY=1.5;hdx=1.2;hdy=2.5+(o.shake?Math.sin(frame*1.4)*.8:0);rearY=-.5}
 if(pose==='sniff'){hdy=LG+H-HS*.6;hdx=.8}if(pose==='point')hdx=1;if(o.hurt)hdy+=.5;
 const top=-(LG+H)+bob,hx=half-1+hdx,hy=top+frontY-HS+2+hdy,sway=run?Math.sin(ph*2)*.4:walk?Math.sin(ph)*.2:0;
 // dorso agouti mais escuro com pontas de pelo irregulares
 for(let i=-half+.4,k=0;i<half-2.8;i+=1,k++){const yy=top+(i<0?rearY:frontY);f(shade(c,-14),i,yy,1.02,1.6+(k%3)*.3);if(k%2)f(shade(c,-6),i+.2,yy-.45,.7,.5)}
 // franja comprida na barriga: faixa contínua com mechas de tamanhos diferentes
 if(!lie){const ys=i=>top+(i<0?rearY:frontY)+H-.5;for(let i=-half+2,k=0;i<half-2.4;i+=.8,k++){const ln=[.9,1.5,1.1,1.8,1.2][k%5];f(shade(bl,-6),i+sway*(k%2),ys(i),.82,ln);if(k%3===0)f(shade(bl,-18),i+sway*(k%2),ys(i),.82,.4)}}
 // culote: coxa traseira com pelo comprido
 if(!lie&&!sit){f(c,-half-.5,-LG+bob+.3,2.2,2.4);f(shade(c,-6),-half-.8,-LG+bob+2.2,1.2,1.2);f(shade(bl,-6),-half+.3,-LG+bob+2.5,1,1.1)}
 // juba no pescoço: arredondada, mais clara embaixo, sem cobrir a coleira
 {const mx=half-5.2,my=hy+HS-3.8;f(rf,mx+.6,my,2.6,5);f(rf,mx,my+1,1,3.4);f(shade(rf,-10),mx-.4,my+1.8,.6,2);f(shade(rf,14),mx+.8,my+4.6,2.2,1);f(shade(rf,14),mx+1.4,my+5.4,1,.7)}
 // bochechas cheias e papada escura
 f(shade(c,4),hx+.2,hy+HS-3.2,2.2,2);f(v.mask,hx+HS-1.6,hy+HS-3.4,1.2,1.6);
 // orelha pequena caída
 f(v.ear_c,hx+.3,hy-.6,1.8,2.2);
 // coleira por cima da juba
 const cy=hy+HS-1.4;if(o.col===1){f('#5a3218',half-3.2,cy,3,1.3);f('#e0c060',half-2.8,cy+.3,.6,.6);f('#e0c060',half-1.4,cy+.3,.6,.6)}else if(o.col===2){f('#3a3a3a',half-3.4,cy,3.2,1.4);for(let i=0;i<3;i++){f('#e8e8e8',half-3.2+i*1.1,cy-.8,.6,.8);f('#e8e8e8',half-3.2+i*1.1,cy+1.4,.6,.8)}}else if(o.col===0)f('#a03020',half-3,cy,2.6,1);
 // cauda peluda extra
 if(!run&&!sit&&!lie){const tw=o.wag?Math.sin(frame*(o.wag>2?.9:.45))*1.2:0,ty0=top+rearY;f(v.tc,-half-2.4,ty0+1.2,1.4,4);f(shade(v.tc,-10),-half-3.2+tw*.6,ty0+3.4,1.4,3);f(v.tip,-half-3+tw*.6,ty0+6,1.6,1.2)}
 else if(run){f(v.tc,-half-4.4,top+rearY+.2,4.2,1.8);f(v.tip,-half-5,top+rearY+.5,1.2,1.4)}
};
// pelo grosso: absorve parte do dano (mordidas de lobo, garras de urso e onça)
const _dHurtC=dogHurt;
dogHurt=function(d,dmg,src,o){const def=d&&DOGS[d.breed];if(def&&def.coat)dmg*=1-def.coat;return _dHurtC(d,dmg,src,o)};
// dica no guia
if(typeof GUIDE!=='undefined'&&Array.isArray(GUIDE))GUIDE.push({lv:9,ic:'🐕',t:'Pastor-do-Cáucaso',h:'No nível 9 o Canil do Seu Tião vende o Pastor-do-Cáucaso, o cão mais forte do jogo: agarre 98, vida 175 e pelo grosso que reduz 25% do dano. Sozinho já segura um javali grande; com outro cão segura até urso.'});
