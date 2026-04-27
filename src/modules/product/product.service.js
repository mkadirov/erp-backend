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

export const updateProductService = async (id, companyId, data) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      companyId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (data.categoryId !== undefined) {
    const category = await prisma.category.findFirst({
      where: {
        id: Number(data.categoryId),
        companyId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.unit !== undefined) updateData.unit = data.unit;
  if (data.categoryId !== undefined) updateData.categoryId = Number(data.categoryId);

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }

  return await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
    },
  });
};

export const deleteProductService = async (id, companyId) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      companyId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      productId: id,
      companyId,
    },
  });

  if (transaction) {
    throw new Error("Cannot delete product with related transactions");
  }

  return await prisma.product.delete({
    where: { id },
  });
};