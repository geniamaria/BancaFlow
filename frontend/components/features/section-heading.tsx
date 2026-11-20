import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-turquoise-ink">
          <span className="h-3 w-1 rounded-full bg-vivid" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-bold text-deep sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
