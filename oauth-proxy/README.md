# KlikDev OAuth Proxy Server

OAuth proxy server untuk Decap CMS di klikdev.my.id

## Cara Deploy ke Vercel

1. Push folder ini ke GitHub repo `dodhee/klikdev`
2. Login ke Vercel: https://vercel.com
3. Import project dari GitHub
4. Pilih repo `dodhee/klikdev`
5. Set Root Directory: `oauth-proxy`
6. Tambahkan Environment Variables:
   - `OAUTH_CLIENT_ID`: [Client ID dari GitHub OAuth App]
   - `OAUTH_CLIENT_SECRET`: [Client Secret dari GitHub OAuth App]
   - `SESSION_SECRET`: [Random string untuk session, contoh: klikdev-secret-2024]
7. Deploy!

## Environment Variables yang Dibutuhkan

```env
OAUTH_CLIENT_ID=Iv1.xxxxxxxxxxxxxxxx
OAUTH_CLIENT_SECRET=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SESSION_SECRET=random-string-untuk-session-security
NODE_ENV=production
```

## Endpoints

- `GET /` - Health check
- `GET /auth` - Initiate OAuth flow
- `GET /callback` - OAuth callback handler

## Testing

Setelah deploy, test dengan:
1. Buka `https://klikdev-oauth.vercel.app/`
2. Harus muncul response JSON: `{"status":"ok",...}`

## Troubleshooting

Jika CMS tidak bisa login:
1. Cek Environment Variables sudah benar
2. Cek GitHub OAuth App callback URL: `https://klikdev-oauth.vercel.app/callback`
3. Cek browser console untuk error messages
4. Cek Vercel logs: https://vercel.com/[username]/klikdev-oauth-proxy/logs