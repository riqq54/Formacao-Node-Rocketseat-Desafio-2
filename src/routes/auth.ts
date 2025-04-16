import { FastifyInstance } from "fastify";
import { z } from "Zod";
import { knex } from "../database";

export async function authRoutes(app: FastifyInstance){

    app.post('/', async (req, res) => {
        
        const loginSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        let { user_id } = req.cookies

        if(user_id){
            return res.status(200).send('Already Authenticated')
        }

        const { email, password } = loginSchema.parse(req.body)

        const user = await knex('users').where('email', email).first()

        if (!user || user.password != password){
            return res.status(401).send('Invalid Credentials')
        }

        res.cookie('user_id', user.id,{
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        })

        return res.status(200).send()
    })
}