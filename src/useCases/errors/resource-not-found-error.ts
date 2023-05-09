import { APIError } from '@/errors/APIError'

export class ResourceNotFoundError extends APIError {
  constructor(resource: string) {
    super(`${resource} not found`, 404)
  }
}
