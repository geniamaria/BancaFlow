import type { Metadata } from "next";
import { AuthPanel } from "@/components/features/auth-panel";
import { LoginForm } from "@/components/features/login-form";

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
            Aceda à sua conta para gerir agências, atendimentos e serviços.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Acesso seguro à plataforma BancaFlow.
          </p>
        </div>
      </div>
    </div>
  );
}
