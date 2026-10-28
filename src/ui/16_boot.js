/* ---------- boot ---------- */
function boot(){
  cv=$('board');ctx=cv.getContext('2d');bindBoard();
  new ResizeObserver(function(){if(!$('game').hidden)layout();}).observe($('stage'));
  window.addEventListener('pointerdown',audioUnlock,{passive:true});
  var par=$('parade');CHARS.forEach(function(ch,i){var c=document.createElement('canvas');par.appendChild(c);requestAnimationFrame(function(){portrait(c,ch.id,PCOLORS[i%5]);});});
  var sv=loadSave();if(sv&&sv.phase!=='over'&&sv.players)$('btnResume').hidden=false;
  $('btnNew').onclick=function(){audioUnlock();play('tap');setup.players=[];setup.picking=0;initLobby();show('lobby');};
  $('btnResume').onclick=function(){audioUnlock();var s=loadSave();if(!s)return;S=s;if(S.phase==='resolve')S.phase='end';if(S.phase==='moving'&&!S.anim)S.phase='end';enterGame();};
  $('lobbyBack').onclick=function(){show('splash');};
  $('lobbyNext').onclick=function(){play('tap');setup.picking=0;setup.players=[];renderPick();show('pick');};
  $('pickBack').onclick=function(){if(setup.picking>0){setup.picking--;renderPick();}else show('lobby');};
  $('hoGo').onclick=function(){audioUnlock();play('tap');startTurn();if(cam.mode==='free')setCamMode('follow');refresh();};
  $('camBtn').onclick=function(){play('tap');setCamMode(cam.mode==='all'?'follow':'all');};
  $('btnStudio').onclick=function(){play('tap');openStudio();};$('pStudio').onclick=function(){play('tap');openStudio();};$('studioClose').onclick=function(){play('tap');$('studio').hidden=true;};
  setSpeed(SPEED);$('speedBtn').onclick=function(){setSpeed(SPEED%3+1);play('tap');showToast('Kecepatan '+SPEED+'x'+(SPEED>1?': adegan dan langkah lebih cepat':''));};
  loadUserClips();
  $('cineSkip').onclick=function(){play('tap');endCine();};
  $('news').onclick=function(){this.hidden=true;};
  var label=function(){$('pSound').textContent='Efek suara: '+(muted?'Mati':'Nyala');$('pMusic').textContent='Musik: '+(musicOff?'Mati':'Nyala');};
  $('menuBtn').onclick=function(){$('pause').hidden=false;label();$('pQuit').textContent='Keluar ke menu';};
  $('pResume').onclick=function(){$('pause').hidden=true;};
  $('pSound').onclick=function(){muted=!muted;try{localStorage.setItem('kc-muted',muted?'1':'0');}catch(e){}label();};
  $('pMusic').onclick=function(){musicOff=!musicOff;try{localStorage.setItem('kc-music-off',musicOff?'1':'0');}catch(e){}audioUnlock();applyMusic();label();};
  $('pRules').onclick=function(){$('rulesBox').hidden=!$('rulesBox').hidden;};
  $('pQuit').onclick=function(){if(this.textContent!=='Yakin? Tap lagi'){this.textContent='Yakin? Tap lagi';return;}$('pause').hidden=true;$('handoff').hidden=true;$('modal').hidden=true;$('result').hidden=true;save();S=null;$('btnResume').hidden=!loadSave();show('splash');};
  $('resMenu').onclick=function(){$('result').hidden=true;clearSave();S=null;$('btnResume').hidden=true;show('splash');};
  $('resAgain').onclick=function(){var ps=S.players.map(function(p){return {name:p.name,char:p.char};}),lim=S.turnLimit,mon=S.startMoney||1500000,bm=S.buildMode||'bertahap',th=S.theme||'santai',nw=S.newsEnabled!==false;$('result').hidden=true;newGame({players:ps,turnLimit:lim,money:mon,buildMode:bm,theme:th,news:nw});enterGame();};
  musicWant='menu';
  requestAnimationFrame(render);requestAnimationFrame(tickMoney);
}
boot();
