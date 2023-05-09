import { env } from '@/env'
import { makeFetchUsersCheckInsHistory } from '@/useCases/factories/make-fetch-users-check-ins-history'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const historyQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    offset: z.coerce.number().min(1).default(env.MAX_RESULTS_PER_PAGE),
  })
  const { page, offset } = historyQuerySchema.parse(request.query)

  const historyUseCase = makeFetchUsersCheckInsHistory()

  const checkIns = await historyUseCase.execute({
    userId: request.user.sub,
    options: { page, offset },
  })

  return reply.status(200).send({ checkIns })
}
