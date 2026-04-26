import prisma from "../../config/db.js";

export async function createExpense({ body, user }) {
  const { projectId, amount, categoryId, description, date } = body;

  if (!amount || Number(amount) <= 0 || !categoryId) {
    throw { status: 400, message: "INVALID_EXPENSE_DATA" };
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

  return prisma.expense.create({
    data: {
      amount: Number(amount),
      description: description || null,
      date: date ? new Date(date) : new Date(),
      projectId: projectId ? Number(projectId) : null,
      categoryId: Number(categoryId),
      companyId: user.companyId,
      userId: user.userId,
    },
  });
}

export async function getExpenses(user) {
  return prisma.expense.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      project: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getExpensesByProject({ projectId, user }) {
  return prisma.expense.findMany({
    where: {
      projectId: Number(projectId),
      companyId: user.companyId,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}