# Setup Google Analytics 4 untuk KlikDev

## Langkah 1: Buat Property GA4

1. Buka https://analytics.google.com
2. Login dengan akun Google Anda
3. Klik **Admin** (icon gear di kiri bawah)
4. Di kolom **Property**, klik **Create Property**
5. Isi form:
   - **Property name**: `klikdev`
   - **Reporting time zone**: `(GMT+07:00) Jakarta`
   - **Currency**: `Indonesian Rupiah (IDR)`
6. Klik **Next**
7. Pilih **Industry category**: `Technology`
8. Pilih **Business size**: Sesuai kebutuhan
9. Centang **Business objectives**: ☑ `Generate leads`
10. Klik **Create** → **I Accept**

## Langkah 2: Setup Web Data Stream

1. Pilih platform: **Web**
2. Isi:
   - **Website URL**: `https://klikdev.my.id`
   - **Stream name**: `klikdev web`
3. Klik **Create stream**
4. **CATAT Measurement ID** (format: `G-XXXXXXXXXX`)

## Langkah 3: Install GA4 di KlikDev

1. Buat file `.env` di root project (jika belum ada):
   ```bash
   touch .env
   ```

2. Tambahkan Measurement ID ke `.env`:
   ```env
   PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   (Ganti `G-XXXXXXXXXX` dengan Measurement ID Anda dari langkah 2.4)

3. Pastikan `.env` sudah ada di `.gitignore` (sudah otomatis jika pakai Astro template)

4. Restart dev server:
   ```bash
   npm run dev
   ```

## Langkah 4: Test GA4 Tracking

1. Buka browser: `http://localhost:4321`
2. Buka **Developer Tools** → **Console**
3. Cek apakah ada error terkait gtag (jika tidak ada = berhasil)
4. Buka Google Analytics → **Reports** → **Realtime**
5. Klik beberapa link bailout di klikdev (StickyBanner, BailoutCTA, dll)
6. Tunggu 10-30 detik, cek di GA4 Realtime apakah ada event `click_bailout`

## Event yang Ditrack

Setiap klik tombol bailout akan mengirim event `click_bailout` dengan parameter:

| Parameter       | Contoh Value                          |
|-----------------|---------------------------------------|
| event_category  | `engagement`                          |
| event_label     | `bailout_google-sheets-automation`    |
| utm_medium      | `bailout`                             |
| utm_campaign    | `google-sheets-automation`            |
| outbound_url    | `godev.biz.id`                        |

## Dashboard yang Perlu Dibuat di GA4

Setelah 1-2 minggu ada traffic, buat custom report:

1. **Bailout Performance by Medium**
   - Dimension: `utm_medium`
   - Metric: `event_count` (filter: `event_name = click_bailout`)
   - Chart: Bar chart

2. **Bailout Performance by Product**
   - Dimension: `utm_campaign`
   - Metric: `event_count`
   - Chart: Table

3. **Conversion Funnel**
   - Step 1: Page view (katalog)
   - Step 2: Page view (detail produk)
   - Step 3: Event `click_bailout`

## Troubleshooting

### GA4 tidak muncul di Realtime
- Cek apakah `.env` sudah benar (restart dev server setelah edit)
- Cek Console browser apakah ada error gtag
- Pastikan Measurement ID benar (format `G-XXXXXXXXXX`)

### Event `click_bailout` tidak tercatat
- Cek apakah fungsi `trackGodevClick()` terpanggil (tambahkan `console.log` di fungsi)
- Pastikan GA4 sudah terinstall dengan benar
- Tunggu 10-30 detik (GA4 ada delay)

### Data tidak muncul di Reports (hanya Realtime)
- Data baru muncul di Reports setelah 24-48 jam
- Gunakan Realtime untuk testing

## Privacy & GDPR Compliance

GA4 di klikdev sudah dikonfigurasi dengan:
- `anonymize_ip: true` (IP address dianonimkan)
- Tidak ada cookie tracking untuk user yang belum consent

Jika ingin lebih strict (GDPR full compliance), tambahkan cookie consent banner.
</content>