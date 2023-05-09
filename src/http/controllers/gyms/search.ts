import { env } from '@/env'
import { makeSearchGymsUseCase } from '@/useCases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string().optional(),
    page: z.number().min(1).default(1),
    offset: z.number().min(1).default(env.MAX_RESULTS_PER_PAGE),
  })
  const { q: query, page, offset } = searchGymsQuerySchema.parse(request.query)

  const searchGym = makeSearchGymsUseCase()

  const gyms = await searchGym.execute({
    query: query ?? undefined,
    page,
    offset,
  })

  return reply.status(200).send({ gyms })
}
