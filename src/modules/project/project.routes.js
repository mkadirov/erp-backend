import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectMaterials,
} from "./project.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id/materials", getProjectMaterials);
router.get("/:id", getProjectById);

export default router;