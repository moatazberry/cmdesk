export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company?: string;
    created_at: Date;
    updated_at: Date;
}
