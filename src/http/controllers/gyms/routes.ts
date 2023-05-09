import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/only-admin'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/search', search)
  app.get('/nearby', nearby)
  app.post('/', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
