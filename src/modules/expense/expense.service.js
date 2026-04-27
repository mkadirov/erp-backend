import prisma from "../../config/db.js";
import { createAuditLog } from "../audit-log/auditLog.service.js";

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

  const expense = await prisma.expense.create({
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

  await createAuditLog({
    action: "CREATE_EXPENSE",
    entity: "EXPENSE",
    entityId: expense.id,
    user,
    metadata: {
      amount: expense.amount,
      projectId: expense.projectId,
      categoryId: expense.categoryId,
      description: expense.description,
      date: expense.date,
    },
  });

  return expense;
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

export async function updateExpense({ expenseId, body, user }) {
  const { projectId, amount, categoryId, description, date } = body;

  const expense = await prisma.expense.findFirst({
    where: {
      id: Number(expenseId),
      companyId: user.companyId,
    },
  });

  if (!expense) {
    throw { status: 404, message: "EXPENSE_NOT_FOUND" };
  }

  const updateData = {};

  if (amount !== undefined) {
    if (Number(amount) <= 0) {
      throw { status: 400, message: "INVALID_EXPENSE_AMOUNT" };
    }

    updateData.amount = Number(amount);
  }

  if (categoryId !== undefined) {
    const category = await prisma.expenseCategory.findFirst({
      where: {
        id: Number(categoryId),
        companyId: user.companyId,
      },
    });

    if (!category) {
      throw { status: 404, message: "EXPENSE_CATEGORY_NOT_FOUND" };
    }

    updateData.categoryId = Number(categoryId);
  }

  if (projectId !== undefined) {
    if (projectId === null || projectId === "") {
      updateData.projectId = null;
    } else {
      const project = await prisma.project.findFirst({
        where: {
          id: Number(projectId),
          companyId: user.companyId,
        },
      });

      if (!project) {
        throw { status: 404, message: "PROJECT_NOT_FOUND" };
      }

      updateData.projectId = Number(projectId);
    }
  }

  if (description !== undefined) {
    updateData.description = description || null;
  }

  if (date !== undefined) {
    updateData.date = new Date(date);
  }

  if (Object.keys(updateData).length === 0) {
    throw { status: 400, message: "NO_VALID_FIELDS_TO_UPDATE" };
  }

  const updatedExpense = await prisma.expense.update({
    where: {
      id: Number(expenseId),
    },
    data: updateData,
  });

  await createAuditLog({
    action: "UPDATE_EXPENSE",
    entity: "EXPENSE",
    entityId: updatedExpense.id,
    user,
    metadata: {
      before: expense,
      after: updatedExpense,
      updatedFields: updateData,
    },
  });

  return updatedExpense;
}

export async function deleteExpense({ expenseId, user }) {
  const expense = await prisma.expense.findFirst({
    where: {
      id: Number(expenseId),
      companyId: user.companyId,
    },
  });

  if (!expense) {
    throw { status: 404, message: "EXPENSE_NOT_FOUND" };
  }

  const deletedExpense = await prisma.expense.delete({
    where: {
      id: Number(expenseId),
    },
  });

  await createAuditLog({
    action: "DELETE_EXPENSE",
    entity: "EXPENSE",
    entityId: deletedExpense.id,
    user,
    metadata: {
      amount: expense.amount,
      projectId: expense.projectId,
      categoryId: expense.categoryId,
      description: expense.description,
      date: expense.date,
    },
  });

  return deletedExpense;
}