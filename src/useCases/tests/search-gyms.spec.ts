import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from '../search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'

describe('Fecth users check ins Use Case', () => {
  let sut: SearchGymsUseCase
  let gymsRepository: InMemoryGymsRepository

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gym by title, description or phone', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-title${i}`,
        description: `gym-description${i}`,
        phone: `gym-phone${i}`,
        latitude: i,
        longitude: i,
      })
    }

    const gyms = await sut.execute({
      query: '2',
      page: 1,
      offset: 10,
    })

    expect(gyms).toEqual(expect.any(Array))
    expect(gyms).toHaveLength(5)
  })
})
