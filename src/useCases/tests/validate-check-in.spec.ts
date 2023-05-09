import { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ValidateCheckInUseCase } from '../validate-check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InvalidCheckInError } from '../errors/invalid-check-in-error'

let checkInsRepository: CheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate a check in', async () => {
    vi.setSystemTime(new Date('2021-01-01 12:00:00'))
    const checkIn = await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })

    const validatedCheckIn = await sut.execute(checkIn.id)

    expect(validatedCheckIn?.validated_at).not.toBeNull()
    expect(validatedCheckIn?.validated_at).toEqual(expect.any(Date))
    expect(validatedCheckIn?.validated_at).toEqual(
      new Date('2021-01-01 12:00:00'),
    )
  })

  it('should not be able to validate a non existing check in', async () => {
    vi.setSystemTime(new Date('2021-01-01 12:00:00'))

    await expect(
      sut.execute('non-existing-check-in-id'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate a check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date('2021-01-01 12:00:00'))
    const checkIn = await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })

    const twentyMinutesLater = 1000 * 60 * 20 + 1

    vi.advanceTimersByTime(twentyMinutesLater)

    await expect(sut.execute(checkIn.id)).rejects.toBeInstanceOf(
      InvalidCheckInError,
    )
  })
})
