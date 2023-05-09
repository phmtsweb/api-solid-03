import { APIError } from '@/errors/APIError'

export class CheckInTodayExistsError extends APIError {
  constructor() {
    super('User already checked in today', 409)
  }
}
