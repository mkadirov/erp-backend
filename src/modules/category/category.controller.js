import {
  createCategoryService,
  getCategoriesService,
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