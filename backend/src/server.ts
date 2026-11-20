import { createApp } from "./app";
import { config } from "./config/env";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`[bancaflow-api] a escutar em http://localhost:${config.port}`);
});

function shutdown(signal: string): void {
  console.log(`[bancaflow-api] a terminar (${signal})`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
