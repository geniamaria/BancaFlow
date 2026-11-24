import path from "node:path";
import dotenv from "dotenv";

// Carrega .env sem sobrescrever variáveis já definidas pelo processo.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function readPort(value: string | undefined): number {
  const port = Number(value ?? 4000);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : 4000;
}

function readPositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? fallback);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET não configurado. Defina um segredo com pelo menos 16 caracteres no ficheiro .env.",
    );
  }

  return secret;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  databaseUrl?: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  rateLimitMax: number;
  rateLimitWindowMs: number;
}

export const config: AppConfig = {
  port: readPort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  // A ligação só é necessária quando os módulos que usam o Prisma forem ativados.
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: readJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  bcryptRounds: readPositiveInteger(process.env.BCRYPT_ROUNDS, 10),
  rateLimitMax: readPositiveInteger(process.env.RATE_LIMIT_MAX, 60),
  rateLimitWindowMs: readPositiveInteger(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
};
