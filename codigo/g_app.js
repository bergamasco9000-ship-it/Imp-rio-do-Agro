// ===== Comportamento de app no celular: botão voltar do Android fecha janelas em vez de sair; sem "puxar para atualizar" =====
(function(){
 const st=document.createElement('style');st.textContent='html,body{overscroll-behavior:none}';document.head.appendChild(st);
 let backT=0;
 try{history.pushState({ida:1},'')}catch(e){}
 addEventListener('popstate',()=>{
  let handled=false;
  try{
   if(document.getElementById('title')){handled=false}
   else if(typeof modalOpen!=='undefined'&&$('modal')&&$('modal').style.display==='flex'){hideModal();handled=true}
   else if(typeof menuOpen!=='undefined'&&menuOpen){closeMenu();handled=true}
   else if(typeof S!=='undefined'&&S&&typeof save==='function'){if(Date.now()-backT<2500){save();handled=false}else{backT=Date.now();toast('↩️ Toque em voltar de novo para sair (o jogo é salvo).');handled=true}}
  }catch(e){}
  if(handled){try{history.pushState({ida:1},'')}catch(e){}}else{try{history.back()}catch(e){}}
 });
 // salva quando o app vai para segundo plano
 document.addEventListener('visibilitychange',()=>{try{if(document.hidden&&typeof S!=='undefined'&&S&&typeof save==='function')save()}catch(e){}});
})();
