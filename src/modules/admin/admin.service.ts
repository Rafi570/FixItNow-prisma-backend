import { prisma } from "../../lib/prisma";
import { ICreateCategory, IUpdateUserStatus } from "./admin.interface";

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return users;
};

const updateUserStatus = async (id: string, payload: IUpdateUserStatus) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { status: payload.status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });

    return updatedUser;
};

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    return categories;
};

const createCategory = async (payload: ICreateCategory) => {
    const existing = await prisma.category.findUnique({
        where: { name: payload.name },
    });
    if (existing) throw new Error("Category already exists");

    const category = await prisma.category.create({
        data: payload,
    });
    return category;
};
const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) throw new Error("User not found");

    return user;
};


export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllCategories,
    createCategory,
    getUserById
};