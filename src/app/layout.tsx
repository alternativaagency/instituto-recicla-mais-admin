import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export const metadata: Metadata = { title: { default: "Instituto Recicla Mais", template: "%s | Instituto Recicla Mais" }, description: "Projetos e iniciativas que fortalecem a cadeia da reciclagem no Brasil.", robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteHeader />{children}<SiteFooter /></body></html> }
