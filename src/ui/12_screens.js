/* ---------- screens ---------- */
var setup={npcLevel:'atur',lastLvl:'sedang',passives:false,theme:'politik',count:3,limit:25,money:1500000,build:'bertahap',news:true,players:[],picking:0,slots:[0,1,2,3,4].map(function(){return {npc:false,level:'sedang'};})};
var SETUP_KEY='kc-setup';
function loadSetup(){try{var o=JSON.parse(localStorage.getItem(SETUP_KEY)||'null');if(!o)return;['lastLvl','passives','theme','count','limit','money','build','news'].forEach(function(k){if(o[k]!==undefined)setup[k]=o[k];});
  if(o.slots&&o.slots.length)o.slots.forEach(function(sl,i){if(setup.slots[i]&&sl)setup.slots[i]={npc:!!sl.npc,level:['mudah','sedang','sulit'].indexOf(sl.level)>=0?sl.level:'sedang'};});if(o.names)setup.names=o.names;}catch(e){}}
function saveSetup(){try{var o={};['lastLvl','passives','theme','count','limit','money','build','news','slots','names'].forEach(function(k){o[k]=setup[k];});localStorage.setItem(SETUP_KEY,JSON.stringify(o));}catch(e){}}
function humanSlots(){var a=[];for(var i=0;i<setup.count;i++)if(!setup.slots[i].npc)a.push(i);return a;}
var LVL_OPTS=[['mudah','Mudah'],['sedang','Sedang'],['sulit','Sulit']];
/* lobby as a ballot: each player is a numbered candidate box; NPC level sits inside that box; new NPCs inherit the last level picked */
function renderSlots(){var box=$('slotList');if(!box)return;box.innerHTML='';
  for(var i=0;i<setup.count;i++)(function(i){var sl=setup.slots[i],row=document.createElement('div');row.className='slot';row.style.setProperty('--pc',PCOLORS[i]);
    row.innerHTML='<span class="slot-no" aria-hidden="true">'+(i+1)+'</span><div class="slot-who"><div class="seg slot-kind" role="group" aria-label="Peserta '+(i+1)+'"></div>'+(setup.count>2&&i>0?'<button type="button" class="slot-rm" aria-label="Hapus peserta '+(i+1)+'">✕</button>':'')+'</div>'+(sl.npc?'<div class="seg slot-lvl" role="group" aria-label="Level NPC peserta '+(i+1)+'"></div>':'');box.appendChild(row);
    seg(row.querySelector('.slot-kind'),[[false,'Manusia'],[true,'NPC']],sl.npc,function(v){sl.npc=v;if(v)sl.level=setup.lastLvl||sl.level||'sedang';renderSlots();});
    var lv=row.querySelector('.slot-lvl');if(lv)seg(lv,LVL_OPTS,sl.level,function(v){sl.level=v;sl.own=true;setup.lastLvl=v;var ch=false;setup.slots.forEach(function(o,k){if(k<setup.count&&o!==sl&&o.npc&&!o.own&&o.level!==v){o.level=v;ch=true;}});if(ch)renderSlots();});
    var rm=row.querySelector('.slot-rm');if(rm)rm.onclick=function(){play('tap');var gone=setup.slots.splice(i,1)[0];setup.slots.push({npc:true,level:setup.lastLvl||'sedang'});if(setup.names)setup.names.splice(i,1);setup.count--;renderSlots();};})(i);
  var add=$('addSlot');add.hidden=setup.count>=5;
  var nh=humanSlots().length,nn=setup.count-nh;$('slotHint').textContent=nh===0?'Semua NPC: game jalan sendiri, kamu tinggal nonton.':nh===setup.count?setup.count+' manusia, gantian di satu perangkat.':nh+' manusia lawan '+nn+' NPC.';}
function show(id){['splash','lobby','pick','game'].forEach(function(s){$(s).hidden=s!==id;});if(id==='game')setTimeout(layout,0);syncMusic();}
function seg(el,opts,val,onPick){el.innerHTML='';opts.forEach(function(o){var b=document.createElement('button');b.type='button';b.textContent=o[1];b.setAttribute('aria-pressed',String(o[0]===val));b.onclick=function(){play('tap');onPick(o[0]);seg(el,opts,o[0],onPick);};el.appendChild(b);});}
function buildHint(){var L=THEMES[setup.theme].levels;$('buildHint').textContent=setup.build==='bertahap'?'Tiap kunjungan naik satu level: '+L.slice(0,4).join(', ')+', lalu '+L[4]+'.':'Boleh langsung ambil sampai '+L[2]+' dan lompat level.';}
function themeHint(){$('themeHint').textContent=THEMES[setup.theme].tag;$('passiveField').hidden=setup.theme!=='politik';$('newsLabel').textContent=THEMES[setup.theme].newsName;}
var MONEY_P=[1000000,1500000,2000000,3000000],LIMIT_P=[20,25,30,0];
function syncMoneyInput(){var mi=$('moneyInput');if(mi&&document.activeElement!==mi)mi.value=setup.money;}
function custSeg(id,presets,labels,cur,isCust,onPick){var opts=presets.map(function(v,k){return [v,labels[k]];}).concat([['atur','Atur sendiri']]);seg($(id),opts,isCust?'atur':cur,onPick);}
function initLobby(){
  $('addSlot').onclick=function(){if(setup.count>=5)return;play('tap');var sl=setup.slots[setup.count];sl.npc=true;sl.level=setup.lastLvl||'sedang';setup.count++;renderSlots();};renderSlots();
  var limCust=LIMIT_P.indexOf(setup.limit)<0||setup.limitCustom;
  var pickLim=function(v){if(v==='atur'){setup.limitCustom=true;$('limitBox').hidden=false;var li=$('limitInput');li.value=LIMIT_P.indexOf(setup.limit)<0?setup.limit:'';setTimeout(function(){li.focus();},0);}else{setup.limitCustom=false;setup.limit=v;$('limitBox').hidden=true;}};
  custSeg('segLimit',LIMIT_P,['20','25','30','Tanpa batas'],setup.limit,limCust,pickLim);$('limitBox').hidden=!limCust;if(limCust)$('limitInput').value=setup.limit;
  $('limitInput').oninput=function(){var v=parseInt(String(this.value).replace(/[^0-9]/g,''),10);if(v>=5&&v<=200)setup.limit=v;};
  $('limitInput').onblur=function(){var v=parseInt(String(this.value).replace(/[^0-9]/g,''),10);if(!(v>=5))v=5;if(v>200)v=200;this.value=v;setup.limit=v;};
  seg($('segTheme'),[['politik','Politik'],['santai','Santai']],setup.theme,function(v){setup.theme=v;themeHint();buildHint();});themeHint();
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
function fillNpcs(){var list=charsFor(setup.theme),used=[];for(var i=0;i<setup.count;i++)if(!setup.slots[i].npc&&setup.players[i])used.push(setup.players[i].char);
  var free=shuffleArr(list.filter(function(ch){return used.indexOf(ch.id)<0;}));
  for(var j=0;j<setup.count;j++){var sl=setup.slots[j];if(!sl.npc){if(setup.players[j])setup.players[j]={name:setup.players[j].name,char:setup.players[j].char};continue;}var ch=free.shift()||list[j%list.length];setup.players[j]={name:ch.name,char:ch.id,npc:true,level:sl.level||'sedang'};}
  setup.names=setup.names||[];for(var h=0;h<setup.count;h++)if(!setup.slots[h].npc&&setup.players[h])setup.names[h]=setup.players[h].name;saveSetup();}
function startNewGame(){fillNpcs();var m=Math.max(300000,Math.min(20000000,Math.round((setup.money||1500000)/10000)*10000));newGame({players:setup.players.slice(0,setup.count),turnLimit:setup.limit,money:m,buildMode:setup.build,theme:setup.theme,news:setup.news,passives:setup.passives&&setup.theme==='politik'});enterGame();}
function enterGame(){anim=null;diceRoll=null;cup.phase='idle';FX.take={};FX.build={};FX.collapse=[];FX.forest=null;HAND.key=null;npcReset();$('players').hidden=true;camHome();buildPanels();show('game');refresh();}


/* Politik: fictional disclaimer before every game, button unlocks after 2 s */
function withDisclaimer(theme,fn){if(theme!=='politik')return fn();var d=$('disc'),b=$('discOk');d.hidden=false;b.disabled=true;var t=setTimeout(function(){b.disabled=false;try{b.focus();}catch(e){}},2000);b.onclick=function(){if(b.disabled)return;clearTimeout(t);d.hidden=true;play('tap');fn();};}
