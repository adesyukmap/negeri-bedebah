/* ---------- sound layer: your clips (Sound Studio) > built-in samples > synth ---------- */
var SLOT_GROUPS=[
  {id:'char',name:'Karakter',hint:'Suara giliran: diputar saat layar "Giliran kamu" muncul.',slots:function(){return CHARS.map(function(c){return {k:'voice:'+c.id,label:c.name,sub:'Suara giliran',char:c.id};});}},
  {id:'quip',name:'Celetukan & tokoh',hint:'Dialog tokoh fiktif di dalam game. Kosong = tanpa suara.',slots:function(){return [
    {k:'quip:lawan',label:'"Saya akan lawan!"',sub:'Token setelah OTT'},{k:'quip:sorry',label:'"Sorry ye!"',sub:'Setelah gusur'},
    {k:'quip:repot',label:'"Gitu aja kok repot!"',sub:'Pemilik dapat sewa besar'},{k:'quip:asing',label:'"Ini ulah antek-antek asing!"',sub:'Proyek mangkrak'},
    {k:'host',label:'Mbak Host bertanya',sub:'"Bapak ketangkap kasus apa?"'},{k:'preman',label:'Preman pungli',sub:'"Uang keamanan, Bos!"'},
    {k:'tukang',label:'Tukang parkir',sub:'"2rebu ga bikin lo miskin, boss!"'},{k:'mafia',label:'Bos Mafia lempar dadu',sub:'Tawa atau teriakan saat melempar'},
    {k:'mic',label:'Orasi kampanye',sub:'Awal adegan Kampanye Akbar'}];}},
  {id:'event',name:'Event',hint:'Ganti efek suara bawaan. Hapus untuk kembali ke bawaan.',slots:function(){return [
    {k:'tap',label:'Tombol'},{k:'rattle',label:'Kocok dadu'},{k:'slam',label:'Dadu mendarat'},{k:'hop',label:'Token melangkah'},
    {k:'buy',label:'Beli / ambil aset'},{k:'build',label:'Bangun'},{k:'takeover',label:'Gusur / takeover'},{k:'collapse',label:'Bangunan runtuh / mangkrak'},
    {k:'card',label:'Ambil kartu'},{k:'coins',label:'Koin'},{k:'pay',label:'Bayar'},{k:'siren',label:'Sirene OTT'},{k:'news',label:'Breaking news'},
    {k:'typing',label:'Teks diketik'},{k:'festival',label:'Kampanye / pesta'},{k:'fajar',label:'Serangan fajar'},{k:'quake',label:'Gempa'},
    {k:'fire',label:'Hutan terbakar'},{k:'cough',label:'Batuk'},{k:'splash',label:'Gorong-gorong / air'},{k:'pop',label:'Muncul'},
    {k:'appeal',label:'Sidang banding'},{k:'bad',label:'Sial'},{k:'broke',label:'Bangkrut'},{k:'win',label:'Menang'}];}}];
var BUILTIN={card:'card',typing:'typing',newsType:'keyboard',collapse:'fold',appeal:'tick'};
var SILENT={host:1,preman:0,tukang:0,mafia:1,mic:0};
var USER_RAW={},USER_META={},USER_BUF={},SAMPLE_BUF={},PLAYING={},SDB=null;
function sdb(cb){if(SDB)return cb(SDB);try{var r=indexedDB.open('kc-sound',1);r.onupgradeneeded=function(){r.result.createObjectStore('clips');};r.onsuccess=function(){SDB=r.result;cb(SDB);};r.onerror=function(){cb(null);};}catch(e){cb(null);}}
function loadUserClips(done){sdb(function(db){if(!db)return done&&done();try{var tx=db.transaction('clips','readonly'),st=tx.objectStore('clips'),rq=st.openCursor();
  rq.onsuccess=function(){var c=rq.result;if(c){USER_RAW[c.key]=c.value.data;USER_META[c.key]={name:c.value.name,size:c.value.size};c.continue();}else done&&done();};rq.onerror=function(){done&&done();};}catch(e){done&&done();}});}
function saveUserClip(k,file,cb){var fr=new FileReader();fr.onload=function(){var data=fr.result;sdb(function(db){if(!db)return cb('Penyimpanan perangkat tidak tersedia di browser ini.');try{var tx=db.transaction('clips','readwrite');tx.objectStore('clips').put({name:file.name,size:file.size,data:data},k);
  tx.oncomplete=function(){USER_RAW[k]=data;USER_META[k]={name:file.name,size:file.size};delete USER_BUF[k];cb(null);};tx.onerror=function(){cb('Gagal menyimpan. Coba file yang lebih kecil.');};}catch(e){cb('Gagal menyimpan.');}});};fr.onerror=function(){cb('File tidak bisa dibaca.');};fr.readAsArrayBuffer(file);}
function deleteUserClip(k,cb){delete USER_RAW[k];delete USER_META[k];delete USER_BUF[k];sdb(function(db){if(!db)return cb&&cb();try{var tx=db.transaction('clips','readwrite');tx.objectStore('clips').delete(k);tx.oncomplete=function(){cb&&cb();};}catch(e){cb&&cb();}});}
function decodeInto(map,k,ab){if(!AC||map[k]===false||map[k])return;map[k]=false;try{AC.decodeAudioData(ab.slice(0),function(b){map[k]=b;},function(){map[k]=null;});}catch(e){map[k]=null;}}
function warmSounds(){if(!AC)return;for(var k in USER_RAW)decodeInto(USER_BUF,k,USER_RAW[k]);if(typeof SAMPLES!=='undefined')for(var s in SAMPLES)if(!SAMPLE_BUF[s])decodeInto(SAMPLE_BUF,s,b64buf(SAMPLES[s]));}
function bufFor(n){if(USER_RAW[n]){if(USER_BUF[n])return USER_BUF[n];decodeInto(USER_BUF,n,USER_RAW[n]);return null;}var b=BUILTIN[n];if(b&&SAMPLE_BUF[b])return SAMPLE_BUF[b];return null;}
function playBuf(b,n,vol){var s=AC.createBufferSource(),gn=AC.createGain();s.buffer=b;gn.gain.value=vol==null?0.9:vol;s.connect(gn);gn.connect(AC.destination);s.start();PLAYING[n]=AC.currentTime+b.duration;return s;}
function hasSound(n){return !!(USER_RAW[n]||(BUILTIN[n]&&typeof SAMPLES!=='undefined'&&SAMPLES[BUILTIN[n]]));}
function play(n,arg){if(!AC||muted)return;warmSounds();var b=bufFor(n);
  if(b){if((n==='rattle'||n==='typing'||n==='newsType'||n.indexOf('voice:')===0||n.indexOf('quip:')===0)&&PLAYING[n]>AC.currentTime)return;playBuf(b,n);return;}
  if(USER_RAW[n])return; // still decoding: stay quiet this once
  if(n.indexOf('voice:')===0||n.indexOf('quip:')===0||SILENT[n]===1||n==='newsType')return;
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
    st.textContent=mine?('File kamu: '+mine.name):(BUILTIN[sl.k]?'Bawaan (Hermes)':(sl.k.indexOf('voice:')===0||sl.k.indexOf('quip:')===0||SILENT[sl.k]===1)?'Kosong':'Bawaan (synth)');
    if(sl.sub){var sb=document.createElement('span');sb.className='ssub';sb.textContent=sl.sub;tx.appendChild(sb);}tx.appendChild(st);row.appendChild(tx);
    var acts=document.createElement('div');acts.className='sacts';
    var pb=document.createElement('button');pb.type='button';pb.className='btn ghost small';pb.textContent='Putar';pb.onclick=function(){audioUnlock();var was=muted;muted=false;var b=bufFor(sl.k);if(b)playBuf(b,'_preview');else if(USER_RAW[sl.k])setTimeout(function(){var b2=bufFor(sl.k);if(b2)playBuf(b2,'_preview');},250);else if(!(sl.k.indexOf('voice:')===0||sl.k.indexOf('quip:')===0||SILENT[sl.k]===1))synthPlay(sl.k,0.6);muted=was;};
    var inp=document.createElement('input');inp.type='file';inp.accept='audio/*,.m4a,.mp3,.wav,.aac,.ogg';inp.hidden=true;
    inp.onchange=function(){var f=inp.files&&inp.files[0];if(!f)return;if(f.size>3*1024*1024){studioMsg='File '+f.name+' terlalu besar. Maksimal 3 MB, potong dulu jadi pendek.';renderStudio();return;}
      saveUserClip(sl.k,f,function(err){studioMsg=err||('Tersimpan: '+sl.label+'.');audioUnlock();warmSounds();renderStudio();});};
    var ub=document.createElement('button');ub.type='button';ub.className='btn small';ub.textContent=mine?'Ganti':'Upload';ub.onclick=function(){inp.click();};
    acts.appendChild(pb);acts.appendChild(ub);acts.appendChild(inp);
    if(mine){var db2=document.createElement('button');db2.type='button';db2.className='btn ghost small';db2.textContent='Hapus';db2.onclick=function(){if(db2.textContent!=='Yakin?'){db2.textContent='Yakin?';return;}deleteUserClip(sl.k,function(){studioMsg='Dihapus: '+sl.label+', kembali ke bawaan.';renderStudio();});};acts.appendChild(db2);}
    row.appendChild(acts);box.appendChild(row);});}
