import { Gym, GymsRepository } from '@/repositories/interfaces/gym-repository'

type SearchGymsUseCaseParams = {
  query?: string
  page: number
  offset: number
}

export class SearchGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    query,
    page,
    offset,
  }: SearchGymsUseCaseParams): Promise<Gym[]> {
    return this.gymRepository.fetchAll(query, { page, offset })
  }
}
