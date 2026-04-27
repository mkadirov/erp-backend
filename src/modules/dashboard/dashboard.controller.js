import * as dashboardService from "./dashboard.service.js";

export async function getDashboard(req, res) {
  try {
    const dashboard = await dashboardService.getDashboard({
      user: req.user,
    });

    return res.status(200).json({
      message: "DASHBOARD_FETCHED",
      data: dashboard,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}