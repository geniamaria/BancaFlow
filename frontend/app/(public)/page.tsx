import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarCheck2,
  FileCheck2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { DemoNotice } from "@/components/features/demo-notice";
import { QueueSummaryCard } from "@/components/features/queue-summary-card";
import { SectionHeading } from "@/components/features/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoProducts, demoSteps } from "@/lib/demo-data";

const stepIcons = [MapPin, FileCheck2, CalendarCheck2];

export default function HomePage() {
  const highlights = [demoProducts[0], demoProducts[3], demoProducts[5]];

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <Badge className="mb-5 gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-vivid" aria-hidden="true" />
              Serviços bancários digitais em Moçambique
            </Badge>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-deep sm:text-5xl">
              Menos <span className="text-turquoise">filas</span>. Mais tempo. Melhor
              atendimento.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Encontre agências próximas, consulte os serviços disponíveis,
              acompanhe o movimento das filas e marque o seu atendimento — tudo a
              partir de um único lugar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/agencias">
                  Explorar agências
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/servicos">Ver serviços</Link>
              </Button>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-soft px-3 py-2 text-xs font-bold text-gold-ink ring-1 ring-gold/40">
              <Bell aria-hidden="true" className="h-3.5 w-3.5" />
              Upload antecipado de documentos em preparação
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <p className="text-2xl font-bold text-royal">3</p>
                <p className="text-xs text-muted">Bancos demonstrativos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-royal">54</p>
                <p className="text-xs text-muted">Agências ilustrativas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-royal">24/7</p>
                <p className="text-xs text-muted">Acesso digital</p>
              </div>
            </div>
          </div>

          <div className="lg:pl-6">
            <DemoNotice className="mb-3" />
            <QueueSummaryCard />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Como funciona"
          title="Do planeamento ao atendimento"
          description="Três passos simples para chegar à agência com tudo tratado antecipadamente."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {demoSteps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <Card key={step.title} className="border-t-4 border-t-royal p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal-soft text-royal">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-line">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-deep">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Serviços"
            title="O que pode fazer no BancaFlow"
            description="Estrutura inicial das áreas de atendimento e documentação."
            action={
              <Button asChild variant="outline">
                <Link href="/servicos">
                  Ver todos os serviços
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
            }
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {highlights.map((product) => (
              <Card
                key={product.id}
                className="p-6 transition-colors hover:border-vivid/50"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-turquoise-ink">
                  {product.category}
                </p>
                <h3 className="mt-2 text-lg font-bold text-deep">{product.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-vivid bg-deep">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-turquoise">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Pronto para começar
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              A sua próxima visita à agência pode ser mais simples.
            </h2>
            <Badge variant="warning" className="mt-4">
              Novo fluxo digital em construção
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/registo">Criar conta</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:border-turquoise hover:bg-white/10"
            >
              <Link href="/dashboard">Explorar dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
