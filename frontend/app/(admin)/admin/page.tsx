import { Activity, Bell, Building2, Layers3, Settings2 } from "lucide-react";
import { DemoNotice } from "@/components/features/demo-notice";
import { QueueStatusBadge } from "@/components/features/queue-status-badge";
import { StatCard } from "@/components/features/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminMetrics, demoAgencies, demoBanks } from "@/lib/demo-data";

const metricIcons = [Building2, Layers3, Settings2, Layers3];
const metricAccents = ["royal", "vivid", "turquoise", "gold"] as const;

const nextModules = [
  "Gestão de utilizadores e permissões",
  "Relatórios de atendimento por banco",
  "Actualizações de filas com Socket.IO",
  "Armazenamento seguro de documentos",
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-royal p-6 text-white sm:p-7">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-gold" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-turquoise-light">
              <Activity aria-hidden="true" className="h-4 w-4" />
              Operações
            </p>
            <h2 className="mt-2 text-2xl font-bold">Resumo operacional</h2>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Indicadores ilustrativos do funcionamento da plataforma.
            </p>
          </div>
          <DemoNotice />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric, index) => {
          const Icon = metricIcons[index];
          return (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              detail={metric.detail}
              icon={Icon}
              accent={metricAccents[index]}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-gold-soft px-4 py-3 text-sm font-semibold text-gold-ink ring-1 ring-gold/40">
        <Bell aria-hidden="true" className="h-4 w-4 shrink-0" />
        27 pedidos de actualização de dados aguardam validação.
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_0.75fr]">
        <Card>
          <CardHeader className="border-b border-line">
            <CardTitle>Movimento por agência</CardTitle>
            <p className="mt-1 text-sm text-muted">
              Estado das filas nas agências demonstrativas.
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-royal-soft text-xs font-bold uppercase tracking-wide text-royal">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Agência</th>
                  <th scope="col" className="px-5 py-3 font-medium">Banco</th>
                  <th scope="col" className="px-5 py-3 font-medium">Cidade</th>
                  <th scope="col" className="px-5 py-3 font-medium">Espera</th>
                  <th scope="col" className="px-5 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {demoAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td className="px-5 py-3 font-medium text-deep">{agency.name}</td>
                    <td className="px-5 py-3 text-muted">{agency.bank}</td>
                    <td className="px-5 py-3 text-muted">{agency.city}</td>
                    <td className="px-5 py-3 text-deep">
                      {agency.waitMinutes === 0 ? "—" : `${agency.waitMinutes} min`}
                    </td>
                    <td className="px-5 py-3">
                      <QueueStatusBadge level={agency.level} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-line">
            <CardTitle>Instituições</CardTitle>
            <p className="mt-1 text-sm text-muted">
              Isolamento de dados por banco no modelo de dados.
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {demoBanks.map((bank) => (
              <div
                key={bank.id}
                className="flex items-center justify-between rounded-lg border border-line px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-deep">{bank.name}</p>
                  <p className="text-xs text-muted">{bank.agencyCount} agências</p>
                </div>
                <Badge variant="success">activo</Badge>
              </div>
            ))}
            <p className="pt-2 text-xs leading-relaxed text-muted">
              Os nomes apresentados são fictícios e servem apenas para ilustrar a
              separação entre instituições.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-line">
          <CardTitle>Módulos planeados</CardTitle>
          <p className="mt-1 text-sm text-muted">
            Funcionalidades previstas, ainda não implementadas nesta etapa.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
          {nextModules.map((module) => (
            <div
              key={module}
              className="flex items-center justify-between gap-3 rounded-lg bg-canvas px-4 py-3"
            >
              <span className="text-sm text-deep">{module}</span>
              <Badge variant="neutral">planeado</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
