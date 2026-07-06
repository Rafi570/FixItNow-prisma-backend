import { prisma } from "../../lib/prisma";
import { ICreateTechnicianService, ITechnicianFilters, IUpdateTechnicianProfile } from "./technician.interface";
import { Prisma } from "../../../generated/prisma/client";

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

export const technicianService = { getAllTechnicians, getTechnicianById,updateOwnProfile,createOwnService,getOwnServices };