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
  } catch {
    res.status(500).json({
      message: "SERVER_ERROR",
    });
  }
}