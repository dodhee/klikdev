---
title: "Script Gemini 2.5 di Apps Script Error Sejak 18 September? Cara Migrasi ke Gemini 3.8 Flash"
description: "Gemini 2.5 dibatasi sejak 18 September 2026 dan script Apps Script yang masih pakai model lama mulai error. Panduan migrasi ke Gemini 3.8 Flash: update model ID, sesuaikan endpoint, dan cek kuota tier baru."
pubDatetime: 2026-10-20T02:00:00Z
author: "dody [mbah]"
tags: ["Google Apps Script", "Gemini API"]
featured: false
draft: false
---

Kalau script Apps Script kamu yang manggil Gemini API tiba-tiba error sejak pertengahan September 2026, kamu nggak sendirian — dan script kamu nggak rusak. Google membatasi model Gemini 2.5 mulai 18 September 2026, jadi semua kode yang hardcode `gemini-2.5-flash` atau `gemini-2.5-pro` perlu dimigrasi. Jalur resminya: pindah ke **Gemini 3.8 Flash**, yang sekarang jadi model default untuk tier gratis maupun berbayar. Kabar baiknya, migrasinya biasanya cuma soal ganti satu baris model ID — tapi ada beberapa jebakan kecil yang bikin orang stuck berjam-jam. Mbah tulis panduan ini biar kamu nggak ikut stuck.

## Kenapa script Gemini saya tiba-tiba error?

Gejalanya macam-macam, tergantung model dan tier akun kamu:

- `404 model not found` — model 2.5 sudah tidak tersedia untuk project kamu.
- `403` atau pesan kuota — tier gratis 2.5 dihentikan, akses dialihkan ke model baru.
- `429` yang muncul terus meski traffic kecil — rate limit model lama diketatkan.

Cara paling cepat memastikan: buka [Google AI Studio](https://aistudio.google.com), cek daftar model yang tersedia untuk API key kamu. Kalau `gemini-2.5-*` sudah hilang dari list, itu konfirmasinya. Jangan buang waktu debug logic script dulu — masalahnya di sisi model, bukan di kode kamu.

Satu catatan jujur dari mbah: saya sendiri kena ini di dua project klien minggu lalu. Script rekap laporan yang jalan mulus setahun lebih tiba-tiba 404 semua. Fix-nya? Lima menit per file, setelah tahu apa yang harus diganti.

## Apa bedanya Gemini 3.8 Flash dengan 2.5?

Buat pemakaian Apps Script sehari-hari (rangkum teks, ekstrak data, klasifikasi, generate konten pendek), 3.8 Flash itu pengganti yang sepadan — malah sedikit lebih kencang di benchmark internal Google. Tiga hal yang perlu kamu tahu:

1. **Nama model persisnya penting.** Jangan asal tulis `gemini-3.8-flash` dari ingatan. Cek nama resminya di dokumentasi atau di dropdown AI Studio, karena Google kadang menambahkan suffix versi (misal tanggal rilis). Salah satu karakter saja = 404.
2. **Perilaku output bisa sedikit beda.** Prompt yang dulu menghasilkan JSON rapi di 2.5 kadang perlu dipertegas lagi di 3.8 Flash ("jawab HANYA dengan JSON valid, tanpa penjelasan"). Test ulang prompt kritis kamu.
3. **Struktur harga berubah.** Ada tarif promo API Gemini 3 yang kabarnya naik sekitar 2x mulai Januari 2027. Kalau project kamu jalan di tier berbayar, catat tanggal ini dan hitung ulang budget kuota dari sekarang.

## Bagaimana cara migrasi di Apps Script?

Pola umumnya begini. Kode lama kamu kemungkinan mirip ini:

```javascript
function tanyaGemini(prompt) {
  const API_KEY = 'API_KEY_KAMU';
  const MODEL = 'gemini-2.5-flash'; // <-- model lama
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/'
    + MODEL + ':generateContent?key=' + API_KEY;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  return JSON.parse(res.getContentText());
}
```

Langkah migrasinya:

**1. Ganti konstanta model.** Ubah `'gemini-2.5-flash'` jadi nama model 3.8 Flash yang resmi (verifikasi di AI Studio). Kalau script kamu menyebar model ID di banyak fungsi, sekarang saat yang tepat untuk memindahkannya ke satu tempat — misal PropertiesService:

```javascript
const MODEL = PropertiesService.getScriptProperties()
  .getProperty('GEMINI_MODEL'); // 'gemini-3.8-flash' (cek nama resmi)
```

**2. Cek versi endpoint.** Pola `v1beta/models/...:generateContent` masih dipakai untuk model baru, tapi kalau kode kamu memakai endpoint lama atau beta khusus, samakan dengan dokumentasi terbaru. Jangan asumsi — buka docs-nya, copy contoh curl-nya, bandingkan.

**3. Periksa response parsing.** Struktur `candidates[0].content.parts[0].text` tidak berubah, tapi kalau kamu memakai fitur seperti `responseMimeType: 'application/json'` atau function calling, test satu per satu. Ini bagian yang paling sering bikin migrasi "kelihatannya sukses" padahal outputnya aneh.

**4. Test dengan prompt yang sama seperti di 2.5.** Bandingkan output lama vs baru untuk 5–10 kasus representatif. Kalau ada yang meleset, perbaiki prompt-nya dulu sebelum menyalahkan model.

**5. Update trigger dan dokumentasi.** Kalau script jalan via time-driven trigger (laporan harian, digest email), jalankan manual sekali setelah migrasi dan cek log eksekusinya. Update juga komentar di kode biar tiga bulan lagi kamu ingat kenapa model diganti.

## Bagaimana cara cek kuota tier yang baru?

Migrasi model tanpa cek kuota itu setengah kerja. Buka Google AI Studio → bagian API key / kuota, lalu:

- Pastikan project kamu terdaftar di tier yang benar (gratis vs berbayar). Batas rate 3.8 Flash beda dengan 2.5.
- Kalau script kamu batch processing (loop ratusan baris spreadsheet), tambahkan jeda antar request. Pola retry dengan exponential backoff yang pernah mbah bahas tetap relevan — malah makin penting di model baru yang rate limit-nya bisa berbeda.
- Untuk pemakaian produksi, pertimbangkan pasang alert sederhana: catat jumlah request per hari ke sheet terpisah, dan kirim email peringatan kalau mendekati 80% batas.

## Jebakan yang paling sering bikin orang stuck

Dari pengalaman bantu migrasi kemarin, tiga ini yang paling sering:

- **Cache nama model di banyak file.** Project Apps Script yang terdiri dari beberapa file `.gs` sering mengulang string model di tiap fungsi. Cari semua kemunculan `2.5` dengan Ctrl+F di editor.
- **Library atau template orang lain.** Kalau kamu pakai library Apps Script pihak ketiga yang wrap Gemini API, update library-nya dulu — atau fork dan patch sendiri.
- **Lupa redeploy web app.** Kalau script kamu jalan sebagai web app (`/exec`), ganti kode saja tidak cukup — harus **deploy ulang sebagai versi baru**, kalau tidak URL publiknya tetap menjalankan kode lama. Ini jebakan klasik, mbah pun pernah kena.

## FAQ singkat

**Apakah API key lama masih bisa dipakai?**
Bisa, selama key-nya masih aktif. Yang berubah modelnya, bukan key-nya. Tapi ini momen bagus untuk rotasi key kalau key lama sudah tersebar di banyak tempat.

**Apakah kode saya perlu ditulis ulang total?**
Hampir pasti tidak. Untuk 90% kasus (generateContent teks biasa), cukup ganti model ID dan verifikasi output. Tulis ulang hanya kalau kamu memakai fitur beta yang dihapus.

**Kapan harus migrasi?**
Kemarin. Model 2.5 sudah dibatasi sejak 18 September 2026 — setiap hari menunda artinya script produksi kamu error setiap hari.

---

Migrasi model AI itu bakal jadi rutinitas, bukan kejadian sekali. Google (dan vendor lain) akan terus mengganti model default tiap beberapa bulan. Pelajaran terbesar dari kejadian 18 September kemarin: **jangan hardcode nama model di sepuluh tempat berbeda**. Satu konstanta, satu sumber kebenaran, dan migrasi berikutnya cuma ganti satu baris.

Kalau kamu butuh sistem otomasi yang "tinggal pakai" tanpa pusing urusan migrasi model, API key, dan kuota — itu persis yang dikerjakan tim [GoDev](https://godev.biz.id): mereka yang urus teknisnya, kamu terima beres. Buat yang mau oprek sendiri, semua tutorial Apps Script + Gemini tetap gratis di blog ini. Selamat migrasi!
