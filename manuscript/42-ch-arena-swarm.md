# arena dan swarm

Bab ini membedah dua skill untuk kerja paralel yang kontraknya berbeda: [skill arena](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/arena/SKILL.md) mengeluarkan N kandidat atas tugas yang sama, membaca semuanya, memilih basis, lalu meng-graft bagian terbaik dari yang kalah; [skill swarm](https://github.com/cursor/plugins/blob/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack/skills/swarm/SKILL.md) menyebarkan N pekerja ke irisan independen, mengurasnya, dan mengembalikan satu laporan. Panduan pstack menegaskan pembedanya: arena dipakai saat satu percobaan pada artefak non-trivial akan mengunci bentuk yang salah, swarm saat pekerjaannya cakupan atau perlombaan dengan aturan seleksi yang dideklarasikan di muka, tanpa upacara pemilihan basis dan grafting milik arena. Keduanya menandai `disable-model-invocation: true`, jadi aktif lewat panggilan eksplisit seperti `/arena`, "throw it in the arena", `/swarm`, atau "swarm this".

## arena: N kandidat, satu sintesis

Contoh pemakaiannya dari panduan:

```text
/arena take my prompt to the arena verbatim. i want to compare their proposals with yours.
```

Sebelum meluncurkan apa pun, skill membuka todolist dengan satu entri per fase: Frame, Fan out, Cross-judge, Pick, Graft, Verify.

### Fase A: Frame

Karena tiap kandidat menerima prompt yang sama, prompt itulah kontraknya. Langkahnya:

1. Nyatakan artefak yang diproduksi tiap kandidat.
2. Turunkan rubrik: tetapkan seperti apa keberhasilan untuk tugas ini, lalu jadikan tiga sampai enam kriteria konkret yang bisa dinilai. Rubrik adalah alat pemilih di Fase D; kandidat hanya melihat tugasnya.
3. Pilih runner dari baris `arena runners` di `~/.cursor/rules/pstack-models.mdc`. Bila rule atau barisnya tidak ada, bawaannya satu kursi masing-masing pada `claude-opus-5-5-max`, `gpt-5.6-sol-max`, `grok-4.7-xhigh-fast`. Entri `auto` atau `inherit-parent` berarti model induk, jadi field `model` dihilangkan. Bila Task tool menolak entri yang dikonfigurasi, jalankan kursi itu pada bawaan keluarganya dan katakan hal itu. Keluarga mengikuti prefiksnya: `claude-*`, `gpt-*`, `grok-*`; tanpa kecocokan keluarga pakai `claude-opus-5-5-max`, dan bila bawaannya juga ditolak, pakai slug valid terdekat sekeluarga dari pesan errornya. Spawn lebih banyak bila arena mencakup beberapa arah desain; model sama N kali bila pekerjaannya dibatasi generasi, bukan sensitif penilaian.
4. Tetapkan path keluaran: tiap kandidat menulis ke lokasinya sendiri, git worktree bila memungkinkan, selain itu `/tmp/arena-<slug>/candidate-<n>/`.

### Fase B: Fan out

Semua N subagent di-spawn dalam satu pesan dengan `run_in_background: true`, masing-masing dengan tugas, path ke grounding bersama, path keluarannya sendiri, dan instruksi menghasilkan artefak plus rationale singkat. Rationale tiap kandidat menamakan alternatif yang dipertimbangkannya dan apa yang ditolaknya. Bila satu kandidat gagal menghasilkan keluaran, lanjut dengan N-1 dan catat kemundurannya di catatan sintesis.

### Fase C: Cross-judge

Setelah semua kandidat selesai, satu model dipilih dari baris `arena cross-judge pool` di rule `pstack-models.mdc`; bila tidak ada, pilih dari `claude-opus-5-5-max`, `gpt-5.6-sol-max`, `grok-4.7-xhigh-fast`, lebih diutamakan keluarga model yang berbeda dari induk. Satu subagent judge readonly di-spawn pada model itu. Ia melihat rubrik dan kandidat berdasarkan label path, menilai tiap kriteria, dan merekomendasikan basis dengan alasan. Ia berjalan paralel dengan pembacaan induk di Fase D, bukan dengan kandidatnya; jangan meng-spawn judge selagi kandidat masih menulis.

### Fase D: Pick

Baca tiap kandidat dari awal sampai akhir sebelum memilih, lalu nilai tiap kandidat kriteria demi kriteria menurut rubrik, bukan atas kesan keseluruhan. Bandingkan dengan cross-judge: kesepakatan soal basis menguatkan pilihan, ketidaksepakatan berarti salah satu pihak bias atau rubriknya ambigu, jadi baca rationale keduanya sebelum memutuskan. Basis dipilih atas kandidat yang paling mudah diperluas maintainer berikutnya tanpa melanggar invariant; bila dua kandidat seri, pilih batas yang lebih bersih atau API yang lebih kecil, menurut Laziness Protocol. Pilihan dan alasannya dicatat dalam catatan sintesis singkat di samping artefak basis, termasuk vonis cross-judge.

### Fase E: Graft

Jalanilah tiap kandidat yang kalah sekali lagi dan tentukan apa yang layak dipindahkan ke basis. Sinyalnya biasanya satu atau dua hal per kandidat, bukan sebagian besar isinya. Tiap graft dilipat dengan tangan menurut prinsip redesign-from-first-principles, bukan ditempel mekanis; hasilnya harus tetap koheren di bawah satu model mental. Catat apa yang digraft, dari kandidat mana, dan apa yang ditolak beserta alasannya. Saat N kandidat konvergen pada bentuk yang sama, itu sinyal kesepakatan yang kuat: catat konvergensinya dan kirim bentuk konsensusnya, tanpa graft. Saat kandidat saling menjauh liar, berarti Fase A kurang spesifik; bingkai ulang dan jalankan lagi alih-alih merata-ratakan perbedaannya.

### Fase F: Verify

Artefak tersintesis harus tahan di bawah tinjauan yang sama seperti keluaran lain, menurut prinsip prove-it-works. Bila verifikasi menemukan masalah yang tidak ditangkap arena, berarti Fase A salah, bingkai ulang dan jalankan lagi, atau satu kandidat menangkapnya dan graft-nya terlewat, kembali ke Fase E. Jangan ditutup-tutupi.

Keluaran arena: satu artefak tersintesis plus satu catatan sintesis singkat yang menamakan basis, graft beserta kandidat sumbernya, penolakan, kemunduran bila ada, dan hasil verifikasi.

## swarm: N pekerja, satu laporan

Contoh pemakaiannya dari panduan:

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

Skill ini menyebarkan N pekerja cloud paralel. Mereka bisa menjangkau irisan terpisah, berlomba pada brief identik, atau mencampur keduanya; induknya menunggu, mengagregasi, dan mengembalikan satu laporan. Sebelum meluncurkan apa pun, todolist dibuka dengan fase: Frame, Fan out, Aggregate, Report.

### Fase A: Frame

1. Nyatakan predikat selesai dan artefak atau laporan yang harus dikembalikan swarm.
2. Pilih bentuknya: partisi menjadi irisan, lomba N pekerja pada brief identik, atau campuran. Untuk bentuk lomba atau campuran, deklarasikan `first pass`, `rank all`, atau `best-of` sebelum meng-spawn.
3. Tetapkan N dari pengguna atau diturunkan dari bentuknya; N adalah total pekerja, bukan batas konkurensi cloud.
4. Pilih model pekerja dari baris `swarm workers` di `~/.cursor/rules/pstack-models.mdc`; bila tidak ada, pakai `grok-4.7-xhigh-fast`. Untuk `auto` atau `inherit-parent`, hilangkan `model` agar pekerja berjalan pada model induk. Bila Task tool menolak sebuah slug, pakai bawaannya dan katakan hal itu; bila bawaannya ditolak, pakai slug valid terdekat sekeluarga dari pesan errornya. Untuk lomba model, namai model tiap arm di muka.
5. Beri tiap pekerja keluaran tulisnya sendiri bila ia menulis. Saat pekerja memverifikasi atau mengukur commit, brief tiap pekerja menamakan SHA persisnya; brief pengukuran juga menamakan metodenya (jumlah sampel, apa itu satu sampel, urutan), dan pekerja mencatat keduanya di hasilnya.

### Fase B: Fan out

Semua N pekerja di-spawn dalam satu pesan dengan `subagent_type: generalPurpose`, `environment: "cloud"`, `run_in_background: true`, dan model langkah 4. `environment: "local"` hanya dipakai bila pekerja butuh akses ke sesuatu di komputer pengguna. Bila seorang pekerja harus mulai dari branch non-bawaan yang sudah dipush, lewatkan `cloud_base_branch`.

Tiap brief berdiri sendiri: tujuan, scope, irisan persis atau arm lomba, cara memverifikasi, dan apa yang dilaporkan. Laporan memakai `PASS`, `ISSUES`, atau `BLOCKED` dengan bukti. Pekerja yang bisa membuktikan sebuah defect melaporkan `ISSUES` dan mendaftar semua issue yang bisa dibuktikannya, bukan hanya yang pertama. Bila seorang pekerja gagal, lanjut dengan N-1 dan catat.

### Fase C: Aggregate

Baca hasil terminalnya. Buang hasil yang tidak mencatat SHA dan metode yang diminta briefnya, lalu jalankan ulang pekerja itu sekali; setelah kegagalan kedua, catat sebagai gap, dan gap tidak dihitung lolos. Untuk cakupan, tiap irisan wajib punya hasil. Untuk lomba, terapkan aturan seleksi yang dideklarasikan di muka: first pass, rank all, atau best-of. Dump mentah pekerja tidak ditempel; simpan tabel hasil ringkas, issue satu baris berbukti, serta gap atau kemunduran yang eksplisit.

### Fase D: Report

Satu laporan gabungan dikembalikan di dalam chat, berisi tabel, issue satu baris, gap atau kemunduran, dan aturan lomba bila dipakai.

## Memilih antara keduanya

Pembedanya ada pada kontrak, bukan pada jumlah pekerjanya. Arena memberi tiap pekerja brief desain atau kode yang sama, lalu memilih basis dan meng-graft bagian terbaiknya; hasil akhirnya satu artefak tersintesis dengan catatan keputusan. Swarm mengurus cakupan: tiap pekerja menggarap irisannya sendiri dengan pemeriksaannya sendiri, perlombaan dijalankan dengan aturan seleksi yang sudah diumumkan, dan hasil akhirnya satu laporan agregat. Panduan memberi contoh kalibrasinya pada jumlah kandidat: minta lebih banyak bila keputusannya mahal untuk diubah, lebih sedikit bila tidak.

```text
/arena this, 5 candidates. the cache key format is expensive to change later.
```
