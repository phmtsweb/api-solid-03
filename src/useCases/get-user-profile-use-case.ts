import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    return { user }
  }
}
