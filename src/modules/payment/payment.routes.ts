import express from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/create", auth(UserRole.CUSTOMER), paymentController.createPayment);

// এই ৩টা SSLCommerz থেকে সরাসরি call হবে, তাই auth middleware নেই
router.post("/confirm", paymentController.confirmPayment);
router.get("/confirm", paymentController.confirmPayment);
router.post("/fail", paymentController.failPayment);
router.post("/cancel", paymentController.cancelPayment);

router.get("/", auth(UserRole.CUSTOMER), paymentController.getUserPayments);
router.get("/:id", auth(UserRole.CUSTOMER), paymentController.getPaymentById);

export const paymentRoutes = router;