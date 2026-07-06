import express from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.put("/profile", auth(UserRole.TECHNICIAN), technicianController.updateOwnProfile);
router.post("/services", auth(UserRole.TECHNICIAN), technicianController.createOwnService);
router.get("/services", auth(UserRole.TECHNICIAN), technicianController.getOwnServices);

export const technicianSelfRoutes = router;