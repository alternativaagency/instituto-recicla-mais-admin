import Image from "next/image";
import Link from "next/link";
const links = [["/sobre", "O Instituto"], ["/cidades", "Atuação"], ["/faq", "Dúvidas"], ["/transparencia", "Transparência"]];
export function SiteHeader() { return <header className="site-header"><Link href="/" className="brand" aria-label="Instituto Recicla Mais, início"><Image src="/assets/logo/mainlogo.png" alt="Instituto Recicla Mais" width={250} height={50} priority /></Link><nav aria-label="Principal">{links.map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}<Link className="nav-cta" href="https://www.instagram.com/institutoreciclamais/" target="_blank">Fale conosco</Link></nav></header> }
