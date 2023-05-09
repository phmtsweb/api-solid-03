import { Gym } from './gym-repository'
import { User } from './users-repository'

export type CheckInDTO = {
  user_id: string
  gym_id: string
  validated_at?: Date | string | null
}

export type CheckIn = {
  id: string
  user_id: string
  user?: User
  gym?: Gym
  gym_id: string
  created_at: Date
  validated_at: Date | string | null
}

export type FetchOptions = {
  page: number
  offset: number
}

export type FindByUserIdOnDateParams = {
  userId: string
  date: Date
}
export interface CheckInsRepository {
  create(data: CheckInDTO): Promise<CheckIn>
  findByUserIdOnDate({
    userId,
    date,
  }: FindByUserIdOnDateParams): Promise<CheckIn | null>
  fetchCheckInsByUserId(
    userId: string,
    options?: FetchOptions,
  ): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  findById(id: string): Promise<CheckIn | null>
  validateCheckIn(id: string): Promise<CheckIn | null>
}
