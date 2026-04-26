import prisma from "../../config/db.js";

export async function createExpenseCategory({ body, user }) {
  const { name } = body;

  if (!name || name.trim() === "") {
    throw { status: 400, message: "CATEGORY_NAME_REQUIRED" };
  }

  return prisma.expenseCategory.create({
    data: {
      name,
      companyId: user.companyId,
    },
  });
}

export async function getExpenseCategories(user) {
  return prisma.expenseCategory.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}