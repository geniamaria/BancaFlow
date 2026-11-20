import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      variant="admin"
      title="Painel administrativo"
      description="Visão operacional das agências e dos atendimentos"
      activeHref="/admin"
    >
      {children}
    </AppShell>
  );
}
