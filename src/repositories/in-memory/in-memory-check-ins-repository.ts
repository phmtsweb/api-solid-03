import {
  CheckIn,
  CheckInDTO,
  CheckInsRepository,
  FetchOptions,
  FindByUserIdOnDateParams,
} from '../interfaces/check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private readonly checkIns: CheckIn[] = []

  async findById(id: string): Promise<CheckIn | null> {
    return this.checkIns.find((checkIn) => checkIn.id === id) ?? null
  }

  async validateCheckIn(id: string): Promise<CheckIn | null> {
    const checkIn = await this.findById(id)

    if (!checkIn) {
      return null
    }

    checkIn.validated_at = new Date()

    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length
  }

  async fetchCheckInsByUserId(
    userId: string,
    { page, offset }: FetchOptions,
  ): Promise<CheckIn[]> {
    return this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .splice((page - 1) * offset, page * offset)
  }

  async findByUserIdOnDate({ userId, date }: FindByUserIdOnDateParams) {
    const checkInOnSameDate = this.checkIns.find(
      (checkIn) =>
        checkIn.user_id === userId &&
        checkIn.created_at.getDate() === date.getDate() &&
        checkIn.created_at.getMonth() === date.getMonth() &&
        checkIn.created_at.getFullYear() === date.getFullYear(),
    )

    return checkInOnSameDate || null
  }

  async create(data: CheckInDTO): Promise<CheckIn> {
    const checkIn = {
      ...data,
      id: String(this.checkIns.length + 1),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }
    this.checkIns.push(checkIn)
    return checkIn
  }
}
