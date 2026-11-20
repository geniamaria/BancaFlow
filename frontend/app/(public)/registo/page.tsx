import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { AuthPanel } from "@/components/features/auth-panel";
import { DemoForm } from "@/components/features/demo-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { demoBanks } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <AuthPanel />

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <div className="mb-8 lg:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-vivid">
              BancaFlow
            </p>
            <h1 className="mt-2 text-2xl font-bold text-deep">
              Menos filas. Mais tempo.
            </h1>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-deep">
            Criar a sua conta
          </h2>
          <p className="mt-2 text-sm text-muted">
            Formulário de demonstração. Os dados introduzidos não são enviados nem
            guardados.
          </p>

          <div className="mt-8 rounded-2xl border border-line border-t-4 border-t-vivid bg-white p-6 sm:p-7">
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-gold-soft px-3 py-2 text-xs font-bold text-gold-ink">
              <Info aria-hidden="true" className="h-3.5 w-3.5" />
              Formulário de demonstração — os dados não são guardados
            </div>
            <DemoForm className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="full-name">Nome completo</Label>
                <Input
                  id="full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Nome e apelido"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Endereço de email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nome@exemplo.co.mz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telemóvel</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+258 8XX XXX XXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank">Banco</Label>
                <Select id="bank" name="bank" defaultValue="">
                  <option value="" disabled>
                    Selecione o seu banco
                  </option>
                  {demoBanks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar palavra-passe</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repita a palavra-passe"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name="terms"
                  className="mt-0.5 h-4 w-4 rounded border-line accent-vivid"
                />
                Li e aceito as condições de utilização da plataforma.
              </label>

              <Button type="submit" className="w-full">
                Criar conta
              </Button>
            </DemoForm>

            <p className="mt-6 text-center text-sm text-muted">
              Já tem conta?{" "}
              <Link href="/entrar" className="font-medium text-vivid hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
