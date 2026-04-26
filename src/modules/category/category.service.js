import prisma from "../../config/db.js";

export const createCategoryService = async (data, companyId) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      companyId,
    },
  });
};

export const getCategoriesService = async (companyId) => {
  return await prisma.category.findMany({
    where: { companyId },
    orderBy: { id: "desc" },
  });
};