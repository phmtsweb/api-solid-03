import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile-use-case'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUserRepository()
  return new GetUserProfileUseCase(usersRepository)
}
