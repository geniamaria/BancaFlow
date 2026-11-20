import { Router } from "express";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.get("/", (_request, response) => {
  response.status(200).json({
    name: "BancaFlow API",
    version: "v1",
    endpoints: ["/api/v1/health"],
  });
});

apiRouter.use("/health", healthRouter);
