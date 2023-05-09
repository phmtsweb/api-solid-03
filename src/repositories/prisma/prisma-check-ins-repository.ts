import { prisma } from '@/lib/prisma'
import {
  CheckIn,
  CheckInDTO,
  CheckInsRepository,
  FindByUserIdOnDateParams,
} from '../interfaces/check-ins-repository'
import { FetchOptions } from '../interfaces/gym-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string): Promise<CheckIn | null> {
    return prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
  }

  async validateCheckIn(id: string): Promise<CheckIn | null> {
    const checkIn = await this.findById(id)

    if (!checkIn) return null

    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id,
      },
      data: {
        validated_at: new Date(),
      },
    })

    return updatedCheckIn
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }

  async findByUserIdOnDate({
    userId,
    date,
  }: FindByUserIdOnDateParams): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date').toDate()
    const endOfTheDay = dayjs(date).endOf('date').toDate()
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })

    return checkIn
  }

  async fetchCheckInsByUserId(
    userId: string,
    { page, offset }: FetchOptions,
  ): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: offset,
      skip: (page - 1) * offset,
    })

    return checkIns
  }

  async create(data: CheckInDTO): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }
}
