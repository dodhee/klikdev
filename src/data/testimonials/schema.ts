import { z } from "zod";

/**
 * Schema untuk validasi testimoni
 * 
 * ATURAN:
 * - name: Nama customer (3-50 karakter)
 * - role: Jabatan/perusahaan (opsional, maks 100 karakter)
 * - avatar: URL foto atau initial (opsional)
 * - rating: 1-5 bintang
 * - content: Isi testimoni (20-500 karakter)
 * - productSlug: Slug produk yang direview
 * - date: Tanggal submit (ISO string)
 * - verified: Status verifikasi (default false, admin yang approve)
 */
export const testimonialSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(50),
  role: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(20).max(500),
  productSlug: z.string(),
  date: z.string().datetime(),
  verified: z.boolean().default(false),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

/**
 * Helper untuk aggregate rating
 */
export function calculateAggregateRating(testimonials: Testimonial[]) {
  if (testimonials.length === 0) {
    return null;
  }

  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = totalRating / testimonials.length;
  const ratingCount = testimonials.length;

  // Distribution per bintang
  const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
    star,
    count: testimonials.filter(t => t.rating === star).length,
  }));

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    ratingCount,
    bestRating: 5,
    worstRating: 1,
    ratingDistribution,
  };
}