import { redirect } from "next/navigation";
import { getAuthorizedUser } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAuthorizedUser()) redirect("/admin");
  const unauthorized = (await searchParams).error === "unauthorized";
  return <main id="conteudo" className="login-page">
    {unauthorized && <p className="form-status error" role="alert">Este e-mail não está autorizado a administrar o site.</p>}
    <LoginForm />
  </main>;
}
