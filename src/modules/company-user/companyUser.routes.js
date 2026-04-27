import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

import {
  createCompanyUser,
  getCompanyUsers,
  updateCompanyUser,
  toggleCompanyUserStatus,
} from "./companyUser.controller.js";

const router = express.Router();

router.get("/", authMiddleware, requireRole("ADMIN"), getCompanyUsers);

router.post("/", authMiddleware, requireRole("ADMIN"), createCompanyUser);

router.patch("/:id", authMiddleware, requireRole("ADMIN"), updateCompanyUser);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("ADMIN"),
  toggleCompanyUserStatus
);

export default router;