import { GymsRepository } from '@/repositories/interfaces/gym-repository'

type CreateGymUseCaseParams = {
  title: string
  description?: string | null
  phone?: string | null
  latitude: number
  longitude: number
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}
  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseParams) {
    const gym = await this.gymsRepository.create({
      title,
      description: description || '',
      phone: phone || '',
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
