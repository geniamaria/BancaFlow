import path from "node:path";
import dotenv from "dotenv";

// O .env é opcional em desenvolvimento: existem valores por omissão seguros.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function readPort(value: string | undefined): number {
  const port = Number(value ?? 4000);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : 4000;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  databaseUrl?: string;
}

export const config: AppConfig = {
  port: readPort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  // A ligação só é necessária quando os módulos que usam o Prisma forem ativados.
  databaseUrl: process.env.DATABASE_URL,
};
