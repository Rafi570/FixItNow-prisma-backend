export interface ICreateBooking {
    serviceId: string;
    scheduledAt: string;   
    address: string;
    note?: string;
}