import { Router } from "express";
import * as mediaController from "./controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth.js";
import { requirePermission } from "../middleware/require-permission.js";
import { AdminPermissions } from "../permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const mediaRouter = Router();

mediaRouter.use(adminAuthMiddleware);

mediaRouter.get(
  "/stats",
  requirePermission(AdminPermissions.mediaRead),
  asyncHandler(mediaController.stats),
);

mediaRouter.get(
  "/",
  requirePermission(AdminPermissions.mediaRead),
  asyncHandler(mediaController.list),
);

mediaRouter.get(
  "/:filename/references",
  requirePermission(AdminPermissions.mediaRead),
  asyncHandler(mediaController.references),
);
