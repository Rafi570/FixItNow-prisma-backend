import express from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.put("/profile", auth(UserRole.TECHNICIAN), technicianController.updateOwnProfile);
router.post("/services", auth(UserRole.TECHNICIAN), technicianController.createOwnService);
router.get("/services", auth(UserRole.TECHNICIAN), technicianController.getOwnServices);
router.get("/bookings", auth(UserRole.TECHNICIAN), technicianController.getOwnBookings);
router.patch("/bookings/:id", auth(UserRole.TECHNICIAN), technicianController.updateBookingStatus);

export const technicianSelfRoutes = router;
// adddajdhajkyaujkyda