import { cache } from "react";
import { isPlaceholderEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { City, Faq, TransparencyDocument } from "@/types/database";

async function queryOrEmpty<T>(query: () => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  if (isPlaceholderEnvironment()) return [];
  try {
    const { data, error } = await query();
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Supabase public query failed", error);
    return [];
  }
}

export const getCities = cache(async (): Promise<City[]> => {
  const db = await createClient();
  return queryOrEmpty<City>(() => db.from("cities").select("*").order("cityname"));
});
export const getCity = cache(async (slug: string): Promise<City | null> => {
  if (isPlaceholderEnvironment()) return null;
  try {
    const db = await createClient();
    const { data, error } = await db.from("cities").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Supabase city query failed", error);
    return null;
  }
});
export const getFaqs = cache(async (): Promise<Faq[]> => {
  const db = await createClient();
  return queryOrEmpty<Faq>(() => db.from("faqs").select("*").order("sort_order", { ascending: true }));
});
export const getDocuments = cache(async (): Promise<TransparencyDocument[]> => {
  const db = await createClient();
  return queryOrEmpty<TransparencyDocument>(() => db.from("transparency_documents").select("*").order("published_at", { ascending: false }));
});
