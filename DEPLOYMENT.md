# Deployment Guide - KlikDev to Cloudflare Pages

## Prerequisites

- Akun Cloudflare (gratis)
- Domain `klikdev.my.id` sudah ditambahkan ke Cloudflare
- Repo GitHub `dodhee/klikdev` accessible

---

## Build Configuration

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
dist
```

**Node.js version:**
```
22.12.0
```

**Environment variables (jika ada):**
```
PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

---

## Deployment Steps

### Step 1: Login ke Cloudflare Dashboard

1. Buka: https://dash.cloudflare.com
2. Login dengan akun Anda

### Step 2: Create New Pages Project

1. Klik **"Workers & Pages"** di sidebar kiri
2. Klik tab **"Pages"**
3. Klik tombol **"Create application"**
4. Pilih **"Connect to Git"**

### Step 3: Connect GitHub Repository

1. Authorize Cloudflare untuk akses GitHub (jika belum)
2. Pilih repository: **`dodhee/klikdev`**
3. Klik **"Begin setup"**

### Step 4: Configure Build Settings

**Project name:**
```
klikdev
```
(Ini akan jadi subdomain: `klikdev.pages.dev`)

**Production branch:**
```
main
```

**Framework preset:**
- Pilih **"Astro"** (auto-detect)

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
dist
```

**Root directory (optional):**
- Leave empty (root of repo)

**Environment variables:**
- Klik **"Add variable"** jika perlu (opsional untuk sekarang)

### Step 5: Deploy

1. Klik **"Save and Deploy"**
2. Tunggu build process (2-3 menit)
3. Status akan berubah dari **Building** → **Success**

### Step 6: Setup Custom Domain

1. Setelah deployment berhasil, klik **"Custom domains"** tab
2. Klik **"Set up a custom domain"**
3. Masukkan: `klikdev.my.id`
4. Cloudflare akan auto-configure DNS (karena domain sudah di Cloudflare)
5. Klik **"Activate domain"**
6. Tunggu propagasi DNS (5-10 menit, bisa sampai 24 jam)

---

## Post-Deployment

### Verify Deployment

1. **Test subdomain Cloudflare:**
   - URL: `https://klikdev.pages.dev`
   - Harus menampilkan homepage klikdev

2. **Test custom domain:**
   - URL: `https://klikdev.my.id`
   - Harus menampilkan homepage klikdev

3. **Test CMS login:**
   - URL: `https://klikdev.my.id/admin`
   - Klik "Login with GitHub"
   - Harus redirect ke GitHub OAuth
   - Setelah authorize, kembali ke CMS dashboard

### Submit Sitemap ke Google

1. Buka: https://search.google.com/search-console
2. Add property: `klikdev.my.id`
3. Verify ownership (via DNS TXT record atau meta tag)
4. Submit sitemap: `https://klikdev.my.id/sitemap-index.xml`

---

## Troubleshooting

### Build Failed

**Error: "Command failed with exit code 1"**
- Cek build logs di Cloudflare Pages
- Pastikan `package.json` dependencies sudah benar
- Coba build lokal dulu: `npm run build`

**Error: "ENOENT: no such file or directory"**
- Pastikan `dist/` folder ter-generate
- Cek `.gitignore` tidak ignore `dist/` (seharusnya di-ignore, tapi Cloudflare build sendiri)

### Custom Domain Not Working

**Domain shows "ERR_NAME_NOT_RESOLVED"**
- Tunggu DNS propagation (sampai 24 jam)
- Cek DNS records di Cloudflare:
  - Type: CNAME
  - Name: `klikdev.my.id`
  - Content: `klikdev.pages.dev`

**Domain shows "Connection is not secure"**
- Tunggu SSL certificate provisioning (5-10 menit)
- Cloudflare auto-provision Let's Encrypt certificate

### CMS Login Failed

**Error: "404 Not Found" setelah GitHub authorize**
- Cek GitHub OAuth App callback URL:
  - Harus: `https://klikdev-oauth-proxy.vercel.app/api/callback`
- Cek `public/admin/config.yml`:
  - `base_url: https://klikdev-oauth-proxy.vercel.app`

**Error: "Network Error"**
- Cek Vercel OAuth proxy masih running:
  - Test: `https://klikdev-oauth-proxy.vercel.app/api`
  - Harus return JSON `{"status":"ok",...}`

---

## Maintenance

### Deploy New Changes

1. Make changes locally
2. Commit & push to GitHub:
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin main
   ```
3. Cloudflare Pages auto-deploy (2-3 menit)
4. Verify changes live

### Rollback to Previous Version

1. Go to Cloudflare Pages dashboard
2. Click **"Deployments"** tab
3. Find previous successful deployment
4. Click **"..."** → **"Rollback to this deployment"**

---

## Monitoring

### Analytics

- Cloudflare Web Analytics (gratis, privacy-friendly)
- Setup: Cloudflare Dashboard → Analytics → Web Analytics

### Performance

- Core Web Vitals: https://pagespeed.web.dev
- Test URL: `https://klikdev.my.id`
- Target: All metrics "Good" (green)

---

## Contact

Jika ada issue saat deployment, hubungi:
- GitHub Issues: https://github.com/dodhee/klikdev/issues
- Email: [your-email]
