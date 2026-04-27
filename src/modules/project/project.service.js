import prisma from "../../config/db.js";

export async function createProject({ body, user }) {
  const { name, location, status, startDate, endDate } = body;

  if (!name || name.trim() === "") {
    throw { status: 400, message: "PROJECT_NAME_REQUIRED" };
  }

  const allowedStatuses = ["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"];

  if (status && !allowedStatuses.includes(status)) {
    throw { status: 400, message: "INVALID_PROJECT_STATUS" };
  }

  return prisma.project.create({
    data: {
      name,
      location: location || null,
      status: status || "ACTIVE",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      companyId: user.companyId,
    },
  });
}

export async function getProjects(user) {
  return prisma.project.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProjectMaterials({ projectId, user }) {
  const project = await prisma.project.findFirst({
    where: {
      id: Number(projectId),
      companyId: user.companyId,
    },
  });

  if (!project) {
    throw { status: 404, message: "PROJECT_NOT_FOUND" };
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      companyId: user.companyId,
      projectId: Number(projectId),
      type: "OUT",
    },
    include: {
      product: true,
    },
  });

  const materialMap = new Map();

  for (const transaction of transactions) {
    const productId = transaction.productId;

    if (!materialMap.has(productId)) {
      materialMap.set(productId, {
        productId,
        productName: transaction.product.name,
        unit: transaction.product.unit,
        totalQuantity: 0,
        totalCost: 0,
      });
    }

    const item = materialMap.get(productId);

    const quantity = Number(transaction.quantity);
    const price = Number(transaction.price || 0);

    item.totalQuantity += quantity;
    item.totalCost += quantity * price;
  }

  const materials = Array.from(materialMap.values()).map((item) => {
    const averagePrice =
      item.totalQuantity > 0
        ? item.totalCost / item.totalQuantity
        : 0;

    return {
      ...item,
      averagePrice,
    };
  });

  return {
    projectId: project.id,
    projectName: project.name,
    materials,
  };
}

export async function getProjectById({ id, user }) {
  const project = await prisma.project.findFirst({
    where: {
      id: Number(id),
      companyId: user.companyId,
    },
    include: {
      transactions: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      expenses: true,
    },
  });

  if (!project) {
    throw { status: 404, message: "PROJECT_NOT_FOUND" };
  }

  return project;
}

export async function updateProject({ projectId, body, user }) {
  const { name, location, status, startDate, endDate } = body;

  const project = await prisma.project.findFirst({
    where: {
      id: Number(projectId),
      companyId: user.companyId,
    },
  });

  if (!project) {
    throw { status: 404, message: "PROJECT_NOT_FOUND" };
  }

  const allowedStatuses = ["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"];

  if (status && !allowedStatuses.includes(status)) {
    throw { status: 400, message: "INVALID_PROJECT_STATUS" };
  }

  const updateData = {};

  if (name !== undefined) {
    if (!name || name.trim() === "") {
      throw { status: 400, message: "PROJECT_NAME_REQUIRED" };
    }

    updateData.name = name.trim();
  }

  if (location !== undefined) {
    updateData.location = location || null;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  if (startDate !== undefined) {
    updateData.startDate = startDate ? new Date(startDate) : null;
  }

  if (endDate !== undefined) {
    updateData.endDate = endDate ? new Date(endDate) : null;
  }

  if (Object.keys(updateData).length === 0) {
    throw { status: 400, message: "NO_VALID_FIELDS_TO_UPDATE" };
  }

  return prisma.project.update({
    where: {
      id: Number(projectId),
    },
    data: updateData,
  });
}

export async function deleteProject({ projectId, user }) {
  const project = await prisma.project.findFirst({
    where: {
      id: Number(projectId),
      companyId: user.companyId,
    },
  });

  if (!project) {
    throw { status: 404, message: "PROJECT_NOT_FOUND" };
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      projectId: Number(projectId),
      companyId: user.companyId,
    },
  });

  if (transaction) {
    throw {
      status: 400,
      message: "CANNOT_DELETE_PROJECT_WITH_TRANSACTIONS",
    };
  }

  const expense = await prisma.expense.findFirst({
    where: {
      projectId: Number(projectId),
      companyId: user.companyId,
    },
  });

  if (expense) {
    throw {
      status: 400,
      message: "CANNOT_DELETE_PROJECT_WITH_EXPENSES",
    };
  }

  return prisma.project.delete({
    where: {
      id: Number(projectId),
    },
  });
}