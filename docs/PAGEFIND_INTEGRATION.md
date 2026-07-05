# Pagefind Integration - KlikDev

## Overview
Pagefind adalah static search library yang digunakan untuk fitur internal search di KlikDev. Integration ini memungkinkan user mencari produk dan artikel tanpa perlu backend search server.

## Implementation Date
2026-07-05

## Problem Solved
**Before:** Hanya 18/56 halaman ter-index oleh Pagefind karena halaman produk tidak memiliki attribute `data-pagefind-body`.

**After:** 21 halaman ter-index (peningkatan +3 halaman produk).

## Changes Made

### File Modified: `src/pages/produk/[slug].astro`

**Location:** Line 161

**Change:**
```diff
- <main>
+ <main data-pagefind-body>
```

**Explanation:**
Pagefind hanya index halaman yang memiliki attribute `data-pagefind-body` di element parent-nya. Tanpa attribute ini, content halaman produk diabaikan saat indexing.

## How Pagefind Works in KlikDev

### Build Process
1. Astro build menghasilkan static HTML di folder `dist/`
2. Pagefind CLI berjalan otomatis setelah build (via `npm run build`)
3. Pagefind scan semua `**/*.html` files di `dist/`
4. Hanya halaman dengan `data-pagefind-body` yang di-index
5. Index tersimpan di `dist/pagefind/` (fragment files + metadata)

### Runtime Search
1. User buka halaman `/search/`
2. Pagefind JS library load dari `/pagefind/`
3. User ketik query
4. Pagefind search di fragment files (client-side, no server request)
5. Results ditampilkan dengan highlighting

## Indexed Content Breakdown

### Total: 21 pages
- **Produk:** 3 halaman (google-sheets-automation, gemini-prompt-library, google-sheets-watchdog)
- **Blog Posts:** ~15 halaman
- **Static Pages:** ~3 halaman (about, katalog, archives)

### Pages NOT Indexed
- Homepage (`/`) - tidak perlu search
- Tag pages (`/tags/*`) - tidak perlu search
- Pagination pages (`/posts/2`, `/posts/3`, etc.) - redundant dengan main posts

## Search Configuration

### Location: `src/pages/search/index.astro`

**Key Config:**
```astro
<div 
  id="pagefind-search" 
  data-backurl="/search/" 
  data-bundle-path="/pagefind/" 
  data-astro-transition-persist="astro-x3tswf4y-1"
></div>
```

**Attributes:**
- `data-bundle-path`: Path ke Pagefind index files
- `data-backurl`: URL untuk back navigation
- `data-astro-transition-persist`: Preserve search state saat Astro view transitions

## Testing Search

### Manual Test
1. Build project: `npm run build`
2. Check index stats in build output:
   ```
   [Building search indexes]
   Total: 
     Indexed 1 language
     Indexed 21 pages
     Indexed 3840 words
   ```
3. Start dev server: `npm run dev`
4. Navigate to: http://localhost:4321/search/
5. Test queries:
   - "google sheets" → Should return google-sheets-automation-engine
   - "gemini" → Should return gemini-prompt-library
   - "automation" → Should return multiple products
   - "clasp" → Should return blog post + related products

### Expected Behavior
- **Product pages:** Judul, description, dan content MDX ter-index
- **Blog posts:** Title, description, dan full article content ter-index
- **Search results:** Clickable dengan URL correct
- **Highlighting:** Query terms highlighted di snippet

## Known Limitations

### 1. Index Size
- Current: ~3840 words
- Setiap produk/post baru menambah ~200-500 words
- Pagefind efficient sampai ~100k words (kita masih jauh)

### 2. Search Features
- **No fuzzy search:** Typo tidak di-handle (misal: "gogle" tidak return "google")
- **No synonyms:** "otomasi" tidak return "automation"
- **No filters:** Tidak bisa filter by kategori/stack via UI (tapi data ada di index)

### 3. Content Excluded from Index
- JSON-LD schema scripts (correct, tidak perlu searchable)
- Navigation menus (correct, tidak perlu searchable)
- Footer (correct, tidak perlu searchable)
- Related products/articles sections (mungkin perlu di-exclude explicit di future)

## Future Improvements

### Priority: MEDIUM
1. **Add filters to search UI:**
   - Filter by kategori (Automation, AI Tools, etc.)
   - Filter by tech stack (Google Apps Script, Gemini, etc.)
   - Implementation: Use Pagefind's `data-pagefind-filter` attributes

2. **Improve search ranking:**
   - Boost product titles vs body content
   - Boost newer content
   - Implementation: Use Pagefind's `data-pagefind-weight` attributes

3. **Add search analytics:**
   - Track popular queries
   - Track zero-result queries (untuk content gap analysis)
   - Implementation: Google Analytics events or Plausible

### Priority: LOW
1. **Synonyms via redirect:**
   - "otomasi" → auto-add "automation" to query
   - "AI" → auto-add "artificial intelligence"
   - Implementation: Pre-process query before passing to Pagefind

2. **Autocomplete/suggestions:**
   - Show popular searches as user types
   - Implementation: Custom UI on top of Pagefind API

## Troubleshooting

### Issue: "Only X pages indexed" (less than expected)
**Cause:** Pages missing `data-pagefind-body` attribute

**Solution:**
1. Check page template (`src/pages/[collection]/[slug].astro`)
2. Ensure `<main data-pagefind-body>` wrapper exists
3. Rebuild: `npm run build`

### Issue: "Search not working in production"
**Cause:** Pagefind index files not deployed or wrong path

**Solution:**
1. Check `dist/pagefind/` folder exists after build
2. Verify `data-bundle-path="/pagefind/"` matches deployment structure
3. Check browser console for 404 errors on `/pagefind/pagefind.js`

### Issue: "Product content not appearing in search"
**Cause:** MDX content not rendered inside `data-pagefind-body`

**Solution:**
1. Verify `<Content />` component rendered inside `<main data-pagefind-body>`
2. Check that content is not lazy-loaded (Pagefind needs static HTML)

## Related Files
- `src/pages/search/index.astro` - Search UI page
- `src/pages/produk/[slug].astro` - Product detail template (modified)
- `package.json` - Build script: `astro build && pagefind --site dist`
- `dist/pagefind/` - Generated index files (not in Git)

## References
- Pagefind Docs: https://pagefind.app/
- Pagefind GitHub: https://github.com/CloudCannon/pagefind
- AstroPaper Pagefind Integration: Template default (preserved)