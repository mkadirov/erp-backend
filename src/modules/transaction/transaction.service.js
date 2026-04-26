import prisma from "../../config/db.js";

export async function createTransaction({ body, user }) {
  const { type, productId, quantity, price, projectId, note } = body;

  if (!["IN", "OUT"].includes(type)) {
    throw { status: 400, message: "INVALID_TRANSACTION_TYPE" };
  }

  if (!productId || !quantity || quantity <= 0) {
    throw { status: 400, message: "INVALID_TRANSACTION_DATA" };
  }

  const product = await prisma.product.findFirst({
    where: {
      id: Number(productId),
      companyId: user.companyId,
    },
  });

  if (!product) {
    throw { status: 404, message: "PRODUCT_NOT_FOUND" };
  }

  if (type === "OUT") {
    const currentStock = await calculateProductStock({
      productId: Number(productId),
      companyId: user.companyId,
    });

    if (currentStock < Number(quantity)) {
      throw { status: 400, message: "INSUFFICIENT_STOCK" };
    }
  }

  let transactionPrice = null;

if (type === "IN") {
  if (!price || Number(price) <= 0) {
    throw { status: 400, message: "PRICE_REQUIRED_FOR_IN" };
  }

  transactionPrice = Number(price);
}

if (type === "OUT") {
  transactionPrice = await calculateAverageCost({
    productId: Number(productId),
    companyId: user.companyId,
  });
}

  const transaction = await prisma.transaction.create({
    data: {
      type,
      productId: Number(productId),
      quantity: Number(quantity),
      price: transactionPrice,
      projectId: projectId ? Number(projectId) : null,
      note: note || null,
      companyId: user.companyId,
      userId: user.userId,
    },
  });

  return transaction;
}

export async function getTransactions(user) {
  return prisma.transaction.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      product: true,
      project: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getStock(user) {
  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      category: true,
      transactions: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return products.map((product) => {
    const stock = product.transactions.reduce((total, transaction) => {
      if (transaction.type === "IN") {
        return total + transaction.quantity;
      }

      if (transaction.type === "OUT") {
        return total - transaction.quantity;
      }

      return total;
    }, 0);

    return {
      productId: product.id,
      name: product.name,
      unit: product.unit,
      category: product.category,
      stock,
    };
  });
}

async function calculateProductStock({ productId, companyId }) {
  const transactions = await prisma.transaction.findMany({
    where: {
      productId,
      companyId,
    },
  });

  return transactions.reduce((total, transaction) => {
    if (transaction.type === "IN") return total + transaction.quantity;
    if (transaction.type === "OUT") return total - transaction.quantity;
    return total;
  }, 0);
}

async function calculateAverageCost({ productId, companyId }) {
  const inTransactions = await prisma.transaction.findMany({
    where: {
      productId,
      companyId,
      type: "IN",
    },
  });

  const totalQuantity = inTransactions.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const totalCost = inTransactions.reduce((sum, item) => {
    return sum + item.quantity * (item.price || 0);
  }, 0);

  if (totalQuantity === 0) {
    return 0;
  }

  return totalCost / totalQuantity;
}