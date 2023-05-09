import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetUserMetricsUseCase } from '../get-user-metrics'

describe('Get User Metrics Use Case', () => {
  let sut: GetUserMetricsUseCase
  let usersRepository: InMemoryUsersRepository
  let checkInsRepository: InMemoryCheckInsRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository, usersRepository)
  })

  it('should be able to get user metrics', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: user.id,
        gym_id: `gym-id${i}`,
      })
    }

    const { checkIns } = await sut.execute(user.id)

    expect(checkIns).toEqual(22)
  })

  it('should not be able to get metrics from a non existing user', async () => {
    await expect(sut.execute('non-existing-user-id')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should be able to fecth user without check ins', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { checkIns } = await sut.execute(user.id)

    expect(checkIns).toEqual(0)
  })
})
