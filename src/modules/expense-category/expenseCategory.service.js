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

export async function updateExpenseCategory({ categoryId, body, user }) {
  const { name } = body;

  if (!name || name.trim() === "") {
    throw { status: 400, message: "CATEGORY_NAME_REQUIRED" };
  }

  const category = await prisma.expenseCategory.findFirst({
    where: {
      id: Number(categoryId),
      companyId: user.companyId,
    },
  });

  if (!category) {
    throw { status: 404, message: "EXPENSE_CATEGORY_NOT_FOUND" };
  }

  return prisma.expenseCategory.update({
    where: {
      id: Number(categoryId),
    },
    data: {
      name: name.trim(),
    },
  });
}

export async function deleteExpenseCategory({ categoryId, user }) {
  const category = await prisma.expenseCategory.findFirst({
    where: {
      id: Number(categoryId),
      companyId: user.companyId,
    },
  });

  if (!category) {
    throw { status: 404, message: "EXPENSE_CATEGORY_NOT_FOUND" };
  }

  const expense = await prisma.expense.findFirst({
    where: {
      categoryId: Number(categoryId),
      companyId: user.companyId,
    },
  });

  if (expense) {
    throw {
      status: 400,
      message: "CANNOT_DELETE_CATEGORY_WITH_EXPENSES",
    };
  }

  return prisma.expenseCategory.delete({
    where: {
      id: Number(categoryId),
    },
  });
}