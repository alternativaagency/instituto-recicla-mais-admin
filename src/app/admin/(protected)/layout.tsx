import Link from "next/link";
import { signOut } from "../actions";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main id="conteudo" className="admin-shell">
            <aside>
                <Link href="/admin" className="admin-brand">
                    Recicla+<span>Administração</span>
                </Link>
                <nav>
                    <Link href="/admin#cidades">Cidades</Link>
                    <Link href="/admin#faqs">Dúvidas</Link>
                    <Link href="/admin#documentos">Documentos</Link>
                    <Link href="/" target="_blank">Ver site</Link>
                </nav>
                <div>
                    <form action={signOut}>
                        <button>Sair</button>
                    </form>
                </div>
            </aside>
            <div className="admin-content">{children}</div>
        </main>
    );
}