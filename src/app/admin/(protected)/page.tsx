import { requireAuthorizedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { City, Faq, TransparencyDocument } from "@/types/database";
import { deleteCity, deleteDocument, deleteFaq, saveCity, saveDocument, saveFaq } from "../actions";
import { DeleteButton, SubmitButton } from "./form-buttons";

export const metadata = { title: "Administração", robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const user = await requireAuthorizedUser();
  const role = user.role;
  const canEdit = role === "admin" || role === "editor";
  const canDelete = role === "admin";
  const status = (await searchParams).status;
  const db = await createClient();
  const [{ data: cities }, { data: faqs }, { data: docs }] = await Promise.all([
    db.from("cities").select("*").order("cityname"),
    db.from("faqs").select("*").order("sort_order"),
    db.from("transparency_documents").select("*").order("year", { ascending: false }),
  ]);

  return <div>
    <header className="admin-header"><p className="eyebrow">Painel do cliente</p><h1>Conteúdo do site</h1><p>{canEdit ? "As alterações salvas aqui são publicadas diretamente no site." : "Seu perfil permite consultar o conteúdo publicado."}</p></header>
    {status && <p className="form-status success" role="status">{status === "deleted" ? "Registro excluído com sucesso." : "Alterações publicadas com sucesso."}</p>}
    <AdminSection id="cidades" title="Cidades" count={cities?.length || 0}>
      {canEdit && <CityForm />}
      {cities?.map((city) => <details className="admin-item" key={city.id}><summary>{city.cityname}<span>{city.state}</span></summary>{canEdit ? <CityForm city={city} /> : <RecordPreview lines={[city.description || "Sem descrição", `${city.jobsdone ?? 0} ações`, `${city.trashrecycledkg ?? 0} kg reciclados`]} />}{canDelete && <Delete action={deleteCity} id={city.id} />}</details>)}
    </AdminSection>
    <AdminSection id="faqs" title="Perguntas frequentes" count={faqs?.length || 0}>
      {canEdit && <FaqForm />}
      {faqs?.map((faq) => <details className="admin-item" key={faq.id}><summary>{faq.title}<span>Ordem {faq.sort_order ?? 0}</span></summary>{canEdit ? <FaqForm faq={faq} /> : <RecordPreview lines={[faq.answer]} />}{canDelete && <Delete action={deleteFaq} id={faq.id} />}</details>)}
    </AdminSection>
    <AdminSection id="documentos" title="Transparência" count={docs?.length || 0}>
      {canEdit && <DocumentForm />}
      {docs?.map((doc) => <details className="admin-item" key={doc.id}><summary>{doc.title}<span>{doc.category} · {doc.year}</span></summary>{canEdit ? <DocumentForm doc={doc} /> : <RecordPreview lines={[doc.file_url]} />}{canDelete && <Delete action={deleteDocument} id={doc.id} />}</details>)}
    </AdminSection>
  </div>;
}

function AdminSection({ id, title, count, children }: { id: string; title: string; count: number; children: React.ReactNode }) {
  return <section id={id} className="admin-section"><div className="admin-section-title"><h2>{title}</h2><span>{count} publicados</span></div>{children}</section>;
}
function RecordPreview({ lines }: { lines: string[] }) { return <div className="admin-form">{lines.map((line) => <p key={line}>{line}</p>)}</div>; }
function Field({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean }) {
  return <label>{label}<input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} /></label>;
}
function CityForm({ city }: { city?: City }) {
  return <form action={saveCity} className="admin-form"><input type="hidden" name="id" value={city?.id ?? ""} /><div className="form-grid"><Field label="Cidade" name="cityname" defaultValue={city?.cityname} required /><Field label="Endereço da página" name="slug" defaultValue={city?.slug} required /><Field label="UF" name="state" defaultValue={city?.state} required /><Field label="Latitude" name="latitude" type="number" defaultValue={city?.latitude} /><Field label="Longitude" name="longitude" type="number" defaultValue={city?.longitude} /><Field label="Ações realizadas" name="jobsdone" type="number" defaultValue={city?.jobsdone} /><Field label="Resíduos reciclados (kg)" name="trashrecycledkg" type="number" defaultValue={city?.trashrecycledkg} /></div><label>Descrição<textarea name="description" defaultValue={city?.description ?? ""} /></label><label>Links de imagens, um por linha<textarea name="images" defaultValue={city?.images?.join("\n") ?? ""} /></label><SubmitButton>{city ? "Salvar cidade" : "Adicionar cidade"}</SubmitButton></form>;
}
function FaqForm({ faq }: { faq?: Faq }) {
  return <form action={saveFaq} className="admin-form"><input type="hidden" name="id" value={faq?.id ?? ""} /><Field label="Pergunta" name="title" defaultValue={faq?.title} required /><label>Resposta<textarea name="answer" defaultValue={faq?.answer ?? ""} required /></label><Field label="Posição na lista" name="sort_order" type="number" defaultValue={faq?.sort_order ?? 0} /><SubmitButton>{faq ? "Salvar pergunta" : "Adicionar pergunta"}</SubmitButton></form>;
}
function DocumentForm({ doc }: { doc?: TransparencyDocument }) {
  return <form action={saveDocument} className="admin-form"><input type="hidden" name="id" value={doc?.id ?? ""} /><div className="form-grid"><Field label="Título" name="title" defaultValue={doc?.title} required /><Field label="Categoria" name="category" defaultValue={doc?.category} required /><Field label="Ano" name="year" type="number" defaultValue={doc?.year ?? new Date().getFullYear()} required /><Field label="Data de publicação" name="published_at" type="date" defaultValue={doc?.published_at} /></div><Field label="Link do arquivo" name="file_url" type="url" defaultValue={doc?.file_url} required /><SubmitButton>{doc ? "Salvar documento" : "Adicionar documento"}</SubmitButton></form>;
}
function Delete({ action, id }: { action: (form: FormData) => Promise<void>; id: number }) {
  return <form action={action} className="delete-form"><input type="hidden" name="id" value={id} /><DeleteButton /></form>;
}
