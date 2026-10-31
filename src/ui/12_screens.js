/* ---------- screens ---------- */
var setup={preset:'standar',chaos:false,lastLvl:'sedang',passives:false,theme:'politik',count:3,limit:35,money:3500000,build:'bertahap',news:true,players:[],picking:0,slots:[0,1,2,3,4].map(function(){return {npc:false,level:'sedang'};})};
var SETUP_KEY='kc-setup';
function loadSetup(){try{var o=JSON.parse(localStorage.getItem(SETUP_KEY)||'null');if(!o)return;['preset','lastLvl','passives','theme','count','limit','money','build','news','chaos'].forEach(function(k){if(o[k]!==undefined)setup[k]=o[k];});
  if(o.slots&&o.slots.length)o.slots.forEach(function(sl,i){if(setup.slots[i]&&sl)setup.slots[i]={npc:!!sl.npc,level:['mudah','sedang','sulit','licik'].indexOf(sl.level)>=0?sl.level:'sedang'};});if(o.names)setup.names=o.names;if(setup.preset!=='atur'&&presetOf()==='atur'){setup.preset='standar';var P=PRESETS.standar;for(var f in P)setup[f]=P[f];}}catch(e){}}
function saveSetup(){try{var o={};['preset','lastLvl','passives','theme','count','limit','money','build','news','chaos','slots','names'].forEach(function(k){o[k]=setup[k];});localStorage.setItem(SETUP_KEY,JSON.stringify(o));}catch(e){}}
function humanSlots(){var a=[];for(var i=0;i<setup.count;i++)if(!setup.slots[i].npc)a.push(i);return a;}
var LVL_OPTS=[['mudah','Mudah'],['sedang','Sedang'],['sulit','Sulit'],['licik','Licik']],LVL_STAR={mudah:'★',sedang:'★★',sulit:'★★★',licik:'★★★★'};
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
  var nh=humanSlots().length,nn=setup.count-nh;$('slotHint').textContent=(nh===0?'Semua NPC, kamu tinggal nonton. ':nn===0?nh+' manusia, gantian di satu perangkat. ':nh+' manusia lawan '+nn+' NPC. ')+'Tap calon untuk ganti karakter, nama, atau level.';}
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
var PRESETS={standar:{limit:35,money:3500000,build:'bertahap',news:true,passives:false,chaos:false},kilat:{limit:20,money:1000000,build:'bebas',news:true,passives:false,chaos:false},brutal:{limit:0,money:10000000,build:'bertahap',news:true,passives:true,chaos:false},chaos:{limit:15,money:1500000,build:'bebas',news:true,passives:true,chaos:true}};
var PRESET_INFO={standar:['Standar','Pas buat main pertama. Santai, jarang ada yang bangkrut.'],kilat:['Kilat','Cepat panas, cepat bangkrut.'],brutal:['Brutal','Main sampai tinggal satu calon, atau negaranya yang bubar duluan.'],chaos:['Chaos','Berita tiap ronde, kartu simpan tiap gajian, kas negara tipis. Serampangan.']};
function presetOf(){for(var k in PRESETS){var P=PRESETS[k],ok=true;for(var f in P)if(setup[f]!==P[f])ok=false;if(ok)return k;}return 'atur';}
function curPreset(){return setup.preset==='atur'?'atur':presetOf();}
function fmtJt(v){if(v>=1000000){var j=v/1000000;return 'Rp'+(Math.round(j*10)/10).toString().replace('.',',')+' jt';}return 'Rp'+Math.round(v/1000)+'rb';}
function rondeTxt(l){return l?l+' ronde':'Tanpa batas ronde';}
function chipsOf(P){var a=[rondeTxt(P.limit),'Modal '+fmtJt(P.money),P.build==='bebas'?'Bangun bebas':'Bangun bertahap'];if(P.passives&&setup.theme==='politik')a.push('Pasif karakter nyala');if(P.chaos)a.push('Negara darurat');return a;}
function ruleSummary(){var c=curPreset(),nm=c==='atur'?'Atur sendiri':PRESET_INFO[c][0];return nm+' · '+rondeTxt(setup.limit)+' · '+fmtJt(setup.money)+(setup.chaos&&c==='atur'?' · Chaos':'');}
function stageTitle(){$('stageTitle').textContent=setup.theme==='politik'?'DEBAT CALON NEGERI BEDEBAH':'PANGGUNG PESERTA';}
/* step 1: rules as four big cards; "Atur sendiri" opens the RUU screen */
function renderRules(){var g=$('presetGrid'),cur=curPreset();g.innerHTML='';
  seg($('segTheme'),[['politik','Politik'],['santai','Santai']],setup.theme,function(v){setup.theme=v;renderRules();});
  $('themeHint').textContent=THEMES[setup.theme].tag;
  ['standar','kilat','brutal','chaos','atur'].forEach(function(k){var b=document.createElement('button');b.type='button';b.className='preset-card'+(k==='atur'?' atur':'')+(k==='chaos'?' chaos':'');b.setAttribute('aria-pressed',String(cur===k));
    var t=document.createElement('span');t.className='pc-t';t.textContent=k==='atur'?'Atur sendiri':PRESET_INFO[k][0];b.appendChild(t);
    var ch=document.createElement('span');ch.className='pc-chips';var list=k==='atur'?(cur==='atur'?chipsOf(setup):[]):chipsOf(PRESETS[k]);list.forEach(function(x){var c=document.createElement('span');c.textContent=x;ch.appendChild(c);});if(list.length)b.appendChild(ch);
    var d=document.createElement('span');d.className='pc-d';d.textContent=k==='atur'?(setup.theme==='politik'?'Tulis RUU aturan mainmu sendiri: ronde, modal, cara bangun, berita, pasif.':'Tulis aturan mainmu sendiri: ronde, modal, cara bangun, berita.'):PRESET_INFO[k][1];b.appendChild(d);
    b.onclick=function(){play('tap');if(k==='atur'){setup.preset='atur';openRuu();return;}setup.preset=k;var P=PRESETS[k];for(var f in P)setup[f]=P[f];renderRules();};
    g.appendChild(b);});}
function goRules(){renderRules();show('rules');}
function goLobby(){saveSetup();syncCount();renderSlots();stageTitle();$('ruleChip').querySelector('b').textContent=ruleSummary();show('lobby');}
/* RUU: every rule is a sentence; the red words are buttons */
var RUU_POP=null;
function openRuu(){renderRuu();show('ruu');}
function blank(txt,key){return '<button type="button" class="blank" data-k="'+key+'">'+txt+'</button>';}
function renderRuu(){var pol=setup.theme==='politik',L=THEMES[setup.theme].levels,news=THEMES[setup.theme].newsName;
  $('ruuKicker').textContent=pol?'RANCANGAN UNDANG-UNDANG':'BUKU ATURAN';$('ruuTitle').textContent=pol?'Tentang Aturan Main':'Aturan Main';$('ruuNo').textContent=pol?'LEMBARAN NEGERI BEDEBAH · NO. 1':'';
  var P=pol?'Pasal ':'Aturan ',h='';
  h+='<li><b>'+P+'1.</b> Permainan berlangsung '+(setup.limit?'selama ':'')+blank(setup.limit?setup.limit+' ronde':'tanpa batas ronde','limit')+'.</li>';
  h+='<li><b>'+P+'2.</b> Setiap '+(pol?'calon':'pemain')+' menerima modal '+(pol?'kampanye ':'')+blank(fmtJt(setup.money),'money')+'.</li>';
  h+='<li><b>'+P+'3.</b> Pembangunan dilakukan secara '+blank(setup.build,'build')+(setup.build==='bebas'?', boleh langsung sampai '+L[2]+'.':', naik satu level tiap kunjungan.')+'</li>';
  h+='<li><b>'+P+'4.</b> '+news+' '+blank(setup.news?(pol?'diberlakukan':'nyala'):(pol?'dihapus':'mati'),'news')+(setup.news?' tiap 3 ronde':'')+(pol?', dan kemampuan pasif karakter '+blank(setup.passives?'diberlakukan':'dihapus','passives'):'')+'.</li>';
  h+='<li><b>'+P+'5.</b> '+(pol?'Negara dalam keadaan ':'Suasana ')+blank(setup.chaos?(pol?'darurat':'kacau'):'normal','chaos')+(setup.chaos?': berita tiap ronde, kartu simpan tiap gajian, kas '+(pol?'negara ':'')+'menipis.':'.')+'</li>';
  $('pasalList').innerHTML=h;
  [].forEach.call($('pasalList').querySelectorAll('.blank'),function(b){b.onclick=function(e){e.stopPropagation();play('tap');var k=b.dataset.k;
    if(k==='build'){setup.build=setup.build==='bebas'?'bertahap':'bebas';closePop();renderRuu();}
    else if(k==='news'){setup.news=!setup.news;closePop();renderRuu();}
    else if(k==='passives'){setup.passives=!setup.passives;closePop();renderRuu();}
    else if(k==='chaos'){setup.chaos=!setup.chaos;if(setup.chaos)setup.news=true;closePop();renderRuu();}
    else openPop(k,b);};});
  var long=(setup.limit===0||setup.limit>60)&&setup.money>=20000000;$('ruuWarn').hidden=!long;if(long)$('ruuWarn').textContent='Modal sebesar ini tanpa batas ronde bisa main lebih dari 2 jam.';
  if(RUU_POP){var b2=$('pasalList').querySelector('.blank[data-k="'+RUU_POP+'"]');if(b2){b2.classList.add('on');placePop(b2);}}}
function closePop(){RUU_POP=null;$('ruuPop').hidden=true;}
function placePop(b){var pop=$('ruuPop'),sh=pop.parentNode,r=b.getBoundingClientRect(),R=sh.getBoundingClientRect();pop.hidden=false;var w=pop.offsetWidth;var x=Math.max(12,Math.min(R.width-w-12,r.left-R.left));pop.style.left=x+'px';pop.style.top=(r.bottom-R.top+sh.scrollTop+10)+'px';}
var RONDE_P=[[20,'20'],[25,'25'],[35,'35'],[50,'50'],[0,'Tanpa batas']],MODAL_P=[[1000000,'1 jt'],[3500000,'3,5 jt'],[10000000,'10 jt'],[100000000,'100 jt']];
function stepMoney(v,d){var st=v<5000000?500000:v<20000000?1000000:v<50000000?5000000:10000000;if(d<0&&v<=5000000&&v>500000)st=500000;return Math.max(500000,Math.min(100000000,v+d*st));}
function openPop(k,b){RUU_POP=k;var pop=$('ruuPop'),isL=k==='limit';
  pop.innerHTML='<span class="label">'+(isL?'Jumlah ronde':'Modal per '+(setup.theme==='politik'?'calon':'pemain'))+'</span><div class="seg" id="popSeg"></div><div class="stepper"><button type="button" class="btn ghost" id="popMinus" aria-label="Kurangi">−</button><output id="popVal"></output><button type="button" class="btn ghost" id="popPlus" aria-label="Tambah">+</button></div><span class="wallet">'+(isL?'5 sampai 200 ronde, atau tanpa batas.':'Rp500rb sampai Rp100 jt.')+' Tap di luar untuk menutup.</span>';
  var val=function(){return isL?setup.limit:setup.money;},paint=function(){$('popVal').textContent=isL?(setup.limit?setup.limit:'∞'):fmtJt(setup.money);seg($('popSeg'),isL?RONDE_P:MODAL_P,val(),function(v){if(isL)setup.limit=v;else setup.money=v;renderRuu();paint();});};
  $('popMinus').onclick=function(){if(isL)setup.limit=setup.limit===0?200:Math.max(5,setup.limit-5);else setup.money=stepMoney(setup.money,-1);renderRuu();paint();};
  $('popPlus').onclick=function(){if(isL)setup.limit=setup.limit===0?0:(setup.limit>=200?0:setup.limit+5);else setup.money=stepMoney(setup.money,1);renderRuu();paint();};
  paint();renderRuu();}
function show(id){['splash','rules','ruu','lobby','pick','game'].forEach(function(s){$(s).hidden=s!==id;});if(id==='game')setTimeout(layout,0);syncMusic();}
function seg(el,opts,val,onPick){el.innerHTML='';opts.forEach(function(o){var b=document.createElement('button');b.type='button';b.textContent=o[1];b.setAttribute('aria-pressed',String(o[0]===val));b.onclick=function(){play('tap');onPick(o[0]);seg(el,opts,o[0],onPick);};el.appendChild(b);});}
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
function startNewGame(){fillNpcs();var m=Math.max(300000,Math.min(100000000,Math.round((setup.money||3500000)/10000)*10000));newGame({players:setup.players.slice(0,setup.count),turnLimit:setup.limit,money:m,buildMode:setup.build,theme:setup.theme,news:setup.news,chaos:!!setup.chaos,passives:setup.passives&&setup.theme==='politik'});enterGame();}
function enterGame(){anim=null;diceRoll=null;cup.phase='idle';FX.take={};FX.build={};FX.collapse=[];FX.forest=null;HAND.key=null;npcReset();$('players').hidden=true;camHome();buildPanels();show('game');refresh();}


/* Politik: fictional disclaimer before every game, button unlocks after 2 s */
function withDisclaimer(theme,fn){if(theme!=='politik')return fn();var d=$('disc'),b=$('discOk');d.hidden=false;b.disabled=true;var t=setTimeout(function(){b.disabled=false;try{b.focus();}catch(e){}},2000);b.onclick=function(){if(b.disabled)return;clearTimeout(t);d.hidden=true;play('tap');fn();};}
