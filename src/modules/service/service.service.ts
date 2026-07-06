// import { Prisma } from "../../../generated/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IServiceFilters } from "./service.interface";

const getAllServices = async (filters: IServiceFilters) => {
  const { categoryId, location, minRating, searchTerm } = filters;

  const andConditions: Prisma.ServiceWhereInput[] = [];

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (location) {
    andConditions.push({
      technician: {
        location: { contains: location, mode: "insensitive" },
      },
    });
  }

  if (minRating) {
    andConditions.push({
      technician: {
        ratingAvg: { gte: parseFloat(minRating) },
      },
    });
  }

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const services = await prisma.service.findMany({
    where: whereConditions,
    include: {
      category: true,
      technician: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return services;
};

export const serviceService = { getAllServices };
