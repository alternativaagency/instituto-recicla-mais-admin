"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { citySchema, documentSchema, faqSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";

const text = (form: FormData, key: string) => String(form.get(key) ?? "");

export async function saveCity(form: FormData) {
  await requireRole(["admin", "editor"]);
  const id = text(form, "id");
  const images = text(form, "images").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const payload = citySchema.parse({
    cityname: text(form, "cityname"),
    slug: text(form, "slug"),
    state: text(form, "state").toUpperCase(),
    longitude: text(form, "longitude"),
    latitude: text(form, "latitude"),
    jobsdone: text(form, "jobsdone"),
    trashrecycledkg: text(form, "trashrecycledkg"),
    description: text(form, "description") || null,
    images: images.length ? images : null,
  });
  const db = await createClient();
  const result = id
    ? await db.from("cities").update(payload).eq("id", Number(id))
    : await db.from("cities").insert(payload);
  if (result.error) throw result.error;
  revalidatePath("/");
  revalidatePath("/cidades");
  revalidatePath("/admin");
  redirect("/admin?status=saved#cidades");
}

export async function deleteCity(form: FormData) {
  await requireRole(["admin"]);
  const db = await createClient();
  const { error } = await db.from("cities").delete().eq("id", Number(text(form, "id")));
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/cidades");
  revalidatePath("/admin");
  redirect("/admin?status=deleted#cidades");
}

export async function saveFaq(form: FormData) {
  await requireRole(["admin", "editor"]);
  const id = text(form, "id");
  const payload = faqSchema.parse({ title: text(form, "title"), answer: text(form, "answer"), sort_order: text(form, "sort_order") });
  const db = await createClient();
  const result = id ? await db.from("faqs").update(payload).eq("id", Number(id)) : await db.from("faqs").insert(payload);
  if (result.error) throw result.error;
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/admin");
  redirect("/admin?status=saved#faqs");
}

export async function deleteFaq(form: FormData) {
  await requireRole(["admin"]);
  const db = await createClient();
  const { error } = await db.from("faqs").delete().eq("id", Number(text(form, "id")));
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/admin");
  redirect("/admin?status=deleted#faqs");
}

export async function saveDocument(form: FormData) {
  await requireRole(["admin", "editor"]);
  const id = text(form, "id");
  const payload = documentSchema.parse({ title: text(form, "title"), category: text(form, "category"), year: text(form, "year"), file_url: text(form, "file_url"), published_at: text(form, "published_at") || null });
  const db = await createClient();
  const result = id
    ? await db.from("transparency_documents").update(payload).eq("id", Number(id))
    : await db.from("transparency_documents").insert(payload);
  if (result.error) throw result.error;
  revalidatePath("/transparencia");
  revalidatePath("/admin");
  redirect("/admin?status=saved#documentos");
}

export async function deleteDocument(form: FormData) {
  await requireRole(["admin"]);
  const db = await createClient();
  const { error } = await db.from("transparency_documents").delete().eq("id", Number(text(form, "id")));
  if (error) throw error;
  revalidatePath("/transparencia");
  revalidatePath("/admin");
  redirect("/admin?status=deleted#documentos");
}

export async function signOut() {
  const db = await createClient();
  await db.auth.signOut();
  redirect("/admin/login");
}
