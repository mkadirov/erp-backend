import prisma from "../../config/db.js";

export const createProductService = async (data, companyId) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      unit: data.unit,
      companyId,
      categoryId: data.categoryId,
    },
  });
};

export const getProductsService = async (companyId) => {
  return await prisma.product.findMany({
    where: { companyId },
    include: { category: true },
    orderBy: { id: "desc" },
  });
};