import { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import { GymsRepository } from '@/repositories/interfaces/gym-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { env } from '@/env'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'

type CheckInUseCaseParams = {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
  validatedAt?: Date | string | null
}

export class CheckInUseCase {
  constructor(
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
    validatedAt,
  }: CheckInUseCaseParams) {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError('Gym')
    }

    const distance = getDistanceBetweenCoordinates({
      from: {
        latitude: gym.latitude,
        longitude: gym.longitude,
      },
      to: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
    })

    const MAX_DISTANCE = env.MAX_DISTANCE // 0.1 km is default

    if (distance > MAX_DISTANCE) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate({
      userId,
      date: new Date(),
    })

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
      validated_at: validatedAt,
    })
    return checkIn
  }
}
