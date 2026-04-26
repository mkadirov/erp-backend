import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SUPER_ADMIN DB ichida bo‘lmagani uchun alohida o‘tkazamiz
    if (decoded.role === "SUPER_ADMIN") {
      req.user = {
        userId: 0,
        companyId: null,
        role: "SUPER_ADMIN",
      };

      return next();
    }

    // Oddiy userlarni DB orqali tekshiramiz
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        companyId: true,
        role: true,
        isActive: true,
        company: {
          select: {
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(403).json({
        message: "User access disabled",
      });
    }

    if (!user.company?.isActive) {
      return res.status(403).json({
        message: "Company access disabled",
      });
    }

    req.user = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};