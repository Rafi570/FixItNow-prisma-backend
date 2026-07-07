import SSLCommerzPayment from "sslcommerz-lts";
import config from "../config";

export const initiateSSLPayment = async (paymentData: {
    total_amount: number;
    tran_id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
}) => {
    const sslcz = new SSLCommerzPayment(
        config.ssl.store_id,
        config.ssl.store_passwd,
        config.ssl.is_live
    );

    const data = {
        total_amount: paymentData.total_amount,
        currency: "BDT",
        tran_id: paymentData.tran_id,
        success_url: `${config.ssl.success_url}?tran_id=${paymentData.tran_id}`,
        fail_url: `${config.ssl.fail_url}?tran_id=${paymentData.tran_id}`,
        cancel_url: `${config.ssl.cancel_url}?tran_id=${paymentData.tran_id}`,
        ipn_url: config.ssl.success_url,
        shipping_method: "NO",
        product_name: "Home Service Booking",
        product_category: "Service",
        product_profile: "general",
        cus_name: paymentData.customerName,
        cus_email: paymentData.customerEmail,
        cus_add1: paymentData.customerAddress,
        cus_city: "Dhaka",
        cus_country: "Bangladesh",
        cus_phone: paymentData.customerPhone,
        ship_name: paymentData.customerName,
        ship_add1: paymentData.customerAddress,
        ship_city: "Dhaka",
        ship_country: "Bangladesh",
        ship_postcode: 1000,
    };

    const apiResponse = await sslcz.init(data);
    return apiResponse;
};

export const validateSSLPayment = async (tran_id: string, amount: number) => {
    const sslcz = new SSLCommerzPayment(
        config.ssl.store_id,
        config.ssl.store_passwd,
        config.ssl.is_live
    );

    // validation API দিয়ে transaction যাচাই (production-এ এভাবেই করা উচিত)
    const validationResponse = await sslcz.validate({
        tran_id,
        amount,
        currency: "BDT",
    });

    return validationResponse;
};