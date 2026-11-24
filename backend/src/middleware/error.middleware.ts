import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface HttpErrorLike extends Error {
  status?: number;
  details?: unknown;
}

export function notFoundMiddleware(_request: Request, response: Response): void {
  response.status(404).json({ error: "Recurso não encontrado" });
}

export function errorMiddleware(
  error: HttpErrorLike,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  let status = error.status ?? 500;
  let message = status >= 500 ? "Erro interno do servidor" : error.message;
  let details = error.details;

  if (error instanceof ZodError) {
    status = 400;
    message = "Dados inválidos.";
    details = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    status = 409;
    message = "Registo duplicado.";
    details = undefined;
  }

  // Nunca registar corpo do pedido, palavras-passe ou tokens.
  if (status >= 500) {
    console.error("[bancaflow-api]", error.message);
  }

  response.status(status).json({
    error: message,
    ...(details !== undefined ? { details } : {}),
  });
}
