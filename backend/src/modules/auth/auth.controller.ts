import type { Request, Response } from "express";
import { HttpError } from "../../utils/http-error";
import { getCurrentUser, login, register, revokeSession } from "./auth.service";
import type { LoginInput, RegisterInput } from "./auth.validation";

export async function registerController(request: Request, response: Response): Promise<void> {
  const result = await register(request.body as RegisterInput);
  response.status(201).json(result);
}

export async function loginController(request: Request, response: Response): Promise<void> {
  const result = await login(request.body as LoginInput);
  response.status(200).json(result);
}

export async function meController(request: Request, response: Response): Promise<void> {
  if (!request.auth) {
    throw new HttpError(401, "Autenticação necessária.");
  }

  const user = await getCurrentUser(request.auth.user.id);
  response.status(200).json({ user });
}

export async function logoutController(request: Request, response: Response): Promise<void> {
  if (!request.auth) {
    throw new HttpError(401, "Autenticação necessária.");
  }

  await revokeSession(request.auth.sessionId);
  response.status(200).json({ message: "Sessão encerrada." });
}
