/* ---------- audio: synth sfx + embedded music ---------- */
var AC=null,muted=false,musicOff=false,noiseBuf=null,MUSIC={},musicNow=null,musicWant=null,musicNode=null;
try{muted=localStorage.getItem('kc-muted')==='1';musicOff=localStorage.getItem('kc-music-off')==='1';}catch(e){}
function audioUnlock(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}
  try{AC=new (window.AudioContext||window.webkitAudioContext)();var len=AC.sampleRate*0.2;noiseBuf=AC.createBuffer(1,len,AC.sampleRate);var d=noiseBuf.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;}catch(e){AC=null;}
  applyMusic();try{warmSounds();}catch(e){}
}
function b64buf(b){var bin=atob(b),a=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return a.buffer;}
function getTrack(name,cb){if(MUSIC[name])return cb(MUSIC[name]);if(typeof TRACKS==='undefined'||!TRACKS[name])return;
  try{AC.decodeAudioData(b64buf(TRACKS[name]),function(buf){MUSIC[name]=buf;cb(buf);},function(){});}catch(e){}}
function setMusic(name){musicWant=name;applyMusic();}
function applyMusic(){
  if(!AC)return; var want=musicOff?null:musicWant; if(want===musicNow)return; musicNow=want;
  var t=AC.currentTime;if(musicNode){var old=musicNode;old.g.gain.cancelScheduledValues(t);old.g.gain.setValueAtTime(old.g.gain.value,t);old.g.gain.linearRampToValueAtTime(0.0001,t+1.2);setTimeout(function(){try{old.s.stop();}catch(e){}},1400);musicNode=null;}
  if(!want)return;
  getTrack(want,function(buf){if(musicNow!==want)return;var s=AC.createBufferSource(),gn=AC.createGain();s.buffer=buf;s.loop=want!=='win'&&want!=='pwin';var t2=AC.currentTime;gn.gain.setValueAtTime(0.0001,t2);gn.gain.linearRampToValueAtTime((want==='win'||want==='pwin')?0.6:0.42,t2+1.2);s.connect(gn);gn.connect(AC.destination);s.start();musicNode={s:s,g:gn};});
}
function syncMusic(){
  if(!S||$('game').hidden)return setMusic('menu');
  if(S.phase==='over')return setMusic(S.theme==='politik'&&typeof TRACKS!=='undefined'&&TRACKS.pwin?'pwin':'win');
  var tense=Object.keys(S.threats||{}).some(function(k){return S.threats[k];})||(S.turnLimit&&S.round>S.turnLimit-3);
  var calm=(typeof TRACKS!=='undefined'&&TRACKS.politik)?'politik':'calm';
  var tn=(S.theme==='politik'&&typeof TRACKS!=='undefined'&&TRACKS.ptense)?'ptense':'tense';
  setMusic(tense?tn:(S.theme==='politik'?calm:'santai'));
}
function tone(f,dur,type,vol,f2,delay){if(!AC||muted)return;var t=AC.currentTime+(delay||0),o=AC.createOscillator(),gn=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(vol||0.2,t+0.01);gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+dur+0.02);}
function noise(dur,vol,delay,hp){if(!AC||muted)return;var t=AC.currentTime+(delay||0),s=AC.createBufferSource(),f=AC.createBiquadFilter(),gn=AC.createGain();s.buffer=noiseBuf;f.type='bandpass';f.frequency.value=hp||1800;gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(gn);gn.connect(AC.destination);s.start(t);s.stop(t+dur);}
function synthPlay(n,arg){switch(n){
  case 'uuk':tone(420,0.14,'triangle',0.12,620);tone(440,0.16,'triangle',0.12,680,0.2);break;
  case 'birds':for(var bd=0;bd<8;bd++)tone(2200+Math.random()*1200,0.05,'sine',0.05,2800+Math.random()*900,bd*0.06);noise(0.5,0.12,0,3000);break;
  case 'plane':tone(110,1.6,'sawtooth',0.06,140);noise(1.6,0.12,0,500);break;
  case 'rain':noise(2.5,0.18,0,4000);noise(2.5,0.1,0.3,1500);break;
  case 'treesFall':[0,0.35,0.7].forEach(function(d){noise(0.1,0.4,d,900);tone(70,0.3,'triangle',0.25,40,d+0.08);});break;
  case 'laugh':[0,0.28,0.56,0.84].forEach(function(d,i){tone(170-i*12,0.2,'sawtooth',0.1,140-i*12,d);});break;
  case 'horn':tone(330,0.25,'square',0.06);tone(330,0.3,'square',0.06,null,0.35);break;
  case 'ribbon':noise(0.06,0.3,0,5000);for(var cl=0;cl<10;cl++)noise(0.03,0.2,0.2+cl*0.07,2500);break;
  case 'windCreak':noise(1.5,0.1,0,600);tone(240,0.6,'sawtooth',0.03,200,0.4);break;
  case 'flood':noise(2.0,0.3,0,700);noise(1.2,0.2,0.5,1800);break;
  case 'pile':[0,0.4,0.8].forEach(function(d){tone(80,0.15,'triangle',0.3,50,d);noise(0.06,0.3,d,1200);});break;
  case 'sting':tone(55,1.1,'sawtooth',0.22,41);tone(110,0.9,'sawtooth',0.12,82);noise(0.5,0.45,0,180);[392,466,587].forEach(function(f){tone(f,0.7,'sawtooth',0.05,f*0.94,0.05);});break;
  case 'tukang':for(var w=0;w<2;w++){tone(2600,0.12,'square',0.05,2900,w*0.2);}break;
  case 'preman':tone(160,0.25,'sawtooth',0.1,120);tone(130,0.3,'sawtooth',0.08,100,0.22);break;
  case 'fajar':for(var c3=0;c3<6;c3++)tone(1200+c3*90,0.07,'square',0.04,null,c3*0.09);break;
  case 'mic':tone(1800,0.05,'sine',0.06);noise(0.05,0.2,0,300);break;
  case 'typing':noise(0.02,0.12,0,3500);break;
  case 'collapse':noise(0.4,0.4,0,300);tone(90,0.4,'triangle',0.2,50);break;
  case 'appeal':tone(523,0.2,'triangle',0.1,null,0);tone(392,0.3,'triangle',0.1,null,0.2);break;

  case 'rattle':var pw=arg||0.3;noise(0.04,0.18+pw*0.3,0,1200+Math.random()*1400);if(Math.random()<0.5)noise(0.03,0.15+pw*0.2,0.03,900+Math.random()*900);break;
  case 'slam':tone(90,0.2,'triangle',0.35+(arg||0)*0.2,60);noise(0.12,0.5,0,400);noise(0.05,0.3,0.06,1500);break;
  case 'quake':for(var q=0;q<10;q++)noise(0.12,0.4,q*0.12,120+Math.random()*120);tone(50,1.4,'sawtooth',0.12,35);break;
  case 'fire':for(var f2=0;f2<14;f2++)noise(0.1,0.18,f2*0.12,600+Math.random()*1200);break;
  case 'cough':[0,0.18,0.42].forEach(function(d){noise(0.09,0.35,d,700);tone(220,0.08,'sawtooth',0.05,160,d);});break;
  case 'build':noise(0.05,0.35,0,600);noise(0.05,0.35,0.12,700);noise(0.05,0.35,0.24,650);[523,784].forEach(function(f,i){tone(f,0.14,'triangle',0.12,null,0.34+i*0.08);});break;
  case 'bulldoze':tone(70,0.9,'sawtooth',0.12,85);noise(0.9,0.2,0,200);break;
  case 'stamp':tone(140,0.12,'triangle',0.3,80);noise(0.08,0.4,0,500);break;
  case 'siren':for(var s2=0;s2<4;s2++){tone(700,0.35,'sine',0.08,1100,s2*0.7);tone(1100,0.35,'sine',0.08,700,s2*0.7+0.35);}break;
  case 'camera':noise(0.04,0.5,0,5000);tone(2400,0.03,'square',0.04,null,0.02);break;
  case 'scuttle':noise(0.03,0.12,0,2500);break;
  case 'pop':tone(300,0.12,'sine',0.2,900);break;
  case 'coins':for(var c=0;c<4;c++)tone(1300+c*120,0.06,'square',0.04,null,c*0.07);break;
  case 'splash':noise(0.3,0.35,0,1800);noise(0.2,0.2,0.1,3000);break;
  case 'news':[880,660,880,1100].forEach(function(f,i){tone(f,0.12,'square',0.06,null,i*0.13);});break;
  case 'dice':for(var i=0;i<4;i++)noise(0.05,0.3,i*0.07,900+Math.random()*900);break;
  case 'thud':tone(140,0.12,'triangle',0.3,90);noise(0.06,0.35,0,500);tone(170,0.08,'triangle',0.18,120,0.22);noise(0.04,0.2,0.22,700);tone(200,0.06,'triangle',0.1,150,0.36);break;
  case 'hop':tone(520,0.08,'sine',0.12,760);break;
  case 'coin':tone(988,0.08,'square',0.07);tone(1319,0.22,'square',0.07,null,0.07);break;
  case 'pay':tone(660,0.1,'triangle',0.14,440);tone(520,0.16,'triangle',0.12,330,0.09);break;
  case 'buy':[523,659,784].forEach(function(f,i){tone(f,0.14,'triangle',0.15,null,i*0.07);});noise(0.06,0.3,0,400);break;
  case 'card':noise(0.18,0.25,0,3000);tone(880,0.12,'sine',0.1,1320,0.12);break;
  case 'bad':tone(392,0.18,'sawtooth',0.07,262);tone(311,0.28,'sawtooth',0.07,196,0.16);break;
  case 'takeover':noise(0.25,0.5,0,250);tone(110,0.4,'sawtooth',0.15,55);tone(784,0.2,'square',0.07,null,0.15);break;
  case 'landmark':tone(98,1.2,'sine',0.3,90);tone(196,1.0,'triangle',0.12);[523,659,784,1047].forEach(function(f,i){tone(f,0.25,'triangle',0.12,null,0.15+i*0.09);});break;
  case 'festival':[784,988,1175,1568].forEach(function(f,i){tone(f,0.16,'square',0.06,null,i*0.08);});for(var k=0;k<4;k++)noise(0.12,0.25,0.35+k*0.12,2500);break;
  case 'broke':tone(330,0.35,'sawtooth',0.08,311);tone(294,0.35,'sawtooth',0.08,277,0.35);tone(262,0.7,'sawtooth',0.08,196,0.7);break;
  case 'alarm':for(var a=0;a<4;a++)tone(1200,0.07,'square',0.06,null,a*0.14);break;
  case 'win':[523,659,784,1047].forEach(function(f,i){tone(f,0.22,'triangle',0.1,null,i*0.12);});break;
  case 'tap':tone(700,0.05,'sine',0.08);break;
  case 'zap':for(var z=0;z<5;z++){noise(0.05,0.35,z*0.06,4500);tone(1800-z*200,0.05,'sawtooth',0.07,300,z*0.06);}tone(60,0.35,'square',0.08,40,0.05);break;
  case 'construct':[0,0.22,0.44].forEach(function(d){tone(900,0.04,'square',0.06,null,d);noise(0.06,0.35,d,1500);tone(160,0.1,'triangle',0.18,100,d+0.02);});noise(0.35,0.15,0.7,800);break;
  case 'omon':for(var om=0;om<7;om++)tone(180+Math.random()*90,0.11,'sawtooth',0.06,150+Math.random()*80,om*0.13);break;
  case 'tease':tone(520,0.12,'square',0.07,700);tone(700,0.14,'square',0.07,500,0.14);tone(480,0.22,'triangle',0.08,820,0.3);break;}}

