---
title: "Ngoding Apps Script Pakai Prompt: Cara Pakai Panel AI Gemini di Editor"
description: "Editor Apps Script sekarang punya panel AI Gemini: tulis kode dari prompt, ubah kode lewat diff, dan perbaiki error dari execution log tanpa pindah tab. Ini cara pakainya, plus batasan yang perlu kamu tahu."
pubDatetime: 2026-10-30T00:00:00Z
author: "dody [mbah]"
tags: ["Google Apps Script", "Gemini AI", "Tutorial"]
draft: false
featured: false
---

Jawaban singkatnya: ya, sekarang kamu bisa ngoding Apps Script pakai prompt langsung di dalam editornya. Google menambahkan panel AI Gemini di editor Apps Script — kamu ketik perintah dalam bahasa sehari-hari, Gemini menulis atau mengubah kodenya, dan kamu terima perubahannya lewat diff sebelum disimpan. Buat tugas-tugas standar seperti baca spreadsheet lalu kirim email, ini memangkas waktu dari setengah jam jadi beberapa menit.

Mbah sudah coba panel ini di beberapa script kecil, dan kesan pertama mbah begini: ini bukan sulap. Dia hebat untuk pekerjaan yang polanya sudah jelas, dan gampang ngawur kalau perintahmu kabur.

## Di mana letak panel AI Gemini di editor Apps Script?

Buka project Apps Script apa pun di script.google.com, lalu cari ikon Gemini (bintang empat) di sisi editor. Panel akan terbuka di samping kode, mirip panel samping di Google Docs. Kalau ikonnya belum muncul di akunmu, kemungkinan rollout-nya belum sampai — coba lagi beberapa hari kemudian, karena fitur ini dirilis bertahap.

Panel ini terhubung ke project yang sedang kamu buka: Gemini bisa melihat file `.gs` yang aktif dan mengusulkan edit langsung di sana. Kamu tidak perlu copy-paste kode bolak-balik ke chat AI lain.

## Cara minta Gemini menulis kode dari nol

Misalnya kamu mau script yang tiap pagi membaca sheet "Pesanan", lalu mengirim email rekap ke dirimu sendiri. Prompt yang mbah pakai kira-kira begini:

> Buatkan fungsi di file Code.gs yang membaca sheet bernama "Pesanan", mengambil baris dengan status "baru", lalu mengirim email rekap ke admin@contoh.com berisi daftar pesanan tersebut. Pakai SpreadsheetApp dan MailApp, dan beri komentar singkat di tiap langkah.

Hasilnya biasanya langsung jadi: fungsi lengkap dengan loop, filter status, dan penyusunan isi email. Yang mbah lakukan setelah itu ada tiga: baca kodenya baris per baris (jangan langsung percaya), ganti alamat email contoh dengan alamat asli, dan jalankan sekali dari editor untuk memastikan tidak ada error.

Satu kebiasaan yang mbah pegang teguh: jangan pernah menerima kode AI tanpa dibaca. Dia tidak tahu struktur sheet-mu yang sebenarnya, dan nama kolom yang salah satu huruf saja sudah cukup bikin script jalan tapi hasilnya kosong — bug paling menyebalkan karena tidak ada pesan error.

## Bagaimana cara mengubah kode lewat diff?

Ini fitur yang paling mbah suka. Kalau kodemu sudah ada dan kamu mau mengubah sebagian, sorot bagian itu (atau sebutkan nama fungsinya), lalu minta perubahan spesifik, misalnya:

> Ubah fungsi kirimRekap supaya hanya memproses pesanan dari 7 hari terakhir, dan tambahkan baris total omzet di akhir email.

Gemini akan menampilkan diff — baris lama dicoret, baris baru ditandai — dan kamu bisa terima atau tolak sebelum perubahan diterapkan. Ini jauh lebih aman daripada minta "tulis ulang seluruh file", karena bagian kode yang sudah terbukti jalan tidak ikut tersentuh.

Tips dari mbah: minta satu perubahan dalam satu prompt. Menumpuk tiga permintaan sekaligus bikin diff susah dibaca dan gampang ada yang lolos tanpa kamu sadari.

## Bisakah Gemini memperbaiki error dari execution log?

Bisa, dan ini penyelamat waktu yang nyata. Saat script-mu error, buka Execution log, salin pesan error beserta baris yang bermasalah, lalu tempel ke panel dengan konteks singkat, misalnya:

> Script ini error "TypeError: Cannot read properties of null (reading 'getRange')" di baris 12. Sheet "Pesanan" ada, tapi kenapa null? Perbaiki kodenya.

Dalam pengalaman mbah, Gemini biasanya langsung menunjuk penyebab paling umum: `getSheetByName` mengembalikan null karena nama sheet salah ketik, atau sheet yang dimaksud ada di spreadsheet lain. Dia lalu mengusulkan perbaikan plus pengecekan defensif seperti ini:

```javascript
const sheet = ss.getSheetByName("Pesanan");
if (!sheet) throw new Error("Sheet 'Pesanan' tidak ditemukan, cek nama sheet.");
```

Satu baris pengecekan seperti itu sepele, tapi menghemat waktu debugging berkali-kali lipat. Error yang tadinya samar ("cannot read properties of null") berubah jadi pesan yang langsung menyebut biang masalahnya.

## Apa saja batasan panel AI ini?

Tiga batasan yang perlu kamu tahu sebelum terlalu bergantung:

Pertama, Gemini tidak bisa mengetes logika bisnismu. Dia bisa memastikan kode jalan, tapi tidak tahu apakah "pesanan baru" menurutmu berarti status "baru" atau juga "menunggu konfirmasi". Keputusan seperti itu tetap harus datang darimu, dituangkan ke prompt yang jelas.

Kedua, kode yang dihasilkan cenderung generik. Untuk pola umum hasilnya bagus, tapi untuk logika yang aneh-aneh, misalnya aturan diskon bertingkat yang cuma berlaku di tokomu, hasilnya sering butuh dirombak manual. Di titik itu, menulis sendiri justru lebih cepat.

Ketiga, soal kuota dan privasi, perlakukan panel ini seperti layanan AI lain: jangan tempel API key, token, atau data pelanggan asli ke prompt. Pakai data contoh saat mencoba, ganti dengan data asli setelah kodenya terbukti jalan.

## Kapan pakai panel ini, kapan menulis manual?

Pakai panel AI untuk: boilerplate (fungsi baca sheet, kirim email, parsing tanggal), mengubah kode yang sudah ada dalam skala kecil, dan memahami pesan error yang membingungkan. Tulis manual untuk: logika bisnis yang spesifik, script yang menyentuh uang atau data sensitif, dan apa pun yang kamu belum paham cara kerjanya — karena kalau kamu tidak paham kodenya, kamu tidak bisa menilai apakah hasil AI-nya benar.

Mbah sendiri sekarang memakai pola campuran: panel AI untuk draf pertama, lalu mbah baca, rapikan, dan tambahkan pengecekan error sendiri. Kecepatan naik, tapi kendali tetap di tangan mbah. Menurut mbah, itu cara pakai yang paling sehat.

## FAQ singkat

**Apakah panel AI Gemini di Apps Script gratis?**
Selama masa rollout ini, panel tersedia di editor Apps Script tanpa biaya tambahan yang terpisah. Ketersediaannya bisa berbeda per akun karena dirilis bertahap.

**Apakah kode hasil AI aman langsung dipakai produksi?**
Jangan. Selalu baca, uji dengan data contoh, dan tambahkan pengecekan error sebelum dipakai di script yang jalan otomatis tiap hari.

**Apakah panel ini menggantikan belajar Apps Script?**
Tidak. Dia mempercepat orang yang sudah paham dasar, tapi akan menyesatkan kalau kamu tidak bisa membedakan kode benar dari kode yang sekadar kelihatan benar.

**Kalau panelnya belum muncul di akunku, bagaimana?**
Tunggu rollout sampai ke akunmu. Sementara itu, cara lama — minta draf kode ke Gemini di tab terpisah lalu tempel ke editor — tetap bekerja, hanya lebih repot.

Ringkasan: panel AI Gemini di editor Apps Script membuat tugas standar jauh lebih cepat — tulis kode dari prompt, ubah lewat diff, perbaiki error dari log — asal kamu tetap membaca hasilnya dan tidak menyerahkan logika bisnis ke AI. Coba di satu script kecil minggu ini, rasakan sendiri bedanya, dan kalau script itu ternyata berkembang jadi otomasi yang lebih besar, kamu bisa minta bantuan tim GoDev untuk merapikannya jadi sistem yang rapi di [godev.biz.id](https://godev.biz.id).
