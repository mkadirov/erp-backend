import {
  createProductService,
  getProductsService,
  updateProductService,
  deleteProductService,
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

export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await updateProductService(
      id,
      req.user.companyId,
      req.body
    );

    res.json({
      message: "PRODUCT_UPDATED",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await deleteProductService(id, req.user.companyId);

    res.json({
      message: "PRODUCT_DELETED",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};