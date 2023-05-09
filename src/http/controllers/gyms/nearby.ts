import { makeFetchNearbyGyms } from '@/useCases/factories/make-fetch-nearby-gyms'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.coerce
      .number()
      .refine((value) => value >= -180 && value <= 180),
  })
  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const nearbyGyms = makeFetchNearbyGyms()

  const gyms = await nearbyGyms.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
