import dotenv from "dotenv";
import path from "path";


dotenv.config({path: path.join(process.cwd(), ".env") });


export default {
    port : process.env.PORT,
    database_url : process.env.DATABASE_URL,
    app_url : process.env.APP_URL,
    env: process.env.NODE_ENV,
    bcrypt_salt_rounds : process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret : process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in : process.env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
        ssl: {
        store_id: process.env.SSL_STORE_ID,
        store_passwd: process.env.SSL_STORE_PASSWORD,
        is_live: process.env.SSL_IS_LIVE === "true",
        success_url: process.env.SSL_SUCCESS_URL,
        fail_url: process.env.SSL_FAIL_URL,
        cancel_url: process.env.SSL_CANCEL_URL,
    },
    frontend_url: process.env.FRONTEND_URL,

}