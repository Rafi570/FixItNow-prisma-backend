import express from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), bookingController.createBooking);
router.get("/", auth(UserRole.CUSTOMER, UserRole.TECHNICIAN, UserRole.ADMIN), bookingController.getUserBookings);
router.get("/:id", auth(UserRole.CUSTOMER, UserRole.TECHNICIAN, UserRole.ADMIN), bookingController.getBookingById);

export const bookingRoutes = router;