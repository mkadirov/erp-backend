import bcrypt from "bcrypt";
import prisma from "../../config/db.js";

const allowedRoles = ["MANAGER", "ACCOUNTANT", "WAREHOUSE"];

export const createCompanyUserService = async (data, companyId) => {
  if (!allowedRoles.includes(data.role)) {
    throw new Error("Invalid role");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      companyId,
    },
  });

  if (existingUser) {
    throw new Error("User already exists in this company");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      companyId: true,
      createdAt: true,
    },
  });
};

export const getCompanyUsersService = async (companyId) => {
  return await prisma.user.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const updateCompanyUserService = async (userId, companyId, data) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "ADMIN") {
    throw new Error("Company admin cannot be updated from this module");
  }

  if (data.role && !allowedRoles.includes(data.role)) {
    throw new Error("Invalid role");
  }

  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.role !== undefined) updateData.role = data.role;

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      companyId: true,
      updatedAt: true,
    },
  });
};

export const toggleCompanyUserStatusService = async (
  userId,
  companyId,
  isActive
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "ADMIN") {
    throw new Error("Company admin cannot be disabled from this module");
  }

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      companyId: true,
    },
  });
};