import { Router } from "express";
import * as adminsController from "./controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth.js";
import { requirePermission } from "../middleware/require-permission.js";
import { AdminPermissions } from "../permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const adminsRouter = Router();

adminsRouter.use(adminAuthMiddleware);

adminsRouter.get(
  "/",
  requirePermission(AdminPermissions.adminUserRead),
  asyncHandler(adminsController.list),
);
adminsRouter.post(
  "/",
  requirePermission(AdminPermissions.adminUserWrite),
  asyncHandler(adminsController.create),
);
adminsRouter.patch(
  "/:id",
  requirePermission(AdminPermissions.adminUserWrite),
  asyncHandler(adminsController.update),
);
adminsRouter.post(
  "/:id/reset-password",
  requirePermission(AdminPermissions.adminUserWrite),
  asyncHandler(adminsController.resetPassword),
);
