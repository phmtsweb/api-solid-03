import { makeCheckInUseCase } from '@/useCases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const createCheckIn = makeCheckInUseCase()

  const checkIn = await createCheckIn.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send({ checkIn })
}
