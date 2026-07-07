import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const result = await reviewService.createReview(customerId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: result,
    });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const result = await reviewService.getMyReviews(customerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Your reviews retrieved successfully",
        data: result,
    });
});

const getTechnicianReviews = catchAsync(async (req: Request, res: Response) => {
    const { technicianId } = req.params;
    const result = await reviewService.getTechnicianReviews(technicianId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician reviews retrieved successfully",
        data: result,
    });
});

export const reviewController = { createReview, getMyReviews, getTechnicianReviews };