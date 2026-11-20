import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { AuthPanel } from "@/components/features/auth-panel";
import { DemoForm } from "@/components/features/demo-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <AuthPanel />

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-vivid">
              BancaFlow
            </p>
            <h1 className="mt-2 text-2xl font-bold text-deep">
              Menos filas. Mais tempo.
            </h1>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-deep">
            Entrar na sua conta
          </h2>
          <p className="mt-2 text-sm text-muted">
            Estrutura visual do formulário. Nenhuma autenticação está activa nesta
            etapa.
          </p>

          <div className="mt-8 rounded-2xl border border-line border-t-4 border-t-vivid bg-white p-6 sm:p-7">
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-gold-soft px-3 py-2 text-xs font-bold text-gold-ink">
              <Info aria-hidden="true" className="h-3.5 w-3.5" />
              Formulário de demonstração — sem autenticação real
            </div>
            <DemoForm className="space-y-5">
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
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="A sua palavra-passe"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-line accent-vivid"
                  />
                  Manter sessão iniciada
                </label>
                <span className="text-xs text-muted">
                  Recuperação de acesso em breve
                </span>
              </div>

              <Button type="submit" className="w-full">
                Entrar
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </DemoForm>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs text-muted">Ainda não tem conta?</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/registo">Criar uma conta</Link>
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Protótipo de interface · Dados pessoais fictícios
          </p>
        </div>
      </div>
    </div>
  );
}
