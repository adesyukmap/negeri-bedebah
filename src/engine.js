
/* ================= ENGINE: rules only, no DOM ================= */
var START_SALARY=200000, JAIL_FEE=100000, PELNI_FEE=50000, WIS_PRICE=200000, KAS_LIMIT=1000000;
var CUM=[1,1.5,2.5,4,6], RENTM=[0.2,0.6,1.2,2,3], WIS_RENT=[0,50000,150000,400000,400000];
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
var TRANS_PRICE=200000, TRANS_RENT=[0,25000,50000,100000,200000], UTIL_PRICE=150000, UTIL_MUL=[0,5000,12000], PARKIR_PER=2000, APPEAL_FEE=150000;
var T=[
  {type:'start',name:'Start'},
  C('Jayapura',0,'Jembatan Youtefa'), {type:'dana',name:'Dana Umum'}, C('Ambon',0,'Gong Perdamaian'), {type:'wisata',name:'Raja Ampat',deco:'raja'}, {type:'transport',name:'Bandara',deco:'plane'},
  C('Kupang',1,'Sasando'), {type:'chance',name:'Kesempatan'}, C('Mataram',1,'Islamic Center'), C('Labuan Bajo',1,'Komodo'),
  {type:'jail',name:'Pulau Terdampar'},
  C('Manado',2,'Bunaken'), {type:'utility',name:'PLN',deco:'pln'}, C('Palu',2,'Jembatan Kuning'), C('Makassar',2,'Kapal Pinisi'), {type:'transport',name:'Pelabuhan',deco:'ship'},
  {type:'wisata',name:'Borobudur',deco:'boro'}, C('Pontianak',3,'Tugu Khatulistiwa'), C('Banjarmasin',3,'Pasar Terapung'), C('Balikpapan',3,'Beruang Madu'),
  {type:'festival',name:'Pesta Rakyat'},
  C('Padang',4,'Rumah Gadang'), {type:'dana',name:'Dana Umum'}, C('Palembang',4,'Jembatan Ampera'), C('Medan',4,'Istana Maimun'), {type:'transport',name:'Stasiun Kereta Cepat',deco:'train'},
  C('Yogyakarta',5,'Tugu Jogja'), C('Bandung',5,'Gedung Sate','sate'), {type:'utility',name:'PDAM',deco:'pdam'}, C('Surabaya',5,'Suro & Boyo'),
  {type:'pelni',name:'Kapal Pelni'},
  {type:'wisata',name:'Danau Toba',deco:'toba'}, {type:'transport',name:'Terminal Bus',deco:'bus'}, {type:'chance',name:'Kesempatan'}, C('Bali',6,'Candi Bentar'), {type:'wisata',name:'Gunung Bromo',deco:'bromo'},
  {type:'parkir',name:'Parkir Liar'}, {type:'tax',name:'Pajak Juragan'}, {type:'dana',name:'Dana Umum'}, C('Jakarta',6,'Monas','monas')];
var NT=T.length;
var PASSIVES={solo:{n:'Blusukan',d:'Gorong-gorong gratis'},gemoy:{n:'Joget',d:'Tiap dapat double, semua lawan bayar dia Rp10rb'},
  gaberner:{n:'Merangkai Kata',d:'1x per game, kartu Manuver yang merugikan dibatalkan'},pinguin:{n:'Rambut Putih',d:'Kampanye Akbar di kotanya: sewa x1,5 lagi'},
  banteng:{n:'Iuran Partai',d:'Lewat Gajian Pejabat dapat +Rp30rb'},prihatin:{n:'Prihatin',d:'Kena gempa atau mangkrak dapat ganti penuh'},
  opung:{n:'Lord',d:'Sewa yang dia bayar ke lawan -15%'},izin:{n:'Izin Kilat',d:'Konsesi, transportasi, utilitas -20%'},
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
function pToast(p,k,extra){toast(PASSIVES[k].n+' ('+p.name+')'+(extra?': '+extra:''),'good');}
function kasLimit(){return S&&S.theme==='politik'?100000:KAS_LIMIT;}
function jailMax(p){return hasP(p,'imam')?2:3;}
function appealFee(){return S&&S.theme==='politik'?100000:50000;}
function pelniFee(p){return hasP(p,'solo')?0:PELNI_FEE;}
function bankGain(p,amt){if(p&&!p.bankrupt&&amt>0)gain(p,amt);}
function onBuild(p,isCity){if(!S.passives)return;if(isCity&&hasP(p,'konten')){bankGain(p,20000);pToast(p,'konten','+Rp20rb');}
  if(isCity)alivePlayers().forEach(function(o){if(o.id!==p.id&&hasP(o,'saham'))bankGain(o,10000);});}
function swapCandidate(p,i){if(!canUseP(p,'slepet'))return null;var lv=S.tiles[i].level;if(lv>=4)return null;
  var c=ownedCities(p.id).filter(function(j){return S.tiles[j].level===lv&&lv<4&&tileL(i)>tileL(j)&&tileL(i)<=tileL(j)+50000;}).sort(function(a,b){return tileL(b)-tileL(a);})[0];return c==null?null:c;}
function buyable(i){var t=T[i].type;return t==='city'||t==='wisata'||t==='transport'||t==='utility';}
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
    names:{'Raja Ampat':'Konsesi Laut','Borobudur':'Konsesi Nikel','Danau Toba':'Reklamasi','Gunung Bromo':'Kebun Sawit','Bandara':'Bandara Sepi','Pelabuhan':'Pelabuhan Tikus','Stasiun Kereta Cepat':'Kereta Cepat','Terminal Bus':'Terminal Bayangan'},
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
function invested(i){var st=S.tiles[i],t=T[i].type; if(st.owner===null)return 0; if(t==='wisata')return WIS_PRICE; if(t==='transport')return TRANS_PRICE; if(t==='utility')return UTIL_PRICE; return tileL(i)*CUM[st.level];}
function assetPrice(i){var t=T[i].type,b=t==='wisata'?WIS_PRICE:t==='transport'?TRANS_PRICE:UTIL_PRICE;return hasP(cur(),'izin')?Math.round(b*0.8):b;}
function countType(pid,ty){return ownedTiles(pid).filter(function(i){return T[i].type===ty;}).length;}
function ownedTiles(pid){var a=[];for(var i=0;i<NT;i++)if(S.tiles[i].owner===pid)a.push(i);return a;}
function ownedCities(pid){return ownedTiles(pid).filter(function(i){return T[i].type==='city';});}
function countWis(pid){return ownedTiles(pid).filter(function(i){return T[i].type==='wisata';}).length;}
function regionTiles(r){var a=[];for(var i=0;i<NT;i++)if(T[i].type==='city'&&T[i].region===r)a.push(i);return a;}
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
function utilRent(i,sum){var st=S.tiles[i];return st.owner===null?0:UTIL_MUL[countType(st.owner,'utility')]*(sum||7);}
function rentOf(i){var t=T[i].type;return t==='city'?cityRent(i):t==='wisata'?wisRent(i):t==='transport'?transRent(i):t==='utility'?utilRent(i,S.lastSum):0;}
function takeoverPrice(i){return Math.round(invested(i)*2*(hasP(cur(),'gusur')?0.85:1));}
function stepMode(){return (S.buildMode||'bebas')==='bertahap';}
function buyCost(i,l){if(l===0&&canUseP(cur(),'instan'))return 0;return Math.round(tileL(i)*CUM[l]*bmul());}
function upCost(i,l){return Math.round(tileL(i)*(CUM[l]-CUM[S.tiles[i].level])*bmul());}
function buyOptions(p,i){return (stepMode()?[0]:[0,1,2]).filter(function(l){return p.money>=buyCost(i,l);});}
function upgradeOptions(p,i){var c=S.tiles[i].level,lv=[];
  if(c<3){for(var l=c+1;l<=(stepMode()?c+1:3);l++)lv.push(l);} else if(c===3&&p.laps>=1){lv.push(4);}
  return lv.filter(function(l){return p.money>=upCost(i,l);});}
function alivePlayers(){return S.players.filter(function(p){return !p.bankrupt;});}
function salaryAmt(){return START_SALARY*(newsOn('mudik')?2:1);}

function newGame(cfg){
  var order=shuffle(cfg.players.map(function(_,i){return i;})),th=THEMES[cfg.theme||'santai'];
  S={v:2, theme:th.id, players:cfg.players.map(function(p,i){return {id:i,name:p.name,char:p.char,color:PCOLORS[i],money:cfg.money,pos:0,inJail:false,jailTurns:0,doubles:0,rolledDouble:false,pelni:false,laps:0,bankrupt:false};}),
    tiles:T.map(function(){return {owner:null,level:-1};}), order:order, turnIdx:0, current:order[0], round:1, turnLimit:cfg.turnLimit, startMoney:cfg.money, buildMode:cfg.buildMode||'bertahap',
    festival:null, festLevel:0, phase:'handoff', pending:null, dice:[3,4], winner:null, anim:null, threats:{},
    chanceDeck:shuffle(th.chance.map(function(_,i){return i;})), danaDeck:shuffle(th.dana.map(function(_,i){return i;})),
    passives:!!cfg.passives&&th.id==='politik', kas:0, kasStage:0, newsEnabled:cfg.news!==false, news:null, baliho:null, lastSum:7, fajar:false};
  toast('Urutan main: '+order.map(function(i){return S.players[i].name;}).join(', '));
  save(); return S;
}
function startTurn(){if(S.phase!=='handoff')return; S.phase='turn'; save();}

function salary(p){var a=salaryAmt()+(hasP(p,'banteng')?30000:0);p.money+=a; p.laps++; emit({t:'money',pid:p.id,d:a}); emit({t:'salary',pid:p.id}); sfx('coin');}
function walk(p,n,mode){var from=p.pos,path=[];for(var k=0;k<n;k++){p.pos=(p.pos+1)%NT;path.push(p.pos);if(p.pos===0)salary(p);} S.anim={pid:p.id,from:from,path:path,mode:mode||'walk',dbl:p.doubles}; S.phase='moving'; save();}
function walkTo(p,target,mode){var n=(target-p.pos+NT)%NT; if(n===0)n=NT; walk(p,n,mode);}
function walkBack(p,n){var from=p.pos,path=[];for(var k=0;k<n;k++){p.pos=(p.pos+NT-1)%NT;path.push(p.pos);} S.anim={pid:p.id,from:from,path:path,mode:'walk'}; S.phase='moving'; save();}
function jumpTo(p,i,mode){var from=p.pos; p.pos=i; S.anim={pid:p.id,from:from,path:[i],jump:true,mode:mode||'jump'}; S.phase='moving'; save();}
function sendJail(p,anim){p.rolledDouble=false;p.doubles=0;var cs=TH_().ottCases;emit({t:anim||'karam',pid:p.id,caseText:cs?cs[Math.floor(Math.random()*cs.length)]:''});if(anim==='ott')emit({t:'quip',pid:p.id,key:'lawan'});jumpTo(p,IDX.jail,anim||'karam');}

function roll(){
  if(S.phase!=='turn')return; var p=cur(); if(p.pelni)return;
  var a=d6(),b=d6(),dbl=a===b,sum=a+b; S.dice=[a,b]; S.lastSum=sum; emit({t:'dice'});
  if(p.inJail){
    if(dbl){p.inJail=false;p.jailTurns=0;p.rolledDouble=false; toast('Double! '+p.name+' bebas dari '+tileName(IDX.jail),'good'); return walk(p,sum);}
    p.jailTurns++;
    if(p.jailTurns>=jailMax(p)){p.inJail=false;p.jailTurns=0;p.rolledDouble=false; toast('Sudah 3 giliran. '+p.name+' akhirnya bebas!'); return walk(p,sum);}
    toast('Belum double. Masih '+TH_().jailVerb+' '+(jailMax(p)-p.jailTurns)+' giliran lagi'); S.phase='end'; save(); return;
  }
  if(dbl){p.doubles++; if(p.doubles>=3){toast('3x double berturut-turut! Kebablasan...','bad'); return sendJail(p,S.theme==='politik'?'ott':'karam');} p.rolledDouble=true;
    if(hasP(p,'gemoy')){alivePlayers().forEach(function(o){if(o.id!==p.id&&S.phase!=='over')pay(o.id,10000,p.id);});pToast(p,'gemoy','semua lawan bayar Rp10rb');}}
  else p.rolledDouble=false;
  walk(p,sum);
}
function payAppeal(){var p=cur(),fee=appealFee(); if(S.phase!=='turn'||!p.inJail||p.money<fee||p.appealed)return; payBank(p.id,fee); p.appealed=true;
  if(Math.random()<(hasP(p,'taro')?0.75:0.5)){p.inJail=false;p.jailTurns=0;toast((S.theme==='politik'?'Banding dikabulkan! ':'Berhasil! ')+p.name+' bebas. Silakan kocok dadu','good big');emit({t:'appeal',ok:true,pid:p.id});}
  else{toast((S.theme==='politik'?'Banding ditolak. ':'Gagal. ')+p.name+' tetap '+TH_().jailVerb+'. Masih bisa coba double','bad big');emit({t:'appeal',ok:false,pid:p.id});}
  save();}
function jailFee(){return S&&S.theme==='politik'?250000:JAIL_FEE;}
function payJail(){var p=cur(),fee=jailFee(); if(S.phase!=='turn'||!p.inJail||p.money<fee)return; payBank(p.id,fee); p.inJail=false; p.jailTurns=0; if(S.theme==='politik')emit({t:'quip',pid:p.id,key:'sogok'}); toast(p.name+(S.theme==='politik'?' sogok hakim ':' bayar ')+fmt(fee)+' dan bebas. Silakan kocok dadu'); save();}
function pelniTo(i){var p=cur(); if(S.phase!=='turn'||!p.pelni||i===p.pos)return; p.pelni=false; p.rolledDouble=false; toast(p.name+(S.theme==='politik'?' blusukan lewat gorong-gorong ke ':' berlayar ke ')+tileName(i)); walkTo(p,i,S.theme==='politik'?'sewer':'ship');}
function parkirFee(){return PARKIR_PER*Math.max(1,S.lastSum||1);}

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
    case 'parkir': var pf=parkirFee(); emit({t:'parkir',pid:p.id,amt:pf}); toast('Parkir Rp2.000 x '+(S.lastSum||1)+' langkah = '+fmt(pf),'bad'); sfx('pay'); payBank(p.id,pf); if(S.phase==='over')return save(); return finish();
    case 'transport': case 'utility': return landAsset(p,i);
    case 'chance': case 'dana': sfx('card'); var ci=drawCard(t.type),cd=TH_()[t.type][ci];
      if(cd.kind==='bad'&&t.type==='chance'&&useP(p,'gaberner')){toast('Merangkai Kata ('+p.name+'): kartu "'+cd.name+'" dibatalkan','good big');return finish();}
      if(cd.kind==='bad'&&useP(p,'zonk')){toast('Anti Zonk ('+p.name+'): kartu "'+cd.name+'" diganti','good');ci=drawCard(t.type);}
      return ask({type:'card',deck:t.type,card:ci});
    case 'tax': var amt=Math.round(propValue(p.id)*0.1/1000)*1000;
      emit({t:'pungli',pid:p.id,amt:amt});
      if(amt>0){toast(tileName(i)+': '+p.name+' bayar '+fmt(amt),'bad'); sfx('pay'); payBank(p.id,amt); alivePlayers().forEach(function(o){if(o.id!==p.id&&hasP(o,'ratupajak')){var cut=Math.round(amt*0.2/1000)*1000;if(cut>0){bankGain(o,cut);pToast(o,'ratupajak','+'+fmt(cut));}}});} else toast('Belum punya properti, bebas '+tileName(i).toLowerCase());
      if(S.phase==='over')return save(); return finish();
    case 'city': return landCity(p,i);
    case 'wisata': return landWis(p,i);
  }
  finish();
}
function landCity(p,i){
  var st=S.tiles[i];
  if(st.owner===null){ if(buyOptions(p,i).length)return ask({type:'buy',tile:i}); toast('Uang belum cukup buat beli '+tileName(i)); return finish(); }
  if(st.owner===p.id){ if(upgradeOptions(p,i).length)return ask({type:'upgrade',tile:i}); return finish(); }
  var owner=P(st.owner), rent=cityRent(i); if(hasP(p,'opung'))rent=Math.round(rent*0.85);
  if(rent<=0){toast(sealed(i)?tileName(i)+' lagi disegel. Gratis lewat!':tileName(i)+' lagi kebanjiran. Gratis lewat!');return finish();}
  if(rent>=300000)emit({t:'quip',pid:st.owner,key:'repot'});
  toast(p.name+' bayar sewa '+fmt(rent)+' ke '+owner.name,'bad'); sfx('pay');
  pay(p.id,rent,st.owner);
  if(S.phase==='over')return save();
  var sw=(!p.bankrupt&&st.owner!==null&&st.owner!==p.id)?swapCandidate(p,i):null;
  if(!p.bankrupt && st.owner!==null && st.owner!==p.id && st.level<4 && (p.money>=takeoverPrice(i)||sw!=null)) return ask({type:'takeover',tile:i,swap:sw});
  finish();
}
function landAsset(p,i){
  var st=S.tiles[i];
  if(st.owner===null){ if(p.money>=assetPrice(i))return ask({type:'buywis',tile:i}); toast('Uang belum cukup buat beli '+tileName(i)); return finish(); }
  if(st.owner===p.id)return finish();
  var rent=rentOf(i); if(hasP(p,'opung'))rent=Math.round(rent*0.85); toast(p.name+' bayar '+fmt(rent)+' ke '+P(st.owner).name+' di '+tileName(i),'bad'); sfx('pay');
  pay(p.id,rent,st.owner); if(S.phase==='over')return save(); finish();
}
function landWis(p,i){
  var st=S.tiles[i];
  if(st.owner===null){ if(p.money>=assetPrice(i))return ask({type:'buywis',tile:i}); toast('Uang belum cukup buat beli '+tileName(i)); return finish(); }
  if(st.owner===p.id)return finish();
  var rent=wisRent(i); if(hasP(p,'opung'))rent=Math.round(rent*0.85); toast(p.name+' bayar '+fmt(rent)+' ke '+P(st.owner).name+' di '+tileName(i),'bad'); sfx('pay');
  pay(p.id,rent,st.owner); if(S.phase==='over')return save(); finish();
}
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
function checkKas(){
  if(S.phase==='over'||(S.kas||0)<kasLimit())return;
  var pot=S.kas,alive=alivePlayers(); S.kas=0;
  if(S.theme==='politik'){
    S.kasStage=Math.min(3,(S.kasStage||0)+1);
    var poor=alive.slice().sort(function(a,b){return a.money-b.money;})[0],half=Math.round(pot/2);
    poor.money+=half; emit({t:'money',pid:poor.id,d:half});
    toast('Kas pungli tembus '+short(pot)+'! Hutan dibakar jadi sawit. Separuh jadi bansos untuk '+poor.name+', separuh lagi raib entah ke mana','bad big');
    emit({t:'forest',stage:S.kasStage}); sfx('fire');
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
    if(countWis(id)===4)w={pid:id,how:TH_().wisataLabel+' Monopoli'};
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
  if(countWis(pid)===3)return TH_().wisataLabel;
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
      if(cost===0&&canUseP(p,'instan')){useP(p,'instan');pToast(p,'instan','izin lahan gratis');} if(cost>0)spend(p,cost); S.tiles[pd.tile]={owner:p.id,level:lvl}; onBuild(p,true); sfx('buy'); emit({t:'build',tile:pd.tile,level:lvl});
      toast(p.name+' ambil '+tileName(pd.tile)+(lvl>0?' + '+levelName(lvl):''),'good');
      if(checkWin())return; return finish();
    case 'upgrade':
      if(opt==='skip')return finish();
      st=S.tiles[pd.tile]; var lv=+opt,c2=upCost(pd.tile,lv); if(p.money<c2||lv<=st.level)return finish();
      spend(p,c2); st.level=lv; onBuild(p,true); emit({t:'build',tile:pd.tile,level:lv});
      if(lv===4){toast(levelName(4).toUpperCase()+'! '+T[pd.tile].landmark+' berdiri di '+tileName(pd.tile),'good big'); sfx('landmark'); emit({t:'landmark',tile:pd.tile});}
      else {toast(p.name+' bangun '+levelName(lv)+' di '+tileName(pd.tile),'good'); sfx('build');}
      return finish();
    case 'takeover':
      if(opt==='swap'&&pd.swap!=null&&useP(p,'slepet')){var tg=S.tiles[pd.tile],mine=S.tiles[pd.swap],other=tg.owner;if(other===null||mine.owner!==p.id)return finish();
        emit({t:'takeover',tile:pd.tile,from:other,to:p.id,level:tg.level});emit({t:'takeover',tile:pd.swap,from:p.id,to:other,level:mine.level});
        tg.owner=p.id;mine.owner=other;if(S.baliho&&(S.baliho.tile===pd.tile||S.baliho.tile===pd.swap))S.baliho=null;sfx('takeover');
        toast('PINDAH KUBU! '+p.name+' tukar '+tileName(pd.swap)+' dengan '+tileName(pd.tile)+' milik '+P(other).name,'big');if(checkWin())return;return finish();}
      if(opt!=='yes')return finish();
      st=S.tiles[pd.tile]; var price=takeoverPrice(pd.tile),prev=st.owner; if(prev===null||p.money<price||st.level>=4)return finish();
      if(useP(P(prev),'micmati')){toast('MATIKAN MIC! '+P(prev).name+' menolak gusur di '+tileName(pd.tile),'bad big');emit({t:'quip',pid:prev,key:'mic'});return finish();}
      emit({t:'takeover',tile:pd.tile,from:prev,to:p.id,level:st.level}); emit({t:'quip',pid:p.id,key:'sorry'});
      pay(p.id,price,prev); st.owner=p.id; sfx('takeover');
      if(S.baliho&&S.baliho.tile===pd.tile)S.baliho=null;
      toast((S.theme==='politik'?'PENGGUSURAN! ':'TAKEOVER! ')+p.name+' ambil alih '+tileName(pd.tile)+' dari '+P(prev).name,'big');
      if(checkWin())return;
      if(upgradeOptions(p,pd.tile).length)return ask({type:'upgrade',tile:pd.tile});
      return finish();
    case 'buywis':
      if(opt!=='yes'||p.money<assetPrice(pd.tile))return finish();
      spend(p,assetPrice(pd.tile)); S.tiles[pd.tile]={owner:p.id,level:0}; sfx('buy'); emit({t:'build',tile:pd.tile,level:0}); toast(p.name+' ambil '+tileName(pd.tile),'good');
      if(checkWin())return; return finish();
    case 'festival':
      if(opt!=='skip'&&S.tiles[+opt]&&S.tiles[+opt].owner===p.id&&T[+opt].type==='city'){var fi=+opt;
        if(S.festival===fi){S.festLevel=Math.min(4,(S.festLevel||2)+1); toast(tileName(IDX.fest)+' di '+tileName(fi)+' makin meriah! Sewa x'+S.festLevel,'good big');}
        else{S.festival=fi; S.festLevel=2; toast(tileName(IDX.fest)+' pindah ke '+tileName(fi)+'! Sewa x2','good');}
        sfx('festival'); emit({t:'festival',tile:fi,pid:p.id});}
      return finish();
    case 'pelni':
      if(opt==='yes'&&p.money>=pelniFee(p)){if(pelniFee(p))payBank(p.id,pelniFee(p));else pToast(p,'solo','gratis'); p.pelni=true; p.rolledDouble=false; toast(S.theme==='politik'?p.name+' siap blusukan. Giliran berikutnya bebas pilih tujuan':p.name+' naik Kapal Pelni. Giliran berikutnya bebas pilih tujuan');}
      if(S.phase==='over')return save();
      return finish();
    case 'card': return applyCard(pd.deck||'chance',pd.card);
  }
  finish();
}
function bestCity(pid,filt){return ownedCities(pid).filter(filt).sort(function(a,b){return invested(b)-invested(a);})[0];}
function applyCard(deck,ci){
  var c=TH_()[deck][ci],p=cur(),others=alivePlayers().filter(function(o){return o.id!==p.id;}),k;
  switch(c.fx){
    case 'gain': gain(p,c.amt); break;
    case 'pay': sfx('pay'); payBank(p.id,hasP(p,'stoik')?Math.round(c.amt/2):c.amt); if(hasP(p,'stoik'))pToast(p,'stoik','denda separuh'); break;
    case 'payPct': var amt=Math.round(p.money*c.amt*(hasP(p,'stoik')?0.5:1)/1000)*1000; if(amt>0){sfx('pay');payBank(p.id,amt);} break;
    case 'collect': others.forEach(function(o){if(S.phase!=='over')pay(o.id,c.amt,p.id);}); sfx('coin'); break;
    case 'payAll': others.forEach(function(o){if(!p.bankrupt&&S.phase!=='over')pay(p.id,hasP(p,'stoik')?Math.round(c.amt/2):c.amt,o.id);}); break;
    case 'robin': var al=alivePlayers().slice().sort(function(a,b){return b.money-a.money;});
      if(al.length>1&&al[0].id!==al[al.length-1].id){toast(al[0].name+' bayar '+fmt(c.amt)+' ke '+al[al.length-1].name); pay(al[0].id,c.amt,al[al.length-1].id);} break;
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
      if(k!=null){var lv0=S.tiles[k].level;S.tiles[k].level--; toast('Bangunan di '+tileName(k)+' turun jadi '+levelName(S.tiles[k].level),'bad');if(hasP(p,'prihatin')){var comp=Math.round(tileL(k)*(CUM[lv0]-CUM[lv0-1])/1000)*1000;bankGain(p,comp);pToast(p,'prihatin','ganti '+fmt(comp));}} else toast('Aman, belum ada bangunan yang bisa rusak');
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
  alivePlayers().forEach(function(q){if(hasP(q,'dungu')){bankGain(q,30000);pToast(q,'dungu','+Rp30rb jadi narasumber');}});
  if(n.id==='krismon'){alivePlayers().forEach(function(q){var a=Math.round(q.money*0.1/1000)*1000;if(a>0&&S.phase!=='over')payBank(q.id,a);});}
}
function endTurn(){
  if(S.phase!=='end')return; var p=cur(); p.doubles=0; p.rolledDouble=false; p.appealed=false; p.turns=(p.turns||0)+1; if(hasP(p,'fufufafa')&&p.turns%3===0){bankGain(p,20000);pToast(p,'fufufafa','+Rp20rb');}
  var n=S.order.length, idx=S.turnIdx, newRound=false;
  for(var k=1;k<=n;k++){var j=(idx+k)%n; if(!P(S.order[j]).bankrupt){ if(j<=idx){S.round++; newRound=true; if(S.turnLimit&&S.round>S.turnLimit){S.round=S.turnLimit; return endByLimit();}} S.turnIdx=j; S.current=S.order[j]; break;}}
  S.phase='handoff';
  if(newRound&&S.round%3===1)startNews();
  if(newRound&&S.turnLimit&&S.round===S.turnLimit&&!S.fajar){S.fajar=true;var th=TH_(),got=[];alivePlayers().forEach(function(q){if(!q.inJail){q.money+=100000;emit({t:'money',pid:q.id,d:100000});got.push(q.id);}});emit({t:'fajar',name:th.fajarName,text:th.fajarText,got:got});}
  if(S.phase==='over')return save();
  if(S.phase!=='handoff')S.phase='handoff';
  save();
}
