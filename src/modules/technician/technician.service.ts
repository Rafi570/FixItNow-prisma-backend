import { prisma } from "../../lib/prisma";
import { ICreateTechnicianService, ITechnicianFilters, IUpdateBookingStatus, IUpdateTechnicianProfile } from "./technician.interface";
import { BookingStatus, Prisma } from "../../../generated/prisma/client";

const getAllTechnicians = async (filters: ITechnicianFilters) => {
    const { location, minRating, skill, searchTerm } = filters;

    const andConditions: Prisma.TechnicianProfileWhereInput[] = [];

    if (location) {
        andConditions.push({
            location: { contains: location, mode: "insensitive" },
        });
    }

    if (minRating) {
        andConditions.push({
            ratingAvg: { gte: parseFloat(minRating) },
        });
    }

    if (skill) {
        andConditions.push({
            skills: { has: skill },
        });
    }

    if (searchTerm) {
        andConditions.push({
            user: {
                name: { contains: searchTerm, mode: "insensitive" },
            },
        });
    }

    const whereConditions: Prisma.TechnicianProfileWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const technicians = await prisma.technicianProfile.findMany({
        where: whereConditions,
        include: {
            user: {
                select: { id: true, name: true, email: true, status: true },
            },
            services: true,
        },
        orderBy: { ratingAvg: "desc" },
    });

    return technicians;
};

const getTechnicianById = async (id: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, email: true, status: true },
            },
            services: {
                include: { category: true },
            },
            // reviews: true  // 👉 Review model বানানোর পর এখানে যোগ করো
        },
    });

    return technician;
};
const updateOwnProfile = async (userId: string, payload: IUpdateTechnicianProfile) => {
    const profile = await prisma.technicianProfile.upsert({
        where: { userId },
        update: payload,
        create: {
            userId,
            bio: payload.bio,
            experience: payload.experience ?? 0,
            skills: payload.skills ?? [],
            location: payload.location,
            hourlyRate: payload.hourlyRate ?? 0,
            isAvailable: payload.isAvailable ?? true,
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });

    return profile;
};

const createOwnService = async (userId: string, payload: ICreateTechnicianService) => {
    // ইউজারের নিজের TechnicianProfile আছে কিনা চেক করো
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new Error("Please create your technician profile before adding a service");
    }

    // category আসলেই আছে কিনা চেক করো
    const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!category) {
        throw new Error("Invalid category selected");
    }

    const service = await prisma.service.create({
        data: {
            title: payload.title,
            description: payload.description,
            price: payload.price,
            durationMins: payload.durationMins,
            categoryId: payload.categoryId,
            technicianId: profile.id,   // 👈 এখানেই auto-connect হচ্ছে নিজের profile-এর সাথে
        },
        include: {
            category: true,
        },
    });

    return service;
};

const getOwnServices = async (userId: string) => {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Technician profile not found");

    const services = await prisma.service.findMany({
        where: { technicianId: profile.id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return services;
};
const getOwnBookings = async (userId: string) => {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Technician profile not found");

    const bookings = await prisma.booking.findMany({
        where: { technicianId: profile.id },
        include: {
            service: true,
            customer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return bookings;
};

const updateBookingStatus = async (
    userId: string,
    bookingId: string,
    payload: IUpdateBookingStatus
) => {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Technician profile not found");

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    // এটা যাচাই করা— অন্য technician-এর booking না ছুঁতে পারে
    if (booking.technicianId !== profile.id) {
        throw new Error("You are not authorized to update this booking");
    }

    const { status } = payload;

    // বৈধ status transition চেক
    const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
        REQUESTED: [BookingStatus.ACCEPTED, BookingStatus.DECLINED],
        ACCEPTED: [BookingStatus.IN_PROGRESS],
        DECLINED: [],
        PAID: [BookingStatus.IN_PROGRESS],
        IN_PROGRESS: [BookingStatus.COMPLETED],
        COMPLETED: [],
        CANCELLED: [],
    };

    if (!allowedTransitions[booking.status].includes(status)) {
        throw new Error(
            `Cannot change booking status from ${booking.status} to ${status}`
        );
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
            service: true,
            customer: { select: { id: true, name: true, email: true } },
        },
    });

    return updatedBooking;
};

export const technicianService = { getAllTechnicians, getTechnicianById,updateOwnProfile,createOwnService,getOwnServices,getOwnBookings,updateBookingStatus };