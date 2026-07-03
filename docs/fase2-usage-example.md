# Fase 2 - Contoh Penggunaan ProductLayout & BailoutCTA

## ProductLayout.astro

### Cara Pakai di Halaman Detail Produk

```astro
---
// src/pages/products/[slug].astro
import { getCollection } from "astro:content";
import ProductLayout from "@/layouts/ProductLayout.astro";
import Header from "@/components/Header.astro";
import Footer from "@/components/Footer.astro";
import BailoutCTA from "@/components/BailoutCTA.astro";
import Breadcrumb from "@/components/Breadcrumb.astro";
import Datetime from "@/components/Datetime.astro";

export async function getStaticPaths() {
  const produkEntries = await getCollection("produk");
  return produkEntries.map(entry => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const { data } = entry;
---

<ProductLayout
  title={data.title}
  description={data.description}
  harga={data.harga}
  linkBeli={data.linkBeli}
  linkDfy={data.linkDfy}
  stack={data.stack}
  waktuDeploy={data.waktuDeploy}
  kategori={data.kategori}
  thumbnail={data.thumbnail}
  ogImage={data.ogImage}
  canonicalURL={data.canonicalURL}
  pubDatetime={data.pubDatetime}
  modDatetime={data.modDatetime}
>
  <Header />
  
  <main class="app-layout">
    <!-- Breadcrumb -->
    <Breadcrumb 
      items={[
        { label: 'Home', url: '/' },
        { label: 'Produk', url: '/produk' },
        { label: data.title }
      ]} 
    />

    <!-- Hero Section -->
    <section class="border-b border-border py-8">
      <h1 class="text-4xl font-bold mb-4">{data.title}</h1>
      
      <!-- Harga & CTA -->
      <div class="flex items-center gap-4 mb-4">
        <span class="text-3xl font-bold text-mbah-accent">
          Rp {data.harga.toLocaleString('id-ID')}
        </span>
        <a 
          href={data.linkBeli}
          target="_blank"
          class="bg-mbah-accent hover:bg-mbah-accent-hover text-white px-6 py-3 rounded-md font-semibold"
        >
          Beli Sekarang
        </a>
        <BailoutCTA 
          productSlug={entry.id} 
          linkDfy={data.linkDfy} 
          variant="default" 
        />
      </div>

      <!-- Metadata -->
      <div class="flex gap-4 text-sm text-muted-foreground">
        <Datetime datetime={data.pubDatetime} size="sm" />
        <span>⏱️ Deploy: {data.waktuDeploy}</span>
        <span>📁 {data.kategori}</span>
      </div>

      <!-- Tech Stack Badges -->
      <div class="flex flex-wrap gap-2 mt-4">
        {data.stack.map(tech => (
          <span class="bg-muted text-foreground px-3 py-1 rounded-full text-sm font-signature">
            {tech}
          </span>
        ))}
      </div>
    </section>

    <!-- Konten MDX -->
    <article class="prose dark:prose-invert max-w-none py-8">
      <Content />
    </article>

    <!-- Bail-out CTA Box (di akhir konten) -->
    <BailoutCTA 
      productSlug={entry.id} 
      linkDfy={data.linkDfy} 
      variant="box" 
    />
  </main>

  <Footer />
</ProductLayout>
```

## BailoutCTA.astro

### Props

| Prop | Type | Required | Default | Deskripsi |
|------|------|----------|---------|------------|
| `productSlug` | `string` | ✅ | - | Slug produk untuk UTM campaign |
| `linkDfy` | `string` | ✅ | - | URL layanan DFY di godev |
| `variant` | `"default" \| "box"` | ❌ | `"default"` | Tampilan CTA |

### Variant: `default`

Tombol inline, cocok untuk di hero section:

```astro
<BailoutCTA 
  productSlug="google-sheets-automation-engine" 
  linkDfy="https://godev.id/dfy/sheets-automation" 
  variant="default" 
/>
```

**Output:**
```
[Pusing Setup-nya? Saya yang Kerjakan (DFY) →]
```

### Variant: `box`

Box dengan border accent, cocok untuk di akhir konten:

```astro
<BailoutCTA 
  productSlug="google-sheets-automation-engine" 
  linkDfy="https://godev.id/dfy/sheets-automation" 
  variant="box" 
/>
```

**Output:**
```
┌─────────────────────────────────────────┐
│ Butuh yang Skala Enterprise?            │
│                                         │
│ Script ini murni untuk DIY...           │
│                                         │
│ [Lihat Layanan DFY Saya →]              │
└─────────────────────────────────────────┘
```

### UTM Parameters (Auto-Generated)

BailoutCTA otomatis menambahkan UTM parameters:

```
Input:
  linkDfy: "https://godev.id/dfy/sheets-automation"
  productSlug: "google-sheets-automation-engine"

Output URL:
  https://godev.id/dfy/sheets-automation?utm_source=klikdev&utm_medium=bailout&utm_campaign=google-sheets-automation-engine
```

**Manfaat untuk Tracking:**
- Tahu berapa banyak user yang klik dari klikdev ke godev
- Tahu produk mana yang paling banyak convert ke DFY
- Bisa optimize copywriting bailout CTA per produk

## Fitur SEO/AIO di ProductLayout

### 1. Schema JSON-LD Product

Otomatis generate schema `Product` yang sesuai standar Schema.org:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Google Sheets Automation Engine",
  "description": "Sistem otomasi...",
  "offers": {
    "@type": "Offer",
    "price": 250000,
    "priceCurrency": "IDR",
    "availability": "https://schema.org/InStock"
  },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Waktu Deploy", "value": "15-30 menit" },
    { "@type": "PropertyValue", "name": "Tech Stack", "value": "Google Apps Script" }
  ]
}
```

**Manfaat:**
- Google Rich Snippets (harga tampil di hasil search)
- AI (ChatGPT/Gemini) bisa extract data terstruktur
- E-commerce platform bisa crawl produk Anda

### 2. Open Graph Meta Tags

Otomatis set `og:type` ke `product` dan tambahkan price metadata:

```html
<meta property="og:type" content="product" />
<meta property="product:price:amount" content="250000" />
<meta property="product:price:currency" content="IDR" />
```

**Manfaat:**
- Share di Facebook/LinkedIn tampil sebagai produk (bukan artikel)
- Harga tampil di preview card

### 3. Reusable Components

ProductLayout menggunakan komponen yang sama dengan PostLayout:

- `Layout.astro` - Base layout dengan meta tags
- `Breadcrumb.astro` - Navigasi (nanti di Fase 4)
- `Datetime.astro` - Format tanggal konsisten
- `Header.astro` & `Footer.astro` - Konsisten di semua halaman

**Tidak ada duplikasi code!**

## Testing

Setelah Fase 4 selesai (halaman detail produk), Anda bisa test:

1. **Schema Validator**: https://validator.schema.org/
   - Copy HTML output
   - Paste di validator
   - Pastikan tidak ada error

2. **Open Graph Debugger**: https://developers.facebook.com/tools/debug/
   - Input URL produk
   - Cek apakah type = "product"
   - Cek apakah harga muncul

3. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Input URL produk
   - Pastikan detect sebagai "Product"

## Kustomisasi

### Ubah Format Harga

Edit function `formatRupiah` di `ProductLayout.astro`:

```typescript
// Default: Rp250.000
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Custom: Rp 250K
const formatRupiah = (amount: number) => {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}K`;
  }
  return `Rp ${amount}`;
};
```

### Tambah Field Baru di Schema

Edit `structuredData` di `ProductLayout.astro`:

```typescript
const structuredData = {
  // ... existing fields
  "brand": {
    "@type": "Brand",
    "name": "klikdev by mbah"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5"
    }
  }
};
```

## Troubleshooting

### Error: "Property 'harga' does not exist"

Pastikan MDX produk punya field `harga` di frontmatter:

```yaml
---
title: "..."
harga: 250000  # Harus ada!
---
```

### UTM Parameters Tidak Muncul

Cek `linkDfy` di frontmatter MDX sudah benar:

```yaml
# ❌ Salah (relative path)
linkDfy: "/dfy/sheets-automation"

# ✅ Benar (full URL)
linkDfy: "https://godev.id/dfy/sheets-automation"
```

### BailoutCTA Tidak Muncul

Cek import di halaman detail produk:

```astro
---
import BailoutCTA from "@/components/BailoutCTA.astro"; // Harus ada!
---

<BailoutCTA productSlug={entry.id} linkDfy={data.linkDfy} />
```
</content>