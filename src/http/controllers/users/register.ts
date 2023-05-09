import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { APIError } from '@/errors/APIError'
import { makeRegisterUseCase } from '@/useCases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = z.object({
    name: z.string(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  })
  const { name, email, password } = body.parse(request.body)

  const registerUseCase = makeRegisterUseCase()

  try {
    const user = await registerUseCase.execute({
      name,
      email,
      password,
    })

    return reply.status(201).send({ user })
  } catch (err: any) {
    if (err instanceof APIError) {
      return reply.status(err.statusCode).send({ message: err.message })
    }
    throw err
  }
}
