export interface Customer {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company?: string;
    created_at?: Date;
    updated_at?: Date;
}
