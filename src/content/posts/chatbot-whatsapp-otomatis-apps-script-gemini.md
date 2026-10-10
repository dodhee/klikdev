---
title: "Bikin Chatbot WhatsApp Otomatis Pakai Apps Script + Gemini (Tanpa Server)"
description: "Tutorial chatbot WhatsApp otomatis: Google Apps Script jadi webhook handler untuk WhatsApp Cloud API, Gemini AI yang menjawab chat pelanggan, contoh auto-reply katalog, dan cara amankan token."
pubDatetime: 2026-10-06T02:00:00Z
author: "dody [mbah]"
tags: ["Google Apps Script", "Gemini AI", "WhatsApp", "Automation"]
featured: false
draft: false
---

# Bikin Chatbot WhatsApp Otomatis Pakai Apps Script + Gemini (Tanpa Server)

Bisa. Google Apps Script bisa jadi otak chatbot WhatsApp yang menjawab chat pelanggan otomatis pakai Gemini AI — tanpa server, tanpa VPS, tanpa bayar hosting. Kamu cuma butuh tiga komponen: WhatsApp Cloud API sebagai jalurnya, Apps Script sebagai webhook handler yang menerima pesan, dan Gemini API yang merumuskan jawabannya. Total biaya operasional: Rp 0 selama volume chat masih normal.

Arsitekturnya sederhana: pelanggan chat ke nomor WhatsApp Business kamu → WhatsApp Cloud API meneruskan pesan itu ke URL webhook Apps Script kamu → script meneruskan isi chat ke Gemini → jawaban Gemini dikirim balik ke pelanggan lewat Cloud API. Satu file script, dua fungsi utama (`doGet` untuk verifikasi webhook, `doPost` untuk menangani pesan masuk), selesai.

## Kenapa Pola Ini Menarik?

Mbah sudah lihat banyak implementasi bot WhatsApp: ada yang pakai library Node.js di VPS, ada yang pakai platform no-code berbayar, ada juga yang numpang di "jasa blast" entah siapa. Masalahnya selalu sama — entah mahal, entah ribet maintenance-nya, entah datanya lewat server orang yang nggak kamu kenal.

Pola Apps Script ini membalik ketiganya. **Gratis**: quota Apps Script dan Gemini free tier cukup untuk ratusan chat per hari. **Nggak ada server yang diurus**: nggak ada uptime monitoring, nggak ada SSH, nggak ada dependency yang basi. **Data jalan di akun kamu sendiri**: pesan diteruskan dari Meta ke script kamu, lalu ke Google AI Studio. Rantai custody-nya pendek dan jelas.

Batasan jujurnya: ini cocok untuk auto-reply cerdas (FAQ, katalog, booking sederhana), bukan untuk bot transaksi kompleks dengan state machine berlapis. Kalau butuh yang kedua, itu sudah ranah aplikasi beneran — dan justru itu yang jadi kerjaan mbah di GoDev. Tapi untuk 80% kebutuhan UMKM, bot "jawab otomatis + tahu konteks" sudah lebih dari cukup.

## Siapkan Dulu: WhatsApp Cloud API

Sebelum sentuh kode, kamu butuh akses ke WhatsApp Cloud API (gratis, dari Meta for Developers):

1. Buat aplikasi di [Meta for Developers](https://developers.facebook.com), tambahkan produk **WhatsApp**.
2. Catat **Phone Number ID**, **WhatsApp Business Account ID**, dan buat **Permanent Access Token**.
3. Daftar nomor test dulu (nomor HP kamu sendiri) supaya bisa coba-coba tanpa ganggu pelanggan.

Satu hal yang sering bikin orang stuck: webhook URL-nya harus HTTPS dan bisa diakses publik. URL hasil deploy Apps Script sebagai web app memenuhi syarat ini. Ingat juga, token akses itu rahasia — jangan taruh di kode, simpan di **Properties Service**.

## Webhook Handler-nya

Deploy script sebagai web app (Deploy > New deployment > Web app, execute as "Me", access "Anyone"). `doGet` dipakai Meta untuk verifikasi webhook — mereka mengirim `hub.verify_token` dan `hub.challenge`, kamu balas challenge-nya kalau tokennya cocok:

```javascript
function doGet(e) {
  const VERIFY_TOKEN = "rahasia-terserah-kamu";
  if (e.parameter["hub.verify_token"] === VERIFY_TOKEN) {
    return ContentService.createTextOutput(e.parameter["hub.challenge"]);
  }
  return ContentService.createTextOutput("bukan dari Meta");
}
```

Lalu `doPost` menerima payload pesan masuk. Struktur JSON-nya nested (entry → changes → value → messages), jadi hati-hati parsing-nya. Pesan teks ada di `messages[0].text.body`, nomor pengirim di `messages[0].from`:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const msg = data?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg || !msg.text) return ContentService.createTextOutput("ok");

  const jawaban = tanyaGemini(msg.text.body);
  kirimBalasanWA(msg.from, jawaban);
  return ContentService.createTextOutput("ok");
}
```

## Gemini yang Menjawab

Fungsi `tanyaGemini` memanggil Gemini API. Kuncinya ada di **system instruction**: di sinilah kamu "melatih" bot jadi CS toko kamu. Tulis persona, daftar produk, harga, dan aturan mainnya (misalnya: kalau ditanya yang nggak ada di katalog, suruh hubungi admin, jangan ngarang):

```javascript
function tanyaGemini(pesanPelanggan) {
  const props = PropertiesService.getScriptProperties();
  const key = props.getProperty("GEMINI_API_KEY");
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + key;

  const payload = {
    system_instruction: {
      parts: [{ text: "Kamu CS Warung Kopi Sederhana. Menu: Kopi Tubruk 10rb, Kopi Susu 15rb, Pisang Goreng 8rb. Jam buka 07.00-21.00. Jawab singkat, ramah, bahasa santai. Kalau tidak tahu, arahkan ke admin 0812-xxx." }]
    },
    contents: [{ parts: [{ text: pesanPelanggan }] }]
  };

  const res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
  const json = JSON.parse(res.getContentText());
  return json.candidates[0].content.parts[0].text;
}
```

Fungsi `kirimBalasanWA` tinggal POST ke `https://graph.facebook.com/v21.0/<PHONE_NUMBER_ID>/messages` dengan bearer token dari Properties Service. Polanya sama seperti di atas, jadi mbah nggak tulis ulang — intinya satu `UrlFetchApp.fetch` lagi.

## Contoh Nyata: Auto-Reply Katalog

Bayangkan warung kopi di atas. Pelanggan chat "menu apa aja yang buka jam 8 malam?" → Gemini baca system instruction → jawab: menu lengkap, jam buka sampai 21.00, tawari pesan. Pelanggan chat "kopi susu 2, pisang goreng 1, antar ke Jl. Mawar 5" → bot bisa merangkum order dan minta konfirmasi. Nggak ada kode khusus untuk tiap kasus — kecerdasan bahasanya datang dari Gemini, bukan dari if-else yang kamu tulis.

Yang perlu kamu tulis cuma "aturan main" di system instruction: format order, cara hitung total, kapan lempar ke manusia. Makin rapi instruksinya, makin jarang bot ngaco. Ini pelajaran paling mahal dari semua eksperimen bot yang pernah mbah coba: 90% kualitas bot ditentukan prompt-nya, bukan kodenya.

## Yang Perlu Diwaspadai

Tiga hal, biar nggak kaget di tengah jalan. Pertama, **quota**: Apps Script punya batas eksekusi harian; untuk chat ratusan per hari masih aman, tapi pasang logging sederhana ke sheet supaya kamu tahu kalau ada yang aneh. Kedua, **webhook Meta kadang kirim ulang** pesan yang sama — bikin dedup sederhana pakai ID pesan (simpan di CacheService 10 menit). Ketiga, **token Meta kedaluwarsa** kalau pakai temporary token; pakai permanent/system user token untuk produksi.

## Kapan Serahkan ke yang Ahli?

Kalau bot-nya cuma jawab FAQ dan terima order sederhana, pola di artikel ini cukup dan kamu bisa jalan sendiri. Tapi kalau kebutuhanmu sudah merambah ke integrasi stok real-time, rekap penjualan otomatis, atau multi-cabang — itu sudah bukan projek weekend lagi.

Nah, justru di sinilah funnel-nya: mbah dan tim di [GoDev](https://godev.biz.id) memang mengerjakan yang done-for-you — sistem otomasi usaha lengkap untuk UMKM, termasuk bot WhatsApp yang nyambung ke kasir dan stok. Kamu fokus jualan, biar mesinnya kami yang urus.

## Ringkasan

- WhatsApp Cloud API (gratis dari Meta) + Apps Script sebagai webhook + Gemini API sebagai otak = chatbot WhatsApp tanpa server.
- Kunci kualitas bot ada di system instruction, bukan di kerumitan kode.
- Simpan semua token di Properties Service, pasang dedup pesan, dan logging ke sheet.
- Cocok untuk auto-reply FAQ, katalog, dan order sederhana; untuk sistem terintegrasi penuh, pertimbangkan layanan done-for-you.

## FAQ

**Apakah benar-benar gratis?**
Ya, untuk volume wajar. WhatsApp Cloud API gratis untuk 1.000 percakapan/bulan (di atas itu ada tarif Meta per percakapan), Apps Script gratis dalam quota harian, dan Gemini API punya free tier yang longgar untuk chat teks.

**Apakah nomor WhatsApp biasa bisa dipakai?**
Tidak langsung. WhatsApp Cloud API butuh nomor yang didaftarkan sebagai WhatsApp Business dan dihubungkan ke Meta for Developers. Nomor yang sudah dipakai di aplikasi WA biasa harus dimigrasi dulu (dan tidak bisa dipakai di dua tempat sekaligus).

**Bagaimana kalau pelanggan tanya hal di luar katalog?**
Atur di system instruction: bot harus jujur bilang tidak tahu dan mengarahkan ke admin manusia. Jangan biarkan bot mengarang harga atau janji — itu sumber komplain nomor satu.
