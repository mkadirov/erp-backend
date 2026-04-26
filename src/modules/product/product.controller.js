import {
  createProductService,
  getProductsService,
} from "./product.service.js";

export const createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body, req.user.companyId);

    res.status(201).json({
      message: "PRODUCT_CREATED",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await getProductsService(req.user.companyId);

    res.json({
      message: "PRODUCTS_FETCHED",
      products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};