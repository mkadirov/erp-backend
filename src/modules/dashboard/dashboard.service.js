import prisma from "../../config/db.js";

export async function getDashboard({ user }) {
  const companyId = user.companyId;

  const [
    totalProjects,
    activeProjects,
    completedProjects,
    transactions,
    expenses,
    products,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        companyId,
      },
    }),

    prisma.project.count({
      where: {
        companyId,
        status: "ACTIVE",
      },
    }),

    prisma.project.count({
      where: {
        companyId,
        status: "FINISHED",
      },
    }),

    prisma.transaction.findMany({
      where: {
        companyId,
      },
      select: {
        type: true,
        quantity: true,
        price: true,
      },
    }),

    prisma.expense.findMany({
      where: {
        companyId,
      },
      select: {
        amount: true,
      },
    }),

    prisma.product.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        name: true,
        unit: true
      },
    }),
  ]);

  const totalMaterialCost = transactions
    .filter((transaction) => transaction.type === "OUT")
    .reduce((sum, transaction) => {
      return sum + Number(transaction.quantity) * Number(transaction.price);
    }, 0);

  const totalExpenseCost = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  const totalCost = totalMaterialCost + totalExpenseCost;

  const stockByProduct = {};

  for (const transaction of transactions) {
    const productId = transaction.productId;

    if (!stockByProduct[productId]) {
      stockByProduct[productId] = 0;
    }

    if (transaction.type === "IN") {
      stockByProduct[productId] += Number(transaction.quantity);
    }

    if (transaction.type === "OUT") {
      stockByProduct[productId] -= Number(transaction.quantity);
    }
  }

  const lowStockProducts = products
  .map((product) => {
    const currentStock = stockByProduct[product.id] || 0;

    return {
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      currentStock,
    };
  })
  .filter((product) => {
    return product.currentStock <= 0;
  });

  return {
    totalProjects,
    activeProjects,
    completedProjects,

    totalMaterialCost,
    totalExpenseCost,
    totalCost,

    lowStockProducts,
  };
}