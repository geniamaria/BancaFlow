import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  Clock3,
  FileText,
  MapPin,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import { DemoNotice } from "@/components/features/demo-notice";
import { StatCard } from "@/components/features/stat-card";
import { QueueStatusBadge } from "@/components/features/queue-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAgencies } from "@/lib/demo-data";

const steps = [
  { label: "Escolher agência e serviço", done: true },
  { label: "Carregar documentos", done: true },
  { label: "Apresentar originais na agência", done: false },
  { label: "Concluir abertura da conta", done: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-royal p-6 text-white sm:p-7">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-turquoise" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-turquoise-light">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Área do cliente
            </p>
            <h2 className="mt-2 text-2xl font-bold">Olá, cliente demonstrativo</h2>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Aqui está um resumo da sua experiência BancaFlow.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <DemoNotice />
            <Badge className="bg-white/10 text-white ring-1 ring-white/20">
              Próximo atendimento: amanhã, 09:30
            </Badge>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Próximo atendimento"
          value="Amanhã, 09:30"
          detail="Aurora – Baixa · Serviço de abertura"
          icon={CalendarClock}
          accent="vivid"
        />
        <StatCard
          label="Documentos pendentes"
          value="2"
          detail="Comprovativo de residência e identificação"
          icon={FileText}
          accent="gold"
        />
        <StatCard
          label="Espera média na agência"
          value="11 min"
          detail="Estimativa ilustrativa das últimas 24 h"
          icon={Clock3}
          accent="turquoise"
        />
        <StatCard
          label="Senha de atendimento"
          value="B-014"
          detail="Aguardando confirmação"
          icon={TicketCheck}
          accent="royal"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between border-b border-line bg-royal-soft/60">
            <div>
              <CardTitle>Próximo atendimento</CardTitle>
              <p className="mt-1 text-sm text-muted">
                Confirme os detalhes antes de se deslocar.
              </p>
            </div>
            <Badge variant="success">Confirmado</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-canvas p-4">
                <p className="text-xs text-muted">Data e hora</p>
                <p className="mt-1 text-sm font-semibold text-deep">
                  Amanhã, 09:30
                </p>
              </div>
              <div className="rounded-lg bg-canvas p-4">
                <p className="text-xs text-muted">Serviço</p>
                <p className="mt-1 text-sm font-semibold text-deep">
                  Abertura de conta
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-line pt-4">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 text-turquoise-ink" />
              <div>
                <p className="text-sm font-medium text-deep">Aurora – Baixa</p>
                <p className="text-sm text-muted">Av. da Liberdade, 120 · Maputo</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/agencias">Ver agências</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/servicos">Documentos necessários</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-line">
            <CardTitle>Progresso do pedido</CardTitle>
            <p className="mt-1 text-sm text-muted">
              Abertura de conta à ordem
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step.label} className="flex items-start gap-3">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      step.done
                        ? "bg-turquoise text-white"
                        : "border border-line bg-white text-muted"
                    }`}
                  >
                    {step.done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span
                    className={`text-sm ${
                      step.done ? "text-deep" : "text-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex items-start gap-2 rounded-lg bg-gold-soft px-3 py-2.5 text-xs font-semibold text-gold-ink">
              <FileText aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Faltam 2 documentos para concluir o passo 2.
            </div>
            <p className="mt-4 text-xs text-muted">
              Actualizações automáticas de estado chegarão numa fase posterior.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between border-b border-line">
          <CardTitle>Agências por perto</CardTitle>
          <Link
            href="/agencias"
            className="inline-flex items-center gap-1 text-sm font-medium text-vivid hover:underline"
          >
            Ver todas
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          {demoAgencies.slice(0, 3).map((agency) => (
            <div
              key={agency.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-deep">{agency.name}</p>
                <p className="text-xs text-muted">
                  {agency.city} · a {agency.distanceKm.toLocaleString("pt-MZ")} km
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-deep">
                  {agency.waitMinutes === 0 ? "—" : `${agency.waitMinutes} min`}
                </span>
                <QueueStatusBadge level={agency.level} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
