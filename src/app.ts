import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from 'express';
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { technicianRoutes } from "./modules/technician/technician.routes";
import { serviceRoutes } from "./modules/service/service.routes";
import { categoryRoutes } from "./modules/category/category.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { technicianSelfRoutes } from "./modules/technician/technicianSelf.routes";
import { paymentRoutes } from "./modules/payment/payment.routes";
import { reviewRoutes } from "./modules/review/review.route";
import notFound from "./middlewares/notFound";
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
app.use("/api/technician", technicianSelfRoutes);    
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use(notFound);    



export default app;