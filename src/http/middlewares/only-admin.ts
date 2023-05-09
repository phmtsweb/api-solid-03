import { Role } from '@/repositories/interfaces/users-repository'
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: Role) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const { role } = request.user

    if (role !== roleToVerify) {
      reply.status(403).send({ message: 'Forbidden' })
    }
  }
}
