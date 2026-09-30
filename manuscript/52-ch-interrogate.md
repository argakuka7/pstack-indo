# interrogate: beberapa model memeriksa diff

Bab ini membedah [skill interrogate](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/interrogate/SKILL.md) dari dalam: tinjauan adversarial oleh beberapa model sekaligus, dengan satu reviewer per model, rubrik yang sama, dan satu putusan tersintesis. Frontmatternya menandai `disable-model-invocation: true`, jadi skill aktif lewat panggilan eksplisit seperti `/interrogate` atau kalimat pemicu "adversarial review", "multi-model review", "challenge this", "stress test this code", "find blind spots", atau "tear this apart". Contoh pemakaiannya dari [panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/04-design.md):

```text
/interrogate the whole branch, but skeptically. no nitpicks unless it's an actual bug or regression.
```

Sinyal adversarialnya datang dari keberagaman model, bukan persona yang dibagikan. Hasil akhirnya adalah putusan yang disintesis; skill tidak pernah menerapkan perubahan otomatis. Skill ini juga dirutekan oleh poteto-mode untuk desain yang diperebutkan, seperti dibahas di bab [poteto-mode](21-ch-poteto-mode.md), dan disarankan untuk menekan sketsa tersintesis dari architect di bab [architect](41-ch-architect.md).

## Ruang lingkup dan intensi

Langkah pertama menentukan ruang lingkup dari konteks: bila pengguna menunjuk berkas atau diff tertentu, pakai itu; bila di branch fitur, jalankan `git diff main...HEAD` (atau branch dasar yang sesuai) untuk changeset penuhnya; bila pesan pengguna merujuk pekerjaan terkini, kumpulkan berkas terkaitnya. Diff, atau isi berkas, dikemas bersama berkas konteks di sekelilingnya yang dibutuhkan reviewer untuk memahami kodenya.

Sebelum reviewer dijalankan, intensi dinyatakan eksplisit. Intensi diturunkan dari pesan pengguna, pesan commit, deskripsi PR bila ada, dan kodenya sendiri, ditulis sebagai satu paragraf jelas. Bila intensinya belum pasti, tanyakan dulu kepada pengguna sebelum lanjut.

## Menjalankan reviewer

Semua reviewer diluncurkan dalam satu pesan lewat tool Task, satu reviewer per entri pada baris `interrogate reviewers` di rule `~/.cursor/rules/pstack-models.mdc`, yang diatur lewat `/setup-pstack` seperti dibahas di bab [Penyiapan dan penggunaan pertama](12-ch-setup.md). Bila rule atau barisnya tidak ada, dipakai bawaan berikut:

| Subagent | Model bawaan |
|----------|---------------|
| Reviewer A | `claude-opus-5-5-max` |
| Reviewer B | `gpt-5.6-sol-max` |
| Reviewer C | `grok-4.7-xhigh-fast` |

Label Reviewer A/B/C direntangkan atau dipangkas sesuai jumlah entri yang terpasang. Tiap reviewer memakai `subagent_type: generalPurpose` dan `readonly: true`. Untuk entri `auto` atau `inherit-parent`, field `model` ditiadakan sehingga reviewer itu berjalan di model induknya.

Penolakan slug model punya jalur jatuh yang rapi. Bila tool Task menolak entri yang terpasang, reviewer dijalankan di bawaan tabel untuk keluarganya, dengan keluarga dibaca dari prefix `claude-*`, `gpt-*`, dan `grok-*`, dan hal itu disebutkan. Tanpa keluarga yang cocok, dipakai bawaan Reviewer A. Bila bawaan tabelnya juga ditolak, periksa slug valid di pesan kesalahan tool Task, pilih padanan terdekatnya (utamakan tier penalaran tertinggi satu keluarga), jalankan dengan itu, lalu buka PR terpisah untuk memperbarui tabel bawaan; tinjauan tidak diblokir oleh soal slug. Entri alias tidak pernah diperlakukan sebagai slug yang ditolak dan tidak kena jalur jatuh mana pun.

Prompt tiap reviewer dibangun dari templat [reviewer-prompt.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/interrogate/references/reviewer-prompt.md), diisi dengan intensi yang dinyatakan, diff atau isi berkas, rubrik dari [rubric.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/interrogate/references/rubric.md), dan lensa kualitas kode dari [code-quality-review.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/interrogate/references/code-quality-review.md). Templat terisi yang sama dikirim ke semua reviewer, sehingga setiap model memakai lensa kualitas kode yang sama.

Posisi reviewer dinyatakan lurus di templatnya: cari masalah nyata, bug, cacat desain, persoalan keamanan, dan kekhawatiran keterpeliharaan. Ia tidak hadir untuk membantu atau menyemangati, ia hadir untuk stress-test. Intensinya tidak dipertanyakan; eksekusinya yang ditantang. Temuan harus terstruktur: severity `critical`, `warning`, atau `nit`, lokasi `file:line`, temuan konkretnya, bukti alasannya, dan saran pengganti bila ada. Nol temuan adalah keluaran yang sah.

Rubriknya memeriksa lewat beberapa lensa: correctness (telusuri jalur eksekusinya, jangan berhenti di "ini bisa nil"), root cause versus symptom (apakah yang diperbaiki akar masalahnya atau sekadar menambal gejala), structural integrity (disiplin batas, kopling, kecocokan model data), verification (bisakah dibaca bahwa kode bekerja), complexity budget (kompleksitas yang tidak dibayar kegunaannya), dan security (lacak jalur input pengguna ke sink berbahaya). Prinsip rubriknya: lebih sederhana lebih baik, kecuali sederhana itu salah; tiga baris duplikasi mengalahkan abstraksi prematur. Lensa kualitas kode menambah standar ketat atas implementasi, termasuk ambisi restrukturisasi yang membuat kode jauh lebih sederhana tanpa mengubah perilaku.

## Sintesis

Saat hasil mulai kembali, satu gambaran utuh dibangun:

1. Uraikan semua temuan dari para reviewer.
2. Identifikasi konsensusnya. Temuan yang dinaikkan dua model atau lebih secara independen adalah sinyal tertinggi.
3. Identifikasi temuan model tunggal. Tetap layak dibaca, tetapi ditimbang sewajarnya.
4. Hilangkan duplikatnya. Model berbeda bisa mendeskripsikan persoalan yang sama dengan kata berbeda; gabungkan dan catat model mana saja yang menaikkannya.
5. Catat ketidaksepakatannya. Bila satu model menandai sesuatu dan model lain secara eksplisit mengatakan sebaliknya, itu konteks berguna bagi putusan.

## Penilaian lead

Anda adalah lead reviewer: insinyur senior yang pragmatis, bukan agregator netral. Kerangka lengkapnya ada di [lead-judgment.md](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/interrogate/references/lead-judgment.md). Prinsipnya: reviewer berguna justru karena agresif, tapi agresi tanpa konteks menghasilkan noise. Mereka hanya melihat sepotong codebase dan satu paragraf intensi; Anda memegang konteks percakapan penuh, apa yang sudah dicoba dan ditolak, dan kendala di luar kode.

Setiap temuan dikategorikan ke dalam empat ember:

- **Act on**: persoalan nyata atas correctness, keamanan, atau keterpeliharaan sesuai tujuan sesungguhnya; ini yang akan memblokir PR sungguhan.
- **Consider**: poin sah, tetapi belum pasti menutup biaya menanganinya sekarang; layak menarik perhatian pengguna.
- **Noted**: sah secara teknis tetapi tidak bisa ditindak; bergantung konteks, optimasi prematur, atau dampaknya kecil untuk tahap ini.
- **Dismissed**: salah, nitpick, atau kehilangan konteks; disertai alasan singkat.

Tiap temuan mencantumkan model mana yang menaikkannya, kategorinya, dan satu baris alasan kategorisasi. Prinsip penyaringannya tajam. Reviewer cenderung mengisi halaman tinjauannya: bila tidak menemukan persoalan kritis, nit dinaikkan kadarnya; bila seluruh temuan seorang reviewer cuma nit dan selera gaya, kodenya kemungkinan baik, katakan itu. "Bagaimana kalau ada yang mengirim null" hanya temuan bila pemanggilnya benar-benar bisa mengirim null; telusuri titik panggilnya. Saran abstraksi dinilai prematur kecuali kode itu memang berubah dua kali. "Saya akan mengerjakannya dengan cara berbeda" adalah false positive paling umum dalam code review: bukan bug, bukan cacat desain, dan tidak bisa ditindak kecuali reviewer menunjukkan persoalan konkret pada cara yang ada. Temuan yang membocorkan reviewer kehilangan konteks, misalnya menyarankan perubahan pada kode yang tidak disentuh penulisnya, ditolak dengan sopan.

Di sisi lain, temuan yang tidak nyaman jangan otomatis dibuang; itu justru gunanya tinjauan adversarial. Tanda temuan layak diperhatikan: beberapa model menandai persoalan yang sama secara independen, temuan menunjuk jalur eksekusi konkret alih-alih hipotesis, atau temuan membuka celah pada model mental Anda sendiri atas kode. Temuan keamanan dan correctness dapat pengawasan ekstra bahkan dari satu model saja. Kalibrasinya diukur: pembaca harus bisa membaca bagian Act on, memperbaikinya, lalu mengirim dengan yakin; bila Act on berisi lebih dari lima butir, penyaringannya kurang keras. Daftar Dismissed bukan kerja sia-sia, melainkan mekanisme kepercayaan: pembaca melihat apa yang ditolak dan alasannya, lalu bisa mengganti penilaian Anda bila tidak setuju.

## Format keluaran

Putusan disajikan dalam struktur tetap: Intent (paragraf intensi yang dinyatakan), Reviewers (satu butir per reviewer: label, nama model, jumlah temuan), Act On, Consider, Noted, Dismissed, dan Agreement Map yang memetakan di mana model sepakat, di mana mereka berbeda, dan apa pola setuju dan tidak setujunya bicara tentang kode itu. [Panduan pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/04-design.md) menutup pemakaian biasanya dengan satu pengingat: baca juga bagian penolakannya. Lead adalah insinyur senior yang pragmatis, bukan orakel, dan Anda bisa menggantikannya.
