import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUserRepository()
  return new AuthenticateUseCase(usersRepository)
}
