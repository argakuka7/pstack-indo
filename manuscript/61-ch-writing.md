# Penulisan

Dua skill di bab ini mengurus prosa. [technical-writing](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/technical-writing/SKILL.md) adalah standar penulisan teknis berlapis untuk dokumen, RFC, readme, deskripsi PR, dan pesan commit. [unslop](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/unslop/SKILL.md) memotong ciri khas tulisan AI dari tulisan apa pun, dan deskripsi frontmatter-nya menyatakan bahwa ia harus selalu diterapkan. Keduanya ditandai `disable-model-invocation: true`, jadi keduanya dipanggil eksplisit atau lewat rute skill lain; bab [poteto-mode](21-ch-poteto-mode.md) sudah membahas rutenya. Contoh pemakaian unslop dari [panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/05-build-and-clean.md):

```text
/unslop the readme changes, no emdashes
```

Panduan yang sama menambahkan bahwa skill ini membaca maksud dari prompt pendek seperti "unslop that, tighten it".

## technical-writing: empat lapis standar

Kalimat pembuka SKILL.md menetapkan sasarannya: tulisan yang dipahami insinyur kelelahan pada bacaan pertama. Empat lapis membawa ke sana, masing-masing satu pertanyaan: dokumen macam apa ini, bagaimana kalimat menyapa pembaca, berapa banyak muatan tiap kalimat, dan adakah kalimat yang bisa dibaca dua cara. Keempatnya diterapkan bersamaan.

Tiga aturan duduk di atas lapisan-lapisan itu. Pertama, buang tiap kata yang tak bekerja: bila kalimat tetap hidup tanpa sebuah kata, kata itu dibuang; "in order to" cukup "to", dan "it is important to note that" tidak jadi apa-apa. Kedua, pakai kata pendek yang sehari-hari: "use" bukan "utilize", "help" bukan "facilitate", "do" bukan "perform"; kata panjang harus membayar panjangnya dengan presisi. Ketiga, bila sebuah aturan membuat kalimat makin buruk, perbaiki kalimatnya dengan cara lain atau biarkan: aturan melayani pembaca, dan kalimat yang mengikuti semua aturan tetapi terdengar ditulis mesin sudah gagal.

Codebase adalah daftar katanya. Tulis nama simbol, berkas, flag, atau command yang sungguhan, bukan sinonim atau deskripsinya. Jangan mengarang jargon; pakai kata yang diucapkan developer dengan lisan, seperti "move" atau "delete", bukan "evacuate". Pola bernama boleh asal dokumen mendefinisikannya saat pertama kali muncul. Bila Anda menemukan pelanggar baru, usulkan sebagai tambahan aturan metafora abstrak milik unslop di balasan Anda, lengkap dengan diff-nya; jangan menyunting skill itu.

### Pilih modenya lebih dulu (Diátaxis)

Satu dokumen satu mode. Dua pertanyaan memilihnya: apakah isinya menggerakkan tindakan (mengerjakan) atau pemahaman (berpikir), dan apakah ia melayani belajar atau bekerja. Tutorial untuk tindakan plus belajar; how-to untuk tindakan plus bekerja; reference untuk pemahaman plus bekerja; explanation untuk pemahaman plus belajar. Kompas ini berlaku untuk satu dokumen utuh maupun satu kalimat.

**Tutorial: belajar dengan mengerjakan.** Anda gurunya, dan keberhasilan pembelajar tanggung jawab Anda. Buka dengan apa yang akan dibangun pembelajar, bukan apa yang akan "dipelajari". Tiap langkah menghasilkan sesuatu yang terlihat, sedini dan sesering mungkin. Katakan apa yang harus mereka lihat: keluaran yang diharapkan, perubahan prompt, baris log. Pangkas penjelasan menjadi satu klausa plus satu tautan. Jeda mengajar memutus pelajaran. Tetap konkret, dan tulis sebagai "we" dalam bentuk perintah.

**How-to: langkah menuju satu tujuan.** Selesaikan masalah yang dimiliki manusia, bukan operasi yang bisa dijalankan mesin. Asumsikan pembacanya cakap, lewati pengajaran. Hanya tindakan: tanpa menyimpang, tanpa latar belakang, tanpa kelengkapan demi kelengkapan; tautkan saja. Fork dan pertimbangan boleh: "bila Anda ingin x, lakukan y". Namai panduannya menurut tugasnya, seperti "How to calibrate the radar array", bukan "Radar array calibration".

**Reference: fakta untuk ditelusuri.** Deskripsikan, hanya mendeskripsikan. Tanpa instruksi, tanpa bujukan, tanpa opini. Kering, lengkap, dan pasti. Nyatakan fakta, opsi, batas, dan error tanpa menggantung. Cermin struktur benda yang dideskripsikan agar kode dan dokumen bisa ditelusuri bersama. Taruh materi di tempat pembaca mencarinya, dan hasilkan dari kode bila bisa supaya tetap benar.

**Explanation: pemahaman dan alasannya.** Satu topik terbatas yang bisa dibaca jauh dari produknya; tiap judul layak diberi awalan implisit "About...". Berjangkar pada pertanyaan why yang nyata. Beri konteks: keputusan desain, sejarah, kendala, alternatif. Opini hanya diizinkan di sini dan tidak di mode lain.

Jangan mencampur mode: tanpa tabel reference di dalam tutorial, tanpa pegangan tangan tutorial di dalam reference, tanpa berdebat di dalam how-to. Pecah dan tautkan.

### Tulis kalimat kepada pembaca (Google developer style)

Sapa pembaca sebagai "you" dalam kala kini; "will" hanya untuk yang sungguh terjadi nanti. Katakan siapa melakukan apa: "the compiler checks", bukan "is checked"; pasif hanya saat pelakunya tak diketahui atau tak relevan. Instruksi ditulis sebagai perintah, "Click Submit", dan tak pernah "should be done". Taruh syaratnya sebelum perintahnya, "To delete the document, click Delete", supaya pembaca melompati yang tak berlaku padanya. Kasus umum di depan, pengecualian setelahnya.

Terdengar seperti teman yang paham. Tanpa buzzword, tanpa bahasa kiasan, tanpa "please" di instruksi, dan tak pernah "simply", "easy", atau "quickly" dalam sebuah prosedur; seandainya sederhana, pembaca tidak akan di sini. Jangan mengumumkan dini ("we will soon support...") dan jangan memulai kalimat berurutan dengan frasa yang sama. Tautkan dengan kata yang mengatakan tujuannya: judul halaman atau deskripsi singkat, tak pernah "click here", dan lebih suka satu kalimat konteks di halaman sendiri daripada tautan ke luar.

Judul memikul intinya, bukan sekadar topiknya: "Pick the mode first", bukan "Modes". Huruf besar model kalimat. Judul tugas berupa frasa kerja telanjang, judul konsep berupa frasa benda. Satu h1 per halaman tanpa tingkat yang dilompati. Daftar bernomor untuk urutan, bullet untuk lainnya, dan tiap daftar diperkenalkan satu kalimat lengkap dengan butir yang sejajar. Kode dalam font kode, elemen UI dalam cetak tebal, koma serial dipakai, dan "etc." dibuang dengan menyatakan di depan bahwa sebuah daftar tidak lengkap.

### Satu muatan per kalimat (aturan STE)

Satu instruksi per kalimat, dan satu gagasan per kalimat di tempat lain. Pecah instruksi yang melewati sekitar 20 kata dan kalimat lain yang melewati sekitar 25. Peringatan atau syarat ditaruh sebelum langkah yang dijaganya. Pertahankan "the" dan "a": "Remove backup file" terbaca dua cara, "Remove the backup file" satu. Beri tiap kata satu makna dan satu tugas lalu pertahankan itu; bila "check" berarti memeriksa, jangan dipakai juga untuk menahan. Satu kata per tindakan: "start", bukan "start" di sini dan "initiate" di sana. Prosedur ditulis sebagai perintah langsung, tak pernah sebagai narasi dan tak pernah pasif. Hindari kata berakhiran "-ing" bila bisa karena ia memikul terlalu banyak peran tata bahasa dan membiakkan salah baca.

### Tak ada kalimat yang terbaca dua cara (Global English)

Taruh kata seperti "only" dan "not" tepat di samping kata yang diubahnya: "only fails on growth" dan "fails only on growth" berkata hal berbeda. Pecah untaian benda yang panjang. Pastikan tiap "it", "they", dan "this" menunjuk satu benda yang jelas, dan ulang kata bendanya bila ragu; jangan pernah memakai "this" atau "which" untuk menunjuk satu klausa utuh. Jangan menjatuhkan verba: "Phase 1 moves the converters and Phase 2 the runtime" meninggalkan Phase 2 tanpa verba, beri satu. Pertahankan kata kecil penanda struktur seperti "that" karena ia membuat kalimat terurai satu cara; jangan pernah menukar kejelasan dengan jumlah kata. Ulangi artikel dalam rangkaian bila mencegah salah baca. Katakan bagian mana yang dihubungkan "and" atau "or" bila kalimat bisa mengelompok dua cara; "both...and", "either...or", dan "if...then" adalah pengurai gratis. Pakai titik, bukan titik koma, dan ganti tanda pisah panjang dengan kalimat baru. Teks dalam kurung harus satuan tata bahasa utuh atau kalimatnya sendiri, dan jangan bentuk jamak dengan "(s)". Tanpa garis miring: tulis "a, b, or both" alih-alih "a/b" atau "and/or". Panggil satu benda satu nama di mana-mana; dokumen yang menyebut satu benda "the gate", "the ratchet", dan "the budget check" mengajarkan tiga hal, dan menulis ulang kalimat yang tak berubah antar suntingan berbiaya sama. Lewati idiom, kolokialisme, singkatan Latin, dan metafora: pembaca non-native, penerjemah, dan agent sama-sama mengurai konstruksi polos paling baik.

### Variasikan ritmenya

Lapisan-lapisan itu memutuskan apa yang dikatakan dokumen dan berapa muatan tiap kalimat; sebuah dokumen bisa menaati semuanya dan tetap terbaca ditulis mesin, dengan kalimat pendek seragam dan tanpa sudut pandang. Campur panjang kalimat dengan sengaja: kalimat pendek mendaratkan satu poin, kalimat panjang yang tak tergesa membawa satu fakta beserta syarat atau akibatnya. Satu gagasan per kalimat tidak berarti satu panjang per kalimat; pecah kalimat yang memikul dua gagasan, pertahankan yang panjang tetapi satu gagasan. Punya pendapat di tempat modenya mengizinkan: explanation menimbang tradeoff, maka katakan penilaian Anda, sedangkan reference tetap kering. Spesifik di atas steril: bukan "schema changes can cause issues" melainkan "a column rename fails the build".

### Suara dan kekhususan repo

unslop diterapkan pada setiap dokumen yang disentuh skill ini; skill itulah pemilik katalog polanya. Deskripsi PR dan pesan commit juga tulisan, dan semua lapis kecuali Diátaxis berlaku pada keduanya. Badan PR adalah briefing yang bisa dibaca reviewer di bawah satu menit: jangan menempel log swarm, daftar SHA, atau tabel metrik, tautkan saja. String UI produk bukan dokumentasi; pakai pedoman copy produk untuk itu. Indentasi potongan kode memakai tab, tulis path dan simbol yang sungguhan, dan buat tiap klaim jumlah atau pohon benar pada commit yang mendaratkannya, lengkap dengan command yang menghasilkannya kembali.

SKILL.md menutup dengan contoh dikerjakan. Sebelum:

> Configuration of the proto import ratchet budget script parameters is performed via budget.json. Note that it's important to remember that running with --write, which updates the committed budget to reflect the current count, should only be done when lowering it. If exceeded, CI fails.

Sesudah:

> `budget.mjs` reads the committed budget from `budget.json` and counts the files that import protos. If the count exceeds the budget, CI fails. Run `budget.mjs --write` only to lower the budget.

## unslop: katalog pola yang dibuang

Prosesnya dua langkah: pindai pola-pola di bawah, lalu tulis ulang dengan makna terjaga dan nada yang tetap sesuai. Nomor aturannya adalah id tetap yang dikutip skill lain, dan aturan yang dihapus meninggalkan celah. Katalognya terbagi tujuh grup; berikut intinya.

**Konten.** Frasa "-ing" permukaan seperti "highlighting..." atau "ensuring..." dihapus atau diperluas dengan sumber nyata. Atribusi kabur seperti "experts believe" atau "industry reports suggest" dinamai sumbernya atau dihapus.

**Bahasa.** Kosakata AI, dikutip dari katalognya: additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (abstrak), pivotal, showcase, tapestry (abstrak), testament, underscore, vibrant; semuanya diganti kata polos. Cara bergaya untuk bilang "is", seperti "serves as" atau "boasts", cukup "is" atau "has". Pola "not just X, but Y" cukup menyatakan intinya langsung. Aturan tiga, memaksa gagasan berkelompok tiga, hanya dipakai bila tiga memang jumlah alaminya. Siklus sinonim, protagonis berganti-ganti nama dalam satu paragraf, dipilih satu dan diulang. Rentang palsu "from X to Y" yang tak berada pada skala berarti diganti daftar topik langsung.

**Gaya.** Tanda pisah panjang dihindari sepenuhnya; hanya titik atau koma, tanpa kurung dan tanpa pengganti pisah lain. Titik dua hanya sebelum daftar atau contoh, bukan penghubung tengah kalimat; keduanya aturan 13 dan 14 unslop, dan larangannya juga dikutip di bab [poteto-mode](21-ch-poteto-mode.md). Jangan menebalkan tiap nama proper atau akronim. Daftar header inline, label tebal ber titik dua yang mengulangi barisnya, dikonversi ke prosa. Judul memakai huruf besar model kalimat. Emoji dekoratif dihapus dari judul dan butir. Petik lengkung diganti petik lurus.

**Artefak komunikasi.** Frasa chatbot seperti "I hope this helps!", "Let me know if...", "Of course!", "Certainly!" dihapus. Nada menyanjung seperti "Great question! You're absolutely right!" diganti balasan langsung.

**Pengisi.** "In order to" menjadi "To", "due to the fact that" menjadi "because", dan "it is important to note that" dihapus. Lindungan berlebihan diringkas menjadi "may". Kesimpulan generik seperti "the future looks bright" diganti rencana atau fakta spesifik.

**Jargon.** Kata benda metafora abstrak, substrate, wedge, vector, locus, vantage, nexus, primitive, harness, surface, bedrock, scaffolding, modality, paradigm, gold-plating, ratchet, evacuate, endgame, north star, flywheel, biasanya punya kata konkret yang lebih polos: "substrate" menjadi "base", "wedge in" menjadi "add", "vector" menjadi "way" atau "method", "gold-plating" menjadi "more than the job needs", "ratchet" menjadi nama mekanisme sebenarnya atau "a limit that only tightens", "evacuate" menjadi "move out", dan "endgame" menjadi "the last phase".

**Ucapan polos.** Katakan apa yang dikerjakan, bukan bagaimana rasanya: bukan "types that follow your schema" melainkan "`.toSQL()` returns the exact string sent to the database" atau "a column rename fails the build"; bila sebuah kalimat tak bisa ditulis ulang sebagai instruksi, fakta, atau angka konkret, buang. Kalimat padat dipecah atau dipangkas klausanya, satu gagasan per kalimat. Suara aktif diutamakan: "queries are validated" menjadi "the compiler validates queries", dan pasif hanya bila pelakunya tak diketahui atau sungguh tak penting. Kata keterangan dipangkas atau verba diperkuat: "runs quickly" menjadi "is fast" atau angkanya, dan "significantly improves" menjadi delta terukurnya. Kata polos di atas sinonim berkesan: "utilize" menjadi "use", "leverage" menjadi "use", "facilitate" menjadi "help". Prosa bermanis, aforisme, fragmen retoris, kode yang dipersonifikasi, dan verba kiasan diganti frasa literal. Kompresi berlebihan yang membuat pembaca mendekode alih-alih membaca, seperti kalimat tanpa artikel dan verba atau panah dan singkatan yang dieja, ditulis ulang sebagai kalimat utuh.

## Kapan memakai yang mana

unslop bekerja pada permukaan prosa apa pun dan selalu diterapkan; technical-writing masuk saat dokumennya sendiri butuh struktur, mulai dari pilihan mode sampai ke kalimatnya. Keduanya berlaku pada deskripsi PR dan pesan commit. Hubungannya: technical-writing menerapkan unslop pada setiap dokumen yang disentuhnya, dan usulan pelanggar jargon baru diusulkan sebagai tambahan aturan unslop lewat diff di balasan, bukan dengan menyunting skillnya.
