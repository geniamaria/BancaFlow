import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BancaFlow — Menos filas. Mais tempo. Melhor atendimento.",
    template: "%s | BancaFlow",
  },
  description:
    "Plataforma multi-banco para localizar agências, consultar serviços, acompanhar filas e marcar atendimentos em Moçambique.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-MZ">
      <body className="font-sans">{children}</body>
    </html>
  );
}
