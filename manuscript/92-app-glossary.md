# Glosarium

Lampiran ini merangkum konvensi istilah yang dipakai seluruh buku. Padanannya mengikuti `GLOSSARY.md` repositori ini. Nama produk, skill, playbook, agent, command, identifier, nama berkas, kode, dan path tetap ditulis dalam bahasa Inggris persis seperti sumber, begitu juga istilah yang sekaligus nama skill seperti blast radius. Artinya dijelaskan dalam bahasa Indonesia, bukan digantikan.

| Istilah | Konvensi di buku ini |
| --- | --- |
| skill | Dipertahankan dalam bahasa Inggris. Unit instruksi yang dapat dipanggil. |
| playbook | Dipertahankan dalam bahasa Inggris. Alur kerja terarah milik `poteto-mode`; jangan samakan dengan skill. |
| agent | Dipertahankan pada nama dan konteks teknis pstack. |
| prompt | Dipertahankan. Instruksi yang diberikan kepada model atau agent. |
| context | Konteks. Informasi yang tersedia bagi model saat bekerja. |
| workflow | Alur kerja. Urutan langkah untuk menyelesaikan tugas. |
| verification | Verifikasi. Pemeriksaan bahwa hasil memenuhi kriteria. |
| review | Tinjauan. Nama proses spesifik seperti code review tetap dalam bahasa Inggris. |
| automations | Automasi. Fitur atau alur otomatis pstack. |
| pull request (PR) | Dipertahankan; setelah pengenalan boleh disingkat PR. |
| diff | Dipertahankan. Perubahan baris kode yang ditampilkan alat version control. |
| source of truth | Sumber acuan. Sumber yang dinyatakan paling otoritatif untuk suatu fakta. |
| blast radius | Dipertahankan dalam bahasa Inggris karena sekaligus nama skill. Artinya dampak perubahan: cakupan bagian yang mungkin terdampak perubahan. |
| worktree | Dipertahankan. Salinan kerja repositori yang terisolasi. |
| run | Dipertahankan. Satu pelaksanaan tugas oleh agent, dari mulai sampai selesai atau berhenti. |
| mode | Mode. Perilaku lengket yang aktif setelah `/poteto-mode` dipanggil dan tetap berlaku antar giliran. |
| session override | Override sesi. Kata-kata seperti "going to bed" atau "don't stop" yang membuat agent terus bekerja. |
| finish condition | Kondisi selesai. Predikat yang bisa lulus atau gagal dan memutuskan sebuah run berakhir. |
| escape hatch | Pintu darurat. Izin berhenti di jalan buntu dan menuliskan alasannya. |
| decision log | Log keputusan. Jejak keputusan yang bisa diaudit, dicatat lewat skill show-me-your-work. |
| todo list | Todo list. Daftar kerja yang item-item pertamanya adalah langkah playbook, disalin apa adanya. |
| subagent | Subagent. Agent yang di-spawn oleh agent induk, umumnya `subagent_type: "poteto-agent"`. |
| role | Peran. Pemetaan jenis pekerjaan ke model, misalnya delegasi kode, penilaian, atau panel tinjauan, diatur lewat `/setup-pstack`. |
| reasoning budget | Reasoning budget. Pilihan besar-usaha penalaran (`unlimited`, `large`, `medium`, `small`) di `/setup-pstack`. |
| model slug | Slug. Nama model yang bisa Anda berikan ke subagent `Task`; `auto` dan `inherit-parent` berarti mewarisi model chat induk. |
| verdict | Dipertahankan. Hasil putusan verifier atau panel atas sebuah patch. |
| lane | Lajur. Satu jalur pemeriksaan paralel dalam verifikasi swarm; nama tetap seperti Regression lane against trunk tetap dalam bahasa Inggris. |
| forge | Dipertahankan. Platform tempat PR hidup; playbook memilih antara GitHub CLI (`gh`) dan Origin. |
| merge frontier | Frontier merge, dipertahankan sebagai merge frontier. PR belum-merged terendah dalam sebuah stack. |
| stack | Dipertahankan. Rantai PR bertumpuk pada base branch. |
| trunk | Dipertahankan. Branch utama tempat pekerjaan mendarat. |
| repro | Dipertahankan. Reproduksi bug sebelum memperbaikinya. |
| plateau | Plateau. Kondisi kemajuan berhenti; dijawab dengan pivot, bukan pemberhentian. |
| heartbeat | Heartbeat. Pemicu berkala untuk mengecek ulang kondisi selesai bila tidak ada event. |
| test | Tes dalam prosa Indonesia; nama gabungan yang tetap Inggris seperti unit test dan characterization test dipertahankan. Bentuk kerjanya ditulis menguji. |
| fixture | Fixture. Data uji tetap yang memicu perilaku yang diperiksa. |

Istilah di atas dipakai konsisten di semua bab. Bila sebuah padanan di bab mana pun terasa berbeda dari baris ini, `GLOSSARY.md` repositori dan sumber asli yang berlaku.
