import { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { env } from '@/env'
import { InvalidCheckInError } from './errors/invalid-check-in-error'

export class ValidateCheckInUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}
  async execute(checkInId: string) {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError('Check-in')
    }

    const distanceInMinutes =
      (Date.now() - checkIn.created_at.getTime()) / 1000 / 60

    console.log(distanceInMinutes)
    const maxMinutesToValidateCheckIn = env.MAX_MINUTES_TO_VALIDATE_CHECK_IN

    if (distanceInMinutes > maxMinutesToValidateCheckIn) {
      throw new InvalidCheckInError()
    }

    const validatedCheckIn = await this.checkInsRepository.validateCheckIn(
      checkInId,
    )

    return validatedCheckIn
  }
}
