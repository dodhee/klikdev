# Markdown Cheat Sheet untuk KlikDev

**Panduan cepat menulis konten produk dengan Markdown**

---

## 📝 Syntax Dasar (Yang Paling Sering Dipakai)

### 1. Headings (Judul)

```markdown
# Heading 1 (Judul Utama)
## Heading 2 (Sub Judul)
### Heading 3 (Sub-sub Judul)
```

**Kapan pakai:**
- `#` → Judul section utama (contoh: "Fitur Utama")
- `##` → Sub-section (contoh: "Cara Kerja")
- `###` → Detail dalam section (contoh: "Step 1: Install")

**Aturan:**
- ✅ Harus ada spasi setelah `#`
- ✅ Satu baris kosong sebelum dan sesudah heading
- ❌ Jangan gunakan heading 4-6 (terlalu kecil)

---

### 2. Text Formatting (Bold, Italic)

```markdown
**teks tebal (bold)**
*teks miring (italic)*
***teks tebal dan miring***
```

**Contoh real:**
```markdown
Produk ini **gratis selamanya**, tidak ada biaya langganan.
*Catatan: Butuh akun Google Workspace*
```

**Output:**
Produk ini **gratis selamanya**, tidak ada biaya langganan.
*Catatan: Butuh akun Google Workspace*

**Kapan pakai:**
- `**bold**` → Highlight info penting, angka, fitur utama
- `*italic*` → Catatan, disclaimer, penekanan ringan

---

### 3. Lists (Daftar)

#### Bullet Points (Unordered List)

```markdown
- Item 1
- Item 2
- Item 3
  - Sub-item 3.1 (indent 2 spasi)
  - Sub-item 3.2
```

**Output:**
- Item 1
- Item 2
- Item 3
  - Sub-item 3.1
  - Sub-item 3.2

#### Numbered List (Ordered List)

```markdown
1. Step pertama
2. Step kedua
3. Step ketiga
```

**Output:**
1. Step pertama
2. Step kedua
3. Step ketiga

**Kapan pakai:**
- Bullet points → Fitur, keuntungan, target audience
- Numbered list → Tutorial step-by-step, cara kerja

---

### 4. Links (Tautan)

```markdown
[Teks yang diklik](https://url-tujuan.com)
```

**Contoh:**
```markdown
Beli sekarang di [Shopee](https://shopee.co.id/produk-anda)
Lihat [dokumentasi lengkap](https://docs.klikdev.com)
```

**Output:**
Beli sekarang di [Shopee](https://shopee.co.id/produk-anda)
Lihat [dokumentasi lengkap](https://docs.klikdev.com)

**Tips:**
- Link eksternal otomatis buka tab baru
- Bisa pakai link relatif: `[Produk lain](/katalog)`

---

### 5. Images (Gambar)

```markdown
![Alt text](/path/to/image.jpg)
```

**Contoh untuk produk:**
```markdown
![Google Sheets Automation Dashboard](/src/images/produk/dashboard-preview.jpg)
```

**Aturan:**
- `![...]` → Tanda seru di depan (beda sama link biasa)
- Alt text → Deskripsi gambar untuk SEO & accessibility
- Path → Selalu mulai dari `/src/images/`

---

### 6. Code Blocks (Untuk Snippet)

#### Inline Code

```markdown
Gunakan fungsi `=VLOOKUP()` untuk mencari data.
```

**Output:**
Gunakan fungsi `=VLOOKUP()` untuk mencari data.

#### Multi-line Code Block

````markdown
```javascript
function helloWorld() {
  console.log("Hello KlikDev!");
}
```
````

**Output:**
```javascript
function helloWorld() {
  console.log("Hello KlikDev!");
}
```

**Kapan pakai:**
- Inline code → Nama fungsi, variable, command
- Code block → Script lengkap, contoh konfigurasi

---

### 7. Blockquotes (Kutipan)

```markdown
> Ini adalah quote atau catatan penting
```

**Output:**
> Ini adalah quote atau catatan penting

**Contoh real:**
```markdown
> **Catatan**: Template ini butuh Google Workspace, tidak support Microsoft Excel.
```

**Output:**
> **Catatan**: Template ini butuh Google Workspace, tidak support Microsoft Excel.

---

### 8. Horizontal Rule (Garis Pemisah)

```markdown
---
```

**Output:**
Garis horizontal untuk memisahkan section besar.

**Kapan pakai:**
- Antara section utama (Fitur → Cara Kerja)
- Sebelum FAQ atau Testimonial

---

### 9. Tables (Tabel - Jarang Pakai)

```markdown
| Fitur | Basic | Pro |
|-------|-------|-----|
| Template | 5 | 50 |
| Support | Email | WA + Email |
```

**Output:**

| Fitur | Basic | Pro |
|-------|-------|-----|
| Template | 5 | 50 |
| Support | Email | WA + Email |

**Tips:**
- Gunakan jika perlu perbandingan 2-3 produk
- Untuk list biasa, pakai bullet points saja (lebih simple)

---

## ✅ Checklist Icons (Copy-Paste)

Gunakan emoji untuk checklist:

```markdown
- ✅ Fitur yang ada
- ❌ Fitur yang tidak ada
- 🔥 Fitur premium
- 💡 Tips
- ⚠️ Warning/Perhatian
- 📧 Email
- 💬 Chat/WhatsApp
- 🛒 Pembelian
- 📦 Deliverable
- 🚀 Launch/Deploy
```

**Contoh:**
```markdown
### Siapa yang cocok?

- ✅ UMKM dengan 5-50 karyawan
- ✅ Freelancer yang manage multiple clients
- ❌ Enterprise dengan 1000+ employees
```

---

## 🎯 Best Practices untuk Konten Produk

### 1. Struktur Umum

Ikuti urutan ini (sudah ada di template):

```
1. Apa itu [Produk]? (2-3 kalimat pembuka)
2. Masalah yang Diselesaikan (pain points)
3. Fitur Utama (4-6 fitur)
4. Siapa yang Cocok? (target audience)
5. Stack Teknologi (penjelasan teknis)
6. Cara Kerja (step-by-step)
7. Yang Anda Dapatkan (deliverables)
8. FAQ
9. Harga & Pembelian
10. Kontak & Support
```

### 2. Panjang Ideal

- **Total konten**: 800-1500 kata
- **Paragraf**: Max 3-4 kalimat
- **List item**: 1-2 kalimat per item
- **Section heading**: Max 5 kata

### 3. Tone of Voice

```markdown
✅ Gunakan: "Anda", "kita", active voice
❌ Hindari: "pengguna", "user", passive voice

✅ Contoh bagus:
"Anda bisa deploy automation dalam 5 menit tanpa coding."

❌ Contoh buruk:
"Automation dapat di-deploy oleh pengguna dalam waktu 5 menit."
```

### 4. Formatting Tips

- Gunakan **bold** untuk highlight info penting (max 2-3 per paragraf)
- Gunakan bullet points untuk list >3 items
- Satu baris kosong antara paragraf
- Dua baris kosong antara section besar (opsional)

---

## 🛠️ Tools untuk Mempermudah

### 1. VS Code Extensions (Recommended)

Install extensions ini untuk memudahkan editing:

- **Markdown All in One** → Preview live, keyboard shortcuts
- **Markdown Lint** → Auto-correct formatting issues
- **Paste Image** → Paste screenshot langsung jadi file

### 2. Preview di VS Code

Cara lihat preview saat edit:

1. Buka file `.mdx`
2. Tekan `Ctrl+Shift+V` (Windows) atau `Cmd+Shift+V` (Mac)
3. Preview muncul di tab sebelah

### 3. Dev Server

Lihat hasil real di browser:

```bash
npm run dev
```

Buka `http://localhost:4321/produk/nama-produk`

---

## 🚨 Common Mistakes (Kesalahan Umum)

### 1. Lupa Spasi Setelah `#`

```markdown
❌ #Heading tanpa spasi
✅ # Heading dengan spasi
```

### 2. Tidak Konsisten dengan List Marker

```markdown
❌ Campur bullet styles:
- Item 1
* Item 2
+ Item 3

✅ Konsisten:
- Item 1
- Item 2
- Item 3
```

### 3. Link Image Salah

```markdown
❌ ![](/images/produk/gambar.jpg)  → Path salah
✅ ![](/src/images/produk/gambar.jpg)  → Path benar
```

### 4. Lupa Frontmatter di Awal File

Frontmatter harus selalu di line 1:

```markdown
---
title: "Nama Produk"
...
---

## Konten dimulai di sini
```

---

## 📚 Resources Tambahan

### Belajar Markdown (5-10 menit)

- [Markdown Guide](https://www.markdownguide.org/basic-syntax/) → Official guide
- [Markdown Tutorial](https://www.markdowntutorial.com/) → Interactive practice
- [Cheatsheet PDF](https://www.markdownguide.org/cheat-sheet/) → Printable reference

### Contoh Produk Lengkap

Lihat file-file ini sebagai referensi:

1. `src/content/produk/google-sheets-automation-engine.mdx` → Produk software
2. `src/content/produk/gemini-prompt-library.mdx` → Produk digital content

---

## 🎓 Quick Exercise (Latihan 5 Menit)

Coba tulis section "Fitur Utama" untuk produk fiktif:

**Produk**: Email Automation untuk UMKM  
**Fitur**: Auto-reply, Scheduled email, Template library

**Tulis dengan format:**
```markdown
## Fitur Utama

### 1. [Nama Fitur]
[Penjelasan 1-2 kalimat]

### 2. [Nama Fitur]
[Penjelasan 1-2 kalimat]

### 3. [Nama Fitur]
[Penjelasan 1-2 kalimat]
```

Bandingkan dengan contoh di template! 🚀

---

## 💬 Need Help?

Jika ada syntax yang bingung:

1. Cek template `_TEMPLATE.mdx` → Ada contoh lengkap
2. Lihat produk existing → Copy structure yang sudah ada
3. Tanya saya (mbah) → Saya bantu troubleshoot

**Ingat**: Markdown itu simpel. 90% konten produk cuma pakai 5 syntax:
- Headings (`#`)
- Bold (`**`)
- Lists (`-`)
- Links (`[]()`)
- Line breaks (enter 2x)

Happy writing! ✍️
</contents>