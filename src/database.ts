import {Knex, knex as setupKnex} from 'knex'
import { env } from './env'

let databaseConnection

if (env.DATABASE_CLIENT === 'sqlite'){
    databaseConnection = {
      filename: env.DATABASE_URL
    }
} else {
    databaseConnection = env.DATABASE_URL
}

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: databaseConnection,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
      },
}

export const knex = setupKnex(config)
