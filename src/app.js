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
import companyUserRoutes from "./modules/company-user/companyUser.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import auditLogRoutes from "./modules/audit-log/auditLog.routes.js";
import warehouseDashboardRoutes from "./modules/warehouseDashboard/warehouseDashboard.routes.js";

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
app.use("/api/company-users", companyUserRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/warehouse-dashboard", warehouseDashboardRoutes);

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
