# Panduan pstack Bahasa Indonesia

Buku panduan tidak resmi tentang plugin pstack karya Lauren Tan untuk Cursor. Repositori ini masih berupa **rangka**: tooling build EPUB/PDF, pedoman gaya, glosarium, atribusi, dan kerangka bab sudah disiapkan. Terjemahan isi sudah berlangsung, dimulai dari batch pembuka ini.

## Build

Perlu Bun. Pasang dependensi lalu buat kedua format. Google Chrome/Chromium menghasilkan PDF dengan tata letak buku; tanpa browser, build menghasilkan PDF pratinjau sederhana untuk rangka.

```sh
bun install
bun run build
bun run check
```

Hasilnya ada di `dist/pstack-guide-0.15.5-id.0.epub` dan `dist/pstack-guide-0.15.5-id.0.pdf`. Untuk membangun satu format, gunakan `bun tools/build.mjs epub` atau `bun tools/build.mjs pdf`. Jika browser tidak terdeteksi otomatis, atur `CHROME_PATH` ke executable Chrome/Chromium.

## Struktur naskah

`manuscript/` mengikuti susunan berkas edisi Korea: 37 berkas termasuk halaman awal dan lampiran, dengan 31 berkas bagian/bab. Sepuluh berkas sudah memuat terjemahan lengkap: lima berkas batch pembuka ditambah pembuka bagian kerja, bab poteto-mode, dan tiga bab playbook (mengerjakan tugas, pull request, pekerjaan panjang); sisanya masih judul Bahasa Indonesia dan placeholder. Gunakan `STYLE.md` dan `GLOSSARY.md` sebelum menulis naskah.

## Atribusi dan lisensi

pstack asli berada di [cursor/plugins](https://github.com/cursor/plugins/tree/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack), versi 0.15.5, Copyright (c) 2026 Lauren Tan, MIT. Sumber asli tersebut adalah satu-satunya rujukan isi. Edisi Korea [pstack-guide-ko](https://github.com/jayjongcheolpark/pstack-guide-ko) dipakai hanya sebagai cetakan struktur dan tooling; naskah Korea tidak disalin. Ini edisi Bahasa Indonesia tidak resmi dan belum ditinjau atau disahkan oleh Lauren Tan maupun Cursor.

Lisensi MIT dan atribusi lengkap ada di [LICENSE](LICENSE) dan [NOTICE.md](NOTICE.md). Informasi provenance tercatat di [SOURCE.md](SOURCE.md).
