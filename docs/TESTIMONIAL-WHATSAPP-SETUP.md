# Testimonial WhatsApp Setup Guide

## 🔧 PENTING: Update Nomor WhatsApp Anda

Sebelum deploy ke production, **WAJIB** update nomor WhatsApp di file ini:

### **File yang Perlu Diupdate:**

📄 `src/pages/produk/[slug].astro`

**Lokasi:** Baris ~56 (di bagian testimonials integration)

**Kode saat ini:**
```astro
<TestimonialList 
  testimonials={testimonials}
  productSlug={produk.id}
  productTitle={data.title}
  whatsappNumber="6281234567890"  // ← GANTI INI!
/>
```

**Ganti dengan nomor WhatsApp Anda:**
```astro
whatsappNumber="628123456789"  // Format: 628xxxxxxxxxx (tanpa +, tanpa spasi)
```

---

## 📱 Format Nomor WhatsApp

**BENAR:**
- `628123456789` (dimulai dengan 62, tanpa +)
- `6281234567890` (10-13 digit setelah 62)

**SALAH:**
- `+628123456789` (jangan pakai +)
- `08123456789` (jangan dimulai dengan 0)
- `62 812 3456 789` (jangan pakai spasi)
- `62-812-3456-789` (jangan pakai dash)

---

## 🎯 Cara Kerja Form Testimonial

### **User Flow:**
1. Customer buka halaman produk (contoh: `/produk/google-sheets-automation-engine-optimized`)
2. Scroll ke section "Customer Reviews"
3. Klik tombol **"Tulis Review"**
4. Form muncul dengan fields:
   - Nama Lengkap (required)
   - Email (required, untuk verifikasi)
   - Jabatan/Perusahaan (optional)
   - Rating bintang 1-5 (required, interactive)
   - Testimoni (required, min 20 karakter, max 500)
5. Customer klik **"Kirim via WhatsApp"**
6. Browser buka WhatsApp dengan message pre-filled:
   ```
   *REVIEW BARU - [Product Title]*
   
   *Nama:* Budi Santoso
   *Email:* budi@example.com
   *Jabatan/Perusahaan:* IT Manager, PT Maju Jaya
   *Rating:* ⭐⭐⭐⭐⭐ (5/5)
   *Product Slug:* google-sheets-automation-engine-optimized
   
   *Testimoni:*
   Script ini menghemat 10+ jam kerja manual per minggu. Setup-nya mudah, dokumentasi lengkap. Worth every rupiah!
   
   ---
   _Mohon review dan approve untuk publish di website._
   ```
7. Customer klik **Send** di WhatsApp
8. Anda terima message di WhatsApp

---

## ✅ Approval & Publishing Workflow

### **Setelah Terima Review di WhatsApp:**

1. **Verifikasi Customer:**
   - Cek apakah email valid
   - Cek apakah benar-benar sudah beli (cek payment record)
   - Jika valid → lanjut step 2
   - Jika tidak valid/spam → abaikan

2. **Generate UUID untuk Testimonial:**
   - Buka: https://www.uuidgenerator.net/
   - Generate UUID v4
   - Copy UUID (contoh: `550e8400-e29b-41d4-a716-446655440004`)

3. **Tambahkan ke JSON File:**
   
   **Jika produk sudah punya file testimonial:**
   - Buka `src/data/testimonials/[product-slug].json`
   - Tambahkan entry baru di array:
   ```json
   [
     // ... existing testimonials ...
     ,
     {
       "id": "550e8400-e29b-41d4-a716-446655440004",
       "name": "Budi Santoso",
       "role": "IT Manager, PT Maju Jaya",
       "rating": 5,
       "content": "Script ini menghemat 10+ jam kerja manual per minggu. Setup-nya mudah, dokumentasi lengkap. Worth every rupiah!",
       "productSlug": "google-sheets-automation-engine-optimized",
       "date": "2026-07-05T09:00:00Z",
       "verified": true
     }
   ]
   ```

   **Jika produk belum punya file testimonial:**
   - Buat file baru: `src/data/testimonials/[product-slug].json`
   - Isi dengan array berisi 1 testimonial:
   ```json
   [
     {
       "id": "550e8400-e29b-41d4-a716-446655440004",
       "name": "Budi Santoso",
       "role": "IT Manager, PT Maju Jaya",
       "rating": 5,
       "content": "Script ini menghemat 10+ jam kerja manual per minggu. Setup-nya mudah, dokumentasi lengkap. Worth every rupiah!",
       "productSlug": "product-slug-sesuai-file",
       "date": "2026-07-05T09:00:00Z",
       "verified": true
     }
   ]
   ```
   - Update `src/data/testimonials/index.ts`:
   ```typescript
   import newProductTestimonials from "./product-slug.json";
   
   const allTestimonials: Testimonial[] = [
     ...googleSheetsAutomationTestimonials,
     ...newProductTestimonials, // tambahkan ini
   ].map(t => testimonialSchema.parse(t));
   ```

4. **Test & Deploy:**
   ```bash
   npm run build  # Test build lokal
   git add .
   git commit -m "feat: tambah testimonial dari [Customer Name]"
   git push
   ```

5. **Konfirmasi ke Customer:**
   - Balas WhatsApp customer:
   "Terima kasih atas review-nya! Review Anda sudah dipublish di https://klikdev.my.id/produk/[slug]#testimonial"

---

## 🛡️ Anti-Spam Protection

**Built-in Protection:**
- ✅ Customer harus punya WhatsApp aktif
- ✅ Manual approval oleh Anda
- ✅ Email verification (Anda cek manual)
- ✅ Field validation (min/max length)

**Additional Protection (Optional):**
- Anda bisa tambahkan reCAPTCHA di form (butuh setup Google reCAPTCHA)
- Anda bisa set rule: minimal 1 hari setelah pembelian baru bisa review

---

## 📊 Monitoring Review

**Aggregate Stats Auto-Update:**
- Average rating dihitung otomatis dari semua review
- Bar chart distribution update otomatis
- Total review count update otomatis

**Check Review Performance:**
```bash
# Count total reviews
find src/data/testimonials -name "*.json" -exec cat {} \; | grep -o '"id"' | wc -l

# List all products with reviews
ls -1 src/data/testimonials/*.json
```

---

## 🔄 Migration ke Database (Future)

Jika nanti sudah ada >50 review atau butuh real-time:

**Opsi A: Google Sheets + Apps Script**
- Form submit → Google Sheets
- Approval trigger → Auto-add to JSON
- Estimated effort: 2-3 jam

**Opsi B: Cloudflare D1 + Workers**
- Form submit → D1 Database
- Admin panel untuk approve
- Real-time display (no rebuild)
- Estimated effort: 4-6 jam

---

## ❓ FAQ

**Q: Bagaimana jika customer tidak punya WhatsApp?**
A: Untuk MVP, review hanya via WhatsApp. Alternatif: tambahkan form email (butuh backend tambahan).

**Q: Apakah bisa auto-approve review?**
A: Tidak recommended untuk menghindari spam. Manual approval lebih aman.

**Q: Berapa lama proses approval?**
A: Target 1-2 hari kerja. Anda bisa set expectation di form.

**Q: Apakah customer bisa edit review setelah submit?**
A: Tidak. Customer harus submit ulang via WhatsApp, Anda hapus review lama dari JSON.

**Q: Bagaimana handle review negatif (1-2 bintang)?**
A: Anda tetap harus publish (kredibilitas). Tapi Anda bisa reply di WhatsApp untuk resolve issue dulu sebelum publish.

---

## 📞 Support

Jika ada masalah dengan form testimonial:
1. Check browser console untuk error JavaScript
2. Test WhatsApp link manual: `https://wa.me/628123456789?text=test`
3. Verify JSON format dengan validator: https://jsonlint.com/

---

**Last Updated:** 2026-07-05  
**Version:** 1.0.0