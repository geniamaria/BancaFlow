import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPinned } from "lucide-react";
import { AgencyBrowser } from "@/components/features/agency-browser";
import { DemoNotice } from "@/components/features/demo-notice";
import { demoAgencies } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Agências",
  description: "Encontre agências bancárias e consulte o movimento das filas.",
};

export default function AgenciesPage() {
  const banks = Array.from(new Set(demoAgencies.map((agency) => agency.bank))).sort();
  const cities = Array.from(new Set(demoAgencies.map((agency) => agency.city))).sort();

  return (
    <>
      <section className="border-b-4 border-vivid bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Caminho" className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-vivid">
              Início
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="text-deep">Agências</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-vivid">
                <MapPinned aria-hidden="true" className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Rede de agências
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep sm:text-4xl">
                Encontre a agência ideal
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                Compare bancos, cidades, serviços disponíveis e tempo de espera
                estimado antes de se deslocar.
              </p>
            </div>
            <DemoNotice />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AgencyBrowser agencies={demoAgencies} banks={banks} cities={cities} />

        <p className="mt-8 rounded-lg border border-line border-l-4 border-l-gold bg-white px-4 py-3 text-xs leading-relaxed text-muted">
          A localização por geolocalização e a integração com mapas estão previstas
          para fases seguintes. Nesta página, a pesquisa utiliza dados fictícios
          armazenados localmente.
        </p>
      </section>
    </>
  );
}
