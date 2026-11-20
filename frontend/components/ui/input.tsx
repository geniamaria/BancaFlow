import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm font-medium text-deep outline-none transition-colors placeholder:font-normal placeholder:text-muted/80 focus:border-vivid focus:ring-2 focus:ring-vivid/20 disabled:cursor-not-allowed disabled:bg-canvas",
        className,
      )}
      {...props}
    />
  );
}
