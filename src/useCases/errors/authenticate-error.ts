import { APIError } from '@/errors/APIError'

export class AuthenticateError extends APIError {
  constructor() {
    super('Invalid credentials', 401)
  }
}
