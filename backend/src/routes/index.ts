import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { usersRouter } from "../modules/users/users.routes";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.get("/", (_request, response) => {
  response.status(200).json({
    name: "BancaFlow API",
    version: "v1",
    endpoints: ["/api/v1/health", "/api/v1/auth", "/api/v1/users"],
  });
});

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
