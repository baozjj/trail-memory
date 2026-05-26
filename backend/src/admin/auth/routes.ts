import { Router } from "express";
import * as authController from "./controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", asyncHandler(authController.login));
adminAuthRouter.get(
  "/me",
  adminAuthMiddleware,
  asyncHandler(authController.me),
);
