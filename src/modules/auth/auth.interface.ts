// auth.interface.ts
export interface ILoginUser {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
}