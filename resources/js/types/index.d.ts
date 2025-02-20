import { School } from "@/Pages/schools/data/schema";
import { User } from "@/Pages/users/data/schema";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    school?: School;
};
