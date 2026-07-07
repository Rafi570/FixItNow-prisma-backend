declare module "sslcommerz-lts" {
    class SSLCommerzPayment {
        constructor(store_id: string, store_passwd: string, is_live: boolean);
        init(data: Record<string, any>): Promise<any>;
        validate(data: Record<string, any>): Promise<any>;
        initPayment(data: Record<string, any>): Promise<any>;
        validationTransaction(data: Record<string, any>): Promise<any>;
    }
    export default SSLCommerzPayment;
}