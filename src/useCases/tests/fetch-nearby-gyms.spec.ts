import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { FetchNearbyGyms } from '../fetch-nearby-gyms'

describe('Fecth users check ins Use Case', () => {
  let sut: FetchNearbyGyms
  let gymsRepository: InMemoryGymsRepository

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGyms(gymsRepository)
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

    const gyms = await sut.execute({ userLatitude: 2, userLongitude: 2 })

    expect(gyms).toEqual(expect.any(Array))
    expect(gyms).toHaveLength(1)
  })
})
