import { testimonialSchema, type Testimonial } from "./schema";

/**
 * Load testimonials dari JSON files
 * 
 * CARA KERJA:
 * 1. Import semua file JSON dari folder testimonials/
 * 2. Validate dengan Zod schema
 * 3. Return array of Testimonial objects
 * 
 * RISIKO:
 * - Jika ada file JSON yang invalid, akan throw error saat build
 * - Pastikan semua file JSON follow schema yang benar
 */

// Import testimonial JSON files manually
// NOTE: Setiap produk baru butuh import manual di sini
import googleSheetsAutomationTestimonials from "./google-sheets-automation-engine-optimized.json";

// Aggregate all testimonials
const allTestimonials: Testimonial[] = [
  ...googleSheetsAutomationTestimonials,
].map(t => testimonialSchema.parse(t));

/**
 * Get testimonials untuk produk tertentu
 */
export function getTestimonialsByProduct(productSlug: string): Testimonial[] {
  return allTestimonials
    .filter(t => t.productSlug === productSlug && t.verified)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all verified testimonials
 */
export function getAllVerifiedTestimonials(): Testimonial[] {
  return allTestimonials
    .filter(t => t.verified)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Validate testimonial data
 */
export function validateTestimonial(data: unknown): Testimonial {
  return testimonialSchema.parse(data);
}