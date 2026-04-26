// src/modules/project-summary/projectSummary.service.js

import prisma from "../../config/db.js";

export const getProjectSummaryService = async (projectId, companyId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      companyId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const materialTransactions = await prisma.transaction.findMany({
    where: {
      companyId,
      projectId,
      type: "OUT",
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          unit: true,
        },
      },
    },
  });

  const materialMap = {};

  materialTransactions.forEach((item) => {
    const productId = item.productId;

    if (!materialMap[productId]) {
      materialMap[productId] = {
        productId,
        productName: item.product?.name || "Unknown",
        unit: item.product?.unit || "",
        quantity: 0,
        cost: 0,
      };
    }

    materialMap[productId].quantity += Number(item.quantity);
    materialMap[productId].cost += Number(item.quantity) * Number(item.price);
  });

  const materials = Object.values(materialMap);

  const materialCost = materials.reduce((sum, item) => {
    return sum + item.cost;
  }, 0);

  const expenseGroup = await prisma.expense.groupBy({
    by: ["categoryId"],
    where: {
      companyId,
      projectId,
    },
    _sum: {
      amount: true,
    },
  });

  const categoryIds = expenseGroup.map((item) => item.categoryId);

  const categories = await prisma.expenseCategory.findMany({
    where: {
      id: {
        in: categoryIds,
      },
      companyId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const categoryMap = Object.fromEntries(
    categories.map((category) => [category.id, category])
  );

  const expenses = expenseGroup.map((item) => {
    const category = categoryMap[item.categoryId];

    return {
      categoryId: item.categoryId,
      categoryName: category?.name || "Unknown",
      cost: Number(item._sum.amount || 0),
    };
  });

  const expenseCost = expenses.reduce((sum, item) => {
    return sum + item.cost;
  }, 0);

  return {
    projectId: project.id,
    projectName: project.name,
    materialCost,
    expenseCost,
    totalCost: materialCost + expenseCost,
    materials,
    expenses,
  };
};