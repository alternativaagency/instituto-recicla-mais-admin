import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { getCities } from "@/lib/data";
export const metadata = { title: "Cidades" };
export default async function CitiesPage(){ const cities=await getCities(); return <main id="conteudo"><section className="page-hero compact"><p className="eyebrow">Atuação</p><h1>Cidades que transformam resíduos em novas possibilidades.</h1><p>Dados publicados diretamente pela equipe do Instituto Recicla Mais.</p></section><section className="listing">{cities.length?<div className="city-cards">{cities.map(city=><Link href={`/cidades/${city.slug}`} className="city-card" key={city.id}><MapPin/><span>{city.state}</span><h2>{city.cityname}</h2><p>{city.description || "Conheça a atuação do Instituto neste município."}</p><strong>Ver cidade <ArrowRight/></strong></Link>)}</div>:<EmptyState title="Nenhuma cidade publicada.">A equipe poderá cadastrar os territórios pela área administrativa.</EmptyState>}</section></main> }
