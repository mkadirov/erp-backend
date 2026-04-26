// src/modules/company/company.controller.js

import {
  createCompanyService,
  toggleCompanyStatusService,
  createCompanyAdminService,
  getCompaniesService,
} from "./company.service.js";

export const createCompany = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    const company = await createCompanyService({
      name,
      phone,
      address,
    });

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await getCompaniesService();
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

export const toggleCompanyStatus = async (req, res, next) => {
  try {
    const companyId = Number(req.params.id);
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    const company = await toggleCompanyStatusService(
      companyId,
      isActive
    );

    res.json({
      message: `Company ${isActive ? "enabled" : "disabled"} successfully`,
      company,
    });
  } catch (error) {
    next(error);
  }
};

export const createCompanyAdmin = async (req, res, next) => {
  try {
    const companyId = Number(req.params.id);
    const { name, email, password } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "Invalid company id" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    const admin = await createCompanyAdminService(companyId, {
      name,
      email,
      password,
    });

    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
};