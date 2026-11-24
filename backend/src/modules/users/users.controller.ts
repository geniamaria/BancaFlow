import type { Request, Response } from "express";
import { HttpError } from "../../utils/http-error";
import { firstString } from "../../utils/read-string";
import { listUsers } from "./user.service";

export async function listUsersController(request: Request, response: Response): Promise<void> {
  if (!request.auth) {
    throw new HttpError(401, "Autenticação necessária.");
  }

  const users = await listUsers({
    requester: request.auth.user,
    bankId: firstString(request.query.bankId),
    branchId: firstString(request.query.branchId),
  });

  response.status(200).json({ data: users });
}
