import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { requireBankAccess } from "../../middleware/require-bank-access";
import { asyncHandler } from "../../utils/async-handler";
import { listUsersController } from "./users.controller";

export const usersRouter = Router();

usersRouter.get(
  "/",
  authenticate,
  authorize(
    UserRole.SUPER_ADMIN,
    UserRole.BANK_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.EMPLOYEE,
  ),
  requireBankAccess("query"),
  asyncHandler(listUsersController),
);
