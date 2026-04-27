import * as projectService from "./project.service.js";

export async function createProject(req, res) {
  try {
    const project = await projectService.createProject({
      body: req.body,
      user: req.user,
    });

    return res.status(201).json({
      message: "PROJECT_CREATED",
      data: project,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getProjects(req, res) {
  try {
    const projects = await projectService.getProjects(req.user);

    return res.json({
      message: "PROJECTS_FETCHED",
      data: projects,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await projectService.getProjectById({
      id: req.params.id,
      user: req.user,
    });

    return res.json({
      message: "PROJECT_FETCHED",
      data: project,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getProjectMaterials(req, res) {
  try {
    const materials = await projectService.getProjectMaterials({
      projectId: req.params.id,
      user: req.user,
    });

    return res.json({
      message: "PROJECT_MATERIALS_FETCHED",
      data: materials,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function updateProject(req, res) {
  try {
    const project = await projectService.updateProject({
      projectId: req.params.id,
      body: req.body,
      user: req.user,
    });

    return res.json({
      message: "PROJECT_UPDATED",
      data: project,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function deleteProject(req, res) {
  try {
    const project = await projectService.deleteProject({
      projectId: req.params.id,
      user: req.user,
    });

    return res.json({
      message: "PROJECT_DELETED",
      data: project,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}