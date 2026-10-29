/* ---------- sound layer: your clips (Sound Studio) > built-in samples > synth ---------- */
var SLOT_GROUPS=[
  {id:'char',name:'Karakter',hint:'Suara giliran: diputar saat giliran pindah ke karakter ini.',slots:function(){return CHARS.map(function(c){return {k:'voice:'+c.id,label:c.name,sub:'Suara giliran',char:c.id};});}},
  {id:'quip',name:'Celetukan & tokoh',hint:'Dialog tokoh fiktif di dalam game. Kosong = tanpa suara.',slots:function(){return [
    {k:'quip:lawan',label:'"Saya akan lawan!"',sub:'Token setelah OTT'},{k:'quip:sorry',label:'"Sorry ye!"',sub:'Setelah gusur'},
    {k:'quip:repot',label:'"Gitu aja kok repot!"',sub:'Pemilik dapat sewa besar'},{k:'quip:asing',label:'"Ini ulah antek-antek asing!"',sub:'Proyek mangkrak'},
    {k:'host',label:'Mbak Host bertanya',sub:'"Bapak/Ibu ketangkap kasus apa?"'},{k:'preman',label:'Preman pungli',sub:'"Uang keamanan, Bos!"'},
    {k:'tukang',label:'Tukang parkir',sub:'"2rebu ga bikin lo miskin, boss!" (tarif ikut naik)'},{k:'mafia',label:'Bos Mafia lempar dadu',sub:'Tawa atau teriakan saat melempar'},
    {k:'mic',label:'Orasi kampanye',sub:'Awal adegan Kampanye Akbar'},{k:'semaksimal',label:'"Kami sudah berusaha semaksimal mungkin"',sub:'Gemoy raksasa saat pemadaman'}];}},
  {id:'vo',name:'Voice over adegan',hint:'Suara dialog di adegan dan papan. Kosong = tanpa suara sampai file Hermes masuk.',slots:function(){var L=[{k:'quip:bayarDulu',label:'"Bayar dulu, Bos!"',sub:'Pemilik tanah, saat tidak bisa digusur'},{k:'quip:sialan',label:'"Sialan lu!"',sub:'Balasan token'}];Object.keys(typeof VO_LINES!=='undefined'?VO_LINES:{}).forEach(function(k){L.push({k:'vo:'+k,label:'"'+VO_LINES[k][1]+'"',sub:VO_LINES[k][0]});});return L;}},
  {id:'event',name:'Event',hint:'Ganti efek suara bawaan. Hapus untuk kembali ke bawaan.',slots:function(){return [
    {k:'tap',label:'Tombol'},{k:'rattle',label:'Kocok dadu'},{k:'slam',label:'Dadu mendarat'},{k:'hop',label:'Token melangkah'},
    {k:'buy',label:'Beli / ambil aset'},{k:'build',label:'Bangun'},{k:'takeover',label:'Gusur / takeover'},{k:'collapse',label:'Bangunan runtuh / mangkrak'},
    {k:'card',label:'Ambil kartu'},{k:'coins',label:'Koin'},{k:'pay',label:'Bayar'},{k:'siren',label:'Sirene OTT'},{k:'sting',label:'Sting Breaking News'},{k:'news',label:'Breaking news (jingle)'},
    {k:'typing',label:'Teks diketik'},{k:'festival',label:'Kampanye / pesta'},{k:'fajar',label:'Musik Serangan Fajar'},{k:'quake',label:'Gempa'},
    {k:'fire',label:'Hutan terbakar'},{k:'cough',label:'Batuk'},{k:'splash',label:'Gorong-gorong / air'},{k:'pop',label:'Muncul'},
    {k:'appeal',label:'Sidang banding'},{k:'bedOtt',label:'Musik adegan OTT'},{k:'bedKampanye',label:'Musik adegan Kampanye'},{k:'chainsaw',label:'Gergaji mesin'},{k:'whistle',label:'Peluit'},{k:'sad',label:'Orangutan sedih'},{k:'forest',label:'Suasana hutan'},{k:'uuk',label:'Orangutan senang'},{k:'birds',label:'Burung panik / rangkong'},{k:'plane',label:'Pesawat pemadam'},{k:'rain',label:'Hujan'},{k:'treesFall',label:'Pohon tumbang'},{k:'laugh',label:'Tawa Mafia Sawit'},{k:'horn',label:'Klakson truk / bus'},{k:'jet',label:'Jet lepas landas'},{k:'shipHorn',label:'Klakson kapal'},{k:'trainHorn',label:'Klakson kereta'},{k:'ribbon',label:'Gunting pita + tepuk tangan'},{k:'windCreak',label:'Angin dan crane berderit'},{k:'flood',label:'Air banjir'},{k:'pile',label:'Palu tiang pancang'},{k:'zap',label:'Listrik nyetrum (PLN)'},{k:'construct',label:'Bangunan berdiri'},{k:'omon',label:'"Alah, omon-omon doang!"'},{k:'tease',label:'Ledekan setelah gusur'},{k:'bad',label:'Sial'},{k:'broke',label:'Bangkrut'},{k:'win',label:'Menang'}];}}];
var BUILTIN={appeal:'h_appeal',bedKampanye:'h_bedKampanye',bedOtt:'h_bedOtt',birds:'h_birds',buy:'h_buy',camera:'h_camera',chainsaw:'h_chainsaw',coins:'h_coins',cough:'h_cough',fajar:'h_fajar',festival:'h_festival',fire:'h_fire',flood:'h_flood',forest:'h_forest',horn:'h_horn',laugh:'h_laugh',pay:'h_pay',pile:'h_pile',plane:'h_plane',pop:'h_pop',rain:'h_rain',rattle:'h_rattle',ribbon:'h_ribbon',sad:'h_sad',siren:'h_siren',slam:'h_slam',stamp:'h_stamp',sting:'h_sting',takeover:'h_takeover',tap:'h_tap',treesFall:'h_treesFall',uuk:'h_uuk',whistle:'h_whistle',whoosh:'h_whoosh',windCreak:'h_windCreak',card:'card',typing:'typing',newsType:'keyboard',collapse:'fold',coin:'h_coins',bulldoze:'h_takeover','quip:lawan':'v_quip_lawan','quip:sorry':'v_quip_sorry','quip:repot':'v_quip_repot','quip:asing':'v_quip_asing',host:'v_host',preman:'v_preman',tukang:'v_tukang',mic:'v_mic',omon:'v_omon',semaksimal:'v_semaksimal',jet:'h_jet',shipHorn:'h_shipHorn',trainHorn:'h_trainHorn'};
var SVOL={tap:0.45,rain:0.5,fire:0.5,forest:0.4,fajar:0.55,bedKampanye:0.55,bedOtt:0.55,pop:0.6,stamp:0.7,rattle:0.7,coins:0.7,coin:0.6};
var SRC={};
function stopSnd(n){var s=SRC[n];if(s){try{s.stop();}catch(e){}delete SRC[n];PLAYING[n]=0;}}
var SILENT={host:1,preman:0,tukang:0,mafia:1,mic:0,semaksimal:1};
var USER_RAW={},USER_META={},USER_BUF={},SAMPLE_BUF={},PLAYING={},SDB=null;
function sdb(cb){if(SDB)return cb(SDB);try{var r=indexedDB.open('kc-sound',1);r.onupgradeneeded=function(){r.result.createObjectStore('clips');};r.onsuccess=function(){SDB=r.result;cb(SDB);};r.onerror=function(){cb(null);};}catch(e){cb(null);}}
function loadUserClips(done){sdb(function(db){if(!db)return done&&done();try{var tx=db.transaction('clips','readonly'),st=tx.objectStore('clips'),rq=st.openCursor();
  rq.onsuccess=function(){var c=rq.result;if(c){USER_RAW[c.key]=c.value.data;USER_META[c.key]={name:c.value.name,size:c.value.size};c.continue();}else done&&done();};rq.onerror=function(){done&&done();};}catch(e){done&&done();}});}
function saveUserClip(k,file,cb){var fr=new FileReader();fr.onload=function(){var data=fr.result;sdb(function(db){if(!db)return cb('Penyimpanan perangkat tidak tersedia di browser ini.');try{var tx=db.transaction('clips','readwrite');tx.objectStore('clips').put({name:file.name,size:file.size,data:data},k);
  tx.oncomplete=function(){USER_RAW[k]=data;USER_META[k]={name:file.name,size:file.size};delete USER_BUF[k];cb(null);};tx.onerror=function(){cb('Gagal menyimpan. Coba file yang lebih kecil.');};}catch(e){cb('Gagal menyimpan.');}});};fr.onerror=function(){cb('File tidak bisa dibaca.');};fr.readAsArrayBuffer(file);}
function deleteUserClip(k,cb){delete USER_RAW[k];delete USER_META[k];delete USER_BUF[k];sdb(function(db){if(!db)return cb&&cb();try{var tx=db.transaction('clips','readwrite');tx.objectStore('clips').delete(k);tx.oncomplete=function(){cb&&cb();};}catch(e){cb&&cb();}});}
function decodeInto(map,k,ab){if(!AC||map[k]===false||map[k])return;map[k]=false;try{AC.decodeAudioData(ab.slice(0),function(b){map[k]=b;},function(){map[k]=null;});}catch(e){map[k]=null;}}
/* decode in small batches so the first tap doesn't freeze the page decoding ~100 clips at once */
var WARM={q:null,on:false};
function warmSounds(){if(!AC||WARM.q)return;WARM.q=[];for(var k in USER_RAW)WARM.q.push(['u',k]);if(typeof SAMPLES!=='undefined')for(var s in SAMPLES)WARM.q.push(['s',s]);
  (function step(){var n=0;while(WARM.q.length&&n<4){var it=WARM.q.shift();if(it[0]==='u'){if(!USER_BUF[it[1]])decodeInto(USER_BUF,it[1],USER_RAW[it[1]]);}else if(!SAMPLE_BUF[it[1]]){decodeInto(SAMPLE_BUF,it[1],b64buf(SAMPLES[it[1]]));n++;}}if(WARM.q.length)setTimeout(step,120);})();}
function warmOne(b){if(b&&typeof SAMPLES!=='undefined'&&SAMPLES[b]&&!SAMPLE_BUF[b]&&!(SAMPLE_BUF._p&&SAMPLE_BUF._p[b])){(SAMPLE_BUF._p=SAMPLE_BUF._p||{})[b]=1;decodeInto(SAMPLE_BUF,b,b64buf(SAMPLES[b]));}}
function builtinOf(n){return BUILTIN[n]||(n.indexOf('vo:')===0?'vo_'+n.slice(3):null);}
function bufFor(n){if(USER_RAW[n]){if(USER_BUF[n])return USER_BUF[n];decodeInto(USER_BUF,n,USER_RAW[n]);return null;}var b=builtinOf(n);if(b&&SAMPLE_BUF[b])return SAMPLE_BUF[b];warmOne(b);return null;}
function playBuf(b,n,vol){var s=AC.createBufferSource(),gn=AC.createGain();s.buffer=b;gn.gain.value=vol==null?(SVOL[n]!=null?SVOL[n]:0.9):vol;s.connect(gn);gn.connect(AC.destination);s.start();PLAYING[n]=AC.currentTime+b.duration;SRC[n]=s;s.onended=function(){if(SRC[n]===s)delete SRC[n];};return s;}
function hasSound(n){var b=builtinOf(n);return !!(USER_RAW[n]||(b&&typeof SAMPLES!=='undefined'&&SAMPLES[b]));}
function play(n,arg){if(!AC||muted)return;warmSounds();var b=bufFor(n);
  if(b){if((n==='rattle'||n==='fajar'||n==='bedOtt'||n==='bedKampanye'||n==='rain'||n==='fire'||n==='typing'||n==='newsType'||n.indexOf('voice:')===0||n.indexOf('quip:')===0||n.indexOf('vo:')===0)&&PLAYING[n]>AC.currentTime)return;playBuf(b,n);return;}
  if(USER_RAW[n])return; // still decoding: stay quiet this once
  if(n.indexOf('voice:')===0||n.indexOf('quip:')===0||n.indexOf('vo:')===0||SILENT[n]===1||n==='newsType')return;
  synthPlay(n,arg);}
/* ---------- Sound Studio screen ---------- */
var studioTab='char',studioMsg='';
function openStudio(){audioUnlock();warmSounds();$('studio').hidden=false;renderStudio();}
function renderStudio(){var box=$('studioBody');box.innerHTML='';var G=SLOT_GROUPS.filter(function(x){return x.id===studioTab;})[0];
  var tabs=$('studioTabs');tabs.innerHTML='';SLOT_GROUPS.forEach(function(x){var b=document.createElement('button');b.type='button';b.textContent=x.name;if(x.id===studioTab)b.className='on';b.onclick=function(){studioTab=x.id;studioMsg='';renderStudio();};tabs.appendChild(b);});
  $('studioHint').textContent=studioMsg||G.hint;$('studioHint').className='wallet'+(studioMsg?(/^(Tersimpan|Dihapus)/.test(studioMsg)?' okmsg':' warn'):'');
  G.slots().forEach(function(sl){var row=document.createElement('div');row.className='srow';
    if(sl.char){var cvp=document.createElement('canvas');cvp.className='sface';row.appendChild(cvp);requestAnimationFrame(function(){portrait(cvp,sl.char,'#F2C230');});}
    var tx=document.createElement('div');tx.className='stext';var l=document.createElement('b');l.textContent=sl.label;tx.appendChild(l);
    var st=document.createElement('span');var mine=USER_META[sl.k];st.className='spill'+(mine?' mine':'');
    st.textContent=mine?('File kamu: '+mine.name):(hasSound(sl.k)?'Bawaan (Hermes)':(sl.k.indexOf('voice:')===0||sl.k.indexOf('quip:')===0||sl.k.indexOf('vo:')===0||SILENT[sl.k]===1)?'Kosong':'Bawaan (synth)');
    if(sl.sub){var sb=document.createElement('span');sb.className='ssub';sb.textContent=sl.sub;tx.appendChild(sb);}tx.appendChild(st);row.appendChild(tx);
    var acts=document.createElement('div');acts.className='sacts';
    var pb=document.createElement('button');pb.type='button';pb.className='btn ghost small';pb.textContent='Putar';pb.onclick=function(){audioUnlock();var was=muted;muted=false;var b=bufFor(sl.k);if(b)playBuf(b,'_preview');else if(USER_RAW[sl.k])setTimeout(function(){var b2=bufFor(sl.k);if(b2)playBuf(b2,'_preview');},250);else if(!(sl.k.indexOf('voice:')===0||sl.k.indexOf('quip:')===0||sl.k.indexOf('vo:')===0||SILENT[sl.k]===1))synthPlay(sl.k,0.6);muted=was;};
    var inp=document.createElement('input');inp.type='file';inp.accept='audio/*,.m4a,.mp3,.wav,.aac,.ogg';inp.hidden=true;
    inp.onchange=function(){var f=inp.files&&inp.files[0];if(!f)return;if(f.size>3*1024*1024){studioMsg='File '+f.name+' terlalu besar. Maksimal 3 MB, potong dulu jadi pendek.';renderStudio();return;}
      saveUserClip(sl.k,f,function(err){studioMsg=err||('Tersimpan: '+sl.label+'.');audioUnlock();warmSounds();renderStudio();});};
    var ub=document.createElement('button');ub.type='button';ub.className='btn small';ub.textContent=mine?'Ganti':'Upload';ub.onclick=function(){inp.click();};
    acts.appendChild(pb);acts.appendChild(ub);acts.appendChild(inp);
    if(mine){var db2=document.createElement('button');db2.type='button';db2.className='btn ghost small';db2.textContent='Hapus';db2.onclick=function(){if(db2.textContent!=='Yakin?'){db2.textContent='Yakin?';return;}deleteUserClip(sl.k,function(){studioMsg='Dihapus: '+sl.label+', kembali ke bawaan.';renderStudio();});};acts.appendChild(db2);}
    row.appendChild(acts);box.appendChild(row);});}
