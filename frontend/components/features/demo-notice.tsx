import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Aviso de atenção: usa amarelo para sinalizar conteúdo de demonstração. */
export function DemoNotice({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-ink ring-1 ring-gold/40",
        className,
      )}
    >
      <Info aria-hidden="true" className="h-3.5 w-3.5" />
      Dados de demonstração
    </span>
  );
}
