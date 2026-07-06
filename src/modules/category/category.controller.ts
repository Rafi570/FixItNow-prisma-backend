import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";


const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});

export const categoryController = { getAllCategories };