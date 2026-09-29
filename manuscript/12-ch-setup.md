# Penyiapan dan penggunaan pertama

Bab ini memandu Anda memasang plugin, memilih model yang dipakai pstack, dan menjalankan tugas pertama. Penyiapan hanya satu command ditambah percakapan singkat. Isinya dirangkum dari [Set up pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/01-setup.md) dan [skill setup-pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/setup-pstack/SKILL.md) pada commit yang dipatok.

## Pasang plugin

Di chat Cursor, jalankan:

```text
/add-plugin pstack
```

Cursor mengonfirmasi bahwa plugin sudah terpasang.

## Pilih model

Jalankan:

```text
/setup-pstack
```

`/setup-pstack` mendeteksi model yang bisa Anda akses, menanyakan reasoning budget, menampilkan tiap peran (delegasi kode, penilaian, panel tinjauan), lalu menanyakan pilihan Anda. Jawab pertanyaannya. Ia menulis `~/.cursor/rules/pstack-models.mdc`, sebuah rule kecil yang dibaca semua skill pstack.

### Deteksi model

Sumber deteksi yang andal adalah daftar model slug yang bisa Anda berikan ke subagent `Task` pada sesi itu. Jika Cursor juga memaparkan API atau CLI model yang mencantumkan model yang berhak Anda akses, skill itu memakainya untuk melengkapi. Jika tidak ada model yang terdeteksi, ia meminta Anda menempelkan slug yang Anda miliki. Skill itu tidak pernah menulis slug nyata yang belum dipastikan tersedia.

### Reasoning budget

Anda memilih dari empat pilihan budget. Pilihan `unlimited` membiarkan effort setiap peran tetap seperti pada tabel bawaan skill, termasuk peran yang dipertahankan saat menjalankan ulang. Pilihan `large`, `medium`, dan `small` menetapkan token effort setiap slug nyata, termasuk entri panel, menjadi `xhigh`, `high`, atau `medium`. Token effort adalah token terakhir, atau token sebelum `fast` bawaan di akhir, pada tangga `max` > `xhigh` > `high` > `medium` > `low`. Bila hasilnya bukan slug yang terdeteksi, dipakai slug terdeteksi dari keluarga yang sama dengan effort tertinggi di bawah atau sama dengan target; bila tidak ada, peran itu ditandai perlu dipilih.

Contoh dari skill sumber: budget `small` mengubah `claude-opus-5-5-max` menjadi `claude-opus-5-5-medium`, dan `grok-4.7-xhigh-fast` menjadi `grok-4.7-medium-fast`.

### Bentuk rule yang ditulis

Rule ditulis dengan `alwaysApply: true`, satu baris `# budget` berisi label pilihan dan effort tujunya, dan satu baris per peran memakai label yang sama dengan yang dipakai `poteto-mode`. Seluruh berkas ditimpa agar jalannya ulang tetap idempoten. Bentuknya menurut skill sumber:

```
---
description: pstack per-role model choices (overrides skill defaults)
alwaysApply: true
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Task `model`). Alias entries in a panel list still count toward its fan-out.
# budget: unlimited (max)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-max
hardest tasks: claude-opus-5-5-max
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-max
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-max
reflect tooling: gpt-5.6-sol-max
reflect judgment, divergent, synthesizer: claude-opus-5-5-max
arena runners: claude-opus-5-5-max, gpt-5.6-sol-max, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-max, gpt-5.6-sol-max, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-max, gpt-5.6-sol-max, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-max, gpt-5.6-sol-max, grok-4.7-xhigh-fast
```

### Semantik penggantian

Anda hanya mengganti yang Anda pedulikan. Peran tanpa baris di rule memakai bawaan skill. Untuk memulihkan bawaan, hapus baris peran itu. Menjalankan ulang `/setup-pstack` mempertahankan setiap peran yang modelnya berbeda dari bawaan. Rule yang ditulis sebelum 0.15.3 mengunci model bawaan lama; hapus baris peran tersebut, atau hapus filenya, lalu jalankan `/setup-pstack` lagi. Baris yang perannya sudah tidak dikenal, misalnya `how critics`, berasal dari peran yang sudah dipensiunkan dan dibuang saat rule dibaca ulang.

Setiap slug nyata yang ditulis harus ada di himpunan slug yang terdeteksi. Nilai `inherit-parent` dan `auto` selalu lolos validasi. Bila slug pilihan Anda tidak tersedia, skill berhenti dan bertanya lagi.

### Pemakai Auto

Anda mungkin bertanya apa yang terjadi bila Anda memakai Auto. Tetapkan sebuah peran ke `inherit-parent` atau `auto`, maka pstack menghilangkan field `model` pada subagent, sehingga subagent mewarisi model chat induk Anda. Kedua nilai berarti hal yang sama dan keduanya bukan slug model. Untuk peran panel, nilainya berupa daftar dan satu subagent berjalan per entri, sehingga panjang daftar menentukan ukuran panel. Penyiapan juga mengatur `swarm workers`, model bawaan untuk setiap pekerja `/swarm`, kecuali sebuah race menamai model untuk tiap arm-nya.

## Terima atau tolak tawaran skill verifikasi

Di akhir penyiapan, `/setup-pstack` mencari cara membuktikan perilaku aplikasi di proyek Anda: skill `verify-*` atau harness yang sudah ada. Jika keduanya tidak ada, ia menawarkan satu kali untuk membuatnya lewat `/create-verification-skill`.

Jawab ya dan ia menulis `.cursor/skills/verify-<app>/`, skill lokal-proyek yang mengajari agent mengendarai aplikasi Anda seperti pengguna. Ia membuktikan skill itu bekerja satu kali sebelum menyerahkannya. Jawab tidak dan penyiapan berlanjut. Anda bisa menjalankan `/create-verification-skill` sendiri kapan saja. Bab [Skill verifikasi](53-ch-verification.md) membahas kapan skill itu layak dibuat.

Setelah penyiapan, mulai chat baru. Rule model berlaku untuk sesi baru.

## Jalankan tugas pertama

Pilih sesuatu yang nyata tetapi kecil, dan uraikan seperti Anda menguraikannya kepada seorang kolega. Contoh berikut dikutip apa adanya dari panduan sumber:

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

Perhatikan todo list yang muncul. Item-item pertamanya adalah langkah-langkah playbook yang dicocokkan, playbook Feature untuk prompt ini, disalin apa adanya. Jika `/poteto-mode` melewati sebuah langkah, langkah itu tetap ada di daftar dengan `skip: <reason>`, sehingga Anda bisa melihat apa yang ia putuskan untuk tidak dikerjakan.

Dari sini Anda bisa mengetik tindak lanjut biasa. `/poteto-mode` lengket: ia tetap aktif untuk percakapan sampai Anda keluar dengan mengatakannya.
