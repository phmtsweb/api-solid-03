import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
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

    expect(response.status).toEqual(201)
  })
})
