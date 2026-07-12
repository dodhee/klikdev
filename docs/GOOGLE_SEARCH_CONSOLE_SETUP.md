# Setup Google Search Console untuk KlikDev

## Apa itu Google Search Console?

Google Search Console (GSC) adalah tool gratis dari Google untuk:
- Monitor performa SEO situs Anda di Google Search
- Submit sitemap agar Google bisa crawl semua halaman
- Lihat keyword apa yang membawa traffic ke situs Anda
- Detect error crawling, indexing, dan mobile usability

## Langkah 1: Tambahkan Property di Search Console

1. Buka https://search.google.com/search-console
2. Login dengan akun Google yang sama dengan GA4
3. Klik **Add Property**
4. Pilih **URL prefix** (bukan Domain)
5. Masukkan URL: `https://klikdev.my.id`
6. Klik **Continue**

## Langkah 2: Verifikasi Ownership (Metode HTML Tag)

### Cara Manual (Recommended)

1. Di halaman verifikasi, pilih metode: **HTML tag**
2. Copy meta tag yang diberikan, contoh:
   ```html
   <meta name="google-site-verification" content="abc123xyz456" />
   ```
3. Copy hanya **content value** (contoh: `abc123xyz456`)

4. Buka file `astro-paper.config.ts` di root project

5. Cari section `site` dan tambahkan field `googleVerification`:
   ```typescript
   export default {
     site: {
       url: "https://klikdev.my.id",
       title: "KlikDev",
       description: "Script siap pakai untuk otomasi bisnis",
       author: "Dody (mbah)",
       lang: "id",
       dir: "ltr",
       googleVerification: "abc123xyz456", // 👈 Tambahkan ini (ganti dengan code Anda)
     },
     // ... config lainnya
   }
   ```

6. Save file, restart dev server:
   ```bash
   npm run dev
   ```

7. Buka browser, view page source (`Ctrl+U`), cari `google-site-verification`
   - Pastikan meta tag muncul di `<head>`

8. Deploy ke production (Cloudflare Pages):
   ```bash
   git add .
   git commit -m "feat: tambah Google Search Console verification"
   git push origin main
   ```

9. Tunggu deploy selesai (~2 menit)

10. Kembali ke Google Search Console, klik **Verify**

### Cara Alternatif (File HTML Upload)

Jika metode HTML tag tidak bekerja:

1. Download file HTML yang diberikan (contoh: `google1234567890abcdef.html`)
2. Letakkan di folder `public/` di root project
3. Deploy ke production
4. Akses `https://klikdev.my.id/google1234567890abcdef.html` di browser
   - Jika file muncul = berhasil
5. Klik **Verify** di Search Console

## Langkah 3: Submit Sitemap

### A. Generate Sitemap (Sudah Otomatis)

Sitemap sudah dikonfigurasi di `astro.config.ts`. Saat build, sitemap akan otomatis di-generate di:
- `dist/sitemap-index.xml` (index utama)
- `dist/sitemap-0.xml` (halaman-halaman)

### B. Test Sitemap di Lokal

1. Build project:
   ```bash
   npm run build
   ```

2. Cek apakah file sitemap ada:
   ```bash
   ls dist/sitemap-*.xml
   ```

3. Preview sitemap:
   ```bash
   npm run preview
   ```

4. Buka browser: `http://localhost:4321/sitemap-index.xml`
   - Jika muncul XML dengan daftar URL = berhasil

### C. Submit Sitemap ke Google Search Console

1. Pastikan klikdev sudah di-deploy ke production dan terverifikasi

2. Di Google Search Console, pilih property `klikdev.my.id`

3. Di sidebar kiri, klik **Sitemaps**

4. Di field "Add a new sitemap", masukkan:
   ```
   sitemap-index.xml
   ```

5. Klik **Submit**

6. Tunggu 1-3 hari, Google akan mulai crawl sitemap Anda

7. Status akan berubah dari "Couldn't fetch" → "Success"

## Langkah 4: Monitor Indexing

### Cek URL yang Sudah Terindex

1. Di Search Console, klik **Pages** di sidebar
2. Lihat grafik "Why pages aren't indexed"
3. Target: Semua halaman produk + katalog + homepage harus terindex

### Force Index Halaman Penting (Opsional)

1. Di Search Console, klik **URL Inspection** di top bar
2. Masukkan URL halaman penting, contoh:
   ```
   https://klikdev.my.id/
   https://klikdev.my.id/katalog
   https://klikdev.my.id/produk/google-sheets-automation-engine-optimized
   ```
3. Klik **Test Live URL**
4. Jika "URL is on Google" = sudah terindex
5. Jika belum, klik **Request Indexing**
6. Tunggu 1-3 hari

## Langkah 5: Monitor Performance

Setelah 7-14 hari, data mulai muncul:

1. Di Search Console, klik **Performance**
2. Lihat metrics:
   - **Clicks**: Berapa kali user klik link klikdev di Google Search
   - **Impressions**: Berapa kali link klikdev muncul di Search Results
   - **CTR**: Click-through rate (clicks/impressions)
   - **Position**: Rata-rata posisi ranking di Google

3. Filter by **Query** untuk lihat keyword apa yang membawa traffic

4. Filter by **Page** untuk lihat halaman mana yang paling banyak traffic

## Troubleshooting

### Verification Failed

**Problem**: "Verification failed. We were unable to verify your ownership."

**Solusi**:
1. Cek apakah meta tag sudah muncul di page source production (bukan localhost)
2. Cek apakah `astro-paper.config.ts` sudah di-deploy
3. Tunggu 5-10 menit setelah deploy, lalu verify lagi
4. Gunakan metode alternatif (HTML file upload)

### Sitemap "Couldn't fetch"

**Problem**: Status sitemap di Search Console: "Couldn't fetch"

**Solusi**:
1. Cek apakah sitemap bisa diakses publik: `https://klikdev.my.id/sitemap-index.xml`
2. Pastikan tidak ada robots.txt yang block sitemap
3. Tunggu 24 jam, Google akan retry otomatis
4. Jika masih gagal, submit ulang sitemap

### Halaman Tidak Terindex Setelah 1 Minggu

**Problem**: Halaman sudah di-submit, tapi status "Discovered - currently not indexed"

**Solusi**:
1. **Normal behavior** — Google tidak index semua halaman langsung
2. Priority: Homepage > Katalog > Produk featured > Produk lain
3. Tingkatkan ranking dengan:
   - Tambahkan backlink dari godev.biz.id
   - Share link di social media
   - Tambahkan internal link antar halaman produk

### Sitemap Error: "Parsing error"

**Problem**: Sitemap status "Error" dengan pesan "We encountered an error while trying to access your Sitemap."

**Solusi**:
1. Validate sitemap XML di https://www.xml-sitemaps.com/validate-xml-sitemap.html
2. Jika ada error, cek `astro.config.ts` di bagian sitemap config
3. Re-build dan re-deploy

## Best Practices

### 1. Update Sitemap Otomatis
Setiap kali Anda tambah produk baru atau artikel blog:
1. Build ulang: `npm run build`
2. Deploy ke production (Cloudflare auto-deploy)
3. Sitemap akan update otomatis
4. Google akan crawl sitemap dalam 1-3 hari

### 2. Monitor Weekly
Setiap Minggu, cek:
- **Coverage**: Apakah ada halaman baru yang error?
- **Performance**: Keyword mana yang naik/turun?
- **Mobile Usability**: Apakah ada error mobile?

### 3. Fix Error Segera
Jika ada error di Search Console:
- **404 errors**: Fix broken links
- **Soft 404**: Tambahkan content yang lebih substantial
- **Duplicate content**: Tambahkan canonical URL
- **Mobile usability**: Fix responsive design

## Integrasi dengan GA4

Search Console data bisa diintegrasikan dengan GA4:

1. Di GA4, klik **Admin** → **Search Console links**
2. Klik **Link** → Pilih property Search Console
3. Klik **Submit**
4. Data Search Console akan muncul di GA4 Reports → **Acquisition** → **Search Console**

## Checklist Post-Setup

- [ ] Property klikdev.my.id sudah terverifikasi di Search Console
- [ ] Sitemap sudah di-submit dan status "Success"
- [ ] Homepage sudah terindex (cek via URL Inspection)
- [ ] Halaman katalog sudah terindex
- [ ] Minimal 1 halaman produk sudah terindex
- [ ] Search Console sudah diintegrasikan dengan GA4 (opsional)
- [ ] Setup email notification untuk critical errors di Search Console

## Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Sitemap Best Practices](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
</content>