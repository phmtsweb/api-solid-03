import { prisma } from '@/lib/prisma'
import {
  FindManyNearbyParams,
  Gym,
  GymCreateParams,
  GymsRepository,
} from '../interfaces/gym-repository'

import { Gym as PrismaGym } from '@prisma/client'

import { env } from '@/env'

export class PrismaGymsRepository implements GymsRepository {
  async findManyNearby(
    { latitude, longitude }: FindManyNearbyParams,
    maxDistance = env.MAX_DISTANCE,
  ): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<PrismaGym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${
      maxDistance * 100
    }
    `

    return gyms.map((gym) => ({
      id: gym.id,
      title: gym.title,
      description: gym.description,
      phone: gym.phone,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
      created_at: gym.created_at,
      updated_at: gym.updated_at,
    }))
  }

  async fetchAll(
    query?: string | undefined,
    { page, offset } = { page: 1, offset: env.MAX_RESULTS_PER_PAGE },
  ): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      take: offset,
      skip: (page - 1) * offset,
      where: query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                phone: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,
    })

    return gyms.map((gym) => ({
      id: gym.id,
      title: gym.title,
      description: gym.description,
      phone: gym.phone,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
      created_at: gym.created_at,
      updated_at: gym.updated_at,
    }))
  }

  async create(data: GymCreateParams): Promise<Gym> {
    const gym = await prisma.gym.create({
      data: {
        title: data.title,
        description: data.description || '',
        phone: data.phone || '',
        latitude: data.latitude,
        longitude: data.longitude,
      },
    })

    return {
      id: gym.id,
      title: gym.title,
      description: gym.description,
      phone: gym.phone,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
      created_at: gym.created_at,
      updated_at: gym.updated_at,
    }
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    if (!gym) {
      return null
    }

    return {
      id: gym.id,
      title: gym.title,
      description: gym.description,
      phone: gym.phone,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
      created_at: gym.created_at,
      updated_at: gym.updated_at,
    }
  }
}
