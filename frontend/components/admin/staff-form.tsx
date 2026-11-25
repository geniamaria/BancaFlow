"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { BranchDto } from "@/lib/api";

export interface StaffFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "BANK_ADMIN" | "BRANCH_MANAGER" | "EMPLOYEE";
  branchIds: string[];
}

interface StaffFormProps {
  branches: BranchDto[];
  onSubmit: (values: StaffFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
}

function validate(values: StaffFormValues): string | null {
  if (!values.fullName.trim()) return "O nome completo é obrigatório.";
  if (!values.email.trim()) return "O email é obrigatório.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return "O email é inválido.";
  if (!values.phone.trim()) return "O telefone é obrigatório.";
  if (!values.password) return "A palavra-passe é obrigatória.";
  if (values.password.length < 6) return "A palavra-passe deve ter pelo menos 6 caracteres.";
  if (!values.role) return "O papel é obrigatório.";
  return null;
}

export function StaffForm({ branches, onSubmit, onCancel, submitting = false }: StaffFormProps) {
  const [values, setValues] = useState<StaffFormValues>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "EMPLOYEE",
    branchIds: [],
  });
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof StaffFormValues>(key: K, value: StaffFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleBranch(branchId: string) {
    setValues((prev) => ({
      ...prev,
      branchIds: prev.branchIds.includes(branchId)
        ? prev.branchIds.filter((id) => id !== branchId)
        : [...prev.branchIds, branchId],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    await onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="staff-name">Nome completo *</Label>
          <Input id="staff-name" value={values.fullName} onChange={(e) => set("fullName", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="staff-email">Email *</Label>
          <Input id="staff-email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="staff-phone">Telefone *</Label>
          <Input id="staff-phone" value={values.phone} onChange={(e) => set("phone", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="staff-password">Palavra-passe *</Label>
          <Input id="staff-password" type="password" value={values.password} onChange={(e) => set("password", e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="staff-role">Papel *</Label>
        <Select id="staff-role" value={values.role} onChange={(e) => set("role", e.target.value as StaffFormValues["role"])}>
          <option value="BANK_ADMIN">Administrador do banco</option>
          <option value="BRANCH_MANAGER">Gestor de agência</option>
          <option value="EMPLOYEE">Funcionário</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Agências associadas</Label>
        {branches.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma agência disponível.</p>
        ) : (
          <div className="grid gap-2 rounded-lg border border-line bg-canvas p-3 sm:grid-cols-2">
            {branches.map((branch) => (
              <label key={branch.id} className="flex items-center gap-2 text-sm text-deep">
                <input
                  type="checkbox"
                  checked={values.branchIds.includes(branch.id)}
                  onChange={() => toggleBranch(branch.id)}
                  className="h-4 w-4 rounded border-line accent-vivid"
                />
                <span>{branch.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "A criar..." : "Criar funcionário"}
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
