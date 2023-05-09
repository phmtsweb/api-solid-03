import { env } from '@/env'
import { GymsRepository } from '@/repositories/interfaces/gym-repository'

type FetchNearbyGymsParams = {
  userLatitude: number
  userLongitude: number
}

const maxDistance = env.MAX_DISTANCE * 100

export class FetchNearbyGyms {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({ userLatitude, userLongitude }: FetchNearbyGymsParams) {
    const gyms = await this.gymsRepository.findManyNearby(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      maxDistance,
    )
    return gyms
  }
}
