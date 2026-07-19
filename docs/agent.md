# AGENT.md — Panduan untuk AI Coding Assistant (klikdev)

> File ini adalah instruksi wajib bagi AI agent (Copilot, Cursor, Gemini, Claude, dsb.) yang bekerja di repo ini.
> Baca seluruh file ini sebelum mengerjakan task apapun.

---

## 1. Konteks Proyek

**klikdev** adalah marketplace aset digital DIY yang dibangun di atas template **AstroPaper**.
- URL Produksi: https://klikdev.my.id
- Pemilik: Dody (alias "mbah") — pemula Astro, pakar Google Apps Script & Gemini AI
- Koneksi brand: klikdev adalah corong (funnel) ke **godev** (https://godev.biz.id) — layanan Done-For-You (DFY) premium

### Produk yang dijual:
- Google Apps Script (otomasi Google Workspace)
- AI Prompt (Gemini-based)
- Automation Systems

---

## 2. Tech Stack

| Teknologi | Versi | Catatan |
|---|---|---|
| Astro | ^6.4.8 | Framework utama |
| Tailwind CSS | ^4.3.2 | Via `@tailwindcss/vite` plugin |
| MDX | ^6.0.3 | Konten produk & blog |
| ShikiJS | ^4.3.1 | Syntax highlighting |
| Decap CMS | ^3.14.1 | CMS editor — output ke `src/content/` |
| Pagefind | ^1.5.2 | Client-side search |
| TypeScript | ^6.0.3 | Strict mode |

**Package manager wajib: `npm`** — jangan gunakan `pnpm` atau `yarn`.

---

## 3. Struktur Folder Kunci

```
klikdev/
├── src/
│   ├── components/       # Astro components
│   │   ├── BailoutCTA.astro          # CTA ke godev dengan UTM
│   │   ├── StickyBanner.astro        # Banner bailout di halaman katalog
│   │   ├── TimeCalculator.astro      # Kalkulator waktu setup di detail produk
│   │   ├── ExitIntentPopup.astro     # Popup exit-intent di detail produk
│   │   ├── ProductCard.astro         # Card produk di grid katalog
│   │   └── ...
│   ├── content/
│   │   ├── produk/       # File MDX produk (Content Collection)
│   │   ├── posts/        # File MDX artikel blog
│   │   └── pages/        # File MDX halaman statis
│   ├── layouts/
│   │   ├── Layout.astro              # Base layout
│   │   ├── ProductLayout.astro       # Layout detail produk
│   │   └── PostLayout.astro          # Layout artikel blog
│   ├── pages/
│   │   ├── index.astro               # Beranda = katalog produk
│   │   ├── produk/[slug].astro       # Halaman detail produk
│   │   └── ...
│   ├── utils/
│   │   ├── UTMHelper.ts              # WAJIB dipakai untuk semua URL ke godev
│   │   └── ...
│   └── content.config.ts             # Zod schema Content Collections
├── public/
│   ├── admin/            # Konfigurasi Decap CMS
│   └── ...
└── docs/                 # Dokumentasi proyek (termasuk file ini)
```

---

## 4. Design System

### Warna Custom (Tailwind)
```css
/* Gunakan class-class ini, jangan hardcode hex */
mbah-accent         → #f97316  /* CTA utama, link ke godev, border bailout */
mbah-accent-hover   → #ea580c  /* Hover state untuk mbah-accent */
```

### Tipografi Custom
```css
font-signature  → "Roboto Mono", monospace
/* Gunakan untuk: badge teknis, footer signature */
```

### Aturan Desain
- **Semua CTA ke godev WAJIB menggunakan `mbah-accent`**
- Bail-out box: border kiri `mbah-accent`, selalu ada di setiap halaman detail produk
- Footer signature: `"Engineered by Dody (mbah)"` dengan class `font-signature`

---

## 5. Content Collections — Zod Schema

### Collection: `produk`
```typescript
// src/content.config.ts
{
  title: z.string(),
  description: z.string(),
  harga: z.number(),                    // dalam Rupiah, tanpa titik/koma
  linkBeli: z.string().url(),           // link WA atau payment gateway
  linkDfy: z.string().url(),            // link ke godev dengan UTM
  stack: z.array(z.string()),           // ["Google Apps Script", "Gemini AI"]
  waktuDeploy: z.string(),              // "2-4 jam"
  estimasiSetup: z.string(),            // untuk TimeCalculator
  skillDibutuhkan: z.array(z.string()), // ["Git", "Apps Script API"]
  kategori: z.enum(["Google Apps Script", "AI Prompt", "Automation"]),
  thumbnail: image(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
  pubDatetime: z.date(),
  modDatetime: z.date().optional().nullable(),
  ogImage: image().or(z.string()).optional(),
  canonicalURL: z.string().optional(),
}
```

### Collection: `posts` (Blog/Tutorial)
```typescript
{
  author: z.string(),                   // default: dari site config
  pubDatetime: z.date(),
  modDatetime: z.date().optional().nullable(),
  title: z.string(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()),
  ogImage: image().or(z.string()).optional(),
  description: z.string(),
  canonicalURL: z.string().optional(),
  hideEditPost: z.boolean().optional(),
  timezone: z.string().optional(),
}
```

---

## 6. UTM Helper — ATURAN KERAS

> **CRITICAL: Semua URL yang mengarah ke godev.biz.id WAJIB dibuat menggunakan `UTMHelper.ts`. DILARANG hardcode URL godev di komponen manapun.**

```typescript
// src/utils/UTMHelper.ts
import { generateGodevUrl, getGodevUrlWithMessage } from "@/utils/UTMHelper";

// Contoh penggunaan:
generateGodevUrl("bailout", "nama-produk-slug")
// → "https://godev.biz.id/?utm_source=klikdev&utm_medium=bailout&utm_campaign=nama-produk-slug"

generateGodevUrl("sticky_banner", "homepage")
// → "https://godev.biz.id/?utm_source=klikdev&utm_medium=sticky_banner&utm_campaign=homepage"
```

### UTM Medium yang Valid
| Medium | Digunakan di Komponen |
|---|---|
| `bailout` | `BailoutCTA.astro` |
| `sticky_banner` | `StickyBanner.astro` |
| `calculator` | `TimeCalculator.astro` |
| `exit_popup` | `ExitIntentPopup.astro` |

---

## 7. Komponen Bailout — Panduan Singkat

### `BailoutCTA.astro`
- Props: `slug` (string) — untuk generate UTM campaign
- Selalu gunakan `generateGodevUrl("bailout", slug)` dari UTMHelper
- Style: tombol outline dengan warna `mbah-accent`

### `StickyBanner.astro`
- **Hanya** di `index.astro` (katalog), TIDAK di halaman lain
- Behavior: simpan state close di `localStorage` key `banner_closed`
- Aksesibel: keyboard-navigable, ada `aria-label`

### `TimeCalculator.astro`
- Posisi: di atas konten MDX, sebelum tab navigasi di `ProductLayout.astro`
- Data: baca dari frontmatter (`estimasiSetup`, `skillDibutuhkan`)
- CTA: gunakan `BailoutCTA` dengan `medium=calculator`

### `ExitIntentPopup.astro`
- Posisi: overlay fixed, di `ProductLayout.astro`
- Trigger: `mouseleave` event saat cursor keluar viewport dari atas
- Hanya muncul: 1x per session (localStorage key `exit_popup_shown`)
- Hanya aktif: desktop (`window.innerWidth > 768`), nonaktif di mobile
- Close: klik tombol, klik luar card, atau tekan `ESC`

---

## 8. Git Workflow

### Format Commit Message
```
feat(klikdev): [deskripsi singkat dalam bahasa Indonesia]
fix(klikdev): [deskripsi bug fix]
docs(klikdev): [perubahan dokumentasi]
refactor(klikdev): [refactor tanpa perubahan behavior]
```

### Cek Sebelum Commit
1. Pastikan `.env` dan `.env.local` ada di `.gitignore`
2. Jangan commit file `debug.log` atau artefak build di luar `dist/`
3. Jalankan `npm run format` sebelum commit

### Alur Kerja Per Fase
1. Kerjakan **1 fase** saja, lalu berhenti
2. Minta konfirmasi sebelum lanjut ke fase berikutnya
3. Ingatkan user untuk commit & push sebelum menutup sesi

---

## 9. Fase Eksekusi (Roadmap)

| Fase | Status | Deskripsi |
|---|---|---|
| Fase 1 | Selesai | Fondasi Tailwind & Schema MDX |
| Fase 2 | Selesai | Layout & Komponen Bailout |
| Fase 3 | Selesai | Halaman Beranda & Katalog |
| Fase 4 | Selesai | Halaman Detail Produk |
| Fase 5 | Selesai | SEO Teknis & AIO Optimization |
| Fase 6 | Pending | Cloudflare Deploy (`adapter: cloudflare`, `wrangler.toml`) |
| Fase R1 | Selesai | UTM Helper + Update Schema |
| Fase R2 | Selesai | Sticky Banner + Integrasi Katalog |
| Fase R3 | Selesai | Time Calculator + Exit Intent Popup |
| Fase R4 | Selesai | Refactor BailoutCTA pakai UTMHelper |

> **Fase berikutnya yang perlu dikerjakan: Fase 6 — Cloudflare Deploy**

---

## 10. Protokol Komunikasi untuk AI Agent

Ini adalah aturan yang WAJIB diikuti saat berinteraksi dengan pemilik proyek (Dody/mbah):

1. **Jangan gunakan jargon tanpa penjelasan.** Setiap istilah baru harus dijelaskan.
2. **Jujur soal risiko dan kesulitan.** Jangan memperhalus kompleksitas.
3. **Jangan klaim "berhasil" sebelum diverifikasi.** Tandai kode yang "belum dites".
4. **Tandai asumsi** dengan format: `[ASUMSI: ...]`
5. **Sebutkan trade-off,** bukan hanya kelebihan solusi.
6. **Boleh membantah** permintaan yang secara teknis kurang tepat.
7. **Hindari basa-basi pujian** — langsung ke substansi.
8. **Protokol error:** Jika error yang sama terjadi 3x, berhenti dan berikan hipotesis + 2 alternatif.

### Format Kode yang Diberikan
- **File BARU**: Berikan full code, tanpa placeholder.
- **File YANG SUDAH ADA**: Berikan diff presisi dengan format:
  ```
  File: [nama file]
  Lokasi: [posisi perubahan]
  
  TAMBAHKAN / GANTI / HAPUS:
  [kode yang berubah]
  
  (Konteks baris sebelum: ...)
  (Konteks baris sesudah: ...)
  ```
- **Jangan tulis ulang file utuh** jika hanya mengubah sebagian kecil.

---

## 11. Checklist Testing Manual (Sebelum Deploy)

- [ ] Sticky banner muncul di beranda katalog
- [ ] Sticky banner TIDAK muncul di halaman detail produk
- [ ] Close banner → refresh → banner tidak muncul lagi
- [ ] Time calculator muncul di atas konten MDX detail produk
- [ ] Time calculator baca data dari frontmatter (`estimasiSetup`, `skillDibutuhkan`)
- [ ] Exit-intent popup muncul saat cursor keluar viewport (desktop only)
- [ ] Exit-intent popup TIDAK muncul di mobile
- [ ] Popup hanya muncul 1x per session
- [ ] Semua tombol bailout punya UTM yang benar
- [ ] `utm_source=klikdev` konsisten di semua link
- [ ] `utm_medium` bervariasi: `sticky_banner`, `bailout`, `calculator`, `exit_popup`
- [ ] `utm_campaign` = slug produk atau `homepage`
- [ ] Build berhasil: `npm run build`
- [ ] Tidak ada file `.env` atau kredensial yang ter-commit ke git

---

## 12. Commands yang Sering Dipakai

```bash
# Development server
npm run dev

# Build production + pagefind index
npm run build

# Build untuk Windows (copy pagefind ke public)
npm run build:windows

# Format kode
npm run format

# Check format (tanpa write)
npm run format:check

# Lint
npm run lint

# Sync Astro types
npm run sync
```

---

*Dibuat dari `mega_prompt_klikdev.md` — Diperbarui: Juli 2026*
*Engineered by Dody (mbah)*
