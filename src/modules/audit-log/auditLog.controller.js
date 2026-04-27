import * as auditLogService from "./auditLog.service.js";

export async function getAuditLogs(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const result = await auditLogService.getAuditLogs({
      user: req.user,
      page,
      limit,
    });

    return res.status(200).json({
      message: "AUDIT_LOGS_FETCHED",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}