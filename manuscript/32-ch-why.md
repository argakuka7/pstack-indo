# why: alasan di balik rancangan

Bab ini membedah [skill why](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/why/SKILL.md): investigasi atas motivasi dan maksud di balik kode. Skill ini pendamping skill how. how menjawab apa yang kode lakukan dan bagaimana ia bekerja; why menjawab gaya-gaya apa yang membentuk rancangannya. Wilayahnya pertanyaan seperti "kenapa X bekerja dengan cara ini", "kenapa kita memilih Y", rasional desain, regresi, postmortem, dan ambang batas yang didukung data.

Contoh pemakaiannya dari panduan pstack:

```text
/why was the retry limit set to five? does the reason still hold?
```

Panduan itu menggambarkan skill ini sebagai detektif atas kasus lama: mulai dari source control, lalu meng-query tiap kategori bukti yang dibuka MCP Anda secara paralel, dan melaporkan semuanya dengan sitasi.

## Postur kerja

SKILL.md memerintahkan postur investigator yang hati-hati, cermat, dan presisi, serta jujur memisahkan apa yang diketahui dari apa yang disimpulkan. Kerangka keyakinan lengkapnya ada di referensi [epistemics.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/why/references/epistemics.md), dan synthesizer wajib mengikutinya. Prinsip dasarnya: kode tidak membawa motivasinya sendiri. Anda bisa membaca apa yang kode lakukan, tetapi tidak bisa membaca mengapa ia ada. Itu hidup di commit, PR, tiket, dokumen, dan percakapan, semuanya tidak lengkap, bias, dan kadang hilang. Berpura-pura sebaliknya menghasilkan tebakan yang terdengar percaya diri dan menyesatkan pengguna.

## Langkah 1: pahami target dan pertanyaannya

Skill mengurai permintaan menjadi dua. Target biasanya sepotong kode, pola, fitur, atau keputusan desain yang bernama. Pertanyaannya biasanya rasional desain, tradeoff, edge case pemicu, kendala eksternal, kode mati, atau sapuan sejarah luas.

Bila targetnya kabur, misalnya "kenapa kita begini saja?" tanpa rujukan jelas, skill menebak terbaiknya dari konteks percakapan: berkas yang terbuka, suntingan terbaru, posisi kursor, yang baru saja dibahas. Interpretasinya dinyatakan singkat agar pengguna bisa mengoreksi bila keliru, lalu lanjut.

## Langkah 2: bangun jangkar kode

Sebelum meng-spawn investigator, penyelidikan dijangkarkan dulu ke kode konkret, yang oleh SKILL.md disebut jangkar kode (code anchor). Skill mengumpulkan path berkas dan rentang barisnya, simbol kuncinya (nama fungsi, class, konstanta), daftar commit awal yang menyentuh target, dan nomor PR dari merge commit (pola `(#1234)` di baris subjek). Perintah berikut disalin apa adanya dari SKILL.md:

```bash
# Blame target lines for last-touch commits
git blame -L <start>,<end> <file>

# Full file history, with patches, through renames
git log --follow -p -- <file>

# Last N commits touching the file, PR numbers visible
git log --oneline -20 -- <file>

# Extract PR numbers from a commit message
git log -1 --format=%B <commit>
```

```bash
gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews
```

Perintah `gh` menarik isi dan diskusi PR untuk commit yang substantif. Hasilnya menjadi konteks benih: path berkas, simbol, commit, nomor PR, dan id tiket tertaut, yang semuanya diteruskan ke investigator.

## Langkah 3: investigator paralel

Postur bawaannya adalah investigasi paralel penuh.

Penemuan sumber lebih dulu. Skill mendaftar MCP yang tersedia dari lingkungan Cursor, lewat peta available-tools bila ada, atau lewat direktori `mcps/` untuk server yang aktif. Tiap MCP dipetakan ke satu dari tujuh kategori bukti: riwayat source control, issue tracker, dokumen panjang, chat tim real-time, observabilitas infrastruktur, pelacakan error, dan gudang analitik produk. Source control selalu tersedia lewat git dan `gh`. Untuk enam lainnya, klasifikasi memakai nama MCP, instruksi servernya, nama tool, dan deskriptor resource. MCP yang bisa masuk lebih dari satu kategori dipilihkan kategori bukti utamanya, dan kasus ambigu dicatat di peta cakupan. Sasarannya peta cakupan yang lengkap, bukan minimal: yang nihil didokumentasikan, dan pencariannya tidak dilewati.

Semua investigator yang cocok di-spawn dalam satu pesan agar berjalan serentak, satu agent tidak diminta mengurus banyak MCP. Konfigurasinya: `subagent_type` `generalPurpose`, `model` dari baris `why investigators` dengan bawaan `grok-4.7-xhigh-fast`, dan `readonly: false` alias mode agent. Semantik pengisian `model` dari rule `pstack-models.mdc`, termasuk nilai `auto` dan `inherit-parent` serta fallback saat slug ditolak, sama dengan yang dibahas di bab [how](31-ch-how.md). SKILL.md menegaskan larangan memakai mode readonly atau Ask: mode itu melucuti akses MCP dan mematikan investigator berbasis MCP sepenuhnya. Investigator tetap tidak boleh menulis apa pun.

Setiap investigator menerima lima bahan: prompt dasar dari [investigator-prompt.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/why/references/investigator-prompt.md), playbook kategori dari `references/sources/<source>.md` yang diadaptasi dari indeks [source-playbook.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/why/references/source-playbook.md), playbook lintas-kategori `incident-postmortem.md` bila kode targetnya tampak defensif, jangkar kode dari langkah 2, dan pertanyaan asli pengguna.

Kode defensif yang memicu playbook incident-postmortem mencakup null check, logika retry, penanganan timeout, rate limiting, feature flag, egress guard, dan handler OOM.

### Daftar investigator

Satu investigator per kategori yang punya MCP yang cocok, masing-masing memegang tepat satu tool atau MCP. SKILL.md menamai jenis "why" yang unik diungkap tiap kategori:

1. Investigator source control: riwayat git, `gh` untuk PR, komentar kode, test. Selalu di-spawn sebagai satu-satunya sumber terjamin. Terbaik mengungkap rasional saat implementasi yang tertangkap selama tinjauan.
2. Investigator issue tracker (Linear, Jira, GitHub Issues, Plane, Shortcut): fungsi pendorong produk atau bisnis. Terkuat saat why-nya berada di luar engineering.
3. Investigator dokumen panjang (Notion, Confluence, Google Docs, Coda): rasional desain yang dituliskan sebelum jadi kode.
4. Investigator chat tim real-time (Slack, Discord, Microsoft Teams, Mattermost): pertimbangan real-time yang tak pernah sampai ke dokumen. Penting justru saat jejak kertas source control, tiket, dan dokumen tipis.
5. Investigator observabilitas infrastruktur (Datadog, New Relic, Honeycomb, Grafana, Splunk): kenyataan infra dan runtime yang memotivasi kode. Terkuat saat target bereaksi terhadap sinyal infra seperti timeout, retry, rate limit, dan circuit breaker.
6. Investigator pelacakan error (Sentry, Rollbar, Bugsnag, Airbrake): pengecualian spesifik dan lintasan error yang memotivasi kode defensif atau korektif. Terkuat untuk catch block, null guard, pemeriksaan tipe, dan retry.
7. Investigator gudang analitik produk (Databricks, Snowflake, BigQuery, ClickHouse, dbt, Redshift): kenyataan produk dan data yang membentuk kode. Terkuat untuk kode berfeature-flag, pengiriman berbasis eksperimen, migrasi data, dan pertanyaan "angka ini dari mana".

### Playbook kategori

Indeks source-playbook memberi satu playbook contoh per kategori: `code-archaeology.md` untuk git dan `gh`, `linear.md` untuk Linear, `notion.md` untuk Notion, `slack.md` untuk Slack, `datadog.md` untuk Datadog, `sentry.md` untuk Sentry, dan `databricks.md` untuk Databricks SQL. Tiap playbook adalah contoh konkret untuk MCP umum dan diadaptasi bila MCP di kategori yang sama berbeda, misalnya playbook Linear disesuaikan untuk Jira. Playbook `incident-postmortem.md` bersifat lintas-kategori dan ditambahkan untuk kode defensif.

### Kapan investigator boleh dilewati

Hanya dengan justifikasi tertulis yang masuk ke bagian akhir Sources Consulted. Dua alasan yang sah: tidak ada MCP untuk kategori itu di lingkungan ini, yang ditandai sebagai celah bukan pilihan dengan contoh kalimat "Real-time team chat skipped. No matching MCP available, so the conversational record was not searchable"; atau sumbernya terbukti tidak relevan, bukan sekadar "kemungkinan tidak relevan", dengan palang tinggi seperti "target adalah script build-time tanpa jalur kode runtime".

Untuk target sepele satu commit yang deskripsi PR-nya sudah memuat jawaban lengkap, skill boleh menjawab inline hanya setelah memastikan ketujuh pencarian kategori akan redundan, dan itu dinyatakan eksplisit. SKILL.md menyebutnya langka.

### Apa yang diperintahkan kepada investigator

Template investigator-prompt membatasi investigator pada satu tugas: mengumpulkan bukti secara akurat, bukan menjawab pertanyaan atau menulis prosa, karena synthesizer yang menimbang bukti dan menarik kesimpulan. Posturnya dirangkum dalam enam larangan dan perintah: kutip, jangan parafrasa, saat kata persisnya penting, agar pembaca bisa melompat ke sumber dan memastikan klaimnya dalam hitungan detik; persebar jaring lebar dulu sebelum menyelam; catat yang dicari, bukan hanya yang ditemukan, karena ketiadaan hanya berguna bila pembaca tahu apa yang sudah dicari; lawan ceritanya, sebab bila tiga bukti berbaris rapi dan satu bertentangan, pertentangan itulah temuan paling menarik; pertimbangkan kontrafaktualnya, tanyakan apakah bukti ini tetap diharapkan ada bila pembacaan Anda keliru; dan jangan pernah mengarang, sebab keluaran yang akurat adalah yang diandalkan synthesizer.

Aturan satu-investigator-per-kategori dijaga lewat disiplin tautan: bila sebuah PR merujuk PR lain dari sumber berbeda, investigator tidak mengejarnya sendiri, hanya mencatatnya di bagian Additional Leads agar investigator pemilik sumber itu yang mengambil. Mengejar tautan lintas sumber menduplikasi kerja dan mengaburkan cakupan.

Disiplin epistemikanya memisahkan mekanika dari motivasi: commit yang mengubah `limit = 50` menjadi `limit = 100` menunjukkan perubahannya, belum tentu alasannya, yang dicari di pesan commit, deskripsi PR, tiket tertaut, atau komentar tinjauan. Gaya kode bukan bukti maksud penulis. Ketidakpastian dipertahankan, dan tak ada substitusi diam-diam: bila pertanyaannya tentang fitur X dan bukti yang ditemukan hanya tentang fitur Y, bukti Y tidak disajikan seolah menjawab X.

Keluaran investigator berstruktur tetap: Source (sumber yang diinvestigasi), What I Searched (query dan tempat yang diperiksa), Direct Evidence Found (kutipan verbatim, lokasi, penulis dan tanggal, relevansi), Indirect / Circumstantial Evidence (deskripsi, lokasi, apa yang disarankannya beserta rantai inferensi dan pembacaan alternatif), Contradictions (dua butir yang saling menolak dengan sitasi keduanya), Gaps (yang dicari dan tidak ketemu, spesifik), dan Additional Leads (rujukan lintas sumber untuk diteruskan).

## Langkah 4: sintesis

Satu synthesizer di-spawn dengan `subagent_type` `generalPurpose`, `model` dari baris `why synthesizer` dengan bawaan `claude-opus-5-5-max`, dan `readonly: false`. Mode agent dipakai karena pemeriksaan mutu synthesizer memverifikasi sitasi secara sampling, yang bisa membutuhkan akses MCP; mode readonly melucuti MCP dan menggagalkannya. Synthesizer sendiri dilarang menulis berkas, commit, atau mengubah state eksternal.

Bahannya: temuan semua investigator termasuk hasil nihil dan kategori yang dilewati beserta justifikasinya, jangkar kode, pertanyaan asli, kerangka epistemika, dan template [synthesizer-prompt.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/why/references/synthesizer-prompt.md).

Tugas synthesizer diperintahkan template: baca semua temuan investigator, yang berupa bukti mentah bukan kesimpulan; rekonsiliasi yang tumpang-tindih menjadi satu rujukan otoritatif; identifikasi pertentangan dan tampilkan keduanya, jangan memilih; kalibrasi keyakinan tiap klaim ke tingkatnya; verifikasi sitasi secara sampling dengan membaca kode dan memanggil tool MCP; dan jangan melampaui bukti, karena pengguna akan bertindak atas keluarannya, lebih baik membiarkan pertanyaan terbuka daripada mengisinya dengan tebakan yang terdengar percaya diri.

## Langkah 5: penyajian

Keluaran synthesizer disajikan kepada pengguna. Suntingan ringan untuk kejelasan atau konteks percakapan boleh, tetapi bahasa keyakinannya tidak boleh ditulis ulang.

## Kerangka epistemika

Referensi epistemics.md menetapkan lima tingkat keyakinan. Setiap klaim di keluaran akhir harus duduk di salah satunya, dan tingkatnya menentukan bagian mana klaim itu masuk serta bagaimana kalimatnya dibingkai.

1. Direct: sitasi tekstual eksplisit yang menjawab pertanyaan, sesuatu yang benar-benar ditulis penulisnya, misalnya deskripsi PR yang menyatakan perbaikan paginasi, komentar kode yang menjelaskan pembatasan nilai, atau dokumen desain yang membandingkan opsi. Kalimatnya percaya diri dan masa kini: "ini ada karena X", dengan sitasi.
2. Supported: beberapa bukti tak langsung yang konvergen. Tidak ada satu sumber yang menyatakannya eksplisit, tetapi pola lintas sumber membuatnya mungkin. Kalimatnya percaya diri namun jelas diturunkan, dengan beberapa sumber.
3. Inferred: pembacaan yang wajar atas konteks tanpa dukungan eksplisit. Pembaca harus paham ini interpretasi. Kalimatnya berlindung: "appears", "likely", "suggests", dan rantai inferensinya dibuat eksplisit.
4. Speculative: hipotesis masuk akal dengan bukti tipis dan penjelasan lain yang sama kuat. Tetap bernilai disajikan, tetapi ditandai jelas sebagai tebakan, umumnya di bagian Competing Hypotheses.
5. Unknown: sudah dicari dan tidak ketemu. Ini hasil yang sah dan penting, didokumentasikan dengan spesifik tentang apa yang dicari di mana, bukan sekadar "kami tidak tahu".

Panduan kalimatnya memilah tiga golongan kata. Kata pembawa keyakinan seperti "because", "the reason is", "was designed to", dan "the team decided" menyiratkan Direct atau Supported dan wajib disertai sitasi berdampingan. Kata pelindung seperti "appears to", "seems to", "likely", dan "one reading is" dipakai untuk inferensi. Kata yang dihindari: "obviously" dan "clearly" yang hampir selalu mendahului klaim yang tidak jelas, "of course", "just" yang meremehkan dan menyembunyikan ketidakpastian, serta "I think" karena synthesizer menimbang bukti, bukan berpendapat pribadi.

Empat jebakan lain diatur eksplisit. Rasionalisasi: kode yang "masuk akal" hari ini mungkin ditulis demi alasan yang sudah tidak berlaku atau memang salah sejak awal, jadi jangan memasang rasional bersih pada sejarah yang berantakan, jangan menganggap pola konsisten di codebase pasti disengaja padahal mungkin hasil salin-tempel, dan jangan mengubah ketiadaan bukti menjadi bukti ketiadaan. Jebakan sikofansi: pertanyaan pengguna sering menyimpan hipotesis tersemat seperti "kenapa kita begini, saya kira demi performa?", dan tugasnya memperlakukannya sebagai satu kandidat di antara lainnya, memeriksa buktinya secara independen, bukan sekadar mengonfirmasi. Bukti yang bertentangan: bila tiket dan PR saling menolak, keduanya ditampilkan dengan sitasinya, karena keduanya bisa benar pada lapisan berbeda. Bukti yang hilang: "kami tidak tahu" yang jujur adalah salah satu keluaran paling berharga, karena pengguna jadi tahu jawabannya tidak ada di tempat yang jelas dan ia perlu bertanya kepada manusia; celah dinamai konkret, mulai dari pertanyaan, sumber yang dicari, kata kuncinya, sampai apa yang ditemukan.

Sebelum memfinalisasi, synthesizer menjalankan pemeriksaan kalibrasi: setiap klaim punya sitasi atau dipindahkan ke Inferred atau hipotesis; kalimatnya sesuai tingkatnya; kode tidak diperlakukan sebagai bukti atas maksudnya sendiri; dan bagian What We Don't Know ada serta menyebut celah spesifik, sebab investigasi historis hampir selalu punya celah, dan keluaran tanpa celah patut dicurigai menyembunyikan sesuatu.

## Bentuk keluaran

Keluaran memakai struktur template synthesizer: The Question (pertanyaan dinyatakan ulang satu-dua kalimat), The Code in Question (path berkas, rentang baris, simbol kunci untuk orientasi), What We Found (klaim dengan bukti langsung, satu per butir, berlabel `[Direct]` untuk bukti eksplisit satu sumber dan `[Supported]` untuk beberapa butir tak langsung yang konvergen), What We Can Reasonably Infer (klaim berlabel `[Inferred]` dengan alur penalarannya terlihat), Competing Hypotheses (bila bukti cocok dengan beberapa cerita, masing-masing dengan bukti pendukung dan bukti penolak atau yang hilang), What We Don't Know (celah eksplisit: pertanyaan tak terjawab, pencarian yang nihil, sumber yang tidak tersedia), Sources Consulted (satu baris per investigator, termasuk yang nihil atau sengaja dilewati dengan alasannya, agar pengguna bisa menilai cakupan), dan Confidence Summary (satu-dua kalimat ringkasan keyakinan keseluruhan). Pemisahan keyakinan dipertahankan apa pun penyesuaiannya.

Satu tambahan bila relevan: setelah blok Sources Consulted, bila pertanyaan why pengguna adalah pendahuluan untuk mengubah kodenya, temuan garis keturunannya dikonversi menjadi himpunan kendala Preserve / Change / Avoid / Risk yang siap dipakai merencanakan perubahan.

## Mode kegagalan umum

SKILL.md mencatat satu kegagalan yang dihindari: bias kemutakhiran, yaitu menganggap commit terbaru sebagai yang otoritatif. Bentuk kode saat ini sering merupakan akresi banyak keputusan lebih awal, jadi telusuri ke belakang.

why dan how juga menyusun secara alami. Panduan pstack menyebut prompt "do why first then how" sebagai prompt yang baik saat Anda menduga sejarahnya yang menjelaskan kekacauannya: gali alasannya lebih dulu, baru telusuri cara kerjanya. Kaitannya dengan langkah perubahan kode dibahas di bagian [Mengerjakan](20-part-entry.md): playbook bug fix memakai why untuk riwayat regresi sebelum memperbaiki apa pun.
