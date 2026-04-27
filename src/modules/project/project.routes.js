import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectMaterials,
  updateProject,
  deleteProject,
} from "./project.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// 📌 READ ALL (ADMIN, MANAGER)
router.get(
  "/",
  requireRole("ADMIN", "MANAGER"),
  getProjects
);

// 📌 READ ONE (ADMIN, MANAGER)
router.get(
  "/:id",
  requireRole("ADMIN", "MANAGER"),
  getProjectById
);

// 📌 MATERIALS (ADMIN, MANAGER, ACCOUNTANT)
router.get(
  "/:id/materials",
  requireRole("ADMIN", "MANAGER", "ACCOUNTANT"),
  getProjectMaterials
);

// 📌 CREATE (ADMIN, MANAGER)
router.post(
  "/",
  requireRole("ADMIN", "MANAGER"),
  createProject
);

// 📌 UPDATE (ADMIN, MANAGER)
router.patch(
  "/:id",
  requireRole("ADMIN", "MANAGER"),
  updateProject
);

// 📌 DELETE (ONLY ADMIN)
router.delete(
  "/:id",
  requireRole("ADMIN"),
  deleteProject
);

export default router;