/* ---------- screens ---------- */
var setup={passives:false,theme:'politik',count:3,limit:25,money:1500000,build:'bertahap',news:true,players:[],picking:0};
function show(id){['splash','lobby','pick','game'].forEach(function(s){$(s).hidden=s!==id;});if(id==='game')setTimeout(layout,0);syncMusic();}
function seg(el,opts,val,onPick){el.innerHTML='';opts.forEach(function(o){var b=document.createElement('button');b.type='button';b.textContent=o[1];b.setAttribute('aria-pressed',String(o[0]===val));b.onclick=function(){play('tap');onPick(o[0]);seg(el,opts,o[0],onPick);};el.appendChild(b);});}
function buildHint(){var L=THEMES[setup.theme].levels;$('buildHint').textContent=setup.build==='bertahap'?'Tiap kunjungan naik satu level: '+L.slice(0,4).join(', ')+', lalu '+L[4]+'.':'Boleh langsung ambil sampai '+L[2]+' dan lompat level, seperti GetRich.';}
function themeHint(){$('themeHint').textContent=THEMES[setup.theme].tag;$('passiveField').hidden=setup.theme!=='politik';$('newsLabel').textContent=THEMES[setup.theme].newsName;}
function syncMoneyInput(){var mi=$('moneyInput');if(mi&&document.activeElement!==mi)mi.value=setup.money;}
function initLobby(){
  seg($('segCount'),[[2,'2'],[3,'3'],[4,'4'],[5,'5']],setup.count,function(v){setup.count=v;});
  seg($('segLimit'),[[20,'20'],[25,'25'],[30,'30'],[0,'Tanpa batas']],setup.limit,function(v){setup.limit=v;});
  seg($('segTheme'),[['politik','Politik'],['santai','Santai']],setup.theme,function(v){setup.theme=v;themeHint();buildHint();});themeHint();
  seg($('segMoney'),[[1000000,'1jt'],[1500000,'1,5jt'],[2000000,'2jt'],[3000000,'3jt']],setup.money,function(v){setup.money=v;syncMoneyInput();});syncMoneyInput();
  $('moneyInput').oninput=function(){var v=parseInt(String(this.value).replace(/[^0-9]/g,''),10);if(v>0){setup.money=v;seg($('segMoney'),[[1000000,'1jt'],[1500000,'1,5jt'],[2000000,'2jt'],[3000000,'3jt']],setup.money,function(x){setup.money=x;syncMoneyInput();});}};
  seg($('segBuild'),[['bertahap','Bertahap'],['bebas','Bebas']],setup.build,function(v){setup.build=v;buildHint();});buildHint();
  seg($('segNews'),[[true,'Nyala'],[false,'Mati']],setup.news,function(v){setup.news=v;});
  seg($('segPassive'),[[false,'Mati'],[true,'Nyala']],setup.passives,function(v){setup.passives=v;});
}
function renderPick(){
  var k=setup.picking;$('pickTitle').textContent='Pemain '+(k+1)+' dari '+setup.count;$('pickDot').style.background=PCOLORS[k];
  var ni=$('nameInput');ni.value=(setup.players[k]&&setup.players[k].name)||('Pemain '+(k+1));
  var grid=$('charGrid');grid.innerHTML='';
  var list=charsFor(setup.theme),psvOn=setup.passives&&setup.theme==='politik';
  $('pickRandom').onclick=function(){var free=list.filter(function(ch){return !setup.players.some(function(p,i){return i<k&&p&&p.char===ch.id;});});var ch=free[Math.floor(Math.random()*free.length)];play('buy');pickChar(k,ch.id);};
  $('pickRandomAll').onclick=function(){play('buy');var used=setup.players.slice(0,k).map(function(p){return p.char;}),free=shuffleArr(list.filter(function(ch){return used.indexOf(ch.id)<0;}));for(var j=k;j<setup.count;j++){var nm=j===k?((ni.value||'').trim()||('Pemain '+(j+1))):((setup.players[j]&&setup.players[j].name)||('Pemain '+(j+1)));setup.players[j]={name:nm.slice(0,12),char:free[j-k].id};}startNewGame();};
  list.forEach(function(ch){var by=setup.players.findIndex(function(p,i){return i<k&&p&&p.char===ch.id;});
    var b=document.createElement('button');b.type='button';b.className='char-card';b.disabled=by>=0;
    var c=document.createElement('canvas');b.appendChild(c);var s=document.createElement('span');s.textContent=ch.name;b.appendChild(s);if(psvOn&&PASSIVES[ch.id]){var pv=document.createElement('span');pv.className='psv';pv.innerHTML='<b>'+PASSIVES[ch.id].n+'</b> · '+PASSIVES[ch.id].d;b.appendChild(pv);}
    if(by>=0){var tk=document.createElement('span');tk.className='taken';tk.style.background=PCOLORS[by];tk.textContent=setup.players[by].name;b.appendChild(tk);}
    b.onclick=function(){play('buy');pickChar(k,ch.id);};
    grid.appendChild(b);requestAnimationFrame(function(){portrait(c,ch.id,by>=0?PCOLORS[by]:null);});});
}
function shuffleArr(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function pickChar(k,id){var ni=$('nameInput'),nm=(ni.value||'').trim()||('Pemain '+(k+1));setup.players[k]={name:nm.slice(0,12),char:id};if(k+1<setup.count){setup.picking++;renderPick();}else startNewGame();}
function startNewGame(){var m=Math.max(300000,Math.min(20000000,Math.round((setup.money||1500000)/10000)*10000));newGame({players:setup.players.slice(0,setup.count),turnLimit:setup.limit,money:m,buildMode:setup.build,theme:setup.theme,news:setup.news,passives:setup.passives&&setup.theme==='politik'});enterGame();}
function enterGame(){anim=null;diceRoll=null;cup.phase='idle';FX.take={};FX.build={};FX.collapse=[];FX.forest=null;setCamMode('follow');buildPanels();show('game');refresh();}

