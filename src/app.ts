import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { appRoutes } from './http/controllers/routes'
import { ZodError } from 'zod'
import { env } from './env'
import { APIError } from './errors/APIError'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (error instanceof APIError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
