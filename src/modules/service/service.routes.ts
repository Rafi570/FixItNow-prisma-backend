import express from "express";
import { serviceController } from "./service.controller";

const router = express.Router();

router.get("/", serviceController.getAllServices);

export const serviceRoutes = router;