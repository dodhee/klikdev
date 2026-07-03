import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";
export const PRODUK_PATH = "src/content/produk";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

const produk = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${PRODUK_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      harga: z.number(),
      linkBeli: z.string().url(),
      linkDfy: z.string().url(),
      stack: z.array(z.string()),
      waktuDeploy: z.string(),
      kategori: z.enum(["Google Apps Script", "AI Prompt", "Automation"]),
      thumbnail: image().or(z.string()),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      ogImage: image().or(z.string()).optional(),
      canonicalURL: z.string().optional(),
    }),
});

export const collections = { posts, pages, produk };
