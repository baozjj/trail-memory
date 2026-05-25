import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { adminAuthRouter } from "./auth/routes.js";
import { adminsRouter } from "./admins/routes.js";

/** 管理端 API 路由聚合 */
export const adminRouter = Router();

adminRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      data: { status: "ok", scope: "admin" },
    });
  }),
);

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/admins", adminsRouter);
