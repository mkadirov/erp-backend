import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// 📌 READ (ADMIN, WAREHOUSE, MANAGER)
router.get(
  "/",
  requireRole("ADMIN", "WAREHOUSE", "MANAGER"),
  getProducts
);

// 📌 CREATE (ADMIN, WAREHOUSE)
router.post(
  "/",
  requireRole("ADMIN", "WAREHOUSE"),
  createProduct
);

// 📌 UPDATE (ADMIN, WAREHOUSE)
router.patch(
  "/:id",
  requireRole("ADMIN", "WAREHOUSE"),
  updateProduct
);

// 📌 DELETE (ADMIN, WAREHOUSE)
router.delete(
  "/:id",
  requireRole("ADMIN", "WAREHOUSE"),
  deleteProduct
);

export default router;