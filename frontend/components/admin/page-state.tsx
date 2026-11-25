import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "A carregar dados..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-6 py-12 text-sm text-muted">
      <Loader2 className="h-4 w-4 animate-spin text-vivid" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="space-y-3">
          <p className="font-medium">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-royal-soft text-royal">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-deep">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-muted">{description}</p>}
    </div>
  );
}
