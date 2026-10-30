/* ---------- Chaos: kartu simpan, Opsi Tawar, bocoran berita, Laporan Harta Kekayaan ---------- */
function canAct(p){return S&&p&&!p.npc&&!p.bankrupt&&(S.phase==='turn'||S.phase==='end')&&cup.phase==='idle';}
function extraButtons(ab,p){if(p.npc)return;if(p.hand&&p.hand.length)ab.appendChild(btn('Kartu ('+p.hand.length+')','ghost',openHand,false,'tertutup'));if(!p.pelni)tradeButton(ab,p);}
function tradeButton(ab,p){if(alivePlayers().length<2)return;ab.appendChild(btn(isPol()?'Lobi':'Tawar','ghost',openTrade,false,'tukar kota / uang'));}

/* hand: face down until the owner taps "Buka" (others look away) */
var HAND_UI={open:false};
function openHand(){var p=cur();if(!canAct(p)||!p.hand||!p.hand.length)return;HAND_UI.open=false;$('handSheet').hidden=false;renderHand();}
function closeHand(){$('handSheet').hidden=true;HAND_UI.open=false;}
function renderHand(){var p=cur(),box=$('handBody');box.innerHTML='';$('handTitle').textContent='Kartu simpan · '+p.name;
  if(!HAND_UI.open){var cv=document.createElement('div');cv.className='hand-cover';
    p.hand.forEach(function(){var b=document.createElement('span');b.className='hand-back';b.setAttribute('aria-hidden','true');cv.appendChild(b);});box.appendChild(cv);
    box.appendChild(note('Pastikan lawan nggak ngintip. Penangkal terpakai otomatis saat kamu diserang.'));
    var o=document.createElement('div');o.className='opts';o.appendChild(btn('Buka kartu','',function(){HAND_UI.open=true;renderHand();}));o.appendChild(btn('Tutup','ghost small',closeHand));box.appendChild(o);return;}
  var list=document.createElement('div');list.className='hand-list';
  p.hand.forEach(function(id,ix){var c=handCard(id),el=document.createElement('div');el.className='hand-card k-'+c.k;
    el.innerHTML='<span class="hk">'+(c.k==='tangkal'?'Penangkal':c.k==='serang'?'Serang':'Untung')+'</span><b></b><p></p>';el.querySelector('b').textContent=c.n;el.querySelector('p').textContent=c.d;
    if(c.k==='tangkal'){var a=document.createElement('span');a.className='hauto';a.textContent='Otomatis';el.appendChild(a);}
    else{var ok=handUsable(p,ix),u=btn('Pakai','',function(){closeHand();useHand(ix);refresh();},!ok);if(!ok){var why=p.inJail?'Tidak bisa dipakai saat ditahan':c.jail?'Cuma saat ditahan':S.phase!=='turn'?'Pakai sebelum kocok dadu':'Belum ada target';u.title=why;var sp=document.createElement('span');sp.className='opt-sub';sp.textContent=why;u.appendChild(sp);}el.appendChild(u);}
    list.appendChild(el);});
  box.appendChild(list);var o2=document.createElement('div');o2.className='opts';o2.appendChild(btn('Tutup kartu','ghost',closeHand));box.appendChild(o2);}
function handPrompt(pd,body,opts,OB){var c=handCard(pd.card),p=cur(),cf=document.createElement('div');cf.className='cardface flip '+(c.k==='serang'?'bad':'good');
  cf.innerHTML='<div class="eyebrow">Kartu simpan</div><h3></h3><p></p>';cf.querySelector('h3').textContent=c.n;cf.querySelector('p').textContent=c.d;body.appendChild(cf);
  pd.targets.forEach(function(t){
    if(typeof t==='string'&&t.charAt(0)==='p'){var q=S.players[+t.slice(1)];opts.appendChild(OB(q.name,'red',t,false,'Uang '+fmt(q.money)));}
    else if(c.tg==='sum')opts.appendChild(OB(String(t),'ghost',t,false,'ke '+tileName((p.pos+t)%NT)));
    else{var st=S.tiles[t],own=st&&st.owner!=null?S.players[st.owner].name:'kosong',sub=c.tg==='ahead'?(own==='kosong'?(buyable(t)?'belum ada pemilik':''):own):(c.id==='ambil'?'Bayar '+fmt(Math.round(invested(t)*1.5))+' ke '+own:own+(rentOf(t)?' · sewa '+fmt(rentOf(t)):''));
      opts.appendChild(OB(tileName(t),c.k==='serang'?'red':'ghost',t,false,sub));}});
  opts.appendChild(OB('Batal, simpan kartunya','ghost small','skip'));}

/* trade */
var TR=null;
function openTrade(){var p=cur();if(!canAct(p))return;var al=alivePlayers().filter(function(o){return o.id!==p.id;});TR={from:p.id,to:al[0].id,give:[],get:[],money:0,confirm:false};$('tradeSheet').hidden=false;renderTrade();}
function closeTrade(){$('tradeSheet').hidden=true;TR=null;refresh();}
function trTiles(pid){return ownedTiles(pid).filter(buyable);}
function trTileBtn(i,on,fn){var b=document.createElement('button');b.type='button';b.className='tr-tile'+(on?' on':'');b.setAttribute('aria-pressed',String(on));var st=S.tiles[i];
  b.innerHTML='<b></b><span></span>';b.querySelector('b').textContent=tileName(i);b.querySelector('span').textContent=(T[i].type==='city'?levelName(st.level):T[i].type==='wisata'?TH_().wisataLabel:'Transportasi')+' · '+short(invested(i));
  if(T[i].type==='city')b.style.setProperty('--rc',REGIONS[T[i].region].color);b.onclick=function(){play('tap');fn();};return b;}
function trOrder(){return {from:TR.from,to:TR.to,give:TR.give.slice(),get:TR.get.slice(),money:TR.money};}
function renderTrade(){var a=P(TR.from),b=P(TR.to),box=$('tradeBody');box.innerHTML='';
  $('tradeTitle').textContent=isPol()?'Lobi di belakang panggung':'Tawar-menawar';
  if(TR.confirm){var o=trOrder();box.appendChild(note('Oper iPad ke '+b.name+'. '+a.name+' menawarkan:'));box.appendChild(trSummary(o));
    var op=document.createElement('div');op.className='opts';op.appendChild(btn('Terima, salaman','',function(){if(doTrade(o)){closeTrade();}else{TR.confirm=false;renderTrade();}}));op.appendChild(btn('Tolak','ghost',function(){toast(b.name+' menolak tawaran '+a.name,'bad');closeTrade();}));box.appendChild(op);return;}
  var who=document.createElement('div');who.className='seg tr-who';alivePlayers().forEach(function(q){if(q.id===a.id)return;var x=document.createElement('button');x.type='button';x.textContent=q.name+(q.npc?' (NPC)':'');x.style.setProperty('--pc',q.color);x.setAttribute('aria-pressed',String(q.id===TR.to));x.onclick=function(){play('tap');TR.to=q.id;TR.get=[];renderTrade();};who.appendChild(x);});
  var wl=document.createElement('div');wl.className='tr-row';var lb=document.createElement('span');lb.className='label';lb.textContent='Dengan';wl.appendChild(lb);wl.appendChild(who);box.appendChild(wl);
  var cols=document.createElement('div');cols.className='tr-cols';
  [[a,'Kamu kasih',TR.give],[b,'Kamu minta',TR.get]].forEach(function(c){var col=document.createElement('div');col.className='tr-col';var h=document.createElement('span');h.className='label';h.textContent=c[1]+' ('+c[0].name+')';col.appendChild(h);
    var list=document.createElement('div');list.className='tr-list';var tl=trTiles(c[0].id);if(!tl.length){var e=document.createElement('span');e.className='wallet';e.textContent='Belum punya kota atau aset.';list.appendChild(e);}
    tl.forEach(function(i){var on=c[2].indexOf(i)>=0;list.appendChild(trTileBtn(i,on,function(){var k=c[2].indexOf(i);if(k>=0)c[2].splice(k,1);else c[2].push(i);renderTrade();}));});col.appendChild(list);cols.appendChild(col);});
  box.appendChild(cols);
  var st=scaleAmt(50000),mr=document.createElement('div');mr.className='tr-money';var ml=document.createElement('span');ml.className='label';ml.textContent='Uang';mr.appendChild(ml);
  var mv=document.createElement('output');mv.textContent=TR.money===0?'Rp0':(TR.money>0?'kamu kasih '+fmt(TR.money):'kamu minta '+fmt(-TR.money));
  var minus=btn('−','ghost',function(){TR.money=Math.max(-b.money,TR.money-st);renderTrade();}),plus=btn('+','ghost',function(){TR.money=Math.min(a.money,TR.money+st);renderTrade();});minus.setAttribute('aria-label','Minta uang lebih banyak');plus.setAttribute('aria-label','Kasih uang lebih banyak');
  mr.appendChild(minus);mr.appendChild(mv);mr.appendChild(plus);box.appendChild(mr);
  var o=trOrder(),err=tradeCheck(o),op2=document.createElement('div');op2.className='opts';
  var send=btn(b.npc?'Ajukan ke '+b.name:'Ajukan, lalu oper iPad','',function(){if(b.npc){if(botTradeAccept(o)){doTrade(o);closeTrade();}else{toast(b.name+' menolak. "'+(tradeWinsFor(a.id,o)?'Enak aja, itu bikin kamu monopoli.':'Kurang untung buat saya.')+'"','bad');}}else{TR.confirm=true;renderTrade();}},!!err,err||(b.npc?'NPC menilai untung-ruginya':''));
  op2.appendChild(send);op2.appendChild(btn('Batal','ghost small',closeTrade));box.appendChild(op2);}
function trSummary(o){var d=document.createElement('div');d.className='tr-sum';var nm=function(l){return l.length?l.map(tileName).join(', '):'tidak ada';};
  d.appendChild(facts([[P(o.from).name+' kasih',nm(o.give)+(o.money>0?' + '+fmt(o.money):'')],[P(o.from).name+' minta',nm(o.get)+(o.money<0?' + '+fmt(-o.money):'')]]));return d;}

/* news ticker: what is on now, and the leak for next round */
function updateBocoran(){var el=$('bocoran');if(!el)return;if(!S||!S.chaos||!S.newsEnabled||S.phase==='over'){el.hidden=true;return;}
  var now=[S.news,S.news2].filter(function(n){return n&&n.round===S.round&&!n.void;}).map(function(n){return newsById(n.id).name;});
  var t=(now.length?'Berlaku: '+now.join(' + '):'')+(S.newsNext?(now.length?' · ':'')+'Besok: '+newsById(S.newsNext).name:'');if(el.textContent!==t)el.textContent=t;el.hidden=!t;}

/* Laporan Harta Kekayaan */
function lhkpnRows(){var w=S.winner?S.winner.pid:-1,ps=S.players.slice(),used={},by=function(f){return ps.slice().sort(function(a,b){return f(b)-f(a);});};
  var T_=[[function(p){return p.id===w;},S.theme==='politik'?'Bedebah Terakhir':'Raja Cuan'],
    [function(p){return by(function(q){return q.st?q.st.rentGot:0;})[0]===p&&p.st&&p.st.rentGot>0;},'Raja Pungut Sewa'],
    [function(p){return by(function(q){return q.st?q.st.rentPaid:0;})[0]===p&&p.st&&p.st.rentPaid>0;},'Donatur Tetap'],
    [function(p){return by(function(q){return q.st?q.st.jail:0;})[0]===p&&p.st&&p.st.jail>0;},S.theme==='politik'?'Langganan Rompi Oranye':'Langganan Terdampar'],
    [function(p){var b=ps.filter(function(q){return q.bankrupt;}).sort(function(x,y){return (x.st.outRound||0)-(y.st.outRound||0);})[0];return b===p;},'Pensiun Dini'],
    [function(p){return by(function(q){return ownedTiles(q.id).length;})[0]===p&&ownedTiles(p.id).length>0;},'Tuan Tanah'],
    [function(p){return by(function(q){return q.st?q.st.trades:0;})[0]===p&&p.st&&p.st.trades>0;},'Makelar Lobi'],
    [function(p){return !p.bankrupt;},S.theme==='politik'?'Rakyat Jelata':'Penonton Setia'],
    [function(){return true;},'Korban Keadaan']];
  return ps.sort(function(a,b){return (a.id===w?-1:b.id===w?1:0)||(a.bankrupt-b.bankrupt)||assets(b.id)-assets(a.id);}).map(function(p){var title='';
    for(var k=0;k<T_.length;k++){if(!used[T_[k][1]]&&T_[k][0](p)){title=T_[k][1];if(k<T_.length-2)used[title]=1;break;}}
    var st=p.st||{};return {p:p,title:title,harta:p.bankrupt?0:assets(p.id),kota:ownedTiles(p.id).length,got:st.rentGot||0,paid:st.rentPaid||0,jail:st.jail||0,peak:Math.max(st.maxAssets||0,p.bankrupt?0:assets(p.id))};});}
function renderLhkpn(){var box=$('lhkpn');if(!box)return;box.innerHTML='';var rows=lhkpnRows();
  var h=document.createElement('div');h.className='lh-head';h.innerHTML='<span class="eyebrow">'+(isPol()?'Laporan Harta Kekayaan Penyelenggara Negeri Bedebah':'Laporan Akhir')+'</span>';box.appendChild(h);
  rows.forEach(function(r){var el=document.createElement('div');el.className='lh-row';el.style.setProperty('--pc',r.p.color);
    el.innerHTML='<div class="lh-who"><b></b><i></i></div><dl><dt>Harta</dt><dd></dd><dt>Puncak</dt><dd></dd><dt>Sewa masuk</dt><dd></dd><dt>Sewa keluar</dt><dd></dd><dt>'+(isPol()?'Ditahan':'Terdampar')+'</dt><dd></dd></dl>';
    el.querySelector('b').textContent=r.p.name;el.querySelector('i').textContent=r.title;var dd=el.querySelectorAll('dd');dd[0].textContent=r.p.bankrupt?'Bangkrut':short(r.harta);dd[1].textContent=short(r.peak);dd[2].textContent=short(r.got);dd[3].textContent=short(r.paid);dd[4].textContent=r.jail+'x';box.appendChild(el);});}
function lhkpnImage(cb){var rows=lhkpnRows(),W=1080,H=360+rows.length*190,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  x.fillStyle='#FAFBF8';x.fillRect(0,0,W,H);x.fillStyle='#C8102E';x.fillRect(0,0,W,22);x.fillStyle='#1F2430';x.font='800 30px Nunito, sans-serif';x.fillText(isPol()?'LAPORAN HARTA KEKAYAAN':'LAPORAN AKHIR',60,96);
  x.font='800 64px "Baloo 2", Nunito, sans-serif';x.fillText(isPol()?'Negeri Bedebah':'Kepulauan Cuan',60,170);x.font='700 28px Nunito, sans-serif';x.fillStyle='#5A6270';x.fillText((S.winner?S.winner.how:'')+' · ronde '+S.round,60,220);
  rows.forEach(function(r,k){var y=280+k*190;x.fillStyle='#fff';x.strokeStyle='#C9CDD4';x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(50,y,W-100,166,22):x.rect(50,y,W-100,166);x.fill();x.stroke();x.fillStyle=r.p.color;x.fillRect(50,y,14,166);
    x.fillStyle='#1F2430';x.font='800 44px "Baloo 2", Nunito, sans-serif';x.fillText(r.p.name,90,y+60);x.fillStyle='#C8102E';x.font='800 28px Nunito, sans-serif';x.fillText(r.title,90,y+102);
    x.fillStyle='#1F2430';x.font='800 26px Nunito, sans-serif';x.textAlign='right';x.fillText(r.p.bankrupt?'Bangkrut':short(r.harta),W-80,y+60);x.fillStyle='#5A6270';x.font='700 22px Nunito, sans-serif';
    x.fillText('Sewa masuk '+short(r.got)+' · keluar '+short(r.paid)+' · '+(isPol()?'ditahan ':'terdampar ')+r.jail+'x',W-80,y+140);x.textAlign='left';});
  x.fillStyle='#5A6270';x.font='700 20px Nunito, sans-serif';x.fillText('Semua tokoh fiktif. Kesamaan hanya kebetulan yang menyebalkan.',60,H-30);c.toBlob(cb,'image/png');}
function saveLhkpn(){lhkpnImage(function(blob){if(!blob)return;var f=null;try{f=new File([blob],'laporan-harta.png',{type:'image/png'});}catch(e){}
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Laporan Harta Kekayaan'}).catch(function(){});return;}
  var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='laporan-harta.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove();},2000);});}
