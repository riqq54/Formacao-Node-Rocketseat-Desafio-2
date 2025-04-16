import { FastifyInstance } from "fastify";
import { z } from "Zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function usersRoutes(app: FastifyInstance){
    app.post('/', async (req, res) => {
        
        const createUserSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { email, password } = createUserSchema.parse(req.body)

        const user = await knex('users').where('email', email).first()

        if (user) {
            return res.status(400).send('User already exists.')
        }

        await knex('users').insert({
            id: randomUUID(),
            email,
            password
        })

        return res.status(201).send()
    })
}