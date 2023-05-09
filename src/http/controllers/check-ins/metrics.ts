import { makeGetUserMetrics } from '@/useCases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const metricsUseCase = makeGetUserMetrics()

  const { checkIns } = await metricsUseCase.execute(request.user.sub)

  return reply.status(200).send({ checkIns })
}
