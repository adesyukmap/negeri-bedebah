# Negeri Bedebah: Game Design Document

Versi 0.2 · 28 Okt 2026 · Status: plan, belum dieksekusi

Perubahan dari v0.1:
- Dunianya sekarang kota-kota nyata di Indonesia, dan tiap kota punya ikon khasnya sendiri.
- Karakter cuma kosmetik. Semua kemampuan didapat dari Kartu Kesempatan.
- Art sepenuhnya 2D yang terlihat 3D (bevel, shade, shadow), dan semuanya digambar lewat code.

---

## 1. Ringkasan

| | |
|---|---|
| Genre | Board game ala Monopoly yang cepat, chaotic, dan banyak comeback |
| Platform | iPad, Safari, dipasang lewat Add to Home Screen (PWA, fullscreen, offline) |
| Mode | Hotseat lokal, 1 iPad dioper gantian |
| Pemain | 2 sampai 5 orang, tanpa bot |
| Durasi target | 30 sampai 45 menit (dengan turn limit) |
| Bahasa UI | Indonesia casual, istilah game seperti Takeover dan Landmark tetap Inggris |
| Orientasi | Landscape only |

**Pilar desain**
1. **Cepat.** Satu giliran selesai di bawah 15 detik kalau tidak ada keputusan besar.
2. **Chaotic tapi adil.** Semua pemain mulai setara. Keunggulan datang dari kota yang dikuasai dan Kartu Kesempatan yang didapat.
3. **Rame di satu layar.** Semua orang bisa baca status tanpa perlu buka menu.

---

## 2. Dunia: Kepulauan Cuan (Indonesia)

Board-nya adalah perjalanan keliling Indonesia, dari timur ke barat. Ada 7 region yang jadi color group, berisi 19 kota. Makin jauh dari Start, harganya makin mahal.

| # | Region | Warna | Kota → Ikon |
|---|---|---|---|
| 1 | Papua & Maluku | Hijau hutan `#3E9B5F` | Jayapura → Jembatan Youtefa · Ambon → Gong Perdamaian |
| 2 | Nusa Tenggara | Oranye senja `#F08A3C` | Kupang → Sasando · Mataram → Islamic Center · Labuan Bajo → Komodo |
| 3 | Sulawesi | Toska `#22B5A8` | Manado → Ikan dan terumbu Bunaken · Palu → Jembatan Kuning · Makassar → Kapal Pinisi |
| 4 | Kalimantan | Coklat kayu `#A8663A` | Pontianak → Tugu Khatulistiwa · Banjarmasin → Jukung pasar terapung · Balikpapan → Beruang madu |
| 5 | Sumatra | Merah marun `#B83A4B` | Padang → Rumah Gadang · Palembang → Jembatan Ampera · Medan → Istana Maimun |
| 6 | Jawa | Biru `#3D7BD9` | Yogyakarta → Tugu Jogja · Bandung → Gedung Sate · Surabaya → Patung Suro & Boyo |
| 7 | Mahkota | Emas `#F2B705` | Bali → Candi Bentar · Jakarta → Monas |

**4 Wisata (tidak bisa dibangun):** Raja Ampat, Borobudur, Danau Toba, Gunung Bromo.

**Lore singkat (untuk splash dan loading tips):** Sang Raja Cuan mewariskan Mahkota Cuan kepada siapa pun yang berhasil menguasai tiga region, satu jalur penuh, atau keempat keajaiban wisata Nusantara.

---

## 3. Board

Board terdiri dari 32 tile: 4 corner dan 7 tile di tiap sisi. Token bergerak searah jarum jam.

| Idx | Tile | Tipe |
|---|---|---|
| 0 | **Start** | Corner |
| 1 | Jayapura | Papua & Maluku |
| 2 | Ambon | Papua & Maluku |
| 3 | Kesempatan | Kartu |
| 4 | Kupang | Nusa Tenggara |
| 5 | Raja Ampat | Wisata |
| 6 | Mataram | Nusa Tenggara |
| 7 | Labuan Bajo | Nusa Tenggara |
| 8 | **Pulau Terdampar** | Corner |
| 9 | Manado | Sulawesi |
| 10 | Palu | Sulawesi |
| 11 | Makassar | Sulawesi |
| 12 | Borobudur | Wisata |
| 13 | Pontianak | Kalimantan |
| 14 | Banjarmasin | Kalimantan |
| 15 | Balikpapan | Kalimantan |
| 16 | **Pesta Rakyat** (Festival) | Corner |
| 17 | Padang | Sumatra |
| 18 | Palembang | Sumatra |
| 19 | Medan | Sumatra |
| 20 | Kesempatan | Kartu |
| 21 | Yogyakarta | Jawa |
| 22 | Bandung | Jawa |
| 23 | Surabaya | Jawa |
| 24 | **Kapal Pelni** (teleport) | Corner |
| 25 | Danau Toba | Wisata |
| 26 | Kesempatan | Kartu |
| 27 | Bali | Mahkota |
| 28 | Gunung Bromo | Wisata |
| 29 | Pajak Juragan | Pajak |
| 30 | Kesempatan | Kartu |
| 31 | Jakarta | Mahkota |

**Jalur (untuk Line Monopoli):** Jalur 1 adalah idx 1 sampai 7, Jalur 2 idx 9 sampai 15, Jalur 3 idx 17 sampai 23, dan Jalur 4 idx 25 sampai 31. Yang dihitung adalah semua kota dan wisata di jalur itu.

---

## 4. Aturan Inti

### 4.1 Setup
- Pilih jumlah pemain (2 sampai 5), lalu tiap pemain mengisi nama, memilih karakter, dan memilih warna token.
- Modal awal **Rp1.500.000**. Gaji tiap lewat atau mendarat di Start **Rp200.000**.
- Urutan main diundi dengan lempar dadu.

### 4.2 Giliran
1. Lempar 2 dadu dan jalan sesuai total. Sebelum melempar, pemain boleh memakai Kartu Kemampuan.
2. Resolve tile tempat mendarat.
3. Kalau dapat **double**, lempar lagi. Tiga kali double berturut-turut langsung ke Pulau Terdampar.
4. Tap "Selesai" untuk masuk ke layar oper giliran.

### 4.3 Resolve tile
| Tile | Efek |
|---|---|
| Kota kosong | Beli tanah. Di kunjungan pertama bisa langsung bangun sampai Villa |
| Kota sendiri | Upgrade satu atau lebih level |
| Kota lawan | Bayar sewa, lalu boleh **Takeover** kalau bukan Landmark |
| Wisata kosong | Beli |
| Wisata lawan | Bayar sewa sesuai jumlah wisata milik pemiliknya |
| Kesempatan | Ambil 1 kartu (lihat bagian 5) |
| Pajak Juragan | Bayar 10% dari total nilai properti |
| Pulau Terdampar | Tertahan maksimal 3 giliran. Keluar dengan double, bayar Rp100.000, atau pakai kartu |
| Pesta Rakyat | Pilih satu kota milik sendiri, sewanya jadi x2. Hanya 1 Pesta yang aktif di board, dan pindah kalau pemain lain mengaktifkannya |
| Kapal Pelni | Bayar Rp50.000. Giliran berikutnya, pilih tile tujuan mana saja. Kalau melewati Start tetap dapat gaji |

### 4.4 Bangunan
| Level | Biaya | Sewa (x harga tanah) |
|---|---|---|
| Tanah | 1.0 L | 0.2 L |
| Rumah | 0.5 L | 0.6 L |
| Villa | 1.0 L | 1.2 L |
| Gedung | 1.5 L | 2.0 L |
| Landmark | 2.0 L | 3.0 L |

- Landmark hanya bisa dibangun setelah Gedung berdiri dan pemain sudah 1 putaran. Landmark kebal Takeover.
- **Landmark = ikon kota.** Saat naik ke Landmark, bangunan generik berubah jadi ikon khas kotanya (Monas, Gedung Sate, Jembatan Ampera, dan seterusnya). Ini momen visual paling besar di game.
- Kalau satu pemain menguasai satu region penuh, sewa seluruh kotanya x2. Efek ini menumpuk dengan Pesta Rakyat, sampai maksimal x4.

### 4.5 Takeover
Mendarat di kota lawan yang bukan Landmark → bayar sewa → boleh membeli paksa kotanya seharga **2x total investasi**. Setelah itu pemain langsung boleh upgrade.

### 4.6 Harga per region (L = harga tanah)
| Region | L | Sewa Landmark | Landmark + region penuh |
|---|---|---|---|
| Papua & Maluku | 60.000 | 180.000 | 360.000 |
| Nusa Tenggara | 90.000 | 270.000 | 540.000 |
| Sulawesi | 120.000 | 360.000 | 720.000 |
| Kalimantan | 160.000 | 480.000 | 960.000 |
| Sumatra | 200.000 | 600.000 | 1.200.000 |
| Jawa | 260.000 | 780.000 | 1.560.000 |
| Mahkota | 350.000 | 1.050.000 | 2.100.000 |

**Wisata:** harga beli Rp200.000. Sewanya tergantung jumlah wisata yang dimiliki: 1 = 50.000, 2 = 150.000, 3 = 400.000. Pemilik 4 wisata langsung menang.

Semua angka di atas adalah titik awal dan disimpan di `config.js` supaya gampang disetel setelah playtest.

### 4.7 Bangkrut
Kalau uang tidak cukup untuk membayar, pemain wajib menjual properti ke bank seharga 50% nilainya. Kalau masih minus setelah semua terjual, pemain bangkrut dan keluar dari game.

### 4.8 Kondisi menang
1. **Sultan Terakhir:** semua lawan bangkrut.
2. **Triple Monopoli:** menguasai 3 region penuh.
3. **Line Monopoli:** menguasai semua kota dan wisata di satu jalur.
4. **Wisata Monopoli:** memiliki keempat wisata.
5. **Turn limit** (opsional, 20/25/30 ronde atau tanpa batas): pemenangnya yang total asetnya terbesar.

Kalau ada pemain yang tinggal 1 langkah menuju monopoli, muncul peringatan **"Ancaman Monopoli!"**.

---

## 5. Kartu Kesempatan

Karakter tidak punya kemampuan. Semua kemampuan datang dari kartu ini, jadi setiap pemain mulai setara dan keberuntungan di tile Kesempatan yang menentukan.

Total ada 24 kartu dengan dua jenis:
- **Instan (12):** langsung berlaku saat diambil.
- **Kemampuan (12):** disimpan di tangan, maksimal 2 kartu, dan dipakai kapan saja sesuai syaratnya. Kalau tangan penuh, pemain memilih salah satu untuk dibuang.

### 5.1 Kartu Kemampuan (disimpan)
| Kartu | Kapan dipakai | Efek |
|---|---|---|
| Dadu Hoki | Setelah lempar dadu | Lempar ulang sekali |
| Dadu Pilihan | Sebelum lempar | Tentukan sendiri angka dadunya (2 sampai 12) |
| Perisai Juragan | Saat kena Takeover | Batalkan Takeover itu |
| Diskon Sewa | Saat harus bayar sewa | Sewa dipotong 50% |
| Bebas Sewa | Saat harus bayar sewa | Tidak bayar sama sekali (kartu langka, cuma 1) |
| Bebas Bersyarat | Saat di Pulau Terdampar | Langsung keluar gratis |
| Tukang Kilat | Saat upgrade | Biaya bangun -30% |
| Takeover Murah | Saat Takeover | Harga 1.5x, bukan 2x |
| Tiket Pelni | Sebelum lempar | Langsung ke tile mana saja tanpa lempar |
| Pesta Pribadi | Kapan saja di gilirannya | Pindahkan Pesta Rakyat ke kota sendiri |
| Tukar Kota | Kapan saja di gilirannya | Tukar 1 kota sendiri dengan 1 kota lawan yang levelnya setara atau lebih rendah (bukan Landmark) |
| Gaji Dobel | Pasif sampai lewat Start | Gaji Start berikutnya x2 |

### 5.2 Kartu Instan
| Kartu | Efek |
|---|---|
| Panen Raya | +Rp150.000 |
| THR Cair | +Rp100.000 |
| Arisan Tembus | Ambil Rp50.000 dari tiap pemain lain |
| Ditilang | -Rp80.000 |
| Kapal Karam | Langsung ke Pulau Terdampar |
| Mudik | Maju ke Start dan dapat gaji |
| Angin Ribut | Mundur 3 langkah |
| Izin Bangun | Upgrade gratis 1 level di satu kota sendiri (bukan Landmark) |
| Gempa Kecil | Bangunan termahal sendiri turun 1 level |
| Gotong Royong | Pemain terkaya membayar Rp100.000 ke pemain termiskin |
| Sedekah Juragan | Bayar Rp20.000 ke tiap pemain lain |
| Mati Lampu | Pesta Rakyat dibatalkan |

Rasio kartu bagus dan buruk sekitar 60:40 supaya pemain tetap senang mendarat di Kesempatan.

---

## 6. Karakter (kosmetik)

Ada 8 karakter yang murni tampilan dan tidak punya skill. Satu karakter hanya bisa dipilih satu pemain.

| Karakter | Look |
|---|---|
| Juragan Tuan | bapak gemuk, blangkon, kumis tebal, kalung emas |
| Mbak Cuan | wanita karier, kebaya modern, kacamata |
| Si Hoki | anak muda, kaus kucing keberuntungan |
| Bos Kapal | nahkoda tua, topi kapten, janggut putih |
| Nenek Licik | nenek kecil, kipas, senyum misterius |
| Pak Kos | sandal jepit, kunci serenceng |
| Dewi Penari | selendang warna-warni |
| Bang Ojol | helm, jaket hijau |

Ekspresi yang dibutuhkan: idle, senang, sedih, shock, menang.

---

## 7. UX & Layar

### 7.1 Daftar layar
Splash → Lobby (jumlah pemain, turn limit, modal) → Pilih Karakter → Game → Oper Giliran → Pause → Hasil. Kalau ada save, tombol "Lanjutkan Game" muncul di Splash.

### 7.2 Layout game (landscape)
```
┌──────────┬──────────────────────────┬──────────┐
│ Pemain 1 │                          │ Pemain 4 │
│ Pemain 2 │     BOARD ISOMETRIC      │ Pemain 5 │
│ Pemain 3 │   (dadu di tengah board) │  [Pause] │
└──────────┴──────────────────────────┴──────────┘
```
- Panel pemain berisi portrait, uang, jumlah properti, **2 slot Kartu Kemampuan**, dan status. Panel pemain yang sedang jalan akan glow.
- Kartu Kemampuan dipakai dengan tap kartunya di panel. Kartu yang bisa dipakai saat itu berkedip, dan yang tidak bisa dipakai jadi redup.
- Untuk kartu reaktif (Perisai, Diskon Sewa), game otomatis menawarkan pemakaiannya saat momennya tiba, lalu pemilik memilih "Pakai" atau "Simpan". Ini penting di hotseat supaya pemain tidak perlu ingat sendiri.
- Tap tile mana pun untuk lihat detail kota.

### 7.3 Aturan touch
Target tap minimal 56 pt, tanpa hover, dan tidak ada long-press yang wajib. Angka uang beranimasi count up/down. Aksi destruktif selalu minta konfirmasi.

---

## 8. Art Direction: 2D yang terlihat 3D

### 8.1 Pendekatan
Semua elemen board digambar lewat code (Canvas 2D + path vektor) dengan proyeksi **isometric**. Kesan 3D dibangun dari lima teknik:

1. **Ekstrusi:** setiap tile dan bangunan punya permukaan atas plus dua sisi samping, seperti balok.
2. **Shade 3 nilai:** cahaya datang dari kiri atas. Permukaan atas paling terang, sisi kiri medium, sisi kanan paling gelap (warna dasar yang sama, digeser kecerahannya).
3. **Bevel:** garis highlight tipis di tepi atas dan sudut membulat, supaya terlihat seperti mainan plastik atau kayu yang dipoles.
4. **Shadow:** drop shadow lembut ke kanan bawah, plus ambient occlusion tipis di tempat bangunan menyentuh tile.
5. **Gradient & gloss:** gradien vertikal halus di tiap permukaan, ditambah kilap kecil di objek emas, kaca, dan air.

Hasil yang dituju: diorama mainan yang chunky, ceria, dan tactile. Bukan flat, dan bukan realistis.

### 8.2 Ikon kota
- Ada 19 ikon kota + 4 wisata + 4 corner = **27 ikon**, semua digambar dalam satu sistem cahaya yang sama.
- Prinsipnya **silhouette first**: setiap ikon harus tetap dikenali di ukuran kecil (sekitar 48 px). Detail dikorbankan demi bentuk. Contohnya, Monas cukup tugu dan lidah api emas, Jembatan Ampera cukup dua menara merah dan bentangan.
- Di tile, ikon tampil kecil di sebelah nama kota. Saat Landmark dibangun, ikon itu muncul besar sebagai bangunan 3D di atas tile.

### 8.3 Bangunan per level
Rumah, Villa, dan Gedung memakai model generik yang di-tint warna region. Landmark memakai ikon khas kota. Dengan begitu hanya 3 model generik + 19 Landmark yang perlu digambar, dan semuanya lewat code.

### 8.4 Karakter
Ada dua opsi:
- **A (default):** token chibi sederhana yang juga digambar lewat code dengan gaya bevel yang sama. Semua konsisten, dan lo tidak perlu generate apa pun.
- **B:** portrait yang lo generate di Gemini, dipakai di panel dan layar pilih karakter. Token di board tetap dari code.

### 8.5 Palet & tipografi
| Peran | Warna |
|---|---|
| Laut (background) | `#3FA9D6` → `#1E6F9F` |
| Pasir / tile netral | `#F6E7C1` |
| Panel UI | `#FFF8EC`, outline `#4A3426` |
| Aksen uang & aksi utama | `#F2B705` |
| Bahaya (bayar, bangkrut) | `#E2483D` |

Font display **Baloo 2**, body **Nunito**. Angka uang memakai pemisah titik (Rp1.500.000).

Bentuknya serba membulat, tanpa sudut tajam, dan tanpa ikon di dalam lingkaran berwarna.

---

## 9. Musik & Audio

### 9.1 Arah musik
**Tropical gamelan-pop:** gamelan (bonang, saron), kendang, ukulele, marimba, synth bass, dan claps. Ceria, catchy, dan tetap enak di-loop selama 40 menit.

| Track | Dipakai | BPM | Mood | Loop |
|---|---|---|---|---|
| Lagu Nusantara | Menu, lobby | 100 | santai, mengundang | 60 s |
| Keliling Cuan | In-game | 112 | ceria, ringan | 90 s |
| Detik Genting | Ancaman Monopoli / 3 ronde terakhir | 128 | tegang, kendang rapat | 45 s |
| Mahkota Cuan | Menang | n/a | fanfare gamelan + brass | 8 s |
| Terdampar | Di Pulau Terdampar | 90 | lucu, sedikit sedih | 20 s |

Antar track memakai crossfade 1,5 detik, dan musik di-duck 40% saat SFX besar diputar.

### 9.2 SFX
| Event | Suara |
|---|---|
| Dadu | kayu bergulir, tok-tok |
| Melangkah | pop kecil per tile |
| Lewat Start | koin + gong kecil |
| Beli / bangun | stempel + konstruksi kartun |
| Bayar sewa | koin mengalir, makin panjang makin besar sewanya |
| Takeover | sting dramatis + "BRAK" |
| Landmark jadi | gong besar + sorak |
| Ambil Kesempatan | kartu dikocok dan dibalik |
| Pakai Kartu Kemampuan | "cling" magis |
| Pesta Rakyat | terompet + kembang api |
| Bangkrut | trombon "wah-wah" |
| Ancaman Monopoli | alarm kentongan |

### 9.3 Voice (opsional, fase 3)
Announcer berbahasa Indonesia yang heboh: "TAKEOVER!", "LANDMARK!", "Awas, ancaman monopoli!"

### 9.4 Sumber & teknis
- Musik di-generate dengan AI music (ElevenLabs kalau tersedia lewat connector, atau Suno). SFX dari AI SFX atau library CC0.
- Format `.m4a`. Audio di-unlock lewat tap pertama di Splash karena aturan iOS.
- Lisensi wajib dicek kalau game ini nanti dijual.

---

## 10. Arsitektur Teknis

- Vanilla JS (ES modules) + **Canvas 2D** untuk board, dan DOM/CSS untuk panel dan popup.
- PWA (manifest + service worker), di-host di Cloudflare Pages, lalu dibuka di Safari dan di-Add to Home Screen.
- **Engine terpisah dari render:** logika game murni, bisa dites dan disimulasikan ribuan game untuk balancing.
- Satu state tunggal, autosave ke localStorage tiap aksi, undo 1 langkah, dan RNG ber-seed.
- Semua angka dan kartu ada di `config.js` dan `cards.js`.
- **Render isometric:** board statis di-render sekali ke offscreen canvas, lalu hanya token, bangunan baru, dan efek yang digambar ulang per frame. Ikon kota disimpan sebagai fungsi gambar vektor, sehingga tetap tajam di layar Retina tanpa file gambar.

```
/index.html  /manifest.json  /sw.js
/src
  /engine   state.js rules.js cards.js config.js rng.js
  /render   iso.js (proyeksi + shading helper) board.js
            icons/ (1 file per ikon kota) buildings.js tokens.js dice.js fx.js
  /ui       screens.js panels.js popups.js
  /audio    audio.js
  main.js
/assets     /audio /fonts (/portraits kalau opsi B)
/tools      simulate.js
```

Target performa 60 fps di iPad M2 (target device), dan 120 fps kalau layarnya ProMotion. Ukuran aset di bawah 25 MB (sebagian besar audio).

---

## 11. Roadmap

### Fase 1: MVP (bisa dimainkan)
- Board 32 tile isometric dengan shading dan nama kota, ikon masih placeholder
- Lobby, pilih karakter, oper giliran
- Dadu, beli, bangun, sewa, Takeover, bangkrut, 4 kondisi menang + turn limit
- Autosave, PWA terpasang di iPad
- **2 ikon kota final (Monas + Gedung Sate)** sebagai uji gaya visual

**Selesai kalau:** 5 orang bisa menyelesaikan satu game penuh tanpa bug yang menghentikan permainan.

### Fase 2: Cepat dan chaotic
- 24 Kartu Kesempatan + slot Kartu Kemampuan
- Pesta Rakyat, Kapal Pelni, Pulau Terdampar lengkap, Ancaman Monopoli
- Simulasi balancing 1.000 game
- Semua ikon kota, wisata, dan corner
- Musik dan SFX dasar

**Selesai kalau:** rata-rata game berlangsung 30 sampai 45 menit dan kondisi menangnya bervariasi.

### Fase 3: Juice
- Animasi bangunan naik level, Landmark "muncul" dengan kamera zoom
- Efek Takeover, kembang api Pesta, voice announcer
- Layar hasil dengan statistik, polish setelah playtest

---

## 12. Risiko

| Risiko | Mitigasi |
|---|---|
| Ikon kota kurang dikenali di ukuran kecil | Silhouette first, uji 2 ikon di Fase 1 sebelum lanjut ke 25 sisanya |
| Kartu Kemampuan terlalu kuat (misalnya Dadu Pilihan, Bebas Sewa) | Jumlah kartu langka dibatasi, diuji lewat simulasi |
| Pemain lupa punya kartu reaktif | Game otomatis menawarkan kartu saat momennya |
| Game kepanjangan | Turn limit default 25 ronde |
| Safari quirk | Audio di-unlock di tap pertama, Canvas 2D, aset ringan |
| Save hilang | Export/import save di Fase 2 |

---

## 13. Keputusan & pertanyaan terbuka

**Sudah diputuskan**
- Device: iPad M2. Budget animasi longgar: partikel, glow, dan zoom kamera aman di 60 fps, dan 120 fps kalau layarnya ProMotion.
- Bahasa: campuran Indonesia-Inggris.
- Pemakaian: privat, cuma main bareng teman. Lisensi audio dan art tidak jadi isu, dan game tidak perlu dipublish (link Cloudflare cukup unlisted).

**Masih terbuka**
1. Karakter mau opsi A (semua digambar lewat code) atau B (portrait dari Gemini)?

---

## 14. Status build & backlog batch berikutnya (28 Okt 2026)

### Sudah jalan (link artifact yang sama)
- Board tile persegi panjang, label tercetak di permukaan tile, bangunan di petak belakang
- 19 lambang kota di atap Rumah/Villa/Gedung + 19 Landmark unik
- Tanah dimiliki: pagar + papan "MILIK". Wisata dimiliki: gerbang tiket
- Laguna: lumba-lumba, ikan, penyu, perahu, kepiting, camar, awan
- Dadu 3D berputar, mode bangun Bertahap/Bebas, Pesta Rakyat bertumpuk (maks x4, total maks x6)
- Musik dari repo kingdoms-at-war: mus_menu, mus_day_calm, mus_day_tense, mus_win

### Batch berikutnya (disetujui, belum dikerjakan)
**Kamera & keterbacaan**
- Pinch zoom, geser dua jari, double-tap reset, tombol "Lihat semua"
- Default kamera zoom ke pemain aktif dan mengikuti token
- Langkah token lebih pelan (sekitar 0,35 detik per tile)

**Dadu**
- Dadu bersudut tumpul (chamfer)
- Dikocok di gelas bambu: tekan-tahan untuk mengocok, lepas untuk banting, gelas diangkat untuk menampilkan hasil
- Meter kekuatan kocokan saat ditahan (kecil sebentar vs kencang lama), memengaruhi animasi
- KEPUTUSAN TERBUKA: kekuatan kocokan murni visual, atau ikut memengaruhi hasil seperti gauge kekuatan

**Animasi**
- Tile terinjak dan memantul tiap dilewati, riak cahaya, bangunan bergoyang
- Uang terbang dari pembayar ke penerima
- Konstruksi: perancah, debu, bangunan "pop" naik level
- Gaji Start: hujan koin
- Kartu dibalik 3D (Kesempatan dan Dana Umum)
- Kapal Pelni berlayar membawa token
- Terdampar: token lesu di pulau dengan ombak
- Bangkrut: bangunan runtuh jadi debu
- Ekspresi token: senang dan kaget
- Takeover dramatis: zoom kamera, layar bergetar, bangunan dicat ulang ke warna pemilik baru, efek BRAK
- Pesta Rakyat: suasana party (confetti, lampion, kembang api, kerumunan kecil menari)
- Kartu Gempa Kecil: gempa betulan (board bergetar, retakan, bangunan bergoyang lalu turun level, debu)

**Visual props**
- Semua props (awan, ikan, lumba-lumba, penyu, perahu, palem, pulau, kepiting, burung) dibuat bervolume: bevel, shading, bayangan

**Aturan & setup**
- Dana Umum: 2 dari 4 tile Kesempatan diganti, dek kartu sendiri bertema komunitas
- Modal awal bebas diatur di lobby (input angka + preset)
- Kabar Nusantara: peristiwa nasional tiap 3 ronde (Harbolnas, Mudik Lebaran, Banjir Jakarta, Viral di TikTok, Krismon), bisa dimatikan di lobby

### Usulan tambahan (menunggu keputusan)
- Siklus siang-malam mengikuti ronde: langit menggelap, lampu bangunan dan jendela menyala di malam hari
- Jejak api di token saat dapat double beruntun
- Cipratan air saat token mendarat di wisata
- Gebrakan: Mega Proyek IKN di pulau tengah (lihat catatan chat)

---

## 15. Sistem tema & Tema Politik "Negeri Cuan" (prioritas pertama)

### Keputusan
- Dadu: kekuatan kocokan murni visual, hasil tetap acak
- Urutan kerja: sistem theme pack (data-driven) → Tema Politik lengkap → poles Tema Santai → tema lain (Startup, Kuliner, Horor)
- Fitur bersama (kamera zoom/geser, dadu gelas, animasi tile, uang terbang, Takeover dramatis, props bervolume, modal awal bebas, Dana Umum, Kabar Nusantara) dibangun di engine, jadi otomatis dipakai semua tema
- Aturan satir: hanya karakter fiktif ("Pak Caleg", "Bu Menteri"), tanpa nama, wajah, atau logo tokoh dan partai asli. Gaya kartun slapstick supaya lucu, bukan suram

### Pemetaan Tema Politik
| Santai | Politik |
|---|---|
| Tanah → Rumah → Villa → Gedung → Landmark | Izin Lahan → Pabrik → Tambang → Kawasan Industri → Proyek Strategis Nasional |
| Wisata (4) | Konsesi: Hutan Kalimantan, Tambang Nikel, Pulau Reklamasi, Kebun Sawit |
| Start (gaji) | Gajian Pejabat |
| Pulau Terdampar | Lapas |
| Pesta Rakyat | Kampanye Akbar: panggung dangdut, baliho, kerumunan, confetti |
| Kapal Pelni | Blusukan Gorong-gorong: token masuk gorong-gorong, muncul di tile pilihan |
| Pajak Juragan | Pungli |
| Kesempatan / Dana Umum | Kartu politik: Bansos, Pencitraan, OTT, Reshuffle, Baliho, Proyek Mangkrak, Dana Aspirasi, Tender Fiktif |
| Kabar Nusantara | Breaking News |
| Pulau tengah: pantai | Hutan lebat + IKN di sebelahnya |

### Momen khas Tema Politik
- **Kas Pusat (pungli + denda):** begitu lewat ambang (default Rp1 juta), hutan tengah dibakar dan berubah jadi kebun sawit, orang utan menangis, asap bikin token batuk-batuk. Bisa berulang di tahap berikutnya sampai hutan habis
- **OTT:** layar ditutup seperti siaran breaking news, token memakai rompi oranye, diborgol, dan digiring ke Lapas
- **Takeover = Penggusuran:** buldoser datang, bangunan lama dirobohkan dengan debu, lalu dibangun ulang dalam warna pemilik baru
- **Blusukan:** token turun ke gorong-gorong, jalan di bawah board, lalu nongol dari tutup gorong-gorong di tujuan
- **Baliho:** baliho caleg fiktif berdiri di kota dan menambah sewa sementara
- **Proyek Mangkrak:** bangunan berhenti setengah jadi dengan perancah ditinggal

---

## 16. Backlog batch berikutnya (disetujui 28 Okt 2026, belum dikerjakan)

### Aturan konten satir
- Tanpa gambar atau karakter yang meniru tokoh nyata, tanpa nama tokoh, tanpa logo partai
- Celetukan populer boleh, diucapkan karakter arketipe fiktif tanpa atribusi: "Saya akan lawan!", "Sorry ye!", "Gitu aja kok repot!", "Ini ulah antek-antek asing!"
- Tidak memakai kata "aseng"

### Karakter
- 8 karakter lama digambar ulang: proporsi lebih rapi, shading dan outline lebih tegas, kedipan mata, gerak idle
- 8 karakter arketipe politik baru: Pak Jenderal, Bu Ketum, Mas Gubernur, Pak Menteri Tambang, Pak Kyai, Juragan Sawit, Bang Buzzer, Mbak Influencer Partai (total 16)
- Celetukan muncul sebagai balon kata di momen tertentu (Proyek Mangkrak, Penggusuran, kena OTT, menang sewa besar)

### Kamera & gerak
- Kamera melayang lebih pelan (sekitar dua kali lebih lambat dari sekarang)
- Token jalan sekitar 0,5 detik per tile

### Dadu
- Gaya dadu mengikuti referensi: putih susu mengkilap, sudut sangat membulat, titik hitam besar, titik merah di angka 1
- Tema Santai: tetap gelas bambu
- Tema Politik: Bos Mafia Sawit fiktif berukuran besar menjulang di atas board (setengah badan), kacamata hitam, kalung emas, cerutu, muka siap menerkam. Tahan tombol untuk mengocok di kepalan tangan, lepas untuk melempar dadu ke papan

### Layar penuh (semua event yang menutup layar)
- Durasi 10 detik, game tertahan, ada tombol Skip
- Breaking News / Kabar Nusantara: masuk dengan efek cut-in (panel diagonal menyabet layar)
- OTT: adegan talkshow fiktif. Token berompi oranye digiring polisi, Mbak Host bertanya "Bapak ketangkap kasus apa?", token menjawab acak dari 20 kasus (tanpa nama orang):
  1. Maling dana bansos
  2. Proyek KTP elektronik
  3. "Saya dituduh korupsi impor gula di Negeri Konoha, padahal nggak"
  4. Izin tambang timah
  5. Kuota haji tambahan
  6. Bakar hutan buat buka lahan sawit
  7. Izin ekspor minyak goreng waktu langka
  8. Proyek menara BTS di pelosok
  9. Dana pensiun dan asuransi negara digangsir
  10. Proyek wisma atlet mangkrak
  11. Suap hakim biar vonis ringan
  12. Dana desa buat beli mobil
  13. Jual beli jabatan di daerah
  14. Pengadaan alat kesehatan waktu pandemi
  15. Impor daging sapi
  16. Ekspor benih lobster
  17. BBM dioplos
  18. Proyek simulator SIM
  19. Dana hibah dipotong buat kampanye
  20. Pengadaan seragam dan sepatu dinas
- Penggusuran: buldoser baru datang setelah layar atau modal tertutup, jeda sekitar 0,8 detik
- Kampanye Akbar: saat diaktifkan, adegan layar penuh panggung dangdut, Pak Caleg fiktif orasi dengan celetukan, kerumunan dan confetti
- Pungli: simbol tile jadi pos portal parkir liar. Saat kena, preman fiktif muncul menadahkan tangan, "Uang keamanan, Bos!", lalu uang berpindah

### Gorong-gorong
- Tutup gorong-gorong bergeser terbuka, token turun pelan, berjalan di bawah board, lalu di kota tujuan muncul tutup baru yang terbuka dan token naik dari bawah. Semua bertahap, tidak terburu-buru

### Fitur baru
- Event Demo Mahasiswa: satu kota disegel, tidak bisa dipungut sewa selama satu ronde
- Serangan Fajar: di ronde terakhir semua pemain dapat amplop kecil, kecuali yang sedang di Lapas
- Sidang Banding: opsi keluar Lapas dengan bayar biaya banding, peluang bebas 50%

### Keputusan terbuka
- Jumlah tile board: tetap 32 atau ditambah (lihat catatan chat)

### Tambahan (28 Okt 2026, 18:47)
- **Kampanye Akbar, konvoi:** setelah kota dipilih, token naik mobil mewah hitam (tanpa logo merek) sambil dadah-dadah, diiringi rombongan pendukung berjalan dan berbendera, menuju kota pilihan. Durasi sekitar 5 detik untuk kota paling jauh (lebih dekat, lebih singkat). Tap layar = konvoi dipercepat
- **Board jadi 40 tile** (4 corner + 9 tile per sisi). 8 tile tambahan:
  - 4 transportasi milik negara (sewa naik sesuai jumlah yang dimiliki, mirip stasiun di Monopoly): Bandara, Pelabuhan, Stasiun Kereta Cepat, Terminal Bus
  - 2 utilitas: PLN dan PDAM (sewa = angka dadu x pengali, naik kalau punya keduanya)
  - 1 Parkir Liar: tukang parkir fiktif muncul, "Parkir, Bos!", bayar ke kas. Terpisah dari Pungli (preman di pos portal)
  - 1 tambahan Dana Umum / Dana Hibah
- Kamera ikut token dan bisa zoom, jadi ukuran tile yang mengecil di tampilan penuh tidak jadi masalah

## 17. Batch 28 Okt 2026 (malam)
- Tombol kecepatan 1x / 2x / 3x di top bar (tersimpan per perangkat). Mempercepat adegan layar penuh, langkah token, gorong-gorong, konvoi, dan kamera. Dadu tidak ikut.
- Sound Studio (menu utama dan menu Istirahat): tab Karakter (suara giliran per karakter), Celetukan & tokoh (4 celetukan, Mbak Host, preman, tukang parkir, Bos Mafia, orasi), Event (25 efek). Upload m4a/mp3/wav maks 3 MB, putar, ganti, hapus. Disimpan di IndexedDB perangkat. Prioritas: file kamu > sampel bawaan > synth.
- Suara dari Hermes (hermes-office/audio/tdj-reel-01): yang dipakai card_out v2 (kartu), typewriter v3 (teks diketik), keyboard v3 (teks berita), fold v1 (runtuh/mangkrak), clock_tick v2 (sidang banding), music v1 (musik tema Santai). Yang tidak dipakai karena hasilnya noise penuh: pop, button, check, send, mic, brush (semua < 1 detik), hit_soft, clutter, conveyor_start, conveyor_loop.
- Repo publik: kode MIT, audio Stability AI Community License (ASSETS.md), aturan konten satire di CONTRIBUTING.md, deploy otomatis ke GitHub Pages lewat branch gh-pages.

## 18. Batch 28 Okt 2026 (20.00)
- Mendarat di Lapas (Politik) = event OTT: adegan talkshow lalu ditahan. Kartu "Kena OTT!" di Manuver tetap ada (teks: ketahuan maling duit rakyat).
- Tiga opsi saat ditahan (Politik): Ikuti masa tahanan (kocok, double = bebas, maks 3 giliran), Banding Rp150rb (50% bebas), Sogok hakim Rp250rb (pasti bebas). Santai tetap Bayar Rp100rb.
- Modal beli/bangun/gusur jadi kartu kecil di kanan bawah dan muncul 1 detik setelah token sampai (0,6 detik untuk kartu), supaya board tetap kelihatan.
- Judul board Politik: NEGERI BEDEBAH. Mode malam dihapus.
- Bos Mafia pakai selempang "MAFIA SAWIT". Dadu putih polos tanpa pinggiran abu.
- Pojok Start Politik: Gedung Wakil Rakyat (kubah hijau terbelah). Pojok Lapas: Gedung Antirasuah (menara putih berkepala merah) plus rutan. Tanpa logo dan tanpa nama lembaga.
- Musik Politik sementara pakai track tense sampai Hermes kirim politik_loop. Sting Breaking News pakai synth sampai Hermes kirim sting_breaking. Brief: hermes-office/audio/kepulauan-cuan/BRIEF-stable-audio.md

## 19. Banding (dikerjakan 28 Okt 21.30)
- Banding turun dari Rp150rb ke Rp100rb (50% bebas). Alasan: di Rp150rb, rata-rata butuh 2 kali coba (sekitar Rp300rb), jadi selalu kalah dari Sogok hakim Rp250rb yang pasti bebas. Di Rp100rb pilihannya jadi adu nyali: hemat tapi untung-untungan, atau mahal tapi pasti.

- Santai: Minta jemput Rp50rb (50%) vs Bayar Rp100rb (pasti).

## 20. Batch 28 Okt 2026 (21.30)
- Roster per tema. Politik: 21 tokoh satire fiktif (wajah chibi generik, dikenali dari kostum dan props, tanpa nama asli). Santai: 8 karakter lama. Arketipe lama (Pak Jenderal dkk) keluar dari roster.
- Warna kulit beragam per karakter, tidak dilebih-lebihkan.
- Pilih karakter: tombol Acak (pemain ini) dan Acak semua pemain.
- Pasif karakter: opsi lobby (Politik saja), default Mati. Daftar pasif ada di PASSIVES (src/engine.js). Diuji 8000 game per varian: semua karakter di rentang 0,85x sampai 1,16x dari rata-rata, mirip sebaran acak tanpa pasif (0,88x sampai 1,05x). Penyesuaian: Joget Rp10rb, Tidur Siang Rp20rb, Narasumber Rp30rb, Iuran Partai Rp30rb, Prihatin ganti penuh, Ratu Pajak 20%, Pindah Kubu hanya ke kota yang lebih mahal (maks +Rp50rb), Lord ganti dari diskon bangun jadi diskon sewa 15%.
- Kas Pungli Politik meledak di Rp100rb (Santai tetap Rp1jt).

## 21. Siklus event Kas Pungli (lihat bagian 22, sudah dibangun)
Tiap kas penuh, board pindah tahap: Karhutla, Tanam Sawit, Bangun IKN, Proyek Mangkrak, Tambang Nikel, Reklamasi, Food Estate, Banjir Rob, lalu ulang. Catatan: di ambang Rp100rb siklus habis di tengah game; Rp250rb cukup untuk satu siklus per game.

## 22. Cerita tengah board (dibangun 28 Okt 22.10)
- Tema Politik. Kas Pungli memajukan babak. Babak 0 ke 1 di 125rb (kas tidak dikosongkan), selanjutnya tiap 250rb (separuh bansos ke pemain termiskin, separuh raib). Bar kas menampilkan babak berikutnya.
- Babak: 0 Hutan Lebat, 1 Karhutla (api menjalar pelan, warga bermasker batuk, orangutan menangis di pucuk pohon, kabut asap), 2 Pemadaman (pesawat water bombing dan hujan, hutan jadi arang), 3 Tanam Sawit (pohon mati tumbang, Bos Mafia Sawit tertawa pongah sambil meremas tangan 5 detik, game ditahan, tap untuk lanjut; plang KONSESI PT SAWIT JAYA ABADI, orangutan di balik pagar), 4 Panen Raya (sawit besar, pabrik berasap, karung uang membesar sesuai kas, orangutan di kandang Konservasi), 5 Proyek IKN (sebagian sawit digusur, gunting pita, crane berputar), 6 Mangkrak (crane diam, pita STOP, papan "dalam peninjauan", orangutan duduk di ujung crane), 7 Banjir Rob (air naik menutup pulau, orangutan di atas balok kayu), 8 Reboisasi Pencitraan (pejabat tanam satu bibit di depan kamera), lalu kembali ke Karhutla.
- Kejadian berkala tidak pakai timer: muncul saat dadu dilempar, satu kejadian tiap 2 sampai 3 lemparan, sesuai babak (orangutan tepuk dada, asap menyapu dan semua token batuk, burung panik, truk bibit atau buah sawit lewat, palu tiang pancang, angin dan crane berderit, perahu warga, kilatan kamera). Dadu istirahat di tepi kiri dan kanan pulau supaya tengah pulau terlihat.
- Rata-rata kas terisi sekitar 1,5jt per game (simulasi), jadi umumnya sampai babak 5 sampai 6.

## 23. Batch 29 Okt 2026 (dikerjakan paralel: aturan, board, tampilan)
- Tile buyable tinggal 3 jenis: Kota, Konsesi (wisata + PLN + PDAM, 6 tile, sewa [50,100,180,300,420,550]rb, menang dengan 5 dari 6), Transportasi (sewa 25/50/75/100rb). Nama transportasi Politik: Jet Pribadi Pejabat, Pelabuhan Ekspor Nikel, Kereta Cepat Utang, Bus Studi Banding.
- Dadu ikut bar kekuatan yang naik turun bolak-balik (rata-rata jumlah 6,1 di bar kosong sampai 7,9 di bar penuh, semua angka tetap mungkin). Si Gemoy dengan pasif nyala: double sekitar 25%.
- Uang kartu mengikuti persen modal awal (cardAmt/cardText).
- Kas Pungli Politik: pajak tahunan 0,25% aset per ronde, pajak transaksi 2% (beli, bangun, konsesi, gusur), Pungli/Parkir/Sogok/Banding hanya 40% masuk kas. Pungli 10% naik 1 poin tiap 2 ronde (maks 20%), Parkir Rp2.000 per langkah naik Rp500 tiap 2 ronde (maks Rp5.000). Median kas 1,47jt per game, sekitar 6 babak cerita.
- NPC: lobby per slot Manusia/NPC dengan level Mudah/Sedang/Sulit. Bot lawan bot 3000 game: Sulit 38%, Sedang 28%, Mudah 8% kemenangan per kursi.
- Board: dadu putih polos, pulau 1,5x (88 pohon), warna region kontras penuh di tile, animasi bangun 2,5 dtk (crane, perancah, pekerja, gunting pita), PLN kesetrum, wajah ngeledek saat gusur, tile transportasi dan Dana Hibah (koper HIBAH) baru, asap karhutla baru, balon "uhuk uhuk!", banner tiap babak + kamera 7 dtk, Pemadaman 14 dtk dengan Si Gemoy "Kami sudah berusaha semaksimal mungkin" dan token "Alah, omon-omon doang lu!", stempel "Lahan ini telah ditanam sawit".
- Tampilan: kartu prompt kecil di kiri atas, layar giliran full dihapus (token membesar + panah + nama), bar pemain mini dengan panel detail saat di-tap, setting kamera Dinamis/Statis, musik Politik santai kecuali akhir game, adegan layar penuh berhenti di frame akhir dan harus di-tap Tutup, banner pasif 3,5 dtk, sapaan Ibu/Bapak di OTT, highlight kuning tujuan Gorong-gorong.
- Catatan terbuka: NPC Mudah terlalu lemah; Si Gemoy pasif sedikit di atas rata-rata (1,16x sampai 1,24x).

## 24. Batch 29 Okt 2026 (13.14): adegan penuh + VO
Status: dibangun kecuali yang ditandai.
- **Blusukan (gorong-gorong, politik).** Adegan syuting konten: sutradara (pengacara) + kru (tukang) + kamera + softbox + clapperboard. Take 1 token turun got, "Cut! Sekali lagi, Pak, kurang natural.", Take 2, "Oke, bagus! Langsung upload!", warga "Wah, Bapak masuk got!", band BLUSUKAN + "Muncul di {kota}". Durasi 9,6 dtk. Event engine `blusukan`.
- **Gajian Pejabat (lewat Start, politik).** Slip gaji: gaji pokok kecil (10%), lalu tunjangan rumah dinas, transport, komunikasi, dana reses, kunjungan kerja, uang sidang menumpuk sampai total = gaji (Rp200rb, 2x saat Mudik). Stempel CAIR!. Durasi 9 dtk. Semua tema: floater besar "GAJIAN +Rp200rb" di atas token (jawaban: gaji memang masuk, sebelumnya cuma floater kecil yang tenggelam).
- **Kampanye Akbar:** 11 slogan acak (`SLOGANS` di 09f_vo.js), tampil di baliho dan pidato.
- **Sel:** 10 pasangan keluhan/jawaban sipir acak (`SEL_PAIRS`), termasuk "AC-nya kurang dingin" / "Mau dingin ya bayar, Boss."
- **Dana Hibah:** kartu "Rapat di Hotel Bintang 5" (Rp60rb) dan "Studi Banding ke Luar Negeri" (Rp100rb) dibayar dari Kas Pungli. Kas berkurang; kas kosong = acara batal.
- **Tak bisa diambil alih** (landmark, konsesi, kota tanpa opsi takeover): pemilik "Bayar dulu, Bos!", token "Sialan lu!" (VO `bayarDulu`, `sialan`).
- **VO tiap adegan:** registri `VO_LINES` (09f_vo.js) key -> [peran, kalimat]; diputar via `vo(key)` = `play('vo:'+key)`, diam kalau belum ada audio. File nanti `assets/sfx/vo_<key>.m4a`. Klip manual pemain di Sound Studio selalu menang.
- **Casting suara (Pocket TTS, 4 suara stok + dede/vina/kinta):** hakim, sipir, pengacara, token = suara stok; sutradara/orator = dede; warga/wartawan = vina; narator = kinta. Brief di hermes-office BRIEF-stable-audio.md bagian 12.
- **Ditunda:** Opsi Tawar (alternatif takeover: tawar harga ke pemilik). "Gitu aja kok repot" diulang Hermes.
- Usulan pengali landmark: diputuskan, lihat bagian 25.

## 25. Batch 29 Okt 2026 (13.39): pengali landmark, segel, nuklir, performa
- **Tangga pengali Proyek Strategis/Landmark.** Naik hanya saat **pemilik** mendarat di landmark miliknya: x1 → x2 → x4 → x8 → x16 (mentok). Kunjungan lawan tidak menaikkan. Region warna penuh = tangga mulai di x2 (tidak dikali lagi). Kampanye Akbar dan bonus lain (baliho, pinguin) dikali di atas tangga, total landmark maksimal **x32**. Kota non-landmark tetap maksimal x6. Bangun landmark baru = tangga mulai x1. Label "x2/x4/.../x32" di atas kota: kuning x2, oranye x4–8, merah x16+.
  - Alasan desain (keputusan Dede): x32 memang membunuh, tapi hanya terjadi di late game, saatnya ada yang kalah.
- **Segel (Demo Mahasiswa).** Pemilik yang mendarat di kotanya yang disegel boleh bayar denda (10% nilai investasi, min Rp20rb, masuk Kas Pungli). Segel dicabut, sewa jalan lagi, lalu lanjut bangun atau naik pengali. Tidak bayar = tidak bisa bangun dan tangga tidak naik.
- **Kartu Manuver "Telepon dari Kim Jong Ah".** Pilih satu landmark lawan, turun ke Izin Lahan (level 0), pemilik tetap, pengali reset x1. Adegan: telepon merah, rudal, jamur nuklir, "RATA!". Tanpa target atau dipilih simpan: nuklir disimpan, **pajak gudang Rp50rb (ikut modal awal) tiap lewat Gajian**, dipakai lewat tombol "Pakai nuklir" di awal giliran.
- **Gajian:** adegan slip gaji hanya saat berhenti tepat di Gedung Wakil Rakyat (Start). Lewat doang = floater "GAJIAN +Rp200rb".
- **Gempa/Mangkrak:** tetap hanya kota (level 1–3), turun 1 level, tidak pernah konsesi/transportasi. Animasi diganti: bangunan goyang dan menyusut satu tingkat, retakan hanya di tile itu, floater "TURUN 1 LEVEL" (sebelumnya terlihat seperti runtuh total).
- **Slogan:** "19 juta lapangan kerja, tinggal cari lapangannya!"
- **Performa:** sprite karakter disimpan dalam ukuran jadi (tidak di-resize tiap frame); mafia di layar tengah digambar ulang ~8 fps saat diam; frame idle 15 fps setelah 2,5 detik, 10 fps setelah 15 detik; kualitas adaptif (kalau frame sibuk lambat: batasi 30 fps, lalu resolusi 2x → 1,5x → 1,25x → 1x); audio di-decode bertahap. Mesin uji (render software): frame 139 → ~350 per 25 detik, median jeda 167 → 67 ms.

## 26. Kas Negara (29 Okt 2026, 14.01): menggantikan Kas Pungli
- **Satu kas, Kas Negara.** Mulai penuh: 1,6 x modal awal x (jumlah pemain / 4), dibulatkan Rp100rb. Contoh modal Rp1,5jt, 4 pemain = Rp2,4jt. Angka 5x usulan awal diuji simulasi: kas sisa 51% di ronde 25 dan IMF tidak pernah muncul, jadi diturunkan.
- **Keluar dari kas:** gaji, semua kartu yang memberi uang, rapat hotel/studi banding, pasif yang memberi uang, serangan fajar. Kas seret = gaji cair sebagian.
- **Masuk ke kas:** pungli 40% (sisanya raib), pajak transaksi/tahunan, denda, sogok, kartu bayar. Kas tidak bisa melebihi isi awal (lebihnya raib).
- **Cerita tengah board maju saat kas menipis:** 90% Karhutla, 80% Pemadaman, 70% Tanam Sawit, 60% Panen Raya, 50% Proyek IKN, 40% Mangkrak, 27% Banjir Rob, 14% Reboisasi Pencitraan. Bar tengah: "Kas Negara X / Y · babak berikutnya di Z".
- **Kosong pertama: Ngutang ke IMF** (adegan 20 dtk: brankas kosong, pejabat memohon, bankir kasih syarat, perjanjian distempel DISETUJUI). Kas diisi 50% dari isi awal, gaji dipotong 50% sampai game selesai.
- **Kosong kedua: Negara Bubar** (adegan 14 dtk: mafia nangis, pejabat kabur ke luar negeri bawa koper). Game selesai, harta terbesar menang: "Negara Bubar · Bedebah Terakhir".
- Simulasi 200 game bot (25 ronde): IMF di hampir semua game, median ronde 17; Negara Bubar sekitar 12% game.
- Bug diperbaiki: token sempat tampil di tujuan sebelum jalan (saat layar tengah dikunci). Sekarang token menunggu di petak asal; floater/adegan gajian muncul saat token benar-benar sampai Start.

## 27. Penamaan aman (29 Okt 2026, 14.21)
- Semua kata yang bersifat tuduhan diganti olokan: judul board dan akhir game jadi "Negeri Bedebah" / "Bedebah Terakhir".
- Semua rujukan ke game komersial lain dihapus dari game, README, dan GDD.
- Kasus OTT yang mirip kasus nyata tetap, ditambah "di Negeri Konoha" (KTP elektronik, impor gula, tambang timah, kuota haji, minyak goreng, BTS, dana pensiun, wisma atlet, alkes, daging sapi, benih lobster, BBM oplos, simulator SIM).
- Penafian di layar judul: "Semua tokoh, kasus, dan negeri dalam game ini fiktif. Kemiripan hanya kebetulan."
- Papan nama babak cerita di pulau tengah, tampil selama babak berjalan (Karhutla merah berkedip selama api menyala).

## 28. Semua suara (29 Okt 2026, 14.30)
- Registri suara lengkap: 336 file (`src/ui/09f_vo.js` + `09h_lines.js`). Brief MASTER VO di hermes-office bagian 13, status per file di `VO-STATUS.md`.
- **Karakter:** tiap karakter punya kalimat giliran, dipilih di lobby, pasif aktif (Politik), dan menang. Karakter perempuan (Mak Banteng, Ratu Pajak, Mbak Mic Mati, Mbak Cuan, Nenek Licik, Dewi Penari) pakai kinta/vina.
- **Kalimat token di adegan** punya versi `_f`; game otomatis memakai versi perempuan kalau pemainnya karakter perempuan. Celetukan juga (`quip:x_f`).
- **Narator (kinta):** nama kartu saat diambil, Breaking News, tiap babak cerita, Proyek Strategis berdiri, penggusuran, bangkrut, serangan fajar.
- Sound Studio dibagi: Suara karakter, Voice over adegan, Narator. Klip manual pemain tetap menang dari bawaan.
- Impor: `python3 tools/import_vo.py <hermes-office>/audio/kepulauan-cuan` pilih take terbaik lewat transkrip whisper, potong ekor, simpan `assets/sfx/vo_<key>.m4a`, tandai VO-STATUS. File yang sudah ada tidak ditimpa.

- Layar penafian sebelum tiap game Politik (setelah pilih karakter dan saat Main Lagi): "Semua karakter, tokoh, kasus, dan negeri dalam game ini fiktif." Tombol "Paham, mulai main" aktif setelah 2 detik.
- **Lag (29 Okt 16.49):** Bos Mafia sekarang hanya muncul selama tombol kocok ditahan dan langsung turun saat dadu dilempar (tanpa pill petunjuk), digambar resolusi 1x. Posisi topbar untuk mafia di-cache (sebelumnya baca layout tiap frame). Menu: "Penghitung FPS" (fps, waktu JS per frame, resolusi) dan "Grafik: Ringan" (papan di-cache dalam 3 lapisan kedalaman; default Normal karena di mesin uji tanpa GPU justru lebih lambat, perlu diukur di iPad).

- Lobby (29 Okt 20.12): dua kolom di layar lebar. Tiap pemain cukup sakelar Manusia/NPC. Level NPC satu pilihan (Mudah/Sedang/Sulit/Atur sendiri); pilihan per baris hanya muncul kalau Atur sendiri. Batas ronde dan modal awal punya opsi Atur sendiri yang memunculkan isian.
- Fix lag (29 Okt 23.20): momen kecil pulau tengah (burung, orangutan, batuk) tiap 2-3 kocokan tadinya ikut mengunci game 10 detik dan menarik kamera; sekarang tidak mengunci. Jeda dadu ke token jalan 300 ke 120 ms, jeda mendarat ke kotak pilihan 1000 ke 450 ms.
- Lobby surat suara (29 Okt 23.30): peserta = kotak calon bernomor urut warna pemain; tambah/hapus peserta langsung di daftar (tombol Jumlah pemain dihapus); level NPC muncul di kotak NPC itu, pilih sekali dan NPC lain yang belum diatur ikut; pilihan aktif ditandai bekas coblos; tombol utama merah stempel.
- 29 Okt 23.55: (A) utang yang tidak tertutup aset ditalangi Kas Negara ke penagih, pemain tetap bangkrut; kas kosong = penagih dapat sisa. Batas piksel papan ~3,2 juta (layar PC besar). Klip dialog di-decode saat pertama diputar, maksimal 40 di memori. Penjaga tombol aksi (bar kosong >1,5 dtk saat giliran manusia = gambar ulang). Sound Studio: Buang/Pulihkan suara bawaan + Salin daftar dibuang.
- 30 Okt 00.07: semua file suara dialog (319 VO Hermes + 10 celetukan lama) dihapus dari repo atas keputusan Dede; yang tersisa efek suara, bunyi transportasi, musik. Slot suara tetap ada di Sound Studio untuk diisi manual. Registri VO_LINES dan alat impor tetap ada kalau nanti mau diisi lagi.
