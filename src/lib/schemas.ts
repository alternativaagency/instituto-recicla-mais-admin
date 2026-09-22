import { z } from "zod";
const optionalNumber = z.preprocess((v) => v === "" || v == null ? null : Number(v), z.number().nullable());
export const citySchema = z.object({
  cityname: z.string().trim().min(2), slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/), state: z.string().trim().min(2).max(2),
  longitude: optionalNumber, latitude: optionalNumber, jobsdone: optionalNumber, trashrecycledkg: optionalNumber,
  description: z.string().trim().nullable(), images: z.array(z.url()).nullable(),
});
export const faqSchema = z.object({ title: z.string().trim().min(3), answer: z.string().trim().min(3), sort_order: z.coerce.number().int().default(0) });
export const documentSchema = z.object({ title: z.string().trim().min(3), category: z.string().trim().min(2), year: z.coerce.number().int().min(2000).max(2100), file_url: z.string().url().refine((value) => value.startsWith("https://") || value.startsWith("http://"), "Use uma URL HTTP ou HTTPS"), published_at: z.string().nullable() });
