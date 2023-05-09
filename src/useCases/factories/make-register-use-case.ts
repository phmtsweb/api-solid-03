import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository()
  return new RegisterUseCase(usersRepository)
}
