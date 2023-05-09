import {
  User,
  UsersRepository,
} from '@/repositories/interfaces/users-repository'
import { compare } from 'bcryptjs'
import { AuthenticateError } from './errors/authenticate-error'

type AuthenticateReturn = {
  user: User
}

type AuthenticateParams = {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateParams): Promise<AuthenticateReturn> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) throw new AuthenticateError()

    const passwordMatch = await compare(password, user.password_hash)
    if (!passwordMatch) throw new AuthenticateError()

    return { user }
  }
}
