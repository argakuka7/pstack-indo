# poteto-mode

Bab ini membaca [skill poteto-mode](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/SKILL.md) pada commit yang dipatok dari dalam: cara mode itu bekerja, batasannya, dan cara memakainya. Gambaran tingkat produk sudah dibahas di bab [Apa itu pstack?](11-ch-what-is-pstack.md), jadi bab ini masuk ke isi SKILL.md itu sendiri.

## Skill mode yang lengket

Frontmatter skill menandai `mode: true` dan `disable-model-invocation: true`. Artinya, mode ini diaktifkan lewat panggilan eksplisit `/poteto-mode`, bukan dipilih sendiri oleh model. Frontmatter juga memasang baris reminder berikut ke sesi:

```
New task? Playbook match or rigor needed -> apply /poteto-mode. Casual turn or user opts out -> don't.
```

Terjemahnya: tugas baru, kecocokan playbook, atau kebutuhan ketelitian menerapkan mode ini; giliran santai atau keluar dari mode menonaktifkannya. Sekali aktif, mode lengket antar giliran, menerapkan dirinya saat sebuah playbook cocok atau tugas menuntut ketelitian, dan menepi di luar itu. Anda keluar kapan saja dengan mengatakannya.

Saat sebuah tugas masuk, mode bekerja dengan urutan tetap. Ia mencocokkan tugas dengan satu playbook, membuka todo list yang item-item pertamanya adalah langkah playbook itu, disalin apa adanya sebelum todo khusus tugas ditulis. Sebuah langkah yang diputuskan untuk tidak dikerjakan tetap ada di daftar dengan satu baris `skip: <reason>`, sehingga keputusannya terlihat. Selagi langkah berjalan, mode merutekan skill lain yang dibutuhkan langkah itu.

Dua rute khusus mengurus tugas yang tidak pas dengan playbook mana pun. Usaha besar atau lintas-banyak-situs-panggilan, atau pekerjaan yang ditinggalkan pengguna untuk dipercaya nanti, dirutekan ke skill figure-it-out, yang merancang playbook khusus yang ketat untuk tugas itu. Program berskala proyek yang berdiri sendiri, berhari-hari dengan banyak PR bertumpuk dan armada subagent di bawah satu koordinator, dirutekan ke playbook Orchestrate. Batasnya tegas: figure-it-out merancang satu run khusus, orchestrate menjalankan programnya.

## Non-negotiables

Bagian Non-negotiables dari skill menetapkan pemicu yang berlaku dalam mode. Bagian Principles di bawahnya menjadi alasannya: dalam balasan, mode menamai setiap prinsip yang memengaruhi sebuah keputusan dan pilihan spesifik yang diubahnya, dan hanya mengutip prinsip yang berkas SKILL.md daunnya benar-benar dibaca pada sesi itu.

Pemicu yang menonjol mengurus pertanyaan kepada manusia. Sebelum bertanya "pendekatan mana", "bagaimana seharusnya", atau "apa yang seharusnya dilakukan ini", mode menggolongkan jawabannya lebih dulu. Bila jawabannya adalah fakta yang bisa diamati dengan menjalankan sesuatu, perilaku, waktu, tata letak, keluaran, performa, bahkan apakah sebuah eval memisahkan, itu bukan pertanyaan manusia. Buat sketsanya lewat playbook Prototype dan biarkan hasilnya memutuskan. Bila tugasnya Investigation baca-saja yang hasilnya jawaban berkutip, tetap di situ dan jawab dari bukti. Pertanyaan dijaga hanya untuk keputusan produk atau preferensi yang tidak bisa diselesaikan eksperimen apa pun. Di bawah pemberian otonomi penuh, mode memutuskan sendiri panggilan yang dicakup pemberian itu, melakukannya, dan melaporkannya tanpa menunggu jawaban; untuk panggilan yang hanya bisa diambil operator, mode menerapkan bawaan dan melaporkannya dengan satu kata yang bisa membalikkannya. Gerbang yang dinamai operator dan daftar Always-pause tetap menunggu operator.

Pemicu lainnya, dalam ringkasan:

- Perubahan tidak sepele, keputusan arsitektur, atau pertanyaan "yakin kah" menuju skill how.
- Kode apa pun: namai bentuk datanya lebih dulu, dan pilih struktur pengorganisasinya per prinsip principle-model-the-domain.
- Kode yang melintasi batas fungsi menuju skill architect untuk eksplorasi desain paralel sebelum implementasi.
- Fan-out paralel menuju skill swarm untuk matriks cakupan, race, dan gauntlet; skill arena untuk perlombaan desain atau kode dengan seleksi basis dan grafting.
- Desain yang diperebutkan menuju skill interrogate (adversarial multi-model) sebelum dikirim.
- Pekerjaan multi-langkah tidak sepele menulis throughput checkpoint.
- Permukaan prosa apa pun menuju skill unslop; dokumen, RFC, readme, deskripsi PR, atau pesan commit menuju skill technical-writing.
- Sebelum commit, skill deslop dari plugin cursor-team-kit; sebelum tinjauan, skill no-comments.
- Mengirim UI, IDE, atau CLI menuju skill kontrol yang cocok: control-cli untuk CLI dan TUI, control-ui untuk browser, Electron, dan web. Untuk bug fix, reproduksi lebih dulu di permukaan yang sama sendiri; penyerahan ke pengguna hanya lewat pengecualian sempit langkah 1 playbook Bug fix.
- Permintaan status PR menuju playbook Babysit, bukan skill babysit bawaan Cursor yang deskripsinya cocok dengan kata-kata yang sama.
- Permintaan mendaratkan atau mengirim stack hijau menuju playbook Shipping.
- Komentar dari Bugbot atau review keamanan agentic dijawab dengan postur skeptis: keduanya menangkap bug nyata sekaligus mengajukan non-issue dan nitpick, jadi nilai tiap komentar menurut nilainya dan singkirkan noise dengan alasan konkret lewat rubrik triage di referensi bugbot-triage.
- Skill yang rusak di tengah tugas diperbaiki di PR-nya sendiri: tanpa memblok, tanpa mengakalinya diam-diam.
- Pekerjaan panjang, otonom, atau multi-fase mencatat jejak keputusan lewat skill show-me-your-work, di-commit bila taruhannya membutuhkan catatan yang bisa diaudit.

Batasan mode juga tegas soal giliran ganti subagent. Subagent poteto-agent menggantikan generalPurpose karena yang terakhir melewati pembacaan penuh poteto-mode dan membuat hasilnya melenceng; itu sudah dibahas di bab [Apa itu pstack?](11-ch-what-is-pstack.md). Skill deslop, control-cli, dan control-ui tidak dibundel di pstack; keduanya dikirim plugin cursor-team-kit.

## Indeks prinsip

poteto-mode mengindeks dua puluh tiga skill prinsip secara inline dan membaca indeks itu di awal tugas. Indeksnya terbagi lima grup: core (seperti Laziness Protocol, Subtract Before You Add, Build the Lever), architecture (seperti Model the Domain, Boundary Discipline, Type System Discipline), verification (seperti Prove It Works, Fix Root Causes, Test Behavior, Not Implementation), delegation (Guard the Context Window, Never Block on the Human), dan meta (Encode Lessons in Structure). Tiap prinsip punya berkas skill daun sendiri, dan aturannya berlaku hanya setelah berkas itu dibaca penuh. Bab [Skill prinsip](43-ch-principles.md) membahasnya satu per satu.

## Otonomi

Bagian Autonomy dibuka dengan perintah lugas: just do it. Pekerjaan yang bisa dibalikkan dan tindakan eksternal seperti pesan tim, pembaruan tiket, atau memulai eval berjalan tanpa bertanya, dengan MCP tool apa pun. Mode selalu jeda untuk tulisan yang tidak bisa dibalikkan: force-push ke branch bersama, deploy, penghapusan data, dan pesan pelanggan. Override sesi seperti "don't stop", "going to bed", atau "run until done" membuatnya terus berjalan.

Aturan terakhirnya soal kejujuran: no is an acceptable answer. Saat ditanya, diajak menambah cakupan, atau diperlihatkan sebuah pendekatan, mode menjawab dengan penilaian sebenarnya, menolak bila memang harus ditolak. Rekomendasi adalah penilaian, bukan validasi; kesepakatan bukan bawaan, kejujuran di atas menjilat.

## Subagent dan kepemilikan pekerjaan

Untuk subagent apa pun yang di-spawn di dalam langkah playbook, mode memakai `subagent_type: "poteto-agent"`; `/poteto-mode` dan poteto-agent dirutekan lewat wrapper yang sama. Skill alur kerja yang dirutekan (how, why, interrogate, reflect, swarm) menetapkan `subagent_type` sendiri demi tinjauan model beragam, dan itu tidak dioverride.

Bawaan setiap panggilan `Task`: `run_in_background: true`, mode agent (readonly melucuti MCP), pointer berkas alih-alih konteks yang di-inline-kan, dan model eksplisit per peran yang bisa diubah lewat `/setup-pstack`. Bawaannya `grok-4.7-xhigh-fast` untuk kode dan `claude-opus-5-5-max` untuk prosa dan penilaian. Perubahan tersulit, desain lintas-arah, konkurensi rumit, algoritma halus, pergi ke model penilaian terkuat; suntingan mekanis remeh pergi ke model kode yang cepat.

Kepemilikan menjadi aturan paling tegas: Anda memegang pekerjaan setiap subagent. Tinjau diff-nya dan tulis ringkasan sendiri, jangan meneruskan kata-katanya. Resume berantai interrupt diam-diam menjatuhkan direktif, jadi nyalakan subagent baru dengan scope yang dikonsolidasikan alih-alih percaya ringkasan "done". Pendapat kedua adalah prompt yang sama terhadap model berbeda; kesepakatannya adalah sinyal kuat.

## Gaya balasan dan komentar

Setiap playbook ditutup balasan yang ditulis menurut aturan bagian Writing the reply, yang berlaku sejak draf pertama karena pass pembersihan setelahnya tidak menghapus pola ini. Aturannya, dalam terjemahan bebas:

- Kalimat deklaratif pendek. Satu gagasan per kalimat, diakhiri titik.
- Tanpa karakter tanda pisah panjang di mana pun.
- Titik dua sebagai penghubung tengah kalimat juga dilarang (aturan 14 unslop); titik dua sebelum daftar boleh.
- Ringkas bukan alasan membuang isi. Kalimat pendek, tetapi setiap bagian yang dinamakan playbook tetap ada: detail, tradeoff, pilihan, keputusan terbuka.
- Bingkai dampak untuk konsumen dan pemelihara: siapa pekerjaan ini dan apa yang berubah untuk mereka sebelum detail implementasi, lalu apa yang diwarisi insinyur berikutnya.
- Jangan pernah mengarang tautan, kutipan, atau referensi transcript.
- Setiap klaim membawa buktinya atau labelnya dalam kalimat yang sama: measured, inferred, atau guess. Jangan pernah menyerahkan cek yang bisa Anda jalankan sendiri.

Komentar kode mengikuti aturan yang sama, ditulis bersih selagi bekerja. Komentar disimpan hanya untuk alasan tidak jelas yang tidak bisa ditunjukkan kode. Script verify atau test tidak mendapat komentar yang menceritakan fase; assertion atau string log yang mendokumentasikan langkah, seperti `assert(ok, 'persisted across restart')`.

## Cara memakainya

Jalankan `/poteto-mode` di awal tugas yang menuntut ketelitian. Mode tetap aktif untuk sisa percakapan sampai Anda keluar dengan mengatakannya; baris reminder yang dikutip di atas mengatur kapan ia menerapkan dirinya kembali. Todo list yang muncul adalah peta kerja Anda: langkah playbook di atas, todo tugas di bawah, dan keputusan skip terlihat dengan alasannya. Ikuti langkah yang sesuai bab playbook di bagian ini, dan biarkan mode merutekan skill pendukung di belakangnya. Untuk penelusuran tugas pertama, bab [Penyiapan dan penggunaan pertama](12-ch-setup.md) memandu sampai todo list pertama Anda muncul.
