import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";

const getAllServices = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        categoryId: req.query.type as string,
        location: req.query.location as string,
        minRating: req.query.rating as string,
        searchTerm: req.query.searchTerm as string,
    };

    const result = await serviceService.getAllServices(filters);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Services retrieved successfully",
        data: result,
    });
});

export const serviceController = { getAllServices };