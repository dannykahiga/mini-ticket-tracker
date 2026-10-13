export enum TicketStatus {
    open = 'open',
    closed = 'closed',
    in_progress = 'in_progress',
}

enum TicketPriority {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

export type TicketStatusCount = {
    status: TicketStatus,
    count: number
}

export type TicketStatusCountResponse = {
    by_status: TicketStatusCount[];
    total: number;
    page: number;
    limit: number;
}

export type TicketListResponse = {
    items: Ticket[];
    total: number;
    page: number;
    limit: number;
}

export type Ticket = {
    id?: number;
    title: string;
    description: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    created_at?: number;
}