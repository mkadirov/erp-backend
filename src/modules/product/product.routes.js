import express from "express";
import { createProduct, getProducts } from "./product.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.get("/", authMiddleware, getProducts);

export default router;