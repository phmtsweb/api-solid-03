import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to search a a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    await request(app.server)
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

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Gym 02',
        description: "Gym 02's description",
        latitude: -23.123456,
        longitude: -46.123456,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: '02',
      })
      .set({ Authorization: `Bearer ${token}` })
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym 02',
      }),
    ])
  })
})
