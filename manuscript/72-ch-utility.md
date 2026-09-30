# Utilitas

Tiga skill di bab ini bekerja di sela alur mana pun. [`/bro`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/bro/SKILL.md) merumuskan ulang pesan terakhir dalam bahasa manusia yang polos. [`/figure-it-out`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/figure-it-out/SKILL.md) merancang playbook yang bisa diaudit ketika tidak ada playbook bawaan yang cocok. [`/show-me-your-work`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/show-me-your-work/SKILL.md) menyimpan jejak keputusan yang bisa ditinjau. Ketiganya menandai `disable-model-invocation: true`, jadi ketiganya aktif lewat panggilan eksplisit, bukan lewat pemilihan sendirinya.

## bro: ulangi dengan bahasa polos

Deskripsi frontmatter [skill bro](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/bro/SKILL.md) menyebut sasarannya: merumuskan ulang pesan terakhir dalam bahasa manusia yang polos, tanpa jargon. Seluruh isi instruksinya satu baris:

```text
Restate your last message. Stop using jargon and speak coherently. State it more simply and concisely, like one human talking to another.
```

Skill ini tidak mengambil argumen dan tidak meminta langkah lain: satu-satunya yang dilakukannya adalah mengulang pesan terakhir dengan kata yang lebih sederhana. Pakai saat penjelasan sebelumnya terlalu padat, terlalu abstrak, atau penuh istilah yang tidak perlu.

## figure-it-out: rancang playbook saat tidak ada yang cocok

[Skill figure-it-out](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/figure-it-out/SKILL.md) dipakai saat tugas tidak cocok dengan playbook mana pun. Deskripsi frontmatternya menamai tiga bentuknya: migrasi besar, perubahan ambisius yang terdiri dari banyak bagian, atau pekerjaan yang ditinjau manusia setelah ia meninggalkan mejanya. Kalimat pemicunya adalah `/figure-it-out`, "figure it out", dan "a large migration". Yang dikirim skill ini bukan kode, melainkan alur kerjanya sendiri: rangkaian fase yang menyesuaikan ketelitian dengan tugas, menjalankan metode ilmiah, dan meninggalkan jejak keputusan yang bisa diaudit manusia setelah ia pergi.

Skill dibuka dengan satu todo list yang item pertamanya adalah membaca bagian Principles di skill `poteto-mode`. Fase-fase di bawah ini lalu ditambahkan sebagai todo.

- **Fase A, Frame.** Mendasari dulu, baru berkomitmen. Run tidak dimulai sebelum tiga hal bisa dinyatakan: definisi selesai sebagai predikat yang bisa dibantah (prinsip prove-it-works), lingkup yang dikuantifikasi berupa perkiraan unit dan usaha beserta penghalang yang muncul saat mendasari, dan tingkat ketelitian yang condong ke tinggi. Pintu satu arah dan blast radius besar mendapat ketelitian lebih banyak; langkah reversibel berisiko rendah lebih sedikit. Ketelitian di sini berarti gerbang dan artefak, bukan "coba lebih keras". Framing beserta tradeoff-nya disajikan sebelum berkomitmen pada run panjang. Pekerjaan reversibel boleh berjalan (prinsip never-block-on-the-human), tetapi run berjam-jam mendapat satu checkpoint.
- **Fase B, Design the workflow.** Uraikan pekerjaan menjadi unit atomik yang bisa mendarat sendiri, dan urutkan dari yang paling belum diketahui risikonya. Scaffold dan verifikasi datang sebelum fitur (prinsip foundational-thinking). Harness verifikasi dibangun sebelum pekerjaannya, dengan baseline diambil dari keadaan sebelum perubahan, supaya pemeriksaannya terbaca sebagai "nilai lama lawan nilai baru". Untuk keputusan desain berpintu satu arah, jalankan skill architect (yang menjalankan arena); lewati untuk pekerjaan mekanis yang bentuknya sudah konkret, karena arena kedua di atas desain yang sudah mapan adalah over-engineering (prinsip laziness-protocol). Putuskan apa yang menyebar: paralelkan hanya lintas seam, dan beri tiap pekerja worktree atau branch sendiri (prinsip separate-before-serializing-shared-state), tanpa menyebar berlebihan. Tulis daftar fase yang dirancang, karena daftar itulah yang ditinjau manusia. Setelah itu jalankan desainnya: tambahkan langkahnya ke todo list setelah entri Fase C dan sebelum Fase D, jalankan tiap langkah di bawah disiplin loop Fase C, dan rangkai log Fase D sepanjang langkah itu, satu baris setiap langkah mendarat, bukan menyimpan seluruh jejaknya untuk akhir.
- **Fase C, Run the loop.** Tiap unit adalah eksperimen: nyatakan hipotesis, buat perubahan terkecil, ukur terhadap predikat pada artefak nyata, pertahankan bila memajukan, kembalikan bila tidak. Terapkan prinsip sequence-verifiable-units, yaitu verifikasi tiap unit sebelum memulai yang berikutnya alih-alih mengumpulkan pemeriksaan di akhir. Verifikasi dengan memeriksa artefak, tak pernah lewat laporan sendiri; bila sesuatu lolos terlalu mudah, curigai metode pengamatannya sebelum sistemnya. Pasangkan pekerjaan yang didelegasikan dengan judge: bila seorang worker mencurangi gerbangnya, reset dan keraskan kontraknya; bila gerbangnya sendiri yang salah, perbaiki gerbang itu di perubahan tersendiri alih-alih mencari jalan pintas di sekitarnya. Putusannya hanya VERIFIED, NOT VERIFIED, atau INCONCLUSIVE. Inconclusive bukan lulus, dan hasil negatif tidak disembunyikan.
- **Fase D, Keep the audit trail.** Catat run lewat skill show-me-your-work. Pekerjaan figure-it-out biasanya cukup ambisius untuk meng-commit jejaknya supaya reviewer bisa membacanya di PR. Jejak plus diff itulah yang membuat manusia bisa kembali dan mempercayai pekerjaan itu.
- **Fase E, Verify and hand back.** Periksa keseluruhannya terhadap predikat Fase A pada produk nyata, bukan hanya pada harness-nya. Koreksi yang berulang dienkode sebagai gerbang, aturan lint, pemeriksaan, atau script (prinsip encode-lessons-in-structure). Balasannya memuat playbook yang dirancang, tingkat ketelitian beserta alasannya, path jejak keputusannya, apa yang sudah terverifikasi terhadap predikat, dan apa yang masih terbuka.

Batasnya sudah ditetapkan bab [poteto-mode](21-ch-poteto-mode.md): figure-it-out merancang satu run khusus, sedangkan playbook Orchestrate menjalankan program berskala proyek.

## show-me-your-work: jejak keputusan yang bisa ditinjau

[Skill show-me-your-work](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/show-me-your-work/SKILL.md) menyimpan satu log kanonik berisi jejak keputusan untuk pekerjaan berjalan lama atau tanpa pengawasan: satu baris per keputusan, memuat apa yang dipilih, kenapa, buktinya, dan hasilnya. Bawaannya log itu artefak kerja, bukan berkas yang di-commit; ia di-commit hanya ketika reviewer memerlukan jejaknya untuk mempercayai hasil. Skill lain merujuk ke sini alih-alih mengarang format sendiri, seperti figure-it-out di Fase D dan bab [poteto-mode](21-ch-poteto-mode.md) untuk pekerjaan panjang, otonom, atau multi-fase.

### Format log

Satu berkas TSV, satu baris per keputusan. Sel tetap satu baris, dan kolom bukti memuat penunjuk, bukan prosa. Mulai dari salinan [references/decision-log-template.tsv](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/show-me-your-work/references/decision-log-template.tsv), yang berisi baris header. Kolomnya enam:

- `ts`. Stempel waktu ISO8601.
- `phase`. Fase atau workstream.
- `decision`. Apa yang dipilih atau dikerjakan, satu baris.
- `why`. Alasannya dengan kata polos. Bila sebuah prinsip yang mendorongnya, sebutkan prinsip itu apa adanya, bukan sebagai label jargon.
- `evidence`. Tautan atau path yang membuktikannya: SHA commit, nomor PR, `file:line`, atau path artefak, trace, maupun screenshot. Tidak pernah berupa paragraf.
- `result`. Hasil atau keadaan predikat: `tests green`, `reverted`, `pixel-diff 0`, `INCONCLUSIVE`, `open`.

Contoh dari sumber, ditulis dengan kata polos supaya reviewer membacanya sekilas:

```text
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	harness	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	widget	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

Baris pertama di atas mencatat pengukuran ukuran pekerjaan sebelum run panjang, baris kedua baseline visual yang diambil lebih dulu, baris ketiga keputusan yang menjaga perubahan tetap kecil, dan baris keempat kerja yang dibuang karena buktinya kosong.

### Mencatat satu baris

Tulis tiap entri seperti Anda bercerita kepada rekan kerja: kata polos, tindakan konkret, tanpa gaya bahasa AI dan tanpa jargon abstrak, karena skill unslop juga berlaku untuk teks log. Helper [scripts/log.sh](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/show-me-your-work/scripts/log.sh) dipanggil sebagai `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`. Helper itu menstempel `ts`, menulis header saat pertama dipakai, membuang tab dan baris baru yang nyasar, dan memberi awalan satu tanda kutip pada sel yang dimulai dengan `=`, `+`, `-`, atau `@`. `printf` polos yang menambahkan satu baris juga bisa dipakai, tetapi perhatikan byte yang sama bila isi selnya datang dari teks yang dihasilkan atau disediakan pengguna.

Yang dicatat adalah titik keputusan dan checkpoint, bukan tiap tindakan: percabangan yang dipilih, unit yang selesai beserta hasil verifikasinya, pivot atau revert beserta pemicunya, penghalang yang muncul, dan gerbang yang diperbaiki. Untuk run berloop, satu baris per iterasi. Yang trivial dan sudah jelas tidak dicatat.

Menurut sumbernya, satu run adalah satu percakapan agent, termasuk giliran-giliran berikutnya dan ringkasan apa pun atasnya. Pickup, agent pengganti, atau chat baru memulai run baru. Ketika sebuah run menambahkan baris ke log yang sudah berisi baris milik run lain, baris pertamanya berfase `start`, begitu pula baris pertamanya setelah baris `start` milik run lain yang lebih dulu. Sebab itu run yang kembali ke log di giliran berikutnya membaca dulu baris-baris terakhir log itu untuk melihat apakah run lain sempat menulis. Baris `start` menamai rentang `ts` baris sebelumnya yang tidak ditulis run ini, dan buktinya menamai run ini, misalnya id agent-nya. Fase `start` tidak dipakai untuk hal lain.

### Di mana log disimpan

Simpan di `decisions.tsv` pada direktori kerja, atau di `.audit/<task-slug>.tsv` ketika beberapa pekerjaan berjalan bersamaan, dan jauhkan dari git. Commit hanya ketika pekerjaannya cukup ambisius sehingga reviewer memerlukan jejak itu untuk mempercayai hasilnya.

Ada dua aturan. Pertama, log bersifat append-only: panggilan yang salah mendapat baris baru yang menggantikannya, dan riwayatnya tidak pernah disunting atau dihapus. Kedua, utamakan bukti yang dihasilkan script yang di-commit daripada pekerjaan sekali pakai (prinsip encode-lessons-in-structure).

### Audit log terhadap transcript

Sebelum menyerahkan hasil, periksa apakah lognya jujur. Baca transcript run ini di bawah direktori `agent-transcripts/` milik workspace aktif, yang path-nya dinamai system prompt; jangan meng-glob `~/.cursor/projects/*/`, karena itu membaca chat privat yang tidak berhubungan. Rentang baris milik run ini dimulai pada salah satu baris `start`-nya, atau pada baris pertama bila run ini yang membuat log, dan berakhir pada baris `start` run lain berikutnya. Untuk setiap rentang, tiga hal diperiksa:

- Setiap baris memetakan ke keputusan atau tindakan yang nyata.
- Bukti tiap baris bisa diresolusi dan menunjukkan apa yang diklaim baris itu.
- Percabangan, pivot, atau pendekatan yang ditinggalkan yang membentuk pekerjaan tetapi tidak tercatat adalah celah, dan celah itu ditambahkan.

Audit memperbaiki log, bukan ceritanya. Ia tidak pernah menyunting atau menghapus baris, bahkan baris yang dikarang. Ketika sebuah baris tidak mencatat keputusan atau tindakan nyata, atau klaim maupun buktinya salah, tambahkan baris yang menggantikannya dengan apa yang sebenarnya terjadi dan penunjuk yang bisa diresolusi. Audit tidak memeriksa baris di luar rentang run ini; bila pekerjaan run ini sendiri menunjukkan satu di antaranya salah, baris itu digantikan seperti panggilan salah lainnya.

### Tinjauan lintas model atas jejak

Sebelum menyerahkan hasil, spawn subagent pada keluarga model yang berbeda dari model yang mengerjakan. Tinjauan sendiri bukan penggantinya. Subagent membaca jejak audit dan transcript run, lalu menandai apa yang perlu diperhatikan pengguna. Ini bukan pengulangan pekerjaan, melainkan pemindaian atas hal yang suboptimal atau berisiko:

- keputusan yang tercatat dengan bukti lemah atau tanpa bukti;
- langkah verifikasi yang dilewati atau diklaim tanpa bukti di transcript;
- pilihan yang terlihat berisiko setelah kejadian, misalnya prematur, melarikan lingkup, atau menambal gejala;
- celah yang mungkin terlewat pengguna pada pembacaan sekilas.

Setiap balasan untuk run yang menghasilkan jejak ditutup dengan bagian "Attention". Baris pertamanya memuat model reviewer sendiri, dalam bentuk `reviewed by <model>`, lalu tiap flag dengan penunjuk ke baris atau momen tertentu. `No flags` adalah nilai yang sah; nama modelnya bukan.

### Membaca jejaknya

Baca dari atas ke bawah, ikuti penunjuk buktinya, dan periksa sesekali. GitHub merender TSV yang di-commit sebagai tabel; di terminal, `column -s$'\t' -t decisions.tsv` merendernya. Skill lain yang butuh jejak audit merujuk ke skill ini dan membiarkannya memiliki formatnya, termasuk daftar kolomnya, alih-alih mengulangi kolom itu sendiri.
