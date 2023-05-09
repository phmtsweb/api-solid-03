import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

describe('Register Use Case', () => {
  let sut: GetUserProfileUseCase
  let usersRepository: InMemoryUsersRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute(createdUser.id)

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() => sut.execute('wrong-id')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
