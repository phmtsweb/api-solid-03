import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create'
import { validate } from './validate'
import { metrics } from './metrics'
import { history } from './history'
import { verifyUserRole } from '@/http/middlewares/only-admin'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/metrics', metrics)
  app.get('/history', history)
  app.post('/:gymId', create)
  app.patch(
    '/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
