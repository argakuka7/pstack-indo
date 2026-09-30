# Skill untuk cara kerja pribadi

`poteto-mode` adalah gaya penulisnya, dan Anda mungkin tidak menginginkan persis itu. [Panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md) membuka halaman make-it-yours dengan pengamatan itu, lalu menawarkan empat langkah: menyusun mode pribadi, menangkap pelajaran dari satu sesi, menulis skill yang fokus, dan menguji perubahan skill sebelum mempercayainya. Bab ini mengikuti keempatnya.

## Mode sendiri dengan /automate-me

Anda tidak perlu mendeskripsikan gaya Anda, karena [`/automate-me`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/automate-me/SKILL.md) membacanya dari riwayat kerja Anda. Menurut [panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md), skill itu menambang transcript terbaru di workspace aktif untuk preferensi yang berulang: cara Anda ingin dibalas, cara Anda mendelegasikan pekerjaan, cara Anda memverifikasi hasil, serta selera Anda pada kode, prosa, dan proses. Setelah penambangan itu, ia menanyakan pola mana yang benar-benar Anda, menyusun draf `.cursor/skills/<your-name>-mode/SKILL.md` lewat alur `create-skill` bawaan Cursor, menjalankan draf tersebut melalui [`/unslop`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/unslop/SKILL.md), lalu membuka pull request dari sebuah worktree supaya Anda meninjaunya seperti perubahan lain.

Jalankan ulang kapan pun kebiasaan Anda bergeser:

```text
/automate-me update my mode skill with everything since its last edit
```

Menurut [panduan yang sama](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md), mode update hanya menambang riwayat sejak skill terakhir berubah. Aturan yang belum Anda bantah dipertahankan, aturan yang punya bukti baru direvisi, dan bagian baru hanya ditambahkan untuk pola yang benar-benar baru. Alur internal skill ini, termasuk penambangan paralel, pertanyaan terstruktur, dan guardrail-nya, dibahas di bab [benny dan automasi](81-ch-benny.md).

## Pelajaran sesi dengan /reflect

Tepat setelah tugas yang mengajarkan sesuatu, [panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md) memakai prompt berikut sebagai contoh:

```text
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
```

Menurut panduan itu, [`/reflect`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/reflect/SKILL.md) mengirim transcript ke tiga reviewer paralel. Seorang synthesizer lalu menyortir usulan ke `Accepted`, `Rejected`, dan `Backlog`, dan menunggu persetujuan Anda sebelum ada skill yang berubah. Ambang kelayakannya tegas: setujui sebuah usulan hanya bila ia akan mengubah keputusan di masa depan. Satu sesi yang aneh adalah anekdot, bukan aturan.

## Menulis skill yang fokus

Bila alur kerjanya sudah Anda ketahui, [panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md) memakai prompt ini sebagai contoh:

```text
/poteto-mode write a skill for verifying database migrations in this repo
```

Penulisan skill dicocokkan dengan playbook [Authoring or modifying a skill](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/authoring-a-skill.md), yang merutekan pekerjaan lewat `create-skill` bawaan Cursor, memvalidasi frontmatter dan tautannya, lalu mengirim hasilnya lewat playbook Opening a PR. Menurut [panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md), prosa untuk agent memikul standar yang lebih tinggi daripada prosa untuk manusia, karena satu kalimat yang tidak menolong berubah menjadi instruksi yang akan diikuti agent di masa depan. Karena itu biarkan playbook yang memegang standar tersebut, bukan penulisan `SKILL.md` dengan tangan bebas.

Skill bukan satu-satunya prosa yang Anda kirim. Untuk dokumen, RFC, readme, deskripsi PR, dan pesan commit, [panduan yang sama](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md) menunjuk [`/technical-writing`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/technical-writing/SKILL.md), yang memilih mode dokumennya lebih dulu (tutorial, how-to, reference, atau explanation) lalu bekerja kalimat demi kalimat. Empat lapis standarnya dibahas di bab [Penulisan](61-ch-writing.md).

Satu kasus khusus punya generatornya sendiri. Skill yang harus menggerakkan aplikasi Anda dan membuktikan perilakunya adalah skill verifikasi, jadi pakai [`/create-verification-skill`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/create-verification-skill/SKILL.md) dan [`/maintain-verification-skill`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/maintain-verification-skill/SKILL.md). Keduanya dibahas di bab [Skill verifikasi](53-ch-verification.md).

## Menguji perubahan skill tanpa bias

Suntingan skill memengaruhi setiap sesi berikutnya, jadi ujilah ia seperti sebuah eksperimen. [Panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/09-make-it-yours.md) memberi promptnya:

```text
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
```

Menurut panduan itu, [playbook Eval](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/eval.md) dibangun di sekitar satu mode kegagalan, yaitu efek pengamat: agent yang tahu dirinya sedang dievaluasi berperilaku berbeda. Karena itu agent kandidat menerima tugas yang tampak organik di direktori yang dibersihkan, tidak pernah melihat kata "eval" atau "candidate", dan tidak pernah mengetahui keberadaan kandidat lain. Satu judge menilai semua keluaran di bawah label netral, dan penelusuran rantai dinilai dari berkas yang benar-benar dibaca tiap kandidat, bukan dari apa yang ia klaim. Panduan itu meminta Anda membaca sendiri setiap keluaran sebelum menerima putusan judge; bila Anda tidak setuju, curigai rubriknya sebelum mencurigai penilaian Anda. Playbook Eval dibahas di bab [Playbook untuk pekerjaan sehari-hari](22-ch-playbooks-work.md).

Jebakan yang dinamai panduan itu: jangan menyunting skill di tengah tugas karena ia berperilaku buruk. Perbaiki di pull request-nya sendiri dan biarkan tugasnya berjalan. Suntingan skill yang dikirim menyatu di dalam pekerjaan fitur tidak terlihat oleh tinjauan dan mustahil dievaluasi.

Bab berikutnya, [Utilitas](72-ch-utility.md), membahas tiga skill yang berdiri di luar rangkaian penyiapan mode pribadi ini.
