import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

const createReview = async (customerId: string, payload: ICreateReview) => {
    const { bookingId, rating, comment } = payload;

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    if (booking.customerId !== customerId) {
        throw new Error("You are not authorized to review this booking");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
        throw new Error("You can only review a completed booking");
    }

    const existingReview = await prisma.review.findUnique({ where: { bookingId } });
    if (existingReview) {
        throw new Error("You have already reviewed this booking");
    }

    // Review তৈরি করো
    const review = await prisma.review.create({
        data: {
            bookingId,
            customerId,
            technicianId: booking.technicianId,
            rating,
            comment,
        },
        include: {
            customer: { select: { id: true, name: true } },
            booking: { include: { service: true } },
        },
    });

    // Technician এর average rating আর total review count আপডেট করো
    const aggregate = await prisma.review.aggregate({
        where: { technicianId: booking.technicianId },
        _avg: { rating: true },
        _count: { rating: true },
    });

    await prisma.technicianProfile.update({
        where: { id: booking.technicianId },
        data: {
            ratingAvg: aggregate._avg.rating ?? 0,
            totalReviews: aggregate._count.rating,
        },
    });

    return review;
};

const getMyReviews = async (customerId: string) => {
    const reviews = await prisma.review.findMany({
        where: { customerId },
        include: {
            booking: { include: { service: true } },
            technician: { include: { user: { select: { id: true, name: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });

    return reviews;
};

const getTechnicianReviews = async (technicianId: string) => {
    const reviews = await prisma.review.findMany({
        where: { technicianId },
        include: {
            customer: { select: { id: true, name: true } },
            booking: { include: { service: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return reviews;
};

export const reviewService = { createReview, getMyReviews, getTechnicianReviews };