import { Router } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../../config/env";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/async-handler";
import {
  loginController,
  logoutController,
  meController,
  registerController,
} from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  limit: config.rateLimitMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Demasiados pedidos. Tente novamente mais tarde." },
});

authRouter.use(authLimiter);

authRouter.post("/register", validate(registerSchema), asyncHandler(registerController));
authRouter.post("/login", validate(loginSchema), asyncHandler(loginController));
authRouter.get("/me", authenticate, asyncHandler(meController));
authRouter.post("/logout", authenticate, asyncHandler(logoutController));
