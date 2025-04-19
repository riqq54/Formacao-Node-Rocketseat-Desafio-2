import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import request from "supertest";

describe('Users routes', () => {

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

    it('should be possible to create a user', async () => {
        await request(app.server)
                .post('/users')
                .send({
                    email: "teste@gmail.com",
                    password: "123456"
                })
                .expect(201)
    })

})