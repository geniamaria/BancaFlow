import type { RequestHandler } from "express";
import type { UserRole } from "@prisma/client";
import { HttpError } from "../utils/http-error";

export function authorize(...allowedRoles: UserRole[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(new HttpError(401, "Autenticação necessária."));
      return;
    }

    if (!allowedRoles.includes(request.auth.user.role)) {
      next(new HttpError(403, "Sem permissão para esta operação."));
      return;
    }

    next();
  };
}
