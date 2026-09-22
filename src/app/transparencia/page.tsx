import { Download, FileText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { getDocuments } from "@/lib/data";
export const metadata={title:"Transparência"};
export default async function TransparencyPage(){const docs=await getDocuments();return <main id="conteudo"><section className="page-hero compact"><p className="eyebrow">Transparência</p><h1>Documentos públicos, organizados e acessíveis.</h1><p>Consulte relatórios, publicações e documentos institucionais.</p></section><section className="documents">{docs.length?docs.map(doc=><a key={doc.id} href={doc.file_url} target="_blank" rel="noreferrer"><FileText/><div><span>{doc.category} · {doc.year}</span><h2>{doc.title}</h2>{doc.published_at&&<p>Publicado em {new Date(`${doc.published_at}T12:00:00`).toLocaleDateString("pt-BR")}</p>}</div><Download/></a>):<EmptyState title="Nenhum documento publicado.">Novos documentos aparecerão aqui quando forem disponibilizados.</EmptyState>}</section></main>}
