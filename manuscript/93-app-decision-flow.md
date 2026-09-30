# Bagan pemilihan skill

Bagan ini merangkum aturan pemilihan yang sudah dibahas bab demi bab, tanpa menambah aturan baru. Pintu masuknya satu: [poteto-mode](21-ch-poteto-mode.md) mencocokkan tugas dengan satu playbook dan merutekan skill lain saat langkah-langkahnya berjalan, sedangkan pemberian skill di prompt hanya untuk mengganti bawaan, seperti ditegaskan di bab [Resep dan jebakan](87-ch-recipes.md).

## Pertanyaan pertama

- Tugas baru, cocok dengan sebuah playbook, atau menuntut ketelitian? Jalankan `/poteto-mode`. Dibahas di bab [poteto-mode](21-ch-poteto-mode.md).
- Giliran santai atau Anda memilih keluar? Jangan memanggilnya; mode menepi di luar pemicu itu.
- Sebelum bertanya "pendekatan mana" kepada manusia, cek dulu: bila jawabannya bisa diamati dengan menjalankan sesuatu, itu bukan pertanyaan manusia. Buat sketsanya lewat playbook Prototype dan biarkan hasilnya memutuskan. Dibahas di bab [poteto-mode](21-ch-poteto-mode.md).

## Memahami sebelum menyunting

- "Bagaimana X bekerja", penelusuran kode sebelum menyunting, atau pertanyaan penempatan? `/how`, dibahas di bab [how](31-ch-how.md).
- "Kenapa dibangun dengan cara itu", rasional desain, regresi, postmortem? `/why`, dibahas di bab [why](32-ch-why.md).
- Ringkasan tidak cukup dan Anda ingin pemahaman utuh? `/teach`, dibahas di bab [teach dan recall](33-ch-teach-recall.md).
- Kembali ke satu topik dan butuh konteks terbaru dari riwayat chat Anda? `/recall`, bab yang sama. Melanjutkan satu chat spesifik adalah wilayah playbook session pickup.

## Merancang sebelum kode terkunci

- Kode melintasi batas fungsi dan bentuk modul belum ditetapkan? `/architect`, dibahas di bab [architect](41-ch-architect.md).
- Satu percobaan berisiko mengunci bentuk yang salah dan alternatifnya layak dilombakan? `/arena`, dibahas di bab [arena dan swarm](42-ch-arena-swarm.md).
- Pekerjaannya cakupan atau perlombaan dengan aturan seleksi yang dideklarasikan di muka? `/swarm`, bab yang sama.
- Desain yang diperebutkan atau diff yang ingin diuji ketahanannya? `/interrogate`, dibahas di bab [interrogate](52-ch-interrogate.md).

## Memperbaiki dan membuktikan

- Bug: reproduksi lebih dulu di permukaan yang sama, sebelum memperbaiki. Dibahas di bagian [Memperbaiki dan memverifikasi](50-part-fix.md).
- Bug dengan jalur uji lokal yang murah? `/tdd` menulis tes yang gagal lebih dulu. Dibahas di bab [TDD dan blast radius](51-ch-tdd-blast.md).
- Perubahan kecil dan Anda ingin tahu apa lagi yang bisa rusak? `/blast-radius`, bab yang sama.
- Aplikasi butuh cara terprogram untuk membuktikan perilakunya? `/create-verification-skill`, lalu `/maintain-verification-skill` saat peta fiturnya melenceng. Dibahas di bab [Skill verifikasi](53-ch-verification.md).
- "Sudah dikompilasi" bukan bukti; minta perintah, alur, nilai tersimpan, atau profil yang sebenarnya. Ditegaskan di bab [Resep dan jebakan](87-ch-recipes.md).

## Merapikan tulisan dan kode

- Prosa apa pun? `/unslop`. Dokumen, RFC, readme, deskripsi PR, atau pesan commit? `/technical-writing`. Dibahas di bab [Penulisan](61-ch-writing.md).
- Komentar sebelum tinjauan? `/no-comments`. Berkas `.ts` atau `.tsx`? `/typescript-best-practices`. Dibahas di bab [Kerapian kode](62-ch-code-hygiene.md).

## Menerbitkan pekerjaan

- Menutup playbook apa pun dengan PR siap tinjau? playbook Opening a PR. Dibahas di bab [Playbook untuk pull request](23-ch-playbooks-pr.md).
- Permintaan status PR menuju playbook Babysit, bukan skill bawaan Cursor; permintaan mendaratkan stack hijau menuju playbook Shipping. Dibahas di bab yang sama dan di bab [poteto-mode](21-ch-poteto-mode.md).

## Mengerjakan lewat malam

- Satu tugas sampai satu kondisi selesai? Kontrak semalaman dengan `/loop`. Dibahas di bab [Menjalankan tugas semalaman](86-ch-overnight.md).
- Antrean PR yang saling mandiri sampai merged? Autopilot-full. Perubahan tergandeng yang ingin Anda tinjau dan mendaratkan sendiri? Autopilot-stack. Program berhari-hari dengan koordinator tetap? Orchestrate. Ketiganya dibahas di bab [Playbook untuk pekerjaan panjang](24-ch-playbooks-long.md).
- Durasi bukan kondisi selesai; beri `/loop` predikat yang bisa lulus atau gagal. Dibahas di bab [Menjalankan tugas semalaman](86-ch-overnight.md).

## Menjadikannya milik Anda

- Ingin mode dengan gaya Anda sendiri? `/automate-me`. Pelajaran satu sesi jadi usulan skill? `/reflect`. Model per peran? `/setup-pstack`. Dibahas di bab [Skill untuk cara kerja pribadi](71-ch-personal.md) dan [Penyiapan dan penggunaan pertama](12-ch-setup.md).
- Tidak ada playbook bawaan yang cocok? `/figure-it-out`. Butuh jejak keputusan yang bisa diaudit? `/show-me-your-work`. Balasan yang perlu bahasa polos? `/bro`. Dibahas di bab [Utilitas](72-ch-utility.md).
- Perlu satu nama untuk mengalihkan arah agent di tengah tugas? Rujuk nama prinsipnya; ada dua puluh tiga, dibahas di bab [Skill prinsip](43-ch-principles.md).
