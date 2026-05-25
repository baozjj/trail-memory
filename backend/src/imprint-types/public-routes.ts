import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { listEnabledPublicTypes } from "./service.js";

export const imprintTypesPublicRouter = Router();

/** C 端公开：启用中的印记类型 */
imprintTypesPublicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await listEnabledPublicTypes();
    res.json({ success: true, data: { items } });
  }),
);
