import { env } from '@/env'
import {
  FindManyNearbyParams,
  Gym,
  GymsRepository,
} from '../interfaces/gym-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  private readonly gyms: Gym[] = []

  async findManyNearby(
    coordinates: FindManyNearbyParams,
    maxDistance: number,
  ): Promise<Gym[]> {
    const gyms = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates({
        from: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        to: {
          latitude: gym.latitude,
          longitude: gym.longitude,
        },
      })

      return distance <= maxDistance
    })

    return gyms
  }

  async fetchAll(
    query?: string | undefined,
    { page, offset } = { page: 1, offset: env.MAX_RESULTS_PER_PAGE },
  ): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => {
        if (!query) {
          return true
        }

        return (
          gym.title.toLowerCase().includes(query.toLowerCase()) ||
          gym.description?.toLowerCase().includes(query.toLowerCase()) ||
          gym.phone?.toLowerCase().includes(query.toLowerCase())
        )
      })
      .slice((page - 1) * offset, page * offset)
  }

  async create(
    data: Omit<Gym, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Gym> {
    const gym = {
      ...data,
      id: 'gym-id',
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    return this.gyms.find((gym) => gym.id === id) || null
  }
}
