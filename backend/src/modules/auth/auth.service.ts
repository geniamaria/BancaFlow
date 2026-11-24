import { randomUUID } from "node:crypto";
import { Prisma, UserRole, type User } from "@prisma/client";
import { config } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";
import { signAccessToken } from "../../utils/jwt";
import { hashPassword, verifyPasswordOrDummy } from "../../utils/password";
import { toSafeUser } from "../users/user.service";
import type { SafeUser } from "../users/user.types";
import type { LoginInput, RegisterInput } from "./auth.validation";

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  expiresAt: string;
}

async function createSession(user: User): Promise<AuthResult> {
  const sessionId = randomUUID();
  const signed = signAccessToken({
    sub: user.id,
    sid: sessionId,
    role: user.role,
    bankId: user.bankId,
    branchId: user.branchId,
  });

  await prisma.authSession.create({
    data: {
      id: sessionId,
      userId: user.id,
      expiresAt: signed.expiresAt,
    },
  });

  return {
    user: toSafeUser(user),
    accessToken: signed.token,
    tokenType: "Bearer",
    expiresIn: config.jwtExpiresIn,
    expiresAt: signed.expiresAt.toISOString(),
  };
}

export async function register(data: RegisterInput): Promise<AuthResult> {
  const email = data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new HttpError(409, "Já existe uma conta com este email.");
  }

  const passwordHash = await hashPassword(data.password);

  try {
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email,
        phone: data.phone,
        passwordHash,
        // Papel fixo no servidor: o cliente nunca escolhe o papel.
        role: UserRole.CUSTOMER,
      },
    });

    return createSession(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(409, "Já existe uma conta com este email.");
    }
    throw error;
  }
}

export async function login(data: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const passwordMatches = await verifyPasswordOrDummy(data.password, user?.passwordHash ?? null);

  // Uma única mensagem para email inexistente, palavra-passe errada ou conta inactiva.
  if (!user || !user.isActive || !passwordMatches) {
    throw new HttpError(401, "Credenciais inválidas.");
  }

  return createSession(user);
}

export async function getCurrentUser(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.isActive) {
    throw new HttpError(401, "Sessão inválida ou expirada.");
  }

  return toSafeUser(user);
}

export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.authSession.updateMany({
    where: { id: sessionId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
