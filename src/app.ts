import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from 'express';
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { technicianRoutes } from "./modules/technician/technician.routes";
import { serviceRoutes } from "./modules/service/service.routes";
import { categoryRoutes } from "./modules/category/category.routes";
const app : Application = express();
app.use(cors({
    origin : config.app_url,
    credentials : true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());


app.get("/",(req : Request, res : Response) => {
    res.send("Hello, World!");
});

app.use("/api/auth",authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/technicians", technicianRoutes);
export default app;