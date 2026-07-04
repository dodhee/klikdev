# Panduan Membuat Konten Produk - KlikDev

**Quick start guide untuk menulis dan publish produk baru**

---

## 🚀 Quick Start (5 Menit)

### Workflow Singkat

1. **Copy template**
   ```bash
   cp src/content/produk/_TEMPLATE.mdx src/content/produk/nama-produk-anda.mdx
   ```

2. **Edit dengan VS Code**
   - Ganti semua `[PLACEHOLDER]` dengan konten Anda
   - Hapus semua komentar (baris dengan `#`)

3. **Add gambar thumbnail**
   - Simpan gambar di `src/images/produk/`
   - Format: JPG/PNG, 1600×900px, max 200KB

4. **Preview**
   ```bash
   npm run dev
   # Buka: http://localhost:4321/produk/nama-produk-anda
   ```

5. **Publish**
   ```bash
   git add .
   git commit -m "feat: tambah produk [Nama Produk]"
   git push
   ```

---

## 📚 Resources

### 1. Template & Examples

| File | Deskripsi | Kapan Pakai |
|------|-----------|-------------|
| `src/content/produk/_TEMPLATE.mdx` | Template kosong dengan placeholder | Buat produk baru |
| `MARKDOWN-CHEATSHEET.md` | Syntax Markdown lengkap | Referensi cepat saat menulis |
| `MARKDOWN-EXAMPLE-ANNOTATED.md` | Contoh produk dengan penjelasan | Belajar struktur & best practices |

### 2. Existing Products (Contoh Real)

Lihat produk existing sebagai referensi:

```bash
src/content/produk/
├── google-sheets-automation-engine.mdx          # Produk software
├── gemini-prompt-library.mdx                    # Produk digital content
└── google-sheets-automation-engine-optimized.mdx # Variasi produk
```

---

## 🎓 Learning Path

### Path 1: Langsung Praktek (Recommended)

**Waktu: 30-45 menit**

1. Baca `MARKDOWN-CHEATSHEET.md` section "Syntax Dasar" (10 menit)
2. Copy `_TEMPLATE.mdx` jadi produk baru (2 menit)
3. Isi section by section sambil refer ke template (30 menit)
4. Preview dan fix formatting (5 menit)

**Output**: 1 produk baru published

### Path 2: Deep Dive (Untuk yang Perfectionist)

**Waktu: 1-2 jam**

1. Baca seluruh `MARKDOWN-CHEATSHEET.md` (20 menit)
2. Baca `MARKDOWN-EXAMPLE-ANNOTATED.md` (30 menit)
3. Analyze 2 produk existing (20 menit)
4. Buat produk pertama (45 menit)

**Output**: Pemahaman mendalam + 1 produk berkualitas tinggi

---

## 📝 Markdown Basics (Yang Paling Sering Dipakai)

### 90% konten produk cuma pakai 5 syntax ini:

```markdown
# Heading (judul section)
**Bold text** (highlight penting)
- List item (fitur, benefit, dll)
[Link text](https://url.com)
Enter 2x untuk paragraf baru
```

### Contoh Real:

```markdown
## Fitur Utama

Produk ini punya **3 fitur unggulan**:

- **Auto-sync**: Data sinkron otomatis setiap 5 menit
- **Email notification**: Alert real-time via email
- **Cloud backup**: Backup otomatis ke Google Drive

[Beli sekarang](https://shopee.co.id/produk) dengan harga spesial!
```

**That's it!** 90% konten produk bisa ditulis dengan syntax di atas.

---

## 🖼️ Image Guidelines

### Thumbnail Produk

**Spesifikasi:**
- Ukuran: 1600×900px (16:9 aspect ratio)
- Format: JPG atau PNG
- File size: Max 200KB (sebelum optimization)
- Design: Center-weighted composition, 5% safe margin

**Lokasi:** `src/images/produk/nama-file.jpg`

**Reference di MDX:**
```yaml
thumbnail: /src/images/produk/nama-file.jpg
```

### Screenshot/Diagram (Optional)

Untuk screenshot di dalam konten:

```markdown
![Deskripsi gambar](/src/images/produk/screenshot-dashboard.jpg)
```

**Tips:**
- Compress dengan TinyPNG sebelum upload
- Max 100KB per screenshot
- Tambahkan caption/deskripsi

---

## ✅ Content Checklist

### Before Writing

- [ ] Sudah tahu target audience produk
- [ ] Sudah punya list 4-6 fitur utama
- [ ] Sudah siapkan gambar thumbnail
- [ ] Sudah tentukan harga & link pembelian

### During Writing

- [ ] Frontmatter lengkap (semua field terisi)
- [ ] Opening paragraph jelas (apa, untuk siapa, benefit)
- [ ] Section "Fitur Utama" minimal 4 fitur
- [ ] Section "Siapa yang Cocok" ada (positive + negative)
- [ ] Section "FAQ" minimal 5 pertanyaan
- [ ] Ada CTA jelas (link beli)
- [ ] Total min 800 kata

### After Writing

- [ ] Preview di `npm run dev` (cek formatting)
- [ ] Proofread (typo, grammar)
- [ ] Link pembelian sudah dicek (tidak 404)
- [ ] Gambar thumbnail tampil dengan benar
- [ ] Draft = false (agar tampil public)
- [ ] Commit ke Git dengan message jelas

---

## 🐛 Troubleshooting

### Problem: Gambar tidak tampil

**Solusi:**
1. Cek path: harus `/src/images/produk/` (bukan `/images/`)
2. Cek nama file: case-sensitive, tidak ada spasi
3. Cek format: JPG atau PNG (bukan JPEG, jpg dengan huruf kecil)

### Problem: Produk tidak muncul di katalog

**Solusi:**
1. Cek frontmatter `draft: false`
2. Cek kategori: harus salah satu dari "Google Apps Script", "AI Prompt", "Automation"
3. Restart dev server: `Ctrl+C` lalu `npm run dev` lagi

### Problem: Markdown syntax tidak jalan

**Solusi:**
1. Spasi setelah `#`: `# Heading` (bukan `#Heading`)
2. Line break: Enter 2x untuk paragraf baru
3. Link format: `[text](url)` (bukan `[text] (url)` dengan spasi)

### Problem: Build error saat push

**Solusi:**
1. Cek frontmatter YAML valid (tidak ada karakter special tanpa quote)
2. Cek semua link tidak broken
3. Jalankan `npm run build` di local untuk test

---

## 🎯 Content Strategy

### Produk Pertama (Positioning)

Buat 1 produk **flagship** yang:
- Paling comprehensive (fitur lengkap)
- Harga mid-range (Rp 199k - 399k)
- Target audience luas (UMKM umum)

**Goal:** Establish credibility + social proof

### Produk 2-5 (Diversification)

Buat variasi untuk niche berbeda:
- 1 produk premium (Rp 500k+, custom solution)
- 2 produk mid (Rp 200-400k, template specific)
- 2 produk entry (Rp 50-150k, simple tools/prompts)

**Goal:** Cover berbagai budget + use case

### Produk 6+ (Scale)

- Produk seasonal (promo, bundle)
- Produk affiliate (partnership)
- Produk beta (test pasar)

---

## 📊 Metrics to Track

Setelah publish produk, track:

1. **Traffic**: Berapa visitor ke halaman produk?
2. **Conversion**: Berapa yang klik "Beli"?
3. **Bounce rate**: Berapa yang langsung keluar?
4. **Time on page**: Rata-rata reading time?

**Tools:**
- Google Analytics (sudah disetup?)
- Hotjar (heatmap, recording)
- Gumroad/Shopee analytics

**Iterasi:**
- Jika bounce rate >70% → Improve opening paragraph
- Jika time on page <2 menit → Content terlalu panjang/membosankan
- Jika conversion <2% → CTA tidak jelas atau harga terlalu tinggi

---

## 🔄 Update Workflow

### Update Minor (Typo, Info)

```bash
# Edit file MDX
git add src/content/produk/nama-produk.mdx
git commit -m "docs: fix typo di produk [Nama]"
git push
```

Frontmatter `modDatetime` akan auto-update (atau manual).

### Update Major (Fitur Baru, Harga)

```bash
# Edit file + update modDatetime di frontmatter
git add src/content/produk/nama-produk.mdx
git commit -m "feat(produk): tambah fitur X di [Nama]"
git push
```

Tambahkan changelog di section "Update Log".

---

## 💡 Tips & Tricks

### 1. Tulis Seperti Bicara

❌ "Produk ini menyediakan fungsionalitas automasi yang komprehensif"  
✅ "Produk ini bisa otomasi semua workflow repetitif Anda"

### 2. Gunakan Angka Konkret

❌ "Hemat banyak waktu"  
✅ "Hemat 10+ jam kerja per minggu"

### 3. Pecah Paragraf Panjang

❌ Paragraf 8 baris  
✅ Maksimal 3-4 baris per paragraf

### 4. Gunakan Formatting untuk Scanability

- **Bold** untuk highlight
- Bullet points untuk list
- Heading untuk struktur
- Quote untuk testimonial/catatan

### 5. Test di Mobile

Preview di:
- Desktop (Chrome)
- Mobile (Chrome DevTools responsive mode)
- Tablet (iPad size)

---

## 🚦 Status Workflow

| Status | Meaning | Action |
|--------|---------|--------|
| `draft: true` | Hidden, masih WIP | Continue writing |
| `draft: false` | Published, live | Monitor metrics |
| `featured: true` | Tampil di homepage | Maksimal 3-4 produk |
| `featured: false` | Tampil di katalog saja | Default untuk produk baru |

---

## 📞 Need Help?

**Stuck di Markdown syntax?**  
→ Refer ke `MARKDOWN-CHEATSHEET.md`

**Bingung struktur konten?**  
→ Copy dari `MARKDOWN-EXAMPLE-ANNOTATED.md`

**Error saat build?**  
→ Cek Troubleshooting section di atas

**Butuh review sebelum publish?**  
→ Push ke branch baru, create PR, tag @mbah

---

**Next Step:** Buka `_TEMPLATE.mdx` dan buat produk pertama Anda! 🚀

*Last updated: 4 Juli 2026*
</contents>