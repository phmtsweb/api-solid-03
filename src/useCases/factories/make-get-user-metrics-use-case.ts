import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetrics() {
  const usersRepository = new PrismaUserRepository()
  const checkInsRepository = new PrismaCheckInsRepository()
  return new GetUserMetricsUseCase(checkInsRepository, usersRepository)
}
