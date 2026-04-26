// src/middlewares/companyAccess.middleware.js

import prisma from "../config/db.js";

export const companyAccessMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    const company = await prisma.company.findUnique({
      where: {
        id: req.user.companyId,
      },
      select: {
        isActive: true,
      },
    });

    if (!company || !company.isActive) {
      return res.status(403).json({
        message: "Company access disabled",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};