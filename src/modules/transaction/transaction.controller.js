import * as transactionService from "./transaction.service.js";

export async function createTransaction(req, res) {
  try {
    const transaction = await transactionService.createTransaction({
      body: req.body,
      user: req.user,
    });

    return res.status(201).json({
      message: "TRANSACTION_CREATED",
      data: transaction,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getTransactions(req, res) {
  try {
    const transactions = await transactionService.getTransactions(req.user);

    return res.json({
      message: "TRANSACTIONS_FETCHED",
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER_ERROR",
    });
  }
}

export async function getStock(req, res) {
  try {
    const stock = await transactionService.getStock(req.user);

    return res.json({
      message: "STOCK_FETCHED",
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER_ERROR",
    });
  }
}