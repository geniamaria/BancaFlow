import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const highlights = [
  "Encontre agências próximas de si",
  "Consulte o movimento das filas",
  "Marque atendimentos sem deslocações",
];

export function AuthPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-l-4 border-vivid bg-deep px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="relative">
        <Logo inverse />
        <span className="mt-6 inline-flex rounded-full bg-gold-soft px-3 py-1 text-[11px] font-bold text-gold-ink">
          Ambiente de demonstração
        </span>
      </div>

      <div className="relative max-w-md">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-turquoise">
          BancaFlow
        </p>
        <h2 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-white">
          Menos filas. Mais tempo. Melhor atendimento.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-white/65">
          Uma experiência digital simples para gerir os seus serviços bancários,
          com dados de demonstração.
        </p>

        <ul className="mt-8 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-white/85">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-turquoise/15 text-turquoise">
                <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/50">
        <Link href="/" className="transition-colors hover:text-turquoise">
          Voltar ao início
        </Link>
      </p>
    </aside>
  );
}
