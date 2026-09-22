import { EmptyState } from "@/components/empty-state";
import { getFaqs } from "@/lib/data";
export const metadata={title:"Dúvidas frequentes"};
export default async function FaqPage(){const faqs=await getFaqs();return <main id="conteudo"><section className="page-hero compact"><p className="eyebrow">Perguntas frequentes</p><h1>Informação clara para tirar projetos do papel.</h1></section><section className="faq-page">{faqs.length?faqs.map((faq,i)=><details key={faq.id}><summary><span>{String(i+1).padStart(2,"0")}</span>{faq.title}</summary><p>{faq.answer}</p></details>):<EmptyState title="Nenhuma pergunta publicada.">A equipe do Instituto poderá editar este conteúdo pela área administrativa.</EmptyState>}</section></main>}
