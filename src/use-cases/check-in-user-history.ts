import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInUserHistoryUseCaseRequest {
  userId: string
  page: number
}

interface CheckInUserHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class CheckInUserHistoryUseCase {
  private checkInsRepository: CheckInsRepository
  constructor(checkInsRespository: CheckInsRepository) {
    this.checkInsRepository = checkInsRespository
  }

  async execute({
    userId,
    page,
  }: CheckInUserHistoryUseCaseRequest): Promise<CheckInUserHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
