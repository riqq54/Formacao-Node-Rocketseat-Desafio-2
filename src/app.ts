import fastify from "fastify";
import cookie from "@fastify/cookie";

import { usersRoutes } from "./routes/users";
import { authRoutes } from "./routes/auth";
import { mealsRoutes } from "./routes/meals";

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
    prefix: 'users'
})

app.register(authRoutes, {
    prefix: 'auth'
})

app.register(mealsRoutes,{
    prefix: 'meals'
})