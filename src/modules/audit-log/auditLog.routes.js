import express from "express";
import { getAuditLogs } from "./auditLog.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  requireRole("SUPER_ADMIN", "ADMIN"),
  getAuditLogs
);

export default router;