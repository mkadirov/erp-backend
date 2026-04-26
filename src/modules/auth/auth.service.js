// src/modules/auth/auth.service.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";

// ================= REGISTER =================

export const registerService = async ({
  companyName,
  name,
  email,
  password,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const company = await prisma.company.create({
    data: {
      name: companyName,
      users: {
        create: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
        },
      },
    },
    include: {
      users: true,
    },
  });

  return {
    companyId: company.id,
    companyName: company.name,
    user: company.users[0],
  };
};

// ================= LOGIN =================

export const loginService = async ({ email, password }) => {
  // 🔥 SUPER ADMIN LOGIN (.env orqali)
  if (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      {
        userId: 0,
        companyId: null,
        role: "SUPER_ADMIN",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: 0,
        name: "Super Admin",
        email,
        role: "SUPER_ADMIN",
        companyId: null,
        companyName: null,
      },
    };
  }

  // 🔹 NORMAL USER LOGIN
  const user = await prisma.user.findFirst({
    where: { email },
    include: {
      company: true,
    },
  });

  if (!user) {
    throw new Error("Email yoki parol noto‘g‘ri");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email yoki parol noto‘g‘ri");
  }

  // 🔥 User active check
  if (!user.isActive) {
    throw new Error("User access disabled");
  }

  // 🔥 Company active check
  if (!user.company.isActive) {
    throw new Error("Company access disabled");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: user.company.name,
    },
  };
};