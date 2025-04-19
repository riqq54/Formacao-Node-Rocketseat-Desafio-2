import { FastifyInstance } from "fastify";
import { number, z } from "Zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { checkAuth } from "../middlewares/check-auth";

export async function mealsRoutes(app: FastifyInstance){

    app.addHook('preHandler', checkAuth)

    app.post('/', async(req, res) => {
        
        const createMealSchema = z.object({
            name: z.string(),
            description: z.string(),
            had_at: z.coerce.date(),
            on_diet: z.boolean()
        })

        const { name, description, had_at, on_diet } = createMealSchema.parse(req.body)

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

    app.put('/:mealId', async(req, res) => {
        const paramsSchema = z.object({
            mealId: z.string().uuid()
        })

        const { mealId } = paramsSchema.parse(req.params)

        const updateMealSchema = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            had_at: z.coerce.date().optional(),
            on_diet: z.boolean().optional()
        })

        const { name, description, had_at, on_diet } = updateMealSchema.parse(req.body)

        const { user_id } = req.cookies

        const meal = await knex('meals').where({
            id: mealId,
            user_id,
        }).first()

        if (!meal){
            return res.status(404).send('Meal not found')
        }

        await knex('meals').where({
            id: mealId,
            user_id,
        }).update({
            name: name ? name : meal.name,
            description: description ? description : meal.description,
            had_at: had_at ? had_at : meal.had_at,
            on_diet: on_diet ? on_diet : meal.on_diet,
        })

        return res.status(201).send()

    })

    app.get('/', async(req, res) => {
        
        const { user_id } = req.cookies

        const meals = await knex('meals').where('user_id', user_id)

        return res.send({ meals })
    })

    app.get('/:mealId', async(req, res) => {
        const paramsSchema = z.object({
            mealId: z.string().uuid()
        })

        const { user_id } = req.cookies

        const { mealId } = paramsSchema.parse(req.params)

        const meal = await knex('meals').where({
            id: mealId,
            user_id
        }).first()

        if (!meal){
            return res.status(404).send('Meal not found')
        }

        return res.send({ meal })
    })

    app.get('/summary', async(req, res) => {

        const { user_id } = req.cookies

        const onDietMeals = await knex('meals').where({
            user_id,
            on_diet: true
        }).count('id', {as: 'total'}).first()

        const offDietMeals = await knex('meals').where({
            user_id,
            on_diet: false
        }).count('id', {as: 'total'}).first()

        const meals = await knex('meals').where('user_id', user_id).orderBy('had_at', 'asc')

        const {bestStreak, currentStreak} = meals.reduce((accumulator, currentValue)=> {
            
            if(currentValue.on_diet){
                accumulator.currentStreak += 1
            } else {
                accumulator.currentStreak = 0
            }

            if(accumulator.currentStreak > accumulator.bestStreak){
                accumulator.bestStreak = accumulator.currentStreak
            }

            return accumulator

        }, { bestStreak: 0, currentStreak: 0 })

        const summary = {
            meals: meals.length,
            onDietMeals: onDietMeals?.total,
            offDietMeals: offDietMeals?.total,
            currentOnDietStreak: currentStreak,
            bestOnDietStreak: bestStreak
        }

        return res.send({summary})
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