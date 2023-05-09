import { makeCreateGymUseCase } from '@/useCases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    phone: z.string().optional(),
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGym = makeCreateGymUseCase()

  const { gym } = await createGym.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send({ gym })
}
