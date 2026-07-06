import express from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/me", auth(), userController.getMyProfile);
export const userRoutes = router;