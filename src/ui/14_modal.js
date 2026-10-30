var LV=new Proxy([], {get:function(_,k){return levelName(+k);}});
/* ---------- action bar + modals ---------- */
function btn(label,cls,fn,disabled,sub){var b=document.createElement('button');b.type='button';b.className='btn '+(cls||'');b.textContent=label;if(sub){var s=document.createElement('span');s.className='opt-sub';s.textContent=sub;b.appendChild(s);}b.disabled=!!disabled;b.onclick=function(){audioUnlock();play('tap');fn();};return b;}
function act(fn){return function(){fn();refresh();};}
function refresh(){
  if(!S)return; updatePanels(); syncMusic();
  var ab=$('actionbar');ab.innerHTML='';var p=cur();
  if(typeof cineBusy==='function'&&cineBusy())return;
  $('modal').classList.toggle('npcturn',!!p.npc);
  if(p.npc&&(S.phase==='turn'||S.phase==='end')){var nh=document.createElement('div');nh.className='hint npc';nh.textContent=p.name+' (NPC) '+(p.pelni?'lagi milih tujuan...':S.phase==='end'?'selesai':'lagi mikir...');ab.appendChild(nh);}
  else if(S.phase==='turn'){
    if(p.pelni){var h=document.createElement('div');h.className='hint';h.textContent=(isPol()?'Gorong-gorong':'Kapal Pelni')+': tap tile tujuan '+p.name;ab.appendChild(h);}
    else{if(cup.phase==='idle'||cup.phase==='shake')ab.appendChild(shakeBtn(p.inJail?(isPol()?'Ikuti masa tahanan':'Kocok, cari double'):'Tahan untuk kocok',p.inJail?(isPol()?'kocok, double = bebas · sisa '+(jailMax(p)-p.jailTurns)+' giliran':'sisa '+(jailMax(p)-p.jailTurns)+' giliran'):null));
      if(p.inJail&&cup.phase==='idle'){if(!p.appealed)ab.appendChild(btn(isPol()?'Banding '+short(appealFee()):'Minta jemput '+short(appealFee()),'ghost',act(payAppeal),p.money<appealFee(),(hasP(p,'taro')?'75%':'50%')+' bebas'));ab.appendChild(btn((isPol()?'Sogok hakim ':'Bayar ')+short(jailFee()),'ghost',act(payJail),p.money<jailFee(),'pasti bebas'));}
      if(cup.phase==='idle')extraButtons(ab,p);
      if(!p.inJail&&p.nuke>0&&cup.phase==='idle'){var ntg=nukeTargets(p);ab.appendChild(btn('\u2622 Pakai nuklir'+(p.nuke>1?' ('+p.nuke+')':''),'red',act(useNuke),!ntg.length,ntg.length?ntg.length+' target':'belum ada target'));}}
  }
  else if(S.phase==='end'){ab.appendChild(btn(p.bankrupt?'Lanjut':'Selesai','',act(endTurn)));if(!p.bankrupt&&!p.npc)tradeButton(ab,p);}
  updateBocoran();
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
  var mk=S.round+':'+S.current+':'+JSON.stringify(S.pending),nw=performance.now();if(mk!==renderModal.key){renderModal.key=mk;var dl=(S.pending.type==='card'?450:450)/(typeof SPEED!=='undefined'?SPEED:1);renderModal.at=nw+dl;setTimeout(refresh,dl+20);}
  if(nw<renderModal.at){m.hidden=true;return;}
  var compact=S.pending.type!=='card'&&S.pending.type!=='festival'&&S.pending.type!=='nuke'&&S.pending.type!=='hand';m.classList.toggle('compact',compact);
  if(m.hidden||renderModal.shownKey!==mk){renderModal.shownKey=mk;renderModal.visAt=nw;if(compact)placeCard(m);if(S.pending.type==='card'&&typeof vo==='function'){var vc=TH_()[S.pending.deck||'chance'][S.pending.card];if(vc)vo('card_'+S.theme+'_'+slug(vc.name));}}
  detailOpen=false;m.hidden=false;body.innerHTML='';var pd=S.pending,p=cur(),i=pd.tile,opts=document.createElement('div');opts.className='opts';
  var C=function(o){return act(function(){if(cur().npc&&!NPC.choosing)return;choose(o);});};
  var OB=function(label,cls,o,dis,sub){var b=btn(label,cls,C(o),dis,sub);b.dataset.opt=String(o);return b;};
  if(pd.type==='buy'){var L=tileL(i);body.appendChild(modalHead(i,REGIONS[T[i].region].name,(isPol()?'Ambil ':'Beli ')+tileName(i)+'?',stepMode()?0:4));
    body.appendChild(facts([['Harga tanah',fmt(L)],['Landmark',T[i].landmark]]));
    buyOptions({money:Infinity},i).forEach(function(l){var cost=buyCost(i,l);opts.appendChild(OB(l===0?(isPol()?'Urus ':'Beli ')+LV[0]:'Beli + '+LV[l],(l===2||stepMode())?'':'ghost',l,p.money<cost,'Bayar '+fmt(cost)+taxSub(cost)+' · sewa '+fmt(L*RENTM[l])));});
    if(stepMode())opts.appendChild(note('Mode Bertahap: '+LV[1]+' dibangun di kunjungan berikutnya.'));
    if(newsOn('diskon'))opts.appendChild(note('Lagi diskon 30% dari '+TH_().newsName+'!'));
    opts.appendChild(OB('Lewat dulu','ghost small','skip'));}
  if(pd.type==='upgrade'){var st=S.tiles[i],L2=tileL(i);body.appendChild(modalHead(i,REGIONS[T[i].region].name,'Bangun di '+tileName(i),Math.min(4,st.level+1)));
    body.appendChild(facts([['Sekarang',LV[st.level]],['Sewa sekarang',fmt(cityRent(i))]]));
    var lv=st.level<3?[1,2,3].filter(function(l){return l>st.level&&(!stepMode()||l===st.level+1);}):[4];
    lv.forEach(function(l){var cost=upCost(i,l),ok=l<4||p.laps>=1;opts.appendChild(OB(l===4?('Bangun '+LV[4]+': '+T[i].landmark):(stepMode()?'Bangun ':'Sampai ')+LV[l],l===4||stepMode()?'':'ghost',l,!ok||p.money<cost,ok?('Bayar '+fmt(cost)+taxSub(cost)+' · sewa dasar '+fmt(L2*RENTM[l])):'Harus lewat Start sekali dulu'));});
    if(st.level===3&&p.laps<1)opts.appendChild(note('Landmark terbuka setelah lewat Start sekali.'));
    opts.appendChild(OB('Nanti aja','ghost small','skip'));}
  if(pd.type==='takeover'){var st2=S.tiles[i],pr=takeoverPrice(i);body.appendChild(modalHead(i,isPol()?'Penggusuran':'Takeover',(isPol()?'Gusur ':'Ambil alih ')+tileName(i)+'?',st2.level));
    if(pd.rent>0){var rn=note('Sewa '+fmt(pd.rent)+' sudah dibayar ke '+S.players[pd.owner!=null?pd.owner:st2.owner].name+'.');rn.className='wallet rentpaid';body.appendChild(rn);}
    body.appendChild(facts([['Pemilik',S.players[st2.owner].name],['Bangunan',LV[st2.level]],['Harga takeover',fmt(pr)]]));
    opts.appendChild(OB(isPol()?'GUSUR!':'TAKEOVER!','red','yes',p.money<pr,'Bayar '+fmt(pr)+' ke '+S.players[st2.owner].name+taxSub(pr)));if(pd.swap!=null)opts.appendChild(OB('Pindah Kubu: tukar dengan '+tileName(pd.swap),'','swap',false,'Pasif El Slepet, sekali per game'));opts.appendChild(OB('Nggak dulu','ghost small','no',false,pd.rent>0?'Cukup bayar sewa':null));}
  if(pd.type==='buywis'){var ty=T[i].type,isTr=ty==='transport',wl=isTr?'Transportasi':TH_().wisataLabel,pr2=assetPrice(i);body.appendChild(modalHead(i,wl,'Ambil '+tileName(i)+'?',0));
    body.appendChild(facts(isTr?[['Harga',fmt(pr2)],['Sewa',rentLadder(typeof TRANS_RENT!=='undefined'?TRANS_RENT:[0,25000,50000,100000,200000])]]:[['Harga',fmt(pr2)],['Sewa',rentLadder(WIS_RENT)],['Bonus','Punya '+wisWin()+' '+wl.toLowerCase()+' langsung menang']]));
    opts.appendChild(OB('Ambil '+tileName(i),'','yes',p.money<pr2,'Bayar '+fmt(pr2)+taxSub(pr2)));opts.appendChild(OB('Lewat dulu','ghost small','no'));}
  if(pd.type==='festival'){body.appendChild(modalHead(IDX.fest,tileName(IDX.fest),isPol()?'Kampanye di kota mana?':'Pilih kota yang dirayakan',0));
    body.appendChild(note('Kota yang sama dirayakan lagi: x2 jadi x3, lalu x4. Total kelipatan sewa maksimal x6, Proyek Strategis sampai x32.'));
    ownedCities(p.id).forEach(function(ci){var same=S.festival===ci,lvlNow=S.festLevel||2,next=same?Math.min(4,lvlNow+1):2,now=cityRent(ci),base=tileL(ci)*RENTM[S.tiles[ci].level]*(regionFull(p.id,T[ci].region)?2:1),after=S.tiles[ci].level===4?tileL(ci)*RENTM[4]*Math.min(32,lmLadder(ci)*next):tileL(ci)*RENTM[S.tiles[ci].level]*Math.min(6,(regionFull(p.id,T[ci].region)?2:1)*next);
      opts.appendChild(OB(same?(tileName(ci)+' · naikkan ke x'+next):tileName(ci),same?'':'ghost',ci,same&&lvlNow>=4,same&&lvlNow>=4?'Sudah maksimal x4':('Sewa '+fmt(now)+' jadi '+fmt(after))));});
    opts.appendChild(OB('Lewat','ghost small','skip'));}
  if(pd.type==='unseal'){body.appendChild(modalHead(i,'Disegel','Cabut segel '+tileName(i)+'?',S.tiles[i].level));
    body.appendChild(note('Kotamu disegel demo mahasiswa. Bayar denda ke '+TH_().kasName+' supaya segel dicabut, sewa jalan lagi, dan kamu bisa bangun'+(S.tiles[i].level===4?' atau naikkan pengali.':'.')));
    opts.appendChild(OB('Bayar denda','','yes',p.money<pd.fee,'Bayar '+fmt(pd.fee)));opts.appendChild(OB('Biarin disegel','ghost small','no'));}
  if(pd.type==='nuke'){var nh2=document.createElement('div');nh2.className='cardface flip bad';nh2.innerHTML='<div class="eyebrow">Telepon masuk</div><h3>Pilih kota untuk dinuklir</h3><p>Proyek Strategis lawan rata jadi '+escapeHtml(levelName(0))+'. Pengalinya balik ke x1.</p>';body.appendChild(nh2);
    pd.targets.forEach(function(ti){var so=S.tiles[ti];opts.appendChild(OB(tileName(ti)+' · '+S.players[so.owner].name,'red',ti,false,'Sewa sekarang '+fmt(cityRent(ti))+' (x'+fmtMult(rentMult(ti))+')'));});
    opts.appendChild(OB('Simpan dulu','ghost small','keep',false,'Pajak gudang '+fmt(nukeTax())+' tiap lewat '+tileName(0)));}
  if(pd.type==='pelni'){body.appendChild(modalHead(IDX.pelni,tileName(IDX.pelni),isPol()?'Blusukan?':'Naik kapal?',0));
    body.appendChild(note('Bayar '+fmt(PELNI_FEE)+'. Giliran berikutnya kamu bebas pilih tile tujuan. Lewat Start tetap dapat gaji.'));
    opts.appendChild(OB(isPol()?'Blusukan!':'Naik kapal','','yes',p.money<PELNI_FEE));opts.appendChild(OB('Nggak usah','ghost small','no'));}
  if(pd.type==='card'){var dk=pd.deck||'chance',cd=TH_()[dk][pd.card],cf=document.createElement('div');cf.className='cardface flip '+(dk==='dana'?'dana ':'')+(cd.kind==='good'?'good':cd.kind==='bad'?'bad':'');
    cf.innerHTML='<div class="eyebrow">'+escapeHtml(dk==='dana'?TH_().danaName:TH_().chanceName)+'</div><h3>'+escapeHtml(cd.name)+'</h3><p>'+escapeHtml(cardTextSafe(dk,pd.card,cd))+'</p>';body.appendChild(cf);opts.appendChild(OB('Oke','','ok'));}
  if(pd.type==='hand')handPrompt(pd,body,opts,OB);
  body.appendChild(wallet());body.appendChild(opts);
}
var detailOpen=false;
function openDetail(i){
  if(S.phase==='prompt'||S.phase==='moving'||S.phase==='over')return;
  var t=T[i],st=S.tiles[i],m=$('modal'),body=$('modalBody');body.innerHTML='';detailOpen=true;m.hidden=false;m.classList.remove('compact');
  if(t.type==='city'){body.appendChild(modalHead(i,REGIONS[t.region].name,t.name,st.owner!==null?st.level:4));
    var rows=[['Pemilik',st.owner!==null?S.players[st.owner].name:'Belum ada'],['Landmark',t.landmark]];
    if(st.owner!==null){rows.push(['Bangunan',LV[st.level]],['Sewa sekarang',fmt(cityRent(i))]);if(S.festival===i)rows.push([tileName(IDX.fest),'x'+(S.festLevel||2)]);if(st.level===4)rows.push(['Pengali','x'+fmtMult(rentMult(i))+' (tangga x'+lmLadder(i)+', naik saat pemilik mampir, maks x16, total x32)']);if(sealed(i))rows.push(['Segel','Pemilik bisa cabut dengan denda '+fmt(sealFee(i))]);if(st.level<4)rows.push(['Harga takeover',fmt(takeoverPrice(i))]);}
    rows.push(['Sewa per level',RENTM.map(function(r){return short(tileL(i)*r);}).join(' · ')]);body.appendChild(facts(rows));}
  else if(t.type==='transport'){body.appendChild(modalHead(i,'Transportasi',tileName(i),0));body.appendChild(facts([['Pemilik',st.owner!==null?S.players[st.owner].name:'Belum ada'],['Harga',fmt(assetPrice(i))],['Sewa',rentLadder(typeof TRANS_RENT!=='undefined'?TRANS_RENT:[0,25000,50000,100000,200000])]]));}
  else if(t.type==='wisata'){body.appendChild(modalHead(i,TH_().wisataLabel,tileName(i),0));body.appendChild(facts([['Pemilik',st.owner!==null?S.players[st.owner].name:'Belum ada'],['Harga',fmt(assetPrice(i))],['Sewa sekarang',st.owner!==null?fmt(typeof rentOf==='function'?rentOf(i):wisRent(i)):'-'],['Sewa',rentLadder(WIS_RENT)],['Bonus','Punya '+wisWin()+' '+TH_().wisataLabel.toLowerCase()+' langsung menang']]));}
  else{var pol=isPol(),info={start:(pol?'Gajian pejabat: ':'')+'Lewat atau mendarat di sini dapat gaji '+fmt(salaryAmt())+'.',jail:(pol?'Mendarat di sini langsung kena OTT dan ditahan maksimal 3 giliran. Pilih: ikuti masa tahanan (kocok, double = bebas), banding '+fmt(appealFee())+' (50% bebas), atau sogok hakim '+fmt(jailFee())+' (pasti bebas).':'Mendarat di sini bikin terdampar maksimal 3 giliran. Keluar dengan double atau bayar '+fmt(jailFee())+'.'),festival:'Pilih satu kotamu, sewanya jadi x2. Rayakan kota yang sama lagi untuk x3 dan x4.',pelni:pol?'Bayar '+fmt(PELNI_FEE)+', giliran berikutnya blusukan lewat gorong-gorong ke tile mana saja.':'Bayar '+fmt(PELNI_FEE)+', giliran berikutnya bebas pilih tujuan.',chance:'Ambil satu kartu '+TH_().chanceName+'. Bisa untung, bisa buntung.',dana:'Ambil satu kartu '+TH_().danaName+'.',tax:'Bayar '+Math.round((typeof punglRate==='function'?punglRate():0.1)*100)+'% dari total nilai propertimu (kamu: '+fmt(typeof punglAmt==='function'?punglAmt(cur().id):0)+'). Uangnya masuk '+TH_().kasName+'.',parkir:'Tukang parkir dadakan minta '+fmt(parkirFee())+' per langkah dadumu. Tarifnya naik pelan-pelan. Uangnya masuk '+TH_().kasName+'.'}[t.type];
    body.appendChild(modalHead(i,'Tile spesial',tileName(i),0));body.appendChild(note(info));}
  var o=document.createElement('div');o.className='opts';o.appendChild(btn('Tutup','ghost',function(){detailOpen=false;m.hidden=true;}));body.appendChild(o);
}
function showResult(){
  var r=$('result');if(!r.hidden)return;r.hidden=false;var w=S.players[S.winner.pid];if(typeof vo==='function')setTimeout(function(){vo('chr_'+w.char+'_menang');},600);
  $('resHow').textContent=S.winner.how;$('resName').textContent=w.name+' jadi Raja Cuan!';requestAnimationFrame(function(){portrait($('resFace'),w.char,w.color);});
  var list=$('resList');list.innerHTML='';
  S.players.slice().sort(function(a,b){return (a.id===w.id?-1:b.id===w.id?1:0)||(a.bankrupt-b.bankrupt)||assets(b.id)-assets(a.id);}).forEach(function(p,k){
    var row=document.createElement('div');row.className='result-row';row.innerHTML='<b>'+(k+1)+'</b><canvas></canvas><span>'+escapeHtml(p.name)+'</span><b>'+(p.bankrupt?'Bangkrut':fmt(assets(p.id)))+'</b>';list.appendChild(row);
    var c=row.querySelector('canvas');requestAnimationFrame(function(){portrait(c,p.char,p.color);});});
  renderLhkpn();
}


function shakeBtn(label,sub){var b=document.createElement('button');b.type='button';b.className='btn shake';b.textContent=label;if(sub){var sp=document.createElement('span');sp.className='opt-sub';sp.textContent=sub;b.appendChild(sp);}
  var down=function(e){e.preventDefault();audioUnlock();cupStart();b.classList.add('held');},up=function(e){e.preventDefault();b.classList.remove('held');cupRelease();};
  b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',function(e){if(cup.phase==='shake')up(e);});
  b.addEventListener('keydown',function(e){if((e.key===' '||e.key==='Enter')&&cup.phase==='idle'){e.preventDefault();cupStart();cupRelease();}});return b;}

function rentLadder(arr){return arr.slice(1).filter(function(v,k,a){return k===0||v!==a[k-1];}).map(function(v,k){return (k+1)+': '+short(v);}).join(' · ');}
function wisWin(){return typeof WIS_WIN!=='undefined'?WIS_WIN:4;}
function cardTextSafe(dk,ci,cd){if(typeof cardText==='function'){try{var t=cardText(dk,ci);if(t)return t;}catch(e){}}return cd.text;}
/* prompt card sits top-left under the player bar; flips to top-right when the current token would be under it */
function placeCard(m){var tb=$('topbar'),top=tb?Math.round(tb.getBoundingClientRect().bottom)+8:70;m.style.setProperty('--mtop',top+'px');var right=false;
  try{if(S&&cv){var tp=tokenPos(S.current,performance.now()),q=iso(tp.u,tp.v,tp.z),r=cv.getBoundingClientRect(),x=q.x+r.left,y=q.y+r.top,cw=Math.min(320,window.innerWidth*0.42)+30;right=x<cw&&y>top-40;}}catch(e){}
  m.classList.toggle('right',right);}
function taxSub(cost){var t=typeof txTaxAmt==='function'?txTaxAmt(cost):0;return t>0?' + pajak '+short(t):'';}

function fmtMult(m){return (Math.round(m*10)/10).toString().replace('.',',');}
