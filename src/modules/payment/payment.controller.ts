import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import config from "../../config";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const result = await paymentService.createPayment(customerId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment session created successfully",
        data: result,
    });
});

// SSLCommerz IPN/success callback (server-to-server অথবা browser redirect)
const confirmPayment = catchAsync(async (req: Request, res: Response) => {
    const tran_id = (req.query.tran_id as string) || req.body.tran_id;

    await paymentService.confirmPayment(tran_id);

    // ব্রাউজার redirect হলে frontend-এ পাঠিয়ে দাও
    return res.redirect(`${config.frontend_url}/payment/success?tran_id=${tran_id}`);
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
    const tran_id = (req.query.tran_id as string) || req.body.tran_id;
    await paymentService.failPayment(tran_id);
    return res.redirect(`${config.frontend_url}/payment/fail?tran_id=${tran_id}`);
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const tran_id = (req.query.tran_id as string) || req.body.tran_id;
    await paymentService.failPayment(tran_id);
    return res.redirect(`${config.frontend_url}/payment/cancel?tran_id=${tran_id}`);
});

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const result = await paymentService.getUserPayments(customerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments retrieved successfully",
        data: result,
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const { id } = req.params;
    const result = await paymentService.getPaymentById(id as string, customerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment details retrieved successfully",
        data: result,
    });
});

export const paymentController = {
    createPayment,
    confirmPayment,
    failPayment,
    cancelPayment,
    getUserPayments,
    getPaymentById,
};