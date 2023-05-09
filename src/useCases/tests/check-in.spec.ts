import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { CheckInUseCase } from '../check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins'
import { MaxDistanceError } from '../errors/max-distance-error'

describe('Register Use Case', () => {
  let sut: CheckInUseCase
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.create({
      title: 'Gym Name',
      description: 'Gym Description',
      phone: '123456789',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const checkIn = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in at a gym further 100 meters', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: -50,
        userLongitude: -37,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should not be able to check in twice on same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 2, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice on different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 2, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 3, 8, 0, 0))

    const checkIn = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
