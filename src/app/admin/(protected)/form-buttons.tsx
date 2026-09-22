"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button className="button primary" disabled={pending}>{pending ? "Salvando..." : children}</button>;
}

export function DeleteButton() {
  const { pending } = useFormStatus();
  return <button
    disabled={pending}
    onClick={(event) => {
      if (!window.confirm("Excluir este registro? Esta ação não pode ser desfeita.")) event.preventDefault();
    }}
  >{pending ? "Excluindo..." : "Excluir registro"}</button>;
}
