/* ---------- voice over registry: every scene line has a key; audio comes from Hermes (Pocket TTS) or the player's own clip ---------- */
var SLOGANS=['Bangun {city}, pasti cuan!','Harga beras turun minggu depan!','Wifi gratis seumur hidup, mulai periode depan!','Jalan mulus sampai depan rumah, menjelang pemilu!',
  'Makan gratis, dananya dipikir nanti!','19 juta lapangan kerja, tinggal cari lapangannya!','Saya anti korupsi, kecuali kepepet!','Bansos tiap minggu, asal fotonya ada saya!',
  'Utang lunas, tinggal pinjam lagi!','Rakyat sejahtera, keluarga saya duluan!','{city} jadi ibu kota baru, mangkraknya belakangan!'];
var SEL_PAIRS=[['AC-nya kurang dingin nih.','Mau dingin ya bayar, Boss.'],['Kasurnya keras, Pak.','Kasur empuk ada tarifnya, Bos.'],['Kapan remisi, Pak?','Tunggu tanggal merah, Bos.'],
  ['Saya mau izin berobat ke luar negeri.','Surat dokter mahal lho, Bos.'],['WiFi-nya lemot banget.','Paket premium, transfer dulu, Bos.'],['Makanannya nggak enak.','Katering hotel bisa, asal cocok harganya.'],
  ['Boleh pulang sebentar? Anak saya ulang tahun.','Pulang malam, balik pagi. Biasa, Bos.'],['TV-nya kok cuma satu channel?','TV kabel nambah, Bos.'],['Sel sebelah lebih luas.','Itu kelas VIP, Bos. Mau upgrade?'],
  ['Saya nggak salah, saya dijebak!','Semua di sini juga bilang begitu, Bos.']];
/* key -> [who, line]; who is the speaker role the brief assigns a voice to */
var VO_LINES={
  hakim_tanya:['hakim','Terdakwa, ada pembelaan?'],token_tertulis:['token','Ada, Yang Mulia. Ini pembelaan tertulis.'],hakim_kurang:['hakim','Hmm. Setelah ditimbang, berkasnya kurang bukti.'],
  sipir_lihat:['sipir','Saya nggak lihat apa-apa.'],hakim_banding:['hakim','Sidang banding dibuka.'],pengacara:['pengacara','Klien saya korban kriminalisasi, Yang Mulia!'],
  hakim_putus:['hakim','Majelis memutuskan...'],hakim_kabul:['hakim','Dikabulkan!'],hakim_tolak:['hakim','Ditolak!'],token_bijak:['token','Hakimnya bijak sekali!'],
  bebas:['token','Saya kembali untuk rakyat!'],
  kamp_open:['orator','Saudara-saudara!'],
  dir_action:['sutradara','Action!'],dir_cut:['sutradara','Cut! Sekali lagi, Pak, kurang natural.'],dir_ok:['sutradara','Oke, bagus! Langsung upload!'],token_blusuk:['token','Saya blusukan demi rakyat!'],warga_got:['warga','Wah, Bapak masuk got!'],
  gaji_tunj:['narator','Belum termasuk tunjangan.'],gaji_cair:['narator','Cair!'],token_gaji:['token','Alhamdulillah, rezeki pejabat.'],
  mafia_lahan:['mafia','Lahan ini sekarang milik saya.'],
  nuke_call:['penelpon','Halo kawan! Saya titip satu nuklir. Pilih kotanya.'],nuke_pick:['token','Kota itu!'],nuke_boom:['narator','Rata. Tinggal izin lahan.'],
  lm_up:['token','Mampir dulu, biar makin mahal.'],segel_cabut:['token','Segel? Bisa diatur.']};
(function(){SLOGANS.forEach(function(s,i){VO_LINES['kamp_'+(i+1)]=['orator',s.replace(/\{city\}/g,'kota ini')];});
  SEL_PAIRS.forEach(function(p,i){VO_LINES['sel_k'+(i+1)]=['token',p[0]];VO_LINES['sel_s'+(i+1)]=['sipir',p[1]];});
  if(typeof THEMES!=='undefined'&&THEMES.politik&&THEMES.politik.ottCases)THEMES.politik.ottCases.forEach(function(c,i){VO_LINES['case_'+(i+1)]=['token',c];});})();
function vo(key){if(typeof play==='function')play('vo:'+key);}
function caseKey(text){var cs=(typeof THEMES!=='undefined'&&THEMES.politik&&THEMES.politik.ottCases)||[];var i=cs.indexOf(text);return i>=0?'case_'+(i+1):null;}
function sloganText(i,city){return SLOGANS[i%SLOGANS.length].replace(/\{city\}/g,city);}
