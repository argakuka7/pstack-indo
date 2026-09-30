# architect: tentukan bentuk sebelum menulis kode

Bab ini membedah [skill architect](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/architect/SKILL.md) dari dalam: kapan skill itu dipakai, lima fasenya dari grounding sampai pembuangan sketsa, dan tiga referensi pendampingnya. Frontmatter skill menandai `disable-model-invocation: true`, jadi ia aktif lewat panggilan eksplisit seperti `/architect`, "architect this", "design this", atau ketika dipilih untuk pekerjaan non-trivial di mana langsung melompat ke kode akan mengunci bentuk yang salah.

Inti kerjanya: merancang sebelum mengimplementasi. Skill ini membuat sketsa tipe, signature fungsi, bentuk class, dan batas modul dengan badan `not implemented` dan pseudocode. Sketsa disintesis dari beberapa perspektif model, lalu kode diisi mengikuti sketsa yang terpilih. Bila implementasi membuktikan sketsa itu salah, sketsa dibuang dan dirancang ulang. Contoh pemakaiannya dari panduan pstack:

```text
/architect design the import pipeline before writing any code. i care most about how callers use it.
```

Sebelum mulai, skill membuka todolist dengan satu entri per fase: Ground, Sketch, Agree, Implement, Scrap.

## Fase A: Ground

Skill membangun model mental yang nyata atas tiap sistem yang disentuh kode baru, dengan menjalankan skill **how** pada subsistem yang relevan. Menyebut nama sebuah berkas bukan grounding; keluarannya adalah model terlacak yang how tetapkan, seperti dibahas di bab [how](31-ch-how.md). Bila desainnya mendefinisikan ulang kepemilikan atau pelapisan, skill **why** juga dijalankan atas bentuk yang ada supaya alasannya menjadi konstrain, bukan tebakan. Fase ini hanya dilewati bila pekerjaan benar-benar greenfield tanpa sistem di sekelilingnya yang harus diintegrasikan.

## Fase B: Sketch

Skill menjalankan skill **arena** dengan tugas design-sketch beserta artefak grounding dari Fase A, menurut alur yang dibahas di bab [arena dan swarm](42-ch-arena-swarm.md). Berkas [runner-prompt.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/architect/references/runner-prompt.md) diberikan sebagai prompt tiap runner, dan tiap kandidat menghasilkan satu paket desain berbentuk [rationale-template.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/architect/references/rationale-template.md).

Runner diambil dari baris `architect runners` di rule `pstack-models.mdc`, menggantikan baris `arena runners` yang biasa dipakai arena. Bila rule atau barisnya tidak ada, bawaannya `claude-opus-5-5-max`, `gpt-5.6-sol-max`, `grok-4.7-xhigh-fast`. Entri alias dan yang ditolak mengikuti aturan runner di Fase A skill arena. Rule ini diatur lewat `/setup-pstack`, seperti dibahas di bab [Penyiapan dan penggunaan pertama](12-ch-setup.md).

Ada dua aturan kerja pada fase ini. Pertama, desain dua kali: minimal dua kandidat yang berbeda secara struktural sebelum sintesis, bahkan bila kandidat pertama sudah tampak cukup. Ini adalah wujud konkret prinsip exhaust-the-design-space; alternatif bentuk utuh, bukan tambal sulam di dalam satu bentuk. Kedua, tiap kandidat disaring dengan [design-red-flags.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/architect/references/design-red-flags.md) sebelum sintesis: modul dangkal, kebocoran informasi, dekomposisi temporal, dan metode pass-through ditolak atau direvisi.

Kandidat yang lolos dibandingkan pada kedalaman interface. Yang dipilih adalah desain yang menyembunyikan lebih banyak kompleksitas di balik permukaan publik yang lebih kecil dan lebih sederhana; interface yang kaya bisa menjaga rantai pemanggilan tetap pendek dengan memusatkan kemampuan alih-alih menyebarkannya lintas lapisan. Arena mengembalikan satu paket desain tersintesis, dan keputusan sintesisnya mengisi bagian "Synthesis decision" pada rationale.

## Fase C: Agree (opt-in)

Bawaannya: langsung lanjut ke implementasi dengan desain tersintesis, tanpa titik henti manusia. Titik henti hanya aktif bila pemanggilnya meminta secara eksplisit, misalnya "/architect with checkpoint" atau "stop and show me before implementing"; barulah desain tersintesis ditampilkan dan skill menunggu persetujuan. Contohnya dari panduan:

```text
/architect with checkpoint. stop and show me before implementing.
```

Dengan atau tanpa titik henti, sintesis boleh dikirim sebagai commit tersendiri sebagai mode "scaffold first" dari prinsip foundational-thinking. Kerusakan yang direncanakan dan dibatasi selama pengisian kode diperbolehkan menurut prinsip outcome-oriented-execution. Untuk tekanan adversarial atas desain sebelum implementasi, jalankan skill **interrogate** pada sketsa tersintesis. Bila manusia menolak bentuknya, baik di titik henti maupun setelahnya, itu diperlakukan sebagai bukti Fase A: ground ulang dan jalankan Fase B lagi sebelum menulis kode lebih banyak.

## Fase D: Implement

Badan `not implemented` diganti kode, pseudocode diganti logika. Sketsa tersintesis adalah kontraknya. Penyimpangan dari sketsa adalah sinyal yang perlu ditampilkan, bukan gesekan yang ditelan diam-diam: bila sebuah fungsi butuh parameter yang tidak diantisipasi sketsa, tanyakan apakah sketsanya yang salah, requirement-nya yang terlewat, atau implementasinya yang berlebihan.

## Fase E: Scrap

Bila implementasi terus menghasilkan gesekan yang tidak bisa diserap sketsa, sketsa dibuang. Jangan memasang perbaikan pada desain yang salah, menurut prinsip redesign-from-first-principles dan fix-root-causes. Sinyalnya berupa pola, bukan satu instance. Ciri-cirinya:

- Bentuk workaround yang sama muncul berulang kali di kode yang tidak berhubungan.
- Banyak edge case tak berhubungan yang semuanya butuh cabang khusus.
- Tipe yang butuh pintu darurat (`any`, cast, field opsional yang praktiknya selalu terisi) agar bisa dikompilasi.
- Refleks "kita butuh lock" padahal sketsa mengatakan state itu tidak dibagi.
- Pemanggil harus tahu aturan internal abstraksi untuk memakainya.
- Dua atau lebih penyimpangan Fase D yang independen dan bentuknya sama di seluruh implementasi.

Pertimbangan tetap dipakai: beberapa edge case tidak mengutuk sebuah arsitektur, sebagian masalah memang sah rumit, dan kompleksitas di datanya bukan kompleksitas di desainnya. Saat membuang, urutannya: jalankan ulang skill **how** atas yang sudah terbangun; rancang ulang seolah konstrain baru itu asumsi hari pertama menurut redesign-from-first-principles; kurangi sebelum menambah menurut subtract-before-you-add, sketsa baru seharusnya lebih kecil dari sketsa lama sebelum ia membesar; lalu kembali ke Fase B dan jalankan arena lagi.

## Referensi pendamping

Tiga berkas referensi menemani SKILL.md. Ketiganya adalah materi nyata pstack, bukan contoh buatan.

[design-red-flags.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/architect/references/design-red-flags.md) mendefinisikan empat red flag untuk menyaring tiap kandidat. Modul dangkal mengekspos interface besar sambil menyembunyikan sedikit kompleksitas; jangan tertukar dengan rantai pemanggilan dalam, yang justru menyebarkan pemahaman lintas lapisan, karena modul dalam memusatkan kemampuan di balik satu interface. Tandanya: pemanggil mengoordinasikan beberapa metode untuk satu operasi, opsi publik membocorkan tahap internal, dan mempelajari interface tidak menyelamatkan pemanggil dari mempelajari implementasinya. Kebocoran informasi membuat beberapa modul bergantung pada keputusan internal yang sama; re-export tipe transport atau wire lewat permukaan publik adalah kebocoran, data eksternal diparse menjadi tipe domain di balik interface, dan skema penyimpanan, objek framework, serta detail protokol dijaga privat. Dekomposisi temporal menata modul menurut urutan eksekusi alih-alih pengetahuan yang dimilikinya; tahap load, validate, transform, save sering mengulang satu representasi beserta invariantnya di beberapa batas, padahal metode yang berjalan di waktu berbeda tetap boleh satu modul bila melindungi keputusan yang sama. Metode pass-through meneruskan argumen yang sama ke metode lain dengan bentuk sama, menambah lapisan tanpa menyembunyikan kompleksitas; hapus atau pindahkan tanggung jawabnya, dan pertahankan batas penerusan hanya bila menambah kebijakan, adaptasi, atau abstraksi yang berbeda.

[rationale-template.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/architect/references/rationale-template.md) adalah templat prosa satu halaman yang dikirim bersama sketsa tipe. Bahagiannya: Problem, yakni apa yang hendak dibuat dan konstrain yang membuat bentuknya tidak obvious; Usage (caller's view), ditulis pertama sebelum sketsa tipe, berisi tampilan yang dibaca konsumen beserta dua sampai tiga call site nyata; Shape, arsitektur yang direkomendasikan dengan struktur data dulu, keputusan yang memikul beban, dan penilaian kedalaman interface secara eksplisit; Synthesis decision, diisi arena; Tradeoffs accepted, satu butir per tradeoff dalam bentuk "we accept X in exchange for Y"; Alternatives considered, wajib, minimal satu alternatif konkret dengan alasan kalahnya; Open questions and risks; dan Next implementation step, satu kalimat hal pertama yang dibangun. Templatnya menegaskan hubungan keduanya: pemakaian pemanggil adalah spec-nya, dan bila sketsa tipe menyimpang darinya, sketsa yang disesuaikan ke pemakaian, bukan sebaliknya.

[runner-prompt.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/architect/references/runner-prompt.md) diberikan utuh ke tiap runner kandidat paralel di Fase B. Orkestrator melingkupinya dengan input variabel: tugas, artefak grounding Fase A, direktori kerja terisolasi, dan path keluaran; direktori kerjanya adalah git worktree bila tersedia, selain itu subdirektori per runner, karena yang penting adalah kemandirian antar kandidat. Disiplin yang dimintanya dari tiap runner: pemakaian pemanggil dulu baru tipe; struktur data dulu, dan bila jawabannya "nanti kita tambah map atau cache", strukturnya salah; kedalaman interface tanpa tipe transport di API publik; pertanyaan "apa yang terjadi?" saat dua aktor sama-sama menulis, dengan bawaan state per aktor yang digabung di batas baca; batas yang terlihat lewat error `not implemented` dan pseudocode `// TODO`; invariant dienkode di tipe, validasi di batas, satu sumber acuan per invariant, transisi idempoten, dan rantai pemanggilan pendek. Promptnya menutup dengan peringatan eksplorasi: tiap runner adalah salah satu dari beberapa runner di model berbeda, perbedaan antar kandidat adalah sinyalnya, dan konvergensi ke tengah yang tampak aman mengalahkan tujuan eksplorasi.

## Keluaran

Pemakaian pemanggil ditulis pertama dan sketsa tipe diturunkan darinya. Untuk perubahan kecil, satu berkas berisi tipe dan signature baru. Untuk kerja yang lebih besar, peta modul plus definisi tipe. Rationale dikirim bersamaannya, berbentuk rationale-template, termasuk sketsa pemakaian dan keputusan sintesis.
