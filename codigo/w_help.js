const hex=h=>{const n=parseInt(h.slice(1),16);return[n>>16,(n>>8)&255,n&255]};
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
const shade=(h,d)=>'rgb('+hex(h).map(v=>clamp(v+d,0,255)).join(',')+')';
let PS=1,CX=0,CY=0;
let RMODE=0,OLT=.75;
function setHTML(el,h){if(el._h!==h){el._h=h;el.innerHTML=h}}
const Rr=(g,c,x,y,w,h)=>{if(RMODE){const sh=c.charCodeAt(0)===114&&c.startsWith('rgba(0,0,0');if(RMODE===4){if(!sh){g.fillStyle='rgba(22,12,6,.85)';g.fillRect(Math.round((x-OLT)*PS)/PS,Math.round((y-OLT)*PS)/PS,w+2*OLT,h+2*OLT);return}}else if(RMODE===1?sh:!sh)return}g.fillStyle=c;g.fillRect(Math.round(x*PS)/PS,Math.round(y*PS)/PS,w,h)};
let vt=.5,frame=0;
function drawCow(g,a,x,y,dir,f,mini){
 const B=BREEDS[a.breed],calf=a.age<240,bull=a.sex==='M'&&a.age>=400,c=B.col,dk=shade(c,-45),Wd=calf?11:17;
 const r=(col,dx,dy,w,h)=>Rr(g,col,dir>0?x+dx:x+Wd-dx-w,y+dy,w,h);
 Rr(g,'rgba(0,0,0,.28)',x+1,y+(calf?7:10),Wd-2,1);
 if(calf){
  r(dk,0,2,1,2);r(c,1,2,6,3);r(shade(c,-30),2,4,4,1);r(B.face||c,7,1,3,3);r('#e8a0a0',10,2,1,1);r('#111',9,2,1,1);
  [1,3,5,6].forEach((dx,i)=>r(dk,dx,5,1,(i+f)%2?2:1));
 }else{
  const lh=i=>(i+f)%2?3:2;
  r(dk,0,2,1,4);r(c,1,2,10,5);r(dk,2,6,8,1);
  if(B.hump)r(c,8,0,3,2);
  if(B.spot){r(B.spot,3,2,3,2);r(B.spot,8,4,2,2);r(B.spot,12,2,3,2)}
  r(c,11,1,2,4);r(B.face||c,12,1,4,4);r('#e8a0a0',15,3,1,2);r('#111',14,2,1,1);r(dk,11,1,2,1);
  if(bull||B.tier>=3)r('#f2ecd8',12,0,1,1);
  [2,4,8,10].forEach((dx,i)=>r(dk,dx,7,1,lh(i)));
 }
 const ix=x+(Wd>>1)-1;
 if(a.sick){Rr(g,'#e33',ix,y-6,3,1);Rr(g,'#e33',ix+1,y-7,1,3);}
 else if(a.preg)Rr(g,'#f08ac0',ix,y-5,3,2);
 if(a.title)Rr(g,'#ffd75e',ix+4,y-6,2,2);
 if(a.breeder)Rr(g,'#5fa8ff',ix-3,y-5,2,2);
}
