// import { UserStatus } from "../../../generated/prisma";

import { UserStatus } from "../../../generated/prisma/client";

export interface IUpdateUserStatus {
    status: UserStatus;
}

export interface ICreateCategory {
    name: string;
    description?: string;
}