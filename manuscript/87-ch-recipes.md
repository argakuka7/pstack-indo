# Resep dan jebakan

Bab ini menerjemahkan halaman [Recipes and pitfalls](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/10-recipes-and-pitfalls.md) pada panduan sumber. Isinya prompt yang layak disalin, lalu kesalahan yang hampir semua orang lakukan sekali. Ganti path dan kondisi selesai dengan milik Anda. Resepnya sengaja tidak formal. Itulah bentuknya saat diketik dalam praktik, dan skill tetap membaca maksudnya dengan baik.

## Memahami subsistem yang asing

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

Mekanika lebih dulu, riwayat kemudian. Laporan tiap skill memberi tahu sumber mana yang dicarinya, jadi Anda tahu jawabannya berpijak di mana.

## Meminta pendapat kedua atas sebuah desain

```text
ask /arena for a second opinion on this thread and our approach
```

Desain Anda sekarang menjadi satu kandidat di antara beberapa, dan sintesisnya memberi tahu apakah panel menemukan sesuatu yang lebih baik atau mengonfirmasi milik Anda. Asuransi yang murah sebelum komitmen yang mahal.

## Memeriksa irisan yang saling mandiri secara paralel

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

Tiap pekerja memiliki satu paket. Induknya menunggu tiap irisan dan mengembalikan satu laporan `PASS`, `ISSUES`, atau `BLOCKED` alih-alih curahan mentah para pekerja.

## Meninjau sebuah branch secara skeptis

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

Kualifikasinya bekerja sungguhan. "don't change anything yet" menjaganya tetap baca-saja, dan aturan nitpick memfilter kebisingan di muka sehingga temuan `Act on` layak memakan waktu Anda.

## Memperbaiki bug lewat tes yang gagal

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path" itu penting. Memaksakan tes lewat mock yang rapuh membuktikan lebih sedikit daripada menjalankan perintah yang sebenarnya, dan playbooknya diizinkan mengatakannya.

## Menjaga sebuah run tetap jujur saat Anda pergi

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

Kontrak lengkapnya ada di bab [Menjalankan tugas semalaman](86-ch-overnight.md). Bentuk singkatnya bekerja bila tugas dan kondisi selesainya sudah ada di percakapan.

## Mengalihkan run yang melenceng

Prompt pengarah cukup satu baris. Contoh-contoh berikut dikutip apa adanya dari panduan sumber:

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

Anda jarang butuh lebih banyak kata. Yang Anda butuhkan nama yang tepat, dan [halaman prinsip di panduan sumber](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/08-principles.md) adalah kosakatanya. Bab [Skill prinsip](43-ch-principles.md) membahas dua puluh tiga namanya satu per satu.

## Meminta balasan dalam bahasa polos

```text
/bro
```

Itulah keseluruhan promptnya. [`/bro`](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/bro/SKILL.md) merumuskan ulang pesan terakhir seperti dua orang berbicara biasa, tanpa jargon, lebih pendek. Gunakan saat sebuah balasan menyeluruh secara teknis dan Anda tetap tidak tahu isinya.

## Jebakannya

- **Mendaftar skill di prompt.** "use /how then /architect then /arena" mengurutkan ulang langkah yang sudah diurutkan playbooknya. Sebutkan tujuan dan kendalanya. Namai sebuah skill hanya untuk mengganti bawaan.
- **Kondisi selesai yang kabur.** "make it better" tidak memberi `/loop` apa pun untuk dicek. Beri sebuah perintah atau artefak yang bisa lulus atau gagal.
- **Agent paralel dalam satu worktree.** Mereka saling menimpa dan diff-nya menjadi artefak arkeologi. Katakan "own worktree per attempt" dan isolasinya gratis.
- **Memakai `/arena` untuk cakupan.** `/arena` mengulang satu brief desain atau kode, lalu memilih basis dan menempelkan bagian terbaiknya. `/swarm` membagi irisan atau perlombaan yang dideklarasikan dan mengagregasi satu laporan.
- **Menerima semua komentar tinjauan.** Bot dan manusia sama-sama mengajukan temuan nyata dan kebisingan dalam satu daftar. `/interrogate` memilah temuan ke golongan act-on dan dismissed beserta alasannya, dan Anda bisa menggolongkan ulang ke dua arah.
- **Memperlakukan `auto` sebagai model slug.** `auto` dan `inherit-parent` berarti "hilangkan kolom model agar subagent mewarisi model chat induknya". Bab [Penyiapan dan penggunaan pertama](12-ch-setup.md) membahas perannya.
- **Melaporkan sukses dari build yang hijau.** Build membuktikan kode terkompilasi. Minta perintah, alur, nilai tersimpan, atau profil yang sebenarnya, dan tunggu buktinya di balasan.
- **Menulis `SKILL.md` bebas.** Rutekan lewat [playbook Authoring or modifying a skill](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/poteto-mode/playbooks/authoring-a-skill.md) agar validasi dan tinjauannya tetap terjadi.

Itulah panduannya. Bila Anda melompat ke sini, kembali ke bab [Penyiapan dan penggunaan pertama](12-ch-setup.md) dan jalankan satu tugas nyata. Kebiasaannya menempel dari pemakaian, bukan dari membaca. Lampiran [Referensi cepat skill](91-app-quickref.md) dan [Bagan pemilihan skill](93-app-decision-flow.md) merangkum seluruh isi buku untuk rujukan singkat.
