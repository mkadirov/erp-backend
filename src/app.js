import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import productRoutes from "./modules/product/product.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import transactionRoutes from "./modules/transaction/transaction.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import expenseRoutes from "./modules/expense/expense.routes.js";
import expenseCategoryRoutes from "./modules/expense-category/expenseCategory.routes.js";
import projectSummaryRoutes from "./modules/project-summary/projectSummary.routes.js";
import companyRoutes from "./modules/company/company.routes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/projects", projectSummaryRoutes);
app.use("/api/companies", companyRoutes);

app.get("/", (req, res) => {
  res.send("ERP Backend ishlayapti");
});

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    message: "AUTH_OK",
    user: req.user,
  });
});

export default app;
