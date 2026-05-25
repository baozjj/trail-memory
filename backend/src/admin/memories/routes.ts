import { Router } from "express";
import * as memoriesController from "./controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth.js";
import { requirePermission } from "../middleware/require-permission.js";
import { AdminPermissions } from "../permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const memoriesRouter = Router();

memoriesRouter.use(adminAuthMiddleware);

memoriesRouter.get(
  "/",
  requirePermission(AdminPermissions.memoryRead),
  asyncHandler(memoriesController.list),
);
memoriesRouter.get(
  "/:id",
  requirePermission(AdminPermissions.memoryRead),
  asyncHandler(memoriesController.detail),
);
memoriesRouter.patch(
  "/:id/exhibit",
  requirePermission(AdminPermissions.memoryWrite),
  asyncHandler(memoriesController.unpublish),
);
memoriesRouter.delete(
  "/:id",
  requirePermission(AdminPermissions.memoryWrite),
  asyncHandler(memoriesController.remove),
);
