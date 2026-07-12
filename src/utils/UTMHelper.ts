/**
 * UTMHelper - Utility untuk generate URL godev dengan UTM parameters konsisten
 * 
 * Semua link ke godev.biz.id WAJIB pakai helper ini.
 * Jangan hardcode URL godev di komponen lain.
 * 
 * @example
 * // Generate URL dengan medium dan campaign
 * generateGodevUrl('sticky_banner', 'homepage')
 * // Output: "https://godev.biz.id/?utm_source=klikdev&utm_medium=sticky_banner&utm_campaign=homepage"
 * 
 * // Generate URL dengan pre-filled message untuk WhatsApp
 * getGodevUrlWithMessage('calculator', 'google-sheets-automation', 'Saya tertarik layanan DFY untuk produk ini')
 * // Output: "https://godev.biz.id/?utm_source=klikdev&utm_medium=calculator&utm_campaign=google-sheets-automation&message=..."
 */

const GODEV_BASE_URL = "https://godev.biz.id";
const GODEV_HARGA_URL = "https://godev.biz.id/harga";
const UTM_SOURCE = "klikdev";

/**
 * Generate URL godev dengan UTM parameters
 * 
 * @param medium - UTM medium (contoh: 'sticky_banner', 'bailout', 'calculator', 'exit_popup')
 * @param campaign - UTM campaign, biasanya slug produk atau 'homepage' (opsional)
 * @returns Full URL dengan UTM parameters
 */
export function generateGodevUrl(
  medium: string,
  campaign?: string
): string {
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: medium,
  });

  if (campaign) {
    params.set("utm_campaign", campaign);
  }

  return `${GODEV_BASE_URL}?${params.toString()}`;
}

/**
 * Generate URL godev halaman harga dengan UTM parameters
 * Digunakan untuk CTA di halaman detail produk
 * 
 * @param medium - UTM medium (contoh: 'bailout', 'calculator', 'exit_popup')
 * @param campaign - UTM campaign (slug produk)
 * @returns Full URL ke halaman harga dengan UTM parameters
 */
export function generateGodevHargaUrl(
  medium: string,
  campaign: string
): string {
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: medium,
    utm_campaign: campaign,
  });

  return `${GODEV_HARGA_URL}?${params.toString()}`;
}

/**
 * Generate URL godev dengan UTM + pre-filled message
 * Berguna untuk WhatsApp link atau contact form
 * 
 * @param medium - UTM medium
 * @param campaign - UTM campaign (slug produk)
 * @param message - Pesan yang akan di-prefill
 * @returns Full URL dengan UTM + message
 */
export function getGodevUrlWithMessage(
  medium: string,
  campaign: string,
  message: string
): string {
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: medium,
    utm_campaign: campaign,
    message: message,
  });

  return `${GODEV_BASE_URL}?${params.toString()}`;
}

/**
 * Validate UTM medium value
 * Untuk memastikan konsistensi naming convention
 * 
 * @param medium - UTM medium yang akan divalidasi
 * @returns true jika valid, false jika tidak
 */
export function isValidUTMMedium(medium: string): boolean {
  const validMediums = [
    "sticky_banner",
    "bailout",
    "calculator",
    "exit_popup",
    "homepage",
    "catalog",
    "product_page",
  ];

  return validMediums.includes(medium);
}

/**
 * Track outbound click ke godev (untuk Google Analytics 4)
 * Fungsi ini mengirim event ke GA4 setiap kali user klik tombol bailout
 * 
 * @param medium - UTM medium (contoh: 'bailout', 'calculator', 'exit_popup')
 * @param campaign - UTM campaign (slug produk atau 'homepage')
 * 
 * @example
 * // Di komponen Astro, panggil via onclick
 * <a href={godevUrl} onclick={`trackGodevClick('bailout', '${slug}')`}>
 *   Tombol Bailout
 * </a>
 */
export function trackGodevClick(medium: string, campaign: string): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'click_bailout', {
      event_category: 'engagement',
      event_label: `${medium}_${campaign}`,
      utm_medium: medium,
      utm_campaign: campaign,
      outbound_url: 'godev.biz.id',
    });
  }
}

/**
 * Declare gtag globally untuk TypeScript
 */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}