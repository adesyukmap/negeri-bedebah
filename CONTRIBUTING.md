# Cara kontribusi

Terima kasih sudah mau bantu. Semua perubahan masuk lewat Pull Request dan direview oleh maintainer (@adesyukmap).

## Alur
1. Fork repo ini, lalu bikin branch dari `main` (contoh: `fitur/kartu-baru`).
2. Ubah file di `src/` atau `assets/`. Jangan commit `index.html` atau `dist/`, itu hasil build.
3. Jalankan `python3 build.py` dan coba di browser, idealnya di iPad Safari landscape.
4. Buka PR ke `main` dengan penjelasan singkat dan screenshot atau video kalau ada perubahan visual.

## Aturan konten (wajib)
Tema Politik adalah satire **fenomena**, bukan serangan ke orang.
- Semua tokoh fiktif. Dilarang karikatur, kemiripan wajah, nama, atau logo tokoh, partai, perusahaan, dan media yang nyata.
- Warna kulit boleh beragam dan harus wajar, tapi tidak pernah jadi bahan lelucon.
- Dilarang istilah bernada SARA atau rasis (contoh: "aseng").
- Kasus OTT dan berita ditulis tanpa nama orang.
- Merek dagang tidak boleh muncul (mobil, ponsel, TV, dan lain-lain).

PR yang melanggar aturan ini akan ditutup.

## Aturan kode
- `src/engine.js` tetap murni: tidak boleh menyentuh DOM atau Canvas. UI membaca state dan event dari engine.
- Kalau mengubah aturan atau angka ekonomi, jelaskan alasannya dan dampaknya di PR. Catat keputusannya di `docs/GDD.md`.
- Tidak menambah library eksternal atau request ke internet. Game harus tetap satu file yang jalan offline.
- Target performa: lancar di iPad M2 Safari.

## Aset
- Sprite karakter: PNG latar hijau polos #00FF00, satu karakter, badan penuh, gaya chibi sama dengan set yang ada. Pakai template di `assets/chars/PROMPT-base.txt` dan tulis deskripsi kostum, rambut dan properti saja, **tanpa nama orang**. Jalankan `python3 assets/chars/proc.py` untuk membuang latar dan memotong.
- Audio: m4a (AAC) mono 44.1 kHz, sependek mungkin. Tambahkan baris di `ASSETS.md` dengan sumber dan lisensinya.
- Aset tanpa lisensi yang jelas tidak akan di-merge.

## Lapor bug atau ide
Buka Issue. Sertakan perangkat, browser, tema, dan langkah untuk mengulang bug-nya.
