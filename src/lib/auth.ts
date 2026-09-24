import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthorizedUser } from "@/types/database";

export type AuthorizedRole = "admin" | "editor" | "viewer";

export async function getAuthorizedUser(): Promise<AuthorizedUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("admin auth check", {
    userId: user?.id ?? null,
    email: user?.email ?? null,
    error: userError,
  });

  if (!user) return null;

  const { data, error } = await supabase
    .from("authorized_users")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .in("role", ["admin", "editor", "viewer"])
    .maybeSingle();

  if (error) {
    console.error("authorized user lookup failed:", error);
    return null;
  }

  console.log("admin authorization result", {
    userId: user.id,
    authorized: Boolean(data),
    role: data?.role ?? null,
  });

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