import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";

const createBooking = async (customerId: string, payload: ICreateBooking) => {
    const { serviceId, scheduledAt, address, note } = payload;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error("Service not found");

    const booking = await prisma.booking.create({
        data: {
            customerId,
            serviceId,
            technicianId: service.technicianId,
            scheduledAt: new Date(scheduledAt),
            address,
            note,
            price: service.price,
        },
        include: {
            service: true,
            technician: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
    });

    return booking;
};

const getUserBookings = async (userId: string, role: UserRole) => {
    // Customer sees their own bookings; Technician sees bookings assigned to them
    const whereConditions =
        role === UserRole.TECHNICIAN
            ? { technician: { userId } }
            : { customerId: userId };

    const bookings = await prisma.booking.findMany({
        where: whereConditions,
        include: {
            service: true,
            customer: { select: { id: true, name: true, email: true } },
            technician: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return bookings;
};

const getBookingById = async (id: string, userId: string, role: UserRole) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            service: true,
            customer: { select: { id: true, name: true, email: true } },
            technician: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
    });

    if (!booking) throw new Error("Booking not found");

    // Access control: only the customer who booked, the assigned technician, or admin can view
    const isOwner = booking.customerId === userId;
    const isAssignedTechnician = booking.technician.userId === userId;
    const isAdmin = role === UserRole.ADMIN;

    if (!isOwner && !isAssignedTechnician && !isAdmin) {
        throw new Error("You are not authorized to view this booking");
    }

    return booking;
};

export const bookingService = { createBooking, getUserBookings, getBookingById };