import {
  createCompanyUserService,
  getCompanyUsersService,
  updateCompanyUserService,
  toggleCompanyUserStatusService,
} from "./companyUser.service.js";

export const createCompanyUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const companyId = req.user.companyId;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "name, email, password and role are required",
      });
    }

    const user = await createCompanyUserService(
      { name, email, password, role },
      companyId
    );

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getCompanyUsers = async (req, res, next) => {
  try {
    const users = await getCompanyUsersService(req.user.companyId);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateCompanyUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const user = await updateCompanyUserService(
      userId,
      req.user.companyId,
      req.body
    );

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const toggleCompanyUserStatus = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { isActive } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    const user = await toggleCompanyUserStatusService(
      userId,
      req.user.companyId,
      isActive
    );

    res.json({
      message: `User ${isActive ? "enabled" : "disabled"} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};