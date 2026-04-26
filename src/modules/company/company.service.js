import prisma from "../../config/db.js";
import bcrypt from "bcrypt";

export const createCompanyService = async (data) => {
  return await prisma.company.create({
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
    },
  });
};

export const getCompaniesService = async () => {
  return await prisma.company.findMany({
    orderBy: {
      id: "desc",
    },
  });
};

export const toggleCompanyStatusService = async (companyId, isActive) => {
  return await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      isActive,
    },
  });
};
export const createCompanyAdminService = async (companyId, data) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    const error = new Error("Company not found");
    error.statusCode = 404;
    throw error;
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      companyId,
    },
  });

  if (existingUser) {
    const error = new Error("User already exists in this company");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "ADMIN",
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