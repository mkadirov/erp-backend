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
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
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
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getTransactionById(req, res) {
  try {
    const transaction = await transactionService.getTransactionById({
      transactionId: req.params.id,
      user: req.user,
    });

    return res.json({
      message: "TRANSACTION_FETCHED",
      data: transaction,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getTransactionsByProduct(req, res) {
  try {
    const transactions = await transactionService.getTransactionsByProduct({
      productId: req.params.productId,
      user: req.user,
    });

    return res.json({
      message: "PRODUCT_TRANSACTIONS_FETCHED",
      data: transactions,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function getTransactionsByProject(req, res) {
  try {
    const transactions = await transactionService.getTransactionsByProject({
      projectId: req.params.projectId,
      user: req.user,
    });

    return res.json({
      message: "PROJECT_TRANSACTIONS_FETCHED",
      data: transactions,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function updateTransactionNote(req, res) {
  try {
    const transaction = await transactionService.updateTransactionNote({
      transactionId: req.params.id,
      body: req.body,
      user: req.user,
    });

    return res.json({
      message: "TRANSACTION_NOTE_UPDATED",
      data: transaction,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const transaction = await transactionService.deleteTransaction({
      transactionId: req.params.id,
      user: req.user,
    });

    return res.json({
      message: "TRANSACTION_DELETED",
      data: transaction,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "SERVER_ERROR",
    });
  }
}