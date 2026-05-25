import { Router } from "express";
import * as usersController from "./controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth.js";
import { requirePermission } from "../middleware/require-permission.js";
import { AdminPermissions } from "../permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const usersRouter = Router();

usersRouter.use(adminAuthMiddleware);

usersRouter.get(
  "/",
  requirePermission(AdminPermissions.userRead),
  asyncHandler(usersController.list),
);
usersRouter.get(
  "/:id",
  requirePermission(AdminPermissions.userRead),
  asyncHandler(usersController.detail),
);
usersRouter.patch(
  "/:id",
  requirePermission(AdminPermissions.userWrite),
  asyncHandler(usersController.patch),
);
usersRouter.get(
  "/:id/memories",
  requirePermission(AdminPermissions.userRead),
  asyncHandler(usersController.memories),
);
