import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../interfaces/users-repository'

export class PrismaUserRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) return null

    return user
  }

  private userWithoutPassword(user: User) {
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
