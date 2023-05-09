import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from '../register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

describe('Register Use Case', () => {
  let sut: RegisterUseCase

  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should hash user password before saving it to the database', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
