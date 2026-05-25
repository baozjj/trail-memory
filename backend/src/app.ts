import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { authRouter } from "./auth/routes.js";
import { ensureImprintTypesDir, IMPRINT_TYPES_DIR } from "./lib/imprint-types-dir.js";
import { ensureUploadDir, UPLOAD_DIR } from "./lib/upload-dir.js";
import { memoryRouter } from "./memory/routes.js";
import { uploadRouter } from "./upload/routes.js";
import { adminRouter } from "./admin/index.js";
import { imprintTypesPublicRouter } from "./imprint-types/public-routes.js";
import { loadEnv } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

/** 创建并配置 Express 应用实例 */
export function createApp() {
  const { corsOrigins, adminCorsOrigins } = loadEnv();
  const allowedOrigins = [...new Set([...corsOrigins, ...adminCorsOrigins])];
  ensureUploadDir();
  ensureImprintTypesDir();
  const app = express();

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: { code: "RATE_LIMIT", message: "请求过于频繁，请稍后再试" },
      },
    }),
  );

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use("/imprint-types", express.static(IMPRINT_TYPES_DIR));
  app.use("/api/auth", authRouter);
  app.use("/api/uploads", uploadRouter);
  app.use("/api/memories", memoryRouter);
  app.use("/api/imprint-types", imprintTypesPublicRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
