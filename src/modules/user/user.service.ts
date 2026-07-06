import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { RegisterUserPayload } from "./user.interface";

const registerUser = async (payload: RegisterUserPayload) => {
  const { name, email, password } = payload;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};
const getUserProfile = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found!");
  }
  return user;
};

export const userService = { registerUser, getUserProfile };
