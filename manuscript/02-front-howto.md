# Cara menggunakan buku ini

pstack bekerja paling baik ketika Anda berhenti memanajemen agent terlalu rinci. Anda menjelaskan apa yang Anda inginkan dan bagaimana Anda tahu pekerjaan itu selesai. `/poteto-mode` memilih playbook, menjalankan skill lain saat langkah kerjanya membutuhkan, dan menunjukkan bukti hasil kerja kepada Anda. Buku ini mengajarkan kebiasaan tersebut melalui prompt yang realistis, mengikuti alur [panduan resmi pstack](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/docs/guide/README.md) pada versi sumber.

Alur baca buku ini mengikuti urutan berikut:

1. Siapkan pstack. Pasang plugin dan pilih model Anda. Dibahas di bab [Penyiapan dan penggunaan pertama](12-ch-setup.md).
2. Arahkan pekerjaan lewat `/poteto-mode`. Berikan satu tujuan dan biarkan ia memilih playbook. Dibahas di bagian [Titik masuk](20-part-entry.md).
3. Pahami kode. Gunakan `/how`, `/why`, `/teach`, dan `/recall` sebelum menyentuh kode apa pun. Dibahas di bagian [Memahami](30-part-understand.md).
4. Rancang perubahan. Gunakan `/architect`, `/arena`, `/swarm`, dan `/interrogate` sebelum kode terkunci pada satu bentuk. Dibahas di bagian [Merancang](40-part-design.md).
5. Bangun dan rapikan perubahan. Gunakan playbook pembangunan, `/tdd`, `/unslop`, dan `/no-comments`. Dibahas di bagian [Memperbaiki dan memverifikasi](50-part-fix.md) serta [Merapikan tulisan dan kode](60-part-clean.md).
6. Verifikasi dan terbitkan. Buktikan perilaku pada aplikasi yang sebenarnya, lalu buka pull request yang fokus dan dorong hingga merged. Dibahas di bab [Skill verifikasi](53-ch-verification.md).
7. Jalankan pekerjaan saat Anda tidur. Kontrak kerja semalaman, log keputusan yang bisa diaudit, dan playbook yang bekerja melebihi satu agent. Dibahas di bab [Menjalankan tugas semalaman](86-ch-overnight.md).
8. Arahkan agent dengan nama prinsip. Dua puluh tiga nama yang bisa mengalihkan arah agent di tengah tugas. Dibahas di bab [Skill prinsip](43-ch-principles.md).
9. Jadikan milik Anda. Mode Anda sendiri, plus cara menguji perubahan pada sebuah skill. Dibahas di bagian [Cara kerja pribadi dan utilitas](70-part-yours.md).
10. Resep dan jebakan. Prompt untuk disalin dan kesalahan yang sebaiknya dilewati. Dibahas di bab [Resep dan jebakan](87-ch-recipes.md).

Baca secara berurutan saat pertama kali. Setelah itu, setiap bagian bisa dibaca sendiri. Lampiran [Referensi cepat skill](91-app-quickref.md) dan [Bagan pemilihan skill](93-app-decision-flow.md) merangkum keseluruhan isi untuk rujukan singkat.

## Jika hanya satu hal yang Anda ingat

Beri agent sebuah tujuan dan cara memeriksainya, dengan kata-kata Anda sendiri:

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

Contoh di atas dikutip apa adanya dari panduan sumber. Anda tidak perlu menyebut nama playbook atau mendaftar skill. Frasa `repro first` dan hasil yang bisa diperiksa sudah cukup sebagai sinyal perutean bagi `/poteto-mode`. Ia mencocokkan tugas Anda dengan playbook Bug fix, menyalin langkah-langkahnya ke sebuah todo list, dan memanggil skill yang tepat saat tiap langkah berjalan.
