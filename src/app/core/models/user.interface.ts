export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    AGENT = 'AGENT',
    USER = 'USER'
}
