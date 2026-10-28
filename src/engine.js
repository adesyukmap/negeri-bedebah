
/* ================= ENGINE: rules only, no DOM ================= */
var START_SALARY=200000, JAIL_FEE=100000, PELNI_FEE=50000, WIS_PRICE=200000, KAS_LIMIT=1000000;
var CUM=[1,1.5,2.5,4,6], RENTM=[0.2,0.6,1.2,2,3], WIS_RENT=[0,50000,100000,180000,300000,420000,550000], WIS_WIN=5;
var PCOLORS=['#E5484D','#2F80ED','#27AE60','#9B51E0','#F2994A'];
var REGIONS=[
  {name:'Papua & Maluku',color:'#3E9B5F',L:60000},
  {name:'Nusa Tenggara',color:'#F08A3C',L:90000},
  {name:'Sulawesi',color:'#22B5A8',L:120000},
  {name:'Kalimantan',color:'#A8663A',L:160000},
  {name:'Sumatra',color:'#B83A4B',L:200000},
  {name:'Jawa',color:'#3D7BD9',L:260000},
  {name:'Mahkota',color:'#E3A500',L:350000}];
function C(name,r,lm,icon){return {type:'city',name:name,region:r,landmark:lm,icon:icon||'gen'};}
var IDX={start:0,jail:10,fest:20,pelni:30};
var TRANS_PRICE=200000, TRANS_RENT=[0,25000,50000,75000,100000], PARKIR_PER=2000, APPEAL_FEE=150000;
/* Kas Pungli economy (Politik only) */
var KAS_PART=0.4, TX_TAX=0.02, YEAR_TAX=0.0025, YEAR_TAX_MIN=2000;
var T=[
  {type:'start',name:'Start'},
  C('Jayapura',0,'Jembatan Youtefa'), {type:'dana',name:'Dana Umum'}, C('Ambon',0,'Gong Perdamaian'), {type:'wisata',name:'Raja Ampat',deco:'raja'}, {type:'transport',name:'Bandara',deco:'plane'},
  C('Kupang',1,'Sasando'), {type:'chance',name:'Kesempatan'}, C('Mataram',1,'Islamic Center'), C('Labuan Bajo',1,'Komodo'),
  {type:'jail',name:'Pulau Terdampar'},
  C('Manado',2,'Bunaken'), {type:'wisata',name:'PLN',deco:'pln'}, C('Palu',2,'Jembatan Kuning'), C('Makassar',2,'Kapal Pinisi'), {type:'transport',name:'Pelabuhan',deco:'ship'},
  {type:'wisata',name:'Borobudur',deco:'boro'}, C('Pontianak',3,'Tugu Khatulistiwa'), C('Banjarmasin',3,'Pasar Terapung'), C('Balikpapan',3,'Beruang Madu'),
  {type:'festival',name:'Pesta Rakyat'},
  C('Padang',4,'Rumah Gadang'), {type:'dana',name:'Dana Umum'}, C('Palembang',4,'Jembatan Ampera'), C('Medan',4,'Istana Maimun'), {type:'transport',name:'Stasiun Kereta Cepat',deco:'train'},
  C('Yogyakarta',5,'Tugu Jogja'), C('Bandung',5,'Gedung Sate','sate'), {type:'wisata',name:'PDAM',deco:'pdam'}, C('Surabaya',5,'Suro & Boyo'),
  {type:'pelni',name:'Kapal Pelni'},
  {type:'wisata',name:'Danau Toba',deco:'toba'}, {type:'transport',name:'Terminal Bus',deco:'bus'}, {type:'chance',name:'Kesempatan'}, C('Bali',6,'Candi Bentar'), {type:'wisata',name:'Gunung Bromo',deco:'bromo'},
  {type:'parkir',name:'Parkir Liar'}, {type:'tax',name:'Pajak Juragan'}, {type:'dana',name:'Dana Umum'}, C('Jakarta',6,'Monas','monas')];
var NT=T.length;
var PASSIVES={solo:{n:'Blusukan',d:'Gorong-gorong gratis'},gemoy:{n:'Joget',d:'Tiap dapat double, semua lawan bayar dia Rp10rb'},
  gaberner:{n:'Merangkai Kata',d:'1x per game, kartu Manuver yang merugikan dibatalkan'},pinguin:{n:'Rambut Putih',d:'Kampanye Akbar di kotanya: sewa x1,5 lagi'},
  banteng:{n:'Iuran Partai',d:'Lewat Gajian Pejabat dapat +Rp30rb'},prihatin:{n:'Prihatin',d:'Kena gempa atau mangkrak dapat ganti penuh'},
  opung:{n:'Lord',d:'Sewa yang dia bayar ke lawan -15%'},izin:{n:'Izin Kilat',d:'Konsesi dan transportasi -20%'},
  gusur:{n:'Gusur Murah',d:'Biaya gusur -15%'},fufufafa:{n:'Tidur Siang',d:'Tiap 3 giliran dapat Rp20rb'},
  instan:{n:'Karbitan',d:'Izin lahan pertamanya gratis'},saham:{n:'Minta Saham',d:'Tiap lawan bangun, dia dapat Rp10rb'},
  slepet:{n:'Pindah Kubu',d:'1x per game, tukar kotamu dengan kota lawan yang levelnya sama dan harga tanahnya lebih mahal maks Rp50rb (bukan landmark)'},
  taro:{n:'Ahli Hukum',d:'Peluang banding 75%'},zonk:{n:'Anti Zonk',d:'1x per game, kartu merugikan otomatis diambil ulang'},
  dungu:{n:'Narasumber',d:'Tiap Breaking News dapat Rp30rb'},ratupajak:{n:'Ratu Pajak',d:'Dapat 20% dari tiap Pungli lawan'},
  konten:{n:'Viral',d:'Tiap bangun dapat Rp20rb'},micmati:{n:'Matikan Mic',d:'1x per game, gusur ke kotanya otomatis ditolak'},
  imam:{n:'Massa Aksi',d:'Ditahan maksimal 2 giliran'},stoik:{n:'Dikotomi Kendali',d:'Denda dari kartu -50%'}};
function hasP(p,k){return !!(S&&S.passives&&p&&!p.bankrupt&&p.char===k);}
function useP(p,k){if(!hasP(p,k))return false;p.pu=p.pu||{};if(p.pu[k])return false;p.pu[k]=1;return true;}
function canUseP(p,k){return hasP(p,k)&&!(p.pu&&p.pu[k]);}
function pEmit(p,k,text){emit({t:'passive',pid:p.id,key:k,name:PASSIVES[k].n,text:text||(p.name+': '+PASSIVES[k].d)});}
function kasLimit(){return S&&S.theme==='politik'?(storyStage()===0?125000:250000):KAS_LIMIT;}
var STORY=[{n:'Hutan Lebat'},{n:'Karhutla',t:'Titik api muncul di tengah hutan. Api mulai menjalar.'},{n:'Pemadaman',t:'Pesawat pemadam dan hujan datang. Api padam, hutan tinggal arang.'},
  {n:'Tanam Sawit',t:'Hutan mati. Mafia Sawit datang, lahan jadi konsesi.'},{n:'Panen Raya',t:'Sawit berbuah lebat. Truk bolak-balik ke pabrik.'},
  {n:'Proyek IKN',t:'Peletakan batu pertama ibu kota baru. Crane mulai berputar.'},{n:'Mangkrak',t:'Proyek berhenti. Crane diam, rumput tumbuh di tiang beton.'},
  {n:'Banjir Rob',t:'Air laut naik dan menenggelamkan proyek.'},{n:'Reboisasi Pencitraan',t:'Pejabat menanam satu bibit di depan kamera, lalu pergi.'}];
function storyStage(){return (S&&S.story)||0;}
function storyNext(){var st=storyStage();return STORY[st>=8?1:st+1].n;}
function jailMax(p){return hasP(p,'imam')?2:3;}
function appealFee(){return S&&S.theme==='politik'?100000:50000;}
function pelniFee(p){return hasP(p,'solo')?0:PELNI_FEE;}
function bankGain(p,amt){if(p&&!p.bankrupt&&amt>0)gain(p,amt);}
function onBuild(p,isCity){if(!S.passives)return;if(isCity&&hasP(p,'konten')){bankGain(p,20000);pEmit(p,'konten',p.name+' bikin konten pembangunan, dapat Rp20rb');}
  if(isCity)alivePlayers().forEach(function(o){if(o.id!==p.id&&hasP(o,'saham')){bankGain(o,10000);pEmit(o,'saham',o.name+' minta saham dari proyek '+p.name+', dapat Rp10rb');}});}
function swapCandidate(p,i){if(!canUseP(p,'slepet'))return null;var lv=S.tiles[i].level;if(lv>=4)return null;
  var c=ownedCities(p.id).filter(function(j){return S.tiles[j].level===lv&&lv<4&&tileL(i)>tileL(j)&&tileL(i)<=tileL(j)+50000;}).sort(function(a,b){return tileL(b)-tileL(a);})[0];return c==null?null:c;}
function buyable(i){var t=T[i].type;return t==='city'||t==='wisata'||t==='transport';}
var JALUR=[[1,9],[11,19],[21,29],[31,39]].map(function(r){var a=[];for(var i=r[0];i<=r[1];i++){if(buyable(i))a.push(i);}return a;});

/* ---- theme packs: names, cards and news per theme (effects are shared) ---- */
function K(name,text,kind,fx,amt,extra){var c={name:name,text:text,kind:kind,fx:fx,amt:amt||0};if(extra)for(var k in extra)c[k]=extra[k];return c;}
var THEMES={
  santai:{id:'santai',name:'Santai',tag:'Keliling Indonesia, kuasai kotanya.',levels:['Tanah','Rumah','Villa','Gedung','Landmark'],
    typeNames:{start:'Start',jail:'Pulau Terdampar',festival:'Pesta Rakyat',pelni:'Kapal Pelni',tax:'Pajak Juragan',chance:'Kesempatan',dana:'Dana Umum',parkir:'Parkir Liar'}, names:{},
    wisataLabel:'Wisata', chanceName:'Kesempatan', danaName:'Dana Umum', kasName:'Kas Pesisir', newsName:'Kabar Nusantara', jailVerb:'terdampar',
    chance:[
      K('Kapal Karam','Kapalmu karam. Langsung ke Pulau Terdampar.','bad','jail',0,{anim:'karam'}),
      K('Mudik','Pulang kampung dulu. Maju ke Start dan terima gaji.','good','toStart'),
      K('Angin Ribut','Diterpa angin. Mundur 3 langkah.','bad','back',3),
      K('Izin Bangun','Upgrade gratis 1 level di kota termahalmu (bukan Landmark).','good','upgrade'),
      K('Gempa Kecil','Bumi berguncang! Bangunan termahalmu turun 1 level (Landmark aman).','bad','quake',0,{anim:'gempa'}),
      K('Mati Lampu','Listrik padam. Pesta Rakyat yang sedang aktif dibatalkan.','neutral','festOff'),
      K('Ditilang','Lupa bawa SIM. Bayar Rp80.000.','bad','pay',80000),
      K('Panen Raya','Hasil panen melimpah. Terima Rp150.000.','good','gain',150000),
      K('Nyasar ke Pelabuhan','Salah naik angkot. Langsung ke Kapal Pelni.','neutral','goto',30),
      K('Menang Undian','Undian toko kelontong tembus. Terima Rp200.000.','good','gain',200000),
      K('Tukar Tempat','Salah tiket bus. Tukar posisi dengan pemain acak.','neutral','swap'),
      K('Promo Viral','Kotamu masuk FYP. Sewa kota termahalmu x1,5 sampai ronde berikutnya.','good','baliho')],
    dana:[
      K('THR Cair','Bonus akhir tahun cair. Terima Rp100.000.','good','gain',100000),
      K('Arisan Tembus','Ambil Rp50.000 dari setiap pemain lain.','good','collect',50000),
      K('Gotong Royong','Pemain paling kaya membayar Rp100.000 ke pemain paling miskin.','neutral','robin',100000),
      K('Kondangan','Undangan nikahan numpuk. Bayar Rp30.000 ke setiap pemain lain.','bad','payAll',30000),
      K('Iuran RT','Bayar iuran RT Rp50.000.','bad','pay',50000),
      K('Dapat Warisan','Ada warisan dari pakde. Terima Rp200.000.','good','gain',200000),
      K('Juara Lomba 17-an','Menang panjat pinang. Terima Rp80.000.','good','gain',80000),
      K('Bayar SPP','Bayar SPP anak Rp100.000.','bad','pay',100000),
      K('Gorengan Laris','Jualan gorengan habis. Terima Rp60.000.','good','gain',60000),
      K('Sedekah Juragan','Bayar Rp20.000 ke setiap pemain lain.','bad','payAll',20000)],
    news:[
      {id:'diskon',name:'Harbolnas!',text:'Semua biaya bangun diskon 30% selama ronde ini.'},
      {id:'mudik',name:'Mudik Lebaran',text:'Gaji lewat Start jadi x2 selama ronde ini.'},
      {id:'banjir',name:'Banjir Kiriman',text:'Jakarta dan Bali kebanjiran. Sewanya nol selama ronde ini.'},
      {id:'viral',name:'Viral di TikTok',text:'Satu wisata mendadak viral. Sewanya x3 selama ronde ini.'},
      {id:'krismon',name:'Krismon',text:'Harga-harga naik. Semua pemain bayar 10% uang tunai ke kas.'},
      {id:'demo',name:'Jalan Ditutup Karnaval',text:'Satu kota dipakai karnaval. Sewanya nol selama ronde ini.'}],
    fajarName:'Bagi-bagi Angpao', fajarText:'Ronde terakhir! Semua pemain dapat amplop, kecuali yang lagi terdampar.'},
  politik:{id:'politik',name:'Politik',tag:'Negeri Para Koruptor: bangun pabrik, rebut konsesi, hindari OTT.',levels:['Izin Lahan','Pabrik','Tambang','Kawasan Industri','Proyek Strategis'],
    typeNames:{start:'Gajian Pejabat',jail:'Lapas',festival:'Kampanye Akbar',pelni:'Gorong-gorong',tax:'Pungli',chance:'Manuver',dana:'Dana Hibah',parkir:'Parkir Liar'},
    names:{'Raja Ampat':'Konsesi Laut','Borobudur':'Konsesi Nikel','Danau Toba':'Reklamasi','Gunung Bromo':'Kebun Sawit','Bandara':'Jet Pribadi Pejabat','Pelabuhan':'Pelabuhan Ekspor Nikel','Stasiun Kereta Cepat':'Kereta Cepat Utang','Terminal Bus':'Bus Studi Banding'},
    ottCases:['Maling dana bansos, Mbak.','Saya cuma maling duit rakyat dikit, Mbak.','Proyek KTP elektronik.','Saya dituduh korupsi impor gula, padahal nggak!','Izin tambang timah.','Kuota haji tambahan.','Bakar hutan buat buka lahan sawit.','Izin ekspor minyak goreng waktu lagi langka.','Proyek menara BTS di pelosok.','Dana pensiun dan asuransi negara.','Proyek wisma atlet yang mangkrak.','Suap hakim biar vonis ringan.','Dana desa buat beli mobil.','Jual beli jabatan di daerah.','Pengadaan alat kesehatan waktu pandemi.','Impor daging sapi.','Ekspor benih lobster.','BBM dioplos, Mbak.','Proyek simulator SIM.','Dana hibah dipotong buat kampanye.','Pengadaan seragam dan sepatu dinas.'],
    wisataLabel:'Konsesi', chanceName:'Manuver', danaName:'Dana Hibah', kasName:'Kas Pungli', newsName:'Breaking News', jailVerb:'ditahan',
    chance:[
      K('Kena OTT!','Ketahuan maling duit rakyat. Pakai rompi oranye, langsung ke Lapas.','bad','jail',0,{anim:'ott'}),
      K('Pelantikan','Dilantik jadi pejabat baru. Maju ke Gajian Pejabat.','good','toStart'),
      K('Mundur Teratur','Kebijakan diprotes. Mundur 3 langkah.','bad','back',3),
      K('Pemutihan Izin','Izin bermasalah diputihkan. Upgrade gratis 1 level (bukan Proyek Strategis).','good','upgrade'),
      K('Tambang Ambles','Tanah tambang ambles! Bangunan termahalmu turun 1 level.','bad','quake',0,{anim:'gempa'}),
      K('Proyek Mangkrak','Anggaran habis di tengah jalan. Bangunan termahalmu turun 1 level.','bad','quake',0,{anim:'mangkrak'}),
      K('Kampanye Gagal','Massa bayaran nggak datang. Kampanye Akbar yang aktif bubar.','neutral','festOff'),
      K('Studi Banding','Studi banding ke luar negeri. Bayar Rp80.000.','bad','pay',80000),
      K('Pencitraan Viral','Foto blusukan viral. Terima Rp150.000 dari sponsor.','good','gain',150000),
      K('Blusukan Dadakan','Kamera sudah siap. Langsung ke Gorong-gorong.','neutral','goto',30),
      K('Reshuffle Kabinet','Jabatan dirombak. Tukar posisi dengan pemain acak.','neutral','swap'),
      K('Baliho Raksasa','Baliho wajahmu menutupi kota. Sewa kota termahalmu x1,5 sampai ronde berikutnya.','good','baliho')],
    dana:[
      K('Bansos Cair','Bansos cair menjelang pemilu. Terima Rp100.000.','good','gain',100000),
      K('Tender Fiktif','Semua rekanan setor. Ambil Rp50.000 dari setiap pemain lain.','good','collect',50000),
      K('Bagi-bagi Kursi','Pemain paling kaya membayar Rp100.000 ke pemain paling miskin.','neutral','robin',100000),
      K('Iuran Koalisi','Bayar Rp30.000 ke setiap pemain lain.','bad','payAll',30000),
      K('Denda Pajak','Ketahuan telat lapor. Bayar Rp100.000.','bad','pay',100000),
      K('Dana Aspirasi','Dana aspirasi turun. Terima Rp150.000.','good','gain',150000),
      K('Tunjangan Rumah Dinas','Terima Rp80.000.','good','gain',80000),
      K('Pungli Parkir','Kena tukang parkir liar. Bayar Rp50.000.','bad','pay',50000),
      K('Uang Rapat','Rapat lima menit, honor sejam. Terima Rp60.000.','good','gain',60000),
      K('Audit Mendadak','Auditor datang. Bayar 10% uang tunai ke kas.','bad','payPct',0.1)],
    news:[
      {id:'diskon',name:'Pemutihan Massal',text:'Semua biaya bangun diskon 30% selama ronde ini.'},
      {id:'mudik',name:'THR Pejabat',text:'Gajian Pejabat jadi x2 selama ronde ini.'},
      {id:'banjir',name:'Banjir Rob',text:'Jakarta dan Bali terendam. Sewanya nol selama ronde ini.'},
      {id:'viral',name:'Viral di Medsos',text:'Satu konsesi viral. Sewanya x3 selama ronde ini.'},
      {id:'krismon',name:'Krisis Moneter',text:'Rupiah anjlok. Semua pemain bayar 10% uang tunai ke kas.'},
      {id:'demo',name:'Demo Mahasiswa',text:'Mahasiswa turun ke jalan. Satu kota disegel, sewanya nol selama ronde ini.'}],
    fajarName:'Serangan Fajar', fajarText:'Ronde terakhir! Amplop dibagikan ke semua pemain, kecuali yang lagi di Lapas.'}
};

var S=null, EVENTS=[], SAVE_KEY='kepulauan-cuan-save-v2';
function emit(e){EVENTS.push(e);}
function toast(text,kind){emit({t:'toast',text:text,kind:kind||''});}
function sfx(n){emit({t:'sfx',n:n});}
function P(i){return S.players[i];}
function cur(){return S.players[S.current];}
function TH_(){return THEMES[(S&&S.theme)||'santai'];}
function tileName(i){var th=TH_(),t=T[i];if(th.typeNames[t.type])return th.typeNames[t.type];return th.names[t.name]||t.name;}
function levelName(l){return TH_().levels[l];}
function d6(){return 1+Math.floor(Math.random()*6);}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function fmt(n){return 'Rp'+Math.round(n).toLocaleString('id-ID');}
function short(n){n=Math.round(n); if(n>=1000000){var v=n/1000000; return (Math.round(v*10)/10).toString().replace('.',',')+'jt';} return Math.round(n/1000)+'rb';}
function save(){try{localStorage.setItem(SAVE_KEY, JSON.stringify(S));}catch(e){}}
function loadSave(){try{var s=localStorage.getItem(SAVE_KEY); return s?JSON.parse(s):null;}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}

function newsOn(id){return S.news&&S.news.round===S.round&&S.news.id===id;}
function bmul(){return newsOn('diskon')?0.7:1;}
function tileL(i){return REGIONS[T[i].region].L;}
function invested(i){var st=S.tiles[i],t=T[i].type; if(st.owner===null)return 0; if(t==='wisata')return WIS_PRICE; if(t==='transport')return TRANS_PRICE; return tileL(i)*CUM[st.level];}
function assetPrice(i,p){p=p||cur();var b=T[i].type==='wisata'?WIS_PRICE:TRANS_PRICE;return hasP(p,'izin')?Math.round(b*0.8):b;}
function countType(pid,ty){return ownedTiles(pid).filter(function(i){return T[i].type===ty;}).length;}
function ownedTiles(pid){var a=[];for(var i=0;i<NT;i++)if(S.tiles[i].owner===pid)a.push(i);return a;}
function ownedCities(pid){return ownedTiles(pid).filter(function(i){return T[i].type==='city';});}
function countWis(pid){return ownedTiles(pid).filter(function(i){return T[i].type==='wisata';}).length;}
var REG_T=null;function regionTiles(r){if(!REG_T){REG_T=REGIONS.map(function(){return [];});for(var i=0;i<NT;i++)if(T[i].type==='city')REG_T[T[i].region].push(i);}return REG_T[r].slice();}
function regionFull(pid,r){return regionTiles(r).every(function(i){return S.tiles[i].owner===pid;});}
function fullRegions(pid){var n=0;for(var r=0;r<REGIONS.length;r++)if(regionFull(pid,r))n++;return n;}
function propValue(pid){return ownedTiles(pid).reduce(function(s,i){return s+invested(i);},0);}
function assets(pid){return P(pid).money+propValue(pid);}
function festMult(i){return S.festival===i?(S.festLevel||2):1;}
function balihoOn(i){return S.baliho&&S.baliho.tile===i&&S.round<=S.baliho.until;}
function rentMult(i){var st=S.tiles[i];return Math.min(6,(regionFull(st.owner,T[i].region)?2:1)*festMult(i)*(S.festival===i&&hasP(P(st.owner),'pinguin')?1.5:1)*(balihoOn(i)?1.5:1));}
function sealed(i){return newsOn('demo')&&S.news.tile===i;}
function cityRent(i){var st=S.tiles[i]; if(st.owner===null)return 0; if(newsOn('banjir')&&T[i].region===6)return 0; if(sealed(i))return 0; return tileL(i)*RENTM[st.level]*rentMult(i);}
function wisRent(i){var st=S.tiles[i]; if(st.owner===null)return 0; return WIS_RENT[countWis(st.owner)]*(newsOn('viral')&&S.news.tile===i?3:1);}
function transRent(i){var st=S.tiles[i];return st.owner===null?0:TRANS_RENT[countType(st.owner,'transport')];}
function rentOf(i){var t=T[i].type;return t==='city'?cityRent(i):t==='wisata'?wisRent(i):t==='transport'?transRent(i):0;}
function takeoverPrice(i,p){return Math.round(invested(i)*2*(hasP(p||cur(),'gusur')?0.85:1));}
function stepMode(){return (S.buildMode||'bebas')==='bertahap';}
function buyCost(i,l,p){if(l===0&&canUseP(p||cur(),'instan'))return 0;return Math.round(tileL(i)*CUM[l]*bmul());}
function upCost(i,l){return Math.round(tileL(i)*(CUM[l]-CUM[S.tiles[i].level])*bmul());}
function buyOptions(p,i){return (stepMode()?[0]:[0,1,2]).filter(function(l){return p.money>=buyCost(i,l,p);});}
function upgradeOptions(p,i){var c=S.tiles[i].level,lv=[];
  if(c<3){for(var l=c+1;l<=(stepMode()?c+1:3);l++)lv.push(l);} else if(c===3&&p.laps>=1){lv.push(4);}
  return lv.filter(function(l){return p.money>=upCost(i,l);});}
function alivePlayers(){return S.players.filter(function(p){return !p.bankrupt;});}
function salaryAmt(){return START_SALARY*(newsOn('mudik')?2:1);}

function newGame(cfg){
  var order=shuffle(cfg.players.map(function(_,i){return i;})),th=THEMES[cfg.theme||'santai'];
  S={v:2, theme:th.id, players:cfg.players.map(function(p,i){return {id:i,name:p.name,char:p.char,npc:!!p.npc,level:p.npc?(BOT_LEVELS.indexOf(p.level)>=0?p.level:'sedang'):null,color:PCOLORS[i],money:cfg.money,pos:0,inJail:false,jailTurns:0,doubles:0,rolledDouble:false,pelni:false,laps:0,bankrupt:false};}),
    tiles:T.map(function(){return {owner:null,level:-1};}), order:order, turnIdx:0, current:order[0], round:1, turnLimit:cfg.turnLimit, startMoney:cfg.money, buildMode:cfg.buildMode||'bertahap',
    festival:null, festLevel:0, phase:'handoff', pending:null, dice:[3,4], winner:null, anim:null, threats:{},
    chanceDeck:shuffle(th.chance.map(function(_,i){return i;})), danaDeck:shuffle(th.dana.map(function(_,i){return i;})),
    passives:!!cfg.passives&&th.id==='politik', kas:0, kasStage:0, story:0, newsEnabled:cfg.news!==false, news:null, baliho:null, lastSum:7, fajar:false};
  toast('Urutan main: '+order.map(function(i){return S.players[i].name;}).join(', '));
  save(); return S;
}
function startTurn(){if(S.phase!=='handoff')return; S.phase='turn'; save();}

function salary(p){var a=salaryAmt()+(hasP(p,'banteng')?30000:0);p.money+=a; p.laps++; emit({t:'money',pid:p.id,d:a}); emit({t:'salary',pid:p.id}); sfx('coin'); if(hasP(p,'banteng'))pEmit(p,'banteng',p.name+' dapat iuran partai +Rp30rb');}
function walk(p,n,mode){var from=p.pos,path=[];for(var k=0;k<n;k++){p.pos=(p.pos+1)%NT;path.push(p.pos);if(p.pos===0)salary(p);} S.anim={pid:p.id,from:from,path:path,mode:mode||'walk',dbl:p.doubles}; S.phase='moving'; save();}
function walkTo(p,target,mode){var n=(target-p.pos+NT)%NT; if(n===0)n=NT; walk(p,n,mode);}
function walkBack(p,n){var from=p.pos,path=[];for(var k=0;k<n;k++){p.pos=(p.pos+NT-1)%NT;path.push(p.pos);} S.anim={pid:p.id,from:from,path:path,mode:'walk'}; S.phase='moving'; save();}
function jumpTo(p,i,mode){var from=p.pos; p.pos=i; S.anim={pid:p.id,from:from,path:[i],jump:true,mode:mode||'jump'}; S.phase='moving'; save();}
function sendJail(p,anim){p.rolledDouble=false;p.doubles=0;var cs=TH_().ottCases;emit({t:anim||'karam',pid:p.id,caseText:cs?cs[Math.floor(Math.random()*cs.length)]:''});if(anim==='ott')emit({t:'quip',pid:p.id,key:'lawan'});jumpTo(p,IDX.jail,anim||'karam');}

/* ---- dice: power 0..1 biases the sum (0 = small, 1 = big), every sum stays possible ---- */
var ROLL_K=1.6;
function rollPower(pw){return (typeof pw==='number'&&isFinite(pw))?Math.max(0,Math.min(1,pw)):0.5;}
function gemoyDice(p){return !!(p&&S&&S.passives&&!p.bankrupt&&p.char==='gemoy');}
/* list of the 36 ordered pairs with their weight (normalised); doubles get prob 0.25 total for gemoy */
function rollPairs(pw,p){pw=rollPower(pw);var a,b,out=[],sd=0,sn=0;
  for(a=1;a<=6;a++)for(b=1;b<=6;b++){var w=Math.exp(ROLL_K*(pw-0.5)*(a+b-7)/5);out.push({a:a,b:b,w:w});if(a===b)sd+=w;else sn+=w;}
  var gm=gemoyDice(p),tot=sd+sn;out.forEach(function(o){o.w=gm?(o.a===o.b?0.25*o.w/sd:0.75*o.w/sn):o.w/tot;});return out;}
/* probability of each sum 2..12 (index = sum) */
function rollDist(pw,p){var d=[0,0,0,0,0,0,0,0,0,0,0,0,0];rollPairs(pw,p).forEach(function(o){d[o.a+o.b]+=o.w;});return d;}
function rollAvg(pw,p){var d=rollDist(pw,p),m=0;for(var k=2;k<=12;k++)m+=k*d[k];return m;}
function rollDice(pw,p){var pr=rollPairs(pw,p),r=Math.random(),acc=0;for(var k=0;k<pr.length;k++){acc+=pr[k].w;if(r<acc)return [pr[k].a,pr[k].b];}var l=pr[pr.length-1];return [l.a,l.b];}
function roll(power){
  if(S.phase!=='turn')return; var p=cur(); if(p.pelni)return;
  var dv=rollDice(power,p),a=dv[0],b=dv[1],dbl=a===b,sum=a+b; S.dice=[a,b]; S.lastSum=sum; emit({t:'dice'});
  if(p.inJail){
    if(dbl){p.inJail=false;p.jailTurns=0;p.rolledDouble=false; toast('Double! '+p.name+' bebas dari '+tileName(IDX.jail),'good'); if(gemoyDice(p))pEmit(p,'gemoy',p.name+' joget, dadunya double terus'); return walk(p,sum);}
    p.jailTurns++;
    if(p.jailTurns>=jailMax(p)){p.inJail=false;p.jailTurns=0;p.rolledDouble=false; toast('Sudah '+jailMax(p)+' giliran. '+p.name+' akhirnya bebas!'); if(hasP(p,'imam'))pEmit(p,'imam',p.name+' dibela massa aksi, cuma ditahan 2 giliran'); return walk(p,sum);}
    toast('Belum double. Masih '+TH_().jailVerb+' '+(jailMax(p)-p.jailTurns)+' giliran lagi'); S.phase='end'; save(); return;
  }
  if(dbl){p.doubles++; if(p.doubles>=3){toast('3x double berturut-turut! Kebablasan...','bad'); return sendJail(p,S.theme==='politik'?'ott':'karam');} p.rolledDouble=true;
    if(hasP(p,'gemoy')){alivePlayers().forEach(function(o){if(o.id!==p.id&&S.phase!=='over')pay(o.id,10000,p.id);});pEmit(p,'gemoy',p.name+' joget dapat double, semua lawan bayar Rp10rb');}}
  else p.rolledDouble=false;
  walk(p,sum);
}
function payAppeal(){var p=cur(),fee=appealFee(); if(S.phase!=='turn'||!p.inJail||p.money<fee||p.appealed)return; payKas(p.id,fee,kasPart()); p.appealed=true; if(S.phase==='over')return save();
  if(hasP(p,'taro'))pEmit(p,'taro',p.name+' ahli hukum, peluang banding 75%');
  if(Math.random()<(hasP(p,'taro')?0.75:0.5)){p.inJail=false;p.jailTurns=0;toast((S.theme==='politik'?'Banding dikabulkan! ':'Berhasil! ')+p.name+' bebas. Silakan kocok dadu','good big');emit({t:'appeal',ok:true,pid:p.id});}
  else{toast((S.theme==='politik'?'Banding ditolak. ':'Gagal. ')+p.name+' tetap '+TH_().jailVerb+'. Masih bisa coba double','bad big');emit({t:'appeal',ok:false,pid:p.id});if(S.theme==='politik')emit({t:'quip',pid:p.id,key:'lawan'});}
  save();}
function jailFee(){return S&&S.theme==='politik'?250000:JAIL_FEE;}
function payJail(){var p=cur(),fee=jailFee(); if(S.phase!=='turn'||!p.inJail||p.money<fee)return; payKas(p.id,fee,kasPart()); if(S.phase==='over')return save(); p.inJail=false; p.jailTurns=0; if(S.theme==='politik')emit({t:'quip',pid:p.id,key:'sogok'}); toast(p.name+(S.theme==='politik'?' sogok hakim ':' bayar ')+fmt(fee)+' dan bebas. Silakan kocok dadu'); save();}
function pelniTo(i){var p=cur(); i=+i; if(S.phase!=='turn'||!p.pelni||i===p.pos||!(i>=0&&i<NT))return; p.pelni=false; p.rolledDouble=false; toast(p.name+(S.theme==='politik'?' blusukan lewat gorong-gorong ke ':' berlayar ke ')+tileName(i)); walkTo(p,i,S.theme==='politik'?'sewer':'ship');}
/* escalation: +1 step every 2 rounds (Politik only) */
function escStep(){return S&&S.theme==='politik'?Math.floor(Math.max(0,(S.round||1)-1)/2):0;}
function punglRate(){return Math.min(0.20,0.10+0.01*escStep());}
function parkirFee(){return Math.min(5000,PARKIR_PER+500*escStep());}
function parkirTotal(){return parkirFee()*Math.max(1,S.lastSum||1);}
function punglAmt(pid){return Math.round(propValue(pid)*punglRate()/1000)*1000;}

function ask(pd){S.pending=pd; S.phase='prompt'; save();}
function drawCard(kind){var key=kind==='dana'?'danaDeck':'chanceDeck',list=TH_()[kind];if(!S[key]||!S[key].length)S[key]=shuffle(list.map(function(_,k){return k;}));return S[key].pop();}
function land(){
  if(S.phase!=='moving')return; S.anim=null; var p=cur(), i=p.pos, t=T[i]; S.phase='resolve';
  emit({t:'landed',pid:p.id,tile:i});
  switch(t.type){
    case 'start': return finish();
    case 'jail': if(S.theme==='politik'){var cs2=TH_().ottCases;emit({t:'ott',pid:p.id,caseText:cs2[Math.floor(Math.random()*cs2.length)]});emit({t:'quip',pid:p.id,key:'lawan'});}
      p.inJail=true;p.jailTurns=0;p.rolledDouble=false;p.doubles=0; toast(p.name+' '+TH_().jailVerb+'! '+(S.theme==='politik'?'Pilih: ikuti masa tahanan, banding, atau sogok hakim':'Butuh double atau bayar untuk keluar'),'bad'); sfx('bad'); return finish();
    case 'festival': if(ownedCities(p.id).length)return ask({type:'festival'}); toast(tileName(i)+'! Sayang belum punya kota buat dirayakan'); return finish();
    case 'pelni': if(p.money>=pelniFee(p))return ask({type:'pelni'}); toast('Uang belum cukup buat '+tileName(i)); return finish();
    case 'parkir': var pf=parkirTotal(); emit({t:'parkir',pid:p.id,amt:pf}); toast('Parkir '+fmt(parkirFee())+' x '+(S.lastSum||1)+' langkah = '+fmt(pf),'bad'); sfx('pay'); payKas(p.id,pf,kasPart()); if(S.phase==='over')return save(); return finish();
    case 'transport': case 'wisata': return landAsset(p,i);
    case 'chance': case 'dana': sfx('card'); var ci=drawCard(t.type),cd=TH_()[t.type][ci];
      if(cd.kind==='bad'&&t.type==='chance'&&useP(p,'gaberner')){pEmit(p,'gaberner',p.name+' merangkai kata, kartu "'+cd.name+'" dibatalkan');return finish();}
      if(cd.kind==='bad'&&useP(p,'zonk')){pEmit(p,'zonk',p.name+' anti zonk, kartu "'+cd.name+'" diganti');ci=drawCard(t.type);}
      return ask({type:'card',deck:t.type,card:ci});
    case 'tax': var amt=punglAmt(p.id);
      emit({t:'pungli',pid:p.id,amt:amt});
      if(amt>0){toast(tileName(i)+': '+p.name+' bayar '+fmt(amt),'bad'); sfx('pay'); payKas(p.id,amt,kasPart()); alivePlayers().forEach(function(o){if(o.id!==p.id&&hasP(o,'ratupajak')){var cut=Math.round(amt*0.2/1000)*1000;if(cut>0){bankGain(o,cut);pEmit(o,'ratupajak',o.name+' ratu pajak, kecipratan '+fmt(cut)+' dari pungli '+p.name);}}});} else toast('Belum punya properti, bebas '+tileName(i).toLowerCase());
      if(S.phase==='over')return save(); return finish();
    case 'city': return landCity(p,i);
  }
  finish();
}
function landCity(p,i){
  var st=S.tiles[i];
  if(st.owner===null){ if(buyOptions(p,i).length)return ask({type:'buy',tile:i}); toast('Uang belum cukup buat beli '+tileName(i)); return finish(); }
  if(st.owner===p.id){ if(upgradeOptions(p,i).length)return ask({type:'upgrade',tile:i}); return finish(); }
  var owner=P(st.owner), rent=cityRent(i); if(hasP(p,'opung')&&rent>0){rent=Math.round(rent*0.85);pEmit(p,'opung',p.name+' Lord, sewanya didiskon 15%');}
  if(rent>0&&S.festival===i&&hasP(owner,'pinguin'))pEmit(owner,'pinguin',owner.name+' rambut putih, sewa kampanye x1,5 lagi');
  if(rent<=0){toast(sealed(i)?tileName(i)+' lagi disegel. Gratis lewat!':tileName(i)+' lagi kebanjiran. Gratis lewat!');return finish();}
  if(rent>=300000)emit({t:'quip',pid:st.owner,key:'repot'});
  toast(p.name+' bayar sewa '+fmt(rent)+' ke '+owner.name,'bad'); sfx('pay');
  pay(p.id,rent,st.owner);
  if(S.phase==='over')return save();
  var sw=(!p.bankrupt&&st.owner!==null&&st.owner!==p.id)?swapCandidate(p,i):null;
  if(!p.bankrupt && st.owner!==null && st.owner!==p.id && st.level<4 && (p.money>=takeoverPrice(i)||sw!=null)) return ask({type:'takeover',tile:i,swap:sw,rent:rent,owner:st.owner});
  finish();
}
function landAsset(p,i){
  var st=S.tiles[i];
  if(st.owner===null){ if(p.money>=assetPrice(i,p))return ask({type:'buywis',tile:i}); toast('Uang belum cukup buat beli '+tileName(i)); return finish(); }
  if(st.owner===p.id)return finish();
  var rent=rentOf(i); if(hasP(p,'opung')&&rent>0){rent=Math.round(rent*0.85);pEmit(p,'opung',p.name+' Lord, sewanya didiskon 15%');}
  toast(p.name+' bayar '+fmt(rent)+' ke '+P(st.owner).name+' di '+tileName(i),'bad'); sfx('pay');
  pay(p.id,rent,st.owner); if(S.phase==='over')return save(); finish();
}
var landWis=landAsset;
function spend(p,amt){p.money-=amt; emit({t:'money',pid:p.id,d:-amt}); emit({t:'spend',pid:p.id,amt:amt});}
function gain(p,amt){p.money+=amt; emit({t:'money',pid:p.id,d:amt}); emit({t:'gain',pid:p.id,amt:amt}); sfx('coin');}
function pay(fid,amt,tid){
  var p=P(fid); amt=Math.round(amt); if(amt<=0||p.bankrupt)return 0;
  if(p.money<amt)liquidate(fid,amt);
  var got=Math.min(p.money,amt); p.money-=got; if(got)emit({t:'money',pid:fid,d:-got});
  if(tid!=null&&got>0){P(tid).money+=got; emit({t:'money',pid:tid,d:got}); emit({t:'transfer',from:fid,to:tid,amt:got});}
  if(got<amt)goBankrupt(fid);
  return got;
}
function payBank(fid,amt){var got=pay(fid,amt,null); if(got>0){S.kas=(S.kas||0)+got; emit({t:'toKas',from:fid,amt:got}); checkKas();} return got;}
/* share of pungli / parkir / court fees that reaches the kas (Politik); the rest just vanishes */
function kasPart(){return S&&S.theme==='politik'?KAS_PART:1;}
function payKas(fid,amt,frac){var got=pay(fid,amt,null); if(got<=0)return got; var k=frac>=1?got:Math.round(got*frac/1000)*1000;
  if(k>0){S.kas=(S.kas||0)+k; emit({t:'toKas',from:fid,amt:k});} if(got>k)emit({t:'raib',pid:fid,amt:got-k}); if(k>0)checkKas(); return got;}
/* tax straight from cash into the kas, never more than the player holds (no liquidation) */
function kasTax(p,amt,why){if(!p||p.bankrupt||S.phase==='over')return 0;amt=Math.min(Math.round(amt/1000)*1000,p.money);if(amt<=0)return 0;
  p.money-=amt; emit({t:'money',pid:p.id,d:-amt}); S.kas=(S.kas||0)+amt; emit({t:'toKas',from:p.id,amt:amt}); emit({t:'kasTax',pid:p.id,amt:amt,why:why}); checkKas(); return amt;}
function txTaxAmt(cost){return S&&S.theme==='politik'&&cost>0?Math.max(1000,Math.round(cost*TX_TAX/1000)*1000):0;}
function txTax(p,cost){var a=txTaxAmt(cost);return a?kasTax(p,a,'transaksi'):0;}
function yearTaxAmt(pid){return Math.max(YEAR_TAX_MIN,Math.round(assets(pid)*YEAR_TAX/1000)*1000);}
function yearTax(){if(!S||S.theme!=='politik')return;alivePlayers().forEach(function(q){if(S.phase!=='over')kasTax(q,yearTaxAmt(q.id),'tahunan');});}
function checkKas(){
  if(S.phase==='over'||(S.kas||0)<kasLimit())return;
  var pot=S.kas,alive=alivePlayers(); S.kas=0;
  if(S.theme==='politik'){
    var from=storyStage(),to=from>=8?1:from+1; S.story=to; S.kasStage=Math.min(3,to);
    var poor=alive.slice().sort(function(a,b){return a.money-b.money;})[0],half=Math.round(pot/2);
    if(to>1){poor.money+=half; emit({t:'money',pid:poor.id,d:half});}
    toast(STORY[to].n.toUpperCase()+'! '+STORY[to].t+(to>1?' Separuh kas jadi bansos untuk '+poor.name+', separuh lagi raib.':''),'bad big');
    if(to===1)S.kas=pot;
    emit({t:'story',stage:to,from:from});
  } else {
    var each=Math.floor(pot/2/alive.length/1000)*1000;
    alive.forEach(function(q){q.money+=each; emit({t:'money',pid:q.id,d:each});});
    toast('Kas pesisir penuh! Separuh buat pesta pantai, sisanya dibagi: semua pemain dapat '+fmt(each),'good big'); emit({t:'beachParty'}); sfx('festival');
  }
}
function releaseTile(i){S.tiles[i]={owner:null,level:-1}; if(S.festival===i){S.festival=null;S.festLevel=0;} if(S.baliho&&S.baliho.tile===i)S.baliho=null;}
function liquidate(pid,need){
  var list=ownedTiles(pid).sort(function(a,b){return invested(a)-invested(b);});
  while(P(pid).money<need&&list.length){var i=list.shift(),v=Math.round(invested(i)*0.5);emit({t:'collapse',tiles:[{i:i,level:S.tiles[i].level,color:P(pid).color}]}); releaseTile(i); P(pid).money+=v; emit({t:'money',pid:pid,d:v}); toast(P(pid).name+' jual '+tileName(i)+' ke bank ('+fmt(v)+')');}
}
function goBankrupt(pid){var p=P(pid); p.bankrupt=true; p.inJail=false; p.pelni=false;
  var tl=ownedTiles(pid);emit({t:'collapse',tiles:tl.map(function(i){return {i:i,level:S.tiles[i].level,color:p.color};})}); tl.forEach(releaseTile);
  toast(p.name+' BANGKRUT!','bad big'); sfx('broke'); checkWin();}
function checkWin(){
  if(S.phase==='over')return true;
  var alive=alivePlayers(), w=null;
  if(alive.length===1)w={pid:alive[0].id,how:'Sultan Terakhir'};
  else for(var k=0;k<alive.length&&!w;k++){var id=alive[k].id;
    if(countWis(id)>=WIS_WIN)w={pid:id,how:TH_().wisataLabel+' Monopoli'};
    else if(fullRegions(id)>=3)w={pid:id,how:'Triple Monopoli'};
    else for(var j=0;j<4;j++){if(JALUR[j].every(function(i){return S.tiles[i].owner===id;})){w={pid:id,how:'Line Monopoli (Jalur '+(j+1)+')'};break;}}
  }
  if(!w)return false;
  S.winner=w; S.phase='over'; S.pending=null; S.anim=null; sfx('win'); save(); return true;
}
function endByLimit(){
  var best=alivePlayers().sort(function(a,b){return assets(b.id)-assets(a.id);})[0];
  S.winner={pid:best.id,how:'Ronde habis · aset terbesar'}; S.phase='over'; sfx('win'); save();
}
function threatOf(pid){
  if(countWis(pid)===WIS_WIN-1)return TH_().wisataLabel;
  for(var j=0;j<4;j++){var own=JALUR[j].filter(function(i){return S.tiles[i].owner===pid;}).length; if(own===JALUR[j].length-1)return 'Jalur '+(j+1);}
  if(fullRegions(pid)===2){for(var r=0;r<REGIONS.length;r++){var rt=regionTiles(r),o=rt.filter(function(i){return S.tiles[i].owner===pid;}).length; if(o===rt.length-1)return 'Triple';}}
  return null;
}
function updateThreats(){
  alivePlayers().forEach(function(p){var t=threatOf(p.id); if(t&&S.threats[p.id]!==t){toast('Ancaman Monopoli! '+p.name+' tinggal 1 langkah ('+t+')','bad big'); sfx('alarm');} S.threats[p.id]=t;});
  S.players.forEach(function(p){if(p.bankrupt)S.threats[p.id]=null;});
}
function finish(){
  if(S.phase==='over'){save();return;}
  var p=cur(); S.pending=null; updateThreats();
  if(!p.bankrupt&&p.rolledDouble&&!p.inJail&&!p.pelni){S.phase='turn'; toast('Double! Kocok lagi','good');}
  else S.phase='end';
  save();
}
function choose(opt){
  if(S.phase!=='prompt')return; var pd=S.pending,p=cur(),st; S.pending=null; S.phase='resolve';
  switch(pd.type){
    case 'buy':
      if(opt==='skip')return finish();
      var lvl=+opt,cost=buyCost(pd.tile,lvl); if(p.money<cost||(stepMode()&&lvl>0))return finish();
      if(cost===0&&canUseP(p,'instan')){useP(p,'instan');pEmit(p,'instan',p.name+' karbitan, izin lahan pertama gratis');} if(cost>0){spend(p,cost);txTax(p,cost);} S.tiles[pd.tile]={owner:p.id,level:lvl}; onBuild(p,true); sfx('buy'); emit({t:'build',tile:pd.tile,level:lvl});
      toast(p.name+' ambil '+tileName(pd.tile)+(lvl>0?' + '+levelName(lvl):''),'good');
      if(checkWin())return; return finish();
    case 'upgrade':
      if(opt==='skip')return finish();
      st=S.tiles[pd.tile]; var lv=+opt,c2=upCost(pd.tile,lv); if(p.money<c2||lv<=st.level)return finish();
      spend(p,c2); txTax(p,c2); st.level=lv; onBuild(p,true); emit({t:'build',tile:pd.tile,level:lv});
      if(lv===4){toast(levelName(4).toUpperCase()+'! '+T[pd.tile].landmark+' berdiri di '+tileName(pd.tile),'good big'); sfx('landmark'); emit({t:'landmark',tile:pd.tile});}
      else {toast(p.name+' bangun '+levelName(lv)+' di '+tileName(pd.tile),'good'); sfx('build');}
      return finish();
    case 'takeover':
      if(opt==='swap'&&pd.swap!=null&&useP(p,'slepet')){var tg=S.tiles[pd.tile],mine=S.tiles[pd.swap],other=tg.owner;if(other===null||mine.owner!==p.id)return finish();
        emit({t:'takeover',tile:pd.tile,from:other,to:p.id,level:tg.level});emit({t:'takeover',tile:pd.swap,from:p.id,to:other,level:mine.level});
        tg.owner=p.id;mine.owner=other;if(S.baliho&&(S.baliho.tile===pd.tile||S.baliho.tile===pd.swap))S.baliho=null;sfx('takeover');pEmit(p,'slepet',p.name+' pindah kubu, tukar kota dengan '+P(other).name);
        toast('PINDAH KUBU! '+p.name+' tukar '+tileName(pd.swap)+' dengan '+tileName(pd.tile)+' milik '+P(other).name,'big');if(checkWin())return;return finish();}
      if(opt!=='yes')return finish();
      st=S.tiles[pd.tile]; var price=takeoverPrice(pd.tile),prev=st.owner; if(prev===null||p.money<price||st.level>=4)return finish();
      if(useP(P(prev),'micmati')){toast('MATIKAN MIC! '+P(prev).name+' menolak gusur di '+tileName(pd.tile),'bad big');pEmit(P(prev),'micmati',P(prev).name+' matikan mic, gusur ditolak');emit({t:'quip',pid:prev,key:'mic'});return finish();}
      emit({t:'takeover',tile:pd.tile,from:prev,to:p.id,level:st.level}); emit({t:'quip',pid:p.id,key:'sorry'});
      if(hasP(p,'gusur'))pEmit(p,'gusur',p.name+' gusur murah, biaya gusur -15%');
      pay(p.id,price,prev); txTax(p,price); st.owner=p.id; sfx('takeover');
      if(S.baliho&&S.baliho.tile===pd.tile)S.baliho=null;
      toast((S.theme==='politik'?'PENGGUSURAN! ':'TAKEOVER! ')+p.name+' ambil alih '+tileName(pd.tile)+' dari '+P(prev).name,'big');
      if(checkWin())return;
      if(upgradeOptions(p,pd.tile).length)return ask({type:'upgrade',tile:pd.tile});
      return finish();
    case 'buywis':
      var ap=assetPrice(pd.tile,p); if(opt!=='yes'||p.money<ap)return finish();
      spend(p,ap); txTax(p,ap); if(hasP(p,'izin'))pEmit(p,'izin',p.name+' izin kilat, harga -20%'); S.tiles[pd.tile]={owner:p.id,level:0}; sfx('buy'); emit({t:'build',tile:pd.tile,level:0}); toast(p.name+' ambil '+tileName(pd.tile),'good');
      if(checkWin())return; return finish();
    case 'festival':
      if(opt!=='skip'&&S.tiles[+opt]&&S.tiles[+opt].owner===p.id&&T[+opt].type==='city'){var fi=+opt;
        if(S.festival===fi){S.festLevel=Math.min(4,(S.festLevel||2)+1); toast(tileName(IDX.fest)+' di '+tileName(fi)+' makin meriah! Sewa x'+S.festLevel,'good big');}
        else{S.festival=fi; S.festLevel=2; toast(tileName(IDX.fest)+' pindah ke '+tileName(fi)+'! Sewa x2','good');}
        sfx('festival'); emit({t:'festival',tile:fi,pid:p.id});}
      return finish();
    case 'pelni':
      if(opt==='yes'&&p.money>=pelniFee(p)){if(pelniFee(p))payBank(p.id,pelniFee(p));else pEmit(p,'solo',p.name+' blusukan gratis'); p.pelni=true; p.rolledDouble=false; toast(S.theme==='politik'?p.name+' siap blusukan. Giliran berikutnya bebas pilih tujuan':p.name+' naik Kapal Pelni. Giliran berikutnya bebas pilih tujuan');}
      if(S.phase==='over')return save();
      return finish();
    case 'card': return applyCard(pd.deck||'chance',pd.card);
  }
  finish();
}
function bestCity(pid,filt){return ownedCities(pid).filter(filt).sort(function(a,b){return invested(b)-invested(a);})[0];}
/* card money scales with start money (card amounts are written for Rp1,5jt) */
var CARD_MONEY={gain:1,pay:1,collect:1,payAll:1,robin:1};
function cardAmt(c){if(!c)return 0;if(!CARD_MONEY[c.fx])return c.amt;var sm=(S&&S.startMoney)||1500000;return Math.max(1000,Math.round(c.amt*sm/1500000/1000)*1000);}
function cardText(deck,ci){var c=TH_()[deck][ci];if(!c)return '';if(!CARD_MONEY[c.fx])return c.text;var a=fmt(cardAmt(c));return c.text.replace(/Rp\s?\d{1,3}(?:\.\d{3})+|Rp\s?\d+(?:rb)?|\b\d+rb\b/g,a);}
function stoikAmt(p,a){if(!hasP(p,'stoik'))return a;pEmit(p,'stoik',p.name+' dikotomi kendali, dendanya separuh');return Math.round(a/2/1000)*1000;}
function applyCard(deck,ci){
  var c=TH_()[deck][ci],p=cur(),others=alivePlayers().filter(function(o){return o.id!==p.id;}),k,ca=cardAmt(c);
  switch(c.fx){
    case 'gain': gain(p,ca); break;
    case 'pay': sfx('pay'); payBank(p.id,stoikAmt(p,ca)); break;
    case 'payPct': var amt=Math.round(p.money*c.amt/1000)*1000; if(amt>0){amt=stoikAmt(p,amt);sfx('pay');payBank(p.id,amt);} break;
    case 'collect': others.forEach(function(o){if(S.phase!=='over')pay(o.id,ca,p.id);}); sfx('coin'); break;
    case 'payAll': var pa=others.length?stoikAmt(p,ca):0; others.forEach(function(o){if(!p.bankrupt&&S.phase!=='over')pay(p.id,pa,o.id);}); break;
    case 'robin': var al=alivePlayers().slice().sort(function(a,b){return b.money-a.money;});
      if(al.length>1&&al[0].id!==al[al.length-1].id){toast(al[0].name+' bayar '+fmt(ca)+' ke '+al[al.length-1].name); pay(al[0].id,ca,al[al.length-1].id);} break;
    case 'jail': return sendJail(p,c.anim);
    case 'toStart': return walkTo(p,0);
    case 'goto': return walkTo(p,c.amt);
    case 'back': return walkBack(p,c.amt);
    case 'upgrade':
      k=ownedCities(p.id).filter(function(i){return S.tiles[i].level<3;}).sort(function(a,b){return tileL(b)-tileL(a)||S.tiles[a].level-S.tiles[b].level;})[0];
      if(k!=null){S.tiles[k].level++; emit({t:'build',tile:k,level:S.tiles[k].level}); toast(tileName(k)+' naik jadi '+levelName(S.tiles[k].level)+' gratis','good'); sfx('build');} else toast('Belum ada yang bisa di-upgrade. Kartu hangus');
      break;
    case 'quake':
      k=bestCity(p.id,function(i){var l=S.tiles[i].level;return l>=1&&l<=3;});
      emit({t:c.anim==='mangkrak'?'mangkrak':'quake',tile:k==null?null:k,level:k==null?null:S.tiles[k].level,color:p.color}); sfx(c.anim==='mangkrak'?'bad':'quake'); if(c.anim==='mangkrak')emit({t:'quip',pid:p.id,key:'asing'});
      if(k!=null){var lv0=S.tiles[k].level;S.tiles[k].level--; toast('Bangunan di '+tileName(k)+' turun jadi '+levelName(S.tiles[k].level),'bad');if(hasP(p,'prihatin')){var comp=Math.round(tileL(k)*(CUM[lv0]-CUM[lv0-1])/1000)*1000;bankGain(p,comp);pEmit(p,'prihatin',p.name+' prihatin, dapat ganti '+fmt(comp));}} else toast('Aman, belum ada bangunan yang bisa rusak');
      break;
    case 'festOff': if(S.festival!=null){toast(tileName(IDX.fest)+' di '+tileName(S.festival)+' bubar'); S.festival=null; S.festLevel=0;} else toast('Tidak ada '+tileName(IDX.fest)+' yang aktif'); break;
    case 'swap': if(others.length){var o=others[Math.floor(Math.random()*others.length)],tmp=p.pos;p.pos=o.pos;o.pos=tmp;emit({t:'swap',a:p.id,b:o.id});toast(p.name+' tukar posisi dengan '+o.name);} break;
    case 'baliho': k=bestCity(p.id,function(){return true;}); if(k!=null){S.baliho={tile:k,until:S.round+1,owner:p.id};emit({t:'baliho',tile:k});toast(c.name+' di '+tileName(k)+'! Sewa x1,5','good');} else toast('Belum punya kota. Kartu hangus'); break;
  }
  if(S.phase==='over')return save();
  finish();
}
function startNews(){
  if(!S.newsEnabled)return; var list=TH_().news,n=list[Math.floor(Math.random()*list.length)];
  S.news={id:n.id,round:S.round};
  if(n.id==='viral'){var w=[];for(var i=0;i<NT;i++)if(T[i].type==='wisata')w.push(i);S.news.tile=w[Math.floor(Math.random()*w.length)];}
  if(n.id==='demo'){var cs=[];for(var j=0;j<NT;j++)if(T[j].type==='city'&&S.tiles[j].owner!==null)cs.push(j);if(!cs.length)for(var j2=0;j2<NT;j2++)if(T[j2].type==='city')cs.push(j2);S.news.tile=cs[Math.floor(Math.random()*cs.length)];}
  emit({t:'news',id:n.id,name:n.name,text:n.text+((n.id==='viral'||n.id==='demo')?' ('+tileName(S.news.tile)+')':''),tile:S.news.tile});
  alivePlayers().forEach(function(q){if(hasP(q,'dungu')){bankGain(q,30000);pEmit(q,'dungu',q.name+' jadi narasumber, dapat Rp30rb');}});
  if(n.id==='krismon'){alivePlayers().forEach(function(q){var a=Math.round(q.money*0.1/1000)*1000;if(a>0&&S.phase!=='over')payKas(q.id,a,kasPart());});}
}
function endTurn(){
  if(S.phase!=='end')return; var p=cur(); p.doubles=0; p.rolledDouble=false; p.appealed=false; p.turns=(p.turns||0)+1; if(hasP(p,'fufufafa')&&p.turns%3===0){bankGain(p,20000);pEmit(p,'fufufafa',p.name+' nggak ngapa-ngapain dapat Rp20rb');}
  var n=S.order.length, idx=S.turnIdx, newRound=false;
  for(var k=1;k<=n;k++){var j=(idx+k)%n; if(!P(S.order[j]).bankrupt){ if(j<=idx){S.round++; newRound=true; if(S.turnLimit&&S.round>S.turnLimit){S.round=S.turnLimit; return endByLimit();}} S.turnIdx=j; S.current=S.order[j]; break;}}
  S.phase='handoff';
  if(newRound)yearTax();
  if(newRound&&S.round%3===1&&S.phase!=='over')startNews();
  if(newRound&&S.turnLimit&&S.round===S.turnLimit&&!S.fajar){S.fajar=true;var th=TH_(),got=[];alivePlayers().forEach(function(q){if(!q.inJail){q.money+=100000;emit({t:'money',pid:q.id,d:100000});got.push(q.id);}});emit({t:'fajar',name:th.fajarName,text:th.fajarText,got:got});}
  if(S.phase==='over')return save();
  if(S.phase!=='handoff')S.phase='handoff';
  save();
}

/* ================= NPC bots: botNext() returns the next action, never executes it ================= */
var BOT_LEVELS=['mudah','sedang','sulit'];
function botLvl(p){return p&&p.npc?(p.level||'sedang'):null;}
function botOpp(p){return alivePlayers().filter(function(o){return o.id!==p.id;});}
function botRemain(){return S.turnLimit?Math.max(1,S.turnLimit-S.round+1):15;}
/* worst single payment the player could face next: highest opponent rent, or the pungli tile */
function botMaxRent(p){var m=punglAmt(p.id);for(var i=0;i<NT;i++){var o=S.tiles[i].owner;if(o!==null&&o!==p.id&&!P(o).bankrupt)m=Math.max(m,rentOf(i));}return m;}
function botBuffer(p){var sm=S.startMoney,lv=botLvl(p);if(lv==='mudah')return 0;if(lv==='sedang')return 0.15*sm;
  return Math.max(0.06*sm,Math.min(0.45*sm,botMaxRent(p)*0.8));}
function botTx(c){return c+txTaxAmt(c);}
function jalurOf(i){for(var j=0;j<JALUR.length;j++)if(JALUR[j].indexOf(i)>=0)return j;return -1;}
/* strategic worth (in rupiah) of p getting tile i: completing / blocking regions, lines, the 5-of-6 group */
function stratValue(p,i){
  var t=T[i],sm=S.startMoney,v=0,own=S.tiles[i].owner,WIN=8*sm,opp=botOpp(p);
  var j=jalurOf(i);
  if(j>=0){var rest=JALUR[j].filter(function(k){return k!==i;}),mine=rest.filter(function(k){return S.tiles[k].owner===p.id;}).length;
    if(mine===rest.length)v+=WIN;else if(mine>=rest.length-2)v+=0.06*sm*mine;
    opp.forEach(function(o){if(rest.every(function(k){return S.tiles[k].owner===o.id;}))v+=0.6*WIN;});}
  if(t.type==='wisata'){var c=countWis(p.id)+1;if(c>=WIS_WIN)v+=WIN;else v+=0.06*sm*c;
    opp.forEach(function(o){if(own!==o.id&&countWis(o.id)>=WIS_WIN-1)v+=0.6*WIN;});}
  if(t.type==='transport')v+=0.04*sm*(countType(p.id,'transport')+1);
  if(t.type==='city'){var rest2=regionTiles(t.region).filter(function(k){return k!==i;});
    if(rest2.every(function(k){return S.tiles[k].owner===p.id;})){v+=0.4*sm;if(fullRegions(p.id)>=2)v+=WIN;}
    else{var m2=rest2.filter(function(k){return S.tiles[k].owner===p.id;}).length,free=rest2.filter(function(k){return S.tiles[k].owner===null;}).length;
      if(m2+free===rest2.length)v+=0.08*sm*(m2+1)/(rest2.length+1);}
    opp.forEach(function(o){if(rest2.every(function(k){return S.tiles[k].owner===o.id;})){v+=0.3*sm;if(fullRegions(o.id)>=2||(own===o.id&&fullRegions(o.id)>=3))v+=0.6*WIN;}});}
  return v;}
/* how good it is for p to land on tile j after a move of s steps */
function evalLanding(p,j,s,full,buf){
  var t=T[j],st=S.tiles[j],sm=S.startMoney;if(buf==null)buf=botBuffer(p);
  switch(t.type){
    case 'city': if(st.owner===null){if(p.money-botTx(buyCost(j,0,p))<buf*0.5)return 0;return 0.25*tileL(j)+(full?0.4*Math.min(stratValue(p,j),sm):0);}
      if(st.owner===p.id)return upgradeOptions(p,j).length?0.15*tileL(j):0;
      return -cityRent(j)*(hasP(p,'opung')?0.85:1);
    case 'wisata': case 'transport': if(st.owner===null){var pr=assetPrice(j,p);if(p.money-botTx(pr)<buf*0.5)return 0;return 0.2*pr+(full?0.4*Math.min(stratValue(p,j),sm):0);}
      if(st.owner===p.id)return 0; return -rentOf(j)*(hasP(p,'opung')?0.85:1);
    case 'tax': return -punglAmt(p.id);
    case 'parkir': return -parkirFee()*(s||7);
    case 'jail': return -0.04*sm;
    case 'chance': case 'dana': return 0.005*sm;
    case 'festival': return ownedCities(p.id).length?0.04*sm:0;
    case 'pelni': return p.money>=pelniFee(p)+buf?0.06*sm:0;
  }
  return 0;}
function botRollEV(p,pw,lv){var d=rollDist(pw,p),ev=0,buf=botBuffer(p),k=lv||{};for(var s=2;s<=12;s++){var j=(p.pos+s)%NT,v=k[j]!=null?k[j]:(k[j]=evalLanding(p,j,s,true,buf));if(p.pos+s>=NT)v+=salaryAmt();ev+=d[s]*v;}return ev;}
function botPower(p){var lv=botLvl(p);if(lv==='mudah')return Math.random();if(lv==='sedang')return 0.35+Math.random()*0.3;
  var memo={},best=0.5,bv=botRollEV(p,0.5,memo);[0,0.25,0.75,1].forEach(function(pw){var ev=botRollEV(p,pw,memo);if(ev>bv+1){bv=ev;best=pw;}});return best;}
function botPelniTile(p){var lv=botLvl(p),best=-1,bv=-1e18;
  if(lv==='mudah'){var t=Math.floor(Math.random()*NT);return t===p.pos?(t+1)%NT:t;}
  var buf=botBuffer(p);for(var j=0;j<NT;j++){if(j===p.pos)continue;var v=evalLanding(p,j,S.lastSum,lv==='sulit',buf)+((j<p.pos||j===0)?salaryAmt():0)+Math.random();if(v>bv){bv=v;best=j;}}
  return best;}
function botJail(p){
  var lv=botLvl(p),af=appealFee(),jf=jailFee(),buf=botBuffer(p),pw=botPower(p);
  if(lv==='mudah'){var r=Math.random();if(!p.appealed&&p.money>=af&&r<0.3)return {a:'appeal'};if(p.money>=jf&&r<0.42)return {a:'payJail'};return {a:'roll',power:pw};}
  if(lv==='sedang'){if(!p.appealed&&p.money-af>=buf)return {a:'appeal'};if(p.appealed&&p.money-jf>=2*buf&&S.round<8)return {a:'payJail'};return {a:'roll',power:0.5};}
  /* sulit: stay inside when the board is dangerous, get out cheaply when there is land to grab */
  var free=0;for(var i=0;i<NT;i++)if(buyable(i)&&S.tiles[i].owner===null)free++;
  var ev=botRollEV(p,pw);
  if(free<4&&ev<0)return {a:'roll',power:pw};
  if(!p.appealed&&p.money-af>=buf)return {a:'appeal'};
  if(p.money-jf>=buf*1.5&&free>=8&&(jailMax(p)-p.jailTurns)>1)return {a:'payJail'};
  return {a:'roll',power:pw};}
function botBuy(p,i){
  var lv=botLvl(p),op=buyOptions(p,i),buf=botBuffer(p),sm=S.startMoney;if(!op.length)return 'skip';
  if(lv==='mudah')return Math.random()<0.6?op[Math.floor(Math.random()*op.length)]:'skip';
  if(lv==='sedang'){if(p.money-botTx(buyCost(i,0,p))<buf)return 'skip';var b=0;op.forEach(function(l){if(p.money-botTx(buyCost(i,l,p))>=2*buf)b=l;});return b;}
  var sv=stratValue(p,i),c0=botTx(buyCost(i,0,p));
  if(p.money-c0<buf&&!(sv>=0.3*sm&&p.money-c0>=0))return 'skip';
  var best=0;op.forEach(function(l){if(p.money-botTx(buyCost(i,l,p))>=buf*1.2)best=l;});return best;}
function botBuyAsset(p,i){
  var lv=botLvl(p),pr=botTx(assetPrice(i,p)),buf=botBuffer(p);if(p.money<assetPrice(i,p))return 'no';
  if(lv==='mudah')return Math.random()<0.6?'yes':'no';
  if(lv==='sedang')return p.money-pr>=buf?'yes':'no';
  return (p.money-pr>=buf||(stratValue(p,i)>=0.3*S.startMoney&&p.money-pr>=0))?'yes':'no';}
function botUpgrade(p,i){
  var lv=botLvl(p),op=upgradeOptions(p,i),buf=botBuffer(p),sm=S.startMoney,b='skip';if(!op.length)return 'skip';
  if(lv==='mudah')return Math.random()<0.2?op[0]:'skip';
  var full=regionFull(p.id,T[i].region);
  if(lv==='sedang'){if(!(tileL(i)<=160000||full||p.money>0.6*sm))return 'skip';op.forEach(function(l){if(p.money-botTx(upCost(i,l))>=buf)b=l;});return b;}
  op.forEach(function(l){var need=(l===4&&full)?buf*0.5:buf;if(p.money-botTx(upCost(i,l))>=need)b=l;});return b;}
function botTakeover(p,pd){
  var lv=botLvl(p),i=pd.tile,st=S.tiles[i],buf=botBuffer(p),sm=S.startMoney;
  var price=takeoverPrice(i,p),can=st.level<4&&p.money>=price,full=st.owner!==null&&regionFull(st.owner,T[i].region);
  if(lv==='mudah')return 'no';
  var swapOk=pd.swap!=null&&!regionFull(p.id,T[pd.swap].region);
  if(lv==='sedang'){if(swapOk&&Math.random()<0.6)return 'swap';
    var comp=regionTiles(T[i].region).every(function(k){return k===i||S.tiles[k].owner===p.id;});
    if(can&&p.money-botTx(price)>=buf&&(comp||full)&&Math.random()<0.6)return 'yes';return 'no';}
  var E=0.175*botOpp(p).length*botRemain(),rentMine=tileL(i)*RENTM[st.level],sv=stratValue(p,i);
  if(swapOk){var lost=stratValue(p,pd.swap)*0.5+tileL(pd.swap)*RENTM[S.tiles[pd.swap].level]*E;
    if(sv+rentMine*E-lost>0)return 'swap';}
  if(!can)return 'no';
  var score=sv+rentMine*E-invested(i);
  if(p.money-botTx(price)>=buf*0.7&&score>0.1*price)return 'yes';
  if(sv>=2*sm&&p.money-botTx(price)>=0)return 'yes';
  return 'no';}
function botFestival(p){
  var cs=ownedCities(p.id);if(!cs.length)return 'skip';var lv=botLvl(p);
  if(lv==='mudah')return cs[Math.floor(Math.random()*cs.length)];
  var best='skip',bv=0;cs.forEach(function(ci){var same=S.festival===ci,lvl=S.festLevel||2;if(same&&lvl>=4)return;var next=same?lvl+1:2;
    var base=tileL(ci)*RENTM[S.tiles[ci].level]*(regionFull(p.id,T[ci].region)?2:1),v=base*Math.min(6,next)-(same?base*lvl:base);if(v>bv){bv=v;best=ci;}});
  return best;}
function botChoose(p,pd){
  switch(pd.type){
    case 'buy': return botBuy(p,pd.tile);
    case 'upgrade': return botUpgrade(p,pd.tile);
    case 'takeover': return botTakeover(p,pd);
    case 'buywis': return botBuyAsset(p,pd.tile);
    case 'festival': return botFestival(p);
    case 'pelni': var lv=botLvl(p),f=pelniFee(p);if(p.money<f)return 'no';
      if(lv==='mudah')return Math.random()<0.5?'yes':'no';return p.money-f>=botBuffer(p)*(lv==='sulit'?0.5:1)?'yes':'no';
    case 'card': return 'ok';
  }
  return 'skip';}
function botNext(){
  if(!S||S.phase==='over')return null;var p=cur();if(!p||!p.npc)return null;if(p.bankrupt)return S.phase==='end'?{a:'end'}:null;
  switch(S.phase){
    case 'handoff': return {a:'start'};
    case 'turn': if(p.pelni)return {a:'pelni',tile:botPelniTile(p)};
      if(p.inJail)return botJail(p);
      return {a:'roll',power:botPower(p)};
    case 'prompt': return S.pending?{a:'choose',opt:botChoose(p,S.pending)}:null;
    case 'end': return {a:'end'};
  }
  return null;}
