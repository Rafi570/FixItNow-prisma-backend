import { BookingStatus } from "../../../generated/prisma/client";

export interface ITechnicianFilters {
    location?: string;
    minRating?: string;
    skill?: string;
    searchTerm?: string;
}


export interface ITechnicianFilters {
    location?: string;
    minRating?: string;
    skill?: string;
    searchTerm?: string;
}

export interface IUpdateTechnicianProfile {
    bio?: string;
    experience?: number;
    skills?: string[];
    location?: string;
    hourlyRate?: number;
    isAvailable?: boolean;
}

export interface ICreateTechnicianService {
    title: string;
    description?: string;
    price: number;
    durationMins?: number;
    categoryId: string;
}


export interface IUpdateBookingStatus {
    status: BookingStatus;
}