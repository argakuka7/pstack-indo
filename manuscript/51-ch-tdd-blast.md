# TDD dan blast radius

Dua skill di bab ini bekerja di dua sisi perbaikan yang berbeda. [tdd](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/tdd/SKILL.md) mengunci bug menjadi eksekusi yang bisa dijalankan sebelum kode produksi diubah. [blast radius](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/blast-radius/SKILL.md) mencari apa yang dipecahkan sebuah perubahan di tempat lain sebelum perubahan itu dikirim. Keduanya aktif lewat panggilan eksplisit: frontmatter keduanya menandai `disable-model-invocation: true`. Panduan pstack merangkum batas keduanya dalam satu kalimat: jangan memaksakan tes di tempat perintah sungguhan adalah bukti yang lebih kuat.

## tdd: tes yang gagal lebih dulu

Saat memperbaiki bug dengan jalur tes yang jelas dan murah, skill tdd membuat perilaku yang rusak itu dapat dieksekusi sebelum kode produksi diubah. Sasarannya satu tes-regresi terfokus yang gagal sebelum perbaikan dan lulus sesudahnya. Deskripsi frontmatter-nya membatasi pemakaiannya: hanya saat pengguna secara eksplisit meminta TDD, failing test, atau regression test, atau saat bug punya target tes lokal yang jelas dan murah. Skill ini dilewati saat jalur tesnya tidak jelas, mahal, berat sisi integrasi, atau tidak diminta.

Tes tidak dipaksakan saat tidak praktis. Bila tes yang tersedia menuntut penyiapan harness yang luas, mock yang rapuh, infrastruktur end-to-end yang lambat, state khusus produksi, langkah reproduksi yang samar, atau perubahan fixture besar yang tidak berhubungan, skill melewatkan tes baru dan memakai verifikasi terdekat yang berguna. Dari panduan pstack, pemakaiannya bisa sesederhana dua kata karena konteksnya sudah membawa bugnya:

```text
/tdd implement
```

Alur kerjanya enam langkah:

1. Pahami bugnya. Identifikasi perilaku yang diharapkan, perilaku saat ini, jalur yang terdampak, dan reproduksi teramati yang terkecil.
2. Pilih pemeriksaan eksekusi yang paling sempit. Utamakan tes unit, komponen, integrasi, atau regresi terdekat yang sudah dipakai untuk jalur kode itu. Bila tidak ada jalur tes praktis yang jelas, jangan membuatnya dari nol hanya demi memenuhi alur.
3. Tulis tes yang gagal lebih dulu. Tambahkan tes terfokus terkecil yang akan menangkap bug itu. Tes harus mengodekan perilaku yang diharapkan, bukan meniru implementasi saat ini.
4. Jalankan tes baru sebelum memperbaiki. Pastikan ia gagal karena alasan yang benar. Bila lulus atau gagal karena alasan lain, perbaiki tes atau reproduksinya sebelum menyentuh implementasi.
5. Perbaiki bugnya. Buat perubahan produksi terkecil yang memenuhi perilaku yang diharapkan dengan menjaga kontrak di sekitarnya.
6. Jalankan ulang tes-regresi. Pastikan tes kini lulus.

Bila tes yang gagal tidak praktis, skill memakai pemeriksaan regresi eksekusi terdekat: script terarah, perintah reproduksi manual, otomasi browser, perbandingan snapshot, assertion log, atau pemeriksaan integrasi terfokus. Prinsipnya tegas: lebih baik tanpa tes baru daripada tes yang buruk. Tes yang buruk adalah yang sebagian besar menguji mock, mengodekan detail implementasi saat ini, bergantung pada timing atau state global yang tidak berhubungan, butuh infrastruktur mahal untuk perbaikan kecil, atau akan langsung dihapus setelah membuktikan perbaikannya.

Guardrail-nya menjaga disiplin itu:

- Jangan mengubah tes hanya agar cocok dengan implementasi yang salah.
- Jangan melemahkan assertion yang ada kecuali perilaku yang diharapkan benar-benar berubah dan alasannya jelas.
- Jaga tes-regresi tetap terfokus pada bug. Hindari perubahan fixture luas atau perluasan cakupan yang tidak berhubungan.
- Bila bugnya flaky, buat tesnya deterministik bila bisa dan dokumentasikan sinyal yang dikunci.
- Bila bug membuka kelas kegagalan yang lebih luas, daratkan dulu jalur regresi terfokusnya, baru pertimbangkan cakupan tambahan untuk saudaranya.

Balasan akhirnya melaporkan bukti, bukan sekadar hasil: namai tes atau pemeriksaan eksekusi yang gagal duluan beserta kegagalannya, namai run tes yang lulus setelahnya beserta validasi di sekitarnya, dan bila bukti gagal-duluan tidak bisa didemonstrasikan, katakan alasannya dan deskripsikan pemeriksaan regresi terdekat yang dipakai.

## blast radius: apa yang pecah di tempat lain

Skill blast radius mencari apa yang dipecahkan sebuah perubahan di tempat lain, sebelum dikirim. Pakai untuk "blast radius of X", "what could this break", atau saat meninjau diff kecil yang belum dipercaya. Ia adalah pendamping skill how dan why yang sudah dibahas di bab [how](31-ch-how.md) dan [why](32-ch-why.md): how memberi tahu apa yang kode lakukan, why memberi tahu mengapa bentuknya begitu, blast radius memberi tahu apa yang dipecahkannya di tempat lain.

Mendaftar pemanggil bukanlah pekerjaannya; agent bisa men-grep-nya dalam sedetik. Pekerjaannya adalah kerusakan yang tidak akan ditunjukkan grep.

### Tulisan yang meyakinkan bukan bukti

Laporan blast radius yang terdengar benar tidak bernilai apa-apa: ia terbaca meyakinkan baik isinya benar maupun tidak. Karena itu skill tidak menyerahkan laporan itu begitu saja. Ia mencari satu-dua fakta yang seluruh kesimpulannya bergantung padanya, lalu membuktikannya dengan menjalankan kode.

Untuk tiap fakta yang keselamatan perubahan bergantung padanya, dorong seturun mungkin di tangga berikut ini sepanjang murah, dan katakan sampai anak tangga mana ia berhenti:

1. Anda bilang begitu. Tidak bernilai apa-apa sendirian.
2. Anda menunjuk barisnya. `file:line` yang nyata, atau sumber pustakanya sendiri.
3. Anda menunjukkan kasus buruknya mustahil terjadi. Kegagalan ditelusuri langkah demi langkah dan tidak sampai ke sana.
4. Anda menjalankannya. Script atau tes yang memanggil kode sungguhan dan gagal nyaring bila Anda keliru.
5. Anda mereproduksinya di aplikasi yang berjalan.

Anak tangga keempat biasanya cukup satu script kecil yang mengimpor pustaka yang sama dengan yang dikirim aplikasi dan memanggil fungsi persis yang Anda khawatirkan.

### Langkah-langkahnya

1. Baca perubahannya. Diff, simbol yang ditambah, diubah, dan dihapus, apa yang kini dilakukan secara berbeda, termasuk bagian yang tidak dijabarkan diff. Gunakan langkah 2 skill why untuk menarik PR dan commit-nya.
2. Temukan satu fakta keselamatannya. Sebagian besar perubahan yang tampak berisiko aman karena satu fakta tunggal, misalnya "pemanggilan ini hanya membuang entri cache yang sudah mati dan tidak melakukan hal lain". Temukan fakta itu; bila ia berdiri, sebagian besar kasus berisiko hilang sekaligus. Habiskan waktu di sini, bukan di daftar panjang kemungkinan.
3. Lihat ke tempat grep berhenti. Baca sumber pustaka yang dipanggil, periksa versi yang dipatok dan patch lokalnya. Pikirkan kapan sesuatu berjalan: microtask, unmount dan teardown, Solid versus React. Ikuti yang luput dari pencarian simbol: JSON yang dikembalikan API, kolom basis data, format wire, bahasa lain yang membaca byte yang sama, feature flag, kode tiga lompatan di hilir.
4. Jujur pada tiap risiko. Beri peluang terjadi yang realistis dan biaya yang realistis bila terjadi. Simpan risiko yang terkonfirmasi. Daftar yang diperiksa dan bersih dipisahkan. Aturannya sama dengan why: sitasi `file:line` yang nyata, pencarian yang tidak menemukan apa-apa tetaplah jawaban, dan jangan pernah mengarang pemanggil atau API.
5. Buktikan satu fakta itu. Tulis script atau tes yang menjalankan kode sungguhan, jalankan, dan tempelkan hasilnya.
6. Untuk perubahan besar atau luas, jalankan sebagai arena. Tanyakan hal yang sama ke beberapa model dan gabungkan jawabannya; model berbeda menangkap bug nyata yang berbeda. Mode kerja arena dibahas di bab [arena dan swarm](42-ch-arena-swarm.md).

### Yang diserahkan kembali

Laporan akhirnya berisi lima bagian. Apa yang dilakukannya: apa yang berubah, termasuk bagian yang tidak terlihat. Satu fakta keselamatannya: dinyatakan, disertai anak tangga bukti yang dicapainya, plus buktinya; bila tidak terbukti, ditulis unproven. Risiko: tiap risiko menamai cara pecahnya, `file:line`, seberapa mungkin dan seberapa buruk, dan cara memeriksanya, dengan bukti ditempel untuk yang penting. Cleared: yang diperiksa dan mengapa aman. Sebelum merge: tes atau reproduksi termurah yang menangkap bug nyatanya, termasuk script yang ditulis.

Laporan ditulis menurut skill unslop, menyitasi kode nyata, dan bagian privat dibersihkan sebelum pergi ke mana pun yang publik. Balasannya adalah laporan itu dengan satu fakta keselamatan yang sudah terbukti atau bertanda unproven.
