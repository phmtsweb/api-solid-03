import { APIError } from '@/errors/APIError'

export class UserAlreadyExistsError extends APIError {
  constructor() {
    super('User already exists', 409)
  }
}
