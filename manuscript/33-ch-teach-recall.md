# teach dan recall: memberi pemahaman dan memulihkan konteks

Dua skill di bab ini saling melengkapi dari sisi yang berlawanan. [teach](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/teach/SKILL.md) membangun pemahaman baru atas sebuah benda kerja dengan merajut hasil how dan why. [recall](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/recall/SKILL.md) memulihkan konteks Anda sendiri yang tertinggal: apa yang sudah dikerjakan dan diputuskan, lalu menyerahkan kembali kapsul kondisi terkini. Contoh pemakaiannya dari panduan pstack:

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

```text
/recall catch me up on the export work from last week
```

## teach: menjelaskan sampai benar-benar dipahami

Kalimat pembuka SKILL.md menetapkan kontraknya: jelaskan apa sebuah benda, bagaimana ia bekerja, dan mengapa ia dibangun demikian, dalam satu uraian lugas dengan kecepatan orangnya. Tujuannya orang itu memahami, bukan Anda mengubah apa pun.

teach duduk di atas how dan why. Ia membaca kode sendiri sekadar untuk berorientasi, lalu menjalankan how untuk cara kerjanya dan why untuk alasannya. Keduanya adalah pemanggilan skill sungguhan yang menggali sendiri, bukan draf ulang dari ingatan. Hasil keduanya dirajut menjadi satu penjelasan lugas yang memimpin dengan yang penting bagi orangnya, lalu makin dalam bila ia bertanya. Penjelasan boleh ditulis ulang dengan bebas untuk mengajar, dengan satu pengecualian: bahasa keyakinan milik why dipertahankan apa adanya, karena lindungannya adalah temuan, bukan gaya. Epistemika why sudah dibahas di bab [why](32-ch-why.md).

Lima langkahnya:

1. Putuskan beberapa hal yang harus dipahami orang itu saat pergi. Pilihnya dari alasan ia bertanya (hendak mengubahnya, meninjaunya, men-debug-nya, atau baru mengenalnya) dan yang sudah ia ketahui, keduanya dibaca dari percakapan, bukan ditanya keluar darinya. Lewati yang jelas sudah ia kuasai. Taruh kedalamannya di pertanyaannya.
2. Biarkan how dan why yang bekerja. Jalankan keduanya secara paralel dan gabungkan hasilnya, sesuaikan ukurannya dengan pertanyaannya: dua-duanya untuk subsistem, mungkin satu saja cukup untuk perubahan kecil. why dijaga sempit secara bawaan karena sapuan penuhnya lambat; penyempitannya ditulis di dalam permintaannya sendiri, misalnya pertanyaan terlingkup plus git dan satu-dua sumber, sehingga why mencatat kategori yang dilewatkan sesuai kontraknya, dan diperlebar hanya bila alasannya justru inti persoalannya.
3. Mulai dari definisi polos. Namai bendanya dan katakan apa itu secara umum, cara insinyur senior mengatakannya lisan, dengan nama umumnya bila ada. Lalu ikat ke kasus di depan mata ("di X, kami memakai ini untuk ...") dan bangun dari sana: cara kerjanya, alasan yang lebih dalam, kasus tepinya. Tiap bagian dijelaskan sampai mengena: masalah yang diselesaikannya dan cara kerjanya yang sebenarnya. Telusuri apa yang terjadi selagi orang itu melakukan halnya, misalnya membuka chat panjang atau menggulir ke atas, bila itulah yang membuatnya mengena. Mendaftar fungsi dan konstanta itu referensi, bukan mengajar. Jangan mencetak label bingkai seperti "the one idea to hold onto", "the key insight", atau "TL;DR". Berikan jawaban lengkap terkecil lebih dulu, satu-dua kalimat, lalu berhenti; tambah lapisan saat ditanya, dan jangan pernah tembok teks.
4. Jadikan percakapan, bukan kuliah atau pertunjukan. Tawarkan menyelami lebih dalam atau lanjut, dan ikuti arahnya. Tanpa kuis, tanpa teater tempo: jangan mencetak "Pause", jangan menyuruh mengulanginya, jangan mengumumkan "kalimat yang harus dihafal", dan jangan menandai bagian sebagai penting atau sulit. Katakan saja. Saat ingin berhenti sejenak, berhenti dan biarkan ia menanggapi. Pada run sekali jalan tanpa manusia yang aktif, sampaikan bersih dan taruh tawaran untuk menyelami lebih dalam di akhir.
5. Tunjukkan, jangan hanya katakan, dan bangun gambarnya diagram demi diagram. Buka diff, kode, atau debugger bila itu cara tercepat mengena. Gambar bila gambar mendarat lebih cepat dari kata-kata. Untuk apa pun dengan tiga bagian bergerak atau lebih, jangan menggambar satu diagram sekaligus berisi semuanya: gambar satu rangkaian pendek yang tiap diagramnya menggambar ulang yang lalu dan menambah satu bagian, sehingga pembaca menyaksikan sistem merakit dirinya. Diagram tunggal serba-serentak, apalagi yang disimpan untuk akhir, adalah referensi, bukan mengajar. Panduan pstack memberi contoh betonnya: untuk mengajarkan alur A ke B ke C, gambar tiga kali, pertama A ke B, lalu gambar ulang dan tambahkan C, lalu gambar ulang dan tambahkan sisi balikan atau bagian berikutnya.

Media dipasangkan ke gagasannya. Diagram mermaid cocok untuk alur atau struktur yang maknanya dibawa labelnya. Bila gagasannya spasial, seperti tata letak, tumpang-tindih, posisi gulir, atau sebelum-sesudah, pakai tool pembuat gambar dan gambarkan bergaya spidol di papan tulis dengan sedikit label pendek, karena model gambar merusak teks panjang. Aturan bertahap berlaku juga untuk gambar hasil generasi: satu titik sederhana tidak butuh figur.

Seluruh balasan ditulis menurut skill unslop, dalam bahasa lisan polos seperti menjelaskan kepada kolega. Padat, bukan terpangkas. Buang pengisi dan lindungan, simpan bagian yang membuat mengena. Nyatakan mekanisme konkretnya, bukan metafora, bingkai, atau pratinjau bagian berikutnya. SKILL.md memberi contoh kepadatan sasarannya, dikutip apa adanya: "Virtualization runs in two parts, one for rendering and one for loading from disk. When an item scrolls out past the buffer, both its DOM node and its in-memory data are evicted." Balasannya adalah penjelasan itu sendiri, bukan laporan tentang apa yang dikerjakan.

Panduan pstack menambahkan satu trik pemakaian: bingkai "convince me" pada contoh di pembuka bab layak dicuri. Ia mengubah penjelasan menjadi argumen yang bisa Anda uji dan bantah, bukan tur berpemandu.

## recall: memulihkan konteks Anda sendiri

SKILL.md membuka kontrak recall: sebelum memulai atau melanjutkan pekerjaan, bangun ulang konteks kerja terbaru pengguna dan serahkan kapsul padat tentang kondisi saat ini dan langkah berikutnya. Disiplin dasarnya satu kalimat: baca hanya yang dibutuhkan utas dalam cakupan, lalu berhenti.

Konteks Anda hidup di dua rekaman. Riwayat chat Anda sendiri memuat apa yang Anda kerjakan dan putuskan. Rekaman bersama memuat semua yang terjadi di sekitar kode yang sama dengan nama lain: gejala yang terus dilaporkan pengguna, perbaikan yang terkirim lalu di-revert, error yang masih menyala di produksi. Rekaman kedua itulah yang digarap skill why lintas source control, issue tracker, kanal chat dan issue, dokumen panjang, dan pelacakan error. Fitur dengan ekor bug yang panjang menyimpan hampir seluruh ceritanya di sana, jadi jangan bangun ulang dari transcript Anda saja.

Transcript tersimpan di `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl`, dengan `<slug>` adalah path workspace yang garis miring awalnya dibuang dan tiap "/" diganti "-" (misalnya `/Users/you/proj` menjadi `Users-you-proj`), dan tiap barisnya satu pesan chat.

Enam langkahnya:

1. Klasifikasikan, lalu rutekan. Satu chat lama spesifik yang mau dilanjutkan adalah urusan playbook session-pickup, bukan recall. Kebiasaan yang dijadikan skill awet adalah `automate-me`. Ringkasan pekerjaan yang mudah dibaca manusia adalah tugas lain. recall memuat konteks kerja lintas chat terbaru sebelum Anda bertindak. Bila pengguna sudah menyerahkan kapsul kondisi lengkap (path, branch, perubahannya), pakai itu dan lewati penambangan.
2. Kunci cakupannya sebelum mencari. Patok jendela waktunya ("terbaru" adalah rentang nyata, bawaannya tujuh hari terakhir), topiknya bila dinamai, dan workspace-nya (bawaannya yang aktif; jangan pernah membaca transcript proyek lain tanpa diminta). Nyatakan cakupannya kembali. Jangan pernah diam-diam mengubah "semua" menjadi "N terbaru".
3. Sebar ke riwayat chat Anda. Spawn subagent paralel pada model cepat dan murah, masing-masing mengambil satu irisan korpus. Tiap subagent disuruh mengurutkan kandidat menurut waktu modifikasi nyata (`ls -t`) dan tidak pernah menurut nama UUID, men-grep topiknya lebih dulu lalu membaca hanya chat yang cocok dan hanya kawasan relevannya, serta melewati chat saat ini ditambah derau yang jelas seperti chat subagent, eval, dan test. Tiap subagent mengembalikan skema yang sama, satu blok per chat: topik, tujuan pengguna, keputusan, utas terbuka, pergumulan dan koreksi, dan artefak (PR, tiket, branch), semuanya mensitasi UUID chatnya. Untuk satu-dua chat, lewati penyebaran dan cari langsung. Transcript mentah tinggal di subagent; thread utama hanya menerima temuannya.
4. Sapu rekaman bersama setiap kali topiknya menamai fitur, berkas, subsistem, area, atau bug. Ini bawaan, bukan pertimbangan, dan "pekerjaan saya atas X" tidak mengecualikannya. Pekerjaan diserahkan ke investigator sumber milik skill why, tetapi pertanyaannya diarahkan ulang dari "kenapa ini dibangun begini" menjadi "apa kondisi saat ini, apa yang sudah dicoba dan tidak bertahan, dan apa yang masih dilaporkan pengguna". Gunakan kembali playbook per sumbernya, jalankan investigator paralel bersama penambangan riwayat chat, dan warisi posturnya: satu investigator per sumber, hasil nihil adalah temuan, MCP yang tidak ada dilewati dengan disebutkan. Lewati langkah ini hanya untuk pemulihan aktivitas murni tanpa target yang dinamai ("apa yang saya kerjakan minggu ini"), tempat riwayat dan kondisi live Anda adalah seluruh jawabannya.
5. Verifikasi terhadap kondisi live. Ambil PR, branch, dan tiket yang muncul dari penambangan dan sapuan, lalu periksa dengan `git` dan `gh`. Saat jawaban bergantung pada apa yang benar-benar dikerjakan sebuah agent (tool yang dijalankannya, berkas yang dibacanya, error yang dijumpainya), baca transcript penuhnya, bukan salinan lokal yang terpangkas.
6. Tulis briefnya sesuai kontrak keluaran di bawah, dikelompokkan per utas dan tetap pada topik yang dinamai.

## Kontrak keluaran recall

Brief dipimpin kapsul, lalu status utas, lalu masalah, lalu langkah berikutnya; detail yang lebih dalam turun ke bawah atau dibuang.

- Kapsul: paling banyak lima butir, apa pekerjaan ini dan posisinya secara umum.
- Utas: satu baris per utas, diawali tepat satu label status: `[merged #N]`, `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted #N]`, atau `[planned, not started]`. Utas tanpa label berarti belum selesai, maka beri label.
- Masalah: paling banyak lima, yang berulang. Sertakan gejala yang terus dilaporkan pengguna dan perbaikan yang terkirim lalu di-revert, agar percobaan berikutnya mulai dari titik kegagalan terakhir.
- Langkah berikutnya: satu tindakan paling berguna, konkret.

Fitur atau tiket tetangga tetap di luar kecuali menghalangi yang ini. Saat kapsul dan baris utas membesar melebihi satu layar, pangkas detail sebelum memangkas utas. Temuan chat disitasi dengan UUID-nya dan temuan rekaman bersama dengan sumbernya (nomor PR, id tiket, permalink chat, isu error-tracker). Konteks privat disterilkan sebelum keluaran publik apa pun. Brief ditulis menurut skill unslop.

## Kapan memakai yang mana

Keduanya dipakai pada saat yang berbeda dari alur kerja yang sama. teach saat ringkasan tidak cukup dan Anda ingin benar-benar memahami sebuah perubahan atau subsistem sebelum menyentuhnya. recall saat kembali ke topik secara dingin dan butuh tahu posisi terakhir. Bila yang Anda inginkan justru melanjutkan satu chat spesifik, itu wilayah playbook session pickup yang dibahas di bagian [Mengerjakan](20-part-entry.md), bukan recall. Dalam playbook bug fix yang dibahas di bab [Playbook untuk mengerjakan tugas](22-ch-playbooks-work.md), how dipanggil atas subsistem terdampak dan why untuk riwayat regresinya.
