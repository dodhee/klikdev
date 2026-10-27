---
title: "Generate Gambar Otomatis dengan Nano Banana 2.1 via API: Kontrol Resolusi 1K, 2K, 4K"
description: "Tutorial lengkap generate gambar dengan Nano Banana 2.1 (gemini-nano-banana-2.1) via Gemini API: model ID baru, kontrol resolusi 1K/2K/4K, aspect ratio, plus contoh kode Apps Script untuk simpan hasil ke Google Drive."
pubDatetime: 2026-10-23T00:00:00Z
author: "dody [mbah]"
tags: ["Gemini AI", "Google Apps Script", "Image Generation", "API"]
draft: false
featured: false
---

Ya, kamu bisa generate gambar langsung lewat Gemini API pakai model `gemini-nano-banana-2.1`, dan kamu bisa mengatur resolusi output-nya: 1K, 2K, atau 4K. Caranya lewat endpoint `generateContent` dengan parameter `imageConfig.imageSize`. Hasil gambarnya dikembalikan sebagai base64 yang bisa langsung kamu simpan ke Google Drive dari Apps Script.

Mbah baru nyobain model ini kemarin, dan jujur — ini peningkatan yang berasa banget dibanding Nano Banana 2. Teks di dalam gambar akhirnya baca-able, wajah orang konsisten di beberapa kali edit, dan harganya malah turun separuh. Buat kamu yang selama ini bikin thumbnail, mockup, atau foto produk otomatis pakai API, ini wajib dicoba.

## Apa sih Nano Banana 2.1 itu?

Nano Banana 2.1 adalah model image generation terbaru Google (GA tanggal 6 Oktober 2026), dibangun di atas Gemini 3.6 Flash. Model ID di API-nya: `gemini-nano-banana-2.1`.

Yang baru dibanding pendahulunya:

- **Resolusi sampai 4K** — 1K default, bisa naik ke 2K atau 4K
- **15 aspect ratio**, termasuk yang super-lebar 4:1 dan 8:1 (cocok buat banner dan wallpaper)
- **Konsistensi karakter** sampai 4 karakter + 10 objek di beberapa putaran edit
- **Render teks lebih akurat** — infografis dan packaging text akhirnya waras
- **Sampai 14 gambar referensi** dalam satu request (multi-image fusion)
- Harga output **$30 per 1 juta token** — 1K sekitar $0,0336, 2K $0,0504, 4K $0,1134 per gambar

Satu catatan penting: Nano Banana 2 (model ID lama `gemini-3.1-flash-image`) dijadwalkan pensiun **29 Oktober 2026**. Kalau script lama kamu masih pakai model ID itu, ganti sekarang atau dia mati minggu depan.

## Persiapan: API key dan endpoint

Kamu butuh Gemini API key dari Google AI Studio (gratis ada tier-nya — mbah sudah bahas cara dapatnya [di artikel ini](/posts/cara-dapat-gemini-api-key-gratis)). Endpoint-nya:

```
https://generativelanguage.googleapis.com/v1beta/models/gemini-nano-banana-2.1:generateContent
```

Payload-nya pakai `generationConfig` dengan `responseModalities: ["IMAGE"]` dan `imageConfig` untuk resolusi dan aspect ratio. Ini bagian yang paling sering bikin orang salah: kalau `responseModalities` tidak di-set, model akan balas teks biasa.

## Kode Apps Script: generate gambar + simpan ke Drive

Ini fungsi lengkap yang bisa kamu tempel langsung. Dia kirim prompt, pilih resolusi, lalu simpan hasilnya ke Drive sebagai PNG.

```javascript
const GEMINI_API_KEY = 'AIzaSy...'; // pakai PropertiesService di produksi, ya

function generateImage(prompt, resolution, aspectRatio) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    'gemini-nano-banana-2.1:generateContent?key=' + GEMINI_API_KEY;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: {
        imageSize: resolution || '1K',   // '1K', '2K', atau '4K'
        aspectRatio: aspectRatio || '1:1' // '16:9', '4:1', '8:1', dst.
      }
    }
  };

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const data = JSON.parse(res.getContentText());
  const parts = data.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData) {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(part.inlineData.data),
        'image/png',
        'nano-banana-' + Date.now() + '.png'
      );
      const file = DriveApp.getFolderById('FOLDER_ID_KAMU').createFile(blob);
      return file.getUrl();
    }
  }
  throw new Error('Gagal: ' + res.getContentText().slice(0, 200));
}

// Contoh pakai:
function contoh() {
  const url = generateImage(
    'Foto produk botol kopi susu, background krem minimalis, cahaya studio lembut',
    '2K',
    '1:1'
  );
  Logger.log(url);
}
```

Catatan mbah dari pengalaman: jangan pernah hardcode API key di script. Pakai `PropertiesService.getScriptProperties().getProperty('GEMINI_KEY')`. Script kamu mungkin suatu hari di-share, dan key bocor itu urusannya panjang.

## Kapan pakai 1K, 2K, atau 4K?

Aturan jempol yang mbah pakai sendiri:

- **1K** — cukup untuk thumbnail blog, avatar, mockup cepat, dan prototyping. Termurah dan tercepat.
- **2K** — sweet spot buat foto produk katalog dan aset media sosial. Detailnya berasa, biayanya masih masuk akal ($0,0504/gambar).
- **4K** — buat print, banner besar, atau materi iklan yang butuh zoom. Mahal ($0,1134/gambar), jadi pakai seperlunya.

Tips hemat: generate dan iterasi pakai 1K dulu, baru render final di resolusi tinggi. Biaya per gambar boleh kecil, tapi kalau kamu iterasi 20x untuk satu aset, dompet API tetap nangis.

## Editing gambar: cukup kirim gambar + instruksi baru

Nano Banana 2.1 itu conversational — kamu bisa kirim gambar referensi (sampai 14 sekaligus, sebagai `inlineData` di `parts`) lalu kasih instruksi teks seperti "ganti warna bajunya jadi merah, yang lain jangan diubah". Model ini dirancang untuk mempertahankan identitas karakter dan komposisi di beberapa putaran edit. Buat workflow katalog produk yang butuh varian warna atau angle, ini menghemat waktu luar biasa dibanding generate ulang dari nol.

## FAQ singkat

**Apakah perlu akun berbayar untuk akses API-nya?**
Model ini tersedia di Gemini Developer API. Ada tier gratis dengan kuota terbatas — cukup buat nyoba dan volume kecil. Untuk produksi, pakai project berbayar.

**Apakah hasil gambar ada watermark?**
Ya, gambar yang dihasilkan membawa watermark SynthID Google (invisible). Jadi jangan dipakai untuk hal-hal yang butuh hasil "bersih" secara legal grey-area.

**Bisa dipakai untuk text-heavy design seperti infografis?**
Bisa, dan ini salah satu improvement besar 2.1. Tapi tetap dicek manual — model AI kadang masih typo di teks kecil. Mbah biasanya generate 2-3 varian lalu pilih yang teksnya paling benar.

## Penutup

Nano Banana 2.1 bikin pipeline generate gambar otomatis jauh lebih murah dan lebih bisa diandalkan: resolusi sampai 4K, karakter konsisten, harga turun separuh. Contoh di atas cukup buat kamu mulai — tempel di Apps Script, ganti folder ID, dan jalan.

Dan kalau kamu mikir, "ini keren, tapi saya nggak sempat ngodingnya sendiri" — persis di situlah [GoDev](https://godev.biz.id) masuk. Tim GoDev biasa membangunkan otomasi custom buat UMKM: dari katalog produk otomatis sampai sistem yang bikin materi promosi sendiri. Kamu fokus jualan, teknisnya biar mereka yang urus.
