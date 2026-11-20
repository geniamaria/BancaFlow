import Link from "next/link";
import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Quando true, o texto usa cor clara (para fundos escuros). */
  inverse?: boolean;
  compact?: boolean;
  className?: string;
}

export function Logo({ inverse = false, compact = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="BancaFlow – início"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-vivid text-white">
        <Waves aria-hidden="true" className="h-5 w-5" strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span
            className={cn(
              "block text-lg font-extrabold tracking-tight",
              inverse ? "text-white" : "text-deep",
            )}
          >
            BancaFlow
          </span>
          <span
            className={cn(
              "block text-[10px] font-semibold tracking-wide",
              inverse ? "text-turquoise-light" : "text-muted",
            )}
          >
            Menos filas. Mais tempo.
          </span>
        </span>
      )}
    </Link>
  );
}
