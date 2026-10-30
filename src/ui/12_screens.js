/* ---------- screens ---------- */
var setup={preset:'',lastLvl:'sedang',passives:false,theme:'politik',count:3,limit:25,money:1500000,build:'bertahap',news:true,players:[],picking:0,slots:[0,1,2,3,4].map(function(){return {npc:false,level:'sedang'};})};
var SETUP_KEY='kc-setup';
function loadSetup(){try{var o=JSON.parse(localStorage.getItem(SETUP_KEY)||'null');if(!o)return;['preset','lastLvl','passives','theme','count','limit','money','build','news'].forEach(function(k){if(o[k]!==undefined)setup[k]=o[k];});
  if(o.slots&&o.slots.length)o.slots.forEach(function(sl,i){if(setup.slots[i]&&sl)setup.slots[i]={npc:!!sl.npc,level:['mudah','sedang','sulit'].indexOf(sl.level)>=0?sl.level:'sedang'};});if(o.names)setup.names=o.names;}catch(e){}}
function saveSetup(){try{var o={};['preset','lastLvl','passives','theme','count','limit','money','build','news','slots','names'].forEach(function(k){o[k]=setup[k];});localStorage.setItem(SETUP_KEY,JSON.stringify(o));}catch(e){}}
function humanSlots(){var a=[];for(var i=0;i<setup.count;i++)if(!setup.slots[i].npc)a.push(i);return a;}
var LVL_OPTS=[['mudah','Mudah'],['sedang','Sedang'],['sulit','Sulit']],LVL_STAR={mudah:'★',sedang:'★★',sulit:'★★★'};
/* lobby as a debate stage: each player is a candidate on a podium; tap a podium to set character, name, human/NPC, level */
function podChars(){var list=charsFor(setup.theme),ids=list.map(function(c){return c.id;}),used={};setup.players=setup.players||[];
  for(var i=0;i<setup.count;i++){var p=setup.players[i]||{};if(!p.char||ids.indexOf(p.char)<0||used[p.char]){var later=setup.players.slice(i+1,setup.count);var free=list.filter(function(c){return !used[c.id]&&!later.some(function(q){return q&&q.char===c.id;});});var ch=free[Math.floor(Math.random()*free.length)]||list[i%list.length];p={name:p.name,char:ch.id};}used[p.char]=1;setup.players[i]=p;}}
function slotName(i){var sl=setup.slots[i],p=setup.players[i]||{};return sl.npc?charName(p.char):((p.name)||(setup.names&&setup.names[i])||('Pemain '+(i+1)));}
function lvlText(l){l=l||'sedang';return LVL_STAR[l]+' '+l.charAt(0).toUpperCase()+l.slice(1);}
function addNpcUpTo(v){for(var k=setup.count;k<v;k++){var sl=setup.slots[k];sl.npc=true;sl.level=setup.lastLvl||'sedang';}setup.count=v;}
function renderSlots(){var box=$('podiums');if(!box)return;podChars();box.innerHTML='';
  for(var i=0;i<5;i++)(function(i){var b=document.createElement('button');b.type='button';b.className='podium'+(i<setup.count?'':' empty');b.style.setProperty('--pc',PCOLORS[i]);
    if(i<setup.count){var sl=setup.slots[i],p=setup.players[i];b.setAttribute('aria-label','Calon '+(i+1)+': '+slotName(i)+(sl.npc?', NPC '+(sl.level||'sedang'):', manusia')+'. Tap untuk ubah');
      b.innerHTML='<canvas></canvas><span class="base"><span class="no">'+(i+1)+'</span><span class="nm"></span><span class="who'+(sl.npc?'':' me')+'"></span></span>';
      b.querySelector('.nm').textContent=slotName(i);b.querySelector('.who').textContent=sl.npc?'NPC · '+lvlText(sl.level):'Manusia';
      b.onclick=function(){play('tap');openPod(i);};var cvs=b.querySelector('canvas');requestAnimationFrame(function(){portrait(cvs,p.char,PCOLORS[i]);});}
    else{b.setAttribute('aria-label','Tambah calon nomor '+(i+1));b.innerHTML='<span class="plus">+</span><span class="base"><span class="no">'+(i+1)+'</span><span class="nm">Podium kosong</span></span>';
      b.onclick=function(){play('tap');addNpcUpTo(i+1);syncCount();renderSlots();};}
    box.appendChild(b);})(i);
  var nh=humanSlots().length,nn=setup.count-nh;$('slotHint').textContent=(nh===0?'Semua NPC, kamu tinggal nonton. ':nh+' manusia lawan '+nn+' NPC. ')+'Tap calon untuk ganti karakter, nama, atau level.';}
function syncCount(){seg($('segCount'),[[2,'2'],[3,'3'],[4,'4'],[5,'5']],setup.count,function(v){addNpcUpTo(v);renderSlots();});}
var POD=-1;
function openPod(i){POD=i;var sl=setup.slots[i],sh=$('podSheet');sh.hidden=false;sh.querySelector('.pod-sheet').style.setProperty('--pc',PCOLORS[i]);
  $('podNo').textContent=i+1;$('podTitle').textContent='Calon nomor '+(i+1);
  var ni=$('podName');$('podNameF').hidden=sl.npc;if(!sl.npc&&document.activeElement!==ni)ni.value=slotName(i);
  ni.oninput=function(){var v=(ni.value||'').trim().slice(0,12);setup.players[i].name=v;setup.names=setup.names||[];setup.names[i]=v;renderSlots();};
  seg($('podKind'),[[false,'Manusia'],[true,'NPC']],sl.npc,function(v){sl.npc=v;if(v)sl.level=setup.lastLvl||sl.level||'sedang';openPod(i);renderSlots();});
  $('podLvlF').hidden=!sl.npc;if(sl.npc)seg($('podLvl'),LVL_OPTS,sl.level||'sedang',function(v){sl.level=v;setup.lastLvl=v;renderSlots();});
  var grid=$('podGrid');grid.innerHTML='';var list=charsFor(setup.theme),psvOn=setup.passives&&setup.theme==='politik',mine=setup.players[i].char;
  var byOf=function(id){for(var k=0;k<setup.count;k++)if(k!==i&&setup.players[k]&&setup.players[k].char===id)return k;return -1;};
  list.forEach(function(ch){var by=byOf(ch.id),on=mine===ch.id;
    var b=document.createElement('button');b.type='button';b.className='char-card'+(on?' on':'');b.disabled=by>=0;b.setAttribute('aria-pressed',String(on));
    var c=document.createElement('canvas');b.appendChild(c);var sp=document.createElement('span');sp.textContent=ch.name;b.appendChild(sp);
    if(psvOn&&PASSIVES[ch.id]){var pv=document.createElement('span');pv.className='psv';pv.innerHTML='<b>'+PASSIVES[ch.id].n+'</b> · '+PASSIVES[ch.id].d;b.appendChild(pv);}
    if(by>=0){var tk=document.createElement('span');tk.className='taken';tk.style.background=PCOLORS[by];tk.textContent='Calon '+(by+1);b.appendChild(tk);}
    b.onclick=function(){play('buy');if(typeof vo==='function')vo('chr_'+ch.id+'_pilih');setup.players[i].char=ch.id;openPod(i);renderSlots();};
    grid.appendChild(b);requestAnimationFrame(function(){portrait(c,ch.id,by>=0?PCOLORS[by]:(on?PCOLORS[i]:null));});});
  $('podRandom').onclick=function(){var free=list.filter(function(ch){return byOf(ch.id)<0&&ch.id!==mine;});var ch=free[Math.floor(Math.random()*free.length)];if(ch){play('buy');setup.players[i].char=ch.id;openPod(i);renderSlots();}};
  $('podDone').onclick=closePod;sh.onclick=function(e){if(e.target===sh)closePod();};}
function closePod(){$('podSheet').hidden=true;POD=-1;renderSlots();saveSetup();}
var PRESETS={standar:{limit:25,money:1500000,build:'bertahap',news:true,passives:false},kilat:{limit:20,money:1000000,build:'bebas',news:true,passives:false},brutal:{limit:0,money:2000000,build:'bertahap',news:true,passives:true}};
function presetOf(){for(var k in PRESETS){var P=PRESETS[k],ok=true;for(var f in P)if(setup[f]!==P[f])ok=false;if(ok)return k;}return 'atur';}
function renderPreset(){var cur=setup.preset==='atur'?'atur':presetOf();
  seg($('segPreset'),[['standar','Standar · 25 ronde'],['kilat','Kilat · 20 ronde'],['brutal','Bedebah brutal'],['atur','Atur sendiri']],cur,function(v){setup.preset=v;if(PRESETS[v]){var P=PRESETS[v];for(var f in P)setup[f]=P[f];setup.moneyCustom=false;setup.limitCustom=false;}initLobby();});
  $('customPanel').hidden=cur!=='atur';$('lobby').classList.toggle('custom',cur==='atur');}
function stageTitle(){$('stageTitle').textContent=setup.theme==='politik'?'DEBAT CALON NEGERI BEDEBAH':'PANGGUNG PESERTA';}
function show(id){['splash','lobby','pick','game'].forEach(function(s){$(s).hidden=s!==id;});if(id==='game')setTimeout(layout,0);syncMusic();}
function seg(el,opts,val,onPick){el.innerHTML='';opts.forEach(function(o){var b=document.createElement('button');b.type='button';b.textContent=o[1];b.setAttribute('aria-pressed',String(o[0]===val));b.onclick=function(){play('tap');onPick(o[0]);seg(el,opts,o[0],onPick);};el.appendChild(b);});}
function buildHint(){var L=THEMES[setup.theme].levels;$('buildHint').textContent=setup.build==='bertahap'?'Tiap kunjungan naik satu level: '+L.slice(0,4).join(', ')+', lalu '+L[4]+'.':'Boleh langsung ambil sampai '+L[2]+' dan lompat level.';}
function themeHint(){$('themeHint').textContent=THEMES[setup.theme].tag;$('passiveField').hidden=setup.theme!=='politik';$('newsLabel').textContent=THEMES[setup.theme].newsName;}
var MONEY_P=[1000000,1500000,2000000,3000000],LIMIT_P=[20,25,30,0];
function syncMoneyInput(){var mi=$('moneyInput');if(mi&&document.activeElement!==mi)mi.value=setup.money;}
function custSeg(id,presets,labels,cur,isCust,onPick){var opts=presets.map(function(v,k){return [v,labels[k]];}).concat([['atur','Atur sendiri']]);seg($(id),opts,isCust?'atur':cur,onPick);}
function initLobby(){
  syncCount();renderSlots();renderPreset();stageTitle();
  var limCust=LIMIT_P.indexOf(setup.limit)<0||setup.limitCustom;
  var pickLim=function(v){if(v==='atur'){setup.limitCustom=true;$('limitBox').hidden=false;var li=$('limitInput');li.value=LIMIT_P.indexOf(setup.limit)<0?setup.limit:'';setTimeout(function(){li.focus();},0);}else{setup.limitCustom=false;setup.limit=v;$('limitBox').hidden=true;}};
  custSeg('segLimit',LIMIT_P,['20','25','30','Tanpa batas'],setup.limit,limCust,pickLim);$('limitBox').hidden=!limCust;if(limCust)$('limitInput').value=setup.limit;
  $('limitInput').oninput=function(){var v=parseInt(String(this.value).replace(/[^0-9]/g,''),10);if(v>=5&&v<=200)setup.limit=v;};
  $('limitInput').onblur=function(){var v=parseInt(String(this.value).replace(/[^0-9]/g,''),10);if(!(v>=5))v=5;if(v>200)v=200;this.value=v;setup.limit=v;};
  seg($('segTheme'),[['politik','Politik'],['santai','Santai']],setup.theme,function(v){setup.theme=v;themeHint();buildHint();renderSlots();stageTitle();});themeHint();
  var monCust=MONEY_P.indexOf(setup.money)<0||setup.moneyCustom;
  var pickMon=function(v){if(v==='atur'){setup.moneyCustom=true;$('moneyBox').hidden=false;var mi=$('moneyInput');mi.value=setup.money;setTimeout(function(){mi.focus();mi.select();},0);}else{setup.moneyCustom=false;setup.money=v;$('moneyBox').hidden=true;}};
  custSeg('segMoney',MONEY_P,['1jt','1,5jt','2jt','3jt'],setup.money,monCust,pickMon);$('moneyBox').hidden=!monCust;syncMoneyInput();
  $('moneyInput').oninput=function(){var v=parseInt(String(this.value).replace(/[^0-9]/g,''),10);if(v>0)setup.money=v;};
  $('moneyInput').onblur=function(){var v=parseInt(String(this.value).replace(/[^0-9]/g,''),10)||1500000;v=Math.max(300000,Math.min(20000000,Math.round(v/10000)*10000));this.value=v;setup.money=v;};
  seg($('segBuild'),[['bertahap','Bertahap'],['bebas','Bebas']],setup.build,function(v){setup.build=v;buildHint();});buildHint();
  seg($('segNews'),[[true,'Nyala'],[false,'Mati']],setup.news,function(v){setup.news=v;});
  seg($('segPassive'),[[false,'Mati'],[true,'Nyala']],setup.passives,function(v){setup.passives=v;});
}
function renderPick(){
  var k=setup.picking,hs=humanSlots();$('pickTitle').textContent='Pemain '+(k+1)+' dari '+setup.count+(hs.length<setup.count?' · '+(setup.count-hs.length)+' NPC':'');$('pickDot').style.background=PCOLORS[k];
  var ni=$('nameInput');ni.value=(setup.players[k]&&setup.players[k].name)||(setup.names&&setup.names[k])||('Pemain '+(k+1));
  var grid=$('charGrid');grid.innerHTML='';
  var list=charsFor(setup.theme),psvOn=setup.passives&&setup.theme==='politik';
  $('pickRandom').onclick=function(){var free=list.filter(function(ch){return !takenBy(ch.id,k);});var ch=free[Math.floor(Math.random()*free.length)];play('buy');pickChar(k,ch.id);};
  $('pickRandomAll').onclick=function(){play('buy');var free=shuffleArr(list.filter(function(ch){return !takenBy(ch.id,k);})),n=0;hs.forEach(function(j){if(j<k)return;var nm=j===k?((ni.value||'').trim()||('Pemain '+(j+1))):((setup.players[j]&&setup.players[j].name)||(setup.names&&setup.names[j])||('Pemain '+(j+1)));setup.players[j]={name:nm.slice(0,12),char:free[n++].id};});startNewGame();};
  list.forEach(function(ch){var by=takenBy(ch.id,k);by=by?by.i:-1;
    var b=document.createElement('button');b.type='button';b.className='char-card';b.disabled=by>=0;
    var c=document.createElement('canvas');b.appendChild(c);var s=document.createElement('span');s.textContent=ch.name;b.appendChild(s);if(psvOn&&PASSIVES[ch.id]){var pv=document.createElement('span');pv.className='psv';pv.innerHTML='<b>'+PASSIVES[ch.id].n+'</b> · '+PASSIVES[ch.id].d;b.appendChild(pv);}
    if(by>=0){var tk=document.createElement('span');tk.className='taken';tk.style.background=PCOLORS[by];tk.textContent=setup.players[by].name;b.appendChild(tk);}
    b.onclick=function(){play('buy');if(typeof vo==='function')vo('chr_'+ch.id+'_pilih');pickChar(k,ch.id);};
    grid.appendChild(b);requestAnimationFrame(function(){portrait(c,ch.id,by>=0?PCOLORS[by]:null);});});
}
function shuffleArr(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function takenBy(id,k){for(var i=0;i<setup.count;i++){if(setup.slots[i].npc||i>=k)continue;var p=setup.players[i];if(p&&p.char===id)return {i:i};}return null;}
function nextHuman(k){var hs=humanSlots();for(var j=0;j<hs.length;j++)if(hs[j]>k)return hs[j];return -1;}
function prevHuman(k){var hs=humanSlots();for(var j=hs.length-1;j>=0;j--)if(hs[j]<k)return hs[j];return -1;}
function pickChar(k,id){var ni=$('nameInput'),nm=(ni.value||'').trim()||('Pemain '+(k+1));setup.players[k]={name:nm.slice(0,12),char:id};var nx=nextHuman(k);if(nx>=0){setup.picking=nx;renderPick();}else withDisclaimer(setup.theme,startNewGame);}
function fillNpcs(){var list=charsFor(setup.theme),used=[];podChars();for(var i=0;i<setup.count;i++)if(setup.players[i])used.push(setup.players[i].char);
  var free=shuffleArr(list.filter(function(ch){return used.indexOf(ch.id)<0;}));
  for(var j=0;j<setup.count;j++){var sl=setup.slots[j];if(!sl.npc){setup.players[j]={name:slotName(j)||('Pemain '+(j+1)),char:setup.players[j].char};continue;}var pc=setup.players[j]&&setup.players[j].char,ch=pc?CHARS.filter(function(x){return x.id===pc;})[0]:null;if(!ch)ch=free.shift()||list[j%list.length];setup.players[j]={name:ch.name,char:ch.id,npc:true,level:sl.level||'sedang'};}
  setup.names=setup.names||[];for(var h=0;h<setup.count;h++)if(!setup.slots[h].npc&&setup.players[h])setup.names[h]=setup.players[h].name;saveSetup();}
function startNewGame(){fillNpcs();var m=Math.max(300000,Math.min(20000000,Math.round((setup.money||1500000)/10000)*10000));newGame({players:setup.players.slice(0,setup.count),turnLimit:setup.limit,money:m,buildMode:setup.build,theme:setup.theme,news:setup.news,passives:setup.passives&&setup.theme==='politik'});enterGame();}
function enterGame(){anim=null;diceRoll=null;cup.phase='idle';FX.take={};FX.build={};FX.collapse=[];FX.forest=null;HAND.key=null;npcReset();$('players').hidden=true;camHome();buildPanels();show('game');refresh();}


/* Politik: fictional disclaimer before every game, button unlocks after 2 s */
function withDisclaimer(theme,fn){if(theme!=='politik')return fn();var d=$('disc'),b=$('discOk');d.hidden=false;b.disabled=true;var t=setTimeout(function(){b.disabled=false;try{b.focus();}catch(e){}},2000);b.onclick=function(){if(b.disabled)return;clearTimeout(t);d.hidden=true;play('tap');fn();};}
