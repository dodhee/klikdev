import { defineCollection, z } from "astro:content";

/**
 * Schema untuk collection 'produk'
 * Produk digital (Google Apps Script, AI Prompt, Automation tools)
 */
const produkCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      // Required fields
      title: z.string().min(10).max(100),
      description: z.string().min(50).max(160),
      harga: z.number().int().positive().min(10000).max(10000000),
      linkBeli: z.string().url().startsWith("https://"),
      linkDfy: z.string().optional(), // DEPRECATED: semua CTA sekarang ke /harga/
      stack: z.array(z.string()).min(1).max(5),
      waktuDeploy: z.string().min(3),
      kategori: z.enum(["Google Apps Script", "AI Prompt", "Automation", "Web Development"]),
      thumbnail: image(),

      // Fields untuk TimeCalculator component (FASE R3)
      estimasiSetup: z.string().min(3).max(50), // contoh: "2-4 jam" atau "30 menit"
      skillDibutuhkan: z.array(z.string()).min(1).max(5), // contoh: ["Git", "Apps Script API", "OAuth"]

      // Meta fields
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional(),

      // Optional fields untuk SEO
      ogImage: z.string().optional(),
      canonicalURL: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

/**
 * Schema untuk collection 'posts'
 * Blog posts / tutorial / artikel
 */
const postsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      // Required fields
      title: z.string().min(10).max(100),
      description: z.string().min(50).max(160),
      pubDatetime: z.coerce.date(),

      // Optional fields
      modDatetime: z.coerce.date().optional(),
      author: z.string().default("Dody (mbah)"),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      ogImage: image().optional(),
      canonicalURL: z.string().url().optional(),
      readingTime: z.string().optional(),
    }),
});

/**
 * Schema untuk collection 'pages'
 * Static pages (About, Privacy Policy, dll)
 */
const pagesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().url().optional(),
  }),
});

// Export collections
export const collections = {
  produk: produkCollection,
  posts: postsCollection,
  pages: pagesCollection,
};
</contents>