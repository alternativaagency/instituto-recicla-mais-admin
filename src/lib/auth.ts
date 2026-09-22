import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthorizedUser } from "@/types/database";

export type AuthorizedRole = "admin" | "editor" | "viewer";

export async function getAuthorizedUser(): Promise<AuthorizedUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("authorized_users")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .in("role", ["admin", "editor", "viewer"])
    .maybeSingle();
  return data;
}

export async function requireAuthorizedUser() {
  const authorized = await getAuthorizedUser();
  if (!authorized) redirect("/admin/login");
  return authorized;
}

export async function requireRole(allowed: AuthorizedRole[]) {
  const user = await requireAuthorizedUser();
  if (!allowed.includes(user.role as AuthorizedRole)) {
    throw new Error("Você não tem permissão para realizar esta ação.");
  }
  return user;
}
