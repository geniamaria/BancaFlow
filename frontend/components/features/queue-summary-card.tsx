import { Clock3, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QueueStatusBadge } from "@/components/features/queue-status-badge";
import { demoAgencies } from "@/lib/demo-data";

export function QueueSummaryCard() {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="border-b-0 bg-royal p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Movimento das filas</h3>
            <p className="mt-1 text-sm text-white/70">Pré-visualização por agência</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-turquoise">
            <Clock3 aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-2">
        {demoAgencies.slice(0, 3).map((agency) => (
          <div
            key={agency.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-2 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-royal-soft text-vivid">
                <MapPin aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-deep">{agency.name}</p>
                <p className="text-xs text-muted">{agency.bank}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-royal">
                {agency.waitMinutes === 0 ? "—" : `${agency.waitMinutes} min`}
              </span>
              <QueueStatusBadge level={agency.level} />
            </div>
          </div>
        ))}
      </CardContent>
      <div className="border-t border-line px-5 py-3 text-xs text-muted">
        Actualizações em tempo real previstas para uma fase posterior.
      </div>
    </Card>
  );
}
