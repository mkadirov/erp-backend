import prisma from "../../config/db.js";

export const createCategoryService = async (data, companyId) => {
  if (!data.name) {
    throw new Error("Category name is required");
  }

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

export const getCategoryByIdService = async (id, companyId) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      companyId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategoryService = async (id, companyId, data) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      companyId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }

  return await prisma.category.update({
    where: { id },
    data: updateData,
  });
};

export const deleteCategoryService = async (id, companyId) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      companyId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // ❗ Agar bu category productlarda ishlatilgan bo‘lsa, o‘chirish mumkin emas
  const products = await prisma.product.findFirst({
    where: {
      categoryId: id,
      companyId,
    },
  });

  if (products) {
    throw new Error("Cannot delete category with related products");
  }

  return await prisma.category.delete({
    where: { id },
  });
};