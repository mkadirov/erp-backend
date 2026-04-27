import express from "express";
import {
  createExpense,
  getExpenses,
  getExpensesByProject,
  updateExpense,
  deleteExpense,
} from "./expense.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// 📌 READ (ADMIN, ACCOUNTANT)
router.get(
  "/",
  requireRole("ADMIN", "ACCOUNTANT"),
  getExpenses
);

// 📌 READ by project (ADMIN, ACCOUNTANT)
router.get(
  "/project/:projectId",
  requireRole("ADMIN", "ACCOUNTANT"),
  getExpensesByProject
);

// 📌 CREATE (ADMIN, ACCOUNTANT)
router.post(
  "/",
  requireRole("ADMIN", "ACCOUNTANT"),
  createExpense
);

// 📌 UPDATE (ONLY ADMIN)
router.patch(
  "/:id",
  requireRole("ADMIN"),
  updateExpense
);

// 📌 DELETE (ONLY ADMIN)
router.delete(
  "/:id",
  requireRole("ADMIN"),
  deleteExpense
);

export default router;
