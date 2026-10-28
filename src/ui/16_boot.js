/* ---------- turn flow: auto handoff (no full-screen overlay) + NPC controller ---------- */
var HAND={key:null,t0:0};
function uiBusy(now){return (typeof cineBusy==='function'&&cineBusy())||!!anim||S.phase==='moving'||S.phase==='resolve'||cup.phase!=='idle'||!!diceRoll||EVENTS.length>0||(typeof fxHold==='function'&&fxHold(now))||holdMove>now||!$('pause').hidden||!$('result').hidden;}
function camSettled(){if(cam.mode!=='follow')return true;var tp=tokenPos(S.current,performance.now()),tg=camTarget(tp.u,tp.v,tp.z/cam.z,1.75);return Math.abs(tg.z-cam.z)<0.04&&Math.abs(tg.px-cam.px)<14&&Math.abs(tg.py-cam.py)<14;}
function handoffTick(now){
  if(S.phase!=='handoff'){return;}
  if(uiBusy(now)){if(HAND.key)HAND.t0=Math.max(HAND.t0,now-400);return;}
  var key=S.round+':'+S.turnIdx+':'+S.current;
  if(HAND.key!==key){HAND.key=key;HAND.t0=now;var p=cur();if(!CAMSTATIC&&cam.mode==='free')setCamMode('follow');
    setTimeout(function(){if(S&&cur()===p)play('voice:'+p.char);},250);
    showToast('Giliran '+p.name+' ('+(p.npc?'NPC '+lvlName(p.level):charName(p.char))+')');return;}
  var el=(now-HAND.t0)*SPEED;
  if(el>=(CAMSTATIC?450:650)&&(camSettled()||el>1800)){startTurn();refresh();}
}
var NPC={sig:null,readyAt:0,doneSig:null,doneAt:0,choosing:false,timer:null,seenAt:0};
function npcReset(){clearTimeout(NPC.timer);NPC={sig:null,readyAt:0,doneSig:null,doneAt:0,choosing:false,timer:null,seenAt:0};}
var NPC_THINK={mudah:600,sedang:900,sulit:1200};
function npcSig(){var p=cur();return [S.round,S.turnIdx,S.phase,JSON.stringify(S.pending),p.pos,p.inJail,p.jailTurns,!!p.appealed,p.pelni,p.money,(S.dice||[]).join('')].join('|');}
function npcValid(a){if(!a||!a.a)return false;var p=cur(),ph=S.phase;
  if(a.a==='roll')return ph==='turn'&&!p.pelni;if(a.a==='pelni')return ph==='turn'&&p.pelni&&a.tile!=null&&a.tile!==p.pos;
  if(a.a==='appeal')return ph==='turn'&&p.inJail&&!p.appealed&&p.money>=appealFee();if(a.a==='payJail')return ph==='turn'&&p.inJail&&p.money>=jailFee();
  if(a.a==='choose')return ph==='prompt'&&a.opt!==undefined;if(a.a==='end')return ph==='end';if(a.a==='start')return ph==='handoff';return false;}
function npcFallback(){var p=cur(),ph=S.phase,pd=S.pending;
  if(ph==='end')return {a:'end'};
  if(ph==='turn'){if(p.pelni){var best=-1,bv=-1;for(var i=0;i<NT;i++){if(i===p.pos)continue;var st=S.tiles[i],v=st.owner===null&&buyable(i)?2:st.owner===p.id?1:0;v+=Math.random();if(v>bv){bv=v;best=i;}}return {a:'pelni',tile:best};}
    if(p.inJail&&p.money>jailFee()*4)return {a:'payJail'};return {a:'roll',power:0.3+Math.random()*0.6};}
  if(ph==='prompt'&&pd){var rich=p.money>(S.startMoney||1500000)*0.25;
    if(pd.type==='buy'){var op=buyOptions(p,pd.tile);return {a:'choose',opt:op.length?op[rich?op.length-1:0]:'skip'};}
    if(pd.type==='upgrade'){var uo=upgradeOptions(p,pd.tile).filter(function(l){return upCost(pd.tile,l)<=p.money*0.7&&(l<4||p.laps>=1);});return {a:'choose',opt:uo.length?uo[uo.length-1]:'skip'};}
    if(pd.type==='takeover')return {a:'choose',opt:p.money>takeoverPrice(pd.tile)*1.6?'yes':'no'};
    if(pd.type==='festival'){var oc=ownedCities(p.id).sort(function(a,b){return cityRent(b)-cityRent(a);});return {a:'choose',opt:oc.length?oc[0]:'skip'};}
    if(pd.type==='card')return {a:'choose',opt:'ok'};
    if(pd.type==='buywis')return {a:'choose',opt:p.money>assetPrice(pd.tile)*1.5?'yes':'no'};
    if(pd.type==='pelni')return {a:'choose',opt:p.money>PELNI_FEE*6&&Math.random()<0.5?'yes':'no'};
    return {a:'choose',opt:'no'};}
  return null;}
function npcExec(a,now){var p=cur();NPC.doneSig=npcSig();NPC.doneAt=now;
  if(a.a==='roll'){var pw=Math.max(0,Math.min(1,a.power==null?0.5:a.power));if(typeof npcRoll==='function'){npcRoll(pw);}else{cupStart();var hold=Math.max(420,pw*1600);NPC.timer=setTimeout(function(){if(cup.phase==='shake'){cup.t0=performance.now()-hold;doRelease(performance.now());}},hold/SPEED);}}
  else if(a.a==='pelni'){play('tap');pelniTo(a.tile);}
  else if(a.a==='appeal')payAppeal();else if(a.a==='payJail')payJail();else if(a.a==='end')endTurn();else if(a.a==='start')startTurn();
  else if(a.a==='choose'){var b=document.querySelector('#modal [data-opt="'+String(a.opt)+'"]');if(b){b.classList.add('npcpick');}NPC.choosing=true;var sig=NPC.doneSig;
    NPC.timer=setTimeout(function(){NPC.choosing=false;if(!S||S.phase!=='prompt'||npcSig()!==sig)return;NPC.choosing=true;try{choose(a.opt);}finally{NPC.choosing=false;}refresh();},420/SPEED);return;}
  refresh();}
function npcTick(now){
  if(!S||S.phase==='over'||S.phase==='handoff')return;var p=cur();
  if(!p||!p.npc)return;
  if(NPC.choosing||uiBusy(now)){NPC.readyAt=0;NPC.seenAt=0;return;}
  var sig=npcSig();if(sig===NPC.doneSig&&now-NPC.doneAt<7000)return;
  if(NPC.sig!==sig||!NPC.readyAt){NPC.sig=sig;NPC.seenAt=0;NPC.readyAt=now+(NPC_THINK[p.level]||900)*(S.phase==='end'?0.5:1)/SPEED;}
  if(S.phase==='prompt'){var m=$('modal');if(m.hidden){NPC.seenAt=0;return;}if(!NPC.seenAt)NPC.seenAt=now;if((now-NPC.seenAt)*SPEED<900)return;}
  if(now<NPC.readyAt)return;
  var a=null;if(typeof botNext==='function'){try{a=botNext();}catch(e){console.error(e);a=null;}}
  if(!npcValid(a))a=npcFallback();if(!npcValid(a))return;
  NPC.readyAt=0;npcExec(a,now);}
function allNpcTick(now){if(!CINE.open||!CINE.done||!S)return;if(S.players.some(function(q){return !q.npc&&!q.bankrupt;}))return;if(now-CINE.doneAt>2500)endCine();}
function turnTick(now){if(!S||$('game').hidden)return;var sb=typeof storyBusy==='function'&&storyBusy();if(sb!==turnTick.sb){turnTick.sb=sb;$('stage').classList.toggle('storyhold',sb);}try{handoffTick(now);npcTick(now);allNpcTick(now);}catch(e){console.error(e);}}
setInterval(function(){turnTick(performance.now());},100);
/* ---------- boot ---------- */
function boot(){
  cv=$('board');ctx=cv.getContext('2d');bindBoard();
  new ResizeObserver(function(){if(!$('game').hidden)layout();}).observe($('stage'));
  window.addEventListener('pointerdown',audioUnlock,{passive:true});
  var par=$('parade');CHARS_POL.slice(0,11).forEach(function(ch,i){var c=document.createElement('canvas');par.appendChild(c);requestAnimationFrame(function(){portrait(c,ch.id,PCOLORS[i%5]);});});
  var sv=loadSave();if(sv&&sv.phase!=='over'&&sv.players)$('btnResume').hidden=false;
  loadSetup();
  $('btnNew').onclick=function(){audioUnlock();play('tap');setup.players=[];setup.picking=0;initLobby();show('lobby');};
  $('btnResume').onclick=function(){audioUnlock();var s=loadSave();if(!s)return;S=s;if(S.phase==='resolve')S.phase='end';if(S.phase==='moving'&&!S.anim)S.phase='end';enterGame();};
  $('lobbyBack').onclick=function(){show('splash');};
  $('lobbyNext').onclick=function(){play('tap');saveSetup();setup.players=[];var hs=humanSlots();if(!hs.length){startNewGame();return;}setup.picking=hs[0];renderPick();show('pick');};
  $('pickBack').onclick=function(){var pv=prevHuman(setup.picking);if(pv>=0){setup.picking=pv;renderPick();}else show('lobby');};
  $('camBtn').onclick=function(){play('tap');setCamMode(cam.mode==='all'?'follow':'all');};
  $('btnStudio').onclick=function(){play('tap');openStudio();};$('pStudio').onclick=function(){play('tap');openStudio();};$('studioClose').onclick=function(){play('tap');$('studio').hidden=true;};
  setSpeed(SPEED);$('speedBtn').onclick=function(){setSpeed(SPEED%3+1);play('tap');showToast('Kecepatan '+SPEED+'x'+(SPEED>1?': adegan dan langkah lebih cepat':''));};
  loadUserClips();
  $('cineSkip').onclick=function(e){e.stopPropagation();play('tap');endCine();};$('cine').addEventListener('click',cineTap);
  $('plClose').onclick=function(){play('tap');$('players').hidden=true;};$('players').addEventListener('click',function(e){if(e.target===this)this.hidden=true;});
  $('news').onclick=function(){this.hidden=true;};
  var label=function(){$('pSound').textContent='Efek suara: '+(muted?'Mati':'Nyala');$('pMusic').textContent='Musik: '+(musicOff?'Mati':'Nyala');$('pCam').innerHTML='Kamera: '+(CAMSTATIC?'Statis':'Dinamis')+'<span class="opt-sub">'+(CAMSTATIC?'Seluruh papan terlihat, kamera diam':'Kamera ikut pemain yang jalan')+'</span>';};
  $('pCam').onclick=function(){setCamStatic(!CAMSTATIC);label();};
  $('menuBtn').onclick=function(){$('pause').hidden=false;label();$('pQuit').textContent='Keluar ke menu';};
  $('pResume').onclick=function(){$('pause').hidden=true;};
  $('pSound').onclick=function(){muted=!muted;try{localStorage.setItem('kc-muted',muted?'1':'0');}catch(e){}label();};
  $('pMusic').onclick=function(){musicOff=!musicOff;try{localStorage.setItem('kc-music-off',musicOff?'1':'0');}catch(e){}audioUnlock();applyMusic();label();};
  $('pRules').onclick=function(){$('rulesBox').hidden=!$('rulesBox').hidden;};
  $('pQuit').onclick=function(){if(this.textContent!=='Yakin? Tap lagi'){this.textContent='Yakin? Tap lagi';return;}$('pause').hidden=true;$('players').hidden=true;$('modal').hidden=true;$('result').hidden=true;save();S=null;$('btnResume').hidden=!loadSave();show('splash');};
  $('resMenu').onclick=function(){$('result').hidden=true;clearSave();S=null;$('btnResume').hidden=true;show('splash');};
  $('resAgain').onclick=function(){var ps=S.players.map(function(p){return {name:p.name,char:p.char,npc:!!p.npc,level:p.level};}),lim=S.turnLimit,mon=S.startMoney||1500000,bm=S.buildMode||'bertahap',th=S.theme||'santai',nw=S.newsEnabled!==false;$('result').hidden=true;newGame({players:ps,turnLimit:lim,money:mon,buildMode:bm,theme:th,news:nw,passives:!!S.passives});enterGame();};
  musicWant='menu';
  requestAnimationFrame(render);requestAnimationFrame(tickMoney);
}
boot();
