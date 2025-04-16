import { FastifyReply, FastifyRequest } from "fastify";

export async function checkAuth(req: FastifyRequest, res: FastifyReply){
    const {user_id} = req.cookies

    if(!user_id){
        return res.status(401).send()
    }
}