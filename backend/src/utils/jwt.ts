import { UserRole } from "@prisma/client";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { config } from "../config/env";
import { HttpError } from "./http-error";

export interface AccessTokenPayload {
  sub: string;
  sid: string;
  role: UserRole;
  bankId: string | null;
  branchId: string | null;
}

export interface SignedAccessToken {
  token: string;
  expiresAt: Date;
}

export function signAccessToken(payload: AccessTokenPayload): SignedAccessToken {
  const token = jwt.sign(
    {
      sub: payload.sub,
      sid: payload.sid,
      role: payload.role,
      bankId: payload.bankId,
      branchId: payload.branchId,
    },
    config.jwtSecret,
    {
      algorithm: "HS256",
      expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
    },
  );

  const decoded = jwt.decode(token) as JwtPayload | null;
  if (typeof decoded?.exp !== "number") {
    throw new Error("Não foi possível determinar a expiração do token.");
  }

  return { token, expiresAt: new Date(decoded.exp * 1000) };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.sid !== "string" ||
      typeof decoded.role !== "string" ||
      !Object.values(UserRole).includes(decoded.role as UserRole)
    ) {
      throw new Error("Payload inválido.");
    }

    return {
      sub: decoded.sub,
      sid: decoded.sid,
      role: decoded.role as UserRole,
      bankId: typeof decoded.bankId === "string" ? decoded.bankId : null,
      branchId: typeof decoded.branchId === "string" ? decoded.branchId : null,
    };
  } catch {
    throw new HttpError(401, "Token inválido ou expirado.");
  }
}
