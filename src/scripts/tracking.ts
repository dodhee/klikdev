/**
 * tracking.ts - Global GA4 tracking untuk bailout clicks
 * 
 * Script ini mendeteksi semua elemen dengan data-track-bailout
 * dan mengirim event ke Google Analytics 4.
 * 
 * Cara pakai: tambahkan data attributes di HTML:
 * <a 
 *   href="https://godev.biz.id/..."
 *   data-track-bailout="true"
 *   data-utm-medium="bailout"
 *   data-utm-campaign="google-sheets-automation"
 * >
 *   Tombol Bailout
 * </a>
 */

export function initBailoutTracking() {
  // Cari semua elemen dengan data-track-bailout
  const bailoutElements = document.querySelectorAll('[data-track-bailout="true"]');

  bailoutElements.forEach((element) => {
    // Skip jika sudah di-attach event listener
    if ((element as HTMLElement).dataset.trackingAttached === "true") return;
    (element as HTMLElement).dataset.trackingAttached = "true";

    element.addEventListener("click", (event) => {
      const target = event.currentTarget as HTMLElement;
      const medium = target.dataset.utmMedium || "unknown";
      const campaign = target.dataset.utmCampaign || "unknown";

      // Kirim event ke GA4
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "click_bailout", {
          event_category: "bailout",
          event_label: `${medium}_${campaign}`,
          utm_medium: medium,
          utm_campaign: campaign,
          outbound_url: "godev.biz.id",
          value: 1,
        });

        // Debug log (hapus di production)
        console.log("[KlikDev] Bailout click tracked:", {
          medium,
          campaign,
          url: target.getAttribute("href"),
        });
      } else {
        console.warn("[KlikDev] gtag not available, click not tracked");
      }
    });
  });
}

// Auto-init saat DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initBailoutTracking();
});

// Re-init setelah Astro page swap (View Transitions)
document.addEventListener("astro:after-swap", () => {
  initBailoutTracking();
});

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
