import { PageProps } from "..";
import { User } from "@/Pages/users/data/schema";
import { PaginatedResponse } from "./paginate";

export interface PagePropsWithPagination<T> extends PageProps {
    data: PaginatedResponse<T>;
    auth: {
        user: User;
    };
}
