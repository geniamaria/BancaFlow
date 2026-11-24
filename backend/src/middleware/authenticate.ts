import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { toSafeUser } from "../modules/users/user.service";
import { HttpError } from "../utils/http-error";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate: RequestHandler = async (request, _response, next) => {
  try {
    const authorization = request.header("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      throw new HttpError(401, "Autenticação necessária.");
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      throw new HttpError(401, "Autenticação necessária.");
    }

    const payload = verifyAccessToken(token);
    const session = await prisma.authSession.findUnique({
      where: { id: payload.sid },
      include: { user: true },
    });

    if (
      !session ||
      session.userId !== payload.sub ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      !session.user.isActive
    ) {
      throw new HttpError(401, "Sessão inválida ou expirada.");
    }

    request.auth = {
      user: toSafeUser(session.user),
      sessionId: session.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};
