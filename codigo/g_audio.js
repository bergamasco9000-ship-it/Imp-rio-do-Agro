// ===== Música e sons: viola caipira (corda dedilhada de verdade, síntese Karplus-Strong), forró na vila, moda à noite,
// ===== ambiente (passarinhos, bem-te-vi, grilos, sapos, vento, chuva, trovão, mugido, galo, galinha), efeitos (moeda, compra, nível, passos, porta)
const SOM=(()=>{let o={on:1,mus:.55,sfx:.8,amb:.65};try{Object.assign(o,JSON.parse(localStorage.getItem('ida_som')||'{}'))}catch(e){}return o})();
const somSave=()=>{try{localStorage.setItem('ida_som',JSON.stringify(SOM))}catch(e){}};
let BUS=null;
function aud(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(!BUS||BUS.ac!==AC){const m=AC.createGain(),mus=AC.createGain(),sfx=AC.createGain(),amb=AC.createGain(),comp=AC.createDynamicsCompressor();
  comp.threshold.value=-14;comp.ratio.value=3;mus._ida=sfx._ida=amb._ida=m._ida=comp._ida=1;mus.connect(m);sfx.connect(m);amb.connect(m);m.connect(comp);comp.connect(AC.destination);
  // reverb curtinho (sala de madeira) só para a música
  const rv=AC.createConvolver(),len=AC.sampleRate*1.4,ir=AC.createBuffer(2,len,AC.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)*.5}rv.buffer=ir;const rg=AC.createGain();rg.gain.value=.22;rv._ida=rg._ida=1;mus.connect(rv);rv.connect(rg);rg.connect(m);
  BUS={ac:AC,m,mus,sfx,amb,musLvl:1};somApply()}return AC}catch(e){return null}}
function somApply(){if(!BUS)return;const t=AC.currentTime,on=SOM.on?1:0;BUS.m.gain.setTargetAtTime(on,t,.05);BUS.mus.gain.setTargetAtTime(SOM.mus*.9*BUS.musLvl,t,.4);BUS.sfx.gain.setTargetAtTime(SOM.sfx,t,.05);BUS.amb.gain.setTargetAtTime(SOM.amb*.9,t,.3)}
// todo som antigo do jogo (tiros, latidos, buzina, motor...) passa a respeitar o volume de efeitos
{const _cn=AudioNode.prototype.connect;AudioNode.prototype.connect=function(t,...a){if(AC&&t===AC.destination&&!this._ida&&BUS&&BUS.ac===AC)return _cn.call(this,BUS.sfx,...a);return _cn.call(this,t,...a)}}
// destrava o áudio no primeiro toque (regra dos navegadores)
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>{const a=aud();if(a&&a.state==='suspended'&&!document.hidden)a.resume()},{passive:true}));
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume()});
// ---------- instrumentos
const mf=m=>440*Math.pow(2,(m-69)/12);let NOISE=null;
function noiseBuf(){if(NOISE&&NOISE.sampleRate===AC.sampleRate)return NOISE;const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return NOISE=b}
const KS={};
function ksBuf(m,bright){const k=m+'|'+bright;if(KS[k]&&KS[k].sampleRate===AC.sampleRate)return KS[k];const sr=AC.sampleRate,f=mf(m),N=Math.max(2,Math.round(sr/f)),L=Math.floor(sr*(m<50?2.6:2)),b=AC.createBuffer(1,L,sr),y=b.getChannelData(0);
 let prev=0;for(let i=0;i<N;i++){const r=Math.random()*2-1;y[i]=bright?r:(r+prev)/2;prev=r}// palhetada
 const dec=m<50?.9975:m<62?.9965:.995;for(let i=N;i<L;i++)y[i]=dec*.5*(y[i-N]+(i-N-1>=0?y[i-N-1]:0));
 let mx=0;for(let i=0;i<Math.min(L,N*4);i++)mx=Math.max(mx,Math.abs(y[i]));const s=mx?.6/mx:1;for(let i=0;i<L;i++)y[i]*=s;return KS[k]=b}
function pluck(m,t,v,bus,pan,bright){const s=AC.createBufferSource();s.buffer=ksBuf(m,bright?1:0);const g=AC.createGain();g.gain.value=v;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=m<50?1400:4200;
 let out=g;if(AC.createStereoPanner&&pan){const p=AC.createStereoPanner();p.pan.value=pan;g.connect(p);out=p}s.connect(f);f.connect(g);out.connect(bus||BUS.mus);s.start(t);s.stop(t+2.6)}
// viola caipira: cordas em pares (uma oitava acima nas mais graves), timbre metálico
let MVOL=1;function viola(m,t,v,pan){v*=MVOL;pluck(m,t,v,BUS.mus,pan||0,1);pluck(m+(m<60?12:0),t+.006,v*(m<60?.45:.35),BUS.mus,(pan||0)*.6,1)}
function sanfona(m,t,d,v){const f=mf(m),g=AC.createGain(),fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=2300;fl.Q.value=1.2;
 const os=[['sawtooth',1,1],['sawtooth',1.004,.8],['square',.5,.35]].map(([ty,mul,a])=>{const o=AC.createOscillator(),og=AC.createGain();o.type=ty;o.frequency.value=f*mul;og.gain.value=a;o.connect(og);og.connect(fl);return o});
 const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=5.6;lg.gain.value=f*.0045;lfo.connect(lg);os.forEach(o=>lg.connect(o.frequency));
 fl.connect(g);g.connect(BUS.mus);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.035);g.gain.setValueAtTime(v*.85,t+Math.max(.05,d-.06));g.gain.linearRampToValueAtTime(0,t+d+.04);
 os.concat([lfo]).forEach(o=>{o.start(t);o.stop(t+d+.08)})}
function zabumba(t,v,slap){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(115,t);o.frequency.exponentialRampToValueAtTime(48,t+.18);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.42);o.connect(g);g.connect(BUS.mus);o.start(t);o.stop(t+.45);
 const n=AC.createBufferSource(),ng=AC.createGain(),nf=AC.createBiquadFilter();n.buffer=noiseBuf();nf.type=slap?'bandpass':'highpass';nf.frequency.value=slap?3200:1800;ng.gain.setValueAtTime(slap?v*.5:v*.18,t);ng.gain.exponentialRampToValueAtTime(.001,t+(slap?.07:.03));n.connect(nf);nf.connect(ng);ng.connect(BUS.mus);n.start(t,Math.random());n.stop(t+.1)}
function triangulo(t,open,v){for(const [f,a] of[[4210,1],[6340,.6],[8900,.3]]){const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.setValueAtTime(v*a,t);g.gain.exponentialRampToValueAtTime(.0005,t+(open?.4:.06));o.connect(g);g.connect(BUS.mus);o.start(t);o.stop(t+.45)}}
// ---------- músicas
const SCL={G:[55,57,59,60,62,64,66,67,69,71,72,74,76,78,79,81,83],D:[50,52,54,55,57,59,60,62,64,66,67,69,71,72,74,76,78]};
const third=(m,k)=>{const s=SCL[k];const i=s.indexOf(m);return i>=2?s[i-2]:m-4};
const VCH={G:[55,59,62,67],C:[55,60,64,67],D:[57,62,66,69],D7:[57,60,62,66],Em:[55,59,64,67],A:[57,61,64,69],Am:[57,60,64,69]},BASS={G:43,C:48,D:50,D7:50,Em:40,A:45,Am:45};
const MTRK={
 dia:{n:'Toada da Porteira',vol:2,bpm:92,bb:3,key:'G',bars:[['G',[[71,1],[74,1],[71,1]]],['G',[[69,.5],[71,.5],[67,2]]],['C',[[76,1],[74,.5],[72,.5],[76,1]]],['G',[[74,3]]],['D7',[[72,1],[69,1],[72,1]]],['D',[[71,.5],[69,.5],[66,2]]],['G',[[67,1],[71,1],[74,1]]],['G',[[74,1.5],[71,1.5]]],
  ['Em',[[76,1],[79,1],[76,1]]],['C',[[76,.5],[74,.5],[72,2]]],['G',[[71,1],[74,1],[71,1]]],['D',[[69,3]]],['G',[[71,.5],[72,.5],[74,1],[71,1]]],['C',[[76,1],[72,1],[76,1]]],['D7',[[74,1],[72,1],[69,1]]],['G',[[67,3]]]],
  acc(b,ch,t0,bd,i){viola(BASS[ch],t0,.42,-.2);for(const k of[1,2]){const tt=t0+k*bd;VCH[ch].forEach((m,j)=>viola(m,tt+j*.018,.13,.25))}if(i%4===3)viola(BASS[ch]+7,t0+2.5*bd,.2,-.2)}},
 noite:{n:'Moda do Luar',vol:2.6,bpm:66,bb:3,key:'G',bars:[['Em',[[71,3]]],['C',[[72,1.5],[71,.5],[69,1]]],['G',[[67,3]]],['D',[[66,1],[69,2]]],['Em',[[71,1],[74,1],[71,1]]],['C',[[69,3]]],['Am',[[72,1],[71,1],[69,1]]],['D',[[66,1.5],[67,1.5]]],
  ['Em',[[76,2],[74,1]]],['C',[[72,3]]],['G',[[71,1],[74,1],[79,1]]],['D',[[78,3]]],['Em',[[76,1],[74,1],[71,1]]],['C',[[72,1.5],[71,1.5]]],['D',[[69,1],[66,1],[69,1]]],['Em',[[64,3]]]],
  mel:.6,acc(b,ch,t0,bd){const c=VCH[ch];viola(BASS[ch],t0,.3,-.2);const arp=[c[0],c[2],c[1],c[3],c[2],c[1]];arp.forEach((m,j)=>viola(m,t0+j*bd*.5,.09,.3))}},
 vila:{n:'Baião da Praça',bpm:112,bb:2,key:'D',bars:[['D',[[69,.5],[66,.5],[69,.5],[66,.5]]],['G',[[67,.5],[69,.25],[67,.25],[66,1]]],['D',[[62,.5],[66,.5],[69,.5],[72,.5]]],['G',[[71,.75],[69,.25],[67,1]]],['C',[[72,.5],[71,.5],[69,.5],[67,.5]]],['G',[[66,.5],[67,.25],[66,.25],[64,1]]],['A',[[62,.5],[64,.5],[66,.5],[69,.5]]],['D',[[62,2]]]],
  sanf:1,acc(b,ch,t0,bd){zabumba(t0,.55);zabumba(t0+.75*bd,.4);zabumba(t0+bd,.2,1);zabumba(t0+1.5*bd,.3);for(let k=0;k<8;k++)triangulo(t0+k*bd/4,k%2===1,.05);sanfona(BASS[ch]-12+12,t0,bd*.45,.05);sanfona(BASS[ch]-12+19,t0+bd,bd*.45,.04)}}};
const MUS={trk:null,bar:0,next:0,want:null,fadeT:0};
function musPick(){const ti0=document.getElementById('title');if(ti0&&getComputedStyle(ti0).display!=='none')return 'dia';if(!S||typeof P==='undefined')return null;
 if(inRoom()){const r=roomAt(P.x,P.y);if(r&&(r.id==='bar'||r.id==='cabare'||r.id==='vipcab'))return null;return 'dia'}
 const h=dayHour();if(typeof inTown==='function'&&TOWNZ(Math.floor(P.x/TS),Math.floor(P.y/TS)))return h>=7&&h<22?'vila':'noite';return h>=19||h<5?'noite':'dia'}
function musStep(){const a=AC;if(!a||!BUS||a.state!=='running')return;const want=SOM.on&&SOM.mus>0?musPick():null;
 // no interior das salas a música fica mais baixa
 const lvl=(typeof inRoom==='function'&&S&&inRoom())?.55:1;if(Math.abs(lvl-BUS.musLvl)>.01){BUS.musLvl=lvl;somApply()}
 if(want!==MUS.trk){MUS.trk=want;MUS.bar=0;if(MUS.next<a.currentTime+.1)MUS.next=a.currentTime+.15}
 if(!MUS.trk)return;const T=MTRK[MUS.trk],bd=60/T.bpm;MVOL=T.vol||1;
 while(MUS.next<a.currentTime+.6){const [ch,mel]=T.bars[MUS.bar%T.bars.length],t0=MUS.next,i=MUS.bar%T.bars.length,loop=Math.floor(MUS.bar/T.bars.length);
  T.acc(MUS.bar,ch,t0,bd,i);
  const play=!(T.mel&&loop%2===1&&Math.random()>T.mel);let tt=t0;for(const [m,d] of mel){if(play){if(T.sanf){sanfona(m,tt,d*bd*.92,.075);sanfona(third(m,T.key),tt,d*bd*.92,.04)}else{viola(m,tt,.3,.1);viola(third(m,T.key),tt+.012,.2,-.1)}}tt+=d*bd}
  MUS.bar++;MUS.next=t0+T.bb*bd;if(MUS.bar%T.bars.length===0)MUS.next+=bd*(T.bb===2?2:3)}}
// ---------- ambiente
function chirp(t,f0,f1,d,v,pan){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+d*.2);g.gain.exponentialRampToValueAtTime(.0005,t+d);
 let out=g;if(AC.createStereoPanner){const p=AC.createStereoPanner();p.pan.value=pan||0;g.connect(p);out=p}o.connect(g);out.connect(BUS.amb);o.start(t);o.stop(t+d+.02)}
function bird(t){const pan=rnd(-.8,.8),k=Math.random();if(k<.3){chirp(t,2900,3000,.13,.05,pan);chirp(t+.17,3700,3800,.11,.05,pan);chirp(t+.32,3300,2300,.38,.05,pan)}// bem-te-vi
 else if(k<.65){const n=ri(2,5);for(let i=0;i<n;i++)chirp(t+i*.09,rnd(3200,4200),rnd(4400,5200),.06,.03,pan)}
 else{for(let i=0;i<3;i++)chirp(t+i*.22,2100+i*120,2600,.15,.035,pan)}}// sabiá
function cricket(t){const f=rnd(4300,4900),pan=rnd(-.7,.7);for(let i=0;i<3;i++)chirp(t+i*.045,f,f*1.01,.03,.012,pan)}
function frog(t){const o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='square';o.frequency.setValueAtTime(rnd(150,210),t);f.type='lowpass';f.frequency.value=700;g.gain.setValueAtTime(0,t);for(let i=0;i<4;i++){g.gain.linearRampToValueAtTime(.06,t+i*.035+.01);g.gain.linearRampToValueAtTime(0,t+i*.035+.03)}o.connect(f);f.connect(g);g.connect(BUS.amb);o.start(t);o.stop(t+.2)}
function moo(t,v){const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter(),b=rnd(95,125);o.type=o2.type='sawtooth';
 o.frequency.setValueAtTime(b*.85,t);o.frequency.linearRampToValueAtTime(b*1.1,t+.25);o.frequency.linearRampToValueAtTime(b,t+1.1);o2.frequency.setValueAtTime(b*.425,t);o2.frequency.linearRampToValueAtTime(b*.5,t+1.1);
 f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(380,t);f.frequency.linearRampToValueAtTime(900,t+.4);f.frequency.linearRampToValueAtTime(520,t+1.2);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.18);g.gain.setValueAtTime(v,t+.9);g.gain.linearRampToValueAtTime(0,t+1.35);o.connect(f);o2.connect(f);f.connect(g);g.connect(BUS.amb);o.start(t);o2.start(t);o.stop(t+1.4);o2.stop(t+1.4)}
function rooster(t,v){const o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';f.type='bandpass';f.frequency.value=1500;f.Q.value=1.4;
 const seq=[[520,.11],[0,.04],[540,.11],[0,.04],[700,.14],[0,.03],[820,.12]];let tt=t;g.gain.setValueAtTime(0,t);for(const [fr,d] of seq){if(fr){o.frequency.setValueAtTime(fr,tt);g.gain.linearRampToValueAtTime(v,tt+.02);g.gain.setValueAtTime(v,tt+d-.02);g.gain.linearRampToValueAtTime(fr?0:0,tt+d)}tt+=d}
 o.frequency.setValueAtTime(820,tt);o.frequency.linearRampToValueAtTime(930,tt+.3);o.frequency.linearRampToValueAtTime(640,tt+.8);g.gain.linearRampToValueAtTime(v,tt+.03);g.gain.setValueAtTime(v,tt+.6);g.gain.linearRampToValueAtTime(0,tt+.85);
 o.connect(f);f.connect(g);g.connect(BUS.amb);o.start(t);o.stop(tt+.9)}
function cluck(t){for(let i=0;i<ri(2,4);i++){const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.setValueAtTime(rnd(420,560),t+i*.13);o.frequency.exponentialRampToValueAtTime(300,t+i*.13+.05);g.gain.setValueAtTime(.025,t+i*.13);g.gain.exponentialRampToValueAtTime(.0005,t+i*.13+.06);o.connect(g);g.connect(BUS.amb);o.start(t+i*.13);o.stop(t+i*.13+.08)}}
function thunder(t){const n=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();n.buffer=noiseBuf();f.type='lowpass';f.frequency.value=140;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.9,t+.08);g.gain.exponentialRampToValueAtTime(.4,t+.5);g.gain.exponentialRampToValueAtTime(.001,t+3);n.loop=true;n.connect(f);f.connect(g);g.connect(BUS.amb);n.start(t);n.stop(t+3)}
const LOOPS={};function loopNoise(id,type,freq,q){if(LOOPS[id]&&LOOPS[id].ac===AC)return LOOPS[id];const n=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();n.buffer=noiseBuf();n.loop=true;f.type=type;f.frequency.value=freq;f.Q.value=q||.7;g.gain.value=0;n.connect(f);f.connect(g);g.connect(BUS.amb);n.start();return LOOPS[id]={ac:AC,g,f}}
let ambT=0,roosterD=-1;
function ambStep(dt){const a=AC;if(!a||!BUS||a.state!=='running'||!S||typeof P==='undefined')return;const t=a.currentTime+.05,room=inRoom(),h=dayHour(),night=h>=19.5||h<5,rain=S.weather==='chuva',tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS),town=TOWNZ(tx,ty);
 const out=room?0:1;loopNoise('chuva','bandpass',2400,.5).g.gain.setTargetAtTime(rain?(room?.05:.16):0,a.currentTime,.8);loopNoise('chuva2','lowpass',600).g.gain.setTargetAtTime(rain?(room?.04:.1):0,a.currentTime,.8);
 const w=loopNoise('vento','lowpass',380);w.g.gain.setTargetAtTime(out*(.025+.02*Math.sin(a.currentTime/7)+(rain?.03:0)),a.currentTime,1.5);
 if(room)return;const r=k=>Math.random()<k*dt;
 if(!night&&!rain&&r(town?.12:.45))bird(t);
 if(night&&r(1.6))cricket(t);if(night&&r(.18))cricket(t+.3);if(night&&!town&&r(.08))frog(t);
 if(rain&&r(.025))thunder(t+rnd(0,.5));
 const farm=typeof FARMZ==='function'?FARMZ(tx,ty):tx<60&&ty>30&&ty<132;
 if(farm&&S.herd&&S.herd.length&&r(.06+Math.min(.08,S.herd.length*.002)))moo(t,rnd(.05,.11));
 if(farm&&S.chk&&S.chk.n>0&&r(.07))cluck(t);
 if(!town&&h>=5&&h<6.5&&roosterD!==S.day){roosterD=S.day;rooster(t,.09)}else if(farm&&h>=6&&h<10&&r(.012))rooster(t,.06)}
// ---------- efeitos
function sfxTone(f,t,d,v,type,f2){const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(BUS.sfx);o.start(t);o.stop(t+d+.02)}
const FX={
 coin(){const t=AC.currentTime;sfxTone(1318,t,.18,.1);sfxTone(1760,t+.07,.35,.1);sfxTone(2637,t+.07,.25,.04)},
 pay(){const t=AC.currentTime;sfxTone(700,t,.06,.06,'triangle');sfxTone(1050,t+.05,.12,.05,'triangle')},
 level(){const t=AC.currentTime;[67,71,74,79,83].forEach((m,i)=>pluck(m,t+i*.09,.35,BUS.sfx,0,1));sfxTone(1568,t+.5,.6,.05)},
 good(){const t=AC.currentTime;sfxTone(988,t,.25,.045);sfxTone(1319,t+.08,.3,.035)},
 bad(){const t=AC.currentTime;sfxTone(180,t,.25,.12,'triangle',120)},
 click(){sfxTone(1500,AC.currentTime,.03,.025,'triangle')},
 step(k){const t=AC.currentTime,n=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();n.buffer=noiseBuf();f.type=k==='wood'?'bandpass':'lowpass';f.frequency.value=k==='wood'?900:k==='road'?1600:550;f.Q.value=k==='wood'?2:.7;
  g.gain.setValueAtTime(k==='wood'?.09:.05,t);g.gain.exponentialRampToValueAtTime(.0005,t+(k==='wood'?.07:.09));n.connect(f);f.connect(g);g.connect(BUS.sfx);n.start(t,Math.random()*1.5);n.stop(t+.1)},
 door(){const t=AC.currentTime;sfxTone(210,t,.25,.035,'sawtooth',130);const n=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();n.buffer=noiseBuf();f.type='lowpass';f.frequency.value=300;g.gain.setValueAtTime(.18,t+.2);g.gain.exponentialRampToValueAtTime(.001,t+.35);n.connect(f);f.connect(g);g.connect(BUS.sfx);n.start(t+.2,Math.random());n.stop(t+.4)}};
const fxLast={};function ifx(k,arg,gap){if(!AC||!BUS||AC.state!=='running'||!SOM.on)return;const n=performance.now();if(fxLast[k]&&n-fxLast[k]<(gap||80))return;fxLast[k]=n;try{FX[k](arg)}catch(e){}}
let inDay=0;const _hdAu=hookDay;hookDay=function(){inDay=1;try{return _hdAu.apply(this,arguments)}finally{inDay=0}};
const _cashAu=cash;cash=function(n,l){const r=_cashAu.apply(this,arguments);if(!inDay){if(n>=500)ifx('coin',0,150);else if(n<=-200)ifx('pay',0,150)}return r};
const _toastAu=toast;toast=function(m,c){const r=_toastAu.apply(this,arguments);if(c==='good')ifx('good',0,900);else if(c==='bad')ifx('bad',0,900);return r};
const _fadeAu=fade;fade=function(fn){ifx('door',0,400);return _fadeAu(fn)};
document.addEventListener('click',e=>{if(e.target.closest('button'))ifx('click',0,40)},true);
let lastLV=null,stepPh=0;
const _updAu=update;update=function(dt){_updAu(dt);if(!S)return;try{
 const lv=LV();if(lastLV!==null&&lv>lastLV)ifx('level');lastLV=lv;
 if(P.moving&&!P.drive&&!P.ride){const k=Math.floor(P.ph/Math.PI);if(k!==stepPh){stepPh=k;const tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS);ifx('step',inRoom()?'wood':G[ti(tx,ty)]===3?'road':'grass',120)}}
 ambT+=dt;if(ambT>.1){ambStep(Math.min(ambT,.5));ambT=0}}catch(e){}};
setInterval(()=>{try{musStep()}catch(e){}},120);
// ---------- botão de som no topo
const _rhAu=renderHUD;renderHUD=function(){_rhAu.apply(this,arguments);const r=document.getElementById('hudR');if(!r||r.querySelector('[data-act="somtg"]'))return;const b=document.createElement('button');b.dataset.act='somtg';b.textContent=SOM.on?'🔊':'🔇';const m=r.querySelector('[data-act="menu"]');r.insertBefore(b,m)};
ACT.somtg=function(){SOM.on=SOM.on?0:1;somSave();aud();somApply();const b=document.querySelector('[data-act="somtg"]');if(b)b.textContent=SOM.on?'🔊':'🔇';toast(SOM.on?'🔊 Som ligado':'🔇 Som desligado')};
