"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { publicNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string): boolean {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 bg-royal text-white">
      <div className="relative mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo inverse />

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                isActive(item.href) && "bg-white/10 text-white",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3 -bottom-2.5 h-0.5 rounded-full bg-turquoise" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/40 bg-transparent text-white hover:border-turquoise hover:bg-white/10"
          >
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/registo">Criar conta</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-md text-white hover:bg-white/10 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="absolute inset-x-0 bottom-0 h-1 bg-vivid" aria-hidden="true" />
      </div>

      {open && (
        <div className="border-t border-white/10 bg-royal px-4 pb-4 pt-2 lg:hidden">
          <nav aria-label="Navegação móvel" className="flex flex-col gap-1">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white",
                  isActive(item.href) && "bg-white/10 text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              asChild
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:border-turquoise hover:bg-white/10"
            >
              <Link href="/entrar" onClick={() => setOpen(false)}>
                Entrar
              </Link>
            </Button>
            <Button asChild>
              <Link href="/registo" onClick={() => setOpen(false)}>
                Criar conta
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
