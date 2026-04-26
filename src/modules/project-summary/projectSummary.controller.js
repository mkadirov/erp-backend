// src/modules/project-summary/projectSummary.controller.js

import { getProjectSummaryService } from "./projectSummary.service.js";

export const getProjectSummary = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const companyId = req.user.companyId;

    if (!projectId) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const result = await getProjectSummaryService(projectId, companyId);

    res.json(result);
  } catch (error) {
    next(error);
  }
};