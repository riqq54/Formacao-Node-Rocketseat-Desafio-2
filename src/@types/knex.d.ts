import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string,
            email: string,
            password: string,
            created_at: string
        },

        meals: {
            id: string,
            name: string,
            description: string,
            had_at: string,
            created_at: string,
            user_id: string
        },
    }
}