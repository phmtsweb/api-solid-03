export type Gym = {
  id: string
  title: string
  description?: string | null
  phone?: string | null
  latitude: number
  longitude: number
  created_at: Date
  updated_at: Date
}

export type FetchOptions = {
  page: number
  offset: number
}

export type FindManyNearbyParams = {
  latitude: number
  longitude: number
}

export type GymCreateParams = Omit<Gym, 'id' | 'created_at' | 'updated_at'>

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: GymCreateParams): Promise<Gym>
  fetchAll(query?: string, options?: FetchOptions): Promise<Gym[]>
  findManyNearby(
    coordinates: FindManyNearbyParams,
    maxDistance: number,
  ): Promise<Gym[]>
}
