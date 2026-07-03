# Phase 3: Homepage & Katalog Produk

## Ringkasan Perubahan

Phase 3 mengubah homepage dari blog-centric menjadi product catalog sesuai mega_prompt_klikdev.md.

## File yang Dibuat

### 1. `src/components/ProductCard.astro`
Komponen card untuk menampilkan produk dalam grid layout.

**Fitur:**
- Thumbnail dengan aspect ratio 16:9
- Kategori badge dengan warna `mbah-accent`
- Stack badges (max 3 ditampilkan, sisanya +N)
- Harga dalam format Rupiah
- Waktu deploy dengan `font-signature`
- Hover effect: scale image + ubah warna judul

**Props:**
```typescript
type Props = CollectionEntry<"produk">;
```

**Utility:**
- `formatRupiah()`: Format angka ke Rp XXX.XXX

### 2. `src/content/produk/gemini-prompt-library.mdx`
Dummy produk kedua (non-featured) untuk testing grid layout.

## File yang Dimodifikasi

### 1. `src/pages/index.astro`

**Perubahan Utama:**

#### Import
- ❌ Hapus: `IconRss`, `Card`, `getSortedPosts`
- ✅ Tambah: `ProductCard`
- ✅ Hapus: `posts: postsConfig` dari config destructuring

#### Data Query
```typescript
// SEBELUM: Query blog posts
const posts = await getCollection("posts");
const sortedPosts = getSortedPosts(posts);

// SESUDAH: Query produk collection
const produkCollection = await getCollection("produk");
const sortedProduk = produkCollection
  .filter(({ data }) => !data.draft)
  .sort((a, b) => b.data.pubDatetime.valueOf() - a.data.pubDatetime.valueOf());

const featuredProduk = sortedProduk.filter(({ data }) => data.featured);
const allProduk = sortedProduk;
```

#### Hero Section (Sesuai Wireframe)
- **H1:** "Berhenti Menulis Ulang Boilerplate Google Apps Script."
- **Copywriting:** Perkenalan Dody/mbah + value proposition
- **CTA Buttons:**
  - Primary: "Lihat Katalog Sistem" → `#katalog` (smooth scroll)
  - Secondary: "Baca Panduan Gratis" → `/posts`
- **Style:** Primary button gunakan `bg-mbah-accent` dan `hover:bg-mbah-accent-hover`

#### DFY Callout Section
```astro
<section class="border-border border-b pt-8 pb-6">
  <div class="border-mbah-accent bg-card rounded-lg border-l-4 p-4">
    <p class="text-muted-foreground">
      <strong>Tidak punya waktu untuk deploy sendiri?</strong> 
      Cek layanan Done-For-You saya di 
      <a href="https://godev.id?utm_source=klikdev&utm_medium=homepage&utm_campaign=dfy_callout">
        godev →
      </a>
    </p>
  </div>
</section>
```

**UTM Parameters:**
- `utm_source=klikdev`
- `utm_medium=homepage`
- `utm_campaign=dfy_callout`

#### Featured Products Section
- Conditional render jika ada produk featured
- Grid responsive: `sm:grid-cols-2 lg:grid-cols-3`
- Heading: "Produk Unggulan"

#### All Products Catalog
- ID: `#katalog` (anchor untuk scroll dari hero CTA)
- Heading dinamis:
  - Jika ada featured: "Semua Produk"
  - Jika tidak ada featured: "Katalog Produk"
- Grid sama dengan featured section

#### Footer Link
- ❌ Sebelum: "All Posts" → `/posts`
- ✅ Sesudah: "Baca Tutorial & Panduan" → `/posts`
- Blog posts tetap accessible, tapi tidak dominan di homepage

### 2. `src/content/produk/google-sheets-automation-engine.mdx`

**Bug Fix:**
```diff
- thumbnail: "./images/sheets-automation-thumb.png"
+ thumbnail: "https://placehold.co/800x450/f97316/ffffff?text=Sheets+Automation"
```

**Reason:** Path relatif ke image yang belum ada menyebabkan `ImageNotFound` error. Temporary fix pakai placeholder URL.

**TODO Production:** Ganti dengan image asli di `src/content/produk/images/`.

## Bug yang Diperbaiki

### 1. `formatRupiah()` TypeError

**Error:**
```
(intermediate value).replace is not a function
at formatRupiah (ProductCard.astro:16:6)
```

**Root Cause:**
```typescript
// ❌ SALAH
return new Intl.NumberFormat("id-ID", { ... }).replace("Rp", "Rp ");
// Intl.NumberFormat() return object, bukan string
```

**Fix:**
```typescript
// ✅ BENAR
return new Intl.NumberFormat("id-ID", { ... })
  .format(amount)  // ← Missing method call
  .replace("Rp", "Rp ");
```

### 2. Missing Thumbnail Image

**Error:** `ImageNotFound` saat load homepage

**Fix:** Ganti path relatif dengan URL placeholder dari placehold.co

**Trade-off:** Placeholder bukan production-ready, tapi unblock development.

## Verifikasi

### Manual Testing Checklist
- [x] Homepage load tanpa error (Status 200)
- [x] Hero section menampilkan copywriting yang benar
- [x] DFY callout visible dengan border kiri orange
- [ ] Featured product cards muncul di grid (jika ada featured)
- [ ] All products catalog muncul di grid
- [ ] Product card menampilkan:
  - [ ] Thumbnail placeholder
  - [ ] Kategori badge
  - [ ] Judul produk
  - [ ] Deskripsi (max 2 lines dengan ellipsis)
  - [ ] Stack badges (max 3 + counter)
  - [ ] Harga dalam format Rupiah
  - [ ] Waktu deploy
- [ ] Hover effect bekerja (image scale + judul berubah warna)
- [ ] Click card redirect ke `/produk/[slug]` (akan dibuat di Phase 4)
- [ ] Responsive: grid 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- [ ] Link "Baca Tutorial & Panduan" mengarah ke `/posts`

### Terminal Commands untuk Verifikasi
```powershell
# Test homepage status
Invoke-WebRequest -Uri 'http://localhost:4321/' -UseBasicParsing | Select-Object StatusCode

# Check copywriting
(Invoke-WebRequest -Uri 'http://localhost:4321/').Content | Select-String 'Berhenti Menulis'

# Check product rendering
(Invoke-WebRequest -Uri 'http://localhost:4321/').Content | Select-String 'ProductCard'
```

## Known Issues

### 1. Placeholder Thumbnails
- **Issue:** Menggunakan placehold.co (external service)
- **Impact:** Tidak work offline, loading tergantung network
- **Resolution:** Replace dengan image asli di Phase 5 (SEO & Assets)

### 2. Product Detail Page Belum Ada
- **Issue:** Link `/produk/[slug]` belum dibuat
- **Impact:** Click card akan 404
- **Resolution:** Phase 4

### 3. Tailwind Custom Classes Belum Diverifikasi
- **Issue:** `font-signature`, `mbah-accent`, dll belum di-test visual
- **Impact:** Mungkin tidak render sesuai design system
- **Resolution:** Manual browser testing required

## Next Steps (Phase 4)

1. Buat dynamic route: `src/pages/produk/[slug].astro`
2. Implementasi tab navigation (5 tabs sesuai mega_prompt)
3. Render MDX content dengan proper styling
4. Integrate `ProductLayout.astro` (sudah dibuat di Phase 2)
5. Integrate `BailoutCTA.astro` di hero dan footer produk

## Git Commit Message (Suggested)
```
feat(klikdev): ubah homepage jadi katalog produk dengan ProductCard component

- Buat ProductCard.astro dengan grid layout responsive
- Modifikasi index.astro: ganti blog posts dengan produk collection
- Implementasi hero section sesuai wireframe (copywriting mbah)
- Tambah DFY callout dengan UTM tracking ke godev
- Fix formatRupiah() bug dan placeholder thumbnail
- Tambah dummy produk: gemini-prompt-library.mdx

BREAKING CHANGE: Homepage tidak lagi menampilkan blog posts.
Blog posts tetap accessible di /posts route.
```

## Lampiran: Screenshot Checklist

**BELUM DITES — Manual browser testing required:**
1. Hero section dengan 2 CTA buttons
2. DFY callout box dengan border kiri orange
3. Featured products grid (jika ada)
4. All products catalog grid
5. Product card detail (thumbnail, badges, harga, dll)
6. Hover state
7. Responsive breakpoints (mobile, tablet, desktop)

---

**Engineered by Dody (mbah)** — Dokumentasi yang jujur, bukan ilusi sempurna.