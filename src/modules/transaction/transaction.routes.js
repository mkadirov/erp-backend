import express from "express";
import {
  createTransaction,
  getTransactions,
  getStock,
} from "./transaction.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/stock", getStock);

export default router;