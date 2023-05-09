import { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export class GetUserMetricsUseCase {
  constructor(
    private readonly checkInsRepository: CheckInsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const numberOfCheckIns = await this.checkInsRepository.countByUserId(userId)

    return {
      checkIns: numberOfCheckIns,
    }
  }
}
