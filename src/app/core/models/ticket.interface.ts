export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignedTo?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    category: string;
    attachments?: string[];
    comments?: TicketComment[];
}

export interface TicketComment {
    id: string;
    content: string;
    createdBy: string;
    createdAt: Date;
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    ON_HOLD = 'ON_HOLD',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}
