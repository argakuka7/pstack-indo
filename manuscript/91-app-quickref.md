# Referensi cepat skill

Lampiran ini merangkum isi buku sebagai satu halaman rujukan. Kegunaan tiap nama dikutip dari bab yang membahasnya; bedah lengkapnya tetap di bab masing-masing. Peta lengkap plugin ada di bab [Apa itu pstack?](11-ch-what-is-pstack.md), dan penyiapan model per peran ada di bab [Penyiapan dan penggunaan pertama](12-ch-setup.md).

## Dua command inti

- `/poteto-mode`: pintu masuk untuk tugas apa pun yang tidak sepele. Ia mencocokkan tugas dengan satu playbook, membuka todo list yang item-item pertamanya adalah langkah playbook itu, lalu merutekan skill lain saat langkah-langkahnya berjalan. Dibahas di bab [poteto-mode](21-ch-poteto-mode.md).
- `/setup-pstack`: memilih model yang dipakai pstack per peran. Mendeteksi model yang bisa Anda akses dan menulis satu rule kecil yang dibaca semua skill pstack. Dibahas di bab [Penyiapan dan penggunaan pertama](12-ch-setup.md).

## Playbook

`/poteto-mode` memilih dari dua puluh tiga playbook. Kegunaan tiap nama ada di tabel bab [Apa itu pstack?](11-ch-what-is-pstack.md). Dua puluh satu di antaranya dibedah di tiga bab playbook: [Playbook untuk mengerjakan tugas](22-ch-playbooks-work.md) membedah sepuluh playbook pekerjaan harian, yaitu Bug fix, Feature, Refactoring, Perf issue, Prototype, Eval, Hillclimb, Investigation, Trace forensics, dan Visual parity; [Playbook untuk pull request](23-ch-playbooks-pr.md) membedah Opening a PR, Shipping, Babysit, dan Worktree and simulator cleanup; [Playbook untuk pekerjaan panjang](24-ch-playbooks-long.md) membedah Multi-phase or multi-PR plan, Orchestrate, Autopilot-full, Autopilot-stack, Autonomous run, Pause safely, dan Authoring or modifying a skill. Playbook Opening a PR dipanggil di akhir tiap playbook lain. Dua nama sisanya hanya disinggung: session pickup saat bab [teach dan recall](33-ch-teach-recall.md) membedakan penerus konteks, dan runtime forensics dalam bab playbook kerja saat membedah trace forensics.

## Skill

| Skill | Pakai saat | Bab |
| --- | --- | --- |
| `/how` | Anda ingin penelusuran cara kerja sebuah subsistem, penelusuran kode sebelum menyunting, atau jawaban atas pertanyaan penempatan dan pelapisan. | [how](31-ch-how.md) |
| `/why` | Anda ingin tahu kenapa sesuatu dibangun dengan cara itu: rasional desain, regresi, postmortem, ambang yang didukung data. | [why](32-ch-why.md) |
| `/teach` | Ringkasan tidak cukup dan Anda ingin benar-benar memahami sebuah perubahan atau subsistem. | [teach dan recall](33-ch-teach-recall.md) |
| `/recall` | Anda kembali ke satu topik dan ingin konteks terbaru dibangun ulang dari riwayat chat Anda. | [teach dan recall](33-ch-teach-recall.md) |
| `/architect` | Anda hendak menulis kode yang melintasi batas fungsi dan ingin tipe serta bentuk modul ditetapkan lebih dulu. | [architect](41-ch-architect.md) |
| `/arena` | Anda ingin N kandidat atas brief yang sama, lalu satu basis dengan bagian terbaik yang di-graft. | [arena dan swarm](42-ch-arena-swarm.md) |
| `/swarm` | Anda ingin N pekerja pada irisan atau perlombaan yang berbeda, lalu satu laporan gabungan. | [arena dan swarm](42-ch-arena-swarm.md) |
| `/interrogate` | Anda punya diff atau desain dan ingin beberapa model mencoba merusaknya secara adversarial. | [interrogate](52-ch-interrogate.md) |
| `/tdd` | Anda memperbaiki bug dan ada jalur uji lokal yang murah. Tes gagal ditulis lebih dulu. | [TDD dan blast radius](51-ch-tdd-blast.md) |
| `/blast-radius` | Anda punya perubahan yang tampak kecil dan ingin tahu apa lagi yang bisa rusak, dibuktikan dengan kode yang dijalankan. | [TDD dan blast radius](51-ch-tdd-blast.md) |
| `/create-verification-skill` | Proyek Anda belum punya cara terprogram untuk membuktikan perilaku aplikasi. | [Skill verifikasi](53-ch-verification.md) |
| `/maintain-verification-skill` | Peta fitur skill verify Anda melenceng dari aplikasi. | [Skill verifikasi](53-ch-verification.md) |
| `/technical-writing` | Anda menulis dokumen, RFC, readme, deskripsi PR, atau pesan commit. | [Penulisan](61-ch-writing.md) |
| `/unslop` | Anda merapikan prosa apa pun dan ingin membuang ciri khas tulisan AI. | [Penulisan](61-ch-writing.md) |
| `/no-comments` | Anda mencopot komentar sebelum tinjauan lewat peninjau Comment Sicko. | [Kerapian kode](62-ch-code-hygiene.md) |
| `/typescript-best-practices` | Anda membaca atau menyunting berkas `.ts` atau `.tsx`. | [Kerapian kode](62-ch-code-hygiene.md) |
| `/automate-me` | Anda ingin skill `-mode` milik sendiri, digarap dari transcript cara Anda benar-benar bekerja. | [Skill untuk cara kerja pribadi](71-ch-personal.md) |
| `/reflect` | Satu sesi selesai dan pelajarannya layak ditangkap sebagai usulan suntingan skill. | [Skill untuk cara kerja pribadi](71-ch-personal.md) |
| `/bro` | Anda ingin pesan terakhir dirumuskan ulang dalam bahasa manusia yang polos. | [Utilitas](72-ch-utility.md) |
| `/figure-it-out` | Tidak ada playbook bawaan yang cocok dan tugasnya butuh alur kerja khusus. | [Utilitas](72-ch-utility.md) |
| `/show-me-your-work` | Anda ingin jejak keputusan yang bisa ditinjau dan diaudit. | [Utilitas](72-ch-utility.md) |
| `/make-bot-ui` | Anda ingin halaman yang tombolnya membangunkan sebuah Grok Bot lewat webhook. | [benny dan automasi](81-ch-benny.md) |

## Skill prinsip, subagent, dan automasi

- Dua puluh tiga skill prinsip, satu prinsip per skill di folder `principle-*`, terbagi lima grup: core, architecture, verification, delegation, dan meta. `poteto-mode` mengindeksnya secara inline dan membaca indeks itu di awal tugas. Daftar lengkapnya ada di bab [Skill prinsip](43-ch-principles.md).
- Subagent `poteto-agent` dipakai untuk panggilan `Task` di dalam mode, dan Comment Sicko adalah peninjau komentar baca-saja yang umumnya dipanggil lewat `/no-comments`. Keduanya dijelaskan di bab [Apa itu pstack?](11-ch-what-is-pstack.md) dan [Kerapian kode](62-ch-code-hygiene.md).
- Paket automasi [benny](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/automations/benny/README.md) menyortir laporan masalah dari Slack dan mereproduksi bug yang terkonfirmasi. Dibahas di bab [benny dan automasi](81-ch-benny.md).
- `/deslop`, `control-cli`, dan `control-ui` tidak dibundel di pstack; ketiganya dikirim plugin `cursor-team-kit`, sedangkan `/create-skill` dan `/babysit` adalah bawaan Cursor. Rinciannya ada di bab [Apa itu pstack?](11-ch-what-is-pstack.md).
