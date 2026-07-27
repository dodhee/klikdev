# AGENT.md — Panduan untuk AI Coding Assistant (klikdev)

> File ini adalah instruksi wajib bagi AI agent (Copilot, Cursor, Gemini, Claude, dsb.) yang bekerja di repo ini.
> Baca seluruh file ini sebelum mengerjakan task apapun.
> Sumber kebenaran tambahan: `docs/mega_prompt_klikdev.md`
> **Docs bisa stale — file live di repo menang.**

---

## 1. Ringkasan Proyek

**klikdev** = marketplace aset digital DIY di atas template **AstroPaper**.
- URL produksi: https://klikdev.my.id
- Preview CF: https://klikdev.pages.dev
- Owner: Dody (alias "mbah")
- Brand sister: **godev** (https://godev.biz.id) — jasa Done-For-You (DFY). klikdev = corong/funnel ke godev.

### Produk dijual
- Google Apps Script (otomasi Google Workspace)
- AI Prompt (Gemini-based)
- Automation Systems
- Web Development

### Tech stack (dari `package.json`, verifikasi live)

| Teknologi | Versi | Catatan |
|---|---|---|
| Astro | ^6.4.8 | Framework utama |
| Tailwind CSS | ^4.3.2 | Via `@tailwindcss/vite` |
| MDX | ^6.0.3 | Konten produk & blog |
| ShikiJS | ^4.3.1 | Syntax highlighting |
| Decap CMS | ^3.14.1 | Editor → `src/content/` |
| Pagefind | ^1.5.2 | Client-side search |
| TypeScript | ^6.0.3 | Strict mode |
| Node | >=22.12.0 | `engines` di package.json |

**Package manager wajib: `npm`** — jangan `pnpm` / `yarn`.

Repo: `dodhee/klikdev`, branch production: **`main`**.

---

## 2. Status Proyek Terkini

**Semua fase utama + revisi funnel + tech debt antrian 1–4 + purge template selesai. Site & CMS live.**

Build lokal terakhir (Juli 2026): `astro build` 16 page exit 0 + pagefind OK.

### Fitur selesai

| Fase | Status | Bukti di repo |
|---|---|---|
| Fase 1 | ✅ | Schema MDX, content collections, produk MDX |
| Fase 2 | ✅ | `ProductLayout.astro`, `BailoutCTA.astro` |
| Fase 3 | ✅ | `src/pages/index.astro`, `katalog.astro`, `ProductCard.astro` |
| Fase 4 | ✅ | `src/pages/produk/[slug].astro` |
| Fase 5 | ✅ | JSON-LD schemas, sitemap, `robots.txt` |
| Fase 6 | ✅ | Live Cloudflare Pages — https://klikdev.my.id (static build, tanpa adapter SSR) |
| Fase R1 | ✅ | `estimasiSetup` + `skillDibutuhkan` di schema + Decap + frontmatter MDX |
| Fase R2 | ✅ | `StickyBanner.astro` |
| Fase R3 | ✅ | `TimeCalculator.astro`, `ExitIntentPopup.astro` |
| Fase R4 | ✅ | `src/utils/UTMHelper.ts` + BailoutCTA |
| Decap CMS | ✅ | Live — `/admin`, GitHub backend, OAuth via `klikdev-oauth-proxy.vercel.app` |

### Tech debt / cleanup (selesai)

| Item | Status | Catatan |
|---|---|---|
| Schema ganda | ✅ | Sumber tunggal: `src/content.config.ts`. Legacy `src/content/config.ts` **dihapus**. |
| Enum `kategori` | ✅ | 4 nilai sinkron di schema + Decap + docs: `"Google Apps Script"`, `"AI Prompt"`, `"Automation"`, `"Web Development"`. |
| TimeCalculator data | ✅ | `[slug].astro` baca `estimasiSetup`/`skillDibutuhkan` dari collection frontmatter. Map hardcoded dihapus. |
| Konten template | ✅ | Blog demo AstroPaper + docs fase/cheatsheet dihapus. |
| About page | ✅ | `src/content/pages/about.md` copy KlikDev (bukan AstroPaper). |
| Root README | ➖ Skip | Bawaan AstroPaper — tidak di-restore. |
| Panduan agent | ✅ | **`/agent.md`** di root (bukan `docs/agent.md`). |

### Konten live

**Produk** (`src/content/produk/`):
- `google-sheets-automation-engine-optimized.mdx`
- `google-sheets-watchdog-premium.mdx`
- `gemini-prompt-library.mdx`

**Blog** (`src/content/posts/`):
- `cara-deploy-google-apps-script-dengan-clasp.md` (satu-satunya post; demo theme dihapus)

**Pages**:
- `src/content/pages/about.md` — copy KlikDev

### Docs yang dipertahankan (`docs/`)
- `mega_prompt_klikdev.md`, `CONTENT-CREATION-GUIDE.md`, `DEPLOYMENT.md`
- `GOOGLE_ANALYTICS_SETUP.md`, `GOOGLE_SEARCH_CONSOLE_SETUP.md`
- `PAGEFIND_INTEGRATION.md`, `SEO_AIO_AUDIT_PRODUK.md`, `TESTIMONIAL-WHATSAPP-SETUP-LENGKAP.md`

### Jangan dihapus
- `oauth-proxy/` — OAuth Decap live (Vercel)
- Produk MDX, UTMHelper, komponen funnel (BailoutCTA, StickyBanner, TimeCalculator, ExitIntentPopup)

---

## 3. Instruksi Pengkodingan & Perintah Utama

```bash
# Install
npm install

# Dev server → http://localhost:4321
npm run dev

# Build production + Pagefind index → dist/
npm run build

# Build Windows (copy pagefind ke public/)
npm run build:windows

# Lint / format
npm run lint
npm run format
npm run format:check

# Sync tipe Astro
npm run sync
```

### Deploy (Cloudflare Pages) — **sudah live**
- Build command: `npm run build`
- Output: `dist`
- Branch: `main`
- Node: `22.12.0`
- Detail: `docs/DEPLOYMENT.md`
- Custom domain: `klikdev.my.id`

### Git
```
feat(klikdev): ...
fix(klikdev): ...
docs(klikdev): ...
chore(klikdev): ...
```
- Sebelum commit: cek `.env` tidak ikut; `debug.log` di `.gitignore`

---

## 4. Struktur Folder Kunci

```
klikdev/
├── agent.md                 # File ini (root)
├── astro.config.ts
├── astro-paper.config.ts
├── package.json
├── docs/                    # Hanya docs ops klikdev (bukan fase scratch)
├── public/
│   └── admin/               # Decap CMS (config.yml, index.html)
├── oauth-proxy/             # OAuth helper (Vercel) — JANGAN HAPUS
└── src/
    ├── components/          # BailoutCTA, StickyBanner, TimeCalculator, ExitIntentPopup, ...
    ├── content/
    │   ├── produk/          # Collection produk (MDX)
    │   ├── posts/           # Blog (hanya konten klikdev)
    │   └── pages/           # about.md, dll
    ├── content.config.ts    # Zod schema Astro Content Layer (SUMBER TUNGGAL)
    ├── layouts/
    ├── pages/
    │   ├── index.astro
    │   ├── katalog.astro
    │   ├── about.astro
    │   └── produk/[slug].astro
    └── utils/
        └── UTMHelper.ts
```

**Jangan buat ulang** `src/content/config.ts` (legacy dihapus).

---

## 5. Konvensi Kode (untuk AI Agent)

### Diagnosis layer-first
1. Baca file live (`git status`, `git diff`, config aktual) **sebelum** plan besar.
2. Docs bisa stale — runtime/file menang.
3. Jangan re-scaffold kalau cuma docs drift.
4. Jangan hapus `node_modules/` / `.vscode/` tanpa perlu.

### Design system
```
mbah-accent         #f97316   → CTA utama, link godev, border bailout
mbah-accent-hover   #ea580c
font-signature      "Roboto Mono", monospace → badge teknis, footer
```
Footer signature: `Engineered by Dody (mbah)` + `font-signature`.

### UTM — ATURAN KERAS
Semua URL ke `godev.biz.id` **wajib** lewat `src/utils/UTMHelper.ts`.
Dilarang hardcode URL godev di komponen.

```ts
import { generateGodevUrl, generateGodevHargaUrl } from "@/utils/UTMHelper";
generateGodevUrl("bailout", slug);
generateGodevHargaUrl("calculator", slug);
```

| Medium | Komponen |
|---|---|
| `bailout` | BailoutCTA |
| `sticky_banner` | StickyBanner (hanya beranda `index`, **bukan** `/katalog`) |
| `calculator` | TimeCalculator |
| `exit_popup` | ExitIntentPopup |

### Schema produk (live)
Sumber tunggal: **`src/content.config.ts`**.

Field: `title`, `description`, `harga`, `linkBeli`, `linkDfy`, `stack`, `waktuDeploy`, **`estimasiSetup`**, **`skillDibutuhkan`**, `kategori`, `thumbnail`, `featured?`, `draft?`, `pubDatetime`, `modDatetime?`, `ogImage?`, `canonicalURL?`.

Enum `kategori`:
`"Google Apps Script" | "AI Prompt" | "Automation" | "Web Development"`

TimeCalculator di `[slug].astro`:
```ts
const { estimasiSetup, skillDibutuhkan } = data;
// → props ke <TimeCalculator />
```
Jangan hardcode map per-slug.

### Path routing
- Detail produk: `/produk/<slug>`
- Thumbnail Decap: `src/images/produk/`

### Decap CMS
- Backend GitHub, repo `dodhee/klikdev`, branch `main`
- `base_url`: `https://klikdev-oauth-proxy.vercel.app`
- Fields: `estimasiSetup`, `skillDibutuhkan`, kategori 4 opsi
- Secret hanya di dashboard — jangan paste di chat

### Protokol komunikasi (pemilik = pemula Astro)
1. Jangan jargon tanpa jelasin.
2. Jujur risiko/kesulitan.
3. Jangan klaim berhasil sebelum diverifikasi.
4. Asumsi: `[ASUMSI: ...]`
5. Trade-off, bukan cuma kelebihan.
6. Boleh bantah request teknis salah.
7. Tanpa basa-basi pujian.
8. Error sama 3x → stop, hipotesis + 2 alternatif.
9. File baru = full code. File lama = diff presisi.
10. Spec fase di `docs/mega_prompt_klikdev.md` = historis; status aktual = bagian 2 file ini.

### Jangan disentuh sembarangan
- `.env` / secret
- `node_modules/`, `dist/`
- `oauth-proxy/` (kecuali task OAuth eksplisit)

---

## 6. Checklist Testing Manual

- [x] Site live CF + custom domain
- [x] Decap CMS login & edit normal
- [x] TimeCalculator dari frontmatter collection (bukan map hardcoded)
- [x] Enum kategori 4 nilai sinkron schema ↔ Decap
- [x] Schema tunggal `src/content.config.ts`
- [x] About page copy KlikDev
- [x] Blog demo AstroPaper dihapus; sisa 1 post klikdev
- [x] `npm run build` lokal sukses (16 page)
- [x] Sticky banner di **beranda** (`index.astro`) saja — **bukan** di `/katalog`; close persist localStorage
- [x] Exit-intent: desktop only, 1x/session
- [x] Semua bailout: `utm_source=klikdev`, medium valid, campaign = slug/`homepage`
- [x] Tidak ada `.env` / kredensial di git

---

*Update: checklist §6 sinkron fakta live (sticky = beranda, bukan katalog). Tech debt 1–4 + purge + about KlikDev + build hijau (Juli 2026).*
*Engineered by Dody (mbah)*
