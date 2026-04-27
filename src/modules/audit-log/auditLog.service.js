import prisma from "../../config/db.js";

export async function createAuditLog({
  action,
  entity,
  entityId = null,
  user = null,
  companyId = null,
  metadata = null,
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId: user ? user.userId : null,
        companyId: companyId || user?.companyId || null,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    console.error("AUDIT_LOG_ERROR:", error.message);
    return null;
  }
}

export async function getAuditLogs({
  user,
  page = 1,
  limit = 20,
}) {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safePage = Number(page) > 0 ? Number(page) : 1;

  const skip = (safePage - 1) * safeLimit;

  const where = {};

  if (user.role !== "SUPER_ADMIN") {
    where.companyId = user.companyId;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: safeLimit,
    }),

    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}