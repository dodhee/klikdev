---
title: "Cara Kirim Email Otomatis dari Google Sheets dengan Apps Script (Tanpa Add-on)"
description: "Tutorial lengkap kirim email otomatis dari Google Sheets pakai Google Apps Script: kode siap pakai, pasang trigger harian, batasan quota, dan tips anti email duplikat."
pubDatetime: 2026-10-02T02:00:00Z
author: "dody [mbah]"
tags: ["Google Apps Script", "Google Sheets", "Automation"]
featured: false
draft: false
---

# Cara Kirim Email Otomatis dari Google Sheets dengan Apps Script (Tanpa Add-on)

Kirim email otomatis dari Google Sheets itu jauh lebih gampang dari yang kamu kira. Kamu cuma butuh satu fungsi Google Apps Script yang membaca data dari sheet, lalu memanggil `MailApp.sendEmail()` untuk mengirimnya. Setelah itu pasang trigger supaya script jalan sendiri tiap hari — beres, nggak perlu disentuh lagi.

Jawaban singkatnya: buka **Extensions > Apps Script** dari spreadsheet kamu, tulis fungsi yang me-loop baris data dan memanggil `MailApp.sendEmail(penerima, subjek, isi)`, lalu tambahkan time-driven trigger supaya dia jalan otomatis. Seluruhnya gratis, tanpa add-on pihak ketiga.

## Kenapa Nggak Pakai Add-on Notifikasi Saja?

Jujur, mbah sudah coba beberapa add-on pengirim email otomatis. Polanya selalu sama: gratis di awal, lalu bayar bulanan, quota dibatasi, atau — yang paling bikin nggak nyaman — data kamu harus lewat server mereka. Kalau yang dikirim cuma reminder internal, kenapa harus lewat tangan orang lain?

Script sendiri punya tiga kelebihan yang add-on susah lawan: **gratis** (pakai quota Gmail yang memang sudah kamu punya), **datanya nggak ke mana-mana** (jalan di akun Google kamu sendiri), dan **kontrol penuh** (mau logikanya serumit apa pun, tinggal tulis). Kelemahannya cuma satu: kamu harus nulis kodenya sendiri. Makanya kamu baca artikel ini.

Use case yang paling sering mbah temuin di lapangan: pengingat jatuh tempo invoice ke pelanggan, notifikasi stok menipis ke tim gudang, ucapan ulang tahun pelanggan dari database, sampai ringkasan laporan harian yang dikirim ke email bos tiap jam 7 pagi. Polanya selalu sama — baca data dari sheet, kirim email. Kuasai satu pola ini, sisanya tinggal variasi.

## Siapkan Dulu Datanya

Sebelum sentuh kode, rapikan dulu struktur sheet-nya. Contoh paling umum: kolom A = Nama, kolom B = Email, kolom C = Tanggal jatuh tempo. Header di baris pertama, data mulai baris kedua.

Ada satu aturan yang nggak bisa ditawar: alamat email di sheet harus valid, satu baris satu email. Jangan ada cell yang isinya "menyusul" atau "tanya admin" — script nggak bisa membaca niat baik kamu. Data berantakan = email nyasar atau error. Luangkan lima menit buat bersihin data, hemat lima jam debugging.

## Kodenya

```javascript
function kirimPengingat() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tagihan");
  const data = sheet.getDataRange().getValues();

  data.slice(1).forEach((baris) => {
    const [nama, email, jatuhTempo] = baris;
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);

    if (jatuhTempo && email && jatuhTempo <= besok) {
      const subjek = `Pengingat: tagihan jatuh tempo besok, ${nama}`;
      const isi =
        `Halo ${nama},\n\n` +
        `Ini pengingat otomatis: tagihan Anda jatuh tempo besok ` +
        `(${jatuhTempo.toLocaleDateString("id-ID")}). ` +
        `Mohon segera diselesaikan ya.\n\nTerima kasih.`;
      MailApp.sendEmail(email, subjek, isi);
      Logger.log(`Terkirim ke ${email}`);
    }
  });
}
```

Logikanya sengaja dibikin simpel biar gampang kamu modifikasi. Mau kirim ucapan ulang tahun? Ganti kondisinya jadi bandingkan bulan dan tanggal lahir dengan hari ini. Mau kirim laporan ke satu orang saja? Keluarkan loop-nya, rangkum semua data jadi satu isi email. Mau kirim dengan attachment invoice PDF? `MailApp.sendEmail` mendukung parameter `attachments` — tinggal ambil file dari Google Drive dengan `DriveApp.getFileById()`.

Satu kebiasaan baik yang mbah selalu pakai: `Logger.log()` di setiap pengiriman. Kelihatannya sepele, tapi waktu ada yang komplain "kok saya nggak dapat email?", log ini yang menyelamatkan kamu dari tuduhan script-nya ngaco.

## Cara Bikin Dia Jalan Sendiri

Kode di atas masih harus di-klik manual. Supaya otomatis:

1. Di editor Apps Script, klik ikon jam (**Triggers**) di sidebar kiri.
2. Klik **Add Trigger**, pilih fungsi `kirimPengingat`, event source **Time-driven**, lalu atur misalnya tiap hari jam 7 pagi.
3. Waktu diminta izin akses, klik Allow. Itu normal — script kamu sendiri yang minta akses Gmail dan Spreadsheet.

Saran dari mbah yang sudah makan asam garam: **test dulu dengan tombol Run manual** dan cek log-nya sebelum pasang trigger. Pernah ada yang langsung pasang trigger tanpa test, ternyata logika tanggalnya salah, dan 500 email duplikat terkirim ke pelanggan dalam semalam. Jangan jadi orang itu. Test dengan 2-3 baris data dulu, pakai email kamu sendiri sebagai penerima.

## Bagaimana Kalau Datanya Berubah Setiap Saat?

Trigger harian cocok untuk pengingat terjadwal. Tapi kalau kebutuhanmu reaktif — misalnya kirim email begitu ada baris baru ditambahkan — pakai trigger **onEdit** atau **onChange**. Bedanya: onEdit jalan saat ada cell yang diubah manual, onChange juga menangkap perubahan dari formula atau form submission. Untuk notifikasi real-time dari Google Form yang masuk ke sheet, onChange adalah pilihan yang tepat.

Catatan penting: trigger installable (yang dipasang lewat menu Triggers) punya quota runtime sendiri dan jalan atas nama akun kamu. Kalau script-nya error, kamu akan dapat email notifikasi kegagalan — jangan diabaikan, itu alarm gratis.

## Batasan yang Perlu Kamu Tahu Sebelum Terlalu Semangat

Akun Gmail gratis dibatasi **100 email per hari** lewat Apps Script, akun Google Workspace **1.500 email per hari**. Buat pengingat operasional, itu lebih dari cukup. Tapi kalau kebutuhanmu blast promosi ke ribuan pelanggan, berhenti di sini — kamu butuh layanan email marketing beneran, bukan script rumahan.

Dan satu peringatan yang serius: jangan pakai script ini buat spam. Google mendeteksi pola pengiriman mencurigakan, dan akun yang kena suspend itu susah baliknya. Script ini dirancang untuk email operasional yang penerimanya memang menunggu — pengingat, notifikasi, laporan. Bukan untuk "promo diskon 90%!!!" ke 10.000 alamat.

## Kapan Waktunya Minta Tolong Profesional?

Selama skenarionya masih "baca sheet, kirim email", script DIY seperti di atas sudah cukup dan gampang dirawat. Tapi begitu kebutuhanmu merambat — kirim ke WhatsApp juga, gabung data dari lima sheet berbeda, butuh dashboard monitoring, atau error handling yang proper — script rumahan mulai berat dirawat. Di titik itu, biaya waktu kamu debug trigger jam 2 pagi sudah lebih mahal daripada bayar orang.

Kalau kamu sampai di titik itu, mbah ngerjain sistem otomasi yang kayak gini sebagai layanan done-for-you di [godev.biz.id](https://godev.biz.id). Kamu terima beres: sistem jalan, tim kamu dilatih, dan kamu nggak perlu buka editor Apps Script seumur hidup kalau nggak mau.

## Ringkasan

Buka Apps Script dari Google Sheets, tulis satu fungsi yang memakai `MailApp.sendEmail()`, test manual dengan data kecil, lalu pasang time-driven trigger supaya jalan otomatis tiap hari. Gratis, data tetap milikmu, dan nggak ada add-on pihak ketiga yang ikut campur.

## FAQ

**Apakah kirim email otomatis pakai Apps Script gratis?**
Ya. Kamu memakai quota Gmail yang memang sudah termasuk di akunmu: 100 email/hari untuk akun gratis, 1.500 email/hari untuk Google Workspace.

**Perlu install software apa pun?**
Tidak. Apps Script berjalan di browser lewat editor bawaan Google. Tidak ada instalasi, tidak ada server yang perlu dirawat.

**Bisa kirim email dengan lampiran?**
Bisa. `MailApp.sendEmail()` mendukung opsi `attachments`; file bisa diambil dari Google Drive dengan `DriveApp`.

**Bagaimana cara menghentikan email otomatisnya?**
Buka menu Triggers di editor Apps Script, lalu hapus trigger yang terpasang. Script-nya tetap ada, cuma tidak jalan otomatis lagi.

**Apakah aman memberikan izin akses Gmail ke script?**
Aman selama script-nya kamu tulis sendiri dan hanya kamu yang punya akses ke project Apps Script-nya. Jangan pernah menjalankan script kirim email dari sumber yang tidak kamu percaya.
