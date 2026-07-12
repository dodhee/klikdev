import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://klikdev.my.id/",
    title: "KlikDev",
    description: "Script siap pakai untuk otomasi bisnis dan development. Done-For-You services tersedia.",
    author: "dody [mbah]",
    profile: "https://godev.biz.id",
    ogImage: "default-og.jpg",
    lang: "id",
    timezone: "Asia/Jakarta",
    dir: "ltr",
	googleVerification: "cJMIlI78TZnO8gmGUXZA0HJ1rfSABGDfE18zurMJiDw",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/satnaing/astro-paper/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "facebook",  url: "https://www.facebook.com/klikdev" },
    { name: "instagram", url: "https://www.instagram.com/klikdev" },
    { name: "linkedin",  url: "https://www.linkedin.com/company/klikdev" },
    { name: "lynk",      url: "https://lynk.id/klikdev" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});