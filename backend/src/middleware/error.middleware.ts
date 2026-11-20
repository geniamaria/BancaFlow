import type { NextFunction, Request, Response } from "express";

interface HttpError extends Error {
  status?: number;
}

export function notFoundMiddleware(_request: Request, response: Response): void {
  response.status(404).json({ error: "Recurso não encontrado" });
}

export function errorMiddleware(
  error: HttpError,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  const status = error.status ?? 500;

  if (status >= 500) {
    console.error("[bancaflow-api]", error);
  }

  response.status(status).json({
    error: status >= 500 ? "Erro interno do servidor" : error.message,
  });
}
