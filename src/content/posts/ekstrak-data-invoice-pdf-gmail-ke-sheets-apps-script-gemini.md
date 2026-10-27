---
title: "Ekstrak Data Invoice PDF dari Gmail ke Google Sheets Pakai Apps Script + Gemini (Tanpa OCR Berbayar)"
description: "Tutorial lengkap: baca lampiran invoice PDF dari Gmail, ekstrak nomor invoice, tanggal, dan total pakai Gemini vision, lalu catat otomatis ke Google Sheets — semuanya gratis dengan Apps Script."
pubDatetime: 2026-10-13T02:00:00Z
author: "dody [mbah]"
tags: ["Google Apps Script", "Gemini AI", "Gmail", "Google Sheets", "Tutorial"]
featured: false
draft: false
---

# Ekstrak Data Invoice PDF dari Gmail ke Google Sheets Pakai Apps Script + Gemini (Tanpa OCR Berbayar)

Bisa, dan gratis — tanpa langganan OCR berbayar, tanpa server. Kamu sambungkan Gmail ke Google Apps Script, kirim file invoice PDF ke Gemini (dia bisa "melihat" isi PDF), lalu simpan hasilnya — nomor invoice, tanggal, nama vendor, total — rapi ke Google Sheets. Sekali jalan, setiap ada invoice masuk, data masuk sendiri ke spreadsheet.

Mbah nulis ini karena pola masalahnya selalu sama: tiap akhir bulan, inbox penuh invoice dan nota dari vendor, dan ada manusia (biasanya kamu) yang buka satu per satu, lalu ketik manual ke Excel. Membosankan, rawan salah ketik, dan sebetulnya bisa diotomasi dalam satu sore. Kuncinya cuma dua: Apps Script buat baca Gmail, Gemini buat baca isi PDF-nya. Yuk kita rakit.

## Cara Kerjanya: Tiga Langkah Besar

Arsitekturnya sederhana:

1. **Apps Script membaca inbox Gmail** lewat pencarian (`GmailApp.search`) — misalnya semua email dengan lampiran PDF dari kata kunci "invoice".
2. **Setiap lampiran PDF dikirim ke Gemini** (model Flash) dengan instruksi: "ekstrak nomor invoice, tanggal, vendor, dan total, kembalikan sebagai JSON".
3. **JSON-nya ditulis ke Google Sheets** sebagai satu baris per invoice.

Gemini di sini berperan sebagai "mata" yang membaca PDF. Beda dengan OCR klasik yang butuh template per vendor, Gemini ngerti konteks: invoice PT A dan invoice PT B beda layout pun tetap bisa dibaca, selama tulisannya bisa dibaca manusia.

## Langkah 1: Siapkan API Key dan Proyek

Kamu butuh Gemini API key (gratis, [panduan dapatnya sudah pernah mbah tulis](/posts/cara-dapat-gemini-api-key-gratis)). Simpan key-nya di Properties Service, jangan ditempel di kode:

```javascript
PropertiesService.getScriptProperties()
  .setProperty("GEMINI_KEY", "AIza...kunci-kamu");
```

Buat proyek Apps Script baru di `script.google.com`, lalu buat spreadsheet yang header kolomnya: `Tanggal Terima | Vendor | No. Invoice | Tanggal Invoice | Total`.

## Langkah 2: Baca Lampiran PDF dari Gmail

Fungsi ini mencari email invoice terbaru dan mengembalikan daftar file PDF-nya:

```javascript
function cariInvoicePDF() {
  const threads = GmailApp.search('has:attachment filename:pdf "invoice" newer_than:7d');
  const files = [];
  threads.forEach(t => t.getMessages().forEach(m => {
    m.getAttachments().forEach(a => {
      if (a.getContentType() === "application/pdf") files.push(a);
    });
  }));
  return files;
}
```

Sesuaikan query-nya dengan kebiasaan inbox kamu. Kalau invoice datang dari alamat tertentu, pakai `from:vendor@contoh.com` supaya lebih presisi dan tidak menangkap PDF yang bukan invoice.

## Langkah 3: Minta Gemini Mengekstrak Data

Ini jantungnya. PDF dikirim sebagai base64 ke endpoint `generateContent` dengan instruksi yang tegas — termasuk format JSON yang kita mau:

```javascript
function ekstrakInvoice(blob, apiKey) {
  const base64 = Utilities.base64Encode(blob.getBytes());
  const prompt = `Baca invoice PDF ini. Kembalikan HANYA JSON valid, tanpa markdown:
{"vendor":"","no_invoice":"","tanggal_invoice":"YYYY-MM-DD","total":0,"mata_uang":"IDR"}
Isi string kosong kalau tidak ditemukan. "total" dalam angka saja, tanpa titik/koma.`;
  const payload = {
    contents: [{ parts: [
      { inline_data: { mime_type: "application/pdf", data: base64 } },
      { text: prompt }
    ]}]
  };
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
  const res = UrlFetchApp.fetch(url, {
    method: "post", contentType: "application/json",
    payload: JSON.stringify(payload), muteHttpExceptions: true
  });
  const text = JSON.parse(res.getContentText())
    .candidates[0].content.parts[0].text.trim();
  return JSON.parse(text.replace(/```json|```/g, ""));
}
```

Tips dari pengalaman: paksa `HANYA JSON` di prompt. Model kadang iseng membungkus jawaban dengan penjelasan; satu baris perintah itu mengurangi kejadian "JSON-nya rusak" sampai nyaris nol. Model Flash juga cukup — jangan pakai Pro untuk kerjaan semacam ini, jatuhnya boros kuota.

## Langkah 4: Tulis ke Sheets (Anti-Duplikat)

Invoice yang sama sering dikirim dua kali (vendor follow-up, forward berantai). Kuncinya: cek dulu apakah nomor invoice sudah ada sebelum nulis baris baru.

```javascript
function simpanKeSheets(data, sheet) {
  const noInvoice = data.no_invoice;
  const kolom = sheet.getRange("C:C").getValues().flat();
  if (noInvoice && kolom.includes(noInvoice)) {
    Logger.log("Lewati duplikat: " + noInvoice);
    return;
  }
  sheet.appendRow([new Date(), data.vendor, noInvoice,
    data.tanggal_invoice, data.total]);
}
```

Lalu rangkai semuanya dalam satu fungsi utama, dan pasang *time-driven trigger* (menu Triggers → Add Trigger → jam yang kamu mau, misalnya tiap pagi jam 8) supaya jalan otomatis tiap hari.

## Jebakan yang Sering Kena

- **PDF hasil scan buram.** Gemini itu pintar, bukan dukun. Kalau scannya miring dan pecah, hasilnya ngaco. Untuk invoice digital (bukan scan) akurasinya tinggi banget.
- **Format tanggal vendor aneh-aneh.** Ada yang nulis "13/10/26", ada "13 Okt 2026". Instruksi `YYYY-MM-DD` di prompt menyelesaikan 90% kasus; sisanya ditangani dengan validasi ringan sebelum `appendRow`.
- **Batas ukuran file.** Jangan kirim PDF 50 halaman; kalau perlu, potong halaman pertama saja sebelum dikirim — invoice biasanya cuma 1–2 halaman.
- **Kuota gratis.** Ekstraksi satu invoice = satu request. Ratusan invoice per hari masih aman di free tier; kalau ribuan, saatnya baca [panduan hemat biaya Gemini API](/posts/) dan pertimbangkan tier berbayar.

## FAQ Singkat

**Apakah ini melanggar privasi data vendor?**
Tidak — data diproses di akun Google kamu sendiri, dan Google menyatakan data API tidak dipakai untuk melatih model. Tapi tetap bijak: jangan forward invoice berisi data sensitif ke layanan pihak ketiga yang tidak perlu.

**Bisa dipakai untuk nota belanja foto dari HP?**
Bisa, pola yang sama — cuma inputnya gambar, bukan PDF. Ganti `mime_type` jadi `image/jpeg`. Cocok buat kamu yang juga pengin rekap pengeluaran usaha kecil-kecilan.

**Format keluarannya harus JSON?**
Tidak harus, tapi JSON paling gampang diparse dan ditulis ke kolom Sheets. Format lain (CSV, teks bebas) bikin kode parsingnya lebih rapuh.

## Penutup: dari Invoice ke Sistem yang Lebih Besar

Begitu data invoice mengalir sendiri ke Sheets, langkah berikutnya biasanya muncul sendiri: pengingat jatuh tempo, rekap pengeluaran bulanan, sampai laporan yang dikirim otomatis ke WhatsApp tiap malam. Pola yang sama — baca dokumen, ekstrak dengan AI, catat rapi — bisa dipakai untuk nota, kwitansi, sampai bukti transfer.

Kalau kamu membangun ini untuk klien UMKM (atau usahamu sendiri) dan pengin naik kelas ke sistem yang lebih serius — rekap otomatis, stok tercatat, laporan siap audit — itu persis yang dikerjakan layanan done-for-you di [godev.biz.id](https://godev.biz.id). Script di atas gratis kamu pakai; kalau butuh yang tinggal pakai tanpa ngoprek, kamu tahu ke mana.
