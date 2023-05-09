import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FecthUsersCheckInsHistory } from '../fetch-users-check-ins-history'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { env } from '@/env'

describe('Fecth users check ins Use Case', () => {
  let sut: FecthUsersCheckInsHistory
  let usersRepository: InMemoryUsersRepository
  let checkInsRepository: InMemoryCheckInsRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FecthUsersCheckInsHistory(usersRepository, checkInsRepository)
  })

  it('should be able to fecth user check ins', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await checkInsRepository.create({
      user_id: user.id,
      gym_id: 'gym-id',
    })

    await checkInsRepository.create({
      user_id: user.id,
      gym_id: 'gym-id2',
    })

    const checkIns = await sut.execute({ userId: user.id })

    expect(checkIns).toEqual(expect.any(Array))
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id' }),
      expect.objectContaining({ gym_id: 'gym-id2' }),
    ])
  })

  it('should not be able to fecth check ins from a non existing user', async () => {
    await expect(
      sut.execute({ userId: 'non-existing-user-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to fecth user check ins paginated', async () => {
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

    const checkIns = await sut.execute({
      userId: user.id,
      options: {
        page: 2,
        offset: env.MAX_RESULTS_PER_PAGE,
      },
    })

    expect(checkIns).toEqual(expect.any(Array))
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id21' }),
      expect.objectContaining({ gym_id: 'gym-id22' }),
    ])
  })
})
