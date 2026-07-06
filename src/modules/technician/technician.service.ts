import { prisma } from "../../lib/prisma";
import { ITechnicianFilters } from "./technician.interface";
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

export const technicianService = { getAllTechnicians, getTechnicianById };