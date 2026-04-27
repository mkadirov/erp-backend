import express from "express";
import {
  createTransaction,
  getTransactions,
  getStock,
  getTransactionById,
  getTransactionsByProduct,
  getTransactionsByProject,
  updateTransactionNote,
  deleteTransaction,
} from "./transaction.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// 📌 CREATE (ADMIN, WAREHOUSE)
router.post(
  "/",
  requireRole("ADMIN", "WAREHOUSE"),
  createTransaction
);

// 📌 ALL TRANSACTIONS (ADMIN, WAREHOUSE)
router.get(
  "/",
  requireRole("ADMIN", "WAREHOUSE"),
  getTransactions
);

// 📌 STOCK (ADMIN, WAREHOUSE, MANAGER)
router.get(
  "/stock",
  requireRole("ADMIN", "WAREHOUSE", "MANAGER"),
  getStock
);

// 📌 SINGLE TRANSACTION
router.get(
  "/:id",
  requireRole("ADMIN", "WAREHOUSE"),
  getTransactionById
);

// 📌 BY PRODUCT
router.get(
  "/product/:productId",
  requireRole("ADMIN", "WAREHOUSE"),
  getTransactionsByProduct
);

// 📌 BY PROJECT
router.get(
  "/project/:projectId",
  requireRole("ADMIN", "WAREHOUSE", "MANAGER"),
  getTransactionsByProject
);

// 📌 UPDATE NOTE ONLY
router.patch(
  "/:id/note",
  requireRole("ADMIN", "WAREHOUSE"),
  updateTransactionNote
);

// 📌 DELETE (ONLY ADMIN)
router.delete(
  "/:id",
  requireRole("ADMIN"),
  deleteTransaction
);

export default router;