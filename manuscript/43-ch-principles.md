# Skill prinsip

pstack memuat dua puluh tiga skill pendek, satu prinsip per skill, di folder `principle-*`. Menurut [README pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/README.md), `poteto-mode` mengindeksnya secara inline dan membaca indeks itu di awal tugas, sedangkan berkas mandirinya ada agar skill lain bisa merujuk sebuah prinsip berdasarkan namanya dan agar indeks bisa menunjuk aturan lengkapnya. Aturan [poteto-mode](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/SKILL.md) juga mensyaratkan berkas daun sebuah prinsip dibaca penuh sebelum prinsip itu diterapkan atau dikutip.

Bab ini merangkum tiap prinsip dalam satu entri: inti aturannya, kapan berlaku, dan pelanggaran khasnya menurut berkas sumbernya. Nama subbagian adalah nama foldernya, dan indeks poteto-mode membagi dua puluh tiga prinsip itu ke dalam lima grup: core, architecture, verification, delegation, dan meta. Rangkuman ini pengganti navigasi, bukan pengganti berkas daun; aturan penuh tiap prinsip tetap di SKILL.md masing-masing.

## Grup core

### [principle-laziness-protocol](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-laziness-protocol/SKILL.md)

Intinya: hasil terbanyak dengan kode dan kompleksitas paling sedikit, condong ke penghapusan. Berlaku saat refactoring, menilai ukuran diff, atau saat tergoda menambah abstraksi, lapisan, atau threading sinyal baru. Pelanggaran khasnya: menjawab satu pertanyaan perlu menelusuri lebih dari tiga berkas atau lapisan, keputusan yang sama diulang di beberapa tempat, dan kebocoran kecil seperti pass-through serta representasi yang bocor dibiarkan menyebar. Uji akhirnya: bila pengembang manusia akan lelah memelihara kode itu, solusinya buruk.

### [principle-foundational-thinking](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-foundational-thinking/SKILL.md)

Intinya: keputusan struktural melindungi nilai opsi, keputusan tingkat kode melindungi kesederhanaan, dan struktur data dikerjakan sebelum logika. Berlaku sebelum menulis logika: memilih tipe dan struktur data inti, mengurutkan kerja scaffold lawan fitur, dan menanya apa yang dibagi aktor konkuren. Pelanggaran khasnya: logika ditulis sebelum bentuk datanya, kapabilitas baru disebarkan sebagai koordinasi kasus khusus lintas pemanggil, dan scaffold dikerjakan setelah fitur padahal tiap fase berikutnya membutuhkannya. Penghapusan kode mati mendahului pemasangan scaffold.

### [principle-redesign-from-first-principles](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-redesign-from-first-principles/SKILL.md)

Intinya: saat mengintegrasikan kebutuhan baru ke desain yang ada, rancang ulang seolah kebutuhan itu jadi asumsi hari pertama, alih-alih menempelkannya. Berlaku saat mengintegrasikan perubahan ke desain eksisting. Pelanggaran khasnya: perubahan ditempel tanpa membaca semua berkas terdampak, dan propagasinya berhenti di kode padahal tipe, docs, contoh, dan rationale juga menyimpan referensi bentuk lama. Rancangan utuhnya dipikirkan dulu, lalu dikirim bertahap.

### [principle-attack-the-premise](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-attack-the-premise/SKILL.md)

Intinya: bila dua perbaikan atau lebih yang berbagi satu premis gagal di gerbang yang sama, curigai premisnya, bukan perbaikannya; tuliskan premisnya dan lakukan sensus aktor sebelum menulis perbaikan berikutnya. Berlaku persis pada situasi kegagalan berulang itu. Pelanggaran khasnya: mengompensasi asimetri dengan jalur balik, pool bersama, hand-off batch, atau rebalance berkala, yang meninggalkan penugasan perannya di tempat dan menambah kerja di tiap run. Bila sensusnya merata, premisnya bukan penyebabnya.

### [principle-subtract-before-you-add](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-subtract-before-you-add/SKILL.md)

Intinya: saat mengembangkan sistem, hapus kompleksitasnya lebih dulu, lalu bangun di atas basis yang lebih sederhana; meninggalkan desain sedikit lebih sederhana dari saat ditemukan adalah investasi berkelanjutan. Berlaku saat mengurutkan penambahan, refactor, atau rewrite. Pelanggaran khasnya: validator, parser, atau guard spekulatif di luar tuntutan spec, polesan sebelum pangkas, dan referensi tanpa isi baru dibiarkan sebagai stub alih-alih dihapus.

### [principle-minimize-reader-load](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-minimize-reader-load/SKILL.md)

Intinya: maintainability adalah kerja yang harus dilakukan pembaca untuk memahami kode, dan ada dua sumbu yang dijaga: jumlah lapisan antara pertanyaan dan jawaban, serta state tersembunyi yang harus dipegang di kepala. Berlaku saat meninjau atau membentuk kode yang sulit ditelusuri. Pelanggaran khasnya: wrapper dengan satu pemanggil, adapter tanpa implementasi kedua, lapisan yang mengulang metode dan argumen yang sama, interface lebar yang menyembunyikan sedikit, dan lingkup state yang lebih luas dari perlu. Ujinya: pembaca baru harus bisa menjawab "dari mana X berasal" dan "apa yang bisa mengubah X" dalam tiga puluh detik.

### [principle-outcome-oriented-execution](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-outcome-oriented-execution/SKILL.md)

Intinya: optimalkan keadaan akhir yang dimaksudkan dan bisa diverifikasi, bukan kestabilan tiap tahap antara; kerusakan antara diperbolehkan bila direncanakan, terbatas, dan bisa dibalik. Berlaku pada rewrite dan migrasi terencana dengan batas fase eksplisit. Pelanggaran khasnya: kode kompatibilitas sementara yang berumur panjang sebagai utang, cakupan kerusakan sementara yang tidak dideklarasikan, dan absennya verifikasi statis serta runtime penuh saat rencana selesai.

### [principle-experience-first](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-experience-first/SKILL.md)

Intinya: saat kenyamanan implementasi berbenturan dengan kepuasan pengguna, pilih kepuasan; kirim lebih sedikit yang dipoles daripada lebih banyak yang kasar. Berlaku pada tradeoff produk, UX, atau cakupan fitur. Pelanggaran khasnya: fitur, kontrol, dan opsi tanpa justifikasi, loop inti yang tidak dikerjakan, dan detail transisi, perataan, umpan balik, serta error state yang dibiarkan. Penggunanya adalah siapa pun yang mengonsumsi hasil kerja: pengguna akhir, kolega yang mengimpor library, sampai insinyur yang memelihara kodenya berikutnya.

### [principle-exhaust-the-design-space](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-exhaust-the-design-space/SKILL.md)

Intinya: bila keputusan tidak punya preseden dan jawabannya tidak obvious, bangun dua sampai tiga prototipe bersaing dan bandingkan berdampingan sebelum berkomitmen; "design it twice" adalah nama lain aturan ini, dan varian kedua dari bentuk pertama tidak ikut. Berlaku pada interaksi UI baru, pilihan arsitektur dengan beberapa pendekatan yang sama-sama viable, dan keputusan produk yang bergantung pada rasa, bukan logika. Tidak berlaku untuk implementasi mekanis yang polanya mapan, perbaikan dengan keadaan target yang jelas, atau kendala yang hanya menyisakan satu bentuk.

### [principle-build-the-lever](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-build-the-lever/SKILL.md)

Intinya: untuk kerja non-trivial, bangun alat yang mengerjakan atau membuktikannya, misalnya codemod, script, generator, atau skill yang dibaca subagent, alih-alih mengerjakannya dengan tangan; alat itu adalah artefak yang bisa dijalankan ulang peninjau, dan "percayalah padaku" berubah menjadi "jalankan ini". Berlaku pada pekerjaan apa pun yang tidak trivial, bukan hanya kerja massal. Pelanggaran khasnya: mengutip prinsip ini tanpa ada codemod, script, generator, atau skill delegat di diff, serta fan-out delegasi untuk mengerjakan manual apa yang bisa diproses satu script sekali jalan. Batasnya trivialitas, bukan repetisi.

## Grup architecture

### [principle-model-the-domain](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-model-the-domain/SKILL.md)

Intinya: enkode domain nyata ke dalam struktur data, misalnya state machine, model bertipe, registry atau tabel lookup, reducer, batas modul kecil, atau koleksi yang cocok dengan pola aksesnya, alih-alih menyebarkannya di kondisional; struktur yang cocok membuat state tak valid tak terwakili dan menghapus cabang. Berlaku saat menulis logika stateful atau saat kode bercabang banyak dan mengulang asumsi bentuk lintas berkas. Pelanggaran khasnya: fitur baru menambah satu cabang lagi pada if/else yang ada, boolean kedua yang harus selalu sinkron dengan yang pertama, dan dekomposisi temporal, yakni modul bernama fase yang mengulang aturan domain yang sama lintas langkah.

### [principle-boundary-discipline](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-boundary-discipline/SKILL.md)

Intinya: validasi, pengeturan tipe, dan penanganan error dipusatkan di batas sistem seperti argumen CLI, config, API eksternal, dan protokol jaringan; di dalam sistem tipenya dipercaya; logika bisnis hidup di fungsi murni dengan shell yang tipis dan mekanis. Berlaku saat memasang validasi, error handling, atau adapter framework. Pelanggaran khasnya: validasi berulang jauh di dalam rantai pemanggilan padahal batas sudah memvalidasi, re-export tipe transport, penyimpanan, atau wire lewat permukaan publik, dan logika bisnis yang menyatu dengan wiring framework sehingga tak teruji tanpanya.

### [principle-type-system-discipline](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-type-system-discipline/SKILL.md)

Intinya: type checker diperlakukan sebagai proof assistant; state ilegal dibuat tak terwakili lewat sum type, primitive semantik di-brand, data eksternal diparse di batas, compiler tidak dibohongi dengan cast, matching dibuat ekshaustif, tipe diturunkan dari schema otoritatif, dan tipe diperkuat hanya di titik yang menuntutnya. Berlaku saat merancang tipe, meninjau signature, atau menulis kode di bahasa bertipe apa pun. Pelanggaran khasnya: kombinasi field opsional yang bermakna ganda seperti `completed: true` tanpa `completedAt`, `UserId` dan `OrderId` tertukar karena sama-sama string, serta `any`, cast, dan `assertNotNull` yang bisa dilacak ke batas tanpa validasi.

### [principle-make-operations-idempotent](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-make-operations-idempotent/SKILL.md)

Intinya: rancang operasi agar konvergen ke keadaan yang benar berapa pun kali dijalankan dan dari titik mana dimulai; tiap operasi pengubah state harus menjawab apa yang terjadi bila dijalankan dua kali dan bila run sebelumnya berhenti di tengah. Berlaku saat merancang command, langkah lifecycle, atau loop pemrosesan yang berjalan di tengah crash, restart, dan retry. Pelanggaran khasnya: hasil run bergantung pada state yang tertinggal tanpa langkah rekonsiliasi, pembersihan yang mengandalkan urutan pembuatan alih-alih kesetaraan isi, dan lock basi tanpa deteksi yang menggantung.

### [principle-migrate-callers-then-delete-legacy-apis](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md)

Intinya: begitu API internal baru diputuskan benar, inventarisasi pemanggil, migrasikan semuanya, dan hapus API lamanya dalam satu gelombang refactor; adapter sementara bersifat luar biasa dan dibatasi waktu, bukan arsitektur bawaan. Berlaku saat memperkenalkan API internal baru selagi pemanggil lama masih ada, tanpa pengguna eksternal yang bergantung pada kompatibilitas mundur. Pelanggaran khasnya: jalur API lama dipertahankan hanya karena pemanggil internal masih memakainya, basis kode terasa append-only, dan test yang hanya melindungi detail implementasi pra-refactor tetap disimpan alih-alih diganti kontrak baru.

### [principle-separate-before-serializing-shared-state](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md)

Intinya: saat aktor konkuren mungkin menulis ke berkas, branch, key, atau objek state yang sama, hapus dulu pemakaian bersamanya: beri tiap aktor keluaran miliknya sendiri dan gabungkan hanya di batas baca. Serialisasi struktural seperti lockfile, fase sekuensial, atau pemilik tunggal baru dipakai bila satu penulis bersama memang invariant nyata; instruksi dan konvensi bukan kontrol konkurensi. Pelanggaran khasnya: dua pekerja sama-sama menulis field `lastX` ke satu `state.json`, yang masih mutasi bersama, dan refleks "kita butuh lock" yang dianggap jawaban bawaan tanpa diperiksa.

## Grup verification

### [principle-prove-it-works](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-prove-it-works/SKILL.md)

Intinya: verifikasi tiap hasil kerja dengan memeriksa benda aslinya secara langsung: jalankan fiturnya, baca nilai sebenarnya, inspeksi diff-nya; proxy, laporan sendiri, dan "compile" tidak termasuk. Berlaku setelah menyelesaikan tugas, sebelum menyatakan selesai. Pelanggaran khasnya: menyimpulkan dari mtime berkas, kesegaran keluaran, laporan agent sendiri, atau screenshot cache; dan bila verifikasi gagal, metode observasinya patut dicurigai lebih dulu sebelum sistemnya. Bukti terkuatnya script deterministik yang bisa dijalankan ulang peninjau.

### [principle-fix-root-causes](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-fix-root-causes/SKILL.md)

Intinya: saat debugging, telusuri tiap gejala sampai akar penyebabnya dan perbaiki di sana; reproduksi dulu, tanya "why" berulang sampai ketemu, dan perbaiki polanya di semua instance, bukan satu. Berlaku saat debugging. Pelanggaran khasnya: menambah nil check untuk membisukan crash, workaround yang butuh komentar sepanjang paragraf untuk membenarkannya, menebak alih-alih memasang instrumentasi saat macet, dan bug "gagal setelah restart" yang tidak mengecek state persisten basi seperti config, cache, dan lock file lebih dulu.

### [principle-sequence-verifiable-units](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-sequence-verifiable-units/SKILL.md)

Intinya: susun kerja sebagai urutan unit kecil yang masing-masing berakhir pada keadaan yang bisa diperiksa, dan jangan maju sebelum unit berjalan hijau; kerusakan yang tertangkap di unit penyebabnya murah dilokalisasi, yang tertangkap setelah sekumpulan suntingan terkubur. Berlaku pada kerja multi-langkah seperti sweep, migrasi, dan rangkaian suntingan serupa, serta pada cara menumpuk commit dan PR. Pelanggaran khasnya: menumpuk banyak suntingan sebelum satu pemeriksaan, membangun lebih jauh di atas basis yang rusak, dan urutan pengiriman yang tidak bisa diputar ulang peninjau. Bentuk kanoniknya: test yang gagal dulu, lalu perbaikannya di atasnya.

### [principle-test-behavior-not-implementation](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-test-behavior-not-implementation/SKILL.md)

Intinya: test memanggil kode sebagaimana penggunanya memanggilnya dan meng-assert hasil yang mereka amati terhadap nilai harfiah; pemeriksaannya, bila semua fungsi yang diimpor mengembalikan `undefined` test itu masih lolos, test itu tidak mengamati perilaku dan tidak bisa gagal karena defect, jadi tulis ulang assertion-nya atau hapus. Berlaku saat menulis, mengubah, atau menyimpan test. Pelanggaran khasnya lima bentuk dari berkas sumbernya: assertion lemah atau tidak ada, assertion atas mock atau ketiadaan saja, nilai harapan yang direferensikan dari kode yang diuji, pin konstanta seperti `expect(LIMITS.maxTools).toBe(8)`, dan fixture yang meng-assert fixture dengan subjek yang tidak pernah berjalan di badan test.

## Grup delegation

### [principle-guard-the-context-window](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-guard-the-context-window/SKILL.md)

Intinya: context window terbatas dan tak terbarukan dalam satu sesi, dan tiap token harus sepadan biayanya; rutekan payload besar ke subagent dan simpan ringkasannya di thread utama, bukan datanya mentah. Berlaku saat konteks mengisi: keluaran besar, berkas panjang, bacaan berulang, dan perencanaan fan-out. Pelanggaran khasnya: output verbose, screenshot, dan dokumen besar masuk ke konteks utama, serta templat dan referensi yang dipakai tiap invocation ditaruh di berkas terpisah yang menagih satu pembacaan tiap kali.

### [principle-never-block-on-the-human](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-never-block-on-the-human/SKILL.md)

Intinya: manusia mengawasi secara asinkron, jadi ambil keputusan yang wajar, lanjutkan kerjanya, sajikan hasilnya, dan biarkan manusia mengoreksi arah setelahnya; lakukan X dan jelaskan mengapa, alih-alih bertanya "haruskah saya X". Berlaku saat tergoda meminta izin untuk kerja yang bisa dibalik. Pelanggaran khasnya: jeda izin yang menghentikan pipeline dan menjadikan manusia bottleneck. Batasnya tetap: tindakan tak reversibel seperti force-push, penghapusan data produksi, dan pesan eksternal menunggu konfirmasi, dan arah produk tetap keputusan manusia.

## Grup meta

### [principle-encode-lessons-in-structure](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/principle-encode-lessons-in-structure/SKILL.md)

Intinya: begitu Anda menangkap diri menulis instruksi yang sama untuk kedua kalinya, enkode aturannya menjadi mekanisme, misalnya lint, metadata flag, runtime check, atau script, karena mekanisme menegakkan aturan tanpa bergantung pada kerja sama pembacanya. Berlaku juga pada koreksi berulang dan hasil tak terduga: tangkap, rutekan ke lapisan yang tepat, tutup luputnya. Pelanggaran khasnya: mengiyakan tanpa merekam, merekam tanpa merutekan, dan memperbaiki satu instance sambil membiarkan polanya utuh. Bila lebih dari satu mekanisme bisa dipakai, pilih yang terkuat yang situasinya izinkan, karena agent meniru apa pun yang kode di sekitarnya sudah lakukan.
