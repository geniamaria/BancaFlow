"use client";

import type { ReactNode } from "react";

/**
 * Impede o envio real do formulário nesta etapa.
 * Não existe autenticação nem persistência de dados implementada.
 */
export function DemoForm({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <form className={className} onSubmit={(event) => event.preventDefault()}>
      {children}
    </form>
  );
}
