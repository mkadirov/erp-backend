import * as service from "./expenseCategory.service.js";

export async function createExpenseCategory(req, res) {
  try {
    const data = await service.createExpenseCategory({
      body: req.body,
      user: req.user,
    });

    res.status(201).json({
      message: "EXPENSE_CATEGORY_CREATED",
      data,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "SERVER_ERROR",
    });
  }
}

export async function getExpenseCategories(req, res) {
  try {
    const data = await service.getExpenseCategories(req.user);

    res.json({
      message: "EXPENSE_CATEGORIES_FETCHED",
      data,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "SERVER_ERROR",
    });
  }
}

export async function updateExpenseCategory(req, res) {
  try {
    const data = await service.updateExpenseCategory({
      categoryId: req.params.id,
      body: req.body,
      user: req.user,
    });

    res.json({
      message: "EXPENSE_CATEGORY_UPDATED",
      data,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "SERVER_ERROR",
    });
  }
}

export async function deleteExpenseCategory(req, res) {
  try {
    const data = await service.deleteExpenseCategory({
      categoryId: req.params.id,
      user: req.user,
    });

    res.json({
      message: "EXPENSE_CATEGORY_DELETED",
      data,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "SERVER_ERROR",
    });
  }
}