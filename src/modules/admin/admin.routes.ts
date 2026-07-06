import express from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
// import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);
router.get("/users/:id", auth(UserRole.ADMIN), adminController.getUserById);
router.patch("/users/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);
router.get("/categories", auth(UserRole.ADMIN), adminController.getAllCategories);
router.post("/categories", auth(UserRole.ADMIN), adminController.createCategory);

export const adminRoutes = router;