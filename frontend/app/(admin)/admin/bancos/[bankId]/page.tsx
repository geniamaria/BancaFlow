"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankForm, type BankFormValues } from "@/components/admin/bank-form";
import { BranchForm } from "@/components/admin/branch-form";
import { StaffForm, type StaffFormValues } from "@/components/admin/staff-form";
import { AssignmentForm, type AssignmentFormValues } from "@/components/admin/assignment-form";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/page-state";
import {
  apiFetch,
  getStoredUser,
  toTimeInput,
  type BankDto,
  type BranchDto,
  type StaffUserDto,
  type UserDto,
} from "@/lib/api";

type BranchSubmit = Parameters<typeof BranchForm>[0]["onSubmit"] extends (v: infer V) => unknown ? V : never;

export default function BankDetailPage() {
  const params = useParams<{ bankId: string }>();
  const bankId = params.bankId;
  const [user, setUser] = useState<UserDto | null>(null);

  const [bank, setBank] = useState<BankDto | null>(null);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [staff, setStaff] = useState<StaffUserDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [editingBank, setEditingBank] = useState(false);
  const [savingBank, setSavingBank] = useState(false);

  const [showBranchCreate, setShowBranchCreate] = useState(false);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [savingBranchId, setSavingBranchId] = useState<string | null>(null);
  const [branchStatusId, setBranchStatusId] = useState<string | null>(null);

  const [showStaffCreate, setShowStaffCreate] = useState(false);
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [staffStatusId, setStaffStatusId] = useState<string | null>(null);

  const [showAssignmentCreate, setShowAssignmentCreate] = useState(false);
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [assignmentStatusId, setAssignmentStatusId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bankRes, branchRes, staffRes] = await Promise.all([
        apiFetch<{ data: BankDto }>(`/banks/${bankId}`),
        apiFetch<{ data: BranchDto[] }>(`/banks/${bankId}/branches`),
        apiFetch<{ data: StaffUserDto[] }>(`/banks/${bankId}/staff`),
      ]);
      setBank(bankRes.data);
      setBranches(branchRes.data ?? []);
      setStaff(staffRes.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar o banco.");
    } finally {
      setLoading(false);
    }
  }, [bankId]);

  useEffect(() => {
    setUser(getStoredUser());
    void load();
  }, [load]);

  const canManage = user?.role === "SUPER_ADMIN" || user?.role === "BANK_ADMIN";

  async function handleBankEdit(values: BankFormValues) {
    if (!bank) return;
    setSavingBank(true);
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
      const res = await apiFetch<{ data: BankDto }>(`/banks/${bank.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setBank(res.data);
      setEditingBank(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível actualizar o banco.");
    } finally {
      setSavingBank(false);
    }
  }

  async function handleBranchCreate(values: BranchSubmit) {
    setCreatingBranch(true);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: BranchDto }>(`/banks/${bankId}/branches`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      setBranches((prev) => [res.data, ...prev]);
      setShowBranchCreate(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível criar a agência.");
    } finally {
      setCreatingBranch(false);
    }
  }

  async function handleBranchEdit(branchIdToEdit: string, values: BranchSubmit) {
    setSavingBranchId(branchIdToEdit);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: BranchDto }>(
        `/banks/${bankId}/branches/${branchIdToEdit}`,
        { method: "PATCH", body: JSON.stringify(values) },
      );
      setBranches((prev) => prev.map((b) => (b.id === branchIdToEdit ? res.data : b)));
      setEditingBranchId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível actualizar a agência.");
    } finally {
      setSavingBranchId(null);
    }
  }

  async function handleBranchStatus(branch: BranchDto) {
    setBranchStatusId(branch.id);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: BranchDto }>(
        `/banks/${bankId}/branches/${branch.id}/status`,
        { method: "PATCH", body: JSON.stringify({ isActive: !branch.isActive }) },
      );
      setBranches((prev) => prev.map((b) => (b.id === branch.id ? res.data : b)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível alterar o estado da agência.");
    } finally {
      setBranchStatusId(null);
    }
  }

  async function handleStaffCreate(values: StaffFormValues) {
    setCreatingStaff(true);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: StaffUserDto }>(`/banks/${bankId}/staff`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      setStaff((prev) => [res.data, ...prev]);
      setShowStaffCreate(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível criar o funcionário.");
    } finally {
      setCreatingStaff(false);
    }
  }

  async function handleStaffStatus(member: StaffUserDto) {
    setStaffStatusId(member.id);
    setActionError(null);
    try {
      const res = await apiFetch<{ data: StaffUserDto }>(
        `/banks/${bankId}/staff/${member.id}/status`,
        { method: "PATCH", body: JSON.stringify({ isActive: !member.isActive }) },
      );
      setStaff((prev) => prev.map((s) => (s.id === member.id ? res.data : s)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível alterar o estado do funcionário.");
    } finally {
      setStaffStatusId(null);
    }
  }

  async function handleAssignmentCreate(values: AssignmentFormValues) {
    setCreatingAssignment(true);
    setActionError(null);
    try {
      await apiFetch(`/banks/${bankId}/assignments`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      setShowAssignmentCreate(false);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível criar a associação.");
    } finally {
      setCreatingAssignment(false);
    }
  }

  async function handleAssignmentStatus(assignmentId: string, isActive: boolean) {
    setAssignmentStatusId(assignmentId);
    setActionError(null);
    try {
      await apiFetch(`/banks/${bankId}/assignments/${assignmentId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !isActive }),
      });
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Não foi possível alterar o estado da associação.");
    } finally {
      setAssignmentStatusId(null);
    }
  }

  if (loading) return <LoadingState label="A carregar detalhes do banco..." />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!bank) return <EmptyState title="Banco não encontrado" />;
  if (user && user.role !== "SUPER_ADMIN" && user.role !== "BANK_ADMIN") {
    return <EmptyState title="Acesso não permitido" description="Esta página é apenas para administradores." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-deep">{bank.name}</h2>
        <p className="mt-1 text-sm text-muted">Detalhes do banco, agências e equipa.</p>
      </div>

      {actionError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {actionError}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-line">
          <div>
            <CardTitle>Informação do banco</CardTitle>
            <p className="mt-1 text-sm text-muted">Dados gerais da instituição.</p>
          </div>
          {canManage && !editingBank && (
            <Button variant="outline" size="sm" onClick={() => setEditingBank(true)}>
              <Pencil className="h-3.5 w-3.5" /> Editar
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-5">
          {editingBank ? (
            <BankForm
              initial={bank}
              submitLabel="Guardar alterações"
              submitting={savingBank}
              onSubmit={handleBankEdit}
              onCancel={() => setEditingBank(false)}
            />
          ) : (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="text-muted">Slug:</span> <span className="font-medium text-deep">{bank.slug}</span></div>
              <div><span className="text-muted">Estado:</span> <Badge variant={bank.isActive ? "success" : "neutral"}>{bank.isActive ? "Activo" : "Inactivo"}</Badge></div>
              <div><span className="text-muted">Email:</span> <span className="font-medium text-deep">{bank.email || "—"}</span></div>
              <div><span className="text-muted">Telefone:</span> <span className="font-medium text-deep">{bank.phone || "—"}</span></div>
              <div><span className="text-muted">Website:</span> <span className="font-medium text-deep">{bank.website || "—"}</span></div>
              <div><span className="text-muted">Agências:</span> <span className="font-medium text-deep">{bank.branchCount}</span></div>
              <div className="sm:col-span-2"><span className="text-muted">Descrição:</span> <span className="font-medium text-deep">{bank.description}</span></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-line">
          <div>
            <CardTitle>Agências</CardTitle>
            <p className="mt-1 text-sm text-muted">Agências deste banco.</p>
          </div>
          {canManage && (
            <Button size="sm" onClick={() => setShowBranchCreate((v) => !v)}>
              <Plus className="h-4 w-4" /> Nova agência
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {showBranchCreate && canManage && (
            <div className="rounded-xl border border-line bg-canvas p-4">
              <h4 className="mb-4 text-sm font-semibold text-deep">Criar agência</h4>
              <BranchForm submitLabel="Criar agência" submitting={creatingBranch} onSubmit={handleBranchCreate} onCancel={() => setShowBranchCreate(false)} />
            </div>
          )}

          {branches.length === 0 ? (
            <EmptyState title="Sem agências" description="Ainda não existem agências registadas." />
          ) : (
            branches.map((branch) => (
              <div key={branch.id} className="rounded-xl border border-line p-4">
                {editingBranchId === branch.id ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-deep">Editar agência</h4>
                    <BranchForm initial={branch} submitLabel="Guardar alterações" submitting={savingBranchId === branch.id} onSubmit={(values) => handleBranchEdit(branch.id, values)} onCancel={() => setEditingBranchId(null)} />
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-deep">{branch.name}</p>
                        <Badge variant={branch.isActive ? "success" : "neutral"}>{branch.isActive ? "Activa" : "Inactiva"}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted">{branch.code} · {branch.city}, {branch.province}</p>
                      <p className="mt-1 text-xs text-muted">{toTimeInput(branch.openingTime)} - {toTimeInput(branch.closingTime)}</p>
                    </div>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingBranchId(branch.id)}>
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </Button>
                        <Button variant="ghost" size="sm" disabled={branchStatusId === branch.id} onClick={() => void handleBranchStatus(branch)}>
                          {branchStatusId === branch.id ? "..." : branch.isActive ? "Desactivar" : "Activar"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-line">
          <div>
            <CardTitle>Funcionários</CardTitle>
            <p className="mt-1 text-sm text-muted">Gestão de staff do banco.</p>
          </div>
          {canManage && (
            <Button size="sm" onClick={() => setShowStaffCreate((v) => !v)}>
              <Plus className="h-4 w-4" /> Novo funcionário
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {showStaffCreate && canManage && (
            <div className="rounded-xl border border-line bg-canvas p-4">
              <h4 className="mb-4 text-sm font-semibold text-deep">Criar funcionário</h4>
              <StaffForm branches={branches} submitting={creatingStaff} onSubmit={handleStaffCreate} onCancel={() => setShowStaffCreate(false)} />
            </div>
          )}

          {staff.length === 0 ? (
            <EmptyState title="Sem funcionários" description="Ainda não existem funcionários registados." />
          ) : (
            staff.map((member) => (
              <div key={member.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-deep">{member.fullName}</p>
                      <Badge variant={member.isActive ? "success" : "neutral"}>{member.isActive ? "Activo" : "Inactivo"}</Badge>
                      <Badge variant="default">{member.role}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">{member.email} · {member.phone}</p>
                    <p className="mt-1 text-xs text-muted">
                      Associações: {member.assignments?.length ? member.assignments.map((a) => a.branchName || a.branchId).join(", ") : "—"}
                    </p>
                  </div>
                  {canManage && (
                    <Button variant="ghost" size="sm" disabled={staffStatusId === member.id} onClick={() => void handleStaffStatus(member)}>
                      {staffStatusId === member.id ? "..." : member.isActive ? "Desactivar" : "Activar"}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-line">
          <div>
            <CardTitle>Associações</CardTitle>
            <p className="mt-1 text-sm text-muted">Associação de funcionários a agências.</p>
          </div>
          {canManage && (
            <Button size="sm" onClick={() => setShowAssignmentCreate((v) => !v)}>
              <Plus className="h-4 w-4" /> Nova associação
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {showAssignmentCreate && canManage && (
            <div className="rounded-xl border border-line bg-canvas p-4">
              <h4 className="mb-4 text-sm font-semibold text-deep">Criar associação</h4>
              <AssignmentForm staff={staff} branches={branches} submitting={creatingAssignment} onSubmit={handleAssignmentCreate} onCancel={() => setShowAssignmentCreate(false)} />
            </div>
          )}

          {staff.flatMap((s) => s.assignments || []).length === 0 ? (
            <EmptyState title="Sem associações" description="Ainda não existem associações registadas." />
          ) : (
            <div className="space-y-2">
              {staff.flatMap((s) => (s.assignments || []).map((a) => ({ ...a, userFullName: a.userFullName || s.fullName }))).map((assignment) => (
                <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-4">
                  <div>
                    <p className="text-sm font-semibold text-deep">{assignment.userFullName || assignment.userId}</p>
                    <p className="text-xs text-muted">
                      {assignment.branchName || assignment.branchId} · {assignment.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={assignment.isActive ? "success" : "neutral"}>{assignment.isActive ? "Activa" : "Inactiva"}</Badge>
                    {canManage && (
                      <Button variant="ghost" size="sm" disabled={assignmentStatusId === assignment.id} onClick={() => void handleAssignmentStatus(assignment.id, assignment.isActive)}>
                        {assignmentStatusId === assignment.id ? "..." : assignment.isActive ? "Desactivar" : "Activar"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
