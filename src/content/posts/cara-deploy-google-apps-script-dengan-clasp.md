---
title: "Cara Deploy Google Apps Script dengan Clasp (Tutorial Lengkap)"
description: "Panduan step-by-step deploy Google Apps Script menggunakan Clasp CLI, dari instalasi sampai automation dengan GitHub Actions."
pubDatetime: 2026-07-01T00:00:00Z
author: "dody [mbah]"
tags: ["Google Apps Script", "Clasp", "Tutorial", "Automation"]
featured: true
draft: false
---

## Apa itu Clasp?

**Clasp** (Command Line Apps Script Projects) adalah CLI resmi dari Google untuk mengelola project Apps Script dari terminal. Dengan Clasp, Anda bisa:

- Develop Apps Script pakai editor favorit (VS Code, Vim, dll)
- Pakai TypeScript (compile otomatis ke JavaScript)
- Version control dengan Git
- Deploy otomatis via CI/CD

**Jargon yang Perlu Diketahui:**

- **CLI (Command Line Interface)**: Program yang dijalankan lewat terminal/command prompt, bukan GUI
- **TypeScript**: Superset JavaScript dengan type checking, compile jadi JavaScript biasa
- **CI/CD**: Continuous Integration/Continuous Deployment - otomasi testing & deployment

## Prasyarat

Sebelum mulai, pastikan sudah install:

1. **Node.js v16+** ([Download di sini](https://nodejs.org/))
2. **npm** (otomatis terinstall bareng Node.js)
3. **Akun Google** dengan akses Apps Script

## Langkah 1: Install Clasp

Buka terminal, jalankan:

```bash
npm install -g @google/clasp
```

Verifikasi instalasi:

```bash
clasp --version
```

Jika muncul nomor versi (misal `2.4.2`), berarti berhasil.

## Langkah 2: Login ke Google

```bash
clasp login
```

Browser akan terbuka, pilih akun Google Anda, klik **Allow**. Setelah berhasil, terminal akan bilang "Authorization successful".

**Troubleshooting:**

- Jika error "browser tidak terbuka", coba `clasp login --no-localhost`
- Jika error "permission denied", pastikan akun Google Anda tidak dibatasi oleh admin workspace

## Langkah 3: Buat Project Baru

Ada 3 tipe project Apps Script:

| Tipe         | Fungsi                                       |
| ------------ | -------------------------------------------- |
| `standalone` | Script independen, tidak terikat file Google |
| `sheets`     | Terikat ke Google Sheets                     |
| `docs`       | Terikat ke Google Docs                       |

Untuk project standalone:

```bash
clasp create --type standalone --title "My First Script"
```

Clasp akan buat file `.clasp.json` (konfigurasi project) dan folder kosong.

## Langkah 4: Tulis Kode

Buat file `src/Code.ts`:

```typescript
function helloWorld() {
  Logger.log("Hello from Clasp!");
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Custom Menu")
    .addItem("Run Hello", "helloWorld")
    .addToUi();
}
```

**Penjelasan:**

- `Logger.log()`: Print output ke log Apps Script (bukan console browser)
- `onOpen()`: Trigger otomatis saat file dibuka
- `SpreadsheetApp.getUi()`: Akses UI Google Sheets untuk bikin custom menu

## Langkah 5: Push ke Apps Script

```bash
clasp push
```

File lokal Anda akan di-upload ke Apps Script cloud. Jika ada error TypeScript, Clasp akan berhenti dan kasih tahu error-nya.

## Langkah 6: Buka di Editor

```bash
clasp open
```

Browser akan buka Apps Script Editor. Di sana Anda bisa:

- Lihat kode yang di-push
- Setup trigger (onEdit, onFormSubmit, dll)
- Test function manual

## Langkah 7: Deploy sebagai Web App (Opsional)

Jika mau bikin Apps Script jadi API/web app:

```bash
clasp deploy --description "Version 1.0"
```

Clasp akan kasih deployment ID. Simpan ID ini untuk rollback atau update nanti.

## Workflow Harian

Setelah setup awal, workflow Anda jadi:

1. Edit kode di lokal (VS Code)
2. `clasp push` untuk upload
3. Test di Apps Script Editor
4. Commit ke Git
5. Ulangi

**Kelebihan workflow ini:**

- Pakai editor favorit (autocomplete, linting, dll)
- Version control dengan Git
- Bisa kerja offline

**Kekurangan/Risiko:**

- Harus manual `clasp push` tiap kali ubah kode (bisa lupa)
- Jika push tanpa test, bisa break production
- Perlu disiplin commit Git sebelum push

## Tips & Trik

### 1. Ignore File Tertentu

Buat file `.claspignore`:

```
node_modules/**
*.md
.git/**
```

File-file ini tidak akan di-push ke Apps Script.

### 2. TypeScript Configuration

Buat `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "ES2015",
    "lib": ["ES2019"]
  }
}
```

### 3. Automation dengan GitHub Actions

Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Apps Script

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g @google/clasp
      - run: echo "$CLASP_CREDENTIALS" > ~/.clasprc.json
        env:
          CLASP_CREDENTIALS: ${{ secrets.CLASP_CREDENTIALS }}
      - run: clasp push
```

**[ASUMSI: Anda sudah familiar dengan GitHub Actions. Jika belum, skip bagian ini dulu.]**

## FAQ

### Apakah Clasp gratis?

Ya, Clasp adalah open-source dan gratis. Tapi quota Apps Script tetap berlaku (6 menit execution time per trigger, 20,000 email per hari, dll).

### Bisa deploy ke multiple environments (dev/staging/prod)?

Tidak directly. Clasp hanya punya 1 `.clasp.json` per folder. Solusi: buat 3 folder berbeda atau pakai deployment ID untuk switch.

### Bagaimana cara rollback deployment?

Clasp tidak punya command rollback. Anda harus manual di Apps Script Editor → Manage Deployments → pilih versi lama.

### Apakah bisa collaborative coding dengan tim?

Ya, asalkan semua anggota tim punya akses Editor ke Apps Script project yang sama. Tapi hati-hati conflict jika push bersamaan.

---

**Butuh bantuan setup yang lebih kompleks?** Saya (mbah) bisa kerjakan secara Done-For-You, termasuk CI/CD pipeline, testing, dan monitoring. [Lihat layanan DFY →](https://godev.id/dfy?utm_source=klikdev&utm_medium=blog&utm_campaign=clasp-tutorial)
</content>
