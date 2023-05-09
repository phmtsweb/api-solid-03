import { APIError } from '@/errors/APIError'

export class MaxNumberOfCheckInsError extends APIError {
  constructor() {
    super('Max number of check-ins reached', 403)
  }
}
