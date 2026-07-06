import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.registerUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    // auth মিডলওয়্যার থেকে আইডি পাচ্ছেন
    const { id } = req.user as { id: string };

    const result = await userService.getUserProfile(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile retrieved successfully",
        data: result,
    });
});

export const userController = { registerUser, getMyProfile };