"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, GitBranch, ShieldCheck, Activity } from "lucide-react";
import { StatCard } from "@/components/features/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/page-state";
import {
  apiFetch,
  getStoredUser,
  toTimeInput,
  type BankDto,
  type BranchDto,
  type UserDto,
} from "@/lib/api";

interface DashboardData {
  banks: BankDto[];
  branches: BranchDto[];
}

export default function AdminPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (currentUser: UserDto) => {
    setLoading(true);
    setError(null);
    try {
      const banksRes = await apiFetch<{ data: BankDto[] }>("/banks");
      const banks = banksRes.data ?? [];

      let branches: BranchDto[] = [];
      if (currentUser.role === "SUPER_ADMIN") {
        const branchLists = await Promise.all(
          banks.map(async (bank) => {
            try {
              const res = await apiFetch<{ data: BranchDto[] }>(`/banks/${bank.id}/branches`);
              return res.data ?? [];
            } catch {
              return [];
            }
          }),
        );
        branches = branchLists.flat();
      } else if (currentUser.bankId) {
        const res = await apiFetch<{ data: BranchDto[] }>(
          `/banks/${currentUser.bankId}/branches`,
        );
        branches = res.data ?? [];
      }

      setData({ banks, branches });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar os dados.");
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

  const metrics = useMemo(() => {
    if (!data) return null;
    const activeBanks = data.banks.filter((b) => b.isActive).length;
    const activeBranches = data.branches.filter((b) => b.isActive).length;
    const totalBranches = data.banks.reduce((sum, b) => sum + (b.branchCount ?? 0), 0);
    return {
      totalBanks: data.banks.length,
      activeBanks,
      totalBranches: data.branches.length > 0 ? data.branches.length : totalBranches,
      activeBranches: data.branches.length > 0 ? activeBranches : totalBranches,
    };
  }, [data]);

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
              Indicadores obtidos da plataforma BancaFlow.
            </p>
          </div>
          {user && (
            <Badge variant="vivid">{user.role.replace(/_/g, " ")}</Badge>
          )}
        </div>
      </section>

      {loading && <LoadingState label="A carregar painel..." />}
      {error && <ErrorState message={error} onRetry={() => user && void load(user)} />}

      {!loading && !error && metrics && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Bancos"
              value={String(metrics.totalBanks)}
              detail={`${metrics.activeBanks} activo(s)`}
              icon={Building2}
              accent="royal"
            />
            <StatCard
              label="Agências"
              value={String(metrics.totalBranches)}
              detail={`${metrics.activeBranches} activa(s)`}
              icon={GitBranch}
              accent="vivid"
            />
            <StatCard
              label="Bancos activos"
              value={String(metrics.activeBanks)}
              detail="Com acesso à plataforma"
              icon={ShieldCheck}
              accent="turquoise"
            />
            <StatCard
              label="Agências activas"
              value={String(metrics.activeBranches)}
              detail="Disponíveis para atendimento"
              icon={Activity}
              accent="gold"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
            <Card>
              <CardHeader className="border-b border-line">
                <CardTitle>Agências</CardTitle>
                <p className="mt-1 text-sm text-muted">Agências obtidas da API.</p>
              </CardHeader>
              <CardContent className="p-0">
                {data.branches.length === 0 ? (
                  <div className="p-5">
                    <EmptyState
                      title="Sem agências"
                      description="Não existem agências para apresentar."
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead className="bg-royal-soft text-xs font-bold uppercase tracking-wide text-royal">
                        <tr>
                          <th scope="col" className="px-5 py-3 font-medium">Agência</th>
                          <th scope="col" className="px-5 py-3 font-medium">Cidade</th>
                          <th scope="col" className="px-5 py-3 font-medium">Horário</th>
                          <th scope="col" className="px-5 py-3 font-medium">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {data.branches.slice(0, 8).map((branch) => (
                          <tr key={branch.id}>
                            <td className="px-5 py-3 font-medium text-deep">{branch.name}</td>
                            <td className="px-5 py-3 text-muted">{branch.city}</td>
                            <td className="px-5 py-3 text-muted">
                              {toTimeInput(branch.openingTime)} - {toTimeInput(branch.closingTime)}
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant={branch.isActive ? "success" : "neutral"}>
                                {branch.isActive ? "Activa" : "Inactiva"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-line">
                <CardTitle>Bancos</CardTitle>
                <p className="mt-1 text-sm text-muted">Instituições visíveis para o seu perfil.</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                {data.banks.length === 0 ? (
                  <EmptyState title="Sem bancos" description="Nenhum banco encontrado." />
                ) : (
                  data.banks.map((bank) => (
                    <div
                      key={bank.id}
                      className="flex items-center justify-between rounded-lg border border-line px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-deep">{bank.name}</p>
                        <p className="text-xs text-muted">{bank.branchCount} agências</p>
                      </div>
                      <Badge variant={bank.isActive ? "success" : "neutral"}>
                        {bank.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
