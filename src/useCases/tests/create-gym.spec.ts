import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from '../create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'

describe('Register Use Case', () => {
  let sut: CreateGymUseCase

  beforeEach(() => {
    const gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia',
      description: 'Academia de musculação',
      phone: '123456789',
      latitude: 123456,
      longitude: 123456,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
