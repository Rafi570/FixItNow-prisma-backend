import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const result = await bookingService.createBooking(customerId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Booking created successfully",
        data: result,
    });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
    const { id: userId, role } = req.user!;
    const result = await bookingService.getUserBookings(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
    });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId, role } = req.user!;
    const result = await bookingService.getBookingById(id as string, userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking details retrieved successfully",
        data: result,
    });
});

export const bookingController = { createBooking, getUserBookings, getBookingById };