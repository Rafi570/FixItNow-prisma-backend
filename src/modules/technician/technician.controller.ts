import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        location: req.query.location as string,
        minRating: req.query.rating as string,
        skill: req.query.skill as string,
        searchTerm: req.query.searchTerm as string,
    };

    const result = await technicianService.getAllTechnicians(filters);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technicians retrieved successfully",
        data: result,
    });
});

const getTechnicianById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await technicianService.getTechnicianById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician profile retrieved successfully",
        data: result,
    });
});

export const technicianController = { getAllTechnicians, getTechnicianById };