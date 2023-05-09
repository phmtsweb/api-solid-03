import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { FecthUsersCheckInsHistory } from '../fetch-users-check-ins-history'

export function makeFetchUsersCheckInsHistory() {
  const usersRepository = new PrismaUserRepository()
  const checkInsRepository = new PrismaCheckInsRepository()
  return new FecthUsersCheckInsHistory(usersRepository, checkInsRepository)
}
