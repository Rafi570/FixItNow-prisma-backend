import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../lib/prisma";
import { initiateSSLPayment } from "../../utils/sslcommerz";
import { ICreatePayment } from "./payment.interface";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";

const createPayment = async (customerId: string, payload: ICreatePayment) => {
    const { bookingId } = payload;

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.customerId !== customerId) {
        throw new Error("You are not authorized to pay for this booking");
    }
    if (booking.status !== BookingStatus.ACCEPTED) {
        throw new Error("Booking must be accepted by technician before payment");
    }

    // আগে থেকে payment তৈরি হয়ে গেছে কিনা চেক করো
    const existingPayment = await prisma.payment.findUnique({ where: { bookingId } });
    if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
        throw new Error("This booking is already paid");
    }

    const tran_id = existingPayment?.transactionId ?? `TXN-${uuidv4()}`;

    // Payment record বানাও অথবা reuse করো (PENDING অবস্থায়)
    const payment = existingPayment
        ? existingPayment
        : await prisma.payment.create({
              data: {
                  bookingId,
                  transactionId: tran_id,
                  amount: booking.price,
                  status: PaymentStatus.PENDING,
              },
          });

    const sslResponse = await initiateSSLPayment({
        total_amount: booking.price,
        tran_id: payment.transactionId,
        customerName: booking.customer.name,
        customerEmail: booking.customer.email,
        customerPhone: "01700000000", // schema-তে phone ফিল্ড নেই, চাইলে পরে যোগ করো
        customerAddress: booking.address,
    });

    return { paymentUrl: sslResponse.GatewayPageURL, transactionId: payment.transactionId };
};

const confirmPayment = async (tran_id: string) => {
    const payment = await prisma.payment.findUnique({
        where: { transactionId: tran_id },
        include: { booking: true },
    });

    if (!payment) throw new Error("Payment not found");

    // এখানে ideally SSLCommerz validate API দিয়ে re-verify করা উচিত production-এ
    const updatedPayment = await prisma.payment.update({
        where: { transactionId: tran_id },
        data: { status: PaymentStatus.COMPLETED, paidAt: new Date() },
    });

    await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.PAID },
    });

    return updatedPayment;
};

const failPayment = async (tran_id: string) => {
    const payment = await prisma.payment.update({
        where: { transactionId: tran_id },
        data: { status: PaymentStatus.FAILED },
    });
    return payment;
};

const getUserPayments = async (customerId: string) => {
    const payments = await prisma.payment.findMany({
        where: { booking: { customerId } },
        include: { booking: { include: { service: true } } },
        orderBy: { createdAt: "desc" },
    });
    return payments;
};

const getPaymentById = async (id: string, customerId: string) => {
    const payment = await prisma.payment.findUnique({
        where: { id },
        include: { booking: { include: { service: true } } },
    });

    if (!payment) throw new Error("Payment not found");
    if (payment.booking.customerId !== customerId) {
        throw new Error("You are not authorized to view this payment");
    }

    return payment;
};

export const paymentService = {
    createPayment,
    confirmPayment,
    failPayment,
    getUserPayments,
    getPaymentById,
};