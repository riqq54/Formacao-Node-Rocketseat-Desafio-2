import { FastifyInstance } from "fastify";
import { z } from "Zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { checkAuth } from "../middlewares/check-auth";

export async function mealsRoutes(app: FastifyInstance){

    app.addHook('preHandler', checkAuth)

    app.post('/', async (req, res) => {
        
        const createMealSchema = z.object({
            name: z.string(),
            description: z.string(),
            had_at: z.coerce.date(),
            on_diet: z.boolean()
        })

        const { name, description, had_at, on_diet } = createMealSchema.parse(req.body)

        console.log(had_at.getTime());

        const { user_id } = req.cookies

        await knex('meals').insert({
            id: randomUUID(),
            name,
            description,
            had_at,
            on_diet,
            user_id,
        })

        return res.status(201).send()
    })

    app.get('/', async (req, res) => {
        
        const { user_id } = req.cookies

        const meals = await knex('meals').where('user_id', user_id)

        return res.send({ meals })
    })

    app.delete('/:mealId', async(req, res) => {

        const paramsSchema = z.object({
            mealId: z.string().uuid()
        })

        const { user_id } = req.cookies

        const { mealId } = paramsSchema.parse(req.params)

        const meal = await knex('meals').where('id', mealId).first()

        if (!meal){
            return res.status(404).send('Meal not found')
        }

        await knex('meals').where({
            user_id,
            id: mealId
        }).del()

        return res.status(200).send()

    })
}