import { Router } from "express";
import * as imprintTypesController from "./controller.js";
import { imprintCoverUploadMiddleware } from "./cover-multer.js";
import { adminAuthMiddleware } from "../middleware/admin-auth.js";
import { requirePermission } from "../middleware/require-permission.js";
import { AdminPermissions } from "../permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const adminImprintTypesRouter = Router();

adminImprintTypesRouter.use(adminAuthMiddleware);

adminImprintTypesRouter.get(
  "/",
  requirePermission(AdminPermissions.imprintTypeRead),
  asyncHandler(imprintTypesController.list),
);
adminImprintTypesRouter.post(
  "/",
  requirePermission(AdminPermissions.imprintTypeWrite),
  asyncHandler(imprintTypesController.create),
);
adminImprintTypesRouter.patch(
  "/:id",
  requirePermission(AdminPermissions.imprintTypeWrite),
  asyncHandler(imprintTypesController.patch),
);
adminImprintTypesRouter.post(
  "/process-cover",
  requirePermission(AdminPermissions.imprintTypeWrite),
  (req, res, next) => {
    imprintCoverUploadMiddleware(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      void imprintTypesController.processCover(req, res).catch(next);
    });
  },
);
adminImprintTypesRouter.post(
  "/confirm-cover",
  requirePermission(AdminPermissions.imprintTypeWrite),
  asyncHandler(imprintTypesController.confirmCover),
);
