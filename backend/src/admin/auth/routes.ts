import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "./controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

/** 管理端登录限流：15 分钟 20 次/IP */
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMIT", message: "请求过于频繁，请稍后再试" },
  },
});

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/login",
  loginRateLimit,
  asyncHandler(authController.login),
);
adminAuthRouter.get(
  "/me",
  adminAuthMiddleware,
  asyncHandler(authController.me),
);
