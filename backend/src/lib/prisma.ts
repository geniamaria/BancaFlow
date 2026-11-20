import { PrismaClient } from "@prisma/client";
import { config } from "../config/env";

// Em desenvolvimento o watch do tsx recarrega o processo; reutilizar a instância
// evita esgotar as ligações ao PostgreSQL.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (config.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}
