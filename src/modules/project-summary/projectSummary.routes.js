// src/modules/project-summary/projectSummary.routes.js

import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getProjectSummary } from "./projectSummary.controller.js";

const router = express.Router();

router.get("/:id/summary", authMiddleware, getProjectSummary);

export default router;