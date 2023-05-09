export type CreateUserDTO = {
  name: string
  email: string
  password_hash: string
}

export type Role = 'ADMIN' | 'MEMBER'

export type User = {
  id: string
  name: string
  email: string
  password_hash: string
  role: Role
  created_at: Date
  updated_at: Date
}

export interface UsersRepository {
  create(data: CreateUserDTO): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
