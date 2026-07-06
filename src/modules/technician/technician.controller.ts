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
const updateOwnProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await technicianService.updateOwnProfile(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician profile updated successfully",
        data: result,
    });
});

const createOwnService = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await technicianService.createOwnService(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Service created successfully",
        data: result,
    });
});

const getOwnServices = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await technicianService.getOwnServices(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Your services retrieved successfully",
        data: result,
    });
});
const getOwnBookings = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await technicianService.getOwnBookings(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Your bookings retrieved successfully",
        data: result,
    });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await technicianService.updateBookingStatus(userId, id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking status updated successfully",
        data: result,
    });
});

export const technicianController = { getAllTechnicians, getTechnicianById ,getOwnServices,createOwnService,updateOwnProfile,getOwnBookings,updateBookingStatus};