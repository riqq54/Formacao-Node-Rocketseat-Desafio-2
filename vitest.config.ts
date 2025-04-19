import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        env: {
            NODE_ENV: "test",
            DATABASE_URL: "./db/test.db",
            DATABASE_CLIENT: "sqlite",
            PORT: "3333",
        },
        pool: 'forks',
        poolOptions: {
        forks: {
            singleFork: true,
        },
        },
    }
})