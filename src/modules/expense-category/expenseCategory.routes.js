import express from "express";
import {
  createExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "./expenseCategory.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// 📌 READ (ADMIN, ACCOUNTANT)
router.get(
  "/",
  requireRole("ADMIN", "ACCOUNTANT"),
  getExpenseCategories
);

// 📌 CREATE (ADMIN, ACCOUNTANT)
router.post(
  "/",
  requireRole("ADMIN", "ACCOUNTANT"),
  createExpenseCategory
);

// 📌 UPDATE (ONLY ADMIN)
router.patch(
  "/:id",
  requireRole("ADMIN"),
  updateExpenseCategory
);

// 📌 DELETE (ONLY ADMIN)
router.delete(
  "/:id",
  requireRole("ADMIN"),
  deleteExpenseCategory
);

export default router;