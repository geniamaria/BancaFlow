import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronRight, FileText, PlayCircle } from "lucide-react";
import { DemoNotice } from "@/components/features/demo-notice";
import { SectionHeading } from "@/components/features/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { demoProducts, type DemoProduct } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Produtos e serviços",
  description: "Contas, atendimento e documentos disponíveis no BancaFlow.",
};

const categories = [
  { id: "contas", label: "Contas" },
  { id: "atendimento", label: "Atendimento" },
  { id: "documentos", label: "Documentos" },
] as const;

export default function ServicesPage() {
  function renderProducts(category: DemoProduct["category"]) {
    return demoProducts
      .filter((product) => product.category === category)
      .map((product) => (
        <Card key={product.id} className="flex flex-col border-t-4 border-t-royal p-6">
          <Badge className="w-fit">{product.category}</Badge>
          <h3 className="mt-4 text-lg font-semibold text-deep">{product.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {product.description}
          </p>
          <ul className="mt-5 space-y-2 border-t border-line pt-4">
            {product.details.map((detail) => (
              <li key={detail} className="flex items-start gap-2 text-sm text-muted">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-turquoise-ink" />
                {detail}
              </li>
            ))}
          </ul>
        </Card>
      ));
  }

  return (
    <>
      <section className="border-b-4 border-vivid bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Caminho" className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-vivid">
              Início
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="text-deep">Serviços</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-turquoise-ink">
                Produtos e serviços
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep sm:text-4xl">
                Tudo preparado antes da visita à agência
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                Conheça os tipos de conta, os serviços de atendimento e os
                documentos necessários para cada pedido.
              </p>
            </div>
            <DemoNotice />
          </div>

          <nav aria-label="Categorias de serviços" className="mt-8 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  index === 0
                    ? "border-vivid bg-vivid text-white"
                    : "border-line bg-canvas text-deep hover:border-vivid hover:text-vivid"
                }`}
              >
                {category.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        <section id="contas" className="scroll-mt-24">
          <SectionHeading
            eyebrow="01 / Contas"
            title="Escolha a conta certa para si"
            description="Tipos de conta apresentados de forma genérica, para fins de demonstração."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderProducts("Contas")}
          </div>
        </section>

        <section id="atendimento" className="scroll-mt-24">
          <SectionHeading
            eyebrow="02 / Atendimento"
            title="Marque, actualize e acompanhe"
            description="Fluxos previstos para a área do cliente. A lógica de negócio será implementada numa etapa seguinte."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {renderProducts("Atendimento")}
          </div>
        </section>

        <section id="documentos" className="scroll-mt-24">
          <SectionHeading
            eyebrow="03 / Documentos"
            title="Tenha tudo pronto antes de ir"
            description="Lista indicativa dos documentos para abertura de conta."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-vivid">
                <FileText aria-hidden="true" className="h-5 w-5" />
                <h3 className="text-base font-semibold text-deep">
                  Abertura de conta
                </h3>
              </div>
              <ul className="mt-5 space-y-3">
                {demoProducts[5].details.map((document) => (
                  <li
                    key={document}
                    className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm text-deep"
                  >
                    <input
                      type="checkbox"
                      disabled
                      aria-label={document}
                      className="h-4 w-4 rounded border-line accent-vivid"
                    />
                    {document}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">
                O upload antecipado de documentos está previsto para a próxima fase.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 text-vivid">
                <PlayCircle aria-hidden="true" className="h-5 w-5" />
                <h3 className="text-base font-semibold text-deep">
                  Vídeos explicativos
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Os vídeos sobre produtos e serviços serão integrados quando a
                biblioteca de conteúdos estiver disponível.
              </p>
              <div className="mt-5 space-y-2">
                {["Como abrir uma conta", "Actualizar os seus dados", "Usar a marcação"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-lg bg-canvas px-4 py-3 text-sm text-muted"
                    >
                      {item}
                      <Badge variant="neutral">em breve</Badge>
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
