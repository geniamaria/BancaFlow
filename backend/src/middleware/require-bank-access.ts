import { UserRole } from "@prisma/client";
import type { Request, RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/http-error";
import { firstString } from "../utils/read-string";

type Source = "params" | "query" | "body";

function readField(request: Request, source: Source, key: string): string | undefined {
  const container: unknown =
    source === "body" ? request.body : source === "query" ? request.query : request.params;

  if (container && typeof container === "object") {
    return firstString((container as Record<string, unknown>)[key]);
  }

  return undefined;
}

export function requireBankAccess(source: Source = "query"): RequestHandler {
  return async (request, _response, next) => {
    try {
      const auth = request.auth;
      if (!auth) {
        throw new HttpError(401, "Autenticação necessária.");
      }

      const { user } = auth;
      const bankId = readField(request, source, "bankId");
      const branchId =
        readField(request, source, "branchId") ??
        readField(request, "query", "branchId") ??
        readField(request, "params", "branchId");

      if (bankId) {
        if (user.role === UserRole.CUSTOMER) {
          // Clientes são globais: só acedem a bancos com que tenham relacionamento real.
          const [appointments, documents, tickets] = await Promise.all([
            prisma.appointment.count({ where: { customerId: user.id, bankId } }),
            prisma.customerDocument.count({ where: { customerId: user.id, bankId } }),
            prisma.queueTicket.count({
              where: { customerId: user.id, queue: { bankId } },
            }),
          ]);

          if (appointments + documents + tickets === 0) {
            throw new HttpError(403, "Sem acesso a este banco.");
          }
        } else if (user.role !== UserRole.SUPER_ADMIN && user.bankId !== bankId) {
          throw new HttpError(403, "Sem acesso a este banco.");
        }
      }

      const effectiveBankId = bankId ?? user.bankId;

      if (branchId && user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.CUSTOMER) {
        const branch = await prisma.branch.findFirst({
          where: {
            id: branchId,
            ...(effectiveBankId ? { bankId: effectiveBankId } : {}),
          },
        });

        if (!branch) {
          throw new HttpError(403, "Sem acesso a esta agência.");
        }

        if (
          (user.role === UserRole.BRANCH_MANAGER || user.role === UserRole.EMPLOYEE) &&
          user.branchId !== branch.id
        ) {
          throw new HttpError(403, "Sem acesso a esta agência.");
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
