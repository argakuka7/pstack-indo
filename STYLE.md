# Pedoman penulisan

Pedoman ini berlaku untuk berkas di `manuscript/`. Gunakan `GLOSSARY.md` sebagai acuan istilah.

## Sumber dan batas

- Satu-satunya rujukan isi adalah `cursor/plugins`, direktori `pstack/`, pada commit `adf3218ca2f5b9971eedc07a76bef22df7701539`. Rincian ada di `SOURCE.md`.
- Edisi Korea hanya menjadi acuan struktur bab dan tooling build. Jangan menerjemahkan atau menyalin teksnya.
- Jangan menyimpulkan perilaku yang tidak didukung sumber. Bedakan kutipan, parafrasa, contoh buatan buku, dan penjelasan editorial.
- Jelaskan pstack sebagai plugin Cursor. Jangan menganggap perilaku produk lain sama.

## Bahasa dan nada

- Gunakan Bahasa Indonesia baku yang jelas dan langsung. Gunakan kalimat aktif bila wajar.
- Tulis sebagai buku panduan teknis, bukan blog, iklan, percakapan, atau catatan harian.
- Hindari bahasa promosi, klaim berlebihan, hiperbola, dan pengulangan yang tidak menambah informasi.
- Jangan gunakan tanda pisah panjang. Pisahkan kalimat atau gunakan koma, titik dua, atau tanda kurung.
- Pertahankan nama produk, skill, playbook, agent, command, identifier, nama berkas, kode, dan path dalam bahasa Inggris sesuai sumber.

## Istilah

- Gunakan padanan di `GLOSSARY.md` secara konsisten. Jika istilah teknis muncul pertama kali, beri padanan Indonesia bila membantu, lalu pakai bentuk glosarium.
- Jangan menerjemahkan nama khusus pstack seperti `poteto-mode` atau nama skill.
- Pertahankan ejaan dan kapitalisasi identifier persis seperti sumber.

## Bentuk bab

- Satu berkas Markdown per bagian, bab, atau lampiran. Nama berkas mengikuti urutan dan pola `NN-kind-slug.md`.
- Awali setiap berkas dengan satu judul `#`. Jangan tulis nomor bab secara manual; nomor ditentukan urutan berkas.
- Tautkan bab lain memakai path Markdown relatif. Tautkan klaim faktual ke permalink sumber pada commit yang dipatok.
- Contoh yang dibuat khusus untuk buku harus ditandai jelas sebagai contoh buatan buku. Jangan sajikan sebagai materi asli pstack.
