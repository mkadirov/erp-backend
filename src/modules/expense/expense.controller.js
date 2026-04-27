import * as expenseService from "./expense.service.js";

export async function createExpense(req, res) {
  try {
    const expense = await expenseService.createExpense({
      body: req.body,
      user: req.user,
    });

    return res.status(201).json({
      message: "EXPENSE_CREATED",
      data: expense,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getExpenses(req, res) {
  try {
    const expenses = await expenseService.getExpenses(req.user);

    return res.json({
      message: "EXPENSES_FETCHED",
      data: expenses,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getExpensesByProject(req, res) {
  try {
    const expenses = await expenseService.getExpensesByProject({
      projectId: req.params.projectId,
      user: req.user,
    });

    return res.json({
      message: "PROJECT_EXPENSES_FETCHED",
      data: expenses,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function updateExpense(req, res) {
  try {
    const expense = await expenseService.updateExpense({
      expenseId: req.params.id,
      body: req.body,
      user: req.user,
    });

    return res.json({
      message: "EXPENSE_UPDATED",
      data: expense,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function deleteExpense(req, res) {
  try {
    const expense = await expenseService.deleteExpense({
      expenseId: req.params.id,
      user: req.user,
    });

    return res.json({
      message: "EXPENSE_DELETED",
      data: expense,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}