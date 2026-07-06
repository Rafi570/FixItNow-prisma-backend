import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.updateUserStatus(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllCategories();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.createCategory(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.getUserById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});
export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllCategories,
    createCategory,
    getUserById
};