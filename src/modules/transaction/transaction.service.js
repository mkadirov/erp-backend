import prisma from "../../config/db.js";

export async function createTransaction({ body, user }) {
  const { type, productId, quantity, price, projectId, note } = body;

  if (!["IN", "OUT"].includes(type)) {
    throw { status: 400, message: "INVALID_TRANSACTION_TYPE" };
  }

  if (!productId || !quantity || Number(quantity) <= 0) {
    throw { status: 400, message: "INVALID_TRANSACTION_DATA" };
  }

  if (type === "OUT" && !projectId) {
    throw { status: 400, message: "PROJECT_REQUIRED_FOR_OUT" };
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

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: Number(projectId),
        companyId: user.companyId,
      },
    });

    if (!project) {
      throw { status: 404, message: "PROJECT_NOT_FOUND" };
    }
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

  return prisma.transaction.create({
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
        return total + Number(transaction.quantity);
      }

      if (transaction.type === "OUT") {
        return total - Number(transaction.quantity);
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

export async function getTransactionById({ transactionId, user }) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: Number(transactionId),
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
  });

  if (!transaction) {
    throw { status: 404, message: "TRANSACTION_NOT_FOUND" };
  }

  return transaction;
}

export async function getTransactionsByProduct({ productId, user }) {
  const product = await prisma.product.findFirst({
    where: {
      id: Number(productId),
      companyId: user.companyId,
    },
  });

  if (!product) {
    throw { status: 404, message: "PRODUCT_NOT_FOUND" };
  }

  return prisma.transaction.findMany({
    where: {
      productId: Number(productId),
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

export async function getTransactionsByProject({ projectId, user }) {
  const project = await prisma.project.findFirst({
    where: {
      id: Number(projectId),
      companyId: user.companyId,
    },
  });

  if (!project) {
    throw { status: 404, message: "PROJECT_NOT_FOUND" };
  }

  return prisma.transaction.findMany({
    where: {
      projectId: Number(projectId),
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

export async function updateTransactionNote({ transactionId, body, user }) {
  const { note } = body;

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: Number(transactionId),
      companyId: user.companyId,
    },
  });

  if (!transaction) {
    throw { status: 404, message: "TRANSACTION_NOT_FOUND" };
  }

  return prisma.transaction.update({
    where: {
      id: Number(transactionId),
    },
    data: {
      note: note || null,
    },
  });
}

export async function deleteTransaction({ transactionId, user }) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: Number(transactionId),
      companyId: user.companyId,
    },
  });

  if (!transaction) {
    throw { status: 404, message: "TRANSACTION_NOT_FOUND" };
  }

  if (transaction.type === "IN") {
    const currentStock = await calculateProductStock({
      productId: transaction.productId,
      companyId: user.companyId,
    });

    const stockAfterDelete =
      currentStock - Number(transaction.quantity);

    if (stockAfterDelete < 0) {
      throw {
        status: 400,
        message: "CANNOT_DELETE_IN_TRANSACTION_STOCK_WOULD_BE_NEGATIVE",
      };
    }
  }

  return prisma.transaction.delete({
    where: {
      id: Number(transactionId),
    },
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
    if (transaction.type === "IN") {
      return total + Number(transaction.quantity);
    }

    if (transaction.type === "OUT") {
      return total - Number(transaction.quantity);
    }

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
    return sum + Number(item.quantity);
  }, 0);

  const totalCost = inTransactions.reduce((sum, item) => {
    return sum + Number(item.quantity) * Number(item.price || 0);
  }, 0);

  if (totalQuantity === 0) {
    return 0;
  }

  return totalCost / totalQuantity;
}