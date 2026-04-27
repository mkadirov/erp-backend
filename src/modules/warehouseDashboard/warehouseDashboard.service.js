import prisma from "../../config/db.js";

export async function getWarehouseDashboard({ user }) {
  const companyId = user.companyId;

  const products = await prisma.product.findMany({
    where: { companyId },
    include: {
      category: true,
      transactions: true,
    },
  });

  const categoriesCount = await prisma.category.count({
    where: { companyId },
  });

  let totalStockQuantity = 0;
  let totalStockValue = 0;

  const stockList = products.map((product) => {
    const inTransactions = product.transactions.filter((t) => t.type === "IN");
    const outTransactions = product.transactions.filter((t) => t.type === "OUT");

    const totalInQty = inTransactions.reduce(
      (sum, t) => sum + Number(t.quantity),
      0
    );

    const totalOutQty = outTransactions.reduce(
      (sum, t) => sum + Number(t.quantity),
      0
    );

    const currentStock = totalInQty - totalOutQty;

    const totalInValue = inTransactions.reduce(
      (sum, t) => sum + Number(t.quantity) * Number(t.price),
      0
    );

    const averageCost = totalInQty > 0 ? totalInValue / totalInQty : 0;

    const stockValue = currentStock * averageCost;

    totalStockQuantity += currentStock;
    totalStockValue += stockValue;

    return {
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      categoryName: product.category?.name || null,
      currentStock,
      averageCost,
      stockValue,
    };
  });

  const lowStockProducts = stockList.filter(
    (item) => item.currentStock > 0 && item.currentStock <= 5
  );

  const outOfStockProducts = stockList.filter(
    (item) => item.currentStock <= 0
  );

  const recentTransactions = await prisma.transaction.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          unit: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return {
    totalProducts: products.length,
    totalCategories: categoriesCount,
    totalStockQuantity,
    totalStockValue,
    lowStockProducts,
    outOfStockProducts,
    recentTransactions,
  };
}