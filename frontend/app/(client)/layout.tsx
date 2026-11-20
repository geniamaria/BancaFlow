import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      variant="client"
      title="Área do cliente"
      description="O seu atendimento bancário num só lugar"
      activeHref="/dashboard"
    >
      {children}
    </AppShell>
  );
}
