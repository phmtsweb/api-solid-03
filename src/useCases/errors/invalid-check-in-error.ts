import { env } from '@/env'
import { APIError } from '@/errors/APIError'

export class InvalidCheckInError extends APIError {
  constructor() {
    const maxMinutesToValidateCheckIn = env.MAX_MINUTES_TO_VALIDATE_CHECK_IN
    super(
      `Check-in is invalid. It has more than ${maxMinutesToValidateCheckIn} minutes`,
      403,
    )
  }
}
