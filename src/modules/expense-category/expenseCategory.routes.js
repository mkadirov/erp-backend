import express from "express";
import {
  createExpenseCategory,
  getExpenseCategories,
} from "./expenseCategory.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpenseCategory);
router.get("/", getExpenseCategories);

export default router;