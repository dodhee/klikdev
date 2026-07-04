# Contoh Produk Lengkap dengan Anotasi

**File ini adalah breakdown dari produk real dengan penjelasan setiap bagian**

---

## 📋 Frontmatter Section

```yaml
---
title: "Google Sheets Automation Engine"
# ☝️ Nama produk yang SEO-friendly
# Tips: Gunakan kata kunci yang dicari orang ("automation", "template", "tool")

description: "50+ template Google Sheets siap pakai untuk otomasi bisnis UMKM. Deploy dalam 5 menit tanpa coding."
# ☝️ Deskripsi untuk SEO dan social media share
# Rumus: [Angka/Benefit] + [Target Audience] + [Unique Selling Point]
# Max 160 karakter

harga: 299000
# ☝️ Angka saja, tanpa titik/koma/Rp
# Sistem akan auto-format jadi "Rp 299.000"

linkBeli: "https://shopee.co.id/klikdev/sheets-automation"
# ☝️ Link langsung ke checkout/product page
# Bisa Shopee, Tokopedia, Trakteer, atau landing page sendiri

linkDfy: "https://godev.id/dfy?product=sheets-automation"
# ☝️ Link ke layanan Done-For-You (custom development)
# Kosongkan dengan "" jika tidak ada

stack: ["Google Apps Script", "Google Sheets", "Gmail API", "Google Drive API"]
# ☝️ Array teknologi yang dipakai
# Tips: Maksimal 5 item, urutkan dari yang paling penting
# Format: ["Tech 1", "Tech 2", "Tech 3"]

waktuDeploy: "5 menit"
# ☝️ Estimasi realistis untuk setup pertama kali
# Format bebas: "5 menit", "< 1 jam", "30-45 menit"

kategori: "Google Apps Script"
# ☝️ PENTING: Harus salah satu dari 3 pilihan ini (case-sensitive):
# - "Google Apps Script"
# - "AI Prompt"
# - "Automation"

thumbnail: /src/images/produk/google-sheets-automation.jpg
# ☝️ Path ke gambar thumbnail
# Aturan:
# - Harus ada di folder src/images/produk/
# - Format: JPG atau PNG
# - Ukuran ideal: 1600x900px (16:9 ratio)
# - Max 200KB sebelum optimization

featured: true
# ☝️ true = tampil di homepage sebagai featured
# Tips: Maksimal 3-4 produk featured sekaligus

draft: false
# ☝️ false = live/public, true = hidden (masih draft)

pubDatetime: 2026-06-01T10:00:00Z
# ☝️ Tanggal publish pertama kali
# Format: YYYY-MM-DDTHH:MM:SSZ (ISO 8601 + UTC)
# Gunakan tanggal hari ini jika produk baru

modDatetime: 2026-07-04T10:30:00Z
# ☝️ Tanggal terakhir diupdate
# Auto-update saat edit, atau manual jika pakai CMS
---
```

---

## 📝 Content Section

### Opening Paragraph

```markdown
## Apa itu Google Sheets Automation Engine?

Google Sheets Automation Engine adalah toolkit lengkap berisi 50+ template siap pakai untuk mengotomasi workflow bisnis UMKM. Dengan template ini, Anda bisa mengotomasi task repetitif seperti data entry, reporting, dan notifikasi email—semuanya tanpa perlu coding. Deploy dalam 5 menit, hemat 10+ jam kerja per minggu.
```

**Breakdown:**
- Kalimat 1: Definisi singkat (apa ini?)
- Kalimat 2: Benefit utama (apa yang bisa dilakukan?)
- Kalimat 3: Unique selling point (kenapa beli ini?)

**Rumus:**
```
[Nama Produk] adalah [kategori] yang [value proposition].
Dengan [produk], Anda bisa [benefit 1], [benefit 2], dan [benefit 3].
[Call-to-action atau social proof].
```

---

### Problem Statement

```markdown
## Masalah yang Diselesaikan

Sebagai pemilik UMKM atau freelancer, Anda mungkin mengalami:

- **Manual data entry berulang**: Copy-paste data dari form ke spreadsheet setiap hari memakan 2-3 jam
- **Human error**: Salah input atau lupa update data menyebabkan keputusan bisnis yang salah
- **Tidak ada notifikasi real-time**: Telat tahu ada order baru atau stok habis karena harus cek manual
- **Report manual setiap minggu**: Bikin laporan sales/inventory manual di Excel, kirim email satu-satu
```

**Breakdown:**
- Format: Bullet points dengan **bold** di pain point
- Isi: Spesifik dan relatable (angka, situasi real)
- Jumlah: 3-5 pain points
- Tone: Empati ("Anda mungkin mengalami")

**Tips:**
- Jangan generic ("bisnis tidak efisien")
- Gunakan angka konkret ("2-3 jam", "10+ spreadsheet")
- Gunakan skenario real yang dialami target audience

---

### Features Section

```markdown
## Fitur Utama

Berikut fitur-fitur yang Anda dapatkan:

### 1. Auto Import dari Google Forms

Setiap kali ada submission baru di Google Forms, data otomatis masuk ke Sheets tanpa delay. Tidak perlu refresh manual atau setup trigger yang ribet.

**Use case**: Form order, pendaftaran event, feedback customer

### 2. Email Notification Otomatis

Kirim email notifikasi ke Anda atau tim saat ada kondisi tertentu (stok <10, order baru, deadline approaching). Template email bisa dikustomisasi.

**Use case**: Alert stok, reminder follow-up, notifikasi payment

### 3. Scheduled Reporting

Generate laporan (sales, inventory, attendance) secara otomatis setiap hari/minggu/bulan. Laporan dikirim via email dalam format PDF atau langsung di Sheet.

**Use case**: Daily sales report, weekly inventory summary, monthly payroll

### 4. Data Validation & Auto-Format

Otomatis validate input data (email valid, nomor HP format Indonesia, tanggal tidak boleh masa lalu). Auto-format angka, currency, dan date sesuai standar.

**Use case**: Prevent human error, konsistensi data, cleaner spreadsheet

### 5. Integration dengan Google Drive

Otomatis backup spreadsheet ke Drive, atau generate dokumen (invoice, surat) dari template berdasarkan data di Sheets.

**Use case**: Auto-backup, generate invoice PDF, create report document
```

**Breakdown struktur per fitur:**

```markdown
### [Nomor]. [Nama Fitur yang Jelas]

[Penjelasan 2-3 kalimat: apa yang dilakukan fitur ini dan bagaimana cara kerjanya]

**Use case**: [3-4 contoh penggunaan real, pisahkan dengan koma]
```

**Tips:**
- Heading fitur: Gunakan benefit, bukan technical term
  - ✅ "Auto Import dari Google Forms"
  - ❌ "Form Submission Trigger Handler"
- Penjelasan: Fokus ke "apa yang bisa dilakukan", bukan "bagaimana cara kerja teknisnya"
- Use case: Konkret dan relatable ke target audience
- Bold: Gunakan untuk highlight kata kunci penting

---

### Target Audience

```markdown
## Siapa yang Cocok?

Produk ini ideal untuk:

- ✅ **UMKM dengan 5-50 karyawan**: Butuh automation tapi budget terbatas untuk software enterprise
- ✅ **Freelancer/Agency**: Manage multiple clients dengan spreadsheet terpisah, butuh consistency
- ✅ **Admin/HR**: Otomasi attendance tracking, payroll calculation, employee database
- ✅ **Sales/Marketing**: Auto-generate lead report, track campaign performance, CRM sederhana

### Tidak cocok untuk:

- ❌ **Perusahaan enterprise (500+ karyawan)**: Butuh solution yang lebih robust dengan SLA dan dedicated support
- ❌ **Yang butuh real-time sync (<1 detik)**: Google Apps Script ada delay 1-5 menit untuk trigger
- ❌ **Integrasi dengan database SQL**: Produk ini fokus ke Google ecosystem, tidak support MySQL/PostgreSQL
```

**Breakdown:**

**Cocok untuk (Positive framing):**
- Format: ✅ + **[Segmen]** + penjelasan kenapa cocok
- Jumlah: 3-5 segmen
- Fokus: Pain point + solution fit

**Tidak cocok untuk (Negative framing):**
- Format: ❌ + **[Segmen]** + alasan kenapa tidak cocok
- Jumlah: 2-3 segmen
- Tujuan: Set expectation, filter leads yang tidak qualified

**Kenapa perlu section "Tidak cocok"?**
- Prevent refund/komplain dari customer yang salah ekspektasi
- Positioning yang jelas ("untuk UMKM", bukan "untuk semua orang")
- Increase perceived value ("produk ini spesialis X, bukan generalis")

---

### Technical Stack (Optional)

```markdown
## Stack Teknologi

Produk ini dibangun dengan teknologi resmi Google:

- **Google Apps Script**: Bahasa pemrograman JavaScript untuk automasi Google Workspace. 100% gratis, tidak butuh server external.
- **Google Sheets API**: Akses dan manipulasi data spreadsheet secara programmatic. Support 10 juta cell per spreadsheet.
- **Gmail API**: Kirim email dengan custom template. Quota: 100 email/hari untuk akun gratis, 1500/hari untuk Workspace.
- **Google Drive API**: Backup otomatis, generate PDF dari template, manage file permissions.

Semua teknologi ini **built-in** di Google Workspace Anda. Tidak perlu install software, tidak butuh server, tidak ada biaya langganan.
```

**Kapan pakai section ini:**
- ✅ Produk technical (automation, script, API)
- ✅ Target audience ada yang technical/developer
- ❌ Produk non-technical (prompt library, template Notion)

**Tips:**
- Jelaskan dalam bahasa awam (bukan jargon)
- Highlight benefit ("gratis", "tidak butuh server")
- Tambahkan limitation jika ada ("quota 100 email/hari")

---

### How It Works

```markdown
## Cara Kerja

### Step 1: Copy Template

Buka link template yang disediakan, klik "Make a copy" untuk copy ke Google Drive Anda. Template sudah include sample data untuk testing.

**Waktu**: 1 menit

### Step 2: Konfigurasi Setting

Buka sheet "Config", isi:
- Email tujuan notifikasi
- Frekuensi report (daily/weekly/monthly)
- Threshold untuk alert (contoh: stok <10)

Semua setting ada panduan di comment cell.

**Waktu**: 2 menit

### Step 3: Authorize Apps Script

Klik menu "Extensions" → "Apps Script" → "Run". Google akan minta authorization (one-time). Klik "Allow" untuk kasih akses ke Gmail dan Drive.

**Waktu**: 1 menit

### Step 4: Test & Deploy

Jalankan function `testAutomation()` untuk test. Jika berhasil, klik "Deploy" dan automation akan jalan otomatis sesuai schedule.

**Waktu**: 1 menit

> **Total waktu setup**: 5 menit (pertama kali)  
> **Maintenance**: Tidak perlu, script jalan 24/7 otomatis
```

**Breakdown:**

```markdown
### Step [Nomor]: [Action yang Jelas]

[Penjelasan detail apa yang dilakukan, 2-3 kalimat]

[Screenshot atau bullet points sub-step jika perlu]

**Waktu**: [Estimasi realistis]
```

**Tips:**
- Action-oriented heading ("Copy Template", bukan "Template Preparation")
- Gunakan numbered list untuk step sequence
- Include estimasi waktu per step
- Tambahkan screenshot untuk step yang kompleks
- Akhiri dengan total time dan maintenance requirement

---

### Deliverables

```markdown
## Yang Anda Dapatkan

Setelah pembelian, Anda akan mendapatkan:

### 1. 📦 Google Sheets Template (50+ Sheet)

- Main dashboard dengan overview metrics
- 50+ template untuk use case berbeda (inventory, CRM, attendance, invoice, dll)
- Sample data untuk testing
- Pre-configured formulas dan conditional formatting

### 2. 💻 Apps Script Source Code

- Full source code dengan komentar bahasa Indonesia
- Modular structure, mudah di-custom
- Best practices untuk performance dan error handling
- Version history untuk rollback jika ada issue

### 3. 📚 Dokumentasi Lengkap (PDF + Video)

- Setup guide step-by-step (PDF 20 halaman)
- Video tutorial 30 menit (screen recording dengan narasi)
- Troubleshooting guide untuk common issues
- FAQ 50+ pertanyaan

### 4. 🎓 Bonus: Private WhatsApp Group

- Akses ke community pengguna lain
- Share use case dan tips
- Priority support dari saya (mbah)
- Free update selamanya (new template, bugfix)

### 5. ✅ Garansi 14 Hari

- Jika produk tidak sesuai ekspektasi, **full refund** no questions asked
- Free support via email/WA selama 14 hari pertama
- Response time: max 24 jam (hari kerja)
```

**Tips:**
- Gunakan emoji untuk visual hierarchy (📦, 💻, 📚)
- Format: Heading + bullet points detail
- Highlight benefit yang unexpected ("komentar bahasa Indonesia", "community")
- Tambahkan garansi untuk reduce risk perception

---

### FAQ

```markdown
## FAQ (Frequently Asked Questions)

### Apakah butuh skill coding?

**Tidak.** Template sudah siap pakai, tinggal copy dan konfigurasi via sheet "Config" (tidak perlu buka code editor). Jika ingin custom lebih lanjut, source code sudah include komentar lengkap dalam bahasa Indonesia.

### Apakah ada biaya langganan bulanan?

**Tidak ada.** Ini one-time payment. Produk (template + source code) jadi milik Anda selamanya. Tidak ada biaya tambahan.

**Catatan**: Google Apps Script 100% gratis untuk personal use. Jika Anda pakai Google Workspace (berbayar), tidak ada biaya tambahan juga.

### Apakah bisa digunakan di Microsoft Excel?

**Tidak.** Produk ini spesifik untuk Google Sheets dan Google Apps Script. Tidak compatible dengan Microsoft Excel karena teknologi yang berbeda.

**Alternatif**: Jika Anda pakai Excel, saya bisa buatkan versi Excel dengan VBA atau Power Automate (layanan DFY terpisah).

### Apakah bisa request custom feature?

**Bisa!** Tersedia layanan Done-For-You (DFY) untuk kustomisasi. Contoh request yang bisa dikerjakan:
- Integrasi dengan API external (WhatsApp, Telegram, Notion)
- Custom workflow sesuai bisnis Anda
- Training untuk tim (online/offline)

👉 [Konsultasi gratis 15 menit →](https://godev.id/dfy?product=sheets-automation)

### Bagaimana cara update jika ada versi baru?

**Gratis selamanya.** Setiap kali ada update (new template, bugfix, new feature), Anda akan dapat notifikasi via email + link download versi terbaru. Tidak perlu bayar lagi.

### Support tersedia berapa lama?

**14 hari intensive support** via email/WhatsApp (response max 24 jam). Setelah itu, Anda tetap bisa akses:
- Private WhatsApp group (community support)
- Dokumentasi online (selalu update)
- Email support untuk critical issue (response 2-3 hari)

### Apakah ada demo atau trial?

**Tidak ada trial**, tapi ada **garansi 14 hari full refund**. Jika setelah coba produk tidak sesuai ekspektasi, Anda bisa minta refund tanpa pertanyaan.

**Kenapa tidak ada trial?** Template + source code langsung bisa di-copy dan dipakai selamanya. Tidak ada cara untuk "revoke" akses setelah diberikan.
```

**Tips:**
- Format: **Pertanyaan bold**, jawaban paragraf
- Tone: Langsung, jujur, tidak defensive
- Jumlah: 7-10 FAQ
- Urutkan dari yang paling sering ditanya
- Highlight dengan **bold** pada kata kunci ("Tidak", "Gratis", "Bisa")
- Link ke resource lain jika relevan (DFY, dokumentasi)

---

### Pricing & CTA

```markdown
## Harga & Pembelian

~~Rp 499.000~~ (harga normal)  
**Rp 299.000** (promo early adopter)

🔥 **Promo terbatas**: Harga naik ke Rp 399.000 setelah 50 pembeli pertama!  
📊 **Sudah dibeli**: 23 pembeli (27 slot tersisa)

### Cara Beli

#### 1. Via E-Commerce (Recommended)

🛒 **[Beli di Shopee →](https://shopee.co.id/klikdev/sheets-automation)**
- Instant delivery (link download via chat Shopee)
- Bisa pakai ShopeePay, Gopay, Transfer Bank
- Garansi marketplace (buyer protection)

#### 2. Via Transfer Bank

💳 **BCA**: 1234567890 a.n. Dody Saputra  
💳 **Mandiri**: 9876543210 a.n. Dody Saputra

Setelah transfer, kirim bukti via WhatsApp: [+62812-3456-7890](https://wa.me/62812345678)

#### 3. Via Trakteer (Support Kreator)

☕ **[Support via Trakteer →](https://trakteer.id/klikdev/tip)**
- Bisa pakai QRIS, e-wallet, kartu kredit
- Link download otomatis dikirim via email

---

## Butuh Kustomisasi?

Jika Anda butuh:
- ✨ Custom workflow sesuai bisnis Anda (bukan pakai template generic)
- 🔗 Integrasi dengan tools lain (WhatsApp Business API, Notion, Telegram Bot)
- 🎓 Training untuk tim (1-2 hari, online/offline)
- 🛠️ Maintenance & support bulanan

Saya bisa kerjakan secara **Done-For-You (DFY)**.

👉 **[Konsultasi gratis 15 menit →](https://godev.id/dfy?product=sheets-automation)**

**Estimasi project DFY:**
- Simple customization: 1-2 hari (Rp 1-2 juta)
- Medium integration: 1 minggu (Rp 3-5 juta)
- Complex system: 2-4 minggu (Rp 10-20 juta)

*Harga tergantung scope, akan dibahas saat konsultasi
```

**Breakdown:**

**Pricing Display:**
- Strikethrough untuk harga normal (create urgency)
- Bold untuk harga promo
- Emoji untuk visual attention (🔥, 📊)
- Social proof ("23 pembeli")
- Scarcity ("27 slot tersisa")

**Multiple Payment Options:**
- Recommended option di atas (e-commerce = safer untuk buyer)
- Alternative options (transfer, Trakteer)
- Clear instruction untuk setiap metode

**CTA Hierarchy:**
1. Primary CTA: Beli produk (button/link prominent)
2. Secondary CTA: Konsultasi DFY (untuk yang butuh custom)

---

### Social Proof (Optional)

```markdown
## Testimonial

> "Sebelum pakai template ini, saya spend 3 jam setiap hari buat manual data entry dari form ke spreadsheet. Sekarang semua otomatis, saya bisa fokus ke hal yang lebih penting. ROI-nya gila, balik modal dalam seminggu!"  
> — **Rina Kusuma**, Owner Toko Online Fashion (Jakarta)

> "Source code-nya rapih dan ada komentar bahasa Indonesia di setiap function. Saya yang baru belajar Apps Script bisa ngerti cara kerjanya dan custom sesuai kebutuhan bisnis saya."  
> — **Budi Santoso**, IT Manager UMKM Manufaktur (Surabaya)

> "Support-nya responsif banget. Ada issue di integration, dalam 2 jam udah dijawab sama mbah via WA dengan penjelasan lengkap + screenshot. Worth it!"  
> — **Dian Pratama**, Freelance Digital Marketer (Bandung)
```

**Tips:**
- Format: Blockquote (>) untuk quote
- Attribution: Nama, profesi/role, lokasi
- Length: 2-3 kalimat per testimonial
- Content: Spesifik (angka, before-after, outcome), bukan generic ("produk bagus")
- Jumlah: 3-5 testimonial
- Screenshot: Tambahkan jika ada (increase credibility)

---

### Contact

```markdown
## Kontak & Support

Ada pertanyaan sebelum beli? Hubungi saya:

- 📧 **Email**: dody@klikdev.com
- 💬 **WhatsApp**: [+62812-3456-7890](https://wa.me/6281234567890)
- 🐦 **Twitter**: [@klikdev](https://twitter.com/klikdev)
- 💼 **LinkedIn**: [Dody Saputra](https://linkedin.com/in/dodysaputra)

**Response time**: Maksimal 24 jam (hari kerja)

---

*Last updated: 4 Juli 2026*
```

---

## 📏 Content Metrics

**Contoh produk di atas:**
- Total words: ~1,200 kata
- Reading time: 5-6 menit
- Sections: 11 sections
- Images: 0 (bisa tambahkan screenshot di "Cara Kerja")
- CTAs: 3 (Beli, DFY, Kontak)

**Ideal metrics untuk produk:**
- Words: 800-1,500 kata
- Reading time: 4-7 menit
- Sections: 8-12 sections
- Images: 2-5 (screenshot atau diagram)
- CTAs: 2-3 (jangan overwhelming)

---

## ✅ Final Checklist

Sebelum publish produk baru:

- [ ] Frontmatter lengkap dan valid
- [ ] Thumbnail image sudah ada di `src/images/produk/`
- [ ] Link pembelian sudah dicek (tidak 404)
- [ ] Harga sudah sesuai
- [ ] Kategori sudah benar (case-sensitive)
- [ ] Draft = false
- [ ] Minimal 800 kata
- [ ] Ada 1-2 CTA jelas
- [ ] FAQ minimal 5 pertanyaan
- [ ] Sudah proofread (typo, grammar)
- [ ] Test preview di `npm run dev`

---

Gunakan contoh ini sebagai referensi saat menulis produk baru. Copy struktur, sesuaikan dengan konten Anda! 🚀
</contents>