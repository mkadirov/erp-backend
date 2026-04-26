import express from "express";
import {
  createExpense,
  getExpenses,
  getExpensesByProject,
} from "./expense.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/project/:projectId", getExpensesByProject);

export default router;
