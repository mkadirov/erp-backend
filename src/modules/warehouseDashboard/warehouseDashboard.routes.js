import express from "express";
import { getWarehouseDashboard } from "./warehouseDashboard.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  requireRole("ADMIN", "WAREHOUSE"),
  getWarehouseDashboard
);

export default router;