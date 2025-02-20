import { PageProps } from "..";
import { User } from "@/Pages/users/data/schema";

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PagePropsWithPagination<T> extends PageProps {
    data: PaginatedResponse<T>;
    auth: {
        user: User;
    };
}

