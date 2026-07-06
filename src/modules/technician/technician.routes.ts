import express from "express";
import { technicianController } from "./technician.controller";

const router = express.Router();

router.get("/", technicianController.getAllTechnicians);
router.get("/:id", technicianController.getTechnicianById);

export const technicianRoutes = router;