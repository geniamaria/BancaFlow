"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { BranchDto, StaffUserDto } from "@/lib/api";

export interface AssignmentFormValues {
  userId: string;
  branchId: string;
  role: "BRANCH_MANAGER" | "EMPLOYEE";
}

interface AssignmentFormProps {
  staff: StaffUserDto[];
  branches: BranchDto[];
  onSubmit: (values: AssignmentFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
}

export function AssignmentForm({
  staff,
  branches,
  onSubmit,
  onCancel,
  submitting = false,
}: AssignmentFormProps) {
  const [values, setValues] = useState<AssignmentFormValues>({
    userId: staff[0]?.id ?? "",
    branchId: branches[0]?.id ?? "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!values.userId) {
      setError("Seleccione um funcionário.");
      return;
    }
    if (!values.branchId) {
      setError("Seleccione uma agência.");
      return;
    }
    setError(null);
    await onSubmit(values);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="assignment-user">Funcionário *</Label>
        <Select
          id="assignment-user"
          value={values.userId}
          onChange={(e) => setValues((p) => ({ ...p, userId: e.target.value }))}
          required
        >
          <option value="">Seleccionar funcionário</option>
          {staff.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName} ({u.email})
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignment-branch">Agência *</Label>
        <Select
          id="assignment-branch"
          value={values.branchId}
          onChange={(e) => setValues((p) => ({ ...p, branchId: e.target.value }))}
          required
        >
          <option value="">Seleccionar agência</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.code})
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignment-role">Papel *</Label>
        <Select
          id="assignment-role"
          value={values.role}
          onChange={(e) =>
            setValues((p) => ({ ...p, role: e.target.value as AssignmentFormValues["role"] }))
          }
        >
          <option value="BRANCH_MANAGER">Gestor de agência</option>
          <option value="EMPLOYEE">Funcionário</option>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "A associar..." : "Criar associação"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
