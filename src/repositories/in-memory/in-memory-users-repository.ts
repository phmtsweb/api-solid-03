import {
  CreateUserDTO,
  User,
  UsersRepository,
} from '../interfaces/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  private readonly users: User[] = []

  async create(data: CreateUserDTO): Promise<User> {
    const user = {
      ...data,
      id: String(this.users.length + 1),
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.users.push(user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)
    if (!user) return null
    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)
    if (!user) return null
    return user
  }
}
