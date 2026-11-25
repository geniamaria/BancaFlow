"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankForm, type BankFormValues } from "@/components/admin/bank-form";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/page-state";
import { apiFetch, getStoredUser, type BankDto, type UserDto } from "@/lib/api";

export default function BancosPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusId, setStatusId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ data: BankDto[] }>("/banks");
      setBanks(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar os bancos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    void load();
  }, [load]);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canViewBanks = user?.role === "SUPER_ADMIN" || user?.role === "BANK_ADMIN";

  async function handleCreate(values: BankFormValues) {
    setCreating(true);
    setActionError(null);
    try {
      const body = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        isActive: values.isActive,
        ...(values.logo ? { logo: values.logo } : {}),
        ...(values.email ? { email: values.email } : {}),
        ...(values.phone ? { phone: values.phone } : {}),
        ...(values.website ? { website: values.website } : {}),
      };
      const res = await apiFetch<{ data: BankDto }>("/banks", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setBanks((prev) => [res.data, ...prev]);
      setShowCreate(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível criar o banco.");
    } finally {
      setCreating(false);
    }
  }

  async function handleEdit(bankId: string, values: BankFormValues) {
    setSavingId(bankId);
    setActionError(null);
    try {
      const body = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        logo: values.logo || null,
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        email: values.email || null,
        phone: values.phone || null,
        website: values.website || null,
      };
      const res = await apiFetch<{ data: BankDto }>(`/banks/${bankId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setBanks((prev) => prev.map((b) => (b.id === bankId ? res.data : b)));
      setEditingId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível actualizar o banco.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleStatus(bank: BankDto) {
    setStatusId(bank.id);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: BankDto }>(`/banks/${bank.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !bank.isActive }),
      });
      setBanks((prev) => prev.map((b) => (b.id === bank.id ? res.data : b)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível alterar o estado.");
    } finally {
      setStatusId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-deep">Bancos</h2>
          <p className="mt-1 text-sm text-muted">
            {isSuperAdmin
              ? "Gerir instituições registadas na plataforma."
              : "Informação do banco associado à sua conta."}
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setShowCreate((v) => !v)}>
            <Plus className="h-4 w-4" />
            Novo banco
          </Button>
        )}
      </div>

      {actionError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {actionError}
        </div>
      )}

      {user && !canViewBanks && (
        <EmptyState
          title="Acesso não permitido"
          description="Esta página é apenas para administradores."
        />
      )}

      {showCreate && isSuperAdmin && (
        <Card>
          <CardHeader className="border-b border-line">
            <CardTitle>Criar banco</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <BankForm
              submitLabel="Criar banco"
              submitting={creating}
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
            />
          </CardContent>
        </Card>
      )}

      {canViewBanks && loading && <LoadingState label="A carregar bancos..." />}
      {canViewBanks && error && <ErrorState message={error} onRetry={() => void load()} />}

      {canViewBanks && !loading && !error && banks.length === 0 && (
        <EmptyState
          title="Sem bancos"
          description={isSuperAdmin ? "Crie o primeiro banco para começar." : "Nenhum banco associado."}
        />
      )}

      {canViewBanks && !loading && !error && banks.length > 0 && (
        <div className="space-y-4">
          {banks.map((bank) => (
            <Card key={bank.id}>
              <CardContent className="p-5">
                {editingId === bank.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-deep">Editar banco</h3>
                      <Badge variant={bank.isActive ? "success" : "neutral"}>
                        {bank.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <BankForm
                      initial={bank}
                      submitLabel="Guardar alterações"
                      submitting={savingId === bank.id}
                      onSubmit={(values) => handleEdit(bank.id, values)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-deep">{bank.name}</h3>
                        <Badge variant={bank.isActive ? "success" : "neutral"}>
                          {bank.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted">{bank.description}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                        <span>Slug: {bank.slug}</span>
                        <span>{bank.branchCount} agências</span>
                        {bank.email && <span>{bank.email}</span>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/bancos/${bank.id}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                          Detalhes
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(bank.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant={bank.isActive ? "ghost" : "outline"}
                        size="sm"
                        onClick={() => void handleStatus(bank)}
                        disabled={statusId === bank.id}
                      >
                        {statusId === bank.id
                          ? "..."
                          : bank.isActive
                            ? "Desactivar"
                            : "Activar"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
