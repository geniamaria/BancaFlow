"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { BranchForm } from "@/components/admin/branch-form";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/page-state";
import {
  apiFetch,
  getStoredUser,
  toTimeInput,
  type BankDto,
  type BranchDto,
  type UserDto,
} from "@/lib/api";

type BranchSubmit = Parameters<typeof BranchForm>[0]["onSubmit"] extends (v: infer V) => unknown ? V : never;

export default function AgenciasPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusId, setStatusId] = useState<string | null>(null);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canManage = user?.role === "SUPER_ADMIN" || user?.role === "BANK_ADMIN";

  const loadBanks = useCallback(async (currentUser: UserDto) => {
    setLoadingBanks(true);
    setError(null);
    try {
      const res = await apiFetch<{ data: BankDto[] }>("/banks");
      const list = res.data ?? [];
      setBanks(list);
      const defaultBankId =
        currentUser.role === "BANK_ADMIN"
          ? currentUser.bankId || list[0]?.id || ""
          : list[0]?.id || "";
      setSelectedBankId(defaultBankId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar os bancos.");
    } finally {
      setLoadingBanks(false);
    }
  }, []);

  const loadBranches = useCallback(async (bankId: string) => {
    if (!bankId) {
      setBranches([]);
      return;
    }
    setLoadingBranches(true);
    setError(null);
    try {
      const res = await apiFetch<{ data: BranchDto[] }>(`/banks/${bankId}/branches`);
      setBranches(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as agências.");
    } finally {
      setLoadingBranches(false);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    if (stored) {
      void loadBanks(stored);
    } else {
      setLoadingBanks(false);
    }
  }, [loadBanks]);

  useEffect(() => {
    if (selectedBankId) {
      void loadBranches(selectedBankId);
    }
  }, [selectedBankId, loadBranches]);

  const selectedBank = useMemo(
    () => banks.find((b) => b.id === selectedBankId) ?? null,
    [banks, selectedBankId],
  );

  async function handleCreate(values: BranchSubmit) {
    if (!selectedBankId) return;
    setCreating(true);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: BranchDto }>(`/banks/${selectedBankId}/branches`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      setBranches((prev) => [res.data, ...prev]);
      setShowCreate(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível criar a agência.");
    } finally {
      setCreating(false);
    }
  }

  async function handleEdit(branchId: string, values: BranchSubmit) {
    if (!selectedBankId) return;
    setSavingId(branchId);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: BranchDto }>(
        `/banks/${selectedBankId}/branches/${branchId}`,
        { method: "PATCH", body: JSON.stringify(values) },
      );
      setBranches((prev) => prev.map((b) => (b.id === branchId ? res.data : b)));
      setEditingId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível actualizar a agência.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleStatus(branch: BranchDto) {
    if (!selectedBankId) return;
    setStatusId(branch.id);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: BranchDto }>(
        `/banks/${selectedBankId}/branches/${branch.id}/status`,
        { method: "PATCH", body: JSON.stringify({ isActive: !branch.isActive }) },
      );
      setBranches((prev) => prev.map((b) => (b.id === branch.id ? res.data : b)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível alterar o estado.");
    } finally {
      setStatusId(null);
    }
  }

  if (!canManage && user) {
    return <EmptyState title="Acesso não permitido" description="Esta página é apenas para administradores." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-deep">Agências</h2>
          <p className="mt-1 text-sm text-muted">
            {isSuperAdmin ? "Seleccione um banco para gerir as suas agências." : "Gerir agências do seu banco."}
          </p>
        </div>
        {canManage && selectedBankId && (
          <Button onClick={() => setShowCreate((v) => !v)}>
            <Plus className="h-4 w-4" /> Nova agência
          </Button>
        )}
      </div>

      {actionError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {actionError}
        </div>
      )}

      {loadingBanks && <LoadingState label="A carregar bancos..." />}
      {error && <ErrorState message={error} onRetry={() => (selectedBankId ? void loadBranches(selectedBankId) : user && void loadBanks(user))} />}

      {!loadingBanks && !error && (
        <>
          {isSuperAdmin ? (
            <div className="max-w-sm space-y-2">
              <Label htmlFor="bank-select">Banco</Label>
              <Select
                id="bank-select"
                value={selectedBankId}
                onChange={(e) => {
                  setSelectedBankId(e.target.value);
                  setEditingId(null);
                  setShowCreate(false);
                }}
              >
                <option value="">Seleccionar banco</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>{bank.name}</option>
                ))}
              </Select>
            </div>
          ) : (
            selectedBank && (
              <div className="rounded-lg border border-line bg-white px-4 py-3 text-sm text-deep">
                <span className="text-muted">Banco: </span>
                <span className="font-semibold">{selectedBank.name}</span>
              </div>
            )
          )}

          {showCreate && selectedBankId && (
            <Card>
              <CardHeader className="border-b border-line">
                <CardTitle>Criar agência</CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <BranchForm submitLabel="Criar agência" submitting={creating} onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
              </CardContent>
            </Card>
          )}

          {loadingBranches ? (
            <LoadingState label="A carregar agências..." />
          ) : !selectedBankId ? (
            <EmptyState title="Seleccione um banco" description="Escolha um banco para ver as agências." />
          ) : branches.length === 0 ? (
            <EmptyState title="Sem agências" description="Ainda não existem agências para este banco." />
          ) : (
            <div className="space-y-4">
              {branches.map((branch) => (
                <Card key={branch.id}>
                  <CardContent className="p-5">
                    {editingId === branch.id ? (
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-deep">Editar agência</h3>
                        <BranchForm initial={branch} submitLabel="Guardar alterações" submitting={savingId === branch.id} onSubmit={(values) => handleEdit(branch.id, values)} onCancel={() => setEditingId(null)} />
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-deep">{branch.name}</h3>
                            <Badge variant={branch.isActive ? "success" : "neutral"}>{branch.isActive ? "Activa" : "Inactiva"}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted">{branch.address}, {branch.city}, {branch.province}</p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                            <span>Código: {branch.code}</span>
                            <span>{toTimeInput(branch.openingTime)} - {toTimeInput(branch.closingTime)}</span>
                            {branch.phone && <span>{branch.phone}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingId(branch.id)}>
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </Button>
                          <Button variant="ghost" size="sm" disabled={statusId === branch.id} onClick={() => void handleStatus(branch)}>
                            {statusId === branch.id ? "..." : branch.isActive ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
