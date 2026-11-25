"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/page-state";
import { apiFetch, getStoredUser, toTimeInput, type BranchDto, type UserDto } from "@/lib/api";

export default function MinhasAgenciasPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (currentUser: UserDto) => {
    if (!currentUser.bankId) {
      setBranches([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ data: BranchDto[] }>(
        `/banks/${currentUser.bankId}/branches`,
      );
      setBranches(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as agências.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    if (stored) {
      void load(stored);
    } else {
      setLoading(false);
    }
  }, [load]);

  const allowed = user?.role === "BRANCH_MANAGER" || user?.role === "EMPLOYEE";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-deep">Minhas agências</h2>
        <p className="mt-1 text-sm text-muted">
          Agências associadas à sua conta.
        </p>
      </div>

      {loading && <LoadingState label="A carregar agências..." />}
      {error && <ErrorState message={error} onRetry={() => user && void load(user)} />}

      {!loading && !error && !allowed && user && (
        <EmptyState
          title="Acesso não permitido"
          description="Esta página é destinada a gestores e funcionários de agência."
        />
      )}

      {!loading && !error && allowed && branches.length === 0 && (
        <EmptyState
          title="Sem agências associadas"
          description="Não foram encontradas agências associadas à sua conta."
        />
      )}

      {!loading && !error && allowed && branches.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-deep">{branch.name}</h3>
                    <p className="text-xs text-muted">Código: {branch.code}</p>
                  </div>
                  <Badge variant={branch.isActive ? "success" : "neutral"}>
                    {branch.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
                    <span>{branch.address}, {branch.city}, {branch.province}{branch.district ? `, ${branch.district}` : ""}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-royal" />
                    <span>{toTimeInput(branch.openingTime)} - {toTimeInput(branch.closingTime)}</span>
                  </p>
                  {branch.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-royal" />
                      <span>{branch.phone}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
