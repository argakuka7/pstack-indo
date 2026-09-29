# Playbook untuk mengerjakan tugas

Bab ini membedah sepuluh playbook untuk pekerjaan sehari-hari, semuanya dari direktori [playbooks milik poteto-mode](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/) pada commit yang dipatok: Bug fix, Feature, Refactoring, Perf issue, Prototype, Eval, Hillclimb, Investigation, Trace forensics, dan Visual parity. Tiap subbab memapankan tiga hal yang sama: kapan playbook dipakai, langkah intinya, dan hasil yang diharapkan. Langkah di sini dirangkum; langkah penuhnya disalin apa adanya ke todo list oleh `/poteto-mode`, seperti dibahas di bab [poteto-mode](21-ch-poteto-mode.md).

Setiap playbook di bab ini ditutup dengan menjalankan playbook Opening a PR, yang dibahas di bab [Playbook untuk pull request](23-ch-playbooks-pr.md). Setelah PR terbuka, komentar dari Bugbot atau review otomatis lain bisa muncul. Postur poteto-mode skeptis terhadapnya: otomasi itu menangkap bug nyata sekaligus mengajukan non-issue dan nitpick. Referensi [bugbot-triage](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/references/bugbot-triage.md) memberi rubrik tiga golongan: `fix` untuk temuan masuk akal soal kebenaran, keamanan, privasi, kehilangan data, autentikasi, penagihan, migrasi, idempotensi, race, atau perilaku yang sudah dikirim; `dismiss` untuk pola berisiko rendah yang terdokumentasi dan terbukti tidak butuh perubahan kode, dijawab dengan alasan pendek; `ask` untuk temuan baru, berat, atau ambigu, atau yang terkait keamanan, privasi, atau data. Bila ragu, tanya; melewatkan komentar kualitas kode yang berisik itu murah, melewatkan bug data atau keamanan nyata tidak.

Beberapa istilah dipakai lintas playbook. Surface adalah permukaan tempat kode berjalan dan diverifikasi: UI, IDE, CLI, atau peramban. Control skill adalah skill kontrol yang cocok untuk surface itu. Pin adalah pengikat perilaku: test, snapshot, atau harness yang gagal bila perilaku berubah. Throughput checkpoint adalah empat pertanyaan tentang apa yang memblokir, apa yang bisa paralel, apa state bersama yang harus dipisah, dan apa dekomposisi terkecil yang aman.

## Bug fix

Sumber: [playbooks/bug-fix.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/bug-fix.md).

Pakai untuk cacat yang dilaporkan: direproduksi, ditelusuri sampai akar masalahnya, lalu diperbaiki dengan bukti runtime. Anda memegang tugasnya; investigasi dan perbaikannya didelegasikan ke subagent sementara Anda tetap memimpin.

Disiplinnya ilmiah. Setiap baris yang dikirim harus tertelusur ke bukti runtime. Tambahan pengaman yang "mungkin membantu" adalah hipotesis, bukan perbaikan, dan tidak ikut dikirim; saat bukti membantah sebuah hipotesis, apa pun yang dipicunya dibatalkan. Perubahan terkecil yang dibenarkan bukti itulah yang dikirim.

Langkah intinya:

1. Reproduksi sendiri di surface yang sama lewat control skill, bahkan bila protokol debug menyuruh meminta pengguna melakukannya. Minta pengguna hanya dengan alasan spesifik bahwa control surface tidak bisa menjangkau targetnya, dan hanya setelah menjalankannya sejauh mungkin. Bila tidak mereproduksi, sintesis pemicunya, perketat kondisinya, atau beri instrumentasi sampai menyala.
2. Binary-search penyebabnya. Bentuk hipotesis kandidat, lalu gugurkan sampai satu tersisa, diawali dengan skill how atas subsistem terdampak dan skill why untuk riwayat regresi. Tiap putaran, ambil pembagian yang memotong ruang masalah tersisa terbanyak, ambil bukti runtime, eliminasi. Saat state program tidak jelas, tambahkan instrumentasi atau logging dan bacanya selagi kode berjalan; jangan menebak. Perburuan yang panjang didorong dengan command `/loop` milik Cursor. Mekanisme yang selamat dikonfirmasi dengan bukti runtime sebelum fan-out architect atau interrogate di langkah berikutnya.
3. Rencanakan perbaikannya. Bila melintasi batas fungsi, architect lebih dulu. Delegasikan implementasi ke subagent dengan model bug-fix Anda (bawaan `grok-4.7-xhigh-fast`) dan scope spesifik.
4. Verifikasi di surface yang sama. Repro asli sekarang lulus. Hasil "inconclusive" atau verifikasi di surface yang salah bukan lulus; tandai. Unit test menunjukkan perilaku cabang, bukan absennya bug.
5. Susun commit agar repro yang gagal mendahului perbaikan di riwayat git. Untuk bug dengan jalur uji lokal yang murah, pakai irama failing-test-first dari skill tdd; lewati bila test-nya mahal, penuh integrasi, atau tidak jelas. Ini wujud kanonik prinsip sequence-verifiable-units: test yang gagal dulu, perbaikan di atasnya.
6. Jalankan Opening a PR.

Hasil yang diharapkan: balasan berisi apa yang rusak, akar masalahnya, perbaikannya, dan cara verifikasinya, dengan keluaran repro gagal-lalu-lulus ditempel apa adanya.

## Feature

Sumber: [playbooks/feature.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/feature.md).

Pakai untuk perilaku baru atau yang berubah, dibangun dari satu bentuk data yang bernama. Anda memegang desainnya dan tetap memimpin; implementasi didelegasikan.

Langkah intinya:

1. Jalankan how atas subsistem terdampak.
2. Jalankan architect untuk eksplorasi desain paralel.
3. Tulis throughput checkpoint sebagai empat item todo: langkah awal yang memblokir sebelum fan-out; alur kerja independen, berkas atau lapisan yang terpisah diparalelkan sementara tulisan bersama diserialkan; state mutable bersama, bawaannya memecah target per prinsip separate-before-serializing-shared-state dan serialkan hanya untuk invarian nyata; dekomposisi terkecil yang aman, dan bila satu pekerja memang terbaik, sebutkan alasannya. Dimensi yang sungguh tidak berlaku tetap ditulis dengan `n/a: <reason>`, tidak dibuang.
4. Delegasikan penulisan kode ke subagent dengan model feature Anda (bawaan `grok-4.7-xhigh-fast`) dan scope spesifik: path berkas, bentuk data bernama beserta struktur pengorganisasinya per prinsip principle-model-the-domain, dipilih sebelum logika ditulis, dan kriteria sukses. Struktur pengorganisasi yang dimaksud contohnya state machine atas boolean yang berserakan, tabel atau registry atas percabangan, model bertipe atas asumsi bentuk yang berulang. Bila implementasi mengizinkan beberapa bentuk valid, misalnya penanganan error atau lapisan abstraksi, delegasikan lewat skill arena agar para runner memunculkan alternatifnya dan cross-judge menjaga pilihannya. Langkah ini wajib tanpa jalan keluar skip-with-reason, dan Laziness Protocol tidak menimbangnya, karena untungnya adalah pemisahan tinjauan, bukan baris yang dihemat. Suntingan tetap bedah, berkas turunan upstream di-ground ulang ke sumbernya, perbaikan primitive bersama di-port ke semua konsumennya dan diverifikasi, dan commit dilakukan dengan leluasa.
5. Verifikasi di surface yang cocok. "Inconclusive" atau surface salah bukan lulus; tandani.
6. Rebase menjadi commit kecil yang terurut dan tumpuk follow-up-nya, memakai prinsip sequence-verifiable-units: tiap unit kecil dibangun, diverifikasi, di-commit, sebelum berikutnya.
7. Bila desainnya diperebutkan, jalankan interrogate sebelum mengirim.
8. Jalankan Opening a PR.

Pekerjaan yang terikat kode, satu fitur dengan satu migrasinya, pergi ke satu pemilik dengan checkpoint inline, yang mem-fan-out secara internal setelah fase pemblokir. Fan-out di tingkat induk untuk irisan yang menghasilkan artefak independen: audit, investigasi lintas subsistem, eksperimen yang bersaing. Checkpoint ditulis ulang di batas fase, dan pemilik baru di-spawn alih-alih merantai interrupt.

Hasil yang diharapkan: apa yang dibangun, apa yang dipilih dan alasannya, throughput checkpoint, dan keputusan yang terbuka, dengan tabel untuk alternatif desain.

## Refactoring

Sumber: [playbooks/refactoring.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/refactoring.md).

Pakai untuk perubahan struktur atau bentuk yang mempertahankan perilaku: rename, extract, inline, dedupe, move. Berbeda dari Feature yang menambah perilaku dan Bug fix yang mengoreksinya. Anda memegang kontraknya: strukturnya berubah, perilakunya tidak.

Bila pembersihan mengungkap fitur yang hilang atau bug nyata, pisahkan dan kirim perubahan struktural lebih dulu terhadap kontrak yang dipatok. Redesign diperbolehkan tetapi harus dinamai dan dirutekan ke Feature. Pekerjaan struktural yang besar atau lintas-cakupan milik skill figure-it-out; playbook ini untuk perubahan fokus sampai menengah.

Langkah intinya:

1. Patok kontrak perilaku lebih dulu. Jalankan how untuk mempelajari kontraknya, lalu tulis characterization test, snapshot, atau harness ekivalensi yang menangkap perilaku saat ini sebelum struktur bergerak. Bila areanya tanpa coverage, pin ditulis sebelum menyentuh struktur. Type check dan lint bukan pin.
2. Namai struktur yang hilang dari kode per prinsip principle-model-the-domain. Kode yang membosankan tetap bila bentuknya sudah jelas dan lokal; reshape harus menghapus cabang atau state tak valid, bukan menambah indirection.
3. Namai bentuk targetnya: tata letak modul, tipe, dan call graph seandainya dibangun hari ini, per prinsip foundational-thinking dan redesign-from-first-principles. Bila targetnya melintasi batas fungsi, jalankan architect dulu.
4. Kurangi sebelum menambah: hapus dead code, lipat wrapper satu-pemanggil, buang validator redundan, dan hapus referensi yatim sebelum memperkenalkan bentuk baru. Perubahan terkecil yang mencapai bentuk target itulah yang dikirim; pembersihan spekulatif yang "mungkin membantu" dibatalkan.
5. Bergerak dalam langkah kecil yang mempertahankan perilaku, tiap langkah menjaga pin tetap hijau. Untuk reshape API, migrasikan semua pemanggil dan hapus API lama dalam satu gelombang, tanpa shim kompatibilitas, tanpa jalur lama-baru yang paralel. Tiap rename di-spot-check terhadap berkas nyatanya, karena rename diam-diam melewatkan pemakaian dalam string, prosa, dan back-reference. Suntingan mekanis didelegasikan ke subagent dengan model refactoring Anda (bawaan `grok-4.7-xhigh-fast`) dan scope spesifik.
6. Buktikan perilakunya tidak berubah pada artefak nyata, bukan sekadar "it compiles". Untuk reshape besar, jalankan cek ekivalensi: script yang mem-diff keluaran lama dan baru, baseline terekam yang dijalankan ulang ke kode baru, atau smoke run di surface yang cocok lewat control skill.
7. Konfirmasi perubahannya layak disimpan. Ukuran suksesnya beban pembaca yang turun per prinsip minimize-reader-load; bila diff tidak menurunkannya di mana pun, batalkan.
8. Rebase menjadi commit kecil terurut: commit pengurangan, lalu reshape, lalu pembersihan lanjutan, tiap irisan tetap hijau. Tutup dengan Opening a PR.

Hasil yang diharapkan: struktur yang berubah, pin yang dipegang, bukti ekivalensi, delta beban pembaca, apa yang terkirim dan apa yang dibatalkan, tanpa perilaku baru.

## Perf issue

Sumber: [playbooks/perf-issue.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/perf-issue.md).

Pakai untuk kelambatan yang sudah terukur, ditelusuri dan ditingkatkan terhadap baseline. Untuk perbaikan berkelanjutan terhadap satu metrik, pakai Hillclimb di bawah. Anda memegang cerita pengukurannya: ikat tiap perbaikan ke sebuah pengukuran, jangan membaca source alih-alih mengukur.

Langkah intinya:

1. Ambil trace baseline lewat control skill yang cocok.
2. Jalankan how untuk membumikan hipotesis. Jangan mengklaim plafon performa sebelum menjalankannya. Sebagian besar perbaikan datang dari delapan keluarga strategi berikut, dipakai sebagai generator hipotesis, bukan checklist; sebuah keluarga berhak dicoba hanya bila trace menunjukkan sinyal yang dinamainya.
   - Elimination: sebelum mengoptimalkan hot path, tanya apakah path itu perlu ada; komputasi tanpa konsumen, feature gate yang selalu mati, sinkronisasi yang menggandakan state, jalur legacy yang disimpan jaga-jaga. Trace menunjukkan yang lambat, tidak pernah yang bisa dihapus, jadi keluarga ini butuh pass how, bukan profiler.
   - Divide and conquer: biaya dominan membesar mengikuti ukuran input; pecah pekerjaan agar tiap bagian menyentuh lebih sedikit, atau agar bagian independen berjalan paralel.
   - Caching: komputasi atau fetch yang sama berulang pada input identik; simpan dan pakai ulang, dan namai apa yang membatalkannya sebelum mengklaim menangnya.
   - Indirection: hot path mengerjakan kerja mahal yang bisa diserap perantara lebih murah; indeks alih-alih scan, antrean yang memindahkan kerja dari thread interaktif. Tambahkan hop-nya hanya bila ia menghapus dari critical path lebih banyak daripada yang ditambahkannya.
   - Batching: banyak operasi kecil yang masing-masing membayar overhead tetap seperti RPC atau syscall; gabungkan agar overhead dibayar sekali per batch.
   - Redundancy: penantian tergantung pada satu instance atau percobaan yang lambat; gandakan pekerjaannya dan ambil hasil tercepat, bila trace menunjukkan penantian dominan dan sistem punya ruang.
   - Lazy evaluation: biaya mendarat pada hasil yang tak pernah dipakai atau belum dibutuhkan; tunda kerjanya sampai pemakaian pertama.
   - Scheduling: kerjanya memang harus terjadi, tapi tidak pada momen interaktif; pindahkan ke tempat yang tak menunggu siapa pun, dan ukur jalur interaktifnya karena kemenangannya adalah latensi yang dirasakan.
3. Rencanakan perbaikan dari trace. Bila melintasi batas fungsi, architect lebih dulu. Delegasikan implementasi ke subagent dengan model perf-issue Anda (bawaan `grok-4.7-xhigh-fast`), tinjau diff-nya, dan ambil trace pasca-perbaikan. Verifikasi tiap upaya sebelum mencoba berikutnya.
4. Parse dan bandingkan artefaknya, misalnya JSON ke sqlite lalu diff. "Inconclusive" atau surface salah bukan lulus; tandai.
5. Kutip pengukurannya di PR.
6. Jalankan Opening a PR.

Hasil yang diharapkan: angka baseline, angka pasca-perbaikan, delta-nya, dan path artefak.

## Prototype

Sumber: [playbooks/prototype.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/prototype.md).

Pakai untuk sketsa sekali pakai yang mengambil keputusan desain atau perilaku dengan murah, atau menyelesaikan percabangan empiris dengan mengamatinya alih-alih bertanya ke manusia. Pemicu tipikalnya: "prototype", "mock it up", "try this layout", "sketch it to decide".

Ini satu-satunya playbook yang membalikkan smallest change dan batas verifikasi dari Laziness Protocol. Kecepatan di atas polesan, kualitas kode tidak penting, tanpa perencanaan. Ketelitiannya ada pada memilih desain yang tepat dengan murah: usulkan variasi yang tidak diminta, buang satu pendekatan dan coba yang lain.

Langkah intinya:

1. Batasi keputusan yang menjadi alasan prototype itu dibuat: layout, interaksi, atau densitas mana untuk keputusan visual; perilaku, waktu, atau pendekatan mana untuk percabangan empiris. Tanpa keputusan berarti tanpa prototype: rutekan ke Feature.
2. Kumpulkan referensi saat ruang desainnya terbuka: cari prior art, rangkum moodboard tema, palet, dan tata letak, biarkan pengguna memilih arah sebelum membangun. Lewati bila arahnya sudah tetap.
3. Bangun sekali pakai di direktori scratch yang terisolasi dari source produksi. Untuk keputusan visual, vanilla HTML/CSS/JS atau stack teringan yang merender idenya, dependensi CDN, dev server dengan hot reload. Untuk keputusan perilaku atau waktu, script terkecil yang menggerakkan pertanyaannya. Tanpa framework produksi, tanpa test, tanpa abstraksi.
4. Saat membandingkan alternatif, bangun semuanya di belakang satu switcher, tombol atau keypress, tiap varian berlabel. Ini prinsip exhaust-the-design-space versi murahnya.
5. Verifikasi di surface yang cocok. Keputusan visual: screenshot tiap varian lewat control skill dan jalankan interaksinya. Keputusan perilaku atau waktu: amati hal yang sedang diputuskan dengan log timing, cetakan keluaran, atau render yang ditonton. Di sini observasinya lah yang menjadi test, bukan assertion.
6. Sajikan alternatif, tradeoff, dan rekomendasi. Keluarannya keputusan plus artefak sekali pakai, bukan kode yang siap dikirim; serahkan arah terpilih ke Feature, atau architect untuk bentuknya, untuk pembangunan nyatanya.

Hasil yang diharapkan: varian yang dijelajahi, buktinya, tradeoff, rekomendasi, dan path scratch, dengan pernyataan polos bahwa prototype itu sekali pakai.

## Eval

Sumber: [playbooks/eval.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/eval.md).

Pakai untuk menguji secara blinded bagaimana perubahan sebuah skill, struktur, atau prompt memengaruhi perilaku agent sebelum dipromosikan. Anda memegang desain eksperimennya: rencanakan, butakan, jalankan, sintesis.

Non-negotiables untuk blinding, dirangkum dari sumber:

- Tanpa kata `eval`, `test`, `judge`, `experiment`, `rubric`, `score`, `compare`, `benchmark`, `candidate`, atau `arena` di direktori, berkas, atau prompt apa pun yang dilihat kandidat.
- Prompt kandidat tampak seperti permintaan pengguna yang organik: nyatakan tujuannya, bukan metanya.
- Tanpa isyarat pemancing rantai. Jangan minta kandidat mendaftar skill, prinsip, atau berkas yang dipakainya; minta design notes secara umum dan nilai kepatuhan rantai dari bentuk kodenya, bukan laporannya sendiri.
- Sanitasi nama direktori dan slug: pakai nama berbentuk proyek yang mungkin dipilih pengguna.
- Jangan beri tahu kandidat bahwa kandidat lain ada.
- Judge tahu ia sedang menilai, tetapi melihat keluaran lewat label tersanitasi saja, tidak pernah nama model.
- Membandingkan dua varian: satu judge menilai kedua set dalam satu pass pada satu skala, buta terhadap asal setnya.

Langkah intinya:

1. Bingkai. Nyatakan varian yang diuji dan perilaku yang dihitung sukses. Tulis rubric tiga sampai enam kriteria konkret untuk judge saja, ditahan dari kandidat.
2. Siapkan lingkungan tersanitasi: direktori kerja per kandidat dengan varian terpasang, plus konteks yang dimiliki tugas organik, seperti kerangka proyek dan skill yang secara alami akan dibaca kandidat.
3. Tulis satu prompt organik, apa yang akan diketik pengguna, tanpa kebocoran hal yang diukur.
4. Spawn N kandidat paralel di model berbeda sesuai Phase B skill arena, prompt yang sama untuk semua, masing-masing di direktori tersanitasinya.
5. Spawn satu judge buta di keluarga model berbeda sesuai Phase C skill arena: judge melihat keluaran lewat label tersanitasi dan rubric, tidak pernah nama model.
6. Verifikasi rantainya dari transcript, bukan laporan sendiri. Baca transcript lokal tiap kandidat di `agent-transcripts/` workspace aktif; jangan glob `~/.cursor/projects/*/` karena itu melintasi batas workspace dan membaca chat pribadi proyek lain. Lihat berkas yang benar-benar dibuka kandidat; nilai kepatuhan rantai dari berkas yang dibaca plus bentuk kodenya.
7. Baca sendiri tiap keluaran kandidat sampai selesai, bandingkan dengan verdict judge. Ketidaksesuaian berarti ada model yang bias atau rubric yang ambigu; sintesis.

Hasil yang diharapkan: varian yang diuji, rubric, catatan per kandidat, verdict judge, sintesis Anda, dan rekomendasi apakah variannya dipromosikan.

## Hillclimb

Sumber: [playbooks/hillclimb.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/hillclimb.md).

Pakai untuk perbaikan satu metrik yang berkelanjutan dan ilmiah terhadap sebuah target. Perbaikan sekali jalan itu urusan Bug fix atau Perf issue; playbook ini adalah loopnya.

Disiplin intinya satu kalimat: satu perubahan, satu pengukuran, simpan atau batalkan. Jangan menumpuk perubahan yang belum teruji, dan jangan mengklaim menang dari inspeksi kode, per prinsip prove-it-works.

Langkah intinya:

1. Bumikan beban kerja dan arsitekturnya sebelum memilih metrik. Jalankan how atas targetnya, namai dimensi beban realistis yang bisa menggerakkan hasilnya, dan pilih kasus yang mereproduksi keluhan pengguna; bila tidak ada yang mereproduksinya, perbaiki repro-nya alih-alih hillclimb. Lalu tetapkan satu metrik, arah yang dihitung lebih baik, dan predikat berhenti yang bisa dicek yang memasangkan target dengan lantai percobaan agar kemenangan awal yang beruntung tak bisa mengakhiri run, contohnya "at least 50% better than baseline and at least 10 iterations". Pakai angka pengguna bila diberikan; bila tidak, sepakati dulu.
2. Bangun harness pengukurannya, buktikan sensitivitasnya, lalu bekukannya per prinsip build-the-lever. Jalankan beban kerja realistis yang kontras dan pastikan kasus target mereproduksi gejalanya sementara kasus lebih mudah terpisah sebagaimana diharapkan; bila harness tidak bisa membedakannya, perbaiki beban atau metriknya. Setelah beku, satu command berulang memancarkan metrik, dengan sampling yang cukup membersihkan noise, median dari N run, bukan satu run. Catat baseline dan satu run hijau gerbang regresi sebelum perubahan apa pun.
3. Buka log keputusan lewat skill show-me-your-work: `decision.tsv`, satu baris per percobaan dengan kolom id, hypothesis, change, before, after, delta, tests, verdict (kept atau reverted), dan note. Bacalah sebelum tiap percobaan, dan jauhkan dari tree, di-gitignore.
4. Bumikan tiap hipotesis di model arsitektur langkah 1 sehingga ia menamai mekanisme spesifik, misalnya menunda X dari boot path karena memblokir first paint, bukan "coba memoize sesuatu".
5. Loop, satu hipotesis per iterasi. Serahkan perubahan ke subagent dengan model hillclimb Anda (bawaan `grok-4.7-xhigh-fast`) dengan scope ketat; supervisi dan tinjau diff-nya alih-alih mengetiknya sendiri per prinsip guard-the-context-window. Hipotesis independen yang hidup bersamaan di-fan-out ke subagent paralel, masing-masing di worktree sendiri. Ukur before dan after dengan harness beku dan jalankan gerbang regresinya. Terima hanya bila metriknya melewati noise dan gerbang tetap hijau; selain itu batalkan perubahan sepenuhnya, karena tweak yang "mungkin membantu" tidak disimpan. Satu commit per perbaikan yang diterima, men-stage hanya berkas yang berubah dengan `git add <files>`, tidak pernah `-A`, dan baris log dicatat entah kept atau reverted. Tiap iterasi berakhir pada sebuah cek sebelum iterasi berikutnya.
6. Dorong melewati plateau pertama. Saat macet atau beberapa penolakan beruntun: pivot kategori, gabungkan near-miss, baca ulang source, atau coba yang lebih radikal sebelum menyimpulkan bukit sudah didaki. Kebenaran dan kesederhanaan mengungguli angkanya: batalkan kemenangan yang merusak perilaku, simpan penyederhanaan yang menahan angka.
7. Berhenti saat predikatnya terpenuhi, atau saat ide yang tersisa marginal dan tak sebanding biayanya. Jangan melonggarkan predikat demi menggenapinya, dan jangan berhenti selagi hipotesis murah belum dicoba. Bila macet, angkat, jangan berputar.
8. Jalankan Opening a PR dengan commit yang diterima ditumpuk sesuai urutan masuknya.

Hasil yang diharapkan: metrik dan targetnya, baseline ke final dengan delta persennya, jumlah iterasi kept versus reverted, tiap perbaikan yang diterima dalam satu baris, path `decision.tsv`, dan ide terbaik yang akan dicoba berikutnya bila didorong lebih jauh.

## Investigation

Sumber: [playbooks/investigation.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/investigation.md).

Pakai untuk pertanyaan baca-saja: bagaimana X bekerja, kenapa Y dibangun dengan cara itu, yakin kah tentang Z, haruskah X atau Y. Permintaan investigasi menghasilkan penjelasan berkutip atau rekomendasi, bukan perubahan kode. Anda memegang jawabannya.

Langkah intinya:

1. Rutekan lewat skill how; untuk pertanyaan motivasi, juga lewat skill why.
2. Throughput checkpoint tinggal satu baris:

   ```
   throughput checkpoint: n/a, read-only investigation
   ```

3. Hasilkan keluaran berbentuk how, dengan bagian Overview, Key Concepts, How It Works, Where Things Live, dan Gotchas, atau rekomendasi dengan tabel tradeoff bila permintaannya keputusan antar alternatif.
4. Terapkan skill unslop pada balasannya.

Tanpa PR, tanpa babysit, tanpa architect, kecuali investigasi ini mendahului perubahan kode; bila ya, kembalikan ke pengguna dan rutekan ulang ke Bug fix atau Feature.

Hasil yang diharapkan: keluaran investigasinya. Untuk pertanyaan "yakin kah", sertakan penilaian sebenarnya dengan alasannya, dan dorong balik bila premisnya salah.

## Trace forensics

Sumber: [playbooks/trace-forensics.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/trace-forensics.md).

Pakai untuk mendiagnosis artefak profil hasil tangkapan yang diserahkan setelah kejadian: cpuprofile, trace, spindump, atau heap snapshot. Berbeda dari runtime forensics yang menginstrumentasi proses yang hidup; di sini tangkapannya sudah ada. Artefak adalah dataset tetap: bacalah, jalan ulang tidak. Tooling-nya sengaja generik supaya playbook-nya portabel: parser DevTools atau trace untuk cpuprofile dan `.json.gz`, editor teks untuk spindump, tooling heap untuk heapsnapshot. Anda memegang diagnosisnya dari artefak: muat, bentuk, sempitkan ke penyebabnya, atribusikan ke source.

Langkah intinya:

1. Identifikasi formatnya dan muat dengan alat yang tepat. Artefak besar di-parse di subagent per prinsip guard-the-context-window, dan temuan yang sudah tereduksi disimpan di thread utama.
2. Ubah artefak mentah menjadi bentuk yang bisa di-query: dump trace atau heap snapshot ke sqlite, satu baris per sample, frame, atau node. Capai bentuk queryable sebelum membaca.
3. Sempitkan ke penyebabnya. Query frame yang memegang waktu terbanyak dan telusuri call tree ke hot path. Untuk leak, ikuti retainer chain dari objek yang bocor sampai GC root. Untuk spindump, cari thread yang stuck on-CPU atau blocked beserta wait reason-nya.
4. Atribusikan ke source. Petakan hot frame ke berkas, simbol, dan baris lewat simbol milik artefaknya sendiri; frame tanpa pemetaan source belum menjadi diagnosis. Selesaikan simbolnya, atau katakan polos bahwa artefaknya tidak membawanya.
5. Konfirmasi terhadap tangkapan berpasangan bila ada, dengan mem-diff artefak before dan after. Tanpa itu, tandai temuan sebagai hipotesis terkuat yang didukung artefak, bukan penyebab yang terkonfirmasi.
6. Serahkan diagnosis yang berkutip, tanpa perbaikan kecuali diminta; rutekan ke Bug fix atau Perf issue setelah penyebabnya diketahui. Throughput checkpoint-nya satu baris `n/a, read-only forensics`.

Hasil yang diharapkan: artefak dan formatnya, temuan tereduksinya, lokasi source, path artefak, dan apakah tangkapan berpasangan mengonfirmasinya.

## Visual parity

Sumber: [playbooks/visual-parity.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/visual-parity.md).

Pakai untuk kesetaraan UI yang persis piksel: mencocokkan dua implementasi atau memigrasikan sistem styling. Baseline adalah spec-nya dan tidak Anda sentuh; ekivalensi diverifikasi dengan image diff, bukan dengan mata.

Langkah intinya:

1. Bangun baseline lebih dulu sebelum migrasi apa pun: harness visual regression yang menycreenshot komponen saat ini di seluruh state-nya, plus targetnya bila mencocokkan dua implementasi. Tanpa baseline tidak ada klaim parity; ini prasyarat yang memblokir, bukan tindak lanjut.
2. Klausul anti-jalan-pintas dinyatakan dan dipegang: tanpa modifikasi harness, tanpa utak-atik baseline, tanpa merestrukturisasi komponen demi lolos diff. Bila baseline tampak salah, berhenti dan tanya, jangan sunting.
3. Migrasikan satu komponen pada satu waktu. Paralelkan lintas worktree, satu pemilik per komponen per prinsip separate-before-serializing-shared-state; primitive bersama migrasi lebih dulu sebagai fase pemblokir.
4. Verifikasi tiap komponen terhadap baseline lewat image diff di surface yang cocok lewat control skill. Diff yang tak nol adalah gagal; selidiki delta pikselnya. Jalankan `/loop` per komponen sampai diff-nya nol.
5. Jalankan Opening a PR per komponen atau per batch yang aman.

Hasil yang diharapkan: komponen yang termigrasi, hasil diff tiap komponen, lokasi harness baseline, dan sisa pekerjaannya.
