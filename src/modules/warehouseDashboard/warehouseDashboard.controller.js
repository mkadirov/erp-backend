import * as warehouseDashboardService from "./warehouseDashboard.service.js";

export async function getWarehouseDashboard(req, res) {
  try {
    const dashboard = await warehouseDashboardService.getWarehouseDashboard({
      user: req.user,
    });

    return res.status(200).json({
      message: "WAREHOUSE_DASHBOARD_FETCHED",
      data: dashboard,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}