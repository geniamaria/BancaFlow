import { UserRole, type User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";
import type { SafeUser } from "./user.types";

const STAFF_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.BANK_ADMIN,
  UserRole.BRANCH_MANAGER,
  UserRole.EMPLOYEE,
];

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    bankId: user.bankId,
    branchId: user.branchId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

interface ListUsersParams {
  requester: SafeUser;
  bankId?: string;
  branchId?: string;
}

export async function listUsers({
  requester,
  bankId,
  branchId,
}: ListUsersParams): Promise<SafeUser[]> {
  if (!STAFF_ROLES.includes(requester.role)) {
    throw new HttpError(403, "Sem permissão para listar utilizadores.");
  }

  // O filtro é sempre recalculado a partir da identidade autenticada.
  // O bankId enviado pelo cliente nunca é usado para alargar o acesso.
  const effectiveBankId =
    requester.role === UserRole.SUPER_ADMIN ? bankId : (requester.bankId ?? undefined);

  const effectiveBranchId =
    requester.role === UserRole.BRANCH_MANAGER || requester.role === UserRole.EMPLOYEE
      ? (requester.branchId ?? undefined)
      : branchId;

  return prisma.user.findMany({
    where: {
      ...(effectiveBankId ? { bankId: effectiveBankId } : {}),
      ...(effectiveBranchId ? { branchId: effectiveBranchId } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      bankId: true,
      branchId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
