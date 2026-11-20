import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { footerNavItems } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-vivid bg-deep text-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo inverse />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Menos filas. Mais tempo. Melhor atendimento. Uma experiência digital
            para o atendimento bancário em Moçambique.
          </p>
          <span className="mt-6 inline-block h-1 w-16 rounded-full bg-turquoise" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Explorar</h2>
          <ul className="mt-3 space-y-2">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors hover:text-turquoise"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Acesso</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/entrar" className="text-sm transition-colors hover:text-turquoise">
                Entrar na minha conta
              </Link>
            </li>
            <li>
              <Link href="/registo" className="text-sm transition-colors hover:text-turquoise">
                Criar uma conta
              </Link>
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60 ring-1 ring-white/10">
            Protótipo visual com dados de demonstração.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} BancaFlow. Estrutura inicial.</p>
          <p>Projecto de demonstração · Nenhum banco real representado.</p>
        </div>
      </div>
    </footer>
  );
}
