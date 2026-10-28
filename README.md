# Negeri Bedebah

Monopoli ala GetRich untuk 2 sampai 5 pemain bergantian di satu iPad (hotseat). Jalan di browser, satu file HTML, tanpa server.

**Main sekarang:** https://adesyukmap.github.io/negeri-bedebah/ (buka di Safari iPad, mode landscape, lalu Share > Add to Home Screen)

## Fitur
- Board isometrik 40 tile: kota-kota Indonesia, wisata, transportasi, PLN dan PDAM, Parkir Liar, Pajak, Kesempatan, Dana Umum.
- Dua tema: **Politik "Negeri Para Koruptor"** (satire fenomena, semua tokoh fiktif) dan **Santai**.
- Adegan layar penuh dengan tombol Skip: Breaking News, OTT talkshow, Kampanye Akbar plus konvoi, Serangan Fajar.
- 21 karakter satire fiktif (tema Politik) dan 8 karakter Santai, masing-masing dengan pasif opsional. Dadu 3D, Bos Mafia Sawit pengocok dadu, gorong-gorong, gusur.
- Tombol kecepatan 1x, 2x, 3x.
- **Sound Studio**: ganti suara karakter, celetukan, dan event dengan file kamu sendiri (tersimpan di perangkat).

## Build
Butuh Python 3. Tidak ada dependency.

```bash
python3 build.py      # menghasilkan dist/index.html
open dist/index.html  # atau buka di browser mana saja
```

## Struktur
```
src/engine.js     aturan game murni (tanpa DOM), tema, kartu, event
src/shell.html    CSS dan markup layar
src/chars.js      karakter: sprite dari assets/chars, fallback gambar Canvas 2D
src/ui/*.js       render, kamera, dadu, adegan, audio, Sound Studio, input (digabung urut nama file)
assets/music, sfx  musik dan SFX
assets/chars      sprite karakter WebP, prompt dan skrip pemrosesannya (lisensi di ASSETS.md)
docs/GDD.md       game design document dan catatan keputusan
build.py          menggabungkan semua jadi satu index.html
```

## Kontribusi
Baca [CONTRIBUTING.md](CONTRIBUTING.md). Ringkasnya: fork, bikin branch, PR ke `main`. Setiap merge ke `main` otomatis deploy ke GitHub Pages.

## Lisensi
- Kode: MIT ([LICENSE](LICENSE)).
- Gambar karakter (`assets/chars/*.webp`): CC BY-NC 4.0 ([LICENSE-ASSETS.md](LICENSE-ASSETS.md)). Boleh dipakai ulang dengan atribusi, tidak untuk dijual.
- Audio: Stability AI Community License, detail di [ASSETS.md](ASSETS.md).

## Disclaimer
Game ini satire tentang fenomena, bukan tentang orang. Semua tokoh fiktif dengan wajah kartun generik. Kemiripan dengan siapa pun hanyalah kebetulan.
