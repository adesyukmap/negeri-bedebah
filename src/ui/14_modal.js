var LV=new Proxy([], {get:function(_,k){return levelName(+k);}});
/* ---------- action bar + modals ---------- */
function btn(label,cls,fn,disabled,sub){var b=document.createElement('button');b.type='button';b.className='btn '+(cls||'');b.textContent=label;if(sub){var s=document.createElement('span');s.className='opt-sub';s.textContent=sub;b.appendChild(s);}b.disabled=!!disabled;b.onclick=function(){audioUnlock();play('tap');fn();};return b;}
function act(fn){return function(){fn();refresh();};}
function refresh(){
  if(!S)return; updatePanels(); syncMusic();
  var ab=$('actionbar');ab.innerHTML='';var p=cur();
  if(typeof cineBusy==='function'&&cineBusy()){$('handoff').hidden=true;return;}
  $('handoff').hidden=S.phase!=='handoff';
  if(S.phase==='handoff'){var hk=S.round+':'+S.current;if(window._lastHand!==hk){window._lastHand=hk;setTimeout(function(){play('voice:'+cur().char);},350);}$('hoName').textContent='Giliran '+p.name+'!';$('hoRound').textContent=S.turnLimit?('Ronde '+S.round+' dari '+S.turnLimit):('Ronde '+S.round);requestAnimationFrame(function(){portrait($('hoFace'),p.char,p.color);});}
  if(S.phase==='turn'){
    if(p.pelni){var h=document.createElement('div');h.className='hint';h.textContent=(isPol()?'Gorong-gorong':'Kapal Pelni')+': tap tile tujuan '+p.name;ab.appendChild(h);}
    else{if(cup.phase==='idle'||cup.phase==='shake')ab.appendChild(shakeBtn(p.inJail?(isPol()?'Ikuti masa tahanan':'Kocok, cari double'):'Tahan untuk kocok',p.inJail?(isPol()?'kocok, double = bebas · sisa '+(3-p.jailTurns)+' giliran':'sisa '+(3-p.jailTurns)+' giliran'):null));
      if(p.inJail&&cup.phase==='idle'){if(!p.appealed)ab.appendChild(btn(isPol()?'Banding '+short(APPEAL_FEE):'Minta jemput '+short(APPEAL_FEE),'ghost',act(payAppeal),p.money<APPEAL_FEE,'50% bebas'));ab.appendChild(btn((isPol()?'Sogok hakim ':'Bayar ')+short(jailFee()),'ghost',act(payJail),p.money<jailFee(),'pasti bebas'));}}
  }
  if(S.phase==='end')ab.appendChild(btn(p.bankrupt?'Lanjut':'Selesai','',act(endTurn)));
  renderModal();
  if(S.phase==='over')showResult(); else $('result').hidden=true;
}
function facts(rows){var dl=document.createElement('dl');dl.className='facts';rows.forEach(function(r){var dt=document.createElement('dt');dt.textContent=r[0];var dd=document.createElement('dd');dd.textContent=r[1];dl.appendChild(dt);dl.appendChild(dd);});return dl;}
function preview(i,lvl){var cvp=document.createElement('canvas');requestAnimationFrame(function(){var w=cvp.clientWidth||150,h=cvp.clientHeight||130,d=Math.min(3,window.devicePixelRatio||1);cvp.width=w*d;cvp.height=h*d;var c=cvp.getContext('2d');c.setTransform(d,0,0,d,0,0);
  var sv=[g,GD,TW,TH,DZ,ZS,OX,OY];g=c;GD=d;TW=w*0.66;TH=TW/2;DZ=TH*0.3;ZS=TW*0.61;var cu=2,cvv=2;OX=w/2;OY=h*0.78-(cu+cvv)*TH/2;
  var col=tileColors(i),t=T[i],own=S.tiles[i].owner!==null?S.players[S.tiles[i].owner].color:cur().color;
  box(cu,cvv,1.05,1.05,DZ,0,col.top,col.side);
  if(t.type==='wisata'){(isPol()?decoWisataPol:decoWisata)(t.deco,cu,cvv,DZ,performance.now());if(S.tiles[i].owner!==null)wisataGate(cu,cvv,DZ,own,'u');}
  else if(t.type==='city')building(i,cu,cvv,DZ,lvl,own);
  else{var tmp=ZN[i];ZN[i]={bu:cu,bv:cvv,corner:!!tmp.corner};var tr=RECT[i];RECT[i]=mkRect(cu-0.6,cu+0.6,cvv-0.6,cvv+0.6,tr.side);decoTile(i,DZ,performance.now());ZN[i]=tmp;RECT[i]=tr;}
  g=sv[0];GD=sv[1];TW=sv[2];TH=sv[3];DZ=sv[4];ZS=sv[5];OX=sv[6];OY=sv[7];});return cvp;}
function modalHead(i,eyebrow,title,lvl){var top=document.createElement('div');top.className='modal-top';top.appendChild(preview(i,lvl));var tx=document.createElement('div');tx.style.minWidth='0';
  var eb=document.createElement('div');eb.className='eyebrow';eb.textContent=eyebrow;eb.style.color=T[i].type==='city'?shade(REGIONS[T[i].region].color,-0.25):'#2C7A55';tx.appendChild(eb);var h=document.createElement('h2');h.textContent=title;tx.appendChild(h);top.appendChild(tx);return top;}
function wallet(){var w=document.createElement('div');w.className='wallet';w.innerHTML='Uang '+escapeHtml(cur().name)+': <b>'+fmt(cur().money)+'</b>';return w;}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function note(text){var w=document.createElement('div');w.className='wallet';w.textContent=text;return w;}
function renderModal(){
  var m=$('modal'),body=$('modalBody');
  if(S.phase!=='prompt'){if(!detailOpen)m.hidden=true;return;}
  if(fxHold(performance.now())){m.hidden=true;return;}
  var mk=S.round+':'+S.current+':'+JSON.stringify(S.pending),nw=performance.now();if(mk!==renderModal.key){renderModal.key=mk;var dl=(S.pending.type==='card'?600:1000)/(typeof SPEED!=='undefined'?SPEED:1);renderModal.at=nw+dl;setTimeout(refresh,dl+20);}
  if(nw<renderModal.at){m.hidden=true;return;}
  m.classList.toggle('compact',S.pending.type!=='card'&&S.pending.type!=='festival');
  detailOpen=false;m.hidden=false;body.innerHTML='';var pd=S.pending,p=cur(),i=pd.tile,opts=document.createElement('div');opts.className='opts';
  var C=function(o){return act(function(){choose(o);});};
  if(pd.type==='buy'){var L=tileL(i);body.appendChild(modalHead(i,REGIONS[T[i].region].name,(isPol()?'Ambil ':'Beli ')+tileName(i)+'?',stepMode()?0:4));
    body.appendChild(facts([['Harga tanah',fmt(L)],['Landmark',T[i].landmark]]));
    buyOptions({money:Infinity},i).forEach(function(l){var cost=buyCost(i,l);opts.appendChild(btn(l===0?(isPol()?'Urus ':'Beli ')+LV[0]:'Beli + '+LV[l],(l===2||stepMode())?'':'ghost',C(l),p.money<cost,'Bayar '+fmt(cost)+' · sewa '+fmt(L*RENTM[l])));});
    if(stepMode())opts.appendChild(note('Mode Bertahap: '+LV[1]+' dibangun di kunjungan berikutnya.'));
    if(newsOn('diskon'))opts.appendChild(note('Lagi diskon 30% dari '+TH_().newsName+'!'));
    opts.appendChild(btn('Lewat dulu','ghost small',C('skip')));}
  if(pd.type==='upgrade'){var st=S.tiles[i],L2=tileL(i);body.appendChild(modalHead(i,REGIONS[T[i].region].name,'Bangun di '+tileName(i),Math.min(4,st.level+1)));
    body.appendChild(facts([['Sekarang',LV[st.level]],['Sewa sekarang',fmt(cityRent(i))]]));
    var lv=st.level<3?[1,2,3].filter(function(l){return l>st.level&&(!stepMode()||l===st.level+1);}):[4];
    lv.forEach(function(l){var cost=upCost(i,l),ok=l<4||p.laps>=1;opts.appendChild(btn(l===4?('Bangun '+LV[4]+': '+T[i].landmark):(stepMode()?'Bangun ':'Sampai ')+LV[l],l===4||stepMode()?'':'ghost',C(l),!ok||p.money<cost,ok?('Bayar '+fmt(cost)+' · sewa dasar '+fmt(L2*RENTM[l])):'Harus lewat Start sekali dulu'));});
    if(st.level===3&&p.laps<1)opts.appendChild(note('Landmark terbuka setelah lewat Start sekali.'));
    opts.appendChild(btn('Nanti aja','ghost small',C('skip')));}
  if(pd.type==='takeover'){var st2=S.tiles[i],pr=takeoverPrice(i);body.appendChild(modalHead(i,isPol()?'Penggusuran':'Takeover',(isPol()?'Gusur ':'Ambil alih ')+tileName(i)+'?',st2.level));
    body.appendChild(facts([['Pemilik',S.players[st2.owner].name],['Bangunan',LV[st2.level]],['Harga takeover',fmt(pr)]]));
    opts.appendChild(btn(isPol()?'GUSUR!':'TAKEOVER!','red',C('yes'),p.money<pr,'Bayar '+fmt(pr)+' ke '+S.players[st2.owner].name));opts.appendChild(btn('Nggak dulu','ghost small',C('no')));}
  if(pd.type==='buywis'){var ty=T[i].type,wl=ty==='wisata'?TH_().wisataLabel:ty==='transport'?'Transportasi':'Utilitas',pr2=assetPrice(i);body.appendChild(modalHead(i,wl,'Ambil '+tileName(i)+'?',0));
    body.appendChild(facts(ty==='wisata'?[['Harga',fmt(pr2)],['Sewa','1 '+wl.toLowerCase()+' 50rb · 2: 150rb · 3: 400rb'],['Bonus','Punya 4 '+wl.toLowerCase()+' langsung menang']]:ty==='transport'?[['Harga',fmt(pr2)],['Sewa','1: 25rb · 2: 50rb · 3: 100rb · 4: 200rb']]:[['Harga',fmt(pr2)],['Sewa','Angka dadu x5rb, punya PLN dan PDAM jadi x12rb']]));
    opts.appendChild(btn('Ambil '+tileName(i),'',C('yes'),p.money<pr2,'Bayar '+fmt(pr2)));opts.appendChild(btn('Lewat dulu','ghost small',C('no')));}
  if(pd.type==='festival'){body.appendChild(modalHead(IDX.fest,tileName(IDX.fest),isPol()?'Kampanye di kota mana?':'Pilih kota yang dirayakan',0));
    body.appendChild(note('Kota yang sama dirayakan lagi: x2 jadi x3, lalu x4. Total kelipatan sewa maksimal x6.'));
    ownedCities(p.id).forEach(function(ci){var same=S.festival===ci,lvlNow=S.festLevel||2,next=same?Math.min(4,lvlNow+1):2,now=cityRent(ci),base=tileL(ci)*RENTM[S.tiles[ci].level]*(regionFull(p.id,T[ci].region)?2:1),after=tileL(ci)*RENTM[S.tiles[ci].level]*Math.min(6,(regionFull(p.id,T[ci].region)?2:1)*next);
      opts.appendChild(btn(same?(tileName(ci)+' · naikkan ke x'+next):tileName(ci),same?'':'ghost',C(ci),same&&lvlNow>=4,same&&lvlNow>=4?'Sudah maksimal x4':('Sewa '+fmt(now)+' jadi '+fmt(after))));});
    opts.appendChild(btn('Lewat','ghost small',C('skip')));}
  if(pd.type==='pelni'){body.appendChild(modalHead(IDX.pelni,tileName(IDX.pelni),isPol()?'Blusukan?':'Naik kapal?',0));
    body.appendChild(note('Bayar '+fmt(PELNI_FEE)+'. Giliran berikutnya kamu bebas pilih tile tujuan. Lewat Start tetap dapat gaji.'));
    opts.appendChild(btn(isPol()?'Blusukan!':'Naik kapal','',C('yes'),p.money<PELNI_FEE));opts.appendChild(btn('Nggak usah','ghost small',C('no')));}
  if(pd.type==='card'){var dk=pd.deck||'chance',cd=TH_()[dk][pd.card],cf=document.createElement('div');cf.className='cardface flip '+(dk==='dana'?'dana ':'')+(cd.kind==='good'?'good':cd.kind==='bad'?'bad':'');
    cf.innerHTML='<div class="eyebrow">'+escapeHtml(dk==='dana'?TH_().danaName:TH_().chanceName)+'</div><h3>'+escapeHtml(cd.name)+'</h3><p>'+escapeHtml(cd.text)+'</p>';body.appendChild(cf);opts.appendChild(btn('Oke','',C('ok')));}
  body.appendChild(wallet());body.appendChild(opts);
}
var detailOpen=false;
function openDetail(i){
  if(S.phase==='prompt'||S.phase==='moving'||S.phase==='over')return;
  var t=T[i],st=S.tiles[i],m=$('modal'),body=$('modalBody');body.innerHTML='';detailOpen=true;m.hidden=false;m.classList.remove('compact');
  if(t.type==='city'){body.appendChild(modalHead(i,REGIONS[t.region].name,t.name,st.owner!==null?st.level:4));
    var rows=[['Pemilik',st.owner!==null?S.players[st.owner].name:'Belum ada'],['Landmark',t.landmark]];
    if(st.owner!==null){rows.push(['Bangunan',LV[st.level]],['Sewa sekarang',fmt(cityRent(i))]);if(S.festival===i)rows.push([tileName(IDX.fest),'x'+(S.festLevel||2)]);if(st.level<4)rows.push(['Harga takeover',fmt(takeoverPrice(i))]);}
    rows.push(['Sewa per level',RENTM.map(function(r){return short(tileL(i)*r);}).join(' · ')]);body.appendChild(facts(rows));}
  else if(t.type==='transport'||t.type==='utility'){body.appendChild(modalHead(i,t.type==='transport'?'Transportasi':'Utilitas',tileName(i),0));body.appendChild(facts([['Pemilik',st.owner!==null?S.players[st.owner].name:'Belum ada'],['Harga',fmt(assetPrice(i))],['Sewa',t.type==='transport'?'1: 25rb · 2: 50rb · 3: 100rb · 4: 200rb':'Angka dadu x5rb, punya dua jadi x12rb']]));}
  else if(t.type==='wisata'){body.appendChild(modalHead(i,TH_().wisataLabel,tileName(i),0));body.appendChild(facts([['Pemilik',st.owner!==null?S.players[st.owner].name:'Belum ada'],['Harga',fmt(WIS_PRICE)],['Sewa sekarang',st.owner!==null?fmt(wisRent(i)):'-']]));}
  else{var pol=isPol(),info={start:(pol?'Gajian pejabat: ':'')+'Lewat atau mendarat di sini dapat gaji '+fmt(salaryAmt())+'.',jail:(pol?'Mendarat di sini langsung kena OTT dan ditahan maksimal 3 giliran. Pilih: ikuti masa tahanan (kocok, double = bebas), banding '+fmt(APPEAL_FEE)+' (50% bebas), atau sogok hakim '+fmt(jailFee())+' (pasti bebas).':'Mendarat di sini bikin terdampar maksimal 3 giliran. Keluar dengan double atau bayar '+fmt(jailFee())+'.'),festival:'Pilih satu kotamu, sewanya jadi x2. Rayakan kota yang sama lagi untuk x3 dan x4.',pelni:pol?'Bayar '+fmt(PELNI_FEE)+', giliran berikutnya blusukan lewat gorong-gorong ke tile mana saja.':'Bayar '+fmt(PELNI_FEE)+', giliran berikutnya bebas pilih tujuan.',chance:'Ambil satu kartu '+TH_().chanceName+'. Bisa untung, bisa buntung.',dana:'Ambil satu kartu '+TH_().danaName+'.',tax:'Bayar 10% dari total nilai propertimu. Uangnya masuk '+TH_().kasName+'.',parkir:'Tukang parkir dadakan minta Rp2.000 per langkah dadumu. Uangnya masuk '+TH_().kasName+'.'}[t.type];
    body.appendChild(modalHead(i,'Tile spesial',tileName(i),0));body.appendChild(note(info));}
  var o=document.createElement('div');o.className='opts';o.appendChild(btn('Tutup','ghost',function(){detailOpen=false;m.hidden=true;}));body.appendChild(o);
}
function showResult(){
  var r=$('result');if(!r.hidden)return;r.hidden=false;var w=S.players[S.winner.pid];
  $('resHow').textContent=S.winner.how;$('resName').textContent=w.name+' jadi Raja Cuan!';requestAnimationFrame(function(){portrait($('resFace'),w.char,w.color);});
  var list=$('resList');list.innerHTML='';
  S.players.slice().sort(function(a,b){return (a.id===w.id?-1:b.id===w.id?1:0)||(a.bankrupt-b.bankrupt)||assets(b.id)-assets(a.id);}).forEach(function(p,k){
    var row=document.createElement('div');row.className='result-row';row.innerHTML='<b>'+(k+1)+'</b><canvas></canvas><span>'+escapeHtml(p.name)+'</span><b>'+(p.bankrupt?'Bangkrut':fmt(assets(p.id)))+'</b>';list.appendChild(row);
    var c=row.querySelector('canvas');requestAnimationFrame(function(){portrait(c,p.char,p.color);});});
}


function shakeBtn(label,sub){var b=document.createElement('button');b.type='button';b.className='btn shake';b.textContent=label;if(sub){var sp=document.createElement('span');sp.className='opt-sub';sp.textContent=sub;b.appendChild(sp);}
  var down=function(e){e.preventDefault();audioUnlock();cupStart();b.classList.add('held');},up=function(e){e.preventDefault();b.classList.remove('held');cupRelease();};
  b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',function(e){if(cup.phase==='shake')up(e);});
  b.addEventListener('keydown',function(e){if((e.key===' '||e.key==='Enter')&&cup.phase==='idle'){e.preventDefault();cupStart();cupRelease();}});return b;}
