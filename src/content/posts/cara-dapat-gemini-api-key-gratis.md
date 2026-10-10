---
title: "Cara Dapat Gemini API Key Gratis di Google AI Studio (Panduan untuk Pemula)"
description: "Panduan lengkap cara mendapatkan Gemini API key gratis lewat Google AI Studio: tanpa kartu kredit, step-by-step untuk pemula, plus cara menyimpannya dengan aman di Google Apps Script pakai Properties Service."
pubDatetime: 2026-10-09T02:00:00Z
author: "dody [mbah]"
tags: ["Gemini AI", "Google Apps Script", "API", "Tutorial"]
featured: false
draft: false
---

# Cara Dapat Gemini API Key Gratis di Google AI Studio (Panduan untuk Pemula)

Bisa, dan gratis — tanpa kartu kredit, tanpa trial berbayar, tanpa syarat macam-macam. Kamu cukup punya akun Google, buka Google AI Studio, klik "Get API key", dan dalam hitungan menit sudah bisa memanggil Gemini dari kode kamu sendiri. Kuota gratisnya lumayan longgar untuk kebutuhan belajar, eksperimen, dan proyek kecil.

Mbah sering dapat pertanyaan ini dari developer yang baru kenal Gemini API: "Beneran gratis, mbah? Nggak tiba-tiba ketagihan billing?" Tenang. Google memisahkan jalur gratis (AI Studio) dan jalur berbayar (Vertex AI / Gemini for Google Cloud) secara jelas. Selama kamu memakai key dari AI Studio untuk pemakaian wajar, dompetmu aman. Artikel ini membahas langkahnya satu per satu, khusus untuk pemula yang belum pernah pegang API key sebelumnya.

## Apa Itu Gemini API Key, dan Kenapa Kamu Butuh?

API key adalah "kunci identitas" yang kamu sertakan di setiap permintaan ke Gemini, supaya Google tahu siapa yang memakai dan membatasi pemakaiannya sesuai kuota kamu. Tanpa key, request kamu akan ditolak.

Key ini yang bikin kamu bisa membangun fitur AI di aplikasi sendiri: meringkas dokumen, menjawab pertanyaan dari data kamu, menganalisis teks, sampai OCR nota belanja. Dan kabar baiknya, untuk Gemini key-nya gratis — beda dengan kebanyakan provider AI lain yang langsung minta kartu kredit sejak daftar.

## Syaratnya Cuma Satu: Akun Google

Tidak ada formulir pendaftaran panjang. Tidak perlu nomor telepon verifikasi khusus, tidak perlu masukkan metode pembayaran. Cukup:

1. **Akun Google biasa** (Gmail yang kamu pakai sehari-hari).
2. **Browser** dan koneksi internet.

Itu saja. Kalau kamu sudah login ke Gmail, kamu sudah 90% jalan.

## Langkah-Langkah Mendapatkan Gemini API Key

### 1. Buka Google AI Studio

Ketik `aistudio.google.com` di browser, atau cari "Google AI Studio" di Google. Login dengan akun Google kamu. Kamu akan melihat dashboard AI Studio dengan beberapa menu di sidebar kiri.

### 2. Klik "Get API key"

Di sudut kiri bawah atau di menu navigasi, ada tombol **"Get API key"**. Klik. Kamu akan diarahkan ke halaman daftar API key milikmu (masih kosong kalau ini pertama kali).

### 3. Buat Key Baru

Klik **"Create API key"**. Google akan menawarkan membuat proyek Google Cloud baru secara otomatis ("Create API key in new project") atau memakai proyek yang sudah ada. Untuk pemula, pilih **opsi proyek baru** — paling gampang, tidak perlu pusing dengan konsol Google Cloud.

Dalam beberapa detik, key baru muncul: string panjang yang diawali `AIza...`. Klik tombol copy di sebelahnya.

### 4. Simpan Key di Tempat yang Aman

Langkah ini yang paling sering disepelekan pemula. API key itu seperti kata sandi: siapa pun yang memegangnya bisa memakai kuotamu. Jangan pernah:

- Menempel key langsung di kode yang kamu bagikan atau upload ke GitHub.
- Mengirim key lewat screenshot di grup publik.
- Menaruh key di file JavaScript frontend yang bisa dibaca siapa pun.

Nanti di bawah mbah kasih cara menyimpan key dengan benar di Google Apps Script.

## Batas Kuota Gratis: Seberapa Longgar?

Kuota gratis Gemini (free tier) berubah-ubah mengikuti kebijakan Google, tapi pola umumnya: ada batas jumlah request per menit dan per hari, tergantung model yang dipakai (model ringan seperti Flash biasanya dapat jatah lebih besar dibanding model Pro yang lebih pintar).

Untuk gambaran praktis:

- **Belajar dan eksperimen:** lebih dari cukup. Kamu bisa trial-error ratusan kali sehari tanpa menyentuh batas.
- **Proyek pribadi kecil** (bot pribadi, otomasi untuk diri sendiri): umumnya masih aman.
- **Aplikasi produksi dengan banyak pengguna:** di sinilah kamu perlu mempertimbangkan pindah ke tier berbayar atau mengoptimalkan request (cache, batasi frekuensi).

Kalau kamu kena batas (HTTP 429), itu bukan error fatal — cukup kurangi frekuensi request atau tunggu beberapa saat.

## Cara Pakai Key di Google Apps Script (Tanpa Hardcode!)

Ini bagian yang paling penting. Banyak tutorial di luar sana yang menempel key langsung di kode — tolong jangan ditiru. Di Apps Script ada **Properties Service**, brankas bawaan untuk menyimpan data rahasia seperti API key.

Simpan dulu key-nya sekali (jalan kan fungsi ini, lalu hapus atau biarkan — yang penting key tidak tertulis di kode utama):

```javascript
function simpanApiKey() {
  PropertiesService.getScriptProperties()
    .setProperty('GEMINI_API_KEY', 'AIza...tempel-key-kamu-di-sini...');
}
```

Setelah tersimpan, kode utama kamu cukup mengambilnya seperti ini:

```javascript
function tanyaGemini(pertanyaan) {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=' + key;

  const payload = {
    contents: [{ parts: [{ text: pertanyaan }] }]
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const data = JSON.parse(response.getContentText());
  return data.candidates[0].content.parts[0].text;
}
```

Sekarang script kamu bersih dari key. Mau share kode ke teman atau push ke GitHub? Aman, karena key tersimpan di properti script milikmu, bukan di file kode.

## Error yang Sering Dialami Pemula

**"API key not valid"** — biasanya salah copy (ada spasi di ujung) atau key sudah dihapus dari dashboard. Buat ulang saja.

**"Permission denied / project not found"** — proyek Cloud yang dipilih saat membuat key bermasalah. Buat key baru dengan opsi proyek baru.

**429 Resource exhausted** — kena batas kuota. Tunggu, kurangi frekuensi, atau pertimbangkan upgrade kalau memang butuh.

**Key bocor ke publik?** Jangan panik. Buka halaman API key di AI Studio, hapus key yang bocor, buat yang baru, update di Properties Service. Beres dalam dua menit.

## Ringkasan & FAQ Singkat

**Apakah Gemini API key benar-benar gratis?** Ya. Google AI Studio memberikan API key gratis tanpa kartu kredit, dengan kuota harian yang cukup untuk belajar, eksperimen, dan proyek kecil.

**Perlu kartu kredit untuk daftar?** Tidak.

**Di mana key-nya disimpan kalau pakai Apps Script?** Di `PropertiesService.getScriptProperties()` — bukan di dalam kode.

**Apa bedanya AI Studio dan Vertex AI?** AI Studio adalah jalur gratis/sederhana untuk developer dan eksperimen; Vertex AI adalah jalur enterprise lewat Google Cloud dengan billing. Pemula mulai dari AI Studio.

**Kapan harus bayar?** Ketika kebutuhan request-mu konsisten melebihi kuota gratis, atau butuh SLA dan fitur enterprise.

---

Punya key tapi bingung mau dipakai buat apa dulu? Mulai dari yang paling dekat dengan kebutuhanmu: klasifikasi email masuk, ringkas dokumen, atau auto-reply chat. Kalau kamu developer yang dikejar demand klien UMKM — misalnya disuruh bikin chatbot WhatsApp atau sistem rekap otomatis — pola kodenya sama seperti contoh di atas, cuma "bungkusnya" yang beda.

Dan kalau kamu justru *pemilik usaha* yang tidak mau ribet ngoprek API dan kuota, tim GoDev bikin sistemnya untukmu — kamu tinggal pakai. Lihat layanannya di [godev.biz.id](https://godev.biz.id).
