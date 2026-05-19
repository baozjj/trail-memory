import "dotenv/config";
import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

/** 启动 HTTP 服务 */
async function main(): Promise<void> {
  const { port } = loadEnv();
  const app = createApp();

  const server = app.listen(port, () => {
    console.log(`[server] listening on http://localhost:${port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
