"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BankDto } from "@/lib/api";

export interface BankFormValues {
  name: string;
  slug: string;
  description: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
  phone: string;
  website: string;
  isActive: boolean;
}

interface BankFormProps {
  initial?: Partial<BankDto>;
  onSubmit: (values: BankFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
  submitLabel: string;
}

function toInitial(initial?: Partial<BankDto>): BankFormValues {
  return {
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    logo: initial?.logo ?? "",
    primaryColor: initial?.primaryColor ?? "#003B71",
    secondaryColor: initial?.secondaryColor ?? "#0066CC",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    website: initial?.website ?? "",
    isActive: initial?.isActive ?? true,
  };
}

function validate(values: BankFormValues): string | null {
  if (!values.name.trim()) return "O nome é obrigatório.";
  if (!values.slug.trim()) return "O slug é obrigatório.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug.trim())) {
    return "O slug deve conter apenas letras minúsculas, números e hífenes.";
  }
  if (!values.description.trim()) return "A descrição é obrigatória.";
  if (!/^#[0-9A-Fa-f]{6}$/.test(values.primaryColor.trim())) {
    return "A cor primária deve estar no formato #RRGGBB.";
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(values.secondaryColor.trim())) {
    return "A cor secundária deve estar no formato #RRGGBB.";
  }
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    return "O email é inválido.";
  }
  if (values.website.trim()) {
    try {
      new URL(values.website.trim());
    } catch {
      return "O website deve ser um URL válido.";
    }
  }
  return null;
}

export function BankForm({
  initial,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel,
}: BankFormProps) {
  const [values, setValues] = useState<BankFormValues>(() => toInitial(initial));
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BankFormValues>(key: K, value: BankFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
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
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      logo: values.logo.trim(),
      primaryColor: values.primaryColor.trim(),
      secondaryColor: values.secondaryColor.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      website: values.website.trim(),
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
          <Label htmlFor="bank-name">Nome *</Label>
          <Input id="bank-name" value={values.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bank-slug">Slug *</Label>
          <Input id="bank-slug" value={values.slug} onChange={(e) => set("slug", e.target.value)} placeholder="meu-banco" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank-description">Descrição *</Label>
        <textarea
          id="bank-description"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          required
          rows={3}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-deep outline-none transition-colors placeholder:font-normal placeholder:text-muted/80 focus:border-vivid focus:ring-2 focus:ring-vivid/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bank-primary">Cor primária *</Label>
          <div className="flex gap-2">
            <input type="color" value={values.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="h-11 w-14 rounded-lg border border-line bg-white p-1" />
            <Input id="bank-primary" value={values.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bank-secondary">Cor secundária *</Label>
          <div className="flex gap-2">
            <input type="color" value={values.secondaryColor} onChange={(e) => set("secondaryColor", e.target.value)} className="h-11 w-14 rounded-lg border border-line bg-white p-1" />
            <Input id="bank-secondary" value={values.secondaryColor} onChange={(e) => set("secondaryColor", e.target.value)} required />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bank-email">Email</Label>
          <Input id="bank-email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bank-phone">Telefone</Label>
          <Input id="bank-phone" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bank-website">Website</Label>
          <Input id="bank-website" value={values.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bank-logo">Logo (URL)</Label>
          <Input id="bank-logo" value={values.logo} onChange={(e) => set("logo", e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-deep">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
          className="h-4 w-4 rounded border-line accent-vivid"
        />
        Banco activo
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "A guardar..." : submitLabel}
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
