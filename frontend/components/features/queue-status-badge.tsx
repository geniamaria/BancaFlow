import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { QueueLevel } from "@/lib/demo-data";

const statusMap: Record<QueueLevel, { label: string; variant: BadgeProps["variant"] }> = {
  normal: { label: "Fluido", variant: "success" },
  ocupada: { label: "Com movimento", variant: "warning" },
  fechada: { label: "Fechada", variant: "neutral" },
};

export function QueueStatusBadge({ level }: { level: QueueLevel }) {
  const status = statusMap[level];
  return <Badge variant={status.variant}>{status.label}</Badge>;
}
