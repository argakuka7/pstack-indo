# how: bagaimana kode bekerja

Bab ini membedah [skill how](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/how/SKILL.md) dari dalam: kapan skill itu dipakai, cara ia membagi pekerjaan ke explorer dan explainer, dan bentuk penjelasan yang dihasilkannya. Dua referensi pendampingnya, [explorer-prompt.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/how/references/explorer-prompt.md) dan [explainer-prompt.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/how/references/explainer-prompt.md), adalah template prompt yang diisi skill saat meng-spawn subagent.

Skill ini menjawab pertanyaan "bagaimana X bekerja". Target kualitasnya eksplisit di SKILL.md: penjelasan arsitektural pada tingkat insinyur senior yang baru onboarding ke sebuah subsistem, cukup untuk membangun model mental yang bisa dipakai bekerja, tetapi tidak sampai terasa seperti kode sumber beranotasi. Skill ini juga dipakai untuk penelusuran kode sebelum menyunting, dan pertanyaan penempatan, kepemilikan, serta pelapisan seperti "di mana seharusnya ini berada" atau "paket mana yang memiliki ini". Untuk motivasi di balik rancangan, wilayahnya skill why, yang dibahas di bab [why](32-ch-why.md).

Contoh pemakaiannya dari panduan pstack:

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

## Model per peran

Setiap spawn di skill ini menamai satu baris peran di rule `pstack-models.mdc` beserta bawaannya: `how explorer` dengan bawaan `grok-4.7-xhigh-fast`, dan `how explainer` dengan bawaan `claude-opus-5-5-max`. Nilai `model` diambil dari baris peran tersebut, atau dari bawaan bila baris atau rule-nya tidak ada. Bila nilainya `auto` atau `inherit-parent`, field `model` dibiarkan kosong. Bila Task tool menolak sebuah slug, pakai bawaannya dan katakan hal itu; bila bawaannya juga ditolak, pakai slug valid terdekat dari keluarga yang sama menurut pesan errornya. Rule ini diatur lewat `/setup-pstack`, seperti dibahas di bab [Penyiapan dan penggunaan pertama](12-ch-setup.md).

## Langkah 1: nilai kompleksitasnya

Bila cakupannya ambigu, skill menyatakan interpretasinya lalu menelusuri; pengguna bisa mengoreksi arahnya. Lalu ia memilah:

- Sederhana: satu modul, utilitas kecil, atau pertanyaan sempit seperti "bagaimana fungsi X bekerja". Tanpa explorer. Satu explainer menelusuri dan menjelaskan dalam satu pass, langsung ke langkah 2b.
- Kompleks: subsistem yang membentang banyak berkas atau layanan, fitur lintas-bidang, atau tinjauan arsitektur penuh. Explorer paralel dulu, lalu serah-terima ke explainer, ke langkah 2a.

Bila ragu, skill mengambil jalur sederhana.

## Langkah 2a: eksplorasi untuk pertanyaan kompleks

Skill memecah pertanyaan menjadi dua sampai empat sudut eksplorasi, masing-masing irisan subsistem yang berbeda, lalu meng-spawn semua explorer dalam satu pesan agar berjalan serentak. Konfigurasi tiap explorer: `subagent_type` `generalPurpose`, `model` dari baris `how explorer`, dan `readonly: true`. Setiap explorer menerima prompt yang dibangun dari template explorer-prompt dengan sudutnya diisi.

Template explorer memberi tahu explorer bahwa ia mengumpulkan fakta, bukan menulis prosa untuk manusia, karena agent lain yang menulis penjelasannya. Ia diminta fokus pada sudut yang ditugaskan dan masuk dalam, tidak mencoba mencakup semuanya. Pola eksplorasinya lima langkah:

1. Cari entry point: apa yang memicu perilaku ini, di mana ia dimulai.
2. Telusuri alurnya: ikuti rantai pemanggilan, baca tiap fungsi, pahami data yang mengalir dan transformasinya.
3. Petakan abstraksi kuncinya: tipe, interface, service, atau class yang sentral, beserta definisinya.
4. Cari batasnya: di mana subsistem ini berhubungan dengan yang lain, apa masuk dan apa keluar.
5. Cari yang tak terlihat jelas: yang mengejutkan, yang tampak seperti artefak historis, yang akan disalahpahami pendatang baru.

Templatnya juga melarang menebak dari nama: gunakan Glob untuk mencari berkas, Grep untuk simbol, Read untuk implementasi sebenarnya. Eksplorasi berlanjut sampai explorer bisa menggambarkan gambar utuhnya tanpa penggalan yang mengambang; bila ada bagian yang tidak bisa ditelusuri, itu dinyatakan apa adanya, karena "saya tidak bisa menentukan bagaimana X terhubung ke Y" lebih baik daripada mengarang.

Keluaran explorer memakai struktur tetap: Components Found untuk tipe, service, dan abstraksi kunci beserta path dan deskripsi satu kalimat; Flow untuk alur eksekusi langkah demi langkah beserta data yang mengalir; Files Read untuk semua berkas yang dibaca agar explainer bisa merujuknya; Boundaries untuk sambungan ke bagian kode lain; Non-Obvious Things untuk yang mengejutkan atau mudah salah; dan Open Questions untuk yang tidak sepenuhnya tertelusuri.

## Langkah 2b: jelaskan langsung untuk pertanyaan sederhana

Untuk pertanyaan sempit, skill meng-spawn satu subagent Task yang menelusuri dan menjelaskan dalam satu pass, dengan konfigurasi yang sama kecuali `model` diambil dari baris `how explainer`. Promptnya dibangun dari template explainer-prompt tanpa bagian temuan explorer.

## Langkah 3: sintesis

Setelah semua explorer kembali pada jalur kompleks, skill meng-spawn satu subagent Task untuk menyintesis temuan mereka menjadi satu penjelasan, pada model baris `how explainer` dan `readonly: true`. Template explainer menjelaskan tugasnya: temuan tiap explorer akan tumpang-tindih dan kadang bertentangan; rekonsiliasi dilakukan dengan menggabungkan deskripsi yang tumpang-tindih, menyelesaikan pertentangan dengan memeriksa kodenya sendiri, lalu menyatukan irisan-irisan terpisah menjadi satu gambar. Target pembacanya insinyur senior yang belum mengenal area itu, cukup paham arsitekturnya untuk mulai bekerja di dalamnya dengan percaya diri. Explainer tetap punya akses baca ke codebase untuk memeriksa detail dan menambal celah, tetapi tidak perlu mengeksplorasi ulang dari nol.

## Langkah 4: penyajian

Skill menyajikan keluaran explainer kepada pengguna. Suntingan ringan untuk kejelasan atau konteks percakapan boleh; menulis ulang secara substansial tidak.

## Bentuk penjelasan

Penjelasan memakai bagian dari template explainer, membuang yang tidak relevan:

- Overview: satu sampai dua paragraf, apa benda ini dan mengapa ada. Pembaca yang hanya membaca bagian ini harus bisa memutuskan lanjut atau berhenti.
- Key Concepts: tipe, service, atau abstraksi penting yang dibutuhkan untuk mengikuti sisanya, definisi singkat saja.
- How It Works: inti penjelasan dan bagian terpanjang. Alurnya ditulis dalam prosa, bukan pseudokode, merujuk berkas dan fungsi spesifik agar pembaca tahu ke mana melihat, tanpa menempel blok kode besar kecuali potongan yang benar-benar diperlukan.
- Where Things Live: peta berkas dan direktori singkat, hanya yang dibutuhkan untuk mulai bekerja di sana.
- Gotchas: perilaku tak terduga, konteks historis, jebakan. Bila tidak ada, bagian ini dilewati.

Untuk alur yang melibatkan banyak komponen atau data yang bertransformasi antar tahap, template meminta diagram: mermaid (` ```mermaid `) untuk alur terstruktur seperti sequence diagram dan flowchart, atau ASCII art untuk hubungan sederhana yang tidak layak mermaid. Diagram harus memperjelas, bukan menghias; bila prosa sudah cukup, diagram dilewati.

Pola komunikasinya juga diatur template: bahasa konkret, bukan abstraksi atas abstraksi; tulis "`UserService` memanggil `AuthClient.refresh()`", bukan "service mendelegasikan ke client". Sesuatu yang kompleks dijelaskan mengapa kompleks, bukan hanya dideskripsikan; sesuatu yang sederhana tidak dipanjang-panjangkan. Analogi dipakai bila membantu, dipaksakan bila tidak. Pertanyaan terbuka dan celah yang ditandai explorer diakui, bukan disembunyikan.
