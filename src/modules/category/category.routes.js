import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

// 📌 READ (ADMIN, WAREHOUSE, MANAGER)
router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN", "WAREHOUSE", "MANAGER"),
  getCategories
);

// 📌 CREATE (ADMIN, WAREHOUSE)
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN", "WAREHOUSE"),
  createCategory
);

// 📌 UPDATE (ADMIN, WAREHOUSE)
router.patch(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "WAREHOUSE"),
  updateCategory
);

// 📌 DELETE (ADMIN, WAREHOUSE)
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "WAREHOUSE"),
  deleteCategory
);

export default router;