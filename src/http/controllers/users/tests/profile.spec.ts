import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to get an user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send()

    expect(profileResponse.status).toBe(200)
    expect(profileResponse.body.user).toHaveProperty('id')
    expect(profileResponse.body.user).toHaveProperty('name')
    expect(profileResponse.body.user).toHaveProperty('email')
    expect(profileResponse.body.user).toHaveProperty('created_at')
    expect(profileResponse.body.user).toHaveProperty('updated_at')
    expect(profileResponse.body.user.email).toEqual('johndoe@example.com')
  })
})
