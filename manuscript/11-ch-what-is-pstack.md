# Apa itu pstack?

Bab ini merangkum [README pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/README.md) pada commit yang dipatok. pstack adalah plugin Cursor karya Lauren Tan, dikenal sebagai [poteto](https://x.com/poteto). Penulisnya bukan seorang presiden atau CEO, tetapi telah bekerja dengan jutaan baris kode di Meta, Netflix, dan Cursor, dan tergabung di react core team yang membangun serta merawat react compiler.

Latar belakangnya adalah kekhawatiran yang tumbuh bahwa AI menulis terlalu banyak kode yang asal jadi. Penulisnya setuju dengan kekhawatiran itu. pstack adalah jawabannya: kumpulan skill yang sama yang dipakai penulisnya setiap hari untuk mengirim kode berkualitas di Cursor. Tujuannya bukan memaksimalkan jumlah baris kode, justru sebaliknya. pstack membantu Anda menulis lebih sedikit kode, tetapi dengan kualitas lebih tinggi.

## Paralelisme yang dipercaya

README pstack menyebut "fearless parallelism". Idenya: ketika Anda bisa menggali dalam pada satu agent dan mempercayainya menulis kode yang baik dan bisa diverifikasi, Anda bisa benar-benar bekerja paralel dengan yakin. Jalankan beberapa agent sekaligus dengan `poteto-mode` dan percayai bahwa masing-masing menerapkan prinsip engineering yang ketat pada pekerjaannya.

Setiap model frontier punya kekuatan dan kelemahan sendiri. pstack bisa dipakai dengan model apa pun. Banyak skill-nya bahkan memakai alur kerja multi-model untuk memanfaatkan kekuatan khas tiap model.

## Instalasi

Di chat Cursor, jalankan:

```bash
/add-plugin pstack
```

## Dua langkah untuk mulai

1. Jalankan [`/setup-pstack`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/setup-pstack/SKILL.md), pilih reasoning budget, lalu pilih model yang Anda inginkan.
2. Pakai [`/poteto-mode`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/SKILL.md) setiap kali Anda mengerjakan apa pun yang menuntut ketelitian.

Baru mengenal pstack? Panduan resminya mengajak Anda menyelesaikan satu tugas nyata pertama, dari penyiapan dan prompting sampai verifikasi dan pekerjaan semalaman. Buku ini memperluas alur yang sama.

Skill lainnya bersifat situasional; skill mode memakainya untuk Anda sesuai kebutuhan. Bawaannya, mode membagi pekerjaan berdasarkan kekuatan model: delegasi kode (feature, refactoring, bug fix, perf, hillclimb) diberikan ke grok, sedangkan perubahan tersulit, prosa, dan penilaian diberikan ke opus 5.5. Panel bawaannya adalah opus 5.5, sol, dan grok. `/setup-pstack` bisa mengubah semua itu.

## poteto-mode dan dua puluh tiga playbook

Jalankan `/poteto-mode` di awal sebuah tugas. Ia membaca permintaan Anda, memilih dari sekumpulan playbook, dan menjalankan skill lain saat langkah-langkahnya membutuhkannya. Dua contoh berikut dikutip apa adanya dari README:

```
/poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even when idle. repro
first, then fix and verify.
```

```
/poteto-mode i'm going to bed. land the stack even if ci flakes. i want everything merged by
morning.
```

Ada dua puluh tiga playbook yang ikut dikirim. Tabel berikut merangkum nama dan kegunaannya sesuai README:

| Playbook | Untuk |
| --- | --- |
| investigation | pertanyaan baca-saja: bagaimana x bekerja, kenapa y dibangun dengan cara itu, apakah kita yakin. |
| bug fix | mereproduksi sebuah bug, menelusuri akar masalahnya, lalu memperbaikinya dengan bukti runtime. |
| perf | menelusuri kelambatan yang sudah terukur dan memperbaikinya terhadap baseline. |
| hillclimb | perbaikan satu metrik yang berkelanjutan dan ilmiah terhadap sebuah target, dengan pengulangan hipotesis, pengukuran sebelum/sesudah, dan satu commit per perbaikan yang diterima. |
| runtime forensics | mendiagnosis gejala live (kebocoran memori, idle-cpu spin, glitch) dari instrumentasi. |
| trace forensics | mendiagnosis artefak profil hasil tangkapan (cpuprofile, trace, spindump, heap snapshot). |
| feature | perilaku baru atau yang berubah, dibangun dari satu bentuk data yang bernama. |
| refactoring | perubahan struktur atau bentuk yang mempertahankan perilaku. |
| prototype | sketsa sekali pakai untuk mengambil keputusan desain atau perilaku dengan murah, atau menyelesaikan sebuah percabangan empiris dengan mengamatinya. |
| visual parity | kesetaraan UI yang persis piksel antara dua implementasi. |
| authoring a skill | menulis atau menyunting sebuah `SKILL.md`. |
| eval | menguji secara blinded bagaimana perubahan sebuah skill atau prompt memengaruhi perilaku agent. |
| babysit | mengantar sebuah PR atau stack sampai siap merge: konflik, utas tinjauan, CI. |
| shipping | memverifikasi secara independen bahwa stack-nya hijau, lalu mendaratkannya berurutan dari bawah ke atas melalui github secara default, atau origin bila tersedia. |
| autonomous run | menggerakkan sebuah tugas panjang sampai selesai tanpa berhenti. |
| orchestrate | proyek berkelanjutan yang diserahkan ke satu chat koordinator: berhari-hari, banyak PR bertumpuk, armada subagent. |
| autopilot-full | menjalankan PR-PR independen sampai merged dengan satu pemilik per PR dan satu putaran verdict root swarm di tiap ronde, dimulai dari head yang code-ready. |
| autopilot-stack | membangun dan memverifikasi satu stack linier pada base branch agar operator meninjaunya dan mendaratkannya. |
| session pickup | melanjutkan atau mengambil alih pekerjaan in-flight milik agent sebelumnya. |
| pause safely | menangguhkan pekerjaan in-flight secara bersih agar bisa dilanjutkan nanti. |
| multi-phase plan | pekerjaan yang melintasi fase atau PR bertumpuk. |
| worktree cleanup | mengambil kembali ruang disk dengan memangkas worktree yang sudah merged atau ditinggalkan serta simulator iOS basi, dengan pengaman. |
| opening a pr | membuka PR siap tinjau dari commit kecil yang terurut, dengan judul conventional commits dan isi bergaya briefing. Dipanggil di akhir setiap playbook lain. |

Saat dipanggil, `/poteto-mode` melakukan tiga hal:

1. Mencocokkan tugas Anda dengan satu [playbook](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/) dan membuka todo list yang item-item pertamanya adalah langkah-langkah playbook itu, disalin apa adanya.
2. Merutekan ke skill lain saat langkah-langkah itu berjalan.
3. Menulis balasan yang sudah melalui `/unslop` dan dibingkai untuk konsumen serta pemelihara kode.

`/poteto-mode` juga merupakan mode yang lengket: sekali masuk, ia tetap aktif antar giliran, menerapkan dirinya ketika sebuah playbook cocok atau tugas menuntut ketelitian, dan menepi di luar itu. Anda bisa keluar kapan saja dengan mengatakannya.

Menurut README, `/poteto-mode` bekerja sangat baik dengan command `/loop` milik Cursor. Anda bisa membuat Cursor bekerja berjam-jam tanpa mengorbankan ketelitian.

## Skill pendukung

`/poteto-mode` menjalankan sebagian besar skill ini untuk Anda saat sebuah langkah membutuhkannya: `how`, `why`, `architect`, `arena`, `swarm`, `interrogate`, `unslop`, `no-comments`, `technical-writing`, `tdd`, dan skill prinsip. Tabel berikut untuk saat Anda ingin memanggil satu skill secara langsung:

| Skill | Pakai saat |
| --- | --- |
| `/poteto-mode` | titik masuk bawaan untuk tugas apa pun yang tidak sepele. |
| `/how` | Anda ingin penelusuran cara kerja sebuah subsistem. |
| `/why` | Anda ingin tahu kenapa sesuatu dibangun dengan cara itu. Menemukan MCP yang tersedia saat runtime dan meng-query tiap kategori bukti secara paralel (source control, issue tracker, dokumen panjang, chat real-time, observabilitas infra, error tracking, gudang analitik). |
| `/recall` | Anda memulai atau melanjutkan pekerjaan dan ingin konteks terbaru tentang satu topik dibangun ulang dari riwayat chat Anda sendiri dan rekaman bersama, dikembalikan sebagai ringkasan kondisi terkini yang padat. |
| `/blast-radius` | Anda punya perubahan yang tampak kecil dan ingin tahu apa lagi yang bisa rusak, dengan satu fakta keamanannya dibuktikan oleh kode yang dijalankan, bukan sekadar dinyatakan. |
| `/architect` | Anda hendak menulis kode yang melintasi batas fungsi dan ingin penggunaan pemanggil, tipe, serta bentuk modul ditetapkan lebih dulu. |
| `/arena` | Anda ingin N percobaan paralel atas hal yang sama, lalu mengambil bagian terbaik dari masing-masing. |
| `/swarm` | Anda ingin N pekerja paralel pada irisan atau perlombaan yang berbeda, lalu satu laporan gabungan. |
| `/interrogate` | Anda punya diff dan ingin beberapa model berbeda mencoba merusaknya, termasuk lewat lensa kualitas kode yang ketat. |
| `/automate-me` | Anda ingin skill `-mode` milik sendiri, digarap dari cara Anda benar-benar bekerja. |
| `/make-bot-ui` | Anda ingin halaman atau dasbor yang tombolnya membangunkan sebuah Grok Bot lewat webhook, termasuk serah terima sender-key dan Tailscale. |
| `/setup-pstack` | Anda ingin memilih model yang dipakai pstack per peran. Mendeteksi model Anda dan menulis sebuah rule config. |
| `/reflect` | tugas panjang sudah selesai dan Anda ingin resepnya ditangkap sebagai suntingan skill. |
| `/teach` | Anda ingin benar-benar memahami sebuah perubahan atau subsistem, bukan hanya menerima ringkasannya. Menjalankan `/how` + `/why` dan menenun satu penjelasan lugas yang dibangun diagram demi diagram. |
| `/tdd` | Anda memperbaiki bug dan ada jalur uji lokal yang murah. Tulis test yang gagal lebih dulu, lalu perbaikannya. |
| `/no-comments` | Anda mencopot komentar sebelum tinjauan; memunculkan Comment Sicko, memperbaiki temuan yang diterima, dan menawarkan encoding untuk constraint yang diklaim. |
| `/typescript-best-practices` | Anda sedang membaca atau menyunting TypeScript. Menerapkan prinsip `type-system-discipline` pada tataran sintaks. |
| `/figure-it-out` | tidak ada playbook bawaan yang cocok. Merancang playbook yang ketat dan bisa diaudit untuk tugas tersebut. |
| `/show-me-your-work` | Anda ingin jejak keputusan yang bisa ditinjau. Mencatat keputusan ke sebuah TSV yang bisa di-commit. |
| `/create-verification-skill` | proyek Anda belum punya cara terprogram untuk membuktikan perilaku aplikasi. Membuat skill verify lokal-proyek dengan feature map, untuk bahasa atau platform apa pun. |
| `/maintain-verification-skill` | feature map skill verify Anda sudah melenceng dari aplikasi. Gelombang penyelarasan sumber ditambah satu pass live, paling banyak satu PR koreksi yang terbukti. |
| `/unslop` | Anda sedang merapikan tulisan. Membuang ciri khas tulisan AI. |
| `/bro` | Anda ingin pesan terakhir dirumuskan ulang dalam bahasa manusia yang polos, tanpa jargon. |
| `/technical-writing` | standar dokumen berlapis (Diátaxis, Google developer style, STE, Global English) untuk dokumen, RFC, readme, deskripsi PR, dan pesan commit. |

## Subagent poteto-agent dan Comment Sicko

pstack juga mengirim sebuah subagent yang menjalankan gaya kerja penulisnya dari ujung ke ujung. Panggil dari agent induk lewat `subagent_type: "poteto-agent"`. Subagent itu membaca `poteto-mode` seluruhnya, termasuk indeks prinsip inline-nya, sebelum mengerjakan apa pun. Menggantinya dengan `generalPurpose` melewati pembacaan itu dan membuat hasilnya melenceng.

`/poteto-mode` dan `subagent_type: "poteto-agent"` dirutekan lewat wrapper yang sama.

pstack juga mengirim Comment Sicko, peninjau komentar baca-saja yang tersedia sebagai `subagent_type: "Comment Sicko"`. Umumnya dipanggil lewat `/no-comments`, bukan secara langsung.

## Skill prinsip

pstack memuat dua puluh tiga skill pendek, satu prinsip per skill. `poteto-mode` mengindeksnya secara inline dan membaca indeks itu di awal tugas. Berkas mandirinya ada agar skill lain bisa merujuk sebuah prinsip berdasarkan namanya, dan agar indeks bisa menunjuk aturan lengkap untuk tiap prinsip. Prinsip-prinsip itu terbagi dalam lima kelompok: core, architecture, verification, delegation, dan meta. Bab [Skill prinsip](43-ch-principles.md) membahasnya satu per satu.

## Yang tidak ikut dikirim

Beberapa hal yang dirujuk `poteto-mode` tidak dibundel di pstack:

- `/deslop` dan skill `deslop` dikirim di plugin `cursor-team-kit`.
- `control-cli` (untuk CLI dan TUI) serta `control-ui` (untuk browser, Electron, web) juga dikirim di `cursor-team-kit`.
- `/create-skill` adalah bawaan Cursor. Cursor juga mengirim `/babysit` bawaan; di dalam `poteto-mode`, playbook babysit menggantikannya untuk permintaan status PR.

Pasang `cursor-team-kit` bersama pstack bila Anda menginginkan set lengkapnya.

## Kenapa tidak ada skill perencanaan

Cursor sudah punya plan mode yang bekerja baik bersama pstack. Namun menurut penulisnya, ia tidak percaya pada perencanaan: spec terbaik adalah kode. Jika Anda tetap ingin membuat rencana, `/poteto-mode` mencakupnya, tetapi itu bukan bawaan.

## Jadikan milik Anda

`poteto-mode` adalah gaya penulisnya, dan Anda mungkin tidak menginginkan persis itu. Ketik `/automate-me`. Skill itu menggali transcript terbaru Anda, menyusun drafan skill `<your-name>-mode` dari cara Anda benar-benar bekerja, dan merutekan lewat pstack di bawahnya. Anda tetap memakai pstack sebagai dasar dan mendapat skill perutean Anda sendiri di samping `poteto-mode`.

Model juga bisa diatur. Ketik `/setup-pstack`. Skill itu mendeteksi model yang bisa Anda akses dan menulis satu rule always-applied kecil yang memetakan tiap peran (kode, penilaian, panel tinjauan) ke sebuah model. Setiap skill membacanya dan jatuh kembali ke bawaan yang wajar ketika rule tidak ada, sehingga Anda hanya mengganti yang Anda inginkan. Rule yang ditulis sebelum versi 0.15.3 mengunci model bawaan lama; hapus baris peran tersebut, atau hapus filenya, lalu jalankan `/setup-pstack` lagi. Menjalankan ulang mempertahankan setiap peran yang modelnya berbeda dari bawaan.

Detail penyiapan dibahas di bab [Penyiapan dan penggunaan pertama](12-ch-setup.md).

## Automasi benny

pstack juga mengirim paket automasi [benny](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/automations/benny/) yang masih dorman. benny menyortir laporan masalah dari Slack, lalu mereproduksi dan memperbaiki bug yang terkonfirmasi dengan bukti UI yang nyata. Berkasnya tidak didaftarkan sebagai skill slash.

Untuk menyiapkannya, arahkan Cursor ke `FOR_AGENTS.md` di dalam paket itu. Penyiapan menyalin paket ke repositori target pada `.cursor/automations/benny/`, mengaktifkan pstack di sana untuk skill bersama, dan menjaga konfigurasi pengguna tetap di luar paket yang disalin. Bab [benny dan automasi](81-ch-benny.md) membahasnya lebih dalam.

## Lisensi

pstack berlisensi MIT, dengan hak cipta milik Lauren Tan.
