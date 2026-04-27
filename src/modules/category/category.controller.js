import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service.js";

export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService(req.body, req.user.companyId);

    res.status(201).json({
      message: "CATEGORY_CREATED",
      category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService(req.user.companyId);

    res.json({
      message: "CATEGORIES_FETCHED",
      categories,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await getCategoryByIdService(id, req.user.companyId);

    res.json({
      message: "CATEGORY_FETCHED",
      category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await updateCategoryService(
      id,
      req.user.companyId,
      req.body
    );

    res.json({
      message: "CATEGORY_UPDATED",
      category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await deleteCategoryService(id, req.user.companyId);

    res.json({
      message: "CATEGORY_DELETED",
      category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};