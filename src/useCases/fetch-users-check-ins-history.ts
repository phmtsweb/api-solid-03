import {
  CheckIn,
  CheckInsRepository,
  FetchOptions,
} from '@/repositories/interfaces/check-ins-repository'
import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { env } from '@/env'

type FecthUsersCheckInsHistoryParams = {
  userId: string
  options?: FetchOptions
}

export class FecthUsersCheckInsHistory {
  constructor(
    // eslint-disable-next-line no-undef
    private readonly usersRepository: UsersRepository,
    private readonly checkInsRepository: CheckInsRepository,
  ) {}

  async execute({
    userId,
    options = { page: 1, offset: env.MAX_RESULTS_PER_PAGE },
  }: FecthUsersCheckInsHistoryParams): Promise<CheckIn[]> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const checkIns = await this.checkInsRepository.fetchCheckInsByUserId(
      userId,
      options,
    )

    return checkIns
  }
}
