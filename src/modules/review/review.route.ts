import express from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), reviewController.createReview);
router.get("/my-reviews", auth(UserRole.CUSTOMER), reviewController.getMyReviews);
router.get("/technician/:technicianId", reviewController.getTechnicianReviews); // public

export const reviewRoutes = router;