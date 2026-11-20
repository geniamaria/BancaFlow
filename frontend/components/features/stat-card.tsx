import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Accent = "vivid" | "turquoise" | "gold" | "royal";

const accentClasses: Record<Accent, string> = {
  vivid: "border-t-vivid bg-vivid/10 text-vivid",
  turquoise: "border-t-turquoise bg-turquoise-soft text-turquoise-ink",
  gold: "border-t-gold bg-gold-soft text-gold-ink",
  royal: "border-t-royal bg-royal-soft text-royal",
};

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent?: Accent;
  className?: string;
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = "vivid",
  className,
}: StatCardProps) {
  const selected = accentClasses[accent];
  const borderColor = selected.split(" ")[0];

  return (
    <Card className={cn("h-full border-t-4 p-5", borderColor, className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-deep">{value}</p>
        </div>
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            selected,
          )}
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 border-t border-line pt-3 text-xs text-muted">{detail}</p>
    </Card>
  );
}
