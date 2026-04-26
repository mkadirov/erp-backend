import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

import {
  createCompany,
  toggleCompanyStatus,
  createCompanyAdmin,
  getCompanies,
} from "./company.controller.js";

const router = express.Router();

router.get("/", authMiddleware, requireRole("SUPER_ADMIN"), getCompanies);

router.post("/", authMiddleware, requireRole("SUPER_ADMIN"), createCompany);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  toggleCompanyStatus
);

router.post(
  "/:id/admins",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  createCompanyAdmin
);

export default router;