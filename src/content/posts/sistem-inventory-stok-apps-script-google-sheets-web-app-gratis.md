---
title: "Bikin Sistem Inventory/Stok Lengkap Pakai Apps Script + Google Sheets (Web App Gratis, Bisa Scan Barcode)"
description: "Tutorial: bangun sistem inventory lengkap — barang masuk/keluar, stok real-time, scan barcode pakai kamera HP — sebagai web app Google Apps Script dengan Google Sheets sebagai database. Gratis, tanpa server."
pubDatetime: 2026-10-16T02:00:00Z
author: "dody [mbah]"
tags: ["Google Apps Script", "Google Sheets", "Inventory", "Web App", "Tutorial"]
featured: false
draft: false
---

# Bikin Sistem Inventory/Stok Lengkap Pakai Apps Script + Google Sheets (Web App Gratis, Bisa Scan Barcode)

Bisa, dan gratis — tanpa sewa server, tanpa beli software inventory. Kamu bikin web app sederhana pakai Google Apps Script, Google Sheets jadi databasenya, dan karyawannya cukup buka lewat HP: scan barcode barang, pilih "masuk" atau "keluar", stok langsung ter-update real-time. Mbah sudah pakai pola ini buat beberapa klien UMKM dan mereka kaget betapa murahnya jalan keluar dari Excel yang berantakan.

Ceritanya selalu sama. Toko atau gudang kecil, stok dicatat di buku tulis atau satu file Excel yang dipegang satu orang. Begitu orangnya cuti, berantakan. Beli software inventory beneran? Mahal, dan fiturnya kebanyakan. Nah, sebelum kamu buru-buru langganan aplikasi Rp 200 ribu/bulan, coba rakit sendiri dulu — pola dasarnya cuma tiga sheet dan satu halaman web.

## Kenapa Apps Script + Sheets Cocok Buat Inventory UMKM?

Jujur saja, ini bukan solusi untuk gudang raksasa dengan ribuan transaksi per jam. Tapi untuk toko, warung grosir, atau gudang kecil dengan puluhan sampai ratusan SKU dan puluhan transaksi sehari, kombinasi ini pas banget:

- **Gratis total.** Apps Script dan Sheets sudah termasuk di akun Google. Tidak ada biaya hosting, tidak ada lisensi.
- **Online by default.** Stok bisa dicek dari HP siapa pun yang dikasih akses, kapan pun. Gudang di Surabaya, owner lagi di Jakarta — tetap bisa pantau.
- **Familiar.** Pemilik usaha sudah kenal spreadsheet. Kalau web app-nya error suatu hari, datanya tetap aman dan bisa dibaca langsung di Sheets.
- **Cepat dibangun.** Pola dasarnya bisa jadi dalam 1–2 hari kerja, bukan berminggu-minggu.

## Arsitekturnya: Tiga Sheet + Satu Web App

Jangan over-engineering. Mbah pakai struktur minimal ini:

1. **Sheet `Barang`** — master data: SKU (kode barang), nama barang, stok saat ini, harga, dan kolom barcode. Satu baris = satu barang.
2. **Sheet `Transaksi`** — jurnal: tanggal, SKU, jenis (masuk/keluar), jumlah, siapa yang mencatat. Ini sumber kebenaran; stok di sheet Barang dihitung dari sini.
3. **Sheet `Pengguna`** — daftar email yang boleh login, buat kontrol akses sederhana.
4. **Web app (HTML + JavaScript)** — form yang dibuka dari HP: scan barcode → pilih masuk/keluar → jumlah → simpan. Data dikirim ke server via `google.script.run`.

Prinsip pentingnya: **jangan pernah edit stok manual di sheet Barang**. Semua perubahan stok harus lewat form, supaya jejak transaksinya tercatat. Kalau stok boleh diubah tangan, datanya tidak akan pernah bisa dipercaya.

## Langkah 1: Fungsi Server (Code.gs)

Backend-nya kecil. Ini kerangka yang mbah pakai:

```javascript
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Stok Gudang');
}

function simpanTransaksi(sku, jenis, qty) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // kunci dulu, biar dua orang catat bareng tidak tabrakan
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.getSheetByName('Transaksi')
      .appendRow([new Date(), sku, jenis, qty, Session.getActiveUser().getEmail()]);
    updateStok(ss, sku, jenis, qty);
    return 'ok';
  } finally {
    lock.releaseLock();
  }
}
```

`LockService` itu bukan pemanis — wajib. Tanpa kunci, kalau dua karyawan mencatat barang keluar dalam detik yang sama, salah satu catatannya bisa menimpa yang lain dan stokmu meleset tanpa jejak. Bug seperti ini baru ketahuan pas stock opname, dan rasanya tidak enak.

## Langkah 2: Form di HP (Index.html)

Frontend-nya form sederhana yang enak dipakai jempol:

```html
<form id="f">
  <input id="sku" placeholder="Scan / ketik SKU" autofocus>
  <input id="qty" type="number" placeholder="Jumlah">
  <button name="jenis" value="masuk">Barang Masuk</button>
  <button name="jenis" value="keluar">Barang Keluar</button>
</form>
<script>
  document.getElementById('f').addEventListener('submit', e => {
    e.preventDefault();
    const jenis = document.activeElement.value;
    google.script.run
      .withSuccessHandler(() => { sku.value = ''; qty.value = ''; sku.focus(); })
      .simpanTransaksi(sku.value, jenis, Number(qty.value));
  });
</script>
```

Setelah simpan sukses, form langsung reset dan fokus balik ke kolom SKU — detail kecil yang bikin pencatatan 50 barang beruntun tidak menyiksa.

## Langkah 3: Scan Barcode Pakai Kamera HP

Ini bagian yang bikin sistemnya terasa "beneran". Kamu tidak perlu beli scanner mahal: tambahkan library `html5-qrcode` dari CDN ke halaman HTML, dan kolom SKU bisa diisi otomatis dari hasil scan kamera HP. Barcode yang dipakai bisa yang sudah nempel di kemasan produk (biasanya EAN-13), atau kamu cetak sendiri label barcode dari kolom SKU pakai generator gratis.

Satu catatan dari pengalaman: scan kamera HP itu lumayan di ruangan terang, tapi payah di gudang yang remang-remang. Kalau gudangnya gelap, sediakan juga opsi ketik SKU manual — jangan paksa semua orang scan.

## Jebakan yang Harus Dihindari

- **Validasi di server, bukan cuma di form.** JavaScript di browser bisa diakali; fungsi `simpanTransaksi` harus menolak qty nol/negatif dan SKU yang tidak ada di master.
- **Jangan simpan API key atau password di kode.** Pakai Properties Service untuk kredensial apa pun.
- **Batasi akses web app.** Deploy dengan opsi "Execute as: Me" dan "Who has access" sesuai kebutuhan — untuk internal, batasi ke user dalam organisasi atau daftar email tertentu.
- **Backup berkala.** Bikin trigger mingguan yang meng-copy file spreadsheet ke folder backup di Drive. Gratis, dan menyelamatkanmu suatu hari nanti.

## Kapan Bikin Sendiri, Kapan Minta Dibikinkan?

Pola di atas cukup kalau kamu (atau tim IT-mu) nyaman ngoprek script dan butuh sistem yang jalan minggu ini juga. Tapi kalau kamu pemilik usahanya langsung — tidak punya waktu belajar coding, butuh yang langsung rapi termasuk training karyawan — bikin sendiri malah jadi proyek yang tidak selesai-selesai. Untuk kasus seperti itu, [GoDev](https://godev.biz.id) bikin sistem stok seperti ini sebagai layanan done-for-you: kamu terima beres, karyawan dilatih, datanya jalan. Prinsipnya sama seperti di artikel ini, cuma kamu tidak perlu begadang.

## Ringkasan

Sistem inventory tidak harus mahal. Dengan tiga sheet (Barang, Transaksi, Pengguna) dan satu web app Apps Script, kamu dapat pencatatan stok real-time yang bisa diakses dari HP, lengkap dengan scan barcode — semuanya gratis. Kuncinya ada di disiplin: semua perubahan stok lewat form, pakai LockService, dan validasi di server.

**FAQ singkat:**

**Apakah datanya aman kalau cuma di Google Sheets?**
Aman untuk skala UMKM — datanya di akun Google-mu sendiri, bukan di server pihak ketiga. Tambahkan backup mingguan otomatis dan batasi siapa yang bisa akses web app-nya.

**Berapa banyak barang yang bisa ditangani?**
Ratusan SKU dengan puluhan transaksi per hari berjalan lancar. Kalau sudah ribuan transaksi per hari, saatnya naik kelas ke database beneran.

**Bisa dipakai banyak cabang?**
Bisa, selama semua cabang online. Tapi kalau tiap cabang butuh stok terpisah, tambahkan kolom "lokasi/cabang" di sheet Transaksi sejak awal — jangan diakali belakangan.
