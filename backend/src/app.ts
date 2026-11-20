import cors from "cors";
import express, { type Express } from "express";
import { config } from "./config/env";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import { apiRouter } from "./routes";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_request, response) => {
    response.status(200).json({
      name: "BancaFlow API",
      message: "Serviço ativo. Consulte /api/v1 para os endpoints disponíveis.",
    });
  });

  app.use("/api/v1", apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
