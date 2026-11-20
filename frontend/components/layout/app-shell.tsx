import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CircleHelp, LayoutGrid, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import {
  adminSidebarItems,
  clientSidebarItems,
  type SidebarItem,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface AppShellProps {
  variant: "client" | "admin";
  title: string;
  description: string;
  activeHref: string;
  children: ReactNode;
}

export function AppShell({
  variant,
  title,
  description,
  activeHref,
  children,
}: AppShellProps) {
  const isAdmin = variant === "admin";
  const items: SidebarItem[] = isAdmin ? adminSidebarItems : clientSidebarItems;
  const sectionLabel = isAdmin ? "GESTÃO" : "ÁREA DO CLIENTE";
  const userLabel = isAdmin ? "Operador administrativo" : "Cliente demonstrativo";

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="bg-deep text-white lg:min-h-screen">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Logo inverse />
          <span className="rounded-full bg-vivid/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-turquoise-light">
            Demo
          </span>
        </div>

        <nav aria-label="Navegação lateral" className="px-3 pb-5 pt-6">
          <p className="px-3 pb-3 text-[11px] font-bold tracking-[0.16em] text-white/40">
            {sectionLabel}
          </p>
          <ul className="space-y-1">
            {items.map((item) => {
              const active = !item.soon && item.href === activeHref;
              const content = (
                <>
                  <span>{item.label}</span>
                  {item.soon && (
                    <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/50">
                      em breve
                    </span>
                  )}
                </>
              );

              return (
                <li key={`${item.label}-${item.href}`}>
                  {item.soon ? (
                    <span className="flex cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-sm text-white/35">
                      {content}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                        active
                          ? "bg-vivid text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden border-t border-white/10 px-5 py-5 lg:block">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-turquoise/15 text-turquoise">
              {isAdmin ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <LayoutGrid className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userLabel}</p>
              <p className="text-xs text-white/50">Sessão de demonstração</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-9 w-1 rounded-full bg-vivid" aria-hidden="true" />
            <div>
              <h1 className="text-xl font-bold text-deep">{title}</h1>
              <p className="mt-0.5 text-sm text-muted">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-vivid"
            >
              <ArrowLeft className="h-4 w-4" />
              Site público
            </Link>
            <span className="hidden h-6 w-px bg-line sm:block" />
            <span className="hidden items-center gap-1.5 text-sm text-muted sm:inline-flex">
              <CircleHelp className="h-4 w-4 text-royal" />
              Estrutura inicial
            </span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
