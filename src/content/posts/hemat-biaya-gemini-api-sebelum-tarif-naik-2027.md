---
title: "Hemat Biaya Gemini API Sebelum Tarif Naik 2x Lipat 1 Januari 2027: Jurus Routing, Batch & Caching"
description: "Tarif promo Gemini Flash naik 2x lipat mulai 1 Januari 2027. Ini jurus hemat biaya Gemini API yang langsung bisa dipakai di Apps Script: routing model, Batch API 50% lebih murah, dan caching input."
pubDatetime: 2026-10-27T00:00:00Z
author: "dody [mbah]"
tags: ["Gemini AI", "Google Apps Script", "API", "Biaya"]
draft: false
featured: false
---

Jawaban singkatnya: ya, tagihan Gemini API-mu hampir pasti naik 2x lipat mulai 1 Januari 2027 kalau kamu tidak mengubah apa-apa. Tarif promo Gemini 3.8 dan 3.6 Flash sebesar $0,75 per 1 juta token input dan $3,75 per 1 juta token output berakhir 31 Desember 2026, lalu naik jadi $1,50 dan $7,50. Kabar baiknya, tiga jurus — routing model, Batch API, dan caching — bisa memangkas tagihanmu 50% atau lebih, dan semuanya bisa diterapkan minggu ini juga.

Mbah menulis ini dari pengalaman: beberapa script mbah yang jalan tiap hari sempat bikin tagihan merangkak naik diam-diam. Bukan karena satu request mahal, tapi karena ribuan request kecil yang masing-masing "cuma" pakai model paling besar. Begitu tugas ringan dipindah ke Flash, tagihannya langsung turun terasa.

## Berapa sebenarnya kenaikan tarifnya?

Biar tidak kaget di tagihan Januari, ini angka yang perlu kamu catat. Semua tarif di bawah ini per 1 juta token, dan mbah kutip dari pengumuman tarif promo Google:

- **Gemini 3.8 / 3.6 Flash:** sekarang $0,75 (input) / $3,75 (output). Mulai 1 Januari 2027: $1,50 / $7,50. Naik tepat 2x lipat.
- **Gemini 4 Argon (flagship baru, rilis 13 Oktober 2026):** tarif promo $2 / $10 sampai 30 November 2026, lalu naik jadi $4 / $20 mulai 1 Desember 2026. Jadi kalau kamu baru mau coba Argon, jendela murahnya lebih pendek: cuma sampai akhir November.
- **Batch API:** 50% lebih murah dari tarif standar untuk model yang sama, dengan imbalan prosesnya tidak real-time (biasanya selesai dalam hitungan jam).

Contohnya: script yang memproses 10 juta token input dan 2 juta token output per bulan pakai Flash sekarang biayanya $15 per bulan — mulai Januari jadi $30 untuk volume yang sama persis. Dengan kurs ilustrasi Rp16.000 per dolar, itu dari Rp240 ribu jadi Rp480 ribu per bulan, tanpa fitur baru sama sekali.

## Jurus 1: routing — jangan pakai meriam untuk bunuh nyamuk

Ini jurus paling besar dampaknya dan paling gampang diterapkan. Prinsipnya sederhana: tidak semua tugas butuh model paling pintar. Bagi tugasmu jadi tiga kelas:

- **Tugas ringan → Flash.** Klasifikasi, ekstrak field dari teks, rangkum pendek, ubah format data. Ini porsi terbesar di kebanyakan script, dan Flash sudah lebih dari cukup.
- **Tugas sedang → Flash dengan prompt yang bagus.** Sering kali jawaban yang "kurang pintar" itu bukan salah model, tapi salah prompt. Coba perbaiki instruksi dan beri contoh dulu sebelum naik kelas model.
- **Tugas sulit saja → Pro atau Argon.** Penalaran berantai yang panjang, dokumen sangat kompleks, atau keputusan yang risikonya tinggi. Ini seharusnya minoritas request-mu.

Di Apps Script, routing bisa sesederhana fungsi pemilih model seperti ini:

```javascript
function pilihModel(tugas) {
  if (tugas.tingkat === 'sulit') return 'gemini-3-pro-preview';
  return 'gemini-3.8-flash'; // default: yang murah dulu
}

function panggilGemini(prompt, tugas) {
  const model = pilihModel(tugas);
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/'
    + model + ':generateContent?key=' + API_KEY;
  // ... kirim prompt seperti biasa
}
```

Kuncinya: jadikan Flash sebagai default, bukan pengecualian. Model mahal harus "diminta" secara eksplisit oleh tugas yang memang sulit.

## Jurus 2: Batch API untuk pekerjaan yang tidak buru-buru

Banyak pekerjaan Apps Script sebenarnya tidak butuh jawaban detik itu juga: rangkuman harian, olah data semalam, klasifikasi ribuan baris, sampai evaluasi berkala. Untuk semua itu, Batch API adalah diskon 50% yang tinggal diambil.

Caranya: kamu kirim banyak request sekaligus sebagai satu batch, lalu Google memprosesnya saat kapasitas longgar dan mengembalikan hasilnya belakangan. Di Apps Script, pola praktisnya adalah menulis daftar request ke file JSONL di Drive, mengirim batch itu, lalu mengambil hasilnya dengan trigger terjadwal. Memang ada langkah ekstra dibanding `generateContent` biasa, tapi untuk volume besar, potongan setengah harga itu sulit ditolak.

Aturan praktis mbah: kalau hasilnya baru dibutuhkan besok pagi, masukkan ke batch. Kalau user sedang menunggu di depan layar, pakai request biasa.

## Jurus 3: caching dan jangan kirim ulang apa yang sudah kamu tahu

Pemborosan yang paling tidak terasa adalah mengirim konteks yang sama berulang-ulang. Misalnya script yang setiap request menyertakan instruksi sistem sepanjang 5.000 token, atau dokumen referensi yang sama untuk 200 baris data. Token itu ditagih setiap kali, padahal isinya tidak berubah.

Dua perbaikan yang langsung terasa:

1. **Cache hasil per baris.** Sebelum memanggil API, cek dulu: apakah baris ini sudah pernah diproses? Simpan hasilnya di sheet atau PropertiesService dengan kunci dari hash input. Data yang tidak berubah tidak perlu diproses dua kali — ini juga menyelamatkanmu saat script ke-trigger ulang karena error.
2. **Pendekkan prompt yang berulang.** Instruksi sistem yang panjang bisa dipangkas jadi versi ringkas tanpa kehilangan kualitas, atau — untuk kasus yang didukung — memakai context caching agar konteks besar itu tidak ditagih penuh di setiap request. Uji dulu di tugasmu: sering kali prompt 500 token menghasilkan jawaban yang sama bagusnya dengan prompt 3.000 token.

## Rencana hemat sebelum tenggat 31 Desember

Supaya tidak mepet, ini urutannya:

1. **Minggu ini:** cek dashboard pemakaianmu — model apa yang paling banyak dipakai, dan berapa persen request yang sebenarnya tugas ringan.
2. **Dua minggu ke depan:** terapkan routing dan cache hasil. Dua ini tidak mengubah arsitektur, cuma mengubah default dan menambah pengecekan.
3. **Sebelum akhir November:** kalau penasaran dengan Argon, coba sekarang selagi tarif promonya $2/$10 masih jalan — tapi jangan pindahkan beban produksi ke sana tanpa menghitung tarif Desembernya ($4/$20).
4. **Sebelum akhir Desember:** pindahkan pekerjaan tidak mendesak ke Batch API, lalu ukur lagi. Target realistis: tagihan Januari tidak lebih besar dari tagihan November, meski tarifnya naik 2x lipat.

## FAQ singkat

**Batch API cocok untuk chatbot real-time?**
Tidak. Batch untuk pekerjaan terjadwal dan tidak mendesak. Chatbot yang ditunggu user tetap pakai request biasa — hematnya ambil dari routing dan prompt yang lebih pendek.

**Mana yang paling dulu dikerjakan kalau waktu mepet?**
Routing. Satu perubahan default model sering mengalahkan gabungan optimasi kecil lainnya, dan pengerjaannya cuma hitungan menit.

Intinya: kenaikan tarif Januari itu pasti, tapi tagihanmu naik atau tidak itu pilihan. Model yang tepat untuk tugas yang tepat, batch untuk yang tidak buru-buru, dan berhenti membayar token yang sama dua kali — tiga hal itu saja sudah cukup membuat Januari terasa sama murahnya dengan November.

Buat kamu yang butuh script-script ini langsung jadi tanpa utak-atik sendiri, tim GoDev di godev.biz.id bisa bantu buatkan sistem otomasi yang sudah dioptimasi dari awal — jadi kamu tidak perlu pusing mikir routing dan caching sendiri.
