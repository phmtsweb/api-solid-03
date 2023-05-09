import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGyms } from '../fetch-nearby-gyms'

export function makeFetchNearbyGyms() {
  const gymsRepository = new PrismaGymsRepository()
  return new FetchNearbyGyms(gymsRepository)
}
