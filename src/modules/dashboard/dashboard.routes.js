import express from "express";
import { getDashboard } from "./dashboard.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  requireRole("ADMIN", "MANAGER", "ACCOUNTANT"),
  getDashboard
);

export default router;