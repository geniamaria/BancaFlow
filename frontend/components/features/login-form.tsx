"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch, storeAuth, type AuthResponse } from "@/lib/api";
import { canAccessAdmin } from "@/lib/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      storeAuth(response);

      if (canAccessAdmin(response.user.role)) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível iniciar sessão.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line border-t-4 border-t-vivid bg-white p-6 sm:p-7">
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Endereço de email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nome@exemplo.co.mz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          <span className="text-xs text-muted">Recuperação de acesso em breve</span>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "A entrar..." : "Entrar"}
          {!loading && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-muted">Ainda não tem conta?</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href="/registo">Criar uma conta</Link>
      </Button>
    </div>
  );
}
