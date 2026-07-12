import {
  defineConfig,
  envField,
  fontProviders,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        // Exclude tags
        if (page.includes("/tags/")) return false;
        // Exclude archives jika showArchives false
        if (!config.features?.showArchives && page.endsWith("/archives/")) return false;
        // Exclude pagination posts (misal: /posts/2/, /posts/3/)
        if (page.match(/\/posts\/\d+\/?$/)) return false;
        return true;
      },
      serialize: (item) => {
        item.lastmod = new Date().toISOString();

        // Homepage: hanya https://klikdev.my.id/
        if (item.url === config.site.url || item.url === config.site.url + "/") {
          item.priority = 1.0;
        }
        // Katalog
        else if (item.url.includes("/katalog")) {
          item.priority = 0.9;
        }
        // Produk
        else if (item.url.includes("/produk")) {
          item.priority = 0.9;
        }
        // Posts
        else if (item.url.includes("/posts")) {
          item.priority = 0.6;
        }
        // Lainnya
        else {
          item.priority = 0.5;
        }

        return item;
      },
    }),
  ],
  i18n: {
    locales: ["id", "en"],
    defaultLocale: "id",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()] as any,
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
});
