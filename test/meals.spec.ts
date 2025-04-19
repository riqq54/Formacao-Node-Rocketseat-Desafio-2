import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import request from "supertest";

describe('Meals routes', () => {

    beforeAll( async() => {
        await app.ready()
    })

    afterAll( async() => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('should be possible to create a meal', async () => {
        await request(app.server)
                .post('/users')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(201)

        const authUserResponse = await request(app.server)
                .post('/auth')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(200)

        const cookies = authUserResponse.get('Set-Cookie') ?? []

        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('user_id')])
        )

        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste",
                    description: "Descrição da Refeição Teste",
                    had_at: "2025-04-20 12:00:00",
                    on_diet: true
                })
                .expect(201)

    })

    it('should be possible to list all meals', async () => {
        await request(app.server)
                .post('/users')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(201)

        const authUserResponse = await request(app.server)
                .post('/auth')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(200)

        const cookies = authUserResponse.get('Set-Cookie') ?? []

        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('user_id')])
        )

        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 1",
                    description: "Descrição da Refeição Teste 1",
                    had_at: "2025-04-20 12:00:00",
                    on_diet: true
                })
                .expect(201)
                
        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 2",
                    description: "Descrição da Refeição Teste 2",
                    had_at: "2025-04-21 12:00:00",
                    on_diet: false
                })
                .expect(201)

        const getMealsResponse = await request(app.server)
                .get('/meals')
                .set('Cookie', cookies)
                .expect(200)    

        expect(getMealsResponse.body.meals).toHaveLength(2)

        expect(getMealsResponse.body.meals[0].name).toBe('Refeição Teste 1')
        expect(getMealsResponse.body.meals[1].name).toBe('Refeição Teste 2')

    })

    it('should be possible to list a single meal', async () => {
        await request(app.server)
                .post('/users')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(201)

        const authUserResponse = await request(app.server)
                .post('/auth')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(200)

        const cookies = authUserResponse.get('Set-Cookie') ?? []

        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('user_id')])
        )

        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 1",
                    description: "Descrição da Refeição Teste 1",
                    had_at: "2025-04-20 12:00:00",
                    on_diet: true
                })
                .expect(201)
                
        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 2",
                    description: "Descrição da Refeição Teste 2",
                    had_at: "2025-04-21 12:00:00",
                    on_diet: false
                })
                .expect(201)

        const getMealsResponse = await request(app.server)
                .get('/meals')
                .set('Cookie', cookies)
                .expect(200)

        expect(getMealsResponse.body.meals).toHaveLength(2)

        const mealId = getMealsResponse.body.meals[0].id

        const getSingleMealResponse = await request(app.server)
                .get(`/meals/${mealId}`)
                .set('Cookie', cookies)
                .expect(200)

        expect(getSingleMealResponse.body).toEqual({
            meal: expect.objectContaining({
                name: "Refeição Teste 1",
                description: "Descrição da Refeição Teste 1",
                had_at: expect.any(Number),
                on_diet: 1,
            })
        })

    })
    
    it('should be possible to update a meal', async () => {
        await request(app.server)
                .post('/users')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(201)

        const authUserResponse = await request(app.server)
                .post('/auth')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(200)

        const cookies = authUserResponse.get('Set-Cookie') ?? []

        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('user_id')])
        )

        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 1",
                    description: "Descrição da Refeição Teste 1",
                    had_at: "2025-04-20 12:00:00",
                    on_diet: true
                })
                .expect(201)
                
        const getMealsResponse = await request(app.server)
                .get('/meals')
                .set('Cookie', cookies)
                .expect(200)

        expect(getMealsResponse.body.meals).toHaveLength(1)

        const mealId = getMealsResponse.body.meals[0].id

        await request(app.server)
                .put(`/meals/${mealId}`)
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 1 atualizada!",
                })
                .expect(201)

        const getSingleMealResponse = await request(app.server)
                .get(`/meals/${mealId}`)
                .set('Cookie', cookies)
                .expect(200)

        expect(getSingleMealResponse.body).toEqual({
            meal: expect.objectContaining({
                name: "Refeição Teste 1 atualizada!",
                description: "Descrição da Refeição Teste 1",
                had_at: expect.any(Number),
                on_diet: 1,
            })
        })

    })

    it('should be possible to delete a meal', async () => {
        await request(app.server)
                .post('/users')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(201)

        const authUserResponse = await request(app.server)
                .post('/auth')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(200)

        const cookies = authUserResponse.get('Set-Cookie') ?? []

        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('user_id')])
        )

        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 1",
                    description: "Descrição da Refeição Teste 1",
                    had_at: "2025-04-20 12:00:00",
                    on_diet: true
                })
                .expect(201)

        const getMealsResponse = await request(app.server)
                .get('/meals')
                .set('Cookie', cookies)
                .expect(200)

        expect(getMealsResponse.body.meals).toHaveLength(1)

        const mealId = getMealsResponse.body.meals[0].id

        await request(app.server)
                .delete(`/meals/${mealId}`)
                .set('Cookie', cookies)
                .expect(200)

        const afterDeleteResponse = await request(app.server)
                .get('/meals')
                .set('Cookie', cookies)
                .expect(200)

        expect(afterDeleteResponse.body.meals).toHaveLength(0)

    })

    it('should be possible to list a meal summary', async () => {
        await request(app.server)
                .post('/users')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(201)

        const authUserResponse = await request(app.server)
                .post('/auth')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(200)

        const cookies = authUserResponse.get('Set-Cookie') ?? []

        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('user_id')])
        )

        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 1",
                    description: "Descrição da Refeição Teste 1",
                    had_at: "2025-04-20 12:00:00",
                    on_diet: true
                })
                .expect(201)
                
        await request(app.server)
                .post('/meals')
                .set('Cookie', cookies)
                .send({
                    name: "Refeição Teste 2",
                    description: "Descrição da Refeição Teste 2",
                    had_at: "2025-04-21 12:00:00",
                    on_diet: false
                })
                .expect(201)

        const getSumamaryResponse = await request(app.server)
                .get('/meals/summary')
                .set('Cookie', cookies)
                .expect(200)

        expect(getSumamaryResponse.body).toEqual({
            summary: expect.objectContaining({
                meals: 2,
                onDietMeals: 1,
                offDietMeals: 1,
                currentOnDietStreak: 0,
                bestOnDietStreak: 1,
            })
        })

    })

})