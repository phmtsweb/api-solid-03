import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { Gym } from '@/repositories/interfaces/gym-repository'
import { CheckIn } from '@/repositories/interfaces/check-ins-repository'

describe('Validate check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    vi.setSystemTime(new Date('2021-01-01 13:00:00'))
    const gymResponse = await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Gym 01',
        description: "Gym 01's description",
        latitude: -23.123456,
        longitude: -46.123456,
      })

    const validateAt = new Date('2021-01-01 13:15:00')

    vi.setSystemTime(validateAt)

    const gym: Gym = gymResponse.body.gym

    const checkInResponse = await request(app.server)
      .post(`/check-ins/${gym.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        latitude: -23.123456,
        longitude: -46.123456,
      })

    const checkIn: CheckIn = checkInResponse.body.checkIn

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toEqual(200)
    expect(response.body.checkIn.validated_at).toEqual(validateAt.toISOString())
  })
})
