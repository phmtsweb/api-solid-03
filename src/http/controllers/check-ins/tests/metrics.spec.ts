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

describe('Create gym (e2e)', () => {
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

  it('should be able to get check-in metrics', async () => {
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

    vi.setSystemTime(new Date('2021-01-03 13:00:00'))

    const gymResponse2 = await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Gym 02',
        description: "Gym 02's description",
        latitude: -23.123466,
        longitude: -46.123466,
      })

    const gym: Gym = gymResponse.body.gym
    const gym2: Gym = gymResponse2.body.gym

    await request(app.server)
      .post(`/check-ins/${gym.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        latitude: -23.123456,
        longitude: -46.123456,
      })

    await request(app.server)
      .post(`/check-ins/${gym2.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        latitude: -23.123456,
        longitude: -46.123456,
      })

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set({ Authorization: `Bearer ${token}` })
      .query({
        page: 1,
        offset: 10,
      })
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.checkIns).toEqual(2)
  })
})
