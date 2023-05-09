import { APIError } from '@/errors/APIError'

export class MaxDistanceError extends APIError {
  constructor() {
    super('User is too far from gym', 403)
  }
}
