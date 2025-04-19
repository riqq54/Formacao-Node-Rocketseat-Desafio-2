import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import request from "supertest";

describe('Auth routes', () => {

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

    it('should be possible to authenticate as a user', async () => {
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
        
        const cookies = authUserResponse.get('Set-Cookie')

        expect(cookies).toEqual(
            expect.arrayContaining([expect.stringContaining('user_id')])
        )
    })

})