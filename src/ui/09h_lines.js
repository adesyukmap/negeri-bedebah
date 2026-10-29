/* ---------- every spoken line: characters, scenes, narrator (cards, news, story, events) ----------
   Keys become VO_LINES entries; audio file = assets/sfx/vo_<key>.m4a. Female characters and female roles get female voices (kinta, vina). */
/* character lines: giliran (turn start), pilih (picked in lobby), pasif (passive fires), menang (wins) */
var CHAR_LINES={
  solo:['Giliran saya, blusukan dulu.','Siap turun ke got demi rakyat.','Gorong-gorong? Gratis buat saya.','Menang itu biasa, yang penting kontennya.'],
  gemoy:['Ayo, joget dulu!','Gemoy siap menggemaskan rakyat!','Double! Semua bayar, sambil joget!','Joget kemenangan, semuanya ikut!'],
  gaberner:['Izinkan saya merangkai kata.','Kata-kata adalah senjata saya.','Kartu itu saya batalkan dengan kata-kata.','Kemenangan ini, mari kita rangkai bersama.'],
  pinguin:['Pinguin turun gunung.','Rambut putih, pengalaman panjang.','Kampanye di kota saya, sewa naik lagi!','Pinguin memang nggak bisa terbang, tapi bisa menang.'],
  banteng:['Banteng maju, minggir semua!','Mak Banteng siap pimpin rapat.','Iuran partai masuk, terima kasih kader.','Banteng nggak pernah kalah, cuma istirahat.'],
  prihatin:['Saya prihatin, tapi saya jalan.','Saya sangat prihatin dengan keadaan ini.','Kena musibah? Saya prihatin, dan diganti penuh.','Saya prihatin melihat kalian kalah.'],
  opung:['Lord lewat, beri jalan.','Semua urusan, serahkan ke Lord.','Sewa? Untuk Lord ada diskon.','Sudah saya bilang, Lord selalu menang.'],
  izin:['Izin lewat, Bos.','Izin tambang? Bisa diatur.','Izin kilat, harga miring.','Seluruh negeri sudah ada izinnya.'],
  gusur:['Siapa yang mau digusur hari ini?','Raja Gusur siap meratakan.','Gusur murah, diskon lima belas persen!','Semua sudah saya gusur. Tinggal saya.'],
  fufufafa:['Hoahm... giliran saya ya?','Saya ikut, asal boleh tidur siang.','Tidur siang, bangun dapat duit.','Lho, saya menang? Padahal tidur terus.'],
  instan:['Giliran ketum muda!','Baru gabung, langsung jadi ketua.','Izin lahan pertama? Gratis buat saya.','Karier instan, menang juga instan.'],
  saham:['Papa minta giliran.','Papa ikut, asal dapat saham.','Kamu bangun, Papa minta saham.','Semua senang, Papa yang paling banyak sahamnya.'],
  slepet:['Slepet dulu, baru jalan.','Kubu mana yang menang, saya di situ.','Pindah kubu! Kotamu buat saya.','Saya selalu di kubu yang menang.'],
  taro:['Menurut pasal saya, ini giliran saya.','Semua bisa dibanding, asal tahu pasalnya.','Banding saya hampir pasti menang.','Secara hukum, saya pemenangnya.'],
  zonk:['Semoga bukan zonk.','Saya anti zonk, anti rugi.','Kartu jelek? Ambil ulang!','Akhirnya, bukan zonk!'],
  dungu:['Sebagai narasumber, saya jalan.','Saya hadir sebagai narasumber tetap.','Breaking news? Honor narasumber cair.','Itu sesuai analisa saya sejak awal.'],
  ratupajak:['Ratu pajak mau lewat.','Semua harus bayar pajak, kecuali saya.','Pungli lawan, saya dapat bagian.','Pajak kemenangan, saya yang tarik.'],
  konten:['Halo gaes, giliran saya!','Jangan lupa like dan subscribe!','Bangun proyek, langsung bikin konten.','Kemenangan ini wajib viral!'],
  micmati:['Tes, tes. Giliran saya.','Yang nggak setuju, mic-nya saya matikan.','Maaf, mic-nya mati.','Rapat selesai, saya yang menang.'],
  imam:['Massa, siap bergerak!','Massa sudah menunggu di luar.','Massa aksi datang, saya keluar lebih cepat.','Kemenangan ini untuk massa.'],
  stoik:['Fokus pada yang bisa dikendalikan.','Tenang, semua ini cuma permainan.','Denda di luar kendali, cukup bayar separuh.','Menang atau kalah, saya tetap tenang.'],
  juragan:['Juragan jalan dulu.','Juragan Tuan siap borong tanah.',null,'Semua tanah milik juragan!'],
  mbak:['Mbak Cuan lewat!','Cuan dulu, healing kemudian.',null,'Cuan maksimal!'],
  hoki:['Semoga hoki lagi.','Hoki adalah strategi.',null,'Hoki terus, menang terus!'],
  kapal:['Kapal berangkat!','Bos Kapal siap berlayar.',null,'Semua pulau sudah saya singgahi.'],
  nenek:['Nenek jalan pelan-pelan.','Jangan remehkan nenek.',null,'Hihihi, nenek menang.'],
  kos:['Pak Kos tagih dulu.','Bayar kos tepat waktu ya.',null,'Semua jadi anak kos saya.'],
  dewi:['Dewi menari ke depan.','Ayo menari bersama Dewi.',null,'Tarian kemenangan!'],
  ojol:['Gas, Bang!','Bang Ojol siap antar.',null,'Bintang lima buat saya!']};
var CHAR_KINDS=['giliran','pilih','pasif','menang'];
/* quips spoken by whichever player triggers them: male = v_quip_<k>, female = v_quip_<k>_f */
var QUIP_LINES={lawan:'Saya akan lawan!',sorry:'Sorry ye!',repot:'Gitu aja kok repot!',asing:'Ini ulah antek-antek asing!',bayarDulu:'Bayar dulu, Bos!',sialan:'Sialan lu!',mic:'Maaf, mic-nya mati.'};
var EV_LINES={ev_landmark:'Proyek Strategis berdiri!',ev_landmark_s:'Landmark berdiri!',ev_gusur:'Penggusuran!',ev_bangkrut:'Bangkrut! Semua asetnya disita.',ev_fajar:'Serangan fajar! Amplop dibagi menjelang pemilu.',ev_double:'Double! Kocok lagi.'};
function isFem(pid){var p=S&&S.players[pid];if(!p)return false;var c=CHARS.filter(function(x){return x.id===p.char;})[0];return !!(c&&c.f);}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,32);}
(function(){
  Object.keys(CHAR_LINES).forEach(function(id){CHAR_LINES[id].forEach(function(l,k){if(l)VO_LINES['chr_'+id+'_'+CHAR_KINDS[k]]=['chr:'+id,l];});});
  Object.keys(VO_LINES).forEach(function(k){var r=VO_LINES[k][0];if((r==='token'||r==='orator')&&!/_f$/.test(k))VO_LINES[k+'_f']=[r+'_f',VO_LINES[k][1]];});
  Object.keys(EV_LINES).forEach(function(k){VO_LINES[k]=['narator',EV_LINES[k]];});
  if(typeof STORY!=='undefined')STORY.forEach(function(s,i){if(i>0)VO_LINES['story_'+i]=['narator','Babak '+i+'. '+s.n+'. '+s.t];});
  if(typeof THEMES!=='undefined')['politik','santai'].forEach(function(th){var T0=THEMES[th];if(!T0)return;
    (T0.news||[]).forEach(function(n){VO_LINES['news_'+th+'_'+n.id]=['narator',T0.newsName+'! '+n.name+'. '+n.text];});
    ['chance','dana'].forEach(function(d){(T0[d]||[]).forEach(function(c){VO_LINES['card_'+th+'_'+slug(c.name)]=['narator',c.name.replace(/!$/,'')+'!'];});});});
})();
