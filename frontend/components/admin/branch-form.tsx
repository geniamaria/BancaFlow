"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toTimeInput, type BranchDto } from "@/lib/api";

export interface BranchFormValues {
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  district: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
}

interface BranchFormProps {
  initial?: Partial<BranchDto>;
  onSubmit: (values: {
    name: string;
    code: string;
    address: string;
    city: string;
    province: string;
    district?: string;
    latitude: number;
    longitude: number;
    phone?: string;
    email?: string;
    openingTime: string;
    closingTime: string;
  }) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
  submitLabel: string;
}

function toInitial(initial?: Partial<BranchDto>): BranchFormValues {
  return {
    name: initial?.name ?? "",
    code: initial?.code ?? "",
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    province: initial?.province ?? "",
    district: initial?.district ?? "",
    latitude: initial?.latitude !== undefined ? String(initial.latitude) : "",
    longitude: initial?.longitude !== undefined ? String(initial.longitude) : "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    openingTime: toTimeInput(initial?.openingTime) || "08:00",
    closingTime: toTimeInput(initial?.closingTime) || "16:00",
  };
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function validate(values: BranchFormValues): string | null {
  if (!values.name.trim()) return "O nome é obrigatório.";
  if (!values.code.trim()) return "O código é obrigatório.";
  if (!values.address.trim()) return "O endereço é obrigatório.";
  if (!values.city.trim()) return "A cidade é obrigatória.";
  if (!values.province.trim()) return "A província é obrigatória.";

  const lat = Number(values.latitude);
  const lng = Number(values.longitude);
  if (values.latitude.trim() === "" || Number.isNaN(lat)) return "A latitude é obrigatória.";
  if (lat < -90 || lat > 90) return "A latitude deve estar entre -90 e 90.";
  if (values.longitude.trim() === "" || Number.isNaN(lng)) return "A longitude é obrigatória.";
  if (lng < -180 || lng > 180) return "A longitude deve estar entre -180 e 180.";

  if (!isValidTime(values.openingTime)) return "A hora de abertura deve estar no formato HH:mm.";
  if (!isValidTime(values.closingTime)) return "A hora de fecho deve estar no formato HH:mm.";
  if (values.closingTime <= values.openingTime) {
    return "A hora de fecho deve ser posterior à hora de abertura.";
  }

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    return "O email é inválido.";
  }
  return null;
}

export function BranchForm({
  initial,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel,
}: BranchFormProps) {
  const [values, setValues] = useState<BranchFormValues>(() => toInitial(initial));
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BranchFormValues>(key: K, value: BranchFormValues[K]) {
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

    const payload: Parameters<BranchFormProps["onSubmit"]>[0] = {
      name: values.name.trim(),
      code: values.code.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      province: values.province.trim(),
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      openingTime: values.openingTime,
      closingTime: values.closingTime,
    };
    if (values.district.trim()) payload.district = values.district.trim();
    if (values.phone.trim()) payload.phone = values.phone.trim();
    if (values.email.trim()) payload.email = values.email.trim();

    await onSubmit(payload);
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
          <Label htmlFor="branch-name">Nome *</Label>
          <Input id="branch-name" value={values.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-code">Código *</Label>
          <Input id="branch-code" value={values.code} onChange={(e) => set("code", e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch-address">Endereço *</Label>
        <Input id="branch-address" value={values.address} onChange={(e) => set("address", e.target.value)} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="branch-city">Cidade *</Label>
          <Input id="branch-city" value={values.city} onChange={(e) => set("city", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-province">Província *</Label>
          <Input id="branch-province" value={values.province} onChange={(e) => set("province", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-district">Distrito</Label>
          <Input id="branch-district" value={values.district} onChange={(e) => set("district", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="branch-lat">Latitude *</Label>
          <Input id="branch-lat" type="number" step="any" min="-90" max="90" value={values.latitude} onChange={(e) => set("latitude", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-lng">Longitude *</Label>
          <Input id="branch-lng" type="number" step="any" min="-180" max="180" value={values.longitude} onChange={(e) => set("longitude", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="branch-open">Hora de abertura *</Label>
          <Input id="branch-open" type="time" value={values.openingTime} onChange={(e) => set("openingTime", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-close">Hora de fecho *</Label>
          <Input id="branch-close" type="time" value={values.closingTime} onChange={(e) => set("closingTime", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="branch-phone">Telefone</Label>
          <Input id="branch-phone" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-email">Email</Label>
          <Input id="branch-email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      </div>

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
